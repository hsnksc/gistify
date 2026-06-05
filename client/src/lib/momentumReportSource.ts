export interface MarkdownTable {
  headers: string[];
  rows: string[][];
}

export interface MomentumIndexRow {
  index: string;
  closeLabel: string;
  changeLabel: string;
  pctChangeLabel: string;
  pctChange: number | null;
  comment: string;
}

export interface MomentumMetricRow {
  label: string;
  value: string;
  comment: string;
  numericValue: number | null;
}

export interface MomentumSectorRow {
  sector: string;
  dayChangeLabel: string;
  dayChange: number | null;
  weeklyLabel: string;
  weeklyChange: number | null;
  comment: string;
}

export interface MomentumMoverRow {
  name: string;
  ticker: string;
  moveLabel: string;
  movePct: number | null;
  catalyst: string;
}

export interface MomentumHavenRow {
  symbol: string;
  performanceLabel: string;
  performance: number | null;
  role: string;
}

export interface MacroRow {
  metric: string;
  value: string;
  comment: string;
}

export interface TechnicalLevel {
  bucket: "resistance" | "support" | "current";
  label: string;
  valueLabel: string;
  value: number | null;
  note: string;
}

export interface RegimeFactorRow {
  factor: string;
  value: string;
  comment: string;
}

export interface RsiRow {
  subject: string;
  rsiLabel: string;
  rsiValue: number | null;
  status: string;
}

export interface KeyValueRow {
  label: string;
  value: string;
}

export type MomentumCandidateGroup = "upside" | "downside" | "defensive";

export interface MomentumCandidateRow {
  group: MomentumCandidateGroup;
  name: string;
  ticker: string;
  reason: string;
  risk: string;
  scoreLabel: string;
  score: number | null;
}

export interface CalendarEventRow {
  date: string;
  event: string;
  impact: string;
}

export interface StrategyBandRow {
  regime: string;
  strategy: string;
  position: string;
}

export interface ScenarioRow {
  scenario: string;
  probabilityLabel: string;
  probability: number | null;
  action: string;
}

export interface OptionStrategyRow {
  strategy: string;
  condition: string;
  target: string;
}

export interface RiskFactorRow {
  title: string;
  detail: string;
}

export interface CriticalLevelRow {
  symbol: string;
  levelLabel: string;
  level: number | null;
  meaning: string;
}

export interface MomentumReportSource {
  sourceFile: string;
  rawMarkdown: string;
  title: string;
  subtitle: string;
  reportDate: string;
  reportDateLabel: string;
  sessionDateLabel: string;
  targetDateLabel: string;
  readingTimeLabel: string;
  executiveSummary: string;
  indexRows: MomentumIndexRow[];
  vixRows: MomentumMetricRow[];
  vixCommentary: string[];
  sectorRows: MomentumSectorRow[];
  loserRows: MomentumMoverRow[];
  gainerRows: MomentumMoverRow[];
  havenRows: MomentumHavenRow[];
  rateRows: MacroRow[];
  growthRows: MacroRow[];
  forecastRows: MacroRow[];
  technicalLevels: TechnicalLevel[];
  qqqLevels: MomentumMetricRow[];
  vixTechnicalRows: MomentumMetricRow[];
  vixTechnicalCommentary: string[];
  regimeFactors: RegimeFactorRow[];
  regimeLabel: string;
  rsiRows: RsiRow[];
  rvolRows: KeyValueRow[];
  candidates: MomentumCandidateRow[];
  calendarEvents: CalendarEventRow[];
  specialCatalysts: string[];
  strategyBands: StrategyBandRow[];
  scenarios: ScenarioRow[];
  optionStrategies: OptionStrategyRow[];
  riskFactors: RiskFactorRow[];
  criticalLevels: CriticalLevelRow[];
  conclusionParagraphs: string[];
  footerNote: string;
}

function splitLines(markdown: string) {
  return markdown.split(/\r?\n/);
}

function cleanText(value: string) {
  return value
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(cell => cleanText(cell));
}

function isDividerRow(cells: string[]) {
  return cells.every(cell => /^:?-{2,}:?$/.test(cell.replace(/\s+/g, "")));
}

function parseTable(lines: string[], startIndex: number) {
  const tableLines: string[] = [];
  let index = startIndex;

  while (index < lines.length && (lines[index] || "").trim().startsWith("|")) {
    tableLines.push((lines[index] || "").trim());
    index += 1;
  }

  const parsedRows = tableLines.map(parseTableRow).filter(row => row.length > 0);
  if (parsedRows.length < 2) {
    return { table: null, nextIndex: index };
  }

  const [headers, ...rest] = parsedRows;
  const rows = rest.filter(row => !isDividerRow(row));
  if (!headers.length || !rows.length) {
    return { table: null, nextIndex: index };
  }

  return {
    table: { headers, rows } satisfies MarkdownTable,
    nextIndex: index,
  };
}

function parsePercent(value: string) {
  const match = cleanText(value).match(/-?\d+(?:[.,]\d+)?/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[0].replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseNumber(value: string) {
  const match = cleanText(value).match(/-?\d[\d.,]*/);
  if (!match) {
    return null;
  }

  let token = match[0];
  if (token.includes(",") && token.includes(".")) {
    token = token.replace(/,/g, "");
  } else {
    token = token.replace(",", ".");
  }

  const parsed = Number(token);
  return Number.isFinite(parsed) ? parsed : null;
}

function findLineIndex(lines: string[], matcher: RegExp, startIndex = 0) {
  for (let index = startIndex; index < lines.length; index += 1) {
    if (matcher.test((lines[index] || "").trim())) {
      return index;
    }
  }

  return -1;
}

function getSectionLines(lines: string[], matcher: RegExp) {
  const start = findLineIndex(lines, matcher);
  if (start < 0) {
    return [];
  }

  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    const trimmed = (lines[index] || "").trim();
    if (/^(##|###)\s+/.test(trimmed) || trimmed === "---") {
      end = index;
      break;
    }
  }

  return lines.slice(start + 1, end);
}

function readQuoteBlock(lines: string[], startIndex = 0) {
  const items: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = (lines[index] || "").trim();
    if (!line.startsWith(">")) {
      break;
    }

    items.push(cleanText(line.replace(/^>\s*/, "")));
    index += 1;
  }

  return { items, nextIndex: index };
}

function readOrderedList(lines: string[], startIndex = 0) {
  const items: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = (lines[index] || "").trim();
    if (!/^\d+\.\s+/.test(line)) {
      break;
    }

    items.push(cleanText(line.replace(/^\d+\.\s+/, "")));
    index += 1;
  }

  return { items, nextIndex: index };
}

function readCodeFence(lines: string[], startIndex = 0) {
  let index = startIndex;
  while (index < lines.length && !(lines[index] || "").trim().startsWith("```")) {
    index += 1;
  }

  if (index >= lines.length) {
    return { lines: [] as string[], nextIndex: index };
  }

  index += 1;
  const block: string[] = [];

  while (index < lines.length && !(lines[index] || "").trim().startsWith("```")) {
    block.push((lines[index] || "").replace(/\r/g, ""));
    index += 1;
  }

  return { lines: block, nextIndex: Math.min(index + 1, lines.length) };
}

function extractTurkishDate(value: string) {
  const normalized = cleanText(value)
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

function extractSubtitleDates(subtitle: string) {
  const matches =
    subtitle.match(/\d{1,2}\s+[A-Za-zÇĞİÖŞÜçğıöşü]+\s+\d{4}/g) || [];

  return {
    sessionDateLabel: cleanText(matches[0] || ""),
    targetDateLabel: cleanText(matches[1] || ""),
  };
}

function parseIndexRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      index: row[0] || "",
      closeLabel: row[1] || "",
      changeLabel: row[2] || "",
      pctChangeLabel: row[3] || "",
      pctChange: parsePercent(row[3] || ""),
      comment: row[4] || "",
    }))
    .filter(row => row.index);
}

function parseMetricRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      label: row[0] || "",
      value: row[1] || "",
      comment: row[2] || "",
      numericValue: parseNumber(row[1] || ""),
    }))
    .filter(row => row.label);
}

function parseSectorRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      sector: row[0] || "",
      dayChangeLabel: row[1] || "",
      dayChange: parsePercent(row[1] || ""),
      weeklyLabel: row[2] || "",
      weeklyChange: parsePercent(row[2] || ""),
      comment: row[3] || "",
    }))
    .filter(row => row.sector);
}

function parseMoverRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      name: row[0] || "",
      ticker: row[1] || "",
      moveLabel: row[2] || "",
      movePct: parsePercent(row[2] || ""),
      catalyst: row[3] || "",
    }))
    .filter(row => row.name || row.ticker);
}

function parseHavenRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      symbol: row[0] || "",
      performanceLabel: row[1] || "",
      performance: parsePercent(row[1] || ""),
      role: row[2] || "",
    }))
    .filter(row => row.symbol);
}

function parseMacroRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      metric: row[0] || "",
      value: row[1] || "",
      comment: row[2] || "",
    }))
    .filter(row => row.metric);
}

function parseTechnicalLevels(codeLines: string[]) {
  const levels: TechnicalLevel[] = [];
  let bucket: TechnicalLevel["bucket"] = "resistance";

  for (const rawLine of codeLines) {
    const line = cleanText(rawLine);
    if (!line) {
      continue;
    }

    if (line.includes("DIRENC")) {
      bucket = "resistance";
      continue;
    }

    if (line.includes("DESTEK")) {
      bucket = "support";
      continue;
    }

    if (line.startsWith("MEVCUT:")) {
      const valueLabel = cleanText(line.replace(/^MEVCUT:\s*/i, "").split("(")[0] || "");
      const note = cleanText(line.slice(line.indexOf("(")).replace(/[()]/g, ""));
      levels.push({
        bucket: "current",
        label: "MEVCUT",
        valueLabel,
        value: parseNumber(valueLabel),
        note,
      });
      continue;
    }

    const match = line.match(/^([RS]\d):\s*([^-—]+?)\s*[—-]\s*(.+)$/i);
    if (!match) {
      continue;
    }

    levels.push({
      bucket,
      label: cleanText(match[1] || ""),
      valueLabel: cleanText(match[2] || ""),
      value: parseNumber(match[2] || ""),
      note: cleanText(match[3] || ""),
    });
  }

  return levels;
}

function parseRegimeFactors(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      factor: row[0] || "",
      value: row[1] || "",
      comment: row[2] || "",
    }))
    .filter(row => row.factor);
}

function parseRsiRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      subject: row[0] || "",
      rsiLabel: row[1] || "",
      rsiValue: parsePercent(row[1] || ""),
      status: row[2] || "",
    }))
    .filter(row => row.subject);
}

function parseKeyValueRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      label: row[0] || "",
      value: row[1] || "",
    }))
    .filter(row => row.label);
}

function parseCandidateRows(
  table: MarkdownTable | null,
  group: MomentumCandidateGroup
) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => {
      const name = row[0] || "";
      const tickerMatch = name.match(/\(([A-Z.-]+)\)/);

      return {
        group,
        name,
        ticker: tickerMatch?.[1] || name.replace(/^.*?([A-Z]{2,5}).*$/, "$1"),
        reason: row[1] || "",
        risk: row[2] || "",
        scoreLabel: row[3] || "",
        score: parsePercent(row[3] || ""),
      } satisfies MomentumCandidateRow;
    })
    .filter(row => row.name);
}

function parseCalendarEvents(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      date: row[0] || "",
      event: row[1] || "",
      impact: row[2] || "",
    }))
    .filter(row => row.date);
}

function parseStrategyBands(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      regime: row[0] || "",
      strategy: row[1] || "",
      position: row[2] || "",
    }))
    .filter(row => row.regime);
}

function parseScenarioRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      scenario: row[0] || "",
      probabilityLabel: row[1] || "",
      probability: parsePercent(row[1] || ""),
      action: row[2] || "",
    }))
    .filter(row => row.scenario);
}

function parseOptionStrategyRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      strategy: row[0] || "",
      condition: row[1] || "",
      target: row[2] || "",
    }))
    .filter(row => row.strategy);
}

function parseRiskFactors(items: string[]) {
  return items.map(item => {
    const [title, ...rest] = item.split(":");
    return {
      title: cleanText(title || item),
      detail: cleanText(rest.join(":") || ""),
    } satisfies RiskFactorRow;
  });
}

function parseCriticalLevels(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      symbol: row[0] || "",
      levelLabel: row[1] || "",
      level: parseNumber(row[1] || ""),
      meaning: row[2] || "",
    }))
    .filter(row => row.symbol);
}

function collectParagraphs(lines: string[]) {
  return lines
    .map(line => cleanText(line))
    .filter(line => line && !line.startsWith("|") && !line.startsWith(">"));
}

function findFooterNote(lines: string[]) {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const trimmed = (lines[index] || "").trim();
    if (trimmed.startsWith("*Rapor tarihi:")) {
      return cleanText(trimmed.replace(/^\*/, "").replace(/\*$/, ""));
    }
  }

  return "";
}

export function parseMomentumReportMarkdown(
  markdown: string,
  sourceFile = "momentum/source.md"
): MomentumReportSource {
  const lines = splitLines(markdown);
  const title = cleanText((lines[0] || "").replace(/^#\s*/, ""));
  const subtitle = cleanText((lines[1] || "").replace(/^##\s*/, ""));
  const { sessionDateLabel, targetDateLabel } = extractSubtitleDates(subtitle);
  const footerNote = findFooterNote(lines);
  const footerDateLabel = cleanText(
    (footerNote.match(/Rapor tarihi:\s*([^|]+)/i)?.[1] || "").trim()
  );
  const reportDateLabel = footerDateLabel || sessionDateLabel || subtitle;
  const reportDate =
    extractTurkishDate(reportDateLabel) ||
    extractTurkishDate(sessionDateLabel) ||
    "";
  const readingTimeLabel =
    cleanText(
      markdown.match(/Tahmini okuma suresi:\s*([^.*]+?)(?:\.|\*\*)/i)?.[1] || ""
    ) || "-";

  const executiveSummary = collectParagraphs(
    getSectionLines(lines, /^##\s+OZET EXECUTIVE SUMMARY$/i)
  ).join(" ");

  const indexRows = parseIndexRows(
    parseTable(getSectionLines(lines, /^###\s+1\.1 /i), 0).table
  );
  const vixSectionLines = getSectionLines(lines, /^###\s+1\.2 /i);
  const vixRows = parseMetricRows(parseTable(vixSectionLines, 0).table);
  const vixQuoteStart = findLineIndex(vixSectionLines, /^>/);
  const vixCommentary =
    vixQuoteStart >= 0 ? readQuoteBlock(vixSectionLines, vixQuoteStart).items : [];
  const sectorRows = parseSectorRows(
    parseTable(getSectionLines(lines, /^###\s+1\.3 /i), 0).table
  );

  const loserRows = parseMoverRows(
    parseTable(getSectionLines(lines, /^###\s+2\.1 /i), 0).table
  );
  const gainerRows = parseMoverRows(
    parseTable(getSectionLines(lines, /^###\s+2\.2 /i), 0).table
  );
  const havenRows = parseHavenRows(
    parseTable(getSectionLines(lines, /^###\s+2\.3 /i), 0).table
  );

  const rateRows = parseMacroRows(
    parseTable(getSectionLines(lines, /^###\s+3\.1 /i), 0).table
  );
  const growthRows = parseMacroRows(
    parseTable(getSectionLines(lines, /^###\s+3\.2 /i), 0).table
  );
  const forecastRows = parseMacroRows(
    parseTable(getSectionLines(lines, /^###\s+3\.3 /i), 0).table
  );

  const technicalLevels = parseTechnicalLevels(
    readCodeFence(getSectionLines(lines, /^###\s+4\.1 /i), 0).lines
  );
  const qqqLevels = parseMetricRows(
    parseTable(getSectionLines(lines, /^###\s+4\.2 /i), 0).table
  );
  const vixTechnicalSectionLines = getSectionLines(lines, /^###\s+4\.3 /i);
  const vixTechnicalRows = parseMetricRows(parseTable(vixTechnicalSectionLines, 0).table);
  const vixTechnicalQuoteStart = findLineIndex(vixTechnicalSectionLines, /^>/);
  const vixTechnicalCommentary =
    vixTechnicalQuoteStart >= 0
      ? readQuoteBlock(vixTechnicalSectionLines, vixTechnicalQuoteStart).items
      : [];

  const regimeSectionLines = getSectionLines(lines, /^###\s+5\.1 /i);
  const regimeFactors = parseRegimeFactors(parseTable(regimeSectionLines, 0).table);
  const regimeLabel =
    collectParagraphs(regimeSectionLines).find(line =>
      line.startsWith("Piyasa Rejimi:")
    )?.replace(/^Piyasa Rejimi:\s*/i, "") || "-";
  const rsiRows = parseRsiRows(
    parseTable(getSectionLines(lines, /^###\s+5\.2 /i), 0).table
  );
  const rvolRows = parseKeyValueRows(
    parseTable(getSectionLines(lines, /^###\s+5\.3 /i), 0).table
  );

  const candidates = [
    ...parseCandidateRows(
      parseTable(getSectionLines(lines, /^###\s+6\.1 /i), 0).table,
      "upside"
    ),
    ...parseCandidateRows(
      parseTable(getSectionLines(lines, /^###\s+6\.2 /i), 0).table,
      "downside"
    ),
    ...parseCandidateRows(
      parseTable(getSectionLines(lines, /^###\s+6\.3 /i), 0).table,
      "defensive"
    ),
  ];

  const calendarEvents = parseCalendarEvents(
    parseTable(getSectionLines(lines, /^###\s+7\.1 /i), 0).table
  );
  const specialCatalysts = (() => {
    const specialSectionLines = getSectionLines(lines, /^###\s+7\.2 /i);
    const quoteStart = findLineIndex(specialSectionLines, /^>/);
    return quoteStart >= 0
      ? readQuoteBlock(specialSectionLines, quoteStart).items
      : collectParagraphs(specialSectionLines);
  })();

  const strategyBands = parseStrategyBands(
    parseTable(getSectionLines(lines, /^###\s+8\.1 /i), 0).table
  );
  const scenarios = parseScenarioRows(
    parseTable(getSectionLines(lines, /^###\s+8\.2 /i), 0).table
  );
  const optionStrategies = parseOptionStrategyRows(
    parseTable(getSectionLines(lines, /^###\s+8\.3 /i), 0).table
  );

  const riskSectionLines = getSectionLines(lines, /^###\s+9\.1 /i);
  const riskListStart = findLineIndex(riskSectionLines, /^\d+\.\s+/);
  const riskFactors =
    riskListStart >= 0
      ? parseRiskFactors(readOrderedList(riskSectionLines, riskListStart).items)
      : [];
  const criticalLevels = parseCriticalLevels(
    parseTable(getSectionLines(lines, /^###\s+9\.2 /i), 0).table
  );

  const conclusionParagraphs = collectParagraphs(
    getSectionLines(lines, /^##\s+10\.\s+SONUC ve OZET$/i)
  );

  return {
    sourceFile,
    rawMarkdown: markdown,
    title,
    subtitle,
    reportDate,
    reportDateLabel,
    sessionDateLabel,
    targetDateLabel,
    readingTimeLabel,
    executiveSummary,
    indexRows,
    vixRows,
    vixCommentary,
    sectorRows,
    loserRows,
    gainerRows,
    havenRows,
    rateRows,
    growthRows,
    forecastRows,
    technicalLevels,
    qqqLevels,
    vixTechnicalRows,
    vixTechnicalCommentary,
    regimeFactors,
    regimeLabel,
    rsiRows,
    rvolRows,
    candidates,
    calendarEvents,
    specialCatalysts,
    strategyBands,
    scenarios,
    optionStrategies,
    riskFactors,
    criticalLevels,
    conclusionParagraphs,
    footerNote,
  };
}
