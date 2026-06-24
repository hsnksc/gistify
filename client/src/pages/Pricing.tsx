import { copy, type AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

export default function Pricing({
  language,
  onLanguageChange,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const items = [
    copy(language, "Momentum scanner", "Momentum scanner"),
    copy(language, "Earning strategy paneli", "Earning strategy dashboard"),
    copy(language, "Pre-earnings hisse analiz sekmeleri", "Pre-earnings stock analysis tabs"),
    copy(language, "Risk matrisi ve IV crush gorunumu", "Risk matrix and IV crush views"),
    copy(language, "Web erisimi ve support@gistify.pro destegi", "Web access and support via support@gistify.pro"),
  ];

  return (
    <PublicShell
      language={language}
      onLanguageChange={onLanguageChange}
      eyebrow={copy(language, "Fiyatlandirma", "Pricing")}
      title={copy(language, "Tek planli aylik abonelik", "Single monthly subscription")}
      description={copy(
        language,
        "Gistify, dijital abonelik modeliyle calisir. Tek aktif planimiz aylik 250 TRY olarak fiyatlanir ve tum analiz modullerine web erisimi saglar.",
        "Gistify runs on a digital subscription model. Our single active plan is priced at 250 TRY per month and includes web access to all analysis modules."
      )}
      ctaHref="/pay"
      ctaLabel={copy(language, "Odeme sayfasini ac", "Open payment page")}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-border bg-card/85 p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {copy(language, "Gistify Pro", "Gistify Pro")}
          </p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-5xl font-semibold">250</span>
            <span className="pb-1 text-sm text-muted-foreground">
              {copy(language, "TRY / ay", "TRY / month")}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {items.map(item => (
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
          <h2 className="text-xl font-semibold">
            {copy(language, "Onemli notlar", "Important notes")}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              {copy(
                language,
                "Abonelik, web uygulamasina erisim icin kullanilir. Fiziksel urun gonderimi yoktur; teslimat tamamen dijitaldir.",
                "The subscription is used for access to the web application. No physical product is shipped; delivery is fully digital."
              )}
            </p>
            <p>
              {copy(
                language,
                "Fiyat TRY uzerinden gosterilir. Checkout ve abonelik yonetimi Paddle uzerinden bu siteye baglandi.",
                "Pricing is shown in TRY. Checkout and subscription management are wired through Paddle on this site."
              )}
            </p>
            <p>
              {copy(language, "Guncel iade kosullari icin ", "For current refund terms, see the ")}
              <a className="text-primary underline" href="/refund">
                {copy(language, "iade politikasi", "refund policy")}
              </a>
              {copy(language, ", diger hukuki sartlar icin ", ". For other legal terms, review the ")}
              <a className="text-primary underline" href="/terms">
                {copy(language, "kullanim kosullari", "terms of service")}
              </a>
              {copy(language, " ve ", " and the ")}
              <a className="text-primary underline" href="/privacy">
                {copy(language, "gizlilik politikasi", "privacy policy")}
              </a>
              {copy(language, " sayfalarina bak.", ".")}
            </p>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
