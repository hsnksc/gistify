import type { ReactNode } from "react";
import { AlertTriangle, CalendarDays, ListTodo, Target, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import StrategyCard from "@/components/earnings/StrategyCard";
import { copy, type AppLanguage } from "@/lib/i18n";
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
  return <div className="container space-y-6 py-6 md:py-8">{children}</div>;
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

  return (
    <section className="panel p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            {copy(language, "Pipeline durumu", "Pipeline status")}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">
            {statusCopy}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {pipeline.error ||
              copy(
                language,
                "Kaynak markdown dosyasi duzenli olarak taraniyor ve son snapshot burada sunuluyor.",
                "The source markdown is polled regularly and the latest snapshot is surfaced here."
              )}
          </p>
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground md:min-w-[260px]">
          <p>
            {copy(language, "Son senkron", "Last sync")}:{" "}
            {pipeline.lastSyncedAt || "-"}
          </p>
          <p>
            {copy(language, "Kaynak degisti", "Source modified")}:{" "}
            {pipeline.lastSourceModifiedAt || "-"}
          </p>
          <p className="truncate">
            {copy(language, "Kaynak", "Source")}:{" "}
            {pipeline.resolvedSourceFile || pipeline.sourceFolder || "-"}
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
  return (
    <section className="panel p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            {title}
          </p>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
          {strategies.length}
        </span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {strategies.map(strategy => (
          <StrategyCard
            key={`${strategy.ticker}-${strategy.type || "strategy"}`}
            language={language}
            strategy={strategy}
          />
        ))}
      </div>
    </section>
  );
}

export function ActionPlanPanel({
  items,
  language,
}: {
  items: ActionPlanItem[];
  language: AppLanguage;
}) {
  if (items.length === 0) return null;

  return (
    <section className="panel p-4">
      <div className="mb-4 flex items-center gap-2">
        <ListTodo className="size-4 text-sky-300" />
        <h2 className="text-lg font-semibold text-foreground">
          {copy(language, "Aksiyon plani", "Action plan")}
        </h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={`${item.week || item.dateRange || "action"}-${index}`}
            className="rounded-xl border border-border bg-background/60 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              {item.week || item.dateRange || copy(language, "Plan", "Plan")}
            </p>
            {item.focus ? (
              <p className="mt-2 text-sm font-semibold text-foreground">
                {item.focus}
              </p>
            ) : null}
            <div className="mt-3 space-y-2">
              {item.actions.map(action => (
                <div
                  key={action}
                  className="rounded-lg border border-border bg-black/15 px-3 py-2 text-sm leading-6 text-muted-foreground"
                >
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

  return (
    <section className="panel p-4">
      <div className="mb-4 flex items-center gap-2">
        <Wallet className="size-4 text-sky-300" />
        <h2 className="text-lg font-semibold text-foreground">
          {copy(language, "Portfoy katmanlari", "Portfolio layers")}
        </h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {levels.map(level => (
          <div
            key={level.budget}
            className="rounded-xl border border-border bg-background/60 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              {level.budget}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {copy(language, "Toplam tahsis", "Total allocation")}:{" "}
              {level.totalAllocation || "-"}
            </p>
            <div className="mt-3 space-y-2">
              {level.recommendations.map(item => (
                <div
                  key={`${level.budget}-${item.ticker}-${item.strategy}`}
                  className="rounded-lg border border-border bg-black/15 px-3 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-foreground">
                      {item.ticker}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.allocation}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.strategy}
                  </p>
                  {item.entryExit ? (
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
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
    <section className="panel p-4">
      <div className="mb-4 flex items-center gap-2">
        <Target className="size-4 text-sky-300" />
        <h2 className="text-lg font-semibold text-foreground">
          {copy(language, "Executive summary", "Executive summary")}
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map(item => (
          <div
            key={item}
            className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm leading-6 text-muted-foreground"
          >
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
    },
    {
      label: copy(language, "Yuksek onem", "High importance"),
      value: String(highImportanceCount),
    },
    {
      label: "BMO",
      value: String(bmoCount),
    },
    {
      label: "AMC",
      value: String(amcCount),
    },
  ];

  return (
    <section className="panel p-4">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="size-4 text-sky-300" />
        <h2 className="text-lg font-semibold text-foreground">
          {copy(language, "Takvim ozeti", "Calendar snapshot")}
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(item => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-background/60 px-4 py-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
