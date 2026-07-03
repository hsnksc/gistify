import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  DailyReportContent, DailyReportSourcePackage, } from "@shared/dailyReports";
import {
  BookOpen, CalendarRange, GalleryHorizontal, RefreshCw, Sparkles, Target, } from "lucide-react";
import DailyReportViewer from "@/components/reports/DailyReportViewer";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { usePageMeta } from "@/hooks/usePageMeta";
import { type AppLanguage, t } from "@/lib/i18n";

interface DailyReportsResponse {
  sources?: DailyReportSourcePackage[];
}

interface ViewerReport {
  content: DailyReportContent;
  id: string;
  reportDate: string;
  sourceFolder: string;
  title: string;
  updatedAt: string;
}

function sortSourcePackagesNewestFirst(sources: DailyReportSourcePackage[]) {
  return [...sources].sort((left, right) => {
    const byDate = right.reportDate.localeCompare(left.reportDate);
    if (byDate !== 0) {
      return byDate;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

function mapSourceToViewerReport(source: DailyReportSourcePackage): ViewerReport {
  return {
    content: {
      assetBasePath: source.assetBasePath,
      author: source.author,
      coverage: source.coverage,
      executiveSummary: source.executiveSummary,
      figureFiles: source.figureFiles,
      headline: source.headline,
      html: source.html,
      markdown: source.markdown,
      metadataItems: source.metadataItems,
      methodology: source.methodology,
      contentFormat: source.contentFormat,
      openAiFigureFiles: source.openAiFigureFiles,
      researchFileCount: source.researchFileCount,
      sectionFiles: source.sectionFiles,
      sourceKind: source.sourceKind,
      sourceLabel: source.sourceLabel,
      tickerUniverse: source.tickerUniverse,
    },
    id: source.id,
    reportDate: source.reportDate,
    sourceFolder: source.folderName,
    title: source.title,
    updatedAt: source.updatedAt,
  };
}

function formatReportDate(reportDate: string, locale = "tr-TR") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${reportDate}T00:00:00Z`));
}

function formatUpdateStamp(value: string, locale = "tr-TR") {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(parsed);
}

function MetaPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarRange;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground">
      <Icon className="size-3.5 text-emerald-300" />
      <span className="font-semibold uppercase tracking-[0.16em]">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function ReportSelectorCard({
  active,
  locale,
  onSelect,
  report,
}: {
  active: boolean;
  locale: string;
  onSelect: (reportId: string) => void;
  report: ViewerReport;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(report.id)}
      className={`min-w-[220px] rounded-xl border px-4 py-3 text-left transition-all ${
        active
          ? "border-sky-400/45 bg-sky-500/14 shadow-[0_0_18px_rgba(14,165,233,0.14)]"
          : "border-border bg-background/45 hover:bg-background/70"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
          {formatReportDate(report.reportDate, locale)}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {formatUpdateStamp(report.updatedAt, locale)}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">
        {report.title}
      </p>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
        {report.content.headline}
      </p>
    </button>
  );
}

export default function DailyReportPage({
  language,
}: {
  language: AppLanguage;
}) {
  usePageMeta({
    description: t("flow:gistifyDailyMarketReportMacro"),
    title: t("flow:dailyReportGistify"),
  });

  const [reports, setReports] = useState<ViewerReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [loading, setLoading] = useState(true);
  const locale = language === "en" ? "en-US" : "tr-TR";

  const getFigureFiles = (report: ViewerReport) =>
    Array.isArray(report.content.figureFiles) ? report.content.figureFiles : [];
  const getTickerUniverse = (report: ViewerReport) =>
    Array.isArray(report.content.tickerUniverse) ? report.content.tickerUniverse : [];
  const getOpenAiFigures = (report: ViewerReport) =>
    Array.isArray(report.content.openAiFigureFiles)
      ? report.content.openAiFigureFiles
      : [];

  const loadReports = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/daily-report-sources", {
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        setReports([]);
        setSelectedReportId("");
        return;
      }

      const payload = (await response.json()) as DailyReportsResponse;
      const nextReports = sortSourcePackagesNewestFirst(payload.sources || []).map(
        mapSourceToViewerReport
      );
      setReports(nextReports);
      setSelectedReportId(current =>
        current && nextReports.some(report => report.id === current)
          ? current
          : nextReports[0]?.id || ""
      );
    } catch {
      setReports([]);
      setSelectedReportId("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const selectedReport = useMemo(
    () => reports.find(report => report.id === selectedReportId) || reports[0] || null,
    [reports, selectedReportId]
  );

  const latestReport = reports[0] || null;
  const selectedStats = selectedReport
    ? {
        aiFigures: getOpenAiFigures(selectedReport).length,
        figures: getFigureFiles(selectedReport).length,
        tickers: getTickerUniverse(selectedReport).length,
        updatedAt: formatUpdateStamp(selectedReport.updatedAt, locale),
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <section className="panel overflow-hidden">
          <div className="px-6 py-6 md:px-6 md:py-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="space-y-2">
                  <p className="heading-condensed text-sm uppercase tracking-[0.18em] text-sky-300">
                    {t("flow:dailyReport")}
                  </p>
                  <h1 className="heading-condensed text-3xl leading-none text-foreground md:text-5xl">
                    {selectedReport?.title ||
                      t("flow:dailyReports")}
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                    {t("flow:dailySourcePackagesAreSelected")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="outline" onClick={() => void loadReports()}>
                    <RefreshCw className="size-4" />
                    {t("common:refresh")}
                  </Button>
                </div>
              </div>

              {reports.length ? (
                <>
                  <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                    <div className="rounded-xl border border-border bg-background/45 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        {t("flow:latest")}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {latestReport?.title || "-"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {latestReport?.reportDate
                          ? formatReportDate(latestReport.reportDate, locale)
                          : "-"}{" "}
                        · {latestReport ? formatUpdateStamp(latestReport.updatedAt, locale) : "-"}
                      </p>
                    </div>

                    <div className="space-y-3 rounded-xl border border-border bg-background/45 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {t("flow:dailyReportSelection")}
                        </p>
                        <div className="w-full md:max-w-[360px]">
                          <Select
                            value={selectedReportId || selectedReport?.id || ""}
                            onValueChange={setSelectedReportId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={t("flow:selectADailyReport")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {reports.map(report => (
                                <SelectItem key={report.id} value={report.id}>
                                  {formatReportDate(report.reportDate, locale)} · {report.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="terminal-scrollbar flex gap-3 overflow-x-auto pb-1">
                        {reports.map(report => (
                          <ReportSelectorCard
                            key={report.id}
                            report={report}
                            active={report.id === selectedReport?.id}
                            onSelect={setSelectedReportId}
                            locale={locale}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedReport ? (
                    <div className="flex flex-wrap gap-2">
                      <MetaPill
                        icon={BookOpen}
                        label={t("common:source")}
                        value={selectedReport.content.sourceLabel || selectedReport.sourceFolder}
                      />
                      <MetaPill
                        icon={CalendarRange}
                        label={t("flow:reportDate2275")}
                        value={formatReportDate(selectedReport.reportDate, locale)}
                      />
                      <MetaPill
                        icon={GalleryHorizontal}
                        label={t("flow:figure7f0f")}
                        value={String(selectedStats?.figures || 0)}
                      />
                      <MetaPill
                        icon={Sparkles}
                        label={"OpenAI"}
                        value={String(selectedStats?.aiFigures || 0)}
                      />
                      <MetaPill
                        icon={Target}
                        label={t("common:ticker")}
                        value={String(selectedStats?.tickers || 0)}
                      />
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background/35 px-4 py-3 text-sm text-muted-foreground">
                  {loading
                    ? t("flow:loadingDailyReportLibrary")
                    : t("flow:noDisplayableReportWasFound")}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 panel min-w-0 overflow-hidden">
          <div className="border-b border-border px-6 py-4 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                    {t("flow:dailyIntelligence")}
                  </span>
                  {selectedStats?.aiFigures ? (
                    <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      {t("flow:openaiChartEnabled")}
                    </span>
                  ) : null}
                </div>
                <h2 className="heading-condensed text-2xl text-foreground md:text-3xl">
                  {selectedReport?.title ||
                    t("flow:selectADailyReport6aef")}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                  {selectedReport?.content.headline ||
                    t("flow:theReadingPanelOpensHere")}
                </p>
              </div>

              {selectedStats ? (
                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                    {selectedStats.figures} {t("scanner:acceptLossCloseBeforeIv")}
                  </span>
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                    {selectedStats.tickers} {t("flow:ticker")}
                  </span>
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                    {t("flow:updated")} {selectedStats.updatedAt}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="p-4 md:p-6">
            {selectedReport ? (
              <DailyReportViewer
                key={selectedReport.id}
                language={language}
                title={selectedReport.title}
                reportDate={selectedReport.reportDate}
                updatedAt={selectedReport.updatedAt}
                sourceFolder={selectedReport.sourceFolder}
                content={selectedReport.content}
              />
            ) : (
              <div className="grid min-h-[420px] place-items-center">
                <div className="text-center">
                  <BookOpen className="mx-auto size-10 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    {t("flow:theReadingPanelWillOpen")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}


