import type { EarningReportSourceSummary } from "@shared/earningReports";

export function sortEarningReportsNewestFirst(reports: EarningReportSourceSummary[]) {
  return [...reports].sort((left, right) => {
    if (left.updatedAt !== right.updatedAt) {
      return right.updatedAt.localeCompare(left.updatedAt);
    }

    return right.reportDate.localeCompare(left.reportDate);
  });
}

export function formatEarningReportDate(reportDate: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${reportDate}T00:00:00Z`));
}

export function formatEarningReportDateTime(updatedAt: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(updatedAt));
}
