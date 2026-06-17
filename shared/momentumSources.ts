export type MomentumSourceContentFormat = "markdown" | "html";

export interface MomentumSourceSummary {
  contentFormat: MomentumSourceContentFormat;
  id: string;
  fileName: string;
  sourceFile: string;
  title: string;
  subtitle: string;
  headline: string;
  reportDate: string;
  reportDateLabel: string;
  sessionDateLabel: string;
  targetDateLabel: string;
  readingTimeLabel: string;
  vixLabel: string;
  updatedAt: string;
}

export interface MomentumSourceRecord extends MomentumSourceSummary {
  html: string;
  markdown: string;
}
