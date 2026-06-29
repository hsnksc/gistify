import type { DailyReportRecord } from "../../shared/dailyReports";
import {
  buildDailyReportRecordFromSource,
  listDailyReportSourcePackages,
} from "../dailyReportSources";

interface FlowArchiveSyncStore {
  listDailyReports: () => DailyReportRecord[];
  upsertDailyReport: (record: DailyReportRecord) => void;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isFlowSourceLabel(value: string) {
  return normalizeString(value).toLowerCase().startsWith("flow/");
}

function isFlowDailyReport(report: DailyReportRecord) {
  return (
    isFlowSourceLabel(report.content.sourceLabel || "") ||
    normalizeString(report.sourceFolder).toLowerCase().startsWith("flow-")
  );
}

export function syncPublishedFlowReportsToArchive(
  billingStore: FlowArchiveSyncStore,
  authorEmail: string
) {
  const allReports = billingStore.listDailyReports();
  const existingBySource = new Map(
    allReports
      .filter(isFlowDailyReport)
      .map(report => [report.sourceFolder, report])
  );

  const flowSources = listDailyReportSourcePackages().filter(source =>
    isFlowSourceLabel(source.sourceLabel || source.folderName)
  );

  for (const source of flowSources) {
    const previousRecord = existingBySource.get(source.folderName);
    if (
      previousRecord?.status === "published" &&
      previousRecord.updatedAt === source.updatedAt
    ) {
      continue;
    }

    const sourceRecord = buildDailyReportRecordFromSource(
      source,
      previousRecord?.authorEmail || authorEmail,
      previousRecord
    );

    billingStore.upsertDailyReport({
      ...sourceRecord,
      id: previousRecord?.id || sourceRecord.id,
      slug: previousRecord?.slug || sourceRecord.slug,
      title: previousRecord?.title || sourceRecord.title,
      reportDate: previousRecord?.reportDate || sourceRecord.reportDate,
      status: "published",
      authorEmail: previousRecord?.authorEmail || sourceRecord.authorEmail,
      createdAt: previousRecord?.createdAt || sourceRecord.createdAt,
      updatedAt: source.updatedAt,
      publishedAt: previousRecord?.publishedAt || source.updatedAt,
      content: {
        ...sourceRecord.content,
        headline:
          normalizeString(previousRecord?.content.headline) ||
          sourceRecord.content.headline,
        author: previousRecord?.content.author || sourceRecord.content.author,
        coverage:
          previousRecord?.content.coverage || sourceRecord.content.coverage,
        methodology:
          previousRecord?.content.methodology ||
          sourceRecord.content.methodology,
        executiveSummary: previousRecord?.content.executiveSummary?.length
          ? previousRecord.content.executiveSummary
          : sourceRecord.content.executiveSummary,
      },
    });
  }
}
