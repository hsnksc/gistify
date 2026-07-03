import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Shield, Trash2, Upload } from "lucide-react";
import type { WeeklyReportEntry, WeeklyReportRecord } from "@shared/weeklyReports";
import {
  AdminField as Field, AdminPanel, AdminPanelSurface, AdminSectionLabel as SectionLabel, } from "@/components/reports/AdminPanel";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { strategyPresentation } from "@/lib/weeklyReports";
import { type AppLanguage, t } from "@/lib/i18n";

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
        error instanceof Error ? error.message : t("flow:rawJsonCouldNotBed679")
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
              {t("flow:adminLocked")}
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                {t("flow:weeklyReportEditor")}
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {t("flow:thisAreaIsUsedTo")}{" "}
                <strong>{adminEmail}</strong>{" "}
                {t("flow:enterTheSecretKeyAssociated")}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
              <Field label={t("flow:adminSecret")}>
                <Input
                  type="password"
                  value={adminSecret}
                  onChange={event => onAdminSecretChange(event.target.value)}
                  placeholder={t("flow:reportAdminSecretInCoolify")}
                />
              </Field>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={onUnlock}
                  disabled={adminBusy || !adminSecret.trim()}
                >
                  {adminBusy ? t("flow:checking") : t("flow:unlock")}
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
            <SectionLabel>{t("flow:whatSOnThisPage")}</SectionLabel>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>{t("flow:createNewWeeklyDraft")}</p>
              <p>{t("flow:editTickerBasedEarningsAnd")}</p>
              <p>{t("flow:saveDraftAndPublish")}</p>
              <p>{t("flow:projectionSyncFromPublishedReports")}</p>
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
          <SectionLabel>{t("flow:reportSelection")}</SectionLabel>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RefreshCw className="size-3.5" />
            {t("common:refresh")}
          </button>
        </div>

        <div className="mt-3 space-y-3">
          <Select value={selectedReportId} onValueChange={onSelectReport}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("flow:selectAReport")} />
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
            {t("flow:newWeekDraft")}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={onLock}
          >
            <Shield className="size-4" />
            {t("flow:lock")}
          </Button>
        </div>

        <div className="mt-6">
          <SectionLabel>{t("flow:savedWeeks")}</SectionLabel>
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
                        ? t("flow:published2a74")
                        : t("flow:draft")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {report.weekStart} → {report.weekEnd}
                  </p>
                  <p
                    className={`mt-2 inline-flex rounded-full border px-2 py-1 text-xs ${style.badgeClass}`}
                  >
                    {report.content.entries.length} {t("scanner:popMaxProfitRR")}
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
                <SectionLabel>{t("flow:admin")}</SectionLabel>
                <p className="mt-1 text-sm text-foreground">{adminEmail}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSaveDraft}
                  disabled={adminBusy}
                >
                  {t("flow:save")}
                </Button>
                <Button
                  type="button"
                  onClick={onPublish}
                  disabled={adminBusy}
                >
                  <Upload className="size-4" />
                  {t("flow:publish0047")}
                </Button>
              </div>
            </div>

            {adminError ? (
              <p className="text-sm text-destructive">{adminError}</p>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t("flow:reportTitle")}>
                <Input
                  value={draftReport.title}
                  onChange={event =>
                    updateReportField({ title: event.target.value })
                  }
                />
              </Field>
              <Field label={"Slug"}>
                <Input
                  value={draftReport.slug}
                  onChange={event =>
                    updateReportField({ slug: event.target.value })
                  }
                />
              </Field>
              <Field label={t("flow:weekStart")}>
                <Input
                  type="date"
                  value={draftReport.weekStart}
                  onChange={event =>
                    updateReportField({ weekStart: event.target.value })
                  }
                />
              </Field>
              <Field label={t("flow:weekEnd")}>
                <Input
                  type="date"
                  value={draftReport.weekEnd}
                  onChange={event =>
                    updateReportField({ weekEnd: event.target.value })
                  }
                />
              </Field>
              <Field label={t("flow:analysisDate")}>
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
              <Field label={t("common:status")}>
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
                    <SelectItem value="draft">{t("flow:draft")}</SelectItem>
                    <SelectItem value="published">{t("flow:published2a74")}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4">
              <Field label={t("flow:headline")}>
                <Input
                  value={draftReport.content.headline}
                  onChange={event =>
                    updateContentField({ headline: event.target.value })
                  }
                />
              </Field>
              <Field label={t("flow:summary")}>
                <Textarea
                  rows={4}
                  value={draftReport.content.summary}
                  onChange={event =>
                    updateContentField({ summary: event.target.value })
                  }
                />
              </Field>
              <Field label={t("flow:macroContext")}>
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
              <Field label={t("flow:executionNotes7122")}>
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
              <Field label={t("flow:catalystsOnePerLine")}>
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
                  <SectionLabel>{t("flow:stockEditor")}</SectionLabel>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("flow:editWeeklyTickerAnalysesHere")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={onAddEntry}>
                    <Plus className="size-4" />
                    {t("flow:addStock")}
                  </Button>
                  {selectedEntry ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onRemoveEntry(selectedEntry.id)}
                    >
                      <Trash2 className="size-4" />
                      {t("flow:delete")}
                    </Button>
                  ) : null}
                </div>
              </div>

              <Select
                value={selectedEntry?.id || ""}
                onValueChange={setSelectedEntryId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("flow:selectATicker")} />
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
                  <Field label={"Ticker"}>
                    <Input
                      value={selectedEntry.ticker}
                      onChange={event =>
                        updateSelectedEntry({
                          ticker: event.target.value.toUpperCase(),
                        })
                      }
                    />
                  </Field>
                  <Field label={t("flow:companyName")}>
                    <Input
                      value={selectedEntry.name}
                      onChange={event =>
                        updateSelectedEntry({ name: event.target.value })
                      }
                    />
                  </Field>
                  <Field label={t("common:sectorc5c4")}>
                    <Input
                      value={selectedEntry.sector}
                      onChange={event =>
                        updateSelectedEntry({ sector: event.target.value })
                      }
                    />
                  </Field>
                  <Field label={t("flow:earningsDate")}>
                    <Input
                      type="date"
                      value={selectedEntry.earningsDate}
                      onChange={event =>
                        updateSelectedEntry({ earningsDate: event.target.value })
                      }
                    />
                  </Field>
                  <Field label={t("flow:earningsTime")}>
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
                              ? t("flow:afterHours")
                              : option === "AMC"
                              ? t("flow:afterMarketClose")
                              : option === "BMO"
                              ? t("scanner:onlyPullbackFromHighStrong")
                              : t("flow:businessHours")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("flow:directionalBias")}>
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
                              ? t("flow:bullish")
                              : option === "Neutral"
                              ? t("common:neutral")
                              : t("flow:bearish")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("flow:strategyRating")}>
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
                              ? t("flow:excellent")
                              : option === "GOOD"
                              ? t("flow:good")
                              : option === "FAIR"
                              ? t("flow:fair")
                              : t("flow:poor")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("flow:riskLevel")}>
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
                              ? t("common:low")
                              : option === "MEDIUM"
                              ? t("common:medium")
                              : option === "HIGH"
                              ? t("common:high")
                              : t("flow:veryHigh")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("flow:momentumScore")}>
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
                  <Field label={t("flow:ivCrushScore")}>
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
                  <Field label={t("flow:expectedIvCrush")}>
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
                  <Field label={"Current IV %"}>
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
                  <Field label={"Historical IV %"}>
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
                  <Field label={t("flow:impliedMove")}>
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
                  <Field label={t("flow:callGain")}>
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
                  <Field label={t("flow:putGain")}>
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
                  <Field label={t("flow:targetProfit")}>
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
                  <Field label={t("flow:maxLoss")}>
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
                  <Field label={t("flow:beatRate")}>
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
                  <Field label={t("flow:6mPriceChange")}>
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
                  <Field label={"RSI 14"}>
                    <Input
                      type="number"
                      value={selectedEntry.rsi14}
                      onChange={event =>
                        updateSelectedEntry({ rsi14: Number(event.target.value) })
                      }
                    />
                  </Field>
                  <Field label={t("flow:recommendedStrategy")}>
                    <Input
                      value={selectedEntry.recommendedStrategy}
                      onChange={event =>
                        updateSelectedEntry({
                          recommendedStrategy: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label={t("flow:thesisAnalysisNote")}>
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
                  description={t("flow:noStocksToEditIn")}
                  title={t("coverage:loadingCoverageReports")}
                />
              )}
            </AdminPanelSurface>

            <AdminPanelSurface as="div" tone="muted" className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <SectionLabel>{"Advanced JSON"}</SectionLabel>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("flow:interveneInTheEntireWeekly")}
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
                    {t("flow:loadCurrentDraft2105")}
                  </Button>
                  <Button type="button" onClick={handleApplyRawJson}>
                    {t("common:applyJson")}
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
            description={t("flow:selectASavedWeekOr")}
            title={t("flow:noReportSelectedToEdit")}
          />
        )}
        </AdminPanelSurface>
      }
    />
  );
}
