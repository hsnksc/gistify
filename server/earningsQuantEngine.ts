import type {
  EarningsEvent,
  EarningsQuantOverview,
  MacroData,
  QuantAlert,
  QuantBias,
  QuantOptionLeg,
  Strategy,
  StrategyIntelligence,
  StrategyType,
} from "../shared/earnings";
import type { CanonicalEarningsMarketData } from "../shared/optionsAnalytics";
import { analyzeAdvancedOptions, enrichOptionChain } from "./optionsAdvancedEngine";

export interface DailyMarketSnapshot {
  ticker: string;
  asOf: string;
  price: number;
  previousClose?: number;
  closes?: number[];
  source: "fmp" | "report";
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const round = (value: number, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

function numberFrom(value?: string) {
  if (!value) return undefined;
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return undefined;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalCdf(x: number) {
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * z);
  const erf = 1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) *
      Math.exp(-z * z);
  return 0.5 * (1 + sign * erf);
}

function blackScholes(
  spot: number,
  strike: number,
  dte: number,
  ivPercent: number,
  type: "CALL" | "PUT",
  rate: number
) {
  const t = Math.max(dte, 1) / 365;
  const sigma = Math.max(ivPercent, 1) / 100;
  const rootT = Math.sqrt(t);
  const d1 = (Math.log(spot / strike) + (rate + sigma ** 2 / 2) * t) / (sigma * rootT);
  const d2 = d1 - sigma * rootT;
  const call = spot * normalCdf(d1) - strike * Math.exp(-rate * t) * normalCdf(d2);
  const put = strike * Math.exp(-rate * t) * normalCdf(-d2) - spot * normalCdf(-d1);
  return Math.max(0.01, type === "CALL" ? call : put);
}

function calculateRsi(closes: number[], period = 14) {
  if (closes.length <= period) return undefined;
  let gains = 0;
  let losses = 0;
  for (let index = closes.length - period; index < closes.length; index += 1) {
    const change = closes[index] - closes[index - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }
  if (losses === 0) return 100;
  return round(100 - 100 / (1 + gains / losses), 1);
}

function calculateRealizedVol(closes: number[]) {
  if (closes.length < 3) return undefined;
  const returns = closes.slice(1).map((close, index) => Math.log(close / closes[index]));
  const mean = returns.reduce((sum, item) => sum + item, 0) / returns.length;
  const variance = returns.reduce((sum, item) => sum + (item - mean) ** 2, 0) / Math.max(returns.length - 1, 1);
  return round(Math.sqrt(variance) * Math.sqrt(252) * 100, 1);
}

function returnFor(closes: number[], periods: number) {
  if (closes.length <= periods) return undefined;
  return round(((closes.at(-1)! / closes[closes.length - 1 - periods]) - 1) * 100, 2);
}

function dateToDte(date?: string) {
  if (!date) return 30;
  const parsed = new Date(`${date}T20:00:00Z`).getTime();
  if (!Number.isFinite(parsed)) return 30;
  return Math.max(1, Math.ceil((parsed - Date.now()) / 86_400_000));
}

function isUpcomingEvent(date?: string) {
  if (!date) return false;
  const parsed = new Date(`${date}T20:00:00Z`).getTime();
  return Number.isFinite(parsed) && parsed >= Date.now();
}

function findEvent(events: EarningsEvent[], ticker: string) {
  return events.find(event => event.ticker === ticker);
}

function chooseStrategy(bias: QuantBias, ivRank: number, dte: number): StrategyType {
  if (dte >= 7 && dte <= 20 && ivRank < 55) return "Calendar Spread";
  if (bias === "neutral") return ivRank >= 45 ? "Iron Condor" : "Long Straddle";
  if (bias === "bullish") return ivRank >= 60 ? "Bull Put Spread" : "Bull Call Spread";
  return ivRank >= 60 ? "Bear Call Spread" : "Bear Put Spread";
}

function buildLegs(
  strategy: StrategyType,
  spot: number,
  expectedMove: number,
  dte: number,
  modeledIv: number,
  riskFreeRate: number
): QuantOptionLeg[] {
  const step = Math.max(0.5, spot < 50 ? 1 : spot < 150 ? 2.5 : 5);
  const strike = (raw: number) => round(Math.max(step, Math.round(raw / step) * step), 2);
  const lower = strike(spot - expectedMove);
  const upper = strike(spot + expectedMove);
  const wing = Math.max(step, strike(expectedMove * 0.35));
  const make = (action: "BUY" | "SELL", optionType: "CALL" | "PUT", rawStrike: number, quantity = 1, legDte = dte) => {
    const selectedStrike = strike(rawStrike);
    return {
      action,
      optionType,
      quantity,
      strike: selectedStrike,
      dte: legDte,
      modeledPremium: round(blackScholes(spot, selectedStrike, legDte, modeledIv, optionType, riskFreeRate), 2),
    } satisfies QuantOptionLeg;
  };

  switch (strategy) {
    case "Iron Condor":
      return [make("BUY", "PUT", lower - wing), make("SELL", "PUT", lower), make("SELL", "CALL", upper), make("BUY", "CALL", upper + wing)];
    case "Bull Put Spread":
      return [make("BUY", "PUT", lower - wing), make("SELL", "PUT", lower)];
    case "Bear Call Spread":
      return [make("SELL", "CALL", upper), make("BUY", "CALL", upper + wing)];
    case "Bull Call Spread":
      return [make("BUY", "CALL", spot), make("SELL", "CALL", upper)];
    case "Bear Put Spread":
      return [make("BUY", "PUT", spot), make("SELL", "PUT", lower)];
    case "Long Straddle":
      return [make("BUY", "CALL", spot), make("BUY", "PUT", spot)];
    case "Calendar Spread":
      return [make("SELL", "CALL", spot, 1, Math.max(7, Math.min(dte, 14))), make("BUY", "CALL", spot, 1, Math.max(30, dte + 21))];
    default:
      return [make("BUY", "CALL", spot)];
  }
}

function alignLegsToChain(
  legs: QuantOptionLeg[],
  data?: CanonicalEarningsMarketData
) {
  if (!data?.optionChain.length) return legs;
  return legs.map(leg => {
    const candidates = data.optionChain.filter(quote => quote.right === leg.optionType && quote.ask >= quote.bid && quote.ask > 0);
    const quote = candidates.sort((left, right) => {
      const leftDte = dateToDte(left.expiration);
      const rightDte = dateToDte(right.expiration);
      return Math.abs(leftDte - leg.dte) - Math.abs(rightDte - leg.dte)
        || Math.abs(left.strike - leg.strike) - Math.abs(right.strike - leg.strike);
    })[0];
    if (!quote) return leg;
    const executablePremium = leg.action === "BUY" ? quote.ask : quote.bid;
    return { ...leg, strike: quote.strike, dte: dateToDte(quote.expiration), modeledPremium: round(executablePremium, 2) };
  });
}

function chainGreeks(legs: QuantOptionLeg[], data?: CanonicalEarningsMarketData) {
  if (!data?.optionChain.length) return undefined;
  let matched = 0;
  const totals = { delta: 0, gamma: 0, theta: 0, vega: 0 };
  for (const leg of legs) {
    const quote = data.optionChain.find(item => item.right === leg.optionType && item.strike === leg.strike && dateToDte(item.expiration) === leg.dte);
    if (!quote || [quote.delta, quote.gamma, quote.theta, quote.vega].some(value => value === undefined)) continue;
    const direction = leg.action === "BUY" ? 1 : -1;
    totals.delta += direction * quote.delta! * leg.quantity;
    totals.gamma += direction * quote.gamma! * leg.quantity;
    totals.theta += direction * quote.theta! * leg.quantity;
    totals.vega += direction * quote.vega! * leg.quantity;
    matched += 1;
  }
  return matched === legs.length ? totals : undefined;
}

function payoffMetrics(strategy: StrategyType, legs: QuantOptionLeg[], spot: number) {
  const netDebit = legs.reduce((sum, leg) => {
    const signed = leg.action === "BUY" ? leg.modeledPremium : -leg.modeledPremium;
    return sum + signed * leg.quantity;
  }, 0);
  const prices = Array.from({ length: 401 }, (_, index) => spot * (0.35 + index * 0.00325));
  const pnls = prices.map(price => legs.reduce((total, leg) => {
    const intrinsic = leg.optionType === "CALL" ? Math.max(0, price - leg.strike) : Math.max(0, leg.strike - price);
    const direction = leg.action === "BUY" ? 1 : -1;
    return total + direction * (intrinsic - leg.modeledPremium) * leg.quantity * 100;
  }, 0));
  const maxProfit = round(Math.max(...pnls), 0);
  const maxLoss = round(Math.abs(Math.min(...pnls)), 0);
  const breakevens: number[] = [];
  for (let index = 1; index < pnls.length; index += 1) {
    if ((pnls[index - 1] <= 0 && pnls[index] > 0) || (pnls[index - 1] >= 0 && pnls[index] < 0)) {
      breakevens.push(round(prices[index], 2));
    }
  }
  const definedRisk = !["Long Call", "Long Put", "Ratio Spread"].includes(strategy);
  return {
    maxProfit,
    maxLoss: definedRisk ? maxLoss : Math.max(maxLoss, round(Math.abs(netDebit) * 100, 0)),
    breakevens: breakevens.slice(0, 2),
    netDebit,
  };
}

function strategyPnlAtPrice(
  legs: QuantOptionLeg[],
  terminalPrice: number,
  elapsedDays = Number.POSITIVE_INFINITY,
  remainingIv = 0,
  riskFreeRate = 0
) {
  return legs.reduce((total, leg) => {
    const intrinsic = leg.optionType === "CALL"
      ? Math.max(0, terminalPrice - leg.strike)
      : Math.max(0, leg.strike - terminalPrice);
    const remainingDte = Math.max(0, leg.dte - elapsedDays);
    const modeledValue = remainingDte > 0
      ? blackScholes(terminalPrice, leg.strike, remainingDte, remainingIv, leg.optionType, riskFreeRate)
      : intrinsic;
    const direction = leg.action === "BUY" ? 1 : -1;
    return total + direction * (modeledValue - leg.modeledPremium) * leg.quantity * 100;
  }, 0);
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 1;
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_296;
  };
}

function estimateRoundTripSlippage(
  legs: QuantOptionLeg[],
  spot: number,
  ivRank: number
) {
  return round(legs.reduce((total, leg) => {
    const distance = spot > 0 ? Math.abs(leg.strike - spot) / spot : 0;
    const spreadRate = clamp(0.025 + ivRank / 2500 + distance * 0.18, 0.03, 0.18);
    const modeledSpread = Math.max(0.03, leg.modeledPremium * spreadRate);
    return total + modeledSpread * leg.quantity * 100;
  }, 0), 0);
}

function simulateScheduledJumpDistribution(options: {
  ticker: string;
  legs: QuantOptionLeg[];
  spot: number;
  tradeDte: number;
  eventInsideHorizon: boolean;
  structuralVolatility: number;
  eventJumpVolatility: number;
  jumpMean: number;
  riskFreeRate: number;
  slippage: number;
  jumpIntensity?: number;
  paths?: number;
}) {
  const paths = options.paths || 12_000;
  const random = seededRandom(hashSeed(
    `${options.ticker}:${options.tradeDte}:${options.spot.toFixed(2)}:${options.eventJumpVolatility.toFixed(4)}`
  ));
  const t = Math.max(options.tradeDte, 1) / 365;
  const diffusionSigma = Math.max(options.structuralVolatility, 1) / 100;
  const jumpSigma = options.eventInsideHorizon ? options.eventJumpVolatility / 100 : 0;
  const pnls: number[] = [];
  let wins = 0;
  let grossTotal = 0;
  let winTotal = 0;
  let lossTotal = 0;
  let winCount = 0;
  let lossCount = 0;

  for (let index = 0; index < paths; index += 1) {
    const u1 = Math.max(random(), 1e-12);
    const u2 = random();
    const radius = Math.sqrt(-2 * Math.log(u1));
    const zDiffusion = radius * Math.cos(2 * Math.PI * u2);
    const zJump = radius * Math.sin(2 * Math.PI * u2);
    const diffusion = (options.riskFreeRate - 0.5 * diffusionSigma ** 2) * t
      + diffusionSigma * Math.sqrt(t) * zDiffusion;
    let poissonJumps = 0;
    if (options.jumpIntensity && options.jumpIntensity > 0) {
      const limit = Math.exp(-options.jumpIntensity * t);
      let product = 1;
      while (product > limit && poissonJumps < 8) {
        product *= Math.max(random(), 1e-12);
        if (product > limit) poissonJumps += 1;
      }
    }
    let randomJumps = 0;
    for (let jump = 0; jump < poissonJumps; jump += 1) {
      const ju1 = Math.max(random(), 1e-12);
      const ju2 = random();
      randomJumps += options.jumpMean - 0.5 * jumpSigma ** 2
        + jumpSigma * Math.sqrt(-2 * Math.log(ju1)) * Math.cos(2 * Math.PI * ju2);
    }
    const scheduledJump = options.eventInsideHorizon
      ? options.jumpMean - 0.5 * jumpSigma ** 2 + jumpSigma * zJump
      : 0;
    const terminalPrice = options.spot * Math.exp(diffusion + scheduledJump + randomJumps);
    const pnl = strategyPnlAtPrice(
      options.legs,
      terminalPrice,
      options.tradeDte,
      options.structuralVolatility,
      options.riskFreeRate
    );
    pnls.push(pnl);
    grossTotal += pnl;
    if (pnl > 0) {
      wins += 1;
      winCount += 1;
      winTotal += pnl;
    } else {
      lossCount += 1;
      lossTotal += Math.abs(pnl);
    }
  }

  pnls.sort((left, right) => left - right);
  const tailCount = Math.max(1, Math.floor(paths * 0.05));
  const cvar95 = Math.abs(pnls.slice(0, tailCount).reduce((sum, pnl) => sum + pnl, 0) / tailCount);
  const expectedValue = grossTotal / paths;
  return {
    paths,
    probabilityOfProfit: wins / paths,
    expectedValue,
    expectedValueAfterCosts: expectedValue - options.slippage,
    averageWin: winCount ? winTotal / winCount : 0,
    averageLoss: lossCount ? lossTotal / lossCount : 0,
    cvar95,
  };
}

function buildStressScenarios(
  legs: QuantOptionLeg[],
  spot: number,
  elapsedDays: number,
  remainingIv: number,
  riskFreeRate: number
) {
  const stressScenarios = Array.from({ length: 11 }, (_, index) => {
    const shockPercent = -15 + index * 3;
    const pnl = strategyPnlAtPrice(
      legs,
      spot * (1 + shockPercent / 100),
      elapsedDays,
      remainingIv,
      riskFreeRate
    );
    return { shockPercent, pnl: round(pnl, 0) };
  });
  return {
    stressScenarios,
    stressLoss: round(Math.abs(Math.min(...stressScenarios.map(item => item.pnl))), 0),
  };
}

export function buildStrategyIntelligence(
  strategy: Strategy,
  events: EarningsEvent[],
  macro: MacroData,
  snapshot?: DailyMarketSnapshot,
  advancedData?: CanonicalEarningsMarketData
): StrategyIntelligence {
  const marketData = advancedData ? { ...advancedData, optionChain: enrichOptionChain(advancedData) } : undefined;
  const advanced = marketData ? analyzeAdvancedOptions(marketData) : undefined;
  const reportSpot = numberFrom(strategy.price) || 0;
  const spot = marketData?.spot || snapshot?.price || reportSpot;
  const advancedCloses = marketData?.bars.map(bar => bar.close).filter(value => value > 0) || [];
  const closes = advancedCloses.length ? advancedCloses : snapshot?.closes?.filter(value => value > 0) || [];
  const previousClose = advancedCloses.length > 1 ? advancedCloses.at(-2) : snapshot?.previousClose || (closes.length > 1 ? closes.at(-2) : undefined);
  const change1d = previousClose && spot ? round(((spot / previousClose) - 1) * 100, 2) : undefined;
  const return5d = returnFor(closes, 5);
  const return20d = returnFor(closes, 20);
  const rsi14 = calculateRsi(closes);
  const realizedVol20d = calculateRealizedVol(closes.slice(-21));
  const chainCallPutRatio = advanced?.volumePutCallRatio && advanced.volumePutCallRatio > 0
    ? 1 / advanced.volumePutCallRatio
    : undefined;
  const cpr = chainCallPutRatio ?? numberFrom(strategy.cpr);
  const ivRank = clamp(numberFrom(strategy.ivRank) ?? 50, 0, 100);
  const earningsEvent = findEvent(events, strategy.ticker);
  const dte = dateToDte(earningsEvent?.date);
  const eventIsUpcoming = isUpcomingEvent(earningsEvent?.date);
  const tradeDte = Math.min(Math.max(dte, 1), 45);
  const modeledIv = round(clamp(advanced?.atmIv ?? (realizedVol20d ? realizedVol20d * (0.85 + ivRank / 180) : 18 + ivRank * 0.62), 15, 180), 1);
  const structuralVolatility = round(clamp(realizedVol20d ?? modeledIv * 0.72, 10, modeledIv), 1);
  const eventInsideHorizon = Boolean(eventIsUpcoming && dte <= 45);
  const horizonYears = tradeDte / 365;
  const totalStd = modeledIv / 100 * Math.sqrt(horizonYears);
  const diffusionStd = structuralVolatility / 100 * Math.sqrt(horizonYears);
  const calibratedJumpVolatility = advanced?.jumpModel.calibrated ? advanced.jumpModel.jumpVolatility * 100 : undefined;
  const eventJumpVolatility = eventInsideHorizon
    ? round(calibratedJumpVolatility ?? Math.sqrt(Math.max(totalStd ** 2 - diffusionStd ** 2, (totalStd * 0.35) ** 2)) * 100, 1)
    : 0;
  const expectedMoveDollar = round(spot * (modeledIv / 100) * Math.sqrt(tradeDte / 365), 2);
  const expectedMovePercent = spot ? round(expectedMoveDollar / spot * 100, 1) : 0;

  const flowScore = cpr === undefined ? 0 : cpr < 0.8 ? 22 : cpr < 0.95 ? 10 : cpr > 1.25 ? -22 : cpr > 1.05 ? -10 : 0;
  const priceScore = clamp((change1d || 0) * 5 + (return5d || 0) * 2 + (return20d || 0) * 0.65, -45, 45);
  const rsiScore = rsi14 === undefined ? 0 : clamp((rsi14 - 50) * 0.65, -18, 18);
  const macroVix = numberFrom(macro.vix) || 20;
  const macroPenalty = macroVix >= 30 ? 8 : macroVix >= 24 ? 4 : 0;
  const riskFreeRate = clamp(marketData?.riskFreeRate ?? (numberFrom(macro.tenYearYield) ?? 4) / 100, 0, 0.15);
  const compositeScore = round(clamp(priceScore + flowScore + rsiScore, -100, 100), 0);
  const bias: QuantBias = compositeScore >= 18 ? "bullish" : compositeScore <= -18 ? "bearish" : "neutral";
  const selected = chooseStrategy(bias, ivRank, dte);
  const legs = alignLegsToChain(buildLegs(selected, spot, expectedMoveDollar, Math.max(tradeDte, 7), modeledIv, riskFreeRate), marketData);
  const actualGreeks = chainGreeks(legs, marketData);
  const payoff = payoffMetrics(selected, legs, spot);
  const isCredit = payoff.netDebit < 0;
  const estimatedSlippage = estimateRoundTripSlippage(legs, spot, ivRank);
  const simulation = simulateScheduledJumpDistribution({
    ticker: strategy.ticker,
    legs,
    spot,
    tradeDte,
    eventInsideHorizon,
    structuralVolatility,
    eventJumpVolatility,
    jumpMean: advanced?.jumpModel.calibrated ? advanced.jumpModel.jumpMean : clamp(compositeScore / 100 * eventJumpVolatility / 100 * 0.22, -0.04, 0.04),
    riskFreeRate,
    slippage: estimatedSlippage,
    jumpIntensity: advanced?.jumpModel.calibrated ? advanced.jumpModel.annualIntensity : undefined,
    paths: advanced?.status === "READY" ? 50_000 : 12_000,
  });
  const probabilityOfProfit = round(simulation.probabilityOfProfit * 100, 1);
  const rawKelly = simulation.averageLoss > 0 && simulation.averageWin > 0
    ? simulation.probabilityOfProfit
      - ((1 - simulation.probabilityOfProfit) / (simulation.averageWin / simulation.averageLoss))
    : 0;
  const kellyMultiplier = eventJumpVolatility >= 10 || dte <= 3 ? 0.1 : 0.25;
  const kellyFraction = round(clamp(rawKelly * kellyMultiplier, 0, 0.05) * 100, 2);
  const stress = buildStressScenarios(legs, spot, tradeDte, structuralVolatility, riskFreeRate);
  const width = legs.length > 1 ? Math.max(...legs.map(leg => leg.strike)) - Math.min(...legs.map(leg => leg.strike)) : payoff.maxLoss / 100;
  const regTMargin = round(isCredit ? Math.max(payoff.maxLoss, width * 100 - Math.abs(payoff.netDebit) * 100) : payoff.maxLoss, 0);
  const jumpPenalty = clamp(eventJumpVolatility * 0.6, 0, 12);
  const hasLiveUnderlying = Boolean(marketData || snapshot?.source === "fmp");
  const isDelayedEod = Boolean(marketData && (marketData.delayedMinutes || 0) >= 60);
  const advancedBlocked = Boolean(advanced && (advanced.status === "UNAVAILABLE" || (marketData?.delayedMinutes || 0) >= 60));
  const advancedWatch = Boolean(advanced && advanced.status === "DEGRADED");
  const confidence = round(clamp(52 + Math.abs(compositeScore) * 0.35 + (hasLiveUnderlying ? 12 : 0) + (advanced?.status === "READY" ? 8 : 0) - macroPenalty - jumpPenalty, 35, 95), 0);
  const tradeStatus = !hasLiveUnderlying || advancedBlocked || !eventIsUpcoming || simulation.expectedValueAfterCosts <= 0 || dte <= 1
    ? "BLOCKED"
    : advancedWatch || dte <= 3 || eventJumpVolatility >= 10 || simulation.expectedValueAfterCosts / Math.max(payoff.maxLoss, 1) < 0.03
      ? "WATCH"
      : "TRADE";
  const alerts: QuantAlert[] = [];

  if (Math.abs(change1d || 0) >= 4) alerts.push({ severity: "critical", title: "Günlük fiyat şoku", detail: `${strategy.ticker} bir günde %${Math.abs(change1d || 0).toFixed(1)} hareket etti. Eski strike ve yön varsayımı geçersiz olabilir.`, action: "Yeni zincirle fiyatları doğrula; market emir kullanma ve pozisyon boyutunu yarıya indir." });
  if (!eventIsUpcoming) alerts.push({ severity: "critical", title: "Aktif earnings etkinliği yok", detail: earningsEvent?.date ? `${earningsEvent.date} tarihli etkinlik geçmiş durumda.` : "Ticker için doğrulanmış gelecek earnings tarihi bulunamadı.", action: "Yeni tarih doğrulanana kadar earnings işlemini bloke et." });
  if (rsi14 !== undefined && (rsi14 >= 72 || rsi14 <= 28)) alerts.push({ severity: "warning", title: "Momentum aşırılığı", detail: `RSI(14) ${rsi14}; geri dönüş ve gap riski yükseldi.`, action: "Çıplak yön riski yerine tanımlı-risk spread kullan." });
  if (dte <= 3) alerts.push({ severity: "critical", title: "Earnings gamma penceresi", detail: `Etkinliğe ${dte} gün kaldı; gamma ve IV crush riski hızlanıyor.`, action: "Yeni uzun premium kovalamak yerine limit emir, küçük boyut ve earnings öncesi çıkış uygula." });
  if (ivRank >= 80) alerts.push({ severity: "warning", title: "Aşırı pahalı volatilite", detail: `IV Rank ${ivRank}; long premium için yüksek hurdle var.`, action: "Tanımlı-risk kredi yapısını ve %50 kârda çıkışı tercih et." });
  if (eventJumpVolatility >= 10) alerts.push({ severity: "warning", title: "Earnings sıçrama riski", detail: `Planlı-event jump volatilitesi %${eventJumpVolatility}; BSM sürekli-yol varsayımı yetersiz kalabilir.`, action: "Kelly çarpanı 0.10'a indirildi; stres kaybı ve CVaR limitini doğrula." });
  if (simulation.expectedValueAfterCosts <= 0) alerts.push({ severity: "critical", title: "Maliyet sonrası negatif EV", detail: `Model EV $${round(simulation.expectedValue, 0)}, tahmini round-trip slippage $${estimatedSlippage}.`, action: "İşlemi bloke et; gerçek bid/ask ile yeniden fiyatlamadan emir üretme." });
  if (!advanced) alerts.push({ severity: "info", title: "Opsiyon zinciri doğrulaması gerekli", detail: "Kurumsal opsiyon veri sağlayıcısı bağlı değil; yüzey, RND ve zincir likiditesi henüz hesaplanamıyor.", action: "OPTIONS_DATA_PROVIDER_URL ve OPTIONS_DATA_API_KEY ile sağlayıcıyı bağla." });
  if (advanced?.qualityGates.length) alerts.push({ severity: advanced.status === "UNAVAILABLE" ? "critical" : "warning", title: "Opsiyon veri kalite kapısı", detail: advanced.qualityGates.join(", "), action: "Eksik/likit olmayan zincir düzelmeden işlemi yükseltme." });
  if ((marketData?.delayedMinutes || 0) >= 60) alerts.push({ severity: "critical", title: "Gecikmeli EOD opsiyon verisi", detail: `${marketData?.provider} verisi yaklaşık ${Math.round((marketData?.delayedMinutes || 0) / 60)} saat gecikmeli.`, action: "Araştırma ve backtest için kullan; canlı emir kararı için real-time NBBO planına yükselt." });

  const changed = Boolean(strategy.type && strategy.type !== selected);
  const flowSignal = cpr === undefined ? "CPR yok" : cpr < 0.9 ? "Call ağırlıklı" : cpr > 1.1 ? "Put ağırlıklı" : "Dengeli";
  const rationale = [
    `Bileşik skor ${compositeScore}/100: fiyat momentumu ${round(priceScore, 0)}, opsiyon akışı ${flowScore}, RSI katkısı ${round(rsiScore, 0)}.`,
    `${flowSignal}; Call/Put oranı ${cpr ?? "—"}. 1 altı call, 1 üstü put ağırlığını gösterir.`,
    `IV Rank ${ivRank} ve ${dte} DTE, ${selected} için risk-tanımlı rejim seçimini destekliyor.`,
    `${simulation.paths.toLocaleString("tr-TR")} yollu planlı-sıçrama simülasyonu POP %${probabilityOfProfit}, maliyet sonrası EV $${round(simulation.expectedValueAfterCosts, 0)} üretti.`,
    `Yapısal volatilite %${structuralVolatility}; earnings jump volatilitesi %${eventJumpVolatility}; %95 CVaR $${round(simulation.cvar95, 0)}.`,
  ];
  if (changed) rationale.push(`Rapor stratejisi ${strategy.type} idi; güncel sinyaller ${selected} yapısına geçiş üretti.`);

  return {
    asOf: marketData?.asOf || snapshot?.asOf || new Date().toISOString(),
    dataQuality: isDelayedEod ? "eod" : advanced?.status === "READY" ? "live" : hasLiveUnderlying ? "mixed" : "report",
    sourceNote: advanced ? `${advanced.provider} zinciri + SVI/RND + kalibre jump Monte Carlo` : snapshot?.source === "fmp" ? "FMP günlük fiyat geçmişi + rapor CPR/IV + planlı-sıçrama Monte Carlo proxy" : "Rapor fiyatı + planlı-sıçrama kantitatif modeli (canlı zincir değildir)",
    market: { spot, previousClose, change1d, return5d, return20d, rsi14, realizedVol20d, momentumScore: round(priceScore + rsiScore, 0), momentumLabel: bias === "bullish" ? "Pozitif" : bias === "bearish" ? "Negatif" : "Dengeli" },
    options: {
      advanced,
      callPutRatio: cpr,
      flowSignal,
      ivRank,
      modeledIv,
      expectedMoveDollar,
      expectedMovePercent,
      pricingModel: advanced?.jumpModel.calibrated ? "CHAIN_CALIBRATED_JUMP_MC" : "SCHEDULED_JUMP_MC_PROXY",
      simulationPaths: simulation.paths,
      riskFreeRate: round(riskFreeRate * 100, 2),
      structuralVolatility,
      eventJumpVolatility,
      dte,
      probabilityOfProfit,
      expectedValue: round(simulation.expectedValue, 0),
      expectedValueAfterCosts: round(simulation.expectedValueAfterCosts, 0),
      estimatedSlippage,
      cvar95: round(simulation.cvar95, 0),
      stressLoss: stress.stressLoss,
      stressScenarios: stress.stressScenarios,
      maxProfit: payoff.maxProfit,
      maxLoss: payoff.maxLoss,
      returnOnRisk: payoff.maxLoss > 0 ? round(payoff.maxProfit / payoff.maxLoss * 100, 1) : 0,
      breakevens: payoff.breakevens,
      delta: round(actualGreeks?.delta ?? compositeScore / 250, 2),
      gamma: round(actualGreeks?.gamma ?? (1 / Math.max(dte, 2)) * (selected.includes("Long") ? 0.12 : -0.06), 3),
      theta: round(actualGreeks?.theta ?? (isCredit ? 1 : -1) * Math.max(0.01, Math.abs(payoff.netDebit) / Math.max(dte, 1)), 2),
      vega: round(actualGreeks?.vega ?? (selected === "Calendar Spread" || selected.includes("Long") ? 1 : -1) * spot * Math.sqrt(Math.max(dte, 1) / 365) * 0.01, 2),
      regTMargin,
      kellyFraction: simulation.expectedValueAfterCosts > 0 ? kellyFraction : 0,
      kellyMultiplier,
    },
    decision: {
      strategy: selected,
      previousStrategy: strategy.type,
      changed,
      bias,
      confidence,
      compositeScore,
      tradeStatus,
      entryRule: tradeStatus === "BLOCKED" ? "İşlem bloke: canlı zincir veya maliyet sonrası pozitif EV doğrulaması gerekli." : dte <= 3 ? "Yeni giriş yok; yalnızca risk azalt / limit emir." : "Bid/ask ≤ %5, yeterli OI ve maliyet sonrası pozitif EV ile kademeli limit emir.",
      exitRule: isCredit ? "%50 maksimum kârda kapat; 21 DTE veya 2× kredi zararında çık/roll." : "Earnings IV peak öncesi kâr al; premiumda %35 zarar veya tez bozulmasında kapat.",
      rationale,
      legs,
    },
    alerts,
  };
}

export function buildQuantOverview(strategies: Strategy[]): EarningsQuantOverview {
  const intelligence = strategies.map(item => item.intelligence).filter(Boolean) as StrategyIntelligence[];
  return {
    asOf: new Date().toISOString(),
    marketDataCoverage: intelligence.length ? round(intelligence.filter(item => item.dataQuality !== "report").length / intelligence.length * 100, 0) : 0,
    liveCoverage: intelligence.length ? round(intelligence.filter(item => item.dataQuality === "live").length / intelligence.length * 100, 0) : 0,
    eodCoverage: intelligence.length ? round(intelligence.filter(item => item.dataQuality === "eod").length / intelligence.length * 100, 0) : 0,
    bullish: intelligence.filter(item => item.decision.bias === "bullish").length,
    neutral: intelligence.filter(item => item.decision.bias === "neutral").length,
    bearish: intelligence.filter(item => item.decision.bias === "bearish").length,
    strategyChanges: intelligence.filter(item => item.decision.changed).length,
    criticalAlerts: intelligence.flatMap(item => item.alerts).filter(alert => alert.severity === "critical").length,
    methodology: "Momentum + gerçek put/call akışı + IV/DTE; zincir varsa SVI/RND, 50.000 yollu kalibre jump MC ve gerçek bid/ask; fallback'te 12.000 yol, ±%15 stres ve maliyet sonrası EV/Kelly.",
  };
}

export async function loadDailyMarketSnapshots(tickers: string[]): Promise<Map<string, DailyMarketSnapshot>> {
  const apiKey = process.env.FMP_API_KEY?.trim();
  const output = new Map<string, DailyMarketSnapshot>();
  if (!apiKey) return output;

  const unique = Array.from(new Set(tickers.filter(Boolean))).slice(0, 12);
  await Promise.all(unique.map(async ticker => {
    try {
      const from = new Date(Date.now() - 70 * 86_400_000).toISOString().slice(0, 10);
      const url = new URL("https://financialmodelingprep.com/stable/historical-price-eod/full");
      url.searchParams.set("symbol", ticker);
      url.searchParams.set("from", from);
      url.searchParams.set("to", new Date().toISOString().slice(0, 10));
      url.searchParams.set("apikey", apiKey);
      const response = await fetch(url, { headers: { apikey: apiKey }, signal: AbortSignal.timeout(8000) });
      if (!response.ok) return;
      const payload = await response.json() as Array<{ date?: string; close?: number }> | { historical?: Array<{ date?: string; close?: number }> };
      const rows = Array.isArray(payload) ? payload : payload.historical || [];
      const normalized = rows.filter(row => Number(row.close) > 0).sort((a, b) => String(a.date).localeCompare(String(b.date)));
      if (normalized.length < 2) return;
      const closes = normalized.map(row => Number(row.close));
      output.set(ticker, { ticker, asOf: normalized.at(-1)?.date || new Date().toISOString(), price: closes.at(-1)!, previousClose: closes.at(-2), closes, source: "fmp" });
    } catch {
      // Per-ticker failure degrades to the report snapshot without breaking the workspace.
    }
  }));
  return output;
}
