import { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  CalendarDays,
  TrendingUp,
  Shield,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { PortfolioLevel } from "@shared/earnings";

interface PortfolioBuilderProps {
  language: AppLanguage;
  portfolio: PortfolioLevel[];
}

const BUDGETS = [
  { label: "$1K", value: "$1,000" },
  { label: "$5K", value: "$5,000" },
  { label: "$10K", value: "$10,000" },
  { label: "$25K", value: "$25,000" },
  { label: "$50K", value: "$50,000" },
];

const RISK_STYLES = {
  low: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    bar: "bg-emerald-500",
  },
  medium: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    bar: "bg-amber-500",
  },
  high: {
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    bar: "bg-rose-500",
  },
};

const SECTOR_COLORS = [
  "#38bdf8", // sky
  "#34d399", // emerald
  "#a78bfa", // violet
  "#fbbf24", // amber
  "#fb7185", // rose
  "#22d3ee", // cyan
  "#c084fc", // purple
  "#f472b6", // pink
];

const PORTFOLIO_BUDGET_STORAGE_KEY = "gistify:earnings:portfolio-budget";

function replaceBudgetQueryParam(value: string) {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  params.set("budget", value);
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", nextUrl);
}

function readStoredBudget() {
  if (typeof window === "undefined") {
    return "$1,000";
  }

  const queryBudget = new URLSearchParams(window.location.search).get("budget");
  if (queryBudget) {
    return queryBudget;
  }

  return (
    window.localStorage.getItem(PORTFOLIO_BUDGET_STORAGE_KEY) || "$1,000"
  );
}

export default function PortfolioBuilder({
  language,
  portfolio,
}: PortfolioBuilderProps) {
  const [selected, setSelected] = useState(() => readStoredBudget());
  const level = portfolio.find((l) => l.budget === selected);
  const recs = level?.recommendations ?? [];

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(PORTFOLIO_BUDGET_STORAGE_KEY, selected);
    replaceBudgetQueryParam(selected);
  }, [selected]);

  useEffect(() => {
    if (level || portfolio.length === 0) {
      return;
    }

    setSelected(portfolio[0].budget);
  }, [level, portfolio]);

  const totalAllocation = useMemo(() => {
    return recs.reduce((sum, r) => {
      const n = parseFloat(r.allocation?.replace(/[^0-9.]/g, "") ?? "0");
      return sum + (Number.isNaN(n) ? 0 : n);
    }, 0);
  }, [recs]);

  const sectorBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of recs) {
      const s = r.sector || "Unknown";
      const n = parseFloat(r.allocation?.replace(/[^0-9.]/g, "") ?? "0");
      map[s] = (map[s] || 0) + (Number.isNaN(n) ? 0 : n);
    }
    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      pct: (value / total) * 100,
    }));
  }, [recs]);

  const conicGradient = useMemo(() => {
    if (sectorBreakdown.length === 0) return "conic-gradient(#334155 0% 100%)";
    let angle = 0;
    const stops: string[] = [];
    for (const s of sectorBreakdown) {
      const next = angle + (s.pct || 0);
      stops.push(`${SECTOR_COLORS[stops.length % SECTOR_COLORS.length]} ${angle.toFixed(2)}% ${next.toFixed(2)}%`);
      angle = next;
    }
    return `conic-gradient(${stops.join(", ")})`;
  }, [sectorBreakdown]);

  const expectedReturnSum = useMemo(() => {
    return recs.reduce((sum, r) => {
      const n = parseFloat(r.expectedReturn?.replace(/[^0-9.]/g, "") ?? "0");
      return sum + (Number.isNaN(n) ? 0 : n);
    }, 0);
  }, [recs]);

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <PieChart className="size-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">
          {copy(language, "Portföy Önerileri", "Portfolio Recommendations")}
        </h2>
      </div>

      {/* Budget selector */}
      <div className="mb-5 flex flex-wrap gap-2">
        {BUDGETS.map((b) => {
          const exists = portfolio.some((l) => l.budget === b.value);
          const active = selected === b.value;
          return (
            <button
              key={b.value}
              disabled={!exists}
              onClick={() => setSelected(b.value)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200",
                active
                  ? "border-sky-500/40 bg-sky-500/20 text-sky-300 shadow"
                  : "border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white",
                !exists && "cursor-not-allowed opacity-40"
              )}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      {!level || recs.length === 0 ? (
        <p className="text-sm text-slate-400">
          {copy(language, "Bu bütçe için öneri bulunamadı.", "No recommendations for this budget.")}
        </p>
      ) : (
        <div className="space-y-5">
          {/* Top row: Pie chart + stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Pie chart */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                {copy(language, "Sektör Dağılımı", "Sector Allocation")}
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="size-28 shrink-0 rounded-full"
                  style={{ background: conicGradient }}
                />
                <div className="flex-1 space-y-2">
                  {sectorBreakdown.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <span
                        className="inline-block size-2.5 rounded-full"
                        style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }}
                      />
                      <span className="text-xs text-slate-300">{s.name}</span>
                      <span className="ml-auto text-xs font-bold text-slate-400">
                        {s.pct.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                  {sectorBreakdown.length === 0 && (
                    <p className="text-xs text-slate-500">{copy(language, "Veri yok", "No data")}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Expected return + total allocation */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                {copy(language, "Beklenen Getiri", "Expected Return")}
              </p>
              <p className="text-3xl font-bold text-emerald-400">
                +{expectedReturnSum.toFixed(1)}%
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {copy(language, "Tahmini portföy getirisi", "Estimated portfolio return")}
              </p>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    {copy(language, "Toplam Ağırlık", "Total Allocation")}
                  </span>
                  <span className="text-xs font-bold text-sky-400">{totalAllocation.toFixed(0)}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all duration-500"
                    style={{ width: `${Math.min(totalAllocation, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Risk matrix */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                {copy(language, "Risk Matrisi", "Risk Matrix")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { tr: "Düşük Olasılık / Düşük Etki", en: "Low Probability / Low Impact", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" },
                  { tr: "Düşük Olasılık / Yüksek Etki", en: "Low Probability / High Impact", color: "bg-amber-500/20 border-amber-500/30 text-amber-300" },
                  { tr: "Yüksek Olasılık / Düşük Etki", en: "High Probability / Low Impact", color: "bg-sky-500/20 border-sky-500/30 text-sky-300" },
                  { tr: "Yüksek Olasılık / Yüksek Etki", en: "High Probability / High Impact", color: "bg-rose-500/20 border-rose-500/30 text-rose-300" },
                ].map((cell) => (
                  <div
                    key={cell.tr}
                    className={cn(
                      "rounded-xl border p-2.5 text-center text-[10px] font-semibold leading-tight",
                      cell.color
                    )}
                  >
                    {copy(language, cell.tr, cell.en)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Allocation list */}
          <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              {copy(language, "Ayrıntılı Dağılım", "Detailed Allocation")}
            </p>
            <div className="space-y-3">
              {recs.map((rec, idx) => {
                const risk = (rec.risk || "medium") as "low" | "medium" | "high";
                const style = RISK_STYLES[risk] || RISK_STYLES.medium;
                return (
                  <div
                    key={`${rec.ticker}-${idx}`}
                    className="flex flex-col gap-3 rounded-xl border border-slate-800/60 bg-slate-900/50 p-4 transition-all hover:border-slate-700 sm:flex-row sm:items-center"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-slate-800">
                        <span className="text-sm font-bold text-white">{rec.ticker}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{rec.ticker}</p>
                        <p className="text-xs text-slate-400">{rec.strategy}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{copy(language, "Ağırlık", "Allocation")}</p>
                        <p className="text-sm font-bold text-sky-400">{rec.allocation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{copy(language, "Getiri", "Return")}</p>
                        <p className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                          <TrendingUp className="size-3" />
                          {rec.expectedReturn || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{copy(language, "Risk", "Risk")}</p>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold",
                            style.bg,
                            style.border,
                            style.text
                          )}
                        >
                          <Shield className="size-3" />
                          {rec.risk || "medium"}
                        </span>
                      </div>
                      {rec.fomcRisk && (
                        <div className="text-right">
                          <p className="text-xs text-slate-500">FOMC</p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                            <AlertTriangle className="size-3" />
                            {rec.fomcRisk}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Entry/Exit window */}
                    <div className="flex items-center gap-2 rounded-lg border border-slate-800/40 bg-slate-950/30 px-3 py-2 sm:ml-auto">
                      <CalendarDays className="size-3.5 text-slate-500" />
                      <span className="text-[10px] text-slate-400">
                        {rec.entryWindow || copy(language, "Giriş/Çıkış", "Entry/Exit")}
                      </span>
                      <ArrowRight className="size-3 text-slate-600" />
                      <span className="text-[10px] text-slate-400">
                        {rec.exitWindow || "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
