/**
 * Hibrit Veri Saglayici Sistemi v4
 * Yahoo Finance + Finnhub + Alphavantage
 * - Bir API basarisiz olursa otomatik digerine gecis
 * - Rate limit tracking her provider icin ayri
 * - Adaptive gecikme yonetimi
 */

import { StockData } from "./yahooFinance";
import { validateCandleData, isSafeNumber } from "./sanityGate";

// ===================== API Anahtarlari =====================
// TEST EDILDI ✅: Yahoo Finance, Massive, TwelveData
// TEST EDILDI ❌: Finnhub (401), Stooq (key gerekli), Nasdaq Link (403), Finazon (401)
const ALPHAVANTAGE_API_KEY = import.meta.env.VITE_SCANNER_ALPHAVANTAGE_API_KEY?.trim() ?? "";
const TWELVEDATA_API_KEY = import.meta.env.VITE_SCANNER_TWELVEDATA_API_KEY?.trim() ?? "";
const MASSIVE_API_KEY = import.meta.env.VITE_SCANNER_MASSIVE_API_KEY?.trim() ?? "";

// ===================== CORS Proxy Listesi =====================
const PROXY_LIST = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
];

// ===================== Rate Limit Yapilandirmasi =====================
interface RateLimitState {
  callsThisMinute: number;
  minuteStart: number;
  dailyCalls: number;
  dayStart: number;
  isBlocked: boolean;
  blockUntil: number;
}

const RATE_LIMITS: Record<string, { perMinute: number; perDay: number }> = {
  yahoo: { perMinute: 30, perDay: 2000 },
  massive: { perMinute: 100, perDay: 10000 },  // TEST EDILDI ✅
  twelvedata: { perMinute: 8, perDay: 800 },    // TEST EDILDI ✅
  alphavantage: { perMinute: 5, perDay: 25 },
};

const rateLimitState: Record<string, RateLimitState> = {
  yahoo: { callsThisMinute: 0, minuteStart: Date.now(), dailyCalls: 0, dayStart: Date.now(), isBlocked: false, blockUntil: 0 },
  massive: { callsThisMinute: 0, minuteStart: Date.now(), dailyCalls: 0, dayStart: Date.now(), isBlocked: false, blockUntil: 0 },
  twelvedata: { callsThisMinute: 0, minuteStart: Date.now(), dailyCalls: 0, dayStart: Date.now(), isBlocked: false, blockUntil: 0 },
  alphavantage: { callsThisMinute: 0, minuteStart: Date.now(), dailyCalls: 0, dayStart: Date.now(), isBlocked: false, blockUntil: 0 },
};

function isProviderConfigured(provider: string): boolean {
  switch (provider) {
    case "yahoo":
      return true;
    case "massive":
      return MASSIVE_API_KEY.length > 0;
    case "twelvedata":
      return TWELVEDATA_API_KEY.length > 0;
    case "alphavantage":
      return ALPHAVANTAGE_API_KEY.length > 0;
    default:
      return false;
  }
}

// ===================== Provider Durumu (UI icin) =====================
export interface ProviderStatus {
  name: string;
  active: boolean;
  callsThisMinute: number;
  limitPerMinute: number;
  dailyCalls: number;
  limitPerDay: number;
  isBlocked: boolean;
  blockRemainingMs: number;
}

export function getProviderStatuses(): ProviderStatus[] {
  const now = Date.now();
  return Object.entries(RATE_LIMITS).map(([name, limits]) => {
    const state = rateLimitState[name];
    return {
      name: name.toUpperCase(),
      active: isProviderConfigured(name) && !state.isBlocked && state.callsThisMinute < limits.perMinute,
      callsThisMinute: state.callsThisMinute,
      limitPerMinute: limits.perMinute,
      dailyCalls: state.dailyCalls,
      limitPerDay: limits.perDay,
      isBlocked: state.isBlocked,
      blockRemainingMs: state.isBlocked ? Math.max(0, state.blockUntil - now) : 0,
    };
  });
}

// ===================== Yardimci Fonksiyonlar =====================
function jitter(maxMs = 200): Promise<void> {
  return new Promise((r) => setTimeout(r, Math.random() * maxMs));
}

async function fetchWithTimeout(url: string, timeoutMs = 15000): Promise<Response | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  for (const proxy of PROXY_LIST) {
    try {
      const res = await fetch(proxy + encodeURIComponent(url), {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);
      if (res.ok) return res;
    } catch {
      continue;
    }
  }
  clearTimeout(timeoutId);
  return null;
}

function resetRateLimitIfNeeded(provider: string) {
  const state = rateLimitState[provider];
  const now = Date.now();
  const oneMinute = 60 * 1000;
  const oneDay = 24 * 60 * 60 * 1000;

  if (now - state.minuteStart > oneMinute) {
    state.callsThisMinute = 0;
    state.minuteStart = now;
  }
  if (now - state.dayStart > oneDay) {
    state.dailyCalls = 0;
    state.dayStart = now;
  }
  if (state.isBlocked && now > state.blockUntil) {
    state.isBlocked = false;
  }
}

function canCall(provider: string): boolean {
  resetRateLimitIfNeeded(provider);
  const state = rateLimitState[provider];
  const limits = RATE_LIMITS[provider];

  if (state.isBlocked) return false;
  if (state.callsThisMinute >= limits.perMinute) {
    state.isBlocked = true;
    state.blockUntil = Date.now() + 60 * 1000;
    console.warn(`[RateLimit] ${provider.toUpperCase()} dakikada ${limits.perMinute} cagrida limiti asildi. 60sn blok.`);
    return false;
  }
  if (state.dailyCalls >= limits.perDay) {
    state.isBlocked = true;
    state.blockUntil = Date.now() + 60 * 60 * 1000;
    console.warn(`[RateLimit] ${provider.toUpperCase()} gunde ${limits.perDay} cagrida limiti asildi.`);
    return false;
  }
  return true;
}

function trackCall(provider: string) {
  const state = rateLimitState[provider];
  state.callsThisMinute++;
  state.dailyCalls++;
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ===================== SECTOR MAP =====================
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

// #############################################################################
// # YAHOO FINANCE CLIENT (Mevcut, refactor edilmis)
// #############################################################################

async function fetchYahooCandles(ticker: string): Promise<StockData | null> {
  if (!canCall("yahoo")) return null;

  const dailyUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=60d&includeAdjustedClose=true`;
  const intradayUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=30m&range=5d&includeAdjustedClose=true`;

  await jitter(100);

  const [dailyRes, intradayRes] = await Promise.all([
    fetchWithTimeout(dailyUrl),
    fetchWithTimeout(intradayUrl),
  ]);

  if (!dailyRes) return null;

  try {
    const dailyJson = await dailyRes.json();
    const intradayJson = intradayRes ? await intradayRes.json() : null;

    if (!dailyJson?.chart?.result?.[0]) return null;

    const daily = dailyJson.chart.result[0];
    const meta = daily.meta;
    const quote = daily.indicators.quote[0];

    const dTimestamps: number[] = [];
    const dOpen: number[] = [];
    const dHigh: number[] = [];
    const dLow: number[] = [];
    const dClose: number[] = [];
    const dVolume: number[] = [];

    for (let i = 0; i < daily.timestamp.length; i++) {
      if (quote.close[i] !== null && quote.volume[i] !== null) {
        dTimestamps.push(daily.timestamp[i]);
        dOpen.push(quote.open[i] ?? quote.close[i]!);
        dHigh.push(quote.high[i] ?? quote.close[i]!);
        dLow.push(quote.low[i] ?? quote.close[i]!);
        dClose.push(quote.close[i]!);
        dVolume.push(quote.volume[i]!);
      }
    }

    const candleValidation = validateCandleData(dTimestamps, dOpen, dHigh, dLow, dClose, dVolume);
    if (!candleValidation.isValid) {
      console.warn(`[Yahoo] Candle validation failed for ${ticker}: ${candleValidation.error}`);
      return null;
    }
    if (dClose.length < 20) return null;

    // Intraday
    let iTimestamps: number[] = [];
    let iOpen: number[] = [];
    let iHigh: number[] = [];
    let iLow: number[] = [];
    let iClose: number[] = [];
    let iVolume: number[] = [];

    if (intradayJson?.chart?.result?.[0]) {
      const intraday = intradayJson.chart.result[0];
      const iQuote = intraday.indicators.quote[0];
      for (let i = 0; i < intraday.timestamp.length; i++) {
        if (iQuote.close[i] !== null) {
          iTimestamps.push(intraday.timestamp[i]);
          iOpen.push(iQuote.open[i] ?? iQuote.close[i]!);
          iHigh.push(iQuote.high[i] ?? iQuote.close[i]!);
          iLow.push(iQuote.low[i] ?? iQuote.close[i]!);
          iClose.push(iQuote.close[i]!);
          iVolume.push(iQuote.volume[i] ?? 0);
        }
      }
    }

    trackCall("yahoo");

    const sector = SECTOR_MAP[ticker] || meta.sector || "N/A";

    return {
      ticker,
      name: meta.shortName || ticker,
      sector,
      timestamps: dTimestamps,
      open: dOpen,
      high: dHigh,
      low: dLow,
      close: dClose,
      volume: dVolume,
      currentPrice: meta.regularMarketPrice ?? dClose[dClose.length - 1],
      prevClose: meta.previousClose ?? dClose[dClose.length - 2] ?? dClose[dClose.length - 1],
      marketCap: meta.marketCap ?? 0,
      dataQuality: 90,
      lastUpdated: Date.now(),
    };
  } catch {
    return null;
  }
}

// #############################################################################
// # MASSIVE CLIENT (TEST EDILDI ✅)
// #############################################################################

/**
 * Massive API - Aggregate Bars (OHLCV)
 * Endpoint: /v2/aggs/ticker/{ticker}/range/1/day/{from}/{to}?apiKey=KEY
 * Response: {results: [{v, vw, o, c, h, l, t, n}, ...]}
 * t = epoch milliseconds
 * TEST: AAPL 40 gun veri, son kapanis $308.82 ✅
 */
async function fetchMassiveCandles(ticker: string): Promise<StockData | null> {
  if (!isProviderConfigured("massive")) return null;
  if (!canCall("massive")) return null;

  const now = Math.floor(Date.now() / 1000);
  const sixtyDaysAgo = now - 60 * 24 * 60 * 60;
  const fromDate = new Date(sixtyDaysAgo * 1000).toISOString().split("T")[0];
  const toDate = new Date().toISOString().split("T")[0];

  const url = `https://api.massive.com/v2/aggs/ticker/${encodeURIComponent(ticker)}/range/1/day/${fromDate}/${toDate}?apiKey=${MASSIVE_API_KEY}`;

  await jitter(200);

  try {
    const res = await fetchWithTimeout(url, 20000);
    if (!res) return null;

    const json = await res.json();
    if (!json.results || json.results.length < 20) {
      if (json.error) console.warn(`[Massive] ${ticker}: ${json.error}`);
      return null;
    }

    const results = json.results;

    const timestamps: number[] = [];
    const open: number[] = [];
    const high: number[] = [];
    const low: number[] = [];
    const close: number[] = [];
    const volume: number[] = [];

    for (const bar of results) {
      // t = epoch milliseconds → seconds
      const ts = Math.floor(bar.t / 1000);
      const o = bar.o;
      const h = bar.h;
      const l = bar.l;
      const c = bar.c;
      const v = bar.v;

      if (isSafeNumber(c) && isSafeNumber(ts)) {
        timestamps.push(ts);
        open.push(isSafeNumber(o) ? o : c);
        high.push(isSafeNumber(h) ? h : c);
        low.push(isSafeNumber(l) ? l : c);
        close.push(c);
        volume.push(isSafeNumber(v) ? Math.round(v) : 0);
      }
    }

    const validation = validateCandleData(timestamps, open, high, low, close, volume);
    if (!validation.isValid) {
      console.warn(`[Massive] Validation failed for ${ticker}: ${validation.error}`);
      return null;
    }

    trackCall("massive");

    return {
      ticker,
      name: ticker,
      sector: SECTOR_MAP[ticker] || "N/A",
      timestamps,
      open,
      high,
      low,
      close,
      volume,
      currentPrice: close[close.length - 1],
      prevClose: close.length > 1 ? close[close.length - 2] : close[close.length - 1],
      marketCap: 0,
      dataQuality: 92,
      lastUpdated: Date.now(),
    };
  } catch (err) {
    console.warn(`[Massive] ${ticker} hata:`, err instanceof Error ? err.message : err);
    return null;
  }
}

// #############################################################################
// # ALPHAVANTAGE CLIENT
// #############################################################################

interface AVTimeSeriesDaily {
  "Time Series (Daily)"?: Record<string, {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  }>;
  "Global Quote"?: {
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
  "Note"?: string; // Rate limit message
  "Information"?: string; // Error message
}

async function fetchAlphavantageCandles(ticker: string): Promise<StockData | null> {
  if (!isProviderConfigured("alphavantage")) return null;
  if (!canCall("alphavantage")) return null;

  // Alphavantage is very rate limited (5 calls/min), add extra delay
  await jitter(500);

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(ticker)}&apikey=${ALPHAVANTAGE_API_KEY}&outputsize=full`;

  try {
    const res = await fetchWithTimeout(url, 20000);
    if (!res) return null;

    const data: AVTimeSeriesDaily = await res.json();

    // Rate limit check
    if (data.Note?.includes("API call frequency")) {
      console.warn(`[Alphavantage] Rate limit hit for ${ticker}: ${data.Note}`);
      rateLimitState.alphavantage.isBlocked = true;
      rateLimitState.alphavantage.blockUntil = Date.now() + 60 * 1000;
      return null;
    }
    if (data.Information) {
      console.warn(`[Alphavantage] Error for ${ticker}: ${data.Information}`);
      return null;
    }

    const timeSeries = data["Time Series (Daily)"];
    if (!timeSeries) return null;

    const dates = Object.keys(timeSeries).sort(); // Oldest first
    if (dates.length < 20) return null;

    // Take last 60 days
    const recentDates = dates.slice(-60);

    const timestamps: number[] = [];
    const open: number[] = [];
    const high: number[] = [];
    const low: number[] = [];
    const close: number[] = [];
    const volume: number[] = [];

    for (const date of recentDates) {
      const day = timeSeries[date];
      const ts = Math.floor(new Date(date).getTime() / 1000);
      const o = parseFloat(day["1. open"]);
      const h = parseFloat(day["2. high"]);
      const l = parseFloat(day["3. low"]);
      const c = parseFloat(day["4. close"]);
      const v = parseInt(day["5. volume"], 10);

      if (isSafeNumber(c) && isSafeNumber(v)) {
        timestamps.push(ts);
        open.push(isSafeNumber(o) ? o : c);
        high.push(isSafeNumber(h) ? h : c);
        low.push(isSafeNumber(l) ? l : c);
        close.push(c);
        volume.push(v);
      }
    }

    const validation = validateCandleData(timestamps, open, high, low, close, volume);
    if (!validation.isValid) {
      console.warn(`[Alphavantage] Validation failed for ${ticker}: ${validation.error}`);
      return null;
    }

    trackCall("alphavantage");

    const sector = SECTOR_MAP[ticker] || "N/A";
    const currentPrice = close[close.length - 1];
    const prevClose = close.length > 1 ? close[close.length - 2] : currentPrice;

    return {
      ticker,
      name: ticker,
      sector,
      timestamps,
      open,
      high,
      low,
      close,
      volume,
      currentPrice,
      prevClose,
      marketCap: 0,
      dataQuality: 60,
      lastUpdated: Date.now(),
    };
  } catch {
    return null;
  }
}

// #############################################################################
// # TWELVE DATA CLIENT
// #############################################################################

/**
 * Twelve Data API:
 * - Time Series: /time_series?symbol=AAPL&interval=1day&outputsize=60
 * - Quote: /quote?symbol=AAPL
 * - JSON format
 * - CORS proxy gerekli
 */
async function fetchTwelveDataCandles(ticker: string): Promise<StockData | null> {
  if (!isProviderConfigured("twelvedata")) return null;
  if (!canCall("twelvedata")) return null;

  const baseUrl = "https://api.twelvedata.com";
  const tsUrl = `${baseUrl}/time_series?symbol=${encodeURIComponent(ticker)}&interval=1day&outputsize=60&apikey=${TWELVEDATA_API_KEY}&format=JSON`;
  const quoteUrl = `${baseUrl}/quote?symbol=${encodeURIComponent(ticker)}&apikey=${TWELVEDATA_API_KEY}`;

  await jitter(400);

  try {
    // Proxy uzerunden cek (CORS olabilir)
    const [tsRes, quoteRes] = await Promise.all([
      fetchWithTimeout(tsUrl, 20000),
      fetchWithTimeout(quoteUrl, 20000),
    ]);

    if (!tsRes) return null;
    const tsJson = await tsRes.json();
    if (tsJson.status === "error" || !tsJson.values || tsJson.values.length < 20) {
      console.warn(`[TwelveData] ${ticker}: ${tsJson.message || "No data"}`);
      return null;
    }

    // TwelveData values: yeniden eskiye sirali
    const values = tsJson.values.reverse(); // eskiden yeniye

    const timestamps: number[] = [];
    const open: number[] = [];
    const high: number[] = [];
    const low: number[] = [];
    const close: number[] = [];
    const volume: number[] = [];

    for (const v of values) {
      const ts = Math.floor(new Date(v.datetime).getTime() / 1000);
      const o = parseFloat(v.open);
      const h = parseFloat(v.high);
      const l = parseFloat(v.low);
      const c = parseFloat(v.close);
      const vol = parseInt(v.volume || "0", 10);

      if (!isNaN(c) && !isNaN(ts)) {
        timestamps.push(ts);
        open.push(!isNaN(o) ? o : c);
        high.push(!isNaN(h) ? h : c);
        low.push(!isNaN(l) ? l : c);
        close.push(c);
        volume.push(!isNaN(vol) ? vol : 0);
      }
    }

    const validation = validateCandleData(timestamps, open, high, low, close, volume);
    if (!validation.isValid) {
      console.warn(`[TwelveData] Validation failed for ${ticker}: ${validation.error}`);
      return null;
    }

    trackCall("twelvedata");

    // Quote verisi
    let currentPrice = close[close.length - 1];
    let prevClose = close.length > 1 ? close[close.length - 2] : currentPrice;

    if (quoteRes) {
      try {
        const qJson = await quoteRes.json();
        if (qJson.price) currentPrice = parseFloat(qJson.price);
        if (qJson.previous_close) prevClose = parseFloat(qJson.previous_close);
      } catch {
        // quote opsiyonel
      }
    }

    return {
      ticker,
      name: tsJson.meta?.name || tsJson.meta?.symbol || ticker,
      sector: SECTOR_MAP[ticker] || "N/A",
      timestamps,
      open,
      high,
      low,
      close,
      volume,
      currentPrice,
      prevClose,
      marketCap: 0,
      dataQuality: 88,
      lastUpdated: Date.now(),
    };
  } catch (err) {
    console.warn(`[TwelveData] ${ticker} hata:`, err instanceof Error ? err.message : err);
    return null;
  }
}

// #############################################################################
// # HIBRIT YONETICI (Hybrid Manager)
// #############################################################################

export type ProviderName = "yahoo" | "massive" | "twelvedata" | "alphavantage";

export interface HybridFetchResult {
  data: StockData | null;
  provider: ProviderName | null;
  attempts: { provider: ProviderName; success: boolean; error?: string }[];
}

/**
 * Hibrit veri cekme: Oncelik sirasiyla dener
 * 1. Yahoo Finance (en zengin veri: marketCap, intraday) - TEST EDILDI ✅
 * 2. Massive (aggregate bars OHLCV, yuksek limit) - TEST EDILDI ✅
 * 3. TwelveData (60 gun gunluk + real-time quote) - TEST EDILDI ✅
 * 4. Alphavantage (son care, rate limit cok dusuk)
 *
 * NOT: Finnhub (401), Stooq (key), Nasdaq Link (403), Finazon (401) kaldırıldı
 */
export async function fetchStockDataHybrid(ticker: string): Promise<HybridFetchResult> {
  const attempts: HybridFetchResult["attempts"] = [];

  // 1. Yahoo Finance dene (ana kaynak)
  try {
    const yahooData = await fetchYahooCandles(ticker);
    if (yahooData) {
      attempts.push({ provider: "yahoo", success: true });
      return { data: yahooData, provider: "yahoo", attempts };
    }
    attempts.push({ provider: "yahoo", success: false, error: "No data returned" });
  } catch (e) {
    attempts.push({ provider: "yahoo", success: false, error: e instanceof Error ? e.message : "Unknown error" });
  }

  // 2. Massive dene (opsiyonel)
  if (isProviderConfigured("massive")) {
    try {
      const massiveData = await fetchMassiveCandles(ticker);
      if (massiveData) {
        attempts.push({ provider: "massive", success: true });
        return { data: massiveData, provider: "massive", attempts };
      }
      attempts.push({ provider: "massive", success: false, error: "No data returned" });
    } catch (e) {
      attempts.push({ provider: "massive", success: false, error: e instanceof Error ? e.message : "Unknown error" });
    }
  } else {
    attempts.push({ provider: "massive", success: false, error: "Provider not configured" });
  }

  // 3. Twelve Data dene (opsiyonel)
  if (isProviderConfigured("twelvedata")) {
    try {
      const tdData = await fetchTwelveDataCandles(ticker);
      if (tdData) {
        attempts.push({ provider: "twelvedata", success: true });
        return { data: tdData, provider: "twelvedata", attempts };
      }
      attempts.push({ provider: "twelvedata", success: false, error: "No data returned" });
    } catch (e) {
      attempts.push({ provider: "twelvedata", success: false, error: e instanceof Error ? e.message : "Unknown error" });
    }
  } else {
    attempts.push({ provider: "twelvedata", success: false, error: "Provider not configured" });
  }

  // 4. Alphavantage dene (opsiyonel, son care)
  if (isProviderConfigured("alphavantage")) {
    try {
      const avData = await fetchAlphavantageCandles(ticker);
      if (avData) {
        attempts.push({ provider: "alphavantage", success: true });
        return { data: avData, provider: "alphavantage", attempts };
      }
      attempts.push({ provider: "alphavantage", success: false, error: "No data returned" });
    } catch (e) {
      attempts.push({ provider: "alphavantage", success: false, error: e instanceof Error ? e.message : "Unknown error" });
    }
  } else {
    attempts.push({ provider: "alphavantage", success: false, error: "Provider not configured" });
  }

  // Hicbiri basarili olamadi
  console.error(`[Hybrid] ${ticker} icin tum API'ler basarisiz oldu.`);
  return { data: null, provider: null, attempts };
}

/**
 * Tek bir provider'dan veri cek (manual secim icin)
 */
export async function fetchStockDataFromProvider(
  ticker: string,
  provider: ProviderName
): Promise<StockData | null> {
  switch (provider) {
    case "yahoo": return fetchYahooCandles(ticker);
    case "massive": return fetchMassiveCandles(ticker);
    case "twelvedata": return fetchTwelveDataCandles(ticker);
    case "alphavantage": return fetchAlphavantageCandles(ticker);
    default: return null;
  }
}

// Geriye uyumluluk: Eski fetchStockData imzasi
export async function fetchStockData(ticker: string): Promise<StockData | null> {
  const result = await fetchStockDataHybrid(ticker);
  return result.data;
}

// Re-export tickers
export { NASDAQ_TICKERS, NYSE_TICKERS, ALL_TICKERS } from "./yahooFinance";
