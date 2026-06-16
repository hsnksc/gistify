import { useCallback, useMemo } from "react";
import { ArrowLeft, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowCommunityPanel from "../components/FlowCommunityPanel";
import FlowLayout from "../components/FlowLayout";
import FlowReportViewer from "../components/FlowReportViewer";
import { useFlowReport } from "../hooks/useFlowReport";
import { useFlowReports } from "../hooks/useFlowReports";
import {
  formatFlowReportDate,
  formatFlowTimestamp,
  getFlowSourceLabel,
  normalizeFlowContent,
} from "../lib/flowReportHelpers";

interface FlowDetailPageProps {
  language: AppLanguage;
  reportId: string;
}

export default function FlowDetailPage({
  language,
  reportId,
}: FlowDetailPageProps) {
  const [, setLocation] = useLocation();
  const { report, loading, error, reload } = useFlowReport(reportId, language);
  const { reports } = useFlowReports(language);
  const locale = language === "en" ? "en-US" : "tr-TR";

  const relatedReports = useMemo(
    () => reports.filter(item => item.id !== reportId).slice(0, 4),
    [reportId, reports]
  );

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined" || !report) {
      return;
    }

    const shareUrl = `${window.location.origin}/flow/${encodeURIComponent(report.id)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          text: report.content.headline || report.title,
          title: report.title,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success(copy(language, "Flow linki kopyalandi.", "Flow link copied."));
    } catch {
      toast.error(copy(language, "Paylasim tamamlanamadi.", "Share could not be completed."));
    }
  }, [language, report]);

  const sidebar = report ? (
    <>
      <section className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
          {copy(language, "Rapor Metasi", "Report Meta")}
        </p>
        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-[1.2rem] border border-border bg-background/45 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Kaynak", "Source")}
            </p>
            <p className="mt-2 font-semibold text-foreground">
              {getFlowSourceLabel(report)}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-border bg-background/45 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Rapor Tarihi", "Report Date")}
            </p>
            <p className="mt-2 font-semibold text-foreground">
              {formatFlowReportDate(report.reportDate, locale)}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-border bg-background/45 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Yuklenme", "Loaded")}
            </p>
            <p className="mt-2 font-semibold text-foreground">
              {formatFlowTimestamp(report.updatedAt, locale)}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
          {copy(language, "Hizli Sayilar", "Quick Stats")}
        </p>
        <div className="mt-4 grid gap-3">
          <div className="rounded-[1.2rem] border border-border bg-background/45 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Figure
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {normalizeFlowContent(report.content).figureFiles.length}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-border bg-background/45 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Ticker
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {normalizeFlowContent(report.content).tickerUniverse.length}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-border bg-background/45 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              OpenAI
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {normalizeFlowContent(report.content).openAiFigureFiles.length}
            </p>
          </div>
        </div>
      </section>

      {relatedReports.length ? (
        <section className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {copy(language, "Diger Flow Raporlari", "More Flow Reports")}
          </p>
          <div className="mt-4 space-y-2">
            {relatedReports.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLocation(`/flow/${encodeURIComponent(item.id)}`)}
                className="block w-full rounded-[1.2rem] border border-border bg-background/45 px-3 py-3 text-left text-sm transition-colors hover:bg-background/70"
              >
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatFlowReportDate(item.reportDate, locale)}
                </p>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </>
  ) : null;

  return (
    <FlowLayout
      language={language}
      eyebrow="Flow"
      title={report?.title || copy(language, "Flow raporu", "Flow report")}
      description={
        report?.content.headline ||
        copy(
          language,
          "Bagimsiz Flow detay sayfasinda markdown, gorseller ve topluluk yorumlari ayni yuzeyde acilir.",
          "The standalone flow detail page keeps markdown, visuals and community comments on the same surface."
        )
      }
      actions={
        <>
          <Button type="button" variant="outline" onClick={() => setLocation("/flow")}>
            <ArrowLeft className="size-4" />
            {copy(language, "Kutuphane", "Library")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void reload()}>
            <RefreshCw className="size-4" />
            {copy(language, "Yenile", "Refresh")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void handleShare()}>
            <Share2 className="size-4" />
            {copy(language, "Paylas", "Share")}
          </Button>
        </>
      }
      sidebar={sidebar}
    >
      {loading ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-[1.8rem] border border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground"
        >
          {copy(language, "Flow raporu yukleniyor.", "Loading flow report.")}
        </div>
      ) : !report ? (
        <div
          role="alert"
          className="rounded-[1.8rem] border border-dashed border-border bg-card/75 px-5 py-6 text-sm text-muted-foreground"
        >
          {error ||
            copy(
              language,
              "Istenen Flow raporu bulunamadi.",
              "The requested flow report could not be found."
            )}
        </div>
      ) : (
        <>
          <FlowReportViewer language={language} report={report} />
          <FlowCommunityPanel language={language} reportId={report.id} />
        </>
      )}
    </FlowLayout>
  );
}
