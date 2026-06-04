// ============================================================
// EARNINGS BENCHMARK RAPORU — Hisse Analiz Veri Katmanı
// Tasarım: Precision Finance / Tactical Intelligence Dashboard
// Veri Kaynakları: Yahoo Finance, MarketBeat, ChartMill, Gartner
// Güncelleme: 21 Mayıs 2026
// ============================================================

export type SignalLevel = 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
export type VolumeStatus = 'VERY_HIGH' | 'HIGH' | 'NORMAL' | 'LOW';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export interface StockData {
  ticker: string;
  name: string;
  sector: string;
  earningsDate: string;
  earningsTime: 'AMC' | 'BMO'; // After Market Close / Before Market Open
  currentPrice: number;
  priceChange6M: number; // %
  priceChange1M: number; // %
  
  // Earnings Beklentileri
  epsEstimate: number;
  epsLastQuarter: number;
  revenueEstimate: string; // "2.45B" format
  revenueGrowthYoY: number; // %
  beatRateLast4Q: number; // % (son 4 çeyrekte beklenti üstü geçme oranı)
  avgEpsBeat: number; // ortalama beklenti üstü geçme miktarı (%)
  
  // Teknik Analiz
  rsi14: number;
  volumeCurrent: number; // Milyonlar
  volumeAvg3M: number;   // Milyonlar
  volumeStatus: VolumeStatus;
  volumePriceFit: 'ALIGNED' | 'RISKY' | 'MISALIGNED';
  
  // Sektörel & Korelasyon
  etfBenchmark: string;
  sectorBeta: number;
  sectorTrend: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  
  // Analist Görüşleri
  analystBuyConsensus: number; // % buy
  analystCount: number;
  priceTarget: number;
  priceTargetUpside: number; // %
  
  // Makro Katalizörler
  catalysts: string[];
  risks: string[];
  
  // Momentum Skoru (Bileşik)
  momentumScore: number; // 0-100
  earningsBeatProbability: number; // % (earnings beat ihtimali)
  signal: SignalLevel;
  riskLevel: RiskLevel;
  
  // Detay Analiz
  thesis: string;
  keyMetric: string;
  keyMetricValue: string;
  
  // Geçmiş Earnings Hareketi (son 4 çeyrek, %)
  historicalMoves: number[];
  impliedMove: number; // options piyasasının öngördüğü hareket %
}

export const stocksData: StockData[] = [
  {
    ticker: 'MRVL',
    name: 'Marvell Technology',
    sector: 'AI Yarı İletken',
    earningsDate: '27 May 2026',
    earningsTime: 'AMC',
    currentPrice: 176.27,
    priceChange6M: 144,
    priceChange1M: 22,
    
    epsEstimate: 0.81,
    epsLastQuarter: 0.80,
    revenueEstimate: '2.45B',
    revenueGrowthYoY: 29.3,
    beatRateLast4Q: 100,
    avgEpsBeat: 12.5,
    
    rsi14: 63,
    volumeCurrent: 29.2,
    volumeAvg3M: 12,
    volumeStatus: 'VERY_HIGH',
    volumePriceFit: 'ALIGNED',
    
    etfBenchmark: 'SOXX',
    sectorBeta: 1.35,
    sectorTrend: 'BULLISH',
    
    analystBuyConsensus: 82,
    analystCount: 50,
    priceTarget: 131.56,
    priceTargetUpside: -25.4,
    
    catalysts: [
      'AI özel çip geliri Q1\'de +50% büyüme beklentisi',
      'Deloitte: 2026\'da AI çip geliri ~$500B tahmin',
      'SOXX sektör lideri konumu korunuyor',
      'B of A Securities Şubat\'ta Neutral\'den Buy\'a yükseltti',
      'Barclays Nisan\'da Equal-Weight\'ten Overweight\'e yükseltti',
      'EPS büyüme CAGR 3 yıl: %39'
    ],
    risks: [
      'Analist ortalama hedef fiyatı mevcut fiyatın %25 altında',
      'Yüksek değerleme (P/E premium)',
      'Geçen çeyrekte +18.4% hareket etmişti (yüksek beklenti)'
    ],
    
    momentumScore: 96,
    earningsBeatProbability: 78,
    signal: 'STRONG_BUY',
    riskLevel: 'MEDIUM',
    
    thesis: 'Marvell, AI özel çip (custom ASIC) alanında Broadcom ile birlikte en güçlü konumda. Hyperscaler müşterileri (Amazon, Google, Microsoft) kendi AI çiplerini tasarlatıyor ve MRVL bu tasarım süreçlerinin merkezinde. Hacim patlaması (ortalamanın 2.4x\'i) kurumsal alımın güçlü olduğunu gösteriyor. RSI 63 ile sağlıklı momentum bölgesinde.',
    keyMetric: 'AI Gelir Büyümesi',
    keyMetricValue: '+50% YoY',
    
    historicalMoves: [18.4, 8.2, -5.1, 12.3],
    impliedMove: 9.7,
  },
  {
    ticker: 'CRWD',
    name: 'CrowdStrike Holdings',
    sector: 'Siber Güvenlik',
    earningsDate: '3 Haz 2026',
    earningsTime: 'AMC',
    currentPrice: 624.41,
    priceChange6M: 90,
    priceChange1M: 18,
    
    epsEstimate: 1.07,
    epsLastQuarter: 1.12,
    revenueEstimate: '1.40B',
    revenueGrowthYoY: 23.8,
    beatRateLast4Q: 100,
    avgEpsBeat: 8.2,
    
    rsi14: 72,
    volumeCurrent: 4.4,
    volumeAvg3M: 2.5,
    volumeStatus: 'HIGH',
    volumePriceFit: 'ALIGNED',
    
    etfBenchmark: 'HACK/CIBR',
    sectorBeta: 1.15,
    sectorTrend: 'BULLISH',
    
    analystBuyConsensus: 78,
    analystCount: 45,
    priceTarget: 680,
    priceTargetUpside: 8.9,
    
    catalysts: [
      'Gartner: 2026 siber güvenlik harcaması $244B (+13.5% YoY)',
      'Şirket rehberi: Q1 EPS $1.06-1.07 (konsensüs üstü)',
      'ARR büyümesi Q4\'te +33% YoY ($6.3B)',
      'Falcon platformu AI entegrasyonu güçleniyor',
      '52 hafta zirvesine yakın (651$) — güçlü momentum',
      'EPS büyüme tahmini: +64.7% gelecek yıl'
    ],
    risks: [
      'RSI 72 — yüksek alım bölgesine yaklaşıyor',
      'Yüksek P/E (forward ~370x)',
      'Rekabetin artması (Palo Alto, SentinelOne)'
    ],
    
    momentumScore: 94,
    earningsBeatProbability: 74,
    signal: 'STRONG_BUY',
    riskLevel: 'MEDIUM',
    
    thesis: 'CrowdStrike, siber güvenlik alanında platform konsolidasyonunun en büyük kazananı. Falcon platformu rakipsiz AI entegrasyonu ile kurumsal müşterileri çekmeye devam ediyor. Son 4 çeyrekte 4/4 beklenti üstü performans. Gartner\'ın $244B siber güvenlik harcama tahmini sektörel rüzgarı güçlü tutuyor. 52 hafta zirvesine yakın pozisyon güçlü momentum sinyali.',
    keyMetric: 'ARR Büyümesi',
    keyMetricValue: '+33% YoY',
    
    historicalMoves: [7.2, 5.8, 11.4, 3.9],
    impliedMove: 8.5,
  },
  {
    ticker: 'AVGO',
    name: 'Broadcom Inc.',
    sector: 'AI Yarı İletken',
    earningsDate: '3 Haz 2026',
    earningsTime: 'AMC',
    currentPrice: 420.33,
    priceChange6M: 24,
    priceChange1M: 32,
    
    epsEstimate: 2.32,
    epsLastQuarter: 2.05,
    revenueEstimate: '22.0B',
    revenueGrowthYoY: 47,
    beatRateLast4Q: 75,
    avgEpsBeat: 3.1,
    
    rsi14: 62,
    volumeCurrent: 16.2,
    volumeAvg3M: 3.5,
    volumeStatus: 'HIGH',
    volumePriceFit: 'ALIGNED',
    
    etfBenchmark: 'SOXX',
    sectorBeta: 1.2,
    sectorTrend: 'BULLISH',
    
    analystBuyConsensus: 85,
    analystCount: 30,
    priceTarget: 477.81,
    priceTargetUpside: 13.7,
    
    catalysts: [
      'Şirket kendi Q2 rehberi: $22B gelir (+47% YoY) — konsensüs üstü',
      'AI özel çip geliri $100B hedefi açıklandı',
      'EBITDA marjı %68 rekor seviyede',
      'Analist hedef fiyatı 3 ayda %16 yukarı revize edildi',
      'Zacks: $477 ortalama hedef, %14 upside',
      'Piyasa değeri $1.98 trilyon — mega cap güvenliği'
    ],
    risks: [
      'Geçen çeyrekte earnings sonrası -11.4% düşmüştü (Aralık 2025)',
      'Yüksek piyasa değeri — büyük hareket için büyük katalizör gerekli',
      'VMware entegrasyon maliyetleri devam ediyor'
    ],
    
    momentumScore: 88,
    earningsBeatProbability: 71,
    signal: 'BUY',
    riskLevel: 'LOW',
    
    thesis: 'Broadcom, hem AI özel çip (ASIC) hem de kurumsal yazılım (VMware) tarafında güçlü pozisyon. Şirketin kendi verdiği Q2 rehberi ($22B) analist konsensüsünün ($20.4B) çok üzerinde — bu "guidance beat" earnings öncesi güçlü bir sinyal. EBITDA marjı %68 ile sektörün en yüksek karlılığına sahip. Mega cap güvenliği ile düşük risk profili.',
    keyMetric: 'Q2 Gelir Rehberi',
    keyMetricValue: '$22B (+47%)',
    
    historicalMoves: [4.8, -11.4, 3.2, 6.1],
    impliedMove: 7.2,
  },
  {
    ticker: 'PANW',
    name: 'Palo Alto Networks',
    sector: 'Siber Güvenlik',
    earningsDate: '2 Haz 2026',
    earningsTime: 'AMC',
    currentPrice: 246.66,
    priceChange6M: 77,
    priceChange1M: 12,
    
    epsEstimate: 0.81,
    epsLastQuarter: 1.03,
    revenueEstimate: '3.00B',
    revenueGrowthYoY: 31.2,
    beatRateLast4Q: 100,
    avgEpsBeat: 9.6,
    
    rsi14: 78,
    volumeCurrent: 8.6,
    volumeAvg3M: 5,
    volumeStatus: 'HIGH',
    volumePriceFit: 'RISKY',
    
    etfBenchmark: 'HACK/CIBR',
    sectorBeta: 1.05,
    sectorTrend: 'BULLISH',
    
    analystBuyConsensus: 81,
    analystCount: 64,
    priceTarget: 216.54,
    priceTargetUpside: -12.2,
    
    catalysts: [
      'Gelir rehberi 3 ayda %13 yukarı revize edildi',
      'Next-Gen Security ARR +33% YoY ($6.3B)',
      'Platformlaşma stratejisi müşteri tutma oranını artırıyor',
      'Stifel, Morgan Stanley, Truist: Buy/Overweight koruyor',
      'Gartner siber güvenlik büyümesi sektörel destek sağlıyor'
    ],
    risks: [
      'RSI 78 — aşırı alım bölgesine yakın ("blow-off" riski)',
      'Analist hedef fiyatı mevcut fiyatın %12 ALTINDA',
      '"Haberle sat" riski yüksek (buy the rumor, sell the news)',
      'Yüksek değerleme premium'
    ],
    
    momentumScore: 62,
    earningsBeatProbability: 65,
    signal: 'NEUTRAL',
    riskLevel: 'HIGH',
    
    thesis: 'PANW güçlü fundamentaller sunuyor ancak teknik tablo endişe verici. RSI 78 ile aşırı alım bölgesine yakın ve analist hedef fiyatı mevcut fiyatın %12 altında. Earnings iyi gelse bile "haberle sat" dinamiği devreye girebilir. Mevcut pozisyon sahipleri için tutma, yeni giriş için daha iyi fiyat bekleme stratejisi önerilir.',
    keyMetric: 'NGS ARR',
    keyMetricValue: '$6.3B (+33%)',
    
    historicalMoves: [9.8, -8.2, 5.4, 11.2],
    impliedMove: 8.8,
  },
  {
    ticker: 'COST',
    name: 'Costco Wholesale',
    sector: 'Defansif Perakende',
    earningsDate: '28 May 2026',
    earningsTime: 'AMC',
    currentPrice: 1020,
    priceChange6M: 27,
    priceChange1M: 5,
    
    epsEstimate: 4.91,
    epsLastQuarter: 4.58,
    revenueEstimate: '62.5B',
    revenueGrowthYoY: 8.9,
    beatRateLast4Q: 100,
    avgEpsBeat: 4.2,
    
    rsi14: 55,
    volumeCurrent: 1.95,
    volumeAvg3M: 2,
    volumeStatus: 'NORMAL',
    volumePriceFit: 'ALIGNED',
    
    etfBenchmark: 'XRT',
    sectorBeta: 0.7,
    sectorTrend: 'NEUTRAL',
    
    analystBuyConsensus: 72,
    analystCount: 35,
    priceTarget: 1150,
    priceTargetUpside: 12.7,
    
    catalysts: [
      'Defansif karakter — piyasa volatilitesinde güvenli liman',
      'Üyelik geliri istikrarlı büyüme (+8% YoY)',
      'Son 4 çeyrekte 4/4 beklenti üstü performans',
      'Analist hedef fiyatı %13 upside sunuyor',
      'Tüketici harcamaları dayanıklılığı'
    ],
    risks: [
      'Düşük beta — piyasa rallisinde geride kalabilir',
      'Yüksek P/E (premium değerleme)',
      'Enflasyon baskısı marjları sıkıştırabilir'
    ],
    
    momentumScore: 75,
    earningsBeatProbability: 68,
    signal: 'BUY',
    riskLevel: 'LOW',
    
    thesis: 'Costco, belirsizlik dönemlerinde portföy dengesi için ideal defansif pozisyon. Üyelik modeli sayesinde gelir öngörülebilirliği yüksek. Son 4 çeyrekte tutarlı beklenti üstü performans ve %13 analist upside potansiyeli. Teknoloji hisselerindeki volatiliteye karşı hedge görevi görür.',
    keyMetric: 'Üyelik Büyümesi',
    keyMetricValue: '+8% YoY',
    
    historicalMoves: [3.2, 1.8, 4.5, 2.1],
    impliedMove: 4.2,
  },
  {
    ticker: 'DELL',
    name: 'Dell Technologies',
    sector: 'AI Sunucu / Donanım',
    earningsDate: '27 May 2026',
    earningsTime: 'AMC',
    currentPrice: 115,
    priceChange6M: 107,
    priceChange1M: 8,
    
    epsEstimate: 2.97,
    epsLastQuarter: 3.89,
    revenueEstimate: '35.99B',
    revenueGrowthYoY: 19,
    beatRateLast4Q: 75,
    avgEpsBeat: 10.2,
    
    rsi14: 58,
    volumeCurrent: 3.7,
    volumeAvg3M: 8,
    volumeStatus: 'LOW',
    volumePriceFit: 'RISKY',
    
    etfBenchmark: 'SOXX',
    sectorBeta: 0.9,
    sectorTrend: 'BULLISH',
    
    analystBuyConsensus: 65,
    analystCount: 28,
    priceTarget: 145,
    priceTargetUpside: 26.1,
    
    catalysts: [
      'AI sunucu siparişleri $25B yıllık gelir hedefi (FY2026)',
      'Tam yıl geliri rekor $113.5B (+19% YoY)',
      'Analist hedef fiyatı %26 upside sunuyor',
      'AI altyapı talebi güçlü'
    ],
    risks: [
      'Hacim ortalamanın yarısında — "yorgunluk" sinyali',
      'EPS beklentisi son çeyrekteki $3.89\'dan $2.97\'ye düştü',
      'PC segmenti zayıflığı devam ediyor',
      'Yüksek borç yükü'
    ],
    
    momentumScore: 68,
    earningsBeatProbability: 58,
    signal: 'NEUTRAL',
    riskLevel: 'MEDIUM',
    
    thesis: 'Dell, AI sunucu talebinden faydalanıyor ancak hacim zayıflığı endişe verici. Fiyat yükselirken hacmin düşmesi "yorgunluk" işareti. EPS beklentisinin son çeyrekteki gerçekleşmenin çok altında olması da dikkat çekici. Analist upside potansiyeli cazip (%26) ancak teknik tablo daha iyi giriş noktası için beklemeyi öneriyor.',
    keyMetric: 'AI Sunucu Geliri',
    keyMetricValue: '$25B Hedef',
    
    historicalMoves: [12.4, -6.8, 8.9, 5.2],
    impliedMove: 9.5,
  },
  {
    ticker: 'ADSK',
    name: 'Autodesk Inc.',
    sector: 'Tasarım Yazılımı',
    earningsDate: '22 May 2026',
    earningsTime: 'AMC',
    currentPrice: 285,
    priceChange6M: 13,
    priceChange1M: 4,
    
    epsEstimate: 2.45,
    epsLastQuarter: 2.85,
    revenueEstimate: '1.90B',
    revenueGrowthYoY: 17.5,
    beatRateLast4Q: 75,
    avgEpsBeat: 6.8,
    
    rsi14: 45,
    volumeCurrent: 1.55,
    volumeAvg3M: 1.5,
    volumeStatus: 'NORMAL',
    volumePriceFit: 'ALIGNED',
    
    etfBenchmark: 'IGV',
    sectorBeta: 0.8,
    sectorTrend: 'NEUTRAL',
    
    analystBuyConsensus: 68,
    analystCount: 32,
    priceTarget: 320,
    priceTargetUpside: 12.3,
    
    catalysts: [
      'Q1 2026 earnings: +17.5% YoY gelir büyümesi beklenti üstü',
      'AI tasarım araçları (Forma, Fusion) entegrasyonu güçleniyor',
      'Abonelik modeline geçiş tamamlandı — öngörülebilir gelir',
      'Analist hedef fiyatı %12 upside'
    ],
    risks: [
      'IGV (yazılım ETF) bear market baskısı',
      'Momentum zayıf — RSI 45 nötr bölge',
      'Yüksek değerleme yazılım sektörü genelinde baskı altında'
    ],
    
    momentumScore: 55,
    earningsBeatProbability: 55,
    signal: 'NEUTRAL',
    riskLevel: 'MEDIUM',
    
    thesis: 'Autodesk, AI tasarım araçları ile uzun vadeli büyüme potansiyeli taşıyor ancak kısa vadeli momentum zayıf. Yazılım sektörünün genel baskısı altında. Earnings öncesi için nötr pozisyon; iyi bir earnings sonrası güçlü giriş noktası oluşabilir.',
    keyMetric: 'Gelir Büyümesi',
    keyMetricValue: '+17.5% YoY',
    
    historicalMoves: [5.2, -3.8, 2.1, 7.4],
    impliedMove: 6.8,
  },
  {
    ticker: 'SNOW',
    name: 'Snowflake Inc.',
    sector: 'Bulut Veri',
    earningsDate: '21 May 2026',
    earningsTime: 'AMC',
    currentPrice: 185,
    priceChange6M: -35,
    priceChange1M: -8,
    
    epsEstimate: 0.22,
    epsLastQuarter: 0.14,
    revenueEstimate: '1.05B',
    revenueGrowthYoY: 26,
    beatRateLast4Q: 50,
    avgEpsBeat: 2.1,
    
    rsi14: 45,
    volumeCurrent: 5.9,
    volumeAvg3M: 6,
    volumeStatus: 'NORMAL',
    volumePriceFit: 'ALIGNED',
    
    etfBenchmark: 'IGV',
    sectorBeta: 0.5,
    sectorTrend: 'BEARISH',
    
    analystBuyConsensus: 55,
    analystCount: 40,
    priceTarget: 230,
    priceTargetUpside: 24.3,
    
    catalysts: [
      'Yüksek analist upside potansiyeli (%24)',
      'Gelir büyümesi +26% YoY güçlü',
      'AI veri platformu olarak yeniden konumlanma'
    ],
    risks: [
      'Fiyat -35% (6 ay) — kırılmış momentum',
      'IGV bear market baskısı',
      'Rekabet: Databricks, Google BigQuery güçleniyor',
      'Yüksek değerleme (P/S premium)',
      'Yönetim değişikliği belirsizliği'
    ],
    
    momentumScore: 45,
    earningsBeatProbability: 45,
    signal: 'SELL',
    riskLevel: 'HIGH',
    
    thesis: 'Snowflake, kırılmış momentum ve zayıf sektörel destek ile earnings öncesi riskli bir pozisyon. Fiyat 6 ayda %35 düşmüş, IGV bear market baskısı altında. Analist upside potansiyeli cazip görünse de mevcut teknik tablo olumsuz. Earnings iyi gelse bile güçlü bir toparlanma için katalizör gerekiyor.',
    keyMetric: 'Gelir Büyümesi',
    keyMetricValue: '+26% YoY',
    
    historicalMoves: [-15.2, 8.4, -12.1, 6.8],
    impliedMove: 12.5,
  },
  {
    ticker: 'CRM',
    name: 'Salesforce Inc.',
    sector: 'CRM Yazılımı',
    earningsDate: '28 May 2026',
    earningsTime: 'AMC',
    currentPrice: 245,
    priceChange6M: -33,
    priceChange1M: -5,
    
    epsEstimate: 2.65,
    epsLastQuarter: 2.58,
    revenueEstimate: '9.85B',
    revenueGrowthYoY: 7.5,
    beatRateLast4Q: 75,
    avgEpsBeat: 3.8,
    
    rsi14: 42,
    volumeCurrent: 12.4,
    volumeAvg3M: 6,
    volumeStatus: 'HIGH',
    volumePriceFit: 'MISALIGNED',
    
    etfBenchmark: 'IGV',
    sectorBeta: -0.2,
    sectorTrend: 'BEARISH',
    
    analystBuyConsensus: 52,
    analystCount: 45,
    priceTarget: 290,
    priceTargetUpside: 18.4,
    
    catalysts: [
      'Analist upside potansiyeli %18',
      'Agentforce AI platformu lansmanı',
      'Büyük kurumsal müşteri tabanı'
    ],
    risks: [
      'BofA downgrade — sektörel destek yok',
      'Yüksek hacimde düşüş (distribution sinyali)',
      'IGV ile negatif korelasyon',
      'Gelir büyümesi yavaşlıyor (+7.5% — tarihsel düşük)',
      'Yapay zeka geçişi yavaş ilerliyor'
    ],
    
    momentumScore: 35,
    earningsBeatProbability: 38,
    signal: 'STRONG_SELL',
    riskLevel: 'VERY_HIGH',
    
    thesis: 'Salesforce, kırılmış momentum ve distribution (kurumsal satış) sinyalleri ile earnings öncesi kaçınılması gereken hisse. Yüksek hacimde fiyat düşüşü kurumsal çıkışı gösteriyor. BofA downgrade ve IGV ile negatif korelasyon sektörel desteğin olmadığını teyit ediyor. Agentforce AI platformu uzun vadeli bir katalizör olabilir ancak kısa vadede yeterli değil.',
    keyMetric: 'Gelir Büyümesi',
    keyMetricValue: '+7.5% YoY',
    
    historicalMoves: [-8.4, -12.1, 5.2, -6.8],
    impliedMove: 7.8,
  },
  {
    ticker: 'ZS',
    name: 'Zscaler Inc.',
    sector: 'Siber Güvenlik',
    earningsDate: '25 May 2026',
    earningsTime: 'AMC',
    currentPrice: 195,
    priceChange6M: -40,
    priceChange1M: -12,
    
    epsEstimate: 1.04,
    epsLastQuarter: 1.01,
    revenueEstimate: '710M',
    revenueGrowthYoY: 22,
    beatRateLast4Q: 75,
    avgEpsBeat: 5.2,
    
    rsi14: 32,
    volumeCurrent: 2.5,
    volumeAvg3M: 3,
    volumeStatus: 'NORMAL',
    volumePriceFit: 'MISALIGNED',
    
    etfBenchmark: 'IGV',
    sectorBeta: -0.3,
    sectorTrend: 'BEARISH',
    
    analystBuyConsensus: 60,
    analystCount: 38,
    priceTarget: 245,
    priceTargetUpside: 25.6,
    
    catalysts: [
      'RSI 32 — aşırı satım bölgesi (teknik toparlanma potansiyeli)',
      'Analist upside potansiyeli %26',
      'Q1 2026 earnings beklenti üstü geçti'
    ],
    risks: [
      'EVP istifası — yönetim belirsizliği',
      'Fiyat -40% (6 ay) — ciddi momentum kaybı',
      'IGV ile negatif korelasyon',
      'CRWD ve PANW\'a müşteri kaybı riski',
      'Büyüme yavaşlaması endişesi'
    ],
    
    momentumScore: 28,
    earningsBeatProbability: 42,
    signal: 'STRONG_SELL',
    riskLevel: 'VERY_HIGH',
    
    thesis: 'Zscaler, içsel sorunlar (EVP istifası) ve kırılmış momentum ile earnings öncesi en riskli hisse. RSI 32 teknik toparlanma potansiyeli sunsa da fundamentaller zayıf. CRWD ve PANW\'ın güçlü büyümesi karşısında pazar payı kaybı riski var. Siber güvenlik sektörünün genel büyümesinden faydalanamaması kritik bir uyarı sinyali.',
    keyMetric: 'Gelir Büyümesi',
    keyMetricValue: '+22% YoY',
    
    historicalMoves: [-18.4, 12.2, -8.9, -5.4],
    impliedMove: 11.2,
  },
];

// Sektörel Makro Veriler
export const sectorMacroData = {
  aiSemiconductor: {
    name: 'AI Yarı İletken',
    marketSize2026: '$500B',
    growthRate: '+22% YoY',
    keyDriver: 'Hyperscaler AI CAPEX',
    outlook: 'BULLISH' as const,
    source: 'Deloitte 2026 Semiconductor Outlook',
  },
  cybersecurity: {
    name: 'Siber Güvenlik',
    marketSize2026: '$244B',
    growthRate: '+13.5% YoY',
    keyDriver: 'AI-destekli tehdit artışı',
    outlook: 'BULLISH' as const,
    source: 'Gartner Security Spending Forecast 2026',
  },
  cloudSoftware: {
    name: 'Bulut Yazılım',
    marketSize2026: '$1.43T',
    growthRate: '+14.7% YoY',
    keyDriver: 'AI entegrasyonu',
    outlook: 'NEUTRAL' as const,
    source: 'Gartner IT Spending Forecast 2026',
  },
  dataCenter: {
    name: 'Veri Merkezi',
    marketSize2026: '$653B',
    growthRate: '+31.7% YoY',
    keyDriver: 'AI sunucu talebi',
    outlook: 'BULLISH' as const,
    source: 'Gartner IT Spending Forecast 2026',
  },
};

// Earnings Takvimi (Kronolojik)
export const earningsCalendar = [
  { date: '21 May 2026', ticker: 'SNOW', name: 'Snowflake', time: 'AMC', signal: 'SELL' as SignalLevel },
  { date: '22 May 2026', ticker: 'ADSK', name: 'Autodesk', time: 'AMC', signal: 'NEUTRAL' as SignalLevel },
  { date: '25 May 2026', ticker: 'ZS', name: 'Zscaler', time: 'AMC', signal: 'STRONG_SELL' as SignalLevel },
  { date: '27 May 2026', ticker: 'MRVL', name: 'Marvell Technology', time: 'AMC', signal: 'STRONG_BUY' as SignalLevel },
  { date: '27 May 2026', ticker: 'DELL', name: 'Dell Technologies', time: 'AMC', signal: 'NEUTRAL' as SignalLevel },
  { date: '28 May 2026', ticker: 'COST', name: 'Costco Wholesale', time: 'AMC', signal: 'BUY' as SignalLevel },
  { date: '28 May 2026', ticker: 'CRM', name: 'Salesforce', time: 'AMC', signal: 'STRONG_SELL' as SignalLevel },
  { date: '2 Haz 2026', ticker: 'PANW', name: 'Palo Alto Networks', time: 'AMC', signal: 'NEUTRAL' as SignalLevel },
  { date: '3 Haz 2026', ticker: 'CRWD', name: 'CrowdStrike', time: 'AMC', signal: 'STRONG_BUY' as SignalLevel },
  { date: '3 Haz 2026', ticker: 'AVGO', name: 'Broadcom', time: 'AMC', signal: 'BUY' as SignalLevel },
];

// Sinyal renkleri
export const signalConfig: Record<SignalLevel, { label: string; color: string; bgClass: string; textClass: string; borderClass: string }> = {
  STRONG_BUY: {
    label: 'Güçlü Al',
    color: '#00e5a0',
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/40',
  },
  BUY: {
    label: 'Al',
    color: '#4ade80',
    bgClass: 'bg-green-500/15',
    textClass: 'text-green-400',
    borderClass: 'border-green-500/40',
  },
  NEUTRAL: {
    label: 'Nötr',
    color: '#f59e0b',
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/40',
  },
  SELL: {
    label: 'Sat',
    color: '#f87171',
    bgClass: 'bg-red-500/15',
    textClass: 'text-red-400',
    borderClass: 'border-red-500/40',
  },
  STRONG_SELL: {
    label: 'Güçlü Sat',
    color: '#ef4444',
    bgClass: 'bg-red-600/15',
    textClass: 'text-red-500',
    borderClass: 'border-red-600/40',
  },
};

export const riskConfig: Record<RiskLevel, { label: string; textClass: string }> = {
  LOW: { label: 'Düşük', textClass: 'text-emerald-400' },
  MEDIUM: { label: 'Orta', textClass: 'text-amber-400' },
  HIGH: { label: 'Yüksek', textClass: 'text-orange-400' },
  VERY_HIGH: { label: 'Çok Yüksek', textClass: 'text-red-500' },
};
