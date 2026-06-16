import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Layers3, RefreshCw } from "lucide-react";
import { Link, useLocation } from "wouter";
import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import FlowReportList from "../components/FlowReportList";
import { useFlowReports } from "../hooks/useFlowReports";
import { useFlowSources } from "../hooks/useFlowSources";
import {
  formatFlowReportDate,
  formatFlowTimestamp,
  getFlowPreviewText,
  getFlowSourceLabel,
  normalizeFlowContent,
} from "../lib/flowReportHelpers";

export default function FlowIndexPage({
  language,
  onLanguageChange,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const [, setLocation] = useLocation();
  const [activeSourceLabel, setActiveSourceLabel] = useState("all");
  const { reports, loading, error, reload } = useFlowReports(language);
  const { sources } = useFlowSources(language);
  const locale = language === "en" ? "en-US" : "tr-TR";

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

  const sourceOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const report of reports) {
      const sourceLabel = getFlowSourceLabel(report);
      counts.set(sourceLabel, (counts.get(sourceLabel) || 0) + 1);
    }

    const orderedLabels: string[] = [];
    for (const source of sources) {
      const sourceLabel = source.sourceLabel?.trim() || source.folderName;
      if (counts.has(sourceLabel) && !orderedLabels.includes(sourceLabel)) {
        orderedLabels.push(sourceLabel);
      }
    }

    for (const label of Array.from(counts.keys())) {
      if (!orderedLabels.includes(label)) {
        orderedLabels.push(label);
      }
    }

    return [
      {
        count: reports.length,
        label: copy(language, "Tum Kaynaklar", "All Sources"),
        value: "all",
      },
      ...orderedLabels.map(label => ({
        count: counts.get(label) || 0,
        label,
        value: label,
      })),
    ];
  }, [language, reports, sources]);

  useEffect(() => {
    if (
      activeSourceLabel !== "all" &&
      !sourceOptions.some(option => option.value === activeSourceLabel)
    ) {
      setActiveSourceLabel("all");
    }
  }, [activeSourceLabel, sourceOptions]);

  const filteredReports = useMemo(
    () =>
      activeSourceLabel === "all"
        ? reports
        : reports.filter(
            report => getFlowSourceLabel(report) === activeSourceLabel
          ),
    [activeSourceLabel, reports]
  );

  const featuredReport = filteredReports[0] || reports[0] || null;

  const sidebar = (
    <>
      <section className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <Layers3 className="size-4 text-emerald-300" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {copy(language, "Kaynak Filtreleri", "Source Filters")}
          </p>
        </div>
        <div className="mt-4 space-y-2">
          {sourceOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setActiveSourceLabel(option.value)}
              className={`flex w-full items-center justify-between rounded-[1.2rem] border px-3 py-3 text-left text-sm transition-colors ${
                activeSourceLabel === option.value
                  ? "border-indigo-400/40 bg-indigo-500/12 text-foreground"
                  : "border-border bg-background/45 text-muted-foreground hover:bg-background/70 hover:text-foreground"
              }`}
            >
              <span className="pr-3">{option.label}</span>
              <span className="rounded-full border border-border bg-background/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]">
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
          {copy(language, "Kutuphane Ozeti", "Library Summary")}
        </p>
        <div className="mt-4 grid gap-3">
          <div className="rounded-[1.2rem] border border-border bg-background/45 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Gorunen Rapor", "Visible Reports")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {filteredReports.length}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-border bg-background/45 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Toplam Kaynak", "Total Sources")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {Math.max(sourceOptions.length - 1, 0)}
            </p>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <FlowLayout
      language={language}
      eyebrow="Flow"
      title={copy(language, "Flow Kutuphanesi", "Flow Library")}
      description={copy(
        language,
        "Yayinlanmis Flow raporlarini bagimsiz bir kutuphane olarak gez. Kaynak bazinda filtreleyip dogrudan detay sayfasina gecis yapabilirsin.",
        "Browse published flow reports as a standalone library. Filter by source and jump directly into a detail page."
      )}
      actions={
        <>
          <LanguageSelector language={language} onChange={onLanguageChange} />
          <Button type="button" variant="outline" onClick={() => void reload()}>
            <RefreshCw className="size-4" />
            {copy(language, "Yenile", "Refresh")}
          </Button>
        </>
      }
      sidebar={sidebar}
    >
      {featuredReport ? (
        <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {copy(language, "One Cikan Rapor", "Featured Report")}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {featuredReport.title}
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                {getFlowPreviewText(featuredReport, language)}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border bg-background/60 px-3 py-1.5">
                  {getFlowSourceLabel(featuredReport)}
                </span>
                <span className="rounded-full border border-border bg-background/60 px-3 py-1.5">
                  {formatFlowReportDate(featuredReport.reportDate, locale)}
                </span>
                <span className="rounded-full border border-border bg-background/60 px-3 py-1.5">
                  {formatFlowTimestamp(featuredReport.updatedAt, locale)}
                </span>
              </div>
            </div>

            <div className="grid min-w-[220px] gap-3">
              <div className="rounded-[1.4rem] border border-border bg-background/45 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Figure
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {
                    normalizeFlowContent(featuredReport.content).figureFiles
                      .length
                  }
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-border bg-background/45 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Ticker
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {
                    normalizeFlowContent(featuredReport.content).tickerUniverse
                      .length
                  }
                </p>
              </div>
              <Link
                href={`/flow/${encodeURIComponent(featuredReport.id)}`}
                className="inline-flex items-center justify-center gap-2 rounded-[1.4rem] border border-indigo-400/35 bg-indigo-500/12 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-indigo-500/18"
              >
                {copy(language, "Detayi Ac", "Open Detail")}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {loading ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-[1.8rem] border border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground"
        >
          {copy(
            language,
            "Flow kutuphanesi yukleniyor.",
            "Loading the flow library."
          )}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-[1.8rem] border border-dashed border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground"
        >
          {error}
        </div>
      ) : (
        <FlowReportList language={language} reports={filteredReports} />
      )}
    </FlowLayout>
  );
}
