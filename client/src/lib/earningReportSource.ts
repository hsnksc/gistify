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

function parseHeadingMeta(lines: string[]) {
  const meta: ReportMetaItem[] = [];

  for (const line of lines) {
    const match = line.match(/^\*\*(.+?):\*\*\s*(.+)$/);
    if (!match) {
      continue;
    }

    meta.push({
      label: cleanText(match[1] || ""),
      value: cleanText(match[2] || ""),
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

function parseGainDrivers(table: MarkdownTable | null) {
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

function parseAllocations(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      ticker: row[0] || "",
      capital: row[1] || "",
      riskLevel: row[2] || "",
    }))
    .filter(row => row.ticker);
}

function parseTradeSchedule(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      date: row[0] || "",
      ticker: row[1] || "",
      action: row[2] || "",
      note: row[3] || "",
    }))
    .filter(row => row.date);
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

function parsePositionSizing(table: MarkdownTable | null) {
  if (!table) {
    return [];
  }

  return table.rows
    .map(row => ({
      ticker: row[0] || "",
      capital: row[1] || "",
      contracts: row[2] || "",
    }))
    .filter(row => row.ticker);
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

function parseBlueprint(codeLines: string[]) {
  const rawLines = codeLines.map(line => line.replace(/\s+$/g, "")).filter(line => cleanText(line));
  const ratioLine = rawLines.find(line => cleanText(line).startsWith("Call/Put Orani:")) || "";
  const ratioText = cleanText(ratioLine.split(":").slice(1).join(":"));
  const { callWeight, putWeight } = parseWeights(ratioText);
  const biasLine =
    rawLines.find(
      line =>
        /bias/i.test(line) &&
        !cleanText(line).startsWith("Call/Put Orani:")
    ) || "";

  const callHeading =
    rawLines.find(line => cleanText(line).startsWith("CALL"))?.trim() || "CALL";
  const putHeading =
    rawLines.find(line => cleanText(line).startsWith("PUT"))?.trim() || "PUT";

  const callItems: string[] = [];
  const putItems: string[] = [];
  const expiryLines: string[] = [];
  let entry = "";
  let exit = "";
  let currentBucket: "call" | "put" | null = null;

  for (let index = 0; index < rawLines.length; index += 1) {
    const line = rawLines[index];
    const trimmed = cleanText(line);

    if (trimmed.startsWith("CALL")) {
      currentBucket = "call";
      continue;
    }

    if (trimmed.startsWith("PUT")) {
      currentBucket = "put";
      continue;
    }

    if (trimmed.startsWith("Expiry:")) {
      expiryLines.push(cleanText(trimmed.replace(/^Expiry:\s*/i, "")));
      for (let inner = index + 1; inner < rawLines.length; inner += 1) {
        const next = rawLines[inner];
        const nextTrimmed = cleanText(next);
        if (
          /^([A-Za-z][^:]*):/.test(nextTrimmed) ||
          nextTrimmed.startsWith("CALL") ||
          nextTrimmed.startsWith("PUT")
        ) {
          break;
        }

        expiryLines.push(nextTrimmed);
        index = inner;
      }
      currentBucket = null;
      continue;
    }

    if (trimmed.startsWith("Giris:")) {
      entry = cleanText(trimmed.replace(/^Giris:\s*/i, ""));
      currentBucket = null;
      continue;
    }

    if (trimmed.startsWith("Cikis:")) {
      exit = cleanText(trimmed.replace(/^Cikis:\s*/i, ""));
      currentBucket = null;
      continue;
    }

    if (trimmed.startsWith("Call/Put Orani:") || /bias/i.test(trimmed)) {
      currentBucket = null;
      continue;
    }

    if (currentBucket === "call") {
      callItems.push(trimmed);
      continue;
    }

    if (currentBucket === "put") {
      putItems.push(trimmed);
    }
  }

  return {
    rawLines,
    ratioText,
    callWeight,
    putWeight,
    biasLine: cleanText(biasLine),
    callHeading: cleanText(callHeading.replace(/:$/, "")),
    callItems,
    putHeading: cleanText(putHeading.replace(/:$/, "")),
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

  const subsectionIndexes = lines
    .map((line, index) => (/^###\s+/.test((line || "").trim()) ? index : -1))
    .filter(index => index >= 0);

  const sections = new Map<string, string[]>();
  for (let index = 0; index < subsectionIndexes.length; index += 1) {
    const start = subsectionIndexes[index];
    const end = subsectionIndexes[index + 1] ?? lines.length;
    const headingText = cleanText(lines[start] || "");
    sections.set(headingText, lines.slice(start + 1, end));
  }
  const sectionEntries = Array.from(sections.entries());

  const metricsSection =
    sectionEntries.find(([key]) => key.startsWith("### Hisse Durumu"))?.[1] || [];
  const metricsTable = parseTable(metricsSection, 0).table;
  const metrics = tableToKeyValueRows(metricsTable);

  const newsSection =
    sectionEntries.find(([key]) => key.startsWith("### Haber Analizi"))?.[1] || [];
  const newsItems = readBulletList(newsSection, 0).items;
  const news = parseNewsBuckets(newsItems);

  const strategyEntry =
    sectionEntries.find(([key]) => key.startsWith("### Strateji:")) || null;
  const strategyTitle = strategyEntry
    ? cleanText((strategyEntry[0] || "").replace(/^### Strateji:\s*/i, ""))
    : "Strategy";
  const blueprint = parseBlueprint(readCodeFence(strategyEntry?.[1] || [], 0).lines);

  const greeksSection =
    sectionEntries.find(([key]) => key.startsWith("### Greeks Tahmini"))?.[1] || [];
  const greeks = parseGreekRows(parseTable(greeksSection, 0).table);

  const scenarioSection =
    sectionEntries.find(([key]) => key.startsWith("### Kar/Zarar Senaryolari"))?.[1] || [];
  const scenarios = parseScenarioRows(parseTable(scenarioSection, 0).table);

  const warningSection =
    sectionEntries.find(([key]) => key.startsWith("### Kritik Uyarilar"))?.[1] || [];
  const warnings = readBulletList(warningSection, 0).items;

  const notes = sectionEntries
    .filter(([key]) => {
      return (
        !key.startsWith("### Hisse Durumu") &&
        !key.startsWith("### Haber Analizi") &&
        !key.startsWith("### Strateji:") &&
        !key.startsWith("### Greeks Tahmini") &&
        !key.startsWith("### Kar/Zarar Senaryolari") &&
        !key.startsWith("### Kritik Uyarilar")
      );
    })
    .map(([key, value]) => ({
      title: cleanText(key.replace(/^###\s*/, "")),
      lines: (() => {
        const quotes = readQuoteBlock(value, 0).items;
        if (quotes.length) {
          return quotes;
        }

        return value.map((line: string) => cleanText(line)).filter(Boolean);
      })(),
    }))
    .filter(note => note.lines.length > 0);

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
    notes,
    price: parseNumber(metricsMap.get("fiyat") || ""),
    ivRank: parsePercent(metricsMap.get("iv rank") || ""),
    expectedMove: parsePercent(metricsMap.get("expected move") || ""),
  } satisfies EarningsPosition;
}

export function parseEarningReportMarkdown(
  markdown: string,
  sourceFile = "earningreport/source.md"
): EarningReportSource {
  const lines = splitLines(markdown);
  const firstDivider = findLineIndex(lines, /^---$/);
  const metaLines = firstDivider >= 0 ? lines.slice(0, firstDivider) : lines.slice(0, 12);
  const title = cleanText((metaLines[0] || "").replace(/^#\s*/, ""));
  const subtitle = cleanText((metaLines[1] || "").replace(/^##\s*/, ""));
  const meta = parseHeadingMeta(metaLines);
  const reportDate = meta.find(item => item.label === "Rapor Tarihi")?.value || "-";
  const vixLabel = meta.find(item => item.label === "VIX")?.value || "-";

  const principleIndex = findLineIndex(lines, /^##\s+STRATEJI PRENSIBI$/i);
  const principleCode = principleIndex >= 0 ? readCodeFence(lines, principleIndex) : { lines: [] as string[] };
  const timelineSteps = parseTimelineSteps(principleCode.lines);
  const coreWindow =
    metaLines
      .concat(lines.slice(principleIndex, principleIndex + 40))
      .map(line => cleanText(line))
      .find(line => line.startsWith("Bizim Stratejimiz:"))
      ?.replace(/^Bizim Stratejimiz:\s*/i, "") || "";

  const gainIndex = findLineIndex(lines, /^###\s+Nasil Kazaniriz\?/i);
  const gainDrivers = gainIndex >= 0 ? parseGainDrivers(parseTable(lines, gainIndex + 1).table) : [];

  const allocationIndex = findLineIndex(lines, /^###\s+Portfoy Dagilimi$/i);
  const allocations =
    allocationIndex >= 0 ? parseAllocations(parseTable(lines, allocationIndex + 1).table) : [];
  const allocationMap = new Map(allocations.map(entry => [entry.ticker, entry]));

  const allLevelTwoHeadings = lines
    .map((line, index) => (/^##\s+/.test((line || "").trim()) ? index : -1))
    .filter(index => index >= 0);
  const positionHeadingIndexes = allLevelTwoHeadings.filter(index =>
    /^##\s+\d+\./.test((lines[index] || "").trim())
  );

  const positions = positionHeadingIndexes
    .map((start, index) => {
      const end = allLevelTwoHeadings.find(candidate => candidate > start) ?? lines.length;
      return parsePositionSection(lines.slice(start, end), allocationMap);
    })
    .filter((position): position is EarningsPosition => Boolean(position));

  const scheduleIndex = findLineIndex(lines, /^##\s+GIRIS\/CIKIS TAKVIMI$/i);
  const tradeSchedule =
    scheduleIndex >= 0 ? parseTradeSchedule(parseTable(lines, scheduleIndex + 1).table) : [];

  const riskIndex = findLineIndex(lines, /^###\s+Ana Riskler$/i);
  const risks = riskIndex >= 0 ? parseRiskEntries(parseTable(lines, riskIndex + 1).table) : [];

  const sizingIndex = findLineIndex(lines, /^###\s+Pozisyon Buyuklugu/i);
  const positionSizing =
    sizingIndex >= 0 ? parsePositionSizing(parseTable(lines, sizingIndex + 1).table) : [];

  const goldenRulesIndex = findLineIndex(lines, /^###\s+Golden Rules$/i);
  const goldenRules =
    goldenRulesIndex >= 0 ? readOrderedList(lines, goldenRulesIndex + 1).items : [];

  const checklistIndex = findLineIndex(lines, /^##\s+GUNLUK TAKIP KONTROL LISTESI$/i);
  const checklistCode =
    checklistIndex >= 0 ? readCodeFence(lines, checklistIndex) : { lines: [] as string[] };
  const checklist = checklistCode.lines
    .map(line => cleanText(line))
    .filter(line => line.startsWith("[]"))
    .map(line => cleanText(line.replace(/^\[\]\s*/, "")));

  const disclaimerQuoteIndex = lines.findIndex(line => (line || "").trim().startsWith("> **YASAL UYARI:**"));
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
    coreWindow,
    timelineSteps,
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
