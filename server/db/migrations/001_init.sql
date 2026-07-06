-- Gistify central SQLite schema v1
-- Timestamps are UTC epoch milliseconds (INTEGER).

CREATE TABLE IF NOT EXISTS flow_engagement (
  flow_id TEXT PRIMARY KEY NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  reads INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_flow_engagement_updated_at
  ON flow_engagement(updated_at DESC);

CREATE TABLE IF NOT EXISTS macro_archive (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  indicator TEXT NOT NULL,
  month TEXT NOT NULL,
  payload TEXT NOT NULL,
  source TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE(indicator, month)
);

CREATE INDEX IF NOT EXISTS idx_macro_archive_indicator_month
  ON macro_archive(indicator, month DESC);

CREATE TABLE IF NOT EXISTS cron_jobs (
  name TEXT PRIMARY KEY NOT NULL,
  schedule TEXT,
  enabled INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  last_run_at INTEGER,
  last_status TEXT CHECK(last_status IN ('running','success','failed','skipped','timeout')),
  updated_at INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_enabled
  ON cron_jobs(enabled);

CREATE TABLE IF NOT EXISTS cron_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_name TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  status TEXT NOT NULL CHECK(status IN ('running','success','failed','skipped','timeout')),
  attempt INTEGER NOT NULL DEFAULT 1,
  error TEXT,
  input_summary TEXT,
  output_summary TEXT,
  duration_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_cron_runs_job_started
  ON cron_runs(job_name, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_cron_runs_status_started
  ON cron_runs(status, started_at DESC);

CREATE TABLE IF NOT EXISTS job_locks (
  name TEXT PRIMARY KEY NOT NULL,
  owner TEXT NOT NULL,
  acquired_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  heartbeat_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_job_locks_expires_at
  ON job_locks(expires_at);

CREATE TABLE IF NOT EXISTS deploy_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  commit_sha TEXT,
  branch TEXT,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  status TEXT NOT NULL CHECK(status IN ('running','success','failed','rolled_back')),
  notes TEXT,
  rollback_of INTEGER,
  triggered_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_deploy_history_started_at
  ON deploy_history(started_at DESC);

CREATE TABLE IF NOT EXISTS artifacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  path TEXT NOT NULL,
  run_id INTEGER,
  size_bytes INTEGER,
  checksum TEXT,
  metadata TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  UNIQUE(kind, path),
  FOREIGN KEY (run_id) REFERENCES cron_runs(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_artifacts_kind_created
  ON artifacts(kind, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_artifacts_run_id
  ON artifacts(run_id);
