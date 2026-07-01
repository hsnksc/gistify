import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  DailyReportRecord,
  DailyReportSourcePackage,
} from "../../shared/dailyReports";

let mockedSourcePackages: DailyReportSourcePackage[] = [];
const mockBuildDailyReportRecordFromSource = vi.fn<
  (
    source: DailyReportSourcePackage,
    authorEmail: string,
    previousRecord?: DailyReportRecord | null
  ) => DailyReportRecord
>();

vi.mock("../../server/dailyReportSources", () => ({
  buildDailyReportRecordFromSource: (
    source: DailyReportSourcePackage,
    authorEmail: string,
    previousRecord?: DailyReportRecord | null
  ) =>
    mockBuildDailyReportRecordFromSource(source, authorEmail, previousRecord),
  listDailyReportSourcePackages: () => mockedSourcePackages,
}));

import { syncPublishedFlowReportsToArchive } from "../../server/services/flowArchiveSync";

function createSourcePackage(
  overrides: Partial<DailyReportSourcePackage> = {}
): DailyReportSourcePackage {
  return {
    id: "flow-source-1",
    folderName: "flow-source-1",
    reportDate: "2026-06-29",
    title: "Flow Source Title",
    headline: "Flow Source Headline",
    metadataItems: [],
    executiveSummary: ["Flow source summary"],
    markdown: "# Flow source",
    html: "",
    sectionFiles: [],
    figureFiles: [],
    openAiFigureFiles: [],
    tickerUniverse: ["MARKET"],
    researchFileCount: 0,
    updatedAt: "2026-06-29T12:00:00.000Z",
    sourceKind: "file",
    contentFormat: "markdown",
    sourceLabel: "flow/source-1.md",
    assetBasePath: "",
    ...overrides,
  };
}

function createReport(
  overrides: Partial<DailyReportRecord> = {}
): DailyReportRecord {
  return {
    id: "daily-report-flow-source-1",
    slug: "flow-source-1",
    title: "Stored Flow Title",
    reportDate: "2026-06-29",
    status: "published",
    authorEmail: "author@example.com",
    sourceFolder: "flow-source-1",
    createdAt: "2026-06-29T10:00:00.000Z",
    updatedAt: "2026-06-29T11:00:00.000Z",
    publishedAt: "2026-06-29T10:00:00.000Z",
    content: {
      headline: "Stored Flow Headline",
      executiveSummary: ["Stored summary"],
      markdown: "# Stored",
      html: "",
      sectionFiles: [],
      figureFiles: [],
      openAiFigureFiles: [],
      tickerUniverse: ["MARKET"],
      researchFileCount: 0,
      sourceKind: "file",
      contentFormat: "markdown",
      sourceLabel: "flow/source-1.md",
      assetBasePath: "",
    },
    ...overrides,
  };
}

describe("flow archive sync smoke", () => {
  beforeEach(() => {
    mockedSourcePackages = [];
    mockBuildDailyReportRecordFromSource.mockReset();
    mockBuildDailyReportRecordFromSource.mockImplementation(
      (source, authorEmail, previousRecord) => ({
        id: previousRecord?.id || `daily-report-${source.folderName}`,
        slug: previousRecord?.slug || source.folderName,
        title: source.title,
        reportDate: source.reportDate,
        status: previousRecord?.status || "draft",
        authorEmail,
        sourceFolder: source.folderName,
        createdAt: previousRecord?.createdAt || "2026-06-29T09:00:00.000Z",
        updatedAt: "2099-01-01T00:00:00.000Z",
        publishedAt: previousRecord?.publishedAt,
        content: {
          headline: source.headline,
          executiveSummary: source.executiveSummary,
          markdown: source.markdown,
          html: source.html,
          sectionFiles: source.sectionFiles,
          figureFiles: source.figureFiles,
          openAiFigureFiles: source.openAiFigureFiles,
          tickerUniverse: source.tickerUniverse,
          researchFileCount: source.researchFileCount,
          sourceKind: source.sourceKind,
          contentFormat: source.contentFormat,
          sourceLabel: source.sourceLabel,
          assetBasePath: source.assetBasePath,
        },
      })
    );
  });

  it("archives live flow sources as published records", () => {
    const upsertDailyReport = vi.fn();
    mockedSourcePackages = [createSourcePackage()];

    syncPublishedFlowReportsToArchive(
      {
        listDailyReports: () => [],
        upsertDailyReport,
      },
      "admin@example.com"
    );

    expect(upsertDailyReport).toHaveBeenCalledTimes(1);
    expect(upsertDailyReport).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "published",
        updatedAt: "2026-06-29T12:00:00.000Z",
        publishedAt: "2026-06-29T12:00:00.000Z",
        sourceFolder: "flow-source-1",
      })
    );
  });

  it("skips already-synced published flow records", () => {
    const upsertDailyReport = vi.fn();
    mockedSourcePackages = [createSourcePackage()];

    syncPublishedFlowReportsToArchive(
      {
        listDailyReports: () =>
          [
            createReport({
              updatedAt: "2026-06-29T12:00:00.000Z",
            }),
          ] satisfies DailyReportRecord[],
        upsertDailyReport,
      },
      "admin@example.com"
    );

    expect(upsertDailyReport).not.toHaveBeenCalled();
  });

  it("refreshes stale flow report dates and publishedAt values from the live source", () => {
    const upsertDailyReport = vi.fn();
    mockedSourcePackages = [
      createSourcePackage({
        reportDate: "2026-06-29",
        updatedAt: "2026-06-29T12:00:00.000Z",
      }),
    ];

    syncPublishedFlowReportsToArchive(
      {
        listDailyReports: () =>
          [
            createReport({
              reportDate: "2026-06-17",
              updatedAt: "2026-06-20T11:00:00.000Z",
              publishedAt: "2026-06-20T10:00:00.000Z",
            }),
          ] satisfies DailyReportRecord[],
        upsertDailyReport,
      },
      "admin@example.com"
    );

    expect(upsertDailyReport).toHaveBeenCalledTimes(1);
    expect(upsertDailyReport).toHaveBeenCalledWith(
      expect.objectContaining({
        reportDate: "2026-06-29",
        updatedAt: "2026-06-29T12:00:00.000Z",
        publishedAt: "2026-06-29T12:00:00.000Z",
      })
    );
  });
});
