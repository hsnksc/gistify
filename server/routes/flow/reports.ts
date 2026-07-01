import { Router, type Response } from "express";
import type { DailyReportLanguage, DailyReportRecord } from "../../../shared/dailyReports";
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

function matchFirstGroup(value: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = value.match(pattern);
    const next = normalizeString(match?.[1] || "");
    if (next) {
      return next;
    }
  }
  return "";
}

function stripHtml(value: string) {
  return normalizeString(value.replace(/<[^>]+>/g, " "));
}

function translateReport(report: DailyReportRecord, lang: string): DailyReportRecord {
  if (lang !== "en") {
    return report;
  }

  if (report.content.translations?.en) {
    const enHtml = report.content.translations.en;
    const enTitle = matchFirstGroup(enHtml, [/<title>([^<]+)<\/title>/i]);
    const enH1Raw = matchFirstGroup(enHtml, [/<h1[^>]*>([\s\S]*?)<\/h1>/i]);
    const enHeadline = normalizeString(
      matchFirstGroup(enHtml, [/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i]) ||
      (enH1Raw ? stripHtml(enH1Raw) : "")
    );
    return {
      ...report,
      title: enTitle || report.title,
      content: {
        ...report.content,
        html: report.content.contentFormat === "html" ? report.content.translations.en : report.content.html,
        markdown: report.content.contentFormat === "markdown" ? report.content.translations.en : report.content.markdown,
        headline: enHeadline || report.content.headline,
        language: "en" as DailyReportLanguage,
      },
    };
  }

  if (report.content.availableLanguages?.includes("en")) {
    const html = report.content.html || "";
    const inlineEnH1 = matchFirstGroup(html, [/<h1(?=[^>]*\bdata-lang=["']en["'])[^>]*>([\s\S]*?)<\/h1>/i]);
    const inlineEnDesc = matchFirstGroup(html, [
      /<p(?=[^>]*\bdata-lang=["']en["'])(?=[^>]*\bclass=["'][^"']*\bhero-desc\b[^"']*["'])[^>]*>([\s\S]*?)<\/p>/i,
      /<p(?=[^>]*\bclass=["'][^"']*\bhero-desc\b[^"']*["'])(?=[^>]*\bdata-lang=["']en["'])[^>]*>([\s\S]*?)<\/p>/i,
    ]);
    const inlineEnTitle = inlineEnH1 ? stripHtml(inlineEnH1) : "";
    const inlineEnHeadline = inlineEnDesc ? stripHtml(inlineEnDesc) : "";

    if (inlineEnTitle || inlineEnHeadline) {
      return {
        ...report,
        title: inlineEnTitle || report.title,
        content: {
          ...report.content,
          headline: inlineEnHeadline || report.content.headline,
          language: "en" as DailyReportLanguage,
        },
      };
    }
  }

  return report;
}

  router.get("/", (req, res) => {
    setPrivateNoStore(res);
    const lang = normalizeString(req.query.lang).toLowerCase();
    const reports = getViewerFlowReports(getPublishedReports(), {
      limit: normalizeLimit(req.query.limit),
      reportKind: normalizeReportKind(req.query.type),
      sourceLabel: normalizeString(req.query.source),
    });

    const translatedReports = reports.map(report => translateReport(report, lang));

    const payload: FlowReportsResponse = { reports: translatedReports };
    res.status(200).json(payload);
  });

  router.get("/summary", (req, res) => {
    setPrivateNoStore(res);
    const lang = normalizeString(req.query.lang).toLowerCase();
    const payload: FlowReportSummariesResponse = {
      reports: getViewerFlowReportSummaries(getPublishedReports(), {
        limit: normalizeLimit(req.query.limit),
        reportKind: normalizeReportKind(req.query.type),
        sourceLabel: normalizeString(req.query.source),
        lang,
      }),
    };

    res.status(200).json(payload);
  });

  router.get("/latest", (req, res) => {
    setPrivateNoStore(res);
    const lang = normalizeString(req.query.lang).toLowerCase();
    const report = getViewerFlowReports(getPublishedReports(), {
      limit: 1,
      reportKind: normalizeReportKind(req.query.type),
    })[0] || null;

    const payload: FlowReportResponse = {
      report: report ? translateReport(report, lang) : null,
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

    const lang = normalizeString(req.query.lang).toLowerCase();
    const translatedReport = translateReport(report, lang);

    const payload: FlowReportResponse = { report: translatedReport };
    res.status(200).json(payload);
  });

  return router;
}
