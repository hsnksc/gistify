import { useMemo, useState } from "react";
import {
  ArrowRight, BadgeCheck, CalendarDays, ChevronRight, Clock3, LineChart, Radar, ShieldCheck, Sparkles, } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { type AppLanguage, t } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";
import NewsletterSignup from "@/components/NewsletterSignup";

type PreviewMode = "flow" | "earnings" | "calendar";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: "easeOut" as const, delay },
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
      label: t("marketing:flow"),
      icon: Radar,
      detail: t("marketing:free"),
    },
    {
      id: "earnings" as const,
      label: "Earnings",
      icon: LineChart,
      detail: t("marketing:paid"),
    },
    {
      id: "calendar" as const,
      label: t("common:calendar"),
      icon: CalendarDays,
      detail: t("marketing:macro"),
    },
  ];

  const preview = useMemo(() => {
    switch (previewMode) {
      case "flow":
        return {
          heading: "Flow Workspace",
          subheading: t("marketing:openNamesBlocksAndIntraday"),
          metrics: [
            {
              label: t("marketing:urgency"),
              value: "8 / 10",
              tone: "text-sky-300",
            },
            {
              label: t("marketing:topTheme"),
              value: t("marketing:aiSemis"),
              tone: "text-emerald-300",
            },
            {
              label: t("marketing:watchlist"),
              value: "NVDA · AVGO · CRWD",
              tone: "text-foreground",
            },
          ],
          rows: [
            {
              label: "AVGO",
              value: t("marketing:darkPoolFlowIsAccelerating"),
            },
            {
              label: "CRWD",
              value: t("marketing:preMarketVolumeIs2"),
            },
            {
              label: "QQQ",
              value: t("marketing:riskOnTapeStaysOpen"),
            },
          ],
          footer: t("marketing:flowStaysOpenToEveryone"),
        };
      case "calendar":
        return {
          heading: "Macro Calendar",
          subheading: t("marketing:highImportanceDataAndEvent"),
          metrics: [
            {
              label: t("marketing:nextEvent"),
              value: "PPI · 08:30 ET",
              tone: "text-amber-300",
            },
            {
              label: t("marketing:dayTheme"),
              value: "inflation tape",
              tone: "text-sky-300",
            },
            {
              label: t("marketing:prepMode"),
              value: "duration / USD",
              tone: "text-foreground",
            },
          ],
          rows: [
            {
              label: "08:30",
              value: "PPI consensus 0.2 / core 0.2",
            },
            {
              label: "10:00",
              value: "Fed speaker: rates tone check",
            },
            {
              label: "14:00",
              value: t("marketing:ust10yAndDxyReadthrough"),
            },
          ],
          footer: t("marketing:theMacroWorkspacePutsEvent"),
        };
      default:
        return {
          heading: "Earnings Strategy",
          subheading: t("marketing:beatProbabilityImpliedMoveAnd"),
          metrics: [
            {
              label: t("marketing:selectedName"),
              value: "CRWD",
              tone: "text-emerald-300",
            },
            {
              label: "Bias",
              value: "bull call spread",
              tone: "text-sky-300",
            },
            {
              label: t("marketing:riskNote"),
              value: t("marketing:ivCrushMediumHigh"),
              tone: "text-foreground",
            },
          ],
          rows: [
            {
              label: "Momentum",
              value: t("marketing:81100SectorLeadershipRemains"),
            },
            {
              label: "Beat",
              value: t("marketing:72ExpectationsAreHighBut"),
            },
            {
              label: "Plan",
              value: t("marketing:preEventHedgeTargetExit"),
            },
          ],
          footer: t("marketing:thePaidLayerOutputsA"),
        };
    }
  }, [language, previewMode]);

  const trustSignals = [
    {
      label: "Public Flow",
      value: t("marketing:freeAndOpen"),
      note: t("marketing:notJustAnOnboardingScreen"),
    },
    {
      label: "Checkout",
      value: t("marketing:paddleLive"),
      note: t("marketing:theSubscriptionLayerIsLive"),
    },
    {
      label: "Refresh",
      value: t("marketing:refreshedDaily"),
      note: t("marketing:calendarReportsAndPublicNotes"),
    },
    {
      label: "Support",
      value: "support@gistify.pro",
      note: t("marketing:directOperatorContactPoint"),
    },
  ];

  const accessLanes = [
    {
      title: t("marketing:startFreeWithFlow"),
      price: "0 TRY",
      tone: "border-sky-400/25 bg-sky-500/[0.08]",
      bullets: [
        t("marketing:intradayFlowAndTapeFeel"),
        t("marketing:accessToThePublicReport"),
        t("marketing:testTheGistifyProductLanguage"),
      ],
      ctaHref: "/flow",
      ctaLabel: t("marketing:openFlow"),
    },
    {
      title: t("scanner:1400Afternoon"),
      price: t("marketing:5Month"),
      tone: "border-emerald-400/25 bg-emerald-500/[0.08]",
      bullets: [
        t("marketing:earningsStrategyWorkspaceEarningsWorkspace"),
        t("marketing:liveMomentumScannerMidasFeed"),
        t("marketing:marketFlashMacroCalendarAnd"),
        t("marketing:riskMatrixIvCrushView"),
        t("marketing:paidRoutesSavedFramingAnd"),
      ],
      ctaHref: "/pay",
      ctaLabel: t("marketing:startSubscription"),
    },
  ];

  const workflow = [
    {
      step: "01",
      title: t("marketing:scanTheTape"),
      body: t("marketing:flowAndTheMomentumLayer"),
    },
    {
      step: "02",
      title: t("marketing:buildTheEventFrame"),
      body: t("marketing:beforeEarningsOrMacroEvents"),
    },
    {
      step: "03",
      title: t("marketing:structureTheRisk"),
      body: t("marketing:expectedMoveIvCrushAnd"),
    },
  ];

  return (
    <PublicShell
      language={language}
      onLanguageChange={onLanguageChange}
      canonicalPath="/"
      eyebrow={"Event-driven trading workspace"}
      title={t("marketing:scanTheTapeFrameThe")}
      description={t("marketing:gistifyIsBuiltSoAn")}
      ctaHref="/pay"
      ctaLabel={t("marketing:unlockDeskAccess")}
      heroHighlights={[
        t("marketing:flowFreeAndOpen"),
        "Earnings + macro + options",
        t("marketing:paddleCheckoutLive"),
      ]}
      heroStats={[
        {
          value: "3",
          label: t("marketing:linkedWorkspaces"),
          detail: t("marketing:flowEarningsAndMacroOperate"),
        },
        {
          value: "1",
          label: t("marketing:decisionFlow"),
          detail: t("marketing:scannerOutputDoesNotFragment"),
        },
        {
          value: "$5",
          label: t("marketing:deskLayer"),
          detail: t("marketing:aSinglePaidTierBuilt"),
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
            {t("marketing:whyItFeelsDifferent")}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {t("marketing:thisLandingIsNotA")}
          </h2>
          <p className="text-sm leading-7 text-muted-foreground md:text-base">
            {t("marketing:theProductSpineIsSimple")}
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
                    {"live preview"}
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
                    {"Desk feed"}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-300">
                    <Clock3 className="size-3.5" />
                    {t("marketing:updated")}
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
                  {t("marketing:decisionOutput")}
                </p>
                <div className="mt-3 space-y-3">
                  {[
                    t("marketing:itDoesNotJustDisplay"),
                    t("marketing:scenarioAndRiskStayOn"),
                    t("marketing:theFreeFlowEntryAnd"),
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
            {t("marketing:decisionFlowbd58")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            {t("marketing:theProductShouldReadLess")}
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
            {t("marketing:whoItIsFor")}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              {
                icon: Radar,
                title: t("marketing:intradayTapeReader"),
                body: t("marketing:tradersWhoWantToFilter"),
              },
              {
                icon: LineChart,
                title: t("flow:publishingEarningsReport"),
                body: t("marketing:operatorsWhoWantExpectationsAnd"),
              },
              {
                icon: CalendarDays,
                title: t("marketing:macroEventRiskTracking"),
                body: t("marketing:usersWhoWantRatesUsd"),
              },
              {
                icon: ShieldCheck,
                title: t("marketing:fewerTabsMoreContext"),
                body: t("marketing:peopleWhoDoNotWant"),
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
            {"What the operator sees"}
          </p>
          <div className="mt-4 space-y-3">
            {[
              t("marketing:thisScreenTellsMeWhy"),
              t("marketing:thereIsAFreeFlow"),
              t("marketing:macroAndEarningsMoveIn"),
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

      <motion.section
        custom={0.22}
        initial="hidden"
        animate="visible"
        variants={reveal}
        className="rounded-xl border border-white/10 bg-card/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
          {t("marketing:guidesTools")}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          {t("marketing:goDeeperOnStrategy")}
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            {
              href: "/blog/earnings-strategy/complete-guide-trading-earnings-options",
              title: t("marketing:earningsGuide"),
              body: t("marketing:optionsStrategiesExpectedMoveAnd"),
            },
            {
              href: "/tools/iv-rank-calculator",
              title: t("marketing:ivRankCalculator"),
              body: t("marketing:freeToolToMeasureAny"),
            },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-sky-400/30 hover:bg-sky-500/[0.06]"
            >
              <h3 className="text-lg font-semibold text-foreground group-hover:text-sky-300">
                {link.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {link.body}
              </p>
            </a>
          ))}
        </div>
      </motion.section>

      <motion.section
        custom={0.24}
        initial="hidden"
        animate="visible"
        variants={reveal}
        className="rounded-xl border border-white/10 bg-card/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      >
        <NewsletterSignup />
      </motion.section>
    </PublicShell>
  );
}
