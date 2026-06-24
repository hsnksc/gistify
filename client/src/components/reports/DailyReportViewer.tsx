import type { DailyReportContent } from "@shared/dailyReports";
import HtmlReportRenderer from "@/components/reports/HtmlReportRenderer";
import ReportPostShell, {
  type ReportPostItem,
} from "@/components/reports/ReportPostShell";
import { getDailyReportAssetUrl } from "@/lib/dailyReports";
import { copy, type AppLanguage } from "@/lib/i18n";
import {
  extractLeadParagraphsFromMarkdown,
  extractSnapshotMetricsFromMarkdown,
} from "@/lib/reportPost";
import { buildReportSpotlight } from "@/lib/reportSpotlight";

interface DailyReportViewerProps {
  language?: AppLanguage;
  title: string;
  reportDate: string;
  updatedAt?: string;
  sourceFolder: string;
  content: DailyReportContent;
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

  const preferred = resolvePreferredFigureFileName(
    normalized,
    openAiFigureFiles
  );
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
    html: typeof content.html === "string" ? content.html : "",
    markdown: typeof content.markdown === "string" ? content.markdown : "",
    author: typeof content.author === "string" ? content.author : "",
    coverage: typeof content.coverage === "string" ? content.coverage : "",
    methodology:
      typeof content.methodology === "string" ? content.methodology : "",
    executiveSummary: Array.isArray(content.executiveSummary)
      ? content.executiveSummary.filter(
          (item): item is string => typeof item === "string"
        )
      : [],
    figureFiles: Array.isArray(content.figureFiles)
      ? content.figureFiles.filter(
          (item): item is string => typeof item === "string"
        )
      : [],
    openAiFigureFiles: Array.isArray(content.openAiFigureFiles)
      ? content.openAiFigureFiles.filter(
          (item): item is string => typeof item === "string"
        )
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
      ? content.tickerUniverse.filter(
          (item): item is string => typeof item === "string"
        )
      : [],
    researchFileCount:
      typeof content.researchFileCount === "number" &&
      Number.isFinite(content.researchFileCount)
        ? content.researchFileCount
        : 0,
    contentFormat:
      content.contentFormat === "html" ||
      (typeof content.html === "string" &&
        content.html.trim().length > 0 &&
        !content.markdown)
        ? "html"
        : "markdown",
  } satisfies DailyReportContent;

  const assetBasePath = normalizedContent.assetBasePath || sourceFolder;
  const sourceLabel =
    normalizedContent.sourceLabel ||
    sourceFolder ||
    copy(language, "Daily report source", "Daily report source");
  const categoryLabel = sourceLabel.toLowerCase().startsWith("flow/")
    ? copy(language, "Flow Post", "Flow Post")
    : copy(language, "Daily Post", "Daily Post");
  const isHtmlSource = normalizedContent.contentFormat === "html";
  const spotlight = isHtmlSource
    ? null
    : buildReportSpotlight(normalizedContent.markdown);
  const storyItems = spotlight
    ? []
    : normalizedContent.executiveSummary.length
      ? normalizedContent.executiveSummary.slice(0, 4)
      : isHtmlSource
        ? []
        : extractLeadParagraphsFromMarkdown(normalizedContent.markdown, 3);
  const snapshotMetrics = isHtmlSource
    ? []
    : extractSnapshotMetricsFromMarkdown(normalizedContent.markdown, 6);
  const statCards: ReportPostItem[] = snapshotMetrics.length
    ? snapshotMetrics.map(item => ({
        label: item.label,
        value: item.value,
        detail: item.detail,
        tone: "info",
      }))
    : [
        {
          label: "Ticker",
          value: String(normalizedContent.tickerUniverse.length),
          detail: copy(
            language,
            "Parser ile cikan ticker evreni.",
            "Ticker universe parsed from the source."
          ),
          tone: "bull",
        },
        {
          label: "Figure",
          value: String(normalizedContent.figureFiles.length),
          detail: copy(
            language,
            "Yuklenen gorsel adedi.",
            "Uploaded figure count."
          ),
          tone: "info",
        },
        {
          label: copy(language, "Arastirma", "Research"),
          value: String(normalizedContent.researchFileCount),
          detail: copy(
            language,
            "Ek arastirma dosyasi sayisi.",
            "Additional research file count."
          ),
        },
      ];
  const metaItems: ReportPostItem[] = [
    {
      label: "Ticker",
      value: String(normalizedContent.tickerUniverse.length),
      tone: "bull",
    },
    {
      label: "Figure",
      value: String(normalizedContent.figureFiles.length),
      tone: "info",
    },
    {
      label: "OpenAI",
      value: String(normalizedContent.openAiFigureFiles.length),
      tone: "caution",
    },
    {
      label: copy(language, "Arastirma", "Research"),
      value: String(normalizedContent.researchFileCount),
    },
    ...(normalizedContent.author
      ? [
          {
            label: copy(language, "Hazirlayan", "Author"),
            value: normalizedContent.author,
            tone: "info" as const,
          },
        ]
      : []),
    ...(normalizedContent.coverage
      ? [
          {
            label: copy(language, "Kapsam", "Coverage"),
            value: normalizedContent.coverage,
          },
        ]
      : []),
    ...(normalizedContent.methodology
      ? [
          {
            label: copy(language, "Metodoloji", "Methodology"),
            value: normalizedContent.methodology,
          },
        ]
      : []),
    ...normalizedContent.metadataItems.map(item => ({
      label: item.label,
      value: item.value,
    })),
  ];

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
    <ReportPostShell
      language={language}
      categoryLabel={categoryLabel}
      title={title}
      headline={normalizedContent.headline}
      reportDateLabel={formatReportDate(reportDate, locale)}
      updatedAtLabel={formatUpdateStamp(updatedAt, locale)}
      sourceLabel={sourceLabel}
      sourceKindLabel={
        isHtmlSource
          ? copy(language, "HTML Dosyasi", "HTML File")
          : normalizedContent.sourceKind === "file"
            ? copy(language, "Markdown Dosyasi", "Markdown File")
            : copy(language, "Arastirma Paketi", "Research Package")
      }
      statCards={statCards}
      metaItems={metaItems}
      storyItems={storyItems}
      markdown={normalizedContent.markdown}
      documentDescription={
        isHtmlSource
          ? copy(
              language,
              "Asagida yuklenen HTML kaynak ayni yayin temasinda korunur.",
              "The uploaded HTML source is preserved below inside the publishing theme."
            )
          : undefined
      }
      documentContent={
        isHtmlSource ? (
          <HtmlReportRenderer
            language={language}
            html={normalizedContent.html || ""}
            emptyMessage={copy(
              language,
              "Kaynak HTML icerigi bos.",
              "The source HTML content is empty."
            )}
          />
        ) : undefined
      }
      emptyMessage={copy(
        language,
        isHtmlSource
          ? "Kaynak HTML icerigi bos."
          : "Kaynak markdown icerigi bos.",
        isHtmlSource
          ? "The source HTML content is empty."
          : "The source markdown content is empty."
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
    >
      <>
        {spotlight?.items.length ? (
          <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {copy(language, "One Cikanlar", "Key Spotlight")}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">
                  {spotlight.title === "Spotlight"
                    ? copy(
                        language,
                        "Raporun can alici kisimlari",
                        "The report's most important points"
                      )
                    : spotlight.title}
                </h3>
              </div>
              <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {spotlight.items.length} key
              </span>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {spotlight.items.map(item => {
                const cardClassName = `block rounded-[1.55rem] border border-border bg-background/55 p-4 transition-colors ${
                  item.anchorId
                    ? "hover:border-emerald-400/35 hover:bg-background/75"
                    : ""
                }`;
                const cardBody = (
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground md:text-base">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                    {item.anchorId ? (
                      <span className="shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                        {copy(language, "Detaya Git", "Jump")}
                      </span>
                    ) : null}
                  </div>
                );

                return item.anchorId ? (
                  <a
                    key={`${item.label}-${item.detail.slice(0, 24)}`}
                    href={`#${item.anchorId}`}
                    className={cardClassName}
                  >
                    {cardBody}
                  </a>
                ) : (
                  <article
                    key={`${item.label}-${item.detail.slice(0, 24)}`}
                    className={cardClassName}
                  >
                    {cardBody}
                  </article>
                );
              })}
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
                  {copy(
                    language,
                    "Yuklenen grafik ve gorseller",
                    "Uploaded charts and visuals"
                  )}
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
      </>
    </ReportPostShell>
  );
}
