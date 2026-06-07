export type DailyReportStatus = "draft" | "published";
export type DailyReportSourceKind = "folder" | "file";

export interface DailyReportContent {
  headline: string;
  author?: string;
  coverage?: string;
  methodology?: string;
  executiveSummary: string[];
  markdown: string;
  sectionFiles: string[];
  figureFiles: string[];
  openAiFigureFiles: string[];
  tickerUniverse: string[];
  researchFileCount: number;
  sourceKind?: DailyReportSourceKind;
  sourceLabel?: string;
  assetBasePath?: string;
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
  openAiFigureFiles: string[];
  tickerUniverse: string[];
  researchFileCount: number;
  updatedAt: string;
  sourceKind: DailyReportSourceKind;
  sourceLabel: string;
  assetBasePath: string;
}
