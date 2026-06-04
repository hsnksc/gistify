import { BadgeCheck, LineChart, Radar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

const COPY = {
  tr: {
    eyebrow: "Public Product Overview",
    title:
      "Gistify, earnings oncesi karar surecini hizlandiran abonelik tabanli analiz platformudur.",
    description:
      "Platform; momentum tarama, earnings oncesi hisse incelemesi, sektor bazli baglam, risk matrisi ve opsiyon arastirma ekranlarini tek bir web uygulamasinda sunar.",
    ctaLabel: "Aboneligi baslat",
    pricingSnapshot: "Fiyat Ozeti",
    approvalPending: "Paddle checkout aktif",
    openApp: "Uygulamayi ac",
    pricingDetails: "Detayli fiyat bilgisi",
    priceSuffix: "TRY / ay",
    features: [
      {
        icon: Radar,
        title: "Momentum Scanner",
        description:
          "Acilis momentumu, hacim degisimi ve sektor dagilimi ile hareketli hisseleri tarar.",
      },
      {
        icon: LineChart,
        title: "Pre-Earnings Analysis",
        description:
          "Earnings oncesi beklenti, beat olasiligi, sektor baglami ve yonsel analiz sunar.",
      },
      {
        icon: ShieldCheck,
        title: "Risk ve Opsiyon Gorunumu",
        description:
          "Risk matrisi, IV crush gorunumu ve opsiyon odakli arastirma ekranlarini birlestirir.",
      },
    ],
    included: [
      "Aylik web erisimi",
      "Momentum scanner modulu",
      "Earnings benchmark paneli",
      "Risk matrisi ve opsiyon gorunumu",
      "E-posta destek: support@gistify.pro",
    ],
  },
  en: {
    eyebrow: "Public Product Overview",
    title:
      "Gistify is a subscription-based analytics platform built to speed up pre-earnings decision making.",
    description:
      "The platform brings momentum scanning, pre-earnings stock research, sector context, risk matrix views and options research together in a single web app.",
    ctaLabel: "Start subscription",
    pricingSnapshot: "Pricing Snapshot",
    approvalPending: "Paddle checkout live",
    openApp: "Open app",
    pricingDetails: "Detailed pricing",
    priceSuffix: "TRY / month",
    features: [
      {
        icon: Radar,
        title: "Momentum Scanner",
        description:
          "Scans active names using opening momentum, volume change and sector distribution signals.",
      },
      {
        icon: LineChart,
        title: "Pre-Earnings Analysis",
        description:
          "Shows expectations, beat probability, sector context and directional analysis before earnings.",
      },
      {
        icon: ShieldCheck,
        title: "Risk and Options View",
        description:
          "Combines risk matrix screens, IV crush views and options-focused research modules.",
      },
    ],
    included: [
      "Monthly web access",
      "Momentum scanner module",
      "Earnings benchmark dashboard",
      "Risk matrix and options view",
      "Email support: support@gistify.pro",
    ],
  },
} as const;

export default function Landing({
  language,
  onLanguageChange,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const copy = COPY[language];

  return (
    <PublicShell
      language={language}
      onLanguageChange={onLanguageChange}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      ctaHref="/pay"
      ctaLabel={copy.ctaLabel}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl">
          <div className="grid gap-4 md:grid-cols-3">
            {copy.features.map(item => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border bg-background/60 p-4"
                >
                  <Icon className="size-5 text-primary" />
                  <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="rounded-3xl border border-border bg-card/85 p-6 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {copy.pricingSnapshot}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                250 {copy.priceSuffix}
              </h2>
            </div>

            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              {copy.approvalPending}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {copy.included.map(item => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3"
              >
                <BadgeCheck className="size-4 text-primary" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a href="/app">{copy.openApp}</a>
            </Button>
            <Button asChild variant="outline" className="bg-background/70">
              <a href="/pricing">{copy.pricingDetails}</a>
            </Button>
          </div>
        </aside>
      </div>
    </PublicShell>
  );
}
