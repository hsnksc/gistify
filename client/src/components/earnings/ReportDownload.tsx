import { FileText, Download, CalendarDays } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ReportDownloadProps {
  language: AppLanguage;
  reportDate?: string;
  fileName?: string;
}

export default function ReportDownload({
  language,
  reportDate,
  fileName,
}: ReportDownloadProps) {
  const hasReport = !!reportDate;

  const cards = [
    {
      key: "md",
      format: "md",
      title: copy(language, "Markdown", "Markdown"),
      desc: copy(
        language,
        "Gistify raporunu markdown formatında indirin. GitHub ve Notion ile uyumlu.",
        "Download Gistify report in markdown format. Compatible with GitHub and Notion."
      ),
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
      iconColor: "text-emerald-400",
      btnBg: "bg-emerald-500/20 hover:bg-emerald-500/30",
      btnText: "text-emerald-300",
    },
    {
      key: "docx",
      format: "docx",
      title: copy(language, "Word", "Word"),
      desc: copy(
        language,
        "DOCX formatında indirin. Microsoft Word ve Google Docs ile uyumlu.",
        "Download in DOCX format. Compatible with Microsoft Word and Google Docs."
      ),
      border: "border-blue-500/20",
      bg: "bg-blue-500/5",
      iconColor: "text-blue-400",
      btnBg: "bg-blue-500/20 hover:bg-blue-500/30",
      btnText: "text-blue-300",
    },
  ];

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <FileText className="size-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">
          {copy(language, "Rapor İndir", "Download Report")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const href = `/api/earnings/download?format=${card.format}`;
          return (
            <div
              key={card.key}
              className={cn(
                "group flex flex-col rounded-2xl border p-6 transition-all duration-200",
                card.border,
                card.bg,
                hasReport
                  ? "hover:scale-[1.02] hover:shadow-lg"
                  : "opacity-60"
              )}
            >
              {/* Icon + Title */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-slate-900/50">
                  <FileText className={cn("size-7", card.iconColor)} />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{card.title}</p>
                  <p className="text-xs text-slate-500">
                    .{card.format}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400">
                {card.desc}
              </p>

              {/* File name + date */}
              {hasReport ? (
                <div className="mb-4 space-y-1">
                  <p className="text-xs text-slate-500">{fileName}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays className="size-3.5" />
                    {reportDate}
                  </div>
                  {fileName ? (
                    <p className="text-[11px] text-slate-600">{fileName}</p>
                  ) : null}
                </div>
              ) : (
                <div className="mb-4 rounded-lg border border-slate-700/50 bg-slate-900/30 p-3">
                  <p className="text-xs text-slate-500">
                    {copy(
                      language,
                      "Henüz rapor üretilmedi. Önce analiz tamamlayın.",
                      "No report generated yet. Complete analysis first."
                    )}
                  </p>
                </div>
              )}

              {/* Download button */}
              {hasReport ? (
                <a
                  href={href}
                  download
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold transition-all",
                    card.btnBg,
                    card.btnText
                  )}
                >
                  <Download className="size-4" />
                  {copy(language, "İndir", "Download")}
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 text-sm font-bold text-slate-500"
                >
                  <Download className="size-4" />
                  {copy(language, "İndir", "Download")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
