import { useMemo, useState } from "react";
import { Radar, RefreshCw, Save, Upload } from "lucide-react";
import type { MomentumReportEntry, MomentumReportRecord } from "@shared/momentumReports";
import { runMomentumScan } from "@/scanner";
import { applyScanResultsToMomentumDraft } from "@/lib/momentumReports";
import type { StockResult } from "@/scanner/types";
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
}: MomentumReportAdminPanelProps) {
  const [tickersInput, setTickersInput] = useState(DEFAULT_TICKERS.join(", "));
  const [minScore, setMinScore] = useState("45");
  const [signalFilter, setSignalFilter] = useState("ALL");
  const [scanBusy, setScanBusy] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanResults, setScanResults] = useState<StockResult[]>([]);

  const selectedEntries = draftReport?.content.featuredEntries || [];
  const scanUniverseLabel = useMemo(() => {
    const total = tickersInput
      .split(",")
      .map(item => item.trim().toUpperCase())
      .filter(Boolean).length;
    return `${total} ticker custom universe`;
  }, [tickersInput]);

  const handleRunScan = async () => {
    const tickers = tickersInput
      .split(",")
      .map(item => item.trim().toUpperCase())
      .filter(Boolean);

    if (!tickers.length) {
      setScanError("En az bir ticker gerekli.");
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
        error instanceof Error ? error.message : "Momentum taramasi basarisiz oldu."
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

  if (!adminAuthorized) {
    return (
      <div className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
        <p className="text-sm text-muted-foreground">
          Momentum publish aracini kullanmak icin once admin kilidini ac.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] border border-border bg-card/95 p-5 shadow-2xl xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Momentum Raporlari
          </p>
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
              <SelectValue placeholder="Bir momentum raporu sec" />
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
          <Field label="Ticker evreni">
            <Textarea
              rows={6}
              value={tickersInput}
              onChange={event => setTickersInput(event.target.value)}
              placeholder="AAPL, MSFT, NVDA..."
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Min skor">
              <Input
                type="number"
                value={minScore}
                onChange={event => setMinScore(event.target.value)}
              />
            </Field>
            <Field label="Sinyal filtresi">
              <Select value={signalFilter} onValueChange={setSignalFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["ALL", "STRONG_BUY", "BUY", "NEUTRAL"].map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Button type="button" className="w-full" onClick={handleRunScan} disabled={scanBusy}>
            <Radar className="size-4" />
            {scanBusy ? "Tarama calisiyor" : "Momentum taramasi calistir"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleImportResults}
            disabled={!draftReport || !scanResults.length}
          >
            Sonuclari taslaga aktar
          </Button>

          {scanError ? (
            <p className="text-sm text-destructive">{scanError}</p>
          ) : null}

          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Son tarama
            </p>
            <p className="mt-2 text-sm text-foreground">
              {scanResults.length ? `${scanResults.length} setup bulundu` : "Henuz tarama yok"}
            </p>
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
                    Momentum Snapshot Editoru
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
                      updateDraftField({ title: event.target.value })
                    }
                  />
                </Field>
                <Field label="Rapor tarihi">
                  <Input
                    type="date"
                    value={draftReport.reportDate}
                    onChange={event =>
                      updateDraftField({ reportDate: event.target.value })
                    }
                  />
                </Field>
                <Field label="Headline">
                  <Input
                    value={draftReport.content.headline}
                    onChange={event =>
                      updateContentField({ headline: event.target.value })
                    }
                  />
                </Field>
                <Field label="Scanner universe">
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
                <Field label="Ozet">
                  <Textarea
                    rows={3}
                    value={draftReport.content.summary}
                    onChange={event =>
                      updateContentField({ summary: event.target.value })
                    }
                  />
                </Field>
                <Field label="Piyasa baglami">
                  <Textarea
                    rows={3}
                    value={draftReport.content.marketContext}
                    onChange={event =>
                      updateContentField({ marketContext: event.target.value })
                    }
                  />
                </Field>
                <Field label="Execution notlari">
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
            <p className="text-sm text-muted-foreground">
              Duzenlenecek momentum raporu bulunamadi.
            </p>
          )}
        </section>

        {scanResults.length ? (
          <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Canli tarama sonucu
                </p>
                <h3 className="text-xl font-semibold text-foreground">
                  Taramadan gelen adaylar
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleImportResults}
                disabled={!draftReport}
              >
                Taslaga aktar
              </Button>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              {scanResults.slice(0, 8).map(stock => (
                <article
                  key={stock.ticker}
                  className="rounded-2xl border border-border bg-background/60 p-4"
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
                      <p className="text-muted-foreground">Degisim</p>
                      <p className="font-semibold text-foreground">
                        {stock.priceChangePct.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">RVOL</p>
                      <p className="font-semibold text-foreground">
                        {stock.volumeRatio.toFixed(2)}x
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">RSI</p>
                      <p className="font-semibold text-foreground">
                        {stock.rsi.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Guven</p>
                      <p className="font-semibold text-foreground">
                        {stock.confidenceScore || 0}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Yayinlanacak kartlar
          </p>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {selectedEntries.length ? (
              selectedEntries.map(entry => (
                <article
                  key={entry.id}
                  className="rounded-2xl border border-border bg-background/60 p-4"
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
                      Kaldir
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Skor</p>
                      <p className="font-semibold text-foreground">{entry.score}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">RSI</p>
                      <p className="font-semibold text-foreground">{entry.rsi}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">RVOL</p>
                      <p className="font-semibold text-foreground">
                        {entry.volumeRatio.toFixed(2)}x
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sinyal</p>
                      <p className="font-semibold text-foreground">{entry.signal}</p>
                    </div>
                  </div>

                  <Field label="Admin notu">
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
                Henuz yayinlanacak momentum setup secilmedi. Once taramayi calistirip
                sonuclari taslaga aktar.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
