import { usePageMeta } from "@/hooks/usePageMeta";
import { copy, type AppLanguage } from "@/lib/i18n";
import FlowFeedScreen from "../components/FlowFeedScreen";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";

export default function FlowDailyPage({
  language,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const { reports, loading, error, reload } = useFlowReportSummaries(language, {
    reportKind: "daily",
  });

  usePageMeta({
    description: copy(
      language,
      "Gunluk Flow postlari tek akista listelenir.",
      "Daily Flow posts are listed in a single feed."
    ),
    title: copy(language, "Gunluk Flow | Gistify", "Daily Flow | Gistify"),
  });

  return (
    <FlowFeedScreen
      backHref="/flow"
      backLabel={copy(language, "Tum Akis", "Full Feed")}
      basePath="/flow"
      description={copy(
        language,
        "Gunluk ve market geneli postlar burada filtrelenir.",
        "Daily and market-wide posts are filtered here."
      )}
      error={error}
      eyebrow={copy(language, "Gunluk", "Daily")}
      language={language}
      loading={loading}
      onRefresh={reload}
      reports={reports}
      title={copy(language, "Gunluk Postlar", "Daily Posts")}
    />
  );
}
