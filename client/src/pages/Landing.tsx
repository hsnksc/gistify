import { BadgeCheck, LineChart, Radar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

export default function Landing({
  language,
  onLanguageChange,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const features = [
    {
      icon: Radar,
      title: copy(language, "Momentum Scanner", "Momentum Scanner"),
      description: copy(
        language,
        "Acilis momentumu, hacim degisimi ve sektor dagilimi ile hareketli hisseleri tarar.",
        "Scans active names using opening momentum, volume change and sector distribution signals."
      ),
    },
    {
      icon: LineChart,
      title: copy(language, "Pre-Earnings Analysis", "Pre-Earnings Analysis"),
      description: copy(
        language,
        "Earnings oncesi beklenti, beat olasiligi, sektor baglami ve yonsel analiz sunar.",
        "Shows expectations, beat probability, sector context and directional analysis before earnings."
      ),
    },
    {
      icon: ShieldCheck,
      title: copy(language, "Risk ve Opsiyon Gorunumu", "Risk and Options View"),
      description: copy(
        language,
        "Risk matrisi, IV crush gorunumu ve opsiyon odakli arastirma ekranlarini birlestirir.",
        "Combines risk matrix screens, IV crush views and options-focused research modules."
      ),
    },
  ];

  const included = [
    copy(language, "Aylik web erisimi", "Monthly web access"),
    copy(language, "Momentum scanner modulu", "Momentum scanner module"),
    copy(language, "Earning strategy paneli", "Earning strategy dashboard"),
    copy(language, "Risk matrisi ve opsiyon gorunumu", "Risk matrix and options view"),
    copy(language, "E-posta destek: support@gistify.pro", "Email support: support@gistify.pro"),
  ];

  return (
    <PublicShell
      language={language}
      onLanguageChange={onLanguageChange}
      eyebrow="Public Product Overview"
      title={copy(
        language,
        "Gistify, earnings oncesi karar surecini hizlandiran abonelik tabanli analiz platformudur.",
        "Gistify is a subscription-based analytics platform built to speed up pre-earnings decision making."
      )}
      description={copy(
        language,
        "Platform; momentum tarama, earnings oncesi hisse incelemesi, sektor bazli baglam, risk matrisi ve opsiyon arastirma ekranlarini tek bir web uygulamasinda sunar.",
        "The platform brings momentum scanning, pre-earnings stock research, sector context, risk matrix views and options research together in a single web app."
      )}
      ctaHref="/pay"
      ctaLabel={copy(language, "Aboneligi baslat", "Start subscription")}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={`${item.title}-${index}`}
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
                {copy(language, "Fiyat Ozeti", "Pricing Snapshot")}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                250 {copy(language, "TRY / ay", "TRY / month")}
              </h2>
            </div>

            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              {copy(language, "Paddle checkout aktif", "Paddle checkout live")}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {included.map(item => (
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
              <a href="/app">{copy(language, "Uygulamayi ac", "Open app")}</a>
            </Button>
            <Button asChild variant="outline" className="bg-background/70">
              <a href="/pricing">{copy(language, "Detayli fiyat bilgisi", "Detailed pricing")}</a>
            </Button>
          </div>
        </aside>
      </div>
    </PublicShell>
  );
}
