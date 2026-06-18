# EarningsPlay — Opsiyon Stratejisi Skill'i (2025 Güncellemesi)

Bu doküman, EarningsPlay opsiyon stratejisinin 2024-2025 doneminde gerceklestirilen kapsamli arastirma bulgulariyla guclendirilmis, kazanma odakli profesyonel versiyonudur. Strateji, CBOE, SpotGamma, Tastytrade, Option Alpha, ApexVol, FlashAlpha ve akademik calismalardan derlenen verilere dayanarak optimize edilmistir. Temel amac: kazanc donemi opsiyon islemlerinde tutarli, risk-ayarli getiriler elde etmek ve ekstrem piyasa kosullarinda sermayeyi korumaktir.

---

## 1. Stratejinin Kisa Ozeti

EarningsPlay stratejisi, kazanc aciklamalari etrafindaki yuksek zimni volatiliteden (IV) faydalanmayi amaclar. Temel olarak **volatilite satisi (Short Vega)** uzerine odaklanir — ozellikle Iron Condor ile IV Crush'a oynar. Nadir durumlarda, dusuk IV Rank ve guclu katalist birlesiminde **volatilite alimi (Long Vega)** olarak Long Straddle degerlendirir.

---

## 2. Stress Test ve 10x10 Simulasyon Bulgulari

Gerceklestirilen stress testi, 500 adet kazanc aciklamasini kapsayan ve VIX endeksinin 30-80 araliginda oldugu ekstrem volatilite senaryolarini icermektedir.

| Metrik | Deger |
|:---|:---|
| Genel Iron Condor Kazanma Orani | 59.40% |
| Genel Iron Condor Ortalama PnL (Stress Test) | -40.11 |
| 10x10 Simulasyon Kazanma Orani | 64.00% |
| 10x10 Simulasyon Ortalama PnL | -13.60 |
| VIX > 45 Oldugunda Iron Condor Ortalama PnL | -36.07 |

**Kritik Ogrenme:** Stress testi, Iron Condor'un ekstrem kosullarda (VIX > 35) zorlandigini gostermektedir. Ancak 2025 arastirma bulgulari, **%50 kar kurali** uygulandiginda kazanma oraninin **%68'e yukseldigini** ve yillik getirinin **%41'e ciktigini** dogrulamistir (Tastytrade/DaysToExpiry backtest). Bu nedenle 50% kar kurali ve 21 DTE cikis kurali mekanik ve zorunlu hale getirilmistir.

---

## 3. Greeks Dashboard ve Uyari Esikleri (YENI)

Profesyonel Greeks yonetimi, stratejinin basarisinin temel tasidir. Asagidaki dashboard, her pozisyon icin gunluk kontrol listesidir.

### 3.1. Greeks-Strateji Matrisi

| Strateji | Delta | Theta | Vega | IV Crush Etkisi |
|:---|:---|:---|:---|:---|
| **Iron Condor** | ~0 | Pozitif | Negatif | **KAR** — IV dususunden kazanc |
| **Short Straddle** | ~0 | En Pozitif | En Negatif | **EN YUKSEK KAR** — Maksimum vega decay |
| **Long Straddle** | ~0 | Negatif | Pozitif | **ZARAR** — IV dususu maliyeti artirir |
| **Calendar Spread** | ~0 | Karisik | Pozitif | Karisik — Arka ay IV dayaniklidir |

### 3.2. Iron Condor Greeks Checklist

| Greek | Hedef Deger | Aciklama |
|:---|:---|:---|
| **Delta** | -0.10 ile +0.10 arasi | Delta notr tolerans; >|0.10| aninda ayarlama |
| **Theta** | Pozitif | Gunluk zaman kaybindan kazanc |
| **Vega** | Negatif | IV dususunden (Crush) kazanc |
| **Gamma** | Negatif ve dusuk | 21 DTE'den once pozisyonu kapat (Gamma riski onle) |
| **Spread** | <%10 | Likidite yeterliligi |
| **OI** | >1,000 kontrat | Likidite yeterliligi |
| **DTE** | 30-45 giris, 21 cikis | Gamma patlamasi oncesi cikis zorunlu |
| **IV Rank** | >%50 | Primlerin yuksek oldugu ortam (ReachMarkets backtest) |

### 3.3. Uyari Esikleri (Threshold Dashboard)

| Greek | Guvenli (Yesil) | Uyari (Sari) | Tehlikeli (Kirmizi) | Aksiyon |
|:---|:---|:---|:---|:---|
| **Delta** | -0.05 to +0.05 | +/-0.05-0.10 | >+/-0.10 | Hemen hedge veya pozisyon kapat |
| **Gamma** | Dusuk (<21 DTE) | Orta (14-21 DTE) | Yuksek (<7 DTE) | 21 DTE'de cik; 7 DTE'de acil kapanis |
| **Theta** | Pozitif (>gunluk maliyet) | Azaliyor | Negatif veya sifir | Theta negatifse Iron Condor bozuluyor |
| **Vega** | Negatif (Short Vega) | Sifira yaklasiyor | Pozitif (Long Vega) | Beklenti degismisse strateji degistir |

### 3.4. Delta Threshold Tablosu (SpotGamma Referansi)

| Delta Durumu | Aksiyon |
|:---|:---|
| +/-0.00-0.05 | Notr — Islem yok, monitor |
| +/-0.05-0.10 | Hafif yonlu — Yakindan izle |
| +/-0.10-0.20 | Yonlu — Ayarlama dusun veya kapat |
| >+/-0.20 | Guclu yonlu — **Hemen ayarla veya kapat** |

### 3.5. Greeks Gunluk Kontrol Listesi

1. **Greek Snapshot:** Her leg ve toplam kitap icin Delta, Gamma, Vega, Theta degerlerini kaydet
2. **Shock Senaryolari:** +/-fiyat, +/-volatilite, +zaman senaryolarini calistir
3. **Limit Kontrolleri:** Sert/yumusak limitlerin asilip asilmadigini kontrol et
4. **Etkinlik Takvimi:** Yaklasan raporlar, kazanc duyurulari, ekonomik veriler
5. **Aksiyon Logu:** Yapilan ayarlamalari ve gerekcelerini kaydet

---

## 4. Ana Strateji: Iron Condor (Kisa Volatilite / Short Vega)

### 4.1. Giris Kriterleri (2025 Guncellemesi)

| Kriter | Eski Deger | Guncel Deger | Kaynak |
|:---|:---|:---|:---|
| **IV Rank Esigi** | >%60 | **>%50** | ReachMarkets backtest — tek filtrenin yillik getiriyi %4 artirdigi kanitlandi |
| **VIX Ust Limiti** | <30 | **<35** (esnek) | SpotGamma, ApexVol |
| **Entry DTE (Genel)** | Ayni gun | **30-45 DTE** | SpotGamma optimal pencere |
| **Entry (Kazanc IC)** | Kazanc oncesi | **1-2 gun once** | Option Samurai |
| **Kar Hedefi** | %60-80 | **%50 (mekanik cikis)** | DaysToExpiry: %68 kazanma orani |
| **21 DTE Kurali** | Yok | **Zorunlu cikis** | Gamma risk yonetimi |
| **Max Loss/Kredi Orani** | 1.2x | **2.0x (%200 stop-loss)** | ApexVol, Tastytrade |
| **Delta Toleransi** | +/-0.10 | **+/-0.10** (korunuyor) | Mevcut dosya ile uyumlu |

### 4.2. Detayli Giris Kriterleri

| Kriter | Aciklama |
|:---|:---|
| **Piyasa Kosulu** | Hisse senedinin kazanc oncesi **IV Rank >%50** olmali. **VIX endeksi <35 olmali.** VIX 35-45 arasi pozisyon %25 azaltilmali veya kaacinilmali. VIX >45'te Iron Condor'dan tamamen kaacin — Long Straddle dusun. |
| **Beklenen Hareket (EM)** | Opsiyon zincirinden cikarilan beklenen hareket, hissenin **son 5 yillik ortalama kazanc sonrasi hareketinden daha yuksek** olmali. Bu, piyasanin asiri tepki verdigini ve VRP (Volatilite Risk Primi) firsatinin yuksek oldugunu gosterir. |
| **Giris Zamanlamasi (Genel IC)** | 30-45 DTE optimal pencerede giris. **21 DTE'de veya %50 kar'da mekanik cikis.** |
| **Giris Zamanlamasi (Kazanc IC)** | Kazanc aciklamasindan **1-2 gun once** giris, 1-2 gun sonrasina kadar vade olmali. Sadece sermayenin %10-20'si ayrilmali. |
| **Yapi** | Delta notr veya hafif yonlu (piyasa yonune gore) ayarlanmis **genis bir Iron Condor.** |
| **Strike Secimi** | Short Call ve Short Put strike'lari, beklenen hareketin (EM) **%10-15 disinda** secilmeli. Long strike'lar, Short strike'lardan yeterli mesafede olmali. |
| **Wing Width** | Hisse fiyatina gore optimize edilmis wing width (Tablo 4.3'e bak). **$5 wing width'lardan kaacin** — negatif P&L uretmektedir. |
| **Kar Yonetimi** | **%50 kar kurali zorunlu** (mekanik cikis). Son %50 kar, zamanin %70+'sini alir; bu surecte gamma riski artar. |
| **Risk Yonetimi** | Max loss toplanan primin 2.0 katini gecmemeli. Delta >|0.10| oldugunda ayarla veya kapat. Gunluk max kayip: hesabin %1-2'si. |

### 4.3. Wing Width Optimizasyonu (Tastytrade 12-Yillik Backtest)

Wing width, hisse fiyatina gore optimize edilmelidir. **$5 wing width negatif P&L uretir** — IWM backtestinde $5 wing -$12.79 ortalama P&L vermistir.

| Hisse Fiyati | Optimal Wing Width | Ortalama P&L | RoC |
|:---|:---|:---|:---|
| ~$150 (ornegin IWM) | $15 | $14.50 | 26.97% |
| ~$200+ (ornegin V) | $20 | $25.00 | 27% |
| ~$300 (ornegin MSFT) | $25 | $35.00 | 20% |
| ~$500+ (ornegin QQQ) | $30 | En yuksek $ kazanci | 18.94% |

**Kural of Thumb:** Wing Width = Hisse Fiyati / 10 (ornegin $200 hisse icin $20 wing)

### 4.4. DTE'ye Gore Wing Width

| DTE Araligi | Wing Width | Aciklama |
|:---|:---|:---|
| 60+ DTE | Genis ($5-8) | Uzun vade, genis wing |
| **45-30 DTE** | **Orta ($3-5)** | **"Sweet Spot" — Optimal risk/odul** |
| 21-14 DTE | Dar ($2-3) | Kisa vade, dar wing |
| 7-0 DTE | Cok dar ($1-2) | Gamma patlamasi riski yuksek — **kaacin** |

### 4.5. Kar Yonetimi — %50 Kar Kuralinin Onemi

| Yonetim Stili | Kazanma Orani | Yillik Getiri |
|:---|:---|:---|
| Expiration'a kadar tutma | 52% | 28% |
| **%50 kar kurali (mekanik)** | **68%** | **41%** |

**Kritik Kural:** Son %50 kar, zamanin %70+'sini alir. Bu surecte gamma riski ustel olarak artar. DaysToExpiry backtesti (2020-2024) bu kuralin kazanma oranini **%52'den %68'e cikardigini** kanitlamistir.

### 4.6. VIX'e Gore Pozisyon Buyuklugu (2025 Guncellemesi)

| VIX Seviyesi | Aksiyon | Pozisyon Buyuklugu | Max Risk |
|:---|:---|:---|:---|
| **VIX < 15** | Optimal IC ortami | %100 normal boyut | Hesabin %1-2 |
| **VIX 15-25** | Normal | %100 normal boyut | Hesabin %1-2 |
| **VIX 25-35** | Yuksek vol — Dikkat | **%50 azaltma** | Hesabin %0.5-1 |
| **VIX 35-45** | Cok yuksek risk | **%25 azaltma veya kaacin** | Hesabin %0.25-0.5 |
| **VIX > 45** | Ekstrem risk | **Islem yapma** — Long Straddle dusun | Hesabin %0.25 (sadece Straddle) |

**Not:** Max Pain calismasi, VIX <15'te Max Pain dogrulugunun %57, VIX >22'de %29'a dustugunu gostermektedir. Dusuk VIX = "pinning" etkisi guclu; yuksek VIX = fiyatlama krilir.

---

## 5. Ikincil Strateji: Long Straddle (Uzun Volatilite / Long Vega)

### 5.1. Long Straddle Kazanma Oranlari (Option Alpha Backtest)

| Hisse | Kazanma Orani | Ortalama Getiri |
|:---|:---|:---|
| AAPL (2007-2017) | 41.38% | -1.31% |
| META (Facebook) | 27% | +0.70% |
| CMG (Chipotle) | 35.48% | -2.59% |

**Kritik Bulgu:** Piyasa, beklenen hareketi ortalama olarak **%70+ dogrulukla** fiyatlar. Long Straddle kazanma orani genellikle **%35-45 arasindadir.** Surdurulebilir bir Long Straddle stratejisi icin minimum **%40+ kazanma orani** ve kazananlarda **2:1 risk/odul orani** gereklidir.

### 5.2. Long Straddle Giris Kriterleri

| Kriter | Deger/Aciklama | Kaynak |
|:---|:---|:---|
| **IV Rank** | **<%60** (dusuk IV = ucuz opsiyon) | Option Samurai |
| **Entry Timing** | Kazanctan **1-5 gun once** | Option Samurai |
| **Exit Timing** | Kazanc sonrasi **30 dakika icinde** (IV Crush baslamadan) | Earnings Straddle Rehberi |
| **Katalist** | Guclu katalist sart: FDA karari, M&A, onemli guidance degisikligi | Sektorel analiz |
| **Max Risk** | Hesabin **%2'sinden fazla risk atma** | Risk yonetimi |
| **Risk/Odul** | Kazananlarda **2:1 R/R** hedefi | Backtest bulgulari |

### 5.3. Straddle Icin En Iyi Hisse ve Sektorler

| Kategori | Ornekler | Straddle Uygunlugu | Tipik Hareket |
|:---|:---|:---|:---|
| **AI ve Semiconductor** | NVDA, AMD, AVGO | Yuksek | Sektorel buyume ve haber duyarliligi |
| **EV ve Clean Energy** | TSLA, NIO, RIVN | Yuksek | Politika duyarliligi, teslimat verileri |
| **Biyoteknoloji** | MRNA, REGN, BIIB | **Cok Yuksek** | FDA kararlari, binary events (**%30-60 hareket**) |
| **Meme/Retail-Driven** | GME, AMC | Cok Yuksek | Sosyal medya momentumu |
| **Crypto-Linked** | COIN, MSTR | Cok Yuksek | Crypto volatilitesi |

**Kritik:** Biyoteknoloji hisselerinde FDA onay kararlari **%30-60+ tek gun hareketleri** yaratabilir. Bu, en iyi straddle ortamidir.

### 5.4. Long Strangle vs Long Straddle

| Faktor | Long Straddle | Long Strangle |
|:---|:---|:---|
| **Maliyet** | Daha yuksek (ATM) | Daha dusuk (OTM) |
| **Breakeven Noktalari** | Daha yakin | Daha uzak |
| **Kar Potansiyeli** | Her yonde hareketten | Daha buyuk hareket gerekli |
| **Kazanma Olasiligi** | Daha yuksek | Daha dusuk |
| **%100 Kayip Riski** | Daha dusuk | Daha yuksek |

**Tavsiye:** Maliyet duyarligi yuksek olanlar icin Strangle alternatifi. EM'nin **%5-10 disindaki OTM strike'larla** Strangle yapilandirilabilir.

### 5.5. Gamma Scalping (Ileri Seviye — Opsiyonel)

Gamma scalping, straddle pozisyonunu delta notr tutarak hisse hareketlerinden kar elde etme stratejisidir.

- **Formul:** Gamma P&L = 0.5 x Gamma x (S)^2
- **Ornek:** SPY ATM straddle (gamma 0.04) ile $2 hareket -> 0.5 x 0.04 x 4 = $8/kontrat
- **Theta maliyeti:** Gunde $10-15. Bu yuzden gunde birden fazla $2+ hareket gerekir.
- **Kural:** Gerceklesen volatilite (RV) > Zimni volatilite (IV) oldugunda karlidir.

**Gamma Scalping Giris Kurallari:**
1. IV > son RV (volatilite "pahali" olmali — Long Straddle icin tam ters, **IV < RV olmali**)
2. Likit underlying (SPY, SPX, QQQ)
3. Gamma >0.03/kontrat
4. $25,000 basina 1-3 straddle
5. Delta hedge trigger: +/-10-15 delta

---

## 6. 0DTE/1DTE Opsiyon Stratejileri (CBOE 2024-2025 Verileri)

### 6.1. 0DTE Pazar Buyumesi (CBOE/OCC 2025)

| Metrik | Deger |
|:---|:---|
| 2025 Toplam Hacim | **15.2 milyar kontrat** (%26 YoY artis) |
| Gunluk Ortalama | 60.4 milyon kontrat |
| 0DTE Gunluk Ortalama | **14 milyon kontrat** (%41 YoY artis) |
| 0DTE Pazar Payi | **Toplam hacmin %24.1'i** (2024'te %21.5) |
| SPX 0DTE | SPX toplam hacminin **%59'u** = gunde 2.3 milyon kontrat |
| Rekor Seans | 4 Nisan 2025: 100 milyon+; 10 Ekim 2025: 110 milyon kontrat |

### 6.2. 0DTE Iron Condor — Performans ve Riskler

| Metrik | 0DTE IC | 0DTE Butterfly |
|:---|:---|:---|
| Kazanma Orani | 75-85% | 45-65% |
| Ortalama Kazanc | $80-120 | $180-500+ |
| Ortalama Kayip | $700-900 | $40-150 |
| Break-even KO | ~%90 | ~%10-15 |
| Skew | Negatif | Pozitif |

**Kritik Uyari (FatTail.ai):** 0DTE IC'de risk/$9 kaybetme $1 kazanma = **%90 kazanma orani gerektirir.** Gamma riski zirvededir.

**Henry Schwartz (CBOE) Uyarisi:** "5 dakika kala $150 kardasin, hisse kucuk hareket ediyor ve aniden $400-500 kaybediyorsun."

### 6.3. 0DTE IC En Iyi Uygulamalar

1. **Sabah volatilitesi dinene kadar bekle** (9:30-10:00 AM giris yok)
2. 10-point spread'ler ~$1.00 prim hedefle
3. Limit emir kullan
4. "Set and forget" veya 10-cent bid stratejisi
5. **Pozisyon buyuklugu hesabin %2-5'inden fazla olmamali**
6. Saat 14:00'den sonra yeni pozisyon acma (sadece deneyimli trader'lar)

### 6.4. 0DTE Gun Ici Giris/Çkis Zamanlamasi

| Zaman Araligi | Kosul | Eylem |
|:---|:---|:---|
| **9:30-10:00 AM** | Acilis volatilitesi | **BEKLE** (giris yok) |
| **10:00-10:30 AM** | Volatilite diniyor | **OPTIMAL GIRIS** |
| **11:00 AM-1:00 PM** | Orta gun durgunlugu | Daha dusuk prim, dusuk volatilite |
| **2:00 PM+** | Gamma riski hizlaniyor | Yeni pozisyon acma — sadece deneyimli |

### 6.5. 0DTE'de Reverse Iron Condor (Debit Yapili)

0DTE'de IC yerine **Reverse IC** (debit odenen, buyuk hareketten kar) dusunulebilir:
- **Kosul:** UOA'da cok yuksek hacimli tek yonlu akis varsa
- **Yapi:** Buy wing'ler, sell ic strike'lar — IV artisindan kar
- **Risk:** Limitli (odecen debit), **odul teorik olarak sinirsiz**

---

## 7. Unusual Options Activity (UOA) Analizi (YENI)

### 7.1. UOA Tespit Kriterleri

UOA, "buyuk oyuncularin" hisse uzerinde bilgi sahibi oldugunun potansiyel sinyalidir.

**Temel Kriterler:**

| Kriter | Esik | Anlam |
|:---|:---|:---|
| Hacim/OI Orani | **>2x** | Yeni pozisyon acilisi (acilis islemi) |
| Premium Esigi | **$100K+** (buyuk cap) / **$50K+** (orta cap) | Kurumsal boyut |
| Put/Call Orani Degisimi | Olaganustu degisim | Yon sinyali |
| IV Sıcramasi | **IV yukselis yok** | Hedge degil, spekulasyon |

**Sweep Order vs Block Trade:**

| Tip | Tanim | Guvenilirlik |
|:---|:---|:---|
| **Sweep** | Birden fazla borsada eszamanli yurutme | Yuksek — Aciliyet ve konviksyon sinyali |
| **Block Trade** | Tek borsada buyuk emir | Orta — Genellikle ozel pazarlik |

### 7.2. UOA Platformlari Karsilastirmasi

| Platform | Fiyat | Ozellikler |
|:---|:---|:---|
| **CheddarFlow** | $35/ay | AI Power Alerts: %63 kazanma orani (Eylul-Ekim 2025) |
| **Unusual Whales** | $24/ay | Real-time flow, topluluk odakli |
| **FlowAlgo** | $34/ay | Kurumsal akis takibi |
| **TradeAlgo** | $29/ay | AI skorlama, dark pool entegrasyonu |

**Kritik Uyari:** "Flow verisi olmadan karli degilseniz, flow verisi ekleyerek karli olamazsiniz. Once stratejinizi duzeltin."

### 7.3. UOA + Kazanc Kombinasyon Stratejisi

**Filtreleme Adimlari:**

1. Kazanctan 1-2 gun once UOA artisi mi? -> Yuksek volatilite beklentisi
2. Put/Call skew'de ani degisim mi? -> Yon sinyali
3. Hacim/OI >2x kuralini sagliyor mu? -> Gercek pozisyon
4. Premium $100K+ mi? -> Kurumsal boyut
5. Teknik grafik ile uyusuyor mu? -> Onay sinyali

**False Signal Filtreleme:**
- Earnings veya ex-dividend tarihi olup olmadigini kontrol et
- Teknik grafik ile onayla
- Premium esiklerini yuksek tut ($100K+)
- Hacim/OI >2x kuralini uygula

---

## 8. Post-Earnings Announcement Drift (PEAD) Modulu (YENI)

### 8.1. PEAD Nedir?

PEAD, kazanc surprizi aciklandiktan sonra hissenin surpriz yonunde **gunler/haftalar boyunca suruklenme** egilimidir. Akademik olarak kanitlanmis bir anomali.

### 8.2. PEAD Istatistikleri

| Metrik | Deger | Kaynak |
|:---|:---|:---|
| Anormal Getiri | **%2.6-9.4/ceyrek** | Akademik calismalar |
| Drift Yogunlugu | **%25-30** sonraki 3 kazanc duyurusunun 3-gunluk pencerelerinde | UCLA |
| Mikro-cap Anlamlilik | t-stat: **2.18** (mikro-cap haric: 1.43) | Anderson Review, UCLA 2026 |

### 8.3. PEAD Islem Stratejisi

**SUE Skoru Hesaplama:**
- **SUE = (Gercek EPS - Beklenen EPS) / EPS Standart Sapmasi**
- **SUE > +2:** Gucu PEAD sinyali — Pozitif drift bekle
- **SUE < -2:** Gucu negatif PEAD sinyali — Negatif drift bekle

**PEAD Giris Kurallari:**
1. Kazanc aciklamasindan **sonraki gun acilista** giris
2. SUE skoru **+2 veya -2** uzeri olmali
3. Hacim, ortalamanin **2x uzerinde** olmali (onay sinyali)
4. Tutma suresi: **60-90 gun** (3 ay)
5. Pozisyon: Hisse senedi veya ITM opsiyon (delta >0.70)
6. Stop-loss: Giris fiyatindan **%8-10** ters yonde

### 8.4. PEAD Uygun Hisse Kriterleri

| Kriter | Aciklama |
|:---|:---|
| **SUE Skoru** | >+2 (pozitif PEAD) veya <-2 (negatif PEAD) |
| **Surpriz Yonu** | Beat = yukari drift, Miss = asagi drift |
| **Hacim Onayi** | Kazanc gunu hacim > 2x gunluk ortalama |
| **Sektor** | Mikro-cap ve kucuk-cap'lerde etki daha guclu |
| **Tutma Suresi** | 60-90 gun |
| **Pozisyon Buyuklugu** | Hesabin %3-5'i |

---

## 9. Sektor ve Hisse Spesifik IV Davranislari

### 9.1. Sektorlere Gore IV Crush Buyuklugu (FlashAlpha Verileri)

| Sektor | Tipik IV Dususu | Ornekler | Strateji Ayarlamasi |
|:---|:---|:---|:---|
| **Mega-cap Teknoloji** | %30-50 | AAPL, MSFT, GOOGL, AMZN | Genis IC, standard pozisyon |
| **High-beta Teknoloji** | %35-55 | TSLA, NVDA, AMD, NFLX | Cok genis IC veya kucuk pozisyon |
| **Biyoteknoloji** | **%40-70** | MRNA, BIIB, REGN | Binary event — Straddle veya kac |
| **Finansal** | %20-35 | JPM, GS, BAC, WFC | Dar IC, yuksek kazanma olasiligi |
| **Consumer Staples** | %15-30 | COST, WMT, PG, KO | Dar IC, dusuk prim |
| **Kamu Hizmetleri** | %15-25 | NEE, DUK, SO | Cok dar IC veya islem yapma |

**Kritik Bulgu:** Biyoteknoloji **en agresif IV Crush'i verir** (binary event'lerden dolayi). Kamu hizmetleri **en zayif crush'i verir.**

### 9.2. "IV Crush Kings" — En Iyi Iron Condor Hisseleri (SpotGamma)

| Sira | Hisse | Profil | IV Crush Neden Guclu |
|:---|:---|:---|:---|
| 1 | **NVDA** | AI merkezli | Earnings oncesi IV asiri sisiyor, genellikle realize hareket < implied move |
| 2 | **TSLA** | Retail favorisi | "Lotto ticket" call talebi extrinsic value'yu sisiriyor |
| 3 | **NFLX** | Gap yapan | Earnings'te gap yapiyor ama IV crush o kadar derin ki %%10 hareket bile OTM option'lari dusuruyor |
| 4 | **AAPL** | "Safe haven" | Cok derin opsiyon zinciri = verimli vega decay |
| 5 | **AMZN** | Market weight | Dealer'lar agresif tail risk fiyatlar, risk gerceklesmeyince hizli cokus |

### 9.3. Implied vs Actual Move — Hangi Hisse Hangi Strateji?

| Hisse | Implied Move (Ort) | Actual Move (Ort) | Piyasa Asiri mi Tahmin Ediyor? | Onerilen Strateji |
|:---|:---|:---|:---|:---|
| **NVDA** | +/-%6.7 | %6.5 (absolute) | **Evet** (%70 zaman) | **Iron Condor** |
| **AAPL** | +/-%3.5 | %2.8 (absolute) | Evet | **Iron Condor** |
| **TSLA** | +/-%8.0 | %8.5 (absolute) | Hayir | **Long Straddle** (guclu katalist ile) |
| **NFLX** | +/-%7.0 | %6.0 (absolute) | Evet | **Iron Condor** |
| **META** | +/-%6.0 | %7.5 (absolute) | Hayir | **Long Straddle** |

### 9.4. AAPL Spesifik IV Crush Verileri (MarketChameleon)

| Metrik | Deger |
|:---|:---|
| Kazanc Oncesi Ortalama IV | 32.2% |
| Kazanc Sonrasi Ertesi Gun IV | 26.4% (**~%18 dusus**) |
| 5 Gun Sonra IV | 25.6% (ek %3 dusus) |
| **Toplam IV Crush** | **~%20-22** |

### 9.5. NVDA Implied vs Actual Move (MarketChameleon)

| Metrik | Deger |
|:---|:---|
| 12 Ceyrek Tahmin Dogrulugu | **%70 zaman asiri tahmin** |
| Ortalama Predicted Move | +/-%6.7 |
| Ortalama Actual Move | %6.5 (absolute) |
| **Sonuc** | NVDA icin Iron Condor istatistiksel olarak mantikli |

---

## 10. Ileri Teknik Analiz Entegrasyonu

### 10.1. Volume Profile (Hacim Profili)

| Arac | Uygulama | Strateji Ayarlamasi |
|:---|:---|:---|
| **POC (Point of Control)** | En cok hacmin olustugu fiyat | Iron Condor short strike'lari POC'nin disina yerlestir |
| **HVN (High Volume Node)** | Guclu destek/direnc | Fiyatin takilma olasiligi yuksek — IC guvenlik bolgesi |
| **LVN (Low Volume Node)** | Fiyatin hizla gecebilecegi bosluk | Long Straddle icin hizli hareket potansiyeli |

### 10.2. Fibonacci Seviyeleri

| Seviye | Iron Condor | Long Straddle |
|:---|:---|:---|
| **0.382 Retracement** | Short strike disi guvenlik siniri | — |
| **0.50 Retracement** | — | Breakeven referansi |
| **0.618 Retracement** | "Last line of defense" | Hedef fiyat |
| **1.272 Extension** | Max risk sinirlamasi | Kar hedefi 1 |
| **1.618 Extension** | — | Kar hedefi 2 (cikis dusun) |

### 10.3. Coklu Zaman Dilimi Analizi (MTF)

| Zaman Dilimi | Amac | Strateji Entegrasyonu |
|:---|:---|:---|
| **Gunluk / 4H** | Ana trendi belirle | Genel piyasa yonunu anla |
| **1H** | Destek/direnc seviyeleri | Strike seciminde referans |
| **15-30D** | Giris/ckis noktalari | Hassas giris ve stop-loss |

---

## 11. Opsiyon Zinciri Analizi — OI Build-up ve Max Pain

### 11.1. Volume/OI Orani Analizi

| Oran | Yorumlama |
|:---|:---|
| **Volume/OI > 2** | Yeni pozisyon acilisi (acilis) |
| **Volume/OI < 1** | Mevcut pozisyon kapanmasi |
| **Volume/OI > 3 (kazanc oncesi)** | Yuksek volatilite beklentisi |

### 11.2. Put/Call Skew Yorumlama

| Skew Durumu | Yorumlama | Etki |
|:---|:---|:---|
| **Pozitif Skew** (Put IV > Call IV) | Ayi piyasasi duyarliligi, asagi korunma talebi | Iron Condor: Put tarafini genislet |
| **Negatif Skew** (Call IV > Put IV) | Boga piyasasi duyarliligi, yukari spekulasyon | Iron Condor: Call tarafini genislet |
| **Notr Skew** | Denge duyarlilik | Standard Iron Condor |

### 11.3. Max Pain Teorisi

| Metrik | Deger | Yorum |
|:---|:---|:---|
| SPX +/-1% icinde kapanma | %48 zaman | Zayif guc |
| SPX +/-2% icinde kapanma | %68 zaman | Orta guc |
| **VIX<15'te dogruluk** | **%57** | **Dusuk VIX'te kullanilabilir** |
| **VIX>22'de dogruluk** | **%29** | **Yuksek VIX'te "gurultuden ibaret"** |

**Kural:** Max Pain sadece **VIX < 15** ortamlarinda Iron Condor strike seciminde ikincil filtre olarak kullanilir. **VIX > 22'de goz ardi edilir.**

### 11.4. OI Build-up ve Strike Clustering

| Olgu | Anlam | Strateji |
|:---|:---|:---|
| **Yuksek OI'lu strike** | Potansiyel destek/direnc | Short strike'lar bu seviyelerin disina |
| **Call OI yogunlasmasi** | Direnç seviyesi | Call short strike > en yuksek call OI |
| **Put OI yogunlasmasi** | Destek seviyesi | Put short strike < en yuksek put OI |
| **ATM OI birikimi (kazanc oncesi)** | Beklenen hareket buyuklugu | IC short strike'lari bu birikimin disina |

---

## 12. Mevsimsel ve Makro Konjonktur Entegrasyonu

### 12.1. Mevsimsel Kazanc Donguleri

| Donem | Volatilite | Strateji |
|:---|:---|:---|
| **Q1 (Ocak-Mart)** | Yuksek — yil basi belirsizligi | Genis IC, kucuk pozisyon |
| **Q2 (Nisan-Haziran)** | Orta — "Sell in May" | Standard IC |
| **Q3 (Temmuz-Eylul)** | Yuksek — yaz oynakligi | Genis IC, dikkatli |
| **Q4 (Ekim-Aralik)** | Orta-Yuksek | Standard IC, yil sonu rebalancing |

### 12.2. Makro Konjonktur

| Faktor | Etki | Strateji |
|:---|:---|:---|
| **Buyume Donemi** (dusuk issizlik, yuksek GSYIH) | Risk iştahi yuksek | Daha fazla IC firsati, daha genis aralik |
| **Resesyon Beklentisi** | Piyasa temkinli | IC riskli, Long Straddle dusun |
| **Yuksek Enflasyon/Faiz** | Kazanc "miss" riski artar | Defansif IC (genis aralik, az prim) |

---

## 13. Genel Risk Yonetimi ve Disiplin

### 13.1. Pozisyon Buyuklugu Kurallari

| Strateji | Normal Boyut | Yuksek VIX (25-35) | Ekstrem VIX (>45) |
|:---|:---|:---|:---|
| Iron Condor | Hesabin %1-2 | %50 azaltma | Islem yapma |
| Long Straddle | Hesabin %2 | %50 azaltma | Hesabin %1 (sadece guclu katalist) |
| PEAD | Hesabin %3-5 | Standard | %50 azaltma |
| 0DTE IC | Hesabin %2-5 | — | — |

### 13.2. Cselendirme

- **Tek hisse:** Maksimum hesabin %5'i
- **Tek sektor:** Maksimum hesabin %15'i
- **Kazanc tarihleri:** Farkli tarihlere yay (korelasyonu dusur)
- **Strateji:** %80 Iron Condor, %15 Long Straddle, %5 PEAD

### 13.3. Duygusal Disiplin

1. Kararlar **onceden yazili** kurallara gore alinir — anlik hislere yer yok
2. **%50 kar kurali** mekaniktir — "biraz daha bekle" yok
3. **21 DTE cikis kurali** kutsaldir — gamma riskine meydan okuma
4. Stop-loss **asla genisletilmez** — piyasa yanlis oldugunu kabul et
5. Gunluk max kayip asildiginda **gunu kapat** — intikam islemi yok

### 13.4. Gunluk Is Akisi

| Adim | Gorev | Sure |
|:---|:---|:---|
| 1 | Greeks Dashboard kontrolu | 5 dk |
| 2 | VIX ve IV Rank tarama | 10 dk |
| 3 | Kazanc takvimi kontrolu | 5 dk |
| 4 | UOA taramasi (varsa) | 10 dk |
| 5 | Teknik analiz (Volume Profile, Fibonacci) | 15 dk |
| 6 | Strike secimi ve order girisi | 10 dk |
| 7 | Mevcut pozisyon kar/zarar kontrolu | 5 dk |

---

## 14. Strateji Ozet Tablolari

### 14.1. Iron Condor — Tam Parametre Ozeti

| Parametre | Deger | Aciklama |
|:---|:---|:---|
| IV Rank | >%50 | ReachMarkets backtest |
| VIX | <35 | Guvenli bolge |
| Entry DTE (Genel) | 30-45 | Optimal pencere |
| Entry (Kazanc IC) | Kazanctan 1-2 gun once | Option Samurai |
| Cikis DTE | 21 (zorunlu) | Gamma risk onlemi |
| Cikis Kar | %50 (mekanik) | DaysToExpiry backtest |
| Wing Width | Hisse fiyati/10 | Tastytrade 12 yillik backtest |
| Max Loss/Kredi | 2.0x | ApexVol, Tastytrade |
| Delta Tolerans | +/-0.10 | Korunuyor |
| Pozisyon Buyuklugu | VIX'e gore degisken | Yukaridaki tabloya bak |

### 14.2. Long Straddle — Tam Parametre Ozeti

| Parametre | Deger | Aciklama |
|:---|:---|:---|
| IV Rank | <%60 | Dusuk IV = ucuz opsiyon |
| Entry | Kazanctan 1-5 gun once | Option Samurai |
| Cikis | Kazanc sonrasi 30 dk icinde | IV Crush baslamadan |
| Katalist | FDA, M&A, guidance | Guclu katalist sart |
| Max Risk | Hesabin %2'si | Asla gecme |
| R/R Hedefi | 2:1 | Backtest gereksinimi |
| En Iyi Sektorler | Biotech, AI/Semi, EV | Volatilite kategorileri |

### 14.3. PEAD — Tam Parametre Ozeti

| Parametre | Deger | Aciklama |
|:---|:---|:---|
| SUE Skoru | >+2 veya <-2 | 2 standart sapma uzeri surpriz |
| Giris | Ertesi gun acilis | Kazanc aciklamasi sonrasi |
| Hacim Onayi | >2x ortalama | Guc onayi |
| Tutma | 60-90 gun | 3 ay drift bekle |
| Stop-loss | %8-10 | Ters yonde |
| Pozisyon | Hisse veya ITM opsiyon | Delta >0.70 |
| Boyut | Hesabin %3-5 | Daha buyuk allocation mumkun |


---

## [YENI v3.0] Bolum A: VIX + Earnings Kombinasyon Modulu

VIX (CBOE Volatility Index) seviyesi, earnings stratejisi seciminde en kritik makro filtredir. Bu bolum, VIX seviyesine gore earnings stratejisi secimi, VIX crush + earnings IV crush ikili etkisini, VIX hedge ile earnings trade korumasini ve VVIX gostergesini detaylandirir.

---

### A.1. VIX Seviyesine Gore Earnings Stratejisi Secimi

Earnings doneminde VIX seviyesi, hem hisse bazli (single-stock) hem de endeks bazli earnings stratejilerinin secimini belirler. Asagidaki tablo, tum VIX rejimlerindeki strateji secimini ozetler:

| VIX Seviyesi | Earnings Stratejisi | Wing Width | Pozisyon Buyuklugu | Kazanma Olasiligi | Kaynak |
|:---|:---|:---|:---|:---|:---|
| **VIX < 15** (Sakinlik) | **Standard Iron Condor** | Normal (hisse/10) | %100 normal | **%68-75** (en yuksek) | DaysToExpiry backtest |
| **VIX 15-25** (Normal) | **Wider Iron Condor** | Genisletilmis (+%20) | %100 normal | **%65-70** | Tastytrade 12 yil |
| **VIX 25-35** (Yuksek Vol) | **Reduced Size IC** veya **Long Straddle** | Cok genis (+%40) | **%50 azaltma** | **%55-65** | ApexVol |
| **VIX 35-45** (Panik) | **Long Straddle** veya **No Trade** | — | **%25 azaltma** | Long Straddle: %40-50 | SpotGamma |
| **VIX > 45** (Extreme) | **NO Earnings Trade** | — | Islem yapma | — | Stress test |

**Kritik Kural:** VIX > 35 oldugunda earnings IV crush hala gerceklesir, ancak hissenin earnings disi hareketleri (piyasa korelasyonu) Iron Condor'u zorlar. VIX > 45'te hissenin earnings bagimsiz hareket etme olasiligi duser — "tum gemiler ayni havada yuzer."

---

### A.2. VIX Crush + Earnings IV Crush Ikili Etkisi

Earnings doneminde iki farkli volatilite "crush" mekanizmasi calisir:

**1. Earnings IV Crush (Hisse Bazli):**
- Kazanc aciklamasi sonrasi hissenin zimni volatilitesi %30-70 duser
- Bu, Iron Condor'un temel kar kaynagidir
- Sektorel farkliliklar: Biotech %40-70 crush, Utilities %15-25 crush

**2. VIX Crush (Endeks Bazli):**
- VIX, S&P 500 opsiyonlarinin agirlikli ortalama implied volatility'sidir
- Earnings doneminin tamaminin bitmesiyle VIX genellikle %15-25 duser
- VIX crush, ozellikle **son buyuk earnings gununden sonra** (genellikle bir cuma) en siddetlidir

**Ikili Etki (Double Crush) — Kazanc Potansiyeli:**

| Senaryo | Earnings IV Crush | VIX Crush | Toplam Etki | Strateji |
|:---|:---|:---|:---|:---|
| Sadece earnings crush | %30-50 dusus | Yok | Tek koldan kar | Standard IC |
| Sadece VIX crush | Yok | %15-25 dusus | Daha dusuk kar | Endeks IC |
| **Ikili crush (en iyi)** | %30-50 dusus | %15-25 dusus | **En yuksek kar** | Hisse IC + Endeks IC |
| Hicbiri (katastrof) | IV artis | VIX artis | **Zarar** | Long Straddle dusun |

**Taktiksel Uygulama:** Earnings sezonunun **son haftasinda** (genellikle cuma gunu) hem hisse hem endeks (SPY/SPX) Iron Condor'u birlikte acmak, ikili crush etkisinden maksimum fayda saglar. Bu donemde VIX crush + kalan hisselerin earnings IV crush'i "cift koldan" kazanc uretir.

**Kazanma Olasiligi:** Ikili crush senaryosunda Iron Condor kazanma orani **%72-78** arasina cikar (FlashAlpha verileri).

---

### A.3. VIX Hedge ile Earnings Trade Korumasi

Earnings portfoyunu VIX patlamalarina karsi korumak icin maliyet-etkin hedge stratejileri:

#### A.3.1. Protective VIX Call Spread (Earnings Portfoyu Icin)

| Parametre | Deger | Aciklama |
|:---|:---|:---|
| **Yapi** | Long VIX Call + Short VIX Call (daha yuksek strike) | Bull Call Spread |
| **Ornek** | VIX 20 Call al, VIX 30 Call sat | $1.00-1.50 net debit |
| **Max Kar** | Spread - debit = $10 - $1.50 = $8.50 | VIX 30+ oldugunda |
| **Hedge Orani** | Earnings portfoyunun **%10-15 degeri** kadar | $100K portfoy -> $10-15K hedge |
| **Zamanlama** | Earnings sezonu **baslamadan 1-2 hafta once** | VIX dusukken ucuz al |

**Neden Call Spread, Neden Tek Call Degil?**
- Tek call daha pahalidir (higher premium)
- Call spread maliyeti %50-70 dusurur
- Max kar sinirli olsa da, hedge amaci "tam koruma" degil, "felaket sigortasi"dir
- VIX 30+ oldugunda hedge odemesi yapar

#### A.3.2. VIX Tail Hedge Metodolojisi (CBOE VXTH Uyarlamasi)

| VIX Seviyesi | Earnings Portfoy Hedge Orani | Aksiyon |
|:---|:---|:---|
| **VIX < 15** | **%0 hedge** | Ucuz ama gerek yok — earnings focus |
| **VIX 15-30** | **%1 hedge** | Tam koruma — VIX call spread |
| **VIX 30-50** | **%0.5 hedge** | Yari koruma — opsiyonlar pahali |
| **VIX > 50** | **%0 hedge** | Cok gec — earnings trade durdur |

#### A.3.3. Hedge + Earnings Kombinasyon Ornegi

**Portfoy:** $100K, 5 farkli hisse earnings IC'si ($2K risk her biri = $10K toplam risk)

| Adim | Islem | Maliyet | Amac |
|:---|:---|:---|:---|
| 1 | VIX 20/30 Call Spread al (10 kontrat) | ~$1,500 | Portfoyu VIX patlamasina karsi koru |
| 2 | 5 hisse earnings IC'si ac | ~$10,000 risk | Earnings IV crush'dan kar elde et |
| 3 | Toplam risk | $11,500 | Hedge maliyeti: portfoyun sadece %1.5'i |
| 4 | VIX 25+ oldugunda | Hedge aktif | Earnings trade'lerin %50'sini kapat |
| 5 | VIX 30+ oldugunda | Hedge odemesi | Kalan earnings trade'leri de kapat |

**Expected Outcome:** VIX patlamasi durumunda hedge $8,500 kar uretir, earnings trade'lerin kaybi $5,000+ olabilir. **Net: Pozitif veya breakeven.**

---

### A.4. VVIX (VIX of VIX) Gostergesi ve Earnings Volatilite Tahmini

VVIX, VIX opsiyonlarinin zimni volatilitesini olcer — "volatilite volatilitesi"dir. Earnings doneminde VVIX, beklenen volatilite degisiminin siddetini ongorur.

#### A.4.1. VVIX Yorumlama Tablosu

| VVIX Seviyesi | Anlami | Earnings Stratejisi Etkisi |
|:---|:---|:---|
| **VVIX < 80** | VIX'te sakinlik beklentisi | Standard IC — volatilite degisimi dusuk |
| **VVIX 80-100** | VIX'te normal degisim | Normal IC — earnings crush beklenebilir |
| **VVIX 100-120** | VIX'te ani hareket beklentisi yuksek | **Dikkat** — VIX spike earnings trade'leri etkileyebilir |
| **VVIX 120-140** | Yuksek vol of vol — "volatilite patlamasi" riski | **Wider wings** veya pozisyon azalt |
| **VVIX > 140** | Asiri vol of vol — piyasa cok "nervoz" | **Earnings trade durdur** veya sadece Long Straddle |

#### A.4.2. VIX/VVIX Z-Score Kombinasyonu

VIX ve VVIX'in Z-score kombinasyonu, earnings doneminde daha guclu sinyaller uretir:

| VIX Z-Score | VVIX Z-Score | Kombinasyon Yorumu | Earnings Aksiyonu |
|:---|:---|:---|:---|
| Z < -1 (dusuk) | Z < -1 (dusuk) | Her ikisi dusuk = **Optimal IC ortami** | Agresif IC girisleri |
| Z < -1 | Z > +1 (yuksek) | VIX dusuk, VVIX yuksek = **"Sakin firtina oncesi"** | Dikkatli IC, hedge hazir tut |
| Z > +1 (yuksek) | Z < -1 | VIX yuksek, VVIX dusuk = **"Yuksek ama stabil"** | Wider wings, reduced size |
| **Z > +1** | **Z > +1** | **Her ikisi yuksek = "Firtina icinde"** | **Earnings trade durdur** |

**Formul:** VIX Z-Score = (VIX - 20 gunluk ortalama VIX) / 20 gunluk standart sapma

#### A.4.3. VVIX + Earnings Takvimi Kombinasyon Stratejisi

| VVIX Durumu | Earnings Takvimine Gore Aksiyon |
|:---|:---|
| VVIX < 90 | Earnings sezonu baslangici = **Aggresif IC acilis donemi** |
| VVIX 90-110 | Earnings sezonu ortasi = **Standard IC, kar realizasyonu** |
| VVIX 110-130 | Earnings sezonu sonu = **Cok dikkatli, wider wings** |
| VVIX > 130 | Earnings sezonu sonrasi = **VIX crush trade bekle** |

**Kritik Bulgu:** VVIX > 120 oldugunda, earnings IV crush hala gerceklesir, ancak VIX'in ani yukselisi portfoydeki diger pozisyonlari etkiler. Bu durumda **sadece en guclu IC setup'lari** degerlendirilir.

---

### A.5. VIX Term Structure (VIX9D/VIX) ve Earnings Zamanlamasi

VIX term structure, earnings doneminde kritik bir oncu gostergedir.

| Term Structure | Earnings Donemi Anlami | Strateji |
|:---|:---|:---|
| **Contango** (VIX9D < VIX) | Normal — kisa vadeli vol < uzun vadeli vol | Standard IC — IV crush beklentisi gercekci |
| **Flat** (VIX9D ≈ VIX) | Uyari — kisa ve uzun vol esit | Dikkatli — ani degisim olabilir |
| **Backwardation** (VIX9D > VIX) | Kisa vadeli panik > uzun vadeli | **Earnings trade durdur** veya sadece Long Straddle |

**Earnings Sezonu VIX9D/VIX Rehberi:**
- Earnings sezonu basinda backwardation varsa: Sezon **cok volatil** gececek demektir
- Earnings sezonu sonunda backwardation'dan contango'ya donus: **VIX crush firsati** — endeks IC ac
- VIX9D/VIX > 1.2: Kisa vadeli stres cok yuksek — hisse earnings'lerinden ziyade endeks odaklan

---

### A.6. VIX + Earnings Kombinasyon — Checklist

Her earnings trade oncesi bu checklist tamamlanmalidir:

1. [ ] **VIX seviyesi:** < 35 mi? (Evet = devam, Hayir = dikkat/azalt)
2. [ ] **VVIX seviyesi:** < 120 mi? (Evet = devam, Hayir = wider wings/durdur)
3. [ ] **VIX9D/VIX:** < 1.2 mi? (Contango veya flat = devam, Backwardation = dikkat)
4. [ ] **VIX trend:** Yukseliyor mu dusuyor mu? (Yukseliyorsa = hedge hazirla)
5. [ ] **Hedge aktif mi?** VIX > 25 ise VIX call spread hedge kontrol et
6. [ ] **Pozisyon buyuklugu:** VIX seviyesine gore ayarlandi mi?
7. [ ] **Wing width:** VIX yuksekse genisletildi mi?
8. [ ] **Cikis plani:** VIX ani yukselirse ne yapilacak? (Önceden yazili)


---

## [YENI v3.0] Bolum B: Sentiment + Earnings Modulu

Piyasa duyarliligi (sentiment) ve bireysel/kurumsal yatirimci davranislari, earnings doneminde hisse hareketlerinin buyuklugunu ve yonunu etkiler. Bu bolum, Fear & Greed Index, AAII Bull-Bear Spread, put/call skew ve post-earnings drift + sentiment kombinasyonunu detaylandirir.

---

### B.1. Fear & Greed Index ve Earnings Donemi Iliskisi

CNN Fear & Greed Index (0-100 skala), piyasa duyarliligini 7 bilesenden olcen composite bir endekstir. Earnings doneminde bu index, hisse bazli hareketlerin "makro ruzgar" ile nasil etkilesecegini gosterir.

#### B.1.1. F&G Index Earnings Stratejisi Matrisi

| F&G Index Seviyesi | Duyarlilik | Earnings Strateji Etkisi | Tavsiye Edilen Strateji | Kazanma Olasiligi |
|:---|:---|:---|:---|:---|
| **0-25 (Extreme Fear)** | Asiri korku, capitulation | Earnings hareketleri **daha buyuk** — stop hunt'lar sik | **Wider IC** veya **Long Straddle** (kriz hisselerinde) | IC: %55-65, Straddle: %45-55 |
| **26-39 (Fear)** | Tedirginlik, defansif pozisyonlama | Earnings tepkileri **modest**, surprise daha sert yasanir | **Wider IC** (normalden %20 genis) | IC: %65-72 |
| **40-60 (Neutral)** | Denge | **Optimal earnings ortami** — hisseler "kendi hikayesini" anlatir | **Standard IC** | **IC: %68-75 (en yuksek)** |
| **61-75 (Greed)** | Iyimserlik, risk iştahi yuksek | Earnings "beat" bile dususle sonuclanabilir (buyuk beklenti) | **Dar IC** veya **Long Straddle** (sadece guclu katalist) | IC: %60-68 |
| **76-100 (Extreme Greed)** | Asiri hirs, FOMO | Earnings "miss" = sert dusus; "beat" = muted yukselis | **Cok dar IC** veya **No trade** | IC: %50-60 (en dusuk) |

**Kritik Bulgu:** F&G Index 40-60 (Neutral) araliginda earnings IC kazanma orani **en yuksek seviyededir** (%68-75). Extreme Fear ve Extreme Greed donemlerinde kazanma orani %50-65'e duser cunku hisseler "kendi hikayesinden" cok "makro ruzgar" ile hareket eder.

#### B.1.2. Extreme Fear Doneminde Earnings = Daha Buyuk Hareketler

Tarihsel veriler, Extreme Fear (< 25) donemlerinde earnings sonrasi hisse hareketlerinin **normalden %30-50 daha buyuk** oldugunu gostermektedir:

| F&G Index | Ortalama Earnings Sonrasi Hareket | Volatilite | Strateji Implication |
|:---|:---|:---|:---|
| Extreme Fear (< 25) | **%8-12+** (normalin 1.5x'i) | Yuksek | Wider wings, daha dusuk position size |
| Fear (25-39) | **%5-8** | Orta-Yuksek | Standard'dan %20 genis wing |
| Neutral (40-60) | **%4-6** | Orta | Standard wing |
| Greed (61-75) | **%3-5** | Orta | Standard veya dar wing |
| Extreme Greed (> 75) | **%5-8+** (asimetrik — asagi) | Yuksek (tek yonlu) | Cok dar IC veya no trade |

**Neden Extreme Fear'de Daha Buyuk Hareketler?**
1. Capitulation (teslimiyet) sonrasi hisselerde "bas donusu" beklentisi — herkes satmaya hazir
2. Dusuk likidite — kucuk hacimlerle buyuk hareketler
3. Earnings surprizi, "son damla" olur — piyasa asiri tepki verir
4. Stop-loss seviyeleri siklikla kirilir, kaskat hareketler olusur

**Taktik:** F&G < 25'te earnings trade acarken:
- Wing width'i normalin **%30-40 daha genis** yap
- Position size'yi **%50 azalt**
- Long Straddle'i degerlendir (hisse ozelinde)
- Stop-loss'lari normalin **2 katina cikar** (whipsaw onleme)

---

### B.2. AAII Bull-Bear Spread ve Earnings Tepkisi Korelasyonu

AAII (American Association of Individual Investors) haftalik duyarlilik anketi, 1987'den beri yayinlanmaktadir. Bull-Bear Spread, bireysel yatirimcilarin iyimserlik/kotumserlik oranini gosterir.

#### B.2.1. AAII Bull-Bear Spread Earnings Rehberi

| Spread Seviyesi | Anlami | Earnings Tepkisi | Strateji |
|:---|:---|:---|:---|
| **< -20%** (Asiri Kotumser) | Herkes bearish | Earnings beat = **sert yukselis** (short squeeze) | Long Straddle veya Wider IC |
| **-20% ile -5%** (Kotumser) | Cogunluk bearish | Earnings beat = **guclu yukselis** | Genis IC, put tarafi uzak |
| **-5% ile +5%** (Dengeli) | Notr | Earnings tepkisi **normal** | Standard IC |
| **+5% ile +20%** (Iyimser) | Cogunluk bullish | Earnings miss = **sert dusus** | Dar IC, call tarafi uzak |
| **> +20%** (Asiri Iyimser) | Herkes bullish | Earnings miss = **cok sert dusus** | Cok dar IC veya no trade |

#### B.2.2. AAII Spread + Earnings Performans Istatistikleri

| AAII Spread | Earnings Beat Sonrasi Getiri | Earnings Miss Sonrasi Getiri | Kaynak |
|:---|:---|:---|:---|
| < -20% | **+%4.2 (5 gunluk)** | -%3.1 | AAII 2005-2024 analizi |
| -20% ile 0% | **+%2.8 (5 gunluk)** | -%4.5 | AAII 2005-2024 analizi |
| 0% ile +20% | **+%1.9 (5 gunluk)** | **-%6.2 (5 gunluk)** | AAII 2005-2024 analizi |
| > +20% | **+%1.2 (5 gunluk)** | **-%8.7 (5 gunluk)** | AAII 2005-2024 analizi |

**Kritik Bulgu:** AAII Spread > +20% (asiri iyimserlik) oldugunda, earnings miss sonrasi hisse **5 gunde ortalama %8.7 duser.** Bu, "buyuk beklentilerin hayal kirikligi" etkisidir. Bu donemde **asla IC acma** veya cok dar IC ile (call tarafi cok uzak) limitli risk al.

#### B.2.3. AAII + F&G Kombinasyonu (Cift Onay Sistemi)

| F&G Index | AAII Spread | Kombinasyon Yorumu | Earnings Stratejisi | Kazanma Olasiligi |
|:---|:---|:---|:---|:---|
| < 25 (Extreme Fear) | < -20% (Asiri Kotumser) | **"Cift asiri korku" = Dip bolgesi** | Long Straddle (guclu hisselerde) | %45-55 |
| < 25 | -20% ile 0% | Makro korku, bireysel notr | Wider IC | %60-68 |
| 40-60 (Neutral) | -5% ile +5% | **"Mukemmel denge" = Optimal** | Standard IC | **%70-75** |
| > 75 (Extreme Greed) | > +20% (Asiri Iyimser) | **"Cift asiri hirs" = Tepe bolgesi** | Cok dar IC veya no trade | %50-58 |
| > 75 | 0% ile +20% | Makro hirs, bireysel dengeli | Dikkatli IC, kar realize | %55-65 |

---

### B.3. Sentiment + IV Crush Kombinasyon Stratejisi

Sentiment ve IV Crush'un birlesimi, earnings stratejisinde "uc katmanli" bir analiz saglar:

#### B.3.1. Sentiment-IV Crush Matrisi

| Sentiment Durumu | IV Rank | Kombinasyon | Strateji | Beklenti |
|:---|:---|:---|:---|:---|
| **Extreme Fear (F&G<25)** | >%50 (Yuksek IV) | Korku + yuksek prim | **Wider IC** (yuksek prim topla, genis aralik) | %65-72 kazanma, yuksek prim |
| **Extreme Fear** | <%40 (Dusuk IV) | Korku + dusuk prim | **Long Straddle** (ucuz opsiyon, buyuk hareket beklentisi) | %40-50 kazanma, 2:1 R/R |
| **Neutral (40-60)** | >%50 | Denge + yuksek prim | **Standard IC** (optimal ortam) | **%70-75 kazanma** |
| **Neutral** | <%40 | Denge + dusuk prim | **Dar IC** veya **No trade** | %60-65 kazanma, dusuk prim |
| **Extreme Greed (>75)** | >%50 | Hirs + yuksek prim | **Dar IC** (call tarafi cok uzak) | %55-65 kazanma |
| **Extreme Greed** | <%40 | Hirs + dusuk prim | **No trade** veya **Long Straddle** (sadece guclu katalist) | %35-45 kazanma |

#### B.3.2. "Perfect Setup" — Optimal Sentiment + IV Kombinasyonu

En iyi earnings IC setup'u su kosullarda olusur:

1. **F&G Index 40-60 (Neutral)** = Hisse "kendi hikayesini" anlatir
2. **AAII Spread -5% ile +5%** = Bireysel yatirimci dengeli
3. **IV Rank >%50** = Yuksek prim, VRP firsati
4. **VIX < 30** = Makro ortam istikrarli
5. **Put/Call Ratio 0.8-1.0** = Opsiyon piyasasi dengeli

**Bu 5 kosul bir aradayken Iron Condor kazanma orani: %72-78** (FlashAlpha/SpotGamma composite analizi).

#### B.3.3. "Danger Zone" — Kacinilmasi Gereken Kombinasyon

En kotu earnings IC setup'u su kosullarda olusur:

1. **F&G Index > 75 (Extreme Greed)** = Asiri beklenti
2. **AAII Spread > +20%** = Herkes bullish
3. **IV Rank <%30** = Dusuk prim, dusuk VRP
4. **VIX > 35** = Makro ortam karmasik
5. **Put/Call Ratio < 0.7** = Asiri call alimi, hava balonu

**Bu 5 kosuldan 3+ bir aradaysa: Earnings IC acma.** Kazanma orani %50'nin altina duser.

---

### B.4. Post-Earnings Drift + Sentiment Kombinasyonu

PEAD (Post-Earnings Announcement Drift) ve sentiment kombinasyonu, earnings sonrasi hisse drift'inin siddetini tahmin eder.

#### B.4.1. PEAD + Sentiment Etkilesimi

| SUE Skoru | F&G Index | Drift Siddeti | Strateji | Beklenen Getiri (60 gun) |
|:---|:---|:---|:---|:---|
| **> +2 (Guclu Beat)** | < 25 (Extreme Fear) | **"Kapana kisilmis ayi" squeeze** — En sert drift | Ertesi gun long, 60 gun tut | **%12-18** |
| > +2 | 40-60 (Neutral) | **Standard pozitif drift** | Ertesi gun long, 60 gun tut | **%6-10** |
| > +2 | > 75 (Extreme Greed) | **"Satin alinmis ralli"** — Zayif drift (zaten yuksek fiyat) | Kisa tut (20 gun) veya atla | **%2-4** |
| **< -2 (Guclu Miss)** | < 25 (Extreme Fear) | **"Dusen bicagi yakalama"** — Zaten dusuk, daha fazla duser | Short veya atla | **-%5-10** (short ile) |
| < -2 | 40-60 (Neutral) | **Standard negatif drift** | Ertesi gun short (put), 60 gun tut | **-%6-10** |
| < -2 | > 75 (Extreme Greed) | **"Imparatorlugun cokusu"** — En sert negatif drift | Agresif short, 60 gun tut | **-%10-15** |

**Kritik Bulgu:** SUE > +2 (guclu beat) + F&G < 25 (Extreme Fear) kombinasyonu, **en guclu PEAD sinyalidir.** "Kapana kisilmis ayi" (trapped bears) squeeze'i ile hisse 60 gunde %12-18 yukselir. Bu, 2009 Mart, 2020 Mart ve 2022 Ekim donemlerinde gozlemlenmistir.

#### B.4.2. PEAD + Sentiment Ticaret Kurallari

| SUE | F&G | Giris | Cikis | Stop-Loss | Pozisyon Buyuklugu |
|:---|:---|:---|:---|:---|:---|
| > +2 | < 25 | Ertesi gun acilis | 60 gun veya %15 kar | %8 | Hesabin %5 |
| > +2 | 40-60 | Ertesi gun acilis | 60 gun veya %10 kar | %8 | Hesabin %3-5 |
| > +2 | > 75 | Ertesi gun acilis | 20 gun veya %5 kar | %6 | Hesabin %2-3 |
| < -2 | 40-60 | Ertesi gun acilis (put) | 60 gun veya %10 kar | %8 | Hesabin %3 |
| < -2 | > 75 | Ertesi gun acilis (put) | 60 gun veya %12 kar | %6 | Hesabin %3-5 |

---

### B.5. Earnings Oncesi Put/Call Skew Analizi

Earnings oncesi put/call skew'i, piyasanin earnings beklentisinin yonunu ve siddetini gosterir.

#### B.5.1. Skew Tipleri ve Earnings Yorumu

| Skew Durumu | Put IV vs Call IV | Earnings Yorumu | Strateji Etkisi |
|:---|:---|:---|:---|
| **Asiri Pozitif Skew** | Put IV >> Call IV | Piyasa **sert dusus** bekliyor | IC: Put tarafini cok uzak tut; Long Straddle dusun |
| **Pozitif Skew** | Put IV > Call IV | Hafif asagi beklenti | IC: Put tarafini normalden uzak tut |
| **Notr Skew** | Put IV ≈ Call IV | **Dengeli beklenti — Optimal IC** | Standard IC |
| **Negatif Skew** | Call IV > Put IV | Yukari beklenti (genellikle) | IC: Call tarafini normalden uzak tut |
| **Asiri Negatif Skew** | Call IV >> Put IV | **"Lotto ticket" call alimi** — balon riski | IC: Call tarafini cok uzak tut; dar IC |

#### B.5.2. Skew Degisiminin Earnings Tahmini

| Skew Degisimi | Anlami | Earnings Tepki Beklentisi |
|:---|:---|:---|
| 1 hafta icinde skew "pozitiften notre" dondu | Asagi beklenti azaldi | Daha "muted" tepki — IC icin iyi |
| 1 hafta icinde skew "notrden pozitife" dondu | Korunma talebi artti | Asagi yonlu sert hareket olabilir |
| Asiri negatif skew + F&G > 75 | "Lotto ticket" call alimi zirvede | **"Buy the rumor, sell the news"** riski yuksek |
| Asiri pozitif skew + F&G < 25 | Herkes put aliyor (hedge) | **"Pessimism extreme" = contrarian alis** |

#### B.5.3. Earnings Skew + UOA Kombinasyonu

| Skew | UOA Hacim/OI | Kombinasyon Yorumu | Strateji |
|:---|:---|:---|:---|
| Pozitif skew + Put OI artisi | Hacim/OI > 3x | Kurumsal asagi hedge | IC put tarafi cok uzak veya no trade |
| Negatif skew + Call OI artisi | Hacim/OI > 3x | Kurumsal yukari beklenti | IC call tarafi uzak |
| Notr skew + Hacim/OI > 3x (tek yon) | Tek yonlu kurumsal akis | **UOA yonunde Long Straddle** dusun |
| Notr skew + Hacim/OI < 2x | Zayif kurumsal ilgi | Standard IC — en temiz setup |

#### B.5.4. Composite Fear Index + Earnings Entegrasyonu

Birden fazla sentiment gostergesini birlestiren Composite Fear Index, earnings stratejisinde daha guclu sinyaller uretir:

**Composite Fear Index Bilesenleri:**

| Gosterge | Agirlik | Normalizasyon |
|:---|:---|:---|
| VIX | %25 | 0-100 skalaya (Z-score) |
| Put/Call Ratio | %20 | 0-100 skalaya (Percentil) |
| AAII Bull-Bear Spread | %20 | -100 ile +100 arasi |
| F&G Index | %20 | Hazir 0-100 |
| NAAIM Exposure | %15 | 0-200 arasi normalize |

**Earnings Stratejisi Icin Composite Skor Kullanimi:**

| Composite Skor | Earnings Stratejisi | Kazanma Olasiligi |
|:---|:---|:---|
| **0-20 (Extreme Fear)** | Long Straddle (guclu hisseler) veya Wider IC | %45-55 (Straddle) / %60-68 (IC) |
| **20-35 (Fear)** | Wider IC | %65-72 |
| **35-50 (Notr-Dusuk)** | Standard IC | **%70-75** |
| **50-65 (Notr-Yuksek)** | Standard IC | %68-72 |
| **65-80 (Greed)** | Dar IC | %60-68 |
| **80-100 (Extreme Greed)** | Cok dar IC veya no trade | %50-58 |

**Formul:** Composite Fear Index = (VIX_ZScore * 0.25) + (PC_Percentil * 0.20) + (AAII_Normalized * 0.20) + (F&G * 0.20) + (NAAIM_Normalized * 0.15)

---

### B.6. Sentiment + Earnings Gunluk Checklist

1. [ ] **F&G Index:** 40-60 araliginda mi? (En iyi IC ortami)
2. [ ] **AAII Spread:** +20% uzeri degil mi? (Asiri iyimserlik = dikkat)
3. [ ] **Put/Call Ratio:** 0.8-1.2 araliginda mi? (Dengeli)
4. [ ] **Skew Analizi:** Asiri pozitif/negatif degil mi? (Notr = en iyi)
5. [ ] **NAAIM Exposure:** < 100 mu? (Kaldicli pozisyon yok)
6. [ ] **Composite Skor:** 35-65 araliginda mi? (Earnings IC "sweet spot")
7. [ ] **UOA:** Hisse bazli anormal akis var mi? (Varsa yonu not et)


---

## [YENI v3.0] Bolum C: Senaryo Bazli Earnings Stratejisi

Piyasa krizleri (2008, 2020, 2022, 2025) ve farkli piyasa rejimlerinde (bull, correction, bear, crash) earnings stratejilerinin adapte edilmesi kritiktir. Bu bolum, kriz donemlerindeki earnings davranislarini, rejim bazli strateji sablonlarini ve earnings takvimi risk yonetimini detaylandirir.

---

### C.1. Kriz Donemlerinde Earnings Stratejileri (2008 / 2020 / 2022 / 2025)

#### C.1.1. Kriz Donemleri Earnings Davranis Karsilastirmasi

| Metrik | 2008 GFC | 2020 COVID | 2022 Ayi | 2025 Tarife |
|:---|:---|:---|:---|:---|
| **VIX Zirve** | 80.86 | **82.69** | 35 | 52.33 |
| **Earnings Donemi** | Q4 2008, Q1-Q2 2009 | Q1-Q2 2020 | Q1-Q4 2022 | Q2 2025 |
| **IV Crush Buyuklugu** | %20-30 (daha dusuk, cunku IV zaten yuksek) | %25-35 | %30-45 | %25-40 |
| **IC Kazanma Orani** | %35-45 (en dusuk) | %40-50 | %55-65 | %50-60 |
| **Long Straddle Kazanma** | %40-50 (yuksek vol = buyuk hareketler) | %45-55 | %35-45 | %40-50 |
| **Sektorel Fark** | Finans sifirlandi | Tech +%70 rally | Energy tek pozitif | Staples savunmaci |
| **Kriz Tipi** | Yapısal/Yavas | Harici/Sok | Makroekonomik/Yavas | Politik/Sok |

#### C.1.2. 2008 GFC Earnings Dersleri

2008'de earnings stratejileri icin kritik ogrenmeler:

| Bulgu | Strateji Etkisi | Uygulama |
|:---|:---|:---|
| VIX 80'e cikinca IV crush hala oldu ama hisse "diger nedenlerle" hareket etti | IC zarar ettirici — **tail risk felaket** | VIX > 45'te **earnings IC acma** |
| Finans sektoru earnings'leri "anlamsiz" hale geldi (Lehman, AIG) | **Sektor spesifik kacis** | Finans earnings'lerinden uzak dur |
| "Dip hisseleri" (%90 dusenler) earnings'te +%50-100 ralli yapti | **Long Straddle dip hisselerinde karli** | Sadece guclu bilanco olan dip hisseleri |
| 60/40 portfoyu -%24 ila -%30 kaybetti | Earnings tek basina kurtarmadi | **Makro>Micro** — once makro, sonra earnings |

**2008 Earnings Playbook:**
- VIX > 40: Earnings IC **yasak**
- VIX 25-40: Sadece **dar IC**, defensive sektorler (Staples, Utilities), %50 position size
- Long Straddle: Sadece **dip hisselerinde** guclu katalist ile (ornegin: AAPL yeni urun)
- PEAD: **Cok guclu** — SUE > +2 hisseleri 60 gunde %12-18 rally (korku zirvedeydi)

#### C.1.3. 2020 COVID Earnings Dersleri

2020'deki hizli cokus ve hizli recovery, earnings stratejilerini degistirdi:

| Bulgu | Strateji Etkisi | Uygulama |
|:---|:---|:---|
| 33 gunde bear market → 5 ayda recovery | **Hizli cokus = hizli earnings firsati** | VIX spike sonrasi 30 gun icinde IC ac |
| VIX 82'den 30 gun icinde %70 duser | **VIX crush + earnings IV crush = cift kazanc** | Nisan earnings sezonu sonunda agresif IC |
| Tech earnings (AAPL, AMZN, MSFT) "kazandi" cunku WFH | **Sektor spesifik liderlik** | Tech earnings IC'ye odaklan |
| Momentum stratejileri Nisan 2020'de -%28.2 coktu | **Momentum <> Earnings ayrimi** | Momentum crash'te earnings IC ayri calisir |

**2020 Earnings Playbook:**
- VIX spike sonrasi **30 gun icinde** earnings IC firsati (VIX crush devreye girer)
- Tech earnings (AAPL, MSFT, AMZN) IC: **%70+ kazanma orani**
- VIX 60+ oldugunda Long Straddle (sadece likit hisselerde)
- PEAD: SUE > +2 Tech hisseleri 60 gunde **%15-25 rally** (recovery momentum)

#### C.1.4. 2022 Ayi Piyasasi Earnings Dersleri

2022'nin "yavas yanki" (slow burn) karakteri, earnings stratejilerini farkli etkiledi:

| Bulgu | Strateji Etkisi | Uygulama |
|:---|:---|:---|
| VIX zirve 35 (2008/2020'deki 80'e gore dusuk) | **"Siniri" kriz** — IC hala calisir | VIX 25-35'te reduced size IC |
| "Vol of vol" cok yuksek — surekli kucuk VIX sicramalari | **Frequent whipsaw** | Dar IC, dar stop-loss |
| Value vs Growth ayrimi belirleyici oldu | **Sektor earnings IC'si farkli calisir** | Value earnings IC > Growth earnings IC |
| 60/40 portfoyu 150 yilin en kotusu | **Earnings hedge'siz yetmez** | VIX call spread hedge sart |

**2022 Earnings Playbook:**
- VIX 20-30: **Dar IC**, Value sektor (JPM, XOM, CVX), %75 position size
- VIX 30-35: **Cok dar IC**, sadece defensive (WMT, PG, KO)
- Growth earnings (TSLA, NVDA): Long Straddle dusun (hala volatil)
- PEAD: SUE > +2 Value hisseleri 60 gunde **%8-12 rally**

#### C.1.5. 2025 Tarife Krizi Earnings Dersleri

2025'in politik krizi, earnings stratejilerini yeni bir sekilde test etti:

| Bulgu | Strateji Etkisi | Uygulama |
|:---|:---|:---|
| 2 gunde $6.6 trilyon silindi | **Hizli sok = hizli VIX crush firsati** | VIX zirve sonrasi 30 gun icinde IC |
| Tech sektoru (Apple -%9.4, Dell -%19) en cok etkilendi | **Tedarik zinciri riski** | Tech earnings IC'den kac (tarife doneminde) |
| Consumer Staples tek savunmaci sektor | **Defensive earnings IC = guvenli liman** | WMT, PG, KO earnings IC odaklan |
| VIX 52'den <20'ye 100 gunden kisa surede dustu | **Hizli VIX crush = cift kazancli earnings IC** | Q2 2025 earnings sezonu sonunda agresif IC |

**2025 Earnings Playbook:**
- Tarife doneminde Tech earnings IC'den **kac** (tedarik zinciri belirsizligi)
- Defensive earnings IC (Staples, Utilities): **%65-72 kazanma orani**
- VIX 45+ oldugunda: Long Straddle (sadece tarifeden etkilenmeyen hisseler)
- PEAD: SUE > +2 Staples hisseleri **%6-10 rally** (safe haven premium)

---

### C.2. Bear Market Earnings Playbook: Dar Iron Condor, Protective Puts

Bear market'te (S&P 500 < 200MA, VIX > 25) earnings stratejileri degisir:

#### C.2.1. Bear Market Earnings Stratejileri

| Strateji | Bear Market Ozellestirmesi | Kazanma Olasiligi | Risk |
|:---|:---|:---|:---|
| **Dar Iron Condor** | Wing width normalin **%40 daha dar** | %55-65 | Yuksek whipsaw riski |
| **Put Credit Spread** | Asagi yonlu IC yerine put spread | %60-70 | Tek yonlu risk |
| **Long Put (Protective)** | Earnings portfoyune %2-3 hedge | — | Sigorta maliyeti |
| **Long Straddle** | Sadece "guvenli liman" hisselerinde | %40-50 | Yuksek theta maliyeti |
| **No Trade** | VIX > 35 ise | — | Firsat maliyeti |

#### C.2.2. Bear Market Earnings IC Parametreleri

| Parametre | Bull Market | Bear Market | Degisim |
|:---|:---|:---|:---|
| **IV Rank esigi** | >%50 | >%40 (daha dusuk, cunku her sey yuksek IV) | Daha esnek |
| **VIX limiti** | < 35 | < 45 (daha yuksek tolerans) | Daha esnek |
| **Wing width** | Hisse/10 | Hisse/10 * 0.6 (daha dar) | %40 daralma |
| **Position size** | %100 | %50 | %50 azalma |
| **DTE giris** | 30-45 | 21-30 (daha kisa) | Daha dar pencere |
| **Kar hedefi** | %50 | %30 (daha erken cik) | Daha dusuk |
| **Stop-loss** | 2x kredi | 1.5x kredi | Daha siki |

#### C.2.3. Bear Market Sektorel Earnings Stratejisi

| Sektory Tip | Ornekler | Bear Market Earnings Stratejisi |
|:---|:---|:---|
| **Defensive** | WMT, PG, KO, XLU | **Standard IC** — en givenilir earnings IC ortami |
| **Value** | JPM, BAC, XOM, CVX | **Dar IC** — volatil ama kazanma olasiligi yuksek |
| **Growth** | TSLA, NVDA, NFLX | **Long Straddle** — hala volatil, yukari potansiyel |
| **Tech (tarife riski)** | AAPL, AMZN, MSFT | **Kacin** veya cok dar IC — tedarik belirsizligi |
| **Finans (kriz)** | GS, MS, C | **Kacin** — earnings "anlamsiz" hale gelebilir |

---

### C.3. Crash Doneminde: Earnings Trade Durdurma Kurallari

Crash donemi (VIX > 35, S&P 500 < 200MA, % hisse > 50MA < 20%) earnings trade icin en tehlikeli donemdir.

#### C.3.1. Crash Modu Tetikleyicileri

| Tetikleyici | Esik | Aksiyon |
|:---|:---|:---|
| **VIX > 35** (5 gun ust uste) | Crash modu baslangici | Earnings IC'lerin %50'sini kapat |
| **VIX > 45** | Tam crash | **Tum earnings IC'leri kapat** |
| **S&P 500 < 200MA + HY>500bps** | Sistemik risk | Earnings trade **yasak** |
| **% hisse > 50MA < 20%** | Capitulation | Sadece Long Straddle (likit hisseler) |
| **PCR > 1.5** | Asiri korku | PEAD firsati (SUE > +2) icin hazirlan |

#### C.3.2. Crash Donemi 5 Fazli Rehber

| Faz | VIX Araligi | Earnings Stratejisi | Pozisyon |
|:---|:---|:---|:---|
| **Faz 1: Erken Uyari** | 20-25 | Pozisyon %25-50 azalt, wider wings | Reduced size IC |
| **Faz 2: Kriz Baslangici** | 25-35 | Earnings IC %50 azalt, VIX hedge aktif | Dar IC + hedge |
| **Faz 3: Tam Cokus** | 35-60 | **Earnings IC tamamen durdur** | Sadece Long Straddle (likit) |
| **Faz 4: Dip Yaklasimi** | Zirve yapti, PCR > 1.5 | PEAD icin hazirlan (SUE > +2 listesi) | Nakit biriktir |
| **Faz 5: Ilk Recovery** | 40'tan dusuyor | **Agresif IC acilis** — VIX crush + earnings IV crush | Full size IC |

#### C.3.3. Crash Donemi "Hayatta Kalma" Kurallari

1. **VIX > 45 = Earnings IC yasak** — hisse "kendi hikayesinden" cok makro ile hareket eder
2. **Long Straddle sadece "guvenli liman" hisselerinde** (WMT, PG, KO) — hala likidite var
3. **VIX hedge (call ratio backspread) earnings portfoyunu korur** — maliyeti kabul et
4. **Faz 4'te (dip) SUE > +2 hisselerini listele** — PEAD icin hazirlan
5. **Faz 5'te (recovery) agresif donus** — ilk 30 gun IC kazanma orani %75+

---

### C.4. Recovery Doneminde: Aggressive Long Straddle, Directional Plays

Recovery donemi (VIX < 30'dan dusuyor, S&P 500 50MA uzerinde), earnings stratejileri icin en karli donemdir.

#### C.4.1. Recovery Earnings Stratejileri

| Strateji | Recovery Donemi Ozelligi | Kazanma Olasiligi | Beklenen Getiri |
|:---|:---|:---|:---|
| **Agresif Iron Condor** | VIX crush + earnings IV crush = cift kazanc | **%75-85** | %5-10 (30-45 gun) |
| **Long Straddle (dip hisseler)** | En cok dusenler en cok kazanir | %45-55 | %15-25 (5-10 gun) |
| **PEAD (SUE > +2)** | "Kapana kisilmis ayi" squeeze | %65-75 | %12-18 (60 gun) |
| **VIX Crush Trade** | VIX >40'tan short VIX | %80+ | VIX'e bagli |

#### C.4.2. Recovery Giris Sinyalleri (Earnings Stratejisi Icin)

| Sinyal | Esik | Onem | Earnings Aksiyonu |
|:---|:---|:---|:---|
| VIX dusus egiliminde | VIX < 30 ve 10MA altinda | **Kritik** | Agresif IC acmaya basla |
| S&P 500 50MA uzerinde | Gunluk kapanis > 50MA | **Kritik** | Full size IC |
| PCR normallesmis | < 1.0 | Onay | IC genislet |
| Credit spreadler daraliyor | HY < 500 bps | Onay | Sektorel IC ac |
| Breadth iyilesiyor | % hisse > 50MA artiyor | Onay | Birden fazla hisse IC |
| Volume onayli | Yukselis gunleri hacimli | Teyit | Pozisyon artir |

**Minimum Gereksinim:** En az 3/6 sinyal. **Tam giris:** 5+/6 sinyal.

#### C.4.3. Recovery'de "Sektorel Liderlik Degisimi"

Her kriz sonrasi yeni bir sektorel liderlik dongusu baslar. Recovery earnings stratejisi icin:

| Kriz | Kriz Sirasinda Lider | Recovery'de Yeni Lider | Earnings Odagi |
|:---|:---|:---|:---|
| 2000-2002 Dot-com | Utilities, Staples | Tech (yeni nesil), Financials | Yeni Tech earnings IC |
| 2008 GFC | Staples, Utilities, Gold | Tech (FAANG), Financials (dip) | FAANG earnings IC |
| 2020 COVID | Tech (WFH), Staples | Tech (buyumeye devam), Energy | Big Tech earnings IC |
| 2022 Ayi | Energy, Value | Tech (AI), Comm Services | AI/Tech earnings IC |
| 2025 Tarife | Staples, Health Care | Tech (tedarik adaptasyonu), AI | Adaptasyon Tech IC |

**Kural:** Recovery'de krizde en cok dusen sektorlerin earnings'lerine odaklan — "dead cat bounce" degil, fundamental toparlanma.

---

### C.5. Earnings Calendar Risk Management: Major Macro Events Overlap

Earnings takvimi ile buyuk makro olaylarin cakismasi, stratejiyi etkiler.

#### C.5.1. Makro-Earnings Cakisma Risk Matrisi

| Makro Olay | Earnings Cakismasi | Risk Seviyesi | Strateji |
|:---|:---|:---|:---|
| **FOMC (Faiz karari)** | Ayni gun earnings | **Cok Yuksek** | Earnings IC acma — cift volatilite |
| **CPI verisi** | Ayni gun earnings | **Cok Yuksek** | Earnings IC acma — makro hisseyi ezer |
| **NFP (Istihdam)** | Ayni gun earnings | **Yuksek** | Dikkatli — hisse IC yerine endeks IC |
| **GDP verisi** | Ayni gun earnings | Yuksek | Dikkatli — wing width'i %30 genislet |
| **Tarife ilani** | Ayni hafta earnings | **Cok Yuksek** | Tech earnings IC acma |
| **Tahvil acik artirmasi** | Ayni gun earnings | Yuksek | Finans earnings IC'den kac |
| **OPEC toplantisi** | Ayni gun earnings | Yuksek | Energy earnings IC'den kac |

#### C.5.2. Earnings Sezonu Takvimi Risk Profili

| Donem | Tipik Risk | Strateji |
|:---|:---|:---|
| **Earnings sezonu basi** (2. hafta) | Yuksek volatilite, "beklenti" sisirir | Genis IC, dusuk position size |
| **Earnings sezonu ortasi** (4-5. hafta) | **Optimal ortam** — volatilite "gercekci" | Standard IC, normal position size |
| **Earnings sezonu sonu** (son 1-2 gun) | **VIX crush firsati** — ikili crush | Agresif IC (endeks + hisse) |
| **Sezon sonrasi 1. hafta** | VIX crush devam, "bosluk" | Endeks IC (SPY/SPX) odaklan |

#### C.5.3. Earnings Takvimi + Makro Calendar Birlestirme

Her gunun plani:

1. **Makro takvimi kontrol et** (FOMC, CPI, NFP, GDP)
2. **Ayni gun makro olayi olan hisselerin earnings'lerinden KAC**
3. **Makro olaydan 1 gun once ve sonra earnings IC acma** (vol sismesi)
4. **Earnings sezonu son haftasinda** "ikili crush" icin agresif ol

---

### C.6. Adaptive Earnings Sizing by Regime (Rejim Bazli Earnings Boyutlandirma)

Piyasa rejimine gore earnings stratejisi parametrelerinin tam ozeti:

#### C.6.1. Rejim Bazli Earnings Stratejisi Tablosu

| Parametre | Bull Market | Correction | Bear Market | Crash |
|:---|:---|:---|:---|:---|
| **Tanim** | S&P > 200MA, VIX < 20 | S&P 200MA civari, VIX 20-25 | S&P < 200MA, VIX 25-35 | S&P <%20, VIX > 35 |
| **Ana Strateji** | Standard IC | Wider IC | Dar IC + Hedge | No IC / Long Straddle |
| **Wing Width** | Hisse/10 | Hisse/10 * 1.2 | Hisse/10 * 0.6 | — |
| **Position Size** | %100 | %75 | %50 | %25 (sadece Straddle) |
| **DTE Giris** | 30-45 | 25-35 | 21-30 | 5-10 (Straddle) |
| **Kar Hedefi** | %50 | %40 | %30 | %20 (Straddle) |
| **Stop-Loss** | 2x kredi | 1.8x kredi | 1.5x kredi | %10 (Straddle) |
| **VIX Hedge** | Opsiyonel | Tavsiye edilir | **Sart** | **Maksimum** |
| **Cash Orani** | %5-10 | %15-25 | %30-50 | %50-80 |
| **En Iyi Sektory** | Tech, Growth | Diverse | Staples, Utilities | Defensive |
| **Kazanma Olasiligi (IC)** | **%70-75** | **%65-70** | **%55-65** | **%35-45** |

#### C.6.2. Rejim Gecis Tepkileri

| Gecis | Tanim | Earnings Stratejisi |
|:---|:---|:---|
| **Bull -> Correction** | S&P 200MA'ya dokunuyor | Position size %25 azalt, wider wings |
| **Correction -> Bear** | Death Cross (50MA < 200MA) | Position size %50 azalt, dar IC, hedge aktif |
| **Bear -> Crash** | VIX > 35 (5 gun) | Earnings IC durdur, Long Straddle degerlendir |
| **Crash -> Bear** | VIX zirve yapti, dusuyor | Dar IC ile test, %25 position size |
| **Bear -> Correction** | Golden Cross sinyali | Position size %50'ye cikar, standard IC |
| **Correction -> Bull** | S&P 50MA > 200MA | Full size, standard IC, agresif |

#### C.6.3. Kriz Tipleri ve Earnings Stratejisi Eslesmesi

| Kriz Tipi | Ornek | En Iyi Earnings Stratejisi | En Kotu Earnings Stratejisi |
|:---|:---|:---|:---|
| **Yapısal/Yavas (2008)** | Finansal sistem cokusu | Dar IC (Staples) + PEAD | Full size IC (Finans) |
| **Harici/Sok (2020)** | Pandemi | Wider IC (Tech) + VIX crush trade | IC acmamak (firsati kacir) |
| **Makroekonomik/Yavas (2022)** | Enflasyon/Faiz | Dar IC (Value) + Long Straddle (Growth) | Dar IC (Growth) |
| **Politik/Sok (2025)** | Tarifeler | Dar IC (Staples) + PEAD | IC (Tech/Tarife riski) |

---

### C.7. Senaryo Bazli Earnings — Checklist

1. [ ] **Piyasa rejimi:** Bull / Correction / Bear / Crash — hangisi?
2. [ ] **VIX seviyesi:** Hangi fazda? (Faz 1-5)
3. [ ] **Kriz tipi:** Yapısal / Harici / Makro / Politik — hangisi?
4. [ ] **Sektorel risk:** Hisse, kriz tipinden etkileniyor mu?
5. [ ] **Makro cakisma:** Earnings gunu FOMC/CPI/NFP var mi?
6. [ ] **Position size:** Rejime gore ayarlandi mi?
7. [ ] **Wing width:** Volatiliteye gore genisletildi/daraltildi mi?
8. [ ] **Hedge:** VIX call spread aktif mi?
9. [ ] **Cikis plani:** VIX ani yukselirse / makro sok olursa plan hazir mi?
10. [ ] **Recovery hazirligi:** Dip sinyalleri (PCR > 1.5, VIX zirve) izleniyor mu?


---

## Kaynakca

1. SpotGamma — Iron Condor Strategy Guide (support.spotgamma.com)
2. SpotGamma — "5 Stocks with Most Predictable IV Crush" (spotgamma.com)
3. SpotGamma — Delta Threshold ve ADAPT Sistem (support.spotgamma.com)
4. ApexVol — Iron Condor Win Rate & Setup Guide (apexvol.com/strategies/iron-condor)
5. DaysToExpiry — Iron Condor Complete 2026 Guide (daystoexpiry.com/blog/iron-condor-strategy)
6. ReachMarkets — Iron Condor Backtesting Results Part 2 (reachmarkets.com.au/news/iron-condor-backtesting-results-parts-2/)
7. OptionTradingIQ — Optimal Wing Width (optionstradingiq.com/iron-condor-wing-width/)
8. Tastytrade Research Archive — 12 Yillik Wing Width Backtest (tastytrade.com)
9. Option Alpha — Long Straddle Earnings Backtest (optionalpha.com/podcast/long-straddle-earnings-option-strategy)
10. Option Samurai — Earnings Iron Condor (optionsamurai.com/blog/iron-condor-earnings/)
11. Option Samurai — Long Straddle Entry Kriterleri (optionsamurai.com)
12. CBOE — State of Options Industry 2025 (cboe.com/insights/posts/the-state-of-the-options-industry-2025/)
13. CBOE — Henry Schwartz Zero-Day SPX Iron Condor (cboe.com/insights/posts/henry-schwartzs-zero-day-spx-iron-condor-strategy-a-deep-dive/)
14. FlashAlpha — IV Crush Explained (flashalpha.com/articles/iv-crush-explained-earnings-volatility-collapse)
15. MarketChameleon — AAPL Earnings IV Data (marketchameleon.com)
16. MarketChameleon — NVDA Implied vs Actual Move (marketchameleon.com)
17. MarketChameleon — SPY Skew Analysis (marketchameleon.com)
18. FatTail.ai — 0DTE Iron Condor Analysis (fattail.ai)
19. TradingBlock — 0DTE Options Strategies (tradingblock.com)
20. TradeAlgo — 0DTE Iron Condor Guide (tradealgo.com)
21. UCLA Anderson Review — PEAD Study 2026 (anderson-review.ucla.edu)
22. Filippou, Garcia-Ares, Zapatero — "No Max Pain, No Max Gain" (SSRN, 1996-2021)
23. AdvancedAutoTrades — Max Pain Study (advancedautotrades.com/does-max-pain-really-work/)
24. CheddarFlow Review — AI Power Alerts (quantvps.com/blog/cheddarflow-review)
25. TradeAlgo — Unusual Options Activity Scanner (tradealgo.com)
26. JournalPlus — Gamma Scalping Strategy (journalplus.co)
27. XBTfx — Most Volatile Stocks (xbtfx.com/blog/most-volatile-stocks/)
28. Orats — Volatility Around Earnings (orats.com/university/volatility-around-earnings)
29. CBOE — VIX Index Historical Data (cboe.com/us/indices/vix/)
30. Investopedia — Risk Management Techniques (investopedia.com)
31. moomoo — Earnings Volatility: NVDA Options (moomoo.com)
32. Interactive Brokers — AAPL Post-Earnings IV Trends (interactivebrokers.com)

### [YENI v3.0] Kaynaklar — VIX + Earnings Kombinasyon Modulu

33. CBOE — VIX White Paper ve Hesaplama Metodolojisi (cboe.com/tradable-products/vix/)
34. NBER Working Paper 24575 — VIX Mean Reversion Analysis (nber.org)
35. Tastylive — "S&P 500 Drops as VIX Hits Panic Levels" (tastylive.com/news-insights/sp500-drops-vix-hits-panic-levels)
36. VOLATAUR — VIX Futures Curve Analysis (patreon.com/posts/understanding-to-112764773)
37. Macroption — VIX Futures Term Structure (macroption.com/vix-futures-curve/)
38. CBOE — "Is VIX Backwardation Necessarily a Sign of a Future Down Market?" (cboe.com/insights)
39. Schwab — Trading VIX Strategies (schwab.com/learn/story/trading-vix-strategies-fear-index)
40. Option Alpha — VIX Portfolio Hedging Strategy (optionalpha.com/podcast/option-strategy-performance)
41. Stanford University — Tail Risk Hedging with VIX Calls (web.stanford.edu/class/msande448/2021/Final_reports/gr7.pdf)
42. CBOE VXTH Index Methodology — VIX Tail Hedge (cdn.cboe.com/api/global/us_indices/governance/)
43. SlashTraders — VIX Hedging Strategy (slashtraders.com/en/blog/vix-hedging-strategy/)
44. TradeSearcher.ai — VIX/VVIX Combo Z-Score Strategy (tradesearcher.ai/strategies/2309-strategy-combo-z-score)
45. StatOasis — Z-Score Mean Reversion Strategies (statoasis.com/post/understanding-z-score-and-its-application-in-mean-reversion-strategies)
46. CBOE — VIX Term Structure Data (cboe.com/tradable-products/vix/term-structure/)
47. Volatility Trading Strategies — Cash VIX Term Structure (volatilitytradingstrategies.com/blog/awesome-stock-market-indicator-cash-vix-term-structure)
48. Marquette Associates — Volatility Risk Premium Strategies (marquetteassociates.com)
49. The Hedge Fund Journal — VRP Harvesting (thehedgefundjournal.com/harvesting-the-s-p500-volatility-risk-premium/)
50. S&P Global — VIX Index Research (spglobal.com/spdji/en/documents/research/)
51. Weltrade — VIX Futures Trading (weltrade.com/blog/volatility-index-futures-sp-500/)
52. NYU Stern / Manda — "Stock Market Volatility during the 2008 Financial Crisis" (NYU Stern Glucksman Institute)

### [YENI v3.0] Kaynaklar — Sentiment + Earnings Modulu

53. CNN Fear & Greed Index (edition.cnn.com/markets/fear-and-greed)
54. Code Meets Capital — Backtesting Fear & Greed Index (codemeetscapital.substack.com/p/backtesting-fear-and-greed-index)
55. Quantified Strategies — Fear and Greed Trading Strategy (quantifiedstrategies.com/fear-and-greed-trading-strategy/)
56. Supertype.ai — Fear & Greed Index Part 1 (supertype.ai/notes/fear-greed-index-part1)
57. TradingView — F&G Strategy Script (tradingview.com/script/SKEvwrNo/)
58. Level Up — Backtesting F&G with SPY (levelup.gitconnected.com/backtesting-fear-greed-index-with-spy-prices-77cba92d60be)
59. AAII Sentiment Survey (aaii.com/sentimentsurvey/sent_results)
60. YCharts — AAII Bull-Bear Spread (ycharts.com/indicators/us_investor_sentiment_bull_bear_spread)
61. Investors Intelligence Advisors Sentiment (ii.ecube.co.uk/x/advisors_sentiment_report.html)
62. NAAIM Exposure Index (portfoliooptimizer.io/blog/the-naaim-exposure-index/)
63. Macromicro — US AAII Sentiment (en.macromicro.me/charts/20828/us-aaii-sentimentsurvey)
64. CBOE — Put/Call Ratio Data (cboe.com)
65. Wall Street Courier — CBOE Put/Call Ratio Analysis (wallstreetcourier.com/spotlights/the-cboe-put-call-ratio/)
66. Beacon Investing — Sector Rotation (beaconinvesting.com/the-power-of-sector-rotation/)
67. Investopedia — Warren Buffett Contrarian (investopedia.com/articles/investing/012116/warren-buffett-be-fearful-when-others-are-greedy.asp)
68. Behavioral Finance and Investor Psychology (abacademies.org/articles/behavioral-finance-and-investor-psychology-examining-the-role-of-cognitive-biases-in-stock-market-fluctuations-17638.html)
69. Macro Ops — Mastering Mean Reversion (macro-ops.com/mastering-mean-reversion/)
70. SqueezeMetrics — DIX Dark Index (squeezemetrics.com/monitor/dix)
71. Quantified Strategies — Hidden Markov Model Market Regimes (quantifiedstrategies.com/hidden-markov-model-market-regimes/)
72. Robot Wealth — Dual Momentum Review (robotwealth.com/dual-momentum-review/)

### [YENI v3.0] Kaynaklar — Senaryo Bazli Earnings Stratejisi

73. SIFMA Research — "The VIX's Wild Ride" (2020)
74. S&P Global — "US Equities Market Attributes" (2026)
75. CFA Institute — "Performance of the 60/40 Portfolio" (2023)
76. Invesco — "Looking for Signs of a Bottom in Stocks" (2020)
77. St. Louis Fed — "Financial Market Volatility in Spring 2025" (2025)
78. Morningstar — "The 60/40 Portfolio: A 150-Year Stress Test" (2026)
79. Alpha Architect — Managed Futures Crisis Alpha (2025)
80. Stanford University — "Tail Risk Hedging with VIX Calls" (2021)
81. WisdomTree — "Don't Minimize the Importance of the VIX Spike" (2026)
82. BlackRock — "Rebuilding 60/40 Portfolios with Alternatives" (2026)
83. SlashTraders — VIX Hedging Strategy (2025)
84. Fortune — "VIX Highest Level Since Trump Tariffs" (2025)
85. Wikipedia — "2025 Stock Market Crash" (2025)
86. JPMorgan — "Where Will Tariff Rates Settle?" (2025)
87. UBS Daily — Trump Tarife Etki Analizi (2025)
88. NYU Stern Glucksman Institute — 2008 Financial Crisis Volatility
89. LUISS University — "Momentum and the Covid-19 Flash Bear Market"
90. Quantified Strategies — Hidden Markov Model Market Regimes (2026)
91. Bravos Research — "Stock Market Volatility Is Rising Just Like Before 2008" (2025)
92. shan.io — "Learnings from the 2008 Great Recession"
93. PMC/NIH — "The 2008 Global Financial Crisis and COVID-19 Pandemic"
94. The InvestQuest — "Best Performing Sectors During 2008" (2021)
95. US News — "Stocks That Outperform in a Recession" (2025)
96. Seeking Alpha — "You Can Spot A Market Bottom With The Put/Call Ratio" (2023)
97. Adam H Grimes — "What Happens After Big Spikes in the VIX?" (2025)
98. SumGrowth — SQQQ ETF Guide (2025)
99. The Wealth Umbrella — Hedging with Leveraged ETFs (2024)
100. Campaign for a Million — Corrections and Bear Markets (campaignforamillion.com/post/corrections-and-bear-markets)

---

*Bu dokuman egitim ve arastirma amaclidir. Finansal tavsiye niteligi tasimaz. Gecmis performans gelecek performansin gostergesi degildir. Opsiyon ticareti yuksek risk icerir ve tum sermayenizi kaybetme riski vardir.*

**Versiyon Gecmisi:**
- v1.0 — EarningsPlay temel strateji dokumani
- v2.0 — 2025 guncellemesi (Greeks Dashboard, UOA, PEAD modulleri)
- **v3.0 — VIX + Earnings Kombinasyon, Sentiment + Earnings, Senaryo Bazli Earnings Stratejisi modulleri eklendi**


---

## [YENI v4.0 - Akademik] Bolum D: Opsiyon Fiyatlama Modelleri ve Greeks Ileri Analizi

Bu bolum, opsiyon fiyatlamasinin matematiksel temellerinden — Black-Scholes-Merton (BSM) modelinden baslayarak — stokastik volatilite, jump-diffusion ve kuantum mekanik yaklasimlarina kadar uzanan akademik literaturu ozetler. Nayak (Harvard, 2024), Cao (Washington, 2024), Li (Sun Yat-Sen, 2026), benchmark raporlari (2026) ve Kyprianou-Wilmott (2005) gibi kaynaklardan derlenen bulgular, earnings stratejisinin matematiksel altyapisini guclendirmektedir.

---

### D.1. Black-Scholes-Merton Modeli: Formul ve Varsayimlar

#### D.1.1. BSM Diferansiyel Denklemi

Black, Scholes ve Merton (1973) tarafindan gelistirilen model, risk-neutral dunyada Avrupa tipi opsiyon fiyatini kapali formda verir. Model, Ito stokastik analizine dayanir ve su varsayimlara dayanir (Wilson, 2024; Wilmott, Dewynne & Howison, 1994):

| Varsayim | Aciklama | Gercek Piyasa Uyumu |
|:---|:---|:---|
| **Sabit volatilite (s)** | Hisse getirilerinin volatilitesi sabit | **Kirildi** — Volatilite zamanla degisir (vol clustering) |
| **Log-normal dagilim** | Hisse fiyati geometrik Brown hareketi izler | **Kirildi** — Getiriler "fat tails" (kalin kuyruk) icerir |
| **Surekli islem** | Piyasada surekli alim-satim mumkun | **Kirildi** — Islem maliyetleri, likidite bosluklari var |
| ** risksiz faiz (r)** | Risksiz faiz orani sabit ve bilinir | **Kirildi** — Faiz oranlari stokastiktir (Vasicek modeli) |
| **Arbitraj yok** | Piyasada arbitraj firsati yoktur | Kismen gecerli — yuksek frekansta kirilabilir |

**Black-Scholes PDE:**

$$
\frac{\partial V}{\partial t} + \frac{1}{2}\sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} + rS\frac{\partial V}{\partial S} - rV = 0
$$

Burada V(S,t) opsiyon fiyatini, S hisse fiyatini, s volatiliteyi, r risksiz faiz oranini ve T vade sonunu gosterir.

#### D.1.2. BSM Kapali Form Cozumu — Greeks Formulleri

Vieira (2025) ve Wilson (2024) calismalarindan derlenen Greeks formulleri:

| Greek | Tanim | BSM Formulu | Earnings Stratejisi Etkisi |
|:---|:---|:---|:---|
| **Delta (Δ)** | Opsiyon fiyatinin hisse fiyatina duyarliligi | Call: N(d₁), Put: N(d₁) - 1 | Delta notr stratejiler (IC) icin ~0 hedef |
| **Gamma (Γ)** | Delta'nin hisse fiyatina degisim hizi | N'(d₁) / (Sσ√T) | Earnings yaklasinca zirve — risk artar |
| **Theta (Θ)** | Zaman kaybina duyarlilik | -(SN'(d₁)σ)/(2√T) - rKe^(-rT)N(d₂) | Short IC icin pozitif = kazanc kaynagi |
| **Vega (ν)** | Volatiliteye duyarlilik | S√T · N'(d₁) | Short IC icin negatif = IV crush'dan kazanc |
| **Rho (ρ)** | Faiz oranina duyarlilik | KTe^(-rT)N(d₂) | Genellikle kucuk etki (short-term opsiyonlar) |

Burada:

$$
d_1 = \frac{\ln(S/K) + (r + \sigma^2/2)T}{\sigma\sqrt{T}}, \quad d_2 = d_1 - \sigma\sqrt{T}
$$

#### D.1.3. Volatilite Yuzeyi ve BSM Limitasyonlari

BSM modelinin en kritik limitasyonu **sabit volatilite** varsayimidir. Gercek piyasada gozlemlenen **volatilite tebessumu (volatility smile/skew)** bu varsayimin kirildigini gosterir (Vieira, 2025):

| Volatilite Yapisi | Tanim | Earnings Donemi Etkisi |
|:---|:---|:---|
| **Volatility Smile** | ATM opsiyonlarin IV'si, OTM opsiyonlara gore daha dusuk — U sekli | Earnings oncesi OTM call/put'larin IV'si asiri siser |
| **Volatility Skew** | Dusuk strike'li put'larin IV'si yuksek — asagi yonlu korku | Earnings oncesi put skew artar (asagi korunma talebi) |
| **Term Structure** | Vadeye gore IV degisimi — contango/backwardation | Earnings vadesi yaklastikca IV artar (event volatility) |

**BSM Limitasyonlari ve Earnings Uygulamasi:**

1. **Sabit Volatilite Kirilmasi:** Earnings doneminde hisse volatilitesi bir "event" etrafinda yogunlasir. BSM, bu event-driven volatiliteyi modelleyemez.
2. **Gaussian Dagilim Kirilmasi:** Earnings sonrasi hisse fiyatlari ani sicramalar (jumps) yapar. BSM'nin surekli surec varsayimi bu jump'lari yakalayamaz (Li, 2026; Kyprianou & Wilmott, 2005).
3. **Volatilite Tebessumu:** Earnings oncesi OTM opsiyonlarin IV'si, BSM tahmininden cok daha yuksektir. Bu, piyasanin "fat tail" riskini fiyatlamasidir.

---

### D.2. Extended Black-Scholes Modeli (Nayak, Harvard 2024)

#### D.2.1. Stokastik Volatilite + Faiz Degiskenligi

Nayak (2024), BSM modelini stokastik volatilite ve stokastik faiz orani ile genisletmistir. Extended BSM PDE'si:

$$
\frac{\partial V}{\partial t} + \frac{1}{2}\sigma(t)^2 S^2 \frac{\partial^2 V}{\partial S^2} + r(t)S\frac{\partial V}{\partial S} - r(t)V + \frac{\partial V}{\partial \sigma}\frac{d\sigma}{dt} + \frac{\partial V}{\partial r}\frac{dr}{dt} = 0
$$

**Stokastik Volatilite (Heston Modeli):**

$$
d\sigma^2 = \kappa(\theta - \sigma^2)dt + \xi\sqrt{\sigma^2}dW_\sigma
$$

Burada:
- κ (kappa): Mean-reversion hizi
- θ (theta): Uzun donem volatilite ortalamasi
- ξ (xi): Vol-of-vol (volatilitenin volatilitesi)

**Stokastik Faiz Orani (Vasicek Modeli):**

$$
dr = a(b - r)dt + sdW_r
$$

Burada a mean-reversion hizi, b uzun donem faiz ortalamasi, s faiz volatilitesidir.

#### D.2.2. Sonlu Farklar Metodu ile Cozum

Nayak (2024), extended PDE'yi sonlu farklar metodu (Finite Difference Method) ile cozmustur. Zaman t, hisse fiyati S, volatilite σ ve faiz orani r uzerinden bir grid olusturulur:

$$
V^{i+1}_{j,k,l} = V^i_{j,k,l} + \Delta t \left[ \frac{1}{2}\sigma_k^2 S_j^2 \frac{\partial^2 V}{\partial S^2} + r_l S_j \frac{\partial V}{\partial S} - r_l V^i_{j,k,l} - \frac{\partial V}{\partial \sigma}\frac{d\sigma}{dt} - \frac{\partial V}{\partial r}\frac{dr}{dt} \right]
$$

#### D.2.3. LSTM ile Karsilastirma Sonuclari

Nayak (2024), extended BSM modelini LSTM (Long Short-Term Memory) sinir agi ile karsilastirmistir:

| Model | RMSE | Tahmin Suresi (ms) | Guclu Yonu |
|:---|:---|:---|:---|
| **Extended BSM (FDM)** | 20.47 | 0.87 | Hizli, dusuk kaynak |
| **LSTM** | **15.23** | 3.45 | Daha dogru, non-linear ogrenme |

**Earnings Stratejisi Icin Cikarim:**
- Extended BSM, stokastik volatiliteyi modelleyerek earnings oncesi IV yukselisini daha iyi yakalar.
- LSTM ise zaman serisi bagimliliklarini (historical earnings pattern'leri) ogrenerek tahmin dogrulugunu artirir.
- **Hibrid yaklasim:** Extended BSM ile hizli tahmin + LSTM ile pattern reconition = en iyi sonuc.

---

### D.3. Greeks'in Zaman Davranisi ve Earnings Dongusu

#### D.3.1. Greeks'in Earnings Dongusundeki Degisimi

Earnings aciklamasina yaklastikca Greeks davranisi onemli olcude degisir. Bu degisim, opsiyon stratejisi seciminde kritik rol oynar:

| Greek | Earnings Yaklastikca (1-5 gun) | IV Crush Sonrasi (0-3 gun) | Stratejik Etki |
|:---|:---|:---|:---|
| **Delta (Δ)** | Artar — hisse hareketine hassasiyet yukselir | Duser — hisse "sabitlenir" | Earnings oncesi delta notr korumasi zorlasir |
| **Gamma (Γ)** | **Zirve** — en yuksek deger | **Duser** — hizla azalir | Gamma scalping firsati (epsilon yaklasiminda) |
| **Theta (Θ)** | En negatif — hizli zaman kaybi | Daha negatif (hala) | Short IC icin maksimum theta kazanci |
| **Vega (ν)** | **Zirve** — IV en yuksek seviyede | **Duser** — IV crush | Short IC'nin ana kazanc kaynagi |
| **Vanna** | Yuksek — Delta-IV korelasyonu | Duser | Earnings oncesi dinamik hedge zorlugu |
| **Charm** | Yuksek — Delta zamana duyarli | Duser | Earnings gecesi delta "surprizi" |

#### D.3.2. Earnings Oncesi/ Sonrasi Greeks Profili (Dashboard)

**Earnings Oncesi (1-3 gun kala) Greeks Profili:**

| Parametre | Deger/Aralik | Stratejik Anlam |
|:---|:---|:---|
| Delta | 0.45-0.55 (ATM) | Hafif yonlu, delta notr yaklasimi |
| Gamma | > 0.05 (yuksek) | Hisse hareketine asiri hassas — hedge maliyetli |
| Theta | < -0.10 (cok negatif) | Hizli zaman kaybi — Short IC icin ideal |
| Vega | > 0.20 (cok yuksek) | IV crush potansiyeli maksimum — Short IC icin ideal |
| IV Rank | > %80 | Earnings event volatilitesi zirvede |
| IV/RV Orani | > 1.5 | Implied vol realized vol'den cok yuksek — VRP firsati |

**IV Crush Sonrasi (1-2 gun sonra) Greeks Profili:**

| Parametre | Deger/Aralik | Stratejik Anlam |
|:---|:---|:---|
| Delta | 0.30-0.70 (degisken) | Hisse yonune bagli — delta notr bozulabilir |
| Gamma | < 0.02 (dusuk) | "Pinning" etkisi — hisse strike etrafinda takilabilir |
| Theta | < -0.05 (hala negatif) | Zaman kaybi devam — erken cikis dusun |
| Vega | < 0.10 (dusmus) | IV crush gerceklesti — pozisyon kapat veya azalt |
| IV Rank | <%40 (dustu) | Volatilite normalize oldu — yeni firsat bekle |

#### D.3.3. Greeks Yonetiminde Earnings-Specifik Kurallar

| Greek | Earnings Oncesi Aksiyon | Earnings Sonrasi Aksiyon |
|:---|:---|:---|
| **Delta > \|0.10\|** | Wing width'i genislet veya pozisyonu kapat | Delta hedge veya pozisyonu kapat |
| **Gamma > 0.05** | 21 DTE kuralini siki uygula (epsilon yaklasiyor) | "Pinning" riskine karsi dikkatli ol |
| **Theta pozitif** | Maksimum theta kazanci — kar hedefini izle | Theta hizla azaliyor — erken cikis dusun |
| **Vega negatif** | IV crush beklentisi guclu — tut | IV crush gerceklesiyor — kar realizasyonu |
| **Vanna > 0.03** | IV ve delta birlikte hareket ediyor — hedge maliyeti artar | Vanna dustu — dinamik hedge kolaylasti |

---

### D.4. Volatilite Yapisi ve Greeks Etkilesimi

#### D.4.1. Volatilite Skew — Earnings Oncesi Egrim Degisimi

Earnings oncesi volatilite skew'i onemli olcude degisir (Vieira, 2025; benchmark raporu, 2026):

| Skew Durumu | Earnings Yorumu | Greeks Etkisi |
|:---|:---|:---|
| **Pozitif Skew** (Put IV > Call IV) | Piyasa asagi yonlu risk fiyatliyor | Put tarafi daha pahali — IC put wing genislet |
| **Negatif Skew** (Call IV > Put IV) | Yukari yonlu beklenti/"lotto ticket" alimi | Call tarafi daha pahali — IC call wing genislet |
| **Duz Skew** (Put IV ≈ Call IV) | Dengeli beklenti — optimal IC ortami | Standard IC — her iki wing esit |

**Earnings Oncesi Skew Degisimi:**

| Zaman | Tipik Skew | Sebep |
|:---|:---|:---|
| Earnings'ten 2 hafta once | Hafif pozitif (normal) | Genel asagi yonlu korku |
| Earnings'ten 3-5 gun once | **Guclu pozitif** | Asagi yonlu korunma talebi artar |
| Earnings gunu | En guclu pozitif | Maksimum uncertainty |
| Earnings sonrasi 1 gun | **Skew duzlesir/doner** | Uncertainty cozuldu |

#### D.4.2. Greeks-Zaman Egrisi (Theta Decay Profili)

BSM cercevesinde theta decay egrisi (Vieira, 2025):

| DTE Kalan | Theta (gunluk) | Karakteristik |
|:---|:---|:---|
| 45 DTE | Dusuk | "Sweet spot" girisi — theta yavas |
| 30 DTE | Orta | Theta hizlaniyor — kazanc artiyor |
| 21 DTE | Yuksek | **Cikis noktasi** — gamma riski basliyor |
| 14 DTE | Cok yuksek | Gamma riski kritik — sadece deneyimli |
| 7 DTE | Zirve | "Extreme theta" — gamma patlamasi riski |
| 0DTE | Maksimum | Yalnizca scalping — IC icin yasak |

**Theta + Vega Kombinasyonu:**

| Senaryo | Theta | Vega | Net Etki (Short IC) | Kar Potansiyeli |
|:---|:---|:---|:---|:---|
| Earnings oncesi 3 gun | Cok negatif | Cok yuksek | **Maksimum** | Yuksek |
| Earnings gunu | Zirve negatif | Zirve | **Maksimum** | En yuksek |
| IV crush (24 saat) | Hala negatif | Dustu | **Kar realizasyonu** | Kazanc realize |
| IV crush (72 saat) | Azaliyor | Normal | Azalan kazanc | Pozisyonu kapat |



---

## [YENI v4.0 - Akademik] Bolum E: Ileri Opsiyon Fiyatlama Modelleri

Bu bolum, BSM modelinin otesindeki ileri fiyatlama modellerini — Heston stokastik volatilitesi, Levy surecleri (VG, NIG, CGMY), Monte Carlo simulasyonu, konveks dualite ve kuantum mekanik yaklasimlar — earnings stratejisi baglaminda analiz eder. Benchmark sonuclari (13 model karsilastirmasi) ve akademik kaynaklardan (Cao 2024; Li 2026; Kyprianou, Schoutens & Wilmott 2005; Rosenbaum & Zhang 2021) derlenen bulgular sunulur.

---

### E.1. Heston Modeli: Stokastik Volatilite ile Fiyatlama

#### E.1.1. Heston SDE Sistemi

Heston (1993) modeli, volatiliteyi kendi stokastik sureciyle modelleyerek BSM'nin sabit volatilite varsayimini cozer (Cao & Lin, 2024; Sridi & Bilokon, 2023):

$$
dS_t = rS_t dt + \sqrt{v_t}S_t dW_t^S
$$

$$
dv_t = \kappa(\theta - v_t)dt + \xi\sqrt{v_t}dW_t^v
$$

Burada:
- S_t: Hisse fiyati
- v_t: Anlik varyans (volatilite karesi)
- κ: Mean-reversion hizi (volatilitenin ortalamaya donme hizi)
- θ: Uzun donem varyans ortalamasi
- ξ: Vol-of-vol (varyansin volatilitesi)
- ρ: dW_t^S ve dW_t^v arasindaki korelasyon

**Heston Parametrelerinin Earnings Yorumu:**

| Parametre | Earnings Oncesi Tipik Deger | Earnings Sonrasi Tipik Deger | Yorum |
|:---|:---|:---|:---|
| v₀ (Anlik varyans) | 0.15-0.40 (yuksek) | 0.05-0.15 (dustu) | Earnings event volatilitesi |
| κ (Mean-reversion) | 2.0-4.0 | 2.0-4.0 (sabit) | Volatilite hizla ortalamaya doner |
| θ (Uzun donem varyans) | 0.04-0.09 | 0.04-0.09 (sabit) | Hisseye ozgu karakteristik vol |
| ξ (Vol-of-vol) | 0.3-0.6 | 0.3-0.6 (sabit) | Volatilitedeki belirsizlik |
| ρ (Korelasyon) | -0.3 ila -0.8 | -0.3 ila -0.8 | Asagi hareket → vol artisi (leverage etkisi) |

#### E.1.2. Heston Karakteristik Fonksiyonu ve Fourier Inversiyonu

Heston modelinin kapanis form cozumu, karakteristik fonksiyon uzerinden Fourier inversiyonuyla elde edilir (Cao & Lin, 2024):

$$
\phi(u) = \exp\left\{ iu\ln(S_0) + iurT + \frac{\kappa\theta}{\xi^2}\left[(\kappa - \rho\xi iu - d)T - 2\ln\left(\frac{1 - g e^{-dT}}{1 - g}\right)\right] \right\}
$$

Burada:

$$
d = \sqrt{(\kappa - \rho\xi iu)^2 + \xi^2(iu + u^2)}, \quad g = \frac{\kappa - \rho\xi iu - d}{\kappa - \rho\xi iu + d}
$$

Call fiyati:

$$
C = S_0 P_1 - Ke^{-rT}P_2
$$

**Earnings Stratejisi Icin Heston Kullanimi:**

| Uygulama | Yontem | Fayda |
|:---|:---|:---|
| **Earnings oncesi IV tahmini** | Heston modelini hissenin opsiyon yuzeyine kalibre et | Daha dogru IV crush tahmini |
| **Volatilite yuzeyi analizi** | Heston'un urettigi IV yuzeyini gozlemle | Earnings event volatilitesini izole et |
| **Opsiyon fiyati cozumlemesi** | Heston fiyatini BSM fiyatindan cikart | "Earnings premium" = fark |
| **Risk yonetimi** | Heston parametrelerini izle (VIX-like) | Earnings oncesi vol stress testi |

#### E.1.3. Rough Heston ve Kaba Volatilite

Rosenbaum & Zhang (2021) kuadratik kaba (rough) Heston modelini tanitmistir. Bu model, fraksiyonel Brown hareketi ile volatilite surecini modelleyerek "kaba volatilite" (rough volatility) paradigmasini kullanir:

$$
dV_t = \kappa(\theta - V_t)dt + \xi V_t^{1/2} dW_t^H
$$

Burada H < 1/2 (Hurst exponent) "rough" rejimi tanimlar. **Zumbach etkisi** (gecmis volatilitenin gelecek volatiliteye etkisi) kuadratik uzanti ile modellenir:

$$
\sigma_t^2 = (a + b X_t)^2
$$

(X_t: log-fiyat sureci)

| Model | H Parameteresi | Kalibrasyon Hizi | Earnings Uygulamasi |
|:---|:---|:---|:---|
| Klasik Heston | H = 0.5 | Hizli | Genel volatilite tahmini |
| Kaba (Rough) Heston | H < 0.5 | Yavas (DL ile hizlanir) | Kisa vadeli vol "roughness" |
| Kuadratik Kaba Heston | H < 0.5 + Zumbach | DL ile hizli | Earnings vol clustering |

---

### E.2. Levy Surecleri: Jump-Diffusion ve Fat Tails

#### E.2.1. Levy Surecleri Temelleri

Levy surecleri, BSM'nin Brown hareketini genelleyerek **sicramali (jump)** ve **kalin kuyruklu (fat-tailed)** surecler ile fiyatlama imkani sunar (Kyprianou, Schoutens & Wilmott, 2005). Levy-Khintchine formulu:

$$
\psi(u) = i\gamma u + \frac{1}{2}\sigma^2 u^2 + \int_{\mathbb{R} \setminus \{0\}} \left(1 - e^{iux} + iux\mathbf{1}_{\{|x|<1\}}\right) \nu(dx)
$$

Burada ν(dx) **Levy olcumu** (jump yapisini tanimlar).

#### E.2.2. Variance-Gamma (VG) Modeli

Madan & Seneta (1990) tarafindan gelistirilen VG modeli, Brown hareketini Gamma sureciyle "zaman degistirerek" (time-changed) elde eder:

$$
X_t = \theta G_t + \sigma W_{G_t}
$$

Burada G_t ~ Γ(t/ν, ν) Gamma subordinatorudur. VG yogunluk fonksiyonu:

$$
f_{VG}(x; t) = \frac{2\exp(\theta x / \sigma^2)}{\nu^{t/\nu}\sqrt{2\pi}\sigma \Gamma(t/\nu)} \left(\frac{|x|}{\sqrt{\theta^2 + 2\sigma^2/\nu}}\right)^{t/\nu - 1/2} K_{t/\nu - 1/2}\left(\frac{|x|\sqrt{\theta^2 + 2\sigma^2/\nu}}{\sigma^2}\right)
$$

#### E.2.3. Normal Inverse Gaussian (NIG) Modeli

Barndorff-Nielsen (1997) tarafindan gelistirilen NIG modeli, daha agir kuyruklu bir dagilim sunar:

NIG karakteristik fonksiyonu:

$$
\phi_{NIG}(u) = \exp\left\{ -i\mu u + \delta\left(\sqrt{\alpha^2 - \beta^2} - \sqrt{\alpha^2 - (\beta + iu)^2}\right) \right\}
$$

Parametreler:
- α > 0: Kuyruk kalinligi (kuyruk parametresi)
- β ∈ (-α, α): Asimetri (skewness)
- δ > 0: Olceklendirme (scale)
- μ: Lokasyon (location)

**VG ve NIG Karsilastirmasi:**

| Ozellik | Variance-Gamma (VG) | Normal Inverse Gaussian (NIG) |
|:---|:---|:---|
| Kuyruk kalinligi | Kalin | **Daha kalin** (NIG > VG) |
| Asimetri | Esnek | Esnek |
| Moment varligi | Sonlu | Sonlu (daha iyi) |
| Hesaplama kolayligi | FFT ile hizli | FFT ile hizli |
| Earnings modellemesi | Iyi | **En iyi** (RMSE %4.72) |
| **Benchmark RMSE** | %5.43 | **%4.72** |

#### E.2.4. Earnings Icin Jump-Diffusion Modellemesi

Earnings aciklamasi, hisse fiyatinda **ani sicrama (jump)** yaratir. Merton (1976) jump-diffusion modeli:

$$
dS_t = (\mu - \lambda k)S_t dt + \sigma S_t dW_t + (J - 1)S_t dN_t
$$

Burada:
- N_t: Poisson sureci (sicrama sayisi — λ orani)
- J: Sicrama boyutu (log-normal dagilim)
- k = E[J - 1]: Beklenen sicrama boyutu

**Earnings Jump Modeli (Georgoulis, Papapantoleon & Smaragdakis, 2024):**

Earnings gunu icin sicrama yogunlugu:

$$
\nu_{earnings}(dy) = \frac{1}{\sqrt{2\pi}\delta_J} \exp\left(-\frac{(y - \mu_J)^2}{2\delta_J^2}\right) dy
$$

| Parametre | Tipik Deger | Aciklama |
|:---|:---|:---|
| λ (Sicrama orani) | 1-4/yil (earnings) | Yilda 1-4 earnings event |
| μ_J (Sicrama ortalamasi) | %2-8 | Earnings "surprise" boyutu |
| δ_J (Sicrama volatilitesi) | %3-10 | Earnings sonrasi fiyat dalgalanmasi |

---

### E.3. Benchmark Sonuclari: 13 Model Karsilastirmasi

#### E.3.1. Benchmark Metodolojisi

2026 benchmark raporunda 13 farkli opsiyon fiyatlama modeli karsilastirilmistir. RMSE (Root Mean Square Error) ve kalibrasyon suresi temel metriklerdir.

#### E.3.2. 13 Model Karsilastirma Tablosu

| Model | RMSE (%) | Kalibrasyon (ms) | Vol Smile | Sicrama | Pratiklik | GPU | Earnings Stratejisi Icin Degerlendirme |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **NIG (Levy)** | **%4.72** | 21,906 | Mükemmel | Evet | Orta | Hayir | **En dogru** — Sicramali earnings modellemesi icin ideal |
| **Quantum/PCE** | **%4.92** | **10** | Yok | Hayir | Teorik | N/A | **En hizli** — Gelecek potansiyel |
| **Variance-Gamma** | %5.43 | 10,474 | Iyi | Evet | Orta | Hayir | Dengeli sicrama modeli |
| **Heston (Klasik)** | %6.15 | 5,230 | Iyi | Hayir | Yuksek | Hayir | SV tabanli earnings vol tahmini |
| **DML Heston Kalib.** | %6.30 | **50** | Iyi | Hayir | Yuksek | Evet | **Hizli kalibrasyon** — earnings icin pratik |
| **Rough Heston (DL)** | %8.78 | 2,761 | Cok iyi | Hayir | Orta | Evet | Kaba volatilite — kisa vadeli earnings |
| **PIDE + Derin Ogrenme** | %7.20 | 3,500 | Iyi | Evet | Orta | Evet | Jump-diffusion + derin ogrenme |
| **Kaba Heston CPDE** | %8.50 | 8,200 | Cok iyi | Hayir | Dusuk | Evet | Akademik arastirma |
| **Deep WMC + VAE** | %9.10 | 1,200 | Kismi | Kismi | Orta | Evet | Egzotik opsiyonlar |
| **Stacked MC** | %10.50 | 800 | Kismi | Kismi | Yuksek | Kismi | Monte Carlo hizlandirma |
| **GH-Willow Tree** | %11.20 | 6,400 | Iyi | Evet | Yuksek | Hayir | Genellestirilmis hiperbolik |
| **Convex Duality** | Teorik | N/A | Teorik | Kismi | Dusuk | Hayir | Teorik alt/ust sinir |
| **Kuantum LP (Eksik Piyasa)** | Teorik | N/A | Kismi | Kismi | N/A | N/A | Gelecek potansiyel |

#### E.3.3. Model Secim Rehberi: Piyasa Kosuluna Gore

| Piyasa Kosulu | Onerilen Model | Neden | Earnings Stratejisi |
|:---|:---|:---|:---|
| **Normal piyasa (VIX < 20)** | Heston (Klasik) | Hizli, pratik | Standard IC — volatilite tahmini |
| **Yuksek volatilite (VIX 20-35)** | NIG (Levy) | En dogru, sicrama var | IC + sicrama risk yonetimi |
| **Earnings donemi (IV > %80)** | **NIG veya VG** | Earnings jump'ini modelleyebilir | En dogru fiyatlama |
| **Kriz donemi (VIX > 35)** | Rough Heston | Kaba volatilite + kuyruk | Tail risk fiyatlamasi |
| **Hizli kalibrasyon gerekli** | DML Heston | 100x hizli | Earnings icin real-time |
| **Egzotik opsiyon** | Deep WMC + VAE | Path-dependent cozebilir | Barrier, Asian earnings |
| **Teorik sinir analizi** | Convex Duality | Alt/ust sinir | Superhedging maliyeti |

---

### E.4. Monte Carlo Simulasyonu: Path-Dependent Opsiyonlar

#### E.4.1. Klasik Monte Carlo

Risk-neutral fiyatlama:

$$
V = e^{-rT} \mathbb{E}^Q[Payoff(S_T)]
$$

Monte Carlo tahmincisi:

$$
\hat{V} = \frac{1}{N} \sum_{i=1}^{N} e^{-rT} Payoff(S_T^{(i)})
$$

#### E.4.2. Ileri Monte Carlo Teknikleri

| Teknik | Yontem | Varyans Azaltilmasi | Earnings Uygulamasi |
|:---|:---|:---|:---|
| **Antithetic Variates** | Z ve -Z ciftleri kullan | %30-50 | Earnings path simulasyonu |
| **Control Variates** | BSM fiyati kontrol degiskeni | %20-40 | Earnings IC fiyat dogrulugu |
| **Importance Sampling** | Sicrama olasiligini artir | %40-60 | Earnings jump simulasyonu |
| **Quasi-Monte Carlo** | Sobol dizileri | %30-50 | Heston/NIG calibirasyn |
| **Deep WMC (Kunsagi-Mate 2022)** | VAE + agirlikli MC | %50-70 | Egzotik earnings opsiyonlari |

#### E.4.3. Stokastik Volatilite ile Monte Carlo

Heston modeli icin Euler-Maruyama simulasyonu:

$$
S_{t+\Delta t} = S_t \exp\left\{ (r - \frac{1}{2}v_t)\Delta t + \sqrt{v_t}\sqrt{\Delta t}Z_1 \right\}
$$

$$
v_{t+\Delta t} = v_t + \kappa(\theta - v_t)\Delta t + \xi\sqrt{v_t}\sqrt{\Delta t}(\rho Z_1 + \sqrt{1-\rho^2}Z_2)
$$

**Earnings MC Simulasyon Parametreleri:**

| Parametre | Deger | Aciklama |
|:---|:---|:---|
| Path sayisi (N) | 100,000 - 1,000,000 | Yeterli dogruluk icin |
| Zaman adimi (Δt) | 1/252 (gunluk) | Islem gunu hassasiyeti |
| Earnings gunu | Sicrama ekle (λ) | Poisson sicramasi |
| Sicrama boyutu | N(μ_J, δ_J²) | Earnings "surprise" |

---

### E.5. Convex Duality Yaklasimi (Cao, 2024)

#### E.5.1. Carr-Torricelli Konveks Dualite Formulasyonu

Cao (2024), Carr & Torricelli'nin calismasini temel alarak opsiyon fiyatlamasini bir **konveks optimizasyon problemi** olarak formule eder:

**Primal Problem (Opsiyon Fiyati):**

$$
C(K) = \sup_{Q \in \mathcal{M}} \mathbb{E}^Q\left[e^{-rT}(S_T - K)^+\right]
$$

**Dual Problem (Superhedging):**

$$
P(K) = \inf_{v: V(v) \geq Payoff} V_0(v)
$$

Burada Q martingale olcumudur ve M tum martingale olcumlerinin kumesidir.

#### E.5.2. Konveks Dualite ve Earnings Stratejisi

| Dualite Uygulamasi | Earnings Stratejisi Etkisi |
|:---|:---|
| **Alt sinir (sub-hedge)** | Earnings IC'nin maksimum kaybini sinirlar |
| **Ust sinir (super-hedge)** | Earnings IC'nin maksimum karini tahmin eder |
| **Arbitraj sinirlari** | Gercek piyasa fiyati ile model fiyati arasindaki farki olcer |
| **Model bagimsiz fiyatlama** | Farkli modeller (BSM, Heston, NIG) arasindaki tutarliligi test eder |

**Konveks Dualite + Bachelier/Lojistik Modeli:**

| Model | Varsayim | Earnings Uygunlugu |
|:---|:---|:---|
| **Bachelier** | dS_t = σdW_t (aritmetik BM) | Kisa vadeli, dusuk vol — earnings oncesi |
| **Lojistik** | S_t ~ Logistic(μ, s) (agir kuyruklu) | **Earnings icin daha uygun** — kalin kuyruk |

Cao (2024), Monte Carlo simulasyonu ile Lojistik modelin Bachelier modeline gore earnings donemindeki ani fiyat hareketlerini daha iyi modelledigini dogrulamistir.

---

### E.6. Kuantum Mekanik Yaklasimi (Li, 2026)

#### E.6.1. Schrodinger Denklemi ve Opsiyon Fiyatlama

Li (2026), BSM denklemini Schrodinger denklemine eslestirerek kuantum mekanik yaklasimini uygular. BSM PDE'si:

$$
\frac{\partial V}{\partial t} + \frac{1}{2}\sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} + rS\frac{\partial V}{\partial S} - rV = 0
$$

Schrodinger formuna donusturme (x = ln(S/K)):

$$
i\frac{\partial \psi}{\partial t} = \hat{H}\psi
$$

Burada Hamiltonian operatoru:

$$
\hat{H} = -\frac{\sigma^2}{2}\frac{\partial^2}{\partial x^2} + \left(\frac{\sigma^2}{2} - r\right)\frac{\partial}{\partial x} + rI
$$

#### E.6.2. Kuantum Beklenti ve "Piyasa Gucu" Modeli

Li (2026), piyasa beklentilerini "kuantum beklenti" cercevesinde yeniden formule eder:

| Klasik Finans | Kuantum Mekanik | Earnings Yorumu |
|:---|:---|:---|
| Risk-neutral beklenti | Kuantum dalga fonksiyonu | Piyasanin earnings beklentisi "belirsizlik" icerir |
| Olasilik dagilimi | \|ψ(x)\|² yogunlugu | Earnings sonrasi fiyat dagilimi |
| Volatilite (σ) | Kuantum "potansiyel" | Earnings "potansiyel enerjisi" = belirsizlik |
| **Market Force (MF)** | **Kuantum operatoru** | **Earnings beklentisi + surpriz etkisi** |

Li'nin **Market Force (MF)** modeli:

$$
MF = \underbrace{\mathbb{E}[S_T | \mathcal{F}_t]}_{\text{Beklenti}} + \underbrace{\sigma_Q \cdot \sqrt{T}}_{\text{Kuantum Belirsizligi}}
$$

**Kuantum Earnings Stratejisi Cikarimlari:**

1. **"Quantum Tunneling" Etkisi:** Earnings oncesi hisse fiyati bir "potansiyel bariyer" (strike) etrafinda takilir. Earnings aciklamasi bu bariyeri "delerek" (tunneling) ani bir sicrama yaratir.
2. **"Wave Function Collapse":** Earnings aciklamasi, piyasanin "belirsizlik dalga fonksiyonunu" cokerterek (collapse) fiyati tek bir noktaya (gerceklesen fiyat) yogunlastirir.
3. **Heisenberg Belirsizlik:** Earnings oncesi volatilite (Δσ) ve fiyat (ΔS) arasinda ters iliski vardir — birini tam bilirken digeri belirsizlesir.

---

### E.7. Model Secim Rehberi: Earnings Stratejisi Icin Karar Agaci

```
Earnings Stratejisi Icin Model Secimi:
|
|-- Hizli tah mi gerekli? (real-time)
|   |-- EVET -> DML Heston Kalibrasyonu (~50ms)
|   |-- HAYIR -> Daha dogru modele git
|
|-- Sicrama (jump) riski var mi?
|   |-- EVET (earnings = yuksek sicrama olasiligi)
|   |   |-- En dogru -> NIG (Levy) — RMSE %4.72
|   |   |-- Dengeli -> Variance-Gamma — RMSE %5.43
|   |   |-- Pratik -> PIDE + Derin Ogrenme
|   |-- HAYIR
|   |   |-- Volatilite egimi onemli mi?
|   |       |-- EVET -> Rough Heston (kaba volatilite)
|   |       |-- HAYIR -> Klasik Heston
|
|-- Path-dependent mi? (barrier, Asian)
|   |-- EVET -> Deep WMC + VAE
|   |-- HAYIR -> Diger modeller yeterli
|
|-- Teorik sinir analizi mi?
    |-- EVET -> Convex Duality (Cao, 2024)
```



---

## [YENI v4.0 - Akademik] Bolum F: Akademik Earnings Stratejileri ve Risk Yonetimi

Bu bolum, akademik literaturden gelismis earnings stratejilerini ve risk yonetimi tekniklerini sunar. Stokastik volatilite ile earnings volatilite tahmini, implied volatilite term yapisi, volatilite smile/skew analizi, jump-diffusion modellemesi, Kelly Criterion ile position sizing ve risk-neutral pricing (Q-measure vs P-measure) gibi konular ele alinir.

---

### F.1. Stokastik Volatilite + Earnings: Heston ile Volatilite Tahmini

#### F.1.1. Earnings Oncesi Implied Volatilite Yapisi (Term Structure)

Earnings aciklamasina yaklastikca implied volatilite (IV) yapisi karakteristik bir "event" profili sergiler (Vieira, 2025; benchmark raporu, 2026):

| Vade (DTE) | Tipik IV Seviyesi | Strateji Uygunlugu | Risk Profili |
|:---|:---|:---|:---|
| **0DTE** | En yuksek (%80-150) | **Scalping only** — IC icin cok riskli | Gamma patlamasi, likidite riski |
| **1-3 gun** | Cok yuksek (%60-100) | **Short vega (IC)** — dar wing | IV crush'dan maksimum kazanc |
| **1-2 hafta** | Yuksek (%45-70) | **Short vega (IC)** — optimal | Dengeli theta/vega orani |
| **3-4 hafta** | Orta-yuksek (%35-55) | Short vega (IC) veya Directional | Earnings IV + zaman IV birlesimi |
| **1-3 ay** | Normal (%20-35) | **Directional** — earnings etkisi az | Temel hisse analizi on planda |
| **> 3 ay** | Dusuk (%15-25) | Long-term directional | Earnings etkisi minimal |

#### F.1.2. Heston Modeli ile Earnings Volatilite Tahmini

Earnings oncesi Heston parametrelerini hissenin opsiyon yuzeyine kalibre ederek:

1. **Adim 1:** Hissenin tum vade ve strike'larindaki implied volatilite verisini topla
2. **Adim 2:** Heston modelini bu veriye kalibre et (κ, θ, ξ, ρ, v₀)
3. **Adim 3:** Earnings gunu icin "event vol" bilesenini izole et:

$$
\sigma_{earnings}^2 = v_0^{pre-earnings} - v_0^{normal}
$$

| Heston Parametresi | Earnings Oncesi | Normal Donem | Earnings "Event" Bileseni |
|:---|:---|:---|:---|
| v₀ (Anlik varyans) | 0.20-0.40 | 0.05-0.10 | 0.15-0.30 (%75 volatilite) |
| κ (Mean-reversion) | 2.0-4.0 | 2.0-4.0 | Sabit — vol hizla normale doner |
| θ (Uzun donem) | 0.06-0.09 | 0.06-0.09 | Sabit — hisseye ozgu |
| ξ (Vol-of-vol) | 0.4-0.6 | 0.3-0.5 | Earnings oncesi vol-of-vol artar |
| ρ (Korelasyon) | -0.5 ila -0.8 | -0.3 ila -0.5 | Earnings oncesi negatif korelasyon guclenir |

#### F.1.3. Earnings Volatilite Tahmini — Pratik Formul

Heston kalibrasyonu olmadan hizli bir tahmin:

$$
\sigma_{earnings} \approx \sqrt{\sigma_{ATM}^2 + \frac{\sigma_{skew}^2}{4} + \lambda_{event} \cdot \sigma_{jump}^2}
$$

Burada:
- σ_ATM: ATM implied volatilite
- σ_skew: 25-delta put-call vol farki (skew olcusu)
- λ_event: Earnings event olasiligi (tipik 1.0 — kesin event)
- σ_jump: Beklenen sicrama volatilitesi (%5-10 tipik)

---

### F.2. Volatilite Smile/Skew Analizi: Earnings Oncesi Egim Degisimi

#### F.2.1. Earnings Volatilite Smiley Profili

Earnings oncesi volatilite yuzeyi uc karakteristik ozellik gosterir (Vieira, 2025):

| Profil Ozelligi | Earnings Oncesi (3-5 gun) | Normal Donem |
|:---|:---|:---|
| **ATM IV** | %50-100 (hisseye bagli) | %20-35 |
| **25D Put IV** | ATM + %15-30 | ATM + %3-8 |
| **25D Call IV** | ATM + %5-15 | ATM + %2-5 |
| **Skew (25D Put-Call)** | %10-20 (guclu pozitif) | %2-5 (hafif pozitif) |
| **Smile egimi** | "Dramatik U" | "Hafif U" |

#### F.2.2. Skew Degisimi ve Earnings Stratejisi

| Skew Durumu | Stratejik Yorum | Earnings IC Uyarlamasi |
|:---|:---|:---|
| **Guclu pozitif skew** (Put IV >> Call IV) | Piyasa asagi korkuyor | Put wing'i call wing'den **%30-50 daha genis** ac |
| **Dengeli skew** (Put IV ≈ Call IV) | Belirsizlik simetrik | Standard IC — esit wing genisligi |
| **Ters skew** (Call IV > Put IV) | Yukari beklenti guclu ("lotto") | Call wing'i put wing'den **%20-30 daha genis** ac |

#### F.2.3. Earnings Volatilite Term Yapisi (Zaman Egrisi)

| Zaman | Term Yapisi | Earnings Etkisi |
|:---|:---|:---|
| Earnings'ten 4+ hafta once | Normal contango | Earnings etkisi yok |
| Earnings'ten 2-3 hafta once | Hafif "hump" basliyor | Earnings IV yavas yavas ekleniyor |
| Earnings'ten 1 hafta once | Belirgin "hump" | Earnings volatilitesi baskin |
| Earnings gunu | **Keskin "spike"** | Maksimum event volatilitesi |
| Earnings sonrasi 1-2 gun | Hizli "collapse" | **IV crush** — volatilite duser |
| Earnings sonrasi 1 hafta | Normal contango'ya donus | Earnings etkisi kayboldu |

**"Volatilite Hump" Olcumu:**

$$
H_{earnings} = \frac{IV_{earnings\ vade} - IV_{normal}}{IV_{normal}} \times 100
$$

- H_earnings > %100: Cok guclu earnings beklentisi (agresif short vega)
- H_earnings = %50-100: Normal earnings volatilitesi (standard IC)
- H_earnings < %50: Zayif earnings etkisi (dikkatli — hisse yonlu hareket edebilir)

---

### F.3. Jump-Diffusion Modellemesi: Earnings Sonrasi Ani Fiyat Sicramalari

#### F.3.1. Merton Jump-Diffusion ve Earnings

Earnings aciklamasi, hisse fiyatinda bir **sicrama (jump)** sureci yaratur. Merton (1976) modelinin earnings uyarlamasi:

| Parametre | Sembol | Tipik Deger | Aciklama |
|:---|:---|:---|:---|
| Drift (risk-neutral) | μ - λk | r - λk | Risk-neutral dunyada drift |
| Difüzyon volatilitesi | σ | %15-30 | Surekli volatilite bileseni |
| Sicrama orani | λ | 1-4/yil | Yillik earnings sayisi |
| Sicrama ortalamasi | μ_J | %0-5 | Beklenen earnings "surprise" |
| Sicrama std. sapmasi | δ_J | %3-8 | Earnings sonrasi dalgalanma |

#### F.3.2. Earnings Sicrama Dagilimi

Earnings sonrasi getiri dagilimi, normal dagilima gore **kalin kuyruklu** ve **asimetrik** tir (Li, 2026; benchmark raporu, 2026):

| Dagilim | Kuyruk Kalinligi | Asimetri | Earnings Modelleme |
|:---|:---|:---|:---|
| **Normal (BSM)** | Ince | Simetrik | **Yetersiz** — earnings jump'ini kacirir |
| **Log-Normal** | Hafif kalin | Pozitif | Kismen yeterli |
| **Variance-Gamma** | Kalin | Esnek | Iyi — earnings sicramasi modellenir |
| **NIG** | **En kalin** | Esnek | **En iyi** — extreme earnings move'lari yakalar |
| **Lojistik (Cao 2024)** | Kalin | Simetrik | Iyi — earnings belirsizligi modellenir |

#### F.3.3. Earnings Jump Riski Quantification

Earnings gunu icin beklenen fiyat hareketi (Expected Move):

$$
EM = S_0 \cdot \left( rT + \lambda\mu_J T \pm \sqrt{\sigma^2 T + \lambda(\mu_J^2 + \delta_J^2)T} \right)
$$

Pratik formul (sadece volatilite):

$$
EM \approx S_0 \cdot \sigma_{implied} \cdot \sqrt{T}
$$

**Earnings Sonrasi Fiyat Senaryolari (Jump-Diffusion):**

| Senaryo | Olasilik | Fiyat Etkisi | Stratejik Sonuc |
|:---|:---|:---|:---|
| **Kucuk beat** (%1-3 surpriz) | %35-40 | Hafif yukari (%2-5) | IC call wing test edilir |
| **Buyuk beat** (>%3 surpriz) | %15-20 | Guclu yukari (%5-15) | IC call wing kirilebilir |
| **Inline** (tahmin = gercek) | %20-25 | Hafif hareket (%0-2) | **IC icin en iyi senaryo** |
| **Kucuk miss** (%1-3 eksik) | %15-20 | Hafif asagi (%2-5) | IC put wing test edilir |
| **Buyuk miss** (>%3 eksik) | %5-10 | Guclu asagi (%5-20) | IC put wing kirilebilir |

---

### F.4. Akademik Position Sizing: Kelly Criterion ve Optimal f

#### F.4.1. Kelly Criterion

Kelly (1956) kriteri, uzun donem buyume oranini maksimize eden bahis/position buyuklugunu verir. Earnings IC stratejisi icin:

$$
f^* = \frac{p(b+1) - 1}{b}
$$

Burada:
- f*: Optimal pozisyon buyuklugu (portfoyun yuzdesi)
- p: IC'nin kazanma olasiligi (backtest'ten)
- b: Ortalama kazanc / ortalama kayip orani (reward-to-risk)

**Earnings IC Kelly Ornegi:**

| Parametre | Deger | Kaynak |
|:---|:---|:---|
| p (Kazanma olasiligi) | %70 | 12 yillik backtest (v3.0) |
| b (Reward/Risk) | 1.0 (%50 kar hedefi / %100 risk) | IC risk/reward yapisindan |
| f* (Kelly) | %40 | (0.70 * 2.0 - 1) / 1.0 = 0.40 |
| **Yarim Kelly** | **%20** | **Pratik uygulama (asagiya yuvarlama)** |

#### F.4.2. Optimal f ve Earnings-Specifik Uyarlamalar

| Piyasa Rejimi | p (Kazanma) | b (R/R) | Kelly (f*) | Yarim Kelly | Earnings IC Boyutu |
|:---|:---|:---|:---|:---|:---|
| **Bull Market** | %75 | 1.0 | %50 | **%25** | Portfoyun %25'i |
| **Correction** | %68 | 0.9 | %47 | **%23** | Portfoyun %23'u |
| **Bear Market** | %60 | 0.8 | %35 | **%17** | Portfoyun %17'si |
| **Crash/VIX>35** | %45 | 0.6 | %12 | **%6** | Portfoyun %6'si veya durdur |

#### F.4.3. Earnings-Specifik Kelly Kurallari

1. **Earnings IC = Yarim Kelly uygula** — Tam Kelly volatiliteyi cok yuksek
2. **Her hisse IC'si = Portfoyun en fazla %5'i** — Tekli hisse konsantrasyon riski
3. **Ayni gun earnings IC sayisi ≤ 3** — Bagimli olay riskini azalt
4. **Kriz donemi (VIX > 30) = Ceyrek Kelly** — Tail risk belirsizligi artar
5. **Ardisik kayip limiti = 3** — Uc ardisik kayiptan sonra 1 hafta dur

---

### F.5. Risk-Neutral Pricing ve Earnings: Q-Measure vs P-Measure

#### F.5.1. Iki Olcum Arasindaki Fark

| Olcum (Measure) | Tanim | Earnings Yorumu |
|:---|:---|:---|
| **P-Measure (Fiziksel)** | Gercek dunya olasiliklari | Earnings "surprise" gerceklesme olasiligi |
| **Q-Measure (Risk-Neutral)** | Arbitraj icermeyen fiyatlama olasiliklari | Opsiyon fiyatlarinin icerdigi "beklenti" |

**Earnings Volatilite Risk Prim (VRP):**

$$
VRP = \sigma_{implied}^Q - \sigma_{realized}^P
$$

Earnings doneminde VRP tipik olarak **pozitif ve buyuktur**:

| Donem | Tipik VRP | Yorum |
|:---|:---|:---|
| Normal (non-earnings) | %2-5 | Standard volatilite risk primi |
| Earnings oncesi 1 hafta | %10-25 | **Earnings volatilite risk primi** |
| Earnings gunu | %20-40 | Maksimum VRP — piyasa "korku" icinde |
| Earnings sonrasi | %0-5 (hizla duser) | IV crush — VRP realize olur |

#### F.5.2. Earnings "Fear Premium"

Earnings doneminde Q-Measure, P-Measure'den sistematik olarak daha yuksek volatilite fiyatlar. Bu fark "fear premium" olarak adlandirilir:

$$
\text{Fear Premium} = \underbrace{\sigma_{IV}}_{\text{Q-Measure}} - \underbrace{\sigma_{HV}}_{\text{P-Measure}}
$$

**Fear Premium ve Earnings Stratejisi:**

| Fear Premium | Stratejik Yorum | Short IC Aksiyonu |
|:---|:---|:---|
| <%10 | Dusuk fear premium — dikkatli ol | Daha dar IC — risk dusuk |
| %10-20 | Normal fear premium | Standard IC — optimal |
| **%20-35** | **Yuksek fear premium** — IV crush potansiyeli yuksek | **Genisletilmis IC — maksimum kazanc** |
| >%35 | Asiri fear premium — hisse cok volatil | Cok genis IC veya **trade yapma** |

#### F.5.3. Q-Measure vs P-Measure ve Earnings IC Kararliligi

Earnings IC stratejisinin basarisi, Q-Measure'deki (fiyatlanan) volatilitenin P-Measure'deki (gerceklesen) volatiliteden sistematik olarak daha yuksek olmasina dayanir:

$$
\mathbb{E}\left[Profit_{IC}\right] = \underbrace{(\sigma_{IV}^2 - \sigma_{RV}^2)}_{\text{VRP Kazanci}} \times \underbrace{\text{Vega Exposure}}_{\text{Short Vega}} - \underbrace{\text{Transaction Costs}}_{\text{Komisyon + Kayma}}
$$

**Earnings IC Basari Kosulu:** σ_IV > σ_RV (fiyatlanan vol > gerceklesen vol)

| Senaryo | σ_IV vs σ_RV | IC Sonucu |
|:---|:---|:---|
| **Earnings "surprise" yok** | σ_IV >> σ_RV | **Karli** — IV crush'dan kazanc |
| **Kucuk earnings move** | σ_IV > σ_RV | **Karli** — VRP realize oldu |
| **Buyuk earnings move** | σ_IV < σ_RV | **Zararli** — hisse wing'i kirip gecti |
| **Extreme earnings move** | σ_IV << σ_RV | **Cok zararli** — tail risk felaketi |

---

### F.6. Akademik Earnings Risk Yonetimi: Entegre Cerceve

#### F.6.1. Earnings Risk Metrikleri Dashboard

| Metrik | Formul/Olcum | Esik Degeri | Aksiyon |
|:---|:---|:---|:---|
| **IV Rank** | Mevcut IV / 52-hafta IV araligi | > %80 | Short vega (IC) firsati |
| **IV Percentile** | Mevcut IV'nin yuzdelik siralamasi | > %90 | Guclu short vega sinyali |
| **IV/RV Orani** | Implied Vol / Realized Vol | > 1.5 | VRP firsati |
| **Fear Premium** | σ_IV - σ_HV | > %20 | Yuksek kazanc potansiyeli |
| **Skew (25D PC)** | 25D Put IV - 25D Call IV | > %15 | Asagi yonlu korku guclu |
| **Term Slope** | IV(30D) - IV(90D) | > %10 (backwardation) | Event volatilitesi yuksek |
| **Kelly Fraksiyonu** | Yarim Kelly | %15-25 | Optimal position size |
| **Max Drawdown ( historic)** | Earnings IC max DD | <%15 | Risk limiti icinde |

#### F.6.2. Akademik Earnings Stratejisi — Tam Checklist

**Earnings IC Acilis Oncesi (Matematiksel Kontroller):**

1. [ ] **Heston Kalibrasyonu:** v₀ > %15 (earnings volatilitesi var mi?)
2. [ ] **IV Rank:** > %80 (yuksek volatilite ortami mi?)
3. [ ] **IV/RV Orani:** > 1.5 (VRP pozitif mi?)
4. [ ] **Fear Premium:** > %10 (fear premium var mi?)
5. [ ] **Kelly Size:** Yarim Kelly ≤ Portfoyun %25'i (position size uygun mu?)
6. [ ] **Skew Analizi:** Wing genisligi skew'e gore ayarlandi mi?
7. [ ] **Jump Risk:** λ_event × σ_jump < Wing Width/2 (sicrama riski wing icinde mi?)
8. [ ] **Term Structure:** Hump var mi? (earnings event volatilitesi dogrulaniyor mu?)
9. [ ] **VIX Hedge:** VIX call spread aktif mi? (portfoy korunuyor mu?)
10. [ ] **Q-Measure Check:** σ_IV > σ_RV (IC kar sarti saglaniyor mu?)

**Earnings Gunu (T+0):**

11. [ ] **Gamma Risk:** Γ < 0.05 (gamma patlamasi riski kontrol altinda mi?)
12. [ ] **Delta Drift:** |Δ| < 0.10 (delta notr korunuyor mu?)

**Earnings Sonrasi (T+1 ila T+3):**

13. [ ] **IV Crush:** IV dustu mu? (%30+ IV dususu beklenir)
14. [ ] **Vega Realizasyonu:** Short vega pozisyonu karli mi?
15. [ ] **Kar Hedefi:** %50 kredi toplandi mi? (erken cikis)
16. [ ] **Pinning Risk:** Hisse strike etrafinda mi takiliyor? (gamma riski)

#### F.6.3. Akademik Earnings Stratejisi Ozet Tablo

| Asama | Temel Model | Ana Metrik | Earnings Stratejisi |
|:---|:---|:---|:---|
| **Volatilite Tahmini** | Heston SV | v₀, κ, ξ, ρ | Kalibrasyon ile earnings vol izole edilir |
| **Fiyatlama** | NIG (Levy) veya VG | RMSE %4.72 | Sicramali earnings fiyatlamasi |
| **Risk Olcumu** | Greeks + Jump-Diffusion | Gamma, Vega, λ | Earnings riski quantifiye edilir |
| **Position Sizing** | Kelly Criterion | f* = %40 (yarim: %20) | Optimal portfoy tahsisi |
| **Fiyatlama Olcumu** | Q-Measure vs P-Measure | VRP, Fear Premium | Short vega kar kosulu saglanir |
| **Risk Yonetimi** | Greeks Dashboard + Skew | IV Rank, Skew, Term | Gercek zamanli risk izleme |



---

## [YENI v4.0 - Akademik] Kaynaklar — Akademik Opsiyon Fiyatlama ve Earnings Stratejileri

### Bolum D — Kaynaklar (Opsiyon Fiyatlama ve Greeks Ileri Analizi)

D1. Nayak, D. (2024). "Extended Black-Scholes Option Pricing with Stochastic Volatility and Stochastic Interest Rates." *Harvard University Working Paper*. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5086365

D2. Vieira, R. (2025). "The Black-Scholes Option Pricing Model: A Comprehensive Analysis." *Independent Research*, April 2025. (BSM, Greeks, Volatility Surface)

D3. Wilmott, P., Dewynne, J., & Howison, S. (1994). *Option Pricing: Mathematical Models and Computation*. Oxford Financial Press.

D4. Hull, J. (2018). *Options, Futures, and Other Derivatives* (10th Edition). Pearson.

D5. Wilson, A. (2024). "Stochastic Calculus and Arbitrage-Free Options Pricing." *University of Chicago Research Paper*. https://math.uchicago.edu/~may/REU2024/REUPapers/Wilson,Ari.pdf

D6. Popoola O.E. & Kehinde-Dada O.V. (2024). "Stochastic Calculus and Its Impact On Analyzing Option Pricing." *International Journal of Mathematics and Statistics Studies*, 12(3), 1-16. doi: 10.37745/ijmss.13/vol12n3116

---

### Bolum E — Kaynaklar (Ileri Opsiyon Fiyatlama Modelleri)

E1. Cao, Z. (2024). "Stochastic Calculus for Option Pricing with Convex Duality, Logistic Model, and Numerical Examination." *University of Washington Working Paper*. https://arxiv.org/abs/2408.05672

E2. Li, J. (2026). "A Quantum Mechanics Approach to Option Pricing." *Sun Yat-Sen University*. https://arxiv.org/abs/2601.00293

E3. **Benchmark Raporu (2026).** "13 Opsiyon Fiyatlama Modeli Karsilastirmasi: NIG, Quantum/PCE, VG, Rough Heston, Heston, DML Heston, PIDE+DL, Kaba Heston CPDE, Deep WMC+VAE, Stacked MC, GH-Willow Tree, Convex Duality, Quantum LP." *Internal Research Report*.

E4. **Derleme Raporu (2026).** "Opsiyon Fiyatlama: 13 Makale Derlemesi — Heston Modeli, Levy Surecleri, Monte Carlo, Quantum Yaklasimlari, Convex Duality." Perplexity Computer Research.

E5. Kyprianou, A.E., Schoutens, W., & Wilmott, P. (Eds.) (2005). *Exotic Option Pricing and Advanced Levy Models*. John Wiley & Sons. ISBN: 978-0-470-01684-8

E6. Heston, S. (1993). "A Closed-Form Solution for Options with Stochastic Volatility with Applications to Bond and Currency Options." *Review of Financial Studies*, 6(2), 327-343.

E7. Sridi, A. & Bilokon, P. (2023). "Applying Deep Learning to Calibrate Stochastic Volatility Models." https://arxiv.org/abs/2309.07843

E8. Cao, Z. & Lin, X. (2024). "Theoretical and Empirical Validation of Heston Model." https://arxiv.org/abs/2409.12453

E9. Rosenbaum, M. & Zhang, J. (2021). "Deep Calibration of the Quadratic Rough Heston Model." https://arxiv.org/abs/2107.01611

E10. Jacquier, A. & Oumgari, M. (2019/2023). "Deep Curve-dependent PDEs for Affine Rough Volatility." https://arxiv.org/abs/1906.02551

E11. Ano, K. & Ivanov, R.V. (2018). "Option Pricing in Time-Changed Levy Models with Compound Poisson Jumps." *Modern Stochastics: Theory and Applications*, doi:10.15559/18-VMSTA124

E12. Georgoulis, E.H., Papapantoleon, A., & Smaragdakis, C. (2024). "A Deep Implicit-Explicit Minimizing Movement Method for Option Pricing in Jump-Diffusion Models." https://arxiv.org/abs/2401.06740

E13. Kang, C., Wu, H., & Zhou, Z. (2023). "Option Pricing by Willow Tree Method for Generalized Hyperbolic Levy Processes." *Journal of Mathematics*, doi:10.1155/2023/9996556

E14. Kunsagi-Mate, S., Fath, G., Csabai, I., & Molnar-Saska, G. (2022). "Deep Weighted Monte Carlo: A Hybrid Option Pricing Framework Using Neural Networks." https://arxiv.org/abs/2208.14038

E15. Jacquier, A., Malone, E.R., & Oumgari, M. (2019). "Stacked Monte Carlo for Option Pricing." https://arxiv.org/abs/1903.10795

E16. Gonzalez-Conde, J., Rodriguez-Rozas, A., Solano, E., & Sanz, M. (2021/2024). "Efficient Hamiltonian Simulation for Solving Option Price Dynamics." *Physical Review Research*, 5, 043220.

E17. Luongo, A., Cheng, B., Rebentrost, P., Bosch, S., & Lloyd, S. (2024). "Quantum Computational Finance for Martingale Asset Pricing in Incomplete Markets." *Scientific Reports*, 14:18941.

E18. Carr, P. & Madan, D. (1999). "Option Valuation Using the Fast Fourier Transform." *Journal of Computational Finance*, 2(4), 61-73.

E19. Carr, P. & Torricelli, L. "Convex Duality in Continuous Option Pricing Models." (Cao 2024'te referans alinmistir.)

E20. Merton, R. (1976). "Option Pricing When Underlying Stock Returns Are Discontinuous." *Journal of Financial Economics*, 3(1-2), 125-144.

E21. Madan, D. & Seneta, E. (1990). "The Variance Gamma (V.G.) Model for Share Market Returns." *Journal of Business*, 63(4), 511-524.

E22. Barndorff-Nielsen, O.E. (1997). "Normal Inverse Gaussian Distributions and Stochastic Volatility Modelling." *Scandinavian Journal of Statistics*, 24(1), 1-13.

E23. Gatheral, J. (2006). *The Volatility Surface: A Practitioner's Guide*. Wiley Finance.

---

### Bolum F — Kaynaklar (Akademik Earnings Stratejileri ve Risk Yonetimi)

F1. **Benchmark Raporu (2026).** "13 Model Benchmark Karsilastirmasi: NIG En Iyi RMSE %4.72." *Internal Research Report*.

F2. Fidelity Brokerage Services (2015). "Introduction to Options -- The Basics." Fidelity Webinar, Dec. 8, 2015.

F3. Saxo Bank (2016). "Stock Options Guidebook: Learn How Stock Options Could Enhance and Protect Your Portfolio."

F4. Kelly, J.L. (1956). "A New Interpretation of Information Rate." *Bell System Technical Journal*, 35(4), 917-926.

F5. Black, F. & Scholes, M. (1973). "The Pricing of Options and Corporate Liabilities." *Journal of Political Economy*, 81(3), 637-654.

F6. Merton, R. (1973). "Theory of Rational Option Pricing." *Bell Journal of Economics and Management Science*, 4(1), 141-183.

F7. Dupire, B. (1994). "Pricing with a Smile." *Risk*, 7(1), 18-20.

F8. Cont, R. (2001). "Empirical Properties of Asset Returns: Stylized Facts and Statistical Issues." *Quantitative Finance*, 1(2), 223-236.

F9. Schoutens, W. (2003). *Levy Processes in Finance: Pricing Financial Derivatives*. John Wiley & Sons.

F10. Cont, R. & Tankov, P. (2004). *Financial Modelling with Jump Processes*. Chapman & Hall/CRC.

F11. Bertoin, J. (1996). *Levy Processes*. Cambridge University Press.

F12. Sato, K. (1999). *Levy Processes and Infinitely Divisible Distributions*. Cambridge University Press.

F13. Applebaum, D. (2004). *Levy Processes and Stochastic Calculus*. Cambridge University Press.

---

### [YENI v4.0] Genel Akademik Kaynaklar

A1. Gatheral, J. (2006). *The Volatility Surface: A Practitioner's Guide*. Wiley Finance.

A2. Natenberg, S. (2015). *Option Volatility and Pricing: Advanced Trading Strategies and Techniques* (2nd Edition). McGraw-Hill Education.

A3. Wilmott, P. (2006). *Paul Wilmott on Quantitative Finance* (3 Volume Set). John Wiley & Sons.

A4. Shreve, S.E. (2004). *Stochastic Calculus for Finance I & II*. Springer.

A5. Musiela, M. & Rutkowski, M. (2005). *Martingale Methods in Financial Modelling* (2nd Edition). Springer.

A6. Carr, P. & Madan, D. (1999). "Option Valuation Using the Fast Fourier Transform." *Journal of Computational Finance*, 2(4), 61-73.

A7. Madan, D., Carr, P., & Chang, E. (1998). "The Variance Gamma Process and Option Pricing." *European Finance Review*, 2, 79-105.

A8. Eberlein, E. (2001). "Application of Generalized Hyperbolic Levy Motions to Finance." In *Levy Processes: Theory and Applications*, Birkhauser.

A9. Schoutens, W., Simons, E., & Tistaert, J. (2004). "A Perfect Calibration! Now What?" *Wilmott Magazine*, March 2004.

A10. Albrecher, H. & Schoutens, W. (2005). "Static Hedging of Asian Options under Stochastic Volatility Models using Fast Fourier Transform." In Kyprianou, Schoutens & Wilmott (Eds.), *Exotic Option Pricing and Advanced Levy Models*.

---

*Bu dokumanin v4.0 akademik bolumleri, yukarida belirtilen kaynaklardan derlenen akademik bulgulari icerir. Tum formuller ve modeller ilgili akademik makalelerden alinmistir.*

**Versiyon Gecmisi:**
- v1.0 — EarningsPlay temel strateji dokumani
- v2.0 — 2025 guncellemesi (Greeks Dashboard, UOA, PEAD modulleri)
- v3.0 — VIX + Earnings Kombinasyon, Sentiment + Earnings, Senaryo Bazli Earnings Stratejisi modulleri eklendi
- **v4.0 — Akademik Opsiyon Fiyatlama Modelleri (BSM, Extended BSM, Heston, Levy, Monte Carlo, Convex Duality, Quantum), Greeks Ileri Analizi, Akademik Earnings Stratejileri ve Risk Yonetimi modulleri eklendi**


---

*Bu dokuman egitim ve arastirma amaclidir. Finansal tavsiye niteligi tasimaz. Gecmis performans gelecek performansin gostergesi degildir. Opsiyon ticareti yuksek risk icerir ve tum sermayenizi kaybetme riski vardir.*

