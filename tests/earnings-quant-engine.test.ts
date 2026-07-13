import { describe, expect, it } from "vitest";
import type { Strategy } from "../shared/earnings";
import { buildQuantOverview, buildStrategyIntelligence } from "../server/earningsQuantEngine";

const baseStrategy: Strategy = {
  ticker: "TEST",
  price: "100",
  ivRank: "80",
  cpr: "0.70",
  type: "Iron Condor",
  budgetOptions: [],
};

describe("earnings quant engine", () => {
  it("switches a call-heavy positive-momentum ticker to a defined-risk bullish credit spread", () => {
    const closes = Array.from({ length: 30 }, (_, index) => 80 + index * 0.7);
    const intelligence = buildStrategyIntelligence(
      baseStrategy,
      [{ ticker: "TEST", date: "2099-07-30", time: "AMC", importance: 5 }],
      { vix: "19" },
      {
        ticker: "TEST",
        asOf: "2026-07-11",
        price: closes.at(-1)!,
        previousClose: closes.at(-2),
        closes,
        source: "fmp",
      }
    );

    expect(intelligence.decision.bias).toBe("bullish");
    expect(intelligence.decision.strategy).toBe("Bull Put Spread");
    expect(intelligence.decision.changed).toBe(true);
    expect(intelligence.options.callPutRatio).toBe(0.7);
    expect(intelligence.options.maxLoss).toBeGreaterThan(0);
    expect(intelligence.decision.legs).toHaveLength(2);
  });

  it("treats call/put ratios above one as put-heavy bearish flow", () => {
    const closes = Array.from({ length: 30 }, (_, index) => 120 - index * 0.8);
    const intelligence = buildStrategyIntelligence(
      { ...baseStrategy, cpr: "1.35" },
      [],
      { vix: "25" },
      {
        ticker: "TEST",
        asOf: "2026-07-11",
        price: closes.at(-1)!,
        previousClose: closes.at(-2),
        closes,
        source: "fmp",
      }
    );

    expect(intelligence.options.flowSignal).toBe("Put ağırlıklı");
    expect(intelligence.decision.bias).toBe("bearish");
    expect(intelligence.decision.strategy).toBe("Bear Call Spread");
  });

  it("summarizes strategy changes and live coverage", () => {
    const intelligence = buildStrategyIntelligence(baseStrategy, [], {}, {
      ticker: "TEST",
      asOf: "2026-07-11",
      price: 102,
      previousClose: 100,
      closes: Array.from({ length: 30 }, (_, index) => 90 + index * 0.4),
      source: "fmp",
    });
    const overview = buildQuantOverview([{ ...baseStrategy, intelligence }]);

    expect(overview.liveCoverage).toBe(100);
    expect(overview.strategyChanges).toBe(1);
    expect(overview.bullish + overview.neutral + overview.bearish).toBe(1);
  });

  it("uses deterministic scheduled-jump simulation and cost-aware risk metrics", () => {
    const earningsDate = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10);
    const closes = Array.from({ length: 35 }, (_, index) => 92 + Math.sin(index / 2) * 2 + index * 0.25);
    const args = [
      { ...baseStrategy, ivRank: "95" },
      [{ ticker: "TEST", date: earningsDate, time: "AMC" as const, importance: 5 }],
      { vix: "28", tenYearYield: "4.35%" },
      {
        ticker: "TEST",
        asOf: "2026-07-12",
        price: closes.at(-1)!,
        previousClose: closes.at(-2),
        closes,
        source: "fmp" as const,
      },
    ] as const;

    const first = buildStrategyIntelligence(...args);
    const second = buildStrategyIntelligence(...args);

    expect(first.options.pricingModel).toBe("SCHEDULED_JUMP_MC_PROXY");
    expect(first.options.simulationPaths).toBe(12_000);
    expect(first.options.probabilityOfProfit).toBe(second.options.probabilityOfProfit);
    expect(first.options.expectedValueAfterCosts).toBe(second.options.expectedValueAfterCosts);
    expect(first.options.estimatedSlippage).toBeGreaterThan(0);
    expect(first.options.eventJumpVolatility).toBeGreaterThan(0);
    expect(first.options.kellyMultiplier).toBe(0.1);
    expect(first.options.stressScenarios).toHaveLength(11);
    expect(first.options.stressLoss).toBeGreaterThanOrEqual(0);
    expect(["TRADE", "WATCH", "BLOCKED"]).toContain(first.decision.tradeStatus);
  });

  it("blocks stale earnings events instead of modeling a future jump", () => {
    const intelligence = buildStrategyIntelligence(
      baseStrategy,
      [{ ticker: "TEST", date: "2020-01-01", time: "AMC", importance: 5 }],
      {},
      {
        ticker: "TEST",
        asOf: "2026-07-12",
        price: 100,
        previousClose: 99,
        closes: Array.from({ length: 30 }, (_, index) => 90 + index * 0.3),
        source: "fmp",
      }
    );

    expect(intelligence.decision.tradeStatus).toBe("BLOCKED");
    expect(intelligence.options.eventJumpVolatility).toBe(0);
    expect(intelligence.alerts.some(alert => alert.title === "Aktif earnings etkinliği yok")).toBe(true);
  });
});
