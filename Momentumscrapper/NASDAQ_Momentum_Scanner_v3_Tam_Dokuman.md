# NASDAQ Momentum Scanner v3 — Tam Sistem Dokumantasyonu

**URL:** https://knbk56xscwffk.kimi.page

---

## 1. Sistem Nedir?

NASDAQ Momentum Scanner, borsanin acilisinda ilk yarim saatte en guclu momentumu gosteren NASDAQ-100 hisselerini bulan, 9 faktore gore skorlayan, gecmis verilerle istatistiksel eslestirme yapan ve opsiyon stratejisi oneren **tamamen tarayici ici (client-side)** calisan bir web uygulamasidir. Backend sunucusu yoktur; tum hesaplama ve analizler kullanicinin bilgisayarinda yapilir.

---

## 2. Nasil Calisir? (Adim Adim)

### Adim 1: Paralel Veri Toplama

Kullanici "Taramayi Baslat" dediginde sistem 94 NASDAQ-100 hissesinin verisini toplar. Her hisse icin 2 farkli veri seti cekilir:

| Veri Seti | Kaynak | Kullanim Amaci |
|-----------|--------|----------------|
| Gunluk (60 gun) | `chart/{TICKER}?interval=1d&range=60d` | RSI, MACD, ATR, 20 gunluk ortalama hacim |
| Intraday 30dk (5 gun) | `chart/{TICKER}?interval=30m&range=5d` | Acilis araligi, VWAP hesaplamasi |

**CORS Proxy:** Yahoo Finance dogrudan tarayicidan erisilemez. Iki adet proxy (AllOrigins + corsproxy.io) birincisi basarisiz olursa ikincisine otomatik gecer.

**Paralel Tarama:** 94 hisse tek seferde degil, 5'li gruplar halinde (Promise.allSettled) asenkron olarak cekilir. Her grup arasinda 300ms bekleme suresi vardir. Basarisiz istekler 2 kez exponential backoff ile tekrarlanir (500ms -> 1000ms -> 2000ms).

**Tahmini Sure:** 30-60 saniye

---

### Adim 2: Likidite Filtresi (On Kontrol)

Verisi cekilen her hisse iki temel likidite testinden gecirilir. Testi gecemeyenler dogrudan elenir:

```
1. Ortalama Gunluk Hacim (20 gun) >= 500.000 hisse
2. Ortalama Gunluk Dolar Hacim >= 50.000.000 $
```

Bu filtreler dusuk hacimli, manipulasyona acik hisselerin analize girmesini engeller.

---

### Adim 3: 9 Faktore Gore Skorlama

Gecen her hisse 9 bagimsiz faktore gore 0-100 arasi skor alir. Her faktore farkli bir agirlik atanir ve agirlikli ortalamasi alinarak toplam momentum skoru (0-100) hesaplanir.

**Faktor Agirlik Tablosu:**

| # | Faktor | Agirlik | Aciklama |
|---|--------|---------|----------|
| 1 | RVOL | %15 | Gorceeli hacim (gunluk / 20g ort.) |
| 2 | GAP | %10 | Acilis boslugu kalitesi |
| 3 | ORB | %13 | Acilis araligi kirilimi |
| 4 | VWAP | %13 | Intraday VWAP pozisyonu ve egimi |
| 5 | Price Structure | %8 | Yuksek tepeler / yuksek dipler |
| 6 | RSI Short | %10 | Kisa vadeli RSI momentumu |
| 7 | Velocity (Dir) | %7 | Yonlu hareket hizi |
| 8 | MarketCap | %4 | Sirket buyuklugu |
| 9 | Intraday Retention | %8 | Gun ici fiyat tutma gucu |
| - | Price Change | %6 | Gunluk fiyat degisimi |
| - | Velocity (Vol) | %3 | Volatilite buyuklugu |
| | **TOPLAM** | **%100** | |

---

## 3. Dokuz Faktorun Detayli Aciklamasi

### Faktor 1: RVOL (Relative Volume) — %15

**Formul:** `Gunluk Hacim / 20 Gunluk Ortalama Hacim`

**Skorlama (Linear Interpolation):**
```
RVOL < 1.0:  puan = 0 + (RVOL - 0) * 15          → 0-15 arasi
RVOL 1.0-2.0: puan = 15 + (RVOL - 1) * 35        → 15-50 arasi
RVOL 2.0-4.0: puan = 50 + (RVOL - 2) * 25        → 50-100 arasi
RVOL > 4.0:   puan = 100                           → tam puan
```

**Neden Linear?** Eski surumde keskin gecisler vardi (ornegin 1.99x = 15 puan, 2.00x = 50 puan). Linear interpolasyon bu "cliff effect" i ortadan kaldirir, hacimin her duzeyi duzgun bir sekilde degerlendirilir.

---

### Faktor 2: GAP Kalitesi — %10

**Formul:** `((Acilis Fiyati - Onceki Gun Kapanis) / Onceki Gun Kapanis) * 100`

GAP, hissenin gun acilisinda onceki kapanisa gore ne kadar bosluk biraktigini olcer.

**Skorlama:**
```
GAP %1-4:      80-100 puan (optimal bosluk)
GAP %0.5-1:    60-80 puan
GAP %4-8:      50-70 puan (fazla, donus riski)
GAP > %8:      40 puan (asiri riskli)
Negatif GAP:   15-30 puan
```

---

### Faktor 3: ORB (Opening Range Breakout) — %13

**Formul:** `(30dk Yuksek - 30dk Dusuk) / ATR(14)`

**Kirilim Testi:** Sadece aralik buyuklugu degil, mevcut fiyatin bu araligi gecip gecmedigi de kontrol edilir:

```
Mevcut Fiyat > 30dk Yuksegi   → Tam kirilim (1.0)
Mevcut Fiyat > Acilis Fiyati  → Kismi kirilim (0.5)
Diger                           → Kirilim yok (0)
```

**Skorlama:**
```
Normalize > 2.0 + Tam Kirilim      → 95 puan
Normalize > 1.5 + Kismi Kirilim    → 80 puan
Normalize > 1.0                     → 65 puan
Normalize > 0.5                     → 45 puan
```

**Zaman Kontrolu:** Eger piyasa acilisindan 30 dakika gecmemisse (`09:30-10:00 EST` arasi), ORB skoru hesaplanmaz (`isValid=false`) ve sistem kullaniciya uyarir.

---

### Faktor 4: VWAP (Volume Weighted Average Price) — %13

**VWAP, gun ici 30 dakikalik verilerden hesaplanir** (gunluk veriden degil). Her 30dk bar icin Typical Price x Hacim birikimli ortalamasi alinir.

**VWAP Slope (Normalize):** Sadece slope degil, `slope / VWAP` orani kullanilir. Bu sayede hissenin fiyat seviyesinden bagimsiz, oransal bir egim elde edilir.

**Skorlama:**
```
Fiyat > VWAP+%1.5 ve egim yukari  → 90 puan
Fiyat > VWAP+%1 ve egim yukari    → 85 puan
Fiyat > VWAP+%0.5                 → 70 puan
Fiyat > VWAP                      → 55 puan
Fiyat < VWAP                      → 25-40 puan
```

---

### Faktor 5: Price Structure — %8

Son 10 gunluk fiyat yapisi analiz edilir:
- **Higher Highs:** Her gunun yuksegi onceki gununkunden yuksek mi?
- **Higher Lows:** Her gunun dusugu onceki gununkunden yuksek mi?

Bu iki oranin ortalamasi Price Structure skorunu verir (0-100).

---

### Faktor 6: RSI Short — %10

**RSI(7) agirlikli (%70), RSI(9) referans (%30)** olarak harmanlanir. RSI(2) kullanilmaz cunku 2 period cok gurultulu ve guvenilir sinyal uretmez.

**Skorlama (mutually exclusive araliklar):**
```
60-75:   85 puan (optimal momentum)
55-60:   70 puan (guclu)
45-55:   55 puan (notr)
35-45:   40 puan (zayif)
75-80:   60 puan (asiri alim yakin)
>80:     30 puan (asiri alim)
<35:     25 puan (asiri satim)
```

Araliklar birbirini kesmez, her RSI degeri tam olarak bir skora denk duser.

---

### Faktor 7: Velocity Direction — %7

Fiyatin acilistan mevcut fiyata kadar olan **yonlu hareketinin** ATR'ye gore ne kadar hizli oldugunu olcer.

**Formul:** `(Mevcut Fiyat - Acilis) / ATR(14)`

**Skorlama:**
```
> 2.0 ATR → 95 puan (cok hizli yukselis)
> 1.5 ATR → 85 puan
> 1.0 ATR → 70 puan
> 0.5 ATR → 55 puan
< 0 ATR   → 15-25 puan (dusus)
```

---

### Faktor 8: MarketCap — %4

Sirketin buyuklugu guvenilirlik gostergesidir:
```
Market Cap > $200 Milyar → +25 puan
Market Cap > $10 Milyar  → +15 puan
Market Cap > $1 Milyar   → +5 puan
Market Cap < $1 Milyar   → -10 puan
```

**94 hissenin sektor bilgisi hardcoded haritada tanimlidir.** Yahoo Finance sektor verisi bos gelirse bu harita kullanilir.

---

### Faktor 9: Intraday Retention — %8

Gun ici en yuksek fiyattan mevcut fiyata kadar ne kadar geri cekildigini olcer. Bu faktör GAP'tan tamamen bagimsizdir.

**Formul:** `(30dk Yuksek - Mevcut Fiyat) / 30dk Yuksek * 100`

**Skorlama:**
```
Cekilme < %0.3   → 85 puan (neredeyse geri cekilme yok)
Cekilme < %0.8   → 70 puan
Cekilme < %1.5   → 55 puan
Cekilme < %3.0   → 40 puan
Cekilme > %3.0   → 25 puan (derin geri cekilme)
```

---

## 4. IV Proxy Tahmini

Sistem gercek Implied Volatility (IV) degerine sahip olmadigindan, uc degiskenle bir proxy hesaplar:

```
IV Proxy = (Gunluk Volatilite * 0.40) + (Hacim Orani * 0.35) + (RSI Mesafesi * 0.25)

Gunluk Volatilite  = |Fiyat Degisimi%| * 15
Hacim Orani        = (RVOL - 1) * 25
RSI Mesafesi       = |RSI - 50| * 2
```

**Opsiyon Stratejisi Etkisi:**
```
IV Rank > 70  → YUKSEK: Spread stratejileri tercih et (prim pahali)
IV Rank 50-70 → ORTA-YUKSEK: Spread ile maliyeti dusur
IV Rank 30-50 → NORMAL: Standart stratejiler
IV Rank < 30  → DUSUK: Uzun call mantikli (ucuz prim)
```

---

## 5. Hedef Fiyat Hesaplama

Hedef fiyat sabit bir yuzde degil, ATR (Average True Range) ile dinamik olarak hesaplanir:

```
Hedef Fiyat = Mevcut Fiyat + (ATR * Carpani)

Carpan belirleme:
  Momentum Skoru >= 75 → 2.0 (agresif)
  Momentum Skoru >= 55 → 1.5 (normal)
  Momentum Skoru < 55  → 1.0 (konservatif)

Durdurma Fiyati = Mevcut Fiyat - ATR (her zaman 1.0 ATR)
```

**Ornek:**
- Mevcut: $100, ATR: $2.50, Skor: 80
- Hedef: $100 + ($2.50 * 2.0) = $105.00
- Durdurma: $100 - $2.50 = $97.50

---

## 6. Istatistiksel Eslstirme Motoru (Pattern Recognition)

### Egitim Fazi

Son 1 aylik (20 is gunu) veri analiz edilir. Her gun icin:
1. Gunun ilk 30 dakikasindaki yukselis hesaplanir
2. Gun sonu kapanis degeri ile karsilastirilir
3. Eger kapanis acilistan yuksekse VE ilk 30dk kazancinin %30'unu koruduysa → "devam etti" olarak isaretlenir

### Wilson Score Guven Araligi

Her hissenin devam orani icin %95 guven araligi hesaplanir:

```
p = Devam Eden Gun Sayisi / Toplam Analiz Gunu
n = Toplam Analiz Gunu
z = 1.96 (for %95 confidence)

Alt Sinir = [p + z^2/2n - z * sqrt(p(1-p)/n + z^2/4n^2)] / (1 + z^2/n)
Ust Sinir = [p + z^2/2n + z * sqrt(p(1-p)/n + z^2/4n^2)] / (1 + z^2/n)
```

Eger `n < 10` ise sistem **"Yetersiz Veri"** uyarisi gosterir.

### Piyasa Rejimi Tespiti

SPY'nin 20 gunluk volatilitesi hesaplanarak uc rejim belirlenir:
```
Vol < %1/gun  → DUSUK VOLATILITE (prim ucuz olabilir)
Vol %1-2/gun  → NORMAL
Vol > %2/gun  → YUKSEK VOLATILITE (prim pahali, spread tercih et)
```

---

## 7. Opsiyon Stratejisi Motoru

### 6 Temel Strateji

| Strateji | Risk Seviyesi | Maks Kazanc | Maks Zarar | Ne Zaman |
|----------|--------------|-------------|------------|----------|
| **Long Call** | Yuksek | Sinirsiz | Odenen prim | Guclu yukselis, dusuk IV |
| **Bull Call Spread** | Orta | Sinirli | Net prim | Orta yukselis, yuksek IV |
| **Bull Put Spread** | Dusuk | Net prim (kredi) | Spread - prim | Konservatif, prim geliri |
| **Long Straddle** | Yuksek | Sinirsiz (her yon) | Toplam prim | Yon net degil, yuksek vol |

### ATM/OTM Secimi

```
Hedef - Mevcut < %2  → ATM (delta 0.45-0.55)
Hedef - Mevcut %2-4 → Hafif OTM (delta 0.30-0.45)
Hedef - Mevcut > %4  → Agresif OTM (delta 0.20-0.30)
```

### Vade Onerisi

| Piyasa Rejimi | Gun | Oneri |
|---------------|-----|-------|
| DUSUK VOL | Pazartesi-Carsamba | 5-7 gun (Cuma vadeli) |
| DUSUK VOL | Persembe-Cuma | 7-10 gun |
| NORMAL | Pazartesi-Carsamba | 5-7 gun |
| NORMAL | Persembe-Cuma | 10 gun (sonraki hafta) |
| YUKSEK VOL | Her gun | 10-14 gun (theta kaybini sinirla) |

### Pozisyon Boyutu Hesaplayicisi (Strateji-Tipi Dinamik)

**DEBIT Stratejileri** (Long Call, Bull Call Spread, Long Straddle):
```
Risk = Odenen Prim x 100 (her kontrat)
Max Kontrat = (Bakiye x Risk%) / Risk
```

**CREDIT Stratejileri** (Bull Put Spread):
```
Risk = (Spread Genisligi - Alinan Prim) x 100
Max Kontrat = (Bakiye x Risk%) / Risk
```

**Ornek:** $10,000 bakiye, %2 risk, Bull Put Spread ($5 spread, $0.80 prim):
- Risk = ($5 - $0.80) * 100 = $420
- Max Kontrat = $200 / $420 = 0 kontrat (risk cok yuksek)

---

## 8. Uyari ve Bildirim Sistemi

### Otomatik Uyarilar

| Tetikleyici | Uyarn Rengi | Mesaj |
|-------------|-------------|-------|
| RSI > 80 | Kirmizi | Asiri alim bolgesi - duseltme riski yuksek |
| RVOL > 5x | Sari | Asiri hacim aktivitesi - dikkatle takip edin |
| GUCLO AL sinyali | Yesil | Browser bildirimi (izin verildiyse) |
| Earnings yaklasiyor | Turuncu | Bu hisse yakinda kazanc aciklayabilir |
| Piyasa 30dk gecmedi | Sari | 30dk dolmadan ORB kirilim testi anlamsiz |

---

## 9. Kullanim Akisi

```
[1] Uygulamayi ac
         ↓
[2] Eger piyasa kapaliysa → sari zaman uyarisi gosterilir
         ↓
[3] "NASDAQ Taramasini Baslat" butonuna tikla
         ↓ (30-60 sn)
[4] Sonuclar tablosu gelir (skora gore sirali)
         ↓
[5] Istege bagli: Filtre Paneli ile sonuclari daralt
         ↓
[6] Istege bagli: "AI Pattern" butonu ile istatistiksel eslestirme
         ↓
[7] Bir hisse sec → "Opsiyon" butonu ile strateji detaylarini gor
         ↓
[8] Ister izleme listesine ekle (yildiz ikonu), ister detay modalini ac
```

---

## 10. Bilinen Sinirlilar ve Dikkat Edilmesi Gerekenler

| Sinir | Aciklama |
|-------|----------|
| **Veri Gecikmesi** | Yahoo Finance verileri 15-20 dakika gecikmeli olabilir |
| **Client-Side** | Tum islemler tarayicida yapilir, backend yoktur |
| **Earnings Takvimi** | Yaklasan kazanc tarihleri tam degildir (40 hisse proxy listesi) |
| **IV Proxy** | Gercek Implied Volatility yoktur, tahmini proxy kullanilir |
| **Istatistiksel Guclu** | 20 is gunu yeterli degildir; optimal analiz 60-90 gun gerektirir |
| **Hafta Sonu** | Cumartesi/Pazar gunleri veri yetersiz olabilir |
| **Tarama Zamani** | En ideal tarama zamani: 10:00-10:30 EST |

---

## 11. Teknik Yigin (Stack)

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 19 + TypeScript |
| Stil | Tailwind CSS + shadcn/ui |
| Derleyici | Vite 7 |
| Veri Kaynagi | Yahoo Finance API (CORS Proxy) |
| Grafik | SVG (Radar Chart) |
| Depolama | localStorage (favoriler, filtreler) |

---

## 12. Yasal Uyari

> Bu sistem **egitim ve analiz amaclidir**, yatirim tavsiyesi degildir. Tum trading kararlarini kendi sorumlulugunuzda aliniz. Opsiyon tradingi yuksek risk icerir ve tum sermayenizi kaybedebilirsiniz. Her zaman kendi arastirmanizi yapin ve profesyonel finansal danismana basvurun.
