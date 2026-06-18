# Bölüm 2: Teknoloji Hisseleri Stratejileri (Temmuz 2026 Earnings) — v2.1 EARNINGS PLAY FORMATI

> **KRİTİK DÜZELTME (v2.1):** Bu bölüm tamamen Earnings Play (IV Crush) formatında yeniden yazılmıştır. Önceki sürümdeki "21 DTE çıkış", "Zamanla çıkış", "Ağustos'ta çıkış" gibi ifadeler YANLIŞTI ve düzeltilmiştir. Tüm stratejiler EARNINGS PLAY formatındadır: Entry = Earnings'ten 2-5 gün önce, Exit = Earnings sonrası 1-2 gün içinde, Max Hold = 2 gün, Kar Hedefi = %50-75 kredi (IV crush sonrası).

> **Teknoloji Sektörü Özeti:** 12 mega-cap ve growth teknoloji şirketi Temmuz 2026'da earnings açıklayacak. Tüm hisseler FOMC (28-29 Temmuz) ile çakışma riski taşıyor — yalnızca NFLX (16 Temmuz) ve PLTR (31 Temmuz) FOMC'den önce/sonra temiz bir giriş penceresi sunuyor. Teknoloji sektörü IV crush potansiyeli %30-55 arasında. Yüksek beta değerleri (1.1-2.5) pozisyon büyüklüğünü küçük tutmayı gerektirir. Yeni eklenen MU, INTC ve PLTR ile birlikte teknoloji sektörü temsilcisi sayısı 12'ye çıkmıştır. Bu bölümde her hisse için Earnings Play formatında Iron Condor ana stratejisi, Greeks analizi, bütçe dostu alternatifler, IV Crush beklentisi ve giriş-çıkış takvimi detaylandırılmıştır.

---

## Teknoloji Sektörü Güncel Verileri (12 Haziran 2026)

| Hisse | Fiyat | Günlük % | YTD % | 52W Range | Beta | IV30 | IV Rank | Earnings | FOMC Risk | IV Crush |
|-------|-------|----------|-------|-----------|------|------|---------|----------|-----------|----------|
| **AMD** | $488.45 | +7.97% | +128.08% | $115-$546 | 2.490 | 71.4% | **91.7%** | 30 Temmuz | 🔴 Yüksek | %45-55 |
| **TSLA** | $386.88 | — | +9.07% | $289-$499 | 1.798 | ~55% | ~80% | 22 Temmuz | 🟡 Orta | %40-50 |
| **NFLX** | $81.27 | -0.89% | +11.86% | $60-$120 | 1.491 | 31.2% | ~75% | 16 Temmuz | 🟢 Düşük | %35-45 |
| **NVDA** | $204.87 | +2.22% | +44.93% | $141-$237 | 2.202 | 39.1% | ~70% | 30 Temmuz | 🔴 Yüksek | %45-55 |
| **META** | $561.48 | -1.66% | -16.66% | $520-$796 | 1.229 | ~38% | ~65% | 29 Temmuz | 🔴 Yüksek | %35-45 |
| **GOOGL** | $348.02 | -2.34% | +103.42% | $162-$409 | 1.237 | 30.9% | ~58% | 22 Temmuz | 🟡 Orta | %30-40 |
| **AAPL** | $293.60 | +0.69% | +48.78% | $195-$317 | 1.086 | 24.2% | ~55% | 30 Temmuz | 🔴 Yüksek | %30-40 |
| **AMZN** | $237.21 | -0.33% | +12.69% | $196-$279 | 1.444 | 32.0% | ~60% | 30 Temmuz | 🔴 Yüksek | %35-45 |
| **MSFT** | $386.73 | -2.68% | -12.57% | $356-$555 | 1.103 | 30.0% | ~50% | 29 Temmuz | 🔴 Yüksek | %25-35 |
| **MU** | $995.87 | +11.66% | — | $600-$1,100 | 1.850 | ~45% | ~72% | 30 Temmuz | 🔴 Yüksek | %45-55 |
| **INTC** | $116.96 | +9.27% | — | $70-$130 | 1.650 | ~42% | ~68% | 24 Temmuz | 🟡 Orta | %35-45 |
| **PLTR** | $131.08 | +0.67% | — | $80-$150 | 2.350 | ~48% | ~78% | 31 Temmuz | 🟢 Düşük | %45-55 |

> **Güncel Fiyat Notu (12 Haziran 2026):** TSLA $409.00 → **$386.88**, META $585.00 → **$561.48**, GOOGL $363.00 → **$348.02**, AAPL $302.00 → **$293.60**, AMZN $245.00 → **$237.21**, MSFT $412.00 → **$386.73**. Güncel fiyatlar Yahoo Finance (12 Haziran 2026, 12:01 PM EDT) verileri ile güncellenmiştir. Fiyat değişiklikleri strike'lar, breakeven'lar, wing width ve risk hesaplamalarını etkilemiştir.

> **EARNINGS PLAY FORMATI — KRİTİK KURALLAR:**
> 1. Entry: Earnings'ten 2-5 gün önce (IV yükselmişken)
> 2. Exit: Earnings sonrası 1-2 gün içinde (IV crush sonrası)
> 3. Max Hold: BMO earnings = aynı gün akşam/ertesi gün; AMC earnings = ertesi gün sabah
> 4. Kar Hedefi: Toplanan kredinin %50-75'i (IV crush hızlı kazanç sağlar)
> 5. Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat
> 6. ⛔ TUTMA YASAK: Earnings play'ler 2 günden fazla tutulmaz. Gamma riski artar, IV fırsatı kaçar.

> **Sektör Notu:** Teknoloji hisselerinde 12 Haziran 2026 itibarıyla AMD %7.97 günlük artışla $488.45 seviyesine ulaşmış, 52 haftalık zirve $546'ya oldukça yaklaşmıştır. MU (Micron) %11.66 ve INTC (Intel) %9.27 günlük artışlarla dikkat çekmektedir. PLTR (Palantir) yüksek beta (2.35) ve AI temasıyla spekülatif hareket potansiyeli taşımaktadır. TSLA, META, GOOGL, AAPL, AMZN ve MSFT fiyatları 12 Haziran verileri ile güncellenmiştir.

---

## 2.1 AMD — $488.45 — CPR: 0.71 ⭐

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $488.45 | 12 Haziran 2026 kapanış — günlük 7.97% |
| **RSI(14)** | 74 | Aşırı alım bölgesinde (RSI>70) |
| **50MA** | $364.45 | Üzerinde (34.0%) — kısa vadeli trend pozitif |
| **200MA** | $247.60 | Üzerinde (97.3%) — uzun vadeli trend pozitif |
| **ATR(14)** | $28.50 | Günlük ortalama hareket $28.50 |
| **Bollinger** | Üst:$545 / Middle:$470 / Alt:$395 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Bullish Crossover | MACD sinyal çizgisinin üzerinde — momentum pozitif |
| **IV30** | 71.4% | Çok yüksek — earnings öncesi volatilite şişmesi |
| **IV Rank** | 91.69% | Tüm teknoloji hisseleri arasında EN YÜKSEK |
| **Hacim CPR** | 0.71 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.76 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | +128.08% | Muazzam performans — kar realizasyonu riski yüksek |
| **Beta** | 2.490 | Çok yüksek volatilite — S&P 500'ün 2.5 katı hareket |
| **Earnings** | 30 Temmuz 2026 | 🔴 Yüksek |
| **Entry Penceresi** | 25-28 Temmuz | ⚠️ Yarım pozisyon — FOMC çakışması |

> **AMD Değerlendirmesi:** AMD IV Rank %91.69 ile muazzam kredi potansiyeli sunuyor. Beta 2.490 çok yüksek — pozisyon boyutu kesinlikle %1'i geçmemeli! Earnings 30 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.71 → Asimetrik — Call Ağır (%60/%40) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%60/%40)) ⭐

| Parametre | Değer |
|-----------|-------|
| Wing Width | $48.85 |
| Short Call | $660.00 |
| Long Call | $708.85 |
| Short Put | $320.00 |
| Long Put | $271.15 |
| **Tahmini Kredi** | **$24.35** |
| Max Risk | $2450/kontrat |
| Breakeven'lar | $295.65 / $684.35 |
| **K.O. Olasılığı** | **~75%** |
| Pozisyon Boyutu | **Hesabın %1'i** |
| Kar Hedefi | $12.18 (%50 kredi) |
| Stop-Loss | $48.70 (200% kredi) |
| **IV Crush Beklentisi** | **%45-55** |
| **Optimal Çıkış** | **Earnings + 2 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** AMD IV Rank %91.69 ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $48.85 (fiyatın %10'u) geniş tutulmalı. Short Call $660.00 (fiyattan 35.1% uzakta) ve Short Put $320.00 (fiyattan 34.5% uzakta). Breakeven'lar geniş — K.O. olasılığı ~75%. Entry: 25-28 Temmuz. Exit: Earnings + 2 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | +0.03 | Hafif bullish bias — call tarafı ağır IC'den |
| **Theta** | +$1.85 | Günlük +$1.85 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$2.45 | IV Crush potansiyeli — IV Rank %91.69'den düşüş bekleniyor |
| **Gamma** | -0.08 | Çok düşük gamma — gamma riski minimal |

> **Greeks Yorumu:** Delta +0.03 hafif bullish bias gösteriyor. Theta +$1.85 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$2.45 ile IV Crush'tan fayda sağlanacak. AMD earnings sonrası IV genellikle %45-55 düşer — bu pozisyon değerini $12-19 artırabilir. Gamma -0.08 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 60% | 40% | CPR 0.71 0.60-0.75 aralığında. Call opsiyonları put'lara göre daha şişmiş. YTD güçlü performans + kar realizasyonu riski call talebini artırıyor. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bull Call Spread |
| Long Bull | $490.00 |
| Short Bull | $540.00 |
| Maliyet | ~$25.00 |
| Max Kar | ~$25.00 |
| Breakeven | ~$515.00 |
| Stop-Loss | Maliyetin %50'si (~$12.50) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bull Call Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Call @$545 (Lottery) | ~$42 | Sınırsız |
| $50-$200 | Debit Call Spread ($490C/$500C) | ~$350 | ~$650 |
| $200-$500 | Long Call Butterfly ($476C/$490C/$505C) | ~$216 | ~$4,150 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bull almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bull spread daha rasyonel. $200-$500 bütçe ile Long Bull Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **25-28 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Yarım pozisyon (%0.5 hesap) |
| **30 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **30 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 25-28 Temmuz tarihlerinde yapılır. Earnings günü (30 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %45-55 | Teknoloji sektörü ortalaması. AMD yüksek beta nedeniyle derin crush. |
| **Crush Süresi** | 2-3 gün | Orta crush — 2 gün bekle, 3. gün riskli |
| **Kazanç Potansiyeli (E+1 Gün)** | $12.00 (49% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $16.50 (68% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $18.00 (74% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 2 gün** | 2 gün bekle, orta kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** AMD earnings sonrası IV genellikde %45-55 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---


## 2.2 TSLA — $386.88 — CPR: 0.64

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $386.88 | 12 Haziran 2026 kapanış — günlük 0.00% |
| **RSI(14)** | 58 | Nötr-alcak — momentum pozitif |
| **50MA** | $396.03 | Altında (2.3%) — kısa vadeli trend negatif |
| **200MA** | $414.57 | Altında (6.7%) — uzun vadeli trend negatif |
| **ATR(14)** | $22.40 | Günlük ortalama hareket $22.40 |
| **Bollinger** | Üst:$445 / Middle:$405 / Alt:$365 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Sinyal Hattına Yakın | MACD sinyal çizgisine yakın — cross riski |
| **IV30** | 55% | Yüksek — earnings öncesi volatilite şişmesi |
| **IV Rank** | ~80% | İyi — kredi toplama için uygun seviye |
| **Hacim CPR** | 0.64 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.69 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | +9.07% | Pozitif ama teknoloji sektörüne göre zayıf |
| **Beta** | 1.798 | Yüksek volatilite — S&P 500'ün 1.8 katı hareket |
| **Earnings** | 22 Temmuz 2026 | 🟡 Orta |
| **Entry Penceresi** | 17-20 Temmuz | ⚠️ Yarım pozisyon — FOMC yakınlığı |

> **TSLA Değerlendirmesi:** TSLA IV Rank %80 ile muazzam kredi potansiyeli sunuyor. Beta 1.798 yüksek — pozisyon boyutu %1 ile sınırlı. Earnings 22 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.64 → Asimetrik — Call Ağır (%60/%40) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%60/%40))

| Parametre | Değer |
|-----------|-------|
| Wing Width | $38.69 |
| Short Call | $490.00 |
| Long Call | $528.69 |
| Short Put | $295.00 |
| Long Put | $256.31 |
| **Tahmini Kredi** | **$14.80** |
| Max Risk | $2389/kontrat |
| Breakeven'lar | $280.19 / $528.81 |
| **K.O. Olasılığı** | **~81%** |
| Pozisyon Boyutu | **Hesabın %1'i** |
| Kar Hedefi | $7.40 (%50 kredi) |
| Stop-Loss | $29.60 (200% kredi) |
| **IV Crush Beklentisi** | **%40-50** |
| **Optimal Çıkış** | **Earnings + 2 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** TSLA IV Rank ~80% ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $38.69 (fiyatın %10'u) geniş tutulmalı. Short Call $490.00 (fiyattan 26.7% uzakta) ve Short Put $295.00 (fiyattan 23.7% uzakta). Breakeven'lar geniş — K.O. olasılığı ~81%. Entry: 17-20 Temmuz. Exit: Earnings + 2 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | +0.02 | Hafif bullish bias — call tarafı ağır IC'den |
| **Theta** | +$1.10 | Günlük +$1.10 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$1.48 | IV Crush potansiyeli — IV Rank ~80%'den düşüş bekleniyor |
| **Gamma** | -0.05 | Çok düşük gamma — gamma riski minimal |

> **Greeks Yorumu:** Delta +0.02 neredeyse nötr gösteriyor. Theta +$1.10 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$1.48 ile IV Crush'tan fayda sağlanacak. TSLA earnings sonrası IV genellikle %40-50 düşer — bu pozisyon değerini $7-12 artırabilir. Gamma -0.05 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 60% | 40% | CPR 0.64 0.60-0.75 aralığında. Call opsiyonları put'lara göre daha şişmiş. Dengeli piyasa — call/put talebi eşit. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bull Call Spread |
| Long Bull | $387.00 |
| Short Bull | $425.00 |
| Maliyet | ~$22.50 |
| Max Kar | ~$15.50 |
| Breakeven | ~$409.50 |
| Stop-Loss | Maliyetin %50'si (~$11.25) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bull Call Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Call @$445 (Lottery) | ~$48 | Sınırsız |
| $50-$200 | Debit Call Spread ($387C/$397C) | ~$180 | ~$820 |
| $200-$500 | Long Call Butterfly ($377C/$387C/$397C) | ~$210 | ~$3,200 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bull almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bull spread daha rasyonel. $200-$500 bütçe ile Long Bull Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **17-20 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Yarım pozisyon (%0.5 hesap) |
| **22 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **22 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 17-20 Temmuz tarihlerinde yapılır. Earnings günü (22 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %40-50 | Teknoloji sektörü ortalaması. TSLA düşük beta nedeniyle hızlı crush. |
| **Crush Süresi** | 2-4 gün | Uzun crush — 2 gün bekle, 3. gün riskli |
| **Kazanç Potansiyeli (E+1 Gün)** | $7.10 (48% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $9.90 (67% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $10.80 (73% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 2 gün** | 2 gün bekle, orta kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** TSLA earnings sonrası IV genellikde %40-50 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---


## 2.3 NFLX — $81.27 — CPR: 0.72 ⭐

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $81.27 | 12 Haziran 2026 kapanış — günlük -0.89% |
| **RSI(14)** | 42 | Ayıcak bölgesine yakın — zayıf momentum |
| **50MA** | $91.91 | Altında (11.6%) — kısa vadeli trend negatif |
| **200MA** | $100.01 | Altında (18.7%) — uzun vadeli trend negatif |
| **ATR(14)** | $4.85 | Günlük ortalama hareket $4.85 |
| **Bollinger** | Üst:$88 / Middle:$82 / Alt:$76 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Bearish Crossover | MACD sinyal çizgisinin altında — momentum negatif |
| **IV30** | 31.2% | Orta-yüksek — earnings öncesi volatilite şişmesi |
| **IV Rank** | ~75% | İyi — kredi toplama için uygun seviye |
| **Hacim CPR** | 0.72 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.77 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | +11.86% | Pozitif ama teknoloji sektörüne göre zayıf |
| **Beta** | 1.491 | Orta volatilite — S&P 500'ün 1.5 katı hareket |
| **Earnings** | 16 Temmuz 2026 | 🟢 Düşük |
| **Entry Penceresi** | 14-15 Temmuz | 🟢 Temiz giriş — FOMC çakışması yok |

> **NFLX Değerlendirmesi:** NFLX FOMC'den uzak tek temiz giriş penceresi sunuyor. Beta 1.491 orta-yüksek — pozisyon boyutu %1-1.5 arasında. Earnings 16 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.72 → Asimetrik — Call Ağır (%60/%40) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%60/%40)) ⭐

| Parametre | Değer |
|-----------|-------|
| Wing Width | $8.13 |
| Short Call | $102.50 |
| Long Call | $110.63 |
| Short Put | $62.50 |
| Long Put | $54.37 |
| **Tahmini Kredi** | **$2.50** |
| Max Risk | $563/kontrat |
| Breakeven'lar | $60.00 / $105.00 |
| **K.O. Olasılığı** | **~84%** |
| Pozisyon Boyutu | **Hesabın %1-2'si** |
| Kar Hedefi | $1.25 (%50 kredi) |
| Stop-Loss | $5.00 (200% kredi) |
| **IV Crush Beklentisi** | **%35-45** |
| **Optimal Çıkış** | **Earnings + 1 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** NFLX IV Rank ~75% ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $8.13 (fiyatın %10'u) geniş tutulmalı. Short Call $102.50 (fiyattan 26.1% uzakta) ve Short Put $62.50 (fiyattan 23.1% uzakta). Breakeven'lar geniş — K.O. olasılığı ~84%. Entry: 14-15 Temmuz. Exit: Earnings + 1 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | -0.01 | Neredeyse nötr — simetrik IC ideal değer |
| **Theta** | +$0.22 | Günlük +$0.22 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$0.28 | IV Crush potansiyeli — IV Rank ~75%'den düşüş bekleniyor |
| **Gamma** | -0.02 | Düşük gamma — hızlı hareket riski sınırlı |

> **Greeks Yorumu:** Delta -0.01 neredeyse nötr gösteriyor. Theta +$0.22 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$0.28 ile IV Crush'tan fayda sağlanacak. NFLX earnings sonrası IV genellikle %35-45 düşer — bu pozisyon değerini $1-2 artırabilir. Gamma -0.02 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 50% | 50% | CPR 0.72 0.60-0.75 aralığında. Call opsiyonları put'lara göre daha şişmiş. Dengeli piyasa — call/put talebi eşit. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bear Put Spread |
| Long Bear | $80.00 |
| Short Bear | $70.00 |
| Maliyet | ~$3.50 |
| Max Kar | ~$6.50 |
| Breakeven | ~$76.50 |
| Stop-Loss | Maliyetin %50'si (~$1.75) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bear Put Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Put @$72.50 (Lottery) | ~$18 | ~$725 |
| $50-$200 | Debit Put Spread ($80P/$70P) | ~$350 | ~$650 |
| $200-$500 | Long Put Butterfly ($76P/$81P/$86P) | ~$210 | ~$1,100 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bear almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bear spread daha rasyonel. $200-$500 bütçe ile Long Bear Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **14-15 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Tam pozisyon (%1-2 hesap) |
| **16 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **16 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 14-15 Temmuz tarihlerinde yapılır. Earnings günü (16 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %35-45 | Teknoloji sektörü ortalaması. NFLX düşük beta nedeniyle hızlı crush. |
| **Crush Süresi** | 1-2 gün | Hızlı crush — ertesi gün %50 kar al |
| **Kazanç Potansiyeli (E+1 Gün)** | $1.23 (49% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $1.48 (59% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $1.58 (63% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 1 gün** | 1 gün bekle, hızlı kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** NFLX earnings sonrası IV genellikde %35-45 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---


## 2.4 NVDA — $204.87 — CPR: 0.68

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $204.87 | 12 Haziran 2026 kapanış — günlük 2.22% |
| **RSI(14)** | 61 | Nötr-alcak — momentum pozitif |
| **50MA** | $204.20 | Üzerinde (0.3%) — kısa vadeli trend pozitif |
| **200MA** | $188.74 | Üzerinde (8.5%) — uzun vadeli trend pozitif |
| **ATR(14)** | $12.80 | Günlük ortalama hareket $12.80 |
| **Bollinger** | Üst:$225 / Middle:$205 / Alt:$185 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Bullish Crossover | MACD sinyal çizgisinin üzerinde — momentum pozitif |
| **IV30** | 39.1% | Orta-yüksek — earnings öncesi volatilite şişmesi |
| **IV Rank** | ~70% | İyi — kredi toplama için uygun seviye |
| **Hacim CPR** | 0.68 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.73 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | +44.93% | Güçlü performans |
| **Beta** | 2.202 | Çok yüksek volatilite — S&P 500'ün 2.2 katı hareket |
| **Earnings** | 30 Temmuz 2026 | 🔴 Yüksek |
| **Entry Penceresi** | 25-28 Temmuz | ⚠️ Yarım pozisyon — FOMC çakışması |

> **NVDA Değerlendirmesi:** NVDA IV Rank ~70 iyi kredi potansiyeli sunuyor. Beta 2.202 çok yüksek — pozisyon boyutu kesinlikle %1'i geçmemeli! Earnings 30 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.68 → Asimetrik — Call Ağır (%60/%40) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%60/%40))

| Parametre | Değer |
|-----------|-------|
| Wing Width | $20.49 |
| Short Call | $250.00 |
| Long Call | $270.49 |
| Short Put | $165.00 |
| Long Put | $144.51 |
| **Tahmini Kredi** | **$5.75** |
| Max Risk | $1474/kontrat |
| Breakeven'lar | $159.25 / $255.75 |
| **K.O. Olasılığı** | **~86%** |
| Pozisyon Boyutu | **Hesabın %1-1.5'i** |
| Kar Hedefi | $2.88 (%50 kredi) |
| Stop-Loss | $11.50 (200% kredi) |
| **IV Crush Beklentisi** | **%45-55** |
| **Optimal Çıkış** | **Earnings + 2 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** NVDA IV Rank ~70% ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $20.49 (fiyatın %10'u) geniş tutulmalı. Short Call $250.00 (fiyattan 22.0% uzakta) ve Short Put $165.00 (fiyattan 19.5% uzakta). Breakeven'lar geniş — K.O. olasılığı ~86%. Entry: 25-28 Temmuz. Exit: Earnings + 2 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | +0.02 | Hafif bullish bias — call tarafı ağır IC'den |
| **Theta** | +$0.42 | Günlük +$0.42 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$0.58 | IV Crush potansiyeli — IV Rank ~70%'den düşüş bekleniyor |
| **Gamma** | -0.03 | Düşük gamma — hızlı hareket riski sınırlı |

> **Greeks Yorumu:** Delta +0.02 neredeyse nötr gösteriyor. Theta +$0.42 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$0.58 ile IV Crush'tan fayda sağlanacak. NVDA earnings sonrası IV genellikle %45-55 düşer — bu pozisyon değerini $3-5 artırabilir. Gamma -0.03 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 60% | 40% | CPR 0.68 0.60-0.75 aralığında. Call opsiyonları put'lara göre daha şişmiş. YTD güçlü performans + kar realizasyonu riski call talebini artırıyor. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bear Put Spread |
| Long Bear | $205.00 |
| Short Bear | $185.00 |
| Maliyet | ~$10.00 |
| Max Kar | ~$10.00 |
| Breakeven | ~$195.00 |
| Stop-Loss | Maliyetin %50'si (~$5.00) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bear Put Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Put @$190 (Lottery) | ~$18 | ~$1,900 |
| $50-$200 | Debit Put Spread ($205P/$185P) | ~$95 | ~$905 |
| $200-$500 | Long Put Butterfly ($197P/$205P/$213P) | ~$228 | ~$1,820 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bear almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bear spread daha rasyonel. $200-$500 bütçe ile Long Bear Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **25-28 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Yarım pozisyon (%0.5 hesap) |
| **30 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **30 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 25-28 Temmuz tarihlerinde yapılır. Earnings günü (30 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %45-55 | Teknoloji sektörü ortalaması. NVDA yüksek beta nedeniyle derin crush. |
| **Crush Süresi** | 2-3 gün | Orta crush — 2 gün bekle, 3. gün riskli |
| **Kazanç Potansiyeli (E+1 Gün)** | $2.76 (48% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $3.97 (69% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $4.26 (74% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 2 gün** | 2 gün bekle, orta kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** NVDA earnings sonrası IV genellikde %45-55 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---


## 2.5 META — $561.48 — CPR: 0.69

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $561.48 | 12 Haziran 2026 kapanış — günlük 0.00% |
| **RSI(14)** | 38 | Ayıcak bölgesine yakın — zayıf momentum |
| **50MA** | $620.28 | Altında (9.5%) — kısa vadeli trend negatif |
| **200MA** | $661.64 | Altında (15.1%) — uzun vadeli trend negatif |
| **ATR(14)** | $18.50 | Günlük ortalama hareket $18.50 |
| **Bollinger** | Üst:$615 / Middle:$585 / Alt:$555 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Bearish Crossover | MACD sinyal çizgisinin altında — momentum negatif |
| **IV30** | 38% | Orta-yüksek — earnings öncesi volatilite şişmesi |
| **IV Rank** | ~65% | İyi — kredi toplama için uygun seviye |
| **Hacim CPR** | 0.69 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.74 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | -16.66% | Zayıf performans — baskı devam ediyor |
| **Beta** | 1.229 | Orta volatilite — S&P 500'ün 1.2 katı hareket |
| **Earnings** | 29 Temmuz 2026 | 🔴 Yüksek |
| **Entry Penceresi** | 25-27 Temmuz | ⚠️ Yarım pozisyon — FOMC çakışması |

> **META Değerlendirmesi:** META IV Rank ~65 iyi kredi potansiyeli sunuyor. Beta 1.229 düşük — pozisyon boyutu %1-2 arasında tutulabilir. Earnings 29 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.69 → Asimetrik — Call Ağır (%60/%40) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%60/%40))

| Parametre | Değer |
|-----------|-------|
| Wing Width | $56.15 |
| Short Call | $665.00 |
| Long Call | $721.15 |
| Short Put | $455.00 |
| Long Put | $398.85 |
| **Tahmini Kredi** | **$14.85** |
| Max Risk | $4115/kontrat |
| Breakeven'lar | $440.15 / $679.85 |
| **K.O. Olasılığı** | **~87%** |
| Pozisyon Boyutu | **Hesabın %1-2'si** |
| Kar Hedefi | $7.43 (%50 kredi) |
| Stop-Loss | $29.70 (200% kredi) |
| **IV Crush Beklentisi** | **%35-45** |
| **Optimal Çıkış** | **Earnings + 2 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** META IV Rank ~65% ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $56.15 (fiyatın %10'u) geniş tutulmalı. Short Call $665.00 (fiyattan 18.4% uzakta) ve Short Put $455.00 (fiyattan 19.0% uzakta). Breakeven'lar geniş — K.O. olasılığı ~87%. Entry: 25-27 Temmuz. Exit: Earnings + 2 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | +0.02 | Hafif bullish bias — call tarafı ağır IC'den |
| **Theta** | +$1.10 | Günlük +$1.10 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$1.42 | IV Crush potansiyeli — IV Rank ~65%'den düşüş bekleniyor |
| **Gamma** | -0.04 | Düşük gamma — hızlı hareket riski sınırlı |

> **Greeks Yorumu:** Delta +0.02 neredeyse nötr gösteriyor. Theta +$1.10 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$1.42 ile IV Crush'tan fayda sağlanacak. META earnings sonrası IV genellikle %35-45 düşer — bu pozisyon değerini $7-12 artırabilir. Gamma -0.04 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 60% | 40% | CPR 0.69 0.60-0.75 aralığında. Call opsiyonları put'lara göre daha şişmiş. YTD zayıf performans + dip alım beklentisi call talebini artırıyor. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bear Put Spread |
| Long Bear | $561.00 |
| Short Bear | $520.00 |
| Maliyet | ~$21.50 |
| Max Kar | ~$21.50 |
| Breakeven | ~$539.50 |
| Stop-Loss | Maliyetin %50'si (~$10.75) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bear Put Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Put @$520 (Lottery) | ~$52 | ~$5,200 |
| $50-$200 | Debit Put Spread ($561P/$521P) | ~$185 | ~$1,815 |
| $200-$500 | Long Put Butterfly ($544P/$561P/$578P) | ~$235 | ~$3,250 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bear almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bear spread daha rasyonel. $200-$500 bütçe ile Long Bear Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **25-27 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Yarım pozisyon (%0.5 hesap) |
| **29 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **29 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 25-27 Temmuz tarihlerinde yapılır. Earnings günü (29 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %35-45 | Teknoloji sektörü ortalaması. META düşük beta nedeniyle hızlı crush. |
| **Crush Süresi** | 2-3 gün | Orta crush — 2 gün bekle, 3. gün riskli |
| **Kazanç Potansiyeli (E+1 Gün)** | $7.13 (48% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $10.10 (68% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $10.99 (74% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 2 gün** | 2 gün bekle, orta kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** META earnings sonrası IV genellikde %35-45 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---


## 2.6 GOOGL — $348.02 — CPR: 0.58

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $348.02 | 12 Haziran 2026 kapanış — günlük 0.00% |
| **RSI(14)** | 55 | Nötr-alcak — momentum pozitif |
| **50MA** | $356.15 | Altında (2.3%) — kısa vadeli trend negatif |
| **200MA** | $304.86 | Üzerinde (14.2%) — uzun vadeli trend pozitif |
| **ATR(14)** | $11.20 | Günlük ortalama hareket $11.20 |
| **Bollinger** | Üst:$380 / Middle:$363 / Alt:$346 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Bullish Crossover | MACD sinyal çizgisinin üzerinde — momentum pozitif |
| **IV30** | 30.9% | Orta-yüksek — earnings öncesi volatilite şişmesi |
| **IV Rank** | ~58% | Marjinal-iyi — kredi toplama için sınır değer |
| **Hacim CPR** | 0.58 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.63 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | +103.42% | Muazzam performans — kar realizasyonu riski yüksek |
| **Beta** | 1.237 | Orta volatilite — S&P 500'ün 1.2 katı hareket |
| **Earnings** | 22 Temmuz 2026 | 🟡 Orta |
| **Entry Penceresi** | 17-20 Temmuz | ⚠️ Yarım pozisyon — FOMC yakınlığı |

> **GOOGL Değerlendirmesi:** GOOGL IV Rank ~58 iyi kredi potansiyeli sunuyor. Beta 1.237 düşük — pozisyon boyutu %1-2 arasında tutulabilir. Earnings 22 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.58 → Asimetrik — Call Ağır (%70/%30) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%70/%30))

| Parametre | Değer |
|-----------|-------|
| Wing Width | $34.80 |
| Short Call | $405.00 |
| Long Call | $439.80 |
| Short Put | $290.00 |
| Long Put | $255.20 |
| **Tahmini Kredi** | **$7.75** |
| Max Risk | $2705/kontrat |
| Breakeven'lar | $282.25 / $412.75 |
| **K.O. Olasılığı** | **~89%** |
| Pozisyon Boyutu | **Hesabın %1-2'si** |
| Kar Hedefi | $3.88 (%50 kredi) |
| Stop-Loss | $15.50 (200% kredi) |
| **IV Crush Beklentisi** | **%30-40** |
| **Optimal Çıkış** | **Earnings + 1 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** GOOGL IV Rank ~58% ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $34.80 (fiyatın %10'u) geniş tutulmalı. Short Call $405.00 (fiyattan 16.4% uzakta) ve Short Put $290.00 (fiyattan 16.7% uzakta). Breakeven'lar geniş — K.O. olasılığı ~89%. Entry: 17-20 Temmuz. Exit: Earnings + 1 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | +0.04 | Hafif bullish bias — call tarafı ağır IC'den |
| **Theta** | +$0.56 | Günlük +$0.56 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$0.75 | IV Crush potansiyeli — IV Rank ~58%'den düşüş bekleniyor |
| **Gamma** | -0.03 | Düşük gamma — hızlı hareket riski sınırlı |

> **Greeks Yorumu:** Delta +0.04 hafif bullish bias gösteriyor. Theta +$0.56 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$0.75 ile IV Crush'tan fayda sağlanacak. GOOGL earnings sonrası IV genellikle %30-40 düşer — bu pozisyon değerini $4-6 artırabilir. Gamma -0.03 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 70% | 30% | CPR 0.58 < 0.60 (sınırda). Call'lar AŞIRI şişmiş. YTD güçlü performans + kar realizasyonu riski call talebini artırıyor. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bear Put Spread |
| Long Bear | $348.00 |
| Short Bear | $318.00 |
| Maliyet | ~$14.50 |
| Max Kar | ~$14.50 |
| Breakeven | ~$333.50 |
| Stop-Loss | Maliyetin %50'si (~$7.25) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bear Put Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Put @$318 (Lottery) | ~$32 | ~$3,200 |
| $50-$200 | Debit Put Spread ($348P/$318P) | ~$145 | ~$1,455 |
| $200-$500 | Long Put Butterfly ($336P/$348P/$360P) | ~$245 | ~$2,900 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bear almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bear spread daha rasyonel. $200-$500 bütçe ile Long Bear Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **17-20 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Yarım pozisyon (%0.5 hesap) |
| **22 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **22 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 17-20 Temmuz tarihlerinde yapılır. Earnings günü (22 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %30-40 | Teknoloji sektörü ortalaması. GOOGL düşük beta nedeniyle hızlı crush. |
| **Crush Süresi** | 1-2 gün | Hızlı crush — ertesi gün %50 kar al |
| **Kazanç Potansiyeli (E+1 Gün)** | $3.80 (49% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $4.81 (62% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $4.96 (64% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 1 gün** | 1 gün bekle, hızlı kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** GOOGL earnings sonrası IV genellikde %30-40 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---


## 2.7 AAPL — $293.60 — CPR: 0.68

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $293.60 | 12 Haziran 2026 kapanış — günlük 0.00% |
| **RSI(14)** | 48 | Nötr — momentum dengeli |
| **50MA** | $282.21 | Üzerinde (4.0%) — kısa vadeli trend pozitif |
| **200MA** | $265.57 | Üzerinde (10.6%) — uzun vadeli trend pozitif |
| **ATR(14)** | $9.20 | Günlük ortalama hareket $9.20 |
| **Bollinger** | Üst:$315 / Middle:$302 / Alt:$289 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Bullish Crossover | MACD sinyal çizgisinin üzerinde — momentum pozitif |
| **IV30** | 24.2% | Orta — earnings öncesi volatilite şişmesi |
| **IV Rank** | ~55% | Marjinal-iyi — kredi toplama için sınır değer |
| **Hacim CPR** | 0.68 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.73 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | +48.78% | Güçlü performans |
| **Beta** | 1.086 | Düşük volatilite — S&P 500'ün 1.1 katı hareket |
| **Earnings** | 30 Temmuz 2026 | 🔴 Yüksek |
| **Entry Penceresi** | 25-28 Temmuz | ⚠️ Yarım pozisyon — FOMC çakışması |

> **AAPL Değerlendirmesi:** AAPL IV Rank ~55 iyi kredi potansiyeli sunuyor. Beta 1.086 düşük — pozisyon boyutu %1-2 arasında tutulabilir. Earnings 30 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.68 → Asimetrik — Call Ağır (%60/%40) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%60/%40))

| Parametre | Değer |
|-----------|-------|
| Wing Width | $29.36 |
| Short Call | $340.00 |
| Long Call | $369.36 |
| Short Put | $250.00 |
| Long Put | $220.64 |
| **Tahmini Kredi** | **$6.10** |
| Max Risk | $2326/kontrat |
| Breakeven'lar | $243.90 / $346.10 |
| **K.O. Olasılığı** | **~90%** |
| Pozisyon Boyutu | **Hesabın %1-2'si** |
| Kar Hedefi | $3.05 (%50 kredi) |
| Stop-Loss | $12.20 (200% kredi) |
| **IV Crush Beklentisi** | **%30-40** |
| **Optimal Çıkış** | **Earnings + 1 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** AAPL IV Rank ~55% ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $29.36 (fiyatın %10'u) geniş tutulmalı. Short Call $340.00 (fiyattan 15.8% uzakta) ve Short Put $250.00 (fiyattan 14.9% uzakta). Breakeven'lar geniş — K.O. olasılığı ~90%. Entry: 25-28 Temmuz. Exit: Earnings + 1 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | +0.02 | Hafif bullish bias — call tarafı ağır IC'den |
| **Theta** | +$0.44 | Günlük +$0.44 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$0.60 | IV Crush potansiyeli — IV Rank ~55%'den düşüş bekleniyor |
| **Gamma** | -0.02 | Düşük gamma — hızlı hareket riski sınırlı |

> **Greeks Yorumu:** Delta +0.02 neredeyse nötr gösteriyor. Theta +$0.44 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$0.60 ile IV Crush'tan fayda sağlanacak. AAPL earnings sonrası IV genellikle %30-40 düşer — bu pozisyon değerini $3-5 artırabilir. Gamma -0.02 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 60% | 40% | CPR 0.68 0.60-0.75 aralığında. Call opsiyonları put'lara göre daha şişmiş. YTD güçlü performans + kar realizasyonu riski call talebini artırıyor. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bear Put Spread |
| Long Bear | $293.00 |
| Short Bear | $268.00 |
| Maliyet | ~$12.00 |
| Max Kar | ~$12.00 |
| Breakeven | ~$281.00 |
| Stop-Loss | Maliyetin %50'si (~$6.00) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bear Put Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Put @$268 (Lottery) | ~$28 | ~$2,700 |
| $50-$200 | Debit Put Spread ($293P/$268P) | ~$120 | ~$1,380 |
| $200-$500 | Long Put Butterfly ($284P/$293P/$302P) | ~$205 | ~$2,400 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bear almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bear spread daha rasyonel. $200-$500 bütçe ile Long Bear Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **25-28 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Yarım pozisyon (%0.5 hesap) |
| **30 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **30 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 25-28 Temmuz tarihlerinde yapılır. Earnings günü (30 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %30-40 | Teknoloji sektörü ortalaması. AAPL düşük beta nedeniyle hızlı crush. |
| **Crush Süresi** | 1-2 gün | Hızlı crush — ertesi gün %50 kar al |
| **Kazanç Potansiyeli (E+1 Gün)** | $2.93 (48% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $3.66 (60% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $3.84 (63% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 1 gün** | 1 gün bekle, hızlı kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** AAPL earnings sonrası IV genellikde %30-40 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---


## 2.8 AMZN — $237.21 — CPR: 0.62

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $237.21 | 12 Haziran 2026 kapanış — günlük 0.00% |
| **RSI(14)** | 52 | Nötr-alcak — momentum pozitif |
| **50MA** | $251.91 | Altında (5.8%) — kısa vadeli trend negatif |
| **200MA** | $232.24 | Üzerinde (2.1%) — uzun vadeli trend pozitif |
| **ATR(14)** | $8.50 | Günlük ortalama hareket $8.50 |
| **Bollinger** | Üst:$258 / Middle:$245 / Alt:$232 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Bearish Crossover | MACD sinyal çizgisinin altında — momentum negatif |
| **IV30** | 32.0% | Orta-yüksek — earnings öncesi volatilite şişmesi |
| **IV Rank** | ~60% | Marjinal-iyi — kredi toplama için sınır değer |
| **Hacim CPR** | 0.62 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.67 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | +12.69% | Pozitif ama teknoloji sektörüne göre zayıf |
| **Beta** | 1.444 | Orta volatilite — S&P 500'ün 1.4 katı hareket |
| **Earnings** | 30 Temmuz 2026 | 🔴 Yüksek |
| **Entry Penceresi** | 25-28 Temmuz | ⚠️ Yarım pozisyon — FOMC çakışması |

> **AMZN Değerlendirmesi:** AMZN IV Rank ~60 iyi kredi potansiyeli sunuyor. Beta 1.444 orta-yüksek — pozisyon boyutu %1-1.5 arasında. Earnings 30 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.62 → Asimetrik — Call Ağır (%60/%40) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%60/%40))

| Parametre | Değer |
|-----------|-------|
| Wing Width | $23.72 |
| Short Call | $280.00 |
| Long Call | $303.72 |
| Short Put | $195.00 |
| Long Put | $171.28 |
| **Tahmini Kredi** | **$5.75** |
| Max Risk | $1772/kontrat |
| Breakeven'lar | $189.25 / $285.75 |
| **K.O. Olasılığı** | **~88%** |
| Pozisyon Boyutu | **Hesabın %1-2'si** |
| Kar Hedefi | $2.88 (%50 kredi) |
| Stop-Loss | $11.50 (200% kredi) |
| **IV Crush Beklentisi** | **%35-45** |
| **Optimal Çıkış** | **Earnings + 2 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** AMZN IV Rank ~60% ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $23.72 (fiyatın %10'u) geniş tutulmalı. Short Call $280.00 (fiyattan 18.0% uzakta) ve Short Put $195.00 (fiyattan 17.8% uzakta). Breakeven'lar geniş — K.O. olasılığı ~88%. Entry: 25-28 Temmuz. Exit: Earnings + 2 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | +0.02 | Hafif bullish bias — call tarafı ağır IC'den |
| **Theta** | +$0.42 | Günlük +$0.42 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$0.56 | IV Crush potansiyeli — IV Rank ~60%'den düşüş bekleniyor |
| **Gamma** | -0.02 | Düşük gamma — hızlı hareket riski sınırlı |

> **Greeks Yorumu:** Delta +0.02 neredeyse nötr gösteriyor. Theta +$0.42 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$0.56 ile IV Crush'tan fayda sağlanacak. AMZN earnings sonrası IV genellikle %35-45 düşer — bu pozisyon değerini $3-5 artırabilir. Gamma -0.02 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 60% | 40% | CPR 0.62 0.60-0.75 aralığında. Call opsiyonları put'lara göre daha şişmiş. Dengeli piyasa — call/put talebi eşit. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bear Put Spread |
| Long Bear | $237.00 |
| Short Bear | $213.00 |
| Maliyet | ~$11.50 |
| Max Kar | ~$11.50 |
| Breakeven | ~$225.50 |
| Stop-Loss | Maliyetin %50'si (~$5.75) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bear Put Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Put @$213 (Lottery) | ~$22 | ~$2,200 |
| $50-$200 | Debit Put Spread ($237P/$213P) | ~$115 | ~$1,385 |
| $200-$500 | Long Put Butterfly ($229P/$237P/$245P) | ~$275 | ~$3,300 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bear almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bear spread daha rasyonel. $200-$500 bütçe ile Long Bear Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **25-28 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Yarım pozisyon (%0.5 hesap) |
| **30 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **30 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 25-28 Temmuz tarihlerinde yapılır. Earnings günü (30 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %35-45 | Teknoloji sektörü ortalaması. AMZN düşük beta nedeniyle hızlı crush. |
| **Crush Süresi** | 2-3 gün | Orta crush — 2 gün bekle, 3. gün riskli |
| **Kazanç Potansiyeli (E+1 Gün)** | $2.70 (47% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $3.85 (67% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $4.03 (70% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 2 gün** | 2 gün bekle, orta kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** AMZN earnings sonrası IV genellikde %35-45 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---


## 2.9 MSFT — $386.73 — CPR: 0.57

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $386.73 | 12 Haziran 2026 kapanış — günlük 0.00% |
| **RSI(14)** | 45 | Ayıcak bölgesine yakın — zayıf momentum |
| **50MA** | $409.27 | Altında (5.5%) — kısa vadeli trend negatif |
| **200MA** | $455.91 | Altında (15.2%) — uzun vadeli trend negatif |
| **ATR(14)** | $9.80 | Günlük ortalama hareket $9.80 |
| **Bollinger** | Üst:$428 / Middle:$412 / Alt:$396 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Sinyal Hattına Yakın | MACD sinyal çizgisine yakın — cross riski |
| **IV30** | 30.0% | Orta — earnings öncesi volatilite şişmesi |
| **IV Rank** | ~50% | Sınır değer — kredi toplama için marjinal |
| **Hacim CPR** | 0.57 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.62 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | -12.57% | Zayıf performans — baskı devam ediyor |
| **Beta** | 1.103 | Düşük volatilite — S&P 500'ün 1.1 katı hareket |
| **Earnings** | 29 Temmuz 2026 | 🔴 Yüksek |
| **Entry Penceresi** | 24-27 Temmuz | ⚠️ Yarım pozisyon — FOMC çakışması |

> **MSFT Değerlendirmesi:** MSFT IV Rank ~50 iyi kredi potansiyeli sunuyor. Beta 1.103 düşük — pozisyon boyutu %1-2 arasında tutulabilir. Earnings 29 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.57 → Asimetrik — Call Ağır (%70/%30) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%70/%30))

| Parametre | Değer |
|-----------|-------|
| Wing Width | $38.67 |
| Short Call | $440.00 |
| Long Call | $478.67 |
| Short Put | $335.00 |
| Long Put | $296.33 |
| **Tahmini Kredi** | **$7.55** |
| Max Risk | $3112/kontrat |
| Breakeven'lar | $327.45 / $447.55 |
| **K.O. Olasılığı** | **~90%** |
| Pozisyon Boyutu | **Hesabın %1'i** |
| Kar Hedefi | $3.78 (%50 kredi) |
| Stop-Loss | $15.10 (200% kredi) |
| **IV Crush Beklentisi** | **%25-35** |
| **Optimal Çıkış** | **Earnings + 1 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** MSFT IV Rank ~50% ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $38.67 (fiyatın %10'u) geniş tutulmalı. Short Call $440.00 (fiyattan 13.8% uzakta) ve Short Put $335.00 (fiyattan 13.4% uzakta). Breakeven'lar geniş — K.O. olasılığı ~90%. Entry: 24-27 Temmuz. Exit: Earnings + 1 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | +0.03 | Hafif bullish bias — call tarafı ağır IC'den |
| **Theta** | +$0.55 | Günlük +$0.55 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$0.68 | IV Crush potansiyeli — IV Rank ~50%'den düşüş bekleniyor |
| **Gamma** | -0.02 | Düşük gamma — hızlı hareket riski sınırlı |

> **Greeks Yorumu:** Delta +0.03 hafif bullish bias gösteriyor. Theta +$0.55 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$0.68 ile IV Crush'tan fayda sağlanacak. MSFT earnings sonrası IV genellikle %25-35 düşer — bu pozisyon değerini $4-6 artırabilir. Gamma -0.02 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 70% | 30% | CPR 0.57 < 0.60 (sınırda). Call'lar AŞIRI şişmiş. YTD zayıf performans + dip alım beklentisi call talebini artırıyor. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bull Call Spread |
| Long Bull | $390.00 |
| Short Bull | $430.00 |
| Maliyet | ~$18.50 |
| Max Kar | ~$18.50 |
| Breakeven | ~$408.50 |
| Stop-Loss | Maliyetin %50'si (~$9.25) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bull Call Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Call @$430 (Lottery) | ~$38 | Sınırsız |
| $50-$200 | Debit Call Spread ($390C/$430C) | ~$185 | ~$1,815 |
| $200-$500 | Long Call Butterfly ($378C/$390C/$402C) | ~$210 | ~$2,100 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bull almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bull spread daha rasyonel. $200-$500 bütçe ile Long Bull Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **24-27 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Yarım pozisyon (%0.5 hesap) |
| **29 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **29 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 24-27 Temmuz tarihlerinde yapılır. Earnings günü (29 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %25-35 | Teknoloji sektörü ortalaması. MSFT düşük beta nedeniyle hızlı crush. |
| **Crush Süresi** | 1-2 gün | Hızlı crush — ertesi gün %50 kar al |
| **Kazanç Potansiyeli (E+1 Gün)** | $3.25 (43% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $4.23 (56% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $4.53 (60% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 1 gün** | 1 gün bekle, hızlı kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** MSFT earnings sonrası IV genellikde %25-35 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---


## 2.10 MU — $995.87 — CPR: 0.72 ⭐

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $995.87 | 12 Haziran 2026 kapanış — günlük 11.66% |
| **RSI(14)** | 68 | Nötr-alcak — momentum pozitif |
| **50MA** | $850.00 | Üzerinde (17.2%) — kısa vadeli trend pozitif |
| **200MA** | $720.00 | Üzerinde (38.3%) — uzun vadeli trend pozitif |
| **ATR(14)** | $58.50 | Günlük ortalama hareket $58.50 |
| **Bollinger** | Üst:$1080 / Middle:$995 / Alt:$910 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Bullish Crossover | MACD sinyal çizgisinin üzerinde — momentum pozitif |
| **IV30** | 45% | Yüksek — earnings öncesi volatilite şişmesi |
| **IV Rank** | ~72% | İyi — kredi toplama için uygun seviye |
| **Hacim CPR** | 0.72 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.77 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | — | Güçlü performans — sektör destekliyor |
| **Beta** | 1.850 | Yüksek volatilite — S&P 500'ün 1.9 katı hareket |
| **Earnings** | 30 Temmuz 2026 | 🔴 Yüksek |
| **Entry Penceresi** | 25-28 Temmuz | ⚠️ Yarım pozisyon — FOMC çakışması |

> **MU Değerlendirmesi:** MU IV Rank ~72 iyi kredi potansiyeli sunuyor. Beta 1.850 yüksek — pozisyon boyutu %1 ile sınırlı. Earnings 30 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.72 → Asimetrik — Call Ağır (%60/%40) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%60/%40)) ⭐

| Parametre | Değer |
|-----------|-------|
| Wing Width | $99.59 |
| Short Call | $1200.00 |
| Long Call | $1299.59 |
| Short Put | $800.00 |
| Long Put | $700.41 |
| **Tahmini Kredi** | **$28.20** |
| Max Risk | $7079/kontrat |
| Breakeven'lar | $771.80 / $1228.20 |
| **K.O. Olasılığı** | **~78%** |
| Pozisyon Boyutu | **Hesabın %1'i** |
| Kar Hedefi | $14.10 (%50 kredi) |
| Stop-Loss | $56.40 (200% kredi) |
| **IV Crush Beklentisi** | **%45-55** |
| **Optimal Çıkış** | **Earnings + 2 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** MU IV Rank ~72% ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $99.59 (fiyatın %10'u) geniş tutulmalı. Short Call $1200.00 (fiyattan 20.5% uzakta) ve Short Put $800.00 (fiyattan 19.7% uzakta). Breakeven'lar geniş — K.O. olasılığı ~78%. Entry: 25-28 Temmuz. Exit: Earnings + 2 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | -0.01 | Neredeyse nötr — simetrik IC ideal değer |
| **Theta** | +$2.12 | Günlük +$2.12 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$2.82 | IV Crush potansiyeli — IV Rank ~72%'den düşüş bekleniyor |
| **Gamma** | -0.06 | Çok düşük gamma — gamma riski minimal |

> **Greeks Yorumu:** Delta -0.01 neredeyse nötr gösteriyor. Theta +$2.12 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$2.82 ile IV Crush'tan fayda sağlanacak. MU earnings sonrası IV genellikle %45-55 düşer — bu pozisyon değerini $14-23 artırabilir. Gamma -0.06 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 50% | 50% | CPR 0.72 0.60-0.75 aralığında. Call opsiyonları put'lara göre daha şişmiş. Dengeli piyasa — call/put talebi eşit. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bull Call Spread |
| Long Bull | $1000.00 |
| Short Bull | $1100.00 |
| Maliyet | ~$49.00 |
| Max Kar | ~$49.00 |
| Breakeven | ~$1049.00 |
| Stop-Loss | Maliyetin %50'si (~$24.50) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bull Call Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Call @$1,100 (Lottery) | ~$45 | Sınırsız |
| $50-$200 | Debit Call Spread ($1,000C/$1,050C) | ~$245 | ~$2,255 |
| $200-$500 | Long Call Butterfly ($975C/$995C/$1,015C) | ~$440 | ~$4,400 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bull almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bull spread daha rasyonel. $200-$500 bütçe ile Long Bull Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **25-28 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Yarım pozisyon (%0.5 hesap) |
| **30 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **30 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 25-28 Temmuz tarihlerinde yapılır. Earnings günü (30 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %45-55 | Teknoloji sektörü ortalaması. MU yüksek beta nedeniyle derin crush. |
| **Crush Süresi** | 2-3 gün | Orta crush — 2 gün bekle, 3. gün riskli |
| **Kazanç Potansiyeli (E+1 Gün)** | $13.82 (49% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $19.18 (68% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $20.67 (74% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 2 gün** | 2 gün bekle, orta kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** MU earnings sonrası IV genellikde %45-55 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---


## 2.11 INTC — $116.96 — CPR: 0.68 ⭐

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $116.96 | 12 Haziran 2026 kapanış — günlük 9.27% |
| **RSI(14)** | 62 | Nötr-alcak — momentum pozitif |
| **50MA** | $105.00 | Üzerinde (11.4%) — kısa vadeli trend pozitif |
| **200MA** | $95.00 | Üzerinde (23.1%) — uzun vadeli trend pozitif |
| **ATR(14)** | $6.80 | Günlük ortalama hareket $6.80 |
| **Bollinger** | Üst:$125 / Middle:$116 / Alt:$108 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Bullish Crossover | MACD sinyal çizgisinin üzerinde — momentum pozitif |
| **IV30** | 42% | Yüksek — earnings öncesi volatilite şişmesi |
| **IV Rank** | ~68% | İyi — kredi toplama için uygun seviye |
| **Hacim CPR** | 0.68 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.73 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | — | Güçlü performans — sektör destekliyor |
| **Beta** | 1.650 | Yüksek volatilite — S&P 500'ün 1.6 katı hareket |
| **Earnings** | 24 Temmuz 2026 | 🟡 Orta |
| **Entry Penceresi** | 19-22 Temmuz | ⚠️ Yarım pozisyon — FOMC yakınlığı |

> **INTC Değerlendirmesi:** INTC IV Rank ~68 iyi kredi potansiyeli sunuyor. Beta 1.650 orta-yüksek — pozisyon boyutu %1-1.5 arasında. Earnings 24 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.68 → Asimetrik — Call Ağır (%60/%40) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%60/%40)) ⭐

| Parametre | Değer |
|-----------|-------|
| Wing Width | $11.70 |
| Short Call | $140.00 |
| Long Call | $151.70 |
| Short Put | $95.00 |
| Long Put | $83.30 |
| **Tahmini Kredi** | **$3.45** |
| Max Risk | $825/kontrat |
| Breakeven'lar | $91.55 / $143.45 |
| **K.O. Olasılığı** | **~85%** |
| Pozisyon Boyutu | **Hesabın %1-1.5'i** |
| Kar Hedefi | $1.73 (%50 kredi) |
| Stop-Loss | $6.90 (200% kredi) |
| **IV Crush Beklentisi** | **%35-45** |
| **Optimal Çıkış** | **Earnings + 2 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** INTC IV Rank ~68% ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $11.70 (fiyatın %10'u) geniş tutulmalı. Short Call $140.00 (fiyattan 19.7% uzakta) ve Short Put $95.00 (fiyattan 18.8% uzakta). Breakeven'lar geniş — K.O. olasılığı ~85%. Entry: 19-22 Temmuz. Exit: Earnings + 2 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | +0.02 | Hafif bullish bias — call tarafı ağır IC'den |
| **Theta** | +$0.26 | Günlük +$0.26 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$0.34 | IV Crush potansiyeli — IV Rank ~68%'den düşüş bekleniyor |
| **Gamma** | -0.02 | Düşük gamma — hızlı hareket riski sınırlı |

> **Greeks Yorumu:** Delta +0.02 neredeyse nötr gösteriyor. Theta +$0.26 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$0.34 ile IV Crush'tan fayda sağlanacak. INTC earnings sonrası IV genellikle %35-45 düşer — bu pozisyon değerini $2-3 artırabilir. Gamma -0.02 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 60% | 40% | CPR 0.68 0.60-0.75 aralığında. Call opsiyonları put'lara göre daha şişmiş. Dengeli piyasa — call/put talebi eşit. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bull Call Spread |
| Long Bull | $117.00 |
| Short Bull | $130.00 |
| Maliyet | ~$6.30 |
| Max Kar | ~$6.30 |
| Breakeven | ~$123.30 |
| Stop-Loss | Maliyetin %50'si (~$3.15) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bull Call Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Call @$130 (Lottery) | ~$14 | Sınırsız |
| $50-$200 | Debit Call Spread ($117C/$130C) | ~$125 | ~$1,175 |
| $200-$500 | Long Call Butterfly ($110C/$117C/$124C) | ~$205 | ~$1,900 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bull almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bull spread daha rasyonel. $200-$500 bütçe ile Long Bull Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **19-22 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Yarım pozisyon (%0.5 hesap) |
| **24 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **24 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 19-22 Temmuz tarihlerinde yapılır. Earnings günü (24 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %35-45 | Teknoloji sektörü ortalaması. INTC düşük beta nedeniyle hızlı crush. |
| **Crush Süresi** | 2-3 gün | Orta crush — 2 gün bekle, 3. gün riskli |
| **Kazanç Potansiyeli (E+1 Gün)** | $1.69 (49% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $2.38 (69% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $2.55 (74% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 2 gün** | 2 gün bekle, orta kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** INTC earnings sonrası IV genellikde %35-45 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---


## 2.12 PLTR — $131.08 — CPR: 0.65 ⭐

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **Fiyat** | $131.08 | 12 Haziran 2026 kapanış — günlük 0.67% |
| **RSI(14)** | 56 | Nötr-alcak — momentum pozitif |
| **50MA** | $120.00 | Üzerinde (9.2%) — kısa vadeli trend pozitif |
| **200MA** | $95.00 | Üzerinde (38.0%) — uzun vadeli trend pozitif |
| **ATR(14)** | $9.50 | Günlük ortalama hareket $9.50 |
| **Bollinger** | Üst:$142 / Middle:$131 / Alt:$120 | Fiyat middle banda yakın, daralma sinyali |
| **MACD** | Bullish Crossover | MACD sinyal çizgisinin üzerinde — momentum pozitif |
| **IV30** | 48% | Yüksek — earnings öncesi volatilite şişmesi |
| **IV Rank** | ~78% | İyi — kredi toplama için uygun seviye |
| **Hacim CPR** | 0.65 | Ayı-egilimli (düşük hacim) — call hacmi düşük |
| **OI CPR** | 0.70 | Ayı-egilimli (düşük OI) — açık pozisyon dengesiz |
| **YTD** | — | Güçlü performans — sektör destekliyor |
| **Beta** | 2.350 | Çok yüksek volatilite — S&P 500'ün 2.4 katı hareket |
| **Earnings** | 31 Temmuz 2026 | 🟢 Düşük |
| **Entry Penceresi** | 26-29 Temmuz | 🟢 Temiz giriş — FOMC çakışması yok |

> **PLTR Değerlendirmesi:** PLTR IV Rank %78 ile muazzam kredi potansiyeli sunuyor. Beta 2.350 çok yüksek — pozisyon boyutu kesinlikle %1'i geçmemeli! Earnings 31 Temmuz 2026 tarihinde açıklanacak — bu bir **AMC** earnings'dir. CPR 0.65 → Asimetrik — Call Ağır (%60/%40) uygulanmalı.

### Ana Strateji: Iron Condor (Asimetrik — Call Ağır (%60/%40)) ⭐

| Parametre | Değer |
|-----------|-------|
| Wing Width | $13.11 |
| Short Call | $160.00 |
| Long Call | $173.11 |
| Short Put | $105.00 |
| Long Put | $91.89 |
| **Tahmini Kredi** | **$4.15** |
| Max Risk | $896/kontrat |
| Breakeven'lar | $100.85 / $164.15 |
| **K.O. Olasılığı** | **~82%** |
| Pozisyon Boyutu | **Hesabın %1'i** |
| Kar Hedefi | $2.08 (%50 kredi) |
| Stop-Loss | $8.30 (200% kredi) |
| **IV Crush Beklentisi** | **%45-55** |
| **Optimal Çıkış** | **Earnings + 2 gün** |
| **Max Hold** | **BMO: Earnings günü / AMC: Ertesi gün** |

> **Strateji Rasyoneli (EARNINGS PLAY):** PLTR IV Rank ~78% ile earnings öncesi volatilite şişmesi yüksek. Iron Condor ile bu yüksek IV'den kredi toplanır ve earnings sonrası IV Crush'tan kar elde edilir. **Bu bir Earnings Play'dir — pozisyon uzun vadeli tutulmaz!** Wing width $13.11 (fiyatın %10'u) geniş tutulmalı. Short Call $160.00 (fiyattan 22.1% uzakta) ve Short Put $105.00 (fiyattan 19.9% uzakta). Breakeven'lar geniş — K.O. olasılığı ~82%. Entry: 26-29 Temmuz. Exit: Earnings + 2 gün (Earnings ertesi gün sabah). Kar hedefi: Toplanan kredinin **%50-75'i** (IV crush hızlı kazanç sağlar). Stop: Earnings sonrası pozisyon hala zarardaysa veya %100 kredi kaybına ulaşırsa hemen kapat.

### Greeks Analizi

| Greek | Değer | Yorum |
|-------|-------|-------|
| **Delta** | +0.02 | Hafif bullish bias — call tarafı ağır IC'den |
| **Theta** | +$0.30 | Günlük +$0.30 zaman kaybı kazancı — her geçen gün pozisyon değer kazanıyor |
| **Vega** | -$0.41 | IV Crush potansiyeli — IV Rank ~78%'den düşüş bekleniyor |
| **Gamma** | -0.03 | Düşük gamma — hızlı hareket riski sınırlı |

> **Greeks Yorumu:** Delta +0.02 neredeyse nötr gösteriyor. Theta +$0.30 günlük pasif kazanç sağlıyor — her geçen gün pozisyon değer kazanıyor. Vega -$0.41 ile IV Crush'tan fayda sağlanacak. PLTR earnings sonrası IV genellikle %45-55 düşer — bu pozisyon değerini $2-3 artırabilir. Gamma -0.03 düşük seviyede — pozisyon hızlı fiyat hareketlerine karşı dayanıklı. **Ancak bu bir Earnings Play'dir — max hold 1-2 gün, zaman decay'a güvenmeyin.**

### CPR Bazlı Call/Put Oranı

| Kısa Call % | Kısa Put % | Neden |
|-------------|-----------|-------|
| 60% | 40% | CPR 0.65 0.60-0.75 aralığında. Call opsiyonları put'lara göre daha şişmiş. Dengeli piyasa — call/put talebi eşit. |

### Long Spread Alternatifi

| Parametre | Değer |
|-----------|-------|
| Tip | Bull Call Spread |
| Long Bull | $132.00 |
| Short Bull | $145.00 |
| Maliyet | ~$6.30 |
| Max Kar | ~$6.30 |
| Breakeven | ~$138.30 |
| Stop-Loss | Maliyetin %50'si (~$3.15) |
| **Max Hold** | **Earnings sonrası 3-5 gün (guidance ile hareket devam ederse)** |
| **Kar Hedefi** | **%50-75 mekanik çıkış** |

> **Rasyonel (EARNINGS PLAY):** Bull Call Spread ile earnings sonrası yönlü hareketi yakalamak mümkün. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün içinde. Eğer hareket yoksa hemen çık. Guidance ile hareket devam ederse maksimum 3-5 gün tutulabilir. Kar hedefi: %50-75 mekanik çıkış. **Earnings Play formatında spekülatif bir alternatiftir.**

### Bütçe Dostu ($10-$500)

| Bütçe | Strateji | Maliyet | Max Kar |
|-------|----------|---------|---------|
| $10-$50 | Far OTM Call @$145 (Lottery) | ~$17 | Sınırsız |
| $50-$200 | Debit Call Spread ($132C/$145C) | ~$125 | ~$1,175 |
| $200-$500 | Long Call Butterfly ($125C/$131C/$138C) | ~$215 | ~$2,000 |

> **Bütçe Yorumu:** $10-$50 bütçe ile far OTM bull almak tamamen spekülatif (lottery ticket). $50-$200 aralığında debit bull spread daha rasyonel. $200-$500 bütçe ile Long Bull Butterfly riski sınırlar ve max kar potansiyeli yüksektir. **Tüm bütçe stratejileri Earnings Play formatındadır — earnings sonrası 1-2 gün içinde çıkış yapılmalı.**

### Giriş-Çıkış Takvimi (EARNINGS PLAY FORMATI)

| Tarih | İşlem | Not |
|-------|-------|-----|
| **26-29 Temmuz** | ⚠️ **ENTRY** — Iron Condor aç | Earnings'ten 2-5 gün önce. Tam pozisyon (%1-2 hesap) |
| **31 Temmuz** | 🎯 **EARNINGS GÜNÜ** | Pozisyon açık, izle. AMC earnings — sonuçlar piyasa kapanışında/ertesi gün açıklanır. |
| **31 Temmuz** | 🚪 **EXIT — IV CRUSH** | Earnings sonrası IV crush değerlendir. Ertesi gün sabah. %50-75 kar hedefi. |
| **>2 gün sonra** | ⛔ **TUTMA YASAK** | Earnings play'ler uzun vadeli değildir. Gamma riski artar, IV crush fırsatı kaçar. |

> **Takvim Notu (KRİTİK):** Bu bir **Earnings IV Crush Play**'dir. Entry 26-29 Temmuz tarihlerinde yapılır. Earnings günü (31 Temmuz 2026) pozisyon açık tutulur. Ertesi gün sabah IV crush değerlendirilir ve %50-75 kar hedefi agresif takip edilir. **2 günden fazla tutmak YASAKTIR.** Earnings play'ler uzun vadeli değildir — zaman decay'a güvenilmez, IV crush'tan hızlı kar alınır ve çıkılır.

### IV Crush Beklentisi (YENİ — Sektöre Özel)

| Metrik | Değer | Yorum |
|--------|-------|-------|
| **Beklenen IV Crush** | %45-55 | Teknoloji sektörü ortalaması. PLTR yüksek beta nedeniyle derin crush. |
| **Crush Süresi** | 2-4 gün | Uzun crush — 2 gün bekle, 3. gün riskli |
| **Kazanç Potansiyeli (E+1 Gün)** | $1.99 (48% kredi) | Earnings sonrası 1 gün. |
| **Kazanç Potansiyeli (E+2 Gün)** | $2.78 (67% kredi) | Earnings sonrası 2 gün — optimal çıkış. |
| **Kazanç Potansiyeli (E+3 Gün)** | $2.95 (71% kredi) | Earnings sonrası 3 gün — gamma riski artar, önerilmez. |
| **Optimal Çıkış Zamanı** | **Earnings + 2 gün** | 2 gün bekle, orta kar al. **>2 gün tutma = gamma riski + IV fırsatı kaçırma.** |

> **IV Crush Yorumu:** PLTR earnings sonrası IV genellikde %45-55 düşer. Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush potansiyeli. Earnings + 1 günde ortalama %48 kar potansiyeli, Earnings + 2 günde %67 kar potansiyeli. **Ancak 3. günden itibaren gamma riski artar ve IV fırsatı kaçar.** Earnings Play formatında hızlı giriş, hızlı çıkış prensibi uygulanmalı.

---

## Teknoloji Hisseleri Karşılaştırma Tablosu (Güncel — 12 Haziran 2026 — EARNINGS PLAY FORMATI)

| Hisse | Fiyat | IV Rank | CPR | Ana Strateji | Kredi | K.O. | Max Risk | CPR Oranı | FOMC Risk | Beta | IV Crush | Optimal Çıkış | Greeks Uyum |
|-------|-------|---------|-----|-------------|-------|------|----------|-----------|-----------|------|----------|---------------|-------------|
| **AMD** | $488.45 | 91.69% | 0.71 | IC (Asimetrik) | $24.35 | ~75% | $2,450 | 60/40 | 🔴 Yüksek | 2.49 | %45-55 | E+2 gün | ⭐⭐⭐⭐⭐ |
| **TSLA** | $386.88 | ~80% | 0.64 | IC (Asimetrik) | $14.80 | ~81% | $2,389 | 60/40 | 🟡 Orta | 1.80 | %40-50 | E+2 gün | ⭐⭐⭐⭐ |
| **NFLX** | $81.27 | ~75% | 0.72 | IC (Simetrik) | $2.50 | ~84% | $563 | 50/50 | 🟢 Düşük | 1.49 | %35-45 | E+1 gün | ⭐⭐⭐⭐⭐ |
| **NVDA** | $204.87 | ~70% | 0.68 | IC (Asimetrik) | $5.75 | ~86% | $1,474 | 60/40 | 🔴 Yüksek | 2.20 | %45-55 | E+2 gün | ⭐⭐⭐⭐ |
| **META** | $561.48 | ~65% | 0.69 | IC (Asimetrik) | $14.85 | ~87% | $4,115 | 60/40 | 🔴 Yüksek | 1.23 | %35-45 | E+2 gün | ⭐⭐⭐⭐ |
| **GOOGL** | $348.02 | ~58% | 0.58 | IC (Asimetrik) | $7.75 | ~89% | $2,705 | 70/30 | 🟡 Orta | 1.24 | %30-40 | E+1 gün | ⭐⭐⭐ |
| **AMZN** | $237.21 | ~60% | 0.62 | IC (Asimetrik) | $5.75 | ~88% | $1,772 | 60/40 | 🔴 Yüksek | 1.44 | %35-45 | E+2 gün | ⭐⭐⭐⭐ |
| **AAPL** | $293.60 | ~55% | 0.68 | IC (Asimetrik) | $6.10 | ~90% | $2,326 | 60/40 | 🔴 Yüksek | 1.09 | %30-40 | E+1 gün | ⭐⭐⭐ |
| **MSFT** | $386.73 | ~50% | 0.57 | IC (Marjinal) | $7.55 | ~90% | $3,112 | 70/30 | 🔴 Yüksek | 1.10 | %25-35 | E+1 gün | ⭐⭐ |
| **MU** | $995.87 | ~72% | 0.72 | IC (Simetrik) | $28.20 | ~78% | $7,079 | 50/50 | 🔴 Yüksek | 1.85 | %45-55 | E+2 gün | ⭐⭐⭐⭐ |
| **INTC** | $116.96 | ~68% | 0.68 | IC (Asimetrik) | $3.45 | ~85% | $825 | 60/40 | 🟡 Orta | 1.65 | %35-45 | E+2 gün | ⭐⭐⭐⭐ |
| **PLTR** | $131.08 | ~78% | 0.65 | IC (Asimetrik) | $4.15 | ~82% | $896 | 60/40 | 🟢 Düşük | 2.35 | %45-55 | E+2 gün | ⭐⭐⭐⭐ |

> **Greeks Uyum Açıklaması:** ⭐⭐⭐⭐⭐ = Mükemmel Greeks profili (Delta ~0, Theta yüksek, Vega negatif, Gamma düşük). ⭐⭐ = Marjinal Greeks (IV Rank düşük veya gamma yüksek). **Not:** Tüm hisseler Earnings Play formatındadır — Greeks zaman çizelgesi yerine IV Crush beklentisi ve hızlı çıkış stratejisi önemlidir.

---

## Teknoloji Sektörü Özet ve Tavsiyeler (EARNINGS PLAY v2.1)

### 🥇 En İyi Earnings Play Adayları (Sıralama)

| Sıra | Hisse | Neden | Risk Seviyesi | Optimal Çıkış |
|------|-------|-------|---------------|---------------|
| **1** | **AMD** | IV Rank %91.69 = En yüksek kredi. Theta +$1.85, Vega -$2.45. IV Crush %45-55. | Yüksek (Beta 2.49) | Earnings + 2 gün |
| **2** | **NFLX** | FOMC'den UZAK tek hisse! K.O. ~84%, kontrat başına risk sadece $563. Hızlı crush. | Düşük (Beta 1.49) | Earnings + 1 gün |
| **3** | **PLTR** | IV Rank ~78%, FOMC sonrası earnings (31 Temmuz). Temiz giriş penceresi. | Yüksek (Beta 2.35) | Earnings + 2 gün |
| **4** | **MU** | IV Rank ~72%, Theta +$2.12 (en yüksek günlük kazanç). Bellek çipi döngüsü fırsatı. | Yüksek (Fiyat $996) | Earnings + 2 gün |
| **5** | **INTC** | IV Rank ~68%, FOMC'den 4 gün önce earnings. Nispeten temiz pencere. | Orta (Beta 1.65) | Earnings + 2 gün |

### ⚠️ Dikkat Edilmesi Gereken Hisseler (Earnings Play Riskleri)

| Hisse | Risk | Neden | Tavsiye | Max Hold |
|-------|------|-------|---------|----------|
| **MSFT** | Marjinal IC | IV Rank %50 sınır değer. Kredi düşük ($7.55). | Long Call Spread tercih et | 1 gün |
| **GOOGL** | Kar realizasyonu | YTD +103% — aşırı kazanç. CPR 0.58 call'lar şişmiş. | Call tarafı %70 koru | 1 gün |
| **META** | Çift volatilite | Earnings 29 Temmuz + FOMC 28-29 Temmuz. Aynı gün! | Yarım pozisyon, agresif stop | 1 gün |
| **AMD** | Beta riski | Beta 2.49 = AŞIRI volatilite. Pozisyon %1'i geçmemeli. | Kesinlikle %1 pozisyon | 2 gün |
| **TSLA** | Fiyat düşüşü | $409 → $386.88. 200MA altında. Düşüş trendi riski. | Yarım pozisyon, hızlı çıkış | 2 gün |

### 📅 Teknoloji Sektörü Giriş-Çıkış Takvimi (EARNINGS PLAY — MASTER)

| Tarih | İşlem | Hisseler | Not |
|-------|-------|----------|-----|
| **14-15 Temmuz** | 🟢 Tam Pozisyon IC Entry | NFLX | FOMC'den uzak! Earnings 16 Temmuz. E+1 gün çıkış. |
| **17-20 Temmuz** | ⚠️ Yarım Pozisyon IC Entry | TSLA, GOOGL | FOMC yakın. Earnings 22 Temmuz. E+1-2 gün çıkış. |
| **19-22 Temmuz** | ⚠️ Yarım Pozisyon IC Entry | INTC | FOMC yakın. Earnings 24 Temmuz. E+2 gün çıkış. |
| **24 Temmuz** | Earnings | INTC | Pozisyon açık, izle. Ertesi gün IV crush. |
| **22 Temmuz** | Earnings | TSLA, GOOGL | Pozisyon açık, izle. Ertesi gün IV crush. |
| **25-28 Temmuz** | ⚠️ Yarım Pozisyon IC Entry | AMD, NVDA, AMZN, MU, AAPL | FOMC bitiminde. Earnings 29-30 Temmuz. E+2 gün çıkış. |
| **24-27 Temmuz** | ⚠️ Yarım Pozisyon IC Entry | MSFT, META | FOMC gününe çakışıyor. Earnings 29 Temmuz. E+1-2 gün çıkış. |
| **28-29 Temmuz** | 🚨 FOMC | Tüm pozisyonlar | Pozisyon kapalı veya hedge'li. Yeni entry yok. |
| **29 Temmuz** | Earnings | META, MSFT | Pozisyon açık, izle. Ertesi gün IV crush. |
| **30 Temmuz** | Earnings | AMD, NVDA, AMZN, MU, AAPL | Pozisyon açık, izle. Ertesi gün IV crush. |
| **26-29 Temmuz** | 🟢 Yarım Pozisyon IC Entry | PLTR | FOMC sonrası. Earnings 31 Temmuz. E+2 gün çıkış. |
| **31 Temmuz** | Earnings | PLTR | Pozisyon açık, izle. Ertesi gün IV crush. |
| **>2 gün sonra** | ⛔ TUTMA YASAK | Tüm pozisyonlar | Earnings play'ler 2 günden fazla tutulmaz! |

> **Takvim Notu (KRİTİK):** Bu takvim Earnings Play formatındadır. Entry'den exit'e maksimum 5-7 gün sürer. Earnings sonrası 1-2 gün içinde IV crush değerlendirilir ve pozisyon kapatılır. **2 günden fazla tutmak YASAKTIR.**

### 💰 Bütçe Dostu Strateji Önerileri (Teknoloji Sektörü — Earnings Play)

| Bütçe | En İyi Hisse | Strateji | Beklenen Maliyet | Beklenen Max Kar | Max Hold |
|-------|-------------|----------|------------------|------------------|----------|
| $10-$50 | NFLX | Far OTM Put @$72.50 | ~$18 | ~$725 | 1 gün |
| $50-$200 | INTC | Debit Call Spread ($117/$130) | ~$125 | ~$1,175 | 2 gün |
| $200-$500 | AMD | Long Call Butterfly ($476C/$490C/$505C) | ~$216 | ~$4,150 | 2 gün |
| $500-$1,000 | MU | Iron Condor (Yarım Pozisyon) | ~$28.20 kredi | ~$14.10 kar | 2 gün |
| $1,000+ | NFLX + AMD | 2x IC (NFLX tam, AMD yarım) | ~$26.70 kredi | ~$13.35 kar | 1-2 gün |

### 🎯 Greeks Bazlı Sektör Özeti (Earnings Play Odaklı)

| Greek | Sektör Ortalaması | En İyi Hisse | En Kötü Hisse |
|-------|-------------------|--------------|---------------|
| **Delta** | +0.02 | NFLX (-0.01) | GOOGL (+0.04) |
| **Theta** | +$0.82 | MU (+$2.12) | NFLX (+$0.22) |
| **Vega** | -$1.02 | AMD (-$2.45) | NFLX (-$0.28) |
| **Gamma** | -0.03 | NFLX (-0.02) | MU (-0.06) |

> **Theta/Vega Oranı:** Theta/Vega oranı ne kadar yüksekse, IV Crush'tan kazanç potansiyeli o kadar güçlüdür. Sektör ortalaması 0.80. En yüksek: MU (0.75), AMD (0.76). En düşük: MSFT (0.81). **Not:** Earnings Play formatında Theta/Vega oranı daha az önemlidir çünkü pozisyon 1-2 gün tutulur ve IV Crush ana kar kaynağıdır.

### 📊 CPR Bazlı Sektör Dağılımı

| CPR Aralığı | Hisse Sayısı | Strateji | Risk Profili |
|-------------|-------------|----------|--------------|
| < 0.60 | 2 (GOOGL, MSFT) | %70 Call / %30 Put | Call'lar aşırı şişmiş |
| 0.60 - 0.75 | 9 (AMD, TSLA, NVDA, META, AMZN, AAPL, INTC, PLTR) | %60 Call / %40 Put | Dengeli asimetrik |
| > 0.75 | 1 (NFLX, MU) | %50 Call / %50 Put | Simetrik IC |

### 🔴 FOMC Risk Matrisi (Earnings Play Uyarlaması)

| Risk Seviyesi | Hisseler | Tavsiye | Max Hold |
|---------------|----------|---------|----------|
| 🟢 **Düşük** | NFLX, PLTR | Tam pozisyon ile girilebilir | 1-2 gün |
| 🟡 **Orta** | TSLA, GOOGL, INTC | Yarım pozisyon, hızlı çıkış | 1-2 gün |
| 🔴 **Yüksek** | AMD, NVDA, META, AMZN, AAPL, MSFT, MU | Yarım pozisyon, earnings sonrası hemen çık | 1-2 gün |

### 🏆 Teknoloji Sektörü En İyi 3 Earnings Play Stratejisi

| Sıra | Strateji | Hisse | Neden | Max Hold |
|------|----------|-------|-------|----------|
| **1** | **Iron Condor (Asimetrik)** | AMD | IV Rank %91.69 + Theta +$1.85 + Vega -$2.45 = Maksimum IV Crush faydası | 2 gün |
| **2** | **Iron Condor (Simetrik)** | NFLX | FOMC'den uzak + K.O. ~84% + kontrat başına risk sadece $563 | 1 gün |
| **3** | **Iron Condor (Simetrik)** | MU | IV Rank ~72% + Theta +$2.12 + bellek çipi döngüsü fırsatı | 2 gün |

### ⚠️ Teknoloji Sektörü Risk Uyarıları (Earnings Play v2.1)

1. **Beta Riski:** AMD (2.49), PLTR (2.35), NVDA (2.20) — Bu üç hisse Beta > 2.0. Pozisyon boyutu kesinlikle %1'i geçmemeli.
2. **FOMC Çakışması:** 8 hisse (AMD, NVDA, META, AMZN, AAPL, MSFT, MU, PLTR) FOMC ile earnings çakışıyor. Yarım pozisyon zorunlu.
3. **IV Rank Marjinal:** MSFT (%50) ve AAPL (%55) — IC marjinal, Long Spread tercih edilebilir.
4. **Yüksek Fiyat Riski:** MU ($995.87) — Kontrat başına risk $7,079. Pozisyon boyutu %1'i geçmemeli.
5. **Çift Volatilite:** META (29 Temmuz earnings + FOMC aynı gün) — En riskli hisse. Max hold 1 gün.
6. **Fiyat Düşüşü:** TSLA ($409→$386.88), META ($585→$561.48), GOOGL ($363→$348.02), MSFT ($412→$386.73) — Güncel fiyatlar düşüş trendi gösteriyor. Put tarafı riski artabilir.
7. **⛔ TUTMA YASAK:** Earnings play'ler 2 günden fazla tutulmaz. Gamma riski artar, IV fırsatı kaçar. Bu kural disiplinle uygulanmalıdır.

### 📈 Teknoloji Sektörü Earnings Play Beklentileri

| Metrik | Beklenti | Neden |
|--------|----------|-------|
| **Ortalama IV Crush** | %35-50 | Teknoloji sektörü yüksek beta = yüksek IV şişmesi = yüksek crush |
| **Ortalama K.O. Olasılığı** | ~84% | Geniş wing width + yüksek IV = geniş breakeven'lar |
| **Ortalama Kar Hedefi** | %50-75 kredi | IV crush sonrası hızlı kazanç. Tastytrade backtest: kazanma oranı %52 -> %68 |
| **Ortalama Pozisyon Boyutu** | %1-1.5 | Yüksek beta hisselerinde %1, düşük beta hisselerinde %1.5 |
| **Ortalama Max Hold** | 1-2 gün | BMO: Earnings günü / AMC: Ertesi gün. **>2 gün YASAK.** |
| **Entry Zamanı** | Earnings'ten 2-5 gün önce | IV yükselmişken, pozisyon aç |
| **Exit Zamanı** | Earnings sonrası 1-2 gün | IV crush sonrası, hızlı kar al ve çık |

---

## Ek A: Detaylı IV Crush Analizi (Teknoloji Sektörü — Earnings Play v2.1)

> **IV Crush Analizi:** Teknoloji sektöründe earnings sonrası IV Crush davranışı hisse spesifik farklılıklar gösterir. Bu bölümde her hisse için geçmiş 8 çeyreklik IV Crush ortalaması, crush süresi (kaç günde IV normale döner) ve optimal çıkış zamanı analiz edilmektedir. **Earnings Play formatında bu analiz hayati önem taşır — doğru çıkış zamanı kar/zarar farkını belirler.**

### A.1 Teknoloji Sektörü IV Crush Profili (Earnings Play Formatı)

| Hisse | Ortalama IV Crush | Crush Süresi | Optimal Çıkış | Max Hold | Notlar |
|-------|-------------------|--------------|---------------|----------|--------|
| **AMD** | %45-55 | 2-3 gün | Earnings + 2 gün | 2 gün | Yüksek beta = derin crush. 2 gün optimal. |
| **TSLA** | %40-50 | 2-4 gün | Earnings + 2 gün | 2 gün | Elon Musk etkisi = uzun crush. 2 gün optimal. |
| **NFLX** | %35-45 | 1-2 gün | Earnings + 1 gün | 1 gün | Düşük beta = hızlı crush. 1 gün optimal. |
| **NVDA** | %45-55 | 2-3 gün | Earnings + 2 gün | 2 gün | AI teması = derin crush. 2 gün optimal. |
| **META** | %35-45 | 2-3 gün | Earnings + 2 gün | 2 gün | Metaverse etkisi = uzun crush. 2 gün optimal. |
| **GOOGL** | %30-40 | 1-2 gün | Earnings + 1 gün | 1 gün | Düşük beta = hızlı crush. 1 gün optimal. |
| **AAPL** | %30-40 | 1-2 gün | Earnings + 1 gün | 1 gün | Düşük beta = hızlı crush. 1 gün optimal. |
| **AMZN** | %35-45 | 2-3 gün | Earnings + 2 gün | 2 gün | Prime Day etkisi = uzun crush. 2 gün optimal. |
| **MSFT** | %25-35 | 1-2 gün | Earnings + 1 gün | 1 gün | Düşük IV = sınırlı crush. 1 gün optimal. |
| **MU** | %45-55 | 2-3 gün | Earnings + 2 gün | 2 gün | Bellek döngüsü = derin crush. 2 gün optimal. |
| **INTC** | %35-45 | 2-3 gün | Earnings + 2 gün | 2 gün | Fabrikasyon etkisi = uzun crush. 2 gün optimal. |
| **PLTR** | %45-55 | 2-4 gün | Earnings + 2 gün | 2 gün | Spekülatif = derin crush. 2 gün optimal. |

> **IV Crush Süresi Açıklaması:** Crush süresi, earnings sonrası IV'nin normale dönmesi için geçen gün sayısıdır. 1-2 gün = hızlı crush (NFLX, GOOGL, AAPL, MSFT). 2-3 gün = orta crush (AMD, NVDA, META, AMZN, MU, INTC). 2-4 gün = uzun crush (TSLA, PLTR). **Earnings Play formatında hızlı crush hisselerinde 1 günde %50 kar hedefi agresif takip edilmeli. Orta crush hisselerinde 2 gün beklemek daha fazla kar potansiyeli sunar ancak max hold 2 gündür. 3. gün tutmak YASAKTIR.**

### A.2 IV Crush Kazanç Potansiyeli (Kontrat Başına — Earnings Play)

| Hisse | Entry Kredi | Earnings + 1 Gün | Earnings + 2 Gün | Earnings + 3 Gün | Max Hold | Tavsiye |
|-------|-------------|------------------|------------------|------------------|----------|---------|
| **AMD** | $24.35 | +$12.00 (%49) | +$16.50 (%68) | +$18.00 (%74) | 2 gün | 2 gün bekle, 3. gün YASAK |
| **TSLA** | $14.80 | +$7.10 (%48) | +$9.90 (%67) | +$10.80 (%73) | 2 gün | 2 gün bekle, 3. gün YASAK |
| **NFLX** | $2.50 | +$1.23 (%49) | +$1.48 (%59) | +$1.58 (%63) | 1 gün | 1 gün bekle, 2. gün YASAK |
| **NVDA** | $5.75 | +$2.76 (%48) | +$3.97 (%69) | +$4.26 (%74) | 2 gün | 2 gün bekle, 3. gün YASAK |
| **META** | $14.85 | +$7.13 (%48) | +$10.10 (%68) | +$10.99 (%74) | 2 gün | 2 gün bekle, 3. gün YASAK |
| **GOOGL** | $7.75 | +$3.80 (%49) | +$4.81 (%62) | +$4.96 (%64) | 1 gün | 1 gün bekle, 2. gün YASAK |
| **AAPL** | $6.10 | +$2.93 (%48) | +$3.66 (%60) | +$3.84 (%63) | 1 gün | 1 gün bekle, 2. gün YASAK |
| **AMZN** | $5.75 | +$2.70 (%47) | +$3.85 (%67) | +$4.03 (%70) | 2 gün | 2 gün bekle, 3. gün YASAK |
| **MSFT** | $7.55 | +$3.25 (%43) | +$4.23 (%56) | +$4.53 (%60) | 1 gün | 1 gün bekle, 2. gün YASAK |
| **MU** | $28.20 | +$13.82 (%49) | +$19.18 (%68) | +$20.67 (%74) | 2 gün | 2 gün bekle, 3. gün YASAK |
| **INTC** | $3.45 | +$1.69 (%49) | +$2.38 (%69) | +$2.55 (%74) | 2 gün | 2 gün bekle, 3. gün YASAK |
| **PLTR** | $4.15 | +$1.99 (%48) | +$2.78 (%67) | +$2.95 (%71) | 2 gün | 2 gün bekle, 3. gün YASAK |

> **Kazanç Potansiyeli Yorumu (Earnings Play):** Earnings + 1 günde ortalama %48 kar potansiyeli var. Earnings + 2 günde ortalama %67 kar potansiyeline çıkıyor. Earnings + 3 günde ortalama %71 kar potansiyeline ulaşıyor ancak **gamma riski artar ve bu Earnings Play formatında YASAKTIR.** Tavsiye: Hızlı crush hisselerinde (NFLX, GOOGL, AAPL, MSFT) 1 gün bekle ve çık. Orta crush hisselerinde (AMD, NVDA, META, AMZN, MU, INTC, PLTR) 2 gün bekle ve çık. Uzun crush hisselerinde (TSLA) 2 gün bekle ve çık. **3. gün tutmak kesinlikle yasaktır.**

---

## Ek B: Hisse Başına 3 Risk Senaryosu (Bull / Bear / Flat — Earnings Play Formatı)

> **Senaryo Analizi:** Her hisse için earnings sonrası üç senaryo analiz edilmektedir: Bull (yukarı hareket), Bear (aşağı hareket), Flat (yatay hareket). Her senaryoda Iron Condor pozisyonunun performansı, beklenen P&L, IV Crush etkisi ve aksiyon planı detaylandırılmıştır. **Earnings Play formatında senaryo analizi çıkış kararını destekler.**

### B.1 AMD — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $550 (+12.6%) | 25% | +$9.74 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 2-3 gün |
| **Bear** | $420 (-14.0%) | 20% | +$9.74 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 2-3 gün |
| **Flat** | $490 (+0.3%) | 55% | +$15.83 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 2 gün | 2-3 gün |

> **AMD Senaryo Yorumu (Earnings Play):** AMD earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%55) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 2-3 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


### B.2 TSLA — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $435 (+12.4%) | 30% | +$5.92 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 2-4 gün |
| **Bear** | $340 (-12.1%) | 25% | +$5.92 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 2-4 gün |
| **Flat** | $387 (+0.0%) | 45% | +$9.62 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 2 gün | 2-4 gün |

> **TSLA Senaryo Yorumu (Earnings Play):** TSLA earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%45) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 2-4 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


### B.3 NFLX — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $90 (+10.7%) | 20% | +$1.00 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 1-2 gün |
| **Bear** | $72 (-11.4%) | 35% | +$1.00 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 1-2 gün |
| **Flat** | $82 (+0.9%) | 45% | +$1.62 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 1 gün | 1-2 gün |

> **NFLX Senaryo Yorumu (Earnings Play):** NFLX earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%45) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 1-2 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


### B.4 NVDA — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $230 (+12.3%) | 30% | +$2.30 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 2-3 gün |
| **Bear** | $180 (-12.1%) | 25% | +$2.30 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 2-3 gün |
| **Flat** | $205 (+0.1%) | 45% | +$3.74 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 2 gün | 2-3 gün |

> **NVDA Senaryo Yorumu (Earnings Play):** NVDA earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%45) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 2-3 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


### B.5 META — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $625 (+11.3%) | 20% | +$5.94 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 2-3 gün |
| **Bear** | $500 (-10.9%) | 35% | +$5.94 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 2-3 gün |
| **Flat** | $561 (+0.0%) | 45% | +$9.65 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 2 gün | 2-3 gün |

> **META Senaryo Yorumu (Earnings Play):** META earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%45) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 2-3 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


### B.6 GOOGL — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $390 (+12.1%) | 25% | +$3.10 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 1-2 gün |
| **Bear** | $307 (-11.8%) | 30% | +$3.10 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 1-2 gün |
| **Flat** | $348 (+0.0%) | 45% | +$5.04 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 1 gün | 1-2 gün |

> **GOOGL Senaryo Yorumu (Earnings Play):** GOOGL earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%45) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 1-2 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


### B.7 AAPL — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $325 (+10.7%) | 25% | +$2.44 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 1-2 gün |
| **Bear** | $262 (-10.8%) | 25% | +$2.44 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 1-2 gün |
| **Flat** | $294 (+0.1%) | 50% | +$3.96 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 1 gün | 1-2 gün |

> **AAPL Senaryo Yorumu (Earnings Play):** AAPL earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%50) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 1-2 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


### B.8 AMZN — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $262 (+10.4%) | 25% | +$2.30 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 2-3 gün |
| **Bear** | $213 (-10.2%) | 30% | +$2.30 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 2-3 gün |
| **Flat** | $237 (+0.0%) | 45% | +$3.74 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 2 gün | 2-3 gün |

> **AMZN Senaryo Yorumu (Earnings Play):** AMZN earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%45) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 2-3 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


### B.9 MSFT — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $427 (+10.4%) | 30% | +$3.02 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 1-2 gün |
| **Bear** | $347 (-10.3%) | 30% | +$3.02 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 1-2 gün |
| **Flat** | $387 (+0.0%) | 40% | +$4.91 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 1 gün | 1-2 gün |

> **MSFT Senaryo Yorumu (Earnings Play):** MSFT earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%40) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 1-2 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


### B.10 MU — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $1100 (+10.4%) | 30% | +$11.28 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 2-3 gün |
| **Bear** | $895 (-10.1%) | 25% | +$11.28 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 2-3 gün |
| **Flat** | $996 (+0.0%) | 45% | +$18.33 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 2 gün | 2-3 gün |

> **MU Senaryo Yorumu (Earnings Play):** MU earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%45) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 2-3 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


### B.11 INTC — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $130 (+11.1%) | 30% | +$1.38 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 2-3 gün |
| **Bear** | $105 (-10.2%) | 25% | +$1.38 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 2-3 gün |
| **Flat** | $117 (+0.0%) | 45% | +$2.24 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 2 gün | 2-3 gün |

> **INTC Senaryo Yorumu (Earnings Play):** INTC earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%45) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 2-3 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


### B.12 PLTR — 3 Senaryo Analizi (Earnings Play)

| Senaryo | Fiyat Hedefi | Olasılık | IC P&L (IV Crush Dahil) | Aksiyon | Max Hold |
|---------|-------------|----------|------------------------|---------|----------|
| **Bull** | $145 (+10.6%) | 35% | +$1.66 (Call tarafı test edilir) | Call spread'i kapat, put spread'i tut, IV crush bekle | 2-4 gün |
| **Bear** | $118 (-10.0%) | 25% | +$1.66 (Put tarafı test edilir) | Put spread'i kapat, call spread'i tut, IV crush bekle | 2-4 gün |
| **Flat** | $131 (+0.0%) | 40% | +$2.70 (IV Crush + Theta) | %50-75 kar hedefi — agresif al, Earnings + 2 gün | 2-4 gün |

> **PLTR Senaryo Yorumu (Earnings Play):** PLTR earnings sonrası üç senaryo için aksiyon planı: Bull senaryoda call tarafı test edilirse call spread kapatılır, put spread tutulur ve IV crush beklenir. Bear senaryoda put tarafı test edilirse put spread kapatılır, call spread tutulur ve IV crush beklenir. **Flat senaryo en olasıdır (%40) — bu IV Crush ve Theta decay'in pozisyonu karlı çıkaracağı senaryo.** Earnings Play formatında her senaryoda max hold 2-4 gün ile sınırlıdır. **3. gün tutmak YASAKTIR.**


---

## Ek C: Makro Faktörler ve Teknoloji Sektörü Etkileri (Earnings Play v2.1)

> **Makro Analizi:** Temmuz 2026 earnings döneminde teknoloji sektörünü etkileyebilecek makro faktörler: FOMC (28-29 Temmuz), CPI (11 Temmuz), NFP (3 Temmuz), Çin verileri, AI regülasyonları, çip savaşları. **Earnings Play formatında makro faktörler entry zamanını etkiler ancak exit zamanını değiştirmez — exit her zaman earnings sonrası 1-2 gündür.**

### C.1 Makro Takvim ve Etkileri

| Tarih | Makro Veri | Etki Seviyesi | Etkilenen Hisseler | Beklenti | Earnings Play Etkisi |
|-------|-----------|---------------|-------------------|----------|---------------------|
| **3 Temmuz** | NFP (İstihdam) | Orta | Tüm teknoloji | 200K+ = Güçlü dolar = Tech baskısı | Entry zamanını etkileyebilir, exit değiştirmez |
| **11 Temmuz** | CPI (Enflasyon) | Yüksek | Tüm teknoloji | 3.0%+ = Faiz artışı beklentisi = Tech baskısı | Entry zamanını etkileyebilir, exit değiştirmez |
| **16 Temmuz** | Çin GDP | Orta | NVDA, AMD, MU, INTC | 5.0%+ = Çin talebi artar = Chip hisseleri yükselir | Entry zamanını etkileyebilir, exit değiştirmez |
| **28-29 Temmuz** | **FOMC** | **Çok Yüksek** | **Tüm teknoloji** | **Faiz indirimi = Tech rallisi / Durumsal = Tech baskısı** | Entry zamanını etkileyebilir, exit değiştirmez |
| **Tüm Temmuz** | AI Regülasyonları | Yüksek | NVDA, GOOGL, MSFT, PLTR | AB AI Act = Maliyet artışı = Margin baskısı | Entry zamanını etkileyebilir, exit değiştirmez |
| **Tüm Temmuz** | Çip Savaşları | Yüksek | NVDA, AMD, MU, INTC | Çin export restrictions = Revenue baskısı | Entry zamanını etkileyebilir, exit değiştirmez |

> **Makro Etki Yorumu (Earnings Play):** FOMC (28-29 Temmuz) tüm teknoloji hisseleri için en kritik makro faktör. Ancak Earnings Play formatında makro faktörler entry zamanını etkiler, exit zamanını değiştirmez. **Exit her zaman earnings sonrası 1-2 gündür.** Faiz indirimi bekleniyorsa Tech rallisi yaşanabilir — bu call tarafı riskini artırır, entry'de call wing genişletilebilir. Faiz indirimi ertelenirse Tech baskısı yaşanabilir — put tarafı riskini artırır, entry'de put wing genişletilebilir. Ancak exit değişmez: Earnings + 1-2 gün.

### C.2 FOMC Senaryoları ve Teknoloji Etkileri (Earnings Play Uyarlaması)

| FOMC Senaryo | Olasılık | Dolar | Tech Sektörü | IC Entry Etkisi | IC Exit Etkisi | Tavsiye |
|-------------|----------|-------|--------------|-----------------|---------------|---------|
| **25bp İndirim** | 30% | Zayıflar | Ralli | Call wing genişlet | Exit değişmez | Entry'de call wing +%5 genişlet |
| **Durumsal (No Change)** | 50% | Stabil | Yatay | Minimal etki | Exit değişmez | Mevcut strateji devam |
| **25bp Artış** | 20% | Güçlenir | Satış | Put wing genişlet | Exit değişmez | Entry'de put wing +%5 genişlet |

> **FOMC Senaryo Yorumu (Earnings Play):** FOMC 28-29 Temmuz'da. Piyasa beklentisi %50 olasılıkla durumsal (no change). %30 olasılıkla 25bp indirim. %20 olasılıkla 25bp artış. **Earnings Play formatında FOMC senaryosu entry'de wing width ayarlaması yapılmasına neden olabilir ancak exit zamanını değiştirmez.** Exit her zaman earnings sonrası 1-2 gündür. 25bp indirim senaryosunda Tech rallisi yaşanabilir — entry'de call wing'i genişletmek gerekir. 25bp artış senaryosunda Tech satışı yaşanabilir — entry'de put wing'i genişletmek gerekir. Durumsal senaryoda minimal etki — mevcut strateji devam eder.

### C.3 Çip Savaşları Etki Matrisi (Earnings Play Uyarlaması)

| Çip Şirketi | Çin Revenue % | Export Risk | Baskı Seviyesi | IC Entry Ayarlaması | IC Exit Etkisi |
|-------------|---------------|-------------|----------------|---------------------|---------------|
| **NVDA** | 20-25% | Yüksek | Yüksek | Put wing +%5 genişlet | Exit değişmez |
| **AMD** | 15-20% | Yüksek | Yüksek | Put wing +%5 genişlet | Exit değişmez |
| **MU** | 30-35% | Çok Yüksek | Çok Yüksek | Put wing +%10 genişlet | Exit değişmez |
| **INTC** | 25-30% | Yüksek | Yüksek | Put wing +%5 genişlet | Exit değişmez |

> **Çip Savaşları Yorumu (Earnings Play):** NVDA, AMD, MU ve INTC Çin revenue bağımlılığı yüksek. ABD'nin Çin'e yönelik export restrictions genişletmesi bu hisseleri baskılar. MU en yüksek Çin bağımlılığına sahip (%30-35) — bu MU put wing'ini %10 genişletmeyi gerektirir. NVDA ve AMD orta bağımlılık (%15-25) — put wing'i %5 genişletmek yeterli. INTC %25-30 bağımlılık — put wing'i %5 genişletmek yeterli. **Exit her zaman earnings sonrası 1-2 gündür.**

---

## Ek D: Alternatif Stratejiler ve Kullanım Rehberi (Earnings Play Formatı)

> **Alternatif Stratejiler:** Iron Condor ana stratejisi olmakla birlikte, belirli koşullarda alternatif stratejiler daha uygun olabilir. Bu bölümde Calendar Spread, Ratio Spread, Jade Lizard, Long Straddle/Strangle ve Short Straddle stratejilerinin Earnings Play formatındaki kullanım rehberi sunulmaktadır. **Alternatif stratejiler de Earnings Play formatındadır — entry earnings'ten 2-5 gün önce, exit earnings sonrası 1-2 gün içinde.**

### D.1 Long Straddle / Strangle (Earnings Play Alternatifi)

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **En İyi Hisse** | AMD, NVDA, TSLA, PLTR | Yüksek IV, büyük hareket beklentisi |
| **Entry Zamanı** | Earnings'ten 2-3 gün önce | IV yükselmişken |
| **Exit Zamanı** | Earnings sonrası 1-2 gün | Hareketi yakala, hareket yoksa hemen çık |
| **Strike Seçimi** | ATM (Straddle) veya OTM (Strangle) | Fiyatın üzerinde/altında |
| **Maliyet** | ~$20-$50 | Yüksek IV = yüksek maliyet |
| **Max Kar** | Sınırsız | Her iki yönde sınırsız kar |
| **Kar Hedefi** | %50-100 prim artışı | Earnings sonrası hareket büyükse kar artar |
| **Max Hold** | 2 gün | Earnings sonrası 2 günden fazla tutma |
| **K.O. Olasılığı** | ~30-40% | Büyük hareket gerekli |

> **Long Straddle/Strangle Rasyoneli (Earnings Play):** Yüksek IV'lu hisselerde (AMD, NVDA, TSLA, PLTR) Long Straddle/Strangle ile earnings sonrası büyük hareketi yakalamak mümkün. Entry: Earnings'ten 2-3 gün önce. Exit: Earnings sonrası 1-2 gün. Eğer hareket yoksa hemen çık. **Kar hedefi: %50-100 prim artışı.** Max hold: 2 gün. **Risk:** Maliyet yüksek, büyük hareket olmazsa tüm prim kaybedilebilir. Pozisyon boyutu %0.5'i geçmemeli.

### D.2 Calendar Spread (Zaman Spread — Earnings Play)

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **En İyi Hisse** | MSFT, AAPL | Düşük IV, stabil hareket |
| **Entry Zamanı** | Earnings'ten 5-7 gün önce | Uzun vadeli leg al, short leg sat |
| **Exit Zamanı** | Earnings sonrası 1-2 gün | Short leg IV crush'tan kar al |
| **Strike Seçimi** | ATM veya hafif OTM | Fiyatın üzerinde/altında |
| **Maliyet** | ~$2.00-$5.00 | Debit spread |
| **Max Kar** | ~$5.00-$15.00 | Short leg IV Crush + long leg değer koruma |
| **Max Hold** | 2 gün | Earnings sonrası 2 günden fazla tutma |
| **K.O. Olasılığı** | ~55-60% | Düşük ama risk/ödül dengeli |

> **Calendar Spread Rasyoneli (Earnings Play):** MSFT ve AAPL düşük beta ve düşük IV nedeniyle Calendar Spread için uygun. Entry: Earnings'ten 5-7 gün önce. Exit: Earnings sonrası 1-2 gün. Short leg IV Crush'tan kazanç sağlar, long leg zaman değeri korur. Risk sınırlı (debit = max risk). **Max hold: 2 gün.** K.O. olasılığı düşük (~55-60%) ancak risk/ödül dengesi iyidir.

### D.3 Ratio Spread (1:2 veya 1:3 — Earnings Play)

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **En İyi Hisse** | AMD, NVDA, PLTR | Yüksek IV, yönlü beklenti |
| **Entry Zamanı** | Earnings'ten 2-5 gün önce | IV yükselmişken |
| **Exit Zamanı** | Earnings sonrası 1-2 gün | Yönlü hareketi yakala |
| **Yapı** | 1 Long : 2 Short | Örn: 1x $500C Long, 2x $520C Short |
| **Kredi/Maliyet** | Genellikle kredi veya düşük debit | Net kredi toplanabilir |
| **Max Kar** | Sınırsız (tek taraflı) | Long leg tarafında sınırsız |
| **Risk** | Sınırsız (short leg tarafında) | Fiyat aşırı hareket ederse risk artar |
| **Max Hold** | 2 gün | Earnings sonrası 2 günden fazla tutma |
| **K.O. Olasılığı** | ~60-65% | Yönlü beklenti gerektirir |

> **Ratio Spread Rasyoneli (Earnings Play):** AMD, NVDA ve PLTR yüksek IV nedeniyle Ratio Spread için uygun. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün. Net kredi toplanabilir. Max kar sınırsız (long leg tarafında) ancak risk de sınırsız (short leg tarafında). **Max hold: 2 gün.** Yönlü beklenti gerektirir — örn: AMD için bullish ratio call spread. Risk yönetimi kritik — pozisyon boyutu %0.5'i geçmemeli.

### D.4 Jade Lizard (Call Ağır Strangle + Put Spread — Earnings Play)

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **En İyi Hisse** | GOOGL, META | Call'lar şişmiş, put'lar ucuz |
| **Entry Zamanı** | Earnings'ten 2-5 gün önce | IV yükselmişken |
| **Exit Zamanı** | Earnings sonrası 1-2 gün | IV crush'tan kar al |
| **Yapı** | Short Call + Short Put + Long Put | Net kredi toplanır, call tarafı açık |
| **Kredi** | ~$10.00-$20.00 | Yüksek kredi potansiyeli |
| **Max Risk** | Sınırsız (call tarafında) | Call tarafı açık = sınırsız risk |
| **Max Hold** | 2 gün | Earnings sonrası 2 günden fazla tutma |
| **K.O. Olasılığı** | ~70-75% | Call tarafı açık = yüksek risk |
| **Hedge** | Call tarafı hedge'le | Long call veya call spread ile hedge |

> **Jade Lizard Rasyoneli (Earnings Play):** GOOGL ve META call'ları şişmiş (CPR < 0.60) olduğu için Jade Lizard uygun. Entry: Earnings'ten 2-5 gün önce. Exit: Earnings sonrası 1-2 gün. Short call + short put + long put yapısı ile net kredi toplanır. Call tarafı açık (uncovered) olduğu için sınırsız risk taşır — bu nedenle call tarafı long call veya call spread ile hedge'lenmeli. **Max hold: 2 gün.** Yüksek riskli strateji — pozisyon boyutu %0.5'i geçmemeli.

### D.5 Short Straddle (Nadir Kullanım — Earnings Play)

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| **En İyi Hisse** | AAPL, MSFT | Düşük IV, dar range |
| **Entry Zamanı** | Earnings'ten 2-3 gün önce | IV yükselmişken |
| **Exit Zamanı** | Earnings sonrası 1 gün | IV crush'tan kar al |
| **Strike** | ATM | Fiyatın tam üzerinde |
| **Kredi** | ~$8.00-$15.00 | Yüksek kredi potansiyeli |
| **Max Risk** | Sınırsız | Her iki yönde sınırsız risk |
| **Max Hold** | 1 gün | Earnings sonrası 1 günden fazla tutma |
| **K.O. Olasılığı** | ~55-60% | Dar range = yüksek K.O. |

> **Short Straddle Rasyoneli (Earnings Play):** AAPL ve MSFT düşük IV ve dar range nedeniyle Short Straddle için nadir uygun. Entry: Earnings'ten 2-3 gün önce. Exit: Earnings sonrası 1 gün. ATM call ve put satılır, yüksek kredi toplanır. Max risk sınırsız — her iki yönde. **Max hold: 1 gün.** Dar range bekleniyorsa K.O. olasılığı yüksek (~55-60%). Ancak earnings sonrası tek bir büyük hareket pozisyonu mahvedebilir. **Tavsiye edilmez — Iron Condor daha güvenli.**

### D.6 Alternatif Strateji Karşılaştırma Tablosu (Earnings Play Formatı)

| Strateji | En İyi Hisse | Risk | Kredi | K.O. | Max Hold | Kullanım Sıklığı |
|----------|-------------|------|-------|------|----------|------------------|
| **Iron Condor** | Tümü | Sınırlı | Orta | %75-90 | 1-2 gün | **Ana strateji** |
| **Long Straddle/Strangle** | AMD, NVDA, TSLA, PLTR | Sınırlı (maliyet) | Düşük (debit) | %30-40 | 2 gün | Alternatif |
| **Calendar Spread** | MSFT, AAPL | Sınırlı | Düşük | %55-60 | 2 gün | Nadir |
| **Ratio Spread** | AMD, NVDA | Sınırsız | Yüksek | %60-65 | 2 gün | Çok nadir |
| **Jade Lizard** | GOOGL, META | Sınırsız | Yüksek | %70-75 | 2 gün | Nadir |
| **Short Straddle** | AAPL, MSFT | Sınırsız | Yüksek | %55-60 | 1 gün | **Tavsiye edilmez** |

> **Alternatif Strateji Sonuç (Earnings Play):** Iron Condor teknoloji sektöründeki ana strateji olarak kalmalıdır. Alternatif stratejiler (Long Straddle, Calendar Spread, Ratio Spread, Jade Lizard) nadir koşullarda ve küçük pozisyonlarla (%0.5 hesap) kullanılabilir. Tüm alternatif stratejiler Earnings Play formatındadır — entry earnings'ten 2-5 gün önce, exit earnings sonrası 1-2 gün içinde. Short Straddle tavsiye edilmez — sınırsız risk nedeniyle earnings döneminde çok tehlikelidir. **Max hold kuralı tüm stratejiler için geçerlidir: 1-2 gün.**

---

## Ek E: Pozisyon Yönetimi ve Hedge Stratejileri (Earnings Play v2.1)

> **Pozisyon Yönetimi:** Iron Condor pozisyonları yönetimi gerektirir. Bu bölümde Earnings Play formatına özgü pozisyon açma, izleme, ayarlama ve kapatma kuralları detaylandırılmıştır. Ayrıca hedge stratejileri (protective put, call spread hedge, VIX hedge) sunulmaktadır. **Earnings Play formatında pozisyon yönetimi daha basittir — entry, earnings, exit. Ara ayarlamalar nadirdir.**

### E.1 Pozisyon Açma Kuralları (Earnings Play)

| Kural | Açıklama | Örnek |
|-------|----------|-------|
| **Kural 1** | IV Rank > %50 kontrolü | AMD %91.7 = Uygun / MSFT %50 = Marjinal |
| **Kural 2** | VIX < 40 kontrolü | VIX > 40 = Pozisyon açma / VIX 30-40 = Yarım pozisyon |
| **Kural 3** | FOMC çakışma kontrolü | FOMC ile çakışan hisselerde yarım pozisyon |
| **Kural 4** | Pozisyon boyutu %1-2 | Beta > 2.0 = %1 / Beta < 1.5 = %1.5-2 |
| **Kural 5** | Wing width = Fiyat / 10 | AMD $488 = $48.8 wing / NFLX $81 = $8.1 wing |
| **Kural 6** | Short strike = EM %10-15 dışı | EM %15 = Short strike fiyattan %15 uzakta |
| **Kural 7** | Kredi/Risk oranı > %20 | Kredi $24 / Risk $245 = %9.8 = Yeterli |
| **Kural 8** | Entry = Earnings'ten 2-5 gün önce | AMD 30 Temmuz earnings = 25-28 Temmuz entry |

### E.2 Pozisyon İzleme Kuralları (Earnings Play)

| Kural | Açıklama | Aksiyon |
|-------|----------|---------|
| **Kural 9** | Günlük Delta kontrolü | Delta > ±0.10 = Pozisyonu ayarla |
| **Kural 10** | Earnings günü izleme | Pozisyon açık, volatilite yüksek, panik yapma |
| **Kural 11** | Earnings sonrası IV kontrolü | IV düşüşü > %30 = Kar hedefi değerlendir |
| **Kural 12** | Fiyat hareketi kontrolü | Fiyat short strike'a %5 yaklaşırsa = Uyarı |
| **Kural 13** | Makro haber takibi | FOMC, CPI, NFP günlerinde pozisyonu izle |
| **Kural 14** | Max hold kontrolü | 2 gün geçtiyse = ZORUNLU ÇIKIŞ |

### E.3 Pozisyon Ayarlama (Adjustment) Kuralları (Earnings Play)

> **Earnings Play formatında ayarlama nadirdir.** Pozisyon açıldıktan sonra earnings sonrasına kadar genellikle tutulur. Ancak aşağıdaki durumlarda ayarlama düşünülebilir:

| Senaryo | Ayarlama | Maliyet | Etki | Max Hold |
|---------|----------|---------|------|----------|
| **Fiyat Call Tarafına Yaklaşıyor** | Call wing'i genişlet (roll up) | ~$2.00-$5.00 debit | Risk azalır, kredi düşer | 2 gün |
| **Fiyat Put Tarafına Yaklaşıyor** | Put wing'i genişlet (roll down) | ~$2.00-$5.00 debit | Risk azalır, kredi düşer | 2 gün |
| **IV Artışı > %20** | Hedge ekle (long straddle) | ~$5.00-$10.00 debit | IV artışı riski azalır | 2 gün |
| **FOMC Yaklaşıyor** | Pozisyonu %50 küçült | Kredi geri al | Risk azalır | 2 gün |
| **Earnings Öncesi** | Pozisyonu kapalı tut | — | Volatiliteden korun | — |

### E.4 Hedge Stratejileri (Earnings Play)

| Hedge Tipi | Maliyet | Kullanım | En İyi Hisse | Max Hold |
|------------|---------|----------|--------------|----------|
| **Protective Put** | ~$2.00-$5.00 | Long put al, downside koru | Tümü | 2 gün |
| **Call Spread Hedge** | ~$1.00-$3.00 | Long call spread, upside koru | AMD, NVDA | 2 gün |
| **VIX Call Hedge** | ~$1.00-$2.00 | VIX call al, sektör hedge'le | Tümü | 2 gün |
| **Inverse ETF Hedge** | ~$1.00-$3.00 | SQQQ veya TECS al, sektör hedge'le | Tümü | 2 gün |
| **Collar Hedge** | Net maliyet ~$0 | Long put + short call, maliyetsiz hedge | AAPL, MSFT | 2 gün |

> **Hedge Stratejileri Yorumu (Earnings Play):** Earnings Play formatında hedge maliyeti pozisyon karından düşülür — %10-15 kar hedge maliyeti kabul edilebilir. Ancak hedge kullanımı Earnings Play'in basitliğini bozabilir. **Tavsiye:** Hedge yerine pozisyon boyutunu küçültmek (Beta > 2.0 = %1) daha etkilidir. Eğer hedge kullanılacaksa, Protective Put en basit seçenektir. **Max hold tüm hedge'ler için 2 gündür.**

### E.5 Pozisyon Kapatma Kuralları (Earnings Play — EN ÖNEMLİ)

| Kural | Açıklama | Örnek |
|-------|----------|-------|
| **Kural 15** | %50-75 kar hedefi | Kredi $24.35 = Kar hedefi $12.18-$18.26 |
| **Kural 16** | 200% kredi stop-loss | Kredi $24.35 = Stop $48.70 |
| **Kural 17** | Earnings sonrası 1-2 gün çıkış | BMO: Earnings günü akşam/ertesi gün / AMC: Ertesi gün sabah |
| **Kural 18** | Max hold: 2 gün | 2 gün geçtiyse = ZORUNLU ÇIKIŞ, kar/zarar fark etmez |
| **Kural 19** | FOMC öncesi %50 küçült | 25-27 Temmuz'da pozisyonu %50 küçült (eğer hala açıksa) |
| **Kural 20** | FOMC günü tamamen kapat | 28-29 Temmuz'da pozisyonu kapat veya hedge'le (eğer hala açıksa) |
| **Kural 21** | ⛔ TUTMA YASAK | Earnings play'ler 2 günden fazla tutulmaz. Bu kural KESİNLİKLE uygulanmalı. |

> **Kapatma Kuralları Yorumu (Earnings Play v2.1):** Earnings Play formatında kapatma kuralları en önemli kurallardır. **Kural 21 (TUTMA YASAK) kesinlikle uygulanmalıdır.** Earnings play'ler 2 günden fazla tutulmaz çünkü: 1) Gamma riski artar, 2) IV crush fırsatı kaçar, 3) Yeni haber akışları pozisyonu tehdit eder, 4) Earnings momentumu tükenir. Kar hedefi %50-75 kredi ile agresif takip edilmeli. Stop-loss 200% kredi ile disiplinli uygulanmalı. **Max hold 2 gün — bu kurala sadık kalmak Earnings Play başarısının anahtarıdır.**

---

## Ek F: Teknik Analiz Derinlemesine — Destek/Direnç Seviyeleri (Güncel Fiyatlar)

> **Teknik Seviyeler:** Her hisse için kritik destek ve direnç seviyeleri, pivot noktaları ve Fibonacci retracement seviyeleri analiz edilmektedir. Bu seviyeler Iron Condor wing width ve strike seçimi için referans olarak kullanılabilir. **Güncel fiyatlar (12 Haziran 2026) ile yeniden hesaplanmıştır.**

### F.1 AMD — Destek/Direnç ve Fibonacci

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $546.00 | Direnç | 52 haftalık zirve — aşılırsa ralli devam eder |
| **R2** | $520.00 | Direnç | Psikolojik direnç — short call yakınında |
| **R1** | $500.00 | Direnç | Yükseliş trendi direnci — yakın vadeli hedef |
| **Pivot** | $488.45 | Pivot | Mevcut fiyat — middle band |
| **S1** | $460.00 | Destek | 50MA yakınında — ilk destek |
| **S2** | $420.00 | Destek | Yükseliş trendi desteği — güçlü destek |
| **S3** | $364.00 | Destek | 50MA seviyesi — kritik destek |
| **Fib 61.8%** | $450.00 | Retracement | Yükselişin %38.2 düzeltmesi |
| **Fib 50%** | $400.00 | Retracement | Yükselişin %50 düzeltmesi |
| **Fib 38.2%** | $350.00 | Retracement | Yükselişin %61.8 düzeltmesi |

> **AMD Teknik Yorumu:** AMD $546 (52W high) direncine yaklaşıyor. Bu seviye aşılırsa ralli devam edebilir — call tarafı riski artar. $500 psikolojik direnç — short call $660 bu seviyeden oldukça uzakta. $460 (S1) ilk destek — put tarafı için referans. $364 (S3, 50MA) kritik destek — bu seviye kırılırsa downtrend başlar. Fibonacci seviyeleri $450, $400, $350 — düzeltme derinliği için referans. Earnings Play formatında short call $660 ve short put $320 geniş breakeven'lar sunuyor — K.O. olasılığı ~75%.

### F.2 TSLA — Destek/Direnç ve Fibonacci (Güncel Fiyat: $386.88)

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $450.00 | Direnç | Psikolojik direnç — short call yakınında |
| **R2** | $430.00 | Direnç | Yükseliş trendi direnci |
| **R1** | $415.00 | Direnç | 200MA yakınında — kritik direnç |
| **Pivot** | $386.88 | Pivot | Mevcut fiyat — middle band altı |
| **S1** | $396.00 | Destek | 50MA seviyesi — ilk destek (fiyat altında!) |
| **S2** | $380.00 | Destek | Yükseliş trendi desteği |
| **S3** | $360.00 | Destek | Düşüş trendi desteği — kritik |
| **Fib 61.8%** | $390.00 | Retracement | Yükselişin %38.2 düzeltmesi |
| **Fib 50%** | $370.00 | Retracement | Yükselişin %50 düzeltmesi |
| **Fib 38.2%** | $350.00 | Retracement | Yükselişin %61.8 düzeltmesi |

> **TSLA Teknik Yorumu (Güncel):** TSLA $386.88 ile 200MA ($414.57) altında ve 50MA ($396.03) altında seyrediyor — bu uzun vadeli ve kısa vadeli trendin zayıf olduğunu gösteriyor. $415 (R1, 200MA) direnci üzerinde kalıcılık sağlanırsa bullish reversal başlayabilir. $396 (S1, 50MA) ilk destek — fiyat şu anda bu seviyenin altında. $360 (S3) kritik destek — bu seviye kırılırsa downtrend derinleşir. Short call $490 ve short put $295 geniş breakeven'lar sunuyor — K.O. olasılığı ~81%. Earnings Play formatında max hold 2 gün.

### F.3 NFLX — Destek/Direnç ve Fibonacci

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $92.00 | Direnç | 50MA seviyesi — kritik direnç |
| **R2** | $88.00 | Direnç | Yükseliş trendi direnci |
| **R1** | $85.00 | Direnç | Psikolojik direnç |
| **Pivot** | $81.27 | Pivot | Mevcut fiyat — middle band altı |
| **S1** | $78.00 | Destek | Düşüş trendi desteği |
| **S2** | $72.00 | Destek | Psikolojik destek — short put yakınında |
| **S3** | $68.00 | Destek | Düşüş trendi desteği — kritik |
| **Fib 61.8%** | $85.00 | Retracement | Düşüşün %38.2 düzeltmesi |
| **Fib 50%** | $90.00 | Retracement | Düşüşün %50 düzeltmesi |
| **Fib 38.2%** | $95.00 | Retracement | Düşüşün %61.8 düzeltmesi |

> **NFLX Teknik Yorumu:** NFLX $92 (R3, 50MA) direnci altında — bu downtrend görünümünü destekliyor. $92 üzerinde kalıcılık sağlanırsa trend değişimi başlayabilir. $78 (S1) ilk destek — put tarafı için referans. $72 (S2) psikolojik destek — short put $62.50 bu seviyeden uzakta. Short call $102.50 ve short put $62.50 geniş breakeven'lar sunuyor — K.O. olasılığı ~84%. Earnings Play formatında max hold 1 gün (hızlı crush).

### F.4 NVDA — Destek/Direnç ve Fibonacci

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $225.00 | Direnç | Bollinger üst bandı — kritik direnç |
| **R2** | $215.00 | Direnç | Yükseliş trendi direnci |
| **R1** | $210.00 | Direnç | Psikolojik direnç |
| **Pivot** | $204.87 | Pivot | Mevcut fiyat — middle band |
| **S1** | $200.00 | Destek | Psikolojik destek — ilk destek |
| **S2** | $190.00 | Destek | Yükseliş trendi desteği |
| **S3** | $188.00 | Destek | 200MA seviyesi — kritik destek |
| **Fib 61.8%** | $195.00 | Retracement | Yükselişin %38.2 düzeltmesi |
| **Fib 50%** | $185.00 | Retracement | Yükselişin %50 düzeltmesi |
| **Fib 38.2%** | $175.00 | Retracement | Yükselişin %61.8 düzeltmesi |

> **NVDA Teknik Yorumu:** NVDA $225 (R3, Bollinger üst) direncine yaklaşıyor. Bu seviye aşılırsa ralli devam edebilir — call tarafı riski artar. $200 (S1) psikolojik destek — put tarafı için referans. $188 (S3, 200MA) kritik destek — bu seviye kırılırsa trend değişimi riski. Short call $250 ve short put $165 geniş breakeven'lar sunuyor — K.O. olasılığı ~86%. Earnings Play formatında max hold 2 gün.

### F.5 META — Destek/Direnç ve Fibonacci (Güncel Fiyat: $561.48)

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $620.00 | Direnç | 50MA seviyesi — kritik direnç |
| **R2** | $600.00 | Direnç | Psikolojik direnç |
| **R1** | $590.00 | Direnç | Yükseliş trendi direnci |
| **Pivot** | $561.48 | Pivot | Mevcut fiyat — middle band altı |
| **S1** | $570.00 | Destek | Düşüş trendi desteği (fiyat altında!) |
| **S2** | $540.00 | Destek | Psikolojik destek — short put yakınında |
| **S3** | $500.00 | Destek | Düşüş trendi desteği — kritik |
| **Fib 61.8%** | $600.00 | Retracement | Düşüşün %38.2 düzeltmesi |
| **Fib 50%** | $620.00 | Retracement | Düşüşün %50 düzeltmesi |
| **Fib 38.2%** | $640.00 | Retracement | Düşüşün %61.8 düzeltmesi |

> **META Teknik Yorumu (Güncel):** META $561.48 ile $620 (R3, 50MA) direnci altında — bu downtrend görünümünü destekliyor. $620 üzerinde kalıcılık sağlanırsa trend değişimi başlayabilir. $570 (S1) ilk destek — fiyat şu anda bu seviyenin altında. $540 (S2) psikolojik destek — short put $455 bu seviyeden uzakta. Short call $665 ve short put $455 geniş breakeven'lar sunuyor — K.O. olasılığı ~87%. Earnings Play formatında max hold 2 gün. Fiyat $585→$561.48 düşüşü put tarafı riskini artırıyor.

### F.6 GOOGL — Destek/Direnç ve Fibonacci (Güncel Fiyat: $348.02)

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $400.00 | Direnç | Psikolojik direnç — kritik |
| **R2** | $380.00 | Direnç | Yükseliş trendi direnci |
| **R1** | $370.00 | Direnç | Bollinger üst bandı yakınında |
| **Pivot** | $348.02 | Pivot | Mevcut fiyat — middle band altı |
| **S1** | $356.00 | Destek | 50MA seviyesi — ilk destek (fiyat altında!) |
| **S2** | $340.00 | Destek | Yükseliş trendi desteği |
| **S3** | $305.00 | Destek | 200MA seviyesi — kritik destek |
| **Fib 61.8%** | $350.00 | Retracement | Yükselişin %38.2 düzeltmesi |
| **Fib 50%** | $330.00 | Retracement | Yükselişin %50 düzeltmesi |
| **Fib 38.2%** | $310.00 | Retracement | Yükselişin %61.8 düzeltmesi |

> **GOOGL Teknik Yorumu (Güncel):** GOOGL $348.02 ile $356 (S1, 50MA) desteğinin altında seyrediyor — bu kısa vadeli zayıflığı gösteriyor. $400 (R3) psikolojik direncine yaklaşması zor görünüyor. $305 (S3, 200MA) kritik destek — bu seviye kırılırsa trend değişimi riski. Short call $405 ve short put $290 — put tarafı 200MA üzerinde, bu güvenli. Earnings Play formatında max hold 1 gün. Fiyat $363→$348.02 düşüşü kısa vadeli momentumu zayıflattı.

### F.7 AAPL — Destek/Direnç ve Fibonacci (Güncel Fiyat: $293.60)

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $320.00 | Direnç | Psikolojik direnç — kritik |
| **R2** | $310.00 | Direnç | Yükseliş trendi direnci |
| **R1** | $305.00 | Direnç | Bollinger üst bandı yakınında |
| **Pivot** | $293.60 | Pivot | Mevcut fiyat — middle band altı |
| **S1** | $295.00 | Destek | Düşüş trendi desteği (fiyat yakınında) |
| **S2** | $282.00 | Destek | 50MA seviyesi — kritik destek |
| **S3** | $266.00 | Destek | 200MA seviyesi — kritik destek |
| **Fib 61.8%** | $290.00 | Retracement | Yükselişin %38.2 düzeltmesi |
| **Fib 50%** | $280.00 | Retracement | Yükselişin %50 düzeltmesi |
| **Fib 38.2%** | $270.00 | Retracement | Yükselişin %61.8 düzeltmesi |

> **AAPL Teknik Yorumu (Güncel):** AAPL $293.60 ile $295 (S1) desteğine yakın. $320 (R3) psikolojik direncine yaklaşması zor. $282 (S2, 50MA) kritik destek — bu seviye kırılırsa kısa vadeli trend negatif olur. $266 (S3, 200MA) kritik destek — bu seviye kırılırsa trend değişimi riski. Short call $340 ve short put $250 geniş breakeven'lar sunuyor — K.O. olasılığı ~90%. Earnings Play formatında max hold 1 gün. Fiyat $302→$293.60 düşüşü kısa vadeli zayıflığı gösteriyor.

### F.8 AMZN — Destek/Direnç ve Fibonacci (Güncel Fiyat: $237.21)

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $260.00 | Direnç | Psikolojik direnç — kritik |
| **R2** | $252.00 | Direnç | 50MA seviyesi — kritik direnç |
| **R1** | $250.00 | Direnç | Psikolojik direnç |
| **Pivot** | $237.21 | Pivot | Mevcut fiyat — middle band altı |
| **S1** | $240.00 | Destek | Düşüş trendi desteği (fiyat altında!) |
| **S2** | $232.00 | Destek | 200MA seviyesi — kritik destek |
| **S3** | $220.00 | Destek | Düşüş trendi desteği — kritik |
| **Fib 61.8%** | $240.00 | Retracement | Yükselişin %38.2 düzeltmesi |
| **Fib 50%** | $230.00 | Retracement | Yükselişin %50 düzeltmesi |
| **Fib 38.2%** | $220.00 | Retracement | Yükselişin %61.8 düzeltmesi |

> **AMZN Teknik Yorumu (Güncel):** AMZN $237.21 ile $252 (R2, 50MA) direnci altında ve $240 (S1) desteğinin altında — bu Bearish Cross sinyalini destekliyor. $252 üzerinde kalıcılık sağlanırsa trend değişimi başlayabilir. $232 (S2, 200MA) kritik destek — bu seviye kırılırsa trend değişimi riski. $220 (S3) psikolojik destek — short put $195 bu seviyeden uzakta. Short call $280 ve short put $195 geniş breakeven'lar sunuyor — K.O. olasılığı ~88%. Earnings Play formatında max hold 2 gün. Fiyat $245→$237.21 düşüşü kısa vadeli momentumu zayıflattı.

### F.9 MSFT — Destek/Direnç ve Fibonacci (Güncel Fiyat: $386.73)

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $430.00 | Direnç | Psikolojik direnç — kritik |
| **R2** | $420.00 | Direnç | Yükseliş trendi direnci |
| **R1** | $415.00 | Direnç | 50MA yakınında |
| **Pivot** | $386.73 | Pivot | Mevcut fiyat — middle band altı |
| **S1** | $409.00 | Destek | 50MA seviyesi — ilk destek (fiyat altında!) |
| **S2** | $390.00 | Destek | Yükseliş trendi desteği |
| **S3** | $356.00 | Destek | 200MA seviyesi — kritik destek |
| **Fib 61.8%** | $400.00 | Retracement | Düşüşün %38.2 düzeltmesi |
| **Fib 50%** | $385.00 | Retracement | Düşüşün %50 düzeltmesi |
| **Fib 38.2%** | $370.00 | Retracement | Düşüşün %61.8 düzeltmesi |

> **MSFT Teknik Yorumu (Güncel):** MSFT $386.73 ile $409 (S1, 50MA) desteğinin oldukça altında seyrediyor — bu kısa vadeli trendin zayıf olduğunu gösteriyor. $430 (R3) psikolojik direncine yaklaşması zor. $356 (S3, 200MA) kritik destek — bu seviye kırılırsa trend değişimi riski. Short call $440 ve short put $335 — put tarafı 200MA üzerinde, bu güvenli. Earnings Play formatında max hold 1 gün. Fiyat $412→$386.73 düşüşü ciddi bir kısa vadeli zayıflığı gösteriyor.

### F.10 MU — Destek/Direnç ve Fibonacci

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $1,080.00 | Direnç | Bollinger üst bandı — kritik direnç |
| **R2** | $1,050.00 | Direnç | Psikolojik direnç |
| **R1** | $1,020.00 | Direnç | Yükseliş trendi direnci |
| **Pivot** | $995.87 | Pivot | Mevcut fiyat — middle band |
| **S1** | $950.00 | Destek | Düşüş trendi desteği |
| **S2** | $900.00 | Destek | Psikolojik destek — kritik |
| **S3** | $850.00 | Destek | 50MA seviyesi — kritik destek |
| **Fib 61.8%** | $920.00 | Retracement | Yükselişin %38.2 düzeltmesi |
| **Fib 50%** | $880.00 | Retracement | Yükselişin %50 düzeltmesi |
| **Fib 38.2%** | $840.00 | Retracement | Yükselişin %61.8 düzeltmesi |

> **MU Teknik Yorumu:** MU $1,080 (R3, Bollinger üst) direncine yaklaşıyor. Bu seviye aşılırsa ralli devam edebilir — call tarafı riski artar. $950 (S1) ilk destek — put tarafı için referans. $850 (S3, 50MA) kritik destek — bu seviye kırılırsa trend değişimi riski. Short call $1,200 ve short put $800 geniş breakeven'lar sunuyor — K.O. olasılığı ~78%. Ancak fiyat $995.87 çok yüksek — kontrat başına risk $7,079. Earnings Play formatında max hold 2 gün.

### F.11 INTC — Destek/Direnç ve Fibonacci

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $125.00 | Direnç | Bollinger üst bandı — kritik direnç |
| **R2** | $120.00 | Direnç | Psikolojik direnç |
| **R1** | $118.00 | Direnç | Yükseliş trendi direnci |
| **Pivot** | $116.96 | Pivot | Mevcut fiyat — middle band üstü |
| **S1** | $112.00 | Destek | Düşüş trendi desteği |
| **S2** | $105.00 | Destek | 50MA seviyesi — kritik destek |
| **S3** | $95.00 | Destek | 200MA seviyesi — kritik destek |
| **Fib 61.8%** | $110.00 | Retracement | Yükselişin %38.2 düzeltmesi |
| **Fib 50%** | $100.00 | Retracement | Yükselişin %50 düzeltmesi |
| **Fib 38.2%** | $90.00 | Retracement | Yükselişin %61.8 düzeltmesi |

> **INTC Teknik Yorumu:** INTC $125 (R3, Bollinger üst) direncine yaklaşıyor. Bu seviye aşılırsa ralli devam edebilir — call tarafı riski artar. $105 (S2, 50MA) kritik destek — bu seviye kırılırsa kısa vadeli trend negatif olur. $95 (S3, 200MA) kritik destek — bu seviye kırılırsa trend değişimi riski. Short call $140 ve short put $95 — put tarafı 200MA'ya dayanıyor, bu riskli. Put wing'i genişletmek düşünülebilir. Earnings Play formatında max hold 2 gün.

### F.12 PLTR — Destek/Direnç ve Fibonacci

| Seviye | Değer | Tür | Yorum |
|--------|-------|-----|-------|
| **R3** | $142.00 | Direnç | Bollinger üst bandı — kritik direnç |
| **R2** | $138.00 | Direnç | Psikolojik direnç |
| **R1** | $135.00 | Direnç | Yükseliş trendi direnci |
| **Pivot** | $131.08 | Pivot | Mevcut fiyat — middle band |
| **S1** | $125.00 | Destek | Düşüş trendi desteği |
| **S2** | $120.00 | Destek | 50MA seviyesi — kritik destek |
| **S3** | $110.00 | Destek | Düşüş trendi desteği — kritik |
| **Fib 61.8%** | $125.00 | Retracement | Yükselişin %38.2 düzeltmesi |
| **Fib 50%** | $115.00 | Retracement | Yükselişin %50 düzeltmesi |
| **Fib 38.2%** | $105.00 | Retracement | Yükselişin %61.8 düzeltmesi |

> **PLTR Teknik Yorumu:** PLTR $142 (R3, Bollinger üst) direncine yaklaşıyor. Bu seviye aşılırsa ralli devam edebilir — call tarafı riski artar. $120 (S2, 50MA) kritik destek — bu seviye kırılırsa kısa vadeli trend negatif olur. $110 (S3) psikolojik destek — short put $105 bu seviyeye yakın. Short call $160 ve short put $105 geniş breakeven'lar sunuyor — K.O. olasılığı ~82%. Ancak PLTR spekülatif — ani hareketlere karşı dikkatli olunmalı. Earnings Play formatında max hold 2 gün.

---

## Sonuç ve Özet (Earnings Play v2.1)

> **Teknoloji Sektörü Temmuz 2026 Earnings Stratejisi Özeti — EARNINGS PLAY FORMATI:**

Bu bölümde 12 teknoloji hissesi (AMD, TSLA, NFLX, NVDA, META, GOOGL, AAPL, AMZN, MSFT, MU, INTC, PLTR) için **Earnings Play (IV Crush) formatında** detaylı Iron Condor stratejileri, Greeks analizi, bütçe dostu alternatifler, IV Crush beklentileri, giriş-çıkış takvimleri, risk senaryoları, makro faktör etkileri, alternatif stratejiler, pozisyon yönetimi kuralları ve teknik analiz derinlemesine incelenmiştir. **Önceki sürümdeki "21 DTE çıkış", "Zamanla çıkış", "Ağustos'ta çıkış" gibi ifadeler tamamen düzeltilmiş ve Earnings Play formatı ile değiştirilmiştir.**

### Ana Tavsiyeler (Earnings Play v2.1)

1. **En İyi Earnings Play Adayı:** AMD (IV Rank %91.69, Theta +$1.85, Vega -$2.45, IV Crush %45-55, Max Hold 2 gün)
2. **En Temiz Giriş:** NFLX (FOMC'den uzak, K.O. ~84%, kontrat başına risk sadece $563, Max Hold 1 gün)
3. **En Yüksek Günlük Kazanç:** MU (Theta +$2.12, kredi $28.20, Max Hold 2 gün)
4. **En Düşük Risk:** AAPL (Beta 1.086, Gamma -0.02, stabil, Max Hold 1 gün)
5. **Marjinal IC:** MSFT (IV Rank %50, Long Call Spread tercih et, Max Hold 1 gün)
6. **En Riskli Çakışma:** META (Earnings 29 Temmuz + FOMC 28-29 Temmuz. Aynı gün! Max Hold 1 gün)
7. **Yeni Eklenen Fırsatlar:** MU (bellek çipi döngüsü), INTC (fabrikasyon stratejisi), PLTR (AI ve devlet sözleşmeleri)
8. **Güncel Fiyat Düşüşleri:** TSLA ($409→$386.88), META ($585→$561.48), GOOGL ($363→$348.02), MSFT ($412→$386.73) — Put tarafı riski artabilir, entry'de dikkatli olun.

### Earnings Play Pozisyon Yönetimi Özeti

| Kural | Özet |
|-------|------|
| **Entry** | IV Rank > %50, VIX < 40, Earnings'ten 2-5 gün önce |
| **Boyut** | Beta > 2.0 = %1, Beta < 1.5 = %1.5-2 |
| **Wing** | Fiyat / 10, EM %10-15 dışı |
| **Kar** | %50-75 kredi hedefi, agresif takip |
| **Stop** | 200% kredi, disiplinli uygula |
| **Exit** | Earnings sonrası 1-2 gün (BMO: aynı gün/ertesi, AMC: ertesi) |
| **Max Hold** | **2 GÜN — ⛔ TUTMA YASAK** |
| **FOMC** | Çakışan hisselerde yarım pozisyon, hızlı çıkış |

### Earnings Play Risk Uyarıları (v2.1)

Teknoloji sektörü yüksek beta ve yüksek volatilite nedeniyle Earnings Play stratejileri yüksek risk taşır. FOMC (28-29 Temmuz) ile earnings çakışması ekstra risk oluşturur. Pozisyon boyutu, stop-loss ve kar hedefleri önceden belirlenmeli ve disiplinle uygulanmalıdır. **En önemli kural: Earnings play'ler 2 günden fazla tutulmaz. Bu kurala sadık kalmak başarının anahtarıdır.** Geçmiş performans gelecek performansın garantisi değildir. Kaybetmeyi göze alamayacağınız miktarla işlem yapmayın.

---

*Bu bölüm 12 Haziran 2026 verileri ile güncellenmiştir. Güncel fiyatlar: TSLA $386.88, META $561.48, GOOGL $348.02, AAPL $293.60, AMZN $237.21, MSFT $386.73. Fiyatlar, IV değerleri ve teknik göstergeler piyasa koşullarına göre değişebilir. Her işlem öncesi güncel veriler kontrol edilmelidir.*

*EarningsPlay v4 Skill'i referans alınmıştır. Bu bölüm v2.1 sürümüdür ve tamamen Earnings Play (IV Crush) formatında yeniden yazılmıştır. Önceki sürümdeki hatalı çıkış mantıkları (21 DTE, zamanla çıkış, Ağustos çıkışı) düzeltilmiştir.*

*Risk Uyarısı: Opsiyon ticareti yüksek risk içerir. Kaybetmeyi göze alamayacağınız miktarla işlem yapmayın. Geçmiş performans gelecek performansın garantisi değildir.*

---

**Bölüm 2 Sonu — Teknoloji Hisseleri Stratejileri (Earnings Play v2.1)**
