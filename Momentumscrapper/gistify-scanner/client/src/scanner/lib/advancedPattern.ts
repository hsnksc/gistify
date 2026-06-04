/**
 * Gelişmiş Pattern Recognition AI
 * - Piyasa Rejimi Tespiti (SPY volatilitesi)
 * - Sektör Momentum Bonusu
 * - Haftalık Devam Deseni
 * - Wilson Score Güven Aralığı
 */

import { fetchStockData } from "./yahooFinance";
import type { StockResult, ScanResponse } from "@/scanner/types";

export type MarketRegime = "LOW_VOL" | "NORMAL" | "HIGH_VOL";

export interface DayOfWeekStats {
  day: string;
  totalDays: number;
  continuationDays: number;
  continuationRate: number;
}

export interface AdvancedPatternResult {
  regime: MarketRegime;
  regimeLabel: string;
  sectorAverages: Record<string, number>;
  sectorStdDevs: Record<string, number>;
  dayOfWeekStats: DayOfWeekStats[];
  patternMatches: AdvancedPatternMatch[];
}

export interface AdvancedPatternMatch {
  ticker: string;
  name: string;
  baseScore: number;
  regimeAdjustedScore: number;
  sectorBonus: number;
  dayOfWeekBonus: number;
  continuationRate: number;
  confidenceInterval: [number, number]; // Wilson 95%
  sampleSize: number;
  isHighConfidence: boolean;
  matchingFactors: string[];
}

// =================== 3a. Piyasa Rejimi Tespiti ===================

export async function detectMarketRegime(): Promise<{
  regime: MarketRegime;
  label: string;
  spyDailyVol: number;
}> {
  try {
    const data = await fetchStockData("SPY");
    if (!data || data.close.length < 21) {
      return { regime: "NORMAL", label: "Normal Rejim", spyDailyVol: 0 };
    }

    // Calculate daily returns
    const returns: number[] = [];
    for (let i = 1; i < data.close.length; i++) {
      returns.push((data.close[i] - data.close[i - 1]) / data.close[i - 1]);
    }

    // 20-day rolling standard deviation (annualized)
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
    const dailyVol = Math.sqrt(variance);

    const regime: MarketRegime =
      dailyVol < 0.01 ? "LOW_VOL" : dailyVol > 0.02 ? "HIGH_VOL" : "NORMAL";

    const label =
      regime === "LOW_VOL"
        ? "Düşük Volatilite Rejimi"
        : regime === "HIGH_VOL"
        ? "Yüksek Volatilite Rejimi"
        : "Normal Rejim";

    return { regime, label, spyDailyVol: Math.round(dailyVol * 10000) / 100 };
  } catch {
    return { regime: "NORMAL", label: "Normal Rejim", spyDailyVol: 0 };
  }
}

// =================== 3b. Sektör Momentum ===================

export function calculateSectorMomentum(
  stocks: StockResult[]
): { averages: Record<string, number>; stdDevs: Record<string, number> } {
  const sectorScores: Record<string, number[]> = {};

  for (const s of stocks) {
    if (!sectorScores[s.sector]) sectorScores[s.sector] = [];
    sectorScores[s.sector].push(s.score);
  }

  const averages: Record<string, number> = {};
  const stdDevs: Record<string, number> = {};

  for (const [sector, scores] of Object.entries(sectorScores)) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((a, b) => a + (b - avg) ** 2, 0) / scores.length;
    averages[sector] = avg;
    stdDevs[sector] = Math.sqrt(variance);
  }

  return { averages, stdDevs };
}

export function getSectorBonus(
  stock: StockResult,
  sectorAvgs: Record<string, number>,
  sectorStdDevs: Record<string, number>
): number {
  const avg = sectorAvgs[stock.sector];
  const std = sectorStdDevs[stock.sector];
  if (!avg || !std || std === 0) return 0;

  const zScore = (stock.score - avg) / std;
  // +10 if 1.5+ standard deviations above sector mean
  return zScore >= 1.5 ? 10 : zScore >= 1.0 ? 5 : 0;
}

// =================== 3c. Haftalık Devam Deseni ===================

export function analyzeDayOfWeek(
  historicalData: Array<{
    date: string; // YYYY-MM-DD
    first30mChange: number;
    fullDayChange: number;
  }>
): DayOfWeekStats[] {
  const dayNames = [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ];
  const buckets: Record<number, { total: number; cont: number }> = {
    1: { total: 0, cont: 0 },
    2: { total: 0, cont: 0 },
    3: { total: 0, cont: 0 },
    4: { total: 0, cont: 0 },
    5: { total: 0, cont: 0 },
  };

  for (const d of historicalData) {
    const dayOfWeek = new Date(d.date).getDay();
    if (dayOfWeek < 1 || dayOfWeek > 5) continue;

    buckets[dayOfWeek].total++;
    // Continued = first 30m gain was followed by positive close
    if (d.first30mChange > 0.5 && d.fullDayChange > d.first30mChange * 0.3) {
      buckets[dayOfWeek].cont++;
    }
  }

  return [1, 2, 3, 4, 5].map((dow) => ({
    day: dayNames[dow],
    totalDays: buckets[dow].total,
    continuationDays: buckets[dow].cont,
    continuationRate:
      buckets[dow].total > 0
        ? Math.round((buckets[dow].cont / buckets[dow].total) * 1000) / 10
        : 0,
  }));
}

export function getDayOfWeekBonus(
  todayDayOfWeek: number,
  dayStats: DayOfWeekStats[]
): number {
  // Monday=1, Friday=5
  const stat = dayStats.find((d) => {
    const idx = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"].indexOf(d.day);
    return idx === todayDayOfWeek;
  });
  if (!stat || stat.totalDays < 5) return 0;
  return stat.continuationRate >= 60 ? 5 : stat.continuationRate >= 45 ? 2 : 0;
}

// =================== 3d. Wilson Score Güven Aralığı ===================

/**
 * Wilson Score Interval for binomial proportion
 * CI = (p + z²/2n ± z√(p(1-p)/n + z²/4n²)) / (1 + z²/n)
 */
export function wilsonScoreInterval(
  successes: number,
  trials: number,
  confidence = 0.95
): [number, number] {
  if (trials === 0) return [0, 0];
  const z = confidence === 0.95 ? 1.96 : 2.576;
  const p = successes / trials;
  const n = trials;

  const denom = 1 + (z * z) / n;
  const centre = p + (z * z) / (2 * n);
  const halfWidth =
    z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));

  const lower = Math.max(0, (centre - halfWidth) / denom);
  const upper = Math.min(1, (centre + halfWidth) / denom);

  return [Math.round(lower * 1000) / 10, Math.round(upper * 1000) / 10];
}

// =================== Combined Advanced Pattern Match ===================

export async function runAdvancedPatternAnalysis(
  scanResponse: ScanResponse,
  historicalPatterns?: Array<{
    ticker: string;
    continuationRate: number;
    continuationDays: number;
    totalDays: number;
  }>
): Promise<AdvancedPatternResult> {
  // 3a: Detect market regime
  const regimeResult = await detectMarketRegime();

  // 3b: Sector momentum
  const { averages: sectorAvgs, stdDevs: sectorStdDevs } =
    calculateSectorMomentum(scanResponse.stocks);

  // 3c: Day of week (use current day)
  const todayDow = new Date().getDay();
  const dayStats = analyzeDayOfWeek(
    (historicalPatterns || []).map((h) => ({
      date: new Date().toISOString().split("T")[0],
      first30mChange: 1,
      fullDayChange: h.continuationDays > h.totalDays / 2 ? 2 : -1,
    }))
  );
  const dayBonus = getDayOfWeekBonus(todayDow, dayStats);

  // 3d: Build matches with confidence intervals
  const matches: AdvancedPatternMatch[] = scanResponse.stocks.map((stock) => {
    const hp = historicalPatterns?.find((h) => h.ticker === stock.ticker);

    const contRate = hp ? (hp.continuationDays / hp.totalDays) * 100 : 50;
    const sampleSize = hp?.totalDays || 0;

    // Wilson CI
    const [ciLow, ciHigh] = hp
      ? wilsonScoreInterval(hp.continuationDays, hp.totalDays)
      : ([0, 0] as [number, number]);

    // Sector bonus
    const sectorBonus = getSectorBonus(stock, sectorAvgs, sectorStdDevs);

    // Regime adjustment
    let regimeAdjustment = 0;
    if (regimeResult.regime === "LOW_VOL" && stock.volumeRatio >= 2) {
      regimeAdjustment = 5; // Low vol + high volume = strong signal
    } else if (regimeResult.regime === "HIGH_VOL" && stock.rsi < 70) {
      regimeAdjustment = 3; // High vol but not overbought
    }

    const totalBonus = sectorBonus + regimeAdjustment + dayBonus;
    const adjustedScore = Math.min(100, stock.score + totalBonus);

    const factors: string[] = [];
    if (sectorBonus >= 10) factors.push("Sektör ortalamasının 1.5σ üzerinde (+10)");
    else if (sectorBonus >= 5) factors.push("Sektörün üzerinde (+5)");
    if (regimeAdjustment > 0) factors.push(`${regimeResult.label} uyumlu (+${regimeAdjustment})`);
    if (dayBonus > 0) factors.push(`Bugünün devam olasılığı yüksek (+${dayBonus})`);

    return {
      ticker: stock.ticker,
      name: stock.name,
      baseScore: stock.score,
      regimeAdjustedScore: adjustedScore,
      sectorBonus,
      dayOfWeekBonus: dayBonus,
      continuationRate: Math.round(contRate * 10) / 10,
      confidenceInterval: [ciLow, ciHigh],
      sampleSize,
      isHighConfidence: sampleSize >= 10 && ciLow >= 40,
      matchingFactors: factors,
    };
  });

  // Sort by adjusted score
  matches.sort((a, b) => b.regimeAdjustedScore - a.regimeAdjustedScore);

  return {
    regime: regimeResult.regime,
    regimeLabel: regimeResult.label,
    sectorAverages: sectorAvgs,
    sectorStdDevs: sectorStdDevs,
    dayOfWeekStats: dayStats,
    patternMatches: matches,
  };
}
