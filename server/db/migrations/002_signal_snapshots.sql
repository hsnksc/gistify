-- Signal snapshots table for cron-fed JSON feeds (midas, calendar, etc.)
-- Runtime truth becomes the DB; JSON files remain as read-only fallback/seed.

CREATE TABLE IF NOT EXISTS signal_snapshots (
  kind TEXT PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  source TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_signal_snapshots_created_at
  ON signal_snapshots(created_at DESC);
