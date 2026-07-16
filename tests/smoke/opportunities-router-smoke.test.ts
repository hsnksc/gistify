import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { createOpportunitiesRouter } from "../../server/routes/opportunities";
import type { BillingStore } from "../../server/billingStore";
import type {
  OpportunityRecord,
  OpportunityTier,
  SavedPortfolioScenarioRecord,
  WatchlistCollectionRecord,
  WatchlistItemRecord,
  WatchlistNotificationRecord,
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
    const watchlistCollections: WatchlistCollectionRecord[] = [];
    const watchlistItems: WatchlistItemRecord[] = [];
    const notifications: WatchlistNotificationRecord[] = [
      {
        id: "notification-1",
        userId: "user-1",
        email: "user@example.com",
        listId: "default",
        ticker: "AAPL",
        kind: "signal_change",
        title: "AAPL sinyali degisti",
        body: "HOLD -> BUY",
        fingerprint: "signal-change-1",
        metadata: { signal: "BUY" },
        createdAt: "2026-07-16T10:00:00.000Z",
      },
    ];
    const portfolios: SavedPortfolioScenarioRecord[] = [];

    const billingStore = {
      deleteWatchlistCollection: (userId: string, listId: string) => {
        const index = watchlistCollections.findIndex(
          item => item.userId === userId && item.id === listId
        );
        if (index >= 0) watchlistCollections.splice(index, 1);
        for (let itemIndex = watchlistItems.length - 1; itemIndex >= 0; itemIndex -= 1) {
          if (watchlistItems[itemIndex].listId === listId) {
            watchlistItems.splice(itemIndex, 1);
          }
        }
      },
      deleteWatchlistItem: (userId: string, listId: string, ticker: string) => {
        const index = watchlistItems.findIndex(
          item =>
            item.userId === userId &&
            item.listId === listId &&
            item.ticker === ticker
        );
        if (index >= 0) watchlistItems.splice(index, 1);
      },
      deleteSavedPortfolioScenario: (userId: string, scenarioId: string) => {
        const index = portfolios.findIndex(
          item => item.userId === userId && item.id === scenarioId
        );
        if (index >= 0) portfolios.splice(index, 1);
      },
      deleteWatchlist: (userId: string, ticker: string) => {
        const index = watchlist.findIndex(
          item => item.userId === userId && item.ticker === ticker
        );
        if (index >= 0) {
          watchlist.splice(index, 1);
        }
      },
      getWatchlistCollectionById: (userId: string, listId: string) =>
        watchlistCollections.find(
          item => item.userId === userId && item.id === listId
        ) || null,
      insertWatchlistCollection: (record: WatchlistCollectionRecord) => {
        watchlistCollections.push(record);
      },
      countUnreadWatchlistNotifications: (userId: string) =>
        notifications.filter(item => item.userId === userId && !item.readAt)
          .length,
      listOpportunities: () => opportunities,
      listSavedPortfolioScenarios: (userId: string) =>
        portfolios.filter(item => item.userId === userId),
      listWatchlistCollectionsByUserId: (userId: string) =>
        watchlistCollections.filter(item => item.userId === userId),
      listWatchlistItems: (userId: string, listId: string) =>
        watchlistItems.filter(
          item => item.userId === userId && item.listId === listId
        ),
      listWatchlistNotifications: (userId: string, limit: number) =>
        notifications.filter(item => item.userId === userId).slice(0, limit),
      listWatchlistByUserId: (userId: string) =>
        watchlist.filter(item => item.userId === userId),
      markAllWatchlistNotificationsRead: (userId: string, readAt: string) => {
        notifications.forEach(item => {
          if (item.userId === userId) item.readAt ||= readAt;
        });
      },
      markWatchlistNotificationRead: (
        userId: string,
        notificationId: string,
        readAt: string
      ) => {
        const notification = notifications.find(
          item => item.userId === userId && item.id === notificationId
        );
        if (notification) notification.readAt ||= readAt;
      },
      updateWatchlistCollection: (record: WatchlistCollectionRecord) => {
        const index = watchlistCollections.findIndex(
          item => item.userId === record.userId && item.id === record.id
        );
        if (index >= 0) watchlistCollections[index] = record;
      },
      upsertSavedPortfolioScenario: (record: SavedPortfolioScenarioRecord) => {
        portfolios.push(record);
      },
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
      upsertWatchlistItem: (record: WatchlistItemRecord) => {
        const index = watchlistItems.findIndex(
          item =>
            item.userId === record.userId &&
            item.listId === record.listId &&
            item.ticker === record.ticker
        );
        if (index >= 0) {
          watchlistItems[index] = record;
          return;
        }
        watchlistItems.push(record);
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

    const createListResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/watchlists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user-1",
        },
        body: JSON.stringify({ name: "Earnings", color: "#38bdf8" }),
      }
    );
    expect(createListResponse.status).toBe(201);
    const createListPayload = (await createListResponse.json()) as {
      list?: { id: string };
    };
    const customListId = createListPayload.list?.id;
    expect(customListId).toBeTruthy();

    const createItemResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/watchlists/${customListId}/items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user-1",
        },
        body: JSON.stringify({
          ticker: "msft",
          tags: ["mega-cap", "earnings"],
          alertRules: {
            opportunity: true,
            signalChange: true,
            convictionAbove: 72,
            priceBelow: 410,
            earningsWithinDays: 5,
          },
        }),
      }
    );
    expect(createItemResponse.status).toBe(201);
    const createItemPayload = (await createItemResponse.json()) as {
      lists?: Array<{
        id: string;
        items: WatchlistItemRecord[];
      }>;
    };
    const customList = createItemPayload.lists?.find(
      item => item.id === customListId
    );
    expect(customList?.items[0]?.ticker).toBe("MSFT");
    expect(customList?.items[0]?.tags).toEqual(["mega-cap", "earnings"]);
    expect(customList?.items[0]?.alertRules.convictionAbove).toBe(72);

    const patchItemResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/watchlists/${customListId}/items/MSFT`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user-1",
        },
        body: JSON.stringify({
          alertRules: { signalChange: false, priceAbove: 500 },
        }),
      }
    );
    expect(patchItemResponse.status).toBe(200);
    const patchItemPayload = (await patchItemResponse.json()) as {
      lists?: Array<{ id: string; items: WatchlistItemRecord[] }>;
    };
    const patchedItem = patchItemPayload.lists
      ?.find(item => item.id === customListId)
      ?.items.find(item => item.ticker === "MSFT");
    expect(patchedItem?.alertRules.signalChange).toBe(false);
    expect(patchedItem?.alertRules.priceAbove).toBe(500);
    expect(patchedItem?.alertRules.convictionAbove).toBe(72);

    const clearThresholdResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/watchlists/${customListId}/items/MSFT`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user-1",
        },
        body: JSON.stringify({
          alertRules: { convictionAbove: null },
        }),
      }
    );
    const clearThresholdPayload = (await clearThresholdResponse.json()) as {
      lists?: Array<{ id: string; items: WatchlistItemRecord[] }>;
    };
    expect(
      clearThresholdPayload.lists
        ?.find(item => item.id === customListId)
        ?.items.find(item => item.ticker === "MSFT")?.alertRules.convictionAbove
    ).toBeUndefined();

    const notificationsResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/notifications`,
      { headers: { "x-user-id": "user-1" } }
    );
    expect(notificationsResponse.status).toBe(200);
    const notificationsPayload = (await notificationsResponse.json()) as {
      items?: WatchlistNotificationRecord[];
      unreadCount?: number;
    };
    expect(notificationsPayload.items).toHaveLength(1);
    expect(notificationsPayload.unreadCount).toBe(1);

    const readNotificationResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/notifications/notification-1/read`,
      {
        method: "PATCH",
        headers: { "x-user-id": "user-1" },
      }
    );
    expect(readNotificationResponse.status).toBe(200);
    const readNotificationPayload = (await readNotificationResponse.json()) as {
      unreadCount?: number;
    };
    expect(readNotificationPayload.unreadCount).toBe(0);

    const savePortfolioResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/portfolios`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user-1",
        },
        body: JSON.stringify({
          name: "Momentum basket",
          listId: customListId,
          weighting: "risk_parity",
          transactionCostBps: 12,
          tickers: ["AAPL", "MSFT"],
        }),
      }
    );
    expect(savePortfolioResponse.status).toBe(201);
    const savePortfolioPayload = (await savePortfolioResponse.json()) as {
      item?: SavedPortfolioScenarioRecord;
    };
    expect(savePortfolioPayload.item?.weighting).toBe("risk_parity");
    expect(savePortfolioPayload.item?.tickers).toEqual(["AAPL", "MSFT"]);

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
