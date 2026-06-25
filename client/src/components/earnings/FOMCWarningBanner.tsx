import { AlertTriangle, ShieldAlert, Clock, ChevronRight, MinusCircle } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { FOMCData, FOMCStatus } from "@shared/earnings";

interface FOMCWarningBannerProps {
  language: AppLanguage;
  fomc: FOMCData;
}

const STATUS_CONFIG: Record<
  FOMCStatus,
  {
    border: string;
    bg: string;
    text: string;
    icon: string;
    pulse: boolean;
    label: string;
    badge: string;
    progress: string;
  }
> = {
  distant: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    icon: "text-emerald-400",
    pulse: false,
    label: "FOMC Uyarısı",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    progress: "bg-emerald-500",
  },
  approaching: {
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    icon: "text-amber-400",
    pulse: true,
    label: "FOMC Yaklaşıyor",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    progress: "bg-amber-500",
  },
  imminent: {
    border: "border-orange-500/40",
    bg: "bg-orange-500/10",
    text: "text-orange-300",
    icon: "text-orange-400",
    pulse: true,
    label: "FOMC Çok Yakın",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    progress: "bg-orange-500",
  },
  blackout: {
    border: "border-rose-500/40",
    bg: "bg-rose-500/10",
    text: "text-rose-300",
    icon: "text-rose-400",
    pulse: true,
    label: "FOMC Blackout",
    badge: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    progress: "bg-rose-500",
  },
};

export default function FOMCWarningBanner({
  language,
  fomc,
}: FOMCWarningBannerProps) {
  const status = fomc.status || "distant";
  const days = fomc.daysUntil ?? undefined;
  const config = STATUS_CONFIG[status];

  const totalDays = 14;
  const progress =
    days !== undefined
      ? Math.max(0, Math.min(100, ((totalDays - days) / totalDays) * 100))
      : 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 p-6 md:p-7",
        config.border,
        config.bg
      )}
    >
      {config.pulse && (
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-white/5" />
      )}

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl border",
              config.bg,
              config.border
            )}
          >
            <AlertTriangle className={cn("size-6", config.icon)} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={cn("text-xl font-bold", config.text)}>
                {copy(language, config.label, config.label)}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  config.badge
                )}
              >
                {status}
              </span>
            </div>

            <p className="mt-1 text-base font-semibold text-white">
              {copy(
                language,
                `${fomc.date || "—"} tarihinde FOMC toplantısı var.`,
                `FOMC meeting on ${fomc.date || "—"}.`
              )}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {fomc.blackoutStart && fomc.date ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
                  <Clock className="size-3" />
                  {copy(
                    language,
                    `Blackout araligi: ${fomc.blackoutStart} -> ${fomc.date}`,
                    `Blackout window: ${fomc.blackoutStart} -> ${fomc.date}`
                  )}
                </span>
              ) : null}
              {fomc.blackoutStart && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-300">
                  <ShieldAlert className="size-3" />
                  {copy(
                    language,
                    `Blackout: ${fomc.blackoutStart}`,
                    `Blackout: ${fomc.blackoutStart}`
                  )}
                </span>
              )}
              {fomc.currentRate && (
                <span className="rounded-full bg-slate-900/40 px-2.5 py-1 text-xs text-slate-300">
                  {copy(language, "Faiz", "Rate")}: {fomc.currentRate}
                </span>
              )}
              {fomc.marketExpectation && (
                <span className="rounded-full bg-slate-900/40 px-2.5 py-1 text-xs text-slate-300">
                  {copy(language, "Beklenti", "Expectation")}: {fomc.marketExpectation}
                </span>
              )}
            </div>

            {status !== "distant" && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/5 bg-slate-900/40 px-3 py-2.5">
                <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <p className="text-xs leading-5 text-slate-300">
                  {copy(
                    language,
                    "FOMC yaklaştıkça pozisyon büyüklüğünü azaltmayı ve IV crush riskine karşı hedge'leri gözden geçirmeyi düşünün.",
                    "Consider reducing position size and reviewing hedges against IV crush risk as FOMC approaches."
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Big countdown */}
        {days !== undefined && (
          <div className="flex flex-col items-center rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 md:min-w-[160px]">
            <Clock className={cn("size-6", config.icon)} />
            <p className={cn("mt-2 text-5xl font-extrabold tracking-tight", config.text)}>
              {days}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {copy(language, "Gün Kaldı", "Days Left")}
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {days !== undefined && (
        <div className="relative mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
            <div
              className={cn("h-full rounded-full transition-all", config.progress)}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-medium text-slate-500">
            <span>{copy(language, "Şimdi", "Now")}</span>
            <span>{copy(language, "FOMC", "FOMC")}</span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="relative mt-5 flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-xl border px-4 text-xs font-semibold",
            config.border,
            "bg-transparent hover:bg-white/5"
          )}
        >
          <MinusCircle className="mr-1.5 size-3.5" />
          {copy(language, "Pozisyonları Azalt", "Reduce Positions")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl px-4 text-xs font-semibold text-slate-400 hover:text-white"
        >
          {copy(language, "Detaylar", "Details")}
          <ChevronRight className="ml-1 size-3.5" />
        </Button>
      </div>
    </div>
  );
}
