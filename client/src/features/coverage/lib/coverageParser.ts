export interface CoverageStoredRecord {
  id: string;
  importedAt: string;
  raw: string;
  sourceName: string;
}

export interface CoverageChecklistItem {
  checked: boolean;
  id: string;
  text: string;
}

export interface CoverageTableBlock {
  headers: string[];
  rows: string[][];
  type: "table";
}

export interface CoverageParagraphBlock {
  text: string;
  type: "paragraph";
}

export interface CoverageQuoteBlock {
  text: string;
  type: "quote";
}

export interface CoverageListBlock {
  items: string[];
  type: "list";
}

export interface CoverageChecklistBlock {
  items: CoverageChecklistItem[];
  type: "checklist";
}

export type CoverageBlock =
  | CoverageChecklistBlock
  | CoverageListBlock
  | CoverageParagraphBlock
  | CoverageQuoteBlock
  | CoverageTableBlock;

export interface CoverageSection {
  blocks: CoverageBlock[];
  id: string;
  level: 2 | 3;
  rawText: string;
  title: string;
}

export interface CoverageMetrics {
  budget?: number;
  changePct?: number;
  earningsDate?: string;
  high52?: number;
  iv?: number;
  low52?: number;
  optionExpiry?: string;
  price?: number;
  reportDate?: string;
  reportTimestamp?: string;
  rsi?: number;
  shortFloat?: number;
  targetAvg?: number;
}

export interface CoverageReport {
  company: string;
  exchange: string;
  id: string;
  importedAt: string;
  metrics: CoverageMetrics;
  raw: string;
  reportDate: string;
  searchText: string;
  sector: string;
  sections: CoverageSection[];
  signal: string;
  sourceName: string;
  summary: string;
  ticker: string;
  title: string;
  type: string;
}

const TURKISH_MONTHS: Record<string, string> = {
  agu: "08",
  agustos: "08",
  ara: "12",
  aralik: "12",
  eki: "10",
  ekim: "10",
  eyl: "09",
  eylul: "09",
  haz: "06",
  haziran: "06",
  kas: "11",
  kasim: "11",
  mar: "03",
  mart: "03",
  may: "05",
  mayis: "05",
  nis: "04",
  nisan: "04",
  oca: "01",
  ocak: "01",
  sub: "02",
  subat: "02",
  tem: "07",
  temmuz: "07",
};

const METRIC_LABELS = {
  budget: ["butce", "budget"],
  changePct: ["fiyat degisimi", "price change", "change pct", "change"],
  earningsDate: ["earnings tarihi", "earnings date"],
  range52: ["52 haftalik aralik", "52 week range"],
  high52: ["52 haftalik aralik", "52 week range"],
  iv: ["iv mutlak", "iv", "implied volatility"],
  optionExpiry: ["opsiyon vadesi", "option expiry"],
  price: ["mevcut fiyat", "current price", "price"],
  reportDate: ["rapor tarihi", "report date", "date"],
  rsi: ["rsi 14", "rsi"],
  shortFloat: ["short of float", "short float", "short % of float"],
  targetAvg: ["analyst hedef ortalama", "target average", "analyst target average"],
} as const;

function stripLocaleNoise(value: string) {
  return value
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/Ç/g, "c")
    .replace(/Ğ/g, "g")
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/Ö/g, "o")
    .replace(/Ş/g, "s")
    .replace(/Ü/g, "u");
}

export function normalizeCoverageKey(value: string) {
  return stripLocaleNoise(value)
    .toLowerCase()
    .replace(/[^\w\s%/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string) {
  return normalizeCoverageKey(value)
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function hashString(value: string) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return Math.abs(hash >>> 0).toString(36);
}

function splitFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return {
      body: raw.trim(),
      frontmatter: {} as Record<string, string>,
    };
  }

  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = normalizeCoverageKey(line.slice(0, separatorIndex));
    const value = line.slice(separatorIndex + 1).trim();
    if (key) {
      frontmatter[key] = value;
    }
  }

  return {
    body: raw.slice(match[0].length).trim(),
    frontmatter,
  };
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(cell => cell.trim());
}

function isSeparatorRow(cells: string[]) {
  return (
    cells.length > 0 &&
    cells.every(cell => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, "")))
  );
}

function buildSectionId(title: string, level: 2 | 3, index: number) {
  const slug = slugify(title) || `section-${index + 1}`;
  return `${level === 2 ? "h2" : "h3"}-${index + 1}-${slug}`;
}

function parseBlocks(lines: string[]): CoverageBlock[] {
  const blocks: CoverageBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const current = lines[index].trim();
    if (!current) {
      index += 1;
      continue;
    }

    if (current.startsWith("|")) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index].trim());
        index += 1;
      }

      const rows = tableLines.map(splitTableRow).filter(row => row.length > 0);
      if (rows.length > 0) {
        const hasSeparator = rows.length > 1 && isSeparatorRow(rows[1]);
        const headers = rows[0];
        const dataRows = hasSeparator ? rows.slice(2) : rows.slice(1);
        blocks.push({
          headers,
          rows: dataRows,
          type: "table",
        });
      }
      continue;
    }

    if (current.startsWith(">")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({
        text: quoteLines.join(" ").trim(),
        type: "quote",
      });
      continue;
    }

    if (/^- \[( |x|X)\] /.test(current)) {
      const items: CoverageChecklistItem[] = [];
      while (index < lines.length && /^- \[( |x|X)\] /.test(lines[index].trim())) {
        const rawItem = lines[index].trim();
        const checked = /^- \[(x|X)\] /.test(rawItem);
        const text = rawItem.replace(/^- \[( |x|X)\] /, "").trim();
        items.push({
          checked,
          id: slugify(text) || `check-${items.length + 1}`,
          text,
        });
        index += 1;
      }
      blocks.push({
        items,
        type: "checklist",
      });
      continue;
    }

    if (/^- /.test(current)) {
      const items: string[] = [];
      while (index < lines.length && /^- /.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^- /, "").trim());
        index += 1;
      }
      blocks.push({
        items,
        type: "list",
      });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length) {
      const candidate = lines[index].trim();
      if (
        !candidate ||
        candidate.startsWith("|") ||
        candidate.startsWith(">") ||
        /^- /.test(candidate)
      ) {
        break;
      }
      paragraphLines.push(candidate);
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        text: paragraphLines.join(" ").trim(),
        type: "paragraph",
      });
      continue;
    }

    index += 1;
  }

  return blocks;
}

function parseSections(body: string) {
  const lines = body.split(/\r?\n/);
  const sections: CoverageSection[] = [];
  const preludeLines: string[] = [];
  let title = "";
  let currentTitle = "";
  let currentLevel: 2 | 3 = 2;
  let currentLines: string[] = [];

  const pushCurrent = () => {
    if (!currentTitle.trim()) {
      return;
    }

    sections.push({
      blocks: parseBlocks(currentLines),
      id: buildSectionId(currentTitle, currentLevel, sections.length),
      level: currentLevel,
      rawText: currentLines.join("\n").trim(),
      title: currentTitle.trim(),
    });
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      if (level === 1 && !title) {
        title = headingMatch[2].trim();
        continue;
      }

      if (level === 2 || level === 3) {
        pushCurrent();
        currentTitle = headingMatch[2].trim();
        currentLevel = level as 2 | 3;
        currentLines = [];
        continue;
      }
    }

    if (!currentTitle) {
      preludeLines.push(line);
      continue;
    }

    currentLines.push(line);
  }

  pushCurrent();

  return {
    prelude: preludeLines,
    sections,
    title: title.trim(),
  };
}

function findTableBlocks(lines: string[]) {
  const tables: string[][][] = [];
  let index = 0;

  while (index < lines.length) {
    if (!lines[index].trim().startsWith("|")) {
      index += 1;
      continue;
    }

    const chunk: string[] = [];
    while (index < lines.length && lines[index].trim().startsWith("|")) {
      chunk.push(lines[index].trim());
      index += 1;
    }
    const rows = chunk.map(splitTableRow).filter(row => row.length > 0);
    if (rows.length > 0) {
      tables.push(rows);
    }
  }

  return tables;
}

function readMetricRows(preludeLines: string[], sections: CoverageSection[]) {
  const rows = new Map<string, string>();
  const sources = [
    ...findTableBlocks(preludeLines),
    ...sections
      .flatMap(section => section.blocks)
      .filter(
        (block): block is CoverageTableBlock =>
          block.type === "table" && block.headers.length <= 2
      )
      .map(block => [block.headers, ...block.rows]),
  ];

  for (const table of sources) {
    const hasSeparator = table.length > 1 && isSeparatorRow(table[1]);
    const dataRows = hasSeparator ? table.slice(2) : table;
    for (const row of dataRows) {
      if (row.length < 2) {
        continue;
      }

      const key = normalizeCoverageKey(row[0].replace(/\*/g, ""));
      const value = row[1].trim();
      if (key && value && !rows.has(key)) {
        rows.set(key, value);
      }
    }
  }

  return rows;
}

function readMetricValue(
  metricRows: Map<string, string>,
  aliases: readonly string[]
) {
  for (const alias of aliases) {
    const normalizedAlias = normalizeCoverageKey(alias);
    for (const [key, value] of Array.from(metricRows.entries())) {
      if (key === normalizedAlias || key.startsWith(`${normalizedAlias} `)) {
        return value;
      }
    }
  }

  return "";
}

function parseNumber(value: string) {
  const match = value
    .replace(/,/g, "")
    .match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function parseRange(value: string) {
  const matches = value
    .replace(/,/g, "")
    .match(/-?\d+(?:\.\d+)?/g);
  if (!matches || matches.length < 2) {
    return {};
  }

  return {
    high52: Number(matches[1]),
    low52: Number(matches[0]),
  };
}

function extractIsoTimestamp(value: string) {
  const timestampMatch = value.match(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})/
  );
  return timestampMatch?.[0];
}

function extractIsoDate(value: string) {
  const dateMatch = value.match(/\d{4}-\d{2}-\d{2}/);
  if (dateMatch) {
    return dateMatch[0];
  }

  const normalized = normalizeCoverageKey(value.replace(/~/g, ""));
  const looseMatch = normalized.match(
    /\b(\d{1,2})\s+([a-z]+)\s+(\d{4})\b/
  );
  if (!looseMatch) {
    return undefined;
  }

  const month = TURKISH_MONTHS[looseMatch[2]];
  if (!month) {
    return undefined;
  }

  const day = looseMatch[1].padStart(2, "0");
  return `${looseMatch[3]}-${month}-${day}`;
}

function extractSummary(sections: CoverageSection[]) {
  for (const section of sections) {
    for (const block of section.blocks) {
      if (block.type === "quote" || block.type === "paragraph") {
        return block.text;
      }
    }
  }

  return "";
}

function extractMetrics(
  frontmatter: Record<string, string>,
  metricRows: Map<string, string>
): CoverageMetrics {
  const reportTimestamp =
    extractIsoTimestamp(frontmatter.timestamp || "") ||
    extractIsoTimestamp(frontmatter.date || "") ||
    extractIsoTimestamp(readMetricValue(metricRows, METRIC_LABELS.reportDate));
  const reportDate =
    extractIsoDate(frontmatter.date || "") ||
    extractIsoDate(readMetricValue(metricRows, METRIC_LABELS.reportDate));
  const price = parseNumber(readMetricValue(metricRows, METRIC_LABELS.price));
  const changePct = parseNumber(
    readMetricValue(metricRows, METRIC_LABELS.changePct)
  );
  const targetAvg = parseNumber(
    readMetricValue(metricRows, METRIC_LABELS.targetAvg)
  );
  const iv = parseNumber(readMetricValue(metricRows, METRIC_LABELS.iv));
  const shortFloat = parseNumber(
    readMetricValue(metricRows, METRIC_LABELS.shortFloat)
  );
  const rsi = parseNumber(readMetricValue(metricRows, METRIC_LABELS.rsi));
  const budget = parseNumber(readMetricValue(metricRows, METRIC_LABELS.budget));
  const range = parseRange(readMetricValue(metricRows, METRIC_LABELS.range52));

  return {
    budget,
    changePct,
    earningsDate: extractIsoDate(
      readMetricValue(metricRows, METRIC_LABELS.earningsDate)
    ),
    high52: range.high52,
    iv,
    low52: range.low52,
    optionExpiry: extractIsoDate(
      readMetricValue(metricRows, METRIC_LABELS.optionExpiry)
    ),
    price,
    reportDate,
    reportTimestamp,
    rsi,
    shortFloat,
    targetAvg,
  };
}

export function buildCoverageRecordId(raw: string, sourceName: string) {
  return `${slugify(sourceName || "coverage") || "coverage"}-${hashString(raw)}`;
}

export function parseCoverageReport(record: CoverageStoredRecord): CoverageReport {
  const { body, frontmatter } = splitFrontmatter(record.raw);
  const { prelude, sections, title } = parseSections(body);
  const metricRows = readMetricRows(prelude, sections);
  const metrics = extractMetrics(frontmatter, metricRows);
  const ticker =
    (frontmatter.ticker || "").trim().toUpperCase() ||
    title.match(/\(([A-Z.:-]+)\)/)?.[1]?.split(":").pop()?.trim() ||
    "UNKNOWN";
  const company =
    (frontmatter.company || "").trim() ||
    title.replace(/\(.*?\)/g, "").trim() ||
    ticker;
  const reportDate = metrics.reportDate || frontmatter.date || record.importedAt.slice(0, 10);
  const searchText = [
    ticker,
    company,
    title,
    frontmatter.signal || "",
    frontmatter.sector || "",
    record.sourceName,
  ]
    .join(" ")
    .toLowerCase();

  return {
    company,
    exchange: (frontmatter.exchange || "").trim(),
    id: record.id,
    importedAt: record.importedAt,
    metrics: {
      ...metrics,
      reportDate,
    },
    raw: record.raw,
    reportDate,
    searchText,
    sector: (frontmatter.sector || "").trim(),
    sections,
    signal: (frontmatter.signal || "").trim(),
    sourceName: record.sourceName,
    summary: extractSummary(sections),
    ticker,
    title: title || `${ticker} Coverage Report`,
    type: (frontmatter.type || "").trim(),
  };
}

function sortDateValue(value: string) {
  const normalized = value.slice(0, 10);
  return Number(normalized.replace(/-/g, ""));
}

export function compareCoverageReports(a: CoverageReport, b: CoverageReport) {
  const dateDelta = sortDateValue(b.reportDate) - sortDateValue(a.reportDate);
  if (dateDelta !== 0) {
    return dateDelta;
  }

  if (a.metrics.reportTimestamp && b.metrics.reportTimestamp) {
    return b.metrics.reportTimestamp.localeCompare(a.metrics.reportTimestamp);
  }

  return b.importedAt.localeCompare(a.importedAt);
}

export function groupCoverageReports(reports: CoverageReport[]) {
  const groups = new Map<string, CoverageReport[]>();
  for (const report of reports) {
    const next = groups.get(report.ticker) || [];
    next.push(report);
    groups.set(report.ticker, next);
  }

  for (const [ticker, items] of Array.from(groups.entries())) {
    groups.set(ticker, items.sort(compareCoverageReports));
  }

  return groups;
}
