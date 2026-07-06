#!/usr/bin/env node
/**
 * Verification script for the central SQLite persistence layer.
 *
 * Usage:
 *   GISTIFY_DB_PATH=/tmp/gistify-verify.sqlite npx tsx scripts/verify-persistence.mts
 *
 * Tests:
 *   1. Fresh DB is created and migrations are idempotent.
 *   2. Flow engagement counters increment correctly.
 *   3. Macro archive save/get/comparison works.
 *   4. Job lock prevents overlapping runs (second run is skipped).
 */

import fs from "node:fs";
import path from "node:path";
import { createGistifyDb, closeGistifyDb } from "../server/db";
import { runMigrations, getAppliedMigrations } from "../server/db/migrations";
import { createFlowEngagementStore } from "../server/services/flowEngagementStore";
import { createMacroArchiveStore } from "../server/services/macroArchiveStore";
import { createSignalSnapshotStore } from "../server/services/signalSnapshotStore";
import {
  createJobCoordinator,
  JobSkippedError,
} from "../server/services/jobCoordinator";

const dbPath =
  process.env.GISTIFY_DB_PATH || path.resolve(process.cwd(), "data", "gistify-verify.sqlite");

process.env.GISTIFY_DB_PATH = dbPath;

function cleanup() {
  try {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    if (fs.existsSync(`${dbPath}-wal`)) {
      fs.unlinkSync(`${dbPath}-wal`);
    }
    if (fs.existsSync(`${dbPath}-shm`)) {
      fs.unlinkSync(`${dbPath}-shm`);
    }
  } catch {
    // ignore cleanup errors
  }
}

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  cleanup();

  console.log(`[verify] Using test DB: ${dbPath}`);

  // Test 1: fresh DB + idempotent migrations
  console.log("[verify] Test 1: fresh DB + idempotent migrations");
  const { db } = createGistifyDb();
  const firstMigrations = getAppliedMigrations(db);
  assert(firstMigrations.length > 0, "migrations should be applied on fresh DB");

  runMigrations(db); // second run should be no-op
  const secondMigrations = getAppliedMigrations(db);
  assert(
    JSON.stringify(firstMigrations) === JSON.stringify(secondMigrations),
    "migration list should be stable after second run"
  );
  console.log("[verify]   OK");

  // Test 2: flow engagement counters
  console.log("[verify] Test 2: flow engagement counters");
  const flowStore = createFlowEngagementStore();
  const flowId = "flow-test-123";

  flowStore.recordView(flowId);
  flowStore.recordView(flowId);
  flowStore.recordLike(flowId, true);
  flowStore.recordShare(flowId);
  flowStore.recordShare(flowId);

  const engagement = flowStore.getEngagementByFlowId(flowId);
  assert(engagement.readCount === 2, `expected 2 reads, got ${engagement.readCount}`);
  assert(engagement.likeCount === 1, `expected 1 like, got ${engagement.likeCount}`);
  assert(engagement.shareCount === 2, `expected 2 shares, got ${engagement.shareCount}`);

  flowStore.recordLike(flowId, false);
  const engagementAfterUnlike = flowStore.getEngagementByFlowId(flowId);
  assert(
    engagementAfterUnlike.likeCount === 0,
    `expected 0 likes after unlike, got ${engagementAfterUnlike.likeCount}`
  );
  console.log("[verify]   OK");

  // Test 3: macro archive
  console.log("[verify] Test 3: macro archive");
  const macroStore = createMacroArchiveStore();
  const basePayload = {
    key: "cpi" as const,
    generatedAt: new Date().toISOString(),
    reportDate: "2026-07-06",
    title: "CPI Forecast",
    summary: "",
    baseCase: "",
    conviction: 0,
    release: {
      name: "CPI" as const,
      period: "July 2026",
      releaseDate: "2026-07-15",
      releaseTimeEt: "08:30",
      headlineMoM: "0.2%",
      headlineYoY: "3.1%",
      coreMoM: "0.2%",
      coreYoY: "3.4%",
      bias: "INLINE" as const,
      confidence: 70,
      thesis: "",
    },
    scenarios: [],
    setups: [],
    watchItems: [],
    keyDrivers: [],
    risks: [],
  };

  macroStore.saveArchive("cpi", "2026-07", basePayload, "verify-test");
  const archived = macroStore.getArchive("cpi", "2026-07");
  assert(archived !== null, "archive should exist");
  assert(archived?.indicator === "cpi", "indicator should be cpi");
  assert(archived?.month === "2026-07", "month should be 2026-07");

  const comparison = macroStore.getComparison("cpi", "2026-07");
  assert(comparison.current !== null, "current comparison should exist");
  assert(comparison.previous === null, "previous comparison should be null for first month");
  console.log("[verify]   OK");

  // Test 4: job lock prevents overlapping runs
  console.log("[verify] Test 4: job lock prevents overlapping runs");
  const coordinator = createJobCoordinator();

  const firstRun = coordinator.runJob(
    "verify-lock",
    async () => {
      await sleep(1000);
      return "done";
    },
    { leaseMs: 5000, timeoutMs: 10000 }
  );

  await sleep(50); // ensure the first run acquires the lock

  let skipped = false;
  try {
    await coordinator.runJob(
      "verify-lock",
      async () => "should not run",
      { leaseMs: 5000, timeoutMs: 10000 }
    );
  } catch (error) {
    if (error instanceof JobSkippedError) {
      skipped = true;
    } else {
      throw error;
    }
  }

  await firstRun;
  assert(skipped, "second overlapping job should be skipped");

  const runs = coordinator.listRecentRuns({
    jobName: "verify-lock",
    limit: 10,
  });
  assert(
    runs.some(run => run.status === "success"),
    "there should be a successful run"
  );
  assert(
    runs.some(run => run.status === "skipped"),
    "there should be a skipped run"
  );
  console.log("[verify]   OK");

  // Test 5: signal snapshots
  console.log("[verify] Test 5: signal snapshots");
  const signalStore = createSignalSnapshotStore();
  const signalPayload = {
    timestamp: new Date().toISOString(),
    symbol_count: 3,
    successful: 3,
    failed: 0,
    mode: "default",
    signals: [
      { symbol: "AAPL", signal: "BUY", strength: 0.8, price: 100 },
      { symbol: "TSLA", signal: "HOLD", strength: 0.5, price: 200 },
      { symbol: "NVDA", signal: "STRONG_BUY", strength: 0.95, price: 300 },
    ],
  };

  signalStore.saveSnapshot("midas", signalPayload, "verify-test");
  const latest = signalStore.getLatestSnapshot<typeof signalPayload>("midas");
  assert(latest !== null, "latest signal snapshot should exist");
  assert(
    latest?.payload.symbol_count === 3,
    `expected symbol_count 3, got ${latest?.payload.symbol_count}`
  );
  assert(
    latest?.payload.signals.length === 3,
    `expected 3 signals, got ${latest?.payload.signals.length}`
  );

  signalStore.saveSnapshot("midas", { ...signalPayload, symbol_count: 5 }, "verify-test-2");
  const updated = signalStore.getLatestSnapshot<typeof signalPayload>("midas");
  assert(
    updated?.payload.symbol_count === 5,
    `expected updated symbol_count 5, got ${updated?.payload.symbol_count}`
  );
  console.log("[verify]   OK");

  console.log("[verify] All tests passed.");
}

runTests()
  .then(() => {
    closeGistifyDb();
    cleanup();
    process.exit(0);
  })
  .catch(error => {
    console.error("[verify] Tests failed:", error);
    closeGistifyDb();
    cleanup();
    process.exit(1);
  });
