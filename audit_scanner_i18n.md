# Gistify Scanner i18n/Dil Denetim Raporu

> **Tarih:** 2026-06-25  
> **Dizin:** `client/src/scanner/`  
> **Dosya sayısı:** 35+ (.ts / .tsx)  
> **Denetim tipi:** EN/TR dil switch mekanizması kontrolü

---

## 📊 Özet

| Kategori | Sayı |
|----------|------|
| **Hardcoded Türkçe metin (UI'a yansıyan)** | 45+ |
| **Hardcoded İngilizce metin (UI'a yansıyan)** | 18+ |
| **copy() kullanımı eksik / yanlış** | 12+ |
| **useAppLanguage() tutarsız kullanım** | 1 |
| **Eksik locale çevirisi (en.ts / tr.ts)** | 40+ |
| **Lib dosyalarında i18n yok** | Tüm lib dosyaları |

---

## 🚨 KRİTİK SORUNLAR

### 1. `getScanTimingWarning()` — Hardcoded Türkçe mesajlar (Kritik)

`momentum.ts` içindeki `getScanTimingWarning()` fonksiyonu `ScannerPage.tsx` Satır 135'te doğrudan kullanılıyor ve **hiçbir zaman İngilizce dönmüyor**.

```
DOSYA: client/src/scanner/lib/momentum.ts
SATIR: 266-272
TIP: hardcoded_text
METIN: "⏰ Piyasa henüz açılmadı (09:30 EST). En erken 10:00 EST'de tarayın."
ONERI: copy() ile sarmala veya locale dosyasına ekle: t("timing.notOpen")
```

```
DOSYA: client/src/scanner/lib/momentum.ts
SATIR: 269
TIP: hardcoded_text
METIN: "⏰ Piyasa yeni açıldı (${min} dk). 30dk dolmadan ORB kırılım testi anlamsız. 10:00 EST'yi bekleyin."
ONERI: copy() ile sarmala veya locale dosyasına ekle
```

```
DOSYA: client/src/scanner/lib/momentum.ts
SATIR: 270
TIP: hardcoded_text
METIN: "⚠️ Piyasa ${min} dk açık. İdeal tarama: 10:00-10:30 EST arası."
ONERI: copy() ile sarmala veya locale dosyasına ekle
```

**Etki:** `ScannerPage.tsx` Satır 135'teki `timingWarning` badge her dilde Türkçe görünür.

---

### 2. `signalLabel()` — Hardcoded Türkçe sinyal etiketleri (Kritik)

`scoreConfig.ts` içindeki `signalLabel()` fonksiyonu `ScannerPage.tsx` Satır 319'da doğrudan kullanılıyor ve **copy() ile sarmalanmamış**.

```
DOSYA: client/src/scanner/lib/scoreConfig.ts
SATIR: 285-298
TIP: hardcoded_text
METIN: "🚨 AŞIRI ALIM - KESİNLİKLE GİRME!"
ONERI: Bu fonksiyon copy() kullanmalı veya locale dosyasına taşınmalı. ScannerPage.tsx Satır 319'da {signalLabel(stock.signal)} doğrudan çağrılıyor.
```

```
DOSYA: client/src/scanner/lib/scoreConfig.ts
SATIR: 288
TIP: hardcoded_text
METIN: "⚠️ SICAK BÖLGE - DİKKAT"
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/scoreConfig.ts
SATIR: 289
TIP: hardcoded_text
METIN: "⚠️ AŞIRI SATIM - RİSKLİ"
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/scoreConfig.ts
SATIR: 290
TIP: hardcoded_text
METIN: "GÜÇLÜ AL"
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/scoreConfig.ts
SATIR: 291
TIP: hardcoded_text
METIN: "AL"
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/scoreConfig.ts
SATIR: 292
TIP: hardcoded_text
METIN: "NÖTR-POZİTİF"
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/scoreConfig.ts
SATIR: 293
TIP: hardcoded_text
METIN: "NÖTR"
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/scoreConfig.ts
SATIR: 294
TIP: hardcoded_text
METIN: "NÖTR-NEGATİF"
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/scoreConfig.ts
SATIR: 295
TIP: hardcoded_text
METIN: "ZAYIF"
ONERI: copy() ile sarmala
```

**Etki:** Tüm sinyal etiketleri (signal badge) İngilizce modda bile Türkçe görünür.

---

### 3. `buildExplanations()` — Türkçe/İngilizce karışık açıklamalar (Kritik)

`momentum.ts` içindeki `buildExplanations()` fonksiyonu `scoreExplanations` üretiyor. Bu veri `ScannerPage.tsx` Satır 433'te doğrudan gösteriliyor (`explanation.reason` ve `explanation.detail`).

```
DOSYA: client/src/scanner/lib/momentum.ts
SATIR: 365-450
TIP: hardcoded_text
METIN: "Hacim patlaması - çok güçlü ilgi" / "Yüksek hacim - güçlü ilgi" / "Normal hacim" / "Düşük hacim"
ONERI: Tüm buildExplanations() reason/detail string'leri locale dosyasına taşınmalı. Bu veriler ScannerPage.tsx'de doğrudan render ediliyor.
```

Örnek Türkçe metinler:
- `"Hacim patlaması - çok güçlü ilgi"`
- `"Yüksek hacim - güçlü ilgi"`
- `"İdeal GAP aralığı"` / `"Geniş GAP - dikkat"`
- `"Güçlü ORB kırılımı"` / `"ORB kırılımı"` / `"Zayıf ORB"`
- `"Güçlü VWAP üstü + yükselen"` / `"VWAP üstünde"` / `"VWAP altında"`
- `"Higher Highs + Higher Lows"` (İngilizce)
- `"Optimum RSI aralığı"` / `"Aşırı alım yakını"` / `"Nötr RSI"` / `"Zayıf RSI"`
- `"Güçlü yukarı momentum"` / `"Pozitif yön"` / `"Zayıf yön"` / `"Negatif yön"`
- `"Yüksek volatilite"` / `"Normal volatilite"` / `"Düşük volatilite"`
- `"Mega cap - yüksek likidite"` / `"Large cap - iyi likidite"` / `"Düşük market cap"`
- `"Mükemmel tutma"` / `"İyi tutma"` / `"Zayıf tutma"`
- `"Güçlü günlük kazanç"` / `"İyi günlük kazanç"` / `"Hafif pozitif"` / `"Negatif/flat"`

**Etki:** Expanded row detay panelindeki tüm skor açıklamaları karışık dilde görünür.

---

### 4. `rsiWarning` — Hardcoded Türkçe uyarı mesajları (Kritik)

`momentum.ts` Satır 663-671'de üretilen `rsiWarning` mesajları `ScannerPage.tsx` Satır 457'de doğrudan gösteriliyor.

```
DOSYA: client/src/scanner/lib/momentum.ts
SATIR: 665
TIP: hardcoded_text
METIN: "🚨 RSI ${rsi14.toFixed(1)} = AŞIRI ALIM! Bu hisse çok tehlikeli. Geri çekilme an meselesi. KESİNLİKLE girmeyin."
ONERI: copy() ile sarmala veya locale dosyasına ekle
```

```
DOSYA: client/src/scanner/lib/momentum.ts
SATIR: 668
TIP: hardcoded_text
METIN: "⚠️ RSI ${rsi14.toFixed(1)} = SICAK BÖLGE. Momentum yüksek ama geri çekilme riski çok yüksek. Stop-loss şart, küçük pozisyon."
ONERI: copy() ile sarmala veya locale dosyasına ekle
```

```
DOSYA: client/src/scanner/lib/momentum.ts
SATIR: 671
TIP: hardcoded_text
METIN: "⚠️ RSI ${rsi14.toFixed(1)} = AŞIRI SATIM. Dönüş potansiyeli var ama yakalanan bıçağa dikkat."
ONERI: copy() ile sarmala veya locale dosyasına ekle
```

---

### 5. `earnWarn` — Earnings uyarısı (Kritik)

```
DOSYA: client/src/scanner/lib/momentum.ts
SATIR: 653-654
TIP: hardcoded_text
METIN: "⚠️ ${data.ticker} yakın zamanda kazanç açıklayabilir. IV crush riskine dikkat edin."
ONERI: copy() ile sarmala veya locale dosyasına ekle
```

---

## ⚠️ ORTA SEVİYE SORUNLAR

### 6. `useAppLanguage()` Tutarsız Kullanım

```
DOSYA: client/src/scanner/components/MomentumMarketTab.tsx
SATIR: 103, 154, 218
TIP: wrong_usage
METIN: "const language = useAppLanguage();"
ONERI: Bileşen zaten `language: AppLanguage` prop alıyor (Satır 269). İç fonksiyonlarda `useAppLanguage()` yerine prop'tan gelen `language` kullanılmalı. Bu tutarsızlık dil switch'in yanlış çalışmasına neden olabilir.
```

**Etki:** `MacroStack`, `MoversStack`, `HavenStack` fonksiyonları global hook yerine prop kullanmıyor.

---

### 7. `ScannerPage.tsx` — Hardcoded hata mesajı

```
DOSYA: client/src/scanner/components/ScannerPage.tsx
SATIR: 96
TIP: hardcoded_text
METIN: "Scan failed"
ONERI: copy(lang, "Tarama basarisiz", "Scan failed") seklinde değiştir
```

---

### 8. `OptionStrategyPanel.tsx` — Hardcoded İngilizce etiketler

```
DOSYA: client/src/scanner/components/OptionStrategyPanel.tsx
SATIR: 361
TIP: hardcoded_text
METIN: "Max Risk"
ONERI: copy(language, "Maks Risk", "Max Risk") seklinde değiştir
```

```
DOSYA: client/src/scanner/components/OptionStrategyPanel.tsx
SATIR: 372
TIP: hardcoded_text
METIN: "Breakeven"
ONERI: copy(language, "Kirilim", "Breakeven") seklinde değiştir
```

```
DOSYA: client/src/scanner/components/OptionStrategyPanel.tsx
SATIR: 385
TIP: hardcoded_text
METIN: "Kelly Sizing"
ONERI: copy(language, "Kelly Boyutu", "Kelly Sizing") seklinde değiştir
```

```
DOSYA: client/src/scanner/components/OptionStrategyPanel.tsx
SATIR: 400
TIP: hardcoded_text
METIN: "Expected Move"
ONERI: copy(language, "Beklenen Hareket", "Expected Move") seklinde değiştir
```

```
DOSYA: client/src/scanner/components/OptionStrategyPanel.tsx
SATIR: 410
TIP: hardcoded_text
METIN: "Spread Width"
ONERI: copy(language, "Spread Genisligi", "Spread Width") seklinde değiştir
```

```
DOSYA: client/src/scanner/components/OptionStrategyPanel.tsx
SATIR: 413
TIP: hardcoded_text
METIN: "R-Adj Return"
ONERI: copy(language, "R-Adj Getiri", "R-Adj Return") seklinde değiştir
```

---

### 9. `EnterpriseReport.tsx` — Hardcoded İngilizce etiketler

```
DOSYA: client/src/scanner/components/EnterpriseReport.tsx
SATIR: 70
TIP: hardcoded_text
METIN: "Term Structure"
ONERI: copy(language, "Vade Yapisi", "Term Structure") seklinde değiştir
```

```
DOSYA: client/src/scanner/components/EnterpriseReport.tsx
SATIR: 247
TIP: hardcoded_text
METIN: "Earnings Gap"
ONERI: copy(language, "Kazanc Gap'i", "Earnings Gap") seklinde değiştir
```

```
DOSYA: client/src/scanner/components/EnterpriseReport.tsx
SATIR: 251
TIP: hardcoded_text
METIN: "Liquidity"
ONERI: copy(language, "Likidite", "Liquidity") seklinde değiştir
```

---

### 10. `MomentumSetupsTab.tsx` — Hardcoded İngilizce etiketler

```
DOSYA: client/src/scanner/components/MomentumSetupsTab.tsx
SATIR: 96
TIP: hardcoded_text
METIN: "Risk"
ONERI: copy(language, "Risk", "Risk") seklinde değiştir (veya locale'a ekle)
```

```
DOSYA: client/src/scanner/components/MomentumSetupsTab.tsx
SATIR: 228
TIP: hardcoded_text
METIN: "Defensive"
ONERI: SetupStat label prop'u copy() ile sarmalanmamış. copy(language, "Defansif", "Defensive") kullan
```

---

## 🔧 LIB DOSYALARINDAKİ SORUNLAR (UI'a dolaylı yansıyan)

### 11. `optionsStrategies.ts` — Strateji isimleri ve notlar

```
DOSYA: client/src/scanner/lib/optionsStrategies.ts
SATIR: 66-121
TIP: hardcoded_text
METIN: STRATEGIES nesnesinde name/nameTr alanları. OptionStrategyPanel.tsx Satır 342'de strategy.name kullanılıyor.
ONERI: OptionStrategyPanel.tsx'de strategy.name yerine copy(language, strategy.nameTr, strategy.name) kullan
```

```
DOSYA: client/src/scanner/lib/optionsStrategies.ts
SATIR: 250-251
TIP: hardcoded_text
METIN: entryNotes.push("Vade kontrolü nedeniyle strateji önerisi RED"); entryNotes.push(`DTE: ${daysToExpiration} gün — Minimum 3 gün gerekli`);
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/optionsStrategies.ts
SATIR: 255-289
TIP: hardcoded_text
METIN: entryNotes.push("Güçlü momentum sinyali"); entryNotes.push("Orta momentum - korunmalı strateji"); entryNotes.push("Düşük konfidans - konservatif"); entryNotes.push("Önce izleyin, onay bekleyin"); entryNotes.push("Yüksek volatilite - yön bağımsız"); entryNotes.push("Çift prim maliyeti"); entryNotes.push("Düşük konfidans - konservatif");
ONERI: Tüm entryNotes ve riskWarnings string'leri copy() ile sarmalanmalı
```

```
DOSYA: client/src/scanner/lib/optionsStrategies.ts
SATIR: 300-304
TIP: hardcoded_text
METIN: riskWarnings.push("🚨 RSI aşırı alım (>80) — KESİNLİKLE yeni pozisyon AÇMA"); riskWarnings.push("RSI RED filtresi aktif, skor sıfırlandı"); riskWarnings.push("⚠️ RSI sıcak bölge (75-80) — Stop-loss şart, küçük pozisyon");
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/optionsStrategies.ts
SATIR: 307-311
TIP: hardcoded_text
METIN: Earnings sonrası IV crush yaşanabilir — vade earnings'den SONRA
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/optionsStrategies.ts
SATIR: 316-318
TIP: hardcoded_text
METIN: "Premium satışı" / "Premium alımı" / "Nötr" / "IV yüksek, credit spread mantıklı" / "IV düşük, long premium mantıklı" / "IV ortalama"
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/optionsStrategies.ts
SATIR: 328-332
TIP: hardcoded_text
METIN: ivRecText içindeki karışık TR/EN metinler
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/optionsStrategies.ts
SATIR: 380-388
TIP: hardcoded_text
METIN: checkDaysToExpiration warning mesajları: "🚨 Sadece ${daysToExpiration} gün kaldı! Theta decay maksimum, pin riski yüksek. KAPAT." / "⚠️ Sadece ${daysToExpiration} gün kaldı. Son hafta gamma riski çok yüksek. Yeni pozisyon AÇMA." / "⚠️ ${daysToExpiration} gün kaldı. 14 DTE time stop yaklaşıyor."
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/optionsStrategies.ts
SATIR: 450-559
TIP: hardcoded_text
METIN: buildCallSetup / buildPutSetup fonksiyonlarındaki reason, pdtNote, entryCondition, takeProfit, stopCondition, kellySize alanları Türkçe/İngilizce karışık
ONERI: Tüm bu string'ler copy() ile sarmalanmalı veya locale dosyasına taşınmalı
```

---

### 12. `v4Engine.ts` — v4.0 rapor metinleri

```
DOSYA: client/src/scanner/lib/v4Engine.ts
SATIR: 227-228
TIP: hardcoded_text
METIN: rationale: `Skor ${stock.finalScore}/100${ivAdj}. POP %${metrics.pop.popPercent}. Breakeven $${metrics.breakeven} (%${((metrics.breakeven / stock.price - 1) * 100).toFixed(1)} OTM).`
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/v4Engine.ts
SATIR: 253-256
TIP: hardcoded_text
METIN: ifFails: "BACKWARDATION: IV patlaması + put skew artışı. Strike'a assignment riski yüksek." / "IV crush veya yön değişirse zarar. 2x kredi stop ile korun."
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/v4Engine.ts
SATIR: 307-315
TIP: hardcoded_text
METIN: executionRules array: "1. Midpoint limit emir (piyasa emiri YASAK)", "2. Slippage ≤%5 (üzerinde RED)", "3. Giriş: 10:30-11:30 EDT (OPTIMAL/MID penceresi)", "4. Kelly sizing: Edge'e göre, max NLV %2", "5. %50 kar al → yarısını kapat", "6. 21 DTE roll, 14 DTE time stop", "7. 2x kredi = stop loss", "8. Portföy ısısı %5 → yeni işlem DURUR"
ONERI: Tüm executionRules string'leri copy() ile sarmalanmalı
```

```
DOSYA: client/src/scanner/lib/v4Engine.ts
SATIR: 295-297
TIP: hardcoded_text
METIN: priorities: "PORTFÖY ISI ${heat.heatPct}% ≥ %5 → Yeni işlem YASAK" / "BACKWARDATION → Credit spread YASAK" / "VIX ${regime.vixLevel}: Premium zengini — disiplin ile fırsat"
ONERI: copy() ile sarmala
```

---

### 13. `regimeDetector.ts` — Rejim açıklamaları

```
DOSYA: client/src/scanner/lib/regimeDetector.ts
SATIR: 65-111
TIP: hardcoded_text
METIN: regimeRules note alanları: "⚠️ BACKWARDATION: Credit spread SATMA. Long premium tercih et. Pozisyon yarıya." / "🚨 VIX 35+: Credit spread sat (IV zirvede), long premium AÇMA, vade 30 gün max." / "⚠️ VIX 25+: Credit spread tercih edilebilir, short vol mantıklı." / "✅ VIX normal. Standart stratejiler uygulanabilir." / "⚠️ VIX düşüş trendinde. Short vol risk artıyor, hedge düşün." / "🔥 VIX 12-: Aşırı complacent! Short vol DARBOĞAZ riski. Long vol hedge şart."
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/regimeDetector.ts
SATIR: 260-270
TIP: hardcoded_text
METIN: regimeDescription fonksiyonu: "Credit Spread: ✅ İzinli / ❌ YASAK", "Long Premium: ✅ İzinli / ❌ YASAK", "Max DTE: ${regime.maxDteRecommendation} gün"
ONERI: copy() ile sarmala
```

---

### 14. `executionRules.ts` — Yönetim kuralları

```
DOSYA: client/src/scanner/lib/executionRules.ts
SATIR: 118-144
TIP: hardcoded_text
METIN: createManagementRules actions: trigger ve action alanları Türkçe ("Kâr >= %50", "TAKE_PROFİT: Pozisyonun %50'sini kapat", "Zarar >= 2x kredi", "CLOSE: Pozisyonu tamamen kapat", "DTE <= 21 gün", "ROLL: Sonraki aya aynı striplere taşı veya kapat", "DTE <= 14 gün (son çare)", "CLOSE: Vade riski çok yüksek, pozisyonu kapat", "Underlying short strike'a dokunursa", "ADJUST: Strike'leri uzaklaştır veya pozisyonu kapat")
ONERI: Tüm action/trigger string'leri copy() ile sarmalanmalı
```

```
DOSYA: client/src/scanner/lib/executionRules.ts
SATIR: 183-190
TIP: hardcoded_text
METIN: WINDOW_PROFILES label ve reason alanları: "09:30 Açılış", "10:00 Erken", "10:30 Optimal", "11:00 Altın Saat", "12:00 Öğlen", "14:00 Öğleden Sonra", "15:30 Kapanış" + nedenler
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/executionRules.ts
SATIR: 259-266
TIP: hardcoded_text
METIN: createExecutionPlan notes: "v4.0 Limit emir: $${midPrice} (midpoint)", "Slippage: %${effectiveSlippage} ${isSafe ? '✅ ≤%5 kabul' : '❌ >%5 RED'}", "09:30 AÇILIŞTA market emir KESİNLİKLE yok — slippage %15+", "15:30 KAPANIŞTA market emir yok — MOC riski", "v4.0 Kural: Midpoint limit + Slippage ≤%5 + ${rec.profile.label} penceresi"
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/executionRules.ts
SATIR: 292-367
TIP: hardcoded_text
METIN: determineAction fonksiyonu: action, reason, details alanları Türkçe ("KÂR REALİZE ET — Pozisyonun %50'sini kapat", "POZİSYONU KAPAT — Zarar limit aşıldı", "ROLL DÜŞÜN — Sonraki aya taşı veya kapat", "KAPAT — Vade sonu yaklaştı", "HEDGE DÜŞÜN — Strike'a çok yaklaşıldı", "ZARARI KABUL ET — IV crush bitmeden kapat", "TUT — Henüz aksiyon gerekmez")
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/executionRules.ts
SATIR: 406-421
TIP: hardcoded_text
METIN: riskNotification mesajları: "🚨 Toplam risk $${Math.round(totalPortfolioRisk)} (NLV'nin %${riskPct.toFixed(1)}'i) > %10 limit!" / "⚠️ Toplam risk $${Math.round(totalPortfolioRisk)} (NLV'nin %${riskPct.toFixed(1)}'i) — Dikkat" / "⚠️ Total Vega $${Math.round(totalVega)} > limit $${Math.round(vegaLimit)} → IV hareketine aşırı duyarlı" / "🚨 ${maxSector[0]} sektöründe ${maxSector[1]} pozisyon → Tek sektöre %${(maxSector[1] / positions.length * 100).toFixed(0)} bet" / "⚠️ Teknoloji bet'i: ${names} → SPY/Q düşerse hepsi zarar eder" / "⚠️ ${highBeta.length} yüksek beta hisse (β>1.5) → Piyasa düşerse amplifiye kayıp"
ONERI: copy() ile sarmala
```

---

### 15. `scoreConfig.ts` — FACTOR_LABELS ve portfolioHeatCheck

```
DOSYA: client/src/scanner/lib/scoreConfig.ts
SATIR: 216-228
TIP: hardcoded_text
METIN: FACTOR_LABELS: "RVOL (Göreceli Hacim)", "GAP Kalitesi", "ORB (Açılış Kırılım)", "VWAP Pozisyon/Eğim", "Fiyat Yapısı (HH/HL)", "RSI Kısa Vade", "Velocity Yön", "Velocity Volatilite", "Piyasa Değeri", "Intraday Retention", "Günlük Değişim"
ONERI: Bu etiketler ScannerPage.tsx Satır 429'da doğrudan gösteriliyor (explanation.factor). copy() ile sarmalanmalı veya locale dosyasına taşınmalı.
```

```
DOSYA: client/src/scanner/lib/scoreConfig.ts
SATIR: 122-136
TIP: hardcoded_text
METIN: portfolioHeatCheck mesajları: "PORTFÖY ISI ${heatPct.toFixed(1)}% ≥ %5 LİMİT! Yeni işlem YASAK. Önce pozisyon küçült." / "UYARI: Portföy ısısı ${heatPct.toFixed(1)}% — Yakında %5 limit. Çok küçük pozisyon." / "Portföy ısısı ${heatPct.toFixed(1)}% — Güvenli bölgede."
ONERI: copy() ile sarmala
```

---

### 16. `consistencyReport.ts` — Rapor metinleri

```
DOSYA: client/src/scanner/lib/consistencyReport.ts
SATIR: 507-513
TIP: hardcoded_text
METIN: generateEmptyReport: "Yetersiz veri. Backtest çalıştırılmamış veya hiç trade üretilmemiş." / "Veri yok" / "Önce backtest çalıştırın."
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/consistencyReport.ts
SATIR: 463-465
TIP: hardcoded_text
METIN: buildSummary: "Sistem tutarlılık notu: ${grade} (${score}/100). Genel win rate %${wr.overallWinRate}. ${wr.isConsistent ? 'Aylık performans tutarlı.' : 'Aylık performans dalgalanmaları mevcut.'} Skor-P&L korelasyonu r=${corr.pearsonR}. Sharpe ratio ${risk.sharpeRatio}. İşlem başı beklenen getiri ${risk.expectancy}%."
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/consistencyReport.ts
SATIR: 468-501
TIP: hardcoded_text
METIN: buildRecommendations: Tüm öneri metinleri Türkçe
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/consistencyReport.ts
SATIR: 225-237, 273-278, 310-314, 372-410
TIP: hardcoded_text
METIN: analyzeWinRateConsistency, analyzeScorePnLCorrelation, analyzeDailyConsistency, analyzeFactors: Tüm interpretation/streakAnalysis/rvolEffect/rsiEffect string'leri Türkçe
ONERI: copy() ile sarmala
```

---

### 17. `pdtAnalyzer.ts` — PDT analiz metinleri

```
DOSYA: client/src/scanner/lib/pdtAnalyzer.ts
SATIR: 335-355
TIP: hardcoded_text
METIN: buildSummary: "${ticker} $${tech.priceChangePercent >= 0 ? '+' : ''}${tech.priceChangePercent.toFixed(2)}% ile ${tech.trend === 'UPTREND' ? 'yükseliş trendinde' : tech.trend === 'DOWNTREND' ? 'düşüş trendinde' : 'yana hareket ediyor'}." / "Call sinyali ${call.signal === 'STRONG_BUY' ? 'GÜÇLÜ AL' : 'AL'} — ${call.strategy} ile %${call.targetMove} hedef." / "Put sinyali ${put.signal === 'STRONG_BUY' ? 'GÜÇLÜ AL' : 'AL'} — ${put.strategy} ile %${call.targetMove} hedef." / "Her iki yönde de sinyal zayıf — BEKLE." / "Gecelik tutma riski ${pdt.overnightRisk === 'LOW' ? 'DÜŞÜK' : pdt.overnightRisk === 'MEDIUM' ? 'ORTA' : 'YÜKSEK'}.${pdt.earningsWarning ? ' Earnings yakın — DİKKAT!' : ''}"
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/pdtAnalyzer.ts
SATIR: 404-447
TIP: hardcoded_text
METIN: call/put nesneleri: entryCondition, pdtNote, takeProfit, stopCondition, maxLoss, kellySize alanları Türkçe/İngilizce karışık
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/pdtAnalyzer.ts
SATIR: 456-469
TIP: hardcoded_text
METIN: catalysts ve riskFactors dizileri: "Yüksek hacimli momentum devami", "ORB kirilimi devami", "Yükselen trend destegi", "Düsüs trendi devami", "Güclü gunlük momentum", "Teknik seviyelerde hareket beklentisi", "Yüksek ATR — gecelik sapma riski", "RSI asiri alim — geri cekilme olasiligi", "RSI asiri satim — dead cat bounce riski", "Hacim patlamasi sonrasi yorgunluk", "Genel piyasa riski"
ONERI: copy() ile sarmala
```

---

### 18. `advancedOptions.ts` — Strateji önerileri

```
DOSYA: client/src/scanner/lib/advancedOptions.ts
SATIR: 52-85
TIP: hardcoded_text
METIN: recommendStrike rationale: "Fiyat hedefe yakın. ATM seçmek en yüksek delta ve en iyi risk/ödül dengesi sağlar." / "Hedefe %2-4 mesafe var. Hafif OTM prim maliyetini düşürür, hâlâ güçlü delta sağlar." / "Hedef uzak. Agresif OTM ucuz prim sunar ama kazanma olasılığı daha düşüktür."
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/advancedOptions.ts
SATIR: 98-135
TIP: hardcoded_text
METIN: recommendExpiry label ve rationale: "2 haftalık vade", "Yüksek volatilite rejimi. Uzun vade seçerek theta kaybını sınırlayın ve fırsat penceresini genişletin." / "Haftalık (Cuma) vade", "Düşük volatilite rejimi. Kısa vade ile gamma'dan faydalanın; hareket beklentisi yüksek." / "Gelecek hafta + 3 gün (~10 gün)", "Hafta ortası/sonu yaklaştığında bir sonraki haftanın sonuna kadar vade seçin." / "Bu hafta sonu (Cuma) vade", "Hafta başındayız, Cuma vadeli opsiyon uygun."
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/advancedOptions.ts
SATIR: 206-213
TIP: hardcoded_text
METIN: buildCompleteRecommendation notes: "ATM/OTM: ${strikeRec.type} (${strikeRec.deltaRange} delta)", "Vade: ${expiryRec.label} (~${expiryRec.recommendedDte} gün)", "Maksimum ${positionSizing.maxContracts} kontrat (${positionSizing.maxPremium}$ prim)", "Hedef: $${targetPrice} / Durdurma: $${stopLossPrice}"
ONERI: copy() ile sarmala
```

---

### 19. `sanityGate.ts` — Validasyon mesajları

```
DOSYA: client/src/scanner/lib/sanityGate.ts
SATIR: 51-55, 84-88, 98-105
TIP: hardcoded_text
METIN: validateFactorScores ve sanityGate issues: "Faktör \"${key}\" güvensiz değer: ${val} → 50" / "Faktör \"${key}\" aralık dışı: ${val.toFixed(2)} → clamp" / "[SanityGate] ${key} = ${String(val)} (NaN/Infinity/null) → 50" / "[SanityGate] ${key} = ${val.toFixed(2)} (aralık dışı) → clamp" / "[SanityGate] Ağırlık ${key} = ${String(w)} → 0" / "[SanityGate] Ağırlık toplamı = ${weightSum.toFixed(4)} (normalizasyon uygulanıyor)"
ONERI: copy() ile sarmala
```

```
DOSYA: client/src/scanner/lib/sanityGate.ts
SATIR: 152-193
TIP: hardcoded_text
METIN: validateYahooResponse ve validateCandleData error mesajları: "Yanıt JSON değil", "Yahoo API hatası: ${...}", "Geçersiz yanıt yapısı (chart.result eksik)", "Meta verisi eksik veya geçersiz", "Fiyat verisi eksik", "Timestamp verisi eksik", "Yetersiz veri: ${total} gün (minimum 20)", "Yetersiz timestamp: ${timestamps?.length ?? 0}", "Yetersiz close verisi: ${close?.length ?? 0}", "Yetersiz volume verisi: ${volume?.length ?? 0}", "Array uzunlukları uyuşmuyor: ...", "Çok fazla geçersiz close değeri: ${invalidClose.length}/${close.length}"
ONERI: copy() ile sarmala
```

---

### 20. `backtestEngine.ts` — Gün isimleri

```
DOSYA: client/src/scanner/lib/backtestEngine.ts
SATIR: 503
TIP: hardcoded_text
METIN: const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
ONERI: copy() ile sarmala veya locale dosyasına taşı
```

---

### 21. `portfolioRisk.ts` — Korelasyon uyarıları

```
DOSYA: client/src/scanner/lib/portfolioRisk.ts
SATIR: 109-123
TIP: hardcoded_text
METIN: correlationCheck: "🚨 ${maxSector[0]} sektöründe ${maxSector[1]} pozisyon → Tek sektöre %${(maxSector[1] / positions.length * 100).toFixed(0)} bet" / "⚠️ Teknoloji bet'i: ${names} → SPY/Q düşerse hepsi zarar eder" / "⚠️ ${highBeta.length} yüksek beta hisse (β>1.5) → Piyasa düşerse amplifiye kayıp"
ONERI: copy() ile sarmala
```

---

## 📋 EKSİK LOCALE ÇEVİRİLERİ (en.ts / tr.ts)

Mevcut `locales/en.ts` ve `tr.ts` dosyalarında **80 çeviri** var. Ancak aşağıdaki kritik string'ler **eksik**:

| Eksik Anahtar | Kullanıldığı Yer | Öneri |
|---------------|------------------|-------|
| `RSI` | ScannerPage.tsx:287 | Zaten aynı kalabilir (jargon) |
| `Scan failed` | ScannerPage.tsx:96 | Ekle: `"Tarama basarisiz": "Scan failed"` |
| `Raporu Gizle` | ScannerPage.tsx:169 | Ekle |
| `Kurumsal Rapor` | ScannerPage.tsx:170 | Ekle |
| `analiz ediliyor` | ScannerPage.tsx:218 | Ekle |
| `Tarama evreni isleniyor.` | ScannerPage.tsx:219 | Ekle |
| `Universe is being scanned.` | ScannerPage.tsx:219 | Ekle |
| `Acilis ivmesi radar paneli` | ScannerPage.tsx:229 | Ekle |
| `Premarket and opening-drive radar` | ScannerPage.tsx:229 | Ekle |
| `Tarayici 60 likit hisseyi...` | ScannerPage.tsx:234 | Ekle |
| `Evren: 60 hisse` | ScannerPage.tsx:241 | Ekle |
| `Universe: 60 names` | ScannerPage.tsx:241 | Ekle |
| `Ana veri: Yahoo` | ScannerPage.tsx:244 | Ekle |
| `Primary feed: Yahoo` | ScannerPage.tsx:244 | Ekle |
| `KIRMIZI` | ScannerPage.tsx:323 | Ekle |
| `RED` | ScannerPage.tsx:323 | Ekle |
| `Risk` | MomentumSetupsTab.tsx:96 | Ekle |
| `Defensive` / `Defansif` | MomentumSetupsTab.tsx:228 | Ekle |
| `Max Risk` | OptionStrategyPanel.tsx:361 | Ekle |
| `Breakeven` | OptionStrategyPanel.tsx:372 | Ekle |
| `Kelly Sizing` | OptionStrategyPanel.tsx:385 | Ekle |
| `Expected Move` | OptionStrategyPanel.tsx:400 | Ekle |
| `Spread Width` | OptionStrategyPanel.tsx:410 | Ekle |
| `R-Adj Return` | OptionStrategyPanel.tsx:413 | Ekle |
| `Term Structure` | EnterpriseReport.tsx:70 | Ekle |
| `Earnings Gap` | EnterpriseReport.tsx:247 | Ekle |
| `Liquidity` | EnterpriseReport.tsx:251 | Ekle |
| `Timing Warning` | momentum.ts:266 | Ekle (3 varyasyon) |
| `Signal Labels` | scoreConfig.ts:285 | Ekle (9 sinyal) |
| `Score Explanations` | momentum.ts:365 | Ekle (~40 farklı metin) |
| `RSI Warnings` | momentum.ts:663 | Ekle (3 varyasyon) |
| `Earnings Warning` | momentum.ts:654 | Ekle |
| `Execution Rules` | v4Engine.ts:307 | Ekle (8 kural) |
| `Priorities` | v4Engine.ts:295 | Ekle (3 mesaj) |
| `Regime Notes` | regimeDetector.ts:65 | Ekle (6 rejim) |
| `Management Actions` | executionRules.ts:118 | Ekle (5 aksiyon) |
| `Window Profiles` | executionRules.ts:183 | Ekle (7 pencere) |
| `Risk Notifications` | executionRules.ts:406 | Ekle (6 mesaj) |
| `PDT Notes` | optionsStrategies.ts:450 | Ekle (call/put için) |
| `IV Recommendations` | optionsStrategies.ts:316 | Ekle |
| `Consistency Report` | consistencyReport.ts:507 | Ekle (~20 metin) |
| `PDT Summary` | pdtAnalyzer.ts:335 | Ekle |
| `Catalysts / Risk Factors` | pdtAnalyzer.ts:456 | Ekle (~10 metin) |
| `Sanity Gate Messages` | sanityGate.ts:51 | Ekle (~10 mesaj) |
| `Yahoo Validation Errors` | sanityGate.ts:152 | Ekle (~10 hata) |
| `Day Names` | backtestEngine.ts:503 | Ekle (7 gün) |
| `Portfolio Heat Messages` | scoreConfig.ts:122 | Ekle (3 mesaj) |
| `Factor Labels` | scoreConfig.ts:216 | Ekle (11 etiket) |

---

## ✅ DOĞRU KULLANIM ÖRNEKLERİ

Aşağıdaki kullanımlar **doğru** ve sorun değil:

```
DOSYA: client/src/scanner/components/ScannerPage.tsx
SATIR: 21
DURUM: ✅ import { copy } from "@/lib/i18n"; — Doğru import
```

```
DOSYA: client/src/scanner/components/ScannerPage.tsx
SATIR: 46-47
DURUM: ✅ const { t } = useScannerI18n(lang); — Doğru hook kullanımı, lang prop'tan geliyor
```

```
DOSYA: client/src/scanner/components/ScannerPage.tsx
SATIR: 127, 130, 152, 157, 175, 187, 270
DURUM: ✅ {t("NASDAQ Momentum Tarama")}, {t("Taranıyor...")}, {t("Min Skor")}, {t("Sinyal")} — Doğru t() kullanımı
```

```
DOSYA: client/src/scanner/components/ScannerPage.tsx
SATIR: 39, 168, 218, 229
DURUM: ✅ copy(lang, "TR", "EN") — Doğru copy() kullanımı
```

```
DOSYA: client/src/scanner/components/MomentumStrategyTab.tsx
DURUM: ✅ Tüm copy() kullanımları doğru — language prop doğrudan kullanılıyor
```

```
DOSYA: client/src/scanner/useScannerI18n.ts
DURUM: ✅ Doğru implementasyon: scannerTR / scannerEN sözlükleri, t() fonksiyonu
```

---

## 📈 ÖNERİLEN EYLEM PLANI

### Aşama 1: Bileşen Dosyaları (Hızlı Kazanım)
1. `ScannerPage.tsx` Satır 96: `"Scan failed"` → `copy(lang, ...)`
2. `MomentumMarketTab.tsx`: `useAppLanguage()` → prop `language` kullan
3. `OptionStrategyPanel.tsx`: Tüm hardcoded İngilizce etiketler → `copy()`
4. `EnterpriseReport.tsx`: Tüm hardcoded İngilizce etiketler → `copy()`
5. `MomentumSetupsTab.tsx`: `Risk`, `Defensive` → `copy()`

### Aşama 2: Kritik Lib Fonksiyonları (Orta Kazanım)
6. `momentum.ts`:
   - `getScanTimingWarning()` → locale'a taşı
   - `buildExplanations()` → tüm reason/detail → locale
   - `rsiWarning` mesajları → locale
   - `earnWarn` → locale
7. `scoreConfig.ts`:
   - `signalLabel()` → `copy()` kullanmalı
   - `FACTOR_LABELS` → locale
   - `portfolioHeatCheck` → locale

### Aşama 3: Diğer Lib Dosyaları (Uzun Vade)
8. `optionsStrategies.ts`: Tüm entryNotes, riskWarnings, ivRecText, pdtNote → locale
9. `v4Engine.ts`: executionRules, priorities, rationale, ifFails → locale
10. `regimeDetector.ts`: regimeRules notes, regimeDescription → locale
11. `executionRules.ts`: managementActions, windowProfiles, executionPlan notes, riskNotifications → locale
12. `consistencyReport.ts`: Tüm rapor metinleri → locale
13. `pdtAnalyzer.ts`: buildSummary, call/put notes, catalysts, riskFactors → locale
14. `advancedOptions.ts`: recommendStrike, recommendExpiry, buildCompleteRecommendation → locale
15. `sanityGate.ts`: validation messages → locale
16. `backtestEngine.ts`: dayNames → locale
17. `portfolioRisk.ts`: correlationCheck warnings → locale

### Aşama 4: Locale Dosyaları
18. `locales/en.ts` ve `tr.ts`: Yukarıdaki eksik ~60-80 anahtarı ekle

---

> **Not:** Finansal jargon terimleri (VWAP, RSI, MACD, ORB, POP, DTE, ATR, RVOL, CPR, IV, EMA, SPY, QQQ, CALL, PUT, BACKWARDATION, CONTANGO, FLAT, TERM STRUCTURE) kullanıcı isteği üzerine raporlanmamıştır. Ancak "Max Risk", "Breakeven", "Kelly Sizing", "Spread Width", "R-Adj Return", "Earnings Gap", "Liquidity" gibi terimler kullanıcı tarafından belirtilen listede olmadığı için raporlanmıştır.

> **Not:** CSS class'ları (`text-emerald-400`, `bg-slate-800`), HTML attribute'ları (`className`, `id`, `data-*`), sayısal değerler, emoji'ler, ve ticker sembolleri (AAPL, TSLA) raporlanmamıştır.
