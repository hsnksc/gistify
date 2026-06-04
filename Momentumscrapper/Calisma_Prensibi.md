# NASDAQ Momentum Scanner - Calisma Prensibi

## GENEL FELSEFE

Bu program, gunun ilk yarim saatinde en guclu momentumu gosteren NASDAQ hisselerini bulur. Once momentum skoru hesaplar, sonra gecmise donuk pattern analizi ile bu hareketin gun boyu devam edip etmeyecegini tahmin eder, en sonunda opsiyon stratejisi onerir.

## ADIM 1: VERI TOPLAMA (HISSE BASINA 2 API CAGRI)

Her bir hisse icin Yahoo Finance API'den veri cekilir:

### 1a. Gunluk Veri (Son 60 Gun)
- Kullanim: RSI, MACD, VWAP, ATR, 20 gunluk ortalama hacim
- Endpoint: chart/{TICKER}?interval=1d&range=60d

### 1b. Intraday Veri (Son 5 Gun, 30 Dakikalik)
- Kullanim: Acilis araligi analizi (ilk 30 dk)
- Endpoint: chart/{TICKER}?interval=30m&range=5d

### 1c. CORS Proxy
Yahoo Finance dogrudan browser'dan erisilemez. AllOrigins proxy kullanilir.

---

## ADIM 2: LIKIDITE FILTRESI (ON FILTRE)

Her hisse analiz oncesi 2 kritik esikten gecer:

| Filtre | Esik | Amac |
|--------|------|------|
| Ortalama Hacim | >= 500.000 gunluk | Dusuk likiditeli hisseleri ele |
| Dolar Hacmi | >= $50 milyon gunluk | Manipulasyona acik hisseleri ele |

Bu filtrelerden gecemeyen hisseler dogrudan elenir.

---

## ADIM 3: 8 FAKTORLU MOMENTUM SKORLAMA (0-100)

Gecen her hisse icin 8 faktor hesaplanir, agirlikli ortalamasi alinir.

### 3.1 RVOL - Relative Volume (Agirlik: %15)
Formul: Gunluk Hacim / 20 Gunluk Ortalama Hacim

Skorlama:
- RVOL >= 4.0x  → 100 puan (muhtesem hacim patlamasi)
- RVOL >= 2.0x  →  50 puan (guclu hacim)
- RVOL >= 1.0x  →  15 puan (normal ustu)
- RVOL < 1.0x   →   0 puan (yetersiz hacim)

Amac: Anormal hacim artisini yakalamak. Yuksek hacim = guclu hareketin onayi.

### 3.2 GAP Kalitesi (Agirlik: %10)
Formul: ((Acilis - Onceki Kapanis) / Onceki Kapanis) x 100

Skorlama:
- GAP %1-4      → 80-100 puan (optimal bosluk)
- GAP %0.5-1   → 60-80 puan  (kabul edilebilir)
- GAP %4-8     → 50-70 puan  (fazla - donus riski)
- GAP > %8     → 40 puan     (asiri riskli)
- Negatif GAP  → 15-30 puan  (zayif)

Amac: Cok kucuk GAP yok sayilir, cok buyuk GAP donus riski tasir.

### 3.3 ORB - Opening Range Breakout (Agirlik: %15)
Formul: (30dk Yuksek - Acilis) / Gunluk ATR

Skorlama:
- Normalize > 2.0 ve kirilim > %50  → 90 puan
- Normalize > 1.5 ve kirilim > %30  → 75 puan
- Normalize > 1.0 ve kirilim > %20  → 60 puan
- Normalize > 0.5                    → 40 puan
- Diger                              → 25 puan

Amac: Ilk 30 dakikadaki hareketin gunluk volatiliteye gore ne kadar guclu oldugunu olcmek.

### 3.4 VWAP Pozisyon ve Egim (Agirlik: %15)
Formul: ((Fiyat - VWAP) / VWAP) x 100

Skorlama:
- Fiyat > %1 ustunde ve VWAP yukseliyor → 85 puan
- Fiyat > %0.5 ustunde ve VWAP duz     → 70 puan
- Fiyat VWAP ustunde                    → 55 puan
- Fiyat VWAP yakininda                  → 40 puan
- Fiyat VWAP altinda                    → 25 puan

Amac: VWAP uzerinde olmak alici baskisini, yukari egimli VWAP trend destegini gosterir.

### 3.5 Price Structure - Fiyat Yapisi (Agirlik: %10)
Son 10 gundeki yuksek ve dusuk degerler incelenir:
- Yuksek tepeler ve yuksek dipler olusuyorsa (HH/HL) → yuksek skor
- Dusuk tepeler ve dusuk dipler olusuyorsa (LH/LL) → dusuk skor

Amac: Fiyat yapisinin yukselen trend olup olmadigini kontrol etmek.

### 3.6 RSI Kisa Vade (Agirlik: %10)
Iki RSI hesaplanir: RSI(2) ve RSI(7)

Skorlama:
- RSI(2) > 60 ve RSI(7) > 55  → 85 puan (guclu momentum)
- RSI(2) > 50 ve RSI(7) > 50  → 70 puan (pozitif)
- RSI(7) > 45                  → 50 puan (nötr)
- RSI(7) < 30                  → 20 puan (asiri satim)

Amac: Kisa vadeli momentumu RSI(2) ile, orta vadeyi RSI(7) ile yakalamak.

### 3.7 ATR-Normalize Momentum (Agirlik: %10)
Formul: (30dk Yuksek - Acilis) / ATR(14)

Skorlama:
- Normalize > 2.0  → 90 puan (cok guclu)
- Normalize > 1.5  → 75 puan (guclu)
- Normalize > 1.0  → 60 puan (iyi)
- Normalize > 0.5  → 45 puan (zayif)
- Diger             → 30 puan

Amac: Ilk 30dk hareketinin gunluk volatiliteye gore ne kadar olağanustu oldugunu olcmek.

### 3.8 Katalizor (Agirlik: %10)
- Market Cap > $10 milyar → +10 puan
- Market Cap > $1 milyar  → +5 puan

Amac: Buyuk sirketlerin momentumu daha guvenilir kabul edilir.

---

## ADIM 4: AGIRLIKLI TOPLAM SKOR

Toplam Skor = (F1 x 0.15) + (F2 x 0.10) + (F3 x 0.15) + (F4 x 0.15) + (F5 x 0.10) + (F6 x 0.10) + (F7 x 0.10) + (F8 x 0.10)

### Sinyal Siniflandirmasi:
| Skor | Sinyal | Anlami |
|------|--------|--------|
| 75-100 | GÜCLÜ AL | Cok guclu momentum |
| 60-74  | AL | Guclu yukselis |
| 45-59  | NÖTR-YUKARI | Hafif yukselis |
| 30-44  | NÖTR | Yatay |
| 20-29  | NÖTR-ASAGI | Hafif dusus |
| 0-19   | ZAYIF | Zayif |

---

## ADIM 5: AI PATTERN RECOGNITION (GECMIS VERI ANALIZI)

### 5a. Egitim Fazi
Son 1 aylik (20 is gunu) veriler analiz edilir. Her gun icin:
1. Ilk 30dk'daki artis hesaplanir
2. Gun sonundaki kapanis ile karsilastirilir
3. Eger kapanis, acilistan yukardaysa VE ilk 30dk kazaniminin %30'unu koruduysa → "devam etti" olarak isaretlenir

### 5b. Ogrenilen Istatistikler
- Genel devam orani (örn: %55)
- Devam eden gunlerdeki ortalama ilk 30dk artisi (örn: %1.2)
- Devam eden gunlerdeki ortalama hacim orani (örn: 2.3x)
- Optimal RSI araligi (örn: 52-68)

### 5c. Piyasa Rejimi Tespiti
SPY'nin 20 gunluk volatilitesi hesaplanir:
- Vol < %1/gun  → Dusuk Volatilite Rejimi
- Vol %1-2/gun  → Normal Rejim
- Vol > %2/gun  → Yuksek Volatilite Rejimi

### 5d. Pattern Eşleme (Bugunku Hisseler Icin)
Bugunku hisseler, gecmiste devam etmis gunlere ne kadar benzer? 6 faktorde karsilastirma yapilir:

1. Ilk 30dk momentumu >= gecmis ortalama  → +20 puan
2. Hacim orani >= gecmis ortalama          → +20 puan
3. RSI, optimal aralik icinde               → +20 puan
4. VWAP pozisyonu guclu                     → +15 puan
5. Hisse tarihsel devam orani yuksek        → +15 puan
6. Momentum skoru yuksek                    → +10 puan

Toplam: 100 puan

**Konfidans Seviyeleri:**
- HIGH (Benzerlik >= 75): Guclu devam sinyali
- MEDIUM (Benzerlik >= 50): Orta guclu sinyal
- LOW (Benzerlik < 50): Zayif sinyal

---

## ADIM 6: OPSIYON STRATEJISI SECIMI

Momentum skoru ve pattern eşleşmesine gore 6 stratejiden biri onerilir:

### Strateji Secim Tablosu:

| Durum | Onerilen Stratejiler |
|-------|---------------------|
| Skor >= 75, Hacim >= 2x, RSI 50-80 | Long Call + Bull Call Spread |
| Skor >= 55, VWAP > 0 | Bull Call Spread + Bull Put Spread |
| Hacim >= 3x, |degisim| > %2 | Long Straddle |
| Diger durumlar | Bull Put Spread (konservatif) |

### 6a. ATM/OTM Secimi
- Fiyat-hedef farki < %2  → ATM (delta 0.45-0.55)
- Fiyat-hedef farki %2-4 → Hafif OTM (delta 0.30-0.45)
- Fiyat-hedef farki > %4 → Agresif OTM (delta 0.20-0.30)

### 6b. Vade Onerisi
- Dusuk volatilite → 5-7 gun (Cuma vadeli)
- Yuksek volatilite → 10-14 gun (2 haftalik)
- Hafta ortasi sonrasi (Çarşamba+) → Bir sonraki hafta sonu

### 6c. Pozisyon Boyutu
Hesaplanan formul:
- Maksimum Risk = Hesap Bakiyesi x Risk %
- Maksimum Kontrat = Maksimum Risk / (Prim x 100)

Ornek: $10,000 bakiye, %2 risk, $2 prim
- Maks Risk = $10,000 x %2 = $200
- Maks Kontrat = $200 / ($2 x 100) = 1 kontrat

---

## ADIM 7: UYARI SISTEMI

Otomatik kontroller:
- **RSI > 80**: Kirmizi banner "Asiri Alim Uyarisi"
- **RVOL > 5x**: Sarı banner "Asiri Hacim Uyarisi"
- **GÜCLÜ AL sinyali**: Browser bildirimi (izin verildiyse)

---

## TAM AKIS DIYAGRAMI

```
Kullanici
  |
  v
[1] NASDAQ Taramasi Baslat
  |
  v
94 hisse, paralel 5'li chunk'lar
  |
  v
[2] Her hisse: 2 API cagrisi (gunluk + intraday)
  |
  v
[3] Likidite Filtresi (500K hacim, $50M dolar hacim)
  |
  v
[4] 8 Faktorlu Momentum Skoru (0-100)
  |
  v
[5] Skora gore siralama (tablo olustur)
  |
  v
[6] AI Pattern Egitimi (istege bagli)
  |
  v
[7] Gecmis 1 aylik veri analizi
  |
  v
[8] Bugunku hisseler ile pattern eslestirme
  |
  v
[9] Opsiyon Stratejisi (istege bagli)
  |
  v
[10] ATM/OTM secimi + Vade + Pozisyon boyutu
  |
  v
Kullaniciya sonuc sunulur
```

---

## NOTLAR

1. Tum islemler browser'da (client-side) yapilir, backend yoktur.
2. Yahoo Finance verileri 15-20 dakika gecikmelidir.
3. Hafta sonlari veri yetersiz olabilir.
4. Bu sistem egitim amaclidir, yatim tavsiyesi degildir.
5. Opsiyon tradingi yuksek risk icerir, tum sermayenizi kaybedebilirsiniz.
