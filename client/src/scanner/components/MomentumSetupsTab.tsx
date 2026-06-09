import { CalendarClock, Gauge, Radar, TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, XAxis, YAxis } from "recharts";
import type {
  MomentumCandidateGroup,
  MomentumCandidateRow,
  MomentumReportSource,
} from "@/lib/momentumReportSource";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { copy } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";

function groupLabel(group: MomentumCandidateGroup, language: AppLanguage) {
  if (group === "upside") {
    return copy(language, "Oversold Donus", "Oversold Reversal");
  }

  if (group === "downside") {
    return copy(language, "Asagi Momentum", "Downside Momentum");
  }

  return "Defensive";
}

function groupColor(group: MomentumCandidateGroup) {
  if (group === "upside") {
    return "oklch(0.78 0.18 160)";
  }

  if (group === "downside") {
    return "oklch(0.63 0.22 25)";
  }

  return "oklch(0.75 0.15 75)";
}

function CandidateCard({ row, language }: { row: MomentumCandidateRow; language: AppLanguage }) {
  return (
    <article className="rounded-none border border-border bg-background/55 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {row.name}
            {row.ticker && row.ticker !== row.name ? ` · ${row.ticker}` : ""}
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {groupLabel(row.group, language)}
          </p>
        </div>
        <span className="data-mono text-lg font-bold text-foreground">
          {row.scoreLabel}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {copy(language, "Tez", "Thesis")}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{row.reason}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Risk
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {row.risk}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function MomentumSetupsTab({
  report,
  language,
}: {
  report: MomentumReportSource;
  language: AppLanguage;
}) {
  const candidateChartData = report.candidates.map(row => ({
    subject: row.ticker || row.name,
    label: row.name,
    score: row.score || 0,
    group: groupLabel(row.group, language),
    reason: row.reason,
    risk: row.risk,
    rawGroup: row.group,
  }));

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
      <section className="grid gap-4 xl:grid-cols-4">
        <div className="rounded-none border border-emerald-400/20 bg-emerald-500/5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {copy(language, "Piyasa Rejimi", "Market Regime")}
          </p>
          <p className="mt-2 heading-condensed text-2xl text-foreground">
            {report.regimeLabel}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {copy(language, "Setup okumasinin tumu bu rejim taniminin ustune kurulu.", "All setup reading is built on top of this regime definition.")}
          </p>
        </div>
        <div className="rounded-none border border-border bg-card/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {copy(language, "Yukari Setup", "Bullish Setup")}
          </p>
          <p className="mt-2 data-mono text-2xl font-bold text-emerald-300">
            {bullishCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{copy(language, "Oversold donus listesi", "Oversold reversal list")}</p>
        </div>
        <div className="rounded-none border border-border bg-card/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {copy(language, "Asagi Setup", "Bearish Setup")}
          </p>
          <p className="mt-2 data-mono text-2xl font-bold text-rose-300">
            {bearishCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{copy(language, "Trend devami adaylari", "Trend continuation candidates")}</p>
        </div>
        <div className="rounded-none border border-border bg-card/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Defensive
          </p>
          <p className="mt-2 data-mono text-2xl font-bold text-amber-300">
            {defensiveCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{copy(language, "Koruyucu rota", "Protective route")}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-emerald-400" />
            <p className="heading-condensed text-lg text-foreground">
              {copy(language, "Momentum Setup Skor Haritasi", "Momentum Setup Score Map")}
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {copy(language, "Tek tabloda yukari donus, asagi devam ve defensive bloklar birlesiyor.", "Bullish reversal, bearish continuation and defensive blocks come together in a single table.")}
          </p>
          <div className="mt-5">
            <ChartContainer
              className="h-[380px] w-full"
              config={{
                score: { label: copy(language, "Momentum skoru", "Momentum score"), color: "oklch(0.78 0.18 160)" },
              }}
            >
              <BarChart data={candidateChartData} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="subject"
                  tickLine={false}
                  axisLine={false}
                  width={86}
                />
                <ReferenceLine x={50} stroke="rgba(148,163,184,0.35)" />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(_value, _name, item) => (
                        <div className="grid gap-1.5">
                          <span className="font-medium text-foreground">
                            {String(item.payload.label)}
                          </span>
                          <span className="text-muted-foreground">
                            {String(item.payload.group)} · {String(item.payload.score)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {String(item.payload.reason)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Risk: {String(item.payload.risk)}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="score" radius={[0, 0, 0, 0]}>
                  {candidateChartData.map(row => (
                    <Cell
                      key={`${row.subject}-${row.group}`}
                      fill={groupColor(row.rawGroup)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </article>

        <div className="grid gap-4">
          <div className="rounded-[1.5rem] border border-border bg-card/90 p-5 shadow-xl">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-cyan-400" />
              <h3 className="heading-condensed text-lg text-foreground">{copy(language, "RSI Haritasi", "RSI Map")}</h3>
            </div>
            <div className="mt-4 space-y-3">
              {report.rsiRows.map(row => (
                <div
                  key={row.subject}
                  className="rounded-none border border-border bg-background/55 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{row.subject}</p>
                    <span className="data-mono text-sm font-bold text-foreground">
                      {row.rsiLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {row.status}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-card/90 p-5 shadow-xl">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <h3 className="heading-condensed text-lg text-foreground">
                {copy(language, "RSI Ekstremi", "RSI Extremes")}
              </h3>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-none border border-border bg-background/55 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {copy(language, "En guclu bounce adayi", "Strongest bounce candidate")}
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {weakestRsi?.subject || "-"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {weakestRsi?.status || copy(language, "Veri yok", "No data")}
                </p>
              </div>
              <div className="rounded-none border border-border bg-background/55 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {copy(language, "En sicak bolge", "Hottest zone")}
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {hottestRsi?.subject || "-"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {hottestRsi?.status || copy(language, "Veri yok", "No data")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[1.5rem] border border-border bg-card/90 p-5 shadow-xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="heading-condensed text-lg text-foreground">
              {copy(language, "Oversold Donus", "Oversold Reversal")}
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {report.candidates
              .filter(row => row.group === "upside")
              .map(row => (
                <CandidateCard key={`${row.group}-${row.name}`} row={row} language={language} />
              ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-card/90 p-5 shadow-xl">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-rose-400" />
            <h3 className="heading-condensed text-lg text-foreground">
              {copy(language, "Trend Devami", "Trend Continuation")}
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {report.candidates
              .filter(row => row.group === "downside")
              .map(row => (
                <CandidateCard key={`${row.group}-${row.name}`} row={row} language={language} />
              ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-card/90 p-5 shadow-xl">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-amber-400" />
            <h3 className="heading-condensed text-lg text-foreground">
              {copy(language, "Defensive Basket", "Defensive Basket")}
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {report.candidates
              .filter(row => row.group === "defensive")
              .map(row => (
                <CandidateCard key={`${row.group}-${row.name}`} row={row} language={language} />
              ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-cyan-400" />
            <p className="heading-condensed text-lg text-foreground">
              {copy(language, "8-12 Haziran Takvim Katalizorleri", "Jun 8-12 Calendar Catalysts")}
            </p>
          </div>
          <div className="mt-4 overflow-hidden rounded-none border border-border bg-background/45">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-background/65 text-left text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">{copy(language, "Tarih", "Date")}</th>
                  <th className="px-4 py-3">{copy(language, "Olay", "Event")}</th>
                  <th className="px-4 py-3">{copy(language, "Etki", "Impact")}</th>
                </tr>
              </thead>
              <tbody>
                {report.calendarEvents.map(event => (
                  <tr
                    key={`${event.date}-${event.event}`}
                    className="border-t border-border/70"
                  >
                    <td className="px-4 py-3 text-foreground">{event.date}</td>
                    <td className="px-4 py-3 text-foreground">{event.event}</td>
                    <td className="px-4 py-3 text-muted-foreground">{event.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-amber-400" />
            <p className="heading-condensed text-lg text-foreground">
              {copy(language, "Ek Baskilar", "Additional Pressures")}
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {report.specialCatalysts.length ? (
              report.specialCatalysts.map(line => (
                <div
                  key={line}
                  className="rounded-none border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                >
                  {line}
                </div>
              ))
            ) : (
              <div className="rounded-none border border-border bg-background/55 px-4 py-3 text-sm text-muted-foreground">
                {copy(language, "Bu raporda ek katalizor notu bulunmuyor.", "No additional catalyst notes in this report.")}
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
