import { useState } from "react";
import {
  CalendarCheck, CheckCircle2, AlertCircle, Clock, Calendar, AlertTriangle, Target, ChevronRight, } from "lucide-react";
import { type AppLanguage, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { ActionPlanItem } from "@shared/earnings";

interface ActionPlanProps {
  language: AppLanguage;
  items: ActionPlanItem[];
}

const WEEK_COLORS = [
  {
    border: "border-l-sky-500",
    badge: "bg-sky-500/10 text-sky-400",
    dot: "bg-sky-500",
    title: "text-sky-400",
  },
  {
    border: "border-l-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-500",
    title: "text-emerald-400",
  },
  {
    border: "border-l-amber-500",
    badge: "bg-amber-500/10 text-amber-400",
    dot: "bg-amber-500",
    title: "text-amber-400",
  },
  {
    border: "border-l-rose-500",
    badge: "bg-rose-500/10 text-rose-400",
    dot: "bg-rose-500",
    title: "text-rose-400",
  },
  {
    border: "border-l-purple-500",
    badge: "bg-purple-500/10 text-purple-400",
    dot: "bg-purple-500",
    title: "text-purple-400",
  },
];

interface ActionMeta {
  text: string;
  date?: string;
  icon: "check" | "alert" | "clock";
  isEarnings?: boolean;
  isFOMC?: boolean;
}

function inferMeta(action: string): ActionMeta {
  const lower = action.toLowerCase();
  let icon: ActionMeta["icon"] = "check";
  if (lower.includes("fomc") || lower.includes("fed") || lower.includes("alert") || lower.includes("risk")) {
    icon = "alert";
  } else if (lower.includes("wait") || lower.includes("bekle") || lower.includes("sabır") || lower.includes("monitor")) {
    icon = "clock";
  }
  const isEarnings = lower.includes("earnings") || lower.includes("kazanç") || lower.includes("açıklama");
  const isFOMC = lower.includes("fomc") || lower.includes("fed") || lower.includes("faiz");
  // Try to extract date-like text (e.g., "Jul 15" or "15 Temmuz")
  const dateMatch = action.match(/(\d{1,2}\s+[A-Za-z]{3,}|\d{1,2}[\/.]\d{1,2})/);
  return {
    text: action,
    date: dateMatch ? dateMatch[1] : undefined,
    icon,
    isEarnings,
    isFOMC,
  };
}

export default function ActionPlan({ language, items }: ActionPlanProps) {
  if (items.length === 0) return null;

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggleCheck(key: string) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <CalendarCheck className="size-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">
          {t("earnings:actionPlan")}
        </h2>
      </div>

      <div className="relative space-y-6">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 hidden h-full w-0.5 bg-slate-800 md:block" />

        {items.map((item, idx) => {
          const colors = WEEK_COLORS[idx % WEEK_COLORS.length];
          const isEarningsWeek = item.actions.some((a) =>
            a.toLowerCase().includes("earnings")
          );
          const isFOMCWeek = item.actions.some((a) =>
            a.toLowerCase().includes("fomc")
          );
          return (
            <div key={idx} className="relative flex items-start gap-4 md:pl-2">
              {/* Step dot */}
              <div className="relative z-10 hidden shrink-0 md:block">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border border-white/10 shadow",
                    colors.badge
                  )}
                >
                  <span className={cn("text-xs font-bold", colors.title)}>
                    {idx + 1}
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "flex-1 rounded-2xl border border-white/10 bg-slate-800/50 p-5 transition-all duration-200 hover:shadow-lg",
                  "border-l-4",
                  colors.border
                )}
              >
                {/* Header */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className={cn("text-xl font-bold", colors.title)}>
                      {item.week || t("earnings:week", { idx1: idx + 1 })}
                    </p>
                    {item.dateRange && (
                      <p className="text-xs text-slate-500">{item.dateRange}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isEarningsWeek && (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] font-bold text-rose-400">
                        <Calendar className="size-3" />
                        Earnings
                      </span>
                    )}
                    {isFOMCWeek && (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-400">
                        <AlertTriangle className="size-3" />
                        FOMC
                      </span>
                    )}
                  </div>
                </div>

                {item.focus && (
                  <p className="mb-3 flex items-center gap-2 text-sm italic text-slate-300">
                    <Target className="size-3.5 text-sky-400" />
                    {item.focus}
                  </p>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {item.actions.slice(0, 8).map((action, aidx) => {
                    const meta = inferMeta(action);
                    const key = `${idx}-${aidx}`;
                    const isDone = checked[key];
                    return (
                      <div
                        key={aidx}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border p-3 transition-all",
                          meta.isEarnings
                            ? "border-rose-500/20 bg-rose-500/5"
                            : meta.isFOMC
                            ? "border-amber-500/20 bg-amber-500/5"
                            : "border-white/5 bg-slate-800/50",
                          isDone && "opacity-50"
                        )}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleCheck(key)}
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-all",
                            isDone
                              ? "border-sky-500/60 bg-sky-500/20"
                              : "border-sky-500/30 bg-slate-900/50 hover:border-sky-500/50"
                          )}
                        >
                          {isDone && <CheckCircle2 className="size-3 text-sky-400" />}
                        </button>

                        {/* Icon */}
                        <div className="mt-0.5 shrink-0">
                          {meta.icon === "check" ? (
                            <CheckCircle2 className="size-4 text-emerald-400" />
                          ) : meta.icon === "alert" ? (
                            <AlertCircle className="size-4 text-rose-400" />
                          ) : (
                            <Clock className="size-4 text-amber-400" />
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                          <p
                            className={cn(
                              "text-sm leading-snug",
                              meta.isEarnings
                                ? "text-rose-300"
                                : meta.isFOMC
                                ? "text-amber-300"
                                : "text-slate-300"
                            )}
                          >
                            {action}
                          </p>
                        </div>

                        {/* Date badge */}
                        {meta.date && (
                          <span className="shrink-0 rounded bg-slate-900/60 px-1.5 py-0.5 text-[10px] text-slate-500">
                            {meta.date}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily checklist section */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/50 p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          {t("earnings:dailyChecklist")}
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            t("earnings:preMarketMomentumScan"),
            t("earnings:vixFearGreedCheck"),
            t("earnings:reviewEarningsCalendar"),
            t("earnings:checkGreeksDashboard"),
            t("earnings:updateEntryExitLevels"),
            t("earnings:positionRiskLimitCheck"),
          ].map((task, i) => {
            const key = `daily-${i}`;
            const isDone = checked[key];
            return (
              <button
                key={key}
                onClick={() => toggleCheck(key)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all",
                  isDone
                    ? "border-sky-500/20 bg-sky-500/5"
                    : "border-slate-700/50 bg-slate-900/30 hover:border-slate-600"
                )}
              >
                <div
                  className={cn(
                    "flex size-4 items-center justify-center rounded border transition-all",
                    isDone
                      ? "border-sky-500/60 bg-sky-500/20"
                      : "border-sky-500/30 bg-slate-900/50"
                  )}
                >
                  {isDone && <CheckCircle2 className="size-3 text-sky-400" />}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isDone ? "text-sky-300 line-through" : "text-slate-300"
                  )}
                >
                  {task}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
