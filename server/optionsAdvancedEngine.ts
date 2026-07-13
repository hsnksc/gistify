import type {
  AdvancedOptionsAnalytics,
  CanonicalBar,
  CanonicalEarningsMarketData,
  CanonicalOptionQuote,
  PortfolioOptionPosition,
  PortfolioRiskResult,
  RiskNeutralDistributionPoint,
  SviSliceResult,
} from "../shared/optionsAnalytics";

const DAY = 86_400_000;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number, digits = 4) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};
const mean = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const std = (values: number[]) => {
  if (values.length < 2) return 0;
  const average = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1));
};

function quoteMid(quote: CanonicalOptionQuote) {
  if (quote.bid > 0 && quote.ask >= quote.bid) return (quote.bid + quote.ask) / 2;
  return quote.last && quote.last > 0 ? quote.last : 0;
}

function normalizedIv(value?: number) {
  if (!value || value <= 0) return undefined;
  return value > 3 ? value / 100 : value;
}

function normalCdf(x: number) {
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * z);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-z * z);
  return 0.5 * (1 + sign * erf);
}

function normalPdf(x: number) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function bsmMetrics(spot: number, strike: number, time: number, volatility: number, rate: number, dividend: number, right: "CALL" | "PUT") {
  const rootTime = Math.sqrt(time);
  const d1 = (Math.log(spot / strike) + (rate - dividend + volatility ** 2 / 2) * time) / (volatility * rootTime);
  const d2 = d1 - volatility * rootTime;
  const discountedSpot = spot * Math.exp(-dividend * time);
  const discountedStrike = strike * Math.exp(-rate * time);
  const call = discountedSpot * normalCdf(d1) - discountedStrike * normalCdf(d2);
  const put = discountedStrike * normalCdf(-d2) - discountedSpot * normalCdf(-d1);
  const delta = right === "CALL" ? Math.exp(-dividend * time) * normalCdf(d1) : Math.exp(-dividend * time) * (normalCdf(d1) - 1);
  const gamma = Math.exp(-dividend * time) * normalPdf(d1) / (spot * volatility * rootTime);
  const vega = discountedSpot * normalPdf(d1) * rootTime / 100;
  const commonTheta = -discountedSpot * normalPdf(d1) * volatility / (2 * rootTime);
  const theta = right === "CALL"
    ? (commonTheta - rate * discountedStrike * normalCdf(d2) + dividend * discountedSpot * normalCdf(d1)) / 365
    : (commonTheta + rate * discountedStrike * normalCdf(-d2) - dividend * discountedSpot * normalCdf(-d1)) / 365;
  return { price: right === "CALL" ? call : put, delta, gamma, theta, vega };
}

function deriveIvAndGreeks(data: CanonicalEarningsMarketData, quote: CanonicalOptionQuote) {
  const existingIv = normalizedIv(quote.impliedVolatility);
  const time = Math.max(dte(quote.expiration, data.asOf), 1) / 365;
  const rate = data.riskFreeRate ?? 0.04;
  const dividend = data.dividendYield ?? 0;
  let volatility = existingIv;
  if (!volatility) {
    const target = quoteMid(quote);
    let low = 0.01;
    let high = 5;
    const lowPrice = bsmMetrics(data.spot, quote.strike, time, low, rate, dividend, quote.right).price;
    const highPrice = bsmMetrics(data.spot, quote.strike, time, high, rate, dividend, quote.right).price;
    if (target >= lowPrice - 0.01 && target <= highPrice + 0.01) {
      for (let iteration = 0; iteration < 70; iteration += 1) {
        const middle = (low + high) / 2;
        const price = bsmMetrics(data.spot, quote.strike, time, middle, rate, dividend, quote.right).price;
        if (price > target) high = middle;
        else low = middle;
      }
      volatility = (low + high) / 2;
    }
  }
  if (!volatility) return quote;
  const metrics = bsmMetrics(data.spot, quote.strike, time, volatility, rate, dividend, quote.right);
  return {
    ...quote,
    impliedVolatility: quote.impliedVolatility ?? volatility,
    delta: quote.delta ?? metrics.delta,
    gamma: quote.gamma ?? metrics.gamma,
    theta: quote.theta ?? metrics.theta,
    vega: quote.vega ?? metrics.vega,
  };
}

export function enrichOptionChain(data: CanonicalEarningsMarketData) {
  return data.optionChain.map(quote => deriveIvAndGreeks(data, quote));
}

function dte(expiration: string, asOf: string) {
  const expiry = Date.parse(`${expiration}T20:00:00Z`);
  const current = Date.parse(asOf);
  return Number.isFinite(expiry) && Number.isFinite(current)
    ? Math.max(1, Math.ceil((expiry - current) / DAY))
    : 1;
}

function calculateRsi(bars: CanonicalBar[], period = 14) {
  if (bars.length <= period) return undefined;
  const changes = bars.slice(-(period + 1)).slice(1).map((bar, index) => bar.close - bars.slice(-(period + 1))[index].close);
  const gain = mean(changes.map(change => Math.max(change, 0)));
  const loss = mean(changes.map(change => Math.max(-change, 0)));
  return loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
}

function ema(values: number[], period: number) {
  if (!values.length) return [];
  const alpha = 2 / (period + 1);
  const output = [values[0]];
  for (let index = 1; index < values.length; index += 1) {
    output.push(values[index] * alpha + output[index - 1] * (1 - alpha));
  }
  return output;
}

function momentumAnalytics(bars: CanonicalBar[]): AdvancedOptionsAnalytics["momentum"] {
  const sorted = [...bars].sort((left, right) => left.time.localeCompare(right.time));
  const closes = sorted.map(bar => bar.close).filter(value => value > 0);
  if (closes.length < 2) return { score: 0, regime: "NEUTRAL" };
  const rsi14 = calculateRsi(sorted);
  const fast = ema(closes, 12);
  const slow = ema(closes, 26);
  const macd = closes.map((_, index) => fast[index] - slow[index]);
  const signal = ema(macd, 9);
  const macdHistogram = macd.at(-1)! - signal.at(-1)!;
  const trueRanges = sorted.slice(1).map((bar, index) => Math.max(
    bar.high - bar.low,
    Math.abs(bar.high - sorted[index].close),
    Math.abs(bar.low - sorted[index].close)
  ));
  const atr14Percent = mean(trueRanges.slice(-14)) / closes.at(-1)! * 100;
  const volumes = sorted.map(bar => bar.volume).filter(value => value >= 0);
  const baseline = volumes.slice(-21, -1);
  const volumeZScore = baseline.length > 2 && std(baseline) > 0 ? (volumes.at(-1)! - mean(baseline)) / std(baseline) : 0;
  const last = sorted.at(-1)!;
  const gapPercent = last.open && sorted.length > 1 ? (last.open / sorted.at(-2)!.close - 1) * 100 : 0;
  const return5 = closes.length > 5 ? (closes.at(-1)! / closes.at(-6)! - 1) * 100 : 0;
  const return20 = closes.length > 20 ? (closes.at(-1)! / closes.at(-21)! - 1) * 100 : 0;
  const rsiContribution = rsi14 === undefined ? 0 : clamp((rsi14 - 50) * 0.7, -25, 25);
  const macdContribution = clamp(macdHistogram / closes.at(-1)! * 2000, -25, 25);
  const score = round(clamp(return5 * 3 + return20 + rsiContribution + macdContribution + clamp(volumeZScore * Math.sign(return5) * 4, -10, 10), -100, 100), 1);
  const regime = score >= 55 ? "STRONG_UP" : score >= 18 ? "UP" : score <= -55 ? "STRONG_DOWN" : score <= -18 ? "DOWN" : "NEUTRAL";
  return { score, regime, rsi14: rsi14 === undefined ? undefined : round(rsi14, 1), macdHistogram: round(macdHistogram, 4), atr14Percent: round(atr14Percent, 2), volumeZScore: round(volumeZScore, 2), gapPercent: round(gapPercent, 2) };
}

interface SviPoint { k: number; totalVariance: number }
interface SviParams { a: number; b: number; rho: number; m: number; sigma: number }

function sviVariance(k: number, params: SviParams) {
  const shifted = k - params.m;
  return params.a + params.b * (params.rho * shifted + Math.sqrt(shifted ** 2 + params.sigma ** 2));
}

function fitSvi(points: SviPoint[]): { parameters: SviParams; rmse: number } {
  let params: SviParams = { a: Math.max(0.00001, Math.min(...points.map(point => point.totalVariance)) * 0.5), b: 0.1, rho: 0, m: 0, sigma: 0.2 };
  const bounds: Record<keyof SviParams, [number, number]> = { a: [0.000001, 4], b: [0.0001, 4], rho: [-0.999, 0.999], m: [-2, 2], sigma: [0.005, 3] };
  const loss = (candidate: SviParams) => mean(points.map(point => (sviVariance(point.k, candidate) - point.totalVariance) ** 2));
  let bestLoss = loss(params);
  let steps: Record<keyof SviParams, number> = { a: 0.02, b: 0.08, rho: 0.2, m: 0.1, sigma: 0.08 };
  for (let iteration = 0; iteration < 80; iteration += 1) {
    for (const key of Object.keys(params) as Array<keyof SviParams>) {
      for (const direction of [-1, 1]) {
        const candidate = { ...params, [key]: clamp(params[key] + direction * steps[key], ...bounds[key]) };
        const candidateLoss = loss(candidate);
        if (candidateLoss < bestLoss) {
          params = candidate;
          bestLoss = candidateLoss;
        }
      }
    }
    if ((iteration + 1) % 10 === 0) {
      steps = Object.fromEntries(Object.entries(steps).map(([key, value]) => [key, value * 0.62])) as Record<keyof SviParams, number>;
    }
  }
  return { parameters: params, rmse: Math.sqrt(bestLoss) };
}

function buildSurface(data: CanonicalEarningsMarketData, quotes: CanonicalOptionQuote[]): SviSliceResult[] {
  const rate = data.riskFreeRate ?? 0.04;
  const dividend = data.dividendYield ?? 0;
  const expirations = [...new Set(quotes.map(quote => quote.expiration))].sort();
  const slices: SviSliceResult[] = [];
  for (const expiration of expirations) {
    const days = dte(expiration, data.asOf);
    const time = days / 365;
    const forward = data.spot * Math.exp((rate - dividend) * time);
    const byStrike = new Map<number, number[]>();
    for (const quote of quotes.filter(item => item.expiration === expiration)) {
      const iv = normalizedIv(quote.impliedVolatility);
      if (!iv || quote.strike <= 0 || Math.abs(Math.log(quote.strike / forward)) > 0.75) continue;
      const values = byStrike.get(quote.strike) || [];
      values.push(iv);
      byStrike.set(quote.strike, values);
    }
    const points = [...byStrike.entries()].map(([strike, values]) => ({ k: Math.log(strike / forward), totalVariance: mean(values) ** 2 * time }));
    if (points.length < 5) continue;
    const fitted = fitSvi(points);
    const grid = Array.from({ length: 121 }, (_, index) => -0.9 + index * 0.015).map(k => sviVariance(k, fitted.parameters));
    const butterflyArbitrageWarning = grid.some((variance, index) => variance <= 0 || (index > 0 && index < grid.length - 1 && grid[index - 1] - 2 * variance + grid[index + 1] < -0.002));
    const previous = slices.at(-1);
    const currentAtm = sviVariance(0, fitted.parameters);
    const calendarArbitrageWarning = Boolean(previous && currentAtm + 0.0001 < sviVariance(0, previous.parameters));
    slices.push({
      expiration,
      dte: days,
      forward: round(forward, 4),
      points: points.length,
      rmse: round(fitted.rmse, 6),
      parameters: {
        a: round(fitted.parameters.a, 6),
        b: round(fitted.parameters.b, 6),
        rho: round(fitted.parameters.rho, 6),
        m: round(fitted.parameters.m, 6),
        sigma: round(fitted.parameters.sigma, 6),
      },
      calendarArbitrageWarning,
      butterflyArbitrageWarning,
    });
  }
  return slices;
}

function buildRiskNeutralDistribution(data: CanonicalEarningsMarketData, quotes: CanonicalOptionQuote[]) {
  const expirations = [...new Set(quotes.map(quote => quote.expiration))].sort((left, right) => dte(left, data.asOf) - dte(right, data.asOf));
  const expiration = expirations.find(value => quotes.filter(quote => quote.expiration === value && quote.right === "CALL" && quoteMid(quote) > 0).length >= 7);
  if (!expiration) return { points: [] as RiskNeutralDistributionPoint[] };
  const time = dte(expiration, data.asOf) / 365;
  const callsByStrike = new Map<number, number[]>();
  for (const quote of quotes.filter(item => item.expiration === expiration && item.right === "CALL")) {
    const mid = quoteMid(quote);
    if (mid <= 0) continue;
    const values = callsByStrike.get(quote.strike) || [];
    values.push(mid);
    callsByStrike.set(quote.strike, values);
  }
  const calls = [...callsByStrike.entries()].map(([strike, values]) => ({ strike, price: mean(values) })).sort((left, right) => left.strike - right.strike);
  const raw: RiskNeutralDistributionPoint[] = [];
  for (let index = 1; index < calls.length - 1; index += 1) {
    const left = calls[index - 1];
    const center = calls[index];
    const right = calls[index + 1];
    const leftSlope = (center.price - left.price) / (center.strike - left.strike);
    const rightSlope = (right.price - center.price) / (right.strike - center.strike);
    const secondDerivative = 2 * (rightSlope - leftSlope) / (right.strike - left.strike);
    raw.push({ terminalPrice: center.strike, density: Math.max(0, Math.exp((data.riskFreeRate ?? 0.04) * time) * secondDerivative) });
  }
  const area = raw.slice(1).reduce((sum, point, index) => sum + (point.density + raw[index].density) / 2 * (point.terminalPrice - raw[index].terminalPrice), 0);
  const points = area > 0 ? raw.map(point => ({ terminalPrice: point.terminalPrice, density: point.density / area })) : [];
  const weighted = points.slice(1).map((point, index) => ({ price: (point.terminalPrice + points[index].terminalPrice) / 2, probability: (point.density + points[index].density) / 2 * (point.terminalPrice - points[index].terminalPrice) }));
  const expectedPrice = weighted.reduce((sum, point) => sum + point.price * point.probability, 0);
  const downsideProbability = weighted.filter(point => point.price < data.spot).reduce((sum, point) => sum + point.probability, 0);
  let accumulated = 0;
  let tailValue = 0;
  for (const point of weighted) {
    const used = Math.min(point.probability, Math.max(0, 0.05 - accumulated));
    tailValue += used * point.price;
    accumulated += used;
    if (accumulated >= 0.05) break;
  }
  return { expiration, expectedPrice: round(expectedPrice, 2), downsideProbability: round(downsideProbability * 100, 1), expectedShortfall5: accumulated ? round(tailValue / accumulated, 2) : undefined, points: points.map(point => ({ terminalPrice: round(point.terminalPrice, 2), density: round(point.density, 8) })) };
}

function calibrateJumpModel(moves: number[] = []): AdvancedOptionsAnalytics["jumpModel"] {
  const normalized = moves.map(value => Math.abs(value) > 1 ? value / 100 : value).filter(value => Number.isFinite(value) && Math.abs(value) < 1);
  if (normalized.length < 4) return { calibrated: false, annualIntensity: 4, jumpMean: 0, jumpVolatility: 0.08, historicalSamples: normalized.length };
  return { calibrated: true, annualIntensity: 4, jumpMean: round(mean(normalized), 5), jumpVolatility: round(Math.max(std(normalized), 0.01), 5), historicalSamples: normalized.length };
}

export function analyzeAdvancedOptions(data: CanonicalEarningsMarketData): AdvancedOptionsAnalytics {
  const now = Date.parse(data.asOf);
  const missingModelMetrics = data.provider.startsWith("thetadata-free") || data.optionChain.some(quote => !normalizedIv(quote.impliedVolatility) || quote.delta === undefined);
  const enrichedChain = enrichOptionChain(data);
  const valid = enrichedChain.filter(quote => quote.underlying === data.ticker && quote.strike > 0 && quote.ask >= quote.bid && quoteMid(quote) > 0);
  const liquid = valid.filter(quote => {
    const mid = quoteMid(quote);
    const spread = mid ? (quote.ask - quote.bid) / mid : 1;
    return spread <= 0.25 && ((quote.openInterest || 0) >= 20 || (quote.volume || 0) >= 5);
  });
  const quoted = valid.filter(quote => quote.bid > 0 && quote.ask > 0);
  const stale = valid.filter(quote => quote.updatedAt && Number.isFinite(now) && now - Date.parse(quote.updatedAt) > 20 * 60_000);
  const putVolume = valid.filter(quote => quote.right === "PUT").reduce((sum, quote) => sum + (quote.volume || 0), 0);
  const callVolume = valid.filter(quote => quote.right === "CALL").reduce((sum, quote) => sum + (quote.volume || 0), 0);
  const putOi = valid.filter(quote => quote.right === "PUT").reduce((sum, quote) => sum + (quote.openInterest || 0), 0);
  const callOi = valid.filter(quote => quote.right === "CALL").reduce((sum, quote) => sum + (quote.openInterest || 0), 0);
  const nearAtm = valid.filter(quote => Math.abs(quote.strike / data.spot - 1) <= 0.05);
  const callIv = mean(nearAtm.filter(quote => quote.right === "CALL").map(quote => normalizedIv(quote.impliedVolatility)).filter((value): value is number => Boolean(value)));
  const putIv = mean(nearAtm.filter(quote => quote.right === "PUT").map(quote => normalizedIv(quote.impliedVolatility)).filter((value): value is number => Boolean(value)));
  const surface = buildSurface(data, liquid);
  const atmIvs = surface.map(slice => Math.sqrt(Math.max(0, sviVariance(0, slice.parameters)) / (slice.dte / 365)));
  const termStructureSlope = atmIvs.length > 1 ? (atmIvs.at(-1)! - atmIvs[0]) * 100 : undefined;
  const historicalVol = data.bars.length > 10 ? std(data.bars.slice(1).map((bar, index) => Math.log(bar.close / data.bars[index].close))) * Math.sqrt(252) : 0;
  const atmIv = atmIvs[0] || mean([callIv, putIv].filter(Boolean));
  const qualityGates: string[] = [];
  if (valid.length < 20) qualityGates.push("MINIMUM_CHAIN_DEPTH");
  if (liquid.length / Math.max(valid.length, 1) < 0.35) qualityGates.push("LOW_LIQUIDITY");
  if (quoted.length / Math.max(valid.length, 1) < 0.8) qualityGates.push("INCOMPLETE_BID_ASK");
  if (stale.length / Math.max(valid.length, 1) > 0.1) qualityGates.push("STALE_QUOTES");
  if (!surface.length) qualityGates.push("SURFACE_NOT_CALIBRATED");
  const rnd = buildRiskNeutralDistribution(data, liquid);
  if (!rnd.points.length) qualityGates.push("RND_NOT_AVAILABLE");
  if (missingModelMetrics && valid.some(quote => normalizedIv(quote.impliedVolatility))) qualityGates.push("MODEL_DERIVED_IV_GREEKS");
  if ((data.delayedMinutes || 0) >= 60) qualityGates.push("DELAYED_EOD_DATA");
  return {
    status: valid.length < 10 ? "UNAVAILABLE" : qualityGates.length ? "DEGRADED" : "READY",
    provider: data.provider,
    asOf: data.asOf,
    chainContracts: valid.length,
    liquidContracts: liquid.length,
    quoteCoveragePercent: round(quoted.length / Math.max(valid.length, 1) * 100, 1),
    staleQuotePercent: round(stale.length / Math.max(valid.length, 1) * 100, 1),
    volumePutCallRatio: callVolume ? round(putVolume / callVolume, 3) : undefined,
    openInterestPutCallRatio: callOi ? round(putOi / callOi, 3) : undefined,
    ivPutCallSkew: callIv && putIv ? round((putIv - callIv) * 100, 2) : undefined,
    atmIv: atmIv ? round(atmIv * 100, 2) : undefined,
    termStructureSlope: termStructureSlope === undefined ? undefined : round(termStructureSlope, 2),
    ivCrushEstimate: atmIv && historicalVol ? round(Math.max(0, atmIv - historicalVol) * 100, 2) : undefined,
    surface,
    rnd,
    momentum: momentumAnalytics(data.bars),
    jumpModel: calibrateJumpModel(data.historicalEarningsMoves),
    qualityGates,
  };
}

export function calculatePortfolioRisk(positions: PortfolioOptionPosition[], benchmarkPrice = 100): PortfolioRiskResult {
  const scenarios = [-0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15].flatMap(underlyingShock => [-0.3, 0, 0.3].map(volatilityShock => {
    const pnl = positions.reduce((sum, position) => {
      const multiplier = position.multiplier ?? 100;
      const priceMove = position.underlyingPrice * underlyingShock;
      return sum + position.quantity * multiplier * (position.delta * priceMove + 0.5 * position.gamma * priceMove ** 2 + position.vega * volatilityShock * 100 + position.theta);
    }, 0);
    return { underlyingShock: round(underlyingShock * 100, 0), volatilityShock: round(volatilityShock * 100, 0), pnl: round(pnl, 0) };
  }));
  const marketValue = positions.reduce((sum, position) => sum + position.marketValue, 0);
  const exposures = positions.map(position => Math.abs(position.marketValue));
  const concentrationPercent = exposures.length ? Math.max(...exposures) / Math.max(exposures.reduce((sum, value) => sum + value, 0), 1) * 100 : 0;
  const betaWeightedDelta = positions.reduce((sum, position) => sum + position.delta * position.quantity * (position.multiplier ?? 100) * (position.beta ?? 1) * position.underlyingPrice / benchmarkPrice, 0);
  const warnings: string[] = [];
  if (concentrationPercent > 35) warnings.push("POSITION_CONCENTRATION");
  if (Math.abs(betaWeightedDelta) > Math.max(Math.abs(marketValue) / benchmarkPrice * 0.7, 100)) warnings.push("BETA_DELTA_LIMIT");
  if (Math.min(...scenarios.map(scenario => scenario.pnl)) < -Math.max(Math.abs(marketValue) * 0.2, 500)) warnings.push("STRESS_LOSS_LIMIT");
  return {
    betaWeightedDelta: round(betaWeightedDelta, 2),
    netGamma: round(positions.reduce((sum, position) => sum + position.gamma * position.quantity * (position.multiplier ?? 100), 0), 3),
    netVega: round(positions.reduce((sum, position) => sum + position.vega * position.quantity * (position.multiplier ?? 100), 0), 2),
    dailyTheta: round(positions.reduce((sum, position) => sum + position.theta * position.quantity * (position.multiplier ?? 100), 0), 2),
    marketValue: round(marketValue, 2),
    worstStressLoss: round(Math.abs(Math.min(...scenarios.map(scenario => scenario.pnl))), 0),
    concentrationPercent: round(concentrationPercent, 1),
    scenarios,
    warnings,
  };
}
