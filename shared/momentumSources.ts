export interface MomentumSourceSummary {
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
  markdown: string;
}
