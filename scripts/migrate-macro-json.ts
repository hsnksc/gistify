/**
 * One-time idempotent import of existing CPI/PPI forecast JSON files
 * into the central gistify.sqlite macro_archive table.
 *
 * Run:
 *   npx tsx scripts/migrate-macro-json.ts
 *
 * Existing JSON files are left untouched; this script only seeds the DB.
 */

import fs from "node:fs";
import path from "node:path";
import { resolveArchiveMonth } from "../server/cpiPpiForecast";
import { createMacroArchiveStore } from "../server/services/macroArchiveStore";
import type {
  MacroForecastWorkspaceData,
  MacroForecastWorkspaceKey,
} from "../shared/cpiPpiForecast";

const CANDIDATES = [
  "data/cpi_forecast_july_2026.json",
  "data/ppi_forecast_july_2026.json",
  "client/public/cpi_forecast_june_2026.json",
  "client/public/ppi_forecast_june_2026.json",
  "client/public/cpi_forecast.json",
  "client/public/ppi_forecast.json",
];

function detectIndicator(fileName: string): MacroForecastWorkspaceKey | null {
  const lower = fileName.toLowerCase();
  if (lower.includes("cpi")) return "cpi";
  if (lower.includes("ppi")) return "ppi";
  return null;
}

function resolveMonth(payload: MacroForecastWorkspaceData): string | null {
  // Key by the release period month (Jun 2026 -> 2026-06); a June forecast is
  // written in July, so reportDate would collide with the July forecast.
  try {
    return resolveArchiveMonth(payload);
  } catch {
    const raw = payload.reportDate || payload.generatedAt || "";
    const match = raw.match(/^\d{4}-\d{2}/);
    return match ? match[0] : null;
  }
}

function main() {
  const store = createMacroArchiveStore();
  let importedCount = 0;

  for (const candidate of CANDIDATES) {
    const fullPath = path.resolve(process.cwd(), candidate);
    if (!fs.existsSync(fullPath)) {
      console.log(`[migrate-macro] Skipping missing file: ${candidate}`);
      continue;
    }

    const indicator = detectIndicator(candidate);
    if (!indicator) {
      console.log(`[migrate-macro] Skipping unknown indicator: ${candidate}`);
      continue;
    }

    const raw = fs.readFileSync(fullPath, "utf8");
    let payload: MacroForecastWorkspaceData;
    try {
      payload = JSON.parse(raw) as MacroForecastWorkspaceData;
    } catch {
      console.error(`[migrate-macro] Invalid JSON: ${candidate}`);
      continue;
    }

    const month = resolveMonth(payload);
    if (!month) {
      console.log(`[migrate-macro] Skipping file with no month: ${candidate}`);
      continue;
    }

    store.saveArchive(indicator, month, payload, fullPath);
    console.log(`[migrate-macro] Imported ${indicator}/${month} from ${candidate}`);
    importedCount += 1;
  }

  console.log(`[migrate-macro] Imported ${importedCount} archive records.`);
}

main();
