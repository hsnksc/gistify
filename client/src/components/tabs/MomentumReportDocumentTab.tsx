import { FileText } from "lucide-react";
import MarkdownReportRenderer from "@/components/reports/MarkdownReportRenderer";
import type { MomentumReportSource } from "@/lib/momentumReportSource";
import { copy, type AppLanguage } from "@/lib/i18n";

export default function MomentumReportDocumentTab({
  report,
  language = "tr",
}: {
  report: MomentumReportSource;
  language?: AppLanguage;
}) {
  return (
    <div className="space-y-6 px-6 pb-8">
      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
            <FileText className="size-4" />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {copy(language, "Kaynak Dokuman", "Source Document")}
            </p>
            <h2 className="heading-condensed text-3xl text-foreground">
              {copy(language, "Tam momentum markdown", "Full momentum markdown")}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              {copy(
                language,
                "Market, setup ve strategy panellerine ek olarak yuklenen momentum dosyasinin tum icerigi burada birebir okunur.",
                "In addition to the market, setup and strategy panels, the full uploaded momentum file is rendered here as-is."
              )}
            </p>
          </div>
        </div>
      </section>

      <MarkdownReportRenderer
        language={language}
        markdown={report.rawMarkdown}
        emptyMessage={copy(
          language,
          "Momentum markdown icerigi okunamadi.",
          "The momentum markdown content could not be read."
        )}
      />
    </div>
  );
}
