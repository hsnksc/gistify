import { useEffect, useMemo, useState } from "react";
import { Radar, RefreshCw, Save, Upload } from "lucide-react";
import type { MomentumReportEntry, MomentumReportRecord } from "@shared/momentumReports";
import {
  AdminField as Field, AdminPanel, AdminPanelSurface, AdminSectionLabel, } from "@/components/reports/AdminPanel";
import { runMomentumScan } from "@/scanner";
import { applyScanResultsToMomentumDraft } from "@/lib/momentumReports";
import type { StockResult } from "@/scanner/types";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type AppLanguage, t } from "@/lib/i18n";

const DEFAULT_TICKERS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "META",
  "AMZN",
  "GOOGL",
  "AVGO",
  "AMD",
  "MRVL",
  "CRWD",
  "PANW",
  "SNOW",
  "TSLA",
  "PLTR",
  "SHOP",
  "MU",
];

interface MomentumReportAdminPanelProps {
  adminAuthorized: boolean;
  adminBusy: boolean;
  adminError?: string;
  reports: MomentumReportRecord[];
  selectedReportId: string;
  draftReport: MomentumReportRecord | null;
  onSelectReport: (reportId: string) => void;
  onDraftReportChange: (report: MomentumReportRecord) => void;
  onRefresh: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  language: AppLanguage;
}

const MOMENTUM_ADMIN_PANEL_CONFIG = {
  layout: "sidebar-main",
} as const;

export default function MomentumReportAdminPanel({
  adminAuthorized,
  adminBusy,
  adminError,
  reports,
  selectedReportId,
  draftReport,
  onSelectReport,
  onDraftReportChange,
  onRefresh,
  onSaveDraft,
  onPublish,
  language,
}: MomentumReportAdminPanelProps) {
  const [tickersInput, setTickersInput] = useState(DEFAULT_TICKERS.join(", "));
  const [minScore, setMinScore] = useState("45");
  const [signalFilter, setSignalFilter] = useState("ALL");
  const [scanBusy, setScanBusy] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanResults, setScanResults] = useState<StockResult[]>([]);
  const [rawReportJson, setRawReportJson] = useState("");
  const [rawReportError, setRawReportError] = useState("");

  useEffect(() => {
    setRawReportJson(draftReport ? JSON.stringify(draftReport, null, 2) : "");
    setRawReportError("");
  }, [draftReport?.id]);

  const selectedEntries = draftReport?.content.featuredEntries || [];
  const scanUniverseLabel = useMemo(() => {
    const total = tickersInput
      .split(",")
      .map(item => item.trim().toUpperCase())
      .filter(Boolean).length;
    return `${total} ${t("flow:tickerCustomUniverse")}`;
  }, [tickersInput, language]);

  const handleRunScan = async () => {
    const tickers = tickersInput
      .split(",")
      .map(item => item.trim().toUpperCase())
      .filter(Boolean);

    if (!tickers.length) {
      setScanError(t("flow:atLeastOneTickerIs"));
      return;
    }

    setScanBusy(true);
    setScanError("");
    setScanResults([]);

    try {
      const response = await runMomentumScan(tickers, {
        minScore: Number(minScore) || 45,
        signalFilter,
      });
      setScanResults(response.stocks);
    } catch (error) {
      setScanError(
        error instanceof Error ? error.message : t("flow:momentumScanFailed")
      );
    } finally {
      setScanBusy(false);
    }
  };

  const handleImportResults = () => {
    if (!draftReport || !scanResults.length) {
      return;
    }

    onDraftReportChange(
      applyScanResultsToMomentumDraft(draftReport, scanResults, scanUniverseLabel)
    );
  };

  const updateDraftField = (
    patch:
      | Partial<MomentumReportRecord>
      | ((current: MomentumReportRecord) => MomentumReportRecord)
  ) => {
    if (!draftReport) {
      return;
    }

    if (typeof patch === "function") {
      onDraftReportChange(patch(draftReport));
      return;
    }

    onDraftReportChange({
      ...draftReport,
      ...patch,
    });
  };

  const updateContentField = (
    patch: Partial<MomentumReportRecord["content"]>
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

  const updateEntry = (entryId: string, patch: Partial<MomentumReportEntry>) => {
    if (!draftReport) {
      return;
    }

    onDraftReportChange({
      ...draftReport,
      content: {
        ...draftReport.content,
        featuredEntries: draftReport.content.featuredEntries.map(entry =>
          entry.id === entryId ? { ...entry, ...patch } : entry
        ),
      },
    });
  };

  const removeEntry = (entryId: string) => {
    if (!draftReport) {
      return;
    }

    onDraftReportChange({
      ...draftReport,
      content: {
        ...draftReport.content,
        featuredEntries: draftReport.content.featuredEntries.filter(
          entry => entry.id !== entryId
        ),
      },
    });
  };

  const handleApplyRawJson = () => {
    if (!draftReport) {
      return;
    }

    try {
      const parsed = JSON.parse(rawReportJson) as Partial<MomentumReportRecord>;
      const nextContent =
        parsed.content && typeof parsed.content === "object"
          ? (parsed.content as Partial<MomentumReportRecord["content"]>)
          : {};
      const nextReport: MomentumReportRecord = {
        ...draftReport,
        ...parsed,
        content: {
          ...draftReport.content,
          ...nextContent,
          featuredEntries: Array.isArray(nextContent.featuredEntries)
            ? nextContent.featuredEntries
            : draftReport.content.featuredEntries,
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
        config={{ layout: "single" }}
        main={
          <EmptyState
            description={t("flow:unlockAdminAccessToUse90d2")}
            title={t("flow:adminLockIsCloseda84e")}
            tone="warning"
          />
        }
      />
    );
  }

  return (
    <AdminPanel
      config={MOMENTUM_ADMIN_PANEL_CONFIG}
      sidebar={
        <AdminPanelSurface
          as="aside"
          className="xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto"
        >
        <div className="flex items-center justify-between gap-2">
          <AdminSectionLabel>{t("flow:momentumReports")}</AdminSectionLabel>
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
              <SelectValue placeholder={t("common:theLiveEngineDowngradedThe")} />
            </SelectTrigger>
            <SelectContent>
              {reports.map(report => (
                <SelectItem key={report.id} value={report.id}>
                  {report.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 space-y-3">
          <Field label={t("flow:tickerUniverse")}>
            <Textarea
              rows={6}
              value={tickersInput}
              onChange={event => setTickersInput(event.target.value)}
              placeholder={"AAPL, MSFT, NVDA..."}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("flow:minScore")}>
              <Input
                type="number"
                value={minScore}
                onChange={event => setMinScore(event.target.value)}
              />
            </Field>
            <Field label={t("scanner:arrayLengthMismatchTsO")}>
              <Select value={signalFilter} onValueChange={setSignalFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["ALL", "STRONG_BUY", "BUY", "NEUTRAL"].map(option => (
                    <SelectItem key={option} value={option}>
                      {option === "ALL"
                        ? t("flow:all")
                        : option === "STRONG_BUY"
                        ? t("common:strongBuy")
                        : option === "BUY"
                        ? t("common:buy")
                        : t("common:neutral")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Button type="button" className="w-full" onClick={handleRunScan} disabled={scanBusy}>
            <Radar className="size-4" />
            {scanBusy ? t("flow:scanning") : t("flow:runMomentumScan")}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleImportResults}
            disabled={!draftReport || !scanResults.length}
          >
            {t("flow:importResultsToDraft")}
          </Button>

          {scanError ? (
            <p className="text-sm text-destructive">{scanError}</p>
          ) : null}

          <AdminPanelSurface as="div" tone="muted">
            <AdminSectionLabel>{t("flow:lastScan")}</AdminSectionLabel>
            <p className="mt-2 text-sm text-foreground">
              {scanResults.length ? `${scanResults.length} ${t("flow:setupsFound")}` : t("flow:noScanYet")}
            </p>
          </AdminPanelSurface>
        </div>
        </AdminPanelSurface>
      }
      main={
        <>

        <AdminPanelSurface>
          {draftReport ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <AdminSectionLabel tone="accent">{"Publish"}</AdminSectionLabel>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {t("flow:momentumSnapshotEditor")}
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
                    {t("flow:saveDraft")}
                  </Button>
                  <Button type="button" onClick={onPublish} disabled={adminBusy}>
                    <Upload className="size-4" />
                    {t("common:stale")}
                  </Button>
                </div>
              </div>

              {adminError ? (
                <p className="text-sm text-destructive">{adminError}</p>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t("flow:titleeb53")}>
                  <Input
                    value={draftReport.title}
                    onChange={event =>
                      updateDraftField({ title: event.target.value })
                    }
                  />
                </Field>
                <Field label={t("flow:reportDate")}>
                  <Input
                    type="date"
                    value={draftReport.reportDate}
                    onChange={event =>
                      updateDraftField({ reportDate: event.target.value })
                    }
                  />
                </Field>
                <Field label={"Headline"}>
                  <Input
                    value={draftReport.content.headline}
                    onChange={event =>
                      updateContentField({ headline: event.target.value })
                    }
                  />
                </Field>
                <Field label={t("flow:scannerUniverse")}>
                  <Input
                    value={draftReport.content.scannerUniverse}
                    onChange={event =>
                      updateContentField({
                        scannerUniverse: event.target.value,
                      })
                    }
                  />
                </Field>
              </div>

              <div className="grid gap-4">
                <Field label={t("flow:summary")}>
                  <Textarea
                    rows={3}
                    value={draftReport.content.summary}
                    onChange={event =>
                      updateContentField({ summary: event.target.value })
                    }
                  />
                </Field>
                <Field label={t("flow:marketContext")}>
                  <Textarea
                    rows={3}
                    value={draftReport.content.marketContext}
                    onChange={event =>
                      updateContentField({ marketContext: event.target.value })
                    }
                  />
                </Field>
                <Field label={t("flow:executionNotes")}>
                  <Textarea
                    rows={3}
                    value={draftReport.content.executionNotes}
                    onChange={event =>
                      updateContentField({ executionNotes: event.target.value })
                    }
                  />
                </Field>
              </div>
            </div>
          ) : (
            <EmptyState
              description={t("flow:selectAMomentumReportTo")}
              title={t("flow:noMomentumReportFoundTo")}
            />
          )}
        </AdminPanelSurface>

        {scanResults.length ? (
          <AdminPanelSurface>
            <div className="flex items-center justify-between gap-3">
              <div>
                <AdminSectionLabel tone="accent">{t("flow:liveScanResult")}</AdminSectionLabel>
                <h3 className="text-xl font-semibold text-foreground">
                  {t("flow:candidatesFromScan")}
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleImportResults}
                disabled={!draftReport}
              >
                {t("flow:importToDraft")}
              </Button>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              {scanResults.slice(0, 8).map(stock => (
                <article
                  key={stock.ticker}
                  className="rounded-xl border border-border bg-background/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {stock.ticker} · {stock.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stock.sector}
                      </p>
                    </div>
                    <span className="data-mono text-xl font-bold text-emerald-300">
                      {stock.score}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">{t("common:change")}</p>
                      <p className="font-semibold text-foreground">
                        {stock.priceChangePct.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{"RVOL"}</p>
                      <p className="font-semibold text-foreground">
                        {stock.volumeRatio.toFixed(2)}x
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{"RSI"}</p>
                      <p className="font-semibold text-foreground">
                        {stock.rsi.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("common:confidence")}</p>
                      <p className="font-semibold text-foreground">
                        {stock.confidenceScore || 0}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </AdminPanelSurface>
        ) : null}

        <AdminPanelSurface>
          <AdminSectionLabel tone="accent">{t("flow:cardsToPublish")}</AdminSectionLabel>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {selectedEntries.length ? (
              selectedEntries.map(entry => (
                <article
                  key={entry.id}
                  className="rounded-xl border border-border bg-background/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {entry.ticker} · {entry.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.sector}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => removeEntry(entry.id)}
                    >
                      {t("flow:remove")}
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">{t("common:score")}</p>
                      <p className="font-semibold text-foreground">{entry.score}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{"RSI"}</p>
                      <p className="font-semibold text-foreground">{entry.rsi}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{"RVOL"}</p>
                      <p className="font-semibold text-foreground">
                        {entry.volumeRatio.toFixed(2)}x
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("common:apexScore")}</p>
                      <p className="font-semibold text-foreground">{entry.signal}</p>
                    </div>
                  </div>

                  <Field label={t("flow:adminNote")}>
                    <Textarea
                      rows={3}
                      value={entry.adminNote || ""}
                      onChange={event =>
                        updateEntry(entry.id, { adminNote: event.target.value })
                      }
                    />
                  </Field>
                </article>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("flow:noMomentumSetupSelectedFor")}
              </p>
            )}
          </div>
        </AdminPanelSurface>

        {draftReport ? (
          <AdminPanelSurface>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <AdminSectionLabel tone="accent">{"Advanced JSON"}</AdminSectionLabel>
                <h3 className="mt-1 text-xl font-semibold text-foreground">
                  {t("flow:fullReportPayload")}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setRawReportJson(JSON.stringify(draftReport, null, 2))
                  }
                >
                  {t("flow:loadCurrentDraftf4b9")}
                </Button>
                <Button type="button" onClick={handleApplyRawJson}>
                  {t("common:applyJson")}
                </Button>
              </div>
            </div>

            <Textarea
              className="mt-4 min-h-[260px] font-mono text-xs"
              value={rawReportJson}
              onChange={event => setRawReportJson(event.target.value)}
            />

            {rawReportError ? (
              <p className="mt-3 text-sm text-destructive">{rawReportError}</p>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                {t("flow:useToEditTheEntire")}
              </p>
            )}
          </AdminPanelSurface>
        ) : null}
        </>
      }
    />
  );
}
