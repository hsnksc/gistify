import type { DatabaseSync } from "node:sqlite";
import { getGistifyDb } from "../db";

export type JobStatus = "running" | "success" | "failed" | "skipped" | "timeout";

export interface CronJobDefinition {
  name: string;
  schedule?: string;
  enabled?: boolean;
  description?: string;
}

export interface RunJobOptions {
  attempt?: number;
  leaseMs?: number;
  timeoutMs?: number;
  inputSummary?: unknown;
  heartbeatIntervalMs?: number;
}

export interface JobRunRecord {
  id: number;
  jobName: string;
  startedAt: number;
  completedAt: number | null;
  status: JobStatus;
  attempt: number;
  error: string | null;
  inputSummary: string | null;
  outputSummary: string | null;
  durationMs: number | null;
}

export class JobSkippedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JobSkippedError";
  }
}

class JobTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JobTimeoutError";
  }
}

const DEFAULT_LEASE_MS = 5 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000;
const MAX_SUMMARY_LENGTH = 8 * 1024;

function nowMs() {
  return Date.now();
}

function truncateSummary(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const raw =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);
  if (!raw) {
    return null;
  }

  return raw.length > MAX_SUMMARY_LENGTH
    ? `${raw.slice(0, MAX_SUMMARY_LENGTH)}\n... (truncated)`
    : raw;
}

function generateOwner() {
  return `${process.pid}-${nowMs()}-${Math.random().toString(36).slice(2, 10)}`;
}

function runWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new JobTimeoutError(`Job timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function createStatements(db: DatabaseSync) {
  const acquireLockStmt = db.prepare(`
    INSERT INTO job_locks (name, owner, acquired_at, expires_at, heartbeat_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
      owner = excluded.owner,
      acquired_at = excluded.acquired_at,
      expires_at = excluded.expires_at,
      heartbeat_at = excluded.heartbeat_at
    WHERE job_locks.expires_at < excluded.acquired_at
  `);

  const getLockStmt = db.prepare(`
    SELECT owner FROM job_locks WHERE name = ?
  `);

  const releaseLockStmt = db.prepare(`
    DELETE FROM job_locks WHERE name = ? AND owner = ?
  `);

  const heartbeatStmt = db.prepare(`
    UPDATE job_locks
    SET heartbeat_at = ?, expires_at = ?
    WHERE name = ? AND owner = ?
  `);

  const insertRunStmt = db.prepare(`
    INSERT INTO cron_runs (
      job_name, started_at, completed_at, status, attempt,
      input_summary, output_summary, duration_ms
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const updateRunStmt = db.prepare(`
    UPDATE cron_runs
    SET completed_at = ?, status = ?, output_summary = ?, duration_ms = ?
    WHERE id = ?
  `);

  const failRunStmt = db.prepare(`
    UPDATE cron_runs
    SET completed_at = ?, status = ?, error = ?, duration_ms = ?
    WHERE id = ?
  `);

  const upsertJobStmt = db.prepare(`
    INSERT INTO cron_jobs (name, schedule, enabled, description, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
      schedule = COALESCE(excluded.schedule, cron_jobs.schedule),
      enabled = excluded.enabled,
      description = COALESCE(excluded.description, cron_jobs.description),
      updated_at = excluded.updated_at
  `);

  const updateJobLastRunStmt = db.prepare(`
    UPDATE cron_jobs
    SET last_run_at = ?, last_status = ?, updated_at = ?
    WHERE name = ?
  `);

  return {
    acquireLockStmt,
    getLockStmt,
    releaseLockStmt,
    heartbeatStmt,
    insertRunStmt,
    updateRunStmt,
    failRunStmt,
    upsertJobStmt,
    updateJobLastRunStmt,
  };
}

export interface JobCoordinator {
  runJob: <T>(
    name: string,
    fn: () => Promise<T>,
    opts?: RunJobOptions
  ) => Promise<T>;
  ensureCronJobs: (definitions: CronJobDefinition[]) => void;
  listRecentRuns: (filters: {
    jobName?: string;
    status?: JobStatus;
    limit?: number;
  }) => JobRunRecord[];
}

export function createJobCoordinator(): JobCoordinator {
  const { db } = getGistifyDb();
  const statements = createStatements(db);

  function acquireLock(name: string, owner: string, expiresAt: number): boolean {
    const acquiredAt = nowMs();
    statements.acquireLockStmt.run(
      name,
      owner,
      acquiredAt,
      expiresAt,
      acquiredAt
    );
    const changesRow = db
      .prepare("SELECT changes() AS changes")
      .get() as unknown as { changes: number };
    return Number(changesRow?.changes || 0) === 1;
  }

  function getLockOwner(name: string): string | null {
    const row = statements.getLockStmt.get(name) as unknown as
      | { owner: string }
      | undefined;
    return row?.owner ?? null;
  }

  function releaseLock(name: string, owner: string) {
    statements.releaseLockStmt.run(name, owner);
  }

  function startHeartbeat(
    name: string,
    owner: string,
    intervalMs: number,
    leaseMs: number
  ): ReturnType<typeof setInterval> | null {
    if (!intervalMs || intervalMs <= 0) {
      return null;
    }

    return setInterval(() => {
      try {
        const heartbeatAt = nowMs();
        const newExpiresAt = heartbeatAt + leaseMs;
        statements.heartbeatStmt.run(
          heartbeatAt,
          newExpiresAt,
          name,
          owner
        );
      } catch (error) {
        console.error(`[jobCoordinator] Heartbeat failed for ${name}:`, error);
      }
    }, intervalMs);
  }

  function insertRunningRun(
    name: string,
    attempt: number,
    inputSummary: unknown
  ): number {
    const result = statements.insertRunStmt.run(
      name,
      nowMs(),
      null,
      "running",
      attempt,
      truncateSummary(inputSummary),
      null,
      null
    ) as unknown as { lastInsertRowid: number };
    return Number(result.lastInsertRowid);
  }

  function completeRun(
    runId: number,
    status: Exclude<JobStatus, "running">,
    outputSummary: unknown,
    error: Error | null,
    startedAt: number
  ) {
    const completedAt = nowMs();
    const durationMs = completedAt - startedAt;

    if (status === "success" || status === "skipped") {
      statements.updateRunStmt.run(
        completedAt,
        status,
        truncateSummary(outputSummary),
        durationMs,
        runId
      );
    } else {
      statements.failRunStmt.run(
        completedAt,
        status,
        truncateSummary(error?.message ?? error?.toString() ?? "Unknown error"),
        durationMs,
        runId
      );
    }
  }

  function updateJobLastRun(name: string, status: JobStatus) {
    const updatedAt = nowMs();
    statements.updateJobLastRunStmt.run(updatedAt, status, updatedAt, name);
  }

  return {
    async runJob(name, fn, opts = {}) {
      const owner = generateOwner();
      const leaseMs = opts.leaseMs || DEFAULT_LEASE_MS;
      const timeoutMs = opts.timeoutMs || DEFAULT_TIMEOUT_MS;
      const expiresAt = nowMs() + leaseMs;

      if (!acquireLock(name, owner, expiresAt)) {
        const heldBy = getLockOwner(name);
        const startedAt = nowMs();
        const runId = insertRunningRun(
          name,
          opts.attempt || 1,
          opts.inputSummary
        );
        completeRun(runId, "skipped", null, null, startedAt);
        updateJobLastRun(name, "skipped");
        throw new JobSkippedError(
          `Job ${name} is already running (lock held by ${heldBy || "unknown"}).`
        );
      }

      const startedAt = nowMs();
      const runId = insertRunningRun(
        name,
        opts.attempt || 1,
        opts.inputSummary
      );

      const heartbeatInterval = opts.heartbeatIntervalMs || Math.min(30_000, leaseMs / 3);
      const heartbeatTimer = startHeartbeat(
        name,
        owner,
        heartbeatInterval,
        leaseMs
      );

      try {
        const result = await runWithTimeout(fn(), timeoutMs);
        completeRun(runId, "success", result, null, startedAt);
        updateJobLastRun(name, "success");
        return result;
      } catch (error) {
        const status = error instanceof JobTimeoutError ? "timeout" : "failed";
        completeRun(
          runId,
          status,
          null,
          error instanceof Error ? error : new Error(String(error)),
          startedAt
        );
        updateJobLastRun(name, status);
        throw error;
      } finally {
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
        }
        releaseLock(name, owner);
      }
    },

    ensureCronJobs(definitions) {
      const updatedAt = nowMs();
      for (const def of definitions) {
        statements.upsertJobStmt.run(
          def.name,
          def.schedule ?? null,
          def.enabled ?? true ? 1 : 0,
          def.description ?? null,
          updatedAt
        );
      }
    },

    listRecentRuns({ jobName, status, limit = 50 }) {
      const conditions: string[] = [];
      const params: (string | number)[] = [];

      if (jobName) {
        conditions.push("job_name = ?");
        params.push(jobName);
      }
      if (status) {
        conditions.push("status = ?");
        params.push(status);
      }

      const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";
      const sql = `
        SELECT
          id,
          job_name AS jobName,
          started_at AS startedAt,
          completed_at AS completedAt,
          status,
          attempt,
          error,
          input_summary AS inputSummary,
          output_summary AS outputSummary,
          duration_ms AS durationMs
        FROM cron_runs
        ${whereClause}
        ORDER BY started_at DESC
        LIMIT ?
      `;
      params.push(Math.max(1, Math.min(1000, limit)));

      const stmt = db.prepare(sql);
      return stmt.all(...params) as unknown as JobRunRecord[];
    },
  };
}
