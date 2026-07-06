/**
 * One-time idempotent import of existing Midas signal JSON files
 * into the central gistify.sqlite signal_snapshots table.
 *
 * Run:
 *   npx tsx scripts/migrate-signals-json.ts
 *
 * Existing JSON files are left untouched; this script only seeds the DB.
 */

import fs from "node:fs";
import path from "node:path";
import { createSignalSnapshotStore } from "../server/services/signalSnapshotStore";
import type { MidasSignalsData } from "../shared/midasSignals";

const CANDIDATES = [
  process.env.MIDAS_PIPELINE_SOURCE_FILE,
  "data/midas_signals.json",
  "midas_signals.json",
  "client/public/midas_signals.json",
  "client/public/midas_backtest.json",
].filter(Boolean) as string[];

function main() {
  const store = createSignalSnapshotStore();
  let importedCount = 0;

  for (const candidate of CANDIDATES) {
    const fullPath = path.resolve(process.cwd(), candidate);
    if (!fs.existsSync(fullPath)) {
      console.log(`[migrate-signals] Skipping missing file: ${candidate}`);
      continue;
    }

    const raw = fs.readFileSync(fullPath, "utf8");
    let payload: MidasSignalsData;
    try {
      payload = JSON.parse(raw) as MidasSignalsData;
    } catch {
      console.error(`[migrate-signals] Invalid JSON: ${candidate}`);
      continue;
    }

    if (!payload.signals || !Array.isArray(payload.signals)) {
      console.log(`[migrate-signals] Skipping file with no signals: ${candidate}`);
      continue;
    }

    store.saveSnapshot("midas", payload, fullPath);
    console.log(
      `[migrate-signals] Imported ${payload.signals.length} signals from ${candidate}`
    );
    importedCount += 1;
  }

  console.log(`[migrate-signals] Imported ${importedCount} snapshot source(s).`);
}

main();
