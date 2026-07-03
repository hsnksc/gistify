import { type AppLanguage, t } from "@/lib/i18n";
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
      title: t("marketing:earningsStrategy"),
      items: [
        t("marketing:earningsStrategyWorkspacePostPlaybook"),
        "Earnings Workspace — Overview, Calendar, Strategies, CPR/Greeks, Portfolio",
        t("marketing:perStockEarningsDetailStrategy"),
        t("marketing:earningsCalendarAndPreEarnings"),
      ],
    },
    {
      title: "Momentum & Scanner",
      items: [
        "Live Momentum Scanner / Midas Feed",
        t("marketing:momentumflowsurfaceMarketPulseAndMomentum"),
        t("marketing:heroInsightCardsLiveScanner"),
      ],
    },
    {
      title: t("marketing:macroMarket"),
      items: [
        t("marketing:macroEconomicCalendarFomcPmi"),
        t("marketing:cpiPpiForecastScenarioMatrix"),
        t("marketing:marketFlashPreAfterMarket"),
      ],
    },
    {
      title: t("marketing:riskOptions"),
      items: [
        t("marketing:riskMatrixBeatProbabilityX"),
        t("marketing:ivCrushViewCallPut"),
        t("marketing:optionsPlaybookExpectedMoveAnd"),
      ],
    },
    {
      title: t("marketing:accessSupport"),
      items: [
        t("marketing:unlimitedWebAccessToAll"),
        t("marketing:directOperatorSupportViaSupport"),
        t("marketing:secureCheckoutAndSubscriptionManagement"),
      ],
    },
  ];

  return (
    <PublicShell
      language={language}
      onLanguageChange={onLanguageChange}
      canonicalPath="/pricing"
      eyebrow={t("common:pricing")}
      title={t("marketing:singleMonthlySubscription")}
      description={t("marketing:gistifyRunsOnADigital")}
      ctaHref="/pay"
      ctaLabel={t("marketing:openPaymentPage")}
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-border bg-card/85 p-6 shadow-xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {"Gistify Pro"}
              </p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-5xl font-semibold">$5</span>
                <span className="pb-1 text-sm text-muted-foreground">
                  {t("marketing:month")}
                </span>
              </div>
            </div>
            <p className="max-w-xs text-right text-xs leading-relaxed text-muted-foreground">
              {t("marketing:unlockEveryDeskModuleWith")}
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
            {t("marketing:importantNotes")}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              {t("marketing:theSubscriptionIsUsedFor")}
            </p>
            <p>
              {t("marketing:pricingIsShownInUsd")}
            </p>
            <p>
              {t("marketing:forCurrentRefundTermsSee")}
              <a className="text-primary underline" href="/refund">
                {t("marketing:refundPolicy")}
              </a>
              {t("marketing:forOtherLegalTermsReview")}
              <a className="text-primary underline" href="/terms">
                {t("marketing:termsOfService")}
              </a>
              {t("marketing:andThe")}
              <a className="text-primary underline" href="/privacy">
                {t("marketing:privacyPolicy")}
              </a>
              {t("marketing:text")}
            </p>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
