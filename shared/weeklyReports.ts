export type WeeklyReportStatus = "draft" | "published";
export type WeeklyStrategyRating = "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
export type WeeklyRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
export type WeeklyDirectionalBias = "Bullish" | "Bearish" | "Neutral";
export type WeeklyEarningsTime = "AMC" | "BMO" | "AH" | "BH";
export type WeeklyIvCrushPotential = "HIGH" | "MEDIUM" | "LOW";

export interface WeeklyReportEntry {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  earningsDate: string;
  earningsTime: WeeklyEarningsTime;
  momentumScore: number;
  priceChange6M: number;
  rsi14: number;
  currentIV: number;
  historicalIV: number;
  impliedMove: number;
  expectedIVCrush: number;
  ivCrushPotential: WeeklyIvCrushPotential;
  callPremiumBuy: number;
  callPremiumSell: number;
  callGainFromIV: number;
  putPremiumBuy: number;
  putPremiumSell: number;
  putGainFromIV: number;
  ivCrushScore: number;
  strategyRating: WeeklyStrategyRating;
  riskLevel: WeeklyRiskLevel;
  earningsMissRisk: number;
  gapRisk: number;
  recommendedStrategy: string;
  targetProfit: number;
  maxLoss: number;
  lastEarningsMove: number;
  historicalIVCrush: number;
  beatRate: number;
  thesis: string;
  directionalBias: WeeklyDirectionalBias;
}

export interface WeeklyReportContent {
  headline: string;
  summary: string;
  marketContext: string;
  executionNotes: string;
  keyCatalysts: string[];
  entries: WeeklyReportEntry[];
}

export interface WeeklyReportRecord {
  id: string;
  slug: string;
  title: string;
  weekStart: string;
  weekEnd: string;
  analysisDate: string;
  status: WeeklyReportStatus;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  content: WeeklyReportContent;
}
