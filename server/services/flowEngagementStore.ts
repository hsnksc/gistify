import type { DatabaseSync } from "node:sqlite";
import type { FlowReportEngagement } from "../../shared/flow";
import { getGistifyDb } from "../db";

interface FlowEngagementRow {
  flow_id: string;
  likes: number;
  shares: number;
  reads: number;
}

export interface FlowEngagementStore {
  recordView: (flowId: string) => FlowReportEngagement;
  recordLike: (flowId: string, liked: boolean) => FlowReportEngagement;
  recordShare: (flowId: string) => FlowReportEngagement;
  getEngagementByFlowIds: (flowIds: string[]) => Map<string, FlowReportEngagement>;
  getEngagementByFlowId: (flowId: string) => FlowReportEngagement;
}

function nowMs() {
  return Date.now();
}

function createStatements(db: DatabaseSync) {
  const recordViewStmt = db.prepare(`
    INSERT INTO flow_engagement (flow_id, likes, shares, reads, updated_at)
    VALUES (?, 0, 0, 1, ?)
    ON CONFLICT(flow_id) DO UPDATE SET
      reads = reads + 1,
      updated_at = excluded.updated_at
  `);

  const recordLikeStmt = db.prepare(`
    INSERT INTO flow_engagement (flow_id, likes, shares, reads, updated_at)
    VALUES (?, ?, 0, 0, ?)
    ON CONFLICT(flow_id) DO UPDATE SET
      likes = CASE
        WHEN excluded.likes > 0 THEN likes + 1
        ELSE MAX(likes - 1, 0)
      END,
      updated_at = excluded.updated_at
  `);

  const recordShareStmt = db.prepare(`
    INSERT INTO flow_engagement (flow_id, likes, shares, reads, updated_at)
    VALUES (?, 0, 1, 0, ?)
    ON CONFLICT(flow_id) DO UPDATE SET
      shares = shares + 1,
      updated_at = excluded.updated_at
  `);

  const getByFlowIdsStmt = db.prepare(`
    SELECT flow_id, likes, shares, reads
    FROM flow_engagement
    WHERE flow_id IN (${placeholderList(1)})
  `);

  return {
    recordViewStmt,
    recordLikeStmt,
    recordShareStmt,
    getByFlowIdsStmt,
  };
}

function placeholderList(count: number) {
  return Array.from({ length: count }, (_, index) => `?`).join(", ");
}

function mapRow(row: FlowEngagementRow): FlowReportEngagement {
  return {
    likeCount: Number(row.likes || 0),
    shareCount: Number(row.shares || 0),
    readCount: Number(row.reads || 0),
  };
}

export function createFlowEngagementStore(): FlowEngagementStore {
  const { db } = getGistifyDb();
  const {
    recordViewStmt,
    recordLikeStmt,
    recordShareStmt,
    getByFlowIdsStmt,
  } = createStatements(db);

  function getEngagementByFlowId(flowId: string): FlowReportEngagement {
    return (
      getEngagementByFlowIds([flowId]).get(flowId) || {
        likeCount: 0,
        shareCount: 0,
        readCount: 0,
      }
    );
  }

  function getEngagementByFlowIds(
    flowIds: string[]
  ): Map<string, FlowReportEngagement> {
    const result = new Map<string, FlowReportEngagement>();
    const uniqueIds = Array.from(
      new Set(flowIds.map(id => id.trim()).filter(Boolean))
    );

    for (const flowId of uniqueIds) {
      result.set(flowId, {
        likeCount: 0,
        shareCount: 0,
        readCount: 0,
      });
    }

    if (!uniqueIds.length) {
      return result;
    }

    const dynamicStmt = db.prepare(`
      SELECT flow_id, likes, shares, reads
      FROM flow_engagement
      WHERE flow_id IN (${placeholderList(uniqueIds.length)})
    `);
    const rows = dynamicStmt.all(...uniqueIds) as unknown as FlowEngagementRow[];

    for (const row of rows) {
      result.set(row.flow_id, mapRow(row));
    }

    return result;
  }

  return {
    recordView(flowId: string) {
      recordViewStmt.run(flowId, nowMs());
      return getEngagementByFlowId(flowId);
    },

    recordLike(flowId: string, liked: boolean) {
      recordLikeStmt.run(flowId, liked ? 1 : 0, nowMs());
      return getEngagementByFlowId(flowId);
    },

    recordShare(flowId: string) {
      recordShareStmt.run(flowId, nowMs());
      return getEngagementByFlowId(flowId);
    },

    getEngagementByFlowIds,
    getEngagementByFlowId,
  };
}
