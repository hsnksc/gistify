import type { FlowReport } from "@shared/flow";
import { AlertCircle, ArrowLeft, FileSearch, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import { usePageMeta } from "@/hooks/usePageMeta";
import { type AppLanguage, t } from "@/lib/i18n";
import FlowCommunityPanel from "./FlowCommunityPanel";
import FlowLayout from "./FlowLayout";
import FlowPostActions from "./FlowPostActions";
import FlowReportViewer from "./FlowReportViewer";
import {
  formatFlowReportDate,
  getFlowPostedLabel,
  getFlowReportArchiveDetailPath,
  getFlowReportDetailPath,
  getFlowReportTickers,
} from "../lib/flowReportHelpers";

interface FlowReportDetailSurfaceProps {
  basePath?: string;
  eyebrow?: string;
  error?: string;
  language: AppLanguage;
  loading?: boolean;
  onRefresh?: () => Promise<void> | void;
  report: FlowReport | null;
}

export default function FlowReportDetailSurface({
  language,
  basePath = "/flow",
  eyebrow = "Flow",
  error = "",
  loading = false,
  onRefresh,
  report,
}: FlowReportDetailSurfaceProps) {
  const [, setLocation] = useLocation();
  const locale = language === "en" ? "en-US" : "tr-TR";
  const detailPath = report
    ? basePath === "/reports"
      ? getFlowReportArchiveDetailPath(report, basePath)
      : getFlowReportDetailPath(report.id, basePath)
    : basePath;
  const tickers = report ? getFlowReportTickers(report) : [];
  const backHref = basePath === "/reports" ? "/reports" : "/flow";

  const title = report?.title || "";
  const headline = report?.content.headline || "";

  usePageMeta({
    description:
      headline ||
      t("flow:flowPostDetail"),
    title: title
      ? `${title} | Gistify`
      : "Flow Post | Gistify",
  });

  return (
    <FlowLayout
      language={language}
      eyebrow={eyebrow}
      title={t("flow:postDetail")}
      description={t("flow:theFullContentOfThe")}
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation(backHref)}
          >
            <ArrowLeft className="size-4" />
            {t("flow:backToFeed")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void onRefresh?.()}>
            <RefreshCw className="size-4" />
            {t("common:refresh")}
          </Button>
        </>
      }
    >
      {loading ? (
        <LoadingState
          compact
          label={t("flow:loadingPost")}
        />
      ) : !report ? (
        <EmptyState
          description={
            error ||
            t("flow:returnToTheFeedAnd")
          }
          icon={error ? AlertCircle : FileSearch}
          role={error ? "alert" : "status"}
          title={t("flow:noExchange")}
          tone={error ? "danger" : "neutral"}
        />
      ) : (
        <>
          <section className="rounded-[28px] border border-border bg-card/95 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-sky-400/20 bg-sky-500/10 text-sky-200">
                F
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <p className="font-semibold text-foreground">Flow</p>
                  <span className="text-muted-foreground">·</span>
                  <p className="text-xs font-medium text-muted-foreground">
                    {formatFlowReportDate(report.reportDate, locale)}
                  </p>
                  <span className="text-muted-foreground">·</span>
                  <p className="text-xs text-muted-foreground">
                    {t("flow:posted")}{" "}
                    {getFlowPostedLabel(report, locale)}
                  </p>
                </div>

                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {title}
                </h1>

                {tickers.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tickers.map(ticker => (
                      <span
                        key={ticker}
                        className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                      >
                        ${ticker}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <FlowPostActions
                    engagement={report.engagement}
                    language={language}
                    reportId={report.id}
                    sharePath={detailPath}
                    title={title}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-border bg-card/95 p-4 shadow-sm md:p-6">
            <FlowReportViewer language={language} report={report} />
          </section>

          <FlowCommunityPanel language={language} reportId={report.id} />
        </>
      )}
    </FlowLayout>
  );
}
