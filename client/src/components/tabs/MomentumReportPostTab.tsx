import { AppLanguage, t } from "@/lib/i18n";

import ReportPostShell, {
  type ReportPostItem,
  type ReportTone,
} from "@/components/reports/ReportPostShell";
import { splitSummaryText } from "@/lib/reportPost";
import type {
  MomentumCandidateRow,
  MomentumReportSource,
} from "@/lib/momentumReportSource";

interface MomentumReportPostTabProps {
  report: MomentumReportSource;
  language?: AppLanguage;
  updatedAtLabel?: string;
}

function groupTone(group: MomentumCandidateRow["group"]): ReportTone {
  if (group === "upside") {
    return "bull";
  }

  if (group === "downside") {
    return "bear";
  }

  return "caution";
}

function groupLabel(group: MomentumCandidateRow["group"], language: AppLanguage) {
  if (group === "upside") {
    return t("common:upsideReversal");
  }

  if (group === "downside") {
    return t("common:downsideMomentum");
  }

  return "Defensive";
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
              <tr key={`${rowIndex}-${row[0] || "row"}`} className="border-b border-border/60 last:border-b-0">
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

export default function MomentumReportPostTab({
  report,
  language = "tr",
  updatedAtLabel = "",
}: MomentumReportPostTabProps) {
  const topSetup =
    [...report.candidates].sort((left, right) => (right.score || 0) - (left.score || 0))[0] ||
    null;
  const negativeBreadth =
    report.indexRows.filter(row => (row.pctChange || 0) < 0).length || 0;
  const storyItems = [
    ...splitSummaryText(report.executiveSummary, 2),
    report.vixCommentary[0] || "",
    report.conclusionParagraphs[0] || "",
  ].filter(Boolean);

  const statCards: ReportPostItem[] = [
    {
      label: t("common:marketRegime"),
      value: report.regimeLabel || "-",
      detail: t("common:primaryMarketModeUsedTo"),
      tone: "info",
    },
    {
      label: "Top Setup",
      value: topSetup?.ticker || topSetup?.name || "-",
      detail: topSetup?.scoreLabel || t("common:noScoreInformation"),
      tone: topSetup ? groupTone(topSetup.group) : "neutral",
    },
    {
      label: t("common:setupCount"),
      value: String(report.candidates.length),
      detail: t("flow:allHtmlReportsFiltersAnd"),
      tone: "bull",
    },
    {
      label: t("common:negativeBreadth"),
      value: String(negativeBreadth),
      detail: t("common:numberOfNegativeIndexOr"),
      tone: negativeBreadth ? "bear" : "neutral",
    },
  ];

  const metaItems: ReportPostItem[] = [
    {
      label: t("common:reportDate"),
      value: report.reportDateLabel || report.reportDate,
    },
    {
      label: "Session",
      value: report.sessionDateLabel || "-",
      tone: "info",
    },
    {
      label: "Target",
      value: report.targetDateLabel || "-",
      tone: "caution",
    },
    {
      label: t("common:analystBuy"),
      value: report.readingTimeLabel || "-",
    },
    {
      label: t("common:sourceFile"),
      value: report.sourceFile,
    },
  ];

  return (
    <ReportPostShell
      language={language}
      categoryLabel={"Momentum Post"}
      title={report.title}
      subtitle={report.subtitle}
      headline={t("common:thisViewOpensTheSelected")}
      reportDateLabel={report.reportDateLabel || report.reportDate}
      updatedAtLabel={updatedAtLabel}
      sourceLabel={report.sourceFile}
      sourceKindLabel={t("common:markdownFile")}
      statCards={statCards}
      metaItems={metaItems}
      storyItems={storyItems}
      markdown={report.rawMarkdown}
      emptyMessage={t("common:theMomentumMarkdownContentIs")}
    >
      <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
        <SectionTitle
          eyebrow={"Candidate Board"}
          title={t("common:candidateSetups")}
          description={t("common:allCandidatesFromTheNewly")}
        />

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {report.candidates.length ? (
            report.candidates.map(candidate => (
              <article
                key={`${candidate.group}-${candidate.ticker}-${candidate.name}`}
                className="rounded-xl border border-border bg-background/55 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {candidate.ticker || candidate.name}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {groupLabel(candidate.group, language)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                      groupTone(candidate.group) === "bull"
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                        : groupTone(candidate.group) === "bear"
                          ? "border-red-500/25 bg-red-500/10 text-red-300"
                          : "border-amber-500/25 bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {candidate.scoreLabel || "-"}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-foreground/90">{candidate.reason}</p>
                <div className="mt-4 rounded-xl border border-border bg-card/70 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Risk
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{candidate.risk}</p>
                </div>
              </article>
            ))
          ) : (
            <article className="rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm text-muted-foreground xl:col-span-2">
              {t("common:6meba0")}
            </article>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <SectionTitle
            eyebrow={"Market Snapshot"}
            title={t("common:indexAndSectorPicture")}
          />
          <div className="mt-6 space-y-6">
            <DataTable
              headers={[
                t("common:index"),
                t("common:closef0cc"),
                t("common:change"),
                t("common:change8e00"),
                t("common:comment"),
              ]}
              rows={report.indexRows.map(row => [
                row.index,
                row.closeLabel,
                row.changeLabel,
                row.pctChangeLabel,
                row.comment,
              ])}
              emptyMessage={t("common:theIndexTableCouldNot")}
            />

            <DataTable
              headers={[
                t("common:sectorc5c4"),
                t("common:daily"),
                t("common:weekly"),
                t("common:comment"),
              ]}
              rows={report.sectorRows.map(row => [
                row.sector,
                row.dayChangeLabel,
                row.weeklyLabel,
                row.comment,
              ])}
              emptyMessage={t("common:theSectorTableCouldNot")}
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <SectionTitle
            eyebrow={"Catalysts"}
            title={t("common:calendarAndScenario")}
          />
          <div className="mt-6 space-y-6">
            <DataTable
              headers={[
                t("common:date"),
                t("common:event"),
                t("scanner:v40RuleMidpointLimit"),
              ]}
              rows={report.calendarEvents.map(item => [
                item.date,
                item.event,
                item.impact,
              ])}
              emptyMessage={t("common:calendarCatalystsCouldNotBe")}
            />

            <DataTable
              headers={[
                t("common:event"),
                t("common:probability"),
                t("common:action"),
              ]}
              rows={report.scenarios.map(item => [
                item.scenario,
                item.probabilityLabel,
                item.action,
              ])}
              emptyMessage={t("common:theScenarioTableCouldNot")}
            />
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <SectionTitle
            eyebrow={"Risk Factors"}
            title={t("common:priorityWatchpoints")}
          />
          <div className="mt-6 space-y-3">
            {report.riskFactors.length ? (
              report.riskFactors.map(item => (
                <article
                  key={`${item.title}-${item.detail}`}
                  className="rounded-xl border border-border bg-background/55 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.detail}</p>
                </article>
              ))
            ) : (
              <article className="rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm text-muted-foreground">
                {t("common:riskFactorsCouldNotBe")}
              </article>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <SectionTitle
            eyebrow={"Option Route"}
            title={t("common:optionsAndRouteNotes")}
          />
          <div className="mt-6 space-y-3">
            {report.optionStrategies.length ? (
              report.optionStrategies.map(item => (
                <article
                  key={`${item.strategy}-${item.condition}`}
                  className="rounded-xl border border-border bg-background/55 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">{item.strategy}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.condition}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-emerald-300">
                    {item.target}
                  </p>
                </article>
              ))
            ) : (
              <article className="rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm text-muted-foreground">
                {t("common:optionRouteNotesCouldNot")}
              </article>
            )}
          </div>
        </section>
      </section>
    </ReportPostShell>
  );
}

