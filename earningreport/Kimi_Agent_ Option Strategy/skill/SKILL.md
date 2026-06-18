---
name: earningsplay-opsiyon-stratejisi
description: >
  Amerikan borsalarinda (NYSE, NASDAQ) earnings (kazanç) döneminde opsiyon 
  stratejileri ile IV Crush'tan faydalanmak icin profesyonel skill. Iron Condor, 
  Long Straddle/Strangle, earnings volatilite analizi, Greeks yönetimi, 
  ileri opsiyon fiyatlama modelleri (Heston, Lévy, Black-Scholes), 
  sektörel/hisse spesifik IV davranislari, 0DTE/1DTE stratejileri, 
  VIX + earnings kombinasyonu, duyarlilik bazli stratejiler ve 
  4 kriz senaryosu earnings playbook'u icerir.
  Trigger: kullanici "earnings", "IV crush", "iron condor", "long straddle",
  "opsiyon stratejisi", "kazanç dönemi", "volatilite ticareti", "0DTE",
  "earnings play", "opsiyon" gibi ifadeler kullandiginda aktiflesir.
---

# EarningsPlay — Opsiyon Stratejisi Skill'i

Earnings döneminde volatilite ticareti: IV Crush'tan kazanma, Greeks yönetimi ve ileri fiyatlama modelleri.

## Core Workflow

### Adim 1: Earnings Öncesi Hazirlik

**Kontrol listesi:**
- [ ] Hisse'nin earnings tarihi ve saati (BMO/AMC)
- [ ] IV Rank > %50 (Iron Condor) veya IV Rank < %60 (Long Straddle)
- [ ] VIX seviyesi: VIX < 30 (normal), VIX 30-40 (%50 azalt), VIX > 40 (kac)
- [ ] Sektörel IV profili (Tech %35-55 crush, Utilities %15-25)
- [ ] Geçmis earnings tepkisi: implied vs actual move
- [ ] Makro veri çakismasi kontrolü (FOMC, CPI, NFP)

> **Detayli sektörel IV Crush tablosu, "IV Crush Kings" listesi, hisse spesifik veriler:**
> `references/EarningsPlay_v4.md` Bolum 3b

### Adim 2: Strateji Seçimi (VIX + IV Rank Bazli)

| VIX | IV Rank | Strateji | Pozisyon | Kazanma Olasiligi |
|---|---|---|---|---|
| <15 | >%50 | Iron Condor (genis) | %100 | %65-70 |
| 15-25 | >%50 | Iron Condor (wider wings) | %100 | %60-65 |
| 25-35 | >%50 | Reduced size IC veya Long Straddle | %50 | %50-55 |
| 25-35 | <%60 | Long Straddle (güclü katalist) | %50 | %35-45 |
| 35-45 | Herhangi | Long Straddle/Strangle veya nakit | %25 | %30-40 |
| >45 | Herhangi | Kac veya VIX call hedge | %0-10 | Spekülatif |

> **VIX + earnings kombinasyon detaylari, VVIX göstergesi:**
> `references/EarningsPlay_v4.md` Bolum A

### Adim 3: Iron Condor (Ana Strateji — Short Vega)

| Kriter | Deger |
|---|---|
| **IV Rank** | >%50 (ReachMarkets backtest: +%4 yillik getiri) |
| **Entry** | Kazançtan 1-2 gün önce, 30-45 DTE |
| **Wing width** | Hisse fiyati / 10 (örn. $200 hisse = $20 wing) |
| **Short strikes** | EM'nin %10-15 disi |
| **Kâr hedefi** | Toplanan primin %50'si (mekanik exit) |
| **Çikis** | 21 DTE veya %50 kâr (hangisi önce gelirse) |
| **Max kayip** | 2.0x toplanan kredi (stop) |

**Greeks Checklist:**
| Greek | Hedef | Uyari |
|---|---|---|
| Delta | -0.10 ile +0.10 | >±0.10 = hemen ayarla |
| Theta | Pozitif | Günlük zaman kaybindan kazanç |
| Vega | Negatif | IV dususunden (Crush) kazanilir |
| Gamma | Düsük | 21 DTE'de çikis (gamma patlamasi önle) |

> **Detayli Greeks dashboard, VIX bazli sizing, sentiment + earnings kombinasyonu:**
> `references/EarningsPlay_v4.md` Bolum 3, B

### Adim 4: Long Straddle/Strangle (Nadir — Long Vega)

**Kosullar (hepsi saglanmali):**
- IV Rank < %60 (ucuz opsiyon)
- Güclü katalist: FDA, M&A, earnings surprise >%20
- Sektör: Biotech (30-60% hareket), AI/Semiconductor, EV
- Pozisyon: Hesabin %2'sinden fazla risk atma
- Kazanma orani: %35-45 (düsük ama kazananlarda 2:1 R/R)

**Long Strangle (daha uygun):**
- Maliyet daha düsük (OTM strike'lar)
- EM'nin %5-10 disindaki OTM strike'lar
- Daha büyük hareket gerekli ama kazanma olasiligi yüksek

> **Long Straddle kazanma oranlari, optimal hisse kategorileri, gamma scalping:**
> `references/EarningsPlay_v4.md` Bolum 3b, 4

### Adim 5: Ileri Fiyatlama Modeli Entegrasyonu

**Model seçim rehberi:**
| Model | RMSE% | Hiz | Kullanim |
|---|---|---|---|
| NIG (Lévy) | %4.72 | 21,906ms | En dogru fiyatlama |
| Quantum/PCE | %4.92 | 10ms | En hizli, real-time |
| Variance-Gamma | %5.43 | 10,474ms | Dengeli |
| Rough Heston | %8.78 | 2,761ms | Volatilite egrisi |

**Opsiyon adil degeri analizi:**
- Black-Scholes fair value < Piyasa fiyati -> Opsiyon pahali -> Short vega
- Black-Scholes fair value > Piyasa fiyati -> Opsiyon ucuz -> Long vega

> **13 model benchmark karsilastirmasi, Heston/Lévy detaylari, Greeks zaman davranisi:**
> `references/EarningsPlay_v4.md` Bolum D, E

### Adim 6: Risk Yonetimi ve Çikis

- **Pozisyon buyuklugu:** Hesabin %1-2'si (VIX>30'da %0.5, VIX>40'da %0.25)
- **Çesitlendirme:** Farkli sektörlerden, farkli earnings tarihlerine
- **50% kâr kurali:** Tastytrade backtest: kazanma orani %52 -> %68
- **21 DTE kurali:** Gamma riski önleme (mekanik)
- **Duygusal disiplin:** Önceden belirlenmis kurallara sadik kal

## Quick Reference: Earnings Stratejisi Hizli Karsilastirma

| Strateji | Vega | Theta | IV Crush | K.O. | Best Environment |
|---|---|---|---|---|---|
| Iron Condor | Negatif | Pozitif | KAZANÇ | %60-68 | VIX 15-30, IV Rank >%50 |
| Short Straddle | Negatif | En Pozitif | Max KAZANÇ | %55-60 | VIX <25, net range |
| Long Straddle | Pozitif | Negatif | ZARAR | %35-45 | VIX <20, güclü katalist |
| Calendar Spread | Karisik | Karisik | Karisik | %50-55 | Düsük IV ortami |

## 0DTE/1DTE Stratejileri

**0DTE Iron Condor:**
- 10-point SPX spread, ~$1 prim
- Entry: 10:00-10:30 AM (açilis volatilitesi dinince)
- Çikis: "Set and forget" veya 10-cent bid
- Pozisyon: Hesabin %2-5'inden fazla olmamali
- Risk: $9 kayip / $1 kazanma (Gamma riski zirvede)

**0DTE Scalping:**
- Entry: 9:45-11:00 veya 13:00-14:30
- Hedef: 10-20 SPX puani ($100-200/kontrat)
- Stop: 2x kredi
- Max risk: %0.5

> **CBOE 2025 verileri, 0DTE risk uyarlari, theta decay zamanlamasi:**
> `references/EarningsPlay_v4.md` Bolum 5, 7

## Kriz Döneminde Earnings Stratejileri

| Kriz Tipi | Strateji | Pozisyon |
|---|---|---|
| Yapitsal (2008) | Tamamen kaç | %0 |
| Dis SOK (2020) | VIX hedge + nakit | %0-10 |
| Makro (2022) | Dar IC, protective puts | %20-30 |
| Politik (2025) | Sektörel ayrim, defansif | %30-40 |
| Recovery | Agresif IC, VIX crush trade | %60-80 |

> **4 kriz earnings playbook, adaptive sizing by regime:**
> `references/EarningsPlay_v4.md` Bolum C

## Kaynaklar

- `references/EarningsPlay_v4.md` — Tam referans dokümani (2459 satir): 13 model benchmark, Greeks ileri analizi, Heston/Lévy fiyatlama, kriz playbook'u, 0DTE stratejileri, 31 akademik makale sentezi
