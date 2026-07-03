import { type AppLanguage, copy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface DteBadgeProps {
  className?: string;
  date?: string;
  language: AppLanguage;
}

export default function DteBadge({ className, date, language }: DteBadgeProps) {
  if (!date) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${date}T00:00:00Z`);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const label =
    diff === 0
      ? copy(language, "Bugün", "Today")
      : diff > 0
        ? `T-${diff}`
        : `T+${Math.abs(diff)}`;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        diff <= 1
          ? "bg-rose-500/12 text-rose-500"
          : diff <= 7
            ? "bg-amber-500/12 text-amber-500"
            : "bg-emerald-500/12 text-emerald-500",
        className
      )}
    >
      {label}
    </span>
  );
}
