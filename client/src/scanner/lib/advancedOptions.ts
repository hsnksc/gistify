/**
 * Gelişmiş Opsiyon Stratejisi Motoru
 * - ATM/OTM Seçim Rehberi
 * - Vade Önerisi
 * - Pozisyon Boyutu Hesaplayıcı
 */

import type { StockResult } from "../types";
import type { MarketRegime } from "./advancedPattern";
import { type AppLanguage, copy } from "@/lib/i18n";

export interface StrikeRecommendation {
  type: "ATM" | "SLIGHT_OTM" | "AGGRESSIVE_OTM";
  deltaRange: string;
  suggestedStrike: number;
  estimatedPremium: number;
  rationale: string;
}

export interface ExpiryRecommendation {
  recommendedDte: number;
  label: string;
  rationale: string;
}

export interface PositionSizing {
  maxPremium: number;
  maxContracts: number;
  totalRisk: number;
  riskPerContract: number;
}

// =================== 4a. ATM/OTM Seçim Rehberi ===================

export function recommendStrike(
  stock: StockResult,
  targetPrice: number,
  language: AppLanguage = "tr"
): StrikeRecommendation {
  const pctDiff = ((targetPrice - stock.currentPrice) / stock.currentPrice) * 100;

  // ATR-based premium estimate
  const atrPremium = Math.max(1, stock.atr14d * 1.5);

  if (Math.abs(pctDiff) < 2) {
    // ATM
    const strike = Math.round(stock.currentPrice);
    return {
      type: "ATM",
      deltaRange: "0.45 – 0.55",
      suggestedStrike: strike,
      estimatedPremium: Math.round(atrPremium * 0.8 * 100) / 100,
      rationale: copy(language,
        "Fiyat hedefe yakın. ATM seçmek en yüksek delta ve en iyi risk/ödül dengesi sağlar.",
        "Price near target. ATM offers highest delta and best risk/reward balance."
      ),
    };
  } else if (Math.abs(pctDiff) < 4) {
    // Slight OTM
    const direction = pctDiff > 0 ? 1 : -1;
    const strikeOffset = Math.ceil(Math.abs(pctDiff) / 2);
    const strike =
      direction > 0
        ? Math.round(stock.currentPrice + strikeOffset)
        : Math.round(stock.currentPrice - strikeOffset);
    return {
      type: "SLIGHT_OTM",
      deltaRange: "0.30 – 0.45",
      suggestedStrike: strike,
      estimatedPremium: Math.round(atrPremium * 0.5 * 100) / 100,
      rationale: copy(language,
        "Hedefe %2-4 mesafe var. Hafif OTM prim maliyetini düşürür, hâlâ güçlü delta sağlar.",
        "Target is 2-4% away. Slight OTM lowers premium cost while still providing strong delta."
      ),
    };
  } else {
    // Aggressive OTM
    const direction = pctDiff > 0 ? 1 : -1;
    const strikeOffset = Math.ceil(Math.abs(pctDiff) / 3);
    const strike =
      direction > 0
        ? Math.round(stock.currentPrice + strikeOffset)
        : Math.round(stock.currentPrice - strikeOffset);
    return {
      type: "AGGRESSIVE_OTM",
      deltaRange: "0.20 – 0.30",
      suggestedStrike: strike,
      estimatedPremium: Math.round(atrPremium * 0.25 * 100) / 100,
      rationale: copy(language,
        "Hedef uzak. Agresif OTM ucuz prim sunar ama kazanma olasılığı daha düşüktür.",
        "Target is far. Aggressive OTM offers cheap premium but lower probability of profit."
      ),
    };
  }
}

// =================== 4b. Vade Önerisi ===================

export function recommendExpiry(
  regime: MarketRegime,
  todayDayOfWeek: number,
  language: AppLanguage = "tr"
): ExpiryRecommendation {
  // Day of week: 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat

  if (regime === "HIGH_VOL") {
    // High vol → longer DTE to ride through noise
    const dte = todayDayOfWeek >= 4 ? 14 : 10; // Thu/Fri → 2 weeks
    return {
      recommendedDte: dte,
      label: dte >= 14 ? copy(language, "2 haftalık vade", "2-week expiry") : copy(language, "~10 günlük vade", "~10 day expiry"),
      rationale: copy(language,
        "Yüksek volatilite rejimi. Uzun vade seçerek theta kaybını sınırlayın ve fırsat penceresini genişletin.",
        "High volatility regime. Choose longer expiry to limit theta decay and widen the opportunity window."
      ),
    };
  }

  if (regime === "LOW_VOL") {
    // Low vol → shorter DTE, closer expiry for gamma
    const dte = todayDayOfWeek >= 3 ? 7 : 5; // Wed+ → weekly
    return {
      recommendedDte: dte,
      label: dte <= 5 ? copy(language, "Haftalık (Cuma) vade", "Weekly (Friday) expiry") : copy(language, "~7 günlük vade", "~7 day expiry"),
      rationale: copy(language,
        "Düşük volatilite rejimi. Kısa vade ile gamma'dan faydalanın; hareket beklentisi yüksek.",
        "Low volatility regime. Use shorter expiry to benefit from gamma; high movement expected."
      ),
    };
  }

  // Normal regime
  if (todayDayOfWeek >= 3) {
    // Wednesday onwards → next week or 2-week
    return {
      recommendedDte: 10,
      label: copy(language, "Gelecek hafta + 3 gün (~10 gün)", "Next week + 3 days (~10 days)"),
      rationale: copy(language,
        "Hafta ortası/sonu yaklaştığında bir sonraki haftanın sonuna kadar vade seçin.",
        "Mid/late week approaching. Choose expiry through the end of next week."
      ),
    };
  }

  return {
    recommendedDte: 5,
    label: copy(language, "Bu hafta sonu (Cuma) vade", "This week end (Friday) expiry"),
    rationale: copy(language, "Hafta başındayız, Cuma vadeli opsiyon uygun.", "Early in the week, Friday expiry is appropriate."),
  };
}

// =================== 4c. Pozisyon Boyutu Hesaplayıcı (Strateji-Tipi Dinamik) ===================

export type StrategyType = "DEBIT" | "CREDIT";

export function calculatePositionSizing(
  accountBalance: number,
  riskPercent: number,
  estimatedPremiumPerContract: number,
  strategyType: StrategyType = "DEBIT",
  spreadWidth: number = 5, // Credit spread: $5 default strike difference
  multiplier = 100
): PositionSizing {
  const totalRisk = accountBalance * (riskPercent / 100);

  let riskPerContract: number;

  if (strategyType === "CREDIT") {
    // Bull Put Spread: Risk = (Spread Width - Credit Received) × 100
    // Örn: $5 spread - $0.80 prim = $4.20 risk/contract = $420
    const creditReceived = estimatedPremiumPerContract;
    riskPerContract = (spreadWidth - creditReceived) * multiplier;
  } else {
    // DEBIT (Long Call, Bull Call Spread, Long Straddle): Risk = premium paid
    // Örn: $2.00 prim = $200 risk/contract
    riskPerContract = estimatedPremiumPerContract * multiplier;
  }

  const maxContracts = Math.floor(totalRisk / Math.max(riskPerContract, 0.01));

  return {
    maxPremium: Math.round(totalRisk * 100) / 100,
    maxContracts: Math.max(0, maxContracts),
    totalRisk: Math.round(totalRisk * 100) / 100,
    riskPerContract: Math.round(riskPerContract * 100) / 100,
  };
}

// =================== Birleşik Strateji Önerisi ===================

export interface CompleteStrategyRecommendation {
  strikeRec: StrikeRecommendation;
  expiryRec: ExpiryRecommendation;
  positionSizing: PositionSizing | null;
  targetPrice: number;
  stopLossPrice: number;
  notes: string[];
}

export function buildCompleteRecommendation(
  stock: StockResult,
  regime: MarketRegime,
  accountBalance: number | null,
  riskPercent: number,
  language: AppLanguage = "tr"
): CompleteStrategyRecommendation {
  const targetPrice = Math.round(stock.currentPrice * 1.03 * 100) / 100;
  const stopLossPrice = Math.round(stock.currentPrice * 0.98 * 100) / 100;

  const strikeRec = recommendStrike(stock, targetPrice, language);
  const expiryRec = recommendExpiry(regime, new Date().getDay(), language);

  const positionSizing =
    accountBalance && accountBalance > 0
      ? calculatePositionSizing(
          accountBalance,
          riskPercent,
          strikeRec.estimatedPremium
        )
      : null;

  const notes: string[] = [];
  notes.push(copy(language, `ATM/OTM: ${strikeRec.type} (${strikeRec.deltaRange} delta)`, `ATM/OTM: ${strikeRec.type} (${strikeRec.deltaRange} delta)`));
  notes.push(copy(language, `Vade: ${expiryRec.label} (~${expiryRec.recommendedDte} gün)`, `Expiry: ${expiryRec.label} (~${expiryRec.recommendedDte} days)`));
  if (positionSizing) {
    notes.push(copy(language, `Maksimum ${positionSizing.maxContracts} kontrat (${positionSizing.maxPremium}$ prim)`, `Maximum ${positionSizing.maxContracts} contracts (${positionSizing.maxPremium}$ premium)`));
  }
  notes.push(copy(language, `Hedef: $${targetPrice} / Durdurma: $${stopLossPrice}`, `Target: $${targetPrice} / Stop: $${stopLossPrice}`));

  return {
    strikeRec,
    expiryRec,
    positionSizing,
    targetPrice,
    stopLossPrice,
    notes,
  };
}
