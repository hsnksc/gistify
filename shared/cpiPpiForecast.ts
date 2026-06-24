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
