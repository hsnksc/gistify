import EarningsCalendar from "@/components/earnings/EarningsCalendar";
import EarningsHero from "@/components/earnings/EarningsHero";
import FOMCWarningBanner from "@/components/earnings/FOMCWarningBanner";
import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
import {
  CalendarStatsPanel,
  EarningsLoadingState,
  EarningsPipelinePanel,
  EarningsUnavailableState,
  EarningsWorkspaceToolbar,
  EarningsWorkspaceFrame,
} from "./earnings/EarningsSurface";
import { useEarningsStrategy } from "./earnings/useEarningsStrategy";
import { toast } from "sonner";

export default function EarningsCalendarPage({
  language,
}: {
  language: AppLanguage;
}) {
  usePageMeta({
    description: copy(
      language,
      "Kazanc takvimi: siradaki raporlari, beklentileri ve tarihleri gorun.",
      "Earnings calendar: see upcoming reports, expectations and dates."
    ),
    title: copy(
      language,
      "Kazanc Takvimi | Gistify",
      "Earnings Calendar | Gistify"
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
              copy(language, "Earnings takvimi yenilendi.", "The earnings calendar refreshed.")
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

  const highImportanceCount = data.calendar.filter(
    event => event.importance >= 4
  ).length;
  const bmoCount = data.calendar.filter(event => event.time === "BMO").length;
  const amcCount = data.calendar.filter(event => event.time === "AMC").length;
  const handleRefresh = async () => {
    const result = await refresh();
    if (result.ok) {
      toast.success(
        copy(language, "Earnings takvimi yenilendi.", "The earnings calendar refreshed.")
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
        sectionLabel={copy(language, "Takvim", "Calendar")}
      />
      <EarningsPipelinePanel language={language} pipeline={pipeline} />
      {data.fomc ? (
        <FOMCWarningBanner fomc={data.fomc} language={language} />
      ) : null}
      <CalendarStatsPanel
        amcCount={amcCount}
        bmoCount={bmoCount}
        highImportanceCount={highImportanceCount}
        language={language}
        totalCount={data.calendar.length}
      />
      <EarningsCalendar events={data.calendar} language={language} />
    </EarningsWorkspaceFrame>
  );
}
