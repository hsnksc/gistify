export interface ScoreExplanation {
  factor: string;
  score: number;
  weight: number;
  reason: string;
  detail: string;
}

export interface ConfidenceBreakdown {
  dataCompleteness: number;
  priceRecency: number;
  volumeQuality: number;
  indicatorReliability: number;
  overall: number;
  label: "HIGH" | "MEDIUM" | "LOW";
}

export interface RankingInfo {
  rankingScore: number;
  momentumContribution: number;
  confidenceContribution: number;
  rrContribution: number;
  patternBonus: number;
  rank: number;
}

export interface StockResult {
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  prevClose: number;
  priceChangePct: number;
  openPrice: number;
  opening30mHigh: number;
  openingMomentum: number;
  volume: number;
  avgVolume20d: number;
  volumeRatio: number;
  opening30mVolume: number;
  rsi: number;
  rsi2: number;
  rsi7: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  vwap: number;
  vwapSlope: number;
  vwapDeviation: number;
  atr14d: number;
  atrMomentumScore: number;
  gapScore: number;
  orbScore: number;
  structureScore: number;
  rvolScore: number;
  rsiShortScore: number;
  catalystScore: number;
  high52w: number;
  low52w: number;
  range52wPct: number;
  marketCap: number;
  avgDollarVolume: number;
  score: number;
  signal: string;
  timestamp: string;
  targetPrice?: number;
  ivProxy?: number;
  earningsWarning?: string | null;
  confidenceScore?: number;
  confidenceBreakdown?: ConfidenceBreakdown;
  rankingScore?: number;
  rankingInfo?: RankingInfo;
  scoreExplanations?: ScoreExplanation[];
  dataQuality?: "GOOD" | "FAIR" | "POOR";
  rsiWarning?: string | null;
  bearScore?: number;
  bearSignal?: string;
  persistenceScore?: number;
  persistenceDirection?: "BULL" | "BEAR";
  isT1Suitable?: boolean;
  t1Note?: string;
  catalystFlags?: string[];
  catalystSummary?: string;
  microScore?: number;
  microReversalRisk?: string;
  microWarning?: string | null;
}

export interface OptionSetup {
  signal: string;
  strategy: string;
  strike: number;
  dte: number;
  otmPct: number;
  pop?: number;
  expectedMove?: number;
  kellySize?: string;
  reason?: string;
  targetMove?: string;
  riskReward?: string;
  maxLoss?: string;
  takeProfit?: string;
  stopCondition?: string;
  entryCondition?: string;
  pdtNote?: string;
}

export interface BiDirectionalSetup {
  call: OptionSetup;
  put: OptionSetup;
  pdtPersistenceScore: number;
  pdtSuitable: boolean;
  recommendation: string;
}

export interface ScanStats {
  yahooSuccess: number;
  massiveSuccess: number;
  twelvedataSuccess: number;
  alphavantageSuccess: number;
  totalFallbacks: number;
  rateLimitHits: number;
}

export interface T1SuitabilityResult {
  suitable: boolean;
  score: number;
  reasons: string[];
  warnings: string[];
  persistenceScore?: number;
}

export interface DirectionRecommendation {
  direction: "BULLISH" | "BEARISH" | "NEUTRAL";
  confidence: number;
  reasons: string[];
  primaryStrategy: string;
  alternativeStrategies: string[];
}

export interface ScanResponse {
  scanTime: string;
  totalScanned: number;
  totalMatches: number;
  marketStatus: string;
  stocks: StockResult[];
}
