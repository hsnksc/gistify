import { AlertCircle, ArrowLeft, FileSearch, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import { copy, type AppLanguage } from "@/lib/i18n";
import type { FlowReportSummary } from "@shared/flow";
import FlowLayout from "./FlowLayout";
import FlowReportList from "./FlowReportList";

interface FlowFeedScreenProps {
  backHref?: string;
  backLabel?: string;
  basePath?: string;
  description: string;
  emptyDescription?: string;
  emptyTitle?: string;
  error?: string;
  eyebrow: string;
  language: AppLanguage;
  loading?: boolean;
  onRefresh?: () => Promise<void> | void;
  reports: FlowReportSummary[];
  title: string;
}

export default function FlowFeedScreen({
  backHref = "",
  backLabel = "",
  basePath = "/flow",
  description,
  emptyDescription,
  emptyTitle,
  error = "",
  eyebrow,
  language,
  loading = false,
  onRefresh,
  reports,
  title,
}: FlowFeedScreenProps) {
  const [, setLocation] = useLocation();

  return (
    <FlowLayout
      language={language}
      eyebrow={eyebrow}
      title={title}
      description={description}
      actions={
        <>
          {backHref ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation(backHref)}
            >
              <ArrowLeft className="size-4" />
              {backLabel}
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={() => void onRefresh?.()}>
            <RefreshCw className="size-4" />
            {copy(language, "Yenile", "Refresh")}
          </Button>
        </>
      }
    >
      {loading ? (
        <LoadingState
          compact
          label={copy(language, "Flow akisi yukleniyor.", "Loading flow feed.")}
        />
      ) : error ? (
        <EmptyState
          description={error}
          icon={AlertCircle}
          role="alert"
          title={copy(language, "Flow yuklenemedi", "Flow could not be loaded")}
          tone="danger"
        />
      ) : !reports.length ? (
        <EmptyState
          description={
            emptyDescription ||
            copy(
              language,
              "Yeni markdown raporlar geldikce bu akis dolacak.",
              "This feed will fill automatically as new markdown reports arrive."
            )
          }
          icon={FileSearch}
          title={
            emptyTitle ||
            copy(language, "Henuz post yok.", "There are no posts yet.")
          }
        />
      ) : (
        <FlowReportList
          basePath={basePath}
          language={language}
          reports={reports}
        />
      )}
    </FlowLayout>
  );
}
