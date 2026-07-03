import { useMemo } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { type AppLanguage, t } from "@/lib/i18n";
import FlowFeedScreen from "../components/FlowFeedScreen";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";
import { getFlowReportTickers } from "../lib/flowReportHelpers";

interface FlowTickerPageProps {
  basePath?: string;
  eyebrow?: string;
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  ticker: string;
}

export default function FlowTickerPage({
  basePath = "/flow",
  eyebrow = "Ticker",
  language,
  ticker,
}: FlowTickerPageProps) {
  const normalizedTicker = ticker.trim().toUpperCase();
  const { reports, loading, error, reload } = useFlowReportSummaries(language, {
    reportKind: "stock",
  });

  const filteredReports = useMemo(
    () =>
      reports.filter(report =>
        getFlowReportTickers(report).includes(normalizedTicker)
      ),
    [normalizedTicker, reports]
  );

  usePageMeta({
    description: (language === "en" ? `Flow posts for ${normalizedTicker || "this ticker"}.` : `${normalizedTicker || "Ticker"} icin Flow postlari.`),
    title: normalizedTicker
      ? `${normalizedTicker} | Flow`
      : "Ticker | Flow",
  });

  return (
    <FlowFeedScreen
      backHref={basePath}
      backLabel={t("calendar:macroCalendarGistify")}
      basePath={basePath}
      description={t("earnings:theEarningsCalendarRefreshed", { normalizedticker: normalizedTicker })}
      emptyDescription={t("flow:thereAreNoPostsFor")}
      emptyTitle={t("calendar:lowVol")}
      error={error}
      eyebrow={eyebrow}
      language={language}
      loading={loading}
      onRefresh={reload}
      reports={filteredReports}
      title={normalizedTicker ? `$${normalizedTicker}` : "Ticker"}
    />
  );
}
