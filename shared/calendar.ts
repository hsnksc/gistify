export type CalendarImportance = "high" | "medium" | "low";
export type CalendarEventStatus = "upcoming" | "released" | "cancelled";
export type CalendarPipelineStatus = "idle" | "ok" | "stale" | "error";
export type CalendarLiveSyncStatus = "idle" | "ok" | "error";

export interface CalendarActualSurprise {
  direction: "above" | "below" | "inline";
  diff: number;
  pct?: number;
}

export interface CalendarLiveSyncMetadata {
  enabled: boolean;
  provider: string;
  status: CalendarLiveSyncStatus;
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastCaptureAt: string | null;
  nextEventTime: string | null;
  nextHighImpactEventTime: string | null;
  error?: string;
}

export interface CalendarEvent {
  id: string;
  time: string;
  country: string;
  countryFlag: string;
  eventName: string;
  importance: CalendarImportance;
  previous?: string;
  forecast?: string;
  actual?: string;
  currency: string;
  unit?: string;
  analysis?: string;
  impactDirection?: "positive" | "negative";
  status?: CalendarEventStatus;
  actualCapturedAt?: string;
  actualSurprise?: CalendarActualSurprise;
}

export interface CalendarOptionSetup {
  asset: string;
  bias: "bullish" | "bearish" | "neutral";
  trigger: string;
  invalidation: string;
  setupType: string;
  rationale?: string;
}

export interface CalendarDayReport {
  reportDate: string;
  generatedAt: string;
  title: string;
  summary: string;
  events: CalendarEvent[];
  highImportanceCount: number;
  optionSetups: CalendarOptionSetup[];
  vixOutlook: string;
  fearGreedOutlook: string;
  marketNarrative: string;
}

export interface CalendarPipelineMetadata {
  configuredSourceFile: string | null;
  resolvedSourceFile: string | null;
  pollIntervalMs: number;
  lastAttemptAt: string | null;
  lastSyncedAt: string | null;
  lastSourceModifiedAt: string | null;
  status: CalendarPipelineStatus;
  liveSync: CalendarLiveSyncMetadata;
  error?: string;
}

export interface CalendarData {
  generatedAt: string;
  reportDate: string;
  report?: CalendarDayReport;
  pipeline: CalendarPipelineMetadata;
}
