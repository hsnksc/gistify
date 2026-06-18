# Bölüm 3: Finansal, Sağlık, Enerji ve Diğer Stratejiler

> **Temmuz 2026 Earnings Sezonu — Sektörel Derinlemesine Opsiyon Stratejisi Rehberi**
> Bu bölüm, 23 hisse senedi için earnings öncesi, sırası ve sonrası opsiyon stratejilerini içerir. Her hisse en az 3 strateji, bütçe dostu alternatifler ve giriş-çıkış takvimi ile detaylandırılmıştır.

---

## 6. FİNANSAL HİSSELER STRATEJİLERİ

> **Finansal Sektör Makro Analizi:**
> Temmuz 2026 earnings sezonunda 7 büyük finansal kurum raporlayacak. Büyük bankalar (JPM, BAC, GS, WFC, C, MS) 14-15 Temmuz tarihlerinde açıklama yapacak — bu tarihler FOMC (29 Temmuz) kararından önemli ölçüde uzak, "temiz bir giriş penceresi" sunuyor. Finansal sektörün IV crush potansiyeli %20-30 arasında (düşük-orta), bu da short premium stratejilerinin sınırlı kazanç potansiyeline işaret ediyor. Faiz artış beklentisi net interest margin (NIM) için pozitif katalist. CPR değerleri karışık — BAC (1.92) ve GS (1.34) güçlü boğa eğilimli, JPM (0.77) ve C (0.85) ayı eğilimli. BLK (0.85) hafif ayı, WFC (0.90) ve MS (1.00) nötr konumda. Finansal sektör hisseleri genellikle düşük beta (0.8-1.2) ile piyasaya paralel hareket eder. Yüksek IV Rank (>50%) olan JPM (%81), GS (%52) ve C (%55) Iron Condor adaylarıdır. Düşük IV Rank (<40%) olan WFC (%38) ve BLK (%35) long spread stratejilerine daha uygundur.
>
> **Sektör Riskleri:** (1) FOMC öncesi faiz beklentilerinde ani değişim, (2) Ticari gayrimenkul kredilerinde bozulma, (3) Yatırım bankacılığı gelirlerinde düşüş, (4) Tüketici kredi kalitesinde zayıflama.
>
> **IV Crush Profili:** Düşük-orta (%20-30). Büyük bankaların earnings hareketleri genellikle sınırlı (%2-5). Short straddle/strangle kazanma olasılığı yüksek ama prim toplama potansiyeli düşük.

### Finansal Sektör Özet Tablosu

| Hisse | Fiyat | IV30 | IV Rank | Hacim CPR | OI CPR | Teknik | YTD% | Earnings |
|-------|-------|------|---------|-----------|--------|--------|------|----------|
| **JPM** | $311.11 | 29.4% | 81% | 0.77 | 0.77 | 50MA üzerinde | +2.52% | 14 Temmuz BMO |
| **BAC** | $53.63 | ~28% | 45% | 1.92 | 0.77 | Güçlü Al sinyali | +1.43% | 14 Temmuz BMO |
| **GS** | $1,045.00 | ~25% | 52% | 1.34 | 1.25 | Güçlü yükseliş | +20.04% | 14 Temmuz BMO |
| **WFC** | $80.96 | ~26% | 38% | 0.90 | 1.00 | Nötr | +12.21% | 14 Temmuz BMO |
| **C** | $133.28 | ~27% | 55% | 0.85 | 0.92 | Güçlü trend | +15.36% | 14 Temmuz BMO |
| **MS** | ~$100 | ~28% | 48% | 1.00 | 1.00 | Nötr | N/A | 15 Temmuz BMO |
| **BLK** | ~$950 | ~22% | 35% | 0.85 | 0.88 | Nötr | N/A | 21 Temmuz BMO |

---

### 6.1 JPM — $311.11 — CPR: 0.77

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 58.07 (Dengeli momentum, aşırı alım sınırına uzak) |
| **50MA** | $304.44 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | $304.12 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | 29.4% |
| **IV Rank** | 81% (Çok Yüksek — Iron Condor için ideal!) |
| **Hacim CPR** | 0.77 (Ayı-eğilimli — put hacmi call hacminden yüksek) |
| **OI CPR** | 0.77 (Ayı-eğilimli — açık put pozisyonları call'lardan fazla) |
| **YTD** | +2.52% (Sektör ortalamasına paralel) |
| **Earnings** | 14 Temmuz BMO (Before Market Open) |
| **Beta** | ~1.1 |
| **Son 8Q Ort. Earnings Hareketi** | ±3.2% |
| **Implied Move (EM)** | ~±4.5% (~$14) |

#### Strateji 1: Bear Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $325 (OTM, ~%4.5 üzerinde) |
| **Buy Call** | $340 (daha OTM, wing $15) |
| **Kredi/Maliyet** | ~$4.50 |
| **Max Risk** | $10.50 (Wing $15 - Kredi $4.50) |
| **Max Kar** | $4.50 (toplanan kredi) |
| **ROI** | ~43% |
| **Breakeven** | $329.50 |
| **Delta Hedefi** | -0.08 ile -0.12 arası |
| **Vega** | Negatif (IV crush'tan kazanç) |
| **Theta** | Pozitif (~$0.15/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$2.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $9 zararda kapat |

> **Strateji Gerekçesi:** JPM IV Rank %81 ile çok yüksek — opsiyon primleri pahalı. Ancak CPR 0.77 ile ayı bias güçlü. Bear Call Spread, call tarafında aşırı şişmiş prim toplar. Fiyat 50MA ve 200MA üzerinde olsa da, hacim ve OI CPR'ları ayı yönlü — piyasa kısa vadeli geri çekilme bekliyor. Earnings öncesi call alımı (speculative) primleri şişirmiş. Bear Call Spread ile bu spekülatif primi topla. FOMC'den (29 Temmuz) uzak — 14 Temmuz earnings'inde makro veri çakışması riski düşük.

#### Strateji 2: Asimetrik Iron Condor (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Call Wing** | Sell $325C / Buy $340C (Wing $15) |
| **Put Wing** | Sell $290P / Buy $275P (Wing $15) |
| **Kredi** | ~$6.50 |
| **Max Risk** | $8.50 (Wing $15 - Kredi $6.50) |
| **Max Kar** | $6.50 |
| **ROI** | ~76% |
| **Breakeven'lar** | $331.50 (üst) / $283.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (IV crush'tan kazanç) |
| **Theta** | Pozitif (~$0.22/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$3.25 kar |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$31 (kullanılan $15 = dar wing, agresif) |

> **Asimetrik Yapı:** Call wing ($325/$340) put wing'e ($290/$275) göre daha dar. Neden? CPR 0.77 ayı bias — yukarı yönlü hareket sınırlı, aşağı yönlü hareket daha olası. Call wing dar = daha fazla prim toplama, put wing geniş = aşağı riskini koruma. IV Rank %81 > %50 — Iron Condor için ideal ortam. 30-45 DTE entry önerilir. 21 DTE'de mekanik çıkış veya %50 kar (hangisi önce gelirse).

#### Strateji 3: Long Put Spread (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Short Delta) |
| **Buy Put** | $300 (ITM/hafif ITM) |
| **Sell Put** | $285 (OTM, wing $15) |
| **Maliyet** | ~$5.50 |
| **Max Risk** | $5.50 (ödenen prim) |
| **Max Kar** | $9.50 (Wing $15 - Maliyet $5.50) |
| **ROI** | ~173% |
| **Breakeven** | $294.50 |
| **Delta** | -0.35 ile -0.45 (ayı yönlü) |
| **Vega** | Pozitif (IV artışından kazanç, IV crush'tan zarar) |
| **Theta** | Negatif (~-$0.12/gün) |
| **Kar Hedefi** | %100 kar = hisse $285 altında; %50 kar = hisse $292.50 altında |
| **Hedge Kullanımı** | JPM long pozisyonu olanlar için koruma |

> **Koruma Senaryosu:** JPM portföyünde olan yatırımcılar için Long Put Spread, earnings öncesi aşağı yönlü riski sınırlar. Maliyet $5.50 ile %1.8'lik bir "sigorta primi" ödenir. Eğer JPM earnings'te beklenenden kötü sonuçlar açıklarsa (NIM daralması, kredi kayıpları artışı), put spread kar sağlar ve long hisse zararını telafi eder. Not: IV crush bu stratejiye zarar verir — pozisyonu earnings'ten önce 2-3 gün aç, earnings sonrası IV düşüşü öncesi kapat.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Put Butterfly ($290P/$300P/$310P) | ~$45 | ~$955 | 1:21 |
| $50-$200 | Debit Put Spread ($300P/$295P) 1 kontrat | ~$185 | ~$315 | 1:1.7 |
| $50-$200 | OTM Call @$340 (Lottery/Long Shot) | ~$95 | Sınırsız | Spekülatif |
| $200-$500 | Long Put Butterfly ($295P/$300P/$305P) 2 kontrat | ~$380 | ~$2,120 | 1:5.6 |
| $200-$500 | Bear Call Spread ($325C/$340C) 1 kontrat | ~$450 | ~$450 | 1:1 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, strike seçimi, margin kontrolü |
| **11-12 Temmuz** | Entry | Pozisyon aç (30-45 DTE tercih edilir) |
| **14 Temmuz** | Earnings Günü | BMO açıklama — pozisyonu TUT, panik satışı YAPMA |
| **15 Temmuz** | Yönetim | IV crush etkisini değerlendir, %50 kar varsa kapat |
| **17-18 Temmuz** | Çıkış | 21 DTE yaklaşıyorsa veya %50 kar hedefi gerçekleştiyse kapat |
| **29 Temmuz** | FOMC Uyarısı | JPM pozisyonu kapanmış olmalı — FOMC çakışması riski yok |

> **⚠️ Risk Uyarıları:**
> 1. IV Rank %81 çok yüksek — prim toplama cazip ama hisse ani hareket ederse zarar büyür.
> 2. Bear Call Spread'te yukarı yönlü gap riski var — hisse $340 üzerine çıkarsa max loss.
> 3. FOMC 29 Temmuz — JPM earnings 14 Temmuz'da, çakışma yok ama genel piyasa volatilitesi etkiler.
> 4. JPM "too big to fail" hissesi — olağanüstü hareketler nadirdir ama earnings sürprizleri olabilir.
> 5. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma (VIX <30 varsayımıyla).

---

### 6.2 BAC — $53.63 — CPR: 1.92

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 55.23 (Nötr-boğa bölgesi, momentum dengeli) |
| **50MA** | $51.82 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | $52.00 (fiyat yakınında, uzun vadeli trend nötr-boğa) |
| **IV30** | ~28% |
| **IV Rank** | ~45% (Orta — IC sınırda, spread stratejileri uygun) |
| **Hacim CPR** | 1.92 (Güçlü boğa! Call hacmi put hacminden %92 daha yüksek) |
| **OI CPR** | 0.77 (Açık pozisyonlarda ayı — spekülatörler put taşıyor) |
| **YTD** | +1.43% (Sektör ortalamasının altında, geri kalmış) |
| **Earnings** | 14 Temmuz BMO |
| **Beta** | ~1.2 |
| **Son 8Q Ort. Earnings Hareketi** | ±3.8% |
| **Implied Move (EM)** | ~±4.2% (~$2.25) |
| **Dividend Yield** | ~2.5% |

#### Strateji 1: Bull Put Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta hafif) |
| **Sell Put** | $50 (OTM, ~%6.8 altında) |
| **Buy Put** | $47 (daha OTM, wing $3) |
| **Kredi/Maliyet** | ~$0.85 |
| **Max Risk** | $2.15 (Wing $3 - Kredi $0.85) |
| **Max Kar** | $0.85 (toplanan kredi) |
| **ROI** | ~40% |
| **Breakeven** | $49.15 |
| **Delta Hedefi** | +0.15 ile +0.25 arası (hafif boğa) |
| **Vega** | Negatif (IV crush'tan kazanç) |
| **Theta** | Pozitif (~$0.03/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.43 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $1.70 zararda kapat |
| **PoP (Probability of Profit)** | ~62% |

> **Strateji Gerekçesi:** BAC hacim CPR 1.92 ile tüm finansal sektörün en güçlü boğa sinyalini veriyor. Call hacmi put hacminden neredeyse iki kat fazla — piyasa güçlü bullish beklenti içinde. Ancak OI CPR 0.77 ile açık pozisyonlarda ayı eğilim var — bu çelişki fırsat sunar: spekülatörler put taşıyor (korumacı veya ayı), ancak hacim call yönlü. Bull Put Spread, hissenin $50 üzerinde kalmasına bahis oynar. Düşük fiyat ($53.63) = küçük sermaye ile çoklu kontrat (10 kontrat = ~$850 kredi, ~$2,150 risk). BAC YTD +1.43 ile sektörde geri kalmış — "catch-up trade" potansiyeli var. NIM genişlemesi ve tüketici bankacılığı güçlülüğü earnings sürprizi sunabilir.

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $52 (hafif ITM/ATM) |
| **Sell Call** | $56 (OTM, wing $4) |
| **Maliyet** | ~$1.65 |
| **Max Risk** | $1.65 (ödenen prim) |
| **Max Kar** | $2.35 (Wing $4 - Maliyet $1.65) |
| **ROI** | ~142% |
| **Breakeven** | $53.65 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (IV artışından kazanç, IV crush'tan zarar) |
| **Theta** | Negatif (~-$0.04/gün) |
| **Kar Hedefi** | %50 kar = hisse $54.83; %100 kar = hisse $56 üzeri |
| **Hedge Kullanımı** | BAC long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer BAC earnings'te güçlü bir "beat" açıklarsa, call spread kaldıraçlı kar sağlar. Hacim CPR 1.92 güçlü boğa momentumunu destekler. Ancak IV crush riski var — pozisyonu earnings'ten 1-2 gün önce aç, earnings sonrası hemen değerlendir. Eğer hisse pre-earnings run-up yaparsa, call spread erken kar alabilir. Not: IV Rank %45 sınırda — long spread için IV çok yüksek değil, makul.

#### Strateji 3: Mini Iron Condor (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $58C / Buy $61C (Wing $3) |
| **Put Wing** | Sell $48P / Buy $45P (Wing $3) |
| **Kredi** | ~$1.20 |
| **Max Risk** | $1.80 (Wing $3 - Kredi $1.20) |
| **Max Kar** | $1.20 |
| **ROI** | ~67% |
| **Breakeven'lar** | $59.20 (üst) / $46.80 (alt) |
| **Delta Hedefi** | -0.03 ile +0.03 arası (nötr) |
| **Vega** | Negatif (IV crush'tan kazanç) |
| **Theta** | Pozitif (~$0.04/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.60 kar |
| **Wing Genişliği** | $3 (dar wing — BAC fiyatına uygun) |

> **Mini IC Gerekçesi:** BAC düşük fiyatlı hisse — wing $3 ile bile makul risk. Mini Iron Condor, hissenin $48-$58 bandında kalmasına bahis oynar. Bu band earnings implied move'ın (~$2.25) oldukça dışında — güvenli bölge. IV crush potansiyeli %20-30 — short premium kazançlı. 10 kontrat = $1,200 kredi, $1,800 risk. FOMC'den uzak — temiz dönem. Not: Dar wing = yüksek risk/ödül, hisse sınırların dışına çıkarsa zarar hızlı büyür.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$58 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$45 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $50-$200 | Bull Put Spread ($50P/$47P) 2 kontrat | ~$170 | ~$430 | 1:2.5 |
| $50-$200 | Long Call Spread ($52C/$56C) 1 kontrat | ~$165 | ~$235 | 1:1.4 |
| $200-$500 | Mini Iron Condor ($48P/$45P + $58C/$61C) 4 kontrat | ~$480 | ~$720 | 1:1.5 |
| $200-$500 | Long Call Butterfly ($53C/$55C/$57C) 3 kontrat | ~$285 | ~$915 | 1:3.2 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, hacim CPR teyidi, OI CPR kontrolü |
| **11-12 Temmuz** | Entry | Pozisyon aç (30-45 DTE) |
| **14 Temmuz** | Earnings Günü | BMO açıklama — pozisyonu TUT |
| **15 Temmuz** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **17-18 Temmuz** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |
| **29 Temmuz** | FOMC | BAC pozisyonu kapanmış olmalı |

> **⚠️ Risk Uyarıları:**
> 1. Hacim CPR 1.92 güçlü boğa ama OI CPR 0.77 ayı — çelişkili sinyal. OI CPR, "smart money"ın put taşıdığını gösteriyor olabilir.
> 2. BAC YTD +1.43 ile sektörde geri kalmış — bu "catch-up" veya "lagging weakness" olabilir.
> 3. Dar wing ($3) stratejilerde hisse %5+ hareket ederse max loss hızlı gelir.
> 4. Ticari gayrimenkul kredilerinde bozulma BAC'i daha fazla etkileyebilir (JPM'e göre daha fazla maruziyet).
> 5. 10+ kontrat ile pozisyon büyütme — hesabın %2'sinden fazla risk atma.

---

### 6.3 GS — $1,045.00 — CPR: 1.34

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 62.30 (Boğa bölgesi, aşırı alım sınırına yaklaşıyor) |
| **50MA** | $1,012.50 (fiyat üzerinde, güçlü kısa vadeli trend) |
| **200MA** | $952.00 (fiyat üzerinde, güçlü uzun vadeli trend) |
| **IV30** | ~25% |
| **IV Rank** | ~52% (IC Uygun! >%50 eşiği aşıldı) |
| **Hacim CPR** | 1.34 (Boğa — call hacmi put hacminden %34 yüksek) |
| **OI CPR** | 1.25 (Boğa — açık call pozisyonları put'lardan fazla) |
| **YTD** | +20.04% (Sektör lideri! Finansalın en güçlüsü) |
| **Earnings** | 14 Temmuz BMO |
| **Beta** | ~1.3 |
| **Son 8Q Ort. Earnings Hareketi** | ±4.5% |
| **Implied Move (EM)** | ~±5.0% (~$52) |
| **Sektör** | Yatırım Bankacılığı & Menkul Kıymetler |

#### Strateji 1: Iron Condor (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $1,100C / Buy $1,160C (Wing $60) |
| **Put Wing** | Sell $990P / Buy $930P (Wing $60) |
| **Kredi/Maliyet** | ~$22.00 |
| **Max Risk** | $38.00 (Wing $60 - Kredi $22) |
| **Max Kar** | $22.00 (toplanan kredi) |
| **ROI** | ~58% |
| **Breakeven'lar** | $1,122 (üst) / $968 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.45) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.75/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol altında) |
| **Kar Hedefi** | %50 mekanik exit = ~$11 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $44 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$104 (kullanılan $60 = dar wing, agresif) |
| **PoP** | ~58% |

> **Strateji Gerekçesi:** GS, finansal sektörün en güçlü performansı (+20.04% YTD). Hem hacim CPR (1.34) hem OI CPR (1.25) 1.0 üzerinde — güçlü boğa momentumu. IV Rank %52 > %50 — Iron Condor için ideal aday. Wing $60 = fiyatın ~%5.7'si, EM (~%5.0) dışında güvenli bölge. Yüksek fiyat ($1,045) = yüksek prim toplama potansiyeli ($22 kredi). Yatırım bankacılığı gelirleri (M&A, underwriting, trading) earnings'te sürpriz yapabilir. FOMC'den uzak — temiz dönem. Iron Condor, GS'nin earnings öncesi volatilite şişkinliğinden (IV Rank %52) faydalanır ve crush sonrası prim çöküşünden kazanır.

#### Strateji 2: Bull Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $1,040 (ATM/hafif ITM) |
| **Sell Call** | $1,100 (OTM, wing $60) |
| **Maliyet** | ~$28.00 |
| **Max Risk** | $28.00 (ödenen prim) |
| **Max Kar** | $32.00 (Wing $60 - Maliyet $28) |
| **ROI** | ~114% |
| **Breakeven** | $1,068 |
| **Delta** | +0.50 ile +0.60 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.35) |
| **Theta** | Negatif (~-$0.45/gün) |
| **Kar Hedefi** | %50 kar = hisse $1,084; %100 kar = hisse $1,100 üzeri |
| **Hedge Kullanımı** | GS long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer GS earnings'te güçlü sonuçlar açıklarsa (trading revenue beat, M&A pipeline güçlülüğü), bull call spread kaldıraçlı kar sağlar. YTD +20.04 momentumu devam edebilir. Ancak IV crush riski yüksek — pozisyonu earnings'ten 1-2 gün önce aç, earnings sonrası hemen değerlendir. Eğer hisse pre-earnings run-up yaparsa ($1,080+), erken kar al. Not: Maliyet $28 yüksek — 1 kontrat = $2,800 risk. Hesabın %1-2'sinden fazla risk atma.

#### Strateji 3: Asimetrik Condor (Bullish Tilt — Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Call Wing Geniş** | Sell $1,100C / Buy $1,180C (Wing $80) |
| **Put Wing Dar** | Sell $1,020P / Buy $960P (Wing $60) |
| **Kredi** | ~$18.00 |
| **Max Risk** | $42.00 (en geniş wing $80 - Kredi $18, asimetrik) |
| **Max Kar** | $18.00 |
| **ROI** | ~43% |
| **Breakeven'lar** | $1,118 (üst) / $1,002 (alt) |
| **Delta Hedefi** | +0.05 ile +0.10 (hafif boğa) |
| **Vega** | Negatif (~-$0.38) |
| **Theta** | Pozitif (~$0.60/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$9 kar |

> **Asimetrik Gerekçesi:** Call wing geniş ($80) = yukarı yönlü harekete daha fazla tolerans. Put wing dar ($60) = aşağı yönlü harekette daha az risk. Bu yapı, GS'nin güçlü boğa momentumunu (YTD +20.04, CPR 1.34) dikkate alır. Eğer GS earnings'te yukarı gap yaparsa, call wing genişliği zararı önler. Aşağı yönlü harekette put wing dar olduğu için risk sınırlı. Kredi $18 ile prim toplama potansiyeli yüksek. Not: Asimetrik yapı standard IC'ye göre daha karmaşık — yeni başlayanlar için önerilmez.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | ⛔ Uygun strateji bulunamadı (fiyat çok yüksek, 1 kontrat bile pahalı) |
| $50-$200 | ⛔ Uygun strateji bulunamadı (minimum spread maliyeti >$200) |
| $200-$500 | Long Put Butterfly ($1,000P/$1,040P/$1,080P) | ~$380 | ~$3,620 | 1:9.5 |
| $200-$500 | OTM Call @$1,160 (Lottery) | ~$420 | Sınırsız | Spekülatif |

> **Bütçe Uyarısı:** GS fiyatı $1,045 ile çok yüksek. 1 kontrat = 100 hisse = $104,500 nominal değer. Spread stratejileri bile $200+ maliyet. Bütçe dostu strateji bulunamıyor. Alternatif: Micro-options (10 hisse = 1 kontrat) varsa değerlendir. Yoksa GS'yi bütçe stratejilerinden çıkar.

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%52), strike seçimi |
| **11-12 Temmuz** | Entry | Iron Condor aç (35-45 DTE önerilir) |
| **14 Temmuz** | Earnings Günü | BMO açıklama — pozisyonu TUT, panik YOK |
| **15 Temmuz** | Yönetim | IV crush etkisini ölç, %50 kar varsa kapat |
| **18-21 Temmuz** | Çıkış | 21 DTE yaklaşıyorsa mekanik çıkış |
| **29 Temmuz** | FOMC | GS pozisyonu kapanmış olmalı |

> **⚠️ Risk Uyarıları:**
> 1. GS fiyatı $1,045 çok yüksek — 1 kontrat Iron Condor margin gereksinimi ~$3,800. Küçük hesaplar için uygun değil.
> 2. RSI 62.30 aşırı alım sınırına (70) yaklaşıyor — kısa vadeli geri çekilme riski.
> 3. YTD +20.04 ile sektör lideri — "mean reversion" riski (kâr realizasyonu).
> 4. Yatırım bankacılığı gelirleri volatil — bir çeyrekte düşüş sürpriz yapabilir.
> 5. Dar wing ($60) stratejilerde hisse %6+ hareket ederse max loss.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

### 6.4 WFC — $80.96 — CPR: 0.90

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 48.75 (Nötr, momentum yok) |
| **50MA** | $82.15 (fiyat altında, kısa vadeli trend hafif ayı) |
| **200MA** | $78.50 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~26% |
| **IV Rank** | ~38% (Düşük — IC uygun değil, long spread tercih) |
| **Hacim CPR** | 0.90 (Nötr — hacim dengeli) |
| **OI CPR** | 1.00 (Tam nötr — açık pozisyonlar dengeli) |
| **YTD** | +12.21% (Sektör ortalamasının üzerinde) |
| **Earnings** | 14 Temmuz BMO |
| **Beta** | ~1.1 |
| **Son 8Q Ort. Earnings Hareketi** | ±3.5% |
| **Implied Move (EM)** | ~±3.8% (~$3.08) |
| **Sektör** | Tüketici Bankacılığı & Mortgage |

#### Strateji 1: Long Iron Condor (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Nötr Delta) |
| **Call Wing** | Buy $88C / Sell $94C (Wing $6) |
| **Put Wing** | Buy $74P / Sell $68P (Wing $6) |
| **Maliyet** | ~$2.00 |
| **Max Risk** | $2.00 (ödenen prim) |
| **Max Kar** | $4.00 (Wing $6 - Maliyet $2, toplam $12 wing - $2 maliyet = $10? Düzeltme: Her wing $6, toplam $12 potansiyel - $2 maliyet = $10 max kar) |
| **ROI** | ~500% (teorik) |
| **Breakeven'lar** | $90 (üst) / $72 (alt) |
| **Delta Hedefi** | -0.02 ile +0.02 arası (nötr) |
| **Vega** | Pozitif (IV artışından kazanç) |
| **Theta** | Negatif (~-$0.05/gün) |
| **Kar Hedefi** | %100 kar = hisse $88-$94 aralığında kapanırsa |
| **Hedge Kullanımı** | Bilinmeyen yönlü earnings hareketi için |

> **Strateji Gerekçesi:** WFC CPR değerleri ~1.0 etrafında tam nötr. IV Rank %38 düşük — prim toplama (short premium) sınırlı. Long Iron Condor, hissenin earnings öncesi IV artışından (pre-earnings vol expansion) kazanır. WFC 50MA altında ($82.15) ama 200MA üzerinde ($78.50) — kararsız bölgede. Earnings hareketi yönü belirsiz. Long IC, her iki yönlü hareketten kazanç sağlar (hisse $88 üzerine veya $74 altına çıkarsa). Ancak IV crush bu stratejiye zarar verir — pozisyonu earnings'ten 3-4 gün önce aç, earnings sonrası hemen kapat. Not: Long IC nadir stratejidir, likidite riski olabilir.

#### Strateji 2: Nötr Calendar Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Calendar / Time Spread (Karmaşık Greeks) |
| **Sell** | 1 haftalık $82 Call (front month, kısa vade) |
| **Buy** | 3 haftalık $82 Call (back month, uzun vade) |
| **Maliyet** | ~$1.50 |
| **Max Risk** | $1.50 (ödenen prim) |
| **Max Kar** | ~$3.00 (theta decay farkından) |
| **ROI** | ~200% |
| **Breakeven** | $80.50 / $83.50 (yaklaşık) |
| **Delta** | +0.10 ile +0.20 (hafif boğa) |
| **Vega** | Pozitif (back month daha fazla Vega taşır) |
| **Theta** | Pozitif (front month theta decay > back month) |
| **Kar Hedefi** | %50 kar = ~$0.75; hisse $82 yakınında kalırsa max kar |

> **Alternatif Gerekçesi:** Calendar spread, front month (kısa vade) opsiyonun hızlı theta decay'sinden kazanç sağlar. WFC düşük IV (%38) ortamında, back month (uzun vade) opsiyon ucuzdur. Earnings öncesi front month IV şişer, earnings sonrası çöker — front month satıcısı bu çöküşten kazanır. Back month IV etkilenmez (3 haftalık). Risk: Hisse $82'den çok uzaklaşırsa (>$86 veya <$78), calendar spread zarar eder. WFC nötr CPR ve düşük IV ile calendar spread için uygun aday.

#### Strateji 3: Cash-Secured Put (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Hafif Long Delta) |
| **Sell Put** | $78 (OTM, ~%3.6 altında) |
| **Kredi** | ~$0.85 |
| **Max Risk** | $7,715 (100 hisse × $78 - kredi $85) |
| **Max Kar** | $85 (toplanan kredi) |
| **ROI** | ~1.1% (kısa vadeli) |
| **Breakeven** | $77.15 |
| **Atama Riski** | Hisse $78 altında kapanırsa 100 hisse alım zorunluluğu |
| **Delta** | +0.20 ile +0.25 |
| **Vega** | Negatif (IV crush'tan kazanç) |
| **Theta** | Pozitif (~$0.04/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.43; veya atama bekleyerek hisse biriktirme |

> **Koruma/Hedge Gerekçesi:** WFC $80.96, 200MA $78.50 üzerinde — uzun vadeli trend pozitif. Cash-secured put, hisseyi "indirimli" alma stratejisidir. Eğer WFC earnings'te düşerse ve $78 altında kapanırsa, 100 hisse $78'den alınır (gerçek maliyet $77.15). Eğer hisse $78 üzerinde kalırsa, $85 kredi kazanılır. WFC YTD +12.21 ile güçlü performans gösteriyor — uzun vadeli birikim için uygun. Not: $7,715 margin gereksinimi — hesapta yeterli nakit olmalı.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$88 (Lottery) | ~$25 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$72 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($82C/$88C) 2 kontrat | ~$140 | ~$340 | 1:2.4 |
| $50-$200 | Long Put Spread ($78P/$72P) 2 kontrat | ~$120 | ~$360 | 1:3.0 |
| $200-$500 | Long Call Butterfly ($80C/$84C/$88C) 3 kontrat | ~$285 | ~$915 | 1:3.2 |
| $200-$500 | Calendar Spread ($82C, 1W/3W) 2 kontrat | ~$300 | ~$600 | 1:2.0 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%38 — düşük), strateji seçimi |
| **10-11 Temmuz** | Entry (Long IC/Calendar) | Long stratejiler için erken entry (IV artışı bekleniyor) |
| **12 Temmuz** | Entry (Short stratejiler) | Cash-secured put veya short spread aç |
| **14 Temmuz** | Earnings Günü | BMO açıklama — pozisyonu TUT |
| **15 Temmuz** | Yönetim | Long stratejiler için IV crush değerlendirmesi (zarar!) |
| **16-17 Temmuz** | Çıkış (Long) | Long IC ve calendar spread kapat (IV crush sonrası) |
| **18-21 Temmuz** | Çıkış (Short) | Short stratejiler için %50 kar veya 21 DTE kuralı |
| **29 Temmuz** | FOMC | Tüm WFC pozisyonları kapanmış olmalı |

> **⚠️ Risk Uyarıları:**
> 1. WFC IV Rank %38 düşük — short premium stratejileri (IC, short straddle) sınırlı kazanç sunar.
> 2. 50MA altında ($82.15) — kısa vadeli momentum negatif. Earnings öncesi aşağı baskı olabilir.
> 3. Mortgage piyasasındaki faiz oranı hassasiyeti WFC'i etkiler (en büyük mortgage lender).
> 4. Long Iron Condor nadir stratejidir — likidite riski, bid-ask spread yüksek olabilir.
> 5. Calendar spread riski: Hisse $82'den çok uzaklaşırsa zarar.
> 6. Cash-secured put: $7,715 margin — hesapta yeterli nakit olmalı.

---

### 6.5 C — $133.28 — CPR: 0.85

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 64.10 (Boğa bölgesi, aşırı alım sınırına yaklaşıyor) |
| **50MA** | $125.80 (fiyat üzerinde, güçlü kısa vadeli trend) |
| **200MA** | $112.40 (fiyat üzerinde, güçlü uzun vadeli trend) |
| **IV30** | ~27% |
| **IV Rank** | ~55% (Yüksek — IC uygun!) |
| **Hacim CPR** | 0.85 (Hafif ayı — put hacmi call hacminden hafif yüksek) |
| **OI CPR** | 0.92 (Hafif ayı — açık put pozisyonları call'lardan hafif fazla) |
| **YTD** | +15.36% (Sektör ikincisi, GS'den sonra) |
| **Earnings** | 14 Temmuz BMO |
| **Beta** | ~1.3 |
| **Son 8Q Ort. Earnings Hareketi** | ±4.0% |
| **Implied Move (EM)** | ~±4.5% (~$6.00) |
| **52-Hafta Zirve** | $135.83 (fiyat çok yakın!) |

#### Strateji 1: Bear Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $140 (OTM, ~%5.0 üzerinde) |
| **Buy Call** | $148 (daha OTM, wing $8) |
| **Kredi/Maliyet** | ~$2.20 |
| **Max Risk** | $5.80 (Wing $8 - Kredi $2.20) |
| **Max Kar** | $2.20 (toplanan kredi) |
| **ROI** | ~38% |
| **Breakeven** | $142.20 |
| **Delta Hedefi** | -0.12 ile -0.18 arası (ayı yönlü) |
| **Vega** | Negatif (~-$0.15) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.05/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.10 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $4.40 zararda kapat |
| **PoP** | ~58% |

> **Strateji Gerekçesi:** C 52-hafta zirvesine ($135.83) çok yakın — sadece %1.9 uzakta. Finansal sektör içinde YTD +15.36 ile ikinci en güçlü performans. RSI 64.10 aşırı alım sınırına yaklaşıyor. CPR 0.85/0.92 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. Bear Call Spread, hissenin $140 üzerine çıkmamasına bahis oynar. Eğer C zirve yakınında kâr realizasyonu yaşarsa, call spread kar sağlar. IV Rank %55 > %50 — prim toplama cazip. Wing $8 = fiyatın ~%6'sı, EM (~%4.5) dışında güvenli bölge. FOMC'den uzak — temiz dönem.

#### Strateji 2: Long Put Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Short Delta) |
| **Buy Put** | $130 (hafif ITM) |
| **Sell Put** | $122 (OTM, wing $8) |
| **Maliyet** | ~$2.80 |
| **Max Risk** | $2.80 (ödenen prim) |
| **Max Kar** | $5.20 (Wing $8 - Maliyet $2.80) |
| **ROI** | ~186% |
| **Breakeven** | $127.20 |
| **Delta** | -0.40 ile -0.50 (ayı yönlü) |
| **Vega** | Pozitif (~+$0.18) |
| **Theta** | Negatif (~-$0.06/gün) |
| **Kar Hedefi** | %50 kar = hisse $124.60; %100 kar = hisse $122 altında |
| **Hedge Kullanımı** | C long pozisyonu olanlar için koruma |

> **Alternatif Gerekçesi:** Eğer C 52-hafta zirvesinden geri çekilirse (kâr realizasyonu, zayıf earnings), put spread kaldıraçlı kar sağlar. RSI 64.10 ve zirve yakınlığı geri çekilme olasılığını artırır. Ancak IV crush riski var — pozisyonu earnings'ten 2-3 gün önce aç, earnings sonrası hemen değerlendir. Eğer hisse pre-earnings aşağı hareket ederse ($128 altı), erken kar al. Not: C'nin küresel varlıkları (emerging markets exposure) earnings sürprizi riski taşır.

#### Strateji 3: Protective Collar (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kombinasyon (Long Put + Short Call) |
| **Long Put** | $125 (OTM koruma) |
| **Short Call** | $145 (OTM, kredi toplama) |
| **Put Maliyeti** | ~$1.80 |
| **Call Kredisi** | ~$1.00 |
| **Net Maliyet** | ~$0.80 |
| **Max Risk** | $8.80 (fiyat $125'e düşerse: $133.28 - $125 = $8.28 + net maliyet $0.80) |
| **Max Kar** | Sınırlı (call $145'a kadar, sonra atama) |
| **Downside Protection** | $125 (yaklaşık %6.2 aşağı koruma) |
| **Upside Cap** | $145 (yaklaşık %8.8 yukarı sınır) |
| **Vega** | Karmaşık (put long vega + call short vega = net nötr-negatif) |
| **Theta** | Karmaşık (put short theta + call short theta = net negatif) |

> **Koruma Gerekçesi:** C long pozisyonu olan yatırımcılar için Protective Collar, aşağı yönlü riski sınırlar ($125 koruma) ve maliyeti short call kredisi ile düşürür. Net maliyet $0.80 çok düşük — "ucuz sigorta". Eğer C earnings'te patlarsa, upside $145 ile sınırlı (call atama). Eğer C düşerse, $125 put zararı sınırlar. Bu strateji, "zirve yakınında" hisseler için ideal koruma aracıdır. Not: Call atama riski — hisse $145 üzerine çıkarsa long hisse elden çıkar.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Put @$122 (Lottery) | ~$28 | Sınırsız | Spekülatif |
| $10-$50 | OTM Call @$145 (Lottery) | ~$22 | Sınırsız | Spekülatif |
| $50-$200 | Bear Call Spread ($140C/$148C) 2 kontrat | ~$440 | ~$1,160 | 1:2.6 |
| $50-$200 | Long Put Spread ($130P/$122P) 1 kontrat | ~$280 | ~$520 | 1:1.9 |
| $200-$500 | Long Put Butterfly ($126P/$130P/$134P) 2 kontrat | ~$380 | ~$1,220 | 1:3.2 |
| $200-$500 | Iron Condor ($122P/$114P + $140C/$148C) 1 kontrat | ~$420 | ~$780 | 1:1.9 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | 52-hafta zirve kontrolü ($135.83), RSI teyidi, CPR analizi |
| **11-12 Temmuz** | Entry | Bear Call Spread veya Put Spread aç (30-45 DTE) |
| **14 Temmuz** | Earnings Günü | BMO açıklama — pozisyonu TUT |
| **15 Temmuz** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **17-18 Temmuz** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |
| **29 Temmuz** | FOMC | C pozisyonu kapanmış olmalı |

> **⚠️ Risk Uyarıları:**
> 1. C 52-hafta zirvesine ($135.83) çok yakın — "breakout" veya "rejection" riski yüksek.
> 2. RSI 64.10 aşırı alım sınırına yakın — kısa vadeli geri çekilme olasılığı.
> 3. C küresel banka — emerging markets krizi, döviz kuru oynaklığı earnings'i etkiler.
> 4. Bear Call Spread'te yukarı yönlü gap riski — hisse $148 üzerine çıkarsa max loss.
> 5. Protective Collar'da call atama riski — hisse $145 üzerine çıkarsa long hisse satılır.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

### 6.6 MS — ~$100 — CPR: 1.00

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 55.00 (Nötr-boğa, momentum dengeli) |
| **50MA** | ~$98 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | ~$95 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~28% |
| **IV Rank** | ~48% (Sınırda — IC deneyimli traderlar için) |
| **Hacim CPR** | 1.00 (Tam nötr — hacim dengeli) |
| **OI CPR** | 1.00 (Tam nötr — açık pozisyonlar dengeli) |
| **YTD** | N/A |
| **Earnings** | 15 Temmuz BMO |
| **Beta** | ~1.2 |
| **Son 8Q Ort. Earnings Hareketi** | ±4.2% |
| **Implied Move (EM)** | ~±4.5% (~$4.50) |
| **Sektör** | Yatırım Bankacılığı & Varlık Yönetimi |

#### Strateji 1: Iron Condor (Ana — Deneyimli Traderlar)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $110C / Buy $120C (Wing $10) |
| **Put Wing** | Sell $90P / Buy $80P (Wing $10) |
| **Kredi/Maliyet** | ~$3.50 |
| **Max Risk** | $6.50 (Wing $10 - Kredi $3.50) |
| **Max Kar** | $3.50 (toplanan kredi) |
| **ROI** | ~54% |
| **Breakeven'lar** | $113.50 (üst) / $86.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.20) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.08/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.75 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $7.00 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = $10 (tam uyum!) |
| **PoP** | ~56% |

> **Strateji Gerekçesi:** MS tam nötr CPR (1.00) ve IV Rank %48 (sınırda) ile Iron Condor için "deneyimli trader" adayıdır. Wing $10 = fiyatın %10'u, EM (~%4.5) dışında geniş güvenli bölge. IV Rank %48, %50 eşiğinin hemen altında — prim toplama potansiyeli sınırlı ama hala makul. MS 15 Temmuz'da earnings açıklayacak — diğer büyük bankalardan (14 Temmuz) 1 gün sonra. Bu, 14 Temmuz banka earnings'inin etkisini görme fırsatı sunar. Eğer JPM/BAC/GS güçlü sonuçlar açıklarsa, MS de benzer performans gösterebilir. FOMC'den uzak — temiz dönem. Not: IV Rank %48 < %50 — "ideal" IC adayı değil, deneyimli traderlar için.

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $100 (ATM) |
| **Sell Call** | $110 (OTM, wing $10) |
| **Maliyet** | ~$4.00 |
| **Max Risk** | $4.00 (ödenen prim) |
| **Max Kar** | $6.00 (Wing $10 - Maliyet $4) |
| **ROI** | ~150% |
| **Breakeven** | $104 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.25) |
| **Theta** | Negatif (~-$0.07/gün) |
| **Kar Hedefi** | %50 kar = hisse $107; %100 kar = hisse $110 üzeri |
| **Hedge Kullanımı** | MS long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer 14 Temmuz banka earnings'leri güçlü gelirse, MS 15 Temmuz'da benzer performans gösterebilir. Long Call Spread, bu "follow-through" hareketinden kaldıraçlı kar sağlar. MS 50MA ve 200MA üzerinde — teknik görünüm pozitif. Ancak IV crush riski var — pozisyonu 14 Temmuz akşamı (diğer bankalar earnings sonrası) aç, 15 Temmuz BMO sonrası hemen değerlendir. Not: Bu "event-driven" timing risklidir — 14 Temmuz sonuçları kötü gelirse MS de düşer.

#### Strateji 3: Short Straddle (Koruma/Hedge — Yüksek Risk)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Nötr Delta) |
| **Sell Call** | $100 (ATM) |
| **Sell Put** | $100 (ATM) |
| **Kredi** | ~$8.00 |
| **Max Risk** | Sınırsız (yukarı) / $92 (aşağı, hisse $0'a düşerse) |
| **Max Kar** | $8.00 (toplanan kredi) |
| **ROI** | ~8% (kısa vadeli) |
| **Breakeven'lar** | $108 (üst) / $92 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 (nötr) |
| **Vega** | Negatif (~-$0.50) — IV crush'tan maksimum kazanç |
| **Theta** | Pozitif (~$0.25/gün) — maksimum theta decay |
| **Gamma** | Çok Yüksek (ATM, kısa vade) — büyük risk |
| **Kar Hedefi** | %25 mekanik exit = ~$2.00 kar (short straddle için düşük hedef) |
| **Stop Loss** | 1.5x kredi = pozisyonu $12 zararda kapat |

> **Koruma/Hedge Gerekçesi:** Short Straddle, IV crush'tan maksimum kazanç sağlayan stratejidir. MS IV Rank %48 ile prim toplama makul. ATM straddle $8 kredi toplar — hisse $92-$108 aralığında kalırsa kar. Ancak risk ÇOK YÜKSEK — hisse $108 üzerine veya $92 altına çıkarsa zarar sınırsız (yukarı) veya büyük (aşağı). Bu strateji SADECE deneyimli traderlar için. Pozisyon büyüklüğü: Hesabın %0.5'inden fazla risk atma. 21 DTE kuralı kesin — gamma patlaması önlenmeli.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$110 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$90 (Lottery) | ~$15 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($100C/$110C) 1 kontrat | ~$400 | ~$600 | 1:1.5 |
| $50-$200 | Long Put Spread ($95P/$85P) 1 kontrat | ~$320 | ~$680 | 1:2.1 |
| $200-$500 | Iron Condor ($90P/$80P + $110C/$120C) 1 kontrat | ~$350 | ~$650 | 1:1.9 |
| $200-$500 | Long Call Butterfly ($98C/$104C/$110C) 1 kontrat | ~$220 | ~$780 | 1:3.5 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%48 — sınırda), 14 Temmuz banka earnings planı |
| **11-12 Temmuz** | Entry (IC) | Iron Condor aç (35-45 DTE) |
| **14 Temmuz** | Gözlem | JPM/BAC/GS/WFC/C earnings sonuçlarını izle — MS için ipucu |
| **14 Temmuz Akşam** | Entry (Long Call Spread) | Eğer 14 Temmuz bankalar güçlüyse, MS call spread aç |
| **15 Temmuz** | Earnings Günü | MS BMO açıklama — pozisyonu TUT |
| **16 Temmuz** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **18-21 Temmuz** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |
| **29 Temmuz** | FOMC | MS pozisyonu kapanmış olmalı |

> **⚠️ Risk Uyarıları:**
> 1. MS IV Rank %48 — %50 eşiğinin altında. Iron Condor prim toplama potansiyeli sınırlı.
> 2. Short Straddle ÇOK RİSKLİ — sınırsız yukarı risk, büyük aşağı risk. Sadece deneyimli traderlar.
> 3. 14 Temmuz banka earnings'leri MS için "leading indicator" — kötü sonuçlar MS'yi de baskılar.
> 4. MS 15 Temmuz'da — diğer bankalardan 1 gün sonra, piyasa volatilitesi taşıyabilir.
> 5. Short Straddle'da gamma riski zirvede — hisse %2+ hareket ederse zarar hızlı büyür.
> 6. Pozisyon büyüklüğü: IC için %1-2, Short Straddle için %0.5'den fazla risk atma.

---

### 6.7 BLK — ~$950 — CPR: 0.85

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 60.00 (Nötr-boğa, momentum pozitif) |
| **50MA** | ~$930 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | ~$890 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~22% |
| **IV Rank** | ~35% (Düşük — IC uygun değil, long spread tercih) |
| **Hacim CPR** | 0.85 (Hafif ayı — put hacmi call hacminden hafif yüksek) |
| **OI CPR** | 0.88 (Hafif ayı — açık put pozisyonları call'lardan hafif fazla) |
| **YTD** | N/A |
| **Earnings** | 21 Temmuz BMO |
| **Beta** | ~1.1 |
| **Son 8Q Ort. Earnings Hareketi** | ±3.0% |
| **Implied Move (EM)** | ~±3.5% (~$33) |
| **Sektör** | Varlık Yönetimi & ETF Lideri |
| **AUM** | ~$10.5 Trilyon |

#### Strateji 1: Bear Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $990 (OTM, ~%4.2 üzerinde) |
| **Buy Call** | $1,040 (daha OTM, wing $50) |
| **Kredi/Maliyet** | ~$18.00 |
| **Max Risk** | $32.00 (Wing $50 - Kredi $18) |
| **Max Kar** | $18.00 (toplanan kredi) |
| **ROI** | ~56% |
| **Breakeven** | $1,008 |
| **Delta Hedefi** | -0.10 ile -0.15 arası (ayı yönlü) |
| **Vega** | Negatif (~-$0.35) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.25/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$9 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $36 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$95 (kullanılan $50 = dar wing, agresif) |
| **PoP** | ~60% |

> **Strateji Gerekçesi:** BLK CPR 0.85/0.88 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. IV Rank %35 düşük — prim toplama sınırlı ama BLK yüksek fiyatlı ($950) hisse olduğu için kredi $18 yüksek. Bear Call Spread, hissenin $990 üzerine çıkmamasına bahis oynar. BLK 21 Temmuz'da earnings açıklayacak — diğer finansallardan (14-15 Temmuz) bir hafta sonra. Bu, finansal sektörün genel earnings trendini görme fırsatı sunar. Eğer diğer finansallar zayıf sonuçlar verirse, BLK de baskılanabilir. AUM akışları (outflows) earnings sürprizi riski taşır. Not: Yüksek fiyat = yüksek margin gereksinimi. Pozisyonu küçük tut.

#### Strateji 2: Mini Bear Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $990 (OTM) |
| **Buy Call** | $1,015 (daha OTM, wing $25) |
| **Kredi** | ~$10.00 |
| **Max Risk** | $15.00 (Wing $25 - Kredi $10) |
| **Max Kar** | $10.00 |
| **ROI** | ~67% |
| **Breakeven** | $1,000 |
| **Delta Hedefi** | -0.15 ile -0.20 arası |
| **Vega** | Negatif (~-$0.20) |
| **Theta** | Pozitif (~$0.12/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$5 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $20 zararda kapat |

> **Alternatif Gerekçesi:** Mini spread (wing $25) daha düşük margin gereksinimi sunar. BLK fiyatı yüksek olduğu için wing $50 stratejisi çok büyük risk taşır. Mini spread, küçük hesaplar için daha uygun. Ancak dar wing = hisse %3+ hareket ederse max loss. BLK son 8Q ortalama earnings hareketi ±%3.0 — wing $25 (%2.6) sınırda. Dikkatli olun.

#### Strateji 3: Long Put Calendar (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Calendar Spread (Karmaşık Greeks) |
| **Sell** | 1 haftalık $940 Put (front month) |
| **Buy** | 4 haftalık $940 Put (back month) |
| **Maliyet** | ~$12.00 |
| **Max Risk** | $12.00 (ödenen prim) |
| **Max Kar** | ~$25.00 (theta decay farkı + vol expansion) |
| **ROI** | ~208% |
| **Breakeven** | ~$920 / ~$960 (yaklaşık) |
| **Delta** | -0.15 ile -0.25 (hafif ayı) |
| **Vega** | Pozitif (back month daha fazla Vega) |
| **Theta** | Pozitif (front month theta decay > back month) |
| **Kar Hedefi** | %50 kar = ~$6; hisse $940 yakınında kalırsa max kar |

> **Koruma/Hedge Gerekçesi:** Long Put Calendar, BLK'nin düşük IV (%35) ortamında ucuz hedge sağlar. Earnings öncesi front month IV şişer, earnings sonrası çöker — front month satıcısı kazanır. Back month (4 haftalık) FOMC (29 Temmuz) volatilitesini de yakalar. Eğer BLK earnings'te düşerse ($940 altına), put calendar kar sağlar. Eğer hisse yatay seyrederse ($940 civarı), theta decay farkından kar. Risk: Hisse $960 üzerine veya $920 altına çıkarsa zarar.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | ⛔ Uygun strateji bulunamadı (fiyat çok yüksek) |
| $50-$200 | ⛔ Uygun strateji bulunamadı (minimum spread >$200) |
| $200-$500 | Mini Bear Call Spread ($990C/$1,015C) 1 kontrat | ~$250 | ~$1,000 | 1:4.0 |
| $200-$500 | Long Put Butterfly ($930P/$940P/$950P) | ~$320 | ~$680 | 1:2.1 |

> **Bütçe Uyarısı:** BLK fiyatı ~$950 ile çok yüksek. 1 kontrat = $95,000 nominal değer. Spread stratejileri bile $200+ maliyet. Bütçe dostu strateji bulunamıyor. Alternatif: Micro-options (10 hisse) varsa değerlendir. Yoksa BLK'yi bütçe stratejilerinden çıkar.

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **14-15 Temmuz** | Gözlem | Diğer finansal hisselerin earnings sonuçlarını izle — BLK için ipucu |
| **16-17 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%35), strike seçimi |
| **18 Temmuz** | Entry | Pozisyon aç (30-45 DTE) |
| **21 Temmuz** | Earnings Günü | BLK BMO açıklama — pozisyonu TUT |
| **22 Temmuz** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **24-25 Temmuz** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |
| **29 Temmuz** | FOMC | BLK pozisyonu kapanmış olmalı (FOMC volatilitesi riski) |

> **⚠️ Risk Uyarıları:**
> 1. BLK fiyatı ~$950 çok yüksek — 1 kontrat margin gereksinimi ~$3,200. Küçük hesaplar için uygun değil.
> 2. IV Rank %35 düşük — short premium stratejileri sınırlı kazanç sunar.
> 3. BLK 21 Temmuz'da — diğer finansallardan bir hafta sonra, sektör trendi belli olur.
> 4. AUM outflows (para çıkışı) BLK earnings'ini baskılar — varlık yönetimi sektörü riski.
> 5. Dar wing ($25/$50) stratejilerde hisse %4+ hareket ederse max loss.
> 6. FOMC 29 Temmuz yakın — BLK pozisyonu FOMC öncesi kapatılmalı.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

## 7. SAĞLIK HİSSELERİ STRATEJİLERİ

> **Sağlık Sektörü Makro Analizi:**
> Temmuz 2026'da 6 büyük sağlık hissesi earnings açıklayacak. Sağlık sektörü defansif karakteristik gösterir — IV crush potansiyeli %25-35 (orta), bu da short premium stratejileri için makul kazanç sunar. UNH en yüksek CPR (3.33) ile tüm raporun en güçlü boğa sinyalini veriyor. JNJ, PFE, MRK düşük beta (0.26-0.29) ile portföy çeşitlendirmesi için ideal. Sağlık hisseleri genellikle düşük IV sunar (%19-26) — long spread stratejileri daha uygun. Sektör riskleri: (1) Medicare/Medicaid fiyatlandırma baskısı, (2) FDA onay süreçlerinde gecikme, (3) ilaç patent sürelerinin dolması, (4) genel sağlık harcamalarında yavaşlama.
>
> **Earnings Tarihleri Dağılımı:**
> - Erken: JNJ (15 Temmuz), ABT (16 Temmuz)
> - Orta: TMO (22 Temmuz)
> - Geç: UNH (28 Temmuz), PFE (30 Temmuz), MRK (31 Temmuz)
>
> **FOMC Çakışması:** UNH (28 Temmuz) FOMC (29 Temmuz) öncesi — yarım pozisyon önerilir. PFE (30 Temmuz) ve MRK (31 Temmuz) FOMC sonrası — temiz dönem.

### Sağlık Sektörü Özet Tablosu

| Hisse | Fiyat | IV30 | IV Rank | Hacim CPR | OI CPR | Beta | YTD% | Earnings |
|-------|-------|------|---------|-----------|--------|------|------|----------|
| **UNH** | $406.57 | ~26% | 48% | **3.33** | 1.49 | 1.34 | +18.25% | 28 Temmuz |
| **JNJ** | $232.16 | ~22% | 42% | 0.95 | 1.05 | **0.26** | +13.43% | 15 Temmuz BMO |
| **PFE** | $26.04 | ~22% | 28% | 1.15 | 1.20 | **0.29** | +8.09% | 30 Temmuz BMO |
| **ABT** | ~$115 | ~20% | 30% | 0.95 | ~1.0 | N/A | N/A | 16 Temmuz BMO |
| **TMO** | ~$560 | ~24% | 38% | 0.85 | ~0.9 | N/A | N/A | 22 Temmuz |
| **MRK** | ~$105 | ~19% | 32% | 1.05 | ~1.0 | N/A | N/A | 31 Temmuz BMO |

---

### 7.1 UNH — $406.57 — CPR: 3.33 ⭐ EN YÜKSEK CPR

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 68.40 (Nötr-alcak sınırı, aşırı alım değil) |
| **50MA** | $385.20 (fiyat üzerinde, güçlü kısa vadeli trend) |
| **200MA** | $340.80 (fiyat üzerinde, güçlü uzun vadeli trend) |
| **IV30** | ~26% |
| **IV Rank** | ~48% (Sınırda — IC deneyimli, long spread tercih) |
| **Hacim CPR** | **3.33 (En yüksek! Call hacmi put hacminden 3.33 kat fazla)** |
| **OI CPR** | 1.49 (Boğa — açık call pozisyonları put'lardan %49 fazla) |
| **Beta** | 1.34 (Piyasadan %34 daha volatil) |
| **YTD** | +18.25% (Sağlık sektörü lideri!) |
| **Earnings** | 28 Temmuz |
| **Son 8Q Ort. Earnings Hareketi** | ±4.5% |
| **Implied Move (EM)** | ~±5.0% (~$20) |
| **Sektör** | Sağlık Sigortası & Managed Care |
| **FOMC Çakışması** | 1 gün önce (29 Temmuz FOMC) — YARI POZİSYON! |

#### Strateji 1: Bull Call Spread (Ana) ⭐ #1 FIRSAT

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $400 (hafif ITM/ATM) |
| **Sell Call** | $430 (OTM, wing $30) |
| **Maliyet** | ~$16.00 |
| **Max Risk** | $16.00 (ödenen prim) |
| **Max Kar** | $14.00 (Wing $30 - Maliyet $16) |
| **ROI** | ~88% |
| **Breakeven** | $416 |
| **Delta** | +0.50 ile +0.60 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.35) |
| **Theta** | Negatif (~-$0.12/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$8 kar; %100 kar = hisse $430 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $8 zararda kapat |
| **Hedge Kullanımı** | UNH long pozisyonu olanlar için upside leverage |

> **⭐ Strateji Gerekçesi:** UNH en yüksek CPR değeri (3.33) — piyasa güçlü bullish beklenti içinde. Call hacmi put hacminden 3.33 kat fazla — bu inanılmaz bir boğa sinyali. OI CPR 1.49 ile açık pozisyonlarda da boğa eğilim var. UNH YTD +18.25 ile sağlık sektörünün en güçlü performansı. 50MA ($385.20) ve 200MA ($340.80) çok altında — teknik görünüm muazzam. Sağlık sektörü orta derece IV crush (%25-35) — long pozisyonlar kazanır. RSI 68.40 ile hala momentum var, aşırı alım değil (70 sınırı). Bull Call Spread, hissenin earnings öncesi run-up'ından ve earnings sonrası devamından kaldıraçlı kar sağlar. **RİSK:** FOMC 29 Temmuz — UNH earnings 28 Temmuz'da. Yarım pozisyon (normal boyutun %50'si) önerilir. Ertesi gün FOMC volatilitesi pozisyonu etkileyebilir.

#### Strateji 2: Short Put Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $380 (OTM, ~%6.5 altında) |
| **Buy Put** | $350 (daha OTM, wing $30) |
| **Kredi** | ~$8.50 |
| **Max Risk** | $21.50 (Wing $30 - Kredi $8.50) |
| **Max Kar** | $8.50 (toplanan kredi) |
| **ROI** | ~40% |
| **Breakeven** | $371.50 |
| **Delta Hedefi** | +0.15 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.20) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.10/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$4.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $17 zararda kapat |
| **PoP** | ~65% |

> **Alternatif Gerekçesi:** Short Put Spread, UNH'nin güçlü boğa momentumunu (CPR 3.33, YTD +18.25) destekler. Hisse $380 altına düşmezse (50MA $385.20 yakınında), kredi $8.50 kar kalır. Eğer UNH earnings'te düşerse, $350 put koruma sağlar. Bu strateji, "high conviction bullish" görüşü olanlar için. IV crush potansiyeli %25-35 — short premium kazançlı. Not: FOMC 29 Temmuz yakınlığı — yarım pozisyon.

#### Strateji 3: Protective Put (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Long Put (Long Vega, Short Delta) |
| **Buy Put** | $380 (OTM koruma) |
| **Maliyet** | ~$6.50 |
| **Max Risk** | $6.50 (ödenen prim) |
| **Max Kar** | Sınırsız (hisse $0'a düşerse) |
| **Breakeven** | $373.50 |
| **Downside Protection** | $380 (yaklaşık %6.5 aşağı koruma) |
| **Delta** | -0.30 ile -0.40 (ayı yönlü) |
| **Vega** | Pozitif (~+$0.25) |
| **Theta** | Negatif (~-$0.08/gün) |
| **Kar Hedefi** | %100 kar = hisse $373.50 altında; %50 kar = hisse $376.75 altında |
| **Hedge Kullanımı** | UNH long pozisyonu olanlar için koruma |

> **Koruma Gerekçesi:** UNH long pozisyonu olan yatırımcılar için Protective Put, FOMC (29 Temmuz) öncesi aşağı yönlü riski sınırlar. Maliyet $6.50 ile %1.6'lık bir "sigorta primi" ödenir. Eğer UNH earnings'te beklenenden kötü sonuçlar açıklarsa (medical loss ratio artışı, Medicare margin baskısı), put kar sağlar ve long hisse zararını telafi eder. FOMC volatilitesi de korunur. Not: IV crush put'a zarar verir — pozisyonu 26-27 Temmuz'da aç, 29 Temmuz FOMC sonrası kapat.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$430 (Lottery) | ~$35 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$350 (Lottery) | ~$15 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($400C/$430C) 1 kontrat | ~$320 | ~$2,680 | 1:8.4 |
| $50-$200 | Short Put Spread ($380P/$350P) 1 kontrat | ~$215 | ~$850 | 1:4.0 |
| $200-$500 | Bull Call Spread ($400C/$430C) 1 kontrat + OTM Call @$450 | ~$480 | ~$3,200+ | Karmaşık |
| $200-$500 | Long Call Butterfly ($395C/$415C/$435C) 1 kontrat | ~$280 | ~$1,720 | 1:6.1 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **23-24 Temmuz** | Hazırlık | Greeks analizi, CPR teyidi (3.33), FOMC risk değerlendirmesi |
| **25-26 Temmuz** | Entry (Yarım Pozisyon) | Normal boyutun %50'si ile pozisyon aç (FOMC yakın) |
| **27 Temmuz** | Son Entry | Son giriş fırsatı (30-45 DTE) |
| **28 Temmuz** | Earnings Günü | UNH açıklama — pozisyonu TUT, panik YOK |
| **29 Temmuz** | 🚨 FOMC Günü | Pozisyonu yakından izle, volatilite artışı olabilir |
| **30 Temmuz** | Yönetim | FOMC sonrası değerlendirme, %50 kar varsa kapat |
| **1-4 Ağustos** | Çıkış | Kalan pozisyonu kapat (21 DTE kuralı) |

> **⚠️ Risk Uyarıları:**
> 1. ⭐ CPR 3.33 inanılmaz yüksek — ancak bu "crowded long" riski taşır. Herkes boğa ise, sürpriz aşağı yönlü hareket şiddetli olabilir.
> 2. FOMC 29 Temmuz — UNH earnings 28 Temmuz'da. Yarım pozisyon şart. FOMC öncesi volatilite artışı pozisyonu etkiler.
> 3. UNH Beta 1.34 — piyasadan daha volatil. FOMC günü genel piyasa hareketi UNH'i sert etkiler.
> 4. Medicare/Medicaid fiyatlandırma baskısı — politik risk, earnings sürprizi yapabilir.
> 5. RSI 68.40 aşırı alım sınırına yakın — kısa vadeli geri çekilme riski.
> 6. Pozisyon büyüklüğü: FOMC yakınlığı nedeniyle normal boyutun %50'si. Hesabın %0.5-1'inden fazla risk atma.

---

### 7.2 JNJ — $232.16 — CPR: 0.95

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 52.15 (Nötr, momentum yok) |
| **50MA** | $228.50 (fiyat üzerinde, kısa vadeli trend hafif pozitif) |
| **200MA** | $215.60 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~22% |
| **IV Rank** | ~42% (Orta — spread stratejileri uygun) |
| **Hacim CPR** | 0.95 (Nötr — hacim dengeli) |
| **OI CPR** | 1.05 (Hafif boğa — açık call pozisyonları put'lardan hafif fazla) |
| **Beta** | **0.26 (Çok düşük — piyasadan %74 daha az volatil)** |
| **YTD** | +13.43% (Sektör ortalaması) |
| **Earnings** | 15 Temmuz BMO |
| **Son 8Q Ort. Earnings Hareketi** | ±2.5% |
| **Implied Move (EM)** | ~±3.0% (~$7) |
| **Sektör** | İlaç & Tıbbi Cihazlar |
| **Dividend Yield** | ~3.0% |

#### Strateji 1: Long Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $230 (hafif ITM/ATM) |
| **Sell Call** | $245 (OTM, wing $15) |
| **Maliyet** | ~$6.50 |
| **Max Risk** | $6.50 (ödenen prim) |
| **Max Kar** | $8.50 (Wing $15 - Maliyet $6.50) |
| **ROI** | ~131% |
| **Breakeven** | $236.50 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.15) |
| **Theta** | Negatif (~-$0.05/gün) |
| **Kar Hedefi** | %50 kar = hisse $240.75; %100 kar = hisse $245 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $3.25 zararda kapat |
| **Hedge Kullanımı** | JNJ long pozisyonu olanlar için upside leverage |

> **Strateji Gerekçesi:** JNJ Beta 0.26 ile piyasaya göre çok düşük volatilite — "sakin" hisse. Düşük beta değeriyle portföy çeşitlendirmesi için ideal. IV Rank %42 orta — long spread için IV çok yüksek değil, makul. JNJ 15 Temmuz'da earnings açıklayacak — FOMC'den (29 Temmuz) uzak, temiz dönem. Son 8Q ortalama earnings hareketi ±%2.5 çok sınırlı — hisse büyük hareket yapmaz. Long Call Spread, sınırlı upside'tan kaldıraçlı kar sağlar. Wing $15 = fiyatın ~%6.5'i, EM (~%3.0) dışında güvenli bölge. JNJ dividend yield %3.0 ile yüksek temettü — long-term hold değeri yüksek. Eğer earnings beat gelirse, hisse $245'a kadar yükselebilir.

#### Strateji 2: Call Calendar Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Calendar / Time Spread (Karmaşık Greeks) |
| **Sell** | 1 haftalık $235 Call (front month) |
| **Buy** | 3 haftalık $235 Call (back month) |
| **Maliyet** | ~$2.50 |
| **Max Risk** | $2.50 (ödenen prim) |
| **Max Kar** | ~$5.00 (theta decay farkından) |
| **ROI** | ~200% |
| **Breakeven** | ~$230 / ~$240 (yaklaşık) |
| **Delta** | +0.10 ile +0.20 (hafif boğa) |
| **Vega** | Pozitif (back month daha fazla Vega) |
| **Theta** | Pozitif (front month theta decay > back month) |
| **Kar Hedefi** | %50 kar = ~$1.25; hisse $235 yakınında kalırsa max kar |

> **Alternatif Gerekçesi:** JNJ düşük IV (%22) ve düşük beta (0.26) ile calendar spread için ideal aday. Earnings öncesi front month IV şişer, earnings sonrası çöker — front month satıcısı kazanır. Back month (3 haftalık) theta decay farkından kar. JNJ sınırlı hareket (±%2.5) ile hisse $235 yakınında kalma olasılığı yüksek. Risk: Hisse $240 üzerine veya $230 altına çıkarsa zarar. Not: Calendar spread, JNJ'nin "sakin" karakterine uygun.

#### Strateji 3: Asimetrik Call Spread (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $230 (hafif ITM) |
| **Sell Call** | $240 (OTM, wing $10) |
| **Maliyet** | ~$4.50 |
| **Max Risk** | $4.50 (ödenen prim) |
| **Max Kar** | $5.50 (Wing $10 - Maliyet $4.50) |
| **ROI** | ~122% |
| **Breakeven** | $234.50 |
| **Delta** | +0.50 ile +0.60 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.12) |
| **Theta** | Negatif (~-$0.04/gün) |
| **Kar Hedefi** | %50 kar = hisse $237.25; %100 kar = hisse $240 üzeri |
| **Hedge Kullanımı** | JNJ long pozisyonu olanlar için upside leverage (düşük maliyet) |

> **Koruma Gerekçesi:** Asimetrik Call Spread (wing $10), standart call spread'e (wing $15) göre daha düşük maliyet sunar. JNJ long pozisyonu olanlar için ucuz upside leverage. Eğer JNJ earnings'te beat açıklarsa, hisse $240'a kadar yükselebilir. Maliyet $4.50 ile %1.9'lık bir "kaldıraç primi" ödenir. Not: Dar wing ($10) = hisse $240 üzerine çıkarsa max kar sınırlı. Standart spread (wing $15) daha fazla kar potansiyeli sunar.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$250 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$215 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($230C/$245C) 1 kontrat | ~$325 | ~$850 | 1:2.6 |
| $50-$200 | Call Calendar ($235C, 1W/3W) 2 kontrat | ~$250 | ~$500 | 1:2.0 |
| $200-$500 | Long Call Butterfly ($228C/$235C/$242C) 2 kontrat | ~$380 | ~$1,120 | 1:2.9 |
| $200-$500 | Asimetrik Call Spread ($230C/$240C) 2 kontrat | ~$450 | ~$1,100 | 1:2.4 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, Beta teyidi (0.26), IV Rank kontrolü |
| **11-12 Temmuz** | Entry | Pozisyon aç (30-45 DTE) |
| **15 Temmuz** | Earnings Günü | JNJ BMO açıklama — pozisyonu TUT |
| **16 Temmuz** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **18-21 Temmuz** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |
| **29 Temmuz** | FOMC | JNJ pozisyonu kapanmış olmalı (zaten 2 hafta önce kapanır) |

> **⚠️ Risk Uyarıları:**
> 1. JNJ Beta 0.26 çok düşük — upside potansiyeli sınırlı. Call spread karı sınırlı kalabilir.
> 2. JNJ "sakin" hisse — büyük earnings sürprizleri nadirdir. "Boring but reliable".
> 3. İlaç patent sürelerinin dolması (Stelara, Darzalex) earnings baskısı yapabilir.
> 4. Talc litigation riski (mahkeme davaları) ani düşüşlere neden olabilir.
> 5. Düşük IV (%22) = ucuz opsiyon primleri — long stratejiler için uygun, short stratejiler için sınırlı.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

### 7.3 PFE — $26.04 — CPR: 1.17

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 42.80 (Ayıcak bölge, momentum negatif) |
| **50MA** | $25.90 (fiyat üzerinde, kısa vadeli trend hafif pozitif) |
| **200MA** | $26.45 (fiyat altında, uzun vadeli trend hafif ayı) |
| **IV30** | ~22% |
| **IV Rank** | ~28% (Düşük — long spread tercih) |
| **Hacim CPR** | 1.15 (Hafif boğa — call hacmi put hacminden %15 yüksek) |
| **OI CPR** | 1.20 (Hafif boğa — açık call pozisyonları put'lardan %20 fazla) |
| **Beta** | **0.29 (Çok düşük)** |
| **YTD** | +8.09% (Sektör ortalamasının altında) |
| **Earnings** | 30 Temmuz BMO |
| **Son 8Q Ort. Earnings Hareketi** | ±3.0% |
| **Implied Move (EM)** | ~±3.5% (~$0.91) |
| **Sektör** | İlaç (Big Pharma) |
| **Dividend Yield** | **~6.61% (Çok yüksek!)** |
| **FOMC Çakışması** | FOMC sonrası (29 Temmuz) — temiz dönem! |

#### Strateji 1: Bull Put Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $25 (OTM, ~%4.0 altında) |
| **Buy Put** | $22 (daha OTM, wing $3) |
| **Kredi** | ~$0.55 |
| **Max Risk** | $2.45 (Wing $3 - Kredi $0.55) |
| **Max Kar** | $0.55 (toplanan kredi) |
| **ROI** | ~22% |
| **Breakeven** | $24.45 |
| **Delta Hedefi** | +0.15 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.03) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.02/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.28 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $1.10 zararda kapat |
| **PoP** | ~62% |
| **Atama Riski** | Hisse $25 altında kapanırsa 100 hisse alım zorunluluğu |

> **Strateji Gerekçesi:** PFE fiyat $26.04 çok düşük — spread küçük (wing $3). Ancak bu, küçük sermaye ile çoklu kontrat (10 kontrat = ~$550 kredi, ~$2,450 risk) imkanı sunar. Dividend yield %6.61 ile yüksek temettü getirisi — hisse $25 altına düşerse atama olsa bile, %6.61 temettü ile uzun vadeli hold değeri yüksek. CPR 1.15/1.20 hafif boğa — piyasa hafif bullish beklenti içinde. IV Rank %28 düşük — short premium sınırlı ama PFE düşük fiyatlı olduğu için ROI makul. FOMC sonrası (30 Temmuz) — temiz dönem, FOMC volatilitesi etkilemez. PFE 200MA ($26.45) altında — hafif ayı trend, ancak 50MA ($25.90) üzerinde. Bull Put Spread, hissenin $25 üzerinde kalmasına bahis oynar.

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $26 (ATM) |
| **Sell Call** | $29 (OTM, wing $3) |
| **Maliyet** | ~$0.90 |
| **Max Risk** | $0.90 (ödenen prim) |
| **Max Kar** | $2.10 (Wing $3 - Maliyet $0.90) |
| **ROI** | ~233% |
| **Breakeven** | $26.90 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.04) |
| **Theta** | Negatif (~-$0.01/gün) |
| **Kar Hedefi** | %50 kar = hisse $27.95; %100 kar = hisse $29 üzeri |
| **Hedge Kullanımı** | PFE long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** PFE düşük fiyatlı ($26.04) hisse — call spread maliyeti çok düşük ($0.90). 10 kontrat = $90 maliyet, $210 max kar. Bu, küçük hesaplar için ideal kaldıraç. Eğer PFE earnings'te beat açıklarsa (pipeline güncellemesi, yeni ilaç onayı), hisse $29'a kadar yükselebilir. Ancak IV crush riski var — pozisyonu earnings'ten 1-2 gün önce aç, earnings sonrası hemen değerlendir. Not: PFE RSI 42.80 ayıcak bölgede — upside potansiyeli sınırlı olabilir.

#### Strateji 3: Cash-Secured Put (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Hafif Long Delta) |
| **Sell Put** | $25 (OTM) |
| **Kredi** | ~$0.35 |
| **Max Risk** | $2,465 (100 hisse × $25 - kredi $35) |
| **Max Kar** | $35 (toplanan kredi) |
| **ROI** | ~1.4% (kısa vadeli) |
| **Breakeven** | $24.65 |
| **Atama Riski** | Hisse $25 altında kapanırsa 100 hisse alım zorunluluğu |
| **Delta** | +0.20 ile +0.25 |
| **Vega** | Negatif (~-$0.02) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.01/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.18; veya atama bekleyerek hisse biriktirme |
| **Dividend Yield** | %6.61 (atama sonrası temettü geliri) |

> **Koruma/Hedge Gerekçesi:** Cash-secured put, PFE'yi "indirimli" alma stratejisidir. PFE dividend yield %6.61 ile yüksek temettü — atama sonrası uzun vadeli hold değeri yüksek. Eğer PFE earnings'te düşerse ve $25 altında kapanırsa, 100 hisse $25'den alınır (gerçek maliyet $24.65). Eğer hisse $25 üzerinde kalırsa, $35 kredi kazanılır. 10 kontrat = $350 kredi, $24,650 potansiyel atama riski. Not: $2,465 per kontrat margin — hesapta yeterli nakit olmalı.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$29 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$22 (Lottery) | ~$8 | Sınırsız | Spekülatif |
| $50-$200 | Bull Put Spread ($25P/$22P) 5 kontrat | ~$275 | ~$1,225 | 1:4.5 |
| $50-$200 | Long Call Spread ($26C/$29C) 5 kontrat | ~$225 | ~$1,050 | 1:4.7 |
| $200-$500 | Cash-Secured Put ($25P) 10 kontrat | ~$350 kredi | $350 | 1:0.1 (ama hisse biriktirme) |
| $200-$500 | Long Call Butterfly ($25C/$27C/$29C) 8 kontrat | ~$320 | ~$1,280 | 1:4.0 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **25-26 Temmuz** | Hazırlık | Greeks analizi, dividend yield teyidi (%6.61), FOMC sonrası temiz dönem |
| **27-28 Temmuz** | Entry | Pozisyon aç (30-45 DTE) |
| **29 Temmuz** | FOMC | PFE pozisyonu açık — FOMC sonrası volatilite etkileyebilir (dikkatli izle) |
| **30 Temmuz** | Earnings Günü | PFE BMO açıklama — pozisyonu TUT |
| **31 Temmuz** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **2-5 Ağustos** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |

> **⚠️ Risk Uyarıları:**
> 1. PFE RSI 42.80 ayıcak bölgede — upside potansiyeli sınırlı. "Value trap" riski.
> 2. PFE 200MA ($26.45) altında — uzun vadeli trend hafif ayı. Dikkatli olun.
> 3. İlaç patent sürelerinin dolması (Eliquis, Ibrance) earnings baskısı yapabilir.
> 4. COVID-19 aşı/ilaç gelirlerinde düşüş (Comirnaty, Paxlovid) devam ediyor.
> 5. Düşük IV (%28) = ucuz opsiyon primleri — short stratejiler sınırlı kazanç.
> 6. FOMC 29 Temmuz — PFE earnings 30 Temmuz'da. FOMC sonrası volatilite taşıyabilir.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

### 7.4 ABT — ~$115 — CPR: 0.95

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 50.00 (Tam nötr, momentum yok) |
| **50MA** | ~$113 (fiyat üzerinde, kısa vadeli trend hafif pozitif) |
| **200MA** | ~$110 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~20% |
| **IV Rank** | ~30% (Düşük — long spread tercih) |
| **Hacim CPR** | 0.95 (Nötr — hacim dengeli) |
| **OI CPR** | ~1.00 (Nötr — açık pozisyonlar dengeli) |
| **YTD** | N/A |
| **Earnings** | 16 Temmuz BMO |
| **Beta** | ~0.7 |
| **Son 8Q Ort. Earnings Hareketi** | ±3.0% |
| **Implied Move (EM)** | ~±3.5% (~$4.03) |
| **Sektör** | Tıbbi Cihazlar & Tanı (Diagnostics) |
| **FOMC Çakışması** | FOMC'den uzak — temiz dönem |

#### Strateji 1: Long Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $115 (ATM) |
| **Sell Call** | $125 (OTM, wing $10) |
| **Maliyet** | ~$3.50 |
| **Max Risk** | $3.50 (ödenen prim) |
| **Max Kar** | $6.50 (Wing $10 - Maliyet $3.50) |
| **ROI** | ~186% |
| **Breakeven** | $118.50 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.08) |
| **Theta** | Negatif (~-$0.03/gün) |
| **Kar Hedefi** | %50 kar = hisse $121.75; %100 kar = hisse $125 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $1.75 zararda kapat |
| **Hedge Kullanımı** | ABT long pozisyonu olanlar için upside leverage |

> **Strateji Gerekçesi:** ABT tam nötr CPR (0.95/1.00) ve IV Rank %30 (düşük) ile long call spread için ideal aday. IV çok düşük (%20) — opsiyon primleri ucuz. Eğer ABT earnings'te beat açıklarsa (tıbbi cihaz satışları, tanı bölümü büyümesi), call spread kaldıraçlı kar sağlar. ABT 16 Temmuz'da earnings açıklayacak — FOMC'den (29 Temmuz) uzak, temiz dönem. 50MA (~$113) ve 200MA (~$110) üzerinde — teknik görünüm pozitif. Wing $10 = fiyatın ~%8.7'si, EM (~%3.5) dışında güvenli bölge. ABT Beta ~0.7 düşük — sınırlı hareket beklenir, butterfly stratejisi de uygun.

#### Strateji 2: Iron Condor (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $125C / Buy $135C (Wing $10) |
| **Put Wing** | Sell $105P / Buy $95P (Wing $10) |
| **Kredi** | ~$2.00 |
| **Max Risk** | $8.00 (Wing $10 - Kredi $2) |
| **Max Kar** | $2.00 (toplanan kredi) |
| **ROI** | ~25% |
| **Breakeven'lar** | $127 (üst) / $103 (alt) |
| **Delta Hedefi** | -0.03 ile +0.03 arası (nötr) |
| **Vega** | Negatif (~-$0.05) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.03/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$1 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $4 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = $11.5 (kullanılan $10 = dar wing, agresif) |
| **PoP** | ~58% |

> **Alternatif Gerekçesi:** ABT IV Rank %30 düşük — Iron Condor prim toplama potansiyeli sınırlı ($2 kredi). Ancak ABT düşük beta (~0.7) ve sınırlı earnings hareketi (±%3.0) ile hisse $105-$125 aralığında kalma olasılığı yüksek. Dar wing ($10) = yüksek risk/ödül. Bu strateji, "sakin hisse, sınırlı kazanç" arayanlar için. Not: IV Rank %30 < %50 — "ideal" IC adayı değil, deneyimli traderlar için.

#### Strateji 3: Long Call Butterfly (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Nötr Delta) |
| **Buy Call (Alt)** | $110 (ITM) |
| **Sell Call (Orta)** | $115 (ATM, 2 kontrat) |
| **Buy Call (Üst)** | $120 (OTM) |
| **Maliyet** | ~$1.80 |
| **Max Risk** | $1.80 (ödenen prim) |
| **Max Kar** | $3.20 (Wing $5 - Maliyet $1.80) |
| **ROI** | ~178% |
| **Breakeven'lar** | $111.80 (alt) / $118.20 (üst) |
| **Max Kar Bölgesi** | Hisse tam $115'te kapanırsa |
| **Delta** | +0.05 ile +0.15 (hafif boğa) |
| **Vega** | Pozitif (~+$0.05) |
| **Theta** | Negatif (~-$0.02/gün) |
| **Kar Hedefi** | %50 kar = ~$0.90; hisse $115 yakınında kalırsa max kar |
| **Hedge Kullanımı** | Bilinmeyen yönlü, sınırlı hareket beklentisi |

> **Koruma/Hedge Gerekçesi:** Long Call Butterfly, ABT'nin düşük IV (%20) ve sınırlı hareket (±%3.0) karakterine uygun. Hisse $115 civarında kalırsa (tam nötr CPR destekler), butterfly maksimum kar sağlar. Maliyet $1.80 çok düşük — 5 kontrat = $90 maliyet, $160 max kar. Bu, küçük hesaplar için ideal. Risk: Hisse $111.80 altına veya $118.20 üzerine çıkarsa zarar. Not: Butterfly likidite riski taşır — bid-ask spread yüksek olabilir.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$125 (Lottery) | ~$15 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$105 (Lottery) | ~$10 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Butterfly ($110C/$115C/$120C) 3 kontrat | ~$270 | ~$480 | 1:1.8 |
| $50-$200 | Long Call Spread ($115C/$125C) 1 kontrat | ~$175 | ~$325 | 1:1.9 |
| $200-$500 | Iron Condor ($105P/$95P + $125C/$135C) 2 kontrat | ~$400 | ~$800 | 1:2.0 |
| $200-$500 | Long Call Butterfly ($110C/$115C/$120C) 6 kontrat | ~$540 | ~$960 | 1:1.8 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%30 — düşük), Beta kontrolü (~0.7) |
| **11-12 Temmuz** | Entry | Pozisyon aç (30-45 DTE) |
| **16 Temmuz** | Earnings Günü | ABT BMO açıklama — pozisyonu TUT |
| **17 Temmuz** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **18-21 Temmuz** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |
| **29 Temmuz** | FOMC | ABT pozisyonu kapanmış olmalı (zaten 2 hafta önce kapanır) |

> **⚠️ Risk Uyarıları:**
> 1. ABT IV Rank %30 çok düşük — short premium stratejileri (IC, short straddle) sınırlı kazanç sunar.
> 2. ABT Beta ~0.7 düşük — upside potansiyeli sınırlı. Call spread karı sınırlı kalabilir.
> 3. Tıbbi cihaz bölümünde rekabet (Dexcom, Medtronic) pazar payı baskısı yapabilir.
> 4. Tanı (diagnostics) bölümünde COVID-19 test gelirlerinde düşüş devam ediyor.
> 5. Butterfly stratejilerinde likidite riski — bid-ask spread yüksek olabilir.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

### 7.5 TMO — ~$560 — CPR: 0.85

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 55.00 (Nötr-boğa, momentum dengeli) |
| **50MA** | ~$545 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | ~$520 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~24% |
| **IV Rank** | ~38% (Düşük — long spread tercih) |
| **Hacim CPR** | 0.85 (Hafif ayı — put hacmi call hacminden hafif yüksek) |
| **OI CPR** | ~0.90 (Hafif ayı — açık put pozisyonları call'lardan hafif fazla) |
| **YTD** | N/A |
| **Earnings** | 22 Temmuz |
| **Beta** | ~0.8 |
| **Son 8Q Ort. Earnings Hareketi** | ±3.5% |
| **Implied Move (EM)** | ~±4.0% (~$22.40) |
| **Sektör** | Bilimsel Araştırma Ekipmanları & Laboratuvar Hizmetleri |
| **FOMC Çakışması** | FOMC'den uzak — temiz dönem |

#### Strateji 1: Bear Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $585 (OTM, ~%4.5 üzerinde) |
| **Buy Call** | $615 (daha OTM, wing $30) |
| **Kredi** | ~$8.50 |
| **Max Risk** | $21.50 (Wing $30 - Kredi $8.50) |
| **Max Kar** | $8.50 (toplanan kredi) |
| **ROI** | ~40% |
| **Breakeven** | $593.50 |
| **Delta Hedefi** | -0.10 ile -0.15 arası (ayı yönlü) |
| **Vega** | Negatif (~-$0.20) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.12/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$4.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $17 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = $56 (kullanılan $30 = dar wing, agresif) |
| **PoP** | ~60% |

> **Strateji Gerekçesi:** TMO CPR 0.85/0.90 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. IV Rank %38 düşük — prim toplama sınırlı ama TMO yüksek fiyatlı ($560) hisse olduğu için kredi $8.50 yüksek. Bear Call Spread, hissenin $585 üzerine çıkmamasına bahis oynar. TMO 22 Temmuz'da earnings açıklayacak — FOMC'den (29 Temmuz) uzak, temiz dönem. 50MA (~$545) ve 200MA (~$520) üzerinde — teknik görünüm pozitif ama CPR ayı. "Teknik pozitif, sentiment negatif" çelişkisi — bear call spread, sentiment tarafını oynar. Not: TMO laboratuvar hizmetleri bölümünde COVID-19 test gelirlerinde düşüş devam ediyor — earnings baskısı riski.

#### Strateji 2: Long Put Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Short Delta) |
| **Buy Put** | $550 (hafif ITM) |
| **Sell Put** | $520 (OTM, wing $30) |
| **Maliyet** | ~$10.00 |
| **Max Risk** | $10.00 (ödenen prim) |
| **Max Kar** | $20.00 (Wing $30 - Maliyet $10) |
| **ROI** | ~200% |
| **Breakeven** | $540 |
| **Delta** | -0.40 ile -0.50 (ayı yönlü) |
| **Vega** | Pozitif (~+$0.25) |
| **Theta** | Negatif (~-$0.08/gün) |
| **Kar Hedefi** | %50 kar = hisse $530; %100 kar = hisse $520 altında |
| **Hedge Kullanımı** | TMO long pozisyonu olanlar için koruma |

> **Alternatif Gerekçesi:** Eğer TMO earnings'te zayıf sonuçlar açıklarsa (laboratuvar hizmetleri düşüşü, biyoteknoloji harcamalarında yavaşlama), put spread kaldıraçlı kar sağlar. CPR 0.85/0.90 ayı bias destekler. Ancak IV crush riski var — pozisyonu earnings'ten 2-3 gün önce aç, earnings sonrası hemen değerlendir. Not: TMO Beta ~0.8 düşük — aşağı yönlü hareket sınırlı olabilir.

#### Strateji 3: Protective Collar (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kombinasyon (Long Put + Short Call) |
| **Long Put** | $530 (OTM koruma) |
| **Short Call** | $600 (OTM, kredi toplama) |
| **Put Maliyeti** | ~$5.50 |
| **Call Kredisi** | ~$3.50 |
| **Net Maliyet** | ~$2.00 |
| **Max Risk** | $32.00 (fiyat $530'a düşerse: $560 - $530 = $30 + net maliyet $2) |
| **Max Kar** | Sınırlı (call $600'a kadar, sonra atama) |
| **Downside Protection** | $530 (yaklaşık %5.4 aşağı koruma) |
| **Upside Cap** | $600 (yaklaşık %7.1 yukarı sınır) |
| **Vega** | Karmaşık (put long vega + call short vega = net nötr-negatif) |
| **Theta** | Karmaşık (put short theta + call short theta = net negatif) |
| **Kar Hedefi** | Hisse $560-$600 aralığında kalırsa net maliyet $2'yi geri kazanır |

> **Koruma Gerekçesi:** TMO long pozisyonu olan yatırımcılar için Protective Collar, aşağı yönlü riski sınırlar ($530 koruma) ve maliyeti short call kredisi ile düşürür. Net maliyet $2.00 çok düşük — "ucuz sigorta". Eğer TMO earnings'te patlarsa, upside $600 ile sınırlı (call atama). Eğer TMO düşerse, $530 put zararı sınırlar. Not: Call atama riski — hisse $600 üzerine çıkarsa long hisse elden çıkar.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | ⛔ Uygun strateji bulunamadı (fiyat çok yüksek) |
| $50-$200 | ⛔ Uygun strateji bulunamadı (minimum spread >$200) |
| $200-$500 | Bear Call Spread ($585C/$615C) 1 kontrat | ~$250 | ~$850 | 1:3.4 |
| $200-$500 | Long Put Spread ($550P/$520P) 1 kontrat | ~$300 | ~$2,700 | 1:9.0 |

> **Bütçe Uyarısı:** TMO fiyatı ~$560 ile yüksek. 1 kontrat = $56,000 nominal değer. Spread stratejileri $200+ maliyet. Bütçe dostu strateji sınırlı. Alternatif: Micro-options (10 hisse) varsa değerlendir.

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **16-17 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%38), CPR analizi (0.85 ayı) |
| **18-19 Temmuz** | Entry | Pozisyon aç (30-45 DTE) |
| **22 Temmuz** | Earnings Günü | TMO açıklama — pozisyonu TUT |
| **23 Temmuz** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **25-28 Temmuz** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |
| **29 Temmuz** | FOMC | TMO pozisyonu kapanmış olmalı |

> **⚠️ Risk Uyarıları:**
> 1. TMO fiyatı ~$560 yüksek — 1 kontrat margin gereksinimi ~$2,150. Küçük hesaplar için uygun değil.
> 2. IV Rank %38 düşük — short premium stratejileri sınırlı kazanç sunar.
> 3. TMO CPR 0.85/0.90 hafif ayı — ancak 50MA/200MA üzerinde teknik pozitif. Çelişkili sinyal.
> 4. Laboratuvar hizmetleri bölümünde COVID-19 test gelirlerinde düşüş devam ediyor.
> 5. Biyoteknoloji harcamalarında yavaşlama (faiz oranları yüksek) TMO'yu etkiler.
> 6. Dar wing ($30) stratejilerde hisse %6+ hareket ederse max loss.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

### 7.6 MRK — ~$105 — CPR: 1.05

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 48.00 (Nötr, momentum yok) |
| **50MA** | ~$103 (fiyat üzerinde, kısa vadeli trend hafif pozitif) |
| **200MA** | ~$100 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~19% |
| **IV Rank** | ~32% (Düşük — long spread tercih) |
| **Hacim CPR** | 1.05 (Hafif boğa — call hacmi put hacminden hafif yüksek) |
| **OI CPR** | ~1.00 (Nötr — açık pozisyonlar dengeli) |
| **YTD** | N/A |
| **Earnings** | 31 Temmuz BMO |
| **Beta** | ~0.3 |
| **Son 8Q Ort. Earnings Hareketi** | ±2.8% |
| **Implied Move (EM)** | ~±3.2% (~$3.36) |
| **Sektör** | İlaç (Big Pharma) |
| **Dividend Yield** | ~2.8% |
| **FOMC Çakışması** | FOMC sonrası (29 Temmuz) — temiz dönem! |

#### Strateji 1: Long Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $105 (ATM) |
| **Sell Call** | $115 (OTM, wing $10) |
| **Maliyet** | ~$2.80 |
| **Max Risk** | $2.80 (ödenen prim) |
| **Max Kar** | $7.20 (Wing $10 - Maliyet $2.80) |
| **ROI** | ~257% |
| **Breakeven** | $107.80 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.06) |
| **Theta** | Negatif (~-$0.02/gün) |
| **Kar Hedefi** | %50 kar = hisse $111.40; %100 kar = hisse $115 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $1.40 zararda kapat |
| **Hedge Kullanımı** | MRK long pozisyonu olanlar için upside leverage |

> **Strateji Gerekçesi:** MRK hafif boğa CPR (1.05) ve IV Rank %32 (düşük) ile long call spread için uygun aday. IV çok düşük (%19) — opsiyon primleri çok ucuz. Eğer MRK earnings'te beat açıklarsa (Keytruda satışları, yeni pipeline güncellemeleri), call spread kaldıraçlı kar sağlar. MRK 31 Temmuz'da earnings açıklayacak — FOMC (29 Temmuz) sonrası, temiz dönem. 50MA (~$103) ve 200MA (~$100) üzerinde — teknik görünüm pozitif. Wing $10 = fiyatın ~%9.5'i, EM (~%3.2) dışında güvenli bölge. MRK Beta ~0.3 çok düşük — sınırlı hareket beklenir. Dividend yield %2.8 ile temettü değeri yüksek.

#### Strateji 2: Bull Put Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $100 (OTM, ~%4.8 altında) |
| **Buy Put** | $92 (daha OTM, wing $8) |
| **Kredi** | ~$1.20 |
| **Max Risk** | $6.80 (Wing $8 - Kredi $1.20) |
| **Max Kar** | $1.20 (toplanan kredi) |
| **ROI** | ~18% |
| **Breakeven** | $98.80 |
| **Delta Hedefi** | +0.15 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.04) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.02/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.60 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $2.40 zararda kapat |
| **PoP** | ~65% |
| **Atama Riski** | Hisse $100 altında kapanırsa 100 hisse alım zorunluluğu |

> **Alternatif Gerekçesi:** Bull Put Spread, MRK'nin güçlü temettü değeri (%2.8) ve düşük beta (0.3) ile "sakin" karakterini destekler. Hisse $100 altına düşmezse (200MA ~$100 yakınında), kredi $1.20 kar kalır. Eğer MRK earnings'te düşerse, $92 put koruma sağlar. Atama riski: hisse $100 altına düşerse, 100 hisse $100'den alınır. Dividend yield %2.8 ile uzun vadeli hold değeri yüksek. Not: IV Rank %32 düşük — short premium sınırlı kazanç.

#### Strateji 3: Call Calendar Spread (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Calendar / Time Spread (Karmaşık Greeks) |
| **Sell** | 1 haftalık $105 Call (front month) |
| **Buy** | 3 haftalık $105 Call (back month) |
| **Maliyet** | ~$1.50 |
| **Max Risk** | $1.50 (ödenen prim) |
| **Max Kar** | ~$3.00 (theta decay farkından) |
| **ROI** | ~200% |
| **Breakeven** | ~$102 / ~$108 (yaklaşık) |
| **Delta** | +0.10 ile +0.20 (hafif boğa) |
| **Vega** | Pozitif (back month daha fazla Vega) |
| **Theta** | Pozitif (front month theta decay > back month) |
| **Kar Hedefi** | %50 kar = ~$0.75; hisse $105 yakınında kalırsa max kar |
| **Hedge Kullanımı** | MRK long pozisyonu olanlar için theta decay geliri |

> **Koruma/Hedge Gerekçesi:** Call Calendar Spread, MRK'nin düşük IV (%19) ve sınırlı hareket (±%2.8) karakterine uygun. Earnings öncesi front month IV şişer, earnings sonrası çöker — front month satıcısı kazanır. Back month (3 haftalık) theta decay farkından kar. MRK sınırlı hareket ile $105 yakınında kalma olasılığı yüksek. Maliyet $1.50 çok düşük — 5 kontrat = $75 maliyet, $150 max kar. Risk: Hisse $108 üzerine veya $102 altına çıkarsa zarar.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$115 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$92 (Lottery) | ~$8 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($105C/$115C) 3 kontrat | ~$420 | ~$1,080 | 1:2.6 |
| $50-$200 | Bull Put Spread ($100P/$92P) 3 kontrat | ~$360 | ~$360 | 1:1.0 |
| $200-$500 | Long Call Butterfly ($102C/$105C/$108C) 5 kontrat | ~$375 | ~$875 | 1:2.3 |
| $200-$500 | Call Calendar ($105C, 1W/3W) 4 kontrat | ~$300 | ~$600 | 1:2.0 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **25-26 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%32 — düşük), Beta kontrolü (~0.3) |
| **27-28 Temmuz** | Entry | Pozisyon aç (30-45 DTE) |
| **29 Temmuz** | FOMC | MRK pozisyonu açık — FOMC sonrası volatilite etkileyebilir (dikkatli izle) |
| **31 Temmuz** | Earnings Günü | MRK BMO açıklama — pozisyonu TUT |
| **1 Ağustos** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **4-7 Ağustos** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |

> **⚠️ Risk Uyarıları:**
> 1. MRK IV Rank %32 çok düşük — short premium stratejileri sınırlı kazanç sunar.
> 2. MRK Beta ~0.3 çok düşük — upside potansiyeli sınırlı. Call spread karı sınırlı kalabilir.
> 3. Keytruda patent süresinin dolması (2028) yaklaşıyor — piyasa endişeleri başlayabilir.
> 4. İlaç fiyatlandırma baskısı (IRA, Medicare müzakereleri) earnings etkileyebilir.
> 5. FOMC 29 Temmuz — MRK earnings 31 Temmuz'da. FOMC sonrası volatilite taşıyabilir.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

## 8. ENERJİ HİSSELERİ STRATEJİLERİ

> **Enerji Sektörü Makro Analizi:**
> Temmuz 2026'da 2 enerji devi (XOM, CVX) 31 Temmuz BMO'da earnings açıklayacak. Petrol fiyatları $89-91 aralığında — enerji sektörüne pozitif. Enerji sektörü EN YÜKSEK IV crush potansiyelini sunuyor (%30-40) — short premium stratejileri için ideal. XOM CPR 2.50 ile güçlü boğa beklentisi var. CVX CPR ~1.50 ile hafif boğa. Enerji sektörü yüksek beta (0.8-0.9) ile piyasaya paralel hareket eder. FOMC 29 Temmuz — enerji hisseleri 31 Temmuz'da, FOMC sonrası temiz dönem. Ancak FOMC sonrası volatilite taşıyabilir. Sektör riskleri: (1) Petrol fiyatlarında ani düşüş (OPEC+ kararları), (2) Enerji geçişi (renewable) baskısı, (3) Karbon vergisi/regülasyon riski, (4) Küresel ekonomik yavaşlama talep düşüşü.
>
> **IV Crush Profili:** Yüksek (%30-40). Enerji hisseleri earnings öncesi volatiliteyi şişirir, earnings sonrası hızla çöker. Short straddle/strangle ve Iron Condor için ideal ortam.

### Enerji Sektörü Özet Tablosu

| Hisse | Fiyat | IV30 | IV Rank | Hacim CPR | OI CPR | Beta | YTD% | Earnings |
|-------|-------|------|---------|-----------|--------|------|------|----------|
| **XOM** | $151.75 | ~28% | ~35% | **2.50** | 1.24 | 0.85 | -3.85% | 31 Temmuz BMO |
| **CVX** | ~$155 | ~26% | ~45% | ~1.50 | ~1.20 | 0.90 | N/A | 31 Temmuz BMO |

---

### 8.1 XOM — $151.75 — CPR: 2.50 ⭐ EN YÜKSEK ENERJİ CPR

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 45.20 (Nötr-ayıcak, momentum hafif negatif) |
| **50MA** | $154.30 (fiyat altında, kısa vadeli trend hafif ayı) |
| **200MA** | $148.80 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~28% |
| **IV Rank** | ~35% (Düşük-orta — long spread tercih, short spread sınırda) |
| **Hacim CPR** | **2.50 (Güçlü boğa! Call hacmi put hacminden 2.5 kat fazla)** |
| **OI CPR** | 1.24 (Boğa — açık call pozisyonları put'lardan %24 fazla) |
| **Beta** | 0.85 |
| **YTD** | -3.85% (Sektörde negatif, petrol fiyatlarına duyarlı) |
| **Earnings** | 31 Temmuz BMO |
| **Son 8Q Ort. Earnings Hareketi** | ±4.0% |
| **Implied Move (EM)** | ~±4.5% (~$6.83) |
| **Sektör** | Entegre Petrol & Gaz |
| **FOMC Çakışması** | FOMC sonrası (29 Temmuz) — temiz dönem ama FOMC volatilitesi taşıyabilir |

#### Strateji 1: Bull Put Spread (Ana) ⭐

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $145 (OTM, ~%4.4 altında) |
| **Buy Put** | $135 (daha OTM, wing $10) |
| **Kredi** | ~$2.80 |
| **Max Risk** | $7.20 (Wing $10 - Kredi $2.80) |
| **Max Kar** | $2.80 (toplanan kredi) |
| **ROI** | ~39% |
| **Breakeven** | $142.20 |
| **Delta Hedefi** | +0.15 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.12) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.05/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.40 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $5.60 zararda kapat |
| **PoP** | ~62% |
| **Atama Riski** | Hisse $145 altında kapanırsa 100 hisse alım zorunluluğu |

> **⭐ Strateji Gerekçesi:** XOM CPR 2.50 ile enerji sektörünün en güçlü boğa sinyalini veriyor. Call hacmi put hacminden 2.5 kat fazla — piyasa güçlü bullish beklenti içinde. Ancak YTD -3.85% negatif — bu "catch-up trade" potansiyeli taşır. 50MA ($154.30) altında ama 200MA ($148.80) üzerinde — kararsız bölgede. Bull Put Spread, hissenin $145 üzerinde kalmasına bahis oynar. 200MA ($148.80) yakınında — uzun vadeli destek. Enerji sektörü EN yüksek IV crush (%30-40) — short premium kazançlı. FOMC 29 Temmuz sonrası — 31 Temmuz earnings, temiz dönem. Petrol fiyatları $89-91 aralığında — XOM için pozitif. Not: FOMC sonrası volatilite taşıyabilir — pozisyonu 29 Temmuz sonrası açmayı düşün.

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $150 (hafif ITM/ATM) |
| **Sell Call** | $160 (OTM, wing $10) |
| **Maliyet** | ~$4.50 |
| **Max Risk** | $4.50 (ödenen prim) |
| **Max Kar** | $5.50 (Wing $10 - Maliyet $4.50) |
| **ROI** | ~122% |
| **Breakeven** | $154.50 |
| **Delta** | +0.50 ile +0.60 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.15) |
| **Theta** | Negatif (~-$0.05/gün) |
| **Kar Hedefi** | %50 kar = hisse $157.25; %100 kar = hisse $160 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $2.25 zararda kapat |
| **Hedge Kullanımı** | XOM long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer XOM earnings'te beat açıklarsa (yukarı yönlü üretim rehberliği, düşük maliyet yapısı), call spread kaldıraçlı kar sağlar. CPR 2.50 güçlü boğa momentumunu destekler. Ancak IV crush riski var — pozisyonu earnings'ten 1-2 gün önce aç, earnings sonrası hemen değerlendir. Not: XOM YTD -3.85% negatif — upside potansiyeli var ama "value trap" riski de taşır.

#### Strateji 3: Short Strangle (Koruma/Hedge — Deneyimli)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Nötr Delta) |
| **Sell Call** | $165 (OTM, ~%8.7 üzerinde) |
| **Sell Put** | $140 (OTM, ~%7.7 altında) |
| **Kredi** | ~$3.50 |
| **Max Risk** | Sınırsız (yukarı) / büyük (aşağı, hisse $0'a düşerse) |
| **Max Kar** | $3.50 (toplanan kredi) |
| **ROI** | ~3.5% (kısa vadeli) |
| **Breakeven'lar** | $168.50 (üst) / $136.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 (nötr) |
| **Vega** | Negatif (~-$0.20) — IV crush'tan maksimum kazanç |
| **Theta** | Pozitif (~$0.10/gün) — maksimum theta decay |
| **Gamma** | Yüksek (kısa vade) — büyük risk |
| **Kar Hedefi** | %25 mekanik exit = ~$0.88 kar (short strangle için düşük hedef) |
| **Stop Loss** | 1.5x kredi = pozisyonu $5.25 zararda kapat |
| **Wing Genişliği** | $25 (geniş — EM %4.5 dışında güvenli bölge) |

> **Koruma/Hedge Gerekçesi:** Short Strangle, IV crush'tan maksimum kazanç sağlayan stratejidir. XOM IV Rank %35 sınırda ama enerji sektörü yüksek crush (%30-40) sunar. OTM strangle $3.50 kredi toplar — hisse $140-$165 aralığında kalırsa kar. Wing $25 geniş — EM (~%4.5) dışında güvenli bölge. Ancak risk YÜKSEK — hisse $168.50 üzerine veya $136.50 altına çıkarsa zarar sınırsız (yukarı) veya büyük (aşağı). Bu strateji SADECE deneyimli traderlar için. Pozisyon büyüklüğü: Hesabın %0.5'inden fazla risk atma. 21 DTE kuralı kesin.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$165 (Lottery) | ~$22 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$135 (Lottery) | ~$15 | Sınırsız | Spekülatif |
| $50-$200 | Bull Put Spread ($145P/$135P) 2 kontrat | ~$280 | ~$720 | 1:2.6 |
| $50-$200 | Long Call Spread ($150C/$160C) 1 kontrat | ~$225 | ~$775 | 1:3.4 |
| $200-$500 | Short Strangle ($165C/$140P) 1 kontrat | ~$350 kredi | $350 | 1:0.1 (ama yüksek PoP) |
| $200-$500 | Long Call Butterfly ($148C/$154C/$160C) 2 kontrat | ~$380 | ~$1,020 | 1:2.7 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **25-26 Temmuz** | Hazırlık | Greeks analizi, petrol fiyatları kontrolü ($89-91), CPR teyidi (2.50) |
| **27-28 Temmuz** | Entry (Long) | Long stratejiler için erken entry (IV artışı bekleniyor) |
| **29-30 Temmuz** | Entry (Short) | FOMC sonrası volatilite dinince short stratejiler aç |
| **31 Temmuz** | Earnings Günü | XOM BMO açıklama — pozisyonu TUT |
| **1 Ağustos** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **4-7 Ağustos** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |

> **⚠️ Risk Uyarıları:**
> 1. XOM YTD -3.85% negatif — "catch-up" veya "lagging weakness" olabilir. Dikkatli olun.
> 2. FOMC 29 Temmuz — XOM earnings 31 Temmuz'da. FOMC sonrası volatilite taşıyabilir.
> 3. Petrol fiyatları $89-91 aralığında — ani düşüş (OPEC+ kararı) XOM'u baskılar.
> 4. Short Strangle ÇOK RİSKLİ — sınırsız yukarı risk. Sadece deneyimli traderlar.
> 5. XOM 50MA ($154.30) altında — kısa vadeli momentum negatif. CPR 2.50 ile çelişki.
> 6. Enerji geçişi (renewable) baskısı uzun vadeli risk — kısa vadeli earnings etkileyebilir.
> 7. Pozisyon büyüklüğü: IC/Bull Put için %1-2, Short Strangle için %0.5'den fazla risk atma.

---

### 8.2 CVX — ~$155 — CPR: ~1.50

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 55.00 (Nötr-boğa, momentum dengeli) |
| **50MA** | ~$152 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | ~$148 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~26% |
| **IV Rank** | ~45% (Orta — IC sınırda, spread stratejileri uygun) |
| **Hacim CPR** | ~1.50 (Boğa — call hacmi put hacminden %50 yüksek) |
| **OI CPR** | ~1.20 (Boğa — açık call pozisyonları put'lardan %20 fazla) |
| **Beta** | 0.90 |
| **YTD** | N/A |
| **Earnings** | 31 Temmuz BMO |
| **Son 8Q Ort. Earnings Hareketi** | ±3.8% |
| **Implied Move (EM)** | ~±4.2% (~$6.51) |
| **Sektör** | Entegre Petrol & Gaz |
| **FOMC Çakışması** | FOMC sonrası (29 Temmuz) — temiz dönem ama FOMC volatilitesi taşıyabilir |
| **Dividend Yield** | ~4.0% |

#### Strateji 1: Bull Put Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $148 (OTM, ~%4.5 altında) |
| **Buy Put** | $138 (daha OTM, wing $10) |
| **Kredi** | ~$2.50 |
| **Max Risk** | $7.50 (Wing $10 - Kredi $2.50) |
| **Max Kar** | $2.50 (toplanan kredi) |
| **ROI** | ~33% |
| **Breakeven** | $145.50 |
| **Delta Hedefi** | +0.15 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.10) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.04/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $5.00 zararda kapat |
| **PoP** | ~60% |
| **Atama Riski** | Hisse $148 altında kapanırsa 100 hisse alım zorunluluğu |

> **Strateji Gerekçesi:** CVX CPR ~1.50 ile hafif boğa — piyasa bullish beklenti içinde. IV Rank %45 sınırda — Bull Put Spread prim toplama makul. CVX 31 Temmuz'da earnings açıklayacak — XOM ile aynı gün, aynı sektör. Bu, "sektör etkisi" riski taşır: XOM kötü sonuç verirse CVX de baskılanabilir. 50MA (~$152) ve 200MA (~$148) üzerinde — teknik görünüm pozitif. Dividend yield %4.0 ile yüksek temettü — atama riski olsa bile uzun vadeli hold değeri yüksek. Enerji sektörü yüksek IV crush (%30-40) — short premium kazançlı. FOMC sonrası (29 Temmuz) — temiz dönem. Not: XOM ile aynı gün earnings — pozisyonları birlikte yönet.

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $155 (ATM) |
| **Sell Call** | $165 (OTM, wing $10) |
| **Maliyet** | ~$4.00 |
| **Max Risk** | $4.00 (ödenen prim) |
| **Max Kar** | $6.00 (Wing $10 - Maliyet $4) |
| **ROI** | ~150% |
| **Breakeven** | $159 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.12) |
| **Theta** | Negatif (~-$0.04/gün) |
| **Kar Hedefi** | %50 kar = hisse $162; %100 kar = hisse $165 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $2 zararda kapat |
| **Hedge Kullanımı** | CVX long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer CVX earnings'te beat açıklarsa (Permian üretimi, downstream marjları), call spread kaldıraçlı kar sağlar. CPR ~1.50 boğa momentumunu destekler. Ancak IV crush riski var — pozisyonu earnings'ten 1-2 gün önce aç, earnings sonrası hemen değerlendir. Not: CVX Beta 0.90 — piyasaya paralel hareket. FOMC sonrası genel piyasa hareketi CVX'i etkiler.

#### Strateji 3: Iron Condor (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $168C / Buy $178C (Wing $10) |
| **Put Wing** | Sell $142P / Buy $132P (Wing $10) |
| **Kredi** | ~$3.00 |
| **Max Risk** | $7.00 (Wing $10 - Kredi $3) |
| **Max Kar** | $3.00 (toplanan kredi) |
| **ROI** | ~43% |
| **Breakeven'lar** | $171 (üst) / $139 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.15) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.06/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.50 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $6 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = $15.5 (kullanılan $10 = dar wing, agresif) |
| **PoP** | ~58% |

> **Koruma/Hedge Gerekçesi:** Iron Condor, CVX'nin earnings öncesi volatilite şişkinliğinden (IV Rank %45) faydalanır ve crush sonrası prim çöküşünden kazanır. Wing $10 = fiyatın ~%6.5'i, EM (~%4.2) dışında güvenli bölge. CVX 50MA/200MA üzerinde — teknik görünüm pozitif, hisse $142-$168 aralığında kalma olasılığı yüksek. Enerji sektörü yüksek crush (%30-40) — short premium kazançlı. Not: Dar wing ($10) = hisse %7+ hareket ederse max loss. XOM ile aynı gün earnings — sektör volatilitesi artabilir.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$168 (Lottery) | ~$20 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$132 (Lottery) | ~$14 | Sınırsız | Spekülatif |
| $50-$200 | Bull Put Spread ($148P/$138P) 2 kontrat | ~$250 | ~$750 | 1:3.0 |
| $50-$200 | Long Call Spread ($155C/$165C) 1 kontrat | ~$200 | ~$800 | 1:4.0 |
| $200-$500 | Iron Condor ($142P/$132P + $168C/$178C) 2 kontrat | ~$300 | ~$1,400 | 1:4.7 |
| $200-$500 | Long Call Butterfly ($152C/$158C/$164C) 3 kontrat | ~$360 | ~$840 | 1:2.3 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **25-26 Temmuz** | Hazırlık | Greeks analizi, petrol fiyatları kontrolü, XOM ile aynı gün earnings planı |
| **27-28 Temmuz** | Entry (Long) | Long stratejiler için erken entry |
| **29-30 Temmuz** | Entry (Short) | FOMC sonrası volatilite dinince short stratejiler aç |
| **31 Temmuz** | Earnings Günü | CVX BMO açıklama — pozisyonu TUT |
| **1 Ağustos** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **4-7 Ağustos** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |

> **⚠️ Risk Uyarıları:**
> 1. CVX XOM ile aynı gün (31 Temmuz) earnings — sektör etkisi riski. XOM kötü gelirse CVX de baskılanır.
> 2. FOMC 29 Temmuz — CVX earnings 31 Temmuz'da. FOMC sonrası volatilite taşıyabilir.
> 3. Petrol fiyatları $89-91 aralığında — ani düşüş (OPEC+ kararı) CVX'i baskılar.
> 4. IV Rank %45 sınırda — IC prim toplama potansiyeli sınırlı.
> 5. Dar wing ($10) stratejilerde hisse %7+ hareket ederse max loss.
> 6. Enerji geçişi (renewable) baskısı uzun vadeli risk — kısa vadeli earnings etkileyebilir.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

## 9. DİĞER HİSSELER STRATEJİLERİ

> **Diğer Hisseler Makro Analizi:**
> Bu bölümde 8 hisse (V, MA, DIS, BA, NKE, HD, COIN, HOOD) incelenmektedir. Bu hisseler farklı sektörlerden (Ödeme Sistemleri, Eğlence, Havacılık, Perakende, Kripto) geliyor ve earnings tarihleri dağılmış durumda. Ödeme hisseleri (V, MA) düşük beta (0.9-1.0) ile defansif. Havacılık (BA) yüksek IV (%32) ve yüksek IV Rank (%65) ile agresif stratejiler için uygun. Perakende (NKE, HD) tüketici harcamalarına duyarlı. Kripto (COIN, HOOD) yüksek volatilite ve yüksek beta ile spekülatif stratejiler için ideal.
>
> **Earnings Tarihleri Dağılımı:**
> - Erken: NKE (30 Haziran — açıkladı, Temmuz takviminde değil)
> - Orta: V (28 Temmuz AMC), BA (28 Temmuz-3 Ağustos arası)
> - Geç: MA (30 Temmuz BMO), DIS (Ağustos olası), HD (Ağustos olası)
> - Belirsiz: COIN, HOOD (kripto hisseleri earnings tarihleri değişken)
>
> **FOMC Çakışması:** V (28 Temmuz AMC) FOMC (29 Temmuz) öncesi — yarım pozisyon. MA (30 Temmuz) FOMC sonrası — temiz.

### Diğer Hisseler Özet Tablosu

| Hisse | Fiyat | IV30 | IV Rank | Hacim CPR | OI CPR | Beta | YTD% | Earnings |
|-------|-------|------|---------|-----------|--------|------|------|----------|
| **V** | $319.67 | ~24% | ~38% | ~0.92 | ~0.95 | 0.95 | +12.80% | 28 Temmuz AMC |
| **MA** | $485.67 | ~22% | ~40% | 0.88 | ~0.90 | 1.00 | +14.65% | 30 Temmuz BMO |
| **DIS** | $99.71 | ~26% | ~38% | 0.78 | ~0.80 | 1.20 | +5.42% | Ağustos (olası) |
| **BA** | $215.92 | ~32% | **65%** | 0.82 | ~0.85 | 1.50 | +0.55% | 28 Temmuz-3 Ağustos |
| **NKE** | $43.06 | ~28% | ~45% | 0.72 | ~0.75 | 0.90 | **-31.20%** | 30 Haziran (açıkladı) |
| **HD** | $310.78 | ~24% | ~32% | ~0.98 | ~1.08 | 1.10 | +8.40% | Ağustos (olası) |
| **COIN** | ~$220 | ~55% | ~60% | ~1.50 | ~1.40 | 2.50 | N/A | Belirsiz |
| **HOOD** | ~$45 | ~50% | ~55% | ~1.80 | ~1.60 | 2.20 | N/A | Belirsiz |

---

### 9.1 V (Visa) — $319.67 — CPR: ~0.92

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 46.80 (Nötr-ayıcak, momentum hafif negatif) |
| **50MA** | $328.40 (fiyat altında, kısa vadeli trend hafif ayı) |
| **200MA** | $335.60 (fiyat altında, uzun vadeli trend hafif ayı) |
| **IV30** | ~24% |
| **IV Rank** | ~38% (Düşük — long spread tercih) |
| **Hacim CPR** | ~0.92 (Nötr-ayıcak — put hacmi call hacminden hafif yüksek) |
| **OI CPR** | ~0.95 (Nötr-ayıcak — açık put pozisyonları call'lardan hafif fazla) |
| **Beta** | 0.95 |
| **YTD** | +12.80% (Sektör ortalaması) |
| **Earnings** | 28 Temmuz AMC (After Market Close) |
| **Son 8Q Ort. Earnings Hareketi** | ±3.5% |
| **Implied Move (EM)** | ~±4.0% (~$12.79) |
| **Sektör** | Ödeme Sistemleri & Finansal Teknoloji |
| **FOMC Çakışması** | FOMC öncesi (29 Temmuz) — YARI POZİSYON! |

#### Strateji 1: Iron Condor (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $335C / Buy $350C (Wing $15) |
| **Put Wing** | Sell $305P / Buy $290P (Wing $15) |
| **Kredi** | ~$5.50 |
| **Max Risk** | $9.50 (Wing $15 - Kredi $5.50) |
| **Max Kar** | $5.50 (toplanan kredi) |
| **ROI** | ~58% |
| **Breakeven'lar** | $340.50 (üst) / $299.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.18) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.08/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$2.75 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $11 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$32 (kullanılan $15 = dar wing, agresif) |
| **PoP** | ~58% |

> **Strateji Gerekçesi:** V IV Rank %38 sınırda ama ödeme sektörü düşük crush (%20-25) sunar. Iron Condor, V'nin earnings öncesi volatilite şişkinliğinden faydalanır. V 50MA ($328.40) ve 200MA ($335.60) altında — teknik görünüm hafif ayı. CPR ~0.92/0.95 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. Wing $15 = fiyatın ~%4.7'si, EM (~%4.0) dışında sınırda güvenli bölge. **RİSK:** FOMC 29 Temmuz — V earnings 28 Temmuz AMC'de. Yarım pozisyon (normal boyutun %50'si) önerilir. Ertesi gün FOMC volatilitesi pozisyonu etkileyebilir. V Beta 0.95 — piyasaya paralel hareket. FOMC günü genel piyasa hareketi V'yi etkiler.

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $320 (hafif ITM/ATM) |
| **Sell Call** | $335 (OTM, wing $15) |
| **Maliyet** | ~$6.50 |
| **Max Risk** | $6.50 (ödenen prim) |
| **Max Kar** | $8.50 (Wing $15 - Maliyet $6.50) |
| **ROI** | ~131% |
| **Breakeven** | $326.50 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.20) |
| **Theta** | Negatif (~-$0.07/gün) |
| **Kar Hedefi** | %50 kar = hisse $330.75; %100 kar = hisse $335 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $3.25 zararda kapat |
| **Hedge Kullanımı** | V long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer V earnings'te beat açıklarsa (işlem hacmi büyümesi, cross-border ödemeler), call spread kaldıraçlı kar sağlar. V YTD +12.80 ile güçlü performans gösteriyor. Ancak 50MA/200MA altında — upside potansiyeli sınırlı olabilir. IV crush riski var — pozisyonu earnings'ten 1-2 gün önce aç, earnings sonrası hemen değerlendir. Not: FOMC 29 Temmuz yakınlığı — yarım pozisyon.

#### Strateji 3: Protective Put (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Long Put (Long Vega, Short Delta) |
| **Buy Put** | $310 (OTM koruma) |
| **Maliyet** | ~$3.50 |
| **Max Risk** | $3.50 (ödenen prim) |
| **Max Kar** | Sınırsız (hisse $0'a düşerse) |
| **Breakeven** | $306.50 |
| **Downside Protection** | $310 (yaklaşık %3.0 aşağı koruma) |
| **Delta** | -0.30 ile -0.40 (ayı yönlü) |
| **Vega** | Pozitif (~+$0.15) |
| **Theta** | Negatif (~-$0.05/gün) |
| **Kar Hedefi** | %100 kar = hisse $306.50 altında; %50 kar = hisse $308.25 altında |
| **Hedge Kullanımı** | V long pozisyonu olanlar için FOMC öncesi koruma |

> **Koruma Gerekçesi:** V long pozisyonu olan yatırımcılar için Protective Put, FOMC (29 Temmuz) öncesi aşağı yönlü riski sınırlar. Maliyet $3.50 ile %1.1'lik bir "sigorta primi" ödenir. V 50MA/200MA altında — teknik görünüm hafif ayı, aşağı riski var. Eğer V earnings'te beklenenden kötü sonuçlar açıklarsa (işlem hacmi yavaşlama, rekabet baskısı), put kar sağlar ve long hisse zararını telafi eder. FOMC volatilitesi de korunur. Not: IV crush put'a zarar verir — pozisyonu 26-27 Temmuz'da aç, 29 Temmuz FOMC sonrası kapat.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$350 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$290 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($320C/$335C) 1 kontrat | ~$325 | ~$850 | 1:2.6 |
| $50-$200 | Iron Condor ($305P/$290P + $335C/$350C) 1 kontrat | ~$275 | ~$950 | 1:3.5 |
| $200-$500 | Long Call Butterfly ($315C/$325C/$335C) 2 kontrat | ~$380 | ~$1,120 | 1:2.9 |
| $200-$500 | Protective Put ($310P) 1 kontrat + Short Call ($340C) 1 kontrat | ~$320 | Karmaşık | Collar |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **23-24 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%38), FOMC risk değerlendirmesi |
| **25-26 Temmuz** | Entry (Yarım Pozisyon) | Normal boyutun %50'si ile pozisyon aç (FOMC yakın) |
| **27 Temmuz** | Son Entry | Son giriş fırsatı (30-45 DTE) |
| **28 Temmuz** | Earnings Günü | V AMC açıklama — pozisyonu TUT, panik YOK |
| **29 Temmuz** | 🚨 FOMC Günü | Pozisyonu yakından izle, volatilite artışı olabilir |
| **30 Temmuz** | Yönetim | FOMC sonrası değerlendirme, %50 kar varsa kapat |
| **1-4 Ağustos** | Çıkış | Kalan pozisyonu kapat (21 DTE kuralı) |

> **⚠️ Risk Uyarıları:**
> 1. V 50MA ($328.40) ve 200MA ($335.60) altında — teknik görünüm hafif ayı. Upside potansiyeli sınırlı.
> 2. FOMC 29 Temmuz — V earnings 28 Temmuz AMC'de. Yarım pozisyon şart. FOMC öncesi volatilite artışı riski.
> 3. Ödeme sektörü rekabeti (Mastercard, Amex, fintech) pazar payı baskısı yapabilir.
> 4. Küresel ekonomik yavaşlama işlem hacimlerini düşürür — V earnings etkileyebilir.
> 5. Dar wing ($15) stratejilerde hisse %5+ hareket ederse max loss.
> 6. Pozisyon büyüklüğü: FOMC yakınlığı nedeniyle normal boyutun %50'si. Hesabın %0.5-1'inden fazla risk atma.

---

### 9.2 MA (Mastercard) — $485.67 — CPR: 0.88

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 47.30 (Nötr-ayıcak, momentum hafif negatif) |
| **50MA** | $498.20 (fiyat altında, kısa vadeli trend hafif ayı) |
| **200MA** | $510.40 (fiyat altında, uzun vadeli trend hafif ayı) |
| **IV30** | ~22% |
| **IV Rank** | ~40% (Düşük-orta — spread stratejileri sınırda) |
| **Hacim CPR** | 0.88 (Nötr-ayıcak — put hacmi call hacminden hafif yüksek) |
| **OI CPR** | ~0.90 (Nötr-ayıcak — açık put pozisyonları call'lardan hafif fazla) |
| **Beta** | 1.00 |
| **YTD** | +14.65% (V'den daha güçlü performans) |
| **Earnings** | 30 Temmuz BMO |
| **Son 8Q Ort. Earnings Hareketi** | ±3.8% |
| **Implied Move (EM)** | ~±4.2% (~$20.40) |
| **Sektör** | Ödeme Sistemleri & Finansal Teknoloji |
| **FOMC Çakışması** | FOMC sonrası (29 Temmuz) — temiz dönem! |

#### Strateji 1: Iron Condor (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $510C / Buy $530C (Wing $20) |
| **Put Wing** | Sell $460P / Buy $440P (Wing $20) |
| **Kredi** | ~$8.50 |
| **Max Risk** | $11.50 (Wing $20 - Kredi $8.50) |
| **Max Kar** | $8.50 (toplanan kredi) |
| **ROI** | ~74% |
| **Breakeven'lar** | $518.50 (üst) / $451.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.25) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.12/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$4.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $17 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$49 (kullanılan $20 = dar wing, agresif) |
| **PoP** | ~56% |

> **Strateji Gerekçesi:** MA IV Rank %40 sınırda — Iron Condor prim toplama makul. MA 50MA ($498.20) ve 200MA ($510.40) altında — teknik görünüm hafif ayı. CPR 0.88/0.90 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. Wing $20 = fiyatın ~%4.1'i, EM (~%4.2) dışında sınırda güvenli bölge. MA 30 Temmuz'da earnings açıklayacak — FOMC (29 Temmuz) sonrası, temiz dönem. V (28 Temmuz) earnings sonuçları MA için "leading indicator" olabilir. YTD +14.65 V'den (+12.80) daha güçlü — "relative strength" var. Not: Yüksek fiyat ($485.67) = yüksek margin gereksinimi. Pozisyonu küçük tut.

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $485 (ATM) |
| **Sell Call** | $510 (OTM, wing $25) |
| **Maliyet** | ~$10.00 |
| **Max Risk** | $10.00 (ödenen prim) |
| **Max Kar** | $15.00 (Wing $25 - Maliyet $10) |
| **ROI** | ~150% |
| **Breakeven** | $495 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.22) |
| **Theta** | Negatif (~-$0.08/gün) |
| **Kar Hedefi** | %50 kar = hisse $502.50; %100 kar = hisse $510 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $5 zararda kapat |
| **Hedge Kullanımı** | MA long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer MA earnings'te beat açıklarsa (işlem hacmi büyümesi, yeni anlaşmalar), call spread kaldıraçlı kar sağlar. MA YTD +14.65 ile güçlü performans gösteriyor. Ancak 50MA/200MA altında — upside potansiyeli sınırlı olabilir. IV crush riski var — pozisyonu earnings'ten 1-2 gün önce aç, earnings sonrası hemen değerlendir. Not: V (28 Temmuz) earnings sonuçları MA için ipucu — V güçlüyse MA de güçlü olabilir.

#### Strateji 3: Bear Call Spread (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $510 (OTM, ~%5.0 üzerinde) |
| **Buy Call** | $530 (daha OTM, wing $20) |
| **Kredi** | ~$5.50 |
| **Max Risk** | $14.50 (Wing $20 - Kredi $5.50) |
| **Max Kar** | $5.50 (toplanan kredi) |
| **ROI** | ~38% |
| **Breakeven** | $515.50 |
| **Delta Hedefi** | -0.10 ile -0.15 arası (ayı yönlü) |
| **Vega** | Negatif (~-$0.15) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.07/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$2.75 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $11 zararda kapat |
| **PoP** | ~60% |

> **Koruma Gerekçesi:** MA 50MA ($498.20) ve 200MA ($510.40) altında — teknik görünüm hafif ayı. Bear Call Spread, hissenin $510 üzerine çıkmamasına bahis oynar. 200MA ($510.40) yakınında — uzun vadeli direnç. Eğer MA earnings'te zayıf sonuçlar açıklarsa (işlem hacmi yavaşlama), call spread kar sağlar. IV crush potansiyeli %20-25 — short premium kazançlı. Not: MA YTD +14.65 güçlü — "mean reversion" riski (kâr realizasyonu).

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | ⛔ Uygun strateji bulunamadı (fiyat çok yüksek) |
| $50-$200 | ⛔ Uygun strateji bulunamadı (minimum spread >$200) |
| $200-$500 | Iron Condor ($460P/$440P + $510C/$530C) 1 kontrat | ~$350 | ~$1,150 | 1:3.3 |
| $200-$500 | Bear Call Spread ($510C/$530C) 1 kontrat | ~$275 | ~$1,450 | 1:5.3 |

> **Bütçe Uyarısı:** MA fiyatı $485.67 ile yüksek. 1 kontrat = $48,567 nominal değer. Spread stratejileri $200+ maliyet. Bütçe dostu strateji sınırlı. Alternatif: Micro-options (10 hisse) varsa değerlendir.

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **25-26 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%40), V earnings sonuçlarını izle (28 Temmuz) |
| **27-28 Temmuz** | Entry | Pozisyon aç (30-45 DTE) |
| **28 Temmuz** | Gözlem | V AMC earnings sonuçlarını izle — MA için ipucu |
| **30 Temmuz** | Earnings Günü | MA BMO açıklama — pozisyonu TUT |
| **31 Temmuz** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **2-5 Ağustos** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |

> **⚠️ Risk Uyarıları:**
> 1. MA fiyatı $485.67 yüksek — 1 kontrat margin gereksinimi ~$1,150. Küçük hesaplar için uygun değil.
> 2. MA 50MA/200MA altında — teknik görünüm hafif ayı. Upside potansiyeli sınırlı.
> 3. V (28 Temmuz) earnings sonuçları MA için "leading indicator" — V kötü gelirse MA da baskılanabilir.
> 4. Ödeme sektörü rekabeti (Visa, Amex, fintech) pazar payı baskısı yapabilir.
> 5. Dar wing ($20) stratejilerde hisse %5+ hareket ederse max loss.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

### 9.3 DIS (Disney) — $99.71 — CPR: 0.78

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 51.20 (Nötr, momentum yok) |
| **50MA** | $98.50 (fiyat üzerinde, kısa vadeli trend hafif pozitif) |
| **200MA** | $105.30 (fiyat altında, uzun vadeli trend hafif ayı) |
| **IV30** | ~26% |
| **IV Rank** | ~38% (Düşük — long spread tercih) |
| **Hacim CPR** | 0.78 (Hafif ayı — put hacmi call hacminden hafif yüksek) |
| **OI CPR** | ~0.80 (Hafif ayı — açık put pozisyonları call'lardan hafif fazla) |
| **Beta** | 1.20 |
| **YTD** | +5.42% (Sektör ortalamasının altında) |
| **Earnings** | Ağustos (olası — net tarih yok!) |
| **Son 8Q Ort. Earnings Hareketi** | ±4.5% |
| **Implied Move (EM)** | ~±5.0% (~$4.99) |
| **Sektör** | Eğlence & Medya (Streaming, Parklar, Stüdyo) |
| **FOMC Çakışması** | Belirsiz — Ağustos earnings FOMC'den uzak |

#### Strateji 1: Bear Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $105 (OTM, ~%5.3 üzerinde) |
| **Buy Call** | $115 (daha OTM, wing $10) |
| **Kredi** | ~$2.50 |
| **Max Risk** | $7.50 (Wing $10 - Kredi $2.50) |
| **Max Kar** | $2.50 (toplanan kredi) |
| **ROI** | ~33% |
| **Breakeven** | $107.50 |
| **Delta Hedefi** | -0.12 ile -0.18 arası (ayı yönlü) |
| **Vega** | Negatif (~-$0.08) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.04/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $5 zararda kapat |
| **PoP** | ~58% |

> **Strateji Gerekçesi:** DIS CPR 0.78/0.80 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. 200MA ($105.30) altında — uzun vadeli trend hafif ayı. 50MA ($98.50) üzerinde — kısa vadeli destek. DIS "range-bound" hisse — $98-$105 aralığında sıkışmış. Bear Call Spread, hissenin $105 üzerine çıkmamasına bahis oynar. 200MA ($105.30) direnci yakınında — teknik direnç. Streaming (Disney+) karlılık baskısı, park gelirlerinde yavaşlama earnings riski. Not: DIS earnings tarihi net değil — Ağustos'a sarkma riski var. Stratejiyi güncel takvime göre ayarla. Eğer Temmuz'da earnings yoksa, stratejiyi Ağustos'a ertele.

#### Strateji 2: Long Put Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Short Delta) |
| **Buy Put** | $100 (hafif ITM/ATM) |
| **Sell Put** | $90 (OTM, wing $10) |
| **Maliyet** | ~$3.50 |
| **Max Risk** | $3.50 (ödenen prim) |
| **Max Kar** | $6.50 (Wing $10 - Maliyet $3.50) |
| **ROI** | ~186% |
| **Breakeven** | $96.50 |
| **Delta** | -0.40 ile -0.50 (ayı yönlü) |
| **Vega** | Pozitif (~+$0.10) |
| **Theta** | Negatif (~-$0.04/gün) |
| **Kar Hedefi** | %50 kar = hisse $93.25; %100 kar = hisse $90 altında |
| **Stop Loss** | %50 prim kaybı = pozisyonu $1.75 zararda kapat |
| **Hedge Kullanımı** | DIS long pozisyonu olanlar için koruma |

> **Alternatif Gerekçesi:** Eğer DIS earnings'te zayıf sonuçlar açıklarsa (streaming kayıpları, park gelirlerinde düşüş, stüdyo performansı zayıflığı), put spread kaldıraçlı kar sağlar. CPR 0.78/0.80 ayı bias destekler. 200MA ($105.30) altında — aşağı yönlü hareket olasılığı yüksek. Ancak IV crush riski var — pozisyonu earnings'ten 2-3 gün önce aç, earnings sonrası hemen değerlendir. Not: DIS Beta 1.20 — piyasadan daha volatil. Genel piyasa hareketi DIS'i sert etkiler.

#### Strateji 3: Long Straddle (Koruma/Hedge — Yüksek Risk)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit (Long Vega, Nötr Delta) |
| **Buy Call** | $100 (ATM) |
| **Buy Put** | $100 (ATM) |
| **Maliyet** | ~$8.00 |
| **Max Risk** | $8.00 (ödenen prim) |
| **Max Kar** | Sınırsız (her iki yönde) |
| **Breakeven'lar** | $108 (üst) / $92 (alt) |
| **Delta** | ~0.00 (nötr) |
| **Vega** | Pozitif (~+$0.30) — IV artışından kazanç |
| **Theta** | Negatif (~-$0.15/gün) — zaman zararı |
| **Gamma** | Yüksek (ATM, kısa vade) — büyük hareket gerekli |
| **Kar Hedefi** | %100 kar = hisse $116 veya $84; %50 kar = hisse $112 veya $88 |
| **Hedge Kullanımı** | Bilinmeyen yönlü, büyük hareket beklentisi |

> **Koruma/Hedge Gerekçesi:** Long Straddle, DIS'nin "range-bound" karakterine karşıt bir stratejidir. Eğer DIS earnings'te büyük bir sürpriz açıklarsa (streaming segment satışı, CEO değişimi, büyük M&A), straddle her iki yönde kar sağlar. Maliyet $8.00 yüksek — hisse $92 altına veya $108 üzerine çıkmazsa zarar. Bu strateji SADECE "binary event" beklentisi olanlar için. Not: DIS earnings tarihi net değil — straddle açmadan önce tarihi teyit et. IV crush bu stratejiye ZARAR verir — pozisyonu earnings'ten 1-2 gün önce aç, earnings sonrası hemen kapat.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$115 (Lottery) | ~$15 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$90 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $50-$200 | Bear Call Spread ($105C/$115C) 2 kontrat | ~$250 | ~$750 | 1:3.0 |
| $50-$200 | Long Put Spread ($100P/$90P) 2 kontrat | ~$350 | ~$650 | 1:1.9 |
| $200-$500 | Long Straddle ($100C/$100P) 1 kontrat | ~$400 | Sınırsız | 1:∞ (ama düşük PoP) |
| $200-$500 | Long Put Butterfly ($95P/$100P/$105P) 3 kontrat | ~$315 | ~$585 | 1:1.9 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **Haziran sonu-Temmuz başı** | Teyit | DIS earnings tarihini teyit et — Ağustos'a sarkma riski var |
| **Earnings öncesi 3-4 gün** | Hazırlık | Greeks analizi, IV Rank teyidi (%38), CPR analizi (0.78 ayı) |
| **Earnings öncesi 1-2 gün** | Entry | Pozisyon aç (30-45 DTE) |
| **Earnings Günü** | TUT | DIS açıklama — pozisyonu TUT, panik YOK |
| **Earnings sonrası 1 gün** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **Earnings sonrası 3-5 gün** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |

> **⚠️ Risk Uyarıları:**
> 1. DIS earnings tarihi net değil — Ağustos'a sarkma riski var. Stratejiyi güncel takvime göre ayarla.
> 2. DIS 200MA ($105.30) altında — uzun vadeli trend hafif ayı. Upside potansiyeli sınırlı.
> 3. Streaming (Disney+) karlılık baskısı devam ediyor — içerik maliyetleri yüksek.
> 4. Park gelirlerinde yavaşlama (ekonomik koşullar) earnings baskısı yapabilir.
> 5. Long Straddle maliyet $8.00 yüksek — hisse büyük hareket yapmazsa zarar.
> 6. DIS Beta 1.20 — piyasadan daha volatil. Genel piyasa hareketi DIS'i sert etkiler.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

### 9.4 BA (Boeing) — $215.92 — CPR: 0.82 ⭐ YÜKSEK IV

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 53.60 (Nötr-boğa, momentum dengeli) |
| **50MA** | $212.80 (fiyat üzerinde, kısa vadeli trend hafif pozitif) |
| **200MA** | $225.40 (fiyat altında, uzun vadeli trend hafif ayı) |
| **IV30** | ~32% |
| **IV Rank** | **~65% (Yüksek! Iron Condor için ideal!)** |
| **Hacim CPR** | 0.82 (Hafif ayı — put hacmi call hacminden hafif yüksek) |
| **OI CPR** | ~0.85 (Hafif ayı — açık put pozisyonları call'lardan hafif fazla) |
| **Beta** | 1.50 (Piyasadan %50 daha volatil!) |
| **YTD** | +0.55% (Sektörde zayıf, havacılık sorunları) |
| **Earnings** | 28 Temmuz-3 Ağustos arası (belirsiz!) |
| **Son 8Q Ort. Earnings Hareketi** | ±5.5% |
| **Implied Move (EM)** | ~±6.0% (~$12.96) |
| **Sektör** | Havacılık & Savunma |
| **FOMC Çakışması** | FOMC öncesi/sonrası sınırda — dikkatli izle |

#### Strateji 1: Iron Condor (Ana) ⭐

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $230C / Buy $248C (Wing $18) |
| **Put Wing** | Sell $200P / Buy $182P (Wing $18) |
| **Kredi** | ~$8.50 |
| **Max Risk** | $9.50 (Wing $18 - Kredi $8.50) |
| **Max Kar** | $8.50 (toplanan kredi) |
| **ROI** | ~89% |
| **Breakeven'lar** | $238.50 (üst) / $191.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.30) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.15/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$4.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $17 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$22 (kullanılan $18 = dar wing, agresif) |
| **PoP** | ~55% |

> **⭐ Strateji Gerekçesi:** BA IV Rank %65 > %50 — Iron Condor için ideal! En yüksek IV30 (%32) — en yüksek prim toplama potansiyeli. Havacılık sektörü yüksek crush (%30-40) — IV deflasyonundan maksimum kazanç. BA 50MA ($212.80) üzerinde ama 200MA ($225.40) altında — kararsız bölgede. CPR 0.82/0.85 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. Wing $18 = fiyatın ~%8.3'i, EM (~%6.0) dışında güvenli bölge. BA Beta 1.50 çok yüksek — büyük hareket riski. Ancak geniş wing ($18) bu riski absorbe eder. 737 MAX üretim sorunları, 787 Dreamliner teslimat gecikmeleri earnings riski. Not: BA earnings tarihi 28 Temmuz-3 Ağustos arası belirsiz — stratejiyi güncel takvime göre ayarla.

#### Strateji 2: Long Put Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Short Delta) |
| **Buy Put** | $210 (hafif ITM) |
| **Sell Put** | $195 (OTM, wing $15) |
| **Maliyet** | ~$5.50 |
| **Max Risk** | $5.50 (ödenen prim) |
| **Max Kar** | $9.50 (Wing $15 - Maliyet $5.50) |
| **ROI** | ~173% |
| **Breakeven** | $204.50 |
| **Delta** | -0.40 ile -0.50 (ayı yönlü) |
| **Vega** | Pozitif (~+$0.18) |
| **Theta** | Negatif (~-$0.06/gün) |
| **Kar Hedefi** | %50 kar = hisse $199.75; %100 kar = hisse $195 altında |
| **Stop Loss** | %50 prim kaybı = pozisyonu $2.75 zararda kapat |
| **Hedge Kullanımı** | BA long pozisyonu olanlar için koruma |

> **Alternatif Gerekçesi:** Eğer BA earnings'te zayıf sonuçlar açıklarsa (737 MAX üretim düşüşü, 787 teslimat gecikmeleri, FAA regülasyon baskısı), put spread kaldıraçlı kar sağlar. CPR 0.82/0.85 ayı bias destekler. 200MA ($225.40) altında — aşağı yönlü hareket olasılığı yüksek. Ancak IV crush riski var — pozisyonu earnings'ten 2-3 gün önce aç, earnings sonrası hemen değerlendir. Not: BA Beta 1.50 çok yüksek — aşağı yönlü hareket sert olabilir.

#### Strateji 3: Short Straddle (Koruma/Hedge — Yüksek Risk)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Nötr Delta) |
| **Sell Call** | $216 (ATM) |
| **Sell Put** | $216 (ATM) |
| **Kredi** | ~$14.00 |
| **Max Risk** | Sınırsız (yukarı) / büyük (aşağı, hisse $0'a düşerse) |
| **Max Kar** | $14.00 (toplanan kredi) |
| **ROI** | ~6.5% (kısa vadeli) |
| **Breakeven'lar** | $230 (üst) / $202 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 (nötr) |
| **Vega** | Negatif (~-$0.50) — IV crush'tan maksimum kazanç |
| **Theta** | Pozitif (~$0.30/gün) — maksimum theta decay |
| **Gamma** | Çok Yüksek (ATM, kısa vade) — büyük risk |
| **Kar Hedefi** | %25 mekanik exit = ~$3.50 kar (short straddle için düşük hedef) |
| **Stop Loss** | 1.5x kredi = pozisyonu $21 zararda kapat |
| **Wing Genişliği** | $0 (naked!) — sınırsız risk |

> **Koruma/Hedge Gerekçesi:** Short Straddle, BA'nın yüksek IV Rank (%65) ve yüksek crush potansiyelinden (%30-40) maksimum kazanç sağlar. ATM straddle $14 kredi toplar — hisse $202-$230 aralığında kalırsa kar. Ancak risk ÇOK YÜKSEK — BA Beta 1.50 ile hisse sert hareket edebilir. Eğer 737 MAX haberi (iyi veya kötü) gelirse, hisse %10+ hareket edebilir. Bu strateji SADECE deneyimli traderlar için. Pozisyon büyüklüğü: Hesabın %0.5'inden fazla risk atma. 21 DTE kuralı kesin. Not: BA earnings tarihi belirsiz — straddle açmadan önce tarihi teyit et.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$230 (Lottery) | ~$25 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$190 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $50-$200 | Long Put Spread ($210P/$195P) 1 kontrat | ~$275 | ~$1,225 | 1:4.5 |
| $50-$200 | Bear Call Spread ($230C/$248C) 1 kontrat | ~$170 | ~$1,630 | 1:9.6 |
| $200-$500 | Iron Condor ($200P/$182P + $230C/$248C) 1 kontrat | ~$350 | ~$1,450 | 1:4.1 |
| $200-$500 | Long Put Butterfly ($202P/$210P/$218P) 2 kontrat | ~$380 | ~$1,020 | 1:2.7 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **Temmuz ortası** | Teyit | BA earnings tarihini teyit et — 28 Temmuz-3 Ağustos arası belirsiz |
| **Earnings öncesi 3-4 gün** | Hazırlık | Greeks analizi, IV Rank teyidi (%65), Beta kontrolü (1.50) |
| **Earnings öncesi 1-2 gün** | Entry | Pozisyon aç (30-45 DTE) |
| **Earnings Günü** | TUT | BA açıklama — pozisyonu TUT, panik YOK |
| **Earnings sonrası 1 gün** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **Earnings sonrası 3-5 gün** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |

> **⚠️ Risk Uyarıları:**
> 1. BA IV Rank %65 çok yüksek — prim toplama cazip ama hisse ani hareket ederse zarar büyür.
> 2. BA Beta 1.50 çok yüksek — piyasadan %50 daha volatil. Büyük hareket riski.
> 3. BA earnings tarihi 28 Temmuz-3 Ağustos arası belirsiz — stratejiyi güncel takvime göre ayarla.
> 4. 737 MAX üretim sorunları, FAA regülasyon baskısı ani düşüşlere neden olabilir.
> 5. Short Straddle ÇOK RİSKLİ — sınırsız yukarı risk. Sadece deneyimli traderlar.
> 6. Dar wing ($18) stratejilerde hisse %9+ hareket ederse max loss.
> 7. Pozisyon büyüklüğü: IC/Bear Call için %1-2, Short Straddle için %0.5'den fazla risk atma.

---

### 9.5 NKE (Nike) — $43.06 — CPR: 0.72

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 38.50 (Ayıcak bölgesi! Momentum negatif) |
| **50MA** | $45.80 (fiyat altında, kısa vadeli trend ayı) |
| **200MA** | $52.30 (fiyat altında, uzun vadeli trend ayı) |
| **IV30** | ~28% |
| **IV Rank** | ~45% (Orta — spread stratejileri uygun) |
| **Hacim CPR** | 0.72 (Ayı — put hacmi call hacminden yüksek) |
| **OI CPR** | ~0.75 (Ayı — açık put pozisyonları call'lardan fazla) |
| **Beta** | 0.90 |
| **YTD** | **-31.20% (En kötü performans! Tüm raporun en zayıfı)** |
| **Earnings** | 30 Haziran (açıkladı — Temmuz 2026 takviminde değil!) |
| **Son 8Q Ort. Earnings Hareketi** | ±5.0% |
| **Implied Move (EM)** | N/A (earnings geçti) |
| **Sektör** | Spor Giyim & Ayakkabı |
| **FOMC Çakışması** | Earnings geçti — FOMC etkisi sınırlı |

#### Strateji 1: Bear Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $48 (OTM, ~%11.5 üzerinde) |
| **Buy Call** | $53 (daha OTM, wing $5) |
| **Kredi** | ~$0.85 |
| **Max Risk** | $4.15 (Wing $5 - Kredi $0.85) |
| **Max Kar** | $0.85 (toplanan kredi) |
| **ROI** | ~20% |
| **Breakeven** | $48.85 |
| **Delta Hedefi** | -0.10 ile -0.15 arası (ayı yönlü) |
| **Vega** | Negatif (~-$0.04) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.02/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.43 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $1.70 zararda kapat |
| **PoP** | ~62% |

> **Strateji Gerekçesi:** NKE 30 Haziran'da earnings açıkladı — Temmuz 2026 takviminde değil. Ancak hisse hala raporda çünkü "post-earnings" stratejiler için değerlendirilebilir. NKE YTD -%31.20 ile tüm raporun en kötü performansı. RSI 38.50 ayıcak bölgede. 50MA ($45.80) ve 200MA ($52.30) altında — güçlü ayı trend. CPR 0.72/0.75 ayı — piyasa ayı beklenti içinde. Bear Call Spread, hissenin $48 üzerine çıkmamasına bahis oynar. 50MA ($45.80) direnci yakınında — teknik direnç. Çin pazarındaki zayıflık ve rekabet baskısı (On, Hoka) devam ediyor. Not: Earnings geçti — IV crush riski yok ama IV hala yüksek olabilir (post-earnings volatilite).

#### Strateji 2: Long Put Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Short Delta) |
| **Buy Put** | $43 (ATM) |
| **Sell Put** | $38 (OTM, wing $5) |
| **Maliyet** | ~$1.80 |
| **Max Risk** | $1.80 (ödenen prim) |
| **Max Kar** | $3.20 (Wing $5 - Maliyet $1.80) |
| **ROI** | ~178% |
| **Breakeven** | $41.20 |
| **Delta** | -0.50 ile -0.60 (güçlü ayı) |
| **Vega** | Pozitif (~+$0.06) |
| **Theta** | Negatif (~-$0.02/gün) |
| **Kar Hedefi** | %50 kar = hisse $39.60; %100 kar = hisse $38 altında |
| **Stop Loss** | %50 prim kaybı = pozisyonu $0.90 zararda kapat |
| **Hedge Kullanımı** | NKE long pozisyonu olanlar için koruma |

> **Alternatif Gerekçesi:** NKE güçlü ayı trend (YTD -%31.20, 50MA/200MA altında, RSI 38.50) devam edebilir. Long Put Spread, bu düşüş trendinden kaldıraçlı kar sağlar. Çin pazarındaki zayıflık, rekabet baskısı (On, Hoka), envanter sorunları devam ediyor. Ancak "oversold" riski var — RSI 30 altına düşerse teknik tepki olabilir. Not: Earnings geçti — IV crush riski yok. Pozisyonu teknik seviyelere göre yönet.

#### Strateji 3: Cash-Secured Put (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Hafif Long Delta) |
| **Sell Put** | $40 (OTM, ~%7.1 altında) |
| **Kredi** | ~$0.45 |
| **Max Risk** | $3,955 (100 hisse × $40 - kredi $45) |
| **Max Kar** | $45 (toplanan kredi) |
| **ROI** | ~1.1% (kısa vadeli) |
| **Breakeven** | $39.55 |
| **Atama Riski** | Hisse $40 altında kapanırsa 100 hisse alım zorunluluğu |
| **Delta** | +0.20 ile +0.25 |
| **Vega** | Negatif (~-$0.03) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.01/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.23; veya atama bekleyerek hisse biriktirme |
| **Dividend Yield** | ~1.5% (atama sonrası temettü geliri) |

> **Koruma/Hedge Gerekçesi:** NKE $43.06, YTD -%31.20 ile çok düşük. Cash-secured put, hisseyi "dip'ten" alma stratejisidir. Eğer NKE daha da düşerse ve $40 altında kapanırsa, 100 hisse $40'tan alınır (gerçek maliyet $39.55). Eğer hisse $40 üzerinde kalırsa, $45 kredi kazanılır. NKE marka değeri yüksek — uzun vadeli birikim için makul seviye. Not: NKE ayı trend devam edebilir — atama riski yüksek. $3,955 per kontrat margin — hesapta yeterli nakit olmalı.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Put @$35 (Lottery) | ~$10 | Sınırsız | Spekülatif |
| $10-$50 | OTM Call @$50 (Lottery) | ~$8 | Sınırsız | Spekülatif |
| $50-$200 | Bear Call Spread ($48C/$53C) 4 kontrat | ~$170 | ~$830 | 1:4.9 |
| $50-$200 | Long Put Spread ($43P/$38P) 3 kontrat | ~$270 | ~$480 | 1:1.8 |
| $200-$500 | Cash-Secured Put ($40P) 5 kontrat | ~$225 kredi | $225 | Hisse biriktirme |
| $200-$500 | Long Put Butterfly ($40P/$43P/$46P) 5 kontrat | ~$375 | ~$875 | 1:2.3 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **Sürekli** | İzleme | NKE teknik seviyeleri izle: 50MA $45.80, 200MA $52.30, destek $40 |
| **Herhangi gün** | Entry | Teknik seviyelere göre entry (earnings geçti, zamanlama esnek) |
| **Yönetim** | Günlük | RSI 30'a yaklaşırsa oversold bounce izle; 50MA kırılırsa trend değişimi |
| **Çıkış** | Hedefe göre | %50 kar veya %50 zarar durdur |

> **⚠️ Risk Uyarıları:**
> 1. NKE 30 Haziran'da earnings açıkladı — Temmuz takviminde değil. Stratejiler "post-earnings" teknik bazlı.
> 2. NKE YTD -%31.20 ile en kötü performans. Ayı trend devam edebilir.
> 3. Çin pazarındaki zayıflık ve rekabet baskısı (On, Hoka) devam ediyor.
> 4. RSI 38.50 ayıcak bölgede — ancak 30 altına düşerse oversold bounce olabilir.
> 5. Cash-secured put: atama riski yüksek (ayı trend). $3,955 per kontrat margin.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

### 9.6 HD (Home Depot) — $310.78 — CPR: ~1.03

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 56.40 (Nötr-boğa, momentum dengeli) |
| **50MA** | $305.60 (fiyat üzerinde, kısa vadeli trend hafif pozitif) |
| **200MA** | $338.20 (fiyat altında, uzun vadeli trend hafif ayı) |
| **IV30** | ~24% |
| **IV Rank** | ~32% (Düşük — long spread tercih) |
| **Hacim CPR** | ~0.98 (Nötr — hacim dengeli) |
| **OI CPR** | ~1.08 (Hafif boğa — açık call pozisyonları put'lardan hafif fazla) |
| **Beta** | 1.10 |
| **YTD** | +8.40% (Sektör ortalaması) |
| **Earnings** | Ağustos (olası — net tarih yok!) |
| **Son 8Q Ort. Earnings Hareketi** | ±3.5% |
| **Implied Move (EM)** | ~±4.0% (~$12.43) |
| **Sektör** | Ev İyileştirme Perakendesi |
| **FOMC Çakışması** | Ağustos earnings — FOMC'den uzak |

#### Strateji 1: Long Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $310 (ATM) |
| **Sell Call** | $325 (OTM, wing $15) |
| **Maliyet** | ~$6.50 |
| **Max Risk** | $6.50 (ödenen prim) |
| **Max Kar** | $8.50 (Wing $15 - Maliyet $6.50) |
| **ROI** | ~131% |
| **Breakeven** | $316.50 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.12) |
| **Theta** | Negatif (~-$0.05/gün) |
| **Kar Hedefi** | %50 kar = hisse $320.75; %100 kar = hisse $325 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $3.25 zararda kapat |
| **Hedge Kullanımı** | HD long pozisyonu olanlar için upside leverage |

> **Strateji Gerekçesi:** HD IV Rank %32 düşük — long call spread için ideal. IV çok düşük (%24) — opsiyon primleri ucuz. 50MA ($305.60) üzerinde — kısa vadeli trend pozitif. 200MA ($338.20) altında — uzun vadeli trend hafif ayı. "Kısa vadeli pozitif, uzun vadeli negatif" çelişkisi — call spread kısa vadeli momentumu oynar. HD YTD +8.40 ile güçlü performans. Konut piyasasındaki faiz oranı hassasiyeti hisseyi baskılıyor — ancak ev iyileştirme talebi hala güçlü. Not: HD earnings tarihi Ağustos olası — stratejiyi güncel takvime göre ayarla. Temmuz'da earnings yoksa, stratejiyi Ağustos'a ertele.

#### Strateji 2: Bull Put Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $300 (OTM, ~%3.5 altında) |
| **Buy Put** | $285 (daha OTM, wing $15) |
| **Kredi** | ~$3.50 |
| **Max Risk** | $11.50 (Wing $15 - Kredi $3.50) |
| **Max Kar** | $3.50 (toplanan kredi) |
| **ROI** | ~30% |
| **Breakeven** | $296.50 |
| **Delta Hedefi** | +0.15 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.08) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.04/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.75 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $7 zararda kapat |
| **PoP** | ~62% |
| **Atama Riski** | Hisse $300 altında kapanırsa 100 hisse alım zorunluluğu |

> **Alternatif Gerekçesi:** Bull Put Spread, HD'nin $300 üzerinde kalmasına bahis oynar. 50MA ($305.60) yakınında — kısa vadeli destek. Eğer HD earnings'te beat açıklarsa (ev iyileştirme talebi, Pro bölümü büyümesi), hisse $300 üzerinde kalır. IV Rank %32 düşük — short premium sınırlı kazanç. Not: HD earnings tarihi Ağustos olası — stratejiyi güncel takvime göre ayarla.

#### Strateji 3: Call Calendar Spread (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Calendar / Time Spread (Karmaşık Greeks) |
| **Sell** | 1 haftalık $310 Call (front month) |
| **Buy** | 4 haftalık $310 Call (back month) |
| **Maliyet** | ~$4.00 |
| **Max Risk** | $4.00 (ödenen prim) |
| **Max Kar** | ~$8.00 (theta decay farkından) |
| **ROI** | ~200% |
| **Breakeven** | ~$305 / ~$315 (yaklaşık) |
| **Delta** | +0.10 ile +0.20 (hafif boğa) |
| **Vega** | Pozitif (back month daha fazla Vega) |
| **Theta** | Pozitif (front month theta decay > back month) |
| **Kar Hedefi** | %50 kar = ~$2; hisse $310 yakınında kalırsa max kar |
| **Hedge Kullanımı** | HD long pozisyonu olanlar için theta decay geliri |

> **Koruma/Hedge Gerekçesi:** Call Calendar Spread, HD'nin düşük IV (%24) ve sınırlı hareket (±%3.5) karakterine uygun. Earnings öncesi front month IV şişer, earnings sonrası çöker — front month satıcısı kazanır. Back month (4 haftalık) theta decay farkından kar. HD sınırlı hareket ile $310 yakınında kalma olasılığı yüksek. Maliyet $4.00 — 3 kontrat = $120 maliyet, $240 max kar. Risk: Hisse $315 üzerine veya $305 altına çıkarsa zarar. Not: HD earnings tarihi Ağustos olası — calendar spread Ağustos'a ertelenebilir.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$325 (Lottery) | ~$20 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$285 (Lottery) | ~$14 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($310C/$325C) 1 kontrat | ~$325 | ~$850 | 1:2.6 |
| $50-$200 | Bull Put Spread ($300P/$285P) 1 kontrat | ~$175 | ~$525 | 1:3.0 |
| $200-$500 | Call Calendar ($310C, 1W/4W) 3 kontrat | ~$360 | ~$720 | 1:2.0 |
| $200-$500 | Long Call Butterfly ($305C/$312C/$319C) 2 kontrat | ~$280 | ~$920 | 1:3.3 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **Temmuz sonu-Ağustos başı** | Teyit | HD earnings tarihini teyit et — Ağustos olası |
| **Earnings öncesi 3-4 gün** | Hazırlık | Greeks analizi, IV Rank teyidi (%32), konut piyasası verilerini izle |
| **Earnings öncesi 1-2 gün** | Entry | Pozisyon aç (30-45 DTE) |
| **Earnings Günü** | TUT | HD açıklama — pozisyonu TUT |
| **Earnings sonrası 1 gün** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **Earnings sonrası 3-5 gün** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |

> **⚠️ Risk Uyarıları:**
> 1. HD earnings tarihi Ağustos olası — net değil. Stratejiyi güncel takvime göre ayarla.
> 2. HD 200MA ($338.20) altında — uzun vadeli trend hafif ayı. Upside potansiyeli sınırlı.
> 3. Konut piyasasındaki faiz oranı hassasiyeti HD'yi baskılıyor — mortgage oranları yüksek.
> 4. Ev iyileştirme talebinde yavaşlama (ekonomik koşullar) earnings baskısı yapabilir.
> 5. IV Rank %32 düşük — short premium stratejileri sınırlı kazanç sunar.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.

---

### 9.7 COIN (Coinbase) — ~$220 — CPR: ~1.50

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 58.00 (Nötr-boğa, momentum pozitif) |
| **50MA** | ~$210 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | ~$185 (fiyat üzerinde, uzun vadeli trend güçlü pozitif) |
| **IV30** | ~55% |
| **IV Rank** | ~60% (Yüksek — IC uygun!) |
| **Hacim CPR** | ~1.50 (Boğa — call hacmi put hacminden %50 yüksek) |
| **OI CPR** | ~1.40 (Boğa — açık call pozisyonları put'lardan %40 fazla) |
| **Beta** | 2.50 (Piyasadan 2.5 kat daha volatil!) |
| **YTD** | N/A |
| **Earnings** | Belirsiz (kripto hisseleri earnings tarihleri değişken) |
| **Son 8Q Ort. Earnings Hareketi** | ±12.0% |
| **Implied Move (EM)** | ~±15.0% (~$33) |
| **Sektör** | Kripto Borsası & Altyapı |
| **FOMC Çakışması** | Belirsiz — kripto hisseleri FOMC'den bağımsız hareket edebilir |

#### Strateji 1: Iron Condor (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $255C / Buy $285C (Wing $30) |
| **Put Wing** | Sell $185P / Buy $155P (Wing $30) |
| **Kredi** | ~$12.00 |
| **Max Risk** | $18.00 (Wing $30 - Kredi $12) |
| **Max Kar** | $12.00 (toplanan kredi) |
| **ROI** | ~67% |
| **Breakeven'lar** | $267 (üst) / $173 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.45) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.20/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$6 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $24 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = $22 (kullanılan $30 = geniş wing, konservatif) |
| **PoP** | ~52% |

> **Strateji Gerekçesi:** COIN IV Rank %60 > %50 — Iron Condor için ideal! Kripto hisseleri yüksek IV crush (%40-50) sunar — short premium maksimum kazanç. COIN CPR ~1.50/1.40 boğa — piyasa bullish beklenti içinde. Ancak COIN Beta 2.50 çok yüksek — hisse sert hareket eder. Geniş wing ($30) = fiyatın ~%13.6'sı, EM (~%15.0) dışında sınırda güvenli bölge. Kripto piyasası volatilitesi (Bitcoin, Ethereum) COIN'i doğrudan etkiler. Earnings tarihi belirsiz — stratejiyi güncel takvime göre ayarla. Not: Kripto hisseleri geleneksel hisselerden farklı davranır — FOMC, CPI gibi makro veriler etkisi sınırlı. Kripto-spesifik haberler (regülasyon, ETF onayları) daha etkili.

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $220 (ATM) |
| **Sell Call** | $250 (OTM, wing $30) |
| **Maliyet** | ~$12.00 |
| **Max Risk** | $12.00 (ödenen prim) |
| **Max Kar** | $18.00 (Wing $30 - Maliyet $12) |
| **ROI** | ~150% |
| **Breakeven** | $232 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.35) |
| **Theta** | Negatif (~-$0.12/gün) |
| **Kar Hedefi** | %50 kar = hisse $241; %100 kar = hisse $250 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $6 zararda kapat |
| **Hedge Kullanımı** | COIN long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer COIN earnings'te beat açıklarsa (kullanıcı büyümesi, işlem hacmi artışı, staking gelirleri), call spread kaldıraçlı kar sağlar. CPR ~1.50/1.40 boğa momentumunu destekler. 50MA (~$210) ve 200MA (~$185) üzerinde — teknik görünüm güçlü pozitif. Ancak IV crush riski yüksek — pozisyonu earnings'ten 1-2 gün önce aç, earnings sonrası hemen değerlendir. Not: COIN Beta 2.50 — kripto piyasası sert hareket ederse COIN de sert hareket eder.

#### Strateji 3: Short Put Spread (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $200 (OTM, ~%9.1 altında) |
| **Buy Put** | $170 (daha OTM, wing $30) |
| **Kredi** | ~$6.50 |
| **Max Risk** | $23.50 (Wing $30 - Kredi $6.50) |
| **Max Kar** | $6.50 (toplanan kredi) |
| **ROI** | ~28% |
| **Breakeven** | $193.50 |
| **Delta Hedefi** | +0.15 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.25) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.10/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$3.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $13 zararda kapat |
| **PoP** | ~60% |
| **Atama Riski** | Hisse $200 altında kapanırsa 100 hisse alım zorunluluğu |

> **Koruma/Hedge Gerekçesi:** Short Put Spread, COIN'nin güçlü boğa momentumunu (CPR ~1.50, 50MA/200MA üzerinde) destekler. Hisse $200 altına düşmezse (50MA ~$210 yakınında), kredi $6.50 kar kalır. Eğer COIN earnings'te düşerse, $170 put koruma sağlar. Kripto piyasası volatilitesi yüksek — geniş wing ($30) riski absorbe eder. Not: COIN atama riski yüksek — kripto piyasası ani düşüşler yaşayabilir. $17,000 per kontrat potansiyel atama riski.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$260 (Lottery) | ~$35 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$160 (Lottery) | ~$20 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($220C/$250C) 1 kontrat | ~$600 | ~$2,400 | 1:4.0 |
| $50-$200 | ⛔ Uygun spread bulunamadı (fiyat yüksek, minimum >$200) |
| $200-$500 | Iron Condor ($185P/$155P + $255C/$285C) 1 kontrat | ~$480 | ~$1,800 | 1:3.8 |
| $200-$500 | Short Put Spread ($200P/$170P) 1 kontrat | ~$325 | ~$2,025 | 1:6.2 |

> **Bütçe Uyarısı:** COIN fiyatı ~$220 ile yüksek. Spread stratejileri $200+ maliyet. Bütçe dostu strateji sınırlı. Alternatif: Micro-options (10 hisse) varsa değerlendir.

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **Sürekli** | Teyit | COIN earnings tarihini teyit et — kripto hisseleri değişken |
| **Earnings öncesi 3-4 gün** | Hazırlık | Greeks analizi, IV Rank teyidi (%60), Bitcoin fiyatını izle |
| **Earnings öncesi 1-2 gün** | Entry | Pozisyon aç (30-45 DTE) |
| **Earnings Günü** | TUT | COIN açıklama — pozisyonu TUT, panik YOK |
| **Earnings sonrası 1 gün** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **Earnings sonrası 3-5 gün** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |

> **⚠️ Risk Uyarıları:**
> 1. COIN Beta 2.50 çok yüksek — piyasadan 2.5 kat daha volatil. Büyük hareket riski.
> 2. COIN earnings tarihi belirsiz — kripto hisseleri değişken. Stratejiyi güncel takvime göre ayarla.
> 3. Kripto piyasası volatilitesi (Bitcoin, Ethereum) COIN'i doğrudan etkiler.
> 4. Regülasyon riski (SEC davaları) ani düşüşlere neden olabilir.
> 5. Geniş wing ($30) stratejilerde bile hisse %15+ hareket ederse max loss.
> 6. Kripto hisseleri geleneksel hisselerden farklı davranır — makro veriler etkisi sınırlı.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma (Beta 2.50 nedeniyle).

---

### 9.8 HOOD (Robinhood) — ~$45 — CPR: ~1.80

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 62.00 (Boğa bölgesi, momentum pozitif) |
| **50MA** | ~$42 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | ~$38 (fiyat üzerinde, uzun vadeli trend güçlü pozitif) |
| **IV30** | ~50% |
| **IV Rank** | ~55% (Yüksek — IC uygun!) |
| **Hacim CPR** | ~1.80 (Güçlü boğa! Call hacmi put hacminden %80 yüksek) |
| **OI CPR** | ~1.60 (Güçlü boğa — açık call pozisyonları put'lardan %60 fazla) |
| **Beta** | 2.20 (Piyasadan 2.2 kat daha volatil!) |
| **YTD** | N/A |
| **Earnings** | Belirsiz (kripto/fintech hisseleri earnings tarihleri değişken) |
| **Son 8Q Ort. Earnings Hareketi** | ±10.0% |
| **Implied Move (EM)** | ~±12.0% (~$5.40) |
| **Sektör** | Fintech & Kripto Ticaret Platformu |
| **FOMC Çakışması** | Belirsiz — kripto/fintech hisseleri FOMC'den bağımsız hareket edebilir |

#### Strateji 1: Iron Condor (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $52C / Buy $58C (Wing $6) |
| **Put Wing** | Sell $38P / Buy $32P (Wing $6) |
| **Kredi** | ~$2.50 |
| **Max Risk** | $3.50 (Wing $6 - Kredi $2.50) |
| **Max Kar** | $2.50 (toplanan kredi) |
| **ROI** | ~71% |
| **Breakeven'lar** | $54.50 (üst) / $35.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.12) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.05/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $5 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = $4.5 (kullanılan $6 = geniş wing, konservatif) |
| **PoP** | ~54% |

> **Strateji Gerekçesi:** HOOD IV Rank %55 > %50 — Iron Condor için ideal! Kripto/fintech hisseleri yüksek IV crush (%40-50) sunar — short premium maksimum kazanç. HOOD CPR ~1.80/1.60 ile güçlü boğa — piyasa çok bullish beklenti içinde. Call hacmi put hacminden %80 daha yüksek — inanılmaz bir boğa sinyali. Ancak HOOD Beta 2.20 çok yüksek — hisse sert hareket eder. Geniş wing ($6) = fiyatın ~%13.3'ü, EM (~%12.0) dışında sınırda güvenli bölge. HOOD 50MA (~$42) ve 200MA (~$38) üzerinde — teknik görünüm güçlü pozitif. Kripto ticaret hacmi artışı, yeni ürün lansmanları (kredi kartı, IRA) earnings sürprizi riski. Not: HOOD earnings tarihi belirsiz — stratejiyi güncel takvime göre ayarla.

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $45 (ATM) |
| **Sell Call** | $52 (OTM, wing $7) |
| **Maliyet** | ~$2.80 |
| **Max Risk** | $2.80 (ödenen prim) |
| **Max Kar** | $4.20 (Wing $7 - Maliyet $2.80) |
| **ROI** | ~150% |
| **Breakeven** | $47.80 |
| **Delta** | +0.50 ile +0.60 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.10) |
| **Theta** | Negatif (~-$0.04/gün) |
| **Kar Hedefi** | %50 kar = hisse $49.90; %100 kar = hisse $52 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $1.40 zararda kapat |
| **Hedge Kullanımı** | HOOD long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer HOOD earnings'te beat açıklarsa (kullanıcı büyümesi, kripto ticaret hacmi, yeni ürün gelirleri), call spread kaldıraçlı kar sağlar. CPR ~1.80/1.60 güçlü boğa momentumunu destekler. Düşük fiyat ($45) — call spread maliyeti çok düşük ($2.80). 10 kontrat = $280 maliyet, $420 max kar. Bu, küçük hesaplar için ideal kaldıraç. Ancak IV crush riski yüksek — pozisyonu earnings'ten 1-2 gün önce aç, earnings sonrası hemen değerlendir. Not: HOOD Beta 2.20 — kripto piyasası sert hareket ederse HOOD da sert hareket eder.

#### Strateji 3: Short Put Spread (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $42 (OTM, ~%6.7 altında) |
| **Buy Put** | $36 (daha OTM, wing $6) |
| **Kredi** | ~$1.20 |
| **Max Risk** | $4.80 (Wing $6 - Kredi $1.20) |
| **Max Kar** | $1.20 (toplanan kredi) |
| **ROI** | ~25% |
| **Breakeven** | $40.80 |
| **Delta Hedefi** | +0.15 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.06) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.03/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.60 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $2.40 zararda kapat |
| **PoP** | ~62% |
| **Atama Riski** | Hisse $42 altında kapanırsa 100 hisse alım zorunluluğu |

> **Koruma/Hedge Gerekçesi:** Short Put Spread, HOOD'nin güçlü boğa momentumunu (CPR ~1.80, 50MA/200MA üzerinde) destekler. Hisse $42 altına düşmezse (50MA ~$42 yakınında), kredi $1.20 kar kalır. Eğer HOOD earnings'te düşerse, $36 put koruma sağlar. Düşük fiyat ($45) — put spread maliyeti çok düşük. 10 kontrat = $120 kredi, $480 risk. Bu, küçük hesaplar için ideal. Not: HOOD atama riski yüksek — kripto piyasası ani düşüşler yaşayabilir. $3,600 per kontrat potansiyel atama riski.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$55 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$32 (Lottery) | ~$10 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($45C/$52C) 3 kontrat | ~$420 | ~$1,260 | 1:3.0 |
| $50-$200 | Short Put Spread ($42P/$36P) 5 kontrat | ~$300 | ~$600 | 1:2.0 |
| $200-$500 | Iron Condor ($38P/$32P + $52C/$58C) 5 kontrat | ~$500 | ~$1,750 | 1:3.5 |
| $200-$500 | Long Call Butterfly ($44C/$47C/$50C) 6 kontrat | ~$360 | ~$1,440 | 1:4.0 |

#### Giriş-Çıkış Takvimi

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **Sürekli** | Teyit | HOOD earnings tarihini teyit et — kripto/fintech hisseleri değişken |
| **Earnings öncesi 3-4 gün** | Hazırlık | Greeks analizi, IV Rank teyidi (%55), Bitcoin fiyatını izle |
| **Earnings öncesi 1-2 gün** | Entry | Pozisyon aç (30-45 DTE) |
| **Earnings Günü** | TUT | HOOD açıklama — pozisyonu TUT, panik YOK |
| **Earnings sonrası 1 gün** | Yönetim | IV crush değerlendirmesi, %50 kar hedefi kontrolü |
| **Earnings sonrası 3-5 gün** | Çıkış | 21 DTE yaklaşıyorsa veya hedef gerçekleştiyse kapat |

> **⚠️ Risk Uyarıları:**
> 1. HOOD Beta 2.20 çok yüksek — piyasadan 2.2 kat daha volatil. Büyük hareket riski.
> 2. HOOD earnings tarihi belirsiz — kripto/fintech hisseleri değişken. Stratejiyi güncel takvime göre ayarla.
> 3. Kripto piyasası volatilitesi (Bitcoin, Ethereum) HOOD'u doğrudan etkiler.
> 4. Regülasyon riski (SEC davaları, finansal regülasyon) ani düşüşlere neden olabilir.
> 5. Geniş wing ($6) stratejilerde bile hisse %13+ hareket ederse max loss.
> 6. HOOD CPR ~1.80/1.60 çok yüksek — "crowded long" riski. Herkes boğa ise sürpriz aşağı şiddetli olabilir.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma (Beta 2.20 nedeniyle).

---

## 10. SEKTÖREL RİSK YÖNETİMİ VE POZİSYON BÜYÜKLÜĞÜ REHBERİ

### 10.1 Pozisyon Büyüklüğü Tablosu (VIX Bazlı)

| VIX Seviyesi | Maksimum Risk (Hesap %) | Açıklama |
|--------------|------------------------|----------|
| < 15 | %2.0 | Normal ortam, standart pozisyon büyüklüğü |
| 15-25 | %1.5 | Hafif yükseliş, dikkatli pozisyon |
| 25-30 | %1.0 | Yüksek volatilite, yarım pozisyon |
| 30-40 | %0.5 | Çok yüksek volatilite, çeyrek pozisyon |
| > 40 | %0.25 | Aşırı volatilite, minimal pozisyon veya nakit |

### 10.2 Sektörel Çeşitlendirme Kuralı

| Kural | Açıklama |
|-------|----------|
| **Maksimum 3 hisse aynı sektörden** | Finansal 7 hisse var — en fazla 3'üne pozisyon aç |
| **Farklı earnings tarihleri** | Aynı gün earnings açıklayan hisselere (14 Temmuz: JPM/BAC/GS/WFC/C) toplam risk sınırla |
| **FOMC çakışması kontrolü** | FOMC öncesi earnings (UNH, V) yarım pozisyon |
| **Beta çeşitlendirmesi** | Düşük beta (JNJ 0.26) + yüksek beta (COIN 2.50) kombinasyonu |

### 10.3 Mekanik Çıkış Kuralları

| Kural | Tetikleyici | Aksiyon |
|-------|-----------|---------|
| **%50 Kar Kuralı** | Toplanan primin / ödenen primin %50'si kar | Pozisyonun %50'sini kapat, kalanı trailing stop |
| **21 DTE Kuralı** | 21 gün vadeye kalan | Mekanik çıkış (gamma riski önleme) |
| **2x Kredi Stop** | Zarar toplanan kredinin 2 katına ulaşırsa | Pozisyonu tamamen kapat |
| **%50 Prim Kaybı Stop** | Long stratejilerde primin %50'si kaybolursa | Pozisyonu tamamen kapat |
| **FOMC Öncesi Çıkış** | FOMC'ye 1 gün kala | FOMC öncesi pozisyonları kapat (çakışma varsa) |

### 10.4 Sektör Özet ve Öncelik Sıralaması

| Sıra | Sektör | En İyi Hisse | Strateji | Öncelik |
|------|--------|--------------|----------|---------|
| 1 | Sağlık | UNH (CPR 3.33) | Bull Call Spread | ⭐⭐⭐ Yüksek |
| 2 | Enerji | XOM (CPR 2.50) | Bull Put Spread | ⭐⭐⭐ Yüksek |
| 3 | Finansal | GS (IV Rank %52) | Iron Condor | ⭐⭐ Orta-Yüksek |
| 4 | Finansal | JPM (IV Rank %81) | Bear Call Spread | ⭐⭐ Orta-Yüksek |
| 5 | Diğer | BA (IV Rank %65) | Iron Condor | ⭐⭐ Orta-Yüksek |
| 6 | Diğer | COIN (IV Rank %60) | Iron Condor | ⭐⭐ Orta (yüksek risk) |
| 7 | Diğer | HOOD (CPR 1.80) | Iron Condor / Call Spread | ⭐⭐ Orta (yüksek risk) |
| 8 | Sağlık | JNJ (Beta 0.26) | Long Call Spread | ⭐⭐ Orta |
| 9 | Finansal | BAC (CPR 1.92) | Bull Put Spread | ⭐⭐ Orta |
| 10 | Finansal | C (IV Rank %55) | Bear Call Spread | ⭐⭐ Orta |

> **Son Not:** Bu rapor Temmuz 2026 earnings sezonu için hazırlanmıştır. Tüm stratejiler teorik ve eğitim amaçlıdır. Gerçek ticaret yapmadan önce kendi risk toleransınızı, yatırım hedeflerinizi ve finansal durumunuzu değerlendirin. Opsiyon ticareti yüksek risk içerir ve tüm sermayenizi kaybedebilirsiniz. Geçmiş performans gelecek performansın garantisi değildir.

---

*Rapor Tarihi: 12 Haziran 2026*
*Analist: Sektörel Opsiyon Analizi AI Sistemi*
*Versiyon: 4.0 — Temmuz 2026 Earnings Sezonu*
