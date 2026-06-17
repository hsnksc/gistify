import { useMemo, useState } from "react";
import {
  Database,
  RefreshCw,
  Search,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import ReportGalleryCard from "../components/reports/ReportGalleryCard";
import ReportUploadDropzone from "../components/reports/ReportUploadDropzone";
import { useFlowReports } from "../hooks/useFlowReports";
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
    useFlowReports(language);
  const {
    clearUploadQueue,
    error: localError,
    hydrate,
    loading: localLoading,
    removeReport,
    reports: localReports,
    uploadFiles,
    uploadQueue,
  } = useReportStore(language);

  const serverGalleryReports = useMemo(
    () =>
      serverReports
        .map(adaptFlowReportToStoredReport)
        .filter((report): report is NonNullable<typeof report> => Boolean(report)),
    [serverReports]
  );

  const allReports = useMemo(
    () => [...serverGalleryReports, ...localReports].sort(compareStoredReports),
    [localReports, serverGalleryReports]
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
    localCount: localReports.length,
    serverCount: serverGalleryReports.length,
    todayCount: allReports.filter(report => report.reportDate === todayIso).length,
    totalCount: allReports.length,
  };
  const pageTitle = forcedTicker
    ? `${forcedTicker.toUpperCase()} · ${copy(language, "Rapor Galerisi", "Report Gallery")}`
    : copy(language, "Gistify Rapor Galerisi", "Gistify Report Gallery");
  const pageDescription = forcedTicker
    ? copy(
        language,
        `${forcedTicker.toUpperCase()} icin tum HTML raporlar, filtreler ve arsiv akisi.`,
        `All HTML reports, filters and archive flow for ${forcedTicker.toUpperCase()}.`
      )
    : copy(
        language,
        "Gunluk HTML hisse raporlarini yukle, IndexedDB icinde sakla ve tarih bazli galeride yayinla.",
        "Upload daily HTML stock reports, keep them in IndexedDB and publish them in a date-grouped gallery."
      );

  usePageMeta({
    description: pageDescription,
    title: pageTitle,
  });

  return (
    <FlowLayout
      language={language}
      eyebrow="Reports"
      title={
        forcedTicker
          ? `${forcedTicker.toUpperCase()} ${copy(language, "Rapor Galerisi", "Report Gallery")}`
          : copy(language, "Hisse HTML Rapor Galerisi", "Stock HTML Report Gallery")
      }
      description={copy(
        language,
        "Prompttaki yukleme modulu burada calisir: HTML dosyalarini surukle, metadata otomatik parse edilsin, raporlar IndexedDB icinde saklansin ve tum arsiv tarih bazli gruplanarak yayinlansin.",
        "The upload module from the prompt lives here: drop HTML files, extract metadata automatically, keep them in IndexedDB and publish the archive grouped by date."
      )}
      actions={
        <>
          <Button type="button" variant="outline" onClick={() => void hydrate()}>
            <Database className="size-4" />
            {copy(language, "Yereli Yenile", "Refresh Local")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void reload()}>
            <RefreshCw className="size-4" />
            {copy(language, "Yayinliyi Yenile", "Refresh Published")}
          </Button>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {copy(language, "Toplam Rapor", "Total Reports")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {summary.totalCount}
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
            {copy(language, "Yerel Arsiv", "Local Archive")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {summary.localCount}
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
            {copy(language, "Yayinli Arsiv", "Published Archive")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {summary.serverCount}
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {copy(language, "Bugun", "Today")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {summary.todayCount}
          </p>
        </article>
      </section>

      {!forcedTicker ? (
        <ReportUploadDropzone
          language={language}
          onFilesSelected={files => void uploadFiles(files)}
          onQueueClear={clearUploadQueue}
          uploadQueue={uploadQueue}
        />
      ) : null}

      <section className="rounded-[2rem] border border-border bg-card/95 p-5 shadow-2xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
              {copy(language, "Filtreler", "Filters")}
            </p>
            <h2 className="text-xl font-semibold text-foreground">
              {copy(language, "Ara, filtrele ve tarihe gore grupla", "Search, filter and group by date")}
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
              {copy(language, "Bugunun Raporlari", "Today's Reports")}
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
              {copy(language, "Sifirla", "Reset")}
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={forcedTicker || searchValue}
                onChange={event => setSearchValue(event.target.value)}
                disabled={Boolean(forcedTicker)}
                placeholder={copy(
                  language,
                  "Ticker veya sirket ara",
                  "Search ticker or company"
                )}
                className="h-11 rounded-[1rem] border-border bg-background/60 pl-10"
              />
            </div>
          </div>

          <Select value={recommendationFilter} onValueChange={setRecommendationFilter}>
            <SelectTrigger className="h-11 w-full rounded-[1rem] border-border bg-background/60">
              <SelectValue placeholder={copy(language, "Oneri", "Recommendation")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{copy(language, "Tum Oneriler", "All Recommendations")}</SelectItem>
              <SelectItem value="BUY">{copy(language, "AL", "BUY")}</SelectItem>
              <SelectItem value="HOLD">{copy(language, "TUT", "HOLD")}</SelectItem>
              <SelectItem value="SELL">{copy(language, "SAT", "SELL")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={exchangeFilter} onValueChange={setExchangeFilter}>
            <SelectTrigger className="h-11 w-full rounded-[1rem] border-border bg-background/60">
              <SelectValue placeholder={copy(language, "Borsa", "Exchange")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{copy(language, "Tum Borsalar", "All Exchanges")}</SelectItem>
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
              className="h-11 rounded-[1rem] border-border bg-background/60"
            />
            <Select value={sortOrder} onValueChange={value => setSortOrder(value as "newest" | "oldest")}>
              <SelectTrigger className="h-11 w-full rounded-[1rem] border-border bg-background/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{copy(language, "En Yeni", "Newest")}</SelectItem>
                <SelectItem value="oldest">{copy(language, "En Eski", "Oldest")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {serverError || localError ? (
        <div className="rounded-[1.8rem] border border-dashed border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground">
          {[serverError, localError].filter(Boolean).join(" · ")}
        </div>
      ) : null}

      {serverLoading || localLoading ? (
        <div className="rounded-[1.8rem] border border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground">
          {copy(language, "Rapor galerisi yukleniyor.", "Loading report gallery.")}
        </div>
      ) : !groupedReports.length ? (
        <div className="rounded-[1.8rem] border border-dashed border-border bg-card/65 px-5 py-6 text-sm text-muted-foreground">
          {copy(
            language,
            "Secilen filtrelerle eslesen rapor bulunamadi.",
            "No reports matched the current filters."
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedReports.map(([reportDate, reports]) => (
            <section
              key={reportDate}
              className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {copy(language, "Tarih Grubu", "Date Group")}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">
                    {getReportDateHeading(reportDate, language)}
                  </h2>
                </div>
                <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {reports.length} {copy(language, "rapor", "reports")}
                </span>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-2">
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

      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <UploadCloud className="mt-1 size-4 text-indigo-300" />
          <div className="space-y-2 text-sm leading-7 text-muted-foreground">
            <p>
              {copy(
                language,
                "Yerel yuklemeler IndexedDB icinde sadece bu tarayicida tutulur. Uretimde bu katman object storage + veritabani ile degistirilebilir.",
                "Local uploads are stored in IndexedDB only inside this browser. In production this layer can be swapped for object storage + database persistence."
              )}
            </p>
            <p>
              {copy(
                language,
                "Yayinli kaynaklar ise mevcut Flow HTML arsivinden okunur; boylece yeni upload modulu onceki raporlari bozmadan ayni galeriye katilir.",
                "Published sources are read from the existing Flow HTML archive so the new upload module joins the same gallery without breaking earlier reports."
              )}
            </p>
          </div>
        </div>
      </section>
    </FlowLayout>
  );
}
