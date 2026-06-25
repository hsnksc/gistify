import { FileText } from "lucide-react";
import MarkdownReportRenderer from "@/components/reports/MarkdownReportRenderer";
import type { EarningReportSource } from "@/lib/earningReportSource";
import { copy, type AppLanguage } from "@/lib/i18n";

export default function EarningReportDocumentTab({
  report,
  language = "tr",
}: {
  report: EarningReportSource;
  language?: AppLanguage;
}) {
  return (
    <div className="space-y-6 p-6">
      <section className="rounded-none border border-border bg-card/80 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
            <FileText className="size-4" />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {copy(language, "Kaynak Dokuman", "Source Document")}
            </p>
            <h2 className="heading-condensed text-3xl text-foreground">
              {copy(language, "Tam markdown raporu", "Full markdown report")}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              {copy(
                language,
                "Parser panelleri yeterli gelmediginde, yuklenen earnings markdown dosyasinin tam akisi burada ayni tema icinde okunur.",
                "When parser-driven panels are not enough, the full uploaded earnings markdown is read here inside the same theme."
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
          "Earnings markdown icerigi okunamadi.",
          "The earnings markdown content could not be read."
        )}
      />
    </div>
  );
}

