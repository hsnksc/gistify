import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Clock3,
  Layers3,
  RefreshCw,
  ScrollText,
  Search,
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import FlowReportList from "../components/FlowReportList";
import FlowTickerCard from "../components/FlowTickerCard";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";
import {
  formatFlowReportDate,
  formatFlowTimestamp,
  getFlowLanguageBadge,
  getFlowPreviewText,
  getPrimaryFlowTicker,
  getFlowReportDetailPath,
  getFlowReportKind,
  getFlowTickerReportPath,
  groupFlowReportsByTicker,
} from "../lib/flowReportHelpers";

export default function FlowPage({
  language,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const [, setLocation] = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const { reports, loading, error, reload } = useFlowReportSummaries(language);
  const normalizedSearch = searchValue.trim().toUpperCase();
  const locale = language === "en" ? "en-US" : "tr-TR";

  const filteredReports = useMemo(() => {
    if (!normalizedSearch) {
      return reports;
    }

    return reports.filter(report =>
      [
        report.title,
        report.companyName,
        report.ticker,
        report.sourceLabel,
        report.sourceFolder,
      ]
        .join(" ")
        .toUpperCase()
        .includes(normalizedSearch)
    );
  }, [normalizedSearch, reports]);

  const stockReports = useMemo(
    () => filteredReports.filter(report => report.reportKind === "stock"),
    [filteredReports]
  );
  const dailyReports = useMemo(
    () => filteredReports.filter(report => report.reportKind === "daily"),
    [filteredReports]
  );
  const tickerGroups = useMemo(
    () => groupFlowReportsByTicker(stockReports),
    [stockReports]
  );

  const featuredReport = filteredReports[0] || null;
  const featuredLanguageBadge = featuredReport
    ? getFlowLanguageBadge(featuredReport, language)
    : null;
  const featuredTicker =
    featuredReport && getFlowReportKind(featuredReport) === "stock"
      ? getPrimaryFlowTicker(featuredReport)
      : "";
  const featuredDailyReport = dailyReports[0] || null;
  const featuredStockGroup = tickerGroups[0] || null;
  const featuredStockReport = featuredStockGroup?.latestReport || null;
  const recentReports = filteredReports.slice(0, 6);
  const previewTickerGroups = tickerGroups.slice(0, 6);
  const highlightedDailyReports = dailyReports.slice(0, 3);
  const latestUpdatedAt = reports[0]?.updatedAt || "";

  usePageMeta({
    description: copy(
      language,
      "Flow artik tek bir baslangic noktasi sunar: son raporlar, gunluk piyasa akisi ve hisse arsivi ayni sayfada okunur.",
      "Flow now opens with one clear starting point: recent reports, the daily market lane and the stock archive all live on the same page."
    ),
    title: copy(language, "Gistify Rapor Merkezi", "Gistify Report Center"),
  });

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

    setLocation(`/flow/${encodeURIComponent(legacyReportId)}`, {
      replace: true,
    });
  }, [setLocation]);

  return (
    <FlowLayout
      language={language}
      eyebrow={copy(language, "Flow", "Flow")}
      title={copy(language, "Rapor Merkezi", "Report Center")}
      description={copy(
        language,
        "Son raporu one cikar, gunluk piyasa notlarini ayri takip et ve hisse arsivine ticker bazinda gir.",
        "Surface the latest report first, follow daily market notes on their own lane and enter the stock archive by ticker."
      )}
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/reports")}
          >
            <Layers3 className="size-4" />
            {copy(language, "Hisse Arsivi", "Stock Archive")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/flow/daily")}
          >
            <ScrollText className="size-4" />
            {copy(language, "Gunluk Arsiv", "Daily Archive")}
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
          className="rounded-2xl border border-border bg-card/75 px-4 py-5 text-sm text-muted-foreground"
        >
          {copy(language, "Rapor merkezi yukleniyor.", "Loading report center.")}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-dashed border-border bg-card/75 px-4 py-5 text-sm text-muted-foreground"
        >
          {error}
        </div>
      ) : (
        <>
          <section className="grid gap-3 md:grid-cols-4">
            <article className="rounded-2xl border border-border bg-card/90 p-4 shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                {copy(language, "Hisse Basligi", "Ticker Library")}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {tickerGroups.length}
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card/90 p-4 shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                {copy(language, "Hisse Raporu", "Stock Reports")}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {stockReports.length}
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card/90 p-4 shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                {copy(language, "Gunluk Rapor", "Daily Reports")}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {dailyReports.length}
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card/90 p-4 shadow-md">
              <div className="flex items-center gap-2">
                <Clock3 className="size-4 text-amber-300" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                  {copy(language, "Son Guncelleme", "Latest Update")}
                </p>
              </div>
              <p className="mt-2 text-base font-semibold text-foreground">
                {latestUpdatedAt
                  ? formatFlowTimestamp(latestUpdatedAt, locale)
                  : "-"}
              </p>
            </article>
          </section>

          <section className="rounded-[2rem] border border-border bg-card/95 p-5 shadow-2xl">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {copy(language, "Buradan Basla", "Start Here")}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {featuredReport
                    ? featuredReport.title
                    : copy(
                        language,
                        "Henuz gosterilecek rapor yok",
                        "There is no report to surface yet"
                      )}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                  {featuredReport
                    ? getFlowPreviewText(featuredReport, language)
                    : copy(
                        language,
                        "Flow kaynaklari geldiginde en yeni rapor bu alana sabitlenir.",
                        "Once flow sources arrive, the latest report will stay pinned here."
                      )}
                </p>
                {featuredReport ? (
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="rounded-full border border-border bg-background/60 px-2 py-0.5 font-semibold uppercase tracking-wider text-muted-foreground">
                      {getFlowReportKind(featuredReport) === "daily"
                        ? copy(language, "Gunluk", "Daily")
                        : copy(language, "Hisse", "Stock")}
                    </span>
                    <span className="rounded-full border border-border bg-background/60 px-2 py-0.5 font-semibold uppercase tracking-wider text-muted-foreground">
                      {formatFlowReportDate(featuredReport.reportDate, locale)}
                    </span>
                    {featuredTicker &&
                    featuredTicker !== "MARKET" &&
                    featuredTicker !== "FLOW" ? (
                      <span className="rounded-full border border-border bg-background/60 px-2 py-0.5 font-semibold uppercase tracking-wider text-muted-foreground">
                        {featuredTicker}
                      </span>
                    ) : null}
                    {featuredLanguageBadge ? (
                      <span
                        className={`rounded-full border px-2 py-0.5 font-semibold uppercase tracking-wider ${featuredLanguageBadge.toneClassName}`}
                      >
                        {featuredLanguageBadge.label}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="w-full max-w-xl space-y-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchValue}
                    onChange={event => setSearchValue(event.target.value)}
                    placeholder={copy(
                      language,
                      "Ticker, sirket veya rapor basligi ara",
                      "Search ticker, company or report title"
                    )}
                    className="h-11 rounded-[1rem] border-border bg-background/60 pl-10"
                  />
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    onClick={() =>
                      featuredReport
                        ? setLocation(getFlowReportDetailPath(featuredReport.id))
                        : undefined
                    }
                    disabled={!featuredReport}
                  >
                    <ArrowRight className="size-4" />
                    {copy(language, "Son Raporu Ac", "Open Latest Report")}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      featuredStockGroup
                        ? setLocation(
                            getFlowTickerReportPath(featuredStockGroup.ticker)
                          )
                        : setLocation("/reports")
                    }
                  >
                    <Layers3 className="size-4" />
                    {copy(language, "Ticker Arsivi", "Ticker Archive")}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      featuredDailyReport
                        ? setLocation(getFlowReportDetailPath(featuredDailyReport.id))
                        : setLocation("/flow/daily")
                    }
                  >
                    <ScrollText className="size-4" />
                    {copy(language, "Gunluk Akis", "Daily Lane")}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setSearchValue("")}
                    disabled={!searchValue}
                  >
                    {copy(language, "Aramayi Temizle", "Clear Search")}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                {copy(language, "Son Raporlar", "Recent Reports")}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {copy(
                  language,
                  "En guncel akisi once oku",
                  "Read the freshest flow first"
                )}
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {normalizedSearch
                  ? copy(
                      language,
                      `"${normalizedSearch}" aramasi icin bulunan en guncel raporlar.`,
                      `Most recent reports matching "${normalizedSearch}".`
                    )
                  : copy(
                      language,
                      "Gunluk ve hisse raporlari tek listede tarihe gore siralanir.",
                      "Daily and stock reports are ranked together by recency."
                    )}
              </p>
            </div>

            <FlowReportList
              basePath="/flow"
              language={language}
              reports={recentReports}
              emptyMessage={copy(
                language,
                "Bu aramayla eslesen rapor bulunamadi.",
                "No report matched this search."
              )}
            />
          </section>

          <section className="space-y-3">
            <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card/90 p-4 shadow-md lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                  {copy(language, "Gunluk Rapor", "Daily Report")}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  {copy(language, "Piyasa gunlugu", "Market journal")}
                </h2>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
                  {copy(
                    language,
                    "ABD piyasa gunlugu ve makro kapanis raporlari burada toplanir. Son rapor ustte, tam arsiv ayri sayfada kalir.",
                    "US market journals and macro close reports live here. The latest issue stays on top while the full archive keeps its own page."
                  )}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/flow/daily")}
              >
                <ScrollText className="size-4" />
                {copy(language, "Tum Gunlukler", "Open Daily Archive")}
              </Button>
            </div>

            {!highlightedDailyReports.length ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/65 px-4 py-5 text-sm text-muted-foreground">
                {copy(
                  language,
                  "Bu filtrede gunluk piyasa raporu bulunamadi.",
                  "No daily market report matched this filter."
                )}
              </div>
            ) : (
              <FlowReportList
                basePath="/flow"
                language={language}
                reports={highlightedDailyReports}
              />
            )}
          </section>

          <section className="space-y-3">
            <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card/90 p-4 shadow-md lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                  {copy(language, "Hisse Raporlari", "Stock Reports")}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  {copy(language, "Ticker kutuphanesi", "Ticker library")}
                </h2>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
                  {copy(
                    language,
                    "Her hisse kendi kutusunu alir. Kutuya girince guncel rapor, tarihsel arsiv ve yorum paneli ayni akista acilir.",
                    "Each stock keeps its own card. Entering a card opens the current report, the historical archive and the comment panel in one flow."
                  )}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/reports")}
              >
                <Layers3 className="size-4" />
                {copy(language, "Tam Hisse Arsivi", "Full Stock Archive")}
              </Button>
            </div>

            {!previewTickerGroups.length ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/65 px-4 py-5 text-sm text-muted-foreground">
                {copy(
                  language,
                  "Bu filtrede gosterilecek hisse raporu bulunamadi.",
                  "There are no stock reports to display for this filter."
                )}
              </div>
            ) : (
              <div className="grid gap-3 lg:grid-cols-3">
                {previewTickerGroups.map(group => (
                  <FlowTickerCard
                    basePath="/flow"
                    key={group.ticker}
                    group={group}
                    language={language}
                  />
                ))}
              </div>
            )}
          </section>

          {(featuredStockReport || featuredDailyReport) && !normalizedSearch ? (
            <section className="grid gap-3 lg:grid-cols-2">
              {featuredStockReport ? (
                <article className="rounded-2xl border border-border bg-card/90 p-4 shadow-md">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                    {copy(language, "En Guncel Hisse", "Freshest Stock")}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-foreground">
                    {featuredStockReport.title}
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {getFlowPreviewText(featuredStockReport, language)}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      setLocation(
                        getFlowTickerReportPath(
                          featuredStockGroup?.ticker || featuredTicker || ""
                        )
                      )
                    }
                  >
                    {copy(language, "Ticker'a Git", "Open Ticker")}
                  </Button>
                </article>
              ) : null}

              {featuredDailyReport ? (
                <article className="rounded-2xl border border-border bg-card/90 p-4 shadow-md">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                    {copy(language, "En Guncel Gunluk", "Freshest Daily")}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-foreground">
                    {featuredDailyReport.title}
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {getFlowPreviewText(featuredDailyReport, language)}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => setLocation("/flow/daily")}
                  >
                    {copy(language, "Gunluk Arsivi Ac", "Open Daily Archive")}
                  </Button>
                </article>
              ) : null}
            </section>
          ) : null}
        </>
      )}
    </FlowLayout>
  );
}
