/**
 * Options Strategy Engine v3.0 — Kurumsal Seviye
 * v2'den gelen: IV Proxy, ATR hedef, Earnings uyarısı
 * v3.0 eklenen: POP, Expected Move, Breakeven, Yönetim Kuralları, IV Eğrisi
 *
 * Artık sadece "güzel grafik" yok — "POP %72, EV +$45, Breakeven $43.35" var.
 */

import type { StockResult } from "../types";
import { type AppLanguage, t } from "@/lib/i18n";
import type { SpreadMetrics, PositionManagement, IVCurve, ExpectedMove } from "./optionsTypes";
import { calculateIVCurve, ivSignal } from "./regimeDetector";
import { calculateExpectedMove, calculateSpreadMetrics } from "./optionAnalytics";
import { createManagementRules, createExecutionPlan, calculatePositionSize } from "./executionRules";

// ─── STRATEJİ İSİM HELPER ───
export function getStrategyName(strategy: OptionStrategy, language: AppLanguage): string {
  return (language === "en" ? strategy.name : strategy.nameTr);
}

// ─── STRATEJİ TANIMLARI (v2'den korundu) ───

export interface OptionStrategy {
  name: string;
  nameTr: string;
  type: "BULLISH" | "BEARISH" | "NEUTRAL" | "VOLATILITY";
  riskLevel: "DÜŞÜK" | "ORTA" | "YÜKSEK";
  maxProfit: string;
  maxLoss: string;
  breakeven: string;
  setup: string;
  whenToUse: string[];
  pros: string[];
  cons: string[];
  premiumEstimate: string;
}

export interface StrategyRecommendation {
  ticker: string;
  currentPrice: number;
  confidence: string;
  primaryStrategy: OptionStrategy;
  alternativeStrategies: OptionStrategy[];
  entryNotes: string[];
  riskWarnings: string[];
  targetPrice: number;
  stopLossPrice: number;
  ivRank: number;
  ivRecommendation: string;
  earningsWarning: string | null;
  // ─── v3.0 EKLEMELER ───
  ivCurve?: IVCurve;               // Tam IV eğrisi (term structure + skew)
  expectedMove?: ExpectedMove;       // Expected Move ($ ve %)
  spreadMetrics?: SpreadMetrics;     // POP, Breakeven, Max Risk, R/R
  management?: PositionManagement;  // Giriş/çıkış kuralları
  execution?: {                     // Execution plan
    orderType: string;
    limitPrice: number;
    timing: string;
    slippageEstimate: number;
    notes: string[];
  };
  sizing?: {                        // Pozisyon boyutu (%2 NLV)
    maxRiskDollars: number;
    recommendedContracts: number;
    perContractRisk: number;
    note: string;
  };
}

const STRATEGIES: Record<string, OptionStrategy> = {
  long_call: {
    name: "Long Call",
    nameTr: "Uzun Call",
    type: "BULLISH",
    riskLevel: "YÜKSEK",
    maxProfit: "Sınırsız",
    maxLoss: "Ödenen prim",
    breakeven: "Strike + prim",
    setup: "ITM/ATM call alın",
    whenToUse: ["Güçlü yükseliş (>3%)", "Yüksek momentum", "Düşük IV (ucuz prim)"],
    pros: ["Sınırsız kazanç", "Basit", "Kaldıraç"],
    cons: ["Zaman aşımı", "Yüksek IV = pahalı prim", "Tek yönlü"],
    premiumEstimate: "~$2-5",
  },
  bull_call_spread: {
    name: "Bull Call Spread",
    nameTr: "Bull Call Spread",
    type: "BULLISH",
    riskLevel: "ORTA",
    maxProfit: "Spread - net prim",
    maxLoss: "Net prim",
    breakeven: "Alt strike + net prim",
    setup: "ATM call al, OTM call sat (1 strike yukarı)",
    whenToUse: ["Orta yükseliş (1-3%)", "Yüksek IV ortamında", "Prim maliyetini düşür"],
    pros: ["Düşük maliyet", "Risk sınırlı", "IV crush dostu"],
    cons: ["Kazanç sınırlı", "İki komisyon"],
    premiumEstimate: "~$1-3",
  },
  bull_put_spread: {
    name: "Bull Put Spread",
    nameTr: "Bull Put Spread",
    type: "BULLISH",
    riskLevel: "DÜŞÜK",
    maxProfit: "Net prim (kredi)",
    maxLoss: "Spread - net prim",
    breakeven: "Üst strike - net prim",
    setup: "OTM put sat, daha OTM put al",
    whenToUse: ["Hafif yükseliş/yatay", "Prim geliri", "Yüksek IV"],
    pros: ["Prim geliri", "Yüksek kazanma olasılığı", "IV crush'dan fayda"],
    cons: ["Sınırlı kazanç", "Margin gerekebilir"],
    premiumEstimate: "~$0.5-2 kredi",
  },
  long_straddle: {
    name: "Long Straddle",
    nameTr: "Long Straddle",
    type: "VOLATILITY",
    riskLevel: "YÜKSEK",
    maxProfit: "Sınırsız (her yön)",
    maxLoss: "Toplam prim",
    breakeven: "ATM ± toplam prim",
    setup: "Aynı strike'da call + put al",
    whenToUse: ["Büyük hareket bekleniyor", "Yön net değil", "Kazanç öncesi"],
    pros: ["Yön bağımsız", "Büyük hareketten fayda"],
    cons: ["Çift prim", "Zaman aşımı hızlı", "Çok büyük hareket şart"],
    premiumEstimate: "~$4-10",
  },
};

// ─── IV PROXY (v2'den) ───

function getIvStrategyAdjustment(ivRank: number, language: AppLanguage = "tr"): { strategy: string; note: string } {
  if (ivRank > 70) {
    return { strategy: "bull_call_spread", note: t("scanner:ivRankVeryHighSpread", { ivrank: ivRank }) };
  }
  if (ivRank > 50) {
    return { strategy: "bull_call_spread", note: t("scanner:ivRankHighReduceCost", { ivrank: ivRank }) };
  }
  if (ivRank < 30) {
    return { strategy: "long_call", note: t("scanner:ivRankLowLongCall", { ivrank: ivRank }) };
  }
  return { strategy: "bull_call_spread", note: t("scanner:ivRankNormalBalancedSpread", { ivrank: ivRank }) };
}

// ─── ANA FONKSİYON v3.0 ───

export function recommendStrategies(
  stock: StockResult,
  // v3.0: Fiyat geçmişi IV eğrisi için gerekli
  closePrices?: number[],
  highPrices?: number[],
  lowPrices?: number[],
  // v3.0: Portföy boyutu
  netLiquidationValue?: number,
  // v4.1: Vade kontrolü (days to expiration)
  daysToExpiration?: number,
  language: AppLanguage = "tr"
): StrategyRecommendation {
  const strategies: OptionStrategy[] = [];
  const entryNotes: string[] = [];
  const riskWarnings: string[] = [];

  // ─── v4.1: VADE KONTROLÜ (Eleştiri #11) ───
  let dteOverride = false;
  if (daysToExpiration !== undefined) {
    const dteCheck = checkDaysToExpiration(daysToExpiration, stock.signal, language);
    if (!dteCheck.allowed) {
      dteOverride = true;
      riskWarnings.push(dteCheck.warning || "Vade kontrolü engeli");
      riskWarnings.push("Yeni pozisyon AÇMA — Vade çok kısa");
    } else if (dteCheck.warning) {
      riskWarnings.push(dteCheck.warning);
    }
  }

  // ─── HEDEF / STOP (v2'den) ───
  const atrMult = stock.score >= 75 ? 2.0 : stock.score >= 55 ? 1.5 : 1.0;
  const targetPrice = Math.round((stock.currentPrice + stock.atr14d * atrMult) * 100) / 100;
  const stopLossPrice = Math.round((stock.currentPrice - stock.atr14d) * 100) / 100;

  const ivRank = stock.ivProxy || 50;
  const ivAdj = getIvStrategyAdjustment(ivRank, language);

  let confidence = "DÜŞÜK";
  if (stock.score >= 75) confidence = "YÜKSEK";
  else if (stock.score >= 55) confidence = "ORTA";

  // ─── v3.0: IV EĞRİSİ HESAPLA ───
  let ivCurve: IVCurve | undefined;
  if (closePrices && closePrices.length >= 20) {
    ivCurve = calculateIVCurve(
      stock.ticker,
      stock.currentPrice,
      closePrices,
      highPrices || closePrices.map((c) => c * 1.02),
      lowPrices || closePrices.map((c) => c * 0.98)
    );
  }

  // ─── v3.0: EXPECTED MOVE ───
  const dte = 30; // Varsayılan
  const expectedMove = ivCurve
    ? calculateExpectedMove(ivCurve, dte)
    : undefined;

  // ─── v3.0: SPREAD METRİKLERİ (konservatif varsayımlar) ───
  let spreadMetrics: SpreadMetrics | undefined;
  if (ivCurve) {
    const otmPct = stock.rsi > 70 ? 0.08 : stock.rsi > 60 ? 0.06 : 0.05;
    const shortStrike = Math.round(stock.currentPrice * (1 - otmPct));
    const longStrike = Math.round(shortStrike * 0.90);
    spreadMetrics = calculateSpreadMetrics(ivCurve, shortStrike, longStrike, dte, true);
  }

  // ─── v3.0: YÖNETİM KURALLARI ───
  let management: PositionManagement | undefined;
  if (spreadMetrics) {
    management = createManagementRules(
      spreadMetrics.netCredit,
      spreadMetrics.spreadWidth,
      dte,
      true // credit spread
    );
  }

  // ─── v3.0: POZİSYON BOYUTU ───
  let sizing: StrategyRecommendation["sizing"] | undefined;
  if (netLiquidationValue && spreadMetrics) {
    const sz = calculatePositionSize(netLiquidationValue, spreadMetrics.spreadWidth, spreadMetrics.netCredit, true);
    sizing = {
      maxRiskDollars: sz.maxRiskDollars,
      recommendedContracts: sz.contracts,
      perContractRisk: sz.perContractRisk,
      note: sz.note,
    };
  }

  // ─── STRATEJİ SEÇİMİ (v2'den geliştirildi) ───
  // v4.1: DTE override aktifse → BEKLE stratejisi
  let primary: OptionStrategy;

  if (dteOverride) {
    primary = {
      name: "BEKLE",
      nameTr: "BEKLE — Vade Uygun Değil",
      type: "NEUTRAL",
      riskLevel: "YÜKSEK",
      maxProfit: "0",
      maxLoss: "0",
      breakeven: "-",
      setup: t("scanner:openNewPosition"),
      whenToUse: [t("scanner:expirationTooShort")],
      pros: [t("scanner:noRisk")],
      cons: [t("scanner:noProfit")],
      premiumEstimate: "$0",
    };
    entryNotes.push(t("scanner:strategyRecommendationRedDueTo"));
    entryNotes.push(t("scanner:dteDaysMinimum3Days", { daystoexpiration: daysToExpiration }));

  } else if (stock.score >= 75 && stock.volumeRatio >= 2 && stock.rsi > 50 && stock.rsi < 80) {
    primary = ivRank > 50 ? STRATEGIES.bull_call_spread : STRATEGIES.long_call;
    entryNotes.push(t("scanner:strongMomentumSignal"));
    entryNotes.push(ivAdj.note);
    entryNotes.push(t("scanner:targetAtr", { targetprice: targetPrice, atrmult: atrMult }));
    entryNotes.push(t("scanner:stopAtr1", { stoplossprice: stopLossPrice }));

    // v3.0: Expected Move ekle
    if (expectedMove) {
      entryNotes.push(`Expected Move (${dte}D): $${expectedMove.moveDollars.toFixed(2)} (%${expectedMove.movePercent.toFixed(1)})`);
      riskWarnings.push(expectedMove.movePercent > 8
        ? t("scanner:expectedMoveVeryHighReduce", { tofixed1: expectedMove.movePercent.toFixed(1) })
        : t("scanner:expectedMoveAcceptableRange", { tofixed1: expectedMove.movePercent.toFixed(1) })
      );
    }

    // v3.0: POP ekle
    if (spreadMetrics) {
      entryNotes.push(t("scanner:popMaxRiskCredit", { poppercent: spreadMetrics.pop.popPercent, maxloss: spreadMetrics.maxLoss, netcredit: spreadMetrics.netCredit }));
      entryNotes.push(`Breakeven: $${spreadMetrics.breakeven} | R/R: ${spreadMetrics.rReturn.toFixed(2)}`);
    }

    riskWarnings.push(ivRank > 70 ? t("scanner:ivVeryHighSpreadRequired") : t("scanner:highLeverageRisk"));

  } else if (stock.score >= 55 && stock.vwapDeviation > 0) {
    primary = STRATEGIES.bull_call_spread;
    entryNotes.push(t("scanner:mediumMomentumProtectiveStrategy"));
    entryNotes.push(ivAdj.note);
  } else if (stock.volumeRatio >= 3 && Math.abs(stock.priceChangePct) > 2) {
    primary = STRATEGIES.long_straddle;
    entryNotes.push(t("scanner:highVolatilityDirectionIndependent"));
    riskWarnings.push(t("scanner:doublePremiumCost"));
  } else {
    primary = STRATEGIES.bull_put_spread;
    entryNotes.push(t("scanner:lowConfidenceConservative"));
    entryNotes.push(t("scanner:watchFirstWaitForConfirmation"));
  }

  // Alternatifler (DTE override durumunda ekleme)
  if (!dteOverride) {
    if (primary !== STRATEGIES.bull_call_spread) strategies.push(STRATEGIES.bull_call_spread);
    if (primary !== STRATEGIES.bull_put_spread) strategies.push(STRATEGIES.bull_put_spread);
    if (primary !== STRATEGIES.long_straddle && stock.volumeRatio >= 2.5) strategies.push(STRATEGIES.long_straddle);
  }

  // RSI RED filtresi (v4.1)
  if (stock.rsi > 80) {
    riskWarnings.push(t("scanner:rsiOverbought80DoNot"));
    riskWarnings.push(t("scanner:rsiRedFilterActiveScore"));
  } else if (stock.rsi > 75) {
    riskWarnings.push(t("scanner:rsiHotZone7580"));
  }

  // Earnings
  const earningsWarn = stock.earningsWarning || null;
  if (earningsWarn) {
    riskWarnings.push(earningsWarn);
    riskWarnings.push(t("scanner:ivCrushMayOccurAfter"));
  }

  // v3.0: IV sinyali
  if (ivCurve) {
    const ivSig = ivSignal(ivCurve.iVRank, ivCurve.ivPremium);
    const ivLabel = ivSig.signal === "SELL_PREMIUM" ? t("scanner:premiumSale") : ivSig.signal === "BUY_PREMIUM" ? t("scanner:premiumPurchase") : t("common:neutral0964");
    const ivNote = ivSig.signal === "SELL_PREMIUM" ? t("scanner:ivHighCreditSpreadMakes") : ivSig.signal === "BUY_PREMIUM" ? t("scanner:ivLowLongPremiumMakes") : t("scanner:ivAverage");
    riskWarnings.push(`${ivLabel}: ${ivNote}`);

    // Term structure uyarısı
    if (ivCurve.termShape === "BACKWARDATION") {
      riskWarnings.push(t("scanner:backwardationMarketInPanicMode"));
      riskWarnings.push(t("scanner:recommendationLongPremiumPutCall"));
    }
  }

  // IV recommendation text
  const ivRecText = ivRank > 70
    ? t("scanner:ivRankHighSpreadInstead", { ivrank: ivRank })
    : ivRank < 30
    ? t("scanner:ivRankLowLongCall4835", { ivrank: ivRank })
    : t("scanner:ivRankNormalStandardStrategies", { ivrank: ivRank });

  // ─── v3.0: EXECUTION PLANI ───
  let execution: StrategyRecommendation["execution"] | undefined;
  if (spreadMetrics) {
    const execPlan = createExecutionPlan(stock.ticker, primary.name, spreadMetrics.netCredit, spreadMetrics.spreadWidth, true);
    execution = {
      orderType: execPlan.orderType,
      limitPrice: execPlan.limitPrice,
      timing: execPlan.timing,
      slippageEstimate: execPlan.slippageEstimate,
      notes: execPlan.notes,
    };
  }

  return {
    ticker: stock.ticker,
    currentPrice: stock.currentPrice,
    confidence,
    primaryStrategy: primary,
    alternativeStrategies: strategies,
    entryNotes,
    riskWarnings,
    targetPrice,
    stopLossPrice,
    ivRank: Math.round(ivRank),
    ivRecommendation: ivRecText,
    earningsWarning: earningsWarn,
    // v3.0 eklemeler
    ivCurve,
    expectedMove,
    spreadMetrics,
    management,
    execution,
    sizing,
  };
}

// ─── VADE KONTROLÜ (Eleştiri #11) ───

export function checkDaysToExpiration(daysToExpiration: number, signal: string, language: AppLanguage = "tr"): {
  allowed: boolean;
  warning: string | null;
  maxDte: number;
} {
  if (daysToExpiration < 3) {
    return {
      allowed: false,
      warning: t("scanner:onlyDaysLeftThetaDecay", { daystoexpiration: daysToExpiration }),
      maxDte: daysToExpiration,
    };
  }
  if (daysToExpiration < 7) {
    return {
      allowed: signal === "OVERBOUGHT_RED" || signal === "CAUTION_HOT" ? false : true,
      warning: t("scanner:onlyDaysLeftLastWeek", { daystoexpiration: daysToExpiration }),
      maxDte: 7,
    };
  }
  if (daysToExpiration < 14) {
    return {
      allowed: true,
      warning: t("scanner:daysLeft14DteTime", { daystoexpiration: daysToExpiration }),
      maxDte: 14,
    };
  }
  return { allowed: true, warning: null, maxDte: daysToExpiration };
}

// ─── STRADDLE FİYATINDAN EXPECTED MOVE TAHMİNİ ───

export function expectedMoveFromStraddle(straddlePrice: number, underlyingPrice: number): {
  moveDollars: number;
  movePercent: number;
} {
  // Expected Move ≈ 0.85 × Straddle Price
  const move = straddlePrice * 0.85;
  return {
    moveDollars: Math.round(move * 100) / 100,
    movePercent: Math.round((move / underlyingPrice) * 100 * 10) / 10,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// v4.2: ÇİFT YÖNLÜ STRATEJİ ÜRETİCİ
// Hem CALL hem PUT analizi — PDT persistence dahil
// ═══════════════════════════════════════════════════════════════════════════════

import type { BiDirectionalSetup, OptionSetup, T1SuitabilityResult } from "../types";

/**
 * Çift yönlü strateji: Hem CALL hem PUT setup'ı üretir.
 * PDT persistence skoruna göre T+1 uygunluğu belirler.
 */
export function recommendBiDirectionalStrategies(
  stock: StockResult,
  daysToExpiration: number,
  persistenceScore: number,
  bearScore: number,
  language: AppLanguage = "tr",
): BiDirectionalSetup {

  const callSetup = buildCallSetup(stock, daysToExpiration, language);
  const putSetup = buildPutSetup(stock, bearScore, daysToExpiration, language);

  const pdtSuitable = persistenceScore >= 65;
  const recommendation = decidePrimaryDirection(stock.score, bearScore, persistenceScore);

  return {
    call: callSetup,
    put: putSetup,
    pdtPersistenceScore: persistenceScore,
    pdtSuitable,
    recommendation,
  };
}

function buildCallSetup(stock: StockResult, dte: number, language: AppLanguage = "tr"): OptionSetup {
  // DTE kontrolü
  if (dte < 3) return { signal: "AVOID", strategy: "AVOID", strike: 0, dte, otmPct: 0, reason: t("scanner:dte3ThetaDecayMaximum") };
  if (dte < 7 && stock.rsi >= 80) return { signal: "AVOID", strategy: "AVOID", strike: 0, dte, otmPct: 0, reason: "DTE < 7 + RSI > 80" };

  const otmPct = stock.rsi > 70 ? 0.08 : 0.05;
  const strike = Math.round(stock.currentPrice * (1 + otmPct) / 5) * 5;

  if (stock.score >= 75 && stock.volumeRatio >= 2 && stock.rsi >= 50 && stock.rsi < 80) {
    return {
      signal: "STRONG_BUY",
      strategy: "Long Call",
      strike, dte, otmPct,
      pop: stock.ivProxy ? Math.min(65, stock.ivProxy) : 55,
      kellySize: `NLV %${Math.min(2.0, stock.score / 50).toFixed(1)}`,
      targetMove: `+${(otmPct * 100).toFixed(1)}%`,
      riskReward: "1:2.5",
      maxLoss: t("scanner:premiumPaid"),
      takeProfit: t("scanner:50PremiumIncrease"),
      stopCondition: t("scanner:50PremiumDecayStop"),
      entryCondition: t("scanner:aboveVwapAboveConfirmation", { currentprice: stock.currentPrice }),
      pdtNote: t("scanner:pdtSuitableFor1Day"),
    };
  } else if (stock.score >= 55 && stock.vwapDeviation > 0) {
    return {
      signal: "BUY",
      strategy: "Bull Call Spread",
      strike, dte, otmPct,
      pop: stock.ivProxy ? Math.min(60, stock.ivProxy - 5) : 50,
      kellySize: `NLV %${Math.min(1.5, stock.score / 60).toFixed(1)}`,
      targetMove: `+${(otmPct * 100).toFixed(1)}%`,
      riskReward: "1:2.0",
      maxLoss: t("scanner:netPremiumLimited"),
      takeProfit: t("scanner:50SpreadValue"),
      stopCondition: t("scanner:2xPremiumStop"),
      entryCondition: t("scanner:aboveVwapAbove", { currentprice: stock.currentPrice }),
      pdtNote: t("scanner:pdtRiskLimitedWithSpread"),
    };
  } else {
    return {
      signal: "NEUTRAL",
      strategy: "Bull Put Spread",
      strike, dte, otmPct,
      pop: 45,
      kellySize: "NLV %0.5",
      targetMove: "+2%",
      riskReward: "1:1.5",
      maxLoss: t("scanner:netPremiumLimited"),
      takeProfit: t("scanner:50Premium"),
      stopCondition: t("scanner:2xPremiumStop"),
      entryCondition: t("scanner:conservativeEntry"),
      pdtNote: t("scanner:pdtConservativeSpreadLowRisk"),
    };
  }
}

function buildPutSetup(stock: StockResult, bearScore: number, dte: number, language: AppLanguage = "tr"): OptionSetup {
  // DTE kontrolü — put için de zorunlu
  if (dte < 3) return { signal: "AVOID", strategy: "AVOID", strike: 0, dte, otmPct: 0, reason: t("scanner:dte3ThetaDecayMaximum") };
  if (dte < 7 && stock.rsi <= 25) return { signal: "AVOID", strategy: "AVOID", strike: 0, dte, otmPct: 0, reason: t("scanner:dte7Rsi25Mean") };

  // RSI aşırı satım uyarısı
  if (stock.rsi <= 20) return { signal: "AVOID", strategy: "AVOID", strike: 0, dte, otmPct: 0, reason: t("scanner:rsi20OversoldHighMean") };

  const otmPct = stock.rsi < 30 ? 0.08 : 0.05;
  const strike = Math.round(stock.currentPrice * (1 - otmPct) / 5) * 5;

  if (bearScore >= 75 && stock.volumeRatio >= 2 && stock.rsi <= 50) {
    return {
      signal: "STRONG_BUY",
      strategy: "Long Put",
      strike, dte, otmPct,
      pop: stock.ivProxy ? Math.min(65, stock.ivProxy) : 55,
      kellySize: `NLV %${Math.min(2.0, bearScore / 50).toFixed(1)}`,
      targetMove: `-${(otmPct * 100).toFixed(1)}%`,
      riskReward: "1:2.5",
      maxLoss: t("scanner:premiumPaid"),
      takeProfit: t("scanner:50PremiumIncrease"),
      stopCondition: t("scanner:50PremiumDecayStop"),
      entryCondition: t("scanner:belowVwapBelowConfirmation", { currentprice: stock.currentPrice }),
      pdtNote: t("scanner:pdtSuitableFor1Day08bc"),
    };
  } else if (bearScore >= 55 && stock.vwapDeviation < 0) {
    return {
      signal: "BUY",
      strategy: "Bear Put Spread",
      strike, dte, otmPct,
      pop: stock.ivProxy ? Math.min(60, stock.ivProxy - 5) : 50,
      kellySize: `NLV %${Math.min(1.5, bearScore / 60).toFixed(1)}`,
      targetMove: `-${(otmPct * 100).toFixed(1)}%`,
      riskReward: "1:2.0",
      maxLoss: t("scanner:netPremiumLimited"),
      takeProfit: t("scanner:50SpreadValue"),
      stopCondition: t("scanner:2xPremiumStop"),
      entryCondition: t("scanner:belowVwapBelow", { currentprice: stock.currentPrice }),
      pdtNote: t("scanner:pdtRiskLimitedWithSpread"),
    };
  } else {
    return {
      signal: "NEUTRAL",
      strategy: "Bear Call Spread",
      strike, dte, otmPct,
      pop: 45,
      kellySize: "NLV %0.5",
      targetMove: "-2%",
      riskReward: "1:1.5",
      maxLoss: t("scanner:netPremiumLimited"),
      takeProfit: t("scanner:50Premium"),
      stopCondition: t("scanner:2xPremiumStop"),
      entryCondition: t("scanner:conservativeEntry"),
      pdtNote: t("scanner:pdtConservativeSpreadLowRisk"),
    };
  }
}

function decidePrimaryDirection(
  bullScore: number,
  bearScore: number,
  persistence: number,
): string {
  const gap = Math.abs(bullScore - bearScore);

  if (gap < 15) return "STRADDLE";
  if (bullScore > bearScore && persistence >= 65) return "CALL_PRIMARY";
  if (bearScore > bullScore && persistence >= 65) return "PUT_PRIMARY";
  return "WAIT";
}

/**
 * T+1 uygunluk kontrolü — earnings + RSI + persistence
 */
export function isT1Suitable(
  stock: StockResult,
  persistenceScore: number,
  daysToEarnings: number | null,
): T1SuitabilityResult {

  const reasons: string[] = [];
  let suitable = true;

  if (persistenceScore < 65) {
    suitable = false;
    reasons.push(`Persistence skoru düşük: ${persistenceScore}/100`);
  }
  if (daysToEarnings !== null && daysToEarnings <= 5) {
    suitable = false;
    reasons.push(`Earnings ${daysToEarnings} gün içinde — gap riski`);
  }
  if (stock.rsi >= 80 || stock.rsi <= 20) {
    suitable = false;
    reasons.push(`RSI aşırı bölgede (${stock.rsi.toFixed(1)}) — mean reversion riski`);
  }

  return { suitable, reasons, score: persistenceScore, warnings: [] };
}
