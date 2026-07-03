import { usePageMeta } from "@/hooks/usePageMeta";
import { type AppLanguage, t } from "@/lib/i18n";
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
    description: t("flow:flowRendersUploadedReportsAs"),
    title: "Flow | Gistify",
  });

  return (
    <FlowFeedScreen
      basePath="/flow"
      description={t("flow:uploadedReportsFlowHereLike")}
      error={error}
      eyebrow={"Flow"}
      language={language}
      loading={loading}
      onRefresh={reload}
      reports={reports}
      title={t("flow:postFeed")}
    />
  );
}
