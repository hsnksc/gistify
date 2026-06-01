export type AppLanguage = "tr" | "en";

export const APP_LANGUAGE_STORAGE_KEY = "app_language";

const TR_TO_EN_ENTRIES: Array<[string, string]> = [
  ["Oturum kontrol ediliyor", "Checking session"],
  ["Birkac saniye surebilir.", "This may take a few seconds."],
  ["Google OAuth Kimlik Dogrulama", "Google OAuth Authentication"],
  ["Finans paneline giris yap", "Sign in to the finance dashboard"],
  [
    "Uyelik durumuna gore erisim acilir. Uye olmayanlar paneli goremez, uye olanlar ise abonelik olmadan kisitli gorunumde kalir.",
    "Access opens based on membership status. Non-members cannot view the panel, and members without a subscription stay in limited mode.",
  ],
  ["Google ile giris yap", "Sign in with Google"],
  ["Google ile giris tamamlanamadi. Lutfen tekrar deneyin.", "Google sign-in failed. Please try again."],
  ["Oturum kontrolu tamamlanamadi. Sayfayi yenileyip tekrar deneyin.", "Session check could not be completed. Refresh and try again."],
  ["Kisitli gorunum aktif", "Limited view active"],
  [
    "Uye girisi tamamlandi. Rakamlar gizlenir ve grafikler sadece aktif abonelikte acilir.",
    "Member sign-in completed. Numbers are masked and charts open only for active subscribers.",
  ],
  [
    'Shopier odemesinde Google hesabinla ayni e-posta adresini kullan. Odeme tamamlaninca bu sayfaya donup "Odemeyi kontrol et" butonuna bas.',
    'Use the same email address as your Google account during Shopier checkout. After payment, return to this page and press "Check payment".',
  ],
  ["Shopier ile abone ol", "Subscribe with Shopier"],
  ["Odemeyi kontrol et", "Check payment"],
  ["Yonlendiriliyor...", "Redirecting..."],
  ["Odeme alindi. Abonelik durumunuz guncelleniyor.", "Payment received. Your subscription status is being updated."],
  ["Odeme islemi iptal edildi.", "Payment was cancelled."],
  ["Grafikler sadece aktif abonelerde acik.", "Charts are available only for active subscribers."],
  ["Genel Bakış", "Overview"],
  ["Hisse Analizi", "Stock Analysis"],
  ["Takvim", "Calendar"],
  ["Sektörel", "Sector"],
  ["Risk Matrisi", "Risk Matrix"],
  ["IV Crush Stratejisi", "IV Crush Strategy"],
  ["Opsiyon Detay", "Option Detail"],
  ["Navigasyon", "Navigation"],
  ["Özet", "Summary"],
  ["Top Seçimler", "Top Picks"],
  ["DÖNEM", "PERIOD"],
  ["ANALİZ", "ANALYSIS"],
  ["Toplam", "Total"],
  ["Yatırım Tezi", "Investment Thesis"],
  ["Katalizörler", "Catalysts"],
  ["Riskler", "Risks"],
  ["Temel Metrikler", "Core Metrics"],
  ["Kritik Metrik", "Key Metric"],
  ["Geçmiş Earnings Hareketi", "Historical Earnings Move"],
  ["Opsiyon Detay", "Option Detail"],
  ["SEKTÖREL MAKRO ANALİZ", "SECTOR MACRO ANALYSIS"],
  ["SEKTÖR BAZLI GÖRÜNÜM", "SECTOR OUTLOOK"],
  ["SEKTÖR BAZLI ORT. MOMENTUM SKORU", "AVG MOMENTUM BY SECTOR"],
  ["GERÇEK MOMENTUM SKORLAMASI", "REAL MOMENTUM SCORING"],
  ["TAM SKORLAMA TABLOSU", "FULL SCORING TABLE"],
  ["6A GETİRİ vs MOMENTUM SKORU", "6M RETURN vs MOMENTUM SCORE"],
  ["HACİM ANALİZİ (MEVCUT vs 3A ORT.)", "VOLUME ANALYSIS (CURRENT vs 3M AVG)"],
  ["EARNINGS TAKVİMİ", "EARNINGS CALENDAR"],
  ["TAKVİM ÖZET TABLOSU", "CALENDAR SUMMARY TABLE"],
  ["RİSK MATRİSİ", "RISK MATRIX"],
  ["BEAT İHTİMALİ vs MOMENTUM", "BEAT PROBABILITY vs MOMENTUM"],
  ["RİSK DAĞILIMI", "RISK DISTRIBUTION"],
  ["PORTFÖY STRATEJİSİ ÖNERİSİ", "PORTFOLIO STRATEGY SUGGESTION"],
  ["OPSIYON IV CRUSH STRATEJİSİ", "OPTION IV CRUSH STRATEGY"],
  ["IV CRUSH FIRASAT SIRALAMASI", "IV CRUSH OPPORTUNITY RANKING"],
  ["MEVCUT IV vs MOMENTUM SKORU", "CURRENT IV vs MOMENTUM SCORE"],
  ["CALL vs PUT KAR POTANSİYELİ", "CALL vs PUT PROFIT POTENTIAL"],
  ["Aylik abonelik gerekli", "Monthly subscription required"],
  ["Merhaba,", "Hello,"],
  ["Cikis yap", "Sign out"],
  ["Raporu goruntulemek icin Google hesabinla giris yap.", "Sign in with your Google account to view the report."],
  ["CANLI ANALİZ", "LIVE ANALYSIS"],
  ["EARNINGS ÖNCESİ", "PRE-EARNINGS"],
  ["DERİN ANALİZ", "DEEP ANALYSIS"],
  ["EN İYİ OLASILILIKLI HİSSELER", "TOP PROBABILITY STOCKS"],
  ["MOMENTUM SKORU SIRALAMASI", "MOMENTUM SCORE RANKING"],
  ["MAKRO BAĞLAM", "MACRO CONTEXT"],
  ["SEKTÖREL BÜYÜME", "SECTOR GROWTH"],
  ["YASAL UYARI", "DISCLAIMER"],
  ["Güçlü Al", "Strong Buy"],
  ["Nötr", "Neutral"],
  ["Güçlü Sat", "Strong Sell"],
  ["NÖTR", "NEUTRAL"],
  ["GÜÇLÜ AL", "STRONG BUY"],
  ["GÜÇLÜ SAT", "STRONG SELL"],
  ["Sinyal", "Signal"],
  ["Sıra", "Rank"],
  ["Tarih", "Date"],
  ["Earnings Tarihi", "Earnings Date"],
  ["Beat İhtimali", "Beat Probability"],
  ["Getiri", "Return"],
  ["Hedef Fiyat", "Target Price"],
  ["Mevcut Fiyat", "Current Price"],
  ["Gelir Beklentisi", "Revenue Estimate"],
  ["Gelir Büyümesi", "Revenue Growth"],
  ["Son 4Q Beat Oranı", "Last 4Q Beat Rate"],
  ["Ort. EPS Beat", "Avg EPS Beat"],
  ["Analist Buy %", "Analyst Buy %"],
  ["Risk Seviyesi", "Risk Level"],
  ["Yüksek", "High"],
  ["Düşük", "Low"],
  ["Çok Yüksek", "Very High"],
  ["Çok Boyutlu Analiz", "Multi-dimensional Analysis"],
  ["Takvim", "Calendar"],
  ["Önerilen Strateji", "Recommended Strategy"],
  ["RİSK", "RISK"],
  ["ÖDÜL", "REWARD"],
  ["Küresel", "Global"],
  ["Olasılık", "Probability"],
  ["Aşama", "Stage"],
  ["Satın Al", "Buy"],
  ["Max Zarar", "Max Loss"],
  ["Ödül/Risk Oranı", "Reward/Risk Ratio"],
  ["Yönsel Analiz", "Directional Analysis"],
  ["Analiz Özeti", "Analysis Summary"],
  ["Ağırlıklı Yön", "Weighted Direction"],
  ["Kaynak", "Source"],
  ["Yukselis", "Bullish"],
  ["Dusus", "Bearish"],
];

function sortEntries(entries: Array<[string, string]>) {
  return [...entries].sort((a, b) => b[0].length - a[0].length);
}

function replaceAllSafe(source: string, search: string, replacement: string) {
  return source.split(search).join(replacement);
}

function applyEntries(source: string, entries: Array<[string, string]>) {
  let result = source;

  for (const [from, to] of entries) {
    if (!from || from === to || !result.includes(from)) {
      continue;
    }

    result = replaceAllSafe(result, from, to);
  }

  return result;
}

const TR_TO_EN = sortEntries(TR_TO_EN_ENTRIES);

export function translateUiText(value: string, language: AppLanguage) {
  if (!value || !value.trim()) {
    return value;
  }

  if (language !== "en") {
    return value;
  }

  return applyEntries(value, TR_TO_EN);
}
