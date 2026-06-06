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

function normalizeParagraph(value: string) {
  return value
    .replace(/\[\^[^\]]+\^]/g, "")
    .replace(/\s+/g, " ")
    .trim();
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
  const title =
    lines.find(line => line.trim().startsWith("# "))?.replace(/^#\s+/, "").trim() ||
    "Daily Report";
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

  const headline = normalizedSummary[0] || title;

  return {
    title,
    headline,
    author: normalizeString(authorMatch?.[1]),
    coverage: normalizeString(coverageMatch?.[1]),
    methodology: normalizeString(methodologyMatch?.[1]),
    executiveSummary: normalizedSummary,
  };
}

function listSectionFiles(folderPath: string) {
  return listFiles(folderPath)
    .filter(entry => entry.isFile() && /^momentum_raporu_sec\d+\.md$/i.test(entry.name))
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

function listFigureFiles(folderPath: string) {
  return listRelativeFilesRecursive(folderPath, filePath =>
    /\.(png|jpg|jpeg|webp)$/i.test(filePath)
  );
}

function listRootFigureFiles(rootPath: string, baseName: string) {
  return listFiles(rootPath)
    .filter(
      entry =>
        entry.isFile() &&
        /\.(png|jpg|jpeg|webp)$/i.test(entry.name) &&
        entry.name.toLowerCase().startsWith(baseName.toLowerCase())
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

function countResearchFiles(researchPath: string) {
  return listRelativeFilesRecursive(
    researchPath,
    filePath => /\.(md|csv)$/i.test(filePath)
  ).length;
}

export function getDailyReportRootPath() {
  return getConfiguredRootPath();
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
    toIsoDateFromKey(folderName) ||
    new Date(stats.mtimeMs).toISOString().slice(0, 10);

  return {
    id: folderName,
    folderName,
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
    researchFileCount: countResearchFiles(researchPath),
    updatedAt: new Date(stats.mtimeMs).toISOString(),
    sourceKind: "folder",
    sourceLabel: folderName,
    assetBasePath: folderName,
  } satisfies DailyReportSourcePackage;
}

function buildFileSourcePackage(fileName: string) {
  const rootPath = getDailyReportRootPath();
  const filePath = path.join(rootPath, fileName);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return null;
  }

  const fileExt = path.extname(fileName);
  if (!/\.md$/i.test(fileExt)) {
    return null;
  }

  const sourceKey = path.basename(fileName, fileExt);
  const markdown = fs.readFileSync(filePath, "utf8");
  const metadata = extractMetadata(markdown);
  const stats = fs.statSync(filePath);
  const reportDate =
    toIsoDateFromKey(sourceKey) ||
    new Date(stats.mtimeMs).toISOString().slice(0, 10);

  return {
    id: sourceKey,
    folderName: sourceKey,
    reportDate,
    title: metadata.title,
    headline: metadata.headline,
    author: metadata.author || undefined,
    coverage: metadata.coverage || undefined,
    methodology: metadata.methodology || undefined,
    executiveSummary: metadata.executiveSummary,
    markdown,
    sectionFiles: [],
    figureFiles: listRootFigureFiles(rootPath, sourceKey),
    tickerUniverse: [],
    researchFileCount: 0,
    updatedAt: new Date(stats.mtimeMs).toISOString(),
    sourceKind: "file",
    sourceLabel: fileName,
    assetBasePath: "",
  } satisfies DailyReportSourcePackage;
}

export function listDailyReportSourcePackages() {
  const rootPath = getDailyReportRootPath();
  if (!fs.existsSync(rootPath)) {
    return [];
  }

  const entries = fs.readdirSync(rootPath, { withFileTypes: true });
  const folders = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
  const rootMarkdownFiles = entries
    .filter(entry => entry.isFile() && /^\d{8}\.md$/i.test(entry.name))
    .map(entry => entry.name);

  const packages: DailyReportSourcePackage[] = [];

  for (const folderName of folders) {
    const source = buildFolderSourcePackage(folderName);
    if (source) {
      packages.push(source);
    }
  }

  for (const fileName of rootMarkdownFiles) {
    const source = buildFileSourcePackage(fileName);
    if (source) {
      packages.push(source);
    }
  }

  return packages.sort((left, right) => right.reportDate.localeCompare(left.reportDate));
}

export function getDailyReportSourcePackage(sourceId: string) {
  const safeSourceId = normalizeString(sourceId).replace(/[^0-9a-z_-]/gi, "");
  if (!safeSourceId) {
    return null;
  }

  const folderSource = buildFolderSourcePackage(safeSourceId);
  if (folderSource) {
    return folderSource;
  }

  return buildFileSourcePackage(`${safeSourceId}.md`);
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
      sourceKind: source.sourceKind,
      sourceLabel: source.sourceLabel,
      assetBasePath: source.assetBasePath,
    },
  } satisfies DailyReportRecord;
}
