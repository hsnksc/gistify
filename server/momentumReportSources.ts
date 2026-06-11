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

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

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
  return ext === ".md" || ext === "";
}

function getMomentumSourceDedupKey(fileName: string) {
  return path.basename(fileName, path.extname(fileName)).toLocaleLowerCase("tr-TR");
}

function getMomentumSourceFilePriority(fileName: string) {
  return path.extname(fileName).toLowerCase() === "" ? 2 : 1;
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

  const monthMap: Record<string, string> = {
    ocak: "01",
    "şubat": "02",
    subat: "02",
    mart: "03",
    nisan: "04",
    "mayıs": "05",
    mayis: "05",
    haziran: "06",
    temmuz: "07",
    "ağustos": "08",
    agustos: "08",
    "eylül": "09",
    eylul: "09",
    ekim: "10",
    "kasım": "11",
    kasim: "11",
    "aralık": "12",
    aralik: "12",
  };

  const day = String(Number(match[1])).padStart(2, "0");
  const month = monthMap[match[2]] || "";
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

  const markdown = fs.readFileSync(filePath, "utf8");
  const stats = fs.statSync(filePath);
  const updatedAt = new Date(stats.mtimeMs).toISOString();
  const metadata = extractMetadata(markdown, fileName, updatedAt);

  return {
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

  return dedupedFiles
    .map(fileName => buildSourceRecord(fileName))
    .filter((entry): entry is MomentumSourceRecord => Boolean(entry))
    .sort((left, right) => {
      if (left.reportDate !== right.reportDate) {
        return right.reportDate.localeCompare(left.reportDate);
      }

      return right.updatedAt.localeCompare(left.updatedAt);
    });
}

export function listMomentumReportSourceSummaries() {
  return listMomentumReportSources().map(
    ({ markdown: _markdown, ...summary }) =>
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
