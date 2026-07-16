import type { MidasActionSignal, MidasRiskLevel } from "./midasSignals";

export type WatchtowerLanguage = "tr" | "en";
export type WatchtowerStatus = "draft" | "published";
export type WatchtowerSection = "leaders" | "risks" | "watch";

export interface WatchtowerEntry {
  symbol: string;
  signal: MidasActionSignal;
  conviction: number;
  price: number;
  dailyPct: number;
  weeklyPct: number;
  monthlyPct: number;
  riskLevel?: MidasRiskLevel;
  thesis: string;
  reasons: string[];
  href: string;
}

export interface WatchtowerContent {
  summary: string;
  marketSentiment: string;
  leaders: WatchtowerEntry[];
  risks: WatchtowerEntry[];
  watch: WatchtowerEntry[];
  methodology: string;
  sourceTimestamp: string;
  sourceVersion?: string;
  universeCount: number;
}

export interface WatchtowerReportRecord {
  id: string;
  reportDate: string;
  language: WatchtowerLanguage;
  title: string;
  status: WatchtowerStatus;
  authorEmail: string;
  reviewerEmail?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  content: WatchtowerContent;
}

export interface WatchtowerReportsResponse {
  report?: WatchtowerReportRecord | null;
  reports?: WatchtowerReportRecord[];
  latestPublished?: WatchtowerReportRecord | null;
}
