/**
 * Yahoo Finance API Client v4 - Tipler & Ticker Listeleri
 *
 * NOT: fetchStockData() artik lib/dataProviders.ts'teki hibrit saglayicidan
 * re-export ediliyor. Bu dosya sadece:
 * - StockData interface'i
 * - Sektör map (hardcoded)
 * - NASDAQ-100 + NYSE ticker listeleri
 */

const SECTOR_MAP: Record<string, string> = {
  AAPL: "Technology", MSFT: "Technology", GOOGL: "Communication Services",
  GOOG: "Communication Services", AMZN: "Consumer Cyclical", NVDA: "Technology",
  META: "Communication Services", TSLA: "Consumer Cyclical", AVGO: "Technology",
  PEP: "Consumer Defensive", COST: "Consumer Defensive", CSCO: "Technology",
  TMUS: "Communication Services", ADBE: "Technology", NFLX: "Communication Services",
  AMD: "Technology", INTC: "Technology", QCOM: "Technology", AMGN: "Healthcare",
  INTU: "Technology", HON: "Industrials", AMAT: "Technology", PYPL: "Financial Services",
  ADP: "Industrials", LIN: "Basic Materials", ISRG: "Healthcare", SBUX: "Consumer Cyclical",
  BKNG: "Consumer Cyclical", GILD: "Healthcare", VRTX: "Healthcare", MDLZ: "Consumer Defensive",
  ADI: "Technology", REGN: "Healthcare", PANW: "Technology", MU: "Technology",
  SNPS: "Technology", LRCX: "Technology", KLAC: "Technology", CSX: "Industrials",
  NXPI: "Technology", ASML: "Technology", CDNS: "Technology", CHTR: "Communication Services",
  MAR: "Consumer Cyclical", MELI: "Consumer Cyclical", ABNB: "Consumer Cyclical",
  CTAS: "Industrials", DXCM: "Healthcare", ORLY: "Consumer Cyclical", PDD: "Consumer Cyclical",
  FTNT: "Technology", WDAY: "Technology", MRVL: "Technology", JD: "Consumer Cyclical",
  CPRT: "Industrials", AEP: "Utilities", KDP: "Consumer Defensive", EXC: "Utilities",
  FAST: "Industrials", MNST: "Consumer Defensive", CTSH: "Technology", AZN: "Healthcare",
  BIIB: "Healthcare", TEAM: "Technology", XEL: "Utilities", EA: "Communication Services",
  CRWD: "Technology", ANSS: "Technology", VRSK: "Industrials", ODFL: "Industrials",
  CSGP: "Real Estate", PCAR: "Industrials", ILMN: "Healthcare", PAYX: "Industrials",
  DLTR: "Consumer Defensive", EBAY: "Consumer Cyclical", ZM: "Technology",
  SQ: "Financial Services", DDOG: "Technology", SNOW: "Technology", PLTR: "Technology",
  MDB: "Technology", ROKU: "Communication Services", OKTA: "Technology", NET: "Technology",
  DOCU: "Technology", SHOP: "Technology", TWLO: "Technology",
  JPM: "Financial Services", JNJ: "Healthcare", V: "Financial Services", WMT: "Consumer Defensive",
  PG: "Consumer Defensive", MA: "Financial Services", DIS: "Communication Services",
  UNH: "Healthcare", HD: "Consumer Cyclical", BAC: "Financial Services",
  VZ: "Communication Services", KO: "Consumer Defensive", PFE: "Healthcare",
  MRK: "Healthcare", XOM: "Energy", CVX: "Energy", ABBV: "Healthcare",
  T: "Communication Services", NKE: "Consumer Cyclical", ABT: "Healthcare",
  CRM: "Technology", LLY: "Healthcare", BMY: "Healthcare", PM: "Consumer Defensive",
  IBM: "Technology", GE: "Industrials", CAT: "Industrials", GS: "Financial Services",
  BA: "Industrials", RTX: "Industrials", COP: "Energy", WFC: "Financial Services",
  MS: "Financial Services", AXP: "Financial Services", BLK: "Financial Services",
  LOW: "Consumer Cyclical", F: "Consumer Cyclical", GM: "Consumer Cyclical",
  DE: "Industrials", MMM: "Industrials", LMT: "Industrials",
  UPS: "Industrials", SLB: "Energy", MO: "Consumer Defensive", TGT: "Consumer Cyclical",
};

export function getSector(ticker: string): string {
  return SECTOR_MAP[ticker] || "N/A";
}

export interface StockData {
  ticker: string;
  name: string;
  sector: string;
  timestamps: number[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
  currentPrice: number;
  prevClose: number;
  marketCap: number;
  dataQuality?: number;
  lastUpdated?: number;
}

export const NASDAQ_TICKERS = [
  "AAPL", "MSFT", "AMZN", "GOOGL", "GOOG", "META", "NVDA", "TSLA",
  "AVGO", "PEP", "COST", "CSCO", "TMUS", "ADBE", "NFLX", "AMD",
  "INTC", "QCOM", "AMGN", "INTU", "HON", "AMAT", "PYPL", "ADP",
  "LIN", "ISRG", "SBUX", "BKNG", "GILD", "VRTX", "MDLZ", "ADI",
  "REGN", "PANW", "MU", "SNPS", "LRCX", "KLAC", "CSX", "NXPI",
  "ASML", "CDNS", "CHTR", "MAR", "MELI", "ABNB", "CTAS", "DXCM",
  "ORLY", "PDD", "FTNT", "WDAY", "MRVL", "JD", "CPRT", "AEP",
  "KDP", "EXC", "FAST", "MNST", "CTSH", "AZN", "BIIB", "TEAM",
  "XEL", "EA", "CRWD", "ANSS", "VRSK", "ODFL", "CSGP", "PCAR",
  "ILMN", "PAYX", "DLTR", "EBAY", "ZM", "SQ", "DDOG", "SNOW",
  "PLTR", "MDB", "ROKU", "OKTA", "NET", "DOCU", "SHOP", "TWLO",
];

export const NYSE_TICKERS = [
  "JPM", "JNJ", "V", "WMT", "PG", "MA", "DIS", "UNH", "HD", "BAC",
  "VZ", "KO", "PFE", "MRK", "XOM", "CVX", "ABBV", "T", "NKE", "ABT",
  "CRM", "LLY", "BMY", "PM", "IBM", "GE", "CAT", "GS", "RTX", "COP",
  "WFC", "MS", "AXP", "C", "BLK", "SPGI", "CI", "MMC", "MET", "AIG",
  "TGT", "LOW", "F", "GM", "MO", "SLB", "FDX", "CNI", "CSX", "NSC",
  "UPS", "DE", "MMM", "HON", "ITW", "EMR", "ETN", "NOC", "LMT", "BA",
  "RTX", "GD", "TDG", "ODFL", "UNP", "ICE", "CME", "MCO", "EW", "CI",
  "ELV", "HUM", "DHR", "TMO", "AON", "AJG", "TRV", "ALL", "CB", "AFL",
  "SYK", "BDX", "BSX", "ISRG", "ZTS", "GILD", "VRTX", "REGN", "BIIB",
  "CL", "KMB", "PEP", "KO", "MDLZ", "GIS", "HSY", "K", "SYY", "CAG",
  "NEM", "FCX", "DOW", "APD", "LIN", "ECL", "SHW", "PPG", "LYB", "ALB",
];

export const ALL_TICKERS = [...NASDAQ_TICKERS, ...NYSE_TICKERS];

// ─── Geriye Uyumlu Fetch Fonksiyonları (Kimi v4.0 dosyaları için) ───

import { fetchStockDataHybrid } from "./dataProviders";
import type { ScannerStockData } from "./dataProviders";

/**
 * fetchYF — Raw Yahoo Finance response formatında döndürür
 * Kimi v4.0 dosyaları (backtestEngine.ts, earningsMomentum.ts) bunu kullanıyor
 */
export async function fetchYF(ticker: string, _interval?: string, _range?: string): Promise<any> {
  const result = await fetchStockDataHybrid(ticker);
  if (!result.data) return null;
  const d = result.data;
  return {
    chart: {
      result: [{
        meta: {
          regularMarketPrice: d.currentPrice,
          previousClose: d.prevClose,
          shortName: d.name,
          symbol: d.ticker,
        },
        indicators: {
          quote: [{
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            volume: d.volume,
          }]
        },
        timestamp: d.timestamps,
      }]
    }
  };
}

/**
 * fetchStockData — StockData formatında döndürür
 * Kimi v4.0 dosyaları (advancedPattern.ts, patternEngine.ts) bunu kullanıyor
 */
export async function fetchStockData(ticker: string): Promise<StockData | null> {
  const result = await fetchStockDataHybrid(ticker);
  return result.data || null;
}

// Re-export modern API
export { fetchStockDataHybrid, fetchStockDataFromProvider } from "./dataProviders";
export type { ScannerStockData } from "./dataProviders";
