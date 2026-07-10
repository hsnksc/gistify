export type FlowReportKind = "daily" | "stock" | "weekly";

export const FLOW_WEEKLY_SOURCE_PATTERN =
  /(?:^|[\\/_-])weekly-\d{4}-\d{2}-\d{2}/i;

export const BLOCKED_FLOW_TICKERS = new Set([
  "ABD",
  "AI",
  "CPO",
  "DTC",
  "EN",
  "HTML",
  "PDF",
  "REPORT",
  "TR",
]);

export const FLOW_TICKER_ALIASES: Array<{
  ticker: string;
  patterns: RegExp[];
}> = [
  { ticker: "META", patterns: [/\bmeta platforms?\b/i, /\bmeta\b/i] },
  { ticker: "HOOD", patterns: [/\brobinhood\b/i] },
  { ticker: "PLTR", patterns: [/\bpalantir\b/i] },
  { ticker: "WDC", patterns: [/\bwestern digital\b/i] },
  { ticker: "INTC", patterns: [/\bintel\b/i] },
  {
    ticker: "MARKET",
    patterns: [
      /\babd borsalar[ıi]\b/i,
      /\bus markets?\b/i,
      /\bpre-market\b/i,
      /\bmomentum analizi\b/i,
    ],
  },
];

export const FLOW_DAILY_REPORT_KEYWORDS = [
  "abd piyasalari",
  "us markets",
  "market report",
  "close report",
  "kapanis raporu",
  "gunluk rapor",
  "pre-market",
  "premarket",
  "abd borsalar",
  "borsalar",
  "momentum analizi",
  "genel gorunum",
];

export function normalizeFlowTicker(value: string): string {
  return value.trim().toUpperCase().replace(/[^A-Z0-9.-]/g, "");
}

export function isBlockedFlowTicker(value: string): boolean {
  const normalized = normalizeFlowTicker(value);
  return !normalized || BLOCKED_FLOW_TICKERS.has(normalized);
}

export function normalizeFlowKindText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
}

export function inferFlowTickerFromText(...values: string[]): string {
  const joined = values.map(value => value.trim()).filter(Boolean).join(" ");
  if (!joined) {
    return "";
  }

  for (const alias of FLOW_TICKER_ALIASES) {
    if (alias.patterns.some(pattern => pattern.test(joined))) {
      return alias.ticker;
    }
  }

  const explicitPatterns = [
    /\(([A-Z][A-Z0-9.-]{0,9})\)/,
    /^\s*([A-Z][A-Z0-9.-]{0,9})(?=\s*[—\-·:|])/,
    /\bTicker\s*[:\-]\s*([A-Z][A-Z0-9.-]{0,9})\b/i,
    /\$([A-Z][A-Z0-9.-]{0,9})\b/,
    /\bstock[-_/]([A-Z][A-Z0-9.]{0,9})(?=[-_/]|\b)/i,
    /(?:^|[-_/])([a-z]{1,8})(?=\d{6,8}(?:$|[-_.]))/i,
  ];

  for (const pattern of explicitPatterns) {
    const match = joined.match(pattern);
    const normalized = normalizeFlowTicker(match?.[1] || "");
    if (normalized && !isBlockedFlowTicker(normalized)) {
      return normalized;
    }
  }

  return "";
}

export function extractFlowTickerUniverseFromText(...values: string[]): string[] {
  const joined = values.map(value => value.trim()).filter(Boolean).join(" ");
  if (!joined) {
    return [];
  }

  const collected: string[] = [];
  const seen = new Set<string>();
  const pushTicker = (value: string) => {
    const normalized = normalizeFlowTicker(value);
    if (!normalized || isBlockedFlowTicker(normalized) || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    collected.push(normalized);
  };

  for (const alias of FLOW_TICKER_ALIASES) {
    if (alias.patterns.some(pattern => pattern.test(joined))) {
      pushTicker(alias.ticker);
    }
  }

  const explicitPatterns = [
    /\$([A-Z][A-Z0-9.-]{0,9})\b/g,
    /\(([A-Z][A-Z0-9.-]{0,9})\)/g,
    /\bTicker\s*[:\-]\s*([A-Z][A-Z0-9.-]{0,9})\b/gi,
    /\bstock[-_/]([A-Z][A-Z0-9.]{0,9})(?=[-_/]|\b)/gi,
    /(?:^|[-_/])([a-z]{1,8})(?=\d{6,8}(?:$|[-_.]))/gi,
  ];

  for (const pattern of explicitPatterns) {
    for (const match of Array.from(joined.matchAll(pattern))) {
      pushTicker(match[1] || "");
    }
  }

  pushTicker(inferFlowTickerFromText(...values));

  if (!collected.length && isDailyMarketReportText(...values)) {
    pushTicker("MARKET");
  }

  return collected;
}

export function isDailyMarketReportText(...values: string[]): boolean {
  const joined = values.map(normalizeFlowKindText).filter(Boolean).join(" ");
  if (!joined) {
    return false;
  }

  return FLOW_DAILY_REPORT_KEYWORDS.some(keyword => joined.includes(keyword));
}

export function resolveFlowReportKind(options: {
  title?: string;
  htmlTitle?: string;
  tickerUniverse?: string[];
  candidates?: string[];
}): FlowReportKind {
  const candidates = [
    options.title,
    options.htmlTitle,
    ...(options.candidates || []),
  ].filter((value): value is string => Boolean(value));

  if (candidates.some(value => FLOW_WEEKLY_SOURCE_PATTERN.test(value))) {
    return "weekly";
  }

  if (candidates.some(value => isDailyMarketReportText(value))) {
    return "daily";
  }

  const normalizedUniverse = (options.tickerUniverse || []).map(item =>
    normalizeFlowTicker(item)
  );
  if (normalizedUniverse.includes("MARKET")) {
    return "daily";
  }

  const inferredTicker = inferFlowTickerFromText(...candidates);
  if (inferredTicker === "MARKET") {
    return "daily";
  }

  if ((options.tickerUniverse?.length || 0) >= 4) {
    return "daily";
  }

  return "stock";
}

export function extractFlowTitleInfo(title: string): {
  companyName: string;
  ticker: string;
} {
  const source = title.trim();
  if (!source) {
    return { companyName: "", ticker: "" };
  }

  const leadingTickerMatch = source.match(
    /^([A-Z0-9.-]{1,10})\s*[—\-]\s*(.+?)(?:\s+(?:Advanced\s+Analysis|Stock\s+Diagnostic|Research)\s+Report)?$/i
  );
  if (leadingTickerMatch) {
    const ticker = normalizeFlowTicker(leadingTickerMatch[1]);
    if (ticker && !isBlockedFlowTicker(ticker)) {
      return {
        companyName: leadingTickerMatch[2].trim(),
        ticker,
      };
    }
  }

  const trailingTickerMatch = source.match(/^(.*?)\s*\(([A-Z][A-Z0-9.-]{0,9})\)\s*$/i);
  if (trailingTickerMatch) {
    const ticker = normalizeFlowTicker(trailingTickerMatch[2]);
    if (ticker && !isBlockedFlowTicker(ticker)) {
      return {
        companyName: trailingTickerMatch[1].trim(),
        ticker,
      };
    }
  }

  const ticker = inferFlowTickerFromText(source);
  const companyName = source.replace(/^[A-Z0-9.-]+\s*[—\-]?\s*/i, "").trim();
  return { companyName: companyName || source, ticker };
}
