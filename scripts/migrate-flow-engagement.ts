/**
 * One-time idempotent migration of aggregate flow engagement counters
 * from the legacy billing.sqlite (flow_report_engagements) table
 * into the new central gistify.sqlite (flow_engagement) table.
 *
 * Run:
 *   npx tsx scripts/migrate-flow-engagement.ts
 *
 * Idempotency: re-running adds any missing counters; existing counters
 * are summed so the operation is safe to repeat.
 */

import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { getGistifyDb } from "../server/db";

interface LegacyEngagementRow {
  report_id: string;
  reads: number;
  likes: number;
  shares: number;
}

function getBillingDbPath() {
  const configured = process.env.BILLING_DB_PATH?.trim();
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.resolve(process.cwd(), configured);
  }
  return path.resolve(process.cwd(), "data", "billing.sqlite");
}

function nowMs() {
  return Date.now();
}

function main() {
  const billingDbPath = getBillingDbPath();
  console.log(`[migrate-flow] Reading legacy counters from ${billingDbPath}`);

  const billingDb = new DatabaseSync(billingDbPath);
  const legacyRows = billingDb
    .prepare(
      `
        SELECT
          report_id,
          SUM(CASE WHEN read_count > 0 THEN 1 ELSE 0 END) AS reads,
          SUM(CASE WHEN liked = 1 THEN 1 ELSE 0 END) AS likes,
          SUM(share_count) AS shares
        FROM flow_report_engagements
        GROUP BY report_id
      `
    )
    .all() as unknown as LegacyEngagementRow[];

  billingDb.close();
  console.log(`[migrate-flow] Found ${legacyRows.length} legacy report counters.`);

  const { db } = getGistifyDb();
  const upsertStmt = db.prepare(`
    INSERT INTO flow_engagement (flow_id, likes, shares, reads, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(flow_id) DO UPDATE SET
      likes = flow_engagement.likes + excluded.likes,
      shares = flow_engagement.shares + excluded.shares,
      reads = flow_engagement.reads + excluded.reads,
      updated_at = excluded.updated_at
  `);

  for (const row of legacyRows) {
    upsertStmt.run(
      row.report_id,
      Number(row.likes || 0),
      Number(row.shares || 0),
      Number(row.reads || 0),
      nowMs()
    );
  }

  console.log(`[migrate-flow] Migrated ${legacyRows.length} counters into gistify.sqlite.`);
}

main();
