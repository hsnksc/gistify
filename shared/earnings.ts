import type { AdvancedOptionsAnalytics } from "./optionsAnalytics";

export type EarningsTime = "BMO" | "AMC" | "TBA";

export type StrategyType =
  | "Iron Condor"
  | "Bull Call Spread"
  | "Bear Call Spread"
  | "Bear Put Spread"
  | "Bull Put Spread"
  | "Long Straddle"
  | "Long Strangle"
  | "Butterfly"
  | "Calendar Spread"
  | "Ratio Spread"
  | "Long Call"
  | "Long Put"
  | "Custom";

export type Sentiment =
  | "Güçlü Boğa"
  | "Boğa"
  | "Nötr"
  | "Ayı"
  | "Güçlü Ayı"
  | "Unknown";

export type FOMCStatus = "distant" | "approaching" | "imminent" | "blackout";

export type RiskLevel = "low" | "medium" | "high";

export type PipelineStatus = "idle" | "ok" | "stale" | "error";

export interface MacroData {
  vix?: string;
  sp500?: string;
  nasdaq?: string;
  russell2000?: string;
  tenYearYield?: string;
  dxy?: string;
  wti?: string;
  bitcoin?: string;
  fearGreed?: string;
  regime?: string;
  notes?: string[];
}

export interface FOMCData {
  date?: string;
  daysUntil?: number;
  blackoutStart?: string;
  status?: FOMCStatus;
  currentRate?: string;
  marketExpectation?: string;
  notes?: string[];
}

export interface EarningsEvent {
  ticker: string;
  company?: string;
  sector?: string;
  date: string;
  time: EarningsTime;
  marketCap?: string;
  importance: number;
  expectedMove?: string;
  ivRank?: string;
  cpr?: string;
  strategy?: string;
  notes?: string[];
}

export interface Greeks {
  delta?: string;
  theta?: string;
  vega?: string;
  gamma?: string;
}

export interface BudgetOption {
  budget: string;
  strategy: string;
  cost: string;
  maxProfit: string;
  maxReturn?: string;
}

export interface Strategy {
  ticker: string;
  company?: string;
  sector?: string;
  price?: string;
  ivRank?: string;
  cpr?: string;
  type?: StrategyType;
  entry?: string;
  exit?: string;
  maxHold?: string;
  profitTarget?: string;
  credit?: string;
  maxRisk?: string;
  breakeven?: [string, string];
  koProbability?: string;
  positionSize?: string;
  stopLoss?: string;
  optimalExit?: string;
  ivCrush?: string;
  greeks?: Greeks;
  budgetOptions: BudgetOption[];
  notes?: string[];
  intelligence?: StrategyIntelligence;
}

export type QuantBias = "bullish" | "neutral" | "bearish";
export type QuantDataQuality = "live" | "mixed" | "report";
export type QuantAlertSeverity = "info" | "warning" | "critical";
export type QuantTradeStatus = "TRADE" | "WATCH" | "BLOCKED";

export interface QuantAlert {
  severity: QuantAlertSeverity;
  title: string;
  detail: string;
  action: string;
}

export interface QuantOptionLeg {
  action: "BUY" | "SELL";
  optionType: "CALL" | "PUT";
  quantity: number;
  strike: number;
  dte: number;
  modeledPremium: number;
}

export interface StrategyIntelligence {
  asOf: string;
  dataQuality: QuantDataQuality;
  sourceNote: string;
  market: {
    spot: number;
    previousClose?: number;
    change1d?: number;
    return5d?: number;
    return20d?: number;
    rsi14?: number;
    realizedVol20d?: number;
    momentumScore: number;
    momentumLabel: string;
  };
  options: {
    advanced?: AdvancedOptionsAnalytics;
    callPutRatio?: number;
    flowSignal: string;
    ivRank?: number;
    modeledIv: number;
    expectedMoveDollar: number;
    expectedMovePercent: number;
    pricingModel: "SCHEDULED_JUMP_MC_PROXY" | "CHAIN_CALIBRATED_JUMP_MC";
    simulationPaths: number;
    riskFreeRate: number;
    structuralVolatility: number;
    eventJumpVolatility: number;
    dte: number;
    probabilityOfProfit: number;
    expectedValue: number;
    expectedValueAfterCosts: number;
    estimatedSlippage: number;
    cvar95: number;
    stressLoss: number;
    stressScenarios: Array<{ shockPercent: number; pnl: number }>;
    maxProfit: number;
    maxLoss: number;
    returnOnRisk: number;
    breakevens: number[];
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    regTMargin: number;
    kellyFraction: number;
    kellyMultiplier: number;
  };
  decision: {
    strategy: StrategyType;
    previousStrategy?: StrategyType;
    changed: boolean;
    bias: QuantBias;
    confidence: number;
    compositeScore: number;
    tradeStatus: QuantTradeStatus;
    entryRule: string;
    exitRule: string;
    rationale: string[];
    legs: QuantOptionLeg[];
  };
  alerts: QuantAlert[];
}

export interface EarningsQuantOverview {
  asOf: string;
  liveCoverage: number;
  bullish: number;
  neutral: number;
  bearish: number;
  strategyChanges: number;
  criticalAlerts: number;
  methodology: string;
}

export interface CPRStock {
  ticker: string;
  company?: string;
  price?: string;
  hacimCPR?: string;
  oiCPR?: string;
  sentiment?: Sentiment;
  sector?: string;
  earningsDate?: string;
  ivRank?: string;
}

export interface PortfolioRecommendation {
  ticker: string;
  strategy: string;
  allocation: string;
  expectedReturn?: string;
  risk?: RiskLevel;
  sector?: string;
  fomcRisk?: string;
  entryExit?: string;
  entryWindow?: string;
  exitWindow?: string;
}

export interface PortfolioLevel {
  budget: string;
  totalAllocation?: string;
  recommendations: PortfolioRecommendation[];
}

export interface ActionPlanItem {
  week?: string;
  dateRange?: string;
  focus?: string;
  actions: string[];
}

export interface EarningsStrategyData {
  generatedAt: string;
  reportDate: string;
  currentMonth?: string;
  nextMonth?: string;
  title?: string;
  summary?: string;
  macro: MacroData;
  fomc?: FOMCData;
  calendar: EarningsEvent[];
  cprStocks: CPRStock[];
  strategies: Strategy[];
  budgetStrategies: Strategy[];
  portfolio: PortfolioLevel[];
  actionPlan: ActionPlanItem[];
  executiveSummary: string[];
  quantOverview?: EarningsQuantOverview;
}

export interface EarningsStrategyPipelineMetadata {
  configuredSourceFile: string | null;
  resolvedSourceFile: string | null;
  sourceFolder: string | null;
  pollIntervalMs: number;
  lastAttemptAt: string | null;
  lastSyncedAt: string | null;
  lastSourceModifiedAt: string | null;
  status: PipelineStatus;
  error?: string;
}

export interface EarningsStrategyApiResponse {
  success: boolean;
  data?: EarningsStrategyData;
  pipeline: EarningsStrategyPipelineMetadata;
  error?: string;
}
