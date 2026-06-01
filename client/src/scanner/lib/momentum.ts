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

import type { StockData } from "./yahooFinance";
import type { StockResult, ScoreExplanation, ConfidenceBreakdown, RankingInfo } from "@/scanner/types";
import { FACTOR_WEIGHTS, CONFIDENCE_WEIGHTS, RANKING_WEIGHTS, FACTOR_LABELS, clamp100, confidenceLabel, dataQualityLabel } from "./scoreConfig";
import { TRAINED_WEIGHTS } from "./trainedModel";
import { sanityGate, isSafeNumber } from "./sanityGate";

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
export function getScanTimingWarning(): string | null {
  const min = minutesSinceMarketOpen();
  if (min === 0) return "\u23F0 Piyasa henüz açılmadı (09:30 EST). En erken 10:00 EST'de tarayın.";
  if (min < 30) return `\u23F0 Piyasa yeni açıldı (${min} dk). 30dk dolmadan ORB kırılım testi anlamsız. 10:00 EST'yi bekleyin.`;
  if (min < 60) return `\u26A0\uFE0F Piyasa ${min} dk açık. İdeal tarama: 10:00-10:30 EST arası.`;
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
  weights: Record<string, number>
): ScoreExplanation[] {
  const explanations: ScoreExplanation[] = [];

  for (const [key, score] of Object.entries(scores)) {
    const weight = weights[key] ?? 0;
    const label = FACTOR_LABELS[key] || key;
    let reason = "";
    let detail = "";

    switch (key) {
      case "rvolS": {
        const rvol = Number(rawValues.rvol ?? 0);
        if (rvol >= 4) { reason = "Hacim patlaması - çok güçlü ilgi"; detail = `RVOL ${rvol.toFixed(1)}x: Normalin 4 katı üzerinde hacim, institüsel ilgi işareti.`; }
        else if (rvol >= 2) { reason = "Yüksek hacim - güçlü ilgi"; detail = `RVOL ${rvol.toFixed(1)}x: Normalin 2 katı hacim, yukarı yönlü momentum desteği.`; }
        else if (rvol >= 1) { reason = "Normal hacim"; detail = `RVOL ${rvol.toFixed(1)}x: Ortalama hacim civarında.`; }
        else { reason = "Düşük hacim"; detail = `RVOL ${rvol.toFixed(1)}x: Normalin altında hacim, momentum zayıflığı.`; }
        break;
      }
      case "gap": {
        const gapPct = Number(rawValues.gapPct ?? 0);
        if (gapPct >= 1 && gapPct <= 4) { reason = "İdeal GAP aralığı"; detail = `GAP %${gapPct.toFixed(2)}: Momentumcu açılış, fazla geri çekilme riski düşük.`; }
        else if (gapPct > 4 && gapPct <= 8) { reason = "Geniş GAP - dikkat"; detail = `GAP %${gapPct.toFixed(2)}: Fazla geniş, geri doldurma (gap fill) riski var.`; }
        else if (gapPct > 0) { reason = "Zayıf GAP"; detail = `GAP %${gapPct.toFixed(2)}: Minimum açılış boşluğu.`; }
        else { reason = "Negatif GAP / Düz açılış"; detail = `GAP %${gapPct.toFixed(2)}: Momentumcu açılış yok.`; }
        break;
      }
      case "orbScore": {
        const orbValid = rawValues.orbValid === "true";
        const minsOpen = Number(rawValues.minsOpen ?? 0);
        if (!orbValid && minsOpen < 30) { reason = "ORB henüz geçersiz"; detail = `Piyasa sadece ${Math.round(minsOpen)} dk açık. 30 dk sonra kırılım testi yapılabilir.`; }
        else if (score >= 80) { reason = "Güçlü ORB kırılımı"; detail = "Fiyat opening range'in üzerine çıktı, yükseliş momentumu güçlü."; }
        else if (score >= 60) { reason = "ORB kırılımı"; detail = "Fiyat ORB üst bandına yaklaşıyor veya kırdı."; }
        else { reason = "Zayıf ORB"; detail = "Opening range içinde sıkışma devam ediyor."; }
        break;
      }
      case "vwap": {
        const dev = Number(rawValues.vwapDev ?? 0);
        const slope = Number(rawValues.vwapSlope ?? 0);
        if (dev > 1.5 && slope > 0.0005) { reason = "Güçlü VWAP üstü + yükselen"; detail = `VWAP üstünde %${dev.toFixed(2)} ve eğim pozitif, boğa kontrolü.`; }
        else if (dev > 0) { reason = "VWAP üstünde"; detail = `VWAP üstünde %${dev.toFixed(2)}, kısa vadeli pozitif.`; }
        else { reason = "VWAP altında"; detail = `VWAP altında %${Math.abs(dev).toFixed(2)}, ayı baskısı.`; }
        break;
      }
      case "structure": {
        if (score >= 70) { reason = "Higher Highs + Higher Lows"; detail = "Yükselen tepe ve dip seviyeleri - güçlü trend yapısı."; }
        else if (score >= 55) { reason = "Karışık yapı"; detail = "Bazı higher highs/lower lows karışımı, net trend yok."; }
        else { reason = "Düşük yapı skoru"; detail = "Lower lows veya düz seyir, trend zayıflığı."; }
        break;
      }
      case "rsiShort": {
        const rsi = Number(rawValues.rsi7 ?? 50);
        if (rsi >= 60 && rsi < 75) { reason = "Optimum RSI aralığı"; detail = `RSI ${rsi.toFixed(1)}: Momentum güçlü ama aşırı alım değil.`; }
        else if (rsi >= 75) { reason = "Aşırı alım yakını"; detail = `RSI ${rsi.toFixed(1)}: Dikkat, geri çekilme riski artıyor.`; }
        else if (rsi >= 45) { reason = "Nötr RSI"; detail = `RSI ${rsi.toFixed(1)}: Ne aşırı alım ne satım.`; }
        else { reason = "Zayıf RSI"; detail = `RSI ${rsi.toFixed(1)}: Momentum zayıf veya aşırı satım.`; }
        break;
      }
      case "velDir": {
        const dirMove = Number(rawValues.dirMove ?? 0);
        if (score >= 85) { reason = "Güçlü yukarı momentum"; detail = `ATR bazlı hareket: ${dirMove.toFixed(2)}x ATR yukarı.`; }
        else if (score >= 55) { reason = "Pozitif yön"; detail = `ATR bazlı hareket: ${dirMove.toFixed(2)}x ATR.`; }
        else if (score >= 25) { reason = "Zayıf yön"; detail = `ATR bazlı hareket: ${dirMove.toFixed(2)}x ATR.`; }
        else { reason = "Negatif yön"; detail = `ATR bazlı hareket: ${dirMove.toFixed(2)}x ATR aşağı.`; }
        break;
      }
      case "velVol": {
        const volR = Number(rawValues.volRatio ?? 0);
        if (score >= 70) { reason = "Yüksek volatilite"; detail = `Gün içi range ATR'nin ${volR.toFixed(2)} katı - hareketli gün.`; }
        else if (score >= 40) { reason = "Normal volatilite"; detail = `Ortalama volatilite seviyeleri.`; }
        else { reason = "Düşük volatilite"; detail = `Sığ hareket, opsiyon stratejileri için uygun olmayabilir.`; }
        break;
      }
      case "mktCap": {
        const mcap = Number(rawValues.mktCap ?? 0);
        if (mcap > 200_000_000_000) { reason = "Mega cap - yüksek likidite"; detail = "200B+ piyasa değeri, en yüksek likidite ve opsiyon derinliği."; }
        else if (mcap > 10_000_000_000) { reason = "Large cap - iyi likidite"; detail = "10B+ piyasa değeri, yeterli opsiyon hacmi."; }
        else { reason = "Düşük market cap"; detail = "Opsiyon spreadleri geniş olabilir, dikkat."; }
        break;
      }
      case "retention": {
        const pb = Number(rawValues.pullback ?? 0);
        if (score >= 85) { reason = "Mükemmel tutma"; detail = `Yüksekten sadece %${pb.toFixed(2)} geri çekilme - güçlü alıcılar.`; }
        else if (score >= 55) { reason = "İyi tutma"; detail = `Yüksekten %${pb.toFixed(2)} geri çekilme - normal.`; }
        else { reason = "Zayıf tutma"; detail: `Yüksekten %${pb.toFixed(2)} geri çekilme - kar realizasyonu baskısı.`; }
        break;
      }
      case "pcS": {
        const pc = Number(rawValues.priceChangePct ?? 0);
        if (pc > 5) { reason = "Güçlü günlük kazanç"; detail = `+%${pc.toFixed(2)}: Gün içi güçlü yükseliş.`; }
        else if (pc > 2) { reason = "İyi günlük kazanç"; detail = `+%${pc.toFixed(2)}: Pozitif seyir.`; }
        else if (pc > 0) { reason = "Hafif pozitif"; detail: `+%${pc.toFixed(2)}: Zayıf pozitif.`; }
        else { reason = "Negatif/flat"; detail: `%${pc.toFixed(2)}: Gün içi düşüş veya yatay.`; }
        break;
      }
      default:
        reason = score >= 70 ? "Güçlü" : score >= 50 ? "Nötr" : "Zayıf";
        detail = `${label} faktör skoru: ${score.toFixed(0)}/100`;
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
  intraday?: { timestamps: number[]; open: number[]; high: number[]; low: number[]; close: number[]; volume: number[] }
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
    velVol: vel.volScore, mktCap, retention, pcS, weights: { ...TRAINED_WEIGHTS },
  });

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
  }, rawValues, TRAINED_WEIGHTS);

  // MACD
  const macd = calcMacd(closePrices);

  // 52w
  const h52 = Math.max(...highPrices.slice(-252));
  const l52 = Math.min(...lowPrices.slice(-252));
  const r52 = h52 - l52 > 0 ? ((currentPrice - l52) / (h52 - l52)) * 100 : 50;

  const openMom = openPrice > 0 ? ((high30m - openPrice) / openPrice) * 100 : 0;
  const tgt = targetPrice(currentPrice, atr14d, totalScore);
  const earnWarn = EARNINGS_TICKERS.includes(data.ticker)
    ? `\u26A0 ${data.ticker} yakın zamanda kazanç açıklayabilir. IV crush riskine dikkat edin.`
    : null;

  // Signal (momentum score bazlı) + RSI RED filtresi
  // RSI >= 80 = AŞIRI ALIM → OTOMATİK RED (AAPL RSI 90'a "gir" demek saçmalık)
  // RSI <= 25 = AŞIRI SATIM → CAUTION (reversal potansiyeli ama riskli)
  let sig: string;
  let rsiWarning: string | null = null;

  if (rsi14 >= 80) {
    sig = "OVERBOUGHT_RED";
    rsiWarning = `🚨 RSI ${rsi14.toFixed(1)} = AŞIRI ALIM! Bu hisse çok tehlikeli. Geri çekilme an meselesi. KESİNLİKLE girmeyin.`;
  } else if (rsi14 >= 75) {
    sig = "CAUTION_HOT";
    rsiWarning = `⚠️ RSI ${rsi14.toFixed(1)} = SICAK BÖLGE. Momentum yüksek ama geri çekilme riski çok yüksek. Stop-loss şart, küçük pozisyon.`;
  } else if (rsi14 <= 25) {
    sig = "OVERSOLD_CAUTION";
    rsiWarning = `⚠️ RSI ${rsi14.toFixed(1)} = AŞIRI SATIM. Dönüş potansiyeli var ama yakalanan bıçağa dikkat.`;
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

export function analyzeStockFull(data: StockData): StockResult {
  const result = analyzeStock(data);
  if (!result) {
    throw new Error(`No qualifying momentum result for ${data.ticker}`);
  }

  return result;
}
