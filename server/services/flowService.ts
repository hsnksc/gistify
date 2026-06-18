import type {
  DailyReportRecord,
  DailyReportSourcePackage,
} from "../../shared/dailyReports";
import type { FlowReportKind, FlowReportSummary } from "../../shared/flow";
import {
  extractFlowTitleInfo,
  inferFlowTickerFromText,
  isBlockedFlowTicker,
  normalizeFlowTicker,
  resolveFlowReportKind,
} from "../../shared/flowInference.ts";
import {
  buildDailyReportRecordFromSource,
  listDailyReportSourcePackages,
} from "../dailyReportSources";

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: unknown) {
  return normalizeString(value).toLowerCase();
}

function getReportAdminEmail() {
  return normalizeEmail(process.env.REPORT_ADMIN_EMAIL || "hsnksc@gmail.com");
}

export function isFlowSourceLabel(value: string) {
  return normalizeString(value).toLowerCase().startsWith("flow/");
}

export function isFlowDailyReport(report: DailyReportRecord) {
  return (
    isFlowSourceLabel(report.content.sourceLabel || "") ||
    normalizeString(report.sourceFolder).toLowerCase().startsWith("flow-")
  );
}

export function buildViewerDailyReportCatalog(
  publishedReports: DailyReportRecord[]
) {
  const publishedBySource = new Map(
    publishedReports
      .filter(report => report.status === "published")
      .sort((left, right) => right.reportDate.localeCompare(left.reportDate))
      .map(report => [report.sourceFolder, report])
  );

  const sourcePackages = listDailyReportSourcePackages();
  const sourcedReports = sourcePackages.map(source => {
    const existing = publishedBySource.get(source.folderName);
    const sourceRecord = buildDailyReportRecordFromSource(
      source,
      existing?.authorEmail || getReportAdminEmail(),
      existing
    );

    if (!existing) {
      return {
        ...sourceRecord,
        status: "published" as const,
        updatedAt: source.updatedAt,
        publishedAt: source.updatedAt,
      };
    }

    return {
      ...sourceRecord,
      id: existing.id,
      slug: existing.slug,
      title: existing.title || sourceRecord.title,
      reportDate: existing.reportDate || sourceRecord.reportDate,
      status: "published" as const,
      authorEmail: existing.authorEmail,
      createdAt: existing.createdAt,
      updatedAt:
        existing.updatedAt > source.updatedAt ? existing.updatedAt : source.updatedAt,
      publishedAt: existing.publishedAt || source.updatedAt,
      content: {
        ...sourceRecord.content,
        headline: normalizeString(existing.content.headline) || sourceRecord.content.headline,
        author: existing.content.author || sourceRecord.content.author,
        coverage: existing.content.coverage || sourceRecord.content.coverage,
        methodology: existing.content.methodology || sourceRecord.content.methodology,
        executiveSummary: existing.content.executiveSummary.length
          ? existing.content.executiveSummary
          : sourceRecord.content.executiveSummary,
      },
    } satisfies DailyReportRecord;
  });

  const sourcedKeys = new Set(sourcePackages.map(source => source.folderName));
  const archivedPublished = publishedReports.filter(
    report => report.sourceFolder && !sourcedKeys.has(report.sourceFolder)
  );

  return [...sourcedReports, ...archivedPublished].sort((left, right) => {
    const byDate = right.reportDate.localeCompare(left.reportDate);
    if (byDate !== 0) {
      return byDate;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

function applyLimit<T>(items: T[], limit?: number) {
  if (typeof limit !== "number") {
    return items;
  }

  return items.slice(0, Math.max(0, limit));
}


function stripHtml(value: string) {
  return normalizeString(value.replace(/<[^>]+>/g, " "));
}

function parseDecimal(value: string) {
  const normalized = value
    .replace(/[^\d,.-]/g, "")
    .replace(/,(?=\d{3}\b)/g, "")
    .replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

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

function extractTitleAndCompany(report: DailyReportRecord, html: string) {
  const htmlTitle = matchFirstGroup(html, [/<title>([^<]+)<\/title>/i]);
  const sourceTitle = htmlTitle || report.title;
  return extractFlowTitleInfo(sourceTitle);
}

function detectExchange(html: string) {
  const text = stripHtml(html);
  const match = text.match(/\b(NASDAQ|NYSE|AMEX|BATS|OTC|BIST)\b/i);
  return normalizeString(match?.[1] || "").toUpperCase();
}

function detectPrice(html: string) {
  const value = matchFirstGroup(html, [
    /id=["']price-counter["'][^>]*>([^<]+)/i,
    /class=["'][^"']*(?:price-counter|current-price|hero-price)[^"']*["'][^>]*>([^<]+)/i,
    /data-price=["']([^"']+)["']/i,
  ]);
  return parseDecimal(value);
}

function detectPriceChangePct(html: string) {
  const value = matchFirstGroup(html, [
    /class=["'][^"']*(?:price-change|price-change-pct|hero-change|change)[^"']*["'][^>]*>([^<]+)/i,
    /data-change=["']([^"']+)["']/i,
  ]);

  if (value) {
    return parseDecimal(value);
  }

  const textMatch = stripHtml(html).match(/[-+]?\d+(?:[.,]\d+)?\s*%/);
  return parseDecimal(textMatch?.[0] || "");
}

function normalizeRecommendation(value: string) {
  const normalized = normalizeString(value).toLowerCase();
  if (!normalized) {
    return null;
  }

  if (
    /\b(strong buy|moderate buy|buy|bullish|al)\b/.test(normalized) &&
    !/\b(sell|sat)\b/.test(normalized)
  ) {
    return "BUY";
  }

  if (/\b(hold|neutral|tut)\b/.test(normalized)) {
    return "HOLD";
  }

  if (/\b(strong sell|moderate sell|sell|bearish|sat)\b/.test(normalized)) {
    return "SELL";
  }

  return null;
}

function detectRecommendation(html: string) {
  const recommendationBlock = matchFirstGroup(html, [
    /id=["']recommendation["'][^>]*>([\s\S]{0,2000})<\/section>/i,
    /id=["']recommendation["'][^>]*>([\s\S]{0,2000})<\/div>/i,
  ]);

  return (
    normalizeRecommendation(stripHtml(recommendationBlock)) ||
    normalizeRecommendation(stripHtml(html))
  );
}

function extractFirstMeaningfulParagraph(html: string): string {
  const text = stripHtml(html);
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 24);
  return paragraphs[0] || "";
}

function collectSections(html: string) {
  const ids = Array.from(
    html.matchAll(/(?:id|href)=["']#?([a-z0-9_-]+)["']/gi)
  ).map(match => normalizeString(match[1]).toLowerCase());

  return Array.from(
    new Set(
      ids.filter(id =>
        [
          "fundamentals",
          "technical",
          "news",
          "analysts",
          "risk",
          "recommendation",
          "options",
        ].includes(id)
      )
    )
  );
}

function detectContentFormat(report: DailyReportRecord) {
  const html = normalizeString(report.content.html || "");
  return report.content.contentFormat === "html" || (html && !report.content.markdown)
    ? "html"
    : "markdown";
}

function detectFlowReportKind(
  report: DailyReportRecord,
  html: string
): FlowReportKind {
  const htmlTitle = matchFirstGroup(html, [/<title>([^<]+)<\/title>/i]);

  return resolveFlowReportKind({
    title: report.title,
    htmlTitle,
    tickerUniverse: report.content.tickerUniverse,
    candidates: [
      report.slug,
      report.sourceFolder,
      report.content.sourceLabel || "",
      report.content.headline || "",
      report.content.coverage || "",
    ],
  });
}

function buildFlowReportSummary(report: DailyReportRecord): FlowReportSummary {
  const html = report.content.html || "";
  const contentFormat = detectContentFormat(report);
  const reportKind = detectFlowReportKind(report, html);
  const titleInfo =
    reportKind === "daily"
      ? {
          companyName: normalizeString(report.title) || "Market report",
          ticker: "MARKET",
        }
      : extractTitleAndCompany(report, html);
  const tickerUniverse = Array.isArray(report.content.tickerUniverse)
    ? report.content.tickerUniverse
        .map(item => normalizeFlowTicker(item))
        .filter(item => item && !isBlockedFlowTicker(item))
    : [];
  const ticker =
    (reportKind === "daily" ? "MARKET" : "") ||
    tickerUniverse[0] ||
    titleInfo.ticker ||
    inferFlowTickerFromText(
      report.content.coverage || "",
      report.title,
      report.content.sourceLabel || "",
      report.sourceFolder,
      report.slug
    ) ||
    normalizeFlowTicker(report.id) ||
    "FLOW";
  const sourceLabel =
    normalizeString(report.content.sourceLabel) ||
    normalizeString(report.sourceFolder) ||
    "Flow source";
  const previewText =
    normalizeString(report.content.headline) ||
    normalizeString(report.content.executiveSummary[0] || "") ||
    (contentFormat === "html"
      ? normalizeString(extractFirstMeaningfulParagraph(html))
      : "") ||
    normalizeString(report.content.coverage || "") ||
    report.title;

  return {
    companyName: titleInfo.companyName,
    contentFormat,
    exchange: contentFormat === "html" ? detectExchange(html) : "",
    figureCount: Array.isArray(report.content.figureFiles)
      ? report.content.figureFiles.length
      : 0,
    hasCharts:
      contentFormat === "html"
        ? /<canvas|Chart\.js|new\s+Chart\s*\(/i.test(html)
        : false,
    headline: normalizeString(report.content.headline),
    id: report.id,
    previewText,
    price: contentFormat === "html" ? detectPrice(html) : null,
    priceChangePct: contentFormat === "html" ? detectPriceChangePct(html) : null,
    recommendation: contentFormat === "html" ? detectRecommendation(html) : null,
    reportDate: report.reportDate,
    reportKind,
    researchFileCount:
      typeof report.content.researchFileCount === "number"
        ? report.content.researchFileCount
        : 0,
    sections: contentFormat === "html" ? collectSections(html) : [],
    slug: report.slug,
    sourceFolder: report.sourceFolder,
    sourceLabel,
    ticker,
    tickerUniverse,
    title: report.title,
    updatedAt: report.updatedAt,
  };
}

export function getViewerDailyReports(
  publishedReports: DailyReportRecord[],
  limit?: number
) {
  return applyLimit(
    buildViewerDailyReportCatalog(publishedReports).filter(
      report => !isFlowDailyReport(report)
    ),
    limit
  );
}

export function getViewerFlowReports(
  publishedReports: DailyReportRecord[],
  options: {
    limit?: number;
    reportKind?: FlowReportKind;
    sourceLabel?: string;
  } = {}
) {
  const normalizedSourceLabel = normalizeString(options.sourceLabel).toLowerCase();
  const filtered = buildViewerDailyReportCatalog(publishedReports).filter(report => {
    if (!isFlowDailyReport(report)) {
      return false;
    }

    if (!normalizedSourceLabel) {
      return !options.reportKind || detectFlowReportKind(report, report.content.html || "") === options.reportKind;
    }

    const reportSourceLabel = normalizeString(report.content.sourceLabel).toLowerCase();
    if (reportSourceLabel !== normalizedSourceLabel) {
      return false;
    }

    return !options.reportKind || detectFlowReportKind(report, report.content.html || "") === options.reportKind;
  });

  return applyLimit(filtered, options.limit);
}

export function getViewerFlowReportSummaries(
  publishedReports: DailyReportRecord[],
  options: {
    limit?: number;
    reportKind?: FlowReportKind;
    sourceLabel?: string;
  } = {}
) {
  return getViewerFlowReports(publishedReports, options).map(buildFlowReportSummary);
}

export function getViewerFlowReportById(
  publishedReports: DailyReportRecord[],
  reportId: string
) {
  const normalizedReportId = normalizeString(reportId);
  return (
    buildViewerDailyReportCatalog(publishedReports).find(
      report => report.id === normalizedReportId && isFlowDailyReport(report)
    ) || null
  );
}

function filterSourcePackages(
  predicate: (source: DailyReportSourcePackage) => boolean
) {
  return listDailyReportSourcePackages().filter(predicate);
}

export function getDailyReportSourcePackages() {
  return filterSourcePackages(
    source => !isFlowSourceLabel(source.sourceLabel || source.folderName)
  );
}

export function getFlowReportSourcePackages() {
  return filterSourcePackages(source =>
    isFlowSourceLabel(source.sourceLabel || source.folderName)
  );
}
