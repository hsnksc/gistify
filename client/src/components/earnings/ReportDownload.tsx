import { FileText, Download, BookText, FileCode } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";

interface ReportDownloadProps {
  language: AppLanguage;
}

export default function ReportDownload({ language }: ReportDownloadProps) {
  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <FileText className="size-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">
          {copy(language, "Rapor İndir", "Download Report")}
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href="/api/earnings/download?format=md"
          download
          className="group flex items-center gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 transition-all hover:border-sky-500/30 hover:bg-slate-800/50"
        >
          <div className="flex size-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/50">
            <BookText className="size-6 text-sky-400" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white group-hover:text-sky-400">
              {copy(language, "Markdown İndir", "Download Markdown")}
            </p>
            <p className="text-xs text-slate-500">
              .md
            </p>
          </div>
          <Download className="size-5 text-slate-500 group-hover:text-sky-400" />
        </a>
        <a
          href="/api/earnings/download?format=docx"
          download
          className="group flex items-center gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 transition-all hover:border-sky-500/30 hover:bg-slate-800/50"
        >
          <div className="flex size-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/50">
            <FileCode className="size-6 text-violet-400" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white group-hover:text-violet-400">
              {copy(language, "Word İndir", "Download Word")}
            </p>
            <p className="text-xs text-slate-500">
              .docx
            </p>
          </div>
          <Download className="size-5 text-slate-500 group-hover:text-violet-400" />
        </a>
      </div>
    </section>
  );
}
