import type { AppLanguage } from "@/lib/i18n";
import ReportsIndexPage from "./ReportsIndexPage";

interface ReportsTickerPageProps {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  ticker: string;
}

export default function ReportsTickerPage({
  language,
  onLanguageChange,
  ticker,
}: ReportsTickerPageProps) {
  return (
    <ReportsIndexPage
      forcedTicker={ticker}
      language={language}
      onLanguageChange={onLanguageChange}
    />
  );
}
