import express from "express";
import { createServer } from "http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createBillingStore,
  type AuthUserRecord,
  type ShopierOrderRecord,
  type SessionStoreRecord,
  type SubscriptionRecord,
} from "./billingStore";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";

type MembershipPlan = "guest" | "member" | "pro";
type AppAccessMode = "managed" | "public";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

interface SessionRecord {
  id: string;
  userId: string;
  expiresAt: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthPayload {
  authenticated: boolean;
  user: Pick<AuthUser, "id" | "email" | "name" | "picture"> | null;
  membership: {
    plan: MembershipPlan;
    isSubscribed: boolean;
  };
  accessMode: AppAccessMode;
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

type TranslationLanguage = "tr" | "en";

interface TranslationRequestBody {
  texts?: unknown;
  source?: unknown;
  target?: unknown;
}

interface ShopierCheckoutRequestBody {
  plan?: unknown;
}

interface ShopierContactPayload {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
}

interface ShopierOrderTotalsPayload {
  total?: unknown;
}

interface ShopierOrderLineItemPayload {
  productId?: unknown;
  title?: unknown;
}

interface ShopierWebhookPayload {
  id?: unknown;
  paymentStatus?: unknown;
  status?: unknown;
  dateCreated?: unknown;
  currency?: unknown;
  note?: unknown;
  shippingInfo?: ShopierContactPayload;
  billingInfo?: ShopierContactPayload;
  totals?: ShopierOrderTotalsPayload;
  lineItems?: unknown;
  webhook_token?: unknown;
}

interface ShopierWebhookSubscription {
  id?: string;
  event?: string;
  url?: string;
  token?: string;
}

type RequestWithRawBody = express.Request & {
  rawBody?: string;
};

function stripWrappingQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function loadLocalEnvFiles() {
  for (const filename of [".env.local", ".env"]) {
    const envPath = path.resolve(process.cwd(), filename);
    if (!fs.existsSync(envPath)) {
      continue;
    }

    const fileContents = fs.readFileSync(envPath, "utf8");
    for (const rawLine of fileContents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) {
        continue;
      }

      const separatorIndex = line.indexOf("=");
      if (separatorIndex <= 0) {
        continue;
      }

      const key = line.slice(0, separatorIndex).trim();
      if (!key || process.env[key] !== undefined) {
        continue;
      }

      const rawValue = line.slice(separatorIndex + 1).trim();
      process.env[key] = stripWrappingQuotes(rawValue);
    }
  }
}

loadLocalEnvFiles();

const OAUTH_STATE_COOKIE = "google_oauth_state";
const OAUTH_STATE_TTL_SECONDS = 60 * 10;
const SESSION_TTL_SECONDS = Math.floor(ONE_YEAR_MS / 1000);
const DEFAULT_SUBSCRIPTION_DAYS = 30;
const DEFAULT_PUBLIC_ACCESS_MODE: AppAccessMode = "public";
const PUBLIC_ACCESS_USER = {
  id: "public-access",
  email: "public@gistify.pro",
  name: "Public Access",
} as const;

const translationCache = new Map<string, string>();
const billingStore = createBillingStore();

function getTranslationCacheKey(
  source: TranslationLanguage,
  target: TranslationLanguage,
  text: string
) {
  return `${source}:${target}:${text}`;
}

function extractGoogleTranslation(payload: unknown): string | null {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    return null;
  }

  const segments = payload[0] as unknown[];
  const translatedParts = segments
    .map(segment => {
      if (!Array.isArray(segment) || typeof segment[0] !== "string") {
        return "";
      }

      return segment[0];
    })
    .filter(Boolean);

  const combined = translatedParts.join("").trim();
  return combined || null;
}

async function translateText(
  text: string,
  source: TranslationLanguage,
  target: TranslationLanguage
) {
  const cleanText = text.trim();
  if (!cleanText || source === target) {
    return cleanText;
  }

  const cacheKey = getTranslationCacheKey(source, target, cleanText);
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", source);
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", cleanText);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Translation failed with status ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const translated = extractGoogleTranslation(payload) || cleanText;

  translationCache.set(cacheKey, translated);
  return translated;
}

function normalizeTranslationLanguage(
  value: unknown,
  fallback: TranslationLanguage
) {
  if (value === "tr" || value === "en") {
    return value;
  }

  return fallback;
}

function parseCookies(
  cookieHeader: string | undefined
): Record<string, string> {
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

function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
) {
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

function setPrivateNoStore(res: express.Response) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Vary", "Cookie");
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

function clearCookie(
  req: express.Request,
  res: express.Response,
  name: string
) {
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
  const nowIso = new Date().toISOString();
  return {
    id: crypto.randomBytes(24).toString("base64url"),
    userId,
    expiresAt: Date.now() + ONE_YEAR_MS,
    createdAt: nowIso,
    updatedAt: nowIso,
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

function getSessionUser(req: express.Request) {
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = parseSessionIdFromCookie(cookies[COOKIE_NAME]);

  if (!sessionId) {
    return null;
  }

  const session = billingStore.getSessionById(sessionId);
  if (!session) {
    return null;
  }

  if (session.expiresAt < Date.now()) {
    billingStore.deleteSession(sessionId);
    return null;
  }

  const user = billingStore.getUserById(session.userId);
  if (!user) {
    billingStore.deleteSession(sessionId);
    return null;
  }

  return user;
}

function getSubscriptionDurationDays() {
  const configured = Number(
    process.env.SHOPIER_SUBSCRIPTION_DAYS || DEFAULT_SUBSCRIPTION_DAYS
  );

  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_SUBSCRIPTION_DAYS;
  }

  return Math.floor(configured);
}

function addDays(baseDate: Date, days: number) {
  const next = new Date(baseDate);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeEmail(value: unknown) {
  return normalizeString(value).toLowerCase();
}

function buildEmailScopedUserId(email: string) {
  return `email:${normalizeEmail(email)}`;
}

function parseCurrencyAmount(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const raw = normalizeString(value);
  if (!raw) {
    return 0;
  }

  const clean = raw.replace(/[^\d,.-]/g, "");
  const hasComma = clean.includes(",");
  const hasDot = clean.includes(".");
  const normalized =
    hasComma && hasDot
      ? clean.replace(/\./g, "").replace(",", ".")
      : clean.replace(",", ".");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return null;
  }

  return billingStore.getUserByEmail(normalizedEmail);
}

function syncManagedSubscriptionUser(user: AuthUser) {
  const normalizedEmail = normalizeEmail(user.email);
  const record = billingStore.getSubscriptionByEmail(normalizedEmail);
  if (!record || record.userId === user.id) {
    return record;
  }

  const updatedRecord: SubscriptionRecord = {
    ...record,
    userId: user.id,
    email: normalizedEmail,
    updatedAt: new Date().toISOString(),
  };
  billingStore.upsertSubscription(updatedRecord);

  return updatedRecord;
}

function getActiveManagedSubscriptionByEmail(email: string) {
  const record = billingStore.getSubscriptionByEmail(normalizeEmail(email));
  if (!record) {
    return null;
  }

  if (record.status !== "active") {
    return null;
  }

  if (!record.endsAt) {
    return record;
  }

  if (Date.parse(record.endsAt) > Date.now()) {
    return record;
  }

  billingStore.upsertSubscription({
    ...record,
    status: "expired",
    updatedAt: new Date().toISOString(),
  });

  return null;
}

function resolveMembershipForUser(user: AuthUser) {
  syncManagedSubscriptionUser(user);
  const allowListOverride = isSubscribedEmail(user.email);
  const managedSubscription = getActiveManagedSubscriptionByEmail(user.email);
  const isSubscribed = allowListOverride || Boolean(managedSubscription);

  return {
    plan: (isSubscribed ? "pro" : "member") as MembershipPlan,
    isSubscribed,
  };
}

function getAppAccessMode(): AppAccessMode {
  const configuredValue = process.env.APP_ACCESS_MODE?.trim().toLowerCase();
  return configuredValue === "managed" ? "managed" : DEFAULT_PUBLIC_ACCESS_MODE;
}

function isPublicAccessMode() {
  return getAppAccessMode() === "public";
}

function readAuthPayload(req: express.Request): AuthPayload {
  if (isPublicAccessMode()) {
    return {
      authenticated: true,
      user: { ...PUBLIC_ACCESS_USER },
      membership: {
        plan: "pro",
        isSubscribed: true,
      },
      accessMode: "public",
    };
  }

  const user = getSessionUser(req);
  if (!user) {
    return {
      authenticated: false,
      user: null,
      membership: {
        plan: "guest",
        isSubscribed: false,
      },
      accessMode: "managed",
    };
  }

  const membership = resolveMembershipForUser(user);

  return {
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
    membership,
    accessMode: "managed",
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

function getShopierCurrency() {
  return process.env.SHOPIER_CURRENCY?.trim() || "TRY";
}

function getShopierMonthlyPrice() {
  const parsed = Number(process.env.SHOPIER_MONTHLY_PRICE || 0);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }

  return parsed;
}

function getShopierPat() {
  return process.env.SHOPIER_PAT?.trim() || "";
}

function getConfiguredShopierCheckoutUrl() {
  return (
    process.env.SHOPIER_SUBSCRIPTION_PRODUCT_URL?.trim() ||
    process.env.SHOPIER_CHECKOUT_URL?.trim() ||
    process.env.SHOPIER_PAYMENT_LINK?.trim() ||
    ""
  );
}

function getShopierSubscriptionProductId() {
  return normalizeString(process.env.SHOPIER_SUBSCRIPTION_PRODUCT_ID);
}

function getShopierSubscriptionProductTitle() {
  return normalizeString(process.env.SHOPIER_SUBSCRIPTION_PRODUCT_TITLE);
}

function allowAnyShopierProductOrder() {
  return process.env.SHOPIER_ALLOW_ANY_PRODUCT_ORDER === "true";
}

function getConfiguredAppBaseUrl() {
  return process.env.APP_BASE_URL?.trim() || "";
}

function isPublicHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !["localhost", "127.0.0.1", "0.0.0.0"].includes(
        url.hostname.toLowerCase()
      )
    );
  } catch {
    return false;
  }
}

function getShopierWebhookMaxAgeSeconds() {
  const parsed = Number(process.env.SHOPIER_WEBHOOK_MAX_AGE_SECONDS || 300);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 300;
  }

  return Math.floor(parsed);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderStaticMarketingPage(
  pageTitle: string,
  pageDescription: string,
  bodyHtml: string
) {
  const title = escapeHtml(`${pageTitle} | Gistify`);
  const description = escapeHtml(pageDescription);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <style>
      :root {
        color-scheme: dark;
        --bg: #071018;
        --panel: #0d1722;
        --panel-2: #111f2d;
        --text: #edf3f8;
        --muted: #93a4b8;
        --border: rgba(128, 150, 173, 0.22);
        --primary: #34d399;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        background:
          radial-gradient(circle at top, rgba(52, 211, 153, 0.16), transparent 34%),
          linear-gradient(180deg, #071018 0%, #09131c 100%);
        color: var(--text);
      }
      a { color: inherit; text-decoration: none; }
      .wrap { max-width: 1120px; margin: 0 auto; padding: 24px 16px 64px; }
      .card {
        background: rgba(13, 23, 34, 0.92);
        border: 1px solid var(--border);
        border-radius: 26px;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
      }
      header {
        padding: 18px 22px;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
        flex-wrap: wrap;
      }
      .brand {
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--primary);
        font-weight: 700;
      }
      .sub {
        color: var(--muted);
        font-size: 14px;
        margin-top: 6px;
      }
      nav {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      nav a, .button {
        border: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.02);
        padding: 10px 14px;
        border-radius: 999px;
        font-size: 12px;
        color: var(--muted);
      }
      .hero {
        padding: 30px 24px;
        margin-bottom: 18px;
      }
      .eyebrow {
        color: var(--primary);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      h1 {
        margin: 14px 0 12px;
        font-size: clamp(2rem, 5vw, 3.75rem);
        line-height: 1.06;
      }
      .lead {
        max-width: 760px;
        color: var(--muted);
        line-height: 1.7;
        font-size: 16px;
      }
      .grid {
        display: grid;
        gap: 18px;
      }
      .two {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
      section, aside {
        padding: 24px;
      }
      h2 {
        margin: 0 0 14px;
        font-size: 22px;
      }
      h3 {
        margin: 0 0 8px;
        font-size: 18px;
      }
      p, li {
        color: var(--muted);
        line-height: 1.7;
        font-size: 15px;
      }
      ul {
        margin: 0;
        padding-left: 18px;
      }
      .pill {
        display: inline-block;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid rgba(52, 211, 153, 0.28);
        background: rgba(52, 211, 153, 0.08);
        color: #b9f6d8;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .feature, .list-item, .legal-block {
        background: rgba(17, 31, 45, 0.82);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 16px;
      }
      .price {
        font-size: 44px;
        font-weight: 700;
        margin: 12px 0 18px;
      }
      footer {
        margin-top: 18px;
        padding: 22px 24px;
        display: flex;
        gap: 18px;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      footer p {
        margin: 0;
      }
      .footer-links {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .footer-links a {
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 10px 14px;
        color: var(--muted);
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <header class="card">
        <div>
          <div class="brand">Gistify</div>
          <div class="sub">Earnings intelligence, momentum scanning, pre-earnings research, risk matrix and options views.</div>
        </div>
        <nav>
          <a href="/">Home</a>
          <a href="/pricing">Pricing</a>
          <a href="/terms">Terms &amp; Conditions</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/refund">Refund Policy</a>
          <a href="/app">Open App</a>
        </nav>
      </header>
      ${bodyHtml}
      <footer class="card">
        <div>
          <p><strong>Gistify</strong></p>
          <p>Support: <a href="mailto:support@gistify.pro">support@gistify.pro</a></p>
        </div>
        <div class="footer-links">
          <a href="/pricing">Pricing</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/refund">Refund</a>
          <a href="/pay">Pay</a>
        </div>
      </footer>
    </div>
  </body>
</html>`;
}

function renderLandingPageHtml() {
  return renderStaticMarketingPage(
    "Gistify Product Overview",
    "Gistify is a subscription-based analytics platform for momentum scanning, pre-earnings research, risk matrix views and options analysis.",
    `
      <section class="card hero">
        <div class="eyebrow">Product Overview</div>
        <h1>Gistify is a subscription-based analytics platform built to speed up pre-earnings decision making.</h1>
        <p class="lead">The service combines momentum scanning, pre-earnings stock research, sector context, risk matrix screens and options-focused analysis in a single web application.</p>
      </section>
      <div class="grid two">
        <section class="card">
          <h2>Features included with purchase</h2>
          <div class="grid">
            <div class="feature"><h3>Momentum Scanner</h3><p>Scans active names using opening momentum, volume change and sector distribution signals.</p></div>
            <div class="feature"><h3>Pre-Earnings Analysis</h3><p>Shows expectations, beat probability, sector context and directional analysis before earnings.</p></div>
            <div class="feature"><h3>Risk and Options View</h3><p>Combines risk matrix screens, IV crush views and options-focused research modules.</p></div>
          </div>
        </section>
        <aside class="card">
          <span class="pill">Paddle approval pending</span>
          <h2 style="margin-top:18px;">Pricing Snapshot</h2>
          <div class="price">250 TRY / month</div>
          <div class="grid">
            <div class="list-item">Monthly web access</div>
            <div class="list-item">Momentum scanner module</div>
            <div class="list-item">Earnings benchmark dashboard</div>
            <div class="list-item">Risk matrix and options view</div>
            <div class="list-item">Support via support@gistify.pro</div>
          </div>
        </aside>
      </div>
    `
  );
}

function renderPricingPageHtml() {
  return renderStaticMarketingPage(
    "Pricing",
    "Gistify Pro pricing and purchase inclusions.",
    `
      <section class="card hero">
        <div class="eyebrow">Pricing</div>
        <h1>Single monthly subscription</h1>
        <p class="lead">Gistify runs on a digital subscription model. Our single active plan is priced at 250 TRY per month and includes web access to all analysis modules.</p>
      </section>
      <div class="grid two">
        <section class="card">
          <h2>Gistify Pro</h2>
          <div class="price">250 TRY / month</div>
          <div class="grid">
            <div class="list-item">Momentum scanner</div>
            <div class="list-item">Earnings benchmark dashboard</div>
            <div class="list-item">Pre-earnings stock analysis tabs</div>
            <div class="list-item">Risk matrix and IV crush views</div>
            <div class="list-item">Web access and support via support@gistify.pro</div>
          </div>
        </section>
        <aside class="card">
          <h2>What is being purchased?</h2>
          <p>This is a digital subscription for access to the Gistify web application. No physical goods are delivered.</p>
          <p>Refund terms are described on the <a href="/refund">Refund Policy</a> page. Legal information is available on the <a href="/terms">Terms &amp; Conditions</a> and <a href="/privacy">Privacy Policy</a> pages.</p>
        </aside>
      </div>
    `
  );
}

function renderTermsPageHtml() {
  return renderStaticMarketingPage(
    "Terms & Conditions",
    "Terms and conditions for the Gistify digital subscription service.",
    `
      <section class="card hero">
        <div class="eyebrow">Terms &amp; Conditions</div>
        <h1>Terms &amp; Conditions</h1>
        <p class="lead">These Terms &amp; Conditions govern the use and purchase of the Gistify digital subscription service.</p>
      </section>
      <div class="grid">
        <section class="card legal-block">
          <h2>1. Parties and service</h2>
          <p>This website and digital subscription service are provided by <strong>Gistify</strong>. Gistify offers web-based financial analysis screens, momentum scanning tools, pre-earnings research content, risk matrix views and options research modules.</p>
        </section>
        <section class="card legal-block">
          <h2>2. Account and access</h2>
          <p>Access to the application may change from time to time for technical or operational reasons. Gistify reserves the right to improve the service, update content or suspend certain features when necessary.</p>
        </section>
        <section class="card legal-block">
          <h2>3. Subscription and permitted use</h2>
          <p>The subscription is a digital access license. Users may use the service only for lawful purposes and for their own internal use. Copying, commercial redistribution or unauthorized sharing of the content is prohibited.</p>
        </section>
        <section class="card legal-block">
          <h2>4. Financial liability limitation</h2>
          <p>The data and analysis provided on Gistify do not constitute investment advice. All decisions remain the responsibility of the user. Gistify cannot be held liable for direct or indirect losses arising from financial decisions made using the platform content.</p>
        </section>
        <section class="card legal-block">
          <h2>5. Support and contact</h2>
          <p>Support requests related to the service may be sent to <a href="mailto:support@gistify.pro">support@gistify.pro</a>.</p>
        </section>
      </div>
    `
  );
}

function renderPrivacyPageHtml() {
  return renderStaticMarketingPage(
    "Privacy Policy",
    "Privacy policy for Gistify.",
    `
      <section class="card hero">
        <div class="eyebrow">Privacy Policy</div>
        <h1>Privacy Policy</h1>
        <p class="lead">This page outlines, at a high level, what user information Gistify may process and for what operational purposes.</p>
      </section>
      <div class="grid">
        <section class="card legal-block">
          <h2>1. Data collected</h2>
          <p>Gistify may process limited user information required for account access, support communication and core operations. This may include an email address, account information and technical session data.</p>
        </section>
        <section class="card legal-block">
          <h2>2. How data is used</h2>
          <p>Collected data is used to provide account access, operate the service, manage billing and support flows, and maintain security monitoring.</p>
        </section>
        <section class="card legal-block">
          <h2>3. Third-party services</h2>
          <p>Certain functions such as billing, authentication or hosting may rely on third-party providers. These providers may access only the information necessary to deliver their part of the service.</p>
        </section>
        <section class="card legal-block">
          <h2>4. Contact</h2>
          <p>Questions or requests related to privacy may be sent to <a href="mailto:support@gistify.pro">support@gistify.pro</a>.</p>
        </section>
      </div>
    `
  );
}

function renderRefundPageHtml() {
  return renderStaticMarketingPage(
    "Refund Policy",
    "Refund policy for Gistify purchases processed through Paddle.",
    `
      <section class="card hero">
        <div class="eyebrow">Refund Policy</div>
        <h1>Refund Policy</h1>
        <p class="lead">Payments for Gistify will be processed through Paddle. This page gives a short summary of the refund framework aligned with Paddle.</p>
      </section>
      <div class="grid two">
        <section class="card">
          <h2>Core refund rules</h2>
          <div class="grid">
            <div class="list-item">Gistify is a digital access subscription service; no physical product is delivered.</div>
            <div class="list-item">Refund requests must be submitted within <strong>14 calendar days</strong> from the transaction date.</div>
            <div class="list-item">Refund eligibility and review are handled in line with the Paddle refund policy.</div>
            <div class="list-item">If a refund is approved, access to the related product or subscription will end.</div>
            <div class="list-item">Any mandatory consumer rights available under applicable law remain reserved.</div>
          </div>
        </section>
        <aside class="card">
          <h2>How to request a refund</h2>
          <p>A refund request should be submitted using the link in the Paddle receipt, from the subscription management screen, or via paddle.net.</p>
          <p><a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noreferrer">View the official Paddle refund policy</a></p>
        </aside>
      </div>
    `
  );
}

function allowLegacyWebhookVerification() {
  return process.env.SHOPIER_ALLOW_LEGACY_WEBHOOK_TOKEN === "true";
}

function getShopierLineItems(payload: ShopierWebhookPayload) {
  if (!Array.isArray(payload.lineItems)) {
    return [];
  }

  return payload.lineItems.filter(
    (lineItem): lineItem is ShopierOrderLineItemPayload =>
      Boolean(lineItem) && typeof lineItem === "object"
  );
}

function isConfiguredShopierSubscriptionOrder(payload: ShopierWebhookPayload) {
  const configuredProductId = getShopierSubscriptionProductId();
  const configuredProductTitle =
    getShopierSubscriptionProductTitle().toLowerCase();

  if (!configuredProductId && !configuredProductTitle) {
    return allowAnyShopierProductOrder();
  }

  return getShopierLineItems(payload).some(lineItem => {
    const lineItemProductId = normalizeString(lineItem.productId);
    const lineItemTitle = normalizeString(lineItem.title).toLowerCase();

    if (configuredProductId && lineItemProductId === configuredProductId) {
      return true;
    }

    if (configuredProductTitle && lineItemTitle === configuredProductTitle) {
      return true;
    }

    return false;
  });
}

function extractShopierOrderEmail(payload: ShopierWebhookPayload) {
  return (
    normalizeEmail(payload.billingInfo?.email) ||
    normalizeEmail(payload.shippingInfo?.email) ||
    ""
  );
}

function extractShopierOrderName(payload: ShopierWebhookPayload) {
  const firstName =
    normalizeString(payload.billingInfo?.firstName) ||
    normalizeString(payload.shippingInfo?.firstName);
  const lastName =
    normalizeString(payload.billingInfo?.lastName) ||
    normalizeString(payload.shippingInfo?.lastName);

  return `${firstName} ${lastName}`.trim();
}

function upsertShopierOrderFromWebhook(payload: ShopierWebhookPayload) {
  const orderId = normalizeString(payload.id);
  const email = extractShopierOrderEmail(payload);

  if (!orderId || !email) {
    return null;
  }

  const existingOrder = billingStore.getOrderById(orderId);
  const currentSubscription = billingStore.getSubscriptionByEmail(email);
  const knownUser = getUserByEmail(email);
  const now = new Date();
  const nowIso = now.toISOString();

  const order: ShopierOrderRecord = {
    orderId,
    token: existingOrder?.token || crypto.randomBytes(24).toString("base64url"),
    userId:
      existingOrder?.userId ||
      currentSubscription?.userId ||
      knownUser?.id ||
      buildEmailScopedUserId(email),
    email,
    name:
      existingOrder?.name ||
      extractShopierOrderName(payload) ||
      knownUser?.name ||
      email,
    amount: parseCurrencyAmount(payload.totals?.total),
    currency:
      normalizeString(payload.currency) ||
      existingOrder?.currency ||
      getShopierCurrency(),
    status: existingOrder?.status || "pending",
    createdAt:
      normalizeString(payload.dateCreated) ||
      existingOrder?.createdAt ||
      nowIso,
    updatedAt: nowIso,
  };

  billingStore.upsertOrder(order);

  return order;
}

function activateSubscriptionFromOrder(order: ShopierOrderRecord) {
  const now = new Date();
  const nowIso = now.toISOString();
  const currentSubscription = billingStore.getSubscriptionByEmail(order.email);
  const currentActiveEndsAt =
    currentSubscription?.status === "active" &&
    currentSubscription.endsAt &&
    Date.parse(currentSubscription.endsAt) > now.getTime()
      ? new Date(currentSubscription.endsAt)
      : null;
  const endsAt = addDays(
    currentActiveEndsAt ?? now,
    getSubscriptionDurationDays()
  );
  const knownUser = getUserByEmail(order.email);

  const record: SubscriptionRecord = {
    userId: currentSubscription?.userId || knownUser?.id,
    email: order.email,
    provider: "shopier",
    status: "active",
    plan: "monthly",
    startedAt:
      currentSubscription?.status === "active" && currentSubscription.startedAt
        ? currentSubscription.startedAt
        : nowIso,
    endsAt: endsAt.toISOString(),
    updatedAt: nowIso,
    lastOrderId: order.orderId,
  };

  billingStore.upsertSubscription(record);
  billingStore.updateOrderStatus(order.orderId, "active", nowIso);

  return record;
}

function tryExtractOrderId(payload: ShopierWebhookPayload) {
  return normalizeString(payload.id);
}

function isPaidShopierOrder(payload: ShopierWebhookPayload) {
  const paymentStatus =
    normalizeString(payload.paymentStatus).toLowerCase() ||
    normalizeString(payload.status).toLowerCase();

  return paymentStatus === "paid";
}

function safeEqual(valueA: string, valueB: string) {
  const a = Buffer.from(valueA);
  const b = Buffer.from(valueB);

  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

function verifyShopierWebhook(
  req: express.Request,
  payload: ShopierWebhookPayload
) {
  const expectedToken = process.env.SHOPIER_WEBHOOK_TOKEN?.trim();

  if (!expectedToken) {
    return process.env.NODE_ENV !== "production";
  }

  const signature = normalizeString(req.header("shopier-signature"));
  const rawBody = (req as RequestWithRawBody).rawBody;

  if (signature && rawBody) {
    const calculatedSignature = crypto
      .createHmac("sha256", expectedToken)
      .update(rawBody)
      .digest("hex");

    if (!safeEqual(calculatedSignature, signature)) {
      return false;
    }

    const maxAgeSeconds = getShopierWebhookMaxAgeSeconds();
    const timestampText = normalizeString(req.header("shopier-timestamp"));
    if (timestampText && maxAgeSeconds > 0) {
      const webhookTs = Number(timestampText);
      if (!Number.isFinite(webhookTs)) {
        return false;
      }

      const ageSeconds = Math.abs(
        Math.floor(Date.now() / 1000) - Math.floor(webhookTs)
      );
      if (ageSeconds > maxAgeSeconds) {
        return false;
      }
    }

    return true;
  }

  if (!allowLegacyWebhookVerification()) {
    return false;
  }

  const bearerHeader = normalizeString(req.header("authorization"));
  const bearerToken = bearerHeader.toLowerCase().startsWith("bearer ")
    ? bearerHeader.slice(7).trim()
    : "";

  const requestTokenCandidates = [
    normalizeString(req.header("x-shopier-webhook-token")),
    bearerToken,
    normalizeString(payload.webhook_token),
  ].filter(Boolean);

  return requestTokenCandidates.some(candidate =>
    safeEqual(candidate, expectedToken)
  );
}

async function shopierApiRequest<T>(pathname: string, init: RequestInit = {}) {
  const pat = getShopierPat();
  if (!pat) {
    throw new Error("SHOPIER_PAT ayari eksik.");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${pat}`);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`https://api.shopier.com/v1${pathname}`, {
    ...init,
    headers,
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Shopier API ${response.status}: ${responseText || response.statusText}`
    );
  }

  return responseText ? (JSON.parse(responseText) as T) : (null as T);
}

async function listShopierWebhookSubscriptions() {
  return shopierApiRequest<ShopierWebhookSubscription[]>(
    "/webhooks?limit=50&page=1&sort=asc"
  );
}

async function createShopierWebhookSubscription(event: string, url: string) {
  return shopierApiRequest<ShopierWebhookSubscription>("/webhooks", {
    method: "POST",
    body: JSON.stringify({ event, url }),
  });
}

async function maybeBootstrapShopierWebhook() {
  if (process.env.SHOPIER_AUTO_REGISTER_WEBHOOK !== "true") {
    return;
  }

  const appBaseUrl = getConfiguredAppBaseUrl();
  if (!isPublicHttpsUrl(appBaseUrl)) {
    console.warn(
      "Shopier webhook bootstrap skipped: APP_BASE_URL must be a public HTTPS URL."
    );
    return;
  }

  if (!getShopierPat()) {
    console.warn("Shopier webhook bootstrap skipped: SHOPIER_PAT is missing.");
    return;
  }

  const webhookUrl = `${appBaseUrl.replace(/\/+$/, "")}/api/billing/shopier/webhook`;
  const existingSubscriptions = await listShopierWebhookSubscriptions();
  const existingSubscription = existingSubscriptions.find(
    subscription =>
      normalizeString(subscription.event) === "order.created" &&
      normalizeString(subscription.url) === webhookUrl
  );

  if (existingSubscription) {
    console.log(`Shopier webhook already registered at ${webhookUrl}`);
    return;
  }

  const createdSubscription = await createShopierWebhookSubscription(
    "order.created",
    webhookUrl
  );
  console.log(`Shopier webhook registered at ${webhookUrl}`);

  if (createdSubscription.token) {
    const configuredToken = process.env.SHOPIER_WEBHOOK_TOKEN?.trim();
    if (
      configuredToken &&
      !safeEqual(configuredToken, createdSubscription.token)
    ) {
      console.warn(
        "Shopier webhook token differs from SHOPIER_WEBHOOK_TOKEN. Update your runtime secret if needed."
      );
    } else if (!configuredToken) {
      console.warn(
        "Shopier webhook token created. Save it into SHOPIER_WEBHOOK_TOKEN."
      );
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  billingStore.pruneExpiredSessions();

  app.set("trust proxy", 1);
  app.use(
    express.json({
      verify: (req, _res, buffer) => {
        (req as RequestWithRawBody).rawBody = buffer.toString("utf8");
      },
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
      verify: (req, _res, buffer) => {
        (req as RequestWithRawBody).rawBody = buffer.toString("utf8");
      },
    })
  );

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.get("/api/auth/google", (req, res) => {
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
      billingStore.upsertUser(normalizedUser as AuthUserRecord);

      const session = createSession(normalizedUser.id);
      billingStore.upsertSession(session as SessionStoreRecord);

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
    setPrivateNoStore(res);
    const payload = readAuthPayload(req);
    res.status(200).json(payload);
  });

  app.post("/api/auth/logout", (req, res) => {
    if (isPublicAccessMode()) {
      clearCookie(req, res, COOKIE_NAME);
      res.status(204).send();
      return;
    }

    const cookies = parseCookies(req.headers.cookie);
    const sessionId = parseSessionIdFromCookie(cookies[COOKIE_NAME]);
    if (sessionId) {
      billingStore.deleteSession(sessionId);
    }

    clearCookie(req, res, COOKIE_NAME);
    res.status(204).send();
  });

  app.get("/api/billing/status", (req, res) => {
    setPrivateNoStore(res);
    if (isPublicAccessMode()) {
      const payload = readAuthPayload(req);
      res.status(200).json({
        membership: payload.membership,
        allowListOverride: false,
        managedSubscription: null,
        accessMode: payload.accessMode,
      });
      return;
    }

    const user = getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    const membership = resolveMembershipForUser(user);
    const managedSubscription = billingStore.getSubscriptionByEmail(
      normalizeEmail(user.email)
    );

    res.status(200).json({
      membership,
      allowListOverride: isSubscribedEmail(user.email),
      managedSubscription,
      accessMode: "managed" as AppAccessMode,
    });
  });

  app.post("/api/billing/shopier/checkout", (_req, res) => {
    res.status(410).json({
      error:
        "Shopier odeme akisi kapatildi. Paddle kurulumu tamamlaninca yeni odeme ekrani acilacak.",
    });
  });

  app.post("/api/billing/shopier/webhook", (_req, res) => {
    res.status(410).json({
      error:
        "Shopier webhook devre disi. Yeni odeme akisi Paddle uzerinden acilacak.",
    });
  });

  app.post("/api/i18n/translate", async (req, res) => {
    const body = (req.body ?? {}) as TranslationRequestBody;
    const source = normalizeTranslationLanguage(body.source, "tr");
    const target = normalizeTranslationLanguage(body.target, "en");

    const rawTexts = Array.isArray(body.texts) ? body.texts : [];
    const texts = Array.from(
      new Set(
        rawTexts
          .filter((value): value is string => typeof value === "string")
          .map(value => value.trim())
          .filter(Boolean)
      )
    ).slice(0, 120);

    if (!texts.length) {
      res.status(200).json({ translations: {} });
      return;
    }

    const translations: Record<string, string> = {};

    await Promise.all(
      texts.map(async text => {
        try {
          translations[text] = await translateText(text, source, target);
        } catch (error) {
          console.error("Translation fallback failed", {
            text,
            source,
            target,
            error,
          });
          translations[text] = text;
        }
      })
    );

    res.status(200).json({ translations });
  });

  app.get("/", (_req, res) => {
    res.status(200).type("html").send(renderLandingPageHtml());
  });

  app.get("/pricing", (_req, res) => {
    res.status(200).type("html").send(renderPricingPageHtml());
  });

  app.get("/terms", (_req, res) => {
    res.status(200).type("html").send(renderTermsPageHtml());
  });

  app.get("/privacy", (_req, res) => {
    res.status(200).type("html").send(renderPrivacyPageHtml());
  });

  app.get("/refund", (_req, res) => {
    res.status(200).type("html").send(renderRefundPageHtml());
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
    console.log(`Billing DB initialized at ${billingStore.dbPath}`);
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`App access mode: ${getAppAccessMode()}`);
    console.log(
      "Shopier billing routes disabled. Waiting for Paddle activation."
    );
  });
}

startServer().catch(console.error);
