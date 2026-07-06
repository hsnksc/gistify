import fs from "node:fs";
import type { DatabaseSync } from "node:sqlite";

interface JournalModeRow {
  journal_mode: string;
}

interface MigrationRow {
  name: string;
}

export interface DiagnosticsInput {
  db: DatabaseSync;
  dbPath: string;
  isFreshDatabase: boolean;
}

function getFileSizeBytes(filePath: string): number | null {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return null;
  }
}

function getJournalMode(db: DatabaseSync): string {
  const row = db.prepare("PRAGMA journal_mode").get() as unknown as JournalModeRow | undefined;
  return row?.journal_mode ?? "unknown";
}

function getLatestMigration(db: DatabaseSync): string | null {
  const row = db
    .prepare("SELECT name FROM schema_migrations ORDER BY id DESC LIMIT 1")
    .get() as unknown as MigrationRow | undefined;
  return row?.name ?? null;
}

export function logDbDiagnostics({ db, dbPath, isFreshDatabase }: DiagnosticsInput) {
  const sizeBytes = getFileSizeBytes(dbPath);
  const journalMode = getJournalMode(db);
  const latestMigration = getLatestMigration(db);

  console.log(`[gistify-db] path=${dbPath}`);
  console.log(`[gistify-db] size_bytes=${sizeBytes ?? "unknown"}`);
  console.log(`[gistify-db] journal_mode=${journalMode}`);
  console.log(`[gistify-db] latest_migration=${latestMigration ?? "none"}`);

  if (isFreshDatabase) {
    console.warn(
      "[gistify-db] WARNING: A new empty SQLite database was created. " +
        "If this is a production deploy, confirm that /app/data is mounted from a persistent host volume, " +
        "otherwise likes/shares/reads, macro archive, cron history and deploy history will reset on every redeploy."
    );
  }
}

export function getDbDiagnostics({ db, dbPath, isFreshDatabase }: DiagnosticsInput) {
  return {
    dbPath,
    sizeBytes: getFileSizeBytes(dbPath),
    journalMode: getJournalMode(db),
    latestMigration: getLatestMigration(db),
    isFreshDatabase,
  };
}
