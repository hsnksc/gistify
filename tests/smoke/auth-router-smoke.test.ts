import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { createAuthRouter } from "../../server/routes/auth";
import type { BillingStore } from "../../server/billingStore";

describe("auth router smoke", () => {
  let server: ReturnType<express.Express["listen"]> | null = null;
  const originalClientId = process.env.GOOGLE_CLIENT_ID;
  const originalClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  afterEach(async () => {
    if (!server) {
      process.env.GOOGLE_CLIENT_ID = originalClientId;
      process.env.GOOGLE_CLIENT_SECRET = originalClientSecret;
    } else {
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
      process.env.GOOGLE_CLIENT_ID = originalClientId;
      process.env.GOOGLE_CLIENT_SECRET = originalClientSecret;
    }
  });

  it("serves auth payload, starts oauth, and clears session on logout", async () => {
    let deletedSessionId = "";
    process.env.GOOGLE_CLIENT_ID = "test-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";

    const billingStore = {
      deleteSession: (sessionId: string) => {
        deletedSessionId = sessionId;
      },
      getUserById: () => null,
      upsertSession: () => undefined,
      upsertUser: () => undefined,
    } as unknown as BillingStore;

    const app = express();
    app.use(
      "/api",
      createAuthRouter({
        authCookieName: "session",
        billingStore,
        buildGoogleAuthUrl: (_req, state) =>
          `https://accounts.google.com/o/oauth2/v2/auth?state=${state}`,
        clearCookie: (_req, res, name) => {
          res.append("Set-Cookie", `${name}=; Max-Age=0; Path=/`);
        },
        createSession: userId => ({
          id: "session-1",
          userId,
          expiresAt: Date.now() + 60_000,
          createdAt: "2026-06-29T00:00:00.000Z",
          updatedAt: "2026-06-29T00:00:00.000Z",
        }),
        getGoogleRedirectUri: () =>
          "https://gistify.pro/api/auth/google/callback",
        isPublicAccessMode: () => false,
        normalizeEmail: value =>
          typeof value === "string" ? value.trim().toLowerCase() : "",
        oauthStateCookieName: "oauth_state",
        oauthStateTtlSeconds: 600,
        parseCookies: rawCookieHeader =>
          Object.fromEntries(
            (rawCookieHeader || "")
              .split(";")
              .map(part => part.trim())
              .filter(Boolean)
              .map(part => {
                const [key, ...rest] = part.split("=");
                return [key, rest.join("=")];
              })
          ),
        parseSessionIdFromCookie: rawCookie => {
          if (!rawCookie) {
            return null;
          }

          const [sessionId] = rawCookie.split(".");
          return sessionId || null;
        },
        readAuthPayload: () => ({
          authenticated: true,
          user: {
            id: "user-1",
            email: "user@example.com",
            name: "User",
          },
          membership: {
            plan: "pro",
            isSubscribed: true,
          },
          accessMode: "managed",
        }),
        sessionTtlSeconds: 3600,
        setCookie: (_req, res, name, value) => {
          res.append("Set-Cookie", `${name}=${value}; Path=/`);
        },
        setPrivateNoStore: res => {
          res.setHeader("Cache-Control", "private, no-store");
        },
        signValue: value => `sig-${value}`,
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

    const meResponse = await fetch(`http://127.0.0.1:${address.port}/api/auth/me`);
    expect(meResponse.status).toBe(200);
    expect(meResponse.headers.get("cache-control")).toContain("no-store");

    const oauthResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/auth/google`,
      {
        redirect: "manual",
      }
    );
    expect(oauthResponse.status).toBe(302);
    expect(oauthResponse.headers.get("location")).toContain(
      "accounts.google.com"
    );
    expect(oauthResponse.headers.get("set-cookie")).toContain("oauth_state=");

    const logoutResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/auth/logout`,
      {
        method: "POST",
        headers: {
          Cookie: "session=session-1.sig-session-1",
        },
      }
    );
    expect(logoutResponse.status).toBe(204);
    expect(deletedSessionId).toBe("session-1");
  });
});
