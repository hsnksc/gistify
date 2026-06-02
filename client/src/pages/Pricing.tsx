import type { AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

const PRICE_ITEMS = [
  "Momentum scanner",
  "Earnings benchmark dashboard",
  "Pre-earnings stock analysis tabs",
  "Risk matrix and IV crush views",
  "Web access and support via support@gistify.pro",
];

export default function Pricing({ language }: { language: AppLanguage }) {
  return (
    <PublicShell
      language={language}
      eyebrow="Pricing"
      title="Tek planli aylik abonelik"
      description="Gistify, dijital abonelik modeliyle calisir. Tek aktif planimiz aylik 250 TRY olarak fiyatlanir ve tum analiz modullerine web erisimi saglar."
      ctaHref="/pay"
      ctaLabel="Odeme sayfasini ac"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-border bg-card/85 p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Gistify Pro
          </p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-5xl font-semibold">250</span>
            <span className="pb-1 text-sm text-muted-foreground">TRY / ay</span>
          </div>

          <div className="mt-6 space-y-3">
            {PRICE_ITEMS.map(item => (
              <div
                key={item}
                className="rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl">
          <h2 className="text-xl font-semibold">Onemli notlar</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Abonelik, web uygulamasina erisim icin kullanilir. Fiziksel urun
              gonderimi yoktur; teslimat tamamen dijitaldir.
            </p>
            <p>
              Fiyat TRY uzerinden gosterilir. Paddle canli odeme aktivasyonu
              tamamlandiginda checkout bu site uzerinden calisacaktir.
            </p>
            <p>
              Guncel iade kosullari icin{" "}
              <a className="text-primary underline" href="/refund">
                iade politikasi
              </a>
              , diger hukuki sartlar icin{" "}
              <a className="text-primary underline" href="/terms">
                kullanim kosullari
              </a>{" "}
              ve
              <a className="text-primary underline" href="/privacy">
                {" "}
                gizlilik politikasi
              </a>{" "}
              sayfalarina bak.
            </p>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
