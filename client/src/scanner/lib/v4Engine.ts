/**
 * v4.0 Prop Desk Motoru — Ana Sistem Motoru
 * v3'den geliştirilen özellikler:
 *  - Dinamik ağırlık (VIX rejimine göre)
 *  - Kelly sizing (edge-based pozisyon boyutu)
 *  - Volatility-Adjusted Momentum
 *  - Portföy ısısı kontrolü (%5 limit)
 *  - Execution disiplini (10:30 giriş, midpoint limit, slippage %5)
 */

import type { MarketRegime, IVCurve, SpreadMetrics } from "./optionsTypes";
import { getDynamicWeights, volatilityAdjustedScore, portfolioHeatCheck, type VixRegime } from "./scoreConfig";
import { detectMarketRegime, calculateIVCurve } from "./regimeDetector";
import { calculateExpectedMove, calculatePOP, calculateSpreadMetrics } from "./optionAnalytics";
import { kellySizing, createManagementRules, recommendedEntryWindow, estimateSlippage } from "./executionRules";
import { calculatePortfolioRisk, stressTest } from "./portfolioRisk";

// ─── v4.0: HİSSE SKORLAMA (Dinamik Ağırlık + Vol-Adjusted) ───

export interface v4StockScore {
  ticker: string;
  price: number;
  change: number;
  // Skorlar
  rawScore: number;        // Ham skor (dinamik ağırlıkla)
  adjustedScore: number;   // Volatilite-adjusted
  finalScore: number;      // RSI filtresi uygulanmış
  // Faktör skorları
  factorScores: Record<string, number>;
  // Rejim
  regime: MarketRegime;
  // IV
  ivRank: number;
  ivSignal: "SELL_PREMIUM" | "BUY_PREMIUM" | "NEUTRAL";
  // v4.0: Spread metrikleri (eğer varsa)
  spreadMetrics?: SpreadMetrics;
  // Sinyal
  signal: string;
  rsi14: number;
}

/**
 * v4.0 Momentum Skoru — Dinamik ağırlık + Volatility-Adjusted
 */
export function v4ScoreStock(
  ticker: string,
  price: number,
  change: number,
  rvol: number,
  rsi14: number,
  rsi7: number,
  atr14: number,
  structure: number,
  velDir: number,
  velVol: number,
  // Fiyat geçmişi (vol-adjusted için)
  closePrices: number[],
  highPrices: number[],
  lowPrices: number[],
  // VIX rejimi
  vixLevel: number = 20
): v4StockScore {
  // 1. Rejim tespiti
  const ivCurve = calculateIVCurve(ticker, price, closePrices, highPrices, lowPrices);
  const regime = detectMarketRegime([ivCurve]);
  const vixRegime: VixRegime = {
    level: vixLevel,
    label: regime.vixRegime as VixRegime["label"],
  };

  // 2. Dinamik ağırlıklar (v4.0)
  const weights = getDynamicWeights(vixRegime);

  // 3. Faktör skorları
  const rvolS = rvol >= 4 ? 100 : rvol >= 2 ? 50 + (rvol - 2) * 25 : rvol >= 1 ? 15 + (rvol - 1) * 35 : Math.max(0, rvol * 15);
  const gapS = change >= 1 && change <= 4 ? 80 + Math.min((4 - change) * 5, 20) : change > 4 && change <= 8 ? 70 - (change - 4) * 5 : change > 8 ? 40 : change > 0 && change < 1 ? 60 + (change - 0.5) * 40 : 15;
  const rsiBlend = rsi7 * 0.7 + (rsi14 || 50) * 0.3;
  const rsiS = rsiBlend >= 60 && rsiBlend < 75 ? 85 : rsiBlend >= 55 && rsiBlend < 60 ? 70 : rsiBlend >= 45 && rsiBlend < 55 ? 55 : rsiBlend >= 75 && rsiBlend <= 80 ? 60 : rsiBlend > 80 ? 30 : rsiBlend >= 35 && rsiBlend < 45 ? 40 : 25;
  const structS = structure;
  const pcS = change > 5 ? 100 : change > 3 ? 80 : change > 2 ? 60 : change > 1 ? 45 : change > 0 ? 30 : 10;
  const orbS = 50; // Basitleştirilmiş
  const vwapS = 50;
  const mktS = 60;

  // 4. Ham skor (dinamik ağırlıklarla)
  const factorScores: Record<string, number> = {
    rvol: Math.round(rvolS),
    gap: Math.round(gapS),
    orb: orbS,
    vwap: vwapS,
    structure: Math.round(structS),
    rsi_short: Math.round(rsiS),
    velocity_dir: Math.round(velDir),
    velocity_vol: Math.round(Math.min(100, velVol)),
    marketCap: mktS,
    retention: Math.round(pcS), // proxy
    price_change: Math.round(pcS),
  };

  const rawScore = (
    factorScores.rvol * (weights.rvol || 0.15) +
    factorScores.gap * (weights.gap || 0.10) +
    factorScores.orb * (weights.orb || 0.13) +
    factorScores.vwap * (weights.vwap || 0.13) +
    factorScores.structure * (weights.structure || 0.08) +
    factorScores.rsi_short * (weights.rsi_short || 0.10) +
    factorScores.velocity_dir * (weights.velocity_dir || 0.07) +
    factorScores.velocity_vol * (weights.velocity_vol || 0.03) +
    factorScores.marketCap * (weights.marketCap || 0.04) +
    factorScores.retention * (weights.retention || 0.08) +
    factorScores.price_change * (weights.price_change || 0.09)
  );

  // 5. Volatility-Adjusted (v4.0)
  const hv = closePrices.length >= 20
    ? Math.sqrt(closePrices.slice(-20).map((c, i, a) => i > 0 ? Math.log(c / a[i - 1]) : 0).filter((_, i) => i > 0).reduce((s, r) => s + r * r, 0) / 19 * 252)
    : 0.3;
  const adjustedScore = volatilityAdjustedScore(rawScore, atr14, price, hv * 100);

  // 6. RSI RED filtresi
  let finalScore = adjustedScore;
  let signal = "NEUTRAL";
  if (rsi14 >= 80) { finalScore = 0; signal = "OVERBOUGHT_RED"; }
  else if (rsi14 >= 75) { finalScore = Math.round(adjustedScore * 0.3); signal = "CAUTION_HOT"; }
  else if (rsi14 <= 25) { signal = "OVERSOLD"; }
  else if (adjustedScore >= 75) signal = "STRONG_BUY";
  else if (adjustedScore >= 60) signal = "BUY";
  else if (adjustedScore >= 45) signal = "NEUTRAL_BULLISH";

  // 7. IV Sinyali
  const ivSignal = ivCurve.iVRank > 70 && ivCurve.ivPremium > 3 ? "SELL_PREMIUM"
    : ivCurve.iVRank < 30 && ivCurve.ivPremium < -3 ? "BUY_PREMIUM"
    : "NEUTRAL";

  return {
    ticker, price, change,
    rawScore: Math.round(rawScore),
    adjustedScore,
    finalScore,
    factorScores,
    regime,
    ivRank: ivCurve.iVRank,
    ivSignal,
    signal,
    rsi14,
  };
}

// ─── v4.0: KURUMSAL SETUP ÜRETİCİ ───

export interface v4Setup {
  ticker: string;
  strategy: string;
  score: number;
  ivRank: number;
  // Spread
  shortStrike: number;
  longStrike: number;
  spreadWidth: number;
  credit: number;
  // Risk/Return
  pop: number;
  maxProfit: number;
  maxLoss: number;
  breakeven: number;
  rReturn: number;
  // Sizing
  kellyResult: {
    maxRiskDollars: number;
    contracts: number;
    perContractRisk: number;
    kellyFraction: number;
    note: string;
  };
  // Execution
  entryWindow: string;
  slippagePct: number;
  limitPrice: number;
  // Management
  profitTarget: number;
  stopLoss: number;
  dteRoll: number;
  // Expected Move
  expectedMove: number;
  // Neden
  rationale: string;
  ifFails: string;
}

export function v4GenerateSetup(
  stock: v4StockScore,
  closePrices: number[],
  highPrices: number[],
  lowPrices: number[],
  netLiquidationValue: number,
  vixLevel: number = 20
): v4Setup | null {
  // 1. Portföy ısısı kontrolü (geçici, gerçek değerler dışarıdan gelmeli)
  // 2. IV Curve
  const ivCurve = calculateIVCurve(stock.ticker, stock.price, closePrices, highPrices, lowPrices);
  const dte = Math.min(45, regimeDte(vixLevel));

  // 3. Spread tasarımı
  const otmPct = stock.rsi14 > 70 ? 0.08 : stock.rsi14 > 60 ? 0.06 : 0.05;
  const shortStrike = Math.round(stock.price * (1 - otmPct));
  const longStrike = Math.round(shortStrike * 0.92);
  const spreadWidth = shortStrike - longStrike;

  // 4. Spread metrikleri
  const metrics = calculateSpreadMetrics(ivCurve, shortStrike, longStrike, dte, true);

  // 5. Kelly sizing
  const kellyResult = kellySizing(
    metrics.pop.popPercent,
    metrics.maxProfit,
    metrics.maxLoss,
    netLiquidationValue,
    spreadWidth,
    stock.regime.sizingFactor
  );

  // 6. Execution
  const rec = recommendedEntryWindow("Bull Put Spread", 1.5);
  const slip = estimateSlippage(rec.window, 1.5, spreadWidth);

  // 7. Neden
  const ivAdj = stock.ivSignal === "SELL_PREMIUM" ? " (Premium satışı mantıklı — IV yüksek)" : "";
  const rationale = `Skor ${stock.finalScore}/100${ivAdj}. POP %${metrics.pop.popPercent}. Breakeven $${metrics.breakeven} (%${((metrics.breakeven / stock.price - 1) * 100).toFixed(1)} OTM).`;

  return {
    ticker: stock.ticker,
    strategy: "Bull Put Spread",
    score: stock.finalScore,
    ivRank: stock.ivRank,
    shortStrike,
    longStrike,
    spreadWidth,
    credit: metrics.netCredit,
    pop: metrics.pop.popPercent,
    maxProfit: metrics.maxProfit,
    maxLoss: metrics.maxLoss,
    breakeven: metrics.breakeven,
    rReturn: metrics.rReturn,
    kellyResult,
    entryWindow: rec.profile.label,
    slippagePct: slip.slippagePct,
    limitPrice: Math.round(metrics.netCredit * 0.85 * 100) / 100,
    profitTarget: metrics.management.profitTarget,
    stopLoss: metrics.management.stopLoss,
    dteRoll: metrics.management.dteRoll,
    expectedMove: metrics.expectedMove.moveDollars,
    rationale,
    ifFails: stock.regime.termStructure === "BACKWARDATION"
      ? "BACKWARDATION: IV patlaması + put skew artışı. Strike'a assignment riski yüksek."
      : "IV crush veya yön değişirse zarar. 2x kredi stop ile korun.",
  };
}

function regimeDte(vix: number): number {
  if (vix >= 35) return 30;
  if (vix >= 25) return 35;
  if (vix >= 16) return 45;
  return 45;
}

// ─── v4.0: MASTER RAPOR ───

export interface v4Report {
  version: "4.0";
  timestamp: string;
  // Rejim
  regime: MarketRegime;
  // Portföy sağlığı
  heatCheck: { canTrade: boolean; heatPct: number; message: string };
  // Tarama sonuçları
  stocks: v4StockScore[];
  // Kurulumlar
  setups: v4Setup[];
  // Execution disiplini
  executionRules: string[];
  // Kritik öncelikler
  priorities: string[];
}

export function generateV4Report(
  stocks: v4StockScore[],
  setups: v4Setup[],
  totalPortfolioRisk: number,
  netLiquidationValue: number,
  regime: MarketRegime
): v4Report {
  const heat = portfolioHeatCheck(totalPortfolioRisk, netLiquidationValue);

  const priorities: string[] = [];
  if (!heat.canTrade) priorities.push(`PORTFÖY ISI ${heat.heatPct}% ≥ %5 → Yeni işlem YASAK`);
  if (regime.termStructure === "BACKWARDATION") priorities.push("BACKWARDATION → Credit spread YASAK");
  if (regime.vixRegime === "EXTREME_FEAR") priorities.push(`VIX ${regime.vixLevel}: Premium zengini — disiplin ile fırsat`);

  return {
    version: "4.0",
    timestamp: new Date().toISOString(),
    regime,
    heatCheck: heat,
    stocks: stocks.sort((a, b) => b.finalScore - a.finalScore),
    setups: setups.sort((a, b) => b.score - a.score),
    executionRules: [
      "1. Midpoint limit emir (piyasa emiri YASAK)",
      "2. Slippage ≤%5 (üzerinde RED)",
      "3. Giriş: 10:30-11:30 EDT (OPTIMAL/MID penceresi)",
      "4. Kelly sizing: Edge'e göre, max NLV %2",
      "5. %50 kar al → yarısını kapat",
      "6. 21 DTE roll, 14 DTE time stop",
      "7. 2x kredi = stop loss",
      "8. Portföy ısısı %5 → yeni işlem DURUR",
    ],
    priorities,
  };
}
