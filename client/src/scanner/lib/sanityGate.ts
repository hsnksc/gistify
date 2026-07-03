/**
 * Sanity Gate v4
 * NaN / Infinity / null / undefined değerlerini engeller.
 * Tüm skorları güvenli aralığa [0, 100] clamp eder.
 */

import { type AppLanguage, t } from "@/lib/i18n";

// ===================== Temel Güvenlik Fonksiyonları =====================

/** Bir değerin "sayısal ve güvenli" olup olmadığını kontrol eder */
export function isSafeNumber(v: unknown): v is number {
  return typeof v === "number" && !isNaN(v) && isFinite(v);
}

/** Güvensiz değeri varsayılan ile değiştirir */
export function safeNumber(v: unknown, fallback: number, min = -Infinity, max = Infinity): number {
  if (!isSafeNumber(v)) return fallback;
  if (v < min || v > max) return fallback;
  return v;
}

/** [0, 100] aralığına clamp */
export function clamp100(v: number): number {
  return Math.max(0, Math.min(100, v));
}

/** [-100, 100] aralığına clamp */
export function clampSymmetric(v: number): number {
  return Math.max(-100, Math.min(100, v));
}

/** Pozitif aralığa clamp */
export function clampPositive(v: number, max: number): number {
  return Math.max(0, Math.min(max, v));
}

// ===================== Skor Validasyonu =====================

export interface ScoreValidationResult {
  isValid: boolean;
  sanitizedScore: number;
  issues: string[];
}

/** Tüm momentum faktör skorlarını validasyondan geçir */
export function validateFactorScores(factors: Record<string, number>, language: AppLanguage = "tr"): ScoreValidationResult {
  const issues: string[] = [];
  const sanitized: Record<string, number> = {};

  for (const [key, val] of Object.entries(factors)) {
    if (!isSafeNumber(val)) {
      issues.push(t("scanner:factorUnsafeValue50", { key, val }));
      sanitized[key] = 50;
    } else if (val < 0 || val > 100) {
      issues.push(t("scanner:factorOutOfRangeClamp", { key, tofixed2: val.toFixed(2) }));
      sanitized[key] = clamp100(val);
    } else {
      sanitized[key] = val;
    }
  }

  const totalScore = Object.values(sanitized).reduce((a, b) => a + b, 0) / Object.keys(sanitized).length;

  return {
    isValid: issues.length === 0,
    sanitizedScore: clamp100(totalScore),
    issues,
  };
}

/** Final skoru üretmeden önce tüm girdileri kontrol et */
export function sanityGate(inputs: {
  rvolS: number; gap: number; orbScore: number; vwap: number;
  structure: number; rsiShort: number; velDir: number; velVol: number;
  mktCap: number; retention: number; pcS: number;
  weights: Record<string, number>;
}, language: AppLanguage = "tr"): { score: number; issues: string[] } {
  const issues: string[] = [];
  const { weights, ...scores } = inputs;

  // 1. Her bir skoru kontrol et
  const safeScores: Record<string, number> = {};
  for (const [key, val] of Object.entries(scores)) {
    if (!isSafeNumber(val)) {
      issues.push(`[SanityGate] ${key} = ${String(val)} (NaN/Infinity/null) → 50`);
      safeScores[key] = 50;
    } else if (val < 0 || val > 100) {
      issues.push(t("scanner:sanitygateOutOfRangeClamp", { key, tofixed2: val.toFixed(2) }));
      safeScores[key] = clamp100(val);
    } else {
      safeScores[key] = val;
    }
  }

  // 2. Ağırlıkları kontrol et
  let weightSum = 0;
  for (const [key, w] of Object.entries(weights)) {
    if (!isSafeNumber(w)) {
      issues.push(t("scanner:sanitygateWeight0", { key, stringW: String(w) }));
      weights[key] = 0;
    } else {
      weightSum += w;
    }
  }
  if (Math.abs(weightSum - 1.0) > 0.01) {
    issues.push(t("scanner:sanitygateWeightSumNormalizing", { tofixed4: weightSum.toFixed(4) }));
    // Normalize et
    for (const key of Object.keys(weights)) {
      weights[key] = weightSum > 0 ? (weights[key] ?? 0) / weightSum : 0;
    }
  }

  // 3. Skoru hesapla
  const score = Math.round(
    safeScores.rvolS * (weights.rvol ?? 0) +
    safeScores.gap * (weights.gap ?? 0) +
    safeScores.orbScore * (weights.orb ?? 0) +
    safeScores.vwap * (weights.vwap ?? 0) +
    safeScores.structure * (weights.structure ?? 0) +
    safeScores.rsiShort * (weights.rsi_short ?? 0) +
    safeScores.velDir * (weights.velocity_dir ?? 0) +
    safeScores.velVol * (weights.velocity_vol ?? 0) +
    safeScores.mktCap * (weights.marketCap ?? 0) +
    safeScores.retention * (weights.retention ?? 0) +
    safeScores.pcS * (weights.price_change ?? 0)
  );

  // 4. Final clamp
  const finalScore = clamp100(score);
  if (finalScore !== score) {
    issues.push(t("scanner:sanitygateFinalScoreClamp100", { score, finalscore: finalScore }));
  }

  if (issues.length > 0) {
    console.warn("[SanityGate] Issues found:", issues);
  }

  return { score: finalScore, issues };
}

// ===================== Yahoo Veri Validasyonu =====================

export interface YahooValidationResult {
  isValid: boolean;
  error?: string;
  dataQuality: number; // 0-100
}

/** Yahoo Finance yanıtını validasyon'dan geçir */
export function validateYahooResponse(json: any, language: AppLanguage = "tr"): YahooValidationResult {
  // Temel yapı kontrolü
  if (!json || typeof json !== "object") {
    return { isValid: false, error: t("scanner:responseIsNotJson"), dataQuality: 0 };
  }
  if (!json.chart?.result?.[0]) {
    if (json.chart?.error) {
      return { isValid: false, error: t("scanner:yahooApiError", { code: json.chart.error.description || json.chart.error.code }), dataQuality: 0 };
    }
    return { isValid: false, error: t("scanner:invalidResponseStructureChartResult"), dataQuality: 0 };
  }

  const result = json.chart.result[0];
  const meta = result.meta;
  const quote = result.indicators?.quote?.[0];
  const timestamps = result.timestamp;

  // Meta kontrolü
  if (!meta || !isSafeNumber(meta.regularMarketPrice)) {
    return { isValid: false, error: t("scanner:metaDataMissingOrInvalid"), dataQuality: 0 };
  }

  // Quote kontrolü
  if (!quote || !Array.isArray(quote.close) || quote.close.length === 0) {
    return { isValid: false, error: t("scanner:priceDataMissing"), dataQuality: 0 };
  }

  // Timestamp kontrolü
  if (!Array.isArray(timestamps) || timestamps.length === 0) {
    return { isValid: false, error: t("scanner:timestampDataMissing"), dataQuality: 0 };
  }

  // Null oranını hesapla
  const total = quote.close.length;
  const nullClose = quote.close.filter((c: unknown) => c === null || c === undefined).length;
  const nullVolume = quote.volume ? quote.volume.filter((v: unknown) => v === null || v === undefined).length : total;

  const closeQuality = 100 - (nullClose / total) * 100;
  const volumeQuality = 100 - (nullVolume / total) * 100;
  const dataQuality = (closeQuality + volumeQuality) / 2;

  // Minimum veri uzunluğu
  if (quote.close.filter((c: unknown) => c !== null).length < 20) {
    return { isValid: false, error: t("scanner:insufficientDataDaysMinimum20", { total }), dataQuality };
  }

  return { isValid: true, dataQuality };
}

/** Candle veri array'lerini validasyon'dan geçir */
export function validateCandleData(
  timestamps: number[],
  open: number[],
  high: number[],
  low: number[],
  close: number[],
  volume: number[],
  language: AppLanguage = "tr"
): { isValid: boolean; error?: string } {
  if (!Array.isArray(timestamps) || timestamps.length < 20) {
    return { isValid: false, error: t("scanner:insufficientTimestamps", { length0: timestamps?.length ?? 0 }) };
  }
  if (!Array.isArray(close) || close.length < 20) {
    return { isValid: false, error: t("scanner:insufficientCloseData", { length0: close?.length ?? 0 }) };
  }
  if (!Array.isArray(volume) || volume.length < 20) {
    return { isValid: false, error: t("scanner:insufficientVolumeData", { length0: volume?.length ?? 0 }) };
  }

  // Array uzunlukları eşit mi?
  const len = timestamps.length;
  if (open.length !== len || high.length !== len || low.length !== len || close.length !== len || volume.length !== len) {
    return { isValid: false, error: t("scanner:arrayLengthMismatchTsO", { len, length: open.length, length2: high.length, length3: low.length, length4: close.length, length5: volume.length }) };
  }

  // Tüm close değerleri sayısal mı?
  const invalidClose = close.filter((c) => !isSafeNumber(c));
  if (invalidClose.length > close.length * 0.3) {
    return { isValid: false, error: t("scanner:tooManyInvalidCloseValues", { length: invalidClose.length, length2: close.length }) };
  }

  return { isValid: true };
}
