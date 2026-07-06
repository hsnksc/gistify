import type { DatabaseSync } from "node:sqlite";
import { getGistifyDb } from "../db";

export type DeployStatus = "running" | "success" | "failed" | "rolled_back";

export interface DeployHistoryRecord {
  id: number;
  commitSha: string | null;
  branch: string | null;
  startedAt: number;
  completedAt: number | null;
  status: DeployStatus;
  notes: string | null;
  rollbackOf: number | null;
  triggeredBy: string | null;
}

interface DeployHistoryRow {
  id: number;
  commit_sha: string | null;
  branch: string | null;
  started_at: number;
  completed_at: number | null;
  status: DeployStatus;
  notes: string | null;
  rollback_of: number | null;
  triggered_by: string | null;
}

function nowMs() {
  return Date.now();
}

function mapRow(row: DeployHistoryRow): DeployHistoryRecord {
  return {
    id: row.id,
    commitSha: row.commit_sha,
    branch: row.branch,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    status: row.status,
    notes: row.notes,
    rollbackOf: row.rollback_of,
    triggeredBy: row.triggered_by,
  };
}

export interface DeployHistoryStore {
  startDeploy: (
    commitSha: string | null,
    branch: string | null,
    triggeredBy?: string,
    notes?: string
  ) => number;
  completeDeploy: (id: number, status: DeployStatus, notes?: string) => void;
  listDeploys: (limit?: number) => DeployHistoryRecord[];
}

export function createDeployHistoryStore(): DeployHistoryStore {
  const { db } = getGistifyDb();

  const startStmt = db.prepare(`
    INSERT INTO deploy_history (
      commit_sha, branch, started_at, completed_at, status, notes, rollback_of, triggered_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const completeStmt = db.prepare(`
    UPDATE deploy_history
    SET completed_at = ?, status = ?, notes = COALESCE(?, notes)
    WHERE id = ?
  `);

  const listStmt = db.prepare(`
    SELECT id, commit_sha, branch, started_at, completed_at, status, notes, rollback_of, triggered_by
    FROM deploy_history
    ORDER BY started_at DESC
    LIMIT ?
  `);

  return {
    startDeploy(commitSha, branch, triggeredBy, notes) {
      const result = startStmt.run(
        commitSha ?? null,
        branch ?? null,
        nowMs(),
        null,
        "running",
        notes ?? null,
        null,
        triggeredBy ?? null
      ) as unknown as { lastInsertRowid: number };
      return Number(result.lastInsertRowid);
    },

    completeDeploy(id, status, notes) {
      completeStmt.run(nowMs(), status, notes ?? null, id);
    },

    listDeploys(limit = 50) {
      const rows = listStmt.all(
        Math.max(1, Math.min(1000, limit))
      ) as unknown as DeployHistoryRow[];
      return rows.map(mapRow);
    },
  };
}

export function recordStartupDeploy() {
  const commitSha = process.env.GIT_SHA?.trim() || null;
  const branch = process.env.GIT_BRANCH?.trim() || null;

  if (!commitSha && !branch) {
    return null;
  }

  const store = createDeployHistoryStore();
  const id = store.startDeploy(commitSha, branch, "startup", "Application startup");
  store.completeDeploy(id, "success");
  return id;
}
