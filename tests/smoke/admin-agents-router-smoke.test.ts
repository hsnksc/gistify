import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { createAdminAgentsRouter } from "../../server/routes/adminAgents";
import type { BillingStore } from "../../server/billingStore";
import type { AgentRunRecord } from "../../shared/opportunities";

describe("admin agents router smoke", () => {
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

  it("lists runs and triggers a normalized admin sync", async () => {
    const runs: AgentRunRecord[] = [];
    let syncedTickers: string[] | null = null;

    const billingStore = {
      listAgentRuns: () => runs,
      upsertAgentRun: (record: AgentRunRecord) => {
        const existingIndex = runs.findIndex(item => item.id === record.id);
        if (existingIndex >= 0) {
          runs[existingIndex] = record;
          return;
        }

        runs.unshift(record);
      },
    } as unknown as BillingStore;

    const app = express();
    app.use(express.json());
    app.use(
      "/api",
      createAdminAgentsRouter({
        billingStore,
        normalizeString: value =>
          typeof value === "string" ? value.trim() : "",
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
        syncOpportunitiesFromPublishedWeeklyReports: options => {
          syncedTickers = options?.tickers ? [...options.tickers] : [];
          return 2;
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

    const runsResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/admin/agents/runs`,
      {
        headers: {
          "x-admin": "1",
        },
      }
    );
    expect(runsResponse.status).toBe(200);
    expect(runsResponse.headers.get("cache-control")).toContain("no-store");
    const runsPayload = (await runsResponse.json()) as {
      runs?: AgentRunRecord[];
    };
    expect(runsPayload.runs).toHaveLength(0);

    const triggerResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/admin/agents/trigger`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin": "1",
        },
        body: JSON.stringify({
          agentType: " focused_scan ",
          tickers: [" aapl ", "msft", 123, "", null],
        }),
      }
    );
    const triggerBody = await triggerResponse.text();
    expect(triggerResponse.status, triggerBody).toBe(201);
    const triggerPayload = JSON.parse(triggerBody) as {
      run?: AgentRunRecord;
      runs?: AgentRunRecord[];
    };
    expect(triggerPayload.run?.status).toBe("success");
    expect(triggerPayload.run?.runType).toBe("focused_scan");
    expect(triggerPayload.run?.tickersScanned).toBe(2);
    expect(triggerPayload.run?.opportunitiesFound).toBe(2);
    expect(triggerPayload.runs).toHaveLength(1);
    expect(syncedTickers).toEqual(["AAPL", "MSFT"]);
  });
});
