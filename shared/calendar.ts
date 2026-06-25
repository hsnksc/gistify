export type CalendarImportance = "high" | "medium" | "low";
export type CalendarEventStatus = "upcoming" | "released" | "cancelled";
export type CalendarPipelineStatus = "idle" | "ok" | "stale" | "error";

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
  error?: string;
}

export interface CalendarData {
  generatedAt: string;
  reportDate: string;
  report?: CalendarDayReport;
  pipeline: CalendarPipelineMetadata;
}
