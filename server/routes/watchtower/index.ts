import type { Request, Response, Router } from "express";
import express from "express";
import type { BillingStore } from "../../billingStore";
import type { MidasSignalsData } from "../../../shared/midasSignals";
import type {
  WatchtowerEntry,
  WatchtowerLanguage,
  WatchtowerReportRecord,
} from "../../../shared/watchtower";
import { generateWatchtowerDraft } from "../../watchtowerGenerator";

type WatchtowerRouterDependencies = {
  billingStore: BillingStore;
  getMidasSnapshot: () => MidasSignalsData | null;
  getWeeklyReportAdminEmail: () => string;
  normalizeString: (value: unknown) => string;
  requireWeeklyReportAdmin: (req: Request, res: Response) => boolean;
  setPrivateNoStore: (res: Response) => void;
};

function normalizeLanguage(value: unknown): WatchtowerLanguage {
  return value === "en" ? "en" : "tr";
}

function editableEntries(value: unknown, previous: WatchtowerEntry[]) {
  if (!Array.isArray(value)) return previous;
  const bySymbol = new Map(previous.map(entry => [entry.symbol, entry]));
  return value.flatMap(item => {
    if (!item || typeof item !== "object") return [];
    const source = item as { symbol?: unknown; thesis?: unknown };
    const symbol = typeof source.symbol === "string" ? source.symbol : "";
    const original = bySymbol.get(symbol);
    if (!original) return [];
    const thesis = typeof source.thesis === "string"
      ? source.thesis.trim().slice(0, 1200)
      : original.thesis;
    return [{ ...original, thesis: thesis || original.thesis }];
  });
}

function applyEditorialChanges(
  previous: WatchtowerReportRecord,
  value: unknown
): WatchtowerReportRecord {
  if (!value || typeof value !== "object") return previous;
  const source = value as {
    title?: unknown;
    content?: {
      summary?: unknown;
      methodology?: unknown;
      leaders?: unknown;
      risks?: unknown;
      watch?: unknown;
    };
  };
  const title = typeof source.title === "string"
    ? source.title.trim().slice(0, 180)
    : previous.title;
  const content = source.content && typeof source.content === "object"
    ? source.content
    : {};
  const summary = typeof content.summary === "string"
    ? content.summary.trim().slice(0, 4000)
    : previous.content.summary;
  const methodology = typeof content.methodology === "string"
    ? content.methodology.trim().slice(0, 1600)
    : previous.content.methodology;

  return {
    ...previous,
    title: title || previous.title,
    status: "draft",
    updatedAt: new Date().toISOString(),
    publishedAt: undefined,
    reviewerEmail: undefined,
    content: {
      ...previous.content,
      summary: summary || previous.content.summary,
      methodology: methodology || previous.content.methodology,
      leaders: editableEntries(content.leaders, previous.content.leaders),
      risks: editableEntries(content.risks, previous.content.risks),
      watch: editableEntries(content.watch, previous.content.watch),
    },
  };
}

export function createWatchtowerRouter({
  billingStore,
  getMidasSnapshot,
  getWeeklyReportAdminEmail,
  normalizeString,
  requireWeeklyReportAdmin,
  setPrivateNoStore,
}: WatchtowerRouterDependencies): Router {
  const router = express.Router();

  router.get("/watchtower/latest", (req, res) => {
    setPrivateNoStore(res);
    const language = normalizeLanguage(req.query.language);
    res.status(200).json({
      report: billingStore.getLatestPublishedWatchtowerReport(language),
    });
  });

  router.get("/watchtower", (req, res) => {
    setPrivateNoStore(res);
    const language = normalizeLanguage(req.query.language);
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 12));
    const reports = billingStore
      .listWatchtowerReports()
      .filter(report => report.status === "published" && report.language === language)
      .slice(0, limit);
    res.status(200).json({ reports });
  });

  router.get("/admin/watchtower", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) return;
    res.status(200).json({
      reports: billingStore.listWatchtowerReports(),
      latestPublished: billingStore.getLatestPublishedWatchtowerReport(
        normalizeLanguage(req.query.language)
      ),
    });
  });

  router.post("/admin/watchtower/generate", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) return;
    const snapshot = getMidasSnapshot();
    if (!snapshot || !snapshot.signals.length) {
      res.status(409).json({ error: "Midas snapshot henüz hazır değil." });
      return;
    }
    const language = normalizeLanguage(req.body?.language);
    const reportDate = snapshot.timestamp.slice(0, 10);
    const previous = billingStore.getWatchtowerReportByDateAndLanguage(
      reportDate,
      language
    );
    if (previous?.status === "published") {
      res.status(409).json({ error: "Bu tarih ve dil için yayınlanmış Watchtower zaten var." });
      return;
    }
    const report = generateWatchtowerDraft(
      snapshot,
      language,
      getWeeklyReportAdminEmail()
    );
    if (previous) report.createdAt = previous.createdAt;
    billingStore.upsertWatchtowerReport(report);
    res.status(previous ? 200 : 201).json({
      report,
      reports: billingStore.listWatchtowerReports(),
    });
  });

  router.patch("/admin/watchtower/:reportId", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) return;
    const reportId = normalizeString(req.params.reportId);
    const previous = billingStore.getWatchtowerReportById(reportId);
    if (!previous) {
      res.status(404).json({ error: "Watchtower taslağı bulunamadı." });
      return;
    }
    if (previous.status === "published") {
      res.status(409).json({ error: "Yayınlanmış kayıt doğrudan düzenlenemez." });
      return;
    }
    const report = applyEditorialChanges(previous, req.body?.report);
    billingStore.upsertWatchtowerReport(report);
    res.status(200).json({ report, reports: billingStore.listWatchtowerReports() });
  });

  router.post("/admin/watchtower/:reportId/publish", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) return;
    const reportId = normalizeString(req.params.reportId);
    const previous = billingStore.getWatchtowerReportById(reportId);
    if (!previous) {
      res.status(404).json({ error: "Watchtower taslağı bulunamadı." });
      return;
    }
    const now = new Date().toISOString();
    const report: WatchtowerReportRecord = {
      ...previous,
      status: "published",
      reviewerEmail: getWeeklyReportAdminEmail(),
      updatedAt: now,
      publishedAt: now,
    };
    billingStore.upsertWatchtowerReport(report);
    res.status(200).json({
      report,
      reports: billingStore.listWatchtowerReports(),
      latestPublished: billingStore.getLatestPublishedWatchtowerReport(report.language),
    });
  });

  return router;
}
