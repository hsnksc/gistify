/**
 * Gelişmiş Opsiyon Stratejisi Motoru
 * - ATM/OTM Seçim Rehberi
 * - Vade Önerisi
 * - Pozisyon Boyutu Hesaplayıcı
 */

import type { StockResult } from "../types";
import type { MarketRegime } from "./advancedPattern";
import { type AppLanguage, t } from "@/lib/i18n";

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
      rationale: t("scanner:priceNearTargetAtmOffers"),
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
      rationale: t("scanner:targetIs24Away"),
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
      rationale: t("scanner:targetIsFarAggressiveOtm"),
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
      label: dte >= 14 ? t("scanner:2WeekExpiry") : t("scanner:10DayExpiry"),
      rationale: t("scanner:highVolatilityRegimeChooseLonger"),
    };
  }

  if (regime === "LOW_VOL") {
    // Low vol → shorter DTE, closer expiry for gamma
    const dte = todayDayOfWeek >= 3 ? 7 : 5; // Wed+ → weekly
    return {
      recommendedDte: dte,
      label: dte <= 5 ? t("scanner:weeklyFridayExpiry") : t("scanner:7DayExpiry"),
      rationale: t("scanner:lowVolatilityRegimeUseShorter"),
    };
  }

  // Normal regime
  if (todayDayOfWeek >= 3) {
    // Wednesday onwards → next week or 2-week
    return {
      recommendedDte: 10,
      label: t("scanner:nextWeek3Days10"),
      rationale: t("scanner:midLateWeekApproachingChoose"),
    };
  }

  return {
    recommendedDte: 5,
    label: t("scanner:thisWeekEndFridayExpiry"),
    rationale: t("scanner:earlyInTheWeekFriday"),
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
  notes.push(`ATM/OTM: ${strikeRec.type} (${strikeRec.deltaRange} delta)`);
  notes.push(t("scanner:expiryDays", { label: expiryRec.label, recommendeddte: expiryRec.recommendedDte }));
  if (positionSizing) {
    notes.push(t("scanner:maximumContractsPremium", { maxcontracts: positionSizing.maxContracts, maxpremium: positionSizing.maxPremium }));
  }
  notes.push(t("scanner:targetStop", { targetprice: targetPrice, stoplossprice: stopLossPrice }));

  return {
    strikeRec,
    expiryRec,
    positionSizing,
    targetPrice,
    stopLossPrice,
    notes,
  };
}
