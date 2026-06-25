import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateTone = "danger" | "info" | "neutral" | "warning";

interface EmptyStateProps {
  action?: ReactNode;
  className?: string;
  description?: string;
  icon?: LucideIcon;
  role?: "alert" | "status";
  title: string;
  tone?: EmptyStateTone;
}

const TONE_CLASSNAME: Record<EmptyStateTone, string> = {
  danger: "border-rose-500/24 bg-rose-500/6 text-rose-200",
  info: "border-sky-400/24 bg-sky-500/8 text-sky-200",
  neutral: "border-border bg-background/35 text-muted-foreground",
  warning: "border-amber-500/24 bg-amber-500/8 text-amber-200",
};

export default function EmptyState({
  action,
  className,
  description = "",
  icon: Icon = Inbox,
  role = "status",
  title,
  tone = "neutral",
}: EmptyStateProps) {
  return (
    <section
      role={role}
      aria-live="polite"
      className={cn(
        "rounded-xl border border-dashed p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]",
        TONE_CLASSNAME[tone],
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-current/15 bg-black/10 p-2">
            <Icon className="size-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {description ? (
              <p className="text-sm leading-6 text-inherit">{description}</p>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}
