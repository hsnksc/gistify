import { describe, expect, it } from "vitest";
import type { MidasSignalsData } from "../shared/midasSignals";
import { generateWatchtowerDraft } from "../server/watchtowerGenerator";

const snapshot: MidasSignalsData = {
  timestamp: "2026-07-16T09:00:00.000Z",
  symbol_count: 3,
  successful: 3,
  failed: 0,
  mode: "live",
  version: "4.0",
  summary: {
    strong_buy: 1,
    buy: 0,
    hold: 1,
    sell: 1,
    strong_sell: 0,
    avg_confidence: 70,
    market_sentiment: "POSITIVE",
  },
  signals: [
    { symbol: "LEAD", signal: "STRONG_BUY", strength: 90, confidence: 88, price: 120, daily_pct: 3, weekly_pct: 8, monthly_pct: 15, signals: ["breakout"] },
    { symbol: "RISK", signal: "SELL", strength: 70, confidence: 76, price: 40, daily_pct: -2, weekly_pct: -5, monthly_pct: -9, signals: ["breakdown"] },
    { symbol: "WAIT", signal: "HOLD", strength: 50, confidence: 61, price: 75, daily_pct: 0.2, weekly_pct: 1, monthly_pct: 3, signals: [] },
  ],
};

describe("Watchtower draft generator", () => {
  it("creates an editor-gated draft with source traceability", () => {
    const report = generateWatchtowerDraft(
      snapshot,
      "tr",
      "editor@gistify.pro",
      new Date("2026-07-16T10:00:00.000Z")
    );

    expect(report.status).toBe("draft");
    expect(report.publishedAt).toBeUndefined();
    expect(report.reviewerEmail).toBeUndefined();
    expect(report.content.sourceTimestamp).toBe(snapshot.timestamp);
    expect(report.content.sourceVersion).toBe("4.0");
    expect(report.content.universeCount).toBe(3);
    expect(report.content.leaders[0]?.symbol).toBe("LEAD");
    expect(report.content.risks[0]?.symbol).toBe("RISK");
    expect(report.content.watch[0]?.href).toBe("/coverage/WAIT");
  });

  it("uses only symbols present in the source snapshot", () => {
    const report = generateWatchtowerDraft(snapshot, "en", "editor@gistify.pro");
    const publishedSymbols = [
      ...report.content.leaders,
      ...report.content.risks,
      ...report.content.watch,
    ].map(item => item.symbol);
    expect(new Set(publishedSymbols)).toEqual(new Set(snapshot.signals.map(item => item.symbol)));
  });
});
