import { FileText, RefreshCw, Save, Upload } from "lucide-react";
import type {
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
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
  if (!adminAuthorized) {
    return (
      <div className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
        <p className="text-sm text-muted-foreground">
          Daily report publish aracini kullanmak icin once admin kilidini ac.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] border border-border bg-card/95 p-5 shadow-2xl xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto">
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
                className={`w-full rounded-2xl border px-3 py-3 text-left transition-colors ${
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
        <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
          {draftReport ? (
            <div className="space-y-4">
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
                  <Button type="button" onClick={onPublish} disabled={adminBusy}>
                    <Upload className="size-4" />
                    Yayinla
                  </Button>
                </div>
              </div>

              {adminError ? (
                <p className="text-sm text-destructive">{adminError}</p>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Baslik">
                  <Input
                    value={draftReport.title}
                    onChange={event =>
                      onDraftReportChange({
                        ...draftReport,
                        title: event.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="Rapor tarihi">
                  <Input
                    type="date"
                    value={draftReport.reportDate}
                    onChange={event =>
                      onDraftReportChange({
                        ...draftReport,
                        reportDate: event.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="Headline">
                  <Input
                    value={draftReport.content.headline}
                    onChange={event =>
                      onDraftReportChange({
                        ...draftReport,
                        content: {
                          ...draftReport.content,
                          headline: event.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="Source package">
                  <Input
                    value={draftReport.content.sourceLabel || draftReport.sourceFolder}
                    readOnly
                  />
                </Field>
              </div>

              <Field label="Executive summary">
                <Textarea
                  rows={6}
                  value={draftReport.content.executiveSummary.join("\n\n")}
                  onChange={event =>
                    onDraftReportChange({
                      ...draftReport,
                      content: {
                        ...draftReport.content,
                        executiveSummary: event.target.value
                          .split(/\n\s*\n/)
                          .map(item => item.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                />
              </Field>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Duzenlenecek daily report taslagi yok. Once bir source package secip
              taslaga donustur.
            </p>
          )}
        </section>

        {selectedSource ? (
          <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
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

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
              <Field label="OpenAI chart prompt">
                <Textarea
                  rows={5}
                  value={openAiChartPrompt}
                  onChange={event => onOpenAiChartPromptChange(event.target.value)}
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
                  disabled={openAiChartBusy || !selectedSource.figureFiles.length}
                >
                  Tum grafikleri uret
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
            sourceFolder={draftReport.sourceFolder}
            content={draftReport.content}
          />
        ) : selectedSource ? (
          <DailyReportViewer
            title={selectedSource.title}
            reportDate={selectedSource.reportDate}
            sourceFolder={selectedSource.folderName}
            content={{
              headline: selectedSource.headline,
              author: selectedSource.author,
              coverage: selectedSource.coverage,
              methodology: selectedSource.methodology,
              executiveSummary: selectedSource.executiveSummary,
              markdown: selectedSource.markdown,
              sectionFiles: selectedSource.sectionFiles,
              figureFiles: selectedSource.figureFiles,
              openAiFigureFiles: selectedSource.openAiFigureFiles,
              tickerUniverse: selectedSource.tickerUniverse,
              researchFileCount: selectedSource.researchFileCount,
              sourceKind: selectedSource.sourceKind,
              sourceLabel: selectedSource.sourceLabel,
              assetBasePath: selectedSource.assetBasePath,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
