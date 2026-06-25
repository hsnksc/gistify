import { Router, type Response } from "express";
import type { DailyReportRecord } from "../../../shared/dailyReports";
import type {
  FlowReportResponse,
  FlowReportsResponse,
  FlowReportSummariesResponse,
} from "../../../shared/flow";
import {
  getViewerFlowReportById,
  getViewerFlowReports,
  getViewerFlowReportSummaries,
} from "../../services/flowService";

interface FlowReportsRouterDependencies {
  setPrivateNoStore: (res: Response) => void;
  getPublishedReports: () => DailyReportRecord[];
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeReportKind(value: unknown) {
  const normalized = normalizeString(value).toLowerCase();
  return normalized === "daily" || normalized === "stock" ? normalized : undefined;
}

function normalizeLimit(value: unknown) {
  const normalized = normalizeString(value);
  if (!normalized) {
    return undefined;
  }

  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return undefined;
  }

  return Math.min(parsed, 100);
}

export function createFlowReportsRouter({
  setPrivateNoStore,
  getPublishedReports,
}: FlowReportsRouterDependencies) {
  const router = Router();

  router.get("/", (req, res) => {
    setPrivateNoStore(res);

    const payload: FlowReportsResponse = {
      reports: getViewerFlowReports(getPublishedReports(), {
        limit: normalizeLimit(req.query.limit),
        reportKind: normalizeReportKind(req.query.type),
        sourceLabel: normalizeString(req.query.source),
      }),
    };

    res.status(200).json(payload);
  });

  router.get("/summary", (req, res) => {
    setPrivateNoStore(res);

    const payload: FlowReportSummariesResponse = {
      reports: getViewerFlowReportSummaries(getPublishedReports(), {
        limit: normalizeLimit(req.query.limit),
        reportKind: normalizeReportKind(req.query.type),
        sourceLabel: normalizeString(req.query.source),
      }),
    };

    res.status(200).json(payload);
  });

  router.get("/latest", (_req, res) => {
    setPrivateNoStore(res);

    const payload: FlowReportResponse = {
      report:
        getViewerFlowReports(getPublishedReports(), {
          limit: 1,
          reportKind: normalizeReportKind(_req.query.type),
        })[0] || null,
    };

    res.status(200).json(payload);
  });

  router.get("/:reportId", (req, res) => {
    setPrivateNoStore(res);

    const report = getViewerFlowReportById(
      getPublishedReports(),
      req.params.reportId
    );

    if (!report) {
      res.status(404).json({ error: "Flow report bulunamadi." });
      return;
    }

    const payload: FlowReportResponse = { report };
    res.status(200).json(payload);
  });

  return router;
}
