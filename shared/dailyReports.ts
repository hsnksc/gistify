export type DailyReportStatus = "draft" | "published";

export interface DailyReportContent {
  headline: string;
  author?: string;
  coverage?: string;
  methodology?: string;
  executiveSummary: string[];
  markdown: string;
  sectionFiles: string[];
  figureFiles: string[];
  tickerUniverse: string[];
  researchFileCount: number;
}

export interface DailyReportRecord {
  id: string;
  slug: string;
  title: string;
  reportDate: string;
  status: DailyReportStatus;
  authorEmail: string;
  sourceFolder: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  content: DailyReportContent;
}

export interface DailyReportSourcePackage {
  id: string;
  folderName: string;
  reportDate: string;
  title: string;
  headline: string;
  author?: string;
  coverage?: string;
  methodology?: string;
  executiveSummary: string[];
  markdown: string;
  sectionFiles: string[];
  figureFiles: string[];
  tickerUniverse: string[];
  researchFileCount: number;
  updatedAt: string;
}
