import { copy, type AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

export default function Pricing({
  language,
  onLanguageChange,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const categories = [
    {
      title: copy(language, "Kazanc & Strateji", "Earnings & Strategy"),
      items: [
        copy(
          language,
          "Earnings Strategy Workspace — Post, Playbook, Calendar ve Risk sekmeleri",
          "Earnings Strategy Workspace — Post, Playbook, Calendar and Risk tabs"
        ),
        copy(
          language,
          "Earnings Workspace — Overview, Calendar, Strategies, CPR & Greeks, Portfolio",
          "Earnings Workspace — Overview, Calendar, Strategies, CPR & Greeks, Portfolio"
        ),
        copy(
          language,
          "Hisse bazli kazanc detayi, strategy card'lar ve desk notlari",
          "Per-stock earnings detail, strategy cards and desk notes"
        ),
        copy(
          language,
          "Kazanc takvimi ve pre-earnings analiz sekmeleri",
          "Earnings calendar and pre-earnings analysis tabs"
        ),
      ],
    },
    {
      title: copy(language, "Momentum & Scanner", "Momentum & Scanner"),
      items: [
        copy(
          language,
          "Live Momentum Scanner / Midas Feed",
          "Live Momentum Scanner / Midas Feed"
        ),
        copy(
          language,
          "MomentumFlowSurface — piyasa pulse'u ve momentum sinyalleri",
          "MomentumFlowSurface — market pulse and momentum signals"
        ),
        copy(
          language,
          "Hero insight kartlari, canli scanner overlay ve snapshot karsilastirma",
          "Hero insight cards, live scanner overlay and snapshot comparison"
        ),
      ],
    },
    {
      title: copy(language, "Makro & Piyasa", "Macro & Market"),
      items: [
        copy(
          language,
          "Gunluk piyasa raporu (Daily Report) — markdown + HTML + figurler",
          "Daily market report — markdown + HTML + figures"
        ),
        copy(
          language,
          "Makro ekonomik takvim — FOMC, PMI, istihdam, VIX/Fear-Greed outlook",
          "Macro economic calendar — FOMC, PMI, employment, VIX/Fear-Greed outlook"
        ),
        copy(
          language,
          "CPI/PPI forecast, scenario matrix ve playbook",
          "CPI/PPI forecast, scenario matrix and playbook"
        ),
        copy(
          language,
          "Market Flash — pre/after-market, saatlik rapor, movers, setups, 0DTE",
          "Market Flash — pre/after-market, hourly report, movers, setups, 0DTE"
        ),
      ],
    },
    {
      title: copy(language, "Risk & Opsiyon", "Risk & Options"),
      items: [
        copy(
          language,
          "Risk matrisi — beat ihtimali x momentum scatter ve risk dagilimi",
          "Risk matrix — beat probability x momentum scatter and risk distribution"
        ),
        copy(
          language,
          "IV crush gorunumu, call/put kar potansiyeli siralamasi",
          "IV crush view, call/put profit potential ranking"
        ),
        copy(
          language,
          "Opsiyon playbook, expected move ve portfoy stratejisi",
          "Options playbook, expected move and portfolio strategy"
        ),
      ],
    },
    {
      title: copy(language, "Erisim & Destek", "Access & Support"),
      items: [
        copy(
          language,
          "Web uzerinden tum locked workspace'lere sinirsiz erisim",
          "Unlimited web access to all locked workspaces"
        ),
        copy(
          language,
          "support@gistify.pro uzerinden dogrudan operator destegi",
          "Direct operator support via support@gistify.pro"
        ),
        copy(
          language,
          "Paddle uzerinden guvenli odeme ve abonelik yonetimi",
          "Secure checkout and subscription management via Paddle"
        ),
      ],
    },
  ];

  return (
    <PublicShell
      language={language}
      onLanguageChange={onLanguageChange}
      canonicalPath="/pricing"
      eyebrow={copy(language, "Fiyatlandirma", "Pricing")}
      title={copy(
        language,
        "Tek planli aylik abonelik",
        "Single monthly subscription"
      )}
      description={copy(
        language,
        "Gistify, dijital abonelik modeliyle calisir. Tek aktif planimiz aylik 5 ABD dolari olarak fiyatlanir; tum earnings, momentum, makro ve risk modullerine web erisimi saglar.",
        "Gistify runs on a digital subscription model. Our single active plan is priced at $5 per month and includes web access to all earnings, momentum, macro and risk modules."
      )}
      ctaHref="/pay"
      ctaLabel={copy(language, "Odeme sayfasini ac", "Open payment page")}
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-border bg-card/85 p-6 shadow-xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {copy(language, "Gistify Pro", "Gistify Pro")}
              </p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-5xl font-semibold">$5</span>
                <span className="pb-1 text-sm text-muted-foreground">
                  {copy(language, "/ ay", "/ month")}
                </span>
              </div>
            </div>
            <p className="max-w-xs text-right text-xs leading-relaxed text-muted-foreground">
              {copy(
                language,
                "Tum desk modullerini tek aylik planla acin.",
                "Unlock every desk module with a single monthly plan."
              )}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {categories.map(category => (
              <div
                key={category.title}
                className="rounded-xl border border-border bg-background/60 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {category.title}
                </p>
                <ul className="mt-3 space-y-2">
                  {category.items.map(item => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/80 p-6 shadow-xl">
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
                "Fiyat ABD dolari uzerinden gosterilir. Checkout ve abonelik yonetimi Paddle uzerinden bu siteye baglandi.",
                "Pricing is shown in USD. Checkout and subscription management are wired through Paddle on this site."
              )}
            </p>
            <p>
              {copy(
                language,
                "Guncel iade kosullari icin ",
                "For current refund terms, see the "
              )}
              <a className="text-primary underline" href="/refund">
                {copy(language, "iade politikasi", "refund policy")}
              </a>
              {copy(
                language,
                ", diger hukuki sartlar icin ",
                ". For other legal terms, review the "
              )}
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
