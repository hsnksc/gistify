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

export interface TradePlan {
  entry: number;
  stop: number;
  target1: number;
  target2: number;
  rr_ratio: number;
  stop_pct: number;
  atr14: number;
  nat_r_pct: number;
}

export interface PositionSizing {
  shares: number;
  position_value: number;
  dollar_risk: number;
  risk_pct_of_account: number;
  kelly_fraction: number;
  account_size: number;
}

export interface FactorBreakdown {
  f1_momentum_quality: number;
  f2_relative_strength: number;
  f3_volume_liquidity: number;
  f4_technical_structure: number;
  f5_volatility_regime: number;
  f6_catalyst_flow: number;
}

export interface MarketRegime {
  score: number;
  class: string;
  long_multiplier: number;
  short_multiplier: number;
  vix: number;
  spy_vs_sma50: number;
  spy_vs_sma200: number;
  spy_5d_return: number;
}

export interface MomentumScoreOutcome {
  hit?: boolean;
  retPct?: number;
  status?: string;
  date?: string;
}

export interface MidasSignalRecord {
  // existing fields
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
  // v4.0 new fields
  apex_score?: number;
  raw_apex?: number;
  direction?: "LONG" | "SHORT";
  conviction_tier?: "A+" | "A" | "B" | "C" | "D";
  setup_type?: string;
  factor_breakdown?: FactorBreakdown;
  trade_plan?: TradePlan;
  position_sizing?: PositionSizing;
  liquidity?: {
    dollar_volume: number;
    spread_bps: number;
  };
  technical?: Record<string, any>;
  // v3 momentum learning fields
  mss?: number;
  grade?: string;
  phase?: string;
  catalystTier?: string;
  exhaustionFlags?: string[];
  paramsVersion?: string;
  componentScores?: Record<string, number>;
  mssChallenger?: number;
  trackType?: string;
  status?: string;
  t1?: MomentumScoreOutcome;
  t3?: MomentumScoreOutcome;
  t5?: MomentumScoreOutcome;
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
  version?: string;
  summary?: {
    strong_buy: number;
    buy: number;
    hold: number;
    sell: number;
    strong_sell: number;
    avg_confidence: number;
    market_sentiment: string;
  };
  market_regime?: MarketRegime;
  market_overview?: Record<string, MarketOverviewItem>;
  paramsVersion?: string;
  calibrationDate?: string;
  summaryNote?: string;
  rolling20HitRateT3?: number;
  gradeAHitRate?: number;
  gradeAHitCount?: number;
  gradeATotal?: number;
  gradeCounts?: Record<string, number>;
  phaseCounts?: Record<string, number>;
  mssTrend?: number[];
  exhaustionFlags?: string[];
  carryForwardHealth?: Record<string, unknown>;
  signals: MidasSignalRecord[];
  errors?: string[];
  pipeline?: MidasPipelineMetadata;
}
