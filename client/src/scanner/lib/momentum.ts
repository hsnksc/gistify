/**
 * NASDAQ Momentum Engine v4
 * 11 Faktörlü Skorlama + Confidence Score + Ranking Score + Explanation Engine
 *
 * Faz 1 Eklentileri:
 * - Confidence Score: Veri kalitesine dayalı ayrı güven skoru
 * - Ranking Score: momentum×0.55 + confidence×0.25 + pattern×0.10 + R/R×0.10
 * - Sanity Gate: NaN/Infinity/null engelleme
 * - Score Explanation: Her faktörün nedenini doğal dilde açıklama
 */

import { copy, type AppLanguage } from "@/lib/i18n";
import type { StockData } from "./yahooFinance";
import type { StockResult, ScoreExplanation, ConfidenceBreakdown, RankingInfo } from "@/scanner/types";
import { FACTOR_WEIGHTS, CONFIDENCE_WEIGHTS, RANKING_WEIGHTS, getFactorLabels, clamp100, confidenceLabel, dataQualityLabel } from "./scoreConfig";
import { SIGNAL_WEIGHTS } from "./signalModel";
import { sanityGate } from "./sanityGate";

const MIN_AVG_VOLUME_20D = 500_000;
const MIN_DOLLAR_VOLUME = 50_000_000;

import { getSector } from "./yahooFinance";

// ===================== Earnings Map =====================
const EARNINGS_TICKERS: string[] = [
  "AAPL", "MSFT", "AMZN", "GOOGL", "GOOG", "META", "NVDA", "TSLA", "AVGO",
  "NFLX", "AMD", "INTC", "QCOM", "AMGN", "INTU", "HON", "AMAT", "PYPL",
  "ADP", "ISRG", "SBUX", "GILD", "VRTX", "ADI", "REGN", "PANW", "MU",
  "SNPS", "LRCX", "KLAC", "ASML", "CDNS", "MELI", "ABNB", "DXCM", "PDD",
  "FTNT", "WDAY", "MRVL", "CRWD",
];

// ===================== Yardımcı Fonksiyonlar =====================
function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/** Linear interpolation between two points */
function lerp(x: number, x0: number, x1: number, y0: number, y1: number): number {
  if (x <= x0) return y0;
  if (x >= x1) return y1;
  return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
}

// ===================== RSI =====================
function calcRsi(prices: number[], period: number): number {
  if (prices.length < period + 1) return 50;
  const deltas = prices.slice(1).map((v, i) => v - prices[i]);
  const gains = deltas.map((d) => (d > 0 ? d : 0));
  const losses = deltas.map((d) => (d < 0 ? -d : 0));
  const avgGain = mean(gains.slice(-period));
  const avgLoss = mean(losses.slice(-period));
  if (avgLoss === 0) return 100;
  return clamp(100 - 100 / (1 + avgGain / avgLoss), 0, 100);
}

// ===================== ATR =====================
function calcAtr(h: number[], l: number[], c: number[], period: number): number {
  if (c.length < period + 1) return 0;
  const trs: number[] = [];
  for (let i = 1; i < c.length; i++) {
    trs.push(Math.max(h[i] - l[i], Math.abs(h[i] - c[i - 1]), Math.abs(l[i] - c[i - 1])));
  }
  return mean(trs.slice(-period));
}

// ===================== VWAP (30m intraday) + Normalize Slope =====================
function calcVwapIntraday(
  high: number[], low: number[], close: number[], volume: number[]
): { vwap: number; slope: number; normalizedSlope: number } {
  if (close.length === 0 || volume.reduce((a, b) => a + b, 0) === 0)
    return { vwap: 0, slope: 0, normalizedSlope: 0 };

  let cumVol = 0, cumTpVol = 0;
  const vwapValues: number[] = [];

  for (let i = 0; i < close.length; i++) {
    const tp = (high[i] + low[i] + close[i]) / 3;
    cumVol += volume[i];
    cumTpVol += tp * volume[i];
    vwapValues.push(cumTpVol / cumVol);
  }

  const finalVwap = vwapValues[vwapValues.length - 1];

  // Slope
  const recent = vwapValues.slice(-5);
  const n = recent.length;
  let slope = 0;
  if (n >= 2) {
    const xM = (n - 1) / 2, yM = mean(recent);
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) { num += (i - xM) * (recent[i] - yM); den += (i - xM) ** 2; }
    slope = den === 0 ? 0 : num / den;
  }

  // Normalize slope = slope / VWAP (oransal)
  const normalizedSlope = finalVwap > 0 ? slope / finalVwap : 0;

  return { vwap: finalVwap, slope, normalizedSlope };
}

// ===================== Price Structure =====================
function checkStructure(highs: number[], lows: number[], lookback = 10): number {
  if (highs.length < lookback + 2) return 50;
  const h = highs.slice(-lookback), l = lows.slice(-lookback);
  let hh = 0, hl = 0;
  for (let i = 1; i < h.length; i++) { if (h[i] > h[i - 1]) hh++; if (l[i] > l[i - 1]) hl++; }
  return ((hh / Math.max(h.length - 1, 1)) * 100 + (hl / Math.max(l.length - 1, 1)) * 100) / 2;
}

// ===================== GAP =====================
function gapScore(open: number, prevClose: number): number {
  if (prevClose === 0) return 50;
  const pct = ((open - prevClose) / prevClose) * 100;
  if (1 <= pct && pct <= 4) return 80 + Math.min((4 - pct) * 5, 20);
  if (0.5 <= pct && pct < 1) return 60 + (pct - 0.5) * 40;
  if (4 < pct && pct <= 8) return 70 - (pct - 4) * 5;
  if (pct > 8) return 40;
  if (-1 <= pct && pct < 0) return 30;
  return 15;
}

// ===================== ORB =====================
function orbScore(
  open: number, high30m: number, low30m: number, current: number, atr: number,
  minutesSinceOpen: number
): { score: number; isValid: boolean } {
  if (atr === 0) return { score: 50, isValid: false };
  if (minutesSinceOpen < 30) return { score: 50, isValid: false };

  const orbRange = high30m - low30m;
  const norm = orbRange / atr;

  const breakout = current > high30m ? 1.0 : current > open ? 0.5 : 0;
  const bStrength = orbRange > 0 ? (high30m - open) / orbRange : 0;

  if (norm > 2 && breakout >= 1.0) return { score: 95, isValid: true };
  if (norm > 1.5 && breakout >= 0.5) return { score: 80, isValid: true };
  if (norm > 1 && bStrength > 0.2) return { score: 65, isValid: true };
  if (norm > 0.5) return { score: 45, isValid: true };
  return { score: 30, isValid: true };
}

// ===================== VWAP Score =====================
function vwapScore(current: number, vwap: number, normSlope: number): number {
  if (vwap === 0) return 50;
  const dev = ((current - vwap) / vwap) * 100;
  if (dev > 1.5 && normSlope > 0.0005) return 90;
  if (dev > 1 && normSlope > 0) return 85;
  if (dev > 0.5 && normSlope >= 0) return 70;
  if (dev > 0) return 55;
  if (dev > -0.5) return 40;
  return 25;
}

// ===================== RSI Short =====================
function rsiShortScore(prices: number[]): number {
  if (prices.length < 10) return 50;
  const r7 = calcRsi(prices, 7);
  const r9 = calcRsi(prices, 9);
  const blended = r7 * 0.7 + r9 * 0.3;

  if (blended >= 60 && blended < 75) return 85;
  if (blended >= 55 && blended < 60) return 70;
  if (blended >= 45 && blended < 55) return 55;
  if (blended >= 35 && blended < 45) return 40;
  if (blended >= 75 && blended <= 80) return 60;
  if (blended > 80) return 30;
  return 25;
}

// ===================== Velocity =====================
function velocityScore(open: number, current: number, low: number, atr: number): { volScore: number; dirScore: number } {
  if (atr === 0 || open === 0) return { volScore: 50, dirScore: 50 };

  const dayRange = current - low;
  const volRatio = dayRange / atr;
  const volScore = clamp(volRatio * 30, 0, 100);

  const dirMove = (current - open) / atr;
  let dirScore: number;
  if (dirMove > 2.0) dirScore = 95;
  else if (dirMove > 1.5) dirScore = 85;
  else if (dirMove > 1.0) dirScore = 70;
  else if (dirMove > 0.5) dirScore = 55;
  else if (dirMove > 0) dirScore = 40;
  else if (dirMove > -0.5) dirScore = 25;
  else dirScore = 15;

  return { volScore, dirScore };
}

// ===================== MarketCap Score =====================
function marketCapScore(data: StockData): number {
  let s = 50;
  if (data.marketCap > 200_000_000_000) s += 25;
  else if (data.marketCap > 10_000_000_000) s += 15;
  else if (data.marketCap > 1_000_000_000) s += 5;
  else s -= 10;
  return clamp(s, 0, 100);
}

// ===================== Intraday Retention =====================
function intradayRetentionScore(high30m: number, current: number): number {
  if (high30m === 0) return 50;
  const pullback = ((high30m - current) / high30m) * 100;
  if (pullback < 0.3) return 85;
  if (pullback < 0.8) return 70;
  if (pullback < 1.5) return 55;
  if (pullback < 3.0) return 40;
  return 25;
}

// ===================== RVOL =====================
function rvolScore(rvol: number): number {
  if (rvol < 1.0) return lerp(rvol, 0, 1.0, 0, 15);
  if (rvol < 2.0) return lerp(rvol, 1.0, 2.0, 15, 50);
  if (rvol < 4.0) return lerp(rvol, 2.0, 4.0, 50, 100);
  return 100;
}

// ===================== MACD =====================
function calcMacd(prices: number[]) {
  const ema = (d: number[], span: number): number[] => {
    const k = 2 / (span + 1), r = [d[0]];
    for (let i = 1; i < d.length; i++) r.push(d[i] * k + r[i - 1] * (1 - k));
    return r;
  };
  const e12 = ema(prices, 12), e26 = ema(prices, 26);
  const ml = e12.map((v, i) => v - e26[i]);
  const sl = ema(ml, 9);
  const hi = ml.map((v, i) => v - sl[i]);
  return { macd: ml[ml.length - 1], signal: sl[sl.length - 1], hist: hi[hi.length - 1] };
}

// ===================== IV Proxy =====================
function ivProxy(priceChange: number, volRatio: number, rsi14: number): number {
  const volS = Math.min(100, Math.abs(priceChange) * 15);
  const vrS = Math.min(100, (volRatio - 1) * 25);
  const rsiDist = Math.abs(rsi14 - 50);
  return Math.round((volS * 0.4 + vrS * 0.35 + Math.min(100, rsiDist * 2) * 0.25) * 100) / 100;
}

// ===================== Hedef Fiyat =====================
function targetPrice(current: number, atr: number, score: number): number {
  const mult = score >= 75 ? 2.0 : score >= 55 ? 1.5 : 1.0;
  return Math.round((current + atr * mult) * 100) / 100;
}

// ===================== Açılıştan geçen süre (dakika) =====================
function minutesSinceMarketOpen(): number {
  const now = new Date();
  const estHour = (now.getUTCHours() - 5 + 24) % 24;
  const estMin = now.getUTCMinutes();
  if (estHour < 9 || (estHour === 9 && estMin < 30)) return 0;
  if (estHour >= 16) return 390;
  return (estHour - 9) * 60 + estMin - 30;
}

// ===================== Tarama zaman uyarısı =====================
export function getScanTimingWarning(language: AppLanguage = "tr"): string | null {
  const min = minutesSinceMarketOpen();
  if (min === 0) return copy(language, "\u23F0 Piyasa henüz açılmadı (09:30 EST). En erken 10:00 EST'de tarayın.", "\u23F0 Market not yet open (09:30 EST). Scan earliest at 10:00 EST.");
  if (min < 30) return copy(language, `\u23F0 Piyasa yeni açıldı (${min} dk). 30dk dolmadan ORB kırılım testi anlamsız. 10:00 EST'yi bekleyin.`, `\u23F0 Market just opened (${min} min). ORB breakout test meaningless before 30 min. Wait until 10:00 EST.`);
  if (min < 60) return copy(language, `\u26A0\uFE0F Piyasa ${min} dk açık. İdeal tarama: 10:00-10:30 EST arası.`, `\u26A0\uFE0F Market open ${min} min. Ideal scan window: 10:00-10:30 EST.`);
  return null;
}

// #############################################################################
// # FAZ 1: CONFIDENCE SCORE + EXPLANATION ENGINE + RANKING SCORE
// #############################################################################

// ===================== Confidence Score Hesaplama =====================
function calcConfidence(
  data: StockData,
  closePrices: number[],
  highPrices: number[],
  lowPrices: number[],
  hasIntraday: boolean
): ConfidenceBreakdown {
  // 1. Data Completeness: Tüm kritik alanlar mevcut mu?
  let completeness = 100;
  if (!data.currentPrice || data.currentPrice <= 0) completeness -= 40;
  if (!data.prevClose || data.prevClose <= 0) completeness -= 20;
  if (!data.marketCap || data.marketCap <= 0) completeness -= 15;
  if (closePrices.length < 30) completeness -= 20;
  if (highPrices.length < 30) completeness -= 5;
  if (lowPrices.length < 30) completeness -= 5;
  completeness = clamp100(completeness);

  // 2. Price Recency: Son fiyat ne kadar taze?
  let recency = 80; // Varsayılan iyi
  const lastTimestamp = data.timestamps[data.timestamps.length - 1];
  const now = Date.now() / 1000;
  const ageHours = (now - lastTimestamp) / 3600;
  if (ageHours < 1) recency = 100;
  else if (ageHours < 4) recency = 90;
  else if (ageHours < 24) recency = 75;
  else if (ageHours < 48) recency = 60;
  else recency = 40;

  // 3. Volume Quality: Hacim verisi güvenilir mi?
  let volQuality = 100;
  const avgVol = mean(data.volume.slice(-20));
  const zeroVolDays = data.volume.slice(-20).filter((v) => v === 0).length;
  if (zeroVolDays > 2) volQuality -= 30;
  if (avgVol < MIN_AVG_VOLUME_20D) volQuality -= 20;
  if (!hasIntraday) volQuality -= 15; // Intraday yoksa hacim kalitesi düşer
  volQuality = clamp100(volQuality);

  // 4. Indicator Reliability: Teknik göstergeler güvenilir mi?
  let reliability = 100;
  if (closePrices.length < 50) reliability -= 30;
  else if (closePrices.length < 30) reliability -= 50;
  if (!hasIntraday) reliability -= 15;
  // Fiyat gap'leri (eksik veri işareti)
  let priceGaps = 0;
  for (let i = 1; i < Math.min(closePrices.length, 20); i++) {
    const change = Math.abs((closePrices[i] - closePrices[i - 1]) / closePrices[i - 1]);
    if (change > 0.15) priceGaps++;
  }
  if (priceGaps > 0) reliability -= priceGaps * 10;
  reliability = clamp100(reliability);

  // Ağırlıklı ortalama
  const overall = Math.round(
    completeness * CONFIDENCE_WEIGHTS.dataCompleteness +
    recency * CONFIDENCE_WEIGHTS.priceRecency +
    volQuality * CONFIDENCE_WEIGHTS.volumeQuality +
    reliability * CONFIDENCE_WEIGHTS.indicatorReliability
  );

  return {
    dataCompleteness: Math.round(completeness),
    priceRecency: Math.round(recency),
    volumeQuality: Math.round(volQuality),
    indicatorReliability: Math.round(reliability),
    overall: clamp100(overall),
    label: confidenceLabel(overall),
  };
}

// ===================== Score Explanation Engine =====================
function buildExplanations(
  scores: Record<string, number>,
  rawValues: Record<string, number | string>,
  weights: Record<string, number>,
  language: AppLanguage = "tr"
): ScoreExplanation[] {
  const explanations: ScoreExplanation[] = [];

  for (const [key, score] of Object.entries(scores)) {
    const weight = weights[key] ?? 0;
    const label = getFactorLabels(language)[key] || key;
    let reason = "";
    let detail = "";

    switch (key) {
      case "rvolS": {
        const rvol = Number(rawValues.rvol ?? 0);
        if (rvol >= 4) { reason = copy(language, "Hacim patlaması - çok güçlü ilgi", "Volume explosion - very strong interest"); detail = copy(language, `RVOL ${rvol.toFixed(1)}x: Normalin 4 katı üzerinde hacim, institüsel ilgi işareti.`, `RVOL ${rvol.toFixed(1)}x: 4x+ normal volume, institutional interest signal.`); }
        else if (rvol >= 2) { reason = copy(language, "Yüksek hacim - güçlü ilgi", "High volume - strong interest"); detail = copy(language, `RVOL ${rvol.toFixed(1)}x: Normalin 2 katı hacim, yukarı yönlü momentum desteği.`, `RVOL ${rvol.toFixed(1)}x: 2x normal volume, upward momentum support.`); }
        else if (rvol >= 1) { reason = copy(language, "Normal hacim", "Normal volume"); detail = copy(language, `RVOL ${rvol.toFixed(1)}x: Ortalama hacim civarında.`, `RVOL ${rvol.toFixed(1)}x: Around average volume.`); }
        else { reason = copy(language, "Düşük hacim", "Low volume"); detail = copy(language, `RVOL ${rvol.toFixed(1)}x: Normalin altında hacim, momentum zayıflığı.`, `RVOL ${rvol.toFixed(1)}x: Below normal volume, momentum weakness.`); }
        break;
      }
      case "gap": {
        const gapPct = Number(rawValues.gapPct ?? 0);
        if (gapPct >= 1 && gapPct <= 4) { reason = copy(language, "İdeal GAP aralığı", "Ideal GAP range"); detail = copy(language, `GAP %${gapPct.toFixed(2)}: Momentumcu açılış, fazla geri çekilme riski düşük.`, `GAP %${gapPct.toFixed(2)}: Momentum open, low pullback risk.`); }
        else if (gapPct > 4 && gapPct <= 8) { reason = copy(language, "Geniş GAP - dikkat", "Wide GAP - caution"); detail = copy(language, `GAP %${gapPct.toFixed(2)}: Fazla geniş, geri doldurma (gap fill) riski var.`, `GAP %${gapPct.toFixed(2)}: Too wide, gap fill risk present.`); }
        else if (gapPct > 0) { reason = copy(language, "Zayıf GAP", "Weak GAP"); detail = copy(language, `GAP %${gapPct.toFixed(2)}: Minimum açılış boşluğu.`, `GAP %${gapPct.toFixed(2)}: Minimum opening gap.`); }
        else { reason = copy(language, "Negatif GAP / Düz açılış", "Negative GAP / Flat open"); detail = copy(language, `GAP %${gapPct.toFixed(2)}: Momentumcu açılış yok.`, `GAP %${gapPct.toFixed(2)}: No momentum open.`); }
        break;
      }
      case "orbScore": {
        const orbValid = rawValues.orbValid === "true";
        const minsOpen = Number(rawValues.minsOpen ?? 0);
        if (!orbValid && minsOpen < 30) { reason = copy(language, "ORB henüz geçersiz", "ORB not yet valid"); detail = copy(language, `Piyasa sadece ${Math.round(minsOpen)} dk açık. 30 dk sonra kırılım testi yapılabilir.`, `Market only open ${Math.round(minsOpen)} min. Breakout test valid after 30 min.`); }
        else if (score >= 80) { reason = copy(language, "Güçlü ORB kırılımı", "Strong ORB breakout"); detail = copy(language, "Fiyat opening range'in üzerine çıktı, yükseliş momentumu güçlü.", "Price broke above opening range, strong bullish momentum."); }
        else if (score >= 60) { reason = copy(language, "ORB kırılımı", "ORB breakout"); detail = copy(language, "Fiyat ORB üst bandına yaklaşıyor veya kırdı.", "Price approaching or broke ORB upper band."); }
        else { reason = copy(language, "Zayıf ORB", "Weak ORB"); detail = copy(language, "Opening range içinde sıkışma devam ediyor.", "Consolidation within opening range continues."); }
        break;
      }
      case "vwap": {
        const dev = Number(rawValues.vwapDev ?? 0);
        const slope = Number(rawValues.vwapSlope ?? 0);
        if (dev > 1.5 && slope > 0.0005) { reason = copy(language, "Güçlü VWAP üstü + yükselen", "Strong VWAP above + rising"); detail = copy(language, `VWAP üstünde %${dev.toFixed(2)} ve eğim pozitif, boğa kontrolü.`, `VWAP above %${dev.toFixed(2)} and slope positive, bull control.`); }
        else if (dev > 0) { reason = copy(language, "VWAP üstünde", "Above VWAP"); detail = copy(language, `VWAP üstünde %${dev.toFixed(2)}, kısa vadeli pozitif.`, `VWAP above %${dev.toFixed(2)}, short-term positive.`); }
        else { reason = copy(language, "VWAP altında", "Below VWAP"); detail = copy(language, `VWAP altında %${Math.abs(dev).toFixed(2)}, ayı baskısı.`, `VWAP below %${Math.abs(dev).toFixed(2)}, bear pressure.`); }
        break;
      }
      case "structure": {
        if (score >= 70) { reason = copy(language, "Higher Highs + Higher Lows", "Higher Highs + Higher Lows"); detail = copy(language, "Yükselen tepe ve dip seviyeleri - güçlü trend yapısı.", "Rising peaks and troughs - strong trend structure."); }
        else if (score >= 55) { reason = copy(language, "Karışık yapı", "Mixed structure"); detail = copy(language, "Bazı higher highs/lower lows karışımı, net trend yok.", "Mixed higher highs/lower lows, no clear trend."); }
        else { reason = copy(language, "Düşük yapı skoru", "Weak structure score"); detail = copy(language, "Lower lows veya düz seyir, trend zayıflığı.", "Lower lows or flat, trend weakness."); }
        break;
      }
      case "rsiShort": {
        const rsi = Number(rawValues.rsi7 ?? 50);
        if (rsi >= 60 && rsi < 75) { reason = copy(language, "Optimum RSI aralığı", "Optimum RSI range"); detail = copy(language, `RSI ${rsi.toFixed(1)}: Momentum güçlü ama aşırı alım değil.`, `RSI ${rsi.toFixed(1)}: Momentum strong but not overbought.`); }
        else if (rsi >= 75) { reason = copy(language, "Aşırı alım yakını", "Near overbought"); detail = copy(language, `RSI ${rsi.toFixed(1)}: Dikkat, geri çekilme riski artıyor.`, `RSI ${rsi.toFixed(1)}: Caution, pullback risk rising.`); }
        else if (rsi >= 45) { reason = copy(language, "Nötr RSI", "Neutral RSI"); detail = copy(language, `RSI ${rsi.toFixed(1)}: Ne aşırı alım ne satım.`, `RSI ${rsi.toFixed(1)}: Neither overbought nor oversold.`); }
        else { reason = copy(language, "Zayıf RSI", "Weak RSI"); detail = copy(language, `RSI ${rsi.toFixed(1)}: Momentum zayıf veya aşırı satım.`, `RSI ${rsi.toFixed(1)}: Momentum weak or oversold.`); }
        break;
      }
      case "velDir": {
        const dirMove = Number(rawValues.dirMove ?? 0);
        if (score >= 85) { reason = copy(language, "Güçlü yukarı momentum", "Strong upward momentum"); detail = copy(language, `ATR bazlı hareket: ${dirMove.toFixed(2)}x ATR yukarı.`, `ATR-based move: ${dirMove.toFixed(2)}x ATR upward.`); }
        else if (score >= 55) { reason = copy(language, "Pozitif yön", "Positive direction"); detail = copy(language, `ATR bazlı hareket: ${dirMove.toFixed(2)}x ATR.`, `ATR-based move: ${dirMove.toFixed(2)}x ATR.`); }
        else if (score >= 25) { reason = copy(language, "Zayıf yön", "Weak direction"); detail = copy(language, `ATR bazlı hareket: ${dirMove.toFixed(2)}x ATR.`, `ATR-based move: ${dirMove.toFixed(2)}x ATR.`); }
        else { reason = copy(language, "Negatif yön", "Negative direction"); detail = copy(language, `ATR bazlı hareket: ${dirMove.toFixed(2)}x ATR aşağı.`, `ATR-based move: ${dirMove.toFixed(2)}x ATR down.`); }
        break;
      }
      case "velVol": {
        const volR = Number(rawValues.volRatio ?? 0);
        if (score >= 70) { reason = copy(language, "Yüksek volatilite", "High volatility"); detail = copy(language, `Gün içi range ATR'nin ${volR.toFixed(2)} katı - hareketli gün.`, `Intraday range ${volR.toFixed(2)}x ATR - active day.`); }
        else if (score >= 40) { reason = copy(language, "Normal volatilite", "Normal volatility"); detail = copy(language, "Ortalama volatilite seviyeleri.", "Average volatility levels."); }
        else { reason = copy(language, "Düşük volatilite", "Low volatility"); detail = copy(language, "Sığ hareket, opsiyon stratejileri için uygun olmayabilir.", "Narrow movement, may not suit option strategies."); }
        break;
      }
      case "mktCap": {
        const mcap = Number(rawValues.mktCap ?? 0);
        if (mcap > 200_000_000_000) { reason = copy(language, "Mega cap - yüksek likidite", "Mega cap - high liquidity"); detail = copy(language, "200B+ piyasa değeri, en yüksek likidite ve opsiyon derinliği.", "200B+ market cap, highest liquidity and option depth."); }
        else if (mcap > 10_000_000_000) { reason = copy(language, "Large cap - iyi likidite", "Large cap - good liquidity"); detail = copy(language, "10B+ piyasa değeri, yeterli opsiyon hacmi.", "10B+ market cap, sufficient option volume."); }
        else { reason = copy(language, "Düşük market cap", "Low market cap"); detail = copy(language, "Opsiyon spreadleri geniş olabilir, dikkat.", "Option spreads may be wide, caution."); }
        break;
      }
      case "retention": {
        const pb = Number(rawValues.pullback ?? 0);
        if (score >= 85) { reason = copy(language, "Mükemmel tutma", "Excellent retention"); detail = copy(language, `Yüksekten sadece %${pb.toFixed(2)} geri çekilme - güçlü alıcılar.`, `Only %${pb.toFixed(2)} pullback from high - strong buyers.`); }
        else if (score >= 55) { reason = copy(language, "İyi tutma", "Good retention"); detail = copy(language, `Yüksekten %${pb.toFixed(2)} geri çekilme - normal.`, `%${pb.toFixed(2)} pullback from high - normal.`); }
        else { reason = copy(language, "Zayıf tutma", "Weak retention"); detail = copy(language, `Yüksekten %${pb.toFixed(2)} geri çekilme - kar realizasyonu baskısı.`, `%${pb.toFixed(2)} pullback from high - profit-taking pressure.`); }
        break;
      }
      case "pcS": {
        const pc = Number(rawValues.priceChangePct ?? 0);
        if (pc > 5) { reason = copy(language, "Güçlü günlük kazanç", "Strong daily gain"); detail = copy(language, `+%${pc.toFixed(2)}: Gün içi güçlü yükseliş.`, `+%${pc.toFixed(2)}: Strong intraday rise.`); }
        else if (pc > 2) { reason = copy(language, "İyi günlük kazanç", "Good daily gain"); detail = copy(language, `+%${pc.toFixed(2)}: Pozitif seyir.`, `+%${pc.toFixed(2)}: Positive drift.`); }
        else if (pc > 0) { reason = copy(language, "Hafif pozitif", "Slightly positive"); detail = copy(language, `+%${pc.toFixed(2)}: Zayıf pozitif.`, `+%${pc.toFixed(2)}: Weak positive.`); }
        else { reason = copy(language, "Negatif/flat", "Negative/flat"); detail = copy(language, `%${pc.toFixed(2)}: Gün içi düşüş veya yatay.`, `%${pc.toFixed(2)}: Intraday decline or flat.`); }
        break;
      }
      default:
        reason = score >= 70 ? copy(language, "Güçlü", "Strong") : score >= 50 ? copy(language, "Nötr", "Neutral") : copy(language, "Zayıf", "Weak");
        detail = copy(language, `${label} faktör skoru: ${score.toFixed(0)}/100`, `${label} factor score: ${score.toFixed(0)}/100`);
    }

    explanations.push({
      factor: label,
      score: Math.round(score),
      weight: Math.round(weight * 100) / 100,
      reason,
      detail,
    });
  }

  return explanations;
}

// ===================== Ranking Score Hesaplama =====================
function calcRankingScore(
  momentumScore: number,
  confidence: ConfidenceBreakdown,
  riskReturn: number // 0-100
): RankingInfo {
  const mContrib = momentumScore * RANKING_WEIGHTS.momentum;
  const cContrib = confidence.overall * RANKING_WEIGHTS.confidence;
  const rContrib = riskReturn * RANKING_WEIGHTS.riskReturn;
  // Pattern bonus (şimdilik momentum + confidence'dan türetilmiş)
  const patternBonus = (momentumScore + confidence.overall) / 2 * RANKING_WEIGHTS.pattern;

  const rankingScore = clamp100(Math.round(mContrib + cContrib + rContrib + patternBonus));

  return {
    rankingScore,
    momentumContribution: Math.round(mContrib * 10) / 10,
    confidenceContribution: Math.round(cContrib * 10) / 10,
    rrContribution: Math.round(rContrib * 10) / 10,
    patternBonus: Math.round(patternBonus * 10) / 10,
    rank: 0, // Sonradan atanır
  };
}

// =============================================================================
// MAIN ANALYSIS v4
// =============================================================================

export function analyzeStock(
  data: StockData,
  intraday?: { timestamps: number[]; open: number[]; high: number[]; low: number[]; close: number[]; volume: number[] },
  language: AppLanguage = "tr"
): StockResult | null {
  const closePrices = data.close;
  const highPrices = data.high;
  const lowPrices = data.low;

  const sector = getSector(data.ticker) || data.sector || "N/A";

  // Filters
  const avgVol20 = mean(data.volume.slice(-20));
  const avgDollarVol = avgVol20 * data.currentPrice;
  if (avgVol20 < MIN_AVG_VOLUME_20D) return null;
  if (avgDollarVol < MIN_DOLLAR_VOLUME) return null;

  const currentPrice = data.currentPrice;
  const prevClose = data.prevClose;
  const todayVolume = data.volume[data.volume.length - 1];
  const priceChangePct = ((currentPrice - prevClose) / prevClose) * 100;

  // Intraday processing
  let openPrice = data.open[data.open.length - 1];
  let high30m = data.high[data.high.length - 1];
  let low30m = data.low[data.low.length - 1];
  let vol30m = todayVolume;
  let intradayVwap = 0;
  let intradayNormSlope = 0;
  let hasIntraday = false;

  if (intraday && intraday.close.length > 0) {
    const today = new Date().toDateString();
    const idxs = intraday.timestamps
      .map((ts, i) => ({ ts: new Date(ts * 1000).toDateString(), i }))
      .filter((t) => t.ts === today)
      .map((t) => t.i);

    if (idxs.length > 0) {
      hasIntraday = true;
      const first = idxs[0];
      openPrice = intraday.open[first];

      const tHighs = idxs.map((i) => intraday.high[i]);
      const tLows = idxs.map((i) => intraday.low[i]);
      const tCloses = idxs.map((i) => intraday.close[i]);
      const tVols = idxs.map((i) => intraday.volume[i]);

      high30m = Math.max(...tHighs);
      low30m = Math.min(...tLows);
      vol30m = tVols.reduce((a, b) => a + b, 0);

      const vw = calcVwapIntraday(tHighs, tLows, tCloses, tVols);
      intradayVwap = vw.vwap;
      intradayNormSlope = vw.normalizedSlope;
    }
  }

  // Indicators
  const rvol = avgVol20 > 0 ? todayVolume / avgVol20 : 1;
  const gap = gapScore(openPrice, prevClose);
  const atr14d = calcAtr(highPrices, lowPrices, closePrices, 14);

  // ORB with timing
  const minsOpen = minutesSinceMarketOpen();
  const orb = orbScore(openPrice, high30m, low30m, currentPrice, atr14d, minsOpen);

  // VWAP
  const vwap = vwapScore(currentPrice, intradayVwap, intradayNormSlope);
  const vwapDev = intradayVwap > 0 ? ((currentPrice - intradayVwap) / intradayVwap) * 100 : 0;

  // Structure
  const structure = checkStructure(highPrices, lowPrices);

  // RSI
  const rsi14 = calcRsi(closePrices, 14);
  const rsi7 = calcRsi(closePrices, 7);
  const rsiShort = rsiShortScore(closePrices);

  // Velocity
  const vel = velocityScore(openPrice, currentPrice, low30m, atr14d);

  // MarketCap
  const mktCap = marketCapScore(data);

  // Intraday Retention
  const retention = intradayRetentionScore(high30m, currentPrice);

  // RVOL linear
  const rvolS = rvolScore(rvol);

  // Price change score
  let pcS: number;
  if (priceChangePct > 5) pcS = 100;
  else if (priceChangePct > 3) pcS = 80;
  else if (priceChangePct > 2) pcS = 60;
  else if (priceChangePct > 1) pcS = 45;
  else if (priceChangePct > 0) pcS = 30;
  else if (priceChangePct > -1) pcS = 20;
  else pcS = 10;

  // IV
  const iv = ivProxy(priceChangePct, rvol, rsi14);

  // ===== FAZ 1: SANITY GATE =====
  const { score: totalScore, issues } = sanityGate({
    rvolS, gap, orbScore: orb.score, vwap, structure, rsiShort, velDir: vel.dirScore,
    velVol: vel.volScore, mktCap, retention, pcS, weights: { ...SIGNAL_WEIGHTS },
  }, language);

  if (issues.length > 0) {
    console.warn(`[Momentum v4] ${data.ticker} sanity issues:`, issues);
  }

  // ===== FAZ 1: CONFIDENCE SCORE =====
  const confidence = calcConfidence(data, closePrices, highPrices, lowPrices, hasIntraday);

  // ===== FAZ 1: RISK/RETURN SKORU =====
  // R/R oranından 0-100 skor
  const rrScore = (() => {
    const tgt = targetPrice(currentPrice, atr14d, totalScore);
    const risk = atr14d * 0.8; // Stop-loss olarak 0.8 ATR
    const reward = tgt - currentPrice;
    const rr = risk > 0 ? reward / risk : 1;
    if (rr >= 3) return 100;
    if (rr >= 2) return 85;
    if (rr >= 1.5) return 70;
    if (rr >= 1) return 55;
    if (rr >= 0.5) return 35;
    return 20;
  })();

  // ===== FAZ 1: RANKING SCORE =====
  const ranking = calcRankingScore(totalScore, confidence, rrScore);

  // ===== FAZ 1: SCORE EXPLANATIONS =====
  const rawValues: Record<string, number | string> = {
    rvol, gapPct: ((openPrice - prevClose) / prevClose) * 100,
    orbValid: String(orb.isValid), minsOpen,
    vwapDev: vwapDev, vwapSlope: intradayNormSlope,
    rsi7: rsi7, mktCap: data.marketCap,
    dirMove: atr14d > 0 ? (currentPrice - openPrice) / atr14d : 0,
    volRatio: atr14d > 0 ? (currentPrice - low30m) / atr14d : 0,
    pullback: high30m > 0 ? ((high30m - currentPrice) / high30m) * 100 : 0,
    priceChangePct,
  };

  const explanations = buildExplanations({
    rvolS, gap, orbScore: orb.score, vwap, structure, rsiShort,
    velDir: vel.dirScore, velVol: vel.volScore, mktCap, retention, pcS,
  }, rawValues, SIGNAL_WEIGHTS, language);

  // MACD
  const macd = calcMacd(closePrices);

  // 52w
  const h52 = Math.max(...highPrices.slice(-252));
  const l52 = Math.min(...lowPrices.slice(-252));
  const r52 = h52 - l52 > 0 ? ((currentPrice - l52) / (h52 - l52)) * 100 : 50;

  const openMom = openPrice > 0 ? ((high30m - openPrice) / openPrice) * 100 : 0;
  const tgt = targetPrice(currentPrice, atr14d, totalScore);
  const earnWarn = EARNINGS_TICKERS.includes(data.ticker)
    ? copy(language, `\u26A0 ${data.ticker} yakın zamanda kazanç açıklayabilir. IV crush riskine dikkat edin.`, `\u26A0 ${data.ticker} may announce earnings soon. Watch IV crush risk.`)
    : null;

  // Signal (momentum score bazlı) + RSI RED filtresi
  // RSI >= 80 = AŞIRI ALIM → OTOMATİK RED (AAPL RSI 90'a "gir" demek saçmalık)
  // RSI <= 25 = AŞIRI SATIM → CAUTION (reversal potansiyeli ama riskli)
  let sig: string;
  let rsiWarning: string | null = null;

  if (rsi14 >= 80) {
    sig = "OVERBOUGHT_RED";
    rsiWarning = copy(language, `🚨 RSI ${rsi14.toFixed(1)} = AŞIRI ALIM! Bu hisse çok tehlikeli. Geri çekilme an meselesi. KESİNLİKLE girmeyin.`, `🚨 RSI ${rsi14.toFixed(1)} = OVERBOUGHT! This stock is very dangerous. Pullback is imminent. DO NOT enter.`);
  } else if (rsi14 >= 75) {
    sig = "CAUTION_HOT";
    rsiWarning = copy(language, `⚠️ RSI ${rsi14.toFixed(1)} = SICAK BÖLGE. Momentum yüksek ama geri çekilme riski çok yüksek. Stop-loss şart, küçük pozisyon.`, `⚠️ RSI ${rsi14.toFixed(1)} = HOT ZONE. Momentum is high but pullback risk is very high. Stop-loss required, small position.`);
  } else if (rsi14 <= 25) {
    sig = "OVERSOLD_CAUTION";
    rsiWarning = copy(language, `⚠️ RSI ${rsi14.toFixed(1)} = AŞIRI SATIM. Dönüş potansiyeli var ama yakalanan bıçağa dikkat.`, `⚠️ RSI ${rsi14.toFixed(1)} = OVERSOLD. Reversal potential exists but watch for falling knife.`);
  } else if (totalScore >= 75) {
    sig = "STRONG_BUY";
  } else if (totalScore >= 60) {
    sig = "BUY";
  } else if (totalScore >= 45) {
    sig = "NEUTRAL_BULLISH";
  } else if (totalScore >= 30) {
    sig = "NEUTRAL";
  } else if (totalScore >= 20) {
    sig = "NEUTRAL_BEARISH";
  } else {
    sig = "WEAK";
  }

  const result: StockResult = {
    ticker: data.ticker,
    name: data.name,
    sector,
    currentPrice: Math.round(currentPrice * 100) / 100,
    prevClose: Math.round(prevClose * 100) / 100,
    priceChangePct: Math.round(priceChangePct * 100) / 100,
    openPrice: Math.round(openPrice * 100) / 100,
    opening30mHigh: Math.round(high30m * 100) / 100,
    openingMomentum: Math.round(openMom * 100) / 100,
    volume: Math.round(todayVolume),
    avgVolume20d: Math.round(avgVol20),
    volumeRatio: Math.round(rvol * 100) / 100,
    opening30mVolume: Math.round(vol30m),
    rsi: Math.round(rsi14 * 10) / 10,
    rsi2: Math.round(calcRsi(closePrices, 2) * 10) / 10,
    rsi7: Math.round(rsi7 * 10) / 10,
    macd: Math.round(macd.macd * 10000) / 10000,
    macdSignal: Math.round(macd.signal * 10000) / 10000,
    macdHistogram: Math.round(macd.hist * 10000) / 10000,
    vwap: Math.round(intradayVwap * 100) / 100,
    vwapSlope: Math.round(intradayNormSlope * 10000) / 10000,
    vwapDeviation: Math.round(vwapDev * 100) / 100,
    atr14d: Math.round(atr14d * 10000) / 10000,
    atrMomentumScore: vel.dirScore,
    gapScore: Math.round(gap),
    orbScore: Math.round(orb.score),
    structureScore: Math.round(structure),
    rvolScore: Math.round(rvolS),
    rsiShortScore: rsiShort,
    catalystScore: mktCap,
    high52w: Math.round(h52 * 100) / 100,
    low52w: Math.round(l52 * 100) / 100,
    range52wPct: Math.round(r52 * 10) / 10,
    marketCap: data.marketCap,
    avgDollarVolume: Math.round(avgDollarVol),
    score: totalScore,
    signal: sig,
    timestamp: new Date().toISOString(),
    targetPrice: tgt,
    ivProxy: iv,
    earningsWarning: earnWarn,
    // v4 extensions
    confidenceScore: confidence.overall,
    confidenceBreakdown: confidence,
    rankingScore: ranking.rankingScore,
    rankingInfo: ranking,
    scoreExplanations: explanations,
    dataQuality: dataQualityLabel(confidence.overall),
    rsiWarning: rsiWarning, // RSI RED filtresi uyarısı
  };

  return result;
}

export function analyzeStockFull(data: StockData, language: AppLanguage = "tr"): StockResult {
  const result = analyzeStock(data, data.intraday, language);
  if (!result) {
    throw new Error(`No qualifying momentum result for ${data.ticker}`);
  }

  return result;
}
