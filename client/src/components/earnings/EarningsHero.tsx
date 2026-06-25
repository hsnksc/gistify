import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  FileText,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import type { EarningsStrategyData } from "@shared/earnings";

interface EarningsHeroProps {
  language: AppLanguage;
  data: EarningsStrategyData;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function EarningsHero({
  language,
  data,
  onRefresh,
  isRefreshing,
}: EarningsHeroProps) {
  const currentMonth = data.currentMonth || "—";
  const nextMonth = data.nextMonth || null;
  const fomcWarning = (data as { fomcWarning?: string }).fomcWarning;

  const vixNum = data.macro.vix
    ? parseFloat(data.macro.vix.replace(/[^0-9.]/g, ""))
    : NaN;
  const vixColor =
    !Number.isNaN(vixNum) && vixNum > 25
      ? "text-rose-400"
      : !Number.isNaN(vixNum) && vixNum > 20
        ? "text-amber-400"
        : "text-emerald-400";

  const spChange = data.macro.sp500 || "";
  const spDirection = spChange.includes("-") ? "down" : spChange.includes("+") ? "up" : "flat";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10",
        "bg-gradient-to-br from-slate-900 via-[#1a2744] to-slate-900"
      )}
    >
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-sky-500/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-500/8 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />

      <div className="relative p-6 md:p-8 lg:p-10">
        {/* Top row: Two-month header + actions */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-400">
              <Calendar className="size-3.5" />
              {copy(language, "Rolling 2-Aylık Earnings Stratejisi", "Rolling 2-Month Earnings Strategy")}
            </div>

            {/* Dramatic two-month display */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                  {currentMonth}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-400/80">
                  {copy(language, "Mevcut Ay", "Current Month")}
                </p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent md:w-16 lg:w-20" />
                <span className="text-2xl font-light text-sky-400/60 md:text-3xl">+</span>
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent md:w-16 lg:w-20" />
              </div>

              {nextMonth ? (
                <div className="text-center">
                  <p className="text-3xl font-bold tracking-tight text-slate-300 md:text-4xl lg:text-5xl">
                    {nextMonth}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400/80">
                    {copy(language, "Sonraki Ay", "Next Month")}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-3xl font-bold tracking-tight text-slate-600 md:text-4xl lg:text-5xl">
                    —
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500/60">
                    {copy(language, "Sonraki Ay", "Next Month")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="rounded-xl border-white/10 bg-slate-800/50 text-slate-200 backdrop-blur-sm hover:bg-slate-700/50 hover:text-white"
            >
              <RefreshCw
                className={cn(
                  "mr-2 size-4",
                  isRefreshing ? "animate-spin" : ""
                )}
              />
              {copy(language, "Yenile", "Refresh")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-xl border-white/10 bg-slate-800/50 text-slate-200 backdrop-blur-sm hover:bg-slate-700/50 hover:text-white"
            >
              <a
                href="/api/earnings/download?format=md"
                download
                className="inline-flex items-center"
              >
                <FileText className="mr-2 size-4" />
                MD
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-xl border-white/10 bg-slate-800/50 text-slate-200 backdrop-blur-sm hover:bg-slate-700/50 hover:text-white"
            >
              <a
                href="/api/earnings/download?format=docx"
                download
                className="inline-flex items-center"
              >
                <FileText className="mr-2 size-4" />
                DOCX
              </a>
            </Button>
          </div>
        </div>

        {/* Macro big numbers — dramatic cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <BigStat
            label="VIX"
            value={data.macro.vix || "—"}
            colorClass={vixColor}
            icon={<BarChart3 className="size-5" />}
            gradient="from-rose-500/10 to-amber-500/10"
          />
          <BigStat
            label="S&P 500"
            value={data.macro.sp500 || "—"}
            colorClass={
              spDirection === "up"
                ? "text-emerald-400"
                : spDirection === "down"
                  ? "text-rose-400"
                  : "text-slate-400"
            }
            icon={
              spDirection === "up" ? (
                <TrendingUp className="size-5" />
              ) : spDirection === "down" ? (
                <TrendingDown className="size-5" />
              ) : (
                <Minus className="size-5" />
              )
            }
            gradient="from-emerald-500/10 to-sky-500/10"
          />
          <BigStat
            label="Nasdaq"
            value={data.macro.nasdaq || "—"}
            colorClass="text-slate-300"
            icon={<BarChart3 className="size-5" />}
            gradient="from-violet-500/10 to-sky-500/10"
          />
          <BigStat
            label={copy(language, "Rejim", "Regime")}
            value={data.macro.regime || "—"}
            colorClass="text-sky-400"
            icon={<BarChart3 className="size-5" />}
            gradient="from-sky-500/10 to-indigo-500/10"
          />
        </div>

        {/* FOMC Warning Banner */}
        {fomcWarning && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent px-4 py-3">
            <AlertTriangle className="size-5 shrink-0 text-amber-400" />
            <p className="text-sm font-semibold text-amber-300">{fomcWarning}</p>
          </div>
        )}

        {/* Report strip */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5 text-xs text-slate-400">
          <span className="rounded-full border border-white/10 bg-slate-800/50 px-3 py-1.5">
            {copy(language, "Rapor Tarihi", "Report Date")}: <span className="font-semibold text-slate-200">{data.reportDate || "—"}</span>
          </span>
          <span className="hidden text-slate-600 md:inline">·</span>
          <span className="rounded-full border border-white/10 bg-slate-800/50 px-3 py-1.5">
            {copy(language, "Rejim", "Regime")}: <span className="font-semibold text-sky-400">{data.macro.regime || "—"}</span>
          </span>
          <span className="hidden text-slate-600 md:inline">·</span>
          <div className="flex flex-wrap gap-2">
            {data.executiveSummary.slice(0, 4).map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full border border-white/10 bg-slate-800/50 px-3 py-1.5 text-[11px] text-slate-300 transition-all hover:-translate-y-0.5 hover:border-sky-500/30 hover:text-white"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BigStat({
  label,
  value,
  colorClass,
  icon,
  gradient,
}: {
  label: string;
  value: string;
  colorClass: string;
  icon: ReactNode;
  gradient?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 p-5 transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-sky-500/20 hover:shadow-lg hover:shadow-sky-500/5",
        gradient ? `bg-gradient-to-br ${gradient} bg-slate-800/50` : "bg-slate-800/50"
      )}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {icon}
        {label}
      </div>
      <p className={cn("mt-2 text-3xl font-bold tracking-tight md:text-4xl", colorClass)}>
        {value}
      </p>
    </div>
  );
}
