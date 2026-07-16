import { describe, expect, it } from "vitest";
import {
  scoreStrategyLens,
  simulatePortfolio,
  type StrategyLabSignal,
} from "../client/src/components/momentum/strategyLab";

const trendLeader: StrategyLabSignal = {
  symbol: "LEAD",
  dailyPct: 2,
  weeklyPct: 8,
  monthlyPct: 18,
  conviction: 82,
  riskLevel: "LOW",
  factorBreakdown: {
    f1_momentum_quality: 24,
    f2_relative_strength: 19,
    f3_volume_liquidity: 13,
    f4_technical_structure: 14,
    f5_volatility_regime: 12,
    f6_catalyst_flow: 8,
  },
  technical: { volume_ratio: 1.8, vwap_distance: 2.5, rsi: 62, hv20: 25 },
  priceHistory: [100, 101, 102, 103, 104, 105, 106],
};

const laggard: StrategyLabSignal = {
  symbol: "LAG",
  dailyPct: -2,
  weeklyPct: -6,
  monthlyPct: -12,
  conviction: 35,
  riskLevel: "HIGH",
  factorBreakdown: {
    f1_momentum_quality: 5,
    f2_relative_strength: 4,
    f3_volume_liquidity: 4,
    f4_technical_structure: 3,
    f5_volatility_regime: 4,
    f6_catalyst_flow: 2,
  },
  technical: { volume_ratio: 0.5, vwap_distance: -3, rsi: 45, hv20: 80 },
  priceHistory: [100, 97, 101, 95, 99, 92, 96],
};

describe("strategy lab", () => {
  it("ranks stronger trend evidence above a laggard", () => {
    expect(scoreStrategyLens(trendLeader, "trend_continuation")).toBeGreaterThan(
      scoreStrategyLens(laggard, "trend_continuation")
    );
    expect(scoreStrategyLens(trendLeader, "defensive")).toBeGreaterThan(
      scoreStrategyLens(laggard, "defensive")
    );
  });

  it("simulates equal/risk-parity baskets and applies transaction costs", () => {
    const zeroCost = simulatePortfolio({
      selected: [trendLeader, laggard],
      universe: [trendLeader, laggard],
      weighting: "equal",
      transactionCostBps: 0,
    });
    const withCost = simulatePortfolio({
      selected: [trendLeader, laggard],
      universe: [trendLeader, laggard],
      weighting: "equal",
      transactionCostBps: 25,
    });
    const riskParity = simulatePortfolio({
      selected: [trendLeader, laggard],
      universe: [trendLeader, laggard],
      weighting: "risk_parity",
      transactionCostBps: 0,
    });

    expect(zeroCost).not.toBeNull();
    expect(withCost!.portfolio.returnPct).toBeLessThan(
      zeroCost!.portfolio.returnPct
    );
    expect(
      riskParity!.weights.find(item => item.symbol === "LEAD")!.weight
    ).toBeGreaterThan(
      riskParity!.weights.find(item => item.symbol === "LAG")!.weight
    );
    expect(zeroCost!.sessions).toBe(6);
  });

  it("does not invent a simulation when price history is missing", () => {
    expect(
      simulatePortfolio({
        selected: [{ ...trendLeader, priceHistory: undefined }],
        universe: [trendLeader],
        weighting: "equal",
        transactionCostBps: 10,
      })
    ).toBeNull();
  });
});
