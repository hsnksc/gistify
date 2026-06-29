import fs from "node:fs";
import path from "node:path";
import type {
  DailyReportRecord,
  DailyReportSourcePackage,
} from "../shared/dailyReports";
import {
  extractFlowTickerUniverseFromText,
  inferFlowTickerFromText,
} from "../shared/flowInference.ts";

function getConfiguredRootPath() {
  const configured = normalizeString(process.env.DAILY_REPORTS_PATH);
  if (!configured) {
    return path.resolve(process.cwd(), "dailyreport");
  }

  if (path.isAbsolute(configured)) {
    return configured;
  }

  return path.resolve(process.cwd(), configured);
}

function getConfiguredFlowRootPath() {
  return path.resolve(process.cwd(), "flow");
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function buildStableKey(value: string) {
  const slug = slugify(value);
  if (slug) {
    return slug;
  }

  const fallback = Buffer.from(value).toString("hex").slice(0, 16);
  return fallback ? `report-${fallback}` : "report";
}

function buildNamespacedSourceKey(namespace: string, value: string) {
  const normalizedNamespace = slugify(namespace) || "source";
  return `${normalizedNamespace}-${buildStableKey(value)}`;
}

function toIsoDateFromKey(sourceKey: string) {
  const match = sourceKey.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (!match) {
    return "";
  }

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function listFiles(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }

  return fs.readdirSync(folderPath, { withFileTypes: true });
}

const OPENAI_FIGURE_PATTERN = /\.openai\.(png|jpg|jpeg|webp)$/i;
const FIGURE_FILE_PATTERN = /\.(png|jpg|jpeg|webp)$/i;

const MONTH_TOKENS = new Map<string, string>([
  ["january", "01"],
  ["jan", "01"],
  ["ocak", "01"],
  ["february", "02"],
  ["feb", "02"],
  ["subat", "02"],
  ["mart", "03"],
  ["march", "03"],
  ["mar", "03"],
  ["april", "04"],
  ["apr", "04"],
  ["nisan", "04"],
  ["may", "05"],
  ["mayis", "05"],
  ["june", "06"],
  ["jun", "06"],
  ["haziran", "06"],
  ["july", "07"],
  ["jul", "07"],
  ["temmuz", "07"],
  ["august", "08"],
  ["aug", "08"],
  ["agustos", "08"],
  ["september", "09"],
  ["sep", "09"],
  ["sept", "09"],
  ["eylul", "09"],
  ["october", "10"],
  ["oct", "10"],
  ["ekim", "10"],
  ["november", "11"],
  ["nov", "11"],
  ["kasim", "11"],
  ["december", "12"],
  ["dec", "12"],
  ["aralik", "12"],
]);

const ENGLISH_MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const TURKISH_MONTH_NAMES = [
  "ocak",
  "subat",
  "mart",
  "nisan",
  "mayis",
  "haziran",
  "temmuz",
  "agustos",
  "eylul",
  "ekim",
  "kasim",
  "aralik",
];

function parseDateTokenFromFileName(fileName: string) {
  const baseName = path
    .basename(fileName, path.extname(fileName))
    .toLowerCase();
  const numericMatch = baseName.match(
    /(?:^|[_-])(\d{2})(\d{2})(\d{4})(?:$|[_-])/
  );
  if (numericMatch) {
    const [, day, month, year] = numericMatch;
    return `${year}-${month}-${day}`;
  }

  const compactNumericMatch = baseName.match(/(\d{2})(\d{2})(\d{4})/);
  if (compactNumericMatch) {
    const [, day, month, year] = compactNumericMatch;
    const numericDay = Number(day);
    const numericMonth = Number(month);
  if (
      Number.isInteger(numericDay) &&
      Number.isInteger(numericMonth) &&
      numericDay >= 1 &&
      numericDay <= 31 &&
      numericMonth >= 1 &&
      numericMonth <= 12
    ) {
      return `${year}-${month}-${day}`;
    }
  }

  const dayMonthNameMatch = baseName.match(
    /(?:^|[_-])(\d{1,2})[_-]?(january|jan|ocak|february|feb|subat|march|mar|mart|april|apr|nisan|may|mayis|june|jun|haziran|july|jul|temmuz|august|aug|agustos|september|sep|sept|eylul|october|oct|ekim|november|nov|kasim|december|dec|aralik)(?:[_-]?(\d{4}))?/i
  );
  if (dayMonthNameMatch) {
    const [, dayToken, monthToken, year] = dayMonthNameMatch;
    const month = MONTH_TOKENS.get(monthToken.toLowerCase());
    if (month && year) {
      return `${year}-${month}-${String(Number(dayToken)).padStart(2, "0")}`;
    }
  }

  const monthNameMatch = baseName.match(
    /(?:^|[_-])(january|jan|ocak|february|feb|subat|march|mar|mart|april|apr|nisan|may|mayis|june|jun|haziran|july|jul|temmuz|august|aug|agustos|september|sep|sept|eylul|october|oct|ekim|november|nov|kasim|december|dec|aralik)[_-]?(\d{1,2})(?:[_-]?(\d{4}))?/i
  );
  if (!monthNameMatch) {
    return "";
  }

  const month = MONTH_TOKENS.get(monthNameMatch[1].toLowerCase());
  const day = monthNameMatch[2]?.padStart(2, "0");
  const year = monthNameMatch[3];
  if (!month || !day || !year) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

function getMarkdownCandidateRank(fileName: string) {
  const normalized = fileName.toLowerCase();
  if (/nihai/i.test(normalized)) {
    return 5;
  }

  if (/_final\.md$/i.test(normalized)) {
    return 4;
  }

  if (/guncel/i.test(normalized)) {
    return 3;
  }

  if (/\.agent\.final\.converted\.md$/i.test(normalized)) {
    return 2;
  }

  if (/\.agent\.final\.md$/i.test(normalized)) {
    return 1;
  }

  return 0;
}

function isExcludedMarkdownCandidate(fileName: string) {
  return (
    !/\.md$/i.test(fileName) ||
    /^plan(?:[_-]|$)/i.test(fileName) ||
    /\.outline\.md$/i.test(fileName) ||
    /_sec\d+\.md$/i.test(fileName)
  );
}

function isExcludedFlowSourceFile(filePath: string) {
  const normalizedPath = filePath.replace(/\\/g, "/").toLowerCase();
  const baseName = path.posix.basename(normalizedPath);
  return (
    normalizedPath.startsWith("flowskill/") ||
    normalizedPath.includes("/flowskill/") ||
    !/\.(md|html)$/i.test(filePath) ||
    normalizedPath === "index.html" ||
    /^readme\.md$/i.test(baseName) ||
    /^_template\.md$/i.test(baseName) ||
    /^example\.md$/i.test(baseName) ||
    /^plan(?:[_-]|$)/i.test(baseName)
  );
}

function pickMainMarkdownFile(folderPath: string) {
  const folderDate = toIsoDateFromKey(path.basename(folderPath));
  const files = listFiles(folderPath)
    .filter(entry => entry.isFile() && !isExcludedMarkdownCandidate(entry.name))
    .map(entry => {
      const entryPath = path.join(folderPath, entry.name);
      const stats = fs.statSync(entryPath);
      const embeddedDate = parseDateTokenFromFileName(entry.name);
      return {
        name: entry.name,
        path: entryPath,
        embeddedDate,
        exactDateMatch: Boolean(folderDate && embeddedDate === folderDate),
        rank: getMarkdownCandidateRank(entry.name),
        mtimeMs: stats.mtimeMs,
      };
    })
    .sort((left, right) => {
      if (left.exactDateMatch !== right.exactDateMatch) {
        return left.exactDateMatch ? -1 : 1;
      }

      if (left.embeddedDate !== right.embeddedDate) {
        return right.embeddedDate.localeCompare(left.embeddedDate);
      }

      if (left.mtimeMs !== right.mtimeMs) {
        return right.mtimeMs - left.mtimeMs;
      }

      if (left.rank !== right.rank) {
        return right.rank - left.rank;
      }

      return right.name.localeCompare(left.name);
    });

  return files[0]?.path || null;
}

function normalizeParagraph(value: string) {
  return value
    .replace(/\[\^[^\]]+\^]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanMarkdownText(value: string) {
  return normalizeString(value).replace(/\*\*/g, "").replace(/`/g, "").trim();
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtmlTags(value: string) {
  return decodeHtmlEntities(
    normalizeString(value)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<\/tr>/gi, "\n")
      .replace(/<\/td>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function normalizeMetadataKey(value: string) {
  return cleanMarkdownText(value)
    .toLowerCase()
    .replace(/[ç]/g, "c")
    .replace(/[ğ]/g, "g")
    .replace(/[ı]/g, "i")
    .replace(/[İ]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ş]/g, "s")
    .replace(/[ü]/g, "u")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function appendMetadataItem(
  items: { label: string; value: string }[],
  label: string,
  value: string
) {
  const nextLabel = cleanMarkdownText(label);
  const nextValue = cleanMarkdownText(value);
  if (!nextLabel || !nextValue) {
    return;
  }

  const duplicate = items.some(
    item =>
      normalizeMetadataKey(item.label) === normalizeMetadataKey(nextLabel) &&
      item.value === nextValue
  );
  if (!duplicate) {
    items.push({ label: nextLabel, value: nextValue });
  }
}

function parseHeaderMetadata(markdown: string) {
  const metadataItems: { label: string; value: string }[] = [];
  const lines = markdown.split(/\r?\n/);
  const headerLines: string[] = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      if (headerLines.length >= 3) {
        break;
      }
      continue;
    }

    headerLines.push(trimmed);
    if (/^---+$/.test(trimmed) || headerLines.length >= 18) {
      break;
    }
  }

  let author = "";
  let coverage = "";
  let methodology = "";
  let reportDateLabel = "";
  let topic = "";

  for (const rawLine of headerLines) {
    const trimmed = rawLine.trim();
    if (!trimmed || /^#\s+/.test(trimmed)) {
      continue;
    }

    const cleanedLine = cleanMarkdownText(
      trimmed.replace(/^>\s*/, "").replace(/^#{2,6}\s+/, "")
    );
    if (!cleanedLine) {
      continue;
    }

    if (
      !topic &&
      /^##\s+/.test(trimmed) &&
      !/^(executive summary|ozet|özet|icindekiler|içindekiler)\b/i.test(
        cleanedLine
      )
    ) {
      topic = cleanedLine;
      appendMetadataItem(metadataItems, "Konu", topic);
    }

    const segments = cleanedLine
      .split("|")
      .map(segment => cleanMarkdownText(segment))
      .filter(Boolean);
    for (const segment of segments) {
      const match = segment.match(/^([^:]{2,40}):\s*(.+)$/);
      if (!match) {
        continue;
      }

      const rawLabel = cleanMarkdownText(match[1]);
      const rawValue = cleanMarkdownText(match[2]);
      const normalizedLabel = normalizeMetadataKey(rawLabel);

      if (!rawLabel || !rawValue) {
        continue;
      }

      if (["hazirlayan", "prepared by", "author"].includes(normalizedLabel)) {
        author ||= rawValue;
        appendMetadataItem(metadataItems, "Hazirlayan", rawValue);
        continue;
      }

      if (
        [
          "tarih",
          "rapor tarihi",
          "report date",
          "zaman damgasi",
          "timestamp",
        ].includes(normalizedLabel)
      ) {
        reportDateLabel ||= rawValue;
        appendMetadataItem(metadataItems, "Rapor Tarihi", rawValue);
        continue;
      }

      if (["kapsam", "coverage"].includes(normalizedLabel)) {
        coverage ||= rawValue;
        appendMetadataItem(metadataItems, "Kapsam", rawValue);
        continue;
      }

      if (["metodoloji", "methodology"].includes(normalizedLabel)) {
        methodology ||= rawValue;
        appendMetadataItem(metadataItems, "Metodoloji", rawValue);
        continue;
      }

      if (["konu", "tema", "subject", "topic"].includes(normalizedLabel)) {
        topic ||= rawValue;
        appendMetadataItem(metadataItems, "Konu", rawValue);
        continue;
      }

      if (
        ["guncelleme", "son guncelleme", "version", "versiyon"].includes(
          normalizedLabel
        )
      ) {
        appendMetadataItem(metadataItems, "Guncelleme", rawValue);
        continue;
      }

      if (["kaynaklar", "sources", "source"].includes(normalizedLabel)) {
        appendMetadataItem(metadataItems, "Kaynaklar", rawValue);
        continue;
      }

      appendMetadataItem(metadataItems, rawLabel, rawValue);
    }
  }

  return {
    author,
    coverage,
    methodology,
    reportDateLabel,
    topic,
    metadataItems,
  };
}

function parseDateTokenFromText(value: string) {
  const normalized = cleanMarkdownText(value)
    .toLowerCase()
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const match = normalized.match(
    /(\d{1,2})\s+(january|jan|ocak|february|feb|subat|march|mar|mart|april|apr|nisan|may|mayis|june|jun|haziran|july|jul|temmuz|august|aug|agustos|september|sep|sept|eylul|october|oct|ekim|november|nov|kasim|december|dec|aralik)\s+(\d{4})/i
  );
  if (!match) {
    return "";
  }

  const [, dayToken, monthToken, year] = match;
  const month = MONTH_TOKENS.get(monthToken.toLowerCase());
  if (!month) {
    return "";
  }

  return `${year}-${month}-${String(Number(dayToken)).padStart(2, "0")}`;
}

function parseIsoDateTokenFromText(value: string) {
  const normalized = cleanMarkdownText(value).trim();
  const match = normalized.match(/(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (!match) {
    return "";
  }

  const [, yearToken, monthToken, dayToken] = match;
  const year = Number(yearToken);
  const month = Number(monthToken);
  const day = Number(dayToken);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return "";
  }

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseMonthFirstDateTokenFromText(value: string) {
  const normalized = cleanMarkdownText(value)
    .toLowerCase()
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const match = normalized.match(
    /(january|jan|ocak|february|feb|subat|march|mar|mart|april|apr|nisan|may|mayis|june|jun|haziran|july|jul|temmuz|august|aug|agustos|september|sep|sept|eylul|october|oct|ekim|november|nov|kasim|december|dec|aralik)\s+(\d{1,2})\s+(\d{4})/i
  );
  if (!match) {
    return "";
  }

  const [, monthToken, dayToken, year] = match;
  const month = MONTH_TOKENS.get(monthToken.toLowerCase());
  if (!month) {
    return "";
  }

  return `${year}-${month}-${String(Number(dayToken)).padStart(2, "0")}`;
}

function parseAnyDateTokenFromText(value: string) {
  return (
    parseIsoDateTokenFromText(value) ||
    parseDateTokenFromText(value) ||
    parseMonthFirstDateTokenFromText(value)
  );
}

function extractNarrativeParagraphs(markdown: string, limit = 4) {
  return markdown
    .split(/\r?\n\s*\r?\n/)
    .map(chunk => normalizeParagraph(chunk))
    .filter(Boolean)
    .filter(
      chunk =>
        !chunk.startsWith("#") &&
        !chunk.startsWith("|") &&
        !chunk.startsWith("![") &&
        !chunk.startsWith(">") &&
        !/^\*\*(Tarih|Rapor Donemi|Rapor Dönemi|Haz[ıi]rlayan|Dosya|Versiyon|Kapsam|Metodoloji):/i.test(
          chunk
        )
    )
    .filter(chunk => chunk.length >= 60)
    .slice(0, limit)
    .map(chunk => chunk.replace(/^\*\*([^*]+):\*\*\s*/g, ""));
}

function extractMetadata(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const headerMetadata = parseHeaderMetadata(markdown);
  const title =
    lines
      .find(line => line.trim().startsWith("# "))
      ?.replace(/^#\s+/, "")
      .trim() || "Daily Report";
  const titleDateMatch = cleanMarkdownText(title).match(
    /\d{1,2}\s+[A-Za-zÇĞİÖŞÜçğıöşü]+\s+\d{4}/
  );
  const timestampMatch = markdown.match(/\*\*Zaman damgas[ıi]:\*\*\s*(.+)/i);
  const reportDateFieldMatch = markdown.match(/\*\*Tarih:\*\*\s*(.+)/i);
  const authorMatch = markdown.match(/\*\*Haz[ıi]rlayan:\*\*\s*(.+)/i);
  const coverageMatch = markdown.match(/\*\*Kapsam:\*\*\s*(.+)/i);
  const methodologyMatch = markdown.match(/\*\*Metodoloji:\*\*\s*(.+)/i);

  const summaryMatch = markdown.match(
    /#{1,3}\s+(Executive Summary|Ozet|Özet)\s+([\s\S]*?)(?:\n#{1,3}\s|\n---|\Z)/i
  );
  const executiveSummary = (summaryMatch?.[2] || "")
    .split(/\n\s*\n/)
    .map(chunk => normalizeParagraph(chunk))
    .filter(Boolean)
    .slice(0, 6);
  const narrativeParagraphs = extractNarrativeParagraphs(markdown, 4);
  const normalizedSummary = executiveSummary.length
    ? executiveSummary
    : narrativeParagraphs;

  const headline =
    normalizedSummary[0] ||
    headerMetadata.topic ||
    cleanMarkdownText(title) ||
    title;
  const reportDateLabel =
    cleanMarkdownText(titleDateMatch?.[0] || "") ||
    cleanMarkdownText(reportDateFieldMatch?.[1] || "") ||
    cleanMarkdownText(timestampMatch?.[1] || "") ||
    cleanMarkdownText(headerMetadata.reportDateLabel);

  const tickerToken = inferFlowTickerFromText(title);

  return {
    title,
    headline,
    author: headerMetadata.author || normalizeString(authorMatch?.[1]),
    coverage:
      headerMetadata.coverage ||
      normalizeString(coverageMatch?.[1]) ||
      (tickerToken
        ? tickerToken === "MARKET"
          ? "Theme: Market"
          : `Ticker: ${tickerToken}`
        : ""),
    methodology:
      headerMetadata.methodology || normalizeString(methodologyMatch?.[1]),
    metadataItems: headerMetadata.metadataItems,
    executiveSummary: normalizedSummary,
    reportDate: parseDateTokenFromText(reportDateLabel),
    reportDateLabel,
    tickerUniverse: tickerToken ? [tickerToken] : [],
  };
}

function extractHtmlTextByClass(html: string, className: string) {
  return stripHtmlTags(
    html.match(
      new RegExp(
        `<[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`,
        "i"
      )
    )?.[1] || ""
  );
}

function collectHtmlTextsByClass(html: string, className: string, limit = 6) {
  const pattern = new RegExp(
    `<[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`,
    "gi"
  );

  return Array.from(
    new Set(
      Array.from(html.matchAll(pattern))
        .map(match => stripHtmlTags(match[1] || ""))
        .filter(item => item.length >= 12)
    )
  ).slice(0, limit);
}

function extractHtmlTitle(html: string) {
  return (
    stripHtmlTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "") ||
    stripHtmlTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "") ||
    "Flow Report"
  );
}


function extractHtmlFigureFiles(html: string) {
  return Array.from(
    new Set(
      Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi))
        .map(match => normalizeRelativeAssetPath(match[1] || ""))
        .filter(Boolean)
        .filter(filePath => FIGURE_FILE_PATTERN.test(filePath))
        .filter(filePath => !/^(https?:)?\/\//i.test(filePath))
        .filter(filePath => !filePath.startsWith("data:"))
    )
  ).sort((left, right) => left.localeCompare(right));
}

function extractHtmlDateCandidates(html: string) {
  const metaDateContent = Array.from(
    html.matchAll(
      /<meta[^>]+(?:property|name)=["'](?:article:published_time|article:modified_time|og:updated_time|date|publish-date|published-date)["'][^>]+content=["']([^"']+)["'][^>]*>/gi
    )
  ).map(match => cleanMarkdownText(match[1] || ""));

  const timeDateContent = Array.from(
    html.matchAll(/<time[^>]+datetime=["']([^"']+)["'][^>]*>/gi)
  ).map(match => cleanMarkdownText(match[1] || ""));

  return dedupeFlowTexts(
    [
      ...metaDateContent,
      ...timeDateContent,
      extractHtmlTextByClass(html, "price-date"),
      extractHtmlTextByClass(html, "hero-date"),
      extractHtmlTextByClass(html, "date"),
      extractHtmlTextByClass(html, "meta"),
      extractHtmlTextByClass(html, "subtitle"),
      stripHtmlTags(html.match(/<header[^>]*>([\s\S]*?)<\/header>/i)?.[1] || ""),
      stripHtmlTags(html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i)?.[1] || ""),
    ].filter(Boolean),
    10,
    6
  );
}

function extractHtmlMetadata(html: string) {
  const title = extractHtmlTitle(html);
  const heroTitle =
    extractHtmlTextByClass(html, "hero-h") ||
    stripHtmlTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  const heroParagraphs = dedupeFlowTexts(
    collectHtmlTextsByClass(html, "hero-p", 4),
    4,
    24
  );
  const heroDescription =
    extractHtmlTextByClass(html, "hero-desc") || heroParagraphs[0] || "";
  const verdict = extractHtmlTextByClass(html, "verdict-val");
  const metaPills = dedupeFlowTexts(
    collectHtmlTextsByClass(html, "meta-pill", 6),
    6,
    16
  );
  const alertItems = dedupeFlowTexts(
    [
      ...collectHtmlTextsByClass(html, "alert", 6),
      ...collectHtmlTextsByClass(html, "ac", 6),
    ],
    6,
    24
  );
  const thesisItems = collectHtmlTextsByClass(html, "thesis-body", 4);
  const timelineItems = collectHtmlTextsByClass(html, "tl-body", 2);
  const sectionTitles = dedupeFlowTexts(
    [
      ...collectHtmlTextsByClass(html, "section-title", 8),
      ...collectHtmlTextsByClass(html, "st", 8),
    ],
    8,
    6
  )
    .map(item => item.split(/\s{2,}/)[0] || item)
    .filter(Boolean);
  const h1Text = heroTitle;
  const footerText = stripHtmlTags(
    html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i)?.[1] || ""
  );
  const dateCandidates = extractHtmlDateCandidates(html);
  const priceDate = extractHtmlTextByClass(html, "price-date");
  const primaryDateLabel = dateCandidates[0] || priceDate;
  const tickerToken = inferFlowTickerFromText(
    extractHtmlTextByClass(html, "hero-ticker").replace(/\$/g, ""),
    title,
    h1Text,
    heroDescription,
    verdict,
    footerText,
    primaryDateLabel,
    ...sectionTitles
  );
  const reportDate =
    dateCandidates.map(parseAnyDateTokenFromText).find(Boolean) ||
    parseAnyDateTokenFromText(title) ||
    parseAnyDateTokenFromText(h1Text) ||
    parseAnyDateTokenFromText(footerText);
  const metadataItems: { label: string; value: string }[] = [];

  if (verdict) {
    appendMetadataItem(metadataItems, "Verdict", verdict);
  }

  if (sectionTitles.length) {
    appendMetadataItem(metadataItems, "Sections", sectionTitles.join(" · "));
  }

  return {
    title,
    headline:
      heroDescription ||
      alertItems[0] ||
      verdict ||
      heroTitle ||
      cleanMarkdownText(title),
    author: "",
    coverage: tickerToken
      ? tickerToken === "MARKET"
        ? "Theme: Market"
        : `Ticker: ${tickerToken}`
      : "",
    methodology: "",
    metadataItems,
    executiveSummary: dedupeFlowTexts(
      [
        heroDescription,
        ...heroParagraphs,
        ...metaPills,
        ...alertItems,
        ...thesisItems,
        ...timelineItems,
      ].filter(Boolean),
      8,
      18
    ),
    reportDate,
    reportDateLabel: cleanMarkdownText(primaryDateLabel) || reportDate,
    tickerUniverse: tickerToken ? [tickerToken] : [],
    figureFiles: extractHtmlFigureFiles(html),
  };
}

function dedupeFlowTexts(values: string[], limit = 6, minLength = 24) {
  return Array.from(
    new Set(
      values
        .map(value => normalizeParagraph(value))
        .filter(value => value.length >= minLength)
    )
  ).slice(0, limit);
}

function truncateFlowCopy(value: string, limit = 220) {
  const normalized = normalizeParagraph(value);
  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

const IGNORED_FLOW_SITE_DOMAINS = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "cdn.jsdelivr.net",
  "cdnjs.cloudflare.com",
  "unpkg.com",
  "ajax.googleapis.com",
];

function isIgnoredFlowSiteDomain(value: string) {
  const normalized = normalizeString(value).toLowerCase();
  if (!normalized) {
    return false;
  }

  return IGNORED_FLOW_SITE_DOMAINS.some(
    domain => normalized === domain || normalized.endsWith(`.${domain}`)
  );
}

function extractFirstSiteDomain(value: string) {
  const normalized = normalizeString(value);
  if (!normalized) {
    return "";
  }

  const domainMatches = Array.from(
    normalized.matchAll(
      /(?:https?:\/\/)?([a-z0-9.-]+\.[a-z]{2,})(?:[/:?#\s]|$)/gi
    )
  );

  for (const match of domainMatches) {
    const domain = (match[1] || "").toLowerCase();
    if (domain && !isIgnoredFlowSiteDomain(domain)) {
      return domain;
    }
  }

  return "";
}

function extractFlowSiteLabelFromMarkdown(markdown: string) {
  const sourceMatch =
    markdown.match(/\*\*(?:Kaynaklar?|Sources?|Source|Site):\*\*\s*(.+)/i) ||
    markdown.match(/^(?:Kaynaklar?|Sources?|Source|Site)\s*:\s*(.+)$/im);

  const fromSourceLine = extractFirstSiteDomain(sourceMatch?.[1] || "");
  if (fromSourceLine) {
    return fromSourceLine;
  }

  const markdownLinkDomain = extractFirstSiteDomain(
    markdown.match(/\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/i)?.[1] || ""
  );
  if (markdownLinkDomain) {
    return markdownLinkDomain;
  }

  return "";
}

function extractFlowSiteLabelFromHtml(html: string) {
  const metaSite =
    normalizeString(
      html.match(
        /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i
      )?.[1]
    ) ||
    normalizeString(
      html.match(
        /<meta[^>]+name=["']application-name["'][^>]+content=["']([^"']+)["']/i
      )?.[1]
    );

  if (metaSite) {
    return metaSite;
  }

  const visibleSourceDomain = extractFirstSiteDomain(
    [
      ...collectHtmlTextsByClass(html, "src-note", 4),
      stripHtmlTags(html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i)?.[1] || ""),
      stripHtmlTags(html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || ""),
    ].join(" ")
  );
  if (visibleSourceDomain) {
    return visibleSourceDomain;
  }

  const firstDomain = extractFirstSiteDomain(html);
  if (firstDomain) {
    return firstDomain;
  }

  return "";
}

function simplifyFlowTitle(title: string, headline: string) {
  const normalizedTitle = cleanMarkdownText(title)
    .split("|")[0]
    ?.replace(/(?:\s+\$[A-Z][A-Z0-9.-]{0,9}\b)+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  const normalizedHeadline = cleanMarkdownText(headline);

  if (!normalizedTitle) {
    return normalizedHeadline || "Flow Post";
  }

  if (normalizedTitle.length > 120 && normalizedHeadline) {
    return truncateFlowCopy(normalizedHeadline, 110);
  }

  return normalizedTitle;
}

function formatFlowTickerLine(tickerUniverse: string[]) {
  if (!tickerUniverse.length) {
    return "$MARKET";
  }

  return tickerUniverse
    .map(ticker => (ticker === "MARKET" ? "$MARKET" : `$${ticker}`))
    .join(" · ");
}

function buildSimpleFlowMarkdown(options: {
  sourceLabel: string;
  title: string;
  headline: string;
  reportDate: string;
  reportDateLabel: string;
  siteLabel: string;
  tickerUniverse: string[];
  summaryItems: string[];
  narrativeParagraphs: string[];
}) {
  const lines: string[] = [`# ${options.title}`, ""];
  const siteLabel = options.siteLabel || "Manual source";
  const reportDateLabel = options.reportDateLabel || options.reportDate;
  const tickerLabel = formatFlowTickerLine(options.tickerUniverse);
  const lead = truncateFlowCopy(
    options.summaryItems[0] ||
      options.headline ||
      options.narrativeParagraphs[0] ||
      "Yeni Flow girdisi sayfa formatina uygun olarak normalize edildi.",
    320
  );
  const normalizedLead = normalizeParagraph(lead);
  const bulletItems = dedupeFlowTexts(
    [...options.summaryItems.slice(1), ...options.narrativeParagraphs].filter(
      item => normalizeParagraph(item) !== normalizedLead
    ),
    5,
    18
  ).map(item => truncateFlowCopy(item, 220));
  const bodyParagraphs = dedupeFlowTexts(
    options.narrativeParagraphs.filter(paragraph => paragraph !== lead),
    3,
    60
  ).map(item => truncateFlowCopy(item, 360));

  lines.push(`**Site:** ${siteLabel}`);
  lines.push(`**Haber Tarihi:** ${reportDateLabel}`);
  lines.push(`**Ticker:** ${tickerLabel}`);
  lines.push(`**Kaynak Dosya:** \`${options.sourceLabel}\``);
  lines.push("");

  if (lead) {
    lines.push("## Ozet");
    lines.push(lead);
    lines.push("");
  }

  if (bulletItems.length) {
    lines.push("## One Cikanlar");
    for (const bullet of bulletItems) {
      lines.push(`- ${bullet}`);
    }
    lines.push("");
  }

  if (bodyParagraphs.length) {
    lines.push("## Kisa Not");
    for (const paragraph of bodyParagraphs) {
      lines.push(paragraph);
      lines.push("");
    }
  }

  lines.push("## Kaynak");
  lines.push(
    `Bu post \`${options.sourceLabel}\` kaynagindan otomatik normalize edildi.`
  );

  return lines.join("\n").trim();
}

function buildFlowFileSourcePackage(options: {
  assetBasePath: string;
  figureFiles: string[];
  fileName: string;
  html: string;
  markdown: string;
  metadata: ReturnType<typeof extractMetadata> | ReturnType<typeof extractHtmlMetadata>;
  normalizedSourceKey: string;
  openAiFigureFiles: string[];
  reportDate: string;
  sourceKind: "file";
  sourceLabel: string;
  updatedAt: string;
}) {
  const {
    assetBasePath,
    figureFiles,
    fileName,
    html,
    markdown,
    metadata,
    normalizedSourceKey,
    openAiFigureFiles,
    reportDate,
    sourceKind,
    sourceLabel,
    updatedAt,
  } = options;
  const isHtmlSource = Boolean(html.trim());
  const narrativeParagraphs = dedupeFlowTexts(
    metadata.executiveSummary?.length
      ? metadata.executiveSummary
      : markdown
        ? extractNarrativeParagraphs(markdown, 5)
        : collectHtmlTextsByClass(html, "hero-p", 3),
    5,
    24
  );
  const tickerUniverse = extractFlowTickerUniverseFromText(
    sourceLabel,
    fileName,
    metadata.title,
    metadata.headline,
    metadata.coverage || "",
    ...narrativeParagraphs
  );
  const resolvedTickerUniverse = tickerUniverse.length ? tickerUniverse : ["MARKET"];
  const siteLabel = markdown
    ? extractFlowSiteLabelFromMarkdown(markdown)
    : extractFlowSiteLabelFromHtml(html);
  const title = simplifyFlowTitle(metadata.title, metadata.headline);
  const preferredHeadline =
    normalizeMetadataKey(metadata.headline) &&
    normalizeMetadataKey(metadata.headline) !== normalizeMetadataKey(metadata.title)
      ? metadata.headline
      : narrativeParagraphs[0] || metadata.headline || title;
  const sourceMetadataItems = [
    { label: "Site", value: siteLabel || "Manual source" },
    {
      label: "Haber Tarihi",
      value: metadata.reportDateLabel || reportDate,
    },
    {
      label: "Ticker",
      value: formatFlowTickerLine(resolvedTickerUniverse),
    },
    {
      label: "Kaynak Dosya",
      value: sourceLabel,
    },
  ];
  const executiveSummary = dedupeFlowTexts(
    [preferredHeadline, ...narrativeParagraphs],
    5,
    18
  ).map(item => truncateFlowCopy(item, 220));
  const normalizedMarkdown = buildSimpleFlowMarkdown({
    sourceLabel,
    title,
    headline: preferredHeadline,
    reportDate,
    reportDateLabel: metadata.reportDateLabel || reportDate,
    siteLabel,
    tickerUniverse: resolvedTickerUniverse,
    summaryItems: executiveSummary,
    narrativeParagraphs,
  });

  return {
    id: normalizedSourceKey,
    folderName: normalizedSourceKey,
    reportDate,
    title,
    headline: truncateFlowCopy(
      preferredHeadline || executiveSummary[0] || title,
      220
    ),
    author: metadata.author || undefined,
    coverage: resolvedTickerUniverse.length
      ? `Ticker: ${formatFlowTickerLine(resolvedTickerUniverse)}`
      : undefined,
    methodology: undefined,
    metadataItems: sourceMetadataItems,
    executiveSummary,
    markdown: isHtmlSource ? normalizedMarkdown : markdown || normalizedMarkdown,
    html,
    sectionFiles: [],
    figureFiles,
    openAiFigureFiles,
    tickerUniverse: resolvedTickerUniverse,
    researchFileCount: 0,
    updatedAt,
    sourceKind,
    contentFormat: isHtmlSource ? "html" : "markdown",
    sourceLabel,
    assetBasePath,
  } satisfies DailyReportSourcePackage;
}

export function createFlowSourcePackageFromContent(options: {
  fileName: string;
  html?: string;
  markdown?: string;
  sourceLabel?: string;
  updatedAt?: string;
}) {
  const html = options.html || "";
  const markdown = options.markdown || "";
  const isHtmlSource = Boolean(html.trim());
  const metadata = isHtmlSource ? extractHtmlMetadata(html) : extractMetadata(markdown);
  const updatedAt = options.updatedAt || new Date().toISOString();
  const reportDate =
    metadata.reportDate ||
    parseDateTokenFromFileName(path.basename(options.fileName)) ||
    updatedAt.slice(0, 10);

  return buildFlowFileSourcePackage({
    assetBasePath: "",
    figureFiles: [],
    fileName: options.fileName,
    html,
    markdown,
    metadata,
    normalizedSourceKey: buildNamespacedSourceKey("flow", options.sourceLabel || options.fileName),
    openAiFigureFiles: [],
    reportDate,
    sourceKind: "file",
    sourceLabel: options.sourceLabel || options.fileName,
    updatedAt,
  });
}

function listSectionFiles(folderPath: string) {
  return listFiles(folderPath)
    .filter(
      entry =>
        entry.isFile() &&
        (/^momentum_raporu_sec\d+\.md$/i.test(entry.name) ||
          /_sec\d+\.md$/i.test(entry.name))
    )
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function listRelativeFilesRecursive(
  folderPath: string,
  predicate: (filePath: string) => boolean,
  basePath = folderPath
) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }

  const items: string[] = [];

  for (const entry of fs.readdirSync(folderPath, { withFileTypes: true })) {
    const entryPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      items.push(...listRelativeFilesRecursive(entryPath, predicate, basePath));
      continue;
    }

    if (entry.isFile() && predicate(entryPath)) {
      items.push(path.relative(basePath, entryPath).replace(/\\/g, "/"));
    }
  }

  return items.sort((left, right) => left.localeCompare(right));
}

function normalizeRelativeAssetPath(value: string) {
  return value
    .replace(/\\/g, "/")
    .replace(/^\.\/+/, "")
    .replace(/^\/+/, "")
    .trim();
}

function extractMarkdownFigureFiles(markdown: string) {
  const matches = Array.from(markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g));

  return Array.from(
    new Set(
      matches
        .map(match => normalizeRelativeAssetPath(match[1] || ""))
        .filter(Boolean)
        .filter(filePath => FIGURE_FILE_PATTERN.test(filePath))
        .filter(filePath => !/^(https?:)?\/\//i.test(filePath))
        .filter(filePath => !filePath.startsWith("data:"))
    )
  ).sort((left, right) => left.localeCompare(right));
}

function filterAvailableFigureFiles(folderPath: string, figureFiles: string[]) {
  return figureFiles.filter(fileName => {
    const resolvedPath = path.resolve(folderPath, fileName);
    const relative = path.relative(folderPath, resolvedPath);

    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return false;
    }

    return fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile();
  });
}

function buildResearchFolderNameCandidates(reportDate: string) {
  const match = reportDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return [];
  }

  const [, year, month, day] = match;
  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex >= ENGLISH_MONTH_NAMES.length) {
    return [];
  }

  const numericDay = String(Number(day));
  return [
    `${ENGLISH_MONTH_NAMES[monthIndex]}${numericDay}`,
    `${ENGLISH_MONTH_NAMES[monthIndex].slice(0, 3)}${numericDay}`,
    `${TURKISH_MONTH_NAMES[monthIndex]}${numericDay}`,
    `${day}${month}${year}`,
    `${year}-${month}-${day}`,
  ].map(value => value.toLowerCase());
}

function findResearchScopedFolderPath(folderPath: string, reportDate: string) {
  const researchPath = path.join(folderPath, "research");
  if (!fs.existsSync(researchPath)) {
    return null;
  }

  const candidateTokens = new Set(
    buildResearchFolderNameCandidates(reportDate)
  );
  if (!candidateTokens.size) {
    return null;
  }

  const matchedFolder = listFiles(researchPath).find(
    entry =>
      entry.isDirectory() && candidateTokens.has(entry.name.toLowerCase())
  );
  if (!matchedFolder) {
    return null;
  }

  return path.join(researchPath, matchedFolder.name);
}

function resolveResearchDataPath(folderPath: string, reportDate: string) {
  const researchPath = path.join(folderPath, "research");
  if (!fs.existsSync(researchPath)) {
    return null;
  }

  return findResearchScopedFolderPath(folderPath, reportDate) || researchPath;
}

function findResearchScopedFigureFiles(folderPath: string, reportDate: string) {
  const scopedResearchPath = findResearchScopedFolderPath(
    folderPath,
    reportDate
  );
  if (!scopedResearchPath) {
    return [];
  }

  return listRelativeFilesRecursive(
    scopedResearchPath,
    filePath =>
      FIGURE_FILE_PATTERN.test(filePath) &&
      !OPENAI_FIGURE_PATTERN.test(filePath),
    folderPath
  );
}

function listFigureFiles(folderPath: string) {
  return listRelativeFilesRecursive(
    folderPath,
    filePath =>
      FIGURE_FILE_PATTERN.test(filePath) &&
      !OPENAI_FIGURE_PATTERN.test(filePath)
  );
}

function listOpenAiFigureFiles(folderPath: string) {
  return listRelativeFilesRecursive(folderPath, filePath =>
    OPENAI_FIGURE_PATTERN.test(filePath)
  );
}

function listRootFigureFiles(
  rootPath: string,
  baseName: string,
  includeOpenAiVariants = false
) {
  return listFiles(rootPath)
    .filter(
      entry =>
        entry.isFile() &&
        FIGURE_FILE_PATTERN.test(entry.name) &&
        (includeOpenAiVariants
          ? OPENAI_FIGURE_PATTERN.test(entry.name)
          : !OPENAI_FIGURE_PATTERN.test(entry.name)) &&
        entry.name.toLowerCase().startsWith(baseName.toLowerCase())
    )
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function listSiblingFigureFiles(
  folderPath: string,
  baseName: string,
  includeOpenAiVariants = false
) {
  return listFiles(folderPath)
    .filter(
      entry =>
        entry.isFile() &&
        FIGURE_FILE_PATTERN.test(entry.name) &&
        (includeOpenAiVariants
          ? OPENAI_FIGURE_PATTERN.test(entry.name)
          : !OPENAI_FIGURE_PATTERN.test(entry.name)) &&
        entry.name.toLowerCase().startsWith(baseName.toLowerCase())
    )
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function isLikelyTickerToken(value: string) {
  if (!value || !/^[A-Z]{1,5}(?:\.[A-Z]{1,2})?$/.test(value)) {
    return false;
  }

  const normalized = value.toLowerCase();
  if (MONTH_TOKENS.has(normalized)) {
    return false;
  }

  return ![
    "chart",
    "daily",
    "report",
    "research",
    "plan",
    "final",
    "guncel",
    "nihai",
    "insight",
  ].includes(normalized);
}

function extractTickerCandidateFromFile(filePath: string) {
  const baseName = path.basename(filePath, path.extname(filePath));
  if (!baseName || /^chart\d+/i.test(baseName)) {
    return "";
  }

  const firstToken = baseName.split(/[_-]/)[0]?.trim().toUpperCase() || "";
  return isLikelyTickerToken(firstToken) ? firstToken : "";
}

function listTickerUniverse(researchPath: string) {
  if (!fs.existsSync(researchPath)) {
    return [];
  }

  const tickerSet = new Set(
    listRelativeFilesRecursive(researchPath, filePath =>
      /\.csv$/i.test(filePath)
    )
      .map(extractTickerCandidateFromFile)
      .filter(Boolean)
  );

  return Array.from(tickerSet).sort((left, right) => left.localeCompare(right));
}

function countResearchFiles(researchPath: string) {
  if (!fs.existsSync(researchPath)) {
    return 0;
  }

  return listRelativeFilesRecursive(researchPath, filePath =>
    /\.(md|csv)$/i.test(filePath)
  ).length;
}

export function getDailyReportRootPath() {
  return getConfiguredRootPath();
}

export function getFlowReportRootPath() {
  return getConfiguredFlowRootPath();
}

function buildFolderSourcePackage(folderName: string) {
  const folderPath = path.join(getDailyReportRootPath(), folderName);
  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    return null;
  }

  const mainMarkdownPath = pickMainMarkdownFile(folderPath);
  if (!mainMarkdownPath) {
    return null;
  }

  const markdown = fs.readFileSync(mainMarkdownPath, "utf8");
  const metadata = extractMetadata(markdown);
  const researchPath = path.join(folderPath, "research");
  const stats = fs.statSync(mainMarkdownPath);
  const reportDate =
    metadata.reportDate ||
    parseDateTokenFromFileName(path.basename(mainMarkdownPath)) ||
    toIsoDateFromKey(folderName) ||
    new Date(stats.mtimeMs).toISOString().slice(0, 10);
  const markdownFigureFiles = filterAvailableFigureFiles(
    folderPath,
    extractMarkdownFigureFiles(markdown)
  );
  const researchScopedFigureFiles = findResearchScopedFigureFiles(
    folderPath,
    reportDate
  );
  const researchDataPath =
    resolveResearchDataPath(folderPath, reportDate) || researchPath;
  const figureFiles = markdownFigureFiles.length
    ? markdownFigureFiles
    : researchScopedFigureFiles.length
      ? researchScopedFigureFiles
      : listFigureFiles(folderPath);

  return {
    id: folderName,
    folderName,
    reportDate,
    title: metadata.title,
    headline: metadata.headline,
    author: metadata.author || undefined,
    coverage: metadata.coverage || undefined,
    methodology: metadata.methodology || undefined,
    metadataItems: metadata.metadataItems,
    executiveSummary: metadata.executiveSummary,
    markdown,
    html: "",
    sectionFiles: listSectionFiles(folderPath),
    figureFiles,
    openAiFigureFiles: filterAvailableFigureFiles(
      folderPath,
      figureFiles.map(fileName =>
        buildDailyReportOpenAiFigureFileName(fileName)
      )
    ),
    tickerUniverse: listTickerUniverse(researchDataPath),
    researchFileCount: countResearchFiles(researchDataPath),
    updatedAt: new Date(stats.mtimeMs).toISOString(),
    sourceKind: "folder",
    contentFormat: "markdown",
    sourceLabel: folderName,
    assetBasePath: folderName,
  } satisfies DailyReportSourcePackage;
}

function buildFileSourcePackage({
  rootPath,
  fileName,
  namespace,
  sourceLabelPrefix,
  assetBasePath = "",
}: {
  rootPath: string;
  fileName: string;
  namespace?: string;
  sourceLabelPrefix?: string;
  assetBasePath?: string;
}) {
  const filePath = path.join(rootPath, fileName);
  const sourceDirectoryPath = path.dirname(filePath);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return null;
  }

  const fileExt = path.extname(fileName).toLowerCase();
  if (!/\.(md|html)$/i.test(fileExt)) {
    return null;
  }

  const sourceKey = path.basename(fileName, fileExt);
  const relativeSourceKey = fileName
    .replace(/\\/g, "/")
    .replace(/\.[^/.]+$/i, "");
  const isHtmlSource = fileExt === ".html";
  const fileContents = fs.readFileSync(filePath, "utf8");
  const markdown = isHtmlSource ? "" : fileContents;
  const html = isHtmlSource ? fileContents : "";
  const htmlMetadata = isHtmlSource ? extractHtmlMetadata(html) : null;
  const metadata = htmlMetadata || extractMetadata(markdown);
  const stats = fs.statSync(filePath);
  const normalizedSourceKey = namespace
    ? buildNamespacedSourceKey(namespace, relativeSourceKey)
    : sourceKey;
  const reportDate =
    metadata.reportDate ||
    parseDateTokenFromFileName(path.basename(fileName)) ||
    toIsoDateFromKey(sourceKey) ||
    new Date(stats.mtimeMs).toISOString().slice(0, 10);
  const markdownFigureFiles = isHtmlSource
    ? []
    : filterAvailableFigureFiles(
        sourceDirectoryPath,
        extractMarkdownFigureFiles(markdown)
      );
  const htmlFigureFiles = isHtmlSource
    ? filterAvailableFigureFiles(
        sourceDirectoryPath,
        htmlMetadata?.figureFiles || []
      )
    : [];
  const figureFiles = isHtmlSource
    ? htmlFigureFiles
    : markdownFigureFiles.length
      ? markdownFigureFiles
      : listSiblingFigureFiles(sourceDirectoryPath, sourceKey);
  const sourceLabel = sourceLabelPrefix
    ? `${sourceLabelPrefix}/${fileName}`
    : fileName;
  const openAiFigureFiles = filterAvailableFigureFiles(
    sourceDirectoryPath,
    figureFiles.map(fileName =>
      buildDailyReportOpenAiFigureFileName(fileName)
    )
  );
  const updatedAt = new Date(stats.mtimeMs).toISOString();

  if (namespace === "flow") {
    return buildFlowFileSourcePackage({
      assetBasePath,
      figureFiles,
      fileName,
      html,
      markdown,
      metadata,
      normalizedSourceKey,
      openAiFigureFiles,
      reportDate,
      sourceKind: "file",
      sourceLabel,
      updatedAt,
    });
  }

  return {
    id: normalizedSourceKey,
    folderName: normalizedSourceKey,
    reportDate,
    title: metadata.title,
    headline: metadata.headline,
    author: metadata.author || undefined,
    coverage: metadata.coverage || undefined,
    methodology: metadata.methodology || undefined,
    metadataItems: metadata.metadataItems,
    executiveSummary: metadata.executiveSummary,
    markdown,
    html,
    sectionFiles: [],
    figureFiles,
    openAiFigureFiles,
    tickerUniverse: metadata.tickerUniverse || [],
    researchFileCount: 0,
    updatedAt,
    sourceKind: "file",
    contentFormat: isHtmlSource ? "html" : "markdown",
    sourceLabel,
    assetBasePath,
  } satisfies DailyReportSourcePackage;
}

export function listDailyReportSourcePackages() {
  const rootPath = getDailyReportRootPath();
  const packages: DailyReportSourcePackage[] = [];
  if (fs.existsSync(rootPath)) {
    const entries = fs.readdirSync(rootPath, { withFileTypes: true });
    const folders = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    const rootMarkdownFiles = entries
      .filter(entry => entry.isFile() && /^\d{8}\.md$/i.test(entry.name))
      .map(entry => entry.name);

    for (const folderName of folders) {
      const source = buildFolderSourcePackage(folderName);
      if (source) {
        packages.push(source);
      }
    }

    for (const fileName of rootMarkdownFiles) {
      const source = buildFileSourcePackage({ rootPath, fileName });
      if (source) {
        packages.push(source);
      }
    }
  }

  const flowRootPath = getFlowReportRootPath();
  if (fs.existsSync(flowRootPath)) {
    const flowSourceFiles = listRelativeFilesRecursive(flowRootPath, filePath =>
      /\.(md|html)$/i.test(filePath)
    ).filter(fileName => !isExcludedFlowSourceFile(fileName));

    for (const fileName of flowSourceFiles) {
      const flowDirectory = path.posix.dirname(fileName);
      const source = buildFileSourcePackage({
        rootPath: flowRootPath,
        fileName,
        namespace: "flow",
        sourceLabelPrefix: "flow",
        assetBasePath:
          flowDirectory && flowDirectory !== "."
            ? path.posix.join("flow", flowDirectory)
            : "flow",
      });
      if (source) {
        packages.push(source);
      }
    }
  }

  return packages.sort((left, right) => {
    const byDate = right.reportDate.localeCompare(left.reportDate);
    if (byDate !== 0) {
      return byDate;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

export function getDailyReportSourcePackage(sourceId: string) {
  const safeSourceId = normalizeString(sourceId);
  if (!safeSourceId) {
    return null;
  }

  return (
    listDailyReportSourcePackages().find(
      source => source.id === safeSourceId
    ) || null
  );
}

export function buildDailyReportRecordFromSource(
  source: DailyReportSourcePackage,
  authorEmail: string,
  previousRecord?: DailyReportRecord | null
) {
  const nowIso = new Date().toISOString();

  return {
    id: previousRecord?.id || `daily-report-${source.folderName}`,
    slug:
      previousRecord?.slug || slugify(`${source.reportDate}-${source.title}`),
    title: source.title,
    reportDate: source.reportDate,
    status: previousRecord?.status || "draft",
    authorEmail: previousRecord?.authorEmail || authorEmail,
    sourceFolder: source.folderName,
    createdAt: previousRecord?.createdAt || nowIso,
    updatedAt: nowIso,
    publishedAt: previousRecord?.publishedAt,
    content: {
      headline: source.headline,
      author: source.author,
      coverage: source.coverage,
      methodology: source.methodology,
      metadataItems: source.metadataItems,
      executiveSummary: source.executiveSummary,
      markdown: source.markdown,
      html: source.html,
      sectionFiles: source.sectionFiles,
      figureFiles: source.figureFiles,
      openAiFigureFiles: source.openAiFigureFiles,
      tickerUniverse: source.tickerUniverse,
      researchFileCount: source.researchFileCount,
      sourceKind: source.sourceKind,
      contentFormat: source.contentFormat,
      sourceLabel: source.sourceLabel,
      assetBasePath: source.assetBasePath,
    },
  } satisfies DailyReportRecord;
}

export function buildDailyReportOpenAiFigureFileName(fileName: string) {
  const normalized = normalizeRelativeAssetPath(fileName);
  if (!normalized) {
    return "";
  }

  const parsed = path.posix.parse(normalized);
  const baseName = parsed.name.replace(/\.openai$/i, "");
  const nextFileName = `${baseName}.openai.png`;

  return parsed.dir ? path.posix.join(parsed.dir, nextFileName) : nextFileName;
}

export function resolveDailyReportSourceAssetPath(
  sourceId: string,
  relativeAssetPath: string
) {
  const source = getDailyReportSourcePackage(sourceId);
  if (!source) {
    return null;
  }

  const normalized = normalizeRelativeAssetPath(relativeAssetPath);
  if (!normalized || normalized.includes("..")) {
    return null;
  }

  const assetRootPath =
    source.sourceKind === "folder"
      ? path.join(getDailyReportRootPath(), source.folderName)
      : source.assetBasePath
        ? path.resolve(process.cwd(), source.assetBasePath)
        : getDailyReportRootPath();
  const resolvedPath = path.resolve(assetRootPath, normalized);
  const relative = path.relative(assetRootPath, resolvedPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    return null;
  }

  return resolvedPath;
}
