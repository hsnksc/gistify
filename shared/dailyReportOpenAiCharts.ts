import type { DailyReportSourcePackage } from "./dailyReports";

export interface DailyReportOpenAiChartGenerateRequest {
  sourceId: string;
  prompt: string;
  figureFileNames?: string[];
}

export interface DailyReportOpenAiChartGenerateResponse {
  sourceId: string;
  prompt: string;
  generatedFiles: string[];
  source: DailyReportSourcePackage;
}
