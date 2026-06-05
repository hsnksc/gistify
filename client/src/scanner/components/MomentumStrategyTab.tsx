import { AlertTriangle, Route, Shield, Target } from "lucide-react";
import type { MomentumReportSource } from "@/lib/momentumReportSource";

function TableSection({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-emerald-400" />
        <h3 className="heading-condensed text-lg text-foreground">{title}</h3>
      </div>
      <div className="mt-4 overflow-hidden rounded-none border border-border bg-background/45">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background/65 text-left text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <tr>
              {headers.map(header => (
                <th key={header} className="px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${title}-${rowIndex}`} className="border-t border-border/70">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${title}-${rowIndex}-${cellIndex}`}
                    className={`px-4 py-3 ${
                      cellIndex === 0 ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function MomentumStrategyTab({
  report,
}: {
  report: MomentumReportSource;
}) {
  return (
    <div className="space-y-6 px-6 pb-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-emerald-400" />
            <p className="heading-condensed text-lg text-foreground">
              Pozisyonlama Matrisi
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {report.strategyBands.map(row => (
              <div
                key={`${row.regime}-${row.strategy}`}
                className="rounded-none border border-border bg-background/55 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{row.regime}</p>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    {row.position}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {row.strategy}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <p className="heading-condensed text-lg text-foreground">
              Teknik ve Rejim Notlari
            </p>
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-none border border-border bg-background/55 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                QQQ Teknik Seviyeler
              </p>
              <div className="mt-3 space-y-2">
                {report.qqqLevels.map(row => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-foreground">{row.label}</span>
                    <span className="data-mono font-semibold text-foreground">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-none border border-border bg-background/55 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                SPY Seviyeleri
              </p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {report.technicalLevels.map(level => (
                  <div
                    key={`${level.bucket}-${level.label}`}
                    className="rounded-none border border-border bg-background/70 px-3 py-2"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {level.label}
                    </p>
                    <p className="mt-1 data-mono text-sm font-bold text-foreground">
                      {level.valueLabel}
                    </p>
                    {level.note ? (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {level.note}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-none border border-amber-400/20 bg-amber-500/5 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                VIX Teknik Notu
              </p>
              <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {report.vixTechnicalCommentary.length ? (
                  report.vixTechnicalCommentary.map(line => <p key={line}>{line}</p>)
                ) : (
                  <p>Bu raporda ek VIX teknik notu bulunmuyor.</p>
                )}
              </div>
            </div>
          </div>
        </article>
      </section>

      <TableSection
        title="Pazartesi Senaryolari"
        headers={["Senaryo", "Olasilik", "Aksiyon"]}
        rows={report.scenarios.map(row => [row.scenario, row.probabilityLabel, row.action])}
      />

      <TableSection
        title="Opsiyon Planlari"
        headers={["Strateji", "Kosul", "Hedef"]}
        rows={report.optionStrategies.map(row => [row.strategy, row.condition, row.target])}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <p className="heading-condensed text-lg text-foreground">
              Kritik Riskler
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {report.riskFactors.map(item => (
              <div
                key={item.title}
                className="rounded-none border border-border bg-background/55 p-4"
              >
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <p className="heading-condensed text-lg text-foreground">
              Tetik Seviyeleri
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {report.criticalLevels.map(row => (
              <div
                key={`${row.symbol}-${row.levelLabel}`}
                className="rounded-none border border-border bg-background/55 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{row.symbol}</p>
                  <span className="data-mono text-sm font-bold text-foreground">
                    {row.levelLabel}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {row.meaning}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-400" />
          <p className="heading-condensed text-lg text-foreground">Sonuc</p>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {report.conclusionParagraphs.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {report.footerNote ? (
          <div className="mt-5 rounded-none border border-border bg-background/55 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            {report.footerNote}
          </div>
        ) : null}
      </section>
    </div>
  );
}
