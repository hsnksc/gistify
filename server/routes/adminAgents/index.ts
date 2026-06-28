import crypto from "node:crypto";
import type { Request, Response, Router } from "express";
import express from "express";
import type { AgentRunRecord } from "../../../shared/opportunities";
import type { BillingStore } from "../../billingStore";

interface AgentTriggerRequestBody {
  agentType?: unknown;
  tickers?: unknown;
}

type AdminAgentsRouterDependencies = {
  billingStore: BillingStore;
  normalizeString: (value: unknown) => string;
  requireWeeklyReportAdmin: (req: Request, res: Response) => boolean;
  setPrivateNoStore: (res: Response) => void;
  syncOpportunitiesFromPublishedWeeklyReports: (options?: {
    tickers?: Set<string>;
  }) => number;
};

export function createAdminAgentsRouter({
  billingStore,
  normalizeString,
  requireWeeklyReportAdmin,
  setPrivateNoStore,
  syncOpportunitiesFromPublishedWeeklyReports,
}: AdminAgentsRouterDependencies): Router {
  const router = express.Router();

  router.get("/admin/agents/runs", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      runs: billingStore.listAgentRuns(),
    });
  });

  router.post("/admin/agents/trigger", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const body = (req.body ?? {}) as AgentTriggerRequestBody;
    const agentType = normalizeString(body.agentType) || "full_scan";
    const tickerList = Array.isArray(body.tickers)
      ? body.tickers
          .filter((value): value is string => typeof value === "string")
          .map(value => normalizeString(value).toUpperCase())
          .filter(Boolean)
      : [];
    const tickerSet = tickerList.length ? new Set(tickerList) : undefined;
    const startedAt = new Date().toISOString();
    const runId = crypto.randomUUID();

    const runningRecord: AgentRunRecord = {
      id: runId,
      runType: agentType,
      status: "running",
      tickersScanned: tickerSet?.size || 0,
      opportunitiesFound: 0,
      errors: [],
      log:
        tickerList.length > 0
          ? `Manual ${agentType} run for tickers: ${tickerList.join(", ")}`
          : `Manual ${agentType} run for published weekly reports`,
      retryCount: 0,
      startedAt,
    };

    billingStore.upsertAgentRun(runningRecord);

    try {
      const opportunitiesFound = syncOpportunitiesFromPublishedWeeklyReports({
        tickers: tickerSet,
      });
      const completedRecord: AgentRunRecord = {
        ...runningRecord,
        status: "success",
        tickersScanned: tickerSet?.size || opportunitiesFound,
        opportunitiesFound,
        log: `${runningRecord.log}. Projection sync completed successfully.`,
        completedAt: new Date().toISOString(),
      };

      billingStore.upsertAgentRun(completedRecord);
      res.status(201).json({
        run: completedRecord,
        runs: billingStore.listAgentRuns(),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Agent run basarisiz oldu.";
      const failedRecord: AgentRunRecord = {
        ...runningRecord,
        status: "failed",
        errors: [message],
        log: `${runningRecord.log}. Projection sync failed.`,
        completedAt: new Date().toISOString(),
      };

      billingStore.upsertAgentRun(failedRecord);
      res.status(500).json({
        error: message,
        run: failedRecord,
      });
    }
  });

  return router;
}
