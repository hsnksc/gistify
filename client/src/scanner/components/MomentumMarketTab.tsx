import {
  Activity,
  CandlestickChart,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Waves,
} from "lucide-react";
import type {
  MacroRow,
  MomentumHavenRow,
  MomentumMoverRow,
  MomentumReportSource,
  MomentumSectorRow,
} from "@/lib/momentumReportSource";
import { copy } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";

function SimpleMetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[1.45rem] border border-border bg-background/55 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 data-mono text-xl font-bold text-foreground">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-[1.45rem] border border-dashed border-border bg-background/35 p-4 text-sm leading-7 text-muted-foreground">
      {message}
    </div>
  );
}

function DataTable({
  title,
  eyebrow,
  headers,
  rows,
}: {
  title: string;
  eyebrow: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
        {eyebrow}
      </p>
      <h3 className="mt-2 heading-condensed text-xl text-foreground">{title}</h3>
      <div className="mt-4 overflow-hidden rounded-[1.45rem] border border-border bg-background/45">
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
                <tr key={`${title}-${rowIndex}`} className="border-b border-border/60 last:border-b-0">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${title}-${rowIndex}-${cellIndex}`}
                      className={`px-4 py-3 align-top leading-7 ${
                        cellIndex === 0 ? "font-semibold text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {cell || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function MacroStack({ title, rows, language }: { title: string; rows: MacroRow[]; language: AppLanguage }) {

  return (
    <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
      <div className="flex items-center gap-2">
        <Activity className="size-4 text-emerald-300" />
        <h3 className="heading-condensed text-xl text-foreground">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {rows.length ? (
          rows.map(row => (
            <article
              key={`${title}-${row.metric}`}
              className="rounded-[1.45rem] border border-border bg-background/55 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{row.metric}</p>
                <span className="data-mono text-sm font-semibold text-emerald-300">
                  {row.value}
                </span>
              </div>
              {row.comment ? (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {row.comment}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <EmptyPanel
            message={copy(
              language,
              "Bu blokta parse edilen veri yok.",
              "No parsed data is available in this block."
            )}
          />
        )}
      </div>
    </section>
  );
}

function MoversStack({
  title,
  rows,
  positive,
  language,
}: {
  title: string;
  rows: MomentumMoverRow[];
  positive: boolean;
  language: AppLanguage;
}) {

  return (
    <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
      <div className="flex items-center gap-2">
        {positive ? (
          <TrendingUp className="size-4 text-emerald-300" />
        ) : (
          <TrendingDown className="size-4 text-red-300" />
        )}
        <h3 className="heading-condensed text-xl text-foreground">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {rows.length ? (
          rows.map(row => (
            <article
              key={`${title}-${row.ticker}-${row.name}`}
              className="rounded-[1.45rem] border border-border bg-background/55 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {row.ticker || row.name}
                    {row.name && row.ticker && row.name !== row.ticker
                      ? ` · ${row.name}`
                      : ""}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {row.catalyst}
                  </p>
                </div>
                <span
                  className={`data-mono text-sm font-semibold ${
                    positive ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {row.moveLabel}
                </span>
              </div>
            </article>
          ))
        ) : (
          <EmptyPanel
            message={
              positive
                ? copy(
                    language,
                    "Yukari momentum listesi bu raporda ayri gelmedi.",
                    "The upside momentum list did not come through separately in this report."
                  )
                : copy(
                    language,
                    "Asagi momentum listesi bu raporda ayri gelmedi.",
                    "The downside momentum list did not come through separately in this report."
                  )
            }
          />
        )}
      </div>
    </section>
  );
}

function HavenStack({ rows, language }: { rows: MomentumHavenRow[]; language: AppLanguage }) {

  return (
    <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
      <div className="flex items-center gap-2">
        <ShieldAlert className="size-4 text-amber-300" />
        <h3 className="heading-condensed text-xl text-foreground">
          {copy(language, "Defansif", "Defensive")}
        </h3>
      </div>
      <div className="mt-4 space-y-3">
        {rows.length ? (
          rows.map(row => (
            <article
              key={row.symbol}
              className="rounded-[1.45rem] border border-border bg-background/55 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{row.symbol}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{row.role}</p>
                </div>
                <span className="data-mono text-sm font-semibold text-amber-300">
                  {row.performanceLabel}
                </span>
              </div>
            </article>
          ))
        ) : (
          <EmptyPanel
            message={copy(
              language,
              "Defensive veya hedge notu bu raporda ayri gelmedi.",
              "The defensive or hedge note did not come through separately in this report."
            )}
          />
        )}
      </div>
    </section>
  );
}

function formatSectorRows(rows: MomentumSectorRow[]) {
  return rows.map(row => [
    row.sector,
    row.dayChangeLabel,
    row.weeklyLabel,
    row.comment,
  ]);
}

export default function MomentumMarketTab({
  report,
  language,
}: {
  report: MomentumReportSource;
  language: AppLanguage;
}) {
  const vixClose = report.vixRows.find(row => /vix kapanis/i.test(row.label));
  const vixChange = report.vixRows.find(row => /gunluk degisim/i.test(row.label));

  return (
    <div className="space-y-6 px-6 pb-8">
      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
            <CandlestickChart className="size-4" />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {copy(language, "Market Pulse", "Market Pulse")}
            </p>
            <h2 className="heading-condensed text-3xl text-foreground">
              {copy(language, "Sade piyasa okuma katmani", "Simplified market reading layer")}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              {copy(
                language,
                "Grafik yerine secili momentum markdown dosyasindaki endeks, VIX, sektor ve makro bloklari dogrudan okunur tablolarla gosterilir.",
                "Instead of charts, the index, VIX, sector and macro blocks from the selected momentum markdown are shown in direct readable tables."
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SimpleMetricCard
          label="VIX"
          value={vixClose?.value || report.vixRows[0]?.value || report.regimeLabel || "-"}
          note={vixClose?.comment || report.vixCommentary[0] || copy(language, "Secili rapordan okunur.", "Read from the selected report.")}
        />
        <SimpleMetricCard
          label={copy(language, "Gunluk VIX", "Daily VIX")}
          value={vixChange?.value || "-"}
          note={vixChange?.comment || copy(language, "Kisa vade korku temposu.", "Short-term fear tempo.")}
        />
        <SimpleMetricCard
          label={copy(language, "Rejim", "Regime")}
          value={report.regimeLabel || "-"}
          note={copy(language, "Tum setup yorumu bu rejimden turetilir.", "All setup interpretation is derived from this regime.")}
        />
        <SimpleMetricCard
          label={copy(language, "Okuma Suresi", "Reading Time")}
          value={report.readingTimeLabel || "-"}
          note={copy(language, "Kaynak raporda belirtilen tahmini sure.", "Estimated time stated in the source report.")}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <DataTable
          eyebrow={copy(language, "Ana Endeksler", "Major Indices")}
          title={copy(language, "Endeks hareketleri", "Index moves")}
          headers={[
            copy(language, "Endeks", "Index"),
            copy(language, "Kapanis", "Close"),
            copy(language, "Degisim", "Change"),
            copy(language, "% Degisim", "% Change"),
            copy(language, "Yorum", "Comment"),
          ]}
          rows={report.indexRows.map(row => [
            row.index,
            row.closeLabel,
            row.changeLabel,
            row.pctChangeLabel,
            row.comment,
          ])}
        />

        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <div className="flex items-center gap-2">
            <Waves className="size-4 text-cyan-300" />
            <h3 className="heading-condensed text-xl text-foreground">
              {copy(language, "Volatilite Notlari", "Volatility Notes")}
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {report.vixRows.length ? (
              report.vixRows.map(row => (
                <article
                  key={row.label}
                  className="rounded-[1.45rem] border border-border bg-background/55 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{row.label}</p>
                    <span className="data-mono text-sm font-semibold text-amber-300">
                      {row.value}
                    </span>
                  </div>
                  {row.comment ? (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {row.comment}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <EmptyPanel
                message={copy(
                  language,
                  "VIX bloklari bu raporda parse edilemedi.",
                  "VIX blocks could not be parsed from this report."
                )}
              />
            )}

            {report.vixCommentary.length ? (
              <div className="rounded-[1.45rem] border border-emerald-500/20 bg-emerald-500/8 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {copy(language, "Editor Notu", "Editor Note")}
                </p>
                <div className="mt-2 space-y-2 text-sm leading-7 text-foreground/90">
                  {report.vixCommentary.map(line => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </section>

      <DataTable
        eyebrow={copy(language, "Sektorler", "Sectors")}
        title={copy(language, "Sektor dagilimi", "Sector distribution")}
        headers={[
          copy(language, "Sektor", "Sector"),
          copy(language, "Gunluk", "Daily"),
          copy(language, "Haftalik", "Weekly"),
          copy(language, "Yorum", "Comment"),
        ]}
        rows={formatSectorRows(report.sectorRows)}
      />

      <section className="grid gap-6 xl:grid-cols-3">
        <MoversStack
          title={copy(language, "Guclu Yukselenler", "Strong Gainers")}
          rows={report.gainerRows}
          positive
          language={language}
        />
        <MoversStack
          title={copy(language, "Zayiflayanlar", "Weakening Names")}
          rows={report.loserRows}
          positive={false}
          language={language}
        />
        <HavenStack rows={report.havenRows} language={language} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <MacroStack title={copy(language, "Makro Takvim", "Macro Calendar")} rows={report.rateRows} language={language} />
        <MacroStack title={copy(language, "Buyume / Veri", "Growth / Data")} rows={report.growthRows} language={language} />
        <MacroStack title={copy(language, "Risk / Outlook", "Risk / Outlook")} rows={report.forecastRows} language={language} />
      </section>
    </div>
  );
}
