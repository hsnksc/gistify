import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type {
  MomentumSourceRecord,
  MomentumSourceSummary,
} from "../shared/momentumSources";

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanText(value: string) {
  return normalizeString(value)
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ");
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
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const MONTH_TOKENS = new Map<string, string>([
  ["january", "01"],
  ["jan", "01"],
  ["ocak", "01"],
  ["oca", "01"],
  ["february", "02"],
  ["feb", "02"],
  ["şubat", "02"],
  ["subat", "02"],
  ["şub", "02"],
  ["sub", "02"],
  ["march", "03"],
  ["mar", "03"],
  ["mart", "03"],
  ["april", "04"],
  ["apr", "04"],
  ["nisan", "04"],
  ["nis", "04"],
  ["may", "05"],
  ["mayis", "05"],
  ["mayıs", "05"],
  ["june", "06"],
  ["jun", "06"],
  ["haziran", "06"],
  ["haz", "06"],
  ["july", "07"],
  ["jul", "07"],
  ["temmuz", "07"],
  ["tem", "07"],
  ["august", "08"],
  ["aug", "08"],
  ["agustos", "08"],
  ["ağustos", "08"],
  ["agu", "08"],
  ["september", "09"],
  ["sep", "09"],
  ["sept", "09"],
  ["eylul", "09"],
  ["eylül", "09"],
  ["eyl", "09"],
  ["october", "10"],
  ["oct", "10"],
  ["ekim", "10"],
  ["eki", "10"],
  ["november", "11"],
  ["nov", "11"],
  ["kasim", "11"],
  ["kasım", "11"],
  ["kas", "11"],
  ["december", "12"],
  ["dec", "12"],
  ["aralik", "12"],
  ["aralık", "12"],
  ["ara", "12"],
]);

const MONTH_DISPLAY_LABELS = new Map<string, string>([
  ["01", "Oca"],
  ["02", "Sub"],
  ["03", "Mar"],
  ["04", "Nis"],
  ["05", "May"],
  ["06", "Haz"],
  ["07", "Tem"],
  ["08", "Agu"],
  ["09", "Eyl"],
  ["10", "Eki"],
  ["11", "Kas"],
  ["12", "Ara"],
]);

function buildSourceId(fileName: string) {
  const baseName = path.basename(fileName, path.extname(fileName));
  const slug = slugify(baseName) || "momentum-report";
  const hash = crypto.createHash("sha1").update(fileName).digest("hex").slice(0, 8);
  return `${slug}-${hash}`;
}

function getConfiguredRootPath() {
  const configured = normalizeString(process.env.MOMENTUM_REPORTS_PATH);
  if (!configured) {
    return path.resolve(process.cwd(), "momentum");
  }

  if (path.isAbsolute(configured)) {
    return configured;
  }

  return path.resolve(process.cwd(), configured);
}

function listFiles(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }

  return fs.readdirSync(folderPath, { withFileTypes: true });
}

function isMomentumSourceCandidateFile(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  return ext === ".md" || ext === ".html" || ext === "";
}

function getMomentumSourceDedupKey(fileName: string) {
  return path.basename(fileName, path.extname(fileName)).toLocaleLowerCase("tr-TR");
}

function getMomentumSourceFilePriority(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".html") {
    return 3;
  }

  if (ext === ".md") {
    return 2;
  }

  return 1;
}

function readHeading(markdown: string, prefix: "#" | "##") {
  const pattern = prefix === "#" ? /^#\s+(.+)$/m : /^##\s+(.+)$/m;
  const match = markdown.match(pattern);
  return normalizeString(match?.[1]);
}

function isDecorativeLine(value: string) {
  const normalized = normalizeString(value).replace(/\s+/g, "");
  return Boolean(
    normalized &&
      (/^[━─=-]+$/.test(normalized) || /^[┌┐└┘├┤┬┴┼│]+$/.test(normalized))
  );
}

function findMeaningfulLines(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .map(line => cleanText(line))
    .filter(line => line && !isDecorativeLine(line));
}

function parseTurkishDateLabel(value: string) {
  const normalized = normalizeString(value)
    .toLocaleLowerCase("tr-TR")
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
  const match = normalized.match(/^(\d{1,2})\s+([a-zçğıöşü]+)\s+(\d{4})$/i);
  if (!match) {
    return "";
  }

  const day = String(Number(match[1])).padStart(2, "0");
  const month = MONTH_TOKENS.get(match[2]) || "";
  const year = match[3];

  if (!month) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

function extractTurkishDateLabel(value: string) {
  const match = cleanText(value).match(
    /\d{1,2}\s+[A-Za-zÇĞİÖŞÜçğıöşü]+\s+\d{4}/
  );
  return normalizeString(match?.[0]);
}

function toIsoDateFromKey(sourceKey: string) {
  const ddmmyyyy = sourceKey.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    return `${year}-${month}-${day}`;
  }

  const yyyymmdd = sourceKey.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (yyyymmdd) {
    const [, year, month, day] = yyyymmdd;
    return `${year}-${month}-${day}`;
  }

  return "";
}

function extractFooterDate(markdown: string) {
  const match = markdown.match(/\*Rapor tarihi:\s*([^|*]+?)(?:\||\*)/i);
  return normalizeString(match?.[1]);
}

function extractSubtitleDates(subtitle: string) {
  const matches = subtitle.match(/\d{1,2}\s+[A-Za-zÇĞİÖŞÜçğıöşü]+\s+\d{4}/g) || [];
  return {
    sessionDateLabel: normalizeString(matches[0]),
    targetDateLabel: normalizeString(matches[1]),
  };
}

function extractVixLabel(markdown: string) {
  const match = markdown.match(/\|\s*\*{0,2}VIX Kapanis\*{0,2}\s*\|\s*([^|]+?)\s*\|/i);
  if (match) {
    return normalizeString(match[1]);
  }

  const inlineMatch = markdown.match(/\bVIX:\s*([0-9.,-]+)/i);
  return normalizeString(inlineMatch?.[1]);
}

function extractReadingTime(markdown: string) {
  const match = markdown.match(/Tahmini okuma suresi:\s*([^.*]+?)(?:\.|\*\*)/i);
  return normalizeString(match?.[1]);
}

function extractHtmlTitle(html: string) {
  return (
    stripHtmlTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "") ||
    stripHtmlTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "") ||
    "Momentum Report"
  );
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

function collectHtmlTextsByClass(html: string, className: string, limit = 8) {
  const pattern = new RegExp(
    `<[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`,
    "gi"
  );

  return Array.from(
    new Set(
      Array.from(html.matchAll(pattern))
        .map(match => stripHtmlTags(match[1] || ""))
        .filter(Boolean)
    )
  ).slice(0, limit);
}

function formatMomentumDateLabel(day: string, month: string, year: string) {
  return `${String(Number(day)).padStart(2, "0")} ${MONTH_DISPLAY_LABELS.get(month) || month} ${year}`;
}

function parseGenericDateToken(label: string) {
  const normalized = cleanText(label)
    .toLocaleLowerCase("tr-TR")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const match = normalized.match(
    /(\d{1,2})\s+(january|jan|ocak|oca|february|feb|şubat|subat|şub|sub|march|mar|mart|april|apr|nisan|nis|may|mayis|mayıs|june|jun|haziran|haz|july|jul|temmuz|tem|august|aug|agustos|ağustos|agu|september|sep|sept|eylul|eylül|eyl|october|oct|ekim|eki|november|nov|kasim|kasım|kas|december|dec|aralik|aralık|ara)\s+(\d{4})/i
  );
  if (!match) {
    return null;
  }

  const [, day, monthToken, year] = match;
  const month = MONTH_TOKENS.get(monthToken.toLowerCase());
  if (!month) {
    return null;
  }

  return {
    iso: `${year}-${month}-${String(Number(day)).padStart(2, "0")}`,
    label: formatMomentumDateLabel(day, month, year),
  };
}

function extractDateRangeFromText(value: string) {
  const normalized = cleanText(value)
    .toLocaleLowerCase("tr-TR")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const match = normalized.match(
    /(\d{1,2})\s*[\/–-]\s*(\d{1,2})\s+(january|jan|ocak|oca|february|feb|şubat|subat|şub|sub|march|mar|mart|april|apr|nisan|nis|may|mayis|mayıs|june|jun|haziran|haz|july|jul|temmuz|tem|august|aug|agustos|ağustos|agu|september|sep|sept|eylul|eylül|eyl|october|oct|ekim|eki|november|nov|kasim|kasım|kas|december|dec|aralik|aralık|ara)\s+(\d{4})/i
  );
  if (!match) {
    return null;
  }

  const [, sessionDay, targetDay, monthToken, year] = match;
  const month = MONTH_TOKENS.get(monthToken.toLowerCase());
  if (!month) {
    return null;
  }

  return {
    reportDate: `${year}-${month}-${String(Number(targetDay)).padStart(2, "0")}`,
    sessionDateLabel: formatMomentumDateLabel(sessionDay, month, year),
    targetDateLabel: formatMomentumDateLabel(targetDay, month, year),
  };
}

function extractUniqueDateTokens(value: string) {
  const pattern =
    /(\d{1,2})\s+(january|jan|ocak|oca|february|feb|şubat|subat|şub|sub|march|mar|mart|april|apr|nisan|nis|may|mayis|mayıs|june|jun|haziran|haz|july|jul|temmuz|tem|august|aug|agustos|ağustos|agu|september|sep|sept|eylul|eylül|eyl|october|oct|ekim|eki|november|nov|kasim|kasım|kas|december|dec|aralik|aralık|ara)\s+(\d{4})/gi;

  return Array.from(
    new Map(
      Array.from(cleanText(value).matchAll(pattern))
        .map(match => {
          const parsed = parseGenericDateToken(match[0] || "");
          return parsed ? [parsed.iso, parsed] : null;
        })
        .filter((item): item is [string, { iso: string; label: string }] => Boolean(item))
    ).values()
  );
}

function cleanMomentumHtmlTitle(title: string) {
  return cleanText(
    title.replace(
      /\s*[—–-]\s*\d{1,2}\s*[\/–-]\s*\d{1,2}\s+[A-Za-zÇĞİÖŞÜçğıöşü]+\s+\d{4}\s*$/i,
      ""
    )
  );
}

function extractMomentumHtmlMetadata(
  html: string,
  fileName: string,
  updatedAt: string
) {
  const rawTitle = extractHtmlTitle(html);
  const title = cleanMomentumHtmlTitle(rawTitle) || rawTitle || fileName;
  const heroTitle = extractHtmlTextByClass(html, "hero-title");
  const headline = extractHtmlTextByClass(html, "hero-sub") || heroTitle || title;
  const navDateLabel =
    collectHtmlTextsByClass(html, "nav-pill", 4).find(item =>
      /\d/.test(item) && /(jan|jun|haz|tem|oca|sub|mar|nis|may|agu|eyl|eki|kas|ara)/i.test(item)
    ) || "";
  const footerText = stripHtmlTags(
    html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i)?.[1] || ""
  );
  const range =
    extractDateRangeFromText(`${rawTitle} ${navDateLabel}`) ||
    extractDateRangeFromText(headline) ||
    extractDateRangeFromText(footerText);
  const uniqueDates = extractUniqueDateTokens(
    `${headline}\n${footerText}\n${stripHtmlTags(html)}`
  );
  const sessionDateLabel =
    range?.sessionDateLabel || uniqueDates[0]?.label || "";
  const targetDateLabel =
    range?.targetDateLabel ||
    uniqueDates.find(item => item.label !== sessionDateLabel)?.label ||
    "";
  const reportDate =
    range?.reportDate ||
    uniqueDates.find(item => item.label === targetDateLabel)?.iso ||
    uniqueDates[0]?.iso ||
    updatedAt.slice(0, 10);
  const subtitle =
    cleanText(navDateLabel) ||
    (heroTitle && heroTitle !== title ? heroTitle : "");
  const vixLabel =
    collectHtmlTextsByClass(html, "mpill", 10).find(item => /vix/i.test(item)) ||
    cleanText(
      stripHtmlTags(
        html.match(/VIX[^<]{0,32}(~?\s*\d+(?:[.,]\d+)?(?:\s*\([^)]*\))?)/i)?.[0] ||
          ""
      )
    );

  return {
    title,
    subtitle,
    headline,
    reportDate,
    reportDateLabel:
      sessionDateLabel || targetDateLabel || cleanText(navDateLabel) || rawTitle,
    sessionDateLabel,
    targetDateLabel,
    readingTimeLabel: "HTML",
    vixLabel,
  };
}

function extractExecutiveHeadline(markdown: string) {
  const summaryMatch = markdown.match(
    /##\s+OZET EXECUTIVE SUMMARY([\s\S]*?)(?:\n---|\n##\s+)/i
  );
  if (!summaryMatch) {
    return "";
  }

  return normalizeString(
    summaryMatch[1]
      .replace(/\*\*/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function extractMetadata(markdown: string, fileName: string, updatedAt: string) {
  const meaningfulLines = findMeaningfulLines(markdown);
  const headingTitle = readHeading(markdown, "#");
  const fallbackTitleLine =
    meaningfulLines.find(line => /momentum|scanner|rapor|aday/i.test(line)) ||
    meaningfulLines[0] ||
    fileName;
  const combinedTitle = headingTitle || fallbackTitleLine;
  const combinedDateLabel = extractTurkishDateLabel(combinedTitle);
  const title = combinedDateLabel
    ? cleanText(
        combinedTitle
          .replace(combinedDateLabel, "")
          .replace(/^[^A-Za-zÇĞİÖŞÜçğıöşü0-9]+/, "")
          .replace(/^[—–-]+|[—–-]+$/g, "")
      )
    : combinedTitle;
  const rawSubtitle =
    readHeading(markdown, "##") ||
    (headingTitle ? meaningfulLines[1] || "" : meaningfulLines[0] === fallbackTitleLine ? meaningfulLines[1] || "" : "");
  const subtitle = /KATMAN\s+\d+|OZET EXECUTIVE SUMMARY/i.test(rawSubtitle)
    ? ""
    : rawSubtitle;
  const { sessionDateLabel, targetDateLabel } = extractSubtitleDates(subtitle);
  const reportDateLabel =
    extractFooterDate(markdown) || combinedDateLabel || sessionDateLabel || subtitle || fileName;
  const reportDate =
    parseTurkishDateLabel(reportDateLabel) ||
    parseTurkishDateLabel(combinedDateLabel) ||
    parseTurkishDateLabel(sessionDateLabel) ||
    toIsoDateFromKey(path.basename(fileName, path.extname(fileName))) ||
    updatedAt.slice(0, 10);
  const headline = extractExecutiveHeadline(markdown) || subtitle || title;
  const vixLabel = extractVixLabel(markdown);
  const readingTimeLabel = extractReadingTime(markdown);

  return {
    title,
    subtitle,
    headline,
    reportDate,
    reportDateLabel,
    sessionDateLabel,
    targetDateLabel,
    readingTimeLabel,
    vixLabel,
  };
}

function buildSourceRecord(fileName: string) {
  const rootPath = getConfiguredRootPath();
  const filePath = path.join(rootPath, fileName);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return null;
  }

  if (!isMomentumSourceCandidateFile(fileName)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const stats = fs.statSync(filePath);
  const updatedAt = new Date(stats.mtimeMs).toISOString();
  const ext = path.extname(fileName).toLowerCase();
  const isHtmlSource = ext === ".html";
  const markdown = isHtmlSource ? "" : fileContents;
  const html = isHtmlSource ? fileContents : "";
  const metadata = isHtmlSource
    ? extractMomentumHtmlMetadata(html, fileName, updatedAt)
    : extractMetadata(markdown, fileName, updatedAt);

  return {
    contentFormat: isHtmlSource ? "html" : "markdown",
    id: buildSourceId(fileName),
    fileName,
    sourceFile: `momentum/${fileName}`,
    title: metadata.title,
    subtitle: metadata.subtitle,
    headline: metadata.headline,
    reportDate: metadata.reportDate,
    reportDateLabel: metadata.reportDateLabel,
    sessionDateLabel: metadata.sessionDateLabel,
    targetDateLabel: metadata.targetDateLabel,
    readingTimeLabel: metadata.readingTimeLabel,
    vixLabel: metadata.vixLabel,
    updatedAt,
    html,
    markdown,
  } satisfies MomentumSourceRecord;
}

export function getMomentumReportRootPath() {
  return getConfiguredRootPath();
}

export function listMomentumReportSources() {
  const rootPath = getConfiguredRootPath();
  if (!fs.existsSync(rootPath)) {
    return [];
  }

  const candidateFiles = listFiles(rootPath)
    .filter(entry => entry.isFile() && isMomentumSourceCandidateFile(entry.name))
    .map(entry => entry.name);

  const dedupedFiles = Array.from(
    candidateFiles.reduce((map, fileName) => {
      const nextPath = path.join(rootPath, fileName);
      const nextStats = fs.statSync(nextPath);
      const key = getMomentumSourceDedupKey(fileName);
      const current = map.get(key);

      if (!current) {
        map.set(key, {
          fileName,
          priority: getMomentumSourceFilePriority(fileName),
          updatedAtMs: nextStats.mtimeMs,
        });
        return map;
      }

      const nextPriority = getMomentumSourceFilePriority(fileName);
      if (
        nextPriority > current.priority ||
        (nextPriority === current.priority && nextStats.mtimeMs > current.updatedAtMs)
      ) {
        map.set(key, {
          fileName,
          priority: nextPriority,
          updatedAtMs: nextStats.mtimeMs,
        });
      }

      return map;
    }, new Map<string, { fileName: string; priority: number; updatedAtMs: number }>())
      .values()
  ).map(entry => entry.fileName);

  const sources = dedupedFiles
    .map(fileName => buildSourceRecord(fileName))
    .filter((entry): entry is MomentumSourceRecord => Boolean(entry))
    .sort((left, right) => {
      if (left.reportDate !== right.reportDate) {
        return right.reportDate.localeCompare(left.reportDate);
      }

      return right.updatedAt.localeCompare(left.updatedAt);
    });

  if (sources.some(source => source.contentFormat === "html")) {
    return sources.filter(source => source.contentFormat === "html");
  }

  return sources;
}

export function listMomentumReportSourceSummaries() {
  return listMomentumReportSources().map(
    ({ markdown: _markdown, html: _html, ...summary }) =>
      summary satisfies MomentumSourceSummary
  );
}

export function getMomentumReportSource(sourceId: string) {
  const safeSourceId = normalizeString(sourceId);
  if (!safeSourceId) {
    return null;
  }

  return (
    listMomentumReportSources().find(source => source.id === safeSourceId) || null
  );
}
