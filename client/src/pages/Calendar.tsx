import { useState } from "react";
import { AlertTriangle, CalendarDays, RefreshCw } from "lucide-react";
import WorkspaceLoadingState from "@/components/workspace/WorkspaceLoadingState";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { type AppLanguage, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  formatDateLabel,
  formatTimestamp,
  pipelineStatusClass,
  pipelineStatusLabel,
} from "./calendar/calendar.utils";
import { THEME } from "./calendar/Calendar.theme";
import { useCalendarData } from "./calendar/hooks/useCalendarData";
import { SummaryCard } from "./calendar/components/SummaryCard";
import { EventsTable } from "./calendar/components/EventsTable";
import { OptionSetupsCard } from "./calendar/components/OptionSetupsCard";
import { MarketNarrativeCard } from "./calendar/components/MarketNarrativeCard";
import { VixOutlookCard } from "./calendar/components/VixOutlookCard";
import { FearGreedOutlookCard } from "./calendar/components/FearGreedOutlookCard";

export default function Calendar({ language }: { language: AppLanguage }) {
  usePageMeta({
    description: t("calendar:macroCalendarTrackFomcPmi"),
    title: t("calendar:macroCalendarGistify"),
  });

  const {
    data,
    loading,
    refreshing,
    error,
    autoRefresh,
    setAutoRefresh,
    loadData,
  } = useCalendarData(language);
  const [eventFilter, setEventFilter] = useState<
    "all" | "high" | "medium" | "low"
  >("all");

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-8">
          <WorkspaceLoadingState
            label={t("calendar:loadingTheEconomicCalendar")}
          />
        </div>
      </div>
    );
  }

  if (!data || !data.report) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-8">
          <WorkspaceLoadingState
            label={
              error ||
              t("calendar:noEconomicCalendarSnapshotAvailable")
            }
          />
        </div>
      </div>
    );
  }

  const report = data.report;
  const pipeline = data.pipeline;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <section
          className={cn(
            "overflow-hidden rounded-xl border p-[1px]",
            THEME.shellClassName
          )}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-xl p-4 md:p-6",
              THEME.innerClassName
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b",
                THEME.glowClassName
              )}
            />

            <div className="relative space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        THEME.lineClassName
                      )}
                    />
                    <p
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-[0.18em]",
                        THEME.eyebrowClassName
                      )}
                    >
                      {t("calendar:economicCalendar")}
                    </p>
                  </div>
                  <h1 className="mt-2 heading-condensed text-[1.65rem] leading-none text-foreground md:text-[1.9rem]">
                    {t("calendar:todaySMacroEvents236f")}
                  </h1>
                  <p className="mt-2 text-[13px] leading-6 text-foreground/82">
                    {formatDateLabel(report.reportDate, language)} ·{" "}
                    {t("calendar:usAndGlobalDataCalendar")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      pipelineStatusClass(pipeline.status)
                    )}
                  >
                    {"Pipeline"}:{" "}
                    {pipelineStatusLabel(pipeline.status, language)}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void loadData()}
                    disabled={refreshing}
                    className="bg-background/70"
                  >
                    <RefreshCw
                      className={cn(
                        "mr-1.5 size-4",
                        refreshing && "animate-spin"
                      )}
                    />
                    {t("common:refresh")}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoRefresh((current) => !current)}
                    className={cn(
                      "bg-background/70",
                      autoRefresh &&
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                    )}
                  >
                    <CalendarDays className="mr-1.5 size-4" />
                    {autoRefresh
                      ? t("calendar:autoRefreshOn")
                      : t("calendar:autoRefreshOff")}
                  </Button>
                </div>
              </div>

              {error ? (
                <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  {error}
                </div>
              ) : null}

              <SummaryCard
                report={report}
                language={language}
                onFilter={(filter) =>
                  setEventFilter(filter as typeof eventFilter)
                }
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <VixOutlookCard
                  vixOutlook={report.vixOutlook}
                  language={language}
                />
                <FearGreedOutlookCard
                  fearGreedOutlook={report.fearGreedOutlook}
                  language={language}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <EventsTable
                  events={report.events}
                  language={language}
                  initialFilter={eventFilter}
                />

                <div className="space-y-4">
                  <OptionSetupsCard
                    setups={report.optionSetups}
                    language={language}
                  />
                  <MarketNarrativeCard
                    narrative={report.marketNarrative}
                    language={language}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/16 bg-emerald-500/[0.05] p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-[0.16em]",
                        THEME.eyebrowClassName
                      )}
                    >
                      {"Pipeline"}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-foreground">
                      {pipelineStatusLabel(pipeline.status, language)}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      pipelineStatusClass(pipeline.status)
                    )}
                  >
                    {formatTimestamp(pipeline.lastSyncedAt, language)}
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-[12px] text-muted-foreground">
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    {t("common:lastSync")}:{" "}
                    <span className="text-foreground">
                      {formatTimestamp(pipeline.lastSyncedAt, language)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    {t("common:source")}:{" "}
                    <span className="break-all text-foreground">
                      {pipeline.resolvedSourceFile ||
                        pipeline.configuredSourceFile ||
                        "-"}
                    </span>
                  </div>
                  {pipeline.error ? (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-rose-100">
                      {pipeline.error}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

