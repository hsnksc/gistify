import { useEffect, useState, type ReactNode } from "react";
import type { DailyReportContent } from "@shared/dailyReports";
import {
  Activity,
  BookOpen,
  GalleryHorizontal,
  Layers3,
  ShieldAlert,
  Target,
  TrendingUp,
  X,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  buildDailyReportInsights,
  type MarkdownBlock,
} from "@/lib/dailyReportInsights";
import { getDailyReportAssetUrl } from "@/lib/dailyReports";
import type { AppLanguage } from "@/lib/i18n";

interface DailyReportViewerProps {
  language?: AppLanguage;
  title: string;
  reportDate: string;
  updatedAt?: string;
  sourceFolder: string;
  content: DailyReportContent;
}

function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
}

function formatReportDate(reportDate: string, locale = "tr-TR") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${reportDate}T00:00:00Z`));
}

function formatCompactNumber(value: number, locale = "tr-TR") {
  if (value >= 1000) {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

function formatUpdateStamp(value: string, locale = "tr-TR") {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function normalizeRelativeAssetPath(value: string) {
  return value.replace(/^\.\/+/, "").trim();
}

function buildOpenAiFigureFileName(fileName: string) {
  const normalized = normalizeRelativeAssetPath(fileName);
  const match = normalized.match(/^(.*?)(\.[a-z0-9]+)$/i);
  if (!match) {
    return normalized ? `${normalized}.openai.png` : "";
  }

  return `${match[1].replace(/\.openai$/i, "")}.openai.png`;
}

function resolvePreferredFigureFileName(
  fileName: string,
  openAiFigureFiles: string[]
) {
  const normalized = normalizeRelativeAssetPath(fileName);
  const openAiVariant = buildOpenAiFigureFileName(normalized);
  if (openAiVariant && openAiFigureFiles.includes(openAiVariant)) {
    return {
      fileName: openAiVariant,
      aiEnhanced: true,
    };
  }

  return {
    fileName: normalized,
    aiEnhanced: false,
  };
}

function resolveAssetSrc(
  assetBasePath: string | undefined,
  src: string,
  openAiFigureFiles: string[]
) {
  const normalized = normalizeRelativeAssetPath(src);
  if (/^(https?:)?\/\//i.test(normalized) || normalized.startsWith("data:")) {
    return {
      src: normalized,
      aiEnhanced: false,
    };
  }

  const preferred = resolvePreferredFigureFileName(normalized, openAiFigureFiles);
  return {
    src: getDailyReportAssetUrl(assetBasePath, preferred.fileName),
    aiEnhanced: preferred.aiEnhanced,
  };
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
      <div className="flex min-h-[132px] flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
          </div>
          <div className="shrink-0 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
            {icon}
          </div>
        </div>
        {hint ? (
          <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

function EmptyReportCallout({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.6rem] border border-dashed border-border bg-background/40 p-5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{body}</p>
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

interface ReportFigure {
  fileName: string;
  label: string;
  src: string;
  aiEnhanced: boolean;
}

function FigureCard({
  language,
  figure,
  variant = "deck",
  onOpen,
}: {
  language: AppLanguage;
  figure: ReportFigure;
  variant?: "hero" | "deck" | "inline";
  onOpen: (figure: ReportFigure) => void;
}) {
  const mediaHeight =
    variant === "hero"
      ? "min-h-[320px] md:min-h-[380px]"
      : variant === "inline"
        ? "min-h-[280px] md:min-h-[360px]"
        : "min-h-[240px] md:min-h-[300px]";

  return (
    <figure className="group overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#07161d]/92 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{figure.label}</p>
          <p className="mt-1 truncate text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {figure.fileName}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpen(figure)}
          className="shrink-0 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300 transition-colors hover:border-emerald-300/45 hover:bg-emerald-500/16"
        >
          {copy(language, "Tam boyut", "Full size")}
        </button>
      </div>

      <button
        type="button"
        onClick={() => onOpen(figure)}
        className="block w-full text-left"
      >
        <div
          className={`relative overflow-hidden bg-[linear-gradient(180deg,rgba(10,23,32,0.96),rgba(5,14,20,1))] ${mediaHeight}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_38%),linear-gradient(180deg,transparent,rgba(6,19,27,0.48))]" />
          <div className="absolute inset-0 tactical-grid opacity-[0.16]" />
          <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-sm">
              {variant === "hero"
                ? copy(language, "One cikan grafik", "Featured chart")
                : variant === "inline"
                  ? copy(language, "Satir ici gorsel", "Inline visual")
                  : copy(language, "Grafik paneli", "Chart panel")}
            </span>
            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-sm">
              {copy(language, "Buyutmek icin tikla", "Tap to zoom")}
            </span>
          </div>
          <div className="relative flex h-full items-center justify-center p-4 md:p-6">
            <img
              src={figure.src}
              alt={figure.label}
              className="max-h-full w-full rounded-[1.25rem] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.38)] transition-transform duration-300 group-hover:scale-[1.01]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </button>

      <figcaption className="border-t border-white/10 px-4 py-3">
        <p className="text-sm leading-6 text-foreground/90">
          {figure.aiEnhanced
            ? copy(
                language,
                "OpenAI tarafindan yeniden uretilmis gorsel varyanti gosteriliyor; kaynak veri daily report paketindeki orijinal chart'a dayanir.",
                "The OpenAI-regenerated visual variant is shown here; the underlying data still comes from the original chart in the daily report package."
              )
            : copy(
                language,
                "Grafik kaynagi orijinal haliyle korunur; burada yalnizca okunabilir bir panel sunumu uygulanir.",
                "The chart source is kept in its original form; only a cleaner panel presentation is applied here."
              )}
        </p>
      </figcaption>
    </figure>
  );
}

export default function DailyReportViewer({
  language = "tr",
  title,
  reportDate,
  updatedAt = "",
  sourceFolder,
  content,
}: DailyReportViewerProps) {
  const [activeFigure, setActiveFigure] = useState<ReportFigure | null>(null);
  const locale = language === "en" ? "en-US" : "tr-TR";

  useEffect(() => {
    setActiveFigure(null);
  }, [title, reportDate, sourceFolder]);

  const normalizedContent = {
    ...content,
    markdown: typeof content.markdown === "string" ? content.markdown : "",
    executiveSummary: Array.isArray(content.executiveSummary)
      ? content.executiveSummary.filter((item): item is string => typeof item === "string")
      : [],
    figureFiles: Array.isArray(content.figureFiles)
      ? content.figureFiles.filter((item): item is string => typeof item === "string")
      : [],
    openAiFigureFiles: Array.isArray(content.openAiFigureFiles)
      ? content.openAiFigureFiles.filter((item): item is string => typeof item === "string")
      : [],
    metadataItems: Array.isArray(content.metadataItems)
      ? content.metadataItems.filter(
          (item): item is { label: string; value: string } =>
            Boolean(item) &&
            typeof item.label === "string" &&
            typeof item.value === "string" &&
            item.label.trim().length > 0 &&
            item.value.trim().length > 0
        )
      : [],
    tickerUniverse: Array.isArray(content.tickerUniverse)
      ? content.tickerUniverse.filter((item): item is string => typeof item === "string")
      : [],
    researchFileCount:
      typeof content.researchFileCount === "number" &&
      Number.isFinite(content.researchFileCount)
        ? content.researchFileCount
        : 0,
  } satisfies DailyReportContent;
  const insights = buildDailyReportInsights(normalizedContent);
  const assetBasePath = normalizedContent.assetBasePath || sourceFolder;
  const openAiFigureFiles = normalizedContent.openAiFigureFiles;
  const metadataHighlights = normalizedContent.metadataItems.slice(0, 6);
  const resolvedFigures = insights.figureCards.map(figure => {
    const preferred = resolvePreferredFigureFileName(
      figure.fileName,
      openAiFigureFiles
    );

    return {
      ...figure,
      src: getDailyReportAssetUrl(assetBasePath, preferred.fileName),
      aiEnhanced: preferred.aiEnhanced,
    };
  });
  const statCards = [
    {
      label: copy(language, "Bolumler", "Sections"),
      value: String(insights.sectionTitles.length || 0),
      hint: copy(language, "Ana bolum sayisi", "Primary section count"),
      icon: <Layers3 className="size-4" />,
    },
    {
      label: copy(language, "Tickerlar", "Tickers"),
      value: formatCompactNumber(normalizedContent.tickerUniverse.length, locale),
      hint: copy(language, "Izlenen sembol sayisi", "Tracked symbol count"),
      icon: <Target className="size-4" />,
    },
    {
      label: copy(language, "Grafikler", "Figures"),
      value: formatCompactNumber(normalizedContent.figureFiles.length, locale),
      hint: copy(language, "Kaynakta bulunan grafik/gorsel", "Charts and visuals found in source"),
      icon: <GalleryHorizontal className="size-4" />,
    },
    {
      label: copy(language, "Arastirma", "Research"),
      value: formatCompactNumber(normalizedContent.researchFileCount, locale),
      hint: copy(language, "Destekleyici dosya adedi", "Supporting file count"),
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

  const heroFigure = resolvedFigures[0] || null;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-border bg-card/95 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_28%)]" />
        <div className="absolute inset-0 tactical-grid opacity-20" />

        <div className="relative grid gap-6 p-6 2xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Daily Report
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {normalizedContent.sourceKind === "file"
                  ? "Live markdown feed"
                  : "Research package"}
              </span>
              {normalizedContent.sourceLabel ? (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {normalizedContent.sourceLabel}
                </span>
              ) : null}
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {title}
              </h2>
              <p className="max-w-4xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                {normalizedContent.headline}
              </p>
            </div>

            {statCards.length ? (
              <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
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
            ) : (
              <EmptyReportCallout
                title={copy(language, "Stat bloklari hazirlaniyor", "Summary cards are loading")}
                body={copy(
                  language,
                  "Bu raporun section, ticker ve figure dagilimi yorumlandikca ustteki ozet kartlari otomatik dolacak.",
                  "As the report's section, ticker, and figure distribution is interpreted, the summary cards above will fill automatically."
                )}
              />
            )}
          </div>

          <div className="space-y-4">
            {heroFigure ? (
              <FigureCard language={language} figure={heroFigure} variant="hero" onOpen={setActiveFigure} />
            ) : null}

            <div className="rounded-[2rem] border border-white/10 bg-background/65 p-5 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {copy(language, "Rapor tarihi", "Report date")}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {formatReportDate(reportDate, locale)}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {copy(language, "Sinyal haritasi", "Signal map")}
                </div>
              </div>

              <div className="mt-4 rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  {copy(language, "Yuklenme zamani", "Loaded at")}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {formatUpdateStamp(updatedAt, locale)}
                </p>
              </div>

              {metadataHighlights.length ? (
                <div className="mt-4 grid gap-3">
                  {metadataHighlights.map(item => (
                    <div
                      key={`${item.label}-${item.value}`}
                      className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

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
                  {copy(
                    language,
                    "Bu raporda ayrik makro rejim tablosu bulunmuyor. Yine de asagidaki dashboard, markdown tablolarindan otomatik olarak okunabilen sinyalleri ozetliyor.",
                    "This report does not contain a separate macro regime table. The dashboard below still summarizes signals that can be read automatically from the markdown tables."
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {insights.keyThemes.length ? (
        <Panel
          eyebrow={copy(language, "Ana Temalar", "Key Themes")}
          title={copy(language, "Raporun merkezindeki ana fikirler", "Core ideas at the center of the report")}
        >
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
        <Panel
          eyebrow={copy(language, "Rapor Haritasi", "Report Map")}
          title={copy(language, "Bolumler arasi hizli gecis", "Quick navigation across sections")}
        >
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
        <Panel
          eyebrow={copy(language, "Grafik Destesi", "Figure Deck")}
          title={copy(language, "Grafikler okunabilir panel duzeninde", "Charts in a readable panel layout")}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {resolvedFigures.map((figure, index) => (
              <div
                key={figure.fileName}
                className={`overflow-hidden rounded-[1.8rem] border border-border bg-background/55 ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <FigureCard language={language} figure={figure} onOpen={setActiveFigure} />
              </div>
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
            <Panel
              eyebrow={copy(language, "Piyasa Nabzi", "Market Pulse")}
              title={copy(language, "Ana endeks hareketleri", "Major index moves")}
            >
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
            <Panel
              eyebrow={copy(language, "Sektor Haritasi", "Sector Map")}
              title={copy(language, "Sektor liderligi", "Sector leadership")}
            >
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
            <Panel
              eyebrow={copy(language, "Genislik Dagilimi", "Breadth Split")}
              title={copy(language, "Genislik dengesi", "Breadth balance")}
            >
              <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                <ChartContainer
                  className="mx-auto h-[240px] max-w-[260px]"
                  config={{
                    positive: { label: copy(language, "Pozitif", "Positive"), color: "oklch(0.78 0.18 160)" },
                    negative: { label: copy(language, "Negatif", "Negative"), color: "oklch(0.65 0.22 25)" },
                    neutral: { label: copy(language, "Notr", "Neutral"), color: "oklch(0.75 0.15 75)" },
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
                          {formatCompactNumber(stat.value, locale)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          ) : null}

          {insights.signalRadar.length ? (
            <Panel
              eyebrow={copy(language, "Sinyal Yogunlugu", "Signal Density")}
              title={copy(language, "Rapor yogunluk haritasi", "Report signal density map")}
            >
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
            <Panel
              eyebrow={copy(language, "Liderler", "Leaders")}
              title={copy(language, "En guclu momentum isimleri", "Strongest momentum names")}
              className="xl:col-span-2"
            >
              <ChartContainer
                className="h-[340px] w-full"
                config={{
                  change: {
                    label: copy(language, "Gunluk %", "Daily %"),
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

      <Panel
        eyebrow={copy(language, "Tam Rapor", "Full Report")}
        title={copy(language, "Tam rapor akisi", "Full report flow")}
      >
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
              const inlineFigure = {
                fileName: normalizeRelativeAssetPath(block.src),
                label: block.alt || copy(language, "Rapor figuru", "Report figure"),
                ...resolveAssetSrc(
                  assetBasePath,
                  block.src,
                  openAiFigureFiles
                ),
              };

              return (
                <FigureCard
                  key={`${block.type}-${index}`}
                  language={language}
                  figure={inlineFigure}
                  variant="inline"
                  onOpen={setActiveFigure}
                />
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
                {normalizedContent.coverage ||
                  copy(language, "Kaynakta acik kapsama notu yok", "No explicit coverage note in the source")}
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
                {normalizedContent.methodology ||
                  copy(language, "Metodoloji notu belirtilmemis", "Methodology note not specified")}
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
                {normalizedContent.sourceLabel || sourceFolder || "Daily report source"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={Boolean(activeFigure)} onOpenChange={open => !open && setActiveFigure(null)}>
        <DialogContent
          className="h-[94vh] w-[min(96vw,1600px)] max-w-[calc(100vw-1rem)] overflow-hidden border-white/10 bg-[#041118]/98 p-0 shadow-[0_40px_140px_rgba(0,0,0,0.6)] sm:max-w-[min(96vw,1600px)]"
          showCloseButton
        >
          {activeFigure ? (
            <div className="flex h-full flex-col overflow-hidden rounded-[1.6rem]">
              <div className="border-b border-white/10 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <DialogTitle className="text-xl font-semibold text-foreground">
                      {activeFigure.label}
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
                      {activeFigure.fileName}
                    </DialogDescription>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveFigure(null)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-white/24 hover:bg-white/[0.08]"
                  >
                    <X className="size-3.5" />
                    {copy(language, "Kapat", "Close")}
                  </button>
                </div>
              </div>
              <div className="relative min-h-0 flex-1 overflow-auto bg-[linear-gradient(180deg,rgba(10,23,32,0.98),rgba(4,14,20,1))] p-3 md:p-5">
                <div className="absolute inset-0 tactical-grid opacity-[0.14]" />
                <div className="relative flex min-h-full items-center justify-center">
                  <img
                    src={activeFigure.src}
                    alt={activeFigure.label}
                    className="mx-auto max-h-full max-w-full rounded-[1.4rem] object-contain shadow-[0_24px_90px_rgba(0,0,0,0.48)]"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
