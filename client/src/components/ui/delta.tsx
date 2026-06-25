import type { ComponentProps } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaProps extends ComponentProps<"span"> {
  value: number | null | undefined;
  precision?: number;
  suffix?: string;
  positiveIsGood?: boolean;
  showPlus?: boolean;
}

export function Delta({
  className,
  precision = 2,
  positiveIsGood = true,
  showPlus = true,
  suffix = "%",
  value,
  ...props
}: DeltaProps) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return (
      <span
        className={cn("inline-flex items-center gap-1 text-muted-foreground", className)}
        {...props}
      >
        <Minus className="size-3.5" />
        <span className="data-mono">-</span>
      </span>
    );
  }

  const magnitude = Math.abs(value);
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(magnitude);
  const isPositive = value > 0;
  const isNegative = value < 0;
  const toneClassName = isPositive
    ? positiveIsGood
      ? "text-emerald-400"
      : "text-red-400"
    : isNegative
      ? positiveIsGood
        ? "text-red-400"
        : "text-emerald-400"
      : "text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 data-mono font-medium tabular-nums",
        toneClassName,
        className
      )}
      {...props}
    >
      {isPositive ? (
        <ArrowUpRight className="size-3.5" />
      ) : isNegative ? (
        <ArrowDownRight className="size-3.5" />
      ) : (
        <Minus className="size-3.5" />
      )}
      <span>
        {isPositive && showPlus ? "+" : isNegative ? "-" : ""}
        {formatted}
        {suffix}
      </span>
    </span>
  );
}
