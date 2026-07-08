import { useEffect, useMemo, useState } from "react";
import type { MidasSignalRecord } from "@shared/midasSignals";

export type JsonRecord = Record<string, unknown>;

export interface MomentumParams {
  version: string;
  generatedAt?: string;
  gradeThresholds?: Record<string, number>;
  raw?: JsonRecord;
}

export interface MomentumOutcome {
  hit?: boolean;
  retPct?: number;
  status?: string;
  date?: string;
}

export interface MomentumLedgerRow {
  symbol: string;
  trackType?: string;
  grade?: string;
  phase?: string;
  catalystTier?: string;
  status?: string;
  mss?: number;
  entryDate?: string;
  paramsVersion?: string;
  exhaustionFlags?: string[];
  t1?: MomentumOutcome;
  t3?: MomentumOutcome;
  t5?: MomentumOutcome;
  raw?: JsonRecord;
}

export interface MomentumMarketflashReport extends JsonRecord {
  paramsVersion?: string;
  summaryNote?: string;
  gradeCounts?: Record<string, number>;
  phaseCounts?: Record<string, number>;
  rolling20HitRateT3?: number;
  gradeAHitRate?: number;
  mssTrend?: number[];
}

export interface MomentumCalibrationData extends JsonRecord {
  date?: string;
  paramsVersion?: string;
  summaryNote?: string;
  rolling20HitRateT3?: number;
  gradeAHitRate?: number;
  gradeAHitCount?: number;
  gradeATotal?: number;
}

interface MomentumV3State {
  report: MomentumMarketflashReport | null;
  params: MomentumParams;
  ledger: MomentumLedgerRow[];
  calibration: MomentumCalibrationData | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_PARAMS: MomentumParams = {
  version: "fallback-v2",
  gradeThresholds: {
    A: 75,
    B: 60,
    C: 45,
  },
};

const EMPTY_STATE: MomentumV3State = {
  report: null,
  params: DEFAULT_PARAMS,
  ledger: [],
  calibration: null,
  loading: true,
  error: null,
};

const SOURCE_PATHS = {
  report: "/marketflash/marketflash_report.json",
  params: "/marketflash/momentum_params.json",
  calibration: "/marketflash/calibration/latest.json",
  ledger: "/marketflash/ledger_public.json",
} as const;

export function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function readValue(source: unknown, keys: string[]) {
  if (!isRecord(source)) {
    return undefined;
  }

  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key];
    }
  }

  return undefined;
}

export function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function readStringFromKeys(source: unknown, keys: string[]) {
  return readString(readValue(source, keys));
}

export function readNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace("%", "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function readNumberFromKeys(source: unknown, keys: string[]) {
  return readNumber(readValue(source, keys));
}

export function readStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(readString).filter((item): item is string => Boolean(item));
}

export function numberRecordFromValue(value: unknown) {
  if (!isRecord(value)) {
    return undefined;
  }

  const result: Record<string, number> = {};
  for (const [key, rawValue] of Object.entries(value)) {
    const nextValue = readNumber(rawValue);
    if (nextValue !== undefined) {
      result[key] = nextValue;
    }
  }

  return Object.keys(result).length ? result : undefined;
}

export function numberArrayFromValue(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const result = value
    .map(readNumber)
    .filter((item): item is number => item !== undefined);

  return result.length ? result : undefined;
}

function cacheBust(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}t=${Date.now()}`;
}

async function fetchOptionalJson(path: string, signal: AbortSignal) {
  try {
    const response = await fetch(cacheBust(path), {
      cache: "no-store",
      credentials: "same-origin",
      signal,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as unknown;
  } catch (error) {
    if (signal.aborted) {
      return null;
    }

    console.warn(`[momentum-v3] ${path} could not be loaded`, error);
    return null;
  }
}

function normalizeParams(value: unknown): MomentumParams {
  const source = isRecord(value) ? value : null;
  if (!source) {
    return DEFAULT_PARAMS;
  }

  const thresholdKeys = [
    "gradeThresholds",
    "grade_thresholds",
    "thresholds",
    "mssThresholds",
    "mss_thresholds",
  ];
  // momentum_params.json nests thresholds under `scoring`
  const thresholds =
    numberRecordFromValue(readValue(source, thresholdKeys)) ||
    numberRecordFromValue(readValue(source.scoring, thresholdKeys)) ||
    DEFAULT_PARAMS.gradeThresholds;

  // `version` is a bare number in momentum_params.json
  const rawVersion = readValue(source, [
    "version",
    "paramsVersion",
    "params_version",
  ]);
  const version =
    readString(rawVersion) ||
    (typeof rawVersion === "number" && Number.isFinite(rawVersion)
      ? String(rawVersion)
      : undefined) ||
    readStringFromKeys(source, ["name"]) ||
    DEFAULT_PARAMS.version;

  return {
    version,
    generatedAt: readStringFromKeys(source, [
      "generatedAt",
      "generated_at",
      "updatedAt",
      "updated_at",
    ]),
    gradeThresholds: thresholds,
    raw: source,
  };
}

function normalizeOutcome(value: unknown): MomentumOutcome | undefined {
  const directRet = readNumber(value);
  if (directRet !== undefined) {
    return {
      retPct: directRet,
    };
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const hitRaw = readValue(value, ["hit", "success", "isHit", "is_hit"]);
  const hit =
    typeof hitRaw === "boolean"
      ? hitRaw
      : readString(hitRaw)?.toLowerCase().match(/^(1|true|yes|hit|success)$/)
        ? true
        : readString(hitRaw)?.toLowerCase().match(/^(0|false|no|miss|fail)$/)
          ? false
          : undefined;

  return {
    hit,
    retPct: readNumberFromKeys(value, [
      "retPct",
      "ret_pct",
      "returnPct",
      "return_pct",
      "return",
      "pct",
    ]),
    status: readStringFromKeys(value, ["status", "state"]),
    date: readStringFromKeys(value, ["date", "timestamp"]),
  };
}

function normalizeLedgerRow(value: unknown): MomentumLedgerRow | null {
  if (!isRecord(value)) {
    return null;
  }

  const symbol = readStringFromKeys(value, ["symbol", "ticker"])?.toUpperCase();
  if (!symbol) {
    return null;
  }

  return {
    symbol,
    trackType: readStringFromKeys(value, ["trackType", "track_type", "track"]),
    grade: readStringFromKeys(value, ["grade", "mssGrade", "mss_grade"]),
    phase: readStringFromKeys(value, ["phase", "momentumPhase", "momentum_phase"]),
    catalystTier: readStringFromKeys(value, [
      "catalystTier",
      "catalyst_tier",
      "catalyst",
    ]),
    status: readStringFromKeys(value, ["status", "state"]),
    mss: readNumberFromKeys(value, ["mss", "MSS", "momentumScore", "momentum_score"]),
    entryDate: readStringFromKeys(value, [
      "entryDate",
      "entry_date",
      "date",
      "timestamp",
    ]),
    paramsVersion: readStringFromKeys(value, ["paramsVersion", "params_version"]),
    exhaustionFlags: readStringArray(
      readValue(value, ["exhaustionFlags", "exhaustion_flags"])
    ),
    t1: normalizeOutcome(readValue(value, ["t1", "T1", "t_1"])),
    t3: normalizeOutcome(readValue(value, ["t3", "T3", "t_3"])),
    t5: normalizeOutcome(readValue(value, ["t5", "T5", "t_5"])),
    raw: value,
  };
}

function extractArrayPayload(value: unknown, keys: string[]) {
  if (Array.isArray(value)) {
    return value;
  }

  if (!isRecord(value)) {
    return [];
  }

  for (const key of keys) {
    const candidate = value[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  const nestedData = value.data;
  if (isRecord(nestedData)) {
    for (const key of keys) {
      const candidate = nestedData[key];
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }
  }

  return [];
}

function normalizeLedger(value: unknown) {
  return extractArrayPayload(value, ["rows", "ledger", "items", "signals", "trades"])
    .map(normalizeLedgerRow)
    .filter((item): item is MomentumLedgerRow => Boolean(item));
}

function normalizeReport(value: unknown): MomentumMarketflashReport | null {
  if (!isRecord(value)) {
    return null;
  }

  return {
    ...value,
    paramsVersion: readStringFromKeys(value, ["paramsVersion", "params_version"]),
    summaryNote: readStringFromKeys(value, ["summaryNote", "summary_note"]),
    gradeCounts: numberRecordFromValue(
      readValue(value, ["gradeCounts", "grade_counts", "mssDistribution"])
    ),
    phaseCounts: numberRecordFromValue(
      readValue(value, ["phaseCounts", "phase_counts", "phaseMap"])
    ),
    rolling20HitRateT3: readNumberFromKeys(value, [
      "rolling20HitRateT3",
      "rolling_20_hit_rate_t3",
    ]),
    gradeAHitRate: readNumberFromKeys(value, ["gradeAHitRate", "grade_a_hit_rate"]),
    mssTrend: numberArrayFromValue(readValue(value, ["mssTrend", "mss_trend"])),
  };
}

function normalizeCalibration(value: unknown): MomentumCalibrationData | null {
  const source = isRecord(value) && isRecord(value.data) ? value.data : value;
  if (!isRecord(source)) {
    return null;
  }

  return {
    ...source,
    date: readStringFromKeys(source, [
      "date",
      "calibrationDate",
      "calibration_date",
      "generatedAt",
      "generated_at",
    ]),
    paramsVersion: readStringFromKeys(source, ["paramsVersion", "params_version"]),
    summaryNote: readStringFromKeys(source, ["summaryNote", "summary_note"]),
    rolling20HitRateT3: readNumberFromKeys(source, [
      "rolling20HitRateT3",
      "rolling_20_hit_rate_t3",
    ]),
    gradeAHitRate: readNumberFromKeys(source, ["gradeAHitRate", "grade_a_hit_rate"]),
    gradeAHitCount: readNumberFromKeys(source, [
      "gradeAHitCount",
      "grade_a_hit_count",
    ]),
    gradeATotal: readNumberFromKeys(source, ["gradeATotal", "grade_a_total"]),
  };
}

export function extractReportSignals(report: MomentumMarketflashReport | null) {
  return extractArrayPayload(report, [
    "signals",
    "momentumSignals",
    "momentum_signals",
    "opportunities",
    "setups",
  ]).filter(isRecord) as unknown as MidasSignalRecord[];
}

export function useMomentumV3Data() {
  const [state, setState] = useState<MomentumV3State>(EMPTY_STATE);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setState(current => ({
        ...current,
        loading: true,
        error: null,
      }));

      const [reportRaw, paramsRaw, calibrationRaw, ledgerRaw] = await Promise.all([
        fetchOptionalJson(SOURCE_PATHS.report, controller.signal),
        fetchOptionalJson(SOURCE_PATHS.params, controller.signal),
        fetchOptionalJson(SOURCE_PATHS.calibration, controller.signal),
        fetchOptionalJson(SOURCE_PATHS.ledger, controller.signal),
      ]);

      if (controller.signal.aborted) {
        return;
      }

      setState({
        report: normalizeReport(reportRaw),
        params: normalizeParams(paramsRaw),
        calibration: normalizeCalibration(calibrationRaw),
        ledger: normalizeLedger(ledgerRaw),
        loading: false,
        error: null,
      });
    }

    void load();

    return () => {
      controller.abort();
    };
  }, []);

  return useMemo(
    () => ({
      ...state,
      hasPublicLedger: state.ledger.length > 0,
      hasCalibration: Boolean(state.calibration),
    }),
    [state]
  );
}
