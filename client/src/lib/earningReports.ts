import type { EarningReportSourceSummary } from "@shared/earningReports";

export function sortEarningReportsNewestFirst(reports: EarningReportSourceSummary[]) {
  return [...reports].sort((left, right) => {
    if (left.updatedAt !== right.updatedAt) {
      return right.updatedAt.localeCompare(left.updatedAt);
    }

    return right.reportDate.localeCompare(left.reportDate);
  });
}

export function formatEarningReportDate(
  reportDate: string,
  locale = "tr-TR"
) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${reportDate}T00:00:00Z`));
}

export function formatEarningReportDateTime(
  updatedAt: string,
  locale = "tr-TR"
) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(updatedAt));
}
