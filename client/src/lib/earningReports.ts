import type { EarningReportSourceSummary } from "@shared/earningReports";

export function sortEarningReportsNewestFirst(reports: EarningReportSourceSummary[]) {
  return [...reports].sort((left, right) => {
    if (left.reportDate !== right.reportDate) {
      return right.reportDate.localeCompare(left.reportDate);
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

export function formatEarningReportDate(reportDate: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${reportDate}T00:00:00Z`));
}
