import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowFeedScreen from "../components/FlowFeedScreen";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";

export default function FlowPage({
  language,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const { reports, loading, error, reload } = useFlowReportSummaries(language, {
    timeoutMs: 10_000,
  });

  usePageMeta({
    description: copy(
      language,
      "Flow, yuklenen raporlari sosyal akista post gibi gosterir.",
      "Flow renders uploaded reports as a social-style post feed."
    ),
    title: copy(language, "Flow | Gistify", "Flow | Gistify"),
  });

  return (
    <FlowFeedScreen
      basePath="/flow"
      description={copy(
        language,
        "Yuklenen raporlar burada post gibi akar. Kartta sadece yuklenme zamani, baslik ve tickerlar gorunur; devaminda detay acilir.",
        "Uploaded reports flow here like posts. Each card only shows upload time, title and tickers; opening it reveals the detail view."
      )}
      error={error}
      eyebrow={copy(language, "Flow", "Flow")}
      language={language}
      loading={loading}
      onRefresh={reload}
      reports={reports}
      title={copy(language, "Post Akisi", "Post Feed")}
    />
  );
}
