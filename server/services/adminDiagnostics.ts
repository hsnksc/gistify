import fs from "node:fs";
import type { DatabaseSync } from "node:sqlite";
import { getGistifyDb, resolveDatabasePath } from "../db";
import { getAppliedMigrations } from "../db/migrations";

interface JournalModeRow {
  journal_mode: string;
}

export interface AdminDiagnostics {
  uptimeMs: number;
  gistifyDb: {
    path: string;
    sizeBytes: number | null;
    journalMode: string;
    migrations: string[];
    isFreshDatabase: boolean;
  };
}

function getJournalMode(db: DatabaseSync): string {
  const row = db.prepare("PRAGMA journal_mode").get() as unknown as
    | JournalModeRow
    | undefined;
  return row?.journal_mode ?? "unknown";
}

function getFileSizeBytes(filePath: string): number | null {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return null;
  }
}

export function getAdminDiagnostics(): AdminDiagnostics {
  const startTime = (globalThis as unknown as { gistifyStartTime?: number })
    .gistifyStartTime;
  const uptimeMs = startTime ? Date.now() - startTime : 0;

  const dbPath = resolveDatabasePath();
  const isFreshDatabase = !fs.existsSync(dbPath);

  const { db } = getGistifyDb();
  const sizeBytes = getFileSizeBytes(dbPath);
  const journalMode = getJournalMode(db);
  const migrations = getAppliedMigrations(db);

  return {
    uptimeMs,
    gistifyDb: {
      path: dbPath,
      sizeBytes,
      journalMode,
      migrations,
      isFreshDatabase,
    },
  };
}
