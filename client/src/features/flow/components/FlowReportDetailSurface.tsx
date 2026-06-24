import { useCallback } from "react";
import type { FlowReport } from "@shared/flow";
import { ArrowLeft, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowCommunityPanel from "./FlowCommunityPanel";
import FlowLayout from "./FlowLayout";
import FlowReportViewer from "./FlowReportViewer";
import {
  getFlowReportArchiveDetailPath,
  getFlowReportDetailPath,
  getFlowReportKind,
  getFlowTickerReportPath,
  getPrimaryFlowTicker,
} from "../lib/flowReportHelpers";

interface FlowReportDetailSurfaceProps {
  basePath?: string;
  eyebrow?: string;
  error?: string;
  language: AppLanguage;
  loading?: boolean;
  onRefresh?: () => Promise<void> | void;
  report: FlowReport | null;
}

export default function FlowReportDetailSurface({
  basePath = "/flow",
  eyebrow = copy(language, "Flow", "Flow"),
  error = "",
  language,
  loading = false,
  onRefresh,
  report,
}: FlowReportDetailSurfaceProps) {
  const [, setLocation] = useLocation();

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined" || !report) {
      return;
    }

    const sharePath =
      basePath === "/reports"
        ? getFlowReportArchiveDetailPath(report, basePath)
        : getFlowReportDetailPath(report.id, basePath);
    const shareUrl = `${window.location.origin}${sharePath}`;

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
      toast.success(
        copy(language, "Flow linki kopyalandi.", "Flow link copied.")
      );
    } catch {
      toast.error(
        copy(
          language,
          "Paylasim tamamlanamadi.",
          "Share could not be completed."
        )
      );
    }
  }, [basePath, language, report]);

  const sidebar = report ? (
    <FlowCommunityPanel language={language} reportId={report.id} />
  ) : null;
  const reportKind = report ? getFlowReportKind(report) : "stock";
  const ticker =
    report && reportKind === "stock" ? getPrimaryFlowTicker(report) : "";
  const tickerPath = ticker ? getFlowTickerReportPath(ticker, basePath) : "/flow/daily";
  const libraryPath = reportKind === "daily" ? "/flow" : basePath;

  usePageMeta({
    description:
      report?.content.headline ||
      copy(
        language,
        "Gistify Flow rapor detayi.",
        "Gistify Flow report detail."
      ),
    title: report?.title
      ? `${report.title} | Gistify`
      : copy(language, "Flow Raporu | Gistify", "Flow Report | Gistify"),
  });

  return (
    <FlowLayout
      key={report?.id || "empty"}
      language={language}
      sidebarLayoutClassName="xl:grid-cols-[minmax(0,1fr)_380px]"
      eyebrow={eyebrow}
      title={report?.title || copy(language, "Flow raporu", "Flow report")}
      description={
        report?.content.headline ||
        copy(
          language,
          "Bagimsiz Flow detay sayfasinda kaynak rapor, gorseller ve topluluk yorumlari ayni yuzeyde acilir.",
          "The standalone flow detail page keeps the source report, visuals and community comments on the same surface."
        )
      }
      actions={
        <>
          {reportKind === "daily" ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/flow/daily")}
            >
              <ArrowLeft className="size-4" />
              {copy(language, "Gunluk Raporlar", "Daily Reports")}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation(tickerPath)}
            >
              <ArrowLeft className="size-4" />
              {ticker
                ? copy(language, `${ticker} raporlari`, `${ticker} reports`)
                : copy(language, "Hisseler", "Tickers")}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation(libraryPath)}
          >
            {reportKind === "daily"
              ? copy(language, "Rapor Merkezi", "Report Center")
              : copy(language, "Tum Hisseler", "All Tickers")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void onRefresh?.()}
          >
            <RefreshCw className="size-4" />
            {copy(language, "Yenile", "Refresh")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleShare()}
          >
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
        <FlowReportViewer language={language} report={report} />
      )}
    </FlowLayout>
  );
}
