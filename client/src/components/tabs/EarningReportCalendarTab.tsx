import { useMemo } from "react";
import { copy, type AppLanguage } from "@/lib/i18n";
import type {
  EarningReportSource,
  EarningsPosition,
  TradeScheduleRow,
} from "@/lib/earningReportSource";

interface Props {
  report: EarningReportSource;
  language?: AppLanguage;
  onOpenTicker: (ticker: string) => void;
}

function sortPositions(positions: EarningsPosition[]) {
  return [...positions].sort((left, right) => {
    if (left.daysLeft !== right.daysLeft) {
      return left.daysLeft - right.daysLeft;
    }

    return left.order - right.order;
  });
}

function actionTone(action: string) {
  const normalized = action.toUpperCase();

  if (normalized.includes("GIRIS")) {
    return "border-emerald-400/30 bg-emerald-500/6 text-emerald-300";
  }

  if (normalized.includes("CIKIS")) {
    return "border-amber-400/30 bg-amber-500/6 text-amber-300";
  }

  if (normalized.includes("BEKLE")) {
    return "border-sky-400/30 bg-sky-500/6 text-sky-200";
  }

  if (normalized.includes("EARNINGS")) {
    return "border-red-400/30 bg-red-500/6 text-red-300";
  }

  return "border-border bg-background/50 text-foreground";
}

function parseTickerList(value: string) {
  return value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function ScheduleCard({
  row,
  onOpenTicker,
}: {
  row: TradeScheduleRow;
  onOpenTicker: (ticker: string) => void;
}) {
  const tickers = parseTickerList(row.ticker);

  return (
    <article className="rounded-none border border-border bg-card/80 p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-none border border-border bg-background/60 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              {row.date}
            </span>
            <span
              className={`rounded-none border px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${actionTone(row.action)}`}
            >
              {row.action}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{row.note}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tickers.map(ticker => (
            <button
              key={`${row.date}-${ticker}`}
              type="button"
              onClick={() => onOpenTicker(ticker)}
              className="rounded-none border border-border bg-background/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-emerald-400/40 hover:text-emerald-300"
            >
              {ticker}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function EarningReportCalendarTab({
  report,
  language = "tr",
  onOpenTicker,
}: Props) {
  const positions = useMemo(() => sortPositions(report.positions), [report.positions]);

  if (!positions.length) {
    return (
      <div className="p-6">
        <section className="rounded-none border border-border bg-card/80 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
            {copy(language, "Takvim verisi bulunamadi", "Calendar data unavailable")}
          </p>
          <h1 className="mt-3 heading-condensed text-3xl text-foreground">
            {copy(language, "Gosterilecek execution takvimi yok", "No execution calendar to display")}
          </h1>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <section className="rounded-none border border-border bg-card/80 p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
              Execution window
            </p>
            <h1 className="heading-condensed text-3xl leading-none text-foreground md:text-4xl">
              {copy(language, "Giris ve cikis takvimi", "Entry and exit calendar")}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {copy(
                language,
                "Bu sekme, haftalik action plan, makro carpisma tarihleri ve hisse bazli giris/cikis pencerelerini tek timeline'da toplar.",
                "This tab combines the weekly action plan, macro conflict dates, and ticker-specific entry and exit windows into a single timeline."
              )}
            </p>
            <div className="rounded-none border border-amber-400/20 bg-amber-500/5 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                {copy(language, "Strateji penceresi", "Strategy window")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {report.coreWindow}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {report.gainDrivers.map(driver => (
              <div
                key={driver.factor}
                className="rounded-none border border-border bg-background/50 p-3"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {driver.factor}
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {driver.impact}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {driver.assessment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-amber-400" />
          <h2 className="heading-condensed text-base text-foreground">
            {copy(language, "Haftalik checkpoints", "Weekly checkpoints")}
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {report.timelineSteps.map(step => (
            <div
              key={step.phase}
              className="rounded-none border border-border bg-card/80 p-4"
            >
              <p className="data-mono text-sm font-bold text-amber-300">
                {step.phase}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-sky-400" />
          <h2 className="heading-condensed text-base text-foreground">
            {copy(language, "Tarih bazli islem akisi", "Date-based execution flow")}
          </h2>
        </div>
        <div className="space-y-3">
          {report.tradeSchedule.map(row => (
            <ScheduleCard
              key={`${row.date}-${row.action}`}
              row={row}
              onOpenTicker={onOpenTicker}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-emerald-400" />
          <h2 className="heading-condensed text-base text-foreground">
            {copy(language, "Hisse bazli pencere", "Ticker-specific window")}
          </h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {positions.map(position => (
            <article
              key={position.ticker}
              className="rounded-none border border-border bg-card/80 p-4"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="heading-condensed text-2xl text-foreground">
                        {position.ticker}
                      </h3>
                      <span className="rounded-none border border-border bg-background/60 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {position.earningsTime}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {position.company}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenTicker(position.ticker)}
                    className="rounded-none border border-border bg-background/50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {copy(language, "Playbook", "Playbook")}
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-none border border-border bg-background/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Earnings
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      {position.earningsDate}
                    </p>
                  </div>
                  <div className="rounded-none border border-border bg-background/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {copy(language, "Giris", "Entry")}
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      {position.blueprint.entry || "-"}
                    </p>
                  </div>
                  <div className="rounded-none border border-border bg-background/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {copy(language, "Cikis", "Exit")}
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      {position.blueprint.exit || "-"}
                    </p>
                  </div>
                </div>

                <div className="rounded-none border border-border bg-background/40 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {copy(language, "Expiry secenekleri", "Expiry options")}
                  </p>
                  <div className="mt-2 space-y-1 text-sm leading-relaxed text-muted-foreground">
                    {position.blueprint.expiryLines.map(line => (
                      <p key={`${position.ticker}-${line}`}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-none border border-emerald-400/20 bg-emerald-500/5 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      {copy(language, "Call / Put orani", "Call / Put ratio")}
                    </p>
                    <p className="mt-2 data-mono text-sm font-bold text-foreground">
                      {position.blueprint.ratioText || "-"}
                    </p>
                  </div>
                  <div className="rounded-none border border-border bg-background/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {copy(language, "Gun sayaci", "Day counter")}
                    </p>
                    <p className="mt-2 data-mono text-sm font-bold text-amber-300">
                      {position.daysLeft} {copy(language, "gun kaldi", "days left")}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
