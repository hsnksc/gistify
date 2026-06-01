// NASDAQ Momentum Scanner v4.3 — Gistify Entegrasyon Modülü
export type {
  StockResult,
  ScanResponse,
  ScoreExplanation,
  ConfidenceBreakdown,
  RankingInfo,
} from "./types";
export { useScannerI18n, scannerTR, scannerEN } from "./useScannerI18n";

// Re-export scoring functions
export { scoreColor, signalColor, signalBg, signalLabel } from "./lib/scoreConfig";
export { getScanTimingWarning } from "./lib/momentum";
export type { StockData } from "./lib/yahooFinance";

import type { ScanResponse } from "./types";

interface RunMomentumScanOptions {
  minScore?: number;
  signalFilter?: string;
  onProgress?: (scanned: number, total: number, current: string) => void;
}

// Main scan entry point
export async function runMomentumScan(
  tickers: string[],
  opts: RunMomentumScanOptions = {}
): Promise<ScanResponse> {
  const { scanParallel } = await import("./lib/parallelScanner");
  const response = await scanParallel({
    tickers,
    minScore: opts.minScore ?? 45,
    maxResults: tickers.length,
    onProgress: opts.onProgress,
  });

  const stocks =
    opts.signalFilter && opts.signalFilter !== "ALL"
      ? response.stocks.filter(stock => stock.signal === opts.signalFilter)
      : response.stocks;

  return {
    scanTime: response.scanTime,
    totalScanned: response.totalScanned,
    totalMatches: stocks.length,
    marketStatus: response.marketStatus,
    stocks,
  };
}
