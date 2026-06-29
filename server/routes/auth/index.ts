import type { Request, Response, Router } from "express";
import express from "express";
import crypto from "node:crypto";
import type { BillingStore } from "../../billingStore";

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
}

type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
};

type SessionRecord = {
  id: string;
  userId: string;
  expiresAt: number;
  createdAt: string;
  updatedAt: string;
};

type CookieSetter = (
  req: Request,
  res: Response,
  name: string,
  value: string,
  options?: {
    maxAgeSeconds?: number;
    path?: string;
    httpOnly?: boolean;
    sameSite?: "Lax" | "Strict" | "None";
  }
) => void;

type AuthRouterDependencies = {
  authCookieName: string;
  billingStore: BillingStore;
  buildGoogleAuthUrl: (req: Request, state: string) => string | null;
  clearCookie: (req: Request, res: Response, name: string) => void;
  createSession: (userId: string) => SessionRecord;
  getGoogleRedirectUri: (req: Request) => string;
  isPublicAccessMode: () => boolean;
  normalizeEmail: (value: unknown) => string;
  oauthStateCookieName: string;
  oauthStateTtlSeconds: number;
  parseCookies: (rawCookieHeader: string | undefined) => Record<string, string>;
  parseSessionIdFromCookie: (rawCookie: string | undefined) => string | null;
  readAuthPayload: (req: Request) => unknown;
  sessionTtlSeconds: number;
  setCookie: CookieSetter;
  setPrivateNoStore: (res: Response) => void;
  signValue: (value: string) => string;
};

export function createAuthRouter({
  authCookieName,
  billingStore,
  buildGoogleAuthUrl,
  clearCookie,
  createSession,
  getGoogleRedirectUri,
  isPublicAccessMode,
  normalizeEmail,
  oauthStateCookieName,
  oauthStateTtlSeconds,
  parseCookies,
  parseSessionIdFromCookie,
  readAuthPayload,
  sessionTtlSeconds,
  setCookie,
  setPrivateNoStore,
  signValue,
}: AuthRouterDependencies): Router {
  const router = express.Router();

  router.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  router.get("/auth/google", (req, res) => {
    if (isPublicAccessMode()) {
      res.redirect("/");
      return;
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      res.status(500).json({
        error:
          "Google OAuth ayarlari eksik. GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET gerekli.",
      });
      return;
    }

    const state = crypto.randomBytes(24).toString("base64url");
    setCookie(req, res, oauthStateCookieName, state, {
      maxAgeSeconds: oauthStateTtlSeconds,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    });

    const authUrl = buildGoogleAuthUrl(req, state);
    if (!authUrl) {
      res.status(500).json({ error: "Google OAuth URL olusturulamadi." });
      return;
    }

    res.redirect(authUrl);
  });

  router.get("/auth/google/callback", async (req, res) => {
    if (isPublicAccessMode()) {
      res.redirect("/");
      return;
    }

    const oauthError =
      typeof req.query.error === "string" ? req.query.error : undefined;
    if (oauthError) {
      res.redirect("/?auth=denied");
      return;
    }

    const code =
      typeof req.query.code === "string" ? req.query.code : undefined;
    const state =
      typeof req.query.state === "string" ? req.query.state : undefined;
    const cookies = parseCookies(req.headers.cookie);
    const expectedState = cookies[oauthStateCookieName];

    clearCookie(req, res, oauthStateCookieName);

    if (!code || !state || !expectedState || state !== expectedState) {
      res.redirect("/?auth=invalid_state");
      return;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    if (!clientId || !clientSecret) {
      res.redirect("/?auth=missing_config");
      return;
    }

    try {
      const tokenBody = new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: getGoogleRedirectUri(req),
        grant_type: "authorization_code",
      });

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenBody.toString(),
      });

      const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
      if (!tokenResponse.ok || !tokenData.access_token) {
        console.error("Google token exchange failed", {
          status: tokenResponse.status,
          error: tokenData.error,
          description: tokenData.error_description,
        });
        res.redirect("/?auth=token_failed");
        return;
      }

      const userResponse = await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      const userData = (await userResponse.json()) as GoogleUserInfo;
      if (!userResponse.ok || !userData.sub || !userData.email) {
        console.error("Google user info fetch failed", {
          status: userResponse.status,
          body: userData,
        });
        res.redirect("/?auth=userinfo_failed");
        return;
      }

      const existingUser = billingStore.getUserById(userData.sub);
      const nowIso = new Date().toISOString();
      const normalizedEmail = normalizeEmail(userData.email);
      const normalizedUser: AuthUser = {
        id: userData.sub,
        email: normalizedEmail || userData.email,
        name: userData.name || normalizedEmail || userData.email,
        picture: userData.picture,
        createdAt: existingUser?.createdAt || nowIso,
        updatedAt: nowIso,
      };
      billingStore.upsertUser(normalizedUser);

      const session = createSession(normalizedUser.id);
      billingStore.upsertSession(session);

      const signedSessionValue = `${session.id}.${signValue(session.id)}`;
      setCookie(req, res, authCookieName, signedSessionValue, {
        maxAgeSeconds: sessionTtlSeconds,
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
      });

      res.redirect("/");
    } catch (error) {
      console.error("Google OAuth callback error", error);
      res.redirect("/?auth=server_error");
    }
  });

  router.get("/auth/me", (req, res) => {
    setPrivateNoStore(res);
    const payload = readAuthPayload(req);
    res.status(200).json(payload);
  });

  router.post("/auth/logout", (req, res) => {
    if (isPublicAccessMode()) {
      clearCookie(req, res, authCookieName);
      res.status(204).send();
      return;
    }

    const cookies = parseCookies(req.headers.cookie);
    const sessionId = parseSessionIdFromCookie(cookies[authCookieName]);
    if (sessionId) {
      billingStore.deleteSession(sessionId);
    }

    clearCookie(req, res, authCookieName);
    res.status(204).send();
  });

  return router;
}
