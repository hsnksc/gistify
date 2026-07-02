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
    .filter(entry => entry.isFile() && entry.name.endsWith(".md"))
    .map(entry => entry.name)
    .sort();
}

function readCoverageRecord(root: string, fileName: string): CoverageStoredRecord {
  const filePath = path.join(root, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const stat = fs.statSync(filePath);
  const id = fileName.replace(/\.md$/i, "");

  return {
    id,
    importedAt: stat.mtime.toISOString(),
    raw,
    sourceName: fileName,
  };
}

export function listCoverageReports(): CoverageStoredRecord[] {
  const root = getCoverageReportsRootPath();
  const names = listCoverageReportFileNames();
  return names.map(name => readCoverageRecord(root, name));
}

export function getCoverageReport(id: string): CoverageStoredRecord | null {
  const root = getCoverageReportsRootPath();
  const safeId = path.basename(id);
  const fileName = `${safeId}.md`;
  const filePath = path.join(root, fileName);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return readCoverageRecord(root, fileName);
}
