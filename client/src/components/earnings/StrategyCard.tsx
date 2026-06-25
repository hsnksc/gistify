import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Strategy } from "@shared/earnings";

interface StrategyCardProps {
  language: AppLanguage;
  strategy: Strategy;
}

export default function StrategyCard({ language, strategy }: StrategyCardProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-3 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-foreground">
              {strategy.ticker}
            </span>
            {strategy.sector && (
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {strategy.sector}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {strategy.price && `${copy(language, "Fiyat", "Price")}: ${strategy.price} · `}
            {strategy.ivRank && `IV Rank: ${strategy.ivRank}`}
          </p>
        </div>
        <CPRBadge cpr={strategy.cpr} />
      </div>

      <div className="mt-3 space-y-2">
        <div className="rounded-lg border border-border bg-black/20 p-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {copy(language, "Ana Strateji", "Main Strategy")}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {strategy.type || "-"}
          </p>
          {strategy.credit && (
            <p className="text-xs text-muted-foreground">
              {copy(language, "Kredi", "Credit")}: {strategy.credit}
              {strategy.maxRisk && ` · ${copy(language, "Max Risk", "Max Risk")}: ${strategy.maxRisk}`}
            </p>
          )}
          {strategy.koProbability && (
            <p className="text-xs text-emerald-300">
              {copy(language, "K.O. Olasılığı", "K.O. Probability")}: {strategy.koProbability}
            </p>
          )}
        </div>

        {strategy.greeks && (
          <div className="grid grid-cols-4 gap-1 text-[10px]">
            <GreekItem label="Δ" value={strategy.greeks.delta} />
            <GreekItem label="Θ" value={strategy.greeks.theta} />
            <GreekItem label="V" value={strategy.greeks.vega} />
            <GreekItem label="Γ" value={strategy.greeks.gamma} />
          </div>
        )}

        {strategy.budgetOptions.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {copy(language, "Bütçe Dostu", "Budget Friendly")}
            </p>
            {strategy.budgetOptions.slice(0, 3).map((option, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground">{option.budget}</span>
                <span className="text-foreground">{option.strategy}</span>
                <span className="text-muted-foreground">{option.cost}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CPRBadge({ cpr }: { cpr?: string }) {
  const num = cpr ? Number(cpr.replace(/,/g, "")) : NaN;
  let Icon = Minus;
  let color = "text-muted-foreground";

  if (!Number.isNaN(num)) {
    if (num > 1.25) {
      Icon = TrendingUp;
      color = "text-emerald-300";
    } else if (num < 0.8) {
      Icon = TrendingDown;
      color = "text-rose-300";
    }
  }

  return (
    <div className={cn("flex items-center gap-1 text-xs font-medium", color)}>
      <Icon className="size-3" />
      <span>CPR {cpr || "-"}</span>
    </div>
  );
}

function GreekItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded border border-border bg-black/20 p-1 text-center">
      <span className="text-muted-foreground">{label}</span>
      <p className="font-medium text-foreground">{value || "-"}</p>
    </div>
  );
}
