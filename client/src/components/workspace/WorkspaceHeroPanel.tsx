import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WorkspaceHeroPanelProps {
  badges?: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  reportStrip: ReactNode;
  statusBar: ReactNode;
  overlayClassName?: string;
}

export default function WorkspaceHeroPanel({
  badges,
  eyebrow,
  title,
  description,
  actions,
  reportStrip,
  statusBar,
  overlayClassName,
}: WorkspaceHeroPanelProps) {
  return (
    <section className="panel overflow-hidden">
      <div className="relative overflow-hidden px-4 py-5 md:px-6 md:py-6">
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            overlayClassName
          )}
        />
        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              {badges ? (
                <div className="flex flex-wrap items-center gap-2">{badges}</div>
              ) : null}
              <div className="space-y-2">
                <p className="heading-condensed text-sm uppercase tracking-[0.18em] text-sky-300">
                  {eyebrow}
                </p>
                <h1 className="heading-condensed max-w-4xl text-2xl leading-[1.02] text-foreground md:text-4xl xl:text-5xl">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                  {description}
                </p>
              </div>
            </div>

            {actions ? (
              <div className="flex flex-wrap items-stretch gap-2">{actions}</div>
            ) : null}
          </div>

          {reportStrip}
          {statusBar}
        </div>
      </div>
    </section>
  );
}



