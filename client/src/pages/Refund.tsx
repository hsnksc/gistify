import type { AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

const COPY = {
  tr: {
    eyebrow: "Refund Policy",
    title: "Iade politikasi",
    description:
      "Bu politika, Gistify dijital aboneligi icin uygulanacak temel iade prensiplerini aciklar.",
    ctaLabel: "Fiyatlandirmaya don",
    requestTitle: "Iade talebi nasil gonderilir?",
    requestBody:
      "Odeme tarihi, kullanilan e-posta adresi ve sorunun kisa aciklamasi ile support@gistify.pro adresine ulas. Talep, odeme kaydi ve hesap erisimi kontrol edilerek degerlendirilir.",
    points: [
      "Gistify dijital erisim saglayan abonelik hizmetidir; fiziksel urun teslimati yoktur.",
      "Abonelik aktive edilmeden once yanlis veya cift tahsilat gibi acik teknik odeme hatalari icin iade talebi destek tarafindan degerlendirilir.",
      "Abonelik aktive olduktan ve hizmete erisim saglandiktan sonra gecmis donemler icin otomatik iade sunulmaz.",
      "Kullanicinin yasal zorunlu tuketici haklari saklidir.",
      "Iade veya tahsilat inceleme talepleri support@gistify.pro adresine siparis ayrintilariyla birlikte iletilmelidir.",
    ],
  },
  en: {
    eyebrow: "Refund Policy",
    title: "Refund policy",
    description:
      "This policy outlines the core refund principles for the Gistify digital subscription service.",
    ctaLabel: "Back to pricing",
    requestTitle: "How do I submit a refund request?",
    requestBody:
      "Contact support@gistify.pro with the payment date, the email address used for the order and a short description of the issue. The request will be reviewed against the billing record and account access status.",
    points: [
      "Gistify is a digital access subscription service; no physical product is delivered.",
      "Before subscription activation, clear technical billing errors such as duplicate or incorrect charges may be reviewed for refund eligibility by support.",
      "After the subscription has been activated and access to the service has been provided, past billing periods are not automatically refunded.",
      "Any mandatory consumer rights available under applicable law remain reserved.",
      "Refund or charge review requests should be sent to support@gistify.pro together with the relevant order details.",
    ],
  },
} as const;

export default function Refund({
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
      ctaHref="/pricing"
      ctaLabel={copy.ctaLabel}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-3xl border border-border bg-card/82 p-6 shadow-xl">
          <div className="space-y-3">
            {copy.points.map(point => (
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
          <h2 className="text-xl font-semibold">{copy.requestTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {copy.requestBody}
          </p>
        </aside>
      </div>
    </PublicShell>
  );
}
