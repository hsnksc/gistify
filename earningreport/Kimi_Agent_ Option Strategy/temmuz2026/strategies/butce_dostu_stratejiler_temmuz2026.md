# Bütçe Dostu Earnings Stratejileri — Temmuz 2026
## $10-$500 Bütçeyle Uygulanabilir Earnings Öncesi Opsiyon Stratejileri

**Rapor Tarihi:** 2025-06-18  
**Earnings Sezonu:** Temmuz 2026  
**VIX:** 18.16 (%100 normal pozisyon)  
**FOMC:** 28-29 Temmuz (pozisyon küçült)  
**Strateji Versiyonu:** EarningsPlay v4

---

## İÇİNDEKİLER

1. [EarningsPlay v4 Kuralları](#kurallar)
2. [Öncelik Sıralaması ve En İyi 5 Fırsat](#en-iyi-5)
3. [Teknoloji Hisseleri Stratejileri](#teknoloji)
   - [AMD](#amd) | [TSLA](#tsla) | [NFLX](#nflx) | [NVDA](#nvda) | [META](#meta)
   - [AMZN](#amzn) | [GOOGL](#googl) | [AAPL](#aapl) | [MSFT](#msft)
4. [Finansal + Diğer Hisseler Stratejileri](#diger)
   - [JPM](#jpm) | [BAC](#bac) | [GS](#gs) | [XOM](#xom) | [JNJ](#jnj)
   - [UNH](#unh) | [MA](#ma) | [DIS](#dis) | [NKE](#nke)
5. [Tüm Stratejiler Özet Tablosu](#ozet-tablo)
6. [Risk Yönetimi ve Uyarılar](#risk)

---

## <a name="kurallar"></a>EarningsPlay v4 Kuralları

| Parametre | Değer | Açıklama |
|-----------|-------|----------|
| **Pozisyon Büyüklüğü** | Hesabın %1-2'si | Asla tek pozisyona fazla yatırım yapma |
| **VIX 18.16** | %100 Normal Pozisyon | Mevcut VIX seviyesi normal |
| **FOMC 28-29 Temmuz** | Pozisyon Küçült | FOMC öncesi risk azalt |
| **Max Bütçe/Hisse** | $10-$500 | Mikro bütçe ile çeşitlendirme |
| **Hedef** | IV Şişmesinden Kar | Earnings öncesi şişen opsiyon primi |

### CPR (Call/Put Ratio) Yorumlaması
- **CPR < 1.0** → Call ağırlıklı (Bullish bias) → Call stratejileri
- **CPR > 1.0** → Put ağırlıklı (Bearish bias) → Put stratejileri
- **CPR > 2.0** → Aşırı put ağırlıklı → Contrarian call düşünülebilir

---

## <a name="en-iyi-5"></a>🎯 EN İYİ 5 "LOTTERY TICKET" FIRSATI

> **Öncelik Sıralaması:** IV Rank (yüksek = daha şişmiş prim = daha fazla kazanç potansiyeli) + Makul gereken hareket

| Sıra | Hisse | Tip | Strike | Prim | Maliyet | Gerekli Hareket | IV Rank | **Değerlendirme** |
|------|-------|-----|--------|------|---------|-----------------|---------|-------------------|
| **1** | **AMD** | CALL | $882.59 | $0.42 | **$42** | +80% | 91.69% | En yüksek IV Rank! Earnings volatilitesiyle en şişmiş prim |
| **2** | **TSLA** | CALL | $654.32 | $0.35 | **$35** | +60% | 80% | TSLA'nın earnings hareketi $35'ı kolayca aşabilir |
| **3** | **NFLX** | CALL | $115.70 | $0.39 | **$39** | +40% | 75% | Düşük hisse fiyatı + yüksek IV = uygun maliyetli |
| **4** | **NVDA** | CALL | $312.96 | $0.19 | **$19** | +50% | 70% | En düşük maliyetli! $19 ile NVDA'ya giriş |
| **5** | **META** | CALL | $936.62 | $0.18 | **$18** | +60% | 65% | En ucuz prim! $18 ile META lottery ticket |

### Bu 5 Fırsatın Toplam Maliyeti: **$153**
- **Max Risk:** $153 (tümü zarar ederse)
- **Potansiyel:** Herhangi biri patlarsa 5x-50x getiri potansiyeli
- **Not:** Her biri hesabın %1-2'si ile girilmeli, toplam risk sınırlandırılmalı

---

## <a name="teknoloji"></a>TEKNOLOJİ HİSSELERİ STRATEJİLERİ

---

### <a name="amd"></a>AMD — $490.33 — CPR: 0.71 — IV Rank: 91.69% ⭐ EN YÜKSEK IV

> **Bias:** Bullish (CPR 0.71 < 1) | **IV:** 75% | **Etkinlik:** Earnings öncesi IV en yüksek hisse!

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$882.59** | **$0.42** | **$42** | Sınırsız | +80% |

- **Delta:** ~0.02 | **Gamma:** Yüksek | **Theta:** -0.01/gün
- **Strateji:** IV crush'a karşı en şişmiş prim. Earnings sonrası %5-10 hareket bile primi 2-3x yapabilir.
- **Risk:** $42 tamamen kaybedilebilir (hesabın %1-2'si)

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $514.85C | $520.00C | $1.91 | $324 (1 kontrat) | ~$516.76 |
| $490.00C | $500.00C | $3.50 | $650 (1 kontrat)* | ~$493.50 |

\* Alternatif: Daha geniş spread, daha yüksek kazanç potansiyeli ama maliyet $350

#### $200-$500: Long Call Butterfly + Call Ratio Spread

| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| **Butterfly:** Buy $476C / Sell 2x$490C / Buy $505C | $216 (3 kontrat) | $4,197 | $216 |
| **Ratio:** Buy 1x$490C / Sell 2x$515C | $180 (kredi) | $2,500+ | Sınırsız üstte |

- **Butterfly Rationale:** AMD earnings'te genellikle sınırlı aralıkta kalır. Butterfly merkezden kar elde eder.
- **Not:** 91.69% IV Rank = Earnings öncesi prim en tepede. IV crush riski yüksek ama öncesi satış potansiyeli de yüksek.

#### Özet: En İyi Değer
> AMD'de **$42 lottery ticket** en yüksek IV Rank ile en şişmiş primi yakalar. Debit Call Spread ile risk sınırlandırılabilir. Butterfly, sınırlı hareket beklentisiyle mükemmel risk/ödül sunar.

---

### <a name="tsla"></a>TSLA — $408.95 — CPR: 0.64 — IV Rank: 80%

> **Bias:** Bullish (CPR 0.64 < 1) | **IV:** 62% | **Etkinlik:** TSLA her zaman hareketli!

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$654.32** | **$0.35** | **$35** | Sınırsız | +60% |

- **Delta:** ~0.015 | **Vega:** Yüksek (IV değişimine hassas)
- **Strateji:** TSLA earnings'te %10-20 hareket normaldir. Bu primi katlayabilir.

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $400.77C | $404.78C | $1.99 | $202 (1 kontrat) | ~$402.76 |
| $408.95C | $420.00C | $5.50 | $650 (1 kontrat)* | ~$414.45 |

\* Alternatif daha geniş spread, maliyet $550 (Seviye 3 sınırında)

#### $200-$500: Long Call Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $397C / Sell 2x$409C / Buy $421C | $218 (3 kontrat) | $3,463 | $218 |

- TSLA merkezli butterfly: $409 merkez fiyat. TSLA bu aralıkta kalırsa mükemmel getiri.

#### Özet: En İyi Değer
> **$35 lottery ticket** TSLA için çok uygun. Earnings öncesi TSLA opsiyonları ciddi şişer. Debit spread daha makul risk yönetimi sunar.

---

### <a name="nflx"></a>NFLX — $82.64 — CPR: 0.72 — IV Rank: 75%

> **Bias:** Bullish (CPR 0.72 < 1) | **IV:** 62% | **Etkinlik:** Düşük fiyat = uygun bütçe!

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$115.70** | **$0.39** | **$39** | Sınırsız | +40% |

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $78.51C | $80.08C | $0.86 | $71 (1 kontrat) | ~$79.37 |
| $82.64C | $86.00C | $1.50 | $286 (2 kontrat) | ~$84.14 |

#### $200-$500: Long Call Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $76C / Sell 2x$83C / Buy $89C | $207 (2 kontrat) | $1,115 | $207 |

#### Özet: En İyi Değer
> **$82.64 fiyatı** ile NFLX en bütçe dostu hisselerden. **$39 lottery ticket** veya **2 kontrat spread** ($172) ile girilebilir. Düşük hisse fiyatı = daha az sermaye bağlama.

---

### <a name="nvda"></a>NVDA — $208.64 — CPR: 0.68 — IV Rank: 70%

> **Bias:** Bullish (CPR 0.68 < 1) | **IV:** 55%

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$312.96** | **$0.19** | **$19** | Sınırsız | +50% |

- **En ucuz lottery ticket!** Sadece $19 ile NVDA'ya maruz kalma.

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $208.64C | $212.81C | $1.88 | $229 (1 kontrat) | ~$210.52 |
| $200.00C | $210.00C | $3.80 | $620 (1 kontrat)* | ~$203.80 |

\* Alternatif daha geniş spread

#### $200-$500: Long Call Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $198C / Sell 2x$209C / Buy $219C | $232 (2 kontrat) | $1,854 | $232 |
| Buy 1x$209C / Sell 2x$230C | -$17 (kredi!) | $2,069 | Sınırsız üstte |

#### Özet: En İyi Değer
> **$19 lottery ticket** bu listenin en ucuz giriş noktası! Aynı anda **call ratio spread** kredi veriyor (-$17) — bu strateji IV crush'dan korunma sağlar.

---

### <a name="meta"></a>META — $585.39 — CPR: 0.65 — IV Rank: 65%

> **Bias:** Bullish (CPR 0.65 < 1) | **IV:** 55%

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$936.62** | **$0.18** | **$18** | Sınırsız | +60% |

- **Listede en ucuz prim!** Sadece $18.

#### $50-$200: ⛔ META için $50-$200 arası spread bulunamadı
- Hisse fiyatı çok yüksek ($585). Dar spread'ler bile pahalı.
- **Öneri:** 2x Lottery Ticket ($18 x 2 = $36) veya Seviye 3'e geç.

#### $200-$500: Long Call Butterfly + Call Ratio Spread
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $568C / Sell 2x$585C / Buy $603C | $235 (2 kontrat) | $3,277 | $235 |
| Buy 1x$585C / Sell 2x$644C | **-$47 (kredi!)** | $5,807 | Sınırsız üstte |

- **Ratio Spread harika:** Kredi alarak pozisyon açıyorsunuz! Eğer META $644 altında kalırsa karlısınız.

#### Özet: En İyi Değer
> **$18 lottery ticket** en ucuz giriş. **Call Ratio Spread (-$47 kredi)** META'da en iyi değer — kredi alarak pozisyon açıyorsunuz ve üstte sınırsız risk var ama $644 üzeri gerekiyor.

---

### <a name="amzn"></a>AMZN — $245.22 — CPR: 0.62 — IV Rank: 60%

> **Bias:** Bullish (CPR 0.62 < 1) | **IV:** 48%

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$343.31** | **$0.26** | **$26** | Sınırsız | +40% |

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $257.48C | $262.63C | $1.72 | $343 (1 kontrat) | ~$259.20 |
| $245.00C | $255.00C | $3.20 | $680 (2 kontrat) | ~$248.20 |

#### $200-$500: Long Call Butterfly + Call Ratio Spread
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $238C / Sell 2x$245C / Buy $253C | $282 (5 kontrat) | $3,398 | $282 |
| Buy 1x$245C / Sell 2x$265C | $70 (kredi) | $2,032 | Sınırsız üstte |

#### Özet: En İyi Değer
> **$26 lottery ticket** çok uygun maliyetli. Butterfly 5 kontratla $282'ye çıkıyor ve $3,398 max kar potansiyeli var. AMZN earnings genellikle sınırlı kalır — butterfly ideal.

---

### <a name="googl"></a>GOOGL — $363.31 — CPR: 0.58 — IV Rank: 58%

> **Bias:** Bullish (CPR 0.58 < 1) | **IV:** 48% — En düşük CPR = en bullish!

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$508.63** | **$0.38** | **$38** | Sınırsız | +40% |

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $356.04C | $359.60C | $1.84 | $172 (1 kontrat) | ~$357.88 |
| $381.48C | $387.20C | $1.94 | $378 (1 kontrat) | ~$383.42 |

#### $200-$500: Long Call Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $352C / Sell 2x$363C / Buy $374C | $251 (3 kontrat) | $3,019 | $251 |
| Buy 1x$363C / Sell 2x$392C | $104 (kredi) | $3,010 | Sınırsız üstte |

#### Özet: En İyi Değer
> **CPR 0.58 en düşük** — piyasa en bullish GOOGL'da. OTM call spread ($381C/$387C) %194 ROI ile mükemmel değer sunuyor.

---

### <a name="aapl"></a>AAPL — $301.54 — CPR: 0.64 — IV Rank: 55%

> **Bias:** Bullish (CPR 0.64 < 1) | **IV:** 48%

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$422.16** | **$0.32** | **$32** | Sınırsız | +40% |

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $325.66C | $332.17C | $1.76 | $475 (1 kontrat) | ~$327.42 |
| $301.54C | $312.00C | $3.50 | $546 (1 kontrat)* | ~$305.04 |

\* Alternatif daha geniş spread

#### $200-$500: Long Call Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $292C / Sell 2x$302C / Buy $311C | $208 (3 kontrat) | $2,507 | $208 |
| Buy 1x$302C / Sell 2x$326C | $86 (kredi) | $2,498 | Sınırsız üstte |

#### Özet: En İyi Değer
> **Debit Call Spread $325C/$332C** %270 ROI ile harika. AAPL stabil hareket eder — butterfly $208 riskle $2,507 kazanç potansiyeli sunar.

---

### <a name="msft"></a>MSFT — $411.74 — CPR: 0.57 — IV Rank: 50%

> **Bias:** Bullish (CPR 0.57 < 1) | **IV:** 42%

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$576.44** | **$0.15** | **$15** | Sınırsız | +40% |

- **Listede en ucuz primlerden biri!**

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $411.74C | $415.86C | $1.94 | $218 (1 kontrat) | ~$413.68 |
| $400.00C | $415.00C | $5.50 | $1,100 (2 kontrat)* | ~$405.50 |

\* Alternatif

#### $200-$500: Long Call Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $399C / Sell 2x$412C / Buy $424C | $216 (2 kontrat) | $2,254 | $216 |

#### Özet: En İyi Değer
> **$15 lottery ticket** MSFT için çok düşük maliyetli. IV 50% ile şişme potansiyeli var. Butterfly $216 riskle sınırlı hareketten kar sağlar.

---

## <a name="diger"></a>FİNANSAL + DİĞER HİSSELER STRATEJİLERİ

---

### <a name="jpm"></a>JPM — $230.00 — CPR: 0.77 — IV Rank: 45%

> **Bias:** Bullish (CPR 0.77 < 1) | **IV:** 42%

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$299.00** | **$0.39** | **$39** | Sınırsız | +30% |

- **Düşük hareket gereksinimi!** Sadece +30% — listedeki en düşüklerden.

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $234.60C | $239.29C | $1.87 | $282 (1 kontrat) | ~$236.47 |
| $230.00C | $240.00C | $3.20 | $680 (2 kontrat) | ~$233.20 |

#### $200-$500: Long Call Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $223C / Sell 2x$230C / Buy $237C | $302 (5 kontrat) | $3,148 | $302 |
| Buy 1x$230C / Sell 2x$248C | -$82 (kredi!) | $1,758 | Sınırsız üstte |

#### Özet: En İyi Değer
> **+$30% hareket** gereksinimi ile en makul lottery ticket'lerden biri. **Ratio spread -$82 kredi** veriyor — pozisyon açarken para alıyorsunuz!

---

### <a name="bac"></a>BAC — $40.00 — CPR: 1.92 — IV Rank: 50%

> **Bias:** Bearish (CPR 1.92 > 1) | **IV:** 42% | **Not:** CPR > 1.5 put ağırlıklı

#### $10-$50: Far OTM Put (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **PUT** | **$35.20** | **$0.44** | **$44** | Sınırsız | -12% |

- **Çok düşük hareket gereksinimi!** Sadece -12% düşüş gerekiyor.

#### $50-$200: Debit Put Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $40.80P | $39.58P | $0.64 | $58 (1 kontrat) | ~$40.16 |
| $42.00P | $38.00P | $0.87 | $313 (3 kontrat) | ~$41.13 |

#### $200-$500: Long Put Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $37P / Sell 2x$40P / Buy $43P | $219 (3 kontrat) | $741 | $219 |

#### Özet: En İyi Değer
> **CPR 1.92** bearish sinyali veriyor. **-$12% hareket** gereksinimi ile en kolay lottery ticket! Put butterfly $219 riskle BAC'nin $40 civarında kalmasına oynuyor.

---

### <a name="gs"></a>GS — $600.00 — CPR: 1.34 — IV Rank: 55%

> **Bias:** Bearish (CPR 1.34 > 1) | **IV:** 48%

#### $10-$50: Far OTM Put (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **PUT** | **$420.00** | **$0.26** | **$26** | Sınırsız | -30% |

- **Düşük hareket gereksinimi** (yüksek fiyatlı hisse için): -30%

#### $50-$200: ⛔ GS için $50-$200 arası uygun spread bulunamadı
- $600 fiyat çok yüksek. Butterfly (Seviye 3) önerilir.

#### $200-$500: Long Put Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $582P / Sell 2x$600P / Buy $618P | $276 (2 kontrat) | $3,324 | $276 |

- **GS Put Butterfly:** $600 merkez. GS bu aralıkta kalırsa mükemmel getiri.

#### Özet: En İyi Değer
> **$26 put lottery ticket** düşük maliyetli. CPR 1.34 bearish. Put butterfly $276 riskle $3,324 potansiyel sunar.

---

### <a name="xom"></a>XOM — $110.00 — CPR: 2.50 — IV Rank: 50%

> **Bias:** Bearish (CPR 2.50 > 1) | **IV:** 42% | **Not:** En yüksek CPR!

#### $10-$50: Far OTM Put (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **PUT** | **$88.00** | **$0.25** | **$25** | Sınırsız | -20% |

- **-20% hareket** petrol hissesi için earnings döneminde mümkün.

#### $50-$200: Debit Put Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $115.50P | $113.19P | $1.44 | $87 (1 kontrat) | ~$114.06 |
| $112.00P | $108.00P | $1.55 | $455 (3 kontrat) | ~$110.45 |

#### $200-$500: Long Put Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $104P / Sell 2x$110P / Buy $116P | $239 (3 kontrat) | $1,411 | $239 |

#### Özet: En İyi Değer
> **CPR 2.50 en yüksek** — aşırı bearish. Contrarian call düşünülebilir ama put butterfly daha güvenli. $25 lottery ticket düşük maliyet.

---

### <a name="jnj"></a>JNJ — $160.00 — CPR: 0.95 — IV Rank: 30%

> **Bias:** Nötr (CPR 0.95 ≈ 1.0) | **IV:** 30% — En düşük IV Rank!

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$192.00** | **$0.22** | **$22** | Sınırsız | +20% |

- **+20% hareket** gereksinimi — listedeki en düşük!

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $156.80C | $159.94C | $1.69 | $145 (1 kontrat) | ~$158.49 |
| $160.00C | $165.00C | $1.76 | $324 (3 kontrat) | ~$161.76 |

#### $200-$500: Long Call Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $155C / Sell 2x$160C / Buy $165C | $293 (5 kontrat) | $2,107 | $293 |

#### Özet: En İyi Değer
> **IV Rank 30%** ile JNJ en düşük volatilite. Bu "sakin" hisse için butterfly ideal. **+$20% hareket** gereksinimi en düşük — primin ITM olma ihtimali en yüksek!

---

### <a name="unh"></a>UNH — $550.00 — CPR: 3.33 — IV Rank: 40%

> **Bias:** Aşırı Bearish (CPR 3.33 >> 1) | **IV:** 36%

#### $10-$50: Far OTM Put (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **PUT** | **$412.50** | **$0.10** | **$10** | Sınırsız | -25% |

- **Listede en ucuz maliyet!** Sadece $10.

#### $50-$200: ⛔ UNH için $50-$200 arası uygun spread bulunamadı

#### $200-$500: Long Put Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $534P / Sell 2x$550P / Buy $566P | $337 (2 kontrat) | $2,963 | $337 |

- **CPR 3.33** aşırı put ağırlıklı — contrarian düşünülebilir.

#### Özet: En İyi Değer
> **CPR 3.33 en aşırı değer!** Piyasa çok bearish — bu bir contrarian fırsatı olabilir. **$10 put** en ucuz giriş. Fakat UNH sağlık sektöründe earnings sürprizleri olabilir.

---

### <a name="ma"></a>MA — $530.00 — CPR: 0.88 — IV Rank: 40%

> **Bias:** Bullish (CPR 0.88 < 1) | **IV:** 36%

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$689.00** | **$0.32** | **$32** | Sınırsız | +30% |

#### $50-$200: ⛔ MA için $50-$200 arası uygun spread bulunamadı

#### $200-$500: Long Call Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $514C / Sell 2x$530C / Buy $546C | $324 (2 kontrat) | $2,856 | $324 |

#### Özet: En İyi Değer
> **IV 36%** düşük — prim ucuz. **$32 lottery ticket** düşük risk. Butterfly $324 riskle $2,856 potansiyel sunar (%880 ROI).

---

### <a name="dis"></a>DIS — $85.00 — CPR: 0.78 — IV Rank: 50%

> **Bias:** Bullish (CPR 0.78 < 1) | **IV:** 42%

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$106.25** | **$0.29** | **$29** | Sınırsız | +25% |

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $80.75C | $82.36C | $1.25 | $125 (1 kontrat) | ~$82.00 |
| $85.00C | $89.00C | $1.76 | $224 (2 kontrat) | ~$86.76 |

#### $200-$500: Long Call Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $81C / Sell 2x$85C / Buy $89C | $308 (5 kontrat) | $1,817 | $308 |
| Buy 1x$85C / Sell 2x$92C | -$30 (kredi!) | $650 | Sınırsız üstte |

#### Özet: En İyi Değer
> **+$25% hareket** makul. **Call ratio -$30 kredi** veriyor — pozisyon açarken para alıyorsunuz. DIS earnings'te genellikle hareketli.

---

### <a name="nke"></a>NKE — $72.00 — CPR: 0.72 — IV Rank: 48%

> **Bias:** Bullish (CPR 0.72 < 1) | **IV:** 42%

#### $10-$50: Far OTM Call (Lottery Ticket)
| Tip | Strike | Prim | Maliyet | Max Kar | Gerekli Hareket |
|-----|--------|------|---------|---------|-----------------|
| **CALL** | **$86.40** | **$0.47** | **$47** | Sınırsız | +20% |

- **+$20% hareket** — en düşük gereksinimlerden biri.

#### $50-$200: Debit Call Spread
| Alınan (Buy) | Satılan (Sell) | Net Debit | Max Kar | Breakeven |
|-------------|----------------|-----------|---------|-----------|
| $68.40C | $69.77C | $0.83 | $54 (1 kontrat) | ~$69.23 |
| $72.00C | $76.00C | $1.49 | $251 (2 kontrat) | ~$73.49 |

#### $200-$500: Long Call Butterfly
| Yapı | Maliyet | Max Kar | Risk |
|------|---------|---------|------|
| Buy $68C / Sell 2x$72C / Buy $76C | $261 (5 kontrat) | $1,539 | $261 |
| Buy 1x$72C / Sell 2x$78C | -$26 (kredi!) | $550 | Sınırsız üstte |

#### Özet: En İyi Değer
> **+$20% en düşük hareket gereksinimlerinden.** $47 ile NKE lottery ticket ucuz. 5 kontrat butterfly $261 riskle $1,539 potansiyel.

---

## <a name="ozet-tablo"></a>TÜM STRATEJİLER ÖZET TABLOSU

### Lottery Ticket ($10-$50) — Tüm Hisseler

| Hisse | Fiyat | Tip | Strike | Prim | Maliyet | Gerekli Hareket | IV Rank | Risk/Skor |
|-------|-------|-----|--------|------|---------|-----------------|---------|-----------|
| **AMD** | $490.33 | CALL | $882.59 | $0.42 | $42 | +80% | 91.69% | ⭐⭐⭐⭐⭐ |
| **TSLA** | $408.95 | CALL | $654.32 | $0.35 | $35 | +60% | 80% | ⭐⭐⭐⭐⭐ |
| **NFLX** | $82.64 | CALL | $115.70 | $0.39 | $39 | +40% | 75% | ⭐⭐⭐⭐⭐ |
| **NVDA** | $208.64 | CALL | $312.96 | $0.19 | $19 | +50% | 70% | ⭐⭐⭐⭐☆ |
| **META** | $585.39 | CALL | $936.62 | $0.18 | $18 | +60% | 65% | ⭐⭐⭐⭐☆ |
| **AMZN** | $245.22 | CALL | $343.31 | $0.26 | $26 | +40% | 60% | ⭐⭐⭐⭐☆ |
| **GOOGL** | $363.31 | CALL | $508.63 | $0.38 | $38 | +40% | 58% | ⭐⭐⭐⭐☆ |
| **AAPL** | $301.54 | CALL | $422.16 | $0.32 | $32 | +40% | 55% | ⭐⭐⭐⭐☆ |
| **GS** | $600.00 | PUT | $420.00 | $0.26 | $26 | -30% | 55% | ⭐⭐⭐☆☆ |
| **MSFT** | $411.74 | CALL | $576.44 | $0.15 | $15 | +40% | 50% | ⭐⭐⭐☆☆ |
| **BAC** | $40.00 | PUT | $35.20 | $0.44 | $44 | -12% | 50% | ⭐⭐⭐⭐☆ |
| **XOM** | $110.00 | PUT | $88.00 | $0.25 | $25 | -20% | 50% | ⭐⭐⭐☆☆ |
| **DIS** | $85.00 | CALL | $106.25 | $0.29 | $29 | +25% | 50% | ⭐⭐⭐⭐☆ |
| **NKE** | $72.00 | CALL | $86.40 | $0.47 | $47 | +20% | 48% | ⭐⭐⭐⭐☆ |
| **JPM** | $230.00 | CALL | $299.00 | $0.39 | $39 | +30% | 45% | ⭐⭐⭐☆☆ |
| **MA** | $530.00 | CALL | $689.00 | $0.32 | $32 | +30% | 40% | ⭐⭐⭐☆☆ |
| **UNH** | $550.00 | PUT | $412.50 | $0.10 | $10 | -25% | 40% | ⭐⭐⭐☆☆ |
| **JNJ** | $160.00 | CALL | $192.00 | $0.22 | $22 | +20% | 30% | ⭐⭐⭐☆☆ |

**Tüm Lottery Ticket'ları toplam maliyet: $563** (her birinden 1 kontrat)

---

### Debit Spread ($50-$200) — Tüm Hisseler

| Hisse | Strateji | Alınan | Satılan | Net Debit | Maliyet | Max Kar | ROI | Kontrat |
|-------|----------|--------|---------|-----------|---------|---------|-----|---------|
| AAPL | Call Spread | $325.66C | $332.17C | $1.76 | $176 | $475 | 270% | 1 |
| AMZN | Call Spread | $257.48C | $262.63C | $1.72 | $172 | $343 | 200% | 1 |
| AMD | Call Spread | $514.85C | $520.00C | $1.91 | $191 | $324 | 169% | 1 |
| BAC | Put Spread | $40.80P | $39.58P | $0.64 | $64 | $58 | 91% | 1 |
| DIS | Call Spread | $80.75C | $82.36C | $0.97 | $97 | $64 | 66% | 1 |
| GOOGL | Call Spread | $381.48C | $387.20C | $1.94 | $194 | $378 | 195% | 1 |
| JNJ | Call Spread | $156.80C | $159.94C | $1.69 | $169 | $145 | 85% | 1 |
| JPM | Call Spread | $234.60C | $239.29C | $1.87 | $187 | $282 | 151% | 1 |
| NFLX | Call Spread | $78.51C | $80.08C | $0.86 | $86 | $71 | 82% | 1 |
| NKE | Call Spread | $68.40C | $69.77C | $0.83 | $83 | $54 | 66% | 1 |
| NVDA | Call Spread | $225.33C | $232.09C | $1.88 | $188 | $487 | 257% | 1 |
| TSLA | Call Spread | $400.77C | $404.78C | $1.99 | $199 | $202 | 101% | 1 |
| XOM | Put Spread | $115.50P | $113.19P | $1.44 | $144 | $87 | 61% | 1 |

---

### Kombinasyon ($200-$500) — Tüm Hisseler

| Hisse | Strateji | Yapı | Maliyet | Max Kar | ROI | Kontrat |
|-------|----------|------|---------|---------|-----|---------|
| AMD | Butterfly | Buy $476C/2xSell $490C/Buy $505C | $216 | $4,197 | 1944% | 3 |
| TSLA | Butterfly | Buy $397C/2xSell $409C/Buy $421C | $218 | $3,463 | 1587% | 3 |
| NFLX | Butterfly | Buy $76C/2xSell $83C/Buy $89C | $207 | $1,115 | 539% | 2 |
| NVDA | Butterfly | Buy $198C/2xSell $209C/Buy $219C | $232 | $1,854 | 801% | 2 |
| META | Butterfly | Buy $568C/2xSell $585C/Buy $603C | $235 | $3,277 | 1396% | 2 |
| META | Ratio | Buy 1x$585C/Sell 2x$644C | **-$47** | $5,807 | 12314% | 1 |
| AMZN | Butterfly | Buy $238C/2xSell $245C/Buy $253C | $282 | $3,398 | 1205% | 5 |
| GOOGL | Butterfly | Buy $352C/2xSell $363C/Buy $374C | $251 | $3,019 | 1205% | 3 |
| AAPL | Butterfly | Buy $292C/2xSell $302C/Buy $311C | $208 | $2,507 | 1205% | 3 |
| MSFT | Butterfly | Buy $399C/2xSell $412C/Buy $424C | $216 | $2,254 | 1043% | 2 |
| JPM | Butterfly | Buy $223C/2xSell $230C/Buy $237C | $302 | $3,148 | 1043% | 5 |
| JPM | Ratio | Buy 1x$230C/Sell 2x$248C | **-$82** | $1,758 | 2134% | 1 |
| MA | Butterfly | Buy $514C/2xSell $530C/Buy $546C | $324 | $2,856 | 881% | 2 |
| UNH | Butterfly | Buy $534P/2xSell $550P/Buy $566P | $337 | $2,963 | 881% | 2 |
| JNJ | Butterfly | Buy $155C/2xSell $160C/Buy $165C | $293 | $2,107 | 719% | 5 |
| GS | Put Fly | Buy $582P/2xSell $600P/Buy $618P | $276 | $3,324 | 1205% | 2 |
| DIS | Butterfly | Buy $81C/2xSell $85C/Buy $89C | $308 | $1,817 | 590% | 5 |
| DIS | Ratio | Buy 1x$85C/Sell 2x$92C | **-$30** | $650 | 2134% | 1 |
| NKE | Butterfly | Buy $68C/2xSell $72C/Buy $76C | $261 | $1,539 | 590% | 5 |
| NKE | Ratio | Buy 1x$72C/Sell 2x$78C | **-$26** | $550 | 2134% | 1 |
| BAC | Put Fly | Buy $37P/2xSell $40P/Buy $43P | $219 | $741 | 339% | 3 |
| XOM | Put Fly | Buy $104P/2xSell $110P/Buy $116P | $239 | $1,411 | 590% | 3 |
| NVDA | Ratio | Buy 1x$209C/Sell 2x$230C | **-$17** | $2,069 | 12490% | 1 |
| AMZN | Ratio | Buy 1x$245C/Sell 2x$265C | $70 | $2,032 | 2920% | 1 |
| GOOGL | Ratio | Buy 1x$363C/Sell 2x$392C | $104 | $3,010 | 2906% | 1 |
| AAPL | Ratio | Buy 1x$302C/Sell 2x$326C | $86 | $2,498 | 2908% | 1 |

> **Not:** Ratio Spread'ler kredi verebilir (negatif maliyet) ama üstte sınırsız risk taşır. Yalnızca deneyimli traderlar için!

---

## <a name="risk"></a>RISK YÖNETİMİ VE UYARILAR

### ⚠️ Kritik Riskler

| Risk | Açıklama | Önlem |
|------|----------|-------|
| **IV Crush** | Earnings sonrası IV %50-80 düşer | Pozisyonu earnings öncesi kapat veya butterfly kullan |
| **Yanlış Yön** | Hisse beklenen yöne gitmez | Spread kullan, tekli OTM'den kaçın |
| **FOMC (28-29 Tem)** | Piyasa oynaklığı artar | Bu tarihte pozisyon küçült veya kapat |
| **Likidite Riski** | Far OTM opsiyonlar işlem hacmi düşük | Sadece popüler hisselerde (AAPL, TSLA, AMD) kal |
| **Tüm Sermaye Riski** | Lottery ticket %90+ zarar edebilir | Sadece hesabın %1-2'si ile gir |

### 📋 EarningsPlay v4 Pozisyon Büyüklüğü Kuralları

```
Hesap Büyüklüğü   | Max Pozisyon/Hisse | Max Toplam Risk
----------------- | ------------------ | ---------------
$500              | $5-$10             | $50
$1,000            | $10-$20            | $100
$2,500            | $25-$50            | $250
$5,000            | $50-$100           | $500
$10,000           | $100-$200          | $1,000
$25,000           | $250-$500          | $2,500
```

### 🗓️ Temmuz 2026 Takvimi

| Hafta | Tarih | Önemli Olay | Strateji |
|-------|-------|-------------|----------|
| 1-2 | 1-10 Tem | Earnings başlangıcı | Pozisyon açma dönemi |
| 2-3 | 13-17 Tem | Yoğun earnings | Pozisyon yönetimi |
| 3-4 | 20-24 Tem | FOMC öncesi | Pozisyon küçült |
| 4 | 28-29 Tem | **FOMC** | Minimum pozisyon |
| 4-5 | 27-31 Tem | Earnings sonu | Kar realizasyonu |

### 💡 Strateji Seçim Rehberi

| Bütçe | Deneyim | Öneri |
|-------|---------|-------|
| $10-$50 | Yeni başlayan | Far OTM Lottery Ticket (tek hisse) |
| $50-$200 | Orta seviye | Debit Spread (risk sınırlı) |
| $200-$500 | İleri seviye | Butterfly (IV crush'a dayanıklı) |
| $500+ | Profesyonel | Ratio Spread (kredi stratejileri) |

### IV Crush'dan Korunma

Earnings sonrası IV genellikle %40-70 düşer. Bu durumdan korunma yöntemleri:

1. **Butterfly Stratejisi:** Merkezden kar elde eder, IV crush'a daha dayanıklı
2. **Pozisyonu Önce Kapat:** Earnings günü öncesi primi realize et
3. **Calendar Spread:** Farklı vadelerde IV farkından faydalan
4. **Ratio Spread:** Satılan opsiyonlar alınanların maliyetini düşürür

---

## SONUÇ VE ÖNERİLER

### 🏆 En İyi 5 Fırsat (Tekrar)

| # | Hisse | Strateji | Maliyet | Potansiyel | Neden? |
|---|-------|----------|---------|------------|--------|
| 1 | **AMD** | $42 Call Lottery | $42 | 10x-50x | En yüksek IV Rank (91.69%) |
| 2 | **TSLA** | $35 Call Lottery | $35 | 10x-30x | En hareketli hisse |
| 3 | **NFLX** | $39 Call Lottery | $39 | 5x-20x | En uygun fiyatlı + yüksek IV |
| 4 | **NVDA** | $19 Call Lottery | $19 | 5x-30x | En ucuz giriş maliyeti |
| 5 | **META** | $18 Call Lottery | $18 | 5x-30x | En ucuz prim |

### 📊 Portföy Önerisi ($500 Bütçe ile)

| Allocation | Hisse | Strateji | Maliyet |
|------------|-------|----------|---------|
| $42 (8%) | AMD | Call Lottery Ticket | $42 |
| $35 (7%) | TSLA | Call Lottery Ticket | $35 |
| $39 (8%) | NFLX | Call Lottery Ticket | $39 |
| $19 (4%) | NVDA | Call Lottery Ticket | $19 |
| $18 (4%) | META | Call Lottery Ticket | $18 |
| $86 (17%) | NFLX | Debit Call Spread | $86 |
| $191 (38%) | AMD | Debit Call Spread | $191 |
| $50 (10%) | JPM | Call Lottery + Spread | $50 |
| **$500** | | | |

Bu portföy ile:
- **5 lottery ticket** = Yüksek volatilite oynunması
- **2 debit spread** = Risk sınırlı temel pozisyon
- **Max risk:** $500 (tamamı kaybedilebilir)
- **Potansiyel:** Herhangi bir lottery ticket patlarsa 5x-50x getiri

---

> **⚠️ Yasal Uyarı:** Bu rapor eğitim ve araştırma amaçlıdır. Yatırım tavsiyesi değildir. Opsiyon ticareti yüksek risk içerir. Sadece kaybetmeyi göze alabileceğiniz kadar yatırım yapın. Geçmiş performans gelecek performansın göstergesi değildir.

---

*Rapor: EarningsPlay v4 | Bütçe Dostu Stratejiler | Temmuz 2026*
