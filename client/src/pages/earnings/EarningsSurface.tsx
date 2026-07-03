import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  AlertTriangle, CalendarDays, ListTodo, Target, Wallet, ChevronDown, ChevronUp, BarChart3, Zap, PieChart, ArrowRight, Search, } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import StrategyCard from "@/components/earnings/StrategyCard";
import {
  EarningsFreshnessBadge, EarningsWorkspaceToolbar, getPipelineStatusMeta, } from "@/components/earnings/EarningsWorkspaceChrome";
import { type AppLanguage, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type {
  EarningsStrategyPipelineMetadata,
  PortfolioLevel,
  Strategy,
  ActionPlanItem,
} from "@shared/earnings";

export function EarningsWorkspaceFrame({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="container space-y-6 py-6 md:space-y-8 md:py-8">
      {children}
    </div>
  );
}

export function EarningsLoadingState({
  language,
}: {
  language: AppLanguage;
}) {
  return (
    <div className="px-4 py-8">
      <LoadingState
        className="mx-auto max-w-7xl"
        description={t("earnings:theEarningsStrategyWorkspaceAnd")}
        label={t("earnings:loadingEarningsWorkspace")}
      />
    </div>
  );
}

export function EarningsUnavailableState({
  error,
  language,
  onRetry,
}: {
  error: string;
  language: AppLanguage;
  onRetry: () => void;
}) {
  const hasRuntimeError = Boolean(error.trim());

  return (
    <EarningsWorkspaceFrame>
      <EmptyState
        tone={hasRuntimeError ? "danger" : "info"}
        title={
          hasRuntimeError
            ? t("earnings:theEarningsWorkspaceCouldNot")
            : t("earnings:theEarningsWorkspaceReturnedEmpty")
        }
        description={
          hasRuntimeError
            ? error
            : t("earnings:thePipelineDataHasNot")
        }
        icon={hasRuntimeError ? AlertTriangle : Search}
        action={
          <Button type="button" variant="outline" onClick={onRetry}>
            {(language === "en" ? hasRuntimeError ? "Retry" : "Retry source" : hasRuntimeError ? "Tekrar dene" : "Kaynagi tekrar yokla")}
          </Button>
        }
      />
    </EarningsWorkspaceFrame>
  );
}

export function EarningsPipelinePanel({
  language,
  pipeline,
}: {
  language: AppLanguage;
  pipeline: EarningsStrategyPipelineMetadata;
}) {
  const statusMeta = getPipelineStatusMeta(pipeline.status, language);
  const [isExpanded, setIsExpanded] = useState(() => pipeline.status !== "ok");

  useEffect(() => {
    if (pipeline.status !== "ok") {
      setIsExpanded(true);
    }
  }, [pipeline.status]);

  return (
    <section className={cn(
      "panel p-6 md:p-8",
      "bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm"
    )}>
      <button
        type="button"
        onClick={() => setIsExpanded(value => !value)}
        className="flex w-full flex-col gap-3 text-left md:flex-row md:items-center md:justify-between"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
            {t("earnings:pipelineStatus")}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                statusMeta.chipClassName,
                statusMeta.pulse ? "animate-pulse" : ""
              )}
            >
              <statusMeta.Icon className="size-3.5" />
              {statusMeta.label}
            </span>
            <EarningsFreshnessBadge language={language} pipeline={pipeline} />
          </div>
        </div>
        <span className="inline-flex items-center gap-2 text-sm text-slate-400">
          {(language === "en" ? isExpanded ? "Hide details" : "Show details" : isExpanded ? "Detayi gizle" : "Detayi goster")}
          {isExpanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </span>
      </button>

      {isExpanded ? (
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="max-w-2xl text-sm leading-6 text-slate-400">
              {pipeline.error ||
                t("earnings:theSourceMarkdownIsPolled")}
            </p>
          </div>
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-slate-900/50 p-5 text-sm text-slate-400 md:min-w-[300px]">
            <p>
              <span className="text-slate-500">
                {t("common:lastSync")}:{" "}
              </span>
              {pipeline.lastSyncedAt || "—"}
            </p>
            <p>
              <span className="text-slate-500">
                {t("earnings:sourceModified")}:{" "}
              </span>
              {pipeline.lastSourceModifiedAt || "—"}
            </p>
            <p className="truncate">
              <span className="text-slate-500">
                {t("common:source")}:{" "}
              </span>
              {pipeline.resolvedSourceFile || pipeline.sourceFolder || "—"}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function StrategyCollectionPanel({
  description,
  language,
  strategies,
  title,
}: {
  description?: string;
  language: AppLanguage;
  strategies: Strategy[];
  title: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const display = showAll ? strategies : strategies.slice(0, 6);
  const hasMore = strategies.length > 6;

  const displayTitle = title === "Core strategies" || title === "Core Strategies"
    ? t("earnings:coreStrategies")
    : title;

  if (strategies.length === 0) {
    return (
      <section className="panel p-6 md:p-8">
        <EmptyState
          tone="neutral"
          title={t("earnings:noStrategyIsAvailableIn")}
          description={t("earnings:thePipelineHasNotProduced")}
          icon={Zap}
        />
      </section>
    );
  }

  return (
    <section className={cn(
      "panel p-6 md:p-8",
      "bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
              <Zap className="size-5 text-sky-400" />
            </div>
            <div className="w-full">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
                  {displayTitle}
                </p>
              </div>
              <div className="mt-1 h-px w-full bg-gradient-to-r from-sky-500/30 to-transparent" />
            </div>
          </div>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-slate-900/50 px-3 py-1 text-xs font-bold text-slate-400">
          {strategies.length}
        </span>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {display.map(strategy => (
          <StrategyCard
            key={`${strategy.ticker}-${strategy.type || "strategy"}`}
            language={language}
            strategy={strategy}
          />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(v => !v)}
            className="rounded-xl border-white/10 bg-slate-900/50 text-slate-300 backdrop-blur-sm hover:bg-slate-800/50 hover:text-white"
          >
            {showAll ? (
              <>
                <ChevronUp className="mr-2 size-4" />
                {t("earnings:showLess")}
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 size-4" />
                {t("earnings:showAll", { length: strategies.length })}
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}

const WEEK_EMOJIS = ["🎯", "📈", "⚡", "🛡️", "🚀", "🎲"];

export function ActionPlanPanel({
  items,
  language,
}: {
  items: ActionPlanItem[];
  language: AppLanguage;
}) {
  if (items.length === 0) return null;

  return (
    <section className={cn(
      "panel p-6 md:p-8",
      "bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm"
    )}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
          <ListTodo className="size-5 text-sky-400" />
        </div>
        <div className="w-full">
          <h2 className="text-xl font-bold text-white">
            {t("earnings:actionPlance97")}
          </h2>
          <div className="mt-1 h-px w-full bg-gradient-to-r from-sky-500/30 to-transparent" />
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={`${item.week || item.dateRange || "action"}-${index}`}
            className={cn(
              "relative rounded-2xl border border-white/10 p-6 transition-all duration-300",
              "bg-gradient-to-br from-slate-800/50 to-slate-900/50",
              "hover:-translate-y-0.5 hover:border-sky-500/20 hover:shadow-lg hover:shadow-sky-500/5"
            )}
          >
            <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-gradient-to-b from-sky-500 to-indigo-500" />
            <div className="flex items-center gap-2">
              <span className="text-lg">{WEEK_EMOJIS[index % WEEK_EMOJIS.length]}</span>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-400">
                {item.week || item.dateRange || "Plan"}
              </p>
            </div>
            {item.focus ? (
              <p className="mt-2 text-base font-bold text-white">{item.focus}</p>
            ) : null}
            <div className="mt-4 space-y-2.5">
              {item.actions.map(action => (
                <div
                  key={action}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-slate-950/40 px-4 py-3 text-sm leading-6 text-slate-300 transition-all hover:border-white/10 hover:bg-slate-900/60"
                >
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-sky-400/60" />
                  {action}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export { EarningsWorkspaceToolbar };

export function PortfolioPanel({
  language,
  levels,
}: {
  language: AppLanguage;
  levels: PortfolioLevel[];
}) {
  if (levels.length === 0) return null;

  const allocationColors = [
    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "text-sky-400 bg-sky-500/10 border-sky-500/20",
    "text-violet-400 bg-violet-500/10 border-violet-500/20",
    "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "text-rose-400 bg-rose-500/10 border-rose-500/20",
  ];

  return (
    <section className={cn(
      "panel p-6 md:p-8",
      "bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm"
    )}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
          <PieChart className="size-5 text-sky-400" />
        </div>
        <div className="w-full">
          <h2 className="text-xl font-bold text-white">
            {t("earnings:portfolioLayers")}
          </h2>
          <div className="mt-1 h-px w-full bg-gradient-to-r from-sky-500/30 to-transparent" />
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        {levels.map(level => (
          <div
            key={level.budget}
            className={cn(
              "rounded-2xl border border-white/10 p-6 transition-all duration-300",
              "bg-gradient-to-br from-slate-800/50 to-slate-900/50",
              "hover:-translate-y-0.5 hover:border-sky-500/20 hover:shadow-lg hover:shadow-sky-500/5"
            )}
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-400">
              {level.budget}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {t("earnings:totalAllocation63ee")}:{" "}
              <span className="font-bold text-white">
                {level.totalAllocation || "—"}
              </span>
            </p>
            <div className="mt-5 space-y-3">
              {level.recommendations.map((item, idx) => (
                <div
                  key={`${level.budget}-${item.ticker}-${item.strategy}`}
                  className={cn(
                    "rounded-xl border border-white/5 bg-slate-950/40 px-4 py-3 transition-all",
                    "hover:border-white/10 hover:bg-slate-900/60"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-white">{item.ticker}</span>
                    <span className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-bold",
                      allocationColors[idx % allocationColors.length]
                    )}>
                      {item.allocation}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-300">{item.strategy}</p>
                  {item.entryExit ? (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {item.entryExit}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ExecutiveSummaryPanel({
  items,
  language,
}: {
  items: string[];
  language: AppLanguage;
}) {
  if (items.length === 0) return null;

  return (
    <section className={cn(
      "panel p-6 md:p-8",
      "bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm"
    )}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
          <Target className="size-5 text-sky-400" />
        </div>
        <div className="w-full">
          <h2 className="text-xl font-bold text-white">
            {t("earnings:executiveSummary")}
          </h2>
          <div className="mt-1 h-px w-full bg-gradient-to-r from-sky-500/30 to-transparent" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map(item => (
          <div
            key={item}
            className={cn(
              "flex items-start gap-4 rounded-2xl border border-white/10 p-5 text-base leading-7 text-slate-300",
              "bg-gradient-to-br from-slate-800/50 to-slate-900/50",
              "transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-500/20 hover:shadow-lg hover:shadow-sky-500/5"
            )}
          >
            <span className="mt-2 size-2 shrink-0 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CalendarStatsPanel({
  amcCount,
  bmoCount,
  highImportanceCount,
  language,
  totalCount,
}: {
  amcCount: number;
  bmoCount: number;
  highImportanceCount: number;
  language: AppLanguage;
  totalCount: number;
}) {
  const items = [
    {
      label: t("earnings:totalEvents"),
      value: String(totalCount),
      icon: <BarChart3 className="size-5 text-sky-400" />,
      color: "text-white",
    },
    {
      label: t("earnings:highImportance"),
      value: String(highImportanceCount),
      icon: <Target className="size-5 text-amber-400" />,
      color: "text-amber-400",
    },
    {
      label: "BMO",
      value: String(bmoCount),
      icon: <CalendarDays className="size-5 text-emerald-400" />,
      color: "text-emerald-400",
    },
    {
      label: "AMC",
      value: String(amcCount),
      icon: <CalendarDays className="size-5 text-violet-400" />,
      color: "text-violet-400",
    },
  ];

  return (
    <section className={cn(
      "panel p-6 md:p-8",
      "bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm"
    )}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
          <CalendarDays className="size-5 text-sky-400" />
        </div>
        <div className="w-full">
          <h2 className="text-xl font-bold text-white">
            {t("earnings:calendarSnapshot")}
          </h2>
          <div className="mt-1 h-px w-full bg-gradient-to-r from-sky-500/30 to-transparent" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(item => (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-4 rounded-2xl border border-white/10 p-5 transition-all duration-300",
              "bg-gradient-to-br from-slate-800/50 to-slate-900/50",
              "hover:-translate-y-0.5 hover:border-sky-500/20 hover:shadow-lg hover:shadow-sky-500/5"
            )}
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-slate-950/50">
              {item.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {item.label}
              </p>
              <p className={cn("mt-1 text-3xl font-bold", item.color)}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
