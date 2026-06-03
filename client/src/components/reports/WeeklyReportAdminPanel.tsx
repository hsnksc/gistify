import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Shield, Trash2, Upload } from "lucide-react";
import type { WeeklyReportEntry, WeeklyReportRecord } from "@shared/weeklyReports";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { strategyPresentation } from "@/lib/weeklyReports";

interface WeeklyReportAdminPanelProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  adminEmail: string;
  adminAuthorized: boolean;
  adminSecret: string;
  adminBusy: boolean;
  adminError?: string;
  reports: WeeklyReportRecord[];
  selectedReportId: string;
  onSelectReport: (reportId: string) => void;
  draftReport: WeeklyReportRecord | null;
  onDraftReportChange: (report: WeeklyReportRecord) => void;
  onAdminSecretChange: (value: string) => void;
  onUnlock: () => void;
  onRefresh: () => void;
  onCreateNextWeek: () => void;
  onAddEntry: () => void;
  onRemoveEntry: (entryId: string) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function updateEntryField(
  report: WeeklyReportRecord,
  entryId: string,
  patch: Partial<WeeklyReportEntry>
) {
  return {
    ...report,
    content: {
      ...report.content,
      entries: report.content.entries.map(entry =>
        entry.id === entryId ? { ...entry, ...patch } : entry
      ),
    },
  } satisfies WeeklyReportRecord;
}

export default function WeeklyReportAdminPanel({
  open,
  onOpenChange,
  adminEmail,
  adminAuthorized,
  adminSecret,
  adminBusy,
  adminError,
  reports,
  selectedReportId,
  onSelectReport,
  draftReport,
  onDraftReportChange,
  onAdminSecretChange,
  onUnlock,
  onRefresh,
  onCreateNextWeek,
  onAddEntry,
  onRemoveEntry,
  onSaveDraft,
  onPublish,
}: WeeklyReportAdminPanelProps) {
  const [selectedEntryId, setSelectedEntryId] = useState("");

  const selectedEntry = useMemo(
    () =>
      draftReport?.content.entries.find(entry => entry.id === selectedEntryId) ||
      draftReport?.content.entries[0] ||
      null,
    [draftReport, selectedEntryId]
  );

  useEffect(() => {
    if (!draftReport?.content.entries.length) {
      setSelectedEntryId("");
      return;
    }

    if (
      !selectedEntryId ||
      !draftReport.content.entries.some(entry => entry.id === selectedEntryId)
    ) {
      setSelectedEntryId(draftReport.content.entries[0]?.id || "");
    }
  }, [draftReport, selectedEntryId]);

  const updateReportField = (
    patch:
      | Partial<WeeklyReportRecord>
      | ((current: WeeklyReportRecord) => WeeklyReportRecord)
  ) => {
    if (!draftReport) {
      return;
    }

    if (typeof patch === "function") {
      onDraftReportChange(patch(draftReport));
      return;
    }

    onDraftReportChange({ ...draftReport, ...patch });
  };

  const updateContentField = (
    patch: Partial<WeeklyReportRecord["content"]>
  ) => {
    if (!draftReport) {
      return;
    }

    onDraftReportChange({
      ...draftReport,
      content: {
        ...draftReport.content,
        ...patch,
      },
    });
  };

  const updateSelectedEntry = (patch: Partial<WeeklyReportEntry>) => {
    if (!draftReport || !selectedEntry) {
      return;
    }

    onDraftReportChange(updateEntryField(draftReport, selectedEntry.id, patch));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(1180px,calc(100vw-2rem))] gap-0 overflow-hidden border-border bg-card p-0 text-card-foreground">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="size-5 text-emerald-300" />
            Haftalik Rapor Editoru
          </DialogTitle>
          <DialogDescription>
            Bu alan haftalik earnings ve IV crush raporlarini duzenlemek ve
            yayina almak icin kullanilir.
          </DialogDescription>
        </DialogHeader>

        {!adminAuthorized ? (
          <div className="space-y-5 px-6 py-6">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-sm font-semibold text-amber-200">
                Yonetici kilidi acik degil
              </p>
              <p className="mt-1 text-sm text-amber-100/80">
                Editoru acmak icin yonetici e-postasi <strong>{adminEmail}</strong>{" "}
                icin tanimli gizli anahtari girin.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
              <Field label="Admin secret">
                <Input
                  type="password"
                  value={adminSecret}
                  onChange={event => onAdminSecretChange(event.target.value)}
                  placeholder="Coolify env icindeki REPORT_ADMIN_SECRET"
                />
              </Field>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={onUnlock}
                  disabled={adminBusy || !adminSecret.trim()}
                >
                  {adminBusy ? "Kontrol ediliyor" : "Kilidi ac"}
                </Button>
              </div>
            </div>

            {adminError ? (
              <p className="text-sm text-destructive">{adminError}</p>
            ) : null}
          </div>
        ) : (
          <div className="grid h-[80vh] min-h-[640px] grid-cols-[320px_minmax(0,1fr)]">
            <aside className="border-r border-border bg-background/60 px-5 py-5">
              <div className="flex items-center justify-between gap-2">
                <SectionLabel>Rapor Secimi</SectionLabel>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RefreshCw className="size-3.5" />
                  Yenile
                </button>
              </div>

              <div className="mt-3 space-y-3">
                <Select value={selectedReportId} onValueChange={onSelectReport}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Bir rapor sec" />
                  </SelectTrigger>
                  <SelectContent>
                    {reports.map(report => (
                      <SelectItem key={report.id} value={report.id}>
                        {report.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={onCreateNextWeek}
                >
                  <Plus className="size-4" />
                  Yeni hafta taslagi
                </Button>
              </div>

              <div className="mt-6">
                <SectionLabel>Kayitli Haftalar</SectionLabel>
                <div className="mt-3 space-y-2">
                  {reports.map(report => {
                    const style = strategyPresentation[
                      report.content.entries[0]?.strategyRating || "GOOD"
                    ];

                    return (
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
                          {report.weekStart} → {report.weekEnd}
                        </p>
                        <p
                          className={`mt-2 inline-flex rounded-full border px-2 py-1 text-xs ${style.badgeClass}`}
                        >
                          {report.content.entries.length} hisse
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div className="overflow-y-auto px-6 py-5">
              {draftReport ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <SectionLabel>Yonetici</SectionLabel>
                      <p className="mt-1 text-sm text-foreground">{adminEmail}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onSaveDraft}
                        disabled={adminBusy}
                      >
                        Kaydet
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

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Rapor basligi">
                      <Input
                        value={draftReport.title}
                        onChange={event =>
                          updateReportField({ title: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Slug">
                      <Input
                        value={draftReport.slug}
                        onChange={event =>
                          updateReportField({ slug: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Hafta baslangici">
                      <Input
                        type="date"
                        value={draftReport.weekStart}
                        onChange={event =>
                          updateReportField({ weekStart: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Hafta bitisi">
                      <Input
                        type="date"
                        value={draftReport.weekEnd}
                        onChange={event =>
                          updateReportField({ weekEnd: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Analiz tarihi">
                      <Input
                        type="datetime-local"
                        value={draftReport.analysisDate.slice(0, 16)}
                        onChange={event =>
                          updateReportField({
                            analysisDate: event.target.value
                              ? new Date(event.target.value).toISOString()
                              : draftReport.analysisDate,
                          })
                        }
                      />
                    </Field>
                    <Field label="Durum">
                      <Select
                        value={draftReport.status}
                        onValueChange={value =>
                          updateReportField({
                            status: value as WeeklyReportRecord["status"],
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
                  </div>

                  <div className="grid gap-4">
                    <Field label="Ust mesaj">
                      <Input
                        value={draftReport.content.headline}
                        onChange={event =>
                          updateContentField({ headline: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Ozet">
                      <Textarea
                        rows={4}
                        value={draftReport.content.summary}
                        onChange={event =>
                          updateContentField({ summary: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Makro baglam">
                      <Textarea
                        rows={4}
                        value={draftReport.content.marketContext}
                        onChange={event =>
                          updateContentField({
                            marketContext: event.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Uygulama notlari">
                      <Textarea
                        rows={3}
                        value={draftReport.content.executionNotes}
                        onChange={event =>
                          updateContentField({
                            executionNotes: event.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Katalizorler (her satir bir madde)">
                      <Textarea
                        rows={3}
                        value={draftReport.content.keyCatalysts.join("\n")}
                        onChange={event =>
                          updateContentField({
                            keyCatalysts: event.target.value
                              .split(/\r?\n/)
                              .map(item => item.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </Field>
                  </div>

                  <div className="space-y-4 rounded-3xl border border-border bg-background/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <SectionLabel>Hisse Editoru</SectionLabel>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Hafta icindeki ticker analizlerini buradan duzenle.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={onAddEntry}>
                          <Plus className="size-4" />
                          Hisse ekle
                        </Button>
                        {selectedEntry ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => onRemoveEntry(selectedEntry.id)}
                          >
                            <Trash2 className="size-4" />
                            Sil
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <Select
                      value={selectedEntry?.id || ""}
                      onValueChange={setSelectedEntryId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Bir ticker sec" />
                      </SelectTrigger>
                      <SelectContent>
                        {draftReport.content.entries.map(entry => (
                          <SelectItem key={entry.id} value={entry.id}>
                            {entry.ticker} · {entry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedEntry ? (
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <Field label="Ticker">
                          <Input
                            value={selectedEntry.ticker}
                            onChange={event =>
                              updateSelectedEntry({
                                ticker: event.target.value.toUpperCase(),
                              })
                            }
                          />
                        </Field>
                        <Field label="Sirket adi">
                          <Input
                            value={selectedEntry.name}
                            onChange={event =>
                              updateSelectedEntry({ name: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="Sektor">
                          <Input
                            value={selectedEntry.sector}
                            onChange={event =>
                              updateSelectedEntry({ sector: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="Earnings tarihi">
                          <Input
                            type="date"
                            value={selectedEntry.earningsDate}
                            onChange={event =>
                              updateSelectedEntry({ earningsDate: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="Earnings zamani">
                          <Select
                            value={selectedEntry.earningsTime}
                            onValueChange={value =>
                              updateSelectedEntry({
                                earningsTime: value as WeeklyReportEntry["earningsTime"],
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["AH", "AMC", "BMO", "BH"].map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field label="Yonsel bias">
                          <Select
                            value={selectedEntry.directionalBias}
                            onValueChange={value =>
                              updateSelectedEntry({
                                directionalBias:
                                  value as WeeklyReportEntry["directionalBias"],
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["Bullish", "Neutral", "Bearish"].map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field label="Strategy rating">
                          <Select
                            value={selectedEntry.strategyRating}
                            onValueChange={value =>
                              updateSelectedEntry({
                                strategyRating:
                                  value as WeeklyReportEntry["strategyRating"],
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["EXCELLENT", "GOOD", "FAIR", "POOR"].map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field label="Risk seviyesi">
                          <Select
                            value={selectedEntry.riskLevel}
                            onValueChange={value =>
                              updateSelectedEntry({
                                riskLevel: value as WeeklyReportEntry["riskLevel"],
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["LOW", "MEDIUM", "HIGH", "VERY_HIGH"].map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field label="Momentum skoru">
                          <Input
                            type="number"
                            value={selectedEntry.momentumScore}
                            onChange={event =>
                              updateSelectedEntry({
                                momentumScore: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="IV crush skoru">
                          <Input
                            type="number"
                            value={selectedEntry.ivCrushScore}
                            onChange={event =>
                              updateSelectedEntry({
                                ivCrushScore: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Expected IV crush %">
                          <Input
                            type="number"
                            value={selectedEntry.expectedIVCrush}
                            onChange={event =>
                              updateSelectedEntry({
                                expectedIVCrush: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Current IV %">
                          <Input
                            type="number"
                            value={selectedEntry.currentIV}
                            onChange={event =>
                              updateSelectedEntry({
                                currentIV: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Historical IV %">
                          <Input
                            type="number"
                            value={selectedEntry.historicalIV}
                            onChange={event =>
                              updateSelectedEntry({
                                historicalIV: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Implied move %">
                          <Input
                            type="number"
                            step="0.1"
                            value={selectedEntry.impliedMove}
                            onChange={event =>
                              updateSelectedEntry({
                                impliedMove: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Call gain %">
                          <Input
                            type="number"
                            value={selectedEntry.callGainFromIV}
                            onChange={event =>
                              updateSelectedEntry({
                                callGainFromIV: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Put gain %">
                          <Input
                            type="number"
                            value={selectedEntry.putGainFromIV}
                            onChange={event =>
                              updateSelectedEntry({
                                putGainFromIV: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Target profit %">
                          <Input
                            type="number"
                            value={selectedEntry.targetProfit}
                            onChange={event =>
                              updateSelectedEntry({
                                targetProfit: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Max loss %">
                          <Input
                            type="number"
                            value={selectedEntry.maxLoss}
                            onChange={event =>
                              updateSelectedEntry({
                                maxLoss: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Beat rate %">
                          <Input
                            type="number"
                            value={selectedEntry.beatRate}
                            onChange={event =>
                              updateSelectedEntry({
                                beatRate: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="6A fiyat degisimi %">
                          <Input
                            type="number"
                            value={selectedEntry.priceChange6M}
                            onChange={event =>
                              updateSelectedEntry({
                                priceChange6M: Number(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="RSI 14">
                          <Input
                            type="number"
                            value={selectedEntry.rsi14}
                            onChange={event =>
                              updateSelectedEntry({ rsi14: Number(event.target.value) })
                            }
                          />
                        </Field>
                        <Field label="Onerilen strateji">
                          <Input
                            value={selectedEntry.recommendedStrategy}
                            onChange={event =>
                              updateSelectedEntry({
                                recommendedStrategy: event.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Tez / analiz notu">
                          <Textarea
                            rows={4}
                            className="md:col-span-2 xl:col-span-3"
                            value={selectedEntry.thesis}
                            onChange={event =>
                              updateSelectedEntry({ thesis: event.target.value })
                            }
                          />
                        </Field>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Bu raporda duzenlenecek hisse yok.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid h-full place-items-center text-sm text-muted-foreground">
                  Duzenlenecek bir rapor secilmedi.
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
