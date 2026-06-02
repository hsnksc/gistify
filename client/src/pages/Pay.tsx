import { useMemo } from "react";
import { ArrowLeft, BadgeCheck, CreditCard, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/i18n";

const COPY = {
  tr: {
    eyebrow: "Gistify Billing",
    title: "Paddle odeme sayfasi hazirlaniyor",
    description:
      "Bu route public acildi. Shopier kapatildi ve Paddle site onayi tamamlaninca checkout bu sayfada aktif olacak.",
    tokenDetected: "Paddle transaction parametresi algilandi.",
    tokenWaiting:
      "Checkout entegrasyonu bir sonraki adimda bu sayfaya baglanacak.",
    siteApproval: "Site approval bekleniyor",
    publicRoute: "Public route aktif",
    shopierDisabled: "Shopier devre disi",
    helpTitle: "Paddle panelinde ne girmelisin",
    helpBody:
      "Site approval alanina URL degil sadece alan adini gir: gistify.pro. Default payment link ise approval bitince https://gistify.pro/pay olacak.",
    back: "Siteye don",
    status: "Durum",
    approvalBody:
      "gistify.pro domaini public acildi. Paddle live checkout, domain approval biter bitmez bu route uzerinden baglanacak.",
    nextStepBody:
      "Bu sayfa deploy edildi; sonraki adim Paddle.js ve webhook aktivasyonu.",
  },
  en: {
    eyebrow: "Gistify Billing",
    title: "Paddle payment page is being prepared",
    description:
      "This route is now public. Shopier is disabled, and checkout will go live here once Paddle site approval is completed.",
    tokenDetected: "Paddle transaction parameter detected.",
    tokenWaiting:
      "Checkout wiring will be attached to this page in the next step.",
    siteApproval: "Site approval pending",
    publicRoute: "Public route enabled",
    shopierDisabled: "Shopier disabled",
    helpTitle: "What to enter in Paddle",
    helpBody:
      "Enter only the bare domain for site approval, not a URL: gistify.pro. After approval, set the default payment link to https://gistify.pro/pay.",
    back: "Back to site",
    status: "Status",
    approvalBody:
      "The gistify.pro domain is now publicly available. Paddle live checkout will be attached to this route as soon as domain approval is completed.",
    nextStepBody:
      "This page is already deployed; the next step is wiring Paddle.js and webhook activation.",
  },
} as const;

export default function Pay({
  language,
  onLanguageChange,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const copy = COPY[language];
  const transactionId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("_ptxn");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                <Globe2 className="size-3.5" />
                {copy.eyebrow}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {copy.title}
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {copy.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-border bg-background/70 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => onLanguageChange("tr")}
                  className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
                    language === "tr"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  TR
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange("en")}
                  className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
                    language === "en"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  EN
                </button>
              </div>

              <Button asChild variant="outline" className="bg-background/70">
                <a href="/">
                  <ArrowLeft className="size-4" />
                  {copy.back}
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[copy.siteApproval, copy.publicRoute, copy.shopierDisabled].map(
              label => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-background/60 p-4 text-sm font-medium"
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-border bg-card/85 p-6 shadow-xl">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CreditCard className="size-4 text-primary" />
              {copy.helpTitle}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {copy.helpBody}
            </p>

            {transactionId ? (
              <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  <BadgeCheck className="size-4" />
                  {copy.tokenDetected}
                </div>
                <p className="mt-2 break-all text-xs text-emerald-100/85">
                  {transactionId}
                </p>
              </div>
            ) : null}
          </section>

          <aside className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {copy.status}
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-sm font-semibold">{copy.siteApproval}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {copy.approvalBody}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-sm font-semibold">{copy.tokenWaiting}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {copy.nextStepBody}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
