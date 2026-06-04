import type { AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

const COPY = {
  tr: {
    eyebrow: "Pricing",
    title: "Tek planli aylik abonelik",
    description:
      "Gistify, dijital abonelik modeliyle calisir. Tek aktif planimiz aylik 250 TRY olarak fiyatlanir ve tum analiz modullerine web erisimi saglar.",
    ctaLabel: "Odeme sayfasini ac",
    planName: "Gistify Pro",
    priceSuffix: "TRY / ay",
    notesTitle: "Onemli notlar",
    note1:
      "Abonelik, web uygulamasina erisim icin kullanilir. Fiziksel urun gonderimi yoktur; teslimat tamamen dijitaldir.",
    note2:
      "Fiyat TRY uzerinden gosterilir. Checkout ve abonelik yonetimi Paddle uzerinden bu siteye baglandi.",
    note3Prefix: "Guncel iade kosullari icin ",
    note3Middle: ", diger hukuki sartlar icin ",
    note3Suffix: " sayfalarina bak.",
    refund: "iade politikasi",
    terms: "kullanim kosullari",
    privacy: "gizlilik politikasi",
    items: [
      "Momentum scanner",
      "Earnings benchmark paneli",
      "Pre-earnings stock analysis tabs",
      "Risk matrisi ve IV crush gorunumu",
      "Web erisimi ve support@gistify.pro destegi",
    ],
  },
  en: {
    eyebrow: "Pricing",
    title: "Single monthly subscription",
    description:
      "Gistify runs on a digital subscription model. Our single active plan is priced at 250 TRY per month and includes web access to all analysis modules.",
    ctaLabel: "Open payment page",
    planName: "Gistify Pro",
    priceSuffix: "TRY / month",
    notesTitle: "Important notes",
    note1:
      "The subscription is used for access to the web application. No physical product is shipped; delivery is fully digital.",
    note2:
      "Pricing is shown in TRY. Checkout and subscription management are wired through Paddle on this site.",
    note3Prefix: "For current refund terms, see the ",
    note3Middle: ". For other legal terms, review the ",
    note3Suffix: ".",
    refund: "refund policy",
    terms: "terms of service",
    privacy: "privacy policy",
    items: [
      "Momentum scanner",
      "Earnings benchmark dashboard",
      "Pre-earnings stock analysis tabs",
      "Risk matrix and IV crush views",
      "Web access and support via support@gistify.pro",
    ],
  },
} as const;

export default function Pricing({
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
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-border bg-card/85 p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {copy.planName}
          </p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-5xl font-semibold">250</span>
            <span className="pb-1 text-sm text-muted-foreground">
              {copy.priceSuffix}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {copy.items.map(item => (
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
          <h2 className="text-xl font-semibold">{copy.notesTitle}</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>{copy.note1}</p>
            <p>{copy.note2}</p>
            <p>
              {copy.note3Prefix}
              <a className="text-primary underline" href="/refund">
                {copy.refund}
              </a>
              {copy.note3Middle}
              <a className="text-primary underline" href="/terms">
                {copy.terms}
              </a>
              {language === "en" ? " and the " : " ve "}
              <a className="text-primary underline" href="/privacy">
                {copy.privacy}
              </a>
              {copy.note3Suffix}
            </p>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
