import type { FlowReport } from "@shared/flow";
import { AlertCircle, ArrowLeft, FileSearch, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
import {
  useFlowTitleTranslation,
  useFlowSummaryTranslation,
} from "../hooks/useFlowTranslation";
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
  eyebrow = copy(language, "Flow", "Flow"),
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

  const translatedTitle = useFlowTitleTranslation(
    report?.title || "",
    language
  );
  const translatedHeadline = useFlowSummaryTranslation(
    report?.content.headline,
    language
  );

  usePageMeta({
    description:
      translatedHeadline ||
      copy(language, "Flow post detayi.", "Flow post detail."),
    title: translatedTitle
      ? `${translatedTitle} | Gistify`
      : copy(language, "Flow Post | Gistify", "Flow Post | Gistify"),
  });

  return (
    <FlowLayout
      language={language}
      eyebrow={eyebrow}
      title={copy(language, "Post Detayi", "Post Detail")}
      description={copy(
        language,
        "Akistaki secili postun tam icerigi burada acilir.",
        "The full content of the selected post opens here."
      )}
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation(backHref)}
          >
            <ArrowLeft className="size-4" />
            {copy(language, "Akisa Don", "Back to Feed")}
          </Button>
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
          label={copy(language, "Post yukleniyor.", "Loading post.")}
        />
      ) : !report ? (
        <EmptyState
          description={
            error ||
            copy(
              language,
              "Akisa geri donup postu tekrar sec.",
              "Return to the feed and pick the post again."
            )
          }
          icon={error ? AlertCircle : FileSearch}
          role={error ? "alert" : "status"}
          title={copy(
            language,
            "Istenen post bulunamadi.",
            "The requested post could not be found."
          )}
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
                    {copy(language, "Gonderildi", "Posted")}{" "}
                    {getFlowPostedLabel(report, locale)}
                  </p>
                </div>

                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {translatedTitle}
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
                    language={language}
                    reportId={report.id}
                    sharePath={detailPath}
                    title={translatedTitle}
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
