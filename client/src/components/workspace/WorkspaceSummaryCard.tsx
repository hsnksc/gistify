import type { ComponentType } from "react";

type SummaryTone = "bull" | "bear" | "caution" | "info";

const toneClasses: Record<SummaryTone, string> = {
  bull: "tone-bull",
  bear: "tone-bear",
  caution: "tone-caution",
  info: "tone-info",
};

interface WorkspaceSummaryCardProps {
  label: string;
  value: string;
  hint: string;
  icon: ComponentType<{ className?: string }>;
  tone?: SummaryTone;
}

export default function WorkspaceSummaryCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "info",
}: WorkspaceSummaryCardProps) {
  return (
    <div className="workspace-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="data-mono mt-2 text-2xl font-bold text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p>
        </div>
        <div className={`rounded-xl border p-2 ${toneClasses[tone]}`}>
          <Icon className="size-4" />
        </div>
      </div>
    </div>
  );
}

export type { SummaryTone };

