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
  signature?: string;
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
  ivRank?: number;
  low52?: number;
  optionExpiry?: string;
  price?: number;
  reportDate?: string;
  reportTimestamp?: string;
  rsi?: number;
  shortFloat?: number;
  targetAvg?: number;
}

export interface CoverageStrategy {
  breakeven: number;
  cost: number;
  legs: string;
  max_gain: number;
  max_loss: number;
  name: string;
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
  strategy?: CoverageStrategy;
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

function detectTableSignature(headers: string[]): string {
  const normalized = headers.map(h => normalizeCoverageKey(h));
  if (normalized.includes('strike') && normalized.includes('bid') && normalized.includes('ask')) return 'options-chain';
  if (normalized.includes('hisse') && normalized.includes('pl')) return 'payoff';
  if (normalized.includes('seviye') && normalized.includes('tur') && normalized.includes('guc')) return 'level-ladder';
  if (normalized.includes('tarih') && normalized.includes('olay')) return 'catalyst-timeline';
  if (normalized.includes('donem') && normalized.includes('eps')) return 'earnings-history';
  if (normalized.includes('ticker') && normalized.includes('iliski')) return 'ecosystem-grid';
  if (normalized.includes('kriter')) return 'comparison-matrix';
  if (normalized.includes('senaryo')) return 'scenario-cards';
  if (normalized.includes('kaynak') && normalized.includes('url')) return 'source-list';
  if (normalized.includes('katalizor') && normalized.includes('etki')) return 'catalyst-matrix';
  return 'table';
}
function slugify(value: string) {
  return normalizeCoverageKey(value)
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractDateFromSourceName(sourceName: string) {
  const match = sourceName.match(/(\d{4}-\d{2}-\d{2})/);
  return match?.[1] || "";
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
      frontmatter: {} as Record<string, unknown>,
    };
  }

  const frontmatter = parseYamlFrontmatter(match[1]);

  return {
    body: raw.slice(match[0].length).trim(),
    frontmatter,
  };
}

function parseYamlFrontmatter(text: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = text.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const separatorIndex = line.indexOf(":");
    if (separatorIndex <= 0 || line.trim().startsWith("#")) {
      i += 1;
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const valueAfterColon = line.slice(separatorIndex + 1);

    // Check if next line is indented → nested object
    if (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) {
      const nested: Record<string, unknown> = {};
      i += 1;
      while (i < lines.length && /^\s+/.test(lines[i])) {
        const nestedLine = lines[i].trim();
        const nestedSep = nestedLine.indexOf(":");
        if (nestedSep > 0) {
          const nestedKey = nestedLine.slice(0, nestedSep).trim();
          const nestedValue = nestedLine.slice(nestedSep + 1).trim();
          nested[nestedKey] = parseYamlValue(nestedValue);
        }
        i += 1;
      }
      result[key] = nested;
      continue;
    }

    result[key] = parseYamlValue(valueAfterColon.trim());
    i += 1;
  }

  return result;
}

function parseYamlValue(value: string): unknown {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "~") return null;
  if (value === "") return "";
  const numMatch = value.replace(/,/g, "").match(/^-?\d+(?:\.\d+)?$/);
  if (numMatch) return Number(numMatch[0]);
  return value;
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
          signature: detectTableSignature(headers),
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
  frontmatter: Record<string, unknown>,
  metricRows: Map<string, string>
): CoverageMetrics {
  // Support nested frontmatter.metrics object
  const fmMetrics =
    typeof frontmatter.metrics === "object" && frontmatter.metrics !== null
      ? (frontmatter.metrics as Record<string, unknown>)
      : ({} as Record<string, unknown>);

  const reportTimestamp =
    extractIsoTimestamp(String(frontmatter.timestamp || "")) ||
    extractIsoTimestamp(String(frontmatter.date || "")) ||
    extractIsoTimestamp(readMetricValue(metricRows, METRIC_LABELS.reportDate));
  const reportDate =
    extractIsoDate(String(frontmatter.date || "")) ||
    extractIsoDate(readMetricValue(metricRows, METRIC_LABELS.reportDate));

  const price =
    parseNumber(String(fmMetrics.price || "")) ||
    parseNumber(readMetricValue(metricRows, METRIC_LABELS.price));
  const changePct =
    parseNumber(String(fmMetrics.change_pct || "")) ||
    parseNumber(readMetricValue(metricRows, METRIC_LABELS.changePct));
  const targetAvg =
    parseNumber(String(fmMetrics.target_avg || "")) ||
    parseNumber(readMetricValue(metricRows, METRIC_LABELS.targetAvg));
  const iv =
    parseNumber(String(fmMetrics.iv || "")) ||
    parseNumber(readMetricValue(metricRows, METRIC_LABELS.iv));
  const ivRank =
    parseNumber(String(fmMetrics.iv_rank || ""));
  const shortFloat =
    parseNumber(String(fmMetrics.short_float || "")) ||
    parseNumber(readMetricValue(metricRows, METRIC_LABELS.shortFloat));
  const rsi =
    parseNumber(String(fmMetrics.rsi || "")) ||
    parseNumber(readMetricValue(metricRows, METRIC_LABELS.rsi));
  const budget =
    parseNumber(String(fmMetrics.budget || "")) ||
    parseNumber(readMetricValue(metricRows, METRIC_LABELS.budget));
  const range = parseRange(
    readMetricValue(metricRows, METRIC_LABELS.range52) ||
    String(fmMetrics.low52 || "") + " - " + String(fmMetrics.high52 || "")
  );

  return {
    budget,
    changePct,
    earningsDate:
      extractIsoDate(String(fmMetrics.earnings_date || "")) ||
      extractIsoDate(readMetricValue(metricRows, METRIC_LABELS.earningsDate)),
    high52: range.high52 || parseNumber(String(fmMetrics.high52 || "")),
    iv,
    ivRank,
    low52: range.low52 || parseNumber(String(fmMetrics.low52 || "")),
    optionExpiry:
      extractIsoDate(String(fmMetrics.option_expiry || "")) ||
      extractIsoDate(readMetricValue(metricRows, METRIC_LABELS.optionExpiry)),
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
    String(frontmatter.ticker || "").trim().toUpperCase() ||
    title.match(/\(([A-Z.:-]+)\)/)?.[1]?.split(":").pop()?.trim() ||
    "UNKNOWN";
  const company =
    String(frontmatter.company || "").trim() ||
    title.replace(/\(.*?\)/g, "").trim() ||
    ticker;
  const reportDate =
    metrics.reportDate ||
    String(frontmatter.date || "").trim() ||
    extractDateFromSourceName(record.sourceName) ||
    record.importedAt.slice(0, 10);
  const searchText = [
    ticker,
    company,
    title,
    String(frontmatter.signal || ""),
    String(frontmatter.sector || ""),
    record.sourceName,
  ]
    .join(" ")
    .toLowerCase();

  // Extract strategy from frontmatter if available
  const fmStrategy =
    typeof frontmatter.strategy === "object" && frontmatter.strategy !== null
      ? (frontmatter.strategy as Record<string, unknown>)
      : undefined;

  const strategy: CoverageStrategy | undefined = fmStrategy
    ? {
        name: String(fmStrategy.name || ""),
        legs: String(fmStrategy.legs || ""),
        cost: Number(fmStrategy.cost || 0),
        max_gain: Number(fmStrategy.max_gain || 0),
        max_loss: Number(fmStrategy.max_loss || 0),
        breakeven: Number(fmStrategy.breakeven || 0),
      }
    : undefined;

  return {
    company,
    exchange: String(frontmatter.exchange || "").trim(),
    id: record.id,
    importedAt: record.importedAt,
    metrics: {
      ...metrics,
      reportDate,
    },
    raw: record.raw,
    reportDate,
    searchText,
    sector: String(frontmatter.sector || "").trim(),
    sections,
    signal: String(frontmatter.signal || "").trim(),
    sourceName: record.sourceName,
    strategy,
    summary: extractSummary(sections),
    ticker,
    title: title || `${ticker} Coverage Report`,
    type: String(frontmatter.type || "").trim(),
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
