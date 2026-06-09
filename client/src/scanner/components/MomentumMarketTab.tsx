import {
  Activity,
  CandlestickChart,
  ShieldAlert,
  Waves,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, XAxis, YAxis } from "recharts";
import type {
  MacroRow,
  MomentumHavenRow,
  MomentumMoverRow,
  MomentumReportSource,
} from "@/lib/momentumReportSource";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { copy } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";

function DataCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-none border border-border bg-background/60 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 data-mono text-xl font-bold text-foreground">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function MacroTable({ title, rows }: { title: string; rows: MacroRow[] }) {
  return (
    <section className="rounded-[1.5rem] border border-border bg-card/80 p-5 shadow-xl">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-emerald-400" />
        <h3 className="heading-condensed text-lg text-foreground">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map(row => (
          <div
            key={`${title}-${row.metric}`}
            className="rounded-none border border-border bg-background/50 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">{row.metric}</p>
              <span className="data-mono text-sm font-bold text-emerald-300">
                {row.value}
              </span>
            </div>
            {row.comment ? (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {row.comment}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function MoversCard({
  title,
  icon: Icon,
  rows,
  accentClassName,
}: {
  title: string;
  icon: typeof CandlestickChart;
  rows: MomentumMoverRow[];
  accentClassName: string;
}) {
  return (
    <section className="rounded-[1.5rem] border border-border bg-card/80 p-5 shadow-xl">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accentClassName}`} />
        <h3 className="heading-condensed text-lg text-foreground">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map(row => (
          <article
            key={`${title}-${row.ticker}-${row.name}`}
            className="rounded-none border border-border bg-background/50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {row.name}
                  {row.ticker ? ` · ${row.ticker}` : ""}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {row.catalyst}
                </p>
              </div>
              <span className="data-mono text-base font-bold text-foreground">
                {row.moveLabel}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HavensCard({ title, rows }: { title: string; rows: MomentumHavenRow[] }) {
  return (
    <section className="rounded-[1.5rem] border border-border bg-card/80 p-5 shadow-xl">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-amber-400" />
        <h3 className="heading-condensed text-lg text-foreground">
          {title}
        </h3>
      </div>
      <div className="mt-4 grid gap-3">
        {rows.map(row => (
          <article
            key={row.symbol}
            className="rounded-none border border-border bg-background/50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{row.symbol}</p>
                <p className="mt-1 text-xs text-muted-foreground">{row.role}</p>
              </div>
              <span
                className={`data-mono text-base font-bold ${
                  (row.performance || 0) >= 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {row.performanceLabel}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function MomentumMarketTab({
  report,
  language,
}: {
  report: MomentumReportSource;
  language: AppLanguage;
}) {
  const indexChartData = report.indexRows.map(row => ({
    subject: row.index,
    move: row.pctChange || 0,
    label: row.pctChangeLabel,
    comment: row.comment,
  }));

  const sectorChartData = report.sectorRows.map(row => ({
    subject: row.sector,
    move: row.dayChange || 0,
    label: row.dayChangeLabel,
    weekly: row.weeklyLabel,
    comment: row.comment,
  }));

  const vixClose = report.vixRows.find(row => /vix kapanis/i.test(row.label));
  const vixChange = report.vixRows.find(row => /gunluk degisim/i.test(row.label));
  const weeklyVix = report.vixRows.find(row => /1-haftalik/i.test(row.label));
  const monthlyVix = report.vixRows.find(row => /1-aylik/i.test(row.label));

  return (
    <div className="space-y-6 px-6 pb-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <CandlestickChart className="h-4 w-4 text-emerald-400" />
            <p className="heading-condensed text-lg text-foreground">
              {copy(language, "Ana Endeks Darbesi", "Main Index Pulse")}
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {copy(
              language,
              "Seansin sertligini once endeks seviyesinde oku. Bar yapisi gunluk hasari, tooltip ise yorum katmanini tasiyor.",
              "Read the session's strength first at the index level. Bar structure shows daily damage, tooltip carries the commentary layer."
            )}
          </p>
          <div className="mt-5">
            <ChartContainer
              className="h-[320px] w-full"
              config={{
                move: { label: copy(language, "Degisim", "Change"), color: "oklch(0.78 0.18 160)" },
              }}
            >
              <BarChart data={indexChartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="subject"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  height={58}
                  angle={-18}
                  textAnchor="end"
                />
                <YAxis tickLine={false} axisLine={false} width={48} />
                <ReferenceLine y={0} stroke="rgba(148,163,184,0.35)" />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(_value, _name, item) => (
                        <div className="grid gap-1.5">
                          <span className="font-medium text-foreground">
                            {String(item.payload.subject)}
                          </span>
                          <span className="text-muted-foreground">
                            {String(item.payload.label)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {String(item.payload.comment)}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="move" radius={[0, 0, 0, 0]}>
                  {indexChartData.map(row => (
                    <Cell
                      key={row.subject}
                      fill={row.move >= 0 ? "oklch(0.78 0.18 160)" : "oklch(0.63 0.22 25)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </article>

        <div className="grid gap-4">
          <DataCard
            label={copy(language, "VIX Kapanis", "VIX Close")}
            value={vixClose?.value || report.vixRows[0]?.value || "-"}
            note={vixClose?.comment || report.vixCommentary[0] || copy(language, "Volatilite rejimi secili rapordan okunuyor.", "Volatility regime read from selected report.")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <DataCard
              label={copy(language, "Gunluk VIX", "Daily VIX")}
              value={vixChange?.value || "-"}
              note={vixChange?.comment || copy(language, "Kisa vadeli korku ivmesi", "Short-term fear momentum")}
            />
            <DataCard
              label={copy(language, "1 Haftalik", "1 Week")}
              value={weeklyVix?.value || "-"}
              note={weeklyVix?.comment || copy(language, "Haftalik trend", "Weekly trend")}
            />
            <DataCard
              label={copy(language, "1 Aylik", "1 Month")}
              value={monthlyVix?.value || "-"}
              note={monthlyVix?.comment || copy(language, "Aylik denge", "Monthly balance")}
            />
            <DataCard
              label={copy(language, "Okuma Suresi", "Reading Time")}
              value={report.readingTimeLabel || "-"}
              note={copy(language, "Report executive summary icindeki tahmini sure", "Estimated time within report executive summary")}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-cyan-400" />
            <p className="heading-condensed text-lg text-foreground">
              {copy(language, "Sektor Dagilimi", "Sector Distribution")}
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {copy(
              language,
              "Teknoloji darbesi ile defensive rotasyon ayni tabloda okunuyor. Bar gunluk hareketi, sag panel ise sektor bazli yorumu tasiyor.",
              "Tech hit and defensive rotation read in the same table. Bar shows daily move, right panel carries sector-based commentary."
            )}
          </p>
          <div className="mt-5">
            <ChartContainer
              className="h-[340px] w-full"
              config={{
                move: { label: copy(language, "Gunluk performans", "Daily performance"), color: "oklch(0.75 0.15 75)" },
              }}
            >
              <BarChart data={sectorChartData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="subject"
                  tickLine={false}
                  axisLine={false}
                  width={116}
                />
                <ReferenceLine x={0} stroke="rgba(148,163,184,0.35)" />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(_value, _name, item) => (
                        <div className="grid gap-1.5">
                          <span className="font-medium text-foreground">
                            {String(item.payload.subject)}
                          </span>
                          <span className="text-muted-foreground">
                            {copy(language, "Gunluk", "Daily")}: {String(item.payload.label)}
                          </span>
                          <span className="text-muted-foreground">
                            {copy(language, "Haftalik", "Weekly")}: {String(item.payload.weekly)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {String(item.payload.comment)}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="move" radius={[0, 0, 0, 0]}>
                  {sectorChartData.map(row => (
                    <Cell
                      key={row.subject}
                      fill={row.move >= 0 ? "oklch(0.78 0.18 160)" : "oklch(0.63 0.22 25)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </article>

        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <p className="heading-condensed text-lg text-foreground">
              {copy(language, "VIX Yorumu", "VIX Commentary")}
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {report.vixCommentary.length ? (
              report.vixCommentary.map(line => (
                <div
                  key={line}
                  className="rounded-none border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                >
                  {line}
                </div>
              ))
            ) : (
              <div className="rounded-none border border-border bg-background/50 px-4 py-3 text-sm text-muted-foreground">
                {copy(language, "Bu raporda ek VIX yorumu bulunmuyor.", "No additional VIX commentary in this report.")}
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <MoversCard
          title={copy(language, "En Cok Dusenler", "Biggest Losers")}
          icon={CandlestickChart}
          rows={report.loserRows}
          accentClassName="text-rose-400"
        />
        <MoversCard
          title={copy(language, "En Cok Yukselenler", "Biggest Gainers")}
          icon={Activity}
          rows={report.gainerRows}
          accentClassName="text-emerald-400"
        />
        <HavensCard
          title={copy(language, "Guvenli Liman Akisi", "Safe Haven Flow")}
          rows={report.havenRows}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <MacroTable title={copy(language, "Faiz Politikasi", "Interest Policy")} rows={report.rateRows} />
        <MacroTable title={copy(language, "Buyume Resmi", "Growth Picture")} rows={report.growthRows} />
        <MacroTable title={copy(language, "Street Tahminleri", "Street Forecasts")} rows={report.forecastRows} />
      </section>
    </div>
  );
}
