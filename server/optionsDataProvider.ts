import type {
  CanonicalBar,
  CanonicalEarningsMarketData,
  CanonicalOptionQuote,
  OptionRight,
} from "../shared/optionsAnalytics";

export interface EarningsMarketDataProvider {
  readonly name: string;
  load(ticker: string, earningsDate?: string): Promise<CanonicalEarningsMarketData | null>;
}

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const number = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

function normalizeRight(value: unknown): OptionRight | undefined {
  const normalized = text(value).toUpperCase();
  if (normalized === "CALL" || normalized === "C") return "CALL";
  if (normalized === "PUT" || normalized === "P") return "PUT";
  return undefined;
}

function normalizeBar(value: unknown): CanonicalBar | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const close = number(row.close);
  if (!text(row.time || row.date || row.timestamp) || !close || close <= 0) return null;
  return {
    time: text(row.time || row.date || row.timestamp),
    open: number(row.open) ?? close,
    high: number(row.high) ?? close,
    low: number(row.low) ?? close,
    close,
    volume: number(row.volume) ?? 0,
  };
}

function normalizeQuote(value: unknown, ticker: string): CanonicalOptionQuote | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const right = normalizeRight(row.right || row.type || row.optionType);
  const strike = number(row.strike);
  const expiration = text(row.expiration || row.expiry || row.expirationDate);
  if (!right || !strike || strike <= 0 || !expiration) return null;
  return {
    symbol: text(row.symbol || row.contractSymbol) || `${ticker}-${expiration}-${right}-${strike}`,
    underlying: text(row.underlying || row.underlyingSymbol) || ticker,
    expiration,
    strike,
    right,
    bid: Math.max(0, number(row.bid) ?? 0),
    ask: Math.max(0, number(row.ask) ?? 0),
    last: number(row.last || row.lastPrice),
    volume: number(row.volume),
    openInterest: number(row.openInterest || row.open_interest),
    impliedVolatility: number(row.impliedVolatility || row.iv),
    delta: number(row.delta),
    gamma: number(row.gamma),
    theta: number(row.theta),
    vega: number(row.vega),
    updatedAt: text(row.updatedAt || row.quoteTime || row.timestamp) || undefined,
  };
}

export function normalizeCanonicalMarketData(payload: unknown, ticker: string, provider: string): CanonicalEarningsMarketData | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  const row = root.data && typeof root.data === "object" ? root.data as Record<string, unknown> : root;
  const barsRaw = Array.isArray(row.bars) ? row.bars : Array.isArray(row.history) ? row.history : [];
  const chainRaw = Array.isArray(row.optionChain) ? row.optionChain : Array.isArray(row.options) ? row.options : [];
  const bars = barsRaw.map(normalizeBar).filter((value): value is CanonicalBar => Boolean(value)).sort((left, right) => left.time.localeCompare(right.time));
  const optionChain = chainRaw.map(value => normalizeQuote(value, ticker)).filter((value): value is CanonicalOptionQuote => Boolean(value));
  const spot = number(row.spot || row.price || row.underlyingPrice) ?? bars.at(-1)?.close;
  if (!spot || spot <= 0) return null;
  const historicalMoves = Array.isArray(row.historicalEarningsMoves)
    ? row.historicalEarningsMoves.map(number).filter((value): value is number => value !== undefined)
    : [];
  return {
    ticker,
    asOf: text(row.asOf || row.timestamp) || new Date().toISOString(),
    spot,
    bars,
    optionChain,
    riskFreeRate: number(row.riskFreeRate),
    dividendYield: number(row.dividendYield),
    earningsDate: text(row.earningsDate) || undefined,
    historicalEarningsMoves: historicalMoves,
    borrowRate: number(row.borrowRate),
    provider,
    delayedMinutes: number(row.delayedMinutes),
  };
}

class CanonicalRestProvider implements EarningsMarketDataProvider {
  readonly name: string;
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    providerName?: string
  ) {
    this.name = providerName || "canonical-rest";
  }

  async load(ticker: string, earningsDate?: string) {
    const url = new URL(this.baseUrl);
    url.searchParams.set("symbol", ticker);
    if (earningsDate) url.searchParams.set("earningsDate", earningsDate);
    const authHeader = process.env.OPTIONS_DATA_AUTH_HEADER?.trim() || "Authorization";
    const authPrefix = process.env.OPTIONS_DATA_AUTH_PREFIX ?? "Bearer ";
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(url, {
          headers: { Accept: "application/json", [authHeader]: `${authPrefix}${this.apiKey}` },
          signal: AbortSignal.timeout(Number(process.env.OPTIONS_DATA_TIMEOUT_MS) || 12_000),
        });
        if (response.status === 429 || response.status >= 500) {
          if (attempt === 0) continue;
          return null;
        }
        if (!response.ok) return null;
        return normalizeCanonicalMarketData(await response.json(), ticker, this.name);
      } catch {
        if (attempt === 1) return null;
      }
    }
    return null;
  }
}

function thetaRows(payload: unknown): Array<Record<string, unknown>> {
  const flatten = (rows: Array<Record<string, unknown>>) => rows.flatMap(row => {
    const contract = row.contract && typeof row.contract === "object" ? row.contract as Record<string, unknown> : null;
    const data = Array.isArray(row.data) ? row.data.filter(item => item && typeof item === "object") as Array<Record<string, unknown>> : [];
    return contract && data.length ? data.map(item => ({ ...contract, ...item })) : [row];
  });
  if (Array.isArray(payload)) return flatten(payload.filter(row => row && typeof row === "object") as Array<Record<string, unknown>>);
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  for (const key of ["response", "data", "results", "body"]) {
    if (Array.isArray(root[key])) return flatten(root[key] as Array<Record<string, unknown>>);
  }
  return [];
}

function isoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function previousWeekdays(limit: number) {
  const output: string[] = [];
  const cursor = new Date();
  cursor.setUTCHours(12, 0, 0, 0);
  cursor.setUTCDate(cursor.getUTCDate() - 1);
  while (output.length < limit) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) output.push(isoDate(cursor));
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return output;
}

export class ThetaDataProvider implements EarningsMarketDataProvider {
  readonly name = "thetadata-free-eod";
  private nextRequestAt = 0;

  constructor(private readonly baseUrl: string) {}

  private async request(path: string, params: Record<string, string>) {
    const configuredGap = Number(process.env.THETADATA_REQUEST_GAP_MS);
    const minimumGap = Number.isFinite(configuredGap) ? Math.max(0, configuredGap) : 3_100;
    const wait = Math.max(0, this.nextRequestAt - Date.now());
    if (wait) await new Promise(resolve => setTimeout(resolve, wait));
    this.nextRequestAt = Date.now() + minimumGap;
    const url = new URL(`${this.baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
    url.searchParams.set("format", "json");
    const response = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(Number(process.env.OPTIONS_DATA_TIMEOUT_MS) || 60_000) });
    if (!response.ok) return [];
    return thetaRows(await response.json());
  }

  async load(ticker: string, earningsDate?: string) {
    try {
      const candidates = previousWeekdays(5);
      const barsFrom = new Date();
      barsFrom.setUTCDate(barsFrom.getUTCDate() - 75);
      const barsRows = await this.request("stock/history/eod", {
        symbol: ticker,
        start_date: isoDate(barsFrom),
        end_date: candidates[0],
      });
      const bars = barsRows.map(row => normalizeBar({
        time: row.created || row.timestamp || row.date || row.last_trade,
        open: row.open,
        high: row.high,
        low: row.low,
        close: row.close,
        volume: row.volume,
      })).filter((bar): bar is CanonicalBar => Boolean(bar));
      const spot = bars.at(-1)?.close;
      if (!spot) return null;

      let optionRows: Array<Record<string, unknown>> = [];
      let optionDate = candidates[0];
      for (const candidate of candidates) {
        optionRows = await this.request("option/history/eod", {
          symbol: ticker,
          expiration: "*",
          start_date: candidate,
          end_date: candidate,
          max_dte: process.env.THETADATA_MAX_DTE?.trim() || "60",
          strike_range: process.env.THETADATA_STRIKE_RANGE?.trim() || "15",
        });
        if (optionRows.length) {
          optionDate = candidate;
          break;
        }
      }
      const optionChain = optionRows.map(row => normalizeQuote({
        symbol: `${ticker}-${text(row.expiration)}-${text(row.right)}-${String(row.strike)}`,
        underlying: ticker,
        expiration: row.expiration,
        strike: row.strike,
        right: row.right,
        bid: row.bid,
        ask: row.ask,
        last: row.close,
        volume: row.volume,
        updatedAt: row.created || row.timestamp || `${optionDate}T21:15:00Z`,
      }, ticker)).filter((quote): quote is CanonicalOptionQuote => Boolean(quote));
      const asOf = `${optionDate}T21:15:00Z`;
      const parsedAsOf = Date.parse(asOf);
      const delayedMinutes = Number.isFinite(parsedAsOf)
        ? Math.max(60, Math.round((Date.now() - parsedAsOf) / 60_000))
        : 1_440;
      return {
        ticker,
        asOf,
        spot,
        bars,
        optionChain,
        earningsDate,
        provider: this.name,
        delayedMinutes,
      } satisfies CanonicalEarningsMarketData;
    } catch {
      return null;
    }
  }
}

export function resolveEarningsMarketDataProvider(): EarningsMarketDataProvider | null {
  const provider = process.env.OPTIONS_DATA_PROVIDER?.trim().toLowerCase();
  if (provider === "thetadata" || (!provider && process.env.THETADATA_API_KEY?.trim())) {
    const baseUrl = process.env.THETADATA_BASE_URL?.trim() || "http://127.0.0.1:25503/v3";
    try {
      new URL(baseUrl);
      return new ThetaDataProvider(baseUrl);
    } catch {
      return null;
    }
  }
  const baseUrl = process.env.OPTIONS_DATA_PROVIDER_URL?.trim();
  const apiKey = process.env.OPTIONS_DATA_API_KEY?.trim();
  if (!baseUrl || !apiKey) return null;
  try {
    new URL(baseUrl);
  } catch {
    return null;
  }
  return new CanonicalRestProvider(baseUrl, apiKey, process.env.OPTIONS_DATA_PROVIDER_NAME?.trim());
}

export async function loadEarningsMarketData(
  requests: Array<{ ticker: string; earningsDate?: string }>
) {
  const provider = resolveEarningsMarketDataProvider();
  const output = new Map<string, CanonicalEarningsMarketData>();
  if (!provider) return output;
  let unique = [...new Map(requests.filter(item => item.ticker).map(item => [item.ticker, item])).values()];
  const thetaData = provider.name.startsWith("thetadata");
  if (thetaData) unique = unique.slice(0, Math.max(1, Number(process.env.THETADATA_MAX_TICKERS) || 8));
  const concurrency = thetaData ? 1 : Math.max(1, Math.min(8, Number(process.env.OPTIONS_DATA_CONCURRENCY) || 4));
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, unique.length) }, async () => {
    while (cursor < unique.length) {
      const request = unique[cursor++];
      const result = await provider.load(request.ticker, request.earningsDate);
      if (result) output.set(request.ticker, result);
    }
  }));
  return output;
}
