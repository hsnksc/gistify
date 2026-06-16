export type DailyReportStatus = "draft" | "published";
export type DailyReportSourceKind = "folder" | "file";
export type DailyReportContentFormat = "markdown" | "html";

export interface DailyReportMetadataItem {
  label: string;
  value: string;
}

export interface DailyReportContent {
  headline: string;
  author?: string;
  coverage?: string;
  methodology?: string;
  metadataItems?: DailyReportMetadataItem[];
  executiveSummary: string[];
  markdown: string;
  html?: string;
  sectionFiles: string[];
  figureFiles: string[];
  openAiFigureFiles: string[];
  tickerUniverse: string[];
  researchFileCount: number;
  sourceKind?: DailyReportSourceKind;
  contentFormat?: DailyReportContentFormat;
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
  metadataItems: DailyReportMetadataItem[];
  executiveSummary: string[];
  markdown: string;
  html?: string;
  sectionFiles: string[];
  figureFiles: string[];
  openAiFigureFiles: string[];
  tickerUniverse: string[];
  researchFileCount: number;
  updatedAt: string;
  sourceKind: DailyReportSourceKind;
  contentFormat?: DailyReportContentFormat;
  sourceLabel: string;
  assetBasePath: string;
}

export interface FlowReportComment {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userPicture?: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}
