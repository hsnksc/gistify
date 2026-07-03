import { CalendarClock, Gauge, Radar, TrendingDown, TrendingUp } from "lucide-react";
import type {
  MomentumCandidateGroup, MomentumCandidateRow, MomentumReportSource, } from "@/lib/momentumReportSource";
import { t } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";

function groupLabel(group: MomentumCandidateGroup, language: AppLanguage) {
  if (group === "upside") {
    return t("scanner:upsideReversal");
  }

  if (group === "downside") {
    return t("scanner:downsideMomentum");
  }

  return "Defensive";
}

function groupTone(group: MomentumCandidateGroup) {
  if (group === "upside") {
    return "border-emerald-400/25 bg-emerald-500/8";
  }

  if (group === "downside") {
    return "border-red-400/25 bg-red-500/8";
  }

  return "border-amber-400/25 bg-amber-500/8";
}

function SetupStat({
  label,
  value,
  hint,
  accentClassName,
}: {
  label: string;
  value: string;
  hint: string;
  accentClassName: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/55 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 data-mono text-2xl font-bold ${accentClassName}`}>{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm leading-7 text-muted-foreground">
      {message}
    </div>
  );
}

function CandidateCard({
  row,
  language,
}: {
  row: MomentumCandidateRow;
  language: AppLanguage;
}) {
  return (
    <article className={`rounded-xl border p-4 ${groupTone(row.group)}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {row.ticker || row.name}
            {row.name && row.ticker && row.name !== row.ticker ? ` · ${row.name}` : ""}
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {groupLabel(row.group, language)}
          </p>
        </div>
        <span className="data-mono text-lg font-bold text-foreground">
          {row.scoreLabel || "-"}
        </span>
      </div>
      <div className="mt-4 space-y-3 text-sm leading-7">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("scanner:thesis")}
          </p>
          <p className="mt-1 text-foreground">{row.reason}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {"Risk"}
          </p>
          <p className="mt-1 text-muted-foreground">{row.risk}</p>
        </div>
      </div>
    </article>
  );
}

function CandidateTable({
  report,
  language,
}: {
  report: MomentumReportSource;
  language: AppLanguage;
}) {
  if (!report.candidates.length) {
    return (
      <EmptyPanel
        message={t("scanner:noParsedSetupsAreAvailable")}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/45">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-background/70">
            <tr>
              {[
                "Ticker",
                t("scanner:group"),
                t("common:score"),
                t("scanner:thesis"),
                "Risk",
              ].map(header => (
                <th
                  key={header}
                  className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.candidates.map((row, rowIndex) => (
              <tr key={`${row.ticker}-${rowIndex}`} className="border-b border-border/60 last:border-b-0">
                <td className="px-4 py-3 font-semibold text-foreground">
                  {row.ticker || row.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {groupLabel(row.group, language)}
                </td>
                <td className="px-4 py-3 data-mono text-foreground">{row.scoreLabel || "-"}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.reason}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MomentumSetupsTab({
  report,
  language,
}: {
  report: MomentumReportSource;
  language: AppLanguage;
}) {
  const bullishCount = report.candidates.filter(row => row.group === "upside").length;
  const bearishCount = report.candidates.filter(row => row.group === "downside").length;
  const defensiveCount = report.candidates.filter(row => row.group === "defensive").length;
  const hottestRsi = [...report.rsiRows].sort(
    (left, right) => (right.rsiValue || 0) - (left.rsiValue || 0)
  )[0];
  const weakestRsi = [...report.rsiRows].sort(
    (left, right) => (left.rsiValue || 0) - (right.rsiValue || 0)
  )[0];

  return (
    <div className="space-y-6 px-6 pb-8">
      <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
            <Radar className="size-4" />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {"Setup Library"}
            </p>
            <h2 className="heading-condensed text-3xl text-foreground">
              {t("scanner:simplifiedSetupView")}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              {t("scanner:theScoreChartsAreRemoved")}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SetupStat
          label={t("scanner:marketRegime")}
          value={report.regimeLabel || "-"}
          hint={t("scanner:primaryContextForSetupSelection")}
          accentClassName="text-foreground"
        />
        <SetupStat
          label={t("scanner:bullishSetup")}
          value={String(bullishCount)}
          hint={t("scanner:reversalBounceCandidates")}
          accentClassName="text-emerald-300"
        />
        <SetupStat
          label={t("scanner:bearishSetup")}
          value={String(bearishCount)}
          hint={t("scanner:downsideContinuationCandidates")}
          accentClassName="text-red-300"
        />
        <SetupStat
          label={"Defensive"}
          value={String(defensiveCount)}
          hint={t("scanner:protectiveRouteAndLowerBeta")}
          accentClassName="text-amber-300"
        />
      </section>

      <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <Radar className="size-4 text-emerald-300" />
          <h3 className="heading-condensed text-xl text-foreground">
            {t("scanner:allSetupsTable")}
          </h3>
        </div>
        <div className="mt-4">
          <CandidateTable report={report} language={language} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-emerald-300" />
            <h3 className="heading-condensed text-xl text-foreground">
              {t("scanner:upsideReversal")}
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {report.candidates.filter(row => row.group === "upside").length ? (
              report.candidates
                .filter(row => row.group === "upside")
                .map(row => (
                  <CandidateCard key={`${row.group}-${row.ticker}-${row.name}`} row={row} language={language} />
                ))
            ) : (
              <EmptyPanel message={t("scanner:thisReportHasNoUpside")} />
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <TrendingDown className="size-4 text-red-300" />
            <h3 className="heading-condensed text-xl text-foreground">
              {t("scanner:downsideMomentum")}
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {report.candidates.filter(row => row.group === "downside").length ? (
              report.candidates
                .filter(row => row.group === "downside")
                .map(row => (
                  <CandidateCard key={`${row.group}-${row.ticker}-${row.name}`} row={row} language={language} />
                ))
            ) : (
              <EmptyPanel message={t("scanner:thisReportHasNoDownside")} />
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Gauge className="size-4 text-amber-300" />
            <h3 className="heading-condensed text-xl text-foreground">
              {t("common:defensive")}
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {report.candidates.filter(row => row.group === "defensive").length ? (
              report.candidates
                .filter(row => row.group === "defensive")
                .map(row => (
                  <CandidateCard key={`${row.group}-${row.ticker}-${row.name}`} row={row} language={language} />
                ))
            ) : (
              <EmptyPanel message={t("scanner:thisReportHasNoDefensive")} />
            )}
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <CalendarClock className="size-4 text-cyan-300" />
            <h3 className="heading-condensed text-xl text-foreground">
              {t("scanner:calendarCatalysts")}
            </h3>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background/45">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-background/70">
                  <tr>
                    {[t("common:date"), t("common:event"), t("common:impact")].map(header => (
                      <th
                        key={header}
                        className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.calendarEvents.length ? (
                    report.calendarEvents.map(row => (
                      <tr key={`${row.date}-${row.event}`} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-3 font-semibold text-foreground">{row.date}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.event}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.impact}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-4 text-sm text-muted-foreground" colSpan={3}>
                        {t("scanner:calendarCatalystsCouldNotBe")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Gauge className="size-4 text-cyan-300" />
            <h3 className="heading-condensed text-xl text-foreground">
              {t("scanner:rsiAndCatalystNotes")}
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {report.rsiRows.length ? (
              report.rsiRows.map(row => (
                <article
                  key={row.subject}
                  className="rounded-xl border border-border bg-background/55 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{row.subject}</p>
                    <span className="data-mono text-sm font-semibold text-foreground">
                      {row.rsiLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {row.status}
                  </p>
                </article>
              ))
            ) : (
              <EmptyPanel message={t("scanner:rsiBlocksAreMissingIn")} />
            )}

            {(weakestRsi || hottestRsi) ? (
              <div className="grid gap-3 md:grid-cols-2">
                <article className="rounded-xl border border-border bg-background/55 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {t("scanner:ivRankVeryLowIv")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {weakestRsi?.subject || "-"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {weakestRsi?.status || "-"}
                  </p>
                </article>
                <article className="rounded-xl border border-border bg-background/55 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {t("scanner:strongestRsi")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {hottestRsi?.subject || "-"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {hottestRsi?.status || "-"}
                  </p>
                </article>
              </div>
            ) : null}

            {report.specialCatalysts.length ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {t("scanner:specialCatalysts")}
                </p>
                <div className="mt-2 space-y-2 text-sm leading-7 text-foreground/90">
                  {report.specialCatalysts.map(item => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </div>
  );
}

