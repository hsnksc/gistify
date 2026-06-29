import { useEffect, useState } from "react";
import { FileText, RefreshCw, Save, Upload } from "lucide-react";
import type {
  DailyReportContent,
  DailyReportRecord,
  DailyReportSourcePackage,
} from "@shared/dailyReports";
import {
  AdminField as Field,
  AdminPanel,
  AdminPanelSurface,
  AdminSectionLabel,
} from "@/components/reports/AdminPanel";
import DailyReportViewer from "@/components/reports/DailyReportViewer";
import { copy } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
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
  language: AppLanguage;
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

const DAILY_ADMIN_PANEL_CONFIG = {
  layout: "sidebar-main",
} as const;

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
  language,
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
      <AdminPanel
        config={{ layout: "single" }}
        main={
          <EmptyState
            description={copy(language, "Daily report publish aracını kullanmak için önce admin kilidini aç.", "Unlock admin access to use the daily report publishing tool.")}
            title={copy(language, "Admin kilidi kapalı", "Admin lock is closed")}
            tone="warning"
          />
        }
      />
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
        error instanceof Error ? error.message : copy(language, "Raw JSON uygulanamadı.", "Raw JSON could not be applied.")
      );
    }
  };

  return (
    <AdminPanel
      config={DAILY_ADMIN_PANEL_CONFIG}
      sidebar={
        <AdminPanelSurface
          as="aside"
          className="xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto"
        >
        <div className="flex items-center justify-between gap-2">
          <AdminSectionLabel>{copy(language, "Source Packages", "Source Packages")}</AdminSectionLabel>
          <button
            type="button"
            onClick={onRefreshSources}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RefreshCw className="size-3.5" />
            {copy(language, "Yenile", "Refresh")}
          </button>
        </div>
        <div className="mt-3 space-y-3">
          <Select value={selectedSourceId} onValueChange={onSelectSource}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={copy(language, "Bir source folder seç", "Select a source folder")} />
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
            {copy(language, "Taslaga donustur", "Convert to Draft")}
          </Button>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between gap-2">
            <AdminSectionLabel>{copy(language, "Kayıtlı Daily Reports", "Saved Daily Reports")}</AdminSectionLabel>
            <button
              type="button"
              onClick={onRefreshReports}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <RefreshCw className="size-3.5" />
              {copy(language, "Yenile", "Refresh")}
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
                    {report.status === "published" ? copy(language, "Yayınlandı", "Published") : copy(language, "Taslak", "Draft")}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {report.reportDate} · {report.sourceFolder}
                </p>
              </button>
            ))}
          </div>
        </div>
        </AdminPanelSurface>
      }
      main={
        <>
        <AdminPanelSurface>
          {draftReport ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <AdminSectionLabel tone="accent">{copy(language, "Publish", "Publish")}</AdminSectionLabel>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {copy(language, "Daily Report Editörü", "Daily Report Editor")}
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
                    {copy(language, "Draft kaydet", "Save Draft")}
                  </Button>
                  <Button
                    type="button"
                    onClick={onPublish}
                    disabled={adminBusy}
                  >
                    <Upload className="size-4" />
                    {copy(language, "Yayınla", "Publish")}
                  </Button>
                </div>
              </div>
              {adminError ? (
                <p className="text-sm text-destructive">{adminError}</p>
              ) : null}
              <div className="grid gap-4 xl:grid-cols-2">
                <AdminPanelSurface as="div" tone="muted" className="space-y-4">
                  <AdminSectionLabel tone="accent">{copy(language, "Metadata", "Metadata")}</AdminSectionLabel>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label={copy(language, "Başlık", "Title")}>
                      <Input
                        value={draftReport.title}
                        onChange={event =>
                          updateDraft({ title: event.target.value })
                        }
                      />
                    </Field>
                    <Field label={copy(language, "Slug", "Slug")}>
                      <Input
                        value={draftReport.slug}
                        onChange={event =>
                          updateDraft({ slug: event.target.value })
                        }
                      />
                    </Field>
                    <Field label={copy(language, "Rapor tarihi", "Report Date")}>
                      <Input
                        type="date"
                        value={draftReport.reportDate}
                        onChange={event =>
                          updateDraft({ reportDate: event.target.value })
                        }
                      />
                    </Field>
                    <Field label={copy(language, "Durum", "Status")}>
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
                          <SelectItem value="draft">{copy(language, "Taslak", "Draft")}</SelectItem>
                          <SelectItem value="published">{copy(language, "Yayınlandı", "Published")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label={copy(language, "Source folder", "Source Folder")}>
                      <Input
                        value={draftReport.sourceFolder}
                        onChange={event =>
                          updateDraft({ sourceFolder: event.target.value })
                        }
                      />
                    </Field>
                    <Field label={copy(language, "Author email", "Author Email")}>
                      <Input
                        value={draftReport.authorEmail}
                        onChange={event =>
                          updateDraft({ authorEmail: event.target.value })
                        }
                      />
                    </Field>
                  </div>
                </AdminPanelSurface>
                <AdminPanelSurface as="div" tone="muted" className="space-y-4">
                  <AdminSectionLabel tone="accent">{copy(language, "Narrative", "Narrative")}</AdminSectionLabel>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label={copy(language, "Headline", "Headline")}>
                      <Input
                        value={draftReport.content.headline}
                        onChange={event =>
                          updateContent({ headline: event.target.value })
                        }
                      />
                    </Field>
                    <Field label={copy(language, "Yazar", "Author")}>
                      <Input
                        value={draftReport.content.author || ""}
                        onChange={event =>
                          updateContent({ author: event.target.value })
                        }
                      />
                    </Field>
                    <Field label={copy(language, "Coverage", "Coverage")}>
                      <Input
                        value={draftReport.content.coverage || ""}
                        onChange={event =>
                          updateContent({ coverage: event.target.value })
                        }
                      />
                    </Field>
                    <Field label={copy(language, "Methodology", "Methodology")}>
                      <Input
                        value={draftReport.content.methodology || ""}
                        onChange={event =>
                          updateContent({ methodology: event.target.value })
                        }
                      />
                    </Field>
                    <Field label={copy(language, "Source kind", "Source Kind")}>
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
                          <SelectItem value="folder">{copy(language, "folder", "Folder")}</SelectItem>
                          <SelectItem value="file">{copy(language, "file", "File")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label={copy(language, "Source label", "Source Label")}>
                      <Input
                        value={draftReport.content.sourceLabel || ""}
                        onChange={event =>
                          updateContent({ sourceLabel: event.target.value })
                        }
                      />
                    </Field>
                    <Field label={copy(language, "Asset base path", "Asset Base Path")}>
                      <Input
                        value={draftReport.content.assetBasePath || ""}
                        onChange={event =>
                          updateContent({ assetBasePath: event.target.value })
                        }
                      />
                    </Field>
                    <Field label={copy(language, "Research file count", "Research File Count")}>
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
                </AdminPanelSurface>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <Field label={copy(language, "Executive summary (boş satırla ayır)", "Executive Summary (separate with blank lines)")}>
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
                <Field label={copy(language, "Ticker universe (her satır bir ticker)", "Ticker Universe (one ticker per line)")}>
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
                <Field label={copy(language, "Section files (her satır bir dosya)", "Section Files (one file per line)")}>
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
                <Field label={copy(language, "Figure files (her satır bir dosya)", "Figure Files (one file per line)")}>
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
                <Field label={copy(language, "OpenAI figure files (her satır bir dosya)", "OpenAI Figure Files (one file per line)")}>
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
              <Field label={copy(language, "Tam markdown", "Full Markdown")}>
                <Textarea
                  className="min-h-[320px]"
                  value={draftReport.content.markdown}
                  onChange={event =>
                    updateContent({ markdown: event.target.value })
                  }
                />
              </Field>
              <AdminPanelSurface as="div" tone="muted" className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <AdminSectionLabel tone="accent">{copy(language, "Advanced JSON", "Advanced JSON")}</AdminSectionLabel>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setRawDraftJson(formatJson(draftReport))}
                    >
                      {copy(language, "Güncel taslağı yükle", "Load Current Draft")}
                    </Button>
                    <Button type="button" onClick={applyRawDraftJson}>
                      {copy(language, "JSON'i uygula", "Apply JSON")}
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
                    {copy(language, "Tüm alanlara tek seferde müdahale etmek için rapor payload'ini buradan düzenle.", "Edit the report payload here to intervene on all fields at once.")}
                  </p>
                )}
              </AdminPanelSurface>
            </div>
          ) : (
            <EmptyState
              description={copy(language, "Önce bir source package seçip taslaga dönüştür.", "Select a source package and convert it to draft first.")}
              title={copy(language, "Düzenlenecek daily report taslağı yok", "No daily report draft to edit")}
            />
          )}
        </AdminPanelSurface>

        {selectedSource ? (
          <AdminPanelSurface>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <AdminSectionLabel tone="accent">{copy(language, "Source Preview", "Source Preview")}</AdminSectionLabel>
                <h3 className="mt-1 text-xl font-semibold text-foreground">
                  {selectedSource.title}
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onCreateDraftFromSource}
              >
                {copy(language, "Bu source'u kullan", "Use This Source")}
              </Button>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
              <Field label={copy(language, "OpenAI chart prompt", "OpenAI Chart Prompt")}>
                <Textarea
                  rows={5}
                  value={openAiChartPrompt}
                  onChange={event =>
                    onOpenAiChartPromptChange(event.target.value)
                  }
                  placeholder={copy(language, "Grafikleri daha okunabilir, premium ve editorial bir formatta yeniden üret.", "Regenerate charts in a more readable, premium, and editorial format.")}
                />
              </Field>
              <Field label={copy(language, "Seçili grafik", "Selected Chart")}>
                <Select
                  value={selectedOpenAiFigureFile}
                  onValueChange={onSelectOpenAiFigureFile}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={copy(language, "Grafik seç", "Select Chart")} />
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
                  {copy(language, "Seçili grafiği üret", "Generate Selected Chart")}
                </Button>
                <Button
                  type="button"
                  onClick={onGenerateAllOpenAiCharts}
                  disabled={
                    openAiChartBusy || !selectedSource.figureFiles.length
                  }
                >
                  {copy(language, "Tüm grafikleri tek tek üret", "Generate All Charts One by One")}
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>
                {copy(language, "OpenAI varyantları:", "OpenAI Variants:")} {selectedSource.openAiFigureFiles.length} /{" "}
                {selectedSource.figureFiles.length}
              </span>
              {openAiChartBusy ? <span>{copy(language, "Üretim sürüyor...", "Generation in progress...")}</span> : null}
              {openAiChartMessage ? (
                <span className="text-emerald-300">{openAiChartMessage}</span>
              ) : null}
              {openAiChartError ? (
                <span className="text-destructive">{openAiChartError}</span>
              ) : null}
            </div>
          </AdminPanelSurface>
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
        </>
      }
    />
  );
}

