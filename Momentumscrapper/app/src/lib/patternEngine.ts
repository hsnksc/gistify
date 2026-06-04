/**
 * Pattern Recognition Engine
 * Analyzes 1-month historical data to find:
 * - Correlation between first-30min momentum and continuation
 * - Successful patterns for predicting day-long continuation
 * - Similarity matching between historical patterns and today's stocks
 */

import { fetchStockData, NASDAQ_TICKERS } from "./yahooFinance";
import type { StockResult } from "@/types/scanner";

export interface DayPattern {
  date: string;
  ticker: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  first30mChange: number; // % change from open to high (simulated first 30m)
  restOfDayChange: number; // % change from high to close (rest of day)
  fullDayChange: number; // % change open to close
  volumeRatio: number; // volume vs 20d avg
  rsi14: number;
  gapPct: number;
  vwapDeviation: number;
  continued: boolean; // did the stock continue rising after first 30m?
  successScore: number; // 0-100 how successful was the day
}

export interface TickerPattern {
  ticker: string;
  name: string;
  totalDays: number;
  continuationDays: number;
  continuationRate: number;
  avgFirst30mChange: number;
  avgRestOfDayChange: number;
  avgVolumeOnContinuation: number;
  bestPattern: DayPattern | null;
  avgRsiOnContinuation: number;
  avgGapOnContinuation: number;
  patterns: DayPattern[];
}

export interface PatternDatabase {
  trainedAt: string;
  dateRange: string;
  totalTickers: number;
  totalDaysAnalyzed: number;
  overallContinuationRate: number;
  tickerPatterns: TickerPattern[];
  // Global patterns (averages across all tickers)
  avgContinuationRate: number;
  avgFirst30mWhenContinues: number;
  avgVolumeRatioWhenContinues: number;
  avgRsiWhenContinues: number;
  avgGapWhenContinues: number;
  // Thresholds learned from data
  minFirst30mForContinuation: number;
  minVolumeRatioForContinuation: number;
  optimalRsiRange: [number, number];
}

// Simple RSI calculation for historical data
function calcRsi(prices: number[], period = 14): number {
  if (prices.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses += -diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

// Calculate VWAP for a day's worth of data (approximated from daily bars)
function calcVwapApprox(high: number[], low: number[], close: number[], volume: number[]): number {
  let sum = 0, volSum = 0;
  for (let i = 0; i < close.length; i++) {
    const tp = (high[i] + low[i] + close[i]) / 3;
    sum += tp * volume[i];
    volSum += volume[i];
  }
  return volSum > 0 ? sum / volSum : 0;
}

export async function trainPatterns(
  tickers: string[] = NASDAQ_TICKERS,
  onProgress?: (done: number, total: number, ticker: string) => void
): Promise<PatternDatabase> {
  const tickerPatterns: TickerPattern[] = [];
  let totalDays = 0;
  let totalContinuationDays = 0;

  // Collect all continuation day metrics for global stats
  const allContinuationMetrics = {
    first30m: [] as number[],
    volumeRatio: [] as number[],
    rsi: [] as number[],
    gap: [] as number[],
  };

  for (let i = 0; i < tickers.length; i++) {
    const ticker = tickers[i];
    onProgress?.(i, tickers.length, ticker);

    try {
      const data = await fetchStockData(ticker);
      if (!data || data.close.length < 25) continue;

      const patterns: DayPattern[] = [];
      const avgVol20 = mean(data.volume.slice(-25, -5));

      // Analyze last 20 trading days
      for (let d = data.close.length - 20; d < data.close.length; d++) {
        if (d < 5) continue; // Need at least 5 days of history

        const open = data.open[d];
        const high = data.high[d];
        const low = data.low[d];
        const close = data.close[d];
        const vol = data.volume[d];
        const prevClose = data.close[d - 1];

        // Skip if data is invalid
        if (!open || !high || !close || vol === 0) continue;

        // Simulate first 30min: open -> high (typically ~30-40% of daily range)
        const first30mChange = ((high - open) / open) * 100;

        // Rest of day: high -> close
        const restOfDayChange = ((close - high) / high) * 100;

        // Full day change
        const fullDayChange = ((close - open) / open) * 100;

        // Volume ratio
        const volumeRatio = avgVol20 > 0 ? vol / avgVol20 : 1;

        // RSI using past 15 days up to previous day
        const rsi14 = calcRsi(data.close.slice(0, d));

        // Gap
        const gapPct = ((open - prevClose) / prevClose) * 100;

        // VWAP deviation (approximate)
        const vwapWindow = Math.max(0, d - 10);
        const vwap = calcVwapApprox(
          data.high.slice(vwapWindow, d + 1),
          data.low.slice(vwapWindow, d + 1),
          data.close.slice(vwapWindow, d + 1),
          data.volume.slice(vwapWindow, d + 1)
        );
        const vwapDev = vwap > 0 ? ((close - vwap) / vwap) * 100 : 0;

        // "Continued" = stock kept most of its first-30min gains AND closed positive
        const continued = first30mChange > 0.5 && fullDayChange > first30mChange * 0.3 && close > open;

        // Success score: how much did it gain from entry to close
        const successScore = Math.max(0, Math.min(100, fullDayChange * 10 + 50));

        patterns.push({
          date: new Date(data.timestamps[d] * 1000).toISOString().split("T")[0],
          ticker,
          open, high, low, close, volume: vol,
          first30mChange,
          restOfDayChange,
          fullDayChange,
          volumeRatio,
          rsi14,
          gapPct,
          vwapDeviation: vwapDev,
          continued,
          successScore,
        });
      }

      if (patterns.length < 3) continue;

      const continuationDays = patterns.filter((p) => p.continued);
      const contPatterns = continuationDays;

      if (contPatterns.length > 0) {
        allContinuationMetrics.first30m.push(...contPatterns.map((p) => p.first30mChange));
        allContinuationMetrics.volumeRatio.push(...contPatterns.map((p) => p.volumeRatio));
        allContinuationMetrics.rsi.push(...contPatterns.map((p) => p.rsi14));
        allContinuationMetrics.gap.push(...contPatterns.map((p) => p.gapPct));
      }

      totalDays += patterns.length;
      totalContinuationDays += continuationDays.length;

      const avgVolOnCont = contPatterns.length > 0
        ? mean(contPatterns.map((p) => p.volumeRatio))
        : 1;
      const avgRsiOnCont = contPatterns.length > 0
        ? mean(contPatterns.map((p) => p.rsi14))
        : 50;
      const avgGapOnCont = contPatterns.length > 0
        ? mean(contPatterns.map((p) => p.gapPct))
        : 0;

      tickerPatterns.push({
        ticker,
        name: data.name,
        totalDays: patterns.length,
        continuationDays: continuationDays.length,
        continuationRate: (continuationDays.length / patterns.length) * 100,
        avgFirst30mChange: mean(patterns.map((p) => p.first30mChange)),
        avgRestOfDayChange: mean(patterns.map((p) => p.restOfDayChange)),
        avgVolumeOnContinuation: avgVolOnCont,
        bestPattern: continuationDays.length > 0
          ? continuationDays.reduce((best, p) => p.successScore > best.successScore ? p : best, continuationDays[0])
          : null,
        avgRsiOnContinuation: avgRsiOnCont,
        avgGapOnContinuation: avgGapOnCont,
        patterns,
      });
    } catch (e) {
      console.error(`Pattern training error for ${ticker}:`, e);
    }
  }

  // Calculate global stats
  const overallContRate = totalDays > 0 ? (totalContinuationDays / totalDays) * 100 : 0;

  // Sort and find thresholds
  const sortedFirst30m = [...allContinuationMetrics.first30m].sort((a, b) => a - b);
  const sortedVolRatio = [...allContinuationMetrics.volumeRatio].sort((a, b) => a - b);
  const sortedRsi = [...allContinuationMetrics.rsi].sort((a, b) => a - b);


  const percentile25 = (arr: number[]) => arr[Math.floor(arr.length * 0.25)] || 0;
  const percentile75 = (arr: number[]) => arr[Math.floor(arr.length * 0.75)] || 0;

  return {
    trainedAt: new Date().toISOString(),
    dateRange: "Son 1 ay",
    totalTickers: tickerPatterns.length,
    totalDaysAnalyzed: totalDays,
    overallContinuationRate: Math.round(overallContRate * 10) / 10,
    tickerPatterns: tickerPatterns.sort((a, b) => b.continuationRate - a.continuationRate),
    avgContinuationRate: Math.round(overallContRate * 10) / 10,
    avgFirst30mWhenContinues: Math.round(mean(allContinuationMetrics.first30m) * 100) / 100,
    avgVolumeRatioWhenContinues: Math.round(mean(allContinuationMetrics.volumeRatio) * 100) / 100,
    avgRsiWhenContinues: Math.round(mean(allContinuationMetrics.rsi) * 100) / 100,
    avgGapWhenContinues: Math.round(mean(allContinuationMetrics.gap) * 100) / 100,
    minFirst30mForContinuation: Math.round(percentile25(sortedFirst30m) * 100) / 100,
    minVolumeRatioForContinuation: Math.round(percentile25(sortedVolRatio) * 100) / 100,
    optimalRsiRange: [Math.round(percentile25(sortedRsi)), Math.round(percentile75(sortedRsi))] as [number, number],
  };
}

export interface PatternMatch {
  ticker: string;
  name: string;
  todayScore: number;
  historicalContinuationRate: number;
  similarityScore: number; // 0-100 how similar today is to historical continuation days
  confidence: "HIGH" | "MEDIUM" | "LOW";
  matchingFactors: string[];
  recommendation: string;
}

export function matchPatterns(
  todayResults: StockResult[],
  db: PatternDatabase
): PatternMatch[] {
  const matches: PatternMatch[] = [];

  for (const stock of todayResults) {
    const tp = db.tickerPatterns.find((p) => p.ticker === stock.ticker);
    if (!tp) continue;

    const factors: string[] = [];
    let similarityPoints = 0;
    let maxPoints = 0;

    // Factor 1: First 30m momentum >= historical avg for continuation days
    maxPoints += 20;
    if (stock.openingMomentum >= db.avgFirst30mWhenContinues) {
      similarityPoints += 20;
      factors.push("✓ Açılış momentumu geçmiş devam günleri ortalaması üzerinde");
    } else if (stock.openingMomentum >= db.minFirst30mForContinuation) {
      similarityPoints += 10;
      factors.push("△ Açılış momentumu minimum eşik üzerinde");
    } else {
      factors.push("✗ Açılış momentumu düşük");
    }

    // Factor 2: Volume ratio
    maxPoints += 20;
    if (stock.volumeRatio >= db.avgVolumeRatioWhenContinues) {
      similarityPoints += 20;
      factors.push("✓ Hacim geçmiş devam günleri ortalaması üzerinde");
    } else if (stock.volumeRatio >= db.minVolumeRatioForContinuation) {
      similarityPoints += 10;
      factors.push("△ Hacim minimum eşik üzerinde");
    } else {
      factors.push("✗ Hacim düşük");
    }

    // Factor 3: RSI in optimal range
    maxPoints += 20;
    if (stock.rsi >= db.optimalRsiRange[0] && stock.rsi <= db.optimalRsiRange[1]) {
      similarityPoints += 20;
      factors.push(`✓ RSI optimal aralıkta (${db.optimalRsiRange[0]}-${db.optimalRsiRange[1]})`);
    } else if (stock.rsi >= 45 && stock.rsi <= 70) {
      similarityPoints += 10;
      factors.push("△ RSI kabul edilebilir aralıkta");
    } else {
      factors.push("✗ RSI optimal aralık dışında");
    }

    // Factor 4: VWAP position
    maxPoints += 15;
    if (stock.vwapDeviation > 1) {
      similarityPoints += 15;
      factors.push("✓ Güçlü VWAP üzeri pozisyon");
    } else if (stock.vwapDeviation > 0) {
      similarityPoints += 8;
      factors.push("△ VWAP üzerinde");
    } else {
      factors.push("✗ VWAP altında");
    }

    // Factor 5: Historical continuation rate of this ticker
    maxPoints += 15;
    if (tp.continuationRate >= 60) {
      similarityPoints += 15;
      factors.push(`✓ ${tp.ticker} geçmişte %${Math.round(tp.continuationRate)} devam oranı`);
    } else if (tp.continuationRate >= 40) {
      similarityPoints += 8;
      factors.push(`△ ${tp.ticker} ortalama devam oranı`);
    } else {
      factors.push(`✗ ${tp.ticker} düşük devam oranı (%${Math.round(tp.continuationRate)})`);
    }

    // Factor 6: Overall momentum score
    maxPoints += 10;
    if (stock.score >= 70) {
      similarityPoints += 10;
      factors.push("✓ Yüksek momentum skoru");
    } else if (stock.score >= 50) {
      similarityPoints += 5;
      factors.push("△ Orta momentum skoru");
    } else {
      factors.push("✗ Düşük momentum skoru");
    }

    const similarityScore = maxPoints > 0 ? Math.round((similarityPoints / maxPoints) * 100) : 0;

    let confidence: "HIGH" | "MEDIUM" | "LOW";
    if (similarityScore >= 75 && tp.continuationRate >= 50) confidence = "HIGH";
    else if (similarityScore >= 50) confidence = "MEDIUM";
    else confidence = "LOW";

    let recommendation: string;
    if (confidence === "HIGH") {
      recommendation = "GÜÇLÜ AL / CALL SPREAD - Devam etme olasılığı yüksek";
    } else if (confidence === "MEDIUM") {
      recommendation = "NÖTR / KORUNMALI CALL - Dikkatli takip edin";
    } else {
      recommendation = "BEKLE / İZLE - Sinyal yetersiz";
    }

    if (similarityScore >= 40) {
      matches.push({
        ticker: stock.ticker,
        name: stock.name,
        todayScore: stock.score,
        historicalContinuationRate: Math.round(tp.continuationRate * 10) / 10,
        similarityScore,
        confidence,
        matchingFactors: factors,
        recommendation,
      });
    }
  }

  return matches.sort((a, b) => b.similarityScore - a.similarityScore);
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
