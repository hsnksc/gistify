/**
 * AI Catalyst Analyzer v4.3
 * PDF'den entegre: Hisse haberlerini tarar, katalizör gücünü 1-3 arası değerlendirir.
 * "Dilution" veya "Regulatory Risk" gibi negatif haberlerde sistem uyarısı verir.
 */

export interface CatalystResult {
  score: 1 | 2 | 3;           // 1=Negatif, 2=Nötr, 3=Pozitif
  flags: RiskFlag[];           // Özel risk bayrakları
  newsFound: boolean;          // Haber bulundu mu?
  summary: string;             // AI analiz özeti
  rawData?: NewsItem[];        // Ham haber verileri
}

export type RiskFlag =
  | "DILUTION"           // Sermaye artırımı / hisse arzı
  | "REGULATORY_RISK"    // Düzenleyici risk
  | "EARNINGS_MISS"      // Bilanço hayal kırıklığı
  | "SELL_RATING"        // Sat tavsiyesi
  | "SEC_INVESTIGATION"  // SEC soruşturması
  | "DEBT_CONCERN"       // Borç endişesi
  | "EXECUTIVE_SELL"     // İçeriden satış
  | "LAWSUIT"            // Dava
  | "GUIDANCE_CUT"       // Hedef düşürme
  | "INSIDER_SELLING";   // Yoğun içeriden satış

interface NewsItem {
  title: string;
  publisher: string;
  date: string;
  sentiment: "positive" | "negative" | "neutral";
}

// PDF'deki katalizör ağırlıkları
const CATALYST_WEIGHTS: Record<string, number> = {
  EARNINGS_BEAT: 3,
  EARNINGS_MISS: -3,
  GUIDANCE_RAISE: 3,
  GUIDANCE_CUT: -3,
  FDA_APPROVAL: 3,
  FDA_REJECTION: -3,
  M_AND_A: 2,
  PARTNERSHIP: 2,
  BUYBACK: 2,
  DILUTION: -3,
  REGULATORY_RISK: -3,
  UPGRADE: 2,
  DOWNGRADE: -2,
  SELL_RATING: -3,
  TARGET_RAISE: 2,
  TARGET_CUT: -2,
  INSIDER_BUYING: 1,
  INSIDER_SELLING: -2,
  SHORT_SQUEEZE: 2,
  SHARE_ISSUANCE: -2,
  DEBT_CONCERN: -2,
  SEC_INVESTIGATION: -3,
  LAWSUIT: -2,
  EXECUTIVE_SELL: -2,
};

const RISK_FLAG_MAP: Record<string, RiskFlag[]> = {
  DILUTION: ["DILUTION"],
  SHARE_ISSUANCE: ["DILUTION"],
  REGULATORY_RISK: ["REGULATORY_RISK"],
  SEC_INVESTIGATION: ["SEC_INVESTIGATION"],
  EARNINGS_MISS: ["EARNINGS_MISS"],
  GUIDANCE_CUT: ["GUIDANCE_CUT"],
  SELL_RATING: ["SELL_RATING"],
  DOWNGRADE: ["SELL_RATING"],
  DEBT_CONCERN: ["DEBT_CONCERN"],
  EXECUTIVE_SELL: ["EXECUTIVE_SELL", "INSIDER_SELLING"],
  INSIDER_SELLING: ["INSIDER_SELLING"],
  LAWSUIT: ["LAWSUIT"],
};

/**
 * Basit keyword bazlı katalizör analizi (offline, API'siz çalışır)
 * Gerçek AI entegrasyonu için Gemini/OpenAI API key gerekir
 */
export function analyzeCatalyst(ticker: string, newsTitles: string[]): CatalystResult {
  if (!newsTitles || newsTitles.length === 0) {
    return {
      score: 2, // Nötr (haber yoksa riski yok)
      flags: [],
      newsFound: false,
      summary: `${ticker} için haber bulunamadı. Nötr katalizör.`,
    };
  }

  let totalScore = 0;
  const flags: Set<RiskFlag> = new Set();
  let positiveCount = 0;
  let negativeCount = 0;
  const matchedNews: NewsItem[] = [];

  for (const title of newsTitles) {
    const lowerTitle = title.toLowerCase();
    let matched = false;

    for (const [keyword, weight] of Object.entries(CATALYST_WEIGHTS)) {
      const keywords = keyword.toLowerCase().split("_");
      // Anahtar kelimelerin en az biri başlıkta var mı?
      if (keywords.some((kw) => lowerTitle.includes(kw))) {
        totalScore += weight;
        matched = true;

        // Risk bayraklarını ekle
        const riskFlags = RISK_FLAG_MAP[keyword];
        if (riskFlags) {
          riskFlags.forEach((f) => flags.add(f));
        }

        if (weight > 0) positiveCount++;
        if (weight < 0) negativeCount++;
      }
    }

    matchedNews.push({
      title,
      publisher: "N/A",
      date: new Date().toISOString(),
      sentiment: matched
        ? (totalScore > 0 ? "positive" : totalScore < 0 ? "negative" : "neutral")
        : "neutral",
    });
  }

  // Skor -∞ ile +∞ arasında, 1-3 aralığına map et
  // PDF: 1=Negatif, 2=Nötr, 3=Pozitif
  let finalScore: 1 | 2 | 3;
  if (totalScore >= 3) finalScore = 3;
  else if (totalScore <= -3) finalScore = 1;
  else finalScore = 2;

  // Özet metni
  const flagNames = Array.from(flags).map((f) => f.replace(/_/g, " "));
  let summary: string;
  if (finalScore === 3) {
    summary = `${ticker} için ${positiveCount} pozitif katalizör bulundu. Momentum arkasında haber desteği var.`;
  } else if (finalScore === 1) {
    summary = `${ticker} için ${negativeCount} negatif katalizör bulundu! ${flagNames.join(", ")} riskleri tespit edildi. DİKKAT!`;
  } else {
    summary = `${ticker} için katalizör durumu nötr. Belirgin bir haber akışı yok.`;
  }

  return {
    score: finalScore,
    flags: Array.from(flags),
    newsFound: true,
    summary,
    rawData: matchedNews,
  };
}

/**
 * Katalizör skorunu momentum skoruna entegre et
 * PDF mantığı: finalScore += (catalystScore - 2) * 10
 */
export function integrateCatalyst(momentumScore: number, catalyst: CatalystResult): number {
  // Risk flag varsa skora ciddi ceza
  if (catalyst.flags.length > 0) {
    return Math.max(0, momentumScore - catalyst.flags.length * 8);
  }

  // Katalizör skoruna göre ayarla
  const adjustment = (catalyst.score - 2) * 10;
  return Math.min(100, Math.max(0, momentumScore + adjustment));
}

/**
 * Çoklu haber başlığı oluştur (demo/test amaçlı)
 * Gerçek uygulamada web search veya API'den gelir
 */
export function generateMockNews(ticker: string): string[] {
  // Bu fonksiyon gerçek uygulamada kaldırılacak
  // Yerine: web search API (serper, newsapi, vb.) kullanılacak
  const templates: Record<string, string[]> = {
    default: [
      `${ticker} quarterly earnings exceed expectations`,
      `${ticker} stock rises on strong revenue guidance`,
      `Analysts upgrade ${ticker} price target`,
    ],
  };
  return templates.default.map((t) => t.replace(/\$\{ticker\}/g, ticker));
}

/**
 * Risk flag'leri Türkçe açıklama
 */
export function getRiskFlagDescription(flag: RiskFlag): string {
  const descriptions: Record<RiskFlag, string> = {
    DILUTION: "Sermaye artırımı / Hisse arzı — Fiyat baskısı riski",
    REGULATORY_RISK: "Düzenleyici risk — Yasal engel olabilir",
    EARNINGS_MISS: "Bilanço hayal kırıklığı — Beklentilerin altında",
    SELL_RATING: "Sat tavsiyesi — Analist negatif",
    SEC_INVESTIGATION: "SEC soruşturması — Ciddi yasal risk",
    DEBT_CONCERN: "Borç endişesi — Finansal zayıflık",
    EXECUTIVE_SELL: "Yönetici satışı — Güvensizlik sinyali",
    LAWSUIT: "Dava — Potansiyel mali yükümlülük",
    GUIDANCE_CUT: "Hedef düşürme — Şirket kötümser",
    INSIDER_SELLING: "İçeriden yoğun satış — Yönetim kaçıyor",
  };
  return descriptions[flag] || flag;
}
