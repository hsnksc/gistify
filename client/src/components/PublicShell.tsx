import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";

interface PublicShellProps {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
}

export default function PublicShell({
  language,
  onLanguageChange,
  eyebrow,
  title,
  description,
  children,
  ctaHref,
  ctaLabel,
}: PublicShellProps) {
  const navItems = [
    { href: "/", label: copy(language, "Ana Sayfa", "Home") },
    { href: "/app", label: copy(language, "Uygulamayi Ac", "Open App") },
    { href: "/pricing", label: copy(language, "Fiyatlandirma", "Pricing") },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 tactical-grid opacity-20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_60%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
        <header className="rounded-3xl border border-border bg-card/85 p-4 shadow-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/gistifylogo.jpeg?v=20260606-1"
                alt="Gistify logo"
                className="size-12 rounded-2xl border border-border object-cover shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
              />
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Gistify
                </p>
                <p className="text-sm text-muted-foreground">
                  {copy(language, "Earnings intelligence ve momentum arastirma platformu", "Earnings intelligence and momentum research platform")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-border bg-background/70 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => onLanguageChange("tr")}
                  className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
                    language === "tr"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  TR
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange("en")}
                  className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
                    language === "en"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  EN
                </button>
              </div>

              <nav className="flex flex-wrap items-center gap-2 text-xs">
                {navItems.map(item => {
                  const primary = item.href === "/app";

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={
                        primary
                          ? "rounded-full border border-emerald-500/30 bg-emerald-500/12 px-4 py-1.5 font-semibold text-emerald-200 shadow-[0_12px_28px_rgba(16,185,129,0.16)] transition-colors hover:border-emerald-400/45 hover:bg-emerald-500/18"
                          : "rounded-full border border-border bg-background/70 px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
                      }
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] border border-border bg-card/88 p-6 shadow-2xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {eyebrow}
              </p>
              <h1 className="max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {description}
              </p>
            </div>

            {ctaHref && ctaLabel ? (
              <Button asChild size="lg" className="h-11 min-w-[220px]">
                <a href={ctaHref}>
                  {ctaLabel}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            ) : null}
          </div>
        </section>

        <main data-language={language}>{children}</main>
      </div>
    </div>
  );
}
