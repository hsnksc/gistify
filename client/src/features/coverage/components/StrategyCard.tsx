import { type AppLanguage } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { BadgeDollarSign, TrendingDown, TrendingUp, Target } from "lucide-react";

export interface StrategyCardProps {
  language?: AppLanguage;
  strategy: {
    breakeven: number;
    cost: number;
    legs: string;
    max_gain: number | "unlimited";
    max_loss: number;
    name: string;
  };
}

export default function StrategyCard({ strategy, language = "tr" }: StrategyCardProps) {
  const { name, legs, cost, max_gain, max_loss, breakeven } = strategy;
  const isUnlimited = max_gain === "unlimited";
  const numericGain = isUnlimited ? Number.POSITIVE_INFINITY : max_gain;
  const roi = !isUnlimited && cost > 0 ? ((numericGain - cost) / cost) * 100 : null;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background/30 p-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {copy(language, "Strateji", "Strategy")}
        </p>
        <h3 className="text-lg font-bold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{legs}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/8 p-3">
          <div className="flex items-center gap-2">
            <BadgeDollarSign className="size-4 text-rose-300" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Maliyet", "Cost")}
            </span>
          </div>
          <p className="mt-1 text-lg font-bold text-rose-200">
            ${cost.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-emerald-300" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Max Gain", "Max Gain")}
            </span>
          </div>
          <p className="mt-1 text-lg font-bold text-emerald-200">
            {isUnlimited
              ? copy(language, "Sınırsız", "Unlimited")
              : `$${numericGain.toLocaleString()}`}
          </p>
        </div>

        <div className="rounded-lg border border-rose-500/20 bg-rose-500/8 p-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="size-4 text-rose-300" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Max Loss", "Max Loss")}
            </span>
          </div>
          <p className="mt-1 text-lg font-bold text-rose-200">
            ${max_loss.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/8 p-3">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-amber-300" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Breakeven", "Breakeven")}
            </span>
          </div>
          <p className="mt-1 text-lg font-bold text-amber-200">
            ${breakeven.toFixed(2)}
          </p>
        </div>
      </div>

      {roi !== null && roi > 0 && (
        <div className="rounded-lg border border-sky-500/20 bg-sky-500/8 p-3">
          <p className="text-xs text-muted-foreground">
            {copy(language, "ROI Potansiyeli", "ROI Potential")}: {" "}
            <span className="font-bold text-emerald-300">+{roi.toFixed(0)}%</span>
          </p>
        </div>
      )}
      {isUnlimited && (
        <div className="rounded-lg border border-sky-500/20 bg-sky-500/8 p-3">
          <p className="text-xs text-muted-foreground">
            {copy(language, "ROI Potansiyeli", "ROI Potential")}: {" "}
            <span className="font-bold text-emerald-300">∞</span>
          </p>
        </div>
      )}
    </div>
  );
}
