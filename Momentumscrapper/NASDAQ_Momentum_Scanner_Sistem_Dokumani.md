# NASDAQ Momentum Scanner - Sistem Dokumani

## 1. Genel Bakis

NASDAQ Momentum Scanner, NASDAQ borsasinda islem goren hisse senetlerini tarayarak gune ilk yarim saatte en guclu momentumu gosteren hisseleri bulan, gecemis verilerle ogrenmis yapay zeka destekli bir pattern recognition sistemi ile bu hareketin gun boyu devam edip etmeyecegini tahmin eden ve buna gore opsiyon stratejileri oneren kapsamli bir trading analiz platformudur.

## 2. Sistem Mimarisi

### 2.1 Katmanlar

```
+---------------------------------------------+
|           PRESENTATION LAYER                |
|  (React + TypeScript + Tailwind CSS +       |
|   shadcn/ui)                                |
+---------------------------------------------+
|           APPLICATION LAYER                 |
|  - Momentum Motoru                          |
|  - Pattern Recognition AI                   |
|  - Opsiyon Stratejisi Motoru                |
+---------------------------------------------+
|           DATA LAYER                        |
|  - Yahoo Finance API (CORS Proxy ile)       |
|  - Client-side veri isleme                  |
+---------------------------------------------+
```

### 2.2 Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Stil | Tailwind CSS + shadcn/ui |
| Veri Kaynagi | Yahoo Finance API (CORS Proxy) |
| Build | Vite (static deploy) |

## 3. Veri Toplama Sistemi

### 3.1 CORS Proxy Mimarisi

Yahoo Finance API dogrudan browser'dan cagrilamaz (CORS kisitlamasi). Bu nedenle AllOrigins CORS proxy kullanilir:

```
Browser --> AllOrigins Proxy --> Yahoo Finance API --> JSON Response
```

Endpoint: `https://api.allorigins.win/raw?url=<encoded_yahoo_url>`

### 3.2 Veri Istekleri

Her hisse icin 2 API cagrisi yapilir:

1. **Gunluk Veri (60 gun)**
   - Endpoint: `query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=1d&range=60d`
   - Kullanim amaci: RSI, MACD, VWAP, ATR, 20-gunluk hacim ortalamasi

2. **Intraday Veri (5 gun, 30dk)**
   - Endpoint: `query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=30m&range=5d`
   - Kullanim amaci: Aclis araligi (ilk 30 dk) analizi

### 3.3 Islenen Veri Seti

```typescript
interface StockData {
  ticker: string;
  name: string;
  sector: string;
  timestamps: number[];  // Unix timestamp dizisi
  open: number[];        // Acilis fiyatlari
  high: number[];        // Yuksek fiyatlar
  low: number[];         // Dusuk fiyatlar
  close: number[];       // Kapanis fiyatlari
  volume: number[];      // Hacimler
  currentPrice: number;
  prevClose: number;
  marketCap: number;
}
```

## 4. Momentum Motoru (8 Faktorlu Skorlama)

### 4.1 Hacim ve Likidite Filtreleri

Hisseler analize dahil edilmeden once 2 kritik filtreden gecer:

| Filtre | Eşik | Amaç |
|--------|------|------|
| min_avg_volume_20d | 500.000 | Dusuk likiditeli hisseleri ele |
| min_dollar_volume | $50.000.000 | Manipulasyona acik hisseleri ele |

### 4.2 8 Bileşenli Skorlama Formulu

Toplam Skor = her bileşen skoru x agirlik toplami

```
WEIGHTS = {
  rvol:           0.15,   // 15% - Gorceeli Hacim
  gap:            0.10,   // 10% - Aclis Boslugu Kalitesi
  orb:            0.15,   // 15% - Aclis Araligi Kirilimi
  vwap:           0.15,   // 15% - VWAP Pozisyon/Egim
  price_structure: 0.10,  // 10% - Yuksek Tepeler / Yuksek Dipler
  rsi_short:      0.10,   // 10% - Kisa Vadeli RSI
  atr_momentum:   0.10,   // 10% - ATR Normalize Momentum
  catalyst:       0.10,   // 10% - Katalizor (Market Cap)
  price_change:   0.05,   // 5%  - Fiyat Degisimi
}
```

### 4.3 Bilesen Aciklamalari

#### 4.3.1 RVOL (Relative Volume) - Agirlik: %15

```
RVOL = Bugunku Hacim / 20 Gunluk Ortalama Hacim

Skorlama:
- RVOL >= 4: 100 puan (muhtesem hacim patlamasi)
- RVOL >= 2: 50 puan  (iyi hacim)
- RVOL >= 1: 15 puan  (normal ustu)
- RVOL < 1:  0 puan   (yetersiz)
```

Amac: Anormal hacim artisini tespit etmek. Yuksek hacim, guclu bir hareketin onayidir.

#### 4.3.2 GAP Kalitesi - Agirlik: %10

```
GAP % = ((Acilis - Onceki Kapanis) / Onceki Kapanis) x 100

Skorlama:
- 1% <= GAP <= 4%:   80-100 puan (optimal)
- 0.5% <= GAP < 1%:  60-80 puan  (kabul edilebilir)
- 4% < GAP <= 8%:    50-70 puan  (fazla - dolum riski)
- GAP > 8%:          40 puan     (asırı riskli)
- Negatif GAP:       15-30 puan  (zayıf)
```

Amac: Cok dusuk GAP yok sayilir, cok yuksek GAP ters donus riski tasir. Moderat GAP en iyisidir.

#### 4.3.3 ORB (Opening Range Breakout) - Agirlik: %15

```
ORB Araligi = 30dk Yuksek - 30dk Dusuk
ORB Normalize = ORB Araligi / ATR(14)
Kirilim Gucu = (30dk Yuksek - Acilis) / ORB Araligi

Skorlama:
- Normalize > 2 ve Kirilim > 0.5: 90 puan (guclu kirilim)
- Normalize > 1.5 ve Kirilim > 0.3: 75 puan
- Normalize > 1 ve Kirilim > 0.2: 60 puan
- Normalize > 0.5: 40 puan
- Diger: 25 puan
```

Amac: Ilk 30 dakikadaki fiyat hareketinin gunluk volatiliteye gore ne kadar guclu oldugunu olcmek.

#### 4.3.4 VWAP Pozisyon ve Egim - Agirlik: %15

```
VWAP = Volume Weighted Average Price
Sapma % = ((Mevcut Fiyat - VWAP) / VWAP) x 100
VWAP Egimi = Son 5 barin VWAP'inin lineer regresyon egimi

Skorlama:
- Sapma > 1% ve Egim > 0:  85 puan (guclu yukselis)
- Sapma > 0.5% ve Egim >= 0: 70 puan
- Sapma > 0%:                55 puan (hafif yukarı)
- Sapma > -0.5%:             40 puan
- Sapma < -0.5%:             25 puan (dusus)
```

Amac: Fiyatin VWAP uzerinde olmasi alici baskisini gosterir. Yukari egimli VWAP trend destegi saglar.

#### 4.3.5 Price Structure (Higher Highs / Higher Lows) - Agirlik: %10

```
Yuksek Tepeler Orani = (yuksek > onceki_yuksek) sayisi / toplam
Yuksek Dipler Orani  = (dusuk > onceki_dusuk) sayisi / toplam

Skor = (Yuksek_Tepeler + Yuksek_Dipler) / 2
```

Amac: Son 10 gundeki fiyat yapisinin yukselen trend olup olmadigini kontrol etmek.

#### 4.3.6 RSI Kisa Vade - Agirlik: %10

```
RSI(2)  = 2-period Relative Strength Index
RSI(7)  = 7-period Relative Strength Index
RSI(14) = 14-period Relative Strength Index

Skorlama:
- RSI(2) > 60 ve RSI(7) > 55:  85 puan (guclu kisa momentum)
- RSI(2) > 50 ve RSI(7) > 50:  70 puan (pozitif)
- RSI(7) > 45:                  50 puan (nötr)
- RSI(7) < 30:                  20 puan (asiri satim)
```

Amac: Kisa vadeli momentumu RSI(2) ile, orta vadeyi RSI(7) ile yakalamak.

#### 4.3.7 ATR-Normalize Momentum - Agirlik: %10

```
ATR(14) = Average True Range (14 gun)
30dk Hareket = 30dk Yuksek - Acilis
Normalize = 30dk Hareket / ATR(14)

Skorlama:
- Normalize > 2:   90 puan (cok guclu)
- Normalize > 1.5: 75 puan (guclu)
- Normalize > 1:   60 puan (iyi)
- Normalize > 0.5: 45 puan (zayif)
- Diger:           30 puan
```

Amac: Gunluk volatiliteye gore ilk 30dk hareketinin ne kadar olağanustu oldugunu olcmek.

#### 4.3.8 Katalizor - Agirlik: %10

```
Kurumsal Sahiplik > %70: +10 puan
Market Cap > $10B:        +10 puan
Market Cap > $1B:         +5 puan

Base: 50 puan (Nötr)
Maksimum: 100 puan
```

#### 4.3.9 Fiyat Degisimi - Agirlik: %5

```
Degisim % = ((Mevcut - Onceki Kapanis) / Onceki Kapanis) x 100

Skorlama:
- > 5%:  100 puan
- > 3%:   85 puan
- > 2%:   70 puan
- > 1%:   55 puan
- > 0%:   40 puan
- > -1%:  25 puan
- <-1%:   10 puan
```

### 4.4 Sinyal Siniflandirmasi

| Skor Araligi | Sinyal | Aciklama |
|-------------|--------|----------|
| 75-100 | GÜCLÜ AL | Cok guclu momentum |
| 60-74 | AL | Guclu yukselis sinyali |
| 45-59 | NÖTR-YUKARI | Hafif yukselis egilimi |
| 30-44 | NÖTR | Yatay seyir |
| 20-29 | NÖTR-ASAGI | Hafif dusus egilimi |
| 0-19 | ZAYIF | Zayif sinyal |

## 5. Pattern Recognition AI

### 5.1 Egitim Fazi

Son 1 aylik (20 is gunu) veriler kullanilir. Her hisse ve her gun icin:

1. **Gunluk bar verisi** cekilir (acilis, yuksek, dusuk, kapanis, hacim)
2. **Ilk 30dk simulasyonu**: Acilis -> Yuksek arasindaki degisim
3. **Devam analizi**: Eger hisse ilk 30dk'daki kazanimlarinin %30'unu koruduysa VE kapanis acilis uzerindeyse → "devam etti"
4. **Metrikler kaydedilir**:
   - Ilk 30dk degisimi
   - Hacim orani (RVOL)
   - RSI(14)
   - GAP yuzdesi
   - VWAP sapmasi

### 5.2 Ogrenilen İstatistikler

Egitim sonrasi cikan degerler:

- **Genel Devam Orani**: Tum hisselerin ortalama devam etme yuzdesi
- **Ortalama İlk 30dk Artisi**: Devam eden gunlerdeki ortalama
- **Ortalama Hacim Orani**: Devam eden gunlerdeki ortalama RVOL
- **Minimum Hacim Eşigi**: 25. persentil (en dusuk %25 deger)
- **Optimal RSI Araligi**: 25.-75. persentil araligi

### 5.3 Pattern Eşleme Algoritmasi

Bugunku hisseler ile gecemis pattern'ler karsilastirilir:

```
1. İlk 30dk Momentumu >= Tarihsel ortalama    → +20 puan
2. Hacim Oranı >= Tarihsel ortalama            → +20 puan  
3. RSI, optimal aralik icinde                  → +20 puan
4. VWAP pozisyonu guclu                        → +15 puan
5. Hisse tarihsel devam orani yuksek           → +15 puan
6. Momentum skoru yuksek                       → +10 puan

Toplam: 100 puan
```

**Konfidans Seviyeleri:**
- **HIGH**: Benzerlik >= 75 VE tarihsel devam orani >= %50
- **MEDIUM**: Benzerlik >= 50
- **LOW**: Benzerlik < 50

### 5.4 6 Faktorlu Eşleşme Detayi

Eşleşme kartlarinda 6 faktor gosterilir:

| Faktor | İkon | Açiklama |
|--------|------|----------|
| ✓ | Yesil | Faktor, tarihsel basari kosullarini sagliyor |
| △ | Turuncu | Faktor minimum esigi geciyor ama ortalamanin altinda |
| ✗ | Kirmizi | Faktor basari kosulunu saglamiyor |

## 6. Opsiyon Stratejisi Motoru

### 6.1 Strateji Secim Mantigi

Momentum skoru ve pattern eşleşmesine gore strateji secilir:

```
IF (skor >= 75 AND hacim >= 2x AND 50 < RSI < 80):
    → Long Call + Bull Call Spread
    (Guclu momentum - agresif bullish)

ELSE IF (skor >= 55 AND VWAP > 0):
    → Bull Call Spread + Bull Put Spread
    (Orta momentum - korunmali bullish)

ELSE IF (hacim >= 3x AND |degisim| > 2%):
    → Long Straddle + Call Ratio Backspread
    (Yuksek volatilite - yon bagimsiz)

ELSE:
    → Bull Put Spread + Covered Call
    (Dusuk konfidans - konservatif)
```

### 6.2 Stratejiler Tablosu

| Strateji | Risk | Maks. Kar | Maks. Zarar | Ne Zaman Kullanilir |
|----------|------|-----------|-------------|---------------------|
| **Long Call** | Yuksek | Sinirsiz | Prim | Guclu yukselis >%3 |
| **Bull Call Spread** | Orta | Sinirli | Net prim | Orta yukselis 1-3% |
| **Bull Put Spread** | Dusuk | Net prim (kredi) | Spread - prim | Hafif yukselis/yatay |
| **Call Ratio Backspread** | Yuksek | Sinirsiz (yukari) | Sinirli | Yon net degil, hareket bekleniyor |
| **Covered Call** | Dusuk | Sinirli | Hisse dusus riski | Hisse portfoyde |
| **Long Straddle** | Yuksek | Sinirsiz (her yon) | Toplam prim | Yon bilinmiyor, vol. artacak |

### 6.3 Hedef ve Durdurma Hesaplamalari

```
Hedef Fiyat = Mevcut Fiyat x 1.03   (+%3)
Durdurma Fiyat = Mevcut Fiyat x 0.98 (-%2)
```

### 6.4 Risk Uyarlari

Asagidaki durumlarda ozel uyarilar verilir:

- **RSI > 75**: "Asiri alim bolgesi - duzeltme riski yuksek"
- **RSI < 30**: "Asiri satim - donus olabilir ama dikkatli olun"
- **Hacim < 1.5x**: "Yetersiz hacim onayi"
- **VWAP < 0**: "Fiyat VWAP altinda - satis baskisi"

## 7. Veri Akisi Diyagrami

```
[ Kullanici ] --> [ "NASDAQ Taramasi Baslat" Butonu ]
                      |
                      v
          [ NASDAQ-100 Tickers (94 hisse) ]
                      |
                      v
          [ Her hisse icin: ]
          [ 1. Yahoo Finance Gunluk Veri (60d) ]
          [ 2. Yahoo Finance Intraday Veri (5d, 30m) ]
                      |
                      v
          [ Momentum Motoru (8 Faktor) ]
          [ - Hacim/Likidite Filtreleri ]
          [ - Skor Hesaplama (0-100) ]
          [ - Sinyal Siniflandirma ]
                      |
                      v
          [ Sonuclar Tablosu (Skora gore sirali) ]
                      |
                      v
          [ "AI Egit" Butonu (Istege Bagli) ]
                      |
                      v
          [ Pattern Recognition AI ]
          [ - 1 Aylik Gecemis Analizi ]
          [ - Devam Orani Ogrenimi ]
          [ - Esik Deger Hesaplama ]
                      |
                      v
          [ Bugunku Hisseler ile Pattern Eslestirme ]
                      |
                      v
          [ Eslesme Kartlari (Benzerlik Skoru) ]
                      |
                      v
          [ "Opsiyon" Butonu ]
                      |
                      v
          [ Opsiyon Stratejisi Motoru ]
          [ - 6 Strateji Secimi ]
          [ - Hedef/Durdurma Hesaplama ]
          [ - Risk Uyarilari ]
                      |
                      v
          [ Strateji Detay Modal ]
```

## 8. Performans ve Optimizasyon

### 8.1 Tarama Performansi

- 94 hissenin tamami paralel olmayan sekilde sirayla taranir
- Her hisse ~2 API istegi = ~188 toplam istek
- CORS proxy limitleri nedeniyle seri isleme
- Ortalama tarama suresi: 2-4 dakika

### 8.2 Ilerleme Takibi

Tarama sirasinda:
- Islenen hisse sayisi / Toplam
- Yuzde tamamlanma cubugu
- Animasyonlu yuklenme gostergesi

## 9. Sistem Sinirlari

| Sinir | Aciklama |
|-------|----------|
| CORS Proxy | AllOrigins kullanim limitleri olabilir |
| Veri Gecikmesi | Yahoo Finance verileri 15-20 dk gecikmeli |
| Piyasa Saatleri | Intraday veri sadece piyasa acikken anlamli |
| Hafta Sonu | Cumartesi/Pazar gunu veri yetersiz |
| Ticker Sayisi | 94 NASDAQ hissesi ile sinirli |
| Backtest | Gecemis intraday verisi kisitli |

## 10. Guvenlik Uyarilari

> **ONEMLI**: Bu sistem egitim ve analiz amacli olup yatim tavsiyesi degildir. Tum trading kararlarini kendi sorumlulugunuzda aliniz. Opsiyon tradingi yuksek risk icerir ve tum sermayenizi kaybedebilirsiniz. Her zaman kendi arastirmanizi yapin ve profesyonel danismanliga basvurun.
