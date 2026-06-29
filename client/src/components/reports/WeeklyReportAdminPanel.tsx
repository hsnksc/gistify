import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Shield, Trash2, Upload } from "lucide-react";
import type { WeeklyReportEntry, WeeklyReportRecord } from "@shared/weeklyReports";
import {
  AdminField as Field,
  AdminPanel,
  AdminPanelSurface,
  AdminSectionLabel as SectionLabel,
} from "@/components/reports/AdminPanel";
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
import { strategyPresentation } from "@/lib/weeklyReports";
import { copy, type AppLanguage } from "@/lib/i18n";

interface WeeklyReportAdminPanelProps {
  language: AppLanguage;
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
  onLock: () => void;
  onRefresh: () => void;
  onCreateNextWeek: () => void;
  onAddEntry: () => void;
  onRemoveEntry: (entryId: string) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const WEEKLY_ADMIN_PANEL_CONFIG = {
  layout: "sidebar-main",
} as const;

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
  language,
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
  onLock,
  onRefresh,
  onCreateNextWeek,
  onAddEntry,
  onRemoveEntry,
  onSaveDraft,
  onPublish,
}: WeeklyReportAdminPanelProps) {
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [rawReportJson, setRawReportJson] = useState("");
  const [rawReportError, setRawReportError] = useState("");

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

  useEffect(() => {
    setRawReportJson(draftReport ? JSON.stringify(draftReport, null, 2) : "");
    setRawReportError("");
  }, [draftReport?.id]);

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

  const handleApplyRawJson = () => {
    if (!draftReport) {
      return;
    }

    try {
      const parsed = JSON.parse(rawReportJson) as Partial<WeeklyReportRecord>;
      const nextContent =
        parsed.content && typeof parsed.content === "object"
          ? (parsed.content as Partial<WeeklyReportRecord["content"]>)
          : {};
      const nextReport: WeeklyReportRecord = {
        ...draftReport,
        ...parsed,
        content: {
          ...draftReport.content,
          ...nextContent,
          keyCatalysts: Array.isArray(nextContent.keyCatalysts)
            ? nextContent.keyCatalysts
            : draftReport.content.keyCatalysts,
          entries: Array.isArray(nextContent.entries)
            ? nextContent.entries
            : draftReport.content.entries,
        },
      };
      onDraftReportChange(nextReport);
      setRawReportJson(JSON.stringify(nextReport, null, 2));
      setRawReportError("");
    } catch (error) {
      setRawReportError(
        error instanceof Error ? error.message : copy(language, "Raw JSON uygulanamadi.", "Raw JSON could not be applied.")
      );
    }
  };

  if (!adminAuthorized) {
    return (
      <AdminPanel
        config={{ layout: "main-preview" }}
        main={
          <AdminPanelSurface>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
              <Shield className="size-4" />
              {copy(language, "Yonetici kilidi kapali", "Admin locked")}
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                {copy(language, "Haftalik Rapor Editoru", "Weekly Report Editor")}
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {copy(language, "Bu alan haftalik earnings ve IV crush raporlarini duzenlemek, yeni haftalar olusturmak ve yayina almak icin kullanilir. Devam etmek icin", "This area is used to edit weekly earnings and IV crush reports, create new weeks, and publish them. To continue")}{" "}
                <strong>{adminEmail}</strong>{" "}
                {copy(language, "hesabina ait gizli anahtari gir.", "enter the secret key associated with the account.")}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
              <Field label={copy(language, "Admin sifresi", "Admin secret")}>
                <Input
                  type="password"
                  value={adminSecret}
                  onChange={event => onAdminSecretChange(event.target.value)}
                  placeholder={copy(language, "Coolify env icindeki REPORT_ADMIN_SECRET", "REPORT_ADMIN_SECRET in Coolify env")}
                />
              </Field>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={onUnlock}
                  disabled={adminBusy || !adminSecret.trim()}
                >
                  {adminBusy ? copy(language, "Kontrol ediliyor", "Checking") : copy(language, "Kilidi ac", "Unlock")}
                </Button>
              </div>
            </div>

            {adminError ? (
              <p className="text-sm text-destructive">{adminError}</p>
            ) : null}
          </AdminPanelSurface>
        }
        preview={
          <AdminPanelSurface as="div" tone="muted" className="p-6">
            <SectionLabel>{copy(language, "Bu sayfada neler var", "What's on this page")}</SectionLabel>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>{copy(language, "Yeni haftalik taslak olusturma", "Create new weekly draft")}</p>
              <p>{copy(language, "Ticker bazli earnings ve IV crush duzenleme", "Edit ticker-based earnings and IV crush")}</p>
              <p>{copy(language, "Draft kaydetme ve publish etme", "Save draft and publish")}</p>
              <p>{copy(language, "Published raporlardan projection senkronu", "Projection sync from published reports")}</p>
            </div>
          </AdminPanelSurface>
        }
      />
    );
  }

  return (
    <AdminPanel
      config={WEEKLY_ADMIN_PANEL_CONFIG}
      sidebar={
        <AdminPanelSurface
          as="aside"
          className="xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto"
        >
        <div className="flex items-center justify-between gap-2">
          <SectionLabel>{copy(language, "Rapor Secimi", "Report Selection")}</SectionLabel>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RefreshCw className="size-3.5" />
            {copy(language, "Yenile", "Refresh")}
          </button>
        </div>

        <div className="mt-3 space-y-3">
          <Select value={selectedReportId} onValueChange={onSelectReport}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={copy(language, "Bir rapor sec", "Select a report")} />
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
            {copy(language, "Yeni hafta taslagi", "New week draft")}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={onLock}
          >
            <Shield className="size-4" />
            {copy(language, "Kilidi kapat", "Lock")}
          </Button>
        </div>

        <div className="mt-6">
          <SectionLabel>{copy(language, "Kayitli Haftalar", "Saved Weeks")}</SectionLabel>
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
                      {report.status === "published"
                        ? copy(language, "Yayinda", "Published")
                        : copy(language, "Taslak", "Draft")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {report.weekStart} → {report.weekEnd}
                  </p>
                  <p
                    className={`mt-2 inline-flex rounded-full border px-2 py-1 text-xs ${style.badgeClass}`}
                  >
                    {report.content.entries.length} {copy(language, "hisse", "stocks")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
        </AdminPanelSurface>
      }
      main={
        <AdminPanelSurface as="div">

        {draftReport ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <SectionLabel>{copy(language, "Yonetici", "Admin")}</SectionLabel>
                <p className="mt-1 text-sm text-foreground">{adminEmail}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSaveDraft}
                  disabled={adminBusy}
                >
                  {copy(language, "Kaydet", "Save")}
                </Button>
                <Button
                  type="button"
                  onClick={onPublish}
                  disabled={adminBusy}
                >
                  <Upload className="size-4" />
                  {copy(language, "Yayinla", "Publish")}
                </Button>
              </div>
            </div>

            {adminError ? (
              <p className="text-sm text-destructive">{adminError}</p>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <Field label={copy(language, "Rapor basligi", "Report Title")}>
                <Input
                  value={draftReport.title}
                  onChange={event =>
                    updateReportField({ title: event.target.value })
                  }
                />
              </Field>
              <Field label={copy(language, "Slug", "Slug")}>
                <Input
                  value={draftReport.slug}
                  onChange={event =>
                    updateReportField({ slug: event.target.value })
                  }
                />
              </Field>
              <Field label={copy(language, "Hafta baslangici", "Week Start")}>
                <Input
                  type="date"
                  value={draftReport.weekStart}
                  onChange={event =>
                    updateReportField({ weekStart: event.target.value })
                  }
                />
              </Field>
              <Field label={copy(language, "Hafta bitisi", "Week End")}>
                <Input
                  type="date"
                  value={draftReport.weekEnd}
                  onChange={event =>
                    updateReportField({ weekEnd: event.target.value })
                  }
                />
              </Field>
              <Field label={copy(language, "Analiz tarihi", "Analysis Date")}>
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
              <Field label={copy(language, "Durum", "Status")}>
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
                    <SelectItem value="draft">{copy(language, "Taslak", "Draft")}</SelectItem>
                    <SelectItem value="published">{copy(language, "Yayinda", "Published")}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4">
              <Field label={copy(language, "Ust mesaj", "Headline")}>
                <Input
                  value={draftReport.content.headline}
                  onChange={event =>
                    updateContentField({ headline: event.target.value })
                  }
                />
              </Field>
              <Field label={copy(language, "Ozet", "Summary")}>
                <Textarea
                  rows={4}
                  value={draftReport.content.summary}
                  onChange={event =>
                    updateContentField({ summary: event.target.value })
                  }
                />
              </Field>
              <Field label={copy(language, "Makro baglam", "Macro Context")}>
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
              <Field label={copy(language, "Uygulama notlari", "Execution Notes")}>
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
              <Field label={copy(language, "Katalizorler (her satir bir madde)", "Catalysts (one per line)")}>
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

            <AdminPanelSurface as="div" tone="muted" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <SectionLabel>{copy(language, "Hisse Editoru", "Stock Editor")}</SectionLabel>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {copy(language, "Hafta icindeki ticker analizlerini buradan duzenle.", "Edit weekly ticker analyses here.")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={onAddEntry}>
                    <Plus className="size-4" />
                    {copy(language, "Hisse ekle", "Add Stock")}
                  </Button>
                  {selectedEntry ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onRemoveEntry(selectedEntry.id)}
                    >
                      <Trash2 className="size-4" />
                      {copy(language, "Sil", "Delete")}
                    </Button>
                  ) : null}
                </div>
              </div>

              <Select
                value={selectedEntry?.id || ""}
                onValueChange={setSelectedEntryId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={copy(language, "Bir ticker sec", "Select a ticker")} />
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
                  <Field label={copy(language, "Ticker", "Ticker")}>
                    <Input
                      value={selectedEntry.ticker}
                      onChange={event =>
                        updateSelectedEntry({
                          ticker: event.target.value.toUpperCase(),
                        })
                      }
                    />
                  </Field>
                  <Field label={copy(language, "Sirket adi", "Company Name")}>
                    <Input
                      value={selectedEntry.name}
                      onChange={event =>
                        updateSelectedEntry({ name: event.target.value })
                      }
                    />
                  </Field>
                  <Field label={copy(language, "Sektor", "Sector")}>
                    <Input
                      value={selectedEntry.sector}
                      onChange={event =>
                        updateSelectedEntry({ sector: event.target.value })
                      }
                    />
                  </Field>
                  <Field label={copy(language, "Earnings tarihi", "Earnings Date")}>
                    <Input
                      type="date"
                      value={selectedEntry.earningsDate}
                      onChange={event =>
                        updateSelectedEntry({ earningsDate: event.target.value })
                      }
                    />
                  </Field>
                  <Field label={copy(language, "Earnings zamani", "Earnings Time")}>
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
                            {option === "AH"
                              ? copy(language, "Kapanis Sonrasi", "After Hours")
                              : option === "AMC"
                              ? copy(language, "Kapanis Sonrasi (AMC)", "After Market Close")
                              : option === "BMO"
                              ? copy(language, "Acilis Oncesi", "Before Market Open")
                              : copy(language, "Is Saatleri", "Business Hours")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={copy(language, "Yonsel bias", "Directional Bias")}>
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
                            {option === "Bullish"
                              ? copy(language, "Yukari Yonlu", "Bullish")
                              : option === "Neutral"
                              ? copy(language, "Notr", "Neutral")
                              : copy(language, "Asagi Yonlu", "Bearish")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={copy(language, "Strategy rating", "Strategy Rating")}>
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
                            {option === "EXCELLENT"
                              ? copy(language, "Mukemmel", "Excellent")
                              : option === "GOOD"
                              ? copy(language, "Iyi", "Good")
                              : option === "FAIR"
                              ? copy(language, "Orta", "Fair")
                              : copy(language, "Zayif", "Poor")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={copy(language, "Risk seviyesi", "Risk Level")}>
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
                            {option === "LOW"
                              ? copy(language, "Dusuk", "Low")
                              : option === "MEDIUM"
                              ? copy(language, "Orta", "Medium")
                              : option === "HIGH"
                              ? copy(language, "Yuksek", "High")
                              : copy(language, "Cok Yuksek", "Very High")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={copy(language, "Momentum skoru", "Momentum Score")}>
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
                  <Field label={copy(language, "IV crush skoru", "IV Crush Score")}>
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
                  <Field label={copy(language, "Expected IV crush %", "Expected IV Crush %")}>
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
                  <Field label={copy(language, "Current IV %", "Current IV %")}>
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
                  <Field label={copy(language, "Historical IV %", "Historical IV %")}>
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
                  <Field label={copy(language, "Implied move %", "Implied Move %")}>
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
                  <Field label={copy(language, "Call gain %", "Call Gain %")}>
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
                  <Field label={copy(language, "Put gain %", "Put Gain %")}>
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
                  <Field label={copy(language, "Target profit %", "Target Profit %")}>
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
                  <Field label={copy(language, "Max loss %", "Max Loss %")}>
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
                  <Field label={copy(language, "Beat rate %", "Beat Rate %")}>
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
                  <Field label={copy(language, "6A fiyat degisimi %", "6M Price Change %")}>
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
                  <Field label={copy(language, "RSI 14", "RSI 14")}>
                    <Input
                      type="number"
                      value={selectedEntry.rsi14}
                      onChange={event =>
                        updateSelectedEntry({ rsi14: Number(event.target.value) })
                      }
                    />
                  </Field>
                  <Field label={copy(language, "Onerilen strateji", "Recommended Strategy")}>
                    <Input
                      value={selectedEntry.recommendedStrategy}
                      onChange={event =>
                        updateSelectedEntry({
                          recommendedStrategy: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label={copy(language, "Tez / analiz notu", "Thesis / Analysis Note")}>
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
                <EmptyState
                  description={copy(language, "Bu raporda duzenlenecek hisse yok.", "No stocks to edit in this report.")}
                  title={copy(language, "Secili entry bulunamadi", "No entry selected")}
                />
              )}
            </AdminPanelSurface>

            <AdminPanelSurface as="div" tone="muted" className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <SectionLabel>{copy(language, "Advanced JSON", "Advanced JSON")}</SectionLabel>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {copy(language, "Tum weekly report payload'ina tek editorle mudahale et.", "Intervene in the entire weekly report payload with a single editor.")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setRawReportJson(JSON.stringify(draftReport, null, 2))
                    }
                  >
                    {copy(language, "Guncel taslagi yukle", "Load current draft")}
                  </Button>
                  <Button type="button" onClick={handleApplyRawJson}>
                    {copy(language, "JSON'i uygula", "Apply JSON")}
                  </Button>
                </div>
              </div>

              <Textarea
                className="min-h-[260px] font-mono text-xs"
                value={rawReportJson}
                onChange={event => setRawReportJson(event.target.value)}
              />

              {rawReportError ? (
                <p className="text-sm text-destructive">{rawReportError}</p>
              ) : null}
            </AdminPanelSurface>
          </div>
        ) : (
          <EmptyState
            className="grid min-h-[560px] place-items-center"
            description={copy(language, "Kayitli haftalardan birini sec veya yeni hafta taslagi olustur.", "Select a saved week or create a new week draft.")}
            title={copy(language, "Duzenlenecek bir rapor secilmedi", "No report selected to edit")}
          />
        )}
        </AdminPanelSurface>
      }
    />
  );
}
