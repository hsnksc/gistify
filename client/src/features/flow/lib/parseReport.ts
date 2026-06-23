import {
  analyzeFlowReportLanguage,
  type FlowReportLanguageMode,
  type FlowReportTranslationState,
} from "@shared/flowLanguage";

export type ReportRecommendation = "BUY" | "HOLD" | "SELL" | null;
export type ReportKind = "stock" | "daily";

export interface ReportMeta {
  companyName: string;
  exchange: string;
  fileName: string;
  hasCharts: boolean;
  price: number | null;
  priceChangePct: number | null;
  rawHtml: string;
  recommendation: ReportRecommendation;
  reportDate: string;
  reportKind: ReportKind;
  languageMode: FlowReportLanguageMode;
  translationState: FlowReportTranslationState;
  sections: string[];
  ticker: string;
}

export interface StoredReportRecord extends ReportMeta {
  duplicateOf: string | null;
  id: string;
  loadedAt: string;
  sourceLabel: string;
  sourceType: "server" | "upload";
  serverReportId: string | null;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function safeUpperTicker(value: string) {
  return normalizeWhitespace(value).toUpperCase().replace(/[^A-Z0-9.-]/g, "");
}

function dedupe(values: string[]) {
  return Array.from(
    new Set(
      values
        .map(value => normalizeWhitespace(value))
        .filter(Boolean)
    )
  );
}

function parseDecimal(value: string) {
  const normalized = value
    .replace(/[^\d,.-]/g, "")
    .replace(/,(?=\d{3}\b)/g, "")
    .replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDateFromFileName(fileName: string, fallbackDate: string) {
  const match = fileName.match(/(\d{2})(\d{2})(\d{4})/);
  if (!match) {
    return fallbackDate;
  }

  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}`;
  const parsed = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? fallbackDate : iso;
}

const DAILY_REPORT_KEYWORDS = [
  "abd piyasalari",
  "us markets",
  "market report",
  "close report",
  "kapanis raporu",
  "gunluk rapor",
  "pre-market",
  "premarket",
];

function normalizeReportKindText(value: string) {
  return normalizeWhitespace(value)
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
}

function isDailyReportText(value: string) {
  const normalized = normalizeReportKindText(value);
  return Boolean(
    normalized &&
      DAILY_REPORT_KEYWORDS.some(keyword => normalized.includes(keyword))
  );
}

function detectReportKind({
  bodyText,
  fileName,
  titleText,
}: {
  bodyText: string;
  fileName: string;
  titleText: string;
}): ReportKind {
  const candidates = [fileName, titleText, bodyText];
  return candidates.some(isDailyReportText) ? "daily" : "stock";
}

function extractTitleParts(titleText: string, reportKind: ReportKind) {
  const normalized = normalizeWhitespace(titleText);
  if (reportKind === "daily") {
    return {
      companyName: normalized,
      ticker: "MARKET",
    };
  }

  const titleMatch = normalized.match(
    /^([A-Z0-9.-]{1,10})\s*[—-]\s*(.+?)(?:\s+Advanced\s+Analysis\s+Report)?$/i
  );

  if (titleMatch) {
    return {
      companyName: normalizeWhitespace(titleMatch[2]),
      ticker: safeUpperTicker(titleMatch[1]),
    };
  }

  const fallbackTicker = safeUpperTicker(normalized.split(/[\s—-]/)[0] || "");
  return {
    companyName: normalized.replace(/^[A-Z0-9.-]+\s*[—-]?\s*/i, "").trim(),
    ticker: fallbackTicker,
  };
}

function findExchange(documentNode: Document) {
  const selectors = [
    ".ticker-label",
    ".exchange",
    "[data-exchange]",
    ".hero-meta",
    ".hero-subtitle",
  ];

  for (const selector of selectors) {
    const value = normalizeWhitespace(
      documentNode.querySelector(selector)?.textContent || ""
    );
    const match = value.match(/\b(NASDAQ|NYSE|AMEX|BATS|OTC|BIST)\b/i);
    if (match) {
      return match[1].toUpperCase();
    }
  }

  const bodyText = normalizeWhitespace(documentNode.body.textContent || "");
  const bodyMatch = bodyText.match(/\b(NASDAQ|NYSE|AMEX|BATS|OTC|BIST)\b/i);
  return bodyMatch ? bodyMatch[1].toUpperCase() : "";
}

function findPrice(documentNode: Document) {
  const selectors = [
    "#price-counter",
    "[data-price]",
    ".price-counter",
    ".current-price",
    ".hero-price",
  ];

  for (const selector of selectors) {
    const text = normalizeWhitespace(
      documentNode.querySelector(selector)?.textContent || ""
    );
    const parsed = parseDecimal(text);
    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

function findPriceChangePct(documentNode: Document) {
  const selectors = [
    ".price-change",
    ".price-change-pct",
    ".change",
    ".hero-change",
    "[data-change]",
  ];

  for (const selector of selectors) {
    const text = normalizeWhitespace(
      documentNode.querySelector(selector)?.textContent || ""
    );
    const match = text.match(/[-+]?\d+(?:[.,]\d+)?\s*%/);
    const parsed = parseDecimal(match?.[0] || "");
    if (parsed !== null) {
      return parsed;
    }
  }

  const bodyText = normalizeWhitespace(documentNode.body.textContent || "");
  const bodyMatch = bodyText.match(/[-+]?\d+(?:[.,]\d+)?\s*%/);
  return parseDecimal(bodyMatch?.[0] || "");
}

function normalizeRecommendation(value: string): ReportRecommendation {
  const normalized = normalizeWhitespace(value).toLowerCase();
  if (!normalized) {
    return null;
  }

  if (
    /\b(strong buy|moderate buy|buy|bullish|al)\b/.test(normalized) &&
    !/\b(sell|sat)\b/.test(normalized)
  ) {
    return "BUY";
  }

  if (/\b(hold|neutral|tut)\b/.test(normalized)) {
    return "HOLD";
  }

  if (/\b(strong sell|moderate sell|sell|bearish|sat)\b/.test(normalized)) {
    return "SELL";
  }

  return null;
}

function findRecommendation(documentNode: Document) {
  const selectors = [
    "#recommendation",
    '[href="#recommendation"]',
    ".recommendation",
    "[data-recommendation]",
    ".verdict",
  ];

  for (const selector of selectors) {
    const text = normalizeWhitespace(
      documentNode.querySelector(selector)?.textContent || ""
    );
    const normalized = normalizeRecommendation(text);
    if (normalized) {
      return normalized;
    }
  }

  return normalizeRecommendation(documentNode.body.textContent || "");
}

function collectSections(documentNode: Document) {
  const knownIds = [
    "fundamentals",
    "technical",
    "news",
    "analysts",
    "risk",
    "recommendation",
    "options",
  ];

  const sectionIds = documentNode.querySelectorAll<HTMLElement>("section[id]");
  const navLinks = documentNode.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

  return dedupe([
    ...knownIds.filter(id => Boolean(documentNode.getElementById(id))),
    ...Array.from(sectionIds).map(section => section.id),
    ...Array.from(navLinks)
      .map(link => (link.getAttribute("href") || "").replace(/^#/, ""))
      .filter(Boolean),
  ]);
}

function detectCharts(documentNode: Document, rawHtml: string) {
  if (documentNode.querySelector("canvas")) {
    return true;
  }

  return /(Chart\.js|new\s+Chart\s*\(|perfChart|revenueChart|incomeChart|volumeChart|ratingsChart|riskChart|macroChart)/i.test(
    rawHtml
  );
}

export function parseReportHtml({
  fallbackDate,
  fileName,
  html,
}: {
  fallbackDate: string;
  fileName: string;
  html: string;
}): ReportMeta {
  const defaultDate = fallbackDate || new Date().toISOString().slice(0, 10);

  if (typeof window === "undefined") {
    const reportKind = detectReportKind({
      bodyText: html,
      fileName,
      titleText: "",
    });
    const languageInfo = analyzeFlowReportLanguage({
      contentFormat: "html",
      html,
      sourceLabel: fileName,
      title: "",
    });
    return {
      companyName: "",
      exchange: "",
      fileName,
      hasCharts: /<canvas|Chart\.js|new\s+Chart\s*\(/i.test(html),
      languageMode: languageInfo.languageMode,
      price: null,
      priceChangePct: null,
      rawHtml: html,
      recommendation: null,
      reportDate: parseDateFromFileName(fileName, defaultDate),
      reportKind,
      translationState: languageInfo.translationState,
      sections: [],
      ticker:
        reportKind === "daily"
          ? "MARKET"
          : safeUpperTicker(fileName.replace(/\.[a-z0-9]+$/i, "")) || "FLOW",
    };
  }

  try {
    const parser = new DOMParser();
    const documentNode = parser.parseFromString(html, "text/html");
    const titleText = normalizeWhitespace(documentNode.title || "");
    const reportKind = detectReportKind({
      bodyText: documentNode.body.textContent || "",
      fileName,
      titleText,
    });
    const languageInfo = analyzeFlowReportLanguage({
      contentFormat: "html",
      html,
      sourceLabel: fileName,
      title: titleText,
    });
    const titleParts = extractTitleParts(titleText, reportKind);
    const fallbackTicker =
      reportKind === "daily"
        ? "MARKET"
        : safeUpperTicker(fileName.replace(/\.[a-z0-9]+$/i, "")) ||
          titleParts.ticker ||
          "FLOW";

    return {
      companyName: titleParts.companyName,
      exchange: findExchange(documentNode),
      fileName,
      hasCharts: detectCharts(documentNode, html),
      languageMode: languageInfo.languageMode,
      price: findPrice(documentNode),
      priceChangePct: findPriceChangePct(documentNode),
      rawHtml: html,
      recommendation: findRecommendation(documentNode),
      reportDate: parseDateFromFileName(fileName, defaultDate),
      reportKind,
      translationState: languageInfo.translationState,
      sections: collectSections(documentNode),
      ticker: titleParts.ticker || fallbackTicker,
    };
  } catch {
    const reportKind = detectReportKind({
      bodyText: html,
      fileName,
      titleText: "",
    });
    const languageInfo = analyzeFlowReportLanguage({
      contentFormat: "html",
      html,
      sourceLabel: fileName,
      title: "",
    });
    return {
      companyName: "",
      exchange: "",
      fileName,
      hasCharts: /<canvas|Chart\.js|new\s+Chart\s*\(/i.test(html),
      languageMode: languageInfo.languageMode,
      price: null,
      priceChangePct: null,
      rawHtml: html,
      recommendation: null,
      reportDate: parseDateFromFileName(fileName, defaultDate),
      reportKind,
      translationState: languageInfo.translationState,
      sections: [],
      ticker:
        reportKind === "daily"
          ? "MARKET"
          : safeUpperTicker(fileName.replace(/\.[a-z0-9]+$/i, "")) || "FLOW",
    };
  }
}
