import type { FlowReport } from "@shared/flow";
import { copy, type AppLanguage } from "@/lib/i18n";
import { getFlowSourceLabel, normalizeFlowContent } from "./flowReportHelpers";
import {
  parseReportHtml,
  type ReportRecommendation,
  type StoredReportRecord,
} from "./parseReport";

export function compareStoredReports(
  left: StoredReportRecord,
  right: StoredReportRecord
) {
  const byDate = right.reportDate.localeCompare(left.reportDate);
  if (byDate !== 0) {
    return byDate;
  }

  const byTicker = left.ticker.localeCompare(right.ticker);
  if (byTicker !== 0) {
    return byTicker;
  }

  return right.loadedAt.localeCompare(left.loadedAt);
}

export function groupStoredReportsByDate(reports: StoredReportRecord[]) {
  const grouped = new Map<string, StoredReportRecord[]>();

  for (const report of [...reports].sort(compareStoredReports)) {
    const existing = grouped.get(report.reportDate);
    if (existing) {
      existing.push(report);
    } else {
      grouped.set(report.reportDate, [report]);
    }
  }

  return Array.from(grouped.entries()).sort((left, right) =>
    right[0].localeCompare(left[0])
  );
}

export function buildStoredReportPath(
  report: StoredReportRecord,
  basePath = "/reports"
) {
  const path = `${basePath}/${encodeURIComponent(report.ticker)}/${encodeURIComponent(report.reportDate)}`;
  return `${path}?report=${encodeURIComponent(report.id)}`;
}

export function formatRecommendationLabel(
  recommendation: ReportRecommendation,
  language: AppLanguage
) {
  if (recommendation === "BUY") {
    return copy(language, "AL", "BUY");
  }
  if (recommendation === "HOLD") {
    return copy(language, "TUT", "HOLD");
  }
  if (recommendation === "SELL") {
    return copy(language, "SAT", "SELL");
  }
  return copy(language, "Yok", "N/A");
}

export function getRecommendationTone(recommendation: ReportRecommendation) {
  if (recommendation === "BUY") {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
  }
  if (recommendation === "HOLD") {
    return "border-amber-400/30 bg-amber-500/10 text-amber-300";
  }
  if (recommendation === "SELL") {
    return "border-red-400/30 bg-red-500/10 text-red-300";
  }
  return "border-border bg-background/60 text-muted-foreground";
}

export function formatPriceChange(
  value: number | null,
  language: AppLanguage
) {
  if (value === null || !Number.isFinite(value)) {
    return copy(language, "Degisim yok", "No change");
  }

  const locale = language === "en" ? "en-US" : "tr-TR";
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Math.abs(value));
  return `${value >= 0 ? "+" : "-"}${formatted}%`;
}

export function formatReportPrice(
  price: number | null,
  language: AppLanguage
) {
  if (price === null || !Number.isFinite(price)) {
    return copy(language, "Fiyat yok", "No price");
  }

  return new Intl.NumberFormat(language === "en" ? "en-US" : "tr-TR", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(price);
}

export function adaptFlowReportToStoredReport(
  report: FlowReport
): StoredReportRecord | null {
  const content = normalizeFlowContent(report.content);
  const html = content.html || "";
  if (content.contentFormat !== "html" || !html.trim()) {
    return null;
  }

  const sourceLabel = getFlowSourceLabel(report) || report.title;

  const parsed = parseReportHtml({
    fallbackDate: report.reportDate,
    fileName: sourceLabel,
    html,
  });

  return {
    ...parsed,
    companyName:
      parsed.companyName || report.title.replace(parsed.ticker, "").trim(),
    duplicateOf: null,
    id: `server:${report.id}`,
    loadedAt: report.updatedAt,
    sourceLabel,
    sourceType: "server",
    serverReportId: report.id,
  };
}

export function findStoredReport(
  reports: StoredReportRecord[],
  ticker: string,
  reportDate: string,
  preferredId?: string | null
) {
  if (preferredId) {
    const direct = reports.find(report => report.id === preferredId);
    if (direct) {
      return direct;
    }
  }

  return (
    [...reports]
      .sort(compareStoredReports)
      .find(
        report =>
          report.ticker === ticker.toUpperCase() && report.reportDate === reportDate
      ) || null
  );
}

export function getReportDateHeading(
  reportDate: string,
  language: AppLanguage
) {
  const parsed = new Date(`${reportDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return reportDate;
  }

  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}
