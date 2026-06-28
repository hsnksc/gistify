import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { createWeeklyReportsRouter } from "../../server/routes/weeklyReports";
import type { BillingStore } from "../../server/billingStore";
import type { WeeklyReportRecord } from "../../shared/weeklyReports";

function createWeeklyReport(id: string): WeeklyReportRecord {
  return {
    id,
    slug: id,
    title: "Smoke Weekly Report",
    weekStart: "2026-06-23",
    weekEnd: "2026-06-27",
    analysisDate: "2026-06-28T08:00:00.000Z",
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
      keyCatalysts: ["Catalyst A"],
      entries: [
        {
          id: `${id}-aapl`,
          ticker: "AAPL",
          name: "Apple",
          sector: "Technology",
          earningsDate: "2026-07-24",
          earningsTime: "AMC",
          momentumScore: 82,
          priceChange6M: 12,
          rsi14: 54,
          currentIV: 48,
          historicalIV: 35,
          impliedMove: 6,
          expectedIVCrush: 20,
          ivCrushPotential: "MEDIUM",
          callPremiumBuy: 2,
          callPremiumSell: 5,
          callGainFromIV: 120,
          putPremiumBuy: 2,
          putPremiumSell: 5,
          putGainFromIV: 120,
          ivCrushScore: 78,
          strategyRating: "GOOD",
          riskLevel: "MEDIUM",
          earningsMissRisk: 24,
          gapRisk: 18,
          recommendedStrategy: "Bull Call Spread",
          targetProfit: 120,
          maxLoss: 35,
          lastEarningsMove: 5,
          historicalIVCrush: 18,
          beatRate: 72,
          thesis: "Smoke thesis",
          directionalBias: "Bullish",
        },
      ],
    },
  };
}

describe("weekly reports router smoke", () => {
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

  it("serves public weekly reports and allows admin upserts", async () => {
    const reports = [createWeeklyReport("weekly-report-1")];
    let syncCalls = 0;

    const billingStore = {
      getWeeklyReportById: (id: string) =>
        reports.find(report => report.id === id) ?? null,
      listWeeklyReports: () => reports,
      upsertWeeklyReport: (report: WeeklyReportRecord) => {
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
      createWeeklyReportsRouter({
        billingStore,
        getViewerWeeklyReports: () =>
          reports.filter(report => report.status === "published"),
        getWeeklyReportAdminEmail: () => "admin@gistify.pro",
        isWeeklyReportAdminRequest: req => req.headers["x-admin"] === "1",
        normalizeString: value =>
          typeof value === "string" ? value.trim() : "",
        normalizeWeeklyReportRecordInput: value =>
          ({
            ...createWeeklyReport("weekly-report-2"),
            ...(value as Partial<WeeklyReportRecord>),
            id: "weekly-report-2",
          }) satisfies WeeklyReportRecord,
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
        syncOpportunitiesFromPublishedWeeklyReports: () => {
          syncCalls += 1;
          return reports.length;
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
      `http://127.0.0.1:${address.port}/api/reports/weekly`
    );
    expect(publicResponse.status).toBe(200);
    expect(publicResponse.headers.get("cache-control")).toContain("no-store");
    const publicPayload = (await publicResponse.json()) as {
      admin?: { authorized?: boolean; email?: string };
      reports?: WeeklyReportRecord[];
    };
    expect(publicPayload.admin?.authorized).toBe(false);
    expect(publicPayload.admin?.email).toBe("admin@gistify.pro");
    expect(publicPayload.reports).toHaveLength(1);

    const adminResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/admin/reports/weekly`,
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
      report?: WeeklyReportRecord;
      reports?: WeeklyReportRecord[];
    };
    expect(adminPayload.report?.id).toBe("weekly-report-2");
    expect(adminPayload.reports).toHaveLength(2);
    expect(syncCalls).toBe(1);
  });
});
