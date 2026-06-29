import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { createOpportunitiesRouter } from "../../server/routes/opportunities";
import type { BillingStore } from "../../server/billingStore";
import type {
  OpportunityRecord,
  OpportunityTier,
  WatchlistRecord,
} from "../../shared/opportunities";

function createOpportunity(
  id: string,
  overrides: Partial<OpportunityRecord> = {}
): OpportunityRecord {
  return {
    id,
    ticker: id.toUpperCase(),
    name: `${id.toUpperCase()} Inc.`,
    sector: "Tech",
    earningsDate: "2026-07-01",
    earningsTime: "AMC",
    daysToEarnings: 2,
    opportunityWindow: "pre_earnings_3d",
    momentumScore: 82,
    priceChange6M: 18,
    rsi14: 58,
    currentIV: 65,
    historicalIV: 44,
    impliedMovePercent: 7,
    expectedIVCrush: 14,
    ivCrushScore: 88,
    beatRate: 74,
    maxLossPercent: 100,
    targetProfitPercent: 60,
    earningsMissRisk: 32,
    gapRisk: 48,
    compositeScore: 91,
    confidenceLevel: "high",
    directionalBias: "bullish",
    strategyType: "iv_crush",
    strategyRating: 5,
    recommendedStrategy: "Call spread",
    aiSummary: "High quality setup",
    aiStrategyRationale: "Strong implied move setup",
    aiKeyCatalysts: ["Earnings"],
    aiExecutionNotes: "Manage size carefully",
    riskWarnings: ["IV crush"],
    dataSources: ["weekly"],
    tierRequired: "free",
    status: "active",
    createdAt: "2026-06-28T08:00:00.000Z",
    updatedAt: "2026-06-28T08:00:00.000Z",
    expiresAt: "2026-07-02T08:00:00.000Z",
    ...overrides,
  };
}

describe("opportunities router smoke", () => {
  let server: ReturnType<express.Express["listen"]> | null = null;

  afterEach(async () => {
    if (!server) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      server?.close(error => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
    server = null;
  });

  it("serves opportunities and watchlist CRUD flows", async () => {
    const opportunities = [
      createOpportunity("aapl"),
      createOpportunity("msft", {
        id: "msft",
        ticker: "MSFT",
        compositeScore: 87,
      }),
    ];
    const watchlist: WatchlistRecord[] = [];

    const billingStore = {
      deleteWatchlist: (userId: string, ticker: string) => {
        const index = watchlist.findIndex(
          item => item.userId === userId && item.ticker === ticker
        );
        if (index >= 0) {
          watchlist.splice(index, 1);
        }
      },
      listOpportunities: () => opportunities,
      listWatchlistByUserId: (userId: string) =>
        watchlist.filter(item => item.userId === userId),
      upsertWatchlist: (record: WatchlistRecord) => {
        const existingIndex = watchlist.findIndex(
          item => item.userId === record.userId && item.ticker === record.ticker
        );
        if (existingIndex >= 0) {
          watchlist[existingIndex] = record;
          return;
        }

        watchlist.push(record);
      },
    } as unknown as BillingStore;

    const app = express();
    app.use(express.json());
    app.use(
      "/api",
      createOpportunitiesRouter({
        billingStore,
        filterOpportunitiesForTier: items => items,
        getRequestActor: req =>
          req.headers["x-user-id"] === "user-1"
            ? { id: "user-1", email: "user@example.com" }
            : null,
        normalizeNumber: (value, fallback = 0) => {
          const numeric =
            typeof value === "number"
              ? value
              : typeof value === "string"
                ? Number(value)
                : Number.NaN;
          return Number.isFinite(numeric) ? numeric : fallback;
        },
        normalizeString: value => (typeof value === "string" ? value.trim() : ""),
        resolveOpportunityTier: () => "free" satisfies OpportunityTier,
        setPrivateNoStore: res => {
          res.setHeader("Cache-Control", "private, no-store");
        },
      })
    );

    server = app.listen(0);
    await new Promise<void>(resolve => {
      server?.once("listening", () => resolve());
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected an ephemeral TCP port.");
    }

    const opportunitiesResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/opportunities?limit=1`
    );
    expect(opportunitiesResponse.status).toBe(200);
    expect(opportunitiesResponse.headers.get("cache-control")).toContain(
      "no-store"
    );
    const opportunitiesPayload = (await opportunitiesResponse.json()) as {
      data?: OpportunityRecord[];
      meta?: { total?: number };
    };
    expect(opportunitiesPayload.data).toHaveLength(1);
    expect(opportunitiesPayload.meta?.total).toBe(2);

    const relatedResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/opportunities/aapl/related`
    );
    expect(relatedResponse.status).toBe(200);
    const relatedPayload = (await relatedResponse.json()) as {
      data?: OpportunityRecord[];
    };
    expect(relatedPayload.data).toHaveLength(1);
    expect(relatedPayload.data?.[0]?.id).toBe("msft");

    const createWatchlistResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/watchlist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user-1",
        },
        body: JSON.stringify({
          ticker: " aapl ",
          notes: "watch closely",
        }),
      }
    );
    expect(createWatchlistResponse.status).toBe(201);
    const createWatchlistPayload = (await createWatchlistResponse.json()) as {
      items?: WatchlistRecord[];
    };
    expect(createWatchlistPayload.items).toHaveLength(1);
    expect(createWatchlistPayload.items?.[0]?.ticker).toBe("AAPL");

    const patchWatchlistResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/watchlist/AAPL`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user-1",
        },
        body: JSON.stringify({
          notes: "updated note",
          alertOnOpportunity: false,
        }),
      }
    );
    expect(patchWatchlistResponse.status).toBe(200);
    const patchWatchlistPayload = (await patchWatchlistResponse.json()) as {
      item?: WatchlistRecord;
    };
    expect(patchWatchlistPayload.item?.notes).toBe("updated note");
    expect(patchWatchlistPayload.item?.alertOnOpportunity).toBe(false);

    const deleteWatchlistResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/watchlist/AAPL`,
      {
        method: "DELETE",
        headers: {
          "x-user-id": "user-1",
        },
      }
    );
    expect(deleteWatchlistResponse.status).toBe(200);
    const deleteWatchlistPayload = (await deleteWatchlistResponse.json()) as {
      items?: WatchlistRecord[];
    };
    expect(deleteWatchlistPayload.items).toHaveLength(0);
  });
});
