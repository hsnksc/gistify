/**
 * Options Strategy Engine v3.0 — Kurumsal Seviye
 * v2'den gelen: IV Proxy, ATR hedef, Earnings uyarısı
 * v3.0 eklenen: POP, Expected Move, Breakeven, Yönetim Kuralları, IV Eğrisi
 *
 * Artık sadece "güzel grafik" yok — "POP %72, EV +$45, Breakeven $43.35" var.
 */

import type { StockResult } from "../types";
import { copy, type AppLanguage } from "@/lib/i18n";
import type { SpreadMetrics, PositionManagement, IVCurve, ExpectedMove, ProbabilityOfProfit } from "./optionsTypes";
import { calculateIVCurve, ivSignal } from "./regimeDetector";
import { calculateExpectedMove, calculatePOP, calculateSpreadMetrics } from "./optionAnalytics";
import { createManagementRules, createExecutionPlan, calculatePositionSize } from "./executionRules";

// ─── STRATEJİ İSİM HELPER ───
export function getStrategyName(strategy: OptionStrategy, language: AppLanguage): string {
  return copy(language, strategy.nameTr, strategy.name);
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
    return { strategy: "bull_call_spread", note: copy(language, `IV Rank ${ivRank} ÇOK YÜKSEK → Spread zorunlu, tek call pahalı`, `IV Rank ${ivRank} VERY HIGH → Spread mandatory, single call expensive`) };
  }
  if (ivRank > 50) {
    return { strategy: "bull_call_spread", note: copy(language, `IV Rank ${ivRank} yüksek → Spread ile maliyet düşür`, `IV Rank ${ivRank} high → Reduce cost with spread`) };
  }
  if (ivRank < 30) {
    return { strategy: "long_call", note: copy(language, `IV Rank ${ivRank} düşük → Uzun call mantıklı (ucuz prim)`, `IV Rank ${ivRank} low → Long call makes sense (cheap premium)`) };
  }
  return { strategy: "bull_call_spread", note: copy(language, `IV Rank ${ivRank} normal → Dengeli spread`, `IV Rank ${ivRank} normal → Balanced spread`) };
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
      setup: copy(language, "Yeni pozisyon açma", "Open new position"),
      whenToUse: [copy(language, "Vade çok kısa", "Expiration too short")],
      pros: [copy(language, "Risk yok", "No risk")],
      cons: [copy(language, "Kâr yok", "No profit")],
      premiumEstimate: "$0",
    };
    entryNotes.push(copy(language, "Vade kontrolü nedeniyle strateji önerisi RED", "Strategy recommendation RED due to expiration check"));
    entryNotes.push(copy(language, `DTE: ${daysToExpiration} gün — Minimum 3 gün gerekli`, `DTE: ${daysToExpiration} days — Minimum 3 days required`));

  } else if (stock.score >= 75 && stock.volumeRatio >= 2 && stock.rsi > 50 && stock.rsi < 80) {
    primary = ivRank > 50 ? STRATEGIES.bull_call_spread : STRATEGIES.long_call;
    entryNotes.push(copy(language, "Güçlü momentum sinyali", "Strong momentum signal"));
    entryNotes.push(ivAdj.note);
    entryNotes.push(copy(language, `Hedef: $${targetPrice} (ATR × ${atrMult})`, `Target: $${targetPrice} (ATR × ${atrMult})`));
    entryNotes.push(copy(language, `Durdurma: $${stopLossPrice} (ATR × 1)`, `Stop: $${stopLossPrice} (ATR × 1)`));

    // v3.0: Expected Move ekle
    if (expectedMove) {
      entryNotes.push(`Expected Move (${dte}D): $${expectedMove.moveDollars.toFixed(2)} (%${expectedMove.movePercent.toFixed(1)})`);
      riskWarnings.push(expectedMove.movePercent > 8
        ? copy(language, `Expected Move %${expectedMove.movePercent.toFixed(1)} çok yüksek → Pozisyon küçült`, `Expected Move %${expectedMove.movePercent.toFixed(1)} very high → Reduce position`)
        : copy(language, `Expected Move %${expectedMove.movePercent.toFixed(1)} kabul edilebilir aralık`, `Expected Move %${expectedMove.movePercent.toFixed(1)} acceptable range`)
      );
    }

    // v3.0: POP ekle
    if (spreadMetrics) {
      entryNotes.push(copy(language, `POP: %${spreadMetrics.pop.popPercent} | Max Risk: $${spreadMetrics.maxLoss} | Kredi: $${spreadMetrics.netCredit}`, `POP: %${spreadMetrics.pop.popPercent} | Max Risk: $${spreadMetrics.maxLoss} | Credit: $${spreadMetrics.netCredit}`));
      entryNotes.push(`Breakeven: $${spreadMetrics.breakeven} | R/R: ${spreadMetrics.rReturn.toFixed(2)}`);
    }

    riskWarnings.push(ivRank > 70 ? copy(language, "IV çok yüksek, spread şart", "IV very high, spread required") : copy(language, "Yüksek kaldıraç riski", "High leverage risk"));

  } else if (stock.score >= 55 && stock.vwapDeviation > 0) {
    primary = STRATEGIES.bull_call_spread;
    entryNotes.push(copy(language, "Orta momentum - korunmalı strateji", "Medium momentum - protective strategy"));
    entryNotes.push(ivAdj.note);
  } else if (stock.volumeRatio >= 3 && Math.abs(stock.priceChangePct) > 2) {
    primary = STRATEGIES.long_straddle;
    entryNotes.push(copy(language, "Yüksek volatilite - yön bağımsız", "High volatility - direction independent"));
    riskWarnings.push(copy(language, "Çift prim maliyeti", "Double premium cost"));
  } else {
    primary = STRATEGIES.bull_put_spread;
    entryNotes.push(copy(language, "Düşük konfidans - konservatif", "Low confidence - conservative"));
    entryNotes.push(copy(language, "Önce izleyin, onay bekleyin", "Watch first, wait for confirmation"));
  }

  // Alternatifler (DTE override durumunda ekleme)
  if (!dteOverride) {
    if (primary !== STRATEGIES.bull_call_spread) strategies.push(STRATEGIES.bull_call_spread);
    if (primary !== STRATEGIES.bull_put_spread) strategies.push(STRATEGIES.bull_put_spread);
    if (primary !== STRATEGIES.long_straddle && stock.volumeRatio >= 2.5) strategies.push(STRATEGIES.long_straddle);
  }

  // RSI RED filtresi (v4.1)
  if (stock.rsi > 80) {
    riskWarnings.push(copy(language, "🚨 RSI aşırı alım (>80) — KESİNLİKLE yeni pozisyon AÇMA", "🚨 RSI overbought (>80) — DO NOT open new position"));
    riskWarnings.push(copy(language, "RSI RED filtresi aktif, skor sıfırlandı", "RSI RED filter active, score reset"));
  } else if (stock.rsi > 75) {
    riskWarnings.push(copy(language, "⚠️ RSI sıcak bölge (75-80) — Stop-loss şart, küçük pozisyon", "⚠️ RSI hot zone (75-80) — Stop-loss required, small position"));
  }

  // Earnings
  const earningsWarn = stock.earningsWarning || null;
  if (earningsWarn) {
    riskWarnings.push(earningsWarn);
    riskWarnings.push(copy(language, "Earnings sonrası IV crush yaşanabilir — vade earnings'den SONRA", "IV crush may occur after earnings — expiration AFTER earnings"));
  }

  // v3.0: IV sinyali
  if (ivCurve) {
    const ivSig = ivSignal(ivCurve.iVRank, ivCurve.ivPremium);
    const ivLabel = ivSig === "SELL_PREMIUM" ? copy(language, "Premium satışı", "Premium sale") : ivSig === "BUY_PREMIUM" ? copy(language, "Premium alımı", "Premium purchase") : copy(language, "Nötr", "Neutral");
    const ivNote = ivSig === "SELL_PREMIUM" ? copy(language, "IV yüksek, credit spread mantıklı", "IV high, credit spread makes sense") : ivSig === "BUY_PREMIUM" ? copy(language, "IV düşük, long premium mantıklı", "IV low, long premium makes sense") : copy(language, "IV ortalama", "IV average");
    riskWarnings.push(`${ivLabel}: ${ivNote}`);

    // Term structure uyarısı
    if (ivCurve.termShape === "BACKWARDATION") {
      riskWarnings.push(copy(language, "⚠️ BACKWARDATION: Piyasa panik modunda, credit spread RİSKLİ", "⚠️ BACKWARDATION: Market in panic mode, credit spread RISKY"));
      riskWarnings.push(copy(language, "Öneri: Long premium (put/call) veya BEKLE", "Recommendation: Long premium (put/call) or WAIT"));
    }
  }

  // IV recommendation text
  const ivRecText = ivRank > 70
    ? copy(language, `IV Rank yüksek (%${ivRank}) → Call yerine spread, vade kısa tutun`, `IV Rank high (%${ivRank}) → Spread instead of call, keep expiration short`)
    : ivRank < 30
    ? copy(language, `IV Rank düşük (%${ivRank}) → Uzun call mantıklı, vade uzun tutun`, `IV Rank low (%${ivRank}) → Long call makes sense, keep expiration long`)
    : copy(language, `IV Rank normal (%${ivRank}) → Standart stratejiler`, `IV Rank normal (%${ivRank}) → Standard strategies`);

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
      warning: copy(language, `🚨 Sadece ${daysToExpiration} gün kaldı! Theta decay maksimum, pin riski yüksek. KAPAT.`, `🚨 Only ${daysToExpiration} days left! Theta decay maximum, pin risk high. CLOSE.`),
      maxDte: daysToExpiration,
    };
  }
  if (daysToExpiration < 7) {
    return {
      allowed: signal === "OVERBOUGHT_RED" || signal === "CAUTION_HOT" ? false : true,
      warning: copy(language, `⚠️ Sadece ${daysToExpiration} gün kaldı. Son hafta gamma riski çok yüksek. Yeni pozisyon AÇMA.`, `⚠️ Only ${daysToExpiration} days left. Last week gamma risk very high. DO NOT open new position.`),
      maxDte: 7,
    };
  }
  if (daysToExpiration < 14) {
    return {
      allowed: true,
      warning: copy(language, `⚠️ ${daysToExpiration} gün kaldı. 14 DTE time stop yaklaşıyor.`, `⚠️ ${daysToExpiration} days left. 14 DTE time stop approaching.`),
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

import type { BiDirectionalSetup, OptionSetup, DirectionRecommendation, T1SuitabilityResult } from "../types";

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
  if (dte < 3) return { signal: "AVOID", strategy: "AVOID", strike: 0, dte, otmPct: 0, reason: copy(language, "DTE < 3: theta decay maksimum", "DTE < 3: theta decay maximum") };
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
      maxLoss: copy(language, "Ödenen prim", "Premium paid"),
      takeProfit: copy(language, "%50 prim artışı", "%50 premium increase"),
      stopCondition: copy(language, "%50 prim erimesi = stop", "%50 premium decay = stop"),
      entryCondition: copy(language, `${stock.currentPrice} üzeri, VWAP üstü onay`, `${stock.currentPrice} above, VWAP above confirmation`),
      pdtNote: copy(language, `PDT: 1 gün tutma için uygun. Momentum güçlü, ertesi gün devam olasılığı yüksek.`, `PDT: Suitable for 1-day hold. Momentum strong, likely continuation next day.`),
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
      maxLoss: copy(language, "Net prim (sınırlı)", "Net premium (limited)"),
      takeProfit: copy(language, "%50 spread değeri", "%50 spread value"),
      stopCondition: copy(language, "2x prim = stop", "2x premium = stop"),
      entryCondition: copy(language, `${stock.currentPrice} üzeri, VWAP üstü`, `${stock.currentPrice} above, VWAP above`),
      pdtNote: copy(language, `PDT: Spread ile risk sınırlı, 1 gün tutma uygun.`, `PDT: Risk limited with spread, suitable for 1-day hold.`),
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
      maxLoss: copy(language, "Net prim (sınırlı)", "Net premium (limited)"),
      takeProfit: copy(language, "%50 prim", "%50 premium"),
      stopCondition: copy(language, "2x prim = stop", "2x premium = stop"),
      entryCondition: copy(language, "Konservatif giriş", "Conservative entry"),
      pdtNote: copy(language, `PDT: Konservatif spread, düşük risk.`, `PDT: Conservative spread, low risk.`),
    };
  }
}

function buildPutSetup(stock: StockResult, bearScore: number, dte: number, language: AppLanguage = "tr"): OptionSetup {
  // DTE kontrolü — put için de zorunlu
  if (dte < 3) return { signal: "AVOID", strategy: "AVOID", strike: 0, dte, otmPct: 0, reason: copy(language, "DTE < 3: theta decay maksimum", "DTE < 3: theta decay maximum") };
  if (dte < 7 && stock.rsi <= 25) return { signal: "AVOID", strategy: "AVOID", strike: 0, dte, otmPct: 0, reason: copy(language, "DTE < 7 + RSI < 25: mean reversion riski", "DTE < 7 + RSI < 25: mean reversion risk") };

  // RSI aşırı satım uyarısı
  if (stock.rsi <= 20) return { signal: "AVOID", strategy: "AVOID", strike: 0, dte, otmPct: 0, reason: copy(language, "RSI ≤ 20: aşırı satım, mean reversion riski yüksek", "RSI ≤ 20: oversold, high mean reversion risk") };

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
      maxLoss: copy(language, "Ödenen prim", "Premium paid"),
      takeProfit: copy(language, "%50 prim artışı", "%50 premium increase"),
      stopCondition: copy(language, "%50 prim erimesi = stop", "%50 premium decay = stop"),
      entryCondition: copy(language, `${stock.currentPrice} altı, VWAP altı onay`, `${stock.currentPrice} below, VWAP below confirmation`),
      pdtNote: copy(language, `PDT: 1 gün tutma için uygun. Aşağı momentum güçlü, ertesi gün düşüş devam olasılığı.`, `PDT: Suitable for 1-day hold. Down momentum strong, likely continuation next day.`),
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
      maxLoss: copy(language, "Net prim (sınırlı)", "Net premium (limited)"),
      takeProfit: copy(language, "%50 spread değeri", "%50 spread value"),
      stopCondition: copy(language, "2x prim = stop", "2x premium = stop"),
      entryCondition: copy(language, `${stock.currentPrice} altı, VWAP altı`, `${stock.currentPrice} below, VWAP below`),
      pdtNote: copy(language, `PDT: Spread ile risk sınırlı, 1 gün tutma uygun.`, `PDT: Risk limited with spread, suitable for 1-day hold.`),
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
      maxLoss: copy(language, "Net prim (sınırlı)", "Net premium (limited)"),
      takeProfit: copy(language, "%50 prim", "%50 premium"),
      stopCondition: copy(language, "2x prim = stop", "2x premium = stop"),
      entryCondition: copy(language, "Konservatif giriş", "Conservative entry"),
      pdtNote: copy(language, `PDT: Konservatif spread, düşük risk.`, `PDT: Conservative spread, low risk.`),
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
