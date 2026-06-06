import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type {
  EarningReportSourceRecord,
  EarningReportSourceSummary,
} from "../shared/earningReports";

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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
  const slug = slugify(baseName) || "earning-report";
  const hash = crypto.createHash("sha1").update(fileName).digest("hex").slice(0, 8);
  return `${slug}-${hash}`;
}

function getConfiguredRootPath() {
  const configured = normalizeString(process.env.EARNING_REPORTS_PATH);
  if (!configured) {
    return path.resolve(process.cwd(), "earningreport");
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

function readMarkdownField(markdown: string, label: string) {
  const match = markdown.match(
    new RegExp(`(?:^|\\n)(?:>\\s*)?\\*\\*${label}:\\*\\*\\s*([^\\n]+)`, "i")
  );
  return normalizeString(match?.[1]);
}

function readHeading(markdown: string, prefix: "#" | "##") {
  const pattern =
    prefix === "#"
      ? /^#\s+(.+)$/m
      : /^##\s+(.+)$/m;
  const match = markdown.match(pattern);
  return normalizeString(match?.[1]);
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

function parseTurkishDateLabel(value: string) {
  const normalized = normalizeString(value)
    .toLocaleLowerCase("tr-TR")
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
  const match = normalized.match(
    /^(\d{1,2})\s+([a-zçğıöşü]+)\s+(\d{4})$/i
  );
  if (!match) {
    return "";
  }

  const monthMap: Record<string, string> = {
    ocak: "01",
    şubat: "02",
    subat: "02",
    mart: "03",
    nisan: "04",
    mayıs: "05",
    mayis: "05",
    haziran: "06",
    temmuz: "07",
    ağustos: "08",
    agustos: "08",
    eylül: "09",
    eylul: "09",
    ekim: "10",
    kasım: "11",
    kasim: "11",
    aralık: "12",
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

function extractMetadata(markdown: string, fileName: string, updatedAt: string) {
  const title = readHeading(markdown, "#") || fileName;
  const subtitle = readHeading(markdown, "##") || "";
  const headline =
    readMarkdownField(markdown, "Strateji Tipi") ||
    readMarkdownField(markdown, "Mekanizma") ||
    readMarkdownField(markdown, "Strateji") ||
    subtitle ||
    title;
  const rawReportDateLabel = readMarkdownField(markdown, "Rapor Tarihi");
  const reportDateLabel = normalizeString(rawReportDateLabel.split("|")[0] || "");
  const reportDate =
    parseTurkishDateLabel(reportDateLabel) ||
    toIsoDateFromKey(path.basename(fileName, path.extname(fileName))) ||
    updatedAt.slice(0, 10);
  const vixLabel =
    readMarkdownField(markdown, "VIX") ||
    normalizeString(
      rawReportDateLabel.match(/\bVIX:\s*(.+)$/i)?.[1] || ""
    );

  return {
    title,
    subtitle,
    headline,
    reportDate,
    reportDateLabel: reportDateLabel || reportDate,
    vixLabel,
  };
}

function buildSourceRecord(fileName: string) {
  const rootPath = getConfiguredRootPath();
  const filePath = path.join(rootPath, fileName);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return null;
  }

  if (!/\.md$/i.test(path.extname(fileName))) {
    return null;
  }

  const markdown = fs.readFileSync(filePath, "utf8");
  const stats = fs.statSync(filePath);
  const updatedAt = new Date(stats.mtimeMs).toISOString();
  const metadata = extractMetadata(markdown, fileName, updatedAt);

  return {
    id: buildSourceId(fileName),
    fileName,
    sourceFile: `earningreport/${fileName}`,
    title: metadata.title,
    subtitle: metadata.subtitle,
    headline: metadata.headline,
    reportDate: metadata.reportDate,
    reportDateLabel: metadata.reportDateLabel,
    vixLabel: metadata.vixLabel,
    updatedAt,
    markdown,
  } satisfies EarningReportSourceRecord;
}

export function getEarningReportRootPath() {
  return getConfiguredRootPath();
}

export function listEarningReportSources() {
  const rootPath = getConfiguredRootPath();
  if (!fs.existsSync(rootPath)) {
    return [];
  }

  return listFiles(rootPath)
    .filter(entry => entry.isFile() && /\.md$/i.test(entry.name))
    .map(entry => buildSourceRecord(entry.name))
    .filter((entry): entry is EarningReportSourceRecord => Boolean(entry))
    .sort((left, right) => {
      if (left.reportDate !== right.reportDate) {
        return right.reportDate.localeCompare(left.reportDate);
      }

      return right.updatedAt.localeCompare(left.updatedAt);
    });
}

export function listEarningReportSourceSummaries() {
  return listEarningReportSources().map(
    ({ markdown: _markdown, ...summary }) =>
      summary satisfies EarningReportSourceSummary
  );
}

export function getEarningReportSource(sourceId: string) {
  const safeSourceId = normalizeString(sourceId);
  if (!safeSourceId) {
    return null;
  }

  return listEarningReportSources().find(source => source.id === safeSourceId) || null;
}
