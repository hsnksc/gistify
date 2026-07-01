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

import {
  buildViewerDailyReportCatalog,
  getViewerFlowReportById,
  getViewerFlowReportSummaries,
} from "../../server/services/flowService";

function createSourcePackage(
  overrides: Partial<DailyReportSourcePackage> = {}
): DailyReportSourcePackage {
  return {
    id: "source-1",
    folderName: "source-1",
    reportDate: "2026-06-29",
    title: "Source Title",
    headline: "Source Headline",
    metadataItems: [],
    executiveSummary: ["Source summary"],
    markdown: "# Source",
    html: "",
    sectionFiles: [],
    figureFiles: [],
    openAiFigureFiles: [],
    tickerUniverse: ["MARKET"],
    researchFileCount: 0,
    updatedAt: "2026-06-29T10:15:00.000Z",
    sourceKind: "file",
    contentFormat: "markdown",
    sourceLabel: "daily/source-1.md",
    assetBasePath: "",
    ...overrides,
  };
}

function createReport(
  overrides: Partial<DailyReportRecord> = {}
): DailyReportRecord {
  return {
    id: "daily-report-source-1",
    slug: "source-1",
    title: "Published Title",
    reportDate: "2026-06-20",
    status: "published",
    authorEmail: "author@example.com",
    sourceFolder: "source-1",
    createdAt: "2026-06-20T09:00:00.000Z",
    updatedAt: "2026-06-30T09:00:00.000Z",
    publishedAt: "2026-06-20T09:00:00.000Z",
    content: {
      headline: "Published Headline",
      executiveSummary: ["Published summary"],
      markdown: "# Published",
      html: "",
      sectionFiles: [],
      figureFiles: [],
      openAiFigureFiles: [],
      tickerUniverse: ["MARKET"],
      researchFileCount: 0,
      sourceKind: "file",
      contentFormat: "markdown",
      sourceLabel: "daily/source-1.md",
      assetBasePath: "",
    },
    ...overrides,
  };
}

describe("flow service timestamps smoke", () => {
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
        createdAt: previousRecord?.createdAt || "2026-06-29T10:00:00.000Z",
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

  it("uses the live flow file timestamp for sourced flow reports", () => {
    mockedSourcePackages = [
      createSourcePackage({
        folderName: "flow-source-1",
        sourceLabel: "flow/daily-source-1.html",
        updatedAt: "2026-06-29T10:15:00.000Z",
      }),
    ];

    const catalog = buildViewerDailyReportCatalog([
      createReport({
        sourceFolder: "flow-source-1",
        updatedAt: "2026-06-30T09:00:00.000Z",
        content: {
          headline: "Published Headline",
          executiveSummary: ["Published summary"],
          markdown: "# Published",
          html: "",
          sectionFiles: [],
          figureFiles: [],
          openAiFigureFiles: [],
          tickerUniverse: ["MARKET"],
          researchFileCount: 0,
          sourceKind: "file",
          contentFormat: "markdown",
          sourceLabel: "flow/daily-source-1.html",
          assetBasePath: "",
        },
      }),
    ]);

    expect(catalog).toHaveLength(1);
    expect(catalog[0]?.updatedAt).toBe("2026-06-29T10:15:00.000Z");
  });

  it("exposes publishedAt in flow summaries and falls back to the live source timestamp", () => {
    mockedSourcePackages = [
      createSourcePackage({
        folderName: "flow-source-1",
        sourceLabel: "flow/daily-source-1.html",
        updatedAt: "2026-06-29T10:15:00.000Z",
      }),
    ];

    const withExistingPublishedAt = getViewerFlowReportSummaries([
      createReport({
        sourceFolder: "flow-source-1",
        publishedAt: "2026-06-20T09:00:00.000Z",
        content: {
          headline: "Published Headline",
          executiveSummary: ["Published summary"],
          markdown: "# Published",
          html: "",
          sectionFiles: [],
          figureFiles: [],
          openAiFigureFiles: [],
          tickerUniverse: ["MARKET"],
          researchFileCount: 0,
          sourceKind: "file",
          contentFormat: "markdown",
          sourceLabel: "flow/daily-source-1.html",
          assetBasePath: "",
        },
      }),
    ]);

    expect(withExistingPublishedAt[0]?.publishedAt).toBe(
      "2026-06-20T09:00:00.000Z"
    );

    const withoutExistingPublishedAt = getViewerFlowReportSummaries([]);
    expect(withoutExistingPublishedAt[0]?.publishedAt).toBe(
      "2026-06-29T10:15:00.000Z"
    );
  });

  it("orders flow summaries by creation timestamp instead of reportDate", () => {
    mockedSourcePackages = [
      createSourcePackage({
        id: "flow-source-a",
        folderName: "flow-source-a",
        title: "Older report date newer post",
        reportDate: "2026-06-20",
        sourceLabel: "flow/post-a.html",
        updatedAt: "2026-06-29T10:15:00.000Z",
      }),
      createSourcePackage({
        id: "flow-source-b",
        folderName: "flow-source-b",
        title: "Newer report date older post",
        reportDate: "2026-06-29",
        sourceLabel: "flow/post-b.html",
        updatedAt: "2026-06-29T10:10:00.000Z",
      }),
    ];

    const summaries = getViewerFlowReportSummaries([
      createReport({
        id: "flow-report-a",
        slug: "flow-report-a",
        title: "Older report date newer post",
        reportDate: "2026-06-20",
        sourceFolder: "flow-source-a",
        publishedAt: "2026-06-29T12:00:00.000Z",
        updatedAt: "2026-06-29T12:05:00.000Z",
        content: {
          headline: "Published Headline",
          executiveSummary: ["Published summary"],
          markdown: "# Published",
          html: "",
          sectionFiles: [],
          figureFiles: [],
          openAiFigureFiles: [],
          tickerUniverse: ["MARKET"],
          researchFileCount: 0,
          sourceKind: "file",
          contentFormat: "markdown",
          sourceLabel: "flow/post-a.html",
          assetBasePath: "",
        },
      }),
      createReport({
        id: "flow-report-b",
        slug: "flow-report-b",
        title: "Newer report date older post",
        reportDate: "2026-06-29",
        sourceFolder: "flow-source-b",
        publishedAt: "2026-06-29T11:00:00.000Z",
        updatedAt: "2026-06-29T11:05:00.000Z",
        content: {
          headline: "Published Headline",
          executiveSummary: ["Published summary"],
          markdown: "# Published",
          html: "",
          sectionFiles: [],
          figureFiles: [],
          openAiFigureFiles: [],
          tickerUniverse: ["MARKET"],
          researchFileCount: 0,
          sourceKind: "file",
          contentFormat: "markdown",
          sourceLabel: "flow/post-b.html",
          assetBasePath: "",
        },
      }),
    ]);

    expect(summaries.map(report => report.id)).toEqual([
      "flow-report-a",
      "flow-report-b",
    ]);
  });

  it("keeps the previous max-updatedAt behavior for non-flow reports", () => {
    mockedSourcePackages = [
      createSourcePackage({
        folderName: "daily-source-1",
        sourceLabel: "daily/source-1.md",
        updatedAt: "2026-06-29T10:15:00.000Z",
      }),
    ];

    const catalog = buildViewerDailyReportCatalog([
      createReport({
        sourceFolder: "daily-source-1",
        updatedAt: "2026-06-30T09:00:00.000Z",
      }),
    ]);

    expect(catalog).toHaveLength(1);
    expect(catalog[0]?.updatedAt).toBe("2026-06-30T09:00:00.000Z");
  });

  it("keeps only the canonical ISO-dated flow duplicate in the viewer catalog", () => {
    mockedSourcePackages = [
      createSourcePackage({
        folderName: "flow-iso",
        title: "Yapay Zekada Para Nerede?",
        reportDate: "2026-06-29",
        sourceLabel: "flow/daily-ai-yatirim-donguleri-2026-06-29.html",
        updatedAt: "2026-06-29T10:15:00.000Z",
        html: '<div class="section-head"></div><div class="section-body"></div>',
        markdown: "",
        contentFormat: "html",
      }),
      createSourcePackage({
        folderName: "flow-localized",
        title: "Yapay Zekada Para Nerede?",
        reportDate: "2026-06-29",
        sourceLabel: "flow/daily-ai-yatirim-donguleri-29-haziran-2026.html",
        updatedAt: "2026-06-29T11:15:00.000Z",
        html: '<div class="lang-content"></div><script>switchLang("tr")</script>',
        markdown: "",
        contentFormat: "html",
      }),
    ];

    const catalog = buildViewerDailyReportCatalog([]);

    expect(catalog).toHaveLength(1);
    expect(catalog[0]?.sourceFolder).toBe("flow-iso");
    expect(catalog[0]?.content.sourceLabel).toBe(
      "flow/daily-ai-yatirim-donguleri-2026-06-29.html"
    );
  });

  it("maps a stale duplicate flow report id back to the canonical live source", () => {
    mockedSourcePackages = [
      createSourcePackage({
        folderName: "flow-iso",
        title: "Yapay Zekada Para Nerede?",
        reportDate: "2026-06-29",
        sourceLabel: "flow/daily-ai-yatirim-donguleri-2026-06-29.html",
        updatedAt: "2026-06-29T10:15:00.000Z",
        html: '<div class="section-head"></div><div class="section-body"></div>',
        markdown: "",
        contentFormat: "html",
      }),
    ];

    const staleDuplicate = createReport({
      id: "daily-report-flow-localized",
      slug: "daily-report-flow-daily-ai-yatirim-donguleri-29-haziran-2026",
      title: "Yapay Zekada Para Nerede?",
      reportDate: "2026-06-29",
      sourceFolder: "flow-localized",
      updatedAt: "2026-06-29T11:15:00.000Z",
      content: {
        headline: "Published Headline",
        executiveSummary: ["Published summary"],
        markdown: "",
        html: '<div class="lang-content"></div><script>switchLang("tr")</script>',
        sectionFiles: [],
        figureFiles: [],
        openAiFigureFiles: [],
        tickerUniverse: ["MARKET"],
        researchFileCount: 0,
        sourceKind: "file",
        contentFormat: "html",
        sourceLabel: "flow/daily-ai-yatirim-donguleri-29-haziran-2026.html",
        assetBasePath: "",
      },
    });

    const resolved = getViewerFlowReportById(
      [staleDuplicate],
      "daily-report-flow-localized"
    );

    expect(resolved?.id).toBe("daily-report-flow-iso");
    expect(resolved?.content.sourceLabel).toBe(
      "flow/daily-ai-yatirim-donguleri-2026-06-29.html"
    );
  });
});
