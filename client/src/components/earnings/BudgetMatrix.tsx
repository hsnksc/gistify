import { Wallet } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Strategy } from "@shared/earnings";

interface BudgetMatrixProps {
  language: AppLanguage;
  strategies: Strategy[];
}

const BUDGET_BUCKETS = [
  "$10-$50",
  "$50-$200",
  "$200-$500",
  "$500-$1000",
];

const BUCKET_COLORS = [
  "border-emerald-500/20 bg-emerald-500/5",
  "border-sky-500/20 bg-sky-500/5",
  "border-violet-500/20 bg-violet-500/5",
  "border-amber-500/20 bg-amber-500/5",
];

export default function BudgetMatrix({
  language,
  strategies,
}: BudgetMatrixProps) {
  const grouped: Record<string, Strategy[]> = {};
  for (const bucket of BUDGET_BUCKETS) grouped[bucket] = [];

  for (const strategy of strategies) {
    for (const option of strategy.budgetOptions) {
      const bucket = BUDGET_BUCKETS.find(b =>
        option.budget.toLowerCase().includes(b.toLowerCase())
      );
      if (bucket) {
        grouped[bucket].push(strategy);
      }
    }
  }

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <Wallet className="size-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">
          {copy(language, "Bütçe Dostu Stratejiler", "Budget Friendly Strategies")}
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BUDGET_BUCKETS.map((bucket, idx) => (
          <div
            key={bucket}
            className={cn(
              "rounded-2xl border p-5",
              BUCKET_COLORS[idx]
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                {bucket}
              </p>
              <span className="rounded-full bg-slate-900/60 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                {grouped[bucket].length}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {grouped[bucket].slice(0, 8).map(strategy => {
                const option = strategy.budgetOptions.find(o =>
                  o.budget.toLowerCase().includes(bucket.toLowerCase())
                );
                return (
                  <div
                    key={strategy.ticker}
                    className="flex items-center justify-between rounded-lg border border-slate-800/40 bg-slate-950/30 px-3 py-2 text-xs"
                  >
                    <span className="font-bold text-white">{strategy.ticker}</span>
                    <span className="text-slate-400">{option?.strategy}</span>
                  </div>
                );
              })}
              {grouped[bucket].length === 0 && (
                <p className="py-4 text-center text-xs text-slate-500">
                  {copy(language, "Veri yok", "No data")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
