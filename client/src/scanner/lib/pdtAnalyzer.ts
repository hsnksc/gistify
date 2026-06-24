/**
 * NASDAQ PDT Momentum Scanner — AI Analyzer v4.2
 * Yeni: Pattern Day Trader kurali, JSON cikti, hem CALL hem PUT
 * PDT kurali: Pozisyon en az 1 gun elde tutma zorunlulugu
 */

import type { StockData } from "./yahooFinance";
import { type AppLanguage, copy } from "@/lib/i18n";

// ===================== TIP TANIMLARI =====================

export interface PdtTechnicalData {
  trend: string;
  rsi7: number;
  rvol: number;
  vwapPosition: "ABOVE" | "BELOW" | "AT";
  orbBreakout: boolean;
  priceChangePercent: number;
  atrPercent: number;
  keySupport: number;
  keyResistance: number;
}

export interface PdtOptionAnalysis {
  signal: "STRONG_BUY" | "BUY" | "NEUTRAL" | "AVOID";
  score: number;
  strategy: string;
  strike: number;
  expiry: string;
  entryCondition: string;
  targetMove: string;
  pop: number;
  riskReward: string;
  maxLoss: string;
  takeProfit: string;
  stopCondition: string;
  kellySize: string;
  pdtNote: string;
}

export interface PdtAnalysis {
  holdRecommendation: "CALL_HOLD" | "PUT_HOLD" | "BOTH_HOLD" | "NO_HOLD";
  overnightRisk: "LOW" | "MEDIUM" | "HIGH";
  catalysts: string[];
  riskFactors: string[];
  earningsWarning: boolean;
  earningsDate: string | null;
}

export interface PdtAnalysisResult {
  ticker: string;
  currentPrice: number;
  overallBias: "BULLISH" | "BEARISH" | "NEUTRAL";
  pdtOvernightScore: number;
  momentumSustainability: "STRONG" | "MODERATE" | "WEAK";
  technicals: PdtTechnicalData;
  call: PdtOptionAnalysis;
  put: PdtOptionAnalysis;
  pdtAnalysis: PdtAnalysis;
  summary: string;
}

// ===================== YARDIMCI FONKSIYONLAR =====================

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

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

function calcAtr(high: number[], low: number[], close: number[], period: number): number {
  if (close.length < period + 1) return 0;
  const trs: number[] = [];
  for (let i = 1; i < close.length; i++) {
    trs.push(Math.max(high[i] - low[i], Math.abs(high[i] - close[i - 1]), Math.abs(low[i] - close[i - 1])));
  }
  return mean(trs.slice(-period));
}

function calcRvol(volume: number[]): number {
  if (volume.length < 20) return 1;
  const todayVol = volume[volume.length - 1];
  const avg20 = mean(volume.slice(-20));
  return avg20 > 0 ? todayVol / avg20 : 1;
}

function calcVwap(high: number[], low: number[], close: number[], volume: number[]): number {
  let cumVol = 0, cumTpVol = 0;
  for (let i = 0; i < close.length; i++) {
    const tp = (high[i] + low[i] + close[i]) / 3;
    cumVol += volume[i];
    cumTpVol += tp * volume[i];
  }
  return cumVol > 0 ? cumTpVol / cumVol : 0;
}

function checkOrbBreakout(high: number[], low: number[], close: number[], open: number[]): boolean {
  // Son 5 barin en yuksegi, acilistan yukari kirdi mi?
  if (high.length < 5 || close.length < 2) return false;
  const recentHigh = Math.max(...high.slice(-5));
  const recentOpen = open[open.length - 1];
  const current = close[close.length - 1];
  return current > recentOpen && recentHigh > recentOpen * 1.01;
}

function calcTrend(close: number[]): string {
  if (close.length < 20) return "UNKNOWN";
  const sma20 = mean(close.slice(-20));
  const sma50 = close.length >= 50 ? mean(close.slice(-50)) : sma20;
  const current = close[close.length - 1];

  if (current > sma20 && sma20 > sma50) return "UPTREND";
  if (current < sma20 && sma20 < sma50) return "DOWNTREND";
  if (current > sma20 && current < sma50) return "RECOVERY";
  if (current < sma20 && current > sma50) return "WEAKENING";
  return "SIDEWAYS";
}

// ===================== CALL SKORLAMA =====================

function scoreCall(tech: PdtTechnicalData): { score: number; signal: PdtOptionAnalysis["signal"] } {
  let score = 50;

  // RSI 50-80 = optimal call bölgesi
  if (tech.rsi7 >= 50 && tech.rsi7 <= 80) score += 20;
  else if (tech.rsi7 > 80) score -= 30;
  else if (tech.rsi7 < 50) score -= 10;

  // RVOL > 2 = güçlü hacim
  if (tech.rvol >= 2) score += 15;
  else if (tech.rvol >= 1) score += 5;
  else score -= 10;

  // VWAP üstü
  if (tech.vwapPosition === "ABOVE") score += 10;
  else if (tech.vwapPosition === "BELOW") score -= 10;

  // ORB breakout
  if (tech.orbBreakout) score += 10;

  // Pozitif değişim
  if (tech.priceChangePercent > 2) score += 10;
  else if (tech.priceChangePercent > 0) score += 5;
  else score -= 5;

  // Uptrend bonus
  if (tech.trend === "UPTREND") score += 10;
  else if (tech.trend === "DOWNTREND") score -= 10;

  score = clamp(score, 0, 100);

  // Sinyal belirle
  let signal: PdtOptionAnalysis["signal"];
  if (score >= 75 && tech.rvol >= 2 && tech.rsi7 >= 50 && tech.rsi7 <= 80) signal = "STRONG_BUY";
  else if (score >= 60 && tech.vwapPosition === "ABOVE") signal = "BUY";
  else if (score >= 45) signal = "NEUTRAL";
  else signal = "AVOID";

  return { score, signal };
}

// ===================== PUT SKORLAMA =====================

function scorePut(tech: PdtTechnicalData): { score: number; signal: PdtOptionAnalysis["signal"] } {
  let score = 50;

  // RSI 20-50 = optimal put bölgesi
  if (tech.rsi7 >= 20 && tech.rsi7 <= 50) score += 20;
  else if (tech.rsi7 < 20) score -= 30;
  else if (tech.rsi7 > 50) score -= 10;

  // RVOL > 2
  if (tech.rvol >= 2) score += 15;
  else if (tech.rvol >= 1) score += 5;
  else score -= 10;

  // VWAP altı
  if (tech.vwapPosition === "BELOW") score += 10;
  else if (tech.vwapPosition === "ABOVE") score -= 10;

  // Negatif değişim
  if (tech.priceChangePercent < -2) score += 10;
  else if (tech.priceChangePercent < 0) score += 5;
  else score -= 5;

  // Downtrend bonus
  if (tech.trend === "DOWNTREND") score += 10;
  else if (tech.trend === "UPTREND") score -= 10;

  score = clamp(score, 0, 100);

  // Put sinyali ters: Düşük skor = güçlü put (fiyat düşecek)
  let signal: PdtOptionAnalysis["signal"];
  if (score <= 25 && tech.rvol >= 2 && tech.rsi7 >= 20 && tech.rsi7 <= 50) signal = "STRONG_BUY";
  else if (score <= 40 && tech.vwapPosition === "BELOW") signal = "BUY";
  else if (score <= 55) signal = "NEUTRAL";
  else signal = "AVOID";

  return { score, signal };
}

// ===================== STRATEJI SEÇİMİ =====================

function selectCallStrategy(rsi7: number, score: number): { strategy: string; otmPct: number } {
  if (rsi7 > 70) return { strategy: "Bull Call Spread", otmPct: 0.08 };
  if (rsi7 >= 50 && rsi7 <= 70) return { strategy: score >= 75 ? "Long Call" : "Bull Call Spread", otmPct: 0.05 };
  return { strategy: "Bull Put Spread", otmPct: 0.05 };
}

function selectPutStrategy(rsi7: number, score: number): { strategy: string; otmPct: number } {
  if (rsi7 < 30) return { strategy: "Bear Put Spread", otmPct: 0.08 };
  if (rsi7 >= 30 && rsi7 <= 50) return { strategy: score <= 25 ? "Long Put" : "Bear Put Spread", otmPct: 0.05 };
  return { strategy: "Bear Call Spread", otmPct: 0.05 };
}

// ===================== POP HESAPLAMA =====================

function calcPop(direction: "CALL" | "PUT", currentPrice: number, strike: number, atrPct: number, dte: number): number {
  // Basit POP hesaplama: fiyatın strike'a ulaşma olasılığı
  const distance = Math.abs(strike - currentPrice) / currentPrice;
  const dailyMove = atrPct / 100;
  const daysNeeded = distance / Math.max(dailyMove, 0.001);

  if (direction === "CALL") {
    if (strike <= currentPrice) return 65; // ITM
    const prob = Math.max(5, Math.min(95, 100 - (distance / (dailyMove * Math.sqrt(dte / 5))) * 100));
    return Math.round(prob);
  } else {
    if (strike >= currentPrice) return 65; // ITM
    const prob = Math.max(5, Math.min(95, 100 - (distance / (dailyMove * Math.sqrt(dte / 5))) * 100));
    return Math.round(prob);
  }
}

// ===================== KELLY SIZING =====================

function kellySizing(pop: number, riskReward: number): string {
  const winProb = pop / 100;
  const edge = winProb - (1 / (riskReward + 1));
  const kelly = Math.max(0, edge / (1 / riskReward)) * 100;

  if (kelly >= 2.0) return `NLV %2.0`;
  if (kelly >= 1.5) return `NLV %1.5`;
  if (kelly >= 1.0) return `NLV %1.0`;
  if (kelly >= 0.5) return `NLV %0.5`;
  return `NLV %0.3 (kucuk)`;
}

// ===================== PDT OVERNIGHT SCORE =====================

function calcPdtOvernightScore(tech: PdtTechnicalData): number {
  let score = 50;

  // Trend güçlüyse gecelik tutma daha güvenli
  if (tech.trend === "UPTREND") score += 20;
  else if (tech.trend === "DOWNTREND") score -= 20;

  // Yüksek RVOL = momentum devam edebilir
  if (tech.rvol >= 2) score += 15;
  else if (tech.rvol < 1) score -= 10;

  // RSI 50-70 = güvenli bölge
  if (tech.rsi7 >= 50 && tech.rsi7 <= 70) score += 10;
  else if (tech.rsi7 > 80 || tech.rsi7 < 20) score -= 15;

  // Pozitif değişim
  if (tech.priceChangePercent > 1) score += 10;
  else if (tech.priceChangePercent < -1) score -= 10;

  // ATR yüksekse gecelik risk artar
  if (tech.atrPercent > 5) score -= 10;
  else if (tech.atrPercent < 2) score += 5;

  return clamp(score, 0, 100);
}

// ===================== MOMENTUM SUSTAINABILITY =====================

function calcMomentumSustainability(tech: PdtTechnicalData): "STRONG" | "MODERATE" | "WEAK" {
  let points = 0;
  if (tech.trend === "UPTREND" || tech.trend === "RECOVERY") points += 2;
  if (tech.rvol >= 2) points += 2;
  if (tech.rsi7 >= 50 && tech.rsi7 <= 75) points += 1;
  if (tech.vwapPosition === "ABOVE") points += 1;
  if (tech.orbBreakout) points += 1;
  if (tech.priceChangePercent > 2) points += 1;

  if (points >= 6) return "STRONG";
  if (points >= 3) return "MODERATE";
  return "WEAK";
}

// ===================== HOLD RECOMMENDATION =====================

function calcHoldRecommendation(callScore: number, putScore: number): PdtAnalysis["holdRecommendation"] {
  // Put skoru ters: düşük = güçlü put
  const callStrength = callScore;
  const putStrength = 100 - putScore; // Ters çevir

  if (callStrength >= 60 && putStrength < 40) return "CALL_HOLD";
  if (putStrength >= 60 && callStrength < 40) return "PUT_HOLD";
  if (callStrength >= 50 && putStrength >= 50) return "BOTH_HOLD";
  return "NO_HOLD";
}

// ===================== OVERNIGHT RISK =====================

function calcOvernightRisk(tech: PdtTechnicalData): PdtAnalysis["overnightRisk"] {
  let risk = 0;
  if (tech.atrPercent > 5) risk += 2;
  if (tech.rvol > 3) risk += 1;
  if (tech.priceChangePercent > 5 || tech.priceChangePercent < -5) risk += 1;
  if (tech.rsi7 > 75 || tech.rsi7 < 25) risk += 1;

  if (risk >= 4) return "HIGH";
  if (risk >= 2) return "MEDIUM";
  return "LOW";
}

// ===================== ÖZET METNİ =====================

function buildSummary(ticker: string, call: PdtOptionAnalysis, put: PdtOptionAnalysis, tech: PdtTechnicalData, pdt: PdtAnalysis, language: AppLanguage): string {
  const parts: string[] = [];

  const trendText = copy(language,
    tech.trend === "UPTREND" ? "yükseliş trendinde" : tech.trend === "DOWNTREND" ? "düşüş trendinde" : "yana hareket ediyor",
    tech.trend === "UPTREND" ? "in an uptrend" : tech.trend === "DOWNTREND" ? "in a downtrend" : "moving sideways"
  );
  parts.push(`${ticker} $${tech.priceChangePercent >= 0 ? "+" : ""}${tech.priceChangePercent.toFixed(2)}% ile ${trendText}.`);

  if (call.signal === "STRONG_BUY" || call.signal === "BUY") {
    const signalLabel = call.signal === "STRONG_BUY"
      ? copy(language, "GÜÇLÜ AL", "STRONG BUY")
      : copy(language, "AL", "BUY");
    parts.push(copy(language,
      `Call sinyali ${signalLabel} — ${call.strategy} ile %${call.targetMove} hedef.`,
      `Call signal ${signalLabel} — ${call.strategy} target %${call.targetMove}.`
    ));
  }

  if (put.signal === "STRONG_BUY" || put.signal === "BUY") {
    const signalLabel = put.signal === "STRONG_BUY"
      ? copy(language, "GÜÇLÜ AL", "STRONG BUY")
      : copy(language, "AL", "BUY");
    parts.push(copy(language,
      `Put sinyali ${signalLabel} — ${put.strategy} ile %${put.targetMove} hedef.`,
      `Put signal ${signalLabel} — ${put.strategy} target %${put.targetMove}.`
    ));
  }

  if (call.signal === "AVOID" && put.signal === "AVOID") {
    parts.push(copy(language, "Her iki yönde de sinyal zayıf — BEKLE.", "Both directions weak — WAIT."));
  }

  const riskText = pdt.overnightRisk === "LOW"
    ? copy(language, "DÜŞÜK", "LOW")
    : pdt.overnightRisk === "MEDIUM"
    ? copy(language, "ORTA", "MEDIUM")
    : copy(language, "YÜKSEK", "HIGH");
  const earningsWarning = pdt.earningsWarning
    ? copy(language, " — Earnings yakın, DİKKAT!", " — Earnings near, CAUTION!")
    : "";
  parts.push(copy(language,
    `Gecelik tutma riski ${riskText}.${earningsWarning}`,
    `Overnight hold risk ${riskText}.${earningsWarning}`
  ));

  return parts.join(" ");
}

// ===================== ANA FONKSIYON =====================

export function analyzePdt(data: StockData, language: AppLanguage = "tr"): PdtAnalysisResult {
  const c = data.close;
  const h = data.high;
  const l = data.low;
  const v = data.volume;
  const o = data.open;
  const current = data.currentPrice;

  // Teknik göstergeler
  const rsi7 = calcRsi(c, 7);
  const rsi14 = calcRsi(c, 14);
  const rvol = calcRvol(v);
  const vwap = calcVwap(h, l, c, v);
  const atr14 = calcAtr(h, l, c, 14);
  const trend = calcTrend(c);
  const orbBreakout = checkOrbBreakout(h, l, c, o);
  const priceChange = ((current - data.prevClose) / data.prevClose) * 100;
  const atrPct = (atr14 / current) * 100;

  // VWAP pozisyonu
  const vwapPos: PdtTechnicalData["vwapPosition"] = current > vwap * 1.005 ? "ABOVE" : current < vwap * 0.995 ? "BELOW" : "AT";

  // Destek/Direnç
  const support = Math.min(...l.slice(-10));
  const resistance = Math.max(...h.slice(-10));

  const tech: PdtTechnicalData = {
    trend,
    rsi7: Math.round(rsi7 * 10) / 10,
    rvol: Math.round(rvol * 100) / 100,
    vwapPosition: vwapPos,
    orbBreakout,
    priceChangePercent: Math.round(priceChange * 100) / 100,
    atrPercent: Math.round(atrPct * 100) / 100,
    keySupport: Math.round(support * 100) / 100,
    keyResistance: Math.round(resistance * 100) / 100,
  };

  // CALL analizi
  const callScore = scoreCall(tech);
  const callStrat = selectCallStrategy(rsi7, callScore.score);
  const callStrike = Math.round(current * (1 + callStrat.otmPct) * 100) / 100;
  const callPop = calcPop("CALL", current, callStrike, atrPct, 14);
  const callRR = callScore.score >= 75 ? 2.5 : callScore.score >= 60 ? 2.0 : 1.5;

  const call: PdtOptionAnalysis = {
    signal: callScore.signal,
    score: callScore.score,
    strategy: callStrat.strategy,
    strike: callStrike,
    expiry: "14-21 DTE",
    entryCondition: callScore.signal === "AVOID"
      ? copy(language, "Giris yok — Sinyal zayif", "No entry — Weak signal")
      : `${current} ${copy(language, "uzeri", "above")}, VWAP ${vwapPos} ${copy(language, "onay", "confirmed")}`,
    targetMove: `+${(callStrat.otmPct * 100).toFixed(1)}%`,
    pop: callPop,
    riskReward: `1:${callRR.toFixed(1)}`,
    maxLoss: callStrat.strategy.includes("Spread")
      ? copy(language, "Net prim (sinirli)", "Net premium (limited)")
      : copy(language, "Odenen prim", "Premium paid"),
    takeProfit: `%${(callRR * callStrat.otmPct * 100 * 0.5).toFixed(0)} ${copy(language, "kar", "profit")}`,
    stopCondition: callStrat.strategy.includes("Spread")
      ? copy(language, "2x prim = stop", "2x premium = stop")
      : copy(language, "%50 prim erimesi = stop", "%50 premium decay = stop"),
    kellySize: kellySizing(callPop, callRR),
    pdtNote: callScore.score >= 60
      ? copy(language,
          `PDT: 1 gun tutma icin uygun. Momentum ${callScore.score >= 75 ? "güclü" : "orta"}, ertesi gun devam olasiligi yüksek.`,
          `PDT: Suitable for 1-day hold. Momentum ${callScore.score >= 75 ? "strong" : "moderate"}, high continuation probability.`
        )
      : copy(language,
          `PDT: 1 gun tutma RISIKLI. Sinyal zayif, gecelik kayip olasiligi var.`,
          `PDT: 1-day hold RISKY. Signal weak, overnight loss risk.`
        ),
  };

  // PUT analizi
  const putScore = scorePut(tech);
  const putStrat = selectPutStrategy(rsi7, putScore.score);
  const putStrike = Math.round(current * (1 - putStrat.otmPct) * 100) / 100;
  const putPop = calcPop("PUT", current, putStrike, atrPct, 14);
  const putRR = putScore.score <= 25 ? 2.5 : putScore.score <= 40 ? 2.0 : 1.5;

  const put: PdtOptionAnalysis = {
    signal: putScore.signal,
    score: putScore.score,
    strategy: putStrat.strategy,
    strike: putStrike,
    expiry: "14-21 DTE",
    entryCondition: putScore.signal === "AVOID"
      ? copy(language, "Giris yok — Sinyal zayif", "No entry — Weak signal")
      : `${current} ${copy(language, "alti", "below")}, VWAP ${vwapPos} ${copy(language, "onay", "confirmed")}`,
    targetMove: `-${(putStrat.otmPct * 100).toFixed(1)}%`,
    pop: putPop,
    riskReward: `1:${putRR.toFixed(1)}`,
    maxLoss: putStrat.strategy.includes("Spread")
      ? copy(language, "Net prim (sinirli)", "Net premium (limited)")
      : copy(language, "Odenen prim", "Premium paid"),
    takeProfit: `%${(putRR * putStrat.otmPct * 100 * 0.5).toFixed(0)} ${copy(language, "kar", "profit")}`,
    stopCondition: putStrat.strategy.includes("Spread")
      ? copy(language, "2x prim = stop", "2x premium = stop")
      : copy(language, "%50 prim erimesi = stop", "%50 premium decay = stop"),
    kellySize: kellySizing(putPop, putRR),
    pdtNote: putScore.score <= 40
      ? copy(language,
          `PDT: 1 gun tutma icin uygun. Asagi momentum ${putScore.score <= 25 ? "güclü" : "orta"}, ertesi gun dusus devam olasiligi.`,
          `PDT: Suitable for 1-day hold. Down momentum ${putScore.score <= 25 ? "strong" : "moderate"}, likely continuation.`
        )
      : copy(language,
          `PDT: 1 gun tutma RISIKLI. Asagi sinyal zayif.`,
          `PDT: 1-day hold RISKY. Down signal weak.`
        ),
  };

  // PDT analizi
  const pdtScore = calcPdtOvernightScore(tech);
  const sustainability = calcMomentumSustainability(tech);
  const holdRec = calcHoldRecommendation(callScore.score, putScore.score);
  const overnightRisk = calcOvernightRisk(tech);

  // Katalizörler ve riskler
  const catalysts: string[] = [];
  if (tech.rvol >= 2) catalysts.push(copy(language, "Yüksek hacimli momentum devami", "High volume momentum continuation"));
  if (tech.orbBreakout) catalysts.push(copy(language, "ORB kirilimi devami", "ORB breakout continuation"));
  if (tech.trend === "UPTREND") catalysts.push(copy(language, "Yükselen trend destegi", "Uptrend support"));
  else if (tech.trend === "DOWNTREND") catalysts.push(copy(language, "Düsüs trendi devami", "Downtrend continuation"));
  if (tech.priceChangePercent > 3) catalysts.push("Güclü gunlük momentum");
  if (catalysts.length === 0) catalysts.push(copy(language, "Teknik seviyelerde hareket beklentisi", "Expected movement at technical levels"));

  const riskFactors: string[] = [];
  if (overnightRisk === "HIGH") riskFactors.push(copy(language, "Yüksek ATR — gecelik sapma riski", "High ATR — overnight deviation risk"));
  if (rsi14 > 75) riskFactors.push(copy(language, "RSI asiri alim — geri cekilme olasiligi", "RSI overbought — pullback risk"));
  if (rsi14 < 25) riskFactors.push(copy(language, "RSI asiri satim — dead cat bounce riski", "RSI oversold — dead cat bounce risk"));
  if (tech.rvol > 4) riskFactors.push(copy(language, "Hacim patlamasi sonrasi yorgunluk", "Volume spike fatigue"));
  if (riskFactors.length === 0) riskFactors.push(copy(language, "Genel piyasa riski", "General market risk"));

  // Earnings kontrolu
  const earningsTickers = ["AAPL","MSFT","AMZN","GOOGL","META","NVDA","TSLA","AVGO","NFLX","AMD","CRM","MRVL","SNOW","PLTR","HOOD","SOFI","ACHR"];
  const hasEarnings = earningsTickers.includes(data.ticker);

  const pdtAnalysis: PdtAnalysis = {
    holdRecommendation: holdRec,
    overnightRisk,
    catalysts,
    riskFactors,
    earningsWarning: hasEarnings,
    earningsDate: hasEarnings ? copy(language, "Yakinda (5 gun icinde olabilir)", "Soon (within 5 days possible)") : null,
  };

  // Overall bias
  let bias: PdtAnalysisResult["overallBias"];
  if (callScore.score >= 60 && putScore.score >= 40) bias = "BULLISH";
  else if (putScore.score <= 40 && callScore.score < 60) bias = "BEARISH";
  else bias = "NEUTRAL";

  // Özet
  const summary = buildSummary(data.ticker, call, put, tech, pdtAnalysis, language);

  return {
    ticker: data.ticker,
    currentPrice: Math.round(current * 100) / 100,
    overallBias: bias,
    pdtOvernightScore: pdtScore,
    momentumSustainability: sustainability,
    technicals: tech,
    call,
    put,
    pdtAnalysis,
    summary,
  };
}

// ===================== JSON ÇIKTI ÜRETİCİ =====================

export function analyzePdtToJson(data: StockData, language: AppLanguage = "tr"): string {
  const result = analyzePdt(data, language);
  return JSON.stringify(result, null, 2);
}

// ===================== ÇOKLU HİSSE ANALİZİ =====================

export async function analyzePdtMultiple(stocks: StockData[], language: AppLanguage = "tr"): Promise<PdtAnalysisResult[]> {
  return stocks.map((s) => analyzePdt(s, language));
}
