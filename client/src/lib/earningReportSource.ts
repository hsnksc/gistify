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

export function parseEarningReportMarkdown(
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
