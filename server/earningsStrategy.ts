import fs from "node:fs";
import path from "node:path";
import {
  isStructuredEarningsStrategyMarkdown,
  parseStructuredEarningsStrategyMarkdown,
  type StructuredEarningsStrategyReport,
} from "../shared/earningReportStructured.ts";
import type {
  ActionPlanItem,
  BudgetOption,
  CPRStock,
  EarningsEvent,
  EarningsStrategyApiResponse,
  EarningsStrategyData,
  EarningsStrategyPipelineMetadata,
  EarningsTime,
  FOMCData,
  FOMCStatus,
  Greeks,
  MacroData,
  PipelineStatus,
  PortfolioLevel,
  PortfolioRecommendation,
  RiskLevel,
  Sentiment,
  Strategy,
  StrategyType,
} from "../shared/earnings";
import {
  buildQuantOverview,
  buildStrategyIntelligence,
  loadDailyMarketSnapshots,
} from "./earningsQuantEngine";
import { loadEarningsMarketData } from "./optionsDataProvider";
import { dispatchEarningsAlerts } from "./earningsAlertDispatcher";

const DEFAULT_POLL_INTERVAL_MS = 5 * 60 * 1000;
const MIN_POLL_INTERVAL_MS = 30 * 1000;

interface RefreshOptions {
  force?: boolean;
}

interface SourceRuntimeState {
  snapshot: EarningsStrategyData | null;
  lastAttemptAt: string | null;
  lastSyncedAt: string | null;
  lastSourceModifiedAt: string | null;
  resolvedSourceFile: string | null;
  sourceFolder: string | null;
  lastKnownMtimeMs: number | null;
  lastError: string | null;
  status: PipelineStatus;
}

export interface EarningsStrategySyncService {
  start: () => Promise<void>;
  stop: () => void;
  refresh: (options?: RefreshOptions) => Promise<EarningsStrategyData | null>;
  getSnapshot: () => EarningsStrategyData | null;
  getPipeline: () => EarningsStrategyPipelineMetadata;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanMarkdownText(value: string) {
  return normalizeString(value).replace(/\*\*/g, "").replace(/\*/g, "");
}

function normalizeNumberString(value: string) {
  return value.replace(/,/g, "").replace(/\$/g, "").replace(/%/g, "").trim();
}

function parseNumber(value: string) {
  const raw = normalizeNumberString(value);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseImportance(value: string): number {
  const stars = (value.match(/⭐/g) || []).length;
  if (stars > 0) return Math.min(5, stars);
  const num = parseNumber(value);
  if (num !== undefined && num >= 1 && num <= 5) return Math.round(num);
  return 1;
}

function parseTime(value: string): EarningsTime {
  const raw = normalizeString(value).toUpperCase();
  if (raw.includes("BMO")) return "BMO";
  if (raw.includes("AMC")) return "AMC";
  return "TBA";
}

function parseRisk(value: string): RiskLevel {
  const raw = normalizeString(value).toLowerCase();
  if (raw.includes("düşük") || raw.includes("low")) return "low";
  if (raw.includes("yüksek") || raw.includes("high")) return "high";
  return "medium";
}

function parseSentiment(value: string): Sentiment {
  const raw = normalizeString(value).toLowerCase();
  if (raw.includes("güçlü boğa") || raw.includes("bullish") || raw.includes("strong bull")) return "Güçlü Boğa";
  if (raw.includes("güçlü ayı") || raw.includes("bearish") || raw.includes("strong bear")) return "Güçlü Ayı";
  if (raw.includes("ayı") || raw.includes("bear")) return "Ayı";
  if (raw.includes("boğa") || raw.includes("bull")) return "Boğa";
  if (raw.includes("nötr") || raw.includes("neutral")) return "Nötr";
  return "Unknown";
}

function parseFOMCStatus(daysUntil: number): FOMCStatus {
  if (daysUntil > 30) return "distant";
  if (daysUntil > 14) return "approaching";
  if (daysUntil > 7) return "imminent";
  return "blackout";
}

function parseStrategyType(value: string): StrategyType {
  const raw = cleanMarkdownText(value).toLowerCase();
  if (raw.includes("iron condor")) return "Iron Condor";
  if (raw.includes("bull call")) return "Bull Call Spread";
  if (raw.includes("bear put")) return "Bear Put Spread";
  if (raw.includes("bear call")) return "Bear Call Spread";
  if (raw.includes("bull put")) return "Bull Put Spread";
  if (raw.includes("long straddle")) return "Long Straddle";
  if (raw.includes("long strangle")) return "Long Strangle";
  if (raw.includes("butterfly")) return "Butterfly";
  if (raw.includes("calendar")) return "Calendar Spread";
  if (raw.includes("ratio")) return "Ratio Spread";
  if (raw.includes("long call")) return "Long Call";
  if (raw.includes("long put")) return "Long Put";
  if (raw.includes("call lottery") || raw.includes("lottery")) return "Long Call";
  return "Custom";
}

function parseTurkishDateToken(value: string): string {
  const match = normalizeString(value).match(
    /(\d{1,2})\s*(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)\s*(\d{4})/i
  );
  if (!match) return "";

  const [, dayToken, monthToken, year] = match;
  const monthMap: Record<string, string> = {
    ocak: "01",
    subat: "02",
    şubat: "02",
    mart: "03",
    nisan: "04",
    mayis: "05",
    mayıs: "05",
    haziran: "06",
    temmuz: "07",
    agustos: "08",
    ağustos: "08",
    eylul: "09",
    eylül: "09",
    ekim: "10",
    kasim: "11",
    kasım: "11",
    aralik: "12",
    aralık: "12",
  };
  const month = monthMap[normalizeString(monthToken).toLowerCase()];
  if (!month) return "";
  const day = String(Number(dayToken)).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateFromHeading(value: string): string {
  const raw = normalizeString(value);
  // e.g. "14 TEMMUZ 2026 SALI — BMO"
  const match = raw.match(/(\d{1,2})\s+([A-Za-zÇçĞğİıÖöŞşÜü]+)\s+(\d{4})/i);
  if (match) {
    return parseTurkishDateToken(`${match[1]} ${match[2]} ${match[3]}`);
  }
  return "";
}

function extractTitleInfo(markdown: string, sourceFile?: string) {
  const firstLine = markdown.split(/\r?\n/)[0] || "";
  const titleMatch = firstLine.match(/^#\s+(.+)$/);
  const title = cleanMarkdownText(titleMatch?.[1] || "");

  const reportDateMatch = markdown.match(
    /Rapor Tarihi:\s*(\d{1,2})\s+([A-Za-zÇçĞğİıÖöŞşÜü]+)\s+(\d{4})/i
  );
  const isoReportDateMatch = markdown.match(/Rapor Tarihi:\*{0,2}\s*(\d{4}-\d{2}-\d{2})/i);
  const reportDate = isoReportDateMatch?.[1] || (reportDateMatch
    ? parseTurkishDateToken(
        `${reportDateMatch[1]} ${reportDateMatch[2]} ${reportDateMatch[3]}`
      )
    : "");

  const seasonMatch = markdown.match(/([A-Za-zÇçĞğİıÖöŞşÜü]+)\s*(\d{4})\s+Earnings/i);
  const periodMatch = markdown.match(/Dönem:\*{0,2}\s*([A-Za-zÇçĞğİıÖöŞşÜü]+)\s+(\d{4})/i);
  const currentMonth = seasonMatch?.[1] || periodMatch?.[1] || "";
  const currentYear = seasonMatch?.[2] || periodMatch?.[2] || "";

  // Infer nextMonth from file name or title
  let nextMonth = "";

  // Try file name: 202607_202608_Earnings...
  if (sourceFile) {
    const fileNameMatch = path.basename(sourceFile).match(/(\d{4})(\d{2})_(\d{4})(\d{2})/);
    if (fileNameMatch) {
      const nextMonthNum = fileNameMatch[4];
      const nextYear = fileNameMatch[3];
      const monthNumToTr: Record<string, string> = {
        "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan",
        "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos",
        "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık",
      };
      const nextMonthName = monthNumToTr[nextMonthNum];
      if (nextMonthName) {
        nextMonth = `${nextMonthName} ${nextYear}`;
      }
    }
  }

  // Try title patterns: "Temmuz 2026 + Ağustos 2026" or "Temmuz & Ağustos 2026"
  if (!nextMonth) {
    const titleMonthMatch = title.match(/([A-Za-zÇçĞğİıÖöŞşÜü]+)\s+\d{4}\s*[\+&]\s*([A-Za-zÇçĞğİıÖöŞşÜü]+)\s+\d{4}/i);
    if (titleMonthMatch) {
      nextMonth = `${titleMonthMatch[2]} ${currentYear || ""}`.trim();
    }
  }

  // Try "Gelecek Ay" or explicit "+ Ağustos 2026" in executive summary
  if (!nextMonth) {
    const nextMonthMatch = markdown.match(/(?:Gelecek Ay|Next Month|Sonraki Ay)\s*[:\-]?\s*([A-Za-zÇçĞğİıÖöŞşÜü]+)\s+(\d{4})/i);
    if (nextMonthMatch) {
      nextMonth = `${nextMonthMatch[1]} ${nextMonthMatch[2]}`;
    }
  }

  return {
    title,
    reportDate,
    currentMonth,
    currentYear,
    nextMonth,
  };
}

interface MarkdownTable {
  headers: string[];
  rows: string[][];
}

export function parseTables(markdown: string): MarkdownTable[] {
  const tables: MarkdownTable[] = [];
  const lines = markdown.split(/\r?\n/);
  let buffer: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("|")) {
      buffer.push(trimmed);
    } else if (buffer.length > 0) {
      const table = buildTable(buffer);
      if (table) tables.push(table);
      buffer = [];
    }
  }

  if (buffer.length > 0) {
    const table = buildTable(buffer);
    if (table) tables.push(table);
  }

  return tables;
}

function buildTable(lines: string[]): MarkdownTable | null {
  if (lines.length < 2) return null;
  const rows = lines.map(line =>
    line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map(cell => cleanMarkdownText(cell))
  );

  const [headers, separator, ...dataRows] = rows;
  if (!headers || !separator) return null;
  if (!separator.every(cell => /^[-:\s|]+$/.test(cell))) return null;

  const cleanHeaders = headers.map(h => normalizeString(h).toLowerCase());
  return {
    headers: cleanHeaders,
    rows: dataRows.filter(r => r.some(c => normalizeString(c) !== "")),
  };
}

function findRowByLabel(
  tables: MarkdownTable[],
  labelNeedle: string,
  valueColumn = 1
): string {
  const needle = normalizeString(labelNeedle).toLowerCase();
  for (const table of tables) {
    for (const row of table.rows) {
      const label = normalizeString(row[0]).toLowerCase();
      if (label.includes(needle)) {
        return normalizeString(row[valueColumn] ?? "");
      }
    }
  }
  return "";
}

function findTableByHeader(tables: MarkdownTable[], headerNeedle: string): MarkdownTable | null {
  const needle = normalizeString(headerNeedle).toLowerCase();
  return (
    tables.find(table =>
      table.headers.some(h => h.includes(needle))
    ) || null
  );
}

export function parseMacro(tables: MarkdownTable[]): MacroData {
  const macroTable =
    findTableByHeader(tables, "gösterge") ||
    findTableByHeader(tables, "metrik") ||
    findTableByHeader(tables, "metric") ||
    findTableByHeader(tables, "indicator");

  const macro: MacroData = {};
  if (!macroTable) return macro;

  for (const row of macroTable.rows) {
    const label = normalizeString(row[0]).toLowerCase();
    const value = normalizeString(row[1]);
    if (label.includes("vix")) macro.vix = value;
    else if (label.includes("s&p")) macro.sp500 = value;
    else if (label.includes("nasdaq")) macro.nasdaq = value;
    else if (label.includes("russell")) macro.russell2000 = value;
    else if (label.includes("fear") || label.includes("greed")) macro.fearGreed = value;
    else if (label.includes("10y") || label.includes("treasury")) macro.tenYearYield = value;
    else if (label.includes("dxy")) macro.dxy = value;
    else if (label.includes("wti") || label.includes("petrol")) macro.wti = value;
    else if (label.includes("bitcoin")) macro.bitcoin = value;
  }

  // Regime from section 2.2 heading or summary text
  return macro;
}

function parseFOMC(tables: MarkdownTable[], markdown: string): FOMCData | undefined {
  const fomcTable =
    findTableByHeader(tables, "detay") ||
    findTableByHeader(tables, "bilgi") ||
    findTableByHeader(tables, "toplantı tarihi") ||
    findTableByHeader(tables, "field") ||
    findTableByHeader(tables, "value");
  if (!fomcTable) return undefined;

  const data: Record<string, string> = {};
  for (const row of fomcTable.rows) {
    const label = normalizeString(row[0]).toLowerCase();
    const value = normalizeString(row[1]);
    data[label] = value;
  }

  const date =
    data["date"] ||
    data["toplantı tarihi"] ||
    findRowByLabel(tables, "toplantı tarihi", 1);

  const daysRemaining =
    data["daysremaining"] ||
    data["days remaining"] ||
    data["kalan gün"];

  const parsedDate = date ? date : parseTurkishDateToken(date);
  let daysUntil: number | undefined;
  if (parsedDate) {
    const now = new Date();
    const target = new Date(parsedDate);
    const diffMs = target.getTime() - now.getTime();
    daysUntil = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  } else if (daysRemaining) {
    daysUntil = Number(daysRemaining);
  }

  const blackoutStart = data["blackoutstart"] || data["blackout dönemi"];
  const status = data["status"] || data["durum"];
  const currentRate = data["current rate"] || data["mevcut faiz"];
  const marketExpectation = data["market expectation"] || data["piyasa beklentisi"];
  const note = data["note"] || data["not"];

  return {
    date: parsedDate || date,
    daysUntil,
    blackoutStart,
    status: status ? (status as FOMCStatus) : daysUntil !== undefined ? parseFOMCStatus(daysUntil) : undefined,
    currentRate,
    marketExpectation,
    notes: note ? [note] : undefined,
  };
}

function parseCalendar(tables: MarkdownTable[], markdown: string): EarningsEvent[] {
  const events: EarningsEvent[] = [];
  
  // NEW FORMAT: Try to find Calendar table by Date/Ticker column first
  const calendarTables = tables.filter(table => {
    const headers = table.headers.map(header => header.toLocaleLowerCase("tr-TR"));
    const hasDate = headers.some(header => header.includes("date") || header.includes("tarih"));
    const hasTicker = headers.some(header => header.includes("ticker") || header.includes("hisse"));
    return hasDate && hasTicker;
  });
  
  if (calendarTables.length) {
    for (const calendarTable of calendarTables) {
      const headers = calendarTable.headers.map(h => h.toLocaleLowerCase("tr-TR"));
      const dateIdx = headers.findIndex(h => h.includes("date") || h.includes("tarih"));
      const tickerIdx = headers.findIndex(h => h.includes("ticker") || h.includes("hisse"));
      const companyIdx = headers.findIndex(h => h.includes("company") || h.includes("şirket"));
      const sectorIdx = headers.findIndex(h => h.includes("sector") || h.includes("sektör"));
      const sessionIdx = headers.findIndex(h => h.includes("session") || h.includes("saat"));
      const importanceIdx = headers.findIndex(h => h.includes("importance") || h.includes("önem"));
      const noteIdx = headers.findIndex(h => h.includes("note") || h.includes("not") || h.includes("açıklama"));

      for (const row of calendarTable.rows) {
        if (row.length < 2) continue;

        const ticker = tickerIdx >= 0 ? cleanMarkdownText(row[tickerIdx]) : "";
        if (!ticker || ticker.toLowerCase() === "ticker" || ticker.toLowerCase() === "hisse") continue;

        const date = dateIdx >= 0 ? normalizeString(row[dateIdx]) : "";
        const company = companyIdx >= 0 ? normalizeString(row[companyIdx]) : "";
        const sector = sectorIdx >= 0 ? normalizeString(row[sectorIdx]) : "";
        const session = sessionIdx >= 0 ? parseTime(row[sessionIdx]) : "TBA";
        const importance = importanceIdx >= 0 ? parseImportance(row[importanceIdx]) : 1;
        const note = noteIdx >= 0 ? normalizeString(row[noteIdx]) : "";

        events.push({
          date,
          ticker,
          company,
          sector,
          time: session,
          importance,
          notes: note ? [note] : undefined,
        });
      }
    }

    const deduped = new Map(events.map(event => [`${event.date}:${event.ticker}`, event]));
    return Array.from(deduped.values());
  }
  
  // OLD FORMAT: Fallback to date headings with embedded tables
  const lines = markdown.split(/\r?\n/);
  let currentDate = "";
  let currentTime: EarningsTime = "TBA";
  let calendarHeaders: string[] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Match daily headings like "#### 🔷 14 TEMMUZ 2026 SALI — BMO"
    const headingMatch = line.match(/^#{2,4}\s+.*?(\d{1,2}\s+[A-Za-zÇçĞğİıÖöŞşÜü]+\s+\d{4}).*?$/i);
    if (headingMatch) {
      currentDate = parseTurkishDateToken(headingMatch[1]);
      currentTime = parseTime(line);
      calendarHeaders = null;
      continue;
    }

    if (!line.startsWith("|")) {
      calendarHeaders = null;
      continue;
    }

    const cells = line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map(cell => cleanMarkdownText(cell));

    // Separator line
    if (cells.every(cell => /^[-:\s]+$/.test(cell))) {
      continue;
    }

    const nextLine = lines[i + 1]?.trim() || "";
    const isHeader =
      nextLine.startsWith("|") && /^[-:\s|]+$/.test(nextLine.replace(/\|/g, ""));

    if (isHeader) {
      const headers = cells.map(cell => normalizeString(cell).toLowerCase());
      const hasTicker = headers.some(
        h => h.includes("ticker") || h.includes("hisse")
      );
      const hasSector = headers.some(h => h.includes("sektör"));
      const hasImportance = headers.some(h => h.includes("önem"));
      calendarHeaders = hasTicker && hasSector && hasImportance ? headers : null;
      continue;
    }

    if (calendarHeaders) {
      const ticker = cleanMarkdownText(cells[0]);
      if (
        !ticker ||
        ticker.toLowerCase() === "ticker" ||
        ticker.toLowerCase() === "hisse"
      ) {
        continue;
      }

      const companyIdx = calendarHeaders.findIndex(h => h.includes("şirket"));
      const sectorIdx = calendarHeaders.findIndex(h => h.includes("sektör"));
      const marketCapIdx = calendarHeaders.findIndex(h => h.includes("piyasa"));
      const importanceIdx = calendarHeaders.findIndex(h => h.includes("önem"));
      const dateIdx = calendarHeaders.findIndex(
        h =>
          h.includes("earnings tarihi") ||
          h.includes("muhtemel tarih") ||
          h.includes("tarih")
      );
      const timeIdx = calendarHeaders.findIndex(h => h.includes("saat"));

      const date =
        (dateIdx >= 0 ? parseTurkishDateToken(cells[dateIdx]) : "") ||
        currentDate;
      const rowTime = timeIdx >= 0 ? parseTime(cells[timeIdx]) : null;
      const time: EarningsTime =
        rowTime && rowTime !== "TBA" ? rowTime : currentTime;

      events.push({
        ticker,
        company: companyIdx >= 0 ? cells[companyIdx] : undefined,
        sector: sectorIdx >= 0 ? cells[sectorIdx] : undefined,
        date,
        time,
        marketCap: marketCapIdx >= 0 ? cells[marketCapIdx] : undefined,
        importance: parseImportance(cells[importanceIdx] || ""),
      });
    }
  }

  // Deduplicate by ticker and keep latest
  const seen = new Map<string, EarningsEvent>();
  for (const event of events) {
    seen.set(event.ticker, event);
  }
  return Array.from(seen.values());
}

function parseCPR(tables: MarkdownTable[]): CPRStock[] {
  const stocks: CPRStock[] = [];
  const seen = new Set<string>();

  for (const table of tables) {
    const hasCPR = table.headers.some(
      h => h.includes("hacim cpr") || h.includes("cpr")
    );
    const hasTicker = table.headers.some(
      h => h.includes("ticker") || h.includes("hisse")
    );
    if (!hasCPR || !hasTicker) continue;

    const tickerIdx = table.headers.findIndex(
      h => h.includes("ticker") || h.includes("hisse")
    );
    const companyIdx = table.headers.findIndex(h => h.includes("şirket"));
    const hacimIdx = table.headers.findIndex(h => h.includes("hacim cpr"));
    const oiIdx = table.headers.findIndex(h => h.includes("oi cpr"));
    const sentimentIdx = table.headers.findIndex(h => h.includes("yorum"));
    const sectorIdx = table.headers.findIndex(h => h.includes("sektör"));
    const earningsDateIdx = table.headers.findIndex(
      h => h.includes("earnings tarihi")
    );
    const ivRankIdx = table.headers.findIndex(h => h.includes("iv rank"));
    const priceIdx = table.headers.findIndex(h => h.includes("fiyat"));

    for (const row of table.rows) {
      const ticker = cleanMarkdownText(row[tickerIdx]);
      if (!ticker || seen.has(ticker)) continue;
      seen.add(ticker);

      stocks.push({
        ticker,
        company: companyIdx >= 0 ? row[companyIdx] : undefined,
        price: priceIdx >= 0 ? row[priceIdx] : undefined,
        hacimCPR: hacimIdx >= 0 ? row[hacimIdx] : undefined,
        oiCPR: oiIdx >= 0 ? row[oiIdx] : undefined,
        sentiment: sentimentIdx >= 0 ? parseSentiment(row[sentimentIdx]) : undefined,
        sector: sectorIdx >= 0 ? row[sectorIdx] : undefined,
        earningsDate: earningsDateIdx >= 0 ? row[earningsDateIdx] : undefined,
        ivRank: ivRankIdx >= 0 ? row[ivRankIdx] : undefined,
      });
    }
  }

  return stocks;
}

function parseStrategies(markdown: string): Strategy[] {
  const strategies: Strategy[] = [];
  const lines = markdown.split(/\r?\n/);
  const tables = parseTables(markdown);

  // Find both legacy numbered headings and current headings such as:
  // "### NFLX — $74.22 | IV Rank: 72/100 | CPR: 0.85 | NEUTRAL"
  const sectionRegex = /^(#{2,3})\s+(?:\d+(?:\.\d+)?\s+)?([A-Z][A-Z0-9.-]{0,9})\s+[-—]\s+\$?([\d,.]+).*?\bCPR:\s*([\d.]+)/i;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(sectionRegex);
    if (!match) continue;

    const levelPrefix = match[1]; // "##" or "###"
    const ticker = match[2].toUpperCase();
    const price = `$${match[3]}`;
    const cpr = match[4];

    // Find the next same-level heading to bound this section
    const endRegex = new RegExp(`^${levelPrefix}\\s`);
    let endIdx = i + 1;
    while (endIdx < lines.length && !endRegex.test(lines[endIdx].trim())) {
      endIdx++;
    }

    const sectionText = lines.slice(i, endIdx).join("\n");
    const sectionTables = parseTables(sectionText);

    const strategy = extractStrategyFromSection(
      ticker,
      price,
      cpr,
      sectionText,
      sectionTables
    );
    strategies.push(strategy);
  }

  return strategies;
}

function extractStrategyFromSection(
  ticker: string,
  price: string,
  cpr: string,
  sectionText: string,
  sectionTables: MarkdownTable[]
): Strategy {
  const strategy: Strategy = {
    ticker,
    price,
    cpr,
    budgetOptions: [],
  };

  // Parameter table
  const paramTable = sectionTables.find(table =>
    table.headers.some(h => normalizeString(h).toLowerCase().includes("parametre"))
  );
  if (paramTable) {
    for (const row of paramTable.rows) {
      const label = normalizeString(row[0]).toLowerCase();
      const value = row[1];
      if (label.includes("iv rank")) strategy.ivRank = value;
      else if (label.includes("sektör")) strategy.sector = value;
      else if (label === "entry" || label.includes("entry penceresi")) strategy.entry = value;
      else if (label === "exit" || label.includes("exit penceresi")) strategy.exit = value;
      else if (label.includes("max hold")) strategy.maxHold = value;
      else if (label.includes("kar hedefi")) strategy.profitTarget = value;
      else if (label.includes("iv crush")) strategy.ivCrush = value;
    }
  }

  // Main strategy table
  const mainTable = sectionTables.find(table => {
    const hasParametre = table.headers.some(h =>
      normalizeString(h).toLowerCase().includes("parametre")
    );
    if (!hasParametre) return false;
    return table.rows.some(r => {
      const label = normalizeString(r[0]).toLowerCase();
      return (
        label.includes("tahmini kredi") ||
        label.includes("kredi/maliyet") ||
        label.includes("kredi") ||
        label.includes("maliyet") ||
        label.includes("sell call") ||
        label.includes("buy call") ||
        label.includes("sell put") ||
        label.includes("tip")
      );
    });
  });

  // IV Crush / Exit schedule table (often a secondary source for exit/hold/iv crush)
  const ivCrushTable = sectionTables.find(table =>
    table.rows.some(r => {
      const label = normalizeString(r[0]).toLowerCase();
      return (
        label.includes("beklenen iv düşüşü") ||
        label.includes("iv crush") ||
        label.includes("optimal exit") ||
        label.includes("optimal çıkış") ||
        label.includes("max hold")
      );
    })
  );

  const mainData: Record<string, string> = {};
  if (mainTable) {
    for (const row of mainTable.rows) {
      mainData[normalizeString(row[0]).toLowerCase()] = row[1];
    }
  }
  if (ivCrushTable) {
    for (const row of ivCrushTable.rows) {
      mainData[normalizeString(row[0]).toLowerCase()] = row[1];
    }
  }

  if (mainTable || Object.keys(mainData).length > 0) {
    const strategyText =
      sectionText.match(/###\s*Ana Strateji:\s*([^\n]+)/i) ||
      sectionText.match(/Ana Strateji:\s*([^\n]+)/i) ||
      sectionText.match(/Ana Strateji\s*-\s*([^\n]+)/i) ||
      sectionText.match(/####?\s*Strateji\s*1:\s*([^\n]+)/i) ||
      sectionText.match(/Strateji\s*1:\s*([^\n]+)/i);
    const strategyName = strategyText?.[1] || mainData["tip"] || "";
    strategy.type = parseStrategyType(strategyName);

    strategy.credit =
      mainData["tahmini kredi"] || mainData["kredi/maliyet"] || mainData["kredi"] || mainData["maliyet"];
    strategy.maxRisk = mainData["max risk"];
    strategy.koProbability = mainData["k.o. olasılığı"];
    strategy.positionSize = mainData["pozisyon boyutu"];
    strategy.profitTarget = mainData["kar hedefi"] || mainData["max kar"];
    strategy.stopLoss = mainData["stop-loss"] || mainData["stop loss"];
    strategy.ivCrush =
      mainData["iv crush beklentisi"] || mainData["beklenen iv düşüşü"];
    strategy.optimalExit = mainData["optimal çıkış"] || mainData["optimal exit"];
    strategy.maxHold = mainData["max hold"] || mainData["max tutma"];

    const breakeven = mainData["breakeven'lar"] || mainData["breakeven"];
    if (breakeven) {
      const parts = breakeven.split("/").map(s => s.trim());
      if (parts.length === 2) {
        strategy.breakeven = [parts[0], parts[1]];
      }
    }
  }

  // Greeks table
  const greeksTable = sectionTables.find(table =>
    table.headers.some(h => normalizeString(h).toLowerCase().includes("greek"))
  );
  if (greeksTable) {
    const greeks: Greeks = {};
    for (const row of greeksTable.rows) {
      const label = normalizeString(row[0]).toLowerCase();
      const value = row[1];
      if (label.includes("delta")) greeks.delta = value;
      else if (label.includes("theta")) greeks.theta = value;
      else if (label.includes("vega")) greeks.vega = value;
      else if (label.includes("gamma")) greeks.gamma = value;
    }
    strategy.greeks = greeks;
  }

  // Budget options table
  const budgetTable = sectionTables.find(table =>
    table.headers.some(h => normalizeString(h).toLowerCase().includes("bütçe"))
  );
  if (budgetTable) {
    const budgetIdx = budgetTable.headers.findIndex(h => h.includes("bütçe"));
    const strategyIdx = budgetTable.headers.findIndex(h => h.includes("strateji"));
    const costIdx = budgetTable.headers.findIndex(
      h => h.includes("maliyet") || h.includes("cost")
    );
    const maxProfitIdx = budgetTable.headers.findIndex(
      h => h.includes("max kar") || h.includes("max profit")
    );

    for (const row of budgetTable.rows) {
      const budget = budgetIdx >= 0 ? row[budgetIdx] : "";
      if (!budget) continue;
      strategy.budgetOptions.push({
        budget,
        strategy: strategyIdx >= 0 ? row[strategyIdx] : "",
        cost: costIdx >= 0 ? row[costIdx] : "",
        maxProfit: maxProfitIdx >= 0 ? row[maxProfitIdx] : "",
      });
    }
  }

  return strategy;
}

function parsePortfolio(tables: MarkdownTable[], markdown: string): PortfolioLevel[] {
  const levels: PortfolioLevel[] = [];

  // Extract budget labels from section headings like "### 11.1 $1,000 Earnings Play Portföy"
  const budgetByTableIndex = new Map<number, string>();
  const lines = markdown.split(/\r?\n/);
  let tableIndex = -1;
  let currentBudget = "";
  for (const line of lines) {
    if (line.trim().startsWith("|")) {
      if (tableIndex === -1 || !lines[lines.indexOf(line) - 1]?.trim().startsWith("|")) {
        tableIndex++;
      }
    }
    const budgetMatch = line.match(/(\$[\d,]+(?:\.\d+)?)\s+Earnings\s+Play\s+Portföy/i);
    if (budgetMatch) {
      currentBudget = budgetMatch[1];
    }
    if (tableIndex >= 0 && currentBudget && !budgetByTableIndex.has(tableIndex)) {
      budgetByTableIndex.set(tableIndex, currentBudget);
    }
  }

  let seenTableIndex = -1;
  for (const table of tables) {
    seenTableIndex++;
    const hasHisse = table.headers.some(h => {
      const nh = normalizeString(h);
      return nh.includes("hisse") || nh.includes("ticker");
    });
    const hasMaliyet = table.headers.some(h => normalizeString(h).toLowerCase().includes("maliyet"));
    const hasAgirlik = table.headers.some(h => normalizeString(h).toLowerCase().includes("ağırlık"));
    if (!hasHisse || !hasMaliyet || !hasAgirlik) continue;

    const tickerIdx = table.headers.findIndex(
      h => h.includes("hisse") || h.includes("ticker")
    );
    const strategyIdx = table.headers.findIndex(h => h.includes("strateji"));
    const costIdx = table.headers.findIndex(h => h.includes("maliyet"));
    const allocationIdx = table.headers.findIndex(h => h.includes("ağırlık"));
    const fomcRiskIdx = table.headers.findIndex(h => h.includes("fomc risk"));
    const sectorIdx = table.headers.findIndex(h => h.includes("sektör"));
    const earningsDateIdx = table.headers.findIndex(
      h => h.includes("earnings tarihi")
    );
    const entryIdx = table.headers.findIndex(h => h.includes("entry penceresi"));
    const exitIdx = table.headers.findIndex(h => h.includes("exit penceresi"));
    const ivCrushIdx = table.headers.findIndex(
      h => h.includes("iv crush beklentisi")
    );
    const expectedReturnIdx = table.headers.findIndex(
      h => h.includes("greeks hedefi") || h.includes("beta")
    );

    const recommendations: PortfolioRecommendation[] = [];
    let totalAllocation = "";

    for (const row of table.rows) {
      const ticker = cleanMarkdownText(row[tickerIdx]);
      if (!ticker) continue;

      const lower = ticker.toLowerCase();
      if (lower.includes("toplam")) {
        totalAllocation = allocationIdx >= 0 ? row[allocationIdx] : "";
        continue;
      }
      if (lower.includes("nakit") || lower.includes("rezerv")) {
        continue;
      }

      recommendations.push({
        ticker,
        strategy: strategyIdx >= 0 ? row[strategyIdx] : "",
        allocation: allocationIdx >= 0 ? row[allocationIdx] : "",
        expectedReturn: expectedReturnIdx >= 0 ? row[expectedReturnIdx] : undefined,
        risk: fomcRiskIdx >= 0 ? parseRisk(row[fomcRiskIdx]) : undefined,
        sector: sectorIdx >= 0 ? row[sectorIdx] : undefined,
        fomcRisk: fomcRiskIdx >= 0 ? row[fomcRiskIdx] : undefined,
        entryExit:
          entryIdx >= 0 && exitIdx >= 0
            ? `${row[entryIdx]} → ${row[exitIdx]}`
            : undefined,
      });
    }

    if (recommendations.length > 0) {
      levels.push({
        budget: budgetByTableIndex.get(seenTableIndex) || inferBudgetFromRows(recommendations, totalAllocation),
        totalAllocation,
        recommendations,
      });
    }
  }

  // Deduplicate by budget and sort
  const seen = new Map<string, PortfolioLevel>();
  for (const level of levels) {
    if (!seen.has(level.budget)) {
      seen.set(level.budget, level);
    }
  }

  const budgets = ["$1,000", "$5,000", "$10,000", "$25,000", "$50,000"];
  const deduped = budgets
    .map(b => seen.get(b))
    .filter((l): l is PortfolioLevel => Boolean(l));

  return deduped.length > 0 ? deduped : Array.from(seen.values());
}

function inferBudgetFromRows(rows: PortfolioRecommendation[], totalAllocation: string): string {
  // Try to infer from the total allocation row if present
  const totalMatch = totalAllocation.match(/(\$[\d,]+(?:\.\d+)?)/);
  if (totalMatch) {
    const total = parseNumber(totalMatch[1].replace(/[$,]/g, "")) || 0;
    if (total >= 45000) return "$50,000";
    if (total >= 22000) return "$25,000";
    if (total >= 8000) return "$10,000";
    if (total >= 4000) return "$5,000";
  }
  return "$1,000";
}

function parseActionPlan(markdown: string): ActionPlanItem[] {
  const items: ActionPlanItem[] = [];
  const lines = markdown.split(/\r?\n/);
  const sectionRegex = /^#{2,4}\s+\d+\.\s*HAFTA:\s*(.+)$/i;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(sectionRegex);
    if (!match) continue;

    const weekTitle = match[1];
    const weekMatch = weekTitle.match(/(\d+)\.\s*HAFTA/i);
    const week = weekMatch ? `Hafta ${weekMatch[1]}` : weekTitle;

    // Capture description from next > block
    let description = "";
    let j = i + 1;
    while (j < lines.length && lines[j].trim().startsWith(">")) {
      description += " " + cleanMarkdownText(lines[j]);
      j++;
    }

    // Find the table within this section
    const nextHeading = lines.findIndex(
      (line, idx) => idx > i && /^#{2,4}\s+/.test(line.trim())
    );
    const sectionEnd = nextHeading > 0 ? nextHeading : lines.length;
    const sectionTables = parseTables(lines.slice(i, sectionEnd).join("\n"));

    const actions: string[] = [];
    for (const table of sectionTables) {
      const actionIdx = table.headers.findIndex(
        h => h.includes("eylem") || h.includes("aksiyon")
      );
      const detailIdx = table.headers.findIndex(h => h.includes("detay"));
      const dateIdx = table.headers.findIndex(h => h.includes("tarih"));

      for (const row of table.rows) {
        const action = actionIdx >= 0 ? row[actionIdx] : "";
        if (!action) continue;
        const detail = detailIdx >= 0 ? row[detailIdx] : "";
        const date = dateIdx >= 0 ? row[dateIdx] : "";
        actions.push(date ? `${date}: ${action}${detail ? ` — ${detail}` : ""}` : action);
      }
    }

    items.push({
      week,
      dateRange: weekTitle.replace(/^\d+\.\s*HAFTA:\s*/i, "").split("—")[0]?.trim(),
      focus: description.trim(),
      actions,
    });
  }

  return items;
}

function parseExecutiveSummary(markdown: string): string[] {
  const items: string[] = [];
  const lines = markdown.split(/\r?\n/);
  let inSection = false;
  let foundFirstParagraph = false;

  for (const line of lines) {
    if (/^##\s*(?:\d+\.\s*)?EXECUTIVE SUMMARY/i.test(line.trim())) {
      inSection = true;
      continue;
    }
    if (inSection && /^##\s+\d+\./.test(line.trim())) break;
    if (!inSection) continue;

    const cleaned = cleanMarkdownText(line);
    if (cleaned.startsWith("|")) continue;
    if (cleaned.startsWith("- ") || /^\d+\./.test(cleaned)) {
      items.push(cleaned.replace(/^-\s*/, "").replace(/^\d+\.\s*/, ""));
    } else if (cleaned.length > 40 && !cleaned.startsWith("#") && !foundFirstParagraph) {
      // First meaningful paragraph text (not a heading, not a table, long enough)
      items.unshift(cleaned);
      foundFirstParagraph = true;
    }
  }

  return items.slice(0, 10);
}

function findStructuredMacroValue(
  report: StructuredEarningsStrategyReport,
  needle: string
) {
  const normalizedNeedle = normalizeString(needle).toLowerCase();
  return (
    report.macroRows.find(row =>
      normalizeString(row.indicator).toLowerCase().includes(normalizedNeedle)
    )?.level || ""
  );
}

function parseStructuredImportanceValue(value: string) {
  const raw = normalizeString(value).toLowerCase();
  if (raw.includes("high")) return 5;
  if (raw.includes("medium")) return 3;
  if (raw.includes("low")) return 2;
  return parseImportance(value);
}

function parseStructuredStrategyGreeks(value: string): Greeks | undefined {
  const entries = new Map<string, string>();
  const matches = Array.from(
    value.matchAll(/([A-Za-z]+)\s*:\s*([+-]?\d+(?:[.,]\d+)?)/g)
  );

  for (const match of matches) {
    entries.set(normalizeString(match[1]).toLowerCase(), normalizeString(match[2]));
  }

  const greeks = {
    delta: entries.get("delta") || undefined,
    theta: entries.get("theta") || undefined,
    vega: entries.get("vega") || undefined,
    gamma: entries.get("gamma") || undefined,
  } satisfies Greeks;

  if (!greeks.delta && !greeks.theta && !greeks.vega && !greeks.gamma) {
    return undefined;
  }

  return greeks;
}

function inferStructuredBudgetBand(value: string) {
  const numeric = parseNumber(value);
  if (numeric === undefined) {
    return "";
  }

  if (numeric <= 50) return "$10 - $50";
  if (numeric <= 200) return "$50 - $200";
  if (numeric <= 500) return "$200 - $500";
  return "$500 - $1,000";
}

function buildStructuredBudgetOptions(report: StructuredEarningsStrategyReport) {
  const optionsByTicker = new Map<string, BudgetOption[]>();
  const seen = new Set<string>();
  const strategyByTicker = new Map(report.strategies.map(row => [row.ticker, row] as const));

  const pushOption = (
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
      budget,
      strategy,
      cost,
      maxProfit: maxReturn || cost,
      maxReturn: maxReturn || undefined,
    });
    optionsByTicker.set(ticker, current);
  };

  for (const row of report.strategies) {
    const derivedBudget = inferStructuredBudgetBand(row.budgetCost);
    if (derivedBudget) {
      pushOption(
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
      const fallback = strategyByTicker.get(item.ticker);
      pushOption(
        item.ticker,
        bucket.budgetLabel || bucket.label,
        item.title || fallback?.setup || item.ticker,
        item.risk,
        item.target
      );
    }
  }

  return optionsByTicker;
}

function parseStructuredMacro(report: StructuredEarningsStrategyReport): MacroData {
  return {
    vix: findStructuredMacroValue(report, "vix") || undefined,
    sp500: findStructuredMacroValue(report, "s&p") || undefined,
    nasdaq: findStructuredMacroValue(report, "nasdaq") || undefined,
    russell2000: findStructuredMacroValue(report, "russell") || undefined,
    tenYearYield: findStructuredMacroValue(report, "10y") || undefined,
    dxy: findStructuredMacroValue(report, "dxy") || undefined,
    wti: findStructuredMacroValue(report, "wti") || undefined,
    bitcoin: findStructuredMacroValue(report, "bitcoin") || undefined,
    fearGreed: findStructuredMacroValue(report, "fear") || undefined,
    regime: normalizeString(report.regime) || undefined,
    notes: report.macroRows
      .map(row => [row.indicator, row.signal].filter(Boolean).join(": "))
      .filter(Boolean),
  };
}

function parseStructuredFomc(report: StructuredEarningsStrategyReport): FOMCData | undefined {
  if (!report.fomc.date) {
    return undefined;
  }

  const daysUntil = parseNumber(report.fomc.daysRemaining);
  const explicitStatus = normalizeString(report.fomc.status).toLowerCase();
  const status =
    explicitStatus === "distant" ||
    explicitStatus === "approaching" ||
    explicitStatus === "imminent" ||
    explicitStatus === "blackout"
      ? (explicitStatus as FOMCStatus)
      : typeof daysUntil === "number"
        ? parseFOMCStatus(daysUntil)
        : undefined;

  return {
    date: report.fomc.date,
    daysUntil,
    blackoutStart: normalizeString(report.fomc.blackoutStart) || undefined,
    status,
    marketExpectation: normalizeString(report.fomc.note) || undefined,
    notes: report.fomc.note ? [report.fomc.note] : undefined,
  };
}

function parseStructuredCalendar(report: StructuredEarningsStrategyReport): EarningsEvent[] {
  const cprMap = new Map(report.cprStocks.map(stock => [stock.ticker, stock] as const));
  const strategyMap = new Map(report.strategies.map(strategy => [strategy.ticker, strategy] as const));

  return report.calendar.map(row => {
    const cpr = cprMap.get(row.ticker);
    const strategy = strategyMap.get(row.ticker);

    return {
      ticker: row.ticker,
      company: normalizeString(row.company) || undefined,
      sector: normalizeString(row.sector) || undefined,
      date: row.date,
      time: parseTime(row.session),
      importance: parseStructuredImportanceValue(row.importance),
      ivRank: normalizeString(cpr?.ivRank) || undefined,
      cpr: normalizeString(cpr?.hacimCpr) || undefined,
      strategy: normalizeString(strategy?.setup || strategy?.strategyTitle) || undefined,
      notes: row.note ? [row.note] : undefined,
    };
  });
}

function parseStructuredStrategies(report: StructuredEarningsStrategyReport): Strategy[] {
  const budgetOptions = buildStructuredBudgetOptions(report);

  return report.strategies.map(row => ({
    ticker: row.ticker,
    company: normalizeString(row.company) || undefined,
    sector: normalizeString(row.sector) || undefined,
    price: normalizeString(row.price) || undefined,
    ivRank: normalizeString(row.ivRank) || undefined,
    cpr: normalizeString(row.cpr) || undefined,
    type: parseStrategyType(row.setup || row.strategyTitle),
    entry: normalizeString(row.entryWindow) || undefined,
    exit: normalizeString(row.exitWindow) || undefined,
    maxHold: row.earningsDate ? `Through ${row.earningsDate}` : undefined,
    profitTarget: normalizeString(row.targetProfit) || undefined,
    credit: normalizeString(row.credit) || undefined,
    maxRisk: normalizeString(row.maxRisk) || undefined,
    koProbability:
      normalizeString(row.importance).toLowerCase() === "high"
        ? "High importance"
        : undefined,
    positionSize: normalizeString(row.budgetCost) || undefined,
    greeks: parseStructuredStrategyGreeks(row.greeksRaw),
    budgetOptions: budgetOptions.get(row.ticker) || [],
    notes: [row.structure, row.note].filter(Boolean),
  }));
}

function parseStructuredPortfolio(report: StructuredEarningsStrategyReport): PortfolioLevel[] {
  const strategyMap = new Map(report.strategies.map(strategy => [strategy.ticker, strategy] as const));

  return report.portfolioLevels.map(level => ({
    budget: level.budget,
    recommendations: level.recommendations.map(item => {
      const ticker = normalizeString(item.strategy).match(/\b[A-Z]{1,5}\b/)?.[0] || "";
      const strategy = strategyMap.get(ticker);

      return {
        ticker,
        strategy: item.strategy,
        allocation: item.allocation,
        expectedReturn: normalizeString(item.target) || undefined,
        risk: parseRisk(item.risk || ""),
        sector: normalizeString(strategy?.sector) || undefined,
        fomcRisk: report.fomc.status || undefined,
        entryWindow: normalizeString(strategy?.entryWindow) || undefined,
        exitWindow: normalizeString(strategy?.exitWindow) || undefined,
      };
    }),
  }));
}

function parseStructuredActionPlan(report: StructuredEarningsStrategyReport): ActionPlanItem[] {
  return report.actionWeeks.map(week => {
    const match = week.week.match(/^(Week\s+\d+)\s*\(([^)]+)\)$/i);

    return {
      week: normalizeString(match?.[1] || week.week) || undefined,
      dateRange: normalizeString(match?.[2] || "") || undefined,
      focus: normalizeString(week.focus) || undefined,
      actions: week.actions.filter(Boolean),
    };
  });
}

function parseStructuredEarningsStrategyData(
  markdown: string,
  sourceFile: string
): EarningsStrategyData | null {
  const structured = parseStructuredEarningsStrategyMarkdown(markdown, sourceFile);
  if (!structured) {
    return null;
  }

  const strategies = parseStructuredStrategies(structured);

  return {
    generatedAt: new Date().toISOString(),
    reportDate: structured.meta.reportDate,
    currentMonth: structured.meta.currentMonth,
    nextMonth: structured.meta.nextMonth,
    title: structured.meta.title,
    summary: structured.executiveSummary[0] || "",
    macro: parseStructuredMacro(structured),
    fomc: parseStructuredFomc(structured),
    calendar: parseStructuredCalendar(structured),
    cprStocks: structured.cprStocks.map(stock => ({
      ticker: stock.ticker,
      price: normalizeString(stock.price) || undefined,
      hacimCPR: normalizeString(stock.hacimCpr) || undefined,
      oiCPR: normalizeString(stock.oiCpr) || undefined,
      sentiment: parseSentiment(stock.sentiment),
      sector: normalizeString(stock.sector) || undefined,
      ivRank: normalizeString(stock.ivRank) || undefined,
    })),
    strategies,
    budgetStrategies: strategies.filter(strategy => strategy.budgetOptions.length > 0),
    portfolio: parseStructuredPortfolio(structured),
    actionPlan: parseStructuredActionPlan(structured),
    executiveSummary: structured.executiveSummary,
  };
}

export function parseEarningsStrategyMarkdown(
  markdown: string,
  sourceFile: string
): EarningsStrategyData | null {
  if (!markdown) return null;

  if (isStructuredEarningsStrategyMarkdown(markdown)) {
    const structured = parseStructuredEarningsStrategyData(markdown, sourceFile);
    if (structured) {
      return structured;
    }
  }

  const tables = parseTables(markdown);
  const titleInfo = extractTitleInfo(markdown, sourceFile);

  const macro = parseMacro(tables);
  // Try to extract regime from heading text
  const regimeMatch = markdown.match(/Piyasa Rejimi:\s*"([^"]+)"/i) || markdown.match(/Regime:\s*"?([^"\n]+)"/i);
  if (regimeMatch) macro.regime = regimeMatch[1].trim();

  const fomc = parseFOMC(tables, markdown);
  const calendar = parseCalendar(tables, markdown);
  const cprStocks = parseCPR(tables);
  const strategies = parseStrategies(markdown);
  const portfolio = parsePortfolio(tables, markdown);
  const actionPlan = parseActionPlan(markdown);
  const executiveSummary = parseExecutiveSummary(markdown);

  // Build budget strategies from per-ticker budget options
  const budgetStrategies: Strategy[] = [];
  for (const strategy of strategies) {
    if (strategy.budgetOptions.length > 0) {
      budgetStrategies.push(strategy);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    reportDate: titleInfo.reportDate,
    currentMonth: `${titleInfo.currentMonth} ${titleInfo.currentYear}`,
    nextMonth: titleInfo.nextMonth,
    title: titleInfo.title,
    summary: executiveSummary[0] || "",
    macro,
    fomc,
    calendar,
    cprStocks,
    strategies,
    budgetStrategies,
    portfolio,
    actionPlan,
    executiveSummary,
  };
}

function resolvePollIntervalMs() {
  const configured = Number(process.env.EARNINGS_STRATEGY_POLL_INTERVAL_MS);
  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_POLL_INTERVAL_MS;
  }
  return Math.max(MIN_POLL_INTERVAL_MS, Math.floor(configured));
}

function getConfiguredRootPath() {
  const configured = normalizeString(process.env.EARNINGS_STRATEGY_SOURCE_FILE);
  if (configured) {
    if (fs.existsSync(configured) && fs.statSync(configured).isFile()) {
      return { folder: path.dirname(configured), file: configured };
    }
    if (fs.existsSync(configured) && fs.statSync(configured).isDirectory()) {
      return { folder: configured, file: null };
    }
  }

  const workspaceDir = path.resolve(
    process.cwd(),
    "earningreport",
    "Kimi_Agent_ Option Strategy"
  );
  const fallbackDir = path.resolve(process.cwd(), "earningreport");
  if (findLatestMasterFile(fallbackDir)) {
    return { folder: fallbackDir, file: null };
  }

  if (fs.existsSync(workspaceDir)) {
    return { folder: workspaceDir, file: null };
  }

  return { folder: fallbackDir, file: null };
}

export function findLatestMasterFile(folder: string): { filePath: string; mtimeMs: number } | null {
  if (!fs.existsSync(folder)) return null;

  const entries = fs.readdirSync(folder, { withFileTypes: true });
  const candidates: { filePath: string; mtimeMs: number; dateScore: number }[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const name = entry.name;
    if (!/Earnings_Opsiyon_Master_Stratejisi.*\.md$/i.test(name)) continue;

    const filePath = path.join(folder, name);
    const stats = fs.statSync(filePath);

    // Extract date from file name for stable ordering (e.g., 202607_202608 or Temmuz2026)
    let dateScore = 0;
    const dateMatch = name.match(/(\d{4})(\d{2})(?:_(\d{4})(\d{2}))?/);
    if (dateMatch) {
      const year = Number(dateMatch[3] || dateMatch[1]);
      const month = Number(dateMatch[4] || dateMatch[2]);
      dateScore = year * 100 + month;
    } else {
      // Fallback to mtimeMs as score
      dateScore = stats.mtimeMs;
    }

    candidates.push({ filePath, mtimeMs: stats.mtimeMs, dateScore });
  }

  if (candidates.length === 0) return null;

  // Sort by dateScore descending (most recent first)
  candidates.sort((a, b) => b.dateScore - a.dateScore || b.mtimeMs - a.mtimeMs);
  return { filePath: candidates[0].filePath, mtimeMs: candidates[0].mtimeMs };
}

export function createEarningsStrategySyncService(): EarningsStrategySyncService {
  const pollIntervalMs = resolvePollIntervalMs();
  const runtimeState: SourceRuntimeState = {
    snapshot: null,
    lastAttemptAt: null,
    lastSyncedAt: null,
    lastSourceModifiedAt: null,
    resolvedSourceFile: null,
    sourceFolder: null,
    lastKnownMtimeMs: null,
    lastError: null,
    status: "idle",
  };
  let timer: ReturnType<typeof setInterval> | null = null;

  async function refreshQuantLayer(snapshot: EarningsStrategyData) {
    const requests = snapshot.strategies.map(strategy => ({
      ticker: strategy.ticker,
      earningsDate: snapshot.calendar.find(event => event.ticker === strategy.ticker)?.date,
    }));
    const [marketSnapshots, advancedMarketData] = await Promise.all([
      loadDailyMarketSnapshots(requests.map(request => request.ticker)),
      loadEarningsMarketData(requests),
    ]);
    snapshot.strategies = snapshot.strategies.map(strategy => ({
      ...strategy,
      intelligence: buildStrategyIntelligence(
        strategy,
        snapshot.calendar,
        snapshot.macro,
        marketSnapshots.get(strategy.ticker),
        advancedMarketData.get(strategy.ticker)
      ),
    }));
    const byTicker = new Map(snapshot.strategies.map(strategy => [strategy.ticker, strategy]));
    snapshot.budgetStrategies = snapshot.budgetStrategies.map(
      strategy => byTicker.get(strategy.ticker) || strategy
    );
    snapshot.quantOverview = buildQuantOverview(snapshot.strategies);
    snapshot.generatedAt = new Date().toISOString();
    await dispatchEarningsAlerts(snapshot.strategies);
    return snapshot;
  }

  function getPipeline(): EarningsStrategyPipelineMetadata {
    const { file: configuredSourceFile } = getConfiguredRootPath();
    return {
      configuredSourceFile: configuredSourceFile || null,
      resolvedSourceFile: runtimeState.resolvedSourceFile,
      sourceFolder: runtimeState.sourceFolder,
      pollIntervalMs,
      lastAttemptAt: runtimeState.lastAttemptAt,
      lastSyncedAt: runtimeState.lastSyncedAt,
      lastSourceModifiedAt: runtimeState.lastSourceModifiedAt,
      status: runtimeState.status,
      error: runtimeState.lastError || undefined,
    };
  }

  async function refresh(options: RefreshOptions = {}) {
    runtimeState.lastAttemptAt = new Date().toISOString();

    const { folder, file: configuredFile } = getConfiguredRootPath();
    runtimeState.sourceFolder = folder;

    const source = configuredFile
      ? { filePath: configuredFile, mtimeMs: fs.statSync(configuredFile).mtimeMs }
      : findLatestMasterFile(folder);

    if (!source) {
      runtimeState.lastError =
        "Earnings strategy master markdown not found. Set EARNINGS_STRATEGY_SOURCE_FILE or generate a *_Earnings_Opsiyon_Master_Stratejisi.md file.";
      runtimeState.status = runtimeState.snapshot ? "stale" : "error";
      return runtimeState.snapshot;
    }

    runtimeState.resolvedSourceFile = source.filePath;
    runtimeState.lastSourceModifiedAt = new Date(source.mtimeMs).toISOString();

    if (
      !options.force &&
      runtimeState.snapshot &&
      runtimeState.lastKnownMtimeMs === source.mtimeMs
    ) {
      await refreshQuantLayer(runtimeState.snapshot);
      runtimeState.status = "ok";
      runtimeState.lastError = null;
      runtimeState.lastSyncedAt = new Date().toISOString();
      return runtimeState.snapshot;
    }

    try {
      const raw = fs.readFileSync(source.filePath, "utf8");
      const normalized = parseEarningsStrategyMarkdown(raw, source.filePath);

      if (!normalized) {
        throw new Error("Earnings strategy markdown could not be normalized.");
      }

      runtimeState.snapshot = await refreshQuantLayer(normalized);
      runtimeState.lastSyncedAt = new Date().toISOString();
      runtimeState.lastKnownMtimeMs = source.mtimeMs;
      runtimeState.lastError = null;
      runtimeState.status = "ok";
      return runtimeState.snapshot;
    } catch (error) {
      runtimeState.lastError =
        error instanceof Error && error.message
          ? error.message
          : "Unknown earnings strategy pipeline error.";
      runtimeState.status = runtimeState.snapshot ? "stale" : "error";
      return runtimeState.snapshot;
    }
  }

  async function start() {
    refresh({ force: true });

    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      void refresh();
    }, pollIntervalMs);

    console.log(
      `Earnings strategy sync active (${Math.round(pollIntervalMs / 1000)}s interval).`
    );
    if (runtimeState.resolvedSourceFile) {
      console.log(`Earnings strategy source: ${runtimeState.resolvedSourceFile}`);
    }
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  return {
    start,
    stop,
    refresh,
    getSnapshot: () => {
      return runtimeState.snapshot;
    },
    getPipeline,
  };
}

export function buildEarningsApiResponse(
  snapshot: EarningsStrategyData | null,
  pipeline: EarningsStrategyPipelineMetadata
): EarningsStrategyApiResponse {
  if (!snapshot) {
    return {
      success: false,
      pipeline,
      error: pipeline.error || "Earnings strategy snapshot hazır değil.",
    };
  }

  return {
    success: true,
    data: snapshot,
    pipeline,
  };
}
