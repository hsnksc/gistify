import fs from "node:fs";
import path from "node:path";
import type {
  CpiPpiForecastData,
  CpiPpiForecastPipelineState,
  MacroForecastBias,
  MacroForecastPipelineMetadata,
  MacroForecastPipelineStatus,
  MacroForecastRelease,
  MacroForecastScenario,
  MacroForecastSetup,
  MacroForecastWatchItem,
  MacroForecastWorkspaceData,
  MacroForecastWorkspaceKey,
} from "../shared/cpiPpiForecast";

const DEFAULT_POLL_INTERVAL_MS = 5 * 60 * 1000;
const MIN_POLL_INTERVAL_MS = 30 * 1000;
const SOURCE_KEYS: MacroForecastWorkspaceKey[] = ["cpi", "ppi"];

const SOURCE_DEFINITIONS: Record<
  MacroForecastWorkspaceKey,
  {
    envVar: string;
    fileName: string;
    releaseName: MacroForecastRelease["name"];
    workspaceDir: string;
  }
> = {
  cpi: {
    envVar: "CPI_FORECAST_PIPELINE_SOURCE_FILE",
    fileName: "cpi_forecast.json",
    releaseName: "CPI",
    workspaceDir: "Kimi_Agent_CPI",
  },
  ppi: {
    envVar: "PPI_FORECAST_PIPELINE_SOURCE_FILE",
    fileName: "ppi_forecast.json",
    releaseName: "PPI",
    workspaceDir: "Kimi_Agent_PPI",
  },
};

interface RefreshOptions {
  force?: boolean;
}

interface LocatedSourceFile {
  filePath: string;
  modifiedAtIso: string;
  mtimeMs: number;
}

interface SourceRuntimeState {
  snapshot: MacroForecastWorkspaceData | null;
  lastAttemptAt: string | null;
  lastSyncedAt: string | null;
  lastSourceModifiedAt: string | null;
  resolvedSourceFile: string | null;
  usingFallback: boolean;
  lastError: string | null;
  lastKnownMtimeMs: number | null;
  status: MacroForecastPipelineStatus;
}

export interface CpiPpiForecastSyncService {
  start: () => Promise<void>;
  stop: () => void;
  refresh: (options?: RefreshOptions) => Promise<CpiPpiForecastData | null>;
  getSnapshot: () => CpiPpiForecastData | null;
  getPipeline: () => CpiPpiForecastPipelineState;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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

function normalizeProbability(value: unknown, fallback = 0) {
  return Math.max(0, Math.min(100, Math.round(normalizeNumber(value, fallback))));
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

function normalizeBias(value: unknown): MacroForecastBias {
  const raw = normalizeString(value).toUpperCase();
  switch (raw) {
    case "HOTTER":
    case "COOLER":
      return raw;
    default:
      return "INLINE";
  }
}

function fallbackRelease(name: MacroForecastRelease["name"]): MacroForecastRelease {
  return {
    name,
    period: "",
    releaseDate: "",
    releaseTimeEt: "",
    headlineMoM: "",
    headlineYoY: "",
    coreMoM: "",
    coreYoY: "",
    bias: "INLINE",
    confidence: 0,
    thesis: "",
  };
}

function normalizeRelease(
  value: unknown,
  fallbackName: MacroForecastRelease["name"]
): MacroForecastRelease {
  const source = extractObjectRecord(value);
  if (!source) {
    return fallbackRelease(fallbackName);
  }

  const name = normalizeString(source.name).toUpperCase() === "PPI" ? "PPI" : fallbackName;

  return {
    name,
    period: normalizeString(source.period),
    releaseDate: normalizeString(source.releaseDate ?? source.release_date),
    releaseTimeEt: normalizeString(source.releaseTimeEt ?? source.release_time_et),
    headlineMoM: normalizeString(source.headlineMoM ?? source.headline_mom),
    headlineYoY: normalizeString(source.headlineYoY ?? source.headline_yoy),
    coreMoM: normalizeString(source.coreMoM ?? source.core_mom),
    coreYoY: normalizeString(source.coreYoY ?? source.core_yoy),
    priorHeadlineMoM: normalizeString(
      source.priorHeadlineMoM ?? source.prior_headline_mom
    ) || undefined,
    priorHeadlineYoY: normalizeString(
      source.priorHeadlineYoY ?? source.prior_headline_yoy
    ) || undefined,
    priorCoreMoM: normalizeString(
      source.priorCoreMoM ?? source.prior_core_mom
    ) || undefined,
    priorCoreYoY: normalizeString(
      source.priorCoreYoY ?? source.prior_core_yoy
    ) || undefined,
    bias: normalizeBias(source.bias),
    confidence: normalizeProbability(source.confidence),
    thesis: normalizeString(source.thesis),
  };
}

function normalizeScenario(
  value: unknown,
  index: number,
  releaseName: MacroForecastRelease["name"]
): MacroForecastScenario | null {
  const source = extractObjectRecord(value);
  if (!source) {
    return null;
  }

  const label = normalizeString(source.label);
  if (!label) {
    return null;
  }

  return {
    id: normalizeString(source.id) || `scenario-${index + 1}`,
    label,
    probability: normalizeProbability(source.probability),
    outcome:
      normalizeString(source.outcome) ||
      normalizeString(
        releaseName === "CPI"
          ? source.cpiOutcome ?? source.cpi_outcome
          : source.ppiOutcome ?? source.ppi_outcome
      ),
    marketReadthrough: normalizeString(
      source.marketReadthrough ?? source.market_readthrough
    ),
    favoredAssets: normalizeStringArray(source.favoredAssets ?? source.favored_assets),
    invalidation: normalizeString(source.invalidation),
  };
}

function normalizeSetup(value: unknown): MacroForecastSetup | null {
  const source = extractObjectRecord(value);
  if (!source) {
    return null;
  }

  const asset = normalizeString(source.asset);
  if (!asset) {
    return null;
  }

  return {
    asset,
    bias: normalizeString(source.bias),
    trigger: normalizeString(source.trigger),
    invalidation: normalizeString(source.invalidation),
  };
}

function normalizeWatchItem(value: unknown): MacroForecastWatchItem | null {
  const source = extractObjectRecord(value);
  if (!source) {
    return null;
  }

  const label = normalizeString(source.label);
  if (!label) {
    return null;
  }

  return {
    label,
    value: normalizeString(source.value),
    note: normalizeString(source.note),
  };
}

function normalizeForecastWorkspaceData(
  value: unknown,
  key: MacroForecastWorkspaceKey,
  fallbackTimestamp = new Date().toISOString()
) {
  const source = extractObjectRecord(value);
  if (!source) {
    return null;
  }

  const definition = SOURCE_DEFINITIONS[key];
  const generatedAt = normalizeTimestamp(
    source.generatedAt ?? source.generated_at ?? source.timestamp,
    fallbackTimestamp
  );
  const releaseSource = source.release ?? source[key] ?? source;

  return {
    key,
    generatedAt,
    reportDate: normalizeString(source.reportDate ?? source.report_date),
    title:
      normalizeString(source.title) || `US ${definition.releaseName} Forecast Snapshot`,
    summary: normalizeString(source.summary),
    baseCase: normalizeString(source.baseCase ?? source.base_case),
    conviction: normalizeProbability(source.conviction),
    release: normalizeRelease(releaseSource, definition.releaseName),
    scenarios: Array.isArray(source.scenarios)
      ? source.scenarios
          .map((item, index) => normalizeScenario(item, index, definition.releaseName))
          .filter((item): item is MacroForecastScenario => Boolean(item))
      : [],
    setups: Array.isArray(source.setups)
      ? source.setups
          .map(item => normalizeSetup(item))
          .filter((item): item is MacroForecastSetup => Boolean(item))
      : [],
    watchItems: Array.isArray(source.watchItems ?? source.watch_items)
      ? (source.watchItems ?? source.watch_items)
          .map(item => normalizeWatchItem(item))
          .filter((item): item is MacroForecastWatchItem => Boolean(item))
      : [],
    keyDrivers: normalizeStringArray(source.keyDrivers ?? source.key_drivers),
    risks: normalizeStringArray(source.risks),
  } satisfies MacroForecastWorkspaceData;
}

function resolvePollIntervalMs() {
  const configured = Number(process.env.CPI_PPI_PIPELINE_POLL_INTERVAL_MS);
  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_POLL_INTERVAL_MS;
  }

  return Math.max(MIN_POLL_INTERVAL_MS, Math.floor(configured));
}

function resolveLatestTimestamp(
  values: Array<string | null | undefined>,
  fallback = new Date().toISOString()
) {
  let resolved: string | null = null;
  let resolvedMs = Number.NEGATIVE_INFINITY;

  for (const value of values) {
    if (!value) {
      continue;
    }

    const parsed = Date.parse(value);
    if (Number.isFinite(parsed) && parsed > resolvedMs) {
      resolved = new Date(parsed).toISOString();
      resolvedMs = parsed;
      continue;
    }

    if (!resolved) {
      resolved = value;
    }
  }

  return resolved || fallback;
}

function buildSourceCandidates(key: MacroForecastWorkspaceKey) {
  const definition = SOURCE_DEFINITIONS[key];
  const configuredSourceFile = normalizeString(process.env[definition.envVar]);
  const defaults = [
    path.resolve(process.cwd(), "..", definition.workspaceDir, definition.fileName),
    path.resolve(process.cwd(), definition.fileName),
    path.resolve(process.cwd(), "data", definition.fileName),
    path.resolve(process.cwd(), "data", definition.workspaceDir, definition.fileName),
    path.resolve(process.cwd(), "client", "public", definition.fileName),
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

export function createCpiPpiForecastSyncService(): CpiPpiForecastSyncService {
  const pollIntervalMs = resolvePollIntervalMs();
  const runtimeState: Record<MacroForecastWorkspaceKey, SourceRuntimeState> = {
    cpi: {
      snapshot: null,
      lastAttemptAt: null,
      lastSyncedAt: null,
      lastSourceModifiedAt: null,
      resolvedSourceFile: null,
      usingFallback: false,
      lastError: null,
      lastKnownMtimeMs: null,
      status: "idle",
    },
    ppi: {
      snapshot: null,
      lastAttemptAt: null,
      lastSyncedAt: null,
      lastSourceModifiedAt: null,
      resolvedSourceFile: null,
      usingFallback: false,
      lastError: null,
      lastKnownMtimeMs: null,
      status: "idle",
    },
  };
  let currentSnapshot: CpiPpiForecastData | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;

  function getPipelineForKey(
    key: MacroForecastWorkspaceKey
  ): MacroForecastPipelineMetadata {
    const { configuredSourceFile } = buildSourceCandidates(key);
    const runtime = runtimeState[key];
    return {
      configuredSourceFile,
      resolvedSourceFile: runtime.resolvedSourceFile,
      pollIntervalMs,
      lastAttemptAt: runtime.lastAttemptAt,
      lastSyncedAt: runtime.lastSyncedAt,
      lastSourceModifiedAt: runtime.lastSourceModifiedAt,
      status: runtime.status,
      error: runtime.lastError || undefined,
      usingFallback: runtime.usingFallback,
    };
  }

  function getPipeline(): CpiPpiForecastPipelineState {
    return {
      cpi: getPipelineForKey("cpi"),
      ppi: getPipelineForKey("ppi"),
    };
  }

  function attachPipeline(
    snapshot: MacroForecastWorkspaceData,
    pipeline: MacroForecastPipelineMetadata
  ) {
    return {
      ...snapshot,
      pipeline,
    } satisfies MacroForecastWorkspaceData;
  }

  function buildSnapshot() {
    const pipeline = getPipeline();
    const cpi = runtimeState.cpi.snapshot
      ? attachPipeline(runtimeState.cpi.snapshot, pipeline.cpi)
      : undefined;
    const ppi = runtimeState.ppi.snapshot
      ? attachPipeline(runtimeState.ppi.snapshot, pipeline.ppi)
      : undefined;
    const availableForecasts: MacroForecastWorkspaceKey[] = [];

    if (cpi) {
      availableForecasts.push("cpi");
    }
    if (ppi) {
      availableForecasts.push("ppi");
    }

    if (!availableForecasts.length) {
      return null;
    }

    return {
      generatedAt: resolveLatestTimestamp(
        [cpi?.generatedAt, ppi?.generatedAt, pipeline.cpi.lastSyncedAt, pipeline.ppi.lastSyncedAt],
        new Date().toISOString()
      ),
      availableForecasts,
      cpi,
      ppi,
      pipeline,
    } satisfies CpiPpiForecastData;
  }

  function refreshSource(key: MacroForecastWorkspaceKey, options: RefreshOptions = {}) {
    const definition = SOURCE_DEFINITIONS[key];
    const runtime = runtimeState[key];
    const { configuredSourceFile, candidates } = buildSourceCandidates(key);
    const locatedSource = locateSourceFile(candidates);
    runtime.lastAttemptAt = new Date().toISOString();

    if (!locatedSource) {
      runtime.lastError = `${definition.releaseName} forecast source file not found. Set ${definition.envVar} or generate ${definition.fileName} in the expected workspace.`;
      runtime.status = runtime.snapshot ? "stale" : "error";
      runtime.usingFallback = false;
      return runtime.snapshot;
    }

    runtime.resolvedSourceFile = locatedSource.filePath;
    runtime.lastSourceModifiedAt = locatedSource.modifiedAtIso;
    runtime.usingFallback = Boolean(
      configuredSourceFile && configuredSourceFile !== locatedSource.filePath
    );

    if (
      !options.force &&
      runtime.snapshot &&
      runtime.lastKnownMtimeMs === locatedSource.mtimeMs
    ) {
      runtime.status = "ok";
      runtime.lastError = null;
      return runtime.snapshot;
    }

    try {
      const raw = fs.readFileSync(locatedSource.filePath, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      const normalized = normalizeForecastWorkspaceData(
        parsed,
        key,
        locatedSource.modifiedAtIso
      );

      if (!normalized) {
        throw new Error(`${definition.releaseName} forecast JSON could not be normalized.`);
      }

      runtime.snapshot = normalized;
      runtime.lastSyncedAt = new Date().toISOString();
      runtime.lastKnownMtimeMs = locatedSource.mtimeMs;
      runtime.lastError = null;
      runtime.status = "ok";
      return runtime.snapshot;
    } catch (error) {
      runtime.lastError =
        error instanceof Error && error.message
          ? error.message
          : `Unknown ${definition.releaseName} pipeline error.`;
      runtime.status = runtime.snapshot ? "stale" : "error";
      return runtime.snapshot;
    }
  }

  async function refresh(options: RefreshOptions = {}) {
    for (const key of SOURCE_KEYS) {
      refreshSource(key, options);
    }

    currentSnapshot = buildSnapshot();
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

    console.log(
      `CPI/PPI pipeline sync active (${Math.round(pollIntervalMs / 1000)}s interval).`
    );
    for (const key of SOURCE_KEYS) {
      const resolvedSourceFile = runtimeState[key].resolvedSourceFile;
      if (resolvedSourceFile) {
        console.log(`${SOURCE_DEFINITIONS[key].releaseName} pipeline source: ${resolvedSourceFile}`);
      }
    }
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  return {
    start,
    stop,
    refresh,
    getSnapshot: () => {
      currentSnapshot = buildSnapshot();
      return currentSnapshot;
    },
    getPipeline,
  };
}
