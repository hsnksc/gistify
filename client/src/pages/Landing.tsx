import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  ChevronRight,
  Clock3,
  Layers3,
  LineChart,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

type PreviewMode = "flow" | "earnings" | "calendar";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut", delay },
  }),
};

export default function Landing({
  language,
  onLanguageChange,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("earnings");

  const previewTabs = [
    {
      id: "flow" as const,
      label: "Flow",
      icon: Radar,
      detail: copy(language, "ucretsiz", "free"),
    },
    {
      id: "earnings" as const,
      label: copy(language, "Earnings", "Earnings"),
      icon: LineChart,
      detail: copy(language, "ucretli", "paid"),
    },
    {
      id: "calendar" as const,
      label: copy(language, "Takvim", "Calendar"),
      icon: CalendarDays,
      detail: copy(language, "makro", "macro"),
    },
  ];

  const preview = useMemo(() => {
    switch (previewMode) {
      case "flow":
        return {
          heading: copy(language, "Flow Workspace", "Flow Workspace"),
          subheading: copy(
            language,
            "Acik isimler, bloklar ve gun ici liderlik tek satirda.",
            "Open names, blocks and intraday leadership in one line."
          ),
          metrics: [
            {
              label: copy(language, "Acilik", "Urgency"),
              value: "8 / 10",
              tone: "text-sky-300",
            },
            {
              label: copy(language, "En aktif tema", "Top theme"),
              value: copy(language, "AI yariletken", "AI semis"),
              tone: "text-emerald-300",
            },
            {
              label: copy(language, "Takip listesi", "Watchlist"),
              value: "NVDA · AVGO · CRWD",
              tone: "text-foreground",
            },
          ],
          rows: [
            {
              label: "AVGO",
              value: copy(language, "dark pool akisi hizlaniyor", "dark pool flow is accelerating"),
            },
            {
              label: "CRWD",
              value: copy(language, "pre-market hacmi ortalamanin 2.7x", "pre-market volume is 2.7x average"),
            },
            {
              label: "QQQ",
              value: copy(language, "risk-on tape acik kaliyor", "risk-on tape stays open"),
            },
          ],
          footer: copy(
            language,
            "Flow herkese acik. Ilk tarama ve gun ici baglam burada basliyor.",
            "Flow stays open to everyone. The first scan and intraday context start here."
          ),
        };
      case "calendar":
        return {
          heading: copy(language, "Macro Calendar", "Macro Calendar"),
          subheading: copy(
            language,
            "Yuksek onemli veri ve event riski anlik filtrelenir.",
            "High-importance data and event risk are filtered instantly."
          ),
          metrics: [
            {
              label: copy(language, "Sonraki event", "Next event"),
              value: copy(language, "PPI · 08:30 ET", "PPI · 08:30 ET"),
              tone: "text-amber-300",
            },
            {
              label: copy(language, "Gun temasi", "Day theme"),
              value: copy(language, "inflation tape", "inflation tape"),
              tone: "text-sky-300",
            },
            {
              label: copy(language, "Hazirlik modu", "Prep mode"),
              value: copy(language, "duration / USD", "duration / USD"),
              tone: "text-foreground",
            },
          ],
          rows: [
            {
              label: "08:30",
              value: copy(language, "PPI consensus 0.2 / core 0.2", "PPI consensus 0.2 / core 0.2"),
            },
            {
              label: "10:00",
              value: copy(language, "Fed speaker: rates tone check", "Fed speaker: rates tone check"),
            },
            {
              label: "14:00",
              value: copy(language, "UST 10Y ve DXY readthrough", "UST 10Y and DXY readthrough"),
            },
          ],
          footer: copy(
            language,
            "Makro workspace, event riskini ticker kararindan once masaya koyar.",
            "The macro workspace puts event risk on the desk before the ticker decision."
          ),
        };
      default:
        return {
          heading: copy(language, "Earnings Strategy", "Earnings Strategy"),
          subheading: copy(
            language,
            "Beat ihtimali, implied move ve opsiyon cercevesi ayni panelde.",
            "Beat probability, implied move and options framing in the same panel."
          ),
          metrics: [
            {
              label: copy(language, "Secili isim", "Selected name"),
              value: "CRWD",
              tone: "text-emerald-300",
            },
            {
              label: copy(language, "Bias", "Bias"),
              value: copy(language, "bull call spread", "bull call spread"),
              tone: "text-sky-300",
            },
            {
              label: copy(language, "Risk notu", "Risk note"),
              value: copy(language, "IV crush orta-yuksek", "IV crush medium-high"),
              tone: "text-foreground",
            },
          ],
          rows: [
            {
              label: copy(language, "Momentum", "Momentum"),
              value: copy(language, "81 / 100 · sektor liderligi korunuyor", "81 / 100 · sector leadership remains intact"),
            },
            {
              label: copy(language, "Beat", "Beat"),
              value: copy(language, "%72 · beklenti yuksek ama hala oynanabilir", "72% · expectations are high but still tradable"),
            },
            {
              label: copy(language, "Plan", "Plan"),
              value: copy(language, "event oncesi hedge + target exit window", "pre-event hedge + target exit window"),
            },
          ],
          footer: copy(
            language,
            "Ucretli katman, fikir degil plan cikarir. Scanner sonucu burada yapilanir.",
            "The paid layer outputs a plan, not just an idea. Scanner output gets structured here."
          ),
        };
    }
  }, [language, previewMode]);

  const trustSignals = [
    {
      label: copy(language, "Public Flow", "Public Flow"),
      value: copy(language, "ucretsiz acik", "free and open"),
      note: copy(language, "Onboarding ekrani gibi degil, gercek workspace girisi.", "Not just an onboarding screen, an actual workspace entry."),
    },
    {
      label: copy(language, "Checkout", "Checkout"),
      value: copy(language, "Paddle aktif", "Paddle live"),
      note: copy(language, "Abonelik katmani uydurma degil, dogrudan ticari akista.", "The subscription layer is live inside the real purchase flow."),
    },
    {
      label: copy(language, "Refresh", "Refresh"),
      value: copy(language, "gunluk isleniyor", "refreshed daily"),
      note: copy(language, "Calendar, reports ve public notes ayni urun mantiginda yenilenir.", "Calendar, reports and public notes refresh inside the same product logic."),
    },
    {
      label: copy(language, "Support", "Support"),
      value: "support@gistify.pro",
      note: copy(language, "Dogrudan operator temas noktasi.", "Direct operator contact point."),
    },
  ];

  const accessLanes = [
    {
      title: copy(language, "Flow ile ucretsiz basla", "Start free with Flow"),
      price: copy(language, "0 TRY", "0 TRY"),
      tone: "border-sky-400/25 bg-sky-500/[0.08]",
      bullets: [
        copy(language, "Gun ici flow ve tape hissi", "Intraday flow and tape feel"),
        copy(language, "Public rapor akisina erisim", "Access to the public report stream"),
        copy(language, "Gistify urun dilini risk almadan dene", "Test the Gistify product language without commitment"),
      ],
      ctaHref: "/flow",
      ctaLabel: copy(language, "Flow'u ac", "Open Flow"),
    },
    {
      title: copy(language, "Desk workspace'a gec", "Upgrade to the desk workspace"),
      price: copy(language, "250 TRY / ay", "250 TRY / month"),
      tone: "border-emerald-400/25 bg-emerald-500/[0.08]",
      bullets: [
        copy(language, "Earnings strategy + playbook + risk matrix", "Earnings strategy + playbook + risk matrix"),
        copy(language, "Macro calendar ve CPI/PPI readthrough", "Macro calendar and CPI/PPI readthrough"),
        copy(language, "Paid routes, saved framing ve daha derin plan katmani", "Paid routes, saved framing and a deeper planning layer"),
      ],
      ctaHref: "/pay",
      ctaLabel: copy(language, "Aboneligi baslat", "Start subscription"),
    },
  ];

  const workflow = [
    {
      step: "01",
      title: copy(language, "Tape'i tara", "Scan the tape"),
      body: copy(language, "Flow ve momentum layer hangi isimlerin masaya gelmesi gerektigini ayiklar.", "Flow and the momentum layer decide which names belong on the desk."),
    },
    {
      step: "02",
      title: copy(language, "Event baglamini kur", "Build the event frame"),
      body: copy(language, "Earnings veya makro event once beklenti seviyesi ve hassasiyet cizilir.", "Before earnings or macro events, the expectation level and sensitivity get framed."),
    },
    {
      step: "03",
      title: copy(language, "Riski yapilandir", "Structure the risk"),
      body: copy(language, "Expected move, IV crush ve direction ayni ciktida bulusur.", "Expected move, IV crush and direction meet inside the same output."),
    },
  ];

  return (
    <PublicShell
      language={language}
      onLanguageChange={onLanguageChange}
      eyebrow={copy(language, "Event-driven trading workspace", "Event-driven trading workspace")}
      title={copy(
        language,
        "Tape'i tara. Event'i cercevele. Riski pozisyona donustur.",
        "Scan the tape. Frame the event. Turn risk into a position plan."
      )}
      description={copy(
        language,
        "Gistify, aktif traderin Flow ekranindan earnings playbook'una ve makro takvime ayni urun mantiginda gecmesi icin kuruldu. Ucretsiz giris katmani ile baslar; ucretli katman fikir degil, islenmis karar akisi verir.",
        "Gistify is built so an active trader can move from Flow into the earnings playbook and macro calendar inside one product logic. It starts with a free entry layer; the paid layer outputs an engineered decision flow rather than raw ideas."
      )}
      ctaHref="/pay"
      ctaLabel={copy(language, "Desk erisimini ac", "Unlock desk access")}
      heroHighlights={[
        copy(language, "Flow ucretsiz acik", "Flow free and open"),
        copy(language, "Earnings + macro + options", "Earnings + macro + options"),
        copy(language, "Paddle checkout aktif", "Paddle checkout live"),
      ]}
      heroStats={[
        {
          value: "3",
          label: copy(language, "bagli workspace", "linked workspaces"),
          detail: copy(language, "Flow, earnings ve macro ayni desk diliyle calisir.", "Flow, earnings and macro operate in the same desk language."),
        },
        {
          value: "1",
          label: copy(language, "karar akisi", "decision flow"),
          detail: copy(language, "Scanner sonucu kopuk sekmelerde dagilmaz.", "Scanner output does not fragment across disconnected tabs."),
        },
        {
          value: "250 TRY",
          label: copy(language, "desk katmani", "desk layer"),
          detail: copy(language, "Ucretsiz Flow ustune kurulu tek paid tier.", "A single paid tier built on top of free Flow."),
        },
      ]}
    >
      <motion.section
        custom={0.02}
        initial="hidden"
        animate="visible"
        variants={reveal}
        className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]"
      >
        <div className="space-y-6 rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(7,12,22,0.92),rgba(10,17,29,0.86))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.26)]">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            <Sparkles className="size-4" />
            {copy(language, "Neden farkli gorunur", "Why it feels different")}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {copy(
              language,
              "Bu landing bir SaaS karti degil; gercek workspace davranisini once gosterir.",
              "This landing is not a SaaS brochure card; it shows real workspace behavior first."
            )}
          </h2>
          <p className="text-sm leading-7 text-muted-foreground md:text-base">
            {copy(
              language,
              "Urunun omurgasi su: once tape, sonra event, sonra risk. Ayrik araclar yok. Bu yuzden preview alani, pazarlama gorseli degil, urunun nasil kullanildigini anlatan mini terminal gibi calisir.",
              "The product spine is simple: first the tape, then the event, then the risk. No disconnected tools. That is why the preview area behaves less like a marketing visual and more like a miniature terminal that explains how the product is used."
            )}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {trustSignals.map(signal => (
              <div
                key={signal.label}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {signal.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {signal.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {signal.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          custom={0.08}
          initial="hidden"
          animate="visible"
          variants={reveal}
          className="overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(14,18,28,0.96),rgba(9,14,24,0.92))] shadow-[0_34px_90px_rgba(0,0,0,0.32)]"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              {previewTabs.map(tab => {
                const Icon = tab.icon;
                const active = previewMode === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPreviewMode(tab.id)}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-left transition-colors md:min-h-9 ${
                      active
                        ? "border-sky-400/35 bg-sky-500/12 text-foreground"
                        : "border-white/10 bg-black/15 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm font-semibold">{tab.label}</span>
                    <span className="rounded-full bg-black/20 px-2 py-0.5 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                      {tab.detail}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-0 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-white/10 p-4 xl:border-b-0 xl:border-r">
              <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                      {preview.heading}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {preview.subheading}
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    {copy(language, "live preview", "live preview")}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {preview.metrics.map(metric => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-white/10 bg-black/25 px-3 py-3"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {metric.label}
                      </p>
                      <p className={`mt-2 text-sm font-semibold ${metric.tone}`}>
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {copy(language, "Desk feed", "Desk feed")}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-300">
                    <Clock3 className="size-3.5" />
                    {copy(language, "guncel", "updated")}
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {preview.rows.map(row => (
                    <div
                      key={`${preview.heading}-${row.label}`}
                      className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] px-3 py-3"
                    >
                      <span className="data-mono text-sm font-semibold text-foreground">
                        {row.label}
                      </span>
                      <span className="max-w-[75%] text-right text-sm leading-6 text-muted-foreground">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {copy(language, "Karar cikisi", "Decision output")}
                </p>
                <div className="mt-3 space-y-3">
                  {[
                    copy(language, "Listeyi sadece gostermiyor; masaya neyin gelecegini seciyor.", "It does not just display a list; it decides what deserves desk attention."),
                    copy(language, "Event once senaryo ve risk, ayni yuzeyde kalmaya devam ediyor.", "Scenario and risk stay on the same surface before the event."),
                    copy(language, "Free Flow ile giris, paid desk layer ile derinlesme net ayriliyor.", "The free Flow entry and the paid desk layer are clearly separated."),
                  ].map(line => (
                    <div
                      key={line}
                      className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-3"
                    >
                      <ChevronRight className="mt-0.5 size-4 shrink-0 text-sky-300" />
                      <p className="text-sm leading-6 text-muted-foreground">
                        {line}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-emerald-400/18 bg-emerald-500/[0.08] px-4 py-4">
                  <p className="text-sm leading-6 text-emerald-100/90">
                    {preview.footer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        custom={0.12}
        initial="hidden"
        animate="visible"
        variants={reveal}
        className="grid gap-6 lg:grid-cols-2"
      >
        {accessLanes.map(lane => (
          <div
            key={lane.title}
            className={`rounded-xl border p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] ${lane.tone}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {lane.title}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                  {lane.price}
                </h2>
              </div>
              <BadgeCheck className="size-5 text-emerald-300" />
            </div>
            <div className="mt-5 space-y-3">
              {lane.bullets.map(bullet => (
                <div
                  key={bullet}
                  className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-muted-foreground"
                >
                  {bullet}
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Button asChild size="lg" variant={lane.ctaHref === "/pay" ? "default" : "outline"}>
                <a href={lane.ctaHref}>
                  {lane.ctaLabel}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </motion.section>

      <motion.section
        custom={0.16}
        initial="hidden"
        animate="visible"
        variants={reveal}
        className="rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(13,18,28,0.92),rgba(9,13,22,0.86))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
      >
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            {copy(language, "Karar akisi", "Decision flow")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            {copy(
              language,
              "Urun mantigi ozellik listesi degil, isleyen bir desk rutini gibi okunmali.",
              "The product should read less like a feature list and more like a working desk routine."
            )}
          </h2>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {workflow.map(item => (
            <div
              key={item.step}
              className="rounded-xl border border-white/10 bg-black/20 p-5"
            >
              <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm font-semibold text-sky-300">
                {item.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        custom={0.2}
        initial="hidden"
        animate="visible"
        variants={reveal}
        className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="rounded-xl border border-white/10 bg-card/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            {copy(language, "Kimler icin", "Who it is for")}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              {
                icon: Radar,
                title: copy(language, "Gun ici tape okuyan trader", "Intraday tape reader"),
                body: copy(language, "Flow ekranindan masaya gelen isimleri hizli filtrelemek isteyenler.", "Traders who want to filter names from the Flow screen fast."),
              },
              {
                icon: LineChart,
                title: copy(language, "Earnings once plan kuran operator", "Operator planning before earnings"),
                body: copy(language, "Beklenti seviyesi ile opsiyon riskini ayni kararda tutmak isteyenler.", "Operators who want expectations and options risk in the same decision."),
              },
              {
                icon: CalendarDays,
                title: copy(language, "Makro event riski takibi", "Macro event risk tracking"),
                body: copy(language, "CPI, PPI ve Fed gunlerinde rates / USD readthrough gormek isteyenler.", "Users who want rates / USD readthrough on CPI, PPI and Fed days."),
              },
              {
                icon: ShieldCheck,
                title: copy(language, "Daha az sekme, daha cok baglam", "Fewer tabs, more context"),
                body: copy(language, "Scanner, event ve riski ayri urunler gibi kullanmak istemeyenler.", "People who do not want scan, event and risk to behave like separate products."),
              },
            ].map(item => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <item.icon className="size-5 text-sky-300" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-card/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            {copy(language, "What the operator sees", "What the operator sees")}
          </p>
          <div className="mt-4 space-y-3">
            {[
              copy(language, "\"Bu ekran hangi ismin neden onemli oldugunu once anlatiyor.\"", "\"This screen tells me why the name matters before it asks for action.\""),
              copy(language, "\"Free Flow girisi var, ama paid katmanin ne kattigi de net.\"", "\"There is a free Flow entry, and the paid layer's value is obvious.\""),
              copy(language, "\"Makro ve earnings ayni urun diliyle akiyor; bu fark yaratiyor.\"", "\"Macro and earnings move in the same product language; that makes the difference.\""),
            ].map(quote => (
              <div
                key={quote}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-muted-foreground"
              >
                {quote}
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </PublicShell>
  );
}
