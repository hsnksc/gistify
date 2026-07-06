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
  analyzeFlowReportLanguage,
  type FlowReportLanguageMode,
  type FlowReportTranslationState,
} from "../../shared/flowLanguage";
import {
  buildDailyReportRecordFromSource,
  listDailyReportSourcePackages,
} from "../dailyReportSources";

const FLOW_MONTH_TOKEN_PATTERN =
  /(?:^|[-_/])\d{1,2}-(?:january|february|march|april|may|june|july|august|september|october|november|december|ocak|subat|mart|nisan|mayis|haziran|temmuz|agustos|eylul|ekim|kasim|aralik)(?:$|[-_.])/i;
const FLOW_ISO_DATE_TOKEN_PATTERN =
  /(?:^|[-_/])\d{4}-\d{2}-\d{2}(?:$|[-_.])/;

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

function compareViewerDailyReports(
  left: DailyReportRecord,
  right: DailyReportRecord
) {
  const byDate = right.reportDate.localeCompare(left.reportDate);
  if (byDate !== 0) {
    return byDate;
  }

  const byTimestamp = compareTimestampValuesDescending(
    getViewerDailyReportSortTimestamp(left),
    getViewerDailyReportSortTimestamp(right)
  );
  if (byTimestamp !== 0) {
    return byTimestamp;
  }

  const byUpdatedAt = right.updatedAt.localeCompare(left.updatedAt);
  if (byUpdatedAt !== 0) {
    return byUpdatedAt;
  }

  return left.title.localeCompare(right.title);
}

function getViewerDailyReportSortTimestamp(report: DailyReportRecord) {
  if (isFlowDailyReport(report)) {
    return (
      normalizeString(report.publishedAt || report.updatedAt || report.createdAt) ||
      report.reportDate
    );
  }

  return normalizeString(
    report.updatedAt ||
      report.createdAt ||
      report.publishedAt ||
      (report.reportDate ? `${report.reportDate}T00:00:00.000Z` : "")
  );
}

function compareTimestampValuesDescending(left: string, right: string) {
  const leftParsed = Date.parse(left);
  const rightParsed = Date.parse(right);
  const leftHasParsed = Number.isFinite(leftParsed);
  const rightHasParsed = Number.isFinite(rightParsed);

  if (leftHasParsed && rightHasParsed && leftParsed !== rightParsed) {
    return rightParsed - leftParsed;
  }

  if (leftHasParsed !== rightHasParsed) {
    return rightHasParsed ? 1 : -1;
  }

  return right.localeCompare(left);
}

function normalizeFlowDuplicateKeyPart(value: string) {
  return normalizeString(value)
    .toLowerCase()
    .replace(/[ç]/g, "c")
    .replace(/[ğ]/g, "g")
    .replace(/[ı]/g, "i")
    .replace(/[İ]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ş]/g, "s")
    .replace(/[ü]/g, "u")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildFlowDuplicateKey(report: DailyReportRecord) {
  if (!isFlowDailyReport(report)) {
    return "";
  }

  const titleKey = normalizeFlowDuplicateKeyPart(report.title);
  if (!titleKey || !report.reportDate) {
    return "";
  }

  return `${report.reportDate}::${titleKey}`;
}

function scoreFlowDuplicateCandidate(report: DailyReportRecord) {
  const sourceLabel = normalizeString(
    report.content.sourceLabel || report.sourceFolder
  )
  .replace(/\\/g, "/")
  .toLowerCase();
  const html = normalizeString(report.content.html || "");
  let score = 0;

  if (isFlowSourceLabel(sourceLabel)) {
    score += 20;
  }

  if (FLOW_ISO_DATE_TOKEN_PATTERN.test(sourceLabel)) {
    score += 120;
  }

  if (FLOW_MONTH_TOKEN_PATTERN.test(sourceLabel)) {
    score -= 40;
  }

  if (/GISTIFY FLOW|section-head|hero-h|section-body/i.test(html)) {
    score += 60;
  }

  if (/lang-content|switchLang\s*\(/i.test(html)) {
    score -= 15;
  }

  if (report.content.contentFormat === "html") {
    score += 5;
  }

  return score;
}

function comparePreferredFlowDuplicateCandidates(
  left: DailyReportRecord,
  right: DailyReportRecord
) {
  const byScore =
    scoreFlowDuplicateCandidate(right) - scoreFlowDuplicateCandidate(left);
  if (byScore !== 0) {
    return byScore;
  }

  const leftLabel = normalizeString(left.content.sourceLabel || left.sourceFolder);
  const rightLabel = normalizeString(right.content.sourceLabel || right.sourceFolder);
  const bySourceType =
    Number(isFlowSourceLabel(rightLabel)) - Number(isFlowSourceLabel(leftLabel));
  if (bySourceType !== 0) {
    return bySourceType;
  }

  const byUpdatedAt = right.updatedAt.localeCompare(left.updatedAt);
  if (byUpdatedAt !== 0) {
    return byUpdatedAt;
  }

  return rightLabel.localeCompare(leftLabel);
}

function dedupeFlowReports(reports: DailyReportRecord[]) {
  const passthrough: DailyReportRecord[] = [];
  const grouped = new Map<string, DailyReportRecord[]>();

  for (const report of reports) {
    const duplicateKey = buildFlowDuplicateKey(report);
    if (!duplicateKey) {
      passthrough.push(report);
      continue;
    }

    const group = grouped.get(duplicateKey);
    if (group) {
      group.push(report);
    } else {
      grouped.set(duplicateKey, [report]);
    }
  }

  const deduped = [...passthrough];
  for (const group of Array.from(grouped.values())) {
    deduped.push(
      [...group].sort(comparePreferredFlowDuplicateCandidates)[0] || group[0]
    );
  }

  return deduped.sort(compareViewerDailyReports);
}

function buildViewerDailyReportCatalogRaw(
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
    const preferSourceUpdatedAt = isFlowSourceLabel(
      source.sourceLabel || source.folderName
    );
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
      reportDate: preferSourceUpdatedAt
        ? sourceRecord.reportDate
        : existing.reportDate || sourceRecord.reportDate,
      status: "published" as const,
      authorEmail: existing.authorEmail,
      createdAt: preferSourceUpdatedAt
        ? existing.createdAt || source.updatedAt
        : existing.createdAt,
      updatedAt: preferSourceUpdatedAt
        ? source.updatedAt
        : existing.updatedAt > source.updatedAt
          ? existing.updatedAt
          : source.updatedAt,
      publishedAt: preferSourceUpdatedAt
        ? source.updatedAt
        : existing.publishedAt || source.updatedAt,
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

  return [...sourcedReports, ...archivedPublished].sort(compareViewerDailyReports);
}

export function buildViewerDailyReportCatalog(
  publishedReports: DailyReportRecord[]
) {
  return dedupeFlowReports(buildViewerDailyReportCatalogRaw(publishedReports));
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

function extractEnTitle(enContent: string, contentFormat: string): string {
  if (contentFormat === "html" || enContent.trim().startsWith("<")) {
    return (
      matchFirstGroup(enContent, [/<title>([^<]+)<\/title>/i]) ||
      stripHtml(matchFirstGroup(enContent, [/<h1[^>]*>([\s\S]*?)<\/h1>/i]))
    );
  }
  // Markdown: frontmatter title or first h1 heading
  return (
    matchFirstGroup(enContent, [/^title:\s*(.+)$/im]) ||
    matchFirstGroup(enContent, [/^#\s+(.+)$/m])
  );
}

function extractEnHeadline(enContent: string, contentFormat: string): string {
  if (contentFormat === "html" || enContent.trim().startsWith("<")) {
    return (
      normalizeString(
        matchFirstGroup(enContent, [
          /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
        ])
      ) ||
      stripHtml(matchFirstGroup(enContent, [/<h1[^>]*>([\s\S]*?)<\/h1>/i]))
    );
  }
  // Markdown: first meaningful paragraph after title/heading
  const lines = enContent.split("\n");
  let foundHeading = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("title:")) {
      if (trimmed.startsWith("#")) foundHeading = true;
      continue;
    }
    if (foundHeading || trimmed.length > 20) {
      return trimmed;
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

function buildFlowReportSummary(
  report: DailyReportRecord,
  lang?: string
): FlowReportSummary {
  const html = report.content.html || "";
  const contentFormat = detectContentFormat(report);
  const reportKind = detectFlowReportKind(report, html);
  const isEn = lang === "en";
  const enContent = isEn ? report.content.translations?.en : undefined;
  const actualFormat = report.content.contentFormat || contentFormat;
  const enTitle = enContent ? extractEnTitle(enContent, actualFormat) : "";
  const enHeadline = enContent ? extractEnHeadline(enContent, actualFormat) : "";
  const title = (isEn && enTitle) || report.title;
  const headline = (isEn && enHeadline) || report.content.headline;
  const hasEnTranslation = Boolean(report.content.translations?.en);
  const languageInfo = hasEnTranslation
    ? {
        hasLanguageToggle: true,
        languageMode: "bilingual" as FlowReportLanguageMode,
        translationState: "complete" as FlowReportTranslationState,
      }
    : analyzeFlowReportLanguage({
        contentFormat,
        html,
        markdown: report.content.markdown || "",
        sourceFolder: report.sourceFolder,
        sourceLabel: report.content.sourceLabel || "",
        title: report.title,
      });
  const titleInfo =
    reportKind === "daily"
      ? {
          companyName: normalizeString(title) || "Market report",
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
    normalizeString(headline) ||
    normalizeString(report.content.executiveSummary[0] || "") ||
    (contentFormat === "html"
      ? normalizeString(extractFirstMeaningfulParagraph(html))
      : "") ||
    normalizeString(report.content.coverage || "") ||
    title;

  return {
    companyName: titleInfo.companyName,
    contentFormat,
    exchange: contentFormat === "html" ? detectExchange(html) : "",
    engagement: {
      likeCount: 0,
      readCount: 0,
      shareCount: 0,
    },
    figureCount: Array.isArray(report.content.figureFiles)
      ? report.content.figureFiles.length
      : 0,
    hasCharts:
      contentFormat === "html"
        ? /<canvas|Chart\.js|new\s+Chart\s*\(/i.test(html)
        : false,
    headline: normalizeString(headline),
    id: report.id,
    previewText,
    price: contentFormat === "html" ? detectPrice(html) : null,
    priceChangePct: contentFormat === "html" ? detectPriceChangePct(html) : null,
    recommendation: contentFormat === "html" ? detectRecommendation(html) : null,
    reportDate: report.reportDate,
    reportKind,
    languageMode: languageInfo.languageMode,
    translationState: languageInfo.translationState,
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
    title,
    publishedAt: report.publishedAt || report.updatedAt,
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
    lang?: string;
  } = {}
) {
  return getViewerFlowReports(publishedReports, options).map(report =>
    buildFlowReportSummary(report, options.lang)
  );
}

export function getViewerFlowReportById(
  publishedReports: DailyReportRecord[],
  reportId: string
) {
  const normalizedReportId = normalizeString(reportId);
  const catalog = buildViewerDailyReportCatalog(publishedReports);
  const directMatch =
    catalog.find(
      report => report.id === normalizedReportId && isFlowDailyReport(report)
    ) || null;
  if (directMatch) {
    return directMatch;
  }

  const rawCatalog = buildViewerDailyReportCatalogRaw(publishedReports);
  const requestedDuplicate =
    rawCatalog.find(
      report => report.id === normalizedReportId && isFlowDailyReport(report)
    ) || null;
  if (!requestedDuplicate) {
    return null;
  }

  const duplicateKey = buildFlowDuplicateKey(requestedDuplicate);
  if (!duplicateKey) {
    return requestedDuplicate;
  }

  return (
    catalog.find(
      report =>
        isFlowDailyReport(report) &&
        buildFlowDuplicateKey(report) === duplicateKey
    ) || requestedDuplicate
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
