import type { Request, Response, Router } from "express";
import express from "express";
import type { BillingStore } from "../../billingStore";
import type {
  DailyReportRecord,
  DailyReportSourcePackage,
} from "../../../shared/dailyReports";

interface DailyReportUpsertRequestBody {
  report?: unknown;
}

type DailyReportsRouterDependencies = {
  billingStore: BillingStore;
  getDailyReportSourcePackage: (
    folderName: string
  ) => DailyReportSourcePackage | null;
  getDailyReportSourcePackages: () => DailyReportSourcePackage[];
  getPublishedDailyReports: () => DailyReportRecord[];
  getViewerDailyReports: (
    reports: DailyReportRecord[],
    limit?: number
  ) => DailyReportRecord[];
  listDailyReportSourcePackages: () => DailyReportSourcePackage[];
  normalizeDailyReportRecordInput: (
    value: unknown,
    previousRecord?: DailyReportRecord | null
  ) => DailyReportRecord;
  normalizeString: (value: unknown) => string;
  requireWeeklyReportAdmin: (req: Request, res: Response) => boolean;
  setPrivateNoStore: (res: Response) => void;
};

export function createDailyReportsRouter({
  billingStore,
  getDailyReportSourcePackage,
  getDailyReportSourcePackages,
  getPublishedDailyReports,
  getViewerDailyReports,
  listDailyReportSourcePackages,
  normalizeDailyReportRecordInput,
  normalizeString,
  requireWeeklyReportAdmin,
  setPrivateNoStore,
}: DailyReportsRouterDependencies): Router {
  const router = express.Router();

  router.get("/daily-reports", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      reports: getViewerDailyReports(getPublishedDailyReports()),
    });
  });

  router.get("/daily-report-sources", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      sources: getDailyReportSourcePackages(),
    });
  });

  router.get("/daily-reports/latest", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      report: getViewerDailyReports(getPublishedDailyReports(), 1)[0] || null,
    });
  });

  router.get("/admin/daily-report-sources", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      sources: listDailyReportSourcePackages().map(source => ({
        id: source.id,
        folderName: source.folderName,
        reportDate: source.reportDate,
        title: source.title,
        headline: source.headline,
        author: source.author,
        coverage: source.coverage,
        methodology: source.methodology,
        executiveSummary: source.executiveSummary,
        sectionFiles: source.sectionFiles,
        figureFiles: source.figureFiles,
        openAiFigureFiles: source.openAiFigureFiles,
        html: source.html,
        tickerUniverse: source.tickerUniverse,
        researchFileCount: source.researchFileCount,
        updatedAt: source.updatedAt,
        sourceKind: source.sourceKind,
        contentFormat: source.contentFormat,
        sourceLabel: source.sourceLabel,
        assetBasePath: source.assetBasePath,
      })),
    });
  });

  router.get("/admin/daily-report-sources/:folderName", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const folderName = normalizeString(req.params.folderName);
    const source = getDailyReportSourcePackage(folderName);
    if (!source) {
      res.status(404).json({ error: "Daily report source bulunamadi." });
      return;
    }

    res.status(200).json({ source });
  });

  router.get("/admin/daily-reports", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      reports: billingStore.listDailyReports(),
      latestPublished: billingStore.getLatestPublishedDailyReport(),
    });
  });

  router.post("/admin/daily-reports", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const body = (req.body ?? {}) as DailyReportUpsertRequestBody;
    const rawReport = body.report;
    const draftSource =
      rawReport && typeof rawReport === "object"
        ? (rawReport as Partial<Record<keyof DailyReportRecord, unknown>>)
        : undefined;
    const reportId = draftSource ? normalizeString(draftSource.id) : "";
    const previousRecord = reportId
      ? billingStore.getDailyReportById(reportId)
      : null;
    const report = normalizeDailyReportRecordInput(rawReport, previousRecord);

    billingStore.upsertDailyReport(report);
    res.status(previousRecord ? 200 : 201).json({
      report,
      reports: billingStore.listDailyReports(),
      latestPublished: billingStore.getLatestPublishedDailyReport(),
    });
  });

  return router;
}
