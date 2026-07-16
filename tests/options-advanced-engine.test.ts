import { afterEach, describe, expect, it, vi } from "vitest";
import type { CanonicalEarningsMarketData, CanonicalOptionQuote } from "../shared/optionsAnalytics";
import { analyzeAdvancedOptions, calculatePortfolioRisk } from "../server/optionsAdvancedEngine";
import { loadEarningsMarketData, normalizeCanonicalMarketData, ThetaDataProvider } from "../server/optionsDataProvider";
import { buildStrategyIntelligence } from "../server/earningsQuantEngine";

function normalCdf(value: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(value));
  const density = Math.exp(-value * value / 2) / Math.sqrt(2 * Math.PI);
  const probability = 1 - density * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return value >= 0 ? probability : 1 - probability;
}

function optionPrice(spot: number, strike: number, days: number, iv: number, right: "CALL" | "PUT") {
  const time = days / 365;
  const d1 = (Math.log(spot / strike) + (0.04 + iv * iv / 2) * time) / (iv * Math.sqrt(time));
  const d2 = d1 - iv * Math.sqrt(time);
  const call = spot * normalCdf(d1) - strike * Math.exp(-0.04 * time) * normalCdf(d2);
  return right === "CALL" ? call : call - spot + strike * Math.exp(-0.04 * time);
}

function fixture(): CanonicalEarningsMarketData {
  const spot = 100;
  const asOf = "2026-07-12T16:00:00Z";
  const expiries = [{ date: "2026-07-24", days: 12 }, { date: "2026-08-21", days: 40 }];
  const optionChain: CanonicalOptionQuote[] = [];
  for (const expiry of expiries) {
    for (let strike = 70; strike <= 130; strike += 5) {
      for (const right of ["CALL", "PUT"] as const) {
        const iv = 0.42 + Math.abs(strike / spot - 1) * 0.24 + (right === "PUT" ? 0.015 : 0);
        const mid = Math.max(0.08, optionPrice(spot, strike, expiry.days, iv, right));
        optionChain.push({
          symbol: `TEST-${expiry.date}-${right}-${strike}`,
          underlying: "TEST",
          expiration: expiry.date,
          strike,
          right,
          bid: Math.max(0.01, mid - 0.04),
          ask: mid + 0.04,
          volume: right === "PUT" ? 80 : 100,
          openInterest: right === "PUT" ? 900 : 1000,
          impliedVolatility: iv,
          delta: right === "CALL" ? 0.5 : -0.5,
          gamma: 0.04,
          theta: -0.08,
          vega: 0.1,
          updatedAt: asOf,
        });
      }
    }
  }
  const bars = Array.from({ length: 45 }, (_, index) => {
    const close = 88 + index * 0.27 + Math.sin(index / 3);
    return { time: `2026-06-${String(index + 1).padStart(2, "0")}`, open: close - 0.2, high: close + 1, low: close - 1, close, volume: 1_000_000 + index * 12_000 };
  });
  return { ticker: "TEST", asOf, spot, bars, optionChain, riskFreeRate: 0.04, dividendYield: 0, earningsDate: "2026-07-20", historicalEarningsMoves: [-0.08, 0.11, -0.04, 0.07, 0.09, -0.12, 0.05, 0.03], provider: "fixture", delayedMinutes: 0 };
}

describe("advanced options analytics", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    delete process.env.THETADATA_REQUEST_GAP_MS;
    delete process.env.THETADATA_MAX_TICKERS;
    delete process.env.OPTIONS_DATA_PROVIDER;
    delete process.env.THETADATA_BASE_URL;
  });
  it("calibrates volatility slices, RND, flow, momentum and jump inputs from a liquid chain", () => {
    const result = analyzeAdvancedOptions(fixture());
    expect(result.status).toBe("READY");
    expect(result.chainContracts).toBe(52);
    expect(result.surface).toHaveLength(2);
    expect(result.surface[0].points).toBeGreaterThanOrEqual(10);
    expect(result.rnd.points.length).toBeGreaterThan(5);
    expect(result.volumePutCallRatio).toBeCloseTo(0.8, 2);
    expect(result.openInterestPutCallRatio).toBeCloseTo(0.9, 2);
    expect(result.jumpModel.calibrated).toBe(true);
    expect(result.momentum.score).toBeGreaterThan(0);
    expect(result.qualityGates).toEqual([]);
  });

  it("normalizes a provider payload into the canonical contract", () => {
    const result = normalizeCanonicalMarketData({ data: { spot: 101, asOf: "2026-07-12T16:00:00Z", history: [{ date: "2026-07-11", close: 100 }], options: [{ contractSymbol: "X", expirationDate: "2026-08-01", strike: 100, type: "c", bid: 3, ask: 3.2, iv: 45 }] } }, "TEST", "vendor");
    expect(result?.provider).toBe("vendor");
    expect(result?.optionChain[0].right).toBe("CALL");
    expect(result?.optionChain[0].impliedVolatility).toBe(45);
  });

  it("produces beta-weighted Greeks and a 21-cell portfolio stress matrix", () => {
    const result = calculatePortfolioRisk([
      { ticker: "TEST", quantity: 2, underlyingPrice: 100, beta: 1.2, delta: 0.45, gamma: 0.03, vega: 0.12, theta: -0.08, marketValue: 1200 },
      { ticker: "HEDGE", quantity: -1, underlyingPrice: 90, beta: 0.8, delta: 0.35, gamma: 0.02, vega: 0.09, theta: -0.05, marketValue: -500 },
    ]);
    expect(result.scenarios).toHaveLength(21);
    expect(result.betaWeightedDelta).not.toBe(0);
    expect(result.worstStressLoss).toBeGreaterThan(0);
    expect(result.concentrationPercent).toBeGreaterThan(50);
  });

  it("upgrades the earnings decision engine to chain-calibrated 50k-path mode", () => {
    const data = fixture();
    const result = buildStrategyIntelligence(
      { ticker: "TEST", price: "99", ivRank: "75", cpr: "1.4", type: "Iron Condor", budgetOptions: [] },
      [{ ticker: "TEST", date: "2026-07-20", time: "AMC", importance: 5 }],
      { vix: "20", tenYearYield: "4.2%" },
      undefined,
      data
    );
    expect(result.dataQuality).toBe("live");
    expect(result.options.pricingModel).toBe("CHAIN_CALIBRATED_JUMP_MC");
    expect(result.options.simulationPaths).toBe(50_000);
    expect(result.options.advanced?.status).toBe("READY");
    expect(result.market.spot).toBe(100);
    expect(result.decision.legs.every(leg => data.optionChain.some(quote => quote.strike === leg.strike))).toBe(true);
  });

  it("normalizes ThetaData v3 nested EOD rows and labels free data as delayed", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-11T21:15:00.000Z"));
    process.env.THETADATA_REQUEST_GAP_MS = "0";
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL) => {
      const url = String(input);
      const payload = url.includes("stock/history/eod")
        ? { response: [{ created: "2026-07-10T17:15:00.000", open: 99, high: 102, low: 98, close: 100, volume: 1_000_000 }] }
        : { response: [
          { contract: { symbol: "TEST", expiration: "2026-07-17", strike: 100, right: "CALL" }, data: [{ created: "2026-07-10T17:21:00.000", bid: 3, ask: 3.2, close: 3.1, volume: 200 }] },
          { contract: { symbol: "TEST", expiration: "2026-07-17", strike: 100, right: "PUT" }, data: [{ created: "2026-07-10T17:21:00.000", bid: 2.8, ask: 3, close: 2.9, volume: 180 }] },
        ] };
      return new Response(JSON.stringify(payload), { status: 200, headers: { "Content-Type": "application/json" } });
    }));
    const result = await new ThetaDataProvider("http://127.0.0.1:25503/v3").load("TEST", "2026-07-20");
    expect(result?.provider).toBe("thetadata-free-eod");
    expect(result?.delayedMinutes).toBeGreaterThanOrEqual(1_440);
    expect(result?.asOf).toBe("2026-07-10T21:15:00Z");
    expect(result?.optionChain).toHaveLength(2);
    expect(result?.optionChain[0].right).toBe("CALL");
  });

  it("spends the ThetaData ticker budget on the nearest upcoming earnings", async () => {
    process.env.OPTIONS_DATA_PROVIDER = "thetadata";
    process.env.THETADATA_BASE_URL = "http://127.0.0.1:25503/v3";
    process.env.THETADATA_REQUEST_GAP_MS = "0";
    process.env.THETADATA_MAX_TICKERS = "2";
    const requested: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL) => {
      const url = new URL(String(input));
      requested.push(url.searchParams.get("symbol") || "");
      return new Response(JSON.stringify({ response: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
    }));
    const day = (offset: number) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);

    await loadEarningsMarketData([
      { ticker: "PAST", earningsDate: day(-2) },
      { ticker: "FAR", earningsDate: day(20) },
      { ticker: "NEXT", earningsDate: day(1) },
      { ticker: "SOON", earningsDate: day(3) },
    ]);

    expect(requested).toEqual(["NEXT", "SOON"]);
  });

  it("blocks delayed ThetaData free EOD analytics from actionable trade status", () => {
    const data = fixture();
    data.provider = "thetadata-free-eod";
    data.delayedMinutes = 1_440;
    data.optionChain = data.optionChain.map(quote => ({ ...quote, impliedVolatility: undefined, delta: undefined, gamma: undefined, theta: undefined, vega: undefined }));
    const result = buildStrategyIntelligence(
      { ticker: "TEST", price: "99", ivRank: "75", cpr: "1", type: "Iron Condor", budgetOptions: [] },
      [{ ticker: "TEST", date: "2026-07-20", time: "AMC", importance: 5 }],
      { vix: "20" },
      undefined,
      data
    );
    expect(result.dataQuality).toBe("eod");
    expect(result.decision.tradeStatus).toBe("BLOCKED");
    expect(result.options.advanced?.qualityGates).toContain("DELAYED_EOD_DATA");
    expect(result.alerts.some(alert => alert.title === "Gecikmeli EOD opsiyon verisi")).toBe(true);
  });
});
