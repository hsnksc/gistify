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
    return copy(language, "Call agirlikli", "Call-heavy");
  }

  if (tone === "bear") {
    return copy(language, "Put agirlikli", "Put-heavy");
  }

  return copy(language, "Dengeli", "Balanced");
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
      label: copy(language, "Setup Sayisi", "Setup Count"),
      value: String(positions.length),
      detail: copy(
        language,
        "Secili earnings dosyasindan parse edilen ticker adedi.",
        "Number of tickers parsed from the selected earnings file."
      ),
      tone: "info",
    },
    {
      label: copy(language, "En Yuksek IV Rank", "Highest IV Rank"),
      value: topIvPosition ? `${topIvPosition.ticker} · ${formatPercentValue(topIvPosition.ivRank, 2)}` : "-",
      detail: topIvPosition
        ? topIvPosition.strategyTitle
        : copy(language, "IV Rank verisi bulunamadi.", "IV Rank data is unavailable."),
      tone: "caution",
    },
    {
      label: "Avg CPR",
      value: avgCpr !== null ? avgCpr.toFixed(2) : "-",
      detail: copy(
        language,
        "Hacim CPR ortalamasi; yon dengesini hizli okuma icin.",
        "Average volume CPR for a fast read on directional balance."
      ),
      tone: "bull",
    },
    {
      label: copy(language, "FOMC Yuksek Risk", "High FOMC Risk"),
      value: String(highRiskCount),
      detail: copy(
        language,
        "Kirmizi risk etiketi alan setup sayisi.",
        "Number of setups tagged with the highest risk label."
      ),
      tone: "bear",
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
        "Makro volatilite baglami.",
        "Macro volatility context."
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
    <article className="rounded-[1.45rem] border border-border bg-background/55 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
            {copy(language, "Yuksek Oncelik", "High Conviction")}
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
        <div className="rounded-[1rem] border border-border bg-card/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            IV Rank
          </p>
          <p className="mt-2 text-sm font-semibold text-amber-300">{ivRank || "-"}</p>
        </div>
        <div className="rounded-[1rem] border border-border bg-card/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            CPR
          </p>
          <p className="mt-2 text-sm font-semibold text-sky-300">{cpr || "-"}</p>
        </div>
        <div className="rounded-[1rem] border border-border bg-card/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {copy(language, "Giris", "Entry")}
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
        "Bu gorunum secili earnings markdown dosyasini gercek verilerle bir post akisina cevirir; setup derinligi, execution plani, portfoy notlari ve tam kaynak icerigi ayni yerde kalir.",
        "This view turns the selected earnings markdown file into a post flow with real parsed data while keeping setup depth, execution planning, portfolio notes, and the full source document together."
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
      {convictionBoard.length ? (
        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionTitle
            eyebrow={copy(language, "Top Picks", "Top Picks")}
            title={copy(language, "Rapordaki en guclu setup'lar", "Highest-conviction setups in the report")}
            description={copy(
              language,
              "Executive summary tarafinda one cikan isimler burada dogrudan setup kartlarina baglanir.",
              "The names highlighted in the executive summary are tied directly to their setup cards here."
            )}
          />

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
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

      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <SectionTitle
          eyebrow={copy(language, "Setup Atlas", "Setup Atlas")}
          title={copy(language, "Ticker bazli oyun plani", "Ticker-by-ticker game plan")}
          description={copy(
            language,
            "Her yuklenen earnings raporu, parse edilen tum setup'lari eksik metrikleri one cikarmadan okunabilir kartlar halinde acar.",
            "Each uploaded earnings report opens every parsed setup as readable cards without surfacing fake or missing metrics."
          )}
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
                className="rounded-[1.15rem] border border-border bg-background/55 p-3.5"
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
                      {position.daysLeft} {copy(language, "gun", "days")}
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
                      {position.allocationRisk || copy(language, "Risk notu yok", "No risk tag")}
                    </span>
                  </div>
                </div>

                <p className="mt-2 line-clamp-2 text-[13px] font-semibold text-foreground">{position.strategyTitle}</p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card/70 p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {copy(language, "Fiyat", "Price")}
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
                      {copy(language, "Giris Penceresi", "Entry Window")}
                    </p>
                    <p className="mt-1.5 text-[13px] font-semibold text-foreground">{entryWindow}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-border bg-card/70 p-2.5">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {copy(language, "Sermaye", "Capital")}
                      </p>
                      <p className="mt-1.5 text-[13px] font-semibold text-foreground">
                        {position.allocationCapital}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {copy(language, "Cikis", "Exit")}
                      </p>
                      <p className="mt-1.5 text-[13px] font-semibold text-foreground">{exitWindow}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {copy(language, "KO / Hedef", "KO / Target")}
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
                      {copy(language, "Primary setup", "Primary setup")}
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
                      {copy(language, "Execution / risk", "Execution / risk")}
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs leading-5 text-muted-foreground">
                      {position.blueprint.putItems.length ? (
                        position.blueprint.putItems.map(item => (
                          <li key={`${position.ticker}-put-${item}`}>{item}</li>
                        ))
                      ) : (
                        <li>{copy(language, "Ek execution notu yok.", "No extra execution note.")}</li>
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
        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionTitle
            eyebrow={copy(language, "Execution", "Execution")}
            title={copy(language, "Takvim ve islem sirasi", "Timeline and execution order")}
          />
          <div className="mt-5">
            <DataTable
              headers={[
                copy(language, "Tarih", "Date"),
                copy(language, "Hisse", "Ticker"),
                copy(language, "Aksiyon", "Action"),
                copy(language, "Not", "Note"),
              ]}
              rows={report.tradeSchedule.map(item => [item.date, item.ticker, item.action, item.note])}
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
            eyebrow={copy(language, "Portfolio", "Portfolio")}
            title={copy(language, "Portfoy ve allocation notlari", "Portfolio and allocation notes")}
          />
          <div className="mt-5">
            <DataTable
              headers={[
                copy(language, "Hisse", "Ticker"),
                copy(language, "Sermaye", "Capital"),
                copy(language, "Allocation notu", "Allocation note"),
              ]}
              rows={report.allocations.map(item => [item.ticker, item.capital, item.riskLevel])}
              emptyMessage={copy(
                language,
                "Bu raporda parse edilen allocation tablosu yok.",
                "No parsed allocation table is available in this report."
              )}
            />
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
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

        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionTitle
            eyebrow={copy(language, "Kurallar", "Rules")}
            title={copy(language, "Golden rules", "Golden rules")}
            description={copy(
              language,
              "Raporun global disiplin kurallari burada operasyonel maddeler olarak korunur.",
              "The report's global discipline rules are preserved here as operational items."
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

          <div className="mt-6 border-t border-border pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
              {copy(language, "Gunluk kontrol listesi", "Daily checklist")}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
          </div>
        </section>
      </section>
    </ReportPostShell>
  );
}
