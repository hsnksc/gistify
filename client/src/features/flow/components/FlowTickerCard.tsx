import { ArrowRight, CalendarRange, Files, History } from "lucide-react";
import { Link } from "wouter";
import { copy, type AppLanguage } from "@/lib/i18n";
import {
  formatFlowReportDate,
  getFlowPreviewText,
  getFlowTickerReportPath,
  type FlowTickerGroup,
} from "../lib/flowReportHelpers";

interface FlowTickerCardProps {
  basePath?: string;
  group: FlowTickerGroup;
  language: AppLanguage;
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

export default function FlowTickerCard({
  basePath = "/flow",
  group,
  language,
}: FlowTickerCardProps) {
  const locale = language === "en" ? "en-US" : "tr-TR";
  const latestReport = group.latestReport;
  const href = getFlowTickerReportPath(group.ticker, basePath);

  return (
    <Link
      href={href}
      className="group block rounded-[1.9rem] border border-border bg-card/90 p-5 shadow-xl transition-all hover:border-indigo-400/35 hover:bg-card hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
              {copy(language, "Hisse Basligi", "Ticker View")}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-200">
              {group.ticker}
            </h2>
          </div>
          <span className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
            {group.reports.length}{" "}
            {copy(language, "rapor", "reports")}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-base font-semibold text-foreground">
            {latestReport.title}
          </p>
          <p className="line-clamp-4 text-sm leading-7 text-muted-foreground">
            {getFlowPreviewText(latestReport, language)}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          <MetaChip
            icon={CalendarRange}
            label={formatFlowReportDate(latestReport.reportDate, locale)}
          />
          <MetaChip
            icon={History}
            label={`${Math.max(group.reports.length - 1, 0)} ${copy(
              language,
              "arsiv",
              "archive"
            )}`}
          />
          <MetaChip
            icon={Files}
            label={`${group.sourceLabels.length} ${copy(
              language,
              "kaynak",
              "sources"
            )}`}
          />
        </div>

        <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover:text-indigo-200">
          {copy(language, "Raporlari Ac", "Open Reports")}
          <ArrowRight className="size-4" />
        </div>
      </div>
    </Link>
  );
}
