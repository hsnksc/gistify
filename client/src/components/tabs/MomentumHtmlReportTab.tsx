import HtmlReportRenderer from "@/components/reports/HtmlReportRenderer";
import type { AppLanguage } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import type { MomentumSourceRecord } from "@shared/momentumSources";

export default function MomentumHtmlReportTab({
  report,
  language = "tr",
}: {
  report: MomentumSourceRecord;
  language?: AppLanguage;
}) {
  return (
    <div className="space-y-6 px-6 pb-8">
      <HtmlReportRenderer
        language={language}
        html={report.html}
        emptyMessage={copy(
          language,
          "Momentum HTML icerigi gosterilemedi.",
          "The momentum HTML content could not be displayed."
        )}
      />
    </div>
  );
}
