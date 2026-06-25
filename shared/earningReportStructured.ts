export interface StructuredMarkdownTable {
  headers: string[];
  rows: string[][];
}

export interface StructuredReportMeta {
  title: string;
  reportDate: string;
  window: string;
  desk: string;
  version: string;
  currentMonth: string;
  nextMonth: string;
}

export interface StructuredMacroRow {
  indicator: string;
  level: string;
  weekChange: string;
  monthChange: string;
  signal: string;
}

export interface StructuredFomcRow {
  date: string;
  daysRemaining: string;
  blackoutStart: string;
  status: string;
  note: string;
}

export interface StructuredCalendarRow {
  date: string;
  ticker: string;
  company: string;
  sector: string;
  session: string;
  importance: string;
  note: string;
}

export interface StructuredCalendarTotals {
  events: number;
  highImportance: number;
  bmo: number;
  amc: number;
}

export interface StructuredCprRow {
  ticker: string;
  sector: string;
  price: string;
  hacimCpr: string;
  oiCpr: string;
  sentiment: string;
  ivRank: string;
  note: string;
}

export interface StructuredStrategyRow {
  ticker: string;
  strategyTitle: string;
  direction: string;
  setup: string;
  entryWindow: string;
  exitWindow: string;
  structure: string;
  greeksRaw: string;
  budgetCost: string;
  credit: string;
  maxRisk: string;
  targetProfit: string;
  note: string;
  company: string;
  sector: string;
  price: string;
  ivRank: string;
  cpr: string;
  earningsDate: string;
  earningsTime: string;
  importance: string;
}

export interface StructuredBudgetStrategyItem {
  ticker: string;
  title: string;
  risk: string;
  target: string;
  note: string;
}

export interface StructuredBudgetStrategyBucket {
  budgetLabel: string;
  label: string;
  items: StructuredBudgetStrategyItem[];
}

export interface StructuredPortfolioRecommendation {
  allocation: string;
  strategy: string;
  risk: string;
  target: string;
}

export interface StructuredPortfolioLevel {
  budget: string;
  label: string;
  recommendations: StructuredPortfolioRecommendation[];
}

export interface StructuredActionWeek {
  week: string;
  focus: string;
  actions: string[];
}

export interface StructuredDataNoteRow {
  field: string;
  status: string;
  sourceMethod: string;
}

export interface StructuredEarningsStrategyReport {
  meta: StructuredReportMeta;
  executiveSummary: string[];
  macroRows: StructuredMacroRow[];
  regime: string;
  fomc: StructuredFomcRow;
  calendar: StructuredCalendarRow[];
  calendarTotals: StructuredCalendarTotals;
  cprStocks: StructuredCprRow[];
  strategies: StructuredStrategyRow[];
  budgetBuckets: StructuredBudgetStrategyBucket[];
  portfolioLevels: StructuredPortfolioLevel[];
  actionWeeks: StructuredActionWeek[];
  dataNotes: StructuredDataNoteRow[];
}

const TURKISH_MONTHS = [
  "Ocak",
  "Subat",
  "Mart",
  "Nisan",
  "Mayis",
  "Haziran",
  "Temmuz",
  "Agustos",
  "Eylul",
  "Ekim",
  "Kasim",
  "Aralik",
];

function cleanText(value: string) {
  return value
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForSearch(value: string) {
  return cleanText(value)
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
}

function splitLines(markdown: string) {
  return markdown.split(/\r?\n/);
}

function splitSections(lines: string[], headingRegex: RegExp) {
  const indexes = lines
    .map((line, index) => (headingRegex.test((line || "").trim()) ? index : -1))
    .filter(index => index >= 0);

  const sections = new Map<string, string[]>();
  for (let index = 0; index < indexes.length; index += 1) {
    const start = indexes[index];
    const end = indexes[index + 1] ?? lines.length;
    sections.set(cleanText(lines[start] || ""), lines.slice(start + 1, end));
  }

  return sections;
}

function getSectionContent(
  sections: Map<string, string[]>,
  headingNeedle: string
): string[] {
  const needle = normalizeForSearch(headingNeedle);
  for (const [key, value] of Array.from(sections.entries())) {
    if (normalizeForSearch(key).includes(needle)) {
      return value;
    }
  }
  return [];
}

function parseTable(lines: string[], startIndex: number) {
  const tableLines: string[] = [];
  let index = startIndex;

  while (index < lines.length && (lines[index] || "").trim().startsWith("|")) {
    tableLines.push((lines[index] || "").trim());
    index += 1;
  }

  if (tableLines.length < 2) {
    return { table: null as StructuredMarkdownTable | null, nextIndex: index };
  }

  const rows = tableLines.map(line =>
    line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map(cell => cleanText(cell))
  );

  const [headers, separator, ...dataRows] = rows;
  if (
    !headers ||
    !separator ||
    !separator.every(cell => /^:?-{2,}:?$/.test(cell.replace(/\s+/g, "")))
  ) {
    return { table: null as StructuredMarkdownTable | null, nextIndex: index };
  }

  return {
    table: {
      headers: headers.map(header => normalizeForSearch(header)),
      rows: dataRows.filter(row => row.some(cell => cleanText(cell))),
    } satisfies StructuredMarkdownTable,
    nextIndex: index,
  };
}

function parseFirstTable(lines: string[]) {
  for (let index = 0; index < lines.length; index += 1) {
    if ((lines[index] || "").trim().startsWith("|")) {
      return parseTable(lines, index).table;
    }
  }
  return null;
}

function parseQuotedMetadata(lines: string[]) {
  const metadata = new Map<string, string>();
  for (const rawLine of lines) {
    const line = (rawLine || "").trim();
    const match = line.match(/^>\s*([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.+)$/);
    if (!match) {
      continue;
    }
    metadata.set(normalizeForSearch(match[1] || ""), cleanText(match[2] || ""));
  }
  return metadata;
}

function formatTurkishMonthYearFromIso(isoDate: string) {
  const match = cleanText(isoDate).match(/^(\d{4})-(\d{2})-\d{2}$/);
  if (!match) {
    return "";
  }

  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex >= TURKISH_MONTHS.length) {
    return "";
  }

  return `${TURKISH_MONTHS[monthIndex]} ${match[1]}`;
}

function deriveMonthLabelFromSourceFile(sourceFile: string, segmentIndex: 0 | 1) {
  const match = cleanText(sourceFile).match(/(\d{4})(\d{2})_(\d{4})(\d{2})/);
  if (!match) {
    return "";
  }

  const year = segmentIndex === 0 ? match[1] : match[3];
  const month = segmentIndex === 0 ? match[2] : match[4];
  return formatTurkishMonthYearFromIso(`${year}-${month}-01`);
}

function parseCalendarTotals(lines: string[]) {
  const totalsLine = lines.find(line =>
    normalizeForSearch(line || "").startsWith("totals:")
  );
  if (!totalsLine) {
    return {
      events: 0,
      highImportance: 0,
      bmo: 0,
      amc: 0,
    } satisfies StructuredCalendarTotals;
  }

  const values = new Map<string, number>();
  for (const token of cleanText(totalsLine)
    .replace(/^Totals:\s*/i, "")
    .split(",")) {
    const [label, rawValue] = token.split("=");
    if (!label || !rawValue) {
      continue;
    }
    const parsed = Number(cleanText(rawValue));
    if (Number.isFinite(parsed)) {
      values.set(normalizeForSearch(label), parsed);
    }
  }

  return {
    events: values.get("events") || 0,
    highImportance: values.get("highimportance") || 0,
    bmo: values.get("bmo") || 0,
    amc: values.get("amc") || 0,
  } satisfies StructuredCalendarTotals;
}

function parseStructuredFieldBullets(lines: string[]) {
  const fields = new Map<string, string>();

  for (const rawLine of lines) {
    const line = (rawLine || "").trim();
    const match = line.match(/^-+\s+\*\*(.+?)\*\*:\s*(.+)$/);
    if (!match) {
      continue;
    }

    fields.set(normalizeForSearch(match[1] || ""), cleanText(match[2] || ""));
  }

  return fields;
}

function parseBudgetBucketItems(lines: string[]) {
  const items: StructuredBudgetStrategyItem[] = [];

  for (const rawLine of lines) {
    const line = (rawLine || "").trim();
    const match = line.match(/^-+\s+\*\*(.+?)\*\*:\s*(.+)$/);
    if (!match) {
      continue;
    }

    const title = cleanText(match[1] || "");
    const detail = cleanText(match[2] || "");
    const ticker = title.match(/\b[A-Z]{1,5}\b/)?.[0] || title.split(" ")[0] || "";
    const risk = detail.match(/\$[\d,]+(?:\.\d+)?\s*risk/i)?.[0]?.replace(/\s*risk/i, "") || "";
    const target = detail.match(/\$[\d,]+(?:\.\d+)?\s*hedef/i)?.[0]?.replace(/\s*hedef/i, "") || "";
    const note = detail
      .replace(/\$[\d,]+(?:\.\d+)?\s*risk/i, "")
      .replace(/\$[\d,]+(?:\.\d+)?\s*hedef/i, "")
      .replace(/^[,.\s-]+/, "")
      .trim();

    items.push({
      ticker,
      title,
      risk,
      target,
      note,
    });
  }

  return items;
}

function parseActionWeek(lines: string[], heading: string) {
  const week = cleanText(heading.replace(/^###\s*/, ""));
  const focusLine = lines.find(line =>
    normalizeForSearch(line || "").startsWith("focus:")
  );
  const focus = focusLine
    ? cleanText(focusLine.replace(/^\*\*Focus\*\*:\s*/i, ""))
    : "";
  const actions: string[] = [];
  let inActions = false;

  for (const rawLine of lines) {
    const trimmed = (rawLine || "").trim();
    if (/^-+\s+\*\*Actions\*\*:/i.test(trimmed)) {
      inActions = true;
      continue;
    }

    if (inActions && /^-\s+/.test(trimmed)) {
      actions.push(cleanText(trimmed.replace(/^-+\s*/, "")));
      continue;
    }
  }

  return {
    week,
    focus,
    actions,
  } satisfies StructuredActionWeek;
}

export function isStructuredEarningsStrategyMarkdown(markdown: string) {
  const normalized = normalizeForSearch(markdown);
  return (
    normalized.includes("# earnings strategy report") &&
    normalized.includes("## executive summary") &&
    normalized.includes("## calendar") &&
    normalized.includes("## strategies")
  );
}

export function parseStructuredEarningsStrategyMarkdown(
  markdown: string,
  sourceFile = "earningreport/source.md"
): StructuredEarningsStrategyReport | null {
  if (!isStructuredEarningsStrategyMarkdown(markdown)) {
    return null;
  }

  const lines = splitLines(markdown);
  const sections = splitSections(lines, /^##\s+/);
  const metadata = parseQuotedMetadata(lines);
  const title = cleanText((lines[0] || "").replace(/^#\s*/, "")) || "Earnings Strategy Report";
  const reportDate = cleanText(metadata.get("reportdate") || "");
  const windowValue = cleanText(metadata.get("window") || "");
  const desk = cleanText(metadata.get("desk") || "");
  const version = cleanText(metadata.get("version") || "");
  const currentMonth =
    deriveMonthLabelFromSourceFile(sourceFile, 0) ||
    formatTurkishMonthYearFromIso(windowValue.split("/")[0] || "");
  const nextMonth =
    deriveMonthLabelFromSourceFile(sourceFile, 1) ||
    formatTurkishMonthYearFromIso(windowValue.split("/")[1] || "");

  const executiveSummary = getSectionContent(sections, "executive summary")
    .map((line: string) => cleanText(line || ""))
    .filter((line: string) => /^\d+\.\s+/.test(line))
    .map((line: string) => cleanText(line.replace(/^\d+\.\s*/, "")));

  const macroSection = getSectionContent(sections, "macro");
  const macroTable = parseFirstTable(macroSection);
  const macroRows: StructuredMacroRow[] = (macroTable?.rows || []).map(row => ({
    indicator: cleanText(row[0] || ""),
    level: cleanText(row[1] || ""),
    weekChange: cleanText(row[2] || ""),
    monthChange: cleanText(row[3] || ""),
    signal: cleanText(row[4] || ""),
  }));
  const regimeLine = macroSection.find((line: string) =>
    normalizeForSearch(line || "").startsWith("regime:")
  );
  const regime = regimeLine
    ? cleanText(regimeLine.replace(/^Regime:\s*/i, ""))
    : "";

  const fomcSection = getSectionContent(sections, "fomc");
  const fomcTable = parseFirstTable(fomcSection);
  const fomcMap = new Map(
    (fomcTable?.rows || []).map(row => [
      normalizeForSearch(row[0] || ""),
      cleanText(row[1] || ""),
    ])
  );
  const fomc = {
    date: fomcMap.get("date") || "",
    daysRemaining: fomcMap.get("daysremaining") || "",
    blackoutStart: fomcMap.get("blackoutstart") || "",
    status: fomcMap.get("status") || "",
    note: fomcMap.get("note") || "",
  } satisfies StructuredFomcRow;

  const calendarSection = getSectionContent(sections, "calendar");
  const calendarTable = parseFirstTable(calendarSection);
  const calendar: StructuredCalendarRow[] = (calendarTable?.rows || []).map(row => ({
    date: cleanText(row[0] || ""),
    ticker: cleanText(row[1] || ""),
    company: cleanText(row[2] || ""),
    sector: cleanText(row[3] || ""),
    session: cleanText(row[4] || ""),
    importance: cleanText(row[5] || ""),
    note: cleanText(row[6] || ""),
  }));
  const calendarTotals = parseCalendarTotals(calendarSection);
  if (!calendarTotals.events) {
    calendarTotals.events = calendar.length;
    calendarTotals.highImportance = calendar.filter(item =>
      normalizeForSearch(item.importance) === "high"
    ).length;
    calendarTotals.bmo = calendar.filter(item => normalizeForSearch(item.session) === "bmo").length;
    calendarTotals.amc = calendar.filter(item => normalizeForSearch(item.session) === "amc").length;
  }

  const cprSection = getSectionContent(sections, "cpr stocks");
  const cprTable = parseFirstTable(cprSection);
  const cprStocks: StructuredCprRow[] = (cprTable?.rows || []).map(row => ({
    ticker: cleanText(row[0] || ""),
    sector: cleanText(row[1] || ""),
    price: cleanText(row[2] || ""),
    hacimCpr: cleanText(row[3] || ""),
    oiCpr: cleanText(row[4] || ""),
    sentiment: cleanText(row[5] || ""),
    ivRank: cleanText(row[6] || ""),
    note: cleanText(row[7] || ""),
  }));
  const cprMap = new Map(cprStocks.map(row => [row.ticker, row] as const));
  const calendarMap = new Map(calendar.map(row => [row.ticker, row] as const));

  const strategySection = getSectionContent(sections, "strategies");
  const strategyBlocks = splitSections(strategySection, /^###\s+/);
  const strategies: StructuredStrategyRow[] = Array.from(strategyBlocks.entries())
    .map(([heading, blockLines]) => {
      const headingMatch = heading.match(/^###\s+([A-Z]{1,5})\s+[—-]\s+(.+?)(?:\s+\(([^)]+)\))?$/);
      if (!headingMatch) {
        return null;
      }

      const ticker = cleanText(headingMatch[1] || "");
      const strategyTitle = cleanText(headingMatch[2] || "");
      const directionFromHeading = cleanText(headingMatch[3] || "");
      const fields = parseStructuredFieldBullets(blockLines);
      const cpr = cprMap.get(ticker);
      const calendarRow = calendarMap.get(ticker);

      return {
        ticker,
        strategyTitle,
        direction: cleanText(fields.get("direction") || directionFromHeading),
        setup: cleanText(fields.get("setup") || strategyTitle),
        entryWindow: cleanText(fields.get("entrywindow") || ""),
        exitWindow: cleanText(fields.get("exitwindow") || ""),
        structure: cleanText(fields.get("structure") || ""),
        greeksRaw: cleanText(fields.get("greeks") || ""),
        budgetCost: cleanText(fields.get("budgetoptions") || ""),
        credit: cleanText(fields.get("credit") || ""),
        maxRisk: cleanText(fields.get("maxrisk") || ""),
        targetProfit: cleanText(fields.get("targetprofit") || ""),
        note: cleanText(fields.get("note") || ""),
        company: cleanText(calendarRow?.company || ""),
        sector: cleanText(cpr?.sector || calendarRow?.sector || ""),
        price: cleanText(cpr?.price || ""),
        ivRank: cleanText(cpr?.ivRank || ""),
        cpr: cleanText(cpr?.hacimCpr || ""),
        earningsDate: cleanText(calendarRow?.date || ""),
        earningsTime: cleanText(calendarRow?.session || ""),
        importance: cleanText(calendarRow?.importance || ""),
      } satisfies StructuredStrategyRow;
    })
    .filter((row): row is StructuredStrategyRow => Boolean(row));

  const budgetSection = getSectionContent(sections, "budget strategies");
  const budgetBuckets = Array.from(splitSections(budgetSection, /^###\s+/).entries()).map(
    ([heading, blockLines]) => ({
      budgetLabel: cleanText((heading.match(/^###\s+([^(]+)/)?.[1] || heading).trim()),
      label: cleanText((heading.match(/\(([^)]+)\)/)?.[1] || "")),
      items: parseBudgetBucketItems(blockLines),
    })
  );

  const portfolioSection = getSectionContent(sections, "portfolio");
  const portfolioLevels = Array.from(splitSections(portfolioSection, /^###\s+/).entries()).map(
    ([heading, blockLines]) => {
      const budget = cleanText(heading.match(/\$[\d,]+/)?.[0] || "");
      const label = cleanText(heading.replace(/^###\s*/, "").replace(/^\$[\d,]+\s*Portfolio\s*/i, ""));
      const table = parseFirstTable(blockLines);
      const recommendations = (table?.rows || [])
        .filter(row => {
          const allocation = normalizeForSearch(row[0] || "");
          return allocation && allocation !== "total";
        })
        .map(row => ({
          allocation: cleanText(row[0] || ""),
          strategy: cleanText(row[1] || ""),
          risk: cleanText(row[2] || ""),
          target: cleanText(row[3] || ""),
        }))
        .filter(item => item.strategy && !normalizeForSearch(item.strategy).includes("cash reserve"));

      return {
        budget,
        label,
        recommendations,
      } satisfies StructuredPortfolioLevel;
    })
    .filter(level => level.budget && level.recommendations.length > 0);

  const actionSection = getSectionContent(sections, "action plan");
  const actionWeeks = Array.from(splitSections(actionSection, /^###\s+/).entries()).map(
    ([heading, blockLines]) => parseActionWeek(blockLines, heading)
  );

  const dataNotesSection = getSectionContent(sections, "data notes");
  const dataNotesTable = parseFirstTable(dataNotesSection);
  const dataNotes: StructuredDataNoteRow[] = (dataNotesTable?.rows || []).map(row => ({
    field: cleanText(row[0] || ""),
    status: cleanText(row[1] || ""),
    sourceMethod: cleanText(row[2] || ""),
  }));

  return {
    meta: {
      title,
      reportDate,
      window: windowValue,
      desk,
      version,
      currentMonth,
      nextMonth,
    },
    executiveSummary,
    macroRows,
    regime,
    fomc,
    calendar,
    calendarTotals,
    cprStocks,
    strategies,
    budgetBuckets,
    portfolioLevels,
    actionWeeks,
    dataNotes,
  } satisfies StructuredEarningsStrategyReport;
}
