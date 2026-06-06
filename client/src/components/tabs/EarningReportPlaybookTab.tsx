import { useMemo } from "react";
import type {
  EarningReportSource,
  EarningsPosition,
  NewsBucket,
  StrategyNote,
} from "@/lib/earningReportSource";

interface Props {
  report: EarningReportSource;
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
}

function sortPositions(positions: EarningsPosition[]) {
  return [...positions].sort((left, right) => {
    if (left.daysLeft !== right.daysLeft) {
      return left.daysLeft - right.daysLeft;
    }

    return left.order - right.order;
  });
}

function getBucketTone(bucket: NewsBucket["key"]) {
  switch (bucket) {
    case "positive":
      return "border-emerald-400/30 bg-emerald-500/6 text-emerald-200";
    case "negative":
      return "border-red-400/30 bg-red-500/6 text-red-200";
    case "risk":
      return "border-amber-400/30 bg-amber-500/6 text-amber-200";
    case "mixed":
      return "border-sky-400/30 bg-sky-500/6 text-sky-200";
    default:
      return "border-border bg-background/40 text-foreground";
  }
}

function getBiasTone(position: EarningsPosition) {
  const callWeight = position.blueprint.callWeight ?? 0;
  const putWeight = position.blueprint.putWeight ?? 0;

  if (callWeight > putWeight) {
    return "text-emerald-300";
  }

  if (putWeight > callWeight) {
    return "text-red-300";
  }

  return "text-amber-300";
}

function getScenarioTone(pnl: string) {
  if (/\+\$/.test(pnl) && /-\$/.test(pnl)) {
    return "text-amber-300";
  }

  if (/\+\$/.test(pnl)) {
    return "text-emerald-300";
  }

  if (/-\$/.test(pnl)) {
    return "text-red-300";
  }

  return "text-foreground";
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

  return "-";
}

function remainingMetrics(position: EarningsPosition) {
  const hidden = new Set([
    "fiyat",
    "son fiyat",
    "iv rank",
    "expected move",
    "beklenen hareket",
    "beklenen hareket (em)",
  ]);
  return position.metrics.filter(
    metric => !hidden.has(normalizeMetricLabel(metric.label))
  );
}

function noteTone(note: StrategyNote) {
  const title = note.title.toUpperCase();

  if (title.includes("UYARI") || title.includes("RISK")) {
    return "border-red-400/30 bg-red-500/6";
  }

  if (title.includes("AVANTAJ") || title.includes("BULL")) {
    return "border-emerald-400/30 bg-emerald-500/6";
  }

  if (title.includes("FOMC") || title.includes("MIXED")) {
    return "border-amber-400/30 bg-amber-500/6";
  }

  return "border-border bg-background/40";
}

function SummaryMetric({
  label,
  value,
  hint,
  accentClass = "text-foreground",
}: {
  label: string;
  value: string;
  hint: string;
  accentClass?: string;
}) {
  return (
    <div className="rounded-none border border-border bg-background/50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 data-mono text-lg font-bold ${accentClass}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function WeightMeter({ position }: { position: EarningsPosition }) {
  const callWeight = position.blueprint.callWeight;
  const putWeight = position.blueprint.putWeight;

  if (callWeight === null || putWeight === null) {
    return (
      <div className="rounded-none border border-border bg-background/40 px-3 py-2 text-sm text-muted-foreground">
        {position.blueprint.ratioText || "Call / Put orani belirtilmedi"}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <span>Call / Put orani</span>
        <span className="data-mono text-foreground">
          {callWeight}% / {putWeight}%
        </span>
      </div>
      <div className="flex h-3 overflow-hidden border border-border bg-background/70">
        <div
          className="h-full bg-emerald-400/90"
          style={{ width: `${callWeight}%` }}
        />
        <div
          className="h-full bg-red-400/90"
          style={{ width: `${putWeight}%` }}
        />
      </div>
      <div className={`text-xs leading-relaxed ${getBiasTone(position)}`}>
        {position.blueprint.biasLine || position.strategyTitle}
      </div>
    </div>
  );
}

function NoteCard({ note }: { note: StrategyNote }) {
  return (
    <div className={`rounded-none border p-4 ${noteTone(note)}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
        {note.title}
      </p>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {note.lines.map(line => (
          <p key={`${note.title}-${line}`}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default function EarningReportPlaybookTab({
  report,
  selectedTicker,
  onSelectTicker,
}: Props) {
  const positions = useMemo(() => sortPositions(report.positions), [report.positions]);
  const activePosition = useMemo(
    () =>
      positions.find(position => position.ticker === selectedTicker) ||
      positions[0] ||
      null,
    [positions, selectedTicker]
  );

  if (!positions.length || !activePosition) {
    return (
      <div className="p-6">
        <section className="rounded-none border border-border bg-card/80 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
            Rapor verisi bulunamadi
          </p>
          <h1 className="mt-3 heading-condensed text-3xl text-foreground">
            Playbook olusturulacak setup yok
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Kaynak markdown dosyasinda parse edilebilen hisse setup bloku yok.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <section className="rounded-none border border-border bg-card/80 p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Rapor ozeti
            </p>
            <h1 className="heading-condensed text-3xl leading-none text-foreground md:text-4xl">
              {report.title}
            </h1>
            <p className="text-sm text-muted-foreground">{report.subtitle}</p>
            <div className="rounded-none border border-emerald-400/20 bg-emerald-500/5 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Ana pencere
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {report.coreWindow}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {report.gainDrivers.slice(0, 4).map(driver => (
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
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {driver.assessment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-emerald-400" />
          <h2 className="heading-condensed text-base text-foreground">
            Hisse secimi
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {positions.map(position => (
            <button
              key={position.ticker}
              type="button"
              onClick={() => onSelectTicker(position.ticker)}
              className={`rounded-none border p-4 text-left transition-colors ${
                activePosition.ticker === position.ticker
                  ? "border-emerald-400/50 bg-emerald-500/10"
                  : "border-border bg-card/70 hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="heading-condensed text-2xl text-foreground">
                  {position.ticker}
                </span>
                <span className={`text-xs font-semibold ${getBiasTone(position)}`}>
                  {position.blueprint.ratioText || position.strategyTitle}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{position.company}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <span>{position.earningsDate}</span>
                <span>{position.earningsTime}</span>
                <span>{position.daysLeft} gun</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em]">
                <span className="rounded-none border border-border bg-background/60 px-2 py-1 text-muted-foreground">
                  {findMetricValue(position, ["Katalist Skoru"])}
                </span>
                <span className="rounded-none border border-border bg-background/60 px-2 py-1 text-muted-foreground">
                  {findMetricValue(position, ["EarningsPlay Aksiyon"])}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div key={activePosition.ticker} className="space-y-6">
      <section className="rounded-none border border-emerald-400/30 bg-card/85 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <span>#{activePosition.order}</span>
              <span>{activePosition.earningsDate}</span>
              <span className="rounded-none border border-border bg-background/60 px-2 py-1">
                {activePosition.earningsTime}
              </span>
              <span className="rounded-none border border-border bg-background/60 px-2 py-1">
                {activePosition.daysLeft} gun kaldi
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="heading-condensed text-4xl leading-none text-foreground">
                  {activePosition.ticker}
                </h3>
                <span className={`text-sm font-semibold ${getBiasTone(activePosition)}`}>
                  {activePosition.strategyTitle}
                </span>
                <span className="rounded-none border border-border bg-background/60 px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
                  {findMetricValue(activePosition, ["Katalist Skoru"])}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {activePosition.company}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-none border border-border bg-background/60 px-3 py-1.5 text-muted-foreground">
                Sermaye:{" "}
                <span className="data-mono font-semibold text-foreground">
                  {activePosition.allocationCapital}
                </span>
              </span>
              <span className="rounded-none border border-border bg-background/60 px-3 py-1.5 text-muted-foreground">
                Risk:{" "}
                <span className="data-mono font-semibold text-foreground">
                  {activePosition.allocationRisk}
                </span>
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[460px]">
            <SummaryMetric
              label="Fiyat"
              value={findMetricValue(activePosition, ["Fiyat", "Son Fiyat"])}
              hint="Rapor anindaki spot"
            />
            <SummaryMetric
              label="IV Rank"
              value={findMetricValue(activePosition, ["IV Rank"])}
              hint="Opsiyon maliyet rejimi"
              accentClass="text-amber-300"
            />
            <SummaryMetric
              label="Expected Move"
              value={findMetricValue(activePosition, [
                "Expected Move",
                "Beklenen Hareket (EM)",
                "Beklenen Hareket",
              ])}
              hint="Beklenen band"
            />
            <SummaryMetric
              label="EPS"
              value={
                findMetricValue(activePosition, [
                  "Surprise Pot.",
                  "EPS Beklenti",
                  "EPS Tahmini",
                ]) !== "-"
                  ? findMetricValue(activePosition, [
                      "Surprise Pot.",
                      "EPS Beklenti",
                      "EPS Tahmini",
                    ])
                  : findMetricValue(activePosition, ["Gelir Tahmini"])
              }
              hint="Ana beklenti snapshot"
              accentClass="text-emerald-300"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <article className="rounded-none border border-border bg-card/80 p-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Strateji ozeti
            </p>
            <h4 className={`mt-2 text-sm font-semibold ${getBiasTone(activePosition)}`}>
              {activePosition.strategyTitle}
            </h4>
          </div>

          <div className="mt-4 space-y-4">
            <WeightMeter position={activePosition} />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-none border border-emerald-400/20 bg-emerald-500/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {activePosition.blueprint.callHeading}
                </p>
                <ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted-foreground">
                  {activePosition.blueprint.callItems.length ? (
                    activePosition.blueprint.callItems.map(item => (
                      <li key={`${activePosition.ticker}-call-${item}`}>{item}</li>
                    ))
                  ) : (
                    <li>Call leg detayi belirtilmedi.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-none border border-red-400/20 bg-red-500/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                  {activePosition.blueprint.putHeading}
                </p>
                <ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted-foreground">
                  {activePosition.blueprint.putItems.length ? (
                    activePosition.blueprint.putItems.map(item => (
                      <li key={`${activePosition.ticker}-put-${item}`}>{item}</li>
                    ))
                  ) : (
                    <li>Put leg detayi belirtilmedi.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-none border border-border bg-background/60 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Giris
                </p>
                <p className="mt-2 text-sm text-foreground">
                  {activePosition.blueprint.entry || "-"}
                </p>
              </div>
              <div className="rounded-none border border-border bg-background/60 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Cikis
                </p>
                <p className="mt-2 text-sm text-foreground">
                  {activePosition.blueprint.exit || "-"}
                </p>
              </div>
              <div className="rounded-none border border-border bg-background/60 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Expiry
                </p>
                <div className="mt-2 space-y-1 text-sm text-foreground">
                  {activePosition.blueprint.expiryLines.length ? (
                    activePosition.blueprint.expiryLines.map(line => (
                      <p key={`${activePosition.ticker}-expiry-${line}`}>{line}</p>
                    ))
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>
            </div>

            {activePosition.warnings.length ? (
              <div className="rounded-none border border-red-400/30 bg-red-500/6 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                  Kritik uyarilar
                </p>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-red-100/90">
                  {activePosition.warnings.map(warning => (
                    <p key={`${activePosition.ticker}-warning-${warning}`}>{warning}</p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </article>

        <article className="rounded-none border border-border bg-card/80 p-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
              Haberler ve catalystler
            </p>
            <h4 className="mt-2 text-sm font-semibold text-foreground">
              Secili hisse akisi
            </h4>
          </div>

          <div className="mt-4 space-y-3">
            {activePosition.news.length ? (
              <div className="grid gap-3">
                {activePosition.news.map(bucket => (
                  <div
                    key={`${activePosition.ticker}-${bucket.key}`}
                    className={`rounded-none border p-3 ${getBucketTone(bucket.key)}`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                      {bucket.label}
                    </p>
                    <ul className="mt-2 space-y-1 text-sm leading-relaxed text-current/80">
                      {bucket.items.map(item => (
                        <li key={`${activePosition.ticker}-${bucket.key}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="grid gap-3">
              {activePosition.notes.length ? (
                activePosition.notes.map(note => (
                  <NoteCard key={`${activePosition.ticker}-${note.title}`} note={note} />
                ))
              ) : (
                <div className="rounded-none border border-border bg-background/50 p-4 text-sm leading-relaxed text-muted-foreground">
                  Bu hissede ek haber notu parse edilmedi.
                </div>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <article className="rounded-none border border-border bg-card/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Metrik kartlari
          </p>
          <div className="mt-4 space-y-2">
            {remainingMetrics(activePosition).length ? (
              remainingMetrics(activePosition).map(metric => (
                <div
                  key={`${activePosition.ticker}-${metric.label}`}
                  className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 text-sm last:border-b-0 last:pb-0"
                >
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="data-mono text-right text-foreground">
                    {metric.value}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                Ek metrik bulunmuyor.
              </div>
            )}
          </div>

          {activePosition.greeks.length ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/80 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <th className="pb-2">Greek</th>
                    <th className="pb-2">Deger</th>
                    <th className="pb-2">Aciklama</th>
                  </tr>
                </thead>
                <tbody>
                  {activePosition.greeks.map(row => (
                    <tr
                      key={`${activePosition.ticker}-${row.greek}`}
                      className="border-b border-border/50 last:border-b-0"
                    >
                      <td className="py-2 data-mono font-semibold text-foreground">
                        {row.greek}
                      </td>
                      <td className="py-2 data-mono text-amber-300">{row.value}</td>
                      <td className="py-2 text-muted-foreground">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </article>

        <article className="rounded-none border border-border bg-card/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Kar / zarar senaryolari
          </p>
          {activePosition.scenarios.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/80 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <th className="pb-2">Senaryo</th>
                    <th className="pb-2">IV degisimi</th>
                    <th className="pb-2">Hisse hareketi</th>
                    <th className="pb-2">Est. P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {activePosition.scenarios.map(row => (
                    <tr
                      key={`${activePosition.ticker}-${row.scenario}`}
                      className="border-b border-border/50 last:border-b-0"
                    >
                      <td className="py-2 text-foreground">{row.scenario}</td>
                      <td className="py-2 data-mono text-muted-foreground">
                        {row.ivChange}
                      </td>
                      <td className="py-2 data-mono text-muted-foreground">
                        {row.stockMove}
                      </td>
                      <td className={`py-2 data-mono font-semibold ${getScenarioTone(row.pnl)}`}>
                        {row.pnl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 rounded-none border border-border bg-background/50 p-4 text-sm leading-relaxed text-muted-foreground">
              Bu rapor versiyonunda tablo bazli P/L senaryosu verilmedi. Ana yon,
              call/put orani ve giris/cikis penceresi strategy board ustunden okunmali.
            </div>
          )}
        </article>
      </section>
      </div>
    </div>
  );
}
