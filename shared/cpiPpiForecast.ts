export type MacroForecastWorkspaceKey = "cpi" | "ppi";
export type MacroForecastReleaseName = "CPI" | "PPI";
export type MacroForecastBias = "HOTTER" | "INLINE" | "COOLER";
export type MacroForecastPipelineStatus = "idle" | "ok" | "stale" | "error";

export interface MacroForecastRelease {
  name: MacroForecastReleaseName;
  period: string;
  releaseDate: string;
  releaseTimeEt: string;
  headlineMoM: string;
  headlineYoY: string;
  coreMoM: string;
  coreYoY: string;
  priorHeadlineMoM?: string;
  priorHeadlineYoY?: string;
  priorCoreMoM?: string;
  priorCoreYoY?: string;
  bias: MacroForecastBias;
  confidence: number;
  thesis: string;
}

export interface MacroForecastScenario {
  id: string;
  label: string;
  probability: number;
  outcome: string;
  marketReadthrough: string;
  favoredAssets: string[];
  invalidation: string;
}

export interface MacroForecastSetup {
  asset: string;
  bias: string;
  trigger: string;
  invalidation: string;
}

export interface MacroForecastWatchItem {
  label: string;
  value: string;
  note: string;
}

export interface MacroForecastPipelineMetadata {
  configuredSourceFile: string | null;
  resolvedSourceFile: string | null;
  pollIntervalMs: number;
  lastAttemptAt: string | null;
  lastSyncedAt: string | null;
  lastSourceModifiedAt: string | null;
  status: MacroForecastPipelineStatus;
  error?: string;
  usingFallback: boolean;
}

export interface MacroForecastWorkspaceData {
  key: MacroForecastWorkspaceKey;
  generatedAt: string;
  reportDate: string;
  title: string;
  summary: string;
  baseCase: string;
  conviction: number;
  release: MacroForecastRelease;
  scenarios: MacroForecastScenario[];
  setups: MacroForecastSetup[];
  watchItems: MacroForecastWatchItem[];
  keyDrivers: string[];
  risks: string[];
  pipeline?: MacroForecastPipelineMetadata;
}

export interface CpiPpiForecastPipelineState {
  cpi: MacroForecastPipelineMetadata;
  ppi: MacroForecastPipelineMetadata;
}

export interface CpiPpiForecastData {
  generatedAt: string;
  availableForecasts: MacroForecastWorkspaceKey[];
  cpi?: MacroForecastWorkspaceData;
  ppi?: MacroForecastWorkspaceData;
  pipeline: CpiPpiForecastPipelineState;
}

const MONTH_NAME_TO_NUMBER: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

function parseForecastMonth(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})/);
  if (isoMatch) {
    const monthNumber = Number(isoMatch[2]);
    return monthNumber >= 1 && monthNumber <= 12
      ? `${isoMatch[1]}-${isoMatch[2]}`
      : null;
  }

  const namedMatch = trimmed.match(/^([A-Za-z]+)\.?\s+(\d{4})$/);
  if (!namedMatch) {
    return null;
  }

  const monthNumber = MONTH_NAME_TO_NUMBER[namedMatch[1].toLowerCase()];
  return monthNumber
    ? `${namedMatch[2]}-${String(monthNumber).padStart(2, "0")}`
    : null;
}

/**
 * Returns the month in which a forecast snapshot is published and updated.
 * The covered inflation period can be the prior month and remains available
 * separately as `release.period`.
 */
export function resolveForecastReportMonth(
  data: Pick<
    MacroForecastWorkspaceData,
    "reportDate" | "generatedAt" | "release"
  >
): string | null {
  return (
    parseForecastMonth(data.reportDate) ||
    parseForecastMonth(data.generatedAt) ||
    parseForecastMonth(data.release?.period || "")
  );
}
