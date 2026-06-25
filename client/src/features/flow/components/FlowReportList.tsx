import { FileSearch } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
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
      <EmptyState
        description={copy(
          language,
          "Filtreleri gevsetip veya aramayi temizleyip listeyi genisletebilirsin.",
          "Loosen the filters or clear the search to widen the list."
        )}
        icon={FileSearch}
        title={
          emptyMessage ||
          copy(
            language,
            "Bu filtreye uygun Flow raporu bulunamadi.",
            "No flow report matched this filter."
          )
        }
      />
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

