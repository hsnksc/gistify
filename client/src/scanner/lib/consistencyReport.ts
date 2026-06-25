/**
 * Consistency Report Engine
 * Backtest sonuçlarını istatistiksel olarak analiz edip tutarlılık raporu üretir.
 */

import type { BacktestSummary, DailyTrade } from "./backtestEngine";
import { type AppLanguage, copy } from "@/lib/i18n";

// ===================== Tipler =====================

export interface ConsistencyReport {
  overallGrade: "A" | "B" | "C" | "D" | "F";
  overallScore: number; // 0-100
  summary: string;

  // 1. Win Rate Tutarlılığı
  winRateConsistency: {
    grade: string;
    overallWinRate: number;
    monthlyWinRates: Array<{ period: string; winRate: number; trades: number }>;
    stdDeviation: number;
    coefficientOfVariation: number;
    isConsistent: boolean;
    interpretation: string;
  };

  // 2. Skor → P&L İlişkisi
  scorePnLCorrelation: {
    grade: string;
    pearsonR: number;
    interpretation: string;
    scoreRanges: Array<{ range: string; avgPnL: number; winRate: number; trades: number }>;
    optimalThreshold: number;
  };

  // 3. Gün İçi Tutarlılık
  dailyConsistency: {
    grade: string;
    avgTradesPerDay: number;
    dailyPnLStdDev: number;
    maxConsecutiveWins: number;
    maxConsecutiveLosses: number;
    streakAnalysis: string;
  };

  // 4. Risk Metrikleri
  riskMetrics: {
    grade: string;
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdownPct: number;
    calmarRatio: number;
    avgWinToAvgLoss: number;
    expectancy: number;
    riskOfRuin: number;
  };

  // 5. Faktör Analizi
  factorAnalysis: {
    grade: string;
    bestPerformingDay: string;
    worstPerformingDay: string;
    rvolEffect: string;
    rsiEffect: string;
    gapEffect: string;
  };

  // 6. Öneriler
  recommendations: string[];

  // 7. Zaman Serisi
  timeSeries: Array<{
    date: string;
    cumulativePnL: number;
    dailyPnL: number;
    winRate: number;
    drawdown: number;
  }>;
}

// ===================== Yardımcı Fonksiyonlar =====================

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0 || n !== y.length) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((s, xi, i) => s + xi * y[i], 0);
  const sumX2 = x.reduce((s, xi) => s + xi * xi, 0);
  const sumY2 = y.reduce((s, yi) => s + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function gradeFromScore(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

function gradeLabel(grade: string, language: AppLanguage = "tr"): string {
  const labels: Record<string, string> = {
    A: copy(language, "Mükemmel", "Excellent"),
    B: copy(language, "İyi", "Good"),
    C: copy(language, "Ortalama", "Average"),
    D: copy(language, "Zayıf", "Weak"),
    F: copy(language, "Kötü", "Poor"),
  };
  return labels[grade] || copy(language, "Bilinmiyor", "Unknown");
}

// ===================== Ana Rapor Fonksiyonu =====================

export function generateConsistencyReport(summary: BacktestSummary, language: AppLanguage = "tr"): ConsistencyReport {
  const trades = summary.trades;
  if (trades.length === 0) {
    return generateEmptyReport(language);
  }

  // 1. Win Rate Tutarlılığı
  const winRateConsistency = analyzeWinRateConsistency(trades, language);

  // 2. Skor → P&L Korelasyonu
  const scorePnLCorrelation = analyzeScorePnLCorrelation(trades, language);

  // 3. Gün İçi Tutarlılık
  const dailyConsistency = analyzeDailyConsistency(trades, summary.dailyReturns, language);

  // 4. Risk Metrikleri
  const riskMetrics = analyzeRiskMetrics(trades, summary);

  // 5. Faktör Analizi
  const factorAnalysis = analyzeFactors(trades, language);

  // 6. Zaman Serisi
  const timeSeries = buildTimeSeries(summary);

  // 7. Genel Skor
  const weights = {
    winRate: 0.25,
    correlation: 0.20,
    daily: 0.20,
    risk: 0.25,
    factor: 0.10,
  };

  const winRateScore = winRateConsistency.isConsistent ? 80 : winRateConsistency.coefficientOfVariation < 0.3 ? 60 : 40;
  const corrScore = Math.abs(scorePnLCorrelation.pearsonR) > 0.3 ? 80 : Math.abs(scorePnLCorrelation.pearsonR) > 0.1 ? 50 : 30;
  const dailyScore = dailyConsistency.maxConsecutiveLosses <= 3 ? 80 : dailyConsistency.maxConsecutiveLosses <= 5 ? 60 : 40;
  const riskScore = riskMetrics.sharpeRatio > 1.5 ? 90 : riskMetrics.sharpeRatio > 1 ? 70 : riskMetrics.sharpeRatio > 0.5 ? 50 : 30;
  const factorScore = 60; // Basit

  const overallScore = Math.round(
    winRateScore * weights.winRate +
    corrScore * weights.correlation +
    dailyScore * weights.daily +
    riskScore * weights.risk +
    factorScore * weights.factor
  );

  const overallGrade = gradeFromScore(overallScore);

  // 8. Özet & Öneriler
  const summaryText = buildSummary(overallGrade, overallScore, winRateConsistency, riskMetrics, scorePnLCorrelation, language);
  const recommendations = buildRecommendations(winRateConsistency, scorePnLCorrelation, dailyConsistency, riskMetrics, language);

  return {
    overallGrade,
    overallScore,
    summary: summaryText,
    winRateConsistency,
    scorePnLCorrelation,
    dailyConsistency,
    riskMetrics,
    factorAnalysis,
    recommendations,
    timeSeries,
  };
}

// ===================== Analiz Fonksiyonları =====================

function analyzeWinRateConsistency(trades: DailyTrade[], language: AppLanguage = "tr") {
  // Aylık dönemlere göre win rate hesapla
  const monthly: Record<string, { wins: number; total: number }> = {};

  for (const t of trades) {
    const month = t.date.substring(0, 7); // YYYY-MM
    if (!monthly[month]) monthly[month] = { wins: 0, total: 0 };
    monthly[month].total++;
    if (t.pnlPct > 0) monthly[month].wins++;
  }

  const monthlyWinRates = Object.entries(monthly).map(([period, data]) => ({
    period,
    winRate: data.total > 0 ? Math.round((data.wins / data.total) * 1000) / 10 : 0,
    trades: data.total,
  }));

  const winRates = monthlyWinRates.map((m) => m.winRate);
  const stdDev = standardDeviation(winRates);
  const meanWinRate = winRates.reduce((a, b) => a + b, 0) / winRates.length;
  const cv = meanWinRate > 0 ? stdDev / meanWinRate : 0;

  // Genel win rate
  const totalWins = trades.filter((t) => t.pnlPct > 0).length;
  const overallWinRate = trades.length > 0 ? Math.round((totalWins / trades.length) * 1000) / 10 : 0;

  const isConsistent = cv < 0.2 && monthlyWinRates.length >= 2;

  const grade = isConsistent ? "A" : cv < 0.3 ? "B" : cv < 0.5 ? "C" : "D";

  const interpretation = isConsistent
    ? copy(language,
        `Win rate aylık dönemlerde tutarlı (CV: ${(cv * 100).toFixed(1)}%). Strateji farklı piyasa koşullarında benzer performans gösteriyor.`,
        `Win rate consistent across monthly periods (CV: ${(cv * 100).toFixed(1)}%). Strategy shows similar performance in different market conditions.`
      )
    : copy(language,
        `Win rate aylık dönemlerde değişken (CV: ${(cv * 100).toFixed(1)}%). Bazı dönemlerde performans düşüşü var.`,
        `Win rate variable across monthly periods (CV: ${(cv * 100).toFixed(1)}%). Performance declines in some periods.`
      );

  return {
    grade,
    overallWinRate,
    monthlyWinRates,
    stdDeviation: Math.round(stdDev * 10) / 10,
    coefficientOfVariation: Math.round(cv * 100) / 100,
    isConsistent,
    interpretation,
  };
}

function analyzeScorePnLCorrelation(trades: DailyTrade[], language: AppLanguage = "tr") {
  const scores = trades.map((t) => t.score);
  const pnls = trades.map((t) => t.pnlPct);

  const r = pearsonCorrelation(scores, pnls);

  // Skor aralıklarına göre performans
  const ranges = [
    { min: 75, max: 100, label: "75-100" },
    { min: 65, max: 74, label: "65-74" },
    { min: 55, max: 64, label: "55-64" },
    { min: 45, max: 54, label: "45-54" },
    { min: 0, max: 44, label: "0-44" },
  ];

  const scoreRanges = ranges.map((range) => {
    const subset = trades.filter((t) => t.score >= range.min && t.score <= range.max);
    const wins = subset.filter((t) => t.pnlPct > 0);
    const avgPnL = subset.length > 0 ? subset.reduce((s, t) => s + t.pnlPct, 0) / subset.length : 0;
    return {
      range: range.label,
      avgPnL: Math.round(avgPnL * 100) / 100,
      winRate: subset.length > 0 ? Math.round((wins.length / subset.length) * 1000) / 10 : 0,
      trades: subset.length,
    };
  }).filter((s) => s.trades > 0);

  // Optimal threshold: En yüksek avgPnL veren skor aralığının alt sınırı
  const bestRange = scoreRanges.reduce((best, current) => current.avgPnL > best.avgPnL ? current : best, scoreRanges[0]);
  const optimalThreshold = bestRange ? parseInt(bestRange.range.split("-")[0]) : 60;

  const grade = Math.abs(r) > 0.4 ? "A" : Math.abs(r) > 0.25 ? "B" : Math.abs(r) > 0.1 ? "C" : "D";

  const interpretation = Math.abs(r) > 0.4
    ? copy(language,
        `Momentum skoru ile P&L arasında güçlü ${r > 0 ? "pozitif" : "negatif"} korelasyon (r=${r.toFixed(2)}). Yüksek skorlu hisseler gerçekten daha iyi performans gösteriyor.`,
        `Strong ${r > 0 ? "positive" : "negative"} correlation between momentum score and P&L (r=${r.toFixed(2)}). High-scoring stocks indeed perform better.`
      )
    : Math.abs(r) > 0.1
    ? copy(language,
        `Zayıf korelasyon (r=${r.toFixed(2)}). Skor sisteminde iyileştirme gerekebilir.`,
        `Weak correlation (r=${r.toFixed(2)}). Score system may need improvement.`
      )
    : copy(language,
        `Korelasyon yok (r=${r.toFixed(2)}). Momentum skoru P&L'yi açıklamıyor - sistem kritik hata.`,
        `No correlation (r=${r.toFixed(2)}). Momentum score does not explain P&L — critical system error.`
      );

  return {
    grade,
    pearsonR: Math.round(r * 100) / 100,
    interpretation,
    scoreRanges,
    optimalThreshold,
  };
}

function analyzeDailyConsistency(trades: DailyTrade[], dailyReturns: Array<{ date: string; pnl: number }>, language: AppLanguage = "tr") {
  const dailyPnLs = dailyReturns.map((d) => d.pnl);
  const avgTradesPerDay = trades.length / (dailyReturns.length || 1);

  // Streak analizi
  let maxWins = 0, maxLosses = 0, currentWins = 0, currentLosses = 0;
  for (const dr of dailyReturns) {
    if (dr.pnl > 0) {
      currentWins++;
      currentLosses = 0;
      if (currentWins > maxWins) maxWins = currentWins;
    } else {
      currentLosses++;
      currentWins = 0;
      if (currentLosses > maxLosses) maxLosses = currentLosses;
    }
  }

  const dailyPnLStdDev = standardDeviation(dailyPnLs);

  const grade = maxLosses <= 2 ? "A" : maxLosses <= 4 ? "B" : maxLosses <= 6 ? "C" : "D";

  const streakAnalysis = maxLosses <= 2
    ? copy(language,
        `Kısa zarar serileri (${maxLosses} gün). Strateji hızlı toparlanıyor.`,
        `Short loss streaks (${maxLosses} days). Strategy recovers quickly.`
      )
    : maxLosses <= 4
    ? copy(language,
        `Orta uzunlukta zarar serileri (${maxLosses} gün). Dikkatli olunmalı.`,
        `Medium loss streaks (${maxLosses} days). Caution advised.`
      )
    : copy(language,
        `Uzun zarar serileri (${maxLosses} gün). Risk yönetimi gözden geçirilmeli.`,
        `Long loss streaks (${maxLosses} days). Risk management should be reviewed.`
      );

  return {
    grade,
    avgTradesPerDay: Math.round(avgTradesPerDay * 10) / 10,
    dailyPnLStdDev: Math.round(dailyPnLStdDev * 100) / 100,
    maxConsecutiveWins: maxWins,
    maxConsecutiveLosses: maxLosses,
    streakAnalysis,
  };
}

function analyzeRiskMetrics(trades: DailyTrade[], summary: BacktestSummary) {
  const wins = trades.filter((t) => t.pnlPct > 0);
  const losses = trades.filter((t) => t.pnlPct <= 0);

  const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.pnlPct, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((s, t) => s + t.pnlPct, 0) / losses.length : 0;

  // Sortino ratio (sadece downside volatility)
  const downsideDeviations = trades.filter((t) => t.pnlPct < 0).map((t) => t.pnlPct ** 2);
  const downsideStdDev = downsideDeviations.length > 0
    ? Math.sqrt(downsideDeviations.reduce((a, b) => a + b, 0) / downsideDeviations.length)
    : 1;

  const dailyPnLs = summary.dailyReturns.map((d) => d.pnl);
  const meanDaily = dailyPnLs.reduce((a, b) => a + b, 0) / (dailyPnLs.length || 1);
  const sortino = downsideStdDev > 0 ? meanDaily / downsideStdDev : 0;

  // Calmar ratio (annualized return / max drawdown)
  const calmar = summary.maxDrawdownPct > 0 ? (summary.totalPnLPct / (summary.totalTradingDays || 1) * 252) / summary.maxDrawdownPct : 0;

  // Expectancy
  const winProb = wins.length / trades.length;
  const lossProb = losses.length / trades.length;
  const expectancy = (winProb * avgWin) + (lossProb * avgLoss);

  // Risk of ruin (basit model)
  const riskOfRuin = avgLoss < 0 && expectancy > 0
    ? Math.pow(-avgLoss / avgWin, winProb * 100)
    : 1;

  const grade = summary.sharpeRatio > 1.5 ? "A" : summary.sharpeRatio > 1 ? "B" : summary.sharpeRatio > 0.5 ? "C" : "D";

  return {
    grade,
    sharpeRatio: summary.sharpeRatio,
    sortinoRatio: Math.round(sortino * 100) / 100,
    maxDrawdownPct: summary.maxDrawdownPct,
    calmarRatio: Math.round(calmar * 100) / 100,
    avgWinToAvgLoss: avgLoss !== 0 ? Math.round(Math.abs(avgWin / avgLoss) * 100) / 100 : 0,
    expectancy: Math.round(expectancy * 100) / 100,
    riskOfRuin: Math.round(riskOfRuin * 1000) / 10,
  };
}

function analyzeFactors(trades: DailyTrade[], language: AppLanguage = "tr") {
  // Güne göre performans
  const dayNames = (lang: AppLanguage) => [
    copy(lang, "Pazar", "Sunday"),
    copy(lang, "Pazartesi", "Monday"),
    copy(lang, "Salı", "Tuesday"),
    copy(lang, "Çarşamba", "Wednesday"),
    copy(lang, "Perşembe", "Thursday"),
    copy(lang, "Cuma", "Friday"),
    copy(lang, "Cumartesi", "Saturday"),
  ];
  const dayStats: Record<number, { pnl: number; count: number }> = {};
  for (const t of trades) {
    const dow = t.dayOfWeek;
    if (!dayStats[dow]) dayStats[dow] = { pnl: 0, count: 0 };
    dayStats[dow].pnl += t.pnlPct;
    dayStats[dow].count++;
  }

  let bestDay = copy(language, "Bilinmiyor", "Unknown"), worstDay = copy(language, "Bilinmiyor", "Unknown");
  let bestAvg = -Infinity, worstAvg = Infinity;
  for (const [dow, stat] of Object.entries(dayStats)) {
    const avg = stat.pnl / stat.count;
    if (avg > bestAvg) { bestAvg = avg; bestDay = dayNames(language)[parseInt(dow)]; }
    if (avg < worstAvg) { worstAvg = avg; worstDay = dayNames(language)[parseInt(dow)]; }
  }

  // RVOL etkisi
  const highRvol = trades.filter((t) => t.rvol >= 2);
  const lowRvol = trades.filter((t) => t.rvol < 1.5);
  const highRvolWinRate = highRvol.length > 0 ? (highRvol.filter((t) => t.pnlPct > 0).length / highRvol.length) * 100 : 0;
  const lowRvolWinRate = lowRvol.length > 0 ? (lowRvol.filter((t) => t.pnlPct > 0).length / lowRvol.length) * 100 : 0;

  // RSI etkisi
  const highRsi = trades.filter((t) => t.rsi >= 70);
  const medRsi = trades.filter((t) => t.rsi >= 50 && t.rsi < 70);
  const highRsiAvg = highRsi.length > 0 ? highRsi.reduce((s, t) => s + t.pnlPct, 0) / highRsi.length : 0;
  const medRsiAvg = medRsi.length > 0 ? medRsi.reduce((s, t) => s + t.pnlPct, 0) / medRsi.length : 0;

  const grade = "B";

  return {
    grade,
    bestPerformingDay: `${bestDay} (${copy(language, "ort.", "avg")} ${bestAvg.toFixed(2)}%)`,
    worstPerformingDay: `${worstDay} (${copy(language, "ort.", "avg")} ${worstAvg.toFixed(2)}%)`,
    rvolEffect: copy(language,
    `Yüksek RVOL (≥2x) win rate: %${highRvolWinRate.toFixed(0)} | Düşük RVOL (<1.5x): %${lowRvolWinRate.toFixed(0)}`,
    `High RVOL (≥2x) win rate: %${highRvolWinRate.toFixed(0)} | Low RVOL (<1.5x): %${lowRvolWinRate.toFixed(0)}`
  ),
    rsiEffect: copy(language,
    `Yüksek RSI (≥70) ort. P&L: ${highRsiAvg.toFixed(2)}% | Orta RSI (50-70): ${medRsiAvg.toFixed(2)}%`,
    `High RSI (≥70) avg P&L: ${highRsiAvg.toFixed(2)}% | Med RSI (50-70): ${medRsiAvg.toFixed(2)}%`
  ),
    gapEffect: copy(language, "Analiz için yeterli veri yok", "Not enough data for analysis"),
  };
}

function buildTimeSeries(summary: BacktestSummary): Array<{
  date: string;
  cumulativePnL: number;
  dailyPnL: number;
  winRate: number;
  drawdown: number;
}> {
  let cumPnL = 0;
  let peak = 0;
  const series: Array<{
    date: string;
    cumulativePnL: number;
    dailyPnL: number;
    winRate: number;
    drawdown: number;
  }> = [];

  // Sliding window win rate
  const window = 10;

  for (let i = 0; i < summary.dailyReturns.length; i++) {
    const dr = summary.dailyReturns[i];
    cumPnL += dr.pnl;
    if (cumPnL > peak) peak = cumPnL;
    const drawdown = peak - cumPnL;

    const windowStart = Math.max(0, i - window + 1);
    const windowData = summary.dailyReturns.slice(windowStart, i + 1);
    const windowWins = windowData.filter((d) => d.pnl > 0).length;
    const slidingWinRate = windowData.length > 0 ? (windowWins / windowData.length) * 100 : 0;

    series.push({
      date: dr.date,
      cumulativePnL: Math.round(cumPnL * 100) / 100,
      dailyPnL: dr.pnl,
      winRate: Math.round(slidingWinRate * 10) / 10,
      drawdown: Math.round(drawdown * 100) / 100,
    });
  }

  return series;
}

function buildSummary(
  grade: string,
  score: number,
  wr: { isConsistent: boolean; overallWinRate: number },
  risk: { sharpeRatio: number; expectancy: number },
  corr: { pearsonR: number },
  language: AppLanguage = "tr"
): string {
  return copy(language,
    `Sistem tutarlılık notu: ${grade} (${score}/100). Genel win rate %${wr.overallWinRate}. ${
      wr.isConsistent ? "Aylık performans tutarlı." : "Aylık performans dalgalanmaları mevcut."
    } Skor-P&L korelasyonu r=${corr.pearsonR}. Sharpe ratio ${risk.sharpeRatio}. İşlem başı beklenen getiri ${risk.expectancy}%.`,
    `System consistency grade: ${grade} (${score}/100). Overall win rate %${wr.overallWinRate}. ${
      wr.isConsistent ? "Monthly performance consistent." : "Monthly performance fluctuations present."
    } Score-P&L correlation r=${corr.pearsonR}. Sharpe ratio ${risk.sharpeRatio}. Expected return per trade ${risk.expectancy}%.`
  );
}

function buildRecommendations(
  wr: { isConsistent: boolean; coefficientOfVariation: number },
  corr: { pearsonR: number; optimalThreshold: number },
  daily: { maxConsecutiveLosses: number },
  risk: { sharpeRatio: number; riskOfRuin: number },
  language: AppLanguage = "tr"
): string[] {
  const recs: string[] = [];

  if (!wr.isConsistent) {
    recs.push(copy(language,
    `Win rate tutarlılığı düşük (CV: ${(wr.coefficientOfVariation * 100).toFixed(0)}%). Farklı piyasa rejimlerine (yüksek/düşük volatilite) göre adaptif threshold kullanın.`,
    `Win rate consistency low (CV: ${(wr.coefficientOfVariation * 100).toFixed(0)}%). Use adaptive thresholds for different market regimes (high/low volatility).`
  ));
  }

  if (Math.abs(corr.pearsonR) < 0.2) {
    recs.push(copy(language,
    "Momentum skoru ile P&L arasında zayıf ilişki. Faktör ağırlıklarını yeniden kalibre edin.",
    "Weak relationship between momentum score and P&L. Recalibrate factor weights."
  ));
  }

  recs.push(copy(language,
    `Optimal entry threshold: ${corr.optimalThreshold} skor. Bu seviyenin üzerindeki hisseler daha tutarlı performans gösteriyor.`,
    `Optimal entry threshold: ${corr.optimalThreshold} score. Stocks above this level show more consistent performance.`
  ));

  if (daily.maxConsecutiveLosses > 4) {
    recs.push(copy(language,
    `Uzun zarar serileri (${daily.maxConsecutiveLosses} gün). Günlük max pozisyon sınırını azaltın veya piyasa rejimine göre pozisyon büyüklüğünü ayarlayın.`,
    `Long loss streaks (${daily.maxConsecutiveLosses} days). Reduce daily max position limit or adjust position size by market regime.`
  ));
  }

  if (risk.sharpeRatio < 1) {
    recs.push(copy(language,
    "Sharpe ratio 1'in altında. TP/SL oranını iyileştirmek için TP %'sini artırın veya SL %'sini düşürün.",
    "Sharpe ratio below 1. Improve TP/SL ratio by increasing TP % or decreasing SL %."
  ));
  }

  if (risk.riskOfRuin > 5) {
    recs.push(copy(language,
    "Risk of ruin yüksek. Pozisyon büyüklüğünü azaltın veya daha katı entry kriterleri uygulayın.",
    "Risk of ruin high. Reduce position size or apply stricter entry criteria."
  ));
  }

  recs.push(copy(language,
    "Raporu periyodik olarak (ayda bir) çalıştırarak sistem parametrelerinin hâlâ optimal olduğunu doğrulayın.",
    "Run this report periodically (monthly) to verify system parameters remain optimal."
  ));

  return recs;
}

function generateEmptyReport(language: AppLanguage = "tr"): ConsistencyReport {
  return {
    overallGrade: "F",
    overallScore: 0,
    summary: copy(language, "Yetersiz veri. Backtest çalıştırılmamış veya hiç trade üretilmemiş.", "Insufficient data. Backtest not run or no trades generated."),
    winRateConsistency: { grade: "F", overallWinRate: 0, monthlyWinRates: [], stdDeviation: 0, coefficientOfVariation: 0, isConsistent: false, interpretation: copy(language, "Veri yok", "No data") },
    scorePnLCorrelation: { grade: "F", pearsonR: 0, interpretation: copy(language, "Veri yok", "No data"), scoreRanges: [], optimalThreshold: 60 },
    dailyConsistency: { grade: "F", avgTradesPerDay: 0, dailyPnLStdDev: 0, maxConsecutiveWins: 0, maxConsecutiveLosses: 0, streakAnalysis: copy(language, "Veri yok", "No data") },
    riskMetrics: { grade: "F", sharpeRatio: 0, sortinoRatio: 0, maxDrawdownPct: 0, calmarRatio: 0, avgWinToAvgLoss: 0, expectancy: 0, riskOfRuin: 0 },
    factorAnalysis: { grade: "F", bestPerformingDay: "", worstPerformingDay: "", rvolEffect: "", rsiEffect: "", gapEffect: "" },
    recommendations: [copy(language, "Önce backtest çalıştırın.", "Run backtest first.")],
    timeSeries: [],
  };
}
