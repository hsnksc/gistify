import fs from "node:fs";
import path from "node:path";
import type { DatabaseSync } from "node:sqlite";

interface MigrationRow {
  name: string;
}

function ensureMigrationsTable(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at INTEGER NOT NULL
    );
  `);
}

function getMigrationsDir(): string {
  if (process.env.GISTIFY_MIGRATIONS_DIR) {
    return path.resolve(process.env.GISTIFY_MIGRATIONS_DIR);
  }

  // When bundled with esbuild, import.meta.dirname points to /app/dist,
  // but migrations live at /app/server/db/migrations in the runtime image.
  const bundledDir = path.resolve(import.meta.dirname, "migrations");
  if (fs.existsSync(bundledDir)) {
    return bundledDir;
  }

  return path.resolve(process.cwd(), "server", "db", "migrations");
}

function listMigrationFiles(): string[] {
  const migrationsDir = getMigrationsDir();
  if (!fs.existsSync(migrationsDir)) {
    console.warn(`[gistify-db] Migrations directory not found: ${migrationsDir}`);
    return [];
  }

  return fs
    .readdirSync(migrationsDir)
    .filter(fileName => fileName.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function isMigrationApplied(db: DatabaseSync, name: string): boolean {
  const stmt = db.prepare("SELECT name FROM schema_migrations WHERE name = ?");
  const row = stmt.get(name) as unknown as MigrationRow | undefined;
  return Boolean(row);
}

function recordMigration(db: DatabaseSync, name: string) {
  const stmt = db.prepare(
    "INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)"
  );
  stmt.run(name, Date.now());
}

export function runMigrations(db: DatabaseSync) {
  ensureMigrationsTable(db);

  const files = listMigrationFiles();
  if (!files.length) {
    return;
  }

  for (const file of files) {
    if (isMigrationApplied(db, file)) {
      continue;
    }

    const filePath = path.resolve(getMigrationsDir(), file);
    const sql = fs.readFileSync(filePath, "utf8");

    db.exec(sql);
    recordMigration(db, file);

    console.log(`[gistify-db] Applied migration: ${file}`);
  }
}

export function getAppliedMigrations(db: DatabaseSync): string[] {
  ensureMigrationsTable(db);
  const stmt = db.prepare("SELECT name FROM schema_migrations ORDER BY id ASC");
  const rows = stmt.all() as unknown as MigrationRow[];
  return rows.map(row => row.name);
}
