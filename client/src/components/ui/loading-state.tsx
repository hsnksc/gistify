import { LoaderCircle, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  compact?: boolean;
  description?: string;
  icon?: LucideIcon;
  label: string;
}

export default function LoadingState({
  className,
  compact = false,
  description = "",
  icon: Icon = LoaderCircle,
  label,
}: LoadingStateProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-xl border border-border bg-card/80 p-6 text-card-foreground shadow-[0_18px_40px_rgba(3,7,18,0.2)]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg border border-sky-400/20 bg-sky-500/12 p-2 text-sky-200">
          <Icon className="size-4 animate-spin" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            {description ? (
              <p className="text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 max-w-xl" />
            {!compact ? <Skeleton className="h-3 max-w-2xl" /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
