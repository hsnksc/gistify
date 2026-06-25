import { Delta } from "@/components/ui/delta";
import { cn } from "@/lib/utils";

export function CompactStatCard({
  label,
  value,
  hint,
  delta,
  onClick,
}: {
  label: string;
  value: string;
  hint: string;
  delta?: number;
  onClick?: () => void;
}) {
  return (
    <article
      className={cn(
        "rounded-xl border border-white/10 bg-black/20 px-3.5 py-3",
        onClick && "cursor-pointer hover:bg-white/5 transition-colors"
      )}
      onClick={onClick}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-sm font-semibold text-foreground">{value}</p>
        {delta !== undefined && (
          <Delta
            value={delta}
            positiveIsGood={false}
            precision={0}
            className="text-xs"
          />
        )}
      </div>
      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
        {hint}
      </p>
    </article>
  );
}

