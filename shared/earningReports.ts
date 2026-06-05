export interface EarningReportSourceSummary {
  id: string;
  fileName: string;
  sourceFile: string;
  title: string;
  subtitle: string;
  headline: string;
  reportDate: string;
  reportDateLabel: string;
  vixLabel: string;
  updatedAt: string;
}

export interface EarningReportSourceRecord extends EarningReportSourceSummary {
  markdown: string;
}
