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

export function parseEarningReportMarkdown(
  markdown: string,
  sourceFile = "earningreport/source.md"
): EarningReportSource {
  const lines = splitLines(markdown);
  const modernPositionIndex = findLineIndex(lines, /^###\s+3\.\d+\s+[A-Z]+/);
  const updatePositionIndex = findLineIndex(lines, /^###\s+\d+\.\s+[A-Z]+\s+\(/);

  if (
    updatePositionIndex >= 0 &&
    findLineIndexByText(lines, "hisse basi guncel analiz") >= 0
  ) {
    return parseDailyUpdateEarningReportMarkdown(markdown, sourceFile);
  }

  if (modernPositionIndex >= 0 && findLineIndexByText(lines, "hizli erisim ozeti") >= 0) {
    return parseModernEarningReportMarkdown(markdown, sourceFile);
  }

  return parseLegacyEarningReportMarkdown(markdown, sourceFile);
}
