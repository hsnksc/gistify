/**
 * Client-side Filtre Motoru
 */

import type { StockResult } from "@/types/scanner";

export type MarketCapCategory = "ALL" | "MEGA" | "LARGE" | "MID";
export type SignalType = "ALL" | "STRONG_BUY" | "BUY" | "NEUTRAL_BULLISH";
export type RvolThreshold = "ALL" | "1" | "1.5" | "2" | "3";

export interface FilterState {
  sector: string;
  minScore: number;
  rvolThreshold: RvolThreshold;
  signalType: SignalType;
  marketCap: MarketCapCategory;
  rsiMin: number;
  rsiMax: number;
}

export const SECTORS = [
  "Tümü",
  "Technology",
  "Healthcare",
  "Consumer Cyclical",
  "Communication Services",
  "Industrials",
  "Financial Services",
  "Consumer Defensive",
  "Basic Materials",
  "Energy",
  "Real Estate",
  "Utilities",
];

export const DEFAULT_FILTERS: FilterState = {
  sector: "Tümü",
  minScore: 0,
  rvolThreshold: "ALL",
  signalType: "ALL",
  marketCap: "ALL",
  rsiMin: 0,
  rsiMax: 100,
};

export function applyFilters(stocks: StockResult[], filters: FilterState): StockResult[] {
  return stocks.filter((s) => {
    // Sector
    if (filters.sector !== "Tümü" && s.sector !== filters.sector) return false;
    // Min score
    if (s.score < filters.minScore) return false;
    // RVOL
    if (filters.rvolThreshold !== "ALL") {
      const thresh = parseFloat(filters.rvolThreshold);
      if (s.volumeRatio < thresh) return false;
    }
    // Signal type
    if (filters.signalType !== "ALL" && s.signal !== filters.signalType) return false;
    // Market cap
    if (filters.marketCap !== "ALL") {
      const mc = s.marketCap;
      if (filters.marketCap === "MEGA" && mc < 200_000_000_000) return false;
      if (filters.marketCap === "LARGE" && (mc < 10_000_000_000 || mc >= 200_000_000_000)) return false;
      if (filters.marketCap === "MID" && (mc < 1_000_000_000 || mc >= 10_000_000_000)) return false;
    }
    // RSI range
    if (s.rsi < filters.rsiMin || s.rsi > filters.rsiMax) return false;

    return true;
  });
}

export function loadFilters(): FilterState {
  try {
    const raw = localStorage.getItem("nmscanner_filters");
    if (raw) return { ...DEFAULT_FILTERS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_FILTERS };
}

export function saveFilters(f: FilterState) {
  localStorage.setItem("nmscanner_filters", JSON.stringify(f));
}
