import type {
  DailyReportRecord,
  DailyReportSourcePackage,
} from "../../shared/dailyReports";
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
