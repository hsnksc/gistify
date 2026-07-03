/**
 * Regime Detector v3.0 — Katman 1: Piyasa Rejimi
 * VIX seviyesi, term structure (contango/backwardation), IV/HV oranı
 * Backwardation'da credit spread satmayı otomatik engeller.
 */

import type { MarketRegime, IVCurve, TermStructure, VixRegime } from "./optionsTypes";
import { type AppLanguage, t } from "@/lib/i18n";

// ─── VIX REGIME THRESHOLDS ───
const VIX_LEVELS = {
  extremeFear: 35,
  fear: 25,
  complacent: 15,
  extremeComplacent: 12,
} as const;

function classifyVixLevel(vix: number): VixRegime {
  if (vix >= VIX_LEVELS.extremeFear) return "EXTREME_FEAR";
  if (vix >= VIX_LEVELS.fear) return "FEAR";
  if (vix <= VIX_LEVELS.extremeComplacent) return "EXTREME_COMPLACENT";
  if (vix <= VIX_LEVELS.complacent) return "COMPLACENT";
  return "NORMAL";
}

function vixTrend(current: number, prev5: number): "RISING" | "FALLING" | "STABLE" {
  const change = ((current - prev5) / prev5) * 100;
  if (change > 10) return "RISING";
  if (change < -10) return "FALLING";
  return "STABLE";
}

// ─── TERM STRUCTURE DETECTION ───
function classifyTermStructure(termPoints: { daysToExpiry: number; iv: number }[]): TermStructure {
  if (termPoints.length < 2) return "FLAT";
  const front = termPoints[0].iv;   // shortest dated
  const back = termPoints[termPoints.length - 1].iv; // longest dated
  if (front > back * 1.05) return "BACKWARDATION";   // Front > Back by 5%
  if (back > front * 1.05) return "CONTANGO";          // Back > Front by 5%
  return "FLAT";
}

// ─── REJİM KURALLARI ───
function regimeRules(regime: VixRegime, term: TermStructure, vixTrendDir: "RISING" | "FALLING" | "STABLE", language: AppLanguage = "tr"): {
  creditSpreadAllowed: boolean;
  longPremiumAllowed: boolean;
  maxDteRecommendation: number;
  sizingFactor: number;
  note: string;
} {
  // Default
  const rules = {
    creditSpreadAllowed: true,
    longPremiumAllowed: true,
    maxDteRecommendation: 45,
    sizingFactor: 1.0,
    note: "",
  };

  // TERM STRUCTURE: Backwardation = piyasa panik, credit satma
  if (term === "BACKWARDATION") {
    rules.creditSpreadAllowed = false;
    rules.longPremiumAllowed = true;  // Long vol faydalı
    rules.maxDteRecommendation = 30;
    rules.sizingFactor = 0.5;         // Pozisyon yarıya
    rules.note = t("scanner:backwardationDoNotSellCredit");
    return rules;
  }

  // VIX REGIME kuralları
  switch (regime) {
    case "EXTREME_FEAR":
      rules.creditSpreadAllowed = true;  // High IV = credit selling opportunity
      rules.longPremiumAllowed = false;   // IV zirvede, long vol pahalı
      rules.maxDteRecommendation = 30;
      rules.sizingFactor = 0.7;
      rules.note = t("scanner:vix35SellCreditSpread");
      break;

    case "FEAR":
      rules.creditSpreadAllowed = true;
      rules.longPremiumAllowed = false;
      rules.maxDteRecommendation = 35;
      rules.sizingFactor = 0.8;
      rules.note = t("scanner:vix25CreditSpreadPreferable");
      break;

    case "NORMAL":
      rules.creditSpreadAllowed = true;
      rules.longPremiumAllowed = true;
      rules.maxDteRecommendation = 45;
      rules.sizingFactor = 1.0;
      rules.note = t("scanner:vixNormalStandardStrategiesApplicable");
      break;

    case "COMPLACENT":
      rules.creditSpreadAllowed = true;
      rules.longPremiumAllowed = true;
      rules.maxDteRecommendation = 45;
      rules.sizingFactor = 1.0;
      if (vixTrendDir === "FALLING") {
        rules.note = t("scanner:vixFallingTrendShortVol");
      }
      break;

    case "EXTREME_COMPLACENT":
      rules.creditSpreadAllowed = true;  // But risky
      rules.longPremiumAllowed = true;    // Long vol hedge mantıklı
      rules.maxDteRecommendation = 45;
      rules.sizingFactor = 0.7;
      rules.note = t("scanner:vix12ExtremeComplacentShort");
      break;
  }

  return rules;
}

// ─── VIX SIMULASYON (fallback, gerçek VIX yoksa) ───
function estimateVix(ivCurves: IVCurve[]): { vix: number; vix5: number } {
  if (ivCurves.length === 0) return { vix: 20, vix5: 20 };
  // VIX proxy = ortalama ATM IV × 0.85 (typical IV/VIX ratio)
  const avgIV = ivCurves.reduce((s, c) => s + c.currentIV, 0) / ivCurves.length;
  const vix = Math.round(avgIV * 0.85);
  return { vix, vix5: vix }; // Default stable
}

// ─── ANA FONKSİYON ───
export function detectMarketRegime(ivCurves: IVCurve[], language: AppLanguage = "tr"): MarketRegime {
  const { vix, vix5 } = estimateVix(ivCurves);
  const regime = classifyVixLevel(vix);
  const trend = vixTrend(vix, vix5);

  // Term structure from first curve (market proxy)
  let term: TermStructure = "FLAT";
  if (ivCurves.length > 0) {
    term = classifyTermStructure(ivCurves[0].termStructure);
  }

  const rules = regimeRules(regime, term, trend, language);

  return {
    vixLevel: vix,
    vixRegime: regime,
    termStructure: term,
    vixTrend: trend,
    creditSpreadAllowed: rules.creditSpreadAllowed,
    longPremiumAllowed: rules.longPremiumAllowed,
    maxDteRecommendation: rules.maxDteRecommendation,
    sizingFactor: rules.sizingFactor,
  };
}

// ─── IV CURVE HESAPLAMA (fiyat verisinden) ───
export function calculateIVCurve(
  ticker: string,
  spotPrice: number,
  closePrices: number[],
  highPrices: number[],
  lowPrices: number[]
): IVCurve {
  // Historical Volatility (20-day realized)
  const logReturns = closePrices.slice(1).map((c, i) => Math.log(c / closePrices[i]));
  const avgReturn = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
  const variance = logReturns.reduce((s, r) => s + (r - avgReturn) ** 2, 0) / logReturns.length;
  const hv = Math.sqrt(variance * 252) * 100; // Annualized

  // IV Proxy: HV × (1 + risk premium) with regime adjustment
  // Higher HV = higher IV, with 10-30% risk premium
  const riskPremium = 1 + (0.10 + Math.min(0.20, hv / 200));
  const currentIV = hv * riskPremium;

  // Term Structure (simulated from typical market shapes)
  const termStructure = [
    { daysToExpiry: 7, iv: currentIV * 1.15, label: "7D" },
    { daysToExpiry: 30, iv: currentIV * 1.00, label: "30D" },
    { daysToExpiry: 60, iv: currentIV * 0.95, label: "60D" },
    { daysToExpiry: 90, iv: currentIV * 0.92, label: "90D" },
  ];

  // Vol Skew (typical equity put skew)
  const atmIV = currentIV;
  const skew = [
    { delta: 0.10, strikePct: 0.85, iv: atmIV * 1.35, label: "10Δ Put" },
    { delta: 0.25, strikePct: 0.92, iv: atmIV * 1.15, label: "25Δ Put" },
    { delta: 0.50, strikePct: 1.00, iv: atmIV * 1.00, label: "ATM" },
    { delta: 0.25, strikePct: 1.08, iv: atmIV * 0.97, label: "25Δ Call" },
    { delta: 0.10, strikePct: 1.15, iv: atmIV * 1.05, label: "10Δ Call" },
  ];

  // IVRank (0-100, based on 52-week IV range)
  // Simulated: recent IV relative to 1-year range
  const recentIVs = closePrices.slice(-20).map((_, i) => {
    const slice = closePrices.slice(Math.max(0, i - 20), i + 1);
    const rets = slice.slice(1).map((c, j) => Math.log(c / slice[j]));
    const v = Math.sqrt(rets.reduce((s, r) => s + r ** 2, 0) / rets.length * 252) * 100;
    return v;
  });
  const minIV = Math.min(...recentIVs);
  const maxIV = Math.max(...recentIVs);
  const ivRank = maxIV > minIV
    ? Math.round(((currentIV - minIV) / (maxIV - minIV)) * 100)
    : 50;
  const ivPercentile = Math.max(0, Math.min(100, ivRank));

  const termShape = termStructure[0].iv > termStructure[termStructure.length - 1].iv
    ? "BACKWARDATION"
    : "CONTANGO";

  return {
    ticker,
    spotPrice,
    termStructure,
    skew,
    iVRank: Math.max(0, Math.min(100, ivRank)),
    iVPercentile: ivPercentile,
    termShape,
    currentIV: Math.round(currentIV * 10) / 10,
    historicalIV: Math.round(hv * 10) / 10,
    ivPremium: Math.round((currentIV - hv) * 10) / 10,
  };
}

// ─── IV SİNYALİ (Tek hisse için) ───
export function ivSignal(ivRank: number, ivPremium: number): { signal: "SELL_PREMIUM" | "BUY_PREMIUM" | "NEUTRAL" } {
  if (ivRank > 70 && ivPremium > 5) return { signal: "SELL_PREMIUM" };
  if (ivRank < 30 && ivPremium < -5) return { signal: "BUY_PREMIUM" };
  return { signal: "NEUTRAL" };
}

// ─── IV RADAR HIZLI GÖRÜNÜM ───
export interface IVRadarItem {
  ticker: string;
  ivRank: number;
  ivPct: number;
  currentIV: number;
  historicalIV: number;
  termShape: string;
  signal: string; // "SELL_PREMIUM" | "BUY_PREMIUM" | "NEUTRAL"
}

export function ivRadar(curves: IVCurve[]): IVRadarItem[] {
  return curves.map((c) => {
    let signal: string;
    if (c.iVRank > 70 && c.ivPremium > 5) signal = "SELL_PREMIUM";
    else if (c.iVRank < 30 && c.ivPremium < -5) signal = "BUY_PREMIUM";
    else signal = "NEUTRAL";

    return {
      ticker: c.ticker,
      ivRank: c.iVRank,
      ivPct: c.iVPercentile,
      currentIV: c.currentIV,
      historicalIV: c.historicalIV,
      termShape: c.termShape,
      signal,
    };
  });
}

// ─── REJİM AÇIKLAMA ───
export function regimeDescription(regime: MarketRegime): string {
  const lines: string[] = [];
  lines.push(`VIX: ${regime.vixLevel} (${regime.vixRegime.replace(/_/g, " ")})`);
  lines.push(`Term Structure: ${regime.termStructure}`);
  lines.push(`VIX Trend: ${regime.vixTrend}`);
  lines.push(`Credit Spread: ${regime.creditSpreadAllowed ? "✅ İzinli" : "❌ YASAK"}`);
  lines.push(`Long Premium: ${regime.longPremiumAllowed ? "✅ İzinli" : "❌ YASAK"}`);
  lines.push(`Max DTE: ${regime.maxDteRecommendation} gün`);
  lines.push(`Sizing: ${regime.sizingFactor}x`);
  return lines.join(" | ");
}
