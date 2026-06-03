import fs from "node:fs";
import path from "node:path";
import type {
  DailyReportRecord,
  DailyReportSourcePackage,
} from "../shared/dailyReports";

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

function toIsoDateFromFolder(folderName: string) {
  const match = folderName.match(/^(\d{2})(\d{2})(\d{4})$/);
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

function pickMainMarkdownFile(folderPath: string) {
  const files = listFiles(folderPath)
    .filter(entry => entry.isFile())
    .map(entry => entry.name);
  const priorities = [
    /\.agent\.final\.converted\.md$/i,
    /\.agent\.final\.md$/i,
    /_sec00\.md$/i,
    /\.md$/i,
  ];

  for (const pattern of priorities) {
    const match = files.find(file => pattern.test(file));
    if (match) {
      return path.join(folderPath, match);
    }
  }

  return null;
}

function extractMetadata(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const title =
    lines.find(line => line.trim().startsWith("# "))?.replace(/^#\s+/, "").trim() ||
    "Daily Report";
  const authorMatch = markdown.match(/\*\*Hazirlayan:\*\*\s*(.+)/i);
  const coverageMatch = markdown.match(/\*\*Kapsam:\*\*\s*(.+)/i);
  const methodologyMatch = markdown.match(/\*\*Metodoloji:\*\*\s*(.+)/i);

  const summaryMatch = markdown.match(
    /# Executive Summary\s+([\s\S]*?)(?:\n#{1,3}\s|\n---|\Z)/i
  );
  const executiveSummary = (summaryMatch?.[1] || "")
    .split(/\n\s*\n/)
    .map(chunk => chunk.replace(/\n/g, " ").trim())
    .filter(Boolean)
    .slice(0, 6);

  const headline = executiveSummary[0] || title;

  return {
    title,
    headline,
    author: normalizeString(authorMatch?.[1]),
    coverage: normalizeString(coverageMatch?.[1]),
    methodology: normalizeString(methodologyMatch?.[1]),
    executiveSummary,
  };
}

function listSectionFiles(folderPath: string) {
  return listFiles(folderPath)
    .filter(entry => entry.isFile() && /^momentum_raporu_sec\d+\.md$/i.test(entry.name))
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function listFigureFiles(folderPath: string) {
  return listFiles(folderPath)
    .filter(
      entry =>
        entry.isFile() &&
        /\.(png|jpg|jpeg|webp)$/i.test(entry.name)
    )
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function listTickerUniverse(researchPath: string) {
  if (!fs.existsSync(researchPath)) {
    return [];
  }

  return fs
    .readdirSync(researchPath, { withFileTypes: true })
    .filter(entry => entry.isFile() && /_info\.csv$/i.test(entry.name))
    .map(entry => entry.name.replace(/_info\.csv$/i, "").toUpperCase())
    .sort((left, right) => left.localeCompare(right));
}

export function getDailyReportRootPath() {
  return getConfiguredRootPath();
}

export function listDailyReportSourcePackages() {
  const rootPath = getDailyReportRootPath();
  if (!fs.existsSync(rootPath)) {
    return [];
  }

  const folders = fs
    .readdirSync(rootPath, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  const packages: DailyReportSourcePackage[] = [];

  for (const folderName of folders) {
    const source = getDailyReportSourcePackage(folderName);
    if (source) {
      packages.push(source);
    }
  }

  return packages.sort((left, right) => right.reportDate.localeCompare(left.reportDate));
}

export function getDailyReportSourcePackage(folderName: string) {
  const safeFolderName = normalizeString(folderName).replace(/[^0-9a-z_-]/gi, "");
  if (!safeFolderName) {
    return null;
  }

  const folderPath = path.join(getDailyReportRootPath(), safeFolderName);
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
  const reportDate = toIsoDateFromFolder(safeFolderName) || new Date(stats.mtimeMs).toISOString().slice(0, 10);

  return {
    id: safeFolderName,
    folderName: safeFolderName,
    reportDate,
    title: metadata.title,
    headline: metadata.headline,
    author: metadata.author || undefined,
    coverage: metadata.coverage || undefined,
    methodology: metadata.methodology || undefined,
    executiveSummary: metadata.executiveSummary,
    markdown,
    sectionFiles: listSectionFiles(folderPath),
    figureFiles: listFigureFiles(folderPath),
    tickerUniverse: listTickerUniverse(researchPath),
    researchFileCount: fs.existsSync(researchPath)
      ? fs.readdirSync(researchPath).filter(file => file.endsWith(".md") || file.endsWith(".csv")).length
      : 0,
    updatedAt: new Date(stats.mtimeMs).toISOString(),
  } satisfies DailyReportSourcePackage;
}

export function buildDailyReportRecordFromSource(
  source: DailyReportSourcePackage,
  authorEmail: string,
  previousRecord?: DailyReportRecord | null
) {
  const nowIso = new Date().toISOString();

  return {
    id: previousRecord?.id || `daily-report-${source.folderName}`,
    slug: previousRecord?.slug || slugify(`${source.reportDate}-${source.title}`),
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
      executiveSummary: source.executiveSummary,
      markdown: source.markdown,
      sectionFiles: source.sectionFiles,
      figureFiles: source.figureFiles,
      tickerUniverse: source.tickerUniverse,
      researchFileCount: source.researchFileCount,
    },
  } satisfies DailyReportRecord;
}
