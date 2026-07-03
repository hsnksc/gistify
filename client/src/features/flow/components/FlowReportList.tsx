import { FileSearch } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { type AppLanguage, t } from "@/lib/i18n";
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
        description={t("flow:thisFeedWillFillAutomatically0a38")}
        icon={FileSearch}
        title={
          emptyMessage ||
          t("common:neutral0964")
        }
      />
    );
  }

  return (
    <section
      aria-label={t("flow:flowReportList")}
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

