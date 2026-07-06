import type { DatabaseSync } from "node:sqlite";
import type { MacroForecastWorkspaceData } from "../../shared/cpiPpiForecast";
import { getGistifyDb } from "../db";

export type MacroIndicator = "cpi" | "ppi";

export interface MacroArchiveRecord {
  id: number;
  indicator: MacroIndicator;
  month: string;
  payload: MacroForecastWorkspaceData;
  source: string | null;
  createdAt: number;
}

export interface MacroComparisonResult {
  current: MacroArchiveRecord | null;
  previous: MacroArchiveRecord | null;
}

interface MacroArchiveRow {
  id: number;
  indicator: string;
  month: string;
  payload: string;
  source: string | null;
  created_at: number;
}

function nowMs() {
  return Date.now();
}

function parseMonth(month: string): { year: number; month: number } {
  const [yearStr, monthStr] = month.split("-");
  return {
    year: Number(yearStr),
    month: Number(monthStr),
  };
}

function formatMonth(year: number, month: number): string {
  const normalizedMonth = Math.max(1, Math.min(12, month));
  return `${year}-${String(normalizedMonth).padStart(2, "0")}`;
}

function previousMonth(month: string): string {
  const { year, month: monthNumber } = parseMonth(month);
  if (monthNumber === 1) {
    return formatMonth(year - 1, 12);
  }
  return formatMonth(year, monthNumber - 1);
}

function mapRow(row: MacroArchiveRow): MacroArchiveRecord {
  return {
    id: row.id,
    indicator: row.indicator as MacroIndicator,
    month: row.month,
    payload: JSON.parse(row.payload) as MacroForecastWorkspaceData,
    source: row.source,
    createdAt: row.created_at,
  };
}

export interface MacroArchiveStore {
  saveArchive: (
    indicator: MacroIndicator,
    month: string,
    payload: MacroForecastWorkspaceData,
    source?: string
  ) => MacroArchiveRecord;
  getArchive: (
    indicator: MacroIndicator,
    month: string
  ) => MacroArchiveRecord | null;
  getComparison: (
    indicator: MacroIndicator,
    month: string
  ) => MacroComparisonResult;
  listArchives: (
    indicator: MacroIndicator,
    limit?: number
  ) => MacroArchiveRecord[];
}

export function createMacroArchiveStore(): MacroArchiveStore {
  const { db } = getGistifyDb();

  const saveStmt = db.prepare(`
    INSERT INTO macro_archive (indicator, month, payload, source, created_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(indicator, month) DO UPDATE SET
      payload = excluded.payload,
      source = excluded.source,
      created_at = excluded.created_at
  `);

  const getStmt = db.prepare(`
    SELECT id, indicator, month, payload, source, created_at
    FROM macro_archive
    WHERE indicator = ? AND month = ?
  `);

  const listStmt = db.prepare(`
    SELECT id, indicator, month, payload, source, created_at
    FROM macro_archive
    WHERE indicator = ?
    ORDER BY month DESC
    LIMIT ?
  `);

  return {
    saveArchive(indicator, month, payload, source) {
      const payloadJson = JSON.stringify(payload);
      saveStmt.run(indicator, month, payloadJson, source ?? null, nowMs());
      const row = getStmt.get(indicator, month) as unknown as
        | MacroArchiveRow
        | undefined;
      if (!row) {
        throw new Error(
          `[macroArchive] Failed to persist archive for ${indicator}/${month}`
        );
      }
      return mapRow(row);
    },

    getArchive(indicator, month) {
      const row = getStmt.get(indicator, month) as unknown as
        | MacroArchiveRow
        | undefined;
      return row ? mapRow(row) : null;
    },

    getComparison(indicator, month) {
      return {
        current: this.getArchive(indicator, month),
        previous: this.getArchive(indicator, previousMonth(month)),
      };
    },

    listArchives(indicator, limit = 12) {
      const cappedLimit = Math.max(1, Math.min(120, limit));
      const rows = listStmt.all(
        indicator,
        cappedLimit
      ) as unknown as MacroArchiveRow[];
      return rows.map(mapRow);
    },
  };
}
