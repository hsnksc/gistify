import { CalendarRange, FileText } from "lucide-react";
import { Link } from "wouter";
import { copy, type AppLanguage } from "@/lib/i18n";
import {
  type FlowReportListEntry,
  formatFlowReportDate,
  formatFlowTimestamp,
  getFlowLanguageBadge,
  getFlowPreviewText,
  getFlowReportKind,
  getFlowReportArchiveDetailPath,
  getFlowReportDetailPath,
  getFlowSourceLabel,
  getPrimaryFlowTicker,
} from "../lib/flowReportHelpers";

interface FlowReportRowProps {
  basePath?: string;
  language: AppLanguage;
  report: FlowReportListEntry;
}

export default function FlowReportRow({
  basePath = "/flow",
  language,
  report,
}: FlowReportRowProps) {
  const locale = language === "en" ? "en-US" : "tr-TR";
  const href =
    basePath === "/reports"
      ? getFlowReportArchiveDetailPath(report, basePath)
      : getFlowReportDetailPath(report.id, basePath);
  const ticker = getPrimaryFlowTicker(report);
  const reportKind = getFlowReportKind(report);
  const languageBadge = getFlowLanguageBadge(report, language);

  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-border bg-card/80 p-3 shadow-sm transition-all hover:border-indigo-400/35 hover:bg-card hover:shadow-md"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60">
        <CalendarRange className="size-4 text-indigo-300" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            {formatFlowReportDate(report.reportDate, locale)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatFlowTimestamp(report.updatedAt, locale)}
          </span>
        </div>

        <h3 className="mt-0.5 truncate text-sm font-semibold text-foreground transition-colors group-hover:text-indigo-200">
          {report.title}
        </h3>

        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
          {getFlowPreviewText(report, language)}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {reportKind === "daily"
              ? copy(language, "Gunluk", "Daily")
              : copy(language, "Hisse", "Stock")}
          </span>
          {languageBadge ? (
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${languageBadge.toneClassName}`}
            >
              {languageBadge.label}
            </span>
          ) : null}
          {ticker && ticker !== "MARKET" && ticker !== "FLOW" && (
            <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {ticker}
            </span>
          )}
          {"exchange" in report && report.exchange && (
            <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {report.exchange}
            </span>
          )}
          {"recommendation" in report && report.recommendation && (
            <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {report.recommendation}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="size-3" />
            {getFlowSourceLabel(report)}
          </span>
        </div>
      </div>
    </Link>
  );
}
