import type { Request, Response, Router } from "express";
import express from "express";
import type { BillingStore } from "../../billingStore";
import type { MomentumReportRecord } from "../../../shared/momentumReports";
import type {
  MomentumSourceRecord,
  MomentumSourceSummary,
} from "../../../shared/momentumSources";

interface MomentumReportUpsertRequestBody {
  report?: unknown;
}

type MomentumRouterDependencies = {
  billingStore: BillingStore;
  getMomentumReportSource: (sourceId: string) => MomentumSourceRecord | null;
  listMomentumReportSourceSummaries: () => MomentumSourceSummary[];
  normalizeMomentumReportRecordInput: (
    value: unknown,
    previousRecord?: MomentumReportRecord | null
  ) => MomentumReportRecord;
  normalizeString: (value: unknown) => string;
  requireWeeklyReportAdmin: (req: Request, res: Response) => boolean;
  setPrivateNoStore: (res: Response) => void;
};

export function createMomentumRouter({
  billingStore,
  getMomentumReportSource,
  listMomentumReportSourceSummaries,
  normalizeMomentumReportRecordInput,
  normalizeString,
  requireWeeklyReportAdmin,
  setPrivateNoStore,
}: MomentumRouterDependencies): Router {
  const router = express.Router();

  router.get("/momentum/sources", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      reports: listMomentumReportSourceSummaries(),
    });
  });

  router.get("/momentum/sources/latest", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      report: listMomentumReportSourceSummaries()[0] || null,
    });
  });

  router.get("/momentum/sources/:sourceId", (req, res) => {
    setPrivateNoStore(res);

    const sourceId = normalizeString(req.params.sourceId);
    const report = getMomentumReportSource(sourceId);
    if (!report) {
      res.status(404).json({ error: "Momentum report source bulunamadi." });
      return;
    }

    res.status(200).json({ report });
  });

  router.get("/momentum/reports/latest", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      report: billingStore.getLatestPublishedMomentumReport(),
    });
  });

  router.get("/admin/momentum/reports", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      reports: billingStore.listMomentumReports(),
      latestPublished: billingStore.getLatestPublishedMomentumReport(),
    });
  });

  router.post("/admin/momentum/reports", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const body = (req.body ?? {}) as MomentumReportUpsertRequestBody;
    const rawReport = body.report;
    const draftSource =
      rawReport && typeof rawReport === "object"
        ? (rawReport as Partial<Record<keyof MomentumReportRecord, unknown>>)
        : undefined;
    const reportId = draftSource ? normalizeString(draftSource.id) : "";
    const previousRecord = reportId
      ? billingStore.getMomentumReportById(reportId)
      : null;
    const report = normalizeMomentumReportRecordInput(
      rawReport,
      previousRecord
    );

    billingStore.upsertMomentumReport(report);
    res.status(previousRecord ? 200 : 201).json({
      report,
      reports: billingStore.listMomentumReports(),
      latestPublished: billingStore.getLatestPublishedMomentumReport(),
    });
  });

  return router;
}
