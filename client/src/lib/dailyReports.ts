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
      executiveSummary: source.executiveSummary,
      markdown: source.markdown,
      sectionFiles: source.sectionFiles,
      figureFiles: source.figureFiles,
      tickerUniverse: source.tickerUniverse,
      researchFileCount: source.researchFileCount,
    },
  } satisfies DailyReportRecord;
}

export function getDailyReportAssetUrl(sourceFolder: string, fileName: string) {
  return `/api/daily-report/assets/${encodeURIComponent(sourceFolder)}/${encodeURIComponent(fileName)}`;
}
