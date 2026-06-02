import { BadgeCheck, LineChart, Radar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

const FEATURES = [
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
    title: "Risk and Options View",
    description:
      "Risk matrisi, IV crush gorunumu ve opsiyon odakli arastirma ekranlarini birlestirir.",
  },
];

const INCLUDED = [
  "Aylik web erisimi",
  "Momentum scanner modulu",
  "Earnings benchmark paneli",
  "Risk matrisi ve opsiyon gorunumu",
  "E-posta destek: support@gistify.pro",
];

export default function Landing({ language }: { language: AppLanguage }) {
  return (
    <PublicShell
      language={language}
      eyebrow="Public Product Overview"
      title="Gistify, earnings oncesi karar surecini hizlandiran abonelik tabanli analiz platformudur."
      description="Platform; momentum tarama, earnings oncesi hisse incelemesi, sektor bazli baglam, risk matrisi ve opsiyon arastirma ekranlarini tek bir web uygulamasinda sunar."
      ctaHref="/pricing"
      ctaLabel="Fiyati incele"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl">
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map(item => {
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
                Pricing Snapshot
              </p>
              <h2 className="mt-2 text-3xl font-semibold">250 TRY / ay</h2>
            </div>

            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Paddle approval pending
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {INCLUDED.map(item => (
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
              <a href="/app">Uygulamayi ac</a>
            </Button>
            <Button asChild variant="outline" className="bg-background/70">
              <a href="/pricing">Detayli fiyat bilgisi</a>
            </Button>
          </div>
        </aside>
      </div>
    </PublicShell>
  );
}
