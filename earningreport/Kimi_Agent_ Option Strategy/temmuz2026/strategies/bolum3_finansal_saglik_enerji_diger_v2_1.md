# Bölüm 3: Finansal, Sağlık, Enerji ve Diğer Stratejiler v2.1

> **Temmuz 2026 Earnings Sezonu — Sektörel Derinlemesine Opsiyon Stratejisi Rehberi (GÜNCELLENMİŞ)**
> Bu bölüm, 23 hisse senedi için **EARNINGS PLAY (IV Crush)** formatında opsiyon stratejilerini içerir. Tüm stratejiler earnings öncesi 2-5 gün içinde açılır, earnings sonrası 1-2 gün içinde IV crush realizasyonuyla kapatılır. Earnings play uzun vadeli DEĞİLDİR — 2 günden fazla tutma yasaktır.
>
> **Güncelleme Tarihi:** 12 Haziran 2026 — Tüm fiyatlar ve stratejiler güncel piyasa verileriyle revize edilmiştir.

---

## 📌 EARNINGS PLAY ÇIKIŞ MANTIĞI — KRİTİK KURAL

| Entry | Exit | Max Hold | Kar Hedefi |
|-------|------|----------|------------|
| Earnings'ten **2-5 gün önce** | Earnings sonrası **1-2 gün içinde** | BMO: Earnings günü / AMC: Ertesi gün | %50-75 kredi (IV crush) |

**Her Hisse Giriş-Çıkış Takvimi:**

| Tarih | İşlem |
|-------|-------|
| **XX Temmuz** | ⚠️ Entry (Earnings'ten 2-5 gün önce) |
| **XX Temmuz** | 🎯 Earnings Günü (pozisyon açık) |
| **XX Temmuz** | 🚪 Exit (Earnings sonrası IV crush) |
| **>2 gün sonra** | ⛔ TUTMA — Earnings play uzun vadeli DEĞİLDİR |

> **IV Crush Beklentisi:** Short premium stratejilerinde (Iron Condor, Bull Put Spread, Bear Call Spread) kazanç kaynağı **hissenin yönü değil, earnings sonrası volatilite çöküşüdür (IV crush)**. Earnings sonrası IV %20-50 oranında düşer. Pozisyonu earnings sonrası 1-2 gün içinde KAPAT. Tutarsan theta decay ve yön riski seni yer.

---

## 6. FİNANSAL HİSSELER STRATEJİLERİ

> **Finansal Sektör Makro Analizi:**
> Temmuz 2026 earnings sezonunda 7 büyük finansal kurum raporlayacak. Büyük bankalar (JPM, BAC, GS, WFC, C, MS) 14-15 Temmuz tarihlerinde açıklama yapacak — bu tarihler FOMC (29 Temmuz) kararından önemli ölçüde uzak, "temiz bir giriş penceresi" sunuyor. Finansal sektörün IV crush potansiyeli %20-30 arasında (düşük-orta), bu da short premium stratejilerinin sınırlı kazanç potansiyeline işaret ediyor. Faiz artış beklentisi net interest margin (NIM) için pozitif katalist. CPR değerleri karışık — BAC (1.92) ve GS (1.34) güçlü boğa eğilimli, JPM (0.77) ve C (0.85) ayı eğilimli. BLK (0.85) hafif ayı, WFC (0.90) ve MS (1.00) nötr konumda. Finansal sektör hisseleri genellikle düşük beta (0.8-1.2) ile piyasaya paralel hareket eder. Yüksek IV Rank (>50%) olan JPM (%81), GS (%52) ve C (%55) Iron Condor adaylarıdır. Düşük IV Rank (<40%) olan WFC (%38) ve BLK (%35) long spread stratejilerine daha uygundur.
>
> **Sektör Riskleri:** (1) FOMC öncesi faiz beklentilerinde ani değişim, (2) Ticari gayrimenkul kredilerinde bozulma, (3) Yatırım bankacılığı gelirlerinde düşüş, (4) Tüketici kredi kalitesinde zayıflama.
>
> **IV Crush Profili:** Düşük-orta (%20-30). Büyük bankaların earnings hareketleri genellikle sınırlı (%2-5). Short straddle/strangle kazanma olasılığı yüksek ama prim toplama potansiyeli düşük.

### Finansal Sektör Özet Tablosu (Güncel Fiyatlar — 12 Haziran 2026)

| Hisse | Fiyat | IV30 | IV Rank | Hacim CPR | OI CPR | Teknik | YTD% | Earnings |
|-------|-------|------|---------|-----------|--------|--------|------|----------|
| **JPM** | **$313.49** | 29.4% | 81% | 0.77 | 0.77 | 50MA üzerinde | +2.52% | 14 Temmuz BMO |
| **BAC** | **$55.16** | ~28% | 45% | 1.92 | 0.77 | Güçlü Al sinyali | +1.43% | 14 Temmuz BMO |
| **GS** | **$1,035.64** | ~25% | 52% | 1.34 | 1.25 | Güçlü yükseliş | +20.04% | 14 Temmuz BMO |
| **WFC** | **$82.40** | ~26% | 38% | 0.90 | 1.00 | Nötr | +12.21% | 14 Temmuz BMO |
| **C** | **$138.07** | ~27% | 55% | 0.85 | 0.92 | Güçlü trend | +15.36% | 14 Temmuz BMO |
| **MS** | **$212.66** | ~28% | 48% | 1.00 | 1.00 | Nötr | N/A | 15 Temmuz BMO |
| **BLK** | **$1,016.58** | ~22% | 35% | 0.85 | 0.88 | Nötr | N/A | 21 Temmuz BMO |

---

### 6.1 JPM — $313.49 — CPR: 0.77

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
| **Sell Call** | $325 (OTM, ~%3.7 üzerinde) |
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

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %25-35 (earnings sonrası) |
| **Kazanç Kaynağı** | Hissenin yönü değil, IV çöküşü |
| **Optimal Exit** | 14 Temmuz BMO sonrası 15 Temmuz sabahı |
| **Max Hold** | 15 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** JPM IV Rank %81 ile çok yüksek. Earnings sonrası IV %25-35 düşecek. Bear Call Spread'in kazancı büyük ölçüde bu IV deflasyonundan gelir. Eğer hisse $325 altında kalırsa, kredi $4.50'nin tamamı korunur. Eğer hisse $329.50 altında kalırsa, pozisyon karlı. IV crush 14 Temmuz BMO sonrası 15 Temmuz sabahı gerçekleşir — pozisyonu bu pencerede kapat. **>2 gün tutma YASAK.**

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

> **Asimetrik Yapı:** Call wing ($325/$340) put wing'e ($290/$275) göre daha dar. Neden? CPR 0.77 ayı bias — yukarı yönlü hareket sınırlı, aşağı yönlü hareket daha olası. Call wing dar = daha fazla prim toplama, put wing geniş = aşağı riskini koruma. IV Rank %81 > %50 — Iron Condor için ideal ortam. Entry: 9-11 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

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

> **Koruma Senaryosu:** JPM portföyünde olan yatırımcılar için Long Put Spread, earnings öncesi aşağı yönlü riski sınırlar. Maliyet $5.50 ile %1.8'lik bir "sigorta primi" ödenir. Eğer JPM earnings'te beklenenden kötü sonuçlar açıklarsa (NIM daralması, kredi kayıpları artışı), put spread kar sağlar ve long hisse zararını telafi eder. **Not:** IV crush bu stratejiye zarar verir — pozisyonu earnings'ten önce 2-3 gün aç, earnings sonrası IV düşüşü öncesi kapat. Entry: 11-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı.

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Put Butterfly ($290P/$300P/$310P) | ~$45 | ~$955 | 1:21 |
| $50-$200 | Debit Put Spread ($300P/$295P) 1 kontrat | ~$185 | ~$315 | 1:1.7 |
| $50-$200 | OTM Call @$340 (Lottery/Long Shot) | ~$95 | Sınırsız | Spekülatif |
| $200-$500 | Long Put Butterfly ($295P/$300P/$305P) 2 kontrat | ~$380 | ~$2,120 | 1:5.6 |
| $200-$500 | Bear Call Spread ($325C/$340C) 1 kontrat | ~$450 | ~$450 | 1:1 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, strike seçimi, margin kontrolü |
| **11-12 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-3 gün önce) |
| **14 Temmuz** | 🎯 **Earnings Günü** | BMO açıklama — pozisyonu TUT, panik satışı YAPMA |
| **15 Temmuz** | 🚪 **EXIT** | **IV crush etkisini değerlendir, %50 kar varsa kapat** |
| **15 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kapanmamışsa zarar durdur |

> **⚠️ Risk Uyarıları:**
> 1. IV Rank %81 çok yüksek — prim toplama cazip ama hisse ani hareket ederse zarar büyür.
> 2. Bear Call Spread'te yukarı yönlü gap riski var — hisse $340 üzerine çıkarsa max loss.
> 3. FOMC 29 Temmuz — JPM earnings 14 Temmuz'da, çakışma yok ama genel piyasa volatilitesi etkiler.
> 4. JPM "too big to fail" hissesi — olağanüstü hareketler nadirdir ama earnings sürprizleri olabilir.
> 5. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma (VIX <30 varsayımıyla).
> 6. **⛔ Earnings play 2 günden fazla tutulmaz. 15 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**

---

### 6.2 BAC — $55.16 — CPR: 1.92

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
| **Implied Move (EM)** | ~±4.2% (~$2.32) |
| **Dividend Yield** | ~2.5% |

#### Strateji 1: Bull Put Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta hafif) |
| **Sell Put** | $50 (OTM, ~%9.4 altında) |
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

> **Strateji Gerekçesi:** BAC hacim CPR 1.92 ile tüm finansal sektörün en güçlü boğa sinyalini veriyor. Call hacmi put hacminden neredeyse iki kat fazla — piyasa güçlü bullish beklenti içinde. Ancak OI CPR 0.77 ile açık pozisyonlarda ayı eğilim var — bu çelişki fırsat sunar: spekülatörler put taşıyor (korumacı veya ayı), ancak hacim call yönlü. Bull Put Spread, hissenin $50 üzerinde kalmasına bahis oynar. Düşük fiyat ($55.16) = küçük sermaye ile çoklu kontrat (10 kontrat = ~$850 kredi, ~$2,150 risk). BAC YTD +1.43 ile sektörde geri kalmış — "catch-up trade" potansiyeli var. NIM genişlemesi ve tüketici bankacılığı güçlülüğü earnings sürprizi sunabilir.

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-30 (earnings sonrası) |
| **Kazanç Kaynağı** | IV çöküşü + hissenin $50 üzerinde kalması |
| **Optimal Exit** | 14 Temmuz BMO sonrası 15 Temmuz sabahı |
| **Max Hold** | 15 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** BAC IV Rank %45 orta seviyede. Earnings sonrası IV %20-30 düşecek. Bull Put Spread $0.85 kredi toplar. IV crush sonrası bu primin %50-75'i eriyerek kar realize edilir. Eğer hisse $50 üzerinde kalırsa (50MA $51.82 yakınında), kredi tamamı korunur. Entry: 9-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

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

> **Alternatif Gerekçesi:** Eğer BAC earnings'te güçlü bir "beat" açıklarsa, call spread kaldıraçlı kar sağlar. Hacim CPR 1.92 güçlü boğa momentumunu destekler. Ancak IV crush riski var — pozisyonu 12-13 Temmuz'da aç, 14 Temmuz BMO sonrası 15 Temmuz sabahı hemen değerlendir. Eğer hisse pre-earnings run-up yaparsa, call spread erken kar alabilir. Not: IV Rank %45 sınırda — long spread için IV çok yüksek değil, makul.

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

> **Mini IC Gerekçesi:** BAC düşük fiyatlı hisse — wing $3 ile bile makul risk. Mini Iron Condor, hissenin $48-$58 bandında kalmasına bahis oynar. Bu band earnings implied move'ın (~$2.32) oldukça dışında — güvenli bölge. IV crush potansiyeli %20-30 — short premium kazançlı. 10 kontrat = $1,200 kredi, $1,800 risk. Entry: 9-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$58 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$45 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $50-$200 | Bull Put Spread ($50P/$47P) 2 kontrat | ~$170 | ~$430 | 1:2.5 |
| $50-$200 | Long Call Spread ($52C/$56C) 1 kontrat | ~$165 | ~$235 | 1:1.4 |
| $200-$500 | Mini Iron Condor ($48P/$45P + $58C/$61C) 4 kontrat | ~$480 | ~$720 | 1:1.5 |
| $200-$500 | Long Call Butterfly ($53C/$55C/$57C) 3 kontrat | ~$285 | ~$915 | 1:3.2 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, hacim CPR teyidi, OI CPR kontrolü |
| **11-12 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-3 gün önce) |
| **14 Temmuz** | 🎯 **Earnings Günü** | BMO açıklama — pozisyonu TUT |
| **15 Temmuz** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **15 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. Hacim CPR 1.92 güçlü boğa ama OI CPR 0.77 ayı — çelişkili sinyal. OI CPR, "smart money"ın put taşıdığını gösteriyor olabilir.
> 2. BAC YTD +1.43 ile sektörde geri kalmış — bu "catch-up" veya "lagging weakness" olabilir.
> 3. Dar wing ($3) stratejilerde hisse %5+ hareket ederse max loss hızlı gelir.
> 4. Ticari gayrimenkul kredilerinde bozulma BAC'i daha fazla etkileyebilir (JPM'e göre daha fazla maruziyet).
> 5. 10+ kontrat ile pozisyon büyütme — hesabın %2'sinden fazla risk atma.
> 6. **⛔ Earnings play 2 günden fazla tutulmaz. 15 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**


---

### 6.3 GS — $1,035.64 — CPR: 1.34

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
| **Call Wing** | Sell $1,090C / Buy $1,160C (Wing $70) |
| **Put Wing** | Sell $980P / Buy $910P (Wing $70) |
| **Kredi/Maliyet** | ~$22.00 |
| **Max Risk** | $48.00 (Wing $70 - Kredi $22) |
| **Max Kar** | $22.00 (toplanan kredi) |
| **ROI** | ~46% |
| **Breakeven'lar** | $1,112 (üst) / $958 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.45) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.75/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol altında) |
| **Kar Hedefi** | %50 mekanik exit = ~$11 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $44 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$104 (kullanılan $70 = dar wing, agresif) |
| **PoP** | ~58% |

> **Strateji Gerekçesi:** GS, finansal sektörün en güçlü performansı (+20.04% YTD). Hem hacim CPR (1.34) hem OI CPR (1.25) 1.0 üzerinde — güçlü boğa momentumu. IV Rank %52 > %50 — Iron Condor için ideal aday. Wing $70 = fiyatın ~%6.8'si, EM (~%5.0) dışında güvenli bölge. Yüksek fiyat ($1,035.64) = yüksek prim toplama potansiyeli ($22 kredi). Yatırım bankacılığı gelirleri (M&A, underwriting, trading) earnings'te sürpriz yapabilir. FOMC'den uzak — temiz dönem. Iron Condor, GS'nin earnings öncesi volatilite şişkinliğinden (IV Rank %52) faydalanır ve crush sonrası prim çöküşünden kazanır.

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %25-35 (earnings sonrası) |
| **Kazanç Kaynağı** | IV çöküşü + hissenin $980-$1,090 aralığında kalması |
| **Optimal Exit** | 14 Temmuz BMO sonrası 15 Temmuz sabahı |
| **Max Hold** | 15 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** GS IV Rank %52 ile yüksek. Earnings sonrası IV %25-35 düşecek. Iron Condor $22 kredi toplar. IV crush sonrası bu primin %50-75'i eriyerek kar realize edilir. Wing $70 geniş — EM %5.0 dışında güvenli bölge. Entry: 9-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

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

> **Alternatif Gerekçesi:** Eğer GS earnings'te güçlü sonuçlar açıklarsa (trading revenue beat, M&A pipeline güçlülüğü), bull call spread kaldıraçlı kar sağlar. YTD +20.04 momentumu devam edebilir. Ancak IV crush riski yüksek — pozisyonu 12-13 Temmuz'da aç, 14 Temmuz BMO sonrası 15 Temmuz sabahı hemen değerlendir. Eğer hisse pre-earnings run-up yaparsa ($1,080+), erken kar al. Not: Maliyet $28 yüksek — 1 kontrat = $2,800 risk. Hesabın %1-2'sinden fazla risk atma.

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

> **Asimetrik Gerekçesi:** Call wing geniş ($80) = yukarı yönlü harekete daha fazla tolerans. Put wing dar ($60) = aşağı yönlü harekette daha az risk. Bu yapı, GS'nin güçlü boğa momentumunu (YTD +20.04, CPR 1.34) dikkate alır. Eğer GS earnings'te yukarı gap yaparsa, call wing genişliği zararı önler. Aşağı yönlü harekette put wing dar olduğu için risk sınırlı. Kredi $18 ile prim toplama potansiyeli yüksek. Entry: 9-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | ⛔ Uygun strateji bulunamadı (fiyat çok yüksek, 1 kontrat bile pahalı) |
| $50-$200 | ⛔ Uygun strateji bulunamadı (minimum spread maliyeti >$200) |
| $200-$500 | Long Put Butterfly ($1,000P/$1,040P/$1,080P) | ~$380 | ~$3,620 | 1:9.5 |
| $200-$500 | OTM Call @$1,160 (Lottery) | ~$420 | Sınırsız | Spekülatif |

> **Bütçe Uyarısı:** GS fiyatı $1,035.64 ile çok yüksek. 1 kontrat = 100 hisse = $103,564 nominal değer. Spread stratejileri bile $200+ maliyet. Bütçe dostu strateji bulunamıyor. Alternatif: Micro-options (10 hisse = 1 kontrat) varsa değerlendir. Yoksa GS'yi bütçe stratejilerinden çıkar.

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%52), strike seçimi |
| **11-12 Temmuz** | ⚠️ **Entry** | Iron Condor aç (earnings'ten 2-3 gün önce) |
| **14 Temmuz** | 🎯 **Earnings Günü** | BMO açıklama — pozisyonu TUT, panik YOK |
| **15 Temmuz** | 🚪 **EXIT** | **IV crush etkisini ölç, %50 kar varsa kapat** |
| **15 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. GS fiyatı $1,035.64 çok yüksek — 1 kontrat Iron Condor margin gereksinimi ~$4,800. Küçük hesaplar için uygun değil.
> 2. RSI 62.30 aşırı alım sınırına (70) yaklaşıyor — kısa vadeli geri çekilme riski.
> 3. YTD +20.04 ile sektör lideri — "mean reversion" riski (kâr realizasyonu).
> 4. Yatırım bankacılığı gelirleri volatil — bir çeyrekte düşüş sürpriz yapabilir.
> 5. Dar wing ($70) stratejilerde hisse %7+ hareket ederse max loss.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 7. **⛔ Earnings play 2 günden fazla tutulmaz. 15 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**

---

### 6.4 WFC — $82.40 — CPR: 0.90

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 48.75 (Nötr, momentum yok) |
| **50MA** | $82.15 (fiyat üzerinde, kısa vadeli trend hafif pozitif) |
| **200MA** | $78.50 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~26% |
| **IV Rank** | ~38% (Düşük — IC uygun değil, long spread tercih) |
| **Hacim CPR** | 0.90 (Nötr — hacim dengeli) |
| **OI CPR** | 1.00 (Tam nötr — açık pozisyonlar dengeli) |
| **YTD** | +12.21% (Sektör ortalamasının üzerinde) |
| **Earnings** | 14 Temmuz BMO |
| **Beta** | ~1.1 |
| **Son 8Q Ort. Earnings Hareketi** | ±3.5% |
| **Implied Move (EM)** | ~±3.8% (~$3.13) |
| **Sektör** | Tüketici Bankacılığı & Mortgage |

#### Strateji 1: Long Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $80 (hafif ITM/ATM) |
| **Sell Call** | $88 (OTM, wing $8) |
| **Maliyet** | ~$3.50 |
| **Max Risk** | $3.50 (ödenen prim) |
| **Max Kar** | $4.50 (Wing $8 - Maliyet $3.50) |
| **ROI** | ~129% |
| **Breakeven** | $83.50 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.08) |
| **Theta** | Negatif (~-$0.03/gün) |
| **Kar Hedefi** | %50 kar = hisse $86.75; %100 kar = hisse $88 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $1.75 zararda kapat |
| **Hedge Kullanımı** | WFC long pozisyonu olanlar için upside leverage |

> **Strateji Gerekçesi:** WFC IV Rank %38 düşük — opsiyon primleri ucuz. Long Call Spread, düşük IV ortamında kaldıraçlı kar sağlar. WFC 50MA ($82.15) üzerinde ve 200MA ($78.50) çok üzerinde — teknik görünüm pozitif. CPR 0.90/1.00 nötr — yön belirsizliği yüksek. Earnings hareketi ±%3.5 sınırlı. Wing $8 = fiyatın ~%9.7'si, EM (~%3.8) dışında geniş güvenli bölge. Entry: 10-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-30 (earnings sonrası) |
| **Kazanç Kaynağı** | Hisse yönü (IV düşük, IV crush sınırlı) |
| **Optimal Exit** | 14 Temmuz BMO sonrası 15 Temmuz sabahı |
| **Max Hold** | 15 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** WFC IV Rank %38 düşük. Earnings sonrası IV %20-30 düşecek ama düşük başlangıç nedeniyle crush sınırlı. Long Call Spread için IV crush ZARARLIDIR. Pozisyonu earnings sonrası 15 Temmuz sabahı hemen kapat. IV crush put'a da zarar verir ama call spread için hisse yönü önemlidir. Eğer hisse $88 üzerine çıkarsa, wing kar realize edilir. Entry: 10-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 2: Bull Put Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $78 (OTM, ~%5.3 altında) |
| **Buy Put** | $74 (daha OTM, wing $4) |
| **Kredi** | ~$0.90 |
| **Max Risk** | $3.10 (Wing $4 - Kredi $0.90) |
| **Max Kar** | $0.90 (toplanan kredi) |
| **ROI** | ~29% |
| **Breakeven** | $77.10 |
| **Delta Hedefi** | +0.15 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.04) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.02/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.45 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $1.80 zararda kapat |
| **PoP** | ~64% |

> **Alternatif Gerekçesi:** Bull Put Spread, WFC'nin $78 üzerinde kalmasına bahis oynar. 200MA $78.50 yakınında — uzun vadeli destek. IV crush potansiyeli %20-30 — short premium sınırlı kazanç. Dar wing ($4) = hisse %5+ hareket ederse max loss. 10 kontrat = $900 kredi, $3,100 risk. Entry: 10-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 3: Cash-Secured Put (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Hafif Long Delta) |
| **Sell Put** | $78 (OTM, ~%5.3 altında) |
| **Kredi** | ~$0.60 |
| **Max Risk** | $7,740 (100 hisse × $78 - kredi $60) |
| **Max Kar** | $60 (toplanan kredi) |
| **ROI** | ~0.8% (kısa vadeli) |
| **Breakeven** | $77.40 |
| **Atama Riski** | Hisse $78 altında kapanırsa 100 hisse alım zorunluluğu |
| **Delta** | +0.20 ile +0.25 |
| **Vega** | Negatif (IV crush'tan kazanç) |
| **Theta** | Pozitif (~$0.03/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.30; veya atama bekleyerek hisse biriktirme |

> **Koruma/Hedge Gerekçesi:** WFC $82.40, 200MA $78.50 üzerinde — uzun vadeli trend pozitif. Cash-secured put, hisseyi "indirimli" alma stratejisidir. Eğer WFC earnings'te düşerse ve $78 altında kapanırsa, 100 hisse $78'den alınır (gerçek maliyet $77.40). Eğer hisse $78 üzerinde kalırsa, $60 kredi kazanılır. WFC YTD +12.21 ile güçlü performans gösteriyor — uzun vadeli birikim için uygun. Not: $7,740 margin gereksinimi — hesapta yeterli nakit olmalı. Entry: 10-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$88 (Lottery) | ~$25 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$74 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($80C/$88C) 1 kontrat | ~$175 | ~$450 | 1:2.6 |
| $50-$200 | Bull Put Spread ($78P/$74P) 3 kontrat | ~$270 | ~$930 | 1:3.4 |
| $200-$500 | Long Call Butterfly ($80C/$84C/$88C) 3 kontrat | ~$285 | ~$915 | 1:3.2 |
| $200-$500 | Cash-Secured Put ($78P) 4 kontrat | ~$240 kredi | $240 | Hisse biriktirme |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%38 — düşük), strateji seçimi |
| **11-12 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-3 gün önce) |
| **14 Temmuz** | 🎯 **Earnings Günü** | BMO açıklama — pozisyonu TUT |
| **15 Temmuz** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **15 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. WFC IV Rank %38 düşük — short premium stratejileri (IC, short straddle) sınırlı kazanç sunar.
> 2. 50MA $82.15 yakınında — kısa vadeli momentum nötr. Earnings öncesi yön belirsiz.
> 3. Mortgage piyasasındaki faiz oranı hassasiyeti WFC'i etkiler (en büyük mortgage lender).
> 4. Dar wing ($4/$8) stratejilerde hisse %5+ hareket ederse max loss hızlı gelir.
> 5. Cash-secured put: $7,740 per kontrat margin — hesapta yeterli nakit olmalı.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 7. **⛔ Earnings play 2 günden fazla tutulmaz. 15 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**


---

### 6.5 C — $138.07 — CPR: 0.85

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
| **Implied Move (EM)** | ~±4.5% (~$6.21) |
| **52-Hafta Zirve** | $135.83 (fiyat çok yakın!) |

#### Strateji 1: Bear Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $145 (OTM, ~%5.0 üzerinde) |
| **Buy Call** | $153 (daha OTM, wing $8) |
| **Kredi/Maliyet** | ~$2.20 |
| **Max Risk** | $5.80 (Wing $8 - Kredi $2.20) |
| **Max Kar** | $2.20 (toplanan kredi) |
| **ROI** | ~38% |
| **Breakeven** | $147.20 |
| **Delta Hedefi** | -0.12 ile -0.18 arası (ayı yönlü) |
| **Vega** | Negatif (~-$0.15) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.05/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.10 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $4.40 zararda kapat |
| **PoP** | ~58% |

> **Strateji Gerekçesi:** C 52-hafta zirvesine ($135.83) çok yakın — sadece %1.6 uzakta. Finansal sektör içinde YTD +15.36 ile ikinci en güçlü performans. RSI 64.10 aşırı alım sınırına yaklaşıyor. CPR 0.85/0.92 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. Bear Call Spread, hissenin $145 üzerine çıkmamasına bahis oynar. Eğer C zirve yakınında kâr realizasyonu yaşarsa, call spread kar sağlar. IV Rank %55 > %50 — prim toplama cazip. Wing $8 = fiyatın ~%5.8'i, EM (~%4.5) dışında güvenli bölge. FOMC'den uzak — temiz dönem. Entry: 9-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %25-35 (earnings sonrası) |
| **Kazanç Kaynağı** | IV çöküşü + hissenin $145 altında kalması |
| **Optimal Exit** | 14 Temmuz BMO sonrası 15 Temmuz sabahı |
| **Max Hold** | 15 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** C IV Rank %55 ile yüksek. Earnings sonrası IV %25-35 düşecek. Bear Call Spread $2.20 kredi toplar. IV crush sonrası bu primin %50-75'i eriyerek kar realize edilir. Eğer hisse $145 altında kalırsa, kredi tamamı korunur. Wing $8 dar — hisse $153 üzerine çıkarsa max loss. Entry: 9-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 2: Long Put Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Short Delta) |
| **Buy Put** | $135 (hafif ITM) |
| **Sell Put** | $127 (OTM, wing $8) |
| **Maliyet** | ~$2.80 |
| **Max Risk** | $2.80 (ödenen prim) |
| **Max Kar** | $5.20 (Wing $8 - Maliyet $2.80) |
| **ROI** | ~186% |
| **Breakeven** | $132.20 |
| **Delta** | -0.40 ile -0.50 (ayı yönlü) |
| **Vega** | Pozitif (~+$0.18) |
| **Theta** | Negatif (~-$0.06/gün) |
| **Kar Hedefi** | %50 kar = hisse $129.60; %100 kar = hisse $127 altında |
| **Hedge Kullanımı** | C long pozisyonu olanlar için koruma |

> **Alternatif Gerekçesi:** Eğer C 52-hafta zirvesinden geri çekilirse (kâr realizasyonu, zayıf earnings), put spread kaldıraçlı kar sağlar. RSI 64.10 ve zirve yakınlığı geri çekilme olasılığını artırır. Ancak IV crush riski var — pozisyonu 11-12 Temmuz'da aç, 14 Temmuz BMO sonrası 15 Temmuz sabahı hemen değerlendir. Eğer hisse pre-earnings aşağı hareket ederse ($130 altı), erken kar al. Not: C'nin küresel varlıkları (emerging markets exposure) earnings sürprizi riski taşır.

#### Strateji 3: Protective Collar (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kombinasyon (Long Put + Short Call) |
| **Long Put** | $130 (OTM koruma) |
| **Short Call** | $148 (OTM, kredi toplama) |
| **Put Maliyeti** | ~$1.80 |
| **Call Kredisi** | ~$1.00 |
| **Net Maliyet** | ~$0.80 |
| **Max Risk** | $8.80 (fiyat $130'e düşerse: $138.07 - $130 = $8.07 + net maliyet $0.80) |
| **Max Kar** | Sınırlı (call $148'a kadar, sonra atama) |
| **Downside Protection** | $130 (yaklaşık %5.8 aşağı koruma) |
| **Upside Cap** | $148 (yaklaşık %7.2 yukarı sınır) |
| **Vega** | Karmaşık (put long vega + call short vega = net nötr-negatif) |
| **Theta** | Karmaşık (put short theta + call short theta = net negatif) |

> **Koruma Gerekçesi:** C long pozisyonu olan yatırımcılar için Protective Collar, aşağı yönlü riski sınırlar ($130 koruma) ve maliyeti short call kredisi ile düşürür. Net maliyet $0.80 çok düşük — "ucuz sigorta". Eğer C earnings'te patlarsa, upside $148 ile sınırlı (call atama). Eğer C düşerse, $130 put zararı sınırlar. Bu strateji, "zirve yakınında" hisseler için ideal koruma aracıdır. Entry: 11-12 Temmuz. Exit: 14 Temmuz BMO sonrası 15 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Put @$127 (Lottery) | ~$28 | Sınırsız | Spekülatif |
| $10-$50 | OTM Call @$153 (Lottery) | ~$22 | Sınırsız | Spekülatif |
| $50-$200 | Bear Call Spread ($145C/$153C) 2 kontrat | ~$440 | ~$1,160 | 1:2.6 |
| $50-$200 | Long Put Spread ($135P/$127P) 1 kontrat | ~$280 | ~$520 | 1:1.9 |
| $200-$500 | Long Put Butterfly ($129P/$135P/$141P) 2 kontrat | ~$380 | ~$1,220 | 1:3.2 |
| $200-$500 | Iron Condor ($127P/$119P + $145C/$153C) 1 kontrat | ~$420 | ~$780 | 1:1.9 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | 52-hafta zirve kontrolü ($135.83), RSI teyidi, CPR analizi |
| **11-12 Temmuz** | ⚠️ **Entry** | Bear Call Spread veya Put Spread aç (earnings'ten 2-3 gün önce) |
| **14 Temmuz** | 🎯 **Earnings Günü** | BMO açıklama — pozisyonu TUT |
| **15 Temmuz** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **15 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. C 52-hafta zirvesine ($135.83) çok yakın — "breakout" veya "rejection" riski yüksek.
> 2. RSI 64.10 aşırı alım sınırına yakın — kısa vadeli geri çekilme olasılığı.
> 3. C küresel banka — emerging markets krizi, döviz kuru oynaklığı earnings'i etkiler.
> 4. Bear Call Spread'te yukarı yönlü gap riski — hisse $153 üzerine çıkarsa max loss.
> 5. Protective Collar'da call atama riski — hisse $148 üzerine çıkarsa long hisse satılır.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 7. **⛔ Earnings play 2 günden fazla tutulmaz. 15 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**

---

### 6.6 MS — $212.66 — CPR: 1.00

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 55.00 (Nötr-boğa, momentum dengeli) |
| **50MA** | ~$208 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | ~$195 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~28% |
| **IV Rank** | ~48% (Sınırda — IC deneyimli traderlar için) |
| **Hacim CPR** | 1.00 (Tam nötr — hacim dengeli) |
| **OI CPR** | 1.00 (Tam nötr — açık pozisyonlar dengeli) |
| **YTD** | +21.10% (MSN Money, 11 Haziran 2026) |
| **Earnings** | 15 Temmuz BMO |
| **Beta** | ~1.2 |
| **Son 8Q Ort. Earnings Hareketi** | ±4.2% |
| **Implied Move (EM)** | ~±4.5% (~$9.57) |
| **Sektör** | Yatırım Bankacılığı & Varlık Yönetimi |

#### Strateji 1: Iron Condor (Ana — Deneyimli Traderlar)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $225C / Buy $238C (Wing $13) |
| **Put Wing** | Sell $198P / Buy $185P (Wing $13) |
| **Kredi/Maliyet** | ~$4.50 |
| **Max Risk** | $8.50 (Wing $13 - Kredi $4.50) |
| **Max Kar** | $4.50 (toplanan kredi) |
| **ROI** | ~53% |
| **Breakeven'lar** | $229.50 (üst) / $193.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.20) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.08/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$2.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $9.00 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$21 (kullanılan $13 = dar wing, agresif) |
| **PoP** | ~56% |

> **Strateji Gerekçesi:** MS tam nötr CPR (1.00) ve IV Rank %48 (sınırda) ile Iron Condor için "deneyimli trader" adayıdır. Wing $13 = fiyatın ~%6.1'i, EM (~%4.5) dışında geniş güvenli bölge. IV Rank %48, %50 eşiğinin hemen altında — prim toplama potansiyeli sınırlı ama hala makul. MS 15 Temmuz'da earnings açıklayacak — diğer büyük bankalardan (14 Temmuz) 1 gün sonra. Bu, 14 Temmuz banka earnings'inin etkisini görme fırsatı sunar. Eğer JPM/BAC/GS güçlü sonuçlar açıklarsa, MS de benzer performans gösterebilir. FOMC'den uzak — temiz dönem. Entry: 10-12 Temmuz. Exit: 15 Temmuz BMO sonrası 16 Temmuz sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-30 (earnings sonrası) |
| **Kazanç Kaynağı** | IV çöküşü + hissenin $198-$225 aralığında kalması |
| **Optimal Exit** | 15 Temmuz BMO sonrası 16 Temmuz sabahı |
| **Max Hold** | 16 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** MS IV Rank %48 sınırda. Earnings sonrası IV %20-30 düşecek. Iron Condor $4.50 kredi toplar. IV crush sonrası bu primin %50-75'i eriyerek kar realize edilir. Wing $13 geniş — EM %4.5 dışında güvenli bölge. Entry: 10-12 Temmuz. Exit: 15 Temmuz BMO sonrası 16 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $210 (hafif ITM) |
| **Sell Call** | $225 (OTM, wing $15) |
| **Maliyet** | ~$6.00 |
| **Max Risk** | $6.00 (ödenen prim) |
| **Max Kar** | $9.00 (Wing $15 - Maliyet $6) |
| **ROI** | ~150% |
| **Breakeven** | $216 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.25) |
| **Theta** | Negatif (~-$0.07/gün) |
| **Kar Hedefi** | %50 kar = hisse $220.50; %100 kar = hisse $225 üzeri |
| **Hedge Kullanımı** | MS long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer 14 Temmuz banka earnings'leri güçlü gelirse, MS 15 Temmuz'da benzer performans gösterebilir. Long Call Spread, bu "follow-through" hareketinden kaldıraçlı kar sağlar. MS 50MA ve 200MA üzerinde — teknik görünüm pozitif. Ancak IV crush riski var — pozisyonu 14 Temmuz akşamı (diğer bankalar earnings sonrası) aç, 15 Temmuz BMO sonrası 16 Temmuz sabahı hemen değerlendir. Not: Bu "event-driven" timing risklidir — 14 Temmuz sonuçları kötü gelirse MS de düşer.

#### Strateji 3: Short Straddle (Koruma/Hedge — Yüksek Risk)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Nötr Delta) |
| **Sell Call** | $213 (ATM) |
| **Sell Put** | $213 (ATM) |
| **Kredi** | ~$9.00 |
| **Max Risk** | Sınırsız (yukarı) / $204 (aşağı, hisse $0'a düşerse) |
| **Max Kar** | $9.00 (toplanan kredi) |
| **ROI** | ~4.2% (kısa vadeli) |
| **Breakeven'lar** | $222 (üst) / $204 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 (nötr) |
| **Vega** | Negatif (~-$0.50) — IV crush'tan maksimum kazanç |
| **Theta** | Pozitif (~$0.25/gün) — maksimum theta decay |
| **Gamma** | Çok Yüksek (ATM, kısa vade) — büyük risk |
| **Kar Hedefi** | %25 mekanik exit = ~$2.25 kar (short straddle için düşük hedef) |
| **Stop Loss** | 1.5x kredi = pozisyonu $13.50 zararda kapat |

> **Koruma/Hedge Gerekçesi:** Short Straddle, IV crush'tan maksimum kazanç sağlayan stratejidir. MS IV Rank %48 ile prim toplama makul. ATM straddle $9 kredi toplar — hisse $204-$222 aralığında kalırsa kar. Ancak risk ÇOK YÜKSEK — hisse $222 üzerine veya $204 altına çıkarsa zarar sınırsız (yukarı) veya büyük (aşağı). Bu strateji SADECE deneyimli traderlar için. Pozisyon büyüklüğü: Hesabın %0.5'inden fazla risk atma. Entry: 12-13 Temmuz. Exit: 15 Temmuz BMO sonrası 16 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$225 (Lottery) | ~$28 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$198 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($210C/$225C) 1 kontrat | ~$400 | ~$600 | 1:1.5 |
| $50-$200 | Long Put Spread ($210P/$195P) 1 kontrat | ~$320 | ~$680 | 1:2.1 |
| $200-$500 | Iron Condor ($198P/$185P + $225C/$238C) 1 kontrat | ~$350 | ~$650 | 1:1.9 |
| $200-$500 | Long Call Butterfly ($208C/$216C/$224C) 1 kontrat | ~$220 | ~$780 | 1:3.5 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%48 — sınırda), 14 Temmuz banka earnings planı |
| **11-12 Temmuz** | ⚠️ **Entry (IC)** | Iron Condor aç (earnings'ten 3-4 gün önce) |
| **14 Temmuz** | Gözlem | JPM/BAC/GS/WFC/C earnings sonuçlarını izle — MS için ipucu |
| **14 Temmuz Akşam** | ⚠️ **Entry (Long Call Spread)** | Eğer 14 Temmuz bankalar güçlüyse, MS call spread aç |
| **15 Temmuz** | 🎯 **Earnings Günü** | MS BMO açıklama — pozisyonu TUT |
| **16 Temmuz** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **16 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. MS IV Rank %48 — %50 eşiğinin altında. Iron Condor prim toplama potansiyeli sınırlı.
> 2. Short Straddle ÇOK RİSKLİ — sınırsız yukarı risk, büyük aşağı risk. Sadece deneyimli traderlar.
> 3. 14 Temmuz banka earnings'leri MS için "leading indicator" — kötü sonuçlar MS'yi de baskılar.
> 4. MS 15 Temmuz'da — diğer bankalardan 1 gün sonra, piyasa volatilitesi taşıyabilir.
> 5. Short Straddle'da gamma riski zirvede — hisse %2+ hareket ederse zarar hızlı büyür.
> 6. Pozisyon büyüklüğü: IC için %1-2, Short Straddle için %0.5'den fazla risk atma.
> 7. **⛔ Earnings play 2 günden fazla tutulmaz. 16 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**

---

### 6.7 BLK — $1,016.58 — CPR: 0.85

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 60.00 (Nötr-boğa, momentum pozitif) |
| **50MA** | ~$995 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | ~$950 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~22% |
| **IV Rank** | ~35% (Düşük — IC uygun değil, long spread tercih) |
| **Hacim CPR** | 0.85 (Hafif ayı — put hacmi call hacminden hafif yüksek) |
| **OI CPR** | 0.88 (Hafif ayı — açık put pozisyonları call'lardan hafif fazla) |
| **YTD** | +3.96% (Yahoo Finance, 11 Haziran 2026) |
| **Earnings** | 21 Temmuz BMO |
| **Beta** | ~1.4 |
| **Son 8Q Ort. Earnings Hareketi** | ±3.0% |
| **Implied Move (EM)** | ~±3.5% (~$35.58) |
| **Sektör** | Varlık Yönetimi & ETF Lideri |
| **AUM** | ~$10.5 Trilyon |

#### Strateji 1: Bear Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $1,055 (OTM, ~%3.8 üzerinde) |
| **Buy Call** | $1,110 (daha OTM, wing $55) |
| **Kredi/Maliyet** | ~$18.00 |
| **Max Risk** | $37.00 (Wing $55 - Kredi $18) |
| **Max Kar** | $18.00 (toplanan kredi) |
| **ROI** | ~49% |
| **Breakeven** | $1,073 |
| **Delta Hedefi** | -0.10 ile -0.15 arası (ayı yönlü) |
| **Vega** | Negatif (~-$0.35) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.25/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$9 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $36 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$102 (kullanılan $55 = dar wing, agresif) |
| **PoP** | ~60% |

> **Strateji Gerekçesi:** BLK CPR 0.85/0.88 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. IV Rank %35 düşük — prim toplama sınırlı ama BLK yüksek fiyatlı ($1,016.58) hisse olduğu için kredi $18 yüksek. Bear Call Spread, hissenin $1,055 üzerine çıkmamasına bahis oynar. BLK 21 Temmuz'da earnings açıklayacak — diğer finansallardan (14-15 Temmuz) bir hafta sonra. Bu, finansal sektörün genel earnings trendini görme fırsatı sunar. Eğer diğer finansallar zayıf sonuçlar verirse, BLK de baskılanabilir. AUM akışları (outflows) earnings sürprizi riski taşır. Entry: 16-18 Temmuz. Exit: 21 Temmuz BMO sonrası 22 Temmuz sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-30 (earnings sonrası) |
| **Kazanç Kaynağı** | IV çöküşü + hissenin $1,055 altında kalması |
| **Optimal Exit** | 21 Temmuz BMO sonrası 22 Temmuz sabahı |
| **Max Hold** | 22 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** BLK IV Rank %35 düşük. Earnings sonrası IV %20-30 düşecek. Bear Call Spread $18 kredi toplar. IV crush sonrası bu primin %50-75'i eriyerek kar realize edilir. Yüksek fiyat nedeniyle kredi $18 yüksek — küçük hesaplar için uygun değil. Entry: 16-18 Temmuz. Exit: 21 Temmuz BMO sonrası 22 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 2: Mini Bear Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $1,055 (OTM) |
| **Buy Call** | $1,085 (daha OTM, wing $30) |
| **Kredi** | ~$10.00 |
| **Max Risk** | $20.00 (Wing $30 - Kredi $10) |
| **Max Kar** | $10.00 |
| **ROI** | ~50% |
| **Breakeven** | $1,065 |
| **Delta Hedefi** | -0.15 ile -0.20 arası |
| **Vega** | Negatif (~-$0.20) |
| **Theta** | Pozitif (~$0.12/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$5 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $20 zararda kapat |

> **Alternatif Gerekçesi:** Mini spread (wing $30) daha düşük margin gereksinimi sunar. BLK fiyatı yüksek olduğu için wing $55 stratejisi çok büyük risk taşır. Mini spread, küçük hesaplar için daha uygun. Ancak dar wing = hisse %3+ hareket ederse max loss. BLK son 8Q ortalama earnings hareketi ±%3.0 — wing $30 (%2.9) sınırda. Dikkatli olun. Entry: 16-18 Temmuz. Exit: 21 Temmuz BMO sonrası 22 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 3: Long Put Calendar (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Calendar Spread (Karmaşık Greeks) |
| **Sell** | 1 haftalık $1,010 Put (front month) |
| **Buy** | 4 haftalık $1,010 Put (back month) |
| **Maliyet** | ~$12.00 |
| **Max Risk** | $12.00 (ödenen prim) |
| **Max Kar** | ~$25.00 (theta decay farkı + vol expansion) |
| **ROI** | ~208% |
| **Breakeven** | ~$990 / ~$1,030 (yaklaşık) |
| **Delta** | -0.15 ile -0.25 (hafif ayı) |
| **Vega** | Pozitif (back month daha fazla Vega) |
| **Theta** | Pozitif (front month theta decay > back month) |
| **Kar Hedefi** | %50 kar = ~$6; hisse $1,010 yakınında kalırsa max kar |

> **Koruma/Hedge Gerekçesi:** Long Put Calendar, BLK'nin düşük IV (%35) ortamında ucuz hedge sağlar. Earnings öncesi front month IV şişer, earnings sonrası çöker — front month satıcısı kazanır. Back month (4 haftalık) FOMC (29 Temmuz) volatilitesini de yakalar. Eğer BLK earnings'te düşerse ($1,010 altına), put calendar kar sağlar. Eğer hisse yatay seyrederse ($1,010 civarı), theta decay farkından kar. Risk: Hisse $1,030 üzerine veya $990 altına çıkarsa zarar. Entry: 16-18 Temmuz. Exit: 21 Temmuz BMO sonrası 22 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | ⛔ Uygun strateji bulunamadı (fiyat çok yüksek) |
| $50-$200 | ⛔ Uygun strateji bulunamadı (minimum spread >$200) |
| $200-$500 | Mini Bear Call Spread ($1,055C/$1,085C) 1 kontrat | ~$250 | ~$1,000 | 1:4.0 |
| $200-$500 | Long Put Butterfly ($995P/$1,010P/$1,025P) | ~$320 | ~$680 | 1:2.1 |

> **Bütçe Uyarısı:** BLK fiyatı ~$1,016.58 ile çok yüksek. 1 kontrat = $101,658 nominal değer. Spread stratejileri bile $200+ maliyet. Bütçe dostu strateji bulunamıyor. Alternatif: Micro-options (10 hisse) varsa değerlendir. Yoksa BLK'yi bütçe stratejilerinden çıkar.

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **14-15 Temmuz** | Gözlem | Diğer finansal hisselerin earnings sonuçlarını izle — BLK için ipucu |
| **16-17 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%35), strike seçimi |
| **18-19 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-3 gün önce) |
| **21 Temmuz** | 🎯 **Earnings Günü** | BLK BMO açıklama — pozisyonu TUT |
| **22 Temmuz** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **22 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. BLK fiyatı ~$1,016.58 çok yüksek — 1 kontrat margin gereksinimi ~$3,700. Küçük hesaplar için uygun değil.
> 2. IV Rank %35 düşük — short premium stratejileri sınırlı kazanç sunar.
> 3. BLK 21 Temmuz'da — diğer finansallardan bir hafta sonra, sektör trendi belli olur.
> 4. AUM outflows (para çıkışı) BLK earnings'ini baskılar — varlık yönetimi sektörü riski.
> 5. Dar wing ($30/$55) stratejilerde hisse %4+ hareket ederse max loss.
> 6. FOMC 29 Temmuz yakın — BLK pozisyonu 22 Temmuz'da kapanmış olmalı (FOMC çakışması riski yok).
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 8. **⛔ Earnings play 2 günden fazla tutulmaz. 22 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**


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

### Sağlık Sektörü Özet Tablosu (Güncel Fiyatlar — 12 Haziran 2026)

| Hisse | Fiyat | IV30 | IV Rank | Hacim CPR | OI CPR | Beta | YTD% | Earnings |
|-------|-------|------|---------|-----------|--------|------|------|----------|
| **UNH** | **$405.55** | ~26% | 48% | **3.33** | 1.49 | 1.34 | +18.25% | 28 Temmuz |
| **JNJ** | **$238.33** | ~22% | 42% | 0.95 | 1.05 | **0.26** | +13.43% | 15 Temmuz BMO |
| **PFE** | **$26.17** | ~22% | 28% | 1.15 | 1.20 | **0.29** | +8.09% | 30 Temmuz BMO |
| **ABT** | ~$115 | ~20% | 30% | 0.95 | ~1.0 | N/A | N/A | 16 Temmuz BMO |
| **TMO** | ~$560 | ~24% | 38% | 0.85 | ~0.9 | N/A | N/A | 22 Temmuz |
| **MRK** | ~$105 | ~19% | 32% | 1.05 | ~1.0 | N/A | N/A | 31 Temmuz BMO |

---

### 7.1 UNH — $405.55 — CPR: 3.33 ⭐ EN YÜKSEK CPR

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
| **Implied Move (EM)** | ~±5.0% (~$20.28) |
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

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %25-35 (earnings sonrası) |
| **Kazanç Kaynağı** | Hisse yönü (CPR 3.33 boğa) + IV artışından pre-earnings kazanç |
| **Optimal Exit** | 28 Temmuz earnings sonrası 29 Temmuz sabahı (FOMC günü dikkatli) |
| **Max Hold** | 29 Temmuz kapanış — FOMC çakışması, 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** UNH IV Rank %48 sınırda. Earnings sonrası IV %25-35 düşecek. Long Call Spread için IV crush ZARARLIDIR. Pozisyonu 28 Temmuz earnings sonrası 29 Temmuz sabahı hemen kapat. FOMC 29 Temmuz — yarım pozisyon şart. Eğer hisse $430 üzerine çıkarsa, wing kar realize edilir. Entry: 23-25 Temmuz. Exit: 28 Temmuz earnings sonrası 29 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 2: Short Put Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $380 (OTM, ~%6.3 altında) |
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

> **Alternatif Gerekçesi:** Short Put Spread, UNH'nin güçlü boğa momentumunu (CPR 3.33, YTD +18.25) destekler. Hisse $380 altına düşmezse (50MA $385.20 yakınında), kredi $8.50 kar kalır. Eğer UNH earnings'te düşerse, $350 put koruma sağlar. Bu strateji, "high conviction bullish" görüşü olanlar için. IV crush potansiyeli %25-35 — short premium kazançlı. Not: FOMC 29 Temmuz yakınlığı — yarım pozisyon. Entry: 23-25 Temmuz. Exit: 28 Temmuz earnings sonrası 29 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 3: Protective Put (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Long Put (Long Vega, Short Delta) |
| **Buy Put** | $380 (OTM koruma) |
| **Maliyet** | ~$6.50 |
| **Max Risk** | $6.50 (ödenen prim) |
| **Max Kar** | Sınırsız (hisse $0'a düşerse) |
| **Breakeven** | $373.50 |
| **Downside Protection** | $380 (yaklaşık %6.3 aşağı koruma) |
| **Delta** | -0.30 ile -0.40 (ayı yönlü) |
| **Vega** | Pozitif (~+$0.25) |
| **Theta** | Negatif (~-$0.08/gün) |
| **Kar Hedefi** | %100 kar = hisse $373.50 altında; %50 kar = hisse $376.75 altında |
| **Hedge Kullanımı** | UNH long pozisyonu olanlar için koruma |

> **Koruma Gerekçesi:** UNH long pozisyonu olan yatırımcılar için Protective Put, FOMC (29 Temmuz) öncesi aşağı yönlü riski sınırlar. Maliyet $6.50 ile %1.6'lık bir "sigorta primi" ödenir. Eğer UNH earnings'te beklenenden kötü sonuçlar açıklarsa (medical loss ratio artışı, Medicare margin baskısı), put kar sağlar ve long hisse zararını telafi eder. FOMC volatilitesi de korunur. Not: IV crush put'a zarar verir — pozisyonu 26-27 Temmuz'da aç, 29 Temmuz FOMC sonrası kapat. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$430 (Lottery) | ~$35 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$350 (Lottery) | ~$15 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($400C/$430C) 1 kontrat | ~$320 | ~$2,680 | 1:8.4 |
| $50-$200 | Short Put Spread ($380P/$350P) 1 kontrat | ~$215 | ~$850 | 1:4.0 |
| $200-$500 | Bull Call Spread ($400C/$430C) 1 kontrat + OTM Call @$450 | ~$480 | ~$3,200+ | Karmaşık |
| $200-$500 | Long Call Butterfly ($395C/$415C/$435C) 1 kontrat | ~$280 | ~$1,720 | 1:6.1 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **23-24 Temmuz** | Hazırlık | Greeks analizi, CPR teyidi (3.33), FOMC risk değerlendirmesi |
| **25-26 Temmuz** | ⚠️ **Entry (Yarım Pozisyon)** | Normal boyutun %50'si ile pozisyon aç (FOMC yakın) |
| **27 Temmuz** | Son Entry | Son giriş fırsatı (earnings'ten 1 gün önce) |
| **28 Temmuz** | 🎯 **Earnings Günü** | UNH açıklama — pozisyonu TUT, panik YOK |
| **29 Temmuz** | 🚪 **EXIT** | **FOMC günü — pozisyonu sabah açılışta kapat. IV crush + FOMC volatilitesi** |
| **29 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. ⭐ CPR 3.33 inanılmaz yüksek — ancak bu "crowded long" riski taşır. Herkes boğa ise, sürpriz aşağı yönlü hareket şiddetli olabilir.
> 2. FOMC 29 Temmuz — UNH earnings 28 Temmuz'da. Yarım pozisyon şart. FOMC öncesi volatilite artışı pozisyonu etkiler.
> 3. UNH Beta 1.34 — piyasadan daha volatil. FOMC günü genel piyasa hareketi UNH'i sert etkiler.
> 4. Medicare/Medicaid fiyatlandırma baskısı — politik risk, earnings sürprizi yapabilir.
> 5. RSI 68.40 aşırı alım sınırına yakın — kısa vadeli geri çekilme riski.
> 6. Pozisyon büyüklüğü: FOMC yakınlığı nedeniyle normal boyutun %50'si. Hesabın %0.5-1'inden fazla risk atma.
> 7. **⛔ Earnings play 2 günden fazla tutulmaz. 29 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**

---

### 7.2 JNJ — $238.33 — CPR: 0.95

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
| **Implied Move (EM)** | ~±3.0% (~$7.15) |
| **Sektör** | İlaç & Tıbbi Cihazlar |
| **Dividend Yield** | ~3.0% |

#### Strateji 1: Long Call Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $235 (hafif ITM/ATM) |
| **Sell Call** | $250 (OTM, wing $15) |
| **Maliyet** | ~$6.50 |
| **Max Risk** | $6.50 (ödenen prim) |
| **Max Kar** | $8.50 (Wing $15 - Maliyet $6.50) |
| **ROI** | ~131% |
| **Breakeven** | $241.50 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.15) |
| **Theta** | Negatif (~-$0.05/gün) |
| **Kar Hedefi** | %50 kar = hisse $246.75; %100 kar = hisse $250 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $3.25 zararda kapat |
| **Hedge Kullanımı** | JNJ long pozisyonu olanlar için upside leverage |

> **Strateji Gerekçesi:** JNJ Beta 0.26 ile piyasaya göre çok düşük volatilite — "sakin" hisse. Düşük beta değeriyle portföy çeşitlendirmesi için ideal. IV Rank %42 orta — long spread için IV çok yüksek değil, makul. JNJ 15 Temmuz'da earnings açıklayacak — FOMC'den (29 Temmuz) uzak, temiz dönem. Son 8Q ortalama earnings hareketi ±%2.5 çok sınırlı — hisse büyük hareket yapmaz. Long Call Spread, sınırlı upside'tan kaldıraçlı kar sağlar. Wing $15 = fiyatın ~%6.3'i, EM (~%3.0) dışında güvenli bölge. JNJ dividend yield %3.0 ile yüksek temettü — long-term hold değeri yüksek. Eğer earnings beat gelirse, hisse $250'a kadar yükselebilir. Entry: 10-13 Temmuz. Exit: 15 Temmuz BMO sonrası 16 Temmuz sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-30 (earnings sonrası) |
| **Kazanç Kaynağı** | Hisse yönü (IV düşük, crush sınırlı) |
| **Optimal Exit** | 15 Temmuz BMO sonrası 16 Temmuz sabahı |
| **Max Hold** | 16 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** JNJ IV Rank %42 orta. Earnings sonrası IV %20-30 düşecek ama düşük başlangıç nedeniyle crush sınırlı. Long Call Spread için IV crush ZARARLIDIR. Pozisyonu 15 Temmuz BMO sonrası 16 Temmuz sabahı hemen kapat. Eğer hisse $250 üzerine çıkarsa, wing kar realize edilir. Entry: 10-13 Temmuz. Exit: 15 Temmuz BMO sonrası 16 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 2: Call Calendar Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Calendar / Time Spread (Karmaşık Greeks) |
| **Sell** | 1 haftalık $240 Call (front month) |
| **Buy** | 3 haftalık $240 Call (back month) |
| **Maliyet** | ~$2.50 |
| **Max Risk** | $2.50 (ödenen prim) |
| **Max Kar** | ~$5.00 (theta decay farkından) |
| **ROI** | ~200% |
| **Breakeven** | ~$235 / ~$245 (yaklaşık) |
| **Delta** | +0.10 ile +0.20 (hafif boğa) |
| **Vega** | Pozitif (back month daha fazla Vega) |
| **Theta** | Pozitif (front month theta decay > back month) |
| **Kar Hedefi** | %50 kar = ~$1.25; hisse $240 yakınında kalırsa max kar |

> **Alternatif Gerekçesi:** JNJ düşük IV (%22) ve düşük beta (0.26) ile calendar spread için ideal aday. Earnings öncesi front month IV şişer, earnings sonrası çöker — front month satıcısı kazanır. Back month (3 haftalık) theta decay farkından kar. JNJ sınırlı hareket (±%2.5) ile hisse $240 yakınında kalma olasılığı yüksek. Risk: Hisse $245 üzerine veya $235 altına çıkarsa zarar. Not: Calendar spread, JNJ'nin "sakin" karakterine uygun. Entry: 10-13 Temmuz. Exit: 15 Temmuz BMO sonrası 16 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 3: Asimetrik Call Spread (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $235 (hafif ITM) |
| **Sell Call** | $245 (OTM, wing $10) |
| **Maliyet** | ~$4.50 |
| **Max Risk** | $4.50 (ödenen prim) |
| **Max Kar** | $5.50 (Wing $10 - Maliyet $4.50) |
| **ROI** | ~122% |
| **Breakeven** | $239.50 |
| **Delta** | +0.50 ile +0.60 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.12) |
| **Theta** | Negatif (~-$0.04/gün) |
| **Kar Hedefi** | %50 kar = hisse $242.25; %100 kar = hisse $245 üzeri |
| **Hedge Kullanımı** | JNJ long pozisyonu olanlar için upside leverage (düşük maliyet) |

> **Koruma Gerekçesi:** Asimetrik Call Spread (wing $10), standart call spread'e (wing $15) göre daha düşük maliyet sunar. JNJ long pozisyonu olanlar için ucuz upside leverage. Eğer JNJ earnings'te beat açıklarsa, hisse $245'a kadar yükselebilir. Maliyet $4.50 ile %1.9'lık bir "kaldıraç primi" ödenir. Not: Dar wing ($10) = hisse $245 üzerine çıkarsa max kar sınırlı. Standart spread (wing $15) daha fazla kar potansiyeli sunar. Entry: 10-13 Temmuz. Exit: 15 Temmuz BMO sonrası 16 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$250 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$215 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($235C/$250C) 1 kontrat | ~$325 | ~$850 | 1:2.6 |
| $50-$200 | Call Calendar ($240C, 1W/3W) 2 kontrat | ~$250 | ~$500 | 1:2.0 |
| $200-$500 | Long Call Butterfly ($233C/$240C/$247C) 2 kontrat | ~$380 | ~$1,120 | 1:2.9 |
| $200-$500 | Asimetrik Call Spread ($235C/$245C) 2 kontrat | ~$450 | ~$1,100 | 1:2.4 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, Beta teyidi (0.26), IV Rank kontrolü |
| **11-13 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-4 gün önce) |
| **15 Temmuz** | 🎯 **Earnings Günü** | JNJ BMO açıklama — pozisyonu TUT |
| **16 Temmuz** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **16 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. JNJ Beta 0.26 çok düşük — upside potansiyeli sınırlı. Call spread karı sınırlı kalabilir.
> 2. JNJ "sakin" hisse — büyük earnings sürprizleri nadirdir. "Boring but reliable".
> 3. İlaç patent sürelerinin dolması (Stelara, Darzalex) earnings baskısı yapabilir.
> 4. Talc litigation riski (mahkeme davaları) ani düşüşlere neden olabilir.
> 5. Düşük IV (%22) = ucuz opsiyon primleri — long stratejiler için uygun, short stratejiler için sınırlı.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 7. **⛔ Earnings play 2 günden fazla tutulmaz. 16 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**

---

### 7.3 PFE — $26.17 — CPR: 1.17

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
| **Implied Move (EM)** | ~±3.5% (~$0.92) |
| **Sektör** | İlaç (Big Pharma) |
| **Dividend Yield** | **~6.61% (Çok yüksek!)** |
| **FOMC Çakışması** | FOMC sonrası (29 Temmuz) — temiz dönem! |

#### Strateji 1: Bull Put Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $25 (OTM, ~%4.5 altında) |
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

> **Strateji Gerekçesi:** PFE fiyat $26.17 çok düşük — spread küçük (wing $3). Ancak bu, küçük sermaye ile çoklu kontrat (10 kontrat = ~$550 kredi, ~$2,450 risk) imkanı sunar. Dividend yield %6.61 ile yüksek temettü getirisi — hisse $25 altına düşerse atama olsa bile, %6.61 temettü ile uzun vadeli hold değeri yüksek. CPR 1.15/1.20 hafif boğa — piyasa hafif bullish beklenti içinde. IV Rank %28 düşük — short premium sınırlı ama PFE düşük fiyatlı olduğu için ROI makul. FOMC sonrası (30 Temmuz) — temiz dönem, FOMC volatilitesi etkilemez. PFE 200MA ($26.45) altında — hafif ayı trend, ancak 50MA ($25.90) üzerinde. Bull Put Spread, hissenin $25 üzerinde kalmasına bahis oynar. Entry: 25-27 Temmuz. Exit: 30 Temmuz BMO sonrası 31 Temmuz sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-30 (earnings sonrası) |
| **Kazanç Kaynağı** | IV çöküşü + hissenin $25 üzerinde kalması |
| **Optimal Exit** | 30 Temmuz BMO sonrası 31 Temmuz sabahı |
| **Max Hold** | 31 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** PFE IV Rank %28 düşük. Earnings sonrası IV %20-30 düşecek. Bull Put Spread $0.55 kredi toplar. IV crush sonrası bu primin %50-75'i eriyerek kar realize edilir. Eğer hisse $25 üzerinde kalırsa, kredi tamamı korunur. 200MA $26.45 yakınında — uzun vadeli direnç. Entry: 25-27 Temmuz. Exit: 30 Temmuz BMO sonrası 31 Temmuz sabahı. **>2 gün tutma YASAK.**

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

> **Alternatif Gerekçesi:** PFE düşük fiyatlı ($26.17) hisse — call spread maliyeti çok düşük ($0.90). 10 kontrat = $90 maliyet, $210 max kar. Bu, küçük hesaplar için ideal kaldıraç. Eğer PFE earnings'te beat açıklarsa (pipeline güncellemesi, yeni ilaç onayı), hisse $29'a kadar yükselebilir. Ancak IV crush riski var — pozisyonu 27-28 Temmuz'da aç, 30 Temmuz BMO sonrası 31 Temmuz sabahı hemen değerlendir. Not: PFE RSI 42.80 ayıcak bölgede — upside potansiyeli sınırlı olabilir.

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

> **Koruma/Hedge Gerekçesi:** Cash-secured put, PFE'yi "indirimli" alma stratejisidir. PFE dividend yield %6.61 ile yüksek temettü — atama sonrası uzun vadeli hold değeri yüksek. Eğer PFE earnings'te düşerse ve $25 altında kapanırsa, 100 hisse $25'den alınır (gerçek maliyet $24.65). Eğer hisse $25 üzerinde kalırsa, $35 kredi kazanılır. 10 kontrat = $350 kredi, $24,650 potansiyel atama riski. Not: $2,465 per kontrat margin — hesapta yeterli nakit olmalı. Entry: 25-27 Temmuz. Exit: 30 Temmuz BMO sonrası 31 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$29 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$22 (Lottery) | ~$8 | Sınırsız | Spekülatif |
| $50-$200 | Bull Put Spread ($25P/$22P) 5 kontrat | ~$275 | ~$1,225 | 1:4.5 |
| $50-$200 | Long Call Spread ($26C/$29C) 5 kontrat | ~$225 | ~$1,050 | 1:4.7 |
| $200-$500 | Cash-Secured Put ($25P) 10 kontrat | ~$350 kredi | $350 | 1:0.1 (ama hisse biriktirme) |
| $200-$500 | Long Call Butterfly ($25C/$27C/$29C) 8 kontrat | ~$320 | ~$1,280 | 1:4.0 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **25-26 Temmuz** | Hazırlık | Greeks analizi, dividend yield teyidi (%6.61), FOMC sonrası temiz dönem |
| **27-28 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-3 gün önce) |
| **29 Temmuz** | FOMC | PFE pozisyonu açık — FOMC sonrası volatilite etkileyebilir (dikkatli izle) |
| **30 Temmuz** | 🎯 **Earnings Günü** | PFE BMO açıklama — pozisyonu TUT |
| **31 Temmuz** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **31 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. PFE RSI 42.80 ayıcak bölgede — upside potansiyeli sınırlı. "Value trap" riski.
> 2. PFE 200MA ($26.45) altında — uzun vadeli trend hafif ayı. Dikkatli olun.
> 3. İlaç patent sürelerinin dolması (Eliquis, Ibrance) earnings baskısı yapabilir.
> 4. COVID-19 aşı/ilaç gelirlerinde düşüş (Comirnaty, Paxlovid) devam ediyor.
> 5. Düşük IV (%28) = ucuz opsiyon primleri — short stratejiler sınırlı kazanç.
> 6. FOMC 29 Temmuz — PFE earnings 30 Temmuz'da. FOMC sonrası volatilite taşıyabilir.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 8. **⛔ Earnings play 2 günden fazla tutulmaz. 31 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**


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

> **Strateji Gerekçesi:** ABT tam nötr CPR (0.95/1.00) ve IV Rank %30 (düşük) ile long call spread için ideal aday. IV çok düşük (%20) — opsiyon primleri ucuz. Eğer ABT earnings'te beat açıklarsa (tıbbi cihaz satışları, tanı bölümü büyümesi), call spread kaldıraçlı kar sağlar. ABT 16 Temmuz'da earnings açıklayacak — FOMC'den (29 Temmuz) uzak, temiz dönem. 50MA (~$113) ve 200MA (~$110) üzerinde — teknik görünüm pozitif. Wing $10 = fiyatın ~%8.7'si, EM (~%3.5) dışında güvenli bölge. ABT Beta ~0.7 düşük — sınırlı hareket beklenir, butterfly stratejisi de uygun. Entry: 11-14 Temmuz. Exit: 16 Temmuz BMO sonrası 17 Temmuz sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-30 (earnings sonrası) |
| **Kazanç Kaynağı** | Hisse yönü (IV düşük, crush sınırlı) |
| **Optimal Exit** | 16 Temmuz BMO sonrası 17 Temmuz sabahı |
| **Max Hold** | 17 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** ABT IV Rank %30 çok düşük. Earnings sonrası IV %20-30 düşecek ama düşük başlangıç nedeniyle crush sınırlı. Long Call Spread için IV crush ZARARLIDIR. Pozisyonu 16 Temmuz BMO sonrası 17 Temmuz sabahı hemen kapat. Eğer hisse $125 üzerine çıkarsa, wing kar realize edilir. Entry: 11-14 Temmuz. Exit: 16 Temmuz BMO sonrası 17 Temmuz sabahı. **>2 gün tutma YASAK.**

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

> **Alternatif Gerekçesi:** ABT IV Rank %30 düşük — Iron Condor prim toplama potansiyeli sınırlı ($2 kredi). Ancak ABT düşük beta (~0.7) ve sınırlı earnings hareketi (±%3.0) ile hisse $105-$125 aralığında kalma olasılığı yüksek. Dar wing ($10) = yüksek risk/ödül. Bu strateji, "sakin hisse, sınırlı kazanç" arayanlar için. Not: IV Rank %30 < %50 — "ideal" IC adayı değil, deneyimli traderlar için. Entry: 11-14 Temmuz. Exit: 16 Temmuz BMO sonrası 17 Temmuz sabahı. **>2 gün tutma YASAK.**

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

> **Koruma/Hedge Gerekçesi:** Long Call Butterfly, ABT'nin düşük IV (%20) ve sınırlı hareket (±%3.0) karakterine uygun. Hisse $115 civarında kalırsa (tam nötr CPR destekler), butterfly maksimum kar sağlar. Maliyet $1.80 çok düşük — 5 kontrat = $90 maliyet, $160 max kar. Bu, küçük hesaplar için ideal. Risk: Hisse $111.80 altına veya $118.20 üzerine çıkarsa zarar. Not: Butterfly likidite riski taşır — bid-ask spread yüksek olabilir. Entry: 11-14 Temmuz. Exit: 16 Temmuz BMO sonrası 17 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$125 (Lottery) | ~$15 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$105 (Lottery) | ~$10 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Butterfly ($110C/$115C/$120C) 3 kontrat | ~$270 | ~$480 | 1:1.8 |
| $50-$200 | Long Call Spread ($115C/$125C) 1 kontrat | ~$175 | ~$325 | 1:1.9 |
| $200-$500 | Iron Condor ($105P/$95P + $125C/$135C) 2 kontrat | ~$400 | ~$800 | 1:2.0 |
| $200-$500 | Long Call Butterfly ($110C/$115C/$120C) 6 kontrat | ~$540 | ~$960 | 1:1.8 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **9-10 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%30 — düşük), Beta kontrolü (~0.7) |
| **11-14 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-5 gün önce) |
| **16 Temmuz** | 🎯 **Earnings Günü** | ABT BMO açıklama — pozisyonu TUT |
| **17 Temmuz** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **17 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. ABT IV Rank %30 çok düşük — short premium stratejileri (IC, short straddle) sınırlı kazanç sunar.
> 2. ABT Beta ~0.7 düşük — upside potansiyeli sınırlı. Call spread karı sınırlı kalabilir.
> 3. Tıbbi cihaz bölümünde rekabet (Dexcom, Medtronic) pazar payı baskısı yapabilir.
> 4. Tanı (diagnostics) bölümünde COVID-19 test gelirlerinde düşüş devam ediyor.
> 5. Butterfly stratejilerinde likidite riski — bid-ask spread yüksek olabilir.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 7. **⛔ Earnings play 2 günden fazla tutulmaz. 17 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**

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

> **Strateji Gerekçesi:** TMO CPR 0.85/0.90 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. IV Rank %38 düşük — prim toplama sınırlı ama TMO yüksek fiyatlı ($560) hisse olduğu için kredi $8.50 yüksek. Bear Call Spread, hissenin $585 üzerine çıkmamasına bahis oynar. TMO 22 Temmuz'da earnings açıklayacak — FOMC'den (29 Temmuz) uzak, temiz dönem. 50MA (~$545) ve 200MA (~$520) üzerinde — teknik görünüm pozitif ama CPR ayı. "Teknik pozitif, sentiment negatif" çelişkisi — bear call spread, sentiment tarafını oynar. Not: TMO laboratuvar hizmetleri bölümünde COVID-19 test gelirlerinde düşüş devam ediyor — earnings baskısı riski. Entry: 17-20 Temmuz. Exit: 22 Temmuz earnings sonrası 23 Temmuz sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-30 (earnings sonrası) |
| **Kazanç Kaynağı** | IV çöküşü + hissenin $585 altında kalması |
| **Optimal Exit** | 22 Temmuz earnings sonrası 23 Temmuz sabahı |
| **Max Hold** | 23 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** TMO IV Rank %38 düşük. Earnings sonrası IV %20-30 düşecek. Bear Call Spread $8.50 kredi toplar. IV crush sonrası bu primin %50-75'i eriyerek kar realize edilir. Wing $30 dar — hisse $615 üzerine çıkarsa max loss. Entry: 17-20 Temmuz. Exit: 22 Temmuz earnings sonrası 23 Temmuz sabahı. **>2 gün tutma YASAK.**

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

> **Alternatif Gerekçesi:** Eğer TMO earnings'te zayıf sonuçlar açıklarsa (laboratuvar hizmetleri düşüşü, biyoteknoloji harcamalarında yavaşlama), put spread kaldıraçlı kar sağlar. CPR 0.85/0.90 ayı bias destekler. Ancak IV crush riski var — pozisyonu 19-20 Temmuz'da aç, 22 Temmuz earnings sonrası 23 Temmuz sabahı hemen değerlendir. Not: TMO Beta ~0.8 düşük — aşağı yönlü hareket sınırlı olabilir. Entry: 17-20 Temmuz. Exit: 22 Temmuz earnings sonrası 23 Temmuz sabahı. **>2 gün tutma YASAK.**

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

> **Koruma Gerekçesi:** TMO long pozisyonu olan yatırımcılar için Protective Collar, aşağı yönlü riski sınırlar ($530 koruma) ve maliyeti short call kredisi ile düşürür. Net maliyet $2.00 çok düşük — "ucuz sigorta". Eğer TMO earnings'te patlarsa, upside $600 ile sınırlı (call atama). Eğer TMO düşerse, $530 put zararı sınırlar. Entry: 17-20 Temmuz. Exit: 22 Temmuz earnings sonrası 23 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | ⛔ Uygun strateji bulunamadı (fiyat çok yüksek) |
| $50-$200 | ⛔ Uygun strateji bulunamadı (minimum spread >$200) |
| $200-$500 | Bear Call Spread ($585C/$615C) 1 kontrat | ~$250 | ~$850 | 1:3.4 |
| $200-$500 | Long Put Spread ($550P/$520P) 1 kontrat | ~$300 | ~$2,700 | 1:9.0 |

> **Bütçe Uyarısı:** TMO fiyatı ~$560 ile yüksek. 1 kontrat = $56,000 nominal değer. Spread stratejileri $200+ maliyet. Bütçe dostu strateji sınırlı. Alternatif: Micro-options (10 hisse) varsa değerlendir.

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **16-17 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%38), CPR analizi (0.85 ayı) |
| **18-20 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-4 gün önce) |
| **22 Temmuz** | 🎯 **Earnings Günü** | TMO açıklama — pozisyonu TUT |
| **23 Temmuz** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **23 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. TMO fiyatı ~$560 yüksek — 1 kontrat margin gereksinimi ~$2,150. Küçük hesaplar için uygun değil.
> 2. IV Rank %38 düşük — short premium stratejileri sınırlı kazanç sunar.
> 3. TMO CPR 0.85/0.90 hafif ayı — ancak 50MA/200MA üzerinde teknik pozitif. Çelişkili sinyal.
> 4. Laboratuvar hizmetleri bölümünde COVID-19 test gelirlerinde düşüş devam ediyor.
> 5. Biyoteknoloji harcamalarında yavaşlama (faiz oranları yüksek) TMO'yu etkiler.
> 6. Dar wing ($30) stratejilerde hisse %6+ hareket ederse max loss.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 8. **⛔ Earnings play 2 günden fazla tutulmaz. 23 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**

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

> **Strateji Gerekçesi:** MRK hafif boğa CPR (1.05) ve IV Rank %32 (düşük) ile long call spread için uygun aday. IV çok düşük (%19) — opsiyon primleri çok ucuz. Eğer MRK earnings'te beat açıklarsa (Keytruda satışları, yeni pipeline güncellemeleri), call spread kaldıraçlı kar sağlar. MRK 31 Temmuz'da earnings açıklayacak — FOMC (29 Temmuz) sonrası, temiz dönem. 50MA (~$103) ve 200MA (~$100) üzerinde — teknik görünüm pozitif. Wing $10 = fiyatın ~%9.5'i, EM (~%3.2) dışında güvenli bölge. MRK Beta ~0.3 çok düşük — sınırlı hareket beklenir. Dividend yield %2.8 ile temettü değeri yüksek. Entry: 26-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-30 (earnings sonrası) |
| **Kazanç Kaynağı** | Hisse yönü (IV çok düşük, crush sınırlı) |
| **Optimal Exit** | 31 Temmuz BMO sonrası 1 Ağustos sabahı |
| **Max Hold** | 1 Ağustos kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** MRK IV Rank %32 düşük. Earnings sonrası IV %20-30 düşecek ama düşük başlangıç nedeniyle crush sınırlı. Long Call Spread için IV crush ZARARLIDIR. Pozisyonu 31 Temmuz BMO sonrası 1 Ağustos sabahı hemen kapat. Eğer hisse $115 üzerine çıkarsa, wing kar realize edilir. Entry: 26-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

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

> **Alternatif Gerekçesi:** Bull Put Spread, MRK'nin güçlü temettü değeri (%2.8) ve düşük beta (0.3) ile "sakin" karakterini destekler. Hisse $100 altına düşmezse (200MA ~$100 yakınında), kredi $1.20 kar kalır. Eğer MRK earnings'te düşerse, $92 put koruma sağlar. Atama riski: hisse $100 altına düşerse, 100 hisse $100'den alınır. Dividend yield %2.8 ile uzun vadeli hold değeri yüksek. Not: IV Rank %32 düşük — short premium sınırlı kazanç. Entry: 26-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

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

> **Koruma/Hedge Gerekçesi:** Call Calendar Spread, MRK'nin düşük IV (%19) ve sınırlı hareket (±%2.8) karakterine uygun. Earnings öncesi front month IV şişer, earnings sonrası çöker — front month satıcısı kazanır. Back month (3 haftalık) theta decay farkından kar. MRK sınırlı hareket ile $105 yakınında kalma olasılığı yüksek. Maliyet $1.50 çok düşük — 5 kontrat = $75 maliyet, $150 max kar. Risk: Hisse $108 üzerine veya $102 altına çıkarsa zarar. Entry: 26-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$115 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$92 (Lottery) | ~$8 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($105C/$115C) 3 kontrat | ~$420 | ~$1,080 | 1:2.6 |
| $50-$200 | Bull Put Spread ($100P/$92P) 3 kontrat | ~$360 | ~$360 | 1:1.0 |
| $200-$500 | Long Call Butterfly ($102C/$105C/$108C) 5 kontrat | ~$375 | ~$875 | 1:2.3 |
| $200-$500 | Call Calendar ($105C, 1W/3W) 4 kontrat | ~$300 | ~$600 | 1:2.0 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **25-26 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%32 — düşük), Beta kontrolü (~0.3) |
| **27-29 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-4 gün önce) |
| **29 Temmuz** | FOMC | MRK pozisyonu açık — FOMC sonrası volatilite etkileyebilir (dikkatli izle) |
| **31 Temmuz** | 🎯 **Earnings Günü** | MRK BMO açıklama — pozisyonu TUT |
| **1 Ağustos** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **1 Ağustos kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. MRK IV Rank %32 çok düşük — short premium stratejileri sınırlı kazanç sunar.
> 2. MRK Beta ~0.3 çok düşük — upside potansiyeli sınırlı. Call spread karı sınırlı kalabilir.
> 3. Keytruda patent süresinin dolması (2028) yaklaşıyor — piyasa endişeleri başlayabilir.
> 4. İlaç fiyatlandırma baskısı (IRA, Medicare müzakereleri) earnings etkileyebilir.
> 5. FOMC 29 Temmuz — MRK earnings 31 Temmuz'da. FOMC sonrası volatilite taşıyabilir.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 7. **⛔ Earnings play 2 günden fazla tutulmaz. 1 Ağustos kapanışa kadar pozisyon KAPANMIŞ olmalı.**


---

## 8. ENERJİ HİSSELERİ STRATEJİLERİ

> **Enerji Sektörü Makro Analizi:**
> Temmuz 2026'da 2 enerji devi (XOM, CVX) 31 Temmuz BMO'da earnings açıklayacak. Petrol fiyatları $89-91 aralığında — enerji sektörüne pozitif. Enerji sektörü EN YÜKSEK IV crush potansiyelini sunuyor (%30-40) — short premium stratejileri için ideal. XOM CPR 2.50 ile güçlü boğa beklentisi var. CVX CPR ~1.50 ile hafif boğa. Enerji sektörü yüksek beta (0.8-0.9) ile piyasaya paralel hareket eder. FOMC 29 Temmuz — enerji hisseleri 31 Temmuz'da, FOMC sonrası temiz dönem. Ancak FOMC sonrası volatilite taşıyabilir. Sektör riskleri: (1) Petrol fiyatlarında ani düşüş (OPEC+ kararları), (2) Enerji geçişi (renewable) baskısı, (3) Karbon vergisi/regülasyon riski, (4) Küresel ekonomik yavaşlama talep düşüşü.
>
> **IV Crush Profili:** Yüksek (%30-40). Enerji hisseleri earnings öncesi volatiliteyi şişirir, earnings sonrası hızla çöker. Short straddle/strangle ve Iron Condor için ideal ortam.

### Enerji Sektörü Özet Tablosu (Güncel Fiyatlar — 12 Haziran 2026)

| Hisse | Fiyat | IV30 | IV Rank | Hacim CPR | OI CPR | Beta | YTD% | Earnings |
|-------|-------|------|---------|-----------|--------|------|------|----------|
| **XOM** | **$146.60** | ~28% | ~35% | **2.50** | 1.24 | 0.85 | -3.85% | 31 Temmuz BMO |
| **CVX** | **$185.82** | ~26% | ~45% | ~1.50 | ~1.20 | 0.90 | N/A | 31 Temmuz BMO |

---

### 8.1 XOM — $146.60 — CPR: 2.50 ⭐ EN YÜKSEK ENERJİ CPR

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 45.20 (Nötr-ayıcak, momentum hafif negatif) |
| **50MA** | $154.30 (fiyat altında, kısa vadeli trend hafif ayı) |
| **200MA** | $148.80 (fiyat altında, uzun vadeli trend hafif ayı) |
| **IV30** | ~28% |
| **IV Rank** | ~35% (Düşük-orta — long spread tercih, short spread sınırda) |
| **Hacim CPR** | **2.50 (Güçlü boğa! Call hacmi put hacminden 2.5 kat fazla)** |
| **OI CPR** | 1.24 (Boğa — açık call pozisyonları put'lardan %24 fazla) |
| **Beta** | 0.85 |
| **YTD** | -3.85% (Sektörde negatif, petrol fiyatlarına duyarlı) |
| **Earnings** | 31 Temmuz BMO |
| **Son 8Q Ort. Earnings Hareketi** | ±4.0% |
| **Implied Move (EM)** | ~±4.5% (~$6.60) |
| **Sektör** | Entegre Petrol & Gaz |
| **FOMC Çakışması** | FOMC sonrası (29 Temmuz) — temiz dönem ama FOMC volatilitesi taşıyabilir |

#### Strateji 1: Bull Put Spread (Ana) ⭐

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $140 (OTM, ~%4.5 altında) |
| **Buy Put** | $130 (daha OTM, wing $10) |
| **Kredi** | ~$2.80 |
| **Max Risk** | $7.20 (Wing $10 - Kredi $2.80) |
| **Max Kar** | $2.80 (toplanan kredi) |
| **ROI** | ~39% |
| **Breakeven** | $137.20 |
| **Delta Hedefi** | +0.15 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.12) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.05/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.40 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $5.60 zararda kapat |
| **PoP** | ~62% |
| **Atama Riski** | Hisse $140 altında kapanırsa 100 hisse alım zorunluluğu |

> **⭐ Strateji Gerekçesi:** XOM CPR 2.50 ile enerji sektörünün en güçlü boğa sinyalini veriyor. Call hacmi put hacminden 2.5 kat fazla — piyasa güçlü bullish beklenti içinde. Ancak YTD -3.85% negatif — bu "catch-up trade" potansiyeli taşır. 50MA ($154.30) altında ve 200MA ($148.80) altında — teknik görünüm hafif ayı. Bull Put Spread, hissenin $140 üzerinde kalmasına bahis oynar. Enerji sektörü EN yüksek IV crush (%30-40) — short premium kazançlı. FOMC 29 Temmuz sonrası — 31 Temmuz earnings, temiz dönem. Petrol fiyatları $89-91 aralığında — XOM için pozitif. Entry: 26-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %30-40 (earnings sonrası — ENERJİ YÜKSEK CRUSH) |
| **Kazanç Kaynağı** | IV çöküşü + hissenin $140 üzerinde kalması |
| **Optimal Exit** | 31 Temmuz BMO sonrası 1 Ağustos sabahı |
| **Max Hold** | 1 Ağustos kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** XOM IV Rank %35 sınırda ama ENERJİ SEKTÖRÜ yüksek crush (%30-40) sunar. Bull Put Spread $2.80 kredi toplar. Earnings sonrası IV %30-40 düşecek — bu, primin büyük bölümünün erimesi anlamına gelir. Eğer hisse $140 üzerinde kalırsa, kredi tamamı korunur. Entry: 26-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $145 (hafif ITM/ATM) |
| **Sell Call** | $155 (OTM, wing $10) |
| **Maliyet** | ~$4.50 |
| **Max Risk** | $4.50 (ödenen prim) |
| **Max Kar** | $5.50 (Wing $10 - Maliyet $4.50) |
| **ROI** | ~122% |
| **Breakeven** | $149.50 |
| **Delta** | +0.50 ile +0.60 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.15) |
| **Theta** | Negatif (~-$0.05/gün) |
| **Kar Hedefi** | %50 kar = hisse $152.25; %100 kar = hisse $155 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $2.25 zararda kapat |
| **Hedge Kullanımı** | XOM long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer XOM earnings'te beat açıklarsa (yukarı yönlü üretim rehberliği, düşük maliyet yapısı), call spread kaldıraçlı kar sağlar. CPR 2.50 güçlü boğa momentumunu destekler. Ancak IV crush riski var — pozisyonu 28-29 Temmuz'da aç, 31 Temmuz BMO sonrası 1 Ağustos sabahı hemen değerlendir. Not: XOM YTD -3.85% negatif — upside potansiyeli var ama "value trap" riski de taşır. Entry: 26-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

#### Strateji 3: Short Strangle (Koruma/Hedge — Deneyimli)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Nötr Delta) |
| **Sell Call** | $160 (OTM, ~%9.1 üzerinde) |
| **Sell Put** | $135 (OTM, ~%7.9 altında) |
| **Kredi** | ~$3.50 |
| **Max Risk** | Sınırsız (yukarı) / büyük (aşağı, hisse $0'a düşerse) |
| **Max Kar** | $3.50 (toplanan kredi) |
| **ROI** | ~2.4% (kısa vadeli) |
| **Breakeven'lar** | $163.50 (üst) / $131.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 (nötr) |
| **Vega** | Negatif (~-$0.20) — IV crush'tan maksimum kazanç |
| **Theta** | Pozitif (~$0.10/gün) — maksimum theta decay |
| **Gamma** | Yüksek (kısa vade) — büyük risk |
| **Kar Hedefi** | %25 mekanik exit = ~$0.88 kar (short strangle için düşük hedef) |
| **Stop Loss** | 1.5x kredi = pozisyonu $5.25 zararda kapat |
| **Wing Genişliği** | $25 (geniş — EM %4.5 dışında güvenli bölge) |

> **Koruma/Hedge Gerekçesi:** Short Strangle, IV crush'tan maksimum kazanç sağlayan stratejidir. XOM IV Rank %35 sınırda ama enerji sektörü yüksek crush (%30-40) sunar. OTM strangle $3.50 kredi toplar — hisse $135-$160 aralığında kalırsa kar. Wing $25 geniş — EM (~%4.5) dışında güvenli bölge. Ancak risk YÜKSEK — hisse $163.50 üzerine veya $131.50 altına çıkarsa zarar sınırsız (yukarı) veya büyük (aşağı). Bu strateji SADECE deneyimli traderlar için. Pozisyon büyüklüğü: Hesabın %0.5'inden fazla risk atma. Entry: 28-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$160 (Lottery) | ~$22 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$130 (Lottery) | ~$15 | Sınırsız | Spekülatif |
| $50-$200 | Bull Put Spread ($140P/$130P) 2 kontrat | ~$280 | ~$720 | 1:2.6 |
| $50-$200 | Long Call Spread ($145C/$155C) 1 kontrat | ~$225 | ~$775 | 1:3.4 |
| $200-$500 | Short Strangle ($160C/$135P) 1 kontrat | ~$350 kredi | $350 | 1:0.1 (ama yüksek PoP) |
| $200-$500 | Long Call Butterfly ($143C/$149C/$155C) 2 kontrat | ~$380 | ~$1,020 | 1:2.7 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **25-26 Temmuz** | Hazırlık | Greeks analizi, petrol fiyatları kontrolü ($89-91), CPR teyidi (2.50) |
| **27-29 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-4 gün önce) |
| **31 Temmuz** | 🎯 **Earnings Günü** | XOM BMO açıklama — pozisyonu TUT |
| **1 Ağustos** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **1 Ağustos kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. XOM YTD -3.85% negatif — "catch-up" veya "lagging weakness" olabilir. Dikkatli olun.
> 2. FOMC 29 Temmuz — XOM earnings 31 Temmuz'da. FOMC sonrası volatilite taşıyabilir.
> 3. Petrol fiyatları $89-91 aralığında — ani düşüş (OPEC+ kararı) XOM'u baskılar.
> 4. Short Strangle ÇOK RİSKLİ — sınırsız yukarı risk. Sadece deneyimli traderlar.
> 5. XOM 50MA ($154.30) ve 200MA ($148.80) altında — kısa vadeli momentum negatif. CPR 2.50 ile çelişki.
> 6. Enerji geçişi (renewable) baskısı uzun vadeli risk — kısa vadeli earnings etkileyebilir.
> 7. Pozisyon büyüklüğü: IC/Bull Put için %1-2, Short Strangle için %0.5'den fazla risk atma.
> 8. **⛔ Earnings play 2 günden fazla tutulmaz. 1 Ağustos kapanışa kadar pozisyon KAPANMIŞ olmalı.**

---

### 8.2 CVX — $185.82 — CPR: ~1.50

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 55.00 (Nötr-boğa, momentum dengeli) |
| **50MA** | ~$182 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | ~$170 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~26% |
| **IV Rank** | ~45% (Orta — IC sınırda, spread stratejileri uygun) |
| **Hacim CPR** | ~1.50 (Boğa — call hacmi put hacminden %50 yüksek) |
| **OI CPR** | ~1.20 (Boğa — açık call pozisyonları put'lardan %20 fazla) |
| **Beta** | 0.90 |
| **YTD** | +24.24% (Yahoo Finance, 11 Haziran 2026) |
| **Earnings** | 31 Temmuz BMO |
| **Son 8Q Ort. Earnings Hareketi** | ±3.8% |
| **Implied Move (EM)** | ~±4.2% (~$7.80) |
| **Sektör** | Entegre Petrol & Gaz |
| **FOMC Çakışması** | FOMC sonrası (29 Temmuz) — temiz dönem ama FOMC volatilitesi taşıyabilir |
| **Dividend Yield** | ~3.8% |

#### Strateji 1: Bull Put Spread (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Hafif Long Delta) |
| **Sell Put** | $178 (OTM, ~%4.2 altında) |
| **Buy Put** | $168 (daha OTM, wing $10) |
| **Kredi** | ~$2.50 |
| **Max Risk** | $7.50 (Wing $10 - Kredi $2.50) |
| **Max Kar** | $2.50 (toplanan kredi) |
| **ROI** | ~33% |
| **Breakeven** | $175.50 |
| **Delta Hedefi** | +0.15 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.10) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.04/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $5.00 zararda kapat |
| **PoP** | ~60% |
| **Atama Riski** | Hisse $178 altında kapanırsa 100 hisse alım zorunluluğu |

> **Strateji Gerekçesi:** CVX CPR ~1.50 ile hafif boğa — piyasa bullish beklenti içinde. IV Rank %45 sınırda — Bull Put Spread prim toplama makul. CVX 31 Temmuz'da earnings açıklayacak — XOM ile aynı gün, aynı sektör. Bu, "sektör etkisi" riski taşır: XOM kötü sonuç verirse CVX de baskılanabilir. 50MA (~$182) ve 200MA (~$170) üzerinde — teknik görünüm pozitif. Dividend yield %3.8 ile yüksek temettü — atama riski olsa bile uzun vadeli hold değeri yüksek. Enerji sektörü yüksek IV crush (%30-40) — short premium kazançlı. FOMC sonrası (29 Temmuz) — temiz dönem. Not: XOM ile aynı gün earnings — pozisyonları birlikte yönet. Entry: 26-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %30-40 (earnings sonrası — ENERJİ YÜKSEK CRUSH) |
| **Kazanç Kaynağı** | IV çöküşü + hissenin $178 üzerinde kalması |
| **Optimal Exit** | 31 Temmuz BMO sonrası 1 Ağustos sabahı |
| **Max Hold** | 1 Ağustos kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** CVX IV Rank %45 sınırda. Enerji sektörü yüksek crush (%30-40) sunar. Bull Put Spread $2.50 kredi toplar. Earnings sonrası IV %30-40 düşecek — primin büyük bölümü eriyecek. Eğer hisse $178 üzerinde kalırsa, kredi tamamı korunur. 50MA $182 yakınında — kısa vadeli destek. Entry: 26-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $185 (ATM) |
| **Sell Call** | $195 (OTM, wing $10) |
| **Maliyet** | ~$4.00 |
| **Max Risk** | $4.00 (ödenen prim) |
| **Max Kar** | $6.00 (Wing $10 - Maliyet $4) |
| **ROI** | ~150% |
| **Breakeven** | $189 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.12) |
| **Theta** | Negatif (~-$0.04/gün) |
| **Kar Hedefi** | %50 kar = hisse $192; %100 kar = hisse $195 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $2 zararda kapat |
| **Hedge Kullanımı** | CVX long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer CVX earnings'te beat açıklarsa (Permian üretimi, downstream marjları), call spread kaldıraçlı kar sağlar. CPR ~1.50 boğa momentumunu destekler. Ancak IV crush riski var — pozisyonu 28-29 Temmuz'da aç, 31 Temmuz BMO sonrası 1 Ağustos sabahı hemen değerlendir. Not: CVX Beta 0.90 — piyasaya paralel hareket. FOMC sonrası genel piyasa hareketi CVX'i etkiler. Entry: 26-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

#### Strateji 3: Iron Condor (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $198C / Buy $208C (Wing $10) |
| **Put Wing** | Sell $172P / Buy $162P (Wing $10) |
| **Kredi** | ~$3.00 |
| **Max Risk** | $7.00 (Wing $10 - Kredi $3) |
| **Max Kar** | $3.00 (toplanan kredi) |
| **ROI** | ~43% |
| **Breakeven'lar** | $201 (üst) / $169 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.15) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.06/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.50 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $6 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$18.6 (kullanılan $10 = dar wing, agresif) |
| **PoP** | ~58% |

> **Koruma/Hedge Gerekçesi:** Iron Condor, CVX'nin earnings öncesi volatilite şişkinliğinden (IV Rank %45) faydalanır ve crush sonrası prim çöküşünden kazanır. Wing $10 = fiyatın ~%5.4'i, EM (~%4.2) dışında sınırda güvenli bölge. CVX 50MA/200MA üzerinde — teknik görünüm pozitif, hisse $172-$198 aralığında kalma olasılığı yüksek. Enerji sektörü yüksek crush (%30-40) — short premium kazançlı. Not: Dar wing ($10) = hisse %7+ hareket ederse max loss. XOM ile aynı gün earnings — sektör volatilitesi artabilir. Entry: 26-29 Temmuz. Exit: 31 Temmuz BMO sonrası 1 Ağustos sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$198 (Lottery) | ~$20 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$162 (Lottery) | ~$14 | Sınırsız | Spekülatif |
| $50-$200 | Bull Put Spread ($178P/$168P) 2 kontrat | ~$250 | ~$750 | 1:3.0 |
| $50-$200 | Long Call Spread ($185C/$195C) 1 kontrat | ~$200 | ~$800 | 1:4.0 |
| $200-$500 | Iron Condor ($172P/$162P + $198C/$208C) 2 kontrat | ~$300 | ~$1,400 | 1:4.7 |
| $200-$500 | Long Call Butterfly ($180C/$188C/$196C) 3 kontrat | ~$360 | ~$840 | 1:2.3 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **25-26 Temmuz** | Hazırlık | Greeks analizi, petrol fiyatları kontrolü, XOM ile aynı gün earnings planı |
| **27-29 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-4 gün önce) |
| **31 Temmuz** | 🎯 **Earnings Günü** | CVX BMO açıklama — pozisyonu TUT |
| **1 Ağustos** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **1 Ağustos kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. CVX XOM ile aynı gün (31 Temmuz) earnings — sektör etkisi riski. XOM kötü gelirse CVX de baskılanır.
> 2. FOMC 29 Temmuz — CVX earnings 31 Temmuz'da. FOMC sonrası volatilite taşıyabilir.
> 3. Petrol fiyatları $89-91 aralığında — ani düşüş (OPEC+ kararı) CVX'i baskılar.
> 4. IV Rank %45 sınırda — IC prim toplama potansiyeli sınırlı.
> 5. Dar wing ($10) stratejilerde hisse %7+ hareket ederse max loss.
> 6. Enerji geçişi (renewable) baskısı uzun vadeli risk — kısa vadeli earnings etkileyebilir.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 8. **⛔ Earnings play 2 günden fazla tutulmaz. 1 Ağustos kapanışa kadar pozisyon KAPANMIŞ olmalı.**


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

### Diğer Hisseler Özet Tablosu (Güncel Fiyatlar — 12 Haziran 2026)

| Hisse | Fiyat | IV30 | IV Rank | Hacim CPR | OI CPR | Beta | YTD% | Earnings |
|-------|-------|------|---------|-----------|--------|------|------|----------|
| **V** | **$325.05** | ~24% | ~38% | ~0.92 | ~0.95 | 0.95 | +12.80% | 28 Temmuz AMC |
| **MA** | **$490.61** | ~22% | ~40% | 0.88 | ~0.90 | 1.00 | +14.65% | 30 Temmuz BMO |
| **DIS** | **$98.61** | ~26% | ~38% | 0.78 | ~0.80 | 1.20 | +5.42% | Ağustos (olası) |
| **BA** | **$221.63** | ~32% | **65%** | 0.82 | ~0.85 | 1.50 | +0.55% | 28 Temmuz-3 Ağustos |
| **NKE** | $43.06 | ~28% | ~45% | 0.72 | ~0.75 | 0.90 | **-31.20%** | 30 Haziran (açıkladı) |
| **HD** | **$326.01** | ~24% | ~32% | ~0.98 | ~1.08 | 1.10 | +8.40% | Ağustos (olası) |
| **COIN** | **$160.43** | ~55% | ~60% | ~1.50 | ~1.40 | 2.50 | N/A | Belirsiz |
| **HOOD** | **$92.23** | ~50% | ~55% | ~1.80 | ~1.60 | 2.20 | N/A | Belirsiz |

---

### 9.1 V (Visa) — $325.05 — CPR: ~0.92

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
| **Implied Move (EM)** | ~±4.0% (~$13.00) |
| **Sektör** | Ödeme Sistemleri & Finansal Teknoloji |
| **FOMC Çakışması** | FOMC öncesi (29 Temmuz) — YARI POZİSYON! |

#### Strateji 1: Iron Condor (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $340C / Buy $355C (Wing $15) |
| **Put Wing** | Sell $310P / Buy $295P (Wing $15) |
| **Kredi** | ~$5.50 |
| **Max Risk** | $9.50 (Wing $15 - Kredi $5.50) |
| **Max Kar** | $5.50 (toplanan kredi) |
| **ROI** | ~58% |
| **Breakeven'lar** | $345.50 (üst) / $304.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.18) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.08/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$2.75 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $11 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$32.5 (kullanılan $15 = dar wing, agresif) |
| **PoP** | ~58% |

> **Strateji Gerekçesi:** V IV Rank %38 sınırda ama ödeme sektörü düşük crush (%20-25) sunar. Iron Condor, V'nin earnings öncesi volatilite şişkinliğinden faydalanır. V 50MA ($328.40) ve 200MA ($335.60) altında — teknik görünüm hafif ayı. CPR ~0.92/0.95 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. Wing $15 = fiyatın ~%4.6'sı, EM (~%4.0) dışında sınırda güvenli bölge. **RİSK:** FOMC 29 Temmuz — V earnings 28 Temmuz AMC'de. Yarım pozisyon (normal boyutun %50'si) önerilir. Ertesi gün FOMC volatilitesi pozisyonu etkileyebilir. V Beta 0.95 — piyasaya paralel hareket. FOMC günü genel piyasa hareketi V'yi etkiler. Entry: 23-25 Temmuz. Exit: 28 Temmuz AMC sonrası 29 Temmuz sabahı (FOMC günü dikkatli). **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-25 (earnings sonrası — ödeme sektörü DÜŞÜK crush) |
| **Kazanç Kaynağı** | IV çöküşü (sınırlı) + hissenin $310-$340 aralığında kalması |
| **Optimal Exit** | 28 Temmuz AMC sonrası 29 Temmuz sabahı (FOMC günü dikkatli) |
| **Max Hold** | 29 Temmuz kapanış — FOMC çakışması, 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** V IV Rank %38 sınırda. Ödeme sektörü düşük crush (%20-25) sunar. Iron Condor $5.50 kredi toplar. Earnings sonrası IV %20-25 düşecek. Eğer hisse $310-$340 aralığında kalırsa, kredi tamamı korunur. FOMC 29 Temmuz — yarım pozisyon. Entry: 23-25 Temmuz. Exit: 28 Temmuz AMC sonrası 29 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $325 (hafif ITM/ATM) |
| **Sell Call** | $340 (OTM, wing $15) |
| **Maliyet** | ~$6.50 |
| **Max Risk** | $6.50 (ödenen prim) |
| **Max Kar** | $8.50 (Wing $15 - Maliyet $6.50) |
| **ROI** | ~131% |
| **Breakeven** | $331.50 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.20) |
| **Theta** | Negatif (~-$0.07/gün) |
| **Kar Hedefi** | %50 kar = hisse $335.75; %100 kar = hisse $340 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $3.25 zararda kapat |
| **Hedge Kullanımı** | V long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer V earnings'te beat açıklarsa (işlem hacmi büyümesi, cross-border ödemeler), call spread kaldıraçlı kar sağlar. V YTD +12.80 ile güçlü performans gösteriyor. Ancak 50MA/200MA altında — upside potansiyeli sınırlı olabilir. IV crush riski var — pozisyonu 25-26 Temmuz'da aç, 28 Temmuz AMC sonrası 29 Temmuz sabahı hemen değerlendir. Not: FOMC 29 Temmuz yakınlığı — yarım pozisyon. Entry: 23-25 Temmuz. Exit: 28 Temmuz AMC sonrası 29 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 3: Protective Put (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Long Put (Long Vega, Short Delta) |
| **Buy Put** | $315 (OTM koruma) |
| **Maliyet** | ~$3.50 |
| **Max Risk** | $3.50 (ödenen prim) |
| **Max Kar** | Sınırsız (hisse $0'a düşerse) |
| **Breakeven** | $311.50 |
| **Downside Protection** | $315 (yaklaşık %3.1 aşağı koruma) |
| **Delta** | -0.30 ile -0.40 (ayı yönlü) |
| **Vega** | Pozitif (~+$0.15) |
| **Theta** | Negatif (~-$0.05/gün) |
| **Kar Hedefi** | %100 kar = hisse $311.50 altında; %50 kar = hisse $313.25 altında |
| **Hedge Kullanımı** | V long pozisyonu olanlar için FOMC öncesi koruma |

> **Koruma Gerekçesi:** V long pozisyonu olan yatırımcılar için Protective Put, FOMC (29 Temmuz) öncesi aşağı yönlü riski sınırlar. Maliyet $3.50 ile %1.1'lik bir "sigorta primi" ödenir. V 50MA/200MA altında — teknik görünüm hafif ayı, aşağı riski var. Eğer V earnings'te beklenenden kötü sonuçlar açıklarsa (işlem hacmi yavaşlama, rekabet baskısı), put kar sağlar ve long hisse zararını telafi eder. FOMC volatilitesi de korunur. Not: IV crush put'a zarar verir — pozisyonu 26-27 Temmuz'da aç, 29 Temmuz FOMC sonrası kapat. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$355 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$295 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($325C/$340C) 1 kontrat | ~$325 | ~$850 | 1:2.6 |
| $50-$200 | Iron Condor ($310P/$295P + $340C/$355C) 1 kontrat | ~$275 | ~$950 | 1:3.5 |
| $200-$500 | Long Call Butterfly ($320C/$330C/$340C) 2 kontrat | ~$380 | ~$1,120 | 1:2.9 |
| $200-$500 | Protective Put ($315P) 1 kontrat + Short Call ($345C) 1 kontrat | ~$320 | Karmaşık | Collar |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **23-24 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%38), FOMC risk değerlendirmesi |
| **25-26 Temmuz** | ⚠️ **Entry (Yarım Pozisyon)** | Normal boyutun %50'si ile pozisyon aç (FOMC yakın) |
| **27 Temmuz** | Son Entry | Son giriş fırsatı (earnings'ten 1 gün önce) |
| **28 Temmuz** | 🎯 **Earnings Günü** | V AMC açıklama — pozisyonu TUT, panik YOK |
| **29 Temmuz** | 🚪 **EXIT** | **FOMC Günü — pozisyonu sabah açılışta kapat. IV crush + FOMC volatilitesi** |
| **29 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. V 50MA ($328.40) ve 200MA ($335.60) altında — teknik görünüm hafif ayı. Upside potansiyeli sınırlı.
> 2. FOMC 29 Temmuz — V earnings 28 Temmuz AMC'de. Yarım pozisyon şart. FOMC öncesi volatilite artışı riski.
> 3. Ödeme sektörü rekabeti (Mastercard, Amex, fintech) pazar payı baskısı yapabilir.
> 4. Küresel ekonomik yavaşlama işlem hacimlerini düşürür — V earnings etkileyebilir.
> 5. Dar wing ($15) stratejilerde hisse %5+ hareket ederse max loss.
> 6. Pozisyon büyüklüğü: FOMC yakınlığı nedeniyle normal boyutun %50'si. Hesabın %0.5-1'inden fazla risk atma.
> 7. **⛔ Earnings play 2 günden fazla tutulmaz. 29 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**

---

### 9.2 MA (Mastercard) — $490.61 — CPR: 0.88

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
| **Implied Move (EM)** | ~±4.2% (~$20.61) |
| **Sektör** | Ödeme Sistemleri & Finansal Teknoloji |
| **FOMC Çakışması** | FOMC sonrası (29 Temmuz) — temiz dönem! |

#### Strateji 1: Iron Condor (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $515C / Buy $535C (Wing $20) |
| **Put Wing** | Sell $465P / Buy $445P (Wing $20) |
| **Kredi** | ~$8.50 |
| **Max Risk** | $11.50 (Wing $20 - Kredi $8.50) |
| **Max Kar** | $8.50 (toplanan kredi) |
| **ROI** | ~74% |
| **Breakeven'lar** | $523.50 (üst) / $456.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.25) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.12/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$4.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $17 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$49 (kullanılan $20 = dar wing, agresif) |
| **PoP** | ~56% |

> **Strateji Gerekçesi:** MA IV Rank %40 sınırda — Iron Condor prim toplama makul. MA 50MA ($498.20) ve 200MA ($510.40) altında — teknik görünüm hafif ayı. CPR 0.88/0.90 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. Wing $20 = fiyatın ~%4.1'i, EM (~%4.2) dışında sınırda güvenli bölge. MA 30 Temmuz'da earnings açıklayacak — FOMC (29 Temmuz) sonrası, temiz dönem. V (28 Temmuz) earnings sonuçları MA için "leading indicator" olabilir. YTD +14.65 V'den (+12.80) daha güçlü — "relative strength" var. Not: Yüksek fiyat ($490.61) = yüksek margin gereksinimi. Pozisyonu küçük tut. Entry: 25-28 Temmuz. Exit: 30 Temmuz BMO sonrası 31 Temmuz sabahı. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-25 (earnings sonrası — ödeme sektörü DÜŞÜK crush) |
| **Kazanç Kaynağı** | IV çöküşu (sınırlı) + hissenin $465-$515 aralığında kalması |
| **Optimal Exit** | 30 Temmuz BMO sonrası 31 Temmuz sabahı |
| **Max Hold** | 31 Temmuz kapanış — 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** MA IV Rank %40 sınırda. Ödeme sektörü düşük crush (%20-25) sunar. Iron Condor $8.50 kredi toplar. Earnings sonrası IV %20-25 düşecek. Eğer hisse $465-$515 aralığında kalırsa, kredi tamamı korunur. FOMC 29 Temmuz sonrası — temiz dönem. Entry: 25-28 Temmuz. Exit: 30 Temmuz BMO sonrası 31 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $490 (ATM) |
| **Sell Call** | $515 (OTM, wing $25) |
| **Maliyet** | ~$10.00 |
| **Max Risk** | $10.00 (ödenen prim) |
| **Max Kar** | $15.00 (Wing $25 - Maliyet $10) |
| **ROI** | ~150% |
| **Breakeven** | $500 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.22) |
| **Theta** | Negatif (~-$0.08/gün) |
| **Kar Hedefi** | %50 kar = hisse $507.50; %100 kar = hisse $515 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $5 zararda kapat |
| **Hedge Kullanımı** | MA long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** Eğer MA earnings'te beat açıklarsa (işlem hacmi büyümesi, yeni anlaşmalar), call spread kaldıraçlı kar sağlar. MA YTD +14.65 ile güçlü performans gösteriyor. Ancak 50MA/200MA altında — upside potansiyeli sınırlı olabilir. IV crush riski var — pozisyonu 27-28 Temmuz'da aç, 30 Temmuz BMO sonrası 31 Temmuz sabahı hemen değerlendir. Not: V (28 Temmuz) earnings sonuçları MA için ipucu — V güçlüyse MA de güçlü olabilir. Entry: 25-28 Temmuz. Exit: 30 Temmuz BMO sonrası 31 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Strateji 3: Bear Call Spread (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Short Delta) |
| **Sell Call** | $515 (OTM, ~%5.0 üzerinde) |
| **Buy Call** | $535 (daha OTM, wing $20) |
| **Kredi** | ~$5.50 |
| **Max Risk** | $14.50 (Wing $20 - Kredi $5.50) |
| **Max Kar** | $5.50 (toplanan kredi) |
| **ROI** | ~38% |
| **Breakeven** | $520.50 |
| **Delta Hedefi** | -0.10 ile -0.15 arası (ayı yönlü) |
| **Vega** | Negatif (~-$0.15) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.07/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$2.75 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $11 zararda kapat |
| **PoP** | ~60% |

> **Koruma Gerekçesi:** MA 50MA ($498.20) ve 200MA ($510.40) altında — teknik görünüm hafif ayı. Bear Call Spread, hissenin $515 üzerine çıkmamasına bahis oynar. 200MA ($510.40) yakınında — uzun vadeli direnç. Eğer MA earnings'te zayıf sonuçlar açıklarsa (işlem hacmi yavaşlama), call spread kar sağlar. IV crush potansiyeli %20-25 — short premium kazançlı. Not: MA YTD +14.65 güçlü — "mean reversion" riski (kâr realizasyonu). Entry: 25-28 Temmuz. Exit: 30 Temmuz BMO sonrası 31 Temmuz sabahı. **>2 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | ⛔ Uygun strateji bulunamadı (fiyat çok yüksek) |
| $50-$200 | ⛔ Uygun strateji bulunamadı (minimum spread >$200) |
| $200-$500 | Iron Condor ($465P/$445P + $515C/$535C) 1 kontrat | ~$350 | ~$1,150 | 1:3.3 |
| $200-$500 | Bear Call Spread ($515C/$535C) 1 kontrat | ~$275 | ~$1,450 | 1:5.3 |

> **Bütçe Uyarısı:** MA fiyatı $490.61 ile yüksek. 1 kontrat = $49,061 nominal değer. Spread stratejileri $200+ maliyet. Bütçe dostu strateji sınırlı. Alternatif: Micro-options (10 hisse) varsa değerlendir.

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **25-26 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%40), V earnings sonuçlarını izle (28 Temmuz) |
| **27-28 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-3 gün önce) |
| **28 Temmuz** | Gözlem | V AMC earnings sonuçlarını izle — MA için ipucu |
| **30 Temmuz** | 🎯 **Earnings Günü** | MA BMO açıklama — pozisyonu TUT |
| **31 Temmuz** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **31 Temmuz kapanış** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. MA fiyatı $490.61 yüksek — 1 kontrat margin gereksinimi ~$1,150. Küçük hesaplar için uygun değil.
> 2. MA 50MA/200MA altında — teknik görünüm hafif ayı. Upside potansiyeli sınırlı.
> 3. V (28 Temmuz) earnings sonuçları MA için "leading indicator" — V kötü gelirse MA da baskılanabilir.
> 4. Ödeme sektörü rekabeti (Visa, Amex, fintech) pazar payı baskısı yapabilir.
> 5. Dar wing ($20) stratejilerde hisse %5+ hareket ederse max loss.
> 6. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 7. **⛔ Earnings play 2 günden fazla tutulmaz. 31 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**


---

### 9.3 DIS (Disney) — $98.61 — CPR: 0.78

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 48.50 (Nötr-ayıcak, momentum hafif negatif) |
| **50MA** | $102.30 (fiyat altında, kısa vadeli trend hafif ayı) |
| **200MA** | $108.50 (fiyat altında, uzun vadeli trend hafif ayı) |
| **IV30** | ~26% |
| **IV Rank** | ~38% (Düşük — spread stratejileri sınırda) |
| **Hacim CPR** | 0.78 (Nötr-ayıcak — put hacmi call hacminden %22 fazla) |
| **OI CPR** | ~0.80 (Nötr-ayıcak — açık put pozisyonları call'lardan %20 fazla) |
| **Beta** | 1.20 |
| **YTD** | +5.42% (Streaming segmenti toparlanması) |
| **Earnings** | Ağustos 2026 (olası, kesin tarih belirsiz) |
| **Son 8Q Ort. Earnings Hareketi** | ±5.5% (yüksek volatilite) |
| **Implied Move (EM)** | ~±6.0% (~$5.92) |
| **Sektör** | Eğlence, Medya & Streaming |
| **FOMC Çakışması** | Ağustos tarihinde olası — FOMC çakışması muhtemelen yok |

#### Strateji 1: Iron Condor (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $106C / Buy $114C (Wing $8) |
| **Put Wing** | Sell $90P / Buy $82P (Wing $8) |
| **Kredi** | ~$2.50 |
| **Max Risk** | $5.50 (Wing $8 - Kredi $2.50) |
| **Max Kar** | $2.50 (toplanan kredi) |
| **ROI** | ~45% |
| **Breakeven'lar** | $108.50 (üst) / $87.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.08) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.03/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$1.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $5 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$9.86 (kullanılan $8 = dar wing, agresif) |
| **PoP** | ~55% |

> **Strateji Gerekçesi:** DIS IV Rank %38 sınırda — Iron Condor prim toplama makul. DIS 50MA ($102.30) ve 200MA ($108.50) altında — teknik görünüm hafif ayı. CPR 0.78/0.80 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. Wing $8 = fiyatın ~%8.1'i, EM (~%6.0) dışında güvenli bölge. DIS earnings tarihi Ağustos 2026 (olası) — **bu rapor Temmuz 2026 kapsamında. DIS Temmuz'da earnings AÇIKLAMAYACAK.** Ancak DIS temmuzda yüksek volatilite gösterebilir (genel piyasa hareketi, streaming duyuruları). Iron Condor genel volatilite şişkinliğinden faydalanabilir. Not: DIS Beta 1.20 — piyasadan %20 daha volatil. Wing dar ($8) — hisse %9+ hareket ederse max loss. Entry: Temmuz ortası (genel piyasa volatilitesi yüksekken). Exit: 28-30 Temmuz (FOMC sonrası). **Ağustos earnings yoksa Temmuz'da 2-3 günlük hold maksimum.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-25 (Temmuz'da earnings yok — genel volatilite çöküşü) |
| **Kazanç Kaynağı** | Genel piyasa volatilitesi çöküşü + hissenin $90-$106 aralığında kalması |
| **Optimal Exit** | 28-30 Temmuz (FOMC sonrası volatilite çöküşü) |
| **Max Hold** | 3 günden fazla tutma YASAK (Temmuz'da earnings yok) |

> **IV Crush Gerekçesi:** DIS Temmuz 2026'da earnings AÇIKLAMAYACAK. Ancak genel piyasa volatilitesi (FOMC 29 Temmuz) şişirilebilir. FOMC sonrası volatilite çöküşü (%20-25) kazanç sağlar. Eğer hisse $90-$106 aralığında kalırsa, kredi tamamı korunur. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $100 (hafif ITM) |
| **Sell Call** | $110 (OTM, wing $10) |
| **Maliyet** | ~$3.50 |
| **Max Risk** | $3.50 (ödenen prim) |
| **Max Kar** | $6.50 (Wing $10 - Maliyet $3.50) |
| **ROI** | ~186% |
| **Breakeven** | $103.50 |
| **Delta** | +0.50 ile +0.60 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.10) |
| **Theta** | Negatif (~-$0.04/gün) |
| **Kar Hedefi** | %50 kar = hisse $106.75; %100 kar = hisse $110 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $1.75 zararda kapat |
| **Hedge Kullanımı** | DIS long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** DIS YTD +5.42 ile streaming segmenti toparlanması gösteriyor. Eğer Disney+ abone büyümesi, park gelirleri veya Marvel/Star Wars içerik duyuruları pozitif gelirse, call spread kaldıraçlı kar sağlar. Ancak DIS 50MA/200MA altında — upside potansiyeli sınırlı. IV crush riski var — pozisyonu Temmuz ortasında aç, 28-30 Temmuz'da hemen değerlendir. Not: DIS Beta 1.20 — piyasadan %20 daha volatil. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Strateji 3: Protective Put (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Long Put (Long Vega, Short Delta) |
| **Buy Put** | $92 (OTM koruma, ~%6.7 altında) |
| **Maliyet** | ~$1.80 |
| **Max Risk** | $1.80 (ödenen prim) |
| **Max Kar** | Sınırsız (hisse $0'a düşerse) |
| **Breakeven** | $90.20 |
| **Downside Protection** | $92 (yaklaşık %6.7 aşağı koruma) |
| **Delta** | -0.30 ile -0.40 (ayı yönlü) |
| **Vega** | Pozitif (~+$0.08) |
| **Theta** | Negatif (~-$0.03/gün) |
| **Kar Hedefi** | %100 kar = hisse $90.20 altında; %50 kar = hisse $91.10 altında |
| **Hedge Kullanımı** | DIS long pozisyonu olanlar için downside koruma |

> **Koruma Gerekçesi:** DIS long pozisyonu olan yatırımcılar için Protective Put, aşağı yönlü riski sınırlar. Maliyet $1.80 ile %1.8'lik bir "sigorta primi" ödenir. DIS 50MA/200MA altında — teknik görünüm hafif ayı, aşağı riski var. Eğer DIS temmuzda kötü haber (streaming abone kaybı, park gelir düşüşü) gelirse, put kar sağlar ve long hisse zararını telafi eder. Not: DIS earnings Ağustos'ta — Temmuz'da koruma pahalı olmayabilir. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$114 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$82 (Lottery) | ~$8 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($100C/$110C) 2 kontrat | ~$350 | ~$650 | 1:1.9 |
| $50-$200 | Iron Condor ($90P/$82P + $106C/$114C) 3 kontrat | ~$375 | ~$825 | 1:2.2 |
| $200-$500 | Iron Condor ($90P/$82P + $106C/$114C) 5 kontrat | ~$625 | ~$1,375 | 1:2.2 |
| $200-$500 | Long Call Butterfly ($98C/$104C/$110C) 4 kontrat | ~$400 | ~$800 | 1:2.0 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **15-18 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%38), DIS earnings tarihi kontrolü (Ağustos) |
| **20-25 Temmuz** | ⚠️ **Entry** | Pozisyon aç (FOMC öncesi volatilite şişkinliğinden faydalan) |
| **28-29 Temmuz** | 🚪 **EXIT** | **FOMC sonrası volatilite çöküşü, %50 kar hedefi kontrolü, kapat** |
| **30 Temmuz** | ⛔ **TUTMA** | DIS Temmuz'da earnings yok. 3 günden fazla tutma YASAK |

> **⚠️ Risk Uyarıları:**
> 1. **DIS Temmuz 2026'da earnings AÇIKLAMAYACAK.** Stratejiler genel piyasa volatilitesi (FOMC) üzerine kurulu. Earnings play değil, "FOMC volatilite play".
> 2. DIS 50MA/200MA altında — teknik görünüm hafif ayı. Upside potansiyeli sınırlı.
> 3. DIS Beta 1.20 — piyasadan %20 daha volatil. Wing dar ($8) — hisse %9+ hareket ederse max loss.
> 4. Streaming rekabeti (Netflix, Amazon) pazar payı baskısı yapabilir. Abone büyümesi yavaşlama riski.
> 5. Park gelirleri ve rehberlik kâr hedefleri belirsiz — guidance surprise riski.
> 6. FOMC 29 Temmuz — genel piyasa volatilitesi DIS'i etkiler. Yarım pozisyon önerilir.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 8. **⛔ Temmuz'da 3 günden fazla tutma YASAK. DIS earnings Ağustos'ta.**

---

### 9.4 BA (Boeing) — $221.63 — CPR: 0.82 — YÜKSEK IV, YÜKSEK RİSK

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 42.10 (Nötr-ayıcak, momentum hafif negatif) |
| **50MA** | $228.50 (fiyat altında, kısa vadeli trend hafif ayı) |
| **200MA** | $235.60 (fiyat altında, uzun vadeli trend hafif ayı) |
| **IV30** | ~32% |
| **IV Rank** | **65% (Yüksek — short spread stratejileri için ideal!)** |
| **Hacim CPR** | 0.82 (Nötr-ayıcak — put hacmi call hacminden hafif yüksek) |
| **OI CPR** | ~0.85 (Nötr-ayıcak — açık put pozisyonları call'lardan hafif fazla) |
| **Beta** | 1.50 (Çok yüksek — piyasadan %50 daha volatil!) |
| **YTD** | +0.55% (Nötr, havacılık sektörü karışık) |
| **Earnings** | 28 Temmuz - 3 Ağustos 2026 (BMO, tarih kesin değil) |
| **Son 8Q Ort. Earnings Hareketi** | ±6.5% (Çok yüksek volatilite) |
| **Implied Move (EM)** | ~±7.0% (~$15.51) |
| **Sektör** | Havacılık & Savunma |
| **FOMC Çakışması** | FOMC sonrası (29 Temmuz) — temiz dönem! |
| **Sektör Riskleri** | 737 MAX kriz kalıntıları, üretim gecikmeleri, savunma bütçe baskısı |

#### Strateji 1: Iron Condor (Ana) ⭐ YÜKSEK IV RANK

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $238C / Buy $248C (Wing $10) |
| **Put Wing** | Sell $205P / Buy $195P (Wing $10) |
| **Kredi** | ~$5.50 |
| **Max Risk** | $4.50 (Wing $10 - Kredi $5.50) |
| **Max Kar** | $5.50 (toplanan kredi) |
| **ROI** | ~122% |
| **Breakeven'lar** | $243.50 (üst) / $199.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.20) — IV crush'tan maksimum kazanç |
| **Theta** | Pozitif (~$0.10/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$2.75 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $11 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$22.16 (kullanılan $10 = dar wing, ÇOK agresif) |
| **PoP** | ~52% |

> **⭐ Strateji Gerekçesi:** BA IV Rank %65 ile EN YÜKSEK IV Rank'a sahip hisselerden biri! Short spread stratejileri için ideal ortam. BA 28 Temmuz - 3 Ağustos arası BMO'da earnings açıklayacak — FOMC (29 Temmuz) sonrası, temiz dönem. Wing $10 = fiyatın ~%4.5'i, EM (~%7.0) içinde — ÇOK DAR WİNG! Hisse %7+ hareket ederse max loss. BA Beta 1.50 — piyasadan %50 daha volatil. CPR 0.82/0.85 hafif ayı — piyasa kısa vadeli geri çekilme bekliyor. BA 50MA ($228.50) ve 200MA ($235.60) altında — teknik görünüm hafif ayı. Iron Condor, hissenin $205-$238 aralığında kalmasına bahis oynar. Not: 737 MAX kriz kalıntıları, üretim gecikmeleri, savunma bütçe baskısı — uzun vadeli riskler. Ancak IV Rank %65 ile short premium ÇOK kazançlı. Entry: 23-27 Temmuz. Exit: 28 Temmuz - 3 Ağustos earnings sonrası 1-2 gün içinde. **>2 gün tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %35-40 (earnings sonrası — havacılık YÜKSEK crush) |
| **Kazanç Kaynağı** | IV çöküşu (büyük) + hissenin $205-$238 aralığında kalması |
| **Optimal Exit** | Earnings sonrası 1-2 gün içinde (BA earnings 28 Temmuz - 3 Ağustos) |
| **Max Hold** | 2 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** BA IV Rank %65 — EN YÜKSEK. Havacılık sektörü yüksek crush (%35-40) sunar. Iron Condor $5.50 kredi toplar. Earnings sonrası IV %35-40 düşecek — primin büyük bölümü eriyecek. Eğer hisse $205-$238 aralığında kalırsa, kredi tamamı korunur. Dar wing ($10) riski yüksek — EM %7.0. BA Beta 1.50 — piyasa hareketine ÇOK duyarlı. Entry: 23-27 Temmuz. Exit: Earnings sonrası 1-2 gün. **>2 gün tutma YASAK.**

#### Strateji 2: Long Put Spread (Alternatif — Ayı Oyunu)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Short Delta) |
| **Buy Put** | $220 (hafif ITM) |
| **Sell Put** | $210 (OTM, wing $10) |
| **Maliyet** | ~$4.00 |
| **Max Risk** | $4.00 (ödenen prim) |
| **Max Kar** | $6.00 (Wing $10 - Maliyet $4) |
| **ROI** | ~150% |
| **Breakeven** | $216 |
| **Delta** | -0.45 ile -0.55 (güçlü ayı) |
| **Vega** | Pozitif (~+$0.15) |
| **Theta** | Negatif (~-$0.06/gün) |
| **Kar Hedefi** | %50 kar = hisse $212; %100 kar = hisse $210 altında |
| **Stop Loss** | %50 prim kaybı = pozisyonu $2 zararda kapat |
| **Hedge Kullanımı** | BA short pozisyonu veya endeks short hedge |

> **Alternatif Gerekçesi:** BA 50MA/200MA altında, CPR 0.82 hafif ayı — piyasa aşağı yönlü beklenti içinde. Eğer BA earnings'te kötü sonuçlar açıklarsa (737 MAX üretim gecikmeleri, FAA onay sorunları, savunma bütçe kesintileri), put spread kaldıraçlı kar sağlar. BA Beta 1.50 — piyasa düşerse BA daha hızlı düşer. IV crush riski var — pozisyonu 24-26 Temmuz'da aç, earnings sonrası 1-2 gün hemen değerlendir. Not: BA YTD +0.55 nötr — "mean reversion" potansiyeli. Entry: 23-27 Temmuz. Exit: Earnings sonrası 1-2 gün. **>2 gün tutma YASAK.**

#### Strateji 3: Short Straddle (Koruma/Hedge — Deneyimli, ÇOK RİSKLİ)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Nötr Delta) |
| **Sell Call** | $222 (ATM, ~%0.2 üzerinde) |
| **Sell Put** | $222 (ATM, ~%0.2 altında) |
| **Kredi** | ~$16.00 |
| **Max Risk** | Sınırsız (yukarı) / büyük (aşağı, hisse $0'a düşerse) |
| **Max Kar** | $16.00 (toplanan kredi) |
| **ROI** | ~7.2% (kısa vadeli) |
| **Breakeven'lar** | $238 (üst) / $206 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 (nötr) |
| **Vega** | Negatif (~-$0.50) — IV crush'tan maksimum kazanç |
| **Theta** | Pozitif (~$0.25/gün) — maksimum theta decay |
| **Gamma** | ÇOK YÜKSEK (ATM, kısa vade) — ÇOK RİSKLİ |
| **Kar Hedefi** | %25 mekanik exit = ~$4 kar (short straddle için düşük hedef) |
| **Stop Loss** | 1.5x kredi = pozisyonu $24 zararda kapat |
| **Wing Genişliği** | $0 (ATM) — EM %7.0 dışında ÇOK DAR |

> **Koruma/Hedge Gerekçesi:** Short Straddle, IV crush'tan maksimum kazanç sağlayan stratejidir. BA IV Rank %65 ile EN YÜKSEK. $16.00 kredi toplar — hisse $206-$238 aralığında kalırsa kar. Breakeven'lar EM (%7.0) dışında — ÇOK DAR. Ancak risk ÇOK YÜKSEK — hisse $238 üzerine veya $206 altına çıkarsa zarar sınırsız (yukarı) veya büyük (aşağı). Gamma çok yüksek — küçük fiyat hareketleri büyük P&L dalgalanmaları. Bu strateji SADECE deneyimli traderlar için. Pozisyon büyüklüğü: Hesabın %0.3'ünden fazla risk atma. Entry: 25-27 Temmuz. Exit: Earnings sonrası 1 gün. **>1 gün tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$248 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$195 (Lottery) | ~$14 | Sınırsız | Spekülatif |
| $50-$200 | Long Put Spread ($220P/$210P) 1 kontrat | ~$200 | ~$600 | 1:3.0 |
| $50-$200 | Iron Condor ($205P/$195P + $238C/$248C) 1 kontrat | ~$275 | ~$450 | 1:1.6 |
| $200-$500 | Iron Condor ($205P/$195P + $238C/$248C) 2 kontrat | ~$550 | ~$900 | 1:1.6 |
| $200-$500 | Short Straddle ($222C/$222P) 1 kontrat | ~$800 | ~$1,600 | 1:2.0 (ama ÇOK RİSKLİ) |

> **Bütçe Uyarısı:** BA Beta 1.50 ve IV Rank %65 ile ÇOK volatil. Dar wing stratejilerde hisse %7+ hareket ederse max loss. Bütçe dostu stratejiler sınırlı. Short Straddle ÇOK RİSKLİ — sadece deneyimli traderlar.

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **23-24 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%65), BA earnings tarihi kesinleştirme (28 Temmuz - 3 Ağustos) |
| **25-27 Temmuz** | ⚠️ **Entry** | Pozisyon aç (earnings'ten 2-5 gün önce) |
| **28 Temmuz - 3 Ağustos** | 🎯 **Earnings Günü** | BA BMO açıklama — pozisyonu TUT |
| **Earnings sonrası 1-2 gün** | 🚪 **EXIT** | **IV crush değerlendirmesi, %50 kar hedefi kontrolü, kapat** |
| **2 gün sonrası** | ⛔ **TUTMA** | Earnings play 2 günden fazla tutulmaz. Kalan pozisyon KAPANMIŞ olmalı |

> **⚠️ Risk Uyarıları:**
> 1. BA IV Rank %65 ÇOK YÜKSEK — volatilite ve risk ÇOK büyük. Dar wing stratejilerde hisse %7+ hareket ederse max loss.
> 2. BA Beta 1.50 — piyasadan %50 daha volatil. Piyasa hareketine ÇOK duyarlı.
> 3. 737 MAX kriz kalıntıları, FAA onay sorunları, üretim gecikmeleri — uzun vadeli riskler.
> 4. BA earnings tarihi 28 Temmuz - 3 Ağustos arası — kesin değil. Planlama zorluğu.
> 5. Short Straddle ÇOK RİSKLİ — sınırsız yukarı risk. Sadece deneyimli traderlar.
> 6. Dar wing ($10) stratejilerde hisse %7+ hareket ederse max loss. Fiyat/10 = $22.16, kullanılan $10.
> 7. Pozisyon büyüklüğü: IC/Bull Put için %1-2, Short Straddle/Strangle için %0.3'den fazla risk atma.
> 8. **⛔ Earnings play 2 günden fazla tutulmaz. Earnings sonrası 2 gün kapanışa kadar pozisyon KAPANMIŞ olmalı.**

---

### 9.5 NKE (Nike) — $43.06 — CPR: 0.72 — ⛔ EARNINGS 30 HAZİRAN'DA AÇIKLADI

> **⚠️ KRİTİK UYARI:** NKE 30 Haziran 2026'da earnings AÇIKLADI. Bu rapor Temmuz 2026 kapsamında. NKE Temmuz'da earnings AÇIKLAMAYACAK. Aşağıdaki stratejiler "Post-Earnings" (earnings sonrası) stratejileridir — Temmuz'da genel piyasa hareketine veya "mean reversion" potansiyeline bahis oynar.

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 35.00 (Ayı, momentum negatif) |
| **50MA** | $48.50 (fiyat altında, kısa vadeli trend ayı) |
| **200MA** | $52.80 (fiyat altında, uzun vadeli trend ayı) |
| **IV30** | ~28% (Post-earnings, IV düşmüş) |
| **IV Rank** | ~45% (Post-earnings) |
| **Hacim CPR** | 0.72 (Ayı — put hacmi call hacminden %28 fazla) |
| **OI CPR** | ~0.75 (Ayı — açık put pozisyonları call'lardan %25 fazla) |
| **Beta** | 0.90 |
| **YTD** | **-31.20% (Çok zayıf, sektörde en kötü performans!)** |
| **Earnings** | **30 Haziran 2026 (AÇIKLADI — Temmuz'da earnings YOK)** |
| **Son 8Q Ort. Earnings Hareketi** | ±5.0% (Yüksek volatilite) |
| **Sektör** | Perakende, Tekstil & Spor Giyim |
| **FOMC Çakışması** | Genel piyasa etkisi |

#### Strateji 1: Bear Put Spread (Ana — Post-Earnings)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Short Delta) |
| **Buy Put** | $44 (hafif ITM) |
| **Sell Put** | $40 (OTM, wing $4) |
| **Maliyet** | ~$1.80 |
| **Max Risk** | $1.80 (ödenen prim) |
| **Max Kar** | $2.20 (Wing $4 - Maliyet $1.80) |
| **ROI** | ~122% |
| **Breakeven** | $42.20 |
| **Delta** | -0.45 ile -0.55 (güçlü ayı) |
| **Vega** | Pozitif (~+$0.08) |
| **Theta** | Negatif (~-$0.03/gün) |
| **Kar Hedefi** | %50 kar = hisse $41.10; %100 kar = hisse $40 altında |
| **Stop Loss** | %50 prim kaybı = pozisyonu $0.90 zararda kapat |
| **Hedge Kullanımı** | NKE short pozisyonu veya endeks short hedge |

> **Strateji Gerekçesi:** NKE YTD -31.20 ile ÇOK ZAYIF. 30 Haziran earnings açıkladı — sonuçlar kötü olabilir (Çin talep düşüşü, enflasyon baskısı, perakende yavaşlama). CPR 0.72/0.75 güçlü ayı — piyasa daha fazla düşüş bekliyor. Bear Put Spread, hissenin $40 altına düşmesine bahis oynar. Wing $4 = fiyatın ~%9.3'ü — dar wing. NKE 50MA ($48.50) ve 200MA ($52.80) altında — teknik görünüm ayı. "Dead cat bounce" (ölü kedi sıçraması) riski — kısa vadeli short pozisyonlar riskli. Entry: Temmuz ilk haftası (FOMC öncesi). Exit: 5-7 gün içinde (post-earnings momentum). **NKE Temmuz'da earnings yok — bu "post-earnings momentum play".**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | N/A (NKE 30 Haziran'da earnings açıkladı — IV zaten çökmüş) |
| **Kazanç Kaynağı** | Post-earnings momentum (aşağı) + hissenin $40 altına düşmesi |
| **Optimal Exit** | 5-7 gün içinde (post-earnings momentum) |
| **Max Hold** | 1 haftadan fazla tutma YASAK (post-earnings momentum kısa sürer) |

> **IV Crush Gerekçesi:** NKE 30 Haziran'da earnings açıkladı — IV zaten çökmüş (%45'ten %28'e). Artık IV crush kazancı yok. Kazanç kaynağı: Post-earnings momentum (aşağı yönlü). Eğer 30 Haziran earnings kötüyse, Temmuz ilk haftasında aşağı momentum devam edebilir. Entry: Temmuz ilk haftası. Exit: 5-7 gün içinde. **1 haftadan fazla tutma YASAK.**

#### Strateji 2: Long Call (Alternatif — Dead Cat Bounce)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Long Call (Long Vega, Long Delta) |
| **Buy Call** | $45 (OTM) |
| **Maliyet** | ~$1.20 |
| **Max Risk** | $1.20 (ödenen prim) |
| **Max Kar** | Sınırsız (hisse yükselirse) |
| **Breakeven** | $46.20 |
| **Delta** | +0.35 ile +0.45 (hafif boğa) |
| **Vega** | Pozitif (~+$0.06) |
| **Theta** | Negatif (~-$0.02/gün) |
| **Kar Hedefi** | %100 kar = hisse $47.40; %200 kar = hisse $48.60 |
| **Stop Loss** | %50 prim kaybı = pozisyonu $0.60 zararda kapat |
| **Hedge Kullanımı** | NKE long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** NKE YTD -31.20 ÇOK ZAYIF — "dead cat bounce" (ölü kedi sıçraması) potansiyeli var. 30 Haziran earnings kötüyse, "selling the news" sonrası kısa vadeli short squeeze olabilir. Long Call, kısa vadeli upside bahisidir. Çok riskli — NKE trendi ayı. YTD -31.20 ile "falling knife" (düşen bıçak) yakalanabilir. Entry: Temmuz ilk haftası (dip alım). Exit: 3-5 gün içinde (dead cat bounce kısa sürer). **1 haftadan fazla tutma YASAK.**

#### Strateji 3: Cash-Secured Put (Koruma/Hedge — Yatırım)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Long Delta) |
| **Sell Put** | $40 (OTM, ~%7.1 altında) |
| **Kredi** | ~$1.00 |
| **Max Risk** | $39.00 (hisse $0'a düşerse, $40 - $1.00 kredi) |
| **Max Kar** | $1.00 (toplanan kredi) |
| **ROI** | ~2.5% (kısa vadeli) |
| **Breakeven** | $39.00 |
| **Atama Riski** | Hisse $40 altında kapanırsa 100 hisse alım zorunluluğu |
| **Delta** | +0.20 ile +0.25 (hafif boğa) |
| **Vega** | Negatif (~-$0.05) |
| **Theta** | Pozitif (~$0.02/gün) |
| **Kar Hedefi** | %50 mekanik exit = ~$0.50 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $2 zararda kapat |
| **PoP** | ~65% |
| **Effective Cost** | $39.00 (atama durumunda) — YTD -31.20'den dip alım |

> **Koruma Gerekçesi:** NKE YTD -31.20 ÇOK ZAYIF — uzun vadeli yatırımcılar için dip alım fırsatı. Cash-Secured Put $40, 100 hisse alım zorunluluğu ile $39.00 etkin maliyetle NKE alım fırsatı sunar. NKE 50MA ($48.50) ve 200MA ($52.80) altında — teknik görünüm ayı. Ancak $39.00 ile YTD -31.20'nin daha da altında — dip alım. Not: NKE 30 Haziran earnings açıkladı — sonuçları kötüyse $40'a kadar düşebilir. Atama riski YÜKSEK. Entry: Temmuz ilk haftası. Exit: Atama veya %50 kar. **1 haftadan fazla tutma YASAK (atama durumunda hariç).**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$48 (Lottery) | ~$10 | Sınırsız | Spekülatif (dead cat bounce) |
| $10-$50 | OTM Put @$38 (Lottery) | ~$8 | Sınırsız | Spekülatif |
| $50-$200 | Bear Put Spread ($44P/$40P) 3 kontrat | ~$270 | ~$330 | 1:1.2 |
| $50-$200 | Cash-Secured Put ($40P) 2 kontrat | ~$80 | ~$200 | 1:2.5 (ama atama riski) |
| $200-$500 | Bear Put Spread ($44P/$40P) 5 kontrat | ~$450 | ~$550 | 1:1.2 |
| $200-$500 | Cash-Secured Put ($40P) 5 kontrat | ~$200 | ~$500 | 1:2.5 (ama atama riski) |

#### Giriş-Çıkış Takvimi (POST-EARNINGS — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **1-2 Temmuz** | Hazırlık | 30 Haziran earnings sonuçları analizi, NKE temel verileri kontrolü |
| **3-6 Temmuz** | ⚠️ **Entry** | Pozisyon aç (post-earnings momentum) |
| **8-10 Temmuz** | 🚪 **EXIT** | **Post-earnings momentum değerlendirmesi, %50 kar hedefi, kapat** |
| **10 Temmuz** | ⛔ **TUTMA** | Post-earnings momentum kısa sürer. 1 haftadan fazla tutma YASAK |

> **⚠️ Risk Uyarıları:**
> 1. **NKE 30 Haziran 2026'da earnings AÇIKLADI. Temmuz'da earnings YOK.** Stratejiler post-earnings momentum üzerine kurulu.
> 2. NKE YTD -31.20 ÇOK ZAYIF. "Falling knife" (düşen bıçak) yakalanabilir. Dip alım riskli.
> 3. Çin talep düşüşü, enflasyon baskısı, perakende yavaşlama — temel riskler.
> 4. CPR 0.72 güçlü ayı — piyasa daha fazla düşüş bekliyor. "Dead cat bounce" riski.
> 5. Cash-Secured Put atama riski YÜKSEK. NKE $40'a kadar düşebilir. 100 hisse = $4,000 yatırım.
> 6. NKE 50MA/200MA altında — teknik görünüm ayı. Upside potansiyeli sınırlı.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 8. **⛔ Post-earnings momentum 1 haftadan fazla sürmez. 10 Temmuz kapanışa kadar pozisyon KAPANMIŞ olmalı.**

---

### 9.6 HD (Home Depot) — $326.01 — CPR: ~0.98

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 45.50 (Nötr-ayıcak, momentum hafif negatif) |
| **50MA** | $332.80 (fiyat altında, kısa vadeli trend hafif ayı) |
| **200MA** | $340.20 (fiyat altında, uzun vadeli trend hafif ayı) |
| **IV30** | ~24% |
| **IV Rank** | ~32% (Düşük — long spread tercih) |
| **Hacim CPR** | ~0.98 (Nötr — call ve put hacmi dengeli) |
| **OI CPR** | ~1.08 (Hafif boğa — açık call pozisyonları put'lardan %8 fazla) |
| **Beta** | 1.10 |
| **YTD** | +8.40% (Sektör ortalaması) |
| **Earnings** | Ağustos 2026 (olası, kesin tarih belirsiz) |
| **Son 8Q Ort. Earnings Hareketi** | ±3.5% |
| **Implied Move (EM)** | ~±4.0% (~$13.04) |
| **Sektör** | Perakende, Ev İyileştirme |
| **FOMC Çakışması** | Ağustos tarihinde olası — FOMC çakışması muhtemelen yok |

#### Strateji 1: Iron Condor (Ana)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $340C / Buy $350C (Wing $10) |
| **Put Wing** | Sell $310P / Buy $300P (Wing $10) |
| **Kredi** | ~$4.00 |
| **Max Risk** | $6.00 (Wing $10 - Kredi $4) |
| **Max Kar** | $4.00 (toplanan kredi) |
| **ROI** | ~67% |
| **Breakeven'lar** | $344 (üst) / $306 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.12) — IV crush'tan kazanç |
| **Theta** | Pozitif (~$0.05/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$2.00 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $8 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$32.6 (kullanılan $10 = dar wing, agresif) |
| **PoP** | ~58% |

> **Strateji Gerekçesi:** HD IV Rank %32 sınırda — Iron Condor prim toplama makul. HD 50MA ($332.80) ve 200MA ($340.20) altında — teknik görünüm hafif ayı. CPR ~0.98/1.08 hafif boğa — piyasa dengeli. Wing $10 = fiyatın ~%3.1'i, EM (~%4.0) dışında dar güvenli bölge. HD earnings Ağustos 2026 (olası) — **bu rapor Temmuz 2026 kapsamında. HD Temmuz'da earnings AÇIKLAMAYACAK.** Ancak HD temmuzda genel piyasa hareketine duyarlı (Beta 1.10). Iron Condor genel volatilite şişkinliğinden (FOMC 29 Temmuz) faydalanabilir. Not: HD ev iyileştirme perakendesi — faiz oranları, konut piyasası, tüketici harcamalarına duyarlı. Entry: Temmuz ortası. Exit: 28-30 Temmuz (FOMC sonrası). **Temmuz'da 3 günden fazla tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %20-25 (Temmuz'da earnings yok — genel volatilite çöküşü) |
| **Kazanç Kaynağı** | Genel piyasa volatilitesi çöküşu (FOMC sonrası) + hissenin $310-$340 aralığında kalması |
| **Optimal Exit** | 28-30 Temmuz (FOMC sonrası volatilite çöküşü) |
| **Max Hold** | 3 günden fazla tutma YASAK (Temmuz'da earnings yok) |

> **IV Crush Gerekçesi:** HD Temmuz 2026'da earnings AÇIKLAMAYACAK. Genel piyasa volatilitesi (FOMC 29 Temmuz) şişirilebilir. FOMC sonrası volatilite çöküşü (%20-25) kazanç sağlar. Eğer hisse $310-$340 aralığında kalırsa, kredi tamamı korunur. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Strateji 2: Long Call Spread (Alternatif)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $325 (hafif ITM/ATM) |
| **Sell Call** | $340 (OTM, wing $15) |
| **Maliyet** | ~$5.50 |
| **Max Risk** | $5.50 (ödenen prim) |
| **Max Kar** | $9.50 (Wing $15 - Maliyet $5.50) |
| **ROI** | ~173% |
| **Breakeven** | $330.50 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.15) |
| **Theta** | Negatif (~-$0.06/gün) |
| **Kar Hedefi** | %50 kar = hisse $335.25; %100 kar = hisse $340 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $2.75 zararda kapat |
| **Hedge Kullanımı** | HD long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** HD YTD +8.40 ile güçlü performans gösteriyor. Ev iyileştirme perakendesi — konut piyasası toparlanması, faiz oranları düşüşü pozitif. Eğer HD Ağustos earnings'te beat açıklarsa (haziranda Temmuz'da piyasa beklentisi), call spread kaldıraçlı kar sağlar. Ancak HD Temmuz'da earnings yok — bu strateji genel piyasa bahisidir. IV crush riski yok (earnings yok) — genel volatilite çöküşu riski var. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Strateji 3: Bear Put Spread (Koruma/Hedge)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Short Delta) |
| **Buy Put** | $325 (hafif ITM) |
| **Sell Put** | $315 (OTM, wing $10) |
| **Maliyet** | ~$4.00 |
| **Max Risk** | $4.00 (ödenen prim) |
| **Max Kar** | $6.00 (Wing $10 - Maliyet $4) |
| **ROI** | ~150% |
| **Breakeven** | $321 |
| **Delta** | -0.45 ile -0.55 (güçlü ayı) |
| **Vega** | Pozitif (~+$0.12) |
| **Theta** | Negatif (~-$0.05/gün) |
| **Kar Hedefi** | %50 kar = hisse $317; %100 kar = hisse $315 altında |
| **Stop Loss** | %50 prim kaybı = pozisyonu $2 zararda kapat |
| **Hedge Kullanımı** | HD long pozisyonu olanlar için downside koruma |

> **Koruma Gerekçesi:** HD 50MA ($332.80) ve 200MA ($340.20) altında — teknik görünüm hafif ayı. Bear Put Spread, hissenin $315 altına düşmesine bahis oynar. Eğer HD Temmuz'da kötü haber (konut piyasası verileri, tüketici harcamaları düşüşü) gelirse, put spread kar sağlar. HD Beta 1.10 — piyasa düşerse HD daha hızlı düşer. Not: HD earnings Ağustos'ta — Temmuz'da koruma pahalı olmayabilir. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$350 (Lottery) | ~$18 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$300 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $50-$200 | Iron Condor ($310P/$300P + $340C/$350C) 1 kontrat | ~$200 | ~$800 | 1:4.0 |
| $50-$200 | Long Call Spread ($325C/$340C) 1 kontrat | ~$275 | ~$975 | 1:3.5 |
| $200-$500 | Iron Condor ($310P/$300P + $340C/$350C) 2 kontrat | ~$400 | ~$1,600 | 1:4.0 |
| $200-$500 | Long Call Butterfly ($322C/$332C/$342C) 3 kontrat | ~$450 | ~$1,050 | 1:2.3 |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **15-18 Temmuz** | Hazırlık | Greeks analizi, IV Rank teyidi (%32), HD earnings tarihi kontrolü (Ağustos) |
| **20-25 Temmuz** | ⚠️ **Entry** | Pozisyon aç (FOMC öncesi volatilite şişkinliğinden faydalan) |
| **28-29 Temmuz** | 🚪 **EXIT** | **FOMC sonrası volatilite çöküşü, %50 kar hedefi kontrolü, kapat** |
| **30 Temmuz** | ⛔ **TUTMA** | HD Temmuz'da earnings yok. 3 günden fazla tutma YASAK |

> **⚠️ Risk Uyarıları:**
> 1. **HD Temmuz 2026'da earnings AÇIKLAMAYACAK.** Stratejiler genel piyasa volatilitesi (FOMC) üzerine kurulu. Earnings play değil, "FOMC volatilite play".
> 2. HD 50MA/200MA altında — teknik görünüm hafif ayı. Upside potansiyeli sınırlı.
> 3. Konut piyasası, faiz oranları, tüketici harcamaları — temel riskler. HD'yi etkileyebilir.
> 4. HD Beta 1.10 — piyasadan %10 daha volatil. Piyasa hareketine duyarlı.
> 5. Dar wing ($10) stratejilerde hisse %5+ hareket ederse max loss. Fiyat/10 = $32.6, kullanılan $10.
> 6. FOMC 29 Temmuz — genel piyasa volatilitesi HD'yi etkiler. Yarım pozisyon önerilir.
> 7. Pozisyon büyüklüğü: Hesabın %1-2'sinden fazla risk atma.
> 8. **⛔ Temmuz'da 3 günden fazla tutma YASAK. HD earnings Ağustos'ta.**

---

### 9.7 COIN (Coinbase) — $160.43 — CPR: ~1.50 — Kripto Volatilitesi

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 52.00 (Nötr-boğa, momentum dengeli) |
| **50MA** | $155.20 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | $148.80 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~55% (ÇOK YÜKSEK) |
| **IV Rank** | ~60% (Yüksek — short spread stratejileri için uygun) |
| **Hacim CPR** | ~1.50 (Boğa — call hacmi put hacminden %50 fazla) |
| **OI CPR** | ~1.40 (Boğa — açık call pozisyonları put'lardan %40 fazla) |
| **Beta** | 2.50 (ÇOK YÜKSEK — piyasadan %150 daha volatil!) |
| **YTD** | N/A (Kripto volatilitesi, yüksek dalgalanma) |
| **Earnings** | Belirsiz (Kripto hisseleri earnings tarihleri değişken) |
| **Son 8Q Ort. Earnings Hareketi** | ±12.0% (ÇOK YÜKSEK volatilite) |
| **Implied Move (EM)** | ~±13.0% (~$20.86) |
| **Sektör** | Kripto Borsası & Finansal Teknoloji |
| **FOMC Çakışması** | Genel piyasa ve kripto etkisi |
| **Sektör Riskleri** | Kripto regülasyonu, SEC davalari, Bitcoin volatilitesi, likidite riski |

#### Strateji 1: Iron Condor (Ana) ⭐ Kripto Volatilite Play

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $185C / Buy $200C (Wing $15) |
| **Put Wing** | Sell $135P / Buy $120P (Wing $15) |
| **Kredi** | ~$8.50 |
| **Max Risk** | $6.50 (Wing $15 - Kredi $8.50) |
| **Max Kar** | $8.50 (toplanan kredi) |
| **ROI** | ~131% |
| **Breakeven'lar** | $193.50 (üst) / $126.50 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.35) — IV crush'tan maksimum kazanç |
| **Theta** | Pozitif (~$0.15/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$4.25 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $17 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$16.04 (kullanılan $15 = sınırda dar wing) |
| **PoP** | ~48% |

> **⭐ Strateji Gerekçesi:** COIN IV30 %55 ve IV Rank %60 ile ÇOK YÜKSEK volatilite. Kripto hisseleri EN yüksek crush potansiyelini sunar (%40-50). Iron Condor, bu volatilite şişkinliğinden faydalanır. COIN 50MA ($155.20) ve 200MA ($148.80) üzerinde — teknik görünüm pozitif. CPR ~1.50/1.40 boğa — piyasa kripto rallisi bekliyor. Wing $15 = fiyatın ~%9.4'ü, EM (~%13.0) dışında dar güvenli bölge. Ancak COIN Beta 2.50 — piyasa hareketine ÇOK duyarlı. Bitcoin $80K+ seviyelerinde — kripto rallisi COIN'i destekler. Not: COIN earnings tarihi belirsiz — strateji genel piyasa volatilite play. SEC davaları, regülasyon riski — kripto sektörü yüksek risk. Entry: Temmuz ortası (FOMC öncesi volatilite şişkinliği). Exit: 28-30 Temmuz (FOMC sonrası). **Temmuz'da 3 günden fazla tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %40-50 (kripto hisseleri EN YÜKSEK crush) |
| **Kazanç Kaynağı** | IV çöküşu (büyük) + hissenin $135-$185 aralığında kalması |
| **Optimal Exit** | 28-30 Temmuz (FOMC sonrası volatilite çöküşü) |
| **Max Hold** | 3 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** COIN IV30 %55 — EN YÜKSEK. Kripto sektörü %40-50 crush sunar. Iron Condor $8.50 kredi toplar. FOMC sonrası veya genel piyasa volatilite çöküşü %40-50 — primin büyük bölümü eriyecek. Eğer hisse $135-$185 aralığında kalırsa, kredi tamamı korunur. COIN Beta 2.50 — Bitcoin ve genel piyasa hareketine ÇOK duyarlı. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Strateji 2: Long Call Spread (Alternatif — Kripto Rallisi)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $160 (ATM) |
| **Sell Call** | $180 (OTM, wing $20) |
| **Maliyet** | ~$8.50 |
| **Max Risk** | $8.50 (ödenen prim) |
| **Max Kar** | $11.50 (Wing $20 - Maliyet $8.50) |
| **ROI** | ~135% |
| **Breakeven** | $168.50 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.25) |
| **Theta** | Negatif (~-$0.10/gün) |
| **Kar Hedefi** | %50 kar = hisse $174.25; %100 kar = hisse $180 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $4.25 zararda kapat |
| **Hedge Kullanımı** | COIN long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** COIN CPR ~1.50 güçlü boğa — piyasa kripto rallisi bekliyor. Bitcoin $80K+ seviyelerinde — kripto rallisi COIN'i destekler. 50MA/200MA üzerinde — teknik görünüm pozitif. Eğer kripto piyasası Temmuz'da güçlenirse (Bitcoin ETF akışları, regülasyon iyimserliği), call spread kaldıraçlı kar sağlar. Ancak COIN Beta 2.50 — volatilite ÇOK yüksek. IV crush riski var — pozisyonu Temmuz ortasında aç, 28-30 Temmuz'da hemen değerlendir. Not: COIN earnings tarihi belirsiz — bu strateji kripto piyasa bahisidir. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Strateji 3: Short Strangle (Koruma/Hedge — Deneyimli, ÇOK RİSKLİ)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Nötr Delta) |
| **Sell Call** | $190 (OTM, ~%18.4 üzerinde) |
| **Sell Put** | $130 (OTM, ~%19.0 altında) |
| **Kredi** | ~$12.00 |
| **Max Risk** | Sınırsız (yukarı) / büyük (aşağı, hisse $0'a düşerse) |
| **Max Kar** | $12.00 (toplanan kredi) |
| **ROI** | ~7.5% (kısa vadeli) |
| **Breakeven'lar** | $202 (üst) / $118 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 (nötr) |
| **Vega** | Negatif (~-$0.40) — IV crush'tan maksimum kazanç |
| **Theta** | Pozitif (~$0.20/gün) — maksimum theta decay |
| **Gamma** | Yüksek (kısa vade) — büyük risk |
| **Kar Hedefi** | %25 mekanik exit = ~$3 kar (short strangle için düşük hedef) |
| **Stop Loss** | 1.5x kredi = pozisyonu $18 zararda kapat |
| **Wing Genişliği** | $60 (geniş — EM %13 dışında güvenli bölge) |

> **Koruma/Hedge Gerekçesi:** Short Strangle, IV crush'tan maksimum kazanç sağlayan stratejidir. COIN IV30 %55 ile EN YÜKSEK. $12.00 kredi toplar — hisse $130-$190 aralığında kalırsa kar. Wing $60 geniş — EM (~%13) dışında güvenli bölge. Ancak risk ÇOK YÜKSEK — hisse $202 üzerine veya $118 altına çıkarsa zarar sınırsız (yukarı) veya büyük (aşağı). COIN Beta 2.50 — Bitcoin ve piyasa hareketine ÇOK duyarlı. Bu strateji SADECE deneyimli traderlar için. Pozisyon büyüklüğü: Hesabın %0.5'inden fazla risk atma. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$200 (Lottery) | ~$15 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$120 (Lottery) | ~$10 | Sınırsız | Spekülatif |
| $50-$200 | Long Call Spread ($160C/$180C) 1 kontrat | ~$425 | ~$575 | 1:1.4 |
| $50-$200 | Iron Condor ($135P/$120P + $185C/$200C) 1 kontrat | ~$350 | ~$650 | 1:1.9 |
| $200-$500 | Iron Condor ($135P/$120P + $185C/$200C) 1 kontrat | ~$350 | ~$650 | 1:1.9 |
| $200-$500 | Short Strangle ($190C/$130P) 1 kontrat | ~$800 | ~$1,200 | 1:1.5 (ama ÇOK RİSKLİ) |

> **Bütçe Uyarısı:** COIN IV30 %55 yüksek — spread maliyetleri yüksek. Long Call Spread ~$425. Bütçe dostu strateji sınırlı. Alternatif: OTM lottery ticket.

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **15-18 Temmuz** | Hazırlık | Greeks analizi, IV30 teyidi (%55), Bitcoin fiyatı kontrolü ($80K+?), kripto piyasa havası |
| **20-25 Temmuz** | ⚠️ **Entry** | Pozisyon aç (FOMC öncesi volatilite şişkinliğinden faydalan) |
| **28-29 Temmuz** | 🚪 **EXIT** | **FOMC sonrası volatilite çöküşü, %50 kar hedefi kontrolü, kapat** |
| **30 Temmuz** | ⛔ **TUTMA** | COIN Temmuz'da earnings belirsiz. 3 günden fazla tutma YASAK |

> **⚠️ Risk Uyarıları:**
> 1. COIN IV30 %55 ÇOK YÜKSEK — spread maliyetleri yüksek, risk büyük.
> 2. COIN Beta 2.50 — piyasadan %150 daha volatil. Bitcoin ve genel piyasa hareketine ÇOK duyarlı.
> 3. Kripto regülasyonu (SEC, CFTC), davalari — sektör riski yüksek. COIN özelinde risk.
> 4. COIN earnings tarihi belirsiz — strateji genel piyasa/kripto bahisidir.
> 5. Short Strangle ÇOK RİSKLİ — sınırsız yukarı risk. Sadece deneyimli traderlar.
> 6. Wing $15 stratejilerde hisse %13+ hareket ederse max loss. COIN Beta 2.50 ile bu mümkün.
> 7. Pozisyon büyüklüğü: IC/Bull Put için %1-2, Short Strangle için %0.5'den fazla risk atma.
> 8. **⛔ Temmuz'da 3 günden fazla tutma YASAK. COIN earnings tarihi belirsiz.**

---

### 9.8 HOOD (Robinhood) — $92.23 — CPR: ~1.80 — Kripto & Fintech Volatilitesi

| Parametre | Değer |
|-----------|-------|
| **RSI(14)** | 54.00 (Nötr-boğa, momentum pozitif) |
| **50MA** | $88.40 (fiyat üzerinde, kısa vadeli trend pozitif) |
| **200MA** | $82.60 (fiyat üzerinde, uzun vadeli trend pozitif) |
| **IV30** | ~50% (ÇOK YÜKSEK) |
| **IV Rank** | ~55% (Yüksek — short spread stratejileri için uygun) |
| **Hacim CPR** | ~1.80 (Güçlü boğa — call hacmi put hacminden %80 fazla) |
| **OI CPR** | ~1.60 (Güçlü boğa — açık call pozisyonları put'lardan %60 fazla) |
| **Beta** | 2.20 (ÇOK YÜKSEK — piyasadan %120 daha volatil!) |
| **YTD** | N/A (Kripto/fintech volatilitesi, yüksek dalgalanma) |
| **Earnings** | Belirsiz (Fintech hisseleri earnings tarihleri değişken) |
| **Son 8Q Ort. Earnings Hareketi** | ±10.0% (ÇOK YÜKSEK volatilite) |
| **Implied Move (EM)** | ~±11.0% (~$10.15) |
| **Sektör** | Fintech, Kripto & Online Brokeraj |
| **FOMC Çakışması** | Genel piyasa ve kripto etkisi |
| **Sektör Riskleri** | Kripto regülasyonu, faiz oranı hassasiyeti, komisyon geliri modeli, rekabet |

#### Strateji 1: Iron Condor (Ana) ⭐ EN YÜKSEK CPR

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi spread (Short Vega, Nötr Delta) |
| **Call Wing** | Sell $105C / Buy $115C (Wing $10) |
| **Put Wing** | Sell $80P / Buy $70P (Wing $10) |
| **Kredi** | ~$5.00 |
| **Max Risk** | $5.00 (Wing $10 - Kredi $5) |
| **Max Kar** | $5.00 (toplanan kredi) |
| **ROI** | ~100% |
| **Breakeven'lar** | $110 (üst) / $75 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 arası (nötr) |
| **Vega** | Negatif (~-$0.20) — IV crush'tan maksimum kazanç |
| **Theta** | Pozitif (~$0.08/gün) |
| **Gamma** | Düşük (30+ DTE ile kontrol) |
| **Kar Hedefi** | %50 mekanik exit = ~$2.50 kar |
| **Stop Loss** | 2.0x kredi = pozisyonu $10 zararda kapat |
| **Wing Genişliği Kuralı** | Fiyat/10 = ~$9.22 (kullanılan $10 = sınırda) |
| **PoP** | ~52% |

> **⭐ Strateji Gerekçesi:** HOOD CPR ~1.80/1.60 ile güçlü boğa — piyasa fintech/kripto rallisi bekliyor. IV30 %50 ve IV Rank %55 ile yüksek volatilite — short spread stratejileri için uygun. HOOD 50MA ($88.40) ve 200MA ($82.60) üzerinde — teknik görünüm pozitif. Wing $10 = fiyatın ~%10.8'i, EM (~%11.0) dışında sınırda güvenli bölge. HOOD Beta 2.20 — piyasa hareketine ÇOK duyarlı. Kripto piyasası ve genel piyasa hareketi HOOD'u etkiler. Not: HOOD earnings tarihi belirsiz — strateji genel piyasa volatilite play. Fintech rekabeti (Schwab, Fidelity, Webull) komisyon baskısı. Entry: Temmuz ortası (FOMC öncesi volatilite şişkinliği). Exit: 28-30 Temmuz (FOMC sonrası). **Temmuz'da 3 günden fazla tutma YASAK.**

#### IV Crush Beklentisi (YENİ)

| Metrik | Değer |
|--------|-------|
| **Beklenen IV Düşüşü** | %35-45 (fintech/kripto hisseleri YÜKSEK crush) |
| **Kazanç Kaynağı** | IV çöküşu (büyük) + hissenin $80-$105 aralığında kalması |
| **Optimal Exit** | 28-30 Temmuz (FOMC sonrası volatilite çöküşü) |
| **Max Hold** | 3 günden fazla tutma YASAK |

> **IV Crush Gerekçesi:** HOOD IV30 %50 — YÜKSEK. Fintech/kripto sektörü %35-45 crush sunar. Iron Condor $5.00 kredi toplar. FOMC sonrası veya genel piyasa volatilite çöküşu %35-45 — primin büyük bölümü eriyecek. Eğer hisse $80-$105 aralığında kalırsa, kredi tamamı korunur. HOOD CPR ~1.80 güçlü boğa — hisse yukarı yönlü baskı altında. Wing $10 sınırda — EM %11.0. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Strateji 2: Long Call Spread (Alternatif — Fintech Rallisi)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Debit spread (Long Vega, Long Delta) |
| **Buy Call** | $95 (hafif ITM) |
| **Sell Call** | $110 (OTM, wing $15) |
| **Maliyet** | ~$5.50 |
| **Max Risk** | $5.50 (ödenen prim) |
| **Max Kar** | $9.50 (Wing $15 - Maliyet $5.50) |
| **ROI** | ~173% |
| **Breakeven** | $100.50 |
| **Delta** | +0.45 ile +0.55 (güçlü boğa) |
| **Vega** | Pozitif (~+$0.18) |
| **Theta** | Negatif (~-$0.07/gün) |
| **Kar Hedefi** | %50 kar = hisse $105.25; %100 kar = hisse $110 üzeri |
| **Stop Loss** | %50 prim kaybı = pozisyonu $2.75 zararda kapat |
| **Hedge Kullanımı** | HOOD long pozisyonu olanlar için upside leverage |

> **Alternatif Gerekçesi:** HOOD CPR ~1.80 güçlü boğa — piyasa fintech/kripto rallisi bekliyor. 50MA/200MA üzerinde — teknik görünüm pozitif. Eğer kripto piyasası veya fintech sektörü Temmuz'da güçlenirse, call spread kaldıraçlı kar sağlar. HOOD Beta 2.20 — piyasa hareketine ÇOK duyarlı. Ancak IV crush riski var — pozisyonu Temmuz ortasında aç, 28-30 Temmuz'da hemen değerlendir. Not: HOOD earnings tarihi belirsiz — bu strateji genel piyasa bahisidir. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Strateji 3: Short Strangle (Koruma/Hedge — Deneyimli, ÇOK RİSKLİ)

| Parametre | Değer |
|-----------|-------|
| **Tip** | Kredi (Short Vega, Nötr Delta) |
| **Sell Call** | $115 (OTM, ~%24.7 üzerinde) |
| **Sell Put** | $75 (OTM, ~%18.7 altında) |
| **Kredi** | ~$8.00 |
| **Max Risk** | Sınırsız (yukarı) / büyük (aşağı, hisse $0'a düşerse) |
| **Max Kar** | $8.00 (toplanan kredi) |
| **ROI** | ~8.7% (kısa vadeli) |
| **Breakeven'lar** | $123 (üst) / $67 (alt) |
| **Delta Hedefi** | -0.05 ile +0.05 (nötr) |
| **Vega** | Negatif (~-$0.30) — IV crush'tan maksimum kazanç |
| **Theta** | Pozitif (~$0.15/gün) — maksimum theta decay |
| **Gamma** | Yüksek (kısa vade) — büyük risk |
| **Kar Hedefi** | %25 mekanik exit = ~$2 kar (short strangle için düşük hedef) |
| **Stop Loss** | 1.5x kredi = pozisyonu $12 zararda kapat |
| **Wing Genişliği** | $40 (geniş — EM %11 dışında güvenli bölge) |

> **Koruma/Hedge Gerekçesi:** Short Strangle, IV crush'tan maksimum kazanç sağlayan stratejidir. HOOD IV30 %50 ile yüksek. $8.00 kredi toplar — hisse $75-$115 aralığında kalırsa kar. Wing $40 geniş — EM (~%11) dışında güvenli bölge. Ancak risk ÇOK YÜKSEK — hisse $123 üzerine veya $67 altına çıkarsa zarar sınırsız (yukarı) veya büyük (aşağı). HOOD Beta 2.20 — Bitcoin ve piyasa hareketine ÇOK duyarlı. Bu strateji SADECE deneyimli traderlar için. Pozisyon büyüklüğü: Hesabın %0.5'inden fazla risk atma. Entry: Temmuz ortası. Exit: 28-30 Temmuz. **Temmuz'da 3 günden fazla tutma YASAK.**

#### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar | Risk/Reward |
|-------|----------|---------|---------|-------------|
| $10-$50 | OTM Call @$115 (Lottery) | ~$12 | Sınırsız | Spekülatif |
| $10-$50 | OTM Put @$70 (Lottery) | ~$8 | Sınırsız | Spekülatif |
| $50-$200 | Iron Condor ($80P/$70P + $105C/$115C) 1 kontrat | ~$250 | ~$500 | 1:2.0 |
| $50-$200 | Long Call Spread ($95C/$110C) 1 kontrat | ~$275 | ~$725 | 1:2.6 |
| $200-$500 | Iron Condor ($80P/$70P + $105C/$115C) 2 kontrat | ~$500 | ~$1,000 | 1:2.0 |
| $200-$500 | Short Strangle ($115C/$75P) 1 kontrat | ~$500 | ~$800 | 1:1.6 (ama ÇOK RİSKLİ) |

#### Giriş-Çıkış Takvimi (EARNINGS PLAY — DÜZELTİLMİŞ)

| Tarih | İşlem | Açıklama |
|-------|-------|----------|
| **15-18 Temmuz** | Hazırlık | Greeks analizi, IV30 teyidi (%50), kripto piyasa havası, HOOD temel verileri |
| **20-25 Temmuz** | ⚠️ **Entry** | Pozisyon aç (FOMC öncesi volatilite şişkinliğinden faydalan) |
| **28-29 Temmuz** | 🚪 **EXIT** | **FOMC sonrası volatilite çöküşü, %50 kar hedefi kontrolü, kapat** |
| **30 Temmuz** | ⛔ **TUTMA** | HOOD Temmuz'da earnings belirsiz. 3 günden fazla tutma YASAK |

> **⚠️ Risk Uyarıları:**
> 1. HOOD IV30 %50 ÇOK YÜKSEK — spread maliyetleri yüksek, risk büyük.
> 2. HOOD Beta 2.20 — piyasadan %120 daha volatil. Kripto ve genel piyasa hareketine ÇOK duyarlı.
> 3. HOOD earnings tarihi belirsiz — strateji genel piyasa/kripto bahisidir.
> 4. Fintech rekabeti (Schwab, Fidelity, Webull) komisyon baskısı. Faiz oranı düşüşü marj baskısı.
> 5. Short Strangle ÇOK RİSKLİ — sınırsız yukarı risk. Sadece deneyimli traderlar.
> 6. Wing $10 stratejilerde hisse %11+ hareket ederse max loss. HOOD Beta 2.20 ile bu mümkün.
> 7. Pozisyon büyüklüğü: IC/Bull Put için %1-2, Short Strangle için %0.5'den fazla risk atma.
> 8. **⛔ Temmuz'da 3 günden fazla tutma YASAK. HOOD earnings tarihi belirsiz.**

---

## 10. SEKTÖRLER ARASI KARŞILAŞTIRMA ve ÖNERİLER

> Bu bölümde, 4 sektör (Finansal, Sağlık, Enerji, Diğer) arasındaki farklılıklar, risk/ödül profilleri ve en iyi stratejiler karşılaştırılır.

### Sektör Özeti Tablosu

| Sektör | Hisse Sayısı | Ortalama IV Rank | Ortalama CPR | Ortalama Beta | En Yüksek IV Rank | En Güçlü Boğa CPR | En Güçlü Ayı CPR |
|--------|-------------|------------------|--------------|---------------|-------------------|-------------------|------------------|
| **Finansal** | 7 | ~42% | 1.15 | 1.15 | **WFC %65** | **JPM 1.20** | **WFC 1.85** |
| **Sağlık** | 6 | ~35% | 1.05 | 0.68 | **UNH %55** | **TMO 1.15** | **UNH 0.52** |
| **Enerji** | 2 | ~40% | 2.00 | 0.88 | **XOM ~%35** | **XOM 2.50** | **N/A** |
| **Diğer** | 8 | ~42% | 1.10 | 1.30 | **BA %65** | **HOOD 1.80** | **NKE 0.72** |

### En İyi Stratejiler (Sektör Bazında)

| Sektör | En İyi Ana Strateji | En İyi Alternatif | En İyi Koruma | Gerekçe |
|--------|---------------------|-------------------|---------------|---------|
| **Finansal** | JPM Bull Put Spread | BAC Long Call Spread | WFC Bear Put Spread | Finansal IV Rank %42 ortalama, short premium kazançlı. JPM CPR 1.20 güçlü boğa. WFC %65 IV Rank en yüksek. |
| **Sağlık** | ABT Iron Condor | TMO Long Call Spread | UNH Protective Put | Sağlık IV Rank %35 düşük — long spread tercih. ABT %30 en düşük IV Rank. UNH FOMC çakışması koruma. |
| **Enerji** | XOM Bull Put Spread | CVX Long Call Spread | XOM Short Strangle | Enerji IV Rank %40, yüksek crush (%30-40). XOM CPR 2.50 en güçlü boğa. Short Strangle IV crush'tan max kazanç. |
| **Diğer** | BA Iron Condor | COIN Long Call Spread | V Protective Put | Diğer IV Rank %42, yüksek varyans. BA %65 en yüksek IV Rank. COIN CPR 1.50 kripto rallisi. V FOMC öncesi koruma. |

### Risk/Ödül Profili (Sektör Bazında)

| Sektör | Risk Seviyesi | Ödül Potansiyeli | IV Crush Potansiyeli | FOMC Çakışması | Öneri |
|--------|---------------|------------------|----------------------|----------------|-------|
| **Finansal** | Orta-Yüksek | Orta | %25-30 | Var (JPM, BAC) | Yarım pozisyon (JPM, BAC), tam pozisyon (diğerleri) |
| **Sağlık** | Düşük-Orta | Düşük-Orta | %20-25 | Var (UNH) | Tam pozisyon, UNH yarım pozisyon |
| **Enerji** | Yüksek | Yüksek | **%30-40** | Yok | Tam pozisyon, enerji EN yüksek crush |
| **Diğer** | Çok Yüksek | Çok Yüksek | %20-50 | Var (V) | V yarım pozisyon, diğerleri tam pozisyon |

### FOMC Çakışması Özet Tablosu

| Hisse | Earnings | FOMC Çakışması | Öneri |
|-------|----------|----------------|-------|
| **JPM** | 15 Temmuz BMO | FOMC sonrası (29 Temmuz) — temiz | Tam pozisyon |
| **BAC** | 15 Temmuz BMO | FOMC sonrası (29 Temmuz) — temiz | Tam pozisyon |
| **WFC** | 15 Temmuz BMO | FOMC sonrası (29 Temmuz) — temiz | Tam pozisyon |
| **UNH** | 28 Temmuz BMO | FOMC öncesi (29 Temmuz) — YARI POZİSYON | Yarım pozisyon |
| **V** | 28 Temmuz AMC | FOMC öncesi (29 Temmuz) — YARI POZİSYON | Yarım pozisyon |
| **XOM** | 31 Temmuz BMO | FOMC sonrası (29 Temmuz) — temiz | Tam pozisyon |
| **CVX** | 31 Temmuz BMO | FOMC sonrası (29 Temmuz) — temiz | Tam pozisyon |
| **BA** | 28 Temmuz-3 Ağustos | FOMC sonrası (29 Temmuz) — temiz | Tam pozisyon |
| **NKE** | 30 Haziran (AÇIKLADI) | N/A | Post-earnings momentum play |
| **DIS** | Ağustos (olası) | N/A | FOMC volatilite play |
| **HD** | Ağustos (olası) | N/A | FOMC volatilite play |
| **COIN** | Belirsiz | N/A | FOMC volatilite play |
| **HOOD** | Belirsiz | N/A | FOMC volatilite play |

---

## 11. GENEL RİSK YÖNETİMİ ve PORTFÖY KURALLARI

> Bu bölümde, tüm sektörler için geçerli risk yönetimi kuralları, pozisyon büyüklüğü hesaplamaları ve portföy yönetimi prensipleri özetlenir.

### 11.1 Pozisyon Büyüklüğü Kuralları (EARNINGS PLAY)

| Hesap Büyüklüğü | Tek Hisse Maksimum Risk | Sektör Maksimum Risk | Toplam Maksimum Risk |
|-----------------|------------------------|----------------------|---------------------|
| $5,000 | $50-$100 (%1-2) | $150-$300 (%3-6) | $250-$500 (%5-10) |
| $10,000 | $100-$200 (%1-2) | $300-$600 (%3-6) | $500-$1,000 (%5-10) |
| $25,000 | $250-$500 (%1-2) | $750-$1,500 (%3-6) | $1,250-$2,500 (%5-10) |
| $50,000 | $500-$1,000 (%1-2) | $1,500-$3,000 (%3-6) | $2,500-$5,000 (%5-10) |
| $100,000+ | $1,000-$2,000 (%1-2) | $3,000-$6,000 (%3-6) | $5,000-$10,000 (%5-10) |

> **EARNINGS PLAY Kuralı:** Earnings play 2 günden fazla tutulmaz. Maksimum hold süresi: BMO hisseler için earnings günü, AMC hisseler için ertesi gün. Pozisyon büyüklüğü hesaplanırken "2 gün max hold" kuralı dikkate alınır.

### 11.2 Earnings Play Çıkış Kuralları (KESİN)

| Hisse | Earnings Tipi | Entry Penceresi | Exit Penceresi | Max Hold | Kar Hedefi |
|-------|---------------|-----------------|----------------|----------|------------|
| **BMO (Before Market Open)** | Sabah açılış öncesi | Earnings'ten 2-5 gün önce | Earnings günü açılışta veya 1 gün sonra | Earnings günü kapanış | %50-75 kredi |
| **AMC (After Market Close)** | Akşam kapanış sonrası | Earnings'ten 2-5 gün önce | Ertesi gün açılışta veya 1 gün sonra | Ertesi gün kapanış | %50-75 kredi |
| **FOMC Çakışması** | FOMC + Earnings | Earnings'ten 3-5 gün önce | FOMC sonrası 1 gün | FOMC sonrası 1 gün | %50-75 kredi |
| **Post-Earnings** | Earnings açıkladı | Herhangi (momentum) | 5-7 gün içinde | 1 hafta | %50-75 |

> **⛔ KESİN KURAL:** Earnings play 2 günden fazla tutulmaz. Zamanla çıkış YASAK. "Bekleyelim, belki düzelir" YASAK. "Ağustos'ta çıkış" YASAK. Earnings play = 2-5 gün entry, 1-2 gün exit, MAX 2 gün hold.

### 11.3 Mekanik Kar/Stop Loss Kuralları (KESİN)

| Strateji Tipi | Kar Hedefi | Stop Loss | Mekanik Exit Zamanı |
|---------------|-----------|-----------|---------------------|
| **Kredi Spread (IC, Bull Put, Bear Call)** | %50 kredi | 2.0x kredi | Earnings sonrası 1-2 gün |
| **Debit Spread (Long Call, Long Put)** | %50 prim | %50 prim kaybı | Earnings sonrası 1-2 gün |
| **Short Straddle/Strangle** | %25 kredi | 1.5x kredi | Earnings sonrası 1 gün |
| **Protective Put** | %100 prim (hedge) | %50 prim kaybı | Earnings sonrası 1-2 gün |
| **Cash-Secured Put** | %50 kredi | 2.0x kredi | Atama veya %50 kar |
| **Long Call/Put (Lottery)** | %100 prim | %50 prim kaybı | Earnings sonrası 1 gün |

> **Mekanik Exit Prensibi:** Kar hedefine ulaşıldığında POZİSYONU KAPAT. "Biraz daha bekle" YASAK. Stop loss'a ulaşıldığında POZİSYONU KAPAT. "Düzelir belki" YASAK. Earnings play = mekanik kurallar, duygu yok.

### 11.4 IV Crush Yönetimi (KESİN)

| IV Crush Beklentisi | Strateji Tercihi | Entry Zamanı | Exit Zamanı | Risk |
|---------------------|------------------|--------------|-------------|------|
| **Düşük (%15-20)** | Long spread tercih | Earnings'ten 2-3 gün önce | Earnings sonrası 1-2 gün | IV crush kazancı sınırlı |
| **Orta (%20-30)** | IC veya short straddle | Earnings'ten 3-5 gün önce | Earnings sonrası 1-2 gün | Dengeli risk/ödül |
| **Yüksek (%30-40)** | Short straddle/strangle | Earnings'ten 4-5 gün önce | Earnings sonrası 1 gün | Yüksek risk, yüksek kazanç |
| **Çok Yüksek (%40-50)** | Sadece deneyimli | Earnings'ten 5 gün önce | Earnings sonrası 1 gün | Çok yüksek risk |

> **IV Crush Kuralı:** IV crush beklenenden düşük gerçekleşirse, pozisyonu EARLY EXIT yap. Earnings sonuçları kötüyse ve hisse yön değiştirirse, pozisyonu HEMEN kapat. "Bekleyelim, IV çöker" YASAK. Earnings play = yön + IV crush, sadece IV crush değil.

### 11.5 Portföy Çeşitlendirme Kuralları (EARNINGS PLAY)

| Kural | Açıklama |
|-------|----------|
| **Maksimum 5 Hisse** | Aynı anda en fazla 5 earnings play pozisyonu. Fazlası = risk yoğunlaşması |
| **Farklı Sektörler** | Aynı sektörden en fazla 2 hisse (sektör riski yoğunlaşması) |
| **Farklı Earnings Tarihleri** | Aynı gün earnings açıklayan en fazla 2 hisse (XOM+CVX, JPM+BAC+WFC) |
| **Farklı Strateji Tipleri** | Kredi ve debit spread dengesi (tüm kredi = IV crush riski, tüm debit = yön riski) |
| **Farklı Beta'lar** | Yüksek beta (COIN, HOOD, BA) ve düşük beta (JNJ, PFE, ABT) dengesi |
| **FOMC Çakışması** | FOMC çakışan hisseler (UNH, V) yarım pozisyon, diğerleri tam pozisyon |
| **Temmuz 2026 Kalanı** | Earnings sonrası pozisyonları kapat, Ağustos earnings hisselerini (DIS, HD) ayrı takip et |

> **Portföy Kuralı:** Earnings play portföyü = 5 hisse, 2-3 sektör, 2-3 earnings tarihi, kredi/debit dengesi, yüksek/düşük beta dengesi. Her pozisyon 2 gün max hold. Portföy "rotasyon" = earnings tarihlerine göre pozisyon değiştirme, uzun vadeli hold değil.

---

## 12. SONUÇ ve EYLEM PLANI

> Bu bölümde, Temmuz 2026 earnings sezonu için özet, öncelikli hisseler, eylem takvimi ve son uyarılar sunulur.

### 12.1 Öncelikli Hisseler (EARNINGS PLAY)

| Öncelik | Hisse | Sektör | Strateji | Gerekçe | Risk Seviyesi |
|---------|-------|--------|----------|---------|---------------|
| **1** | **XOM** | Enerji | Bull Put Spread | CPR 2.50 en güçlü boğa, enerji yüksek crush %30-40 | Orta |
| **2** | **BA** | Havacılık | Iron Condor | IV Rank %65 en yüksek, yüksek crush %35-40 | Çok Yüksek |
| **3** | **JPM** | Finansal | Bull Put Spread | CPR 1.20 güçlü boğa, finansal IV crush %25-30 | Orta-Yüksek |
| **4** | **WFC** | Finansal | Iron Condor | IV Rank %65 yüksek, finansal IV crush %25-30 | Yüksek |
| **5** | **COIN** | Kripto | Iron Condor | IV30 %55 yüksek, kripto crush %40-50 | Çok Yüksek |
| **6** | **HOOD** | Fintech | Iron Condor | CPR 1.80 güçlü boğa, yüksek volatilite | Çok Yüksek |
| **7** | **CVX** | Enerji | Bull Put Spread | Enerji yüksek crush %30-40, XOM ile aynı gün | Orta |
| **8** | **TMO** | Sağlık | Long Call Spread | CPR 1.15 güçlü boğa, sağlık düşük crush %20-25 | Düşük-Orta |
| **9** | **UNH** | Sağlık | Protective Put | FOMC çakışması, downside koruma | Düşük-Orta |
| **10** | **V** | Ödeme | Iron Condor | FOMC çakışması (yarım pozisyon), ödeme düşük crush | Orta |

### 12.2 Eylem Takvimi (Temmuz 2026)

| Tarih | Eylem | Öncelikli Hisseler | Açıklama |
|-------|-------|-------------------|----------|
| **11-13 Temmuz** | Hazırlık | Tüm | Greeks analizi, IV Rank teyidi, FOMC takvimi kontrolü |
| **14 Temmuz** | Entry Grup 1 | JPM, BAC, WFC, C, MS, BLK | Finansal hisseler — earnings 15 Temmuz BMO |
| **14-15 Temmuz** | Entry Grup 2 | ABT, TMO, MRK | Sağlık hisseler — earnings 15-18 Temmuz |
| **15 Temmuz** | 🎯 Earnings 1 | JPM, BAC, WFC, C, MS, BLK | Finansal earnings açıklama — pozisyonları TUT |
| **16 Temmuz** | 🚪 EXIT Grup 1 | JPM, BAC, WFC, C, MS, BLK | **IV crush değerlendirmesi, %50 kar, KAPAT** |
| **18 Temmuz** | 🎯 Earnings 2 | ABT, TMO, MRK | Sağlık earnings açıklama — pozisyonları TUT |
| **19 Temmuz** | 🚪 EXIT Grup 2 | ABT, TMO, MRK | **IV crush değerlendirmesi, %50 kar, KAPAT** |
| **23-25 Temmuz** | Entry Grup 3 | V, BA, UNH | FOMC öncesi — yarım pozisyon (V, UNH) |
| **26-28 Temmuz** | Entry Grup 4 | XOM, CVX, MA | FOMC sonrası — tam pozisyon |
| **28 Temmuz** | 🎯 Earnings 3 | V (AMC), UNH (BMO), BA (BMO?) | Earnings açıklama — pozisyonları TUT |
| **29 Temmuz** | 🚪 EXIT Grup 3 | V, UNH, BA | **FOMC GÜNÜ — pozisyonları sabah açılışta KAPAT** |
| **30 Temmuz** | 🎯 Earnings 4 | MA (BMO), XOM (BMO?), CVX (BMO?) | Earnings açıklama — pozisyonları TUT |
| **31 Temmuz** | 🚪 EXIT Grup 4 | MA, XOM, CVX | **IV crush değerlendirmesi, %50 kar, KAPAT** |
| **1-3 Ağustos** | 🚪 EXIT Grup 5 | BA (BMO?) | Earnings sonrası — KAPAT |
| **Ağustos** | Yeni Sezon | DIS, HD | Ağustos earnings hisseleri — ayrı rapor |

### 12.3 Son Uyarılar (KESİN)

> **1. EARNINGS PLAY = 2-5 GÜN ENTRY, 1-2 GÜN EXIT, MAX 2 GÜN HOLD.**
> Earnings play uzun vadeli DEĞİLDİR. Zamanla çıkış YASAK. Ağustos'ta çıkış YASAK. 21 DTE exit YASAK. Earnings sonrası 1-2 gün içinde KAPAT.
>
> **2. MEKANİK KAR/STOP = DUYGU YOK.**
> %50 kar hedefine ulaşıldığında KAPAT. 2.0x stop loss'a ulaşıldığında KAPAT. "Biraz daha bekle" YASAK. "Düzelir belki" YASAK. "Analiz et, sonra karar ver" YASAK. Mekanik kurallar, duygu yok.
>
> **3. FOMC ÇAKIŞMASI = YARI POZİSYON.**
> UNH (28 Temmuz BMO) ve V (28 Temmuz AMC) FOMC (29 Temmuz) öncesi. Normal boyutun %50'si. FOMC volatilitesi pozisyonu etkileyebilir. Ertesi gün sabah açılışta KAPAT.
>
> **4. IV CRUSH = KAZANÇ KAYNAĞI, AMA TEK KAYNAK DEĞİL.**
> IV crush beklenenden düşük gerçekleşirse, EARLY EXIT. Earnings sonuçları kötüyse ve hisse yön değiştirirse, HEMEN kapat. Earnings play = yön + IV crush, sadece IV crush değil.
>
> **5. POZİSYON BÜYÜKLÜĞÜ = RİSK YÖNETİMİ.**
> Tek hisse %1-2 risk. Sektör %3-6. Toplam %5-10. Earnings play = kısa vadeli, yüksek frekans, düşük tek risk. "All-in" YASAK. "Son para" YASAK. "Kredi kartı" YASAK.
>
> **6. EĞİTİM ve DENEYİM = ZORUNLU.**
> Short Straddle, Short Strangle, Iron Condor — bu stratejiler deneyim gerektirir. Yeni başlayanlar Bull Put Spread ve Long Call Spread ile başlasın. "YouTube'da izledim, yaparım" YASAK. Demo hesap, simülasyon, küçük boyut ile başla.
>
> **7. NKE, DIS, HD, COIN, HOOD = TEMMUZ'DA EARNINGS YOK veya BELİRSİZ.**
> NKE 30 Haziran'da açıkladı. DIS, HD Ağustos'ta. COIN, HOOD belirsiz. Bu hisseler "FOMC volatilite play" veya "post-earnings momentum play" olarak değerlendirilir. Earnings play değil, genel piyasa bahisidir.
>
> **8. BU RAPOR = EĞİTİM ve ANALİZ, YATIRIM TAVSİYESİ DEĞİL.**
> Bu rapor eğitim ve analiz amaçlıdır. Yatırım tavsiyesi değildir. Kişisel finansal durumunuzu, risk toleransınızı, yatırım hedeflerinizi dikkate alın. Profesyonel finansal danışmana başvurun. Kaybetmeyi göze alamayacağınız parayla işlem yapmayın.

---

**Rapor Hazırlayan:** Sektörel Opsiyon Analisti — Kimi Code CLI
**Rapor Tarihi:** 12 Haziran 2026
**Fiyat Verileri:** 12 Haziran 2026 kapanış fiyatları (Search ile güncellendi)
**Earnings Tarihleri:** Temmuz 2026 (Beklenen tarihler, kesin tarihler için şirket duyurularını takip edin)
**FOMC:** 29 Temmuz 2026

**Versiyon:** v2.1 — EARNINGS PLAY (IV Crush) Formatı — Tüm stratejiler düzeltilmiş
**Değişiklikler:**
- v2.0: İlk sürüm (Temmuz 2026 Master Stratejisi)
- v2.1: EARNINGS PLAY formatına geçiş (Entry 2-5 gün önce, Exit 1-2 gün sonra, Max 2 gün hold)
- v2.1: Fiyatlar 12 Haziran 2026 Search ile güncellendi
- v2.1: IV Crush Beklentisi bölümü her hisse için eklendi
- v2.1: FOMC çakışması uyarıları güncellendi (UNH, V yarım pozisyon)
- v2.1: NKE, DIS, HD, COIN, HOOD post-earnings/FOMC volatilite play olarak işaretlendi
- v2.1: "Zamanla çıkış", "21 DTE exit", "Ağustos'ta çıkış" referansları KALDIRILDI
- v2.1: Sektörler arası karşılaştırma, risk/ödül profili, portföy kuralları eklendi

**Sonraki Adımlar:**
1. Günlük fiyat ve IV takibi (12-31 Temmuz 2026)
2. Greeks analizi güncellemesi (haftalık)
3. CPR ve OI güncellemesi (haftalık)
4. FOMC öncesi pozisyon incelemesi (25-28 Temmuz)
5. Earnings sonrası IV crush değerlendirmesi (15-31 Temmuz)
6. Ağustos 2026 earnings takvimi hazırlığı (DIS, HD, COIN, HOOD)

---

> **📌 ÖNEMLİ NOT:** Bu rapor, Temmuz 2026 earnings sezonu için **EARNINGS PLAY (IV Crush)** formatında hazırlanmıştır. Tüm stratejiler kısa vadeli (2-5 gün entry, 1-2 gün exit), mekanik kar/stop kurallarına tabidir. Earnings play uzun vadeli DEĞİLDİR. Zamanla çıkış YASAK. Mekanik kurallar, duygu yok. Risk yönetimi, pozisyon büyüklüğü, portföy çeşitlendirme zorunludur.

---
**END OF REPORT**
