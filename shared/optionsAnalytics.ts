export type OptionRight = "CALL" | "PUT";

export interface CanonicalOptionQuote {
  symbol: string;
  underlying: string;
  expiration: string;
  strike: number;
  right: OptionRight;
  bid: number;
  ask: number;
  last?: number;
  volume?: number;
  openInterest?: number;
  impliedVolatility?: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  updatedAt?: string;
}

export interface CanonicalBar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CanonicalEarningsMarketData {
  ticker: string;
  asOf: string;
  spot: number;
  bars: CanonicalBar[];
  optionChain: CanonicalOptionQuote[];
  riskFreeRate?: number;
  dividendYield?: number;
  earningsDate?: string;
  historicalEarningsMoves?: number[];
  borrowRate?: number;
  provider: string;
  delayedMinutes?: number;
}

export interface SviSliceResult {
  expiration: string;
  dte: number;
  forward: number;
  points: number;
  rmse: number;
  parameters: { a: number; b: number; rho: number; m: number; sigma: number };
  calendarArbitrageWarning: boolean;
  butterflyArbitrageWarning: boolean;
}

export interface RiskNeutralDistributionPoint {
  terminalPrice: number;
  density: number;
}

export interface AdvancedOptionsAnalytics {
  status: "READY" | "DEGRADED" | "UNAVAILABLE";
  provider: string;
  asOf: string;
  chainContracts: number;
  liquidContracts: number;
  quoteCoveragePercent: number;
  staleQuotePercent: number;
  volumePutCallRatio?: number;
  openInterestPutCallRatio?: number;
  ivPutCallSkew?: number;
  atmIv?: number;
  termStructureSlope?: number;
  ivCrushEstimate?: number;
  surface: SviSliceResult[];
  rnd: {
    expiration?: string;
    expectedPrice?: number;
    downsideProbability?: number;
    expectedShortfall5?: number;
    points: RiskNeutralDistributionPoint[];
  };
  momentum: {
    score: number;
    regime: "STRONG_UP" | "UP" | "NEUTRAL" | "DOWN" | "STRONG_DOWN";
    rsi14?: number;
    macdHistogram?: number;
    atr14Percent?: number;
    volumeZScore?: number;
    gapPercent?: number;
  };
  jumpModel: {
    calibrated: boolean;
    annualIntensity: number;
    jumpMean: number;
    jumpVolatility: number;
    historicalSamples: number;
  };
  qualityGates: string[];
}

export interface PortfolioOptionPosition {
  ticker: string;
  quantity: number;
  multiplier?: number;
  underlyingPrice: number;
  beta?: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  marketValue: number;
}

export interface PortfolioRiskResult {
  betaWeightedDelta: number;
  netGamma: number;
  netVega: number;
  dailyTheta: number;
  marketValue: number;
  worstStressLoss: number;
  concentrationPercent: number;
  scenarios: Array<{ underlyingShock: number; volatilityShock: number; pnl: number }>;
  warnings: string[];
}
