# PRE-EARNINGS IV EXPANSION STRATEJILERI
## Haziran 2026 - Long Vega + Directional Bias

**Strateji:** Earnings oncesi IV sismesinden kazanmak  
**Mekanizma:** Hem Call hem Put al (haberlere gore oranli), earnings ACIKLANMADAN once IV zirvesinde sat  
**Kazan Kaynagi:** Vega pozitif - IV yukseldikce primler siser  
**Cikis Zamanlamasi:** Earnings oncesi 1-2 gun (IV Crush'a yakalanma!)

**Rapor Tarihi:** 6 Haziran 2026  
**VIX:** 18.1 (Sari Rejim)

---

## STRATEJI PRENSIBI

```
IV TAKVIMI (Tipik Pattern)
==========================
E-14:  IV baslar (Low)
E-10:  IV hizlanir (Rising)
E-7:   IV zirve yaklasir (High)  <-- CIKIS ZAMANI (Optimal)
E-5:   IV zirve (Peak)           <-- SON CIKIS GUNU
E-3:   IV siser (Very High)      <-- Risk artar
E-1:   IV zirve (Max)            <-- Kesin cikis
E+0:   Earnings aciklanir        <-- ASLA burada tutma!
E+1:   IV CRUSH! (%50+ duser)   <-- Cok gec
```

**Bizim Stratejimiz:** E-7 ile E-3 arasinda GIRIS, E-3 ile E-1 arasinda CIKIS.

### Nasil Kazaniriz?

| Faktor | Etki | Degerlendirme |
|--------|------|---------------|
| **Vega (IV artisi)** | Her 1% IV artisi = ~$0.30-0.60 prim artisi | ANA kazan kaynagi |
| **Delta (hisse hareketi)** | Bias'li taraf kazanir (ornegin %70C/%30P ise yukari hareket call'lari besler) | Ikincil kazan |
| **Gamma (hizli hareket)** | Hisse hizli hareket ederse bias'li taraf gamma patlamasi yasar | Bonus |
| **Theta (zaman kaybi)** | Her gun -$0.50 ile -$2.00 kayip | Risk faktörü |

### Portfoy Dagilimi

| Hisse | Ayirilan Sermaye | Risk Seviyesi |
|-------|------------------|---------------|
| ORCL  | %20 (Agresif)    | Yuksek (4 gun kaldi) |
| ADBE  | %15              | Orta-Yuksek (5 gun) |
| ACN   | %15              | Orta (12 gun, IV cok yuksek) |
| KR    | %10              | Dusuk (ucuz opsiyonlar) |
| FDX   | %20              | Orta (17 gun, ivi zamanla) |
| MU    | %20 (Agresif)    | Yuksek (IV cok yuksek ama getiri de oyle) |

---

## 1. ORCL (Oracle) - 10 Haziran AMC - 4 GUN KALDI

### Hisse Durumu
| Metrik | Deger |
|--------|-------|
| Fiyat | $215.16 |
| 50MA | $176.38 (Uzerinde) |
| 200MA | $206.95 (Uzerinde) |
| IV Rank | 84.68% |
| Expected Move | ±13.34% |
| EPS Beklenti | $1.96 (Onceki: $1.79) |
| Revenue Bek. | ~$14.5B |
| Surprise Pot. | Yuksek |

### Haber Analizi (Bias Belirleyici)
- **POZITIF:** Stargate Project ($500B AI yatirimi), OCI buyumesi %50+
- **POZITIF:** AI talebi Oracle Cloud'u besliyor
- **RISK:** Geçmis 4 earnings ortalama hareket ±17.32% (cok volatil)
- **RISK:** Sadece 4 gun kaldi - theta kaybi hizli

### Strateji: IV Expansion + Strong Bullish Bias

```
Call/Put Orani:     %70 Call / %30 Put
Bullish Bias Nedeni: AI/Cloud temasi, cift MA uzerinde, Stargate Project

CALL (70% agirlik):
  Strike:     $220 Call (hafif OTM)
  Alternatif: $215 Call (ATM - daha pahali ama delta guclu)
  Miktar:     7 kontrat (ornek: $10,000 portfoy)

PUT (30% agirlik):
  Strike:     $210 Put (hafif OTM)
  Alternatif: $215 Put (ATM)
  Miktar:     3 kontrat (ornek: $10,000 portfoy)
  
Expiry:     13 Haziran 2026 (3 DTE) - COK AGRESIF
            20 Haziran 2026 (10 DTE) - ONERILEN
            
Giris:      HEMEN (6-7 Haziran) - 4 gun kaldi!
Cikis:      9 Haziran (Earnings oncesi 1 gun)
```

### Greeks Tahmini (ATM Straddle benzeri, %70C/%30P)

| Greek | Deger | Aciklama |
|-------|-------|----------|
| Net Delta | +0.15 (Bullish) | %70 call agirlikli |
| **Vega** | **+0.45** | **Her 1% IV artisi = ~$45 kazanc** |
| Theta | -$2.50/gun | Zaman kaybi (hizli!) |
| Net Gamma | +0.02 | Yukari harekete daha hassas |

### Kar/Zarar Senaryolari

| Senaryo | IV Degisimi | Hisse Hareketi | Est. Kar/Zarar (10 kontrat) |
|---------|-------------|----------------|----------------------------|
| IV +8%, Hisse +5% | +8% | $215→$226 | **+$800 ile +$1,500** |
| IV +6%, Hisse sabit | +6% | $215→$215 | **+$200 ile +$400** |
| IV +5%, Hisse -3% | +5% | $215→$209 | -$100 ile +$200 (Put korur) |
| IV sabit, Hisse sabit | 0% | $215→$215 | **-$250 (Theta kaybi)** |
| IV duser, Hisse sabit | -3% | $215→$215 | -$400 ile -$600 |

### Kritik Uyarilar
- **SADECE 4 GUN KALDI!** Theta kaybi cok hizli. Eger IV artmazsa kayip yasanir.
- **En erken gir, en erken cik!** 9 Haziran sabah MUTLAKA cik.
- **20 Haziran expiry sec** - 13 Haziran expiry IV Crush + Theta cifte vurur.

---

## 2. ADBE (Adobe) - 11 Haziran AMC - 5 GUN KALDI

### Hisse Durumu
| Metrik | Deger |
|--------|-------|
| Fiyat | $251.73 |
| 50MA | $245.46 (Hafif uzerinde) |
| 200MA | $302.62 (Altinda, -17%) |
| IV Rank | ~75% |
| Expected Move | ±8.5% |

### Haber Analizi (Bias Belirleyici)
- **NEGATIF:** 200MA'nin %17 altinda, guclu dusus trendi
- **NEGATIF:** AI rekabeti (Canva, Figma, MS Copilot)
- **POZITIF:** 50MA uzerinde - kisa vadeli toparlanma
- **POZITIF:** Forward P/E 9.5 (ucuz)
- **KARISIK:** Trend karisik, bias net degil

### Strateji: IV Expansion + Slightly Bullish Bias

```
Call/Put Orani:     %55 Call / %45 Put
Slightly Bullish:   50MA uzerinde ama 200MA altinda - karisik

CALL (55% agirlik):
  Strike:     $255 Call (hafif OTM)
  Miktar:     5.5 kontrat (ornek: $10,000)

PUT (45% agirlik):
  Strike:     $250 Put (hafif ITM)
  Miktar:     4.5 kontrat (ornek: $10,000)

Expiry:     14 Haziran 2026 (3 DTE) - AGRESIF
            20 Haziran 2026 (9 DTE) - ONERILEN
            
Giris:      8-9 Haziran
Cikis:      10-11 Haziran (Earnings oncesi)
```

### Greeks Tahmini

| Greek | Deger | Aciklama |
|-------|-------|----------|
| Net Delta | +0.05 (Hafif Bullish) | Neredeyse delta notr |
| **Vega** | **+0.40** | **Her 1% IV artisi = ~$40 kazanc** |
| Theta | -$2.00/gun | Zaman kaybi |
| Net Gamma | Nötr | Dengeli |

### Kar/Zarar Senaryolari

| Senaryo | IV Degisimi | Hisse Hareketi | Est. Kar/Zarar |
|---------|-------------|----------------|----------------|
| IV +8%, Hisse +3% | +8% | $252→$259 | **+$600 ile +$1,000** |
| IV +8%, Hisse -5% | +8% | $252→$239 | **+$400 ile +$800** (Put korur) |
| IV +5%, Hisse sabit | +5% | $252→$252 | **+$100 ile +$300** |
| IV sabit, Hisse sabit | 0% | $252→$252 | -$200 (Theta) |

---

## 3. ACN (Accenture) - 18 HAZIRAN BMO - 12 GUN KALDI

### Hisse Durumu
| Metrik | Deger |
|--------|-------|
| Fiyat | $178.72 |
| 50MA | $184.42 (Altinda) |
| 200MA | $231.04 (Altinda, -23%) |
| **IV Rank** | **98.56%** (Cok yuksek!) |
| Expected Move | ±6.5% |
| EPS Beklenti | $3.72 (Onceki: $2.93) |

### Haber Analizi (Bias Belirleyici)
- **NEGATIF:** 52W'den -44%, cok agir dusus trendi
- **NEGATIF:** Consulting sektorunde maliyet kesintisi
- **POZITIF:** EPS buyumesi %27 (guidance yukari)
- **RISK:** IV Rank 98.56% - Opsiyonlar cok pahali!
- **RISK:** FOMC 17 Haziran (1 gun once!) - Cifte risk

### Strateji: IV Expansion + Bearish Bias

```
Call/Put Orani:     %35 Call / %65 Put
Bearish Bias:       52W'den -44%, her iki MA altinda

CALL (35% agirlik):
  Strike:     $180 Call (hafif OTM)
  Miktar:     3.5 kontrat (ornek: $10,000)

PUT (65% agirlik):
  Strike:     $175 Put (hafif OTM)
  Alternatif: $180 Put (ATM)
  Miktar:     6.5 kontrat (ornek: $10,000)

Expiry:     20 Haziran 2026 (2 DTE ERTESI) - RISIKLI
            27 Haziran 2026 (9 DTE) - ONERILEN (FOMC nedeniyle)
            
Giris:      12-15 Haziran (FOMC sonrasi 16 Haziran daha guvenli)
Cikis:      16-17 Haziran (Earnings oncesi 1-2 gun)
```

### FOMC UYARISI!
> **17 Haziran FOMC Karari saat 14:00 ET!**
> Eger FOMC sert mesaj verirse tum piyasa sallanir.
> Eger FOMC yumusak kalirsa IV artar.
> **Öneri:** FOMC sonrasi (17 Haziran aksam) giris yap. 18 Haziran sabah ACN earnings aciklaniyor - BUNU BEKLEME!

### Greeks Tahmini

| Greek | Deger | Aciklama |
|-------|-------|----------|
| Net Delta | -0.18 (Bearish) | %65 put agirlikli |
| **Vega** | **+0.35** | **Her 1% IV artisi = ~$35 kazanc** |
| Theta | -$1.80/gun | Zaman kaybi |
| Net Gamma | -0.015 | Asagi harekete daha hassas |

### Kar/Zarar Senaryolari

| Senaryo | IV Degisimi | Hisse Hareketi | Est. Kar/Zarar |
|---------|-------------|----------------|----------------|
| IV +12%, Hisse -3% | +12% | $179→$174 | **+$800 ile +$1,500** |
| IV +10%, Hisse +2% | +10% | $179→$183 | +$200 ile +$500 |
| IV sabit, Hisse -5% | 0% | $179→$170 | **+$300 ile +$600** (Delta kazanir) |
| IV sabit, Hisse sabit | 0% | $179→$179 | -$180 (Theta) |

---

## 4. KR (Kroger) - 18 HAZIRAN BMO - 12 GUN KALDI

### Hisse Durumu
| Metrik | Deger |
|--------|-------|
| Fiyat | $63.96 |
| 50MA | $67.76 (Altinda) |
| 200MA | $66.83 (Altinda) |
| IV Rank | ~60% |
| Expected Move | ±5.5% |
| EPS Beklenti | $1.58 |

### Haber Analizi (Bias Belirleyici)
- **NEGATIF:** 50MA ve 200MA altinda
- **NEGATIF:** Margin pressure, consumer spending zayif
- **NEGATIF:** Walmart/Amazon rekabeti
- **POZITIF:** Beta 0.42 (cok dusuk volatilite = ucuz opsiyon)
- **POZITIF:** Defensive sektor (recession hedge)

### Strateji: IV Expansion + Bearish Bias

```
Call/Put Orani:     %30 Call / %70 Put
Bearish Bias:       MA'lar altinda, margin pressure

CALL (30% agirlik):
  Strike:     $65 Call (hafif OTM)
  Miktar:     3 kontrat (ornek: $5,000)

PUT (70% agirlik):
  Strike:     $63 Put (hafif OTM/ATM)
  Miktar:     7 kontrat (ornek: $5,000)

Expiry:     20 Haziran 2026 (2 DTE) - AGRESIF
            27 Haziran 2026 (9 DTE) - ONERILEN
            
Giris:      13-16 Haziran
Cikis:      16-17 Haziran (FOMC + earnings riski)
```

### Avantaj: UCUZ OPSIYONLAR!
> Beta 0.42 = dusuk IV = cok ucuz opsiyonlar!
> Call ~$0.50, Put ~$0.80 tahmini. Cok dusuk risk.

---

## 5. FDX (FedEx) - 23 HAZIRAN AMC - 17 GUN KALDI

### Hisse Durumu
| Metrik | Deger |
|--------|-------|
| Fiyat | $332.64 |
| 50MA | $305.93 (Guclu uzerinde) |
| 200MA | $249.73 (Cok uzerinde) |
| IV Rank | ~55% (Dusuk!) |
| Expected Move | ±7.0% |
| EPS Beklenti | $5.84 (Onceki: $5.25) |

### Haber Analizi (Bias Belirleyici)
- **POZITIF:** Trend cok guclu (%86 52W'de)
- **POZITIF:** Cost cutting programi meyve veriyor
- **POZITIF:** Lojistik sektoru robust
- **RISK:** 52W high'a %2.5 yakin (technical resistance)
- **AVANTAJ:** IV Rank 55% = henuz IV sismedi! Erken giris firsati.

### Strateji: IV Expansion + Bullish Bias

```
Call/Put Orani:     %65 Call / %35 Put
Bullish Bias:       Guclu trend, her iki MA uzerinde

CALL (65% agirlik):
  Strike:     $340 Call (hafif OTM)
  Miktar:     6.5 kontrat (ornek: $10,000)

PUT (35% agirlik):
  Strike:     $325 Put (hafif OTM)
  Miktar:     3.5 kontrat (ornek: $10,000)

Expiry:     27 Haziran 2026 (4 DTE) - AGRESIF
            3 Temmuz 2026 (9 DTE) - ONERILEN
            
Giris:      15-18 Haziran (IV henuz dusuk, erken giris avantaji!)
Cikis:      20-22 Haziran (Earnings oncesi 1-3 gun)
```

### Avantaj: Erken Giris Firsati!
> IV Rank sadece 55% - henuz IV sismedi!
> Eger 15-18 Haziran'da girerseniz IV artisi onunde olursunuz.
> **Ideal:** IV 55% → 75% arttiginda %20 prim kazanci.

---

## 6. MU (Micron) - 24 HAZIRAN AMC - 18 GUN KALDI

### Hisse Durumu
| Metrik | Deger |
|--------|-------|
| Fiyat | $886.74 |
| 50MA | $595.71 (Cok uzerinde) |
| 200MA | $352.78 (Cok cok uzerinde) |
| **IV Rank** | **95.29%** (Cok yuksek) |
| Expected Move | ±20% |
| EPS Beklenti | $19.72 (Onceki: $12.07) |
| FQ3 Revenue Guid. | $33.5B (+75% QoQ!) |

### Haber Analizi (Bias Belirleyici)
- **POZITIF:** AI HBM talebi patliyor
- **POZITIF:** FQ3 guidance $33.5B (+75% QoQ)
- **POZITIF:** Forward P/E sadece 8.4 (asiri ucuz)
- **RISK:** IV Rank 95.29% - opsiyonlar cok pahali
- **RISK:** Expected Move ±20% - cok volatil
- **RISK:** Beta 2.17 - hisse cok sert hareket eder

### Strateji: IV Expansion + Strong Bullish Bias

```
Call/Put Orani:     %75 Call / %25 Put
Strong Bullish:     AI HBM patlamasi, rekor guidance

CALL (75% agirlik):
  Strike:     $900 Call (hafif OTM)
  Alternatif: $920 Call (daha OTM, daha ucuz)
  Miktar:     7.5 kontrat (ornek: $15,000)

PUT (25% agirlik):
  Strike:     $870 Put (hafif OTM)
  Miktar:     2.5 kontrat (ornek: $15,000)

Expiry:     27 Haziran 2026 (3 DTE) - COK AGRESIF
            3 Temmuz 2026 (9 DTE) - ONERILEN
            
Giris:      16-20 Haziran (IV yuksek ama daha da sisebilir)
Cikis:      22-23 Haziran (Earnings oncesi 1-2 gun)
```

### Uyari: EN AGRESIF HİSSE
> IV zaten cok yuksek (%95.29). IV daha fazla sisirse primler uçar.
> Ama IV duserse ("IV deflation") primler erir.
> **Pozisyon buyuklugu:** Portfoyun MAX %20'si. Bu hisse tek basina portfoyu sallar.

---

## GIRIS/CIKIS TAKVIMI

| Tarih | Hisse | Islem | Aciklama |
|-------|-------|-------|----------|
| **6-7 Haziran** | ORCL | **GIRIS** | Hemen! 4 gun kaldi |
| **8-9 Haziran** | ADBE | **GIRIS** | 5 gun kaldi |
| **9 Haziran** | ORCL | **CIKIS** | Earnings oncesi son gun |
| **10-11 Haziran** | ADBE | **CIKIS** | Earnings oncesi |
| **12-15 Haziran** | ACN, KR, FDX | **GIRIS** | IV Expansion baslangici |
| **16 Haziran** | FOMC | **BEKLE** | Saat 14:00 ET FOMC karari! |
| **16-17 Haziran** | ACN, KR | **CIKIS** | 18 Haziran BMO earnings |
| **18 Haziran** | ACN, KR | EARNINGS | ACIKLANDI - biz ciktik! |
| **18-20 Haziran** | FDX, MU | **GIRIS** | 23-24 Haziran earnings |
| **20-22 Haziran** | FDX, MU | **CIKIS** | Earnings oncesi |
| **23-24 Haziran** | FDX, MU | EARNINGS | ACIKLANDI - biz ciktik! |

---

## RISK YONETIMI

### Ana Riskler

| Risk | Olasilik | Etki | Önlem |
|------|----------|------|-------|
| **IV Artmaz** | Orta | Kayip (Theta) | E-10'dan once gir, E-3'e kadar bekle |
| **IV Deflation** | Dusuk | Ciddi Kayip | VIX >25 ise girme |
| **Hisse Sert Hareket** | Yuksek | Bias taraf kazanir | Call+Put dengesi korur |
| **FOMC Soku** | 17 Haziran | Tüm portfoy etkilenir | FOMC oncesi pozisyon kucult |
| **Theta Kaybi** | Kesin | Günlük erime | Erken gir, erken cik |

### Pozisyon Buyuklugu (Örnek $50,000 Portfoy)

| Hisse | Sermaye | Kontrat Sayisi (Ornek) |
|-------|---------|------------------------|
| ORCL | $10,000 (~%20) | 10 kontrat (7C+3P) |
| ADBE | $7,500 (~%15) | 10 kontrat (5.5C+4.5P) |
| ACN | $7,500 (~%15) | 10 kontrat (3.5C+6.5P) |
| KR | $5,000 (~%10) | 10+ kontrat (3C+7P) |
| FDX | $10,000 (~%20) | 10 kontrat (6.5C+3.5P) |
| MU | $10,000 (~%20) | 5-8 kontrat (7.5C+2.5P) |

### Golden Rules
1. **Earnings açıklanmadan MUTLAKA çık!** (IV Crush öldürür)
2. **Kar hedefi: %30-50 prim artışı** (Maksimize etmeye çalışma, erken git)
3. **FOMC günü (17 Haziran) pozisyon küçült!**
4. **Tek hissedeki max kayıp: Portfoyün %2'si**
5. **VIX >25 ise tüm girişleri durdur!**

---

## GUNLUK TAKIP KONTROL LISTESI

```
[] VIX seviyesi (Sari/Kirmizi ise dikkat)
[] Açık pozisyonların P/L durumu
[] IV Rank değişimi (IV artiyor mu?)
[] Hisse haber akisi (katalist var mi?)
[] Greeks kontrolü (Vega, Theta, Delta)
[] Çikis zamanlamasi yaklasti mi?
```

---

> **YASAL UYARI:** Bu rapor yalnizca egitim ve arastirma amaclidir. Finansal tavsiye niteliginde degildir. Hisse senedi ve opsiyon ticareti yuksek risk icerir ve yatirimcilarin tum sermayesini kaybetmesine neden olabilir. Pre-Earnings IV Expansion stratejisi theta (zaman) riski tasir; IV artmazsa kayip yasanir. Yatirim karari almadan once profesyonel danismana basvurunuz.
