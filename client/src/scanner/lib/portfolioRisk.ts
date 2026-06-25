/**
 * Portfolio Risk v4.0 — Katman 4: Beta-Weighted Delta, VaR, Greeks Limits, Stress Test
 * "Portföy ısısı %5'i geçerse sistem yeni işlem önermeyi durduracak."
 */

import type { PortfolioRisk, SectorExposure, StressTestResult, Greeks, BetaMatrix } from "./optionsTypes";
import { parametricVaR, historicalVaR, expectedShortfall, stressTestShock, calculateGreeksLimits, checkGreeksLimits, SHOCK_SCENARIOS } from "./varEngine";
import { type AppLanguage, copy } from "@/lib/i18n";

// ─── SEKTÖR BETA MATRİSİ ───

const BETA_MATRIX: Record<string, { sector: string; betaSPY: number; betaQQQ: number }> = {
  AAPL: { sector: "Technology", betaSPY: 1.20, betaQQQ: 1.15 },
  MSFT: { sector: "Technology", betaSPY: 1.15, betaQQQ: 1.10 },
  AMZN: { sector: "Consumer Cyclical", betaSPY: 1.25, betaQQQ: 1.20 },
  GOOGL: { sector: "Communication Services", betaSPY: 1.10, betaQQQ: 1.05 },
  META: { sector: "Communication Services", betaSPY: 1.30, betaQQQ: 1.25 },
  NVDA: { sector: "Technology", betaSPY: 1.80, betaQQQ: 1.75 },
  TSLA: { sector: "Consumer Cyclical", betaSPY: 2.00, betaQQQ: 1.90 },
  AVGO: { sector: "Technology", betaSPY: 1.40, betaQQQ: 1.35 },
  AMD: { sector: "Technology", betaSPY: 1.70, betaQQQ: 1.65 },
  INTC: { sector: "Technology", betaSPY: 1.10, betaQQQ: 1.05 },
  QCOM: { sector: "Technology", betaSPY: 1.25, betaQQQ: 1.20 },
  NFLX: { sector: "Communication Services", betaSPY: 1.15, betaQQQ: 1.10 },
  CCL: { sector: "Consumer Cyclical", betaSPY: 1.80, betaQQQ: 1.50 },
  SPCE: { sector: "Industrials", betaSPY: 1.50, betaQQQ: 1.30 },
  RDW: { sector: "Industrials", betaSPY: 1.30, betaQQQ: 1.20 },
  EDIT: { sector: "Healthcare", betaSPY: 1.60, betaQQQ: 1.40 },
  GE: { sector: "Industrials", betaSPY: 1.10, betaQQQ: 1.00 },
  GM: { sector: "Consumer Cyclical", betaSPY: 1.40, betaQQQ: 1.20 },
  F: { sector: "Consumer Cyclical", betaSPY: 1.50, betaQQQ: 1.30 },
  BA: { sector: "Industrials", betaSPY: 1.30, betaQQQ: 1.15 },
  JPM: { sector: "Financial Services", betaSPY: 1.10, betaQQQ: 0.90 },
  XOM: { sector: "Energy", betaSPY: 0.80, betaQQQ: 0.60 },
  JNJ: { sector: "Healthcare", betaSPY: 0.60, betaQQQ: 0.50 },
  KO: { sector: "Consumer Defensive", betaSPY: 0.50, betaQQQ: 0.40 },
  WMT: { sector: "Consumer Defensive", betaSPY: 0.40, betaQQQ: 0.30 },
};

export function getBeta(ticker: string): { sector: string; betaSPY: number; betaQQQ: number } {
  return BETA_MATRIX[ticker] || { sector: "Unknown", betaSPY: 1.0, betaQQQ: 1.0 };
}

// ─── BETA-WEIGHTED DELTA ───

export interface PositionForRisk {
  ticker: string;
  greeks: Greeks;
  notionalValue: number; // $ value of underlying exposure
  quantity: number;
}

/**
 * Beta-Weighted Delta = Position Delta × Stock Beta
 * Bu, portföyün SPY'ye karşı ne kadar exposed olduğunu gösterir.
 * +120 BWD = SPY %1 yükselirse portföy +$120 kazanır (≈ SPY'yi %1.2 long tutmak)
 */
export function calculateBetaWeightedDelta(positions: PositionForRisk[]): number {
  return positions.reduce((total, pos) => {
    const beta = getBeta(pos.ticker).betaSPY;
    return total + (pos.greeks.delta * pos.quantity * beta);
  }, 0);
}

// ─── SEKTÖR EXPOSURE ───

export function calculateSectorExposure(
  positions: PositionForRisk[],
  netLiquidationValue: number
): SectorExposure[] {
  const sectorMap: Record<string, { bwd: number; notional: number }> = {};

  for (const pos of positions) {
    const { sector } = getBeta(pos.ticker);
    const beta = getBeta(pos.ticker).betaSPY;
    const contribution = pos.greeks.delta * pos.quantity * beta;

    if (!sectorMap[sector]) sectorMap[sector] = { bwd: 0, notional: 0 };
    sectorMap[sector].bwd += contribution;
    sectorMap[sector].notional += Math.abs(pos.notionalValue);
  }

  return Object.entries(sectorMap).map(([sector, data]) => {
    const pct = (data.notional / netLiquidationValue) * 100;
    return {
      sector,
      betaWeightedDelta: Math.round(data.bwd * 100) / 100,
      notionalExposure: Math.round(data.notional),
      pctOfPortfolio: Math.round(pct * 10) / 10,
      warning: pct > 30,
    };
  });
}

// ─── KORELASYON UYARISI ───

export function correlationCheck(
  positions: PositionForRisk[],
  language: AppLanguage = "tr"
): string[] {
  const warnings: string[] = [];
  const sectors = positions.map((p) => getBeta(p.ticker).sector);

  // Count by sector
  const sectorCount: Record<string, number> = {};
  sectors.forEach((s) => { sectorCount[s] = (sectorCount[s] || 0) + 1; });

  // Check concentration
  const maxSector = Object.entries(sectorCount).sort((a, b) => b[1] - a[1])[0];
  if (maxSector && maxSector[1] >= 3) {
    warnings.push(copy(language,
    `🚨 ${maxSector[0]} sektöründe ${maxSector[1]} pozisyon → Tek sektöre %${(maxSector[1] / positions.length * 100).toFixed(0)} bet`,
    `🚨 ${maxSector[1]} positions in ${maxSector[0]} sector → %${(maxSector[1] / positions.length * 100).toFixed(0)} bet on single sector`
  ));
  }

  // Check tech concentration (common mistake)
  const techTickers = positions.filter((p) => getBeta(p.ticker).sector === "Technology");
  if (techTickers.length >= 3) {
    const names = techTickers.map((p) => p.ticker).join(", ");
    warnings.push(copy(language,
    `⚠️ Teknoloji bet'i: ${names} → SPY/Q düşerse hepsi zarar eder`,
    `⚠️ Tech bet: ${names} → All lose if SPY/Q drops`
  ));
  }

  // Check meme/high-beta concentration
  const highBeta = positions.filter((p) => getBeta(p.ticker).betaSPY > 1.5);
  if (highBeta.length >= 3) {
    warnings.push(copy(language,
    `⚠️ ${highBeta.length} yüksek beta hisse (β>1.5) → Piyasa düşerse amplifiye kayıp`,
    `⚠️ ${highBeta.length} high-beta stocks (β>1.5) → Amplified loss if market drops`
  ));
  }

  return warnings;
}

// ─── STRESS TEST ───

/**
 * Piyasa düşerken IV patlarsa ne olur?
 * Scenario: SPY -2% / VIX +30% (typical correction)
 */
export function stressTest(
  positions: PositionForRisk[],
  netLiquidationValue: number,
  scenario: { spyMove: number; vixMove: number } = { spyMove: -0.02, vixMove: 0.30 }
): StressTestResult {
  let totalPnL = 0;
  let maxLossTicker = "";
  let maxLossAmount = 0;

  for (const pos of positions) {
    const beta = getBeta(pos.ticker).betaSPY;
    // Delta P&L: Beta × SPY move × Delta exposure
    const deltaPnL = pos.greeks.delta * pos.quantity * (scenario.spyMove * 100);
    // Vega P&L: Vega × IV change (VIX move roughly = IV move)
    const vegaPnL = pos.greeks.vega * pos.quantity * (scenario.vixMove * 100);
    // Gamma P&L: 0.5 × Gamma × (move)² (second-order)
    const gammaPnL = 0.5 * pos.greeks.gamma * pos.quantity * Math.pow(scenario.spyMove * 100, 2);

    const positionPnL = deltaPnL + vegaPnL + gammaPnL;
    totalPnL += positionPnL;

    if (positionPnL < maxLossAmount) {
      maxLossAmount = positionPnL;
      maxLossTicker = pos.ticker;
    }
  }

  const pctOfNLV = (totalPnL / netLiquidationValue) * 100;
  const marginImpact = Math.abs(totalPnL) * 1.5; // Rough margin estimate

  return {
    scenario: `SPY ${(scenario.spyMove * 100).toFixed(0)}% / VIX +${(scenario.vixMove * 100).toFixed(0)}%`,
    portfolioPnL: Math.round(totalPnL * 100) / 100,
    portfolioPnLPct: Math.round(pctOfNLV * 100) / 100,
    maxLossTicker,
    marginImpact: Math.round(marginImpact),
    withinLimits: Math.abs(pctOfNLV) < 5, // <5% NLV acceptable
  };
}

/**
 * Multiple stress scenarios
 */
export function multiStressTest(
  positions: PositionForRisk[],
  netLiquidationValue: number
): StressTestResult[] {
  const scenarios = [
    { spyMove: -0.02, vixMove: 0.30, label: "Mild Correction" },
    { spyMove: -0.05, vixMove: 0.50, label: "Moderate Crash" },
    { spyMove: -0.10, vixMove: 0.80, label: "Severe Crash" },
    { spyMove: 0.02, vixMove: -0.20, label: "Rally (IV Crush)" },
  ];

  return scenarios.map((s) => stressTest(positions, netLiquidationValue, s));
}

// ─── PORTFÖY RİSK ÖZETİ ───

export function calculatePortfolioRisk(
  positions: PositionForRisk[],
  netLiquidationValue: number,
  language: AppLanguage = "tr"
): PortfolioRisk {
  const bwd = calculateBetaWeightedDelta(positions);
  const sectorExposures = calculateSectorExposure(positions, netLiquidationValue);
  const corrWarnings = correlationCheck(positions, language);
  const stress = stressTest(positions, netLiquidationValue);

  // Aggregate Greeks
  const totalTheta = positions.reduce((s, p) => s + p.greeks.theta * p.quantity, 0);
  const totalVega = positions.reduce((s, p) => s + p.greeks.vega * p.quantity, 0);
  const totalGamma = positions.reduce((s, p) => s + p.greeks.gamma * p.quantity, 0);

  // Max sector concentration
  const maxSector = Math.max(...sectorExposures.map((s) => s.pctOfPortfolio), 0);

  return {
    netLiquidationValue,
    betaWeightedDelta: Math.round(bwd * 100) / 100,
    totalTheta: Math.round(totalTheta * 100) / 100,
    totalVega: Math.round(totalVega * 100) / 100,
    totalGamma: Math.round(totalGamma * 100) / 100,
    sectorExposures,
    maxSectorConcentration: Math.round(maxSector),
    stressTest: stress,
    vegaLimit: Math.round(netLiquidationValue * 0.02 * 100) / 100,
    thetaTarget: Math.round(netLiquidationValue * 0.001 * 100) / 100,
    correlationWarnings: corrWarnings,
  };
}

// ─── BETA MATRİS RAPORU ───

export function getBetaMatrix(tickers: string[]): BetaMatrix[] {
  return tickers.map((t) => {
    const b = getBeta(t);
    return {
      ticker: t,
      sector: b.sector,
      betaToSPY: b.betaSPY,
      betaToQQQ: b.betaQQQ,
      betaToSector: 1.0, // Simplified
    };
  });
}

// ─── v4.0: PORTFÖY RİSKİ V2 (VaR + Greeks Limits + Şok Testleri) ───

export interface v4PortfolioRisk {
  // v3.0 metrikler
  netLiquidationValue: number;
  betaWeightedDelta: number;
  totalTheta: number;
  totalVega: number;
  totalGamma: number;
  sectorExposures: SectorExposure[];
  maxSectorConcentration: number;
  correlationWarnings: string[];
  // v4.0: VaR
  var99: { amount: number; percent: number };
  expectedShortfall: { amount: number; percent: number };
  // v4.0: Greeks limit kontrolü
  greeksStatus: { withinLimits: boolean; violations: string[] };
  // v4.0: Portföy ısısı
  heatPct: number;
  canTrade: boolean;
  // v4.0: Tarihsel şok testleri
  shockTests: { name: string; pnl: number; pnLPct: number }[];
}

/**
 * v4.0 Portföy Risk Özeti — Kurumsal seviye
 * VaR, Expected Shortfall, Greeks Limits, Portföy ısısı, Tarihsel şok testleri
 */
export function calculateV4PortfolioRisk(
  positions: PositionForRisk[],
  netLiquidationValue: number,
  historicalReturns: number[], // SPY günlük getiriler (decimal)
  language: AppLanguage = "tr"
): v4PortfolioRisk {
  // v3.0 temel metrikler
  const bwd = calculateBetaWeightedDelta(positions);
  const sectorExposures = calculateSectorExposure(positions, netLiquidationValue);
  const corrWarnings = correlationCheck(positions, language);

  // Aggregate Greeks
  const totalTheta = positions.reduce((s, p) => s + p.greeks.theta * p.quantity, 0);
  const totalVega = positions.reduce((s, p) => s + p.greeks.vega * p.quantity, 0);
  const totalGamma = positions.reduce((s, p) => s + p.greeks.gamma * p.quantity, 0);
  const totalDelta = positions.reduce((s, p) => s + p.greeks.delta * p.quantity, 0);

  // Max sector
  const maxSector = Math.max(...sectorExposures.map((s) => s.pctOfPortfolio), 0);

  // v4.0: VaR %99
  const varResult = historicalReturns.length > 0
    ? historicalVaR(netLiquidationValue, historicalReturns, 0.99)
    : parametricVaR(netLiquidationValue, 0.0005, 0.015, 0.99);

  // v4.0: Expected Shortfall
  const esResult = historicalReturns.length > 0
    ? expectedShortfall(netLiquidationValue, historicalReturns, 0.99)
    : { esAmount: Math.round(netLiquidationValue * 0.04), esPercent: 4.0, tailDays: 0, avgTailLoss: 0 };

  // v4.0: Greeks limit kontrolü
  const greeksLimits = calculateGreeksLimits(netLiquidationValue);
  const greeksStatus = checkGreeksLimits(
    { delta: totalDelta, gamma: totalGamma, theta: totalTheta, vega: totalVega },
    greeksLimits
  );

  // v4.0: Portföy ısısı (toplam max loss / NLV)
  const totalRisk = positions.reduce((s, p) => {
    const posRisk = Math.abs(p.greeks.delta * p.quantity * 0.02 * p.notionalValue);
    return s + posRisk;
  }, 0);
  const heatPct = Math.min(100, (totalRisk / netLiquidationValue) * 100);

  // v4.0: Tarihsel şok testleri
  const shockTests = SHOCK_SCENARIOS.slice(0, 3).map((sc) => {
    const result = stressTestShock(netLiquidationValue, bwd, totalVega, sc);
    return { name: sc.name, pnl: result.portfolioPnL, pnLPct: result.pnLPct };
  });

  return {
    netLiquidationValue,
    betaWeightedDelta: Math.round(bwd * 100) / 100,
    totalTheta: Math.round(totalTheta * 100) / 100,
    totalVega: Math.round(totalVega * 100) / 100,
    totalGamma: Math.round(totalGamma * 100) / 100,
    sectorExposures,
    maxSectorConcentration: Math.round(maxSector),
    correlationWarnings: corrWarnings,
    // v4.0
    var99: { amount: varResult.varAmount, percent: varResult.varPercent },
    expectedShortfall: { amount: esResult.esAmount, percent: esResult.esPercent },
    greeksStatus,
    heatPct: Math.round(heatPct * 10) / 10,
    canTrade: heatPct < 5.0 && greeksStatus.withinLimits,
    shockTests,
  };
}

// Re-export for convenience
export { parametricVaR, historicalVaR, expectedShortfall, stressTestShock, calculateGreeksLimits, checkGreeksLimits };
