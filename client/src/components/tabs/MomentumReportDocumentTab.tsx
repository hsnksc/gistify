import { FileText } from "lucide-react";
import MarkdownReportRenderer from "@/components/reports/MarkdownReportRenderer";
import type { MomentumReportSource } from "@/lib/momentumReportSource";
import { type AppLanguage, t } from "@/lib/i18n";

export default function MomentumReportDocumentTab({
  report,
  language = "tr",
}: {
  report: MomentumReportSource;
  language?: AppLanguage;
}) {
  return (
    <div className="space-y-6 px-6 pb-8">
      <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
            <FileText className="size-4" />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {t("common:sourceDocument")}
            </p>
            <h2 className="heading-condensed text-3xl text-foreground">
              {t("common:fullMomentumMarkdown")}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              {t("common:inAdditionToTheMarket")}
            </p>
          </div>
        </div>
      </section>

      <MarkdownReportRenderer
        language={language}
        markdown={report.rawMarkdown}
        emptyMessage={t("common:theMomentumMarkdownContentCould")}
      />
    </div>
  );
}

