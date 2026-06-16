import type { ReactNode } from "react";
import type { AppLanguage } from "@/lib/i18n";

interface FlowLayoutProps {
  actions?: ReactNode;
  children: ReactNode;
  description: string;
  eyebrow: string;
  language: AppLanguage;
  sidebar?: ReactNode;
  sidebarLayoutClassName?: string;
  title: string;
}

export default function FlowLayout({
  actions,
  children,
  description,
  eyebrow,
  sidebar,
  sidebarLayoutClassName = "xl:grid-cols-[minmax(0,1fr)_320px]",
  title,
}: FlowLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <section className="workspace-panel overflow-hidden">
          <div className="px-5 py-6 md:px-6 md:py-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-3">
                <p className="heading-condensed text-sm uppercase tracking-[0.18em] text-indigo-300">
                  {eyebrow}
                </p>
                <h1 className="heading-condensed text-3xl leading-none text-foreground md:text-5xl">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                  {description}
                </p>
              </div>
              {actions ? (
                <div className="flex flex-wrap items-center gap-2">
                  {actions}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {sidebar ? (
          <div className={`mt-6 grid gap-6 ${sidebarLayoutClassName}`}>
            <main className="min-w-0 space-y-6">{children}</main>
            <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
              {sidebar}
            </aside>
          </div>
        ) : (
          <main className="mt-6 space-y-6">{children}</main>
        )}
      </div>
    </div>
  );
}
