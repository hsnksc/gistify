import HtmlReportRenderer from "@/components/reports/HtmlReportRenderer";
import { AppLanguage, t } from "@/lib/i18n";

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
        emptyMessage={t("common:theMomentumHtmlContentCould")}
      />
    </div>
  );
}
