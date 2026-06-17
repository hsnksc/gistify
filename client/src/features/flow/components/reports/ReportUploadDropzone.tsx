import { useMemo, useRef, useState } from "react";
import { FileUp, LoaderCircle, UploadCloud, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import type { UploadQueueItem } from "../../store/useReportStore";

interface ReportUploadDropzoneProps {
  language: AppLanguage;
  onFilesSelected: (files: File[]) => void;
  onQueueClear: () => void;
  uploadQueue: UploadQueueItem[];
}

export default function ReportUploadDropzone({
  language,
  onFilesSelected,
  onQueueClear,
  uploadQueue,
}: ReportUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const activeUploads = useMemo(
    () => uploadQueue.filter(item => item.status === "parsing"),
    [uploadQueue]
  );

  return (
    <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {copy(language, "HTML Yukleme", "HTML Upload")}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {copy(
              language,
              "Gunluk hisse raporlarini surukle ve kaydet",
              "Drop daily stock reports and keep them locally"
            )}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            {copy(
              language,
              "Self-contained HTML raporlar burada parse edilir, metadata cikarilir ve IndexedDB icinde ayni tarayicida saklanir.",
              "Self-contained HTML reports are parsed here, metadata is extracted and the result stays in IndexedDB inside this browser."
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
          >
            <FileUp className="size-4" />
            {copy(language, "Dosya Sec", "Choose Files")}
          </Button>
          {uploadQueue.length ? (
            <Button type="button" variant="ghost" onClick={onQueueClear}>
              {copy(language, "Kuyrugu Temizle", "Clear Queue")}
            </Button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".html,.htm,text/html"
        multiple
        className="hidden"
        onChange={event => {
          const files = Array.from(event.target.files || []);
          if (files.length) {
            onFilesSelected(files);
          }
          event.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={event => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={event => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={event => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={event => {
          event.preventDefault();
          setDragActive(false);
          const files = Array.from(event.dataTransfer.files || []);
          if (files.length) {
            onFilesSelected(files);
          }
        }}
        className={`mt-5 flex w-full flex-col items-center justify-center rounded-[1.8rem] border border-dashed px-6 py-10 text-center transition-colors ${
          dragActive
            ? "border-emerald-400/45 bg-emerald-500/10"
            : "border-border bg-background/50 hover:border-indigo-400/35 hover:bg-background/70"
        }`}
      >
        <span className="inline-flex size-14 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
          <UploadCloud className="size-6" />
        </span>
        <p className="mt-4 text-lg font-semibold text-foreground">
          {copy(
            language,
            "HTML dosyalarini buraya birak",
            "Drop HTML files here"
          )}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          {copy(
            language,
            "Coklu dosya kabul edilir. .html disindaki dosyalar nazikce atlanir. Ayni ticker + tarih gelirse uzerine yazma secenegi sunulur.",
            "Multiple files are accepted. Non-HTML files are skipped gracefully. Duplicate ticker + date uploads offer an overwrite option."
          )}
        </p>
      </button>

      {uploadQueue.length ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {uploadQueue.map(item => (
            <article
              key={item.id}
              className="rounded-[1.4rem] border border-border bg-background/55 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.fileName}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {item.ticker || copy(language, "Parse bekliyor", "Waiting for parse")}
                  </p>
                </div>
                {item.status === "parsing" ? (
                  <LoaderCircle className="size-4 animate-spin text-indigo-300" />
                ) : item.status === "error" ? (
                  <XCircle className="size-4 text-red-300" />
                ) : (
                  <FileUp className="size-4 text-emerald-300" />
                )}
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.message}
              </p>
              {item.status === "parsing" ? (
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/80">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-400/70" />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      {activeUploads.length ? (
        <p className="mt-4 text-xs text-muted-foreground">
          {copy(
            language,
            `${activeUploads.length} dosya parse ediliyor.`,
            `${activeUploads.length} file(s) are being parsed.`
          )}
        </p>
      ) : null}
    </section>
  );
}
