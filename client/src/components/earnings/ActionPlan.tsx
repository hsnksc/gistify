import { CalendarCheck, ChevronRight, Target } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import type { ActionPlanItem } from "@shared/earnings";

interface ActionPlanProps {
  language: AppLanguage;
  items: ActionPlanItem[];
}

export default function ActionPlan({ language, items }: ActionPlanProps) {
  if (items.length === 0) return null;

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <CalendarCheck className="size-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">
          {copy(language, "Eylem Planı", "Action Plan")}
        </h2>
      </div>
      <div className="relative space-y-4">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-800" />
        {items.map((item, idx) => (
          <div key={idx} className="relative flex items-start gap-4 pl-1">
            {/* Step dot */}
            <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900">
              <span className="text-xs font-bold text-sky-400">{idx + 1}</span>
            </div>
            <div className="flex-1 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-400">
                  {item.week || item.dateRange || copy(language, "Plan", "Plan")}
                </p>
              </div>
              {item.focus && (
                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-white">
                  <Target className="size-3.5 text-sky-400" />
                  {item.focus}
                </p>
              )}
              <ul className="mt-3 space-y-2">
                {item.actions.slice(0, 6).map((action, aidx) => (
                  <li
                    key={aidx}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-slate-500" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
