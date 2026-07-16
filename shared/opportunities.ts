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
  tags?: string[];
  alertOnOpportunity: boolean;
  alertRules?: WatchlistAlertRules;
  addedAt: string;
  updatedAt: string;
}

export interface WatchlistAlertRules {
  opportunity: boolean;
  signalChange: boolean;
  convictionAbove?: number;
  priceAbove?: number;
  priceBelow?: number;
  earningsWithinDays?: number;
}

export interface WatchlistCollectionRecord {
  id: string;
  userId: string;
  name: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistItemRecord {
  id: string;
  listId: string;
  userId: string;
  email: string;
  ticker: string;
  notes?: string;
  tags: string[];
  alertRules: WatchlistAlertRules;
  addedAt: string;
  updatedAt: string;
}

export interface WatchlistCollectionWithItems
  extends WatchlistCollectionRecord {
  items: WatchlistItemRecord[];
}

export type WatchlistNotificationKind =
  | "opportunity"
  | "signal_change"
  | "conviction"
  | "price_above"
  | "price_below"
  | "earnings";

export interface WatchlistNotificationRecord {
  id: string;
  userId: string;
  email: string;
  listId: string;
  ticker: string;
  kind: WatchlistNotificationKind;
  title: string;
  body: string;
  fingerprint: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
}

export interface WatchlistAlertStateRecord {
  itemId: string;
  ruleKind: WatchlistNotificationKind;
  lastCondition: boolean;
  lastValue?: string;
  lastSnapshotAt: string;
  updatedAt: string;
}

export type WatchlistDeliveryStatus =
  | "pending"
  | "sent"
  | "failed";

export interface WatchlistDeliveryRecord {
  id: string;
  notificationId: string;
  userId: string;
  email: string;
  channel: "email";
  status: WatchlistDeliveryStatus;
  attempts: number;
  nextAttemptAt: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  lastError?: string;
}

export interface SavedPortfolioScenarioRecord {
  id: string;
  userId: string;
  name: string;
  listId: string;
  weighting: "equal" | "risk_parity";
  transactionCostBps: number;
  tickers: string[];
  createdAt: string;
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
