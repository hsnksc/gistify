import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/i18n";

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
  const navItems =
    language === "en"
      ? [
          { href: "/", label: "Home" },
          { href: "/pricing", label: "Pricing" },
          { href: "/terms", label: "Terms" },
          { href: "/privacy", label: "Privacy" },
          { href: "/refund", label: "Refund" },
          { href: "/app", label: "Open App" },
        ]
      : [
          { href: "/", label: "Ana Sayfa" },
          { href: "/pricing", label: "Fiyatlandirma" },
          { href: "/terms", label: "Kullanim Kosullari" },
          { href: "/privacy", label: "Gizlilik Politikasi" },
          { href: "/refund", label: "Iade Politikasi" },
          { href: "/app", label: "Uygulamayi Ac" },
        ];

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 tactical-grid opacity-20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_60%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
        <header className="rounded-3xl border border-border bg-card/85 p-4 shadow-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Gistify
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "Earnings intelligence and momentum research platform"
                  : "Earnings intelligence ve momentum arastirma platformu"}
              </p>
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

              <nav className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {navItems.map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-border bg-background/70 px-3 py-1.5 transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
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
