import type { Request, Response, Router } from "express";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import type {
  EarningsStrategyApiResponse,
  EarningsStrategyData,
  EarningsStrategyPipelineMetadata,
} from "../../../shared/earnings";
import { createMacroArchiveStore } from "../../services/macroArchiveStore";

type WorkspaceFeedsRouterDependencies = {
  buildEarningsApiResponse: (
    snapshot: EarningsStrategyData | null,
    pipeline: EarningsStrategyPipelineMetadata
  ) => EarningsStrategyApiResponse;
  getCalendarPipeline: () => unknown;
  getCalendarSnapshot: () => unknown;
  refreshCalendarSnapshot: (options?: { force?: boolean }) => Promise<unknown>;
  getCpiPpiPipeline: () => unknown;
  getCpiPpiSnapshot: () => unknown;
  getEarningReportSource: (sourceId: string) => unknown | null;
  getEarningsDownloadFolder: () => string | null;
  getEarningsPipeline: () => EarningsStrategyPipelineMetadata;
  getEarningsSnapshot: () => EarningsStrategyData | null;
  getMarketFlashReportPath: () => string;
  getMidasPipeline: () => unknown;
  getMidasSnapshot: () => unknown;
  listEarningReportSourceSummaries: () => unknown[];
  normalizeString: (value: unknown) => string;
  refreshMidasSignals: () => Promise<unknown>;
  requireWeeklyReportAdmin: (req: Request, res: Response) => boolean;
  setPrivateNoStore: (res: Response) => void;
};

export function createWorkspaceFeedsRouter({
  buildEarningsApiResponse,
  getCalendarPipeline,
  getCalendarSnapshot,
  refreshCalendarSnapshot,
  getCpiPpiPipeline,
  getCpiPpiSnapshot,
  getEarningReportSource,
  getEarningsDownloadFolder,
  getEarningsPipeline,
  getEarningsSnapshot,
  getMarketFlashReportPath,
  getMidasPipeline,
  getMidasSnapshot,
  listEarningReportSourceSummaries,
  normalizeString,
  refreshMidasSignals,
  requireWeeklyReportAdmin,
  setPrivateNoStore,
}: WorkspaceFeedsRouterDependencies): Router {
  const router = express.Router();

  router.get("/earning-reports", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      reports: listEarningReportSourceSummaries(),
    });
  });

  router.get("/earning-reports/latest", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      report: listEarningReportSourceSummaries()[0] || null,
    });
  });

  router.get("/earning-reports/:sourceId", (req, res) => {
    setPrivateNoStore(res);

    const sourceId = normalizeString(req.params.sourceId);
    const report = getEarningReportSource(sourceId);
    if (!report) {
      res.status(404).json({ error: "Earning report source bulunamadi." });
      return;
    }

    res.status(200).json({ report });
  });

  router.get("/midas/signals", (_req, res) => {
    setPrivateNoStore(res);

    const snapshot = getMidasSnapshot();
    if (!snapshot) {
      res.status(503).json({
        error: "Midas signal snapshot hazir degil.",
        pipeline: getMidasPipeline(),
      });
      return;
    }

    res.status(200).json(snapshot);
  });

  router.post("/admin/midas/signals/refresh", async (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const snapshot = await refreshMidasSignals();
    if (!snapshot) {
      res.status(503).json({
        error: "Midas signal snapshot yenilenemedi.",
        pipeline: getMidasPipeline(),
      });
      return;
    }

    res.status(200).json(snapshot);
  });

  router.get("/cpi-ppi/forecast", (_req, res) => {
    setPrivateNoStore(res);

    const snapshot = getCpiPpiSnapshot();
    if (!snapshot) {
      res.status(503).json({
        error: "CPI/PPI forecast snapshot hazir degil.",
        pipeline: getCpiPpiPipeline(),
      });
      return;
    }

    res.status(200).json(snapshot);
  });

  router.get("/cpi-ppi/forecast/archive", (req, res) => {
    setPrivateNoStore(res);

    const workspace = normalizeString(req.query.workspace).toLowerCase();
    if (workspace !== "cpi" && workspace !== "ppi") {
      res.status(400).json({ error: "workspace must be 'cpi' or 'ppi'." });
      return;
    }

    const rawLimit = Number(req.query.limit);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 12;

    const macroArchiveStore = createMacroArchiveStore();
    const records = macroArchiveStore.listArchives(workspace, limit);

    res.status(200).json({
      workspace,
      records: records.map(record => ({
        id: record.id,
        month: record.month,
        source: record.source,
        createdAt: record.createdAt,
        payload: record.payload,
      })),
    });
  });

  router.get("/cpi-ppi/forecast/compare", (req, res) => {
    setPrivateNoStore(res);

    const workspace = normalizeString(req.query.workspace).toLowerCase();
    if (workspace !== "cpi" && workspace !== "ppi") {
      res.status(400).json({ error: "workspace must be 'cpi' or 'ppi'." });
      return;
    }

    const month = normalizeString(req.query.month);
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      res.status(400).json({ error: "month must be YYYY-MM." });
      return;
    }

    const macroArchiveStore = createMacroArchiveStore();
    const comparison = macroArchiveStore.getComparison(workspace, month);

    res.status(200).json({
      workspace,
      month,
      current: comparison.current,
      previous: comparison.previous,
    });
  });

  router.get("/calendar", async (req, res) => {
    setPrivateNoStore(res);
    const shouldForceRefresh = normalizeString(req.query.refresh).toLowerCase() === "1";

    try {
      await refreshCalendarSnapshot({ force: shouldForceRefresh });
    } catch {
      // Fall through to the latest in-memory or persisted snapshot.
    }

    const snapshot = getCalendarSnapshot();
    if (!snapshot) {
      res.status(503).json({
        error: "Calendar snapshot hazir degil.",
        pipeline: getCalendarPipeline(),
      });
      return;
    }

    res.status(200).json(snapshot);
  });

  router.get("/earnings/strategy", (_req, res) => {
    setPrivateNoStore(res);

    const snapshot = getEarningsSnapshot();
    const pipeline = getEarningsPipeline();
    const response = buildEarningsApiResponse(snapshot, pipeline);

    if (!snapshot) {
      res.status(503).json(response);
      return;
    }

    res.status(200).json(response);
  });

  router.get("/earnings/download", (req, res) => {
    const format = normalizeString(req.query.format);
    const folder =
      getEarningsDownloadFolder() ||
      path.resolve(process.cwd(), "earningreport", "Kimi_Agent_ Option Strategy");

    if (!fs.existsSync(folder)) {
      res.status(503).json({ error: "Earnings report folder not found." });
      return;
    }

    const extension = format === "docx" ? ".docx" : ".md";
    const entries = fs.readdirSync(folder, { withFileTypes: true });
    let latest: { filePath: string; mtimeMs: number } | null = null;

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!entry.name.toLowerCase().endsWith(extension)) continue;
      if (!/Earnings_Opsiyon_Master_Stratejisi/i.test(entry.name)) continue;

      const filePath = path.join(folder, entry.name);
      const stats = fs.statSync(filePath);
      if (!latest || stats.mtimeMs > latest.mtimeMs) {
        latest = { filePath, mtimeMs: stats.mtimeMs };
      }
    }

    if (!latest) {
      res.status(404).json({
        error: `No earnings report found for format ${format || "md"}.`,
      });
      return;
    }

    if (!fs.existsSync(latest.filePath)) {
      res.status(404).json({
        error: `Report file not found: ${path.basename(latest.filePath)}`,
      });
      return;
    }

    res.download(latest.filePath, path.basename(latest.filePath));
  });

  router.get("/marketflash", (_req, res) => {
    setPrivateNoStore(res);

    const reportPath = getMarketFlashReportPath();

    try {
      if (!fs.existsSync(reportPath)) {
        res.status(503).json({
          error: "Market Flash raporu hazir degil.",
        });
        return;
      }

      const raw = fs.readFileSync(reportPath, "utf8");
      if (!raw.trim()) {
        res.status(503).json({
          error: "Market Flash raporu bos.",
        });
        return;
      }

      res.status(200).type("json").send(raw);
    } catch {
      res.status(503).json({
        error: "Market Flash raporu okunamadi.",
      });
    }
  });

  return router;
}
