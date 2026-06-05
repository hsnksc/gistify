import { useEffect, useMemo, useRef } from "react";
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

function findMetricValue(position: EarningsPosition, label: string) {
  return (
    position.metrics.find(metric => metric.label.toLowerCase() === label.toLowerCase())
      ?.value || "-"
  );
}

function remainingMetrics(position: EarningsPosition) {
  const hidden = new Set(["fiyat", "iv rank", "expected move"]);
  return position.metrics.filter(metric => !hidden.has(metric.label.toLowerCase()));
}

function noteTone(note: StrategyNote) {
  const title = note.title.toUpperCase();

  if (title.includes("UYARI") || title.includes("RISK")) {
    return "border-red-400/30 bg-red-500/6";
  }

  if (title.includes("AVANTAJ")) {
    return "border-emerald-400/30 bg-emerald-500/6";
  }

  if (title.includes("FOMC")) {
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
        {position.blueprint.ratioText || "Call/Put orani belirtilmedi"}
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

export default function EarningReportPlaybookTab({
  report,
  selectedTicker,
  onSelectTicker,
}: Props) {
  const positions = useMemo(() => sortPositions(report.positions), [report.positions]);
  const hasInitialSelection = useRef(false);

  useEffect(() => {
    if (!selectedTicker) {
      return;
    }

    if (!hasInitialSelection.current) {
      hasInitialSelection.current = true;
      return;
    }

    const target = document.getElementById(`earning-playbook-${selectedTicker}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedTicker]);

  if (!positions.length) {
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
              Source-of-truth playbook
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
            Hisse atlama menusu
          </h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {positions.map(position => (
            <button
              key={position.ticker}
              type="button"
              onClick={() => onSelectTicker(position.ticker)}
              className={`shrink-0 rounded-none border px-3 py-2 text-left ${
                selectedTicker === position.ticker
                  ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                  : "border-border bg-card/70 text-muted-foreground"
              }`}
            >
              <div className="data-mono text-xs font-bold">{position.ticker}</div>
              <div className="mt-1 text-[11px]">
                {position.earningsDate} · {position.earningsTime}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        {positions.map(position => (
          <article
            key={position.ticker}
            id={`earning-playbook-${position.ticker}`}
            className={`rounded-none border bg-card/80 p-5 transition-colors ${
              selectedTicker === position.ticker
                ? "border-emerald-400/50"
                : "border-border"
            }`}
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <span>#{position.order}</span>
                    <span>{position.earningsDate}</span>
                    <span className="rounded-none border border-border bg-background/60 px-2 py-1">
                      {position.earningsTime}
                    </span>
                    <span className="rounded-none border border-border bg-background/60 px-2 py-1">
                      {position.daysLeft} gun kaldi
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="heading-condensed text-3xl leading-none text-foreground">
                        {position.ticker}
                      </h3>
                      <span className={`text-sm font-semibold ${getBiasTone(position)}`}>
                        {position.strategyTitle}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {position.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-none border border-border bg-background/60 px-3 py-1.5 text-muted-foreground">
                      Sermaye:{" "}
                      <span className="data-mono font-semibold text-foreground">
                        {position.allocationCapital}
                      </span>
                    </span>
                    <span className="rounded-none border border-border bg-background/60 px-3 py-1.5 text-muted-foreground">
                      Risk:{" "}
                      <span className="data-mono font-semibold text-foreground">
                        {position.allocationRisk}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:w-[460px]">
                  <SummaryMetric
                    label="Fiyat"
                    value={findMetricValue(position, "Fiyat")}
                    hint="Rapor anindaki spot"
                  />
                  <SummaryMetric
                    label="IV Rank"
                    value={findMetricValue(position, "IV Rank")}
                    hint="Opsiyon maliyet rejimi"
                    accentClass="text-amber-300"
                  />
                  <SummaryMetric
                    label="Expected Move"
                    value={findMetricValue(position, "Expected Move")}
                    hint="Beklenen band"
                  />
                  <SummaryMetric
                    label="Surprise / EPS"
                    value={
                      findMetricValue(position, "Surprise Pot.") !== "-"
                        ? findMetricValue(position, "Surprise Pot.")
                        : findMetricValue(position, "EPS Beklenti")
                    }
                    hint="Dosyadaki ana beklenti"
                    accentClass="text-emerald-300"
                  />
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(280px,0.85fr)]">
                <section className="space-y-4 rounded-none border border-border bg-background/40 p-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Setup blueprint
                    </p>
                    <h4 className={`mt-2 text-sm font-semibold ${getBiasTone(position)}`}>
                      {position.strategyTitle}
                    </h4>
                  </div>

                  <WeightMeter position={position} />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-none border border-emerald-400/20 bg-emerald-500/5 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        {position.blueprint.callHeading}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted-foreground">
                        {position.blueprint.callItems.map(item => (
                          <li key={`${position.ticker}-call-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-none border border-red-400/20 bg-red-500/5 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                        {position.blueprint.putHeading}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted-foreground">
                        {position.blueprint.putItems.map(item => (
                          <li key={`${position.ticker}-put-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-none border border-border bg-background/60 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Giris
                      </p>
                      <p className="mt-2 text-sm text-foreground">
                        {position.blueprint.entry || "-"}
                      </p>
                    </div>
                    <div className="rounded-none border border-border bg-background/60 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Cikis
                      </p>
                      <p className="mt-2 text-sm text-foreground">
                        {position.blueprint.exit || "-"}
                      </p>
                    </div>
                    <div className="rounded-none border border-border bg-background/60 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Expiry
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-foreground">
                        {position.blueprint.expiryLines.length ? (
                          position.blueprint.expiryLines.map(line => (
                            <p key={`${position.ticker}-expiry-${line}`}>{line}</p>
                          ))
                        ) : (
                          <p>-</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-3 rounded-none border border-border bg-background/40 p-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Haber analizi
                    </p>
                    <h4 className="mt-2 text-sm font-semibold text-foreground">
                      Bias belirleyici akis
                    </h4>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {position.news.map(bucket => (
                      <div
                        key={`${position.ticker}-${bucket.key}`}
                        className={`rounded-none border p-3 ${getBucketTone(bucket.key)}`}
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                          {bucket.label}
                        </p>
                        <ul className="mt-2 space-y-1 text-sm leading-relaxed text-current/80">
                          {bucket.items.map(item => (
                            <li key={`${position.ticker}-${bucket.key}-${item}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4 rounded-none border border-border bg-background/40 p-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Rapor metrikleri
                    </p>
                    <h4 className="mt-2 text-sm font-semibold text-foreground">
                      Hisse durumu + Greeks
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {remainingMetrics(position).map(metric => (
                      <div
                        key={`${position.ticker}-${metric.label}`}
                        className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 text-sm last:border-b-0 last:pb-0"
                      >
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className="data-mono text-right text-foreground">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/80 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          <th className="pb-2">Greek</th>
                          <th className="pb-2">Deger</th>
                          <th className="pb-2">Aciklama</th>
                        </tr>
                      </thead>
                      <tbody>
                        {position.greeks.map(row => (
                          <tr key={`${position.ticker}-${row.greek}`} className="border-b border-border/50 last:border-b-0">
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
                </section>
              </div>

              <section className="rounded-none border border-border bg-background/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Kar / zarar senaryolari
                    </p>
                    <h4 className="mt-2 text-sm font-semibold text-foreground">
                      Dosyadaki senaryo matrisi
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectTicker(position.ticker)}
                    className="rounded-none border border-border bg-background/50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Secili hisse yap
                  </button>
                </div>

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
                      {position.scenarios.map(row => (
                        <tr key={`${position.ticker}-${row.scenario}`} className="border-b border-border/50 last:border-b-0">
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
              </section>

              {position.warnings.length || position.notes.length ? (
                <section className="grid gap-3 xl:grid-cols-2">
                  {position.warnings.length ? (
                    <div className="rounded-none border border-red-400/30 bg-red-500/6 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                        Kritik uyarilar
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-red-100/90">
                        {position.warnings.map(warning => (
                          <li key={`${position.ticker}-warning-${warning}`}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="grid gap-3">
                    {position.notes.map(note => (
                      <div
                        key={`${position.ticker}-${note.title}`}
                        className={`rounded-none border p-4 ${noteTone(note)}`}
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                          {note.title}
                        </p>
                        <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                          {note.lines.map(line => (
                            <p key={`${position.ticker}-${note.title}-${line}`}>{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
