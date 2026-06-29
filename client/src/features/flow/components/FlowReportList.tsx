import { FileSearch } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { copy, type AppLanguage } from "@/lib/i18n";
import type { FlowReportListEntry } from "../lib/flowReportHelpers";
import FlowFeedCard from "./FlowFeedCard";

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
          "Yeni post geldikce bu akis dolacak.",
          "This feed will fill automatically as new posts arrive."
        )}
        icon={FileSearch}
        title={
          emptyMessage ||
          copy(
            language,
            "Henuz gosterilecek post yok.",
            "There are no posts to show yet."
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
        <FlowFeedCard
          key={report.id}
          basePath={basePath}
          language={language}
          report={report}
        />
      ))}
    </section>
  );
}

