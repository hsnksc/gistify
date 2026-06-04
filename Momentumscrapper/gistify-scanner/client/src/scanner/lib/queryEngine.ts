/**
 * Query Engine v4
 * Veritabanından olasılığı en yüksek hisseleri sorgular.
 * Kullanıcı "sorgula" dediğinde çalışır.
 */

import { queryStocksByProbability, queryStocksByTicker, getDatabaseStats } from "./stockDatabase";
import type { QueryResult } from "./stockDatabase";

export type QueryFilter = {
  minPeadScore?: number;
  minContinuationProb?: number;
  minHistoricalWR?: number;
  signalType?: "ALL" | "CONTINUATION" | "STRONG_CONTINUATION" | "NEUTRAL" | "FADE";
  sortBy?: "PROBABILITY" | "PEAD_SCORE" | "HISTORICAL_WR" | "COMPOSITE";
};

/**
 * Ana sorgulama fonksiyonu.
 * Olasılığı en yüksek hisseleri döndürür (composite ranking).
 */
export async function queryTopStocks(
  filter: QueryFilter = {},
  limit = 20
): Promise<QueryResult[]> {
  const {
    minPeadScore = 0,
    minContinuationProb = 0,
    minHistoricalWR = 0,
    signalType = "ALL",
    sortBy = "COMPOSITE",
  } = filter;

  // Veritabanından çek
  let results = await queryStocksByProbability(minPeadScore, minContinuationProb, 200);

  // Historical WR filtresi
  if (minHistoricalWR > 0) {
    results = results.filter((r) => r.nextDayWinRate >= minHistoricalWR);
  }

  // Sinyal filtresi
  if (signalType !== "ALL") {
    results = results.filter((r) => {
      if (signalType === "CONTINUATION") return r.signal.includes("CONTINUATION");
      if (signalType === "STRONG_CONTINUATION") return r.signal === "STRONG_CONTINUATION";
      return r.signal === signalType;
    });
  }

  // Sıralama
  const sortFn = (a: QueryResult, b: QueryResult) => {
    switch (sortBy) {
      case "PROBABILITY": return b.continuationProbability - a.continuationProbability;
      case "PEAD_SCORE": return b.peadScore - a.peadScore;
      case "HISTORICAL_WR": return b.nextDayWinRate - a.nextDayWinRate;
      case "COMPOSITE":
      default:
        // Composite = pead*0.35 + continuation*0.30 + historicalWR*0.20 + consistency*0.15
        const scoreA = a.peadScore * 0.35 + a.continuationProbability * 0.30 + a.nextDayWinRate * 0.20 + (100 - Math.abs(a.peadScore - a.avgPeadScore)) * 0.15;
        const scoreB = b.peadScore * 0.35 + b.continuationProbability * 0.30 + b.nextDayWinRate * 0.20 + (100 - Math.abs(b.peadScore - b.avgPeadScore)) * 0.15;
        return scoreB - scoreA;
    }
  };

  results.sort(sortFn);

  // Rank güncelle
  return results.slice(0, limit).map((r, i) => ({ ...r, rank: i + 1 }));
}

/**
 * Tek bir hisseyi sorgula.
 */
export async function querySingleStock(ticker: string): Promise<QueryResult | null> {
  return queryStocksByTicker(ticker.toUpperCase());
}

/**
 * Veritabanı özet istatistikleri.
 */
export async function queryDatabaseStats() {
  return getDatabaseStats();
}

/**
 * Basit metin sorgusu.
 * "sorgula" → en yüksek olasılıklı hisseler
 * "AAPL sorgula" → AAPL sorgula
 */
export async function processTextQuery(text: string): Promise<{
  type: "LIST" | "SINGLE" | "STATS" | "UNKNOWN";
  results?: QueryResult[];
  singleResult?: QueryResult | null;
  stats?: Awaited<ReturnType<typeof getDatabaseStats>>;
  message: string;
}> {
  const trimmed = text.trim().toUpperCase();

  // "sorgula" veya "en iyi" veya "top"
  if (["SORGULA", "EN İYİ", "EN IYI", "TOP", "BEST", "LISTELE"].includes(trimmed)) {
    const results = await queryTopStocks({}, 20);
    return {
      type: "LIST",
      results,
      message: results.length > 0
        ? `${results.length} hisse bulundu. Olasılığı en yüksekten başlayarak sıralandı.`
        : "Veritabanında hisse bulunamadı. Önce 'Günlük Tara' çalıştırın.",
    };
  }

  // "istatistik" veya "durum"
  if (["İSTATİSTİK", "ISTATISTIK", "DURUM", "STATS", "STATUS"].includes(trimmed)) {
    const stats = await getDatabaseStats();
    return {
      type: "STATS",
      stats,
      message: `Veritabanı: ${stats.totalStocks} hisse (${stats.activeStocks} aktif), ${stats.totalDailyScans} günlük tarama kaydı.`,
    };
  }

  // Ticker sorgusu: "AAPL" veya "AAPL sorgula"
  const tickerMatch = trimmed.match(/^([A-Z]{1,5})(?:\s+SORGULA)?$/);
  if (tickerMatch) {
    const ticker = tickerMatch[1];
    const result = await querySingleStock(ticker);
    return {
      type: "SINGLE",
      singleResult: result,
      message: result
        ? `${ticker}: PEAD Skor ${result.peadScore}, Devam Olasılığı %${result.continuationProbability}, Geçmiş WR %${result.nextDayWinRate}`
        : `${ticker} veritabanında bulunamadı.`,
    };
  }

  return {
    type: "UNKNOWN",
    message: "Komut anlaşılamadı. 'sorgula', 'AAPL' veya 'istatistik' yazın.",
  };
}
