# Kazanç Dönemi (Earnings) Opsiyon Stratejileri: Beat mi, Miss mi?

Kazanç dönemi (earnings season), ABD borsalarının en heyecanlı ve en riskli dönemidir. Her çeyrekte, binlerce şirket aynı anda bilançolarını açıklar. Fiyatlar %5, %10, hatta %20 anlık hareketler yapar. Bu hareketler, doğru opsiyon stratejisi ile **2x, 3x, hatta 5x getiri** potansiyeli taşır. Ama yanlış strateji ile, **IV Crush** adlı sessiz katil, pozisyonunuzu anında eritebilir.

Bu rehber, **target keyword:** `kazanç dönemi opsiyon` ile başlayan ve `earnings opsiyon`, `earnings play`, `IV crush kazanç` gibi kritik konuları derinlemesine ele alan kapsamlı bir kaynaktır. Earnings öncesi stratejiden, sonrası gap fade'e, risk yönetiminden Gistify entegrasyonuna kadar her şeyi bulacaksınız.

---

## Kazanç Dönemi Nedir? Neden Önemli?

**Kazanç dönemi (Earnings Season)**, ABD şirketlerinin üç aylık (çeyreklik) finansal sonuçlarını açıkladığı dönemdir. Her yıl dört kez tekrarlanır:

- **Q1 (Ocak-Mart):** Nisan ortasında açıklanır
- **Q2 (Nisan-Haziran):** Temmuz ortasında açıklanır
- **Q3 (Temmuz-Eylül):** Ekim ortasında açıklanır
- **Q4 (Ekim-Aralık):** Ocak-Şubat'ta açıklanır

Bu dönemlerde, şirketlerin **EPS (Earnings Per Share)** ve **Revenue (Gelir)** verileri piyasa beklentileriyle karşılaştırılır. **Beat** (beklentiyi aştı), **Miss** (beklentinin altında kaldı), veya **In-line** (beklentiye paralel) olarak sonuçlanır.

### Neden Önemli?

1. **Volatilite patlaması:** Earnings öncesi Implied Volatility (IV) tarihsel olarak çok yükselir. Bu, opsiyon primlerini şişirir.
2. **Yön bağımsız fırsatlar:** Şirket beat verse de, guidance (gelecek dönem beklentisi) kötüyse hisse düşebilir. Yön tahmini zordur, ama volatilite tahmini daha kolaydır.
3. **IV Crush:** Earnings sonrası IV çöker. Bu, opsiyon alıcılarının en büyük düşmanıdır.
4. **Haber volatilitesi:** Earnings, tek başına bir "catalyst"tir. Catalyst varsa, momentum var demektir.

> **Önemli:** Earnings oynamak, yön bağımsız trade arayan bir trader için ideal bir alandır. Put ya da call farketmez — volatilite oynanabilir. Ama minimum 2x getiri potansiyeli olan fırsatları bulmak için, doğru stratejiyi ve doğru zamanlamayı bilmek şarttır.

---

## Earnings Takvimi Nasıl Okunur?

Earnings takvimi, hangi şirketin ne zaman kazanç açıklayacağını gösteren bir pusuladır. Bu takvimi doğru okumak, earnings stratejisinin ilk adımıdır.

### Earnings Takvimi Kaynakları

- **Earnings Whispers:** (earningswhispers.com) — Tahmini açıklama tarihleri ve analist beklentileri.
- **Yahoo Finance:** Her hissenin earnings tarihi ve geçmiş verileri.
- **Gistify Earnings Brief:** Tüm earnings takvimi, IV Rank, CPR (Central Pivot Range), ve teknik seviyeler tek ekranda.
- **SEC EDGAR:** Resmi kayıtlar, en güvenilir kaynak.

### Takvimde Ne Okumalısınız?

1. **Tarih:** Şirketin earnings açıklama tarihi (genellikle BMO = Before Market Open, veya AMC = After Market Close).
2. **EPS Estimate:** Analistlerin EPS beklentisi. Geçmiş çeyreklere göre trend nedir?
3. **Revenue Estimate:** Gelir beklentisi.
4. ** whisper number:** Earnings Whispers gibi sitelerde, analist beklentisinden farklı olarak piyasanın "fısıldadığı" rakam. Whisper > Estimate = yüksek beklenti = daha zor beat.
5. **Historical Beat Rate:** Şirket geçmişte kaç çeyreldir beat ediyor? (örneğin AAPL son 8 çeyreldir beat ediyor)
6. **Average Move:** Şirketin geçmiş earnings sonrası ortalama hareketi. %5 mi, %10 mi? Bu, straddle maliyetini değerlendirirken kritik.

### BMO vs. AMC

- **BMO (Before Market Open):** Şirket, piyasa açılmadan önce (06:00-09:30 EDT arası) açıklar. Ertesi gün açılışta fiyat hareketi görülür. Pre-market volatilitesi yüksektir.
- **AMC (After Market Close):** Şirket, piyasa kapandıktan sonra (16:00-18:00 EDT arası) açıklar. Ertesi gün açılışta fiyat hareketi görülür. After-hours volatilitesi yüksektir.

**Stratejik fark:** BMO earnings, açılışta anlık reaksiyon verir. AMC earnings, gece boyunca haberler yayıldığı için ertesi gün açılışta daha büyük gap'ler oluşabilir.

---

## 4 Earnings Stratejisi

Earnings döneminde en yaygın kullanılan 4 opsiyon stratejisini detaylıca inceleyelim. Her strateji, farklı bir piyasa görüşüne ve risk toleransına hitap eder.

### 1. Straddle (Yönsüz Volatilite)

**Straddle**, aynı strike ve vadede hem CALL hem PUT almaktır. Yön tahmini yapmadan, volatiliteyi oynarsınız. Hisse ne tarafa güçlü hareket ederse, o taraf kazanır.

**Ne zaman kullanılır:**
- Earnings öncesi, hissenin geçmişte earnings sonrası ortalama hareketi > straddle maliyeti
- IV yükselişi (Vega) de kazanç potansiyeli varsa (erken kurulum)
- Yön tahmini yapmak istemediğinizde

> **Örnek:** NVDA earnings öncesi. Hisse 120 USD. Strike 120 straddle (7 gün vadeli). CALL premium = 6 USD, PUT premium = 6 USD. Toplam maliyet = 12 USD × 100 = 1,200 USD. NVDA'nın geçmiş 8 çeyrekteki ortalama earnings hareketi = %8. %8 hareket = 120 × 0.08 = 9.6 USD. Straddle maliyeti = 12 USD. 9.6 < 12 → straddle pahalı. Bu setup, IV Crush riski yüksek. Eğer ortalama hareket %12 olsaydı (14.4 USD), straddle değerlidir.

- **Maksimum risk:** 1,200 USD (toplam premium)
- **Maksimum ödül:** Sınırsız (tek yönlü)
- **Breakeven:** 120 ± 12 = 108 ve 132 USD
- **IV Crush riski:** Çok yüksek. Hisse %6 hareket edip IV %80'den %30'a çökerse, her iki bacak da zarar edebilir.

### 2. Strangle (Yönsüz, Daha Ucuz)

**Strangle**, straddle'a benzer ama strike fiyatları farklıdır. OTM CALL + OTM PUT alınır. Maliyet daha düşük, ama hareket gereksinimi daha yüksektir.

> **Örnek:** NVDA 120 USD. Strike 125 CALL (premium 4 USD) + Strike 115 PUT (premium 4 USD). Toplam maliyet = 8 USD × 100 = 800 USD. Breakeven: 125 + 8 = 133 (CALL tarafı) ve 115 - 8 = 107 (PUT tarafı). Hareket gereksinimi daha geniş. Ama maliyet daha düşük. Eğer NVDA 130'a çıkarsa, CALL intrinsic = 5, maliyet 8 → hâlâ zarar. 134'e çıkarsa, kârlı.

- **Maksimum risk:** 800 USD
- **Maksimum ödül:** Sınırsız
- **Breakeven:** Daha geniş (107 ve 133)
- **Avantaj:** Daha düşük maliyet, straddle'dan daha az IV Crush riski (OTM olduğu için)
- **Dezavantaj:** Daha büyük hareket gerekiyor

### 3. Vertical Spread (Yönlü, Sınırlı Risk)

**Vertical Spread**, yön tahmini yaptığınızda kullanılır ve straddle/strangle'dan çok daha az IV Crush riski taşır. Çünkü spread'lerde bir bacak satılır, bu da IV Crush'tan kısmen korur.

**Bull Call Spread (Yükseliş beklentisi):**
- ATM veya hafif OTM CALL al
- Daha yüksek strike OTM CALL sat
- Maliyet düşer, kâr sınırlı, risk sınırlı

> **Örnek:** NVDA 120 USD. Earnings öncesi yükseliş bekliyorsunuz. Strike 120 CALL al (premium 6 USD), Strike 130 CALL sat (premium 2 USD). Net maliyet = 4 USD × 100 = 400 USD. Maksimum kâr = (10 - 4) × 100 = 600 USD. Risk/Ödül = 1:1.5. NVDA 130'un üzerine çıkarsa, maksimum kâr. 120-130 arasında kâr artar. 120'nin altına düşerse, maksimum risk = 400 USD.

- **Maksimum risk:** 400 USD
- **Maksimum ödül:** 600 USD
- **IV Crush etkisi:** Daha az. Çünkü aldığınız CALL'ın IV Crush'u, sattığınız CALL'ın IV Crush'u ile kısmen dengelenir.
- **Breakeven:** Alınan strike + net maliyet = 120 + 4 = 124 USD

**Bear Put Spread (Düşüş beklentisi):**
- ATM PUT al, daha düşük strike PUT sat
- Düşüş beklentisi için aynı mantık

### 4. Directional (Yönlü, Tek Bacak)

**Directional strateji**, güçlü bir yön tahmininiz varsa kullanılır. Tek bacaklı CALL veya PUT alırsınız. En yüksek risk/yüksek ödül profili.

> **Örnek:** AAPL earnings öncesi. Analistler beklentiyi çok düşük koymuş, whisper number çok yüksek, supply chain verileri güçlü. Siz güçlü bir yükseliş bekliyorsunuz. Strike 185 CALL alıyorsunuz (premium 5 USD). AAPL 195'e çıkarsa, intrinsic = 10, kâr = 5 × 100 = 500 USD. Risk/Ödül = 1:1. Ama 200'e çıkarsa, kâr = 15 × 100 = 1,500 USD. Risk/Ödül = 1:3.

- **Maksimum risk:** Premium (örnekte 500 USD)
- **Maksimum ödül:** Sınırsız
- **IV Crush riski:** Çok yüksek. Yön doğru bile olsa, IV Crush kârı azaltabilir veya batırabilir.
- **Kullanım zamanı:** Yön konusunda çok güçlü konviksiyonunuz varsa, ve erken kurulum (IV henüz çok patlamamış) yapıyorsanız.

### Karşılaştırma Tablosu: 4 Earnings Stratejisi

| Strateji | Yön Tahmini | Maliyet | Maks. Risk | IV Crush Riski | En İyi Zaman |
|----------|-------------|---------|------------|----------------|-------------|
| **Straddle** | Hayır | Yüksek | Premium | Çok Yüksek | IV henüz düşük, hareket beklentisi yüksek |
| **Strangle** | Hayır | Orta | Premium | Yüksek | Straddle'a göre daha ucuz, daha geniş breakeven |
| **Vertical Spread** | Evet | Düşük | Sınırlı | Düşük | Yön tahmini güçlü, risk sınırlı olmalı |
| **Directional** | Evet | Orta | Premium | Çok Yüksek | Güçlü konviksiyon, erken kurulum |

---

## IV Crush: Kazanç Tuzağı

**IV Crush**, earnings sonrası Implied Volatility'nin (IV) çok hızlı ve sert düşmesidir. Bu olay, earnings opsiyon stratejilerinin en büyük tuzağıdır ve birçok trader'ın bilmediği bir "gizli katil"dir.

### IV Crush Nasıl Çalışır?

Earnings öncesi, piyasa şirketin bilançosundan büyük bir hareket bekler. Bu beklenti, opsiyon alıcılarının prim ödemeye razı olmasına neden olur. IV yükselir, opsiyonlar pahalanır. Earnings açıklandığında, belirsizlik ortadan kalkar. IV çöker. Opsiyon fiyatları, hareketin büyüklüğüne rağmen, IV'nin çökmesiyle birlikte değer kaybedebilir.

> **Gerçek Örnek:** META earnings öncesi. Hisse 500 USD. Straddle maliyeti = 25 USD (2,500 USD). Earnings sonrası META %3 yükseldi (515 USD). Yön tahmini doğru. Ama IV %100'den %40'e çöktü. Straddle'ın CALL tarafı 15 USD değer kazandı, ama PUT tarafı 20 USD değer kaybetti. IV Crush, CALL'ın kazancının çoğunu eritti. Net sonuç: -500 USD zarar. Yön doğru, ama strateji yanlış.

### IV Crush'tan Korunma Yöntemleri

1. **Spread kullanın:** Vertical spread'ler, IV Crush'tan çok daha az etkilenir. Alınan ve satılan bacakların IV Crush'u birbirini dengeler.
2. **IV Rank kontrolü:** IV Rank > 80 ise, straddle/strangle çok risklidir. Eğer IV Rank > 90 ise, spread veya direkt hisse alımı düşünün.
3. **Erken kurulum:** Earnings'den 5-10 gün önce straddle kurun. IV yükseldikçe (Vega), straddle değer kazanır. Earnings günü öncesi satarak sadece volatilite artışından kâr elde edin. Buna "volatilite long" denir.
4. **Straddle maliyeti vs. ortalama hareket:** Şirketin geçmiş earnings sonrası ortalama hareketi, straddle maliyetinden büyük mü? Eğer ortalama hareket %5, straddle maliyeti %8 ise, bu setup IV Crush'a mahkumdur.
5. **0DTE veya 1DTE kullanın:** Earnings gününe çok yakın (0-1 gün) vadeli opsiyonlarda IV henüz çok patlamamış olabilir. Ama bu, hareket zamanlamasını çok doğru yapmanızı gerektirir.

### IV Crush Hesaplama

Bir straddle'ın IV Crush sonrası teorik değerini hesaplamak için basit bir formül:

```
Straddle Değeri ≈ |Hisse Fiyatı - Strike| + (Yeni IV × Vega × 100)
```

Eğer hisse çok hareket etmemişse, `|Hisse - Strike|` küçüktür. IV Crush sonrası yeni IV düşükse, ikinci terim de küçüktür. Toplam, ödenen premium'dan düşük olabilir.

> **Örnek:** AAPL 180. Straddle maliyeti 10 USD. Earnings sonrası AAPL 182 (sadece %1.1 hareket). Yeni IV = %30 (eski IV = %80). Vega = 0.15. Yeni straddle değeri ≈ 2 + (0.30 × 0.15 × 100) = 2 + 4.5 = 6.5 USD. Ödediğiniz 10 USD, şimdi 6.5 USD. Zarar = 3.5 USD × 100 = 350 USD. Yön doğru bile olsa, IV Crush zarar ettirdi.

---

## 5 Dakikalık Earnings Watchlist

Aktif bir trader için earnings dönemi, disiplinli bir watchlist rutini gerektirir. İşte her gün uygulayabileceğiniz 5 dakikalık earnings watchlist oluşturma süreci:

### Adım 1: Günün Earnings Takvimi (1 dakika)
- Gistify earnings brief veya Earnings Whispers'a bakın.
- Bugün (ve yarın) earnings açıklayacak şirketleri listeleyin.
- Özellikle takip ettiğiniz sektörlerden (tech, finance, energy) hisselere odaklanın.

### Adım 2: IV Rank ve Ortalama Hareket Filtresi (1 dakika)
- Her hisse için IV Rank kontrolü. IV Rank > 70 olanlar = volatilite beklentisi yüksek.
- Geçmiş 8 çeyrekteki ortalama earnings hareketini kontrol edin.
- Straddle/strangle maliyeti hesaplayın (basitçe: ATM CALL + ATM PUT premium toplamı).
- Ortalama hareket > straddle maliyeti mi? Eğer evet, straddle değerlidir.

### Adım 3: Teknik Seviyeler (1.5 dakika)
- Her hisse için destek ve direnç seviyelerini belirleyin.
- CPR (Central Pivot Range) veya önceki günün high/low/close değerlerini kullanın.
- Earnings sonrası gap up yaparsa, ilk direnç nerede? Gap down yaparsa, ilk destek nerede?

### Adım 4: Strateji Seçimi (1 dakika)
- Her hisse için en uygun stratejiyi belirleyin:
  - Yön tahmini yok + maliyet uygunsa → Straddle/Strangle
  - Yön tahmini güçlü + risk sınırlı olmalı → Vertical Spread
  - IV çok yüksek → Spread veya hisse (opsiyon yerine)
  - IV düşük, hareket beklentisi yüksek → Straddle (erken kurulum)

### Adım 5: Risk Planı (0.5 dakika)
- Her pozisyon için: Entry, Stop, Hedef, Max Loss yazın.
- 1% kuralını uygulayın.
- Eğer straddle kullanıyorsanız, IV Crush senaryosunda max loss'u kabul edebiliyor musunuz?

---

## Post-Earnings: Gap Fade Stratejisi

Earnings sonrası, hisse genellikle aşırı tepki verir. Bu aşırı tepki, ertesi gün veya sonraki günlerde tersine çevrilebilir. **Gap fade**, bu aşırı tepkiyi oynama stratejisidir.

### Gap Fade Long (Aşırı Düşüş Sonrası)

- Earnings sonrası hisse %5-10 gap down yapmış.
- Düşüş sebebi, geçici bir faktör (guidance cut, ama temel veriler iyi).
- Hacim, açılışta spike yaptıktan sonra düşüyor (divergence).
- RSI aşırı satım (< 30), Bollinger %B < 0.1.
- Ertesi gün veya 2-3 gün içinde gap fill beklenir.

> **Örnek:** TSLA earnings sonrası %8 gap down, açılış 220 USD. Ertesi gün hacim düşüyor, RSI 25, fiyat 218-220 arasında yataylaşıyor. Gap fill bölgesi = 235-240. 2-3 gün içinde 235'e yürüme potansiyeli. Risk: 215 altı. Ödül: 235. Risk/Ödül = 1:3.5. Mükemmel bir setup. Ama trend günlerinde gap devam eder, bu yüzden trend günü olup olmadığını anlamak şart.

### Gap Fade Short (Aşırı Yükseliş Sonrası)

- Earnings sonrası hisse %5-10 gap up yapmış.
- Yükseliş sebebi, geçici bir faktör (beat etti ama guidance zayıf).
- Hacim, açılışta spike yaptıktan sonra düşüyor.
- RSI aşırı alım (> 75), Bollinger %B > 0.9.
- Ertesi gün veya sonraki günlerde gap fill beklenir.

> **Örnek:** NVDA earnings sonrası %12 gap up, açılış 135 USD. Ertesi gün hacim düşüyor, RSI 78, fiyat 135-137 arasında yataylaşıyor. Gap fill bölgesi = 120-122. Bear put spread veya direkt PUT. Risk: 140 üzeri. Ödül: 122. Risk/Ödül = 1:2.6. "Too quiet" piyasada veya sektör zayıflığında bu setup güçlüdür. Trend günlerinde kaçının.

### Gap Fade Riskleri

- **Trend günü:** Eğer piyasa genel trend güçlüyse, gap devam eder. Gap fade, trend günlerinde tehlikelidir. Momentum tabanlı girişler ve mean reversion arasındaki ayrımı iyi yapın.
- **Haber devamı:** Earnings sonrası analist downgradeleri, haber akışı gap fade'i engelleyebilir.
- **Zaman:** Gap fill hemen olmayabilir. 2-5 gün beklemeniz gerekebilir. Opsiyon vadesi seçerken buna dikkat edin.

---

## Position Sizing + Risk

Earnings opsiyon stratejileri, normal opsiyon stratejilerinden çok daha yüksek risk içerir. Risk yönetimi, burada hayati önem taşır.

### 1% Kuralı — Earnings Versiyonu

Earnings döneminde, risk toleransınızı daha da düşürün. Normalde %1 olan pozisyon limitini, earnings pozisyonları için %0.5'e çekin. Eğer aynı gün 3-4 earnings pozisyonu açacaksanız, toplam risk %1-2'yi geçmemeli.

> **Örnek:** Portföy 50,000 USD. Normal pozisyon risk limiti = 500 USD. Earnings pozisyonu risk limiti = 250 USD. Straddle maliyeti 1,000 USD. Eğer 0.25 kontrat (veya spread) ile giremiyorsanız, bu setup'u atlayın veya vertical spread seçin.

### Earnings Döneminde Portfolio Heat

Aynı anda çok fazla earnings pozisyonu açmayın. Her pozisyon, aynı "sistematik risk"e (piyasa genelinin earnings sonrası reaksiyonu) maruz kalır. Eğer piyasa genel olarak earnings'leri kötü karşılıyorsa, tüm pozisyonlarınız zarar edebilir.

- **Maksimum açık earnings pozisyonu:** Portföy büyüklüğüne göre, aynı anda 2-5 earnings pozisyonu.
- **Farklı sektörler:** Tüm pozisyonları tech sektöründe açmayın. Finans, energy, healthcare gibi sektörlerden de earnings pozisyonları seçin.
- **Hedge:** Portföyünüzün genel riskini hedge etmek için SPY veya QQQ put'ları düşünün.

### Earnings Sonrası Pozisyon Yönetimi

Earnings açıklandıktan sonra:
- Eğer pozisyon kazançta ve hedefe yakınsa, kâr realize edin. Earnings sonrası volatilite hızla azalır.
- Eğer pozisyon zararda ama yön doğruysa, IV Crush'ın etkisini bekleyin. Ertesi gün IV biraz toparlanabilir.
- Eğer pozisyon zararda ve yön yanlışsa, stop loss'u uygulayın. Earnings sonrası "bekle ve gör" stratejisi genellikle işe yaramaz.

---

## Sık Sorulan Sorular (SSS)

### 1. Earnings öncesi straddle ne zaman kurulmalı?

En iyi zaman, earnings'den 3-7 gün öncesidir. Bu dönemde IV henüz çok patlamamış olabilir (Vega avantajı). Ama çok erken kurmak (10+ gün önce) Theta decay'e maruz bırakır. Earnings'den 1-2 gün önce kurmak, IV'nin zaten zirve yaptığı dönemdir, maliyet yüksektir.

### 2. Earnings sonrası hemen pozisyon açmalı mıyım?

Genellikle hayır. Earnings sonrası ilk 30-60 dakika, spread'ler çok geniş, volatilite çok yüksektir. "Chop" (yatay dalgalanma) yaygındır. Ertesi gün açılışta veya öğleden sonra, teknik seviyeler netleştiğinde pozisyon açmak daha güvenli.

### 3. Tüm şirketler earnings sonrası IV Crush yaşar mı?

Evet, neredeyse tüm şirketler. Earnings öncesi IV, "event risk" primi içerir. Earnings sonrası event risk ortadan kalkar, IV çöker. Ama çöküşün büyüklüğü değişir. Volatilitesi yüksek hisseler (TSLA, NVDA) %60-80 IV çökerken, daha sakin hisseler (KO, JNJ) %30-40 çöker.

### 4. Earnings stratejisi için hangi vadeyi seçmeliyim?

Earnings'e en yakın vadeyi seçin (genellikle haftalık veya aylık). Earnings sonrası vadeye çok zaman varsa, IV Crush'un etkisi daha uzun süreli olur. Eğer gap fade stratejisi izliyorsanız, 7-14 gün vade daha esnek olabilir.

### 5. Earnings öncesi hisse almak yerine opsiyon mu almalıyım?

Eğer yön tahmininiz güçlüyse ve IV Crush riskini azaltmak istiyorsanız, direkt hisse almak veya CFD kullanmak opsiyonlara göre daha güvenli olabilir. Hisse, IV Crush'tan etkilenmez. Ama kaldıraç (leverage) istiyorsanız, opsiyon veya spread daha uygun.

### 6. Earnings takviminde "confirmed" ve "estimated" ne demek?

- **Confirmed:** Şirket, resmi olarak earnings tarihini ve saatini açıkladı.
- **Estimated:** Earnings tarihi, geçmiş dönemlerden veya analist tahminlerinden tahmin ediliyor. Kesin değil. Estimated tarihlerde plan yaparken dikkatli olun.

### 7. Earnings stratejisi için kaç hisse takip etmeliyim?

Kalite, miktarı yener. 5-10 hisseyi derinlemesine takip etmek, 50 hisseyi yüzeysel takip etmekten çok daha iyidir. Gistify earnings brief ile, takip ettiğiniz hisselerin IV Rank, CPR, ve teknik seviyelerini otomatik olarak izleyebilirsiniz.

---

## Gistify ile Kazanç Dönemi Stratejilerinizi Güçlendirin

Kazanç dönemi opsiyon stratejileri, doğru bilgi, doğru zamanlama, ve disiplinli risk yönetimi gerektirir. **Gistify**, bu üç unsurun bir araya geldiği bir dark-themed finance workspace'tir.

Gistify'da şunları bulacaksınız:
- **Rolling 2-aylık Earnings Brief:** Mevcut ay ve gelecek ayın earnings takvimi, IV Rank, CPR, teknik seviyeler, ve straddle maliyeti — tek ekranda.
- **IV Rank ve IV Percentile:** Her hissenin volatilite durumunu tarihsel bağlamda değerlendirin. IV Rank > 90 olan hisselerde straddle yerine spread düşünün.
- **Risk Matrix:** Açık earnings pozisyonlarınızın toplam risk maruziyetini, Greek'lerini, ve portfolio heat'ini anlık takip edin.
- **Dark Workspace:** Gece gündüz aktif trader'lar için göz yormayan, odaklanmayı artıran bir arayüz. Earnings döneminde saatlerce ekran başında kalmanız gerekebilir — Gistify bunu göz yorulmadan yapmanızı sağlar.

Yön bağımsız trade arıyorsanız, kazanç döneminde minimum 2x getiri potansiyeli olan fırsatları yakalamak istiyorsanız, ve IV Crush tuzağına düşmek istemiyorsanız — Gistify sizin için burada.

### 🎯 Earnings Sezonuna Hazırlık Planı

1. Earnings takviminizi oluşturun (Gistify earnings brief veya Earnings Whispers)
2. Her hisse için IV Rank, ortalama hareket, ve straddle maliyetini hesaplayın
3. 5-10 hisseye odaklanın, derinlemesine teknik analiz yapın
4. Her hisse için strateji seçin: straddle, strangle, spread, veya directional
5. Risk planını yazın: entry, stop, hedef, max loss
6. 1% kuralını (earnings için %0.5) uygulayın
7. Paper trading ile pratik yapın
8. Gistify scanner ve risk matrix ile süreci otomatize edin

Kazanç dönemi, ABD opsiyon piyasalarının en verimli ve en tehlikeli dönemidir. Doğru strateji ile, bu dönem portföyünüzü önemli ölçüde büyütebilir. Yanlış strateji ile, IV Crush portföyünüzü eritebilir. Seçim sizin — ve Gistify, doğru seçimi yapmanız için yanınızda.

---

*Son güncelleme: 1 Temmuz 2026*

*Bu rehber eğitim amaçlıdır ve yatım tavsiyesi değildir. Earnings opsiyon stratejileri yüksek risk içerir. IV Crush, beklenmedik kayıplara neden olabilir. Her zaman kendi araştırmanızı yapın ve profesyonel finansal danışmanlık alın.*
