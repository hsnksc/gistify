import { useCallback } from "react";
import { ArrowLeft, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowCommunityPanel from "../components/FlowCommunityPanel";
import FlowLayout from "../components/FlowLayout";
import FlowReportViewer from "../components/FlowReportViewer";
import { useFlowReport } from "../hooks/useFlowReport";

interface FlowDetailPageProps {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  reportId: string;
}

export default function FlowDetailPage({
  language,
  onLanguageChange,
  reportId,
}: FlowDetailPageProps) {
  const [, setLocation] = useLocation();
  const { report, loading, error, reload } = useFlowReport(reportId, language);

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
  }, [language, report]);

  const sidebar = report ? (
    <FlowCommunityPanel language={language} reportId={report.id} />
  ) : null;

  return (
    <FlowLayout
      language={language}
      sidebarLayoutClassName="xl:grid-cols-[minmax(0,1fr)_380px]"
      eyebrow="Flow"
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
          <LanguageSelector language={language} onChange={onLanguageChange} />
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/flow")}
          >
            <ArrowLeft className="size-4" />
            {copy(language, "Kutuphane", "Library")}
          </Button>
          <Button type="button" variant="outline" onClick={() => void reload()}>
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
