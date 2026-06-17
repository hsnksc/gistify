import { ArrowLeft, Clock3, RefreshCw, ScrollText } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import FlowReportCard from "../components/FlowReportCard";
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
  const locale = language === "en" ? "en-US" : "tr-TR";

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
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <div className="flex items-center gap-2">
            <ScrollText className="size-4 text-cyan-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {copy(language, "Toplam Gunluk", "Total Daily Reports")}
            </p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {reports.length}
          </p>
        </article>

        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {copy(language, "Son Rapor Tarihi", "Latest Report Date")}
          </p>
          <p className="mt-4 text-xl font-semibold text-foreground">
            {latestReport
              ? formatFlowReportDate(latestReport.reportDate, locale)
              : "-"}
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
            {latestReport
              ? formatFlowTimestamp(latestReport.updatedAt, locale)
              : "-"}
          </p>
        </article>
      </section>

      {loading ? (
        <div className="rounded-[1.8rem] border border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground">
          {copy(language, "Gunluk raporlar yukleniyor.", "Loading daily reports.")}
        </div>
      ) : error ? (
        <div className="rounded-[1.8rem] border border-dashed border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground">
          {error}
        </div>
      ) : !latestReport ? (
        <div className="rounded-[1.8rem] border border-dashed border-border bg-card/65 px-5 py-6 text-sm text-muted-foreground">
          {copy(
            language,
            "Henuz gunluk piyasa raporu bulunamadi.",
            "No daily market report is available yet."
          )}
        </div>
      ) : (
        <>
          <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  {copy(language, "One Cikan Rapor", "Featured Daily")}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {latestReport.title}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                  {getFlowPreviewText(latestReport, language)}
                </p>
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

          <section className="space-y-4">
            <div className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                {copy(language, "Arsiv", "Archive")}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">
                {copy(language, "Tum gunluk raporlar", "All daily reports")}
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {reports.map(report => (
                <FlowReportCard
                  basePath="/flow"
                  key={report.id}
                  language={language}
                  report={report}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </FlowLayout>
  );
}
