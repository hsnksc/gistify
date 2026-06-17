import type {
  DailyReportRecord,
  DailyReportSourcePackage,
  FlowReportComment,
} from "./dailyReports";

export const PUBLIC_ACCESS_USER_ID = "public-access";

export type FlowReport = DailyReportRecord;
export type FlowSource = DailyReportSourcePackage;

export interface FlowReportSummary {
  companyName: string;
  contentFormat: "markdown" | "html";
  exchange: string;
  figureCount: number;
  hasCharts: boolean;
  headline: string;
  id: string;
  previewText: string;
  price: number | null;
  priceChangePct: number | null;
  recommendation: string | null;
  reportDate: string;
  researchFileCount: number;
  sections: string[];
  slug: string;
  sourceFolder: string;
  sourceLabel: string;
  ticker: string;
  tickerUniverse: string[];
  title: string;
  updatedAt: string;
}

export interface FlowReportsResponse {
  reports: FlowReport[];
}

export interface FlowReportSummariesResponse {
  reports: FlowReportSummary[];
}

export interface FlowReportResponse {
  report: FlowReport | null;
}

export interface FlowSourcesResponse {
  sources: FlowSource[];
}

export interface FlowCommentsResponse {
  comments: FlowReportComment[];
}

export interface FlowReportCommentCreateRequestBody {
  body?: string;
}
