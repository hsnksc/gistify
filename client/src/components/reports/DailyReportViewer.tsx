import type { DailyReportContent } from "@shared/dailyReports";
import {
  BookOpen,
  CalendarRange,
  FileStack,
  GalleryHorizontal,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import MarkdownReportRenderer from "@/components/reports/MarkdownReportRenderer";
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

function prettifyFigureLabel(fileName: string) {
  const baseName = fileName.split(/[\\/]/).pop() || fileName;

  return baseName
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/^fig[_-]?/i, "")
    .replace(/^chart\d+[_-]?/i, "")
    .replace(/^sec\d+[_-]?/i, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase());
}

function MetaCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarRange;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.55rem] border border-border bg-background/55 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
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
  const locale = language === "en" ? "en-US" : "tr-TR";
  const normalizedContent = {
    ...content,
    headline: typeof content.headline === "string" ? content.headline : "",
    markdown: typeof content.markdown === "string" ? content.markdown : "",
    author: typeof content.author === "string" ? content.author : "",
    coverage: typeof content.coverage === "string" ? content.coverage : "",
    methodology: typeof content.methodology === "string" ? content.methodology : "",
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

  const assetBasePath = normalizedContent.assetBasePath || sourceFolder;
  const sourceLabel =
    normalizedContent.sourceLabel || sourceFolder || copy(language, "Daily report source", "Daily report source");

  const metaCards = [
    {
      icon: CalendarRange,
      label: copy(language, "Rapor Tarihi", "Report Date"),
      value: formatReportDate(reportDate, locale),
    },
    {
      icon: BookOpen,
      label: copy(language, "Kaynak", "Source"),
      value: sourceLabel,
    },
    {
      icon: Sparkles,
      label: copy(language, "Yuklenme", "Loaded"),
      value: formatUpdateStamp(updatedAt, locale),
    },
    {
      icon: Target,
      label: "Ticker",
      value: String(normalizedContent.tickerUniverse.length),
    },
    {
      icon: GalleryHorizontal,
      label: "Figure",
      value: String(normalizedContent.figureFiles.length),
    },
    {
      icon: FileStack,
      label: copy(language, "Arastirma", "Research"),
      value: String(normalizedContent.researchFileCount),
    },
  ];

  if (normalizedContent.author) {
    metaCards.splice(2, 0, {
      icon: UserRound,
      label: copy(language, "Hazirlayan", "Author"),
      value: normalizedContent.author,
    });
  }

  if (normalizedContent.coverage) {
    metaCards.push({
      icon: BookOpen,
      label: copy(language, "Kapsam", "Coverage"),
      value: normalizedContent.coverage,
    });
  }

  if (normalizedContent.methodology) {
    metaCards.push({
      icon: Sparkles,
      label: copy(language, "Metodoloji", "Methodology"),
      value: normalizedContent.methodology,
    });
  }

  const galleryFigures = normalizedContent.figureFiles.map(fileName => {
    const preferred = resolvePreferredFigureFileName(
      fileName,
      normalizedContent.openAiFigureFiles
    );

    return {
      fileName: preferred.fileName,
      label: prettifyFigureLabel(fileName),
      src: getDailyReportAssetUrl(assetBasePath, preferred.fileName),
      aiEnhanced: preferred.aiEnhanced,
    };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {copy(language, "Kaynak Rapor", "Source Report")}
            </span>
            {normalizedContent.sourceKind ? (
              <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {normalizedContent.sourceKind === "file"
                  ? copy(language, "Markdown Dosyasi", "Markdown File")
                  : copy(language, "Arastirma Paketi", "Research Package")}
              </span>
            ) : null}
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {title}
            </h2>
            <p className="max-w-4xl text-sm leading-7 text-muted-foreground md:text-[15px]">
              {normalizedContent.headline ||
                copy(
                  language,
                  "Bu rapor dosyasi basit ve tam bir okuma deneyimiyle gosteriliyor.",
                  "This report file is shown with a simple and complete reading experience."
                )}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metaCards.map(card => (
          <MetaCard
            key={`${card.label}-${card.value}`}
            icon={card.icon}
            label={card.label}
            value={card.value}
          />
        ))}
        {normalizedContent.metadataItems.map(item => (
          <MetaCard
            key={`${item.label}-${item.value}`}
            icon={FileStack}
            label={item.label}
            value={item.value}
          />
        ))}
      </section>

      {normalizedContent.executiveSummary.length ? (
        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {copy(language, "Yonetici Ozeti", "Executive Summary")}
          </p>
          <div className="mt-4 grid gap-3">
            {normalizedContent.executiveSummary.map((item, index) => (
              <article
                key={`${index}-${item.slice(0, 48)}`}
                className="rounded-[1.45rem] border border-border bg-background/55 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="text-sm leading-7 text-foreground/90">{item}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {galleryFigures.length ? (
        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {copy(language, "Gorsel Arsivi", "Figure Archive")}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">
                {copy(language, "Yuklenen grafik ve gorseller", "Uploaded charts and visuals")}
              </h3>
            </div>
            <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {galleryFigures.length} figure
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {galleryFigures.map(figure => (
              <figure
                key={figure.fileName}
                className="overflow-hidden rounded-[1.7rem] border border-border bg-background/55"
              >
                <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {figure.label}
                    </p>
                    <p className="mt-1 truncate text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {figure.fileName}
                    </p>
                  </div>
                  {figure.aiEnhanced ? (
                    <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                      OpenAI
                    </span>
                  ) : null}
                </div>
                <div className="bg-[#07141a] p-4">
                  <img
                    src={figure.src}
                    alt={figure.label}
                    className="max-h-[420px] w-full rounded-[1.2rem] object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <MarkdownReportRenderer
        language={language}
        markdown={normalizedContent.markdown}
        emptyMessage={copy(
          language,
          "Kaynak markdown icerigi bos.",
          "The source markdown content is empty."
        )}
        resolveImage={(src, alt) => {
          const resolved = resolveAssetSrc(
            assetBasePath,
            src,
            normalizedContent.openAiFigureFiles
          );

          return {
            src: resolved.src,
            alt: alt || prettifyFigureLabel(src),
            label: resolved.aiEnhanced
              ? `${prettifyFigureLabel(src)} · OpenAI`
              : prettifyFigureLabel(src),
          };
        }}
      />
    </div>
  );
}
