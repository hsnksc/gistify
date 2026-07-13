import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Activity, AlertTriangle, BrainCircuit, Gauge, ShieldCheck, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import type { EarningsStrategyData } from "@shared/earnings";
import { type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function EarningsQuantCommandCenter({
  data,
  language,
}: {
  data: EarningsStrategyData;
  language: AppLanguage;
}) {
  const candidates = useMemo(
    () => data.strategies.filter(strategy => strategy.intelligence),
    [data.strategies]
  );
  const [ticker, setTicker] = useState(candidates[0]?.ticker || "");

  useEffect(() => {
    if (!candidates.some(item => item.ticker === ticker)) {
      setTicker(candidates[0]?.ticker || "");
    }
  }, [candidates, ticker]);

  const selected = candidates.find(item => item.ticker === ticker);
  const overview = data.quantOverview;
  if (!selected?.intelligence || !overview) return null;
  const intelligence = selected.intelligence;
  const tr = language === "tr";

  return (
    <section className="panel overflow-hidden border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.08] via-slate-950/80 to-violet-500/[0.06] p-5 md:p-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-300">
            <BrainCircuit className="size-5" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em]">
              {tr ? "Earnings Quant Intelligence" : "Earnings Quant Intelligence"}
            </p>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
            {tr ? "Günlük koşullara uyarlanan opsiyon karar motoru" : "Options decisions that adapt to daily conditions"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {overview.methodology} {tr
              ? "Her sonuç veri kalitesi etiketi, değişim gerekçesi ve işlem öncesi doğrulama uyarılarıyla birlikte sunulur."
              : "Every result includes data-quality labeling, change rationale, and pre-trade validation warnings."}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 xl:w-[560px]">
          <OverviewMetric label={tr ? "Canlı" : "Live"} value={`%${overview.liveCoverage}`} tone="cyan" />
          <OverviewMetric label={tr ? "Boğa" : "Bull"} value={overview.bullish} tone="emerald" />
          <OverviewMetric label={tr ? "Nötr" : "Neutral"} value={overview.neutral} tone="slate" />
          <OverviewMetric label={tr ? "Ayı" : "Bear"} value={overview.bearish} tone="rose" />
          <OverviewMetric label={tr ? "Değişim" : "Changes"} value={overview.strategyChanges} tone="amber" />
          <OverviewMetric label={tr ? "Kritik" : "Critical"} value={overview.criticalAlerts} tone="rose" />
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {candidates.map(strategy => (
          <button
            key={strategy.ticker}
            type="button"
            onClick={() => setTicker(strategy.ticker)}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-2 text-left transition-colors",
              ticker === strategy.ticker
                ? "border-cyan-400/40 bg-cyan-400/10 text-white"
                : "border-white/8 bg-slate-950/30 text-slate-400 hover:border-white/20"
            )}
          >
            <span className="text-xs font-bold">{strategy.ticker}</span>
            {strategy.intelligence?.decision.changed ? (
              <span className="ml-2 text-[9px] font-bold text-amber-300">∆</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white">{selected.ticker}</span>
                <BiasBadge bias={intelligence.decision.bias} />
              </div>
              <p className="mt-1 text-xs text-slate-500">{selected.company}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xl font-bold text-white">${intelligence.market.spot.toFixed(2)}</p>
              <p className={cn("text-xs font-bold", (intelligence.market.change1d || 0) >= 0 ? "text-emerald-400" : "text-rose-400")}>
                {intelligence.market.change1d === undefined ? "1D —" : `1D ${intelligence.market.change1d > 0 ? "+" : ""}${intelligence.market.change1d}%`}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">{tr ? "Motorun seçimi" : "Engine selection"}</p>
                <p className="mt-1 text-lg font-bold text-white">{intelligence.decision.strategy}</p>
                <div className="mt-2"><TradeStatusBadge status={intelligence.decision.tradeStatus} /></div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{tr ? "Güven" : "Confidence"}</p>
                <p className="font-mono text-lg font-bold text-cyan-300">%{intelligence.decision.confidence}</p>
              </div>
            </div>
            {intelligence.decision.changed ? (
              <p className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs leading-5 text-amber-200">
                {tr ? "Strateji değişimi:" : "Strategy change:"} {intelligence.decision.previousStrategy} → {intelligence.decision.strategy}
              </p>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Metric label="RSI(14)" value={intelligence.market.rsi14?.toFixed(1) || "—"} />
            <Metric label="CALL/PUT" value={intelligence.options.callPutRatio?.toFixed(2) || "—"} />
            <Metric label="IV RANK" value={intelligence.options.ivRank?.toFixed(0) || "—"} />
            <Metric label="DTE" value={intelligence.options.dte} />
            <Metric label="EXP MOVE" value={`±${intelligence.options.expectedMovePercent}%`} />
            <Metric label="POP" value={`%${intelligence.options.probabilityOfProfit}`} />
            <Metric label="MAX RISK" value={`$${intelligence.options.maxLoss}`} />
            <Metric label={`KELLY ${intelligence.options.kellyMultiplier.toFixed(2)}×`} value={`%${intelligence.options.kellyFraction}`} />
            <Metric label="JUMP VOL" value={`%${intelligence.options.eventJumpVolatility}`} />
            <Metric label="NET EV" value={`$${intelligence.options.expectedValueAfterCosts}`} />
            <Metric label="SLIPPAGE" value={`$${intelligence.options.estimatedSlippage}`} />
            <Metric label="CVaR 95" value={`$${intelligence.options.cvar95}`} />
            <Metric label="STRESS LOSS" value={`$${intelligence.options.stressLoss}`} />
            <Metric label="STRUCT VOL" value={`%${intelligence.options.structuralVolatility}`} />
          </div>
        </article>

        <article className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">{tr ? "Yapı ve risk planı" : "Structure and risk plan"}</p>
            </div>
            <span className={cn(
              "rounded-full border px-2 py-0.5 text-[9px] font-bold",
              intelligence.dataQuality === "live" ? "border-emerald-400/30 text-emerald-300" : "border-amber-400/30 text-amber-300"
            )}>{intelligence.dataQuality === "live" ? "LIVE + MODEL" : "MODEL / VERIFY"}</span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {intelligence.decision.legs.map((leg, index) => (
              <div key={`${selected.ticker}-${index}-${leg.strike}`} className="flex items-center justify-between rounded-lg border border-white/7 bg-slate-900/60 px-3 py-2.5 text-xs">
                <span className={cn("font-bold", leg.action === "BUY" ? "text-emerald-400" : "text-rose-400")}>{leg.action} {leg.quantity}×</span>
                <span className="text-slate-300">{leg.strike} {leg.optionType} · {leg.dte}D</span>
                <span className="font-mono text-slate-500">~${leg.modeledPremium}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Rule icon={<Gauge className="size-4 text-sky-400" />} label={tr ? "Giriş" : "Entry"} text={intelligence.decision.entryRule} />
            <Rule icon={<Sparkles className="size-4 text-violet-400" />} label={tr ? "Çıkış" : "Exit"} text={intelligence.decision.exitRule} />
          </div>

          <div className="mt-4 space-y-2">
            {intelligence.decision.rationale.map(item => (
              <p key={item} className="text-xs leading-5 text-slate-400">• {item}</p>
            ))}
          </div>

          {intelligence.alerts.length ? (
            <div className="mt-4 space-y-2 border-t border-white/8 pt-4">
              {intelligence.alerts.slice(0, 3).map(alert => (
                <div key={alert.title} className={cn(
                  "flex gap-2.5 rounded-lg border p-3",
                  alert.severity === "critical" ? "border-rose-400/20 bg-rose-400/[0.06]" : alert.severity === "warning" ? "border-amber-400/20 bg-amber-400/[0.06]" : "border-sky-400/20 bg-sky-400/[0.05]"
                )}>
                  <AlertTriangle className={cn("mt-0.5 size-4 shrink-0", alert.severity === "critical" ? "text-rose-400" : alert.severity === "warning" ? "text-amber-400" : "text-sky-400")} />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{alert.title}</p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-400">{alert.detail} {alert.action}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <p className="mt-4 border-t border-white/8 pt-3 text-[10px] leading-4 text-slate-600">
            {intelligence.sourceNote}. {tr ? "Model primleri gerçek bid/ask değildir; emir öncesi broker zinciriyle doğrulayın." : "Modeled premiums are not live bid/ask quotes; verify against your broker chain before trading."}
          </p>
        </article>
      </div>

      {intelligence.options.advanced ? (
        <article className="mt-4 rounded-xl border border-violet-400/20 bg-slate-950/45 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">OPTION CHAIN INTELLIGENCE</p>
              <p className="mt-1 text-xs text-slate-500">{intelligence.options.advanced.provider} · {intelligence.options.pricingModel}</p>
            </div>
            <span className={cn(
              "rounded-full border px-2.5 py-1 text-[9px] font-black",
              intelligence.options.advanced.status === "READY" ? "border-emerald-400/30 text-emerald-300" : intelligence.options.advanced.status === "DEGRADED" ? "border-amber-400/30 text-amber-300" : "border-rose-400/30 text-rose-300"
            )}>{intelligence.options.advanced.status}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
            <Metric label="CONTRACTS" value={intelligence.options.advanced.chainContracts} />
            <Metric label="LIQUID" value={intelligence.options.advanced.liquidContracts} />
            <Metric label="PUT/CALL VOL" value={intelligence.options.advanced.volumePutCallRatio?.toFixed(2) || "—"} />
            <Metric label="PUT/CALL OI" value={intelligence.options.advanced.openInterestPutCallRatio?.toFixed(2) || "—"} />
            <Metric label="ATM IV" value={intelligence.options.advanced.atmIv ? `%${intelligence.options.advanced.atmIv}` : "—"} />
            <Metric label="PUT-CALL SKEW" value={intelligence.options.advanced.ivPutCallSkew ? `${intelligence.options.advanced.ivPutCallSkew} vol` : "—"} />
            <Metric label="TERM SLOPE" value={intelligence.options.advanced.termStructureSlope ? `${intelligence.options.advanced.termStructureSlope} vol` : "—"} />
            <Metric label="IV CRUSH" value={intelligence.options.advanced.ivCrushEstimate ? `%${intelligence.options.advanced.ivCrushEstimate}` : "—"} />
            <Metric label="RND DOWN" value={intelligence.options.advanced.rnd.downsideProbability === undefined ? "—" : `%${intelligence.options.advanced.rnd.downsideProbability}`} />
            <Metric label="RND E[S]" value={intelligence.options.advanced.rnd.expectedPrice ? `$${intelligence.options.advanced.rnd.expectedPrice}` : "—"} />
            <Metric label="MOMENTUM" value={`${intelligence.options.advanced.momentum.score}`} />
            <Metric label="MOM REGIME" value={intelligence.options.advanced.momentum.regime} />
            <Metric label="SVI SLICES" value={intelligence.options.advanced.surface.length} />
            <Metric label="QUOTE COVER" value={`%${intelligence.options.advanced.quoteCoveragePercent}`} />
            <Metric label="STALE" value={`%${intelligence.options.advanced.staleQuotePercent}`} />
            <Metric label="JUMP SAMPLE" value={intelligence.options.advanced.jumpModel.historicalSamples} />
          </div>
          {intelligence.options.advanced.qualityGates.length ? (
            <p className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 text-[11px] text-amber-200">
              {tr ? "Veri kalite kapıları" : "Data quality gates"}: {intelligence.options.advanced.qualityGates.join(" · ")}
            </p>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}

function OverviewMetric({ label, value, tone }: { label: string; value: string | number; tone: "cyan" | "emerald" | "slate" | "rose" | "amber" }) {
  const tones = { cyan: "text-cyan-300", emerald: "text-emerald-300", slate: "text-slate-300", rose: "text-rose-300", amber: "text-amber-300" };
  return <div className="rounded-xl border border-white/8 bg-slate-950/45 p-2.5 text-center"><p className={cn("font-mono text-lg font-black", tones[tone])}>{value}</p><p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-600">{label}</p></div>;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border border-white/7 bg-slate-900/50 p-2.5"><p className="text-[9px] font-bold tracking-wider text-slate-600">{label}</p><p className="mt-1 font-mono text-sm font-bold text-slate-200">{value}</p></div>;
}

function BiasBadge({ bias }: { bias: "bullish" | "neutral" | "bearish" }) {
  const Icon = bias === "bullish" ? TrendingUp : bias === "bearish" ? TrendingDown : Activity;
  return <span className={cn("flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold uppercase", bias === "bullish" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : bias === "bearish" ? "border-rose-400/20 bg-rose-400/10 text-rose-300" : "border-slate-400/20 bg-slate-400/10 text-slate-300")}><Icon className="size-3" />{bias}</span>;
}

function TradeStatusBadge({ status }: { status: "TRADE" | "WATCH" | "BLOCKED" }) {
  return <span className={cn(
    "inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black tracking-wider",
    status === "TRADE"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      : status === "WATCH"
        ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
        : "border-rose-400/30 bg-rose-400/10 text-rose-300"
  )}>{status}</span>;
}

function Rule({ icon, label, text }: { icon: ReactNode; label: string; text: string }) {
  return <div className="rounded-lg border border-white/7 bg-slate-900/50 p-3"><div className="flex items-center gap-2">{icon}<span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span></div><p className="mt-2 text-[11px] leading-5 text-slate-300">{text}</p></div>;
}
