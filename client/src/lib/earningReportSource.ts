import {
  isStructuredEarningsStrategyMarkdown,
  parseStructuredEarningsStrategyMarkdown,
  type StructuredEarningsStrategyReport,
  type StructuredStrategyRow,
} from "@shared/earningReportStructured";

export interface MarkdownTable {
  headers: string[];
  rows: string[][];
}

export interface ReportMetaItem {
  label: string;
  value: string;
}

export interface TimelineStep {
  phase: string;
  label: string;
}

export interface GainDriver {
  factor: string;
  impact: string;
  assessment: string;
}

export interface AllocationEntry {
  ticker: string;
  capital: string;
  riskLevel: string;
}

export interface StrategyNote {
  title: string;
  lines: string[];
}

export interface StrategyMetrics {
  label: string;
  value: string;
}

export interface NewsBucket {
  key: "positive" | "negative" | "risk" | "mixed" | "other";
  label: string;
  items: string[];
}

export interface StrategyBlueprint {
  rawLines: string[];
  ratioText: string;
  callWeight: number | null;
  putWeight: number | null;
  biasLine: string;
  callHeading: string;
  callItems: string[];
  putHeading: string;
  putItems: string[];
  expiryLines: string[];
  entry: string;
  exit: string;
}

export interface GreekRow {
  greek: string;
  value: string;
  description: string;
}

export interface ScenarioRow {
  scenario: string;
  ivChange: string;
  stockMove: string;
  pnl: string;
}

export interface EarningsPosition {
  order: number;
  ticker: string;
  company: string;
  earningsLabel: string;
  earningsDate: string;
  earningsTime: string;
  daysLeft: number;
  strategyTitle: string;
  allocationCapital: string;
  allocationRisk: string;
  metrics: StrategyMetrics[];
  news: NewsBucket[];
  blueprint: StrategyBlueprint;
  greeks: GreekRow[];
  scenarios: ScenarioRow[];
  warnings: string[];
  notes: StrategyNote[];
  price: number | null;
  ivRank: number | null;
  expectedMove: number | null;
}

export interface TradeScheduleRow {
  date: string;
  ticker: string;
  action: string;
  note: string;
}

export interface RiskEntry {
  risk: string;
  probability: string;
  impact: string;
  mitigation: string;
}

export interface PositionSizingEntry {
  ticker: string;
  capital: string;
  contracts: string;
}

export interface EarningReportSource {
  sourceFile: string;
  rawMarkdown: string;
  title: string;
  subtitle: string;
  meta: ReportMetaItem[];
  reportDate: string;
  vixLabel: string;
  coreWindow: string;
  timelineSteps: TimelineStep[];
  gainDrivers: GainDriver[];
  allocations: AllocationEntry[];
  positions: EarningsPosition[];
  tradeSchedule: TradeScheduleRow[];
  risks: RiskEntry[];
  positionSizing: PositionSizingEntry[];
  goldenRules: string[];
  checklist: string[];
  disclaimer: string;
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
  if (startIndex < 0 || startIndex >= lines.length) {
    return { table: null, nextIndex: Math.max(startIndex, 0) };
  }

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

function parseFirstTable(lines: string[]) {
  const startIndex = findLineIndex(lines, /^\|/);
  return startIndex >= 0 ? parseTable(lines, startIndex).table : null;
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

function parseHeadingMeta(lines: string[]) {
  const meta: ReportMetaItem[] = [];

  for (const rawLine of lines) {
    const line = (rawLine || "").trim();
    const match = line.match(/^(?:>\s*)?\*\*(.+?):\*\*\s*(.+)$/);
    if (!match) {
      continue;
    }

    const label = cleanText(match[1] || "");
    const value = cleanText(match[2] || "");

    if (label.toLowerCase() === "rapor tarihi" && /\|\s*VIX:/i.test(value)) {
      const [reportDatePart, vixPart] = value.split("|");
      meta.push({
        label,
        value: cleanText(reportDatePart || ""),
      });
      meta.push({
        label: "VIX",
        value: cleanText((vixPart || "").replace(/^VIX:\s*/i, "")),
      });
      continue;
    }

    meta.push({
      label,
      value,
    });
  }

  return meta;
}

function readCodeFence(lines: string[], startIndex: number) {
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

function readBulletList(lines: string[], startIndex: number) {
  const items: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = (lines[index] || "").trim();
    if (!line.startsWith("- ")) {
      break;
    }

    items.push(cleanText(line.slice(2)));
    index += 1;
  }

  return { items, nextIndex: index };
}

function readOrderedList(lines: string[], startIndex: number) {
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

function readQuoteBlock(lines: string[], startIndex: number) {
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

function findLineIndex(lines: string[], matcher: RegExp, startIndex = 0) {
  for (let index = startIndex; index < lines.length; index += 1) {
    if (matcher.test((lines[index] || "").trim())) {
      return index;
    }
  }

  return -1;
}

function splitSections(lines: string[], headingRegex: RegExp) {
  const indexes = lines
    .map((line, index) => (headingRegex.test((line || "").trim()) ? index : -1))
    .filter(index => index >= 0);

  const sections = new Map<string, string[]>();
  for (let index = 0; index < indexes.length; index += 1) {
    const start = indexes[index];
    const end = indexes[index + 1] ?? lines.length;
    const key = cleanText(lines[start] || "");
    sections.set(key, lines.slice(start + 1, end));
  }

  return sections;
}

function collectNarrativeLines(lines: string[]) {
  const items: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const trimmed = (lines[index] || "").trim();
    if (!trimmed) {
      index += 1;
      continue;
    }

    if (/^```/.test(trimmed)) {
      const fence = readCodeFence(lines, index);
      const codeLines = fence.lines
        .map(line => cleanText(line))
        .filter(Boolean)
        .filter(line => !/^%%\{/.test(line));
      if (codeLines.length && !/^(flowchart|timeline|xychart|pie)\b/i.test(codeLines[0] || "")) {
        items.push(...codeLines);
      }
      index = fence.nextIndex;
      continue;
    }

    if (trimmed.startsWith("|")) {
      const parsed = parseTable(lines, index);
      if (parsed.table) {
        for (const row of parsed.table.rows) {
          const rowText = parsed.table.headers
            .map((header, cellIndex) => `${header}: ${row[cellIndex] || "-"}`)
            .join(" | ");
          items.push(rowText);
        }
      }
      index = parsed.nextIndex;
      continue;
    }

    if (/^(###|####)\s+/.test(trimmed) || trimmed === "---") {
      index += 1;
      continue;
    }

    items.push(cleanText(trimmed));
    index += 1;
  }

  return Array.from(new Set(items.filter(Boolean)));
}

function parseSectionNotes(sectionLines: string[], fallbackTitle: string) {
  const subsectionMap = splitSections(sectionLines, /^####\s+/);
  if (!subsectionMap.size) {
    const lines = collectNarrativeLines(sectionLines);
    return lines.length
      ? [{ title: fallbackTitle, lines }] satisfies StrategyNote[]
      : [];
  }

  return Array.from(subsectionMap.entries())
    .map(([key, lines]) => ({
      title: cleanText(key.replace(/^####\s*/, "")),
      lines: collectNarrativeLines(lines),
    }))
    .filter(note => note.lines.length > 0);
}

function tableToKeyValueRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      label: row[0] || "",
      value: row[1] || "",
    }))
    .filter(row => row.label && row.value);
}

function parseGainDriversFromTable(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      factor: row[0] || "",
      impact: row[1] || "",
      assessment: row[2] || "",
    }))
    .filter(row => row.factor);
}

function parseFormulaGainDrivers(lines: string[]) {
  return lines
    .map(line => cleanText(line))
    .filter(line => line.startsWith("- "))
    .map(line => {
      const content = cleanText(line.slice(2));
      const [factor, ...rest] = content.split(":");
      return {
        factor: cleanText(factor || ""),
        impact: cleanText(rest.join(":") || ""),
        assessment: cleanText(rest.join(":") || ""),
      } satisfies GainDriver;
    })
    .filter(driver => driver.factor);
}

function parseAllocations(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      ticker: row[0] || "",
      capital: row[1] || "",
      riskLevel: row[5] || row[2] || "",
    }))
    .filter(row => row.ticker);
}

function parsePositionSizing(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      ticker: row[0] || "",
      capital: row[1] || "",
      contracts:
        row.length >= 4
          ? `Call: ${row[2] || "-"} | Put: ${row[3] || "-"}`
          : row[2] || "",
    }))
    .filter(row => row.ticker);
}

function parseTradeSchedule(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  const rows: TradeScheduleRow[] = [];
  for (const row of table.rows) {
    const ticker = row[0] || row[1] || "";
    const earnings = row[1] || "";
    const entry = row[8] || row[2] || "";
    const exit = row[9] || row[3] || "";

    if (entry) {
      rows.push({
        date: entry,
        ticker,
        action: "GIRIS",
        note: earnings || "Planlanan giris",
      });
    }

    if (exit) {
      rows.push({
        date: exit,
        ticker,
        action: "CIKIS",
        note: earnings || "Planlanan cikis",
      });
    }

    if (earnings) {
      rows.push({
        date: earnings,
        ticker,
        action: "EARNINGS",
        note: "Earnings eventi",
      });
    }
  }

  return rows;
}

function parseRiskEntries(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      risk: row[0] || "",
      probability: row[1] || "",
      impact: row[2] || "",
      mitigation: row[3] || "",
    }))
    .filter(row => row.risk);
}

function getSectionBody(lines: string[], headingIndex: number) {
  if (headingIndex < 0) {
    return [];
  }

  const nextLevelTwo = findLineIndex(lines, /^##\s+/, headingIndex + 1);
  const nextLevelThree = findLineIndex(lines, /^###\s+/, headingIndex + 1);
  const candidates = [nextLevelTwo, nextLevelThree].filter(index => index >= 0);
  const end = candidates.length ? Math.min(...candidates) : lines.length;
  return lines.slice(headingIndex + 1, end);
}

function parseTimelineSteps(codeLines: string[]) {
  return codeLines
    .map(line => cleanText(line))
    .filter(line => /^E[+-]\d+:/i.test(line))
    .map(line => {
      const [phase, ...rest] = line.split(":");
      return {
        phase: cleanText(phase || ""),
        label: cleanText(rest.join(":")),
      };
    });
}

function buildFallbackTimeline(coreWindow: string) {
  const core = cleanText(coreWindow);
  const fallback = [
    { phase: "Bias", label: "Haber ve catalyst akisini okuyup yon belirle." },
    { phase: "Oran", label: "Call / Put oranini ticker bazinda ayarla." },
    { phase: "Giris", label: "E-7 ile E-3 arasinda kademeli giris yap." },
    { phase: "Bekle", label: "IV expansion surerken pozisyonu yonet." },
    { phase: "Cikis", label: "Earnings oncesi cikip IV crush riskini kapat." },
  ] satisfies TimelineStep[];

  if (!core) {
    return fallback;
  }

  return fallback.map((step, index) =>
    index === 0 ? { ...step, label: core } : step
  );
}

function parseNewsBuckets(items: string[]) {
  const buckets: NewsBucket[] = [
    { key: "positive", label: "Pozitif", items: [] },
    { key: "negative", label: "Negatif", items: [] },
    { key: "risk", label: "Risk", items: [] },
    { key: "mixed", label: "Karisik", items: [] },
    { key: "other", label: "Diger", items: [] },
  ];

  for (const item of items) {
    const normalized = item.toUpperCase();
    if (normalized.startsWith("POZITIF:")) {
      buckets[0].items.push(cleanText(item.replace(/^POZITIF:\s*/i, "")));
      continue;
    }
    if (normalized.startsWith("NEGATIF:")) {
      buckets[1].items.push(cleanText(item.replace(/^NEGATIF:\s*/i, "")));
      continue;
    }
    if (normalized.startsWith("RISK:")) {
      buckets[2].items.push(cleanText(item.replace(/^RISK:\s*/i, "")));
      continue;
    }
    if (normalized.startsWith("KARISIK:")) {
      buckets[3].items.push(cleanText(item.replace(/^KARISIK:\s*/i, "")));
      continue;
    }

    buckets[4].items.push(cleanText(item));
  }

  return buckets.filter(bucket => bucket.items.length > 0);
}

function parseWeights(value: string) {
  const matches = value.match(/%(\d+(?:[.,]\d+)?)\s*Call.*?%(\d+(?:[.,]\d+)?)\s*Put/i);
  if (!matches) {
    return { callWeight: null, putWeight: null };
  }

  const callWeight = Number((matches[1] || "").replace(",", "."));
  const putWeight = Number((matches[2] || "").replace(",", "."));

  return {
    callWeight: Number.isFinite(callWeight) ? callWeight : null,
    putWeight: Number.isFinite(putWeight) ? putWeight : null,
  };
}

function parseBlueprint(sourceLines: string[]) {
  const codeLines = readCodeFence(sourceLines, 0).lines;
  const rawLines = (codeLines.length ? codeLines : sourceLines)
    .map(line => line.replace(/\s+$/g, ""))
    .map(line => cleanText(line))
    .filter(Boolean);

  const ratioLine =
    rawLines.find(line => /^Call\/Put Orani:/i.test(line)) ||
    rawLines.find(line => /^Oran:/i.test(line)) ||
    rawLines.find(line => /%\d+.*Call.*%\d+.*Put/i.test(line)) ||
    "";
  const ratioText = cleanText(
    ratioLine
      .replace(/^Call\/Put Orani:\s*/i, "")
      .replace(/^Oran:\s*/i, "")
  );
  const { callWeight, putWeight } = parseWeights(ratioText);

  const callItems: string[] = [];
  const putItems: string[] = [];
  const expiryLines: string[] = [];
  let entry = "";
  let exit = "";
  let biasLine = "";

  for (const line of rawLines) {
    if (/^Call Strike:/i.test(line) || /^Call\b/i.test(line)) {
      callItems.push(line);
      continue;
    }

    if (/^Put Strike:/i.test(line) || /^Put\b/i.test(line)) {
      putItems.push(line);
      continue;
    }

    if (/^Expiry:/i.test(line)) {
      expiryLines.push(cleanText(line.replace(/^Expiry:\s*/i, "")));
      continue;
    }

    if (/^Giris:/i.test(line)) {
      entry = cleanText(line.replace(/^Giris:\s*/i, ""));
      continue;
    }

    if (/^Cikis:/i.test(line)) {
      exit = cleanText(line.replace(/^Cikis:\s*/i, ""));
      continue;
    }

    if (/bias/i.test(line) || /bullish|bearish|mixed/i.test(line)) {
      biasLine = line;
    }
  }

  return {
    rawLines,
    ratioText,
    callWeight,
    putWeight,
    biasLine: cleanText(biasLine),
    callHeading: "Call leg",
    callItems,
    putHeading: "Put leg",
    putItems,
    expiryLines,
    entry,
    exit,
  } satisfies StrategyBlueprint;
}

function parseGreekRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      greek: row[0] || "",
      value: row[1] || "",
      description: row[2] || "",
    }))
    .filter(row => row.greek);
}

function parseScenarioRows(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      scenario: row[0] || "",
      ivChange: row[1] || "",
      stockMove: row[2] || "",
      pnl: row[3] || "",
    }))
    .filter(row => row.scenario);
}

function parseEarningsLabel(value: string) {
  const match = value.match(/^(.*)\s+(AMC|BMO)$/i);
  if (!match) {
    return {
      earningsDate: value,
      earningsTime: "-",
    };
  }

  return {
    earningsDate: cleanText(match[1] || value),
    earningsTime: (match[2] || "-").toUpperCase(),
  };
}

function collectAlertLines(lines: string[]) {
  const alerts: string[] = [];
  const quoteStart = findLineIndex(lines, /^>/);
  if (quoteStart >= 0) {
    alerts.push(...readQuoteBlock(lines, quoteStart).items);
  }

  for (const rawLine of lines) {
    const line = cleanText(rawLine || "");
    if (/^(Kritik Uyari|Onemli|Avantaj|FOMC UYARISI):/i.test(line)) {
      alerts.push(line);
    }
  }

  return Array.from(new Set(alerts.filter(Boolean)));
}

function normalizeStrategyTitle(
  strategyReasonHeading: string,
  blueprint: StrategyBlueprint
) {
  const normalizedHeading = cleanText(
    strategyReasonHeading
      .replace(/^###\s*/, "")
      .replace(/^Strateji Dayanagi\s*-\s*/i, "")
      .replace(/^Strateji:\s*/i, "")
  );

  if (normalizedHeading) {
    return normalizedHeading;
  }

  return blueprint.ratioText || "Strategy";
}

function parsePositionSection(
  lines: string[],
  allocationMap: Map<string, AllocationEntry>
) {
  const heading = cleanText(lines[0] || "");
  const match = heading.match(
    /^##\s+(\d+)\.\s+([A-Z]+)\s+\(([^)]+)\)\s+-\s+(.+?)\s+-\s+(\d+)\s+GUN KALDI$/i
  );

  if (!match) {
    return null;
  }

  const order = Number(match[1]);
  const ticker = cleanText(match[2] || "");
  const company = cleanText(match[3] || "");
  const earningsLabel = cleanText(match[4] || "");
  const daysLeft = Number(match[5]);
  const { earningsDate, earningsTime } = parseEarningsLabel(earningsLabel);
  const allocation = allocationMap.get(ticker);

  const sections = splitSections(lines.slice(1), /^###\s+/);
  const entries = Array.from(sections.entries());

  const metricsSection =
    entries.find(([key]) => /Hisse Durumu|Sirket Profili/i.test(key))?.[1] || [];
  const metricsTable = parseFirstTable(metricsSection);
  const metrics = tableToKeyValueRows(metricsTable);

  const newsSection =
    entries.find(([key]) => /Haber Analizi|Detayli Haber Analizi/i.test(key))?.[1] || [];
  const newsBullets = readBulletList(newsSection, 0).items;
  const news = parseNewsBuckets(newsBullets);
  const newsNotes = parseSectionNotes(newsSection, "Haber ozeti");

  const strategyReasonEntry =
    entries.find(([key]) => /Strateji Dayanagi/i.test(key)) || null;
  const strategyReasonHeading = strategyReasonEntry?.[0] || "";
  const strategyReasonNotes = strategyReasonEntry
    ? parseSectionNotes(strategyReasonEntry[1], "Strateji dayanaklari")
    : [];
  const strategyReasonTable = strategyReasonEntry
    ? parseFirstTable(strategyReasonEntry[1])
    : null;
  if (strategyReasonTable) {
    const linesFromTable = strategyReasonTable.rows.map(
      row =>
        `${strategyReasonTable.headers[0]}: ${row[0] || "-"} | ${strategyReasonTable.headers[1]}: ${row[1] || "-"} | ${strategyReasonTable.headers[2]}: ${row[2] || "-"}`
    );
    if (linesFromTable.length) {
      strategyReasonNotes.push({
        title: "Bias matrisi",
        lines: linesFromTable,
      });
    }
  }

  const strategyEntry =
    entries.find(([key]) => /^###\s+Strateji:/i.test(key)) ||
    entries.find(([key]) => /Strateji Detayi/i.test(key)) ||
    null;
  const strategyTitle = normalizeStrategyTitle(
    strategyReasonHeading,
    parseBlueprint(strategyEntry?.[1] || [])
  );
  const blueprint = parseBlueprint(strategyEntry?.[1] || []);

  const greeksSection =
    entries.find(([key]) => /Greeks Tahmini/i.test(key))?.[1] || [];
  const greeks = parseGreekRows(parseFirstTable(greeksSection));

  const scenarioSection =
    entries.find(([key]) => /Kar\/Zarar Senaryolari/i.test(key))?.[1] || [];
  const scenarios = parseScenarioRows(parseFirstTable(scenarioSection));

  const warningSection =
    entries.find(([key]) => /Kritik Uyarilar/i.test(key))?.[1] || [];
  const warnings = Array.from(
    new Set([
      ...readBulletList(warningSection, 0).items,
      ...collectAlertLines(strategyEntry?.[1] || []),
      ...collectAlertLines(strategyReasonEntry?.[1] || []),
    ].filter(Boolean))
  );

  const notes = entries
    .filter(([key]) => {
      return (
        !/Hisse Durumu|Sirket Profili/i.test(key) &&
        !/Haber Analizi|Detayli Haber Analizi/i.test(key) &&
        !/^###\s+Strateji:/i.test(key) &&
        !/Strateji Detayi/i.test(key) &&
        !/Strateji Dayanagi/i.test(key) &&
        !/Greeks Tahmini/i.test(key) &&
        !/Kar\/Zarar Senaryolari/i.test(key) &&
        !/Kritik Uyarilar/i.test(key)
      );
    })
    .map(([key, value]) => ({
      title: cleanText(key.replace(/^###\s*/, "")),
      lines: collectNarrativeLines(value),
    }))
    .filter(note => note.lines.length > 0);

  const mergedNotes = [...newsNotes, ...strategyReasonNotes, ...notes];
  const metricsMap = new Map(metrics.map(row => [row.label.toLowerCase(), row.value]));

  return {
    order,
    ticker,
    company,
    earningsLabel,
    earningsDate,
    earningsTime,
    daysLeft: Number.isFinite(daysLeft) ? daysLeft : 0,
    strategyTitle,
    allocationCapital: allocation?.capital || "-",
    allocationRisk: allocation?.riskLevel || "-",
    metrics,
    news,
    blueprint,
    greeks,
    scenarios,
    warnings,
    notes: mergedNotes,
    price: parseNumber(metricsMap.get("fiyat") || ""),
    ivRank: parsePercent(metricsMap.get("iv rank") || ""),
    expectedMove: parsePercent(metricsMap.get("expected move") || ""),
  } satisfies EarningsPosition;
}

function findMetaValue(meta: ReportMetaItem[], label: string) {
  return meta.find(item => item.label.toLowerCase() === label.toLowerCase())?.value || "";
}

function parseLegacyEarningReportMarkdown(
  markdown: string,
  sourceFile = "earningreport/source.md"
): EarningReportSource {
  const lines = splitLines(markdown);
  const firstDivider = findLineIndex(lines, /^---$/);
  const metaLines = firstDivider >= 0 ? lines.slice(0, firstDivider) : lines.slice(0, 16);
  const title = cleanText((metaLines[0] || "").replace(/^#\s*/, ""));
  const subtitle = cleanText((metaLines[1] || "").replace(/^##\s*/, ""));
  const meta = parseHeadingMeta(metaLines);
  const reportDate = findMetaValue(meta, "Rapor Tarihi") || "-";
  const vixLabel = findMetaValue(meta, "VIX") || "-";
  const mechanism = findMetaValue(meta, "Mekanizma");
  const strategyType = findMetaValue(meta, "Strateji Tipi");

  const principleIndex = findLineIndex(lines, /^##\s+Strateji Prensibi/i);
  const principleLines =
    principleIndex >= 0
      ? lines.slice(
          principleIndex + 1,
          findLineIndex(lines, /^##\s+\d+\./, principleIndex + 1) >= 0
            ? findLineIndex(lines, /^##\s+\d+\./, principleIndex + 1)
            : lines.length
        )
      : [];
  const principleCode = principleIndex >= 0 ? readCodeFence(lines, principleIndex) : { lines: [] as string[] };
  const timelineSteps = parseTimelineSteps(principleCode.lines);
  const coreWindow =
    mechanism ||
    collectNarrativeLines(principleLines).find(line =>
      /IV.*sisme|sisme surecine girer/i.test(line)
    ) ||
    strategyType;

  const gainIndex = findLineIndex(lines, /^###\s+Nasil Kazaniriz\?/i);
  const gainDrivers =
    gainIndex >= 0
      ? parseGainDriversFromTable(parseFirstTable(getSectionBody(lines, gainIndex)))
      : parseFormulaGainDrivers(principleLines);

  const allocationIndex =
    findLineIndex(lines, /^###\s+Portfoy Dagilimi/i) >= 0
      ? findLineIndex(lines, /^###\s+Portfoy Dagilimi/i)
      : findLineIndex(lines, /^##\s+Portfoy Dagilimi/i);
  const allocationSection =
    allocationIndex >= 0
      ? lines.slice(
          allocationIndex + 1,
          findLineIndex(lines, /^##\s+Risk Yonetimi/i, allocationIndex + 1) >= 0
            ? findLineIndex(lines, /^##\s+Risk Yonetimi/i, allocationIndex + 1)
            : lines.length
        )
      : [];
  const allocationTable = allocationSection.length ? parseFirstTable(allocationSection) : null;
  const allocations = parseAllocations(allocationTable);
  const positionSizing = parsePositionSizing(allocationTable);
  const allocationMap = new Map(allocations.map(entry => [entry.ticker, entry]));

  const allLevelTwoHeadings = lines
    .map((line, index) => (/^##\s+/.test((line || "").trim()) ? index : -1))
    .filter(index => index >= 0);
  const positionHeadingIndexes = allLevelTwoHeadings.filter(index =>
    /^##\s+\d+\./.test((lines[index] || "").trim())
  );

  const positions = positionHeadingIndexes
    .map(start => {
      const end = allLevelTwoHeadings.find(candidate => candidate > start) ?? lines.length;
      return parsePositionSection(lines.slice(start, end), allocationMap);
    })
    .filter((position): position is EarningsPosition => Boolean(position));

  const scheduleIndex = findLineIndex(lines, /^##\s+GIRIS\/CIKIS TAKVIMI$/i);
  let tradeSchedule =
    scheduleIndex >= 0
      ? parseTradeSchedule(parseFirstTable(getSectionBody(lines, scheduleIndex)))
      : [];
  if (!tradeSchedule.length) {
    const summaryIndex = findLineIndex(lines, /^##\s+Ozet Tablo/i);
    if (summaryIndex >= 0) {
      const summaryTable = parseFirstTable(getSectionBody(lines, summaryIndex));
      tradeSchedule = parseTradeSchedule(summaryTable);
    }
  }
  if (!tradeSchedule.length) {
    tradeSchedule = positions.flatMap(position => {
      const rows: TradeScheduleRow[] = [];
      if (position.blueprint.entry) {
        rows.push({
          date: position.blueprint.entry,
          ticker: position.ticker,
          action: "GIRIS",
          note: position.strategyTitle,
        });
      }
      rows.push({
        date: `${position.earningsDate} ${position.earningsTime}`.trim(),
        ticker: position.ticker,
        action: "EARNINGS",
        note: position.company,
      });
      if (position.blueprint.exit) {
        rows.push({
          date: position.blueprint.exit,
          ticker: position.ticker,
          action: "CIKIS",
          note: position.strategyTitle,
        });
      }
      return rows;
    });
  }

  const riskIndex = findLineIndex(lines, /^###\s+Ana Riskler$/i);
  const risks =
    riskIndex >= 0
      ? parseRiskEntries(parseFirstTable(getSectionBody(lines, riskIndex)))
      : [];

  const goldenRulesIndex =
    findLineIndex(lines, /^###\s+Golden Rules$/i) >= 0
      ? findLineIndex(lines, /^###\s+Golden Rules$/i)
      : findLineIndex(lines, /^###\s+\d+\s+Altin Kural/i);
  const goldenRules =
    goldenRulesIndex >= 0 ? readOrderedList(lines, goldenRulesIndex + 1).items : [];

  const checklistIndex = findLineIndex(lines, /^##\s+GUNLUK TAKIP KONTROL LISTESI$/i);
  let checklist: string[] = [];
  if (checklistIndex >= 0) {
    const checklistCode = readCodeFence(lines, checklistIndex);
    checklist = checklistCode.lines
      .map(line => cleanText(line))
      .filter(line => line.startsWith("[]"))
      .map(line => cleanText(line.replace(/^\[\]\s*/, "")));
  }
  if (!checklist.length) {
    checklist = goldenRules.slice(0, 6);
  }

  const disclaimerQuoteIndex = lines.findIndex(line =>
    (line || "").trim().startsWith("> **YASAL UYARI:**")
  );
  const disclaimer =
    disclaimerQuoteIndex >= 0
      ? readQuoteBlock(lines, disclaimerQuoteIndex).items.join(" ")
      : "";

  return {
    sourceFile,
    rawMarkdown: markdown,
    title,
    subtitle,
    meta,
    reportDate,
    vixLabel,
    coreWindow: coreWindow || "",
    timelineSteps: timelineSteps.length ? timelineSteps : buildFallbackTimeline(coreWindow || ""),
    gainDrivers,
    allocations,
    positions,
    tradeSchedule,
    risks,
    positionSizing,
    goldenRules,
    checklist,
    disclaimer,
  };
}

interface ModernPositionParseResult {
  position: EarningsPosition;
  scheduleRows: TradeScheduleRow[];
}

function parseAllTables(lines: string[]) {
  const tables: MarkdownTable[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = (lines[index] || "").trim();
    if (!line.startsWith("|")) {
      index += 1;
      continue;
    }

    const parsed = parseTable(lines, index);
    if (parsed.table) {
      tables.push(parsed.table);
      index = parsed.nextIndex;
      continue;
    }

    index += 1;
  }

  return tables;
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

function findLineIndexByText(lines: string[], searchText: string, startIndex = 0) {
  const needle = normalizeForSearch(searchText);

  for (let index = startIndex; index < lines.length; index += 1) {
    if (normalizeForSearch(lines[index] || "").includes(needle)) {
      return index;
    }
  }

  return -1;
}

function parseTurkishDateLabelClient(value: string) {
  const normalized = normalizeForSearch(value).replace(/\./g, " ");
  const match = normalized.match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/i);
  if (!match) {
    return "";
  }

  const monthMap: Record<string, string> = {
    ocak: "01",
    subat: "02",
    mart: "03",
    nisan: "04",
    mayis: "05",
    haziran: "06",
    temmuz: "07",
    agustos: "08",
    eylul: "09",
    ekim: "10",
    kasim: "11",
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

function diffCalendarDays(startIso: string, endIso: string) {
  if (!startIso || !endIso) {
    return 0;
  }

  const start = new Date(`${startIso}T00:00:00Z`);
  const end = new Date(`${endIso}T00:00:00Z`);
  if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) {
    return 0;
  }

  return Math.max(0, Math.round((end.valueOf() - start.valueOf()) / 86_400_000));
}

function buildTableValueMap(table: MarkdownTable | null) {
  const map = new Map<string, string>();
  if (!table) {
    return map;
  }

  for (const row of table.rows) {
    const label = cleanText(row[0] || "");
    const value = cleanText(row[1] || "");
    if (label && value && !map.has(normalizeForSearch(label))) {
      map.set(normalizeForSearch(label), value);
    }
  }

  return map;
}

function extractBoldLabelPairs(line: string) {
  const items: ReportMetaItem[] = [];
  const source = (line || "").replace(/^>\s*/, "");
  const pattern = /\*\*(.+?):\*\*\s*([^|]+?)(?=(?:\s*\|\s*\*\*.+?:\*\*)|$)/g;

  let match = pattern.exec(source);
  while (match) {
    const label = cleanText(match[1] || "");
    const value = cleanText(match[2] || "");
    if (label && value) {
      items.push({ label, value });
    }
    match = pattern.exec(source);
  }

  return items;
}

function collectOrderedItemsAnywhere(lines: string[]) {
  return lines
    .map(line => cleanText(line || ""))
    .filter(line => /^\d+\.\s+/.test(line))
    .map(line => cleanText(line.replace(/^\d+\.\s+/, "")));
}

function collectBulletItemsAnywhere(lines: string[]) {
  return lines
    .map(line => cleanText(line || ""))
    .filter(line => /^-\s+/.test(line))
    .map(line => cleanText(line.replace(/^-\s+/, "")));
}

function dedupeItems(items: string[]) {
  return Array.from(new Set(items.map(item => cleanText(item)).filter(Boolean)));
}

function createNote(title: string, lines: string[]) {
  const items = dedupeItems(lines);
  if (!items.length) {
    return null;
  }

  return {
    title,
    lines: items,
  } satisfies StrategyNote;
}

function buildRowSummary(table: MarkdownTable, row: string[]) {
  return table.headers
    .map((header, index) => `${header}: ${row[index] || "-"}`)
    .join(" | ");
}

function tableToRowSummaries(table: MarkdownTable | null, limit = 6) {
  if (!table) {
    return [];
  }

  return table.rows.slice(0, limit).map(row => buildRowSummary(table, row));
}

function parseQuoteBlocks(lines: string[]) {
  const blocks: string[][] = [];
  let index = 0;

  while (index < lines.length) {
    if (!(lines[index] || "").trim().startsWith(">")) {
      index += 1;
      continue;
    }

    const block = readQuoteBlock(lines, index);
    if (block.items.length) {
      blocks.push(block.items);
    }
    index = block.nextIndex;
  }

  return blocks;
}

function inferNewsBucket(item: string): NewsBucket["key"] {
  const normalized = normalizeForSearch(item);

  if (
    item.includes("✅") ||
    item.includes("🚨") ||
    item.includes("🏆") ||
    normalized.includes("bullish") ||
    normalized.includes("pozitif") ||
    normalized.includes("squeeze") ||
    normalized.includes("firsat") ||
    normalized.includes("rekor") ||
    normalized.includes("onay") ||
    normalized.includes("beat") ||
    normalized.includes("buyback")
  ) {
    return "positive";
  }

  if (
    item.includes("🔴") ||
    normalized.includes("negatif") ||
    normalized.includes("bearish") ||
    normalized.includes("istifa") ||
    normalized.includes("asiri degerli") ||
    normalized.includes("layoff") ||
    normalized.includes("rekabet")
  ) {
    return "negative";
  }

  if (
    item.includes("⚠️") ||
    normalized.includes("risk") ||
    normalized.includes("uyari") ||
    normalized.includes("volatil") ||
    normalized.includes("bmo") ||
    normalized.includes("amc") ||
    normalized.includes("fomc") ||
    normalized.includes("cpi") ||
    normalized.includes("iv ")
  ) {
    return "risk";
  }

  if (
    normalized.includes("notr") ||
    normalized.includes("range") ||
    normalized.includes("denge")
  ) {
    return "mixed";
  }

  return "other";
}

function buildNewsBucketsFromItems(items: string[]) {
  const buckets: NewsBucket[] = [
    { key: "positive", label: "Pozitif", items: [] },
    { key: "negative", label: "Negatif", items: [] },
    { key: "risk", label: "Risk", items: [] },
    { key: "mixed", label: "Karisik", items: [] },
    { key: "other", label: "Diger", items: [] },
  ];

  for (const item of dedupeItems(items)) {
    const bucket = buckets.find(entry => entry.key === inferNewsBucket(item));
    bucket?.items.push(item);
  }

  return buckets.filter(bucket => bucket.items.length > 0);
}

function findMetricValueByAliases(metrics: StrategyMetrics[], aliases: string[]) {
  const metricMap = new Map(
    metrics.map(metric => [normalizeForSearch(metric.label), metric.value])
  );

  for (const alias of aliases) {
    const normalizedAlias = normalizeForSearch(alias);
    if (metricMap.has(normalizedAlias)) {
      return metricMap.get(normalizedAlias) || "";
    }
  }

  for (const [label, value] of Array.from(metricMap.entries())) {
    if (aliases.some(alias => label.includes(normalizeForSearch(alias)))) {
      return value;
    }
  }

  return "";
}

function inferStrategyWeights(strategyTitle: string, actionLine: string) {
  const normalized = normalizeForSearch(`${strategyTitle} ${actionLine}`);

  if (
    normalized.includes("iron condor") ||
    normalized.includes("straddle") ||
    normalized.includes("strangle") ||
    normalized.includes("calendar")
  ) {
    return { callWeight: 50, putWeight: 50 };
  }

  if (
    normalized.includes("put spread") ||
    normalized.includes("long put") ||
    normalized.includes("short put")
  ) {
    return { callWeight: 20, putWeight: 80 };
  }

  if (
    normalized.includes("call spread") ||
    normalized.includes("long call") ||
    normalized.includes("call ")
  ) {
    return { callWeight: 80, putWeight: 20 };
  }

  return { callWeight: 50, putWeight: 50 };
}

function stripStrategyNarrative(value: string) {
  return cleanText(
    value
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/^.*?:\s*/, "")
      .replace(/\bFAVORI\b/gi, "")
      .replace(/\bALTERNATIF\b/gi, "")
      .replace(/\bASLA\b/gi, "")
  )
    .split(/\salternatif:/i)[0]
    .split(/\skacinilmasi gereken/i)[0]
    .split(/\s+-\s+/)[0]
    .split(/\s+\u2192\s+/)[0]
    .trim();
}

function findNarrativeLine(lines: string[], searchText: string) {
  return (
    collectNarrativeLines(lines).find(line =>
      normalizeForSearch(line).includes(normalizeForSearch(searchText))
    ) || ""
  );
}

function findStrategyRow(table: MarkdownTable | null, strategyTitle: string) {
  if (!table || !strategyTitle) {
    return null;
  }

  const normalizedTitle = normalizeForSearch(strategyTitle);
  return (
    table.rows.find(row => {
      const label = normalizeForSearch(row[0] || "");
      return label.includes(normalizedTitle) || normalizedTitle.includes(label);
    }) || null
  );
}

function rowToMetricItems(table: MarkdownTable | null, row: string[] | null, headers: string[]) {
  if (!table || !row) {
    return [];
  }

  return headers
    .map(header => {
      const columnIndex = table.headers.findIndex(
        candidate => normalizeForSearch(candidate) === normalizeForSearch(header)
      );
      if (columnIndex < 0) {
        return "";
      }

      return `${table.headers[columnIndex]}: ${row[columnIndex] || "-"}`;
    })
    .filter(Boolean);
}

function paramTableItems(table: MarkdownTable | null, labels: string[]) {
  if (!table) {
    return [];
  }

  return table.rows
    .filter(row =>
      labels.some(label =>
        normalizeForSearch(row[0] || "").includes(normalizeForSearch(label))
      )
    )
    .map(row => `${row[0] || "Deger"}: ${row[1] || row[2] || "-"}`);
}

function extractOptionExpiry(sectionTitle: string) {
  const match = sectionTitle.match(/\(([^)]+)\)/);
  return match ? cleanText(match[1] || "") : "";
}

function parseModernPositionSchedule(table: MarkdownTable | null, ticker: string) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => {
      const action = cleanText(row[0] || "");
      const date = [cleanText(row[1] || ""), cleanText(row[2] || "")]
        .filter(Boolean)
        .join(" ");
      const note = [cleanText(row[3] || ""), cleanText(row[4] || "")]
        .filter(Boolean)
        .join(" | ");

      if (!action || !date) {
        return null;
      }

      return {
        date,
        ticker,
        action,
        note: note || ticker,
      } satisfies TradeScheduleRow;
    })
    .filter((row): row is TradeScheduleRow => Boolean(row));
}

function normalizeActionText(value: string) {
  return normalizeForSearch(value)
    .replace(/-/g, " ")
    .trim();
}

function pickScheduleCheckpoint(rows: TradeScheduleRow[], type: "entry" | "exit") {
  const matchers =
    type === "entry"
      ? ["son giris", "pozisyon girisi", "erken giris", "giris"]
      : ["kar al", "kesin cikis", "mekanik exit", "cikis"];

  const match = rows.find(row =>
    matchers.some(token => normalizeActionText(row.action).includes(token))
  );

  return match ? match.date : "";
}

function collectWarningHighlights(lines: string[]) {
  return dedupeItems(
    collectNarrativeLines(lines).filter(line => {
      const normalized = normalizeForSearch(line);
      return (
        normalized.includes("uyari") ||
        normalized.includes("yasak") ||
        normalized.includes("onerilmez") ||
        normalized.includes("kacinilmasi gereken") ||
        normalized.includes("kritik") ||
        line.includes("🔴") ||
        line.includes("⚠️")
      );
    })
  );
}

function parseModernRiskEntries(lines: string[]) {
  const riskIndex = findLineIndexByText(lines, "ozel uyarilar");
  if (riskIndex < 0) {
    return [];
  }

  const riskSection = getSectionBody(lines, riskIndex);
  return parseQuoteBlocks(riskSection)
    .map(block => {
      const [title, ...rest] = block;
      if (!title) {
        return null;
      }

      const normalizedTitle = normalizeForSearch(title);
      const probability =
        normalizedTitle.includes("kritik") || title.includes("🔴🔴")
          ? "Yuksek"
          : title.includes("🟡")
            ? "Orta"
            : "Izle";
      const impact =
        rest.find(line => !line.startsWith("-")) ||
        rest[0] ||
        "Global earning report warning.";
      const mitigation = dedupeItems(
        rest.filter(line => line.startsWith("-")).map(line => line.replace(/^-\s*/, ""))
      ).join(" | ");

      return {
        risk: cleanText(title),
        probability,
        impact: cleanText(impact),
        mitigation: mitigation || cleanText(rest.slice(0, 2).join(" ")),
      } satisfies RiskEntry;
    })
    .filter((entry): entry is RiskEntry => Boolean(entry));
}

function extractTickerReferences(value: string, knownTickers: string[]) {
  const matches = knownTickers.filter(ticker =>
    new RegExp(`\\b${ticker}\\b`, "i").test(value)
  );
  return matches.join(", ");
}

function parseModernWeeklySchedule(lines: string[], knownTickers: string[]) {
  const scheduleIndex = findLineIndexByText(lines, "guncel haftalik takvim");
  if (scheduleIndex < 0) {
    return [];
  }

  const scheduleTable = parseFirstTable(getSectionBody(lines, scheduleIndex));
  if (!scheduleTable) {
    return [];
  }

  return scheduleTable.rows
    .map(row => {
      const date = cleanText(row[0] || "");
      const note = [cleanText(row[1] || ""), cleanText(row[2] || "")]
        .filter(Boolean)
        .join(" | ");

      if (!date || !note) {
        return null;
      }

      return {
        date,
        ticker: extractTickerReferences(note, knownTickers),
        action: cleanText(row[2] || row[1] || ""),
        note: [note, cleanText(row[3] || ""), cleanText(row[4] || "")]
          .filter(Boolean)
          .join(" | "),
      } satisfies TradeScheduleRow;
    })
    .filter((entry): entry is TradeScheduleRow => Boolean(entry));
}

function parseModernChecklist(lines: string[]) {
  const checklistIndex = findLineIndexByText(lines, "6.5 earningsplay uyum kontrol listesi");
  if (checklistIndex < 0) {
    return [];
  }

  const checklistSection = getSectionBody(lines, checklistIndex);
  const subsections = splitSections(checklistSection, /^####\s+/);

  return Array.from(subsections.entries()).flatMap(([title, sectionLines]) => {
    const table = parseFirstTable(sectionLines);
    if (!table) {
      return [];
    }

    return table.rows.map(row => {
      const summary = row
        .slice(1)
        .filter(Boolean)
        .map(cell => cleanText(cell))
        .join(" | ");
      return `${cleanText(title.replace(/^####\s*/, ""))}: ${summary}`;
    });
  });
}

function parseModernGoldenRules(lines: string[]) {
  const ruleIndex = findLineIndexByText(lines, "uyum kontrol listesi - genel");
  if (ruleIndex >= 0) {
    const table = parseFirstTable(getSectionBody(lines, ruleIndex));
    if (table) {
      return table.rows.map(
        row => `${row[0] || "Kural"} - ${row[2] || row[1] || "-"}`
      );
    }
  }

  const stopMatrixIndex = findLineIndexByText(lines, "stop-loss ve kar alma matrisi");
  if (stopMatrixIndex >= 0) {
    const table = parseFirstTable(getSectionBody(lines, stopMatrixIndex));
    if (table) {
      return table.rows.map(
        row => `${row[0] || "Ticker"} ${row[1] || "Strateji"} - ${row[3] || row[4] || "-"}`
      );
    }
  }

  return [];
}

function parseModernAllocations(lines: string[]) {
  const sizingIndex = findLineIndexByText(lines, "vix'e gore pozisyon buyuklugu tablosu");
  if (sizingIndex < 0) {
    return {
      allocations: [] as AllocationEntry[],
      positionSizing: [] as PositionSizingEntry[],
    };
  }

  const tables = parseAllTables(getSectionBody(lines, sizingIndex));
  const detailTable = tables[1] || null;
  if (!detailTable) {
    return {
      allocations: [] as AllocationEntry[],
      positionSizing: [] as PositionSizingEntry[],
    };
  }

  return {
    allocations: detailTable.rows
      .map(row => ({
        ticker: row[0] || "",
        capital: row[3] || row[1] || "",
        riskLevel: [row[1] || "", row[4] || ""].filter(Boolean).join(" | "),
      }))
      .filter(entry => entry.ticker),
    positionSizing: detailTable.rows
      .map(row => ({
        ticker: row[0] || "",
        capital: row[3] || "",
        contracts: row[2] || "",
      }))
      .filter(entry => entry.ticker),
  };
}

function parseModernGainDrivers(lines: string[]) {
  const decisionIndex = findLineIndexByText(lines, "bu haftanin 5 kritik karari");
  if (decisionIndex >= 0) {
    const decisionTable = parseFirstTable(getSectionBody(lines, decisionIndex));
    if (decisionTable) {
      return decisionTable.rows.map(row => ({
        factor: `#${row[0] || "-"}`,
        impact: row[1] || "",
        assessment: [row[2] || "", row[3] || "", row[4] || ""]
          .filter(Boolean)
          .join(" | "),
      }));
    }
  }

  const catalystIndex = findLineIndexByText(lines, "katalist gucu skoru ozeti");
  const catalystTable =
    catalystIndex >= 0 ? parseFirstTable(getSectionBody(lines, catalystIndex)) : null;

  return catalystTable
    ? catalystTable.rows.map(row => ({
        factor: row[0] || "",
        impact: row[4] || row[2] || "",
        assessment: [row[1] || "", row[3] || ""].filter(Boolean).join(" | "),
      }))
    : [];
}

function parseModernTimelineSteps(lines: string[]) {
  const scheduleIndex = findLineIndexByText(lines, "guncel haftalik takvim");
  if (scheduleIndex >= 0) {
    const table = parseFirstTable(getSectionBody(lines, scheduleIndex));
    if (table) {
      return table.rows.slice(0, 8).map(row => ({
        phase: cleanText(row[0] || ""),
        label: [cleanText(row[1] || ""), cleanText(row[2] || ""), cleanText(row[3] || "")]
          .filter(Boolean)
          .join(" | "),
      }));
    }
  }

  return [];
}

function parseModernReportMeta(lines: string[], subtitle: string) {
  const dividerIndex = findLineIndex(lines, /^---$/);
  const summaryIndex = findLineIndexByText(lines, "hizli erisim ozeti");
  const summaryTable =
    summaryIndex >= 0 ? parseFirstTable(getSectionBody(lines, summaryIndex)) : null;
  const summaryMap = buildTableValueMap(summaryTable);
  const topMetaLines = lines.slice(0, dividerIndex >= 0 ? dividerIndex : 12);
  const versionMeta = topMetaLines.flatMap(line => extractBoldLabelPairs(line));

  const meta: ReportMetaItem[] = [];
  const seen = new Set<string>();
  const pushMeta = (label: string, value: string) => {
    if (!label || !value) {
      return;
    }

    const key = `${normalizeForSearch(label)}::${normalizeForSearch(value)}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    meta.push({ label, value });
  };

  const reportDate =
    summaryMap.get("analiz tarihi") ||
    cleanText((subtitle.split("|")[1] || "").trim()) ||
    "-";
  const vixLabel = summaryMap.get("vix") || "-";

  pushMeta("Rapor Tarihi", reportDate);
  pushMeta("VIX", vixLabel);

  for (const item of versionMeta) {
    pushMeta(item.label, item.value);
  }

  if (summaryTable) {
    for (const row of summaryTable.rows) {
      const rawLabel = cleanText(row[0] || "");
      const rawValue = cleanText(row[1] || "");
      if (!rawLabel || !rawValue) {
        continue;
      }

      if (normalizeForSearch(rawLabel) === "analiz tarihi") {
        continue;
      }

      if (normalizeForSearch(rawLabel) === "vix") {
        continue;
      }

      pushMeta(rawLabel, rawValue);
    }
  }

  const regime = summaryMap.get("piyasa rejimi") || "";
  const vixWindow = summaryMap.get("vix rejim uyumu") || "";
  const nextEvent = summaryMap.get("en yakin earnings") || "";
  const coreWindow = [regime && `Piyasa rejimi: ${regime}`, vixWindow, nextEvent]
    .filter(Boolean)
    .join(" | ");

  return {
    meta,
    reportDate,
    vixLabel,
    coreWindow,
    reportDateIso: parseTurkishDateLabelClient(reportDate),
  };
}

function parseModernPositionSection(
  lines: string[],
  reportDateIso: string,
  allocationMap: Map<string, AllocationEntry>
): ModernPositionParseResult | null {
  const rawHeading = (lines[0] || "").replace(/[\u2013\u2014]/g, "-");
  const match = rawHeading.match(
    /^###\s+3\.(\d+)\s+([A-Z]+)\s+-\s+(.+?)\s+-\s+(\d{1,2}\s+[A-Za-z]+(?:\s+\d{4}))\s+\((AMC|BMO)\)/i
  );

  if (!match) {
    return null;
  }

  const order = Number(match[1]);
  const ticker = cleanText(match[2] || "");
  const company = cleanText(match[3] || "").replace(/\s+\u2B50.*$/, "");
  const earningsDate = cleanText(match[4] || "");
  const earningsTime = cleanText(match[5] || "").toUpperCase();
  const earningsDateIso = parseTurkishDateLabelClient(earningsDate);
  const daysLeft = diffCalendarDays(reportDateIso, earningsDateIso);
  const allocation = allocationMap.get(ticker);

  const quoteMeta = lines
    .slice(1)
    .filter(line => (line || "").trim().startsWith(">"))
    .flatMap(line => extractBoldLabelPairs(line));
  const sections = splitSections(lines.slice(1), /^####\s+/);
  const entries = Array.from(sections.entries());

  const profileEntry = entries.find(([key]) =>
    normalizeForSearch(key).includes("sirket profili")
  );
  const newsEntry = entries.find(([key]) =>
    normalizeForSearch(key).includes("guncel haberler ozeti")
  );
  const catalystEntry = entries.find(([key]) =>
    normalizeForSearch(key).includes("katalist skoru ve strateji etkisi")
  );
  const optionEntry = entries.find(([key]) =>
    normalizeForSearch(key).includes("opsiyon zinciri ozeti")
  );
  const condorEntry = entries.find(([key]) =>
    normalizeForSearch(key).includes("iron condor onerisi")
  );
  const budgetEntry = entries.find(([key]) =>
    normalizeForSearch(key).includes("butce dostu stratejiler")
  );
  const premiumEntry = entries.find(([key]) =>
    normalizeForSearch(key).includes("premium stratejiler")
  );
  const riskEntry = entries.find(([key]) =>
    normalizeForSearch(key).includes("risk & greeks analizi")
  );
  const scheduleEntry = entries.find(([key]) =>
    normalizeForSearch(key).includes("giris-cikis takvimi")
  );

  const profileTable = parseFirstTable(profileEntry?.[1] || []);
  const metrics: StrategyMetrics[] = [
    ...tableToKeyValueRows(profileTable),
    ...quoteMeta.map(item => ({ label: item.label, value: item.value })),
  ];

  const catalystTable = parseFirstTable(catalystEntry?.[1] || []);
  const catalystNarrative = collectNarrativeLines(catalystEntry?.[1] || []);
  const catalystScoreMatch = catalystNarrative
    .join(" ")
    .match(/katalist skoru:\s*([0-9/]+)/i);
  const actionLine =
    catalystNarrative.find(line =>
      normalizeForSearch(line).includes("earningsplay aksiyon")
    ) || "";

  if (catalystScoreMatch?.[1]) {
    metrics.push({
      label: "Katalist Skoru",
      value: catalystScoreMatch[1],
    });
  }

  if (actionLine) {
    metrics.push({
      label: "EarningsPlay Aksiyon",
      value: stripStrategyNarrative(actionLine) || cleanText(actionLine),
    });
  }

  const newsLines = newsEntry?.[1] || [];
  const orderedNews = collectOrderedItemsAnywhere(newsLines);
  const newsNarrative = collectNarrativeLines(newsLines);
  const news = buildNewsBucketsFromItems(
    orderedNews.length ? orderedNews : newsNarrative.slice(0, 6)
  );

  const budgetLines = budgetEntry?.[1] || [];
  const premiumLines = premiumEntry?.[1] || [];
  const condorLines = condorEntry?.[1] || [];
  const riskLines = riskEntry?.[1] || [];
  const scheduleLines = scheduleEntry?.[1] || [];

  const bestPremiumLine = findNarrativeLine(premiumLines, "en iyi premium strateji");
  const bestValueLine = findNarrativeLine(budgetLines, "en iyi deger");
  const bestBalancedLine = findNarrativeLine(budgetLines, "en iyi dengeli strateji");
  const championLine = findNarrativeLine(budgetLines, "haftanin sampiyonu");
  const alternativeLine = findNarrativeLine(premiumLines, "alternatif");
  const avoidLine =
    findNarrativeLine(premiumLines, "kacinilmasi gereken") ||
    findNarrativeLine(premiumLines, "kacin");

  const strategyTitle = stripStrategyNarrative(
    bestPremiumLine || bestBalancedLine || bestValueLine || championLine || actionLine
  ) || "Strategy";
  const weights = inferStrategyWeights(strategyTitle, actionLine);

  const premiumTable = parseFirstTable(premiumLines);
  const budgetTable = parseFirstTable(budgetLines);
  const condorTable = parseFirstTable(condorLines);
  const premiumRow = findStrategyRow(premiumTable, strategyTitle);
  const budgetRow = findStrategyRow(budgetTable, strategyTitle);
  const scheduleTable = parseFirstTable(scheduleLines);
  const scheduleRows = parseModernPositionSchedule(scheduleTable, ticker);
  const expiryLabel = extractOptionExpiry(optionEntry?.[0] || "");

  const warnings = dedupeItems([
    ...collectWarningHighlights(riskLines),
    ...collectWarningHighlights(condorLines),
    ...collectBulletItemsAnywhere(riskLines),
    ...collectBulletItemsAnywhere(scheduleLines),
  ]).slice(0, 8);

  const riskTables = parseAllTables(riskLines);
  const scenariosTable = riskTables[0] || null;
  const greeksTable = riskTables[1] || null;
  const scenarios = scenariosTable
    ? scenariosTable.rows.map(row => ({
        scenario: row[0] || "",
        ivChange: row[1] || "",
        stockMove: row[2] || "",
        pnl: row[3] || "",
      }))
    : [];
  const greeks = greeksTable
    ? greeksTable.rows.map(row => ({
        greek: row[0] || "",
        value: row[1] || "",
        description: [row[2] || "", row[3] || "", row[4] || ""]
          .filter(Boolean)
          .join(" | "),
      }))
    : [];

  const notes = [
    createNote("Haber ozeti", newsNarrative.filter(line => !/^\d+\./.test(line)).slice(0, 6)),
    createNote("Katalist matrisi", tableToRowSummaries(catalystTable, 6)),
    createNote("Iron Condor setup", [
      ...paramTableItems(condorTable, [
        "Wing Width",
        "Short Call Strike",
        "Short Put Strike",
        "Tahmini Kredi",
        "Max Risk",
      ]),
      findNarrativeLine(condorLines, "onerisi"),
    ]),
    createNote("Butce stratejileri", [bestValueLine, bestBalancedLine, championLine]),
    createNote("Premium stratejiler", [bestPremiumLine, alternativeLine, avoidLine]),
  ].filter((note): note is StrategyNote => Boolean(note));

  const primaryItems = dedupeItems([
    ...rowToMetricItems(premiumTable, premiumRow, [
      "Maliyet",
      "Max Risk",
      "Max Reward",
      "Breakeven",
    ]),
    ...rowToMetricItems(budgetTable, budgetRow, [
      "Maliyet",
      "Max Kar",
      "Gerekli Hareket",
      "Risk",
    ]),
    ...paramTableItems(condorTable, [
      "Short Call Strike",
      "Short Put Strike",
      "Tahmini Kredi",
      "Breakeven",
    ]),
  ]).slice(0, 6);

  const executionItems = dedupeItems([
    alternativeLine,
    ...paramTableItems(condorTable, [
      "Kar Hedefi",
      "Kâr Hedefi",
      "Stop-Loss",
      "Pozisyon Buyuklugu",
      "Pozisyon Büyüklüğü",
      "Beta Duzeltmesi",
      "Beta Düzeltmesi",
    ]),
    ...warnings.slice(0, 3),
  ]).slice(0, 6);

  const price = parseNumber(findMetricValueByAliases(metrics, ["fiyat", "son fiyat"]));
  const ivRank = parsePercent(findMetricValueByAliases(metrics, ["iv rank"]));
  const expectedMove = parsePercent(
    findMetricValueByAliases(metrics, ["beklenen hareket", "expected move", "em"])
  );

  return {
    position: {
      order: Number.isFinite(order) ? order : 0,
      ticker,
      company,
      earningsLabel: `${earningsDate} ${earningsTime}`.trim(),
      earningsDate,
      earningsTime,
      daysLeft,
      strategyTitle,
      allocationCapital: allocation?.capital || "-",
      allocationRisk: allocation?.riskLevel || "-",
      metrics,
      news,
      blueprint: {
        rawLines: dedupeItems([
          actionLine,
          bestPremiumLine,
          bestValueLine,
          bestBalancedLine,
        ]),
        ratioText: `${weights.callWeight}% call / ${weights.putWeight}% put`,
        callWeight: weights.callWeight,
        putWeight: weights.putWeight,
        biasLine: actionLine || strategyTitle,
        callHeading:
          weights.callWeight > weights.putWeight
            ? "Bullish setup"
            : weights.putWeight > weights.callWeight
              ? "Bearish setup"
              : "Primary setup",
        callItems: primaryItems.length ? primaryItems : [strategyTitle],
        putHeading: "Execution / risk",
        putItems: executionItems.length ? executionItems : warnings.slice(0, 4),
        expiryLines: expiryLabel ? [expiryLabel] : [],
        entry: pickScheduleCheckpoint(scheduleRows, "entry"),
        exit: pickScheduleCheckpoint(scheduleRows, "exit"),
      },
      greeks,
      scenarios,
      warnings,
      notes,
      price,
      ivRank,
      expectedMove,
    },
    scheduleRows,
  };
}

function parseCprPositionSection(
  lines: string[],
  startIdx: number,
  context: {
    reportDateIso: string;
    reportYear: string;
    allocationMap: Map<string, AllocationEntry>;
    calendarMap: Map<string, { company: string; earningsDate: string; earningsTime: string }>;
    appendixMap: Map<
      string,
      {
        price: string;
        ivRank: string;
        volumeCpr: string;
        oiCpr: string;
        sentiment: string;
        strategy: string;
        fomcRisk: string;
        budgetMin: string;
      }
    >;
  }
): (EarningsPosition & { schedule: Array<{ date: string; action: string; note: string }> }) | null {
  const rawHeading = cleanText((lines[startIdx] || "").replace(/[\u2013\u2014]/g, "-"));
  const headingMatch = rawHeading.match(
    /^#{3,4}\s+(?:(\d+(?:\.\d+)*)\s+)?([A-Z]{1,5})\s*-\s*\$?([~\d,.]+).*?CPR:\s*([~\d.]+)/i
  );
  if (!headingMatch) {
    return null;
  }

  const order = parseNumber(headingMatch[1] || "") || 0;
  const ticker = cleanText(headingMatch[2] || "");
  const headingPrice = cleanText(headingMatch[3] || "");
  const headingCpr = cleanText(headingMatch[4] || "");

  let endIdx = lines.length;
  for (let index = startIdx + 1; index < lines.length; index += 1) {
    const candidate = cleanText((lines[index] || "").replace(/[\u2013\u2014]/g, "-"));
    if (/^#{3,4}\s+(?:(\d+(?:\.\d+)*)\s+)?[A-Z]{1,5}\s*-\s*\$?[\d,.~]+.*CPR:/i.test(candidate)) {
      endIdx = index;
      break;
    }
    if (/^##\s+\d+\./.test(candidate)) {
      endIdx = index;
      break;
    }
  }

  const sectionLines = lines.slice(startIdx + 1, endIdx);
  const overviewTable = parseFirstTable(sectionLines);
  const overviewMap = buildTableValueMap(overviewTable);
  const appendix = context.appendixMap.get(ticker);
  const allocation = context.allocationMap.get(ticker);
  const calendarEntry = context.calendarMap.get(ticker);

  const metrics: StrategyMetrics[] = [];
  const seenMetricLabels = new Set<string>();
  const pushMetric = (label: string, value: string) => {
    const cleanLabel = cleanText(label);
    const cleanValue = cleanText(value);
    if (!cleanLabel || !cleanValue) {
      return;
    }

    const key = normalizeForSearch(cleanLabel);
    if (seenMetricLabels.has(key)) {
      return;
    }

    seenMetricLabels.add(key);
    metrics.push({ label: cleanLabel, value: cleanValue });
  };

  for (const row of overviewTable?.rows || []) {
    pushMetric(row[0] || "", row[1] || "");
  }

  pushMetric("Fiyat", findMetricValueByAliases(metrics, ["fiyat"]) || `$${headingPrice}`);
  pushMetric("Hacim CPR", findMetricValueByAliases(metrics, ["hacim cpr"]) || headingCpr);
  pushMetric("OI CPR", appendix?.oiCpr || "");
  pushMetric("IV Rank", appendix?.ivRank || "");
  pushMetric("Ana Strateji", appendix?.strategy || "");
  pushMetric("FOMC Riski", appendix?.fomcRisk || "");
  pushMetric("Butce Min.", appendix?.budgetMin || "");

  const rawEarningsValue =
    findMetricValueByAliases(metrics, ["earnings"]) || calendarEntry?.earningsDate || "";
  const earningsMatch = normalizeForSearch(rawEarningsValue).match(
    /(\d{1,2})\s+([a-z]+)(?:\s+(\d{4}))?(?:.*\b(amc|bmo)\b)?/i
  );
  const monthMap: Record<string, string> = {
    ocak: "Ocak",
    subat: "Subat",
    mart: "Mart",
    nisan: "Nisan",
    mayis: "Mayis",
    haziran: "Haziran",
    temmuz: "Temmuz",
    agustos: "Agustos",
    eylul: "Eylul",
    ekim: "Ekim",
    kasim: "Kasim",
    aralik: "Aralik",
  };
  const earningsDateFromMetric =
    earningsMatch && monthMap[earningsMatch[2]]
      ? `${Number(earningsMatch[1])} ${monthMap[earningsMatch[2]]} ${earningsMatch[3] || context.reportYear}`
      : "";
  const earningsTimeFromMetric = earningsMatch?.[4]?.toUpperCase() || "-";
  const earningsDate =
    earningsDateFromMetric || calendarEntry?.earningsDate || cleanText(rawEarningsValue) || "-";
  const earningsTime =
    earningsTimeFromMetric !== "-"
      ? earningsTimeFromMetric
      : calendarEntry?.earningsTime || "-";
  const earningsDateIso = parseTurkishDateLabelClient(earningsDate);
  const daysLeft = earningsDateIso ? diffCalendarDays(context.reportDateIso, earningsDateIso) : 999;
  const company =
    calendarEntry?.company ||
    {
      AMD: "Advanced Micro Devices",
      TSLA: "Tesla",
      NFLX: "Netflix",
      NVDA: "NVIDIA",
      META: "Meta Platforms",
      GOOGL: "Alphabet",
      AAPL: "Apple",
      AMZN: "Amazon",
      MSFT: "Microsoft",
      JPM: "JPMorgan Chase",
      BAC: "Bank of America",
      GS: "Goldman Sachs",
      WFC: "Wells Fargo",
      C: "Citigroup",
      MS: "Morgan Stanley",
      BLK: "BlackRock",
      UNH: "UnitedHealth Group",
      JNJ: "Johnson & Johnson",
      PFE: "Pfizer",
      ABT: "Abbott Laboratories",
      TMO: "Thermo Fisher Scientific",
      MRK: "Merck & Co.",
      XOM: "ExxonMobil",
      CVX: "Chevron",
      MA: "Mastercard",
      V: "Visa",
      DIS: "Walt Disney",
      BA: "Boeing",
      NKE: "Nike",
      HD: "Home Depot",
      INTC: "Intel",
    }[ticker] ||
    ticker;

  const strategyLineIndex = sectionLines.findIndex(line =>
    /(?:^####\s+Ana Strateji:|^####\s+Strateji\s*1:|^\*\*Strateji\s*1:)/i.test(
      cleanText(line)
    )
  );
  const primaryStrategyLine =
    strategyLineIndex >= 0 ? cleanText(sectionLines[strategyLineIndex] || "") : "";
  const strategyTitle =
    cleanText(
      primaryStrategyLine
        .replace(/^####\s*/i, "")
        .replace(/^\*\*/i, "")
        .replace(/\*\*$/i, "")
        .replace(/^Ana Strateji:\s*/i, "")
        .replace(/^Strateji\s*1:\s*/i, "")
        .replace(/\s+\(Ana\)\s*/i, "")
        .replace(/\s+⭐.*$/, "")
    ) ||
    appendix?.strategy ||
    "Strategy";

  const primaryStrategyTable =
    strategyLineIndex >= 0 ? parseFirstTable(sectionLines.slice(strategyLineIndex + 1)) : null;
  const alternativeIndex = sectionLines.findIndex((line, index) => {
    if (index <= strategyLineIndex) {
      return false;
    }

    return /alternatif|long spread alternatifi|^####\s+Strateji\s*2:|^\*\*Strateji\s*2:/i.test(
      normalizeForSearch(line)
    );
  });
  const alternativeTable =
    alternativeIndex >= 0 ? parseFirstTable(sectionLines.slice(alternativeIndex + 1)) : null;
  const ratioIndex = findLineIndexByText(sectionLines, "cpr bazli call/put orani");
  const ratioTable = ratioIndex >= 0 ? parseFirstTable(sectionLines.slice(ratioIndex + 1)) : null;
  const budgetIndex = findLineIndexByText(sectionLines, "butce dostu");
  const budgetTable = budgetIndex >= 0 ? parseFirstTable(sectionLines.slice(budgetIndex + 1)) : null;
  const scheduleIndex =
    findLineIndexByText(sectionLines, "giris-cikis takvimi") >= 0
      ? findLineIndexByText(sectionLines, "giris-cikis takvimi")
      : findLineIndexByText(sectionLines, "giriş-çıkış takvimi");
  const scheduleTable =
    scheduleIndex >= 0 ? parseFirstTable(sectionLines.slice(scheduleIndex + 1)) : null;
  const scenarioTable =
    parseAllTables(sectionLines).find(table =>
      table.headers.some(header => normalizeForSearch(header).includes("senaryo"))
    ) || null;

  for (const row of primaryStrategyTable?.rows || []) {
    pushMetric(row[0] || "", row[1] || "");
  }
  if (!findMetricValueByAliases(metrics, ["iv rank"]) && appendix?.ivRank) {
    pushMetric("IV Rank", appendix.ivRank);
  }

  const rawNarrativeLines = sectionLines
    .map(line => cleanText((line || "").replace(/^>\s*/, "")))
    .filter(
      line =>
        line &&
        !line.startsWith("|") &&
        !/^####\s+/i.test(line) &&
        !/^###\s+/i.test(line) &&
        line !== "---"
    );
  const overviewCommentary = (overviewTable?.rows || [])
    .map(row => cleanText(row[2] || ""))
    .filter(Boolean);
  const quoteAlerts = parseQuoteBlocks(sectionLines).flatMap(block => block);
  const warnings = dedupeItems([
    ...quoteAlerts,
    ...rawNarrativeLines.filter(line => /uyari|risk|dikkat|fomc|onemli|önemli|yarim pozisyon|kucult/i.test(normalizeForSearch(line))),
    ...overviewCommentary.filter(line => /risk|fomc|dikkat|uyari|yarim/i.test(normalizeForSearch(line))),
  ]).slice(0, 8);

  const ratioRow = ratioTable?.rows[0] || null;
  let callWeight = parsePercent(cleanText(ratioRow?.[0] || ""));
  let putWeight = parsePercent(cleanText(ratioRow?.[1] || ""));
  if (callWeight === null || putWeight === null) {
    const ratioHint = rawNarrativeLines.find(line => /%\d+.*call.*%\d+.*put/i.test(line)) || "";
    const parsedWeights = parseWeights(ratioHint);
    callWeight = parsedWeights.callWeight;
    putWeight = parsedWeights.putWeight;
  }
  if (callWeight === null || putWeight === null) {
    const inferred = inferStrategyWeights(strategyTitle, strategyTitle);
    callWeight = inferred.callWeight;
    putWeight = inferred.putWeight;
  }
  const ratioText =
    callWeight !== null && putWeight !== null
      ? `${callWeight}% call / ${putWeight}% put`
      : "50% call / 50% put";

  const detailedSchedule =
    (scheduleTable?.rows || [])
      .map(row => {
        const date = cleanText(row[0] || "");
        const action = cleanText(row[1] || "");
        const note = cleanText(row[2] || row[1] || strategyTitle);
        if (!date || !action) {
          return null;
        }

        return {
          date,
          action,
          note,
        };
      })
      .filter(
        (
          row
        ): row is {
          date: string;
          action: string;
          note: string;
        } => Boolean(row)
      ) || [];

  const entryWindow = findMetricValueByAliases(metrics, ["entry penceresi"]);
  const entryCheckpoint =
    detailedSchedule.find(item =>
      /entry|giris|pozisyon.*ac/i.test(normalizeForSearch(item.action))
    )?.date || entryWindow;
  const exitCheckpoint =
    detailedSchedule.find(item =>
      /cikis|kapat|kar al|zamanla/i.test(normalizeForSearch(item.action))
    )?.date || "";

  const primaryItems = dedupeItems([
    ...paramTableItems(primaryStrategyTable, [
      "Sell Call",
      "Short Call",
      "Buy Call",
      "Long Call",
      "Sell Put",
      "Short Put",
      "Buy Put",
      "Long Put",
      "Wing Width",
      "Spread Width",
      "Tahmini Kredi",
      "Tahmini Maliyet",
      "Kredi",
      "Maliyet",
      "Max Risk",
      "Max Kar",
      "ROI",
      "Breakeven",
      "Breakeven'lar",
    ]),
    ...tableToRowSummaries(primaryStrategyTable, 4),
  ]).slice(0, 6);

  const executionItems = dedupeItems([
    ...paramTableItems(primaryStrategyTable, [
      "Kar Hedefi",
      "Stop-Loss",
      "Pozisyon Boyutu",
      "K.O. Olasiligi",
      "K.O. Olasılığı",
      "Max Risk",
    ]),
    ...detailedSchedule.map(item => `${item.date}: ${item.action}`),
    ...warnings.slice(0, 3),
  ]).slice(0, 6);

  const news = buildNewsBucketsFromItems(
    dedupeItems([
      ...overviewCommentary,
      ...rawNarrativeLines.filter(line => !/yasal uyari/i.test(normalizeForSearch(line))),
      strategyTitle,
    ])
  );

  const scenarios =
    scenarioTable?.rows.map(row => ({
      scenario: cleanText(row[0] || ""),
      ivChange: cleanText(row[1] || ""),
      stockMove: [cleanText(row[2] || ""), cleanText(row[3] || "")]
        .filter(Boolean)
        .join(" | "),
      pnl: cleanText(row[4] || row[3] || ""),
    })) || [];

  const notes = [
    createNote(
      "Snapshot",
      (overviewTable?.rows || []).map(row => `${cleanText(row[0] || "")}: ${cleanText(row[2] || row[1] || "")}`)
    ),
    createNote("Primary setup", tableToRowSummaries(primaryStrategyTable, 8)),
    createNote("Alternative setup", tableToRowSummaries(alternativeTable, 6)),
    createNote(
      "Budget ladder",
      (budgetTable?.rows || []).map(
        row =>
          `${cleanText(row[0] || "")}: ${cleanText(row[1] || "")} | ${cleanText(row[2] || "")} | ${cleanText(row[3] || "")}`
      )
    ),
    createNote(
      "Execution plan",
      detailedSchedule.map(item =>
        `${item.date}: ${item.action}${item.note && item.note !== item.action ? ` | ${item.note}` : ""}`
      )
    ),
  ].filter((note): note is StrategyNote => Boolean(note));

  const price =
    parseNumber(findMetricValueByAliases(metrics, ["fiyat", "son fiyat"])) ||
    parseNumber(headingPrice);
  const ivRank =
    parsePercent(findMetricValueByAliases(metrics, ["iv rank"])) ||
    parsePercent(appendix?.ivRank || "");
  const expectedMove =
    parsePercent(findMetricValueByAliases(metrics, ["expected move", "beklenen hareket"])) ||
    parsePercent(
      rawNarrativeLines
        .join(" ")
        .match(/expected move[^0-9%]*%?([0-9]+(?:[.,]\d+)?)/i)?.[1] || ""
    );

  return {
    order: Number.isFinite(order) ? order : 0,
    ticker,
    company,
    earningsLabel: [earningsDate, earningsTime !== "-" ? earningsTime : ""]
      .filter(Boolean)
      .join(" "),
    earningsDate,
    earningsTime,
    daysLeft,
    strategyTitle,
    allocationCapital:
      allocation?.capital ||
      appendix?.budgetMin ||
      findMetricValueByAliases(metrics, ["pozisyon boyutu"]) ||
      "-",
    allocationRisk:
      findMetricValueByAliases(metrics, ["fomc riski"]) ||
      appendix?.fomcRisk ||
      findMetricValueByAliases(metrics, ["pozisyon boyutu"]) ||
      strategyTitle,
    metrics,
    news,
    blueprint: {
      rawLines: dedupeItems([strategyTitle, ratioText, ...overviewCommentary.slice(0, 3)]),
      ratioText,
      callWeight,
      putWeight,
      biasLine:
        ratioTable?.rows[0]?.[2] ||
        overviewCommentary[0] ||
        findMetricValueByAliases(metrics, ["teknik trend", "sentiment"]) ||
        strategyTitle,
      callHeading:
        callWeight !== null && putWeight !== null && callWeight > putWeight
          ? "Bullish setup"
          : callWeight !== null && putWeight !== null && putWeight > callWeight
            ? "Bearish setup"
            : "Primary setup",
      callItems: primaryItems.length ? primaryItems : [strategyTitle],
      putHeading: "Execution / risk",
      putItems: executionItems.length ? executionItems : warnings.slice(0, 4),
      expiryLines: [],
      entry: entryCheckpoint,
      exit: exitCheckpoint,
    },
    greeks: [],
    scenarios: scenarios.filter(row => row.scenario),
    warnings,
    notes,
    price,
    ivRank,
    expectedMove,
    schedule: detailedSchedule,
  };
}

function stripUpdateDaySuffix(value: string) {
  return cleanText(value).replace(/\s*\([^)]+\)\s*$/, "").trim();
}

function getSectionBodyBySearchText(lines: string[], searchText: string) {
  const sectionIndex = findLineIndexByText(lines, searchText);
  return sectionIndex >= 0 ? getSectionBody(lines, sectionIndex) : [];
}

function parseUpdateComparisonValue(table: MarkdownTable | null, label: string) {
  if (!table) {
    return "";
  }

  const needle = normalizeForSearch(label);
  const row = table.rows.find(item => normalizeForSearch(item[0] || "") === needle);
  if (!row) {
    return "";
  }

  return cleanText(row[2] || row[1] || "");
}

function tableToUpdateMetrics(table: MarkdownTable | null) {
  if (!table) {
    return [] as StrategyMetrics[];
  }

  return table.rows
    .map(row => ({
      label: cleanText(row[0] || ""),
      value: cleanText(row[2] || row[1] || ""),
    }))
    .filter(row => row.label && row.value);
}

function extractUpdateStrategyChoice(lines: string[]) {
  const labeledChoice = lines
    .flatMap(line => extractBoldLabelPairs(line))
    .find(item => normalizeForSearch(item.label) === "yeni strateji");

  const rawValue =
    labeledChoice?.value ||
    cleanText(
      (lines[0] || "")
        .replace(/^####\s*/i, "")
        .replace(/^Strateji Kar[ai]r[ıi]:\s*/i, "")
    );

  return cleanText(rawValue.split(/\s+\/\s+/)[0] || rawValue)
    .replace(/\b(FAV|ALT)\b/gi, "")
    .replace(/\(\s*degisiklik yok\s*\)/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractUpdateCatalystScore(lines: string[]) {
  const joined = lines.map(line => cleanText(line)).join(" ");
  const match = joined.match(/katalist[^0-9]*([0-9]+\/[0-9]+)/i);
  return match?.[1] || "";
}

function parseUpdatePositionSchedule(table: MarkdownTable | null, ticker: string) {
  if (!table) {
    return [] as TradeScheduleRow[];
  }

  return table.rows
    .map(row => {
      const date = [cleanText(row[0] || ""), cleanText(row[1] || "")]
        .filter(Boolean)
        .join(" ");
      const action = cleanText(row[2] || row[0] || "");
      const note = cleanText(row[3] || row[4] || ticker);

      if (!date || !action) {
        return null;
      }

      return {
        date,
        ticker,
        action,
        note,
      } satisfies TradeScheduleRow;
    })
    .filter((row): row is TradeScheduleRow => Boolean(row));
}

function parseUpdateScenarios(lines: string[]) {
  const scenarioTable = parseAllTables(lines).find(table => table.rows.some(row => row.length >= 4));
  if (!scenarioTable) {
    return [] as ScenarioRow[];
  }

  return scenarioTable.rows.map(row => ({
    scenario: cleanText(row[0] || ""),
    ivChange: cleanText(row[1] || ""),
    stockMove: cleanText(row[2] || ""),
    pnl: [cleanText(row[3] || ""), cleanText(row[4] || "")]
      .filter(Boolean)
      .join(" | "),
  }));
}

function buildUpdateExpiryMap(lines: string[]) {
  const table = parseFirstTable(getSectionBodyBySearchText(lines, "vade secimi tablosu"));
  return new Map(
    (table?.rows || [])
      .map(row => [cleanText(row[0] || ""), cleanText(row[1] || "")] as const)
      .filter(([ticker, expiry]) => ticker && expiry)
  );
}

function buildUpdateMeta(lines: string[]) {
  const dividerIndex = findLineIndex(lines, /^---$/);
  const metaLines = lines.slice(0, dividerIndex >= 0 ? dividerIndex : 16);
  const headingMeta = parseHeadingMeta(metaLines);
  const reportDateLabel = stripUpdateDaySuffix(findMetaValue(headingMeta, "Rapor Tarihi")) || "-";
  const reportDateIso = parseTurkishDateLabelClient(reportDateLabel);
  const vixTable = parseFirstTable(getSectionBodyBySearchText(lines, "vix rejim degisimi"));
  const vixLabel = parseUpdateComparisonValue(vixTable, "vix") || findMetaValue(headingMeta, "VIX") || "-";
  const regimeHeading = cleanText(
    ((lines[findLineIndexByText(lines, "vix rejim degisimi")] || "")
      .replace(/^###\s*/, "")
      .replace(/^VIX\s*/i, "VIX "))
  );
  const summaryBullets = collectBulletItemsAnywhere(
    getSectionBodyBySearchText(lines, "strateji degisiklik ozeti")
  );
  const meta: ReportMetaItem[] = [];
  const seen = new Set<string>();

  const pushMeta = (label: string, value: string) => {
    const cleanLabel = cleanText(label);
    const cleanValue = cleanText(value);
    if (!cleanLabel || !cleanValue) {
      return;
    }

    const key = `${normalizeForSearch(cleanLabel)}::${normalizeForSearch(cleanValue)}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    meta.push({ label: cleanLabel, value: cleanValue });
  };

  pushMeta("Rapor Tarihi", reportDateLabel);
  pushMeta("VIX", vixLabel);
  for (const item of headingMeta) {
    pushMeta(item.label, item.value);
  }

  return {
    meta,
    reportDate: reportDateLabel || "-",
    reportDateIso,
    vixLabel,
    coreWindow: [regimeHeading && `Piyasa modu: ${regimeHeading}`, vixLabel !== "-" && `VIX ${vixLabel}`, summaryBullets[0]]
      .filter(Boolean)
      .join(" | "),
    disclaimer: findMetaValue(headingMeta, "Yasal Uyari"),
  };
}

function parseUpdateAllocations(lines: string[]) {
  const sizingTable = parseFirstTable(getSectionBodyBySearchText(lines, "pozisyon buyuklugu karari"));

  return {
    allocations: (sizingTable?.rows || [])
      .map(row => ({
        ticker: cleanText(row[0] || ""),
        capital: cleanText(row[2] || row[1] || ""),
        riskLevel: cleanText(row[3] || row[2] || row[1] || ""),
      }))
      .filter(entry => entry.ticker),
    positionSizing: (sizingTable?.rows || [])
      .map(row => ({
        ticker: cleanText(row[0] || ""),
        capital: cleanText(row[2] || row[1] || ""),
        contracts: "-",
      }))
      .filter(entry => entry.ticker),
  };
}

function parseUpdateGainDrivers(lines: string[]) {
  const summaryTable = parseFirstTable(getSectionBodyBySearchText(lines, "executive summary"));
  if (!summaryTable) {
    return [] as GainDriver[];
  }

  return summaryTable.rows.map(row => ({
    factor: cleanText(row[0] || ""),
    impact: [cleanText(row[2] || row[1] || ""), cleanText(row[3] || "")]
      .filter(Boolean)
      .join(" | "),
    assessment: cleanText(row[4] || row[3] || row[2] || ""),
  }));
}

function parseUpdateTimelineSteps(lines: string[]) {
  const planTable = parseFirstTable(getSectionBodyBySearchText(lines, "gunun aksiyon plani"));
  if (!planTable) {
    return [] as TimelineStep[];
  }

  return planTable.rows.slice(0, 8).map(row => ({
    phase: cleanText(row[0] || ""),
    label: [cleanText(row[1] || ""), cleanText(row[2] || ""), cleanText(row[4] || "")]
      .filter(Boolean)
      .join(" | "),
  }));
}

function parseUpdateRiskEntries(lines: string[]) {
  const riskSection = getSectionBodyBySearchText(lines, "kritik uyarilar");
  if (!riskSection.length) {
    return [] as RiskEntry[];
  }

  return Array.from(splitSections(riskSection, /^###\s+/).entries())
    .map(([title, sectionLines]) => {
      const narrative = collectNarrativeLines(sectionLines);
      const table = parseFirstTable(sectionLines);
      const impact =
        narrative[0] ||
        tableToRowSummaries(table, 1)[0] ||
        "Risk basligi altinda ek not bulunuyor.";
      const mitigation = [
        ...narrative.slice(1, 3),
        ...tableToRowSummaries(table, 2),
      ]
        .filter(item => item && item !== impact)
        .slice(0, 3)
        .join(" | ");
      const normalizedTitle = normalizeForSearch(title);

      return {
        risk: cleanText(title.replace(/^###\s*/, "")),
        probability:
          normalizedTitle.includes("firtinasi") || normalizedTitle.includes("risk")
            ? "Yuksek"
            : normalizedTitle.includes("cift")
              ? "Orta"
              : "Izle",
        impact: cleanText(impact),
        mitigation: mitigation || cleanText(impact),
      } satisfies RiskEntry;
    })
    .filter(entry => entry.risk);
}

function parseUpdateGoldenRules(lines: string[]) {
  const rules = [
    ...collectOrderedItemsAnywhere(getSectionBodyBySearchText(lines, "vix dususunun etkileri")),
    ...collectOrderedItemsAnywhere(getSectionBodyBySearchText(lines, "sonuc")),
  ];

  const normalized = dedupeItems(
    rules.map(rule => cleanText(rule)).filter(Boolean)
  );

  return normalized.length
    ? normalized
    : [
        "VIX 15-25 bandinda sizing normal, fakat korku rejiminde secici kal.",
        "CPI ve earnings ayni gune yigildiginda pozisyon boyutunu dusur.",
        "%50 kar kurali ile mekanik cikis disiplinini koru.",
      ];
}

function parseUpdateChecklist(lines: string[]) {
  const sections = Array.from(splitSections(lines, /^###\s+\d+\.\s+[A-Z]+\s+\(/).entries());

  return sections.flatMap(([heading, sectionLines]) => {
    const tickerMatch = heading.match(/^###\s+\d+\.\s+([A-Z]+)/);
    const ticker = cleanText(tickerMatch?.[1] || "");
    const checklistSection = Array.from(splitSections(sectionLines, /^####\s+/).entries()).find(
      ([title]) => normalizeForSearch(title).includes("kontrol listesi")
    );
    const table = parseFirstTable(checklistSection?.[1] || []);

    return (table?.rows || []).map(row =>
      `${ticker}: ${cleanText(row[0] || "")} | ${cleanText(row[1] || "")} | ${cleanText(row[2] || "")}`
    );
  });
}

function parseUpdateGlobalTradeSchedule(lines: string[], knownTickers: string[]) {
  const planTable = parseFirstTable(getSectionBodyBySearchText(lines, "gunun aksiyon plani"));
  if (!planTable) {
    return [] as TradeScheduleRow[];
  }

  return planTable.rows
    .map(row => {
      const action = cleanText(row[1] || "");
      const tickerCell = cleanText(row[2] || "");
      const note = [tickerCell, cleanText(row[3] || ""), cleanText(row[4] || "")]
        .filter(Boolean)
        .join(" | ");
      if (!action) {
        return null;
      }

      return {
        date: cleanText(row[0] || ""),
        ticker: extractTickerReferences(tickerCell, knownTickers) || tickerCell,
        action,
        note: note || action,
      } satisfies TradeScheduleRow;
    })
    .filter((row): row is TradeScheduleRow => Boolean(row));
}

function parseUpdatePositionSection(
  lines: string[],
  reportDateIso: string,
  allocationMap: Map<string, AllocationEntry>,
  expiryMap: Map<string, string>
): ModernPositionParseResult | null {
  const rawHeading = (lines[0] || "").replace(/[\u2013\u2014]/g, "-");
  const match = rawHeading.match(
    /^###\s+(\d+)\.\s+([A-Z]+)\s+\(([^)]+)\)\s+-\s+(\d{1,2}\s+[A-Za-zÇĞİÖŞÜçğıöşü]+)\s+(AMC|BMO)(?:\s+-\s+.*)?$/i
  );
  if (!match) {
    return null;
  }

  const order = Number(match[1]);
  const ticker = cleanText(match[2] || "");
  const company = cleanText(match[3] || "");
  const earningsDate = cleanText(match[4] || "");
  const earningsTime = cleanText(match[5] || "").toUpperCase();
  const earningsDateIso = parseTurkishDateLabelClient(earningsDate);
  const daysLeft = diffCalendarDays(reportDateIso, earningsDateIso);
  const allocation = allocationMap.get(ticker);
  const sections = Array.from(splitSections(lines.slice(1), /^####\s+/).entries());

  const priceEntry = sections.find(([title]) =>
    normalizeForSearch(title).includes("fiyat ve teknik durum guncellemesi")
  );
  const strategyEntry = sections.find(([title]) =>
    normalizeForSearch(title).includes("strateji kar")
  );
  const checklistEntry = sections.find(([title]) =>
    normalizeForSearch(title).includes("kontrol listesi")
  );
  const scheduleEntry = sections.find(([title]) =>
    normalizeForSearch(title).includes("giris-cikis takvimi")
  );
  const scenarioEntry = sections.find(([title]) => {
    const normalized = normalizeForSearch(title);
    return normalized.includes("senaryo") || normalized.includes("iv crush");
  });
  const narrativeEntries = sections.filter(([title]) => {
    const normalized = normalizeForSearch(title);
    return (
      !normalized.includes("fiyat ve teknik durum guncellemesi") &&
      !normalized.includes("strateji kar") &&
      !normalized.includes("kontrol listesi") &&
      !normalized.includes("giris-cikis takvimi")
    );
  });

  const priceMetrics = tableToUpdateMetrics(parseFirstTable(priceEntry?.[1] || []));
  const strategyLines = strategyEntry?.[1] || [];
  const checklistLines = checklistEntry?.[1] || [];
  const scheduleLines = scheduleEntry?.[1] || [];
  const scheduleRows = parseUpdatePositionSchedule(parseFirstTable(scheduleLines), ticker);
  const strategyChoice = extractUpdateStrategyChoice([strategyEntry?.[0] || "", ...strategyLines]) || "Strategy";
  const strategyActionLine = strategyLines
    .flatMap(line => extractBoldLabelPairs(line))
    .find(item => normalizeForSearch(item.label) === "yeni strateji");
  const actionLine = strategyActionLine
    ? `Yeni Strateji: ${strategyActionLine.value}`
    : strategyChoice;
  const catalystScore = extractUpdateCatalystScore([
    ...(checklistLines || []),
    ...narrativeEntries.flatMap(([, section]) => section),
  ]);
  const weights = inferStrategyWeights(strategyChoice, actionLine);
  const strategyTables = parseAllTables(strategyLines);
  const primaryTable = strategyTables[0] || null;
  const altTable = strategyTables[1] || null;
  const warnings = dedupeItems([
    ...collectWarningHighlights(strategyLines),
    ...collectWarningHighlights(scheduleLines),
    ...collectNarrativeLines(strategyLines).filter(line => /uyari|risk|dikkat|krıtik|kritik/i.test(normalizeForSearch(line))),
    ...collectNarrativeLines(scheduleLines).filter(line => /uyari|risk|dikkat|kritik/i.test(normalizeForSearch(line))),
  ]).slice(0, 8);

  const metrics: StrategyMetrics[] = [
    ...priceMetrics,
    ...(catalystScore ? [{ label: "Katalist Skoru", value: catalystScore }] : []),
    { label: "EarningsPlay Aksiyon", value: strategyChoice },
  ];

  const newsItems = narrativeEntries.flatMap(([, section]) =>
    collectNarrativeLines(section).slice(0, 4)
  );
  const notes = [
    createNote("Analiz notlari", newsItems.slice(0, 6)),
    createNote("Strateji detayi", [
      strategyActionLine?.value || strategyChoice,
      ...tableToRowSummaries(primaryTable, 5),
      ...tableToRowSummaries(altTable, 3),
    ]),
    createNote("Kontrol listesi", tableToRowSummaries(parseFirstTable(checklistLines), 6)),
    createNote(
      "Senaryo matrisi",
      tableToRowSummaries(parseFirstTable(scenarioEntry?.[1] || []), 4)
    ),
  ].filter((note): note is StrategyNote => Boolean(note));

  return {
    position: {
      order: Number.isFinite(order) ? order : 0,
      ticker,
      company,
      earningsLabel: `${earningsDate} ${earningsTime}`.trim(),
      earningsDate,
      earningsTime,
      daysLeft,
      strategyTitle: strategyChoice,
      allocationCapital: allocation?.capital || "-",
      allocationRisk: allocation?.riskLevel || "-",
      metrics,
      news: buildNewsBucketsFromItems(newsItems.length ? newsItems : [strategyChoice]),
      blueprint: {
        rawLines: dedupeItems([actionLine, strategyChoice, ...collectNarrativeLines(strategyLines).slice(0, 3)]),
        ratioText: `${weights.callWeight}% call / ${weights.putWeight}% put`,
        callWeight: weights.callWeight,
        putWeight: weights.putWeight,
        biasLine: actionLine,
        callHeading:
          weights.callWeight > weights.putWeight
            ? "Bullish setup"
            : weights.putWeight > weights.callWeight
              ? "Bearish setup"
              : "Primary setup",
        callItems: dedupeItems([
          ...paramTableItems(primaryTable, [
            "Long Call Strike",
            "Short Call Strike",
            "Short Put",
            "Short Call",
            "Tahmini Maliyet",
            "Tahmini Kredi",
            "Max Kar",
            "Max Risk",
            "Breakeven",
            "K.O.",
          ]),
          ...tableToRowSummaries(primaryTable, 3),
        ]).slice(0, 6),
        putHeading: "Execution / risk",
        putItems: dedupeItems([
          ...tableToRowSummaries(parseFirstTable(scheduleLines), 3),
          ...warnings,
        ]).slice(0, 6),
        expiryLines: expiryMap.get(ticker) ? [expiryMap.get(ticker) || ""] : [],
        entry: pickScheduleCheckpoint(scheduleRows, "entry"),
        exit: pickScheduleCheckpoint(scheduleRows, "exit"),
      },
      greeks: [],
      scenarios: parseUpdateScenarios(scenarioEntry?.[1] || []),
      warnings,
      notes,
      price: parseNumber(findMetricValueByAliases(metrics, ["fiyat", "son fiyat"])),
      ivRank: parsePercent(findMetricValueByAliases(metrics, ["iv rank"])),
      expectedMove: parsePercent(
        findMetricValueByAliases(metrics, ["implied move", "beklenen hareket", "expected move"])
      ),
    },
    scheduleRows,
  };
}

function parseDailyUpdateEarningReportMarkdown(
  markdown: string,
  sourceFile = "earningreport/source.md"
): EarningReportSource {
  const lines = splitLines(markdown);
  const title = cleanText((lines[0] || "").replace(/^#\s*/, ""));
  const subtitle = cleanText((lines[1] || "").replace(/^##\s*/, ""));
  const metaState = buildUpdateMeta(lines);
  const { allocations, positionSizing } = parseUpdateAllocations(lines);
  const allocationMap = new Map(allocations.map(entry => [entry.ticker, entry]));
  const expiryMap = buildUpdateExpiryMap(lines);
  const positionSections = Array.from(splitSections(lines, /^###\s+\d+\.\s+[A-Z]+\s+\(/).entries());
  const parsedPositions = positionSections
    .map(([heading, sectionLines]) =>
      parseUpdatePositionSection(
        [heading, ...sectionLines],
        metaState.reportDateIso,
        allocationMap,
        expiryMap
      )
    )
    .filter((entry): entry is ModernPositionParseResult => Boolean(entry));
  const positions = parsedPositions.map(entry => entry.position);
  const knownTickers = positions.map(position => position.ticker);
  const tradeSchedule = Array.from(
    new Map(
      [
        ...parseUpdateGlobalTradeSchedule(lines, knownTickers),
        ...parsedPositions.flatMap(entry => entry.scheduleRows),
      ].map(row => [`${row.date}-${row.ticker}-${row.action}-${row.note}`, row] as const)
    ).values()
  );

  return {
    sourceFile,
    rawMarkdown: markdown,
    title,
    subtitle,
    meta: metaState.meta,
    reportDate: metaState.reportDate,
    vixLabel: metaState.vixLabel,
    coreWindow: metaState.coreWindow,
    timelineSteps: parseUpdateTimelineSteps(lines),
    gainDrivers: parseUpdateGainDrivers(lines),
    allocations,
    positions,
    tradeSchedule,
    risks: parseUpdateRiskEntries(lines),
    positionSizing,
    goldenRules: parseUpdateGoldenRules(lines),
    checklist: parseUpdateChecklist(lines),
    disclaimer: metaState.disclaimer,
  };
}

interface PlanTickerFallback {
  company: string;
  earningsDate: string;
  earningsTime: "AMC" | "BMO";
}

const PLAN_TICKER_FALLBACKS: Record<string, PlanTickerFallback> = {
  ORCL: {
    company: "Oracle",
    earningsDate: "10 Haziran 2026",
    earningsTime: "AMC",
  },
  CHWY: {
    company: "Chewy",
    earningsDate: "10 Haziran 2026",
    earningsTime: "BMO",
  },
  ADBE: {
    company: "Adobe",
    earningsDate: "11 Haziran 2026",
    earningsTime: "AMC",
  },
  FDX: {
    company: "FedEx",
    earningsDate: "23 Haziran 2026",
    earningsTime: "AMC",
  },
  MU: {
    company: "Micron",
    earningsDate: "24 Haziran 2026",
    earningsTime: "AMC",
  },
};

const QUALITY_SCORE_MAP: Record<string, string> = {
  yuksek: "5/5",
  "orta-yuksek": "4/5",
  orta: "3/5",
  "orta-dusuk": "2/5",
  dusuk: "1/5",
};

function parseCompactTurkishDateToken(value: string) {
  const normalized = normalizeForSearch(value);
  const match = normalized.match(
    /(\d{1,2})(ocak|subat|mart|nisan|mayis|haziran|temmuz|agustos|eylul|ekim|kasim|aralik)(\d{4})/
  );
  if (!match) {
    return "";
  }

  const day = String(Number(match[1])).padStart(2, "0");
  const monthMap: Record<string, string> = {
    ocak: "01",
    subat: "02",
    mart: "03",
    nisan: "04",
    mayis: "05",
    haziran: "06",
    temmuz: "07",
    agustos: "08",
    eylul: "09",
    ekim: "10",
    kasim: "11",
    aralik: "12",
  };
  const month = monthMap[match[2]] || "";
  const year = match[3];

  return month ? `${year}-${month}-${day}` : "";
}

function formatTurkishDateFromIso(isoDate: string) {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return "";
  }

  const monthNames = [
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
  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex >= monthNames.length) {
    return "";
  }

  return `${Number(match[3])} ${monthNames[monthIndex]} ${match[1]}`;
}

function parsePlanRatioWeights(value: string, strategyTitle: string) {
  const normalized = cleanText(value);
  const rangeMatch = Array.from(
    normalized.matchAll(/%(\d+(?:[.,]\d+)?)(?:\s*-\s*(\d+(?:[.,]\d+)?))?\s+(call|put|nakit|hedge)/gi)
  );

  const average = (left: string, right?: string) => {
    const start = Number(left.replace(",", "."));
    const end = right ? Number(right.replace(",", ".")) : start;
    return Number.isFinite(start) && Number.isFinite(end) ? Math.round((start + end) / 2) : null;
  };

  if (rangeMatch.length) {
    let callWeight: number | null = null;
    let putWeight: number | null = null;

    for (const match of rangeMatch) {
      const nextValue = average(match[1] || "", match[2] || undefined);
      if (nextValue === null) {
        continue;
      }

      const bucket = normalizeForSearch(match[3] || "");
      if (bucket === "call") {
        callWeight = nextValue;
      } else if (bucket === "put") {
        putWeight = nextValue;
      } else if (bucket === "nakit" || bucket === "hedge") {
        putWeight = putWeight ?? nextValue;
      }
    }

    if (callWeight !== null || putWeight !== null) {
      const safeCall = callWeight ?? Math.max(0, 100 - (putWeight ?? 50));
      const safePut = putWeight ?? Math.max(0, 100 - safeCall);
      return {
        callWeight: Math.min(100, Math.max(0, safeCall)),
        putWeight: Math.min(100, Math.max(0, safePut)),
      };
    }
  }

  return inferStrategyWeights(strategyTitle, value);
}

function buildPlanRankingMap(lines: string[]) {
  const rankingTable = parseFirstTable(
    getSectionBodyBySearchText(lines, "nihai hisse siralamasi ve uygulanabilir strateji")
  );

  return new Map(
    (rankingTable?.rows || [])
      .map(row => {
        const ticker = cleanText(row[1] || "");
        if (!ticker) {
          return null;
        }

        return [
          ticker,
          {
            rank: parseNumber(row[0] || "") || 0,
            oldStrategy: cleanText(row[2] || ""),
            newStrategy: cleanText(row[3] || ""),
            quality: cleanText(row[4] || ""),
            note: cleanText(row[5] || ""),
          },
        ] as const;
      })
      .filter(
        (
          entry
        ): entry is readonly [
          string,
          {
            rank: number;
            oldStrategy: string;
            newStrategy: string;
            quality: string;
            note: string;
          },
        ] => Boolean(entry)
      )
  );
}

function buildPlanTimingGuide(lines: string[]) {
  const table = parseFirstTable(getSectionBodyBySearchText(lines, "giris ve cikis kurallari"));
  return new Map(
    (table?.rows || [])
      .map(row => {
        const key = normalizeForSearch(row[0] || "");
        if (!key) {
          return null;
        }

        return [
          key,
          {
            label: cleanText(row[0] || ""),
            entry: cleanText(row[1] || ""),
            exit: cleanText(row[2] || ""),
            note: cleanText(row[3] || ""),
          },
        ] as const;
      })
      .filter(
        (
          entry
        ): entry is readonly [
          string,
          { label: string; entry: string; exit: string; note: string }
        ] => Boolean(entry)
      )
  );
}

function buildPlanSummaryTable(lines: string[]) {
  const table = parseFirstTable(getSectionBodyBySearchText(lines, "yonetici ozeti"));
  return table;
}

function buildPlanChecklistTable(lines: string[]) {
  return parseFirstTable(
    getSectionBodyBySearchText(lines, "earnings oncesi uygulanacak mekanik kontrol listesi")
  );
}

function buildPlanCorrectionsTable(lines: string[]) {
  return parseFirstTable(getSectionBodyBySearchText(lines, "mevcut raporun kritik duzeltmeleri"));
}

function derivePlanReportMeta(lines: string[]) {
  const dividerIndex = findLineIndex(lines, /^---$/);
  const metaLines = lines.slice(0, dividerIndex >= 0 ? dividerIndex : 16);
  const metaPairs = parseHeadingMeta(metaLines);
  const sourceFileLabel = findMetaValue(metaPairs, "Kaynak Dosya");
  const reportDateIso =
    parseCompactTurkishDateToken(sourceFileLabel) ||
    parseTurkishDateLabelClient(findMetaValue(metaPairs, "Rapor Tarihi"));
  const reportDateLabel =
    formatTurkishDateFromIso(reportDateIso) ||
    findMetaValue(metaPairs, "Rapor Tarihi") ||
    "-";
  const versionLabel = findMetaValue(metaPairs, "Rapor Versiyonu");
  const subtitle = versionLabel || cleanText((lines[1] || "").replace(/^##\s*/, ""));
  const disclaimer = findMetaValue(metaPairs, "Yasal Uyari");
  const summaryTable = buildPlanSummaryTable(lines);
  const coreWindow = tableToRowSummaries(summaryTable, 2).join(" | ");

  return {
    meta: metaPairs,
    reportDateIso,
    reportDateLabel,
    subtitle,
    disclaimer,
    coreWindow,
  };
}

function derivePlanStrategyTitle(
  rankingStrategy: string,
  setupValue: string,
  quality: string
) {
  if (rankingStrategy) {
    return rankingStrategy;
  }

  const firstClause = cleanText(setupValue.split(";")[0] || setupValue);
  if (firstClause) {
    return firstClause;
  }

  return quality || "Strategy";
}

function extractPlanMetricFromNarrative(lines: string[], pattern: RegExp) {
  const joined = collectNarrativeLines(lines).join(" ");
  return cleanText(joined.match(pattern)?.[1] || "");
}

function choosePlanTimingRule(
  ticker: string,
  daysLeft: number,
  earningsTime: string,
  timingGuide: Map<string, { label: string; entry: string; exit: string; note: string }>
) {
  if (daysLeft >= 14) {
    return timingGuide.get("14+ dte earnings") || null;
  }

  if (ticker === "CHWY" || earningsTime === "BMO") {
    return timingGuide.get("bmo") || null;
  }

  return timingGuide.get("amc") || null;
}

function parseStrategicPlanPositionSection(
  heading: string,
  sectionLines: string[],
  reportDateIso: string,
  rankingMap: Map<
    string,
    { rank: number; oldStrategy: string; newStrategy: string; quality: string; note: string }
  >,
  timingGuide: Map<string, { label: string; entry: string; exit: string; note: string }>
): ModernPositionParseResult | null {
  const match = heading.match(/^###\s+5\.(\d+)\s+([A-Z]+)\s+[—-]\s+(.+)$/);
  if (!match) {
    return null;
  }

  const sectionOrder = Number(match[1]);
  const ticker = cleanText(match[2] || "");
  const thesisTitle = cleanText(match[3] || "");
  const fallback = PLAN_TICKER_FALLBACKS[ticker];
  if (!fallback) {
    return null;
  }

  const table = parseFirstTable(sectionLines);
  const valueMap = buildTableValueMap(table);
  const ranking = rankingMap.get(ticker);
  const company = fallback.company;
  const earningsDate = fallback.earningsDate;
  const earningsTime = fallback.earningsTime;
  const earningsDateIso = parseTurkishDateLabelClient(earningsDate);
  const daysLeft = diffCalendarDays(reportDateIso, earningsDateIso);
  const strategyTitle = derivePlanStrategyTitle(
    ranking?.newStrategy || "",
    valueMap.get("en iyi yapi") || "",
    valueMap.get("ana gorus") || thesisTitle
  );
  const qualityLabel = ranking?.quality || "";
  const qualityScore =
    QUALITY_SCORE_MAP[normalizeForSearch(qualityLabel)] || "";
  const ratioValue = valueMap.get("call/put orani") || valueMap.get("call put orani") || "";
  const weights = parsePlanRatioWeights(ratioValue, strategyTitle);
  const introParagraphs = collectNarrativeLines(sectionLines).slice(0, 6);
  const resultsLine = introParagraphs.find(line =>
    normalizeForSearch(line).startsWith("sonuc")
  );
  const riskValue =
    valueMap.get("ana risk") ||
    valueMap.get("kacinilacak yapi") ||
    valueMap.get("giris sarti") ||
    "";
  const positionSize = valueMap.get("pozisyon boyutu") || "-";
  const timingRule = choosePlanTimingRule(ticker, daysLeft, earningsTime, timingGuide);

  const metrics: StrategyMetrics[] = [
    { label: "Ana Görüş", value: valueMap.get("ana gorus") || thesisTitle },
    ...(valueMap.get("pcr yorumu")
      ? [{ label: "PCR Yorumu", value: valueMap.get("pcr yorumu") || "" }]
      : []),
    ...(valueMap.get("en iyi yapi")
      ? [{ label: "En Iyi Yapi", value: valueMap.get("en iyi yapi") || "" }]
      : []),
    ...(ratioValue ? [{ label: "Call/Put Orani", value: ratioValue }] : []),
    ...(qualityScore ? [{ label: "Katalist Skoru", value: qualityScore }] : []),
    { label: "EarningsPlay Aksiyon", value: strategyTitle },
    ...(positionSize ? [{ label: "Pozisyon Boyutu", value: positionSize }] : []),
    ...(extractPlanMetricFromNarrative(sectionLines, /volume pcr[^0-9]*([0-9.,-]+)/i)
      ? [
          {
            label: "Volume PCR",
            value: extractPlanMetricFromNarrative(sectionLines, /volume pcr[^0-9]*([0-9.,-]+)/i),
          },
        ]
      : []),
    ...(extractPlanMetricFromNarrative(sectionLines, /oi pcr[^0-9]*([0-9.,-]+)/i)
      ? [
          {
            label: "OI PCR",
            value: extractPlanMetricFromNarrative(sectionLines, /oi pcr[^0-9]*([0-9.,-]+)/i),
          },
        ]
      : []),
    ...(extractPlanMetricFromNarrative(sectionLines, /iv rank[^0-9%]*%?([0-9.,]+)/i)
      ? [
          {
            label: "IV Rank",
            value: `%${extractPlanMetricFromNarrative(sectionLines, /iv rank[^0-9%]*%?([0-9.,]+)/i)}`,
          },
        ]
      : []),
  ];

  const warnings = dedupeItems(
    [
      riskValue,
      ranking?.note || "",
      ...introParagraphs.filter(line => /risk|kalabalik|crowded|uyari|pas gec|beta|pahali/i.test(normalizeForSearch(line))),
      ...(timingRule?.note ? [timingRule.note] : []),
    ].filter(Boolean)
  ).slice(0, 8);

  const newsItems = dedupeItems(
    [
      ...introParagraphs,
      valueMap.get("pcr yorumu") || "",
      valueMap.get("giris sarti") || "",
      resultsLine || "",
    ].filter(Boolean)
  );

  const scheduleRows: TradeScheduleRow[] = [
    {
      date: earningsDate,
      ticker,
      action: "Planli giris",
      note: timingRule?.entry || valueMap.get("giris sarti") || "Giris kosulu rapor notuna bagli.",
    },
    {
      date: earningsDate,
      ticker,
      action: "Planli cikis",
      note: timingRule?.exit || "Earnings sonrasi IV crush penceresinde parcali cikis.",
    },
  ];

  return {
    position: {
      order: ranking?.rank || sectionOrder,
      ticker,
      company,
      earningsLabel: `${earningsDate} ${earningsTime}`.trim(),
      earningsDate,
      earningsTime,
      daysLeft,
      strategyTitle,
      allocationCapital: positionSize,
      allocationRisk: qualityLabel || valueMap.get("ana gorus") || thesisTitle,
      metrics,
      news: buildNewsBucketsFromItems(newsItems.length ? newsItems : [strategyTitle]),
      blueprint: {
        rawLines: dedupeItems([
          strategyTitle,
          valueMap.get("en iyi yapi") || "",
          ratioValue,
          valueMap.get("giris sarti") || "",
        ]),
        ratioText: `${weights.callWeight}% call / ${weights.putWeight}% put`,
        callWeight: weights.callWeight,
        putWeight: weights.putWeight,
        biasLine: valueMap.get("ana gorus") || thesisTitle,
        callHeading: "Primary setup",
        callItems: dedupeItems([
          valueMap.get("en iyi yapi") || "",
          ratioValue,
          valueMap.get("giris sarti") || "",
        ]).slice(0, 6),
        putHeading: "Risk / sizing",
        putItems: dedupeItems([
          riskValue,
          positionSize,
          ranking?.note || "",
          timingRule?.note || "",
        ]).slice(0, 6),
        expiryLines: [],
        entry: timingRule?.entry || valueMap.get("giris sarti") || "",
        exit: timingRule?.exit || "",
      },
      greeks: [],
      scenarios: [],
      warnings,
      notes: [
        createNote("Tez özeti", [
          valueMap.get("ana gorus") || thesisTitle,
          valueMap.get("pcr yorumu") || "",
          valueMap.get("en iyi yapi") || "",
        ]),
        createNote("Plan notlari", [
          valueMap.get("giris sarti") || "",
          valueMap.get("pozisyon boyutu") || "",
          resultsLine || "",
        ]),
        createNote("Siralama notu", [
          ranking?.oldStrategy ? `Eski strateji: ${ranking.oldStrategy}` : "",
          ranking?.newStrategy ? `Yeni strateji: ${ranking.newStrategy}` : "",
          ranking?.note || "",
        ]),
      ].filter((note): note is StrategyNote => Boolean(note)),
      price: null,
      ivRank: parsePercent(findMetricValueByAliases(metrics, ["iv rank"])),
      expectedMove: null,
    },
    scheduleRows,
  };
}

function parseStrategicPlanEarningReportMarkdown(
  markdown: string,
  sourceFile = "earningreport/source.md"
): EarningReportSource {
  const lines = splitLines(markdown);
  const title = cleanText((lines[0] || "").replace(/^#\s*/, ""));
  const metaState = derivePlanReportMeta(lines);
  const rankingMap = buildPlanRankingMap(lines);
  const timingGuide = buildPlanTimingGuide(lines);
  const positionSections = Array.from(splitSections(lines, /^###\s+5\.\d+\s+[A-Z]+/).entries());
  const parsedPositions = positionSections
    .map(([heading, sectionLines]) =>
      parseStrategicPlanPositionSection(
        heading,
        sectionLines,
        metaState.reportDateIso,
        rankingMap,
        timingGuide
      )
    )
    .filter((entry): entry is ModernPositionParseResult => Boolean(entry));
  const positions = parsedPositions
    .map(entry => entry.position)
    .sort((left, right) => left.order - right.order);
  const knownTickers = positions.map(position => position.ticker);
  const summaryTable = buildPlanSummaryTable(lines);
  const checklistTable = buildPlanChecklistTable(lines);
  const correctionsTable = buildPlanCorrectionsTable(lines);

  return {
    sourceFile,
    rawMarkdown: markdown,
    title,
    subtitle: metaState.subtitle,
    meta: metaState.meta,
    reportDate: metaState.reportDateLabel,
    vixLabel: findMetaValue(metaState.meta, "VIX") || "-",
    coreWindow:
      metaState.coreWindow ||
      "PCR/POIR, IV crush ve defined-risk spread optimizasyonu odakta.",
    timelineSteps:
      Array.from(timingGuide.values()).map(step => ({
        phase: step.label,
        label: [step.entry, step.exit, step.note].filter(Boolean).join(" | "),
      })) || [],
    gainDrivers: (summaryTable?.rows || []).slice(0, 5).map(row => ({
      factor: cleanText(row[0] || ""),
      impact: cleanText(row[2] || row[1] || ""),
      assessment: cleanText(row[1] || row[2] || ""),
    })),
    allocations: positions.map(position => ({
      ticker: position.ticker,
      capital: findMetricValueByAliases(position.metrics, ["pozisyon boyutu"]) || position.allocationCapital,
      riskLevel: position.allocationRisk,
    })),
    positions,
    tradeSchedule: Array.from(
      new Map(
        [
          ...parsedPositions.flatMap(entry => entry.scheduleRows),
          ...positions.flatMap(position => [
            {
              date: position.earningsDate,
              ticker: position.ticker,
              action: position.earningsTime === "BMO" ? "BMO hazirligi" : "AMC hazirligi",
              note:
                choosePlanTimingRule(
                  position.ticker,
                  position.daysLeft,
                  position.earningsTime,
                  timingGuide
                )?.note || position.strategyTitle,
            },
          ]),
        ].map(row => [`${row.date}-${row.ticker}-${row.action}-${row.note}`, row] as const)
      ).values()
    ),
    risks: (correctionsTable?.rows || []).map(row => ({
      risk: cleanText(row[0] || ""),
      probability: /pozisyon|mu ic|vade/i.test(normalizeForSearch(row[0] || "")) ? "Yuksek" : "Orta",
      impact: cleanText(row[1] || ""),
      mitigation: cleanText(row[2] || ""),
    })),
    positionSizing: positions.map(position => ({
      ticker: position.ticker,
      capital: findMetricValueByAliases(position.metrics, ["pozisyon boyutu"]) || position.allocationCapital,
      contracts: "-",
    })),
    goldenRules: (checklistTable?.rows || []).map(
      row => `${cleanText(row[0] || "")}: ${cleanText(row[2] || row[1] || "")}`
    ),
    checklist: (checklistTable?.rows || []).map(
      row => `${cleanText(row[0] || "")} | ${cleanText(row[1] || "")} | ${cleanText(row[2] || "")}`
    ),
    disclaimer:
      metaState.disclaimer ||
      "Bu calisma yalnizca egitim ve arastirma amacli hazirlanmistir.",
  };
}

function parseModernEarningReportMarkdown(
  markdown: string,
  sourceFile = "earningreport/source.md"
): EarningReportSource {
  const lines = splitLines(markdown);
  const title = cleanText((lines[0] || "").replace(/^#\s*/, ""));
  const subtitle = cleanText((lines[1] || "").replace(/^##\s*/, ""));
  const reportMeta = parseModernReportMeta(lines, subtitle);
  const { allocations, positionSizing } = parseModernAllocations(lines);
  const allocationMap = new Map(allocations.map(entry => [entry.ticker, entry]));
  const positionSections = Array.from(splitSections(lines, /^###\s+3\.\d+\s+/).entries());
  const parsedPositions = positionSections
    .map(([heading, sectionLines]) =>
      parseModernPositionSection(
        [heading, ...sectionLines],
        reportMeta.reportDateIso,
        allocationMap
      )
    )
    .filter((entry): entry is ModernPositionParseResult => Boolean(entry));

  const positions = parsedPositions.map(entry => entry.position);
  const knownTickers = positions.map(position => position.ticker);
  const tradeSchedule = Array.from(
    new Map(
      [
        ...parseModernWeeklySchedule(lines, knownTickers),
        ...parsedPositions.flatMap(entry => entry.scheduleRows),
      ].map(row => [`${row.date}-${row.action}-${row.note}`, row] as const)
    ).values()
  );

  const disclaimerQuoteIndex = lines.findIndex(line =>
    (line || "").trim().startsWith("> **YASAL UYARI:**")
  );
  const disclaimer =
    disclaimerQuoteIndex >= 0
      ? readQuoteBlock(lines, disclaimerQuoteIndex).items.join(" ")
      : "";

  return {
    sourceFile,
    rawMarkdown: markdown,
    title,
    subtitle,
    meta: reportMeta.meta,
    reportDate: reportMeta.reportDate,
    vixLabel: reportMeta.vixLabel,
    coreWindow: reportMeta.coreWindow,
    timelineSteps: parseModernTimelineSteps(lines),
    gainDrivers: parseModernGainDrivers(lines),
    allocations,
    positions,
    tradeSchedule,
    risks: parseModernRiskEntries(lines),
    positionSizing,
    goldenRules: parseModernGoldenRules(lines),
    checklist: parseModernChecklist(lines),
    disclaimer,
  };
}

function parseCprEarningReportMarkdown(
  markdown: string,
  sourceFile = "earningreport/source.md"
): EarningReportSource {
  const lines = splitLines(markdown);
  const title = cleanText((lines[0] || "").replace(/^#\s*/, ""));
  const subtitle = cleanText((lines[1] || "").replace(/^##\s*/, ""));

  const metaLine = cleanText((lines[2] || "").replace(/^###\s*/, ""));
  const meta: Array<{ label: string; value: string }> = [];
  const metaParts = metaLine.split("|").map(p => p.trim());
  for (const part of metaParts) {
    const m = part.match(/(.+?):\s*(.+)/);
    if (m) {
      meta.push({ label: m[1].trim(), value: m[2].trim() });
    }
  }

  const reportDateItem = meta.find(m => m.label.includes("Tarihi"));
  const reportDate = reportDateItem ? reportDateItem.value : "-";
  const reportDateIso = parseTurkishDateLabelClient(reportDate);
  const reportYear =
    reportDate.match(/\b(20\d{2})\b/)?.[1] ||
    title.match(/\b(20\d{2})\b/)?.[1] ||
    "2026";

  let vixLabel = "-";
  for (const line of lines) {
    if (line.match(/^\|.*VIX.*\|/)) {
      const cells = line.split("|").map(c => c.trim()).filter(c => c);
      if (cells.length >= 2) {
        vixLabel = cells[1].replace(/\*\*/g, "");
        break;
      }
    }
  }

  const monthMap: Record<string, string> = {
    ocak: "Ocak",
    subat: "Subat",
    mart: "Mart",
    nisan: "Nisan",
    mayis: "Mayis",
    haziran: "Haziran",
    temmuz: "Temmuz",
    agustos: "Agustos",
    eylul: "Eylul",
    ekim: "Ekim",
    kasim: "Kasim",
    aralik: "Aralik",
  };
  const parseTickerEarnings = (value: string) => {
    const normalized = normalizeForSearch(value);
    const match = normalized.match(
      /(\d{1,2})\s+([a-z]+)(?:\s+(\d{4}))?(?:.*\b(amc|bmo)\b)?/i
    );
    if (!match || !monthMap[match[2]]) {
      return { earningsDate: "", earningsTime: "-" };
    }

    return {
      earningsDate: `${Number(match[1])} ${monthMap[match[2]]} ${match[3] || reportYear}`,
      earningsTime: match[4]?.toUpperCase() || "-",
    };
  };
  const calendarMap = new Map<
    string,
    { company: string; earningsDate: string; earningsTime: string }
  >();
  const calendarSection = getSectionBody(lines, findLineIndex(lines, /^###\s+3\.1\s+/));
  let currentCalendarDate = "";
  let currentCalendarTime = "-";
  let cursor = 0;
  while (cursor < calendarSection.length) {
    const currentLine = cleanText(calendarSection[cursor] || "");
    const headingMatch = normalizeForSearch(currentLine).match(
      /(\d{1,2})\s+([a-z]+)\s+(\d{4})(?:.*\b(amc|bmo)\b)?/i
    );
    if (headingMatch && monthMap[headingMatch[2]]) {
      currentCalendarDate = `${Number(headingMatch[1])} ${monthMap[headingMatch[2]]} ${headingMatch[3]}`;
      currentCalendarTime = headingMatch[4]?.toUpperCase() || "-";
      cursor += 1;
      continue;
    }

    if (currentLine.startsWith("|")) {
      const parsed = parseTable(calendarSection, cursor);
      if (parsed.table) {
        for (const row of parsed.table.rows) {
          const ticker = cleanText((row[0] || "").match(/[A-Z]{1,5}/)?.[0] || "");
          if (!ticker) {
            continue;
          }

          calendarMap.set(ticker, {
            company: cleanText(row[1] || ticker),
            earningsDate: currentCalendarDate,
            earningsTime: currentCalendarTime,
          });
        }
      }
      cursor = parsed.nextIndex;
      continue;
    }

    cursor += 1;
  }

  const topTenTable = parseFirstTable(
    getSectionBody(lines, findLineIndex(lines, /^###\s+3\.3\s+/))
  );
  for (const row of topTenTable?.rows || []) {
    const ticker = cleanText((row[1] || "").match(/[A-Z]{1,5}/)?.[0] || "");
    if (!ticker) {
      continue;
    }

    const parsed = parseTickerEarnings(row[3] || "");
    const existing = calendarMap.get(ticker);
    calendarMap.set(ticker, {
      company: cleanText(row[2] || existing?.company || ticker),
      earningsDate: parsed.earningsDate || existing?.earningsDate || "",
      earningsTime:
        parsed.earningsTime !== "-"
          ? parsed.earningsTime
          : existing?.earningsTime || "-",
    });
  }

  const appendixMap = new Map<
    string,
    {
      price: string;
      ivRank: string;
      volumeCpr: string;
      oiCpr: string;
      sentiment: string;
      strategy: string;
      fomcRisk: string;
      budgetMin: string;
    }
  >();
  const appendixTable = parseFirstTable(
    getSectionBody(lines, findLineIndex(lines, /^###\s+Ek A:/i))
  );
  for (const row of appendixTable?.rows || []) {
    const ticker = cleanText((row[0] || "").match(/[A-Z]{1,5}/)?.[0] || "");
    if (!ticker) {
      continue;
    }

    appendixMap.set(ticker, {
      price: cleanText(row[1] || ""),
      ivRank: cleanText(row[2] || ""),
      volumeCpr: cleanText(row[3] || ""),
      oiCpr: cleanText(row[4] || ""),
      sentiment: cleanText(row[5] || ""),
      strategy: cleanText(row[6] || ""),
      fomcRisk: cleanText(row[7] || ""),
      budgetMin: cleanText(row[8] || ""),
    });
  }

  const allocationSections = [
    /^###\s+11\.4\s+/,
    /^###\s+11\.3\s+/,
    /^###\s+11\.2\s+/,
    /^###\s+11\.1\s+/,
  ];
  const allocationsMap = new Map<string, AllocationEntry>();
  for (const matcher of allocationSections) {
    const table = parseFirstTable(getSectionBody(lines, findLineIndex(lines, matcher)));
    for (const row of table?.rows || []) {
      const ticker = cleanText((row[0] || "").match(/[A-Z]{1,5}/)?.[0] || "");
      if (!ticker || ticker === "TOPLAM" || ticker === "NAKIT" || allocationsMap.has(ticker)) {
        continue;
      }

      allocationsMap.set(ticker, {
        ticker,
        capital: cleanText(row[2] || row[3] || "-"),
        riskLevel: [cleanText(row[3] || ""), cleanText(row[1] || "")]
          .filter(Boolean)
          .join(" | "),
      });
    }
  }

  const normalizeScheduleAction = (value: string) => {
    const normalized = normalizeForSearch(value);
    if (normalized.includes("entry") || normalized.includes("giris")) {
      return "GIRIS";
    }
    if (normalized.includes("earnings")) {
      return "EARNINGS";
    }
    if (
      normalized.includes("cikis") ||
      normalized.includes("kar al") ||
      normalized.includes("kapat")
    ) {
      return "CIKIS";
    }
    if (
      normalized.includes("fomc") ||
      normalized.includes("kucult") ||
      normalized.includes("azalt") ||
      normalized.includes("durdur") ||
      normalized.includes("risk")
    ) {
      return "RISK";
    }
    return "IZLE";
  };

  const positions: EarningsPosition[] = [];
  const positionScheduleRows: TradeScheduleRow[] = [];
  const seenTickers = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const isPrimaryHeading =
      /^###\s+\d+\.\d+\s+[A-Z]{1,5}\s+.*\$.*CPR:/i.test(lines[i] || "");
    const isSubStockHeading = /^####\s+[A-Z]{1,5}\s+.*\$.*CPR:/i.test(lines[i] || "");
    if (!isPrimaryHeading && !isSubStockHeading) {
      continue;
    }

    const parsedPosition = parseCprPositionSection(lines, i, {
      reportDateIso,
      reportYear,
      allocationMap: allocationsMap,
      calendarMap,
      appendixMap,
    });
    if (!parsedPosition || seenTickers.has(parsedPosition.ticker)) {
      continue;
    }

    seenTickers.add(parsedPosition.ticker);
    positions.push(parsedPosition);
    for (const row of parsedPosition.schedule || []) {
      positionScheduleRows.push({
        date: row.date.replace(/\*\*/g, ""),
        ticker: parsedPosition.ticker,
        action: normalizeScheduleAction(row.action),
        note:
          row.note && row.note !== row.action
            ? `${row.action} | ${row.note}`
            : row.note || parsedPosition.strategyTitle,
      });
    }
  }

  const knownTickers = positions.map(position => position.ticker);
  const timelineSteps: Array<{ phase: string; label: string }> = [];
  const weeklyTradeSchedule: TradeScheduleRow[] = [];
  const weeklyPlanSection = getSectionBody(lines, findLineIndex(lines, /^###\s+12\.1\s+/));
  for (const [heading, sectionLines] of Array.from(
    splitSections(weeklyPlanSection, /^####\s+/).entries()
  )) {
    const weeklyTable = parseFirstTable(sectionLines);
    const tableRows = weeklyTable?.rows || [];
    const highlights = tableRows.slice(0, 2).map(row =>
      [cleanText(row[1] || ""), cleanText(row[2] || ""), cleanText(row[3] || "")]
        .filter(Boolean)
        .join(" | ")
    );
    timelineSteps.push({
      phase: cleanText(heading.replace(/^####\s*/, "")),
      label: highlights.join(" || "),
    });

    for (const row of tableRows) {
      const date = cleanText(row[1] || row[0] || "");
      const detail = cleanText(row[2] || row[1] || "");
      if (!date || !detail) {
        continue;
      }

      const note = [cleanText(row[0] || ""), cleanText(row[3] || ""), cleanText(row[4] || "")]
        .filter(Boolean)
        .join(" | ");
      weeklyTradeSchedule.push({
        date,
        ticker: extractTickerReferences(`${detail} ${note}`, knownTickers),
        action: normalizeScheduleAction(detail),
        note: note ? `${detail} | ${note}` : detail,
      });
    }
  }

  const gainDrivers: Array<{ factor: string; impact: string; assessment: string }> = [];
  const execIdx = lines.findIndex(l => l.match(/^##\s+1\.\s*Executive Summary/i));
  if (execIdx >= 0) {
    for (let i = execIdx; i < execIdx + 50 && i < lines.length; i++) {
      if (lines[i].match(/^\|.*Sıra.*\|/)) {
        for (let j = i + 2; j < i + 10 && j < lines.length; j++) {
          if (!lines[j].match(/^\|/)) break;
          const cells = lines[j].split("|").map(c => c.trim()).filter(c => c);
          if (cells.length >= 5 && !cells[0].includes("Sıra")) {
            gainDrivers.push({
              factor: cells[1].replace(/\*\*/g, ""),
              impact: cells[2],
              assessment: cells[3] + " | " + cells[4]
            });
          }
        }
        break;
      }
    }
  }

  const risks: Array<{ risk: string; probability: string; impact: string; mitigation: string }> = [];
  for (const line of lines) {
    if (line.match(/^>\s+\*\*FOMC KRİTİK UYARI:/)) {
      risks.push({
        risk: "FOMC Kritik Uyarı",
        probability: "Yüksek",
        impact: line.replace(/^>\s+\*\*FOMC KRİTİK UYARI:\*\*\s*/, ""),
        mitigation: "21-27 Temmuz arasında pozisyonları %50 azaltın"
      });
    }
  }

  let disclaimer = "";
  for (const line of lines) {
    if (line.match(/^>\s+\*\*YASAL UYARI:/)) {
      disclaimer = line.replace(/^>\s+/, "");
      break;
    }
  }

  const reductionSection = getSectionBody(lines, findLineIndex(lines, /^###\s+10\.2\s+/));
  const reductionTable = parseFirstTable(reductionSection);
  const reductionSchedule = (reductionTable?.rows || []).map(row => ({
    date: cleanText(row[0] || ""),
    ticker: "PORTFOY",
    action: cleanText(row[1] || ""),
    note: cleanText(row[2] || ""),
  }));

  const globalRiskTable = parseFirstTable(
    getSectionBody(lines, findLineIndex(lines, /^###\s+10\.6\s+/))
  );
  const matrixRisks = (globalRiskTable?.rows || []).map(row => ({
    risk: cleanText(row[0] || ""),
    probability: cleanText(row[1] || ""),
    impact: cleanText(row[2] || ""),
    mitigation: cleanText(row[3] || ""),
  }));

  const fomcRiskTable = parseFirstTable(
    getSectionBody(lines, findLineIndex(lines, /^###\s+10\.3\s+/))
  );
  const fomcRisks = (fomcRiskTable?.rows || []).map(row => ({
    risk: cleanText(row[0] || ""),
    probability: cleanText(row[2] || row[1] || ""),
    impact: cleanText(row[1] || ""),
    mitigation: cleanText(row[3] || ""),
  }));

  const goldenRuleTable = parseFirstTable(
    getSectionBody(lines, findLineIndex(lines, /^###\s+10\.5\s+/))
  );
  const goldenRules = (goldenRuleTable?.rows || []).map(
    row => `${cleanText(row[0] || "")}: ${cleanText(row[1] || "")}`
  );

  const checklistMatch = markdown.match(
    /###\s+12\.2[\s\S]*?```([\s\S]*?)```/i
  );
  const checklist = (checklistMatch?.[1] || "")
    .split(/\r?\n/)
    .map(line => cleanText(line.replace(/^\[[^\]]*\]\s*/, "")))
    .filter(Boolean);

  const positionSizingTable = parseFirstTable(
    getSectionBody(lines, findLineIndex(lines, /^###\s+11\.5\s+/))
  );
  const positionSizing: PositionSizingEntry[] = positions.map(position => ({
    ticker: position.ticker,
    capital:
      allocationsMap.get(position.ticker)?.capital ||
      cleanText(position.metrics.find(metric => /Pozisyon Boyutu/i.test(metric.label))?.value || "-"),
    contracts:
      cleanText(position.metrics.find(metric => /Pozisyon Boyutu/i.test(metric.label))?.value || "-") ||
      "-",
  }));
  const exampleRows = positionSizingTable?.rows || [];
  for (const row of exampleRows) {
    const maxPerTicker = cleanText(row[1] || "");
    const examples: Array<[string, number]> = [
      ["UNH", 2],
      ["BA", 3],
      ["XOM", 4],
    ];
    for (const [ticker, index] of examples) {
      const entry = positionSizing.find(item => item.ticker === ticker);
      if (entry && cleanText(row[index] || "")) {
        entry.contracts = `${cleanText(row[index] || "")} (max ${maxPerTicker})`;
      }
    }
  }

  const tradeSchedule = Array.from(
    new Map(
      [...weeklyTradeSchedule, ...positionScheduleRows, ...reductionSchedule].map(row => [
        `${row.date}-${row.ticker}-${row.action}-${row.note}`,
        row,
      ] as const)
    ).values()
  );
  const mainThemeLine = lines.find(line => normalizeForSearch(line).includes("ana tema:")) || "";

  return {
    sourceFile,
    rawMarkdown: markdown,
    title,
    subtitle,
    meta,
    reportDate,
    vixLabel,
    coreWindow:
      cleanText(mainThemeLine.replace(/^\*\*Ana Tema:\*\*\s*/i, "")) ||
      [`VIX ${vixLabel}`, subtitle, "FOMC 28-29 Temmuz"].filter(Boolean).join(" | "),
    timelineSteps,
    gainDrivers,
    allocations:
      positions.map(position => ({
        ticker: position.ticker,
        capital:
          allocationsMap.get(position.ticker)?.capital ||
          appendixMap.get(position.ticker)?.budgetMin ||
          "-",
        riskLevel:
          allocationsMap.get(position.ticker)?.riskLevel ||
          findMetricValueByAliases(position.metrics, ["fomc riski"]) ||
          position.strategyTitle,
      })) || [],
    positions,
    tradeSchedule,
    risks: [...risks, ...fomcRisks, ...matrixRisks],
    positionSizing,
    goldenRules,
    checklist,
    disclaimer
  };
}

function findStructuredMacroValue(
  report: StructuredEarningsStrategyReport,
  needle: string
) {
  const normalizedNeedle = normalizeForSearch(needle);
  return (
    report.macroRows.find(row =>
      normalizeForSearch(row.indicator).includes(normalizedNeedle)
    )?.level || ""
  );
}

function inferStructuredWeights(direction: string, setup: string) {
  const normalized = normalizeForSearch(`${direction} ${setup}`);

  if (
    normalized.includes("neutral") ||
    normalized.includes("agnostic") ||
    normalized.includes("dengeli") ||
    normalized.includes("straddle") ||
    normalized.includes("strangle") ||
    normalized.includes("iron condor") ||
    normalized.includes("calendar")
  ) {
    return { callWeight: 50, putWeight: 50 };
  }

  if (
    normalized.includes("bear") ||
    normalized.includes("ayi") ||
    normalized.includes("long put") ||
    normalized.includes("bear put") ||
    normalized.includes("bear call")
  ) {
    return { callWeight: 30, putWeight: 70 };
  }

  return { callWeight: 70, putWeight: 30 };
}

function splitStructuredList(value: string) {
  return cleanText(value)
    .split(/\s*\/\s*|,\s*/)
    .map(item => cleanText(item))
    .filter(Boolean);
}

function parseStructuredGreekMap(value: string) {
  const entries = new Map<string, string>();
  const matches = Array.from(
    value.matchAll(/([A-Za-z]+)\s*:\s*([+-]?\d+(?:[.,]\d+)?)/g)
  );

  for (const match of matches) {
    entries.set(normalizeForSearch(match[1] || ""), cleanText(match[2] || ""));
  }

  return entries;
}

function buildStructuredGreeks(value: string): GreekRow[] {
  const greekMap = parseStructuredGreekMap(value);

  return [
    { greek: "Delta", value: greekMap.get("delta") || "", description: "Directional exposure" },
    { greek: "Theta", value: greekMap.get("theta") || "", description: "Time decay" },
    { greek: "Vega", value: greekMap.get("vega") || "", description: "IV sensitivity" },
    { greek: "Gamma", value: greekMap.get("gamma") || "", description: "Convexity" },
  ].filter(row => row.value);
}

function inferStructuredRiskLabel(row: StructuredStrategyRow) {
  const normalized = normalizeForSearch(`${row.setup} ${row.direction} ${row.importance}`);

  if (
    normalized.includes("long call") ||
    normalized.includes("long put") ||
    normalized.includes("straddle") ||
    normalized.includes("strangle")
  ) {
    return "Yuksek";
  }

  if (
    normalized.includes("high") ||
    normalized.includes("ratio") ||
    normalized.includes("calendar")
  ) {
    return "Orta";
  }

  return "Dusuk";
}

function inferBudgetBandFromCost(value: string) {
  const numeric = parseNumber(value);
  if (numeric === null) {
    return "";
  }

  if (numeric <= 50) return "$10 - $50";
  if (numeric <= 200) return "$50 - $200";
  if (numeric <= 500) return "$200 - $500";
  return "$500 - $1,000";
}

function buildStructuredBudgetOptionMap(report: StructuredEarningsStrategyReport) {
  const optionsByTicker = new Map<string, StrategyMetrics[]>();
  const seen = new Set<string>();
  const strategyByTicker = new Map(report.strategies.map(row => [row.ticker, row] as const));

  const pushBudgetMetric = (
    ticker: string,
    budget: string,
    strategy: string,
    cost: string,
    maxReturn: string
  ) => {
    if (!ticker || !budget || !strategy) {
      return;
    }

    const key = `${ticker}::${budget}::${strategy}::${cost}::${maxReturn}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    const current = optionsByTicker.get(ticker) || [];
    current.push({
      label: budget,
      value: [strategy, cost, maxReturn].filter(Boolean).join(" | "),
    });
    optionsByTicker.set(ticker, current);
  };

  for (const row of report.strategies) {
    const derivedBudget = inferBudgetBandFromCost(row.budgetCost);
    if (derivedBudget) {
      pushBudgetMetric(
        row.ticker,
        derivedBudget,
        row.setup || row.strategyTitle,
        row.budgetCost,
        row.targetProfit
      );
    }
  }

  for (const bucket of report.budgetBuckets) {
    for (const item of bucket.items) {
      const fallbackStrategy = strategyByTicker.get(item.ticker);
      pushBudgetMetric(
        item.ticker,
        bucket.budgetLabel || bucket.label,
        item.title || fallbackStrategy?.setup || item.ticker,
        item.risk,
        item.target
      );
    }
  }

  return optionsByTicker;
}

function buildStructuredNotes(row: StructuredStrategyRow) {
  const notes: StrategyNote[] = [];

  if (row.structure) {
    notes.push({
      title: "Structure",
      lines: splitStructuredList(row.structure),
    });
  }

  const riskRewardLines = [
    row.budgetCost && `Base cost: ${row.budgetCost}`,
    row.credit && `Credit: ${row.credit}`,
    row.maxRisk && `Max risk: ${row.maxRisk}`,
    row.targetProfit && `Target: ${row.targetProfit}`,
  ].filter(Boolean) as string[];

  if (riskRewardLines.length > 0) {
    notes.push({
      title: "Risk / Reward",
      lines: riskRewardLines,
    });
  }

  const timingLines = [
    row.entryWindow && `Entry: ${row.entryWindow}`,
    row.exitWindow && `Exit: ${row.exitWindow}`,
  ].filter(Boolean) as string[];

  if (timingLines.length > 0) {
    notes.push({
      title: "Timing",
      lines: timingLines,
    });
  }

  if (row.note) {
    notes.push({
      title: "Desk Note",
      lines: [row.note],
    });
  }

  return notes;
}

function buildStructuredNews(row: StructuredStrategyRow): NewsBucket[] {
  if (!row.note) {
    return [];
  }

  const normalized = normalizeForSearch(row.direction || row.setup);
  const key: NewsBucket["key"] = normalized.includes("bear")
    ? "negative"
    : normalized.includes("bull")
      ? "positive"
      : "mixed";

  return [
    {
      key,
      label: "Desk view",
      items: [row.note],
    },
  ];
}

function buildStructuredBlueprint(row: StructuredStrategyRow): StrategyBlueprint {
  const weights = inferStructuredWeights(row.direction, row.setup || row.strategyTitle);
  const structureItems = splitStructuredList(row.structure);

  return {
    rawLines: [row.structure, row.note].filter(Boolean),
    ratioText: `Call ${weights.callWeight}% / Put ${weights.putWeight}%`,
    callWeight: weights.callWeight,
    putWeight: weights.putWeight,
    biasLine: row.direction || row.setup || row.strategyTitle,
    callHeading: "Structure",
    callItems: structureItems.length > 0 ? structureItems : [row.setup || row.strategyTitle],
    putHeading: "Execution",
    putItems: [
      row.entryWindow && `Entry ${row.entryWindow}`,
      row.exitWindow && `Exit ${row.exitWindow}`,
      row.budgetCost && `Base cost ${row.budgetCost}`,
      row.maxRisk && `Max risk ${row.maxRisk}`,
      row.targetProfit && `Target ${row.targetProfit}`,
    ].filter(Boolean) as string[],
    expiryLines: [
      row.earningsDate && `Earnings ${row.earningsDate}`,
      row.earningsTime && `${row.earningsTime} session`,
    ].filter(Boolean) as string[],
    entry: row.entryWindow,
    exit: row.exitWindow,
  };
}

function buildStructuredScenarios(row: StructuredStrategyRow): ScenarioRow[] {
  const normalized = normalizeForSearch(row.direction || row.setup);
  const upsideMove = normalized.includes("bear") ? "-4%" : "+4%";
  const downsideMove = normalized.includes("bear") ? "+3%" : "-3%";

  return [
    {
      scenario: "Base case",
      ivChange: "-10%",
      stockMove: "Contained",
      pnl: row.targetProfit || row.maxRisk || "-",
    },
    {
      scenario: normalized.includes("bear") ? "Downside follow-through" : "Upside follow-through",
      ivChange: "-6%",
      stockMove: upsideMove,
      pnl: row.targetProfit || "-",
    },
    {
      scenario: "Wrong-way move",
      ivChange: "-15%",
      stockMove: downsideMove,
      pnl: row.maxRisk ? `-${row.maxRisk}` : "-",
    },
  ];
}

function buildStructuredPositions(report: StructuredEarningsStrategyReport) {
  const reportDateIso = report.meta.reportDate;
  const budgetMetricMap = buildStructuredBudgetOptionMap(report);
  const fomcStatus = normalizeForSearch(report.fomc.status);

  return report.strategies.map((row, index) => {
    const earningsDateIso = cleanText(row.earningsDate || "");
    const earningsDateLabel =
      formatTurkishDateFromIso(earningsDateIso) || row.earningsDate || "-";
    const daysLeft =
      reportDateIso && earningsDateIso
        ? diffCalendarDays(reportDateIso, earningsDateIso)
        : 999;
    const riskLabel = inferStructuredRiskLabel(row);
    const metricEntries: StrategyMetrics[] = [
      row.price && { label: "Fiyat", value: row.price },
      row.ivRank && { label: "IV Rank", value: row.ivRank },
      row.cpr && { label: "Hacim CPR", value: row.cpr },
      row.direction && { label: "Direction", value: row.direction },
      row.setup && { label: "Setup", value: row.setup },
      row.entryWindow && { label: "Entry Penceresi", value: row.entryWindow },
      row.exitWindow && { label: "Exit Penceresi", value: row.exitWindow },
      row.budgetCost && { label: "Pozisyon Boyutu", value: row.budgetCost },
      row.credit && { label: "Kredi", value: row.credit },
      row.maxRisk && { label: "Max Risk", value: row.maxRisk },
      row.targetProfit && { label: "Target Profit", value: row.targetProfit },
      row.importance && { label: "Importance", value: row.importance },
      fomcStatus && { label: "FOMC Riski", value: report.fomc.status },
      ...(budgetMetricMap.get(row.ticker) || []),
    ].filter((entry): entry is StrategyMetrics => Boolean(entry));

    const warnings = dedupeItems([
      normalizeForSearch(row.importance) === "high"
        ? "High-importance event. Respect post-earnings gap risk."
        : "",
      fomcStatus === "imminent" || fomcStatus === "blackout"
        ? `FOMC overlap risk: ${report.fomc.status}`
        : "",
      row.note && /iv|vol|gap|crowd|risk/i.test(row.note) ? row.note : "",
    ]).slice(0, 4);

    return {
      order: index + 1,
      ticker: row.ticker,
      company: row.company || row.ticker,
      earningsLabel: [earningsDateLabel, row.earningsTime].filter(Boolean).join(" | "),
      earningsDate: earningsDateLabel,
      earningsTime: row.earningsTime || "TBA",
      daysLeft,
      strategyTitle: row.setup || row.strategyTitle,
      allocationCapital: row.budgetCost || row.maxRisk || "-",
      allocationRisk: riskLabel,
      metrics: metricEntries,
      news: buildStructuredNews(row),
      blueprint: buildStructuredBlueprint(row),
      greeks: buildStructuredGreeks(row.greeksRaw),
      scenarios: buildStructuredScenarios(row),
      warnings,
      notes: buildStructuredNotes(row),
      price: parseNumber(row.price),
      ivRank: parsePercent(row.ivRank),
      expectedMove: null,
    } satisfies EarningsPosition;
  });
}

function buildStructuredTradeSchedule(positions: EarningsPosition[]) {
  return positions
    .flatMap(position => [
      position.blueprint.entry
        ? {
            date: position.blueprint.entry,
            ticker: position.ticker,
            action: "PLANLI GIRIS",
            note: `${position.ticker} ${position.strategyTitle} icin planli giris penceresi.`,
          }
        : null,
      position.earningsDate
        ? {
            date: position.earningsDate,
            ticker: position.ticker,
            action: "EARNINGS",
            note: `${position.earningsTime} earnings event.`,
          }
        : null,
      position.blueprint.exit
        ? {
            date: position.blueprint.exit,
            ticker: position.ticker,
            action: "PLANLI CIKIS",
            note: `${position.ticker} setup'ini earnings sonrasinda yonetme / cikis penceresi.`,
          }
        : null,
    ])
    .filter((row): row is TradeScheduleRow => Boolean(row));
}

function buildStructuredRisks(report: StructuredEarningsStrategyReport): RiskEntry[] {
  const risks: RiskEntry[] = [];
  const fomcStatus = report.fomc.status || "";

  if (report.fomc.date) {
    risks.push({
      risk: "FOMC overlap",
      probability: fomcStatus || "Orta",
      impact: `${report.fomc.date} toplantisi earnings tape'i bozabilir.`,
      mitigation: report.fomc.note || "Pozisyon boyutunu kis ve blackout penceresine saygi duy.",
    });
  }

  risks.push({
    risk: "IV crush",
    probability: "Yuksek",
    impact: "Volatilite dususu dogru yone ragmen primleri baskilayabilir.",
    mitigation: "Premium odakli yapilari ve hedefli cikis disiplinini kullan.",
  });

  risks.push({
    risk: "Crowded calendar",
    probability: report.calendarTotals.highImportance > 10 ? "Yuksek" : "Orta",
    impact: "Ayni hafta icinde coklu high-importance event korelasyonu artirir.",
    mitigation: "Ayni sektorde ust uste risk alma; butceyi dagit.",
  });

  risks.push({
    risk: "Execution slippage",
    probability: "Orta",
    impact: "Acilis / kapanis seansinda spreadler genisleyebilir.",
    mitigation: "Entry window disinda zorlamali emir kullanma; likit strike sec.",
  });

  return risks;
}

function buildStructuredPositionSizing(positions: EarningsPosition[]) {
  return positions.map(position => ({
    ticker: position.ticker,
    capital: position.allocationCapital,
    contracts: "1x",
  }));
}

function buildStructuredGoldenRules(report: StructuredEarningsStrategyReport) {
  return dedupeItems([
    ...report.executiveSummary.slice(0, 3),
    "Earnings release oncesi planli cikis yoksa risk azalt.",
    "IV crush riskini tek setup'a yigmaz.",
    "FOMC blackout penceresinde boyutu kucult.",
  ]).slice(0, 6);
}

function buildStructuredChecklist(report: StructuredEarningsStrategyReport) {
  const actionItems = report.actionWeeks.flatMap(week => week.actions);

  return dedupeItems([
    ...actionItems,
    "Earnings takvimini tekrar kontrol et.",
    "Entry / exit tarihlerini teyit et.",
    "Likidite ve spread kalitesini acilis oncesi kontrol et.",
  ]).slice(0, 8);
}

function parseStructuredEarningReportSource(
  markdown: string,
  sourceFile: string
): EarningReportSource | null {
  const structured = parseStructuredEarningsStrategyMarkdown(markdown, sourceFile);
  if (!structured) {
    return null;
  }

  const positions = buildStructuredPositions(structured);
  const reportDateLabel =
    formatTurkishDateFromIso(structured.meta.reportDate) ||
    structured.meta.reportDate ||
    "-";
  const vixLabel = findStructuredMacroValue(structured, "vix") || "-";
  const subtitle =
    [structured.meta.currentMonth, structured.meta.nextMonth]
      .filter(Boolean)
      .join(" + ") || structured.executiveSummary[0] || "Structured earnings report";
  const coreWindow = [
    structured.meta.currentMonth,
    structured.meta.nextMonth,
    structured.regime && `Regime: ${structured.regime}`,
    structured.fomc.date && `FOMC: ${structured.fomc.date}`,
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    sourceFile,
    rawMarkdown: markdown,
    title: structured.meta.title,
    subtitle,
    meta: [
      { label: "Rapor Tarihi", value: reportDateLabel },
      ...(structured.meta.window ? [{ label: "Window", value: structured.meta.window }] : []),
      ...(structured.meta.desk ? [{ label: "Desk", value: structured.meta.desk }] : []),
      ...(structured.meta.version ? [{ label: "Versiyon", value: structured.meta.version }] : []),
      ...(structured.regime ? [{ label: "Regime", value: structured.regime }] : []),
      ...(vixLabel && vixLabel !== "-" ? [{ label: "VIX", value: vixLabel }] : []),
    ],
    reportDate: reportDateLabel,
    vixLabel,
    coreWindow,
    timelineSteps: structured.actionWeeks.slice(0, 8).map(week => ({
      phase: week.week,
      label: [week.focus, ...week.actions.slice(0, 2)].filter(Boolean).join(" | "),
    })),
    gainDrivers: structured.macroRows.slice(0, 4).map(row => ({
      factor: row.indicator,
      impact: row.signal || row.level || "-",
      assessment: [row.level && `Level ${row.level}`, row.weekChange && `1W ${row.weekChange}`, row.monthChange && `1M ${row.monthChange}`]
        .filter(Boolean)
        .join(" | "),
    })),
    allocations: positions.map(position => ({
      ticker: position.ticker,
      capital: position.allocationCapital,
      riskLevel: position.allocationRisk,
    })),
    positions,
    tradeSchedule: buildStructuredTradeSchedule(positions),
    risks: buildStructuredRisks(structured),
    positionSizing: buildStructuredPositionSizing(positions),
    goldenRules: buildStructuredGoldenRules(structured),
    checklist: buildStructuredChecklist(structured),
    disclaimer: "Generated from the structured Earnings Strategy Report format.",
  };
}

export function parseEarningReportMarkdown(
  markdown: string,
  sourceFile = "earningreport/source.md"
): EarningReportSource {
  if (isStructuredEarningsStrategyMarkdown(markdown)) {
    const structured = parseStructuredEarningReportSource(markdown, sourceFile);
    if (structured) {
      return structured;
    }
  }

  const lines = splitLines(markdown);
  const modernPositionIndex = findLineIndex(lines, /^###\s+3\.\d+\s+[A-Z]+/);
  const updatePositionIndex = findLineIndex(lines, /^###\s+\d+\.\s+[A-Z]+\s+\(/);
  const strategicPlanIndex = findLineIndexByText(
    lines,
    "hisse bazli iyilestirilmis strateji plani"
  );
  const cprFormatIndex = lines.findIndex(line =>
    /^###\s+\d+\.\d+\s+[A-Z]{1,5}\s+.*CPR:/.test(line) && line.includes("$")
  );

  if (strategicPlanIndex >= 0 && findLineIndex(lines, /^###\s+5\.\d+\s+[A-Z]+/) >= 0) {
    return parseStrategicPlanEarningReportMarkdown(markdown, sourceFile);
  }

  if (
    updatePositionIndex >= 0 &&
    findLineIndexByText(lines, "hisse basi guncel analiz") >= 0
  ) {
    return parseDailyUpdateEarningReportMarkdown(markdown, sourceFile);
  }

  if (cprFormatIndex >= 0) {
    return parseCprEarningReportMarkdown(markdown, sourceFile);
  }

  if (modernPositionIndex >= 0 && findLineIndexByText(lines, "hizli erisim ozeti") >= 0) {
    return parseModernEarningReportMarkdown(markdown, sourceFile);
  }

  return parseLegacyEarningReportMarkdown(markdown, sourceFile);
}
