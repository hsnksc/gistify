import { CalendarRange, Files, GalleryHorizontal, Target } from "lucide-react";
import { Link } from "wouter";
import { copy, type AppLanguage } from "@/lib/i18n";
import {
  useFlowTitleTranslation,
  useFlowSummaryTranslation,
} from "../hooks/useFlowTranslation";
import {
  type FlowReportListEntry,
  formatFlowReportDate,
  getFlowPostedLabel,
  getFlowPreviewText,
  getFlowReportArchiveDetailPath,
  getFlowReportDetailPath,
  getFlowSourceLabel,
  normalizeFlowContent,
} from "../lib/flowReportHelpers";

interface FlowReportCardProps {
  basePath?: string;
  language: AppLanguage;
  report: FlowReportListEntry;
}

function MetaChip({
  icon: Icon,
  label,
}: {
  icon: typeof CalendarRange;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="size-3 text-emerald-300" />
      {label}
    </span>
  );
}

export default function FlowReportCard({
  basePath = "/flow",
  language,
  report,
}: FlowReportCardProps) {
  const locale = language === "en" ? "en-US" : "tr-TR";
  const content = "content" in report ? normalizeFlowContent(report.content) : null;
  const href =
    basePath === "/reports"
      ? getFlowReportArchiveDetailPath(report, basePath)
      : getFlowReportDetailPath(report.id, basePath);

  const translatedTitle = useFlowTitleTranslation(report.title, language);
  const translatedPreview = useFlowSummaryTranslation(
    getFlowPreviewText(report, language),
    language
  );

  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border bg-card/90 p-4 shadow-md transition-all hover:border-sky-400/35 hover:bg-card hover:shadow-lg"
    >
      <div className="flex h-full flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border border-sky-500/25 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-300">
            {formatFlowReportDate(report.reportDate, locale)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {getFlowPostedLabel(report, locale)}
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-sky-200">
            {translatedTitle}
          </h2>
          <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
            {translatedPreview}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5">
          <MetaChip icon={Files} label={getFlowSourceLabel(report)} />
          <MetaChip
            icon={GalleryHorizontal}
            label={`${
              "content" in report
                ? content?.figureFiles.length || 0
                : report.figureCount
            } ${copy(language, "figure", "figures")}`}
          />
          <MetaChip
            icon={Target}
            label={`${
              "content" in report
                ? content?.tickerUniverse.length || 0
                : report.tickerUniverse.length
            } ${copy(language, "ticker", "ticker")}`}
          />
        </div>
      </div>
    </Link>
  );
}
