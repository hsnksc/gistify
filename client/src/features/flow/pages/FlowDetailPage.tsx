import type { AppLanguage } from "@/lib/i18n";
import FlowReportDetailSurface from "../components/FlowReportDetailSurface";
import { useFlowReport } from "../hooks/useFlowReport";

interface FlowDetailPageProps {
  basePath?: string;
  eyebrow?: string;
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  reportId: string;
}

export default function FlowDetailPage({
  basePath = "/flow",
  eyebrow = "Flow",
  language,
  reportId,
}: FlowDetailPageProps) {
  const { report, loading, error, reload } = useFlowReport(reportId, language);

  return (
    <FlowReportDetailSurface
      basePath={basePath}
      eyebrow={eyebrow}
      error={error}
      language={language}
      loading={loading}
      onRefresh={reload}
      report={report}
    />
  );
}
