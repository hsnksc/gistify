# Gistify i18n Dil Denetim Raporu

**Tarih:** 2026-06-24
**Kapsam:** `client/src/pages/` + `client/src/components/` (101 dosya)
**Mekanizma:** `copy(language, "TR", "EN")` + `useAppLanguage()`

---

## 1. Özet Bulgular

| Kategori | Sayı | Önem |
|----------|------|------|
| Ternary kullanımı (copy() yerine) | 12+ | Yüksek |
| Hardcoded UI metin | 45+ | Yüksek |
| Yerel copy() tanımı (lib/i18n.ts yerine) | 7 | Orta |
| Kabul edilebilir ternary (locale, variant) | 15+ | Düşük |
| useTranslation/t() kullanımı | 0 | - |

---

## 2. Kritik Bulgular (Yüksek Öncelik)

### 2.1 App.tsx — Ternary kullanımı (WorkspaceNavigation + SiteFooter)

`App.tsx` içinde `WorkspaceNavigation` ve `SiteFooter` fonksiyonları `copy()` yerine doğrudan ternary kullanıyor. Bu, projenin standart i18n mekanizmasına aykırı.

```
DOSYA: client/src/App.tsx
SATIR: 396
TIP: ternary_instead_of_copy
METIN: label: language === "en" ? "Earning Strategy" : "Earning Strategy"
ONERI: copy(language, "Earning Strategy", "Earning Strategy") olarak değiştir

DOSYA: client/src/App.tsx
SATIR: 403
TIP: ternary_instead_of_copy
METIN: label: language === "en" ? "Momentum" : "Momentum"
ONERI: copy(language, "Momentum", "Momentum") olarak değiştir

DOSYA: client/src/App.tsx
SATIR: 411
TIP: ternary_instead_of_copy
METIN: label: language === "en" ? "Daily" : "Daily"
ONERI: copy(language, "Daily", "Daily") olarak değiştir

DOSYA: client/src/App.tsx
SATIR: 418
TIP: ternary_instead_of_copy
METIN: label: language === "en" ? "CPI/PPI" : "CPI/PPI"
ONERI: copy(language, "CPI/PPI", "CPI/PPI") olarak değiştir

DOSYA: client/src/App.tsx
SATIR: 432
TIP: ternary_instead_of_copy
METIN: label: language === "en" ? "Market Flash" : "Market Flash"
ONERI: copy(language, "Market Flash", "Market Flash") olarak değiştir

DOSYA: client/src/App.tsx
SATIR: 439
TIP: ternary_instead_of_copy
METIN: label: language === "en" ? "Flow" : "Flow"
ONERI: copy(language, "Flow", "Flow") olarak değiştir

DOSYA: client/src/App.tsx
SATIR: 449
TIP: ternary_instead_of_copy
METIN: label: language === "en" ? "Admin" : "Admin"
ONERI: copy(language, "Admin", "Admin") olarak değiştir

DOSYA: client/src/App.tsx
SATIR: 550
TIP: ternary_instead_of_copy
METIN: {language === "en" ? "Support" : "Destek"}: support@gistify.pro
ONERI: copy(language, "Destek", "Support") olarak değiştir
```

Ayrıca `SiteFooter` içinde `links` array ve açıklama metinleri ternary ile tanımlanmış (satır 519-567). Tüm footer metinleri `copy()` fonksiyonuna taşınmalı.

### 2.2 Home.tsx — Hardcoded buton, tab ve status metinleri

```
DOSYA: client/src/pages/Home.tsx
SATIR: 375
TIP: hardcoded_text
METIN: Momentum (buton metni)
ONERI: copy(language, "Momentum", "Momentum")

DOSYA: client/src/pages/Home.tsx
SATIR: 379
TIP: hardcoded_text
METIN: Admin (buton metni)
ONERI: copy(language, "Admin", "Admin")

DOSYA: client/src/pages/Home.tsx
SATIR: 401
TIP: hardcoded_text
METIN: "LIVE" (rapor şeridi etiketi)
ONERI: copy(language, "CANLI", "LIVE")

DOSYA: client/src/pages/Home.tsx
SATIR: 401
TIP: hardcoded_text
METIN: "ARCHIVE" (rapor şeridi etiketi)
ONERI: copy(language, "ARŞIV", "ARCHIVE")

DOSYA: client/src/pages/Home.tsx
SATIR: 404
TIP: hardcoded_text
METIN: "VIX -" (fallback metin)
ONERI: copy(language, "VIX -", "VIX -")

DOSYA: client/src/pages/Home.tsx
SATIR: 415
TIP: hardcoded_text
METIN: "Earning report" (fallback headline)
ONERI: copy(language, "Earning raporu", "Earning report")

DOSYA: client/src/pages/Home.tsx
SATIR: 427
TIP: hardcoded_text
METIN: "Selected report" (eyebrow metin)
ONERI: copy(language, "Secili rapor", "Selected report")

DOSYA: client/src/pages/Home.tsx
SATIR: 353
TIP: hardcoded_text
METIN: "bullish bias" (badge metin)
ONERI: copy(language, "bullish egilim", "bullish bias") — veya kısaltma: copy(language, "Bullish", "Bullish")

DOSYA: client/src/pages/Home.tsx
SATIR: 354
TIP: hardcoded_text
METIN: "bearish bias" (badge metin)
ONERI: copy(language, "bearish egilim", "bearish bias")

DOSYA: client/src/pages/Home.tsx
SATIR: 428
TIP: hardcoded_text
METIN: "earnings event" (status bar)
ONERI: copy(language, "earnings eventi", "earnings event")

DOSYA: client/src/pages/Home.tsx
SATIR: 432
TIP: hardcoded_text
METIN: "bullish" (status bar)
ONERI: copy(language, "bullish", "bullish")

DOSYA: client/src/pages/Home.tsx
SATIR: 437
TIP: hardcoded_text
METIN: "bearish" (status bar)
ONERI: copy(language, "bearish", "bearish")

DOSYA: client/src/pages/Home.tsx
SATIR: 442
TIP: hardcoded_text
METIN: "Avg IV Rank" (status bar)
ONERI: copy(language, "Ort. IV Rank", "Avg IV Rank")

DOSYA: client/src/pages/Home.tsx
SATIR: 447
TIP: hardcoded_text
METIN: "Avg CPR" (status bar)
ONERI: copy(language, "Ort. CPR", "Avg CPR")

DOSYA: client/src/pages/Home.tsx
SATIR: 50
TIP: hardcoded_text
METIN: "Post" (tab label)
ONERI: copy(language, "Post", "Post")

DOSYA: client/src/pages/Home.tsx
SATIR: 51
TIP: hardcoded_text
METIN: "Playbook" (tab label)
ONERI: copy(language, "Playbook", "Playbook")

DOSYA: client/src/pages/Home.tsx
SATIR: 490
TIP: hardcoded_text
METIN: "VIX" (summary card label)
ONERI: copy(language, "VIX", "VIX") — veya zaten finansal jargon, kabul edilebilir
```

### 2.3 Landing.tsx — Hardcoded eyebrow

```
DOSYA: client/src/pages/Landing.tsx
SATIR: 205
TIP: hardcoded_text
METIN: eyebrow="Public Product Overview"
ONERI: copy(language, "Urun Genel Bakis", "Public Product Overview")
```

### 2.4 Pricing.tsx — Hardcoded eyebrow ve liste öğeleri

```
DOSYA: client/src/pages/Pricing.tsx
SATIR: 23
TIP: hardcoded_text
METIN: eyebrow="Pricing"
ONERI: copy(language, "Fiyatlandirma", "Pricing")

DOSYA: client/src/pages/Pricing.tsx
SATIR: 36
TIP: hardcoded_text
METIN: "Gistify Pro" (plan adı)
ONERI: copy(language, "Gistify Pro", "Gistify Pro") — marka adı, tercihen copy()'ye alınmalı

DOSYA: client/src/pages/Pricing.tsx
SATIR: 12
TIP: hardcoded_text
METIN: "Momentum scanner" (liste öğesi)
ONERI: copy(language, "Momentum scanner", "Momentum scanner")

DOSYA: client/src/pages/Pricing.tsx
SATIR: 14
TIP: hardcoded_text
METIN: "Pre-earnings stock analysis tabs" (liste öğesi)
ONERI: copy(language, "Pre-earnings hisse analiz sekmeleri", "Pre-earnings stock analysis tabs")
```

### 2.5 OverviewTab.tsx — Hardcoded hero banner ve chart metinleri

```
DOSYA: client/src/components/tabs/OverviewTab.tsx
SATIR: 104
TIP: hardcoded_text
METIN: "EARNING STRATEGY" (hero banner büyük başlık)
ONERI: copy(language, "EARNING STRATEGY", "EARNING STRATEGY")

DOSYA: client/src/components/tabs/OverviewTab.tsx
SATIR: 105
TIP: hardcoded_text
METIN: "DERİN ANALİZ" / "DEEP ANALYSIS" (hero banner alt başlık) — zaten copy() ile çevrili, OK

DOSYA: client/src/components/tabs/OverviewTab.tsx
SATIR: 180
TIP: hardcoded_text
METIN: "Earnings:" (stok kartı etiket)
ONERI: copy(language, "Earnings:", "Earnings:")

DOSYA: client/src/components/tabs/OverviewTab.tsx
SATIR: 184
TIP: hardcoded_text
METIN: "Beat İht:" / "Beat Prob:" (stok kartı etiket)
ONERI: zaten copy() ile çevrili, OK

DOSYA: client/src/components/tabs/OverviewTab.tsx
SATIR: 188
TIP: hardcoded_text
METIN: "6A:" / "6M:" (stok kartı etiket)
ONERI: zaten copy() ile çevrili, OK

DOSYA: client/src/components/tabs/OverviewTab.tsx
SATIR: 254
TIP: hardcoded_text
METIN: "MAKRO BAĞLAM — SEKTÖREL BÜYÜME 2026" / "MACRO CONTEXT — SECTORAL GROWTH 2026"
ONERI: copy() ile çevrili, OK

DOSYA: client/src/components/tabs/OverviewTab.tsx
SATIR: 50
TIP: hardcoded_text
METIN: "Weekly view" (default prop)
ONERI: copy(language, "Haftalik gorunum", "Weekly view")

DOSYA: client/src/components/tabs/OverviewTab.tsx
SATIR: 51
TIP: hardcoded_text
METIN: "Live" (default prop)
ONERI: copy(language, "Canli", "Live")
```

### 2.6 EarningReportPostTab.tsx — Hardcoded tablo headers ve factor labels

```
DOSYA: client/src/components/tabs/EarningReportPostTab.tsx
SATIR: 680
TIP: hardcoded_text
METIN: "Ticker" (DataTable header)
ONERI: copy(language, "Hisse", "Ticker")

DOSYA: client/src/components/tabs/EarningReportPostTab.tsx
SATIR: 670
TIP: hardcoded_text
METIN: "Factor Breakdown" (bölüm başlığı)
ONERI: copy(language, "Faktor Dagilimi", "Factor Breakdown")

DOSYA: client/src/components/tabs/EarningReportPostTab.tsx
SATIR: 672-677
TIP: hardcoded_text
METIN: "F1", "F2", "F3", "F4", "F5", "F6" (factor labels)
ONERI: copy(language, "F1", "F1") vb. — veya açıklayıcı isimler

DOSYA: client/src/components/tabs/EarningReportPostTab.tsx
SATIR: 698
TIP: hardcoded_text
METIN: "Trade Plan" (bölüm başlığı)
ONERI: copy(language, "Trade Plan", "Trade Plan")

DOSYA: client/src/components/tabs/EarningReportPostTab.tsx
SATIR: 700-706
TIP: hardcoded_text
METIN: "Entry:", "Stop:", "T1:", "T2:", "RR:", "Stop%:" (trade plan labels)
ONERI: copy(language, "Giris:", "Entry:") vb.

DOSYA: client/src/components/tabs/EarningReportPostTab.tsx
SATIR: 712
TIP: hardcoded_text
METIN: "Position Sizing" (bölüm başlığı)
ONERI: copy(language, "Pozisyon Buyuklugu", "Position Sizing")

DOSYA: client/src/components/tabs/EarningReportPostTab.tsx
SATIR: 714-723
TIP: hardcoded_text
METIN: "Shares:", "Position:", "Risk:", "Kelly:" (position sizing labels)
ONERI: copy(language, "Adet:", "Shares:") vb.
```

### 2.7 MidasOpportunitiesTab.tsx — Benzer hardcoded metinler

```
DOSYA: client/src/components/tabs/MidasOpportunitiesTab.tsx
SATIR: 573
TIP: hardcoded_text
METIN: "Apex Score" (bölüm başlığı)
ONERI: copy(language, "Apex Skoru", "Apex Score")

DOSYA: client/src/components/tabs/MidasOpportunitiesTab.tsx
SATIR: 670
TIP: hardcoded_text
METIN: "Factor Breakdown" (bölüm başlığı)
ONERI: copy(language, "Faktor Dagilimi", "Factor Breakdown")

DOSYA: client/src/components/tabs/MidasOpportunitiesTab.tsx
SATIR: 698
TIP: hardcoded_text
METIN: "Trade Plan" (bölüm başlığı)
ONERI: copy(language, "Trade Plan", "Trade Plan")

DOSYA: client/src/components/tabs/MidasOpportunitiesTab.tsx
SATIR: 712
TIP: hardcoded_text
METIN: "Position Sizing" (bölüm başlığı)
ONERI: copy(language, "Pozisyon Buyuklugu", "Position Sizing")

DOSYA: client/src/components/tabs/MidasOpportunitiesTab.tsx
SATIR: 640
TIP: hardcoded_text
METIN: "↑ LONG" / "↓ SHORT" (direction badges)
ONERI: copy(language, "↑ LONG", "↑ LONG") — veya sadece ok sembolü + copy(language, "LONG", "LONG")
```

### 2.8 MomentumFlowSurface.tsx — Benzer hardcoded metinler

```
DOSYA: client/src/components/tabs/MomentumFlowSurface.tsx
SATIR: 670
TIP: hardcoded_text
METIN: "Factor Breakdown" (bölüm başlığı)
ONERI: copy(language, "Faktor Dagilimi", "Factor Breakdown")

DOSYA: client/src/components/tabs/MomentumFlowSurface.tsx
SATIR: 698
TIP: hardcoded_text
METIN: "Trade Plan" (bölüm başlığı)
ONERI: copy(language, "Trade Plan", "Trade Plan")

DOSYA: client/src/components/tabs/MomentumFlowSurface.tsx
SATIR: 712
TIP: hardcoded_text
METIN: "Position Sizing" (bölüm başlığı)
ONERI: copy(language, "Pozisyon Buyuklugu", "Position Sizing")
```

### 2.9 MarketFlash.tsx — Çok sayıda hardcoded metin

MarketFlash.tsx 1736 satırlık çok büyük bir dosya. İçinde aşağıdaki hardcoded metinler tespit edildi:

```
DOSYA: client/src/pages/MarketFlash.tsx
SATIR: 998
TIP: hardcoded_text
METIN: "BMO" (earnings time badge — Before Market Open)
ONERI: copy(language, "BMO", "BMO") — veya açıklayıcı: copy(language, "Piyasa Oncesi", "Before Open")

DOSYA: client/src/pages/MarketFlash.tsx
SATIR: 999
TIP: hardcoded_text
METIN: "AMC" (earnings time badge — After Market Close)
ONERI: copy(language, "AMC", "AMC") — veya açıklayıcı: copy(language, "Piyasa Sonrasi", "After Close")

DOSYA: client/src/pages/MarketFlash.tsx
SATIR: 876
TIP: hardcoded_text
METIN: "Entry" (setup card label)
ONERI: copy(language, "Giris", "Entry")

DOSYA: client/src/pages/MarketFlash.tsx
SATIR: 884
TIP: hardcoded_text
METIN: "Stop" (setup card label)
ONERI: copy(language, "Stop", "Stop")

DOSYA: client/src/pages/MarketFlash.tsx
SATIR: 892
TIP: hardcoded_text
METIN: "Target" (setup card label)
ONERI: copy(language, "Hedef", "Target")

DOSYA: client/src/pages/MarketFlash.tsx
SATIR: 900
TIP: hardcoded_text
METIN: "R/R" (setup card label)
ONERI: copy(language, "R/R", "R/R") — finansal jargon, kabul edilebilir

DOSYA: client/src/pages/MarketFlash.tsx
SATIR: 643
TIP: hardcoded_text
METIN: "VWAP" (index pill label)
ONERI: copy(language, "VWAP", "VWAP") — finansal jargon, kabul edilebilir

DOSYA: client/src/pages/MarketFlash.tsx
SATIR: 625
TIP: hardcoded_text
METIN: "VIX" (badge label)
ONERI: copy(language, "VIX", "VIX") — finansal jargon, kabul edilebilir

DOSYA: client/src/pages/MarketFlash.tsx
SATIR: 952
TIP: hardcoded_text
METIN: "Earnings Takvimi" / "Earnings Calendar" (CardTitle)
ONERI: zaten copy() ile çevrili, OK
```

### 2.10 CalendarTab.tsx — Hardcoded default değer

```
DOSYA: client/src/components/tabs/CalendarTab.tsx
SATIR: 86
TIP: hardcoded_text
METIN: "AMC" (default time)
ONERI: copy(language, "AMC", "AMC") veya props üzerinden geçir

DOSYA: client/src/components/tabs/CalendarTab.tsx
SATIR: 185
TIP: hardcoded_text
METIN: "Implied Move" (tablo header)
ONERI: copy(language, "Implied Move", "Implied Move") — finansal jargon
```

---

## 3. Orta Öncelik Bulgular

### 3.1 Yerel copy() tanımı (lib/i18n.ts yerine)

Aşağıdaki dosyalar kendi `copy()` fonksiyonunu tanımlıyor. Bu, `@/lib/i18n`'den import edilmesi gereken fonksiyonun tekrarlanmasıdır. Bakım zorluğu yaratır ve tutarsızlığa yol açabilir.

```
DOSYA: client/src/pages/Scanner.tsx
SATIR: 20
TIP: inconsistent_translation
METIN: function copy(language: AppLanguage, tr: string, en: string) { return language === "en" ? en : tr; }
ONERI: import { copy } from "@/lib/i18n"; ile değiştir, yerel tanımı kaldır

DOSYA: client/src/pages/MarketFlash.tsx
SATIR: 209
TIP: inconsistent_translation
METIN: function copy(language: AppLanguage, tr: string, en: string) { return language === "en" ? en : tr; }
ONERI: import { copy } from "@/lib/i18n"; ile değiştir, yerel tanımı kaldır

DOSYA: client/src/components/tabs/MomentumFlowSurface.tsx
SATIR: 61
TIP: inconsistent_translation
METIN: function copy(language: AppLanguage, tr: string, en: string) { return language === "en" ? en : tr; }
ONERI: import { copy } from "@/lib/i18n"; ile değiştir, yerel tanımı kaldır

DOSYA: client/src/components/tabs/MidasOpportunitiesTab.tsx
SATIR: 63
TIP: inconsistent_translation
METIN: function copy(language: AppLanguage, tr: string, en: string) { return language === "en" ? en : tr; }
ONERI: import { copy } from "@/lib/i18n"; ile değiştir, yerel tanımı kaldır

DOSYA: client/src/components/reports/DailyReportViewer.tsx
SATIR: 24
TIP: inconsistent_translation
METIN: function copy(language: AppLanguage, tr: string, en: string) { return language === "en" ? en : tr; }
ONERI: import { copy } from "@/lib/i18n"; ile değiştir, yerel tanımı kaldır

DOSYA: client/src/components/reports/MarkdownReportRenderer.tsx
SATIR: 30
TIP: inconsistent_translation
METIN: function copy(language: AppLanguage, tr: string, en: string) { return language === "en" ? en : tr; }
ONERI: import { copy } from "@/lib/i18n"; ile değiştir, yerel tanımı kaldır

DOSYA: client/src/components/reports/HtmlReportRenderer.tsx
SATIR: 47
TIP: inconsistent_translation
METIN: function copy(language: AppLanguage, tr: string, en: string) { return language === "en" ? en : tr; }
ONERI: import { copy } from "@/lib/i18n"; ile değiştir, yerel tanımı kaldır
```

### 3.2 NotFound.tsx — useAppLanguage() kullanımı (İYİ)

```
DOSYA: client/src/pages/NotFound.tsx
SATIR: 8
TIP: (olumlu not)
METIN: const language = useAppLanguage();
ONERI: Dogru kullanim. AppLanguageContext.Provider App.tsx icinde mevcut.
```

### 3.3 features/flow/ dosyaları — Locale ternary kullanımı (KABUL EDİLEBİLİR)

Aşağıdaki dosyalarda `locale = language === "en" ? "en-US" : "tr-TR"` ternary kullanımı var. Bu, `Intl.DateTimeFormat` ve `Intl.NumberFormat` için locale ayarıdır. Doğrudan bir UI metni değildir, kabul edilebilir.

- `client/src/features/flow/components/FlowTickerCard.tsx`
- `client/src/features/flow/components/FlowReportRow.tsx`
- `client/src/features/flow/components/FlowCommunityPanel.tsx`
- `client/src/features/flow/components/FlowReportCard.tsx`
- `client/src/features/flow/pages/FlowPage.tsx`
- `client/src/features/flow/pages/FlowDailyPage.tsx`
- `client/src/features/flow/pages/FlowTickerPage.tsx`
- `client/src/features/flow/pages/ReportsDateDetailPage.tsx`
- `client/src/features/flow/pages/FlowIndexPage.tsx`
- `client/src/features/flow/lib/reportGallery.ts`
- `client/src/features/flow/lib/flowReportHelpers.ts`

Ayrıca `client/src/pages/Home.tsx`, `client/src/pages/DailyReport.tsx`, `client/src/pages/Calendar.tsx`, `client/src/pages/CpiPpiForecast.tsx` dosyalarında da aynı locale ternary kullanımı mevcut. **Bu kabul edilebilir.**

### 3.4 ReportsDateDetailPage.tsx — Variant ternary kullanımı (KABUL EDİLEBİLİR)

```
DOSYA: client/src/features/flow/pages/ReportsDateDetailPage.tsx
SATIR: 222
TIP: (kabul edilebilir)
METIN: variant={language === "tr" ? "secondary" : "outline"}
ONERI: Bu UI davranis ternary'sidir; metin degil, degistirilmesine gerek yok.

DOSYA: client/src/features/flow/pages/ReportsDateDetailPage.tsx
SATIR: 232
TIP: (kabul edilebilir)
METIN: variant={language === "en" ? "secondary" : "outline"}
ONERI: Bu UI davranis ternary'sidir; metin degil, degistirilmesine gerek yok.
```

### 3.5 Pay.tsx — Locale ternary (KABUL EDİLEBİLİR)

```
DOSYA: client/src/pages/Pay.tsx
SATIR: 383
TIP: (kabul edilebilir)
METIN: locale: language === "tr" ? "tr" : "en"
ONERI: Paddle checkout locale ayari; UI metni degil.
```

---

## 4. Düşük Öncelik / Notlar

### 4.1 useTranslation / t() kullanımı

Proje genelinde `useTranslation` veya `t()` kullanımına rastlanmadı. Tüm i18n çeviriler `copy()` fonksiyonu ile yapılıyor. Bu, projenin mevcut standartına uygundur.

### 4.2 shadcn/ui Component'leri (components/ui/)

Aşağıdaki dosyalar `useAppLanguage` kullanıyor. Bunlar shadcn/ui kütüphanesinden gelen primitive component'lerdir ve muhtemelen içlerinde "Previous", "Next", "Close" gibi metinler içeriyor. Detaylı inceleme yapılmadı, ancak bu component'lerin içindeki metinlerin çoğu `aria-label` ve `title` attribute'ları olabilir.

- `client/src/components/ui/sidebar.tsx`
- `client/src/components/ui/sheet.tsx`
- `client/src/components/ui/pagination.tsx`
- `client/src/components/ui/dialog.tsx`
- `client/src/components/ui/carousel.tsx`
- `client/src/components/ui/breadcrumb.tsx`

**Öneri:** Bu dosyalar shadcn/ui'nin orijinal kaynak kodlarından kopyalanmıştır. Eğer içlerinde kullanıcıya görünen metinler varsa, bunlar da `copy()` ile çevrilmelidir. Aksi halde `aria-label` ve `title` gibi erişilebilirlik metinleri runtime translation sistemi tarafından çevrilir (App.tsx içindeki runtime translation mekanizması).

### 4.3 Admin Panel'leri

Aşağıdaki admin panel dosyaları incelenmedi. Admin panel'leri genelde İngilizce-only veya internal kullanım içindir. Ancak i18n tutarlılığı açısından kontrol edilmelidir.

- `client/src/components/reports/DailyReportAdminPanel.tsx`
- `client/src/components/reports/WeeklyReportAdminPanel.tsx`
- `client/src/components/reports/MomentumReportAdminPanel.tsx`
- `client/src/components/reports/OpenAiImageAdminPanel.tsx`
- `client/src/pages/ReportsAdmin.tsx`

### 4.4 Diğer Tab Bileşenleri

Aşağıdaki tab bileşenleri detaylı incelenmedi. İçlerinde hardcoded metinler olabilir:

- `client/src/components/tabs/StrategyPlaybookTab.tsx`
- `client/src/components/tabs/EarningReportPlaybookTab.tsx`
- `client/src/components/tabs/EarningReportRiskTab.tsx`
- `client/src/components/tabs/EarningReportCalendarTab.tsx`
- `client/src/components/tabs/OptionDetailTab.tsx`
- `client/src/components/tabs/RiskTab.tsx`
- `client/src/components/tabs/SectorTab.tsx`
- `client/src/components/tabs/IVCrushTab.tsx`
- `client/src/components/tabs/MomentumTab.tsx`
- `client/src/components/tabs/MomentumReportPostTab.tsx`
- `client/src/components/tabs/MomentumReportDocumentTab.tsx`
- `client/src/components/tabs/EarningReportDocumentTab.tsx`
- `client/src/components/tabs/MomentumHtmlReportTab.tsx`

### 4.5 components/workspace/ Bileşenleri

- `client/src/components/workspace/WorkspaceHeroPanel.tsx`
- `client/src/components/workspace/WorkspaceLoadingState.tsx`
- `client/src/components/workspace/WorkspaceSummaryCard.tsx`

Bu bileşenler detaylı incelenmedi. İçlerinde hardcoded metinler olabilir.

---

## 5. En İyi Uygulama Önerileri

### 5.1 Ternary → copy() Dönüşümü

Tüm `language === "en" ? ... : ...` ternary kullanımları (UI metni için olanlar) `copy()` fonksiyonuna dönüştürülmelidir. Örnek:

```tsx
// KÖTÜ
label: language === "en" ? "Earning Strategy" : "Earning Strategy",

// İYİ
label: copy(language, "Earning Strategy", "Earning Strategy"),
```

### 5.2 Yerel copy() → Merkezi copy() Dönüşümü

Tüm dosyalardaki yerel `copy()` tanımları kaldırılmalı ve `@/lib/i18n`'den import edilmelidir:

```tsx
// KÖTÜ (Scanner.tsx, MarketFlash.tsx, vb.)
function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
}

// İYİ
import { copy } from "@/lib/i18n";
```

### 5.3 COPY Object Pattern (Terms, Privacy, Refund, Pay)

`Terms.tsx`, `Privacy.tsx`, `Refund.tsx` ve `Pay.tsx` dosyalarındaki `COPY` object pattern'i oldukça temiz ve tutarlıdır. Diğer sayfalar için de bu pattern düşünülebilir, ancak `copy()` fonksiyonu mevcut ihtiyaçları karşılıyorsa değiştirilmesine gerek yoktur.

### 5.4 Runtime Translation Sistemi

App.tsx içindeki runtime translation mekanizması (`walkTextNodes`, `translateElementAttributes`, `resolveRuntimeTranslation`) şu anda çalışıyor. Bu sistem, `data-no-translate` attribute'u olan element'leri atlar. `LanguageSelector.tsx` ve `PublicShell.tsx` içindeki dil switcher butonları (`TR`, `EN`) doğru şekilde `data-no-translate` ile işaretlenmiş.

---

## 6. Dil Prop'u İletimi

| Sayfa / Bileşen | Dil Prop'u Alıyor | Durum |
|-----------------|-------------------|-------|
| Landing.tsx | ✅ `language`, `onLanguageChange` | İyi |
| Home.tsx | ✅ `language` | İyi |
| Scanner.tsx | ✅ `language` | İyi |
| MarketFlash.tsx | ✅ `language` | İyi |
| DailyReport.tsx | ✅ `language` | İyi |
| Calendar.tsx | ✅ `language` | İyi |
| CpiPpiForecast.tsx | ✅ `language` | İyi |
| Pricing.tsx | ✅ `language`, `onLanguageChange` | İyi |
| Terms.tsx | ✅ `language`, `onLanguageChange` | İyi |
| Privacy.tsx | ✅ `language`, `onLanguageChange` | İyi |
| Refund.tsx | ✅ `language`, `onLanguageChange` | İyi |
| Pay.tsx | ✅ `language`, `onLanguageChange` | İyi |
| ReportsAdmin.tsx | ✅ `language` | İyi (okunmadı) |
| NotFound.tsx | ❌ (useAppLanguage() kullanıyor) | Kabul edilebilir |

**NotFound.tsx** `useAppLanguage()` hook'unu kullanıyor. Bu doğru bir yaklaşımdır, çünkü `AppLanguageContext.Provider` App.tsx içinde mevcut. Ancak NotFound bileşeni route tarafından doğrudan çağrıldığında (örn: `<Route component={NotFound} />`), `language` prop'u iletilmiyor. `useAppLanguage()` kullanımı bu durumda güvenlidir.

---

## 7. Sonuç

Projenin i18n altyapısı genel olarak sağlamdır. `copy()` fonksiyonu ve `AppLanguageContext` düzgün çalışıyor. Ancak aşağıdaki alanlarda düzeltmeler yapılması önerilir:

1. **App.tsx**: `WorkspaceNavigation` ve `SiteFooter` içindeki ternary kullanımları `copy()`'ye dönüştürülmeli.
2. **Home.tsx**: Buton, tab, badge ve status bar metinleri `copy()` ile çevrilmeli.
3. **Landing.tsx**: `eyebrow` prop'u `copy()` ile çevrilmeli.
4. **Pricing.tsx**: `eyebrow` ve liste öğeleri `copy()` ile çevrilmeli.
5. **OverviewTab.tsx**: Hero banner ve chart metinleri `copy()` ile çevrilmeli.
6. **EarningReportPostTab.tsx**: Tablo headers, factor labels, trade plan ve position sizing labels `copy()` ile çevrilmeli.
7. **MidasOpportunitiesTab.tsx**: Apex Score, Factor Breakdown, Trade Plan, Position Sizing labels `copy()` ile çevrilmeli.
8. **MomentumFlowSurface.tsx**: Factor Breakdown, Trade Plan, Position Sizing labels `copy()` ile çevrilmeli.
9. **MarketFlash.tsx**: Setup card labels (Entry, Stop, Target), earnings badges (BMO, AMC) `copy()` ile çevrilmeli.
10. **Yerel copy() tanımları**: Scanner.tsx, MarketFlash.tsx, MomentumFlowSurface.tsx, MidasOpportunitiesTab.tsx, DailyReportViewer.tsx, MarkdownReportRenderer.tsx, HtmlReportRenderer.tsx dosyalarındaki yerel `copy()` tanımları kaldırılmalı, merkezi `@/lib/i18n`'den import edilmeli.
11. **Diğer tab bileşenleri**: StrategyPlaybookTab, OptionDetailTab, RiskTab, SectorTab, IVCrushTab, MomentumTab, MomentumReportPostTab, EarningReportPlaybookTab, EarningReportRiskTab, EarningReportCalendarTab, MomentumReportDocumentTab, EarningReportDocumentTab, MomentumHtmlReportTab — içeriklerinin i18n denetimi yapılmalı.
12. **shadcn/ui component'leri**: sidebar, sheet, pagination, dialog, carousel, breadcrumb — içeriklerinin i18n denetimi yapılmalı.
