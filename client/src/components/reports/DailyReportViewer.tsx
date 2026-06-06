import type { ReactNode } from "react";
import type { DailyReportContent } from "@shared/dailyReports";
import {
  Activity,
  BookOpen,
  GalleryHorizontal,
  Layers3,
  ShieldAlert,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  buildDailyReportInsights,
  type MarkdownBlock,
} from "@/lib/dailyReportInsights";
import { getDailyReportAssetUrl } from "@/lib/dailyReports";

interface DailyReportViewerProps {
  title: string;
  reportDate: string;
  sourceFolder: string;
  content: DailyReportContent;
}

function formatReportDate(reportDate: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${reportDate}T00:00:00Z`));
}

function formatCompactNumber(value: number) {
  if (value >= 1000) {
    return new Intl.NumberFormat("tr-TR", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

function normalizeRelativeAssetPath(value: string) {
  return value.replace(/^\.\/+/, "").trim();
}

function resolveAssetSrc(assetBasePath: string | undefined, src: string) {
  const normalized = normalizeRelativeAssetPath(src);
  if (/^(https?:)?\/\//i.test(normalized) || normalized.startsWith("data:")) {
    return normalized;
  }

  return getDailyReportAssetUrl(assetBasePath, normalized);
}

function slugifyFragment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function renderMarkdownTable(block: Extract<MarkdownBlock, { type: "table" }>, key: string) {
  return (
    <div
      key={key}
      className="overflow-hidden rounded-[1.75rem] border border-border bg-background/55"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.03]">
            <tr>
              {block.headers.map(header => (
                <th
                  key={`${key}-${header}`}
                  className="border-b border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr
                key={`${key}-${rowIndex}`}
                className="border-b border-border/60 last:border-b-0"
              >
                {block.headers.map((_, cellIndex) => (
                  <td
                    key={`${key}-${rowIndex}-${cellIndex}`}
                    className="px-4 py-3 align-top text-sm leading-relaxed text-foreground/90"
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

function InfoCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
          {hint ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl ${className}`.trim()}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function DailyReportViewer({
  title,
  reportDate,
  sourceFolder,
  content,
}: DailyReportViewerProps) {
  const insights = buildDailyReportInsights(content);
  const assetBasePath = content.assetBasePath || sourceFolder;
  const statCards = [
    {
      label: "Sections",
      value: String(insights.sectionTitles.length || 0),
      hint: "Ana bolum sayisi",
      icon: <Layers3 className="size-4" />,
    },
    {
      label: "Tickers",
      value: formatCompactNumber(content.tickerUniverse.length),
      hint: "Izlenen sembol sayisi",
      icon: <Target className="size-4" />,
    },
    {
      label: "Figures",
      value: formatCompactNumber(content.figureFiles.length),
      hint: "Kaynakta bulunan grafik/gorsel",
      icon: <GalleryHorizontal className="size-4" />,
    },
    {
      label: "Research",
      value: formatCompactNumber(content.researchFileCount),
      hint: "Destekleyici dosya adedi",
      icon: <BookOpen className="size-4" />,
    },
  ];
  const sectionAnchors = new Map<number, string>();
  const sectionLinks: Array<{ id: string; label: string }> = [];

  insights.blocks.forEach((block, index) => {
    if (block.type === "heading" && block.level === 2) {
      const id = `daily-section-${index}-${slugifyFragment(block.text)}`;
      sectionAnchors.set(index, id);
      sectionLinks.push({ id, label: block.text });
    }
  });

  const heroFigure = insights.figureCards[0] || null;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-border bg-card/95 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_28%)]" />
        <div className="absolute inset-0 tactical-grid opacity-20" />

        <div className="relative grid gap-6 p-6 lg:grid-cols-[minmax(0,1.4fr)_380px]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Daily Report
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {content.sourceKind === "file" ? "Live markdown feed" : "Research package"}
              </span>
              {content.sourceLabel ? (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {content.sourceLabel}
                </span>
              ) : null}
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {title}
              </h2>
              <p className="max-w-4xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                {content.headline}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map(card => (
                <InfoCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                  hint={card.hint}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {heroFigure ? (
              <figure className="overflow-hidden rounded-[2rem] border border-white/10 bg-background/65 backdrop-blur-sm">
                <img
                  src={getDailyReportAssetUrl(assetBasePath, heroFigure.fileName)}
                  alt={heroFigure.label}
                  className="h-[230px] w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="border-t border-white/10 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Briefing Figure
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{heroFigure.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{heroFigure.fileName}</p>
                </figcaption>
              </figure>
            ) : null}

            <div className="rounded-[2rem] border border-white/10 bg-background/65 p-5 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Rapor tarihi
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {formatReportDate(reportDate)}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Signal map
                </div>
              </div>

              {insights.macroSignals.length ? (
                <div className="mt-5 space-y-3">
                  {insights.macroSignals.map(signal => (
                    <div
                      key={`${signal.label}-${signal.value}`}
                      className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            {signal.label}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-foreground">
                            {signal.value}
                          </p>
                        </div>
                        {signal.status ? (
                          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {signal.status}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4 text-sm leading-relaxed text-muted-foreground">
                  Bu raporda ayrik makro rejim tablosu bulunmuyor. Yine de asagidaki dashboard,
                  markdown tablolarindan otomatik olarak okunabilen sinyalleri ozetliyor.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {insights.keyThemes.length ? (
        <Panel eyebrow="Key Themes" title="Raporun merkezindeki ana fikirler">
          <div className="grid gap-3 lg:grid-cols-2">
            {insights.keyThemes.map((theme, index) => (
              <article
                key={`${index}-${theme.slice(0, 30)}`}
                className="rounded-[1.6rem] border border-border bg-background/55 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-7 text-foreground/90">{theme}</p>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      ) : null}

      {sectionLinks.length ? (
        <Panel eyebrow="Report Map" title="Bolumler arasi hizli gecis">
          <div className="flex flex-wrap gap-2">
            {sectionLinks.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-white/10 bg-background/55 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-emerald-400/35 hover:text-emerald-300"
              >
                {section.label}
              </a>
            ))}
          </div>
        </Panel>
      ) : null}

      {insights.figureCards.length ? (
        <Panel eyebrow="Figure Deck" title="Kaynak gorseller ve grafik seti">
          <div className="grid gap-4 lg:grid-cols-2">
            {insights.figureCards.map((figure, index) => (
              <figure
                key={figure.fileName}
                className={`overflow-hidden rounded-[1.8rem] border border-border bg-background/55 ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <img
                  src={getDailyReportAssetUrl(assetBasePath, figure.fileName)}
                  alt={figure.label}
                  className={`w-full object-cover ${index === 0 ? "max-h-[440px]" : "max-h-[320px]"}`}
                  loading="lazy"
                />
                <figcaption className="border-t border-border px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">{figure.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{figure.fileName}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Panel>
      ) : null}

      {(insights.marketPerformance.length ||
        insights.sectorStrength.length ||
        insights.momentumLeaders.length ||
        insights.breadthStats.length ||
        insights.signalRadar.length) ? (
        <section className="grid gap-6 xl:grid-cols-2">
          {insights.marketPerformance.length ? (
            <Panel eyebrow="Market Pulse" title="Ana endeks hareketleri">
              <ChartContainer
                className="h-[290px] w-full"
                config={{
                  change: {
                    label: "Degisim",
                    color: "oklch(0.78 0.18 160)",
                  },
                }}
              >
                <BarChart data={insights.marketPerformance}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={value => `${value}%`} tickLine={false} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={value => (
                          <span className="font-mono text-foreground">{value}%</span>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="change" radius={[6, 6, 0, 0]}>
                    {insights.marketPerformance.map(entry => (
                      <Cell
                        key={entry.label}
                        fill={
                          entry.change >= 0
                            ? "oklch(0.78 0.18 160)"
                            : "oklch(0.65 0.22 25)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </Panel>
          ) : null}

          {insights.sectorStrength.length ? (
            <Panel eyebrow="Sector Map" title="Sektor liderligi">
              <ChartContainer
                className="h-[290px] w-full"
                config={{
                  score: {
                    label: "Skor",
                    color: "oklch(0.75 0.15 75)",
                  },
                }}
              >
                <BarChart data={insights.sectorStrength} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="label"
                    type="category"
                    width={110}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="score" fill="var(--color-score)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ChartContainer>
            </Panel>
          ) : null}

          {insights.breadthStats.length ? (
            <Panel eyebrow="Breadth Split" title="Genislik dengesi">
              <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                <ChartContainer
                  className="mx-auto h-[240px] max-w-[260px]"
                  config={{
                    positive: { label: "Pozitif", color: "oklch(0.78 0.18 160)" },
                    negative: { label: "Negatif", color: "oklch(0.65 0.22 25)" },
                    neutral: { label: "Notr", color: "oklch(0.75 0.15 75)" },
                  }}
                >
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={insights.breadthStats}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={55}
                      outerRadius={82}
                      paddingAngle={3}
                    >
                      {insights.breadthStats.map(entry => (
                        <Cell
                          key={entry.label}
                          fill={
                            entry.tone === "positive"
                              ? "oklch(0.78 0.18 160)"
                              : entry.tone === "negative"
                                ? "oklch(0.65 0.22 25)"
                                : "oklch(0.75 0.15 75)"
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                <div className="grid gap-3">
                  {insights.breadthStats.map(stat => (
                    <div
                      key={stat.label}
                      className="rounded-[1.4rem] border border-border bg-background/55 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                        <span className="data-mono text-sm text-muted-foreground">
                          {formatCompactNumber(stat.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          ) : null}

          {insights.signalRadar.length ? (
            <Panel eyebrow="Signal Density" title="Rapor yogunluk haritasi">
              <ChartContainer
                className="h-[290px] w-full"
                config={{
                  value: {
                    label: "Signal",
                    color: "oklch(0.60 0.12 250)",
                  },
                }}
              >
                <RadarChart data={insights.signalRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="label" />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Radar
                    dataKey="value"
                    fill="var(--color-value)"
                    fillOpacity={0.28}
                    stroke="var(--color-value)"
                  />
                </RadarChart>
              </ChartContainer>
            </Panel>
          ) : null}

          {insights.momentumLeaders.length ? (
            <Panel eyebrow="Leaders" title="En guclu momentum isimleri" className="xl:col-span-2">
              <ChartContainer
                className="h-[340px] w-full"
                config={{
                  change: {
                    label: "Gunluk %",
                    color: "oklch(0.78 0.18 160)",
                  },
                }}
              >
                <BarChart data={insights.momentumLeaders} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" tickFormatter={value => `${value}%`} tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="ticker"
                    type="category"
                    width={70}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(_value, _name, item) => {
                          const payload = item?.payload as
                            | { ticker?: string; company?: string; change?: number; sector?: string }
                            | undefined;
                          return (
                            <div className="space-y-1">
                              <p className="font-semibold text-foreground">
                                {payload?.ticker} {payload?.company ? `· ${payload.company}` : ""}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {payload?.sector || "-"}
                              </p>
                              <p className="font-mono text-foreground">
                                {payload?.change?.toFixed(2)}%
                              </p>
                            </div>
                          );
                        }}
                      />
                    }
                  />
                  <Bar dataKey="change" fill="var(--color-change)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ChartContainer>
            </Panel>
          ) : null}
        </section>
      ) : null}

      <Panel eyebrow="Full Report" title="Tam rapor akisi">
        <div className="space-y-4">
          {insights.blocks.map((block, index) => {
            if (block.type === "heading") {
              const className =
                block.level === 1
                  ? "pt-4 text-2xl font-semibold text-foreground md:text-3xl"
                  : block.level === 2
                    ? "pt-4 text-xl font-semibold text-foreground"
                    : "pt-3 text-lg font-semibold text-foreground";

              return (
                <h4
                  key={`${block.type}-${index}`}
                  id={sectionAnchors.get(index)}
                  className={`${className} scroll-mt-24`}
                >
                  {block.text}
                </h4>
              );
            }

            if (block.type === "paragraph") {
              return (
                <p
                  key={`${block.type}-${index}`}
                  className="text-sm leading-8 text-muted-foreground md:text-[15px]"
                >
                  {block.text}
                </p>
              );
            }

            if (block.type === "list") {
              const ListTag = block.ordered ? "ol" : "ul";
              return (
                <ListTag
                  key={`${block.type}-${index}`}
                  className={`space-y-2 pl-5 text-sm leading-7 text-muted-foreground ${
                    block.ordered ? "list-decimal" : "list-disc"
                  }`}
                >
                  {block.items.map(item => (
                    <li key={`${index}-${item.slice(0, 30)}`}>{item}</li>
                  ))}
                </ListTag>
              );
            }

            if (block.type === "table") {
              return renderMarkdownTable(block, `${block.type}-${index}`);
            }

            if (block.type === "image") {
              return (
                <figure
                  key={`${block.type}-${index}`}
                  className="overflow-hidden rounded-[1.75rem] border border-border bg-background/55"
                >
                  <img
                    src={resolveAssetSrc(assetBasePath, block.src)}
                    alt={block.alt || "Report figure"}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  {block.alt ? (
                    <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                      {block.alt}
                    </figcaption>
                  ) : null}
                </figure>
              );
            }

            return null;
          })}
        </div>
      </Panel>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.7rem] border border-border bg-card/90 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Coverage
              </p>
              <p className="mt-1 text-sm text-foreground">
                {content.coverage || "Kaynakta acik kapsama notu yok"}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[1.7rem] border border-border bg-card/90 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300">
              <Activity className="size-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Method
              </p>
              <p className="mt-1 text-sm text-foreground">
                {content.methodology || "Metodoloji notu belirtilmemis"}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[1.7rem] border border-border bg-card/90 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-2 text-red-300">
              <ShieldAlert className="size-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Source
              </p>
              <p className="mt-1 text-sm text-foreground">
                {content.sourceLabel || sourceFolder || "Daily report source"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
