import type { MomentumSourceSummary } from "@shared/momentumSources";

export function sortMomentumReportsNewestFirst(reports: MomentumSourceSummary[]) {
  return [...reports].sort((left, right) => {
    if (left.reportDate !== right.reportDate) {
      return right.reportDate.localeCompare(left.reportDate);
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

export function formatMomentumReportDate(reportDate: string) {
  if (!reportDate) {
    return "-";
  }

  const parsed = Date.parse(`${reportDate}T00:00:00Z`);
  if (!Number.isFinite(parsed)) {
    return reportDate;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(parsed));
}
