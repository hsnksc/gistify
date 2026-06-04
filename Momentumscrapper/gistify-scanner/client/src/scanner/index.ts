// NASDAQ Momentum Scanner v4.3 — Gistify Entegrasyon Modülü
export type { StockResult, ScanResponse, ScoreExplanation, ConfidenceBreakdown, RankingInfo } from "./types";
export { useScannerI18n, scannerTR, scannerEN } from "./useScannerI18n";

// Re-export scoring functions
export { scoreColor, signalColor, signalBg, signalLabel } from "./lib/scoreConfig";
export { getScanTimingWarning } from "./lib/momentum";
export type { StockData } from "./lib/yahooFinance";

// Main scan entry point
export async function runMomentumScan(
  tickers: string[],
  opts: { minScore?: number; signalFilter?: string } = {}
): Promise<ScanResponse> {
  const { scanParallel } = await import("./lib/parallelScanner");
  const { analyzeStockFull } = await import("./lib/momentum");
  const { getInitialScanStats } = await import("./lib/parallelScanner");
  const { fetchStockDataHybrid } = await import("./lib/dataProviders");

  const startTime = Date.now();
  const stats = getInitialScanStats();
  const stocks: import("./types").StockResult[] = [];

  for (const ticker of tickers) {
    try {
      const result = await fetchStockDataHybrid(ticker);
      if (result.data) {
        const analysis = analyzeStockFull(result.data);
        if (analysis.score >= (opts.minScore || 45)) {
          if (opts.signalFilter === "ALL" || analysis.signal === opts.signalFilter) {
            stocks.push(analysis);
          }
        }
      }
      if (result.provider === "yahoo") stats.yahooSuccess++;
      else if (result.provider === "massive") stats.massiveSuccess++;
      else if (result.provider === "twelvedata") stats.twelvedataSuccess++;
    } catch {
      // Skip failed tickers
    }
  }

  // Sort by score desc
  stocks.sort((a, b) => b.score - a.score);

  return {
    scanTime: new Date().toISOString(),
    totalScanned: tickers.length,
    totalMatches: stocks.length,
    marketStatus: getScanTimingWarning() ? "CLOSED/EARLY" : "OPEN",
    stocks,
  };
}
