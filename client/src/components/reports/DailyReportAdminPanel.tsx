import { type ReactNode, useEffect, useState } from "react";
import { FileText, RefreshCw, Save, Upload } from "lucide-react";
import type {
  DailyReportContent,
  DailyReportRecord,
  DailyReportSourcePackage,
} from "@shared/dailyReports";
import DailyReportViewer from "@/components/reports/DailyReportViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface DailyReportAdminPanelProps {
  adminAuthorized: boolean;
  adminBusy: boolean;
  adminError?: string;
  sources: DailyReportSourcePackage[];
  selectedSourceId: string;
  selectedSource: DailyReportSourcePackage | null;
  onSelectSource: (sourceId: string) => void;
  onRefreshSources: () => void;
  onCreateDraftFromSource: () => void;
  openAiChartBusy: boolean;
  openAiChartError?: string;
  openAiChartMessage?: string;
  openAiChartPrompt: string;
  selectedOpenAiFigureFile: string;
  onOpenAiChartPromptChange: (prompt: string) => void;
  onSelectOpenAiFigureFile: (fileName: string) => void;
  onGenerateSelectedOpenAiChart: () => void;
  onGenerateAllOpenAiCharts: () => void;
  reports: DailyReportRecord[];
  selectedReportId: string;
  draftReport: DailyReportRecord | null;
  onSelectReport: (reportId: string) => void;
  onDraftReportChange: (report: DailyReportRecord) => void;
  onRefreshReports: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const parseLineList = (value: string) =>
  value
    .split(/\r?\n/)
    .map(item => item.trim())
    .filter(Boolean);
const parseParagraphList = (value: string) =>
  value
    .split(/\n\s*\n/)
    .map(item => item.trim())
    .filter(Boolean);
const formatJson = (value: unknown) => JSON.stringify(value, null, 2);
const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);
const normalizeStringArray = (value: unknown, fallback: string[]) =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map(item => item.trim())
        .filter(Boolean)
    : fallback;
const normalizeMetadataItems = (
  value: unknown,
  fallback: NonNullable<DailyReportContent["metadataItems"]>
) =>
  Array.isArray(value)
    ? value
        .filter(
          (item): item is { label?: unknown; value?: unknown } =>
            Boolean(item) && typeof item === "object"
        )
        .map(item => ({
          label: typeof item.label === "string" ? item.label.trim() : "",
          value: typeof item.value === "string" ? item.value.trim() : "",
        }))
        .filter(item => item.label && item.value)
    : fallback;

function mergeContent(
  current: DailyReportContent,
  patch: Partial<DailyReportContent>
): DailyReportContent {
  return { ...current, ...patch };
}

function hydrateDailyReportFromRaw(
  current: DailyReportRecord,
  rawValue: unknown
): DailyReportRecord {
  if (!isRecord(rawValue)) {
    throw new Error("JSON koku obje olmali.");
  }

  const rawContent = isRecord(rawValue.content) ? rawValue.content : {};
  return {
    ...current,
    ...rawValue,
    id: typeof rawValue.id === "string" ? rawValue.id : current.id,
    slug: typeof rawValue.slug === "string" ? rawValue.slug : current.slug,
    title: typeof rawValue.title === "string" ? rawValue.title : current.title,
    reportDate:
      typeof rawValue.reportDate === "string"
        ? rawValue.reportDate
        : current.reportDate,
    status:
      rawValue.status === "draft" || rawValue.status === "published"
        ? rawValue.status
        : current.status,
    authorEmail:
      typeof rawValue.authorEmail === "string"
        ? rawValue.authorEmail
        : current.authorEmail,
    sourceFolder:
      typeof rawValue.sourceFolder === "string"
        ? rawValue.sourceFolder
        : current.sourceFolder,
    content: {
      ...current.content,
      ...rawContent,
      executiveSummary: normalizeStringArray(
        rawContent.executiveSummary,
        current.content.executiveSummary
      ),
      sectionFiles: normalizeStringArray(
        rawContent.sectionFiles,
        current.content.sectionFiles
      ),
      figureFiles: normalizeStringArray(
        rawContent.figureFiles,
        current.content.figureFiles
      ),
      openAiFigureFiles: normalizeStringArray(
        rawContent.openAiFigureFiles,
        current.content.openAiFigureFiles
      ),
      tickerUniverse: normalizeStringArray(
        rawContent.tickerUniverse,
        current.content.tickerUniverse
      ),
      metadataItems: normalizeMetadataItems(
        rawContent.metadataItems,
        current.content.metadataItems || []
      ),
    },
  };
}

export default function DailyReportAdminPanel({
  adminAuthorized,
  adminBusy,
  adminError,
  sources,
  selectedSourceId,
  selectedSource,
  onSelectSource,
  onRefreshSources,
  onCreateDraftFromSource,
  openAiChartBusy,
  openAiChartError,
  openAiChartMessage,
  openAiChartPrompt,
  selectedOpenAiFigureFile,
  onOpenAiChartPromptChange,
  onSelectOpenAiFigureFile,
  onGenerateSelectedOpenAiChart,
  onGenerateAllOpenAiCharts,
  reports,
  selectedReportId,
  draftReport,
  onSelectReport,
  onDraftReportChange,
  onRefreshReports,
  onSaveDraft,
  onPublish,
}: DailyReportAdminPanelProps) {
  const [rawDraftJson, setRawDraftJson] = useState("");
  const [rawDraftJsonError, setRawDraftJsonError] = useState("");

  useEffect(() => {
    setRawDraftJson(draftReport ? formatJson(draftReport) : "");
    setRawDraftJsonError("");
  }, [draftReport?.id]);

  if (!adminAuthorized) {
    return (
      <div className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
        <p className="text-sm text-muted-foreground">
          Daily report publish aracini kullanmak icin once admin kilidini ac.
        </p>
      </div>
    );
  }

  const updateDraft = (
    patch:
      | Partial<DailyReportRecord>
      | ((current: DailyReportRecord) => DailyReportRecord)
  ) => {
    if (!draftReport) {
      return;
    }
    onDraftReportChange(
      typeof patch === "function"
        ? patch(draftReport)
        : { ...draftReport, ...patch }
    );
  };

  const updateContent = (patch: Partial<DailyReportContent>) => {
    if (!draftReport) {
      return;
    }
    onDraftReportChange({
      ...draftReport,
      content: mergeContent(draftReport.content, patch),
    });
  };

  const applyRawDraftJson = () => {
    if (!draftReport) {
      return;
    }
    try {
      const nextDraft = hydrateDailyReportFromRaw(
        draftReport,
        JSON.parse(rawDraftJson)
      );
      onDraftReportChange(nextDraft);
      setRawDraftJson(formatJson(nextDraft));
      setRawDraftJsonError("");
    } catch (error) {
      setRawDraftJsonError(
        error instanceof Error ? error.message : "Raw JSON uygulanamadi."
      );
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Source Packages
          </p>
          <button
            type="button"
            onClick={onRefreshSources}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RefreshCw className="size-3.5" />
            Yenile
          </button>
        </div>
        <div className="mt-3 space-y-3">
          <Select value={selectedSourceId} onValueChange={onSelectSource}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Bir source folder sec" />
            </SelectTrigger>
            <SelectContent>
              {sources.map(source => (
                <SelectItem key={source.id} value={source.id}>
                  {source.sourceLabel} · {source.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            className="w-full justify-start"
            onClick={onCreateDraftFromSource}
            disabled={!selectedSource}
          >
            <FileText className="size-4" />
            Taslaga donustur
          </Button>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Kayitli Daily Reports
            </p>
            <button
              type="button"
              onClick={onRefreshReports}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <RefreshCw className="size-3.5" />
              Yenile
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {reports.map(report => (
              <button
                key={report.id}
                type="button"
                onClick={() => onSelectReport(report.id)}
                className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                  report.id === selectedReportId
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-border bg-card/80 hover:bg-card"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {report.title}
                  </p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      report.status === "published"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {report.reportDate} · {report.sourceFolder}
                </p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="space-y-6">
        <section className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
          {draftReport ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Publish
                  </p>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    Daily Report Editoru
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onSaveDraft}
                    disabled={adminBusy}
                  >
                    <Save className="size-4" />
                    Draft kaydet
                  </Button>
                  <Button
                    type="button"
                    onClick={onPublish}
                    disabled={adminBusy}
                  >
                    <Upload className="size-4" />
                    Yayinla
                  </Button>
                </div>
              </div>
              {adminError ? (
                <p className="text-sm text-destructive">{adminError}</p>
              ) : null}
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="space-y-4 rounded-xl border border-border bg-background/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Metadata
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Baslik">
                      <Input
                        value={draftReport.title}
                        onChange={event =>
                          updateDraft({ title: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Slug">
                      <Input
                        value={draftReport.slug}
                        onChange={event =>
                          updateDraft({ slug: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Rapor tarihi">
                      <Input
                        type="date"
                        value={draftReport.reportDate}
                        onChange={event =>
                          updateDraft({ reportDate: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Durum">
                      <Select
                        value={draftReport.status}
                        onValueChange={value =>
                          updateDraft({
                            status: value as DailyReportRecord["status"],
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">draft</SelectItem>
                          <SelectItem value="published">published</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Source folder">
                      <Input
                        value={draftReport.sourceFolder}
                        onChange={event =>
                          updateDraft({ sourceFolder: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Author email">
                      <Input
                        value={draftReport.authorEmail}
                        onChange={event =>
                          updateDraft({ authorEmail: event.target.value })
                        }
                      />
                    </Field>
                  </div>
                </div>
                <div className="space-y-4 rounded-xl border border-border bg-background/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Narrative
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Headline">
                      <Input
                        value={draftReport.content.headline}
                        onChange={event =>
                          updateContent({ headline: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Yazar">
                      <Input
                        value={draftReport.content.author || ""}
                        onChange={event =>
                          updateContent({ author: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Coverage">
                      <Input
                        value={draftReport.content.coverage || ""}
                        onChange={event =>
                          updateContent({ coverage: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Methodology">
                      <Input
                        value={draftReport.content.methodology || ""}
                        onChange={event =>
                          updateContent({ methodology: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Source kind">
                      <Select
                        value={draftReport.content.sourceKind || "folder"}
                        onValueChange={value =>
                          updateContent({
                            sourceKind:
                              value as DailyReportContent["sourceKind"],
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="folder">folder</SelectItem>
                          <SelectItem value="file">file</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Source label">
                      <Input
                        value={draftReport.content.sourceLabel || ""}
                        onChange={event =>
                          updateContent({ sourceLabel: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Asset base path">
                      <Input
                        value={draftReport.content.assetBasePath || ""}
                        onChange={event =>
                          updateContent({ assetBasePath: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Research file count">
                      <Input
                        type="number"
                        value={draftReport.content.researchFileCount}
                        onChange={event =>
                          updateContent({
                            researchFileCount: Number(event.target.value) || 0,
                          })
                        }
                      />
                    </Field>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <Field label="Executive summary (bos satirla ayir)">
                  <Textarea
                    rows={8}
                    value={draftReport.content.executiveSummary.join("\n\n")}
                    onChange={event =>
                      updateContent({
                        executiveSummary: parseParagraphList(
                          event.target.value
                        ),
                      })
                    }
                  />
                </Field>
                <Field label="Ticker universe (her satir bir ticker)">
                  <Textarea
                    rows={8}
                    value={draftReport.content.tickerUniverse.join("\n")}
                    onChange={event =>
                      updateContent({
                        tickerUniverse: parseLineList(event.target.value),
                      })
                    }
                  />
                </Field>
                <Field label="Section files (her satir bir dosya)">
                  <Textarea
                    rows={6}
                    value={draftReport.content.sectionFiles.join("\n")}
                    onChange={event =>
                      updateContent({
                        sectionFiles: parseLineList(event.target.value),
                      })
                    }
                  />
                </Field>
                <Field label="Figure files (her satir bir dosya)">
                  <Textarea
                    rows={6}
                    value={draftReport.content.figureFiles.join("\n")}
                    onChange={event =>
                      updateContent({
                        figureFiles: parseLineList(event.target.value),
                      })
                    }
                  />
                </Field>
                <Field label="OpenAI figure files (her satir bir dosya)">
                  <Textarea
                    rows={6}
                    value={draftReport.content.openAiFigureFiles.join("\n")}
                    onChange={event =>
                      updateContent({
                        openAiFigureFiles: parseLineList(event.target.value),
                      })
                    }
                  />
                </Field>
              </div>
              <Field label="Tam markdown">
                <Textarea
                  className="min-h-[320px]"
                  value={draftReport.content.markdown}
                  onChange={event =>
                    updateContent({ markdown: event.target.value })
                  }
                />
              </Field>
              <div className="space-y-3 rounded-xl border border-border bg-background/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Advanced JSON
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setRawDraftJson(formatJson(draftReport))}
                    >
                      Guncel taslagi yukle
                    </Button>
                    <Button type="button" onClick={applyRawDraftJson}>
                      JSON'i uygula
                    </Button>
                  </div>
                </div>
                <Textarea
                  className="min-h-[280px] font-mono text-xs"
                  value={rawDraftJson}
                  onChange={event => setRawDraftJson(event.target.value)}
                />
                {rawDraftJsonError ? (
                  <p className="text-sm text-destructive">
                    {rawDraftJsonError}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Tum alanlara tek seferde mudahale etmek icin rapor
                    payload'ini buradan duzenle.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Duzenlenecek daily report taslagi yok. Once bir source package
              secip taslaga donustur.
            </p>
          )}
        </section>

        {selectedSource ? (
          <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Source Preview
                </p>
                <h3 className="mt-1 text-xl font-semibold text-foreground">
                  {selectedSource.title}
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onCreateDraftFromSource}
              >
                Bu source'u kullan
              </Button>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
              <Field label="OpenAI chart prompt">
                <Textarea
                  rows={5}
                  value={openAiChartPrompt}
                  onChange={event =>
                    onOpenAiChartPromptChange(event.target.value)
                  }
                  placeholder="Grafikleri daha okunabilir, premium ve editorial bir formatta yeniden uret."
                />
              </Field>
              <Field label="Secili grafik">
                <Select
                  value={selectedOpenAiFigureFile}
                  onValueChange={onSelectOpenAiFigureFile}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Grafik sec" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSource.figureFiles.map(fileName => (
                      <SelectItem key={fileName} value={fileName}>
                        {fileName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex flex-col gap-2 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onGenerateSelectedOpenAiChart}
                  disabled={
                    openAiChartBusy ||
                    !selectedSource.figureFiles.length ||
                    !selectedOpenAiFigureFile
                  }
                >
                  Secili grafigi uret
                </Button>
                <Button
                  type="button"
                  onClick={onGenerateAllOpenAiCharts}
                  disabled={
                    openAiChartBusy || !selectedSource.figureFiles.length
                  }
                >
                  Tum grafikleri tek tek uret
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>
                OpenAI varyantlari: {selectedSource.openAiFigureFiles.length} /{" "}
                {selectedSource.figureFiles.length}
              </span>
              {openAiChartBusy ? <span>Uretim suruyor...</span> : null}
              {openAiChartMessage ? (
                <span className="text-emerald-300">{openAiChartMessage}</span>
              ) : null}
              {openAiChartError ? (
                <span className="text-destructive">{openAiChartError}</span>
              ) : null}
            </div>
          </section>
        ) : null}

        {draftReport ? (
          <DailyReportViewer
            title={draftReport.title}
            reportDate={draftReport.reportDate}
            updatedAt={draftReport.updatedAt}
            sourceFolder={draftReport.sourceFolder}
            content={draftReport.content}
          />
        ) : selectedSource ? (
          <DailyReportViewer
            title={selectedSource.title}
            reportDate={selectedSource.reportDate}
            updatedAt={selectedSource.updatedAt}
            sourceFolder={selectedSource.folderName}
            content={{
              headline: selectedSource.headline,
              author: selectedSource.author,
              coverage: selectedSource.coverage,
              methodology: selectedSource.methodology,
              metadataItems: selectedSource.metadataItems,
              executiveSummary: selectedSource.executiveSummary,
              markdown: selectedSource.markdown,
              html: selectedSource.html,
              sectionFiles: selectedSource.sectionFiles,
              figureFiles: selectedSource.figureFiles,
              openAiFigureFiles: selectedSource.openAiFigureFiles,
              tickerUniverse: selectedSource.tickerUniverse,
              researchFileCount: selectedSource.researchFileCount,
              sourceKind: selectedSource.sourceKind,
              contentFormat: selectedSource.contentFormat,
              sourceLabel: selectedSource.sourceLabel,
              assetBasePath: selectedSource.assetBasePath,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

