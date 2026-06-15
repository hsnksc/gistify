import {
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  Layers3,
  LineChart,
  Radar,
  ShieldCheck,
  Target,
} from "lucide-react";
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
  const heroHighlights = [
    copy(language, "Momentum scanner", "Momentum scanner"),
    copy(language, "Pre-earnings playbook", "Pre-earnings playbook"),
    copy(language, "Risk matrix + opsiyon", "Risk matrix + options"),
  ];

  const heroStats = [
    {
      value: "3",
      label: copy(language, "cekirdek workspace", "core workspaces"),
      detail: copy(
        language,
        "Momentum, earnings ve risk gorunumu ayni akis icinde acilir.",
        "Momentum, earnings and risk views stay in one connected flow."
      ),
    },
    {
      value: "1",
      label: copy(language, "tek web akisi", "single web flow"),
      detail: copy(
        language,
        "Tarama, baglam ve planlama farkli araclara dagilmaz.",
        "Scanning, context and planning do not get split across tools."
      ),
    },
    {
      value: "250 TRY",
      label: copy(language, "aylik erisim", "monthly access"),
      detail: copy(
        language,
        "Tek abonelikle tum public analiz yuzeyi ve uygulama erisimi.",
        "One subscription for the public research surface and app access."
      ),
    },
  ];

  const productOverview = [
    {
      icon: Radar,
      eyebrow: copy(language, "Tarama", "Scan"),
      title: copy(language, "Momentum Scanner", "Momentum Scanner"),
      description: copy(
        language,
        "Acilis momentumu, hacim degisimi ve sektor dagilimini izleyerek hangi isimlerin gercekten hareket ettigini ayiklar.",
        "Filters opening momentum, volume change and sector rotation so you can see which names are truly in motion."
      ),
      bullets: [
        copy(language, "Acilis gucu ve hacim sapmasi", "Opening strength and volume deviation"),
        copy(language, "Sektor bazli liderlik takibi", "Sector leadership tracking"),
        copy(language, "Hizli karar icin sade sinyal katmani", "A compressed signal layer for fast decisions"),
      ],
    },
    {
      icon: LineChart,
      eyebrow: copy(language, "Earnings", "Earnings"),
      title: copy(language, "Pre-Earnings Brief", "Pre-Earnings Brief"),
      description: copy(
        language,
        "Beklenti seviyesi, beat riski, sektor baglami ve yon ihtimallerini tek kart yapisinda toplar.",
        "Packages expectation level, beat risk, sector context and directional framing into one decision card."
      ),
      bullets: [
        copy(language, "Event oncesi beklenti haritasi", "Expectation map ahead of the event"),
        copy(language, "Sektor ve tema baglami", "Sector and theme context"),
        copy(language, "Pozisyon oncesi hizli okuma", "Fast reading before position sizing"),
      ],
    },
    {
      icon: ShieldCheck,
      eyebrow: copy(language, "Risk", "Risk"),
      title: copy(language, "Risk ve Opsiyon Gorunumu", "Risk and Options View"),
      description: copy(
        language,
        "Expected move, IV crush cercevesi ve opsiyon bazli risk/odul mantigini daha okunur hale getirir.",
        "Makes expected move, IV crush framing and options-based risk/reward easier to compare."
      ),
      bullets: [
        copy(language, "Risk matrisi ve senaryo dusuncesi", "Risk matrix and scenario thinking"),
        copy(language, "IV crush baglami", "IV crush context"),
        copy(language, "Opsiyon stratejiye uygun yorumlar", "Interpretation aligned with options structures"),
      ],
    },
    {
      icon: Layers3,
      eyebrow: copy(language, "Workflow", "Workflow"),
      title: copy(language, "Tek Panel Mantigi", "Single Workspace Logic"),
      description: copy(
        language,
        "Tarama, event analizi ve risk tarafini tek bir urun mantiginda birlestirir; sekmeler arasinda kaybolmazsin.",
        "Unifies scan, event analysis and risk framing inside one product logic so the workflow stays coherent."
      ),
      bullets: [
        copy(language, "Daha az sekme, daha net baglam", "Fewer tabs, cleaner context"),
        copy(language, "Giris oncesi kontrol listesi hissi", "A pre-entry checklist feel"),
        copy(language, "Ayni ekranda tekrar kullanilabilir duzen", "A reusable layout in the same screen"),
      ],
    },
  ];

  const outcomes = [
    {
      icon: Target,
      title: copy(language, "Daha net odak", "Sharper focus"),
      description: copy(
        language,
        "Gunluk tarama ile event hazirligini ayri urunler gibi degil, tek karar hatti gibi gorursun.",
        "See daily scans and event prep as one decision lane instead of separate products."
      ),
    },
    {
      icon: Clock3,
      title: copy(language, "Daha hizli hazirlik", "Faster prep"),
      description: copy(
        language,
        "Bir hissenin neden radarina girdigini ve earnings oncesi nasil cercevelenecegini daha kisa surede anlarsin.",
        "Understand why a ticker matters and how to frame it before earnings in less time."
      ),
    },
    {
      icon: ArrowUpRight,
      title: copy(language, "Aksiyon diline yakin", "Closer to execution"),
      description: copy(
        language,
        "Yorumlar yalnizca bilgi vermez; pozisyon mantigina yaklasan karar ciktisi uretir.",
        "The output is not just informative; it is shaped to feel closer to an execution decision."
      ),
    },
  ];

  const workflow = [
    {
      step: "01",
      title: copy(language, "Hareketli isimleri tara", "Scan the active names"),
      description: copy(
        language,
        "Momentum ve hacim katmani hangi hisselerin gunun geri kalaninda onemli kalabilecegini filtreler.",
        "Momentum and volume layers filter the names most likely to stay important through the session."
      ),
    },
    {
      step: "02",
      title: copy(language, "Event baglamini kur", "Build the event context"),
      description: copy(
        language,
        "Earnings beklentisi, sektor baglami ve yon okunusu ayni workflow icinde netlesir.",
        "Earnings expectations, sector context and directional framing become readable in the same workflow."
      ),
    },
    {
      step: "03",
      title: copy(language, "Risk ve stratejiyi eslestir", "Match risk with structure"),
      description: copy(
        language,
        "Expected move ve opsiyon gorunumu, dusunceyi yalnizca fikirden plan seviyesine tasir.",
        "Expected move and options context push the idea from raw thesis to a usable plan."
      ),
    },
  ];

  const included = [
    copy(language, "Tum analiz modullerine aylik web erisimi", "Monthly web access to all analysis modules"),
    copy(language, "Momentum scanner ve sektor gorunumu", "Momentum scanner and sector view"),
    copy(language, "Pre-earnings research dashboard'lari", "Pre-earnings research dashboards"),
    copy(language, "Risk matrisi ve IV crush baglami", "Risk matrix and IV crush context"),
    copy(language, "E-posta destek: support@gistify.pro", "Email support: support@gistify.pro"),
  ];

  const bestFor = [
    copy(language, "Earnings oncesi plan kuran aktif traderlar", "Active traders building plans before earnings"),
    copy(language, "Tarama ve event baglamini ayni yerde isteyenler", "People who want scan and event context in one place"),
    copy(language, "Sekme kalabaligini azaltmak isteyen kullanicilar", "Users trying to reduce tab overload"),
  ];

  const accessNotes = [
    copy(language, "Tek aktif plan: 250 TRY / ay", "Single active plan: 250 TRY / month"),
    copy(language, "Dijital abonelik, fiziksel teslimat yok", "Digital subscription, no physical delivery"),
    copy(language, "Iade ve hukuki detaylar alt bolumdeki sayfalarda", "Refund and legal details are linked in the footer pages"),
  ];

  return (
    <PublicShell
      language={language}
      onLanguageChange={onLanguageChange}
      eyebrow="Public Product Overview"
      title={copy(
        language,
        "Momentum tarama, earnings planlama ve opsiyon risk cercevesi icin tek workspace.",
        "One workspace for momentum scans, pre-earnings planning and options risk framing."
      )}
      description={copy(
        language,
        "Gistify, aktif traderlarin tarama, event baglami, risk senaryosu ve aksiyon planini ayni akis icinde kurmasi icin tasarlandi. Daha az sekme, daha hizli hazirlik, daha net karar.",
        "Gistify is built for active traders who want scan results, event context, risk scenarios and an action plan inside one flow. Fewer tabs, faster prep, clearer decisions."
      )}
      ctaHref="/pay"
      ctaLabel={copy(language, "Aboneligi baslat", "Start subscription")}
      heroHighlights={heroHighlights}
      heroStats={heroStats}
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-border bg-card/84 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.22)]">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {copy(language, "Product overview", "Product overview")}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              {copy(
                language,
                "Musterinin gormek istedigi sey: taramadan plana giden net bir urun akisi.",
                "What the customer gets: a clear product flow from scan to plan."
              )}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {copy(
                language,
                "Gistify yalnizca veri gosteren bir ekran degil; hangi ismin neden takip edilmesi gerektigini, event oncesi nasil okunacagini ve riskin nasil cercevelenecegini ayni deneyimde toplar.",
                "Gistify is not just another data screen. It combines why a name matters, how to read it before the event, and how to frame the risk inside the same experience."
              )}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {productOverview.map(item => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[1.5rem] border border-border bg-background/55 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.16)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        {item.eyebrow}
                      </p>
                      <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                    </div>
                    <div className="rounded-2xl border border-border bg-card/80 p-2.5">
                      <Icon className="size-5 text-primary" />
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    {item.bullets.map(point => (
                      <div
                        key={point}
                        className="rounded-2xl border border-border bg-card/70 px-3 py-2 text-sm text-muted-foreground"
                      >
                        {point}
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(17,24,39,0.94),rgba(12,18,31,0.88))] p-6 shadow-[0_26px_80px_rgba(0,0,0,0.24)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {copy(language, "Tek plan", "Single plan")}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                250 {copy(language, "TRY / ay", "TRY / month")}
              </h2>
            </div>

            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              {copy(language, "Paddle checkout aktif", "Paddle checkout live")}
            </div>
          </div>

          <div className="mt-6 space-y-3">
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

          <div className="mt-6 rounded-[1.5rem] border border-border bg-background/45 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              {copy(language, "Kimler icin uygun", "Best for")}
            </p>
            <div className="mt-3 space-y-2">
              {bestFor.map(item => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-card/70 px-3 py-2 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a href="/app">{copy(language, "Uygulamayi ac", "Open app")}</a>
            </Button>
            <Button asChild variant="outline" className="bg-background/70">
              <a href="/pricing">
                {copy(language, "Detayli fiyat bilgisi", "Detailed pricing")}
              </a>
            </Button>
          </div>
        </aside>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[2rem] border border-border bg-card/82 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {copy(language, "Neden cezbedici", "Why it converts")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            {copy(
              language,
              "Urunun degeri ozelliklerde degil, karar hizinda gorunur.",
              "The value is not just in the features, but in the speed of decision making."
            )}
          </h2>
          <div className="mt-6 space-y-4">
            {outcomes.map(item => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[1.5rem] border border-border bg-background/55 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-border bg-card/80 p-2.5">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card/82 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {copy(language, "Akis", "Workflow")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            {copy(
              language,
              "Tarama ekranindan aksiyon planina uc adimda ilerler.",
              "Move from scan screen to action plan in three steps."
            )}
          </h2>

          <div className="mt-6 grid gap-4">
            {workflow.map(item => (
              <article
                key={item.step}
                className="grid gap-4 rounded-[1.5rem] border border-border bg-background/55 p-5 md:grid-cols-[80px_1fr]"
              >
                <div className="rounded-2xl border border-border bg-card/80 px-4 py-3 text-center">
                  <p className="text-2xl font-semibold tracking-tight text-primary">
                    {item.step}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-[2rem] border border-border bg-card/80 p-6 shadow-[0_22px_60px_rgba(0,0,0,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {copy(language, "Ilk acilan sey", "What opens first")}
          </p>
          <h2 className="mt-3 text-xl font-semibold">
            {copy(
              language,
              "Hangi isme once bakacagini soyleyen net baslangic.",
              "A cleaner starting point for what deserves attention first."
            )}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {copy(
              language,
              "Momentum tarama katmani gunun enerjisini ozetler; boylece rastgele degil, sinyal bazli secim yaparsin.",
              "The momentum layer summarizes the energy of the session so the next click is signal-based rather than random."
            )}
          </p>
        </section>

        <section className="rounded-[2rem] border border-border bg-card/80 p-6 shadow-[0_22px_60px_rgba(0,0,0,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {copy(language, "Neler guncellenir", "What gets updated")}
          </p>
          <h2 className="mt-3 text-xl font-semibold">
            {copy(
              language,
              "Event oncesi baglam, risk ve opsiyon mantigi ayni urunun parcasi olur.",
              "Event context, risk and options framing stay part of the same product."
            )}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {copy(
              language,
              "Musteri yalnizca veri degil, kullanilabilir bir yorum yuzeyi gorur; bu da urunu daha premium hissettirir.",
              "The customer sees not only raw data but a usable interpretation layer, which makes the product feel more premium."
            )}
          </p>
        </section>

        <section className="rounded-[2rem] border border-border bg-card/80 p-6 shadow-[0_22px_60px_rgba(0,0,0,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {copy(language, "Erisim ve netlik", "Access and clarity")}
          </p>
          <h2 className="mt-3 text-xl font-semibold">
            {copy(
              language,
              "Abonelik teklifinin ticari cercevesi sade kalir.",
              "The commercial offer stays simple and easy to understand."
            )}
          </h2>
          <div className="mt-4 space-y-2">
            {accessNotes.map(item => (
              <div
                key={item}
                className="rounded-2xl border border-border bg-background/55 px-3 py-2 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
