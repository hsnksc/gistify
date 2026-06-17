import { useEffect, useMemo } from "react";
import { Clock3, Layers3, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowLayout from "../components/FlowLayout";
import FlowTickerCard from "../components/FlowTickerCard";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";
import {
  formatFlowTimestamp,
  groupFlowReportsByTicker,
} from "../lib/flowReportHelpers";

export default function FlowIndexPage({
  language,
  basePath = "/flow",
  description,
  eyebrow = "Flow",
  title,
}: {
  basePath?: string;
  description?: string;
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  eyebrow?: string;
  title?: string;
}) {
  const [, setLocation] = useLocation();
  const { reports, loading, error, reload } = useFlowReportSummaries(language);
  const tickerGroups = useMemo(() => groupFlowReportsByTicker(reports), [reports]);
  const locale = language === "en" ? "en-US" : "tr-TR";
  const latestUpdatedAt =
    tickerGroups[0]?.latestReport.updatedAt || reports[0]?.updatedAt || "";

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

    setLocation(`${basePath}/${encodeURIComponent(legacyReportId)}`, {
      replace: true,
    });
  }, [basePath, setLocation]);

  return (
    <FlowLayout
      language={language}
      eyebrow={eyebrow}
      title={
        title || copy(language, "Flow Hisse Kutuphanesi", "Flow Stock Library")
      }
      description={
        description ||
        copy(
          language,
          "Flow artik hisse bazinda aciliyor. Her yeni ticker kendi kartini alir; karta girince guncel rapor ve gecmis arsivi birlikte gorunur.",
          "Flow now opens by ticker. Every new stock gets its own card, and each card leads to the current report plus its historical archive."
        )
      }
      actions={
        <Button type="button" variant="outline" onClick={() => void reload()}>
          <RefreshCw className="size-4" />
          {copy(language, "Yenile", "Refresh")}
        </Button>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <div className="flex items-center gap-2">
            <Layers3 className="size-4 text-emerald-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {copy(language, "Hisse Kartlari", "Ticker Cards")}
            </p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {tickerGroups.length}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {copy(
              language,
              "Flow icinde otomatik olusan toplam hisse basligi.",
              "Total stock headings generated automatically inside Flow."
            )}
          </p>
        </article>

        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
            {copy(language, "Toplam Rapor", "Total Reports")}
          </p>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {reports.length}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {copy(
              language,
              "Guncel ve arsivdeki tum Flow raporlarinin toplami.",
              "All current and archived Flow reports combined."
            )}
          </p>
        </article>

        <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-amber-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
              {copy(language, "Son Yukleme", "Latest Load")}
            </p>
          </div>
          <p className="mt-4 text-xl font-semibold text-foreground">
            {latestUpdatedAt
              ? formatFlowTimestamp(latestUpdatedAt, locale)
              : "-"}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {copy(
              language,
              "En son guncellenen Flow raporunun yuklenme zamani.",
              "Load timestamp of the most recently updated Flow report."
            )}
          </p>
        </article>
      </section>

      {loading ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-[1.8rem] border border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground"
        >
          {copy(
            language,
            "Flow hisse kartlari yukleniyor.",
            "Loading flow ticker cards."
          )}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-[1.8rem] border border-dashed border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground"
        >
          {error}
        </div>
      ) : !tickerGroups.length ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-[1.8rem] border border-dashed border-border bg-card/65 px-5 py-6 text-sm text-muted-foreground"
        >
          {copy(
            language,
            "Henuz gosterilecek Flow hissesi bulunamadi.",
            "There are no Flow tickers to display yet."
          )}
        </div>
      ) : (
        <section
          aria-label={copy(language, "Flow hisse listesi", "Flow ticker list")}
          className="grid gap-4 lg:grid-cols-2"
        >
          {tickerGroups.map(group => (
            <FlowTickerCard
              basePath={basePath}
              key={group.ticker}
              group={group}
              language={language}
            />
          ))}
        </section>
      )}
    </FlowLayout>
  );
}
