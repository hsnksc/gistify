/**
 * Microstructure Check v4.3
 * PDF'den entegre: 1 dk barlarda fiyat yorgunluğu tespiti
 * "Bearish Reversal Risk" uyarısı — teknik skor yüksek olsa bile
 */

export interface MicrostructureResult {
  isTired: boolean;               // Fiyat yoruldu mu?
  reversalRisk: "LOW" | "MEDIUM" | "HIGH";
  lowerLowCount: number;          // Ardışık Lower Low sayısı
  lowerHighCount: number;         // Ardışık Lower High sayısı
  volumeDeclining: boolean;       // Hacim düşüyor mu?
  wickRatio: number;              // Fitil oranı (0-1)
  microScore: number;             // 0-100 arası (yüksek = kötü)
  warning: string | null;         // Uyarı mesajı
}

/**
 * 1 dk bar dizisinden yorgunluk analizi
 * Gerçek uygulamada 1dk barlar API'den gelir (Alpaca, Polygon, vb.)
 * Fallback: Günlük barları kullanarak proxy hesaplama
 */
export function checkMicrostructure(
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[],
): MicrostructureResult {
  if (highs.length < 5 || lows.length < 5 || closes.length < 5) {
    return {
      isTired: false,
      reversalRisk: "LOW",
      lowerLowCount: 0,
      lowerHighCount: 0,
      volumeDeclining: false,
      wickRatio: 0,
      microScore: 0,
      warning: null,
    };
  }

  const n = closes.length;

  // 1. Ardışık Lower Low tespiti
  let lowerLowCount = 0;
  for (let i = n - 1; i > 0; i--) {
    if (lows[i] < lows[i - 1]) {
      lowerLowCount++;
    } else {
      break;
    }
  }

  // 2. Ardışık Lower High tespiti
  let lowerHighCount = 0;
  for (let i = n - 1; i > 0; i--) {
    if (highs[i] < highs[i - 1]) {
      lowerHighCount++;
    } else {
      break;
    }
  }

  // 3. Hacim düşüşü (son 5 bar)
  const recentVolumes = volumes.slice(-5);
  const avgVol = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length;
  const lastVol = volumes[volumes.length - 1];
  const volumeDeclining = lastVol < avgVol * 0.7; // Son bar hacim ortalamanın %70 altında

  // 4. Fitil oranı (son bar)
  const lastHigh = highs[highs.length - 1];
  const lastLow = lows[lows.length - 1];
  const lastClose = closes[closes.length - 1];
  const lastOpen = closes[closes.length - 2] || lastLow; // Yaklaşık
  const range = lastHigh - lastLow;

  let wickRatio = 0;
  if (range > 0) {
    const upperWick = lastHigh - Math.max(lastClose, lastOpen);
    const lowerWick = Math.min(lastClose, lastOpen) - lastLow;
    const totalWick = upperWick + lowerWick;
    wickRatio = totalWick / range; // 0 = fitil yok, 1 = tamamen fitil
  }

  // 5. Yorgunluk skoru hesaplama (0-100)
  let microScore = 0;

  // Lower Low her biri +15 puan
  microScore += Math.min(lowerLowCount * 15, 45);

  // Lower High her biri +10 puan
  microScore += Math.min(lowerHighCount * 10, 30);

  // Hacim düşüşü +15 puan
  if (volumeDeclining) microScore += 15;

  // Fitil oranı (0.5 üstü = yorgunluk) +20 puan max
  if (wickRatio > 0.5) {
    microScore += Math.min((wickRatio - 0.5) * 40, 20);
  }

  microScore = Math.min(100, microScore);

  // 6. Reversal risk belirleme
  let reversalRisk: "LOW" | "MEDIUM" | "HIGH";
  if (microScore >= 70) reversalRisk = "HIGH";
  else if (microScore >= 40) reversalRisk = "MEDIUM";
  else reversalRisk = "LOW";

  // 7. Yorgunluk tespiti
  const isTired = microScore >= 50;

  // 8. Uyarı mesajı
  let warning: string | null = null;
  if (reversalRisk === "HIGH") {
    warning = `🚨 BEARISH REVERSAL RİSKİ! Son ${lowerLowCount} bar Lower Low + hacim düşüyor. Teknik skor yüksek olsa bile DİKKAT!`;
  } else if (reversalRisk === "MEDIUM") {
    warning = `⚠️ Yorgunluk sinyalleri: ${lowerLowCount} Lower Low, fitil oranı %${(wickRatio * 100).toFixed(0)}`;
  }

  return {
    isTired,
    reversalRisk,
    lowerLowCount,
    lowerHighCount,
    volumeDeclining,
    wickRatio: Math.round(wickRatio * 100) / 100,
    microScore: Math.round(microScore),
    warning,
  };
}

/**
 * Microstructure sonucunu momentum sinyaline entegre et
 * PDF mantığı: Teknik skor yüksek olsa bile yorgunluk varsa sinyal zayıflatılır
 */
export function integrateMicrostructure(
  signal: string,
  score: number,
  micro: MicrostructureResult,
): { signal: string; score: number; warning: string | null } {
  if (micro.reversalRisk === "HIGH") {
    // Skoru %40 düşür, sinyal bir seviye aşağı çek
    const adjustedScore = Math.round(score * 0.6);
    let adjustedSignal = signal;

    if (signal === "STRONG_BUY") adjustedSignal = "BUY";
    else if (signal === "BUY") adjustedSignal = "NEUTRAL_BULLISH";
    else if (signal === "NEUTRAL_BULLISH") adjustedSignal = "NEUTRAL";

    return {
      signal: adjustedSignal,
      score: adjustedScore,
      warning: micro.warning,
    };
  }

  if (micro.reversalRisk === "MEDIUM") {
    // Skoru %15 düşür
    const adjustedScore = Math.round(score * 0.85);
    return {
      signal,
      score: adjustedScore,
      warning: micro.warning,
    };
  }

  return { signal, score, warning: null };
}

/**
 * Günlük barlardan proxy microstructure hesaplama
 * 1 dk bar yoksa günlük barlarla yaklaşık hesap
 */
export function checkMicrostructureDaily(
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[],
): MicrostructureResult {
  // Günlük barlarda daha yüksek threshold kullan
  const result = checkMicrostructure(highs, lows, closes, volumes);

  // Günlük barlar daha az hassas — skoru düşür
  result.microScore = Math.round(result.microScore * 0.7);
  result.isTired = result.microScore >= 60; // Daha yüksek threshold

  if (result.reversalRisk === "HIGH" && result.microScore < 70) {
    result.reversalRisk = "MEDIUM";
  }

  return result;
}
