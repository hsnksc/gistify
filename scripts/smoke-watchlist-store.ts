import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createBillingStore } from "../server/billingStore";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gistify-watchlist-"));
process.env.BILLING_DB_PATH = path.join(tempDir, "billing.sqlite");
const store = createBillingStore();
const now = "2026-07-16T10:00:00.000Z";

store.upsertWatchlist({
  id: "default-item",
  userId: "user-1",
  email: "user@example.com",
  ticker: "AAPL",
  alertOnOpportunity: true,
  alertRules: {
    opportunity: true,
    signalChange: true,
    convictionAbove: 72,
    priceBelow: 190,
  },
  tags: ["core"],
  addedAt: now,
  updatedAt: now,
});
const savedDefault = store.listWatchlistByUserId("user-1")[0];
assert.equal(savedDefault.alertRules?.convictionAbove, 72);
assert.deepEqual(savedDefault.tags, ["core"]);

store.insertWatchlistNotification({
  id: "notification-1",
  userId: "user-1",
  email: "user@example.com",
  listId: "default",
  ticker: "AAPL",
  kind: "conviction",
  title: "Threshold crossed",
  body: "AAPL crossed 72.",
  fingerprint: "default-item:conviction:72:snapshot-1",
  metadata: { threshold: 72 },
  createdAt: now,
});
assert.equal(store.countUnreadWatchlistNotifications("user-1"), 1);
assert.deepEqual(store.listWatchlistNotifications("user-1")[0]?.metadata, {
  threshold: 72,
});

store.insertWatchlistDelivery({
  id: "delivery-1",
  notificationId: "notification-1",
  userId: "user-1",
  email: "user@example.com",
  channel: "email",
  status: "pending",
  attempts: 0,
  nextAttemptAt: now,
  createdAt: now,
  updatedAt: now,
});
assert.equal(store.listPendingWatchlistDeliveries(now).length, 1);

store.markAllWatchlistNotificationsRead("user-1", now);
assert.equal(store.countUnreadWatchlistNotifications("user-1"), 0);

store.upsertSavedPortfolioScenario({
  id: "portfolio-1",
  userId: "user-1",
  name: "Core basket",
  listId: "default",
  weighting: "risk_parity",
  transactionCostBps: 10,
  tickers: ["AAPL"],
  createdAt: now,
  updatedAt: now,
});
assert.equal(store.listSavedPortfolioScenarios("user-1")[0]?.name, "Core basket");

store.upsertWatchtowerReport({
  id: "watchtower-2026-07-16-tr",
  reportDate: "2026-07-16",
  language: "tr",
  title: "Watchtower · 2026-07-16",
  status: "draft",
  authorEmail: "editor@gistify.pro",
  createdAt: now,
  updatedAt: now,
  content: {
    summary: "Kaynak izli editör taslağı.",
    marketSentiment: "NEUTRAL",
    leaders: [],
    risks: [],
    watch: [],
    methodology: "Midas snapshot",
    sourceTimestamp: now,
    sourceVersion: "4.0",
    universeCount: 0,
  },
});
assert.equal(
  store.getWatchtowerReportByDateAndLanguage("2026-07-16", "tr")?.status,
  "draft"
);
console.log("Watchlist SQLite smoke passed.");
