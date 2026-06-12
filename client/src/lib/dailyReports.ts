import type {
  DailyReportRecord,
  DailyReportSourcePackage,
} from "@shared/dailyReports";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function sortDailyReportsNewestFirst(reports: DailyReportRecord[]) {
  return [...reports].sort((left, right) => {
    const byDate = right.reportDate.localeCompare(left.reportDate);
    if (byDate !== 0) {
      return byDate;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

export function createDailyReportDraftFromSource(
  source: DailyReportSourcePackage,
  authorEmail: string,
  existing?: DailyReportRecord | null
) {
  const nowIso = new Date().toISOString();

  return {
    id: existing?.id || `daily-${source.folderName}`,
    slug: existing?.slug || slugify(`${source.reportDate}-${source.title}`),
    title: source.title,
    reportDate: source.reportDate,
    status: existing?.status || "draft",
    authorEmail: existing?.authorEmail || authorEmail,
    sourceFolder: source.folderName,
    createdAt: existing?.createdAt || nowIso,
    updatedAt: nowIso,
    publishedAt: existing?.publishedAt,
    content: {
      headline: source.headline,
      author: source.author,
      coverage: source.coverage,
      methodology: source.methodology,
      metadataItems: source.metadataItems,
      executiveSummary: source.executiveSummary,
      markdown: source.markdown,
      sectionFiles: source.sectionFiles,
      figureFiles: source.figureFiles,
      openAiFigureFiles: source.openAiFigureFiles,
      tickerUniverse: source.tickerUniverse,
      researchFileCount: source.researchFileCount,
      sourceKind: source.sourceKind,
      sourceLabel: source.sourceLabel,
      assetBasePath: source.assetBasePath,
    },
  } satisfies DailyReportRecord;
}

export function syncDailyReportDraftWithSource(
  report: DailyReportRecord,
  source: DailyReportSourcePackage
) {
  return {
    ...report,
    sourceFolder: source.folderName,
    updatedAt: new Date().toISOString(),
    content: {
      ...report.content,
      markdown: source.markdown,
      sectionFiles: source.sectionFiles,
      figureFiles: source.figureFiles,
      openAiFigureFiles: source.openAiFigureFiles,
      tickerUniverse: source.tickerUniverse,
      researchFileCount: source.researchFileCount,
      sourceKind: source.sourceKind,
      sourceLabel: source.sourceLabel,
      assetBasePath: source.assetBasePath,
      metadataItems: source.metadataItems,
      author: report.content.author || source.author,
      coverage: report.content.coverage || source.coverage,
      methodology: report.content.methodology || source.methodology,
    },
  } satisfies DailyReportRecord;
}

function encodeAssetPath(value: string) {
  return value
    .replace(/\\/g, "/")
    .split("/")
    .map(segment => segment.trim())
    .filter(Boolean)
    .map(segment => encodeURIComponent(segment))
    .join("/");
}

export function getDailyReportAssetUrl(
  assetBasePath: string | undefined,
  fileName: string
) {
  const normalizedFileName = encodeAssetPath(fileName.replace(/^\.\//, ""));
  const normalizedBasePath = encodeAssetPath(assetBasePath || "");

  if (!normalizedBasePath) {
    return `/api/daily-report/assets/${normalizedFileName}`;
  }

  return `/api/daily-report/assets/${normalizedBasePath}/${normalizedFileName}`;
}
