import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { createBillingRouter } from "../../server/routes/billing";
import type { BillingStore } from "../../server/billingStore";

describe("billing router smoke", () => {
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

  it("serves billing status/config and processes paddle webhooks", async () => {
    let webhookUpserts = 0;

    const billingStore = {
      getSubscriptionByEmail: () => ({
        email: "user@example.com",
        provider: "paddle",
        status: "active",
        lastOrderId: "sub_123",
      }),
    } as unknown as BillingStore;

    const app = express();
    app.use(express.json());
    app.use(
      "/api",
      createBillingRouter({
        billingStore,
        extractObjectRecord: value =>
          value && typeof value === "object" && !Array.isArray(value)
            ? (value as Record<string, unknown>)
            : null,
        getPaddleCancelUrl: () => "https://gistify.pro/pay?billing=cancel",
        getPaddleCheckoutConfigIssues: () => [],
        getPaddleClientToken: () => "paddle_client_token",
        getPaddleEnvironment: () => "sandbox",
        getPaddleManagementUrls: async () => ({
          updatePaymentMethod: "https://vendor.example/update",
          cancel: "https://vendor.example/cancel",
        }),
        getPaddlePriceId: () => "pri_123",
        getPaddleServerConfigIssues: () => [],
        getPaddleSuccessUrl: () => "https://gistify.pro/pay?billing=success",
        getSessionUser: req =>
          req.headers["x-user"] === "1"
            ? {
                id: "user-1",
                email: "user@example.com",
                name: "User",
                createdAt: "2026-06-29T00:00:00.000Z",
                updatedAt: "2026-06-29T00:00:00.000Z",
              }
            : null,
        isPublicAccessMode: () => false,
        isSubscribedEmail: email => email === "user@example.com",
        normalizeEmail: value =>
          typeof value === "string" ? value.trim().toLowerCase() : "",
        normalizeString: value => (typeof value === "string" ? value.trim() : ""),
        readAuthPayload: () => ({
          membership: { plan: "pro", isSubscribed: true },
          accessMode: "managed",
        }),
        resolveMembershipForUser: () => ({
          plan: "pro",
          isSubscribed: true,
        }),
        setPrivateNoStore: res => {
          res.setHeader("Cache-Control", "private, no-store");
        },
        upsertPaddleSubscriptionFromEntity: async () => {
          webhookUpserts += 1;
          return null;
        },
        verifyPaddleWebhook: () => true,
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

    const statusResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/billing/status`,
      {
        headers: {
          "x-user": "1",
        },
      }
    );
    expect(statusResponse.status).toBe(200);
    expect(statusResponse.headers.get("cache-control")).toContain("no-store");
    const statusPayload = (await statusResponse.json()) as {
      allowListOverride?: boolean;
      managedSubscription?: { provider?: string } | null;
    };
    expect(statusPayload.allowListOverride).toBe(true);
    expect(statusPayload.managedSubscription?.provider).toBe("paddle");

    const configResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/billing/paddle/public-config`
    );
    expect(configResponse.status).toBe(200);
    const configPayload = (await configResponse.json()) as {
      enabled?: boolean;
      priceId?: string | null;
    };
    expect(configPayload.enabled).toBe(true);
    expect(configPayload.priceId).toBe("pri_123");

    const manageResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/billing/paddle/manage`,
      {
        headers: {
          "x-user": "1",
        },
      }
    );
    expect(manageResponse.status).toBe(200);
    const managePayload = (await manageResponse.json()) as {
      managementUrls?: { cancel?: string } | null;
    };
    expect(managePayload.managementUrls?.cancel).toContain("vendor.example");

    const webhookResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/billing/paddle/webhook`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: "subscription.updated",
          data: {
            id: "sub_123",
          },
        }),
      }
    );
    expect(webhookResponse.status).toBe(200);
    expect(webhookUpserts).toBe(1);
  });
});
