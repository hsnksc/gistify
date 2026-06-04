/**
 * Daily Auto-Scanner
 * Her gün otomatik olarak tüm hisseleri tarar,
 * sonuçları IndexedDB veritabanına kaydeder.
 */

import { ALL_TICKERS } from "./yahooFinance";
import type { PostEarningsMomentumResult } from "./earningsMomentum";
import { scanPostEarningsMomentum } from "./earningsMomentum";
import { saveStockRecord, saveDailyScan } from "./stockDatabase";

export interface DailyScanResult {
  date: string;
  tickersScanned: number;
  gapUpFound: number;
  strongContinuation: number;
  savedToDB: number;
  topPick: PostEarningsMomentumResult | null;
}

/**
 * Günlük tarama çalıştır.
 * Sadece gap-up yapan hisseleri bulur ve veritabanına kaydeder.
 */
export async function runDailyScan(
  onProgress?: (current: number, total: number, ticker: string) => void
): Promise<DailyScanResult> {
  const date = new Date().toISOString().split("T")[0];
  const tickers = ALL_TICKERS;

  // Gap-up screener çalıştır
  const results = await scanPostEarningsMomentum(tickers, onProgress);

  // Güçlü continuation adayları
  const strongConts = results.filter(
    (r) => r.peadScore >= 60 && r.continuationProbability >= 50
  );

  // Veritabanına kaydet
  let savedCount = 0;

  for (const r of results) {
    try {
      // Stock record kaydet
      await saveStockRecord({
        ticker: r.ticker,
        name: r.name,
        sector: r.sector,
        exchange: r.ticker.length <= 4 && !["GOOGL", "GOOG"].includes(r.ticker)
          ? "NYSE"
          : "NASDAQ",
        peadScore: r.peadScore,
        continuationProbability: r.continuationProbability,
        gapPct: r.gapPct,
        rvol: r.rvol,
        signal: r.signal,
        confidence: r.confidence,
        nextDayWinRate: r.nextDayWinRate,
        historicalGapUps: r.historicalGapUps,
        reasons: r.reasons,
        firstSeen: date,
        lastUpdated: date,
        scanCount: 1,
        avgPeadScore: r.peadScore,
        bestPeadScore: r.peadScore,
        status: r.peadScore >= 60 ? "ACTIVE" : "WATCHING",
      });

      // Daily scan kaydet
      await saveDailyScan({
        date,
        ticker: r.ticker,
        peadScore: r.peadScore,
        continuationProbability: r.continuationProbability,
        gapPct: r.gapPct,
        rvol: r.rvol,
        signal: r.signal,
        timestamp: new Date().toISOString(),
      });

      savedCount++;
    } catch (e) {
      console.error(`[DailyScan] ${r.ticker} kaydedilemedi:`, e);
    }
  }

  const topPick = results.length > 0 ? results[0] : null;

  return {
    date,
    tickersScanned: tickers.length,
    gapUpFound: results.length,
    strongContinuation: strongConts.length,
    savedToDB: savedCount,
    topPick,
  };
}

/**
 * Son taramanın ne zaman yapıldığını kontrol et.
 */
export async function getLastScanDate(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lastDailyScanDate");
}

/**
 * Bugün tarama yapılıp yapılmadığını kontrol et.
 */
export async function isTodayScanned(): Promise<boolean> {
  const lastDate = await getLastScanDate();
  const today = new Date().toISOString().split("T")[0];
  return lastDate === today;
}

/**
 * Son tarama tarihini kaydet.
 */
export function markTodayScanned(): void {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("lastDailyScanDate", today);
  localStorage.setItem("lastDailyScanTime", new Date().toISOString());
}

/**
 * Otomatik tarama: Eğer bugün taranmadıysa çalıştır.
 */
export async function autoDailyScan(
  onProgress?: (current: number, total: number, ticker: string) => void
): Promise<DailyScanResult | null> {
  const alreadyScanned = await isTodayScanned();
  if (alreadyScanned) {
    return null; // Bugün zaten taranmış
  }

  const result = await runDailyScan(onProgress);
  markTodayScanned();
  return result;
}
