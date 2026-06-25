import { Wallet } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
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
    <section className="panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <Wallet className="size-4 text-sky-300" />
        <h2 className="heading-condensed text-base">
          {copy(language, "Bütçe Dostu Stratejiler", "Budget Friendly Strategies")}
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BUDGET_BUCKETS.map(bucket => (
          <div
            key={bucket}
            className="rounded-lg border border-border bg-background p-3"
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {bucket}
            </p>
            <div className="space-y-1.5">
              {grouped[bucket].slice(0, 8).map(strategy => (
                <div
                  key={strategy.ticker}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-foreground">
                    {strategy.ticker}
                  </span>
                  <span className="text-muted-foreground">
                    {strategy.budgetOptions.find(o =>
                      o.budget.toLowerCase().includes(bucket.toLowerCase())
                    )?.strategy || ""}
                  </span>
                </div>
              ))}
              {grouped[bucket].length === 0 && (
                <p className="text-xs text-muted-foreground">
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
