import { ArrowRight, Layers3 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowPostActions from "./FlowPostActions";
import {
  useFlowTitleTranslation,
  useFlowSummaryTranslation,
} from "../hooks/useFlowTranslation";
import {
  formatFlowReportDate,
  formatFlowTimestamp,
  type FlowReportListEntry,
  getFlowReportArchiveDetailPath,
  getFlowReportDetailPath,
  getFlowReportTickers,
} from "../lib/flowReportHelpers";

interface FlowFeedCardProps {
  basePath?: string;
  language: AppLanguage;
  report: FlowReportListEntry;
}

export default function FlowFeedCard({
  basePath = "/flow",
  language,
  report,
}: FlowFeedCardProps) {
  const [, setLocation] = useLocation();
  const locale = language === "en" ? "en-US" : "tr-TR";
  const tickers = getFlowReportTickers(report);
  const href =
    basePath === "/reports"
      ? getFlowReportArchiveDetailPath(report, basePath)
      : getFlowReportDetailPath(report.id, basePath);

  const translatedTitle = useFlowTitleTranslation(report.title, language);
  const translatedSummary = useFlowSummaryTranslation(
    "previewText" in report ? report.previewText : "",
    language
  );

  const openDetail = () => {
    setLocation(href);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail();
        }
      }}
      className="rounded-[28px] border border-border bg-card/95 p-5 shadow-sm transition-colors hover:border-sky-400/30 hover:bg-card focus:outline-none focus:ring-2 focus:ring-sky-400/30"
    >
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-sky-400/20 bg-sky-500/10 text-sky-200">
          <Layers3 className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <p className="font-semibold text-foreground">Flow</p>
            <span className="text-muted-foreground">·</span>
            <p className="text-xs font-medium text-muted-foreground">
              {formatFlowReportDate(report.reportDate, locale)}
            </p>
            <span className="text-muted-foreground">·</span>
            <p className="text-xs text-muted-foreground">
              {copy(language, "Uret.", "Gen.")}{" "}
              {formatFlowTimestamp(report.updatedAt, locale)}
            </p>
          </div>

          <button
            type="button"
            onClick={openDetail}
            className="mt-3 block text-left"
          >
            <h2 className="text-lg font-semibold leading-7 tracking-tight text-foreground transition-colors hover:text-sky-200 md:text-[1.35rem]">
              {translatedTitle}
            </h2>
          </button>

          {translatedSummary ? (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {translatedSummary}
            </p>
          ) : null}

          {tickers.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tickers.map(ticker => (
                <button
                  key={ticker}
                  type="button"
                  onClick={openDetail}
                  className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-sky-400/35 hover:text-sky-200"
                >
                  ${ticker}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <FlowPostActions
              compact
              language={language}
              reportId={report.id}
              sharePath={href}
              title={translatedTitle}
            />

            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-full px-3 text-xs"
              onClick={openDetail}
            >
              <ArrowRight className="size-4" />
              {copy(language, "Devami", "Continue")}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
