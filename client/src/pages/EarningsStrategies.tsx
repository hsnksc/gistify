import CPRTable from "@/components/earnings/CPRTable";
import EarningsHero from "@/components/earnings/EarningsHero";
import FOMCWarningBanner from "@/components/earnings/FOMCWarningBanner";
import type { AppLanguage } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import {
  EarningsLoadingState,
  EarningsPipelinePanel,
  EarningsUnavailableState,
  EarningsWorkspaceFrame,
  StrategyCollectionPanel,
} from "./earnings/EarningsSurface";
import { useEarningsStrategy } from "./earnings/useEarningsStrategy";

export default function EarningsStrategiesPage({
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
      <StrategyCollectionPanel
        description={copy(
          language,
          "Ana senaryo ve IV/CPR ciftini tasiyan yuksek oncelikli stratejiler.",
          "Higher-priority strategies carrying the main scenario and IV/CPR setup."
        )}
        language={language}
        strategies={data.strategies}
        title={copy(language, "Ana stratejiler", "Core strategies")}
      />
      <StrategyCollectionPanel
        description={copy(
          language,
          "Daha dusuk sermaye ile ayni event'i oynayan alternatif kurulumlar.",
          "Alternative structures that express the same event with smaller capital."
        )}
        language={language}
        strategies={data.budgetStrategies}
        title={copy(language, "Butce dostu stratejiler", "Budget strategies")}
      />
      <CPRTable language={language} stocks={data.cprStocks} />
    </EarningsWorkspaceFrame>
  );
}
