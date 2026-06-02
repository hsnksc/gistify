import type { AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

const POLICY_POINTS = [
  "Gistify dijital erisim saglayan abonelik hizmetidir; fiziksel urun teslimati yoktur.",
  "Abonelik aktive edilmeden once yanlis veya cift tahsilat gibi acik teknik odeme hatalari icin iade talebi destek tarafindan degerlendirilir.",
  "Abonelik aktive olduktan ve hizmete erisim saglandiktan sonra gecmis donemler icin otomatik iade sunulmaz.",
  "Kullanicinin yasal zorunlu tuketici haklari saklidir.",
  "Iade veya tahsilat inceleme talepleri support@gistify.pro adresine siparis ayrintilariyla birlikte iletilmelidir.",
];

export default function Refund({ language }: { language: AppLanguage }) {
  return (
    <PublicShell
      language={language}
      eyebrow="Refund Policy"
      title="Iade politikasi"
      description="Bu politika, Gistify dijital aboneligi icin uygulanacak temel iade prensiplerini aciklar."
      ctaHref="/pricing"
      ctaLabel="Fiyatlandirmaya don"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-3xl border border-border bg-card/82 p-6 shadow-xl">
          <div className="space-y-3">
            {POLICY_POINTS.map(point => (
              <div
                key={point}
                className="rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
              >
                {point}
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-3xl border border-border bg-card/82 p-6 shadow-xl">
          <h2 className="text-xl font-semibold">
            Iade talebi nasil gonderilir?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Odeme tarihi, kullanilan e-posta adresi ve sorunun kisa aciklamasi
            ile support@gistify.pro adresine ulas. Talep, odeme kaydi ve hesap
            erisimi kontrol edilerek degerlendirilir.
          </p>
        </aside>
      </div>
    </PublicShell>
  );
}
