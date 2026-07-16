import type { FactorBreakdown, MidasRiskLevel } from "@shared/midasSignals";

export type StrategyLensId =
  | "opening_drive"
  | "trend_continuation"
  | "reversal"
  | "defensive"
  | "catalyst";
export type PortfolioWeighting = "equal" | "risk_parity";

export interface StrategyLabSignal {
  symbol: string;
  dailyPct: number;
  weeklyPct: number;
  monthlyPct: number;
  conviction: number;
  riskLevel?: MidasRiskLevel;
  factorBreakdown?: FactorBreakdown;
  catalystTier?: string;
  setupType?: string;
  technical?: Record<string, unknown>;
  priceHistory?: number[];
}

export interface StrategyLensDefinition {
  id: StrategyLensId;
  weights: Array<{ factor: string; weight: number }>;
}

export const STRATEGY_LENSES: StrategyLensDefinition[] = [
  {
    id: "opening_drive",
    weights: [
      { factor: "Daily momentum", weight: 25 },
      { factor: "Relative volume", weight: 30 },
      { factor: "VWAP distance", weight: 25 },
      { factor: "Liquidity factor", weight: 20 },
    ],
  },
  {
    id: "trend_continuation",
    weights: [
      { factor: "Momentum quality", weight: 30 },
      { factor: "Relative strength", weight: 25 },
      { factor: "Technical structure", weight: 25 },
      { factor: "Weekly momentum", weight: 20 },
    ],
  },
  {
    id: "reversal",
    weights: [
      { factor: "RSI extreme", weight: 35 },
      { factor: "Reversal confirmation", weight: 30 },
      { factor: "Volatility quality", weight: 15 },
      { factor: "Conviction", weight: 20 },
    ],
  },
  {
    id: "defensive",
    weights: [
      { factor: "Risk level", weight: 30 },
      { factor: "Volatility regime", weight: 30 },
      { factor: "Realized volatility", weight: 25 },
      { factor: "Conviction", weight: 15 },
    ],
  },
  {
    id: "catalyst",
    weights: [
      { factor: "Catalyst factor", weight: 35 },
      { factor: "Catalyst tier", weight: 25 },
      { factor: "Volume confirmation", weight: 20 },
      { factor: "Price reaction", weight: 20 },
    ],
  },
];

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

function numberValue(source: Record<string, unknown> | undefined, key: string) {
  const value = source?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function factorScore(
  factors: FactorBreakdown | undefined,
  key: keyof FactorBreakdown,
  maximum: number
) {
  const value = factors?.[key];
  return typeof value === "number" ? clamp((value / maximum) * 100) : 50;
}

export function scoreStrategyLens(
  signal: StrategyLabSignal,
  lens: StrategyLensId
) {
  const technical = signal.technical;
  const rsi = numberValue(technical, "rsi") ?? 50;
  const volumeRatio = numberValue(technical, "volume_ratio") ?? 1;
  const vwapDistance = numberValue(technical, "vwap_distance") ?? 0;
  const hv20 = numberValue(technical, "hv20") ?? 50;
  const dailyMomentum = clamp(50 + signal.dailyPct * 8);
  const weeklyMomentum = clamp(50 + signal.weeklyPct * 3);

  switch (lens) {
    case "opening_drive":
      return (
        dailyMomentum * 0.25 +
        clamp((volumeRatio / 2) * 100) * 0.3 +
        clamp(50 + vwapDistance * 3) * 0.25 +
        factorScore(signal.factorBreakdown, "f3_volume_liquidity", 15) * 0.2
      );
    case "trend_continuation":
      return (
        factorScore(signal.factorBreakdown, "f1_momentum_quality", 25) * 0.3 +
        factorScore(signal.factorBreakdown, "f2_relative_strength", 20) * 0.25 +
        factorScore(signal.factorBreakdown, "f4_technical_structure", 15) * 0.25 +
        weeklyMomentum * 0.2
      );
    case "reversal": {
      const rsiExtreme = clamp((Math.abs(rsi - 50) / 30) * 100);
      const confirmed =
        (rsi < 50 && signal.dailyPct > 0) ||
        (rsi > 50 && signal.dailyPct < 0);
      return (
        rsiExtreme * 0.35 +
        (confirmed ? 100 : 25) * 0.3 +
        clamp(100 - Math.max(0, hv20 - 30) * 1.2) * 0.15 +
        signal.conviction * 0.2
      );
    }
    case "defensive": {
      const riskScore =
        signal.riskLevel === "LOW"
          ? 100
          : signal.riskLevel === "MEDIUM"
            ? 60
            : signal.riskLevel === "HIGH"
              ? 25
              : 50;
      return (
        riskScore * 0.3 +
        factorScore(signal.factorBreakdown, "f5_volatility_regime", 15) * 0.3 +
        clamp(110 - hv20) * 0.25 +
        signal.conviction * 0.15
      );
    }
    case "catalyst": {
      const tier = signal.catalystTier?.toUpperCase();
      const tierScore = tier === "A" ? 100 : tier === "B" ? 75 : tier === "C" ? 50 : 35;
      return (
        factorScore(signal.factorBreakdown, "f6_catalyst_flow", 10) * 0.35 +
        tierScore * 0.25 +
        clamp((volumeRatio / 2) * 100) * 0.2 +
        clamp(Math.abs(signal.dailyPct) * 12) * 0.2
      );
    }
  }
}

function dailyReturns(prices: number[]) {
  const returns: number[] = [];
  for (let index = 1; index < prices.length; index += 1) {
    if (prices[index - 1] > 0 && prices[index] > 0) {
      returns.push(prices[index] / prices[index - 1] - 1);
    }
  }
  return returns;
}

function standardDeviation(values: number[]) {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      (values.length - 1)
  );
}

function resolveWeights(
  series: Array<{ symbol: string; returns: number[] }>,
  weighting: PortfolioWeighting
) {
  if (weighting === "equal") {
    return new Map(series.map(item => [item.symbol, 1 / series.length]));
  }
  const inverseVolatility = series.map(item => ({
    symbol: item.symbol,
    value: 1 / Math.max(standardDeviation(item.returns), 0.0025),
  }));
  const total = inverseVolatility.reduce((sum, item) => sum + item.value, 0);
  return new Map(
    inverseVolatility.map(item => [item.symbol, item.value / total])
  );
}

function portfolioReturns(
  signals: StrategyLabSignal[],
  weighting: PortfolioWeighting,
  transactionCostBps: number
) {
  const valid = signals
    .map(signal => ({
      symbol: signal.symbol,
      returns: dailyReturns(
        (signal.priceHistory || []).filter(
          value => Number.isFinite(value) && value > 0
        )
      ),
    }))
    .filter(item => item.returns.length >= 4);
  if (!valid.length) return null;
  const length = Math.min(...valid.map(item => item.returns.length));
  const aligned = valid.map(item => ({
    ...item,
    returns: item.returns.slice(-length),
  }));
  const weights = resolveWeights(aligned, weighting);
  const values = Array.from({ length }, (_, index) =>
    aligned.reduce(
      (sum, item) => sum + item.returns[index] * (weights.get(item.symbol) || 0),
      0
    )
  );
  values[0] -= transactionCostBps / 10_000;
  return { values, weights, symbols: aligned.map(item => item.symbol) };
}

function metrics(returns: number[]) {
  let value = 1;
  let peak = 1;
  let maxDrawdown = 0;
  for (const dailyReturn of returns) {
    value *= 1 + dailyReturn;
    peak = Math.max(peak, value);
    maxDrawdown = Math.min(maxDrawdown, value / peak - 1);
  }
  const mean = returns.reduce((sum, item) => sum + item, 0) / returns.length;
  const volatility = standardDeviation(returns);
  return {
    returnPct: (value - 1) * 100,
    volatilityPct: volatility * Math.sqrt(252) * 100,
    sharpe: volatility > 0 ? (mean / volatility) * Math.sqrt(252) : 0,
    maxDrawdownPct: maxDrawdown * 100,
  };
}

export function simulatePortfolio({
  selected,
  universe,
  weighting,
  transactionCostBps,
}: {
  selected: StrategyLabSignal[];
  universe: StrategyLabSignal[];
  weighting: PortfolioWeighting;
  transactionCostBps: number;
}) {
  const portfolio = portfolioReturns(selected, weighting, transactionCostBps);
  const benchmark = portfolioReturns(universe, "equal", transactionCostBps);
  if (!portfolio || !benchmark) return null;
  const length = Math.min(portfolio.values.length, benchmark.values.length);
  const portfolioReturnsAligned = portfolio.values.slice(-length);
  const benchmarkReturnsAligned = benchmark.values.slice(-length);
  let portfolioValue = 100;
  let benchmarkValue = 100;
  const points = [{ session: 0, portfolio: 100, benchmark: 100 }];
  for (let index = 0; index < length; index += 1) {
    portfolioValue *= 1 + portfolioReturnsAligned[index];
    benchmarkValue *= 1 + benchmarkReturnsAligned[index];
    points.push({
      session: index + 1,
      portfolio: Number(portfolioValue.toFixed(2)),
      benchmark: Number(benchmarkValue.toFixed(2)),
    });
  }
  return {
    points,
    portfolio: metrics(portfolioReturnsAligned),
    benchmark: metrics(benchmarkReturnsAligned),
    weights: Array.from(portfolio.weights.entries())
      .map(([symbol, weight]) => ({ symbol, weight }))
      .sort((left, right) => right.weight - left.weight),
    sessions: length,
    coveredSymbols: portfolio.symbols.length,
  };
}
