import { CalendarCheck } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import type { ActionPlanItem } from "@shared/earnings";

interface ActionPlanProps {
  language: AppLanguage;
  items: ActionPlanItem[];
}

export default function ActionPlan({ language, items }: ActionPlanProps) {
  return (
    <section className="panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <CalendarCheck className="size-4 text-sky-300" />
        <h2 className="heading-condensed text-base">
          {copy(language, "Eylem Planı", "Action Plan")}
        </h2>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-border bg-background p-3"
          >
            <p className="text-sm font-semibold text-foreground">
              {item.week}
            </p>
            {item.focus && (
              <p className="mt-1 text-xs text-muted-foreground">{item.focus}</p>
            )}
            <ul className="mt-2 space-y-1">
              {item.actions.slice(0, 6).map((action, aidx) => (
                <li
                  key={aidx}
                  className="text-xs text-foreground/80 before:mr-1 before:content-['•']"
                >
                  {action}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
