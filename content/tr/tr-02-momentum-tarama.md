# Momentum Tarama: Yüksek Olasılıklı Setup'ları Nasıl Bulursunuz

ABD borsalarında her gün yüzlerce hisse hareket ediyor. Ama tüm hareketler eşit değil. Bazı hareketler **yüksek olasılıklı setup** sunar — belirli teknik koşulların bir araya geldiği, risk/ödül oranının lehinize çalıştığı anlar. **Momentum tarama**, bu anları sistematik olarak bulma sanatıdır.

Bu rehber, **target keyword:** `momentum tarama` ile başlayan ve `momentum scanner`, `pre-market tarama`, `VWAP momentum` gibi konuları derinlemesine ele alan kapsamlı bir kaynaktır. Yeni başlayanlar için temel kavramlardan, aktif trader'lar için 5 dakikalık tarama rutinine kadar her şeyi bulacaksınız.

---

## Momentum Trading Nedir?

**Momentum trading**, fiyat hareketinin hızını ve gücünü takip ederek pozisyon alma stratejisidir. Temel varsayım şudur: hareket halindeki hisse, kısa vadede hareketine devam etme eğilimindedir. Newton'un fizik yasası borsaya da uygulanır: hareket halindeki cisim, hareketine devam eder.

Ama bu stratejinin bir sınırı vardır. "Too quiet" piyasada mean reversion (fiyat ortalamaya döner) geçerli olabilir. Trend günlerinde ise momentum short/long ayrımı yapmak hayati önem taşır. Bu yüzden momentum tarama sadece "yükselen hisse bulmak" değil — **hangi piyasa rejiminde nasıl davranılacağını** bilmektir.

### Momentum Trading'in 3 Temel Prensibi

1. **Hacim doğrular:** Momentum, yüksek hacimle gelirse daha güvenilirdir. Düşük hacimli breakout'lar genellikle "false breakout" (sahte kırılım) olur.
2. **Yön bağımsız fırsatlar arayın:** CALL ya da PUT fark etmez. Düşüş momentumu da güçlü olabilir — 2x bir fırsat bulmak için her iki yöne de açık olun.
3. **Zaman çerçevesi önemli:** Aynı hisse, günlük grafikte momentum gösterirken, 5 dakikalık grafikte mean reversion verebilir. Multi-timeframe analiz şart.

---

## 4 Momentum Pattern'ı

Momentum tarama yaparken en sık karşılaşacağınız dört pattern'ı detaylıca inceleyelim. Her pattern, VWAP, Bollinger, ve hacim ile birlikte kullanıldığında çok daha güçlü olur.

### 1. VWAP Bounce (VWAP Oversold Bounce)

**VWAP (Volume Weighted Average Price)**, gün içinde hacim ağırlıklı ortalama fiyattır. Kurumsal trader'lar ve algoritmalar için bir referans noktasıdır. Fiyat VWAP'ın altına sarktığında "ucuz" olarak algılanabilir; VWAP'ın üzerine çıktığında "pahalı".

**VWAP Bounce Pattern'ı:**
- Hisse, VWAP'ın altına sarkar (genellikle -2 standard deviation veya daha altına)
- Hacim yüksek olur — satış baskısı yoğunlaşır
- Fiyat, VWAP bölgesine geri dönmeye çalışır
- VWAP'ı yukarı keserse (reclaim), long setup doğar

> **Örnek:** AAPL açılışta 175 USD'den VWAP'ın altına sarkıyor. VWAP 177, -2σ bandı 174. Hisse 173.5'e kadar düşüyor, hacim artıyor. Sonra geri dönüyor, VWAP'ı (177) yukarı kesiyor. VWAP bounce long setup'ı aktif. Stop loss: 173.5 altı. Hedef: 179-180 (VWAP + 2σ bandı veya gün içi high).

**Momentum tabanlı girişler:** VWAP -2σ oversold bounce, gap fade, ORB reject — bu üçünü iyi bilen bir trader, günün en yüksek olasılıklı setup'larını yakalayabilir.

### 2. ORB (Opening Range Breakout)

**ORB**, ilk 5-15 dakikalık açılış aralığının (opening range) kırılımı üzerine kuruludur. Açılış aralığı yüksek veya düşük bir nokta belirler; bu nokta kırılırsa, momentum o yönde devam eder.

**ORB Long Setup:**
- İlk 5 dakika yüksek ve düşük noktalarını belirleyin (örneğin 5-minute ORB)
- Fiyat, yüksek noktanın üzerine çıkar ve hacim artarsa, long setup
- Stop loss: ORB low'un altı
- Hedef: 2:1 risk/ödül veya gün içi resistance

**ORB Short Setup:**
- Fiyat, düşük noktanın altına iner ve hacim artarsa, short setup
- Stop loss: ORB high'un üzeri
- Hedef: 2:1 risk/ödül veya gün içi support

> **Örnek:** TSLA 09:30 açılışta 250 USD. İlk 5 dakika: high 252, low 249. 09:35'te 252.5 üzerine çıkıyor, hacim artıyor. ORB long aktif. Stop: 248.5. Hedef: 255. Risk: 4 USD. Ödül: 5.5 USD. Risk/ödül ~1:1.4. Eğer hacim çok yüksekse ve sektör de güçlüyse, 257-258 hedeflenebilir.

### 3. Gap Fade (Açılış Aralığı Gap Dönüşü)

**Gap fade**, hissenin pre-market veya açılışta bıraktığı boşluğu (gap) sonradan doldurma eğilimidir. Gap up yapan hisse geri çekilebilir, gap down yapan hisse geri sıçrayabilir. "Too quiet" piyasada mean reversion — gap fade bu prensibin en temel uygulamalarından biridir.

**Gap Fade Long Setup:**
- Hisse, gap down yapmış (önemli bir haber veya earnings sonrası)
- Açılışta satış baskısı devam ediyor
- Hacim artıyor ama fiyat düşmüyor (divergence) — bu " Selling climax" işareti olabilir
- Fiyat, pre-market low veya açılış low'unu yukarı keserse, gap fade long

**Gap Fade Short Setup:**
- Hisse, gap up yapmış (örneğin %5+ gap up)
- Açılışta alım devam ediyor ama hacim düşüyor (divergence)
- VWAP veya açılış high'ı aşağı kırılırsa, gap fade short

> **Örnek:** NVDA earnings sonrası %6 gap up yapmış, açılış 125 USD. İlk 30 dakika hacim düşüyor, fiyat 125-126 arasında yatay. VWAP 124.5. 10:30'da VWAP aşağı kırılıyor. Gap fade short setup aktif. Stop: 126.5. Hedef: 121 (gap fill bölgesi). Risk/ödül: 2 / 5 = 1:2.5. Mükemmel bir setup.

### 4. Continuation (Trend Devamı)

**Continuation pattern'ları**, mevcut trendin devam edeceğini gösteren formasyonlardır. Bu pattern'lar, trendin "nefes alması" veya "konsolidasyonu" olarak düşünülebilir.

**Popüler Continuation Pattern'ları:**
- **Flag (Bayrak):** Keskin bir hareketten sonra paralel kanal içinde yatay konsolidasyon. Kırılım yönü = trend yönü.
- **Pennant (Flama):** Bayrağa benzer ama kanal daralır (üçgen). Kırılım sert olur.
- **Bull/Bear Flag:** Yükseliş trendindeki bayrak = bull flag. Düşüş trendindeki = bear flag.

> **Örnek:** AMD 3 gündür yükseliyor, 90 USD'den 95 USD'ye gelmiş. Son 2 saattir 94-95 arasında bayrak formasyonu oluşturuyor. Hacim daralırken fiyat yatay. 95.5 üzerine çıkıyor, hacim patlıyor. Bull flag continuation long setup. Stop: 93.5 (bayrak altı). Hedef: 98-99 (bayrak direği kadar mesafe). Risk/ödül: 2 / 4 = 1:2.

---

## Sabah Rutini: 5 Dakikalık Tarama

Aktif bir trader'ın sabah rutini, günün kazancını veya kaybını belirler. İşte 5 dakikalık, yüksek olasılıklı setup'ları bulmak için sistematik bir tarama rutini:

### Adım 1: Pre-Market Futures ve Genel Hava (30 saniye)
- SPY, QQQ, IWM futures'larına bakın. Yeşil mi kırmızı mı?
- VIX seviyesini kontrol edin. VIX > 25 = volatilite yüksek, setup'lar daha geniş. VIX < 15 = "too quiet", mean reversion ağırlıklı.
- Sector ETF'lerine (XLK, XLF, XLE, vb.) göz atın. Hangi sektör güçlü?

### Adım 2: Pre-Market Gainers/Losers (1 dakika)
- Finviz, MarketWatch, veya broker platformunuzun pre-market tarayıcısına bakın.
- %3+ hareket yapan hisseleri not alın.
- Hangi hisseler haber/earnings/catalyst ile hareket ediyor? Bunlar daha güvenilir.

### Adım 3: Gistify Scanner / Watchlist (1 dakika)
- Gistify'nin dark workspace'indeki scanner ile önceden tanımlanmış momentum filtrenizi çalıştırın.
- Örneğin: Hacim > 2x ortalama, fiyat > VWAP, RSI 40-70 arası, Bollinger %B 0.3-0.7 arası.
- Scanner'dan çıkan 5-10 hisseyi not alın.

### Adım 4: Teknik Analiz Hızlı Bakış (1.5 dakika)
- Her bir hisse için 1 dakikalık ve 5 dakikalık grafik açın.
- VWAP pozisyonuna bakın. Fiyat VWAP üzerinde mi altında mı?
- Açılış aralığını (ORB) belirleyin. Kırılım yaklaşıyor mu?
- Hacim profiline bakın. Açılış spike'ı var mı, yoksa düşük mü?

### Adım 5: Setup Kararı ve Risk Planı (1 dakika)
- En iyi 2-3 setup'ı seçin.
- Her setup için: Entry, Stop, Hedef, Risk/Ödül oranını yazın.
- Minimum 1:2 risk/ödül arayın. 1:1.5 bile olsa, confluence (çoklu onay) varsa kabul edilebilir.
- 1% kuralını uygulayın. Her pozisyon için maksimum risk = portföyün %1'i.

> **Toplam süre: 5 dakika.** Bu rutini her gün tekrarlayın. Disiplin, momentum taramada en önemli faktördür.

---

## 5 Teknik İndikatör

Momentum taramada kullanabileceğiniz 5 temel teknik indikatörü ve momentum taramayla nasıl birlikte kullanılacağını inceleyelim.

### 1. RSI (Relative Strength Index)

**RSI**, 0-100 arasında dalgalanan bir momentum ölçer. 70 üzeri aşırı alım, 30 altı aşırı satım olarak yorumlanır. Momentum trader'ları için en kritik kullanım alanları:

- **RSI 40-60 arası (Göreceli Güçlü):** Momentum henüz aşırı değil, devam potansiyeli yüksek.
- **RSI Divergence:** Fiyat yeni high yapıyor, RSI daha düşük high yapıyor = momentum zayıflıyor, reversal riski.
- **RSI 30'dan dönüş (Oversold Bounce):** VWAP -2σ ile birlikte güçlü bir long sinyali.

> **Örnek:** AAPL 5 dakikalık grafikte 175'e yükseliyor, RSI 72. Momentum devam ediyor ama aşırı alım. Dikkatli olun. Eğer RSI 72'den düşmeye başlarsa ve fiyat hâlâ yükseliyorsa, divergence = short sinyali.

### 2. MACD (Moving Average Convergence Divergence)

**MACD**, iki hareketli ortalamanın farkını ve bir sinyal çizgisini gösterir. Histogram, momentumun hızlanıp yavaşladığını gösterir.

- **MACD Crossover:** MACD çizgisi sinyal çizgisini yukarı keserse = bullish momentum. Aşağı keserse = bearish momentum.
- **Histogram Divergence:** Fiyat yeni high, histogram daha düşük = momentum zayıflıyor.
- **Zero Line Cross:** MACD sıfır çizgisini yukarı keserse = trend güçlü bullish. Aşağı keserse = trend güçlü bearish.

> **Örnek:** TSLA 5 dakikalık grafikte, MACD sıfır çizgisini yukarı kesiyor, histogram yeşil ve büyüyor. VWAP üzerinde, hacim artıyor. Çok güçlü bullish confluence. Long setup için ideal.

### 3. VWAP (Volume Weighted Average Price)

**VWAP**, zaten yukarıda detaylıca anlattığımız gibi, momentum taramanın merkezindedir. Kurumsal trader'lar ve algoritmalar için bir "adil fiyat" referansıdır.

- **Fiyat > VWAP:** Bullish bölge, long setup'lar tercih edilir.
- **Fiyat < VWAP:** Bearish bölge, short setup'lar veya gap fade long'lar tercih edilir.
- **VWAP + Standard Deviation Bands:** ±1σ, ±2σ, ±3σ bantları. -2σ'dan dönüş = oversold bounce. +2σ'dan dönüş = overbought fade.

> **Örnek:** NVDA açılışta VWAP altında, -2σ bandına yaklaşıyor. Hacim artıyor. VWAP -2σ oversold bounce pattern'ı aktif. Long setup için en yüksek olasılıklı anlardan biri.

### 4. Bollinger Bands (Bollinger Bantları)

**Bollinger Bands**, 20-periyot hareketli ortalamanın ±2 standart sapmasıdır. Fiyatın volatiliteye göre genişleyen ve daralan bantlar içinde hareketini gösterir.

- **Bollinger Squeeze:** Bantlar daraldığında, büyük bir hareket yaklaşıyor demektir. Kırılım yönünü takip edin.
- **Lower Band Touch:** Fiyat alt banda dokunuyor, RSI 30 civarında, hacim yüksek = oversold bounce setup.
- **Upper Band Touch:** Fiyat üst banda dokunuyor, RSI 70+, hacim düşüyor = overbought fade setup.
- **Bollinger %B:** Fiyatın bantlar içindeki göreceli konumu. %B < 0.2 = oversold. %B > 0.8 = overbought.

> **Örnek:** AMD 20 günlük Bollinger'de squeeze oluşuyor. Bantlar daralmış. Sonra %5 hacimli bir breakout ile üst bandı kırıyor. Bollinger squeeze breakout = continuation pattern'ı. Long setup. Stop: squeeze alt bandı. Hedef: squeeze genişliği kadar mesafe (measured move).

### 5. Volume (Hacim)

**Hacim**, momentumun en önemli doğrulayıcısıdır. Hacimsiz momentum, sahte momentumdur.

- **Hacim > 2x Ortalama:** Anlamlı hareket. Breakout veya breakdown güvenilirdir.
- **Hacim Divergence:** Fiyat yükseliyor, hacim düşüyor = momentum zayıflıyor. Fiyat düşüyor, hacim düşüyor = satış tükeniyor.
- **Volume Profile:** Gün içindeki hacim yoğunlaşma bölgeleri. POC (Point of Control) = en çok işlem gören fiyat. POC üzeri = bullish, altı = bearish.

> **Örnek:** SPY açılışta 550 üzerine çıkıyor, ama hacim 10 günlük ortalamanın altında. Breakout güçsüz, "false breakout" riski yüksek. Bekleyin, geri çekilme ve hacimli retest isteyin.

---

## Pre-Market vs. Opening Bell vs. Mid-Day

Bir günün farklı zaman dilimleri, farklı momentum dinamikleri barındırır. Bu zaman dilimlerine göre strateji değiştirmek, başarılı bir momentum trader'ın sırrıdır.

### Pre-Market (04:00 – 09:30 EDT)

- **Özellik:** Düşük hacim, yüksek volatilite, haber-driven hareketler.
- **Fırsatlar:** Earnings sonrası gap değerlendirme, haber reaksiyonları, futures ile öngörü.
- **Riskler:** Spread'ler geniş, likidite düşük, stop loss'lar zor çalışır.
- **Strateji:** İzleme ve planlama. Pre-market'de pozisyon açmak yüksek risklidir. Açılışta nasıl davranacağınızı planlayın.

### Opening Bell (09:30 – 10:30 EDT)

- **Özellik:** En yüksek volatilite, en yüksek hacim, en hızlı hareketler.
- **Fırsatlar:** ORB, VWAP bounce, gap fade. Günün en yüksek olasılıklı setup'ları burada oluşur.
- **Riskler:** Fiyat kayması (slippage) yüksek, spread'ler geniş, emosyonel kararlar.
- **Strateji:** Sabah rutinini uygulayın. En iyi 2-3 setup'ı seçin. Hızlı olun ama panik yapmayın. 1% kuralı burada hayati önem taşır.

### Mid-Day (10:30 – 14:00 EDT)

- **Özellik:** Volatilite azalır, hacim düşer, fiyatlar yataylaşır.
- **Fırsatlar:** Mean reversion, range-bound stratejiler, pullback'lerden continuation.
- **Riskler:** False breakout'lar artar, momentum zayıflar, "chop" (yatay dalgalanma) yaygınlaşır.
- **Strateji:** Yüksek olasılıklı setup yoksa, pozisyon almayın. İzlemek de bir trade stratejisidir. Var olan pozisyonları yönetin. Yeni pozisyon için opening bell'i bekleyin.

### Power Hour (14:00 – 16:00 EDT)

- **Özellik:** Hacim tekrar artar, volatilite yükselir, kapanış hareketleri.
- **Fırsatlar:** EOD (End of Day) momentum, kapanış öncesi breakout/breakdown.
- **Riskler:** Gün sonu kar/zarar realizasyonu, beklenmedik haberler.
- **Strateji:** Var olan pozisyonları yönetin. Yeni pozisyon açmak dikkat ister. Gün sonu pozisyonları 0DTE veya ertesi güne taşınacak şekilde planlanmalı.

---

## Risk Yönetimi (1% Kuralı, Stop Loss)

Momentum tarama, doğru yapıldığında yüksek kazanç potansiyeli sunar. Ama yanlış yapıldığında, hızlı hareketler portföyü eritebilir. Risk yönetimi, momentum trading'in ayrılmaz bir parçasıdır.

### 1% Kuralı

Her bir pozisyon için portföyünüzün en fazla %1'ini riske atın. 10,000 USD portföy için, bir pozisyonun maksimum kaybı = 100 USD. Bu, art arda 10 kayıp serisinde bile portföyü %10'dan fazla eritmez.

> **Örnek:** Portföy 25,000 USD. 1% = 250 USD. NVDA'da VWAP bounce long setup gördünüz. Entry 120, stop 118. Risk = 2 USD × 100 = 200 USD. 1 lot ile girebilirsiniz (200 USD risk). Eğer 2 lot girmek isterseniz, stop'u 119'e çekmeniz gerekir (100 USD risk). Veya spread kullanın.

### Stop Loss — Nasıl Çalışır?

Momentum trading'de stop loss, hayatta kalma aracıdır. Ama stop loss'u nereye koyacağınız, setup'a göre değişir:

- **VWAP Bounce:** Stop, VWAP -2σ veya açılış low'un altı.
- **ORB:** Stop, ORB low'un (long) veya ORB high'un (short) altı/üzeri.
- **Gap Fade:** Stop, gap fill bölgesinin dışı veya açılış extreme'i.
- **Continuation:** Stop, pattern invalidation noktası (örneğin flag alt bandı).

**Mental Stop vs. Hard Stop:**
- **Hard Stop:** Broker'a otomatik emir verirsiniz. Emosyonel kararlardan korur. Ama gün içi volatilite (wicks) stop'u tetikleyebilir.
- **Mental Stop:** Kendi kendinize "120'nin altına inerse satarım" dersiniz. Daha esnek ama disiplin gerektirir. Deneyimli trader'lar için.

**Trailing Stop:**
- Pozisyon kazançta ilerledikçe, stop'u kazançla birlikte çekin. Örneğin entry 120, hedef 124. Fiyat 122'ye geldiğinde, stop'u 120'ye (breakeven) çekin. Fiyat 123'e geldiğinde, stop'u 121.5'e çekin. Bu, kârı korurken, upside'ı bırakır.

### Risk/Ödül Oranı

Her setup'ta, risk/ödül oranını hesaplayın. Minimum 1:2 arayın. 1:1.5 bile olsa, confluence (örneğin VWAP + RSI + hacim) varsa kabul edilebilir. 1:1 veya daha düşükse, setup'u atlayın. Momentum taramada, yüksek olasılıklı setup'lar zaten bol.

> **Örnek:** AMD setup'ı. Entry 95, stop 93, hedef 99. Risk = 2 USD, Ödül = 4 USD. Risk/Ödül = 1:2. Setup kabul edilebilir. Eğer hedef 97 olsaydı, risk/ödül = 1:1, bu setup atlanmalı.

---

## Sektör Momentumu ve Piyasa Rejimi Analizi

Momentum trading sadece teknik seviyelerden ibaret değildir. Bir hissenin hareketi, bulunduğu sektörün ve genel piyasanın momentumundan büyük ölçüde etkilenir. Sektör analizi, momentum taramanın göz ardı edilmemesi gereken bir boyutudur.

### Sektör ETF'leri ile Momentum Onayı

ABD borsalarında 11 ana sektör vardır ve her biri bir ETF ile temsil edilir:

| ETF | Sektör | Momentum Onayı |
|-----|--------|----------------|
| **XLK** | Teknoloji | AAPL, NVDA, AMD, MSFT gibi tech hisseleri için öncü gösterge |
| **XLF** | Finans | JPM, BAC, GS gibi banka hisseleri için öncü gösterge |
| **XLE** | Enerji | XOM, CVX, OXY gibi enerji hisseleri için öncü gösterge |
| **XLI** | Sanayi | CAT, BA, UPS gibi sanayi hisseleri için öncü gösterge |
| **XLB** | Malzeme | LIN, SHW, NUE gibi malzeme hisseleri için öncü gösterge |
| **XLV** | Sağlık | JNJ, UNH, PFE gibi sağlık hisseleri için öncü gösterge |
| **XLP** | Tüketici Staples | KO, PG, WMT gibi defensif hisseler için öncü gösterge |
| **XLY** | Tüketici Discretionary | AMZN, TSLA, HD gibi hisseler için öncü gösterge |
| **XLU** | Kamu Hizmetleri | NEE, DUK, SO gibi defensif hisseler için öncü gösterge |
| **XLRE** | Gayrimenkul | PLD, AMT, SPG gibi REIT hisseleri için öncü gösterge |
| **XLC** | İletişim | META, GOOGL, VZ gibi iletişim hisseleri için öncü gösterge |

**Kural:** Sektör ETF'i günlük VWAP üzerinde ve pozitif momentum gösteriyorsa, o sektörden hisse seçmek çok daha güvenlidir. Eğer XLK VWAP altında ve kırmızı ise, AAPL'da long setup aramak daha risklidir. Sektör onayı, momentum taramada "confluence" (çoklu onay) oluşturur.

### Piyasa Rejimi: Trend mi, Mean Reversion mi?

Piyasa rejimi, hangi momentum stratejisinin çalışacağını belirler. Üç temel rejim vardır:

**1. Trend Rejimi (Trending Market)**
- SPY, QQQ, IVM 20 günlük hareketli ortalamanın üzerinde ve yükselişte
- VIX < 20, hacim artıyor
- **Strateji:** Continuation pattern'ları (bull flag, pennant), ORB breakout, momentum long/short
- **Örnek:** 2024'ün ilk çeyreğinde tech rallisi. XLK günden güne yükseliyor. Bull flag'ler ve ORB breakout'lar yüksek kazanç verdi.

**2. Mean Reversion Rejimi (Range-Bound Market)**
- İndeksler 20 günlük hareketli ortalama etrafında yatay seyrediyor
- VIX 15-22 arası, hacim düşük veya dalgalı
- **Strateji:** VWAP bounce, gap fade, Bollinger extreme'lerden dönüş
- **Örnek:** Yaz aylarındaki "too quiet" piyasa. SPY 500-510 arasında 3 hafta kaldı. VWAP -2σ bounce ve gap fade stratejileri en iyi performansı verdi.

**3. Volatilite Rejimi (Choppy/Volatile Market)**
- VIX > 25, büyük gap'ler, ani reversaller
- İndeksler 20 günlük hareketli ortalamanın altında
- **Strateji:** Pozisyon boyutlarını küçültün, 1% yerine %0.5 risk. Hızlı kâr realize edin. Choppy piyasada "tutma" stratejisi çalışmaz.
- **Örnek:** FOMC öncesi hafta veya geopolitical tension dönemleri. SPY günde %2-3 sallanıyor. False breakout'lar çok yaygın. Küçük pozisyon, hızlı giriş/çıkış.

### Multi-Timeframe Analiz

Tek bir zaman dilimine bağımlı kalmak, momentum taramanın en büyük hatalarından biridir. En az üç zaman dilimini birlikte kullanın:

- **Günlük (Daily):** Genel trend yönünü belirler. Fiyat 20 EMA üzerinde mi? Bullish bias. Altında mı? Bearish bias.
- **4-Saatlik (4H):** Trend içindeki yapıyı gösterir. Pullback mi, reversal mı? Bollinger ve RSI burada kullanılır.
- **5-Dakikalık (5M):** Entry ve exit noktalarını belirler. VWAP, ORB, hacim spike'ları burada okunur.

> **Örnek:** AMD günlükte 20 EMA üzerinde, bullish trend. 4-saatlikte Bollinger squeeze oluşuyor, patlamaya hazır. 5-dakikalıkte VWAP bounce + RSI 35 dönüşü + hacim artışı. Tüm zaman dilimleri birlikte "long" sinyali veriyor. Bu, en yüksek olasılıklı setup'lardan biridir. Sadece 5-dakikalık baksaydınız, trendin zayıfladığı bir noktada giriş yapabilirdiniz.

### Confluence (Çoklu Onay) Puanlama Sistemi

Bir setup'ın güvenilirliğini artırmak için, birden fazla indikatörün aynı yönde sinyal vermesini bekleyin. İşte basit bir confluence puanlama sistemi:

| Faktör | Long Setup | Short Setup | Puan |
|--------|-----------|------------|------|
| Sektör ETF > VWAP | Evet | Hayır | +1 |
| SPY/QQQ trend bullish | Evet | Hayır | +1 |
| Fiyat > VWAP (5M) | Evet | Hayır | +1 |
| RSI 30-50 arası (5M) | Evet | 50-70 | +1 |
| MACD histogram yeşil | Evet | Kırmızı | +1 |
| Hacim > 2x ortalama | Evet | Evet | +1 |
| Bollinger %B 0.2-0.5 | Evet | 0.5-0.8 | +1 |
| Pattern (ORB, VWAP, Flag) | Onaylı | Onaylı | +1 |

**Puanlama:**
- 7-8 puan: Mükemmel setup. Yüksek pozisyon boyutu ile değerlendirilebilir.
- 5-6 puan: İyi setup. Standart pozisyon boyutu.
- 3-4 puan: Zayıf setup. Küçük pozisyon veya atla.
- 0-2 puan: Setup yok. Bekle.

Bu sistem, objektif bir kriterle setup seçmenizi sağlar. Emosyonel kararları azaltır, disiplini artırır.


### 1. Momentum tarama için hangi platformu kullanmalıyım?

Finviz, TradingView, ThinkorSwim, ve Gistify'nin dark workspace'i popüler seçeneklerdir. Finviz ücretsiz ve hızlıdır. TradingView grafik ve tarama için mükemmeldir. ThinkorSwim profesyonel seviyededir. Gistify, opsiyon trader'ları için özel olarak tasarlanmış scanner ve earnings brief ile fark yaratır.

### 2. Günlük kaç setup'a girmeliyim?

Kalite, miktarı yener. Günde 1-2 yüksek olasılıklı setup, 5-10 düşük kaliteli setup'tan çok daha iyidir. Deneyimli trader'lar bazen gün boyunca hiç setup bulamazlar — ve bu normaldir.

### 3. Momentum trading için en iyi zaman dilimi nedir?

Açılış çanı (09:30-10:30 EDT) ve kapanış öncesi (14:00-16:00 EDT) en verimli zaman dilimleridir. Mid-day (10:30-14:00) genellikle yavaştır.

### 4. VWAP sadece gün içi mi kullanılır?

Gün içi VWAP (anchored VWAP) en yaygın kullanımdır. Ama haftalık, aylık veya özel olaylara (earnings, haber) anchored VWAP'lar da kullanılabilir. TradingView'de "Anchored VWAP" aracı ile istediğiniz noktadan başlatabilirsiniz.

### 5. 0DTE opsiyonlarla momentum trading yapılabilir mi?

Evet, ama çok dikkatli. 0DTE opsiyonlar, aynı gün vadesi dolan opsiyonlardır. SPY, QQQ, IWM'de haftada üç gün (Pazartesi, Çarşamba, Cuma) mevcuttur. Theta decay inanılmaz derecede yüksektir. Deneyimli trader'lar için "VWAP bounce" veya "ORB" ile kullanılır. Yeni başlayanlar için uygun değildir.

### 6. Haber ve earnings döneminde momentum trading farklı mıdır?

Evet, çok farklıdır. Earnings öncesi IV yüksek, spread'ler geniş, hareketler serttir. Earnings sonrası gap fade stratejileri öne çıkar. Haber-driven hareketlerde, haberin içeriği ve piyasa reaksiyonu daha önemli olur, teknik analiz ikincil kalabilir.

### 7. Portföyümün tamamını momentum trading'e ayırmalı mıyım?

Hayır. Momentum trading, portföyünüzün bir bölümü (örneğin %20-30) ile yapılmalıdır. Geri kalanı uzun vadeli yatırım, nakit rezerv, veya düşük riskli stratejilerde kalmalıdır. Momentum trading, "alpha" üretme aracıdır, ama tüm portföyü risk atmayın.

### 8. Multi-timeframe analiz neden önemli?

Tek bir zaman dilimine bakmak, ağaçlara bakıp ormanı görememek gibidir. Günlük grafik trend yönünü söyler, 4-saatlik yapıyı gösterir, 5-dakikalık giriş noktasını verir. Üçünü birlikte kullanmadan momentum setup'ları değerlendirmek, yüksek riskli kumar olmaya yaklaşır.

### 9. "Choppy" piyasada ne yapmalıyım?

Choppy (yatay dalgalı) piyasa, momentum trader'ının en büyük düşmanıdır. False breakout'lar artar, stop'lar sık sık tetiklenir. Strateji: Pozisyon boyutlarını %50 küçültün, mean reversion setup'larına odaklanın (VWAP extreme'ler, gap fade), veya tamamen kenara çekilin. Beklemek de bir trade stratejisidir.

### 10. Confluence (çoklu onay) nedir, neden önemli?

Confluence, birden fazla teknik faktörün aynı yönde sinyal vermesidir. Örneğin: VWAP bounce + RSI 30 dönüşü + hacim artışı + sektör ETF onayı. Her ek onay, setup'ın olasılığını artırır. Confluence'siz setup = yüksek riskli tahmin. Confluence ile setup = yüksek olasılıklı trade.

---

## Momentum Trading Setup Checklist

Her setup'a girmeden önce aşağıdaki checklist'i tamamlayın:

| # | Kontrol | Açıklama |
|---|---------|----------|
| ✅ | Sektör ETF onayı var | Sektör VWAP üzerinde ve pozitif |
| ✅ | Genel piyasa trendi uyumlu | SPY/QQQ trend, setup yönüyle aynı |
| ✅ | Pattern net ve tanımlı | VWAP bounce, ORB, gap fade, continuation |
| ✅ | Hacim onayı var | Hacim > 2x ortalama veya pattern'e uygun |
| ✅ | RSI uygun bölgede | Long için 30-50, short için 50-70 |
| ✅ | MACD histogram yönünde | Long için yeşil, short için kırmızı |
| ✅ | Bollinger extreme veya squeeze | Lower/upper band touch veya squeeze breakout |
| ✅ | Risk/ödül ≥ 1:2 | Minimum 1:2 aranır, 1:1.5 confluence ile kabul edilebilir |
| ✅ | Entry, stop, hedef yazılı | Kağıt veya not defterine yazılmış, emosyonel karar yok |
| ✅ | 1% kuralı uygulanabilir | Pozisyon boyutu, portföyün %1'ini aşmıyor |

Bu 10 maddeden en az 7'sini karşılamayan bir setup, atlanmalıdır. Kalite, miktarı her zaman yener.


Momentum tarama, disiplin, doğru araçlar, ve sürekli pratik gerektirir. **Gistify**, bu üç unsurun bir araya geldiği bir dark-themed finance workspace'tir.

Gistify'da şunları bulacaksınız:
- **Dark workspace:** Gece gündüz aktif trader'lar için göz yormayan, odaklanmayı artıran bir arayüz.
- **Scanner:** VWAP, RSI, Bollinger, ve hacim bazlı momentum filtrenizi tek tıkla çalıştırın. 50+ hisseyi saniyeler içinde tarayın.
- **Earnings brief:** Kazanç dönemi hisselerinin momentum profili, IV Rank, ve teknik seviyelerini tek ekranda görün.
- **Risk matrix:** Pozisyonlarınızın Greek'lerini, portfolio heat'ini, ve anlık risk maruziyetinizi takip edin.

Yüksek olasılıklı setup'ları bulmak, artık şansa bırakılmayacak bir süreçtir. Gistify ile sabah rutininizi sistematize edin, her gün aynı disiplini uygulayın, ve zamanla edge'inizi büyütün.

### 🎯 Hemen Başlayın

1. TradingView veya Finviz ücretsiz hesabı açın
2. Bu rehberdeki 5 indikatörü grafiğinize ekleyin
3. 5 dakikalık sabah rutinini her gün uygulayın
4. 20 paper trade yapın, sonuçları kaydedin
5. Gistify'daki scanner ile tarama sürecinizi otomatize edin

Momentum tarama, yön bağımsız trade fırsatları arayan bir trader için altın madenidir. Doğru pattern'leri tanıyın, doğru indikatörleri kullanın, disiplini elden bırakmayın — ve piyasa size ödülünü verecektir.

---

*Son güncelleme: 1 Temmuz 2026*

*Bu rehber eğitim amaçlıdır ve yatım tavsiyesi değildir. Momentum trading yüksek risk içerir. Her zaman kendi araştırmanızı yapın ve profesyonel finansal danışmanlık alın.*
