import type { DailyReportContent } from "@shared/dailyReports";
import type {
  FlowReport,
  FlowReportKind,
  FlowReportSummary,
} from "@shared/flow";
import {
  analyzeFlowReportLanguage,
  type FlowReportLanguageInfo,
} from "@shared/flowLanguage";
import type { ReportPostItem } from "@/components/reports/ReportPostShell";
import { getDailyReportAssetUrl } from "@/lib/dailyReports";
import { copy, type AppLanguage } from "@/lib/i18n";
import {
  extractLeadParagraphsFromMarkdown,
  extractSnapshotMetricsFromMarkdown,
} from "@/lib/reportPost";
import { buildReportSpotlight } from "@/lib/reportSpotlight";
import {
  inferFlowTickerFromText,
  isBlockedFlowTicker,
  normalizeFlowTicker,
  resolveFlowReportKind,
} from "@shared/flowInference";

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
  contentFormat: "markdown" | "html";
  categoryLabel: string;
  emptyMessage: string;
  galleryFigures: FlowGalleryFigure[];
  headline: string;
  html: string;
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

export type FlowReportListEntry = FlowReport | FlowReportSummary;

export interface FlowTickerGroup<T extends FlowReportListEntry = FlowReportListEntry> {
  latestReport: T;
  reports: T[];
  sourceLabels: string[];
  ticker: string;
}

export interface FlowLanguageBadge {
  label: string;
  toneClassName: string;
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

  const preferred = resolvePreferredFigureFileName(
    normalized,
    openAiFigureFiles
  );
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

export function normalizeFlowContent(
  content: DailyReportContent
): DailyReportContent {
  const html = typeof content.html === "string" ? content.html : "";
  const contentFormat =
    content.contentFormat === "html" || (html && !content.markdown)
      ? "html"
      : "markdown";

  return {
    ...content,
    author: typeof content.author === "string" ? content.author : "",
    coverage: typeof content.coverage === "string" ? content.coverage : "",
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
    headline: typeof content.headline === "string" ? content.headline : "",
    html,
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
    methodology:
      typeof content.methodology === "string" ? content.methodology : "",
    openAiFigureFiles: Array.isArray(content.openAiFigureFiles)
      ? content.openAiFigureFiles.filter(
          (item): item is string => typeof item === "string"
        )
      : [],
    researchFileCount:
      typeof content.researchFileCount === "number" &&
      Number.isFinite(content.researchFileCount)
        ? content.researchFileCount
        : 0,
    tickerUniverse: Array.isArray(content.tickerUniverse)
      ? content.tickerUniverse.filter(
          (item): item is string => typeof item === "string"
        )
      : [],
    contentFormat,
  };
}

function isFlowReportSummary(report: FlowReportListEntry): report is FlowReportSummary {
  return !("content" in report);
}

export function getFlowReportLanguageInfo(
  report: FlowReportListEntry
): FlowReportLanguageInfo {
  if (isFlowReportSummary(report)) {
    return {
      hasLanguageToggle: false,
      languageMode: report.languageMode,
      translationState: report.translationState,
    };
  }

  const content = normalizeFlowContent(report.content);
  return analyzeFlowReportLanguage({
    contentFormat: content.contentFormat,
    html: content.html || "",
    markdown: content.markdown,
    sourceFolder: report.sourceFolder,
    sourceLabel: content.sourceLabel || report.sourceFolder,
    title: report.title,
  });
}

export function getFlowLanguageBadge(
  report: FlowReportListEntry,
  language: AppLanguage
): FlowLanguageBadge | null {
  const languageInfo = getFlowReportLanguageInfo(report);

  if (languageInfo.languageMode === "bilingual") {
    return {
      label:
        languageInfo.translationState === "partial"
          ? copy(language, "TR + EN kismi", "TR + EN partial")
          : copy(language, "TR + EN", "TR + EN"),
      toneClassName:
        languageInfo.translationState === "partial"
          ? "border-amber-400/30 bg-amber-500/10 text-amber-300"
          : "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
    };
  }

  if (languageInfo.languageMode === "tr") {
    return {
      label: "TR",
      toneClassName: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
    };
  }

  if (languageInfo.languageMode === "en") {
    return {
      label: "EN",
      toneClassName: "border-blue-400/30 bg-blue-500/10 text-blue-300",
    };
  }

  return null;
}

export function getFlowReportKind(report: FlowReportListEntry): FlowReportKind {
  if (isFlowReportSummary(report)) {
    return report.reportKind;
  }

  const content = normalizeFlowContent(report.content);
  return resolveFlowReportKind({
    title: report.title,
    tickerUniverse: content.tickerUniverse,
    candidates: [
      report.slug,
      report.sourceFolder,
      getFlowSourceLabel(report),
      content.headline,
      content.coverage || "",
    ],
  });
}

export function getFlowSourceLabel(report: FlowReportListEntry) {
  if (isFlowReportSummary(report)) {
    return report.sourceLabel || report.sourceFolder || "Flow source";
  }

  return normalizeFlowContent(report.content).sourceLabel || report.sourceFolder || "Flow source";
}

export function compareFlowReports(
  left: FlowReportListEntry,
  right: FlowReportListEntry
) {
  const byDate = right.reportDate.localeCompare(left.reportDate);
  if (byDate !== 0) {
    return byDate;
  }

  const byUpdatedAt = right.updatedAt.localeCompare(left.updatedAt);
  if (byUpdatedAt !== 0) {
    return byUpdatedAt;
  }

  return left.title.localeCompare(right.title);
}

export function getPrimaryFlowTicker(report: FlowReportListEntry) {
  if (getFlowReportKind(report) === "daily") {
    return "MARKET";
  }

  if (isFlowReportSummary(report)) {
    const directTicker = normalizeFlowTicker(report.ticker);
    if (directTicker && !isBlockedFlowTicker(directTicker)) {
      return directTicker;
    }

    const fromUniverse = report.tickerUniverse
      .map(item => normalizeFlowTicker(item))
      .find(item => item && !isBlockedFlowTicker(item));

    if (fromUniverse) {
      return fromUniverse;
    }

    return (
      inferFlowTickerFromText(
        report.title,
        report.sourceLabel,
        report.sourceFolder,
        report.slug
      ) ||
      normalizeFlowTicker(report.id) ||
      "FLOW"
    );
  }

  const content = normalizeFlowContent(report.content);
  const directTicker = content.tickerUniverse
    .map(item => normalizeFlowTicker(item))
    .find(item => item && !isBlockedFlowTicker(item));

  if (directTicker) {
    return directTicker;
  }

  return (
    inferFlowTickerFromText(
      content.coverage || "",
      report.title,
      getFlowSourceLabel(report),
      report.sourceFolder,
      report.slug
    ) ||
    normalizeFlowTicker(report.id) ||
    "FLOW"
  );
}

export function getFlowTickerReportPath(ticker: string, basePath = "/flow") {
  const normalizedTicker = normalizeFlowTicker(ticker) || ticker.trim();
  return `${basePath}/ticker/${encodeURIComponent(normalizedTicker)}`;
}

export function getFlowReportDetailPath(reportId: string, basePath = "/flow") {
  return `${basePath}/${encodeURIComponent(reportId)}`;
}

export function getFlowReportArchiveDetailPath(
  report: FlowReportListEntry,
  basePath = "/reports"
) {
  const ticker = normalizeFlowTicker(getPrimaryFlowTicker(report)) || "FLOW";
  return `${basePath}/${encodeURIComponent(ticker)}/${encodeURIComponent(report.reportDate)}`;
}

export function findFlowReportByTickerAndDate(
  reports: FlowReportListEntry[],
  ticker: string,
  reportDate: string
) {
  const normalizedTicker = normalizeFlowTicker(ticker);
  if (!normalizedTicker || !reportDate) {
    return null;
  }

  return (
    [...reports]
      .sort(compareFlowReports)
      .find(
        report =>
          getPrimaryFlowTicker(report) === normalizedTicker &&
          report.reportDate === reportDate
      ) || null
  );
}

export function groupFlowReportsByTicker<T extends FlowReportListEntry>(reports: T[]) {
  const grouped = new Map<string, T[]>();
  const orderedReports = [...reports]
    .filter(report => getFlowReportKind(report) === "stock")
    .sort(compareFlowReports);

  for (const report of orderedReports) {
    const ticker = getPrimaryFlowTicker(report);
    const existing = grouped.get(ticker);
    if (existing) {
      existing.push(report);
    } else {
      grouped.set(ticker, [report]);
    }
  }

  return Array.from(grouped.entries())
    .map(([ticker, groupedReports]) => ({
      latestReport: groupedReports[0],
      reports: groupedReports,
      sourceLabels: Array.from(
        new Set(groupedReports.map(report => getFlowSourceLabel(report)))
      ),
      ticker,
    }))
    .sort((left, right) =>
      compareFlowReports(left.latestReport, right.latestReport)
    );
}

export function getFlowPreviewText(report: FlowReportListEntry, language: AppLanguage = "tr") {
  if (isFlowReportSummary(report)) {
    return (
      report.previewText ||
      report.headline ||
      copy(
        language,
        "Bu Flow raporu icin onizleme metni hazirlanamadi.",
        "No preview text is available for this flow report."
      )
    );
  }

  const content = normalizeFlowContent(report.content);
  const lead =
    content.headline ||
    content.executiveSummary[0] ||
    (content.contentFormat === "markdown"
      ? extractLeadParagraphsFromMarkdown(content.markdown, 1)[0]
      : "");

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
  const isHtmlSource = content.contentFormat === "html";
  const spotlight = isHtmlSource
    ? null
    : buildReportSpotlight(content.markdown);
  const storyItems = spotlight
    ? []
    : content.executiveSummary.length
      ? content.executiveSummary.slice(0, 4)
      : isHtmlSource
        ? []
        : extractLeadParagraphsFromMarkdown(content.markdown, 3);
  const snapshotMetrics = isHtmlSource
    ? []
    : extractSnapshotMetricsFromMarkdown(content.markdown, 6);
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
          detail: copy(
            language,
            "Yuklenen gorsel adedi.",
            "Uploaded figure count."
          ),
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

  const galleryFigures: FlowGalleryFigure[] = content.figureFiles.map(
    fileName => {
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
    }
  );

  return {
    contentFormat: isHtmlSource ? "html" : "markdown",
    categoryLabel: copy(language, "Flow Post", "Flow Post"),
    emptyMessage: copy(
      language,
      "Kaynak icerik gosterilemedi.",
      "The source content could not be displayed."
    ),
    galleryFigures,
    headline: content.headline,
    html: content.html || "",
    markdown: content.markdown,
    metaItems,
    reportDateLabel: formatFlowReportDate(report.reportDate, locale),
    resolveImage: (src, alt) => {
      const resolved = resolveAssetSrc(
        assetBasePath,
        src,
        content.openAiFigureFiles
      );

      return {
        aiEnhanced: resolved.aiEnhanced,
        alt: alt || prettifyFigureLabel(src),
        label: resolved.aiEnhanced
          ? `${prettifyFigureLabel(src)} · OpenAI`
          : prettifyFigureLabel(src),
        src: resolved.src,
      };
    },
    sourceKindLabel: isHtmlSource
      ? copy(language, "HTML Dosyasi", "HTML File")
      : content.sourceKind === "file"
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
