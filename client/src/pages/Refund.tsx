import type { AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

const COPY = {
  tr: {
    eyebrow: "Refund Policy",
    title: "Iade politikasi",
    description:
      "Gistify odemeleri Paddle uzerinden islenecektir. Bu sayfa, Paddle ile uyumlu iade cercevesinin kisa ozetini verir.",
    ctaLabel: "Fiyatlandirmaya don",
    requestTitle: "Iade talebi nasil gonderilir?",
    requestBody:
      "Iade talebi, Paddle dekontundaki baglanti uzerinden, abonelik yonetim ekranindan veya paddle.net uzerinden gonderilmelidir. Resmi detaylar icin Paddle refund policy uygulanir.",
    policyLabel: "Paddle refund policy",
    points: [
      "Gistify dijital erisim saglayan abonelik hizmetidir; fiziksel urun teslimati yoktur.",
      "Iade talepleri islem tarihinden itibaren 14 takvim gunu icinde gonderilmelidir.",
      "Iade degerlendirmesi ve uygunluk kurallari Paddle refund policy uzerinden yurutulur.",
      "Iade onaylanirsa ilgili urun veya abonelik erisimi sona erer.",
      "Kullanicinin yasal zorunlu tuketici haklari saklidir.",
    ],
  },
  en: {
    eyebrow: "Refund Policy",
    title: "Refund policy",
    description:
      "Payments for Gistify will be processed through Paddle. This page gives a short summary of the refund framework aligned with Paddle.",
    ctaLabel: "Back to pricing",
    requestTitle: "How do I submit a refund request?",
    requestBody:
      "A refund request should be submitted using the link in the Paddle receipt, from the subscription management screen, or via paddle.net. The official Paddle refund policy applies.",
    policyLabel: "Paddle refund policy",
    points: [
      "Gistify is a digital access subscription service; no physical product is delivered.",
      "Refund requests must be submitted within 14 calendar days from the transaction date.",
      "Refund eligibility and review are handled in line with the Paddle refund policy.",
      "If a refund is approved, access to the related product or subscription will end.",
      "Any mandatory consumer rights available under applicable law remain reserved.",
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
          <p className="mt-4 text-sm">
            <a
              className="text-primary underline"
              href="https://www.paddle.com/legal/refund-policy"
              target="_blank"
              rel="noreferrer"
            >
              {copy.policyLabel}
            </a>
          </p>
        </aside>
      </div>
    </PublicShell>
  );
}
