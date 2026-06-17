import { useEffect, useMemo } from "react";
import { Clock3, Layers3, RefreshCw, ScrollText } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import FlowReportCard from "../components/FlowReportCard";
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
  const stockReports = useMemo(
    () => reports.filter(report => report.reportKind === "stock"),
    [reports]
  );
  const dailyReports = useMemo(
    () => reports.filter(report => report.reportKind === "daily"),
    [reports]
  );
  const tickerGroups = useMemo(
    () => groupFlowReportsByTicker(stockReports),
    [stockReports]
  );
  const latestDailyReport = dailyReports[0] || null;
  const highlightedDailyReports = latestDailyReport
    ? dailyReports.slice(0, 3)
    : [];
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
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {copy(language, "Hisse Basligi", "Ticker Library")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {tickerGroups.length}
          </p>
        </article>

        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
            {copy(language, "Hisse Raporu", "Stock Reports")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {stockReports.length}
          </p>
        </article>

        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {copy(language, "Gunluk Rapor", "Daily Reports")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {dailyReports.length}
          </p>
        </article>

        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-amber-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
              {copy(language, "Son Guncelleme", "Latest Update")}
            </p>
          </div>
          <p className="mt-4 text-xl font-semibold text-foreground">
            {latestUpdatedAt
              ? formatFlowTimestamp(latestUpdatedAt, locale)
              : "-"}
          </p>
        </article>
      </section>

      {loading ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-[1.8rem] border border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground"
        >
          {copy(language, "Rapor merkezi yukleniyor.", "Loading report center.")}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-[1.8rem] border border-dashed border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground"
        >
          {error}
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  {copy(language, "Gunluk Rapor", "Daily Report")}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  {copy(language, "Piyasa gunlugu", "Market journal")}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
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
              <div className="rounded-[1.8rem] border border-dashed border-border bg-card/65 px-5 py-6 text-sm text-muted-foreground">
                {copy(
                  language,
                  "Henuz gunluk piyasa raporu bulunamadi.",
                  "No daily market report is available yet."
                )}
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-3">
                {highlightedDailyReports.map(report => (
                  <FlowReportCard
                    basePath="/flow"
                    key={report.id}
                    language={language}
                    report={report}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {copy(language, "Hisse Raporlari", "Stock Reports")}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  {copy(language, "Ticker kutuphanesi", "Ticker library")}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
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
              <div className="rounded-[1.8rem] border border-dashed border-border bg-card/65 px-5 py-6 text-sm text-muted-foreground">
                {copy(
                  language,
                  "Henuz gosterilecek hisse raporu bulunamadi.",
                  "There are no stock reports to display yet."
                )}
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
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
