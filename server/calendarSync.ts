import fs from "node:fs";
import path from "node:path";
import type {
  CalendarData,
  CalendarDayReport,
  CalendarEvent,
  CalendarImportance,
  CalendarOptionSetup,
  CalendarPipelineMetadata,
  CalendarPipelineStatus,
} from "../shared/calendar";

const DEFAULT_POLL_INTERVAL_MS = 60 * 1000;
const MIN_POLL_INTERVAL_MS = 30 * 1000;

interface RefreshOptions {
  force?: boolean;
}

interface LocatedSourceFile {
  filePath: string;
  modifiedAtIso: string;
  mtimeMs: number;
}

export interface CalendarSyncService {
  start: () => Promise<void>;
  stop: () => void;
  refresh: (options?: RefreshOptions) => Promise<CalendarData | null>;
  getSnapshot: () => CalendarData | null;
  getPipeline: () => CalendarPipelineMetadata;
}

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeImportance(value: unknown): CalendarImportance {
  const raw = normalizeString(value).toLowerCase();
  switch (raw) {
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return "low";
  }
}

function normalizeOptionalString(value: unknown): string | undefined {
  const raw = normalizeString(value);
  return raw || undefined;
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

function normalizeEvent(value: unknown, fallbackTimestamp: string): CalendarEvent | null {
  const source = extractObjectRecord(value);
  if (!source) {
    return null;
  }

  const id = normalizeString(source.id);
  const eventName = normalizeString(source.eventName ?? source.event_name);
  const country = normalizeString(source.country);
  const currency = normalizeString(source.currency);

  if (!id || !eventName || !country || !currency) {
    return null;
  }

  return {
    id,
    time: normalizeString(source.time) || "00:00",
    country,
    countryFlag: normalizeString(source.countryFlag ?? source.country_flag) || "🌍",
    eventName,
    importance: normalizeImportance(source.importance),
    previous: normalizeOptionalString(source.previous),
    forecast: normalizeOptionalString(source.forecast),
    actual: normalizeOptionalString(source.actual),
    currency,
    unit: normalizeOptionalString(source.unit),
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

  const highImportanceCount = events.filter(e => e.importance === "high").length;

  return {
    reportDate,
    generatedAt,
    title: title || `${reportDate} Economic Calendar`,
    summary: summary || "",
    events,
    highImportanceCount,
    optionSetups,
    vixOutlook: normalizeString(source.vixOutlook ?? source.vix_outlook),
    fearGreedOutlook: normalizeString(source.fearGreedOutlook ?? source.fear_greed_outlook),
    marketNarrative: normalizeString(source.marketNarrative ?? source.market_narrative),
  };
}

function resolvePollIntervalMs(configured: number | undefined) {
  if (configured === undefined || !Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_POLL_INTERVAL_MS;
  }

  return Math.max(MIN_POLL_INTERVAL_MS, Math.floor(configured));
}

function buildSourceCandidates(configuredSourceFile: string | null): string[] {
  const defaults = [
    path.resolve(process.cwd(), "..", "calendar", "calendar_forecast.json"),
    path.resolve(process.cwd(), "calendar", "calendar_forecast.json"),
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

interface CalendarSyncServiceOptions {
  sourceFile?: string;
  pollIntervalMs?: number;
}

export function createCalendarSyncService(options: CalendarSyncServiceOptions = {}): CalendarSyncService {
  const configuredSourceFile = normalizeString(options.sourceFile || process.env.CALENDAR_PIPELINE_SOURCE_FILE);
  const candidates = buildSourceCandidates(configuredSourceFile || null);
  const pollIntervalMs = resolvePollIntervalMs(options.pollIntervalMs ?? Number(process.env.CALENDAR_PIPELINE_POLL_INTERVAL_MS));

  let currentSnapshot: CalendarData | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let lastAttemptAt: string | null = null;
  let lastSyncedAt: string | null = null;
  let lastSourceModifiedAt: string | null = null;
  let resolvedSourceFile: string | null = null;
  let lastError: string | null = null;
  let lastKnownMtimeMs: number | null = null;
  let status: CalendarPipelineStatus = "idle";

  function getPipeline(): CalendarPipelineMetadata {
    return {
      configuredSourceFile: configuredSourceFile || null,
      resolvedSourceFile,
      pollIntervalMs,
      lastAttemptAt,
      lastSyncedAt,
      lastSourceModifiedAt,
      status,
      error: lastError || undefined,
    };
  }

  function attachPipeline(snapshot: CalendarData): CalendarData {
    return {
      ...snapshot,
      pipeline: getPipeline(),
    };
  }

  function buildSnapshot(report: CalendarDayReport): CalendarData {
    return {
      generatedAt: report.generatedAt,
      reportDate: report.reportDate,
      report,
      pipeline: getPipeline(),
    };
  }

  async function refresh(options: RefreshOptions = {}) {
    const locatedSource = locateSourceFile(candidates);
    lastAttemptAt = new Date().toISOString();

    if (!locatedSource) {
      lastError =
        "Calendar pipeline source file not found. Set CALENDAR_PIPELINE_SOURCE_FILE or generate calendar_forecast.json in the expected workspace.";
      status = currentSnapshot ? "stale" : "error";

      if (currentSnapshot) {
        currentSnapshot = attachPipeline(currentSnapshot);
      }

      return currentSnapshot;
    }

    resolvedSourceFile = locatedSource.filePath;
    lastSourceModifiedAt = locatedSource.modifiedAtIso;

    if (
      !options.force &&
      currentSnapshot &&
      lastKnownMtimeMs === locatedSource.mtimeMs
    ) {
      status = "ok";
      lastError = null;
      currentSnapshot = attachPipeline(currentSnapshot);
      return currentSnapshot;
    }

    try {
      const raw = fs.readFileSync(locatedSource.filePath, "utf8");

      if (!raw.trim()) {
        status = "idle";
        lastError = null;
        lastKnownMtimeMs = locatedSource.mtimeMs;
        currentSnapshot = currentSnapshot ? attachPipeline(currentSnapshot) : null;
        return currentSnapshot;
      }

      const parsed = JSON.parse(raw) as unknown;
      const report = normalizeCalendarDayReport(parsed, locatedSource.modifiedAtIso);

      if (!report) {
        throw new Error("Calendar payload could not be normalized.");
      }

      lastKnownMtimeMs = locatedSource.mtimeMs;
      lastSyncedAt = new Date().toISOString();
      lastError = null;
      status = "ok";
      currentSnapshot = attachPipeline(buildSnapshot(report));
      return currentSnapshot;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error.message
          : "Calendar payload could not be read.";
      status = currentSnapshot ? "stale" : "error";

      if (currentSnapshot) {
        currentSnapshot = attachPipeline(currentSnapshot);
      }

      return currentSnapshot;
    }
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
