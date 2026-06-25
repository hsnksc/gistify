/**
 * Post-Earnings / News Momentum Screener v4
 *
 * Kazanç, haber veya önemli bir katalizör sonrası:
 * 1. İlk yarım saatte güçlü hacimli hareket (gap + volume spike)
 * 2. Aynı gün devam eden momentum (retention yüksek)
 * 3. Ertesi gün continuation olasılığı yüksek hisseleri bulur
 *
 * Skorlama: PEAD (Post-Earnings Announcement Drift) + Gap-And-Go + Continuation
 */

import { fetchYF, fetchStockData } from "./yahooFinance";
import { sanityGate } from "./sanityGate";
import { clamp100 } from "./scoreConfig";
import { type AppLanguage } from "@/lib/i18n";

// ===================== Tipler =====================

export interface GapDay {
  date: string;
  prevClose: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  avgVolume20d: number;
  gapPct: number;
  continuationPct: number; // Aynı gün open'tan close'a kadar ek hareket
  nextDayClose?: number;   // Ertesi gün kapanış (continuation için)
  nextDayChange?: number;  // Ertesi gün değişim %
  rvol: number;
  retention: number;       // (high - close) / high — düşük = güçlü
  dayOfWeek: number;
}

export interface TickerHistory {
  ticker: string;
  name: string;
  gapDays: GapDay[];
  avgContinuationOnGapUp: number;  // Gap-up günlerinde ortalama devam %
  nextDayWinRate: number;          // Gap-up sonrası ertesi gün kazanma oranı
  avgNextDayChange: number;        // Gap-up sonrası ertesi gün ortalama değişim
  bestGapUpDay: GapDay | null;     // En iyi gap-up günü
  historicalGapUps: number;        // Geçmiş gap-up sayısı
}

export interface PostEarningsMomentumResult {
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  prevClose: number;
  gapPct: number;
  openPrice: number;
  high30m: number;
  low30m: number;
  current: number;
  volume: number;
  avgVolume20d: number;
  rvol: number;
  continuationPct: number;
  retentionScore: number;

  // Historical stats
  historicalGapUps: number;
  nextDayWinRate: number;
  avgNextDayChange: number;

  // Composite score
  peadScore: number;          // 0-100: Post-earnings announcement drift score
  continuationProbability: number; // 0-100: Ertesi gün devam olasılığı
  signal: "STRONG_CONTINUATION" | "CONTINUATION" | "NEUTRAL" | "FADE" | "STRONG_FADE";
  confidence: "HIGH" | "MEDIUM" | "LOW";

  // Explanations
  reasons: string[];
}

// ===================== Yardımcı =====================

function mean(arr: number[]): number {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ===================== 1. Geçmiş Gap Analizi =====================

/**
 * Bir hissenin geçmişteki tüm gap-up günlerini analiz et.
 * Bu, next-day continuation tahmini için kullanılır.
 */
export async function analyzeTickerGapHistory(ticker: string): Promise<TickerHistory | null> {
  // 1 yıllık daily veri çek
  const json = await fetchYF(ticker, "1d", "1y");
  if (!json?.chart?.result?.[0]) return null;

  const result = json.chart.result[0];
  const quote = result.indicators.quote[0];
  const timestamps: number[] = result.timestamp;
  const meta = result.meta;

  const bars: Array<{
    date: string; open: number; high: number; low: number;
    close: number; volume: number; timestamp: number;
  }> = [];

  for (let i = 0; i < timestamps.length; i++) {
    if (quote.close[i] === null) continue;
    bars.push({
      date: new Date(timestamps[i] * 1000).toISOString().split("T")[0],
      open: quote.open[i] ?? quote.close[i],
      high: quote.high[i] ?? quote.close[i],
      low: quote.low[i] ?? quote.close[i],
      close: quote.close[i],
      volume: quote.volume[i] ?? 0,
      timestamp: timestamps[i],
    });
  }

  if (bars.length < 30) return null;

  const gapDays: GapDay[] = [];

  for (let i = 1; i < bars.length; i++) {
    const today = bars[i];
    const prev = bars[i - 1];
    const gapPct = ((today.open - prev.close) / prev.close) * 100;

    // Gap-up günü: Açılış > önceki kapanışın en az %1 üzerinde
    if (gapPct >= 1.0) {
      const avgVol20 = i >= 20
        ? mean(bars.slice(i - 20, i).map((b) => b.volume))
        : mean(bars.slice(0, i).map((b) => b.volume));

      const rvol = avgVol20 > 0 ? today.volume / avgVol20 : 1;

      // Ertesi gün verisi var mı?
      let nextDayClose: number | undefined;
      let nextDayChange: number | undefined;
      if (i + 1 < bars.length) {
        nextDayClose = bars[i + 1].close;
        nextDayChange = ((bars[i + 1].close - today.close) / today.close) * 100;
      }

      gapDays.push({
        date: today.date,
        prevClose: prev.close,
        open: today.open,
        high: today.high,
        low: today.low,
        close: today.close,
        volume: today.volume,
        avgVolume20d: avgVol20,
        gapPct: Math.round(gapPct * 100) / 100,
        continuationPct: Math.round(((today.close - today.open) / today.open) * 100 * 100) / 100,
        nextDayClose,
        nextDayChange,
        rvol: Math.round(rvol * 100) / 100,
        retention: Math.round(((today.high - today.close) / Math.max(today.high, 0.001)) * 100 * 100) / 100,
        dayOfWeek: new Date(today.date).getDay(),
      });
    }
  }

  // İstatistikler
  const gapUps = gapDays.filter((g) => g.gapPct > 0);
  const withNextDay = gapUps.filter((g) => g.nextDayChange !== undefined);

  const avgContinuation = gapUps.length > 0
    ? mean(gapUps.map((g) => g.continuationPct))
    : 0;

  const nextDayWinRate = withNextDay.length > 0
    ? (withNextDay.filter((g) => (g.nextDayChange ?? 0) > 0).length / withNextDay.length) * 100
    : 50;

  const avgNextDayChange = withNextDay.length > 0
    ? mean(withNextDay.map((g) => g.nextDayChange ?? 0))
    : 0;

  const bestGapUp = gapUps.length > 0
    ? gapUps.reduce((best, g) => ((g.nextDayChange ?? -999) > (best.nextDayChange ?? -999)) ? g : best)
    : null;

  return {
    ticker,
    name: meta.shortName || ticker,
    gapDays,
    avgContinuationOnGapUp: Math.round(avgContinuation * 100) / 100,
    nextDayWinRate: Math.round(nextDayWinRate * 10) / 10,
    avgNextDayChange: Math.round(avgNextDayChange * 100) / 100,
    bestGapUpDay: bestGapUp,
    historicalGapUps: gapUps.length,
  };
}

// ===================== 2. Bugünün Gap-Up Hisse Taraması =====================

/**
 * Bugün gap-up yapan hisseleri bul ve PEAD skoru hesapla.
 */
export async function scanPostEarningsMomentum(
  tickers: string[],
  onProgress?: (current: number, total: number, ticker: string) => void,
  language: AppLanguage = "tr"
): Promise<PostEarningsMomentumResult[]> {
  const results: PostEarningsMomentumResult[] = [];
  const CHUNK = 3;

  // Önce geçmiş analizini paralel yap (chunk'lı)
  const histories: Record<string, TickerHistory> = {};

  for (let i = 0; i < tickers.length; i += CHUNK) {
    const chunk = tickers.slice(i, i + CHUNK);
    const settled = await Promise.allSettled(
      chunk.map((t) => analyzeTickerGapHistory(t))
    );

    for (let j = 0; j < settled.length; j++) {
      const r = settled[j];
      if (r.status === "fulfilled" && r.value) {
        histories[r.value.ticker] = r.value;
      }
      onProgress?.(Math.min(i + j + 1, tickers.length), tickers.length, chunk[j]);
    }
  }

  // Şimdi bugünün verisini çek ve gap-up kontrolü yap
  for (const [ticker, history] of Object.entries(histories)) {
    const data = await fetchStockData(ticker);
    if (!data) continue;

    const todayClose = data.currentPrice;
    const prevClose = data.prevClose;
    const todayOpen = data.open[data.open.length - 1];
    const todayHigh = data.high[data.high.length - 1];
    const todayLow = data.low[data.low.length - 1];
    const todayVolume = data.volume[data.volume.length - 1];
    const avgVol20 = mean(data.volume.slice(-20));

    // Bugün gap-up mu?
    const gapPct = ((todayOpen - prevClose) / prevClose) * 100;
    if (gapPct < 1.0) continue; // Gap-up değil, atla

    // Bugünün continuation'ı
    const continuationPct = ((todayClose - todayOpen) / todayOpen) * 100;

    // Retention: high'tan close'a kadar ne kadar geri çekilme
    const retention = todayHigh > 0 ? ((todayHigh - todayClose) / todayHigh) * 100 : 0;
    const retentionScore = Math.max(0, 100 - retention * 20); // retention az = skor yüksek

    const rvol = avgVol20 > 0 ? todayVolume / avgVol20 : 1;

    // ===================== PEAD Skor Hesaplama =====================

    // W1: Gap kalitesi (0.20)
    let gapScore: number;
    if (gapPct >= 1 && gapPct <= 4) gapScore = 80 + Math.min((4 - gapPct) * 5, 20);
    else if (gapPct > 4 && gapPct <= 8) gapScore = 70 - (gapPct - 4) * 5;
    else if (gapPct > 8) gapScore = 40;
    else gapScore = 30;

    // W2: Volume confirmation (0.25)
    const volScore = rvol >= 4 ? 100 : rvol >= 2 ? 75 : rvol >= 1.5 ? 50 : 25;

    // W3: Intraday continuation (0.20)
    // Gap-up sonrası gün içi devam
    const contScore = continuationPct > 2 ? 90 : continuationPct > 0 ? 70 : continuationPct > -1 ? 50 : 30;

    // W4: Retention (0.15)
    // High'tan geri çekilme ne kadar az?
    const retScore = retentionScore;

    // W5: Historical next-day win rate (0.20)
    const histScore = history.nextDayWinRate;

    const { score: peadScore } = sanityGate({
      rvolS: gapScore, gap: volScore, orbScore: contScore,
      vwap: retScore, structure: histScore, rsiShort: 50,
      velDir: 50, velVol: 50, mktCap: 50, retention: 50, pcS: 50,
      weights: {
        rvol: 0.20, gap: 0.25, orb: 0.20, vwap: 0.15,
        structure: 0.20, rsi_short: 0, velocity_dir: 0,
        velocity_vol: 0, marketCap: 0, retention: 0, price_change: 0,
      },
    }, language);

    // Continuation Probability: Ertesi gün devam olasılığı
    const contProb = Math.round(
      (history.nextDayWinRate * 0.35) +       // Geçmiş devam oranı
      (Math.min(100, rvol * 20) * 0.20) +     // Hacim onayı
      (retentionScore * 0.15) +               // Retention
      (continuationPct > 0 ? 30 : 10) * 0.15 + // Gün içi devam
      (gapPct >= 1 && gapPct <= 5 ? 20 : 10) * 0.15  // Gap kalitesi
    );

    // Signal
    let signal: PostEarningsMomentumResult["signal"];
    if (peadScore >= 75 && contProb >= 60) signal = "STRONG_CONTINUATION";
    else if (peadScore >= 60 && contProb >= 50) signal = "CONTINUATION";
    else if (peadScore >= 45) signal = "NEUTRAL";
    else if (peadScore >= 30) signal = "FADE";
    else signal = "STRONG_FADE";

    // Confidence
    const confidence: PostEarningsMomentumResult["confidence"] =
      history.historicalGapUps >= 5 ? "HIGH" : history.historicalGapUps >= 2 ? "MEDIUM" : "LOW";

    // Reasons
    const reasons: string[] = [];
    reasons.push(`Gap-up: %${gapPct.toFixed(2)} — ${gapPct >= 1 && gapPct <= 4 ? "İdeal aralık" : gapPct > 8 ? "Fazla geniş, fade riski" : "Kabul edilebilir"}`);
    reasons.push(`RVOL: ${rvol.toFixed(1)}x — ${rvol >= 2 ? "Hacim patlaması onaylıyor" : "Hacim zayıf"}`);
    reasons.push(`Gün içi devam: ${continuationPct >= 0 ? "+" : ""}${continuationPct.toFixed(2)}% — ${continuationPct > 0 ? "Momentum güçlü" : "Erken ters dönüş"}`);
    reasons.push(`Retention: %${retention.toFixed(2)} geri çekilme — ${retention < 1 ? "Güçlü tutma" : retention < 3 ? "Normal" : "Zayıf"}`);
    reasons.push(`Geçmiş next-day WR: %${history.nextDayWinRate} (${history.historicalGapUps} örnek)`);
    if (history.avgNextDayChange > 1) {
      reasons.push(`Geçmişte gap-up sonrası ort. +${history.avgNextDayChange}% ertesi gün kazanç`);
    }

    results.push({
      ticker,
      name: history.name,
      sector: data.sector || "N/A",
      currentPrice: Math.round(todayClose * 100) / 100,
      prevClose: Math.round(prevClose * 100) / 100,
      gapPct: Math.round(gapPct * 100) / 100,
      openPrice: Math.round(todayOpen * 100) / 100,
      high30m: Math.round(todayHigh * 100) / 100,
      low30m: Math.round(todayLow * 100) / 100,
      current: Math.round(todayClose * 100) / 100,
      volume: todayVolume,
      avgVolume20d: Math.round(avgVol20),
      rvol: Math.round(rvol * 100) / 100,
      continuationPct: Math.round(continuationPct * 100) / 100,
      retentionScore: Math.round(retentionScore),
      historicalGapUps: history.historicalGapUps,
      nextDayWinRate: history.nextDayWinRate,
      avgNextDayChange: history.avgNextDayChange,
      peadScore,
      continuationProbability: clamp100(contProb),
      signal,
      confidence,
      reasons,
    });
  }

  // Skora göre sırala
  results.sort((a, b) => b.peadScore - a.peadScore);
  return results;
}

// ===================== 3. En İyi Continuation Adayları =====================

export interface ContinuationPick {
  ticker: string;
  peadScore: number;
  continuationProbability: number;
  signal: string;
  rationale: string;
}

export function getTopContinuationPicks(
  results: PostEarningsMomentumResult[],
  maxPicks = 5
): ContinuationPick[] {
  const filtered = results.filter(
    (r) => r.peadScore >= 55 && r.continuationProbability >= 45
  );

  return filtered.slice(0, maxPicks).map((r) => ({
    ticker: r.ticker,
    peadScore: r.peadScore,
    continuationProbability: r.continuationProbability,
    signal: r.signal,
    rationale: r.reasons.join(" | "),
  }));
}
