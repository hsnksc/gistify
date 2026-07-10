import { usePageMeta } from "@/hooks/usePageMeta";
import { type AppLanguage, t } from "@/lib/i18n";
import FlowFeedScreen from "../components/FlowFeedScreen";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";

export default function FlowWeeklyPage({
  language,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const { reports, loading, error, reload } = useFlowReportSummaries(language, {
    reportKind: "weekly",
  });

  usePageMeta({
    description: t("flow:weeklyFlowPostsAreListed"),
    title: t("flow:weeklyFlowGistify"),
  });

  return (
    <FlowFeedScreen
      backHref="/flow"
      backLabel={t("flow:fullFeed")}
      basePath="/flow"
      description={t("flow:weeklyReportDescription")}
      error={error}
      eyebrow={t("common:weekly")}
      language={language}
      loading={loading}
      onRefresh={reload}
      reports={reports}
      title={t("flow:weeklyReportArchive")}
    />
  );
}
