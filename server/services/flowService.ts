import type {
  DailyReportRecord,
  DailyReportSourcePackage,
} from "../../shared/dailyReports";
import type { FlowReportSummary } from "../../shared/flow";
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

function normalizeTickerToken(value: string) {
  return normalizeString(value).toUpperCase().replace(/[^A-Z0-9.-]/g, "");
}

const BLOCKED_FLOW_TICKERS = new Set([
  "ABD",
  "AI",
  "EN",
  "HTML",
  "PDF",
  "REPORT",
  "TR",
]);

const FLOW_TICKER_ALIASES: Array<{
  ticker: string;
  patterns: RegExp[];
}> = [
  { ticker: "META", patterns: [/\bmeta platforms?\b/i, /\bmeta\b/i] },
  { ticker: "HOOD", patterns: [/\brobinhood\b/i] },
  { ticker: "PLTR", patterns: [/\bpalantir\b/i] },
  { ticker: "WDC", patterns: [/\bwestern digital\b/i] },
  { ticker: "INTC", patterns: [/\bintel\b/i] },
  {
    ticker: "MARKET",
    patterns: [
      /\babd borsalar[ıi]\b/i,
      /\bus markets?\b/i,
      /\bpre-market\b/i,
      /\bmomentum analizi\b/i,
    ],
  },
];

function isBlockedFlowTicker(value: string) {
  const normalized = normalizeTickerToken(value);
  return !normalized || BLOCKED_FLOW_TICKERS.has(normalized);
}

function inferTickerFromText(value: string) {
  const source = normalizeString(value);
  if (!source) {
    return "";
  }

  for (const alias of FLOW_TICKER_ALIASES) {
    if (alias.patterns.some(pattern => pattern.test(source))) {
      return alias.ticker;
    }
  }

  const patterns = [
    /\(([A-Z][A-Z0-9.-]{0,9})\)/,
    /^\s*([A-Z][A-Z0-9.-]{0,9})(?=\s*[—\-·:|])/,
    /\bTicker\s*[:\-]\s*([A-Z][A-Z0-9.-]{0,9})\b/i,
    /\$([A-Z][A-Z0-9.-]{0,9})\b/,
    /(?:^|[-_/])([a-z]{1,8})(?=\d{6,8}(?:$|[-_.]))/i,
  ];

  for (const pattern of patterns) {
    const match = source.match(pattern);
    const normalized = normalizeTickerToken(match?.[1] || "");
    if (normalized && !isBlockedFlowTicker(normalized)) {
      return normalized;
    }
  }

  return "";
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
  const titleMatch = sourceTitle.match(
    /^([A-Z0-9.-]{1,10})\s*[—-]\s*(.+?)(?:\s+Advanced\s+Analysis\s+Report)?$/i
  );

  if (titleMatch) {
    return {
      companyName: normalizeString(titleMatch[2]),
      ticker: normalizeTickerToken(titleMatch[1]),
    };
  }

  return {
    companyName: normalizeString(
      sourceTitle.replace(/^[A-Z0-9.-]+\s*[—-]?\s*/i, "")
    ),
    ticker: inferTickerFromText(sourceTitle),
  };
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

function buildFlowReportSummary(report: DailyReportRecord): FlowReportSummary {
  const html = report.content.html || "";
  const contentFormat = detectContentFormat(report);
  const titleInfo = extractTitleAndCompany(report, html);
  const tickerUniverse = Array.isArray(report.content.tickerUniverse)
    ? report.content.tickerUniverse
        .map(item => normalizeTickerToken(item))
        .filter(item => item && !isBlockedFlowTicker(item))
    : [];
  const ticker =
    tickerUniverse[0] ||
    titleInfo.ticker ||
    inferTickerFromText(report.content.coverage || "") ||
    inferTickerFromText(report.title) ||
    inferTickerFromText(report.content.sourceLabel || "") ||
    inferTickerFromText(report.sourceFolder) ||
    inferTickerFromText(report.slug) ||
    normalizeTickerToken(report.id) ||
    "FLOW";
  const sourceLabel =
    normalizeString(report.content.sourceLabel) ||
    normalizeString(report.sourceFolder) ||
    "Flow source";
  const previewText =
    normalizeString(report.content.headline) ||
    normalizeString(report.content.executiveSummary[0] || "") ||
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
    sourceLabel?: string;
  } = {}
) {
  const normalizedSourceLabel = normalizeString(options.sourceLabel).toLowerCase();
  const filtered = buildViewerDailyReportCatalog(publishedReports).filter(report => {
    if (!isFlowDailyReport(report)) {
      return false;
    }

    if (!normalizedSourceLabel) {
      return true;
    }

    const reportSourceLabel = normalizeString(report.content.sourceLabel).toLowerCase();
    return reportSourceLabel === normalizedSourceLabel;
  });

  return applyLimit(filtered, options.limit);
}

export function getViewerFlowReportSummaries(
  publishedReports: DailyReportRecord[],
  options: {
    limit?: number;
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
