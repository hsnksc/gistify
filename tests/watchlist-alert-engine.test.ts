import { describe, expect, it } from "vitest";
import type { BillingStore } from "../server/billingStore";
import { evaluateWatchlistAlerts } from "../server/watchlistAlertEngine";
import { processWatchlistEmailQueue } from "../server/watchlistDeliveryProcessor";
import type {
  WatchlistAlertStateRecord,
  WatchlistDeliveryRecord,
  WatchlistNotificationRecord,
  WatchlistRecord,
} from "../shared/opportunities";
import type {
  MidasActionSignal,
  MidasSignalsData,
} from "../shared/midasSignals";

function snapshot({
  timestamp,
  signal,
  confidence,
  price,
}: {
  timestamp: string;
  signal: MidasActionSignal;
  confidence: number;
  price: number;
}): MidasSignalsData {
  return {
    timestamp,
    symbol_count: 1,
    successful: 1,
    failed: 0,
    mode: "test",
    signals: [
      {
        symbol: "AAPL",
        signal,
        strength: confidence / 14,
        confidence,
        price,
        daily_pct: 0,
        weekly_pct: 0,
        monthly_pct: 0,
        signals: [],
        timestamp,
      },
    ],
  };
}

describe("watchlist alert engine", () => {
  it("keeps deliveries pending when no email gateway is configured", async () => {
    const previousUrl = process.env.WATCHLIST_ALERT_WEBHOOK_URL;
    delete process.env.WATCHLIST_ALERT_WEBHOOK_URL;
    try {
      const store = {
        listPendingWatchlistDeliveries: () => [
          {
            id: "delivery-1",
            notificationId: "notification-1",
            userId: "user-1",
            email: "user@example.com",
            channel: "email",
            status: "pending",
            attempts: 0,
            nextAttemptAt: "2026-07-16T09:00:00.000Z",
            createdAt: "2026-07-16T09:00:00.000Z",
            updatedAt: "2026-07-16T09:00:00.000Z",
          },
        ],
      } as unknown as BillingStore;
      const result = await processWatchlistEmailQueue(store, {
        now: new Date("2026-07-16T09:01:00.000Z"),
      });
      expect(result).toMatchObject({
        providerConfigured: false,
        attempted: 0,
        pendingWithoutProvider: 1,
      });
    } finally {
      if (previousUrl === undefined) delete process.env.WATCHLIST_ALERT_WEBHOOK_URL;
      else process.env.WATCHLIST_ALERT_WEBHOOK_URL = previousUrl;
    }
  });

  it("emits only on state transitions and re-arms after a condition clears", () => {
    const record: WatchlistRecord = {
      id: "watch-1",
      userId: "user-1",
      email: "user@example.com",
      ticker: "AAPL",
      alertOnOpportunity: false,
      alertRules: {
        opportunity: false,
        signalChange: true,
        convictionAbove: 70,
        priceBelow: 90,
      },
      addedAt: "2026-07-16T08:00:00.000Z",
      updatedAt: "2026-07-16T08:00:00.000Z",
    };
    const states = new Map<string, WatchlistAlertStateRecord>();
    const notifications: WatchlistNotificationRecord[] = [];
    const deliveries: WatchlistDeliveryRecord[] = [];
    const store = {
      getWatchlistAlertState: (itemId: string, ruleKind: string) =>
        states.get(`${itemId}:${ruleKind}`) || null,
      insertWatchlistDelivery: (delivery: WatchlistDeliveryRecord) => {
        deliveries.push(delivery);
      },
      insertWatchlistNotification: (
        notification: WatchlistNotificationRecord
      ) => {
        if (
          notifications.some(
            existing => existing.fingerprint === notification.fingerprint
          )
        ) {
          return false;
        }
        notifications.push(notification);
        return true;
      },
      listAllWatchlistItems: () => [],
      listAllWatchlists: () => [record],
      listOpportunities: () => [],
      upsertWatchlistAlertState: (state: WatchlistAlertStateRecord) => {
        states.set(`${state.itemId}:${state.ruleKind}`, state);
      },
    } as unknown as BillingStore;

    const first = snapshot({
      timestamp: "2026-07-16T09:00:00.000Z",
      signal: "HOLD",
      confidence: 65,
      price: 100,
    });
    const firstResult = evaluateWatchlistAlerts({
      billingStore: store,
      snapshot: first,
      now: new Date("2026-07-16T09:00:00.000Z"),
    });
    expect(firstResult.createdNotifications).toBe(0);

    const second = snapshot({
      timestamp: "2026-07-16T09:05:00.000Z",
      signal: "BUY",
      confidence: 75,
      price: 100,
    });
    const secondResult = evaluateWatchlistAlerts({
      billingStore: store,
      snapshot: second,
      previousSnapshot: first,
      now: new Date("2026-07-16T09:05:00.000Z"),
    });
    expect(secondResult.createdNotifications).toBe(2);
    expect(notifications.map(item => item.kind).sort()).toEqual([
      "conviction",
      "signal_change",
    ]);

    const repeatResult = evaluateWatchlistAlerts({
      billingStore: store,
      snapshot: {
        ...second,
        timestamp: "2026-07-16T09:10:00.000Z",
      },
      previousSnapshot: second,
      now: new Date("2026-07-16T09:10:00.000Z"),
    });
    expect(repeatResult.createdNotifications).toBe(0);

    const third = snapshot({
      timestamp: "2026-07-16T09:15:00.000Z",
      signal: "BUY",
      confidence: 60,
      price: 85,
    });
    const thirdResult = evaluateWatchlistAlerts({
      billingStore: store,
      snapshot: third,
      previousSnapshot: second,
      now: new Date("2026-07-16T09:15:00.000Z"),
    });
    expect(thirdResult.createdNotifications).toBe(1);
    expect(notifications.at(-1)?.kind).toBe("price_below");

    const fourth = snapshot({
      timestamp: "2026-07-16T09:20:00.000Z",
      signal: "BUY",
      confidence: 80,
      price: 85,
    });
    const fourthResult = evaluateWatchlistAlerts({
      billingStore: store,
      snapshot: fourth,
      previousSnapshot: third,
      now: new Date("2026-07-16T09:20:00.000Z"),
    });
    expect(fourthResult.createdNotifications).toBe(1);
    expect(notifications.at(-1)?.kind).toBe("conviction");
    expect(deliveries).toHaveLength(4);
  });
});
