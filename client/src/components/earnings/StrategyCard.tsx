import {
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Shield,
  Clock,
  Crosshair,
  CalendarDays,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Strategy, StrategyType } from "@shared/earnings";

interface StrategyCardProps {
  language: AppLanguage;
  strategy: Strategy;
}

const STRATEGY_COLORS: Record<StrategyType, string> = {
  "Iron Condor": "bg-sky-500/20 text-sky-400 border-sky-500/30",
  "Bull Call Spread": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Bear Call Spread": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "Bear Put Spread": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "Bull Put Spread": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Long Straddle": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Long Strangle": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Butterfly: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Calendar Spread": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Ratio Spread": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Long Call": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Long Put": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Custom: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function StrategyCard({ language, strategy }: StrategyCardProps) {
  const typeColor = strategy.type
    ? STRATEGY_COLORS[strategy.type]
    : "bg-slate-500/20 text-slate-400 border-slate-500/30";
  const portfolioHref = strategy.budgetOptions[0]
    ? `/earnings?tab=portfolio&budget=${encodeURIComponent(strategy.budgetOptions[0].budget)}`
    : null;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-white/10 bg-slate-800/50 p-5",
        "transition-all duration-200",
        "hover:-translate-y-1 hover:border-white/20 hover:bg-slate-800/70 hover:shadow-xl"
      )}
    >
      {/* Top: Ticker + Sector + CPR Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              {strategy.ticker}
            </span>
            {strategy.sector && (
              <span className="truncate rounded-lg bg-slate-900/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {strategy.sector}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4">
            {strategy.price && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                <DollarSign className="size-4 text-sky-400" />
                {strategy.price}
              </span>
            )}
            {strategy.ivRank && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                <Crosshair className="size-4 text-violet-400" />
                IV Rank {strategy.ivRank}
              </span>
            )}
          </div>
        </div>
        <CPRBadge cpr={strategy.cpr} />
      </div>

      {/* Strategy Type Badge */}
      <div className="mt-4">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
            typeColor
          )}
        >
          <Target className="size-3.5" />
          {strategy.type || "—"}
        </span>
      </div>

      {/* Entry / Exit / Max Hold */}
      <div className="mt-4 grid grid-cols-1 gap-2">
        {strategy.entry && (
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2.5">
            <CalendarDays className="size-4 text-sky-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {copy(language, "Giriş", "Entry")}
            </span>
            <span className="ml-auto text-xs font-medium text-slate-200">
              {strategy.entry}
            </span>
          </div>
        )}
        {strategy.exit && (
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2.5">
            <LogOut className="size-4 text-emerald-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {copy(language, "Çıkış", "Exit")}
            </span>
            <span className="ml-auto text-xs font-medium text-slate-200">
              {strategy.exit}
            </span>
          </div>
        )}
        {strategy.maxHold && (
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2.5">
            <Clock className="size-4 text-amber-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {copy(language, "Max Tutma", "Max Hold")}
            </span>
            <span className="ml-auto text-xs font-medium text-slate-200">
              {strategy.maxHold}
            </span>
          </div>
        )}
      </div>

      {/* Credit / Max Risk / K.O. Probability — 3'lü mini grid */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {strategy.credit && (
          <div className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-slate-900/50 px-2 py-2.5 text-center">
            <DollarSign className="size-3.5 text-sky-400" />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              {copy(language, "Kredi", "Credit")}
            </span>
            <span className="text-xs font-bold text-slate-200">{strategy.credit}</span>
          </div>
        )}
        {strategy.maxRisk && (
          <div className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-slate-900/50 px-2 py-2.5 text-center">
            <Shield className="size-3.5 text-rose-400" />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              {copy(language, "Max Risk", "Max Risk")}
            </span>
            <span className="text-xs font-bold text-slate-200">{strategy.maxRisk}</span>
          </div>
        )}
        {strategy.koProbability && (
          <div className="flex flex-col items-center gap-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-2 py-2.5 text-center">
            <Target className="size-3.5 text-emerald-400" />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-500/70">
              {copy(language, "K.O.", "K.O.")}
            </span>
            <span className="text-xs font-bold text-emerald-300">
              {strategy.koProbability}
            </span>
          </div>
        )}
      </div>

      {/* Greeks Bar Chart */}
      {strategy.greeks ? (
        <div className="mt-5">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Greeks
          </p>
          <div className="space-y-2">
            <GreekBar label="Δ" value={strategy.greeks.delta} />
            <GreekBar label="Θ" value={strategy.greeks.theta} />
            <GreekBar label="V" value={strategy.greeks.vega} />
            <GreekBar label="Γ" value={strategy.greeks.gamma} />
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-slate-700/60 bg-slate-900/30 px-3 py-3">
          <AlertCircle className="size-4 text-slate-500" />
          <span className="text-xs text-slate-500">
            {copy(language, "Greeks verisi bekleniyor", "Greeks data pending")}
          </span>
        </div>
      )}

      {/* Budget Options */}
      {strategy.budgetOptions.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {copy(language, "Bütçe Dostu", "Budget Friendly")}
          </p>
          <div className="flex flex-wrap gap-2">
            {strategy.budgetOptions.slice(0, 3).map((option, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-[11px]",
                  "border-sky-500/20 bg-sky-500/5"
                )}
              >
                <span className="font-semibold text-sky-400">{option.budget}</span>
                <span className="mx-1.5 text-slate-600">·</span>
                <span className="text-slate-300">{option.strategy}</span>
                <span className="mx-1.5 text-slate-600">·</span>
                <span className="text-slate-400">{option.cost}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {strategy.notes && strategy.notes.length > 0 && (
        <div className="mt-4 space-y-1.5">
          {strategy.notes.map((note, i) => (
            <p key={i} className="text-[11px] leading-5 text-slate-400">
              • {note}
            </p>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/8 pt-4">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="rounded-xl border-white/10 bg-slate-900/50 text-slate-100 hover:bg-slate-800/70"
        >
          <a href={`/earnings/${strategy.ticker}`}>
            {copy(language, "Ticker detayi", "Ticker detail")}
          </a>
        </Button>
        {portfolioHref ? (
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="rounded-xl text-sky-300 hover:bg-sky-500/10 hover:text-sky-200"
          >
            <a href={portfolioHref}>
              {copy(language, "Portfoy lensi", "Portfolio lens")}
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function CPRBadge({ cpr }: { cpr?: string }) {
  const num = cpr ? Number(cpr.replace(/,/g, "")) : NaN;
  let Icon = Minus;
  let color = "text-slate-500";
  let bg = "bg-slate-900/50";
  let border = "border-slate-700";

  if (!Number.isNaN(num)) {
    if (num > 1.25) {
      Icon = TrendingUp;
      color = "text-emerald-400";
      bg = "bg-emerald-500/15";
      border = "border-emerald-500/30";
    } else if (num < 0.8) {
      Icon = TrendingDown;
      color = "text-rose-400";
      bg = "bg-rose-500/15";
      border = "border-rose-500/30";
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        bg,
        border,
        color
      )}
    >
      <Icon className="size-3.5" />
      <span>CPR {cpr || "—"}</span>
    </div>
  );
}

function GreekBar({ label, value }: { label: string; value?: string }) {
  const num = value ? parseFloat(value.replace(/[$,]/g, "")) : NaN;
  const maxAbs = 0.25; // scale reference for bar width
  const magnitude = Number.isNaN(num) ? 0 : Math.min(Math.abs(num) / maxAbs, 1);

  let barColor = "bg-slate-600";
  if (label === "Δ") {
    barColor = num > 0 ? "bg-sky-500" : num < 0 ? "bg-rose-500" : "bg-slate-600";
  } else if (label === "Θ") {
    barColor = num > 0 ? "bg-emerald-500" : num < 0 ? "bg-rose-500" : "bg-slate-600";
  } else if (label === "V") {
    barColor = num > 0 ? "bg-violet-500" : num < 0 ? "bg-rose-500" : "bg-slate-600";
  } else if (label === "Γ") {
    barColor = num > 0 ? "bg-amber-500" : num < 0 ? "bg-rose-500" : "bg-slate-600";
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-4 text-[10px] font-bold text-slate-500">{label}</span>
      <span className="w-12 text-right text-xs font-semibold text-slate-200">
        {value || "—"}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${magnitude * 100}%` }}
        />
      </div>
    </div>
  );
}
