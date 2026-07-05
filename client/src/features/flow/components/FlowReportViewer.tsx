import HtmlReportRenderer from "@/components/reports/HtmlReportRenderer";
import { buildDailyReportHtmlDocument } from "@/lib/dailyReportHtml";
import type { AppLanguage } from "@/lib/i18n";
import type { FlowReport } from "@shared/flow";
import { normalizeFlowContent, buildFlowViewerData } from "../lib/flowReportHelpers";

interface FlowReportViewerProps {
  language: AppLanguage;
  report: FlowReport;
}

export default function FlowReportViewer({
  language,
  report,
}: FlowReportViewerProps) {
  const content = normalizeFlowContent(report.content || {});
  const viewer = buildFlowViewerData(report, language);
  const title = report.title;
  const resolvedHtml =
    content.contentFormat === "html"
      ? content.html || ""
      : buildDailyReportHtmlDocument({
          content,
          language,
          reportDateLabel: viewer.reportDateLabel,
          resolveImage: viewer.resolveImage,
          sourceLabel: content.sourceLabel || report.sourceFolder,
          title,
          updatedAtLabel: viewer.updatedAtLabel,
        });

  return (
    <HtmlReportRenderer
      language={language}
      html={resolvedHtml}
      emptyMessage={viewer.emptyMessage}
      minimal
      sourceFolder={report.sourceFolder}
      sourceLabel={content.sourceLabel || report.sourceFolder}
      title={title}
      availableLanguages={content.availableLanguages}
    />
  );
}
