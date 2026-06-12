import DailyReportPage from "./DailyReport";
import type { AppLanguage } from "@/lib/i18n";

export default function FlowReportsPage({ language }: { language: AppLanguage }) {
  return <DailyReportPage language={language} mode="flow" />;
}
