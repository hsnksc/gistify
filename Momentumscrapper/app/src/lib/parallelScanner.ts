/**
 * Paralel Tarama Motoru v4
 * Promise.allSettled + chunk'lar + exponential backoff + jitter
 * Hibrit veri saglayici (Yahoo + Finnhub + Alphavantage)
 */

import { NASDAQ_TICKERS, type StockData } from "./yahooFinance";
import { fetchStockDataHybrid, type ProviderName, type HybridFetchResult, getProviderStatuses } from "./dataProviders";
import { analyzeStock } from "./momentum";
import type { StockResult } from "@/types/scanner";

const DEFAULT_CHUNK_SIZE = 5;
const DEFAULT_DELAY_MS = 300;
const MAX_RETRIES = 2;
const INITIAL_BACKOFF_MS = 500;
const JITTER_MAX_MS = 200;

// Tarama istatistikleri (UI icin)
export interface ScanStats {
  yahooSuccess: number;
  massiveSuccess: number;
  twelvedataSuccess: number;
  alphavantageSuccess: number;
  totalFallbacks: number;
  rateLimitHits: number;
}

export function getInitialScanStats(): ScanStats {
  return {
    yahooSuccess: 0,
    massiveSuccess: 0,
    twelvedataSuccess: 0,
    alphavantageSuccess: 0,
    totalFallbacks: 0,
    rateLimitHits: 0,
  };
}

/** Rastgele jitter */
function jitter(maxMs = JITTER_MAX_MS): Promise<void> {
  return new Promise((r) => setTimeout(r, Math.random() * maxMs));
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(
  ticker: string,
  attempt = 0,
  stats?: ScanStats
): Promise<{ data: StockData | null; provider: ProviderName | null }> {
  try {
    const result = await fetchStockDataHybrid(ticker);

    if (result.data && stats) {
      // Provider istatistiklerini guncelle
      switch (result.provider) {
        case "yahoo": stats.yahooSuccess++; break;
        case "massive": stats.massiveSuccess++; stats.totalFallbacks++; break;
        case "twelvedata": stats.twelvedataSuccess++; stats.totalFallbacks++; break;
        case "alphavantage": stats.alphavantageSuccess++; stats.totalFallbacks++; break;
      }
    }

    if (result.data) {
      return { data: result.data, provider: result.provider };
    }

    // Veri yoksa retry
    if (attempt < MAX_RETRIES) {
      const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
      await sleep(backoff);
      return fetchWithRetry(ticker, attempt + 1, stats);
    }

    return { data: null, provider: null };
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
      await sleep(backoff);
      return fetchWithRetry(ticker, attempt + 1, stats);
    }
    console.warn(`[Scanner] ${ticker} basarisiz (${MAX_RETRIES + 1} deneme)`);
    return { data: null, provider: null };
  }
}

interface ScanOptions {
  tickers?: string[];
  minScore?: number;
  maxResults?: number;
  chunkSize?: number;
  chunkDelayMs?: number;
  onProgress?: (scanned: number, total: number, current: string) => void;
  onChunkDone?: (chunkResults: StockResult[]) => void;
  onStatsUpdate?: (stats: ScanStats) => void;
}

export async function scanParallel(opts: ScanOptions) {
  const {
    tickers = NASDAQ_TICKERS,
    minScore = 30,
    maxResults = 20,
    chunkSize = DEFAULT_CHUNK_SIZE,
    chunkDelayMs = DEFAULT_DELAY_MS,
    onProgress,
    onChunkDone,
    onStatsUpdate,
  } = opts;

  const results: StockResult[] = [];
  const stats = getInitialScanStats();
  let scanned = 0;

  for (let i = 0; i < tickers.length; i += chunkSize) {
    const chunk = tickers.slice(i, i + chunkSize);

    const settled = await Promise.allSettled(
      chunk.map((ticker) => fetchWithRetry(ticker, 0, stats))
    );

    for (let j = 0; j < settled.length; j++) {
      const ticker = chunk[j];
      const s = settled[j];
      scanned++;

      if (s.status === "fulfilled" && s.value.data) {
        // Intraday verisi var mi kontrol et
        const hasIntraday = false; // Simdilik basitlestirilmis
        const analysis = analyzeStock(s.value.data);
        if (analysis && analysis.score >= minScore) {
          results.push(analysis);
          onChunkDone?.([analysis]);
        }
      }

      onProgress?.(scanned, tickers.length, ticker);
    }

    // Istatistikleri guncelle
    onStatsUpdate?.({ ...stats });

    // Delay between chunks + jitter
    if (i + chunkSize < tickers.length) {
      await sleep(chunkDelayMs);
      await jitter();
    }
  }

  // FAZ 1: Ranking score'a gore siralama
  results.sort((a, b) => {
    const aRank = a.rankingScore ?? a.score;
    const bRank = b.rankingScore ?? b.score;
    return bRank - aRank;
  });

  // Siralama pozisyonlarini guncelle
  results.forEach((r, i) => {
    if (r.rankingInfo) r.rankingInfo.rank = i + 1;
  });

  const now = new Date();
  return {
    scanTime: now.toISOString(),
    totalScanned: tickers.length,
    totalMatches: results.length,
    marketStatus: now.getUTCHours() >= 13 && now.getUTCHours() < 20 ? "OPEN" : "CLOSED",
    stocks: results.slice(0, maxResults),
    stats, // v4: Tarama istatistikleri
  };
}
