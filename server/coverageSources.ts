import fs from "node:fs";
import path from "node:path";

export interface CoverageStoredRecord {
  id: string;
  importedAt: string;
  raw: string;
  sourceName: string;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLineEndings(value: string) {
  return value.replace(/\r\n/g, "\n");
}

function slugifyCoverageSegment(value: string) {
  return normalizeString(value)
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitFrontmatter(raw: string) {
  const normalized = normalizeLineEndings(raw);
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { body: normalized.trim(), frontmatter: "" };
  }

  return {
    body: normalized.slice(match[0].length).trim(),
    frontmatter: match[1],
  };
}

function readFrontmatterField(raw: string, field: string) {
  const { frontmatter } = splitFrontmatter(raw);
  if (!frontmatter) {
    return "";
  }

  const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = frontmatter.match(
    new RegExp(`^${escapedField}:\\s*(.+)$`, "im")
  );
  if (!match) {
    return "";
  }

  return normalizeString(match[1].replace(/^["']|["']$/g, ""));
}

function extractCoverageTicker(raw: string) {
  return normalizeString(readFrontmatterField(raw, "ticker")).toUpperCase();
}

function extractCoverageDate(raw: string) {
  const direct = normalizeString(readFrontmatterField(raw, "date"));
  if (/^\d{4}-\d{2}-\d{2}$/.test(direct)) {
    return direct;
  }

  const timestamp = normalizeString(readFrontmatterField(raw, "timestamp"));
  if (/^\d{4}-\d{2}-\d{2}T/.test(timestamp)) {
    return timestamp.slice(0, 10);
  }

  return "";
}

function extractCoverageTitle(raw: string) {
  const { body } = splitFrontmatter(raw);
  const titleLine = body
    .split("\n")
    .find(line => normalizeString(line).startsWith("# "));
  return titleLine ? normalizeString(titleLine.replace(/^#\s+/, "")) : "";
}

function extractCoverageDateFromSourceName(sourceName: string) {
  const match = normalizeString(sourceName).match(/(\d{4}-\d{2}-\d{2})/);
  return match?.[1] || "";
}

function normalizeCoverageId(sourceName: string) {
  return path.basename(sourceName).replace(/\.md$/i, "");
}

function isSampleCoverageFile(fileName: string) {
  return /^sample(?:-|\.|$)/i.test(normalizeString(fileName));
}

export function getCoverageReportsRootPath() {
  const configured = normalizeString(process.env.COVERAGE_REPORTS_PATH);
  if (!configured) {
    return path.resolve(process.cwd(), "reports", "coverage");
  }

  if (path.isAbsolute(configured)) {
    return configured;
  }

  return path.resolve(process.cwd(), configured);
}

function listCoverageReportFileNames(): string[] {
  const root = getCoverageReportsRootPath();
  if (!fs.existsSync(root)) {
    return [];
  }

  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter(
      entry =>
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        !isSampleCoverageFile(entry.name)
    )
    .map(entry => entry.name)
    .sort();
}

function readCoverageRecord(root: string, fileName: string): CoverageStoredRecord {
  const filePath = path.join(root, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const stat = fs.statSync(filePath);

  return {
    id: normalizeCoverageId(fileName),
    importedAt: stat.mtime.toISOString(),
    raw,
    sourceName: fileName,
  };
}

export function listLocalCoverageReports(): CoverageStoredRecord[] {
  const root = getCoverageReportsRootPath();
  const names = listCoverageReportFileNames();
  return names.map(name => readCoverageRecord(root, name));
}

export function getLocalCoverageReport(id: string): CoverageStoredRecord | null {
  const root = getCoverageReportsRootPath();
  const safeId = normalizeCoverageId(path.basename(id));
  const fileName = `${safeId}.md`;
  const filePath = path.join(root, fileName);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return readCoverageRecord(root, fileName);
}

export function mergeCoverageReports(
  primaryReports: CoverageStoredRecord[],
  fallbackReports: CoverageStoredRecord[]
) {
  const merged = new Map<string, CoverageStoredRecord>();

  for (const report of [...primaryReports, ...fallbackReports]) {
    const key = normalizeString(report.sourceName).toLowerCase() || report.id;
    if (merged.has(key)) {
      continue;
    }

    merged.set(key, report);
  }

  return Array.from(merged.values()).sort((left, right) => {
    const leftDate =
      extractCoverageDate(left.raw) ||
      extractCoverageDateFromSourceName(left.sourceName) ||
      left.importedAt.slice(0, 10);
    const rightDate =
      extractCoverageDate(right.raw) ||
      extractCoverageDateFromSourceName(right.sourceName) ||
      right.importedAt.slice(0, 10);
    const dateDelta = rightDate.localeCompare(leftDate);
    if (dateDelta !== 0) {
      return dateDelta;
    }

    return right.importedAt.localeCompare(left.importedAt);
  });
}

export function findCoverageReportById(
  reports: CoverageStoredRecord[],
  id: string
) {
  const safeId = normalizeCoverageId(id);
  return (
    reports.find(report => normalizeCoverageId(report.id) === safeId) ||
    reports.find(report => normalizeCoverageId(report.sourceName) === safeId) ||
    null
  );
}

export function buildCoverageSourceName(
  raw: string,
  preferredSourceName = ""
) {
  const normalizedPreferred = normalizeString(preferredSourceName);
  if (normalizedPreferred) {
    const baseName = path.basename(normalizedPreferred);
    const safeBaseName = baseName.replace(/[<>:"/\\|?*\x00-\x1F]+/g, "-");
    return safeBaseName.toLowerCase().endsWith(".md")
      ? safeBaseName
      : `${safeBaseName}.md`;
  }

  const ticker = extractCoverageTicker(raw);
  const date = extractCoverageDate(raw);
  if (!ticker || !date) {
    throw new Error(
      "Coverage markdown must include frontmatter `ticker` and ISO `date`."
    );
  }

  return `${slugifyCoverageSegment(ticker.toUpperCase())}-${date}.md`;
}

export function validateCoverageMarkdown(raw: string) {
  const normalizedRaw = normalizeLineEndings(String(raw || "")).trim();
  if (!normalizedRaw) {
    throw new Error("Coverage markdown bos olamaz.");
  }

  const ticker = extractCoverageTicker(normalizedRaw);
  if (!ticker) {
    throw new Error("Coverage markdown frontmatter icinde `ticker` zorunlu.");
  }

  const date = extractCoverageDate(normalizedRaw);
  if (!date) {
    throw new Error(
      "Coverage markdown frontmatter icinde `date` (YYYY-MM-DD) zorunlu."
    );
  }

  const title = extractCoverageTitle(normalizedRaw);
  if (!title) {
    throw new Error("Coverage markdown en az bir `#` baslik icermeli.");
  }

  return {
    raw: normalizedRaw.endsWith("\n") ? normalizedRaw : `${normalizedRaw}\n`,
    reportDate: date,
    ticker,
    title,
  };
}

export function buildCoverageStoredRecord(
  raw: string,
  sourceName?: string,
  importedAt = new Date().toISOString()
): CoverageStoredRecord {
  const validated = validateCoverageMarkdown(raw);
  const resolvedSourceName = buildCoverageSourceName(
    validated.raw,
    sourceName || ""
  );

  return {
    id: normalizeCoverageId(resolvedSourceName),
    importedAt,
    raw: validated.raw,
    sourceName: resolvedSourceName,
  };
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    table[index] = crc >>> 0;
  }
  return table;
})();

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (let index = 0; index < buffer.length; index += 1) {
    const byte = buffer[index];
    crc = CRC32_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function toDosDateTime(isoValue: string) {
  const parsed = new Date(isoValue);
  const safeDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const year = Math.max(1980, safeDate.getFullYear());
  const month = safeDate.getMonth() + 1;
  const day = safeDate.getDate();
  const hours = safeDate.getHours();
  const minutes = safeDate.getMinutes();
  const seconds = Math.floor(safeDate.getSeconds() / 2);

  const dosTime = (hours << 11) | (minutes << 5) | seconds;
  const dosDate = ((year - 1980) << 9) | (month << 5) | day;

  return { dosDate, dosTime };
}

export function buildCoverageZipBuffer(reports: CoverageStoredRecord[]) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const report of reports) {
    const fileName = report.sourceName || `${report.id}.md`;
    const nameBuffer = Buffer.from(fileName.replace(/\\/g, "/"), "utf8");
    const dataBuffer = Buffer.from(report.raw, "utf8");
    const checksum = crc32(dataBuffer);
    const { dosDate, dosTime } = toDosDateTime(report.importedAt);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(dataBuffer.length, 18);
    localHeader.writeUInt32LE(dataBuffer.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuffer, dataBuffer);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(dataBuffer.length, 20);
    centralHeader.writeUInt32LE(dataBuffer.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, nameBuffer);
    offset += localHeader.length + nameBuffer.length + dataBuffer.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const endOfCentralDirectory = Buffer.alloc(22);
  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0);
  endOfCentralDirectory.writeUInt16LE(0, 4);
  endOfCentralDirectory.writeUInt16LE(0, 6);
  endOfCentralDirectory.writeUInt16LE(reports.length, 8);
  endOfCentralDirectory.writeUInt16LE(reports.length, 10);
  endOfCentralDirectory.writeUInt32LE(centralDirectory.length, 12);
  endOfCentralDirectory.writeUInt32LE(offset, 16);
  endOfCentralDirectory.writeUInt16LE(0, 20);

  return Buffer.concat([
    ...localParts,
    centralDirectory,
    endOfCentralDirectory,
  ]);
}
