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

import { copy, type AppLanguage } from "@/lib/i18n";
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
    note: copy(language, `Kelly %${(kellyPct * 100).toFixed(1)} × %25 fraksiyon × ${regimeMultiplier}x rejim = %${(fractionalKelly * 100).toFixed(2)} | Sınır %2 = $${Math.round(maxRisk)} | ${Math.max(1, contracts)} kontrat`, `Kelly %${(kellyPct * 100).toFixed(1)} × %25 fraction × ${regimeMultiplier}x regime = %${(fractionalKelly * 100).toFixed(2)} | Cap %2 = $${Math.round(maxRisk)} | ${Math.max(1, contracts)} contract`),
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
    note: copy(language, `NLV $${netLiquidationValue} × %2 = $${Math.round(maxRisk)} maks risk. ${Math.max(1, contracts)} kontrat @ $${Math.round(perContractRisk)}/risk.`, `NLV $${netLiquidationValue} × %2 = $${Math.round(maxRisk)} max risk. ${Math.max(1, contracts)} contract @ $${Math.round(perContractRisk)}/risk.`),
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
      trigger: copy(language, `Kâr >= %50 ($${profit50Pct})`, `Profit >= %50 ($${profit50Pct})`),
      action: copy(language, "TAKE_PROFİT: Pozisyonun %50'sini kapat, gerisini stop ile takip", "TAKE_PROFIT: Close 50% of position, trail rest with stop"),
      priority: 1,
    },
    {
      trigger: copy(language, `Zarar >= 2x kredi ($${stop2xCredit})`, `Loss >= 2x credit ($${stop2xCredit})`),
      action: copy(language, "CLOSE: Pozisyonu tamamen kapat, zararı sınırla", "CLOSE: Fully close position, limit loss"),
      priority: 1,
    },
    {
      trigger: copy(language, `DTE <= ${dteRoll} gün`, `DTE <= ${dteRoll} days`),
      action: copy(language, "ROLL: Sonraki aya aynı striplere taşı veya kapat", "ROLL: Roll to next month same strikes or close"),
      priority: 2,
    },
    {
      trigger: copy(language, `DTE <= ${timeStop} gün (son çare)`, `DTE <= ${timeStop} days (last resort)`),
      action: copy(language, "CLOSE: Vade riski çok yüksek, pozisyonu kapat", "CLOSE: Time risk too high, close position"),
      priority: 3,
    },
    {
      trigger: copy(language, "Underlying short strike'a dokunursa", "If underlying touches short strike"),
      action: copy(language, "ADJUST: Strike'leri uzaklaştır veya pozisyonu kapat", "ADJUST: Widen strikes or close position"),
      priority: 2,
    },
  ];

  return {
    entryRules: [
      copy(language, "IV Rank >= 50 (credit spread) veya <= 30 (long premium)", "IV Rank >= 50 (credit spread) or <= 30 (long premium)"),
      copy(language, "DTE 30-45 gün (optimal theta decay zone)", "DTE 30-45 days (optimal theta decay zone)"),
      copy(language, "Expected Move < Spread Width", "Expected Move < Spread Width"),
      copy(language, "Liquidity: Bid-Ask spread < %5", "Liquidity: Bid-Ask spread < %5"),
      copy(language, "Pozisyon büyüklüğü NLV'nin %2'sini aşmasın", "Position size must not exceed %2 of NLV"),
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
    OPEN_930:    { label: copy(language, "09:30 Açılış", "09:30 Open"), slippagePct: 15, fillProb: 70, volatility: "EXTREME", allowed: false, reason: copy(language, "Slippage %15+ — Market emir YASAK", "Slippage %15+ — Market order BANNED") },
    EARLY_1000:  { label: copy(language, "10:00 Erken", "10:00 Early"), slippagePct: 8, fillProb: 80, volatility: "HIGH", allowed: false, reason: copy(language, "Volatilite yüksek, fiyat henüz yerleşmedi", "Volatility high, price not settled yet") },
    OPTIMAL_1030:{ label: copy(language, "10:30 Optimal", "10:30 Optimal"), slippagePct: 3, fillProb: 90, volatility: "MEDIUM", allowed: true, reason: copy(language, "Likidite zirvesi, fiyat yerleşti", "Liquidity peak, price settled") },
    MID_1100:    { label: copy(language, "11:00 Altın Saat", "11:00 Golden Hour"), slippagePct: 2, fillProb: 95, volatility: "LOW", allowed: true, reason: copy(language, "En iyi likidite + en düşük slippage", "Best liquidity + lowest slippage") },
    NOON_1200:   { label: copy(language, "12:00 Öğlen", "12:00 Noon"), slippagePct: 4, fillProb: 85, volatility: "LOW", allowed: true, reason: copy(language, "Lunch fade riski — stratejiye bağlı", "Lunch fade risk — strategy dependent") },
    AFTERNOON_1400:{ label: copy(language, "14:00 Öğleden Sonra", "14:00 Afternoon"), slippagePct: 5, fillProb: 82, volatility: "MEDIUM", allowed: true, reason: copy(language, "Power Hour öncesi hazırlık", "Pre-Power Hour preparation") },
    CLOSE_1530:  { label: copy(language, "15:30 Kapanış", "15:30 Close"), slippagePct: 12, fillProb: 75, volatility: "HIGH", allowed: false, reason: copy(language, "MOC emirleri, slippage %10+", "MOC orders, slippage %10+") },
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
      copy(language, `v4.0 Limit emir: $${midPrice} (midpoint)`, `v4.0 Limit order: $${midPrice} (midpoint)`),
      copy(language, `Slippage: %${effectiveSlippage} ${isSafe ? "✅ ≤%5 kabul" : "❌ >%5 RED"}`, `Slippage: %${effectiveSlippage} ${isSafe ? "✅ ≤%5 acceptable" : "❌ >%5 RED"}`),
      copy(language, `Fill: %${rec.profile.fillProb} | Pencere: ${rec.profile.label}`, `Fill: %${rec.profile.fillProb} | Window: ${rec.profile.label}`),
      isOpening
        ? copy(language, "09:30 AÇILIŞTA market emir KESİNLİKLE yok — slippage %15+", "09:30 OPEN absolutely NO market order — slippage %15+")
        : copy(language, "15:30 KAPANIŞTA market emir yok — MOC riski", "15:30 CLOSE no market order — MOC risk"),
      copy(language, `v4.0 Kural: Midpoint limit + Slippage ≤%5 + ${rec.profile.label} penceresi`, `v4.0 Rule: Midpoint limit + Slippage ≤%5 + ${rec.profile.label} window`),
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
    details.push(copy(language, `Kâr %${Math.round(pnlPct)} ≥ %50 hedef`, `Profit %${Math.round(pnlPct)} ≥ %50 target`));
    details.push(copy(language, `Kredi: $${credit}, Kazanç: $${Math.round(credit * pnlPct / 100 * 100)/100}`, `Credit: $${credit}, Gain: $${Math.round(credit * pnlPct / 100 * 100)/100}`));
    return {
      action: copy(language, "KÂR REALİZE ET — Pozisyonun %50'sini kapat", "TAKE PROFIT — Close 50% of position"),
      reason: copy(language, "Kurumsal kural: %50 kârda kapanır. Gerçekleşmiş kâr > beklenen kâr.", "Institutional rule: Close at %50 profit. Realized profit > expected profit."),
      urgency: "INFO",
      details,
    };
  }

  // 2. Stop loss (2x credit loss = -200% of credit)
  if (pnlPct <= -200) {
    details.push(copy(language, `Zarar %${Math.round(pnlPct)} ≤ -%200 (2x kredi)`, `Loss %${Math.round(pnlPct)} ≤ -%200 (2x credit)`));
    return {
      action: copy(language, "POZİSYONU KAPAT — Zarar limit aşıldı", "CLOSE POSITION — Loss limit exceeded"),
      reason: copy(language, "2x kredi kuralı: Max zarar $" + Math.round(spreadWidth * 100) / 100, "2x credit rule: Max loss $" + Math.round(spreadWidth * 100) / 100),
      urgency: "CRITICAL",
      details,
    };
  }

  // 3. 21 DTE Roll
  if (dte <= 21 && dte > 14) {
    details.push(copy(language, `DTE: ${dte} gün kaldı`, `DTE: ${dte} days left`));
    return {
      action: copy(language, "ROLL DÜŞÜN — Sonraki aya taşı veya kapat", "CONSIDER ROLL — Move to next month or close"),
      reason: copy(language, "21 DTE kuralı: Theta decay hızlanıyor, gamma riski artıyor.", "21 DTE rule: Theta decay accelerating, gamma risk increasing."),
      urgency: "WARNING",
      details,
    };
  }

  // 4. 14 DTE Time Stop
  if (dte <= 14) {
    details.push(copy(language, `DTE: ${dte} gün — VADE RİSKİ ÇOK YÜKSEK`, `DTE: ${dte} days — TIME RISK VERY HIGH`));
    return {
      action: copy(language, "KAPAT — Vade sonu yaklaştı", "CLOSE — Expiration approaching"),
      reason: copy(language, "14 DTE son çare kuralı: Assignment riski, gamma riski çok yüksek.", "14 DTE last resort rule: Assignment risk, gamma risk very high."),
      urgency: "CRITICAL",
      details,
    };
  }

  // 5. Short strike test
  const distanceToShort = Math.abs(underlyingPrice - shortStrike) / underlyingPrice * 100;
  if (distanceToShort < 2) {
    details.push(copy(language, `Spot $${underlyingPrice} short strike $${shortStrike}'e %${distanceToShort.toFixed(1)} yakın`, `Spot $${underlyingPrice} %${distanceToShort.toFixed(1)} close to short strike $${shortStrike}`));
    return {
      action: copy(language, "HEDGE DÜŞÜN — Strike'a çok yaklaşıldı", "CONSIDER HEDGE — Too close to strike"),
      reason: copy(language, "Pin riski artıyor. Strike'leri uzaklaştır veya pozisyonu kapat.", "Pin risk increasing. Widen strikes or close position."),
      urgency: "WARNING",
      details,
    };
  }

  // 6. IV değişimi
  if (ivRank < 30 && pnlPct < 0) {
    details.push(copy(language, `IV Rank ${ivRank} çok düşük, IV crush devam ediyor`, `IV Rank ${ivRank} very low, IV crush continuing`));
    return {
      action: copy(language, "ZARARI KABUL ET — IV crush bitmeden kapat", "ACCEPT LOSS — Close before IV crush ends"),
      reason: copy(language, "Düşük IV ortamında zarar büyüyebilir. Kuralsız beklemek riskli.", "In low IV environment loss can grow. Waiting without rules is risky."),
      urgency: "WARNING",
      details,
    };
  }

  // Default: tut
  details.push(copy(language, `DTE: ${dte} gün | Kâr/Zarar: %${Math.round(pnlPct)}`, `DTE: ${dte} days | P/L: %${Math.round(pnlPct)}`));
  details.push(copy(language, `Short strike'a mesafe: %${distanceToShort.toFixed(1)}`, `Distance to short strike: %${distanceToShort.toFixed(1)}`));
  return {
    action: copy(language, "TUT — Henüz aksiyon gerekmez", "HOLD — No action needed yet"),
    reason: copy(language, "Tüm yönetim kuralları içinde. Takibe devam.", "All management rules within limits. Continue monitoring."),
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
    issues.push(copy(language, `Bid-Ask spread $${bidAskSpread} > $0.10 — Slipaj riski yüksek`, `Bid-Ask spread $${bidAskSpread} > $0.10 — Slippage risk high`));
  }
  if (openInterest < 100) {
    issues.push(copy(language, `Open Interest ${openInterest} < 100 — Likidite düşük`, `Open Interest ${openInterest} < 100 — Liquidity low`));
  }
  if (volume < 10) {
    issues.push(copy(language, `Volume ${volume} < 10 — Çıkış zor olabilir`, `Volume ${volume} < 10 — Exit may be difficult`));
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
    notifications.push(copy(language, `🚨 Toplam risk $${Math.round(totalPortfolioRisk)} (NLV'nin %${riskPct.toFixed(1)}'i) > %10 limit!`, `🚨 Total risk $${Math.round(totalPortfolioRisk)} (%${riskPct.toFixed(1)} of NLV) > %10 limit!`));
  } else if (riskPct > 7) {
    notifications.push(copy(language, `⚠️ Toplam risk $${Math.round(totalPortfolioRisk)} (NLV'nin %${riskPct.toFixed(1)}'i) — Dikkat`, `⚠️ Total risk $${Math.round(totalPortfolioRisk)} (%${riskPct.toFixed(1)} of NLV) — Caution`));
  }

  const vegaLimit = netLiquidationValue * 0.02;
  if (Math.abs(totalVega) > vegaLimit) {
    notifications.push(copy(language, `⚠️ Total Vega $${Math.round(totalVega)} > limit $${Math.round(vegaLimit)} → IV hareketine aşırı duyarlı`, `⚠️ Total Vega $${Math.round(totalVega)} > limit $${Math.round(vegaLimit)} → Too sensitive to IV movement`));
  }

  if (sectorConcentration > 30) {
    notifications.push(copy(language, `🚨 Sektör konsantrasyonu %${sectorConcentration.toFixed(0)} > %30 → Tek sektöre bet yapıyorsun!`, `🚨 Sector concentration %${sectorConcentration.toFixed(0)} > %30 → You're betting on one sector!`));
  } else if (sectorConcentration > 25) {
    notifications.push(copy(language, `⚠️ Sektör konsantrasyonu %${sectorConcentration.toFixed(0)} — Çeşitlendir`, `⚠️ Sector concentration %${sectorConcentration.toFixed(0)} — Diversify`));
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
    reasons.push(copy(language, `Persistence skoru düşük: ${persistenceScore}/100`, `Persistence score low: ${persistenceScore}/100`));
  }
  if (daysToEarnings !== null && daysToEarnings <= 5) {
    suitable = false;
    reasons.push(copy(language, `Earnings ${daysToEarnings} gün içinde — gap riski`, `Earnings in ${daysToEarnings} days — gap risk`));
  }
  if (stock.rsi >= 80 || stock.rsi <= 20) {
    suitable = false;
    reasons.push(copy(language, `RSI aşırı bölgede (${stock.rsi.toFixed(1)}) — mean reversion riski`, `RSI extreme zone (${stock.rsi.toFixed(1)}) — mean reversion risk`));
  }

  return { suitable, reasons, score: persistenceScore, warnings: [] };
}
