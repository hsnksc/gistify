import { usePageMeta } from "@/hooks/usePageMeta";
import { type AppLanguage, t } from "@/lib/i18n";
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
    description: t("flow:dailyFlowPostsAreListed"),
    title: t("flow:dailyFlowGistify"),
  });

  return (
    <FlowFeedScreen
      backHref="/flow"
      backLabel={t("flow:fullFeed")}
      basePath="/flow"
      description={t("flow:dailyAndMarketWidePosts")}
      error={error}
      eyebrow={t("common:daily")}
      language={language}
      loading={loading}
      onRefresh={reload}
      reports={reports}
      title={t("marketing:paid")}
    />
  );
}
