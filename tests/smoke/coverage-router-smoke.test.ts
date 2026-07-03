import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { createCoverageRouter } from "../../server/routes/coverage";
import type { BillingStore } from "../../server/billingStore";

const LOCAL_REPORT = `---
ticker: CRWV
company: CoreWeave, Inc.
exchange: NASDAQ
date: 2026-07-02
type: earnings-option-play
signal: SPEC-BULLISH
metrics:
  price: 85.69
---

# CoreWeave (CRWV) - Coverage

|  |  |
|---|---|
| **Rapor Tarihi** | 2026-07-02 |

## 1. Executive Summary

> Thesis line
`;

const ADMIN_REPORT = `---
ticker: NVDA
company: NVIDIA Corporation
exchange: NASDAQ
date: 2026-07-03
type: earnings-option-play
signal: SPEC-BULLISH
metrics:
  price: 171.22
---

# NVIDIA (NVDA) - Coverage

|  |  |
|---|---|
| **Rapor Tarihi** | 2026-07-03 |

## 1. Executive Summary

> Admin thesis line
`;

describe("coverage router smoke", () => {
  let server: ReturnType<express.Express["listen"]> | null = null;
  const originalCoveragePath = process.env.COVERAGE_REPORTS_PATH;

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

    if (typeof originalCoveragePath === "string") {
      process.env.COVERAGE_REPORTS_PATH = originalCoveragePath;
    } else {
      delete process.env.COVERAGE_REPORTS_PATH;
    }
  });

  it("serves local coverage, saves admin coverage, and exposes download endpoints", async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "coverage-router-"));
    const coverageRoot = path.join(tempRoot, "reports", "coverage");
    fs.mkdirSync(coverageRoot, { recursive: true });
    fs.writeFileSync(path.join(coverageRoot, "CRWV-2026-07-02.md"), LOCAL_REPORT);
    process.env.COVERAGE_REPORTS_PATH = coverageRoot;

    const storedReports: Array<{
      id: string;
      importedAt: string;
      raw: string;
      sourceName: string;
    }> = [];

    const billingStore = {
      getCoverageReportById: (id: string) =>
        storedReports.find(report => report.id === id) ?? null,
      getCoverageReportBySourceName: (sourceName: string) =>
        storedReports.find(report => report.sourceName === sourceName) ?? null,
      listCoverageReports: () => storedReports,
      upsertCoverageReport: (report: {
        id: string;
        importedAt: string;
        raw: string;
        sourceName: string;
      }) => {
        const existingIndex = storedReports.findIndex(
          item => item.id === report.id
        );
        if (existingIndex >= 0) {
          storedReports[existingIndex] = report;
          return;
        }

        storedReports.unshift(report);
      },
    } as unknown as BillingStore;

    const app = express();
    app.use(express.json());
    app.use(
      "/api",
      createCoverageRouter({
        billingStore,
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

    const listResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/coverage/reports`
    );
    expect(listResponse.status).toBe(200);
    expect(listResponse.headers.get("cache-control")).toContain("no-store");
    const listPayload = (await listResponse.json()) as {
      reports?: Array<{ id: string }>;
    };
    expect(listPayload.reports?.some(report => report.id === "CRWV-2026-07-02")).toBe(
      true
    );

    const adminResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/admin/coverage/reports`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin": "1",
        },
        body: JSON.stringify({
          raw: ADMIN_REPORT,
        }),
      }
    );
    const adminBody = await adminResponse.text();
    expect(adminResponse.status, adminBody).toBe(201);

    const markdownResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/coverage/reports/NVDA-2026-07-03/markdown`
    );
    expect(markdownResponse.status).toBe(200);
    expect(markdownResponse.headers.get("content-type")).toContain(
      "text/markdown"
    );
    expect(await markdownResponse.text()).toContain("# NVIDIA (NVDA) - Coverage");

    const zipResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/coverage/reports/download`
    );
    expect(zipResponse.status).toBe(200);
    expect(zipResponse.headers.get("content-type")).toContain("application/zip");
    const zipBuffer = Buffer.from(await zipResponse.arrayBuffer());
    expect(zipBuffer.slice(0, 2).toString("utf8")).toBe("PK");
  });
});
