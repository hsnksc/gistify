import type { Request, Response, Router } from "express";
import express from "express";
import type { BillingStore } from "../../billingStore";
import {
  buildLiveWeeklyReportSuggestions,
  getAdminMarketDataStatus,
  isFmpConfigured,
} from "../../adminMarketData";
import type { WeeklyReportRecord } from "../../../shared/weeklyReports";

interface WeeklyReportUpsertRequestBody {
  report?: unknown;
}

type WeeklyReportsRouterDependencies = {
  billingStore: BillingStore;
  getViewerWeeklyReports: () => WeeklyReportRecord[];
  getWeeklyReportAdminEmail: () => string;
  isWeeklyReportAdminRequest: (req: Request) => boolean;
  normalizeString: (value: unknown) => string;
  normalizeWeeklyReportRecordInput: (
    value: unknown,
    previousRecord?: WeeklyReportRecord | null
  ) => WeeklyReportRecord;
  requireWeeklyReportAdmin: (req: Request, res: Response) => boolean;
  setPrivateNoStore: (res: Response) => void;
  syncOpportunitiesFromPublishedWeeklyReports: () => number;
};

export function createWeeklyReportsRouter({
  billingStore,
  getViewerWeeklyReports,
  getWeeklyReportAdminEmail,
  isWeeklyReportAdminRequest,
  normalizeString,
  normalizeWeeklyReportRecordInput,
  requireWeeklyReportAdmin,
  setPrivateNoStore,
  syncOpportunitiesFromPublishedWeeklyReports,
}: WeeklyReportsRouterDependencies): Router {
  const router = express.Router();

  router.get("/reports/weekly", (req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      reports: getViewerWeeklyReports(),
      admin: {
        authorized: isWeeklyReportAdminRequest(req),
        email: getWeeklyReportAdminEmail(),
      },
    });
  });

  router.get("/admin/reports/weekly", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      reports: billingStore.listWeeklyReports(),
      admin: {
        authorized: true,
        email: getWeeklyReportAdminEmail(),
      },
    });
  });

  router.get("/admin/workspace/status", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      providers: getAdminMarketDataStatus(),
      env: {
        fmpConfigured: isFmpConfigured(),
      },
    });
  });

  router.get("/admin/reports/weekly/suggestions", async (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const existingReports = billingStore.listWeeklyReports();

    try {
      const liveSuggestions = await buildLiveWeeklyReportSuggestions(
        existingReports,
        getWeeklyReportAdminEmail()
      );

      if (liveSuggestions.length > 0) {
        res.status(200).json({
          suggestions: liveSuggestions,
          providers: getAdminMarketDataStatus(),
          mode: "live",
        });
        return;
      }
    } catch (error) {
      console.error("Live weekly report suggestion build failed", error);
    }

    res.status(200).json({
      suggestions: [],
      providers: getAdminMarketDataStatus(),
      mode: "empty",
    });
  });

  router.post("/admin/reports/weekly", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const body = (req.body ?? {}) as WeeklyReportUpsertRequestBody;
    const rawReport = body.report;
    const draftSource =
      rawReport && typeof rawReport === "object"
        ? (rawReport as Partial<Record<keyof WeeklyReportRecord, unknown>>)
        : undefined;
    const reportId = draftSource ? normalizeString(draftSource.id) : "";
    const previousRecord = reportId
      ? billingStore.getWeeklyReportById(reportId)
      : null;
    const report = normalizeWeeklyReportRecordInput(rawReport, previousRecord);

    billingStore.upsertWeeklyReport(report);
    syncOpportunitiesFromPublishedWeeklyReports();

    res.status(previousRecord ? 200 : 201).json({
      report,
      reports: billingStore.listWeeklyReports(),
    });
  });

  return router;
}
