import { ArrowLeft, Clock3, RefreshCw, ScrollText } from "lucide-react";
import { useLocation } from "wouter";
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
} from "../lib/flowReportHelpers";

export default function FlowDailyPage({
  language,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const [, setLocation] = useLocation();
  const { reports, loading, error, reload } = useFlowReportSummaries(language, {
    reportKind: "daily",
  });
  const latestReport = reports[0] || null;
  const archiveReports = latestReport ? reports.slice(1) : reports;
  const locale = language === "en" ? "en-US" : "tr-TR";

  usePageMeta({
    description: copy(
      language,
      "Gistify Flow gunluk piyasa raporlari arsivi.",
      "Gistify Flow daily market report archive."
    ),
    title: copy(language, "Gunluk Rapor Arsivi | Gistify", "Daily Report Archive | Gistify"),
  });

  return (
    <FlowLayout
      language={language}
      eyebrow="Daily"
      title={copy(language, "Gunluk Rapor Arsivi", "Daily Report Archive")}
      description={copy(
        language,
        "Piyasa gunlugu, makro kapanis ozeti ve market-wide HTML raporlar bu yuzeyde toplanir.",
        "Market journals, macro close summaries and market-wide HTML reports are collected on this surface."
      )}
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/flow")}
          >
            <ArrowLeft className="size-4" />
            {copy(language, "Rapor Merkezi", "Report Center")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void reload()}>
            <RefreshCw className="size-4" />
            {copy(language, "Yenile", "Refresh")}
          </Button>
        </>
      }
    >
      <section key={latestReport?.id || "empty"} className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card/90 p-4 shadow-md">
          <div className="flex items-center gap-2">
            <ScrollText className="size-4 text-cyan-300" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
              {copy(language, "Toplam Gunluk", "Total Daily Reports")}
            </p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {reports.length}
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card/90 p-4 shadow-md">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            {copy(language, "Son Rapor Tarihi", "Latest Report Date")}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {latestReport
              ? formatFlowReportDate(latestReport.reportDate, locale)
              : "-"}
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card/90 p-4 shadow-md">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-amber-300" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
              {copy(language, "Son Guncelleme", "Latest Update")}
            </p>
          </div>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {latestReport
              ? formatFlowTimestamp(latestReport.updatedAt, locale)
              : "-"}
          </p>
        </article>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card/75 px-4 py-5 text-sm text-muted-foreground">
          {copy(language, "Gunluk raporlar yukleniyor.", "Loading daily reports.")}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/75 px-4 py-5 text-sm text-muted-foreground">
          {error}
        </div>
      ) : !latestReport ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/65 px-4 py-5 text-sm text-muted-foreground">
          {copy(
            language,
            "Henuz gunluk piyasa raporu bulunamadi.",
            "No daily market report is available yet."
          )}
        </div>
      ) : (
        <>
          <section className="rounded-2xl border border-border bg-card/95 p-4 shadow-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                  {copy(language, "One Cikan Rapor", "Featured Daily")}
                </p>
                <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {latestReport.title}
                </h2>
                <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
                  {getFlowPreviewText(latestReport, language)}
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                  <span className="rounded-full border border-border bg-background/60 px-2 py-0.5">
                    {formatFlowReportDate(latestReport.reportDate, locale)}
                  </span>
                  <span className="rounded-full border border-border bg-background/60 px-2 py-0.5">
                    {formatFlowTimestamp(latestReport.updatedAt, locale)}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation(`/flow/${encodeURIComponent(latestReport.id)}`)}
              >
                {copy(language, "Raporu Ac", "Open Report")}
              </Button>
            </div>
          </section>

          <section className="space-y-3">
            <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                {copy(language, "Arsiv", "Archive")}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {copy(language, "Tum gunluk raporlar", "All daily reports")}
              </h2>
            </div>

            <FlowReportList
              basePath="/flow"
              language={language}
              reports={archiveReports}
            />
          </section>
        </>
      )}
    </FlowLayout>
  );
}
