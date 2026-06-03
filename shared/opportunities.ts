export type OpportunityWindow =
  | "pre_earnings_7d"
  | "pre_earnings_3d"
  | "pre_earnings_1d"
  | "intra_week";

export type OpportunityStrategyType =
  | "iv_crush"
  | "momentum_directional"
  | "earnings_surprise";

export type OpportunityConfidenceLevel = "high" | "medium" | "low";
export type OpportunityStatus = "active" | "expired" | "invalidated";
export type OpportunityTier = "free" | "pro" | "elite";
export type AgentRunStatus = "running" | "success" | "partial" | "failed";

export interface OpportunityRecord {
  id: string;
  sourceReportId?: string;
  sourceReportTitle?: string;
  ticker: string;
  name: string;
  sector: string;
  earningsDate: string;
  earningsTime: string;
  daysToEarnings: number;
  opportunityWindow: OpportunityWindow;
  momentumScore: number;
  priceChange6M: number;
  rsi14: number;
  currentIV: number;
  historicalIV: number;
  impliedMovePercent: number;
  expectedIVCrush: number;
  ivCrushScore: number;
  beatRate: number;
  maxLossPercent: number;
  targetProfitPercent: number;
  earningsMissRisk: number;
  gapRisk: number;
  compositeScore: number;
  confidenceLevel: OpportunityConfidenceLevel;
  directionalBias: string;
  strategyType: OpportunityStrategyType;
  strategyRating: number;
  recommendedStrategy: string;
  aiSummary: string;
  aiStrategyRationale: string;
  aiKeyCatalysts: string[];
  aiExecutionNotes: string;
  riskWarnings: string[];
  dataSources: string[];
  tierRequired: OpportunityTier;
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface WatchlistRecord {
  id: string;
  userId: string;
  email: string;
  ticker: string;
  notes?: string;
  alertOnOpportunity: boolean;
  addedAt: string;
  updatedAt: string;
}

export interface AgentRunRecord {
  id: string;
  runType: string;
  status: AgentRunStatus;
  tickersScanned: number;
  opportunitiesFound: number;
  errors: string[];
  log: string;
  retryCount: number;
  startedAt: string;
  completedAt?: string;
}
