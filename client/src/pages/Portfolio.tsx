import { type FormEvent, useEffect, useMemo, useState } from "react";
import type {
  PortfolioAnalysisRecord,
  PortfolioAssetType,
  PortfolioContextSummary,
  PortfolioModuleSummary,
  PortfolioPositionInsight,
  PortfolioPositionRecord,
} from "@shared/portfolio";
import {
  BrainCircuit,
  BriefcaseBusiness,
  CalendarClock,
  Crosshair,
  FolderOpenDot,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import {
  formatPortfolioCurrency,
  getPortfolioActionClasses,
  getPortfolioActionLabel,
  getPortfolioAssetLabel,
  getPortfolioPositionCostBasis,
  getPortfolioPostureClasses,
  getPortfolioPostureLabel,
} from "@/lib/portfolio";

interface PortfolioResponse {
  positions?: PortfolioPositionRecord[];
  context?: PortfolioContextSummary;
  error?: string;
}

interface PortfolioAnalysisResponse {
  analysis?: PortfolioAnalysisRecord;
  error?: string;
}

interface PositionDraft {
  id?: string;
  ticker: string;
  assetType: PortfolioAssetType;
  quantity: string;
  entryPrice: string;
  entryDate: string;
  strikePrice: string;
  expiryDate: string;
  notes: string;
}

const ACCOUNT_SIZE_STORAGE_KEY = "gistify:portfolio:account-size";

function createEmptyDraft(): PositionDraft {
  return {
    ticker: "",
    assetType: "stock",
    quantity: "",
    entryPrice: "",
    entryDate: new Date().toISOString().slice(0, 10),
    strikePrice: "",
    expiryDate: "",
    notes: "",
  };
}

function resolveSafeDate(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(normalized)
    ? new Date(`${normalized}T00:00:00Z`)
    : new Date(normalized);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatReportDate(dateValue: string) {
  const parsed = resolveSafeDate(dateValue);
  if (!parsed) {
    return dateValue || "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatTimestamp(timestamp: string) {
  const parsed = resolveSafeDate(timestamp);
  if (!parsed) {
    return timestamp || "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function ModuleStack({
  title,
  eyebrow,
  items,
}: {
  title: string;
  eyebrow: string;
  items: PortfolioModuleSummary[];
}) {
  return (
    <article className="rounded-[1.8rem] border border-border bg-background/40 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-base font-semibold text-foreground">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map(item => (
            <div
              key={`${item.module}-${item.reportId || item.title}`}
              className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <Badge variant="outline" className="border-white/10 text-[10px]">
                  {item.coverageCount} coverage
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatReportDate(item.asOfDate)}
              </p>
              {item.subtitle ? (
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  {item.subtitle}
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-[1.2rem] border border-dashed border-border bg-background/30 p-3 text-sm text-muted-foreground">
            Bu modulde yayinlanmis kaynak bulunmuyor.
          </div>
        )}
      </div>
    </article>
  );
}

function InsightCard({ insight }: { insight: PortfolioPositionInsight }) {
  const position = insight.position;

  return (
    <article className="rounded-[2rem] border border-border bg-card/85 p-5 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-foreground">{position.ticker}</h3>
            <Badge variant="outline" className="border-white/10">
              {getPortfolioAssetLabel(position.assetType)}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{insight.thesis}</p>
        </div>

        <div
          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getPortfolioActionClasses(insight.action)}`}
        >
          {getPortfolioActionLabel(insight.action)}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.3rem] border border-white/10 bg-background/40 p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Conviction
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {insight.convictionScore}
          </p>
        </div>
        <div className="rounded-[1.3rem] border border-white/10 bg-background/40 p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Risk
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {insight.riskScore}
          </p>
        </div>
        <div className="rounded-[1.3rem] border border-white/10 bg-background/40 p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Cost basis
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {formatPortfolioCurrency(insight.costBasis)}
          </p>
        </div>
        <div className="rounded-[1.3rem] border border-white/10 bg-background/40 p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Est. risk
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {formatPortfolioCurrency(insight.estimatedRisk)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="space-y-4">
          <div className="rounded-[1.4rem] border border-cyan-500/15 bg-cyan-500/8 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              AI Strategy
            </p>
            <p className="mt-2 text-sm leading-7 text-cyan-50">{insight.strategy}</p>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/10 bg-background/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Signals
              </p>
              <div className="mt-3 space-y-2">
                {insight.signals.map(signal => (
                  <p key={signal} className="text-sm leading-6 text-foreground/90">
                    {signal}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-background/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Risk Flags
              </p>
              <div className="mt-3 space-y-2">
                {insight.warnings.map(warning => (
                  <p key={warning} className="text-sm leading-6 text-muted-foreground">
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-white/10 bg-background/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Source modules
          </p>
          <div className="mt-3 space-y-3">
            {insight.moduleMatches.map(match => (
              <div
                key={`${match.module}-${match.reportId || match.title}`}
                className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{match.title}</p>
                  {typeof match.signalScore === "number" ? (
                    <Badge variant="outline" className="border-white/10 text-[10px]">
                      {match.signalScore}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatReportDate(match.asOfDate)}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{match.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PortfolioPage() {
  const [positions, setPositions] = useState<PortfolioPositionRecord[]>([]);
  const [context, setContext] = useState<PortfolioContextSummary>({
    earningStrategy: [],
    momentum: [],
    daily: [],
  });
  const [analysis, setAnalysis] = useState<PortfolioAnalysisRecord | null>(null);
  const [draft, setDraft] = useState<PositionDraft>(() => createEmptyDraft());
  const [accountSize, setAccountSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(ACCOUNT_SIZE_STORAGE_KEY);
    if (stored) {
      setAccountSize(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (accountSize) {
      window.localStorage.setItem(ACCOUNT_SIZE_STORAGE_KEY, accountSize);
      return;
    }

    window.localStorage.removeItem(ACCOUNT_SIZE_STORAGE_KEY);
  }, [accountSize]);

  useEffect(() => {
    let cancelled = false;

    async function loadPortfolio() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/portfolio", {
          credentials: "include",
          cache: "no-store",
        });
        const payload = (await response.json()) as PortfolioResponse;

        if (!response.ok) {
          throw new Error(payload.error || "Portfoy yuklenemedi.");
        }

        if (cancelled) {
          return;
        }

        setPositions(payload.positions || []);
        setContext(
          payload.context || {
            earningStrategy: [],
            momentum: [],
            daily: [],
          }
        );
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Portfoy workspace'i yuklenemedi."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPortfolio();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalCostBasis = useMemo(
    () =>
      positions.reduce(
        (sum, position) => sum + getPortfolioPositionCostBasis(position),
        0
      ),
    [positions]
  );
  const optionCount = positions.filter(position => position.assetType !== "stock").length;
  const coverageCount = useMemo(
    () =>
      new Set(
        [
          ...context.earningStrategy.map(item => item.reportId || item.title),
          ...context.momentum.map(item => item.reportId || item.title),
          ...context.daily.map(item => item.reportId || item.title),
        ].filter(Boolean)
      ).size,
    [context]
  );

  const resetDraft = () => {
    setDraft(createEmptyDraft());
  };

  const handleSavePosition = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position: {
            id: draft.id,
            ticker: draft.ticker.toUpperCase(),
            assetType: draft.assetType,
            quantity: Number(draft.quantity),
            entryPrice: Number(draft.entryPrice),
            entryDate: draft.entryDate,
            strikePrice:
              draft.assetType === "stock" ? undefined : Number(draft.strikePrice),
            expiryDate: draft.assetType === "stock" ? undefined : draft.expiryDate,
            notes: draft.notes,
          },
        }),
      });
      const payload = (await response.json()) as PortfolioResponse;

      if (!response.ok) {
        throw new Error(payload.error || "Pozisyon kaydedilemedi.");
      }

      setPositions(payload.positions || []);
      setContext(
        payload.context || {
          earningStrategy: [],
          momentum: [],
          daily: [],
        }
      );
      setAnalysis(null);
      resetDraft();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Pozisyon kaydedilemedi."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEditPosition = (position: PortfolioPositionRecord) => {
    setDraft({
      id: position.id,
      ticker: position.ticker,
      assetType: position.assetType,
      quantity: String(position.quantity),
      entryPrice: String(position.entryPrice),
      entryDate: position.entryDate,
      strikePrice: position.strikePrice ? String(position.strikePrice) : "",
      expiryDate: position.expiryDate || "",
      notes: position.notes || "",
    });
  };

  const handleDeletePosition = async (positionId: string) => {
    setError("");

    try {
      const response = await fetch(`/api/portfolio/${positionId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const payload = (await response.json()) as PortfolioResponse;

      if (!response.ok) {
        throw new Error(payload.error || "Pozisyon silinemedi.");
      }

      setPositions(payload.positions || []);
      setContext(
        payload.context || {
          earningStrategy: [],
          momentum: [],
          daily: [],
        }
      );
      setAnalysis(null);

      if (draft.id === positionId) {
        resetDraft();
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Pozisyon silinemedi."
      );
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/portfolio/analyze", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountSize: accountSize ? Number(accountSize) : undefined,
        }),
      });
      const payload = (await response.json()) as PortfolioAnalysisResponse;

      if (!response.ok) {
        throw new Error(payload.error || "Portfoy analizi calistirilamadi.");
      }

      setAnalysis(payload.analysis || null);
    } catch (analysisError) {
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "Portfoy analizi calistirilamadi."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-[1520px] space-y-6">
        <section className="relative overflow-hidden rounded-[2.4rem] border border-border bg-card/95 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%)]" />
          <div className="absolute inset-0 tactical-grid opacity-20" />

          <div className="relative grid gap-6 p-6 xl:grid-cols-[minmax(0,1.2fr)_380px] xl:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                <BrainCircuit className="size-3.5" />
                Member Portfolio Lab
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Daily sonrasinda calisan portfoy strateji masasi
                </h1>
                <p className="max-w-4xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                  Uyeler aldiklari hisseleri veya opsiyonlari buraya girer.
                  `Portfoyumu Sina` komutu calistiginda Earning Strategy,
                  Momentum ve Daily modullerindeki yayinlanmis veriler tek
                  masada birlesir ve pozisyon bazli strateji onerileri uretir.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Positions
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {loading ? "-" : positions.length}
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Cost basis
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {loading ? "-" : formatPortfolioCurrency(totalCostBasis)}
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Option legs
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {loading ? "-" : optionCount}
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    AI sources
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {loading ? "-" : coverageCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-background/45 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Analysis Engine
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-foreground">
                    Portfoyumu Sina
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Sistem weekly setup, latest momentum snapshot ve daily
                    report ticker coverage&apos;ini birlikte yorumlar. Yeni risk
                    alip almaman gerektigini ve hangi pozisyonu hedge veya trim
                    edecegini one cikarir.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Account size (USD)
                  </label>
                  <Input
                    value={accountSize}
                    onChange={event => setAccountSize(event.target.value)}
                    inputMode="decimal"
                    placeholder="25000"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={analyzing || !positions.length}
                    className="min-w-[180px]"
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        Calisiyor
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Portfoyumu Sina
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetDraft}>
                    Formu sifirla
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <section className="rounded-[1.7rem] border border-rose-500/25 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
            {error}
          </section>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-[2rem] border border-border bg-card/95 p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Position builder
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  Hisse veya opsiyon ekle
                </h2>
              </div>

              {draft.id ? (
                <Badge variant="outline" className="border-cyan-400/20 text-cyan-200">
                  Editing
                </Badge>
              ) : null}
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSavePosition}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Ticker
                  </label>
                  <Input
                    value={draft.ticker}
                    onChange={event =>
                      setDraft(current => ({
                        ...current,
                        ticker: event.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="NVDA"
                    maxLength={12}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Asset type
                  </label>
                  <Select
                    value={draft.assetType}
                    onValueChange={value =>
                      setDraft(current => ({
                        ...current,
                        assetType: value as PortfolioAssetType,
                        strikePrice: value === "stock" ? "" : current.strikePrice,
                        expiryDate: value === "stock" ? "" : current.expiryDate,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="put">Put</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Quantity
                  </label>
                  <Input
                    value={draft.quantity}
                    onChange={event =>
                      setDraft(current => ({ ...current, quantity: event.target.value }))
                    }
                    inputMode="decimal"
                    placeholder={draft.assetType === "stock" ? "50" : "2"}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Entry price
                  </label>
                  <Input
                    value={draft.entryPrice}
                    onChange={event =>
                      setDraft(current => ({
                        ...current,
                        entryPrice: event.target.value,
                      }))
                    }
                    inputMode="decimal"
                    placeholder={draft.assetType === "stock" ? "132.50" : "4.25"}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Entry date
                  </label>
                  <Input
                    type="date"
                    value={draft.entryDate}
                    onChange={event =>
                      setDraft(current => ({ ...current, entryDate: event.target.value }))
                    }
                  />
                </div>

                {draft.assetType !== "stock" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Strike
                    </label>
                    <Input
                      value={draft.strikePrice}
                      onChange={event =>
                        setDraft(current => ({
                          ...current,
                          strikePrice: event.target.value,
                        }))
                      }
                      inputMode="decimal"
                      placeholder="140"
                    />
                  </div>
                ) : null}
              </div>

              {draft.assetType !== "stock" ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Expiry date
                  </label>
                  <Input
                    type="date"
                    value={draft.expiryDate}
                    onChange={event =>
                      setDraft(current => ({
                        ...current,
                        expiryDate: event.target.value,
                      }))
                    }
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Notes
                </label>
                <Textarea
                  value={draft.notes}
                  onChange={event =>
                    setDraft(current => ({ ...current, notes: event.target.value }))
                  }
                  placeholder="Neden girdin, hangi event'i bekliyorsun, stop nasil?"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={saving} className="min-w-[180px]">
                  {saving ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      Kaydediliyor
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      {draft.id ? "Pozisyonu guncelle" : "Pozisyon ekle"}
                    </>
                  )}
                </Button>
                {draft.id ? (
                  <Button type="button" variant="outline" onClick={resetDraft}>
                    Duzenlemeyi iptal et
                  </Button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <ModuleStack
              eyebrow="Source 01"
              title="Earning Strategy"
              items={context.earningStrategy}
            />
            <ModuleStack
              eyebrow="Source 02"
              title="Momentum"
              items={context.momentum}
            />
            <ModuleStack eyebrow="Source 03" title="Daily" items={context.daily} />
          </section>
        </div>

        <section className="rounded-[2rem] border border-border bg-card/95 p-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Book
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Kayitli pozisyonlar
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/45 px-3 py-1 text-xs text-muted-foreground">
              <BriefcaseBusiness className="size-3.5" />
              {positions.length} satir
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-background/35 p-5 text-sm text-muted-foreground">
                Portfolio workspace yukleniyor.
              </div>
            ) : positions.length ? (
              positions.map(position => (
                <article
                  key={position.id}
                  className="rounded-[1.6rem] border border-white/10 bg-background/40 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {position.ticker}
                        </h3>
                        <Badge variant="outline" className="border-white/10">
                          {getPortfolioAssetLabel(position.assetType)}
                        </Badge>
                        <Badge variant="outline" className="border-white/10">
                          {position.quantity}x
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Entry {formatPortfolioCurrency(position.entryPrice)} on{" "}
                        {formatReportDate(position.entryDate)}
                        {position.strikePrice ? ` | Strike ${position.strikePrice}` : ""}
                        {position.expiryDate
                          ? ` | Exp ${formatReportDate(position.expiryDate)}`
                          : ""}
                      </p>
                      {position.notes ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          {position.notes}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-3 py-2 text-right">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          Basis
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {formatPortfolioCurrency(
                            getPortfolioPositionCostBasis(position)
                          )}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleEditPosition(position)}
                      >
                        <FolderOpenDot className="size-4" />
                        Duzenle
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDeletePosition(position.id)}
                      >
                        <Trash2 className="size-4" />
                        Sil
                      </Button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.6rem] border border-dashed border-border bg-background/35 p-8 text-center">
                <div className="mx-auto max-w-xl space-y-3">
                  <WalletCards className="mx-auto size-8 text-cyan-300" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Henuz pozisyon eklenmedi
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Soldaki formdan aldigin hisse veya opsiyonu ekle. Sonra
                    `Portfoyumu Sina` diyerek uc modulun ortak sinyal masasi ile
                    risk ve strateji sentezi al.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card/95 p-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Portfolio command
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                AI destekli strateji sinamasi
              </h2>
            </div>

            {analysis ? (
              <Badge variant="outline" className="border-white/10">
                Son calisma {formatTimestamp(analysis.generatedAt)}
              </Badge>
            ) : null}
          </div>

          {analysis ? (
            <div className="mt-5 space-y-5">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
                <div className="rounded-[1.8rem] border border-cyan-500/15 bg-cyan-500/8 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                        Desk Summary
                      </p>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-cyan-50">
                        {analysis.summary}
                      </p>
                    </div>

                    <div
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getPortfolioPostureClasses(analysis.posture)}`}
                    >
                      {getPortfolioPostureLabel(analysis.posture)}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    <div className="rounded-[1.3rem] border border-white/10 bg-background/35 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Overall score
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        {analysis.overallScore}
                      </p>
                    </div>
                    <div className="rounded-[1.3rem] border border-white/10 bg-background/35 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Heat
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        %{analysis.heatPct}
                      </p>
                    </div>
                    <div className="rounded-[1.3rem] border border-white/10 bg-background/35 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Cost basis
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {formatPortfolioCurrency(analysis.totalCostBasis)}
                      </p>
                    </div>
                    <div className="rounded-[1.3rem] border border-white/10 bg-background/35 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Risk budget
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {formatPortfolioCurrency(analysis.estimatedPortfolioRisk)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/10 bg-background/35 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Crosshair className="size-4 text-emerald-300" />
                    Next actions
                  </div>
                  <div className="mt-4 space-y-3">
                    {analysis.nextActions.map(action => (
                      <div
                        key={action}
                        className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-muted-foreground"
                      >
                        {action}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <ShieldCheck className="size-4 text-cyan-300" />
                      Can add risk
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {analysis.canAddRisk
                        ? "Evet, ama yalniz en guclu coverage alan isimlerde ve kademeli."
                        : "Hayir. Once mevcut risk butcesini dusurmek daha dogru."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {analysis.positions.map(insight => (
                  <InsightCard key={insight.position.id} insight={insight} />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.6rem] border border-dashed border-border bg-background/35 p-8 text-center">
              <div className="mx-auto max-w-2xl space-y-3">
                <CalendarClock className="mx-auto size-8 text-cyan-300" />
                <h3 className="text-lg font-semibold text-foreground">
                  Henuz analiz calistirilmadi
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Once portfoye satir ekle. Sonra account size girip
                  `Portfoyumu Sina` tusuna bas. Sistem Earning Strategy,
                  Momentum ve Daily yapilarini kullanarak her pozisyon icin
                  hold, hedge, trim, add veya exit karari uretecek.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
