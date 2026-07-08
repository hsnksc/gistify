import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { localizePath, type AppLanguage, t } from "@/lib/i18n";

interface PublicShellProps {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  canonicalPath?: string;
  ctaHref?: string;
  ctaLabel?: string;
  heroHighlights?: string[];
  heroStats?: Array<{
    value: string;
    label: string;
    detail?: string;
  }>;
  noindex?: boolean;
}

export default function PublicShell({
  language,
  onLanguageChange,
  eyebrow,
  title,
  description,
  children,
  canonicalPath,
  ctaHref,
  ctaLabel,
  heroHighlights,
  heroStats,
  noindex,
}: PublicShellProps) {
  const [location] = useLocation();
  usePageMeta({
    canonical: canonicalPath ?? location,
    description,
    language,
    noindex,
    title,
  });

  const navItems = [
    { href: localizePath("/", language), label: t("marketing:home") },
    { href: localizePath("/pricing", language), label: t("common:pricing") },
    { href: localizePath("/flow", language), label: t("common:flow") },
    { href: localizePath("/coverage", language), label: t("common:coverage") },
    { href: localizePath("/app", language), label: t("marketing:openApp") },
  ];
  const hasHeroAside = Boolean(
    (ctaHref && ctaLabel) || (heroStats && heroStats.length > 0)
  );

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 data-grid opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_42%),radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 pt-8 pb-4 md:px-6 md:pb-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="rounded-xl border border-border bg-[linear-gradient(135deg,rgba(17,24,39,0.95),rgba(15,23,42,0.88))] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <a
              href={localizePath("/", language)}
              className="flex items-center gap-3 rounded-xl transition-colors hover:text-foreground"
            >
              <img
                src="/gistifylogo.png?v=20260706"
                alt="Gistify logo"
                width="48"
                height="48"
                loading="eager"
                decoding="async"
                className="size-12 rounded-xl border border-border object-cover shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
              />
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Gistify
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("marketing:earningsIntelligenceAndMomentumResearch")}
                </p>
              </div>
            </a>

            <div className="flex flex-wrap items-center gap-2">
              <LanguageSelector
                language={language}
                onChange={onLanguageChange}
              />

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
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut", delay: 0.04 }}
          className="relative overflow-hidden rounded-xl border border-border bg-[linear-gradient(135deg,rgba(17,24,39,0.95),rgba(12,18,31,0.9))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.3)] md:p-8"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_28%),linear-gradient(120deg,transparent,rgba(148,163,184,0.03),transparent)]" />
          <div
            className={`relative grid gap-8 ${
              hasHeroAside ? "xl:grid-cols-[1.15fr_0.85fr] xl:items-end" : ""
            }`}
          >
            <div className="max-w-4xl space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {eyebrow}
              </p>
              <h1 className="max-w-4xl text-3xl font-semibold leading-[1.04] tracking-tight md:text-5xl md:leading-[1]">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {description}
              </p>

              {heroHighlights && heroHighlights.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {heroHighlights.map(item => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-background/55 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {hasHeroAside ? (
              <div className="grid gap-4 xl:justify-items-end">
                {ctaHref && ctaLabel ? (
                  <Button asChild size="lg" className="h-11 min-w-[220px]">
                    <a href={localizePath(ctaHref, language)}>
                      {ctaLabel}
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                ) : null}

                {heroStats && heroStats.length > 0 ? (
                  <div className="grid w-full gap-3 sm:grid-cols-3 xl:max-w-xl">
                    {heroStats.map(stat => (
                      <div
                        key={`${stat.label}-${stat.value}`}
                        className="rounded-xl border border-border bg-background/58 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.18)]"
                      >
                        <p className="text-2xl font-semibold tracking-tight">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                          {stat.label}
                        </p>
                        {stat.detail ? (
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            {stat.detail}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </motion.section>

        <motion.main
          data-language={language}
          className="space-y-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut", delay: 0.08 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
