import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import type { DailyReportRecord } from "@shared/dailyReports";
import { createFlowReportsRouter } from "../../server/routes/flow/reports";

function createReport(options: {
  id: string;
  reportDate: string;
  sourceFolder: string;
  sourceLabel: string;
  title: string;
  tickerUniverse: string[];
}) {
  const now = "2026-06-28T10:00:00.000Z";

  return {
    authorEmail: "tester@gistify.pro",
    content: {
      contentFormat: "markdown",
      executiveSummary: ["Smoke test report"],
      figureFiles: [],
      headline: "Smoke test headline",
      markdown: "# Smoke",
      metadataItems: [],
      openAiFigureFiles: [],
      researchFileCount: 0,
      sectionFiles: [],
      sourceLabel: options.sourceLabel,
      tickerUniverse: options.tickerUniverse,
    },
    createdAt: now,
    id: options.id,
    reportDate: options.reportDate,
    slug: options.id,
    sourceFolder: options.sourceFolder,
    status: "published",
    title: options.title,
    updatedAt: now,
  } satisfies DailyReportRecord;
}

describe("flow reports router smoke", () => {
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

  it("returns filtered summaries with the requested limit", async () => {
    const reports: DailyReportRecord[] = [
      createReport({
        id: "flow-aapl",
        reportDate: "2026-06-28",
        sourceFolder: "flow-aapl",
        sourceLabel: "flow/test",
        tickerUniverse: ["AAPL"],
        title: "AAPL — Apple Research Report",
      }),
      createReport({
        id: "flow-market",
        reportDate: "2026-06-28",
        sourceFolder: "flow-market",
        sourceLabel: "flow/test",
        tickerUniverse: ["SPY", "QQQ", "IWM", "DIA"],
        title: "US Markets Close Report",
      }),
    ];

    const app = express();
    app.use(
      "/api/flow-reports",
      createFlowReportsRouter({
        getPublishedReports: () => reports,
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

    const response = await fetch(
      `http://127.0.0.1:${address.port}/api/flow-reports/summary?source=flow/test&type=stock&limit=1`
    );
    const payload = (await response.json()) as {
      reports?: Array<{ id: string; reportKind: string }>;
    };

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(payload.reports).toHaveLength(1);
    expect(payload.reports?.[0]?.id).toBe("flow-aapl");
    expect(payload.reports?.[0]?.reportKind).toBe("stock");
  });
});
