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
import {
  createSignalSnapshotStore,
  type SignalSnapshotStore,
} from "./services/signalSnapshotStore";

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

function normalizeOptionalString(value: unknown) {
  const raw = normalizeString(value);
  return raw || undefined;
}

function normalizeBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  const raw = normalizeString(value).toLowerCase();
  if (!raw) {
    return undefined;
  }

  if (["1", "true", "yes", "hit", "success"].includes(raw)) {
    return true;
  }

  if (["0", "false", "no", "miss", "fail"].includes(raw)) {
    return false;
  }

  return undefined;
}

function extractObjectRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function normalizeNumberRecord(value: unknown) {
  const source = extractObjectRecord(value);
  if (!source) {
    return undefined;
  }

  const normalized: Record<string, number> = {};
  for (const [key, rawValue] of Object.entries(source)) {
    const nextValue = normalizeOptionalNumber(rawValue);
    if (nextValue !== undefined) {
      normalized[key] = nextValue;
    }
  }

  return Object.keys(normalized).length ? normalized : undefined;
}

function normalizeNumberArray(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value
    .map(item => normalizeOptionalNumber(item))
    .filter((item): item is number => item !== undefined);

  return normalized.length ? normalized.slice(0, 40) : undefined;
}

function normalizeOutcome(value: unknown): MidasSignalRecord["t1"] {
  const directReturnPct = normalizeOptionalNumber(value);
  if (directReturnPct !== undefined) {
    return {
      retPct: directReturnPct,
    };
  }

  const source = extractObjectRecord(value);
  if (!source) {
    return undefined;
  }

  const hit = normalizeBoolean(source.hit ?? source.success ?? source.is_hit ?? source.isHit);
  const retPct = normalizeOptionalNumber(
    source.retPct ??
      source.ret_pct ??
      source.returnPct ??
      source.return_pct ??
      source.return ??
      source.pct
  );
  const status = normalizeOptionalString(source.status);
  const date = normalizeOptionalString(source.date ?? source.timestamp);

  if (hit === undefined && retPct === undefined && !status && !date) {
    return undefined;
  }

  return {
    hit,
    retPct,
    status,
    date,
  };
}

function normalizeDirection(value: unknown): MidasSignalRecord["direction"] {
  const raw = normalizeString(value).toUpperCase();
  if (raw === "LONG" || raw === "SHORT") {
    return raw;
  }

  return undefined;
}

function normalizeConvictionTier(
  value: unknown
): MidasSignalRecord["conviction_tier"] {
  const raw = normalizeString(value).toUpperCase();
  switch (raw) {
    case "A+":
    case "A":
    case "B":
    case "C":
    case "D":
      return raw;
    default:
      return undefined;
  }
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

  const normalized: MidasSignalRecord = {
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

  const apexScore = normalizeOptionalNumber(source.apex_score ?? source.apexScore);
  const rawApex = normalizeOptionalNumber(source.raw_apex ?? source.rawApex);
  const direction = normalizeDirection(source.direction);
  const convictionTier = normalizeConvictionTier(
    source.conviction_tier ?? source.convictionTier
  );
  const setupType = normalizeOptionalString(source.setup_type ?? source.setupType);
  const factorBreakdown = normalizeNumberRecord(
    source.factor_breakdown ?? source.factorBreakdown
  );
  const componentScores = normalizeNumberRecord(
    source.componentScores ?? source.component_scores
  );
  const mss = normalizeOptionalNumber(
    source.mss ?? source.MSS ?? source.momentum_score ?? source.momentumScore
  );
  const mssChallenger = normalizeOptionalNumber(
    source.mssChallenger ?? source.mss_challenger
  );
  const exhaustionFlags = normalizeStringArray(
    source.exhaustionFlags ?? source.exhaustion_flags
  );

  if (apexScore !== undefined) normalized.apex_score = apexScore;
  if (rawApex !== undefined) normalized.raw_apex = rawApex;
  if (direction) normalized.direction = direction;
  if (convictionTier) normalized.conviction_tier = convictionTier;
  if (setupType) normalized.setup_type = setupType;
  if (factorBreakdown) {
    normalized.factor_breakdown =
      factorBreakdown as unknown as MidasSignalRecord["factor_breakdown"];
  }
  if (componentScores) normalized.componentScores = componentScores;
  if (mss !== undefined) normalized.mss = mss;
  if (mssChallenger !== undefined) normalized.mssChallenger = mssChallenger;
  if (exhaustionFlags.length) normalized.exhaustionFlags = exhaustionFlags;

  const catalystTier = normalizeOptionalString(
    source.catalystTier ?? source.catalyst_tier
  );
  const paramsVersion = normalizeOptionalString(
    source.paramsVersion ?? source.params_version
  );
  const grade = normalizeOptionalString(source.grade);
  const phase = normalizeOptionalString(source.phase);
  const trackType = normalizeOptionalString(source.trackType ?? source.track_type);
  const status = normalizeOptionalString(source.status);

  if (catalystTier) normalized.catalystTier = catalystTier;
  if (paramsVersion) normalized.paramsVersion = paramsVersion;
  if (grade) normalized.grade = grade;
  if (phase) normalized.phase = phase;
  if (trackType) normalized.trackType = trackType;
  if (status) normalized.status = status;

  const t1 = normalizeOutcome(source.t1 ?? source.T1 ?? source.t_1);
  const t3 = normalizeOutcome(source.t3 ?? source.T3 ?? source.t_3);
  const t5 = normalizeOutcome(source.t5 ?? source.T5 ?? source.t_5);
  if (t1) normalized.t1 = t1;
  if (t3) normalized.t3 = t3;
  if (t5) normalized.t5 = t5;

  return normalized;
}

function normalizeMidasBacktestData(
  value: unknown,
  fallbackTimestamp: string
) {
  const source = extractObjectRecord(value);
  if (!source) {
    return null;
  }

  const holdPeriods = extractObjectRecord(source.hold_periods);
  if (!holdPeriods) {
    return null;
  }

  const preferredPeriodKeys = ["1", "3", "5"];
  let selectedPeriodKey = "";
  let selectedTradesRaw: unknown[] = [];

  for (const periodKey of preferredPeriodKeys) {
    const period = extractObjectRecord(holdPeriods[periodKey]);
    if (!period || !Array.isArray(period.trades) || !period.trades.length) {
      continue;
    }

    selectedPeriodKey = periodKey;
    selectedTradesRaw = period.trades;
    break;
  }

  if (!selectedTradesRaw.length) {
    for (const periodKey of Object.keys(holdPeriods)) {
      const period = extractObjectRecord(holdPeriods[periodKey]);
      if (!period || !Array.isArray(period.trades) || !period.trades.length) {
        continue;
      }

      selectedPeriodKey = periodKey;
      selectedTradesRaw = period.trades;
      break;
    }
  }

  if (!selectedTradesRaw.length) {
    return null;
  }

  const latestBySymbol = new Map<
    string,
    {
      apexScore: number;
      date: string;
      direction: "LONG" | "SHORT";
      entry: number;
      exit: number;
      holdDays: number;
      netReturnPct: number;
      rawReturnPct: number;
      symbol: string;
    }
  >();

  for (const trade of selectedTradesRaw) {
    const item = extractObjectRecord(trade);
    if (!item) {
      continue;
    }

    const symbol = normalizeString(item.symbol).toUpperCase();
    if (!symbol) {
      continue;
    }

    const direction: "LONG" | "SHORT" =
      normalizeString(item.direction).toUpperCase() === "SHORT"
        ? "SHORT"
        : "LONG";
    const date = normalizeString(item.date);
    const apexScore = normalizeNumber(item.apex_score ?? item.apexScore);
    const entry = normalizeNumber(item.entry);
    const exit = normalizeNumber(item.exit, entry);
    const holdDays = normalizeInteger(item.hold_days ?? item.holdDays, 1);
    const rawReturnPct =
      normalizeNumber(item.raw_return ?? item.rawReturn) * 100;
    const netReturnPct =
      normalizeNumber(item.net_return ?? item.netReturn, rawReturnPct / 100) *
      100;

    const next = {
      apexScore,
      date,
      direction,
      entry,
      exit,
      holdDays,
      netReturnPct,
      rawReturnPct,
      symbol,
    };

    const current = latestBySymbol.get(symbol);
    if (
      !current ||
      date.localeCompare(current.date) > 0 ||
      (date === current.date && apexScore > current.apexScore)
    ) {
      latestBySymbol.set(symbol, next);
    }
  }

  const summary = {
    strong_buy: 0,
    buy: 0,
    hold: 0,
    sell: 0,
    strong_sell: 0,
    avg_confidence: 0,
    market_sentiment: "NEUTRAL",
  };

  const signals = Array.from(latestBySymbol.values())
    .map((trade): MidasSignalRecord => {
      let signal: MidasActionSignal = "HOLD";
      if (trade.direction === "LONG") {
        signal =
          trade.apexScore >= 60
            ? "STRONG_BUY"
            : trade.apexScore >= 50
              ? "BUY"
              : "HOLD";
      } else {
        signal =
          trade.apexScore >= 60
            ? "STRONG_SELL"
            : trade.apexScore >= 50
              ? "SELL"
              : "HOLD";
      }

      switch (signal) {
        case "STRONG_BUY":
          summary.strong_buy += 1;
          break;
        case "BUY":
          summary.buy += 1;
          break;
        case "SELL":
          summary.sell += 1;
          break;
        case "STRONG_SELL":
          summary.strong_sell += 1;
          break;
        default:
          summary.hold += 1;
          break;
      }
      summary.avg_confidence += trade.apexScore;

      const strengthMagnitude =
        trade.apexScore >= 60
          ? 6
          : trade.apexScore >= 55
            ? 4
            : trade.apexScore >= 50
              ? 2
              : 0;
      const strength =
        trade.direction === "SHORT" ? -strengthMagnitude : strengthMagnitude;
      const riskLevel =
        trade.apexScore >= 60
          ? "LOW"
          : trade.apexScore >= 50
            ? "MEDIUM"
            : "HIGH";

      return {
        symbol: trade.symbol,
        signal,
        strength,
        price: trade.entry,
        daily_pct: Number(trade.netReturnPct.toFixed(2)),
        weekly_pct: Number(trade.netReturnPct.toFixed(2)),
        monthly_pct: Number(trade.rawReturnPct.toFixed(2)),
        signals: [
          "Backtest fallback",
          `${selectedPeriodKey || trade.holdDays}D hold`,
          trade.direction === "SHORT" ? "Short bias" : "Long bias",
          `Apex ${trade.apexScore.toFixed(1)}`,
        ],
        confidence: Number(trade.apexScore.toFixed(1)),
        riskLevel,
        notes:
          "Fallback snapshot derived from midas_backtest.json using the latest trade per symbol.",
        timestamp: normalizeTimestamp(trade.date, fallbackTimestamp),
        apex_score: Number(trade.apexScore.toFixed(1)),
        direction: trade.direction,
        conviction_tier:
          trade.apexScore >= 65
            ? "A+"
            : trade.apexScore >= 58
              ? "A"
              : trade.apexScore >= 52
                ? "B"
                : trade.apexScore >= 48
                  ? "C"
                  : "D",
      };
    })
    .sort((left, right) => {
      const signalPriority = {
        STRONG_BUY: 5,
        BUY: 4,
        HOLD: 3,
        SELL: 2,
        STRONG_SELL: 1,
      };
      const byPriority =
        signalPriority[right.signal] - signalPriority[left.signal];
      if (byPriority !== 0) {
        return byPriority;
      }

      return (right.confidence || 0) - (left.confidence || 0);
    });

  if (!signals.length) {
    return null;
  }

  summary.avg_confidence = Number(
    (summary.avg_confidence / signals.length).toFixed(1)
  );
  summary.market_sentiment =
    summary.strong_buy + summary.buy > summary.sell + summary.strong_sell
      ? "BULLISH"
      : summary.strong_buy + summary.buy < summary.sell + summary.strong_sell
        ? "BEARISH"
        : "NEUTRAL";

  const timestamp = normalizeTimestamp(source.timestamp, fallbackTimestamp);
  const regime = extractObjectRecord(source.regime);

  return {
    timestamp,
    symbol_count: signals.length,
    successful: signals.length,
    failed: 0,
    mode: `${normalizeString(source.mode) || "default"}-backtest`,
    version: "backtest-fallback",
    summary,
    market_regime: regime
      ? {
          score: normalizeNumber(regime.score),
          class: normalizeString(regime.class) || "UNKNOWN",
          long_multiplier: normalizeNumber(
            regime.long_multiplier ?? regime.longMultiplier,
            1
          ),
          short_multiplier: normalizeNumber(
            regime.short_multiplier ?? regime.shortMultiplier,
            1
          ),
          vix: normalizeNumber(regime.vix),
          spy_vs_sma50: normalizeNumber(
            regime.spy_vs_sma50 ?? regime.spyVsSma50
          ),
          spy_vs_sma200: normalizeNumber(
            regime.spy_vs_sma200 ?? regime.spyVsSma200
          ),
          spy_5d_return: normalizeNumber(
            regime.spy_5d_return ?? regime.spy5dReturn
          ),
        }
      : undefined,
    signals,
    errors: [],
  } satisfies MidasSignalsData;
}

export function normalizeMidasSignalsData(
  value: unknown,
  fallbackTimestamp = new Date().toISOString()
) {
  let unwrapped = value;
  // Unwrap ok/data envelope if present (pipeline outputs { ok: true, data: { ... } })
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    (value as Record<string, unknown>).ok === true &&
    typeof (value as Record<string, unknown>).data === "object" &&
    (value as Record<string, unknown>).data !== null
  ) {
    unwrapped = (value as Record<string, unknown>).data;
  }

  const source = extractObjectRecord(unwrapped);
  if (!source) {
    return null;
  }

  if (!Array.isArray(source.signals) && source.hold_periods) {
    return normalizeMidasBacktestData(source, fallbackTimestamp);
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
  const params = extractObjectRecord(source.params);
  const paramsVersion = normalizeOptionalString(
    source.paramsVersion ?? source.params_version ?? params?.version
  );
  const calibrationDate = normalizeOptionalString(
    source.calibrationDate ??
      source.calibration_date ??
      source.lastCalibrationDate ??
      source.last_calibration_date
  );
  const summaryNote = normalizeOptionalString(
    source.summaryNote ?? source.summary_note
  );
  const rolling20HitRateT3 = normalizeOptionalNumber(
    source.rolling20HitRateT3 ??
      source.rolling_20_hit_rate_t3 ??
      source.rolling20_t3_hit_rate
  );
  const gradeAHitRate = normalizeOptionalNumber(
    source.gradeAHitRate ?? source.grade_a_hit_rate
  );
  const gradeAHitCount = normalizeOptionalNumber(
    source.gradeAHitCount ?? source.grade_a_hit_count
  );
  const gradeATotal = normalizeOptionalNumber(
    source.gradeATotal ?? source.grade_a_total
  );
  const gradeCounts = normalizeNumberRecord(
    source.gradeCounts ?? source.grade_counts ?? source.mssDistribution
  );
  const phaseCounts = normalizeNumberRecord(
    source.phaseCounts ?? source.phase_counts ?? source.phaseMap
  );
  const mssTrend = normalizeNumberArray(source.mssTrend ?? source.mss_trend);
  const exhaustionFlags = normalizeStringArray(
    source.exhaustionFlags ?? source.exhaustion_flags
  );
  const carryForwardHealth = extractObjectRecord(
    source.carryForwardHealth ?? source.carry_forward_health
  );

  return {
    timestamp,
    symbol_count: symbolCount,
    successful,
    failed,
    mode: normalizeString(source.mode) || "aggressive",
    version: normalizeOptionalString(source.version),
    signals,
    errors,
    paramsVersion,
    calibrationDate,
    summaryNote,
    rolling20HitRateT3,
    gradeAHitRate,
    gradeAHitCount,
    gradeATotal,
    gradeCounts,
    phaseCounts,
    mssTrend,
    exhaustionFlags,
    carryForwardHealth: carryForwardHealth || undefined,
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
    path.resolve(process.cwd(), "client", "public", "midas_backtest.json"),
    // dist/ fallback — Vite build copies public assets here; production server may read from dist
    path.resolve(process.cwd(), "dist", "midas_signals.json"),
    path.resolve(process.cwd(), "dist", "midas_backtest.json"),
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

export function createMidasSignalsSyncService(
  signalSnapshotStore: SignalSnapshotStore = createSignalSnapshotStore()
): MidasSignalsSyncService {
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

    // DB fallback: if no JSON source is available, try the latest persisted snapshot.
    if (!locatedSource) {
      try {
        const dbSnapshot =
          signalSnapshotStore.getLatestSnapshot<MidasSignalsData>("midas");
        if (dbSnapshot?.payload) {
          const normalized = normalizeMidasSignalsData(
            dbSnapshot.payload,
            new Date(dbSnapshot.updatedAt).toISOString()
          );
          if (normalized) {
            resolvedSourceFile = null;
            lastSourceModifiedAt =
              new Date(dbSnapshot.updatedAt).toISOString();
            usingFallback = true;
            lastKnownMtimeMs = dbSnapshot.updatedAt;
            lastSyncedAt = new Date().toISOString();
            lastError = null;
            status = "ok";
            currentSnapshot = attachPipeline(normalized);
            return currentSnapshot;
          }
        }
      } catch (dbError) {
        console.error("[Midas] DB snapshot fallback failed:", dbError);
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
    ) || alpacaGenerated || /midas_backtest\.json$/i.test(locatedSource.filePath);

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

      try {
        signalSnapshotStore.saveSnapshot("midas", normalized, locatedSource.filePath);
      } catch (dbError) {
        console.error("[Midas] Failed to persist snapshot to DB:", dbError);
      }

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
