import HtmlReportRenderer from "@/components/reports/HtmlReportRenderer";
import MarkdownReportRenderer from "@/components/reports/MarkdownReportRenderer";
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

  if (content.contentFormat === "html") {
    return (
      <HtmlReportRenderer
        language={language}
        html={content.html || ""}
        emptyMessage={viewer.emptyMessage}
        minimal
        sourceFolder={report.sourceFolder}
        sourceLabel={content.sourceLabel || report.sourceFolder}
        title={report.title}
      />
    );
  }

  return (
    <MarkdownReportRenderer
      language={language}
      markdown={content.markdown}
      emptyMessage={viewer.emptyMessage}
      resolveImage={viewer.resolveImage}
    />
  );
}
