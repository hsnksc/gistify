import {
  BarChart3,
  Building2,
  CalendarRange,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { StoredReportRecord } from "../../lib/parseReport";
import {
  buildStoredReportPath,
  formatPriceChange,
  formatRecommendationLabel,
  formatReportPrice,
  getRecommendationTone,
} from "../../lib/reportGallery";

interface ReportGalleryCardProps {
  language: AppLanguage;
  onRemove?: (reportId: string) => void;
  report: StoredReportRecord;
}

export default function ReportGalleryCard({
  language,
  onRemove,
  report,
}: ReportGalleryCardProps) {
  const hasPriceChange = typeof report.priceChangePct === "number";
  const priceChangePositive = hasPriceChange
    ? (report.priceChangePct ?? 0) >= 0
    : false;

  return (
    <article className="group rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl transition-all hover:border-indigo-400/35 hover:bg-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
            {report.sourceType === "upload"
              ? copy(language, "Yerel Yukleme", "Local Upload")
              : copy(language, "Yayinli Kaynak", "Published Source")}
          </p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {report.ticker}
          </h3>
        </div>

        <span
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
            getRecommendationTone(report.recommendation)
          )}
        >
          {formatRecommendationLabel(report.recommendation, language)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-base font-semibold text-foreground">
          {report.companyName || report.fileName}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border bg-background/60 px-2.5 py-1">
            {report.exchange || copy(language, "Borsa yok", "No exchange")}
          </span>
          <span className="rounded-full border border-border bg-background/60 px-2.5 py-1">
            {report.sourceLabel}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-[1.2rem] border border-border bg-background/55 p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <TrendingUp className="size-3.5 text-emerald-300" />
            {copy(language, "Fiyat", "Price")}
          </div>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {formatReportPrice(report.price, language)}
          </p>
          <p
            className={cn(
              "mt-1 text-sm",
              !hasPriceChange
                ? "text-muted-foreground"
                : priceChangePositive
                  ? "text-emerald-300"
                  : "text-red-300"
            )}
          >
            {formatPriceChange(report.priceChangePct, language)}
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-border bg-background/55 p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <CalendarRange className="size-3.5 text-amber-300" />
            {copy(language, "Rapor Tarihi", "Report Date")}
          </div>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {report.reportDate}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {copy(
              language,
              `${report.sections.length} bolum algilandi`,
              `${report.sections.length} sections detected`
            )}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1">
            <Building2 className="size-3.5 text-indigo-300" />
            {report.exchange || copy(language, "Belirsiz", "Unknown")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1">
            <BarChart3 className="size-3.5 text-emerald-300" />
            {report.hasCharts
              ? copy(language, "Grafik var", "Charts present")
              : copy(language, "Grafik yok", "No charts")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {report.sourceType === "upload" && onRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(report.id)}
              className="rounded-full"
            >
              <Trash2 className="size-3.5" />
              {copy(language, "Sil", "Delete")}
            </Button>
          ) : null}

          <Link
            href={buildStoredReportPath(report)}
            className="inline-flex items-center justify-center rounded-[1rem] border border-indigo-400/35 bg-indigo-500/12 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-indigo-500/18"
          >
            {copy(language, "Raporu Ac", "Open Report")}
          </Link>
        </div>
      </div>
    </article>
  );
}
