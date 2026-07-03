import { ArrowRight, CalendarRange, Files, History } from "lucide-react";
import { Link } from "wouter";
import { type AppLanguage, t } from "@/lib/i18n";
import {
  useFlowTitleTranslation,
  useFlowSummaryTranslation,
} from "../hooks/useFlowTranslation";
import {
  formatFlowReportDate,
  getFlowLanguageBadge,
  getFlowPreviewText,
  getFlowTickerReportPath,
  type FlowTickerGroup,
} from "../lib/flowReportHelpers";

interface FlowTickerCardProps {
  basePath?: string;
  group: FlowTickerGroup;
  language: AppLanguage;
}

export default function FlowTickerCard({
  basePath = "/flow",
  group,
  language,
}: FlowTickerCardProps) {
  const locale = language === "en" ? "en-US" : "tr-TR";
  const latestReport = group.latestReport;
  const languageBadge = getFlowLanguageBadge(latestReport, language);
  const href = getFlowTickerReportPath(group.ticker, basePath);

  const translatedTitle = useFlowTitleTranslation(
    latestReport.title,
    language
  );
  const translatedPreview = useFlowSummaryTranslation(
    getFlowPreviewText(latestReport, language),
    language
  );

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card/90 p-4 shadow-md transition-all hover:border-sky-400/35 hover:bg-card hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">
            {t("calendar:failedToLoadTheEconomic")}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-sky-200">
            {group.ticker}
          </h2>
        </div>
        <span className="rounded-full border border-sky-500/25 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-300">
          {group.reports.length}{" "}
          {t("flow:reports")}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="line-clamp-1 text-sm font-semibold text-foreground">
            {translatedTitle}
          </p>
          {languageBadge ? (
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${languageBadge.toneClassName}`}
            >
              {languageBadge.label}
            </span>
          ) : null}
        </div>
        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
          {translatedPreview}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <CalendarRange className="size-3" />
            {formatFlowReportDate(latestReport.reportDate, locale)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <History className="size-3" />
            {`${Math.max(group.reports.length - 1, 0)} ${t("flow:archive")}`}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Files className="size-3" />
            {`${group.sourceLabels.length} ${t("flow:sources")}`}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground transition-colors group-hover:text-sky-200">
          {t("flow:openReports")}
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}


