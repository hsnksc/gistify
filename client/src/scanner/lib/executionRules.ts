/**
 * Execution Rules v3.0 — Kurumsal Giriş/Çıkış Disiplini
 * "Kurumsal trader girişi değil çıkışı yönetir."
 *
 * Kurallar:
 *  - %50 kâr al (Tastytrade kuralı)
 *  - 21 DTE roll
 *  - 2x credit stop loss
 *  - Limit emir, midpoint giriş
 *  - %2 NLV max risk per trade
 */

import { type AppLanguage, t } from "@/lib/i18n";
import type { PositionManagement, ManagementAction, ExecutionPlan } from "./optionsTypes";

// ─── POZİSYON BOYUTU: KELLY SİZİNG (v4.0) ───
// v3: Sabit %2 | v4.0: Edge'e göre Kelly %25, ASLA %2'yi geçmez

export interface SizingResult {
  maxRiskDollars: number;      // NLV × dynamic%
  contracts: number;           // Kaç contract
  perContractRisk: number;     // $ risk per contract
  kellyFraction: number;       // Kullanılan Kelly oranı
  note: string;
}

/**
 * Kelly Criterion sizing:
 * K% = (Win% × AvgWin - Loss% × AvgLoss) / AvgWin
 * Pratik: K% ≈ POP/100 - (1 - POP/100) × (MaxLoss/MaxProfit)
 * 
 * v4.0: Kelly'nin sadece %25'ini kullan (Fraksiyonel Kelly)
 * Hard cap: NLV'nin %2'si ASLA geçilmez
 */
export function kellySizing(
  popPercent: number,          // Probability of Profit (0-100)
  maxProfit: number,           // $ max profit per spread
  maxLoss: number,             // $ max loss per spread
  netLiquidationValue: number, // Account NLV
  spreadWidth: number,         // Spread width
  regimeMultiplier: number = 1.0, // VIX regime sizing factor
  language: AppLanguage = "tr"
): SizingResult {
  // Kelly fraction
  const winProb = popPercent / 100;
  const lossProb = 1 - winProb;
  const avgWin = maxProfit;
  const avgLoss = maxLoss;

  // Kelly % = (W×avgWin - L×avgLoss) / avgWin
  const kellyPct = avgWin > 0
    ? Math.max(0, (winProb * avgWin - lossProb * avgLoss) / avgWin)
    : 0;

  // Fraksiyonel Kelly (%25) + regime sizing
  const fractionalKelly = kellyPct * 0.25 * regimeMultiplier;

  // Risk as NLV % (Kelly-based)
  const kellyRiskNlv = Math.min(0.02, fractionalKelly); // HARD CAP %2

  // Max risk in $
  const maxRisk = netLiquidationValue * kellyRiskNlv;
  const perContractRisk = maxLoss;

  const contracts = perContractRisk > 0
    ? Math.floor(maxRisk / perContractRisk)
    : 0;

  return {
    maxRiskDollars: Math.round(maxRisk * 100) / 100,
    contracts: Math.max(1, contracts),
    perContractRisk: Math.round(perContractRisk * 100) / 100,
    kellyFraction: Math.round(fractionalKelly * 1000) / 10, // as %
    note: t("scanner:kelly25FractionXRegime", { tofixed1: (kellyPct * 100).toFixed(1), regimemultiplier: regimeMultiplier, tofixed2: (fractionalKelly * 100).toFixed(2), roundMaxrisk: Math.round(maxRisk), max1Contracts: Math.max(1, contracts) }),
  };
}

// ─── LEGACY: v3.0 sabit %2 sizing (geriye uyumlu) ───
export function calculatePositionSize(
  netLiquidationValue: number,
  spreadWidth: number,
  credit: number,
  isCreditSpread: boolean = true,
  language: AppLanguage = "tr"
): SizingResult {
  const maxRisk = netLiquidationValue * 0.02; // %2 kuralı
  const perContractRisk = isCreditSpread
    ? spreadWidth - credit
    : spreadWidth;

  const contracts = perContractRisk > 0
    ? Math.floor(maxRisk / perContractRisk)
    : 0;

  return {
    maxRiskDollars: Math.round(maxRisk * 100) / 100,
    contracts: Math.max(1, contracts),
    perContractRisk: Math.round(perContractRisk * 100) / 100,
    kellyFraction: 50, // %50 Kelly = ~%2 NLV (legacy)
    note: t("scanner:nlv2MaxRiskContract", { netliquidationvalue: netLiquidationValue, roundMaxrisk: Math.round(maxRisk), max1Contracts: Math.max(1, contracts), roundPercontractrisk: Math.round(perContractRisk) }),
  };
}

// ─── YÖNETİM KURALLARI ÜRETİCİ ───

export function createManagementRules(
  credit: number,
  spreadWidth: number,
  dte: number,
  isCreditSpread: boolean = true,
  language: AppLanguage = "tr"
): PositionManagement {
  const maxProfit = credit;
  const maxLoss = isCreditSpread ? spreadWidth - credit : spreadWidth;

  // Kurumsal kurallar
  const profit50Pct = Math.round(maxProfit * 0.5 * 100) / 100;   // %50 kâr al
  const stop2xCredit = Math.round(maxLoss * 100) / 100;          // 2x credit = max loss
  const dteRoll = 21;
  const timeStop = 14;

  const actions: ManagementAction[] = [
    {
      trigger: t("scanner:profit50", { profit50pct: profit50Pct }),
      action: t("scanner:takeProfitClose50Of"),
      priority: 1,
    },
    {
      trigger: t("scanner:loss2xCredit", { stop2xcredit: stop2xCredit }),
      action: t("scanner:closeFullyClosePositionLimit"),
      priority: 1,
    },
    {
      trigger: t("scanner:dteDays", { dteroll: dteRoll }),
      action: t("scanner:rollRollToNextMonth"),
      priority: 2,
    },
    {
      trigger: t("scanner:dteDaysLastResort", { timestop: timeStop }),
      action: t("scanner:closeTimeRiskTooHigh"),
      priority: 3,
    },
    {
      trigger: t("scanner:ifUnderlyingTouchesShortStrike"),
      action: t("scanner:adjustWidenStrikesOrClose"),
      priority: 2,
    },
  ];

  return {
    entryRules: [
      t("scanner:ivRank50CreditSpread"),
      t("scanner:dte3045DaysOptimal"),
      "Expected Move < Spread Width",
      "Liquidity: Bid-Ask spread < %5",
      t("scanner:positionSizeMustNotExceed"),
    ],
    profitTarget: 50,
    profitTargetDollar: profit50Pct,
    stopLoss: 200, // 2x credit as %
    stopLossDollar: stop2xCredit,
    dteRoll,
    timeStop,
    orderType: "LIMIT",
    slippageMax: 5, // %5 max slippage
    actions,
  };
}

// ─── v4.0: EXECUTION DİSİPLİNİ ───
// Piyasa açılışında market emir = slippage %15+
// Kurallar: Midpoint limit, slippage %5 max, 10:30 giriş, 15:30 çıkış

/** Execution penceresi türleri */
export type ExecutionWindow = "OPEN_930" | "EARLY_1000" | "OPTIMAL_1030" | "MID_1100" | "NOON_1200" | "AFTERNOON_1400" | "CLOSE_1530";

interface WindowProfile {
  label: string;
  slippagePct: number;
  fillProb: number;
  volatility: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  allowed: boolean;
  reason: string;
}

function getWindowProfiles(language: AppLanguage = "tr"): Record<ExecutionWindow, WindowProfile> {
  return {
    OPEN_930:    { label: t("scanner:0930Open"), slippagePct: 15, fillProb: 70, volatility: "EXTREME", allowed: false, reason: t("scanner:slippage15MarketOrderBanned") },
    EARLY_1000:  { label: t("scanner:1000Early"), slippagePct: 8, fillProb: 80, volatility: "HIGH", allowed: false, reason: t("scanner:volatilityHighPriceNotSettled") },
    OPTIMAL_1030:{ label: "10:30 Optimal", slippagePct: 3, fillProb: 90, volatility: "MEDIUM", allowed: true, reason: t("scanner:liquidityPeakPriceSettled") },
    MID_1100:    { label: t("scanner:1100GoldenHour"), slippagePct: 2, fillProb: 95, volatility: "LOW", allowed: true, reason: t("scanner:bestLiquidityLowestSlippage") },
    NOON_1200:   { label: t("scanner:1200Noon"), slippagePct: 4, fillProb: 85, volatility: "LOW", allowed: true, reason: t("scanner:lunchFadeRiskStrategyDependent") },
    AFTERNOON_1400:{ label: t("scanner:1400Afternoon"), slippagePct: 5, fillProb: 82, volatility: "MEDIUM", allowed: true, reason: t("scanner:prePowerHourPreparation") },
    CLOSE_1530:  { label: t("scanner:1530Close"), slippagePct: 12, fillProb: 75, volatility: "HIGH", allowed: false, reason: t("scanner:mocOrdersSlippage10") },
  };
}

/** Slippage tahmini: Midpoint'ten ne kadar sapma olur? */
export function estimateSlippage(
  window: ExecutionWindow,
  rvol: number,
  spreadWidth: number,
  language: AppLanguage = "tr"
): { slippageDollars: number; slippagePct: number; isAcceptable: boolean } {
  const profile = getWindowProfiles(language)[window];
  // RVOL adjustment: yüksek hacim = daha az slippage
  const rvolAdj = Math.max(0.3, Math.min(1.5, 1.0 / Math.max(rvol * 0.5, 0.3)));
  const estSlipPct = profile.slippagePct * rvolAdj;
  const estSlip$ = (estSlipPct / 100) * spreadWidth;

  return {
    slippageDollars: Math.round(estSlip$ * 100) / 100,
    slippagePct: Math.round(estSlipPct * 10) / 10,
    isAcceptable: estSlipPct <= 5.0, // v4.0: %5 slippage max
  };
}

/** v4.0: Giriş saati önerisi */
export function recommendedEntryWindow(
  strategy: string,
  rvol: number,
  language: AppLanguage = "tr"
): { window: ExecutionWindow; profile: WindowProfile; slippage: ReturnType<typeof estimateSlippage> } {
  // Varsayılan: 10:30-11:30 en güvenli
  let win: ExecutionWindow = "OPTIMAL_1030";
  if (strategy.includes("0DTE")) win = "OPTIMAL_1030";
  else if (rvol > 3) win = "OPTIMAL_1030"; // Yüksek hacim = erken girilebilir
  else if (rvol < 1) win = "MID_1100";     // Düşük hacim = bekleyin

  const profiles = getWindowProfiles(language);
  return {
    window: win,
    profile: profiles[win],
    slippage: estimateSlippage(win, rvol, 5, language), // default width
  };
}

// ─── v3.0: EXECUTION PLANI (güncellendi v4.0 ile) ───

export function createExecutionPlan(
  symbol: string,
  strategy: string,
  credit: number,
  spreadWidth: number,
  isOpening: boolean = true,
  language: AppLanguage = "tr"
): ExecutionPlan {
  const naturalPrice = credit;
  const midPrice = Math.round(credit * 0.85 * 100) / 100;

  // v4.0: Execution disiplini
  const rec = recommendedEntryWindow(strategy, 1.5, language);
  const slip = estimateSlippage(rec.window, 1.5, spreadWidth, language);

  // v4.0: Slippage %5 kuralı
  const effectiveSlippage = slip.slippagePct;
  const isSafe = slip.isAcceptable;

  return {
    symbol,
    strategy,
    orderType: "MIDPOINT",
    limitPrice: midPrice,
    midPrice,
    slippageEstimate: effectiveSlippage,
    fillProbability: rec.profile.fillProb,
    timing: rec.window,
    notes: [
      t("scanner:v40LimitOrderMidpoint", { midprice: midPrice }),
      (language === "en" ? `Slippage: %${effectiveSlippage} ${isSafe ? "✅ ≤%5 acceptable" : "❌ >%5 RED"}` : `Slippage: %${effectiveSlippage} ${isSafe ? "✅ ≤%5 kabul" : "❌ >%5 RED"}`),
      t("scanner:highVolatilityDirectionIndependent", { fillprob: rec.profile.fillProb, label: rec.profile.label }),
      isOpening
        ? t("scanner:0930OpenAbsolutelyNo")
        : t("scanner:1530CloseNoMarket"),
      t("scanner:v40RuleMidpointLimit", { label: rec.profile.label }),
    ],
  };
}

// ─── POZİSYON AKSİYON MOTORU ───

export interface ActionResult {
  action: string;
  reason: string;
  urgency: "CRITICAL" | "WARNING" | "INFO";
  details: string[];
}

export function determineAction(
  pnlPct: number,
  dte: number,
  credit: number,
  spreadWidth: number,
  underlyingPrice: number,
  shortStrike: number,
  ivRank: number,
  language: AppLanguage = "tr"
): ActionResult {
  const details: string[] = [];

  // 1. Kâr hedefi (%50)
  if (pnlPct >= 50) {
    details.push(t("scanner:profit50Target", { roundPnlpct: Math.round(pnlPct) }));
    details.push(t("scanner:creditGain", { credit, roundCreditPnlpct100100100: Math.round(credit * pnlPct / 100 * 100)/100 }));
    return {
      action: t("scanner:takeProfitClose50Of1cba"),
      reason: t("scanner:institutionalRuleCloseAt50"),
      urgency: "INFO",
      details,
    };
  }

  // 2. Stop loss (2x credit loss = -200% of credit)
  if (pnlPct <= -200) {
    details.push(t("scanner:loss2002xCredit", { roundPnlpct: Math.round(pnlPct) }));
    return {
      action: t("scanner:closePositionLossLimitExceeded"),
      reason: (language === "en" ? "2x credit rule: Max loss $" + Math.round(spreadWidth * 100) / 100 : "2x kredi kuralı: Max zarar $" + Math.round(spreadWidth * 100) / 100),
      urgency: "CRITICAL",
      details,
    };
  }

  // 3. 21 DTE Roll
  if (dte <= 21 && dte > 14) {
    details.push(t("scanner:dteDaysLeft", { dte }));
    return {
      action: t("scanner:considerRollMoveToNext"),
      reason: t("scanner:21DteRuleThetaDecay"),
      urgency: "WARNING",
      details,
    };
  }

  // 4. 14 DTE Time Stop
  if (dte <= 14) {
    details.push(t("scanner:dteDaysTimeRiskVery", { dte }));
    return {
      action: t("scanner:closeExpirationApproaching"),
      reason: t("scanner:14DteLastResortRule"),
      urgency: "CRITICAL",
      details,
    };
  }

  // 5. Short strike test
  const distanceToShort = Math.abs(underlyingPrice - shortStrike) / underlyingPrice * 100;
  if (distanceToShort < 2) {
    details.push((language === "en" ? `Spot $${underlyingPrice} %${distanceToShort.toFixed(1)} close to short strike $${shortStrike}` : `Spot $${underlyingPrice} short strike $${shortStrike}'e %${distanceToShort.toFixed(1)} yakın`));
    return {
      action: t("scanner:considerHedgeTooCloseTo"),
      reason: t("scanner:pinRiskIncreasingWidenStrikes"),
      urgency: "WARNING",
      details,
    };
  }

  // 6. IV değişimi
  if (ivRank < 30 && pnlPct < 0) {
    details.push(t("scanner:ivRankVeryLowIv", { ivrank: ivRank }));
    return {
      action: t("scanner:acceptLossCloseBeforeIv"),
      reason: t("scanner:inLowIvEnvironmentLoss"),
      urgency: "WARNING",
      details,
    };
  }

  // Default: tut
  details.push(t("scanner:dteDaysPL", { dte, roundPnlpct: Math.round(pnlPct) }));
  details.push(t("scanner:distanceToShortStrike", { tofixed1: distanceToShort.toFixed(1) }));
  return {
    action: t("scanner:holdNoActionNeededYet"),
    reason: t("scanner:allManagementRulesWithinLimits"),
    urgency: "INFO",
    details,
  };
}

// ─── LIQUIDITY CHECK ───

export function liquidityCheck(
  bidAskSpread: number,
  openInterest: number,
  volume: number,
  language: AppLanguage = "tr"
): { pass: boolean; issues: string[] } {
  const issues: string[] = [];

  if (bidAskSpread > 0.10) {
    issues.push(t("scanner:bidAskSpread010", { bidaskspread: bidAskSpread }));
  }
  if (openInterest < 100) {
    issues.push(t("scanner:openInterest100LiquidityLow", { openinterest: openInterest }));
  }
  if (volume < 10) {
    issues.push(t("scanner:orbBreakout", { volume }));
  }

  return {
    pass: issues.length === 0,
    issues,
  };
}

// ─── RISK NOTIFICATIONS ───

export function riskNotification(
  netLiquidationValue: number,
  totalPortfolioRisk: number,
  totalVega: number,
  sectorConcentration: number,
  language: AppLanguage = "tr"
): string[] {
  const notifications: string[] = [];

  const riskPct = (totalPortfolioRisk / netLiquidationValue) * 100;

  if (riskPct > 10) {
    notifications.push(t("scanner:totalRiskOfNlv10", { roundTotalportfoliorisk: Math.round(totalPortfolioRisk), tofixed1: riskPct.toFixed(1) }));
  } else if (riskPct > 7) {
    notifications.push(t("scanner:totalRiskOfNlvCaution", { roundTotalportfoliorisk: Math.round(totalPortfolioRisk), tofixed1: riskPct.toFixed(1) }));
  }

  const vegaLimit = netLiquidationValue * 0.02;
  if (Math.abs(totalVega) > vegaLimit) {
    notifications.push(t("scanner:totalVegaLimitTooSensitive", { roundTotalvega: Math.round(totalVega), roundVegalimit: Math.round(vegaLimit) }));
  }

  if (sectorConcentration > 30) {
    notifications.push(t("scanner:sectorConcentration30YouRe", { tofixed0: sectorConcentration.toFixed(0) }));
  } else if (sectorConcentration > 25) {
    notifications.push(t("scanner:sectorConcentrationDiversify", { tofixed0: sectorConcentration.toFixed(0) }));
  }

  return notifications;
}

// ═══════════════════════════════════════════════════════════════════════════════
// v4.2: PDT (Pattern Day Trader) UYUMLU EXECUTION KURALLARI
// T+1: Pozisyon en az 1 gün elde tutma zorunluluğu
// ═══════════════════════════════════════════════════════════════════════════════

import type { T1SuitabilityResult } from "../types";
import type { StockResult } from "../types";

export const PDT_EXECUTION_RULES = {
  // T+1 için giriş penceresi: 10:00-10:30 ideal
  // Ek kural: 15:00'den sonra yeni giriş yapma (ertesi gün açılışta spread genişler)
  entryDeadline: "15:00",

  // T+1 çıkış stratejisi
  t1Exit: {
    // Açılışta %50 kar varsa hemen çık
    earlyProfitTarget: 0.50,
    // Gap up sonrası ilk 30 dk içinde VWAP kırılırsa çık
    vwapBreakStop: true,
    // Ertesi gün 14:00'a kadar pozisyon kapat (theta)
    latestExit: "14:00",
  },

  // Gecelik ek risk yönetimi
  overnightRisk: {
    // Earnings 5 gün içindeyse pozisyon alma
    maxDaysToEarnings: 5,
    // Pozisyon başına max kayıp
    maxLossPerPosition: 0.02, // NLV %2
  },
};

/**
 * T+1 uygunluk kontrolü
 * Earnings + RSI + persistence birlikte değerlendirilir
 */
export function isT1Suitable(
  stock: StockResult,
  persistenceScore: number,
  daysToEarnings: number | null,
  language: AppLanguage = "tr"
): T1SuitabilityResult {

  const reasons: string[] = [];
  let suitable = true;

  if (persistenceScore < 65) {
    suitable = false;
    reasons.push(t("scanner:persistenceScoreLow100", { persistencescore: persistenceScore }));
  }
  if (daysToEarnings !== null && daysToEarnings <= 5) {
    suitable = false;
    reasons.push(t("scanner:earningsInDaysGapRisk", { daystoearnings: daysToEarnings }));
  }
  if (stock.rsi >= 80 || stock.rsi <= 20) {
    suitable = false;
    reasons.push(t("scanner:rsiExtremeZoneMeanReversion", { tofixed1: stock.rsi.toFixed(1) }));
  }

  return { suitable, reasons, score: persistenceScore, warnings: [] };
}
