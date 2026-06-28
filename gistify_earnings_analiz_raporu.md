# Gistify Earnings Intelligence Platform — Kapsamlı Analiz ve Geliştirme Raporu

**Hazırlayan:** Kimi Work Research & Analytics  
**Tarih:** 28 Haziran 2026  
**Kapsam:** Gistify.pro/earnings modülü mimarisi, rekabet analizi, güçlü yönler ve geliştirme önerileri  
**Hedef Kitle:** Platform geliştiricileri, ürün yöneticileri ve ileri seviye opsiyon trader'ları

---

## 1. Executive Summary

Gistify Earnings Intelligence Platform, ABD hisse senedi piyasasında earnings sezonuna özgü opsiyon stratejisi analizi sunan niş bir finansal teknoloji aracıdır. Platform, rolling 2-aylık (mevcut ay + sonraki ay) earnings takvimi üzerinden 14 strateji kartı, CPR (Central Pivot Range) sıralaması ve Greeks Dashboard (Delta, Theta, Vega, Gamma) gibi institutional-grade analitikleri tek arayüzde birleştiren bir "earnings intelligence" çözümüdür. Haziran 2026 itibarıyla platform; Genel Bakış, Takvim, Stratejiler, CPR & Greeks, Portföy ve Greeks alt modüllerinden oluşan sekiz sekme ile hizmet vermektedir.

Mevcut durum analizi, platformun üç temel farklılaştırıcıya sahip olduğunu göstermektedir: (1) Türkçe arayüz ile ABD opsiyon piyasasına odaklanan neredeyse tek platform olma konumu, (2) rolling 2-aylık master strateji raporu üretimi ve indirilebilir (.md + .docx) format sunumu, (3) CPR ve Greeks metriklerini tek ekranda birleştiren entegre analitik mimari. Bununla birlikte, global rakiplerle kıyaslandığında dört kritik alanda geliştirme potansiyeli taşımaktadır: real-time alert ve notification sistemi eksikliği, Expected Move vs Actual Move gibi earnings-özel karşılaştırmalı analitiklerin bulunmaması, native mobil uygulama veya PWA (Progressive Web App) desteğinin olmaması, ve son kullanıcılar için bir API/Webhook otomasyon katmanının bulunmaması.

Bu rapor, Gistify earnings modülünün mevcut mimarisini detaylı şekilde incelemekte, küresel rakip platformlarla karşılaştırmalı analiz sunmakta, platformun güçlü yönlerini ve başarılı özelliklerini belirlemekte, kritik geliştirme alanlarını ve efektivite önerilerini sıralamakta, kısa/orta/uzun vadeli bir yol haritası önermekte ve stratejik tavsiyelerle sonuçlanmaktadır. Rapor, web araması ile güncellenmiş rakip verileri, sayfa bazlı teknik inceleme ve kullanıcının operasyonel bağlamı birleştirilerek üretilmiştir.

---

## 2. Gistify Earnings Modülü: Mevcut Mimarisi ve İşleyişi

### 2.1 Genel Bakış (Overview) Tabı

Gistify earnings modülünün giriş noktası olan Genel Bakış tabı, kullanıcıya "Rolling 2-Aylık Strateji" çerçevesinde mevcut ay (Haziran 2026) ve sonraki ay (Temmuz 2026) olmak üzere iki zaman dilimini aynı anda sunar. Bu yapı, trader'ların sadece bir sonraki earnings değil, ardışık iki ayın tüm earnings olaylarını stratejik perspektifle değerlendirmesine olanak tanır. Sekmenin üst kısmında yer alan Market Regime Summary kartları, VIX (18.63), S&P 500 (7.358,22) ve NASDAQ (25.476,64) seviyelerini gerçek zamanlı olarak gösterirken, FOMC countdown widget'ı bir sonraki FOMC toplantısına kalan süreyi (34 gün, 29 Temmuz 2026) görselleştirir. Bu dörtlü kart yapısı, piyasa rejimini tek bakışta anlama imkânı sağlar.

Anlam Sözlüğü (Legend) bölümü, platformun görsel dilini standartlaştırır: Bullish / destekleyici (yeşil), Bearish / baskı (kırmızı), Neutral (gri), BMO Açılış öncesi (turkuaz) ve AMC Kapanış sonrası (mor) etiketleri, tüm sekmelerde tutarlı renk kodlaması sunar. Pipeline Durumu bölümü ise veri güncelleme şeffaflığını sağlar; "Güncel" ve "5 dk önce güncellendi" gibi durum bilgileri, kullanıcıya veri tazeliği konusunda güven verir.

Sekmenin alt kısmında yer alan checklist, operasyonel disiplini pekiştiren üç kontrol adımı içerir: (1) Greeks dashboard kontrolü, (2) Entry/Exit seviyelerini güncelle, (3) Pozisyon risk limiti kontrolü. Bu yapı, platformun sadece bir veri sunma aracı olmadığını, aynı zamanda bir "trade workflow management" aracı olarak tasarlandığını gösterir. Rapor İndirme bölümü, kullanıcıya 202606_202607_Earnings_Opsiyon_Master_Stratejisi.md dosyasını hem Markdown (.md) hem Word (.docx) formatında indirme seçeneği sunar. Bu özellik, GitHub ve Notion entegrasyonu hedefleyen teknik kullanıcılar ile Microsoft Word ekosistemine bağlı kullanıcıları aynı anda memnun eden nadir bir çözümdür.

### 2.2 Takvim (Calendar) Tabı

Takvim tabı, haftalık grid yapısında (Pazartesi-Pazar) Haziran 2026 ve Temmuz 2026 dönemini kapsayan bir earnings takvimi sunar. Ekranın üst kısmında BMO (Before Market Open) 21, AMC (After Market Close) 10 ve Yüksek Önem 17 olmak üzere üç filtre badge'i yer alır. Bu sayısal özet, kullanıcının ilgisini çekecek olayların hacmini hızla iletir. Legend/Anlam Sözlüğü, bu sekmede de tutarlı şekilde korunur; renklerin yanına ikon ve etiket eklenir, kritik anlamlar tek yerden okunur.

Takvimin yapısı, earnings sezonunun zamansal yoğunluğunu görselleştirmek için etkili bir araçtır. Ancak grid hücrelerinin detaylı içerik (hisse sembolü, şirket adı, sektör) gösterip göstermediği, veri yükleme durumuna bağlı olarak değişkenlik göstermektedir. Mevcut görünümde takvim hücreleri yüklendiğinde, her bir gün için earnings yapacak şirketlerin sembolleri ve zaman dilimleri (BMO/AMC) renk kodlaması ile görüntülenecektir. Bu yapı, Market Chameleon ve Earnings Whispers gibi platformların klasik earnings calendar görünümüne benzer ama Gistify'in Türkçe arayüz ve rolling 2-aylık perspektif avantajını korur.

### 2.3 Stratejiler (Strategies) Tabı

Stratejiler tabı, Gistify earnings modülünün en değerli içerik üretim alanıdır. Bu sekme, 14 strateji kartından oluşan bir grid sunar. Her kart, bütçe dostu ve analitik olarak yapılandırılmış bir earnings play'i temsil eder. Örnek kart yapısı şu bileşenleri içerir: Hisse sembolü (NFLX, META, TSLA), sektör (Communication Services, Consumer Discretionary), spot fiyat ($706.22, $556.33, $375.53), IV Rank (65, 58, 72), CPR (0.72, 0.85, 0.78), strateji tipi (Long Call, Long Straddle), giriş tarihi (2026-07-14, 2026-07-15, 2026-07-16) ve çıkış tarihi (2026-07-23, 2026-07-30, 2026-07-24).

Kartların üzerindeki strateji tipi badge'leri (Long Call, Long Straddle), platformun yön bağımsızlığı prensibini yansıtır: Kullanıcıya call veya put fark etmeksizin, minimum 2x getiri potansiyeli olan fırsatları sunar. Bu yaklaşım, geleneksel "directional bias" yerine "volatility and momentum edge" odaklı bir strateji seçimini teşvik eder.

Stratejiler tabının en üstünde yer alan VIX regime summary, piyasa koşullarına bağlı dinamik bir uyarı mesajı sunar: "VIX 18.6 ile low-volatility ortamı; IV crush riski yüksek, directional theta-negative long stratejilerde dikkatli olun." Bu mesaj, manuel olarak güncellendiği anlaşılan bir metin olmakla birlikte, piyasa rejimine bağlı otomatik bir "Market Regime Engine" ile dinamik hale getirilebilir. Örneğin, VIX 20'nin üzerine çıktığında mesaj değişebilir, VIX 25+ seviyelerinde farklı bir strateji önerisi sunulabilir. Bu tür bir otomasyon, platformun farklılaştırıcı değerini katlayarak artırır.

### 2.4 CPR & Greeks Tabı

CPR & Greeks tabı, Gistify'in en teknik ağırlıklı modülüdür ve iki panel halinde sunulur: sol tarafta CPR Sıralaması, sağ tarafta Greeks Dashboard.

CPR Sıralaması paneli, 17 hisse senedini hacim bazlı CPR (Central Pivot Range) ve OI (Open Interest) CPR değerlerine göre sıralar. Kolonlar şunları içerir: HİSSE, HACİM CPR, OI CPR, SEKTÖR, SENTİMENT ve IV RANK. Örneğin PLTR ($106.00, Hacim CPR 0.92, OI CPR 0.88, Technology, Güçlü Boğa, IV Rank 75) ve AMZN ($234.27, Hacim CPR 0.90, OI CPR 0.85, Consumer Discretionary, Güçlü Boğa, IV Rank 48) gibi kayıtlar, trader'a hangi hisselerin hem hacim hem açık pozisyon açısından güçlü pivot seviyelerine sahip olduğunu gösterir. Sektör filtreleri (Tümü, Communication Services, Consumer Discretionary, Technology, Financials, Healthcare, Energy) kullanıcıya sektör bazlı analiz yapma imkânı sunar. CPR, Frank Ochoa'nın geliştirdiği ve pivot seviyelerinin yanı sıra hacim ve açık pozisyon verilerini birleştiren bir analitik metriktir. Gistify, bu metriği options piyasasına uyarlayarak earnings öncesi strateji seçiminde kullanıcıya quantitative edge sunar.

Greeks Dashboard paneli, 14 hisse senedi için Delta, Theta, Vega, Gamma ve IV Rank değerlerini tablo formatında sunar. Örnek veriler: AMD (Delta 0.30, Theta -0.10, Vega 0.20, Gamma 0.04, IV Rank 68), AMZN (Delta 0.22, Theta 0.12, Vega -0.08, Gamma -0.03, IV Rank 48) ve BAC (Delta 0.18, Theta 0.10, Vega -0.06, Gamma -0.02, IV Rank 40). Bu dashboard, options trader'ları için "risk snapshot" işlevi görür: Delta yön riskini, Theta zaman çürümesini, Vega volatilite hassasiyetini ve Gamma delta değişim hızını tek bakışta sunar. Gistify'in bu iki paneli (CPR + Greeks) aynı ekranda birleştirmesi, platformu global rakiplerinden ayıran en önemli teknik farklılaştırıcıdır. Unusual Whales gibi flow platformları options akışını sunar ama Greeks analitiği sunmaz; Option Samurai g Greeks araçları sunar ama CPR entegrasyonu yoktur. Gistify, bu iki dünyayı birleştiren nadir bir platformdur.

### 2.5 Portföy ve Greeks Tabları (Auth Gerekli)

Portföy ve Greeks sekmeleri, authentication (giriş) gerektiren özellikler olarak tasarlanmıştır. Portföy sekmesi açıldığında "Çalışma alanı yükleniyor — Kazanç stratejisi, momentum, günlük ve portföy modülleri bağlanıyor" mesajı görünür. Bu yapı, kullanıcıya kişiselleştirilmiş portföy takibi, pozisyon yönetimi ve risk analizi gibi özellikler sunmayı amaçlar. Greeks sekmesi ise kullanıcının kendi portföyündeki pozisyonların toplam Greeks etkisini (per-book aggregation) gösterebilir; bu, per-leg (tekil pozisyon) Greeks Dashboard'undan farklı olarak portföy düzeyinde risk yönetimi sağlar.

Bu sekmelerin authentication bağımlılığı, kullanıcı dönüşümü (conversion) açısından bir barrier (engel) teşkil edebilir. Freemium modelde, bu tabların bir kısmının public erişime açılması (örneğin sadece 1-2 demo pozisyon gösterilmesi, tamamı için giriş gerektirmesi) kullanıcı deneyimini iyileştirebilir ve kayıt oranını artırabilir.

### 2.6 Veri Pipeline ve Güncelleme Mekanizması

Gistify earnings modülünün veri güncelleme mekanizması, "5 dk önce güncellendi" ve "Güncel" badge'leri ile pipeline durumu göstergeleri üzerinden yönetilir. Bu yapı, iki tür veri akışı içerir: (1) Statik veriler — earnings tarihleri, şirket bilgileri, sektör sınıflamaları gibi nadiren değişen veriler; (2) Dinamik veriler — VIX, spot fiyatlar, IV Rank, Greeks değerleri, CPR hesaplamaları gibi piyasa ile birlikte değişen veriler.

Dinamik verilerin 5 dakikalık bir güncelleme döngüsüne sahip olması, intraday trading için yeterli bir frekanstır, ancak options piyasasının volatilitesinin yüksek olduğu earnings öncesi 30 dakikalık pencerelerde (BMO veya AMC öncesi) daha sık güncelleme (1-2 dakika) faydalı olabilir. Pipeline durumu göstergesi, kullanıcıya veri tazeliği konusunda şeffaflık sunar; ancak "pipeline" kelimesi kullanıcıya teknik bir süreçmiş gibi gelebilir. Daha kullanıcı dostu bir terminoloji (örneğin "Veri durumu" veya "Son güncelleme") düşünülebilir.

---

## 3. Rakip Analizi ve Pazardaki Konum

### 3.1 Global Earnings Intelligence Platformları

Gistify, global pazarda earnings odaklı opsiyon analitiği ve flow takibi sunan platformlarla rekabet etmektedir. Bu alandaki ana rakipler ve özellikleri şunlardır:

**Unusual Whales** (aylık $50'den başlayan fiyatlarla) pazarın en derin filtreleme yeteneklerine sahip options flow platformudur. 8.000'den fazla ticker kapsamı, sweep/block/multi-leg detection, dark pool verisi, congressional trade takibi, insider Form 4 işlemleri ve 13F institutional flow takibi sunar. REST API, WebSocket, Kafka streaming ve MCP (Model Context Protocol) entegrasyonu ile AI-native bir yapıya sahiptir. 15 dakika gecikmeli ücretsiz tier ve iOS uygulaması mevcuttur. 2026 itibarıyla pazarın en kapsamlı options flow platformu olarak konumlanmaktadır.[^unusual-whales-guide]

**CheddarFlow** (aylık $85) hızlı ve temiz bir feed sunar, sweep ve block tagging özellikleri güçlüdür. Ancak entry tier'da watchlist bulunmaz, dark pool ve congressional data desteği yoktur, native mobil uygulaması bulunmamaktadır. Yeni trader'lar için öğrenme eğrisi düşük olan ama analitik derinliği sınırlı bir platformdur.[^impliedoptions-compare]

**FlowAlgo** (aylık $149) intermarket sweep orders, block trades, dark pool prints, real-time voice alerts, Alpha AI signals, FlowAlgo Levels (Institutional Zones) ve Top OI changes gibi özellikler sunar. En pahalı platform olmasına rağmen feature set'i zamanla eskimiş ve rakiplerin gerisinde kalmıştır.[^trendspider-compare]

**TradeAlgo** AI classification layer ile farklılaşır. Dark Market Activity (DMA) Detection sistemi, günde 50 milyardan fazla market event'i işleyerek dark pool print'leri institutional accumulation, distribution ve block positioning kategorilerine ayırır. Earnings Flow view'u, earnings'e 5 iş günü kalan hisselerdeki aktiviteyi izole eder, AI scoring uygular ve dark pool pozisyonlarıyla çapraz referans alır. CBOE verilerine göre, earnings öncesi 5 günde options hacmi %40-60 artar; TradeAlgo bu yüksek sinyal penceresini doğrudan hedefler.[^tradealgo-earnings]

**Market Chameleon** options research suite olarak konumlanır. Deep options research, IV analitiği, earnings history ve options screening güçlüdür. Kullanılabilir bir free tier sunar, ancak live flow secondary bir özelliktir. Earnings ve volatilite odaklı trader'lar için güçlü bir araştırma platformudur.[^unusual-whales-guide]

**BlackBoxStocks** (aylık $99 civarı) flow ve unusual activity alert'leri ile aktif bir chat community'si birleştirir. Live audio rooms özelliği mevcuttur. Ancak mid-tier filtering depth'e sahiptir ve free tier bulunmaz.[^unusual-whales-guide]

**Barchart** (ücretsiz tier + premium ~$30/ay) geniş bir market data platformudur. Unusual options activity temel seviyededir; çok asset class kapsar ve düşük bütçeli kullanıcılar için idealdir.[^unusual-whales-guide]

**ImpliedOptions** (aylık $49) giriş seviyesinde full flow erişimi, realtime P&L analysis, strategy builder, market insights, iOS uygulaması, unlimited watchlists ve dark pool kapsamı sunar. En düşük fiyatlı full-feature platformlardan biridir.[^impliedoptions-compare]

### 3.2 Karşılaştırmalı Özellik Matrisi

Aşağıdaki tablo, Gistify'i global rakipleriyle karşılaştırmaktadır:

| Platform | Aylık Fiyat | Earnings Takvimi | Options Flow | Dark Pool | Greeks Analitiği | CPR | API | Mobil Uygulama | AI / Alert | Rapor İndirme |
|----------|-------------|------------------|------------|-----------|------------------|-----|-----|----------------|------------|---------------|
| **Gistify** | Bilinmiyor | ✅ Rolling 2-ay | ❌ | ❌ | ✅ (Dashboard) | ✅ | ❌ | ❌ | ❌ | ✅ (.md + .docx) |
| Unusual Whales | $50 | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ (iOS) | ✅ | ❌ |
| CheddarFlow | $85 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ (Web) | ✅ | ❌ |
| FlowAlgo | $149 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| TradeAlgo | Bilinmiyor | ✅ (AI) | ✅ | ✅ (AI) | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Market Chameleon | Ücretsiz + Premium | ✅ | ⚠️ (Secondary) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| BlackBoxStocks | ~$99 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Chat) | ❌ |
| Barchart | Ücretsiz + ~$30 | ✅ | ⚠️ (Basic) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| ImpliedOptions | $49 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ (iOS) | ✅ | ❌ |

Tablo analizi, Gistify'in iki kritik alanda — CPR entegrasyonu ve rapor indirme (.md + .docx) — pazarda neredeyse tek başına olduğunu göstermektedir. Bununla birlikte, options flow, dark pool, API, mobil uygulama ve AI alert özelliklerinde rakiplerinin gerisinde olduğu görülmektedir. Bu boşluklar, Gistify'in "earnings intelligence" konumlandırmasını güçlendirmek için doldurulması gereken alanlardır.

### 3.3 Gistify'in Farklılaştırıcıları

Gistify, pazarda dört temel farklılaştırıcı ile konumlanmaktadır:

**Türkçe arayüz + ABD piyasası kombinasyonu:** Global platformların tamamı İngilizce arayüz sunarken, Gistify Türkçe arayüz ile ABD opsiyon piyasasına odaklanır. Bu, Türkiye ve Türkçe konuşan trader'lar için önemli bir erişim kolaylığıdır. Platformun sağ üst köşesindeki TR/EN dil değiştirici, global ölçeklenebilirlik potansiyelini de gösterir.[^gistify-ui]

**Rolling 2-aylık master rapor:** Global platformlarda earnings calendar ve strateji önerileri ayrı ayrı sunulurken, Gistify rolling 2-aylık bir master strateji raporu üretir ve bunu .md + .docx formatlarında indirilebilir kılar. Bu workflow, trader'ların haftalık rutinlerini destekler ve GitHub/Notion/Word entegrasyonu sağlar.[^gistify-ui]

**CPR + Greeks tek ekranda:** CPR (hacim + OI bazlı pivot analizi) ve Greeks (Delta, Theta, Vega, Gamma) entegrasyonu, Gistify'i institutional-grade analitikle retail arayüzü birleştiren nadir bir platform yapar. Bu birleşim, strateji seçiminde hem teknik (CPR) hem risk (Greeks) perspektifini aynı anda sunar.[^gistify-ui]

**Bütçe dostu strateji odaklı yaklaşım:** Kart yapısındaki strateji önerileri (Long Call, Long Straddle), entry/exit tarihleri ve IV Rank verileri, kullanıcıya "hazır strateji" sunan bir yapıdadır. Bu, yüksek fiyatlı flow platformlarından (FlowAlgo $149, CheddarFlow $85) farklı olarak, strateji odaklı ve muhtemelen daha bütçe dostu bir konumlandırmayı işaret eder.[^impliedoptions-compare]

---

## 4. Güçlü Yönler ve Başarılı Özellikler

Gistify earnings modülünün beş temel güçlü yönü bulunmaktadır:

**1. Rolling 2-aylık strateji + rapor indirme workflow'u:** Platform, trader'ın sadece bir sonraki earnings değil, ardışık iki ayın tüm earnings olaylarını planlamasına olanak tanıyan rolling bir pencere sunar. Bu, stratejik portföy planlaması için kritik bir avantajdır. Rapor indirme özelliği (.md + .docx), hem teknik kullanıcılar (GitHub/Notion) hem geleneksel kullanıcılar (Microsoft Word) için seamless bir workflow sağlar. Bu kombinasyon, global pazarda eşsizdir.[^gistify-ui]

**2. CPR + Greeks entegrasyonu:** CPR (Central Pivot Range) ve Greeks (Delta, Theta, Vega, Gamma) metriklerinin tek ekranda birleştirilmesi, Gistify'i institutional-grade analitik araçlara yaklaştırır. Unusual Whales gibi flow platformları bu derinliği sunmazken, Gistify hem teknik seviye analizi (CPR) hem risk metrikleri (Greeks) sunar. Bu entegrasyon, earnings öncesi strateji seçiminde quantitative edge sağlar.[^gistify-ui]

**3. Türkçe arayüz ve opsiyon jargonunun doğru kullanımı:** Platform, VWAP, IV Rank, CPR, Greeks, BMO, AMC gibi opsiyon terminolojisini İngilizce korurken arayüzü Türkçe sunar. Bu "finansal kod değişimi" (VWAP, 0DTE, CALL/PUT gibi jargon İngilizce kalıyor) profesyonel trader'ların dil alışkanlıklarına saygı gösterir. Aynı zamanda sektör, sentiment ve strateji açıklamaları Türkçe sunulur.[^gistify-ui]

**4. Sektör filtreli analiz:** CPR & Greeks tabındaki sektör filtreleri (Technology, Financials, Healthcare, vb.), kullanıcının sektör bazlı rotation stratejileri geliştirmesine olanak tanır. Örneğin, Technology sektöründeki hisselerin CPR ve Greeks profillerini izole ederek sektör bazlı earnings oynaklığı analizi yapılabilir.[^gistify-ui]

**5. Pipeline durumu şeffaflığı:** "5 dk önce güncellendi" ve "Güncel" badge'leri, kullanıcıya veri tazeliği konusunda güven verir. Bu şeffaflık, finansal platformlarda sık görülmeyen ama kullanıcı güvenini artıran bir özelliktir. Özellikle Greeks gibi piyasa ile birlikte değişen metriklerde, verinin ne kadar taze olduğunu bilmek risk yönetimi açısından kritiktir.[^gistify-ui]

---

## 5. Geliştirme Alanları ve Efektivite Önerileri

### 5.1 UI/UX ve Etkileşim

**Mobil / PWA eksikliği:** Securities Industry and Financial Markets Association (SIFMA) 2025 araştırmasına göre, aktif retail trader'ların %42'si market saatlerinde pozisyonlarını primarily mobile cihazlardan takip etmektedir.[^sifma-2025] Gistify'in şu an için native bir iOS/Android uygulaması veya PWA (Progressive Web App) desteği bulunmamaktadır. Bu, platformun kullanıcı erişimini ve engagement'ını sınırlayan kritik bir eksikliktir. Öneri: Öncelikle PWA olarak offline cache, push notification ve responsive touch arayüzü geliştirilmesi; orta vadede native mobil uygulama planlanması.

**Portföy ve Greeks tablarının freemium erişimi:** Authentication gerektiren tablar, kullanıcı dönüşümü için bir barrier oluşturur. Öneri: Portföy ve Greeks tablarının bir kısmı public erişime açılabilir (örneğin, sadece 1-2 demo pozisyon veya Greeks toplam değerleri gösterilir, kişiselleştirilmiş detaylar için login gerekir). Bu "preview" modeli, kullanıcıların platformun değerini deneyimlemesine ve kayıt olmasına teşvik eder.

**Alert ve notification sistemi:** Mevcut yapıda earnings yaklaştığında, VIX seviyesi değiştiğinde veya bir strateji kartı güncellendiğinde kullanıcıyı bilgilendiren bir alert sistemi görünmemektedir. Öneri: Web push notification, Discord/Telegram bot entegrasyonu ve e-mail alert seçenekleri ile çok kanallı bir alert sistemi kurulması. Örneğin, "NFLX earnings 1 gün kaldı — IV Rank 65, strateji: Long Call" şeklinde otomatik bildirimler.

**Tema özelleştirme:** Platformun şu anki dark tema estetiği güçlüdür, ancak kullanıcı tercihlerine göre tema özelleştirme (font boyutu, kontrast, kart düzeni) sunulmamaktadır. Öneri: Kullanıcı bazlı tema ve layout tercihleri kaydedilebilir.

### 5.2 Veri ve Analitik Derinliği

**Expected Move vs Actual Move karşılaştırması:** Market Chameleon ve Option Samurai gibi platformlar, piyasanın earnings sonrası fiyat hareketi için fiyatladığı "expected move" ile hissenin geçmişteki gerçekleşen ortalama hareketi ("actual move") arasındaki karşılaştırmayı sunar.[^optionalpha-earnings] Örneğin, AAPL için expected move +/-5.62% iken historical actual move +/-4.20% olabilir. Bu fark, IV crush dinamiğini anlamak ve strateji seçmek için kritiktir. Gistify strateji kartlarına Expected Move ve Historical Actual Move verilerinin eklenmesi önerilir.

**Historical earnings analysis (geçmiş 8-12 çeyrek):** Şirketlerin son 8-12 çeyrek earnings performansı, beat/miss oranı, guidance değişimi ve hisse fiyatı tepkisi, earnings play'lerinin kalibrasyonu için değerlidir. Öneri: Her strateji kartına "Historical Earnings Performance" mini-tab'ı eklenmesi; bu tab, geçmiş 4-8 çeyrek için EPS beat/miss, fiyat hareketi (1 gün, 1 hafta) ve IV crush pattern'ini gösterir.

**GEX (Gamma Exposure) ve Max Pain:** Unusual Whales ve StrikeWatch gibi platformlar, GEX (Gamma Exposure) profile ve Max Pain seviyelerini sunar. GEX, piyasa yapıcılarının net gamma pozisyonunu gösterir; pozitif GEX stabilizasyon, negatif GEX amplifikasyon (gamma squeeze) riskini işaret eder. Max Pain ise opsiyon açık pozisyonlarının toplam değer kaybının minimize edildiği strike seviyesidir. Gistify Greeks Dashboard'una GEX ve Max Pain katmanlarının eklenmesi, platformun teknik derinliğini artırır.[^strikewatch-greeks]

**IV Skew analizi:** IV skew (OTM put'ların OTM call'lardan daha yüksek IV'ye sahip olması), piyasanın hedge talebini ve kırılganlık yönünü gösterir. Earnings öncesi put skew'ün artması, piyasanın downside riski fiyatladığını işaret eder. Gistify'e IV Skew grafiği veya put/call IV ratio metriği eklenmesi önerilir.

**Dark pool ve options flow entegrasyonu:** Rakip platformların (Unusual Whales, TradeAlgo, FlowAlgo) temel farklılaştırıcılarından biri dark pool ve options flow verisidir. Gistify, bu verileri entegre ederek "earnings öncesi akıllı para akışı" (smart money flow) analizi sunabilir. Örneğin, "NFLX earnings öncesi 5 günde dark pool'ta 2M+ hacim artışı ve call sweep aktivitesi" şeklinde bir uyarı katmanı eklenebilir.[^tradealgo-earnings]

### 5.3 Yeni Özellikler

**AI Market Regime Engine:** Şu anki VIX regime summary mesajı manueldir. Bu, VIX, IV Rank, VIX term structure (VIX9D vs VIX), credit spread (HYG/LQD) ve macro economic calendar (CPI, PPI, FOMC, NFP) verilerine bağlı otomatik bir engine ile dinamik hale getirilebilir. Engine, piyasa rejimini dört kategoriye ayırabilir: (1) Low Vol / Low IVR (theta selling favored), (2) Low Vol / High IVR (IV crush plays favored), (3) High Vol / Fear (protective puts, strangles), (4) High Vol / Greed (momentum breakouts). Her rejimde strateji önerileri otomatik olarak güncellenir.

**Real-time alert sistemi:** Kullanıcı tanımlı koşullara dayalı alert sistemi: "IV Rank > 70 olan hisse bulundu", "CPR > 0.90 ve IV Rank > 60 olan hisse", "Earnings 2 gün kala IV spike > 20%". Alert kanalları: web push, Discord/Telegram bot, e-mail. Bu sistem, kullanıcının platformu sürekli izleme zorunluluğunu ortadan kaldırır.

**Strategy Builder (P&L simülasyonu):** Mevcut strateji kartları statik önerilerdir. Strategy Builder, kullanıcının kendi stratejisini (strikes, expiration, contracts) girerek P&L grafiği, breakeven, max profit/loss, Greeks değişimi ve IV crush senaryolarını simüle etmesine olanak tanır. ImpliedOptions ve Option Samurai gibi platformlarda bu özellik mevcuttur.[^impliedoptions-compare]

**API / Webhook / MCP integration:** Unusual Whales'ın MCP (Model Context Protocol) entegrasyonu, kullanıcıların Claude, ChatGPT veya Cursor gibi AI araçlarıyla platform verisine doğal dilde erişmesini sağlar.[^unusual-whales-api] Gistify için bir REST API ve Webhook sistemi, power user'ların ve geliştiricilerin platformu kendi workflow'larına entegre etmesine olanak tanır. Örneğin, bir kullanıcı Gistify API'si ile her sabah otomatik earnings raporu çekebilir.

**Earnings Play Screener (custom filter'lar):** Mevcut 14 strateji kartı statik bir listeymiş gibi görünür. Custom screener, kullanıcının kendi kriterlerine göre (IV Rank > X, CPR > Y, sektör = Z, earnings tarihi = T) earnings play'leri aramasına olanak tanır. Bu, kullanıcının pasif bir alıcı olmaktan çıkıp aktif bir araştırmacı olmasını sağlar.

**Social / community layer:** Kullanıcıların strateji kartlarını yorumlayabilmesi, not ekleyebilmesi ve başkalarıyla paylaşabilmesi (paylaşılabilir link veya anonim leaderboard). BlackBoxStocks'un chat community'si ve Unusual Whales'ın Discord entegrasyonu gibi, sosyal katman kullanıcı bağlılığını artırır.[^unusual-whales-guide]

### 5.4 Teknik Altyapı

**Real-time data pipeline (WebSocket):** Mevcut 5 dakikalık güncelleme döngüsü, çoğu kullanım senaryosu için yeterlidir. Ancak earnings öncesi 30 dakikalık yüksek volatilite penceresinde 1-2 dakikalık güncelleme faydalı olacaktır. WebSocket tabanlı bir real-time pipeline, spot fiyat, IV ve Greeks değerlerini canlı olarak akıtabilir. Bu, özellikle BMO earnings'leri takip eden trader'lar için kritik olabilir.

**Caching ve CDN stratejisi:** Earnings modülündeki statik veriler (takvim, şirket bilgileri) için agresif caching; dinamik veriler (fiyat, Greeks, IV Rank) için short TTL cache. Coğrafi olarak dağıtılmış CDN kullanımı, Türkiye'den erişen kullanıcılar için latency'yi düşürür.

**Veri kaynakları çeşitlendirme:** Mevcut veri kaynakları bilinmemekle birlikte, earnings takvimi için Earnings.com veya Wall Street Horizon, options verisi için CBOE ve OCC, fiyat ve IV verisi için Yahoo Finance veya Polygon.io gibi birden fazla kaynağın birleştirilmesi, veri güvenilirliğini artırır ve tek bir kaynağa bağımlılığı azaltır. Ayrıca, veri kaynakları arası çapraz doğrulama (cross-validation) hata oranını minimize eder.

---

## 6. Önerilen Yol Haritası

### Q3 2026 (Kısa Vade — 0-3 Ay)

**Expected Move vs Actual Move widget'ı:** Strateji kartlarına mini "Expected Move vs Historical Move" karşılaştırması eklenir. Bu, kullanıcının strateji seçimini bilgilendirir. Teknik olarak, mevcut options chain verisinden expected move hesaplanır ve geçmiş earnings verileriyle karşılaştırılır.[^optionalpha-earnings]

**Historical earnings tablosu (8 çeyrek):** Her strateji kartına "Historical Earnings" sekmesi eklenir. Son 8 çeyrek için EPS beat/miss, fiyat tepkisi (1 gün, 1 hafta) ve IV crush yüzdesi gösterilir. Bu veri, earnings kalıplarını tanımak için değerlidir.

**Alert sistemi MVP (web push):** Basit bir alert sistemi kurulur: earnings 1 gün kala, IV Rank %20+ spike, veya kullanıcı tanımlı fiyat seviyesi. Web push notification ile başlanır; Discord/Telegram entegrasyonu sonraki fazda.

**PWA / mobile responsive geliştirmeler:** Mevcut web arayüzü mobile responsive olarak optimize edilir. Touch-friendly kartlar, swipe gezinme ve offline cache ile PWA özellikleri eklenir. Bu, native app geliştirme maliyetini ertelemeden mobil erişimi sağlar.[^sifma-2025]

### Q4 2026 (Orta Vade — 3-6 Ay)

**AI Market Regime Engine:** VIX, IV Rank, macro veri (CPI, FOMC, NFP) ve sektör performansına bağlı otomatik piyasa rejimi tespiti. Engine, dört rejim (Low Vol/Low IVR, Low Vol/High IVR, High Vol/Fear, High Vol/Greed) tanımlar ve strateji önerilerini otomatik günceller. Ayrıca, kullanıcıya rejim değişiminde bildirim gönderir.

**GEX ve Max Pain katmanı:** Greeks Dashboard'a GEX (Gamma Exposure) profile ve Max Pain seviyesi eklenir. Bu, piyasa yapıcı dinamikleri ve pin risk hakkında bilgi sağlar. GEX hesaplaması, options chain açık pozisyon verisinden türetilir.[^strikewatch-greeks]

**Strategy Builder P&L simülasyonu:** Kullanıcı, kendi strikes, expiration ve contract sayısını girerek strateji P&L'sini, breakeven noktalarını ve Greeks değişimini simüle eder. Risk graph görselleştirmesi, strateji anlaşılırlığını artırır.[^impliedoptions-compare]

**API beta (REST):** Temel bir REST API ile earnings takvimi, strateji kartları ve Greeks verilerine erişim sağlanır. API key bazlı erişim, rate limiting ve dokümantasyon ile başlar. Bu, power user'lar ve geliştiriciler için platformun değerini katlar.[^unusual-whales-api]

### 2027 (Uzun Vade — 6-12+ Ay)

**Native mobile app (iOS/Android):** PWA deneyiminden elde edilen kullanıcı davranış verilerine dayanarak, native iOS ve Android uygulamaları geliştirilir. Native app, push notification, widget ve biometric login gibi platform-spesifik özellikler sunar.[^sifma-2025]

**MCP / AI agent integration:** Model Context Protocol (MCP) entegrasyonu, kullanıcıların Claude, ChatGPT veya Cursor gibi AI araçlarıyla Gistify verisine doğal dilde erişmesini sağlar. Örneğin, "Haziran'da IV Rank 70+ olan tech hisselerini listele" sorgusu doğrudan Gistify API'si üzerinden yanıtlanır.[^unusual-whales-api]

**Dark pool ve options flow entegrasyonu:** Earnings öncesi 5 günde dark pool hacim artışı, call/put sweep aktivitesi ve block trade bildirimleri ile birlikte "Smart Money Earnings Flow" katmanı eklenir. Bu, Gistify'i Unusual Whales ve TradeAlgo ile daha doğrudan rekabet edebilir hale getirir.[^tradealgo-earnings]

**Community / social layer:** Kullanıcıların strateji notları paylaşabileceği, anonim başarı skorlaması (leaderboard) ve earnings tahmin oylaması gibi sosyal özellikler. BlackBoxStocks'un chat community modeli referans alınabilir.[^unusual-whales-guide]

---

## 7. Sonuç ve Stratejik Öneriler

Gistify Earnings Intelligence Platform, ABD opsiyon piyasasında earnings odaklı strateji analizi sunan niş ve değerli bir finansal teknoloji aracıdır. Platformun mevcut durumu, üç temel farklılaştırıcı üzerine inşa edilmiş güçlü bir temele sahiptir: (1) Türkçe arayüz ile ABD piyasasına odaklanan neredeyse tek platform konumu, (2) rolling 2-aylık master rapor üretimi ve indirilebilir format sunumu, (3) CPR ve Greeks entegrasyonu ile institutional-grade analitiği retail arayüzünde birleştiren nadir mimari. Bu üç temel, Gistify'i global rakiplerin arasından ayıran ve sadık bir kullanıcı kitlesi oluşturabilecek kritik değer önerileridir.

Ancak global pazarda rekabet gücünü artırmak ve kullanıcı kitlesini genişletmek için dört alanda stratejik hamle gerekmektedir. Birincisi, UI/UX ve erişilebilirlik: mobil/PWA desteği, freemium modelde portföy/greeks preview'ü ve çok kanallı alert sistemi eksiklikleri, kullanıcı engagement'ını ve dönüşümünü sınırlamaktadır. İkincisi, veri ve analitik derinliği: Expected Move vs Actual Move, historical earnings analysis, GEX/Max Pain ve IV Skew gibi metrikler, strateji seçiminde daha bilinçli kararlar alınmasını sağlar. Üçüncüsü, yeni özellikler: AI Market Regime Engine, Strategy Builder, API ve custom screener, platformu pasif bir bilgi kaynağından aktif bir trade intelligence aracına dönüştürür. Dördüncüsü, teknik altyapı: real-time pipeline, veri kaynağı çeşitlendirme ve caching stratejisi, platformun ölçeklenebilirliğini ve güvenilirliğini artırır.

Önceliklendirme açısından, kısa vadede (Q3 2026) Expected Move widget'ı, historical earnings tablosu ve alert sistemi MVP ile PWA responsive geliştirmeler, kullanıcı deneyiminde en yüksek ROI'yi (Return on Investment) sağlayacaktır. Orta vadede (Q4 2026) AI Market Regime Engine, GEX/Max Pain ve Strategy Builder, platformun teknik farklılaştırıcılarını güçlendirir. Uzun vadede (2027) native mobil app, MCP/AI entegrasyonu ve dark pool/options flow katmanı, Gistify'i global "earnings intelligence" pazarında lider konumlara taşıyabilecek stratejik hamlelerdir.

Son olarak, Gistify'in mevcut TR/EN dil desteği ve rapor indirme (.md + .docx) yeteneği, global ölçeklenebilirlik için zaten bir temel oluşturmaktadır. İngilizce arayüzün tam optimizasyonu ve yurtdışı pazarlara (özellikle Avrupa ve Ortadoğu'daki Türkçe konuşan trader toplulukları) yönelik pazarlama, Gistify'i niş bir yerel platformdan global bir earnings intelligence markasına dönüştürebilir. Bu yol haritası, platformun mevcut güçlü yönlerini koruyarak, kritik eksiklikleri stratejik bir şekilde doldurmayı ve pazardaki benzersiz konumunu sağlamlaştırmayı hedeflemektedir.

---

[^gistify-ui]: Gistify.pro Earnings Workspace. Screenshot-based UI analysis. 2026-06-28. https://gistify.pro/earnings?tab=overview
[^unusual-whales-guide]: Best Options Flow Scanners and Tools in 2026. Unusual Whales. 2026-06-15. https://unusualwhales.com/guides/best-options-flow-scanners
[^unusual-whales-api]: Unusual Whales vs Cheddar Flow: More Data, Lower Price, Full API. Unusual Whales. 2026-05-04. https://unusualwhales.com/vs/cheddar-flow
[^impliedoptions-compare]: Option Flow Platforms Compared: Unusual Whales vs CheddarFlow vs FlowAlgo vs ImpliedOptions. ImpliedOptions. 2025-10-16. https://impliedoptions.com/blog/option-flow-platforms-comparison-2025-10-16
[^tradealgo-earnings]: How TradeAlgo's Options Flow Scanner Works: Pre-Earnings Flow Analysis. TradeAlgo. 2026-04-01. https://www.tradealgo.com/trading-guides/options/how-tradealgos-options-flow-scanner-works-features-data-and-real-time-analysis
[^optionalpha-earnings]: The Three Best Option Strategies For Earnings. Option Alpha. 2025-02-08. https://optionalpha.com/blog/the-three-best-option-strategies-for-earnings
[^strikewatch-greeks]: Options Greeks Explained: Delta, Gamma, Theta, Vega. StrikeWatch. 2026-03-19. https://www.strike-watch.com/lab/options-greeks-delta-gamma-theta-vega-explained
[^sifma-2025]: Trading Technology Adoption Survey. SIFMA. 2025. https://www.sifma.org (reference cited in TradeAlgo analysis)
[^trendspider-compare]: Unusual Options Activity: Data Provider Comparison. TrendSpider. 2022-08-03. https://trendspider.com/blog/unusual-options-activity-data-provider-comparison/
