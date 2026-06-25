import EarningsCalendar from "@/components/earnings/EarningsCalendar";
import EarningsHero from "@/components/earnings/EarningsHero";
import CPRTable from "@/components/earnings/CPRTable";
import FOMCWarningBanner from "@/components/earnings/FOMCWarningBanner";
import MacroDashboard from "@/components/earnings/MacroDashboard";
import type { AppLanguage } from "@/lib/i18n";
import {
  ActionPlanPanel,
  EarningsLoadingState,
  EarningsPipelinePanel,
  EarningsUnavailableState,
  EarningsWorkspaceFrame,
  ExecutiveSummaryPanel,
  PortfolioPanel,
  StrategyCollectionPanel,
} from "./earnings/EarningsSurface";
import { useEarningsStrategy } from "./earnings/useEarningsStrategy";

export default function EarningsPage({
  language,
}: {
  language: AppLanguage;
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
        onRetry={() => {
          void refresh();
        }}
      />
    );
  }

  return (
    <EarningsWorkspaceFrame>
      <EarningsHero
        data={data}
        isRefreshing={isRefreshing}
        language={language}
        onRefresh={() => {
          void refresh();
        }}
      />
      <EarningsPipelinePanel language={language} pipeline={pipeline} />
      {data.fomc ? (
        <FOMCWarningBanner fomc={data.fomc} language={language} />
      ) : null}
      <MacroDashboard language={language} macro={data.macro} />
      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <EarningsCalendar
          events={data.calendar.slice(0, 24)}
          language={language}
        />
        <CPRTable language={language} stocks={data.cprStocks} />
      </div>
      <ExecutiveSummaryPanel
        items={data.executiveSummary}
        language={language}
      />
      <StrategyCollectionPanel
        description={data.summary}
        language={language}
        strategies={data.strategies.slice(0, 6)}
        title="Core strategies"
      />
      <ActionPlanPanel items={data.actionPlan} language={language} />
      <PortfolioPanel language={language} levels={data.portfolio} />
    </EarningsWorkspaceFrame>
  );
}
