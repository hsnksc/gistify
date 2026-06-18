import { useEffect } from "react";
import { Clock3, Layers3, RefreshCw, ScrollText } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import FlowReportRow from "../components/FlowReportRow";
import FlowTickerCard from "../components/FlowTickerCard";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";
import {
  formatFlowTimestamp,
  groupFlowReportsByTicker,
} from "../lib/flowReportHelpers";

export default function FlowPage({
  language,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const [, setLocation] = useLocation();
  const { reports, loading, error, reload } = useFlowReportSummaries(language);
  const stockReports = reports.filter(report => report.reportKind === "stock");
  const dailyReports = reports.filter(report => report.reportKind === "daily");
  const tickerGroups = groupFlowReportsByTicker(stockReports);
  const highlightedDailyReports = dailyReports.slice(0, 3);
  const previewTickerGroups = tickerGroups.slice(0, 6);
  const locale = language === "en" ? "en-US" : "tr-TR";
  const latestUpdatedAt = reports[0]?.updatedAt || "";

  usePageMeta({
    description: copy(
      language,
      "Flow artik iki temiz yuzey sunar: hisse HTML raporlari ve gunluk piyasa raporlari.",
      "Flow now opens as a two-part report center for stock HTML reports and daily market reports."
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
      eyebrow="Flow"
      title={copy(language, "Rapor Merkezi", "Report Center")}
      description={copy(
        language,
        "Hisse HTML raporlarini arsivle, gunluk piyasa raporlarini ayri bir yuzeyde takip et.",
        "Archive stock HTML reports and follow daily market reports on a separate surface."
      )}
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/reports")}
          >
            <Layers3 className="size-4" />
            {copy(language, "Hisse Raporlari", "Stock Reports")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/flow/daily")}
          >
            <ScrollText className="size-4" />
            {copy(language, "Gunluk Rapor", "Daily Report")}
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
                    "ABD piyasa gunlugu ve makro kapanis raporlari burada toplanir. Son raporu one cikar, arsivi ayri sayfada ac.",
                    "US market journals and macro close reports live here. Surface the latest issue first and open the archive on its own page."
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
                  "Henuz gunluk piyasa raporu bulunamadi.",
                  "No daily market report is available yet."
                )}
              </div>
            ) : (
              <div className="grid gap-3">
                {highlightedDailyReports.map(report => (
                  <FlowReportRow
                    basePath="/flow"
                    key={report.id}
                    language={language}
                    report={report}
                  />
                ))}
              </div>
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
                    "Her hisse kendi kartini alir. Karta girince guncel rapor, gecmis arsiv ve yorum paneli ayni akista acilir.",
                    "Each stock keeps its own card. Entering the card opens the latest report, the archive and the comment panel in one flow."
                  )}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/reports")}
              >
                <Layers3 className="size-4" />
                {copy(language, "Galeriye Git", "Open Stock Gallery")}
              </Button>
            </div>

            {!previewTickerGroups.length ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/65 px-4 py-5 text-sm text-muted-foreground">
                {copy(
                  language,
                  "Henuz gosterilecek hisse raporu bulunamadi.",
                  "There are no stock reports to display yet."
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
        </>
      )}
    </FlowLayout>
  );
}
