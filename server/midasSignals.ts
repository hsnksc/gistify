import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import type {
  MidasActionSignal,
  MidasPipelineMetadata,
  MidasRiskLevel,
  MidasSignalLayers,
  MidasSignalRecord,
  MidasSignalsData,
} from "../shared/midasSignals";

const DEFAULT_POLL_INTERVAL_MS = 5 * 60 * 1000;
const MIN_POLL_INTERVAL_MS = 30 * 1000;

interface RefreshOptions {
  force?: boolean;
}

interface LocatedSourceFile {
  filePath: string;
  modifiedAtIso: string;
  mtimeMs: number;
}

export interface MidasSignalsSyncService {
  start: () => Promise<void>;
  stop: () => void;
  refresh: (options?: RefreshOptions) => Promise<MidasSignalsData | null>;
  getSnapshot: () => MidasSignalsData | null;
  getPipeline: () => MidasPipelineMetadata;
}

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
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

function normalizeInteger(value: unknown, fallback = 0) {
  return Math.max(0, Math.floor(normalizeNumber(value, fallback)));
}

function normalizeOptionalNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const raw = normalizeString(value);
  if (!raw) {
    return undefined;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeTimestamp(value: unknown, fallback: string) {
  const raw = normalizeString(value);
  if (!raw) {
    return fallback;
  }

  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : raw;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => normalizeString(item))
    .filter(Boolean)
    .slice(0, 24);
}

function extractObjectRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function normalizeActionSignal(value: unknown): MidasActionSignal {
  const raw = normalizeString(value).toUpperCase();
  switch (raw) {
    case "STRONG_BUY":
    case "BUY":
    case "SELL":
    case "STRONG_SELL":
      return raw;
    default:
      return "HOLD";
  }
}

function normalizeRiskLevel(value: unknown): MidasRiskLevel | undefined {
  const raw = normalizeString(value).toUpperCase();
  switch (raw) {
    case "LOW":
    case "MEDIUM":
    case "HIGH":
      return raw;
    default:
      return undefined;
  }
}

function normalizeSignalLayers(value: unknown): MidasSignalLayers | undefined {
  const source = extractObjectRecord(value);
  if (!source) {
    return undefined;
  }

  const momentumScore = normalizeOptionalNumber(
    source.momentum_score ?? source.momentumScore
  );
  const oscillatorScore = normalizeOptionalNumber(
    source.oscillator_score ?? source.oscillatorScore
  );
  const trendScore = normalizeOptionalNumber(source.trend_score ?? source.trendScore);
  const confluenceScore = normalizeOptionalNumber(
    source.confluence_score ?? source.confluenceScore
  );

  if (
    momentumScore === undefined &&
    oscillatorScore === undefined &&
    trendScore === undefined &&
    confluenceScore === undefined
  ) {
    return undefined;
  }

  return {
    momentumScore,
    oscillatorScore,
    trendScore,
    confluenceScore,
  };
}

function normalizeSignalRecord(
  value: unknown,
  fallbackTimestamp: string
): MidasSignalRecord | null {
  const source = extractObjectRecord(value);
  if (!source) {
    return null;
  }

  const symbol = normalizeString(source.symbol).toUpperCase();
  if (!symbol) {
    return null;
  }

  return {
    symbol,
    signal: normalizeActionSignal(source.signal),
    strength: normalizeNumber(source.strength),
    price: normalizeNumber(source.price),
    daily_pct: normalizeNumber(source.daily_pct),
    weekly_pct: normalizeNumber(source.weekly_pct),
    monthly_pct: normalizeNumber(source.monthly_pct),
    signals: normalizeStringArray(source.signals),
    confidence: normalizeOptionalNumber(source.confidence ?? source.confidence_score),
    riskLevel: normalizeRiskLevel(source.risk_level ?? source.riskLevel),
    notes: normalizeString(source.notes) || undefined,
    layers: normalizeSignalLayers(source.layers),
    timestamp: normalizeTimestamp(source.timestamp, fallbackTimestamp),
  };
}

export function normalizeMidasSignalsData(
  value: unknown,
  fallbackTimestamp = new Date().toISOString()
) {
  const source = extractObjectRecord(value);
  if (!source) {
    return null;
  }

  const timestamp = normalizeTimestamp(source.timestamp, fallbackTimestamp);
  const signals = Array.isArray(source.signals)
    ? source.signals
        .map(item => normalizeSignalRecord(item, timestamp))
        .filter((item): item is MidasSignalRecord => Boolean(item))
    : [];
  const rawSymbolCount = normalizeInteger(source.symbol_count, signals.length);
  const successful = normalizeInteger(source.successful, signals.length);
  const failed = normalizeInteger(
    source.failed,
    Math.max(0, rawSymbolCount - successful)
  );
  const symbolCount = Math.max(rawSymbolCount, successful + failed, signals.length);
  const errors = Array.isArray(source.errors)
    ? source.errors.map(item => normalizeString(item)).filter(Boolean)
    : [];

  return {
    timestamp,
    symbol_count: symbolCount,
    successful,
    failed,
    mode: normalizeString(source.mode) || "aggressive",
    signals,
    errors,
  } satisfies MidasSignalsData;
}

function resolvePollIntervalMs() {
  const configured = Number(process.env.MIDAS_PIPELINE_POLL_INTERVAL_MS);
  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_POLL_INTERVAL_MS;
  }

  return Math.max(MIN_POLL_INTERVAL_MS, Math.floor(configured));
}

function buildSourceCandidates() {
  const configuredSourceFile = normalizeString(
    process.env.MIDAS_PIPELINE_SOURCE_FILE
  );
  const defaults = [
    path.resolve(process.cwd(), "..", "Kimi_Agent_Momentum", "midas_signals.json"),
    path.resolve(process.cwd(), "midas_signals.json"),
    path.resolve(process.cwd(), "client", "public", "midas_signals.json"),
  ];
  const candidates = Array.from(
    new Set([configuredSourceFile, ...defaults].filter(Boolean))
  );

  return {
    configuredSourceFile: configuredSourceFile || null,
    candidates,
  };
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

export function createMidasSignalsSyncService(): MidasSignalsSyncService {
  const pollIntervalMs = resolvePollIntervalMs();
  let currentSnapshot: MidasSignalsData | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let lastAttemptAt: string | null = null;
  let lastSyncedAt: string | null = null;
  let lastSourceModifiedAt: string | null = null;
  let resolvedSourceFile: string | null = null;
  let usingFallback = false;
  let lastError: string | null = null;
  let lastKnownMtimeMs: number | null = null;
  let status: MidasPipelineMetadata["status"] = "idle";

  function getCurrentSourceConfig() {
    return buildSourceCandidates();
  }

  function getPipeline(): MidasPipelineMetadata {
    const { configuredSourceFile } = getCurrentSourceConfig();
    return {
      configuredSourceFile,
      resolvedSourceFile,
      pollIntervalMs,
      lastAttemptAt,
      lastSyncedAt,
      lastSourceModifiedAt,
      status,
      error: lastError || undefined,
      usingFallback,
    };
  }

  function runAlpacaFallback(outputPath: string): boolean {
    try {
      const scriptPath = path.resolve(process.cwd(), "scripts", "midas_alpaca_pipeline.py");
      if (!fs.existsSync(scriptPath)) {
        console.log("[Midas Alpaca Fallback] Script not found, skipping.");
        return false;
      }
      const pythonCmd = process.platform === "win32" ? "py" : "python3";
      console.log(`[Midas Alpaca Fallback] Running ${pythonCmd} midas_alpaca_pipeline.py...`);
      execSync(`"${pythonCmd}" "${scriptPath}" --output "${outputPath}" --mode default`, {
        cwd: process.cwd(),
        timeout: 180000,
        stdio: "pipe",
      });
      console.log("[Midas Alpaca Fallback] Completed successfully.");
      return true;
    } catch (e) {
      console.error("[Midas Alpaca Fallback] Failed:", e instanceof Error ? e.message : String(e));
      return false;
    }
  }

  function attachPipeline(snapshot: MidasSignalsData) {
    return {
      ...snapshot,
      pipeline: getPipeline(),
    } satisfies MidasSignalsData;
  }

  async function refresh(options: RefreshOptions = {}) {
    const { configuredSourceFile, candidates } = getCurrentSourceConfig();
    let locatedSource = locateSourceFile(candidates);
    lastAttemptAt = new Date().toISOString();

    // Alpaca fallback: if source file is missing or signals are empty, trigger Alpaca pipeline
    let alpacaGenerated = false;
    if (!locatedSource) {
      const fallbackPath = path.resolve(process.cwd(), "midas_signals.json");
      if (runAlpacaFallback(fallbackPath)) {
        locatedSource = locateSourceFile(candidates);
        alpacaGenerated = true;
      }
    }

    if (!locatedSource) {
      lastError =
        "Midas pipeline source file not found and Alpaca fallback failed. Set MIDAS_PIPELINE_SOURCE_FILE or generate midas_signals.json.";
      status = currentSnapshot ? "stale" : "error";
      usingFallback = false;

      if (currentSnapshot) {
        currentSnapshot = attachPipeline(currentSnapshot);
      }

      return currentSnapshot;
    }

    resolvedSourceFile = locatedSource.filePath;
    lastSourceModifiedAt = locatedSource.modifiedAtIso;
    usingFallback = Boolean(
      configuredSourceFile && configuredSourceFile !== locatedSource.filePath
    ) || alpacaGenerated;

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
      const parsed = JSON.parse(raw) as unknown;
      const normalized = normalizeMidasSignalsData(
        parsed,
        locatedSource.modifiedAtIso
      );

      if (!normalized) {
        throw new Error("Midas signal payload could not be normalized.");
      }

      // If signals array is empty, try Alpaca fallback once
      if (normalized.signals.length === 0) {
        const fallbackPath = path.resolve(process.cwd(), "midas_signals.json");
        if (runAlpacaFallback(fallbackPath)) {
          const reRead = fs.readFileSync(fallbackPath, "utf8");
          const reParsed = JSON.parse(reRead) as unknown;
          const reNormalized = normalizeMidasSignalsData(reParsed, new Date().toISOString());
          if (reNormalized && reNormalized.signals.length > 0) {
            lastKnownMtimeMs = locatedSource.mtimeMs;
            lastSyncedAt = new Date().toISOString();
            lastError = null;
            status = "ok";
            currentSnapshot = attachPipeline(reNormalized);
            return currentSnapshot;
          }
        }
      }

      lastKnownMtimeMs = locatedSource.mtimeMs;
      lastSyncedAt = new Date().toISOString();
      lastError = null;
      status = "ok";
      currentSnapshot = attachPipeline(normalized);
      return currentSnapshot;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error.message
          : "Midas signal payload could not be read.";
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
      `Midas pipeline sync active (${Math.round(pollIntervalMs / 1000)}s interval).`
    );
    if (resolvedSourceFile) {
      console.log(`Midas pipeline source: ${resolvedSourceFile}`);
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
