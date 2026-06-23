export type MidasActionSignal =
  | "STRONG_BUY"
  | "BUY"
  | "HOLD"
  | "SELL"
  | "STRONG_SELL";

export type MidasPipelineStatus = "idle" | "ok" | "stale" | "error";

export interface MidasSignalRecord {
  symbol: string;
  signal: MidasActionSignal;
  strength: number;
  price: number;
  daily_pct: number;
  weekly_pct: number;
  monthly_pct: number;
  signals: string[];
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

export interface MidasSignalsData {
  timestamp: string;
  symbol_count: number;
  successful: number;
  failed: number;
  mode: string;
  signals: MidasSignalRecord[];
  errors?: string[];
  pipeline?: MidasPipelineMetadata;
}
