import { useMemo, useState } from "react";
import {
  AlertCircle, Database, RefreshCw, Search, SearchX, Sparkles, } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import LoadingState from "@/components/ui/loading-state";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { type AppLanguage, t } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import ReportGalleryCard from "../components/reports/ReportGalleryCard";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";
import {
  adaptFlowReportToStoredReport,
  compareStoredReports,
  getReportDateHeading,
  groupStoredReportsByDate,
} from "../lib/reportGallery";
import { useReportStore } from "../store/useReportStore";

interface ReportsIndexPageProps {
  forcedTicker?: string;
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}

export default function ReportsIndexPage({
  forcedTicker = "",
  language,
}: ReportsIndexPageProps) {
  const [searchValue, setSearchValue] = useState("");
  const [recommendationFilter, setRecommendationFilter] = useState("all");
  const [exchangeFilter, setExchangeFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const { reports: serverReports, loading: serverLoading, error: serverError, reload } =
    useFlowReportSummaries(language, { reportKind: "stock" });
  const {
    error: localError,
    hydrate,
    loading: localLoading,
    removeReport,
    reports: localReports,
  } = useReportStore(language);

  const serverGalleryReports = useMemo(
    () =>
      serverReports
        .map(adaptFlowReportToStoredReport)
        .filter((report): report is NonNullable<typeof report> => Boolean(report)),
    [serverReports]
  );

  const stockLocalReports = useMemo(
    () =>
      localReports.filter(report => (report.reportKind || "stock") === "stock"),
    [localReports]
  );

  const allReports = useMemo(
    () => [...serverGalleryReports, ...stockLocalReports].sort(compareStoredReports),
    [serverGalleryReports, stockLocalReports]
  );
  const todayIso = new Date().toISOString().slice(0, 10);
  const effectiveSearch = (forcedTicker || searchValue).trim().toUpperCase();

  const filteredReports = useMemo(() => {
    const base = allReports.filter(report => {
      const matchesTicker = effectiveSearch
        ? [report.ticker, report.companyName, report.fileName, report.sourceLabel]
            .join(" ")
            .toUpperCase()
            .includes(effectiveSearch)
        : true;
      const matchesRecommendation =
        recommendationFilter === "all" ||
        report.recommendation === recommendationFilter;
      const matchesExchange =
        exchangeFilter === "all" || report.exchange === exchangeFilter;
      const matchesDate = !selectedDate || report.reportDate === selectedDate;
      return (
        matchesTicker &&
        matchesRecommendation &&
        matchesExchange &&
        matchesDate
      );
    });

    const sorted = [...base].sort(compareStoredReports);
    return sortOrder === "oldest" ? sorted.reverse() : sorted;
  }, [
    allReports,
    effectiveSearch,
    exchangeFilter,
    recommendationFilter,
    selectedDate,
    sortOrder,
  ]);

  const groupedReports = useMemo(() => {
    const grouped = groupStoredReportsByDate(filteredReports);
    return sortOrder === "oldest" ? [...grouped].reverse() : grouped;
  }, [filteredReports, sortOrder]);

  const exchangeOptions = useMemo(
    () =>
      Array.from(
        new Set(allReports.map(report => report.exchange).filter(Boolean))
      ).sort(),
    [allReports]
  );

  const summary = {
    localCount: stockLocalReports.length,
    serverCount: serverGalleryReports.length,
    todayCount: allReports.filter(report => report.reportDate === todayIso).length,
    totalCount: allReports.length,
  };
  const pageTitle = forcedTicker
    ? `${forcedTicker.toUpperCase()} · ${t("flow:reportGallery")}`
    : t("flow:gistifyReportGallery");
  const pageDescription = forcedTicker
    ? t("flow:allHtmlReportsFiltersAnd", { touppercase: forcedTicker.toUpperCase() })
    : t("flow:archiveAndBrowseStockHtml");

  usePageMeta({
    description: pageDescription,
    title: pageTitle,
  });

  return (
    <FlowLayout
      language={language}
      eyebrow={t("common:reports")}
      title={
        forcedTicker
          ? `${forcedTicker.toUpperCase()} ${t("flow:reportGallery")}`
          : t("flow:stockHtmlReportGallery")
      }
      description={t("flow:filterAndArchiveStockHtml")}
      actions={
        <>
          <Button type="button" variant="outline" onClick={() => void hydrate()}>
            <Database className="size-4" />
            {t("flow:refreshLocal")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void reload()}>
            <RefreshCw className="size-4" />
            {t("flow:refreshPublished")}
          </Button>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {t("flow:totalReports")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {summary.totalCount}
          </p>
        </article>
        <article className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            {t("flow:localArchive")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {summary.localCount}
          </p>
        </article>
        <article className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
            {t("flow:publishedArchive")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {summary.serverCount}
          </p>
        </article>
        <article className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {t("scanner:premiumSaleMakesSenseIv")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {summary.todayCount}
          </p>
        </article>
      </section>


      <section className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
              {t("flow:filters")}
            </p>
            <h2 className="text-xl font-semibold text-foreground">
              {t("flow:searchFilterAndGroupBy")}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={selectedDate === todayIso ? "secondary" : "outline"}
              onClick={() =>
                setSelectedDate(current => (current === todayIso ? "" : todayIso))
              }
            >
              <Sparkles className="size-4" />
              {t("flow:todaySReports")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSearchValue("");
                setRecommendationFilter("all");
                setExchangeFilter("all");
                setSelectedDate("");
                setSortOrder("newest");
              }}
            >
              {t("flow:reset")}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={forcedTicker || searchValue}
                onChange={event => setSearchValue(event.target.value)}
                disabled={Boolean(forcedTicker)}
                placeholder={t("flow:searchTickerOrCompany")}
                className="h-11 rounded-xl border-border bg-background/60 pl-10"
              />
            </div>
          </div>

          <Select value={recommendationFilter} onValueChange={setRecommendationFilter}>
            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-background/60">
              <SelectValue placeholder={t("flow:recommendation")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("flow:allRecommendations")}</SelectItem>
              <SelectItem value="BUY">{t("common:buy36db")}</SelectItem>
              <SelectItem value="HOLD">{t("common:hold")}</SelectItem>
              <SelectItem value="SELL">{t("common:sell")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={exchangeFilter} onValueChange={setExchangeFilter}>
            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-background/60">
              <SelectValue placeholder={t("flow:exchange")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("flow:allExchanges")}</SelectItem>
              {exchangeOptions.map(exchange => (
                <SelectItem key={exchange} value={exchange}>
                  {exchange}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-3">
            <Input
              type="date"
              value={selectedDate}
              onChange={event => setSelectedDate(event.target.value)}
              className="h-11 rounded-xl border-border bg-background/60"
            />
            <Select value={sortOrder} onValueChange={value => setSortOrder(value as "newest" | "oldest")}>
              <SelectTrigger className="h-11 w-full rounded-xl border-border bg-background/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("flow:newest")}</SelectItem>
                <SelectItem value="oldest">{t("flow:oldest")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {serverError || localError ? (
        <EmptyState
          description={[serverError, localError].filter(Boolean).join(" · ")}
          icon={AlertCircle}
          role="alert"
          title={t("flow:reportGalleryCouldNotBe")}
          tone="danger"
        />
      ) : null}

      {serverLoading || localLoading ? (
        <LoadingState
          compact
          label={t("flow:loadingReportGallery")}
        />
      ) : !groupedReports.length ? (
        <EmptyState
          description={t("flow:adjustTheSearchDateOr")}
          icon={SearchX}
          title={t("flow:noReportsMatchedTheCurrent")}
        />
      ) : (
        <div className="space-y-6">
          {groupedReports.map(([reportDate, reports]) => (
            <section
              key={reportDate}
              className="rounded-xl border border-border bg-card/90 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {t("flow:dateGroup")}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">
                    {getReportDateHeading(reportDate, language)}
                  </h2>
                </div>
                <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {reports.length} {t("flow:reports")}
                </span>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                {reports.map(report => (
                  <ReportGalleryCard
                    key={report.id}
                    language={language}
                    onRemove={removeReport}
                    report={report}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

    </FlowLayout>
  );
}


