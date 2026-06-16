import type { FlowReport } from "@shared/flow";
import { CalendarRange, Files, GalleryHorizontal, Target } from "lucide-react";
import { Link } from "wouter";
import { copy, type AppLanguage } from "@/lib/i18n";
import {
  formatFlowReportDate,
  formatFlowTimestamp,
  getFlowPreviewText,
  getFlowSourceLabel,
  normalizeFlowContent,
} from "../lib/flowReportHelpers";

interface FlowReportCardProps {
  language: AppLanguage;
  report: FlowReport;
}

function MetaChip({
  icon: Icon,
  label,
}: {
  icon: typeof CalendarRange;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      <Icon className="size-3.5 text-emerald-300" />
      {label}
    </span>
  );
}

export default function FlowReportCard({
  language,
  report,
}: FlowReportCardProps) {
  const locale = language === "en" ? "en-US" : "tr-TR";
  const content = normalizeFlowContent(report.content);
  const href = `/flow/${encodeURIComponent(report.id)}`;

  return (
    <Link
      href={href}
      className="group block rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl transition-all hover:border-indigo-400/35 hover:bg-card hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
            {formatFlowReportDate(report.reportDate, locale)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatFlowTimestamp(report.updatedAt, locale)}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-200">
            {report.title}
          </h2>
          <p className="line-clamp-4 text-sm leading-7 text-muted-foreground">
            {getFlowPreviewText(report, language)}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          <MetaChip
            icon={Files}
            label={getFlowSourceLabel(report)}
          />
          <MetaChip
            icon={GalleryHorizontal}
            label={`${content.figureFiles.length} ${copy(language, "figure", "figures")}`}
          />
          <MetaChip
            icon={Target}
            label={`${content.tickerUniverse.length} ticker`}
          />
        </div>
      </div>
    </Link>
  );
}
