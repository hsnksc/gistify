import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  AlertTriangle,
  Download,
  Activity,
  BarChart3,
  Clock,
} from "lucide-react";
import type { EarningsStrategyData, FOMCData } from "@shared/earnings";

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
  const nextMonth = data.nextMonth;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10",
        "bg-gradient-to-br from-slate-900 via-[#162032] to-slate-900"
      )}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-sky-500/25 to-transparent" />

      <div className="relative p-6 md:p-8">
        {/* Top bar */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
              <Calendar className="size-3.5" />
              {copy(language, "Rolling 2-Aylık Strateji", "Rolling 2-Month Strategy")}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              {data.title ||
                copy(language, "Earnings Stratejisi", "Earnings Strategy")}
            </h1>
            {data.summary ? (
              <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
                {data.summary.slice(0, 180)}
                {data.summary.length > 180 ? "..." : ""}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="rounded-xl border-white/10 bg-slate-800/50 text-slate-200 backdrop-blur-sm hover:bg-slate-700/50 hover:text-white"
            >
              <RefreshCw
                className={cn("mr-2 size-4", isRefreshing && "animate-spin")}
              />
              {copy(language, "Yenile", "Refresh")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-xl border-white/10 bg-slate-800/50 text-slate-200 backdrop-blur-sm hover:bg-slate-700/50 hover:text-white"
            >
              <a href="/api/earnings/download?format=md" download>
                <Download className="mr-2 size-4" />
                {copy(language, "Rapor", "Report")}
              </a>
            </Button>
          </div>
        </div>

        {/* Month ribbon */}
        <div className="mt-6 flex flex-wrap items-stretch gap-3">
          <MonthCard
            label={copy(language, "Mevcut Ay", "Current Month")}
            value={currentMonth}
            active
          />
          {nextMonth ? (
            <MonthCard
              label={copy(language, "Sonraki Ay", "Next Month")}
              value={nextMonth}
            />
          ) : (
            <MonthCard
              label={copy(language, "Sonraki Ay", "Next Month")}
              value={copy(language, "Bekleniyor", "Pending")}
              muted
            />
          )}
        </div>

        {/* Metric ribbon */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            icon={<Activity className="size-4" />}
            label="VIX"
            value={data.macro.vix || copy(language, "Bekleniyor", "Pending")}
            tone={getVixTone(data.macro.vix)}
          />
          <MetricCard
            icon={<BarChart3 className="size-4" />}
            label="S&P 500"
            value={data.macro.sp500}
          />
          <MetricCard
            icon={<BarChart3 className="size-4" />}
            label="Nasdaq"
            value={data.macro.nasdaq}
          />
          <FOMCCard fomc={data.fomc} language={language} />
        </div>
      </div>
    </section>
  );
}

function MonthCard({
  label,
  value,
  active,
  muted,
}: {
  label: string;
  value: string;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[140px] flex-1 flex-col justify-center rounded-2xl border px-5 py-4",
        active
          ? "border-sky-500/25 bg-sky-500/10"
          : muted
            ? "border-white/5 bg-slate-800/30"
            : "border-white/10 bg-slate-800/40"
      )}
    >
      <p
        className={cn(
          "text-[10px] font-semibold uppercase tracking-[0.18em]",
          active ? "text-sky-400/80" : "text-slate-500"
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-xl font-bold tracking-tight md:text-2xl",
          active ? "text-white" : muted ? "text-slate-600" : "text-slate-300"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  tone?: "neutral" | "amber" | "rose" | "emerald";
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/40 px-4 py-3">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          tone === "rose"
            ? "bg-rose-500/15 text-rose-400"
            : tone === "amber"
              ? "bg-amber-500/15 text-amber-400"
              : tone === "emerald"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-slate-700/50 text-slate-400"
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <p className="text-base font-bold text-white">{value || "—"}</p>
      </div>
    </div>
  );
}

function FOMCCard({
  fomc,
  language,
}: {
  fomc?: FOMCData;
  language: AppLanguage;
}) {
  if (!fomc?.date) {
    return (
      <MetricCard
        icon={<Clock className="size-4" />}
        label={copy(language, "FOMC", "FOMC")}
        value={copy(language, "Veri yok", "No data")}
      />
    );
  }

  const isNear = fomc.status === "imminent" || fomc.status === "approaching";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-4 py-3",
        isNear
          ? "border-amber-500/25 bg-amber-500/10"
          : "border-white/10 bg-slate-800/40"
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          isNear ? "bg-amber-500/15 text-amber-400" : "bg-slate-700/50 text-slate-400"
        )}
      >
        <AlertTriangle className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {copy(language, "FOMC", "FOMC")}
        </p>
        <p className="truncate text-base font-bold text-white">
          {fomc.daysUntil ?? "—"}{" "}
          {copy(language, "gün kaldı", "days left")}
        </p>
        <p className="truncate text-[10px] text-slate-400">{fomc.date}</p>
      </div>
    </div>
  );
}

function getVixTone(vix?: string): "neutral" | "amber" | "rose" | "emerald" {
  if (!vix) return "neutral";
  const num = parseFloat(vix.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(num)) return "neutral";
  if (num > 25) return "rose";
  if (num > 20) return "amber";
  return "emerald";
}
