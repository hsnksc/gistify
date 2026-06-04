/**
 * Stock Database v4 - IndexedDB
 * Hisse veritabanı: bulunan hisseleri, skorları ve tarihçeyi saklar.
 * Günlük otomatik tarama sonuçlarını depolar.
 */

const DB_NAME = "MomentumScannerDB";
const DB_VERSION = 1;

// ===================== Tipler =====================

export interface StockRecord {
  id?: number;
  ticker: string;
  name: string;
  sector: string;
  exchange: "NASDAQ" | "NYSE";
  peadScore: number;
  continuationProbability: number;
  gapPct: number;
  rvol: number;
  signal: string;
  confidence: string;
  nextDayWinRate: number;
  historicalGapUps: number;
  reasons: string[];
  firstSeen: string;   // ISO date
  lastUpdated: string; // ISO date
  scanCount: number;   // Kaç kez taranmış
  avgPeadScore: number;
  bestPeadScore: number;
  status: "ACTIVE" | "WATCHING" | "ARCHIVED";
}

export interface DailyScan {
  id?: number;
  date: string;        // ISO date
  ticker: string;
  peadScore: number;
  continuationProbability: number;
  gapPct: number;
  rvol: number;
  signal: string;
  timestamp: string;
}

export interface QueryResult {
  ticker: string;
  name: string;
  sector: string;
  peadScore: number;
  continuationProbability: number;
  nextDayWinRate: number;
  historicalGapUps: number;
  gapPct: number;
  rvol: number;
  signal: string;
  confidence: string;
  reasons: string[];
  avgPeadScore: number;
  scanCount: number;
  lastUpdated: string;
  rank: number;
}

// ===================== DB Açma =====================

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Stock Records - ana veritabanı
      if (!db.objectStoreNames.contains("stocks")) {
        const store = db.createObjectStore("stocks", { keyPath: "id", autoIncrement: true });
        store.createIndex("ticker", "ticker", { unique: true });
        store.createIndex("peadScore", "peadScore", { unique: false });
        store.createIndex("continuationProbability", "continuationProbability", { unique: false });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("signal", "signal", { unique: false });
      }

      // Daily Scans - günlük tarama tarihçesi
      if (!db.objectStoreNames.contains("dailyScans")) {
        const store = db.createObjectStore("dailyScans", { keyPath: "id", autoIncrement: true });
        store.createIndex("date", "date", { unique: false });
        store.createIndex("ticker", "ticker", { unique: false });
        store.createIndex("date_ticker", ["date", "ticker"], { unique: true });
      }
    };
  });
}

// ===================== CRUD İşlemleri =====================

export async function saveStockRecord(record: Omit<StockRecord, "id">): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("stocks", "readwrite");
  const store = tx.objectStore("stocks");
  const index = store.index("ticker");

  const existing = await new Promise<StockRecord | undefined>((resolve) => {
    const req = index.get(record.ticker);
    req.onsuccess = () => resolve(req.result as StockRecord | undefined);
    req.onerror = () => resolve(undefined);
  });

  if (existing) {
    // Güncelle
    const updated: StockRecord = {
      ...existing,
      peadScore: record.peadScore,
      continuationProbability: record.continuationProbability,
      gapPct: record.gapPct,
      rvol: record.rvol,
      signal: record.signal,
      confidence: record.confidence,
      nextDayWinRate: record.nextDayWinRate,
      historicalGapUps: record.historicalGapUps,
      reasons: record.reasons,
      lastUpdated: record.lastUpdated,
      scanCount: existing.scanCount + 1,
      avgPeadScore: Math.round(((existing.avgPeadScore * existing.scanCount) + record.peadScore) / (existing.scanCount + 1) * 10) / 10,
      bestPeadScore: Math.max(existing.bestPeadScore, record.peadScore),
      status: record.peadScore >= 60 ? "ACTIVE" : existing.status,
    };
    store.put(updated);
  } else {
    // Yeni kayıt
    store.put(record);
  }

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveDailyScan(scan: Omit<DailyScan, "id">): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("dailyScans", "readwrite");
  const store = tx.objectStore("dailyScans");

  // Aynı gün + ticker varsa güncelle
  const index = store.index("date_ticker");
  const existing = await new Promise<DailyScan | undefined>((resolve) => {
    const req = index.get([scan.date, scan.ticker]);
    req.onsuccess = () => resolve(req.result as DailyScan | undefined);
    req.onerror = () => resolve(undefined);
  });

  if (existing && existing.id) {
    store.put({ ...scan, id: existing.id });
  } else {
    store.put(scan);
  }

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ===================== Sorgulama =====================

export async function queryStocksByProbability(
  minPeadScore = 0,
  minContinuationProb = 0,
  limit = 50
): Promise<QueryResult[]> {
  const db = await openDB();
  const tx = db.transaction("stocks", "readonly");
  const store = tx.objectStore("stocks");

  const records = await new Promise<StockRecord[]>((resolve) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as StockRecord[]);
    req.onerror = () => resolve([]);
  });

  // Composite score'a göre sırala
  const scored = records
    .filter((r) => r.peadScore >= minPeadScore && r.continuationProbability >= minContinuationProb)
    .map((r, i) => {
      // Composite rank skoru
      const rankScore =
        r.peadScore * 0.35 +
        r.continuationProbability * 0.30 +
        r.nextDayWinRate * 0.20 +
        Math.min(100, r.scanCount * 5) * 0.10 +  // Birden fazkez taranan hisse bonus
        (r.bestPeadScore - r.peadScore < 15 ? 10 : 0); // Tutarlı hisse bonus

      return {
        ticker: r.ticker,
        name: r.name,
        sector: r.sector,
        peadScore: r.peadScore,
        continuationProbability: r.continuationProbability,
        nextDayWinRate: r.nextDayWinRate,
        historicalGapUps: r.historicalGapUps,
        gapPct: r.gapPct,
        rvol: r.rvol,
        signal: r.signal,
        confidence: r.confidence,
        reasons: r.reasons,
        avgPeadScore: r.avgPeadScore,
        scanCount: r.scanCount,
        lastUpdated: r.lastUpdated,
        rankScore: Math.round(rankScore),
      };
    });

  scored.sort((a, b) => b.rankScore - a.rankScore);

  return scored.slice(0, limit).map((s, i) => ({ ...s, rank: i + 1 }));
}

export async function queryStocksByTicker(ticker: string): Promise<QueryResult | null> {
  const db = await openDB();
  const tx = db.transaction("stocks", "readonly");
  const store = tx.objectStore("stocks");
  const index = store.index("ticker");

  const record = await new Promise<StockRecord | undefined>((resolve) => {
    const req = index.get(ticker.toUpperCase());
    req.onsuccess = () => resolve(req.result as StockRecord | undefined);
    req.onerror = () => resolve(undefined);
  });

  if (!record) return null;

  return {
    ticker: record.ticker,
    name: record.name,
    sector: record.sector,
    peadScore: record.peadScore,
    continuationProbability: record.continuationProbability,
    nextDayWinRate: record.nextDayWinRate,
    historicalGapUps: record.historicalGapUps,
    gapPct: record.gapPct,
    rvol: record.rvol,
    signal: record.signal,
    confidence: record.confidence,
    reasons: record.reasons,
    avgPeadScore: record.avgPeadScore,
    scanCount: record.scanCount,
    lastUpdated: record.lastUpdated,
    rank: 0,
  };
}

// Son tüm hisseleri getir
export async function getAllStockRecords(): Promise<StockRecord[]> {
  const db = await openDB();
  const tx = db.transaction("stocks", "readonly");
  const store = tx.objectStore("stocks");

  return new Promise((resolve) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as StockRecord[]);
    req.onerror = () => resolve([]);
  });
}

// Günlük tarama sayısı
export async function getDailyScanCount(date: string): Promise<number> {
  const db = await openDB();
  const tx = db.transaction("dailyScans", "readonly");
  const store = tx.objectStore("dailyScans");
  const index = store.index("date");

  return new Promise((resolve) => {
    const req = index.count(date);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
}

// Bir hissenin günlük tarama tarihçesi
export async function getTickerScanHistory(ticker: string): Promise<DailyScan[]> {
  const db = await openDB();
  const tx = db.transaction("dailyScans", "readonly");
  const store = tx.objectStore("dailyScans");
  const index = store.index("ticker");

  return new Promise((resolve) => {
    const req = index.getAll(ticker);
    req.onsuccess = () => {
      const results = (req.result as DailyScan[]).sort((a, b) => b.date.localeCompare(a.date));
      resolve(results);
    };
    req.onerror = () => resolve([]);
  });
}

// Tüm kayıtları temizle
export async function clearAllRecords(): Promise<void> {
  const db = await openDB();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(["stocks", "dailyScans"], "readwrite");
    tx.objectStore("stocks").clear();
    tx.objectStore("dailyScans").clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Kayıt sil (ticker)
export async function deleteStockRecord(ticker: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("stocks", "readwrite");
  const store = tx.objectStore("stocks");
  const index = store.index("ticker");

  const record = await new Promise<StockRecord | undefined>((resolve) => {
    const req = index.get(ticker);
    req.onsuccess = () => resolve(req.result as StockRecord | undefined);
    req.onerror = () => resolve(undefined);
  });

  if (record?.id) {
    store.delete(record.id);
  }

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// İstatistikler
export async function getDatabaseStats(): Promise<{
  totalStocks: number;
  activeStocks: number;
  totalDailyScans: number;
  todayScans: number;
  bestStock: { ticker: string; peadScore: number } | null;
}> {
  const [allStocks, allScans] = await Promise.all([
    getAllStockRecords(),
    (async () => {
      const db = await openDB();
      const tx = db.transaction("dailyScans", "readonly");
      const store = tx.objectStore("dailyScans");
      return new Promise<DailyScan[]>((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as DailyScan[]);
        req.onerror = () => resolve([]);
      });
    })(),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const activeStocks = allStocks.filter((s) => s.status === "ACTIVE").length;
  const bestStock = allStocks.length > 0
    ? allStocks.reduce((best, s) => s.peadScore > best.peadScore ? s : best)
    : null;

  return {
    totalStocks: allStocks.length,
    activeStocks,
    totalDailyScans: allScans.length,
    todayScans: allScans.filter((s) => s.date === today).length,
    bestStock: bestStock ? { ticker: bestStock.ticker, peadScore: bestStock.peadScore } : null,
  };
}
