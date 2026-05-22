import express from "express";
import { createServer } from "http";
import crypto from "node:crypto";
import path from "path";
import { fileURLToPath } from "url";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";

type MembershipPlan = "guest" | "member" | "pro";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
}

interface SessionRecord {
  id: string;
  userId: string;
  expiresAt: number;
}

interface AuthPayload {
  authenticated: boolean;
  user: Pick<AuthUser, "id" | "email" | "name" | "picture"> | null;
  membership: {
    plan: MembershipPlan;
    isSubscribed: boolean;
  };
}

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

const OAUTH_STATE_COOKIE = "google_oauth_state";
const OAUTH_STATE_TTL_SECONDS = 60 * 10;
const SESSION_TTL_SECONDS = Math.floor(ONE_YEAR_MS / 1000);

const users = new Map<string, AuthUser>();
const sessions = new Map<string, SessionRecord>();

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader
    .split(";")
    .map(part => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, part) => {
      const [key, ...valueParts] = part.split("=");
      if (!key) {
        return acc;
      }

      acc[key] = decodeURIComponent(valueParts.join("="));
      return acc;
    }, {});
}

function appendSetCookie(res: express.Response, cookie: string) {
  const current = res.getHeader("Set-Cookie");
  if (!current) {
    res.setHeader("Set-Cookie", cookie);
    return;
  }

  if (Array.isArray(current)) {
    res.setHeader("Set-Cookie", [...current, cookie]);
    return;
  }

  res.setHeader("Set-Cookie", [String(current), cookie]);
}

interface CookieOptions {
  maxAgeSeconds?: number;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Lax" | "Strict" | "None";
}

function serializeCookie(name: string, value: string, options: CookieOptions = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path ?? "/"}`);

  if (typeof options.maxAgeSeconds === "number") {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAgeSeconds))}`);
  }

  if (options.httpOnly) {
    parts.push("HttpOnly");
  }

  if (options.secure) {
    parts.push("Secure");
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  return parts.join("; ");
}

function isSecureRequest(req: express.Request) {
  const forwardedProto = req.header("x-forwarded-proto") ?? "";
  return req.secure || forwardedProto.split(",")[0] === "https";
}

function getSessionSecret() {
  return process.env.SESSION_SECRET?.trim() || "dev-session-secret-change-me";
}

function signValue(value: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

function setCookie(
  req: express.Request,
  res: express.Response,
  name: string,
  value: string,
  options: Omit<CookieOptions, "secure"> = {}
) {
  const cookie = serializeCookie(name, value, {
    ...options,
    secure: process.env.NODE_ENV === "production" || isSecureRequest(req),
  });
  appendSetCookie(res, cookie);
}

function clearCookie(req: express.Request, res: express.Response, name: string) {
  setCookie(req, res, name, "", {
    maxAgeSeconds: 0,
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
  });
}

function getBaseUrl(req: express.Request) {
  const forwardedHost = req.header("x-forwarded-host");
  const host = forwardedHost || req.get("host") || "localhost:3000";
  const forwardedProto = req.header("x-forwarded-proto");
  const proto = forwardedProto?.split(",")[0] || req.protocol || "http";
  return `${proto}://${host}`;
}

function getGoogleRedirectUri(req: express.Request) {
  return (
    process.env.GOOGLE_OAUTH_REDIRECT_URL?.trim() ||
    `${getBaseUrl(req)}/api/auth/google/callback`
  );
}

function getSubscribedEmailSet() {
  return new Set(
    (process.env.SUBSCRIBED_EMAILS || "")
      .split(",")
      .map(email => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

function isSubscribedEmail(email: string) {
  return getSubscribedEmailSet().has(email.toLowerCase());
}

function createSession(userId: string): SessionRecord {
  return {
    id: crypto.randomBytes(24).toString("base64url"),
    userId,
    expiresAt: Date.now() + ONE_YEAR_MS,
  };
}

function parseSessionIdFromCookie(rawCookie: string | undefined) {
  if (!rawCookie) {
    return null;
  }

  const [sessionId, signature] = rawCookie.split(".");
  if (!sessionId || !signature) {
    return null;
  }

  if (signValue(sessionId) !== signature) {
    return null;
  }

  return sessionId;
}

function readAuthPayload(req: express.Request): AuthPayload {
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = parseSessionIdFromCookie(cookies[COOKIE_NAME]);

  if (!sessionId) {
    return {
      authenticated: false,
      user: null,
      membership: {
        plan: "guest",
        isSubscribed: false,
      },
    };
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return {
      authenticated: false,
      user: null,
      membership: {
        plan: "guest",
        isSubscribed: false,
      },
    };
  }

  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return {
      authenticated: false,
      user: null,
      membership: {
        plan: "guest",
        isSubscribed: false,
      },
    };
  }

  const user = users.get(session.userId);
  if (!user) {
    sessions.delete(sessionId);
    return {
      authenticated: false,
      user: null,
      membership: {
        plan: "guest",
        isSubscribed: false,
      },
    };
  }

  const subscribed = isSubscribedEmail(user.email);

  return {
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
    membership: {
      plan: subscribed ? "pro" : "member",
      isSubscribed: subscribed,
    },
  };
}

function buildGoogleAuthUrl(req: express.Request, state: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGoogleRedirectUri(req),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    include_granted_scopes: "true",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.set("trust proxy", 1);
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.get("/api/auth/google", (req, res) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      res.status(500).json({
        error: "Google OAuth ayarlari eksik. GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET gerekli.",
      });
      return;
    }

    const state = crypto.randomBytes(24).toString("base64url");
    setCookie(req, res, OAUTH_STATE_COOKIE, state, {
      maxAgeSeconds: OAUTH_STATE_TTL_SECONDS,
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

  app.get("/api/auth/google/callback", async (req, res) => {
    const oauthError = typeof req.query.error === "string" ? req.query.error : undefined;
    if (oauthError) {
      res.redirect("/?auth=denied");
      return;
    }

    const code = typeof req.query.code === "string" ? req.query.code : undefined;
    const state = typeof req.query.state === "string" ? req.query.state : undefined;
    const cookies = parseCookies(req.headers.cookie);
    const expectedState = cookies[OAUTH_STATE_COOKIE];

    clearCookie(req, res, OAUTH_STATE_COOKIE);

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

      const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = (await userResponse.json()) as GoogleUserInfo;
      if (!userResponse.ok || !userData.sub || !userData.email) {
        console.error("Google user info fetch failed", {
          status: userResponse.status,
          body: userData,
        });
        res.redirect("/?auth=userinfo_failed");
        return;
      }

      const existingUser = users.get(userData.sub);
      const normalizedUser: AuthUser = {
        id: userData.sub,
        email: userData.email,
        name: userData.name || userData.email,
        picture: userData.picture,
        createdAt: existingUser?.createdAt || new Date().toISOString(),
      };
      users.set(normalizedUser.id, normalizedUser);

      const session = createSession(normalizedUser.id);
      sessions.set(session.id, session);

      const signedSessionValue = `${session.id}.${signValue(session.id)}`;
      setCookie(req, res, COOKIE_NAME, signedSessionValue, {
        maxAgeSeconds: SESSION_TTL_SECONDS,
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

  app.get("/api/auth/me", (req, res) => {
    const payload = readAuthPayload(req);
    res.status(200).json(payload);
  });

  app.post("/api/auth/logout", (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = parseSessionIdFromCookie(cookies[COOKIE_NAME]);
    if (sessionId) {
      sessions.delete(sessionId);
    }

    clearCookie(req, res, COOKIE_NAME);
    res.status(204).send();
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
