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

export function createFlowReportsRouter({
  setPrivateNoStore,
  getPublishedReports,
}: FlowReportsRouterDependencies) {
  const router = Router();

  router.get("/", (req, res) => {
    setPrivateNoStore(res);

    const payload: FlowReportsResponse = {
      reports: getViewerFlowReports(getPublishedReports(), {
        sourceLabel: normalizeString(req.query.source),
      }),
    };

    res.status(200).json(payload);
  });

  router.get("/summary", (req, res) => {
    setPrivateNoStore(res);

    const payload: FlowReportSummariesResponse = {
      reports: getViewerFlowReportSummaries(getPublishedReports(), {
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
