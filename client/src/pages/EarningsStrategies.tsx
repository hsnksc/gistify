import CPRTable from "@/components/earnings/CPRTable";
import EarningsHero from "@/components/earnings/EarningsHero";
import FOMCWarningBanner from "@/components/earnings/FOMCWarningBanner";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { AppLanguage } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
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
    description: copy(
      language,
      "Kazanc stratejileri: beat ihtimali, implied move ve opsiyon cercevesi.",
      "Earnings strategies: beat probability, implied move and options framing."
    ),
    title: copy(
      language,
      "Kazanc Stratejileri | Gistify",
      "Earnings Strategies | Gistify"
    ),
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
              copy(language, "Strateji workspace'i yenilendi.", "The strategy workspace refreshed.")
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

  const handleRefresh = async () => {
    const result = await refresh();
    if (result.ok) {
      toast.success(
        copy(language, "Strateji workspace'i yenilendi.", "The strategy workspace refreshed.")
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
        sectionLabel={copy(language, "Stratejiler", "Strategies")}
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
