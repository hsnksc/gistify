export type PortfolioAssetType = "stock" | "call" | "put";
export type PortfolioStrategyAction =
  | "add"
  | "hold"
  | "trim"
  | "hedge"
  | "exit"
  | "watch";
export type PortfolioPosture = "aggressive" | "balanced" | "defensive";
export type PortfolioModuleKind = "earning_strategy" | "momentum" | "daily";
export type PortfolioSignalBias = "bullish" | "bearish" | "neutral" | "context";

export interface PortfolioPositionRecord {
  id: string;
  userId: string;
  email: string;
  ticker: string;
  assetType: PortfolioAssetType;
  quantity: number;
  entryPrice: number;
  entryDate: string;
  strikePrice?: number;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioModuleSummary {
  module: PortfolioModuleKind;
  reportId?: string;
  title: string;
  asOfDate: string;
  coverageCount: number;
  subtitle?: string;
}

export interface PortfolioContextSummary {
  earningStrategy: PortfolioModuleSummary[];
  momentum: PortfolioModuleSummary[];
  daily: PortfolioModuleSummary[];
}

export interface PortfolioModuleMatch {
  module: PortfolioModuleKind;
  reportId?: string;
  title: string;
  asOfDate: string;
  bias: PortfolioSignalBias;
  signalScore?: number;
  note: string;
}

export interface PortfolioPositionInsight {
  position: PortfolioPositionRecord;
  convictionScore: number;
  riskScore: number;
  action: PortfolioStrategyAction;
  thesis: string;
  strategy: string;
  costBasis: number;
  estimatedRisk: number;
  moduleMatches: PortfolioModuleMatch[];
  signals: string[];
  warnings: string[];
}

export interface PortfolioAnalysisRecord {
  generatedAt: string;
  accountSize: number;
  totalCostBasis: number;
  estimatedPortfolioRisk: number;
  heatPct: number;
  canAddRisk: boolean;
  posture: PortfolioPosture;
  overallScore: number;
  summary: string;
  nextActions: string[];
  context: PortfolioContextSummary;
  positions: PortfolioPositionInsight[];
}
