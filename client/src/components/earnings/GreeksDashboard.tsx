import { useState, useMemo } from "react";
import { Activity, ArrowUpDown, Filter } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Strategy } from "@shared/earnings";

interface GreeksDashboardProps {
  language: AppLanguage;
  strategies: Strategy[];
}

type GreekKey = "delta" | "theta" | "vega" | "gamma";

interface ParsedGreek {
  value: number;
  raw: string;
}

function parseGreek(val?: string): ParsedGreek {
  if (!val) return { value: 0, raw: "—" };
  const num = parseFloat(val.replace(/[$,]/g, ""));
  if (Number.isNaN(num)) return { value: 0, raw: val };
  return { value: num, raw: val };
}

function opacityLevel(val: number): string {
  const abs = Math.min(Math.abs(val), 1);
  if (abs >= 0.75) return "70";
  if (abs >= 0.50) return "50";
  if (abs >= 0.25) return "35";
  if (abs > 0) return "20";
  return "10";
}

function deltaCell(parsed: ParsedGreek): { bg: string; text: string } {
  if (parsed.value > 0) return { bg: `bg-emerald-500/${opacityLevel(parsed.value)}`, text: "text-emerald-300" };
  if (parsed.value < 0) return { bg: `bg-rose-500/${opacityLevel(parsed.value)}`, text: "text-rose-300" };
  return { bg: "bg-slate-700/20", text: "text-slate-500" };
}

function thetaCell(parsed: ParsedGreek): { bg: string; text: string } {
  if (parsed.value > 0) return { bg: `bg-emerald-500/${opacityLevel(parsed.value)}`, text: "text-emerald-300" };
  if (parsed.value < 0) return { bg: `bg-rose-500/${opacityLevel(parsed.value)}`, text: "text-rose-300" };
  return { bg: "bg-slate-700/20", text: "text-slate-500" };
}

function vegaCell(parsed: ParsedGreek): { bg: string; text: string } {
  // Vega negatif = IV crush kazancı (green)
  if (parsed.value < 0) return { bg: `bg-emerald-500/${opacityLevel(parsed.value)}`, text: "text-emerald-300" };
  if (parsed.value > 0) return { bg: `bg-rose-500/${opacityLevel(parsed.value)}`, text: "text-rose-300" };
  return { bg: "bg-slate-700/20", text: "text-slate-500" };
}

function gammaCell(parsed: ParsedGreek): { bg: string; text: string } {
  // Gamma yüksek = risk (amber)
  const abs = Math.abs(parsed.value);
  if (abs >= 0.10) return { bg: `bg-amber-500/${opacityLevel(abs)}`, text: "text-amber-300" };
  if (abs > 0) return { bg: `bg-sky-500/${opacityLevel(abs)}`, text: "text-sky-300" };
  return { bg: "bg-slate-700/20", text: "text-slate-500" };
}

const GREEKS: { key: GreekKey; symbol: string; label: string }[] = [
  { key: "delta", symbol: "Δ", label: "Delta" },
  { key: "theta", symbol: "Θ", label: "Theta" },
  { key: "vega", symbol: "V", label: "Vega" },
  { key: "gamma", symbol: "Γ", label: "Gamma" },
];

export default function GreeksDashboard({
  language,
  strategies,
}: GreeksDashboardProps) {
  const [sortKey, setSortKey] = useState<GreekKey | "ticker">("ticker");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [sectorFilter, setSectorFilter] = useState<string>("All");

  const withGreeks = useMemo(
    () => strategies.filter((s) => s.greeks && (s.greeks.delta || s.greeks.theta || s.greeks.vega || s.greeks.gamma)),
    [strategies]
  );

  const sectors = useMemo(() => {
    const set = new Set<string>();
    for (const s of withGreeks) {
      const sec = s.sector || s.type || "Unknown";
      set.add(sec);
    }
    return ["All", ...Array.from(set)];
  }, [withGreeks]);

  const filtered = useMemo(() => {
    if (sectorFilter === "All") return withGreeks;
    return withGreeks.filter((s) => (s.sector || s.type || "Unknown") === sectorFilter);
  }, [withGreeks, sectorFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let aVal = 0;
      let bVal = 0;
      if (sortKey === "ticker") {
        aVal = a.ticker.localeCompare(b.ticker) as unknown as number;
        bVal = 0;
        return sortDir === "asc" ? (aVal as unknown as number) : -(aVal as unknown as number);
      }
      aVal = parseGreek(a.greeks?.[sortKey]).value;
      bVal = parseGreek(b.greeks?.[sortKey]).value;
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: GreekKey | "ticker") {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  if (withGreeks.length === 0) {
    return (
      <section className="panel p-5 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="size-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white">
            {copy(language, "Greeks Dashboard", "Greeks Dashboard")}
          </h2>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
          {copy(
            language,
            "Henüz Greeks verisi gelmedi. Opsiyon risk haritasi veri bekliyor.",
            "Greeks data not yet available. Option risk map awaiting data."
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white">
            {copy(language, "Greeks Dashboard", "Greeks Dashboard")}
          </h2>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-400">
            {sorted.length}
          </span>
        </div>

        {/* Sector filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="size-3.5 shrink-0 text-slate-500" />
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSectorFilter(sec)}
              className={cn(
                "shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all",
                sectorFilter === sec
                  ? "border-sky-500/40 bg-sky-500/15 text-sky-300"
                  : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
              )}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
          {copy(
            language,
            "Aktif filtre ile eslesen Greeks satiri yok.",
            "No Greeks rows match the active filter."
          )}
        </div>
      ) : (
        <div className="max-h-[500px] overflow-y-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur">
              <tr className="border-b border-white/10">
                <th
                  className="cursor-pointer select-none py-3 pl-4 pr-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white"
                  onClick={() => handleSort("ticker")}
                >
                  <div className="flex items-center gap-1">
                    {copy(language, "Hisse", "Ticker")}
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                {GREEKS.map((g) => (
                  <th
                    key={g.key}
                    className="cursor-pointer select-none py-3 px-2 text-xs font-bold uppercase tracking-wider text-sky-300 hover:text-white"
                    onClick={() => handleSort(g.key)}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-base">{g.symbol}</span>
                      <span className="text-[10px] text-slate-500">{g.label}</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                ))}
                <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  IV Rank
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sorted.map((strategy, idx) => {
                const d = parseGreek(strategy.greeks?.delta);
                const t = parseGreek(strategy.greeks?.theta);
                const v = parseGreek(strategy.greeks?.vega);
                const g = parseGreek(strategy.greeks?.gamma);
                const dc = deltaCell(d);
                const tc = thetaCell(t);
                const vc = vegaCell(v);
                const gc = gammaCell(g);
                return (
                  <tr
                    key={strategy.ticker}
                    className={cn(
                      "transition-colors hover:bg-slate-800/40",
                      idx % 2 === 0 ? "bg-slate-900/20" : "bg-transparent"
                    )}
                  >
                    <td className="py-3 pl-4 pr-2">
                      <div>
                        <span className="font-bold text-white">{strategy.ticker}</span>
                        <p className="text-[10px] text-slate-500">
                          {strategy.sector || strategy.type || "—"}
                        </p>
                      </div>
                    </td>
                    <td className={cn("px-2 py-3 text-center", dc.bg)}>
                      <span className={cn("text-xs font-bold", dc.text)}>{d.raw}</span>
                    </td>
                    <td className={cn("px-2 py-3 text-center", tc.bg)}>
                      <span className={cn("text-xs font-bold", tc.text)}>{t.raw}</span>
                    </td>
                    <td className={cn("px-2 py-3 text-center", vc.bg)}>
                      <span className={cn("text-xs font-bold", vc.text)}>{v.raw}</span>
                    </td>
                    <td className={cn("px-2 py-3 text-center", gc.bg)}>
                      <span className={cn("text-xs font-bold", gc.text)}>{g.raw}</span>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <span className="text-xs text-slate-400">{strategy.ivRank || "—"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm bg-emerald-500/40" />
          <span>{copy(language, "Delta / Theta pozitif", "Delta / Theta positive")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm bg-rose-500/40" />
          <span>{copy(language, "Delta / Theta negatif", "Delta / Theta negative")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm bg-emerald-500/40" />
          <span>{copy(language, "Vega negatif (IV crush kazancı)", "Vega negative (IV crush gain)")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm bg-amber-500/40" />
          <span>{copy(language, "Gamma yüksek (risk)", "Gamma high (risk)")}</span>
        </div>
      </div>
    </section>
  );
}
