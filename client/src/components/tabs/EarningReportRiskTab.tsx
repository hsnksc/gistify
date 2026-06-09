import { useMemo } from "react";
import type { AppLanguage } from "@/lib/i18n";
import type {
  AllocationEntry,
  EarningReportSource,
  EarningsPosition,
  PositionSizingEntry,
} from "@/lib/earningReportSource";

interface Props {
  report: EarningReportSource;
  language?: AppLanguage;
}

function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
}

function sortPositions(positions: EarningsPosition[]) {
  return [...positions].sort((left, right) => {
    if (left.daysLeft !== right.daysLeft) {
      return left.daysLeft - right.daysLeft;
    }

    return left.order - right.order;
  });
}

function buildSizingMap(entries: PositionSizingEntry[]) {
  return new Map(entries.map(entry => [entry.ticker, entry]));
}

function buildAllocationMap(entries: AllocationEntry[]) {
  return new Map(entries.map(entry => [entry.ticker, entry]));
}

function riskTone(probability: string) {
  const normalized = probability.toUpperCase();

  if (
    normalized.includes("KESIN") ||
    normalized.includes("YUKSEK") ||
    normalized.includes("17 HAZIRAN")
  ) {
    return "border-red-400/30 bg-red-500/6";
  }

  if (normalized.includes("ORTA")) {
    return "border-amber-400/30 bg-amber-500/6";
  }

  return "border-border bg-background/40";
}

function noteTone(title: string) {
  const normalized = title.toUpperCase();
  if (
    normalized.includes("UYARI") ||
    normalized.includes("RISK") ||
    normalized.includes("FOMC")
  ) {
    return "border-red-400/30 bg-red-500/6";
  }

  if (normalized.includes("AVANTAJ")) {
    return "border-emerald-400/30 bg-emerald-500/6";
  }

  return "border-border bg-background/40";
}

export default function EarningReportRiskTab({ report, language = "tr" }: Props) {
  const positions = useMemo(() => sortPositions(report.positions), [report.positions]);
  const sizingMap = useMemo(() => buildSizingMap(report.positionSizing), [report.positionSizing]);
  const allocationMap = useMemo(
    () => buildAllocationMap(report.allocations),
    [report.allocations]
  );

  return (
    <div className="space-y-6 p-6">
      <section className="rounded-none border border-border bg-card/80 p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)]">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
              Risk framework
            </p>
            <h1 className="heading-condensed text-3xl leading-none text-foreground md:text-4xl">
              {copy(language, "Risk yonetimi ve pozisyon yapisi", "Risk management and position structure")}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {copy(
                language,
                "Bu alan, markdown dosyasindaki global risk matrisi, pozisyon buyuklugu, golden rules ve gunluk kontrol listesi bloklarini tek bir yonetim katmanina cevirir.",
                "This section turns the global risk matrix, position sizing, golden rules, and daily checklist blocks from the markdown file into a single management layer."
              )}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-none border border-border bg-background/50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {copy(language, "VIX rejimi", "VIX regime")}
              </p>
              <p className="mt-2 data-mono text-lg font-bold text-amber-300">
                {report.vixLabel}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {copy(language, "Kural: VIX >25 ise girisleri durdur", "Rule: stop new entries when VIX > 25")}
              </p>
            </div>
            <div className="rounded-none border border-border bg-background/50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Coverage
              </p>
              <p className="mt-2 data-mono text-lg font-bold text-foreground">
                {positions.length} setup
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {report.reportDate} snapshot
              </p>
            </div>
            <div className="rounded-none border border-border bg-background/50 p-3 sm:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Golden rule
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {report.goldenRules[0] ||
                  copy(language, "Earnings aciklanmadan once cik", "Exit before earnings are released")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-red-400" />
          <h2 className="heading-condensed text-base text-foreground">
            {copy(language, "Ana riskler", "Primary risks")}
          </h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {report.risks.map(entry => (
            <article
              key={entry.risk}
              className={`rounded-none border p-4 ${riskTone(entry.probability)}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="heading-condensed text-xl text-foreground">
                  {entry.risk}
                </h3>
                <span className="rounded-none border border-border bg-background/50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {entry.probability}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{entry.impact}</p>
              <div className="mt-3 rounded-none border border-border bg-background/50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {copy(language, "Onlem", "Mitigation")}
                </p>
                <p className="mt-2 text-sm text-foreground">{entry.mitigation}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-emerald-400" />
          <h2 className="heading-condensed text-base text-foreground">
            {copy(language, "Portfoy dagilimi", "Portfolio allocation")}
          </h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {positions.map(position => {
            const sizing = sizingMap.get(position.ticker);
            const allocation = allocationMap.get(position.ticker);

            return (
              <article
                key={position.ticker}
                className="rounded-none border border-border bg-card/80 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="heading-condensed text-2xl text-foreground">
                      {position.ticker}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {position.company}
                    </p>
                  </div>
                  <span className="rounded-none border border-border bg-background/50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {position.allocationRisk}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-none border border-border bg-background/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {copy(language, "Sermaye", "Capital")}
                    </p>
                    <p className="mt-2 data-mono text-sm font-bold text-foreground">
                      {allocation?.capital || position.allocationCapital}
                    </p>
                  </div>
                  <div className="rounded-none border border-border bg-background/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {copy(language, "Kontrat", "Contracts")}
                    </p>
                    <p className="mt-2 data-mono text-sm font-bold text-foreground">
                      {sizing?.contracts || "-"}
                    </p>
                  </div>
                  <div className="rounded-none border border-border bg-background/50 p-3 sm:col-span-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {copy(language, "Allocation notu", "Allocation note")}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {allocation?.riskLevel || position.allocationRisk}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <article className="rounded-none border border-border bg-card/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
            Golden rules
          </p>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {report.goldenRules.map(rule => (
              <li
                key={rule}
                className="border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
              >
                {rule}
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-none border border-border bg-card/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
            {copy(language, "Gunluk kontrol listesi", "Daily checklist")}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {report.checklist.map(item => (
              <div
                key={item}
                className="rounded-none border border-border bg-background/50 px-3 py-3 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-amber-400" />
          <h2 className="heading-condensed text-base text-foreground">
            {copy(language, "Ticker notlari ve uyarilar", "Ticker notes and warnings")}
          </h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {positions.map(position => (
            <article
              key={position.ticker}
              className="rounded-none border border-border bg-card/80 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="heading-condensed text-2xl text-foreground">
                    {position.ticker}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {position.strategyTitle}
                  </p>
                </div>
                <span className="rounded-none border border-border bg-background/50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {position.daysLeft} {copy(language, "gun", "days")}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {position.warnings.map(warning => (
                  <div
                    key={`${position.ticker}-${warning}`}
                    className="rounded-none border border-red-400/30 bg-red-500/6 p-3 text-sm leading-relaxed text-red-100/90"
                  >
                    {warning}
                  </div>
                ))}

                {position.notes.map(note => (
                  <div
                    key={`${position.ticker}-${note.title}`}
                    className={`rounded-none border p-3 ${noteTone(note.title)}`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                      {note.title}
                    </p>
                    <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {note.lines.map(line => (
                        <p key={`${position.ticker}-${note.title}-${line}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-none border border-border bg-card/80 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Yasal uyari
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {report.disclaimer}
        </p>
      </section>
    </div>
  );
}
