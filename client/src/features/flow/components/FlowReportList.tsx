import { copy, type AppLanguage } from "@/lib/i18n";
import type { FlowReportListEntry } from "../lib/flowReportHelpers";
import FlowReportRow from "./FlowReportRow";

interface FlowReportListProps {
  basePath?: string;
  emptyMessage?: string;
  language: AppLanguage;
  reports: FlowReportListEntry[];
}

export default function FlowReportList({
  basePath = "/flow",
  emptyMessage,
  language,
  reports,
}: FlowReportListProps) {
  if (!reports.length) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-dashed border-border bg-card/65 px-4 py-6 text-sm text-muted-foreground"
      >
        {emptyMessage ||
          copy(
            language,
            "Bu filtreye uygun Flow raporu bulunamadi.",
            "No flow report matched this filter."
          )}
      </div>
    );
  }

  return (
    <section
      aria-label={copy(language, "Flow rapor listesi", "Flow report list")}
      className="grid gap-3"
    >
      {reports.map(report => (
        <FlowReportRow
          key={report.id}
          basePath={basePath}
          language={language}
          report={report}
        />
      ))}
    </section>
  );
}

