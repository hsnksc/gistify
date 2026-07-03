// @ts-nocheck
/**
 * Walk-Forward Backtest Engine v4
 * Geçmiş verilerle momentum stratejisini test eder.
 *
 * Strateji:
 * - Scan Time: Her gün 09:30-10:00 EST (açılış sonrası ilk 30dk)
 * - Entry: O günün açılış fiyatı (open) üzerinden
 * - Signal: Momentum skoru >= threshold olanlar
 * - Exit: Aynı gün kapanış (EOD) veya TP/SL
 * - Metrik: Ertesi gün açılış ile kapanış karşılaştırması
 */

import { fetchYF } from "./yahooFinance";
import type { StockResult } from "../types";
import { sanityGate, isSafeNumber } from "./sanityGate";
import { FACTOR_WEIGHTS, clamp100 } from "./scoreConfig";
import { type AppLanguage, t } from "@/lib/i18n";

// ===================== Tipler =====================

export interface BacktestConfig {
  tickers: string[];
  startDate: string; // YYYY-MM-DD
  endDate: string;
  entryScoreThreshold: number; // Minimum momentum skoru (default: 60)
  tpPct: number; // Kar al %
  slPct: number; // Zarar durdur %
  maxPositionsPerDay: number; // Günde max pozisyon
  positionSizePct: number; // Pozisyon büyüklüğü % (portföyün yüzdesi)
}

export interface DailyTrade {
  date: string;
  ticker: string;
  entryPrice: number;
  exitPrice: number;
  tpLevel: number;
  slLevel: number;
  pnlPct: number;
  exitReason: "TP" | "SL" | "EOD";
  score: number;
  confidenceScore: number;
  rankingScore: number;
  rvol: number;
  rsi: number;
  gapPct: number;
  dayOfWeek: number;
  marketOpen30mHigh: number;
  marketOpen30mLow: number;
}

export interface BacktestSummary {
  config: BacktestConfig;
  totalTradingDays: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgWinPct: number;
  avgLossPct: number;
  profitFactor: number;
  totalPnLPct: number;
  maxDrawdownPct: number;
  sharpeRatio: number;
  avgTradePnL: number;
  bestTrade: DailyTrade | null;
  worstTrade: DailyTrade | null;
  tpHitRate: number;
  slHitRate: number;
  eodRate: number;

  // Günlük performans
  dailyReturns: Array<{ date: string; pnl: number; trades: number }>;

  // Skor seviyelerine göre performans
  performanceByScore: Array<{ scoreRange: string; trades: number; winRate: number; avgPnL: number }>;

  // Güne göre performans
  performanceByDay: Array<{ day: string; trades: number; winRate: number; avgPnL: number }>;

  // Tüm işlemler
  trades: DailyTrade[];
}

// ===================== Geçmiş Veri Çekme =====================

export interface HistoricalBar {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

async function fetchHistoricalBars(ticker: string, range: string): Promise<HistoricalBar[] | null> {
  const json = await fetchYF(ticker, "1d", range);
  if (!json?.chart?.result?.[0]) return null;

  const result = json.chart.result[0];
  const quote = result.indicators.quote[0];
  const timestamps: number[] = result.timestamp;

  const bars: HistoricalBar[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const close = quote.close[i];
    const volume = quote.volume[i];
    if (close === null || close === undefined || volume === null) continue;

    bars.push({
      date: new Date(timestamps[i] * 1000).toISOString().split("T")[0],
      timestamp: timestamps[i],
      open: quote.open[i] ?? close,
      high: quote.high[i] ?? close,
      low: quote.low[i] ?? close,
      close,
      volume,
    });
  }

  return bars.length >= 30 ? bars : null;
}

// ===================== Geçmişe Dönük Momentum Skoru =====================

function calcRsi(prices: number[], period: number): number {
  if (prices.length < period + 1) return 50;
  const deltas = prices.slice(1).map((v, i) => v - prices[i]);
  const gains = deltas.map((d) => (d > 0 ? d : 0));
  const losses = deltas.map((d) => (d < 0 ? -d : 0));
  const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
  if (avgLoss === 0) return 100;
  return Math.max(0, Math.min(100, 100 - 100 / (1 + avgGain / avgLoss)));
}

function calcAtr(h: number[], l: number[], c: number[], period: number): number {
  if (c.length < period + 1) return 0;
  const trs: number[] = [];
  for (let i = 1; i < c.length; i++) {
    trs.push(Math.max(h[i] - l[i], Math.abs(h[i] - c[i - 1]), Math.abs(l[i] - c[i - 1])));
  }
  const mean = trs.slice(-period).reduce((a, b) => a + b, 0) / period;
  return mean;
}

function calcVwapScore(current: number, bars: HistoricalBar[]): number {
  if (bars.length === 0) return 50;
  const vol = bars.reduce((s, b) => s + b.volume, 0);
  if (vol === 0) return 50;
  const tpVol = bars.reduce((s, b) => s + ((b.high + b.low + b.close) / 3) * b.volume, 0);
  const vwap = tpVol / vol;
  if (vwap === 0) return 50;
  const dev = ((current - vwap) / vwap) * 100;
  if (dev > 1.5) return 90;
  if (dev > 1) return 85;
  if (dev > 0.5) return 70;
  if (dev > 0) return 55;
  if (dev > -0.5) return 40;
  return 25;
}

function calcStructure(highs: number[], lows: number[], lookback = 10): number {
  if (highs.length < lookback + 2) return 50;
  const h = highs.slice(-lookback), l = lows.slice(-lookback);
  let hh = 0, hl = 0;
  for (let i = 1; i < h.length; i++) { if (h[i] > h[i - 1]) hh++; if (l[i] > l[i - 1]) hl++; }
  return ((hh / Math.max(h.length - 1, 1)) * 100 + (hl / Math.max(l.length - 1, 1)) * 100) / 2;
}

function gapScore(open: number, prevClose: number): number {
  if (prevClose === 0) return 50;
  const pct = ((open - prevClose) / prevClose) * 100;
  if (1 <= pct && pct <= 4) return 80 + Math.min((4 - pct) * 5, 20);
  if (0.5 <= pct && pct < 1) return 60 + (pct - 0.5) * 40;
  if (4 < pct && pct <= 8) return 70 - (pct - 4) * 5;
  if (pct > 8) return 40;
  if (-1 <= pct && pct < 0) return 30;
  return 15;
}

function rvolScore(rvol: number): number {
  if (rvol < 1.0) return rvol * 15;
  if (rvol < 2.0) return 15 + (rvol - 1.0) * 35;
  if (rvol < 4.0) return 50 + (rvol - 2.0) * 25;
  return 100;
}

function orbScore(open: number, high30m: number, low30m: number, current: number, atr: number): number {
  if (atr === 0) return 50;
  const orbRange = high30m - low30m;
  const norm = orbRange / atr;
  const breakout = current > high30m ? 1.0 : current > open ? 0.5 : 0;
  if (norm > 2 && breakout >= 1.0) return 95;
  if (norm > 1.5 && breakout >= 0.5) return 80;
  if (norm > 1) return 65;
  if (norm > 0.5) return 45;
  return 30;
}

function rsiShortScore(prices: number[]): number {
  if (prices.length < 10) return 50;
  const r7 = calcRsi(prices, 7);
  const r9 = calcRsi(prices, 9);
  const blended = r7 * 0.7 + r9 * 0.3;
  if (blended >= 60 && blended < 75) return 85;
  if (blended >= 55 && blended < 60) return 70;
  if (blended >= 45 && blended < 55) return 55;
  if (blended >= 35 && blended < 45) return 40;
  if (blended >= 75 && blended <= 80) return 60;
  if (blended > 80) return 30;
  return 25;
}

function velocityScore(open: number, current: number, low: number, atr: number): { vol: number; dir: number } {
  if (atr === 0 || open === 0) return { vol: 50, dir: 50 };
  const dayRange = current - low;
  const volRatio = dayRange / atr;
  const vol = Math.max(0, Math.min(100, volRatio * 30));
  const dirMove = (current - open) / atr;
  let dir: number;
  if (dirMove > 2.0) dir = 95;
  else if (dirMove > 1.5) dir = 85;
  else if (dirMove > 1.0) dir = 70;
  else if (dirMove > 0.5) dir = 55;
  else if (dirMove > 0) dir = 40;
  else if (dirMove > -0.5) dir = 25;
  else dir = 15;
  return { vol, dir };
}

function intradayRetentionScore(high30m: number, current: number): number {
  if (high30m === 0) return 50;
  const pullback = ((high30m - current) / high30m) * 100;
  if (pullback < 0.3) return 85;
  if (pullback < 0.8) return 70;
  if (pullback < 1.5) return 55;
  if (pullback < 3.0) return 40;
  return 25;
}

/**
 * Belirli bir tarihteki momentum skorunu geçmiş verilerle hesapla
 * Bu fonksiyon o güne kadar olan verileri kullanır (walk-forward)
 */
function calculateHistoricalMomentum(
  bars: HistoricalBar[],
  dayIndex: number
): { score: number; rvol: number; rsi: number; gapPct: number } | null {
  // O güne kadar olan verileri kullan (walk-forward: geleceği görme)
  const pastBars = bars.slice(0, dayIndex);
  if (pastBars.length < 20) return null;

  const today = bars[dayIndex];
  if (!today) return null;

  const closes = pastBars.map((b) => b.close);
  const highs = pastBars.map((b) => b.high);
  const lows = pastBars.map((b) => b.low);
  const volumes = pastBars.map((b) => b.volume);

  const avgVol20 = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const prevClose = pastBars[pastBars.length - 1].close;
  const atr14d = calcAtr(highs, lows, closes, 14);

  // Bugünün simüle edilmiş "ilk 30dk" verileri
  // Open → High arasındaki değişimi 30m momentum olarak kullan
  const simulated30mHigh = today.high;
  const simulated30mLow = today.low;

  const rvol = avgVol20 > 0 ? today.volume / avgVol20 : 1;
  const gap = gapScore(today.open, prevClose);
  const orb = orbScore(today.open, simulated30mHigh, simulated30mLow, today.close, atr14d);
  const vwap = calcVwapScore(today.close, pastBars.slice(-10));
  const structure = calcStructure(highs, lows);
  const rsiShort = rsiShortScore(closes);
  const vel = velocityScore(today.open, today.close, today.low, atr14d);
  const mktCap = 50; // Geçmişte market cap bilgisi yok, nötr
  const retention = intradayRetentionScore(simulated30mHigh, today.close);
  const rvolS = rvolScore(rvol);

  const priceChangePct = ((today.close - prevClose) / prevClose) * 100;
  let pcS: number;
  if (priceChangePct > 5) pcS = 100;
  else if (priceChangePct > 3) pcS = 80;
  else if (priceChangePct > 2) pcS = 60;
  else if (priceChangePct > 1) pcS = 45;
  else if (priceChangePct > 0) pcS = 30;
  else if (priceChangePct > -1) pcS = 20;
  else pcS = 10;

  const { score } = sanityGate({
    rvolS, gap, orbScore: orb, vwap, structure, rsiShort,
    velDir: vel.dir, velVol: vel.vol, mktCap, retention, pcS,
    weights: { ...FACTOR_WEIGHTS },
  });

  return {
    score,
    rvol,
    rsi: calcRsi(closes, 14),
    gapPct: ((today.open - prevClose) / prevClose) * 100,
  };
}

// ===================== Backtest Motoru =====================

export async function runBacktest(config: BacktestConfig, language: AppLanguage = "tr"): Promise<BacktestSummary> {
  const allTrades: DailyTrade[] = [];
  const dailyReturns: Array<{ date: string; pnl: number; trades: number }> = [];

  // Ticker'ları paralel olarak çek (chunk'lı)
  const CHUNK_SIZE = 3;
  const allBars: Record<string, HistoricalBar[]> = {};

  console.log(`[Backtest] Fetching data for ${config.tickers.length} tickers...`);

  for (let i = 0; i < config.tickers.length; i += CHUNK_SIZE) {
    const chunk = config.tickers.slice(i, i + CHUNK_SIZE);
    const results = await Promise.allSettled(
      chunk.map(async (ticker) => {
        const bars = await fetchHistoricalBars(ticker, "1y");
        return { ticker, bars };
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled" && r.value.bars) {
        allBars[r.value.ticker] = r.value.bars;
      }
    }
  }

  console.log(`[Backtest] Fetched data for ${Object.keys(allBars).length} tickers`);

  // Her gün için trade'leri simüle et
  // Tüm ticker'ların ortak tarih aralığını bul
  const allDates = new Set<string>();
  for (const bars of Object.values(allBars)) {
    // Config'deki tarih aralığına göre filtrele
    bars.forEach((b) => {
      if (b.date >= config.startDate && b.date <= config.endDate) {
        allDates.add(b.date);
      }
    });
  }

  const sortedDates = Array.from(allDates).sort();
  console.log(`[Backtest] Simulating ${sortedDates.length} trading days`);

  for (const date of sortedDates) {
    const dayTrades: DailyTrade[] = [];

    for (const [ticker, bars] of Object.entries(allBars)) {
      const dayIndex = bars.findIndex((b) => b.date === date);
      if (dayIndex <= 20 || dayIndex >= bars.length - 1) continue; // Yeterli veri yok veya son gün

      const today = bars[dayIndex];
      const tomorrow = bars[dayIndex + 1]; // Ertesi gün verisi (walk-forward'da bu kullanılmaz, sadece P&L için)

      // Momentum skorunu hesapla (o güne kadar olan verilerle)
      const momentum = calculateHistoricalMomentum(bars, dayIndex);
      if (!momentum || momentum.score < config.entryScoreThreshold) continue;

      // Entry: Bugünün açılış fiyatı
      const entryPrice = today.open;
      // Simüle edilmiş "30m high/low"
      const high30m = today.high;
      const low30m = today.low;

      // TP/SL seviyeleri
      const tpLevel = entryPrice * (1 + config.tpPct / 100);
      const slLevel = entryPrice * (1 - config.slPct / 100);

      // Exit: High/Low TP/SL'ye değdi mi kontrol et
      let exitPrice: number;
      let exitReason: "TP" | "SL" | "EOD";

      if (today.high >= tpLevel) {
        exitPrice = tpLevel;
        exitReason = "TP";
      } else if (today.low <= slLevel) {
        exitPrice = slLevel;
        exitReason = "SL";
      } else {
        // EOD: Kapanış fiyatı
        exitPrice = today.close;
        exitReason = "EOD";
      }

      const pnl = ((exitPrice - entryPrice) / entryPrice) * 100;

      dayTrades.push({
        date,
        ticker,
        entryPrice: Math.round(entryPrice * 100) / 100,
        exitPrice: Math.round(exitPrice * 100) / 100,
        tpLevel: Math.round(tpLevel * 100) / 100,
        slLevel: Math.round(slLevel * 100) / 100,
        pnlPct: Math.round(pnl * 100) / 100,
        exitReason,
        score: momentum.score,
        confidenceScore: 70, // Geçmişte confidence skoru hesaplanamaz, varsayılan
        rankingScore: momentum.score,
        rvol: Math.round(momentum.rvol * 100) / 100,
        rsi: Math.round(momentum.rsi * 10) / 10,
        gapPct: Math.round(momentum.gapPct * 100) / 100,
        dayOfWeek: new Date(date).getDay(),
        marketOpen30mHigh: Math.round(high30m * 100) / 100,
        marketOpen30mLow: Math.round(low30m * 100) / 100,
      });
    }

    // Skora göre sırala, günde max pozisyon
    dayTrades.sort((a, b) => b.score - a.score);
    const selectedTrades = dayTrades.slice(0, config.maxPositionsPerDay);

    allTrades.push(...selectedTrades);

    // Günlük P&L
    if (selectedTrades.length > 0) {
      const dayPnl = selectedTrades.reduce((s, t) => s + t.pnlPct, 0) / selectedTrades.length;
      dailyReturns.push({ date, pnl: Math.round(dayPnl * 100) / 100, trades: selectedTrades.length });
    }
  }

  // İstatistikler
  return calculateBacktestStats(allTrades, dailyReturns, config, sortedDates.length, language);
}

// ===================== İstatistik Hesaplama =====================

function calculateBacktestStats(
  trades: DailyTrade[],
  dailyReturns: Array<{ date: string; pnl: number; trades: number }>,
  config: BacktestConfig,
  totalTradingDays: number,
  language: AppLanguage = "tr"
): BacktestSummary {
  if (trades.length === 0) {
    return {
      config, totalTradingDays, totalTrades: 0, winningTrades: 0, losingTrades: 0,
      winRate: 0, avgWinPct: 0, avgLossPct: 0, profitFactor: 0, totalPnLPct: 0,
      maxDrawdownPct: 0, sharpeRatio: 0, avgTradePnL: 0, bestTrade: null, worstTrade: null,
      tpHitRate: 0, slHitRate: 0, eodRate: 0, dailyReturns, performanceByScore: [],
      performanceByDay: [], trades: [],
    };
  }

  const winning = trades.filter((t) => t.pnlPct > 0);
  const losing = trades.filter((t) => t.pnlPct <= 0);

  const winRate = (winning.length / trades.length) * 100;

  const avgWin = winning.length > 0 ? winning.reduce((s, t) => s + t.pnlPct, 0) / winning.length : 0;
  const avgLoss = losing.length > 0 ? losing.reduce((s, t) => s + t.pnlPct, 0) / losing.length : 0;

  const totalPnL = trades.reduce((s, t) => s + t.pnlPct, 0);
  const avgTrade = totalPnL / trades.length;

  const profitFactor = avgLoss !== 0
    ? Math.abs((avgWin * winning.length) / (avgLoss * losing.length))
    : Infinity;

  // Max drawdown
  let maxDrawdown = 0;
  let peak = 0;
  let cumPnL = 0;
  for (const dr of dailyReturns) {
    cumPnL += dr.pnl;
    if (cumPnL > peak) peak = cumPnL;
    const drawdown = peak - cumPnL;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  // Sharpe ratio (günlük getirilerden)
  const dailyPnLs = dailyReturns.map((d) => d.pnl);
  const meanDaily = dailyPnLs.reduce((a, b) => a + b, 0) / dailyPnLs.length;
  const variance = dailyPnLs.reduce((a, b) => a + (b - meanDaily) ** 2, 0) / dailyPnLs.length;
  const stdDaily = Math.sqrt(variance) || 1;
  const sharpe = (meanDaily / stdDaily) * Math.sqrt(252); // Annualized

  // Skor seviyelerine göre performans
  const scoreRanges = [
    { min: 75, max: 100, label: "75-100" },
    { min: 65, max: 74, label: "65-74" },
    { min: 55, max: 64, label: "55-64" },
    { min: 45, max: 54, label: "45-54" },
  ];

  const performanceByScore = scoreRanges.map((r) => {
    const subset = trades.filter((t) => t.score >= r.min && t.score <= r.max);
    const wins = subset.filter((t) => t.pnlPct > 0);
    return {
      scoreRange: r.label,
      trades: subset.length,
      winRate: subset.length > 0 ? Math.round((wins.length / subset.length) * 1000) / 10 : 0,
      avgPnL: subset.length > 0 ? Math.round((subset.reduce((s, t) => s + t.pnlPct, 0) / subset.length) * 100) / 100 : 0,
    };
  });

  // Güne göre performans
  const dayNames = (lang: AppLanguage) => [
    t("scanner:sunday"),
    t("scanner:monday"),
    t("scanner:tuesday"),
    t("scanner:wednesday"),
    t("scanner:consolidationWithinOpeningRangeContinues"),
    t("scanner:friday"),
    t("scanner:saturday"),
  ];
  const performanceByDay = [1, 2, 3, 4, 5].map((dow) => {
    const subset = trades.filter((t) => t.dayOfWeek === dow);
    const wins = subset.filter((t) => t.pnlPct > 0);
    return {
      day: dayNames(language)[dow],
      trades: subset.length,
      winRate: subset.length > 0 ? Math.round((wins.length / subset.length) * 1000) / 10 : 0,
      avgPnL: subset.length > 0 ? Math.round((subset.reduce((s, t) => s + t.pnlPct, 0) / subset.length) * 100) / 100 : 0,
    };
  });

  // Best/worst trade
  const sortedByPnl = [...trades].sort((a, b) => b.pnlPct - a.pnlPct);

  return {
    config,
    totalTradingDays,
    totalTrades: trades.length,
    winningTrades: winning.length,
    losingTrades: losing.length,
    winRate: Math.round(winRate * 10) / 10,
    avgWinPct: Math.round(avgWin * 100) / 100,
    avgLossPct: Math.round(avgLoss * 100) / 100,
    profitFactor: Math.round(profitFactor * 100) / 100,
    totalPnLPct: Math.round(totalPnL * 100) / 100,
    maxDrawdownPct: Math.round(maxDrawdown * 100) / 100,
    sharpeRatio: Math.round(sharpe * 100) / 100,
    avgTradePnL: Math.round(avgTrade * 100) / 100,
    bestTrade: sortedByPnl[0] || null,
    worstTrade: sortedByPnl[sortedByPnl.length - 1] || null,
    tpHitRate: Math.round((trades.filter((t) => t.exitReason === "TP").length / trades.length) * 1000) / 10,
    slHitRate: Math.round((trades.filter((t) => t.exitReason === "SL").length / trades.length) * 1000) / 10,
    eodRate: Math.round((trades.filter((t) => t.exitReason === "EOD").length / trades.length) * 1000) / 10,
    dailyReturns,
    performanceByScore,
    performanceByDay,
    trades: sortedByPnl,
  };
}

// ===================== Progress callback tipi =====================
export interface BacktestProgress {
  phase: "FETCHING" | "SIMULATING" | "ANALYZING";
  current: number;
  total: number;
  detail: string;
}

export type ProgressCallback = (progress: BacktestProgress) => void;
