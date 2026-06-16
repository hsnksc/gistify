import type { DailyReportContent } from "@shared/dailyReports";
import type { FlowReport } from "@shared/flow";
import type { ReportPostItem } from "@/components/reports/ReportPostShell";
import { getDailyReportAssetUrl } from "@/lib/dailyReports";
import { copy, type AppLanguage } from "@/lib/i18n";
import {
  extractLeadParagraphsFromMarkdown,
  extractSnapshotMetricsFromMarkdown,
} from "@/lib/reportPost";
import { buildReportSpotlight } from "@/lib/reportSpotlight";

export interface FlowGalleryFigure {
  aiEnhanced: boolean;
  fileName: string;
  label: string;
  src: string;
}

export interface FlowResolvedImage {
  aiEnhanced: boolean;
  alt: string;
  label?: string;
  src: string;
}

export interface FlowViewerData {
  categoryLabel: string;
  emptyMessage: string;
  galleryFigures: FlowGalleryFigure[];
  headline: string;
  markdown: string;
  metaItems: ReportPostItem[];
  reportDateLabel: string;
  resolveImage: (src: string, alt: string) => FlowResolvedImage;
  sourceKindLabel: string;
  sourceLabel: string;
  spotlight: ReturnType<typeof buildReportSpotlight>;
  statCards: ReportPostItem[];
  storyItems: string[];
  title: string;
  updatedAtLabel: string;
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
      aiEnhanced: true,
      fileName: openAiVariant,
    };
  }

  return {
    aiEnhanced: false,
    fileName: normalized,
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

function resolveAssetSrc(
  assetBasePath: string | undefined,
  src: string,
  openAiFigureFiles: string[]
) {
  const normalized = normalizeRelativeAssetPath(src);
  if (/^(https?:)?\/\//i.test(normalized) || normalized.startsWith("data:")) {
    return {
      aiEnhanced: false,
      src: normalized,
    };
  }

  const preferred = resolvePreferredFigureFileName(normalized, openAiFigureFiles);
  return {
    aiEnhanced: preferred.aiEnhanced,
    src: getDailyReportAssetUrl(assetBasePath, preferred.fileName),
  };
}

export function formatFlowReportDate(reportDate: string, locale = "tr-TR") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${reportDate}T00:00:00Z`));
}

export function formatFlowTimestamp(value: string, locale = "tr-TR") {
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

export function normalizeFlowContent(content: DailyReportContent): DailyReportContent {
  return {
    ...content,
    author: typeof content.author === "string" ? content.author : "",
    coverage: typeof content.coverage === "string" ? content.coverage : "",
    executiveSummary: Array.isArray(content.executiveSummary)
      ? content.executiveSummary.filter((item): item is string => typeof item === "string")
      : [],
    figureFiles: Array.isArray(content.figureFiles)
      ? content.figureFiles.filter((item): item is string => typeof item === "string")
      : [],
    headline: typeof content.headline === "string" ? content.headline : "",
    markdown: typeof content.markdown === "string" ? content.markdown : "",
    metadataItems: Array.isArray(content.metadataItems)
      ? content.metadataItems.filter(
          (
            item
          ): item is {
            label: string;
            value: string;
          } =>
            Boolean(item) &&
            typeof item.label === "string" &&
            typeof item.value === "string" &&
            item.label.trim().length > 0 &&
            item.value.trim().length > 0
        )
      : [],
    methodology: typeof content.methodology === "string" ? content.methodology : "",
    openAiFigureFiles: Array.isArray(content.openAiFigureFiles)
      ? content.openAiFigureFiles.filter((item): item is string => typeof item === "string")
      : [],
    researchFileCount:
      typeof content.researchFileCount === "number" &&
      Number.isFinite(content.researchFileCount)
        ? content.researchFileCount
        : 0,
    tickerUniverse: Array.isArray(content.tickerUniverse)
      ? content.tickerUniverse.filter((item): item is string => typeof item === "string")
      : [],
  };
}

export function getFlowSourceLabel(report: FlowReport) {
  return (
    normalizeFlowContent(report.content).sourceLabel ||
    report.sourceFolder ||
    "Flow source"
  );
}

export function getFlowPreviewText(
  report: FlowReport,
  language: AppLanguage = "tr"
) {
  const content = normalizeFlowContent(report.content);
  const lead =
    content.headline ||
    content.executiveSummary[0] ||
    extractLeadParagraphsFromMarkdown(content.markdown, 1)[0];

  return (
    lead ||
    copy(
      language,
      "Bu Flow raporu icin onizleme metni hazirlanamadi.",
      "No preview text is available for this flow report."
    )
  );
}

export function buildFlowViewerData(
  report: FlowReport,
  language: AppLanguage = "tr"
): FlowViewerData {
  const locale = language === "en" ? "en-US" : "tr-TR";
  const content = normalizeFlowContent(report.content);
  const assetBasePath = content.assetBasePath || report.sourceFolder;
  const sourceLabel = getFlowSourceLabel(report);
  const spotlight = buildReportSpotlight(content.markdown);
  const storyItems = spotlight
    ? []
    : content.executiveSummary.length
      ? content.executiveSummary.slice(0, 4)
      : extractLeadParagraphsFromMarkdown(content.markdown, 3);
  const snapshotMetrics = extractSnapshotMetricsFromMarkdown(content.markdown, 6);
  const statCards: ReportPostItem[] = snapshotMetrics.length
    ? snapshotMetrics.map(item => ({
        detail: item.detail,
        label: item.label,
        tone: "info",
        value: item.value,
      }))
    : [
        {
          detail: copy(
            language,
            "Parser ile cikan ticker evreni.",
            "Ticker universe parsed from the source."
          ),
          label: "Ticker",
          tone: "bull",
          value: String(content.tickerUniverse.length),
        },
        {
          detail: copy(language, "Yuklenen gorsel adedi.", "Uploaded figure count."),
          label: "Figure",
          tone: "info",
          value: String(content.figureFiles.length),
        },
        {
          detail: copy(
            language,
            "Ek arastirma dosyasi sayisi.",
            "Additional research file count."
          ),
          label: copy(language, "Arastirma", "Research"),
          value: String(content.researchFileCount),
        },
      ];

  const metaItems: ReportPostItem[] = [
    {
      label: "Ticker",
      tone: "bull",
      value: String(content.tickerUniverse.length),
    },
    {
      label: "Figure",
      tone: "info",
      value: String(content.figureFiles.length),
    },
    {
      label: "OpenAI",
      tone: "caution",
      value: String(content.openAiFigureFiles.length),
    },
    {
      label: copy(language, "Arastirma", "Research"),
      value: String(content.researchFileCount),
    },
    ...(content.author
      ? [
          {
            label: copy(language, "Hazirlayan", "Author"),
            tone: "info" as const,
            value: content.author,
          },
        ]
      : []),
    ...(content.coverage
      ? [
          {
            label: copy(language, "Kapsam", "Coverage"),
            value: content.coverage,
          },
        ]
      : []),
    ...(content.methodology
      ? [
          {
            label: copy(language, "Metodoloji", "Methodology"),
            value: content.methodology,
          },
        ]
      : []),
    ...(content.metadataItems || []).map(item => ({
      label: item.label,
      value: item.value,
    })),
  ];

  const galleryFigures: FlowGalleryFigure[] = content.figureFiles.map(fileName => {
    const preferred = resolvePreferredFigureFileName(
      fileName,
      content.openAiFigureFiles
    );

    return {
      aiEnhanced: preferred.aiEnhanced,
      fileName: preferred.fileName,
      label: prettifyFigureLabel(fileName),
      src: getDailyReportAssetUrl(assetBasePath, preferred.fileName),
    };
  });

  return {
    categoryLabel: copy(language, "Flow Post", "Flow Post"),
    emptyMessage: copy(
      language,
      "Kaynak markdown icerigi bos.",
      "The source markdown content is empty."
    ),
    galleryFigures,
    headline: content.headline,
    markdown: content.markdown,
    metaItems,
    reportDateLabel: formatFlowReportDate(report.reportDate, locale),
    resolveImage: (src, alt) => {
      const resolved = resolveAssetSrc(assetBasePath, src, content.openAiFigureFiles);

      return {
        aiEnhanced: resolved.aiEnhanced,
        alt: alt || prettifyFigureLabel(src),
        label: resolved.aiEnhanced
          ? `${prettifyFigureLabel(src)} · OpenAI`
          : prettifyFigureLabel(src),
        src: resolved.src,
      };
    },
    sourceKindLabel:
      content.sourceKind === "file"
        ? copy(language, "Markdown Dosyasi", "Markdown File")
        : copy(language, "Arastirma Paketi", "Research Package"),
    sourceLabel,
    spotlight,
    statCards,
    storyItems,
    title: report.title,
    updatedAtLabel: formatFlowTimestamp(report.updatedAt, locale),
  };
}
