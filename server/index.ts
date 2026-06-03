import express from "express";
import { createServer } from "http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import type {
  AgentRunRecord,
  OpportunityRecord,
  OpportunityTier,
  WatchlistRecord,
} from "../shared/opportunities";
import type {
  DailyReportContent,
  DailyReportRecord,
} from "../shared/dailyReports";
import type {
  MomentumReportContent,
  MomentumReportEntry,
  MomentumReportRecord,
} from "../shared/momentumReports";
import type {
  WeeklyDirectionalBias,
  WeeklyEarningsTime,
  WeeklyIvCrushPotential,
  WeeklyReportContent,
  WeeklyReportEntry,
  WeeklyReportRecord,
  WeeklyReportStatus,
  WeeklyRiskLevel,
  WeeklyStrategyRating,
} from "../shared/weeklyReports";
import {
  createBillingStore,
  type AuthUserRecord,
  type ShopierOrderRecord,
  type SessionStoreRecord,
  type SubscriptionRecord,
} from "./billingStore";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";
import {
  buildInitialWeeklyReports,
  buildSystemSuggestedWeeklyReports,
} from "./weeklyReportSeeds";
import {
  buildLiveWeeklyReportSuggestions,
  getAdminMarketDataStatus,
  isFmpConfigured,
} from "./adminMarketData";
import {
  buildDailyReportRecordFromSource,
  getDailyReportRootPath,
  getDailyReportSourcePackage,
  listDailyReportSourcePackages,
} from "./dailyReportSources";

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

interface WeeklyReportUpsertRequestBody {
  report?: unknown;
}

interface MomentumReportUpsertRequestBody {
  report?: unknown;
}

interface DailyReportUpsertRequestBody {
  report?: unknown;
}

interface WatchlistUpsertRequestBody {
  ticker?: unknown;
  notes?: unknown;
  alertOnOpportunity?: unknown;
}

interface AgentTriggerRequestBody {
  agentType?: unknown;
  tickers?: unknown;
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

function ensureWeeklyReportSeeds() {
  if (billingStore.listWeeklyReports().length > 0) {
    return;
  }

  for (const report of buildInitialWeeklyReports()) {
    billingStore.upsertWeeklyReport(report);
  }
}

ensureWeeklyReportSeeds();
ensureOpportunitiesSeed();

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

function getWeeklyReportAdminEmail() {
  return normalizeEmail(process.env.REPORT_ADMIN_EMAIL || "hsnksc@gmail.com");
}

function getWeeklyReportAdminSecret() {
  return normalizeString(process.env.REPORT_ADMIN_SECRET);
}

function normalizeIsoDate(value: unknown, fallback = "2026-06-01") {
  const raw = normalizeString(value);
  if (!raw) {
    return fallback;
  }

  const match = raw.match(/^\d{4}-\d{2}-\d{2}$/);
  if (!match) {
    return fallback;
  }

  return raw;
}

function normalizeIsoDateTime(value: unknown, fallback: string) {
  const raw = normalizeString(value);
  if (!raw) {
    return fallback;
  }

  const parsed = Date.parse(raw);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return new Date(parsed).toISOString();
}

function normalizeNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const raw = normalizeString(value);
  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => normalizeString(item))
    .filter(Boolean)
    .slice(0, 12);
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function isValidEnumValue<T extends string>(
  value: string,
  allowed: readonly T[],
  fallback: T
) {
  return (allowed.includes(value as T) ? value : fallback) as T;
}

function normalizeWeeklyReportEntry(
  value: unknown,
  fallbackTicker: string,
  index: number
) {
  const source =
    value && typeof value === "object"
      ? (value as Partial<Record<keyof WeeklyReportEntry, unknown>>)
      : {};
  const ticker = normalizeString(source.ticker) || fallbackTicker || `STK${index + 1}`;
  const earningsDate = normalizeIsoDate(source.earningsDate, "2026-06-01");

  return {
    id:
      normalizeString(source.id) ||
      `${ticker.toLowerCase()}-${earningsDate}-${index + 1}`,
    ticker,
    name: normalizeString(source.name) || ticker,
    sector: normalizeString(source.sector) || "Technology",
    earningsDate,
    earningsTime: isValidEnumValue(
      normalizeString(source.earningsTime),
      ["AMC", "BMO", "AH", "BH"] as const,
      "AH"
    ) as WeeklyEarningsTime,
    momentumScore: normalizeNumber(source.momentumScore, 70),
    priceChange6M: normalizeNumber(source.priceChange6M, 0),
    rsi14: normalizeNumber(source.rsi14, 50),
    currentIV: normalizeNumber(source.currentIV, 70),
    historicalIV: normalizeNumber(source.historicalIV, 55),
    impliedMove: normalizeNumber(source.impliedMove, 8),
    expectedIVCrush: normalizeNumber(source.expectedIVCrush, 30),
    ivCrushPotential: isValidEnumValue(
      normalizeString(source.ivCrushPotential),
      ["HIGH", "MEDIUM", "LOW"] as const,
      "MEDIUM"
    ) as WeeklyIvCrushPotential,
    callPremiumBuy: normalizeNumber(source.callPremiumBuy, 1.5),
    callPremiumSell: normalizeNumber(source.callPremiumSell, 4),
    callGainFromIV: normalizeNumber(source.callGainFromIV, 110),
    putPremiumBuy: normalizeNumber(source.putPremiumBuy, 1.5),
    putPremiumSell: normalizeNumber(source.putPremiumSell, 4),
    putGainFromIV: normalizeNumber(source.putGainFromIV, 110),
    ivCrushScore: normalizeNumber(source.ivCrushScore, 70),
    strategyRating: isValidEnumValue(
      normalizeString(source.strategyRating),
      ["EXCELLENT", "GOOD", "FAIR", "POOR"] as const,
      "GOOD"
    ) as WeeklyStrategyRating,
    riskLevel: isValidEnumValue(
      normalizeString(source.riskLevel),
      ["LOW", "MEDIUM", "HIGH", "VERY_HIGH"] as const,
      "MEDIUM"
    ) as WeeklyRiskLevel,
    earningsMissRisk: normalizeNumber(source.earningsMissRisk, 25),
    gapRisk: normalizeNumber(source.gapRisk, 25),
    recommendedStrategy:
      normalizeString(source.recommendedStrategy) || "Bull Call Spread",
    targetProfit: normalizeNumber(source.targetProfit, 100),
    maxLoss: normalizeNumber(source.maxLoss, 25),
    lastEarningsMove: normalizeNumber(source.lastEarningsMove, 6),
    historicalIVCrush: normalizeNumber(source.historicalIVCrush, 28),
    beatRate: normalizeNumber(source.beatRate, 70),
    thesis: normalizeString(source.thesis) || `${ticker} icin admin notu bekleniyor.`,
    directionalBias: isValidEnumValue(
      normalizeString(source.directionalBias),
      ["Bullish", "Bearish", "Neutral"] as const,
      "Neutral"
    ) as WeeklyDirectionalBias,
  } satisfies WeeklyReportEntry;
}

function normalizeWeeklyReportContent(value: unknown, title: string) {
  const source =
    value && typeof value === "object"
      ? (value as Partial<Record<keyof WeeklyReportContent, unknown>>)
      : {};
  const rawEntries = Array.isArray(source.entries) ? source.entries : [];
  const entries = rawEntries
    .map((entry, index) =>
      normalizeWeeklyReportEntry(entry, `STK${index + 1}`, index)
    )
    .sort((left, right) => right.ivCrushScore - left.ivCrushScore);

  return {
    headline:
      normalizeString(source.headline) ||
      `${title} icin haftalik earnings ve IV crush oyunu`,
    summary:
      normalizeString(source.summary) ||
      "Haftalik rapor yayina alinmadi. Admin ozet notlarini girecek.",
    marketContext:
      normalizeString(source.marketContext) ||
      "Makro baglam notlari admin tarafindan guncellenecek.",
    executionNotes:
      normalizeString(source.executionNotes) ||
      "Pozisyon boyutu ve risk limiti notlari admin tarafindan guncellenecek.",
    keyCatalysts: normalizeStringArray(source.keyCatalysts),
    entries,
  } satisfies WeeklyReportContent;
}

function normalizeWeeklyReportRecordInput(
  value: unknown,
  previousRecord?: WeeklyReportRecord | null
) {
  const nowIso = new Date().toISOString();
  const source =
    value && typeof value === "object"
      ? (value as Partial<Record<keyof WeeklyReportRecord, unknown>>)
      : {};

  const weekStart = normalizeIsoDate(
    source.weekStart,
    previousRecord?.weekStart || "2026-06-01"
  );
  const weekEnd = normalizeIsoDate(
    source.weekEnd,
    previousRecord?.weekEnd || weekStart
  );
  const title =
    normalizeString(source.title) || previousRecord?.title || "Yeni Haftalik Rapor";
  const status = isValidEnumValue(
    normalizeString(source.status),
    ["draft", "published"] as const,
    previousRecord?.status || "draft"
  ) as WeeklyReportStatus;
  const content = normalizeWeeklyReportContent(
    source.content,
    title
  );
  const publishedAt =
    status === "published"
      ? normalizeIsoDateTime(
          source.publishedAt,
          previousRecord?.publishedAt || nowIso
        )
      : undefined;

  return {
    id:
      normalizeString(source.id) ||
      previousRecord?.id ||
      crypto.randomUUID(),
    slug:
      normalizeString(source.slug) ||
      previousRecord?.slug ||
      slugify(`${weekStart}-${title}`),
    title,
    weekStart,
    weekEnd,
    analysisDate: normalizeIsoDateTime(
      source.analysisDate,
      previousRecord?.analysisDate || nowIso
    ),
    status,
    authorEmail:
      previousRecord?.authorEmail || getWeeklyReportAdminEmail(),
    createdAt: previousRecord?.createdAt || nowIso,
    updatedAt: nowIso,
    publishedAt,
    content,
  } satisfies WeeklyReportRecord;
}

function normalizeMomentumReportEntry(
  value: unknown,
  index: number
) {
  const source =
    value && typeof value === "object"
      ? (value as Partial<Record<keyof MomentumReportEntry, unknown>>)
      : {};
  const ticker = normalizeString(source.ticker).toUpperCase() || `STK${index + 1}`;

  return {
    id:
      normalizeString(source.id) || `${ticker.toLowerCase()}-${index + 1}`,
    ticker,
    name: normalizeString(source.name) || ticker,
    sector: normalizeString(source.sector) || "Technology",
    currentPrice: normalizeNumber(source.currentPrice, 0),
    priceChangePct: normalizeNumber(source.priceChangePct, 0),
    volumeRatio: normalizeNumber(source.volumeRatio, 1),
    rsi: normalizeNumber(source.rsi, 50),
    score: normalizeNumber(source.score, 50),
    signal: normalizeString(source.signal) || "NEUTRAL",
    confidenceScore: normalizeNumber(source.confidenceScore, 0),
    targetPrice: normalizeNumber(source.targetPrice, 0) || undefined,
    catalystSummary: normalizeString(source.catalystSummary) || undefined,
    adminNote: normalizeString(source.adminNote) || undefined,
  } satisfies MomentumReportEntry;
}

function normalizeMomentumReportContent(value: unknown, title: string) {
  const source =
    value && typeof value === "object"
      ? (value as Partial<Record<keyof MomentumReportContent, unknown>>)
      : {};
  const rawEntries = Array.isArray(source.featuredEntries)
    ? source.featuredEntries
    : [];

  return {
    headline:
      normalizeString(source.headline) ||
      `${title} icin yayinlanmis momentum snapshot`,
    summary:
      normalizeString(source.summary) ||
      "Momentum workspace yayina alinmadi. Admin ozet notlari girecek.",
    marketContext:
      normalizeString(source.marketContext) ||
      "Piyasa baglami admin tarafindan doldurulacak.",
    executionNotes:
      normalizeString(source.executionNotes) ||
      "Execution notlari admin tarafindan doldurulacak.",
    scannerUniverse:
      normalizeString(source.scannerUniverse) || "Default liquid universe",
    scanTime: normalizeString(source.scanTime) || undefined,
    featuredEntries: rawEntries
      .map((entry, index) => normalizeMomentumReportEntry(entry, index))
      .sort((left, right) => right.score - left.score),
  } satisfies MomentumReportContent;
}

function normalizeMomentumReportRecordInput(
  value: unknown,
  previousRecord?: MomentumReportRecord | null
) {
  const nowIso = new Date().toISOString();
  const source =
    value && typeof value === "object"
      ? (value as Partial<Record<keyof MomentumReportRecord, unknown>>)
      : {};
  const title =
    normalizeString(source.title) || previousRecord?.title || "Momentum Snapshot";
  const status = isValidEnumValue(
    normalizeString(source.status),
    ["draft", "published"] as const,
    previousRecord?.status || "draft"
  ) as MomentumReportRecord["status"];

  return {
    id: normalizeString(source.id) || previousRecord?.id || crypto.randomUUID(),
    slug:
      normalizeString(source.slug) ||
      previousRecord?.slug ||
      slugify(title),
    title,
    reportDate: normalizeIsoDate(
      source.reportDate,
      previousRecord?.reportDate || nowIso.slice(0, 10)
    ),
    status,
    authorEmail: previousRecord?.authorEmail || getWeeklyReportAdminEmail(),
    createdAt: previousRecord?.createdAt || nowIso,
    updatedAt: nowIso,
    publishedAt:
      status === "published"
        ? normalizeIsoDateTime(
            source.publishedAt,
            previousRecord?.publishedAt || nowIso
          )
        : undefined,
    content: normalizeMomentumReportContent(source.content, title),
  } satisfies MomentumReportRecord;
}

function normalizeDailyReportContent(value: unknown, title: string) {
  const source =
    value && typeof value === "object"
      ? (value as Partial<Record<keyof DailyReportContent, unknown>>)
      : {};

  const executiveSummary = Array.isArray(source.executiveSummary)
    ? source.executiveSummary
        .filter((item): item is string => typeof item === "string")
        .map(item => item.trim())
        .filter(Boolean)
    : [];
  const sectionFiles = Array.isArray(source.sectionFiles)
    ? source.sectionFiles
        .filter((item): item is string => typeof item === "string")
        .map(item => item.trim())
        .filter(Boolean)
    : [];
  const figureFiles = Array.isArray(source.figureFiles)
    ? source.figureFiles
        .filter((item): item is string => typeof item === "string")
        .map(item => item.trim())
        .filter(Boolean)
    : [];
  const tickerUniverse = Array.isArray(source.tickerUniverse)
    ? source.tickerUniverse
        .filter((item): item is string => typeof item === "string")
        .map(item => item.trim().toUpperCase())
        .filter(Boolean)
    : [];

  return {
    headline:
      normalizeString(source.headline) || `${title} icin yayinlanmis daily report`,
    author: normalizeString(source.author) || undefined,
    coverage: normalizeString(source.coverage) || undefined,
    methodology: normalizeString(source.methodology) || undefined,
    executiveSummary,
    markdown: normalizeString(source.markdown),
    sectionFiles,
    figureFiles,
    tickerUniverse,
    researchFileCount: normalizeNumber(source.researchFileCount, 0),
  } satisfies DailyReportContent;
}

function normalizeDailyReportRecordInput(
  value: unknown,
  previousRecord?: DailyReportRecord | null
) {
  const nowIso = new Date().toISOString();
  const source =
    value && typeof value === "object"
      ? (value as Partial<Record<keyof DailyReportRecord, unknown>>)
      : {};
  const title =
    normalizeString(source.title) || previousRecord?.title || "Daily Report";
  const status = isValidEnumValue(
    normalizeString(source.status),
    ["draft", "published"] as const,
    previousRecord?.status || "draft"
  ) as DailyReportRecord["status"];

  return {
    id: normalizeString(source.id) || previousRecord?.id || crypto.randomUUID(),
    slug:
      normalizeString(source.slug) ||
      previousRecord?.slug ||
      slugify(title),
    title,
    reportDate: normalizeIsoDate(
      source.reportDate,
      previousRecord?.reportDate || nowIso.slice(0, 10)
    ),
    status,
    authorEmail: previousRecord?.authorEmail || getWeeklyReportAdminEmail(),
    sourceFolder:
      normalizeString(source.sourceFolder) || previousRecord?.sourceFolder || "",
    createdAt: previousRecord?.createdAt || nowIso,
    updatedAt: nowIso,
    publishedAt:
      status === "published"
        ? normalizeIsoDateTime(
            source.publishedAt,
            previousRecord?.publishedAt || nowIso
          )
        : undefined,
    content: normalizeDailyReportContent(source.content, title),
  } satisfies DailyReportRecord;
}

function getReportAdminRequestSecret(req: express.Request) {
  return normalizeString(req.header("x-gistify-admin-secret"));
}

function isWeeklyReportAdminRequest(req: express.Request) {
  const adminEmail = getWeeklyReportAdminEmail();
  const sessionUser = getSessionUser(req);

  if (sessionUser && normalizeEmail(sessionUser.email) === adminEmail) {
    return true;
  }

  const configuredSecret = getWeeklyReportAdminSecret();
  const requestSecret = getReportAdminRequestSecret(req);
  if (!configuredSecret || !requestSecret) {
    return false;
  }

  return safeEqual(configuredSecret, requestSecret);
}

function requireWeeklyReportAdmin(
  req: express.Request,
  res: express.Response
) {
  if (isWeeklyReportAdminRequest(req)) {
    return true;
  }

  res.status(403).json({
    error: "Admin yetkisi gerekli.",
    adminEmail: getWeeklyReportAdminEmail(),
  });
  return false;
}

function getCurrentWeekStart(referenceDate = new Date()) {
  const next = new Date(referenceDate);
  next.setUTCHours(0, 0, 0, 0);
  const day = next.getUTCDay() || 7;
  next.setUTCDate(next.getUTCDate() - day + 1);
  return next;
}

function getViewerWeeklyReports(referenceDate = new Date()) {
  const currentWeekStart = getCurrentWeekStart(referenceDate);
  const candidates = billingStore
    .listWeeklyReports()
    .filter(report => report.status === "published")
    .filter(report => Date.parse(`${report.weekEnd}T23:59:59Z`) >= currentWeekStart.getTime())
    .sort(
      (left, right) =>
        Date.parse(`${left.weekStart}T00:00:00Z`) -
        Date.parse(`${right.weekStart}T00:00:00Z`)
    )
    .slice(0, 2);

  return candidates.sort(
    (left, right) =>
      Date.parse(`${right.weekStart}T00:00:00Z`) -
      Date.parse(`${left.weekStart}T00:00:00Z`)
  );
}

function getViewerDailyReports(limit = 10) {
  return billingStore
    .listDailyReports()
    .filter(report => report.status === "published")
    .sort((left, right) => right.reportDate.localeCompare(left.reportDate))
    .slice(0, limit);
}

function getRequestActor(req: express.Request) {
  const payload = readAuthPayload(req);
  if (!payload.authenticated || !payload.user) {
    return null;
  }

  return {
    id: payload.user.id,
    email: payload.user.email,
    name: payload.user.name,
    accessMode: payload.accessMode,
    membership: payload.membership,
  };
}

function getTierLevel(tier: OpportunityTier) {
  if (tier === "elite") {
    return 2;
  }

  if (tier === "pro") {
    return 1;
  }

  return 0;
}

function resolveOpportunityTier(req: express.Request): OpportunityTier {
  const actor = getRequestActor(req);
  if (isWeeklyReportAdminRequest(req)) {
    return "elite";
  }

  if (!actor) {
    return "free";
  }

  if (getEliteEmailSet().has(normalizeEmail(actor.email))) {
    return "elite";
  }

  return actor.membership.isSubscribed ? "pro" : "free";
}

function getEliteEmailSet() {
  return new Set(
    (process.env.ELITE_EMAILS || "")
      .split(",")
      .map(value => value.trim().toLowerCase())
      .filter(Boolean)
  );
}

function resolveOpportunityTierRequired(ivCrushScore: number): OpportunityTier {
  if (ivCrushScore >= 92) {
    return "elite";
  }

  if (ivCrushScore >= 78) {
    return "pro";
  }

  return "free";
}

function resolveOpportunityWindow(daysToEarnings: number) {
  if (daysToEarnings <= 1) {
    return "pre_earnings_1d" as const;
  }

  if (daysToEarnings <= 3) {
    return "pre_earnings_3d" as const;
  }

  return "pre_earnings_7d" as const;
}

function resolveOpportunityConfidence(compositeScore: number) {
  if (compositeScore >= 85) {
    return "high" as const;
  }

  if (compositeScore >= 70) {
    return "medium" as const;
  }

  return "low" as const;
}

function calculateOpportunityCompositeScore(entry: WeeklyReportEntry) {
  const momentum = Math.max(0, Math.min(100, entry.momentumScore));
  const iv = Math.max(
    0,
    Math.min(100, entry.ivCrushScore * 0.55 + entry.expectedIVCrush * 0.45)
  );
  const earningsQuality = Math.max(
    0,
    Math.min(100, entry.beatRate * 0.7 + (100 - entry.earningsMissRisk) * 0.3)
  );
  const riskAdjusted = Math.max(
    0,
    Math.min(100, 100 - entry.gapRisk * 0.55 - entry.maxLoss * 0.45)
  );

  return Math.round(
    momentum * 0.3 +
      iv * 0.3 +
      earningsQuality * 0.2 +
      riskAdjusted * 0.2
  );
}

function buildOpportunityFromWeeklyEntry(
  report: WeeklyReportRecord,
  entry: WeeklyReportEntry,
  referenceDate = new Date()
) {
  const earningsTimestamp = Date.parse(`${entry.earningsDate}T00:00:00Z`);
  const nowTimestamp = Date.parse(
    `${referenceDate.toISOString().slice(0, 10)}T00:00:00Z`
  );
  const daysToEarnings = Math.max(
    0,
    Math.round((earningsTimestamp - nowTimestamp) / (1000 * 60 * 60 * 24))
  );
  const compositeScore = calculateOpportunityCompositeScore(entry);
  const nowIso = new Date().toISOString();

  return {
    id: `opp-${report.id}-${entry.ticker.toLowerCase()}`,
    sourceReportId: report.id,
    sourceReportTitle: report.title,
    ticker: entry.ticker,
    name: entry.name,
    sector: entry.sector,
    earningsDate: entry.earningsDate,
    earningsTime: entry.earningsTime,
    daysToEarnings,
    opportunityWindow: resolveOpportunityWindow(daysToEarnings),
    momentumScore: entry.momentumScore,
    priceChange6M: entry.priceChange6M,
    rsi14: entry.rsi14,
    currentIV: entry.currentIV,
    historicalIV: entry.historicalIV,
    impliedMovePercent: entry.impliedMove,
    expectedIVCrush: entry.expectedIVCrush,
    ivCrushScore: entry.ivCrushScore,
    beatRate: entry.beatRate,
    maxLossPercent: entry.maxLoss,
    targetProfitPercent: entry.targetProfit,
    earningsMissRisk: entry.earningsMissRisk,
    gapRisk: entry.gapRisk,
    compositeScore,
    confidenceLevel: resolveOpportunityConfidence(compositeScore),
    directionalBias: entry.directionalBias,
    strategyType: "iv_crush",
    strategyRating: entry.ivCrushScore,
    recommendedStrategy: entry.recommendedStrategy,
    aiSummary: report.content.summary,
    aiStrategyRationale: entry.thesis,
    aiKeyCatalysts: report.content.keyCatalysts,
    aiExecutionNotes: report.content.executionNotes,
    riskWarnings: [
      `${entry.ticker} gap risk: ${entry.gapRisk}%`,
      `${entry.ticker} earnings miss risk: ${entry.earningsMissRisk}%`,
    ],
    dataSources: ["weekly_report_manual"],
    tierRequired: resolveOpportunityTierRequired(entry.ivCrushScore),
    status:
      Date.parse(`${report.weekEnd}T23:59:59Z`) < Date.now()
        ? "expired"
        : "active",
    createdAt: nowIso,
    updatedAt: nowIso,
    expiresAt: `${report.weekEnd}T23:59:59.000Z`,
  } satisfies OpportunityRecord;
}

function syncOpportunitiesFromPublishedWeeklyReports(options?: {
  tickers?: Set<string>;
}) {
  const reports = billingStore
    .listWeeklyReports()
    .filter(report => report.status === "published");
  let count = 0;

  for (const report of reports) {
    for (const entry of report.content.entries) {
      if (options?.tickers?.size && !options.tickers.has(entry.ticker)) {
        continue;
      }

      billingStore.upsertOpportunity(
        buildOpportunityFromWeeklyEntry(report, entry)
      );
      count += 1;
    }
  }

  return count;
}

function filterOpportunitiesForTier(
  opportunities: OpportunityRecord[],
  tier: OpportunityTier
) {
  const tierLevel = getTierLevel(tier);
  return opportunities.filter(
    opportunity => getTierLevel(opportunity.tierRequired) <= tierLevel
  );
}

function ensureOpportunitiesSeed() {
  syncOpportunitiesFromPublishedWeeklyReports();
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
  app.use(
    "/api/daily-report/assets",
    express.static(getDailyReportRootPath(), {
      fallthrough: false,
      index: false,
      redirect: false,
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

  app.get("/api/opportunities", (req, res) => {
    setPrivateNoStore(res);
    const tier = resolveOpportunityTier(req);
    const minScore = normalizeNumber(req.query.minScore, 0);
    const strategy = normalizeString(req.query.strategy);
    const sector = normalizeString(req.query.sector);
    const days = normalizeNumber(req.query.days, 0);
    const page = Math.max(1, normalizeNumber(req.query.page, 1));
    const limit = Math.min(50, Math.max(1, normalizeNumber(req.query.limit, 20)));
    const offset = (page - 1) * limit;

    const filtered = filterOpportunitiesForTier(
      billingStore
        .listOpportunities()
        .filter(opportunity => opportunity.status === "active")
        .filter(opportunity => opportunity.compositeScore >= minScore)
        .filter(opportunity =>
          strategy ? opportunity.strategyType === strategy : true
        )
        .filter(opportunity => (sector ? opportunity.sector === sector : true))
        .filter(opportunity =>
          days > 0 ? opportunity.daysToEarnings <= days : true
        ),
      tier
    );

    const items = filtered.slice(offset, offset + limit);
    res.status(200).json({
      data: items,
      meta: {
        total: filtered.length,
        page,
        limit,
        hasMore: filtered.length > offset + items.length,
        tier,
      },
    });
  });

  app.get("/api/opportunities/:id/related", (req, res) => {
    setPrivateNoStore(res);
    const tier = resolveOpportunityTier(req);
    const opportunityId = normalizeString(req.params.id);
    const opportunity = billingStore
      .listOpportunities()
      .find(item => item.id === opportunityId);

    if (!opportunity) {
      res.status(404).json({ error: "Firsat bulunamadi." });
      return;
    }

    const allowedItems = filterOpportunitiesForTier(
      billingStore
        .listOpportunities()
        .filter(item => item.status === "active")
        .filter(item => item.id !== opportunity.id)
        .filter(item => item.sector === opportunity.sector)
        .sort((left, right) => right.compositeScore - left.compositeScore),
      tier
    ).slice(0, 4);

    res.status(200).json({
      data: allowedItems,
      meta: {
        tier,
        sourceOpportunityId: opportunity.id,
      },
    });
  });

  app.get("/api/opportunities/:id", (req, res) => {
    setPrivateNoStore(res);
    const tier = resolveOpportunityTier(req);
    const opportunityId = normalizeString(req.params.id);
    const opportunity = billingStore
      .listOpportunities()
      .find(item => item.id === opportunityId);

    if (!opportunity) {
      res.status(404).json({ error: "Firsat bulunamadi." });
      return;
    }

    const allowedItems = filterOpportunitiesForTier([opportunity], tier);
    if (!allowedItems.length) {
      res.status(403).json({
        error: "Bu firsat daha yuksek uyelik seviyesi gerektiriyor.",
        required: opportunity.tierRequired,
        current: tier,
      });
      return;
    }

    res.status(200).json({
      data: opportunity,
      meta: {
        tier,
      },
    });
  });

  app.get(["/api/watchlist", "/api/me/watchlist"], (req, res) => {
    setPrivateNoStore(res);
    const actor = getRequestActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    res.status(200).json({
      items: billingStore.listWatchlistByUserId(actor.id),
    });
  });

  app.post(["/api/watchlist", "/api/me/watchlist"], (req, res) => {
    setPrivateNoStore(res);
    const actor = getRequestActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    const body = (req.body ?? {}) as WatchlistUpsertRequestBody;
    const ticker = normalizeString(body.ticker).toUpperCase();
    if (!ticker) {
      res.status(400).json({ error: "Ticker gerekli." });
      return;
    }

    const nowIso = new Date().toISOString();
    const record: WatchlistRecord = {
      id: crypto.randomUUID(),
      userId: actor.id,
      email: actor.email,
      ticker,
      notes: normalizeString(body.notes) || undefined,
      alertOnOpportunity: body.alertOnOpportunity !== false,
      addedAt: nowIso,
      updatedAt: nowIso,
    };

    billingStore.upsertWatchlist(record);
    res.status(201).json({
      item: record,
      items: billingStore.listWatchlistByUserId(actor.id),
    });
  });

  app.patch(
    ["/api/watchlist/:ticker", "/api/me/watchlist/:ticker"],
    (req, res) => {
      setPrivateNoStore(res);
      const actor = getRequestActor(req);
      if (!actor) {
        res.status(401).json({ error: "Oturum gerekli." });
        return;
      }

      const ticker = normalizeString(req.params.ticker).toUpperCase();
      if (!ticker) {
        res.status(400).json({ error: "Ticker gerekli." });
        return;
      }

      const existing = billingStore
        .listWatchlistByUserId(actor.id)
        .find(item => item.ticker === ticker);
      if (!existing) {
        res.status(404).json({ error: "Watchlist kaydi bulunamadi." });
        return;
      }

      const body = (req.body ?? {}) as WatchlistUpsertRequestBody;
      const updatedRecord: WatchlistRecord = {
        ...existing,
        notes: normalizeString(body.notes) || undefined,
        alertOnOpportunity: body.alertOnOpportunity !== false,
        updatedAt: new Date().toISOString(),
      };

      billingStore.upsertWatchlist(updatedRecord);
      res.status(200).json({
        item: updatedRecord,
        items: billingStore.listWatchlistByUserId(actor.id),
      });
    }
  );

  app.delete(
    ["/api/watchlist/:ticker", "/api/me/watchlist/:ticker"],
    (req, res) => {
      setPrivateNoStore(res);
      const actor = getRequestActor(req);
      if (!actor) {
        res.status(401).json({ error: "Oturum gerekli." });
        return;
      }

      const ticker = normalizeString(req.params.ticker).toUpperCase();
      if (!ticker) {
        res.status(400).json({ error: "Ticker gerekli." });
        return;
      }

      billingStore.deleteWatchlist(actor.id, ticker);
      res.status(200).json({
        items: billingStore.listWatchlistByUserId(actor.id),
      });
    }
  );

  app.get("/api/admin/agents/runs", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      runs: billingStore.listAgentRuns(),
    });
  });

  app.post("/api/admin/agents/trigger", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const body = (req.body ?? {}) as AgentTriggerRequestBody;
    const agentType = normalizeString(body.agentType) || "full_scan";
    const tickerList = Array.isArray(body.tickers)
      ? body.tickers
          .filter((value): value is string => typeof value === "string")
          .map(value => normalizeString(value).toUpperCase())
          .filter(Boolean)
      : [];
    const tickerSet = tickerList.length ? new Set(tickerList) : undefined;
    const startedAt = new Date().toISOString();
    const runId = crypto.randomUUID();

    const runningRecord: AgentRunRecord = {
      id: runId,
      runType: agentType,
      status: "running",
      tickersScanned: tickerSet?.size || 0,
      opportunitiesFound: 0,
      errors: [],
      log:
        tickerList.length > 0
          ? `Manual ${agentType} run for tickers: ${tickerList.join(", ")}`
          : `Manual ${agentType} run for published weekly reports`,
      retryCount: 0,
      startedAt,
    };

    billingStore.upsertAgentRun(runningRecord);

    try {
      const opportunitiesFound = syncOpportunitiesFromPublishedWeeklyReports({
        tickers: tickerSet,
      });
      const completedRecord: AgentRunRecord = {
        ...runningRecord,
        status: "success",
        tickersScanned: tickerSet?.size || opportunitiesFound,
        opportunitiesFound,
        log: `${runningRecord.log}. Projection sync completed successfully.`,
        completedAt: new Date().toISOString(),
      };

      billingStore.upsertAgentRun(completedRecord);
      res.status(201).json({
        run: completedRecord,
        runs: billingStore.listAgentRuns(),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Agent run basarisiz oldu.";
      const failedRecord: AgentRunRecord = {
        ...runningRecord,
        status: "failed",
        errors: [message],
        log: `${runningRecord.log}. Projection sync failed.`,
        completedAt: new Date().toISOString(),
      };

      billingStore.upsertAgentRun(failedRecord);
      res.status(500).json({
        error: message,
        run: failedRecord,
      });
    }
  });

  app.get("/api/daily-reports", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      reports: getViewerDailyReports(),
    });
  });

  app.get("/api/daily-reports/latest", (_req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      report: billingStore.getLatestPublishedDailyReport(),
    });
  });

  app.get("/api/admin/daily-report-sources", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      sources: listDailyReportSourcePackages().map(source => ({
        id: source.id,
        folderName: source.folderName,
        reportDate: source.reportDate,
        title: source.title,
        headline: source.headline,
        author: source.author,
        coverage: source.coverage,
        methodology: source.methodology,
        executiveSummary: source.executiveSummary,
        sectionFiles: source.sectionFiles,
        figureFiles: source.figureFiles,
        tickerUniverse: source.tickerUniverse,
        researchFileCount: source.researchFileCount,
        updatedAt: source.updatedAt,
      })),
    });
  });

  app.get("/api/admin/daily-report-sources/:folderName", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const folderName = normalizeString(req.params.folderName);
    const source = getDailyReportSourcePackage(folderName);
    if (!source) {
      res.status(404).json({ error: "Daily report source bulunamadi." });
      return;
    }

    res.status(200).json({ source });
  });

  app.get("/api/admin/daily-reports", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      reports: billingStore.listDailyReports(),
      latestPublished: billingStore.getLatestPublishedDailyReport(),
    });
  });

  app.post("/api/admin/daily-reports", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const body = (req.body ?? {}) as DailyReportUpsertRequestBody;
    const rawReport = body.report;
    const draftSource =
      rawReport && typeof rawReport === "object"
        ? (rawReport as Partial<Record<keyof DailyReportRecord, unknown>>)
        : undefined;
    const reportId = draftSource ? normalizeString(draftSource.id) : "";
    const previousRecord = reportId
      ? billingStore.getDailyReportById(reportId)
      : null;
    const report = normalizeDailyReportRecordInput(rawReport, previousRecord);

    billingStore.upsertDailyReport(report);
    res.status(previousRecord ? 200 : 201).json({
      report,
      reports: billingStore.listDailyReports(),
      latestPublished: billingStore.getLatestPublishedDailyReport(),
    });
  });

  app.get("/api/reports/weekly", (req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      reports: getViewerWeeklyReports(),
      admin: {
        authorized: isWeeklyReportAdminRequest(req),
        email: getWeeklyReportAdminEmail(),
      },
    });
  });

  app.get("/api/admin/reports/weekly", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      reports: billingStore.listWeeklyReports(),
      admin: {
        authorized: true,
        email: getWeeklyReportAdminEmail(),
      },
    });
  });

  app.get("/api/admin/workspace/status", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      providers: getAdminMarketDataStatus(),
      env: {
        fmpConfigured: isFmpConfigured(),
      },
    });
  });

  app.get("/api/admin/reports/weekly/suggestions", async (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const existingReports = billingStore.listWeeklyReports();

    try {
      const liveSuggestions = await buildLiveWeeklyReportSuggestions(
        existingReports,
        getWeeklyReportAdminEmail()
      );

      if (liveSuggestions.length > 0) {
        res.status(200).json({
          suggestions: liveSuggestions,
          providers: getAdminMarketDataStatus(),
          mode: "live",
        });
        return;
      }
    } catch (error) {
      console.error("Live weekly report suggestion build failed", error);
    }

    res.status(200).json({
      suggestions: buildSystemSuggestedWeeklyReports(existingReports),
      providers: getAdminMarketDataStatus(),
      mode: "fallback",
    });
  });

  app.post("/api/admin/reports/weekly", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const body = (req.body ?? {}) as WeeklyReportUpsertRequestBody;
    const rawReport = body.report;
    const draftSource =
      rawReport && typeof rawReport === "object"
        ? (rawReport as Partial<Record<keyof WeeklyReportRecord, unknown>>)
        : undefined;
    const reportId = draftSource ? normalizeString(draftSource.id) : "";
    const previousRecord = reportId
      ? billingStore.getWeeklyReportById(reportId)
      : null;
    const report = normalizeWeeklyReportRecordInput(rawReport, previousRecord);

    billingStore.upsertWeeklyReport(report);
    syncOpportunitiesFromPublishedWeeklyReports();

    res.status(previousRecord ? 200 : 201).json({
      report,
      reports: billingStore.listWeeklyReports(),
    });
  });

  app.get("/api/momentum/reports/latest", (req, res) => {
    setPrivateNoStore(res);
    res.status(200).json({
      report: billingStore.getLatestPublishedMomentumReport(),
    });
  });

  app.get("/api/admin/momentum/reports", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    res.status(200).json({
      reports: billingStore.listMomentumReports(),
      latestPublished: billingStore.getLatestPublishedMomentumReport(),
    });
  });

  app.post("/api/admin/momentum/reports", (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    const body = (req.body ?? {}) as MomentumReportUpsertRequestBody;
    const rawReport = body.report;
    const draftSource =
      rawReport && typeof rawReport === "object"
        ? (rawReport as Partial<Record<keyof MomentumReportRecord, unknown>>)
        : undefined;
    const reportId = draftSource ? normalizeString(draftSource.id) : "";
    const previousRecord = reportId
      ? billingStore.getMomentumReportById(reportId)
      : null;
    const report = normalizeMomentumReportRecordInput(rawReport, previousRecord);

    billingStore.upsertMomentumReport(report);
    res.status(previousRecord ? 200 : 201).json({
      report,
      reports: billingStore.listMomentumReports(),
      latestPublished: billingStore.getLatestPublishedMomentumReport(),
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
