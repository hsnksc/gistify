/**
 * ScoreConfig v4.0 — Prop Desk Seviyesi Skor Yapılandırması
 * v3'den farkları: Dinamik ağırlık (VIX rejimine göre), Volatility-Adjusted Momentum,
 * Kesin ağırlık normalizasyonu (∑w_i = 1.0000)
 */

import { copy, type AppLanguage } from "@/lib/i18n";

// ===================== 11 Faktör Ağırlıkları (Temel) =====================
// Toplam KESİNLİKLE 1.00 olmalı — 0.97 hatası v4.0'da düzeltildi
const BASE_WEIGHTS = {
  rvol: 0.15,          // Göreceli Hacim
  gap: 0.10,           // Açılış Boşluğu
  orb: 0.13,           // Opening Range Breakout
  vwap: 0.13,          // VWAP Pozisyon/Eğim
  structure: 0.08,     // Fiyat Yapısı
  rsi_short: 0.10,     // RSI Kısa Vade
  velocity_dir: 0.07,  // Velocity Yön
  velocity_vol: 0.03,  // Velocity Volatilite
  marketCap: 0.04,     // Piyasa Değeri
  retention: 0.08,     // Intraday Retention
  price_change: 0.09,  // Günlük Değişim (0.06→0.09, düzeltme)
} as const;

// Kesin normalizasyon: Tüm ağırlıkları toplama böl
const rawTotal = Object.values(BASE_WEIGHTS).reduce((a, b) => a + b, 0);
export const FACTOR_WEIGHTS: Record<string, number> = {} as const;
for (const [k, v] of Object.entries(BASE_WEIGHTS)) {
  (FACTOR_WEIGHTS as Record<string, number>)[k] = Math.round((v / rawTotal) * 10000) / 10000;
}
// Son kalanı rvol'a ekle (yuvarlama hatası düzeltme)
const normalizedTotal = Object.values(FACTOR_WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(normalizedTotal - 1.0) > 0.0001) {
  FACTOR_WEIGHTS.rvol += (1.0 - normalizedTotal);
}

// ─── v4.0: DİNAMİK AĞIRLIK SİSTEMİ ───
// VIX rejimine göre RVOL ve Price Change ağırlıklarını kaydır
// Ayı piyasasında (VIX 25+) hacime daha çok önem ver

export interface VixRegime {
  level: number;
  label: "EXTREME_FEAR" | "FEAR" | "NORMAL" | "COMPLACENT" | "EXTREME_COMPLACENT";
}

export function getDynamicWeights(regime: VixRegime): typeof BASE_WEIGHTS {
  const w = { ...FACTOR_WEIGHTS } as unknown as Record<string, number>;

  switch (regime.label) {
    case "EXTREME_FEAR": // VIX 35+
      // Hacim çok önemli (panikte hacim = bilgi)
      w.rvol = 0.22;
      w.price_change = 0.12;
      w.orb = 0.08; // ORB azalt (volatilite çok yüksek)
      break;
    case "FEAR": // VIX 25-34
      // Hacim önemli, momentum daha az
      w.rvol = 0.20;
      w.price_change = 0.10;
      w.rsi_short = 0.08; // RSI daha az güvenilir
      break;
    case "NORMAL": // VIX 16-24
      // Standart ağırlıklar (zaten normalized)
      return FACTOR_WEIGHTS as unknown as typeof BASE_WEIGHTS;
    case "COMPLACENT": // VIX 13-15
      // Momentum daha önemli (hacim düşük olabilir)
      w.rvol = 0.12;
      w.price_change = 0.10;
      w.structure = 0.10;
      break;
    case "EXTREME_COMPLACENT": // VIX <12
      // Yapı ve VWAP önemli (yavaş piyasa)
      w.rvol = 0.10;
      w.structure = 0.12;
      w.vwap = 0.15;
      break;
  }

  // Re-normalize (kesinlikle 1.00 olmalı)
  const dynTotal = Object.values(w).reduce((a, b) => a + b, 0);
  for (const k of Object.keys(w)) {
    w[k] = Math.round((w[k] / dynTotal) * 10000) / 10000;
  }
  // Yuvarlama düzeltmesi
  const finalTotal = Object.values(w).reduce((a, b) => a + b, 0);
  w.rvol += (1.0 - finalTotal);

  return w as unknown as typeof BASE_WEIGHTS;
}

// ─── v4.0: VOLATİLİTE-ADJUSTED MOMENTUM ───
// Hisse kendi geçmiş volatilitesine göre normalize edilir
// Yüksek vol hissenin +3%'ü, düşük vol hissenin +3%'ünden farklıdır

export function volatilityAdjustedScore(
  rawScore: number,
  atr14: number,
  price: number,
  historicalVol: number
): number {
  const atrPct = (atr14 / price) * 100; // ATR as % of price
  // Volatilite adjustment: Daha volatil hisse = daha zor momentum
  // Normalizasyon faktörü: 1.0 = ortalama vol, <1.0 = yüksek vol, >1.0 = düşük vol
  const volFactor = Math.min(2.0, Math.max(0.5, 3.0 / Math.max(atrPct, 0.5)));

  // Düzeltilmiş skor
  const adjusted = rawScore * volFactor;
  return Math.round(Math.max(0, Math.min(100, adjusted)));
}

// ─── v4.0: PORTFÖY ISI KONTROLÜ ───
// Tüm pozisyonların toplam riski NLV'nin %5'ini geçerse YENİ İŞLEM DURUR

export function portfolioHeatCheck(
  totalPortfolioRisk: number, // $ at risk (sum of max losses)
  netLiquidationValue: number,
  language: AppLanguage = "tr"
): { canTrade: boolean; heatPct: number; message: string } {
  const heatPct = (totalPortfolioRisk / netLiquidationValue) * 100;

  if (heatPct >= 5.0) {
    return {
      canTrade: false,
      heatPct: Math.round(heatPct * 10) / 10,
      message: copy(language, `PORTFÖY ISI ${heatPct.toFixed(1)}% ≥ %5 LİMİT! Yeni işlem YASAK. Önce pozisyon küçült.`, `PORTFOLIO HEAT ${heatPct.toFixed(1)}% ≥ %5 LIMIT! New trades FORBIDDEN. Reduce positions first.`),
    };
  }
  if (heatPct >= 4.0) {
    return {
      canTrade: true,
      heatPct: Math.round(heatPct * 10) / 10,
      message: copy(language, `UYARI: Portföy ısısı ${heatPct.toFixed(1)}% — Yakında %5 limit. Çok küçük pozisyon.`, `WARNING: Portfolio heat ${heatPct.toFixed(1)}% — Near %5 limit. Very small position only.`),
    };
  }
  return {
    canTrade: true,
    heatPct: Math.round(heatPct * 10) / 10,
    message: copy(language, `Portföy ısısı ${heatPct.toFixed(1)}% — Güvenli bölgede.`, `Portfolio heat ${heatPct.toFixed(1)}% — Safe zone.`),
  };
}

// ===================== Confidence Score Ağırlıkları =====================
export const CONFIDENCE_WEIGHTS = {
  dataCompleteness: 0.30,
  priceRecency: 0.25,
  volumeQuality: 0.25,
  indicatorReliability: 0.20,
} as const;

// ===================== Ranking Score Ağırlıkları =====================
export const RANKING_WEIGHTS = {
  momentum: 0.55,
  confidence: 0.25,
  riskReturn: 0.10,
  pattern: 0.10,
} as const;

// ===================== Threshold'lar =====================
export const THRESHOLDS = {
  // Minimum filtreler
  minAvgVolume20d: 500_000,
  minDollarVolume: 50_000_000,

  // Signal seviyeleri
  strongBuy: 75,
  buy: 60,
  neutralBullish: 45,
  neutral: 30,
  neutralBearish: 20,

  // Confidence seviyeleri
  highConfidence: 80,
  mediumConfidence: 50,

  // Ranking
  topTier: 70,
  goodTier: 55,
} as const;

// ===================== Normalizasyon Parametreleri =====================
export const NORMS = {
  // RVOL skorlama (linear interpolation noktaları)
  rvol: { x0: 0, x1: 1.0, x2: 2.0, x3: 4.0, y0: 0, y1: 15, y2: 50, y3: 100 },

  // VWAP normalize slope threshold'ları
  vwapSlopeStrong: 0.0005,
  vwapSlopeNeutral: 0,

  // ORB
  orbMinMinutes: 30,           // Piyasa açılışından minimum dakika
  orbStrongNorm: 2.0,          // ATR/ORB range ratio
  orbGoodNorm: 1.5,
  orbModerateNorm: 1.0,

  // RSI Short
  rsiOptimalMin: 60, rsiOptimalMax: 75,
  rsiStrongMin: 55, rsiStrongMax: 60,
  rsiNeutralMin: 45, rsiNeutralMax: 55,
  rsiWeakMin: 35, rsiWeakMax: 45,
  rsiOverboughtWarn: 75, rsiOverboughtMax: 80,

  // Velocity Direction
  velDirExtreme: 2.0,
  velDirStrong: 1.5,
  velDirGood: 1.0,
  velDirModerate: 0.5,

  // ATR Hedef Fiyat Multiplier'ları
  atrMultHigh: 2.0,    // score >= 75
  atrMultMedium: 1.5,  // score >= 55
  atrMultLow: 1.0,     // score < 55

  // ATR Hedef min/max sınırları (ATR katı olarak)
  atrMinMult: 0.4,
  atrMaxMult: 1.5,
} as const;

// ===================== Faktör İsimleri (Display) =====================
export function getFactorLabels(language: AppLanguage = "tr"): Record<string, string> {
  return {
    rvol: copy(language, "RVOL (Göreceli Hacim)", "RVOL (Relative Volume)"),
    gap: copy(language, "GAP Kalitesi", "GAP Quality"),
    orb: copy(language, "ORB (Açılış Kırılım)", "ORB (Opening Range Break)"),
    vwap: copy(language, "VWAP Pozisyon/Eğim", "VWAP Position/Slope"),
    structure: copy(language, "Fiyat Yapısı (HH/HL)", "Price Structure (HH/HL)"),
    rsi_short: copy(language, "RSI Kısa Vade", "RSI Short Term"),
    velocity_dir: copy(language, "Velocity Yön", "Velocity Direction"),
    velocity_vol: copy(language, "Velocity Volatilite", "Velocity Volatility"),
    marketCap: copy(language, "Piyasa Değeri", "Market Cap"),
    retention: copy(language, "Intraday Retention", "Intraday Retention"),
    price_change: copy(language, "Günlük Değişim", "Daily Change"),
  };
}

// ===================== Skor Renkleri =====================
/** [0, 100] aralığına clamp */
export function clamp100(v: number): number {
  return Math.max(0, Math.min(100, v));
}

export function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 65) return "text-teal-400";
  if (score >= 50) return "text-cyan-400";
  if (score >= 35) return "text-amber-400";
  if (score >= 20) return "text-orange-400";
  return "text-red-400";
}

export function scoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 65) return "bg-teal-500";
  if (score >= 50) return "bg-cyan-500";
  if (score >= 35) return "bg-amber-500";
  if (score >= 20) return "bg-orange-500";
  return "bg-red-500";
}

/** Sinyal renkleri - UI'da kullanılır */
export function signalColor(signal: string): string {
  switch (signal) {
    case "OVERBOUGHT_RED": return "text-red-500";       // RSI 80+ = YASAK
    case "CAUTION_HOT": return "text-orange-500";       // RSI 75-80 = SICAK
    case "OVERSOLD_CAUTION": return "text-amber-500";   // RSI 25- = AŞIRI SATIM
    case "STRONG_BUY": return "text-emerald-400";
    case "BUY": return "text-teal-400";
    case "NEUTRAL_BULLISH": return "text-cyan-400";
    case "NEUTRAL": return "text-slate-400";
    case "NEUTRAL_BEARISH": return "text-slate-500";
    case "WEAK": return "text-red-400";
    default: return "text-slate-400";
  }
}

export function signalBg(signal: string): string {
  switch (signal) {
    case "OVERBOUGHT_RED": return "bg-red-500";         // RSI 80+ = YASAK
    case "CAUTION_HOT": return "bg-orange-500";         // RSI 75-80 = SICAK
    case "OVERSOLD_CAUTION": return "bg-amber-500";     // RSI 25- = AŞIRI SATIM
    case "STRONG_BUY": return "bg-emerald-500";
    case "BUY": return "bg-teal-500";
    case "NEUTRAL_BULLISH": return "bg-cyan-500";
    case "NEUTRAL": return "bg-slate-500";
    case "NEUTRAL_BEARISH": return "bg-slate-600";
    case "WEAK": return "bg-red-500";
    default: return "bg-slate-500";
  }
}

export function signalLabel(signal: string, language: AppLanguage = "tr"): string {
  switch (signal) {
    case "OVERBOUGHT_RED": return copy(language, "🚨 AŞIRI ALIM - KESİNLİKLE GİRME!", "🚨 OVERBOUGHT - DO NOT ENTER!");
    case "CAUTION_HOT": return copy(language, "⚠️ SICAK BÖLGE - DİKKAT", "⚠️ HOT ZONE - CAUTION");
    case "OVERSOLD_CAUTION": return copy(language, "⚠️ AŞIRI SATIM - RİSKLİ", "⚠️ OVERSOLD - RISKY");
    case "STRONG_BUY": return copy(language, "GÜÇLÜ AL", "STRONG BUY");
    case "BUY": return copy(language, "AL", "BUY");
    case "NEUTRAL_BULLISH": return copy(language, "NÖTR-POZİTİF", "NEUTRAL-BULLISH");
    case "NEUTRAL": return copy(language, "NÖTR", "NEUTRAL");
    case "NEUTRAL_BEARISH": return copy(language, "NÖTR-NEGATİF", "NEUTRAL-BEARISH");
    case "WEAK": return copy(language, "ZAYIF", "WEAK");
    default: return signal;
  }
}

export function confidenceLabel(overall: number): "HIGH" | "MEDIUM" | "LOW" {
  if (overall >= THRESHOLDS.highConfidence) return "HIGH";
  if (overall >= THRESHOLDS.mediumConfidence) return "MEDIUM";
  return "LOW";
}

export function dataQualityLabel(confidence: number): "GOOD" | "FAIR" | "POOR" {
  if (confidence >= 80) return "GOOD";
  if (confidence >= 50) return "FAIR";
  return "POOR";
}
