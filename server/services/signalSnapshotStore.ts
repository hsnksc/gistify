import type { DatabaseSync } from "node:sqlite";
import { getGistifyDb } from "../db";

export type SignalSnapshotKind = "midas" | "calendar" | "earnings";

export interface SignalSnapshotRecord<T = unknown> {
  kind: SignalSnapshotKind;
  payload: T;
  source: string | null;
  createdAt: number;
  updatedAt: number;
}

interface SignalSnapshotRow {
  kind: string;
  payload: string;
  source: string | null;
  created_at: number;
  updated_at: number;
}

function nowMs() {
  return Date.now();
}

export interface SignalSnapshotStore {
  saveSnapshot: <T>(
    kind: SignalSnapshotKind,
    payload: T,
    source?: string
  ) => SignalSnapshotRecord<T>;
  getLatestSnapshot: <T>(kind: SignalSnapshotKind) => SignalSnapshotRecord<T> | null;
  listSnapshots: <T>(
    kind: SignalSnapshotKind,
    limit?: number
  ) => SignalSnapshotRecord<T>[];
}

export function createSignalSnapshotStore(): SignalSnapshotStore {
  const { db } = getGistifyDb();

  const saveStmt = db.prepare(`
    INSERT INTO signal_snapshots (kind, payload, source, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(kind) DO UPDATE SET
      payload = excluded.payload,
      source = excluded.source,
      updated_at = excluded.updated_at
  `);

  const getStmt = db.prepare(`
    SELECT kind, payload, source, created_at, updated_at
    FROM signal_snapshots
    WHERE kind = ?
  `);

  const listStmt = db.prepare(`
    SELECT kind, payload, source, created_at, updated_at
    FROM signal_snapshots
    WHERE kind = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);

  function mapRow<T>(row: SignalSnapshotRow): SignalSnapshotRecord<T> {
    return {
      kind: row.kind as SignalSnapshotKind,
      payload: JSON.parse(row.payload) as T,
      source: row.source,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  return {
    saveSnapshot<T>(kind: SignalSnapshotKind, payload: T, source?: string) {
      const payloadJson = JSON.stringify(payload);
      const updatedAt = nowMs();
      saveStmt.run(kind, payloadJson, source ?? null, updatedAt, updatedAt);
      const row = getStmt.get(kind) as unknown as SignalSnapshotRow | undefined;
      if (!row) {
        throw new Error(`[signalSnapshot] Failed to persist snapshot for ${kind}`);
      }
      return mapRow<T>(row);
    },

    getLatestSnapshot<T>(kind: SignalSnapshotKind) {
      const row = getStmt.get(kind) as unknown as SignalSnapshotRow | undefined;
      return row ? mapRow<T>(row) : null;
    },

    listSnapshots<T>(kind: SignalSnapshotKind, limit = 10) {
      const cappedLimit = Math.max(1, Math.min(100, limit));
      const rows = listStmt.all(
        kind,
        cappedLimit
      ) as unknown as SignalSnapshotRow[];
      return rows.map(row => mapRow<T>(row));
    },
  };
}
