import EarningsCalendar from "@/components/earnings/EarningsCalendar";
import EarningsHero from "@/components/earnings/EarningsHero";
import StrategyCard from "@/components/earnings/StrategyCard";
import { copy, type AppLanguage } from "@/lib/i18n";
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
              copy(language, "Ticker workspace'i yenilendi.", "The ticker workspace refreshed.")
            );
            return;
          }
          toast.error(copy(language, "Yenileme basarisiz.", "Refresh failed."), {
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
        copy(language, "Ticker workspace'i yenilendi.", "The ticker workspace refreshed.")
      );
      return;
    }
    toast.error(copy(language, "Yenileme basarisiz.", "Refresh failed."), {
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
        sectionLabel={`${copy(language, "Ticker", "Ticker")}: ${normalizedTicker}`}
      />
      <EarningsPipelinePanel language={language} pipeline={pipeline} />
      {strategy ? (
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <section className="panel p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
              {copy(language, "Secili strateji", "Selected strategy")}
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
                {copy(language, "Desk note", "Desk note")}
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
                    {copy(
                      language,
                      "Bu ticker icin ek not gelmemis. Greeks, CPR ve event zamanlamasi ana karar cercevesi olarak kalir.",
                      "No extra note arrived for this ticker. Greeks, CPR and event timing remain the primary decision frame."
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <EmptyState
          description={copy(
            language,
            `${normalizedTicker} icin strategy snapshot bulunamadi. Pipeline'da sadece takvim verisi olabilir.`,
            `No strategy snapshot was found for ${normalizedTicker}. The pipeline may only contain calendar data.`
          )}
          icon={Search}
          title={copy(language, "Ticker bulunamadi", "Ticker not found")}
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
    [copy(language, "Entry", "Entry"), strategy.entry],
    [copy(language, "Exit", "Exit"), strategy.exit],
    [copy(language, "Max hold", "Max hold"), strategy.maxHold],
    [copy(language, "Profit target", "Profit target"), strategy.profitTarget],
    [copy(language, "Position size", "Position size"), strategy.positionSize],
    [copy(language, "Stop loss", "Stop loss"), strategy.stopLoss],
    [copy(language, "IV crush", "IV crush"), strategy.ivCrush],
    [copy(language, "Optimal exit", "Optimal exit"), strategy.optimalExit],
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
            {copy(language, "Butce varyasyonlari", "Budget variations")}
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
                    {copy(language, "Max profit", "Max profit")}:{" "}
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
