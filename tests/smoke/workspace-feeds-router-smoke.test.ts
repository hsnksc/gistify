import express from "express";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../server/services/macroArchiveStore", () => ({
  createMacroArchiveStore: () => ({ listArchives: () => [], compareArchives: () => [] }),
}));

import { createWorkspaceFeedsRouter } from "../../server/routes/workspaceFeeds";

describe("workspace feeds router smoke", () => {
  let server: ReturnType<express.Express["listen"]> | null = null;
  let tempDir: string | null = null;

  afterEach(async () => {
    if (server) {
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
    }

    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("serves workspace snapshots and refresh actions", async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gistify-workspace-"));
    const reportPath = path.join(tempDir, "marketflash_report.json");
    fs.writeFileSync(reportPath, JSON.stringify({ ok: true }), "utf8");

    const app = express();
    app.use(express.json());
    app.use(
      "/api",
      createWorkspaceFeedsRouter({
        buildEarningsApiResponse: (snapshot, pipeline) => ({
          data: snapshot,
          pipeline,
        }),
        getCalendarPipeline: () => ({ status: "ok" }),
        getCalendarSnapshot: () => ({ entries: 4 }),
        refreshCalendarSnapshot: async () => ({ entries: 4 }),
        getCpiPpiPipeline: () => ({ status: "ok" }),
        getCpiPpiSnapshot: () => ({ forecast: "soft" }),
        getEarningReportSource: sourceId =>
          sourceId === "source-1" ? { id: "source-1" } : null,
        getEarningsDownloadFolder: () => null,
        getEarningsPipeline: () => ({ sourceFolder: "earningreport" }),
        getEarningsSnapshot: () => ({ macro: { vix: 18 } }),
        getMarketFlashReportPath: () => reportPath,
        getMidasPipeline: () => ({ status: "ok" }),
        getMidasSnapshot: () => ({ symbols: ["AAPL"] }),
        listEarningReportSourceSummaries: () => [{ id: "source-1" }],
        normalizeString: value => (typeof value === "string" ? value.trim() : ""),
        refreshMidasSignals: async () => ({ symbols: ["MSFT"] }),
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

    const earningReportsResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/earning-reports/latest`
    );
    expect(earningReportsResponse.status).toBe(200);
    expect(earningReportsResponse.headers.get("cache-control")).toContain(
      "no-store"
    );
    const earningReportsPayload = (await earningReportsResponse.json()) as {
      report?: { id?: string } | null;
    };
    expect(earningReportsPayload.report?.id).toBe("source-1");

    const strategyResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/earnings/strategy`
    );
    expect(strategyResponse.status).toBe(200);
    const strategyPayload = (await strategyResponse.json()) as {
      data?: { macro?: { vix?: number } };
    };
    expect(strategyPayload.data?.macro?.vix).toBe(18);

    const portfolioRiskResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/earnings/portfolio-risk`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          benchmarkPrice: 100,
          positions: [{ ticker: "TEST", quantity: 1, underlyingPrice: 100, beta: 1.1, delta: 0.5, gamma: 0.03, vega: 0.1, theta: -0.05, marketValue: 500 }],
        }),
      }
    );
    expect(portfolioRiskResponse.status).toBe(200);
    const portfolioRiskPayload = await portfolioRiskResponse.json() as { data?: { scenarios?: unknown[]; betaWeightedDelta?: number } };
    expect(portfolioRiskPayload.data?.scenarios).toHaveLength(21);
    expect(portfolioRiskPayload.data?.betaWeightedDelta).toBeGreaterThan(0);

    const marketFlashResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/marketflash`
    );
    expect(marketFlashResponse.status).toBe(200);
    const marketFlashPayload = (await marketFlashResponse.json()) as {
      ok?: boolean;
    };
    expect(marketFlashPayload.ok).toBe(true);

    const refreshResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/admin/midas/signals/refresh`,
      {
        method: "POST",
        headers: {
          "x-admin": "1",
        },
      }
    );
    expect(refreshResponse.status).toBe(200);
    const refreshPayload = (await refreshResponse.json()) as {
      symbols?: string[];
    };
    expect(refreshPayload.symbols).toEqual(["MSFT"]);
  });
});
