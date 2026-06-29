import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { createMomentumRouter } from "../../server/routes/momentum";
import type { BillingStore } from "../../server/billingStore";
import type { MomentumReportRecord } from "../../shared/momentumReports";
import type { MomentumSourceRecord } from "../../shared/momentumSources";

function createMomentumReport(id: string): MomentumReportRecord {
  return {
    id,
    slug: id,
    title: "Smoke Momentum Report",
    reportDate: "2026-06-28",
    status: "published",
    authorEmail: "admin@gistify.pro",
    createdAt: "2026-06-28T08:00:00.000Z",
    updatedAt: "2026-06-28T08:00:00.000Z",
    publishedAt: "2026-06-28T08:00:00.000Z",
    content: {
      headline: "Smoke headline",
      summary: "Smoke summary",
      marketContext: "Smoke context",
      executionNotes: "Smoke execution",
      scannerUniverse: "Default liquid universe",
      featuredEntries: [
        {
          id: `${id}-nvda`,
          ticker: "NVDA",
          name: "NVIDIA",
          sector: "Technology",
          currentPrice: 165,
          priceChangePct: 4.2,
          volumeRatio: 1.6,
          rsi: 62,
          score: 88,
          signal: "BULLISH",
          confidenceScore: 81,
          targetPrice: 180,
          catalystSummary: "Smoke catalyst",
          adminNote: "Smoke note",
        },
      ],
    },
  };
}

function createMomentumSource(id: string): MomentumSourceRecord {
  return {
    id,
    contentFormat: "markdown",
    fileName: "source.md",
    sourceFile: "momentum/source.md",
    title: "Smoke Source",
    subtitle: "Smoke subtitle",
    headline: "Smoke source headline",
    reportDate: "2026-06-28",
    reportDateLabel: "28 Haz 2026",
    sessionDateLabel: "28 Haz 2026",
    targetDateLabel: "29 Haz 2026",
    readingTimeLabel: "5 dk",
    vixLabel: "VIX 18.2",
    updatedAt: "2026-06-28T08:00:00.000Z",
    html: "<p>Smoke source</p>",
    markdown: "# Smoke source",
  };
}

describe("momentum router smoke", () => {
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

  it("serves momentum sources and allows admin report upserts", async () => {
    const source = createMomentumSource("source-1");
    const reports = [createMomentumReport("momentum-report-1")];

    const billingStore = {
      getLatestPublishedMomentumReport: () =>
        reports.find(report => report.status === "published") ?? null,
      getMomentumReportById: (id: string) =>
        reports.find(report => report.id === id) ?? null,
      listMomentumReports: () => reports,
      upsertMomentumReport: (report: MomentumReportRecord) => {
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
      createMomentumRouter({
        billingStore,
        getMomentumReportSource: sourceId => (sourceId === source.id ? source : null),
        listMomentumReportSourceSummaries: () => [source],
        normalizeMomentumReportRecordInput: value =>
          ({
            ...createMomentumReport("momentum-report-2"),
            ...(value as Partial<MomentumReportRecord>),
            id: "momentum-report-2",
          }) satisfies MomentumReportRecord,
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

    const sourceResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/momentum/sources/latest`
    );
    expect(sourceResponse.status).toBe(200);
    expect(sourceResponse.headers.get("cache-control")).toContain("no-store");
    const sourcePayload = (await sourceResponse.json()) as {
      report?: MomentumSourceRecord | null;
    };
    expect(sourcePayload.report?.id).toBe("source-1");

    const latestReportResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/momentum/reports/latest`
    );
    expect(latestReportResponse.status).toBe(200);
    const latestReportPayload = (await latestReportResponse.json()) as {
      report?: MomentumReportRecord | null;
    };
    expect(latestReportPayload.report?.id).toBe("momentum-report-1");

    const adminResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/admin/momentum/reports`,
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
      report?: MomentumReportRecord;
      reports?: MomentumReportRecord[];
    };
    expect(adminPayload.report?.id).toBe("momentum-report-2");
    expect(adminPayload.reports).toHaveLength(2);
  });
});
