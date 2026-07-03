import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export interface TranslationMemoryEntry {
  createdAt: string;
  provider: string;
  sourceHash: string;
  sourceLang: string;
  sourceText: string;
  targetLang: string;
  translatedText: string;
}

function getTranslationMemoryPath() {
  const configured = String(
    process.env.TRANSLATION_MEMORY_DB_PATH || ""
  ).trim();

  if (!configured) {
    return path.resolve(process.cwd(), "data", "translation-memory.sqlite");
  }

  if (path.isAbsolute(configured)) {
    return configured;
  }

  return path.resolve(process.cwd(), configured);
}

const dbPath = getTranslationMemoryPath();
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS translation_memory (
    source_hash TEXT NOT NULL,
    source_lang TEXT NOT NULL,
    target_lang TEXT NOT NULL,
    source_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    provider TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (source_hash, target_lang)
  );

  CREATE INDEX IF NOT EXISTS idx_translation_memory_target_lang
    ON translation_memory(target_lang, created_at DESC);
`);

const getTranslationMemoryStmt = db.prepare(`
  SELECT
    source_hash,
    source_lang,
    target_lang,
    source_text,
    translated_text,
    provider,
    created_at
  FROM translation_memory
  WHERE source_hash = ? AND target_lang = ?
  LIMIT 1
`);

const upsertTranslationMemoryStmt = db.prepare(`
  INSERT INTO translation_memory (
    source_hash,
    source_lang,
    target_lang,
    source_text,
    translated_text,
    provider,
    created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(source_hash, target_lang) DO UPDATE SET
    source_lang = excluded.source_lang,
    source_text = excluded.source_text,
    translated_text = excluded.translated_text,
    provider = excluded.provider,
    created_at = excluded.created_at
`);

interface TranslationMemoryRow {
  created_at: string;
  provider: string;
  source_hash: string;
  source_lang: string;
  source_text: string;
  target_lang: string;
  translated_text: string;
}

function mapTranslationMemoryRow(
  row: TranslationMemoryRow
): TranslationMemoryEntry {
  return {
    createdAt: row.created_at,
    provider: row.provider,
    sourceHash: row.source_hash,
    sourceLang: row.source_lang,
    sourceText: row.source_text,
    targetLang: row.target_lang,
    translatedText: row.translated_text,
  };
}

export function getTranslationMemoryEntry(
  sourceHash: string,
  targetLang: string
) {
  const row = getTranslationMemoryStmt.get(
    sourceHash,
    targetLang
  ) as TranslationMemoryRow | undefined;

  return row ? mapTranslationMemoryRow(row) : null;
}

export function upsertTranslationMemoryEntry(entry: TranslationMemoryEntry) {
  upsertTranslationMemoryStmt.run(
    entry.sourceHash,
    entry.sourceLang,
    entry.targetLang,
    entry.sourceText,
    entry.translatedText,
    entry.provider,
    entry.createdAt
  );
}
