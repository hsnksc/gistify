# Opsiyon Stratejileri: Başlangıçtan İleri Seviyeye Tam Rehber

ABD borsalarında opsiyon ticareti yapmak, piyasayı yönlü olarak oynamaktan çok daha fazlasını sunar. CALL alabilirsiniz, PUT alabilirsiniz — yön bağımsız fırsatlar arayabilirsiniz. Ama bu gücün bedeli de vardır: opsiyonlar kompleks yapıları, zaman decay'si (Theta) ve Implied Volatility (IV) değişimleriyle bilinmeyen bir dünyadır.

Bu rehber, sıfırdan başlayan bir yatırımcıyı ileri seviyeye taşıyacak kapsamlı bir kaynaktır. **Target Keyword:** `opsiyon stratejileri`. İster CALL/PUT nedir bilmeyen bir yeni başlayan olun, ister IV Crush ve earnings oyununu öğrenmek isteyen aktif bir trader — bu yazı tam size göre.

---

## Opsiyon Nedir? Temel Kavramlar

Opsiyon, belirli bir hisse senedini (veya ETF'yi), belirli bir fiyattan (strike), belirli bir tarihe kadar (expiration) alma veya satma **hakkı** veren bir türev sözleşmedir. "Hakkı" kelimesi burada kritiktir — zorunluluk değil, hakkı. Opsiyon sahibi isterse kullanır, istemezse kullanmaz.

### CALL opsiyon (alım hakkı)

**CALL opsiyon**, sahibine belirli bir fiyattan hisse **alma hakkı** verir.

> Örnek: AAPL'ın 30 gün içinde 200 USD'den yükselmesini bekliyorsunuz. Strike 200, expiration 30 gün vadeli bir CALL opsiyon alırsınız. Eğer AAPL 200'ün üzerine çıkarsa, opsiyon değer kazanır. Çıkmazsa, yalnızca ödediğiniz **premium** kadar kaybedersiniz.

CALL alıcısı yükseliş beklentisindedir (bullish). Yön bağımsız trade arayan bir trader için, minimum 2x getiri potansiyeli olan bir CALL setup'ı mükemmel bir fırsattır.

### PUT opsiyon (satım hakkı)

**PUT opsiyon**, sahibine belirli bir fiyattan hisse **satma hakkı** verir.

> Örnek: TSLA'nın 250 USD'den düşeceğini düşünüyorsunuz. Strike 250 PUT alırsınız. TSLA 250'nin altına inerse, PUT değer kazanır. 2x bir fırsat bulmak için PUT tarafı da aktif olarak taranmalıdır.

PUT alıcısı düşüş beklentisindedir (bearish). Piyasa düşerken de kazanmak — bu opsiyonların en güçlü yanlarından biridir.

### Strike fiyatı, expiration (vade), premium

- **Strike Fiyatı:** Opsiyonun aktifleştiği (exercise edildiğinde) geçerli olan fiyat. Örneğin Strike 150, hisse 150'yi geçtiğinde CALL opsiyon ITM (In The Money) olur.
- **Expiration (Vade):** Opsiyonun son geçerlilik tarihi. 0DTE (zero days to expiration), haftalık (weekly), aylık (monthly) ve LEAPS (uzun vadeli) olabilir. 0DTE opsiyonlar, yani aynı gün vadesi dolan opsiyonlar, en agresif ve en yüksek riskli türdür.
- **Premium:** Opsiyonu almak için ödediğiniz fiyat. Bu, opsiyon satıcısına giden bedeldir. Premium = intrinsic value + time value.

### Intrinsic value vs. time value

**Intrinsic value:** Opsiyonun ITM olması durumunda, hisse fiyatı ile strike fiyatı arasındaki fark. Örneğin AAPL 210 USD, strike 200 CALL'ın intrinsic value'si 10 USD'dir.

**Time value:** Vadeye kalan süre ve IV'den kaynaklanan değer. Vade yaklaştıkça time value erir — buna **Theta decay** denir. 0DTE opsiyonların time value'si çok düşüktür, bu yüzden hızlı hareketler gerekir.

### Greeks (Delta, Gamma, Theta, Vega) — basit açıklama

Greeks, opsiyonun fiyatını etkileyen risk faktörlerini ölçer:

| Greek | Ne Ölçer? | Basit Anlamı |
|-------|-----------|--------------|
| **Delta** | Hisse fiyatı değişimine duyarlılık | Hisse 1 USD yükselirse, opsiyon fiyatı ne kadar değişir? Delta 0.50 = 1 USD yükselişte 0.50 USD artış. |
| **Gamma** | Delta'nın değişim hızı | ITM/OTM sınırında Gamma en yüksektir. "Gamma squeeze" dediğimiz olay buradan gelir. |
| **Theta** | Zaman kaybı | Her geçen gün opsiyonun eridiği değer. 0DTE'de Theta en yüksektir. |
| **Vega** | IV değişimine duyarlılık | IV 1 puan yükselirse, opsiyon fiyatı ne kadar değişir? Earnings öncesi Vega en yüksektir. |

---

## Opsiyon Piyasaları Nasıl Çalışır?

### ABD opsiyon piyasası (CBOE, OCC)

ABD'de opsiyonlar **CBOE (Chicago Board Options Exchange)** gibi borsalarda işlem görür. **OCC (Options Clearing Corporation)** ise tüm opsiyon sözleşmelerinin takasını ve garantörünü yürütür. Bu, ABD opsiyon piyasasının derin likiditesi ve düzenleyici altyapısı sayesinde küresel trader'lar için cazip hale gelir.

### Temel hacim ve likidite kavramları

- **Open Interest:** O pazarda açık pozisyon sayısı. Yüksek open interest = likidite var = spread (alış-satış farkı) dar.
- **Volume:** Günlük işlem hacmi. Hacimli bir opsiyon, kolayca alınıp satılabilir.
- **Bid-Ask Spread:** Alış ve satış fiyatı arasındaki fark. Dar spread = iyi likidite. Geniş spread = kayma (slippage) riski yüksek.

### OTM, ATM, ITM ne demek?

| Durum | CALL | PUT | Risk/Ödül |
|-------|------|-----|-----------|
| **ITM** | Strike < Hisse fiyatı | Strike > Hisse fiyatı | Daha pahalı, yüksek Delta, daha "gerçek" değer |
| **ATM** | Strike ≈ Hisse fiyatı | Strike ≈ Hisse fiyatı | Denge noktası, yüksek Gamma, "yolun ortası" |
| **OTM** | Strike > Hisse fiyatı | Strike < Hisse fiyatı | Ucuz, düşük Delta, yüksek risk/yüksek getiri potansiyeli |

> Örnek: NVDA 120 USD. Strike 115 CALL = ITM. Strike 120 CALL = ATM. Strike 125 CALL = OTM.

### Options chain nasıl okunur?

Options chain, bir hisse için tüm mevcut strike ve expiration kombinasyonlarını gösteren tablodur. Broker platformunuzda (Robinhood, Tastytrade, TD Ameritrade) bir hisse seçip "Options" sekmesine tıkladığınızda karşınıza çıkar.

**Okuması gereken kolonlar:**
- Strike (fiyat)
- Bid / Ask (alış / satış)
- Last (son işlem fiyatı)
- Volume (hacim)
- Open Interest (açık pozisyon)
- Implied Volatility (IV)
- Delta / Theta (opsiyon değerini etkileyen Greek'ler)

Yüksek hacim + yüksek open interest + dar bid-ask spread = ideal setup.

---

## 5 Temel Opsiyon Stratejisi

Bu bölümde, opsiyon stratejileri dünyasına adım atan herkesin bilmesi gereken 5 temel stratejiyi detaylıca inceleyeceğiz. Her strateji için risk/reward profili, kullanım zamanı ve gerçek örnek vereceğiz.

### 1. Long CALL (yükseliş beklentisi)

**Ne zaman kullanılır:** Hisse fiyatının yükseleceğini düşündüğünüzde.

**Mekanizma:** Belirli bir strike fiyatından CALL opsiyon satın alırsınız. Hisse yükseldiğinde, opsiyon değer kazanır.

> **Örnek:** AMD 100 USD. Siz 30 gün vadeli Strike 105 CALL alıyorsunuz. Premium = 3 USD. Her kontrat 100 hisse temsil eder, yani toplam maliyet = 300 USD. AMD 110 USD'ye çıkarsa, intrinsic value = 5 USD. Net kar = (5 - 3) × 100 = 200 USD. %67 kar.

- **Maksimum risk:** Ödenen premium (örnekte 300 USD)
- **Maksimum ödül:** Sınırsız (hisse ne kadar yükselirse, o kadar)
- **Breakeven:** Strike + Premium = 105 + 3 = 108 USD

### 2. Long PUT (düşüş beklentisi)

**Ne zaman kullanılır:** Hisse fiyatının düşeceğini düşündüğünüzde. Piyasa çöküşü korunması (hedge) için de kullanılır.

> **Örnek:** TSLA 250 USD. Siz Strike 240 PUT alıyorsunuz. Premium = 5 USD. Toplam maliyet = 500 USD. TSLA 220'ye düşerse, intrinsic value = 20 USD. Net kar = (20 - 5) × 100 = 1,500 USD. %200 kar.

- **Maksimum risk:** Ödenen premium (örnekte 500 USD)
- **Maksimum ödül:** Hisse 0'a inse bile strike fiyatı kadar (örnekte 240 × 100 = 24,000 USD potansiyel)
- **Breakeven:** Strike - Premium = 240 - 5 = 235 USD

### 3. Covered CALL (gelir stratejisi)

**Ne zaman kullanılır:** Hisse sahibisiniz, yükseliş beklentiniz sınırlı, ek gelir (premium) istiyorsunuz.

**Mekanizma:** Sahip olduğunuz hisse üzerine OTM CALL satarsınız. Hisse yükselmezse, premium'u cebinize koyarsınız. Yükselirse, hisseniz "call away" olur (satılır).

> **Örnek:** 100 adet AAPL sahibisiniz (fiyat 180 USD). Strike 185 CALL satıyorsunuz, premium = 2 USD. Toplam premium geliri = 200 USD. AAPL 185'in altında kalırsa, 200 USD sizin. 185'in üzerine çıkarsa, hisseniz 185'ten satılır. Toplam getiri = (185 - 180) × 100 + 200 = 700 USD.

- **Maksimum risk:** Hisse fiyatı çok düşerse (ama premium bir miktar dengeleyici)
- **Maksimum ödül:** (Strike - Hisse maliyeti) + Premium
- **Trade-off:** Sınırsız yükseliş potansiyelini sınırlıyorsunuz

### 4. Cash-Secured PUT (alım limiti stratejisi)

**Ne zaman kullanılır:** Bir hisseyi daha düşük fiyattan almak istiyorsunuz, ama o fiyata gelene kadar beklemek yerine premium kazanmak istiyorsunuz.

**Mekanizma:** Belirli bir strike fiyatından PUT satarsınız. Karşılığında nakit (cash-secured) bulundurursunuz. Hisse o fiyaya düşerse, opsiyon kullanılır ve hisseyi o fiyattan almış olursunuz. Düşmezse, premium sizin.

> **Örnek:** NVDA 120 USD. Siz 30 gün vadeli Strike 115 PUT satıyorsunuz. Premium = 4 USD. 11,500 USD (strike × 100) nakit bulunduruyorsunuz. NVDA 115'in üzerinde kalırsa, 400 USD premium kazanırsınız. 115'e veya altına düşerse, NVDA'yı 115 USD'den almış olursunuz. Efektif maliyet = 115 - 4 = 111 USD.

- **Maksimum risk:** Hisse 0'a inse bile strike fiyatı kadar (ama efektif maliyet düşük)
- **Maksimum ödül:** Premium (örnekte 400 USD)
- **Avantaj:** İstediğiniz fiyattan hisse almak için "ödeme alarak beklemek"

### 5. Straddle (yönsüz volatilite oyunu)

**Ne zaman kullanılır:** Hisse fiyatının **hangi yöne gideceğini bilmiyorsunuz**, ama **çok gideceğini** biliyorsunuz. Earnings öncesi en popüler stratejidir.

**Mekanizma:** Aynı strike ve vadede hem CALL hem PUT satın alırsınız. Hisse ne tarafa güçlü hareket ederse, o taraf kazanır. Diğer taraf batar. Net kar = kazanan tarafın kazancı - toplam premium.

> **Örnek:** AAPL 180 USD. Earnings öncesi Strike 180 straddle alıyorsunuz. CALL premium = 5 USD, PUT premium = 5 USD. Toplam maliyet = 1,000 USD. Earnings sonrası AAPL 195'e çıkarsa, CALL intrinsic value = 15 USD, PUT batar. Net kar = (15 - 10) × 100 = 500 USD. Eğer AAPL 170'ye düşerse, PUT intrinsic value = 10 USD, CALL batar. Net kar = 0 (breakeven). 170'nin altına düşerse kârlı olur.

- **Maksimum risk:** Toplam premium (örnekte 1,000 USD)
- **Maksimum ödül:** Sınırsız (tek yönlü)
- **Breakeven:** Strike ± Toplam Premium = 180 ± 10 = 170 ve 190 USD

### Karşılaştırma Tablosu: Temel 5 Strateji

| Strateji | Yön Beklentisi | Maks. Risk | Maks. Ödül | En İyi Zaman | Uygun Trader |
|----------|---------------|------------|------------|-------------|-------------|
| **Long CALL** | Yükseliş | Premium | Sınırsız | Breakout öncesi | Yeni başlayan |
| **Long PUT** | Düşüş | Premium | Sınırsız (teorik) | Breakdown öncesi | Yeni başlayan |
| **Covered CALL** | Hafif yükseliş/yatay | Hisse riski | Sınırlı | Yatay/yükseliş | Hisse sahibi |
| **Cash-Secured PUT** | Hafif düşüş/yatay | Strike - Premium | Premium | Yatay/düşüş | Hisse alıcısı |
| **Straddle** | Yönsüz, volatilite | Toplam Premium | Sınırsız | Earnings, haber | Orta seviye |

---

## Orta Seviye Stratejiler: Spread'ler

Spread stratejileri, iki veya daha fazla opsiyon kontratını birleştirerek riski sınırlar ve maliyeti düşürür. CALL ya da PUT fark etmez — spread'ler her iki yönde de kurulabilir.

### Vertical Spread (bull call, bear put)

**Bull Call Spread:** ITM veya ATM CALL alırsınız, daha yüksek strike OTM CALL satarsınız. Maliyeti düşürür, kârı sınırlar.

> Örnek: AAPL 180 USD. Strike 180 CALL al (premium 5 USD). Strike 190 CALL sat (premium 2 USD). Net maliyet = 3 USD (300 USD). Maksimum kâr = 10 USD fark - 3 USD maliyet = 7 USD (700 USD). %133 kâr potansiyeli. Risk sınırlı.

**Bear Put Spread:** ATM PUT al, daha düşük strike PUT sat. Düşüş beklentisi için.

### Iron Condor (yan piyasa)

**Iron Condor**, piyasanın yatay seyredeceğini düşündüğünüzde kullanılan dört bacaklı bir stratejidir. OTM CALL spread + OTM PUT spread satılır. Kâr, hissenin belirli bir aralıkta kalması durumunda gerçekleşir.

> Örnek: SPY 550 USD. Strike 560/570 CALL spread sat, Strike 540/530 PUT spread sat. Her iki yönden premium alırsınız. SPY 530-560 aralığında kalırsa, her iki spread de worthless olur ve premium sizin. Risk = spread genişliği - alınan premium.

### Calendar Spread (volatilite farkı)

**Calendar Spread**, aynı strike fiyatta farklı vadelerdeki opsiyonları kullanır. Yakın vadeli opsiyon satılır, uzun vadeli opsiyon alınır. Theta decay farkından kâr elde edilir. Özellikle yan piyasalarda etkilidir.

> Örnek: AAPL 180 USD. 30 gün vadeli Strike 180 CALL sat (premium 4 USD), 60 gün vadeli Strike 180 CALL al (premium 6 USD). Net maliyet = 2 USD. Kısa vadeli opsiyonun Theta decay'i hızlıdır, uzun vadeli opsiyon daha yavaş erir. Zaman geçtikçe spread değer kazanır.

### Butterfly Spread (konsantrasyon)

**Butterfly Spread**, hissenin belirli bir fiyatta kalmasını beklediğinizde kullanılan sınırlı risk/sınırlı ödül stratejisidir. Üç strike fiyatı kullanılır: düşük strike'dan bir al, orta strike'dan iki sat, yüksek strike'dan bir al (CALL butterfly için).

> Örnek: AAPL 180 USD. Strike 175 CALL al (premium 6 USD), Strike 180 CALL × 2 sat (premium 3 × 2 = 6 USD), Strike 185 CALL al (premium 1.5 USD). Net maliyet = 1.5 USD. Maksimum kâr, AAPL 180'de kalırsa = 5 - 1.5 = 3.5 USD (350 USD). %233 kâr potansiyeli. Risk sınırlı.

### Karşılaştırma Tablosu: Spread Stratejileri

| Strateji | Bacağı | Yön Beklentisi | Maks. Risk | Maks. Ödül | Kullanım Alanı |
|----------|--------|---------------|------------|------------|----------------|
| **Vertical Spread** | 2 | Yön tahmini | Sınırlı | Sınırlı | Yönlü oyun |
| **Iron Condor** | 4 | Yatay | Sınırlı | Sınırlı | Yan piyasa, IV yüksek |
| **Calendar Spread** | 2 | Yatay/hafif yön | Sınırlı | Sınırlı | Theta farkı |
| **Butterfly** | 3 veya 4 | Konsantrasyon | Çok sınırlı | Sınırlı | Pin fiyatı tahmini |

---

## İleri Seviye: IV Crush ve Earnings Oyunu

### Implied Volatility (IV) nedir?

**Implied Volatility (IV)**, piyasanın bir hissenin gelecekteki volatilite beklentisini fiyatlara yansıttığı ölçüdür. Yüksek IV = opsiyonlar pahalı. Düşük IV = opsiyonlar ucuz. IV Rank ve IV Percentile gibi metriklerle karşılaştırmalı olarak değerlendirilir.

> Örnek: NVDA'nın IV'si %80. Bu, NVDA'nın tarihsel volatilitesine göre çok yüksek bir beklenti demektir. Earnings öncesi bu rakam normalde %80-120 arasındadır.

### IV Crush — kazanç döneminin en büyük tuzağı

**IV Crush**, earnings sonrası IV'nin çok hızlı düşmesi ve opsiyon fiyatlarının çökmesidir. Earnings öncesi yüksek IV ile alınan straddle, hisse beklenenden az hareket ederse — IV Crush yüzünden her iki bacak da değer kaybeder.

> **Gerçek Örnek:** AAPL earnings öncesi straddle aldınız, premium = 8 USD. AAPL %2 yükseldi (beklenti %4'tü). Hisse yükseldi ama IV %80'den %35'e çöktü. CALL tarafı hafif kazandı, ama IV Crush PUT tarafını mahvetti. Net sonuç = zarar. Bu tuzağa düşmeyen trader, IV Crush'ı hesaba katarak pozisyonunu ölçeklendirir.

**IV Crush'tan korunma:** Earnings öncesi straddle/strangle alırken IV'yi kontrol edin. IV çok yüksekse, direkt opsiyon almak yerine vertical spread düşünün. Spread'ler IV Crush'tan daha az etkilenir.

### Earnings öncesi straddle stratejisi

Earnings öncesi straddle, IV'in henüz çok patlamadığı erken dönemde kurulur. Genellikle earnings duyurusundan 3-7 gün önce. Amaç, IV yükselişinden (Vega) de kâr elde etmek, sadece hareketten değil.

> Örnek: TSLA earnings 7 gün sonra. IV %50. Straddle kuruyorsunuz (strike = spot). 3 gün sonra IV %75'e çıktı. Hisse henüz çok hareket etmemiş olabilir ama straddle değer kazanır (Vega etkisi). Earnings günü satarak IV yükselişinden kâr alabilirsiniz — buna "volatilite long" denir.

### Earnings sonrası gap fade

**Gap fade**, earnings sonrası hissenin aşırı tepki verip (gap up/down) sonra o yönü tersine çevirmesi üzerine kurulu bir stratejidir. "Too quiet" piyasada mean reversion, trend günlerinde momentum short/long ayrımı yapıyoruz — aynı mantık burada da geçerli.

> Örnek: AMD earnings sonrası %8 gap up yaptı. Ertesi gün açılışta IV Crush zaten gerçekleşmiş, CALL'lar ucuzlamış. Ancak hisse aşırı alım bölgesine girmiş (RSI > 80). O gün veya ertesi gün PUT veya bear spread ile gap fade oynanabilir. Ama bu strateji yüksek risklidir — trend günlerinde gap devam eder.

---

## Risk Yönetimi: Opsiyonlarda Kaybetmemek

Opsiyon stratejileri dünyasında kazanç sınırsız görünse de, risk yönetimi olmadan sınırlı sermaye hızla erir. Aşağıdaki kurallar hayatta kalmanızı sağlar.

### Position sizing (1% kuralı)

**1% kuralı:** Her bir opsiyon pozisyonu için portföyünüzün en fazla %1'ini riske atın. 10,000 USD portföyünüz varsa, bir pozisyon için maksimum risk = 100 USD. Bu, art arda 10 kaybetme serisinde bile portföyünüzü %10'dan fazla eritmez.

> Örnek: Portföy 50,000 USD. Bir straddle pozisyonunda maksimum risk = 500 USD. Straddle maliyeti 1,000 USD ise, yalnızca 0.5 kontrat (veya 50 USD risk) ile girin. Veya spread stratejisi seçin — spread'ler doğal olarak sınırlı risklidir.

### Max loss hesaplama

Her pozisyon girmeden önce, **maksimum kayıp** hesabını yapın. Long pozisyonlar için bu kolaydır: ödediğiniz premium. Spread'ler için: spread genişliği - alınan premium.

> Örnek: Bull Call Spread. Strike 180 CALL al (5 USD), Strike 190 CALL sat (2 USD). Net maliyet = 3 USD. Maksimum risk = 3 USD × 100 = 300 USD. Spread genişliği = 10 USD × 100 = 1,000 USD. Maksimum ödül = 1,000 - 300 = 700 USD. Risk/Ödül = 1:2.3. Bu kabul edilebilir.

### Stop loss — opsiyonlarda nasıl çalışır?

Opsiyonlarda stop loss zordur çünkü opsiyon fiyatı hem hisse fiyatına (Delta) hem zamana (Theta) hem de IV'ye (Vega) bağlıdır. Broker stop loss'u hisse fiyatı üzerinden koyabilirsiniz (örneğin hisse 175'e düşerse sat), ama bu IV spike'ında yanlış tetiklenebilir.

**Daha iyi yaklaşım:**
- Pozisyon büyüklüğüyle riski kontrol edin (position sizing)
- Spread'ler kullanarak doğal stop loss oluşturun
- Greek'leri takip edin (Delta threshold, örneğin Delta -0.20'nin altına düşerse kapat)
- Zaman bazlı stop: Vadeye 7 gün kaldıysa ve pozisyon karlı değilse, erken çıkın

### Portfolio heat (Greek'lerle yönetim)

Portfolio heat, portföyünüzün toplam risk maruziyetini ifade eder. Tüm pozisyonlarınızın Delta, Gamma, Theta ve Vega toplamlarını izleyin.

- **Net Delta:** Portföyünüzün hisse fiyatı değişimine duyarlılığı. 100 net Delta = 100 adet hisse sahibi gibi davranırsınız.
- **Net Theta:** Zaman kaybı. Theta pozitif = her gün zaman sizin lehinize eriyor (satıcı pozisyonu). Theta negatif = zaman sizin aleyhinize eriyor (alıcı pozisyonu).
- **Net Vega:** IV değişimine duyarlılık. Earnings döneminde Vega pozitif olmak risklidir — IV Crush'a maruz kalırsınız.

---

## Sık Sorulan Sorular (SSS)

### 1. Opsiyon almak için ne kadar para lazım?

ABD opsiyon piyasalarında bir kontrat 100 hisse temsil eder. Premium 2 USD ise, bir kontrat = 200 USD. 10 kontrat = 2,000 USD. Minimum başlangıç sermayesi 2,000-5,000 USD arası önerilir. 1% kuralıyla, 5,000 USD portföyde bir pozisyon için 50 USD risk alırsınız.

### 2. Türkiye'den ABD opsiyonu alınabilir mi?

Doğrudan ABD brokerlarından (Interactive Brokers, Tastytrade, TD Ameritrade) hesap açabilirsiniz. Kimi brokerlar Türkiye'de yaşayan yatırımcıları kabul eder. Vergi yükümlülüğünüz Türkiye'dedir; ABD'de stopaj uygulanabilir, ama Türkiye'de de beyan etmeniz gerekir. Detaylı vergi danışmanlığı almanız önerilir.

### 3. Hangi broker'ı kullanmalıyım?

- **Interactive Brokers:** Düşük komisyon, profesyonel platform, dünya geneli erişim. En popüler seçim.
- **Tastytrade:** Opsiyon odaklı, düşük komisyon, eğitim içeriği bol.
- **TD Ameritrade (Schwab):** ThinkorSwim platformu çok güçlü, ama hesap açma daha katı.

### 4. Pattern Day Trader (PDT) Rule nedir?

ABD'de 25,000 USD'nin altındaki margin hesaplarda, 5 iş günü içinde 3'ten fazla gün içi trade (day trade) yapmanız yasaktır. Bu, 25,000 USD altındaki hesaplar için ciddi bir kısıtlamadır. Opsiyonlarla day trade yapacaksanız, 25,000 USD+ portföy veya cash account kullanın.

### 5. 0DTE opsiyon nedir, neden riskli?

0DTE (Zero Days to Expiration), aynı gün vadesi dolan opsiyonlardır. SPY, QQQ, IWM gibi büyük ETF'lerde haftada üç gün (Pazartesi, Çarşamba, Cuma) 0DTE vardır. Çok hızlı hareket eder, Theta decay inanılmaz derecede yüksektir. Yeni başlayanlar için uygun değildir. Deneyimli trader'lar için "VWAP -2s oversold bounce" veya "ORB reject" gibi momentum stratejileriyle kullanılır.

### 6. Opsiyonlar hisse kadar güvenli mi?

Hayır. Opsiyonlar çok daha yüksek risk içerir. Bir long CALL/PUT pozisyonunda, ödediğiniz premiumun tamamını kaybedebilirsiniz (ve sıklıkla kaybedersiniz). Spread'ler riski sınırlar, ama hâlâ risklidir. Opsiyonlar "kaldıraçlı" araçlardır — kazanç ve kayıp çarpanlıdır.

### 7. Earnings öncesi opsiyon almak mantıklı mı?

Mantıklı olabilir, ama IV Crush tuzağına düşmemek gerekir. Earnings öncesi IV genellikle çok yüksektir. Hisse beklenenden az hareket ederse, yönü doğru tahmin etmiş olsanız bile kaybedebilirsiniz. Earnings stratejileri için straddle/strangle veya spread'ler daha güvenlidir.

### 8. Greek'leri bilmek zorunda mıyım?

Başlangıçta tüm Greek'leri ezberlemeniz gerekmez, ama Delta ve Theta'yı anlamanız şarttır. Delta, pozisyonunuzun hisse fiyatına ne kadar duyarlı olduğunu söyler. Theta, zamanın sizin aleyhinize mi lehinize mi çalıştığını söyler. İleri seviyede Gamma ve Vega da kritik hale gelir.

### 9. Opsiyon eğitimi için ücretsiz kaynak var mı?

Evet. CBOE Options Institute, Tastytrade Learn, Investopedia Options Guide, ve YouTube'daki opsiyon kanalları ücretsiz kaynaklardır. Ama eğitim bir yere kadar — gerçek deneyim pahalı olabilir. Paper trading (sahte para ile pratik) yaparak başlayın.

### 10. Spread nedir, neden kullanılır?

Spread, iki veya daha fazla opsiyonun birleştirilmesidir. Amaç: riski sınırlamak, maliyeti düşürmek, veya volatilite yönünde pozisyon almak. Yeni başlayanlar için spread'ler, tek bacaklı (long CALL/PUT) stratejilerden çok daha güvenlidir.

---

## Gistify ile Opsiyon Stratejilerinizi Güçlendirin

Opsiyon stratejileri öğrenmek bir yolculuktur. Teknik bilgi, risk yönetimi, ve disiplin — üçünü de aynı anda geliştirmeniz gerekir. **Gistify**, bu yolculuğunuzu desteklemek için tasarlanmış bir dark-themed finance workspace'tir.

Gistify'nin dark workspace'inde:
- **Scanner** ile momentum fırsatlarını ve yüksek olasılıklı setup'ları tarayabilirsiniz.
- **Earnings brief** ile kazanç dönemi hisselerinin IV Rank, CPR, ve teknik analizini tek ekranda görebilirsiniz.
- **Risk matrix** ile pozisyonlarınızın Greek'lerini ve portfolio heat'ini yönetebilirsiniz.

Yön bağımsız trade arıyorsanız, 2x bir fırsat bulmak istiyorsanız, ve opsiyon eğitiminizi sistematik olarak ilerletmek istiyorsanız — Gistify sizin için burada.

### 🚀 Başlangıç Yapın

1. Paper trading hesabı açın (IBKR veya Tastytrade)
2. Bu rehberdeki 5 temel stratejiyi tek tek pratik yapın
3. Gistify'daki scanner ve earnings brief ile günlük tarama rutini oluşturun
4. 1% kuralını asla kırmayın
5. Her gün öğrenin, her hafta değerlendirin, her ay büyüyün

Opsiyonlar sınırsız potansiyel sunar. Ama unutmayın: **sınırsız potansiyel, sınırsız risk demek değildir.** Doğru stratejiler, disiplinli risk yönetimi, ve sürekli eğitim — bu üçlü, opsiyon piyasalarında hayatta kalan ve kazanan trader'ın sırrıdır.

---

## 📋 Beginner Checklist: Opsiyon Yolculuğunuza Başlamadan Önce

Aşağıdaki 10 maddelik checklist'i tamamlamadan gerçek para ile opsiyon ticaretine başlamayın:

| # | Kontrol | Açıklama |
|---|---------|----------|
| ✅ | CALL ve PUT farkını anladım | Yükseliş için CALL, düşüş için PUT |
| ✅ | Strike, expiration, premium kavramlarını biliyorum | Temel yapı taşları net |
| ✅ | ITM/ATM/OTM farkını anladım | Para durumunu yorumlayabiliyorum |
| ✅ | Options chain okuyabiliyorum | Bid, ask, volume, open interest, IV kolonlarını anlıyorum |
| ✅ | Delta ve Theta'yı biliyorum | En kritik iki Greek açık |
| ✅ | 5 temel stratejiyi anladım | Long CALL, Long PUT, Covered CALL, CSP, Straddle |
| ✅ | Spread kavramını biliyorum | En az bir spread stratejisini çözebiliyorum |
| ✅ | 1% kuralını uyguluyorum | Position sizing disiplinim var |
| ✅ | Paper trading yaptım | En az 20 paper trade yaptım, sonuçları kaydettim |
| ✅ | Broker platformunu kullanabiliyorum | Emir girişi, options chain, pozisyon takibi akıcı |

Bu 10 maddeyi tamamladıysanız, tebrikler — opsiyon stratejileri dünyasına sağlam bir temelle adım atıyorsunuz. Şimdi gerçek hesapta küçük başlayın, büyük düşünün, ve sabırla büyüyün.

---

*Son güncelleme: 1 Temmuz 2026*

*Bu rehber eğitim amaçlıdır ve yatım tavsiyesi değildir. Opsiyon ticareti yüksek risk içerir ve kayıp riski taşır. Her zaman kendi araştırmanızı yapın ve profesyonel finansal danışmanlık alın.*
