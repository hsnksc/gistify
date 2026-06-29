import { useMemo } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
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
    description: copy(
      language,
      `${normalizedTicker || "Ticker"} icin Flow postlari.`,
      `Flow posts for ${normalizedTicker || "this ticker"}.`
    ),
    title: normalizedTicker
      ? `${normalizedTicker} | Flow`
      : copy(language, "Ticker | Flow", "Ticker | Flow"),
  });

  return (
    <FlowFeedScreen
      backHref={basePath}
      backLabel={copy(language, "Tum Akis", "Full Feed")}
      basePath={basePath}
      description={copy(
        language,
        `${normalizedTicker} gecen postlar burada toplanir.`,
        `Posts that mention ${normalizedTicker} are collected here.`
      )}
      emptyDescription={copy(
        language,
        "Bu ticker icin henuz bir post bulunmuyor.",
        "There are no posts for this ticker yet."
      )}
      emptyTitle={copy(
        language,
        "Ticker postu bulunamadi.",
        "No ticker post was found."
      )}
      error={error}
      eyebrow={eyebrow}
      language={language}
      loading={loading}
      onRefresh={reload}
      reports={filteredReports}
      title={normalizedTicker ? `$${normalizedTicker}` : copy(language, "Ticker", "Ticker")}
    />
  );
}
