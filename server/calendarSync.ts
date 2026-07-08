import fs from "node:fs";
import path from "node:path";
import type {
  CalendarActualSurprise,
  CalendarData,
  CalendarDayReport,
  CalendarEvent,
  CalendarEventStatus,
  CalendarImportance,
  CalendarLiveSyncMetadata,
  CalendarLiveSyncStatus,
  CalendarOptionSetup,
  CalendarPipelineMetadata,
  CalendarPipelineStatus,
} from "../shared/calendar";

const DEFAULT_POLL_INTERVAL_MS = 60 * 1000;
const DEFAULT_LIVE_SYNC_INTERVAL_MS = 30 * 1000;
const DEFAULT_LIVE_SYNC_TIMEOUT_MS = 25 * 1000;
const MIN_POLL_INTERVAL_MS = 30 * 1000;
const DEFAULT_LIVE_SYNC_URL =
  "https://sslecal2.forexprostools.com/?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=day&timeZone=63&lang=1";

const DEFAULT_FETCH_HEADERS = {
  "accept-language": "tr-TR,tr;q=0.9,en;q=0.8",
  referer: "https://tr.investing.com/",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
} satisfies Record<string, string>;

const HTML_ENTITY_MAP: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

const CURRENCY_FLAG_MAP: Record<string, string> = {
  AUD: "🇦🇺",
  BRL: "🇧🇷",
  CAD: "🇨🇦",
  CHF: "🇨🇭",
  CNY: "🇨🇳",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  HKD: "🇭🇰",
  INR: "🇮🇳",
  JPY: "🇯🇵",
  KRW: "🇰🇷",
  MXN: "🇲🇽",
  NOK: "🇳🇴",
  NZD: "🇳🇿",
  RUB: "🇷🇺",
  SEK: "🇸🇪",
  SGD: "🇸🇬",
  TRY: "🇹🇷",
  USD: "🇺🇸",
  ZAR: "🇿🇦",
};

const COUNTRY_FLAG_MAP: Record<string, string> = {
  australia: "🇦🇺",
  brazil: "🇧🇷",
  canada: "🇨🇦",
  china: "🇨🇳",
  eurozone: "🇪🇺",
  "euro zone": "🇪🇺",
  france: "🇫🇷",
  germany: "🇩🇪",
  hongkong: "🇭🇰",
  "hong kong": "🇭🇰",
  india: "🇮🇳",
  italy: "🇮🇹",
  japan: "🇯🇵",
  mexico: "🇲🇽",
  "new zealand": "🇳🇿",
  norway: "🇳🇴",
  russia: "🇷🇺",
  singapore: "🇸🇬",
  southkorea: "🇰🇷",
  "south korea": "🇰🇷",
  spain: "🇪🇸",
  sweden: "🇸🇪",
  switzerland: "🇨🇭",
  turkey: "🇹🇷",
  "united kingdom": "🇬🇧",
  "united states": "🇺🇸",
};

const NATIONALITY_TOKENS = new Set([
  "american",
  "australian",
  "british",
  "canadian",
  "chinese",
  "euro-zone",
  "eurozone",
  "french",
  "german",
  "indian",
  "italian",
  "japanese",
  "korean",
  "mexican",
  "spanish",
  "swiss",
  "turkish",
  "uk",
  "u.k.",
  "us",
  "u.s.",
]);

interface RefreshOptions {
  force?: boolean;
}

interface LocatedSourceFile {
  filePath: string;
  modifiedAtIso: string;
  mtimeMs: number;
}

interface SourceLoadResult {
  report: CalendarDayReport | null;
  error: string | null;
}

interface MergeResult {
  changed: boolean;
  lastCaptureAt: string | null;
  report: CalendarDayReport;
}

interface LiveSyncRuntimeState extends CalendarLiveSyncMetadata {
  lastRunAtMs: number;
}

export interface CalendarSyncService {
  start: () => Promise<void>;
  stop: () => void;
  refresh: (options?: RefreshOptions) => Promise<CalendarData | null>;
  getSnapshot: () => CalendarData | null;
  getPipeline: () => CalendarPipelineMetadata;
}

interface CalendarSyncServiceOptions {
  liveSyncEnabled?: boolean;
  liveSyncIntervalMs?: number;
  liveSyncTimeoutMs?: number;
  liveSyncUrl?: string;
  persistLiveSource?: boolean;
  pollIntervalMs?: number;
  sourceFile?: string;
}

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = normalizeString(value);
  return normalized || undefined;
}

function extractObjectRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function normalizeTimestamp(value: unknown, fallback: string) {
  const raw = normalizeString(value);
  if (!raw) {
    return fallback;
  }

  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : raw;
}

function resolvePollIntervalMs(configured: number | undefined) {
  if (configured === undefined || !Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_POLL_INTERVAL_MS;
  }

  return Math.max(MIN_POLL_INTERVAL_MS, Math.floor(configured));
}

function resolveLiveSyncIntervalMs(configured: number | undefined) {
  if (configured === undefined || !Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_LIVE_SYNC_INTERVAL_MS;
  }

  return Math.max(MIN_POLL_INTERVAL_MS, Math.floor(configured));
}

function resolveTimeoutMs(configured: number | undefined) {
  if (configured === undefined || !Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_LIVE_SYNC_TIMEOUT_MS;
  }

  return Math.max(5_000, Math.floor(configured));
}

function resolveBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = normalizeString(value).toLowerCase();
  if (!normalized) {
    return fallback;
  }

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function normalizeImportance(value: unknown): CalendarImportance {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 3) return "high";
    if (value <= 1) return "low";
    return "medium";
  }

  const raw = normalizeString(value).toLowerCase();
  switch (raw) {
    case "3":
    case "high":
    case "critical":
    case "yuksek":
    case "yüksek":
    case "***":
      return "high";
    case "2":
    case "medium":
    case "med":
    case "orta":
    case "**":
      return "medium";
    case "1":
    case "low":
    case "dusuk":
    case "düşük":
    case "*":
      return "low";
    default:
      return "low";
  }
}

function normalizeEventStatus(
  value: unknown,
  actual: string | undefined
): CalendarEventStatus {
  const raw = normalizeString(value).toLowerCase();
  if (raw === "cancelled" || raw === "canceled") {
    return "cancelled";
  }

  if (raw === "released") {
    return "released";
  }

  return actual ? "released" : "upcoming";
}

function parseNumberish(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value
    .replace(/\u2212/g, "-")
    .replace(/,/g, "")
    .trim();
  const match = normalized.match(/([+-]?\d+(?:\.\d+)?)\s*([kKmMbB%]?)$/);
  if (!match) {
    return null;
  }

  const numeric = Number(match[1]);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  const suffix = match[2].toLowerCase();
  const multiplier =
    suffix === "k" ? 1_000 : suffix === "m" ? 1_000_000 : suffix === "b" ? 1_000_000_000 : 1;
  return numeric * multiplier;
}

function computeSurprise(
  actual: string | undefined,
  forecast: string | undefined
): CalendarActualSurprise | undefined {
  const actualValue = parseNumberish(actual);
  const forecastValue = parseNumberish(forecast);
  if (actualValue === null || forecastValue === null) {
    return undefined;
  }

  const diff = Number((actualValue - forecastValue).toFixed(4));
  const pct =
    forecastValue === 0
      ? undefined
      : Number((((actualValue - forecastValue) / Math.abs(forecastValue)) * 100).toFixed(2));

  return {
    direction: diff === 0 ? "inline" : diff > 0 ? "above" : "below",
    diff,
    pct,
  };
}

function normalizeSurprise(value: unknown): CalendarActualSurprise | undefined {
  const source = extractObjectRecord(value);
  if (!source) {
    return undefined;
  }

  const directionRaw = normalizeString(source.direction).toLowerCase();
  const direction: CalendarActualSurprise["direction"] =
    directionRaw === "above"
      ? "above"
      : directionRaw === "below"
        ? "below"
        : "inline";

  const diff = Number(source.diff);
  const pct = source.pct === undefined ? undefined : Number(source.pct);
  if (!Number.isFinite(diff)) {
    return undefined;
  }

  return {
    direction,
    diff,
    pct: Number.isFinite(pct) ? pct : undefined,
  };
}

function buildEventId(time: string, country: string, eventName: string) {
  const slug = `${time}-${country}-${eventName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `event-${Date.now()}`;
}

function normalizeEvent(value: unknown, fallbackTimestamp: string): CalendarEvent | null {
  const source = extractObjectRecord(value);
  if (!source) {
    return null;
  }

  const eventName = normalizeString(source.eventName ?? source.event_name);
  const country = normalizeString(source.country);
  const currency = normalizeString(source.currency) || country;

  if (!eventName || !currency) {
    return null;
  }

  const rawId = source.id;
  const id =
    typeof rawId === "number"
      ? String(rawId)
      : normalizeString(rawId) || buildEventId(normalizeString(source.time), currency, eventName);

  const actual = normalizeOptionalString(source.actual);
  const forecast = normalizeOptionalString(source.forecast);
  const rawImpact = normalizeString(source.impactDirection ?? source.impact_direction).toLowerCase();
  let impactDirection: CalendarEvent["impactDirection"] = undefined;
  if (rawImpact === "positive") impactDirection = "positive";
  if (rawImpact === "negative") impactDirection = "negative";

  return {
    id,
    time: normalizeString(source.time) || "00:00",
    country: country || currency,
    countryFlag: normalizeString(source.countryFlag ?? source.country_flag) || CURRENCY_FLAG_MAP[currency] || "🌍",
    eventName,
    importance: normalizeImportance(source.importance),
    previous: normalizeOptionalString(source.previous),
    forecast,
    actual,
    currency,
    unit: normalizeOptionalString(source.unit),
    analysis: normalizeOptionalString(source.analysis),
    impactDirection,
    status: normalizeEventStatus(source.status, actual),
    actualCapturedAt: actual
      ? normalizeOptionalString(source.actualCapturedAt ?? source.actual_captured_at) ||
        fallbackTimestamp
      : normalizeOptionalString(source.actualCapturedAt ?? source.actual_captured_at),
    actualSurprise:
      normalizeSurprise(source.actualSurprise ?? source.actual_surprise) ||
      computeSurprise(actual, forecast),
  };
}

function normalizeOptionSetup(value: unknown): CalendarOptionSetup | null {
  const source = extractObjectRecord(value);
  if (!source) {
    return null;
  }

  const asset = normalizeString(source.asset);
  const trigger = normalizeString(source.trigger);
  const invalidation = normalizeString(source.invalidation);
  const setupType = normalizeString(source.setupType ?? source.setup_type);

  if (!asset || !trigger || !invalidation || !setupType) {
    return null;
  }

  const rawBias = normalizeString(source.bias).toLowerCase();
  let bias: CalendarOptionSetup["bias"] = "neutral";
  if (rawBias === "bullish") {
    bias = "bullish";
  } else if (rawBias === "bearish") {
    bias = "bearish";
  }

  return {
    asset,
    bias,
    trigger,
    invalidation,
    setupType,
    rationale: normalizeOptionalString(source.rationale),
  };
}

export function normalizeCalendarDayReport(
  value: unknown,
  fallbackTimestamp = new Date().toISOString()
): CalendarDayReport | null {
  const source = extractObjectRecord(value);
  if (!source) {
    return null;
  }

  const reportDate = normalizeString(source.reportDate ?? source.report_date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reportDate)) {
    return null;
  }

  const generatedAt = normalizeTimestamp(source.generatedAt ?? source.generated_at, fallbackTimestamp);
  const title = normalizeString(source.title);
  const summary = normalizeString(source.summary);

  const rawEvents = Array.isArray(source.events) ? source.events : [];
  const events = rawEvents
    .map(item => normalizeEvent(item, generatedAt))
    .filter((item): item is CalendarEvent => Boolean(item));

  const rawSetups = Array.isArray(source.optionSetups ?? source.option_setups)
    ? (source.optionSetups ?? source.option_setups)
    : [];
  const optionSetups = (rawSetups as unknown[])
    .map(item => normalizeOptionSetup(item))
    .filter((item): item is CalendarOptionSetup => Boolean(item));

  const highImportanceCount = events.filter(event => event.importance === "high").length;

  return {
    reportDate,
    generatedAt,
    title,
    summary,
    events,
    highImportanceCount,
    optionSetups,
    vixOutlook: normalizeString(source.vixOutlook ?? source.vix_outlook),
    fearGreedOutlook: normalizeString(source.fearGreedOutlook ?? source.fear_greed_outlook),
    marketNarrative: normalizeString(source.marketNarrative ?? source.market_narrative),
  };
}

function buildSourceCandidates(configuredSourceFile: string | null): string[] {
  const defaults = [
    path.resolve(process.cwd(), "..", "calendar", "calendar_forecast.json"),
    path.resolve(process.cwd(), "calendar", "calendar_forecast.json"),
    path.resolve(process.cwd(), "client", "public", "calendar", "calendar_forecast.json"),
    path.resolve(process.cwd(), "client", "public", "calendar_forecast.json"),
  ];

  return Array.from(
    new Set([configuredSourceFile, ...defaults].filter((item): item is string => Boolean(item)))
  );
}

function locateSourceFile(candidates: string[]): LocatedSourceFile | null {
  for (const filePath of candidates) {
    try {
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        continue;
      }

      return {
        filePath,
        modifiedAtIso: stats.mtime.toISOString(),
        mtimeMs: stats.mtimeMs,
      };
    } catch {
      continue;
    }
  }

  return null;
}

function getCurrentIstanbulDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find(part => part.type === "year")?.value || "0000";
  const month = parts.find(part => part.type === "month")?.value || "01";
  const day = parts.find(part => part.type === "day")?.value || "01";
  return `${year}-${month}-${day}`;
}

function getCurrentIstanbulHourMinute(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
  }).formatToParts(now);

  const hour = Number(parts.find(part => part.type === "hour")?.value || "0");
  const minute = Number(parts.find(part => part.type === "minute")?.value || "0");
  return hour * 60 + minute;
}

function decodeHtmlEntities(value: string) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_match, entity: string) => {
    const named = HTML_ENTITY_MAP[entity.toLowerCase()];
    if (named) {
      return named;
    }

    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      const code = Number.parseInt(entity.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : "";
    }

    if (entity.startsWith("#")) {
      const code = Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : "";
    }

    return "";
  });
}

function stripHtml(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractAttribute(tag: string, attribute: string) {
  const match = tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, "i"));
  return match?.[1] || "";
}

function extractCellInner(row: string, className: string) {
  const match = row.match(
    new RegExp(
      `<td[^>]*class=["'][^"']*\\b${escapeRegExp(className)}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/td>`,
      "i"
    )
  );

  return match?.[1] || "";
}

function extractCellText(row: string, className: string) {
  return stripHtml(extractCellInner(row, className));
}

function normalizeCountryLookupKey(value: string) {
  return value.toLowerCase().replace(/[^a-z]+/g, "");
}

function resolveCountryFlag(countryName: string, currency: string, row: string) {
  const flagTag = row.match(/<span[^>]*class=["'][^"']*\bceFlags\b[^"']*["'][^>]*>/i)?.[0] || "";
  const className = extractAttribute(flagTag, "class");
  const classTokens = className.split(/\s+/).filter(Boolean);
  const explicitCode = classTokens.find(token => /^[A-Z]{2}$/.test(token));
  if (explicitCode) {
    return explicitCode
      .split("")
      .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
      .join("");
  }

  const byName = COUNTRY_FLAG_MAP[normalizeCountryLookupKey(countryName)];
  if (byName) {
    return byName;
  }

  return CURRENCY_FLAG_MAP[currency] || "🌍";
}

function parseImportanceFromRow(row: string): CalendarImportance {
  const sentimentCell = extractCellInner(row, "sentiment");
  const imgKey = sentimentCell.match(/data-img_key=["'][^"']*bull(\d)[^"']*["']/i);
  if (imgKey) {
    return normalizeImportance(Number(imgKey[1]));
  }

  const fullBullishCount = (sentimentCell.match(/FullBullish/gi) || []).length;
  if (fullBullishCount > 0) {
    return normalizeImportance(fullBullishCount);
  }

  return "low";
}

function isActualEmpty(value: string | undefined) {
  const normalized = (value || "").trim().toLowerCase();
  return !normalized || ["-", "—", "–", "n/a", "na", "tbd"].includes(normalized);
}

function parseLiveCalendarEvents(html: string, reportDate: string) {
  const rows = html.match(/<tr\b[\s\S]*?<\/tr>/gi) || [];
  const events: CalendarEvent[] = [];
  let lastTime = "";

  for (const row of rows) {
    const eventName = extractCellText(row, "event");
    if (!eventName) {
      continue;
    }

    const time = extractCellText(row, "time") || lastTime;
    if (!time) {
      continue;
    }
    lastTime = time;

    const flagTag = row.match(/<span[^>]*class=["'][^"']*\bceFlags\b[^"']*["'][^>]*>/i)?.[0] || "";
    const countryName =
      extractAttribute(flagTag, "title") ||
      extractAttribute(flagTag, "data-country") ||
      extractCellText(row, "flagCur");
    const currency = extractCellText(row, "flagCur") || countryName || "N/A";

    const actual = normalizeOptionalString(extractCellText(row, "act"));
    const forecast = normalizeOptionalString(extractCellText(row, "fore"));
    const previous = normalizeOptionalString(extractCellText(row, "prev"));
    const countryFlag = resolveCountryFlag(countryName, currency, row);

    events.push({
      id: buildEventId(time, currency, eventName),
      time,
      country: currency,
      countryFlag,
      eventName,
      importance: parseImportanceFromRow(row),
      previous,
      forecast,
      actual,
      currency,
      status: isActualEmpty(actual) ? "upcoming" : "released",
      actualCapturedAt: isActualEmpty(actual) ? undefined : new Date().toISOString(),
      actualSurprise: computeSurprise(actual, forecast),
    });
  }

  return events.filter(event => /^\d{1,2}:\d{2}$/.test(event.time) && event.currency !== "N/A");
}

function compareImportance(left: CalendarImportance, right: CalendarImportance) {
  const order: Record<CalendarImportance, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return order[left] - order[right];
}

function timeToMinutes(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return Number.POSITIVE_INFINITY;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function compareEvents(left: CalendarEvent, right: CalendarEvent) {
  const timeDelta = timeToMinutes(left.time) - timeToMinutes(right.time);
  if (timeDelta !== 0) {
    return timeDelta;
  }

  const importanceDelta = compareImportance(left.importance, right.importance);
  if (importanceDelta !== 0) {
    return importanceDelta;
  }

  return left.eventName.localeCompare(right.eventName);
}

function normalizeMatchValue(value: string | undefined) {
  return (value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}%]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripNationalityTokens(value: string) {
  const parts = normalizeMatchValue(value).split(" ").filter(Boolean);
  const stripped = parts.filter(part => !NATIONALITY_TOKENS.has(part));
  return stripped.join(" ") || parts.join(" ");
}

function similarity(left: string, right: string) {
  if (!left || !right) {
    return 0;
  }

  const leftParts = new Set(left.split(" ").filter(Boolean));
  const rightParts = new Set(right.split(" ").filter(Boolean));
  let intersection = 0;
  for (const part of leftParts) {
    if (rightParts.has(part)) {
      intersection += 1;
    }
  }

  return (2 * intersection) / (leftParts.size + rightParts.size);
}

function findMatchingEvent(candidate: CalendarEvent, existing: CalendarEvent[]) {
  const candidateName = normalizeMatchValue(candidate.eventName);
  const candidateStripped = stripNationalityTokens(candidate.eventName);

  let exact: CalendarEvent | null = null;
  let stripped: CalendarEvent | null = null;
  let fuzzy: { event: CalendarEvent; score: number } | null = null;

  for (const event of existing) {
    if (event.time !== candidate.time || event.currency !== candidate.currency) {
      continue;
    }

    const eventName = normalizeMatchValue(event.eventName);
    if (eventName === candidateName) {
      exact = event;
      break;
    }

    if (stripNationalityTokens(event.eventName) === candidateStripped) {
      stripped = event;
      continue;
    }

    const score = similarity(stripNationalityTokens(event.eventName), candidateStripped);
    if (!fuzzy || score > fuzzy.score) {
      fuzzy = { event, score };
    }
  }

  if (exact) {
    return exact;
  }

  if (stripped) {
    return stripped;
  }

  return fuzzy && fuzzy.score >= 0.8 ? fuzzy.event : null;
}

function copyEvent(event: CalendarEvent): CalendarEvent {
  return {
    ...event,
    actualSurprise: event.actualSurprise ? { ...event.actualSurprise } : undefined,
  };
}

function mergeEventFields(
  target: CalendarEvent,
  incoming: CalendarEvent,
  capturedAtIso: string
) {
  let changed = false;
  let captured = false;

  const patchIfDifferent = <K extends keyof CalendarEvent>(key: K, nextValue: CalendarEvent[K]) => {
    if (nextValue === undefined || target[key] === nextValue) {
      return;
    }

    target[key] = nextValue;
    changed = true;
  };

  patchIfDifferent("time", incoming.time);
  patchIfDifferent("country", incoming.country);
  patchIfDifferent("countryFlag", incoming.countryFlag);
  patchIfDifferent("eventName", incoming.eventName);
  patchIfDifferent("importance", incoming.importance);
  patchIfDifferent("previous", incoming.previous);
  patchIfDifferent("forecast", incoming.forecast);
  patchIfDifferent("currency", incoming.currency);
  patchIfDifferent("unit", incoming.unit);

  const currentActual = target.actual;
  const nextActual = incoming.actual;
  if (nextActual !== undefined && currentActual !== nextActual) {
    target.actual = nextActual;
    target.actualCapturedAt = capturedAtIso;
    target.status = isActualEmpty(nextActual) ? "upcoming" : "released";
    target.actualSurprise = computeSurprise(nextActual, incoming.forecast ?? target.forecast);
    changed = true;
    captured = !isActualEmpty(nextActual);
  } else if (!isActualEmpty(nextActual) && !target.actualCapturedAt) {
    target.actualCapturedAt = capturedAtIso;
    target.status = "released";
    target.actualSurprise = computeSurprise(nextActual, incoming.forecast ?? target.forecast);
    changed = true;
    captured = true;
  } else if (target.actual && !target.actualSurprise) {
    target.actualSurprise = computeSurprise(target.actual, target.forecast);
  }

  if (!target.status) {
    target.status = normalizeEventStatus(undefined, target.actual);
  }

  return { captured, changed };
}

function mergeLiveEventsIntoReport(
  baseReport: CalendarDayReport | null,
  liveEvents: CalendarEvent[],
  reportDate: string,
  generatedAt: string
): MergeResult {
  const sameDayBase = baseReport && baseReport.reportDate === reportDate ? baseReport : null;
  const nextEvents = sameDayBase ? sameDayBase.events.map(copyEvent) : [];
  let changed = !sameDayBase;
  let lastCaptureAt: string | null = null;

  for (const liveEvent of liveEvents) {
    const match = sameDayBase ? findMatchingEvent(liveEvent, nextEvents) : null;
    if (!match) {
      const nextEvent = copyEvent(liveEvent);
      if (!isActualEmpty(nextEvent.actual)) {
        nextEvent.actualCapturedAt = generatedAt;
        nextEvent.actualSurprise = computeSurprise(nextEvent.actual, nextEvent.forecast);
        lastCaptureAt = generatedAt;
      } else {
        nextEvent.actualCapturedAt = undefined;
        nextEvent.actualSurprise = undefined;
      }
      nextEvent.status = normalizeEventStatus(undefined, nextEvent.actual);
      nextEvents.push(nextEvent);
      changed = true;
      continue;
    }

    const merged = mergeEventFields(match, liveEvent, generatedAt);
    if (merged.changed) {
      changed = true;
    }
    if (merged.captured) {
      lastCaptureAt = generatedAt;
    }
  }

  const reportEvents = (sameDayBase ? nextEvents : liveEvents.map(copyEvent))
    .map(event => ({
      ...event,
      status: normalizeEventStatus(event.status, event.actual),
      actualSurprise:
        event.actualSurprise ||
        computeSurprise(event.actual, event.forecast),
    }))
    .sort(compareEvents);

  const report: CalendarDayReport = {
    reportDate,
    generatedAt: changed ? generatedAt : sameDayBase?.generatedAt || generatedAt,
    title: sameDayBase?.title || "",
    summary: sameDayBase?.summary || "",
    events: reportEvents,
    highImportanceCount: reportEvents.filter(event => event.importance === "high").length,
    optionSetups: sameDayBase?.optionSetups || [],
    vixOutlook: sameDayBase?.vixOutlook || "",
    fearGreedOutlook: sameDayBase?.fearGreedOutlook || "",
    marketNarrative: sameDayBase?.marketNarrative || "",
  };

  return {
    changed,
    lastCaptureAt,
    report,
  };
}

function readSourceReport(locatedSource: LocatedSourceFile | null): SourceLoadResult {
  if (!locatedSource) {
    return { report: null, error: null };
  }

  try {
    const raw = fs.readFileSync(locatedSource.filePath, "utf8");
    if (!raw.trim()) {
      return { report: null, error: null };
    }

    const parsed = JSON.parse(raw) as unknown;
    const report = normalizeCalendarDayReport(parsed, locatedSource.modifiedAtIso);
    if (!report) {
      return {
        report: null,
        error: "Calendar payload could not be normalized.",
      };
    }

    return {
      report,
      error: null,
    };
  } catch (error) {
    return {
      report: null,
      error: error instanceof Error ? error.message : "Calendar payload could not be read.",
    };
  }
}

function resolveWritableSourceFile(
  configuredSourceFile: string | null,
  resolvedSourceFile: string | null,
  candidates: string[]
) {
  return (
    resolvedSourceFile ||
    configuredSourceFile ||
    candidates.find(candidate => candidate.includes(`${path.sep}calendar${path.sep}`)) ||
    candidates[0] ||
    null
  );
}

function writeReportAtomically(filePath: string, report: CalendarDayReport) {
  const payload = `${JSON.stringify(report, null, 2)}\n`;
  const tempPath = `${filePath}.tmp`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(tempPath, payload, "utf8");
  fs.renameSync(tempPath, filePath);
  return fs.statSync(filePath);
}

function buildSnapshot(report: CalendarDayReport, pipeline: CalendarPipelineMetadata): CalendarData {
  return {
    generatedAt: report.generatedAt,
    reportDate: report.reportDate,
    report,
    pipeline,
  };
}

function isReportCurrent(report: CalendarDayReport | null) {
  if (!report) {
    return false;
  }

  return report.reportDate === getCurrentIstanbulDate();
}

function refreshLiveSyncNextEvents(
  liveSync: LiveSyncRuntimeState,
  report: CalendarDayReport | null
) {
  if (!report) {
    liveSync.nextEventTime = null;
    liveSync.nextHighImpactEventTime = null;
    return;
  }

  const nowMinutes = getCurrentIstanbulHourMinute();
  const pending = report.events
    .filter(event => isActualEmpty(event.actual) && /^\d{1,2}:\d{2}$/.test(event.time))
    .sort(compareEvents);

  const nextEvent =
    pending.find(event => timeToMinutes(event.time) >= nowMinutes) || pending[0] || null;
  const nextHighImpactEvent =
    pending.find(
      event => event.importance === "high" && timeToMinutes(event.time) >= nowMinutes
    ) ||
    pending.find(event => event.importance === "high") ||
    null;

  liveSync.nextEventTime = nextEvent?.time || null;
  liveSync.nextHighImpactEventTime = nextHighImpactEvent?.time || null;
}

function cloneLiveSyncMetadata(liveSync: LiveSyncRuntimeState): CalendarLiveSyncMetadata {
  return {
    enabled: liveSync.enabled,
    provider: liveSync.provider,
    status: liveSync.status,
    lastAttemptAt: liveSync.lastAttemptAt,
    lastSuccessAt: liveSync.lastSuccessAt,
    lastCaptureAt: liveSync.lastCaptureAt,
    nextEventTime: liveSync.nextEventTime,
    nextHighImpactEventTime: liveSync.nextHighImpactEventTime,
    error: liveSync.error,
  };
}

async function fetchLiveCalendarEvents(
  url: string,
  timeoutMs: number,
  reportDate: string
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: DEFAULT_FETCH_HEADERS,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Live calendar upstream returned HTTP ${response.status}.`);
    }

    const html = await response.text();
    const events = parseLiveCalendarEvents(html, reportDate);
    if (!events.length) {
      throw new Error("Live calendar upstream returned no parsable events.");
    }

    return events;
  } finally {
    clearTimeout(timer);
  }
}

export function createCalendarSyncService(
  options: CalendarSyncServiceOptions = {}
): CalendarSyncService {
  const configuredSourceFile = normalizeString(
    options.sourceFile || process.env.CALENDAR_PIPELINE_SOURCE_FILE
  );
  const candidates = buildSourceCandidates(configuredSourceFile || null);
  const pollIntervalMs = resolvePollIntervalMs(
    options.pollIntervalMs ?? Number(process.env.CALENDAR_PIPELINE_POLL_INTERVAL_MS)
  );
  const liveSyncEnabled = resolveBoolean(
    options.liveSyncEnabled ?? process.env.CALENDAR_PIPELINE_ENABLE_LIVE_SYNC,
    true
  );
  const liveSyncIntervalMs = resolveLiveSyncIntervalMs(
    options.liveSyncIntervalMs ?? Number(process.env.CALENDAR_PIPELINE_LIVE_SYNC_INTERVAL_MS)
  );
  const liveSyncTimeoutMs = resolveTimeoutMs(
    options.liveSyncTimeoutMs ?? Number(process.env.CALENDAR_PIPELINE_LIVE_SYNC_TIMEOUT_MS)
  );
  const liveSyncUrl =
    normalizeString(options.liveSyncUrl || process.env.CALENDAR_PIPELINE_LIVE_SYNC_URL) ||
    DEFAULT_LIVE_SYNC_URL;
  const persistLiveSource = resolveBoolean(
    options.persistLiveSource ?? process.env.CALENDAR_PIPELINE_PERSIST_LIVE_SOURCE,
    true
  );

  let currentSnapshot: CalendarData | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let lastAttemptAt: string | null = null;
  let lastSyncedAt: string | null = null;
  let lastSourceModifiedAt: string | null = null;
  let resolvedSourceFile: string | null = null;
  let lastError: string | null = null;
  let lastKnownMtimeMs: number | null = null;
  let status: CalendarPipelineStatus = "idle";

  const liveSync: LiveSyncRuntimeState = {
    enabled: liveSyncEnabled,
    provider: "forexprostools",
    status: "idle",
    lastAttemptAt: null,
    lastSuccessAt: null,
    lastCaptureAt: null,
    nextEventTime: null,
    nextHighImpactEventTime: null,
    lastRunAtMs: 0,
  };

  function getPipeline(): CalendarPipelineMetadata {
    return {
      configuredSourceFile: configuredSourceFile || null,
      resolvedSourceFile,
      pollIntervalMs,
      lastAttemptAt,
      lastSyncedAt,
      lastSourceModifiedAt,
      status,
      liveSync: cloneLiveSyncMetadata(liveSync),
      error: lastError || undefined,
    };
  }

  function attachPipeline(snapshot: CalendarData): CalendarData {
    return {
      ...snapshot,
      pipeline: getPipeline(),
    };
  }

  async function refresh(options: RefreshOptions = {}) {
    const now = new Date();
    const nowIso = now.toISOString();
    const today = getCurrentIstanbulDate(now);
    lastAttemptAt = nowIso;

    const locatedSource = locateSourceFile(candidates);
    resolvedSourceFile = locatedSource?.filePath || configuredSourceFile || resolvedSourceFile;
    lastSourceModifiedAt = locatedSource?.modifiedAtIso || lastSourceModifiedAt;

    const shouldReadSource =
      options.force ||
      !currentSnapshot ||
      (locatedSource ? lastKnownMtimeMs !== locatedSource.mtimeMs : currentSnapshot === null);
    const shouldRunLiveSync =
      liveSync.enabled &&
      (options.force ||
        !currentSnapshot ||
        liveSync.lastRunAtMs === 0 ||
        Date.now() - liveSync.lastRunAtMs >= liveSyncIntervalMs);

    if (!shouldReadSource && !shouldRunLiveSync && currentSnapshot) {
      refreshLiveSyncNextEvents(liveSync, currentSnapshot.report || null);
      currentSnapshot = attachPipeline(currentSnapshot);
      return currentSnapshot;
    }

    let sourceReport: CalendarDayReport | null =
      currentSnapshot?.report && currentSnapshot.reportDate === today
        ? currentSnapshot.report
        : null;
    let sourceError: string | null = null;

    if (shouldReadSource) {
      const loaded = readSourceReport(locatedSource);
      sourceError = loaded.error;
      if (loaded.report) {
        sourceReport = loaded.report;
      }
      if (locatedSource) {
        lastKnownMtimeMs = locatedSource.mtimeMs;
      }
    }

    let nextReport: CalendarDayReport | null = sourceReport;
    let nextError: string | null = sourceError;

    if (shouldRunLiveSync) {
      liveSync.lastAttemptAt = nowIso;
      liveSync.lastRunAtMs = Date.now();

      try {
        const liveEvents = await fetchLiveCalendarEvents(liveSyncUrl, liveSyncTimeoutMs, today);
        const merged = mergeLiveEventsIntoReport(
          sourceReport,
          liveEvents,
          today,
          nowIso
        );

        nextReport = merged.report;
        refreshLiveSyncNextEvents(liveSync, nextReport);
        liveSync.status = "ok";
        liveSync.lastSuccessAt = nowIso;
        liveSync.error = undefined;
        if (merged.lastCaptureAt) {
          liveSync.lastCaptureAt = merged.lastCaptureAt;
        }

        if (persistLiveSource && (merged.changed || !locatedSource || sourceReport?.reportDate !== today)) {
          const writableSource = resolveWritableSourceFile(
            configuredSourceFile || null,
            resolvedSourceFile,
            candidates
          );
          if (writableSource) {
            const stats = writeReportAtomically(writableSource, merged.report);
            resolvedSourceFile = writableSource;
            lastSourceModifiedAt = stats.mtime.toISOString();
            lastKnownMtimeMs = stats.mtimeMs;
          }
        }

        lastSyncedAt = nowIso;
        nextError = null;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Live calendar sync failed.";
        liveSync.status = "error";
        liveSync.error = message;
        nextError = message;
      }
    } else {
      refreshLiveSyncNextEvents(liveSync, nextReport);
    }

    if (!nextReport && currentSnapshot?.report) {
      nextReport = currentSnapshot.report;
    }

    if (!nextReport) {
      lastError = nextError || sourceError;
      status = lastError ? "error" : "idle";
      if (currentSnapshot) {
        currentSnapshot = attachPipeline(currentSnapshot);
      }
      return currentSnapshot;
    }

    if (!lastSyncedAt) {
      lastSyncedAt = nowIso;
    }

    if (liveSync.enabled) {
      if (liveSync.status === "ok") {
        status = isReportCurrent(nextReport) ? "ok" : "stale";
        lastError = nextError || null;
      } else if (liveSync.status === "error") {
        status = currentSnapshot || sourceReport ? "stale" : "error";
        lastError = nextError || sourceError;
      }
    } else {
      status = isReportCurrent(nextReport) ? "ok" : "stale";
      lastError = sourceError;
    }

    currentSnapshot = attachPipeline(buildSnapshot(nextReport, getPipeline()));
    return currentSnapshot;
  }

  async function start() {
    await refresh({ force: true });

    if (timer) {
      clearInterval(timer);
    }

    timer = setInterval(() => {
      void refresh();
    }, pollIntervalMs);
    timer.unref?.();

    console.log(
      `Calendar pipeline sync active (${Math.round(pollIntervalMs / 1000)}s interval).`
    );
    if (resolvedSourceFile) {
      console.log(`Calendar pipeline source: ${resolvedSourceFile}`);
    }
    if (liveSync.enabled) {
      console.log(
        `Calendar live sync active (${Math.round(liveSyncIntervalMs / 1000)}s interval, provider=${liveSync.provider}).`
      );
    }
  }

  function stop() {
    if (!timer) {
      return;
    }

    clearInterval(timer);
    timer = null;
  }

  function getSnapshot() {
    return currentSnapshot ? attachPipeline(currentSnapshot) : null;
  }

  return {
    start,
    stop,
    refresh,
    getSnapshot,
    getPipeline,
  };
}
