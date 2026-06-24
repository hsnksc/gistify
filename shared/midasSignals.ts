export type MidasActionSignal =
  | "STRONG_BUY"
  | "BUY"
  | "HOLD"
  | "SELL"
  | "STRONG_SELL";

export type MidasPipelineStatus = "idle" | "ok" | "stale" | "error";
export type MidasRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface MidasSignalLayers {
  momentumScore?: number;
  oscillatorScore?: number;
  trendScore?: number;
  confluenceScore?: number;
}

export interface MidasSignalRecord {
  symbol: string;
  signal: MidasActionSignal;
  strength: number;
  price: number;
  daily_pct: number;
  weekly_pct: number;
  monthly_pct: number;
  signals: string[];
  confidence?: number;
  riskLevel?: MidasRiskLevel;
  notes?: string;
  layers?: MidasSignalLayers;
  timestamp?: string;
}

export interface MidasPipelineMetadata {
  configuredSourceFile: string | null;
  resolvedSourceFile: string | null;
  pollIntervalMs: number;
  lastAttemptAt: string | null;
  lastSyncedAt: string | null;
  lastSourceModifiedAt: string | null;
  status: MidasPipelineStatus;
  error?: string;
  usingFallback: boolean;
}

export interface MarketOverviewItem {
  name: string;
  price: number;
  change_pct: number;
  volume: number;
}

export interface MidasSignalsData {
  timestamp: string;
  symbol_count: number;
  successful: number;
  failed: number;
  mode: string;
  summary?: {
    strong_buy: number;
    buy: number;
    hold: number;
    sell: number;
    strong_sell: number;
    avg_confidence: number;
    market_sentiment: string;
  };
  market_overview?: Record<string, MarketOverviewItem>;
  signals: MidasSignalRecord[];
  errors?: string[];
  pipeline?: MidasPipelineMetadata;
}
