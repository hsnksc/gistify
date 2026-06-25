import { useMemo } from "react";
import { ArrowLeft, Clock3, History, RefreshCw } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import FlowReportList from "../components/FlowReportList";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";
import {
  formatFlowReportDate,
  formatFlowTimestamp,
  getFlowPreviewText,
  getFlowReportArchiveDetailPath,
  getFlowReportDetailPath,
  getFlowSourceLabel,
  groupFlowReportsByTicker,
} from "../lib/flowReportHelpers";

interface FlowTickerPageProps {
  basePath?: string;
  eyebrow?: string;
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  ticker: string;
}

export default function FlowTickerPage({
  basePath = "/flow",
  eyebrow = copy(language, "Flow", "Flow"),
  language,
  ticker,
}: FlowTickerPageProps) {
  const [, setLocation] = useLocation();
  const { reports, loading, error, reload } = useFlowReportSummaries(language, {
    reportKind: "stock",
  });
  const normalizedTicker = ticker.trim().toUpperCase();
  const tickerGroup = useMemo(
    () =>
      groupFlowReportsByTicker(reports).find(
        group => group.ticker === normalizedTicker
      ) || null,
    [normalizedTicker, reports]
  );
  const latestReport = tickerGroup?.latestReport || null;
  const archiveReports = tickerGroup?.reports.slice(1) || [];
  const locale = language === "en" ? "en-US" : "tr-TR";
  const latestReportHref =
    latestReport && basePath === "/reports"
      ? getFlowReportArchiveDetailPath(latestReport, basePath)
      : latestReport
        ? getFlowReportDetailPath(latestReport.id, basePath)
        : basePath;

  usePageMeta({
    description: latestReport
      ? getFlowPreviewText(latestReport, language)
      : copy(
          language,
          "Gistify Flow hisse rapor detayi.",
          "Gistify Flow stock report detail."
        ),
    title: latestReport
      ? `${normalizedTicker} ${copy(language, "Raporlari", "Reports")} | Gistify`
      : copy(language, "Flow Ticker Sayfasi | Gistify", "Flow Ticker Page | Gistify"),
  });

  return (
    <FlowLayout
      key={latestReport?.id || "empty"}
      language={language}
      eyebrow={eyebrow}
      title={
        latestReport
          ? `${tickerGroup?.ticker} ${copy(language, "Raporlari", "Reports")}`
          : copy(language, "Flow hisse sayfasi", "Flow ticker page")
      }
      description={
        (latestReport ? getFlowPreviewText(latestReport, language) : "") ||
        copy(
          language,
          "Secilen hisse icin guncel rapor ve tarihsel Flow arsivi ayni sayfada acilir.",
          "The selected stock opens with its current report and historical Flow archive on the same page."
        )
      }
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation(basePath)}
          >
            <ArrowLeft className="size-4" />
            {copy(language, "Hisseler", "Tickers")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void reload()}>
            <RefreshCw className="size-4" />
            {copy(language, "Yenile", "Refresh")}
          </Button>
        </>
      }
    >
      {loading ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-border bg-card/75 px-4 py-6 text-sm text-muted-foreground"
        >
          {copy(
            language,
            "Hisse raporlari yukleniyor.",
            "Loading ticker reports."
          )}
        </div>
      ) : !tickerGroup || !latestReport ? (
        <div
          role="alert"
          className="rounded-xl border border-dashed border-border bg-card/75 px-4 py-6 text-sm text-muted-foreground"
        >
          {error ||
            copy(
              language,
              "Bu ticker icin Flow raporu bulunamadi.",
              "No Flow report was found for this ticker."
            )}
        </div>
      ) : (
        <>
          <section key={latestReport?.id || "empty"} className="grid gap-3 md:grid-cols-3">
            <article className="rounded-xl border border-border bg-card/90 p-4 shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                {copy(language, "Guncel Rapor", "Current Report")}
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {formatFlowReportDate(latestReport.reportDate, locale)}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {copy(
                  language,
                  "Bu hisse altindaki en yeni Flow raporu.",
                  "The most recent Flow report under this stock."
                )}
              </p>
            </article>

            <article className="rounded-xl border border-border bg-card/90 p-4 shadow-md">
              <div className="flex items-center gap-2">
                <History className="size-4 text-sky-300" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                  {copy(language, "Arsiv", "Archive")}
                </p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {archiveReports.length}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {copy(
                  language,
                  "Ayni hisse icin saklanan onceki raporlar.",
                  "Previous reports stored for the same stock."
                )}
              </p>
            </article>

            <article className="rounded-xl border border-border bg-card/90 p-4 shadow-md">
              <div className="flex items-center gap-2">
                <Clock3 className="size-4 text-amber-300" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                  {copy(language, "Son Guncelleme", "Latest Update")}
                </p>
              </div>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {formatFlowTimestamp(latestReport.updatedAt, locale)}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {copy(
                  language,
                  "Guncel raporun sisteme son islenme zamani.",
                  "The latest processing timestamp for the current report."
                )}
              </p>
            </article>
          </section>

          <section className="rounded-xl border border-border bg-card/95 p-4 shadow-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                  {copy(language, "Guncel Gorunum", "Current View")}
                </p>
                <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {latestReport.title}
                </h2>
                <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
                  {getFlowPreviewText(latestReport, language)}
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                  <span className="rounded-full border border-border bg-background/60 px-2 py-0.5">
                    {getFlowSourceLabel(latestReport)}
                  </span>
                  <span className="rounded-full border border-border bg-background/60 px-2 py-0.5">
                    {formatFlowReportDate(latestReport.reportDate, locale)}
                  </span>
                  <span className="rounded-full border border-border bg-background/60 px-2 py-0.5">
                    {formatFlowTimestamp(latestReport.updatedAt, locale)}
                  </span>
                </div>
              </div>

              <Link
                href={latestReportHref}
                className="inline-flex items-center justify-center rounded-xl border border-sky-400/35 bg-sky-500/12 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-sky-500/18"
              >
                {copy(language, "Detayi Ac", "Open Detail")}
              </Link>
            </div>
          </section>

          <section className="space-y-3">
            <div className="rounded-xl border border-border bg-card/90 p-4 shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                {copy(language, "Gecmis Raporlar", "Historical Reports")}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {copy(
                  language,
                  `${tickerGroup.ticker} arsivi`,
                  `${tickerGroup.ticker} archive`
                )}
              </h2>
            </div>

            <FlowReportList
              basePath={basePath}
              language={language}
              reports={archiveReports}
              emptyMessage={copy(
                language,
                "Bu ticker icin henuz gecmis rapor yok.",
                "There are no archived reports for this ticker yet."
              )}
            />
          </section>
        </>
      )}
    </FlowLayout>
  );
}


