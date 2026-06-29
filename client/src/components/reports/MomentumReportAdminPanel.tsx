import { useEffect, useMemo, useState } from "react";
import { Radar, RefreshCw, Save, Upload } from "lucide-react";
import type { MomentumReportEntry, MomentumReportRecord } from "@shared/momentumReports";
import {
  AdminField as Field,
  AdminPanel,
  AdminPanelSurface,
  AdminSectionLabel,
} from "@/components/reports/AdminPanel";
import { runMomentumScan } from "@/scanner";
import { applyScanResultsToMomentumDraft } from "@/lib/momentumReports";
import type { StockResult } from "@/scanner/types";
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
import { copy, type AppLanguage } from "@/lib/i18n";

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
    return `${total} ${copy(language, "hisselik ozel evren", "ticker custom universe")}`;
  }, [tickersInput, language]);

  const handleRunScan = async () => {
    const tickers = tickersInput
      .split(",")
      .map(item => item.trim().toUpperCase())
      .filter(Boolean);

    if (!tickers.length) {
      setScanError(copy(language, "En az bir ticker gerekli.", "At least one ticker is required."));
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
        error instanceof Error ? error.message : copy(language, "Momentum taramasi basarisiz oldu.", "Momentum scan failed.")
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
        error instanceof Error ? error.message : copy(language, "Raw JSON uygulanamadi.", "Raw JSON could not be applied.")
      );
    }
  };

  if (!adminAuthorized) {
    return (
      <AdminPanel
        config={{ layout: "single" }}
        main={
          <EmptyState
            description={copy(language, "Momentum publish aracini kullanmak icin once admin kilidini ac.", "Unlock admin access to use the momentum publish tool.")}
            title={copy(language, "Admin kilidi kapali", "Admin Lock is Closed")}
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
          <AdminSectionLabel>{copy(language, "Momentum Raporlari", "Momentum Reports")}</AdminSectionLabel>
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
              <SelectValue placeholder={copy(language, "Bir momentum raporu sec", "Select a momentum report")} />
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
          <Field label={copy(language, "Ticker evreni", "Ticker Universe")}>
            <Textarea
              rows={6}
              value={tickersInput}
              onChange={event => setTickersInput(event.target.value)}
              placeholder={copy(language, "AAPL, MSFT, NVDA...", "AAPL, MSFT, NVDA...")}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={copy(language, "Min skor", "Min Score")}>
              <Input
                type="number"
                value={minScore}
                onChange={event => setMinScore(event.target.value)}
              />
            </Field>
            <Field label={copy(language, "Sinyal filtresi", "Signal Filter")}>
              <Select value={signalFilter} onValueChange={setSignalFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["ALL", "STRONG_BUY", "BUY", "NEUTRAL"].map(option => (
                    <SelectItem key={option} value={option}>
                      {option === "ALL"
                        ? copy(language, "Tumu", "All")
                        : option === "STRONG_BUY"
                        ? copy(language, "Guclu Al", "Strong Buy")
                        : option === "BUY"
                        ? copy(language, "Al", "Buy")
                        : copy(language, "Notr", "Neutral")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Button type="button" className="w-full" onClick={handleRunScan} disabled={scanBusy}>
            <Radar className="size-4" />
            {scanBusy ? copy(language, "Tarama calisiyor", "Scanning...") : copy(language, "Momentum taramasi calistir", "Run Momentum Scan")}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleImportResults}
            disabled={!draftReport || !scanResults.length}
          >
            {copy(language, "Sonuclari taslaga aktar", "Import Results to Draft")}
          </Button>

          {scanError ? (
            <p className="text-sm text-destructive">{scanError}</p>
          ) : null}

          <AdminPanelSurface as="div" tone="muted">
            <AdminSectionLabel>{copy(language, "Son tarama", "Last Scan")}</AdminSectionLabel>
            <p className="mt-2 text-sm text-foreground">
              {scanResults.length ? `${scanResults.length} ${copy(language, "setup bulundu", "setups found")}` : copy(language, "Henuz tarama yok", "No scan yet")}
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
                  <AdminSectionLabel tone="accent">{copy(language, "Publish", "Publish")}</AdminSectionLabel>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {copy(language, "Momentum Snapshot Editoru", "Momentum Snapshot Editor")}
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
                  <Button type="button" onClick={onPublish} disabled={adminBusy}>
                    <Upload className="size-4" />
                    {copy(language, "Yayinla", "Publish")}
                  </Button>
                </div>
              </div>

              {adminError ? (
                <p className="text-sm text-destructive">{adminError}</p>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <Field label={copy(language, "Baslik", "Title")}>
                  <Input
                    value={draftReport.title}
                    onChange={event =>
                      updateDraftField({ title: event.target.value })
                    }
                  />
                </Field>
                <Field label={copy(language, "Rapor tarihi", "Report Date")}>
                  <Input
                    type="date"
                    value={draftReport.reportDate}
                    onChange={event =>
                      updateDraftField({ reportDate: event.target.value })
                    }
                  />
                </Field>
                <Field label={copy(language, "Headline", "Headline")}>
                  <Input
                    value={draftReport.content.headline}
                    onChange={event =>
                      updateContentField({ headline: event.target.value })
                    }
                  />
                </Field>
                <Field label={copy(language, "Scanner universe", "Scanner Universe")}>
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
                <Field label={copy(language, "Ozet", "Summary")}>
                  <Textarea
                    rows={3}
                    value={draftReport.content.summary}
                    onChange={event =>
                      updateContentField({ summary: event.target.value })
                    }
                  />
                </Field>
                <Field label={copy(language, "Piyasa baglami", "Market Context")}>
                  <Textarea
                    rows={3}
                    value={draftReport.content.marketContext}
                    onChange={event =>
                      updateContentField({ marketContext: event.target.value })
                    }
                  />
                </Field>
                <Field label={copy(language, "Execution notlari", "Execution Notes")}>
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
              description={copy(language, "Momentum report secip duzenlemeye basla.", "Select a momentum report to start editing.")}
              title={copy(language, "Duzenlenecek momentum raporu bulunamadi", "No momentum report found to edit")}
            />
          )}
        </AdminPanelSurface>

        {scanResults.length ? (
          <AdminPanelSurface>
            <div className="flex items-center justify-between gap-3">
              <div>
                <AdminSectionLabel tone="accent">{copy(language, "Canli tarama sonucu", "Live Scan Result")}</AdminSectionLabel>
                <h3 className="text-xl font-semibold text-foreground">
                  {copy(language, "Taramadan gelen adaylar", "Candidates from Scan")}
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleImportResults}
                disabled={!draftReport}
              >
                {copy(language, "Taslaga aktar", "Import to Draft")}
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
                      <p className="text-muted-foreground">{copy(language, "Degisim", "Change")}</p>
                      <p className="font-semibold text-foreground">
                        {stock.priceChangePct.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{copy(language, "RVOL", "RVOL")}</p>
                      <p className="font-semibold text-foreground">
                        {stock.volumeRatio.toFixed(2)}x
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{copy(language, "RSI", "RSI")}</p>
                      <p className="font-semibold text-foreground">
                        {stock.rsi.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{copy(language, "Guven", "Confidence")}</p>
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
          <AdminSectionLabel tone="accent">{copy(language, "Yayinlanacak kartlar", "Cards to Publish")}</AdminSectionLabel>
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
                      {copy(language, "Kaldir", "Remove")}
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">{copy(language, "Skor", "Score")}</p>
                      <p className="font-semibold text-foreground">{entry.score}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{copy(language, "RSI", "RSI")}</p>
                      <p className="font-semibold text-foreground">{entry.rsi}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{copy(language, "RVOL", "RVOL")}</p>
                      <p className="font-semibold text-foreground">
                        {entry.volumeRatio.toFixed(2)}x
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{copy(language, "Sinyal", "Signal")}</p>
                      <p className="font-semibold text-foreground">{entry.signal}</p>
                    </div>
                  </div>

                  <Field label={copy(language, "Admin notu", "Admin Note")}>
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
                {copy(language, "Henuz yayinlanacak momentum setup secilmedi. Once taramayi calistirip sonuclari taslaga aktar.", "No momentum setup selected for publishing yet. Run a scan and import results to draft first.")}
              </p>
            )}
          </div>
        </AdminPanelSurface>

        {draftReport ? (
          <AdminPanelSurface>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <AdminSectionLabel tone="accent">{copy(language, "Advanced JSON", "Advanced JSON")}</AdminSectionLabel>
                <h3 className="mt-1 text-xl font-semibold text-foreground">
                  {copy(language, "Tum report payload'i", "Full Report Payload")}
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
                  {copy(language, "Guncel taslagi yukle", "Load Current Draft")}
                </Button>
                <Button type="button" onClick={handleApplyRawJson}>
                  {copy(language, "JSON'i uygula", "Apply JSON")}
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
                {copy(language, "Featured entry listesi dahil tum momentum raporunu tek editorle degistirmek icin kullan.", "Use to edit the entire momentum report including the featured entry list in a single editor.")}
              </p>
            )}
          </AdminPanelSurface>
        ) : null}
        </>
      }
    />
  );
}
