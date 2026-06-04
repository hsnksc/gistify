export interface ScoreExplanation {
  factor: string;
  score: number;
  weight: number;
  reason: string;
  detail: string;
}

export interface ConfidenceBreakdown {
  dataCompleteness: number;   // 0-100: Tüm veri alanları mevcut mu?
  priceRecency: number;       // 0-100: Fiyat verisi ne kadar taze?
  volumeQuality: number;      // 0-100: Hacim verisi güvenilir mi?
  indicatorReliability: number; // 0-100: Teknik göstergeler güvenilir mi?
  overall: number;            // 0-100: Ağırlıklı ortalama
  label: "HIGH" | "MEDIUM" | "LOW";
}

export interface RankingInfo {
  rankingScore: number;       // 0-100: Final sıralama skoru
  momentumContribution: number;  // momentum * 0.55
  confidenceContribution: number; // confidence * 0.25
  rrContribution: number;     // risk/return * 0.10
  patternBonus: number;       // pattern * 0.10
  rank: number;               // Sıralama pozisyonu (1-based)
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
  atrMomentumScore: number;   // Velocity Score (v2)
  gapScore: number;
  orbScore: number;
  structureScore: number;
  rvolScore: number;
  rsiShortScore: number;
  catalystScore: number;      // Geriye uyumlu: MarketCapScore
  high52w: number;
  low52w: number;
  range52wPct: number;
  marketCap: number;
  avgDollarVolume: number;
  score: number;
  signal: string;
  timestamp: string;
  // v2 extensions
  targetPrice?: number;
  ivProxy?: number;
  earningsWarning?: string | null;
  // v4 extensions (Faz 1)
  confidenceScore?: number;
  confidenceBreakdown?: ConfidenceBreakdown;
  rankingScore?: number;
  rankingInfo?: RankingInfo;
  scoreExplanations?: ScoreExplanation[];
  dataQuality?: "GOOD" | "FAIR" | "POOR";
  // v4.1: RSI RED filtresi uyarısı
  rsiWarning?: string | null;
  // v4.2: Çift yönlü motor + PDT persistence
  bearScore?: number;
  bearSignal?: "STRONG_SELL" | "SELL" | "NEUTRAL" | "AVOID";
  persistenceScore?: number;
  persistenceDirection?: "BULL" | "BEAR";
  isT1Suitable?: boolean;
  t1Note?: string;
  // v4.3: AI Catalyst + Microstructure (PDF'den)
  catalystScore?: 1 | 2 | 3;
  catalystFlags?: string[];
  catalystSummary?: string;
  microScore?: number;
  microReversalRisk?: "LOW" | "MEDIUM" | "HIGH";
  microWarning?: string | null;
}

// ─── v4.2: Çift Yönlü Motor Tipleri ───

export interface BearScoreResult {
  score: number;
  signal: "STRONG_SELL" | "SELL" | "NEUTRAL" | "AVOID";
  factors: Record<string, number>;
}

export interface PersistenceResult {
  score: number;
  isT1Suitable: boolean;
  note: string;
}

export interface OptionSetup {
  signal: "STRONG_BUY" | "BUY" | "NEUTRAL" | "AVOID";
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

export type DirectionRecommendation =
  | "STRADDLE"
  | "CALL_PRIMARY"
  | "PUT_PRIMARY"
  | "WAIT";

export interface BiDirectionalSetup {
  call: OptionSetup;
  put: OptionSetup;
  pdtPersistenceScore: number;
  pdtSuitable: boolean;
  recommendation: DirectionRecommendation;
  t1Result?: {
    suitable: boolean;
    reasons: string[];
  };
}

export interface T1SuitabilityResult {
  suitable: boolean;
  reasons: string[];
  persistenceScore: number;
}

export interface ScanStats {
  yahooSuccess: number;
  massiveSuccess: number;
  twelvedataSuccess: number;
  alphavantageSuccess: number;
  totalFallbacks: number;
  rateLimitHits: number;
}

export interface ScanResponse {
  scanTime: string;
  totalScanned: number;
  totalMatches: number;
  marketStatus: string;
  stocks: StockResult[];
  stats?: ScanStats;
}

export interface BacktestTrade {
  ticker: string;
  date: string;
  entry: number;
  exit: number;
  tp_level: number;
  sl_level: number;
  pnl_pct: number;
  exit_reason: string;
  day_high: number;
  day_low: number;
  rvol: number;
  atr: number;
  score: number;
}

export interface BacktestResponse {
  startDate: string;
  endDate: string;
  tpPct: number;
  slPct: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  avgPnL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  tpExits: number;
  slExits: number;
  eodExits: number;
  trades: BacktestTrade[];
  error?: string;
}
