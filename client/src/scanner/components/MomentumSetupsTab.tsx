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

function groupLabel(group: MomentumCandidateGroup) {
  if (group === "upside") {
    return "Oversold Donus";
  }

  if (group === "downside") {
    return "Asagi Momentum";
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

function CandidateCard({ row }: { row: MomentumCandidateRow }) {
  return (
    <article className="rounded-none border border-border bg-background/55 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {row.name}
            {row.ticker && row.ticker !== row.name ? ` · ${row.ticker}` : ""}
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {groupLabel(row.group)}
          </p>
        </div>
        <span className="data-mono text-lg font-bold text-foreground">
          {row.scoreLabel}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Tez
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
}: {
  report: MomentumReportSource;
}) {
  const candidateChartData = report.candidates.map(row => ({
    subject: row.ticker || row.name,
    label: row.name,
    score: row.score || 0,
    group: groupLabel(row.group),
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
            Piyasa Rejimi
          </p>
          <p className="mt-2 heading-condensed text-2xl text-foreground">
            {report.regimeLabel}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Setup okumasinin tumu bu rejim taniminin ustune kurulu.
          </p>
        </div>
        <div className="rounded-none border border-border bg-card/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Yukari Setup
          </p>
          <p className="mt-2 data-mono text-2xl font-bold text-emerald-300">
            {bullishCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Oversold donus listesi</p>
        </div>
        <div className="rounded-none border border-border bg-card/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Asagi Setup
          </p>
          <p className="mt-2 data-mono text-2xl font-bold text-rose-300">
            {bearishCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Trend devami adaylari</p>
        </div>
        <div className="rounded-none border border-border bg-card/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Defensive
          </p>
          <p className="mt-2 data-mono text-2xl font-bold text-amber-300">
            {defensiveCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Koruyucu rota</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-emerald-400" />
            <p className="heading-condensed text-lg text-foreground">
              Momentum Setup Skor Haritasi
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Tek tabloda yukari donus, asagi devam ve defensive bloklar birlesiyor.
          </p>
          <div className="mt-5">
            <ChartContainer
              className="h-[380px] w-full"
              config={{
                score: { label: "Momentum skoru", color: "oklch(0.78 0.18 160)" },
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
              <h3 className="heading-condensed text-lg text-foreground">RSI Haritasi</h3>
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
                RSI Ekstremi
              </h3>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-none border border-border bg-background/55 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  En guclu bounce adayi
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {weakestRsi?.subject || "-"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {weakestRsi?.status || "Veri yok"}
                </p>
              </div>
              <div className="rounded-none border border-border bg-background/55 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  En sicak bolge
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {hottestRsi?.subject || "-"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {hottestRsi?.status || "Veri yok"}
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
              Oversold Donus
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {report.candidates
              .filter(row => row.group === "upside")
              .map(row => (
                <CandidateCard key={`${row.group}-${row.name}`} row={row} />
              ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-card/90 p-5 shadow-xl">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-rose-400" />
            <h3 className="heading-condensed text-lg text-foreground">
              Trend Devami
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {report.candidates
              .filter(row => row.group === "downside")
              .map(row => (
                <CandidateCard key={`${row.group}-${row.name}`} row={row} />
              ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-card/90 p-5 shadow-xl">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-amber-400" />
            <h3 className="heading-condensed text-lg text-foreground">
              Defensive Basket
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {report.candidates
              .filter(row => row.group === "defensive")
              .map(row => (
                <CandidateCard key={`${row.group}-${row.name}`} row={row} />
              ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
        <article className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-cyan-400" />
            <p className="heading-condensed text-lg text-foreground">
              8-12 Haziran Takvim Katalizorleri
            </p>
          </div>
          <div className="mt-4 overflow-hidden rounded-none border border-border bg-background/45">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-background/65 text-left text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3">Olay</th>
                  <th className="px-4 py-3">Etki</th>
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
              Ek Baskilar
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
                Bu raporda ek katalizor notu bulunmuyor.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
