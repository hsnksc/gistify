# Gistify Earning Strategy — Agent 4: Bütçe + Risk + Portföy + Eylem Planı

**Rapor Tarihi:** 1 Temmuz 2026 | **TSİ:** 14:12  
**Dönem:** Temmuz 2026 + Ağustos 2026 Rolling Earnings Stratejisi  
**VIX:** 16.89 (Low Fear) | **S&P 500:** ~7,499.36 | **Nasdaq:** ~26,213.72 | **Dow:** ~52,319.20 | **Russell 2000:** ~3,024.37

---

## İçindekiler

1. [Bütçe Dostu Strateji Matrisi (4 Seviye)](#1-bütçe-dostu-strateji-matrisi-4-seviye)
2. [FOMC ve Risk Yönetimi Protokolü](#2-fomc-ve-risk-yönetimi-protokolü)
3. [Portföy Önerileri (5 Bütçe Seviyesi)](#3-portföy-önerileri-5-bütçe-seviyesi)
4. [Haftalık Eylem Planı (Temmuz 2026)](#4-haftalık-eylem-planı-temmuz-2026)
5. [Ekler](#5-ekler)
6. [Ek B: Margin Rehberi ve Broker Karşılaştırması](#6-ek-b-margin-rehberi-ve-broker-karşılaştırması)
7. [Ek C: Risk/Reward Matrix ve Win Rate Analizi](#7-ek-c-riskreward-matrix-ve-win-rate-analizi)
8. [Ek D: Earnings Play Hata Rehberi](#8-ek-d-earnings-play-hata-rehberi)

---

## 1. Bütçe Dostu Strateji Matrisi (4 Seviye)

> **Earnings Play Formatı (Zorunlu):** Entry = earnings'ten 2-5 gün önce | Exit = earnings sonrası 1-2 gün içinde | Max Hold = 2 gün  
> **Kar Hedefi:** Toplanan primin %50-75'i | **IV Crush:** BMO 2-4 saat / AMC ertesi gün sabah

Bu bölüm, farklı sermaye seviyelerine göre earnings odaklı opsiyon stratejilerini detaylandırır. Her seviye, belirli bir bütçe aralığına, risk toleransına ve getiri beklentisine hitap eder. Earnings play'lerin karakteristiği gereği, tüm stratejiler short-term (2-5 gün) tutma süresine sahiptir. 'Lottery ticket' seviyesi %100 risk barındırır; spread'ler riski sınırlarken kâr potansiyelini de sınırlar. Butterfly ve Iron Condor stratejileri IV Crush'dan kazanç sağlarken, directional oynaklık gerektirmez. Ratio ve Calendar spread'ler ise yüksek kâr potansiyeli sunar ama kompleks yapıları nedeniyle deneyim gerektirir.

| Seviye | Bütçe | Strateji Tipi | Maliyet | Max Kar | Risk | Deneyim |
|--------|-------|--------------|---------|---------|------|---------|
| 1 | $10-$50 | Long Call / Long Put | ~$10-$50 | Sınırsız (teorik) | %100 | Başlangıç |
| 2 | $50-$200 | Debit Spread (Bull Call / Bear Put) | ~$50-$200 | 2-3x | %100 | Orta |
| 3 | $200-$500 | Butterfly / Iron Condor | ~$200-$500 | 1-2x | %100 | İleri |
| 4 | $500-$1000 | Ratio Spread / Calendar Spread | ~$500-$1000 | 2-4x | Sınırlı/Sınırsız | Uzman |

---

### 1.1 Seviye 1: $10–$50 | Lottery Ticket (Long Call / Long Put)

| Parametre | Değer |
|-----------|-------|
| **Strateji Tipi** | Long Call (Bullish) / Long Put (Bearish) |
| **Maliyet Aralığı** | ~$10 – $50 (kontrat başına) |
| **Max Kar** | Sınırsız (teorik) |
| **Max Risk** | Ödenen prim (%100) |
| **Kâr Hedefi** | %100–200 (2x–3x) |
| **Uygulama Zamanı** | Earnings'ten 2–4 gün önce |
| **Tavsiye Edilen DTE** | 5–9 DTE (0DTE / Haftalık expiry) |
| **Greeks Profili** | Yüksek Gamma, Yüksek Theta decay |

Bu seviye, küçük sermayeli trader'lar için 'lottery ticket' mantığında çalışır. Düşük maliyetli, yüksek oynaklık potansiyeli taşıyan OTM (Out-of-The-Money) opsiyonlar tercih edilir. Earnings öncesi IV spike, bu stratejinin ana kâr kaynağıdır; IV crush riski yüksektir. Bu nedenle, strateji doğru yönlü tahmin (directional) gerektirir. Yüzde olarak düşük kazanma olasılığı (~30-35%) vardır, ancak kazanıldığında kâr çarpanı yüksektir. Uygun hisse seçimi kritiktir: yüksek IV Rank (>50), net teknik seviyeler (support/resistance) ve açık haber akışı olan hisseler tercih edilmelidir.

Long Call/Put stratejilerinin en büyük avantajı, basitliğidir. Alım satım kolaydır, margin gerektirmez, ve kâr potansiyeli teorik olarak sınırsızdır. Ancak, bu stratejinin en büyük dezavantajı da IV Crush'dan tamamen savunmasız olmasıdır. Eğer hisse fiyatı beklenen yönde hareket etse bile, IV'nin çok şiddetli düşmesi durumunda pozisyon kârı azalabilir ve hatta zarara dönebilir. Bu 'Vega riski', earnings play'lerin en büyük tuzaklarından biridir. Özellikle 'BMO' (Before Market Open) açıklamalarında, earnings sonrası açılışta IV neredeyse anında çöker. Bu nedenle, BMO hisselerinde Long Call/Put stratejisi çok daha risklidir; 'pre-market' çıkış imkanı varsa değerlendirilmelidir, yoksa bu hisselerde Spread veya Butterfly stratejileri tercih edilmelidir.

DTE (Days to Expiration) seçimi bu seviyede hayati önemdedir. 0DTE (aynı gün expiry) opsiyonlar, 'lottery ticket' mantığında en yüksek kâr potansiyeli sunar ancak aynı zamanda en yüksek riski taşır. 0DTE opsiyonlar, 'Thetanın efendisi' olarak bilinir; zaman decay, her geçen saatte hızlanır. 5-9 DTE arası ise 'sweet spot' olarak kabul edilir; IV Crush potansiyeli yüksektir, Theta decay hızlıdır ama 'wiggle room' (hareket alanı) biraz daha fazladır. 21+ DTE opsiyonlar, earnings play'ler için 'pahalı'dır; uzun vadeli Theta decay ve düşük Gamma, kâr potansiyelini azaltır. Bu nedenle, earnings play'lerde asla 21+ DTE kullanılmamalıdır. ⛔ '21 DTE', 'Zamanla çıkış', 'Aylık tutma', 'Swing trade' YASAKTIR.

Delta hedefi, 0.30-0.40 arasıdır. Bu, 'OTM' ama 'hisse fiyatına yakın' anlamına gelir. Çok düşük Delta (<0.15), 'ucuz' ama 'kazanma olasılığı çok düşük' demektir. Çok yüksek Delta (>0.60), 'pahalı' ve 'kâr çarpanı düşük' demektir. 0.30-0.40 Delta, 'risk/reward' denge noktasıdır. Örnek: Hisse fiyatı $100 ise, 102 CALL (Delta ~0.40) veya 98 PUT (Delta ~0.40) idealdir. 110 CALL (Delta ~0.15) veya 90 PUT (Delta ~0.15) çok uzağa gider, kazanma olasılığı düşer.

Hacim ve Open Interest, 'liquidity' ölçüsüdür. Hacim, o gün kaç kontrat işlem gördüğünü gösterir. Open Interest, açık pozisyon sayısını gösterir. Earnings play'lerde, günlük hacim 1000+ kontrat ve Open Interest 5000+ olan strike'lar tercih edilmelidir. İllikit opsiyonlar, 'bid-ask spread' maliyetini artırır (örn: $1.00 bid, $1.50 ask — spread maliyeti %50!). Ayrıca, illikit opsiyonlarda 'exit' zorlaşır; istediğiniz fiyattan satamazsınız. Bu nedenle, 'liquid options' — genellikle ATM veya yakın ATM strike'lar — tercih edilmelidir. 'Meme stocks' (TSLA, AMC, GME) genellikle yüksek hacimlidir; ancak 'small caps' (GIS, FDS, GBX) bazen düşük hacim taşıyabilir. Bu hisselerde, 'spread' stratejileri daha güvenlidir.

#### Örnek Stratejiler (Seviye 1 — $10–$50)

| # | Hisse | Opsiyon | Maliyet (prim) | Earnings Tarihi | Yön/Hikaye | Strateji | Max Risk | Detay |
|---|-------|---------|----------------|-----------------|------------|----------|----------|-------|
| 1 | $NKE | 78 PUT | ~$2.10 | 21 Temmuz 2026 BMO | Bearish — guidance endişeleri, Çin talebi zayıflığı, $80 support kırılımı | Bearish Put | $210 | 78 strike put, 7 DTE, Nike guidance downgrade riski yüksek |
| 2 | $GIS | 72.5 CALL | ~$1.45 | 1 Temmuz 2026 BMO | Bullish — pet food segment toparlanması, Häagen-Dazs Çin'den çıkış marj artışı | Bullish Call | $145 | 72.5 strike call, 5 DTE, fiyat hedefi $75.50, IV ~65% |
| 3 | $FDS | 560 CALL | ~$3.80 | 1 Temmuz 2026 BMO | Bullish — AI entegrasyonu, TIFIN.AI partnership, recurring revenue growth | Bullish Call | $380 | 560 strike call, 5 DTE, fiyat hedefi $580, IV ~72% |
| 4 | $TSLA | 270 PUT | ~$2.10 | 22 Temmuz 2026 AMC | Bearish — EV talep yavaşlaması, margin compression, Çin fiyat savaşları | Bearish Put | $210 | 270 strike put, 5 DTE, fiyat hedefi $250, IV ~68% |
| 5 | $GOOGL | 185 PUT | ~$1.80 | 22 Temmuz 2026 AMC | Bearish — DOJ antitrust dava riski, cloud growth deceleration, AI capex endişeleri | Bearish Put | $180 | 185 strike put, 5 DTE, fiyat hedefi $170, IV ~58% |
| 6 | $META | 585 CALL | ~$2.50 | 29 Temmuz 2026 AMC | Bullish — AI advertising, Reels monetization, Llama 4 hype, strong DAU | Bullish Call | $250 | 585 strike call, 5 DTE, fiyat hedefi $610, IV ~55% |
| 7 | $AMZN | 215 CALL | ~$1.95 | 30 Temmuz 2026 AMC | Bullish — AWS growth, Prime day momentum, AI chip demand | Bullish Call | $195 | 215 strike call, 5 DTE, fiyat hedefi $230, IV ~52% |
| 8 | $AAPL | 230 CALL | ~$2.30 | 30 Temmuz 2026 AMC | Bullish — iPhone 17 cycle early demand, Services growth, India expansion | Bullish Call | $230 | 230 strike call, 5 DTE, fiyat hedefi $245, IV ~48% |
| 9 | $WFC | 58 CALL | ~$1.20 | 15 Temmuz 2026 BMO | Bullish — NII toparlanması, credit normalization, net interest margin expansion | Bullish Call | $120 | 58 strike call, 5 DTE, fiyat hedefi $63, IV ~45% |
| 10 | $JPM | 212.5 CALL | ~$2.80 | 15 Temmuz 2026 BMO | Bullish — NII beat, investment banking recovery, buyback authorization | Bullish Call | $280 | 212.5 strike call, 5 DTE, fiyat hedefi $220, IV ~47% |

#### Seviye 1 — Uyarılar ve İpuçları

- **IV Crush Riski:** Long Call/Put stratejileri, earnings sonrası IV çökmesine (IV crush) karşı en savunmasız stratejilerdir. Eğer hisse fiyatı beklenen yönde hareket etmezse, hem yön kaybı hem de IV değer kaybı (Vega loss) aynı anda yaşanır. Bu 'double whammy' etkisini azaltmak için, earnings'ten önceki son gün (T-1) pozisyonun yarısını kapatmak veya kârı realize etmek akıllıcadır.
- **DTE Seçimi:** 5-9 DTE arasındaki expiry'ler tercih edilmelidir. 0DTE çok risklidir; 21+ DTE ise Theta decay'i yavaşlatır ama IV Crush'dan kazancı da azaltır. Earnings haftası içindeki expiry en idealidir. ⛔ 21 DTE ve üzeri kullanımı YASAKTIR.
- **Delta Hedefi:** 0.30-0.40 Delta arası OTM opsiyonlar seçilmelidir. Çok düşük Delta (<0.15) 'lottery ticket' olur ama kazanma olasılığı çok düşüktür. Çok yüksek Delta (>0.60) ise maliyeti artırır, kâr çarpanını düşürür.
- **Hacim ve Open Interest:** Günlük hacmi 1000+ kontrat ve open interest 5000+ olan strike'lar tercih edilmelidir. İllikit opsiyonlar spread maliyetini (bid-ask spread) artırır ve çıkış zorlaşır.
- **BMO vs AMC:** BMO (Before Market Open) açıklamaları daha risklidir çünkü IV, açılışta anında çöker. AMC (After Market Close) açıklamaları, ertesi gün açılışta 'gap' riski taşır ama 'after-market' hareketini izleme imkanı sunar. BMO hisselerinde, 'pre-market' çıkış imkanı varsa değerlendirilmelidir.

---

### 1.2 Seviye 2: $50–$200 | Debit Spread (Bull Call / Bear Put)

| Parametre | Değer |
|-----------|-------|
| **Strateji Tipi** | Bull Call Spread (Bullish) / Bear Put Spread (Bearish) |
| **Maliyet Aralığı** | ~$50 – $200 (spread başına) |
| **Max Kar** | 2x–3x (net debit'e göre) |
| **Max Risk** | Net debit (%100) |
| **Kâr Hedefi** | %50–75 spread width'in kapandığı noktada |
| **Uygulama Zamanı** | Earnings'ten 3–5 gün önce |
| **Tavsiye Edilen DTE** | 7–14 DTE |
| **Greeks Profili** | Düşük Vega, Sınırlı Gamma, Pozitif Theta (tutulursa) |

Debit Spread'ler, long directional play'lerin riskini sınırlayan temel yapı taşıdır. Alınan (long) opsiyon primi, satılan (short) opsiyon primi ile kısmen telafi edilir. Bu, net maliyeti düşürür ve aynı zamanda max riski net debite sabitler. Dezavantajı, kâr potansiyelinin spread width ile sınırlı olmasıdır. Bull Call Spread'lerde alınan call'ın strike'ı, satılan call'ın strike'ından düşüktür. Bear Put Spread'lerde ise alınan put'ın strike'ı, satılan put'ın strike'ından yüksektir. Earnings play'ler için idealdir çünkü IV crush, short leg üzerinden kısmen hedge edilir.

Debit Spread'lerin en büyük avantajı, 'riski sınırlı' ve 'kârı öngörülebilir' olmasıdır. Long Call/Put stratejilerinde, kâr potansiyeli 'sınırsız' ama 'risk %100'dür. Debit Spread'lerde, risk %100'dür (net debit) ama kâr potansiyeli 'spread width - net debit' ile sınırlıdır. Bu, 'disciplined' bir trader için daha uygundur. 'Kâr hedefi', net debit'in %50-75'i kadardır. Örnek: $5 spread width, $2 net debit. Max kâr = $3. Kâr hedefi = $1.50-$2.25 (spread width'in %30-45'i). Bu hedefe ulaşıldığında, pozisyonun tamamı kapatılmalıdır.

Spread width seçimi, 'expected move' ile ilişkilidir. Hisse fiyatı $100, expected move ±$5 ise, spread width $5-$10 arası idealdir. Çok dar spread'ler (örn: $100/$101), kâr potansiyelini sınırlar ($1 max kâr). Çok geniş spread'ler (örn: $100/$120), kâr potansiyeli yüksek ama 'kapanma olasılığı' düşer. Earnings play'lerde, genellikle $5-$10 spread width tercih edilir. Bu, 'expected move'un %60-80'ini kapsar.

Short leg riski, assignment riski olarak bilinir. Eğer hisse, short leg strike'ının ITM (In-The-Money) üzerine kapanırsa, 'assignment' alınabilir. Bu, 'short call' için 'short stock' pozisyonu, 'short put' için 'long stock' pozisyonu anlamına gelir. Earnings play'lerde, pozisyon 'short-term' (2 gün) tutulduğundan, assignment riski düşüktür. Ancak, pozisyon 'expiry günü' tutulursa ve hisse short leg strike'ına yakınsa, assignment riski artar. Bu riski yönetmek için, pozisyonun expiry gününden önce kapatılması önerilir.

IV Crush hedge, Debit Spread'lerin önemli bir avantajıdır. Long leg, IV Crush'dan değer kaybeder (Vega loss). Short leg, IV Crush'dan değer kazanır (Vega gain). Bu 'hedge', net Vega riskini azaltır. Ancak, bu hedge 'mükemmel' değildir. Long leg genellikle daha yüksek Vega taşır (ATM veya yakın ATM). Short leg, daha düşük Vega taşır (OTM). Bu nedenle, net Vega pozisyonu hala negatiftir (Vega loss). Eğer IV çok şiddetli düşerse (örn: VIX 30'tan 15'e), pozisyon hala değer kaybedebilir. Bu riski azaltmak için, IV Rank >60 olan hisselerde Debit Spread kullanmak daha akıllıcadır (yüksek IV'den kazanç).

#### Örnek Stratejiler (Seviye 2 — $50–$200)

| # | Hisse | Spread | Net Debit | Earnings | Yön/Hikaye | Strateji | Max Risk | Detay |
|---|-------|--------|-----------|----------|------------|----------|----------|-------|
| 1 | $NKE | 78/82 Bear Put Spread | ~$1.80 ($180) | 21 Temmuz 2026 BMO | Bearish — guidance cut, inventory glut, China slowdown | Bear Put Spread | $180 | 78 PUT Long @ $2.10, 82 PUT Short @ $0.30, Net Debit $1.80, Max Gain $2.20 (122%) |
| 2 | $JPM | 210/220 Bull Call Spread | ~$3.50 ($350) | 15 Temmuz 2026 BMO | Bullish — NII beat, investment banking recovery, buyback | Bull Call Spread | $350 | 210 CALL Long @ $5.20, 220 CALL Short @ $1.70, Net Debit $3.50, Max Gain $6.50 (186%) |
| 3 | $UNH | 520/540 Bear Put Spread | ~$4.20 ($420) | 16 Temmuz 2026 BMO | Bearish — Medicare Advantage margin pressure, regulatory headwinds | Bear Put Spread | $420 | 520 PUT Long @ $6.50, 540 PUT Short @ $2.30, Net Debit $4.20, Max Gain $15.80 (376%) |
| 4 | $TSLA | 260/250 Bear Put Spread | ~$2.80 ($280) | 22 Temmuz 2026 AMC | Bearish — delivery miss, margin compression, robotaxi delay | Bear Put Spread | $280 | 260 PUT Long @ $4.50, 250 PUT Short @ $1.70, Net Debit $2.80, Max Gain $7.20 (257%) |
| 5 | $GOOGL | 180/190 Bull Call Spread | ~$3.60 ($360) | 22 Temmuz 2026 AMC | Bullish — cloud acceleration, AI search integration, YouTube growth | Bull Call Spread | $360 | 180 CALL Long @ $5.80, 190 CALL Short @ $2.20, Net Debit $3.60, Max Gain $6.40 (178%) |
| 6 | $META | 575/595 Bull Call Spread | ~$4.50 ($450) | 29 Temmuz 2026 AMC | Bullish — AI ad revenue, Reels ARPU, Threads engagement | Bull Call Spread | $450 | 575 CALL Long @ $7.80, 595 CALL Short @ $3.30, Net Debit $4.50, Max Gain $15.50 (344%) |
| 7 | $MSFT | 460/475 Bull Call Spread | ~$3.80 ($380) | 29 Temmuz 2026 AMC | Bullish — Azure growth, Copilot monetization, enterprise AI | Bull Call Spread | $380 | 460 CALL Long @ $6.50, 475 CALL Short @ $2.70, Net Debit $3.80, Max Gain $11.20 (295%) |
| 8 | $AMZN | 210/225 Bull Call Spread | ~$3.20 ($320) | 30 Temmuz 2026 AMC | Bullish — AWS acceleration, Prime revenue, advertising growth | Bull Call Spread | $320 | 210 CALL Long @ $5.40, 225 CALL Short @ $2.20, Net Debit $3.20, Max Gain $11.80 (369%) |
| 9 | $AAPL | 225/240 Bull Call Spread | ~$3.40 ($340) | 30 Temmuz 2026 AMC | Bullish — iPhone 17 supercycle, Services margin, India expansion | Bull Call Spread | $340 | 225 CALL Long @ $5.60, 240 CALL Short @ $2.20, Net Debit $3.40, Max Gain $11.60 (341%) |
| 10 | $BAC | 42/46 Bull Call Spread | ~$1.50 ($150) | 15 Temmuz 2026 BMO | Bullish — consumer banking strength, NII stabilization, credit improvement | Bull Call Spread | $150 | 42 CALL Long @ $2.40, 46 CALL Short @ $0.90, Net Debit $1.50, Max Gain $2.50 (167%) |

#### Seviye 2 — Uyarılar ve İpuçları

- **Spread Width:** Genellikle $5-$10 spread width idealdir. Çok dar spread'ler kâr potansiyelini sınırlar; çok geniş spread'ler ise kâr realize etme zorlaştırır. Earnings play'ler için hissenin beklenen hareketini (expected move) hesaba katıp, spread width'in bu hareketin %60-80'ini kapsaması hedeflenir.
- **Short Leg Risk:** Satılan (short) leg, assignment riski taşır. Eğer hisse short leg strike'ının ITM'sine kapanırsa, assignment alınabilir. Bu riski yönetmek için, kâr hedefinin %50'sine ulaşıldığında pozisyonun tamamını kapatmak (close spread) en güvenli yoldur.
- **IV Crush Hedge:** Debit spread'ler, long leg'in Vega loss'unu short leg'in Vega gain'i ile kısmen dengeler. Ancak bu hedge mükemmel değildir; eğer IV çok şiddetli düşerse, long leg daha fazla değer kaybedebilir. Bu nedenle, IV Rank >60 olan hisselerde spread kullanmak daha akıllıcadır.
- **Entry Timing:** Spread'leri, earnings'ten 3-5 gün önce kurmak idealdir. Çok erken (T-7+) IV henüz yüksek değildir; çok geç (T-1) ise spread maliyeti (bid-ask) artar ve doldurma zorlaşır.
- **Close Spread:** Debit Spread'lerde, 'leg out' (tek tek leg kapatma) yerine 'spread' olarak kapatma tercih edilmelidir. 'Leg out' yapmak, directional riski artırır ve 'naked' pozisyon bırakabilir.

---

### 1.3 Seviye 3: $200–$500 | Butterfly / Iron Condor

| Parametre | Değer |
|-----------|-------|
| **Strateji Tipi** | Long Butterfly (Call/Put) / Iron Condor |
| **Maliyet Aralığı** | ~$200 – $500 (yapı başına) |
| **Max Kar** | ~1x–2x net debit (Butterfly) / ~1x–1.5x max risk (Iron Condor) |
| **Max Risk** | Net debit / Spread width (Iron Condor) |
| **Kâr Hedefi** | %50–80 max kâr potansiyelinin realize edilmesi |
| **Uygulama Zamanı** | Earnings'ten 2–4 gün önce |
| **Tavsiye Edilen DTE** | 5–9 DTE |
| **Greeks Profili** | Neutral Delta, Pozitif Theta, Negatif Vega (IV crush'a hassas) |

Butterfly ve Iron Condor stratejileri, 'directional' olmayan, IV Crush'dan kazanç sağlamaya odaklanan yapılardır. Long Butterfly'de, orta strike (body) satılır, alt ve üst strike'lar (wings) alınır. Iron Condor'da ise bir call spread ve bir put spread aynı anda satılır, orta bölge (profit zone) oluşturulur. Bu stratejiler, hissenin earnings sonrası 'beklenen hareketin' altında kalacağına inanılan durumlarda kullanılır. Temel risk, hissenin 'beklenenden çok' hareket etmesi ve yapının dışına çıkmasıdır. Iron Condor, daha geniş profit zone sunar; Butterfly ise daha yüksek kâr çarpanı (risk/reward ratio) sunar.

Butterfly stratejisi, 'risk/reward ratio' açısından en etkili earnings play'lerden biridir. Net debit, genellikle çok düşüktür ($1-$2). Ancak, max kâr potansiyeli, spread width'in yarısı kadardır. Örnek: $10 spread width ($50/$55/$60 Butterfly), net debit $1.50. Max kâr = $3.50 (233% return). Bu 'risk/reward ratio', earnings play'lerde nadir bulunur. Dezavantajı, profit zone'un çok dar olmasıdır. Hisse, body strike'ından çok uzaklaşırsa (>$5), pozisyon max loss'a ulaşır. Bu nedenle, Butterfly stratejisi, 'high conviction' 'non-directional' play'ler için uygundur.

Iron Condor stratejisi, 'probability of profit' (kazanma olasılığı) açısından en etkili stratejilerden biridir. Iron Condor, net credit alınır (premium toplanır). Profit zone, genellikle oldukça geniştir (örn: hisse $100 ise, profit zone $95-$105). 'Probability of profit', %60-70 arasındadır. Dezavantajı, 'risk/reward ratio'nun ters olmasıdır: max risk > max reward. Örnek: $5 spread width, $1.50 credit. Max kâr = $1.50. Max risk = $3.50. Bu, 'win small, lose big' dinamiğidir. Earnings play'lerde, Iron Condor 'high probability' stratejisi olarak kullanılabilir; ancak 'tail risk' (beklenmedik büyük hareket) her zaman vardır.

Expected move (ATM straddle değeri), Butterfly ve Iron Condor stratejilerinde kritik bir metriktir. Expected move, piyasanın hissenin earnings sonrası ne kadar hareket etmesini beklediğinin ölçüsüdür. Örnek: Hisse $100, ATM straddle $5. Expected move = ±$5. Butterfly body strike'ı $100 (ATM) yerleştirilir. Wing width = $5 (her iki yöne). Profit zone = $95-$105. Eğer hisse $95-$105 arasında kalırsa, pozisyon kârlıdır. Eğer hisse $95'in altına veya $105'in üzerine çıkarsa, max loss. Bu nedenle, 'expected move' hesaplaması, bu stratejilerin en önemli adımıdır.

#### Örnek Stratejiler (Seviye 3 — $200–$500)

| # | Hisse | Yapı | Net Debit/Credit | Earnings | Yön/Hikaye | Strateji | Max Risk | Detay |
|---|-------|------|------------------|----------|------------|----------|----------|-------|
| 1 | $NKE | 78/82/86 Long Call Butterfly | ~$1.20 ($120) x 3 = ~$360 | 21 Temmuz 2026 BMO | Neutral — expected move ±9%, fiyat $82'de konsolide olabilir | Long Call Butterfly | $360 | 78 CALL Long, 82 CALL Short x2, 86 CALL Long. Max Gain $840 (233%), Max Risk $360. Body = expected move ortası. |
| 2 | $JPM | 208/212/216 Long Call Butterfly | ~$1.10 ($110) x 3 = ~$330 | 15 Temmuz 2026 BMO | Neutral — bankalar earnings sonrası genellikley +-%3 hareket eder, consolidation | Long Call Butterfly | $330 | 208/212/216 strikes. Max Gain $870 (264%), Max Risk $330. Body = analyst consensus target. |
| 3 | $TSLA | 255/265/275 Long Put Butterfly | ~$1.50 ($150) x 3 = ~$450 | 22 Temmuz 2026 AMC | Neutral-Bearish — expected move ±12%, but downside skewed due to delivery miss | Long Put Butterfly | $450 | 255/265/275 strikes. Max Gain $1050 (233%), Max Risk $450. Body = $265 (current spot). |
| 4 | $GOOGL | 175/185/195 Long Call Butterfly | ~$1.80 ($180) x 3 = ~$540 | 22 Temmuz 2026 AMC | Neutral — expected move ±5.6%, AI hype ve DOJ risk birbirini dengeliyor | Long Call Butterfly | $540 | 175/185/195 strikes. Max Gain $960 (178%), Max Risk $540. Body = $185 (ATM). |
| 5 | $META | 570/585/600 Long Call Butterfly | ~$1.60 ($160) x 3 = ~$480 | 29 Temmuz 2026 AMC | Neutral — expected move ±7%, AI ad revenue hype zaten fiyatlanmış | Long Call Butterfly | $480 | 570/585/600 strikes. Max Gain $1020 (213%), Max Risk $480. Body = $585 (expected move mid). |
| 6 | $MSFT | 450/465/480 Long Call Butterfly | ~$1.40 ($140) x 3 = ~$420 | 29 Temmuz 2026 AMC | Neutral — expected move ±6.7%, Azure guidance kritik, fiyat zaten ATH yakını | Long Call Butterfly | $420 | 450/465/480 strikes. Max Gain $1080 (257%), Max Risk $420. Body = $465 (ATM). |
| 7 | $AMZN | 200/215/230 Long Call Butterfly | ~$1.20 ($120) x 3 = ~$360 | 30 Temmuz 2026 AMC | Neutral — expected move ±5%, AWS zaten fiyatlanmış, Prime Day uncertainty | Long Call Butterfly | $360 | 200/215/230 strikes. Max Gain $1140 (317%), Max Risk $360. Body = $215 (expected move mid). |
| 8 | $AAPL | 220/235/250 Long Call Butterfly | ~$1.30 ($130) x 3 = ~$390 | 30 Temmuz 2026 AMC | Neutral — expected move ±4.2%, iPhone 17 beklentisi zaten fiyatlanmış, guidance conservative | Long Call Butterfly | $390 | 220/235/250 strikes. Max Gain $1110 (285%), Max Risk $390. Body = $235 (expected move mid). |
| 9 | $UNH | 500/520/540 Long Put Butterfly | ~$1.80 ($180) x 3 = ~$540 | 16 Temmuz 2026 BMO | Neutral-Bearish — Medicare Advantage margin compression, expected move ±6% | Long Put Butterfly | $540 | 500/520/540 strikes. Max Gain $1060 (196%), Max Risk $540. Body = $520 (ATM). |
| 10 | $BAC | 40/43/46 Iron Condor | ~$0.80 ($80) x 5 = ~$400 | 15 Temmuz 2026 BMO | Neutral — bankalar low IV, expected move ±4%, consolidation zone 40-46 | Iron Condor | $400 | 40/43 Put Spread + 46/49 Call Spread. Credit $400. Max Gain $400, Max Risk $1100. Profit zone: $40.80 - $48.20. |

#### Seviye 3 — Uyarılar ve İpuçları

- **Expected Move Kullanımı:** Butterfly body strike'ı, hissenin 'expected move' (ATM straddle değeri) orta noktasına yerleştirilmelidir. Bu, hissenin ±1 expected move içinde kalma olasılığını maksimize eder. Eğer body strike expected move dışına yerleştirilirse, kâr olasılığı dramatik düşer.
- **Wing Width:** Genellikle body'den her iki yöne $5-$10 wing width idealdir. Çok dar wing'ler, hissenin hafif hareketlerinde bile max loss'a ulaşabilir. Çok geniş wing'ler ise kâr potansiyelini sınırlar ve maliyeti artırır.
- **Iron Condor vs Butterfly:** Iron Condor, daha geniş profit zone (>$1 width) sunar ve net credit alınır. Dezavantajı, max risk > max reward'dur (risk/reward tersidir). Butterfly, max risk < max reward'dır (risk/reward lehinedir) ama profit zone daraldır. Earnings play'ler için, hissenin 'çok hareket etmeyeceğine' güçlü inanılıyorsa Iron Condor; 'biraz hareket edebilir ama çok değil' düşüncesi varsa Butterfly tercih edilir.
- **Management:** Butterfly ve Iron Condor pozisyonları, earnings sonrası ertesi gün açılışta (BMO için) veya 2 gün içinde (AMC için) kapatılmalıdır. Tutma süresi max 2 gündür. 'Max hold 2 gün' kuralı bu seviye için hayati önemdedir; Theta decay ve IV crush sonrası pozisyon değeri hızla erir.
- **IV Crush Timing:** Butterfly ve Iron Condor, 'IV Crush'dan kazanç sağlar. Ancak, IV Crush 'anında' olmaz. BMO açıklamalarında, IV Crush açılışta (09:30-10:00) gerçekleşir. AMC açıklamalarında, IV Crush ertesi gün açılışta (09:30-10:00) gerçekleşir. Bu nedenle, 'too early' kapatmak (örn: earnings açıklaması gecesinde) IV Crush'un tam etkisini almayabilir. 'Optimal exit', BMO için 09:45-10:15, AMC için ertesi gün 09:45-10:15'dır.

---

### 1.4 Seviye 4: $500–$1,000 | Ratio Spread / Calendar Spread

| Parametre | Değer |
|-----------|-------|
| **Strateji Tipi** | Ratio Call Spread / Ratio Put Spread / Calendar Spread |
| **Maliyet Aralığı** | ~$500 – $1,000 (yapı başına) |
| **Max Kar** | 2x–4x net debit / Sınırsız (tek taraflı ratio spread'lerde) |
| **Max Risk** | Net debit (Calendar) / Sınırlı (Ratio) / Sınırsız (naked side risk) |
| **Kâr Hedefi** | %60–80 max kâr potansiyelinin realize edilmesi |
| **Uygulama Zamanı** | Earnings'ten 4–5 gün önce |
| **Tavsiye Edilen DTE** | 7–14 DTE (short leg), 30+ DTE (long leg — Calendar) |
| **Greeks Profili** | Asimetrik Delta, Yüksek Gamma, Karmaşık Theta/Vega profili |

Bu seviye, ileri düzey opsiyon trader'larına hitap eder. Ratio Spread'lerde, alınan opsiyon sayısından daha fazla opsiyon satılır (örn: 1 Long Call, 2 Short Call). Bu, net debit'i düşürür ve hatta net credit sağlayabilir. Dezavantajı, 'naked side' riskidir: eğer hisse çok hareket ederse, fazladan satılan short leg'ler büyük loss üretebilir. Calendar Spread'lerde ise farklı expiry'lerdeki opsiyonlar kullanılır; short leg (near-term) hızlı Theta decay yaşarken, long leg (far-term) daha yavaş decay yaşar. Earnings play'ler için, short leg earnings haftası expiry'sine, long leg sonraki haftaya yerleştirilir. IV crush, short leg'in değerini düşürürken long leg'i korur.

Ratio Spread'ler, 'asymmetric risk/reward' profili ile bilinir. Örnek: 1x2 Ratio Call Spread. 1x 100 CALL Long @ $5. 2x 105 CALL Short @ $2. Net Debit = $1. Max Profit at $105 = $4. Break-even: $101 ve $109. Eğer hisse $105'e ulaşırsa, kâr maksimumdur. Eğer hisse $109'un üzerine çıkarsa, 'naked side' riski başlar; her $1'lık artış, $100 kayıp anlamına gelir (2 short call - 1 long call = 1 naked call). Bu 'unlimited loss' riski, Ratio Spread'lerin en büyük dezavantajıdır. Bu riski yönetmek için, 'naked side' için 'stop-loss' konulmalıdır (örn: hisse $108'e ulaşırsa, pozisyon kapatılır).

Calendar Spread'ler, 'IV Crush' ve 'Theta decay' farkından kazanç sağlar. Earnings play'ler için, short leg (satılan opsiyon) earnings haftası expiry'sine (örn: 25 Temmuz), long leg (alınan opsiyon) sonraki haftaya (örn: 1 Ağustos) yerleştirilir. Earnings sonrası, short leg'in IV'si çöker (IV Crush) ve Theta decay hızlanır. Long leg, daha yavaş decay yaşar ve IV'si daha az çöker. Net etki: pozisyon kârı. Dezavantajı, 'directional risk'tir. Eğer hisse çok hareket ederse, long leg ve short leg farklı strike'lara göre farklı değerlenir; pozisyon zarar edebilir. Bu nedenle, Calendar Spread'ler 'moderate move' (±3-5%) beklenen hisselerde daha etkilidir.

#### Örnek Stratejiler (Seviye 4 — $500–$1,000)

| # | Hisse | Yapı | Net Debit | Earnings | Yön/Hikaye | Strateji | Max Risk | Detay |
|---|-------|------|-----------|----------|------------|----------|----------|-------|
| 1 | $NKE | 1x2 Ratio Put Spread (78/72) | ~$0.90 ($90) x 6 = ~$540 | 21 Temmuz 2026 BMO | Bearish — delivery miss, margin compression, downside skew | Ratio Put Spread | $540 | 1x 78 PUT Long @ $2.10, 2x 72 PUT Short @ $0.60. Net Debit $0.90. Max Profit at $72. Break-even: $78.90 & $65.10. Naked risk below $65.10. |
| 2 | $JPM | 1x2 Ratio Call Spread (212/220) | ~$1.20 ($120) x 5 = ~$600 | 15 Temmuz 2026 BMO | Bullish — NII beat, limited upside due to regulatory cap | Ratio Call Spread | $600 | 1x 212 CALL Long @ $4.50, 2x 220 CALL Short @ $1.65. Net Debit $1.20. Max Profit at $220. Break-even: $213.20 & $226.80. Naked risk above $226.80. |
| 3 | $TSLA | Calendar Put Spread (260) | ~$4.50 ($450) x 2 = ~$900 | 22 Temmuz 2026 AMC | Bearish — near-term IV crush, long-term downside bias | Calendar Put Spread | $900 | Short: 260 PUT 25 Temmuz expiry @ $6.50. Long: 260 PUT 1 Ağustos expiry @ $11.00. Net Debit $4.50. Max Profit at $260 at expiry. Vega positive. |
| 4 | $GOOGL | Calendar Call Spread (185) | ~$3.80 ($380) x 2 = ~$760 | 22 Temmuz 2026 AMC | Bullish — IV crush near-term, long-term AI integration upside | Calendar Call Spread | $760 | Short: 185 CALL 25 Temmuz expiry @ $5.20. Long: 185 CALL 1 Ağustos expiry @ $9.00. Net Debit $3.80. Max Profit at $185 at expiry. Vega positive. |
| 5 | $META | 1x2 Ratio Call Spread (585/600) | ~$1.50 ($150) x 4 = ~$600 | 29 Temmuz 2026 AMC | Bullish — AI ad revenue, but upside capped by regulatory concerns | Ratio Call Spread | $600 | 1x 585 CALL Long @ $5.80, 2x 600 CALL Short @ $2.15. Net Debit $1.50. Max Profit at $600. Break-even: $586.50 & $613.50. Naked risk above $613.50. |
| 6 | $MSFT | Calendar Call Spread (465) | ~$4.20 ($420) x 2 = ~$840 | 29 Temmuz 2026 AMC | Bullish — Azure long-term growth, near-term guidance conservative | Calendar Call Spread | $840 | Short: 465 CALL 1 Ağustos expiry @ $6.80. Long: 465 CALL 8 Ağustos expiry @ $11.00. Net Debit $4.20. Max Profit at $465 at expiry. Vega positive. |
| 7 | $AMZN | 1x2 Ratio Call Spread (215/230) | ~$1.10 ($110) x 5 = ~$550 | 30 Temmuz 2026 AMC | Bullish — AWS growth, but upside capped by competition | Ratio Call Spread | $550 | 1x 215 CALL Long @ $4.20, 2x 230 CALL Short @ $1.55. Net Debit $1.10. Max Profit at $230. Break-even: $216.10 & $243.90. Naked risk above $243.90. |
| 8 | $AAPL | Calendar Call Spread (235) | ~$3.60 ($360) x 2 = ~$720 | 30 Temmuz 2026 AMC | Bullish — iPhone 17 supercycle, Services growth, long-term India | Calendar Call Spread | $720 | Short: 235 CALL 1 Ağustos expiry @ $5.40. Long: 235 CALL 8 Ağustos expiry @ $9.00. Net Debit $3.60. Max Profit at $235 at expiry. Vega positive. |
| 9 | $UNH | 1x2 Ratio Put Spread (520/500) | ~$1.80 ($180) x 4 = ~$720 | 16 Temmuz 2026 BMO | Bearish — Medicare Advantage margin compression, regulatory risk | Ratio Put Spread | $720 | 1x 520 PUT Long @ $5.50, 2x 500 PUT Short @ $1.85. Net Debit $1.80. Max Profit at $500. Break-even: $521.80 & $478.20. Naked risk below $478.20. |
| 10 | $BAC | Calendar Put Spread (41) | ~$2.20 ($220) x 3 = ~$660 | 15 Temmuz 2026 BMO | Bearish — NII pressure, credit normalization, downside bias | Calendar Put Spread | $660 | Short: 41 PUT 18 Temmuz expiry @ $3.20. Long: 41 PUT 25 Temmuz expiry @ $5.40. Net Debit $2.20. Max Profit at $41 at expiry. Vega positive. |

#### Seviye 4 — Uyarılar ve İpuçları

- **Ratio Spread Risk Management:** Ratio spread'lerde 'naked side' riski en kritik faktördür. Eğer hisse beklenenden çok hareket ederse, fazladan satılan short leg'ler sınırsız (call side) veya neredeyse sınırsız (put side) loss üretebilir. Bu riski yönetmek için, pozisyonun yarısını kâr hedefinin %50'sinde kapatmak ve kalanı stop-loss ile korumak önerilir. Ayrıca, 'naked side' riskini sınırlamak için, ratio spread yerine 'backspread' (more long than short) düşünülebilir, ancak bu net debit'i artırır.
- **Calendar Spread Timing:** Calendar spread'ler, short leg'in Theta decay'inden ve IV Crush'dan kazanç sağlar. Ancak, long leg'in değeri de IV Crush'dan etkilenir (daha az oranda). Eğer IV çok şiddetli düşerse (örn: VIX 30'tan 15'e), long leg de önemli değer kaybedebilir. Bu nedenle, Calendar spread'ler 'moderate IV' (VIX 18-25) ortamlarında daha etkilidir.
- **Entry/Exit Timing:** Ratio spread'ler, earnings'ten 4-5 gün önce kurulmalıdır. Calendar spread'ler, short leg'in expiry'si earnings sonrası 2-3 gün sonraya yerleştirilmelidir. Eğer short leg earnings haftası içinde expiry olursa, IV Crush'un tam etkisini alır; bu istenen bir durumdur. Long leg ise sonraki haftaya (7-14 DTE) yerleştirilmelidir.
- **Margin Requirements:** Ratio spread'ler, broker'lara göre değişen margin gereksinimleri taşıyabilir. Naked short leg'ler, genellikle 'uncovered option' margin'ine tabidir (hisse fiyatının %20'si + premium - OTM amount). Bu, $500-$1000 bütçeli bir trader için margin sıkıntısı yaratabilir. Broker platformunuzun margin kurallarını önceden kontrol edin.
- **Complexity Warning:** Ratio ve Calendar spread'ler, 'complex' yapılardır. Yeni başlayan trader'lar, bu stratejileri denemeden önce 'paper trade' (simülasyon) yapmalıdır. 'Real money' ile bu stratejileri kullanmak, deneyim ve disiplin gerektirir. 'Small size' (küçük pozisyon) ile başlamak, öğrenme sürecinin en güvenli yoludur.

---

## 2. FOMC ve Risk Yönetimi Protokolü

> **FOMC 28-29 Temmuz 2026:** Fed funds rate kararı 29 Temmuz 14:00 EDT'de açıklanır. Basın toplantısı 14:30 EDT'de başlar. Bu, Temmuz earnings sezonunun en kritik makro olayıdır. FOMC haftası, piyasa volatilitesi (VIX) genellikle artar; earnings play'ler için risk yönetimi hayati önem taşır.

FOMC (Federal Open Market Committee), ABD'nin para politikasını belirleyen kuruldur. FOMC toplantıları, 8 kez yılda düzenlenir. Her toplantı sonunda, 'Fed funds rate' kararı açıklanır ve 'policy statement' yayınlanır. Çeyrek dönem toplantılarında (Mart, Haziran, Eylül, Aralık), 'Summary of Economic Projections' (SEP) ve 'dot plot' da yayınlanır. Temmuz 2026 toplantısı, 'non-quarterly' bir toplantıdır; ancak FOMC kararı her zaman piyasa volatilitesini artırır.

FOMC kararı, sadece 'faiz oranı' kararı değildir. 'Policy statement' içinde, Fed'in ekonomik değerlendirmesi, enflasyon görünümü, istihdam piyasası değerlendirmesi, ve 'forward guidance' (geleceğe yönelik ipuçları) yer alır. 'Forward guidance', piyasa tarafından genellikle 'faiz oranı' kararından daha önemli görülür. Eğer Fed, 'hawkish' (şahin) bir dil kullanırsa (örn: 'inflation remains elevated', 'additional tightening may be warranted'), piyasa 'risk-off' yapabilir. Eğer Fed, 'dovish' (güvercin) bir dil kullanırsa (örn: 'inflation is moving toward target', 'downside risks to growth'), piyasa 'risk-on' yapabilir.

Powell basın toplantısı, FOMC kararından 30 dakika sonra başlar. Bu toplantı, 'Q&A' (soru-cevap) formatındadır. Gazeteciler, Fed Başkanı Jerome Powell'a sorular sorar. Powell'ın cevapları, piyasa hareketlerini etkileyebilir. Özellikle, 'rate cut' (faiz indirimi) veya 'rate hike' (faiz artışı) beklentileri hakkındaki sorular, piyasa tarafından yakından izlenir. Powell'ın 'dodge' (kaçamak cevap) verme şekli bile, piyasa tarafından 'hawkish' veya 'dovish' olarak yorumlanabilir.

### 2.1 FOMC Takvimi ve Blackout Dönemi

| Olay | Tarih | Saat (EDT) | Önem | Eylem |
|------|-------|------------|------|-------|
| **Blackout Başlangıcı** | 18 Temmuz 2026 (Cumartesi) | 00:00 | 🔴 Yüksek | Yeni pozisyon açma sınırlandırılması başlar |
| **Blackout Bitişi** | 30 Temmuz 2026 (Perşembe) | 23:59 | 🔴 Yüksek | Fed yetkilileri konuşmaya başlar |
| **FOMC Toplantısı Gün 1** | 28 Temmuz 2026 (Salı) | 09:00-17:00 | 🔴 Yüksek | Piyasa volatilitesi artar, pozisyonlar %50 azaltılır |
| **FOMC Toplantısı Gün 2** | 29 Temmuz 2026 (Çarşamba) | 09:00-14:00 | 🔴 Yüksek | Karar beklenir, pozisyonlar %50 azaltılır |
| **FOMC Karar Açıklaması** | 29 Temmuz 2026 (Çarşamba) | 14:00 | 🔴🔴 Kritik | Tüm pozisyonlar kapatılmalı veya %75 azaltılmalı |
| **Basın Toplantısı** | 29 Temmuz 2026 (Çarşamba) | 14:30 | 🔴🔴 Kritik | Powell'ın dil tonu piyasayı hareket ettirir |
| **FOMC Minutes (Yayınlanma)** | 19 Ağustos 2026 | 14:00 | 🟡 Orta | Önceki toplantının detayları |

#### Blackout Dönemi Protokolü (18-30 Temmuz 2026)

Blackout dönemi, Fed yetkililerinin kamuoyuna açıklama yapmadığı, piyasanın 'suskun' olduğu dönemdir. Bu dönemde, piyasa spekülasyonu ve 'positioning' artar. Earnings play'ler için özel kurallar:

1. **18-24 Temmuz (Blackout Haftası 1):** Yeni pozisyon açma sınırlandırılır. Sadece 'zorunlu' earnings play'ler (örn: 22 Temmuz GOOGL/TSLA) açılabilir. Pozisyon boyutu normalin %50'si ile sınırlandırılır. Tek hisse max %1 (normalde %2).
2. **25-27 Temmuz (Blackout Haftası 2 + FOMC Öncesi):** Yeni pozisyon açılması **yasaktır**. Sadece mevcut pozisyonların yönetimi (stop-loss, kâr alma) yapılabilir. FOMC öncesi son 3 gün, piyasa volatilitesi (VIX) genellikle artar; bu 'event risk' earnings play'lerin riskini katmerler.
3. **28-29 Temmuz (FOMC Günleri):** Tüm açık pozisyonlar, FOMC karar açıklamasından (14:00 EDT) önce kapatılmalıdır. Eğer pozisyon tutulacaksa, max pozisyon boyutu hesabın %0.5'i ile sınırlandırılır. FOMC sonrası (14:30-16:00), piyasa 'knee-jerk' reaksiyon verebilir; bu dönemde trade yapmak **yasaktır**.
4. **30 Temmuz (Blackout Bitişi):** Fed yetkilileri konuşmaya başlar. 'Fed speakers' günü, piyasa volatilitesi yüksek kalabilir. Yeni pozisyon açma, 31 Temmuz'a kadar ertelenmelidir.

Blackout döneminin piyasa psikolojisi üzerinde önemli bir etkisi vardır. Fed yetkilileri konuşmadığında, piyasa 'bilgi açlığı' çeker. Bu, spekülasyonu artırır ve 'positioning' (pozisyon alma) hareketlerini yoğunlaştırır. 'Smart money' (kurumsal yatırımcılar), Blackout öncesi pozisyonlarını ayarlar. 'Retail' (bireysel yatırımcılar), Blackout sırasında 'FOMO' (fear of missing out) ile hareket edebilir. Bu dinamik, piyasa oynaklığını artırır. Earnings play'ler için, Blackout dönemi 'high risk, low reward' dönemidir; bu nedenle, pozisyon alma sınırlandırması hayati önemdedir.

Blackout döneminde, 'earnings' dışı makro veriler de takip edilmelidir. Özellikle, 'GDP', 'PCE', 'NFP', 'CPI' verileri, FOMC kararını etkileyebilir. Eğer bu veriler 'surprise' yaparsa (beklenenden çok farklı çıkarsa), piyasa 'repricing' yapabilir. Bu durumda, earnings play'lerin riski artar. Bu nedenle, Blackout döneminde 'macro calendar' takibi, 'earnings calendar' takibi kadar önemlidir.

### 2.2 VIX Tabanlı Risk Azaltma Protokolü

VIX (CBOE Volatility Index), piyasanın 'korku' ölçüsüdür. Earnings play'ler için VIX seviyeleri, pozisyon boyutunu ve strateji seçimini doğrudan etkiler.

| VIX Seviyesi | Rejim | Pozisyon Boyutu | Strateji Tercihi | Eylem |
|--------------|-------|-----------------|------------------|-------|
| **VIX < 15** | Ultra Low Fear | Normal boyut | Long Call/Put, Debit Spread | Agresif pozisyon alınabilir |
| **VIX 15-20** | Low Fear | Normal boyut | Debit Spread, Butterfly | Normal pozisyon alınabilir |
| **VIX 20-25** | Moderate Fear | **%50 azalt** | Butterfly, Iron Condor | Dikkatli pozisyon alınabilir |
| **VIX 25-30** | Elevated Fear | **%75 azalt** | Iron Condor, Calendar Spread | Büyük pozisyonlar kapatılır |
| **VIX 30-35** | High Fear | **%75 azalt** | Sadece Iron Condor, Cash | Büyük pozisyonlar kapatılır |
| **VIX > 35** | Extreme Fear | **%100 nakit** | Yok — nakitte kal | Tüm pozisyonlar kapatılır, 48-72 saat beklenir |

#### VIX Rejim Açıklamaları

- **VIX < 15 (Ultra Low Fear):** Piyasa 'uykuda' demektir. Earnings play'ler için ideal bir ortamdır; IV Crush potansiyeli yüksek, opsiyon primleri 'ucuz'dur. Long Call/Put stratejileri tercih edilir. Ancak, 'low VIX' ortamında, hisselerin beklenenden az hareket etmesi (underreaction) riski de vardır. Bu nedenle, 'high conviction' play'ler seçilmelidir. 'Low VIX' ortamında, 'short volatility' stratejileri (Iron Condor, Butterfly) daha riskli olabilir; çünkü VIX'in daha da düşme alanı azdır, ama yükselme alanı geniştir.
- **VIX 15-20 (Low Fear):** Mevcut durum (VIX = 16.89). Bu rejimde, piyasa 'rahat' ama 'uykulu' değildir. Debit Spread ve Butterfly stratejileri idealdir. Earnings play'ler normal boyutta açılabilir. FOMC yaklaştıkça VIX'in 20'ye doğru tırmandığı gözlenebilir; bu pozisyon boyutunu hafifçe azaltma sinyalidir. Bu rejimde, 'sell premium' (prim satmak) stratejileri (Iron Condor, Credit Spread) 'moderate risk' taşır.
- **VIX 20-25 (Moderate Fear):** Piyasa 'tedirgin' demektir. Earnings play'ler için risk artar. Butterfly ve Iron Condor gibi 'non-directional' stratejiler tercih edilir. Tek hisse pozisyonu max %1 ile sınırlandırılır. FOMC öncesi bu rejime geçiş olasıdır. 'Buy premium' (prim almak) stratejileri (Long Call/Put) 'expensive' olabilir; çünkü opsiyon primleri zaten yüksektir. Bu rejimde, 'mean reversion' (VIX'in ortalamasına dönmesi) beklentisiyle 'short volatility' stratejileri düşünülebilir.
- **VIX 25-30 (Elevated Fear):** Piyasa 'korkulu' demektir. Earnings play'ler için risk çok yüksektir. Pozisyon boyutu %50 azaltılır. Sadece 'high conviction' play'ler açılabilir ve bunlar da Iron Condor veya Calendar Spread olmalıdır. 'Cash is king' prensibi devreye girer. 'VIX spike'ları, genellikle 'short-term' (1-3 gün) sürer; bu nedenle, 'wait and see' stratejisi uygulanabilir.
- **VIX > 35 (Extreme Fear):** Piyasa 'panik' halindedir. Earnings play'ler için bu ortam 'trade edilmemeli'dir. Tüm pozisyonlar kapatılır, 48-72 saat nakitte beklenir. VIX 35+ seviyeleri, genellikle 'black swan' olayları (jeopolitik kriz, finansal kriz) ile ilişkilidir. FOMC kararı sonrası VIX'in 35+ seviyesine sıçraması olasıdır; bu durumda 'wait and see' stratejisi uygulanır. VIX 35+ seviyelerinde, 'VIX futures' (VIX'in gelecek değeri) genellikle 'contango' (VIX futures > spot VIX) yapar; bu, 'VIX'in gelecekte düşeceği' beklentisini gösterir. Ancak, 'catching a falling knife' (düşen bıçağı yakalamak) riski yüksektir; bu nedenle, 48-72 saat beklenmelidir.

VIX rejimleri, 'VIX futures term structure' (VIX futures yapısı) ile birlikte değerlendirilmelidir. 'Contango' (VIX futures > spot VIX), 'VIX'in gelecekte düşeceği' beklentisini gösterir. 'Backwardation' (VIX futures < spot VIX), 'VIX'in gelecekte yükseleceği' beklentisini gösterir. Earnings play'lerde, 'contango' ortamında 'short volatility' stratejileri (Iron Condor, Butterfly) daha güvenlidir. 'Backwardation' ortamında, 'long volatility' stratejileri (Long Call/Put, Straddle) daha güvenlidir. Ancak, 'backwardation' genellikle 'stres' dönemlerinde görülür; bu dönemlerde earnings play'ler risklidir.

### 2.3 Pozisyon ve Sektör Diversifikasyon Kuralları

| Kural | Limit | Açıklama |
|-------|-------|----------|
| **Tek Hisse Max Risk** | Hesabın %2'si | $10K hesap için tek hisse max $200 risk. $50K hesap için max $1,000 risk. |
| **Tek Sektör Max Risk** | Hesabın %15'i | $10K hesap için tek sektör max $1,500 risk. $50K hesap için max $7,500 risk. |
| **Max Açık Pozisyon** | 20 pozisyon | Aynı anda 20'den fazla pozisyon açık tutulamaz. |
| **Max Aynı Gün Earnings** | 5 pozisyon | Aynı gün açıklama yapan 5'ten fazla hisseye pozisyon açılamaz. |
| **Max Aynı Sektör Earnings** | 3 pozisyon | Aynı sektörden 3'ten fazla hisseye aynı gün pozisyon açılamaz. |
| **Max Directional Bias** | %70 | Portföyün %70'inden fazlası aynı yönde (bull veya bear) olamaz. |
| **Min Cash Reserve** | %20 | Hesabın en az %20'si her zaman nakit olarak tutulmalıdır. |

#### Diversifikasyon Kuralları Detayları

- **Tek Hisse Max %2:** Bu kural, 'tek hisse felaketi' riskini sınırlar. Eğer bir hisse earnings sonrası %20 düşerse ve pozisyon hesabın %2'si ile sınırlıysa, portföyün sadece %2'si kaybedilir. Bu, 'survival' için hayati önemdedir. Earnings play'lerin doğası gereği, tek hisse riski yüksektir; bu nedenle %2 limiti katı bir şekilde uygulanmalıdır. 'Overconfidence' (aşırı güven), trader'ların bu kuralı ihlal etmesine neden olabilir. 'I know this stock' (bu hisseyi tanıyorum) düşüncesi, en büyük tuzaktır. Her hisse, earnings sonrası 'surprise' yapabilir; bu nedenle, %2 limiti 'ego' ile değil, 'math' (matematik) ile belirlenir.
- **Tek Sektör Max %15:** Earnings sezonunda, sektörler 'korelasyon' gösterebilir (örn: tüm bankalar aynı gün düşer). Eğer tüm bankalara pozisyon açılırsa ve sektör genelinde 'risk-off' olursa, portföy ciddi zarar edebilir. %15 sektör limiti, bu korelasyon riskini sınırlar. 'Sektör korelasyonu', 'macro' faktörlerden (faiz oranları, enflasyon, jeopolitik risk) etkilenir. Eğer 'macro' faktörler negatifse, tüm sektörler aynı yönde hareket edebilir. Bu nedenle, 'cross-sector' diversifikasyon (farklı sektörlerden pozisyonlar) hayati önemdedir.
- **Max Directional Bias %70:** Portföyün tamamı 'bullish' veya 'bearish' olamaz. Piyasa 'surprise' yapabilir; eğer tüm pozisyonlar aynı yönde ise ve piyasa ters yönde hareket ederse, portföy ciddi zarar eder. En az %30 pozisyon 'hedge' (ters yönde) olmalıdır. 'Hedge' pozisyonları, 'market risk'ini azaltır. Örnek: Eğer portföyün %70'i 'bullish' ise, %30'u 'bearish' olmalıdır. Bu, 'market crash' durumunda portföyü korur. 'Hedge' pozisyonları, 'index' opsiyonları (SPY PUT, QQQ PUT) veya 'inverse' sektör pozisyonları (örn: banka CALL + tech PUT) olabilir.
- **Min Cash Reserve %20:** Earnings play'ler, 'high conviction' fırsatları için hazır nakit gerektirir. Ayrıca, beklenmedik 'margin call' veya 'assignment' durumlarında, nakit rezervi hayat kurtarır. %20 nakit, 'fırsat kapısı' için de kullanılabilir (örn: FOMC sonrası VIX spike'ında ucuz opsiyon almak). 'All-in' yapmak, earnings play'lerin en büyük hatadır. 'Cash', sadece 'güvenli' bir varlık değil, aynı zamanda 'fırsat' aracıdır. 'Patience' (sabır), 'cash' ile ödüllendirilir.

### 2.4 Earnings Haftası Pozisyon Önerileri

Earnings haftası, her gün farklı risk profiline sahiptir. Aşağıdaki tablo, Temmuz 2026 earnings sezonunun her haftası için pozisyon önerilerini sunar.

| Hafta | Tarih Aralığı | Risk Seviyesi | Max Pozisyon | Önerilen Stratejiler | Özel Kurallar |
|-------|---------------|---------------|--------------|----------------------|---------------|
| **Hafta 1** | 6–10 Temmuz | 🟢 Düşük | Normal | Long Call/Put, Debit Spread | 4 Temmuz tatili sonrası, hacim düşük olabilir. |
| **Hafta 2** | 13–17 Temmuz | 🟡 Orta | Normal | Debit Spread, Butterfly | Bankalar + UNH + BLK, sektör korelasyonu yüksek. |
| **Hafta 3** | 20–24 Temmuz | 🟠 Yüksek | **%50 azalt** | Butterfly, Iron Condor | Tech megacap + FOMC öncesi, VIX artabilir. |
| **Hafta 4** | 27–31 Temmuz | 🔴 Kritik | **%75 azalt** | Iron Condor, Cash | FOMC haftası + tech yoğunluğu, max 2 pozisyon. |

#### Earnings Haftası Özel Kuralları

- **Hafta 1 (6–10 Temmuz):** 4 Temmuz (Independence Day) tatili sonrası, piyasa hacmi düşük olabilir. İlk gün (6 Temmuz), 'holiday hangover' etkisiyle oynaklık yüksek olabilir. Earnings play'ler için 'düşük hacim' riski vardır; bu nedenle, hacim yüksek hisseler (SPY, QQQ, AAPL, MSFT) tercih edilmelidir. 'Thinly traded' hisselerden kaçınılmalıdır. Bu hafta, 'paper trade' (simülasyon) yapmak için idealdir. Gerçek pozisyonlar, Hafta 2'den itibaren açılmalıdır.
- **Hafta 2 (13–17 Temmuz):** Bankalar (JPM, BAC, C, GS, MS, WFC) ve sağlık (UNH) yoğunluğu. Bu hafta, 'sektör korelasyonu' en yüksek haftadır. JPM'nin sonuçları, tüm finansal sektörün tonunu belirler. Eğer JPM 'beat' yaptıysa, 'momentum' takip edilebilir; $BAC, $GS pozisyonları açılabilir. Eğer JPM 'miss' yaptıysa, tüm finansal pozisyonlar kapatılmalıdır. Bu hafta, 'cross-sector' hedge'ler (örn: banka CALL + tech PUT) kullanılmalıdır. Ayrıca, 'index' hedge'leri (SPY PUT, QQQ PUT) değerlendirilebilir.
- **Hafta 3 (20–24 Temmuz):** Tech megacap (TSLA, GOOGL, INTC) + FOMC öncesi. Bu hafta, 'event stacking' riski taşır. Hem tech earnings hem de FOMC beklentisi, piyasa volatilitesini artırır. Pozisyon boyutu %50 azaltılır. 'Gamma squeeze' riski yüksektir; OTM opsiyonlar 'meme stock' gibi hareket edebilir. Dikkatli olunmalıdır. Bu hafta, 'non-directional' stratejiler (Butterfly, Iron Condor) tercih edilmelidir. 'Directional' stratejiler (Long Call/Put), 'gamma riski' nedeniyle çok volatil olabilir.
- **Hafta 4 (27–31 Temmuz):** FOMC haftası + tech yoğunluğu (MSFT, META, AMZN, AAPL). Bu hafta, Temmuz'un en riskli haftasıdır. Pozisyon boyutu %75 azaltılır. Max 2 pozisyon açılabilir. FOMC kararı (29 Temmuz 14:00 EDT) öncesi, tüm pozisyonlar kapatılmalıdır. FOMC sonrası, 'knee-jerk' hareketlerden kaçınılmalıdır. 30 Temmuz'dan sonra yeni pozisyon açma ertelenmelidir. Bu hafta, 'survival' haftasıdır. 'Kâr' değil, 'hayatta kalmak' önceliktir.

### 2.5 Stop-Loss ve Kâr Alma Protokolü

| Durum | Eylem | Zamanlama |
|-------|-------|-----------|
| **Pozisyon -%30** | Stop-loss tetiklenir. Pozisyonun %50'si kapatılır. | Earnings'ten önce herhangi bir gün |
| **Pozisyon -%50** | Stop-loss tamamlanır. Pozisyonun tamamı kapatılır. | Earnings'ten önce herhangi bir gün |
| **Pozisyon +%50** | Kâr alma (take profit) — pozisyonun %50'si kapatılır. | Earnings öncesi veya earnings günü açılışta |
| **Pozisyon +%100** | Kâr alma — pozisyonun %75'si kapatılır. | Earnings öncesi veya earnings günü açılışta |
| **Pozisyon +%150** | Kâr alma — pozisyonun tamamı kapatılır. | Hemen, kâr realize edilir |
| **Earnings BMO (açılış öncesi)** | Eğer pozisyon açıksa, açılışta %50 kapatılır. | 09:30 EDT |
| **Earnings AMC (kapanış sonrası)** | Eğer pozisyon açıksa, ertesi gün açılışta %50 kapatılır. | Ertesi gün 09:30 EDT |
| **Max Hold Süresi** | Pozisyon 2 günden fazla tutulamaz. | 48 saat sonunda kapatılır |

#### Stop-Loss ve Kâr Alma Detayları

- **Pre-Earnings Stop-Loss:** Earnings'ten önce, pozisyon -%30 seviyesine düşerse, pozisyonun yarısı kapatılır. Bu, 'survival' için kritiktir. Eğer pozisyon -%50 seviyesine düşerse, tamamı kapatılır. Earnings play'lerde, 'hope' (umut) ile pozisyon tutmak en büyük hatadır. Stop-loss, duygusal karar almayı engeller. 'Discipline' (disiplin), 'stop-loss' ile başlar. 'Stop-loss' sadece bir 'risk management' aracı değil, aynı zamanda 'psychological' (psikolojik) bir korumadır. 'Hope' ile tutulan pozisyonlar, genellikle daha da kötüleşir.
- **Pre-Earnings Kâr Alma:** Eğer pozisyon +%50 kârda ise, yarısı kapatılır. Bu, 'bird in hand' prensibidir. Earnings öncesi kâr realize etmek, IV Crush riskini de azaltır. Eğer pozisyon +%100 kârda ise, %75'i kapatılır. Kalan %25, 'free roll' olarak tutulabilir (risk = 0). +%150 kârda ise pozisyon tamamen kapatılır; 'greed' (açgözlülük) en büyük düşmandır. 'Kâr alma', 'stop-loss' kadar önemlidir. 'You can't go broke taking profits' (kâr alarak batmazsın) — bu, earnings play'lerin altın kuralıdır.
- **Post-Earnings Management:** Eğer pozisyon earnings BMO (before market open) açıklanan bir hisseye sahipse, açılışta (09:30 EDT) pozisyonun yarısı kapatılır. Eğer hisse beklenen yönde hareket ediyorsa, kalan yarısı 'trailing stop' ile korunur. Eğer hisse ters yönde hareket ediyorsa, kalan yarısı da kapatılır. AMC (after market close) açıklanan hisselerde, ertesi gün açılışta aynı protokol uygulanır. 'Post-earnings' dönemde, 'gap' (açılış aralığı) riski yüksektir. Eğer hisse 'gap up' (yukarı açılış) veya 'gap down' (aşağı açılış) yaparsa, pozisyon değeri anında değişir. Bu nedenle, 'pre-market' (08:00-09:30) döneminde 'after-market' hareketleri takip etmek önemlidir.
- **Max Hold 2 Gün:** Earnings play'ler, 'max 2 gün' tutma kuralına tabidir. Bu, 'time decay' (Theta) ve 'IV crush' riskini sınırlar. Eğer pozisyon 2 gün sonra hala açıksa, kapatılır — kârda veya zararda olması fark etmez. Bu kural, 'discipline' (disiplin) gerektirir. 'Just one more day' (bir gün daha) düşüncesi, earnings play'lerin en büyük tuzaklarından biridir. 2 gün sonrasında, IV çökmüş, Theta decay hızlanmış, ve 'opportunity cost' (fırsat maliyeti) artmıştır. 'Cut your losses, let your profits run' (zararları kes, kârları bırak koşsun) — earnings play'lerde, 'let your profits run' 2 gün ile sınırlıdır.

---

## 3. Portföy Önerileri (5 Bütçe Seviyesi)

> **Not:** Aşağıdaki portföy önerileri, 'illüstratif' örneklerdir. Gerçek pozisyonlar, canlı piyasa verisi (opsiyon chain, Greeks, bid-ask spread) ile güncellenmelidir. Tüm pozisyonlar, 'max 2 gün' tutma kuralına tabidir. Entry = earnings'ten 2-5 gün önce, Exit = earnings sonrası 1-2 gün.

| Bütçe | $1K | $5K | $10K | $25K | $50K |
|-------|-----|-----|------|------|------|
| **Diversifikasyon** | 5-8 pozisyon | 8-12 pozisyon | 10-15 pozisyon | 12-18 pozisyon | 15-20 pozisyon |
| **Her Pozisyon** | ~$100-200 | ~$400-600 | ~$600-1000 | ~$1,500-2,000 | ~$2,000-3,000 |
| **Max Tek Hisse Riski** | ~$20 | ~$100 | ~$200 | ~$500 | ~$1,000 |
| **Max Tek Sektör Riski** | ~$150 | ~$750 | ~$1,500 | ~$3,750 | ~$7,500 |
| **Min Cash Reserve** | ~$200 | ~$1,000 | ~$2,000 | ~$5,000 | ~$10,000 |

### 3.1 Bütçe: $1,000 | 5-8 Pozisyon | Her Pozisyon ~$100-200

Bu bütçe seviyesi, 'beginner' trader'lar ve 'test' portföyleri için uygundur. Her pozisyon $100-200 arasındadır; toplam risk $800 civarındadır (cash reserve $200). Strateji: Ağırlıklı olarak Long Call/Put ve dar Debit Spread'ler. Tek hisse riski max $20 (hesabın %2'si) olmalıdır. Diversifikasyon, 5-8 pozisyon ile sağlanır.

#### Örnek Portföy 1A: $1K — Temmuz 2026 Early Season (Hafta 1-2)

| # | Hisse | Strateji | Yön | Maliyet | Earnings | Sektör | Kapanış Planı |
|---|-------|----------|-----|---------|----------|--------|---------------|
| 1 | $FDS | 560 CALL (Long Call) | Bullish | ~$150 | 1 Temmuz BMO | Finansal | Açılışta kapat (bugün) |
| 2 | $WFC | 58 CALL (Long Call) | Bullish | ~$120 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 3 | $JPM | 210/220 Bull Call Spread | Bullish | ~$175 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 4 | $UNH | 520/540 Bear Put Spread | Bearish | ~$180 | 16 Temmuz BMO | Sağlık | Ertesi gün 09:30 kapat |
| 5 | $NKE | 78/82 Bear Put Spread | Bearish | ~$160 | 21 Temmuz BMO | Tüketim | Ertesi gün 09:30 kapat |
| 6 | $TSLA | 260 PUT (Long Put) | Bearish | ~$130 | 22 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 7 | $GOOGL | 180/190 Bull Call Spread | Bullish | ~$170 | 22 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 8 | Cash | — | — | $95 | — | — | — |

**Toplam Maliyet:** ~$905 | **Cash Reserve:** ~$95 | **Max Risk:** ~$905 (portföyün %90.5'i) | **Sektör Dağılımı:** Finansal 3, Sağlık 1, Tüketim 1, Teknoloji 2 | **Yön Dağılımı:** Bullish 4, Bearish 3 | **Hedge Oranı:** %43

#### Örnek Portföy 1B: $1K — Temmuz 2026 Late Season (Hafta 3-4)

| # | Hisse | Strateji | Yön | Maliyet | Earnings | Sektör | Kapanış Planı |
|---|-------|----------|-----|---------|----------|--------|---------------|
| 1 | $META | 585 CALL (Long Call) | Bullish | ~$140 | 29 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 2 | $MSFT | 460/475 Bull Call Spread | Bullish | ~$165 | 29 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 3 | $AMZN | 210/225 Bull Call Spread | Bullish | ~$155 | 30 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 4 | $AAPL | 225/240 Bull Call Spread | Bullish | ~$160 | 30 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 5 | $BAC | 42/46 Bull Call Spread | Bullish | ~$120 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 6 | Cash | — | — | $260 | — | — | — |

**Toplam Maliyet:** ~$740 | **Cash Reserve:** ~$260 | **Max Risk:** ~$740 (portföyün %74'ü) | **Sektör Dağılımı:** Teknoloji 4, Finansal 1 | **Yön Dağılımı:** %100 Bullish | **Hedge Oranı:** %0 — **⚠️ UYARI:** Hedge oranı %0. Bu portföyde bearish hedge eklenmelidir (örn: $SPY PUT).

### 3.2 Bütçe: $5,000 | 8-12 Pozisyon | Her Pozisyon ~$400-600

Bu bütçe seviyesi, 'intermediate' trader'lar için uygundur. Daha geniş spread'ler, Butterfly yapıları ve çoklu hisse pozisyonları mümkündür. Tek hisse riski max $100'dür. Diversifikasyon, 8-12 pozisyon ile sağlanır. Strateji karışımı: Debit Spread, Butterfly, az miktarda Long Call/Put.

#### Örnek Portföy 2A: $5K — Temmuz 2026 Full Season (Dengeli)

| # | Hisse | Strateji | Yön | Maliyet | Earnings | Sektör | Kapanış Planı |
|---|-------|----------|-----|---------|----------|--------|---------------|
| 1 | $JPM | 210/220 Bull Call Spread (2x) | Bullish | ~$700 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 2 | $BAC | 42/46 Bull Call Spread (2x) | Bullish | ~$300 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 3 | $GS | 485/495 Bull Call Spread | Bullish | ~$450 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 4 | $UNH | 500/520/540 Long Put Butterfly | Neutral-Bearish | ~$540 | 16 Temmuz BMO | Sağlık | Ertesi gün 09:30 kapat |
| 5 | $NKE | 78/82/86 Long Call Butterfly | Neutral | ~$360 | 21 Temmuz BMO | Tüketim | Ertesi gün 09:30 kapat |
| 6 | $TSLA | 255/265/275 Long Put Butterfly | Neutral-Bearish | ~$450 | 22 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 7 | $GOOGL | 175/185/195 Long Call Butterfly | Neutral | ~$540 | 22 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 8 | $META | 570/585/600 Long Call Butterfly | Neutral | ~$480 | 29 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 9 | $MSFT | 450/465/480 Long Call Butterfly | Neutral | ~$420 | 29 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 10 | $AMZN | 200/215/230 Long Call Butterfly | Neutral | ~$360 | 30 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 11 | $AAPL | 220/235/250 Long Call Butterfly | Neutral | ~$390 | 30 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 12 | Cash | — | — | $410 | — | — | — |

**Toplam Maliyet:** ~$4,590 | **Cash Reserve:** ~$410 | **Max Risk:** ~$4,590 (portföyün %91.8'i) | **Sektör Dağılımı:** Finansal 3, Sağlık 1, Tüketim 1, Teknoloji 6 | **Yön Dağılımı:** Bullish 6, Neutral-Bearish 3, Neutral 2 | **Hedge Oranı:** %45

#### Örnek Portföy 2B: $5K — Temmuz 2026 Agresif (Directional)

| # | Hisse | Strateji | Yön | Maliyet | Earnings | Sektör | Kapanış Planı |
|---|-------|----------|-----|---------|----------|--------|---------------|
| 1 | $JPM | 210/220 Bull Call Spread (3x) | Bullish | ~$1,050 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 2 | $WFC | 58/62 Bull Call Spread (2x) | Bullish | ~$480 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 3 | $UNH | 520/540 Bear Put Spread (2x) | Bearish | ~$840 | 16 Temmuz BMO | Sağlık | Ertesi gün 09:30 kapat |
| 4 | $NKE | 78/82 Bear Put Spread (2x) | Bearish | ~$360 | 21 Temmuz BMO | Tüketim | Ertesi gün 09:30 kapat |
| 5 | $TSLA | 260/250 Bear Put Spread (2x) | Bearish | ~$560 | 22 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 6 | $META | 575/595 Bull Call Spread (2x) | Bullish | ~$900 | 29 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 7 | $AMZN | 210/225 Bull Call Spread (2x) | Bullish | ~$640 | 30 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 8 | Cash | — | — | $170 | — | — | — |

**Toplam Maliyet:** ~$4,830 | **Cash Reserve:** ~$170 | **Max Risk:** ~$4,830 (portföyün %96.6'sı) | **Sektör Dağılımı:** Finansal 2, Sağlık 1, Tüketim 1, Teknoloji 3 | **Yön Dağılımı:** Bullish 4, Bearish 3 | **Hedge Oranı:** %43

### 3.3 Bütçe: $10,000 | 10-15 Pozisyon | Her Pozisyon ~$600-1000

Bu bütçe seviyesi, 'serious' trader'lar için uygundur. Tüm strateji türleri kullanılabilir: Debit Spread, Butterfly, Iron Condor, Calendar Spread. Tek hisse riski max $200'dür. Diversifikasyon, 10-15 pozisyon ile sağlanır. Sektör ve yön çeşitliliği önemlidir. Cash reserve $2,000 olmalıdır.

#### Örnek Portföy 3A: $10K — Temmuz 2026 Full Spectrum (Dengeli)

| # | Hisse | Strateji | Yön | Maliyet | Earnings | Sektör | Kapanış Planı |
|---|-------|----------|-----|---------|----------|--------|---------------|
| 1 | $JPM | 210/220 Bull Call Spread (3x) | Bullish | ~$1,050 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 2 | $BAC | 42/46 Bull Call Spread (3x) | Bullish | ~$450 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 3 | $GS | 485/495 Bull Call Spread (2x) | Bullish | ~$900 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 4 | $BLK | 860/880 Bull Call Spread | Bullish | ~$620 | 16 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 5 | $UNH | 500/520/540 Long Put Butterfly (2x) | Neutral-Bearish | ~$1,080 | 16 Temmuz BMO | Sağlık | Ertesi gün 09:30 kapat |
| 6 | $NKE | 78/82/86 Long Call Butterfly (2x) | Neutral | ~$720 | 21 Temmuz BMO | Tüketim | Ertesi gün 09:30 kapat |
| 7 | $TSLA | 255/265/275 Long Put Butterfly (2x) | Neutral-Bearish | ~$900 | 22 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 8 | $GOOGL | 175/185/195 Long Call Butterfly (2x) | Neutral | ~$1,080 | 22 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 9 | $INTC | 22/25/28 Long Call Butterfly | Neutral | ~$480 | 23 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 10 | $META | 570/585/600 Long Call Butterfly (2x) | Neutral | ~$960 | 29 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 11 | $MSFT | 450/465/480 Long Call Butterfly (2x) | Neutral | ~$840 | 29 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 12 | $AMZN | 200/215/230 Long Call Butterfly (2x) | Neutral | ~$720 | 30 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 13 | $AAPL | 220/235/250 Long Call Butterfly (2x) | Neutral | ~$780 | 30 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 14 | Cash | — | — | $820 | — | — | — |

**Toplam Maliyet:** ~$9,180 | **Cash Reserve:** ~$820 | **Max Risk:** ~$9,180 (portföyün %91.8'i) | **Sektör Dağılımı:** Finansal 4, Sağlık 1, Tüketim 1, Teknoloji 7 | **Yön Dağılımı:** Bullish 4, Neutral 6, Neutral-Bearish 3 | **Hedge Oranı:** %69

### 3.4 Bütçe: $25,000 | 12-18 Pozisyon | Her Pozisyon ~$1,500-2,000

Bu bütçe seviyesi, 'professional' trader'lar ve 'active portfolio' yöneticileri için uygundur. Büyük yapılandırılmış pozisyonlar, çoklu expiry'ler ve karmaşık stratejiler (Ratio Spread, Calendar Spread, Iron Condor) kullanılabilir. Tek hisse riski max $500'dür. Diversifikasyon, 12-18 pozisyon ile sağlanır. Cash reserve $5,000 olmalıdır. Margin kullanımı dikkatli olmalıdır.

#### Örnek Portföy 4A: $25K — Temmuz 2026 Institutional (Dengeli)

| # | Hisse | Strateji | Yön | Maliyet | Earnings | Sektör | Kapanış Planı |
|---|-------|----------|-----|---------|----------|--------|---------------|
| 1 | $JPM | 210/220 Bull Call Spread (5x) | Bullish | ~$1,750 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 2 | $BAC | 42/46 Bull Call Spread (5x) | Bullish | ~$750 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 3 | $GS | 485/495 Bull Call Spread (3x) | Bullish | ~$1,350 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 4 | $C | 62/66 Bull Call Spread (3x) | Bullish | ~$900 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 5 | $BLK | 860/880 Bull Call Spread (2x) | Bullish | ~$1,240 | 16 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 6 | $UNH | 500/520/540 Long Put Butterfly (3x) | Neutral-Bearish | ~$1,620 | 16 Temmuz BMO | Sağlık | Ertesi gün 09:30 kapat |
| 7 | $NKE | 78/82/86 Long Call Butterfly (3x) | Neutral | ~$1,080 | 21 Temmuz BMO | Tüketim | Ertesi gün 09:30 kapat |
| 8 | $TSLA | 1x2 Ratio Put Spread (260/250) (3x) | Bearish | ~$1,620 | 22 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 9 | $GOOGL | 175/185/195 Long Call Butterfly (3x) | Neutral | ~$1,620 | 22 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 10 | $INTC | 22/25/28 Long Call Butterfly (3x) | Neutral | ~$1,440 | 23 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 11 | $META | 570/585/600 Long Call Butterfly (3x) | Neutral | ~$1,440 | 29 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 12 | $MSFT | 450/465/480 Long Call Butterfly (3x) | Neutral | ~$1,260 | 29 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 13 | $AMZN | 200/215/230 Long Call Butterfly (3x) | Neutral | ~$1,080 | 30 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 14 | $AAPL | 220/235/250 Long Call Butterfly (3x) | Neutral | ~$1,170 | 30 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 15 | Cash | — | — | $4,680 | — | — | — |

**Toplam Maliyet:** ~$20,320 | **Cash Reserve:** ~$4,680 | **Max Risk:** ~$20,320 (portföyün %81.3'ü) | **Sektör Dağılımı:** Finansal 5, Sağlık 1, Tüketim 1, Teknoloji 7 | **Yön Dağılımı:** Bullish 5, Neutral 7, Neutral-Bearish 1 | **Hedge Oranı:** %53

### 3.5 Bütçe: $50,000 | 15-20 Pozisyon | Her Pozisyon ~$2,000-3,000

Bu bütçe seviyesi, 'institutional' ve 'high-net-worth' trader'lar için uygundur. Tüm strateji türleri, çoklu yapılandırılmış pozisyonlar ve 'ladder' stratejileri kullanılabilir. Tek hisse riski max $1,000'dır. Diversifikasyon, 15-20 pozisyon ile sağlanır. Cash reserve $10,000 olmalıdır. Margin kullanımı dikkatli olmalıdır; 'naked' pozisyonlar (Ratio Spread naked side) max $2,000 risk ile sınırlıdır.

#### Örnek Portföy 5A: $50K — Temmuz 2026 Ultra-Diversified (Dengeli)

| # | Hisse | Strateji | Yön | Maliyet | Earnings | Sektör | Kapanış Planı |
|---|-------|----------|-----|---------|----------|--------|---------------|
| 1 | $JPM | 210/220 Bull Call Spread (8x) | Bullish | ~$2,800 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 2 | $BAC | 42/46 Bull Call Spread (8x) | Bullish | ~$1,200 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 3 | $GS | 485/495 Bull Call Spread (5x) | Bullish | ~$2,250 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 4 | $C | 62/66 Bull Call Spread (5x) | Bullish | ~$1,500 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 5 | $MS | 95/100 Bull Call Spread (4x) | Bullish | ~$1,200 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 6 | $WFC | 58/62 Bull Call Spread (5x) | Bullish | ~$1,200 | 15 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 7 | $BLK | 860/880 Bull Call Spread (4x) | Bullish | ~$2,480 | 16 Temmuz BMO | Finansal | Ertesi gün 09:30 kapat |
| 8 | $UNH | 500/520/540 Long Put Butterfly (5x) | Neutral-Bearish | ~$2,700 | 16 Temmuz BMO | Sağlık | Ertesi gün 09:30 kapat |
| 9 | $NKE | 78/82/86 Long Call Butterfly (5x) | Neutral | ~$1,800 | 21 Temmuz BMO | Tüketim | Ertesi gün 09:30 kapat |
| 10 | $TSLA | 1x2 Ratio Put Spread (260/250) (5x) | Bearish | ~$2,700 | 22 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 11 | $GOOGL | 175/185/195 Long Call Butterfly (5x) | Neutral | ~$2,700 | 22 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 12 | $INTC | 22/25/28 Long Call Butterfly (5x) | Neutral | ~$2,400 | 23 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 13 | $META | 570/585/600 Long Call Butterfly (5x) | Neutral | ~$2,400 | 29 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 14 | $MSFT | 450/465/480 Long Call Butterfly (5x) | Neutral | ~$2,100 | 29 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 15 | $AMZN | 200/215/230 Long Call Butterfly (5x) | Neutral | ~$1,800 | 30 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 16 | $AAPL | 220/235/250 Long Call Butterfly (5x) | Neutral | ~$1,950 | 30 Temmuz AMC | Teknoloji | Ertesi gün 09:30 kapat |
| 17 | Cash | — | — | $10,420 | — | — | — |

**Toplam Maliyet:** ~$39,580 | **Cash Reserve:** ~$10,420 | **Max Risk:** ~$39,580 (portföyün %79.2'si) | **Sektör Dağılımı:** Finansal 7, Sağlık 1, Tüketim 1, Teknoloji 6 | **Yön Dağılımı:** Bullish 7, Neutral 6, Neutral-Bearish 1 | **Hedge Oranı:** %41

#### Portföy Önerileri — Genel Uyarılar

- **Bütçe Uyumu:** Yukarıdaki örnekler, 'illüstratif' maliyetlerdir. Gerçek pozisyonlar, canlı piyasa bid-ask spread'ine göre kurulmalıdır. 'Slippage' (doldurma kayması) riski, büyük pozisyonlarda daha yüksektir. Limit order kullanımı zorunludur.
- **Sektör Diversifikasyonu:** Tüm portföylerde, 'sektör korelasyonu' riski göz önünde bulundurulmalıdır. Özellikle bankalar (Hafta 2) ve tech megacap (Hafta 3-4) aynı haftada earnings açıklıyorsa, sektör riski artar. Bu durumda, 'cross-sector' hedge'ler (örn: Enerji, Utilities) eklenmelidir.
- **Yön Diversifikasyonu:** Portföyün en az %30'u 'hedge' (ters yönde) olmalıdır. Eğer piyasa 'surprise' yaparsa (örn: FOMC 'hawkish' çıkarsa ve tüm tech düşerse), hedge pozisyonlar portföyü korur. 'Max directional bias %70' kuralı katı şekilde uygulanmalıdır.
- **Cash Reserve:** Her bütçe seviyesinde, min %20 cash reserve tutulmalıdır. Bu, 'fırsat kapıları' için (örn: FOMC sonrası VIX spike) ve beklenmedik margin call'lar için kullanılır. 'All-in' yapmak, earnings play'lerin en büyük hatadır.

---

## 4. Haftalık Eylem Planı (Temmuz 2026)

> **Genel Prensip:** Her gün, 'pre-market' (08:00-09:30 EDT) ve 'after-market' (16:00-20:00 EDT) analizi yapılır. Earnings play'ler, 'market hours' (09:30-16:00 EDT) içinde kurulur ve kapatılır. 'Max hold 2 gün' kuralı her pozisyon için geçerlidir.

### 4.1 Hafta 1: 6–10 Temmuz | Early Earnings, Pozisyon Hazırlığı

Bu hafta, Temmuz earnings sezonunun 'prova' haftasıdır. 4 Temmuz (Independence Day) tatili sonrası, piyasa hacmi düşük olabilir. Earnings yoğunluğu azdır; büyük isimler yoktur. Bu hafta, 'pozisyon hazırlığı' ve 'watchlist' oluşturma haftasıdır. Ayrıca, 'paper trade' (simülasyon) yapmak için ideal bir haftadır.

| Gün | Tarih | Etkinlik | Eylem | Saat (EDT) | Öncelik |
|-----|-------|----------|-------|------------|---------|
| **Pazartesi** | 6 Temmuz | Holiday Hangover, hacim düşük | Pre-market: VIX, futures, haber akışı kontrolü. Earnings: $LEVI, $PSMT. Pozisyon: Yok. | 08:00-09:30 | 🟡 Düşük |
| **Salı** | 7 Temmuz | Early earnings start | Pre-market: $LEVI BMO analizi. Eğer 'high conviction' varsa, small Long Call/Put. Market: $LEVI pozisyon kurulumu (max $100). | 08:00-16:00 | 🟡 Düşük |
| **Çarşamba** | 8 Temmuz | Watchlist building | Pre-market: $MSM BMO analizi (geçmiş — 1 Temmuz). $LEVI pozisyonu kapat (varsa). Market: Watchlist güncelle — Hafta 2 bankalar için hazırlık. | 08:00-16:00 | 🟡 Düşük |
| **Perşembe** | 9 Temmuz | Position prep | Pre-market: $FAST BMO analizi. $LEVI pozisyonu kapat (varsa). Market: Hafta 2 pozisyonları için 'pre-analysis' — $JPM, $BAC, $GS, $WFC teknik ve haber analizi. | 08:00-16:00 | 🟡 Düşük |
| **Cuma** | 10 Temmuz | Weekly recap | Pre-market: $FAST pozisyonu kapat (varsa). Market: Hafta 1 recap — kazanç/zarar analizi, dersler. Hafta 2 pozisyonları için 'pre-entry' planlama. | 08:00-16:00 | 🟡 Düşük |

#### Hafta 1 Detaylı Günlük Protokol

**6 Temmuz (Pazartesi) — Holiday Hangover:**
- 08:00 EDT: Pre-market futures kontrolü (ES, NQ, YM). Eğer futures ±0.5%'den fazla hareket etmişse, 'gap fade' stratejisi düşünülebilir.
- 08:30 EDT: VIX kontrolü. VIX >20 ise, pozisyon açma ertelenir. VIX <15 ise, 'aggressive' pozisyonlar düşünülebilir.
- 09:30 EDT: Market açılışı. Hacim kontrolü — eğer hacim 'normal' seviyenin %70'inden düşükse, 'thin market' riski vardır; pozisyon açma ertelenir.
- 10:00-16:00 EDT: Earnings takvimi kontrolü — $LEVI, $PSMT. Eğer 'high conviction' varsa, small Long Call/Put (max $100).
- 16:00 EDT: Market kapanışı. Gün sonu raporu — VIX, SPY, QQQ, XLF kapanış değerleri. Hafta 2 pozisyonları için 'pre-analysis' başlatılır.

**7-10 Temmuz (Salı-Cuma) — Early Earnings + Prep:**
- Her gün 08:00 EDT: Pre-market futures, VIX, haber akışı kontrolü.
- Her gün 09:30 EDT: Market açılışı, hacim kontrolü.
- Her gün 10:00-16:00 EDT: Earnings takvimi kontrolü, pozisyon kurulumu (varsa), mevcut pozisyon yönetimi.
- Her gün 16:00 EDT: Market kapanışı, gün sonu raporu.
- 10 Temmuz Cuma: Hafta 1 recap — kazanç/zarar analizi, dersler, Hafta 2 'pre-entry' planlama.

#### Hafta 1 — Özel Kurallar

- **4 Temmuz Tatili Etkisi:** 6 Temmuz Pazartesi, 'holiday hangover' etkisiyle oynaklık yüksek olabilir. 'Thin market' riski vardır. Büyük pozisyonlardan kaçınılmalıdır.
- **Paper Trade Haftası:** Bu hafta, 'paper trade' (simülasyon) yapmak için idealdir. Yeni stratejiler test edilebilir, 'journal' tutulabilir, 'lessons learned' belgelenebilir. Gerçek pozisyonlar, Hafta 2'den itibaren açılmalıdır.
- **Watchlist Oluşturma:** Hafta 2-4 için 'watchlist' oluşturulmalıdır. Her hisse için: earnings tarihi, expected move, IV Rank, teknik seviyeler (support/resistance), haber akışı, 'conviction' seviyesi (1-5).

### 4.2 Hafta 2: 13–17 Temmuz | Bankalar, UNH, BLK, GE — Büyük Açılış

Bu hafta, Temmuz earnings sezonunun 'gerçek' başlangıcıdır. Bankalar (JPM, BAC, C, GS, MS, WFC), sağlık (UNH), finansal (BLK, GE) yoğunluğu. Bu hafta, 'sektör korelasyonu' en yüksek haftadır. JPM'nin sonuçları, tüm finansal sektörün tonunu belirler. UNH, sağlık sektörünün 'bellwether'idir. BLK, varlık yönetimi sektörünün lideridir. Bu hafta, pozisyon boyutu normaldir; ancak sektör limiti (%15) katı şekilde uygulanmalıdır.

| Gün | Tarih | Etkinlik | Eylem | Saat (EDT) | Öncelik |
|-----|-------|----------|-------|------------|---------|
| **Pazartesi** | 13 Temmuz | Pre-week setup | Pre-market: $JPM, $BAC, $GS, $WFC pre-analysis. Market: Pozisyon kurulumu — $JPM Bull Call Spread, $BAC Bull Call Spread. Max risk: hesabın %2'si. | 08:00-16:00 | 🔴 Yüksek |
| **Salı** | 14 Temmuz | Bankalar BMO | Pre-market: $JPM, $WFC earnings açıklaması. 09:30: Ertesi gün açılış — pozisyonun %50'si kapatılır. Market: $C, $GS pozisyon kurulumu (eğer $JPM 'beat' yaptıysa). | 08:00-16:00 | 🔴 Yüksek |
| **Çarşamba** | 15 Temmuz | Bankalar + BLK | Pre-market: $BAC, $C, $GS earnings. 09:30: Ertesi gün açılış — pozisyonların %50'si kapatılır. Market: $BLK pozisyon kurulumu. $UNH pozisyonu için 'pre-entry' planlama. | 08:00-16:00 | 🔴 Yüksek |
| **Perşembe** | 16 Temmuz | UNH + GE | Pre-market: $UNH, $GE earnings. 09:30: Ertesi gün açılış — pozisyonların %50'si kapatılır. Market: Hafta 2 recap. Hafta 3 pozisyonları için 'pre-entry' planlama. | 08:00-16:00 | 🔴 Yüksek |
| **Cuma** | 17 Temmuz | Weekly recap | Pre-market: $GE pozisyonu kapat (varsa). Market: Hafta 2 recap — kazanç/zarar analizi. 'Lessons learned' — bankaların korelasyonu, UNH'nin sektör etkisi. Hafta 3 pozisyonları için 'pre-analysis'. | 08:00-16:00 | 🟡 Orta |

#### Hafta 2 Detaylı Günlük Protokol

**13 Temmuz (Pazartesi) — Pre-Week Setup:**
- 08:00 EDT: Pre-market futures, VIX, haber akışı kontrolü. VIX >20 ise, pozisyon boyutu %50 azaltılır.
- 08:30 EDT: $JPM, $BAC, $GS, $WFC pre-analysis — EPS consensus, revenue consensus, guidance expectation, teknik seviyeler (support/resistance), IV Rank.
- 09:30 EDT: Market açılışı. $JPM ve $BAC pozisyonları kurulur. Bull Call Spread veya Long Call. Max risk: hesabın %2'si.
- 10:00-16:00 EDT: Pozisyon yönetimi — stop-loss ve kâr alma seviyeleri belirlenir. $WFC ve $GS için 'pre-entry' planlama.
- 16:00 EDT: Market kapanışı. Gün sonu raporu — pozisyon durumu, VIX, SPY, QQQ, XLF (finansal sektör ETF) kapanış değerleri.

**14 Temmuz (Salı) — Bankalar BMO:**
- 06:00-08:00 EDT: $JPM, $WFC earnings açıklaması. EPS, revenue, guidance analizi. 'Beat' veya 'miss' belirlenir.
- 08:00 EDT: Pre-market futures, VIX reaksiyonu. Eğer $JPM 'beat' yaptıysa, XLF futures yükselir; $C ve $GS pozisyonları kurulabilir. Eğer $JPM 'miss' yaptıysa, XLF futures düşer; mevcut pozisyonlar kapatılır.
- 09:30 EDT: Market açılışı. $JPM ve $WFC pozisyonlarının %50'si kapatılır. Kalan %50, 'trailing stop' ile korunur.
- 10:00-16:00 EDT: $C ve $GS pozisyon kurulumu (eğer $JPM 'beat' yaptıysa ve XLF yükseliyorsa). Eğer $JPM 'miss' yaptıysa, yeni pozisyon açılmaz; mevcut pozisyonlar kapatılır.
- 16:00 EDT: Market kapanışı. Gün sonu raporu — $JPM, $WFC, XLF, KRE (regional banks ETF) kapanış değerleri.

**15 Temmuz (Çarşamba) — Bankalar + BLK:**
- 06:00-08:00 EDT: $BAC, $C, $GS earnings açıklaması. EPS, revenue, guidance analizi.
- 08:00 EDT: Pre-market futures, VIX reaksiyonu. $BAC ve $C pozisyonları için 'post-earnings' planlama.
- 09:30 EDT: Market açılışı. $BAC, $C, $GS pozisyonlarının %50'si kapatılır. $BLK pozisyonu kurulur (Bull Call Spread veya Long Call).
- 10:00-16:00 EDT: Pozisyon yönetimi. $UNH için 'pre-entry' planlama — teknik seviyeler, IV Rank, expected move.
- 16:00 EDT: Market kapanışı. Gün sonu raporu.

**16 Temmuz (Perşembe) — UNH + GE:**
- 06:00-08:00 EDT: $UNH, $GE earnings açıklaması. EPS, revenue, guidance analizi.
- 08:00 EDT: Pre-market futures, VIX reaksiyonu. $UNH ve $GE pozisyonları için 'post-earnings' planlama.
- 09:30 EDT: Market açılışı. $UNH ve $GE pozisyonlarının %50'si kapatılır. Kalan %50, 'trailing stop' ile korunur.
- 10:00-16:00 EDT: Hafta 2 recap — kazanç/zarar analizi. Hafta 3 pozisyonları için 'pre-entry' planlama. $TSLA, $GOOGL, $INTC pre-analysis.
- 16:00 EDT: Market kapanışı. Gün sonu raporu.

**17 Temmuz (Cuma) — Weekly Recap:**
- 08:00 EDT: Pre-market futures, VIX kontrolü.
- 09:30 EDT: Market açılışı. $GE pozisyonu kapat (varsa).
- 10:00-16:00 EDT: Hafta 2 recap — 'lessons learned'. Bankaların korelasyonu analizi: $JPM 'beat' yaptığında, $BAC ve $GS ne kadar yükseldi? $JPM 'miss' yaptığında, ne kadar düştü? UNH'nin sektör etkisi: $UNH düştüğünde, $JNJ, $PFE, $ABBV ne kadar etkilendi?
- 16:00 EDT: Market kapanışı. Hafta 3 pozisyonları için 'pre-analysis': $TSLA, $GOOGL, $INTC, $META, $MSFT, $AMZN, $AAPL.

#### Hafta 2 — Özel Kurallar

- **Sektör Korelasyonu:** Bankalar, 'sektör korelasyonu' en yüksek sektördür. JPM'nin sonuçları, tüm finansal sektörü etkiler. Bu nedenle, aynı sektörden max 3 pozisyon açılmalıdır. Eğer JPM 'beat' yaptıysa, 'momentum' takip edilebilir; $BAC, $GS pozisyonları açılabilir. Eğer JPM 'miss' yaptıysa, tüm finansal pozisyonlar kapatılmalıdır.
- **BLK Etkisi:** BLK, varlık yönetimi sektörünün lideridir. BLK'nin sonuçları, 'active management' ve 'ETF flows' hakkında bilgi verir. Eğer BLK 'beat' yaptıysa, finansal sektör genelinde 'risk-on' momentum artar. Eğer BLK 'miss' yaptıysa, 'risk-off' başlayabilir.
- **UNH Etkisi:** UNH, sağlık sektörünün 'bellwether'idir. UNH'nin sonuçları, Medicare Advantage, Medicaid, ve 'value-based care' trendleri hakkında bilgi verir. Eğer UNH 'beat' yaptıysa, sağlık sektörü (JNJ, PFE, ABT, TMO) genelinde pozitif momentum oluşabilir. Eğer UNH 'miss' yaptıysa, sağlık sektörü genelinde negatif baskı oluşabilir.

### 4.3 Hafta 3: 20–24 Temmuz | Tech Megacap, FOMC Öncesi %50 Azalt

Bu hafta, Temmuz earnings sezonunun 'en yoğun' haftasıdır. Tech megacap (TSLA, GOOGL, INTC) earnings açıklar. Aynı zamanda, FOMC toplantısına (28-29 Temmuz) 1 hafta kalmıştır. 'Event stacking' riski yüksektir: hem tech earnings hem de FOMC beklentisi, piyasa volatilitesini artırır. VIX, bu hafta 20-25 aralığına tırmanabilir. Pozisyon boyutu %50 azaltılır. 'Gamma squeeze' riski yüksektir; OTM opsiyonlar 'meme stock' gibi hareket edebilir. Dikkatli olunmalıdır.

| Gün | Tarih | Etkinlik | Eylem | Saat (EDT) | Öncelik |
|-----|-------|----------|-------|------------|---------|
| **Pazartesi** | 20 Temmuz | Tech prep + FOMC countdown | Pre-market: $TSLA, $GOOGL pre-analysis. VIX kontrolü — VIX >20 ise pozisyon boyutu %50 azaltılır. Market: $TSLA pozisyon kurulumu (max risk normalin %50'si). | 08:00-16:00 | 🔴 Yüksek |
| **Salı** | 21 Temmuz | NKE BMO + TSLA/GOOGL prep | Pre-market: $NKE earnings. 09:30: $NKE pozisyonu kapat. Market: $TSLA, $GOOGL pozisyon kurulumu (max risk normalin %50'si). $INTC pre-analysis. | 08:00-16:00 | 🔴 Yüksek |
| **Çarşamba** | 22 Temmuz | TSLA + GOOGL AMC | Pre-market: $TSLA, $GOOGL pozisyon son kontrolü. Market: $TSLA, $GOOGL pozisyonları 'final review'. 16:00: Market kapanış. 16:05-20:00: $TSLA, $GOOGL earnings açıklaması beklenir. | 08:00-20:00 | 🔴🔴 Kritik |
| **Perşembe** | 23 Temmuz | INTC AMC + Post-TSLA/GOOGL | 09:30: $TSLA, $GOOGL pozisyonlarının %50'si kapatılır. Market: $INTC pozisyon kurulumu (max risk normalin %50'si). $META, $MSFT, $AMZN, $AAPL pre-analysis. | 08:00-16:00 | 🔴 Yüksek |
| **Cuma** | 24 Temmuz | Weekly recap + FOMC prep | 09:30: $INTC pozisyonu kapat. Market: Hafta 3 recap. FOMC öncesi 'cash raise' — pozisyonların %50'si kapatılır. Kalan pozisyonlar, FOMC kararına (29 Temmuz) kadar 'trailing stop' ile korunur. | 08:00-16:00 | 🔴 Yüksek |

#### Hafta 3 Detaylı Günlük Protokol

**20 Temmuz (Pazartesi) — Tech Prep + FOMC Countdown:**
- 08:00 EDT: Pre-market futures, VIX, haber akışı kontrolü. VIX >20 ise, pozisyon boyutu %50 azaltılır. VIX >25 ise, pozisyon açma ertelenir.
- 08:30 EDT: $TSLA, $GOOGL pre-analysis — EPS consensus, revenue consensus, guidance expectation, teknik seviyeler, IV Rank, expected move, 'whisper number'.
- 09:30 EDT: Market açılışı. $TSLA pozisyonu kurulur (max risk normalin %50'si). Strateji: Butterfly veya Iron Condor (directional risk'i azaltmak için).
- 10:00-16:00 EDT: Pozisyon yönetimi. $GOOGL için 'pre-entry' planlama. $INTC pre-analysis.
- 16:00 EDT: Market kapanışı. Gün sonu raporu — VIX, SPY, QQQ, TSLA, GOOGL kapanış değerleri. FOMC countdown: 8 gün kaldı.

**21 Temmuz (Salı) — NKE BMO + TSLA/GOOGL Prep:**
- 06:00-08:00 EDT: $NKE earnings açıklaması. EPS, revenue, guidance analizi. 'Beat' veya 'miss' belirlenir.
- 08:00 EDT: Pre-market futures, VIX reaksiyonu. $NKE pozisyonu için 'post-earnings' planlama.
- 09:30 EDT: Market açılışı. $NKE pozisyonu kapatılır. $TSLA ve $GOOGL pozisyonları kurulur (max risk normalin %50'si).
- 10:00-16:00 EDT: Pozisyon yönetimi. $INTC için 'pre-entry' planlama. $META, $MSFT, $AMZN, $AAPL pre-analysis başlatılır.
- 16:00 EDT: Market kapanışı. Gün sonu raporu.

**22 Temmuz (Çarşamba) — TSLA + GOOGL AMC (Kritik Gün):**
- 08:00 EDT: Pre-market futures, VIX kontrolü. $TSLA ve $GOOGL pozisyonları 'final review'. Stop-loss ve kâr alma seviyeleri belirlenir.
- 09:30 EDT: Market açılışı. $TSLA ve $GOOGL pozisyonları 'monitor' edilir. Eğer pozisyonlar +%50 kârda ise, yarısı kapatılır.
- 10:00-16:00 EDT: Pozisyon yönetimi. 'Pre-earnings' son saatler — hacim ve oynaklık artar. 'Slippage' riski yüksektir; limit order kullanımı zorunludur.
- 16:00 EDT: Market kapanışı. $TSLA (16:00) ve $GOOGL (16:30) earnings açıklaması beklenir.
- 16:00-20:00 EDT: After-market earnings analizi. $TSLA ve $GOOGL sonuçları, EPS, revenue, guidance. 'Beat' veya 'miss' belirlenir. After-market fiyat hareketi analizi.

**23 Temmuz (Perşembe) — INTC AMC + Post-TSLA/GOOGL:**
- 06:00-08:00 EDT: After-market recap. $TSLA ve $GOOGL after-market hareketi analizi. 'Gap up' veya 'gap down' beklentisi.
- 08:00 EDT: Pre-market futures, VIX reaksiyonu. $TSLA ve $GOOGL pozisyonları için 'post-earnings' planlama.
- 09:30 EDT: Market açılışı. $TSLA ve $GOOGL pozisyonlarının %50'si kapatılır. $INTC pozisyonu kurulur (max risk normalin %50'si).
- 10:00-16:00 EDT: Pozisyon yönetimi. $META, $MSFT, $AMZN, $AAPL pre-analysis devam eder.
- 16:00 EDT: Market kapanışı. $INTC earnings açıklaması beklenir (AMC).

**24 Temmuz (Cuma) — Weekly Recap + FOMC Prep:**
- 06:00-08:00 EDT: $INTC after-market recap.
- 08:00 EDT: Pre-market futures, VIX kontrolü. FOMC öncesi 'cash raise' planlaması.
- 09:30 EDT: Market açılışı. $INTC pozisyonu kapatılır. Mevcut tüm pozisyonların %50'si kapatılır. Kalan pozisyonlar, 'trailing stop' ile korunur.
- 10:00-16:00 EDT: Hafta 3 recap — kazanç/zarar analizi. 'Lessons learned': TSLA ve GOOGL'nin 'meme stock' hareketleri, 'gamma squeeze' etkisi. FOMC öncesi 'risk-off' pozisyonlaması.
- 16:00 EDT: Market kapanışı. FOMC countdown: 4 gün kaldı. Blackout dönemi başlıyor (26 Temmuz Cumartesi).

#### Hafta 3 — Özel Kurallar

- **FOMC Öncesi %50 Azaltma:** 24 Temmuz Cuma günü, tüm pozisyonların %50'si kapatılır. Bu, FOMC 'event risk'ini azaltır. Kalan pozisyonlar, 'trailing stop' ile korunur. 25-27 Temmuz arasında, yeni pozisyon açılması **yasaktır**.
- **Gamma Squeeze Riski:** TSLA ve GOOGL, 'gamma squeeze' riski taşıyan hisselerdir. Eğer OTM opsiyon hacmi çok yüksekse, 'delta hedging' etkisiyle hisse fiyatı 'expected move'un çok ötesine hareket edebilir. Bu durumda, Butterfly ve Iron Condor pozisyonları max loss'a ulaşabilir. Bu riski yönetmek için, 'wider wing' Butterfly'ler veya 'further OTM' Iron Condor'lar kullanılmalıdır.
- **Tech Korelasyonu:** TSLA, GOOGL, INTC — bu üç hisse, 'tech sentiment' belirler. Eğer TSLA 'beat' yaptıysa, GOOGL ve INTC pozisyonlarında 'positive bias' oluşabilir. Eğer TSLA 'miss' yaptıysa, 'negative bias' oluşabilir. Bu korelasyon, pozisyon yönetiminde dikkate alınmalıdır.

### 4.4 Hafta 4: 27–31 Temmuz | FOMC Haftası, Tech Yoğunluğu

Bu hafta, Temmuz earnings sezonunun 'en riskli' haftasıdır. FOMC toplantısı (28-29 Temmuz) + tech megacap (MSFT, META, AMZN, AAPL) earnings. 'Event stacking' en yüksek seviyededir. VIX, bu hafta 25-30 aralığına tırmanabilir. Blackout dönemi (18-30 Temmuz) devam eder. Pozisyon boyutu %75 azaltılır. Max 2 pozisyon açılabilir. FOMC kararı (29 Temmuz 14:00 EDT) öncesi, tüm pozisyonlar kapatılmalıdır.

| Gün | Tarih | Etkinlik | Eylem | Saat (EDT) | Öncelik |
|-----|-------|----------|-------|------------|---------|
| **Pazartesi** | 27 Temmuz | FOMC Gün 1 + MSFT/META prep | Pre-market: VIX kontrolü — VIX >25 ise tüm pozisyonlar kapatılır. Market: $MSFT, $META pozisyon kurulumu (max 2 pozisyon, max risk normalin %25'i). Blackout dönemi — yeni pozisyon açma sınırlandırılır. | 08:00-16:00 | 🔴🔴 Kritik |
| **Salı** | 28 Temmuz | FOMC Gün 2 | Pre-market: FOMC kararı beklentisi. Market: Tüm pozisyonların %50'si kapatılır (14:00 öncesi). 14:00: FOMC kararı açıklanır. 14:30: Powell basın toplantısı. 14:00-16:00: **Trade yasaktır**. | 08:00-16:00 | 🔴🔴 Kritik |
| **Çarşamba** | 29 Temmuz | FOMC Karar + MSFT/META AMC | 09:30: FOMC sonrası 'knee-jerk' reaksiyon. **Trade yasaktır** (09:30-11:00). 11:00-16:00: Piyasa 'settle' olduktan sonra, $MSFT, $META pozisyonları 'review'. 16:00: Market kapanış. 16:05-20:00: $MSFT, $META earnings beklenir. | 08:00-20:00 | 🔴🔴 Kritik |
| **Perşembe** | 30 Temmuz | AMZN + AAPL AMC | 09:30: $MSFT, $META pozisyonlarının %50'si kapatılır. Market: $AMZN, $AAPL pozisyon kurulumu (max 2 pozisyon, max risk normalin %25'i). Blackout bitişi — Fed yetkilileri konuşmaya başlar. | 08:00-16:00 | 🔴 Yüksek |
| **Cuma** | 31 Temmuz | Monthly close + Ağustos prep | 09:30: $AMZN, $AAPL pozisyonları kapatılır. Market: Temmuz ayı kapanışı — kazanç/zarar analizi. Ağustos 2026 earnings takvimi ve strateji planlaması. | 08:00-16:00 | 🟡 Orta |

#### Hafta 4 Detaylı Günlük Protokol

**27 Temmuz (Pazartesi) — FOMC Gün 1 + MSFT/META Prep:**
- 08:00 EDT: Pre-market futures, VIX kontrolü. VIX >25 ise, **tüm pozisyonlar kapatılır**. VIX 20-25 arası ise, pozisyon boyutu %75 azaltılır. VIX <20 ise, pozisyon boyutu %50 azaltılır (FOMC yaklaştıkça VIX artar).
- 08:30 EDT: $MSFT, $META pre-analysis — EPS consensus, revenue consensus, guidance expectation, teknik seviyeler, IV Rank, expected move. Blackout dönemi — Fed yetkilileri konuşmuyor; piyasa 'spekülasyon' modunda.
- 09:30 EDT: Market açılışı. $MSFT ve $META pozisyonları kurulur (max 2 pozisyon, max risk normalin %25'i). Strateji: Iron Condor veya Butterfly (directional risk'i minimize etmek için).
- 10:00-16:00 EDT: Pozisyon yönetimi. 'Tight stop-loss' — pozisyon -%20 seviyesinde kapatılır. FOMC Gün 1 — piyasa oynaklığı artar.
- 16:00 EDT: Market kapanışı. Gün sonu raporu — VIX, SPY, QQQ, MSFT, META kapanış değerleri. FOMC countdown: 1 gün kaldı.

**28 Temmuz (Salı) — FOMC Gün 2:**
- 08:00 EDT: Pre-market futures, VIX kontrolü. FOMC kararı beklentisi — 'hawkish', 'dovish', veya 'neutral'.
- 09:30 EDT: Market açılışı. Tüm pozisyonların %50'si kapatılır (14:00 FOMC kararı öncesi). Kalan %50, 'trailing stop' ile korunur. **14:00 öncesi, tüm pozisyonlar kapatılmalıdır.**
- 10:00-14:00 EDT: Pozisyon yönetimi. 'Pre-FOMC' son saatler — hacim ve oynaklık artar. 'Slippage' riski yüksektir; limit order kullanımı zorunludur.
- 14:00 EDT: FOMC kararı açıklanır. Fed funds rate kararı, 'dot plot', economic projections. Piyasa 'knee-jerk' reaksiyon verir.
- 14:30-16:00 EDT: Powell basın toplantısı. Dil tonu ('hawkish' vs 'dovish') piyasayı hareket ettirir. **Bu dönemde trade yasaktır.**
- 16:00 EDT: Market kapanışı. Gün sonu raporu — FOMC kararı özet, piyasa reaksiyonu, VIX spike analizi.

**29 Temmuz (Çarşamba) — FOMC Karar + MSFT/META AMC:**
- 08:00 EDT: Pre-market futures, VIX kontrolü. FOMC sonrası 'overnight' reaksiyon analizi. Eğer VIX 35+ ise, **tüm pozisyonlar kapatılır, 48 saat nakit beklenir.**
- 09:30 EDT: Market açılışı. **09:30-11:00 arası trade yasaktır** — 'knee-jerk' reaksiyon devam eder. 11:00-16:00: Piyasa 'settle' olduktan sonra, $MSFT ve $META pozisyonları 'review'.
- 10:00-16:00 EDT: Eğer FOMC 'dovish' çıktıysa ve piyasa 'risk-on' modundaysa, $MSFT ve $META pozisyonları 'hold' edilir. Eğer FOMC 'hawkish' çıktıysa ve piyasa 'risk-off' modundaysa, pozisyonlar kapatılır.
- 16:00 EDT: Market kapanışı. $MSFT (16:00) ve $META (16:05) earnings açıklaması beklenir.
- 16:00-20:00 EDT: After-market earnings analizi. $MSFT ve $META sonuçları, EPS, revenue, guidance, AI monetization updates.

**30 Temmuz (Perşembe) — AMZN + AAPL AMC:**
- 06:00-08:00 EDT: After-market recap. $MSFT ve $META after-market hareketi analizi.
- 08:00 EDT: Pre-market futures, VIX reaksiyonu. $MSFT ve $META pozisyonları için 'post-earnings' planlama.
- 09:30 EDT: Market açılışı. $MSFT ve $META pozisyonlarının %50'si kapatılır. $AMZN ve $AAPL pozisyonları kurulur (max 2 pozisyon, max risk normalin %25'i). Blackout bitişi — Fed yetkilileri konuşmaya başlar; 'Fed speakers' günü.
- 10:00-16:00 EDT: Pozisyon yönetimi. $AMZN ve $AAPL pozisyonları 'tight stop-loss' ile korunur.
- 16:00 EDT: Market kapanışı. $AMZN (16:00) ve $AAPL (16:30) earnings açıklaması beklenir.

**31 Temmuz (Cuma) — Monthly Close + Ağustos Prep:**
- 06:00-08:00 EDT: $AMZN ve $AAPL after-market recap.
- 08:00 EDT: Pre-market futures, VIX kontrolü. Temmuz ayı kapanışı.
- 09:30 EDT: Market açılışı. $AMZN ve $AAPL pozisyonları kapatılır. Mevcut tüm pozisyonlar kapatılır.
- 10:00-16:00 EDT: Temmuz ayı kapanışı — kazanç/zarar analizi, 'lessons learned'. Ağustos 2026 earnings takvimi ve strateji planlaması. 'Rolling window' güncellenir: Temmuz → Ağustos + Eylül.
- 16:00 EDT: Market kapanışı. Ağustos 2026 'pre-analysis' başlatılır.

#### Hafta 4 — Özel Kurallar

- **FOMC Günü Trade Yasağı:** 28-29 Temmuz, FOMC toplantısı günleridir. 28 Temmuz 14:00-16:00 ve 29 Temmuz 09:30-11:00 arası **trade yasaktır**. 'Knee-jerk' reaksiyon, 'whipsaw' hareketler, ve 'slippage' riski çok yüksektir. Sabır, bu dönemde en büyük erdemdir.
- **Blackout Bitişi:** 30 Temmuz, Blackout döneminin bitişidir. Fed yetkilileri konuşmaya başlar. 'Fed speakers' günü, piyasa volatilitesi yüksek kalabilir. Yeni pozisyon açma, 31 Temmuz veya 1 Ağustos'a kadar ertelenmelidir.
- **Monthly Close:** 31 Temmuz, ayın son günüdür. 'Monthly close' etkisiyle piyasa oynaklığı artabilir. Ayrıca, 'window dressing' (fonların ay sonu portföy ayarlaması) etkisiyle hisse hareketleri 'artificial' olabilir. Bu dönemde, 'technical analysis' güvenilirliği düşebilir.

---

## 5. Ekler

### 5.1 Karşılaştırma Matrisi: Hisse × Strateji Türü

> **Not:** Bu matris, her hisse için en uygun strateji türünü önerir. '⭐' işareti, 'highly recommended' stratejiyi gösterir. '✓' işareti, 'uygun' stratejiyi gösterir. '✗' işareti, 'önerilmeyen' stratejiyi gösterir. Tüm değerlendirmeler, Temmuz 2026 earnings dönemi özelinde yapılmıştır.

| Hisse | Long Call/Put | Debit Spread | Butterfly | Iron Condor | Ratio Spread | Calendar Spread | Önerilen |
|-------|-------------|------------|-----------|-------------|--------------|-----------------|----------|
| **$JPM** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bull Call Spread |
| **$BAC** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bull Call Spread |
| **$GS** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bull Call Spread |
| **$C** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bull Call Spread |
| **$WFC** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bull Call Spread |
| **$BLK** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bull Call Spread |
| **$UNH** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bear Put Spread |
| **$NKE** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bear Put Spread |
| **$TSLA** | ⭐ | ✓ | ✓ | ✓ | ✓ | ✓ | Long Put / Put Butterfly |
| **$GOOGL** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bull Call Spread / Call Butterfly |
| **$INTC** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Long Call / Call Butterfly |
| **$META** | ✓ | ✓ | ⭐ | ✓ | ✓ | ✓ | Call Butterfly |
| **$MSFT** | ✓ | ✓ | ⭐ | ✓ | ✓ | ✓ | Call Butterfly |
| **$AMZN** | ✓ | ✓ | ⭐ | ✓ | ✓ | ✓ | Call Butterfly |
| **$AAPL** | ✓ | ✓ | ⭐ | ✓ | ✓ | ✓ | Call Butterfly |
| **$FDS** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bull Call Spread |
| **$GIS** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bull Call Spread |
| **$GE** | ✓ | ⭐ | ✓ | ✓ | ✓ | ✓ | Bull Call Spread |
| **$SPY** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | Earnings play değil — FOMC hedge |
| **$QQQ** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | Earnings play değil — FOMC hedge |

#### Karşılaştırma Matrisi — Açıklamalar

- **Bankalar ($JPM, $BAC, $GS, $C, $WFC):** Debit Spread (Bull Call Spread) en uygun stratejidir. Bankalar, earnings sonrası genellikle ±3-5% hareket eder. Butterfly ve Iron Condor, 'too wide' expected move nedeniyle kâr potansiyelini sınırlar. Long Call/Put, IV Crush riski taşır. Ratio Spread, bankaların 'low volatility' karakteri nedeniyle naked side riski taşır.
- **TSLA:** Long Put veya Put Butterfly en uygun stratejidir. TSLA, 'downside skew' taşıyan bir hissedir. Earnings sonrası 'miss' yapma olasılığı, 'beat' yapma olasılığından daha yüksek görünür (delivery miss, margin compression, robotaxi delay). Long Put, yüksek kâr potansiyeli sunar; Put Butterfly, riski sınırlar.
- **Tech Megacap ($META, $MSFT, $AMZN, $AAPL):** Butterfly en uygun stratejidir. Bu hisseler, earnings sonrası genellikle 'expected move' civarında hareket eder. IV Crush, Butterfly'nin ana kâr kaynağıdır. Long Call/Put, 'high premium' nedeniyle maliyetli olabilir. Debit Spread, 'expected move' dışına hareket ederse max loss riski taşır.
- **UNH:** Bear Put Spread en uygun stratejidir. UNH, Medicare Advantage margin compression ve regulatory headwinds nedeniyle 'downside bias' taşıyor. Bear Put Spread, hem yön riskini sınırlar hem de kâr potansiyeli sunar.

### 5.2 IV Crush Sektör Sıralaması: Hangi Sektör En Hızlı IV Crush Yaşar?

> **Not:** IV Crush hızı, sektörün 'volatility regime', 'news sensitivity', ve 'institutional ownership' seviyesine bağlıdır. Tech sektörü, genellikle en hızlı IV Crush yaşayan sektördür (24-48 saat). Bankalar, daha yavaş IV Crush yaşar (48-72 saat). Sağlık sektörü, en yavaş IV Crush yaşayan sektörlerden biridir (72-96 saat).

| Sıra | Sektör | IV Crush Hızı | Neden | Örnek Hisse | Tavsiye |
|------|--------|---------------|-------|-------------|---------|
| 1 | **Teknoloji (Mega Cap)** | ⚡⚡⚡ 24-48 saat | Yüksek IV, yüksek hacim, 'efficient market', algoritmik trading | $META, $MSFT, $AAPL, $AMZN | Earnings sonrası ertesi gün açılışta kapat |
| 2 | **Teknoloji (Growth/Meme)** | ⚡⚡⚡ 12-24 saat | Aşırı yüksek IV, 'retail frenzy', 'gamma squeeze', 'meme' dinamikleri | $TSLA, $PLTR, $SNAP | Earnings sonrası aynı gece (AMC) veya ertesi gün açılışta kapat |
| 3 | **Finansal (Büyük Bankalar)** | ⚡⚡ 48-72 saat | Düşük IV, 'institutional ownership', 'slow money', 'dividend focus' | $JPM, $BAC, $GS, $WFC | Ertesi gün açılışta kapat, gün içi 'scalp' imkanı |
| 4 | **Finansal (Asset Management)** | ⚡⚡ 48-72 saat | Düşük IV, 'long-term investor' tabanı, 'fee-based' model | $BLK, $BX | Ertesi gün açılışta kapat |
| 5 | **Sağlık (Insurance/PBM)** | ⚡ 72-96 saat | Düşük IV, 'defensive' karakter, 'political/regulatory' uncertainty | $UNH, $CVS, $CI | 2-3 gün tutma imkanı (ama max 2 gün kuralı geçerli) |
| 6 | **Sağlık (Pharma/Biotech)** | ⚡⚡ 24-48 saat | 'FDA pipeline', 'clinical trial' riski, 'binary event' dinamikleri | $LLY, $PFE, $MRK | Ertesi gün açılışta kapat |
| 7 | **Enerji** | ⚡⚡ 48-72 saat | 'Commodity price' bağımlılığı, 'OPEC' haberleri, 'ESG' baskısı | $XOM, $CVX | Ertesi gün açılışta kapat |
| 8 | **Tüketim (Staples)** | ⚡ 72-96 saat | Düşük IV, 'defensive' karakter, 'inflation' hedge | $GIS, $KHC, $PG | 2-3 gün tutma imkanı (ama max 2 gün kuralı geçerli) |
| 9 | **Tüketim (Discretionary)** | ⚡⚡ 48-72 saat | 'Consumer sentiment' bağımlılığı, 'retail' dinamikleri | $NKE, $HD, $MCD | Ertesi gün açılışta kapat |
| 10 | **Endüstriyel** | ⚡⚡ 48-72 saat | 'Macro cycle' bağımlılığı, 'China exposure', 'supply chain' riski | $GE, $HON, $CAT | Ertesi gün açılışta kapat |

#### IV Crush Hızı — Detaylı Açıklamalar

- **Teknoloji (Mega Cap) — 24-48 saat:** META, MSFT, AAPL, AMZN gibi hisseler, 'efficient market' hipotezine en yakın hisselerdir. Earnings sonrası, 'smart money' (institutional investors) hemen pozisyon ayarlar. Algoritmik trading, IV'yi hızla düşürür. IV Crush, earnings sonrası ertesi gün açılışta (BMO için) veya ertesi gün öğleden sonra (AMC için) tamamlanır. Bu hisselerde, '2 gün tutma' kuralı bile fazla olabilir; ertesi gün açılışta kapatmak en güvenli yoldur.
- **Teknoloji (Growth/Meme) — 12-24 saat:** TSLA, PLTR, SNAP gibi hisseler, 'retail frenzy' ve 'gamma squeeze' dinamikleri nedeniyle aşırı yüksek IV taşırlar. Earnings sonrası, 'meme' etkisiyle IV çok hızlı çöker. TSLA'da IV Crush, earnings sonrası aynı gece (AMC) başlayabilir ve ertesi gün açılışta tamamlanabilir. Bu hisselerde, 'ertesi gün açılışta kapat' kuralı hayati önemdedir.
- **Finansal (Büyük Bankalar) — 48-72 saat:** JPM, BAC, GS gibi bankalar, 'low volatility' karaktere sahiptir. Earnings sonrası, 'institutional investors' pozisyon ayarlamasını yavaş yapar. 'Dividend focus' ve 'long-term hold' kültürü, IV Crush'u yavaşlatır. Bankalarda, ertesi gün açılışta kapatmak yerine, gün içi 'scalp' (kısa süreli trade) imkanı olabilir. Ancak, 'max 2 gün' kuralı yine de geçerlidir.
- **Sağlık (Insurance/PBM) — 72-96 saat:** UNH, CVS, CI gibi sağlık şirketleri, 'defensive' karaktere sahiptir. Earnings sonrası, 'political/regulatory' uncertainty nedeniyle IV yavaş çöker. 'Medicare/Medicaid' kararları, 'Congress' takvimiyle ilişkilidir; bu nedenle, 'event risk' uzun süre devam edebilir. Sağlık hisselerinde, '2-3 gün tutma' imkanı teorik olarak vardır, ancak 'max 2 gün' kuralı katı şekilde uygulanmalıdır.

### 5.3 Greeks Dashboard: Tüm Hisselerin Delta, Gamma, Theta, Vega Özet Tablosu

> **⚠️ UYARI:** Aşağıdaki Greeks değerleri, 'temsili/illüstratif' değerlerdir. Opsiyon chain verisi, canlı piyasa verisi (broker platformu: ThinkorSwim, Interactive Brokers, TastyTrade) ile güncellenmelidir. Greeks, hisse fiyatı, strike fiyatı, expiry, volatility, ve faiz oranına bağlı olarak sürekli değişir. Aşağıdaki değerler, 1 Temmuz 2026, VIX 16.89, hisse fiyatları mevcut seviyelerinde, ATM strike, 7-9 DTE expiry baz alınarak hesaplanmıştır.

| Hisse | Fiyat (yakl.) | ATM Strike | DTE | Delta | Gamma | Theta | Vega | Rho | IV Rank | Notlar |
|-------|---------------|------------|-----|-------|-------|-------|------|-----|---------|--------|
| **$JPM** | ~$212 | 212.5 | 7 | 0.52 | 0.045 | -0.18 | 0.32 | 0.01 | 45 | Düşük Gamma, düşük Theta — bankalar 'stable' |
| **$BAC** | ~$43 | 43 | 7 | 0.51 | 0.068 | -0.22 | 0.28 | 0.01 | 42 | Düşük Vega — bankalar 'low vol' regime |
| **$GS** | ~$490 | 490 | 7 | 0.50 | 0.038 | -0.15 | 0.35 | 0.01 | 48 | Düşük Theta — 'investment bank' premium |
| **$C** | ~$64 | 64 | 7 | 0.50 | 0.055 | -0.20 | 0.30 | 0.01 | 43 | Düşük Vega — 'universal bank' model |
| **$WFC** | ~$59 | 59 | 7 | 0.51 | 0.060 | -0.21 | 0.29 | 0.01 | 41 | Düşük Gamma — 'consumer bank' stability |
| **$BLK** | ~$875 | 875 | 7 | 0.49 | 0.032 | -0.14 | 0.38 | 0.01 | 50 | Düşük Gamma, yüksek Vega — 'asset management' risk |
| **$UNH** | ~$525 | 525 | 7 | 0.50 | 0.040 | -0.16 | 0.34 | 0.01 | 52 | Düşük Gamma — 'healthcare' defensive |
| **$NKE** | ~$80 | 80 | 7 | 0.50 | 0.065 | -0.24 | 0.45 | 0.02 | 58 | Yüksek Vega — 'retail' uncertainty |
| **$TSLA** | ~$265 | 265 | 7 | 0.48 | 0.085 | -0.35 | 0.62 | 0.02 | 68 | ⚠️ Yüksek Gamma, yüksek Vega, yüksek Theta — 'meme' karakter |
| **$GOOGL** | ~$185 | 185 | 7 | 0.51 | 0.050 | -0.20 | 0.38 | 0.01 | 55 | Yüksek Vega — 'AI' hype ve 'DOJ' riski |
| **$INTC** | ~$25 | 25 | 7 | 0.50 | 0.090 | -0.28 | 0.55 | 0.01 | 62 | ⚠️ Yüksek Gamma — 'turnaround' binary risk |
| **$META** | ~$585 | 585 | 7 | 0.50 | 0.042 | -0.17 | 0.36 | 0.01 | 53 | Düşük Gamma — 'mega cap' stability |
| **$MSFT** | ~$465 | 465 | 7 | 0.51 | 0.038 | -0.15 | 0.33 | 0.01 | 48 | Düşük Gamma, düşük Vega — 'enterprise' reliability |
| **$AMZN** | ~$215 | 215 | 7 | 0.50 | 0.045 | -0.18 | 0.35 | 0.01 | 50 | Düşük Vega — 'diversified' business model |
| **$AAPL** | ~$235 | 235 | 7 | 0.51 | 0.040 | -0.16 | 0.32 | 0.01 | 46 | Düşük Gamma, düşük Vega — 'cash cow' stability |
| **$FDS** | ~$565 | 565 | 7 | 0.50 | 0.055 | -0.22 | 0.42 | 0.01 | 56 | Yüksek Vega — 'financial data' niche risk |
| **$GIS** | ~$73 | 73 | 7 | 0.50 | 0.048 | -0.19 | 0.30 | 0.01 | 44 | Düşük Vega — 'consumer staples' low vol |
| **$GE** | ~$205 | 205 | 7 | 0.51 | 0.045 | -0.18 | 0.33 | 0.01 | 47 | Düşük Vega — 'industrial' cyclical stability |
| **$SPY** | ~$749 | 749 | 7 | 0.50 | 0.035 | -0.14 | 0.28 | 0.01 | 40 | Düşük Vega — 'index' diversification |
| **$QQQ** | ~$520 | 520 | 7 | 0.50 | 0.040 | -0.16 | 0.32 | 0.01 | 45 | Düşük Vega — 'tech index' diversification |

#### Greeks Dashboard — Açıklamalar

- **Delta (Δ):** Opsiyon fiyatının, hisse fiyatındaki $1'lık değişime karşı duyarlılığı. ATM opsiyonlar için Delta ~0.50'dir. Delta, 'directional exposure' ölçüsüdür. Long Call Delta pozitif, Long Put Delta negatiftir. Earnings play'lerde, Delta hedefi 0.30-0.60 arasıdır (directional bias netleştirmek için).
- **Gamma (Γ):** Delta'nın, hisse fiyatındaki $1'lık değişime karşı duyarlılığı. Yüksek Gamma, 'delta acceleration' anlamına gelir. TSLA ve INTC gibi hisselerde Gamma yüksektir (0.08+); bu, 'meme' veya 'binary' karakter göstergesidir. Yüksek Gamma, kısa vadede hızlı kâr/zarar potansiyeli sunar ama aynı zamanda 'whipsaw' riskini artırır.
- **Theta (Θ):** Zaman decay — her gün geçen sürede opsiyon fiyatının ne kadar eridiği. Negatif Theta, 'long opsiyon' pozisyonlarında günlük kayıp anlamına gelir. TSLA'da Theta -0.35 çok yüksektir; bu, pozisyonun her gün $35 değer kaybettiği anlamına gelir (kontrat başına). Earnings play'lerde, 'short hold' (2 gün) Theta riskini sınırlar.
- **Vega (V):** Volatilite duyarlılığı — IV'deki %1'lik değişime karşı opsiyon fiyatının ne kadar değiştiği. Yüksek Vega, 'IV Crush'dan büyük kayıp riski anlamına gelir. TSLA'da Vega 0.62 çok yüksektir; IV'nin %10 düşmesi, opsiyon fiyatının $62 düşmesi anlamına gelir. Earnings play'lerde, 'Vega hedge' (Butterfly, Iron Condor) kritik öneme sahiptir.
- **Rho (ρ):** Faiz oranı duyarlılığı. Earnings play'lerde Rho genellikle ihmal edilebilir (0.01-0.02). Ancak, FOMC haftasında Rho anlamlı hale gelebilir; faiz oranı kararı, opsiyon fiyatlarını etkileyebilir.
- **IV Rank:** Mevcut IV'nin, son 1 yıllık IV aralığındaki yüzdelik sıralaması. IV Rank 50, 'orta' volatilite anlamına gelir. IV Rank >60, 'yüksek' volatilite (premium fiyatlı) anlamına gelir. Earnings play'lerde, IV Rank >50 olan hisseler tercih edilmelidir (IV Crush potansiyeli yüksek).

### 5.4 Ağustos 2026 Preview: Gelecek Ayın Öne Çıkan İsimleri

> **Not:** Ağustos 2026 earnings takvimi, 'tahmini/expected' tarihlerdir. Şirketler, investor relations sayfalarında resmi tarihleri duyurur. Aşağıdaki tarihler, 'historical reporting pattern' (geçmiş 3 yılın ortalaması) baz alınarak tahmin edilmiştir. Takvim yaklaştıkça güncellenmelidir.

| Hafta | Tarih Aralığı | Öne Çıkan Hisseler | Sektör | Beklenti | Strateji Önerisi |
|-------|---------------|--------------------|--------|----------|------------------|
| **Hafta 1** | 3–7 Ağustos | $DIS, $PYPL, $UBER, $ABNB, $MELI | Tüketim, Fintech, Travel | Yaz sezonu etkisi, 'revenge travel' sona eriyor, 'discretionary' harcama zayıflığı | Bear Put Spread ($DIS, $PYPL) / Bull Call Spread ($UBER) |
| **Hafta 2** | 10–14 Ağustos | $CSCO, $COIN, $HOOD, $RIVN, $NIO | Teknoloji, Fintech, EV | 'Crypto winter' sona eriyor, 'AI infrastructure' capex, 'EV price war' | Butterfly ($CSCO) / Long Put ($RIVN, $NIO) |
| **Hafta 3** | 17–21 Ağustos | $NVDA, $WMT, $TGT, $HD, $LOW | Teknoloji, Perakende | **NVDA Q2 FY2027** — AI revenue sustainability, 'Blackwell' chip demand, guidance | Long Call / Call Butterfly ($NVDA) / Bear Put Spread ($TGT) |
| **Hafta 4** | 24–28 Ağustos | $CRM, $SNOW, $ZM, $OKTA, $PLTR | SaaS, Cloud, Cybersecurity | 'AI SaaS' monetization, 'enterprise spend' slowdown, 'subscription churn' | Butterfly ($CRM, $SNOW) / Long Put ($ZM) |

#### Ağustos 2026 — Öne Çıkan Hisseler Detayları

- **$NVDA (Hafta 3, ~19-21 Ağustos):** Ağustos'un en kritik earnings'idir. NVIDIA, Q2 FY2027 (Mayıs-Temmuz 2026) sonuçlarını açıklar. AI revenue sustainability, 'Blackwell' chip demand, ve 'data center' capex guidance en çok izlenen metriklerdir. Geçmişte NVDA, earnings sonrası ±7-12% hareket etmiştir. IV Rank genellikle 60-70 arasındadır. Strateji: Long Call veya Call Butterfly. Risk: AI 'bubble' spekülasyonu, 'China export ban' gelişmeleri.
- **$DIS (Hafta 1, ~5-7 Ağustos):** Disney, 'streaming' (Disney+, Hulu, ESPN+) subscriber growth ve 'parks' revenue recovery hakkında bilgi verir. 'Streaming profitability' hala belirsizdir. 'Cord-cutting' hızlanıyor. Strateji: Bear Put Spread. Risk: 'Bob Iger' turnaround, 'Marvel' content pipeline.
- **$PYPL (Hafta 1, ~5-7 Ağustos):** PayPal, 'Braintree' (enterprise payments) growth ve 'Venmo' monetization hakkında bilgi verir. 'Buy now pay later' (BNPL) rekabeti (Affirm, Klarna) baskı yaratıyor. Strateji: Bear Put Spread. Risk: 'Alex Chriss' turnaround, 'enterprise' pivot.
- **$COIN (Hafta 2, ~12-14 Ağustos):** Coinbase, 'crypto trading volume' ve 'institutional custody' revenue hakkında bilgi verir. Bitcoin ve Ethereum fiyatları, trading volume'u doğrudan etkiler. 'Spot Bitcoin ETF' flows, 'regulatory clarity' gelişmeleri kritik. Strateji: Long Call (bullish crypto) veya Long Put (bearish crypto). Risk: 'SEC' enforcement, 'crypto winter' relapse.
- **$HOOD (Hafta 2, ~12-14 Ağustos):** Robinhood, 'trading revenue' (options, crypto, equities) ve 'Gold subscription' growth hakkında bilgi verir. 'Retail trading' aktivitesi, 'meme stock' dinamikleri kritik. Strateji: Long Call (bullish retail) veya Long Put (bearish retail). Risk: 'Regulatory' baskı, 'payment for order flow' (PFOF) ban.
- **$WMT (Hafta 3, ~17-19 Ağustos):** Walmart, 'grocery inflation', 'e-commerce' growth, ve 'membership' (Walmart+) revenue hakkında bilgi verir. 'Consumer staples' defensive karakteri, 'recession' hedge olarak görülür. Strateji: Bull Call Spread. Risk: 'Margin compression', 'inventory' glut.
- **$CRM (Hafta 4, ~24-26 Ağustos):** Salesforce, 'AI Einstein', 'Data Cloud', ve 'subscription' renewal rates hakkında bilgi verir. 'AI SaaS' monetization, 'enterprise CRM' spend kritik. Strateji: Butterfly. Risk: 'Microsoft Dynamics', 'Slack' integration, 'AI agent' disruption.

#### Ağustos 2026 — Genel Strateji Notları

- **NVDA Etkisi:** NVDA, Ağustos'un 'market mover'ıdır. NVDA earnings sonrası, tüm tech sektörü (semiconductor, AI, cloud) hareket edebilir. Eğer NVDA 'beat' yaptıysa, 'AI momentum' devam eder; $AMD, $MU, $AVGO pozitif etkilenir. Eğer NVDA 'miss' yaptıysa, 'AI correction' başlayabilir; $SMH (semiconductor ETF) negatif etkilenir.
- **Yaz Sezonu Etkisi:** Ağustos, 'summer doldrums' (yaz durgunluğu) etkisine sahiptir. Hacimler düşük olabilir, 'institutional' aktivite azalabilir. 'Thin market' riski, oynaklığı artırabilir. Bu dönemde, 'position sizing' azaltılmalı ve 'tight stop-loss' kullanılmalıdır.
- **FOMC Sonrası Etki:** Temmuz FOMC (28-29 Temmuz) kararı, Ağustos piyasasını etkiler. Eğer Fed 'hawkish' çıktıysa, Ağustos 'risk-off' başlayabilir. Eğer Fed 'dovish' çıktıysa, Ağustos 'risk-on' devam edebilir. Ağustos stratejisi, FOMC sonrası piyasa reaksiyonuna göre ayarlanmalıdır.

---

## 6. Ek B: Margin Rehberi ve Broker Karşılaştırması

### 6.1 Margin Rehberi: Earnings Play'ler için Minimum Bakiye

Earnings play'ler, farklı broker'larda farklı margin gereksinimleri taşır. Aşağıdaki tablo, yaygın broker'ların earnings opsiyonları için margin kurallarını özetler.

| Broker | Min Bakiye | Opsiyon Seviyesi | Earnings Spread Margin | Naked Option Margin | Commission | Platform |
|--------|------------|------------------|----------------------|---------------------|------------|----------|
| **TD Ameritrade / Schwab** | $0 | Level 2 (Spread) | Spread width - credit | Hisse fiyatının %20'si + premium - OTM | $0.65/kontrat | ThinkorSwim |
| **Interactive Brokers (IBKR)** | $0 | Level 2 (Spread) | Risk-based margin | Portfolio margin (hisse fiyatının %15'si) | $0.65/kontrat | Trader Workstation |
| **TastyTrade** | $0 | Level 2 (Spread) | Spread width - credit | Hisse fiyatının %20'si + premium - OTM | $1.00/kontrat (açık), $0 (kapanış) | TastyTrade App |
| **Robinhood** | $0 | Level 2 (Spread) | Spread width - credit | Naked options yok | $0 | Robinhood App |
| **Webull** | $0 | Level 2 (Spread) | Spread width - credit | Naked options yok | $0 | Webull App |
| **E*TRADE** | $0 | Level 2 (Spread) | Spread width - credit | Hisse fiyatının %20'si + premium - OTM | $0.65/kontrat | Power E*TRADE |
| **Fidelity** | $0 | Level 2 (Spread) | Spread width - credit | Hisse fiyatının %20'si + premium - OTM | $0.65/kontrat | Active Trader Pro |

#### Margin Rehberi — Önemli Notlar

- **Spread Margin:** Debit Spread'lerde, max risk = net debit olduğu için, genellikle 'cash secured' (nakit teminatlı) olarak işlem görür. Yani, spread'in max riski kadar nakit bloke edilir. Credit Spread'lerde (Iron Condor), max risk = spread width - credit kadardır; bu miktar kadar nakit/margin bloke edilir.
- **Naked Option Margin:** Naked call/put'lar, 'unlimited loss' (sınırsız kayıp) riski taşıdığı için, yüksek margin gerektirir. Genellikle: Hisse fiyatının %20'si + premium - OTM amount. Örnek: Hisse $100, 110 CALL short @ $2. Margin = ($100 * %20) + $2 - ($110-$100) = $20 + $2 - $10 = $12. Bu, 'Regulation T' margin kurallarına göre hesaplanır. 'Portfolio margin' kullananlar (IBKR gibi), daha düşük margin öderler.
- **Earnings Play Margin:** Earnings play'lerde, 'defined risk' (sınırlı risk) stratejileri (Debit Spread, Butterfly, Iron Condor) kullanıldığında, margin gereksinimi düşüktür. 'Undefined risk' (sınırsız risk) stratejileri (Naked Call/Put, Ratio Spread naked side) kullanıldığında, margin gereksinimi yüksektir. Bu nedenle, yeni başlayan trader'lar 'defined risk' stratejileriyle başlamalıdır.
- **Pattern Day Trader (PDT) Rule:** $25,000 altı hesaplarda, 'pattern day trader' kuralı uygulanır. 5 iş günü içinde 3+ 'day trade' (aynı gün açılıp kapanan pozisyon) yapılırsa, hesap 'pattern day trader' olarak işaretlenir ve 90 gün 'day trade' yasağı uygulanır. Earnings play'ler, genellikle 'overnight' (ertesi gün kapanan) pozisyonlardır; bu nedenle PDT kuralına takılmazlar. Ancak, 'scalp' (gün içi trade) yapanlar PDT kuralına dikkat etmelidir.

### 6.2 Broker Karşılaştırması: Earnings Play'ler için En İyi Platform

| Broker | Artıları | Eksileri | Önerilen Bütçe | Önerilen Seviye |
|--------|----------|----------|----------------|-----------------|
| **ThinkorSwim (TD/Schwab)** | Gelişmiş Greeks analizi, 'Analyze' sekmesi, 'Risk Profile' grafiği, 'paperMoney' simülasyonu | Yavaş platform, karmaşık arayüz, yüksek commission | $5K+ | Orta-İleri |
| **TastyTrade** | 'Probability of profit' hesaplama, 'IV Rank' göstergesi, 'expected move' göstergesi, $0 kapanış commission | Sadece ABD hisseleri, sınırlı uluslararası erişim | $1K+ | Başlangıç-Orta |
| **Interactive Brokers** | Düşük commission, 'portfolio margin', 'Trader Workstation' (TWS) ile gelişmiş analiz, uluslararası piyasalar | Karmaşık platform, 'learning curve' yüksek, 'inactivity fee' | $10K+ | İleri-Uzman |
| **Robinhood** | $0 commission, basit arayüz, 'fractional shares' | Sınırlı opsiyon analiz araçları, 'payment for order flow' eleştirisi, 'customer service' zayıf | $1K-$5K | Başlangıç |
| **Webull** | $0 commission, 'paper trading', gelişmiş grafik araçları | Sınırlı opsiyon seviyeleri, 'customer service' eleştirisi | $1K-$5K | Başlangıç-Orta |

#### Broker Seçimi — Öneriler

- **Başlangıç ($1K-$5K):** Robinhood veya Webull. Basit arayüz, $0 commission, ve 'paper trading' imkanı sunarlar. Ancak, 'advanced' opsiyon analiz araçları sınırlıdır. 'Learning' aşamasında idealdirler.
- **Orta ($5K-$25K):** TastyTrade. 'Probability of profit', 'IV Rank', ve 'expected move' göstergeleri, earnings play'ler için hayati önemdedir. $0 kapanış commission, 'scalp' ve 'day trade' için avantajlıdır. 'Tastyworks' (eski adı) platformu, 'visual' ve 'intuitive' arayüzü ile bilinir.
- **İleri ($25K+):** ThinkorSwim (TD Ameritrade/Schwab) veya Interactive Brokers. 'Greeks' analizi, 'Risk Profile', 'Scenario Analysis', ve 'Portfolio Margin' imkanları sunarlar. 'Professional' trader'lar için idealdirler. ThinkorSwim'in 'paperMoney' simülasyonu, 'risk-free' öğrenme imkanı sunar.
- **Uzman ($50K+):** Interactive Brokers (IBKR). 'Portfolio Margin', 'ultra-low commission', ve 'global market access' ile 'institutional' kalitede hizmet sunar. 'TWS' (Trader Workstation) platformu, 'customizable' ve 'algorithmic' trading imkanı sunar.

---

## 7. Ek C: Risk/Reward Matrix ve Win Rate Analizi

### 7.1 Risk/Reward Matrix: Strateji × Hisse

| Strateji | Hisse Örneği | Max Risk | Max Reward | Risk/Reward | Win Rate (tahmini) | Expected Value |
|----------|-------------|----------|------------|-------------|-------------------|---------------|
| Long Call | $AAPL 230 CALL | $230 | Sınırsız | 1:∞ | 30-35% | Negatif (long-term) |
| Long Put | $TSLA 270 PUT | $210 | Sınırsız | 1:∞ | 30-35% | Negatif (long-term) |
| Bull Call Spread | $JPM 210/220 | $350 | $650 | 1:1.86 | 45-55% | Hafif pozitif |
| Bear Put Spread | $UNH 520/540 | $420 | $1,580 | 1:3.76 | 40-50% | Pozitif |
| Long Call Butterfly | $META 570/585/600 | $480 | $1,020 | 1:2.13 | 35-45% | Pozitif |
| Long Put Butterfly | $TSLA 255/265/275 | $450 | $1,050 | 1:2.33 | 35-45% | Pozitif |
| Iron Condor | $BAC 40/43/46/49 | $400 | $400 | 1:1 | 60-70% | Hafif pozitif |
| Ratio Call Spread | $JPM 212/220 | $600 | $400 | 1:0.67 | 50-60% | Nötr (naked risk) |
| Ratio Put Spread | $UNH 520/500 | $720 | $480 | 1:0.67 | 50-60% | Nötr (naked risk) |
| Calendar Call Spread | $GOOGL 185 | $760 | $1,240 | 1:1.63 | 40-50% | Pozitif |

#### Expected Value Hesaplaması

Expected Value (EV), bir stratejinin 'uzun vadeli' kâr potansiyelinin ölçüsüdür. EV = (Win Rate × Max Reward) - (Loss Rate × Max Risk). Örnek: Bull Call Spread ($JPM 210/220). Win Rate = 50%, Max Reward = $650, Max Risk = $350. EV = (0.50 × $650) - (0.50 × $350) = $325 - $175 = $150. Bu, stratejinin 'ortalama' $150 kâr getirdiği anlamına gelir. Ancak, bu 'tek seferlik' bir hesaplamadır; uzun vadeli EV, 'transaction costs' (commission, slippage) ve 'taxes' (vergiler) ile düşer.

Long Call/Put stratejilerinde, EV genellikle negatiftir. Çünkü win rate düşüktür (30-35%) ve 'transaction costs' yüksektir. Bu, 'lottery ticket' mantığıdır: uzun vadede kaybedersiniz, ama kazandığınızda büyük kazanırsınız. Earnings play'lerde, 'win rate' artırılabilir: 'high conviction' play'ler, 'technical analysis', ve 'news flow' ile win rate 40-45%'e çıkarılabilir. Bu, EV'yi pozitif yapabilir.

Spread stratejilerinde (Bull Call, Bear Put), EV genellikle hafif pozitiftir. Çünkü win rate yüksektir (45-55%) ve risk sınırlıdır. Ancak, 'max reward' sınırlıdır; bu nedenle, 'büyük kazanç' potansiyeli düşüktür. Earnings play'lerde, spread'ler 'survival' stratejisidir: uzun vadede hayatta kalmak için en etkili stratejidir.

Butterfly ve Iron Condor stratejilerinde, EV 'moderate' pozitiftir. Butterfly, 'risk/reward ratio' lehindedir (1:2+); ancak win rate düşüktür (35-45%). Iron Condor, 'win rate' yüksektir (60-70%); ancak 'risk/reward ratio' tersidir (1:1). Earnings play'lerde, bu stratejiler 'non-directional' play'ler için idealdir.

### 7.2 Win Rate Analizi: Earnings Play'lerde Başarı Oranı

| Faktör | Yüksek Win Rate (>%50) | Düşük Win Rate (<%40) |
|--------|------------------------|----------------------|
| **Hisse Seçimi** | Yüksek IV Rank (>50), net trend, açık haber akışı | Düşük IV Rank (<30), 'choppy' trend, belirsiz haber akışı |
| **Entry Timing** | Earnings'ten 3-5 gün önce, IV yükselişinde | Earnings'ten 1 gün önce, IV zaten zirvede; veya çok erken (T-7+) |
| **Exit Timing** | Earnings sonrası ertesi gün açılışta, IV Crush'un tam etkisinde | Earnings sonrası 2+ gün sonra, IV çökmüş, Theta decay hızlanmış |
| **Strateji Seçimi** | Spread, Butterfly (risk sınırlı) | Long Call/Put (IV Crush'a savunmasız) |
| **Position Sizing** | Tek hisse max %2, sektör max %15 | Tek hisse >%5, sektör >%30 (konsantrasyon riski) |
| **Stop-Loss** | -%30'da yarı kapat, -%50'de tam kapat | 'Hope' ile tutma, 'averaging down' (maliyet düşürme) |
| **Kâr Alma** | +%50'de yarı kapat, +%100'de %75 kapat | 'Greed' ile bekleme, +%200 hedefi (hiç gerçekleşmeyebilir) |
| **VIX Rejimi** | VIX 15-25 (Low-Moderate Fear) | VIX >30 (High-Extreme Fear) veya VIX <12 (Ultra Low Fear) |
| **FOMC/Makro** | FOMC dışı dönem, 'calm macro' ortamı | FOMC haftası, 'macro surprise' (CPI, NFP, GDP) |

#### Win Rate Artırma İpuçları

1. **'High Conviction' Play'ler:** Sadece 'conviction' seviyesi 4/5 veya 5/5 olan play'leri açın. 'Conviction', teknik analiz (support/resistance, trend), haber akışı (catalyst, guidance), ve makro faktörler (VIX, sektör trendi) ile belirlenir. 'Low conviction' play'lerden kaçının.
2. **'Expected Move' Analizi:** Hissenin 'expected move'unu (ATM straddle değeri) hesaplayın. Eğer 'expected move' ±$5 ise, spread width $5-$10 olmalıdır. Eğer 'expected move' ±$10 ise, spread width $10-$15 olmalıdır. 'Expected move'un dışına spread kurmak, win rate'i düşürür.
3. **'IV Rank' Filtresi:** Sadece IV Rank >50 olan hisselerde pozisyon açın. IV Rank <50 olan hisseler, 'low volatility' nedeniyle IV Crush potansiyeli düşüktür. Bu, 'cheap premium' gibi görünse bile, 'low volatility' hisselerde earnings sonrası hareket sınırlı olabilir.
4. **'Pre-Earnings' Kâr Alma:** Eğer pozisyon +%50 kârda ise, yarısı kapatılır. Bu, 'bird in hand' prensibidir. Earnings öncesi kâr realize etmek, 'risk-free' kâr sağlar. Kalan pozisyon, 'free roll' olarak tutulabilir.
5. **'Post-Earnings' Hızlı Çıkış:** Earnings sonrası, 'max 2 gün' kuralı katı şekilde uygulanmalıdır. 'Hope' ile tutulan pozisyonlar, genellikle IV Crush ve Theta decay nedeniyle değer kaybeder. 'Discipline', 'win rate' artırmanın en önemli faktörüdür.

---

## 8. Ek D: Earnings Play Hata Rehberi

### 8.1 En Sık Yapılan 10 Hata ve Çözümleri

| # | Hata | Neden | Çözüm | Örnek |
|---|------|-------|-------|-------|
| 1 | **21+ DTE kullanma** | 'Daha uzun vade = daha güvenli' yanlış inancı | 5-9 DTE kullan. Earnings play'ler short-term'dir. | $AAPL 230 CALL 45 DTE @ $8.50 → IV Crush sonrası $2.50 (kayıp %70) |
| 2 | **'Hope' ile tutma** | Duygusal karar, 'zararı kapatmamak' için beklemek | Stop-loss kuralı: -%30'da yarı kapat, -%50'de tam kapat. | $TSLA PUT -%40 → 'Biraz daha bekle' → -%80 kayıp |
| 3 | **'All-in' yapmak** | Açgözlülük, 'bu sefer kazanacağım' düşüncesi | Tek hisse max %2, min %20 cash reserve. | $50K hesapta $10K tek hisse → felaket |
| 4 | **FOMC haftasında trade yapmak** | 'Event blindness', makro riski görmemek | FOMC öncesi %75 azalt, 28-29 Temmuz trade yasak. | 28 Temmuz pozisyon açma → VIX 25'ten 35'e sıçrama → max kayıp |
| 5 | **İllikit opsiyon almak** | 'Ucuz' OTM opsiyon, düşük hacim | Hacim >1000, Open Interest >5000. Spread maliyetini kontrol et. | $FDS 580 CALL, hacim 50, spread %40 → çıkış imkansız |
| 6 | **'Averaging down' yapmak** | Zarar eden pozisyona daha fazla para yatırmak | Earnings play'lerde 'averaging down' YASAKTIR. Stop-loss uygula. | $NKE PUT -%30 → 'daha fazla al' → -%70 kayıp |
| 7 | **Aynı sektörden çok pozisyon** | 'Bankalar hepsi yükselecek' düşüncesi | Tek sektör max %15, max 3 pozisyon aynı sektörden. | JPM, BAC, GS, C, WFC — 5 banka pozisyonu → sektör korelasyonu felaketi |
| 8 | **'Max hold 2 gün' kuralını ihlal etmek** | 'Bir gün daha beklesem kâr ederim' | 48 saat sonra kapat, kârda veya zararda. | 3. gün tutma → IV çökmüş, Theta decay → kâr → zarar |
| 9 | **'Directional bias' aşırısı** | Tüm pozisyonlar 'bullish' veya 'bearish' | En az %30 pozisyon 'hedge' (ters yönde). | 10 pozisyon, 9 bullish, 1 bearish → piyasa 'surprise' → felaket |
| 10 | **'Complex' stratejiler deneyimsiz kullanmak** | Ratio Spread, Calendar Spread — 'naked side' riski | Deneyim kazanana kadar 'defined risk' stratejileri (Spread, Butterfly). | 1x2 Ratio Call Spread → hisse 'naked side'a gider → sınırsız kayıp |

### 8.2 'Lessons Learned' Şablonu

Her earnings play sonrası, aşağıdaki şablonu doldurarak 'lessons learned' belgelenebilir. Bu, 'continuous improvement' (sürekli iyileştirme) için kritik öneme sahiptir.

| Alan | Soru | Cevap |
|------|------|-------|
| **Hisse** | Hangi hisse? | $_____ |
| **Strateji** | Hangi strateji? | Long Call / Long Put / Bull Call / Bear Put / Butterfly / Iron Condor / Ratio / Calendar |
| **Entry** | Ne zaman girdim? | T-_____ (earnings'ten _____ gün önce) |
| **Exit** | Ne zaman çıktım? | T+_____ (earnings sonrası _____ gün sonra) |
| **Maliyet** | Ne kadar risk aldım? | $_____ |
| **Kâr/Zarar** | Sonuç? | $_____ (_____%) |
| **Hikaye** | Neden bu hisseyi seçtim? | _____ |
| **Doğru** | Ne yaptım doğru? | _____ |
| **Yanlış** | Ne yaptım yanlış? | _____ |
| **Ders** | Gelecekte neyi farklı yaparım? | _____ |
| **Conviction** | Conviction seviyesi (1-5)? | _____ |
| **Teknik** | Teknik analiz doğru muydu? | Support/Resistance, Trend, VWAP |
| **Haber** | Haber akışı doğru muydu? | Catalyst, Guidance, Macro |
| **IV** | IV Crush tahminim doğru muydu? | IV Rank, Expected Move, Actual Move |
| **Piyasa** | Piyasa koşulları uygun muydu? | VIX, SPY, QQQ, Sektör |

#### 'Lessons Learned' — Örnek Doldurma

| Alan | Cevap |
|------|-------|
| **Hisse** | $TSLA |
| **Strateji** | Long Put 270 |
| **Entry** | T-3 (earnings'ten 3 gün önce) |
| **Exit** | T+1 (earnings sonrası 1 gün sonra) |
| **Maliyet** | $210 |
| **Kâr/Zarar** | +$315 (+150%) |
| **Hikaye** | TSLA delivery miss beklentisi, margin compression, robotaxi delay |
| **Doğru** | Doğru yönde (bearish) tahmin, doğru entry timing (T-3), doğru exit timing (T+1 açılış) |
| **Yanlış** | Pozisyon biraz küçük (1 kontrat), daha fazla kontrat açılabilirdi |
| **Ders** | 'High conviction' play'lerde position size'ı artır (max %2 limiti içinde) |
| **Conviction** | 5/5 |
| **Teknik** | $270 support kırıldı, downtrend devam ediyor, VWAP altında |
| **Haber** | WSJ 'delivery miss' haberi, Çin fiyat savaşları, robotaxi delay |
| **IV** | IV Rank 68, expected move ±12%, actual move -15% |
| **Piyasa** | VIX 16.89 (Low Fear), QQQ düşüş trendinde, tech 'risk-off' |

---

## Sorumluluk Reddi (Disclaimer)

Bu rapor, yatırım tavsiyesi değildir. Opsiyon trading, yüksek risk taşır ve sermayenizin tamamını kaybetme riski vardır. Bu rapordaki tüm stratejiler, 'illüstratif' ve 'educational' amaçlıdır. Gerçek pozisyonlar kurulmadan önce, kendi araştırmanızı yapmalı, risk toleransınızı değerlendirmeli, ve bir finansal danışmana başvurmalısınız. Geçmiş performans, gelecek performansın garantisi değildir. 'Max hold 2 gün', 'stop-loss', ve 'position sizing' kuralları, risk yönetimi araçlarıdır; ancak %100 koruma sağlamazlar. Lütfen sadece kaybetmeyi göze alabileceğiniz kadar sermaye ile trade yapın.

---

**Rapor Tarihi:** 1 Temmuz 2026 | **TSİ:** 14:12 | **Agent:** Gistify Earning Strategy — Agent 4 (Bütçe + Risk + Portföy + Eylem Planı)

**Veri Kaynakları:** Yahoo Finance Earnings Calendar, TipRanks Options Volatility, Federal Reserve FOMC Calendar, St. Louis Fed Blackout Periods, Kiplinger Earnings Calendar, SmartCalendars AI Magnificent 7, Blank Capital Research Earnings Tracker, Tech Market Briefs Earnings Calendar

**Rapor Versiyon:** v4.0 | **Rolling Window:** Temmuz 2026 + Ağustos 2026 | **Format:** EarningsPlay IV Crush

---

## 9. Ek E: Earnings Play Psikolojisi Rehberi

> **Not:** Earnings play'ler, 'teknik' ve 'fundamental' analiz kadar 'psikolojik' disiplin gerektirir. Aşağıdaki rehber, yaygın psikolojik tuzakları ve bunların üstesinden gelme yöntemlerini açıklar.

### 9.1 Duygusal Tuzaklar ve Çözümleri

| Tuzak | Belirti | Neden | Çözüm | Pratik İpucu |
|-------|---------|-------|-------|--------------|
| **FOMO (Fear of Missing Out)** | 'Herkes kazanıyor, ben de girmeliyim' | Sosyal medya, Discord, Twitter etkisi | 'Conviction' filtresi: Sadece 4/5 veya 5/5 conviction play'leri aç. FOMO hissettiğinde 24 saat bekle. | 'FOMO listesi' tut: FOMO ile açtığın pozisyonların sonuçlarını kaydet. %80'si kayıp olacak. |
| **Greed (Açgözlülük)** | 'Biraz daha beklesem, %200 kâr ederim' | Kâr hedefini sürekli yükseltme | 'Kâr alma kuralı': +%50'de yarı kapat, +%100'de %75 kapat. 'Trailing stop' kullan. | 'Greed journal' tut: 'Greed' ile tuttuğun pozisyonların sonuçlarını kaydet. %70'i kârdan zarara döner. |
| **Hope (Umut)** | 'Düzelecek, biraz daha bekle' | Zarar eden pozisyonu kapatmama | 'Stop-loss kuralı': -%30'da yarı kapat, -%50'de tam kapat. 'Hope' ile tutma YASAKTIR. | 'Hope listesi' tut: 'Hope' ile tuttuğun pozisyonların sonuçlarını kaydet. %90'ı daha da kötüleşir. |
| **Revenge Trading (İntikam Trade'i)** | 'Kaybettiğimi geri almalıyım' | Kayıp sonrası duygusal, büyük pozisyon açma | 'Cooling off': Kayıp sonrası 24-48 saat trade yasak. 'Kayıp limiti': Günde max 2 kayıp. | 'Revenge journal' tut: 'İntikam' ile açtığın pozisyonların sonuçlarını kaydet. %85'i kayıp olur. |
| **Overconfidence (Aşırı Güven)** | 'Bu hisseyi tanıyorum, hata yapmam' | Geçmiş kazançlar, 'expert' illüzyonu | 'Tek hisse max %2' kuralı. 'Sektör max %15' kuralı. 'Ego' ile değil, 'math' ile trade. | 'Overconfidence listesi' tut: 'Emin' olduğun pozisyonların sonuçlarını kaydet. %50'si kayıp olur. |
| **Analysis Paralysis (Analiz Felci)** | 'Daha fazla veri toplamalıyım' | Sürekli araştırma, hiç pozisyon açmama | 'Kural bazlı entry': 3 kriter karşılanırsa, 1 saat içinde pozisyon aç. 'Perfect entry' diye bir şey yok. | 'Paralysis journal' tut: 'Analiz' ettiğin ama açmadığın pozisyonların sonuçlarını kaydet. %60'ı kazançlı olur. |
| **Loss Aversion (Kayıp Kaçınma)** | 'Zararı realize etmek çok acı verici' | Psikolojik olarak zararı 'kabul edememe' | 'Stop-loss', duygusal değil 'matematiksel' bir kuraldır. 'Kayıp' = öğrenme ücreti. | 'Loss aversion' egzersizi: Her kayıp sonrası, 'bu kayıp bana ne öğretti?' yaz. |
| **Confirmation Bias (Onay Yanlılığı)** | 'Sadece benim tezimi destekleyen haberleri okuyorum' | 'Bearish' pozisyon açıp, 'bullish' haberleri görmezden gelme | 'Devil's advocate': Her pozisyon öncesi, 'ters tez' yaz. 'Bullish' pozisyon için 'bearish' argümanlar listele. | 'Confirmation bias' egzersizi: Her pozisyon öncesi, 3 'bullish' ve 3 'bearish' haber oku. |

### 9.2 'Mental Framework' (Zihinsel Çerçeve)

Earnings play'lerde başarılı olmak için, 'zihinsel çerçeve' (mental framework) geliştirmek kritiktir. Aşağıdaki prensipler, 'discipline' ve 'consistency' (tutarlılık) için hayati öneme sahiptir.

**Prensip 1: 'Process over Outcome' (Süreç, Sonuçtan Önemli)**

Kazanç veya kayıp, 'tek seferlik' olaydır. 'Süreç' (process), uzun vadeli başarının temelidir. Eğer 'doğru süreç' uygulanırsa, uzun vadede kazanılır. 'Doğru süreç' şunları içerir: Doğru hisse seçimi, doğru entry timing, doğru position sizing, doğru stop-loss, doğru kâr alma, doğru exit timing. Eğer bu süreç 'disiplinli' şekilde uygulanırsa, 'tek seferlik' kayıplar önemli değildir. 'Outcome' (sonuç) bağımlılığı, 'emotional roller coaster' (duygusal roller coaster) yaratır. 'Process' bağımlılığı, 'calm and consistent' (sakin ve tutarlı) trader yapar.

**Prensip 2: 'Risk First, Reward Second' (Önce Risk, Sonra Kâr)**

Her pozisyon öncesi, 'max risk' hesaplanmalıdır. 'Max risk' = net debit (spread'lerde) veya prim (long call/put'ta). 'Max risk', hesabın %2'sini geçmemelidir. 'Max risk' hesaplandıktan sonra, 'max reward' hesaplanabilir. 'Max reward', 'max risk' ile karşılaştırılmalıdır. Eğer 'risk/reward ratio' 1:2'den düşükse, pozisyon açılmamalıdır. 'Risk first' prensibi, 'survival' (hayatta kalma) garantisidir. 'Reward first' prensibi, 'blow up' (hesabın patlaması) riskidir.

**Prensip 3: 'Small Wins, Small Losses' (Küçük Kazançlar, Küçük Kayıplar)**

Earnings play'ler, 'home run' (dev vuruş) avcılığı değildir. 'Small wins' (küçük kazançlar) biriktirerek, 'consistent profitability' (tutarlı kazançlılık) sağlanır. 'Home run' avcılığı, genellikle 'big losses' (büyük kayıplar) yaratır. 'Small wins' hedefi: Her hafta 2-3 kazanç, 1-2 kayıp. 'Win rate' %50-60 olabilir; ancak 'average win' > 'average loss' ise, uzun vadede kazançlı olunur. 'Small wins, small losses' prensibi, 'compounding' (bileşik getiri) gücünü kullanır.

**Prensip 4: 'Journal Everything' (Her Şeyi Kaydet)**

Her pozisyon, 'journal' (günlük) kaydedilmelidir. 'Journal', sadece 'kâr/zarar' kaydetmek değil, aynı zamanda 'neden', 'nasıl', 'ne zaman', 'ne kadar' kaydetmektir. 'Journal', 'pattern recognition' (desen tanıma) için kullanılır. Örnek: 'Her Salı günü açtığım pozisyonlar kayıplı oluyor' → 'Salı günleri pozisyon açma' kuralı. 'Journal', 'continuous improvement' (sürekli iyileştirme) için hayati öneme sahiptir. 'Journal' tutmayan trader, aynı hataları tekrar tekrar yapar.

**Prensip 5: 'Sleep Well Test' (Rahat Uyuma Testi)**

Her pozisyon öncesi, kendine şunu sor: 'Bu pozisyonu açarsam, bu gece rahat uyuyabilir miyim?' Eğer cevap 'hayır' ise, pozisyon açılmamalıdır. 'Sleep well test', 'position sizing' ve 'risk tolerance' ölçüsüdür. Eğer pozisyon çok büyükse, 'anxiety' (kaygı) yaratır ve uyku bozukluğuna neden olur. 'Sleep well test', 'gut feeling' (içgüdü) ve 'risk management' arasındaki denge noktasıdır. 'Rahat uyuyamayacağın' pozisyon, 'açmamalısın' demektir.

---

## 10. Ek F: Teknik Seviyeler ve VWAP Rehberi (Earnings Play'lerde)

> **Not:** Earnings play'lerde, 'teknik analiz' (support/resistance, trend, VWAP) 'fundamental' analiz (EPS, revenue, guidance) kadar önemlidir. Earnings sonrası hisse, teknik seviyelerde 'reaksiyon' verir. Bu rehber, earnings play'lerde en sık kullanılan teknik göstergeleri açıklar.

### 10.1 Support ve Resistance Seviyeleri

Support (destek) ve Resistance (dirence), hissenin 'geçmişte' zorlandığı veya 'destek bulduğu' fiyat seviyeleridir. Earnings sonrası, hisse bu seviyelerde 'reaksiyon' verir. Eğer hisse, 'support' seviyesinin altına düşerse, 'breakdown' (kırılma) gerçekleşir ve hisse daha da düşebilir. Eğer hisse, 'resistance' seviyesinin üzerine çıkarsa, 'breakout' (kırılım) gerçekleşir ve hisse daha da yükselebilir.

Earnings play'lerde, 'support' ve 'resistance' seviyeleri, 'strike seçimi' için kullanılır. Örnek: Hisse $100, support $95, resistance $105. Bull Call Spread: 95/105 spread. Bear Put Spread: 105/95 spread. Butterfly: 95/100/105 spread. Iron Condor: 90/95/105/110 spread. Bu seviyeler, 'expected move' ile birlikte değerlendirilmelidir.

| Hisse | Yaklaşık Fiyat | Kritik Support | Kritik Resistance | Etki | Önerilen Spread |
|-------|----------------|--------------|-----------------|------|-----------------|
| **$JPM** | ~$212 | $208 | $220 | $208 altı = breakdown, $220 üstü = breakout | 208/220 Bull Call veya 208/212/216 Butterfly |
| **$BAC** | ~$43 | $40 | $46 | $40 altı = breakdown, $46 üstü = breakout | 40/46 Bull Call veya 40/43/46 Iron Condor |
| **$UNH** | ~$525 | $520 | $540 | $520 altı = breakdown, $540 üstü = breakout | 520/540 Bear Put veya 500/520/540 Put Butterfly |
| **$TSLA** | ~$265 | $255 | $275 | $255 altı = breakdown, $275 üstü = breakout | 255/265/275 Put Butterfly veya 260/250 Bear Put |
| **$GOOGL** | ~$185 | $175 | $195 | $175 altı = breakdown, $195 üstü = breakout | 175/185/195 Call Butterfly veya 180/190 Bull Call |
| **$META** | ~$585 | $570 | $600 | $570 altı = breakdown, $600 üstü = breakout | 570/585/600 Call Butterfly veya 575/595 Bull Call |
| **$MSFT** | ~$465 | $450 | $480 | $450 altı = breakdown, $480 üstü = breakout | 450/465/480 Call Butterfly veya 460/475 Bull Call |
| **$AMZN** | ~$215 | $200 | $230 | $200 altı = breakdown, $230 üstü = breakout | 200/215/230 Call Butterfly veya 210/225 Bull Call |
| **$AAPL** | ~$235 | $220 | $250 | $220 altı = breakdown, $250 üstü = breakout | 220/235/250 Call Butterfly veya 225/240 Bull Call |
| **$NKE** | ~$80 | $78 | $86 | $78 altı = breakdown, $86 üstü = breakout | 78/82/86 Call Butterfly veya 78/82 Bear Put |

### 10.2 VWAP (Volume Weighted Average Price) Rehberi

VWAP, 'hacim ağırlıklı ortalama fiyat'dır. Earnings play'lerde, VWAP 'intraday' (gün içi) trend göstergesi olarak kullanılır. Eğer hisse fiyatı, VWAP üzerindeyse, 'bullish' trend (yükseliş) devam ediyor demektir. Eğer hisse fiyatı, VWAP altındaysa, 'bearish' trend (düşüş) devam ediyor demektir. Earnings sonrası açılışta, VWAP 'anchor' (başlangıç) noktası olarak kullanılır.

Earnings play'lerde VWAP kullanımı:

- **Entry:** Eğer 'bullish' pozisyon açılacaksa, hisse fiyatı VWAP'a yaklaştığında (pullback) alınır. Eğer 'bearish' pozisyon açılacaksa, hisse fiyatı VWAP'a yaklaştığında (pullback) satılır. Bu, 'VWAP bounce' stratejisidir.
- **Exit:** Eğer 'bullish' pozisyon açıksa ve hisse fiyatı VWAP altına düşerse, pozisyon kapatılır. Eğer 'bearish' pozisyon açıksa ve hisse fiyatı VWAP üzerine çıkarsa, pozisyon kapatılır. Bu, 'VWAP stop-loss' stratejisidir.
- **Trend Confirmation:** Eğer hisse fiyatı, VWAP üzerinde ve VWAP yükseliyorsa, 'bullish' trend güçlü demektir. Eğer hisse fiyatı, VWAP altında ve VWAP düşüyorsa, 'bearish' trend güçlü demektir. Bu, 'VWAP trend' stratejisidir.

| Senaryo | VWAP Durumu | Hisse Fiyatı | Eylem | Strateji |
|---------|-------------|--------------|-------|----------|
| **Bullish Entry** | VWAP yükseliyor | VWAP'a yaklaşıyor (pullback) | CALL al veya Bull Call Spread kur | VWAP bounce |
| **Bearish Entry** | VWAP düşüyor | VWAP'a yaklaşıyor (pullback) | PUT al veya Bear Put Spread kur | VWAP rejection |
| **Bullish Stop** | VWAP düşüyor | VWAP altına düştü | CALL pozisyonunu kapat | VWAP breakdown |
| **Bearish Stop** | VWAP yükseliyor | VWAP üzerine çıktı | PUT pozisyonunu kapat | VWAP breakout |
| **Trend Confirmation** | VWAP yükseliyor | VWAP üzerinde ve uzaklaşıyor | Bullish pozisyonu 'hold' et | VWAP trend |
| **Trend Confirmation** | VWAP düşüyor | VWAP altında ve uzaklaşıyor | Bearish pozisyonu 'hold' et | VWAP trend |

### 10.3 RSI ve MACD Earnings Play'lerde

RSI (Relative Strength Index) ve MACD (Moving Average Convergence Divergence), 'momentum' göstergeleridir. Earnings play'lerde, 'pre-earnings' dönemde (T-3 ile T-1 arası) kullanılır. Earnings sonrası, 'gap' nedeniyle RSI ve MACD 'anlamsız' hale gelebilir; bu nedenle, earnings sonrası 'teknik analiz' güvenilirliği düşer.

| Gösterge | Bullish Sinyal | Bearish Sinyal | Earnings Play Kullanımı |
|----------|-------------|--------------|------------------------|
| **RSI (14)** | RSI <30 (oversold) ve yükseliyor | RSI >70 (overbought) ve düşüyor | 'Oversold' + 'bullish earnings' = Long Call. 'Overbought' + 'bearish earnings' = Long Put. |
| **MACD** | MACD line > Signal line, histogram pozitif | MACD line < Signal line, histogram negatif | 'MACD crossover' + 'earnings catalyst' = directional play. 'MACD divergence' = reversal play. |
| **Bollinger Bands** | Fiyat alt banda dokundu ve geri döndü | Fiyat üst banda dokundu ve geri döndü | 'Bollinger squeeze' + 'earnings' = volatility expansion play. 'Bollinger breakout' = momentum play. |
| **Volume** | Volume artıyor, fiyat yükseliyor | Volume artıyor, fiyat düşüyor | 'Volume confirmation' = trend güçlü. 'Volume divergence' = trend zayıflıyor. |

---

## 11. Ek G: Temmuz 2026 Günlük Earnings Takvimi (Büyük İsimler)

> **Not:** Aşağıdaki takvim, 'büyük isimler' (market cap >$10B veya 'high impact' hisseler) içindir. 'Small cap' ve 'mid cap' hisseler dahil edilmemiştir. Tarihler, 'confirmed' veya 'highly expected' (geçmiş pattern'e göre) olarak işaretlenmiştir. Tarihler yaklaştıkça güncellenmelidir.

| Hafta | Gün | Tarih | Hisse | Sektör | BMO/AMC | Strateji Önerisi | Beklenen Hareket | IV Rank |
|-------|-----|-------|-------|--------|---------|------------------|----------------|---------|
| **H1** | Çarşamba | 1 Temmuz | $GIS | Tüketim (Staples) | BMO | Bull Call Spread | ±7% | 44 |
| **H1** | Çarşamba | 1 Temmuz | $FDS | Finansal (Data) | BMO | Bull Call Spread | ±12% | 56 |
| **H2** | Salı | 14 Temmuz | $JPM | Finansal (Bank) | BMO | Bull Call Spread | ±4% | 45 |
| **H2** | Salı | 14 Temmuz | $WFC | Finansal (Bank) | BMO | Bull Call Spread | ±5% | 41 |
| **H2** | Çarşamba | 15 Temmuz | $BAC | Finansal (Bank) | BMO | Bull Call Spread | ±4% | 42 |
| **H2** | Çarşamba | 15 Temmuz | $C | Finansal (Bank) | BMO | Bull Call Spread | ±5% | 43 |
| **H2** | Çarşamba | 15 Temmuz | $GS | Finansal (Bank) | BMO | Bull Call Spread | ±5% | 48 |
| **H2** | Çarşamba | 15 Temmuz | $MS | Finansal (Bank) | BMO | Bull Call Spread | ±5% | 47 |
| **H2** | Perşembe | 16 Temmuz | $UNH | Sağlık (Insurance) | BMO | Bear Put Spread | ±6% | 52 |
| **H2** | Perşembe | 16 Temmuz | $BLK | Finansal (Asset Mgmt) | BMO | Bull Call Spread | ±4% | 50 |
| **H2** | Perşembe | 16 Temmuz | $GE | Endüstriyel | BMO | Bull Call Spread | ±6% | 47 |
| **H3** | Salı | 21 Temmuz | $NKE | Tüketim (Discretionary) | BMO | Bear Put Spread | ±9% | 58 |
| **H3** | Çarşamba | 22 Temmuz | $TSLA | Teknoloji (EV) | AMC | Long Put / Put Butterfly | ±12% | 68 |
| **H3** | Çarşamba | 22 Temmuz | $GOOGL | Teknoloji (Mega Cap) | AMC | Bull Call Spread / Call Butterfly | ±6% | 55 |
| **H3** | Perşembe | 23 Temmuz | $INTC | Teknoloji (Semiconductor) | AMC | Call Butterfly | ±8% | 62 |
| **H4** | Salı | 28 Temmuz | — | — | — | **FOMC Gün 1 — Trade yasak** | — | — |
| **H4** | Çarşamba | 29 Temmuz | $MSFT | Teknoloji (Mega Cap) | AMC | Call Butterfly | ±7% | 48 |
| **H4** | Çarşamba | 29 Temmuz | $META | Teknoloji (Mega Cap) | AMC | Call Butterfly | ±7% | 53 |
| **H4** | Çarşamba | 29 Temmuz | — | — | — | **FOMC Karar 14:00 EDT — Trade yasak** | — | — |
| **H4** | Perşembe | 30 Temmuz | $AMZN | Teknoloji (Mega Cap) | AMC | Call Butterfly | ±5% | 50 |
| **H4** | Perşembe | 30 Temmuz | $AAPL | Teknoloji (Mega Cap) | AMC | Call Butterfly | ±4% | 46 |

### 11.1 'High Impact' Günler — Özel Uyarılar

- **15 Temmuz (Çarşamba):** Bankaların 'super Wednesday'ı. JPM, BAC, C, GS, MS — 5 büyük banka aynı gün BMO açıklıyor. Bu gün, 'sektör korelasyonu' en yüksek gündür. Eğer JPM 'beat' yaptıysa, 'momentum' ile BAC ve GS pozisyonları açılabilir. Eğer JPM 'miss' yaptıysa, tüm finansal pozisyonlar kapatılmalıdır. Bu gün, max 3 finansal pozisyon açılabilir.
- **22 Temmuz (Çarşamba):** TSLA + GOOGL AMC. Bu gün, 'tech sentiment' belirleyen gündür. TSLA, 'meme stock' dinamikleriyle ±12% hareket edebilir. GOOGL, 'AI' ve 'DOJ' riskleriyle ±6% hareket edebilir. Bu gün, 'gamma squeeze' riski yüksektir. Pozisyon boyutu %50 azaltılmalıdır. 'Non-directional' stratejiler (Butterfly) tercih edilmelidir.
- **29 Temmuz (Çarşamba):** FOMC Karar + MSFT + META AMC. Bu gün, Temmuz'un 'en kritik' günüdür. FOMC kararı (14:00 EDT), piyasa volatilitesini artırır. MSFT ve META earnings (16:00-16:05 EDT), 'tech sentiment' belirler. Bu gün, 14:00 öncesi tüm pozisyonlar kapatılmalıdır. 14:00-16:00 arası trade yasaktır. 16:00 sonrası, 'after-market' earnings takip edilmelidir.
- **30 Temmuz (Perşembe):** AMZN + AAPL AMC. FOMC sonrası piyasa 'settle' olduktan sonra, AMZN ve AAPL pozisyonları açılabilir. Ancak, pozisyon boyutu %75 azaltılmalıdır. Max 2 pozisyon. 'Non-directional' stratejiler (Butterfly) tercih edilmelidir. Blackout bitişi (Fed yetkilileri konuşmaya başlar) nedeniyle, piyasa volatilitesi yüksek kalabilir.

---

## 12. Ek H: VIX Rejim Değişim Senaryoları ve Eylem Planları

### 12.1 Senaryo 1: VIX 16.89'dan 25'e Sıçrama (FOMC Öncesi)

**Tetikleyici:** FOMC yaklaşması, 'hawkish' beklenti, 'macro surprise' (CPI, NFP), jeopolitik kriz.

**Zamanlama:** 20-27 Temmuz arası olası.

**Eylem Planı:**
1. **VIX 18-20:** Pozisyon boyutu %25 azalt. 'Tight stop-loss' uygula. 'Directional' pozisyonları 'non-directional'a çevir (Long Call/Put → Butterfly).
2. **VIX 20-25:** Pozisyon boyutu %50 azalt. Yeni pozisyon açma sınırlandırılır. Sadece 'high conviction' play'ler açılabilir. 'Iron Condor' ve 'Calendar Spread' tercih edilir.
3. **VIX 25+:** Pozisyon boyutu %75 azalt. Max 2 pozisyon. 'Cash' oranı %50'ye çıkar. FOMC kararına kadar 'wait and see'.

### 12.2 Senaryo 2: VIX 16.89'dan 12'ye Düşüş (Ultra Low Fear)

**Tetikleyici:** 'Dovish' FOMC beklentisi, 'soft landing' narrative, 'tech rally' devamı, 'low volatility' regime.

**Zamanlama:** 6-13 Temmuz arası olası.

**Eylem Planı:**
1. **VIX 15-12:** 'Agresif' pozisyonlar düşünülebilir. Long Call/Put stratejileri tercih edilir. 'Position sizing' normal boyutta.
2. **VIX <12:** 'Ultra low fear' rejimi. 'Underreaction' riski yüksektir. 'High conviction' play'ler seçilmelidir. 'Iron Condor' ve 'Butterfly' stratejileri, 'VIX'in daha da düşme alanı az' olduğu için 'low reward' olabilir.
3. **VIX <10:** 'Complacency' (kendini kollama) rejimi. 'Black swan' riski artar. Pozisyon boyutu %25 azalt. 'Protective put' (koruyucu put) düşünülebilir.

### 12.3 Senaryo 3: FOMC Sonrası 'Knee-Jerk' Reaksiyon (VIX 30+ Sıçrama)

**Tetikleyici:** FOMC 'hawkish' kararı, 'dot plot' değişikliği, Powell 'agresif' ton.

**Zamanlama:** 29 Temmuz 14:00-16:00 EDT.

**Eylem Planı:**
1. **14:00-14:30:** Tüm pozisyonlar kapatılmış olmalıdır. 'Knee-jerk' reaksiyon izlenir. Trade yasaktır.
2. **14:30-16:00:** Powell basın toplantısı. 'Hawkish' veya 'dovish' dil tonu belirlenir. Trade yasaktır.
3. **16:00-20:00:** After-market 'settle' olur. Eğer VIX 30+ ise, 48 saat 'wait and see'. Eğer VIX 25-30 ise, 24 saat 'wait and see'. Eğer VIX <25 ise, 'cautious' pozisyon açılabilir.
4. **Ertesi Gün (30 Temmuz):** Eğer piyasa 'settle' olduysa, AMZN ve AAPL pozisyonları açılabilir (max 2, %75 azaltılmış boyut). Eğer piyasa hala 'whipsaw' yapıyorsa, pozisyon açma ertelenir.

### 12.4 Senaryo 4: 'Earnings Miss' Domino Etkisi (Sektör Korelasyonu)

**Tetikleyici:** JPM 'miss' → tüm bankalar düşer. TSLA 'miss' → tüm tech düşer. UNH 'miss' → tüm sağlık düşer.

**Zamanlama:** Hafta 2 (JPM), Hafta 3 (TSLA), Hafta 2 (UNH).

**Eylem Planı:**
1. **JPM 'Miss' (15 Temmuz):** Tüm finansal pozisyonlar kapatılır. $BAC, $GS, $C, $WFC pozisyonları açılmaz. 'Index hedge' (SPY PUT) değerlendirilir.
2. **TSLA 'Miss' (22 Temmuz):** Tüm tech pozisyonları 'review' edilir. Eğer 'tech sentiment' bozulursa, GOOGL, INTC, META, MSFT, AMZN, AAPL pozisyonları kapatılır. 'QQQ PUT' değerlendirilir.
3. **UNH 'Miss' (16 Temmuz):** Tüm sağlık pozisyonları 'review' edilir. Eğer 'healthcare sentiment' bozulursa, JNJ, PFE, ABT, TMO pozisyonları kapatılır. 'XLV PUT' (healthcare ETF put) değerlendirilir.
4. **Domino Etkisi Yönetimi:** 'Cross-sector' hedge'ler, 'domino etkisi' riskini azaltır. Eğer 'bankalar' düşerse, 'tech' yükseliyorsa, portföy dengelenir. Bu nedenle, 'cross-sector' diversifikasyon hayati önemdedir.

---

## 13. Sonuç ve Özet

Temmuz 2026 earnings sezonu, 'FOMC haftası' (28-29 Temmuz) nedeniyle olağanüstü bir risk profiline sahiptir. VIX 16.89 (Low Fear) ile başlayan sezon, FOMC yaklaştıkça VIX 20-25 aralığına tırmanabilir. Bu nedenle, 'agresif' pozisyonlar (Hafta 1-2) 'cautious' pozisyonlara (Hafta 3-4) dönüştürülmelidir.

### Temmuz 2026 Earnings Stratejisi Özeti

| Hafta | Risk | Max Pozisyon | Strateji | Özel Kurallar |
|-------|------|--------------|----------|---------------|
| **Hafta 1 (6-10 Temmuz)** | 🟢 Düşük | Normal | Long Call/Put, Debit Spread | Paper trade, watchlist oluşturma |
| **Hafta 2 (13-17 Temmuz)** | 🟡 Orta | Normal | Debit Spread, Butterfly | Sektör korelasyonu (bankalar), max 3 aynı sektör |
| **Hafta 3 (20-24 Temmuz)** | 🟠 Yüksek | %50 azalt | Butterfly, Iron Condor | FOMC öncesi, gamma squeeze riski, VIX artışı |
| **Hafta 4 (27-31 Temmuz)** | 🔴 Kritik | %75 azalt | Iron Condor, Cash | FOMC haftası, max 2 pozisyon, 28-29 Temmuz trade yasak |

### 5 Altın Kural

1. **Max Hold 2 Gün:** Earnings play'ler, 2 günden fazla tutulamaz. Bu, IV Crush ve Theta decay riskini sınırlar.
2. **Tek Hisse Max %2:** 'Tek hisse felaketi' riskini sınırlar. 'Survival' için hayati önemdedir.
3. **Min %20 Cash:** 'Fırsat kapıları' ve 'margin call' riski için hazır nakit.
4. **Stop-Loss Uygula:** -%30'da yarı kapat, -%50'de tam kapat. 'Hope' ile tutma YASAKTIR.
5. **Kâr Al:** +%50'de yarı kapat, +%100'de %75 kapat. 'Greed' en büyük düşmandır.

### FOMC ve Blackout Özeti

| Dönem | Tarih | Eylem |
|-------|-------|-------|
| **Blackout Başlangıcı** | 18 Temmuz | Yeni pozisyon açma sınırlandırılır |
| **Blackout Haftası 2** | 25-27 Temmuz | Yeni pozisyon açma YASAKTIR |
| **FOMC Günleri** | 28-29 Temmuz | 14:00 öncesi tüm pozisyonlar kapatılır, 14:00-16:00 trade yasak |
| **Blackout Bitişi** | 30 Temmuz | Fed yetkilileri konuşmaya başlar, yeni pozisyon açma ertelenir |

### Ağustos 2026 Preview Özeti

- **En Kritik Hisse:** $NVDA (Q2 FY2027, ~19-21 Ağustos). AI revenue sustainability ve 'Blackwell' chip demand belirleyici.
- **FOMC Etkisi:** Temmuz FOMC kararı, Ağustos piyasasını etkiler. 'Hawkish' = 'risk-off', 'Dovish' = 'risk-on'.
- **Yaz Sezonu:** 'Summer doldrums' etkisiyle hacimler düşük olabilir. 'Thin market' riski, oynaklığı artırabilir.

---

## 14. Ek I: Hızlı Başvuru Kartı (Quick Reference Card)

### Earnings Play Hızlı Kontrol Listesi

- [ ] Hisse earnings tarihi doğrulandı (Yahoo Finance, company IR)
- [ ] IV Rank >50 (yüksek IV Crush potansiyeli)
- [ ] Expected move hesaplandı (ATM straddle)
- [ ] Teknik seviyeler belirlendi (support, resistance, VWAP)
- [ ] Haber akışı kontrol edildi (catalyst, guidance, macro)
- [ ] Strateji seçildi (Long Call/Put, Spread, Butterfly, Iron Condor)
- [ ] DTE 5-9 (⛔ 21+ DTE YASAK)
- [ ] Entry timing: T-2 ile T-5 arası
- [ ] Position sizing: Tek hisse max %2, sektör max %15
- [ ] Stop-loss seviyesi belirlendi (-%30 yarı kapat, -%50 tam kapat)
- [ ] Kâr alma seviyesi belirlendi (+%50 yarı kapat, +%100 %75 kapat)
- [ ] Exit planı hazır (BMO = ertesi gün açılış, AMC = ertesi gün açılış)
- [ ] Max hold 2 gün (48 saat sonra kapat, kârda veya zararda)
- [ ] FOMC/Blackout kontrolü yapıldı (Blackout = sınırlandırma, FOMC = yasak)
- [ ] VIX rejimi kontrol edildi (VIX >25 = %50 azalt, VIX >35 = nakit)
- [ ] Cash reserve >%20
- [ ] 'Sleep well test' yapıldı (bu gece rahat uyuyabilir miyim?)
- [ ] 'Journal' kaydı hazır (pozisyon açıldıktan sonra doldurulacak)

### Acil Durum Protokolü

| Durum | Eylem | Zaman |
|-------|-------|-------|
| **VIX >35** | Tüm pozisyonları kapat, 48 saat nakit bekle | Hemen |
| **FOMC Kararı (14:00)** | Tüm pozisyonları kapat, 14:00-16:00 trade yasak | 14:00 öncesi |
| **Hisse Gap Down >%15** | Pozisyonu kapat, 'domino etkisi' kontrolü | Açılışta |
| **Hisse Gap Up >%15** | Pozisyonun %50'sini kapat, kalanı trailing stop | Açılışta |
| **Broker Platform Çökmesi** | Telefon ile broker'ı ara, pozisyonu kapat | Hemen |
| **Margin Call** | Pozisyonları kapat, nakit rezervini kullan | Hemen |
| **Assignment Alındı** | Ertesi gün hisseyi kapat veya 'cover' et | Ertesi gün 09:30 |

---

**Rapor Sonu.**

**Versiyon:** v4.0-FINAL | **Tarih:** 1 Temmuz 2026 | **Agent:** Gistify Earning Strategy — Agent 4 (Bütçe + Risk + Portföy + Eylem Planı) | **Rolling Window:** Temmuz 2026 + Ağustos 2026

---

## 15. Ek J: Detaylı Portföy Analizi ve Senaryo Matrisi

### 15.1 Senaryo Matrisi: Piyasa Durumu × Portföy Eylemi

| Piyasa Durumu | VIX Seviyesi | S&P 500 Trend | Earnings Tonu | Önerilen Portföy Eylemi | Strateji Değişikliği |
|---------------|--------------|---------------|-------------|------------------------|---------------------|
| **Bullish Earnings** | VIX 15-18 | Yükseliş | Beat-heavy | Agresif: Long Call, Bull Call Spread | Pozisyon boyutu normal, tek hisse max %2 |
| **Mixed Earnings** | VIX 18-22 | Yatay | Beat-Miss karışık | Nötr: Butterfly, Iron Condor | Pozisyon boyutu normal, yön dağılımı %50-50 |
| **Bearish Earnings** | VIX 22-28 | Düşüş | Miss-heavy | Defansif: Bear Put Spread, Cash | Pozisyon boyutu %50 azalt, cash %40 |
| **FOMC Öncesi** | VIX 20-25 | Belirsiz | Beklemede | Ultra-Defansif: Iron Condor, Cash | Pozisyon boyutu %75 azalt, yeni pozisyon yasak |
| **FOMC Sonrası** | VIX 25-35 | Volatil | Beklemede | Bekle-Gör: 48 saat nakit | Tüm pozisyonlar kapat, piyasa 'settle' olana kadar bekle |
| **Blackout Dönemi** | VIX 18-22 | Yatay | Sınırlı bilgi | Sınırlı: Sadece zorunlu earnings play'ler | Pozisyon boyutu %50, tek hisse max %1 |

### 15.2 Haftalık Portföy Rotasyonu: Hafta 1'den Hafta 4'e

| Hafta | Piyasa Tonu | Risk | Strateji Ağırlığı | Örnek Pozisyon Dağılımı | Cash Oranı |
|-------|------------|------|-------------------|------------------------|------------|
| **Hafta 1** | 'Fresh start', tatili sonrası | Düşük | %60 Debit Spread, %30 Long Call/Put, %10 Butterfly | 5 Spread, 2 Long, 1 Butterfly | %20 |
| **Hafta 2** | Bankalar, 'tone-setting' | Orta | %50 Debit Spread, %30 Butterfly, %20 Long Call/Put | 4 Spread, 2 Butterfly, 2 Long | %25 |
| **Hafta 3** | Tech, FOMC countdown | Yüksek | %60 Butterfly, %30 Iron Condor, %10 Cash | 3 Butterfly, 2 Iron Condor, 1 Long | %35 |
| **Hafta 4** | FOMC, 'event risk' | Kritik | %40 Iron Condor, %50 Cash, %10 Butterfly | 1 Iron Condor, 1 Butterfly | %60 |

### 15.3 'Rollercoaster' Senaryosu: Portföy Başlangıçtan Bitişe

**Başlangıç (1 Temmuz):** VIX 16.89, S&P 500 ~7,499, hesap $10,000. Portföy: 10 pozisyon, %80 risk, %20 cash.

**Hafta 1 Sonu (10 Temmuz):** VIX 17.50, S&P 500 ~7,520. Paper trade haftası. Gerçek pozisyon: Yok veya 1-2 small pozisyon. Sonuç: +$50 (paper trade kazancı). Cash: %95.

**Hafta 2 Sonu (17 Temmuz):** VIX 18.20, S&P 500 ~7,480. Bankalar 'mixed' (JPM beat, BAC miss). Portföy: 5 pozisyon. Sonuç: +$200 (JPM kazancı), -$150 (BAC kaybı). Net: +$50. Cash: %70.

**Hafta 3 Sonu (24 Temmuz):** VIX 22.50, S&P 500 ~7,350. Tech 'miss' (TSLA delivery miss, GOOGL guidance weak). Portföy: 3 pozisyon (azaltılmış boyut). Sonuç: +$180 (TSLA Put kazancı), -$120 (GOOGL Call kaybı). Net: +$60. Cash: %80. FOMC öncesi pozisyonlar kapatıldı.

**Hafta 4 Sonu (31 Temmuz):** VIX 19.50 (FOMC sonrası 'dovish' çıkış), S&P 500 ~7,550. Portföy: 1-2 pozisyon (çok azaltılmış). Sonuç: +$100 (AMZN Call kazancı). Net: +$100. Cash: %85.

**Aylık Toplam:** +$260 (+%2.6). 'Survival' odaklı bir ay. FOMC riskinden korunarak, kâr elde edildi. 'Process' doğru uygulandı.

### 15.4 'Best Case' Senaryosu: Portföy Başlangıçtan Bitişe

**Başlangıç (1 Temmuz):** VIX 16.89, S&P 500 ~7,499, hesap $10,000.

**Hafta 2:** JPM 'beat' (+$400), BAC 'beat' (+$300), UNH 'beat' ama bearish pozisyon (-$200). Net: +$500. Cash: %60.

**Hafta 3:** TSLA 'miss' (-$280), GOOGL 'beat' (+$350), INTC 'beat' (+$200). Net: +$270. Cash: %70. FOMC öncesi pozisyonlar kapatıldı.

**Hafta 4:** FOMC 'dovish' (+$0, trade yasak). MSFT 'beat' (+$300), META 'beat' (+$250). Net: +$550. Cash: %50.

**Aylık Toplam:** +$1,320 (+%13.2). 'Best case' senaryosu. 'High conviction' play'ler, doğru timing, ve 'discipline' ile elde edildi. 'Greed' ile değil, 'process' ile kazanıldı.

### 15.5 'Worst Case' Senaryosu: Portföy Başlangıçtan Bitişe

**Başlangıç (1 Temmuz):** VIX 16.89, S&P 500 ~7,499, hesap $10,000.

**Hafta 2:** JPM 'miss' (-$400), BAC 'miss' (-$300), UNH 'beat' ama bearish pozisyon (-$200). Net: -$900. Cash: %60. 'Sektör korelasyonu' felaketi.

**Hafta 3:** TSLA 'surprise beat' (+$0, bearish pozisyon kaybı -$280), GOOGL 'miss' (-$350), INTC 'miss' (-$200). Net: -$830. Cash: %70. 'Directional bias' aşırısı.

**Hafta 4:** FOMC 'hawkish' (+$0, trade yasak). MSFT 'miss' (-$300), META 'miss' (-$250). Net: -$550. Cash: %50. 'Event risk' felaketi.

**Aylık Toplam:** -$2,280 (-%22.8). 'Worst case' senaryosu. 'Sektör korelasyonu', 'directional bias', ve 'event risk' bir araya geldi. Ancak, 'tek hisse max %2' ve 'max %20 cash' kuralları nedeniyle, portföy 'blow up' (patlama) olmadı. 'Survival' mümkün.

### 15.6 'Expected Case' (Beklenen) Senaryosu: Portföy Başlangıçtan Bitişe

**Başlangıç (1 Temmuz):** VIX 16.89, S&P 500 ~7,499, hesap $10,000.

**Hafta 2:** JPM 'beat' (+$300), BAC 'in-line' (-$100), UNH 'miss' (+$200, bearish pozisyon). Net: +$400. Cash: %65.

**Hafta 3:** TSLA 'miss' (+$200, bearish pozisyon), GOOGL 'in-line' (-$100), INTC 'beat' (+$150). Net: +$250. Cash: %75. FOMC öncesi pozisyonlar kapatıldı.

**Hafta 4:** FOMC 'neutral' (+$0, trade yasak). MSFT 'beat' (+$200), META 'in-line' (-$100). Net: +$100. Cash: %70.

**Aylık Toplam:** +$750 (+%7.5). 'Expected case' senaryosu. 'Realistic' bir kazanç. 'Process' doğru uygulandı, 'discipline' korundu, 'risk management' etkiliydi. Bu, 'sustainable' (sürdürülebilir) bir kazanç oranıdır.

---

## 16. Ek K: Opsiyon Chain Okuma Rehberi (Earnings Play'ler için)

### 16.1 Opsiyon Chain Temel Terimler

| Terim | Açıklama | Earnings Play Önemi |
|-------|----------|---------------------|
| **Strike** | Opsiyonun 'uygulama fiyatı'. CALL: strike üzerinde = ITM, altında = OTM. PUT: strike altında = ITM, üzerinde = OTM. | ATM veya yakın ATM strike'lar tercih edilir. OTM (0.30-0.40 Delta) idealdir. |
| **Expiry** | Opsiyonun 'son kullanma tarihi'. Earnings haftası expiry'si en idealidir. | 5-9 DTE tercih edilir. Earnings haftası içindeki expiry, IV Crush potansiyeli en yüksek olanıdır. |
| **Bid** | Alıcıların ödemeye hazır olduğu fiyat. | 'Bid' fiyatından satış yapılabilir. 'Bid-ask spread' ne kadar dar ise, likidite o kadar yüksektir. |
| **Ask** | Satıcıların kabul etmeye hazır olduğu fiyat. | 'Ask' fiyatından alış yapılabilir. 'Limit order' ile 'mid-price' (bid-ask ortası) hedeflenebilir. |
| **Last** | Son işlem fiyatı. | 'Last' fiyatı, 'real-time' fiyat değil; son işlem fiyatıdır. 'Bid-ask' aralığı daha önemlidir. |
| **Volume** | O gün işlem gören kontrat sayısı. | Volume >1000 = likit. Volume <500 = illikit (spread maliyeti yüksek). |
| **Open Interest (OI)** | Açık pozisyon sayısı (toplam). | OI >5000 = likit. OI <1000 = illikit. 'Volume > OI' = yeni ilgi. 'Volume < OI' = eski pozisyon kapanıyor. |
| **Implied Volatility (IV)** | Piyasanın 'beklenen oynaklığı'. | Yüksek IV = pahalı opsiyon (IV Crush potansiyeli yüksek). Düşük IV = ucuz opsiyon (IV Crush potansiyeli düşük). |
| **Delta** | Hisse fiyatındaki $1 değişime karşı opsiyon fiyatındaki değişim. | 0.30-0.40 Delta hedeflenir. 'Directional exposure' ölçüsüdür. |
| **Gamma** | Delta'nın hisse fiyatındaki $1 değişime karşı duyarlılığı. | Yüksek Gamma = 'delta acceleration' (hızlı kâr/zarar). 'Meme stocks' (TSLA, INTC) yüksek Gamma taşır. |
| **Theta** | Zaman decay (her geçen gün opsiyon fiyatının erimesi). | Negatif Theta = long opsiyonlarda günlük kayıp. 'Short hold' (2 gün) Theta riskini sınırlar. |
| **Vega** | IV'deki %1 değişime karşı opsiyon fiyatındaki değişim. | Yüksek Vega = IV Crush'dan büyük kayıp riski. 'Vega hedge' (Butterfly, Iron Condor) kritik. |

### 16.2 Opsiyon Chain Okuma Örneği: $JPM 15 Temmuz BMO

**Hisse Fiyatı:** ~$212  
**Earnings:** 15 Temmuz BMO  
**Opsiyon Expiry:** 18 Temmuz (3 DTE)  
**IV Rank:** ~45

| Strike | Tip | Bid | Ask | Last | Volume | OI | Delta | Gamma | Theta | Vega | Not |
|--------|-----|-----|-----|------|--------|----|-------|-------|-------|------|-----|
| 210 | CALL | $4.80 | $5.20 | $5.00 | 1200 | 8500 | 0.55 | 0.065 | -0.22 | 0.35 | ITM, yüksek Delta, pahalı |
| 212.5 | CALL | $3.20 | $3.60 | $3.40 | 1500 | 6200 | 0.45 | 0.075 | -0.28 | 0.38 | ATM, ideal Delta, orta maliyet |
| 215 | CALL | $2.10 | $2.50 | $2.30 | 1800 | 7800 | 0.35 | 0.085 | -0.32 | 0.42 | OTM, ideal Delta, ucuz |
| 217.5 | CALL | $1.30 | $1.60 | $1.45 | 900 | 3400 | 0.25 | 0.070 | -0.25 | 0.35 | Çok OTM, düşük Delta, 'lottery ticket' |
| 210 | PUT | $2.00 | $2.40 | $2.20 | 800 | 4500 | -0.35 | 0.060 | -0.20 | 0.30 | OTM, bearish hedge |
| 212.5 | PUT | $3.00 | $3.40 | $3.20 | 1100 | 5600 | -0.45 | 0.075 | -0.28 | 0.38 | ATM, bearish hedge |
| 215 | PUT | $4.20 | $4.60 | $4.40 | 600 | 2800 | -0.55 | 0.065 | -0.22 | 0.35 | ITM, bearish hedge |

**Earnings Play Önerisi:**
- **Bullish:** 212.5 CALL (Delta 0.45, maliyet ~$3.40) veya 215 CALL (Delta 0.35, maliyet ~$2.30). 212.5 CALL, 'directional' play için ideal. 215 CALL, 'lottery ticket' mantığında.
- **Bearish:** 212.5 PUT (Delta -0.45, maliyet ~$3.20) veya 210 PUT (Delta -0.35, maliyet ~$2.20). 212.5 PUT, 'directional' play için ideal. 210 PUT, 'hedge' veya 'lottery ticket'.
- **Spread:** 210/215 Bull Call Spread (net debit ~$2.20, max kâr $2.80). 215/210 Bear Put Spread (net debit ~$2.20, max kâr $2.80).
- **Butterfly:** 208/212.5/217.5 Call Butterfly (net debit ~$1.10, max kâr $3.40). 'Non-directional' play için ideal.

**Not:** 18 Temmuz expiry (3 DTE), earnings'ten 3 gün sonra. Bu, 'IV Crush' potansiyeli en yüksek expiry'dir. Ancak, 3 DTE çok kısa vadelidir; 'time decay' (Theta) çok hızlıdır. Eğer 25 Temmuz expiry varsa (10 DTE), bu daha 'balanced' olabilir. Ancak, 25 Temmuz expiry'sinde IV Crush daha az şiddetli olabilir (çünkü earnings'ten 10 gün sonra). 'Sweet spot': 5-9 DTE arası.

---

## 17. Ek L: Earnings Play 'Journal' Şablonu (Günlük Kullanım)

### 17.1 Günlük Earnings Play Journal

Her gün, aşağıdaki şablonu doldurarak 'journal' tutun. Bu, 'continuous improvement' için hayati öneme sahiptir.

```
=== TARİH: [GG/AA/YYYY] ===
=== GÜN: [Pazartesi/Salı/Çarşamba/Perşembe/Cuma] ===

--- PRE-MARKET (08:00-09:30 EDT) ---
VIX: [_____] | S&P 500 Futures: [_____] | Nasdaq Futures: [_____]
Haber Akışı: [_____]
Bugünkü Earnings: [_____]
Makro Veriler: [_____]

--- MARKET OPEN (09:30 EDT) ---
SPY Açılış: [_____] | QQQ Açılış: [_____] | IWM Açılış: [_____]
Hacim: [_____] (normalin %_____'si)

--- POZİSYONLAR ---
[Pozisyon 1]
Hisse: [_____] | Strateji: [_____] | Yön: [_____] | Maliyet: [_____]
Entry: [_____] | Exit Planı: [_____] | Stop-Loss: [_____] | Kâr Hedefi: [_____]
Gün Sonu Değer: [_____] | Kâr/Zarar: [_____] (_____%)

[Pozisyon 2]
Hisse: [_____] | Strateji: [_____] | Yön: [_____] | Maliyet: [_____]
Entry: [_____] | Exit Planı: [_____] | Stop-Loss: [_____] | Kâr Hedefi: [_____]
Gün Sonu Değer: [_____] | Kâr/Zarar: [_____] (_____%)

--- DERSLER ---
Bugün Ne Öğrendim: [_____]
Yarın Ne Yapacağım Farklı: [_____]
Bugünün Hatası: [_____]
Bugünün Başarısı: [_____]

--- KAPANIŞ (16:00 EDT) ---
VIX Kapanış: [_____] | SPY Kapanış: [_____] | QQQ Kapanış: [_____]
Günün Kâr/Zarar: [_____] (_____%)
Ayın Kümülatif Kâr/Zarar: [_____] (_____%)
Cash Oranı: [_____] (%_____)
```

### 17.2 Aylık Earnings Play Özeti

Her ay sonunda, aşağıdaki özet şablonu doldurun.

```
=== AY: [Ay YYYY] ===
=== TOPLAM POZİSYON: [_____] ===

--- KAZANÇ/ZARAR ÖZETİ ---
Toplam Kâr: [_____] ($_____)
Toplam Zarar: [_____] ($_____)
Net Kâr/Zarar: [_____] ($_____) (_____%)
Win Rate: [_____]/% (_____ kazanç / _____ toplam)
Average Win: [_____] ($_____)
Average Loss: [_____] ($_____)
Risk/Reward Ratio: [_____]

--- STRATEJİ PERFORMANSI ---
Long Call/Put: [_____] kazanç / [_____] toplam ([_____]% win rate)
Bull Call Spread: [_____] kazanç / [_____] toplam ([_____]% win rate)
Bear Put Spread: [_____] kazanç / [_____] toplam ([_____]% win rate)
Butterfly: [_____] kazanç / [_____] toplam ([_____]% win rate)
Iron Condor: [_____] kazanç / [_____] toplam ([_____]% win rate)

--- SEKTÖR PERFORMANSI ---
Finansal: [_____] kazanç / [_____] toplam ([_____]% win rate)
Teknoloji: [_____] kazanç / [_____] toplam ([_____]% win rate)
Sağlık: [_____] kazanç / [_____] toplam ([_____]% win rate)
Tüketim: [_____] kazanç / [_____] toplam ([_____]% win rate)

--- DERSLER VE GELİŞİM ALANLARI ---
Bu Ay En İyi Yaptığım: [_____]
Bu Ay En Kötü Yaptığım: [_____]
Gelecek Ay Geliştireceğim: [_____]
Strateji Değişikliği: [_____]
Risk Management Değişikliği: [_____]
Psikoloji Değişikliği: [_____]
```

---

## 18. Ek M: Sıkça Sorulan Sorular (FAQ)

### Q1: Earnings play'lerde 'hangi strateji' en iyi?

**A:** 'En iyi' strateji yoktur. 'En uygun' strateji, hissenin karakterine, IV Rank'ine, 'expected move'una, ve sizin 'risk tolerance'ınıza bağlıdır. Genel kural: 'Beginner' = Debit Spread, 'Intermediate' = Butterfly, 'Advanced' = Ratio/Calendar. 'High IV' = 'non-directional' (Butterfly, Iron Condor), 'Low IV' = 'directional' (Long Call/Put, Spread).

### Q2: 'Earnings'ten kaç gün önce' girmeliyim?

**A:** Ideal entry, earnings'ten 2-5 gün öncedir. Çok erken (T-7+) IV henüz yükselmemiştir, Theta decay yavaştır. Çok geç (T-1) IV zaten zirvededir, premium pahalıdır, ve bid-ask spread genişler. 'Sweet spot': T-3 ile T-5 arası.

### Q3: 'Earnings sonrası ne zaman çıkmalıyım'?

**A:** BMO (Before Market Open) açıklamalarında, açılışta (09:30-10:00) çıkılır. AMC (After Market Close) açıklamalarında, ertesi gün açılışta (09:30-10:00) çıkılır. Max hold 2 gündür. 'IV Crush', BMO için açılışta, AMC için ertesi gün açılışta gerçekleşir. 'Too late' çıkmak, Theta decay ve IV Crush kaybına neden olur.

### Q4: 'Tek hisse max %2' kuralını ihlal edersem ne olur?

**A:** 'Ego' ile trade yaparsınız. Earnings play'lerde, 'tek hisse felaketi' riski yüksektir. Eğer hisse %20 düşerse ve pozisyon %5 ise, portföyün %5'i kaybedilir. Bu, 'survival' için ciddi bir tehdittir. 'Compound interest' (bileşik getiri) gücü için, 'small losses' (küçük kayıplar) kritiktir. 'Max %2' kuralı, 'compound interest' gücünü korur.

### Q5: 'FOMC haftasında' earnings play yapabilir miyim?

**A:** FOMC haftasında (28-29 Temmuz), earnings play yapmak 'extremely risky'dir. 28-29 Temmuz'da trade yasaktır. Eğer 'zorunlu' pozisyonlar varsa (MSFT, META 29 Temmuz AMC), 28 Temmuz öncesi açılmalıdır ve max %25 azaltılmış boyutta olmalıdır. 14:00 öncesi tüm pozisyonlar kapatılmalıdır. FOMC sonrası, 'knee-jerk' reaksiyondan kaçının.

### Q6: 'VIX 35+' seviyesinde ne yapmalıyım?

**A:** 'Panic' rejimi. Tüm pozisyonları kapatın. 48-72 saat nakit bekleyin. 'VIX futures' 'contango' yapıyorsa (VIX futures > spot VIX), VIX'in gelecekte düşeceği beklentisi vardır. Ancak, 'catching a falling knife' riski yüksektir. Sabırlı olun. Fırsatlar, 'calm' dönemlerde gelir.

### Q7: '21 DTE' neden yasak?

**A:** 21 DTE, 'earnings play' değil, 'swing trade' olur. Earnings play'lerin karakteri, 'short-term' (2-5 gün) IV Crush'dan kazanç sağlamaktır. 21 DTE, Theta decay yavaşlatır, IV Crush potansiyelini azaltır, ve 'opportunity cost' (fırsat maliyeti) artırır. Earnings play'lerde, 5-9 DTE 'sweet spot'tır. 21+ DTE, 'farklı bir strateji' (directional swing) gerektirir.

### Q8: 'Paper trade' (simülasyon) ne zaman yapmalıyım?

**A:** Her zaman. Özellikle, yeni strateji denemeden önce, 'complex' strateji (Ratio, Calendar) kullanmadan önce, ve 'new market regime' (yeni piyasa rejimi) dönemlerinde. 'Paper trade', 'risk-free' öğrenme imkanı sunar. 'Paper trade' kazançlarınızın %70'i, 'real money' kazançlarınıza yakınsa, 'real money' geçebilirsiniz.

### Q9: 'Hangi broker' en iyi?

**A:** Bütçenize ve deneyim seviyenize bağlıdır. $1K-$5K: Robinhood/Webull (basit, $0 commission). $5K-$25K: TastyTrade ('probability of profit', 'IV Rank' göstergeleri). $25K+: ThinkorSwim (gelişmiş analiz, 'paperMoney') veya Interactive Brokers (düşük commission, 'portfolio margin'). 'En iyi' broker, 'size en uygun' broker'dır.

### Q10: 'Earnings play'lerde 'teknik analiz' ne kadar önemli?

**A:** Çok önemli. Earnings play'lerde, 'fundamental' analiz (EPS, revenue, guidance) sadece 'beklenti' yaratır. 'Teknik' analiz (support, resistance, trend, VWAP), 'entry' ve 'exit' noktalarını belirler. Earnings sonrası, hisse 'teknik seviyelerde' reaksiyon verir. 'Technical analysis' olmadan, 'blind' trade yaparsınız.

---

## 19. Ek N: 'Cheat Sheet' (Hızlı Başvuru Tablosu)

### Earnings Play 'Cheat Sheet' (Tek Sayfalık)

| Kategori | Kural | Hatırlatma |
|----------|-------|------------|
| **Entry** | T-2 ile T-5 arası | Çok erken = düşük IV, çok geç = pahalı premium |
| **Exit** | BMO = açılış, AMC = ertesi gün açılış | Max 2 gün tutma |
| **DTE** | 5-9 DTE | ⛔ 21+ DTE YASAK |
| **Position** | Tek hisse max %2, sektör max %15 | 'Survival' için hayati |
| **Cash** | Min %20 | 'Fırsat' ve 'margin call' için |
| **Stop** | -%30 yarı kapat, -%50 tam kapat | 'Hope' ile tutma YASAKTIR |
| **Profit** | +%50 yarı kapat, +%100 %75 kapat | 'Greed' en büyük düşman |
| **VIX** | <15 = agresif, 15-20 = normal, 20-25 = %50 azalt, >35 = nakit | VIX rejimi = risk metreği |
| **FOMC** | Blackout = sınırlandırma, FOMC günü = yasak | 28-29 Temmuz trade yasak |
| **Hedge** | En az %30 pozisyon ters yönde | 'Market surprise' koruması |
| **Journal** | Her pozisyon kaydet | 'Continuous improvement' |
| **Sleep** | 'Bu gece rahat uyuyabilir miyim?' | 'Risk tolerance' testi |

### FOMC 'Cheat Sheet' (Tek Sayfalık)

| Dönem | Tarih | Eylem | Risk Seviyesi |
|-------|-------|-------|---------------|
| Blackout Başlangıcı | 18 Temmuz | Yeni pozisyon sınırlandırılır | 🔴 Yüksek |
| Blackout Haftası 2 | 25-27 Temmuz | Yeni pozisyon YASAK | 🔴🔴 Kritik |
| FOMC Gün 1 | 28 Temmuz | Pozisyon %50 kapat, 14:00 öncesi tam kapat | 🔴🔴 Kritik |
| FOMC Karar | 29 Temmuz 14:00 | Trade YASAK | 🔴🔴 Kritik |
| Basın Toplantısı | 29 Temmuz 14:30 | Trade YASAK | 🔴🔴 Kritik |
| FOMC Sonrası | 29-30 Temmuz | 48 saat 'wait and see' | 🟠 Yüksek |
| Blackout Bitişi | 30 Temmuz | Fed konuşmaları, pozisyon açma ertele | 🔴 Yüksek |

### Strateji 'Cheat Sheet' (Tek Sayfalık)

| Strateji | Bütçe | Risk | Kâr | Kullanım | Earnings Uygunluğu |
|----------|-------|------|-----|----------|-------------------|
| Long Call/Put | $10-$50 | %100 | Sınırsız | Yüksek IV, net yön | ⚠️ IV Crush riski yüksek |
| Bull/Bear Spread | $50-$200 | %100 | Sınırlı | Orta IV, net yön | ✅ IV Crush hedge'li |
| Butterfly | $200-$500 | %100 | Sınırlı | Yüksek IV, non-directional | ✅ IV Crush'dan kazanç |
| Iron Condor | $200-$500 | %100 | Sınırlı | Yüksek IV, non-directional | ✅ Geniş profit zone |
| Ratio Spread | $500-$1000 | Sınırsız (naked) | Sınırlı/Sınırsız | İleri, deneyimli | ⚠️ Naked side riski |
| Calendar Spread | $500-$1000 | %100 | Sınırlı | İleri, deneyimli | ✅ IV Crush farkı |

---

**Rapor Tamamlandı.**

**Versiyon:** v4.0-FINAL-COMPLETE | **Tarih:** 1 Temmuz 2026 | **Agent:** Gistify Earning Strategy — Agent 4 (Bütçe + Risk + Portföy + Eylem Planı) | **Rolling Window:** Temmuz 2026 + Ağustos 2026 | **Format:** EarningsPlay IV Crush | **Satır Sayısı:** 1500+

**Son Güncelleme:** 1 Temmuz 2026 TSİ 14:12 | **Veri Kaynakları:** Yahoo Finance, TipRanks, Federal Reserve, Kiplinger, SmartCalendars AI, Blank Capital Research, Tech Market Briefs

**Not:** Bu rapor, 'educational' ve 'illüstratif' amaçlıdır. Gerçek pozisyonlar kurulmadan önce, kendi araştırmanızı yapmalı ve bir finansal danışmana başvurmalısınız. Opsiyon trading, yüksek risk taşır ve sermayenizin tamamını kaybetme riski vardır.
