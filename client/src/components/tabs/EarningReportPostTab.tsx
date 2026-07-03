import { AppLanguage, t } from "@/lib/i18n";

import ReportPostShell, {
  type ReportPostItem,
  type ReportTone,
} from "@/components/reports/ReportPostShell";
import type {
  EarningReportSource,
  EarningsPosition,
} from "@/lib/earningReportSource";

interface EarningReportPostTabProps {
  report: EarningReportSource;
  language?: AppLanguage;
  reportDateLabel?: string;
  updatedAtLabel?: string;
}

function sortPositions(positions: EarningsPosition[]) {
  return [...positions].sort((left, right) => {
    if (left.daysLeft !== right.daysLeft) {
      return left.daysLeft - right.daysLeft;
    }

    return left.order - right.order;
  });
}

function normalizeMetricLabel(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .trim();
}

function findMetricValue(position: EarningsPosition, labels: string | string[]) {
  const aliases = Array.isArray(labels) ? labels : [labels];
  const metrics = position.metrics.map(metric => ({
    ...metric,
    normalizedLabel: normalizeMetricLabel(metric.label),
  }));

  for (const label of aliases) {
    const normalized = normalizeMetricLabel(label);
    const exact = metrics.find(metric => metric.normalizedLabel === normalized);
    if (exact?.value) {
      return exact.value;
    }
  }

  for (const label of aliases) {
    const normalized = normalizeMetricLabel(label);
    const partial = metrics.find(metric => metric.normalizedLabel.includes(normalized));
    if (partial?.value) {
      return partial.value;
    }
  }

  return "";
}

function parseMetricNumber(value: string) {
  const match = value.match(/-?\d+(?:[.,]\d+)?/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[0].replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function getBiasTone(position: EarningsPosition): ReportTone {
  const callWeight = position.blueprint.callWeight ?? 0;
  const putWeight = position.blueprint.putWeight ?? 0;

  if (callWeight > putWeight) {
    return "bull";
  }

  if (putWeight > callWeight) {
    return "bear";
  }

  return "caution";
}

function getBiasLabel(position: EarningsPosition, language: AppLanguage) {
  const tone = getBiasTone(position);

  if (tone === "bull") {
    return t("common:callHeavy");
  }

  if (tone === "bear") {
    return t("common:putHeavy");
  }

  return t("common:returnHome");
}

function getRiskTone(position: EarningsPosition): ReportTone {
  const risk = normalizeMetricLabel(position.allocationRisk || "");

  if (risk.includes("🔴") || risk.includes("yuksek")) {
    return "bear";
  }

  if (risk.includes("🟡") || risk.includes("orta")) {
    return "caution";
  }

  if (risk.includes("🟢") || risk.includes("dusuk")) {
    return "bull";
  }

  return "neutral";
}

function formatPercentValue(value: number | null, digits: number = 0) {
  if (value === null || !Number.isFinite(value)) {
    return "-";
  }

  return `%${value.toFixed(digits)}`;
}

function buildStatCards(
  report: EarningReportSource,
  positions: EarningsPosition[],
  language: AppLanguage
) {
  const cprValues = positions
    .map(position => parseMetricNumber(findMetricValue(position, ["Hacim CPR"])))
    .filter((value): value is number => value !== null && Number.isFinite(value));
  const ivValues = positions
    .map(position => position.ivRank)
    .filter((value): value is number => value !== null && Number.isFinite(value));
  const nextEvent = positions[0] || null;
  const highRiskCount = positions.filter(position => getRiskTone(position) === "bear").length;
  const topIvPosition =
    positions
      .filter(position => position.ivRank !== null)
      .sort((left, right) => (right.ivRank || 0) - (left.ivRank || 0))[0] || null;

  const avgCpr = cprValues.length
    ? cprValues.reduce((sum, value) => sum + value, 0) / cprValues.length
    : null;

  return [
    {
      label: t("common:setupCount"),
      value: String(positions.length),
      detail: t("common:numberOfTickersParsedFrom"),
      tone: "info",
    },
    {
      label: t("common:phase1Buy1015"),
      value: topIvPosition ? `${topIvPosition.ticker} · ${formatPercentValue(topIvPosition.ivRank, 2)}` : "-",
      detail: topIvPosition
        ? topIvPosition.strategyTitle
        : t("common:ivRankDataIsUnavailable"),
      tone: "caution",
    },
    {
      label: "Avg CPR",
      value: avgCpr !== null ? avgCpr.toFixed(2) : "-",
      detail: t("common:averageVolumeCprForA"),
      tone: "bull",
    },
    {
      label: t("earnings:noStrategySnapshotWasFound"),
      value: String(highRiskCount),
      detail: t("calendar:totalEvents"),
      tone: "bear",
    },
    {
      label: t("common:avoidIvCrushProfitFrom"),
      value: nextEvent ? `${nextEvent.ticker} · ${nextEvent.earningsDate}` : "-",
      detail: nextEvent
        ? `${nextEvent.daysLeft} ${t("common:daysLeft")}`
        : t("common:calendarWasNotParsed"),
      tone: nextEvent ? getBiasTone(nextEvent) : "neutral",
    },
    {
      label: "VIX",
      value: report.vixLabel || "-",
      detail: t("common:macroVolatilityContext"),
      tone: "caution",
    },
  ] satisfies ReportPostItem[];
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      </div>
      {description ? (
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function BiasMeter({
  position,
  language,
}: {
  position: EarningsPosition;
  language: AppLanguage;
}) {
  const callWeight = Math.max(0, position.blueprint.callWeight ?? 0);
  const putWeight = Math.max(0, position.blueprint.putWeight ?? 0);
  const total = callWeight + putWeight;

  if (!total) {
    return (
      <div className="rounded-xl border border-border bg-background/45 px-3 py-2 text-xs text-muted-foreground">
        {position.blueprint.ratioText ||
          t("common:callPutSplitWasNot")}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span>{"Call / Put"}</span>
        <span className="text-foreground">
          {callWeight}% / {putWeight}%
        </span>
      </div>
      <div className="flex h-2.5 overflow-hidden rounded-full border border-border bg-background/70">
        <div className="bg-emerald-400" style={{ width: `${callWeight}%` }} />
        <div className="bg-red-400" style={{ width: `${putWeight}%` }} />
      </div>
      <p className="text-xs leading-6 text-muted-foreground">
        {position.blueprint.biasLine || position.strategyTitle}
      </p>
    </div>
  );
}

function DataTable({
  headers,
  rows,
  emptyMessage,
}: {
  headers: string[];
  rows: string[][];
  emptyMessage: string;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/45">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-background/70">
            <tr>
              {headers.map(header => (
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
            {rows.map((row, rowIndex) => (
              <tr
                key={`${rowIndex}-${row[0] || "row"}`}
                className="border-b border-border/60 last:border-b-0"
              >
                {headers.map((_, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className={`px-4 py-3 align-top leading-7 ${
                      cellIndex === 0 ? "font-semibold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {row[cellIndex] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConvictionCard({
  position,
  assessment,
  language,
}: {
  position: EarningsPosition;
  assessment: string;
  language: AppLanguage;
}) {
  const ivRank = findMetricValue(position, ["IV Rank"]);
  const cpr = findMetricValue(position, ["Hacim CPR"]);
  const entryWindow =
    position.blueprint.entry || findMetricValue(position, ["Entry Penceresi"]) || "-";

  return (
    <article className="rounded-xl border border-border bg-background/55 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
            {t("common:highConviction")}
          </p>
          <h4 className="mt-2 text-lg font-semibold text-foreground">
            {position.ticker}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {position.company}
            </span>
          </h4>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
            getBiasTone(position) === "bull"
              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
              : getBiasTone(position) === "bear"
                ? "border-red-500/25 bg-red-500/10 text-red-300"
                : "border-amber-500/25 bg-amber-500/10 text-amber-300"
          }`}
        >
          {getBiasLabel(position, language)}
        </span>
      </div>

      <p className="mt-3 text-sm leading-7 text-muted-foreground">{assessment}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            IV Rank
          </p>
          <p className="mt-2 text-sm font-semibold text-amber-300">{ivRank || "-"}</p>
        </div>
        <div className="rounded-xl border border-border bg-card/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            CPR
          </p>
          <p className="mt-2 text-sm font-semibold text-sky-300">{cpr || "-"}</p>
        </div>
        <div className="rounded-xl border border-border bg-card/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("common:entry")}
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">{entryWindow}</p>
        </div>
      </div>
    </article>
  );
}

export default function EarningReportPostTab({
  report,
  language = "tr",
  reportDateLabel = "",
  updatedAtLabel = "",
}: EarningReportPostTabProps) {
  const positions = sortPositions(report.positions);
  const convictionBoard = report.gainDrivers
    .map(driver => {
      const matchedPosition = positions.find(position => position.ticker === driver.factor);
      if (!matchedPosition) {
        return null;
      }

      return {
        position: matchedPosition,
        assessment: [driver.impact, driver.assessment].filter(Boolean).join(" | "),
      };
    })
    .filter(
      (
        entry
      ): entry is {
        position: EarningsPosition;
        assessment: string;
      } => Boolean(entry)
    );

  const storyItems = convictionBoard.length
    ? convictionBoard.slice(0, 5).map(entry => `${entry.position.ticker}: ${entry.assessment}`)
    : report.goldenRules.slice(0, 5);
  const metaItems: ReportPostItem[] = [
    ...report.meta.map(item => ({
      label: item.label,
      value: item.value,
    })),
    {
      label: t("common:coreWindow0bcd"),
      value: report.coreWindow || "-",
      tone: "info",
    },
    {
      label: t("common:sourceFile"),
      value: report.sourceFile,
    },
  ];

  return (
    <ReportPostShell
      language={language}
      categoryLabel={"Earnings Post"}
      title={report.title}
      subtitle={report.subtitle}
      headline={t("common:setupsStrategyCardsAndTechnical")}
      reportDateLabel={reportDateLabel || report.reportDate}
      updatedAtLabel={updatedAtLabel}
      sourceLabel={report.sourceFile}
      sourceKindLabel={t("common:markdownFile")}
      statCards={buildStatCards(report, positions, language)}
      metaItems={metaItems}
      storyItems={storyItems}
      markdown={report.rawMarkdown}
      emptyMessage={t("common:theEarningsMarkdownContentIs")}
    >
      {convictionBoard.length ? (
        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <SectionTitle
            eyebrow={"Top Picks"}
            title={t("common:highestConvictionSetupsInThe")}
            description={t("common:theNamesHighlightedInThe")}
          />

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {convictionBoard.map(entry => (
              <ConvictionCard
                key={`${entry.position.ticker}-${entry.assessment}`}
                position={entry.position}
                assessment={entry.assessment}
                language={language}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
        <SectionTitle
          eyebrow={"Setup Atlas"}
          title={t("common:tickerByTickerGamePlan")}
          description={t("common:eachUploadedEarningsReportOpens")}
        />

        <div className="mt-4 grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
          {positions.map(position => {
            const price = findMetricValue(position, ["Fiyat", "Son Fiyat"]) || "-";
            const ivRank = findMetricValue(position, ["IV Rank"]) || "-";
            const cpr = findMetricValue(position, ["Hacim CPR"]) || "-";
            const entryWindow =
              position.blueprint.entry || findMetricValue(position, ["Entry Penceresi"]) || "-";
            const exitWindow = position.blueprint.exit || "-";
            const knockout =
              findMetricValue(position, ["K.O. Olasılığı", "K.O. Olasiligi"]) ||
              findMetricValue(position, ["Kar Hedefi", "ROI"]) ||
              "-";

            return (
              <article
                key={`${position.ticker}-${position.order}`}
                className="rounded-xl border border-border bg-background/55 p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {position.ticker}
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        {position.company}
                      </span>
                    </p>
                    <p className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {position.earningsDate} {position.earningsTime !== "-" ? `· ${position.earningsTime}` : ""} ·{" "}
                      {position.daysLeft} {t("common:days")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                        getBiasTone(position) === "bull"
                          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                          : getBiasTone(position) === "bear"
                            ? "border-red-500/25 bg-red-500/10 text-red-300"
                            : "border-amber-500/25 bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {getBiasLabel(position, language)}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                        getRiskTone(position) === "bear"
                          ? "border-red-500/25 bg-red-500/10 text-red-300"
                          : getRiskTone(position) === "caution"
                            ? "border-amber-500/25 bg-amber-500/10 text-amber-300"
                            : getRiskTone(position) === "bull"
                              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                              : "border-border bg-background/60 text-muted-foreground"
                      }`}
                    >
                      {position.allocationRisk || t("common:noRiskTag")}
                    </span>
                  </div>
                </div>

                <p className="mt-2 line-clamp-2 text-[13px] font-semibold text-foreground">{position.strategyTitle}</p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card/70 p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {t("common:price")}
                    </p>
                    <p className="mt-1.5 text-[13px] font-semibold text-foreground">{price}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card/70 p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      IV Rank
                    </p>
                    <p className="mt-1.5 text-[13px] font-semibold text-amber-300">{ivRank}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card/70 p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      CPR
                    </p>
                    <p className="mt-1.5 text-[13px] font-semibold text-sky-300">{cpr}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card/70 p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {t("common:entryWindow")}
                    </p>
                    <p className="mt-1.5 text-[13px] font-semibold text-foreground">{entryWindow}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-border bg-card/70 p-2.5">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {t("common:capital")}
                      </p>
                      <p className="mt-1.5 text-[13px] font-semibold text-foreground">
                        {position.allocationCapital}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {t("common:exit")}
                      </p>
                      <p className="mt-1.5 text-[13px] font-semibold text-foreground">{exitWindow}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {t("common:koTarget")}
                      </p>
                      <p className="mt-1.5 text-[13px] font-semibold text-foreground">{knockout}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <BiasMeter position={position} language={language} />
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                      {"Primary setup"}
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs leading-5 text-muted-foreground">
                      {position.blueprint.callItems.length ? (
                        position.blueprint.callItems.map(item => (
                          <li key={`${position.ticker}-call-${item}`}>{item}</li>
                        ))
                      ) : (
                        <li>{position.strategyTitle}</li>
                      )}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border bg-card/70 p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {t("common:executionRisk")}
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs leading-5 text-muted-foreground">
                      {position.blueprint.putItems.length ? (
                        position.blueprint.putItems.map(item => (
                          <li key={`${position.ticker}-put-${item}`}>{item}</li>
                        ))
                      ) : (
                        <li>{t("common:noExtraExecutionNote")}</li>
                      )}
                    </ul>
                  </div>
                </div>

                {position.warnings.length ? (
                  <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/8 px-2.5 py-2 text-xs leading-5 text-red-100/90">
                    {position.warnings[0]}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <SectionTitle
            eyebrow={"Execution"}
            title={t("macro:itShouldExistInRepo")}
          />
          <div className="mt-6">
            <DataTable
              headers={[
                t("common:date"),
                t("common:ticker"),
                t("common:action"),
                t("common:note"),
              ]}
              rows={report.tradeSchedule.map(item => [item.date, item.ticker, item.action, item.note])}
              emptyMessage={t("common:thisReportDoesNotContain")}
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <SectionTitle
            eyebrow={"Portfolio"}
            title={t("common:portfolioAndAllocationNotes")}
          />
          <div className="mt-6">
            <DataTable
              headers={[
                t("common:ticker"),
                t("common:capital"),
                t("common:allocationNote"),
              ]}
              rows={report.allocations.map(item => [item.ticker, item.capital, item.riskLevel])}
              emptyMessage={t("common:noParsedAllocationTableIs")}
            />
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <SectionTitle
            eyebrow={"Risk Matrix"}
            title={t("common:macroAndSetupRisks")}
          />
          <div className="mt-6">
            <DataTable
              headers={[
                "Risk",
                t("common:probability"),
                t("common:impact"),
                t("common:mitigation"),
              ]}
              rows={report.risks.map(item => [
                item.risk,
                item.probability,
                item.impact,
                item.mitigation,
              ])}
              emptyMessage={t("common:noParsedRiskMatrixIs")}
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <SectionTitle
            eyebrow={t("common:rules")}
            title={"Golden rules"}
            description={t("common:theReportSGlobalDiscipline")}
          />
          <ol className="mt-6 space-y-3 text-sm leading-7 text-muted-foreground">
            {report.goldenRules.length ? (
              report.goldenRules.map(rule => (
                <li
                  key={rule}
                  className="rounded-xl border border-border bg-background/55 px-4 py-3"
                >
                  {rule}
                </li>
              ))
            ) : (
              <li className="rounded-xl border border-dashed border-border bg-background/35 px-4 py-3">
                {t("common:goldenRulesCouldNotBe")}
              </li>
            )}
          </ol>

          <div className="mt-6 border-t border-border pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
              {t("common:dailyChecklist")}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {report.checklist.length ? (
                report.checklist.map(item => (
                  <article
                    key={item}
                    className="rounded-xl border border-border bg-background/55 px-4 py-3 text-sm leading-7 text-muted-foreground"
                  >
                    {item}
                  </article>
                ))
              ) : (
                <article className="rounded-xl border border-dashed border-border bg-background/35 px-4 py-3 text-sm text-muted-foreground sm:col-span-2">
                  {t("common:checklistCouldNotBeParsed")}
                </article>
              )}
            </div>
          </div>
        </section>
      </section>
    </ReportPostShell>
  );
}

