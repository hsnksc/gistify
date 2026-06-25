import type { ReactNode } from "react";
import { useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ListTodo,
  Target,
  Wallet,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Zap,
  PieChart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import StrategyCard from "@/components/earnings/StrategyCard";
import { copy, type AppLanguage } from "@/lib/i18n";
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
        description={copy(
          language,
          "Earnings strateji workspace'i ve senaryo katmani yukleniyor.",
          "The earnings strategy workspace and scenario layer are loading."
        )}
        label={copy(language, "Earnings workspace yukleniyor", "Loading earnings workspace")}
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
  return (
    <EarningsWorkspaceFrame>
      <EmptyState
        tone="warning"
        title={copy(
          language,
          "Earnings workspace hazir degil",
          "The earnings workspace is not ready"
        )}
        description={
          error ||
          copy(
            language,
            "Pipeline verisi henuz gelmedi. Kaynagi tekrar yoklayin.",
            "The pipeline data has not arrived yet. Retry the source."
          )
        }
        icon={AlertTriangle}
        action={
          <Button type="button" variant="outline" onClick={onRetry}>
            {copy(language, "Tekrar dene", "Retry")}
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
  const statusCopy = {
    idle: copy(language, "Beklemede", "Idle"),
    ok: copy(language, "Guncel", "Current"),
    stale: copy(language, "Bayat", "Stale"),
    error: copy(language, "Hata", "Error"),
  }[pipeline.status];

  const statusColor = {
    idle: "text-slate-400",
    ok: "text-emerald-400",
    stale: "text-amber-400",
    error: "text-rose-400",
  }[pipeline.status];

  return (
    <section className={cn(
      "panel p-6 md:p-8",
      "bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm"
    )}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
            {copy(language, "Pipeline durumu", "Pipeline status")}
          </p>
          <h2 className={cn("mt-2 text-xl font-bold", statusColor)}>
            {statusCopy}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {pipeline.error ||
              copy(
                language,
                "Kaynak markdown dosyasi duzenli olarak taraniyor ve son snapshot burada sunuluyor.",
                "The source markdown is polled regularly and the latest snapshot is surfaced here."
              )}
          </p>
        </div>
        <div className="grid gap-2 rounded-2xl border border-white/10 bg-slate-900/50 p-5 text-sm text-slate-400 md:min-w-[300px]">
          <p>
            <span className="text-slate-500">
              {copy(language, "Son senkron", "Last sync")}:{" "}
            </span>
            {pipeline.lastSyncedAt || "—"}
          </p>
          <p>
            <span className="text-slate-500">
              {copy(language, "Kaynak degisti", "Source modified")}:{" "}
            </span>
            {pipeline.lastSourceModifiedAt || "—"}
          </p>
          <p className="truncate">
            <span className="text-slate-500">
              {copy(language, "Kaynak", "Source")}:{" "}
            </span>
            {pipeline.resolvedSourceFile || pipeline.sourceFolder || "—"}
          </p>
        </div>
      </div>
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
    ? copy(language, "Öne Çıkan Stratejiler", "Core Strategies")
    : title;

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
                {copy(language, "Daha Az Göster", "Show Less")}
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 size-4" />
                {copy(
                  language,
                  `Tümünü Göster (${strategies.length})`,
                  `Show All (${strategies.length})`
                )}
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
            {copy(language, "Aksiyon plani", "Action plan")}
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
                {item.week || item.dateRange || copy(language, "Plan", "Plan")}
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
            {copy(language, "Portfoy katmanlari", "Portfolio layers")}
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
              {copy(language, "Toplam tahsis", "Total allocation")}:{" "}
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
            {copy(language, "Executive summary", "Executive summary")}
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
      label: copy(language, "Toplam event", "Total events"),
      value: String(totalCount),
      icon: <BarChart3 className="size-5 text-sky-400" />,
      color: "text-white",
    },
    {
      label: copy(language, "Yuksek onem", "High importance"),
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
            {copy(language, "Takvim ozeti", "Calendar snapshot")}
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
