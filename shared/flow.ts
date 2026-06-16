import type {
  DailyReportRecord,
  DailyReportSourcePackage,
  FlowReportComment,
} from "./dailyReports";

export const PUBLIC_ACCESS_USER_ID = "public-access";

export type FlowReport = DailyReportRecord;
export type FlowSource = DailyReportSourcePackage;

export interface FlowReportsResponse {
  reports: FlowReport[];
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
