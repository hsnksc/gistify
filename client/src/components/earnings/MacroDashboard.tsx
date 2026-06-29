import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Bitcoin,
  Gauge,
} from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { MacroData } from "@shared/earnings";

interface MacroDashboardProps {
  language: AppLanguage;
  macro: MacroData;
}

export default function MacroDashboard({ language, macro }: MacroDashboardProps) {
  const items: MacroItem[] = [
    { key: "vix", label: "VIX", value: macro.vix || "", big: true },
    { key: "sp500", label: "S&P 500", value: macro.sp500 || "", big: true },
    { key: "nasdaq", label: "Nasdaq", value: macro.nasdaq || "", big: true },
    { key: "russell2000", label: "Russell 2000", value: macro.russell2000 || "" },
    { key: "tenYearYield", label: "10Y Yield", value: macro.tenYearYield || "" },
    { key: "dxy", label: "DXY", value: macro.dxy || "" },
    { key: "wti", label: "WTI", value: macro.wti || "" },
    { key: "bitcoin", label: "Bitcoin", value: macro.bitcoin || "" },
    { key: "fearGreed", label: "Fear & Greed", value: macro.fearGreed || "", gauge: true },
  ];

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="size-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">
          {copy(language, "Makro Dashboard", "Macro Dashboard")}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map(item =>
          item.value ? (
            <MacroCard key={item.key} language={language} item={item} />
          ) : null
        )}
      </div>
      {macro.regime && (
        <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            {copy(language, "Rejim", "Regime")}
          </p>
          <p className="mt-1 text-lg font-bold text-white">{macro.regime}</p>
          {macro.notes && macro.notes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {macro.notes.map((note, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-slate-900/50 px-2.5 py-1 text-[11px] text-slate-300"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

interface MacroItem {
  key: string;
  label: string;
  value: string;
  big?: boolean;
  gauge?: boolean;
}

function MacroCard({ language, item }: { language: AppLanguage; item: MacroItem }) {
  const isVIX = item.key === "vix";
  const vixNum = isVIX ? parseFloat(item.value.replace(/[^0-9.]/g, "")) : NaN;

  const vixBorder =
    !Number.isNaN(vixNum) && vixNum >= 25
      ? "border-rose-500/30 bg-rose-500/10"
      : !Number.isNaN(vixNum) && vixNum >= 20
        ? "border-amber-500/30 bg-amber-500/10"
        : "border-emerald-500/30 bg-emerald-500/10";

  const vixText =
    !Number.isNaN(vixNum) && vixNum >= 25
      ? "text-rose-400"
      : !Number.isNaN(vixNum) && vixNum >= 20
        ? "text-amber-400"
        : "text-emerald-400";

  const vixGaugeWidth = !Number.isNaN(vixNum) ? Math.min((vixNum / 50) * 100, 100) : 0;

  const changeDir = item.value.includes("-")
    ? "down"
    : item.value.includes("+")
      ? "up"
      : "flat";
  const directionColor =
    changeDir === "up"
      ? "text-emerald-400"
      : changeDir === "down"
        ? "text-rose-400"
        : "text-slate-400";

  const iconForKey = (key: string) => {
    if (key === "bitcoin") return <Bitcoin className="size-4 text-orange-400" />;
    if (key === "tenYearYield" || key === "dxy")
      return <DollarSign className="size-4 text-sky-400" />;
    if (key === "fearGreed") return <Gauge className="size-4 text-violet-400" />;
    if (changeDir === "up") return <TrendingUp className="size-4 text-emerald-400" />;
    if (changeDir === "down") return <TrendingDown className="size-4 text-rose-400" />;
    return <Minus className="size-4 text-slate-500" />;
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        isVIX
          ? vixBorder
          : "border-white/10 bg-slate-800/50 hover:border-white/20 hover:bg-slate-800/70"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {item.label}
        </p>
        {iconForKey(item.key)}
      </div>

      <p
        className={cn(
          "mt-3 font-bold tracking-tight",
          isVIX ? "text-4xl" : item.big ? "text-2xl" : "text-xl",
          isVIX ? vixText : "text-white"
        )}
      >
        {item.value}
      </p>

      {/* VIX mini gauge */}
      {isVIX && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn("h-full rounded-full", vixText.replace("text-", "bg-"))}
              style={{ width: `${vixGaugeWidth}%` }}
            />
          </div>
        </div>
      )}

      {item.gauge && <FearGreedGauge value={item.value} language={language} />}
    </div>
  );
}

function FearGreedGauge({ value, language }: { value: string; language: AppLanguage }) {
  const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const pct = Number.isFinite(num) ? num : 50;

  let color = "bg-slate-500";
  if (pct >= 75) color = "bg-emerald-500";
  else if (pct >= 55) color = "bg-emerald-400";
  else if (pct >= 45) color = "bg-amber-400";
  else if (pct >= 25) color = "bg-rose-400";
  else color = "bg-rose-500";

  return (
    <div className="mt-3">
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-500">
        <span>{copy(language, "Aşırı Korku", "Extreme Fear")}</span>
        <span>{copy(language, "Aşırı Açgözlülük", "Extreme Greed")}</span>
      </div>
    </div>
  );
}
