# 9 HAZİRAN 2026 EARNINGS GUNLUK STRATEJI GUNCELLEMESI
## v2.1 → v2.2 Guncelleme | EarningsPlay v4 Metodolojisi

**Rapor Tarihi:** 9 Haziran 2026 (Sali)  
**Onceki Rapor:** v2.1 (8 Haziran 2026)  
**Analiz Eden:** EarningsPlay v4 Stratejisti  
**Yasal Uyari:** Bu rapor yalnizca egitim ve arastirma amaclidir. Finansal tavsiye niteliginde degildir.

---

## EXECUTIVE SUMMARY — STRATEJI DEGISIKLIKLERI

| Hisse | Onceki Strateji (v2.1) | Yeni Strateji (v2.2) | Degisiklik | Neden |
|-------|------------------------|----------------------|------------|-------|
| **ORCL** | Long Straddle FAV / IC ALT | **Long Call Spread 220/230 FAV** / IC ALT | **Strateji Degisti** | IV %82 hala cok yuksek, Long Straddle pahali. Call Spread daha guvenli, ucuz giris. Oppenheimer $275 hedefi destegi. |
| **CHWY** | Long Call/Call Spread FAV | **Long Call Spread 21/26 FAV** | **Strike Guncellendi** | Fiyat $20.64→$20.29 dustu. 21/26 spread daha mantikli. RSI 31 dip alim firsati. |
| **ADBE** | Long Call Spread FAV / IC ALT | **Iron Condor 225/270 FAV** / Call Spread ALT | **Strateji Tersine Dondu** | IV %99 tarihi zirve = IC max kredi. Son 3 gun -%4.68 dusus, yon belirsiz. IC daha guvenli. |
| **FDX** | Iron Condor FAV | **Iron Condor FAV** | **Degisiklik Yok** | RSI 71→59 makul seviyeye dustu. IV %93 yuksek. 14 gun var, zaman bizim tarafimizda. |
| **MU** | Iron Condor FAV | **Iron Condor FAV (%50 pozisyon kucultme)** | **Pozisyon Kucultme** | $864→$946 (+9.46%) patlama. Dip kacti. YTD +%231 asiri degerli. Risk artti. |

### Strateji Degisiklik Ozeti
- **2 Strateji Tipi Degisti:** ORCL (Straddle→Call Spread), ADBE (Call Spread→IC)
- **1 Strike Guncellendi:** CHWY (spread strikeleri dusuruldu)
- **1 Pozisyon Kucultme:** MU (patlama sonrasi risk artisi)
- **1 Degisiklik Yok:** FDX (durum stabil)

---

## PIYASA HAVASI GUNCELLEMESI

### VIX Rejim Degisimi: SARI → YESIL/SARI SINIRI

| Gosterge | 8 Haziran | 9 Haziran | Degisim | Etki |
|----------|-----------|-----------|---------|------|
| **VIX** | 21.51 | **18.48** | **-%14.1** | Primler ucuzladi |
| S&P 500 | 7,384 | 7,426 | +0.57% | Yukselis |
| Nasdaq | 25,709 | 26,010 | +1.17% | Teknoloji guclu |
| Fear & Greed | 56 (Greed) | **42 (Fear)** | -14 puan | Korku bolgesi |
| 10Y Yield | 4.52% | 4.56% | +4bp | Hafif yukselis |
| DXY | 100.07 | 99.96 | -0.11% | Dolar zayifladik |

### EarningsPlay VIX Rejim Tablosu

| VIX Araligi | Rejim | Pozisyon | Onceki | Mevcut | Aksiyon |
|-------------|-------|----------|--------|--------|---------|
| <15 | Yesil | %100 normal | - | - | - |
| **15-25** | **Yesil/Sari** | **%100 normal** | ✅ 21.51 | ✅ **18.48** | **Pozisyon %100 devam** |
| 25-35 | Sari/Turuncu | %50 azaltma | - | - | - |
| 35-45 | Turuncu/Kirmizi | %25 azaltma | - | - | - |
| >45 | Kirmizi | Islem yapma | - | - | - |

### VIX Dususunun Etkileri

1. **Primler Ucuzladi:** VIX -%14.1 = opsiyon primleri ortalama -%10-15 dustu
2. **0DTE Stratejiler Daha Guvenli:** Dusuk VIX = 0DTE gamma riski azaldi
3. **Iron Condor Kazanma Olasiligi Arti:** Dusuk VIX = hisse hareket alani daralir = IC kazanma ihtimali yukselir
4. **Long Stratejiler Cazip:** Dusen primler = long giris daha ucuz
5. **Fear & Greed 42 (Fear):** Dikkat - korku bolgesi ani panik satisi riski tasir

### Pozisyon Buyuklugu Karari

**EarningsPlay Kurali:** VIX 15-25 → %100 normal pozisyon

| Hisse | Onceki Pozisyon | Yeni Pozisyon | Neden |
|-------|----------------|---------------|-------|
| ORCL | Hesabin %1-2'si | **Hesabin %1-2'si** | YARIN earnings = risk yuksek, pozisyon kucuk |
| CHWY | Hesabin %1-2'si | **Hesabin %1-2'si** | YARIN earnings = risk yuksek, pozisyon kucuk |
| ADBE | Hesabin %1-2'si | **Hesabin %1-2'si** | 2 gun var, pozisyon normal |
| FDX | Hesabin %1-2'si | **Hesabin %1-2'si** | 14 gun var, zaman decay yavas |
| MU | Hesabin %1-2'si | **Hesabin %0.5-1'i** | Patlama sonrasi risk artti, pozisyon yarim |

> **ONEMLI:** Fear & Greed 42 (Fear) = Piyasa korku bolgesinde. EarningsPlay kurali: Fear <45 ise pozisyonu %75'e indir (cift uyarili sistem: VIX + Fear & Greed). Ancak VIX 18.48 hala 15-25 bandinda = %100 pozisyon kurali gecerli. **Karar: Fear uyarisi not edildi, pozisyon %100 ama dikkatli.**

---

## HISSE BASI GUNCEL ANALIZ

---

### 1. ORCL (Oracle) — 10 Haziran AMC — YARIN!

#### Fiyat ve Teknik Durum Guncellemesi

| Metrik | 8 Haziran (v2.1) | 9 Haziran (v2.2) | Degisim |
|--------|-----------------|-----------------|---------|
| **Fiyat** | $213.68 | **$212.84** | -$0.84 (-0.39%) |
| RSI(14) | 58.0 | **54.48** | -3.52 (Nötr) |
| IV Rank | %82.8 | **%82.83** | Stabil (Cok Yuksek) |
| IV30 | 76.19% | **76.19%** | Stabil |
| ATR(14) | $12.91 | **$8.80** | Daha dusuk |
| 50MA | $179.43 | **$193.68** | Yukari kesisti |
| 200MA | $206.95 | **$206.12** | Fiyat UZERINDE |
| Implied Move | ~%7.5 | **±%12.96** | Yukseldi |
| Hacim | 27.6M ort | **Dusuk** | Dikkat |

#### Yeni Katalist: Oppenheimer $275 Hedefi

8 Haziran'da Oppenheimer ORCL hedef fiyatini $235'ten **$275'e yukseltti** (Outperform). Bu yeni bir katalist:

- Hedef $275 = mevcut fiyattan **%29.2 yukari potansiyel**
- Cantor Fitzgerald $284 hedefi ile uyumlu
- Iki buyuk kurum $275+ hedef = guclu konsensus
- Cloud IaaS %84 büyüme + RPO $553B destekliyor

#### Strateji Karari: Long Straddle → Long Call Spread 220/230

**Onceki Strateji:** Long Straddle (210/215) FAV — IV yuksek ama katalist guclu
**Yeni Strateji:** **Long Call Spread 220/230 FAV** / Iron Condor ALT

**Degisiklik Gerekcesi:**

1. **IV %82.83 Hala Cok Yuksek:** VIX 18.48 dustu ama ORCL IV'si hemen hemen ayni. Long Straddle girisi hala pahali (~$1,150+). Call Spread maliyeti ~$150-200 cok daha makul.
2. **Oppenheimer $275 Hedefi:** Yukari yonelimli katalist guclendi. Call Spread $220→$230 = %7.6 hareket gerekiyor. Hedef $275 = %29.2 potansiyel var, spread rahat kazanir.
3. **Implied Move ±%12.96:** Piyasa %12.96 hareket fiyatliyor. Call Spread 220/230 = $10 genislik / $212.84 fiyat = %4.7 risk. Hareket %12.96 olursa spread max kar.
4. **VIX Dususu Etkisi:** Genel primler dustu. 220/230 spread girisi daha ucuz.

**Long Call Spread 220/230 Detaylari:**

| Parametre | Deger |
|-----------|-------|
| Long Call Strike | $220 (OTM+%3.4) |
| Short Call Strike | $230 (OTM+%8.1) |
| Wing Genisligi | $10 |
| Tahmini Maliyet | ~$3.50-4.50 (1 kontrat) |
| Max Kar | $6.50-5.50 ($10 - maliyet) |
| Max Risk | ~$350-450 (1 kontrat) |
| Gerekli Hareket | %3.4 yukari (breakeven) |
| K.O. | ~%55-60 |
| K/H Orani | ~2.2:1 |

**Iron Condor ALTERNATIF (225/195 Short, 246/174 Long):**

| Parametre | Deger |
|-----------|-------|
| Short Call | $225 |
| Short Put | $195 |
| Long Call | $246 |
| Long Put | $174 |
| Wing Genisligi | ~$21 |
| Tahmini Kredi | ~$4.00-5.00 |
| Max Risk | ~$16.00-17.00 |
| Breakeven | ~$200 / ~$230 |
| K.O. | ~%60-65 |

#### EarningsPlay Kontrol Listesi — ORCL

| Kural | Durum | Uygun mu? |
|-------|-------|-----------|
| Katalist > 3/5 | 4/5 (Oppenheimer $275, RPO $553B, Cloud %84) | ✅ |
| IV Rank IC icin >%50 | %82.83 | ✅ |
| Wing = Fiyat/10 | $212.84/10 = $21.3 | ✅ |
| Max Loss = 2x Kredi | ~$17 < 2x$4.50=$9.00? Kontrol et | ⚠️ |
| VIX <35 | 18.48 | ✅ |
| Pozisyon = Hesabin %1-2'si | Uygula | ✅ |
| %50 Kar Kurali | Mekanik uygula | ✅ |

#### Giris-Cikis Takvimi — ORCL (YARIN SON GUN!)

| Tarih | Saat (ET) | Aksiyon | Not |
|-------|-----------|---------|-----|
| **9 Haziran (BUGUN)** | **15:30-15:45** | **POZISYON GIRISI** | **SON GIRIS FIRSATI** |
| 10 Haziran | 8:30 | CPI Verisi | Çifte volatilite baslar |
| 10 Haziran | 9:30-15:45 | Son cikis sansi | Earnings AMC = 15:45'e kadar |
| 10 Haziran | 16:05 | Earnings Aciklamasi | ORCL AMC |
| 11 Haziran | 9:30-10:00 | Kar Al (%50 Kurali) | CS: Max karin %50'si |
| 11-12 Haziran | 10:00 | Kesin Cikis | 24-48 saat icinde kapat |

> **KRITIK UYARI:** ORCL yarın AMC aciklayacak. BUGUN 15:30-15:45 arasi SON giris zamani. CPI yarın 8:30'da = çifte volatilite. EarningsPlay kurali: Üçlü volatilite (CPI + Earnings + Fear 42) = pozisyonu %75'e indir. **Karar: Pozisyon %75 (normalin 3/4'u).**

---

### 2. CHWY (Chewy) — 10 Haziran BMO — YARIN!

#### Fiyat ve Teknik Durum Guncellemesi

| Metrik | 8 Haziran (v2.1) | 9 Haziran (v2.2) | Degisim |
|--------|-----------------|-----------------|---------|
| **Fiyat** | $20.64 | **$20.29** | -$0.35 (-1.70%) |
| RSI(14) | 45.8 | **31.12** | -14.68 (ASIRI SATIMA YAKIN!) |
| IV30 | - | **73.92%** | Yuksek |
| ATR(14) | $1.02 | **$0.55** | Daha dusuk |
| 50MA | $24.21 | **$23.09** | Fiyat ALTINDA |
| 200MA | $31.03 | **$33.33** | Fiyat ALTINDA |
| 52w Dip | $19.30 | **$19.30** | Sadece %4.9 uzakta! |
| Short Interest | 26.8M | **26.81M (%11.71)** | Squeeze potansiyeli |
| Days to Cover | 3.42 | **3.22** | Hala squeeze icin yeterli |
| Implied Move | ~%8.5 | **±%10.25** | Yukseldi |

#### RSI 31 = DIP ALIM FIRSATI MI?

CHWY'nin RSI'si 31.12'ye dustu. Bu kritik bir seviye:

- RSI 30 = teknik "asiri satim" esigi
- Mevcut RSI 31.12 = **asiri satim esigine 1.12 puan uzaklikta**
- 52w dip $19.30'a sadece %4.9 uzaklikta
- Son 1 haftada -%11.75 deger kaybetti
- Dusus trendi devam ediyor

**EarningsPlay Degerlendirmesi:**
- Dip alim icin: RSI 31 + 52w dip yakınligi = **potansiyel dip** ✅
- Ama dusus trendi devam ediyor = **trend karsisi islem** ⚠️
- Earnings yarın BMO = **cok kisa sure** ⚠️
- Short squeeze potansiyeli 5/5 = **yukari patlama olasiligi** ✅

**Karar:** Long Call Spread FAV devam. Ama strikeler guncellenmeli.

#### Strateji Karari: Long Call Spread 21/26 (Strike Guncellemesi)

**Onceki Strateji:** Long Call Spread 22/28 FAV
**Yeni Strateji:** **Long Call Spread 21/26 FAV**

**Degisiklik Gerekcesi:**

1. **Fiyat $20.64→$20.29 Dustu:** 22/28 spread artik cok uzakta. 21/26 spread daha makul.
2. **RSI 31 Dip Firsati:** 21 strike = OTM+%3.5, hisse $19.30 dip test etse bile 21C hala degerli.
3. **%10.25 Implied Move:** 21→26 = %24.2 yukari potansiyel. Implied move %10.25 = spread karli.
4. **Short Squeeze 5/5:** Katalist hala en guclu hisse. Squeeze'de $26+ hedeflenebilir.

**Long Call Spread 21/26 Detaylari:**

| Parametre | Deger |
|-----------|-------|
| Long Call Strike | $21 (OTM+%3.5) |
| Short Call Strike | $26 (OTM+%28.1) |
| Wing Genisligi | $5 |
| Tahmini Maliyet | ~$0.40-0.60 (1 kontrat = $40-60) |
| Max Kar | $4.60-4.40 ($5 - maliyet) |
| Max Risk | ~$40-60 (1 kontrat) |
| Gerekli Hareket | %3.5 yukari (breakeven) |
| K.O. | ~%50-55 |
| K/H Orani | ~11.5:1 (Cok Yuksek!) |

**Lottery Ticket Ek (Agresif):**

| Parametre | Deger |
|-----------|-------|
| Strike | $22C (OTM+%8.4) |
| Tahmini Maliyet | ~$0.10-0.15 (1 kontrat = $10-15) |
| Max Kar | Sinirsiz |
| Max Risk | $10-15 (1 kontrat) |
| Gerekli Hareket | %8.4 yukari (breakeven) |

> **NOT:** 22C lottery = short squeeze senaryosunda $28-30 hisse fiyati = $600-800 kar / $10-15 risk = **40-80:1 K/H orani!** Ama squeeze olmazsa %100 kayip.

#### EarningsPlay Kontrol Listesi — CHWY

| Kural | Durum | Uygun mu? |
|-------|-------|-----------|
| Katalist > 3/5 | 5/5 (Short Squeeze) | ✅ Chase the Gap |
| RSI <35 (dip sinyali) | 31.12 | ✅ Dip alim |
| Short Interest >%10 | %11.71 | ✅ Squeeze potansiyeli |
| Days to Cover >3 | 3.22 | ✅ |
| 52w dip mesafe <%5 | %4.9 | ✅ Dip yakin |
| Pozisyon = Hesabin %1-2'si | Uygula | ✅ |

#### Short Squeeze Senaryo Guncellemesi

| Senaryo | EPS Kriteri | Hisse Tepkisi | Spread 21/26 Kar | Lottery 22C Kar |
|---------|-------------|---------------|------------------|-----------------|
| Mini Squeeze | >$0.50 | +%15-25 ($23-25) | ~$200-400 | $100-300 |
| Major Squeeze | >$0.55 | +%35-45 ($27-29) | ~$460 (Max) | $500-700 |
| Extreme Squeeze | >$0.60 | +%50-70 ($30-34) | ~$460 (Max) | $800-1,200 |
| Hayal Kiriciligi | <$0.35 | -%15-25 ($15-17) | -$60 (Max Loss) | -$15 (Max Loss) |

#### Giris-Cikis Takvimi — CHWY (YARIN BMO = BUGUN SON GUN!)

| Tarih | Saat (ET) | Aksiyon | Not |
|-------|-----------|---------|-----|
| **9 Haziran (BUGUN)** | **15:30-15:45** | **SON GIRIS** | **BMO = onceki gun kapanista!** |
| 10 Haziran | 06:00-08:00 | Earnings Aciklamasi | Pre-market sonuclar |
| 10 Haziran | 08:30 | CPI Verisi | Çifte volatilite |
| 10 Haziran | 09:30 | Piyasa Acilisi | Squeeze izleme baslar |
| 10 Haziran | 09:30-10:00 | **Kar Al (%50 Kurali)** | CS: Max karin %50'si |
| 10 Haziran | 10:00-11:00 | **Kesin Cikis** | Squeeze bitmeden cik |

> **KRITIK UYARI:** CHWY BMO (Before Market Open) = earnings sabah aciklanacak. **BUGUN 15:30-15:45 ARASI SON GIRIS ZAMANI!** Yarin pozisyon acilamaz. Short squeeze yonetimi: Hisse pre-market'te $24+ ise Mini Squeeze basladi. $27+ ise Major Squeeze — hemen kar almayi dusun.

---

### 3. ADBE (Adobe) — 11 Haziran AMC — 2 GUN

#### Fiyat ve Teknik Durum Guncellemesi

| Metrik | 8 Haziran (v2.1) | 9 Haziran (v2.2) | Degisim |
|--------|-----------------|-----------------|---------|
| **Fiyat** | $251.44 | **$246.76** | -$4.68 (-1.86%) |
| 3 Gunluk Degisim | - | **-%4.68** | Sert dusus |
| RSI(14) | 52.1 | **39.48** | -12.62 (Asiri satima yakin) |
| IV Rank | %100.0 | **%99.86** | Hala tarihi zirve |
| ATR(14) | $11.07 | **$10.42** | Hala yuksek |
| 50MA | $246.14 | **Altinda** | Kirildi |
| 200MA | $302.62 | **$302.62** | Cok uzakta |
| Implied Move | ~%6.7 | **%9.64** | Yukseldi |
| P/E | 14.66 | **14.39** | Tarihi dip |

#### Dusus Analizi: Dip mi, Daha Fazla Dusus mu?

ADBE son 3 gunde -%4.68 dusus yasadi. Bu kritik:

- Fiyat $251.44→$246.76→dusus trendi devam ediyor
- RSI 52→39.48 = **asiri satim bolgesine yaklasiyor**
- P/E 14.39 = **tarihi dip seviyesi** (Adobe icin en dusuk)
- 50MA altinda = **kisa vadeli trend kirildi**
- IV %99.86 = **opsiyonlar hala en pahali seviyede**
- $25B buyback = **yönetim dip oldugunu dusunuyor** (sinyal)

**EarningsPlay Degerlendirmesi:**
- P/E 14.39 + $25B buyback = **fundamental dip** ✅
- RSI 39 + dusus trendi = **teknik olarak daha dusus olabilir** ⚠️
- IV %99.86 = **Long Straddle KESINLIKLE OYNANAMAZ** 🚫
- CEO gecis sureci = **belirsizlik** ⚠️
- 50MA kirildi = **yukari momentum zayif** ⚠️

**Karar:** Iron Condor FAV — Long Call Spread yerine. Sebep: Dusus trendi devam ediyor, yön belirsizligi yuksek, IV %99 = IC max kredi.

#### Strateji Karadi: Long Call Spread → Iron Condor 225/270

**Onceki Strateji:** Long Call Spread FAV / Iron Condor ALT
**Yeni Strateji:** **Iron Condor 225/270 FAV** / Long Call Spread ALT

**Degisiklik Gerekcesi:**

1. **Dusus Trendi Devam Ediyor:** Son 3 gun -%4.68. Fiyat 50MA altinda. Yukari momentum zayif.
2. **IV %99.86 Tarihi Zirve:** Iron Condor maksimum kredi toplar. IV crush sonrasi ciddi kar potansiyeli.
3. **Yon Belirsizligi:** P/E dip (bullish) ama dusus trendi + CEO gecisi (bearish) = net yon yok = IC mantikli.
4. **VIX Dususu:** VIX dustu ama ADBE IV'si hemen hemen ayni = hisse-ozgü volatilite yuksek = IC cazip.

**Iron Condor 225/270 Detaylari:**

| Parametre | Deger |
|-----------|-------|
| Short Put | $225 (OTM-%8.8) |
| Short Call | $270 (OTM+%9.4) |
| Long Put | $200 (OTM-%18.9) |
| Long Call | $295 (OTM+%19.6) |
| Wing Genisligi | $25 ($246.76/10 ≈ $25) |
| Tahmini Kredi | ~$7.50-9.00 (1 kontrat) |
| Max Risk | ~$16.00-17.50 ($25 - kredi) |
| Breakeven | ~$216 / ~$279 |
| K.O. | ~%58-63 |
| K/H Orani | ~0.9:1 |

**Long Call Spread ALTERNATIF (255/265):**

| Parametre | Deger |
|-----------|-------|
| Long Call Strike | $255 (OTM+%3.3) |
| Short Call Strike | $265 (OTM+%7.4) |
| Tahmini Maliyet | ~$3.00-4.00 |
| Max Kar | $7.00-6.00 |
| Gerekli Hareket | %3.3 yukari |
| K.O. | ~%50-55 |

> **NOT:** Long Call Spread 255/265 = dip alim stratejisi. P/E 14.39 + $25B buyback = yukari tepki olasiligi. Ama dusus trendi devam ediyorsa riskli. **Iron Condor daha guvenli.**

#### EarningsPlay Kontrol Listesi — ADBE

| Kural | Durum | Uygun mu? |
|-------|-------|-----------|
| IV Rank >%50 (IC icin) | %99.86 | ✅ MUKEMMEL |
| Wing = Fiyat/10 | $246.76/10 = $24.7 ≈ $25 | ✅ |
| Max Loss = 2x Kredi | ~$17 < 2x$8=$16? Kontrol et | ⚠️ |
| VIX <35 | 18.48 | ✅ |
| Pozisyon = Hesabin %1-2'si | Uygula | ✅ |
| %50 Kar Kurali | Mekanik uygula | ✅ |

#### IV Crush Simulasyonu — ADBE IC

| Senaryo | IV Dususu | IC Etkisi | Tahmini Kar |
|---------|-----------|-----------|-------------|
| Hafif Crush | -%30 | +$2.50 | Kredinin ~%30'u |
| Orta Crush | -%50 | +$4.00 | Kredinin ~%50'si |
| Sert Crush | -%70 | +$5.50 | Kredinin ~%70'i |

> **EarningsPlay Kurali:** %50 kar hedefi = ~$4.00 kar aninda realize et. Mekanik cikis.

#### Giris-Cikis Takvimi — ADBE (2 Gun Var)

| Tarih | Saat (ET) | Aksiyon | Not |
|-------|-----------|---------|-----|
| 9 Haziran (BUGUN) | 15:30 | Erken Giris | 2 gun var, primler yuksek |
| 10 Haziran | 8:30 | CPI Etkisi | VIX hareketi primleri etkiler |
| 11 Haziran | 15:30-15:45 | Son Giris | Earnings AMC = son giris |
| 11 Haziran | 16:05 | Earnings Aciklamasi | ADBE AMC |
| 12 Haziran | 9:30-10:00 | Kar Al (%50 Kurali) | IC: Kredinin %50'si |
| 12 Haziran | 10:00 | Kesin Cikis | IV crush baslar |

---

### 4. FDX (FedEx) — 23 Haziran AMC — 14 GUN

#### Fiyat ve Teknik Durum Guncellemesi

| Metrik | 8 Haziran (v2.1) | 9 Haziran (v2.2) | Degisim |
|--------|-----------------|-----------------|---------|
| **Fiyat** | $331.00 | **$331.83** | +$0.83 (+0.25%) |
| RSI(14) | 71.2 | **59.11** | -12.09 (Nötr/Asiri alimdan cikti) |
| IV Rank | %76.3 | **%93.15** | YUKSELDI (Cok Yuksek) |
| ATR(14) | $9.37 | **$7.38** | Daha dusuk |
| 50MA | $307.54 | **$305+ (uzerinde)** | Destek |
| 200MA | $249.73 | **$249.73** | Guclu destek |
| 52w Zirve | $341.14 | **$341.14** | %2.7 uzaklikta |
| YTD Getiri | +%42.78 | **+%42.78** | Stabil |
| Implied Move | ~%6.6 | **~%9.64** | Yukseldi |

#### Strateji Karari: DEGISIKLIK YOK — Iron Condor FAV

**Onceki Strateji:** Iron Condor FAV
**Yeni Strateji:** **Iron Condor FAV** (degisiklik yok)

**Neden Degisiklik Yok:**

1. **Fiyat Stabil:** $331.00→$331.83 sadece +%0.25. Range-bound davranis devam ediyor.
2. **RSI 71→59:** Asiri alimdan cikti, daha makul seviye. Bu IC icin daha iyi — hissin daha az hareket etme olasiligi yuksek.
3. **IV Rank %76→%93 Yukseldi:** Iron Condor icin daha iyi! Daha fazla kredi toplanabilir.
4. **14 Gun Var:** Cok fazla zaman var. Time decay (theta) yavas ama guvenli.
5. **Freight Spinoff Temasi:** Uzun vadeli pozitif ama kisa vadeli range-bound.
6. **52w Zirve %2.7 Uzaklikta:** Yukari direnc yuksek, asagi 50MA destegi var = range.

**Iron Condor Detaylari (Guncel Fiyat $331.83):**

| Parametre | Deger |
|-----------|-------|
| Short Put | $300 (OTM-%9.6) |
| Short Call | $365 (OTM+%10.0) |
| Long Put | $267 (OTM-%19.5) |
| Long Call | $398 (OTM+%19.9) |
| Wing Genisligi | $33 ($331.83/10 ≈ $33) |
| Tahmini Kredi | ~$6.00-7.50 (1 kontrat) |
| Max Risk | ~$25.50-28.50 ($33 - kredi) |
| Breakeven | ~$307 / ~$358 |
| K.O. | ~%60-65 |
| K/H Orani | ~0.8-1:1 |

#### EarningsPlay Kontrol Listesi — FDX

| Kural | Durum | Uygun mu? |
|-------|-------|-----------|
| Katalist 3/5 | 3/5 (Spinoff $4.1B, JPM $460, RSI 59) | ✅ |
| IV Rank >%50 | %93.15 | ✅ Cok iyi |
| Wing = Fiyat/10 | $331.83/10 = $33.2 ≈ $33 | ✅ |
| Max Loss = 2x Kredi | ~$26 < 2x$7=$14? Kontrol et | ⚠️ |
| VIX <35 | 18.48 | ✅ |
| 14 Gun Var | Theta yavas | ✅ Guvenli |
| %50 Kar Kurali | Mekanik uygula | ✅ |

> **FDX Notu:** 14 gun var = en givenli hisse. IV Rank %93 = kredi toplama icin mukemmel. Fear & Greed 42 etkisini de dusunurse en guvenli earnings play olabilir. Pozisyon normal (%1-2).

#### Giris-Cikis Takvimi — FDX (14 Gun Var, Acele Yok)

| Tarih | Saat (ET) | Aksiyon | Not |
|-------|-----------|---------|-----|
| 9-16 Haziran | Her gun 10:00-11:00 | Giris Firsati | 14 gun var, acele yok |
| 17 Haziran | 14:00 | FOMC Karari | Volatilite artabilir |
| 23 Haziran | 15:30-15:45 | Son Giris | Earnings AMC |
| 23 Haziran | 16:05 | Earnings Aciklamasi | FDX AMC |
| 24 Haziran | 9:30-10:00 | Kar Al (%50 Kurali) | IC: Kredinin %50'si |
| 24-25 Haziran | 10:00 | Kesin Cikis | IV crush sonrasi |

---

### 5. MU (Micron) — 24 Haziran AMC — 15 GUN

#### Fiyat ve Teknik Durum Guncellemesi

| Metrik | 8 Haziran (v2.1) | 9 Haziran (v2.2) | Degisim |
|--------|-----------------|-----------------|---------|
| **Fiyat** | $864.01 | **$945.76** | +$81.75 (+9.46%) |
| RSI(14) | - | **61.30** | Nötr/Yukselis |
| ATR(14) | - | **$34.22** | Cok yuksek |
| Beta | 2.17 | **2.17** | Çifte volatilite |
| Implied Move | - | **%21.73** | EN YUKSEK! |
| 50MA | - | **~$500-994** | Cok uzakta |
| 52w Aralik | - | **$103.38-$1,089.29** | Zirve $1,089 |
| YTD Getiri | +%202.85 | **+%231.76** | Patlama |
| Morningstar Adil Deger | $455 | **$455** | %89 asiri degerli |
| Ort. Analist Hedefi | $739 | **$739.47** | %21.8 ALTINDA |

#### PATLAMA Analizi: +9.46% Bir Gunde!

MU son 2 gunde +%9.46 patlama yapti. Bu kritik bir degisiklik:

- **Fiyat $864→$946 = dip alim firsati kacti**
- **YTD +%231.76 = asiri degerli hisse**
- **Morningstar $455 adil deger = %89 asiri fiyatli**
- **Ortalama analist hedefi $739 = mevcut fiyatin %21.8 altinda**
- **Implied Move %21.73 = piyasa devasa hareket bekliyor**
- **Beta 2.17 = piyasadan 2x volatilite**

**EarningsPlay Degerlendirmesi:**
- Long Call/Straddle artik **TAMAMEN GECERSIZ** — dip kacti, hisse cok pahali 🚫
- Iron Condor hala **gecerli** — IV yuksek = kredi toplama firsati ✅
- Ama **risk artti** — %9.46 patlama sonrasi duzeltme olabilir ⚠️
- Morningstar $455 vs $946 = **fundamental degerin 2x uzerinde** ⚠️
- Wells Fargo $1,220 hedefi = **en optimist senaryo** (uc kurum)

#### Strateji Karari: Iron Condor FAV (%50 Pozisyon Kucultme)

**Onceki Strateji:** Iron Condor FAV
**Yeni Strateji:** **Iron Condor FAV (%50 pozisyon kucultme)**

**Degisiklik Gerekcesi:**

1. **Dip Kacti:** $864 giris cok iyi bir fiyatti. Simdi $945 = %9.3 daha pahali.
2. **Asiri Degerli:** Morningstar $455, ort. hedef $739. Mevcut $945 = analistlerin hedefinin uzerinde.
3. **Implied Move %21.73:** Piyasa %21.73 hareket fiyatliyor. Bu demek ki $740-$1,151 araligi. Iron Condor wing'leri cok genis olmali.
4. **Beta 2.17:** Hisse piyasadan 2x hareket eder. IC kisa strike'lari cok uzakta olmali.
5. **Wing Genisligi:** $945.76/10 = $94.6 ≈ $95 wing gerekiyor. Bu cok genis = dusuk kredi.

**Iron Condor Detaylari (Guncel Fiyat $945.76):**

| Parametre | Deger |
|-----------|-------|
| Short Put | $800 (OTM-%15.4) |
| Short Call | $1,100 (OTM+%16.3) |
| Long Put | $705 (OTM-%25.4) |
| Long Call | $1,195 (OTM+%26.4) |
| Wing Genisligi | $95 ($945.76/10 ≈ $95) |
| Tahmini Kredi | ~$15.00-20.00 (1 kontrat) |
| Max Risk | ~$75.00-80.00 ($95 - kredi) |
| Breakeven | ~$815 / ~$1,085 |
| K.O. | ~%45-55 (Beta 2.17 nedeniyle dusuk!) |
| K/H Orani | ~0.5-0.8:1 |

> **KRITIK UYARI:** MU IC'nin K.O.'su dusuk (%45-55) cunku Beta 2.17 = hisse cok hareketli. Wing $95 genis olmasina ragmen, %21.73 implied move = hisse $740-$1,151 arasinda hareket edebilir. Bu IC icin riskli. **Pozisyon yarim (%0.5-1).**

#### EarningsPlay Kontrol Listesi — MU

| Kural | Durum | Uygun mu? |
|-------|-------|-----------|
| Katalist 3/5 | 3/5 (NVIDIA HBM, Beta 2.17, %231 YTD) | ✅ |
| IV Rank >%50 | Cok yuksek (%21.73 IM) | ✅ |
| Wing = Fiyat/10 | $945.76/10 = $94.6 ≈ $95 | ✅ |
| Max Loss = 2x Kredi | ~$75 < 2x$20=$40? Kontrol et | ⚠️ Riskli |
| VIX <35 | 18.48 | ✅ |
| Beta 2.17 | Genis wing gerekce | ✅ |
| Pozisyon = Hesabin %0.5-1'i | %50 kucultme | ✅ Risk azaltma |
| %50 Kar Kurali | Mekanik uygula | ✅ |

#### Giris-Cikis Takvimi — MU (15 Gun Var)

| Tarih | Saat (ET) | Aksiyon | Not |
|-------|-----------|---------|-----|
| 9-20 Haziran | Erken giris dusun | Bekle | Patlama sonrasi geri çekilme bekle |
| 20-23 Haziran | 10:00-11:00 | Giris Firsati | IV yukselirse giris |
| 17 Haziran | 14:00 | FOMC Karari | Volatilite patlamasi |
| 24 Haziran | 15:30-15:45 | Son Giris | Earnings AMC |
| 24 Haziran | 16:05 | Earnings Aciklamasi | MU AMC |
| 25 Haziran | 9:30-10:00 | Kar Al (%50 Kurali) | IC: Kredinin %50'si |
| 25 Haziran | 10:00 | Kesin Cikis | IV crush sonrasi |

> **MU NOTU:** Patlama sonrasi giris BEKLE. Duzeltme $900-$880 seviyelerine gelebilir. O seviyede IC girisi daha iyi. Ama 15 gun var = aceleye gerek yok. **Erken giris yapma, 20+ Haziran'i bekle.**

---

## KRITIK UYARILAR

### 1. Yarin (10 Haziran) Üçlü Volatilite Firtinasi

| Saat (ET) | Olay | Etki |
|-----------|------|------|
| 8:30 | **CPI (Mayis)** | Piyasa geneli volatilite patlamasi |
| 06:00-08:00 | **CHWY Earnings (BMO)** | Hisse volatilitesi |
| 16:05 | **ORCL Earnings (AMC)** | Hisse + sektor volatilitesi |

**EarningsPlay Kurali:** CPI + Earnings ayni gun = pozisyonu %50'ye indir.
**Fear & Greed 42** ek korku faktörü.
**Karar:** ORCL ve CHWY pozisyonlari %75'e indirildi (normalin 3/4'u). Bu raporda pozisyon buyuklukleri buna gore ayarlandi.

### 2. VIX Dususunun Çift Yuzlu Etkisi

| Olumlu | Olumsuz |
|--------|---------|
| Primler ucuzladi | Fear 42 = korku bolgesi |
| IC kazanma olasiligi artti | Panik satisi riski |
| 0DTE daha guvenli | Ani VIX sicramasi olabilir |
| Long giris daha ucuz | CPI yarın VIX'i tekrar yukseltebilir |

### 3. Hisse Siralamasi (Risk Yüksekten Dusuge)

| Sira | Hisse | Risk Seviyesi | Neden |
|------|-------|---------------|-------|
| 1 (En Riskli) | **MU** | 🔴🔴🔴 | Beta 2.17, %21.73 IM, +%231 YTD |
| 2 | **CHWY** | 🔴🔴 | BMO, 52w dip yakin, squeeze riski |
| 3 | **ORCL** | 🔴🔴 | AMC, CPI çakismasi, IV %83 |
| 4 | **ADBE** | 🔴 | IV %99, dusus trendi, 2 gun var |
| 5 (En Guvenli) | **FDX** | 🟡 | 14 gun var, RSI 59, stabil |

### 4. Morningstar Adil Deger Uyumasi

| Hisse | Morningstar Adil Deger | Mevcut Fiyat | Asiri Degerleme |
|-------|----------------------|--------------|-----------------|
| MU | $455 | $945.76 | **%108 asiri degerli** |
| ADBE | $370* | $246.76 | **-%33 ucuz** |
| FDX | $310* | $331.83 | %7 asiri degerli |

*Morningstar degerleri yaklasik. ADBE $370 Morningstar degeri = mevcut fiyattan %50 ucuz. Bu ADBE dip oldugunu destekliyor — ama trend kirildi.

---

## GUNUN AKSIYON PLANI

| Saat (ET) | Aksiyon | Hisse | Strateji | Not |
|-----------|---------|-------|----------|-----|
| **10:00** | Piyasa Acilisini Izle | Tümü | - | VIX, S&P 500, Nasdaq trendi |
| **10:30** | **CHWY Karari Ver** | CHWY | 21/26 Call Spread veya 22C Lottery | **BUGUN SON GUN!** RSI 31 dip mi? |
| **11:00** | **ORCL Karari Ver** | ORCL | 220/230 Call Spread veya IC | **BUGUN SON GUN!** Oppenheimer $275 |
| **13:00** | FDX IC Giris Degerlendir | FDX | Iron Condor 300/365 | 14 gun var, acele yok |
| **14:00** | MU Giris BEKLE | MU | Iron Condor (ertele) | Patlama sonrasi girme |
| **15:00** | ADBE IC Giris Degerlendir | ADBE | Iron Condor 225/270 | 2 gun var, bugun veya yarin |
| **15:30** | **CHWY POZISYON AC** | CHWY | 21/26 Call Spread | **SON SAAT!** BMO yarın |
| **15:30** | **ORCL POZISYON AC** | ORCL | 220/230 Call Spread | **SON SAAT!** AMC yarın |
| **15:45** | Tum Pozisyonlar Kilitli | Tümü | - | Market kapanisi |
| **16:00** | Raporla, Yarin Planini Hazirla | - | - | CPI 8:30'da, CHWY BMO |

### Vade Secimi Tablosu

| Hisse | Vade | DTE | Neden |
|-------|------|-----|-------|
| CHWY | **13 Haziran 2025 (Haftalik)** | 0-1 DTE | BMO yarın, hemen sonuc |
| ORCL | **13 Haziran 2025 (Haftalik)** | 0-1 DTE | AMC yarın, hemen sonuc |
| ADBE | **13 Haziran 2025 (Haftalik)** | 1-2 DTE | 11 Haziran AMC |
| FDX | **27 Haziran 2025 (Aylik)** | 14 DTE | 23 Haziran AMC |
| MU | **27 Haziran 2025 (Aylik)** | 15 DTE | 24 Haziran AMC |

---

## RISK METRIKLERI OZET TABLO

| Hisse | Max Risk (1 Kontrat) | Max Kar (1 Kontrat) | K/H | K.O. | Pozisyon |
|-------|---------------------|---------------------|-----|------|----------|
| **ORCL** CS 220/230 | ~$400 | ~$600 | 1.5:1 | %55 | Hesabin %1-2'si (%75) |
| **CHWY** CS 21/26 | ~$60 | ~$540 | 9:1 | %50 | Hesabin %1-2'si (%75) |
| **ADBE** IC 225/270 | ~$1,700 | ~$850 | 0.5:1 | %60 | Hesabin %1-2'si |
| **FDX** IC 300/365 | ~$2,700 | ~$650 | 0.24:1 | %63 | Hesabin %1-2'si |
| **MU** IC 800/1100 | ~$8,000 | ~$1,800 | 0.23:1 | %50 | Hesabin %0.5-1'i |

---

## SONUC

### En Önemli 3 Strateji Degisikligi

1. **ORCL: Long Straddle → Long Call Spread 220/230**  
   IV %82 hala cok yuksek, Long Straddle pahali. Oppenheimer $275 hedefi ile Call Spread daha guvenli. Maliyet ~$400, max kar ~$600, K/O ~%55.

2. **ADBE: Long Call Spread → Iron Condor 225/270**  
   Son 3 gun -%4.68 dusus, trend kirildi. IV %99 = IC max kredi (~$850). Yon belirsizligi yuksek = IC mantikli. %50 kar kurali mekanik uygulanacak.

3. **MU: Iron Condor FAV (+%50 pozisyon kucultme)**  
   $864→$946 patlama sonrasi dip kacti. YTD +%231 asiri degerli. Morningstar $455 adil deger. Wing $95 genis = dusuk K/O (%50). Pozisyon yarim (%0.5-1).

### Kalan 2 Hisse

4. **CHWY:** Long Call Spread 21/26 FAV (strike guncellendi, strateji ayni). RSI 31 dip alim + Short Squeeze 5/5. **BUGUN SON GIRIS!**

5. **FDX:** Iron Condor FAV (degisiklik yok). RSI 59 makul, IV %93 cok iyi. En guvenli hisse. 14 gun var.

### Günlük Slogan

> **"VIX dustu, firsat artti — ama dip alirken trende saygi goster. Fear 42 = dikkatli ol, pozisyon kucuk tut, mekanik kurallara sadik kal."**
📊 HAZİRAN 2026 EARNINGS — CALL/PUT RATIO (CPR) ANALİZİ
Earnings Öncesi Şişen Opsiyonlardan İstifade Stratejisi
1. CPR VERİLERİ — 5 HİSSE ÖZETİ
Table
Hisse	Fiyat	Volüm CPR	Açık Pozisyon CPR	Sentiment	Earnings
ORCL	$212.84	0.52	0.92	🟢 Bullish	10 Haz AMC
ADBE	$246.76	0.43	0.67	🟢 Çok Bullish	11 Haz AMC
CHWY	$20.29	~0.35 (tahmini)	~0.45 (tahmini)	🟢 Aşırı Bullish	10 Haz BMO
FDX	$331.83	~1.10 (tahmini)	~1.05 (tahmini)	🟡 Nötr	23 Haz AMC
MU	$945.76	0.66	1.31	🔴 Bearish (OI)	24 Haz AMC
2. CPR SENTIMENT YORUMLAMA REHBERİ
Table
CPR Aralığı	Sentiment	Etki	Strateji Yönü
< 0.50	🟢 Aşırı Bullish	"Crowded Long" — Call'lar şişmiş	✅ Put Satış / Short Call — IV Crush'tan max kazanç
0.50-0.80	🟢 Bullish	Call ağırlıklı	✅ Call Spread veya Short Call
0.80-1.20	🟡 Nötr	Dengeli	✅ Simetrik Iron Condor / Straddle
1.20-2.00	🔴 Bearish	Put ağırlıklı	✅ Put Spread veya Short Put
> 2.00	🔴 Aşırı Bearish	"Crowded Short" — Put'lar şişmiş	✅ Call Alım / Long Call — Squeeze + IV Crush
3. HİSSE BAŞI CPR ANALİZİ VE STRATEJİ ETKİSİ
ORCL — Volüm CPR: 0.52 | OI CPR: 0.92
Table
Metrik	Değer	Yorum
Volüm CPR	0.52	Gün içi call alımları domine ediyor
OI CPR	0.92	Açık pozisyonlarda dengeye yakın
Sentiment	🟢 Bullish	Call'lar şişmiş ama OI dengeli
🎯 IV Crush İstifade Stratejisi:
plain
ORCL: Call'lar şişmiş → CALL SATIŞ (Short Call) + PUT SATIŞ (Short Put)
      = ASİMETRİK IRON CONDOR

Önerilen:  230/240 Call Spread SELL (call'lar şişmiş)
           195/185 Put Spread SELL (put'lar dengeli)
Table
Leg	Strike	Yön	Gerekçe
Short Call	230	SELL	CPR 0.52 = call'lar şişmiş, IV crush'ta erir
Long Call	240	BUY	Koruma
Short Put	195	SELL	OI CPR 0.92 = put'lar dengeli, yukarı bias
Long Put	185	BUY	Koruma
Net Kredi: ~$3.50 | Max Risk: ~$6.50 | K.O.: ~%62
ADBE — Volüm CPR: 0.43 | OI CPR: 0.67
Table
Metrik	Değer	Yorum
Volüm CPR	0.43	Çok fazla call alımı — "crowded long"
OI CPR	0.67	Call açık pozisyonlar domine
Sentiment	🟢 Çok Bullish	Call'lar AŞIRI şişmiş
⚠️ Uyarı: CPR 0.43 = "Crowded Long" — Herkes call almış! Bu iki risk taşır:
Eğer ADBE yukarı gitmezse → call alımları erir (IV crush + yön hatası)
Aşırı bullish = contrarian sinyal (yön tersine dönebilir)
🎯 IV Crush İstifade Stratejisi:
plain
ADBE: Call'lar AŞIRI şişmiş (CPR 0.43) → AGRESİF CALL SATIŞ
      = KREDİ CALL SPREAD veya SHORT CALL + HEDGE

Önerilen:  260/270 Call Spread SELL (aşırı şişmiş call'ları sat)
           225/215 Put Spread SELL (dengeli put'ları sat)
Table
Leg	Strike	Yön	Gerekçe
Short Call	260	SELL	CPR 0.43 = call'lar AŞIRI şişmiş, IV crush'ta max erime
Long Call	270	BUY	Koruma (CPR çok düşük = reversal riski)
Short Put	225	SELL	RSI 39 = aşırı satım, dip yakın
Long Put	215	BUY	Koruma
Net Kredi: ~$8.50 | Max Risk: ~$1.50 | K.O.: ~%71 | R/R: 5.7:1
💡 Neden Call'ları Satıyoruz? CPR 0.43 = Herkes call almış. Earnings sonrası IV %70-80 düşerse, bu call'ların primi eriyor. Biz call'ları satarak (short) bu erimeden KAZANÇ elde ediyoruz. Ayrıca "crowded long" = ters yön riski yüksek.
CHWY — Tahmini Volüm CPR: ~0.35 | Tahmini OI CPR: ~0.45
Table
Metrik	Değer	Yorum
Tahmini Volüm CPR	~0.35	Aşırı call alımı (short squeeze beklentisi)
Sentiment	🟢 Aşırı Bullish	Short squeeze + dip alımı = call'lar patlamış
🎯 IV Crush İstifade Stratejisi:
plain
CHWY: Call'lar AŞIRI şişmiş (CPR ~0.35) → CALL SATIŞ + PUT SATIŞ
      = GENİŞ IRON CONDOR (Asimetrik — call tarafı daha dar)

Önerilen:  22/23 Call Spread SELL (aşırı şişmiş call'lar)
           19/18 Put Spread SELL (put'lar dengeli)
Table
Leg	Strike	Yön	Gerekçe
Short Call	22	SELL	CPR ~0.35 = call'lar AŞIRI şişmiş
Long Call	23	BUY	Koruma (ucuz, $0.50-1.00)
Short Put	19	SELL	52w dip $19.30 = destek
Long Put	18	BUY	Koruma
Net Kredi: ~$0.80 | Max Risk: ~$0.20 | K.O.: ~%80 | R/R: 4:1
💡 Önemli: Eğer short squeeze gerçekleşirse, short call zarar edebilir. Ama IV crush'tan gelen kazanç squeeze'in ötesinde değerlidir. 22/23 spread dar wing = max risk sınırlı.
FDX — Tahmini Volüm CPR: ~1.10 | Tahmini OI CPR: ~1.05
Table
Metrik	Değer	Yorum
Tahmini Volüm CPR	~1.10	Nötr, hafif put ağırlıklı
Sentiment	🟡 Nötr	Dengeli, yön belirsizliği
🎯 IV Crush İstifade Stratejisi:
plain
FDX: Nötr CPR (~1.10) → SİMETRİK IRON CONDOR
      = Call ve Put'lar dengeli satış

Önerilen:  350/365 Call Spread SELL
           315/300 Put Spread SELL
Table
Leg	Strike	Yön	Gerekçe
Short Call	350	SELL	RSI 59 = aşırı alım yakın
Long Call	365	BUY	Koruma
Short Put	315	SELL	50MA destek
Long Put	300	BUY	Koruma
Net Kredi: ~$6.50 | Max Risk: ~$8.50 | K.O.: ~%55 | R/R: 0.76:1
MU — Volüm CPR: 0.66 | OI CPR: 1.31
Table
Metrik	Değer	Yorum
Volüm CPR	0.66	Call alımları yüksek (patlama sonrası FOMO)
OI CPR	1.31	⚠️ Açık pozisyonlarda PUT ağırlıklı!
Sentiment	🟢/🔴 Karışık	Günlük call ama açık pozisyon put
⚠️ Kritik Çelişki: Volüm CPR 0.66 (bullish) vs OI CPR 1.31 (bearish)
Günlük trader'lar call alıyor (FOMO — $864→$946 patlama)
Ama "smart money" put pozisyon taşıyor (hedge/short)
🎯 IV Crush İstifade Stratejisi:
plain
MU: Volüm call (FOMO) ama OI put (smart money hedge)
    = PUT SATIŞ (OI put'lar şişmiş) + CALL SATIŞ (volüm call'lar şişmiş)
    = AGRESİK IRON CONDOR (Geniş wing — Beta 2.17)

Önerilen:  1000/1050 Call Spread SELL (FOMO call'ları sat)
           850/800 Put Spread SELL (hedge put'ları sat)
Table
Leg	Strike	Yön	Gerekçe
Short Call	1000	SELL	Volüm CPR 0.66 = FOMO call'lar şişmiş
Long Call	1050	BUY	Koruma (Beta 2.17 = uçucu)
Short Put	850	SELL	OI CPR 1.31 = put'lar şişmiş (hedge'ler)
Long Put	800	BUY	Koruma
Net Kredi: ~$25.00 | Max Risk: ~$25.00 | K.O.: ~%52 | R/R: 1:1
💡 Önemli: MU'da "smart money" put taşıyor (OI CPR 1.31). Bu büyük hedge'ler earnings sonrası kapanacak = put'ların IV crush'ından kazanç. Aynı anda FOMO call'ları da eriyecek. İki taraftan da kazanç potansiyeli!
4. CPR-BAZLI POZİSYON ORANLARI (Long Call / Short Put Dengesi)
Table
Hisse	CPR	Call Satış (Short) Oranı	Put Satış (Short) Oranı	Ana Strateji
ORCL	0.52	%60	%40	Asimetrik IC (call tarafı ağır)
ADBE	0.43	%70	%30	Agresif Short Call + IC
CHWY	~0.35	%65	%35	Dar wing IC (call tarafı ağır)
FDX	~1.10	%45	%55	Simetrik IC (hafif put ağır)
MU	0.66/1.31	%55	%45	Geniş IC (çift taraflı)
5. ÖZET: IV CRUSH'TAN İSTİFADE PLANI
Table
Hisse	Şişmiş Opsiyon	İstifade Yöntemi	Kredi	K.O.	Risk
ORCL	Call'lar (CPR 0.52)	230/240 Call Spread SELL	~$3.50	%62	Orta
ADBE	Call'lar AŞIRI (CPR 0.43)	260/270 Call Spread SELL	~$8.50	%71	Yüksek
CHWY	Call'lar AŞIRI (CPR ~0.35)	22/23 Call Spread SELL	~$0.80	%80	Düşük
FDX	Dengeli (CPR ~1.10)	350/365 + 315/300 IC	~$6.50	%55	Orta
MU	Call (vol) + Put (OI)	1000/1050 + 850/800 IC	~$25.00	%52	Yüksek
Genel Prensip: Earnings öncesi şişen opsiyonları SATIYORUZ (short vega). Earnings sonrası IV Crush'ta bu opsiyonların primi eriyor ve biz bu erimeden kazanç elde ediyoruz. CPR bize HANGİ tarafın (call mu put mu) daha çok şişmiş olduğunu gösteriyor — o tarafı daha agresif satıyoruz.
---

*Rapor Versiyonu: v2.2 | Onceki: v2.1 (8 Haziran 2026) | EarningsPlay v4 Metodolojisi | Son Guncelleme: 9 Haziran 2026*
