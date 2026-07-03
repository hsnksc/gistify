import EarningsCalendar from "@/components/earnings/EarningsCalendar";
import EarningsHero from "@/components/earnings/EarningsHero";
import StrategyCard from "@/components/earnings/StrategyCard";
import { usePageMeta } from "@/hooks/usePageMeta";
import { type AppLanguage, t } from "@/lib/i18n";
import { Search } from "lucide-react";
import type { Strategy } from "@shared/earnings";
import {
  EarningsLoadingState,
  EarningsPipelinePanel,
  EarningsUnavailableState,
  EarningsWorkspaceToolbar,
  EarningsWorkspaceFrame,
} from "./earnings/EarningsSurface";
import { useEarningsStrategy } from "./earnings/useEarningsStrategy";
import EmptyState from "@/components/ui/empty-state";
import { toast } from "sonner";

export default function EarningsStockDetailPage({
  language,
  ticker,
}: {
  language: AppLanguage;
  ticker: string;
}) {
  usePageMeta({
    description: t("earnings:earningsAnalysisExpectationsBeatRisk", { ticker }),
    title: `${ticker} Earnings | Gistify`,
  });

  const { data, error, isLoading, isRefreshing, pipeline, refresh } =
    useEarningsStrategy();

  if (isLoading) {
    return <EarningsLoadingState language={language} />;
  }

  if (!data) {
    return (
      <EarningsUnavailableState
        error={error}
        language={language}
        onRetry={async () => {
          const result = await refresh();
          if (result.ok) {
            toast.success(
              t("earnings:theTickerWorkspaceRefreshed")
            );
            return;
          }
          toast.error(t("common:refreshFailed"), {
            description: result.error,
          });
        }}
      />
    );
  }

  const normalizedTicker = ticker.trim().toUpperCase();
  const allStrategies = [...data.strategies, ...data.budgetStrategies];
  const strategy =
    allStrategies.find(item => item.ticker.toUpperCase() === normalizedTicker) ||
    null;
  const relatedEvents = data.calendar.filter(
    event => event.ticker.toUpperCase() === normalizedTicker
  );
  const handleRefresh = async () => {
    const result = await refresh();
    if (result.ok) {
      toast.success(
        t("earnings:theTickerWorkspaceRefreshed")
      );
      return;
    }
    toast.error(t("common:refreshFailed"), {
      description: result.error,
    });
  };

  return (
    <EarningsWorkspaceFrame>
      <EarningsHero
        data={data}
        isRefreshing={isRefreshing}
        language={language}
        onRefresh={() => {
          void handleRefresh();
        }}
      />
      <EarningsWorkspaceToolbar
        language={language}
        pipeline={pipeline}
        sectionLabel={`${"Ticker"}: ${normalizedTicker}`}
      />
      <EarningsPipelinePanel language={language} pipeline={pipeline} />
      {strategy ? (
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <section className="panel p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
              {t("earnings:selectedStrategy")}
            </p>
            <div className="mt-4">
              <StrategyCard language={language} strategy={strategy} />
            </div>
            <StrategyDetailPanel language={language} strategy={strategy} />
          </section>

          <div className="space-y-6">
            {relatedEvents.length > 0 ? (
              <EarningsCalendar events={relatedEvents} language={language} />
            ) : null}
            <section className="panel p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                {"Desk note"}
              </p>
              <div className="mt-3 space-y-2">
                {(strategy.notes || []).length > 0 ? (
                  strategy.notes?.map(note => (
                    <div
                      key={note}
                      className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm leading-6 text-muted-foreground"
                    >
                      {note}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm leading-6 text-muted-foreground">
                    {t("earnings:noExtraNoteArrivedFor")}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <EmptyState
          description={t("earnings:noStrategySnapshotWasFound", { normalizedticker: normalizedTicker })}
          icon={Search}
          title={t("earnings:tickerNotFound")}
          tone="info"
        />
      )}
    </EarningsWorkspaceFrame>
  );
}

function StrategyDetailPanel({
  language,
  strategy,
}: {
  language: AppLanguage;
  strategy: Strategy;
}) {
  const fields = [
    ["Entry", strategy.entry],
    ["Exit", strategy.exit],
    ["Max hold", strategy.maxHold],
    ["Profit target", strategy.profitTarget],
    ["Position size", strategy.positionSize],
    ["Stop loss", strategy.stopLoss],
    ["IV crush", strategy.ivCrush],
    ["Optimal exit", strategy.optimalExit],
  ].filter(([, value]) => Boolean(value));

  if (fields.length === 0 && strategy.budgetOptions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      {fields.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-background/60 px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {strategy.budgetOptions.length > 0 ? (
        <section className="rounded-xl border border-border bg-background/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            {t("earnings:budgetVariations")}
          </p>
          <div className="mt-3 space-y-2">
            {strategy.budgetOptions.map(option => (
              <div
                key={`${option.budget}-${option.strategy}`}
                className="rounded-lg border border-border bg-black/15 px-3 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-foreground">
                    {option.budget}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {option.cost}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {option.strategy}
                </p>
                {option.maxProfit ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {"Max profit"}:{" "}
                    {option.maxProfit}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
