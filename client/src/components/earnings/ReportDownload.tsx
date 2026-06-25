import { FileText } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface ReportDownloadProps {
  language: AppLanguage;
}

export default function ReportDownload({ language }: ReportDownloadProps) {
  return (
    <section className="panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <FileText className="size-4 text-sky-300" />
        <h2 className="heading-condensed text-base">
          {copy(language, "Rapor İndir", "Download Report")}
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href="/api/earnings/download?format=md" download>
            {copy(language, "Markdown İndir", "Download Markdown")}
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="/api/earnings/download?format=docx" download>
            {copy(language, "Word İndir", "Download Word")}
          </a>
        </Button>
      </div>
    </section>
  );
}
