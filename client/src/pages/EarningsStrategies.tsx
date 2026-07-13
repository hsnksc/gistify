import CPRTable from "@/components/earnings/CPRTable";
import EarningsHero from "@/components/earnings/EarningsHero";
import FOMCWarningBanner from "@/components/earnings/FOMCWarningBanner";
import EarningsQuantCommandCenter from "@/components/earnings/EarningsQuantCommandCenter";
import { usePageMeta } from "@/hooks/usePageMeta";
import { AppLanguage, t } from "@/lib/i18n";

import {
  EarningsLoadingState,
  EarningsPipelinePanel,
  EarningsUnavailableState,
  EarningsWorkspaceToolbar,
  EarningsWorkspaceFrame,
  StrategyCollectionPanel,
} from "./earnings/EarningsSurface";
import { useEarningsStrategy } from "./earnings/useEarningsStrategy";
import { toast } from "sonner";

export default function EarningsStrategiesPage({
  language,
}: {
  language: AppLanguage;
}) {
  usePageMeta({
    description: t("earnings:earningsStrategiesBeatProbabilityImplied"),
    title: t("earnings:earningsStrategiesGistify"),
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
              t("earnings:theStrategyWorkspaceRefreshed")
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

  const handleRefresh = async () => {
    const result = await refresh();
    if (result.ok) {
      toast.success(
        t("earnings:theStrategyWorkspaceRefreshed")
      );
      return;
    }
    toast.error(t("scanner:targetIs24Away"), {
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
        sectionLabel={t("earnings:strategies")}
      />
      <EarningsPipelinePanel language={language} pipeline={pipeline} />
      <EarningsQuantCommandCenter data={data} language={language} />
      {data.fomc ? (
        <FOMCWarningBanner fomc={data.fomc} language={language} />
      ) : null}
      <StrategyCollectionPanel
        description={t("earnings:higherPriorityStrategiesCarryingThe")}
        language={language}
        strategies={data.strategies}
        title={t("scanner:refreshFlow")}
      />
      <StrategyCollectionPanel
        description={t("earnings:alternativeStructuresThatExpressThe")}
        language={language}
        strategies={data.budgetStrategies}
        title={t("earnings:budgetStrategies")}
      />
      <CPRTable language={language} stocks={data.cprStocks} />
    </EarningsWorkspaceFrame>
  );
}
