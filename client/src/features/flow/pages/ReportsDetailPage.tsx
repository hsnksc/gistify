import type { AppLanguage } from "@/lib/i18n";
import FlowDetailPage from "./FlowDetailPage";

interface ReportsDetailPageProps {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  reportId: string;
}

export default function ReportsDetailPage({
  language,
  onLanguageChange,
  reportId,
}: ReportsDetailPageProps) {
  return (
    <FlowDetailPage
      basePath="/reports"
      eyebrow="Reports"
      language={language}
      onLanguageChange={onLanguageChange}
      reportId={reportId}
    />
  );
}
