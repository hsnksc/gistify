import { useEffect, useMemo } from "react";
import {
  AlertCircle, Clock3, FileSearch, Layers3, RefreshCw, } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import { type AppLanguage, t } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import FlowTickerCard from "../components/FlowTickerCard";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";
import {
  formatFlowTimestamp,
  groupFlowReportsByTicker,
} from "../lib/flowReportHelpers";

export default function FlowIndexPage({
  language,
  basePath = "/flow",
  description,
  eyebrow = "Flow",
  title,
}: {
  basePath?: string;
  description?: string;
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  eyebrow?: string;
  title?: string;
}) {
  const [, setLocation] = useLocation();
  const { reports, loading, error, reload } = useFlowReportSummaries(language, {
    reportKind: "stock",
  });
  const tickerGroups = useMemo(() => groupFlowReportsByTicker(reports), [reports]);
  const locale = language === "en" ? "en-US" : "tr-TR";
  const latestUpdatedAt =
    tickerGroups[0]?.latestReport.updatedAt || reports[0]?.updatedAt || "";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const legacyReportId = new URLSearchParams(window.location.search).get(
      "report"
    );
    if (!legacyReportId) {
      return;
    }

    setLocation(`${basePath}/${encodeURIComponent(legacyReportId)}`, {
      replace: true,
    });
  }, [basePath, setLocation]);

  return (
    <FlowLayout
      language={language}
      eyebrow={eyebrow}
      title={
        title || t("flow:flowStockLibrary")
      }
      description={
        description ||
        t("flow:flowNowOpensByTicker")
      }
      actions={
        <Button type="button" variant="outline" onClick={() => void reload()}>
          <RefreshCw className="size-4" />
          {t("coverage:total")}
        </Button>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Layers3 className="size-4 text-emerald-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {t("flow:tickerCards")}
            </p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {tickerGroups.length}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {t("flow:totalStockHeadingsGeneratedAutomatically")}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            {t("flow:totalReports")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {reports.length}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {t("flow:allCurrentAndArchivedFlow")}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-amber-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
              {t("flow:latestLoad")}
            </p>
          </div>
          <p className="mt-4 text-xl font-semibold text-foreground">
            {latestUpdatedAt
              ? formatFlowTimestamp(latestUpdatedAt, locale)
              : "-"}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {t("flow:loadTimestampOfTheMost")}
          </p>
        </article>
      </section>

      {loading ? (
        <LoadingState
          compact
          label={t("flow:loadingFlowTickerCards")}
        />
      ) : error ? (
        <EmptyState
          description={error}
          icon={AlertCircle}
          role="alert"
          title={t("flow:flowStockLibraryCouldNot")}
          tone="danger"
        />
      ) : !tickerGroups.length ? (
        <EmptyState
          description={t("flow:theLibraryWillOpenHere")}
          icon={FileSearch}
          title={t("flow:thereAreNoFlowTickers")}
        />
      ) : (
        <section
          aria-label={t("flow:flowTickerList")}
          className="grid gap-4 lg:grid-cols-2"
        >
          {tickerGroups.map(group => (
            <FlowTickerCard
              basePath={basePath}
              key={group.ticker}
              group={group}
              language={language}
            />
          ))}
        </section>
      )}
    </FlowLayout>
  );
}


