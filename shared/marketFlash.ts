export type MarketFlashReportType = "pre-market" | "hourly" | "after-market";
export type MarketFlashSetupExpiry = "0DTE" | "weekly" | "monthly";
export type MarketFlashRiskLevel = "low" | "medium" | "high";
export type MarketFlashGapStatus =
  | "gap-up-maintained"
  | "gap-up-faded"
  | "gap-down-maintained"
  | "gap-down-faded"
  | "flat";

export interface MarketFlashIndexQuote {
  price: number;
  change: number;
  vwap?: number;
}

export interface MarketFlashMarketSummary {
  spy: MarketFlashIndexQuote;
  qqq: MarketFlashIndexQuote;
  iwm: MarketFlashIndexQuote;
  vix: MarketFlashIndexQuote;
}

export interface MarketFlashMover {
  ticker: string;
  price: number;
  change: number;
  catalyst: string;
  volume: number;
  sector: string;
  marketCap?: number;
  week52Range?: [number, number];
}

export interface MarketFlashSetup {
  ticker: string;
  price: number;
  setup: string;
  entry: number;
  stop: number;
  target: number;
  rr: number;
  expiry: MarketFlashSetupExpiry;
  catalyst: string;
  sector: string;
  // VPS momentum extensions
  direction?: "long" | "short";
  mss?: number;
  grade?: string;
  conviction?: "YÜKSEK" | "ORTA" | "DÜŞÜK" | "ZAYIF" | "YOK";
  fillSource?: "gate" | "watchlist" | "relative" | "forced";
  missedCriteria?: string[];
  phase?: string;
  scoreBreakdown?: Record<string, number>;
  optionAngle?: string;
  planNote?: string;
  exhaustionFlags?: string[];
  sources?: string[];
}

export interface MarketFlashGuaranteeMeta {
  fullCriteriaLong: number;
  fullCriteriaShort: number;
  weakSideNote?: string;
}

export interface MarketFlashEarningsItem {
  ticker: string;
  company?: string;
  time: "before-open" | "after-close" | "intraday";
  consensusEps?: number;
  consensusRev?: number;
  priorEps?: number;
  priorRev?: number;
  expectedMove?: string;
  analystSentiment?: "bullish" | "bearish" | "neutral";
  consensusRange?: string;
  note?: string;
}

export interface MarketFlashCarryForward {
  ticker: string;
  todayChange: number;
  gapStatus: MarketFlashGapStatus;
  bias: "CALL" | "PUT" | "NEUTRAL";
  setupType: string;
}

export interface MarketFlashRiskAssessment {
  level?: MarketFlashRiskLevel;
  title?: string;
  summary: string;
  details?: string[];
}

export interface MarketFlashReport {
  reportType: MarketFlashReportType;
  reportDate: string;
  generatedAt: string;
  marketSummary: MarketFlashMarketSummary;
  topMovers: {
    gainers: MarketFlashMover[];
    losers: MarketFlashMover[];
  };
  callSetups: MarketFlashSetup[];
  putSetups: MarketFlashSetup[];
  earningsCalendar: MarketFlashEarningsItem[];
  vwapNotes: string;
  riskAssessment: MarketFlashRiskAssessment;
  nextDayCarryForward: MarketFlashCarryForward[];
  // VPS momentum extensions
  guaranteeMeta?: MarketFlashGuaranteeMeta;
  systemStats?: Record<string, unknown>;
  carryForwardHealthCheck?: Record<string, unknown>;
}
