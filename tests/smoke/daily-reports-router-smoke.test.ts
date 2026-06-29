import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { createDailyReportsRouter } from "../../server/routes/dailyReports";
import type { BillingStore } from "../../server/billingStore";
import type {
  DailyReportRecord,
  DailyReportSourcePackage,
} from "../../shared/dailyReports";

function createDailyReport(id: string): DailyReportRecord {
  return {
    id,
    slug: id,
    title: "Smoke Daily Report",
    reportDate: "2026-06-28",
    status: "published",
    authorEmail: "admin@gistify.pro",
    sourceFolder: "source-folder",
    createdAt: "2026-06-28T08:00:00.000Z",
    updatedAt: "2026-06-28T08:00:00.000Z",
    publishedAt: "2026-06-28T08:00:00.000Z",
    content: {
      headline: "Smoke headline",
      author: "Smoke Author",
      coverage: "Macro + equities",
      methodology: "Manual",
      executiveSummary: ["Summary A"],
      markdown: "# Smoke",
      html: "<p>Smoke</p>",
      sectionFiles: ["report.md"],
      figureFiles: ["chart.png"],
      openAiFigureFiles: [],
      tickerUniverse: ["AAPL"],
      researchFileCount: 1,
      sourceKind: "folder",
      contentFormat: "markdown",
      sourceLabel: "Smoke label",
      assetBasePath: "/assets",
    },
  };
}

function createSourcePackage(): DailyReportSourcePackage {
  return {
    id: "source-1",
    folderName: "source-folder",
    reportDate: "2026-06-28",
    title: "Smoke Daily Source",
    headline: "Smoke source headline",
    author: "Smoke Author",
    coverage: "Macro + equities",
    methodology: "Manual",
    metadataItems: [],
    executiveSummary: ["Summary A"],
    markdown: "# Smoke",
    html: "<p>Smoke</p>",
    sectionFiles: ["report.md"],
    figureFiles: ["chart.png"],
    openAiFigureFiles: [],
    tickerUniverse: ["AAPL"],
    researchFileCount: 1,
    updatedAt: "2026-06-28T08:00:00.000Z",
    sourceKind: "folder",
    contentFormat: "markdown",
    sourceLabel: "Smoke label",
    assetBasePath: "/assets",
  };
}

describe("daily reports router smoke", () => {
  let server: ReturnType<express.Express["listen"]> | null = null;

  afterEach(async () => {
    if (!server) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      server?.close(error => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
    server = null;
  });

  it("serves public daily reports and allows admin upserts", async () => {
    const reports = [createDailyReport("daily-report-1")];
    const sourcePackage = createSourcePackage();

    const billingStore = {
      getDailyReportById: (id: string) =>
        reports.find(report => report.id === id) ?? null,
      getLatestPublishedDailyReport: () =>
        reports.find(report => report.status === "published") ?? null,
      listDailyReports: () => reports,
      upsertDailyReport: (report: DailyReportRecord) => {
        const existingIndex = reports.findIndex(item => item.id === report.id);
        if (existingIndex >= 0) {
          reports[existingIndex] = report;
          return;
        }

        reports.unshift(report);
      },
    } as unknown as BillingStore;

    const app = express();
    app.use(express.json());
    app.use(
      "/api",
      createDailyReportsRouter({
        billingStore,
        getDailyReportSourcePackage: folderName =>
          folderName === sourcePackage.folderName ? sourcePackage : null,
        getDailyReportSourcePackages: () => [sourcePackage],
        getPublishedDailyReports: () =>
          reports.filter(report => report.status === "published"),
        getViewerDailyReports: (items, limit) =>
          typeof limit === "number" ? items.slice(0, limit) : items,
        listDailyReportSourcePackages: () => [sourcePackage],
        normalizeDailyReportRecordInput: value =>
          ({
            ...createDailyReport("daily-report-2"),
            ...(value as Partial<DailyReportRecord>),
            id: "daily-report-2",
          }) satisfies DailyReportRecord,
        normalizeString: value => (typeof value === "string" ? value.trim() : ""),
        requireWeeklyReportAdmin: (req, res) => {
          if (req.headers["x-admin"] === "1") {
            return true;
          }

          res.status(401).json({ error: "admin required" });
          return false;
        },
        setPrivateNoStore: res => {
          res.setHeader("Cache-Control", "private, no-store");
        },
      })
    );

    server = app.listen(0);
    await new Promise<void>(resolve => {
      server?.once("listening", () => resolve());
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected an ephemeral TCP port.");
    }

    const publicResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/daily-reports/latest`
    );
    expect(publicResponse.status).toBe(200);
    expect(publicResponse.headers.get("cache-control")).toContain("no-store");
    const publicPayload = (await publicResponse.json()) as {
      report?: DailyReportRecord | null;
    };
    expect(publicPayload.report?.id).toBe("daily-report-1");

    const sourceResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/daily-report-sources`
    );
    expect(sourceResponse.status).toBe(200);
    const sourcePayload = (await sourceResponse.json()) as {
      sources?: DailyReportSourcePackage[];
    };
    expect(sourcePayload.sources).toHaveLength(1);

    const adminResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/admin/daily-reports`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin": "1",
        },
        body: JSON.stringify({
          report: {
            title: "Created by smoke test",
          },
        }),
      }
    );
    const adminBody = await adminResponse.text();
    expect(adminResponse.status, adminBody).toBe(201);
    const adminPayload = JSON.parse(adminBody) as {
      report?: DailyReportRecord;
      reports?: DailyReportRecord[];
    };
    expect(adminPayload.report?.id).toBe("daily-report-2");
    expect(adminPayload.reports).toHaveLength(2);
  });
});
