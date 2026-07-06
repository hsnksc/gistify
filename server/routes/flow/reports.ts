import crypto from "node:crypto";
import { Router, type Request, type Response } from "express";
import type { DailyReportLanguage, DailyReportRecord } from "../../../shared/dailyReports";
import type {
  FlowReport,
  FlowReportEngagement,
  FlowReportEngagementRequestBody,
  FlowReportEngagementResponse,
  FlowReportResponse,
  FlowReportsResponse,
  FlowReportSummariesResponse,
  FlowReportSummary,
} from "../../../shared/flow";
import {
  getViewerFlowReportById,
  getViewerFlowReports,
  getViewerFlowReportSummaries,
} from "../../services/flowService";

interface FlowReportsRouterDependencies {
  setPrivateNoStore: (res: Response) => void;
  getPublishedReports: () => DailyReportRecord[];
  listEngagementsByReportIds: (
    reportIds: string[]
  ) => Map<string, FlowReportEngagement>;
  recordView: (reportId: string) => FlowReportEngagement;
  recordLike: (reportId: string, liked: boolean) => FlowReportEngagement;
  recordShare: (reportId: string) => FlowReportEngagement;
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

function getEmptyEngagement(): FlowReportEngagement {
  return {
    likeCount: 0,
    readCount: 0,
    shareCount: 0,
  };
}

function attachReportEngagement(
  report: DailyReportRecord,
  engagement: FlowReportEngagement
): FlowReport {
  return {
    ...report,
    engagement,
  };
}

function attachSummaryEngagement(
  summary: FlowReportSummary,
  engagement: FlowReportEngagement
): FlowReportSummary {
  return {
    ...summary,
    engagement,
  };
}

function getEngagement(
  engagementByReportId: Map<string, FlowReportEngagement>,
  reportId: string
) {
  return engagementByReportId.get(reportId) || getEmptyEngagement();
}

function normalizeVisitorId(value: unknown) {
  const normalized = normalizeString(value);
  return /^[a-zA-Z0-9:_-]{8,120}$/.test(normalized) ? normalized : "";
}

function buildFallbackActorKey(req: Request) {
  const userAgent = normalizeString(req.get("user-agent"));
  const digest = crypto
    .createHash("sha256")
    .update(`${req.ip || ""}|${userAgent}`)
    .digest("hex")
    .slice(0, 32);
  return `fingerprint:${digest}`;
}

function getEngagementActorKey(req: Request) {
  const body =
    req.body && typeof req.body === "object"
      ? (req.body as FlowReportEngagementRequestBody)
      : {};
  const visitorId = normalizeVisitorId(body.visitorId);
  return visitorId ? `visitor:${visitorId}` : buildFallbackActorKey(req);
}

export function createFlowReportsRouter({
  setPrivateNoStore,
  getPublishedReports,
  listEngagementsByReportIds,
  recordView,
  recordLike,
  recordShare,
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

function translateReport<T extends DailyReportRecord>(report: T, lang: string): T {
  if (lang !== "en") {
    return report;
  }

  if (report.content.translations?.en) {
    const enContent = report.content.translations.en;
    const isHtml = report.content.contentFormat === "html" || enContent.trim().startsWith("<");
    let enTitle: string;
    let enHeadline: string;
    if (isHtml) {
      enTitle = matchFirstGroup(enContent, [/<title>([^<]+)<\/title>/i]) || stripHtml(matchFirstGroup(enContent, [/<h1[^>]*>([\s\S]*?)<\/h1>/i]));
      enHeadline = normalizeString(
        matchFirstGroup(enContent, [/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i]) ||
        stripHtml(matchFirstGroup(enContent, [/<h1[^>]*>([\s\S]*?)<\/h1>/i]))
      );
    } else {
      // Markdown: frontmatter title or first h1 heading
      enTitle = matchFirstGroup(enContent, [/^title:\s*(.+)$/im]) || matchFirstGroup(enContent, [/^#\s+(.+)$/m]);
      // First meaningful paragraph after title/heading
      const lines = enContent.split("\n");
      let foundHeading = false;
      enHeadline = "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("title:")) {
          if (trimmed.startsWith("#")) foundHeading = true;
          continue;
        }
        if (foundHeading || trimmed.length > 20) {
          enHeadline = trimmed;
          break;
        }
      }
    }
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
    } as T;
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
      } as T;
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
    const engagementByReportId = listEngagementsByReportIds(
      reports.map(report => report.id)
    );

    const translatedReports = reports.map(report =>
      translateReport(
        attachReportEngagement(
          report,
          getEngagement(engagementByReportId, report.id)
        ),
        lang
      )
    );

    const payload: FlowReportsResponse = { reports: translatedReports };
    res.status(200).json(payload);
  });

  router.get("/summary", (req, res) => {
    setPrivateNoStore(res);
    const lang = normalizeString(req.query.lang).toLowerCase();
    const summaries = getViewerFlowReportSummaries(getPublishedReports(), {
      limit: normalizeLimit(req.query.limit),
      reportKind: normalizeReportKind(req.query.type),
      sourceLabel: normalizeString(req.query.source),
      lang,
    });
    const engagementByReportId = listEngagementsByReportIds(
      summaries.map(report => report.id)
    );
    const payload: FlowReportSummariesResponse = {
      reports: summaries.map(summary =>
        attachSummaryEngagement(
          summary,
          getEngagement(engagementByReportId, summary.id)
        )
      ),
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
    const engagementByReportId = report
      ? listEngagementsByReportIds([report.id])
      : new Map<string, FlowReportEngagement>();

    const payload: FlowReportResponse = {
      report: report
        ? translateReport(
            attachReportEngagement(
              report,
              getEngagement(engagementByReportId, report.id)
            ),
            lang
          )
        : null,
    };

    res.status(200).json(payload);
  });

  router.post("/:reportId/engagement/view", (req, res) => {
    setPrivateNoStore(res);

    const report = getViewerFlowReportById(
      getPublishedReports(),
      req.params.reportId
    );

    if (!report) {
      res.status(404).json({ error: "Flow report not found." });
      return;
    }

    const payload: FlowReportEngagementResponse = {
      engagement: recordView(report.id),
    };
    res.status(200).json(payload);
  });

  router.post("/:reportId/engagement/like", (req, res) => {
    setPrivateNoStore(res);

    const report = getViewerFlowReportById(
      getPublishedReports(),
      req.params.reportId
    );

    if (!report) {
      res.status(404).json({ error: "Flow report not found." });
      return;
    }

    const body =
      req.body && typeof req.body === "object"
        ? (req.body as FlowReportEngagementRequestBody)
        : {};
    const payload: FlowReportEngagementResponse = {
      engagement: recordLike(report.id, Boolean(body.liked)),
    };
    res.status(200).json(payload);
  });

  router.post("/:reportId/engagement/share", (req, res) => {
    setPrivateNoStore(res);

    const report = getViewerFlowReportById(
      getPublishedReports(),
      req.params.reportId
    );

    if (!report) {
      res.status(404).json({ error: "Flow report not found." });
      return;
    }

    const payload: FlowReportEngagementResponse = {
      engagement: recordShare(report.id),
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
      res.status(404).json({ error: "Flow report not found." });
      return;
    }

    const lang = normalizeString(req.query.lang).toLowerCase();
    const engagementByReportId = listEngagementsByReportIds([report.id]);
    const translatedReport = translateReport(
      attachReportEngagement(
        report,
        getEngagement(engagementByReportId, report.id)
      ),
      lang
    );

    const payload: FlowReportResponse = { report: translatedReport };
    res.status(200).json(payload);
  });

  return router;
}
