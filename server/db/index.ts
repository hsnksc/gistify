import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { runMigrations } from "./migrations";
import { logDbDiagnostics } from "./diagnostics";

let dbInstance: DatabaseSync | null = null;
let dbPathInstance: string | null = null;

function getDefaultDatabasePath() {
  if (process.env.NODE_ENV === "production") {
    return "/app/data/gistify.sqlite";
  }
  return path.resolve(process.cwd(), "data", "gistify.sqlite");
}

export function resolveDatabasePath() {
  const configured = process.env.GISTIFY_DB_PATH?.trim();
  if (!configured) {
    return getDefaultDatabasePath();
  }
  if (path.isAbsolute(configured)) {
    return configured;
  }
  return path.resolve(process.cwd(), configured);
}

function ensureDatabaseDirectory(dbPath: string) {
  const dir = path.dirname(dbPath);

  if (process.env.NODE_ENV === "production" && !fs.existsSync(dir)) {
    throw new Error(
      `[gistify-db] Database directory does not exist in production: ${dir}. ` +
        "Make sure the persistent volume is mounted (e.g., /srv/gistify/data:/app/data)."
    );
  }

  fs.mkdirSync(dir, { recursive: true });
}

export interface GistifyDb {
  db: DatabaseSync;
  dbPath: string;
  close: () => void;
}

export function createGistifyDb(): GistifyDb {
  if (dbInstance) {
    return { db: dbInstance, dbPath: dbPathInstance!, close: closeGistifyDb };
  }

  const dbPath = resolveDatabasePath();
  ensureDatabaseDirectory(dbPath);

  const isFreshDatabase = !fs.existsSync(dbPath);

  const db = new DatabaseSync(dbPath);
  dbInstance = db;
  dbPathInstance = dbPath;

  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    PRAGMA foreign_keys = ON;
    PRAGMA synchronous = NORMAL;
  `);

  runMigrations(db);
  logDbDiagnostics({ db, dbPath, isFreshDatabase });

  return {
    db,
    dbPath,
    close: closeGistifyDb,
  };
}

export function getGistifyDb(): GistifyDb {
  if (!dbInstance || !dbPathInstance) {
    return createGistifyDb();
  }
  return { db: dbInstance, dbPath: dbPathInstance, close: closeGistifyDb };
}

export function closeGistifyDb() {
  if (dbInstance) {
    try {
      dbInstance.exec("PRAGMA optimize;");
      dbInstance.close();
      console.log("[gistify-db] Database connection closed.");
    } catch (error) {
      console.error("[gistify-db] Error closing database:", error);
    } finally {
      dbInstance = null;
      dbPathInstance = null;
    }
  }
}
