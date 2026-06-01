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

function normalizeTranslationLanguage(value: unknown, fallback: TranslationLanguage) {
  if (value === "tr" || value === "en") {
    return value;
  }

  return fallback;
}

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
  const configured = Number(process.env.SHOPIER_SUBSCRIPTION_DAYS || DEFAULT_SUBSCRIPTION_DAYS);

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
    hasComma && hasDot ? clean.replace(/\./g, "").replace(",", ".") : clean.replace(",", ".");
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

function readAuthPayload(req: express.Request): AuthPayload {
  const user = getSessionUser(req);
  if (!user) {
    return {
      authenticated: false,
      user: null,
      membership: {
        plan: "guest",
        isSubscribed: false,
      },
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
      !["localhost", "127.0.0.1", "0.0.0.0"].includes(url.hostname.toLowerCase())
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
  const configuredProductTitle = getShopierSubscriptionProductTitle().toLowerCase();

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
    normalizeEmail(payload.billingInfo?.email) || normalizeEmail(payload.shippingInfo?.email) || ""
  );
}

function extractShopierOrderName(payload: ShopierWebhookPayload) {
  const firstName =
    normalizeString(payload.billingInfo?.firstName) || normalizeString(payload.shippingInfo?.firstName);
  const lastName =
    normalizeString(payload.billingInfo?.lastName) || normalizeString(payload.shippingInfo?.lastName);

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
    name: existingOrder?.name || extractShopierOrderName(payload) || knownUser?.name || email,
    amount: parseCurrencyAmount(payload.totals?.total),
    currency: normalizeString(payload.currency) || existingOrder?.currency || getShopierCurrency(),
    status: existingOrder?.status || "pending",
    createdAt: normalizeString(payload.dateCreated) || existingOrder?.createdAt || nowIso,
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
  const endsAt = addDays(currentActiveEndsAt ?? now, getSubscriptionDurationDays());
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

function verifyShopierWebhook(req: express.Request, payload: ShopierWebhookPayload) {
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

      const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - Math.floor(webhookTs));
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

  return requestTokenCandidates.some(candidate => safeEqual(candidate, expectedToken));
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
    throw new Error(`Shopier API ${response.status}: ${responseText || response.statusText}`);
  }

  return (responseText ? (JSON.parse(responseText) as T) : (null as T));
}

async function listShopierWebhookSubscriptions() {
  return shopierApiRequest<ShopierWebhookSubscription[]>("/webhooks?limit=50&page=1&sort=asc");
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
    console.warn("Shopier webhook bootstrap skipped: APP_BASE_URL must be a public HTTPS URL.");
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

  const createdSubscription = await createShopierWebhookSubscription("order.created", webhookUrl);
  console.log(`Shopier webhook registered at ${webhookUrl}`);

  if (createdSubscription.token) {
    const configuredToken = process.env.SHOPIER_WEBHOOK_TOKEN?.trim();
    if (configuredToken && !safeEqual(configuredToken, createdSubscription.token)) {
      console.warn(
        "Shopier webhook token differs from SHOPIER_WEBHOOK_TOKEN. Update your runtime secret if needed."
      );
    } else if (!configuredToken) {
      console.warn("Shopier webhook token created. Save it into SHOPIER_WEBHOOK_TOKEN.");
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
    const user = getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    const membership = resolveMembershipForUser(user);
    const managedSubscription = billingStore.getSubscriptionByEmail(normalizeEmail(user.email));

    res.status(200).json({
      membership,
      allowListOverride: isSubscribedEmail(user.email),
      managedSubscription,
    });
  });

  app.post("/api/billing/shopier/checkout", (req, res) => {
    const user = getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "Checkout icin giris yapmalisiniz." });
      return;
    }

    const body = (req.body ?? {}) as ShopierCheckoutRequestBody;
    const requestedPlan = normalizeString(body.plan || "monthly").toLowerCase() || "monthly";

    if (requestedPlan !== "monthly") {
      res.status(400).json({ error: "Su an sadece aylik plan destekleniyor." });
      return;
    }

    if (getActiveManagedSubscriptionByEmail(user.email)) {
      res.status(409).json({ error: "Aktif aboneliginiz zaten bulunuyor." });
      return;
    }

    const checkoutUrl = getConfiguredShopierCheckoutUrl();
    if (!checkoutUrl) {
      res.status(500).json({
        error:
          "SHOPIER_SUBSCRIPTION_PRODUCT_URL ayari eksik. Shopier urun veya odeme linkini tanimlayin.",
      });
      return;
    }

    const amount = getShopierMonthlyPrice();

    res.status(200).json({
      provider: "shopier",
      mode: "link",
      checkoutUrl,
      amount: amount > 0 ? amount : undefined,
      currency: getShopierCurrency(),
      productId: getShopierSubscriptionProductId() || undefined,
      productTitle: getShopierSubscriptionProductTitle() || undefined,
      requiresMatchingEmail: true,
    });
  });

  app.post("/api/billing/shopier/webhook", (req, res) => {
    const payload = (req.body ?? {}) as ShopierWebhookPayload;
    const shopierEvent = normalizeString(req.header("shopier-event")).toLowerCase();

    if (shopierEvent && shopierEvent !== "order.created") {
      res.status(200).json({ ok: true, status: "ignored_event", event: shopierEvent });
      return;
    }

    if (!verifyShopierWebhook(req, payload)) {
      res.status(403).json({ error: "Webhook dogrulamasi basarisiz." });
      return;
    }

    if (!isPaidShopierOrder(payload)) {
      res.status(202).json({ ok: true, status: "ignored_unpaid" });
      return;
    }

    const orderId = tryExtractOrderId(payload);
    if (!orderId) {
      res.status(400).json({ error: "order_id alani eksik." });
      return;
    }

    const orderEmail = extractShopierOrderEmail(payload);
    if (!orderEmail) {
      res.status(400).json({ error: "Siparis e-posta alani eksik." });
      return;
    }

    if (!isConfiguredShopierSubscriptionOrder(payload)) {
      res.status(200).json({
        ok: true,
        status: "ignored_non_subscription_order",
      });
      return;
    }

    const existingOrder = billingStore.getOrderById(orderId);
    if (existingOrder?.status === "active") {
      res.status(200).json({ ok: true, status: "already_processed" });
      return;
    }

    const existingSubscription = billingStore.getSubscriptionByLastOrderId(orderId);
    if (existingSubscription?.status === "active") {
      res.status(200).json({ ok: true, status: "already_processed" });
      return;
    }

    const order = upsertShopierOrderFromWebhook(payload);
    if (!order) {
      res.status(400).json({ error: "Siparis kaydi olusturulamadi." });
      return;
    }

    const activeSubscription = activateSubscriptionFromOrder(order);
    res.status(200).json({
      ok: true,
      status: "active",
      endsAt: activeSubscription.endsAt,
      email: orderEmail,
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
    void maybeBootstrapShopierWebhook().catch(error => {
      console.error("Shopier webhook bootstrap failed", error);
    });
  });
}

startServer().catch(console.error);
