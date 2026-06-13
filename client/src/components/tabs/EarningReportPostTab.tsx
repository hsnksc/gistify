import type { AppLanguage } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
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
    return copy(language, "Call agirlikli", "Call-heavy");
  }

  if (tone === "bear") {
    return copy(language, "Put agirlikli", "Put-heavy");
  }

  return copy(language, "Dengeli", "Balanced");
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
  const ivValues = positions
    .map(position => position.ivRank)
    .filter((value): value is number => value !== null && Number.isFinite(value));
  const moveValues = positions
    .map(position => position.expectedMove)
    .filter((value): value is number => value !== null && Number.isFinite(value));
  const nextEvent = positions[0] || null;

  const avgIvRank = ivValues.length
    ? `%${Math.round(ivValues.reduce((sum, value) => sum + value, 0) / ivValues.length)}`
    : "-";
  const avgExpectedMove = moveValues.length
    ? `%${(
        moveValues.reduce((sum, value) => sum + Math.abs(value), 0) / moveValues.length
      ).toFixed(1)}`
    : "-";

  return [
    {
      label: copy(language, "Setup Sayisi", "Setup Count"),
      value: String(positions.length),
      detail: copy(
        language,
        "Secili earnings dosyasindan parse edilen ticker sayisi.",
        "Number of tickers parsed from the selected earnings file."
      ),
      tone: "info",
    },
    {
      label: "Avg IV Rank",
      value: avgIvRank,
      detail: copy(
        language,
        "Opsiyon maliyet rejiminin ortalama seviyesi.",
        "Average options cost regime level."
      ),
      tone: "caution",
    },
    {
      label: copy(language, "Ort. Beklenen Hareket", "Avg Expected Move"),
      value: avgExpectedMove,
      detail: copy(
        language,
        "Tum aktif setup'larin beklenen hareket ortalamasi.",
        "Average expected move across active setups."
      ),
      tone: "bull",
    },
    {
      label: copy(language, "En Yakin Event", "Nearest Event"),
      value: nextEvent ? `${nextEvent.ticker} · ${nextEvent.earningsDate}` : "-",
      detail: nextEvent
        ? `${nextEvent.daysLeft} ${copy(language, "gun kaldi", "days left")}`
        : copy(language, "Takvim parse edilmedi.", "Calendar was not parsed."),
      tone: nextEvent ? getBiasTone(nextEvent) : "neutral",
    },
    {
      label: "VIX",
      value: report.vixLabel || "-",
      detail: copy(
        language,
        "Kaynak rapordaki volatilite baglami.",
        "Volatility context from the source report."
      ),
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
      <div className="rounded-[1.1rem] border border-border bg-background/45 px-3 py-2 text-xs text-muted-foreground">
        {position.blueprint.ratioText ||
          copy(language, "Call / Put dagilimi verilmedi.", "Call / put split was not provided.")}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span>{copy(language, "Call / Put", "Call / Put")}</span>
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
      <div className="rounded-[1.4rem] border border-dashed border-border bg-background/35 p-4 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.45rem] border border-border bg-background/45">
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

export default function EarningReportPostTab({
  report,
  language = "tr",
  reportDateLabel = "",
  updatedAtLabel = "",
}: EarningReportPostTabProps) {
  const positions = sortPositions(report.positions);
  const storyItems = report.gainDrivers.length
    ? report.gainDrivers.slice(0, 4).map(driver => `${driver.factor}: ${driver.assessment}`)
    : report.goldenRules.slice(0, 4);
  const metaItems: ReportPostItem[] = [
    ...report.meta.map(item => ({
      label: item.label,
      value: item.value,
    })),
    {
      label: copy(language, "Ana Pencere", "Core Window"),
      value: report.coreWindow || "-",
      tone: "info",
    },
    {
      label: copy(language, "Kaynak Dosya", "Source File"),
      value: report.sourceFile,
    },
  ];

  return (
    <ReportPostShell
      language={language}
      categoryLabel={copy(language, "Earnings Post", "Earnings Post")}
      title={report.title}
      subtitle={report.subtitle}
      headline={copy(
        language,
        "Bu gorunum, secili earnings markdown dosyasini post formatinda ozetler; setup, takvim, risk ve tam kaynak icerigi ayni akista korunur.",
        "This view turns the selected earnings markdown file into a post-style reading flow while keeping setups, calendar, risk context, and the full source content together."
      )}
      reportDateLabel={reportDateLabel || report.reportDate}
      updatedAtLabel={updatedAtLabel}
      sourceLabel={report.sourceFile}
      sourceKindLabel={copy(language, "Markdown Dosyasi", "Markdown File")}
      statCards={buildStatCards(report, positions, language)}
      metaItems={metaItems}
      storyItems={storyItems}
      markdown={report.rawMarkdown}
      emptyMessage={copy(
        language,
        "Earnings markdown icerigi bos.",
        "The earnings markdown content is empty."
      )}
    >
      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <SectionTitle
          eyebrow={copy(language, "Setup Board", "Setup Board")}
          title={copy(language, "Ticker bazli oyun plani", "Ticker-by-ticker game plan")}
          description={copy(
            language,
            "Her yuklenen earnings raporu, parse edilen tum setup'lari sade ama eksiksiz kartlar halinde aciyor.",
            "Each uploaded earnings report opens all parsed setups as clean but complete cards."
          )}
        />

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {positions.map(position => (
            <article
              key={`${position.ticker}-${position.order}`}
              className="rounded-[1.45rem] border border-border bg-background/55 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {position.ticker}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      {position.company}
                    </span>
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {position.earningsDate} · {position.earningsTime} · {position.daysLeft}{" "}
                    {copy(language, "gun", "days")}
                  </p>
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

              <p className="mt-3 text-sm font-semibold text-foreground">
                {position.strategyTitle}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.1rem] border border-border bg-card/70 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    IV Rank
                  </p>
                  <p className="mt-2 text-sm font-semibold text-amber-300">
                    {formatPercentValue(position.ivRank)}
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-border bg-card/70 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {copy(language, "Beklenen Hareket", "Expected Move")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-sky-300">
                    {formatPercentValue(position.expectedMove, 1)}
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-border bg-card/70 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {copy(language, "Sermaye", "Capital")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {position.allocationCapital}
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-border bg-card/70 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Risk
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {position.allocationRisk}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <BiasMeter position={position} language={language} />
              </div>

              {position.warnings.length ? (
                <div className="mt-4 rounded-[1.1rem] border border-red-500/20 bg-red-500/8 p-3 text-sm leading-6 text-red-100/90">
                  {position.warnings[0]}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionTitle
            eyebrow={copy(language, "Execution", "Execution")}
            title={copy(language, "Takvim ve islem sirasi", "Timeline and execution order")}
          />
          <div className="mt-5">
            <DataTable
              headers={[
                copy(language, "Tarih", "Date"),
                "Ticker",
                copy(language, "Aksiyon", "Action"),
                copy(language, "Not", "Note"),
              ]}
              rows={report.tradeSchedule.map(item => [
                item.date,
                item.ticker,
                item.action,
                item.note,
              ])}
              emptyMessage={copy(
                language,
                "Bu raporda ayri bir trade schedule tablosu yok.",
                "This report does not contain a separate trade schedule table."
              )}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionTitle
            eyebrow={copy(language, "Risk Matrix", "Risk Matrix")}
            title={copy(language, "Makro ve setup riskleri", "Macro and setup risks")}
          />
          <div className="mt-5">
            <DataTable
              headers={[
                copy(language, "Risk", "Risk"),
                copy(language, "Olasilik", "Probability"),
                copy(language, "Etki", "Impact"),
                copy(language, "Onlem", "Mitigation"),
              ]}
              rows={report.risks.map(item => [
                item.risk,
                item.probability,
                item.impact,
                item.mitigation,
              ])}
              emptyMessage={copy(
                language,
                "Bu raporda parse edilen risk matrisi yok.",
                "No parsed risk matrix is available in this report."
              )}
            />
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionTitle
            eyebrow="Rules"
            title={copy(language, "Golden rules", "Golden rules")}
            description={copy(
              language,
              "Raporun global disiplin kurallari burada duz metin yerine operasyonel maddeler olarak korunur.",
              "The report's global discipline rules are preserved here as operational items instead of raw text."
            )}
          />
          <ol className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
            {report.goldenRules.length ? (
              report.goldenRules.map(rule => (
                <li
                  key={rule}
                  className="rounded-[1.2rem] border border-border bg-background/55 px-4 py-3"
                >
                  {rule}
                </li>
              ))
            ) : (
              <li className="rounded-[1.2rem] border border-dashed border-border bg-background/35 px-4 py-3">
                {copy(language, "Golden rule parse edilemedi.", "Golden rules could not be parsed.")}
              </li>
            )}
          </ol>
        </section>

        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionTitle
            eyebrow="Checklist"
            title={copy(language, "Gunluk kontrol listesi", "Daily checklist")}
            description={copy(
              language,
              "Yeni markdown yuklendiginde checklist satirlari ayni post akisina otomatik eklenir.",
              "When a new markdown file is uploaded, checklist rows are added to the same post flow automatically."
            )}
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {report.checklist.length ? (
              report.checklist.map(item => (
                <article
                  key={item}
                  className="rounded-[1.2rem] border border-border bg-background/55 px-4 py-3 text-sm leading-7 text-muted-foreground"
                >
                  {item}
                </article>
              ))
            ) : (
              <article className="rounded-[1.2rem] border border-dashed border-border bg-background/35 px-4 py-3 text-sm text-muted-foreground sm:col-span-2">
                {copy(language, "Checklist parse edilemedi.", "Checklist could not be parsed.")}
              </article>
            )}
          </div>
        </section>
      </section>
    </ReportPostShell>
  );
}
