/**
 * Browser Training Engine
 * Kullanıcının browser'ında çalışır. CORS proxy üzerinden
 * Yahoo Finance'den veri çeker ve modeli gerçek verilerle eğitir.
 */

import { NASDAQ_TICKERS } from "./yahooFinance";

// En likit 30 hisse - eğitim için (hızlı tamamlanması için)
const TRAIN_TICKERS = NASDAQ_TICKERS.slice(0, 30);

// CORS Proxy listesi
const PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
];

interface TrainingBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TrainingResult {
  optimalScoreThreshold: number;
  optimalRvol: number;
  optimalRsiMin: number;
  optimalRsiMax: number;
  bestWinRate: number;
  overallWinRate: number;
  totalTrades: number;
  scoreThresholds: Array<{ threshold: number; wr: number; avgPnl: number; trades: number }>;
  rvolThresholds: Array<{ threshold: number; wr: number; avgPnl: number; trades: number }>;
  rsiBands: Array<{ band: string; wr: number; avgPnl: number; trades: number }>;
  dayOfWeek: Array<{ day: string; wr: number; avgPnl: number; trades: number }>;
  gapSizes: Array<{ band: string; wr: number; avgPnl: number; trades: number }>;
  bestCombined: { score: number; rvol: number; rsiMin: number; rsiMax: number; wr: number; n: number } | null;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function jitter(maxMs = 500) {
  return sleep(Math.random() * maxMs);
}

async function fetchBars(ticker: string): Promise<TrainingBar[] | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1y`;

  for (const proxy of PROXIES) {
    try {
      await jitter(200);
      const res = await fetch(proxy + encodeURIComponent(url), { cache: "no-store" });
      if (!res.ok) continue;

      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) continue;

      const timestamps: number[] = result.timestamp;
      const quote = result.indicators.quote[0];
      const bars: TrainingBar[] = [];

      for (let i = 0; i < timestamps.length; i++) {
        const close = quote.close[i];
        if (close === null || close === undefined) continue;
        bars.push({
          date: new Date(timestamps[i] * 1000).toISOString().split("T")[0],
          open: quote.open[i] ?? close,
          high: quote.high[i] ?? close,
          low: quote.low[i] ?? close,
          close,
          volume: quote.volume[i] ?? 0,
        });
      }

      return bars.length >= 50 ? bars : null;
    } catch {
      continue;
    }
  }

  return null;
}

function calcRsi(prices: number[], period = 7): number {
  if (prices.length < period + 1) return 50;
  const deltas = prices.slice(1).map((v, i) => v - prices[i]);
  const gains = deltas.map((d) => (d > 0 ? d : 0));
  const losses = deltas.map((d) => (d < 0 ? -d : 0));
  const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
  if (avgLoss === 0) return 100;
  return Math.max(0, Math.min(100, 100 - 100 / (1 + avgGain / avgLoss)));
}

function calcMomentumScore(bars: TrainingBar[], dayIdx: number): { score: number; rvol: number; rsi: number; gapPct: number } | null {
  if (dayIdx < 20) return null;

  const past = bars.slice(0, dayIdx);
  const today = bars[dayIdx];

  const closes = past.map((b) => b.close);
  const highs = past.map((b) => b.high);
  const lows = past.map((b) => b.low);
  const volumes = past.map((b) => b.volume);

  const avgVol20 = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const prevClose = past[past.length - 1].close;

  const trs: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    trs.push(Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1])));
  }
  const atr = trs.slice(-14).reduce((a, b) => a + b, 0) / 14;

  if (atr === 0 || prevClose === 0) return null;

  // Faktörler
  const rvol = avgVol20 > 0 ? today.volume / avgVol20 : 1;
  const gapPct = ((today.open - prevClose) / prevClose) * 100;

  // RVOL skoru
  const rvolS = rvol < 4 ? (rvol / 4) * 100 : 100;

  // GAP skoru
  let gapS: number;
  if (1 <= gapPct && gapPct <= 4) gapS = 80 + Math.min((4 - gapPct) * 5, 20);
  else if (0.5 <= gapPct && gapPct < 1) gapS = 60 + (gapPct - 0.5) * 40;
  else if (4 < gapPct && gapPct <= 8) gapS = 70 - (gapPct - 4) * 5;
  else if (gapPct > 8) gapS = 40;
  else gapS = 15;

  // ORB skoru (simplified)
  const orbRange = today.high - today.low;
  const orbNorm = orbRange / atr;
  const breakout = today.close > today.open ? 1.0 : 0.5;
  let orbS: number;
  if (orbNorm > 2 && breakout >= 1.0) orbS = 95;
  else if (orbNorm > 1.5) orbS = 80;
  else if (orbNorm > 1) orbS = 65;
  else if (orbNorm > 0.5) orbS = 45;
  else orbS = 30;

  // VWAP skoru
  const recentAvg = closes.slice(-10).reduce((a, b) => a + b, 0) / 10;
  const vwapDev = recentAvg > 0 ? ((today.close - recentAvg) / recentAvg) * 100 : 0;
  let vwapS: number;
  if (vwapDev > 1.5) vwapS = 90;
  else if (vwapDev > 1) vwapS = 85;
  else if (vwapDev > 0.5) vwapS = 70;
  else if (vwapDev > 0) vwapS = 55;
  else if (vwapDev > -0.5) vwapS = 40;
  else vwapS = 25;

  // Yapı skoru
  let structS: number;
  if (highs.length >= 10) {
    let hh = 0, hl = 0;
    for (let i = -10; i < 0; i++) {
      if (highs[i] > highs[i - 1]) hh++;
      if (lows[i] > lows[i - 1]) hl++;
    }
    structS = ((hh / 9) * 100 + (hl / 9) * 100) / 2;
  } else {
    structS = 50;
  }

  // RSI skoru
  const rsi = calcRsi(closes, 7);
  let rsiS: number;
  if (rsi >= 60 && rsi < 75) rsiS = 85;
  else if (rsi >= 55 && rsi < 60) rsiS = 70;
  else if (rsi >= 45 && rsi < 55) rsiS = 55;
  else if (rsi >= 75 && rsi <= 80) rsiS = 60;
  else if (rsi > 80) rsiS = 30;
  else rsiS = 25;

  // Velocity
  const dirMove = (today.close - today.open) / atr;
  let velDir: number;
  if (dirMove > 2.0) velDir = 95;
  else if (dirMove > 1.5) velDir = 85;
  else if (dirMove > 1.0) velDir = 70;
  else if (dirMove > 0.5) velDir = 55;
  else if (dirMove > 0) velDir = 40;
  else if (dirMove > -0.5) velDir = 25;
  else velDir = 15;

  // Retention
  let retS: number;
  if (today.high > 0) {
    const pullback = ((today.high - today.close) / today.high) * 100;
    if (pullback < 0.3) retS = 85;
    else if (pullback < 0.8) retS = 70;
    else if (pullback < 1.5) retS = 55;
    else if (pullback < 3.0) retS = 40;
    else retS = 25;
  } else {
    retS = 50;
  }

  // Ağırlıklı skor
  const score = Math.round(
    rvolS * 0.22 + gapS * 0.12 + orbS * 0.15 + vwapS * 0.15 +
    structS * 0.08 + rsiS * 0.10 + velDir * 0.08 +
    30 * 0.02 + 50 * 0.02 + retS * 0.04 + 30 * 0.02
  );

  return {
    score: Math.max(0, Math.min(100, score)),
    rvol: Math.round(rvol * 100) / 100,
    rsi: Math.round(rsi * 10) / 10,
    gapPct: Math.round(gapPct * 100) / 100,
  };
}

/**
 * Ana eğitim fonksiyonu.
 * Browser'da çalışır, gerçek Yahoo Finance verisi çeker.
 */
export async function runBrowserTraining(
  onProgress?: (current: number, total: number, ticker: string, status: string) => void
): Promise<TrainingResult | null> {
  const allTrades: Array<{
    ticker: string;
    score: number;
    rvol: number;
    rsi: number;
    gapPct: number;
    nextDayChange: number;
    profitable: boolean;
    dayOfWeek: number;
  }> = [];

  // Tickleri 2'şerli gruplar halinde çek (rate limit önleme)
  const CHUNK = 2;
  for (let i = 0; i < TRAIN_TICKERS.length; i += CHUNK) {
    const chunk = TRAIN_TICKERS.slice(i, i + CHUNK);

    for (const ticker of chunk) {
      onProgress?.(i + chunk.indexOf(ticker) + 1, TRAIN_TICKERS.length, ticker, "fetching");

      const bars = await fetchBars(ticker);
      if (!bars) {
        onProgress?.(i + chunk.indexOf(ticker) + 1, TRAIN_TICKERS.length, ticker, "failed");
        continue;
      }

      let tradeCount = 0;
      for (let dayIdx = 20; dayIdx < bars.length - 1; dayIdx++) {
        const result = calcMomentumScore(bars, dayIdx);
        if (!result) continue;

        const today = bars[dayIdx];
        const tomorrow = bars[dayIdx + 1];
        const nextDayChange = ((tomorrow.close - today.close) / today.close) * 100;

        if (result.score >= 40) {
          allTrades.push({
            ticker,
            score: result.score,
            rvol: result.rvol,
            rsi: result.rsi,
            gapPct: result.gapPct,
            nextDayChange: Math.round(nextDayChange * 100) / 100,
            profitable: nextDayChange > 0,
            dayOfWeek: new Date(today.date).getDay(),
          });
          tradeCount++;
        }
      }

      onProgress?.(i + chunk.indexOf(ticker) + 1, TRAIN_TICKERS.length, ticker, `ok (${tradeCount})`);
    }

    // Chunk arası bekleme
    if (i + CHUNK < TRAIN_TICKERS.length) {
      await sleep(2000);
    }
  }

  if (allTrades.length < 30) {
    console.error("[BrowserTrainer] Yetersiz veri:", allTrades.length);
    return null;
  }

  // ANALİZ

  // 1. Skor threshold analizi
  const scoreThresholds = [40, 45, 50, 55, 60, 65, 70].map((t) => {
    const subset = allTrades.filter((x) => x.score >= t);
    const wins = subset.filter((x) => x.profitable).length;
    return {
      threshold: t,
      wr: subset.length > 0 ? Math.round((wins / subset.length) * 1000) / 10 : 0,
      avgPnl: subset.length > 0 ? Math.round((subset.reduce((s, x) => s + x.nextDayChange, 0) / subset.length) * 100) / 100 : 0,
      trades: subset.length,
    };
  }).filter((s) => s.trades >= 5);

  // 2. RVOL analizi
  const rvolThresholds = [1.0, 1.5, 2.0, 2.5, 3.0, 4.0].map((t) => {
    const subset = allTrades.filter((x) => x.rvol >= t);
    const wins = subset.filter((x) => x.profitable).length;
    return {
      threshold: t,
      wr: subset.length > 0 ? Math.round((wins / subset.length) * 1000) / 10 : 0,
      avgPnl: subset.length > 0 ? Math.round((subset.reduce((s, x) => s + x.nextDayChange, 0) / subset.length) * 100) / 100 : 0,
      trades: subset.length,
    };
  }).filter((s) => s.trades >= 5);

  // 3. RSI bantları
  const rsiBands = [
    [30, 45], [45, 55], [55, 65], [65, 75], [75, 85],
  ].map(([lo, hi]) => {
    const subset = allTrades.filter((x) => lo <= x.rsi && x.rsi < hi);
    const wins = subset.filter((x) => x.profitable).length;
    return {
      band: `${lo}-${hi}`,
      wr: subset.length > 0 ? Math.round((wins / subset.length) * 1000) / 10 : 0,
      avgPnl: subset.length > 0 ? Math.round((subset.reduce((s, x) => s + x.nextDayChange, 0) / subset.length) * 100) / 100 : 0,
      trades: subset.length,
    };
  }).filter((s) => s.trades >= 5);

  // 4. Gün analizi
  const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const dayOfWeek = [0, 1, 2, 3, 4].map((d) => {
    const subset = allTrades.filter((x) => x.dayOfWeek === d);
    const wins = subset.filter((x) => x.profitable).length;
    return {
      day: dayNames[d],
      wr: subset.length > 0 ? Math.round((wins / subset.length) * 1000) / 10 : 0,
      avgPnl: subset.length > 0 ? Math.round((subset.reduce((s, x) => s + x.nextDayChange, 0) / subset.length) * 100) / 100 : 0,
      trades: subset.length,
    };
  }).filter((s) => s.trades >= 3);

  // 5. Gap boyutu
  const gapSizes = [
    [0, 1], [1, 2], [2, 3], [3, 5], [5, 10],
  ].map(([lo, hi]) => {
    const subset = allTrades.filter((x) => lo <= x.gapPct && x.gapPct < hi);
    const wins = subset.filter((x) => x.profitable).length;
    return {
      band: `${lo}-${hi}%`,
      wr: subset.length > 0 ? Math.round((wins / subset.length) * 1000) / 10 : 0,
      avgPnl: subset.length > 0 ? Math.round((subset.reduce((s, x) => s + x.nextDayChange, 0) / subset.length) * 100) / 100 : 0,
      trades: subset.length,
    };
  }).filter((s) => s.trades >= 3);

  // 6. Optimal kombine filtresi
  let bestWr = 0;
  let bestCfg: TrainingResult["bestCombined"] = null;

  for (const st of [45, 50, 55, 60]) {
    for (const rt of [1.5, 2.0, 2.5, 3.0]) {
      for (const rmin of [50, 55, 60]) {
        for (const rmax of [75, 80, 85]) {
          const subset = allTrades.filter(
            (x) => x.score >= st && x.rvol >= rt && rmin <= x.rsi && x.rsi <= rmax
          );
          if (subset.length < 10) continue;
          const wins = subset.filter((x) => x.profitable).length;
          const wr = (wins / subset.length) * 100;
          if (wr > bestWr) {
            bestWr = wr;
            bestCfg = { score: st, rvol: rt, rsiMin: rmin, rsiMax: rmax, wr: Math.round(wr * 10) / 10, n: subset.length };
          }
        }
      }
    }
  }

  // Overall
  const overallWins = allTrades.filter((x) => x.profitable).length;
  const overallWr = Math.round((overallWins / allTrades.length) * 1000) / 10;

  return {
    optimalScoreThreshold: bestCfg?.score ?? 55,
    optimalRvol: bestCfg?.rvol ?? 2.0,
    optimalRsiMin: bestCfg?.rsiMin ?? 55,
    optimalRsiMax: bestCfg?.rsiMax ?? 78,
    bestWinRate: bestCfg?.wr ?? overallWr,
    overallWinRate: overallWr,
    totalTrades: allTrades.length,
    scoreThresholds,
    rvolThresholds,
    rsiBands,
    dayOfWeek,
    gapSizes,
    bestCombined: bestCfg,
  };
}

/**
 * Eğitim sonuçlarını localStorage'a kaydet.
 */
export function saveTrainingResults(results: TrainingResult): void {
  localStorage.setItem("momentumTrainingResults", JSON.stringify({
    ...results,
    trainedAt: new Date().toISOString(),
  }));
}

/**
 * localStorage'dan eğitim sonuçlarını yükle.
 */
export function loadTrainingResults(): (TrainingResult & { trainedAt: string }) | null {
  const raw = localStorage.getItem("momentumTrainingResults");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
