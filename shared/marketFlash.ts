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
}

export interface MarketFlashEarningsItem {
  ticker: string;
  time: "before-open" | "after-close" | "intraday";
  consensusEps?: number;
  consensusRev?: number;
  priorEps?: number;
  priorRev?: number;
  expectedMove?: string;
  analystSentiment?: "bullish" | "bearish" | "neutral";
  consensusRange?: string;
}

export interface MarketFlashCarryForward {
  ticker: string;
  todayChange: number;
  gapStatus: MarketFlashGapStatus;
  bias: "CALL" | "PUT" | "NEUTRAL";
  setupType: string;
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
  riskAssessment: string;
  nextDayCarryForward: MarketFlashCarryForward[];
}
