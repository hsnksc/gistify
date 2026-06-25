import EarningsCalendar from "@/components/earnings/EarningsCalendar";
import EarningsHero from "@/components/earnings/EarningsHero";
import FOMCWarningBanner from "@/components/earnings/FOMCWarningBanner";
import type { AppLanguage } from "@/lib/i18n";
import {
  CalendarStatsPanel,
  EarningsLoadingState,
  EarningsPipelinePanel,
  EarningsUnavailableState,
  EarningsWorkspaceFrame,
} from "./earnings/EarningsSurface";
import { useEarningsStrategy } from "./earnings/useEarningsStrategy";

export default function EarningsCalendarPage({
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

  const highImportanceCount = data.calendar.filter(
    event => event.importance >= 4
  ).length;
  const bmoCount = data.calendar.filter(event => event.time === "BMO").length;
  const amcCount = data.calendar.filter(event => event.time === "AMC").length;

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
