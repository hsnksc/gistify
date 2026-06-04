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

import type { PositionManagement, ManagementAction, ExecutionPlan } from "@/types/options";

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
  regimeMultiplier: number = 1.0 // VIX regime sizing factor
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
    note: `Kelly %${(kellyPct * 100).toFixed(1)} × %25 fraction × ${regimeMultiplier}x regime = %${(fractionalKelly * 100).toFixed(2)} | Cap %2 = $${Math.round(maxRisk)} | ${Math.max(1, contracts)} contract`,
  };
}

// ─── LEGACY: v3.0 sabit %2 sizing (geriye uyumlu) ───
export function calculatePositionSize(
  netLiquidationValue: number,
  spreadWidth: number,
  credit: number,
  isCreditSpread: boolean = true
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
    note: `NLV $${netLiquidationValue} × %2 = $${Math.round(maxRisk)} max risk. ${Math.max(1, contracts)} contract @ $${Math.round(perContractRisk)}/risk.`,
  };
}

// ─── YÖNETİM KURALLARI ÜRETİCİ ───

export function createManagementRules(
  credit: number,
  spreadWidth: number,
  dte: number,
  isCreditSpread: boolean = true
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
      trigger: `Kâr >= %50 ($${profit50Pct})`,
      action: "TAKE_PROFİT: Pozisyonun %50'sini kapat, gerisini stop ile takip",
      priority: 1,
    },
    {
      trigger: `Zarar >= 2x kredi ($${stop2xCredit})`,
      action: "CLOSE: Pozisyonu tamamen kapat, zararı sınırla",
      priority: 1,
    },
    {
      trigger: `DTE <= ${dteRoll} gün`,
      action: "ROLL: Sonraki aya aynı striplere taşı veya kapat",
      priority: 2,
    },
    {
      trigger: `DTE <= ${timeStop} gün (son çare)`,
      action: "CLOSE: Vade riski çok yüksek, pozisyonu kapat",
      priority: 3,
    },
    {
      trigger: `Underlying short strike'a dokunursa`,
      action: "ADJUST: Strike'leri uzaklaştır veya pozisyonu kapat",
      priority: 2,
    },
  ];

  return {
    entryRules: [
      "IV Rank >= 50 (credit spread) veya <= 30 (long premium)",
      "DTE 30-45 gün (optimal theta decay zone)",
      "Expected Move < Spread Width",
      "Liquidity: Bid-Ask spread < %5",
      "Pozisyon büyüklüğü NLV'nin %2'sini aşmasın",
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

const WINDOW_PROFILES: Record<ExecutionWindow, WindowProfile> = {
  OPEN_930:    { label: "09:30 Açılış", slippagePct: 15, fillProb: 70, volatility: "EXTREME", allowed: false, reason: "Slippage %15+ — Market emir YASAK" },
  EARLY_1000:  { label: "10:00 Erken", slippagePct: 8, fillProb: 80, volatility: "HIGH", allowed: false, reason: "Volatilite yüksek, fiyat henüz yerleşmedi" },
  OPTIMAL_1030:{ label: "10:30 Optimal", slippagePct: 3, fillProb: 90, volatility: "MEDIUM", allowed: true, reason: "Likidite zirvesi, fiyat yerleşti" },
  MID_1100:    { label: "11:00 Altın Saat", slippagePct: 2, fillProb: 95, volatility: "LOW", allowed: true, reason: "En iyi likidite + en düşük slippage" },
  NOON_1200:   { label: "12:00 Öğlen", slippagePct: 4, fillProb: 85, volatility: "LOW", allowed: true, reason: "Lunch fade riski — stratejiye bağlı" },
  AFTERNOON_1400:{ label: "14:00 Öğleden Sonra", slippagePct: 5, fillProb: 82, volatility: "MEDIUM", allowed: true, reason: "Power Hour öncesi hazırlık" },
  CLOSE_1530:  { label: "15:30 Kapanış", slippagePct: 12, fillProb: 75, volatility: "HIGH", allowed: false, reason: "MOC emirleri, slippage %10+" },
};

/** Slippage tahmini: Midpoint'ten ne kadar sapma olur? */
export function estimateSlippage(
  window: ExecutionWindow,
  rvol: number,
  spreadWidth: number
): { slippageDollars: number; slippagePct: number; isAcceptable: boolean } {
  const profile = WINDOW_PROFILES[window];
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
  rvol: number
): { window: ExecutionWindow; profile: WindowProfile; slippage: ReturnType<typeof estimateSlippage> } {
  // Varsayılan: 10:30-11:30 en güvenli
  let win: ExecutionWindow = "OPTIMAL_1030";
  if (strategy.includes("0DTE")) win = "OPTIMAL_1030";
  else if (rvol > 3) win = "OPTIMAL_1030"; // Yüksek hacim = erken girilebilir
  else if (rvol < 1) win = "MID_1100";     // Düşük hacim = bekleyin

  return {
    window: win,
    profile: WINDOW_PROFILES[win],
    slippage: estimateSlippage(win, rvol, 5), // default width
  };
}

// ─── v3.0: EXECUTION PLANI (güncellendi v4.0 ile) ───

export function createExecutionPlan(
  symbol: string,
  strategy: string,
  credit: number,
  spreadWidth: number,
  isOpening: boolean = true
): ExecutionPlan {
  const naturalPrice = credit;
  const midPrice = Math.round(credit * 0.85 * 100) / 100;

  // v4.0: Execution disiplini
  const rec = recommendedEntryWindow(strategy, 1.5);
  const slip = estimateSlippage(rec.window, 1.5, spreadWidth);

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
      `v4.0 Limit emir: $${midPrice} (midpoint)`,
      `Slippage: %${effectiveSlippage} ${isSafe ? "✅ ≤%5 kabul" : "❌ >%5 RED"}`,
      `Fill: %${rec.profile.fillProb} | Pencere: ${rec.profile.label}`,
      isOpening
        ? "09:30 AÇILIŞTA market emir KESİNLİKLE yok — slippage %15+"
        : "15:30 KAPANIŞTA market emir yok — MOC riski",
      `v4.0 Kural: Midpoint limit + Slippage ≤%5 + ${rec.profile.label} penceresi`,
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
  ivRank: number
): ActionResult {
  const details: string[] = [];

  // 1. Kâr hedefi (%50)
  if (pnlPct >= 50) {
    details.push(`Kâr %${Math.round(pnlPct)} ≥ %50 hedef`);
    details.push(`Kredi: $${credit}, Kazanç: $${Math.round(credit * pnlPct / 100 * 100)/100}`);
    return {
      action: "KÂR REALİZE ET — Pozisyonun %50'sini kapat",
      reason: "Kurumsal kural: %50 kârda kapanır. Gerçekleşmiş kâr > beklenen kâr.",
      urgency: "INFO",
      details,
    };
  }

  // 2. Stop loss (2x credit loss = -200% of credit)
  if (pnlPct <= -200) {
    details.push(`Zarar %${Math.round(pnlPct)} ≤ -%200 (2x kredi)`);
    return {
      action: "POZİSYONU KAPAT — Zarar limit aşıldı",
      reason: "2x kredi kuralı: Max zarar $" + Math.round(spreadWidth * 100) / 100,
      urgency: "CRITICAL",
      details,
    };
  }

  // 3. 21 DTE Roll
  if (dte <= 21 && dte > 14) {
    details.push(`DTE: ${dte} gün kaldı`);
    return {
      action: "ROLL DÜŞÜN — Sonraki aya taşı veya kapat",
      reason: "21 DTE kuralı: Theta decay hızlanıyor, gamma riski artıyor.",
      urgency: "WARNING",
      details,
    };
  }

  // 4. 14 DTE Time Stop
  if (dte <= 14) {
    details.push(`DTE: ${dte} gün — VADE RİSKİ ÇOK YÜKSEK`);
    return {
      action: "KAPAT — Vade sonu yaklaştı",
      reason: "14 DTE son çare kuralı: Assignment riski, gamma riski çok yüksek.",
      urgency: "CRITICAL",
      details,
    };
  }

  // 5. Short strike test
  const distanceToShort = Math.abs(underlyingPrice - shortStrike) / underlyingPrice * 100;
  if (distanceToShort < 2) {
    details.push(`Spot $${underlyingPrice} short strike $${shortStrike}'e %${distanceToShort.toFixed(1)} yakın`);
    return {
      action: "HEDGE DÜŞÜN — Strike'a çok yaklaşıldı",
      reason: "Pin riski artıyor. Strike'leri uzaklaştır veya pozisyonu kapat.",
      urgency: "WARNING",
      details,
    };
  }

  // 6. IV değişimi
  if (ivRank < 30 && pnlPct < 0) {
    details.push(`IV Rank ${ivRank} çok düşük, IV crush devam ediyor`);
    return {
      action: "ZARARI KABUL ET — IV crush bitmeden kapat",
      reason: "Düşük IV ortamında zarar büyüyebilir. Kuralsız beklemek riskli.",
      urgency: "WARNING",
      details,
    };
  }

  // Default: tut
  details.push(`DTE: ${dte} gün | Kâr/Zarar: %${Math.round(pnlPct)}`);
  details.push(`Short strike'a mesafe: %${distanceToShort.toFixed(1)}`);
  return {
    action: "TUT — Henüz aksiyon gerekmez",
    reason: "Tüm yönetim kuralları içinde. Takibe devam.",
    urgency: "INFO",
    details,
  };
}

// ─── LIQUIDITY CHECK ───

export function liquidityCheck(
  bidAskSpread: number,
  openInterest: number,
  volume: number
): { pass: boolean; issues: string[] } {
  const issues: string[] = [];

  if (bidAskSpread > 0.10) {
    issues.push(`Bid-Ask spread $${bidAskSpread} > $0.10 — Slipaj riski yüksek`);
  }
  if (openInterest < 100) {
    issues.push(`Open Interest ${openInterest} < 100 — Likidite düşük`);
  }
  if (volume < 10) {
    issues.push(`Volume ${volume} < 10 — Çıkış zor olabilir`);
  }

  return {
    pass: issues.length === 0,
    issues,
  };
}

// ─── RISK NOTIFICATIONS ───

export function riskNotification(
  netLiquidationValue: number,
  totalPortfolioRisk: number, // $ at risk
  totalVega: number,
  sectorConcentration: number // % in top sector
): string[] {
  const notifications: string[] = [];

  const riskPct = (totalPortfolioRisk / netLiquidationValue) * 100;

  if (riskPct > 10) {
    notifications.push(`🚨 Toplam risk $${Math.round(totalPortfolioRisk)} (NLV'nin %${riskPct.toFixed(1)}'i) > %10 limit!`);
  } else if (riskPct > 7) {
    notifications.push(`⚠️ Toplam risk $${Math.round(totalPortfolioRisk)} (NLV'nin %${riskPct.toFixed(1)}'i) — Dikkat`);
  }

  const vegaLimit = netLiquidationValue * 0.02;
  if (Math.abs(totalVega) > vegaLimit) {
    notifications.push(`⚠️ Total Vega $${Math.round(totalVega)} > limit $${Math.round(vegaLimit)} → IV hareketine aşırı duyarlı`);
  }

  if (sectorConcentration > 30) {
    notifications.push(`🚨 Sektör konsantrasyonu %${sectorConcentration.toFixed(0)} > %30 → Tek sektöre bet yapıyorsun!`);
  } else if (sectorConcentration > 25) {
    notifications.push(`⚠️ Sektör konsantrasyonu %${sectorConcentration.toFixed(0)} — Çeşitlendir`);
  }

  return notifications;
}

// ═══════════════════════════════════════════════════════════════════════════════
// v4.2: PDT (Pattern Day Trader) UYUMLU EXECUTION KURALLARI
// T+1: Pozisyon en az 1 gün elde tutma zorunluluğu
// ═══════════════════════════════════════════════════════════════════════════════

import type { T1SuitabilityResult } from "@/types/scanner";
import type { StockResult } from "@/types/scanner";

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

  return { suitable, reasons, persistenceScore };
}
