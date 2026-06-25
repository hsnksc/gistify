import { useMemo } from "react";
import { Wallet, TrendingUp, DollarSign, Minus } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Strategy } from "@shared/earnings";

interface BudgetMatrixProps {
  language: AppLanguage;
  strategies: Strategy[];
}

interface BucketConfig {
  label: string;
  note: string;
  accentBorder: string;
  accentBg: string;
  accentText: string;
  accentMuted: string;
  chipBorder: string;
  chipBg: string;
  chipText: string;
  badgeBg: string;
  badgeText: string;
}

const BUCKETS: BucketConfig[] = [
  {
    label: "$10 – $50",
    note: "Min 2x getiri potansiyeli",
    accentBorder: "border-emerald-500/30",
    accentBg: "bg-emerald-500/5",
    accentText: "text-emerald-400",
    accentMuted: "text-emerald-500/60",
    chipBorder: "border-emerald-500/20",
    chipBg: "bg-emerald-500/10",
    chipText: "text-emerald-300",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-400",
  },
  {
    label: "$50 – $200",
    note: "Debit spread & long call",
    accentBorder: "border-sky-500/30",
    accentBg: "bg-sky-500/5",
    accentText: "text-sky-400",
    accentMuted: "text-sky-500/60",
    chipBorder: "border-sky-500/20",
    chipBg: "bg-sky-500/10",
    chipText: "text-sky-300",
    badgeBg: "bg-sky-500/15",
    badgeText: "text-sky-400",
  },
  {
    label: "$200 – $500",
    note: "Butterfly & iron condor",
    accentBorder: "border-violet-500/30",
    accentBg: "bg-violet-500/5",
    accentText: "text-violet-400",
    accentMuted: "text-violet-500/60",
    chipBorder: "border-violet-500/20",
    chipBg: "bg-violet-500/10",
    chipText: "text-violet-300",
    badgeBg: "bg-violet-500/15",
    badgeText: "text-violet-400",
  },
  {
    label: "$500 – $1,000",
    note: "Ratio spread & complex",
    accentBorder: "border-amber-500/30",
    accentBg: "bg-amber-500/5",
    accentText: "text-amber-400",
    accentMuted: "text-amber-500/60",
    chipBorder: "border-amber-500/20",
    chipBg: "bg-amber-500/10",
    chipText: "text-amber-300",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-400",
  },
];

const STRATEGY_TYPES = ["Long Call", "Debit Spread", "Butterfly", "Ratio Spread"];

export default function BudgetMatrix({
  language,
  strategies,
}: BudgetMatrixProps) {
  if (strategies.length === 0) {
    return (
      <section className="panel p-5 md:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Wallet className="size-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white">
            {copy(language, "Bütçe Dostu Stratejiler", "Budget Friendly Strategies")}
          </h2>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
          {copy(
            language,
            "Bu lens icin henuz butceye gore eslesmis setup yok.",
            "No budget-aligned setup is available for this lens yet."
          )}
        </div>
      </section>
    );
  }

  const grouped = useMemo(() => {
    const map: Record<number, Strategy[]> = { 0: [], 1: [], 2: [], 3: [] };
    for (const s of strategies) {
      for (const opt of s.budgetOptions) {
        const b = opt.budget.toLowerCase();
        if (b.includes("10") || b.includes("50")) {
          // only first bucket if it matches 10-50 exactly-ish
          if (!b.includes("200") && !b.includes("500") && !b.includes("1000")) {
            map[0].push(s);
            continue;
          }
        }
        if (b.includes("50") && b.includes("200") && !b.includes("10")) {
          map[1].push(s);
          continue;
        }
        if (b.includes("200") && b.includes("500")) {
          map[2].push(s);
          continue;
        }
        if (b.includes("500") && b.includes("1000")) {
          map[3].push(s);
          continue;
        }
        // Fallback: try to parse a number
        const num = parseFloat(b.replace(/[^0-9.]/g, ""));
        if (!Number.isNaN(num)) {
          if (num <= 50) map[0].push(s);
          else if (num <= 200) map[1].push(s);
          else if (num <= 500) map[2].push(s);
          else map[3].push(s);
        }
      }
    }
    // dedupe per bucket
    for (let i = 0; i < 4; i++) {
      const seen = new Set<string>();
      map[i] = map[i].filter((s) => {
        if (seen.has(s.ticker)) return false;
        seen.add(s.ticker);
        return true;
      });
    }
    return map;
  }, [strategies]);

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <Wallet className="size-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">
          {copy(language, "Bütçe Dostu Stratejiler", "Budget Friendly Strategies")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {BUCKETS.map((bucket, idx) => {
          const items = grouped[idx];
          return (
            <div
              key={bucket.label}
              className={cn(
                "rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg",
                bucket.accentBorder,
                bucket.accentBg,
                "bg-slate-800/50"
              )}
            >
              <div className="mb-1">
                <p className={cn("text-xl font-bold", bucket.accentText)}>
                  {bucket.label}
                </p>
                <p className={cn("text-xs", bucket.accentMuted)}>
                  {copy(language, bucket.note, bucket.note)}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {STRATEGY_TYPES.map((stype, sidx) => {
                  const matched = items
                    .filter((s) => {
                      const opt = s.budgetOptions.find((o) => {
                        const b = o.budget.toLowerCase();
                        if (idx === 0)
                          return (
                            (b.includes("10") || b.includes("50")) &&
                            !b.includes("200") &&
                            !b.includes("500") &&
                            !b.includes("1000")
                          );
                        if (idx === 1)
                          return b.includes("50") && b.includes("200") && !b.includes("10");
                        if (idx === 2) return b.includes("200") && b.includes("500");
                        return b.includes("500") && b.includes("1000");
                      });
                      return opt?.strategy?.toLowerCase().includes(stype.toLowerCase());
                    })
                    .slice(0, 5);

                  if (matched.length === 0) return null;

                  return (
                    <div key={stype}>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {stype}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {matched.map((s) => {
                          const opt = s.budgetOptions.find((o) => {
                            const b = o.budget.toLowerCase();
                            if (idx === 0)
                              return (
                                (b.includes("10") || b.includes("50")) &&
                                !b.includes("200")
                              );
                            if (idx === 1)
                              return b.includes("50") && b.includes("200");
                            if (idx === 2) return b.includes("200") && b.includes("500");
                            return b.includes("500") && b.includes("1000");
                          });
                          return (
                            <div
                              key={s.ticker}
                              className={cn(
                                "flex items-center gap-1.5 rounded-xl border px-3 py-2",
                                bucket.chipBorder,
                                bucket.chipBg
                              )}
                            >
                              <span className={cn("text-xs font-bold", bucket.chipText)}>
                                {s.ticker}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {opt?.strategy}
                              </span>
                              {opt?.cost && (
                                <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
                                  <DollarSign className="size-2.5" />
                                  {opt.cost}
                                </span>
                              )}
                              {opt?.maxReturn && (
                                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400">
                                  <TrendingUp className="size-2.5" />
                                  {opt.maxReturn}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-700/70 bg-slate-900/30 px-3 py-4 text-center">
                    <Minus className="mx-auto size-4 text-slate-500" />
                    <p className="mt-2 text-xs text-slate-500">
                      {copy(
                        language,
                        "Bu butce bandinda uygun setup yok.",
                        "No matching setup in this budget band."
                      )}
                    </p>
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                  <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold", bucket.badgeBg, bucket.badgeText)}>
                    {items.length} {copy(language, "hisse", "tickers")}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {copy(language, "2x potansiyel", "2x potential")}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
