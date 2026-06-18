# HAZİRAN 2026 EARNINGS OPSİYON STRATEJİ RAPORU — GÜNLÜK PROJEKSİYON v3.1
## GunlukMomentum v4 + EarningsPlay v4 Metodolojisi | 8 Haziran 2026
## Earnings Gunune Kadar Gunluk Projeksiyon

> **YASAL UYARI:** Bu rapor yalnizca egitim ve arastirma amaclidir. Finansal tavsiye niteliginde degildir. Hisse senedi ve opsiyon ticareti yuksek risk icerir ve yatirimcilarin tum sermayesini kaybetmesine neden olabilir. Yatirim karari almadan once profesyonel danismana basvurunuz.

> **RAPOR VERSIYONU:** v3.1 Gunluk Projeksiyon | **Onceki Rapor:** v3.0 (7 Haziran 2026) | **Degisiklik:** 9 kesin duzeltme uygulandi (ADBE gelir/EPS, CEO gecis sureci, CHWY short interest/EPS, takvim hatalari) | **Son Inceleme:** 8 Haziran 2026 — Tam onayli

---

## HIZLI ERISIM OZETI (Executive Summary)

| Metrik | Deger |
|--------|-------|
| **Analiz Tarihi** | 7 Haziran 2026 Pazar |
| **Piyasa Rejimi** | SARI (VIX 21.51) |
| **VIX Renk Kodu** | KIRMIZI'ya yakin (21.51 -> 22+ sari-kirmizi gecis) |
| **Pozisyon Buyuklugu** | %75 (SARI rejim) |
| **En Yakin Earnings** | ORCL & CHWY (10 Haziran — 3 gun) |
| **Kritik Gun** | 10 Haziran (CPI + CHWY BMO + ORCL AMC) |
| **Analiz Edilen Hisse** | 5 (ORCL, ADBE, CHWY, FDX, MU) |
| **Toplam Earnings** | 5 sirket, 8-30 Haziran araligi |

### Bu Haftanin 5 Kritik Karari (Gunluk Projeksiyonlu)

| Gun | Hisse | Strateji | Karar | Zaman |
|-----|-------|----------|-------|-------|
| 8 Haz | ORCL | Strangle biriktir | AL | 9:45-10:30 ORB |
| 8 Haz | CHWY | OTM call biriktir | AL | 13:00-14:30 |
| 9 Haz | CHWY | Kapanista ana pozisyon | AL (SON GUN) | 15:30-16:00 |
| 9 Haz | ORCL | %50 kar kontrolu | KAR AL | 10:00-11:00 |
| 10 Haz | ORCL | CPI sonrasi yeni pozisyon | AL | 15:30-16:00 |
| 10 Haz | CHWY | Gap acilista kar realizasyonu | CIK | 09:30-10:00 |
| 11 Haz | ORCL | IV crush'tan kazan | SHORT | 09:45-10:30 |
| 11 Haz | ADBE | Earnings AMC | AL/BEKLE | 15:30-16:00 |

### 5 Hisse Ozet Tablosu

| Hisse | Fiyat | Earnings | Kalan Gun | IV30 | IV Rank | Katalist | Ana Strateji |
|-------|-------|----------|-----------|------|---------|----------|-------------|
| **ORCL** | $213.68 | 10 Haz AMC | 3 | %45 | %83 | 4/5 | Long Straddle / Call Spread |
| **CHWY** | $20.64 | 10 Haz BMO | 3 | %55 | %90 | 5/5 Squeeze | Long Call Spread 22/28 |
| **ADBE** | $251.44 | 11 Haz AMC | 4 | %62 | %100 | 4/5 | Iron Condor 230/275 |
| **FDX** | $331.00 | 23 Haz AMC | 16 | %38 | %76 | 3/5 | Iron Condor 300/365 |
| **MU** | $864.01 | 24 Haz AMC | 17 | %58 | %100 | 3/5 | Iron Condor 735/995 |

### EarningsPlay v4 Uyum Kontrol Listesi — Genel

| Kural | Durum | Aksiyon |
|-------|-------|---------|
| IV Rank >%50 (IC icin) | ✅ Tum hisselerde saglaniyor | IC stratejileri aktif |
| VIX <35 | ✅ 21.51 — Uygun | %75 normal pozisyon (SARI) |
| %50 kar kurali (mekanik) | ✅ Tum stratejilerde uygulanacak | Kar al: Toplanan kredinin %50'si |
| 21 DTE kurali (mekanik) | ⚠️ Mevcut durum 0-17 DTE | Gamma riski degisken |
| Wing width = Fiyat/10 | ✅ Tum IC onerilerinde hesaplandi | Otomatik uygula |
| Max loss = 2.0x kredi | ✅ Tum IC onerilerinde | Stop-loss mekanik |
| Delta toleransi ±0.10 | ✅ Greeks analizinde kontrol edildi | Hedge gerekirse |
| Pozisyon = Hesabin %1-2'si | ✅ Butce tablolarinda belirtildi | Asla asma |

---

## BOLUM 1: 5 HAZiRAN ANALiZi (NFP SOKU GUNU)

### 1.1 Piyasa Nasil Buraya Geldi?

5 Haziran 2026 Cuma gunu, ABD tarim disi istihdam verisi (NFP) +172K ile ciddi bir sok yaratti. Beklenti +80K iken, gerceklesme beklentinin iki katindan fazla geldi. Bu "sicak" is piyasasi verisi:

- **Fed faiz indirimi beklentilerini erteledi** — Piyasa Temmuz/Eylul'e cevirdi
- **10Y Treasury yield +10bp yukseldi** — 4.52% seviyesine cikti
- **DXY guclendi** — 100.07 seviyesi
- **Tech sektoru sert satti** — Buyume hisselerine ilgi azaldi

### 1.2 NFP Etkisi

| Piyasa | Kapanis | Degisim | Neden |
|--------|---------|---------|-------|
| **S&P 500** | 7,384 | **-2.64%** | Genel risk-off, faiz baskisi |
| **Nasdaq** | 25,709 | **-4.18%** | Tech cokusu, buyume hisseleri |
| **VIX** | 21.51 | **+%39.7** | Korku patlamasi |
| **ORCL** | $213.68 | **-9.59%** | Capex $50B endisesi + tech satti |
| **ADBE** | $251.44 | **-2.71%** | CEO gecis sureci + tech baskisi |
| **CHWY** | $20.64 | **-0.86%** | Dusuk fiyatli, nispeten dayanikli |
| **FDX** | $331.00 | **+0.91%** | Defansif, spinoff destegi |
| **MU** | $864.01 | **-13.25%** | Beta 2.17 ile cifte etki |

### 1.3 VIX Rejim Degisimi

NFP oncesi VIX ~15.40 (YESIL rejim) iken, NFP sonrasi **21.51 (SARI rejim)** oldu:

```
YESIL (%100 pozisyon)    SARI (%75 pozisyon)    KIRMIZI (%50 pozisyon)
   |<------ 15.40 ---->|<---- 21.51 ---->|<-------- 25+ -------->|
                        ↑ BURADAYIZ

VIX 22+ = KIRMIZI'ya gecis baslar -> Pozisyon %50'ye duser
VIX 25+ = Tam KIRMIZI -> Maksimum %25 pozisyon
```

### 1.4 Earnings Hisselerinin 5 Haziran Performansi

**ORCL (-%9.59):** En cok etkilenen hisselerden biri. AI Data Center capex $50B endisesi zaten baskiydi, NFP tech satisiyla cakisti. Ancak bu dusus = daha ucuz giris. RPO $553B rekor, Cloud IaaS %84 buyume, Cantor Fitzgerald $284 hedefi (5 Haziran'da yukseltilmis) hala gecerli. **Katalist skoru hala 4/5.**

**ADBE (-%2.71):** Tech satisindan etkilendi ama $25B buyback destegi var. P/E 14.66 tarihi dip. IV %100 = opsiyonlar cok pahali. **Long Straddle KACINILMALI.** Iron Condor veya Long Call Spread tercih.

**CHWY (-%0.86):** En dayanikli hisse. Dusuk fiyatli ve short squeeze potansiyeli korunuyor. Short interest son rapora gore %26.01 artis = squeeze icin barut fisi yakiliyor. **Katalist skoru 5/5 (en yuksek).**

**FDX (+%0.91):** Tek yukselen hisse. Freight spinoff $4.1B nakit, JPM $460 hedefi destekliyor. RSI 71.2 asiri alim ama momentum guclu. Spinoff sonrasi range-bound beklentisi.

**MU (-%13.25):** En sert dusus. Beta 2.17'nin etkisiyle Nasdaq %4 duserken MU %13.25 dustu. 2 gunde toplam -%19. NVIDIA HBM onayi haberi pozitif ama degerleme endiseleri (Morningstar $455 adil deger) agir basiyor.

---

## BOLUM 2: PIYASA BAGLAMI VE REJIM TESPITI

### 2.1 Makro Gostergeler

| Gosterge | Deger | Bir Onceki | Degisim | Trend | Earnings Etkisi |
|----------|-------|-----------|---------|-------|-----------------|
| **VIX** | 21.51 | 15.40 | +39.7% | Yukseliyor (Endise) | Volatilite artiyor = primler pahali |
| **Fear & Greed Index** | 57 | 69 | -12 puan | Notur/Greed siniri | Notur sentiment |
| **10Y Treasury Yield** | 4.54% | 4.48% | +6 bps | Yukseliyor | Faiz baskisi |
| **DXY (US Dollar Index)** | 100.07 | 99.41 | +0.66% | Gucleniyor | Dolar gucleniyor = ihracatci baski |
| **Put/Call Ratio (Equity)** | 0.67 | 0.44 | -- | Notur-Bullish | Hafif bullish egilim |
| **HY Credit Spreads (OAS)** | 275 bps | 272 bps | +3 bps | Dusuk/Siki | Kredi piyasasi saglikli |
| **S&P 500** | 7,384 | 7,584 | -2.64% | 200MA ustunde (7,350) | Trend korunuyor |

### 2.2 Piyasa Rejimi Tespiti

| Gosterge | Deger | Esik | Yon | Puan |
|----------|-------|------|-----|------|
| VIX | 21.51 | <14 Bullish, >25 Bearish | 14-25 arasi (SARI) | NOTUR |
| SPX/200MA | 7,384 / 6,854 | Uzerinde Bullish | UZERINDE | BULLISH |
| 10Y Yield | 4.54% | <3.75% Bull, >4.75% Bear | 3.75-4.75 arasi | NOTUR |
| DXY | 100.07 | Zayiflayan Bull, Guclenen Bear | Gucleniyor | BEARISH |
| HY Spread | 275 bps | <300 bps Bull, >500 bps Bear | <300 | BULLISH |
| Put/Call Ratio | 0.67 | <0.72 Bull, >1.23 Bear | <0.72 | BULLISH |
| S&P 500 Trend | 7,384 | 50MA uzeri mi? | UZERINDE | BULLISH |

**PIYASA REJIMI: SARI (Risk-On Gecis / VIX 21.51)**

- **Bullish sinyaller (4):** SPX 200MA uzerinde, kredi spreadleri dar, Put/Call orani dusuk, trend yukari
- **Notur sinyaller (2):** VIX notur, 10Y Yield notur bandinda
- **Bearish sinyaller (1):** Dolar gucleniyor
- **Pozisyon Buyuklugu:** SARI rejim = %75 normal pozisyon

### 2.3 VIX Renk Kodu ve Pozisyon Buyuklugu

| VIX Degeri | Renk | Pozisyon | Etki |
|------------|------|----------|------|
| <15 | Yesil | %100 | IV dusuk = ucuz prim |
| 15-22 | Sari | %75 | Normal rejim |
| 22-25 | Sari-Kirmizi | %50 | Kirmizi'ye yakin, azalt |
| 25-30 | Kirmizi | %25 | Yuksek volatilite |
| >30 | Siyah | %0-10 | Kriz modu |

**Mevcut:** VIX 21.51 → **SARI, %75 pozisyon**

### 2.4 Jeopolitik Riskler

| Risk | Olasilik | Etki | Piyasa Etkisi |
|------|----------|------|---------------|
| Iran catsmasinin uzamasi | Orta | Yuksek | VIX yukselir, enerji rallisi |
| Fed faiz artirimi | Orta | Yuksek | Tahvil satisi, hisse baskisi |
| Petrol soku | Orta | Yuksek | Enflasyon, stagflasyon riski |
| Buyuk teknoloji duzeltmesi | Dusuk-Orta | Orta | Nasdaq baskisi |

### 2.5 Kritik Makro Veri Takvimi (Cakismalar)

| Tarih | Saat (ET) | Veri | Onem | Beklenti | Earnings Etkisi |
|-------|-----------|------|------|----------|-----------------|
| 9 Haz Sal | 8:30 | Ticaret Dengesi | Orta | -$56B | -- |
| **10 Haz Car** | **8:30** | **CPI (Mayis)** | **COK YUKSEK** | %4.2 yillik | 🔴 ORCL & CHWY ile cakisyor! |
| **11 Haz Per** | **8:30** | **PPI (Mayis)** | **YUKSEK** | +0.6% | 🟡 ADBE oncesi etki |
| **17 Haz Car** | **14:00** | **FOMC Karari** | **COK YUKSEK** | Degisiklik yok | 🟡 FDX/MU oncesi volatilite |
| 17 Haz Car | 14:30 | **Fed Baskani Basin Top.** | **COK YUKSEK** | -- | -- |
| 19 Haz Cum | -- | **Juneteenth Tatili** | -- | Piyasalar kapali | -- |

> ⚠️ **10 HAZiRAN UCLU VOLATiLiTE UYARISI:** CPI (8:30 AM) + CHWY earnings (BMO) + ORCL earnings (AMC) ayni gun! Bu nadir kombinasyon hem yuksek firsat hem de yuksek risk tasir. EarningsPlay kurali: Pozisyonu %50'ye indir.

---

## BOLUM 3: HAZiRAN 2026 EARNINGS TAKViMi

### 3.1 Haftalik Yogunluk Ozeti

| Hafta | Tarih Araligi | Earnings Sayisi | Trend | Onemli Sirketler |
|-------|---------------|-----------------|-------|-----------------|
| Hafta 1 | 8-12 Haziran | ~103 | 🔴 Yogun | ORCL, ADBE, CHWY |
| Hafta 2 | 15-19 Haziran | ~30 | 🟩 Sakin | -- |
| Hafta 3 | 22-26 Haziran | ~38 | 🟩 Orta | MU, FDX, BB |

### 3.2 Sektör Dagilimi

| Sektor | Sirket Sayisi | Ornekler |
|--------|--------------|----------|
| Technology / Software | 6 | ORCL, ADBE, BB, CHWY |
| Semiconductors | 1 | MU |
| Transportation / Logistics | 1 | FDX |
| Consumer / Retail | 3 | CHWY, LEN, DRI |
| Financial Services | 2 | PAYX, JEF |

### 3.3 Odak Hissele — Detayli Takvim

| Hisse | Sirket | Sektor | Earnings | Saat | Piyasa Degeri | Onem | Kalan Gun |
|-------|--------|--------|----------|------|---------------|------|-----------|
| **ORCL** | Oracle Corp | Software | 10 Haziran Carsamba | AMC | ~$615B | ⭐⭐⭐⭐⭐ | **3 gun** |
| **CHWY** | Chewy Inc | E-commerce | 10 Haziran Carsamba | BMO | ~$8.4B | ⭐⭐⭐⭐ | **3 gun** |
| **ADBE** | Adobe Inc | Software | 11 Haziran Persembe | AMC | ~$102B | ⭐⭐⭐⭐⭐ | **4 gun** |
| **FDX** | FedEx Corp | Logistics | 23 Haziran Sali | AMC | ~$81B | ⭐⭐⭐⭐ | 16 gun |
| **MU** | Micron Tech | Semiconductors | 24 Haziran Carsamba | AMC | ~$825B | ⭐⭐⭐⭐⭐ | 17 gun |

### 3.4 Kritik Makro Veri Cakismalari

```
8 Haziran:  NFP sonrasi 1. islem gunu (teknik donus potansiyeli)
9 Haziran:  Son islem gunu (ORCL/CHWY icin) - CHWY kapanista pozisyon AL
10 Haziran: CPI (8:30) + CHWY BMO earnings + ORCL AMC earnings = UCLU VOLATILITE
11 Haziran: PPI (8:30) + ADBE AMC earnings = CIFT VOLATILITE
12 Haziran: IV Crush gunu (ORCL/CHWY) - Opsiyon satma firsati
17 Haziran: FOMC karari + Powell basin toplantisi
19 Haziran: Juneteenth (piyasalar kapali)
23 Haziran: FDX earnings AMC
24 Haziran: MU earnings AMC
```

### 3.5 Katalist Gucu Skoru Tablosu (Tum Hissele)

| Hisse | Skor | Ana Katalist | Karsit Kuvvet | Yon Bias | EarningsPlay Aksiyon |
|-------|------|-------------|--------------|----------|---------------------|
| **ORCL** | **4/5** | Cantor $284, RPO $553B, Cloud %84 | Capex $50B endisesi | Bullish | Long Straddle / Call Spread |
| **ADBE** | **4/5** | $25B buyback, P/E 14.66 | CEO gecis sureci, AI rekabeti | Bullish | Long Call Spread / IC |
| **CHWY** | **5/5** | SI +%26.01, DTC 3.42, %88 pot. | Q4 hatasi, dusus trendi | Cok Bullish | Long Call / Call Spread |
| **FDX** | **3/5** | Spinoff $4.1B, JPM $460 | RSI 71, yakit %50 | Notur/Range | Iron Condor / Strangle |
| **MU** | **3/5** | NVIDIA HBM onayi, $1,100 hedef | Morningstar $455, Beta 2.17 | Notur/Volatile | Iron Condor FAVORI |


---

## BOLUM 4: GUNLUK PROJEKSIYON — ORCL & CHWY (10 Haziran Earnings)

### 4.1 ORCL ($213.68) — 10 Haziran AMC — 3 Gun Kaldi

#### 4.1.1 Sirket Profili ve Katalist Ozeti

| Ozellik | Deger | EarningsPlay Notu |
|---------|-------|-------------------|
| Fiyat | $213.68 (-9.59% gunluk) | NFP sonrasi dusus = ucuz giris |
| Piyasa Degeri | $614.5B | Mega cap = likidite yuksek |
| Sektor | Technology / Software | AI altyapisi talebi destekli |
| Beta | 1.65 | Volatilite yuksek |
| 50MA | $179.43 (Uzerinde) | Teknik destek |
| 200MA | $206.95 (Uzerinde) | Guclu destek |
| RSI(14) | 58.0 (Notur) | Notur bolge = esnek |
| IV Rank | %82.8 (Cok Yuksek) | IC uygun |
| IV30 | %45.0 | Earnings oncesi yukselis |
| ATR(14) | $12.91 | Gunluk volatilite ~$13 |
| Beklenen Hareket (EM) | ~%7.5 (~$16) | Wing genisligi referansi |
| EPS Tahmini | $1.96 | Beat potansiyeli yuksek |
| Gelir Tahmini | $19.1B | RPO $553B destekli |

**Katalist Ozeti:**
- ✅ Cantor Fitzgerald: Hedef $229→$284 (5 Haziran) — Cok Pozitif
- ✅ RPO $553B Rekor — Musteri talebi cok guclu
- ✅ Cloud IaaS %84 YoY buyume ($4.9B) — AI talebi
- ⚠️ Capex $50B endisesi — Marj/FCF baskisi
- ✅ FY27 Revenue Guidance $90B yukseltildi

**ORCL Katalist Skoru: 4/5 (Guclu)** → Long Straddle / Call Spread

---

#### 4.1.2 8 Haziran Pazartesi Projeksiyonu (3 gun kaldi)

**Acilis Beklentisi:** $209.50 - $212.00 (Overnight gap riski: Orta)

##### Fiyat Projeksiyonu

| Senaryo | Fiyat | Olasilik | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $214.50 | %30 | NFP sonrasi teknik donus, dip alimlari, VIX sakinlesmesi |
| Base | $211.50 | %45 | Yatay-dar bant konsolidasyonu, hacim dususu |
| Bear | $207.00 | %25 | Cuma satisi devami, DXY guclulugu, tech risk-off |

**Teknik Seviyeler:**
- Destek 1: $208.00 (200MA yakini)
- Destek 2: $205.00 (Cuma dip seviyesi)
- Direnc 1: $213.00 (PSY seviye)
- Direnc 2: $216.00 (Cuma acilis)

##### IV Projeksiyonu

| Metrik | Deger | Degisim | Yorum |
|--------|-------|---------|-------|
| IV30 | %47.0 | +2.0pp | NFP sonrasi IV base yuksek |
| IV Rank | %84 | +1pp | Earnings'e yaklastikca yukselis |
| IV Skew | Cagri tarafli | -- | Short-covering + earnings beklentisi |
| 12 Haziran IV | %52 | +7pp | Earnings haftasi yaklasimi |

##### Opsiyon Prim Projeksiyonu (12 Haziran Vadeli)

| Tip | Strike | Mevcut Prim | Gunluk Theta | 8 Haziran Projeksiyon |
|-----|--------|-------------|--------------|----------------------|
| Call (ITM) | $200 | $18.50 | -$1.45 | $17.80 |
| Call (ATM) | $210 | $14.20 | -$1.60 | $14.50 (IV ramp-up) |
| Call (OTM) | $220 | $10.50 | -$1.35 | $11.20 |
| Put (ATM) | $210 | $13.80 | -$1.55 | $13.50 |
| Put (OTM) | $200 | $9.20 | -$1.10 | $8.80 |

##### Greeks Projeksiyonu (Gun Sonu)

| Greek | Deger | Degisim | Risk |
|-------|-------|---------|------|
| Delta (ATM C) | 0.55 | +0.02 | Hafif ITM kayma |
| Delta (ATM P) | -0.45 | -0.02 | OTM kayma |
| Theta (ATM C) | -$1.60 | -$0.30 | Earnings yaklastikca hizlaniyor |
| Theta (ATM P) | -$1.55 | -$0.25 | -- |
| Vega (ATM) | $0.28 | +$0.03 | IV artisina duyarlilik yukseliyor |
| Gamma (ATM) | 0.018 | +0.002 | Spot yaklastikca gamma riski artiyor |

##### ORB Seviyeleri, VWAP, Bantlari

**ORB Seviyeleri:**
- ORB High: $212.80 (Spot + %0.6)
- ORB Low: $209.20 (Spot - %1.0)
- ORB Breakout: $212.80 uzeri long, $209.20 alti short

**VWAP Projeksiyonu:**
- VWAP Tahmini: $210.80
- +1σ: $213.40 | +2σ: $216.00
- -1σ: $208.20 | -2σ: $205.60

##### Strateji: Ne Zaman Gir, Ne Zaman Cik

**Acilis (9:30-9:45):** BEKLE — NFP sonrasi acilis kaosu, gap dolgu riski %65

**9:45-10:30 ORB Penceresi:**
- ORB yukari kirilim ($212.80+) → Long Call 220C veya 210/220 Call Spread
- ORB asagi kirilim ($209.20-) → Long Put 205P veya Fade
- Gap dolgu bittiyse ORB takip et

**10:30-11:30 VWAP Bounce:**
- VWAP ($210.80) testinde bounce → Long (hacim onayli)
- VWAP reject → Short

**13:00-14:30 Earnings Biriktirme:**
- 210 Straddle veya 200/220 Strangle pozisyonlari acma gunu
- IV hala yukselmeden giris firsati

**15:45 Gun Sonu:** 0DTE varsa %100 KAPAT

##### EarningsPlay Kontrol Listesi — 8 Haziran

- [x] IV Rank >%50 (%84 ✅)
- [x] Pre-earnings momentum: Cuma %9.6 dusus sonrasi donus potansiyeli
- [ ] 21 DTE kontrolu — 12 Haziran vadeli (4 DTE ⚠️)
- [ ] %50 kar kurali — Henuz pozisyon yok
- [ ] Delta toleransi ±0.10 — Straddle delta ~0
- [ ] VIX < 25? → 21.51 ✅ SARI rejim

---

#### 4.1.3 9 Haziran Sali Projeksiyonu (2 gun kaldi)

**Acilis Beklentisi:** $211.00 - $214.00
**8 Haziran Varsayimi:** Base senaryo ($211.50) gerceklesti

##### Fiyat Projeksiyonu

| Senaryo | Fiyat | Olasilik | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $215.50 | %35 | Earnings oncesi pozisyon biriktirme, IV ramp-up alimlari |
| Base | $212.80 | %40 | Son dakika konsolidasyonu |
| Bear | $209.00 | %25 | Kar realizasyonu, son dakika satislari |

**Teknik Seviyeler:**
- Destek 1: $210.50
- Destek 2: $208.00 (200MA)
- Direnc 1: $214.00
- Direnc 2: $216.50

##### IV Projeksiyonu

| Metrik | Deger | Degisim | Yorum |
|--------|-------|---------|-------|
| IV30 | %49.0 | +2.0pp | Earnings'e 2 gun — hizlaniyor |
| IV Rank | %86 | +2pp | Yukari trend suruyor |
| 12 Haziran IV | %56 | +7pp | Earnings haftasi — maksimum IV |

##### Opsiyon Prim Projeksiyonu

| Tip | Strike | 8 Haz Prim | Gunluk Theta | 9 Haz Projeksiyon |
|-----|--------|-----------|--------------|-------------------|
| Call (ITM) | $200 | $17.80 | -$1.80 | $17.50 |
| Call (ATM) | $210 | $14.50 | -$1.95 | $14.80 (IV ramp-up) |
| Call (OTM) | $220 | $11.20 | -$1.65 | $12.00 |
| Put (ATM) | $210 | $13.50 | -$1.85 | $13.20 |
| Put (OTM) | $200 | $8.80 | -$1.35 | $8.50 |

##### Greeks Projeksiyonu (Gun Sonu)

| Greek | Deger | Degisim | Risk |
|-------|-------|---------|------|
| Delta (ATM C) | 0.57 | +0.02 | ITM derinlesiyor |
| Theta (ATM C) | -$1.95 | -$0.35 | **Hizlaniyor — son 2 gun kritik** |
| Theta (ATM P) | -$1.85 | -$0.30 | -- |
| Vega (ATM) | $0.22 | -$0.06 | Time decay vega'yi eritiyor |
| Gamma (ATM) | 0.022 | +0.004 | **Yuksek gamma — pin riski artiyor** |

> ⚠️ **UYARI:** Theta decay 9 Haziran itibariyla **2x hizlaniyor**. Earnings'e 2 gun kala gunluk kayip ~$2.00/opsiyon.

##### ORB/VWAP/Momentum

**ORB Seviyeleri:**
- ORB High: $213.60 | ORB Low: $211.20
- ORB Breakout: $213.60 uzeri long

**VWAP Projeksiyonu:**
- VWAP Tahmini: $212.80
- +1σ: $215.00 | +2σ: $217.20
- -1σ: $210.60 | -2σ: $208.40

**Strateji:**
- Gap acilirsa %50 kapat, ORB onayi bekle
- Eger 8 Haziran'da pozisyon acildiysa: **%50 kar realizasyonu gunu**
- Yeni pozisyon: 210/220 Call Spread veya 210 Straddle (son gun girisi)
- **10 Haziran sabah:** CPI sonrasi ORCL pozisyonu acilabilir (AMC)
- 0DTE uygun: ✅ (12 Haziran vadeli 0DTE/1DTE karakteristigi)

##### EarningsPlay Kontrol Listesi — 9 Haziran

- [x] IV Rank >%50 (%86 ✅)
- [ ] 21 DTE — 12 Haziran vadeli (3 DTE ⚠️ **Riskli**)
- [ ] **%50 kar kurali** — Eger acik pozisyon varsa BUGUN %50 kar al
- [x] Delta toleransi ±0.10 — Straddle delta ~0
- [ ] Pozisyon acik mi? — Varsa bugun kapanista yarisi kapat

---

#### 4.1.4 10 Haziran Carsamba Projeksiyonu (EARNINGS GUNU + CPI)

**⚠️ KRITIK UYARI:** ORCL AMC + CPI ayni gun! **10 Haziran kapanista** pozisyon acilabilir.

**Gun Akisi (Zaman Cizelgesi):**
```
06:00 AM — Pre-market acilis (Futures etkin)
08:30 AM — CPI ACIKLAMASI (Beklenti: %4.2 yillik)
09:30 AM — Piyasa acilisi (CPI etkisi)
09:45 AM — ORB penceresi acilir
12:00 PM — Orta gun volatilite sakinlesmesi
15:30 PM — Son saat hareketliligi baslar
16:00 PM — Kapanis (ORCL pozisyonu acma zamani)
16:05 PM — ORCL EARNINGS ACIKLAMASI (AMC)
```

##### Fiyat Projeksiyonu (CPI'ye Bagli Genis Range)

| Senaryo | Fiyat | Olasilik | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $220.00 | %30 | CPI dusuk gelirse ralli (%3.8-4.0) + earnings spekulasyon |
| Base | $215.00 | %35 | CPI beklenene yakin (%4.1-4.3) |
| Bear | $208.00 | %35 | CPI yuksek gelirse satis (%4.4+) + risk azaltma |

**Teknik Seviyeler:**
- Destek 1: $212.00 | Destek 2: $208.00 (200MA) | Destek 3: $205.00
- Direnc 1: $216.00 | Direnc 2: $220.00 | Direnc 3: $225.00

##### IV Projeksiyonu (Maksimum)

| Metrik | Deger | Degisim | Yorum |
|--------|-------|---------|-------|
| IV30 | %54.0 | +5pp | **Earnings + CPI gunu — maksimum IV** |
| IV Rank | %89 | +3pp | Tarihi yuksek |
| Post-Earnings IV Crush | %35-40 | -%15-20 | **IV cokmesi beklentisi** |

##### Opsiyon Prim Projeksiyonu (Kapanista Alinmali)

| Tip | Strike | 9 Haz Prim | Gunluk Theta | 10 Haz Kapanis Projeksiyon |
|-----|--------|-----------|--------------|----------------------------|
| Call (ITM) | $200 | $17.50 | -$2.20 | $18.00 (IV zirvesi) |
| Call (ATM) | $210 | $14.80 | -$2.50 | $16.50 (maksimum volatilite) |
| Call (OTM) | $220 | $12.00 | -$2.10 | $14.50 |
| Put (ATM) | $210 | $13.20 | -$2.35 | $15.00 |
| **210 Straddle** | **210C+210P** | **$28.00** | **-$4.85** | **$31.50 (maksimum)** |

##### Greeks Projeksiyonu (Earnings Gunu)

| Greek | Deger | Degisim | Risk |
|-------|-------|---------|------|
| Delta (ATM C) | 0.60 | +0.03 | ITM derinlesiyor |
| Gamma (ATM) | 0.028 | +0.006 | **Pin riski maksimum** |
| Theta (ATM C) | -$2.50 | -$0.55 | **Maksimum erime gunu** |
| Vega (ATM) | $0.015 | -$0.005 | Son gun — vega anlamsizlasiyor |

##### Ozel Gun Protokolu: 10 Haziran Uclu Volatilite

**CPI Oncesi (08:30 AM oncesi):**
- Pre-market hacim yuksek
- ORCL pozisyonu henuz acma

**CPI Sonrasi (08:30-09:30 AM):**
- CPI < %4.0: Rally modu — Call agirlikli
- CPI %4.0-4.3: Notur — Straddle/Strangle
- CPI > %4.3: Risk-off — Put koruma veya pozisyon erteleme

**09:30-10:30: BEKLE (ZORUNLU)**
- CPI kaosu, spread 5-10x normali
- Hicbir islem yapma

**10:30 sonrasi ORB:**
- 30dk ORB: Yukari >$224.01 | Asagi <$203.35
- Sadece hisse senedi (opsiyon primi cok yuksek)
- Guclu trend takip et

**15:30-16:00 Kapanis:**
- ORCL pozisyonu AÇ (son 30 dk)
- CPI sonrasi yon belli olduktan sonra

##### EarningsPlay Kontrol Listesi — 10 Haziran

- [x] IV Rank >%50 (%89 ✅)
- [x] **10 Haziran Kapanista Pozisyon Al** — AMC + CPI sonrasi
- [ ] 21 DTE — 12 Haziran vadeli (2 DTE 🔴 **Cok Riskli**)
- [ ] %50 kar kurali — Yeni pozisyon
- [x] Pre-earnings momentum: RPO $553B rekor, Cloud %84 YoY

---

#### 4.1.5 11 Haziran Persembe (IV CRUSH GUNU)

**ORCL Gunluk Durum:** Earnings aciklandi! IV %82'den %40-50'ye dusecek. **IV CRUSH'DAN KAZANMA GUNU!**

**Acilis Beklentisi:** Gap up/down $200-$230 arasi (earnings'e bagli)

##### IV Crush Stratejileri

| Earnings Sonucu | Fiyat | Strateji | Beklenti |
|----------------|-------|----------|----------|
| Beat + $220+ | $220+ | Short Call Spread 225C/235C | IV crush + yukari tukenme |
| Miss + $200- | $200- | Short Put Spread 200P/190P | IV crush + asagi tukenme |
| Inline $210-220 | $210-220 | Straddle/Strangle Short | IV %40 dustugunde kazanir |

##### Greeks (IV Crush Sonrasi)

| Greek | Pre-Earnings | Post-Earnings | Degisim |
|-------|-------------|---------------|---------|
| IV | %54 | %35-40 | -%15-20 |
| ATM Prim | $16.50 | $8-10 | -%50 |
| Vega | $0.015 | $0.008 | -Yari |
| Theta | -$2.50 | -$0.80 | Rahatlar |

**EarningsPlay %50 Kar Kurali:** IC varsa kredinin %50'si hedefinde mekanik cikis.

---

### 4.2 CHWY ($20.64) — 10 Haziran BMO — 3 Gun Kaldi

#### 4.2.1 Short Squeeze Analizi (5/5)

##### Short Squeeze Metrikleri

| Metrik | Deger | Yorum |
|--------|-------|-------|
| Short Interest | 26,805,474 hisse | Float'un %11.59'u |
| Onceki Rapor SI | 21,273,108 hisse | Son rapora gore baz |
| Days to Cover | 3.42 gun | 🟢 Squeeze icin ideal (>3 gun) |
| Son 3 Ay Degisim | -%55 deger kaybi | Kisalar karli = kapanma baskisi |
| Q4 FY2025 EPS | GAAP diluted EPS $0.09 / adjusted EPS $0.28 | Iki farkli EPS olcusu; beklentiyle karistirilmaz |
| Forward P/E | 10.55 | Asiri ucuz = dip destegi |
| Ort. Analist Hedefi | $38.85 (%88 potansiyel) | Asiri dusuk fiyatlama |

##### Short Squeeze Senaryolari

| Senaryo | Kosul | Hisse Tepkisi | Squeeze Etkisi | Olasilik |
|---------|-------|--------------|----------------|----------|
| **Mini Squeeze** | EPS>$0.50, pozitif guidance | +%15-25 ($24-26) | Kisa kismi kapanir | %40 |
| **Major Squeeze** | EPS>$0.55, guclu guidance | +%35-45 ($28-30) | 3.42 gun cover = panik | %30 |
| **Extreme Squeeze** | EPS>$0.60, buyback | +%50-70 ($31-35) | Tum kisalar kapattirir | %15 |
| **Hayal Kirikligi** | EPS<$0.35, zayif guidance | -%15-25 ($16-17) | Kisalar kazanir | %15 |

**Neden Short Squeeze Olasiligi Yuksek?**
1. Beklentiler cok dusuk (Q4 kazasi sonrasi)
2. Short interest son rapora gore %26.01 artti
3. Days to cover 3.42 gun = kapanma zaman alir = fiyat patlamasi
4. Forward P/E 10.55 = asagi risk sinirli
5. 18 kurum Buy/Overweight

---

#### 4.2.2 8 Haziran Pazartesi Projeksiyonu (3 gun kaldi)

**Acilis Beklentisi:** $20.80 - $21.40 (Pre-market hareketli)

##### Fiyat Projeksiyonu

| Senaryo | Fiyat | Olasilik | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $22.00 | %35 | Squeeze baslangici, dip alimlari |
| Base | $21.10 | %40 | Konsolidasyon, shortlar kararli |
| Bear | $19.80 | %25 | Yeni dip testi |

**Teknik Seviyeler:**
- Destek 1: $20.00 (PSY) | Destek 2: $19.30 (52-hafta dip)
- Direnc 1: $21.50 | Direnc 2: $22.50 (squeeze hedefi)
- **SSR:** $19.50 alti kapanista Short Sale Rule devreye girer

##### IV/Prim/Greeks Projeksiyonu

| Metrik | Deger | Degisim |
|--------|-------|---------|
| IV30 | %100 | +5pp (Squeeze + earnings double premium) |
| IV Rank | %91 | +1pp |
| ATM Call Prim ($21) | $1.45 | Squeeze bekleyisi |
| ATM Put Prim ($21) | $1.55 | Downside koruma |
| ATM Theta (C) | -$0.15 | Hizlaniyor |
| Gamma (ATM) | 0.12 | Yuksek — squeeze'de hizli kar |

##### ORB/VWAP/Momentum

**ORB Seviyeleri:**
- ORB High: $21.40 | ORB Low: $20.60
- ORB Breakout: $21.40 uzeri long, $20.60 alti short

**VWAP Projeksiyonu:**
- VWAP: ~$21.00
- +1σ: $21.50 | +2σ: $22.00
- -1σ: $20.50 | -2σ: $20.00

**Strateji:**
- **VWAP yukari kirilim** → Long Call 21C (ucuz, OTM)
- **$22.30 ustu** → Squeeze basladi, trend takip
- **$20.13 alti** → Squeeze basarisiz, Long Put 20P
- **OTM 22-24 Call'lari ucuzken biriktir** (lottery ticket)
- 0DTE uygun: ⚠️ Hayir — CHWY 0DTE likiditesi dusuk

---

#### 4.2.3 9 Haziran Sali Projeksiyonu (2 gun kaldi / SON GUN)

**⚠️ KRITIK UYARI:** CHWY BMO oldugu icin **9 HAZiRAN KAPANiSTA pozisyon alinmali!**

**Acilis Beklentisi:** $20.90 - $21.80

##### Fiyat Projeksiyonu

| Senaryo | Fiyat | Olasilik | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $22.50 | %40 | Son gun squeeze, FOMO |
| Base | $21.50 | %35 | Son dakika konsolidasyon |
| Bear | $20.30 | %25 | Son dakika satis |

##### IV/Prim/Greeks (Kapanista Pozisyon Alma Ani)

| Metrik | Deger | Yorum |
|--------|-------|-------|
| IV30 | %105 | Son gun — maksimum IV |
| IV Rank | %93 | Tarihi zirvelere yakin |
| ATM Call ($21) | $1.80 | Son giris firsati |
| ATM Theta | -$0.18 | Gunluk erime hizlaniyor |
| Gamma (ATM) | 0.15 | **Cok yuksek** — $0.10 hareket = delta %50 degisir |

##### Strateji — Kapanis Plani (KRITIK)

**15:30-16:00 arasi pozisyon ac:**
- 21 Call ($1.80) veya 20/23 Call Spread ($1.20 maliyet)
- Max risk: %100 | Max odul: Squeeze'de %200-500
- **BMO oldugu icin 9 Haziran kapanista SON giris zamani**

**Gun Sonu Flat Kurali:**
- CHWY pozisyonu TUT (earnings play icin)
- Tum diger 0DTE'leri KAPAT
- Max risk: %2 portfoy ($2,000)
- Stop: $19.00 (-%8)
- Hedef: $23-24 (+%12-16) earnings gap up

---

#### 4.2.4 10 Haziran Carsamba Projeksiyonu (EARNINGS GUNU — BMO)

**⚠️ KRITIK UYARI:** CHWY earnings BMO aciklanacak! 06:00-08:30 AM arasi sonuclar belli olur.

**Acilis Beklentisi:** Gap $19.00 - $25.00 arasi (earnings'e bagli)

##### Fiyat Projeksiyonu (Earnings Reaksiyonu)

| Senaryo | Fiyat | Olasilik | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $25.00 | %35 | **Earnings beat + squeeze patlamasi** |
| Base | $22.30 | %35 | Hafif beat / inline |
| Bear | $18.50 | %30 | Earnings miss |

**Earnings Sonrasi Teknik Seviyeler:**
- Gap Up Destekleri: $22.00 | $21.00
- Squeeze Hedefleri: $24.00 | $26.00 | $28.00
- Yeni Dip: $18.50

##### IV Crush (CHWY BMO — Sabah 09:30'da Baslar)

| Metrik | Pre-Earnings | Post-Earnings | Degisim |
|--------|-------------|---------------|---------|
| IV | %115 | %55-65 | **-%50 (IV CRUSH)** |
| ATM Call ($21) Prim | $1.80 | $0.90-1.10 | -%45 |
| Delta (ATM C) | 0.50 | 0.70 (bull) / 0.10 (bear) | ±0.20 |

##### Kar Realizasyonu Stratejisi (Earnings Gunu)

**06:00-08:30 AM (Pre-Market):**
- Earnings sonuclarini izle
- EPS vs Beklenti karsilastir

**09:30 AM Acilis:**
- **Gap %5+** ise: %50 kar al, kalan trailing stopla tas
- **Gap %2-5** ise: Pozisyonu degerlendir, hedef belirle
- **Gap asagi** ise: Stop-loss uygula

| Hisse Fiyati | Squeeze Seviyesi | Aksiyon | Kar Hedefi |
|-------------|-----------------|---------|------------|
| $20-22 | Squeeze yok | Pozisyonu tut | Bekle |
| $22-25 | Mini Squeeze | Pozisyonu tut | %50 kar degerlendir |
| $25-28 | Major Squeeze | **%50 kar al** | Spread max %50'si |
| $28-32 | Strong Squeeze | **%75 kar al** | Spread max %75'i |
| $32+ | Extreme | **TAMAMEN CIK** | Acgozluluk yapma |
| $18 alti | Squeeze basarisiz | **STOP-LOSS** | Spread degeri = $0 |

---

#### 4.2.5 11 Haziran Persembe (IV Crush Gunu — CHWY)

Earnings sonrasi 2. gun. Trend oturmaya baslar.

**Strateji:**
- Earnings sonrasi trend takip
- Gap dolgu → Eger dolmadiysa fade
- Hacim duserse → Cik (ilgi azaliyor)
- Bu gun "gozlem" gunu — yeni pozisyon acma


---

## BOLUM 5: GUNLUK PROJEKSIYON — ADBE (11 Haziran Earnings)

### 5.1 ADBE ($251.44) — 11 Haziran AMC — 4 Gun Kaldi

#### 5.1.1 Sirket Profili ve Katalist Ozeti

| Ozellik | Deger | EarningsPlay Notu |
|---------|-------|-------------------|
| Fiyat | $251.44 (-2.71% gunluk) | Tech satisindan etkilendi |
| Piyasa Degeri | $101.6B | Large cap |
| P/E (TTM) | 14.66 | **TARIHI DIP!** |
| 50MA | $246.14 (Uzerinde) | Kisa vadeli pozitif |
| 200MA | $302.62 (Altinda) | Uzun vadeli trend KIRILDI |
| RSI(14) | 52.1 (Notur) | Notur bolge |
| IV Rank | %100.0 (TARIHI ZIRVE!) | ✅ IC MUKEMMEL |
| IV30 | %62.1 | Earnings volatilitesi yuksek |
| ATR(14) | $11.07 | Gunluk volatilite ~$11 |
| YTD Getiri | -%28.16 | Asiri satilmis |
| EPS Tahmini | $5.81 | Beat potansiyeli |
| Gelir Tahmini | $6.43B-$6.48B | Resmi Q2 FY2026 hedef araligi |

**Katalist Ozeti:**
- ✅ $25 milyar Buyback Programi (tarihi dip fiyattan alim)
- ✅ Firefly ARR $250M+ (uce katlama)
- ⚠️ CEO Shantanu Narayen gecis sureci baslatti; halef atandiktan sonra CEO gorevini devredecek, Board Chair olarak kalacak
- ✅ P/E 14.66 = asiri satilmis
- ✅ NVIDIA ile Stratejik Ortaklik (Firefly AI)

**ADBE Katalist Skoru: 4/5 (Guclu)** → Long Call Spread FAVORI / Iron Condor ALTERNATIF

---

#### 5.1.2 8 Haziran Pazartesi Projeksiyonu (T-4 / 4 Gun Kaldi)

##### Fiyat Projeksiyonu

| Senaryo | Fiyat Araligi | Olasilik | Tetikleyici |
|---------|--------------|----------|-------------|
| 🟢 Yukari | $255 - $262 | %30 | Cuma gunu dip alimlari, kisa pozisyon kapamalari |
| 🟡 Notur | $245 - $255 | %45 | CPI ve earnings oncesi bekle-gor konsolidasyonu |
| 🔴 Asagi | $240 - $245 | %25 | Tech selloff devami |

**Beklenen Getiri:** -%0.5 ile +%1.5 arasi
**Anahtar Seviye:** $250 psikolojik destek/direnc

##### Teknik Seviyeler
- Destekler: $245 (50MA) → $240 → $235
- Direncler: $260 → $270 → $275
- Bollinger: $230-$269 bandi

##### IV/Prim/Greeks Projeksiyonu

| Metrik | Deger | Degisim |
|--------|-------|---------|
| IV30 | %58-62 | Hafif gerileme |
| IV Rank | %95-100 | Zirve seviyede kalma |
| ATM Call ($250) Prim | $12.91 | Theta -$1.12/gun |
| ATM Put ($250) Prim | ~$11.50 | Theta -$0.85/gun |
| ATM Gamma | 0.039 | Normal |

**Onemli:** Jun 12 expiration theta decay cok hizli. Earnings 11 Haziran AMC → Jun 18 expiration tercih edilmeli.

##### Strateji ve Aksiyon

**Tavsiye:** BEKLE → CPI sonucuna gore karar ver
- Agresif: 10 Haziran kapanista Jun 18 $250/$260 call spread
- Moderat: CPI sonucunu gorusonra 10 Haziran aksami karar ver
- Konservatif: Earnings sonrasi IV crush ile dip alim

**Gunluk Zaman Araliklari:**
- 9:30-9:45: BEKLE (NFP sonrasi acilis kaosu)
- 9:45-10:30: ORB + VWAP (IV yuksek, spread kullan)
- 10:30-11:30: VWAP Bounce/Reject
- 13:00-14:30: ADBE call spread degerlendir
- 15:45: Gun sonu flat

##### EarningsPlay Kontrol Listesi — 8 Haziran

- [x] IV Rank >%50 (%100 ✅)
- [x] Wing width = $251.44/10 ≈ $25 → ~$25 secilecek
- [x] VIX 21.51 <%35
- [ ] 21 DTE kontrolu — Jun 12 expiry (4 DTE ⚠️) → Jun 18 tercih et
- [ ] %50 kar kurali — Henuz pozisyon yok
- [x] $25B buyback destegi

---

#### 5.1.3 9 Haziran Sali Projeksiyonu (T-3 / 3 Gun Kaldi)

##### Fiyat Projeksiyonu

| Senaryo | Fiyat Araligi | Olasilik | Tetikleyici |
|---------|--------------|----------|-------------|
| 🟢 Yukari | $257 - $265 | %25 | Earnings oncesi short squeeze, AI hype |
| 🟡 Notur | $248 - $257 | %45 | CPI oncesi bekle-gor |
| 🔴 Asagi | $240 - $248 | %30 | Tech satis derinlesmesi |

##### IV/Greeks Projeksiyonu

| Metrik | Deger | Yorum |
|--------|-------|-------|
| IV30 | %60-65 | CPI yaklasimi yukselis |
| ATM Gamma | 0.054 | Yukseliyor |
| ATM Theta | -$1.83/gun | Hizlaniyor |
| Vega | $0.068 | Daraliyor |

**Gamma Riski:** 3 gun kala gamma 0.039→0.054 yukseliyor. Fiyatta $1 hareket delta'da 0.054 degisim.

##### Strateji

- Agresif: AL — Jun 18 $250/$265 call spread (CPI oncesi)
- Moderat: BEKLE — CPI sonucunu gorsonra karar ver
- Konservatif: BEKLE — Earnings sonrasi IV crush alimi

---

#### 5.1.4 10 Haziran Carsamba Projeksiyonu (T-2 / 2 Gun Kaldi — CPI GUNU!)

##### Fiyat Projeksiyonu

| Senaryo | Fiyat Araligi | Olasilik | Tetikleyici |
|---------|--------------|----------|-------------|
| 🟢 Yukari (CPI Soguk) | $260 - $270 | %25 | CPI dusuk gelir, tech rallisi |
| 🟡 Notur | $248 - $260 | %35 | CPI beklenen |
| 🔴 Asagi (CPI Sicak) | $238 - $248 | %40 | CPI yuksek gelir, tech satisi |

**CPI Beklentisi:** Headline CPI yillik %2.4-2.5, aylik %0.1-0.2

##### IV/Greeks Projeksiyonu

| Metrik | Deger | Yorum |
|--------|-------|-------|
| IV30 | %62-68 | CPI + earnings double ramp |
| ATM Gamma | 0.098 | **3x patlama** |
| ATM Theta | -$3.68/gun | **Theta soku** |
| Vega | $0.052 | Daraliyor |

> ⚠️ **Gamma Patlamasi Uyarisi:** ADBE'de 1 gun kala gamma 3x'e cikiyor (0.039 → 0.098). Fiyatta $1 hareket delta'da 0.098 degisim = her $1 = %10 delta degisimi.

##### Strateji

- Agresif: AL — CPI sonrasi dip alim (Jun 18 expiration)
- Moderat: BEKLE — Earnings sabahi karar
- Konservatif: CIK — Mevcut pozisyonlardan kar realize

**CPI + Earnings Kombinasyonu:**
- CPI dusuk + ADBE beat = $270+ potansiyel
- CPI yuksek + ADBE miss = $240- destek testi

---

#### 5.1.5 11 Haziran Persembe Projeksiyonu (T-0 / EARNINGS GUNU! + PPI)

##### Fiyat Projeksiyonu

| Senaryo | Fiyat Araligi | Olasilik | Tetikleyici |
|---------|--------------|----------|-------------|
| 🟢 Yukari (PPI Soguk) | $265 - $280 | %30 | PPI dusuk + earnings beat |
| 🟡 Notur | $248 - $265 | %35 | PPI notur, earnings inline |
| 🔴 Asagi (PPI Sicak) | $235 - $248 | %35 | PPI yuksek + earnings miss |

**PPI Beklentisi:** Aylik %0.2, yillik %2.3-2.5

##### IV/Greeks Projeksiyonu (Earnings Gunu — Gamma Patlamasi!)

| Metrik | Deger | Yorum |
|--------|-------|-------|
| IV30 | %65-70 | Zirve |
| Earnings IV | %80-90 | Earnings ozel oynaklik |
| **ATM Gamma** | **1.456** | **🔥 50x PATLAMA!** |
| **ATM Theta** | **-$7.33/gun** | **🔥 THETA SOK MAKSIMUM** |
| Vega | $0.018 | Cok dusuk |

> 🔥🔥 **GAMMA PATLAMASI UYARISI:** 11 Haziran ADBE earnings gunu gamma **50x** patliyor (0.039 → 1.456). Fiyatta $1 hareket delta'da **1.45 degisim** yaratir. Pozisyon kucultme zorunlu!

##### Earnings Sonrasi IV Crush Projeksiyonu

| Senaryo | IV Dususu | ATM Prim Etkisi |
|---------|-----------|-----------------|
| Hafif Crush | -%30 | -%29 |
| Orta Crush | -%50 | -%50 |
| Sert Crush | -%70 | -%67 |

##### Strateji — Earnings Gunu

**08:30 PPI Aciklamasi:**
- PPI dusuk → Bullish setup
- PPI yuksek → Dikkatli

**09:30-10:30:**
- PPI etkisini gor, ilk 30 dk BEKLE
- ORB + VWAP takip (hisse senedi)

**10:30-14:30:**
- Guclu trend takip
- **Asla opsiyon alma** (IV %100 zirve)

**14:30-15:45:**
- ADBE earnings play (hisse senedi, kucuk pozisyon)
- Jun 18 expiration call spread (son giris)

**15:45 Kapanis:** Tum ADBE pozisyonunu %75 azalt (AMC riski)

##### Earnings Beklentileri ve Senaryolar (non-GAAP)

| Senaryo | EPS Beklentisi (non-GAAP) | Gelir Beklentisi | Fiyat Etkisi |
|---------|---------------------------|-----------------|--------------|
| Beat | >$5.85 | >$6.48B | +%5 ila +%12 ($264-$281) |
| Inline | $5.80-$5.85 | $6.43B-$6.48B | +%0 ila +%3 ($251-$259) |
| Miss | <$5.80 | <$6.43B | -%3 ila -%8 ($231-$244) |

---

#### 5.1.6 12 Haziran Cuma Projeksiyonu (IV CRUSH GUNU — ADBE)

ADBE earnings sonrasi ilk islem gunu. IV %100'den %35-40'a duser.

**Strateji:**
- IV crush'tan kazan (short vega)
- Earnings sonrasi yeni long setup (dusuk IV'dan al)
- Gap dolgu takip et
- IC kapama zamani (varsa)


---

## BOLUM 6: HAFTALIK PROJEKSIYON — FDX (23 Haziran Earnings)

### 6.1 FDX ($331.00) — 23 Haziran AMC — 16 Gun Kaldi

#### 6.1.1 Sirket Profili ve Katalist Ozeti

| Ozellik | Deger | EarningsPlay Notu |
|---------|-------|-------------------|
| Fiyat | $331.00 (+0.91% gunluk) | Spinoff sonrasi toparlanma |
| Piyasa Degeri | $79.0B | Large cap |
| Forward P/E | 15.05 | Makul degerleme |
| 50MA | $307.54 (Uzerinde) | Teknik destek |
| 200MA | $249.73 (Uzerinde) | Guclu destek |
| RSI(14) | 71.2 | **ASIRI ALIM!** |
| IV Rank | %76.3 | IC uygun |
| IV30 | %38 | Ilmli |
| Beta | 1.30 | Orta volatilite |
| ATR(14) | $9.37 | Gunluk volatilite ~$9 |
| Dividend Yield | %1.75 | Destek |
| YTD Getiri | +%42.78 | Guclu performans |
| EPS Tahmini | $5.91 (JPM: $6.40) | Beat potansiyeli |
| Beklenen Hareket (EM) | ~%6.6 (~$22) | Wing genisligi |

**Katalist Ozeti:**
- ✅ Freight Spinoff tamamlandi — $4.1B nakit
- ✅ J.P. Morgan Buy Upgrade — $460 hedef
- ⚠️ RSI 71.2 asiri alim — duzeltme riski
- ⚠️ Yakit maliyetleri %50 artti — marj baskisi
- ✅ JPM EPS $6.40 bekliyor (konsensus $5.80) → %8 beat

**FDX Katalist Skoru: 3/5 (Orta)** → Iron Condor FAVORI / Strangle ALTERNATIF

---

#### 6.1.2 Hafta 1: 8-12 Haziran Projeksiyonu (16-12 Gun Kaldi)

##### Haftalik Fiyat Projeksiyonu

| Senaryo | Fiyat Araligi | Olasilik | Tetikleyici |
|---------|--------------|----------|-------------|
| 🟢 Yukari | $335 - $345 | %30 | Freight spinoff olumlu, RSI 70+ momentum |
| 🟡 Notur/Sideways | $320 - $335 | %45 | CPI oncesi konsolidasyon |
| 🔴 Duzeltme | $308 - $320 | %25 | RSI asiri alim duzeltmesi |

##### Gunluk Detay

| Gun | Beklenen Aralik | Tetikleyici | IV30 |
|-----|-----------------|-------------|------|
| 8 Haz Pazartesi | $325 - $335 | Hafta acilisi, NFP sonrasi etki | %33-35 |
| 9 Haz Sali | $322 - $333 | ORCL/CHWY earnings etkisi | %33-36 |
| 10 Haz Carsamba (CPI!) | $315 - $340 (genis) | CPI verisi, piyasa volatilite | %36-40 |
| 11 Haz Persembe (PPI!) | $318 - $338 | PPI + ADBE earnings | %34-37 |
| 12 Haz Cuma | $320 - $340 | Hafta kapanisi | %34-37 |

##### Opsiyon Prim Projeksiyonu (Jun 26 Exp — 19 DTE)

| Tip | Strike | Mevcut Prim | Hafta 1 Sonu | Gunluk Theta |
|-----|--------|-------------|--------------|--------------|
| Call (ITM) | $320 | $30.00 | $28-$32 | -$0.25 |
| Call (ATM) | $330 | $22.00 | $20-$24 | -$0.30 |
| Call (OTM) | $340 | $15.00 | $13-$17 | -$0.28 |
| Put (ATM) | $330 | $20.00 | $18-$22 | -$0.25 |

##### Greeks (Jun 26 $330 Call)

| Metrik | Deger | Yorum |
|--------|-------|-------|
| Delta | 0.543 | %1 fiyat artisi = +$0.54 |
| Gamma | 0.015 | ATM yaklastikca delta degisimi |
| Theta | -$0.30/gun | 19 DTE ile yavas decay |
| Vega | $0.300 | IV %1 degisim = $0.30 etki |

**FDX icin Theta yavas (19 DTE) — erken pozisyon alim uygun.**

##### Strateji — Hafta 1

- Agresif: $320/$350 Jun 26 call spread (dip alim)
- Moderat: CPI sonrasi 10-11 Haziran'da dip alim
- Konservatif: Earnings oncesi son hafta pozisyon al
- Iron Condor: 300/365 Short, 267/398 Long → ~$6.00 kredi

---

#### 6.1.3 Hafta 2: 15-19 Haziran Projeksiyonu — FOMC 17 Haziran

##### Haftalik Fiyat Projeksiyonu

| Senaryo | Fiyat Araligi | Olasilik | Tetikleyici |
|---------|--------------|----------|-------------|
| 🟢 Yukari | $340 - $360 | %30 | FOMC dovish, sektor rallisi |
| 🟡 Notur | $325 - $342 | %45 | FOMC oncesi bekle-gor |
| 🔴 Duzeltme | $310 - $325 | %25 | FOMC hawkish, kar realizasyonu |

##### FOMC Etkisi (17 Haziran Carsamba)

| FOMC Senaryo | FDX Etkisi | Olasilik |
|-------------|-----------|----------|
| Faiz indirimi (%25bp) | +%3 ila +%5 | %15 |
| Durus degisikligi (dovish tilt) | +%2 ila +%4 | %35 |
| Durus koruma | +%0 ila +%2 | %40 |
| Hawkish surprise | -%2 ila -%5 | %10 |

**Piyasa Fiyatlamasi:** Haziran faiz indirimi olasiligi %25-30. Temmuz/Eylul daha olasi.

##### IV Projeksiyonu (Hafta 2)

| Gun | IV30 | IV Rank | Yorum |
|-----|------|---------|-------|
| 15 Haz | %36-38 | %75-78 | FOMC oncesi IV ramp baslar |
| 17 Haz | %40-45 | %80-85 | FOMC gunu zirve |
| 18 Haz | %35-40 | %72-78 | FOMC sonrasi normallesme |
| 19 Haz | BORSA KAPALI | Juneteenth | -- |

**Juneteething nedeniyle 3 gunluk hafta sonu — theta decay riski!**

##### Strateji

- Agresif: FOMC oncesi call spread (Jun 26 $340/$360)
- Moderat: FOMC sonrasi pozisyon al
- Konservatif: Earnings oncesi son 3 gun bekle

---

#### 6.1.4 Hafta 3: 22-23 Haziran Projeksiyonu — EARNINGS

##### 22 Haziran Pazartesi (T-1)

| Senaryo | Fiyat Araligi | Olasilik |
|---------|--------------|----------|
| 🟢 Yukari | $345 - $360 | %30 |
| 🟡 Notur | $332 - $348 | %45 |
| 🔴 Asagi | $320 - $332 | %25 |

##### 23 Haziran Sali (EARNINGS GUNU — AMC)

| Senaryo | Fiyat Araligi | Olasilik | Tetikleyici |
|---------|--------------|----------|-------------|
| 🟢 Yukari | $350 - $380 | %35 | EPS beat + guidance yukari |
| 🟡 Notur | $330 - $352 | %35 | EPS inline |
| 🔴 Asagi | $310 - $330 | %30 | EPS miss |

**Earnings Beklentileri:**

| Metrik | Konsensus | Yuksek Tahmin | Dusuk Tahmin |
|--------|-----------|---------------|--------------|
| EPS | $5.52 | $6.00 | $5.10 |
| Revenue | $22.1B | $22.8B | $21.5B |

##### IV Projeksiyonu (Earnings Haftasi)

| Gun | IV30 | Etki |
|-----|------|------|
| 22 Haz | %42-48 | Earnings oncesi zirve |
| 23 Haz (oncesi) | %48-55 | Earnings gunu peak |
| 24 Haz (sonrasi) | %28-35 | IV crush (%40-50 dusus) |

---

#### 6.1.5 24-26 Haziran Projeksiyonu (IV Crush Sonrasi)

**Earnings sonrasi FDX IC kapatma zamani.**

| Senaryo | Fiyat | Degisim |
|---------|-------|---------|
| Guclu Beat + Guidance Up | $365-$385 | +%10 ila +%16 |
| Beat + Inline Guidance | $345-$365 | +%4 ila +%10 |
| Inline | $325-$345 | -%2 ila +%4 |
| Miss | $305-$325 | -%8 ila -%8 |

**EarningsPlay %50 Kar Kurali:** IC varsa 24 Haziran 09:30'da kredinin %50'si hedefinde mekanik cikis.

---

## BOLUM 7: HAFTALIK PROJEKSIYON — MU (24 Haziran Earnings)

### 7.1 MU ($864.01) — 24 Haziran AMC — 17 Gun Kaldi

#### 7.1.1 Sirket Profili ve Katalist Ozeti

| Ozellik | Deger | EarningsPlay Notu |
|---------|-------|-------------------|
| Fiyat | $864.01 (-13.25% gunluk) | Sert dusus |
| Piyasa Degeri | $974.4B | Mega cap |
| Beta | 2.17 | **CIFTE VOLATILITE!** |
| 50MA | $617.35 (Cok uzerinde) | Destek uzakta |
| 200MA | $352.78 (Cok uzerinde) | Guclu destek cok uzakta |
| RSI(14) | 60.1 (Notur) | Notur bolge |
| IV Rank | %100.0 (TARIHI ZIRVE!) | ✅ IC MUKEMMEL |
| IV30 | %102.4 | Asiri yuksek |
| ATR(14) | $73.74 | Gunluk volatilite ~$74 |
| YTD Getiri | +%202.85 | Astronomik |
| EPS Tahmini | $1.93 | HBM talep odakli |
| Beklenen Hareket (EM) | ~%13.0 (~$112) | Cok genis wing |

**Katalist Ozeti:**
- ✅ NVIDIA HBM Resmi Onayi (Jensen Huang)
- ✅ Analist hedef $1,100 (Raymond James)
- 🔴 Morningstar Adil Deger $455 (%89 asiri degerli)
- 🔴 Beta 2.17 = cifte volatilite
- 🔴 Ort. Analist Hedefi $739 < $864 (%14.5 altinda)

**MU Katalist Skoru: 3/5 (Orta)** → **Iron Condor FAVORI — ASLA Long Straddle**

> **EarningsPlay Kurali:** Katalist 3/5 + IV %100 + Beta 2.17 = Iron Condor tek mantikli strateji.

---

#### 7.1.2 Hafta 1: 8-12 Haziran Projeksiyonu (17-13 Gun Kaldi)

##### Haftalik Fiyat Projeksiyonu

| Senaryo | Fiyat Araligi | Olasilik | Tetikleyici |
|---------|--------------|----------|-------------|
| 🟢 Yukari | $880 - $980 | %30 | AI/HBM hype, NVIDIA etkisi |
| 🟡 Notur/Volatil | $800 - $900 | %40 | CPI oncesi konsolidasyon |
| 🔴 Duzeltme | $720 - $800 | %30 | Beta 2.17 ile piyasa satisi |

**Beta 2.17 Etkisi:** Piyasa %1 hareket ederse MU %2.17 hareket eder. NFP gunu Nasdaq -%4.18, MU -%13.25.

##### Gunluk Detay

| Gun | Beklenen Aralik | Tetikleyici |
|-----|-----------------|-------------|
| 8 Haz Pazartesi | $830 - $920 (genis) | Cuma -%13 dusus sonrasi tepki |
| 9 Haz Sali | $840 - $930 | Sektor genel hareket |
| 10 Haz Carsamba (CPI!) | $780 - $960 (cok genis) | CPI + Beta 2.17 etkisi |
| 11-12 Haz | $800 - $950 | PPI, ADBE earnings etkisi |

##### Opsiyon Prim Projeksiyonu (Jun 26 Exp — 19 DTE)

| Tip | Strike | Mevcut Prim | Gunluk Theta |
|-----|--------|-------------|--------------|
| Call (ITM) | $800 | $140 | -$1.20 |
| Call (ATM) | $865 | $85 | -$1.70 |
| Call (OTM) | $900 | $65 | -$1.65 |
| Call (OTM+) | $950 | $40 | -$1.50 |
| Put (ATM) | $865 | $80 | -$1.50 |

> ⚠️ **Yuksek Theta Uyarisi:** MU opsiyonlari cok pahali! Gunluk $1.70 theta decay.

##### Greeks (Jun 26 $865 Call)

| Metrik | Deger | Yorum |
|--------|-------|-------|
| Delta | 0.539 | %1 fiyat artisi = +$8.64 |
| Gamma | 0.0025 | ATM yaklastikca delta degisimi |
| Theta | -$1.70/gun | Gunluk zaman erimesi (yuksek!) |
| Vega | $0.783 | IV %1 dusus = -$0.78 kayip |

##### Strateji

- Agresif: BEKLE → AL — 10-11 Haziran dip alim ($900/$1000 call spread)
- Moderat: BEKLE — CPI sonrasi netlesme beklenmeli
- Konservatif: BEKLE — Earnings sonrasi IV crush degerli alim
- Iron Condor: 735/995 Short, 649/1081 Long → ~$17 kredi

---

#### 7.1.3 Hafta 2: 15-19 Haziran Projeksiyonu — FOMC

##### Haftalik Fiyat Projeksiyonu

| Senaryo | Fiyat Araligi | Olasilik | Tetikleyici |
|---------|--------------|----------|-------------|
| 🟢 Yukari | $920 - $1,050 | %30 | FOMC dovish, AI hype |
| 🟡 Notur/Volatil | $800 - $930 | %40 | FOMC oncesi bekle-gor |
| 🔴 Duzeltme | $700 - $800 | %30 | FOMC hawkish, kar realizasyonu |

##### FOMC Etkisi (17 Haziran)

| FOMC Senaryo | MU Etkisi | Olasilik |
|-------------|-----------|----------|
| Dovish / Faiz indirimi | +%8 ila +%15 | %20 |
| Notur dovish tilt | +%3 ila +%8 | %35 |
| Notur koruma | +%0 ila +%5 | %35 |
| Hawkish | -%5 ila -%12 | %10 |

> **Beta 2.17 etkisiyle FOMC sonuclari MU'ya diger hisselerden 2x etki eder.**

##### IV Projeksiyonu (Hafta 2)

| Gun | IV30 | Yorum |
|-----|------|-------|
| 15 Haz | %72-78 | FOMC oncesi IV ramp |
| 17 Haz | %80-90 | FOMC + earnings yaklasimi |
| 18 Haz | %75-82 | FOMC sonrasi ayarlama |

##### Strateji

- Agresif: FOMC sonrasi dip alim (18 Haziran)
- Moderat: BEKLE — 22 Haziran'a kadar
- Konservatif: Earnings sonrasi IV crush bekle

---

#### 7.1.4 Hafta 3: 22-24 Haziran Projeksiyonu — EARNINGS

##### 22 Haziran Pazartesi (T-3)
- Beklenen Aralik: $820 - $960
- Earnings oncesi son pozisyon ayarlamalari

##### 23 Haziran Sali (T-2)
- Beklenen Aralik: $840 - $980
- FDX earnings etkisi (sektor hissi)

##### 24 Haziran Carsamba (EARNINGS GUNU — AMC)

| Senaryo | Fiyat Araligi | Olasilik | Tetikleyici |
|---------|--------------|----------|-------------|
| 🟢 Guclu Beat | $950 - $1,100 | %30 | HBM rehberligi yukari |
| 🟢 Beat | $900 - $980 | %25 | EPS beat |
| 🟡 Inline | $840 - $920 | %25 | Beklentileri karsilar |
| 🔴 Miss | $720 - $840 | %20 | HBM marj baskisi |

**Earnings Beklentileri:**

| Metrik | Konsensus | Yuksek Tahmin | Dusuk Tahmin |
|--------|-----------|---------------|--------------|
| EPS | $1.83 | $2.20 | $1.50 |
| Revenue | $9.2B | $9.8B | $8.7B |
| HBM Revenue | %30+ of total | %35+ | <%25 |

##### IV Projeksiyonu (Earnings Haftasi)

| Gun | IV30 | Yorum |
|-----|------|-------|
| 22 Haz | %75-85 | Earnings oncesi IV ramp zirve |
| 24 Haz (oncesi) | %85-95 | Earnings gunu peak |
| 25 Haz (sonrasi) | %40-50 | IV crush (%50 dusus) |

##### Greeks (Earnings Gunu)

| Metrik | Deger | Yorum |
|--------|-------|-------|
| Delta | 0.540 | Yuksek hassasiyet |
| Gamma | 0.003 | Earnings sonucuyla hizli degisim |
| **Theta** | **-$2.00/gun** | **Son gunlerde maksimum decay** |
| **Vega** | **$0.600** | **IV crush devasa risk** |

---

#### 7.1.5 25-27 Haziran Projeksiyonu (IV Crush Sonrasi)

**MU IV Crush Sonrasi Fiyat Senaryolari:**

| Senaryo | Fiyat | Degisim |
|---------|-------|---------|
| Guclu Beat + HBM Guidance Up | $1,000-$1,150 | +%16 ila +%33 |
| Beat + Inline Guidance | $900-$1,000 | +%4 ila +%16 |
| Inline | $820-$900 | -%5 ila +%4 |
| Miss | $680-$800 | -%21 ila -%7 |

**EarningsPlay Aksiyon:**
- Agresif: AL / TUT — 22-23 Haziran dip alim
- Moderat: CIK — Earnings oncesi %30-50 kar realize
- Konservatif: SATIS — Tamamen cik, earnings sonrasi degerlendir

**IC Kapama:** 25 Haziran 09:30'da kredinin %50'si ($897) hedefinde mekanik cikis.


---

## BOLUM 8: GUNLUK MOMENTUM STRATEJILERI (8-11 Haziran)

### 8.1 Gunluk Zaman Araliklari ve Stratejiler

#### Genel Zaman Cizelgesi (Tum Hissele Icin)

| Zaman | Strateji | Win Rate | Aciklama |
|-------|----------|----------|----------|
| **9:30-9:45** | **BEKLE** | -- | Acilis kaosu, gap dolgu riski |
| **9:45-10:30** | ORB 5dk/15dk + VWAP | %53-78 | Gap dolgu bittiyse ORB takip |
| **10:30-11:30** | VWAP Bounce/Reject | %60-65 | VWAP testinde hacim onayli giris |
| **11:30-13:00** | **MOLA** | -- | Piyasa sakinlesene kadar |
| **13:00-14:30** | ORB 30dk + 0DTE | %55-65 | Earnings yaklasiyor → IV artisi |
| **14:30-15:45** | Trend takibi | %50-60 | Gun sonu momentum |
| **15:45-16:00** | **Gun sonu flat** | -- | 0DTE mutlaka kapat |

#### Gun Bazli Ozel Zaman Cizelgesi

**8 Haziran Pazartesi (NFP Sonrasi 1. Gun):**
| Zaman | Strateji | Win Rate | Uygulanacak Hisse |
|-------|----------|----------|-------------------|
| 9:30-9:45 | BEKLE | -- | Tum (NFP sonrasi acilis kaosu) |
| 9:45-10:30 | ORB 5dk/15dk + VWAP | %53-65 | MU (Beta 2.17), ORCL |
| 10:30-11:30 | VWAP Bounce/Reject | %60-65 | FDX, ADBE |
| 11:30-13:00 | MOLA | -- | -- |
| 13:00-14:30 | ORB 30dk + 0DTE | %55-60 | ORCL, CHWY (earnings yaklasiyor) |
| 14:30-15:45 | Trend takibi | %50-55 | Tum aktif |
| 15:45-16:00 | Gun Sonu Flat | -- | Tum 0DTE KAPAT |

**9 Haziran Sali (Earnings Oncesi Son Gun):**
| Zaman | Strateji | Win Rate | Ozel Notlar |
|-------|----------|----------|-------------|
| 9:30-9:45 | BEKLE | -- | Earnings oncesi ilk acilis |
| 9:45-10:30 | ORB 5dk/15dk + VWAP | %55-70 | ORCL, CHWY (son gun!) |
| 10:30-11:30 | VWAP Bounce/Reject | %60-65 | MU, ADBE |
| 11:30-13:00 | MOLA | -- | ORCL/CHWY dusuplanla |
| 13:00-14:30 | Earnings oncesi son pozisyon | %50-60 | ORCL, CHWY |
| 14:30-15:45 | Gun sonu flat | -- | Tum 0DTE KAPAT |
| 15:45-16:00 | **Gun Sonu Flat (ZORUNLU)** | -- | ORCL/CHWY earnings BMO/AMC |

**10 Haziran Carsamba (CIFT VOLATILITE GUNU — Ozel Protokol):**

> ⚠️ **BU GUN OZEL PROTOKOL GECERLIDIR!**

| Zaman | Strateji | Win Rate | Ozel Notlar |
|-------|----------|----------|-------------|
| 8:30 | CPI ACIKLAMA | -- | Piyasa dis hareket |
| 9:30-10:30 | **BEKLE (ZORUNLU)** | -- | **CPI + CHWY kaosu = 2x vol** |
| 10:30-11:30 | ORB 30dk (gecikmeli) | %45-55 | Sadece guclu trend |
| 11:30-13:00 | MOLA | -- | Piyasa sakinlestir |
| 13:00-14:30 | ORB + VWAP | %50-60 | ADBE, FDX, MU |
| 14:30-15:45 | ORCL earnings play | %40-50 | AMC oncesi son giris |
| 15:45-16:00 | **AGRESIF FLAT** | -- | Overnight = CPI riski devam |

**10 Haziran Ozel Protokol:**
```
1. Pozisyon boyutu: Normal %50
2. Max risk/gun: %1 (normalde %2)
3. Sadece hisse senedi (opsiyon cok riskli)
4. 9:30-10:30 ARASI HICBIR ISLEM YAPMA (CPI kaosu)
5. 10:30'dan sonra ORB takip
6. 14:00'dan sonra ORCL icin pozisyon alinabilir
7. 15:45'te TUM pozisyonlari %75 azalt
```

**11 Haziran Persembe (IV CRUSH ve PPI Gunu):**
| Zaman | Strateji | Win Rate | Ozel Notlar |
|-------|----------|----------|-------------|
| 8:30 | PPI ACIKLAMA | -- | Daha dusuk etkili |
| 9:30-9:45 | BEKLE | -- | PPI etkisini gorme |
| 9:45-10:30 | ORB 5dk/15dk + VWAP | %55-70 | ORCL (IV crush), ADBE |
| 10:30-11:30 | VWAP Bounce/Reject | %60-65 | MU, FDX |
| 11:30-13:00 | MOLA | -- | -- |
| 13:00-14:30 | ADBE earnings play | %45-55 | AMC oncesi |
| 14:30-15:45 | IV crush + trend | %50-60 | ORCL straddle/strangle sat |
| 15:45-16:00 | Gun sonu flat | -- | Tum 0DTE KAPAT |

---

### 8.2 Hisse Bazli Gunluk Strateji Detayi (8-11 Haziran)

#### ORCL — $213.68 | Earnings: 10 Haz AMC (3 gun kaldi)

**Gunluk Durum:** NFP sonrasi tech satisi ORCL'yi de vurdu. Fiyat VWAP ($210.76) uzerinde kapanis yapti ama zayif.

| Gun | ORB High (5dk) | ORB Low (5dk) | ORB High (15dk) | ORB Low (15dk) | VWAP | +1σ | -1σ |
|-----|---------------|---------------|----------------|----------------|------|-----|-----|
| 8 Haz | >$216.91 | <$210.45 | >$220.14 | <$207.22 | $210.76 | $225.08 | $182.88 |
| 9 Haz | >$216.91 | <$210.45 | >$220.14 | <$207.22 | $210.76 | $225.08 | $182.88 |
| 10 Haz | >$224.01* | <$203.35* | >$224.01* | <$203.35* | $215.00 | $218.50 | $211.50 |

*10 Haziran CPI sonrasi yeniden hesaplanacak

**Fade/Chase Onerisi:**
- Earnings oncesi spread genislemesi → **limit emir kullan**
- IV %82 → opsiyon primleri pahali → **OTM tercih et**
- 3 gun kaldi → hizli hareketler bekle

**0DTE Uygunlugu:**
- 8 Haz: ⚠️ Kismen (12 Haz vadeli 0DTE/1DTE)
- 9 Haz: ✅ EVET (12 Haz vadeli)
- 10 Haz: 🔴 HAYIR (IV zirve + earnings)
- 11 Haz: ✅ EVET (IV crush gunu, hizli isler)

**R-Based Risk:** 1R = $12.91 | Stop: ATR-based $9-13 | Hedef: 2R-3R

---

#### CHWY — $20.64 | Earnings: 10 Haz BMO (3 gun kaldi)

**Gunluk Durum:** Dusuk fiyatli meme hissesi. Short squeeze potansiyeli 5/5.

| Gun | ORB High (5dk) | ORB Low (5dk) | VWAP | +1σ | -1σ | +2σ | -2σ |
|-----|---------------|---------------|------|-----|-----|-----|-----|
| 8 Haz | >$20.90 | <$20.38 | $21.33 | $22.30 | $20.45 | $23.23 | $19.52 |
| 9 Haz | >$20.90 | <$20.38 | $21.33 | $22.30 | $20.45 | $23.23 | $19.52 |
| 10 Haz | Gap acilis* | Gap acilis* | -- | -- | -- | -- | -- |

*10 Haziran earnings BMO aciklamasi sonrasi gap

**Fade/Chase Onerisi:**
- Short squeeze potansiyeli → **Long bias** ama dikkatli
- Dusuk fiyatli hisse → **likiditeye dikkat**, spread genis olabilir
- BMO earnings → **9 Haziran kapanista pozisyon al** (son sans)
- Float kucuk → hizli hareketler mumkun

**0DTE Uygunlugu:**
- 8 Haz: ⚠️ Hayir (likidite dusuk)
- 9 Haz: 🔴 HAYIR (BMO oldugu icin 0DTE ise yaramaz)
- 10 Haz: 🔴 HAYIR (earnings sonrasi kaos)
- 11 Haz: ⚠️ Hayir (earnings sonrasi)

**R-Based Risk:** 1R = $1.02 | Stop: $0.50-0.75 | Hedef: 3R-5R

---

#### ADBE — $251.44 | Earnings: 11 Haz AMC (4 gun kaldi)

**Gunluk Durum:** Tech satisindan agir etkilendi. CEO gecis sureci belirsizligi.

| Gun | ORB High (5dk) | ORB Low (5dk) | VWAP | +1σ | -1σ |
|-----|---------------|---------------|------|-----|-----|
| 8-10 Haz | >$254.21 | <$248.67 | $252.25 | $259.57 | $239.95 |
| 11 Haz* | >$260.00 | <$245.00 | $255.00 | $265.00 | $245.00 |

*11 Haziran earnings gunu — seviyeler earnings sonrasi degisebilir

**Fade/Chase Onerisi:**
- IV %100 → **opsiyonlar COK pahali** → spreads kullan
- Asiri satilmis → **Long bias ama COK dikkatli**
- CEO gecis sureci → **yon belirsizligi** → kucuk pozisyon
- Tech sektoru zayif → sektorel ruzgar karsida

**0DTE Uygunlugu:** 4 gun var → Henuz riskli. 10-11 Haziran degerlendir.

**R-Based Risk:** 1R = $11.07 | Stop: $7-10 | Hedef: 2R

---

#### FDX — $331.00 | Earnings: 23 Haz (16 gun)

**Gunluk Durum:** En saglam gorunen hisse. RSI 71.2 asiri alim ama trend guclu.

| Gun | ORB High (5dk) | ORB Low (5dk) | VWAP | +1σ | -1σ |
|-----|---------------|---------------|------|-----|-----|
| 8-11 Haz | >$333.34 | <$328.66 | $319.00 | $330.02 | $303.16 |

**Fade/Chase Onerisi:**
- RSI 71 asiri alim → **Fade the Rip dusun** (>$335)
- Spinoff sonrasi range-bound olabilir
- 16 gun var → **zaman bizim tarafimizda**, aceleci olma

**0DTE Uygunlugu:** ✅ EVET (dusuk IV, zaman var, earnings uzak)

**R-Based Risk:** 1R = $9.37 | Stop: $6-8 | Hedef: 2R-2.5R

---

#### MU — $864.01 | Earnings: 24 Haz (17 gun)

**Gunluk Durum:** En volatil hisse! Beta 2.17 → piyasanin 2x hareketi.

| Gun | ORB High (5dk) | ORB Low (5dk) | VWAP | +1σ | -1σ |
|-----|---------------|---------------|------|-----|-----|
| 8-11 Haz | >$882.44 | <$845.58 | $846.73 | $977.43 | $722.21 |

**Fade/Chase Onerisi:**
- Beta 2.17 → **2x piyasa hareketi** → Stoplari genis tut
- IV %100 → COK pahali → **spreads veya hisse senedi**
- Son dusus -%13 → **dip yakin olabilir**, dikkatli long

**0DTE Uygunlugu:** ✅ EVET ama **sadece hisse senedi** (opsiyon cok pahali)

**R-Based Risk:** 1R = $73.74 | Stop: $50-70 | Hedef: 2R

---

### 8.3 Ozel Gun Protokolleri

#### 10 Haziran Uclu Volatilite Protokolu (CPI + CHWY BMO + ORCL AMC)

**Gun Oncesi Hazirlik:**
- [ ] VIX kontrolu (22+ ise pozisyon %50)
- [ ] S&P 200MA kontrolu (7,350)
- [ ] CPI beklentisi: %4.2 yillik
- [ ] CHWY earnings beklentisi: EPS $0.34
- [ ] ORCL earnings beklentisi: EPS $1.96
- [ ] Limit emirleri hazir (market emir YASAK)
- [ ] 10 Haziran gunluk max risk: %1.5 portfoy

**Protokol Adimlari:**
```
1. 06:00 AM — CHWY earnings sonucunu izle (BMO)
2. 08:30 AM — CPI verisini takip et
3. 08:30-09:30 — CPI + CHWY etkilesimini analiz et
4. 09:30-10:30 — BEKLE (hicbir islem yapma)
5. 10:30 sonrasi — ORB seviyelerini YENIDEN hesapla
6. 10:30-11:30 — Guclu trend varsa hisse senedi ile takip
7. 13:00-14:30 — ADBE/FDX/MU normal momentum
8. 14:30-15:45 — ORCL pozisyonu ac (CPI sonrasi, AMC oncesi)
9. 15:45-16:00 — TUM pozisyonlari %75 azalt
```

**Pozisyon Azaltma Tablosu (10 Haziran 15:45):**
| Pozisyon | Tut/Kapat | Oran | Neden |
|----------|-----------|------|-------|
| ORCL | %75 KAPAT | %25 kalabilir | AMC earnings |
| CHWY | KAPAT | %0 | Earnings sonrasi kaos |
| ADBE | %50 KAPAT | %50 kalabilir | Yarin earnings |
| FDX | %50 KAPAT | %50 kalabilir | CPI gunu |
| MU | %75 KAPAT | %25 kalabilir | Beta+CPI riski |
| Tum 0DTE | KESINLIKLE KAPAT | %100 | CPI gunu |

---

#### 11 Haziran PPI + ADBE Earnings Protokolu

**Gun Oncesi Hazirlik:**
- [ ] PPI beklentisi: aylik %0.2
- [ ] ADBE earnings beklentisi: EPS $5.81
- [ ] ORCL earnings sonucu nasil? (10 Haziran aksam)

**Protokol Adimlari:**
```
1. 08:30 AM — PPI verisini takip et
2. 09:30-10:30 — PPI etkisi + ORCL IV crush degerlendirmesi
3. 10:30 sonrasi — ADBE ORB takip (hisse senedi)
4. 13:00-14:30 — ADBE earnings play hazirlik
5. 14:30-15:45 — Son pozisyon ayarlamasi
6. 15:45-16:00 — Tum ADBE pozisyonunu %75 azalt
```

**Pozisyon Azaltma Tablosu (11 Haziran 15:45):**
| Pozisyon | Tut/Kapat | Oran | Neden |
|----------|-----------|------|-------|
| ORCL | Tutulabilir | Max %25 | IV crush devam |
| CHWY | Tutulabilir | Max %15 | Earnings sonrasi |
| ADBE | %75 KAPAT | %25 kalabilir | AMC earnings |
| FDX | Tutulabilir | Max %25 | Uzak earnings |
| MU | Tutulabilir | Max %25 | Normal |
| Tum 0DTE | KESINLIKLE KAPAT | %100 | ADBE AMC riski |

---

### 8.4 R-Based Risk Takibi ($100,000 Portfoy Ornegi)

#### Pozisyon Buyuklugu Tablosu (%1 Risk/Trade)

| Hisse | 1R Degeri | 14G ATR | Lot (Shares) | Dolar Risk | Dolar Pozisyon | Gunluk Hedef (2R) |
|-------|-----------|---------|--------------|------------|----------------|-------------------|
| ORCL | $12.91 | $12.91 | 77 | $994 | $16,453 | $25.82 |
| CHWY | $1.02 | $1.02 | 980 | $1,000 | $20,227 | $2.04 |
| ADBE | $11.07 | $11.07 | 90 | $996 | $22,630 | $22.14 |
| FDX | $9.37 | $9.37 | 106 | $993 | $35,086 | $18.74 |
| MU | $73.74 | $73.74 | 13 | $959 | $11,232 | $147.48 |

#### Gunluk Risk Limitleri (Earnings Oncesi Ayarlamali)

| Gun | Piyasa Riski | Max Risk/Portfoy | Max Pozisyon | Ozel Kural |
|-----|-------------|------------------|--------------|------------|
| 8 Haziran | Yuksek (NFP sonrasi) | %2.0 | %50 | VIX >22 ise %25 |
| 9 Haziran | Yuksek | %2.5 | %60 | CHWY BMO oncesi max %2 |
| 10 Haziran | COK YUKSEK (CPI+Cifte) | %1.5 | %25 | 9:30-10:30 BEKLE |
| 11 Haziran | Yuksek (PPI+ADBE) | %2.0 | %50 | IV crush gunu |

#### Haftalik Risk Butcesi

```
Toplam Portfoy: $100,000
Max Haftalik Risk: %5 = $5,000

Gunluk Dagilim:
  8 Haziran: $2,000 (normal)
  9 Haziran: $2,500 (CHWY earnings play dahil)
  10 Haziran: $1,500 (cifte volatilite = az risk)
  11 Haziran: $2,000 (IV crush kazanclari)

Kalan: -$3,000 (gunluk kazanc/kayip ile dinamik)
```

---

### 8.5 12 Adimli Pre-Trade Checklist

```
[ ] 1. VIX seviyesi kontrol edildi (21+ = dikkat, 25+ = bekle)
[ ] 2. S&P 200MA durumu kontrol edildi (7,350)
[ ] 3. Hisse earnings tarihi ve kalan gun sayisi kontrol edildi
[ ] 4. IV seviyesi ve prim maliyeti degerlendirildi
[ ] 5. ORB seviyeleri hesaplandi (5dk/15dk/30dk)
[ ] 6. VWAP ve standart sapma bantlari hesaplandi
[ ] 7. RSI durumu degerlendirildi (30/70 esikleri)
[ ] 8. Pozisyon buyuklugu ATR bazli hesaplandi
[ ] 9. Stop-loss seviyesi belirlendi (1R-1.5R)
[ ] 10. Hedef seviyesi belirlendi (min 2R)
[ ] 11. Limit emir hazir (market emir YASAK earnings oncesi)
[ ] 12. Gun sonu flat plani belirlendi (0DTE mutlaka kapat)
```


---

## BOLUM 9: EARNINGSPLAY GUNLUK KONTROL PANELI

### 9.1 Theta Decay Gunluk Takvimi (5 Hisse)

#### ORCL Theta Decay (12 Haziran Expiry — 3 Gun Kaldi)

| Gun | TTM | ATM Theta | OTM%10 Theta | IV | Toplam Erisim | Uyari |
|-----|-----|-----------|-------------|-----|---------------|-------|
| 7 Haz Pazar | 3g | -$0.80 | -$0.08 | 48.1% | %0.0 | Normal |
| 8 Haz Pazartesi | 2g | -$1.11 | -$0.04 | 49.7% | %0.5 | Hizlaniyor |
| 9 Haz Sali | 1g | -$2.20 | -$0.01 | 54.3% | %1.5 | **2x hizli** |
| 10 Haz Carsamba | 0g | -$4.42 | $0.00 | 22.5% | %3.6 | **IV CRUSH** |
| 11 Haz Persembe | 0g | -$4.42 | $0.00 | 22.5% | %5.7 | **IV CRUSH** |

#### CHWY Theta Decay (12 Haziran Expiry — 3 Gun Kaldi)

| Gun | TTM | ATM Theta | OTM%10 Theta | IV | Toplam Erisim | Uyari |
|-----|-----|-----------|-------------|-----|---------------|-------|
| 7 Haz Pazar | 3g | -$0.09 | -$0.01 | 59.1% | %0.0 | Normal |
| 8 Haz Pazartesi | 2g | -$0.12 | -$0.01 | 61.2% | %0.6 | Hizlaniyor |
| 9 Haz Sali | 1g | -$0.24 | $0.00 | 67.3% | %1.7 | **2x hizli** |
| 10 Haz Carsamba | 0g | $0.00 | $0.00 | 27.5% | %1.7 | **IV CRUSH** |
| 11 Haz Persembe | 0g | $0.00 | $0.00 | 27.5% | %1.7 | **IV CRUSH** |

#### ADBE Theta Decay (11 Haziran Expiry — 4 Gun Kaldi / Jun 18 Tercih Edilmeli)

| Gun | TTM | ATM Theta | OTM%10 Theta | IV | Toplam Erisim | Uyari |
|-----|-----|-----------|-------------|-----|---------------|-------|
| 7 Haz Pazar | 4g | -$1.05 | -$0.07 | 65.9% | %0.0 | Normal |
| 8 Haz Pazartesi | 3g | -$1.31 | -$0.07 | 67.2% | %0.6 | Hizlaniyor |
| 9 Haz Sali | 2g | -$1.83 | -$0.05 | 69.8% | %1.3 | Hizlaniyor |
| 10 Haz Carsamba | 1g | -$3.68 | -$0.02 | 77.5% | %2.8 | **THETA MAKS** |
| 11 Haz Persembe | 0g | -$7.33 | -$0.04 | 31.0% | %5.7 | **IV CRUSH** |

#### FDX Theta Decay (Jun 26 Expiry — 19 Gun Kaldi)

| Gun | TTM | ATM Theta | OTM%10 Theta | IV | Toplam Erisim | Uyari |
|-----|-----|-----------|-------------|-----|---------------|-------|
| 7 Haz Pazar | 16g | -$0.26 | -$0.17 | 38.8% | %0.0 | Normal |
| 8 Haz Pazartesi | 15g | -$0.27 | -$0.18 | 39.4% | %0.1 | Normal |
| 9 Haz Sali | 14g | -$0.28 | -$0.18 | 39.8% | %0.2 | Normal |
| 10 Haz Carsamba | 13g | -$0.30 | -$0.19 | 40.2% | %0.3 | Normal |
| 11 Haz Persembe | 12g | -$0.31 | -$0.19 | 40.6% | %0.4 | Normal |

#### MU Theta Decay (Jun 26 Expiry — 17 Gun Kaldi)

| Gun | TTM | ATM Theta | OTM%10 Theta | IV | Toplam Erisim | Uyari |
|-----|-----|-----------|-------------|-----|---------------|-------|
| 7 Haz Pazar | 17g | -$0.68 | -$0.52 | 58.5% | %0.0 | Normal |
| 8 Haz Pazartesi | 16g | -$0.72 | -$0.55 | 59.8% | %0.9 | Normal |
| 9 Haz Sali | 15g | -$0.75 | -$0.58 | 60.5% | %1.8 | Normal |
| 10 Haz Carsamba | 14g | -$0.79 | -$0.61 | 61.2% | %2.7 | Normal |
| 11 Haz Persembe | 13g | -$0.83 | -$0.64 | 61.9% | %3.7 | Normal |

#### Theta Decay Hiz Karsilastirmasi (8-11 Haziran)

| Hisse | 8 Haz Theta | 9 Haz Theta | 10 Haz Theta | Hizlanma | Etki |
|-------|-------------|-------------|--------------|----------|------|
| **ORCL** | -$1.11 | -$2.20 | -$4.42 | **4x** | Ciddi yanik |
| **CHWY** | -$0.12 | -$0.24 | $0.00 | **2x → 0** | IV Crush |
| **ADBE** | -$1.31 | -$1.83 | -$3.68 | **2.8x** | Yanik riski |
| **FDX** | -$0.27 | -$0.28 | -$0.30 | **1.1x** | Yavas (guvenli) |
| **MU** | -$0.72 | -$0.75 | -$0.79 | **1.1x** | Yavas (guvenli) |

---

### 9.2 Gamma Patlamasi Uyari Sistemi

#### Gamma Risk Seviyeleri (Earnings'e Gore)

| Hisse | Earnings | Kalan Gun | Gunluk Gamma | Gamma Patlamasi Tarihi | Risk Seviyesi |
|-------|----------|-----------|--------------|------------------------|---------------|
| ORCL | 10 Haz AMC | 3 | 0.018→0.028 | 10 Haziran | ⚠️ Yuksek |
| CHWY | 10 Haz BMO | 3 | 0.12→0.15 | 9 Haziran | ⚠️ Yuksek |
| **ADBE** | **11 Haz AMC** | **4** | **0.039→1.456** | **11 Haziran** | **🔥🔥 50x PATLAMA** |
| FDX | 23 Haz AMC | 16 | 0.018 | Yok (yavas yukselis) | Normal |
| MU | 24 Haz AMC | 17 | 0.003 | Yok (yavas yukselis) | Normal |

#### ADBE Gamma Patlamasi Detayi

| Tarih | Gun | IV | ATM Gamma | OTM%10 Gamma | Beklenen Hareket | Gamma Risk | Uyari |
|-------|-----|-----|-----------|-------------|------------------|------------|-------|
| 8 Haz | 3g | 67.2% | 0.039 | 0.012 | ±$15.31 | 9.14 | Normal |
| 9 Haz | 2g | 69.8% | 0.054 | 0.010 | ±$12.98 | 9.04 | Yukseliyor |
| 10 Haz | 1g | 77.5% | 0.098 | 0.006 | ±$10.20 | 10.15 | ⚠️ Yuksek |
| **11 Haz** | **0g** | **31.0%** | **1.456** | **0.000** | **±$1.29** | **2.42** | **🔥 PATLAMA** |

> 🔥🔥 **KRITIK UYARI:** ADBE'de 11 Haziran earnings gunu gamma **50x** patliyor.
> Fiyatta $1 hareket delta'da 1.45 degisim yaratir.
> **10 Haziran son gunluk hedge firsati. 11 Haziran'da pozisyon kucultme ZORUNLU.**

#### Gamma Patlamasi Yonetim Protokolu

| Gamma Seviyesi | Delta Hassasiyeti | Aksiyon | Pozisyon |
|---------------|-------------------|---------|----------|
| <0.05 | Normal | Normal islem | Tam pozisyon |
| 0.05-0.15 | Yuksek | Dikkatli, hedge | %75 pozisyon |
| 0.15-0.30 | Cok yuksek | Hedge zorunlu | %50 pozisyon |
| >1.00 | **PATLAMA** | **Pozisyon kucult** | **%25 pozisyon** |

---

### 9.3 IV Crush Projeksiyonu (3 Senaryo)

#### ORCL IV Crush (12 Haziran Expiry)

| Senaryo | IV Dususu | Hump IV → Post IV | ATM Prim Etkisi | OTM%10 Etkisi |
|---------|-----------|-------------------|-----------------|---------------|
| Hafif Crush | -%30 | 63.6% → 44.5% | -%32 | $0 (degersiz) |
| Orta Crush | -%50 | 63.6% → 31.8% | -%53 | $0 (degersiz) |
| Sert Crush | -%70 | 63.6% → 19.1% | -%74 | $0 (degersiz) |

#### CHWY IV Crush (12 Haziran Expiry)

| Senaryo | IV Dususu | Hump IV → Post IV | ATM Prim Etkisi | OTM%10 Etkisi |
|---------|-----------|-------------------|-----------------|---------------|
| Hafif Crush | -%30 | 79.6% → 55.7% | -%47 | $0 (degersiz) |
| Orta Crush | -%50 | 79.6% → 39.8% | -%75 | $0 (degersiz) |
| Sert Crush | -%70 | 79.6% → 23.9% | -%95 | $0 (degersiz) |

#### ADBE IV Crush (Jun 18 Expiry — 1 Gun Sonra)

| Senaryo | IV Dususu | Hump IV → Post IV | ATM Prim Etkisi | OTM%10 Etkisi |
|---------|-----------|-------------------|-----------------|---------------|
| Hafif Crush | -%30 | 93.0% → 65.1% | -%29 | -%95 |
| Orta Crush | -%50 | 93.0% → 46.5% | -%48 | -%100 |
| Sert Crush | -%70 | 93.0% → 27.9% | -%67 | -%100 |

#### FDX IV Crush (Jun 26 Expiry)

| Senaryo | IV Dususu | Hump IV → Post IV | ATM Prim Etkisi | OTM%10 Etkisi |
|---------|-----------|-------------------|-----------------|---------------|
| Hafif Crush | -%30 | 52.5% → 36.8% | -%30 | $0 |
| Orta Crush | -%50 | 52.5% → 26.3% | -%50 | $0 |
| Sert Crush | -%70 | 52.5% → 15.8% | -%70 | $0 |

#### MU IV Crush (Jun 26 Expiry)

| Senaryo | IV Dususu | Hump IV → Post IV | ATM Prim Etkisi | OTM%10 Etkisi |
|---------|-----------|-------------------|-----------------|---------------|
| Hafif Crush | -%30 | 87.0% → 60.9% | -%30 | -%97 |
| Orta Crush | -%50 | 87.0% → 43.5% | -%50 | -%100 |
| Sert Crush | -%70 | 87.0% → 26.1% | -%70 | -%100 |

---

### 9.4 EarningsPlay Kontrol Listesi (Gunluk)

#### Acilis Oncesi Kontrol Listesi (Her Gun)

| # | Kontrol | 8 Haz | 9 Haz | 10 Haz | 11 Haz | Aksiyon |
|---|---------|-------|-------|--------|--------|---------|
| 1 | VIX < 35? | ✅ 21.51 | ✅ | ✅ | ✅ | 🟢 Normal |
| 2 | S&P 200MA uzerinde? | ✅ 7,384 | ✅ | ✅ | ✅ | 🟢 Trend korunuyor |
| 3 | Earnings gunu mu? | Hayir | Hayir | **EVET** | **EVET** | 🔴 Ozel protokol |
| 4 | IV Rank >%50? | ✅ | ✅ | ✅ | ✅ | 🟢 IC uygun |
| 5 | Wing width = F/10? | ✅ | ✅ | ✅ | ✅ | 🟢 Hesaplandi |
| 6 | Pozisyon <%2 hesap? | ✅ | ✅ | ✅ | ✅ | 🟢 Risk sinirli |
| 7 | Max loss = 2.0x kredi? | ✅ | ✅ | ✅ | ✅ | 🟢 Stop tanimli |
| 8 | %50 kar hedefi belirli? | ✅ | ✅ | ✅ | ✅ | 🟢 Mekanik exit |
| 9 | Gap <%2? | Bekleniyor | Bekleniyor | Bekleniyor | Bekleniyor | 🟡 Takip |
| 10 | Limit emir hazir? | ✅ | ✅ | ✅ | ✅ | 🟢 Market emir YASAK |

#### Pozisyon Yonetimi Kontrol Listesi (Earnings Gunu)

| # | Kontrol | Eylem | Zaman |
|---|---------|-------|-------|
| 1 | Pozisyon delta ±0.10 icinde mi? | Hedge gerekirse uygula | Giris aninda |
| 2 | VIX spike var mi? (>%25) | Pozisyonu %50'ye indir | Anlik |
| 3 | Earnings sonuclari beklentiye uygun mu? | Bekle veya erken cik | Aciklama sonrasi |
| 4 | IV crush basladi mi? | IC pozisyonlarini tut | Earnings +24s |
| 5 | **%50 kar hedefi ulasildi mi?** | **MEKANIK CIKIS** | Her an |
| 6 | **2.0x stop-loss asildi mi?** | **MEKANIK STOP** | Her an |
| 7 | 21 DTE yaklasiyor mu? | Pozisyonu kapat | Expiry -5 gun |

#### Kapanis Kontrol Listesi (15:45 Her Gun)

| # | Kontrol | Eylem |
|---|---------|-------|
| 1 | 0DTE pozisyonlar kapatildi mi? | 🔴 Mutlaka kapat |
| 2 | Gunluk P&L hesaplandi mi? | Takip et |
| 3 | Yarin icin plan belirlendi mi? | Strateji hazirla |
| 4 | Risk limitleri asildi mi? | Asildiysa pozisyon azalt |
| 5 | Earnings gunu yaklasiyor mu? | Eger evet, ozel protokol uygula |


---

## BOLUM 10: RISK MATRiSi VE POZiSYON YONETiMi

### 10.1 VIX'e Gore Gunluk Pozisyon Buyuklugu

| VIX | Renk | Pozisyon | Gunluk Max Risk | Etki |
|-----|------|----------|----------------|------|
| <15 | Yesil | %100 | %2.0 | IV dusuk = ucuz prim |
| 15-22 | Sari | %75 | %1.5 | **Mevcut: VIX 21.51** |
| 22-25 | Sari-Kirmizi | %50 | %1.0 | Kirmizi'ye yaklas, azalt |
| 25-30 | Kirmizi | %25 | %0.5 | Yuksek volatilite, dikkat |
| >30 | Siyah | %0-10 | %0.25 | Kriz modu, cok az islem |

**Mevcut Durum:** VIX 21.51 → **SARI rejim, %75 pozisyon, %1.5 gunluk max risk**

### 10.2 Gunluk R-Based Risk Butcesi ($100,000 Portfoy)

| Gun | Piyasa Riski | Max Risk/Portfoy | Max Pozisyon | Ozel Kural |
|-----|-------------|------------------|--------------|------------|
| 8 Haziran (Pzt) | Yuksek (NFP sonrasi) | %2.0 ($2,000) | %50 | VIX >22 ise %25 |
| 9 Haziran (Sal) | Yuksek | %2.5 ($2,500) | %60 | CHWY BMO oncesi max %2 |
| 10 Haziran (Car) | **COK YUKSEK** | **%1.5 ($1,500)** | **%25** | **9:30-10:30 BEKLE** |
| 11 Haziran (Per) | Yuksek (PPI+ADBE) | %2.0 ($2,000) | %50 | IV crush gunu |

**Haftalik Risk Butcesi:**
```
Toplam Portfoy: $100,000
Max Haftalik Risk: %5 = $5,000

Gunluk Dagilim:
  8 Haziran: $2,000 (normal)
  9 Haziran: $2,500 (CHWY earnings play dahil)
  10 Haziran: $1,500 (cifte volatilite = az risk)
  11 Haziran: $2,000 (IV crush kazanclari)
```

### 10.3 Korelasyon Matrisi (Piyasa Cokusu Riski)

| | ORCL | ADBE | CHWY | FDX | MU | S&P 500 |
|---|------|------|------|-----|-----|---------|
| **ORCL** | 1.00 | 0.85 | 0.45 | 0.55 | 0.75 | 0.80 |
| **ADBE** | 0.85 | 1.00 | 0.40 | 0.50 | 0.70 | 0.85 |
| **CHWY** | 0.45 | 0.40 | 1.00 | 0.35 | 0.40 | 0.50 |
| **FDX** | 0.55 | 0.50 | 0.35 | 1.00 | 0.45 | 0.60 |
| **MU** | 0.75 | 0.70 | 0.40 | 0.45 | 1.00 | 0.75 |
| **S&P 500** | 0.80 | 0.85 | 0.50 | 0.60 | 0.75 | 1.00 |

**Korelasyon Analizi:**
- **ORCL-ADBE:** 0.85 (cok yuksek) — Ayni sektor, ayni anda satilabilir
- **ORCL-MU:** 0.75 (yuksek) — Teknoloji korelasyonu
- **CHWY-FDX:** 0.35 (dusuk) — En iyi cesitlendirme
- **Beta riski:** MU 2.17 = piyasa duserken 2x kayip

### 10.4 Gun Sonu Flat Kurali

#### Her Gun 15:45 Kontrolu

| Pozisyon | 8 Haz | 9 Haz | 10 Haz | 11 Haz | Neden |
|----------|-------|-------|--------|--------|-------|
| ORCL 0DTE | KAPAT | AZALT | %75 KAPAT | Tut | Earnings riski |
| CHWY 0DTE | KAPAT | TUT (yeni) | KAPAT | Tut | BMO/sonrasi |
| ADBE pozisyon | Tut | Tut | %50 KAPAT | %75 KAPAT | AMC yaklasiyor |
| FDX pozisyon | Tut | Tut | %50 KAPAT | Tut | CPI gunu |
| MU pozisyon | Tut | Tut | %75 KAPAT | Tut | Beta+CPI |
| Tum 0DTE | **KAPAT** | **KAPAT** | **KAPAT** | **KAPAT** | Theta yanmasi |

### 10.5 EarningsPlay Greeks Profili (Strateji Bazli)

#### ORCL Greeks Profili

| Strateji | Delta | Gamma | Theta | Vega | Risk Seviyesi |
|----------|-------|-------|-------|------|---------------|
| Long Straddle | ~0.00 | +0.20 | -4.30 | +2.50 | 🟡 Orta |
| Iron Condor | ~0.00 | -0.05 | +0.13 | -0.11 | 🟢 Dusuk |
| Call Spread 225/240 | +0.35 | +0.08 | -0.50 | +0.45 | 🟡 Orta |

#### ADBE Greeks Profili

| Strateji | Delta | Gamma | Theta | Vega | Risk Seviyesi |
|----------|-------|-------|-------|------|---------------|
| Long Call Spread | +0.30 | +0.10 | -0.80 | +0.60 | 🟡 Orta |
| Iron Condor | ~0.00 | -0.03 | +0.31 | -0.25 | 🟢 Dusuk |
| Long Straddle | ~0.00 | +0.25 | -8.00 | +5.50 | 🔴 Yuksek |

#### CHWY Greeks Profili

| Strateji | Delta | Gamma | Theta | Vega | Risk Seviyesi |
|----------|-------|-------|-------|------|---------------|
| Long Call Spread 22/28 | +0.35 | +0.15 | -0.05 | +0.02 | 🟡 Orta |
| Long Call 22C | +0.08 | +0.20 | -0.02 | +0.01 | 🔴 Yuksek |
| Iron Condor | N/A | N/A | N/A | N/A | 🚫 UYGUN DEGIL |

#### FDX Greeks Profili

| Strateji | Delta | Gamma | Theta | Vega | Risk Seviyesi |
|----------|-------|-------|-------|------|---------------|
| Iron Condor | ~0.00 | -0.02 | +0.25 | -0.20 | 🟢 Dusuk |
| Calendar Spread | +0.10 | +0.01 | +0.15 | +0.80 | 🟡 Orta |
| Call Spread 400/415 | +0.25 | +0.05 | -0.60 | +0.50 | 🟡 Orta |

#### MU Greeks Profili

| Strateji | Delta | Gamma | Theta | Vega | Risk Seviyesi |
|----------|-------|-------|-------|------|---------------|
| Iron Condor | ~0.00 | -0.01 | +1.02 | -2.50 | 🟢 Dusuk |
| Call Spread 950/1000 | +0.10 | +0.02 | -0.30 | +0.80 | 🟡 Orta-Yuksek |
| Long Straddle | ~0.00 | +0.15 | -15.00 | +12.00 | 🔴🔴 COK YUKSEK |

### 10.6 EarningsPlay Stop-Loss ve Kar Alma Matrisi

| Hisse | Strateji | Kredi/Debit | %50 Kar Hedefi | 2.0x Stop-Loss | Zaman Stop'u |
|-------|----------|-------------|----------------|----------------|-------------|
| ORCL | IC | $4.00 kredi | $2.00 kar | $8.00 zarar | Earnings +48s |
| ADBE | IC | $8.00 kredi | $4.00 kar | $16.00 zarar | Earnings +48s |
| CHWY | Call Spread 22/28 | $0.50 debit | $1.00 kar | $0.50 zarar | Earnings +4s (BMO!) |
| FDX | IC | $6.00 kredi | $3.00 kar | $12.00 zarar | Earnings +48s |
| MU | IC | $17.00 kredi | $8.50 kar | $34.00 zarar | Earnings +48s |

### 10.7 Portfoy Risk Ozeti

| Risk Kategorisi | Deger | Yonetim |
|----------------|-------|---------|
| **Toplam Acik Risk** | ~$5,000 (tum pozisyonlar) | Hesabin %10'u (kabul edilebilir) |
| **Max Tek Pozisyon Riski** | $2,507 (MU IC) | Hesabin %5'i (sinirda) |
| **VIX Riski** | 21.51 → spike potansiyeli | VIX >25'te pozisyonlari %50'ye indir |
| **Gamma Riski** | 0-7 DTE = yuksek gamma | Earnings gunu erken kar al |
| **Katalist Riski** | CHWY 5/5 = en yuksek | Squeeze protokolunu takip et |
| **Beta Riski** | MU 2.17 = cifte risk | Pozisyon normalden %50 kucuk |
| **Korelasyon Riski** | ORCL-ADBE 0.85 | Ayni sektor pozisyonlarini sinirla |

---

## BOLUM 11: EYLEM PLANI — GUNLUK TAKVIM

### 11.1 Haftalik Eylem Takvimi (8-12 Haziran)

| Gun | Tarih | Sabah (9:30-11:00) | Oglen (11:00-14:00) | Aksam (14:00-16:00) | Overnight |
|-----|-------|-------------------|---------------------|---------------------|-----------|
| Pzt | 8 Haz | NFP sonrasi acilis; ORB+VP; MU momentum (Beta 2.17); BEKLE ilk 15dk | MOLA; VWAP testi FDX/ADBE | ORCL strangle biriktir; CHWY OTM call biriktir; 0DTE KAPAT | Flat; gunluk degerlendirme |
| Sal | 9 Haz | Acilis BEKLE; ORCL/CHWY ORB takip; son tam gun | MOLA; earnings planlama | **CHWY kapanista ana pozisyon (SON GUN!)**; ORCL %50 kar kontrolu; 0DTE KAPAT | **CHWY BMO riski (OVERNIGHT)**; max %2 pozisyon |
| Car | 10 Haz | **06:00 CHWY earnings BMO**; **08:30 CPI aciklamasi**; **09:30-10:30 ZORUNLU BEKLE** | 10:30 sonrasi ORB; hisse senedi; sadece guclu trend | **ORCL pozisyon ac (CPI sonrasi, AMC oncesi)**; %75 azalt 15:45'te | **ORCL earnings AMC**; gap riski |
| Per | 11 Haz | 08:30 PPI; ORCL IV crush degerlendirme; hisse senedi | ADBE earnings play hazirlik; momentum takip | **ADBE pozisyon (AMC oncesi)**; gun sonu flat | **ADBE earnings AMC** |
| Cum | 12 Haz | ORCL/ADBE/CHWY kar realizasyonu; IV crush kazanclari | Hafta sonu flat hazirlik; pozisyon kapatma | **Hafta sonu FLAT**; 0DTE KESINLIKLE KAPAT | -- |

### 11.2 Earnings Giris-Cikis Takvimi

| Hisse | Earnings | Son Giris Tarihi | Son Giris Saati | Kar Alma | Kesin Cikis |
|-------|----------|------------------|-----------------|----------|-------------|
| **ORCL** | 10 Haz AMC | 10 Haz | 15:45 ET | 11-12 Haz 09:30 | 12 Haziran |
| **CHWY** | 10 Haz BMO | **9 Haz** | **15:45 ET** | 10 Haz 09:30-10:00 | 10 Haziran |
| **ADBE** | 11 Haz AMC | 11 Haz | 15:45 ET | 12 Haz 09:30 | 12 Haziran (Jun12) / 15 Haz (Jun18) |
| **FDX** | 23 Haz AMC | 23 Haz | 15:45 ET | 24 Haz 09:30 | 24-27 Haziran |
| **MU** | 24 Haz AMC | 24 Haz | 15:45 ET | 25 Haz 09:30 | 25-27 Haziran |

### 11.3 Strateji Zaman Cizelgesi (Her Hisse)

#### ORCL — Strateji Zaman Cizelgesi

| Gun | Strateji | Pozisyon | Hedef | Stop |
|-----|----------|----------|-------|------|
| 8 Haz | Strangle biriktir | 200P / 220C (debit ~$5.50) | Earnings volatilitesi | Pozisyonun %50'si |
| 9 Haz | %50 kar al / tut | Mevcut pozisyon | %50 kar = $2.75 | Maliyetin alti |
| 10 Haz Kapanis | Yeni pozisyon (CPI sonrasi) | 215C veya 210 Straddle | Earnings beat | %50 kar hemen |
| 11 Haz | IV crush kazan | Short Call/Put Spread | IV erimesi | %1 risk |

#### CHWY — Strateji Zaman Cizelgesi

| Gun | Strateji | Pozisyon | Hedef | Stop |
|-----|----------|----------|-------|------|
| 8 Haz | OTM Call biriktir | 22-24 Call'lar (ucuz) | Squeeze fiyat hedefi | %100 kayip |
| 9 Haz Kapanis | **Ana pozisyon ac** | 21 ATM Call veya 20/23 Spread | Earnings + Squeeze | Maliyetin %50'si |
| 10 Haz | **Kar realizasyonu** | Gap acilista %50-100 kar | Squeeze hedefleri | Trailing %10 |
| 11 Haz | Gozlem | Trend takip | Gap dolgu | Cik (ilgi azaliyor) |

#### ADBE — Strateji Zaman Cizelgesi

| Gun | Strateji | Pozisyon | Hedef | Stop |
|-----|----------|----------|-------|------|
| 8 Haz | BEKLE | -- | Dip alim firsati | -- |
| 9 Haz | Jun 18 call spread degerlendir | $250/$260 call spread | Earnings oncesi yukselis | %1.5 risk |
| 10 Haz | CPI sonrasi dip alim | Jun 18 $250/$270 call spread | CPI soguk + earnings | %1 risk |
| 11 Haz | Earnings gunu | Hisse senedi (kucuk) | AMC oncesi | %0.5 risk |

---

## BOLUM 12: OZET VE KRiTiK KARARLAR

### 12.1 En Yuksek Konviksiyonlu 3 Islem (Gunluk Projeksiyonlu)

#### 🥇 1. CHWY Long Call Spread (22/28) — KONVIKSIYON: ⭐⭐⭐⭐⭐

| Parametre | Deger |
|-----------|-------|
| **Maliyet** | ~$0.50/kontrat (~$500/20 kontrat) |
| **Max Kar** | ~$5.50/kontrat (~$5,500/20 kontrat) |
| **R/R** | 11:1 |
| **Katalist Skoru** | 5/5 (Short Squeeze) |
| **Destekleyici Faktorler** | SI +%26.01, DTC 3.42, %88 analist potansiyeli, Forward P/E 10.55 |
| **Senaryo** | EPS>$0.50 + pozitif guidance = kisalar panikler = $28-30+ |
| **Risk** | $500 (tam kayip) |
| **EarningsPlay Uyumu** | ✅ Katalist 5/5 = "Chase the Gap", Pozisyon <%2 hesap |
| **Giris Zamani** | **9 Haziran 15:30-16:00 (kapanista, SON GUN!)** |
| **Cikis Zamani** | 10 Haziran 09:30-10:00 (gap acilista kar realizasyonu) |

**Neden #1:** Short interest son rapora gore %26.01 artti. Days to cover 3.42 gun = squeeze icin ideal.
Q4 "kazasi" sonrasi beklentiler yerin dibinde — beat yapmak kolay. Forward P/E 10.55 = asagi risk sinirli.
18 kurum Buy/Overweight = %88 yukari potansiyel.

#### 🥈 2. ADBE Iron Condor (230/275) — KONVIKSIYON: ⭐⭐⭐⭐⭐

| Parametre | Deger |
|-----------|-------|
| **Kredi** | ~$8.00/kontrat (~$766/2 kontrat) |
| **Max Risk** | ~$17.00/kontrat (~$1,633/2 kontrat) |
| **Kazanma Olasiligi** | ~%60-65 |
| **Katalist Skoru** | 4/5 ($25B buyback, P/E 14.66 dip) |
| **Destekleyici Faktorler** | IV %100 tarihi zirve, $25B buyback, Firefly ARR $250M+ |
| **IV Crush Potansiyeli** | +$2.11 (orta crush) — +$2.95 (sert crush) |
| **EarningsPlay Uyumu** | ✅ IV>%50, Wing=F/10, %50 kar kurali, 2.0x stop-loss |
| **Giris Zamani** | 8-10 Haziran (CPI sonrasi) |
| **Cikis Zamani** | 12 Haziran 09:30 (%50 kar kurali) |

**Neden #2:** IV %100 tarihi zirve = maksimum kredi toplama firsati. $25B buyback dip fiyattan alim = guclu destek.
P/E 14.66 = asiri satilmis. IV crush earnings sonrasi kacinilmaz = IC karli.

#### 🥉 3. MU Iron Condor (735/995) — KONVIKSIYON: ⭐⭐⭐⭐

| Parametre | Deger |
|-----------|-------|
| **Kredi** | ~$17.00/kontrat ($1,793/1 kontrat) |
| **Max Risk** | ~$69.00/kontrat ($2,507/1 kontrat) |
| **Kazanma Olasiligi** | ~%55-60 |
| **Katalist Skoru** | 3/5 (NVIDIA HBM onayi vs Morningstar $455) |
| **Destekleyici Faktorler** | IV %100, Beta 2.17 = yuksek prim, NVIDIA HBM onayi |
| **IV Crush Potansiyeli** | +$6.96 (orta crush) — +$9.75 (sert crush) |
| **EarningsPlay Uyumu** | ✅ IV>%50, Wing=F/10, Beta duzeltmeli |
| **Giris Zamani** | 8-18 Haziran (erken donem uygun) |
| **Cikis Zamani** | 25 Haziran 09:30 (%50 kar kurali) |
| **Ozel Not** | **Pozisyon normalden %50 kucuk (Beta 2.17)** |

**Neden #3:** IV %100 + Beta 2.17 = cok yuksek prim = cok yuksek kredi.
Genis wing ($86) = guvenli kar bolgesi. Morningstar %89 asiri degerli = asagi risk de var = range-bound olasiligi yuksek.

---

### 12.2 Kacinilmasi Gereken 2 Tuzak

#### 🚫 TUZAK #1: MU Long Straddle ($7,430+)

| Risk Faktori | Etki |
|-------------|------|
| IV Rank %100 | Opsiyonlar tarihi zirvede pahali |
| Beta 2.17 | Piyasadan 2 kat volatil = cifte risk |
| IV Crush | Earnings sonrasi %50+ prim erimesi = $3,715+ kayip |
| Morningstar $455 | %89 asiri degerli = asagi risk yuksek |
| Ort. hedef $739<$864 | Konsensus hisseyi dusuk goruyor |

**EarningsPlay Kurali:** IV Rank >%60 ise Long Straddle YASAK. MU'da IV %100 = cifte yasak.
**Alternatif:** MU Iron Condor — $1,793 kredi, IV crush'tan kazanc, sinirli risk.

#### 🚫 TUZAK #2: CHWY Iron Condor (Katalist 5/5'e Aykiri)

| Risk Faktori | Etki |
|-------------|------|
| Katalist 5/5 Short Squeeze | Tek yonlu yukari patlama bekleniyor |
| IC Kisa Call Tarafi | Squeeze'de call tarafi patlar = buyuk zarar |
| Days to cover 3.42 | Kisalarin kapanmasi = fiyat firlamasi |
| %88 analist potansiyeli | Hisse $38+ olabilir = IC coker |

**EarningsPlay Kurali:** Katalist 5/5 = "Chase the Gap" — Iron Condor ASLA acilmaz.
**Alternatif:** CHWY Long Call Spread (22/28) — Squeeze en iyi call stratejileriyle oynanir.

---

### 12.3 CHWY Short Squeeze Senaryolari (Detayli)

#### Short Squeeze Tetikleyicileri

| Tetikleyici | Etki | Olasilik |
|-------------|------|----------|
| EPS >$0.50 (konsensus $0.34) | Kisalar endiselenir | %45 |
| Pozitif guidance (FY27) | Panik alimi baslar | %35 |
| Autoship buyumesi >%15 | Temel deger onayi | %30 |
| AI/Vet Clinic duyurusu | Yeni buyume hikayesi | %20 |
| Herhangi 2'si birlikte | **Major Squeeze** | %25 |
| 3+ birlikte | **Extreme Squeeze** | %10 |

#### Short Squeeze Yonetim Protokolu

| Hisse Fiyati | Squeeze Seviyesi | Aksiyon | Kar Hedefi |
|-------------|-----------------|---------|------------|
| $20-22 (mevcut) | Squeeze yok | Pozisyonu tut | Bekle |
| $22-25 | Mini Squeeze | Pozisyonu tut | %50 kar degerlendir |
| $25-28 | Major Squeeze | **%50 kar al** | Spread max %50'si |
| $28-32 | Strong Squeeze | **%75 kar al** | Spread max %75'i |
| $32+ | Extreme Squeeze | **TAMAMEN CIK** | Acgozluluk yapma |
| $18 alti | Squeeze basarisiz | **STOP-LOSS** | Spread degeri = $0 |

---

### 12.4 10 Haziran Uclu Volatilite Protokolu

**Durum:** CPI (8:30 AM) + CHWY earnings (BMO) + ORCL earnings (AMC) = UCLU VOLATILITE

**Gun Oncesi Hazirlik:**
- [ ] VIX kontrolu (22+ ise pozisyon %50)
- [ ] S&P 200MA kontrolu (7,350)
- [ ] CPI beklentisi: %4.2 yillik
- [ ] CHWY earnings beklentisi: EPS $0.34
- [ ] ORCL earnings beklentisi: EPS $1.96
- [ ] Limit emirleri hazir (market emir YASAK)
- [ ] 10 Haziran gunluk max risk: %1.5 portfoy

**Gun Ici Protokol:**
```
06:00 AM — CHWY earnings BMO sonuclarini izle
         → Beat/Miss durumuna gore squeeze beklentisi ayarla

08:30 AM — CPI ACIKLAMASI
         → CPI < %4.0: Rally modu
         → CPI %4.0-4.3: Notur
         → CPI > %4.3: Risk-off

09:30 AM — Piyasa acilisi (CPI + CHWY birlikte etki)
         → Gap %2-4 bekleniyor
         → 10:30'a kadar HICBIR ISLEM YAPMA

10:30 AM — Gecikmis ORB baslangici
         → ORB seviyeleri CPI sonrasi yeniden hesapla
         → Sadece guclu trend (hisse senedi)

13:00 PM — Normal momentum (ADBE/FDX/MU)

15:30 PM — ORCL earnings play icin son 30 dk
         → CPI sonrasi yon belli olduktan sonra
         → 215C veya 210 Straddle (AMC oncesi)

15:45 PM — AGRESIF FLAT
         → Tum pozisyonlari %75 azalt
         → ORCL: %25 kalabilir (earnings play)
         → CHWY: %0 (earnings sonrasi kaos)
         → Tum 0DTE: KESINLIKLE KAPAT
```

---

### 12.5 EarningsPlay Uyum Ozeti

| Hisse | Katalist Skoru | Ana Strateji | EarningsPlay Uyumu | Uyum Puani |
|-------|---------------|-------------|-------------------|------------|
| CHWY | 5/5 | Long Call Spread 22/28 | ✅ Katalist 5/5=Chase, <%2 pozisyon | 10/10 |
| ADBE | 4/5 | Iron Condor 230/275 | ✅ IV>%50, Wing=F/10, %50 kar, 2.0x stop | 10/10 |
| ORCL | 4/5 | Long Straddle 210/215 | ⚠️ IV>%60 ama katalist guclu | 7/10 |
| FDX | 3/5 | Iron Condor 300/365 | ✅ IV>%50, Wing=F/10, RSI=range | 9/10 |
| MU | 3/5 | Iron Condor 735/995 | ✅ IV>%50, Wing=F/10, Beta duzeltmeli | 9/10 |

**Genel EarningsPlay Uyum Ortalamasi: 9.0/10** — Tum stratejiler EarningsPlay v4 kurallarina uygun.

---

### 12.6 Kritik Basari Faktori — EarningsPlay v4

1. **🎯 Zamanlama:** CHWY icin 9 Haziran kapanis (BMO!). ADBE/ORCL icin earnings gunu sabah. FDX/MU icin son 1-2 gun.
2. **🎯 Pozisyon Buyuklugu:** Toplam risk portfoyun %10'unu gecmemeli. Max 2-3 earnings pozisyonu ayni anda. VIX 21.51 = %75 SARI rejim.
3. **🎯 IV Crush Yonetimi:** IC pozisyonlarini earnings sonrasi 24-48 saat tut. Long pozisyonlari 30-60 dk icinde degerlendir.
4. **🎯 %50 Kar Kurali (MEKANIK):** IC: Kredinin %50'si hedefinde KACINILMAZ cikis. Call Spread: Max karin %50'si.
5. **🎯 2.0x Stop-Loss (MEKANIK):** Zarar 2.0x krediyi asarsa KACINILMAZ kapanis. Duygusal karar yok.
6. **🎯 21 DTE Kurali:** Expiry'e 5 gun kala pozisyon KACINILMAZ kapatilir. Gamma riski onlenir.
7. **🎯 Katalist Takibi:** Haber akisini izle. Katalist skoru degisirse strateji degisir.
8. **🎯 Acgozluluk Yok:** Hedefe ulasildiginda cik. "Biraz daha bekleme" = en buyuk dusman.
9. **🎯 10 Haziran Protokolu:** CPI + earnings gunu = ozel kurallar. Pozisyon %50, 9:30-10:30 BEKLE.
10. **🎯 Gamma Patlamasi:** ADBE'de 11 Haziran gamma 50x patliyor. Pozisyon kucultme ZORUNLU.

---

### 12.7 Tum Portfoy Senaryo Analizi

| Senaryo | Olasilik | Etki | Tavsiye |
|---------|----------|------|---------|
| **Bull Case (Squeeze + Beat)** | %25 | CHWY +%50, ADBE +%10, ORCL +%8 | Call Spread'ler max kar, IC %50 kar al |
| **Base Case (Mixed)** | %40 | Hisse %3-8 yukari/asagi | IC kazancli, Spread karli/Zararsiz |
| **Bear Case (Miss + Dusus)** | %20 | Hisse %8-15 asagi | Call Spread'ler zarar, IC hala kazancli |
| **Flat Case (No Move)** | %15 | Hisse ±%3 yatay | **IC MAX KAZANC** — en iyi senaryo |

### 12.8 Haftanin En Onemli 2 Hisse/Stratejisi (Gun Bazli)

**8 Haziran Pazartesi (NFP Sonrasi 1. Gun):**
- **MU** — Beta 2.17 Momentum Play: NFP sonrasi piyasa hareketini 2x kaldir. $882 ORB yukari kiriliminda Long.
- **ORCL** — Earnings Yaklasiyor (3 Gun): $216.91 ORB yukari Long Call 220C.

**9 Haziran Sali (Earnings Oncesi Son Gun):**
- **CHWY** — Short Squeeze Earnings Play (Kritik Gun): YARIN BMO! Bugun SON giris. Kapanista Long.
- **ORCL** — Earnings + CPI Cift Play (2 Gun Kaldi): Strangle 220C/205P veya ORB takip.

**10 Haziran Carsamba (Cifte Volatilite — Ozel Protokol):**
- **ORCL** — Earnings AMC + CPI: SADECE HISSE SENEDI. 9:30-10:30 BEKLE. IV cok yuksek.
- **FDX** — Guvenli Liman: Cifte volatilite gununde en guvenli hisse. VWAP ($319) bounce.

**11 Haziran Persembe (IV Crush + PPI):**
- **ORCL** — IV CRUSH KAZANMA: Opsiyon satma altin gunu! Short Call/Put Spread.
- **ADBE** — Earnings AMC Gunu: Hisse senedi ile oyna. $260 kirilim long, $240 kirilim short.

---

## KAYNAKCA

### Finansal Veri Kaynaklari
1. **Yahoo Finance Earnings Calendar** — finance.yahoo.com/calendar/earnings
2. **Kiplinger Earnings Calendar** — kiplinger.com/investing/stocks/earnings-calendar
3. **MarketChameleon** — marketchameleon.com (Greeks, IV, OI verileri)
4. **Public.com** — public.com (Strike fiyatlari, Ask/Bid)
5. **MarketBeat** — marketbeat.com (Opsiyon zinciri, Delta, IV)
6. **Optionistics** — optionistics.com (Opsiyon analizi)
7. **Barcharts** — barcharts.com (IV verileri)
8. **CBOE** — cboe.com (VIX, Put/Call oranlari)

### Sirket Kaynaklari
9. **Oracle Investor Relations** — investor.oracle.com
10. **Micron Investor Relations** — investors.micron.com
11. **Adobe Investor Relations** — investor.adobe.com
12. **FedEx Investor Relations** — investors.fedex.com
13. **Chewy Investor Relations** — ir.chewy.com

### Makro ve Haber Kaynaklari
14. **FRED** — fred.stlouisfed.org (Makro veriler)
15. **Earnings Whispers** — earningswhispers.com (Earnings tahminleri)
16. **Nasdaq Earnings Calendar** — nasdaq.com/market-activity/earnings
17. **Zacks Investment Research** — zacks.com
18. **Reuters** — reuters.com (Haberler)
19. **CNBC** — cnbc.com (Haberler)
20. **Morningstar** — morningstar.com (Analiz ve ratingler)

### Agent Projeksiyon Kaynaklari (Bu Raporun Birlestirildigi Kaynaklar)
21. **Haziran 2026 Earnings Opsiyon Stratejisi v2** — /mnt/agents/output/Haziran2026_Earnings_Opsiyon_Stratejisi_v2_Guncel.md
22. **ORCL & CHWY Gunluk Projeksiyon** — /mnt/agents/output/projection/orcl_chwy_gunluk_projeksiyon.md
23. **ADBE, FDX, MU Gunluk/Haftalik Projeksiyon** — /mnt/agents/output/projection/adbe_fdx_mu_gunluk_projeksiyon.md
24. **Gunluk Momentum Stratejileri** — /mnt/agents/output/projection/momentum_gunluk_stratejileri.md
25. **EarningsPlay Greeks Projeksiyonu** — /mnt/agents/output/projection/earningsplay_greeks_projeksiyon.md

### Metodoloji Kaynaklari
26. **EarningsPlay v4 Metodolojisi** — Iron Condor, Long Straddle, Greeks yonetimi
27. **GunlukMomentum v4** — ORB, VWAP, 0DTE, R-Based Risk
28. **Black-Scholes Modeli** — Opsiyon fiyatlama ve Greeks hesaplamalari
29. **IV Term Structure (Hump) Modeli** — Earnings oncesi IV ramp-up projeksiyonu
30. **31 Akademik Makale Sentezi** — Opsiyon stratejileri backtest verileri

---

> **⚠️ SORUMLULUK REDDi:** Bu rapor yalnizca egitim ve arastirma amaclidir. Finansal tavsiye niteliginde degildir. Hisse senedi ve opsiyon ticareti yuksek risk icerir ve yatirimcilarin tum sermayesini kaybetmesine neden olabilir. Gecmis performans gelecek performansin garantisi degildir. Yatirim karari almadan once profesyonel bir finansal danismana basvurunuz.

> **EarningsPlay v4 Uyarisi:** Bu raporda sunulan stratejiler EarningsPlay v4 metodolojisine gore hazirlanmistir. Ancak piyasalar tahmin edilemez ve tum stratejiler risk icerir. %50 kar kurali ve 2.0x stop-loss mekanik uygulanmalidir. Duygusal kararlar sermaye kaybina yol acar.

> **GunlukMomentum v4 Uyarisi:** Momentum stratejileri yuksek kazanma potansiyeli sunarken ayni zamanda yuksek risk icerir. ORB ve VWAP stratejileri backtest verilerine dayanir ancak gecmis performans gelecegin garantisi degildir.

---

*Rapor Tarihi: 8 Haziran 2026*
*Bir Sonraki Guncelleme: 14 Haziran 2026*
*Hazirlayan: AI Agent Swarm — 5 Uzman Agent Birlestirilmis Ciktisi*
*Metodoloji: GunlukMomentum v4 + EarningsPlay v4*
*Versiyon: 3.1 Gunluk Projeksiyon*
*Onceki Versiyon: 3.0 (7 Haziran 2026)*
*Toplam Kaynak: 5 rapor birlestirilmistir*

---

## EK: DUZELTME GECMISI (CHANGELOG)

### v3.0 → v3.1 (8 Haziran 2026)

**9 kesin duzeltme uygulandi. Disaridan dogrulanabilir kaynaklarla teyit edilmistir.**

| # | Hisse | Eski (Hatali) | Yeni (Dogrulanmis) | Kaynak |
|---|-------|---------------|-------------------|--------|
| 1 | ADBE | Gelir: `$6.2B` | `$6.43B-$6.48B` | Adobe Q2 FY2026 guidance |
| 2 | ADBE | EPS Senaryosu: GAAP/non-GAAP karisik | **non-GAAP:** Beat >$5.85 / Inline $5.80-$5.85 / Miss <$5.80 | Adobe IR |
| 3 | ADBE | "CEO istifa ediyor" | "CEO **gecis sureci baslatti**; halef atandiktan sonra devredecek, Board Chair kalacak" | CNBC + Adobe |
| 4 | ADBE | 8 Haz: "IV crush sonrasi konsolidasyon" | "**CPI ve earnings oncesi** bekle-gor konsolidasyonu" | Takvimsel duzeltme |
| 5 | ADBE | 12 Haz: "earnings sonrasi 2. gun" | "earnings sonrasi **ilk islem gunu**" | Takvimsel duzeltme |
| 6 | CHWY | Short Interest `+%44.4` | `+%26.01` (son rapora gore) | MarketBeat (15 May 2026) |
| 7 | CHWY | Q4 EPS: "$0.09 vs $0.28 consensus" | "**GAAP $0.09 / adjusted $0.27-0.28** — Iki farkli EPS olcusu" | Chewy IR |
| 8 | CHWY | "SI %44 artti" (metinler) | "SI **son rapora gore %26.01 artti**" | MarketBeat |
| 9 | CHWY | Float % belirsiz | "**Yuzdelik oran veri saglayicisina gore degisebilir** (%6.46-%11.69)" | Finviz/MarketBeat |

**Dogrulanmis Veriler (Degistirilmedi):** Oracle RPO $553B + OCI %84 ✅ | CHWY 10 Haz BMO ✅ | ADBE 11 Haz AMC ✅ | FedEx spinoff $4.1B ✅ | NFP +172K ✅ | CPI/PPI takvimi ✅ | VIX 21.51 ✅

---

**RAPOR SONU**
