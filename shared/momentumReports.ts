export type MomentumReportStatus = "draft" | "published";

export interface MomentumReportEntry {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  priceChangePct: number;
  volumeRatio: number;
  rsi: number;
  score: number;
  signal: string;
  confidenceScore: number;
  targetPrice?: number;
  catalystSummary?: string;
  adminNote?: string;
}

export interface MomentumReportContent {
  headline: string;
  summary: string;
  marketContext: string;
  executionNotes: string;
  scannerUniverse: string;
  scanTime?: string;
  featuredEntries: MomentumReportEntry[];
}

export interface MomentumReportRecord {
  id: string;
  slug: string;
  title: string;
  reportDate: string;
  status: MomentumReportStatus;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  content: MomentumReportContent;
}
