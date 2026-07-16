import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Clock3,
  Database,
  FileText,
  Gauge,
  Shield,
  Target,
} from "lucide-react";
import type {
  FactorBreakdown,
  MidasActionSignal,
  MidasSignalRecord,
  MidasSignalsData,
} from "@shared/midasSignals";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFlowReportSummaries } from "@/features/flow/hooks/useFlowReportSummaries";
import type { AppLanguage } from "@/lib/i18n";
import { useMomentumV3Data } from "@/lib/momentumV3";
import { cn } from "@/lib/utils";

interface FactorDefinition {
  key: keyof FactorBreakdown;
  weight: number;
  labels: [string, string];
  descriptions: [string, string];
}

const FACTORS: FactorDefinition[] = [
  {
    key: "f1_momentum_quality",
    weight: 25,
    labels: ["Momentum kalitesi", "Momentum quality"],
    descriptions: ["İvme, süreklilik ve çoklu vade uyumu", "Velocity, persistence and timeframe alignment"],
  },
  {
    key: "f2_relative_strength",
    weight: 20,
    labels: ["Göreli güç", "Relative strength"],
    descriptions: ["Hissenin piyasa ve yakın dönem trendine göre gücü", "Strength versus the market and recent trend"],
  },
  {
    key: "f3_volume_liquidity",
    weight: 15,
    labels: ["Hacim ve likidite", "Volume and liquidity"],
    descriptions: ["İşlem derinliği ve hareketin hacim desteği", "Trading depth and volume support behind the move"],
  },
  {
    key: "f4_technical_structure",
    weight: 15,
    labels: ["Teknik yapı", "Technical structure"],
    descriptions: ["Trend, ortalamalar, VWAP ve fiyat yapısı", "Trend, moving averages, VWAP and price structure"],
  },
  {
    key: "f5_volatility_regime",
    weight: 10,
    labels: ["Volatilite rejimi", "Volatility regime"],
    descriptions: ["ATR, oynaklık ve piyasa rejimi uyumu", "ATR, volatility and market-regime fit"],
  },
  {
    key: "f6_catalyst_flow",
    weight: 15,
    labels: ["Katalizör akışı", "Catalyst flow"],
    descriptions: ["Haber, olay ve teyit edilmiş katalizör katkısı", "Contribution from news, events and confirmed catalysts"],
  },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value: number | undefined, maximumFractionDigits = 2) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

function formatUsd(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 2,
    style: "currency",
  }).format(value);
}

function formatPercent(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatTimestamp(value: string | undefined, language: AppLanguage) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function signalLabel(signal: MidasActionSignal, language: AppLanguage) {
  const labels: Record<MidasActionSignal, [string, string]> = {
    STRONG_BUY: ["Güçlü Al", "Strong Buy"],
    BUY: ["Al", "Buy"],
    HOLD: ["İzle", "Watch"],
    SELL: ["Sat", "Sell"],
    STRONG_SELL: ["Güçlü Sat", "Strong Sell"],
  };
  return labels[signal][language === "en" ? 1 : 0];
}

function signalClass(signal: MidasActionSignal) {
  if (signal === "STRONG_BUY") return "border-emerald-400/35 bg-emerald-500/15 text-emerald-200";
  if (signal === "BUY") return "border-emerald-400/25 bg-emerald-500/10 text-emerald-300";
  if (signal === "STRONG_SELL") return "border-rose-400/35 bg-rose-500/15 text-rose-200";
  if (signal === "SELL") return "border-rose-400/25 bg-rose-500/10 text-rose-300";
  return "border-amber-400/25 bg-amber-500/10 text-amber-200";
}

function scoreTone(score: number) {
  if (score >= 70) return "text-emerald-300";
  if (score >= 45) return "text-amber-300";
  return "text-rose-300";
}

function readTechnicalNumber(signal: MidasSignalRecord, key: string) {
  const value = signal.technical?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function deriveOverallScore(signal: MidasSignalRecord) {
  if (typeof signal.apex_score === "number") return clamp(signal.apex_score);
  if (typeof signal.confidence === "number") return clamp(signal.confidence);
  return clamp(Math.abs(signal.strength) * 7);
}

function factorValue(signal: MidasSignalRecord, factor: FactorDefinition) {
  const raw = signal.factor_breakdown?.[factor.key];
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  return {
    normalized: clamp((raw / factor.weight) * 100),
    raw,
  };
}

function reportHref(reportId: string) {
  return `/reports/${encodeURIComponent(reportId)}`;
}

export default function CoverageSignalIntelligence({
  ticker,
  language,
  earningsDate,
}: {
  ticker: string;
  language: AppLanguage;
  earningsDate?: string;
}) {
  const normalizedTicker = ticker.toUpperCase();
  const [data, setData] = useState<MidasSignalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const momentumV3 = useMomentumV3Data();
  const flow = useFlowReportSummaries(language, {
    limit: 100,
    reportKind: "stock",
  });
  const isEnglish = language === "en";

  const copy = isEnglish
    ? {
        eyebrow: "Signal intelligence",
        title: "Explainable Midas score",
        description: "A factor-by-factor view of the latest snapshot, its evidence coverage and executable risk plan.",
        loading: "Loading the Midas snapshot...",
        unavailable: "No Midas signal is available for this ticker in the current universe.",
        unavailableDetail: "The coverage report remains available below. Missing signal data is not converted into a zero score.",
        factors: "Factor map",
        factorsDescription: "Each contribution is normalized to a common 0–100 scale. Raw points remain visible.",
        noFactors: "This snapshot does not contain a factor breakdown.",
        currentScore: "Current score",
        previousScore: "Previous public ledger",
        scoreChange: "Score change",
        dataCoverage: "Factor coverage",
        snapshot: "Snapshot",
        setup: "Setup",
        direction: "Direction",
        tradePlan: "Trade plan",
        entry: "Entry",
        stop: "Invalidation",
        target1: "Target 1",
        target2: "Target 2",
        riskReward: "Risk / reward",
        position: "Position sizing",
        shares: "Shares",
        positionValue: "Position value",
        dollarRisk: "Dollar risk",
        accountRisk: "Account risk",
        context: "Market and technical context",
        rsi: "RSI 14",
        volume: "Volume ratio",
        vwap: "Distance to VWAP",
        high52: "Distance to 52W high",
        regime: "Market regime",
        vix: "VIX",
        related: "Related research",
        relatedDescription: "Flow reports connected to this ticker.",
        noReports: "No related Flow report was found.",
        openReport: "Open report",
        earnings: "Earnings",
        source: "Source",
        disclaimer: "Decision-support output, not investment advice. Confirm liquidity, catalyst timing and invalidation before acting.",
      }
    : {
        eyebrow: "Sinyal zekâsı",
        title: "Açıklanabilir Midas skoru",
        description: "Son snapshot'ın faktörlerini, kanıt kapsamını ve uygulanabilir risk planını tek görünümde açıklar.",
        loading: "Midas snapshot yükleniyor...",
        unavailable: "Bu ticker için mevcut evrende Midas sinyali bulunmuyor.",
        unavailableDetail: "Coverage raporu aşağıda kullanılabilir. Eksik sinyal verisi sıfır skora dönüştürülmez.",
        factors: "Faktör haritası",
        factorsDescription: "Her katkı ortak 0–100 ölçeğine normalize edilir; ham puan ayrıca gösterilir.",
        noFactors: "Bu snapshot faktör kırılımı içermiyor.",
        currentScore: "Güncel skor",
        previousScore: "Önceki public ledger",
        scoreChange: "Skor değişimi",
        dataCoverage: "Faktör kapsamı",
        snapshot: "Snapshot",
        setup: "Setup",
        direction: "Yön",
        tradePlan: "İşlem planı",
        entry: "Giriş",
        stop: "Geçersizlik",
        target1: "Hedef 1",
        target2: "Hedef 2",
        riskReward: "Risk / getiri",
        position: "Pozisyon boyutu",
        shares: "Adet",
        positionValue: "Pozisyon değeri",
        dollarRisk: "Dolar riski",
        accountRisk: "Hesap riski",
        context: "Piyasa ve teknik bağlam",
        rsi: "RSI 14",
        volume: "Hacim oranı",
        vwap: "VWAP uzaklığı",
        high52: "52H zirve uzaklığı",
        regime: "Piyasa rejimi",
        vix: "VIX",
        related: "İlgili araştırmalar",
        relatedDescription: "Bu ticker ile bağlantılı Flow raporları.",
        noReports: "İlgili Flow raporu bulunamadı.",
        openReport: "Raporu aç",
        earnings: "Bilanço",
        source: "Kaynak",
        disclaimer: "Karar destek çıktısıdır, yatırım tavsiyesi değildir. İşlem öncesi likiditeyi, katalizör zamanını ve geçersizlik seviyesini doğrula.",
      };

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/midas/signals", {
          cache: "no-store",
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setData((await response.json()) as MidasSignalsData);
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          setError(caughtError instanceof Error ? caughtError.message : "Midas snapshot unavailable");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [normalizedTicker]);

  const signal = useMemo(
    () => data?.signals.find(item => item.symbol.toUpperCase() === normalizedTicker) || null,
    [data, normalizedTicker]
  );
  const ledgerEntry = useMemo(
    () =>
      [...momentumV3.ledger]
        .filter(item => item.symbol === normalizedTicker)
        .sort((left, right) => (right.entryDate || "").localeCompare(left.entryDate || ""))[0] || null,
    [momentumV3.ledger, normalizedTicker]
  );
  const relatedReports = useMemo(
    () =>
      flow.reports
        .filter(
          report =>
            report.ticker.toUpperCase() === normalizedTicker ||
            report.tickerUniverse.some(item => item.toUpperCase() === normalizedTicker)
        )
        .slice(0, 3),
    [flow.reports, normalizedTicker]
  );

  if (loading) {
    return (
      <Card className="gap-4 border-sky-500/20 bg-sky-500/5" interactive={false}>
        <CardContent className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
          <Activity className="size-4 animate-pulse text-sky-300" />
          {copy.loading}
        </CardContent>
      </Card>
    );
  }

  if (!signal) {
    return (
      <Card className="gap-4 border-amber-500/25 bg-amber-500/5" interactive={false}>
        <CardHeader className="gap-2">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="size-4" />
            <CardTitle className="text-base">{copy.unavailable}</CardTitle>
          </div>
          <CardDescription>{error ? `${copy.unavailableDetail} (${error})` : copy.unavailableDetail}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const overallScore = deriveOverallScore(signal);
  const previousScore = ledgerEntry?.mss;
  const scoreDelta = typeof previousScore === "number" ? overallScore - previousScore : undefined;
  const availableFactors = FACTORS.filter(factor => factorValue(signal, factor) !== null);
  const rsi = readTechnicalNumber(signal, "rsi");
  const volumeRatio = readTechnicalNumber(signal, "volume_ratio");
  const vwapDistance = readTechnicalNumber(signal, "vwap_distance");
  const high52 = readTechnicalNumber(signal, "52w_high");
  const distanceToHigh = high52 && high52 > 0 ? (signal.price / high52 - 1) * 100 : undefined;
  const tradePlan = signal.trade_plan;
  const sizing = signal.position_sizing;

  return (
    <div className="space-y-4">
      <Card className="gap-0 overflow-hidden border-sky-500/20" interactive={false}>
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.80))] p-5 md:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">{copy.eyebrow}</span>
                <Badge variant="outline" className={signalClass(signal.signal)}>
                  {signalLabel(signal.signal, language)}
                </Badge>
                {signal.conviction_tier ? (
                  <Badge variant="outline" className="border-border bg-background/45 text-foreground">
                    Tier {signal.conviction_tier}
                  </Badge>
                ) : null}
              </div>
              <div>
                <h2 className="heading-condensed text-3xl text-foreground md:text-4xl">{copy.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{copy.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                <span className="rounded-full border border-border bg-background/55 px-3 py-1">
                  {copy.snapshot}: {formatTimestamp(signal.timestamp || data?.timestamp, language)}
                </span>
                <span className="rounded-full border border-border bg-background/55 px-3 py-1">
                  {copy.setup}: {signal.setup_type || "-"}
                </span>
                <span className="rounded-full border border-border bg-background/55 px-3 py-1">
                  {copy.direction}: {signal.direction || "-"}
                </span>
                {earningsDate ? (
                  <span className="rounded-full border border-border bg-background/55 px-3 py-1">
                    {copy.earnings}: {earningsDate}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid min-w-full grid-cols-2 gap-2 sm:min-w-[380px] sm:grid-cols-4 xl:min-w-[440px]">
              {[
                { label: copy.currentScore, value: Math.round(overallScore), className: scoreTone(overallScore) },
                { label: copy.previousScore, value: previousScore === undefined ? "-" : Math.round(previousScore), className: "text-foreground" },
                { label: copy.scoreChange, value: scoreDelta === undefined ? "-" : `${scoreDelta > 0 ? "+" : ""}${scoreDelta.toFixed(1)}`, className: scoreDelta !== undefined && scoreDelta >= 0 ? "text-emerald-300" : "text-rose-300" },
                { label: copy.dataCoverage, value: `${availableFactors.length}/6`, className: availableFactors.length === 6 ? "text-emerald-300" : "text-amber-300" },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-border bg-background/55 p-3 text-center">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
                  <p className={cn("data-mono mt-2 text-xl font-bold", item.className)}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="gap-4" interactive={false}>
        <CardHeader className="gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-sky-300" />
              <CardTitle>{copy.factors}</CardTitle>
            </div>
            <CardDescription className="mt-2">{copy.factorsDescription}</CardDescription>
          </div>
          <span className="text-[11px] text-muted-foreground">{copy.source}: Midas APEX</span>
        </CardHeader>
        <CardContent>
          {availableFactors.length ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {FACTORS.map(factor => {
                const value = factorValue(signal, factor);
                return (
                  <div key={factor.key} className="rounded-xl border border-border bg-background/35 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{factor.labels[isEnglish ? 1 : 0]}</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{factor.descriptions[isEnglish ? 1 : 0]}</p>
                      </div>
                      <span className={cn("data-mono text-lg font-bold", value ? scoreTone(value.normalized) : "text-muted-foreground")}>
                        {value ? Math.round(value.normalized) : "-"}
                      </span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-background/80">
                      <div
                        className={cn("h-full rounded-full", value && value.normalized >= 70 ? "bg-emerald-400" : value && value.normalized >= 45 ? "bg-amber-400" : "bg-rose-400")}
                        style={{ width: `${value?.normalized || 0}%` }}
                      />
                    </div>
                    <p className="data-mono mt-2 text-[10px] text-muted-foreground">
                      {value ? `${formatNumber(value.raw, 1)} / ${factor.weight} pts` : isEnglish ? "No data" : "Veri yok"}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">{copy.noFactors}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="gap-4" interactive={false}>
          <CardHeader className="gap-2">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-emerald-300" />
              <CardTitle>{copy.tradePlan}</CardTitle>
            </div>
            <CardDescription>{signal.notes || signal.signals.slice(0, 4).join(" · ")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tradePlan ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[
                    [copy.entry, formatUsd(tradePlan.entry)],
                    [copy.stop, formatUsd(tradePlan.stop)],
                    [copy.target1, formatUsd(tradePlan.target1)],
                    [copy.target2, formatUsd(tradePlan.target2)],
                    [copy.riskReward, `${formatNumber(tradePlan.rr_ratio, 1)}x`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-border bg-background/35 p-3">
                      <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                      <p className="data-mono mt-2 text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/8 px-3 py-2 text-xs text-rose-200">
                    {copy.stop}: -{formatNumber(tradePlan.stop_pct, 1)}%
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2 text-xs text-emerald-200">
                    {copy.target1}: {formatPercent((tradePlan.target1 / tradePlan.entry - 1) * 100)}
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2 text-xs text-emerald-200">
                    {copy.target2}: {formatPercent((tradePlan.target2 / tradePlan.entry - 1) * 100)}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{isEnglish ? "No executable trade plan is attached to this snapshot." : "Bu snapshot'a bağlı uygulanabilir işlem planı yok."}</p>
            )}

            {sizing ? (
              <div className="border-t border-border pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="size-4 text-sky-300" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{copy.position}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    [copy.shares, formatNumber(sizing.shares, 0)],
                    [copy.positionValue, formatUsd(sizing.position_value)],
                    [copy.dollarRisk, formatUsd(sizing.dollar_risk)],
                    [copy.accountRisk, `${formatNumber(sizing.risk_pct_of_account, 2)}%`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className="data-mono mt-1 text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="gap-4" interactive={false}>
          <CardHeader className="gap-2">
            <div className="flex items-center gap-2">
              <Gauge className="size-4 text-amber-300" />
              <CardTitle>{copy.context}</CardTitle>
            </div>
            <CardDescription>
              {data?.market_regime?.class || "-"} · {signal.riskLevel || "Risk n/a"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              [copy.rsi, formatNumber(rsi, 1)],
              [copy.volume, volumeRatio === undefined ? "-" : `${formatNumber(volumeRatio, 2)}x`],
              [copy.vwap, formatPercent(vwapDistance)],
              [copy.high52, formatPercent(distanceToHigh)],
              [copy.regime, data?.market_regime?.class || "-"],
              [copy.vix, formatNumber(data?.market_regime?.vix, 2)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border bg-background/35 p-3">
                <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                <p className="data-mono mt-2 text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="gap-4" interactive={false}>
        <CardHeader className="gap-2">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-sky-300" />
            <CardTitle>{copy.related}</CardTitle>
          </div>
          <CardDescription>{copy.relatedDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {flow.loading ? (
            <p className="text-sm text-muted-foreground">{isEnglish ? "Loading reports..." : "Raporlar yükleniyor..."}</p>
          ) : relatedReports.length ? (
            <div className="grid gap-3 md:grid-cols-3">
              {relatedReports.map(report => (
                <a
                  key={report.id}
                  href={reportHref(report.id)}
                  className="group rounded-xl border border-border bg-background/35 p-4 transition-colors hover:border-sky-400/30 hover:bg-sky-500/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant="outline" className="border-border bg-background/55">{report.reportDate}</Badge>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-sky-300" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{report.title}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{report.previewText}</p>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-300">{copy.openReport}</p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{flow.error ? `${copy.noReports} (${flow.error})` : copy.noReports}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background/35 px-4 py-3 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2"><Clock3 className="size-3.5" />{formatTimestamp(signal.timestamp || data?.timestamp, language)}</span>
        <span className="flex items-center gap-2"><Database className="size-3.5" />{data?.pipeline?.resolvedSourceFile || "Midas signal snapshot"}</span>
        <span className="flex items-center gap-2"><AlertTriangle className="size-3.5" />{copy.disclaimer}</span>
      </div>
    </div>
  );
}
