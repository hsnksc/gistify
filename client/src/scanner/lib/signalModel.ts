/**
 * Signal Model v4
 * Geçmiş verilerden türetilen eşikler ve ağırlıklar.
 * Eğitim sonuçları varsa onları, yoksa varsayılanları kullanır.
 */

import { loadTrainingResults } from "./browserTrainer";

// Varsayılan eşik değerler (eğitim yapılmadığında kullanılır)
const DEFAULT_THRESHOLDS = {
  minMomentumScore: 55,
  minRvol: 1.8,
  strongRvol: 3.0,
  minGapPct: 0.8,
  optimalGapMin: 1.0,
  optimalGapMax: 4.5,
  rsiMin: 55,
  rsiMax: 78,
  minVwapDeviation: 0.3,
  orbBreakoutMin: 0.5,
  minStructureScore: 55,
  maxRetention: 2.0,
} as const;

// Eğitilmiş eşik değerleri (eğitim sonuçlarından dinamik)
function getSignalThresholds() {
  const trained = loadTrainingResults();
  if (!trained) return { ...DEFAULT_THRESHOLDS };
  return {
    ...DEFAULT_THRESHOLDS,
    minMomentumScore: trained.optimalScoreThreshold,
    minRvol: trained.optimalRvol,
    strongRvol: trained.optimalRvol + 1,
    rsiMin: trained.optimalRsiMin,
    rsiMax: trained.optimalRsiMax,
  };
}

export const SIGNAL_THRESHOLDS = getSignalThresholds();

// ===================== Faktör Ağırlıkları =====================

export const SIGNAL_WEIGHTS = {
  rvol: 0.22,
  gap: 0.12,
  orb: 0.15,
  vwap: 0.15,
  structure: 0.08,
  rsi_short: 0.10,
  velocity_dir: 0.08,
  velocity_vol: 0.02,
  marketCap: 0.02,
  retention: 0.04,
  price_change: 0.02,
} as const;

const totalWeight = Object.values(SIGNAL_WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(totalWeight - 1.0) > 0.01) {
  console.error(`[SignalModel] Ağırlık toplamı ${totalWeight.toFixed(2)} olmalı 1.00`);
}

// ===================== Sektör Bonusları =====================

export const SECTOR_BONUS: Record<string, number> = {
  "Technology": 2,
  "Healthcare": 1,
  "Communication Services": 2,
  "Consumer Cyclical": 1,
  "Financial Services": -1,
  "Utilities": -2,
  "Real Estate": -1,
};

// ===================== Güne Özel Ayarlamalar =====================

export function getDayAdjustment(): number {
  const dow = new Date().getDay();
  const adjustments: Record<number, number> = {
    1: 0,   // Pazartesi
    2: 1,   // Salı
    3: 1,   // Çarşamba
    4: 3,   // Perşembe (en iyi)
    5: -2,  // Cuma (hafta sonu riski)
  };
  return adjustments[dow] ?? 0;
}

// ===================== Model Açıklaması =====================

export function getSignalModelDescription(): string {
  const trained = loadTrainingResults();
  if (trained) {
    return `Signal Model (${new Date(trained.trainedAt).toLocaleDateString("tr-TR")}):
- ${trained.totalTrades} trade analiz edildi
- Optimal entry: ${trained.optimalScoreThreshold}+ skor
- Optimal RVOL: ${trained.optimalRvol}x+
- Optimal RSI: ${trained.optimalRsiMin}-${trained.optimalRsiMax}
- En iyi WR: %${trained.bestWinRate}
- En güçlü faktör: RVOL (hacim patlaması)`;
  }
  return `Varsayılan Signal Model (henüz eğitilmedi):
- Entry threshold: 55+ skor
- Optimal RVOL: 1.8x+
- Optimal RSI: 55-78
- En güçlü faktör: RVOL
- "Modeli Eğit" butonu ile gerçek verilerle eğitin`;
}
