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
  [
    "Google ile giris tamamlanamadi. Lutfen tekrar deneyin.",
    "Google sign-in failed. Please try again.",
  ],
  [
    "Oturum kontrolu tamamlanamadi. Sayfayi yenileyip tekrar deneyin.",
    "Session check could not be completed. Refresh and try again.",
  ],
  [
    "Oturum kontrolu zaman asimina ugradi. Sayfayi yenileyin veya tekrar giris yapin.",
    "Session check timed out. Refresh the page or sign in again.",
  ],
  [
    "Public preview modu acik. Google girisi ve odeme akisi Paddle onayi tamamlanana kadar gecici olarak kapatildi.",
    "Public preview mode is active. Google sign-in and billing are temporarily disabled until Paddle approval is complete.",
  ],
  ["Public Preview", "Public Preview"],
  ["Kisitli gorunum aktif", "Limited view active"],
  [
    "Uye girisi tamamlandi. Rakamlar gizlenir ve grafikler sadece aktif abonelikte acilir.",
    "Member sign-in completed. Numbers are masked and charts open only for active subscribers.",
  ],
  [
    "Odeme akisi Paddle gecisi tamamlanana kadar kapali. Tam erisim gecici olarak yonetim tarafindan aciliyor.",
    "Billing is paused until the Paddle migration is finished. Full access is being opened manually for now.",
  ],
  ["Durumu yenile", "Refresh status"],
  [
    "Grafikler sadece aktif abonelerde acik.",
    "Charts are available only for active subscribers.",
  ],
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
  [
    "Raporu goruntulemek icin Google hesabinla giris yap.",
    "Sign in with your Google account to view the report.",
  ],
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
  ["Rapor verisi bulunamadi", "Report data unavailable"],
  ["Playbook olusturulacak setup yok", "No setups available for the playbook"],
  [
    "Kaynak markdown dosyasinda parse edilebilen hisse setup bloku yok.",
    "The source markdown does not contain a parsable stock setup block.",
  ],
  ["Rapor ozeti", "Report summary"],
  ["Ana pencere", "Core window"],
  ["Hisse secimi", "Ticker selection"],
  ["Strateji ozeti", "Strategy summary"],
  ["Call / Put orani belirtilmedi", "Call / put ratio not specified"],
  ["Call / Put orani", "Call / put ratio"],
  ["Call leg detayi belirtilmedi.", "Call leg detail not specified."],
  ["Put leg detayi belirtilmedi.", "Put leg detail not specified."],
  ["Giris", "Entry"],
  ["Cikis", "Exit"],
  ["Kritik uyarilar", "Critical warnings"],
  ["Haberler ve catalystler", "News and catalysts"],
  ["Secili hisse akisi", "Selected ticker flow"],
  ["Bu hissede ek haber notu parse edilmedi.", "No additional news note was parsed for this ticker."],
  ["Metrik kartlari", "Metric cards"],
  ["Ek metrik bulunmuyor.", "No additional metrics available."],
  ["Deger", "Value"],
  ["Aciklama", "Description"],
  ["Kar / zarar senaryolari", "Profit / loss scenarios"],
  ["Senaryo", "Scenario"],
  ["IV degisimi", "IV change"],
  ["Hisse hareketi", "Stock move"],
  [
    "Bu rapor versiyonunda tablo bazli P/L senaryosu verilmedi. Ana yon, call/put orani ve giris/cikis penceresi strategy board ustunden okunmali.",
    "This report version does not include a table-based P/L scenario. Read the primary bias, call/put ratio and entry/exit window from the strategy board.",
  ],
  ["Takvim verisi bulunamadi", "Calendar data unavailable"],
  ["Gosterilecek execution takvimi yok", "No execution calendar to display"],
  ["Giris ve cikis takvimi", "Entry and exit calendar"],
  [
    "Bu sekme, haftalik action plan, makro carpisma tarihleri ve hisse bazli giris/cikis pencerelerini tek timeline'da toplar.",
    "This tab combines the weekly action plan, macro collision dates and ticker-specific entry/exit windows in a single timeline.",
  ],
  ["Strateji penceresi", "Strategy window"],
  ["Tarih bazli islem akisi", "Date-based execution flow"],
  ["Hisse bazli pencere", "Ticker window"],
  ["Expiry secenekleri", "Expiry options"],
  ["Gun sayaci", "Day counter"],
  ["Risk yonetimi ve pozisyon yapisi", "Risk management and position structure"],
  [
    "Bu alan, markdown dosyasindaki global risk matrisi, pozisyon buyuklugu, golden rules ve gunluk kontrol listesi bloklarini tek bir yonetim katmanina cevirir.",
    "This area converts the global risk matrix, position sizing, golden rules and daily checklist blocks from the markdown file into a single management layer.",
  ],
  ["VIX rejimi", "VIX regime"],
  ["Kural: VIX >25 ise girisleri durdur", "Rule: stop new entries if VIX > 25"],
  ["Ana riskler", "Core risks"],
  ["Onlem", "Mitigation"],
  ["Portfoy dagilimi", "Portfolio allocation"],
  ["Sermaye", "Capital"],
  ["Kontrat", "Contracts"],
  ["Allocation notu", "Allocation note"],
  ["Gunluk kontrol listesi", "Daily checklist"],
  ["Ticker notlari ve uyarilar", "Ticker notes and warnings"],
  ["Yasal uyari", "Disclaimer"],
  [
    "OpenAI tarafindan yeniden uretilmis gorsel varyanti gosteriliyor; kaynak veri daily report paketindeki orijinal chart'a dayanir.",
    "An OpenAI-regenerated visual variant is shown; the source data is based on the original chart in the daily report package.",
  ],
  [
    "Grafik kaynagi orijinal haliyle korunur; burada yalnizca okunabilir bir panel sunumu uygulanir.",
    "The chart source is preserved in its original form; only a more readable panel presentation is applied here.",
  ],
  ["Ana bolum sayisi", "Main section count"],
  ["Izlenen sembol sayisi", "Tracked symbol count"],
  ["Kaynakta bulunan grafik/gorsel", "Charts or visuals in the source"],
  ["Destekleyici dosya adedi", "Supporting file count"],
  ["Stat bloklari hazirlaniyor", "Summary cards are loading"],
  [
    "Bu raporun section, ticker ve figure dagilimi yorumlandikca ustteki ozet kartlari otomatik dolacak.",
    "As the section, ticker and figure distribution of this report is interpreted, the summary cards above will populate automatically.",
  ],
  [
    "Bu raporda ayrik makro rejim tablosu bulunmuyor. Yine de asagidaki dashboard, markdown tablolarindan otomatik olarak okunabilen sinyalleri ozetliyor.",
    "This report does not include a standalone macro regime table. The dashboard below still summarizes signals that can be read automatically from the markdown tables.",
  ],
  ["Raporun merkezindeki ana fikirler", "Core ideas at the center of the report"],
  ["Bolumler arasi hizli gecis", "Quick navigation across sections"],
  ["Grafikler okunabilir panel duzeninde", "Charts in a readable panel layout"],
  ["Genislik dengesi", "Breadth balance"],
  ["Rapor yogunluk haritasi", "Report signal density map"],
  ["En guclu momentum isimleri", "Strongest momentum names"],
  ["Tam rapor akisi", "Full report flow"],
  ["Kaynakta acik kapsama notu yok", "No explicit coverage note in the source"],
  ["Metodoloji notu belirtilmemis", "No methodology note provided"],
  ["Kapat", "Close"],
  ["Gunluk raporlar", "Daily reports"],
  [
    "En guncel rapor ustte acilir. Buradan tarih secerek daily reader panelini degistirebilirsin.",
    "The latest report opens first. Select a date here to switch the daily reader panel.",
  ],
  ["Gunluk Rapor Secimi", "Daily report selection"],
  ["Bir daily report sec", "Select a daily report"],
  ["Daily report kutuphanesi yukleniyor.", "Loading daily report library."],
  [
    "Ustteki secim alanindan bir daily report secildiginde okuma paneli burada acilir.",
    "The reading panel opens here when you select a daily report above.",
  ],
  [
    "Ustteki secim alanindan bir daily report secildiginde okuma paneli burada acilacak.",
    "The reading panel will open here when you select a daily report above.",
  ],
  ["Secili raporun alt basligi burada gorunur.", "The subtitle of the selected report appears here."],
  ["Momentum skoru", "Momentum score"],
  ["Momentum report bekleniyor", "Momentum report pending"],
  ["Top setup bekleniyor", "Top setup pending"],
  ["Rapor adedi", "Report count"],
  ["Son update", "Latest update"],
  ["Kaynak degisiklik zamani", "Source change timestamp"],
  ["Secili rapor volatilite baglami", "Volatility context for the selected report"],
  ["Momentum source takvimi", "Momentum source calendar"],
  ["Aksiyon / hedef seans", "Action / target session"],
  ["Dosya degisiklik damgasi", "File update timestamp"],
  ["Sidebar snapshot hazirlaniyor.", "Preparing sidebar snapshot."],
  ["Zaman damgali report indeks listesi.", "Timestamped report index list."],
  ["Rapor tarihi", "Report date"],
  ["Parser ile okunan ana tarih", "Primary date parsed from the report"],
  ["Yuklenme", "Loaded"],
  ["Liste siralamasi bu zamana gore", "List ordering uses this timestamp"],
  ["Secili earnings raporu yukleniyor.", "Loading selected earnings report."],
  ["Rapor gelmeden ozet kartlari bos gosterilmeyecek; veri geldiginde burada dolacak.", "Summary cards stay hidden until data is available and will populate automatically."],
  ["Son yukleme", "Latest load"],
  ["Aktif setup", "Active setups"],
  ["Yakin event", "Nearest event"],
  ["Secili rapordaki ticker", "Tickers in the selected report"],
  ["Secili rapordan", "From the selected report"],
  ["Su an yalnizca son rapor gorunur", "Only the latest report is visible right now"],
  ["Varsayilan acilan rapor", "Default report opened on entry"],
  ["Guncel earnings strateji paneli", "Current earnings strategy panel"],
  [
    "Yalnizca en son earnings raporu gorunur. Ticker secimi, playbook, takvim ve risk panelleri tek source uzerinden acilir.",
    "Only the latest earnings report is shown. Ticker selection, playbook, calendar and risk panels open from a single active source.",
  ],
  ["Momentum report ve live scanner", "Momentum report and live scanner"],
  [
    "En guncel momentum raporu ustten secilir. Market pulse, setup, strategy ve live scanner ayni workspace icinde acilir.",
    "Select the latest momentum report from the strip above. Market pulse, setup, strategy and live scanner open inside the same workspace.",
  ],
  ["Yenile", "Refresh"],
  ["Arsiv", "Archive"],
  ["pozitif endeks", "positive indices"],
  ["negatif endeks", "negative indices"],
  ["rejim faktor", "regime factors"],
  ["dengeli", "balanced"],
  ["Gorunum degisiyor...", "Switching view..."],
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
