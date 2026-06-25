import { Activity } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Strategy } from "@shared/earnings";

interface GreeksDashboardProps {
  language: AppLanguage;
  strategies: Strategy[];
}

export default function GreeksDashboard({
  language,
  strategies,
}: GreeksDashboardProps) {
  const withGreeks = strategies.filter(s => s.greeks);

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <Activity className="size-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">
          {copy(language, "Greeks Dashboard", "Greeks Dashboard")}
        </h2>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-400">
          {withGreeks.length}
        </span>
      </div>

      <div className="space-y-3">
        {withGreeks.slice(0, 30).map(strategy => (
          <div
            key={strategy.ticker}
            className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4 transition-all hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{strategy.ticker}</span>
                {strategy.type && (
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                    {strategy.type}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500">
                IV Rank {strategy.ivRank || "—"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              <GreekBar label="Delta" value={strategy.greeks?.delta} />
              <GreekBar label="Theta" value={strategy.greeks?.theta} />
              <GreekBar label="Vega" value={strategy.greeks?.vega} />
              <GreekBar label="Gamma" value={strategy.greeks?.gamma} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GreekBar({ label, value }: { label: string; value?: string }) {
  const num = value ? parseFloat(value.replace(/[$,]/g, "")) : NaN;
  const magnitude = Number.isNaN(num) ? 0 : Math.min(Math.abs(num) / 50, 1);
  const barColor =
    num > 0 ? "bg-emerald-500" : num < 0 ? "bg-rose-500" : "bg-slate-600";
  const textColor =
    num > 0 ? "text-emerald-400" : num < 0 ? "text-rose-400" : "text-slate-500";

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <span className={cn("text-xs font-bold", textColor)}>
          {value || "—"}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn("h-full rounded-full", barColor)}
          style={{ width: `${magnitude * 100}%` }}
        />
      </div>
    </div>
  );
}
