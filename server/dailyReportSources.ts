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
  const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase();
  const numericMatch = baseName.match(/(?:^|[_-])(\d{2})(\d{2})(\d{4})(?:$|[_-])/);
  if (numericMatch) {
    const [, day, month, year] = numericMatch;
    return `${year}-${month}-${day}`;
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

function normalizeRelativeAssetPath(value: string) {
  return value.replace(/\\/g, "/").replace(/^\.\/+/, "").replace(/^\/+/, "").trim();
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

function findResearchScopedFigureFiles(folderPath: string, reportDate: string) {
  const researchPath = path.join(folderPath, "research");
  if (!fs.existsSync(researchPath)) {
    return [];
  }

  const candidateTokens = new Set(buildResearchFolderNameCandidates(reportDate));
  if (!candidateTokens.size) {
    return [];
  }

  const matchedFolder = listFiles(researchPath).find(
    entry => entry.isDirectory() && candidateTokens.has(entry.name.toLowerCase())
  );
  if (!matchedFolder) {
    return [];
  }

  return listRelativeFilesRecursive(
    path.join(researchPath, matchedFolder.name),
    filePath => FIGURE_FILE_PATTERN.test(filePath) && !OPENAI_FIGURE_PATTERN.test(filePath),
    folderPath
  );
}

function listFigureFiles(folderPath: string) {
  return listRelativeFilesRecursive(
    folderPath,
    filePath => FIGURE_FILE_PATTERN.test(filePath) && !OPENAI_FIGURE_PATTERN.test(filePath)
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
    parseDateTokenFromFileName(path.basename(mainMarkdownPath)) ||
    toIsoDateFromKey(folderName) ||
    new Date(stats.mtimeMs).toISOString().slice(0, 10);
  const markdownFigureFiles = filterAvailableFigureFiles(
    folderPath,
    extractMarkdownFigureFiles(markdown)
  );
  const researchScopedFigureFiles = findResearchScopedFigureFiles(folderPath, reportDate);
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
    executiveSummary: metadata.executiveSummary,
    markdown,
    sectionFiles: listSectionFiles(folderPath),
    figureFiles,
    openAiFigureFiles: filterAvailableFigureFiles(
      folderPath,
      figureFiles.map(fileName => buildDailyReportOpenAiFigureFileName(fileName))
    ),
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
    openAiFigureFiles: listRootFigureFiles(rootPath, sourceKey, true),
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

  return packages.sort((left, right) => {
    const byDate = right.reportDate.localeCompare(left.reportDate);
    if (byDate !== 0) {
      return byDate;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
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
      openAiFigureFiles: source.openAiFigureFiles,
      tickerUniverse: source.tickerUniverse,
      researchFileCount: source.researchFileCount,
      sourceKind: source.sourceKind,
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
  if (!source || source.sourceKind !== "folder") {
    return null;
  }

  const normalized = normalizeRelativeAssetPath(relativeAssetPath);
  if (!normalized || normalized.includes("..")) {
    return null;
  }

  const folderPath = path.join(getDailyReportRootPath(), source.folderName);
  const resolvedPath = path.resolve(folderPath, normalized);
  const relative = path.relative(folderPath, resolvedPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    return null;
  }

  return resolvedPath;
}
