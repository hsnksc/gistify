# GISTIFY UI/UX & ALGORITMIK MİMARİ DETAYLANDIRILMIŞ RAPORU

## Executive Summary

Gistify projesi, finansal veri yoğunluklu 3 ana uygulamadan oluşuyor: **Ana App** (Earnings Intelligence), **Benchmark** (Earnings Benchmark Raporu) ve **Momentum Scrapper** (NASDAQ Scanner). Her uygulama kendi içinde zengin özelliklere sahip ancak **tutarlılık, bakılabilirlik ve kullanıcı deneyimi** açısından ciddi sorunlar mevcut.

Bu rapor, **mimari ve algoritmik detaylandırma** ile birlikte, yeni bir **dinamik Markdown deploy sistemi** ve **sosyal etkileşim katmanı** gereksinimlerini de kapsar.

| Kategori | Durum | Kritik Sorun Sayısı |
|----------|-------|---------------------|
| Tasarım Sistemi | ❌ 3 farklı sistem (HEX + OKLCH + Slate) | 8 |
| Tutarlılık | ❌ Bileşenler arası tutarsızlık yüksek | 12 |
| Responsive | ⚠️ Tablolar mobilde kullanılamaz | 6 |
| Kod Kalitesi | ❌ Aşırı uzun dosyalar, kod tekrarı | 10 |
| Accessibility | ⚠️ Eksik ARIA, kontrast sorunları | 5 |
| Grafik/Chart | ⚠️ Font boyutu, renk tutarsızlığı | 4 |
| Algoritmik Mimari | ❌ Statik yapı, dinamik MD desteği yok | 8 |
| Sosyal Katman | ❌ Yok | 4 |

---

## 1. KRİTİK SORUNLAR (Acil Eylem Gerektiren)

### 🔴 SEVİYE 1 — Kritik (Hemen Düzeltilmeli)

| # | Sorun | Etki | Yer |
|---|-------|------|-----|
| 1.1 | **NotFound.tsx dark tema kopukluğu** | Tüm uygulama dark tema ama 404 sayfası açık tema (slate-50). Marka kimliği kopar, kullanıcı şok yaşar. | Ana App + Benchmark |
| 1.2 | **Home ↔ Scanner kod tekrarı (%40)** | Her değişiklik 2 yerde yapılmalı. Bug riski yüksek, bakım maliyeti katlanır. | Ana App pages |
| 1.3 | **ReportsAdmin.tsx 1876 satır** | Tek dosyada 5+ sorumluluk. Test edilemez, review edilemez, okunamaz. | Ana Admin |
| 1.4 | **tactical-card tanımsız** | 7 tab bu class'ı kullanıyor ama `index.css`'de tanımı yok. Kartlar görsel olarak bozuk. | Ana Tabs |
| 1.5 | **StockDetailTab 0 byte** | Dosya tamamen boş. Import ediliyor ama hiçbir UI yok. | Ana Tabs |
| 1.6 | **Dinamik Tailwind class'ları çalışmıyor** | `bg-${accentColor}-500/5` gibi template literal class'lar. Tailwind JIT bunları göremez. Opsiyon kartları stilsiz kalıyor. | Momentum Scrapper |
| 1.7 | **ReportPage yanlış tab çağrısı** | June raporunda `stocks` tab'ı `StockDetailTab` yerine `JuneStockDetailTab` render edilmiyor. | Benchmark |
| 1.8 | **Hardcoded ticker strings** | `stock.ticker === 'MRVL' && ...` 10+ yerde. Yeni hisse eklemek için JSX değişimi gerekir. | Ana + Benchmark |
| 1.9 | **Dinamik MD deploy sistemi yok** | `/app`, `/momentum`, `/daily-report`, `/flow` statik tab'larla çalışıyor. Yeni .md dosyası eklemek için kod değişimi gerekir. | Tüm Routes |
| 1.10 | **Flow sosyal katmanı yok** | Beğenme, yorum, link, paylaşım özellikleri eksik. | Flow |

### 🟡 SEVİYE 2 — Yüksek (Planlı Düzeltilmeli)

| # | Sorun | Etki | Yer |
|---|-------|------|-----|
| 2.1 | **Inline Tooltip kod tekrarı** | Aynı tooltip JSX'i 5 tab'da kopyalanmış. Bakım zorluğu, type hatası riski. | Ana Tabs |
| 2.2 | **Tablo responsive zafiyeti** | MomentumTab 11 kolon, IVCrushTab 10 kolon, CalendarTab 9 kolon. Mobilde kullanılamaz. | Ana + Benchmark |
| 2.3 | **EarningReportPlaybookTab 691 satır** | 4 bileşen + fonksiyon tek dosyada. `key={activePosition.ticker}` remount sorunu. | Ana Tabs |
| 2.4 | **"Defined but Abandoned" class'lar** | `workspace-panel`, `workspace-card`, `badge-strong`, `heading-condensed` tanımlı ama kullanılmıyor. | Ana CSS |
| 2.5 | **Tema çatışması** | ThemeContext default `light`, CSS `color-scheme: dark`, Sonner `next-themes` kullanıyor. 3 tema yöneticisi. | Ana App |
| 2.6 | **Radius Inflation** | `radius-xl = 12px` ama component'lerde `rounded-[2rem]` (32px) kullanılıyor. | Ana + Benchmark |
| 2.7 | **Font import eksikliği** | JetBrains Mono, Barlow Condensed referans edilmiş ama `@import` yok. | Benchmark |
| 2.8 | **Aşırı uzun bileşenler** | SmartScanner 627 satır, StockDetailModal 481 satır, BacktestPanel 425 satır. | Momentum Scrapper |
| 2.9 | **İki farklı sonuç tablosu** | ResultsTable.tsx ve ScanPage.tsx ayrı implementasyon. Bakım maliyeti. | Momentum Scrapper |
| 2.10 | **Dead code** | PieChart, Legend, RADAR_URL, MapView, Home.tsx import edilmiş ama kullanılmıyor. | Benchmark |

---

## 2. UYGULAMA BAZLI ANALİZ

### 2.1 Ana App (Earnings Intelligence)

**Güçlü Yönler:**
- `workspace-panel`, `workspace-card`, `workspace-tab` gibi kaliteli custom utility class'lar tanımlanmış
- `data-mono` + `tabular-nums` ile finansal veri tipografisi güçlü
- `pulse-live`, `animate-flash` gibi mikro animasyonlar dikkat çekici
- i18n desteği (TR/EN) geniş kapsamlı
- Auth state machine mantığı (loading → anonymous → authenticated) net
- `restricted-view` CSS ile ücretsiz kullanıcı deneyimi düşünülmüş

**Zayıf Yönler:**

| Alan | Sorun | Örnek |
|------|-------|-------|
| **Sayfalar** | Landing.tsx hardcoded `text-emerald-300` | CSS değişken bypass |
| **Sayfalar** | Home.tsx 644 satır, Scanner.tsx 749 satır | Aşırı uzun dosyalar |
| **Sayfalar** | Pay.tsx inline COPY objesi 170+ satır | i18n yönetimi zayıf |
| **Sayfalar** | Pricing.tsx `text-5xl` fiyat taşması | Responsive riski |
| **Tab'lar** | OverviewTab `tactical-card` tanımsız | Kartlar bozuk görünebilir |
| **Tab'lar** | MomentumTab 11 kolon, mouse event inline style | Performans + responsive sorunu |
| **Tab'lar** | IVCrushTab tooltip 4 kez kopyalanmış | DRY ihlali |
| **Tab'lar** | OptionDetailTab hardcoded timeline data | Gerçek veri ile uyumsuz |
| **Tab'lar** | EarningReportPlaybookTab 691 satır | Tek dosya çok büyük |
| **Tab'lar** | StockDetailTab 0 byte | Boş dosya |
| **Admin** | ReportsAdmin 1876 satır | Bakım imkansız |
| **Admin** | Toast/notification eksikliği | Kullanıcı feedback'i yok |
| **Admin** | Loading state yetersiz | Sadece button disable |
| **Admin** | `adminBusy` state genel spinner yok | Uzun işlemlerde belirsizlik |

### 2.2 Benchmark App (Earnings Benchmark Raporu)

**Güçlü Yönler:**
- "Precision Finance" estetiği tutarlı: tactical, sharp corners, dark navy
- RadarChart, ScatterChart, BarChart çeşitliliği güçlü
- Quadrant labels ("İDEAL BÖLGE ↗") scatter chart üzerinde net
- Portfolio Strategy 4'lü grid aksiyon odaklı
- Scroll-to-top tab değişiminde UX dostu

**Zayıf Yönler:**

| Alan | Sorun | Örnek |
|------|-------|-------|
| **Sayfalar** | NotFound.tsx açık tema | Tema kopukluğu |
| **Sayfalar** | ReportPage June raporunda yanlış tab | `StockDetailTab` yerine `JuneStockDetailTab` |
| **Sayfalar** | Home.tsx dead code | App.tsx kullanmıyor |
| **Tab'lar** | OptionDetailTab 10 hardcoded ticker | Maintenance nightmare |
| **Tab'lar** | JuneOptionDetailTab 10 hardcoded ticker | Aynı sorun |
| **Tab'lar** | JuneStockDetailTab 10 hardcoded ticker | Aynı sorun |
| **Tab'lar** | Inline style baskınlığı | `style={{ color: 'oklch(...)' }}` her yerde |
| **Tab'lar** | Dead code import'lar | Legend, PieChart, RADAR_URL, BarChart/Cell |
| **Tab'lar** | Table 11 kolon mobilde kullanılamaz | overflow-x-auto yetersiz |
| **Admin** | Native `alert()` kullanımı | `alert('Lütfen tüm alanları doldurunuz')` |
| **Admin** | `isGenerating` simülasyon | `setTimeout(1000)` fake API |
| **Admin** | No keyboard escape | ESC popup kapatmıyor |
| **Admin** | Backdrop yok | Popup dışına tıklama kapatmıyor |
| **Genel** | Benchmark vs v2 %100 kod kopyası | `shared/` klasörü yok |

### 2.3 Momentum Scrapper (NASDAQ Scanner)

**Güçlü Yönler:**
- Tam istemci taraflı, tarayıcıda analiz
- 11 faktörlü momentum skoru
- AI Catalyst + Microstructure kartları
- Backtest paneli
- Options panel (call/put setup)
- StockDetailModal collapsible explanation panel
- ScanPage loading progress bar + yüzde gösterimi

**Zayıf Yönler:**

| Alan | Sorun | Örnek |
|------|-------|-------|
| **Tasarım** | Renk sistemi farklı (slate+emerald vs oklch+navy) | Ana App/Benchmark'tan kopuk |
| **Tasarım** | Corner radius farklı (rounded-xl vs sharp) | Visual disconnect |
| **Tasarım** | Tipografi farklı (default sans vs Barlow Condensed) | Marka tutarsızlığı |
| **Tasarım** | Card pattern farklı (glassmorphism vs flat) | Estetik kopukluğu |
| **Tasarım** | Hardcoded tooltip renkleri | `#0f172a`, `#1e293b` sert kodlanmış |
| **Bileşen** | Dinamik Tailwind class'ları çalışmıyor | `bg-${accentColor}-500/5` JIT sorunu |
| **Bileşen** | SmartScanner 627 satır | Aşırı uzun |
| **Bileşen** | StockDetailModal 481 satır | Aşırı uzun |
| **Bileşen** | BacktestPanel 425 satır | Aşırı uzun |
| **Bileşen** | İki farklı sonuç tablosu | ResultsTable + ScanPage ayrı implementasyon |
| **Bileşen** | OptionsPanel dinamik class hatası | Stil uygulanmıyor |
| **Veri** | `generateMockResult` Math.random() | Aynı ticker farklı sonuç |
| **Veri** | AnalysisPage random veri | Kullanıcı güveni zedeler |
| **UX** | Empty state yetersiz | Sadece metin, ikon yok |
| **UX** | Error state görsel değil | `setError` var ama UI yok |

---

## 3. TASARIM SİSTEMİ ANALİZİ

### 3.1 Renk Paleti Değerlendirmesi

| Uygulama | Sistem | Arka Plan | Bull | Bear | Caution | Durum |
|----------|--------|-----------|------|------|---------|-------|
| Ana App | HEX | `#0a0e1a` | `#10b981` | `#ef4444` | `#f59e0b` | ✅ Tutarlı içinde |
| Benchmark | OKLCH | `oklch(0.11 0.025 230)` | `oklch(0.78 0.18 160)` | `oklch(0.65 0.22 25)` | `oklch(0.75 0.15 75)` | ✅ Modern |
| Momentum Scrapper | Tailwind | `slate-950` | `emerald-500` | `red-400` | `amber-500` | ⚠️ Farklı |

**Kritik Bulgu:** 3 farklı renk sistemi. Ana App HEX, Benchmark OKLCH, Momentum Scrapper Tailwind slate. Bu, kullanıcının uygulamalar arası geçişinde **visual disconnect** yaşamasına neden olur.

**Eksik Renkler:**
- `bull-light`, `bear-light`, `caution-light` varyantları tanımlı değil ama component'lerde `text-emerald-300`, `text-red-300` kullanılıyor
- `backdrop` overlay rengi tanımlı değil
- `focus-ring` belirgin değil
- Gradient color token'ları yok

### 3.2 Tipografi Değerlendirmesi

| Scale | Ana App | Benchmark | Momentum Scrapper | Durum |
|-------|---------|-----------|-------------------|-------|
| XS | 11px | 11px | 10px | ⚠️ 10px çok küçük |
| SM | 13px | 13px | text-xs | ✅ |
| Base | 14px | 14px | text-sm | ✅ |
| LG | 16px | 16px | text-lg | ✅ |
| XL | 20px | 20px | text-xl | ✅ |
| 2XL | 24px | 24px | text-2xl | ✅ |
| 3XL | 30px (Tailwind) | 30px | text-3xl | ⚠️ Scale'de tanımlı değil |
| 4XL | 36px (Tailwind) | 36px | text-4xl | ⚠️ Scale'de tanımlı değil |
| 5XL | 48px (Tailwind) | 48px | text-5xl | ⚠️ Pricing'te kullanılıyor |

**Sorunlar:**
- `text-[10px]` Momentum Scrapper'da çok sık kullanılıyor, okunabilirlik sınırda
- `heading-condensed` (letter-spacing: -0.03em) Türkçe karakterlerde (ğ, ş, ı) birleşme sorunu
- `text-5xl` fiyat gösteriminde overflow riski
- `font-black` (900 weight) Inter dosyası yüklü mü emin değil

### 3.3 Spacing & Radius Değerlendirmesi

**Spacing Scale:**
- Tanımlı: 4, 8, 12, 16, 20, 24, 32, 40px
- Kullanılan: `p-4`, `p-5`, `p-6`, `gap-4`, `gap-6`, `space-y-4`, `space-y-6`
- Tutarlılık: Genel olarak iyi, ancak `p-5` ile `p-6` arasında geçişler farklı panellerde farklı

**Radius Scale:**
- Tanımlı: 4px, 6px, 8px, 12px
- Kullanılan: `rounded-[2rem]` (32px), `rounded-[1.75rem]` (28px), `rounded-[1.6rem]` (25.6px)
- **Kritik:** `radius-xl = 12px` ama admin panel card'ları 32px. shadcn Card 12px, admin panel card 32px. Tutarsızlık.

### 3.4 Custom Utility Classes ("Defined but Abandoned")

| Class | Tanımlı? | Kullanılıyor mu? | Eksik |
|-------|----------|------------------|-------|
| `workspace-panel` | ✅ | ❌ | Gradient + shadow kullanılmıyor |
| `workspace-card` | ✅ | ❌ | `bg-surface` + border kullanılmıyor |
| `workspace-tab` | ✅ | ❌ | Hover/active state'ler kullanılmıyor |
| `badge-strong` | ✅ | ❌ | Inline `text-emerald-300` kullanılıyor |
| `badge-warning` | ✅ | ❌ | Inline `text-amber-300` kullanılıyor |
| `badge-danger` | ✅ | ❌ | Inline `text-red-300` kullanılıyor |
| `tactical-grid` | ✅ | ✅ (DailyReportViewer) | ✅ Kullanılıyor |
| `data-mono` | ✅ | ✅ | ✅ Kullanılıyor |
| `heading-condensed` | ✅ | ❌ | Tanımlı ama kullanılmıyor |
| `text-glow-accent` | ✅ | ❌ | Tanımlı ama kullanılmıyor |
| `terminal-scrollbar` | ✅ | ❌ | CSS utility tanımlı ama kullanılmıyor |
| `pulse-live` | ✅ | ❌ | Tanımlı ama kullanılmıyor |
| `animate-flash` | ✅ | ❌ | Tanımlı ama kullanılmıyor |
| `tactical-card` | ❌ | ✅ (7 tab kullanıyor) | **TANIMSIZ!** |

---

## 4. GRAFİK & VERİ GÖRSELLEŞTİRME ANALİZİ

### 4.1 Recharts Kullanımı

| Kriter | Durum | Sorun |
|--------|-------|-------|
| Chart türleri | Bar, Line, Area, Scatter, Radar, Pie | ✅ Çeşitli |
| Gridlines | `stroke: var(--color-border-subtle)` | ✅ Override var |
| Axis text | `fill: var(--color-text-tertiary)`, `font-size: 11px` | ✅ Override var |
| Tooltip | `borderRadius: 0`, `contentStyle` inline | ⚠️ Sert köşeler, inline stil |
| Legend | Import edilmiş ama kullanılmamış | ⚠️ Dead code |
| Color palette | `oklch`, `#4ade80`, `text-emerald-400` karışık | ❌ Tutarsız |
| Font size | `fontSize: 9`, `fontSize: 10` | ❌ Çok küçük |
| Axis angle | `angle={-20}` | ⚠️ Okunabilirlik zayıf |

### 4.2 Chart Sorunları

| Sorun | Etki | Öneri |
|-------|------|-------|
| `fontSize: 9` | WCAG 2.1'e göre çok küçük | Minimum `11px` yapın |
| `angle={-20}` | Etiketler okunaksız | `tickMargin={10}` ekleyin |
| `borderRadius: 0` tooltip | Sert köşeler app tooltip'inden farklı | `borderRadius: 4` veya `0` tutarlı seçin |
| Legend kullanılmıyor | Import edilmiş ama render edilmiyor | Kaldırın veya ekleyin |
| `oklch` + `#4ade80` karışımı | Renk tutarsızlığı | Tek renk standardı kullanın |
| Scatter nokta boyutu sabit | Sinyal gücü görselleşmiyor | `r={score/10}` dinamik boyut deneyin |
| `height: '300px'` sabit | Responsive chart yok | `h-[300px] md:h-[400px]` yapın |
| Restricted view chart hiding | Grafikler gizleniyor ama CTA yok | Placeholder'a "Abone ol" linki ekleyin |

### 4.3 Grafik İyileştirme Önerileri

1. **Chart Tooltip Bileşeni:** Merkezi `ChartTooltip` bileşeni oluşturun. Tüm tab'lar bunu kullansın.
2. **Font Standardı:** Tüm chart etiketleri minimum `11px`.
3. **Renk Standardı:** `chart-1`...`chart-5` CSS değişkenlerini kullanın. `oklch` ve `#4ade80` karışımından kurtulun.
4. **Legend:** Kullanılan chart'larda legend ekleyin, kullanılmayanlarda import'u kaldırın.
5. **Responsive Height:** Sabit `height` yerine Tailwind `h-[...]` class'ları kullanın.
6. **Dynamic Scatter:** Nokta boyutunu sinyal gücüne bağlayın.
7. **Empty Chart State:** Veri yoksa "Veri bulunamadı" mesajı gösterin, boş chart göstermeyin.

---

## 5. RESPONSIVE & MOBİL ANALİZİ

### 5.1 Tablo Responsive Sorunları

| Tablo | Kolon Sayısı | Mobil Durum | Öneri |
|-------|-------------|-------------|-------|
| MomentumTab | 11 | ❌ Kullanılamaz | Sticky kolonlar veya card view |
| IVCrushTab | 10 | ❌ Kullanılamaz | Sticky kolonlar veya card view |
| CalendarTab | 9 | ❌ Kullanılamaz | Sticky kolonlar veya card view |
| OverviewTab | 5 | ⚠️ Sıkışık | Scrollable |
| SectorTab | 4 | ✅ Kabul edilebilir | |
| RiskTab | 4 | ✅ Kabul edilebilir | |

### 5.2 Layout Responsive Sorunları

| Sorun | Yer | Öneri |
|-------|-----|-------|
| Sidebar `220px` sabit | Benchmark | `clamp(200px, 15vw, 260px)` |
| `xl:grid-cols-[340px_1fr]` dar ekran | Ana Admin | `lg:` breakpoint ekle |
| `text-5xl` fiyat taşması | Pricing | `text-4xl md:text-5xl` |
| Hero sabit 260px | OverviewTab | `min-h-[200px] md:min-h-[260px]` |
| Timeline `left-[140px]` sabit | CalendarTab | `flex-basis` kullan |
| `min-w-[220px]` rapor kartları | Scanner | `md:min-w-[220px]` |

### 5.3 Mobil UX Önerileri

1. **Table → Card View:** `md:` altında tabloları kart listesine dönüştürün. Her row = bir card, her kolon = card içinde `label: value`.
2. **Sticky First Column:** Tablolarda hisse adı ve sinyal kolonları sabit kalsın, gerisi scrollable olsun.
3. **Swipe Hint:** Mobil table'da sağa kaydırma ipucu gösterin.
4. **Hamburger Menu:** Benchmark sidebar'ı mobilde hamburger menü ile açın.
5. **Touch Target:** Buton ve link'ler minimum 44px touch target olsun.

---

## 6. ACCESSIBILITY (ERİŞİLEBİLİRK) ANALİZİ

### 6.1 Mevcut Durum

| Kriter | Durum | Eksiklik |
|--------|-------|----------|
| ARIA etiketleri | ⚠️ Kısmi | `aria-label` eksik (PanelLeftClose, dil switcher, hasAlert dot) |
| Alt text | ✅ Var | `img` alt'ları var |
| Klavye navigasyonu | ❌ Zayıf | Tab butonları `focus-visible` stili yok, ESC popup kapatmıyor |
| Kontrast | ⚠️ Sınırda | `text-muted-foreground` + `text-[11px]` sınırda, `text-[10px]` riskli |
| Semantic HTML | ⚠️ Kısmi | `section` vs `article` karışımı, `dl` kullanılmıyor |
| Table headers | ✅ Var | `th` var ama `scope="col"` eksik |
| Colorblind-friendly | ❌ Yok | Sinyal renkleri yanında ikon/text label yok |
| Screen reader | ⚠️ Kısmi | `aria-live` eksik, dinamik içerik güncellemeleri duyurulmuyor |

### 6.2 Accessibility İyileştirme Önerileri

1. `aria-label` ekleyin: PanelLeftClose, dil switcher, hasAlert dot, dil switcher TR/EN
2. `focus-visible` stili: `focus:outline-none focus:ring-2 focus:ring-accent`
3. Tab butonlarına `role="tab"`, `aria-selected`, `aria-controls` ekleyin
4. `scope="col"` table header'lara ekleyin
5. Sinyal renkleri yanında ikon (▲, ▶, ▼) veya text label kullanın
6. `aria-live="polite"` dinamik içerik güncellemelerine ekleyin
7. `text-[10px]` yerine `text-xs` (13px) kullanın
8. `text-[11px]` yerine `text-xs` kullanın (okunabilirlik için)

---

## 7. KOD KALİTESİ & BAKIM (MAINTAINABILITY)

### 7.1 Dosya Boyutları

| Dosya | Satır | Kabul Edilebilir Limit | Durum |
|-------|-------|------------------------|-------|
| ReportsAdmin.tsx | 1876 | ~300 | ❌ Aşırı uzun |
| EarningReportPlaybookTab.tsx | 691 | ~300 | ❌ Aşırı uzun |
| Pay.tsx | 690 | ~300 | ❌ Aşırı uzun |
| Scanner.tsx | 749 | ~300 | ❌ Aşırı uzun |
| Home.tsx | 644 | ~300 | ❌ Aşırı uzun |
| SmartScanner.tsx | 627 | ~300 | ❌ Aşırı uzun |
| StockDetailModal.tsx | 481 | ~300 | ❌ Aşırı uzun |
| BacktestPanel.tsx | 425 | ~300 | ❌ Aşırı uzun |
| App.tsx | 1146 | ~300 | ⚠️ Çok uzun |
| OverviewTab.tsx | ~400 | ~300 | ⚠️ Uzun |
| MomentumTab.tsx | ~400 | ~300 | ⚠️ Uzun |

### 7.2 Kod Tekrarı (DRY İhlalleri)

| Tekrar | Yer | Etki |
|--------|-----|------|
| Home ↔ Scanner (~%40) | Ana pages | Her değişiklik 2 yerde |
| `persistWeekly/Momentum/DailyReport` | ReportsAdmin | Generic fonksiyon yazılabilir |
| `CustomTooltip` (5 tab) | Ana tabs | Merkezi bileşen gerekli |
| `ScoreBar` (4 tab) | Ana tabs | `<ScoreBar />` bileşeni gerekli |
| `Badge` pattern (3+ tab) | Ana tabs | `<Badge config={cfg} />` gerekli |
| `signalConfig`/`riskConfig` | Ana + Benchmark | `shared/` klasörüne taşınmalı |
| `copy()` nested çağrıları | Pay + ReportsAdmin | Düzeltin |
| `slice(0, 2)` rapor gizleme | Home + Scanner | Açıkça belirtin veya tümünü gösterin |
| Benchmark ↔ v2 (%100) | Benchmark | `shared/` klasörü gerekli |
| ResultsTable ↔ ScanPage | Momentum Scrapper | Tek tablo implementasyonu |

### 7.3 Dead Code

| Dosya/Bileşen | Yer | Etki |
|---------------|-----|------|
| `Legend` import (OverviewTab, SectorTab, RiskTab) | Benchmark | Bundle boyutu |
| `PieChart`, `Pie` import (SectorTab) | Benchmark | Bundle boyutu |
| `RADAR_URL` import (StockDetailTab) | Benchmark | Bundle boyutu |
| `BarChart`, `Cell` import (OptionDetailTab) | Benchmark | Bundle boyutu |
| `MapView` (hiç kullanılmıyor) | Benchmark | Bundle boyutu |
| `Home.tsx` (App.tsx kullanmıyor) | Benchmark | Bundle boyutu |
| `StockDetailTab` (0 byte) | Ana | Import hatası riski |
| `PieChart` import (OverviewTab) | Ana | Dead code |

---

## 8. EYLEM PLANI (Önceliklendirilmiş)

### Aşama 1: Acil Düzeltmeler (1-2 Hafta)

| # | Görev | Zorluk | Etki | Sorumlu |
|---|-------|--------|------|---------|
| A1.1 | NotFound.tsx dark temaya geçir | Düşük | Yüksek | Ana + Benchmark |
| A1.2 | `tactical-card` tanımı ekle veya kullanımları değiştir | Düşük | Yüksek | Ana Tabs |
| A1.3 | StockDetailTab.tsx dosyasını doldur veya sil | Düşük | Yüksek | Ana Tabs |
| A1.4 | ReportPage June raporunda `JuneStockDetailTab` kullan | Düşük | Yüksek | Benchmark |
| A1.5 | Dinamik Tailwind class'larını statikleştir | Düşük | Yüksek | Momentum Scrapper |
| A1.6 | Dead code import'larını kaldır | Düşük | Orta | Benchmark |
| A1.7 | `fontSize: 9` → `11px` chart etiketleri | Düşük | Orta | Ana + Benchmark |
| A1.8 | `key={item.title}` → `key={index}` veya ID | Düşük | Orta | Ana Sayfalar |

### Aşama 2: Kod Yeniden Yapılandırma (2-4 Hafta)

| # | Görev | Zorluk | Etki | Sorumlu |
|---|-------|--------|------|---------|
| A2.1 | Home + Scanner ortak kodları `WorkspaceLayout` bileşeninde birleştir | Orta | Yüksek | Ana Pages |
| A2.2 | ReportsAdmin.tsx 5-6 ayrı bileşene böl | Orta | Yüksek | Ana Admin |
| A2.3 | EarningReportPlaybookTab 691 satırı parçala | Orta | Yüksek | Ana Tabs |
| A2.4 | Pay.tsx COPY objesini `lib/i18n/pay.ts`'e taşı | Düşük | Orta | Ana Pages |
| A2.5 | SmartScanner 627 satırı parçala | Orta | Yüksek | Momentum Scrapper |
| A2.6 | StockDetailModal 481 satırı parçala | Orta | Yüksek | Momentum Scrapper |
| A2.7 | ResultsTable + ScanPage tek tabloya birleştir | Orta | Yüksek | Momentum Scrapper |
| A2.8 | `CustomTooltip` merkezi bileşen oluştur | Düşük | Orta | Ana + Benchmark |
| A2.9 | `<ScoreBar />` merkezi bileşen oluştur | Düşük | Orta | Ana Tabs |
| A2.10 | `<Badge config={cfg} />` merkezi bileşen oluştur | Düşük | Orta | Ana Tabs |

### Aşama 3: Tasarım Sistemi Birleştirme (3-6 Hafta)

| # | Görev | Zorluk | Etki | Sorumlu |
|---|-------|--------|------|---------|
| A3.1 | Tek renk sistemi belirle (Öneri: OKLCH) | Yüksek | Çok Yüksek | Tüm Uygulamalar |
| A3.2 | Momentum Scrapper'ı Ana App renk sistemine geçir | Yüksek | Çok Yüksek | Momentum Scrapper |
| A3.3 | Ana App HEX → OKLCH geçişi | Yüksek | Çok Yüksek | Ana App |
| A3.4 | `rounded-[2rem]` → `radius-3xl` (24px) veya `radius-4xl` (32px) | Orta | Orta | Ana + Benchmark |
| A3.5 | Font import'ları ekle (Google Fonts) | Düşük | Orta | Benchmark + Momentum Scrapper |
| A3.6 | Custom utility class'ları kullanıma al | Düşük | Orta | Ana App |
| A3.7 | `text-[10px]`, `text-[11px]` → `text-xs` (13px) | Düşük | Orta | Tüm Uygulamalar |
| A3.8 | Tema yönetimini birleştir (ThemeContext tek kaynak) | Orta | Yüksek | Ana App |
| A3.9 | ManusDialog'ı tema değişkenlerine bağla | Düşük | Orta | Ana App |
| A3.10 | Shadow/Glow scale tanımla | Düşük | Orta | Tüm Uygulamalar |

### Aşama 4: UX & Responsive İyileştirmeler (4-6 Hafta)

| # | Görev | Zorluk | Etki | Sorumlu |
|---|-------|--------|------|---------|
| A4.1 | Tablo responsive: sticky kolonlar + card view | Yüksek | Çok Yüksek | Ana + Benchmark |
| A4.2 | Toast/notification sistemi ekle (Sonner) | Orta | Yüksek | Ana Admin |
| A4.3 | Loading skeleton bileşenleri ekle | Orta | Yüksek | Tüm Uygulamalar |
| A4.4 | Empty state bileşeni oluştur (tek standart) | Düşük | Orta | Tüm Uygulamalar |
| A4.5 | `aria-label`, `focus-visible`, `role` eklemeleri | Düşük | Orta | Tüm Uygulamalar |
| A4.6 | Sinyal renkleri yanında ikon/text label ekle | Düşük | Orta | Tüm Uygulamalar |
| A4.7 | Keyboard navigasyonu (tablo satırları, popup) | Orta | Orta | Tüm Uygulamalar |
| A4.8 | `scroll-behavior: smooth` ekle | Düşük | Düşük | Benchmark |

### A5. Veri & Mantık İyileştirmeleri (Paralel)

| # | Görev | Zorluk | Etki | Sorumlu |
|---|-------|--------|------|---------|
| A5.1 | Hardcoded ticker strings → veri-driven strateji | Orta | Yüksek | Ana + Benchmark |
| A5.2 | Hardcoded timeline data → API'den çek | Orta | Yüksek | Ana Tabs |
| A5.3 | Hardcoded risk metinleri → dinamik | Orta | Yüksek | Ana Tabs |
| A5.4 | `goldenRules[0]` → tüm kuralları göster | Düşük | Orta | Ana Tabs |
| A5.5 | `slice(0, 2)` mantığını açıkla veya tümünü göster | Düşük | Orta | Ana Pages |
| A5.6 | `visibleReports` limiti kaldır veya "Daha fazla" ekle | Düşük | Orta | Ana Pages |
| A5.7 | `generateMockResult` → gerçek API | Yüksek | Yüksek | Momentum Scrapper |
| A5.8 | AnalysisPage random veri → gerçek veri | Yüksek | Yüksek | Momentum Scrapper |

---

## 9. ÖZET ve ÖNERİLER

### 9.1 En Kritik 10 İyileştirme

1. **NotFound dark tema** — Kullanıcı uygulamadan çıktığını hissetmemeli
2. **tactical-card tanımlama** — 7 tab'ın kartları bozuk görünebilir
3. **Home + Scanner kod birleştirme** — DRY ihlali, bakım maliyeti
4. **ReportsAdmin parçalama** — 1876 satır test edilemez
5. **Renk sistemi birleştirme** — 3 farklı sistem visual disconnect yaratıyor
6. **Tablo responsive** — 11 kolon mobilde kullanılamaz
7. **StockDetailTab** — 0 byte dosya, kullanılmıyor veya bozuk
8. **Dinamik Tailwind class düzeltme** — Stil uygulanmıyor
9. **Hardcoded ticker düzeltme** — Maintenance nightmare
10. **Toast/loading feedback** — Kullanıcı işlem durumunu bilmiyor

### 9.2 Tasarım Sistemi Vizyonu

**Hedef:** Tek, tutarlı, modern bir tasarım dili.

| Özellik | Öneri |
|---------|-------|
| Renk uzayı | OKLCH (perceptually uniform, modern) |
| Arka plan | `oklch(0.11 0.025 230)` (dark navy) |
| Card | `oklch(0.15 0.03 225)` + border |
| Bull | `oklch(0.78 0.18 160)` |
| Bear | `oklch(0.65 0.22 25)` |
| Caution | `oklch(0.75 0.15 75)` |
| Font body | Inter |
| Font heading | Barlow Condensed (letter-spacing: -0.02em) |
| Font data | JetBrains Mono |
| Radius | 4px, 6px, 8px, 12px, 16px, 24px, 32px scale |
| Shadow | Glow scale (sm, md, lg) tanımlı |
| Spacing | 4, 8, 12, 16, 20, 24, 32, 40px |

### 9.3 Sonuç

Gistify, **fonksiyonel olarak zengin** ama **UI/UX tutarlılığı ve bakılabilirlik açısından iyileştirmeye açık** bir proje. En büyük sorun, 3 farklı uygulamanın 3 farklı tasarım dili kullanması ve kod tekrarıdır. Acil eylem planı uygulandığında, kullanıcı deneyimi önemli ölçüde iyileşir, bakım maliyeti düşer ve marka kimliği güçlenir.

**Önerilen sıralama:**
1. Acil düzeltmeler (Aşama 1) — Hemen başlayın
2. Kod yeniden yapılandırma (Aşama 2) — 2-4 hafta içinde
3. Tasarım sistemi birleştirme (Aşama 3) — 3-6 hafta içinde
4. UX & Responsive (Aşama 4) — Paralel olarak
5. Veri & Mantık (Aşama 5) — Paralel olarak

---

*Rapor Tarihi: 12 Haziran 2026*  
*Analiz Kapsamı: Gistify Ana App + Benchmark App + Momentum Scrapper*  
*Analiz Metodu: 5 paralel UI/UX analiz sub-agent + orchestrator birleştirme*


---

# Bölüm 10: Algoritmik Mimari Tasarım — Gistify Dinamik MD Deploy Sistemi

## 10.1 Sistem Genel Bakış

Gistify dinamik MD deploy pipeline’ı, statik Markdown dosyalarını runtime’da keşfedip, parse edip, normalize edip, React tab’ları olarak render eden ve son kullanıcıya deploy eden bir **content-as-code** pipeline’dır. Mevcut sistemde her route (`/app`, `/momentum`, `/daily-report`, `/flow`) manuel tab yapılarıyla çalışmaktadır. Yeni mimari, bu route’lara **dinamik MD tab discovery** yeteneği kazandırır.

### Yüksek Seviyeli Mimari Diyagram (Metinsel)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  MD Source      │────▶│  File Watcher   │────▶│  Parser         │
│  (FS / Git /    │     │  (chokidar)     │     │  (gray-matter   │
│   Upload)       │     │                 │     │   + remark)     │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Renderer       │◄────│  Normalizer     │◄────│  Meta Extractor │
│  (react-markdown│     │  (Unified       │     │  (frontmatter   │
│   + custom      │     │   Schema)       │     │   validation)   │
│   components)   │     │                 │     │                 │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Tab Registry   │◄────│  Router         │◄────│  Cache Layer    │
│  (per-route)    │     │  (wouter +      │     │  (LRU + memo)   │
│                 │     │   query param)  │     │                 │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  React UI       │◄────│  ErrorBoundary  │
│  (shadcn/ui +   │     │  + Fallback     │
│   Tailwind)     │     │                 │
└─────────────────┘     └─────────────────┘
```

### Veri Akışı (Data Flow)

1. **MD dosya ekleme**: Dosya sistemine yeni `.md` dosyası yazılır veya admin panelden upload edilir.
2. **Parse**: `gray-matter` YAML frontmatter’ı ile Markdown body’yi ayırır. `remark` AST üretir.
3. **Meta veri çıkarımı**: Frontmatter’dan `title`, `date`, `category`, `tags`, `author`, `status`, `route`, `priority` alanları çıkarılır.
4. **Normalize**: Farklı MD formatları (plain, table-heavy, chart-heavy) unified `NormalizedContent` şemasına çevrilir.
5. **Tab listesi güncelleme**: `TabRegistry` ilgili route’un tab listesini günceller. Sıralama `priority` ve `date` alanlarına göre yapılır.
6. **Render**: `react-markdown` + custom component mapping ile MD → React dönüşümü gerçekleşir.
7. **Deploy**: Kullanıcı ilgili route’a geldiğinde tab listesi API veya FS cache’den çekilir, aktif tab render edilir.

---

## 10.2 MD Dosya Pipeline

### 10.2.1 Dosya İzleme (File Watcher)

**Teknoloji**: `chokidar` (v4+)

Gistify projesi Windows + Git Bash ortamında çalıştığı için `fs.watch` yerine **cross-platform çalışan `chokidar` tercih edilir**. `fs.watch` Windows’ta recursive dizin izlemede stabilite sorunları yaşayabilir.

```typescript
// server/contentWatcher.ts
import chokidar from "chokidar";
import { processMarkdownFile } from "./contentPipeline";

const WATCH_ROOTS = {
  app: path.join(process.cwd(), "earningreport"),
  momentum: path.join(process.cwd(), "momentum"),
  "daily-report": path.join(process.cwd(), "dailyreport"),
  flow: path.join(process.cwd(), "flow"),
};

export function startContentWatchers() {
  Object.entries(WATCH_ROOTS).forEach(([route, rootPath]) => {
    const watcher = chokidar.watch(`${rootPath}/**/*.md`, {
      ignored: /(^|[\/\\])\../, // dotfiles
      persistent: true,
      ignoreInitial: false, // Başlangıçta mevcut dosyaları da process et
      awaitWriteFinish: {
        stabilityThreshold: 300, // 300ms yazma stabilitesi
        pollInterval: 100,
      },
    });

    watcher
      .on("add", (filePath) => processMarkdownFile(route, filePath, "add"))
      .on("change", (filePath) => processMarkdownFile(route, filePath, "change"))
      .on("unlink", (filePath) => processMarkdownFile(route, filePath, "unlink"));
  });
}
```

**Polling stratejisi**: `chokidar` native OS events’leri kullanır. Network mount veya Docker volume senaryolarında `usePolling: true` fallback olarak aktif edilebilir.

**İzlenen dizinler**:
- `earningreport/` → `/app` route
- `momentum/` → `/momentum` route  
- `dailyreport/` → `/daily-report` route
- `flow/` → `/flow` route

### 10.2.2 Parser

**Stack**: `gray-matter` + `remark` + `remark-gfm` + `remark-frontmatter`

```typescript
// server/contentPipeline.ts
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive"; // :::chart, :::alert desteği

interface ParsedContent {
  data: ContentMeta;
  content: string;       // Markdown body (frontmatter hariç)
  ast: Root;             // remark AST
  raw: string;           // Orijinal dosya içeriği
}

export async function parseMarkdown(raw: string): Promise<ParsedContent> {
  const { data, content, matter: rawFrontmatter } = matter(raw, {
    engines: {
      yaml: (s) => yaml.parse(s, { schema: "json" }),
    },
  });

  const processor = remark()
    .use(remarkGfm)      // Tables, task lists, strikethrough
    .use(remarkDirective); // Custom directives :::chart, :::alert

  const ast = processor.parse(content);

  return {
    data: normalizeMeta(data),
    content,
    ast,
    raw,
  };
}
```

**Frontmatter Şeması (Zorunlu + Opsiyonel)**:

```yaml
---
title: "CPI Sonrası Setup Değerlendirmesi"
date: "2026-06-10"
category: "setup"
tags: ["cpi", "setup", "spx"]
author: "Gistify Agent"
status: "published"        # draft | published | archived
route: "app"               # app | momentum | daily-report | flow
priority: 10               # Sıralama: düşük = önce
slug: "cpi-sonrasi-setup"  # URL-friendly identifier
cover: "./assets/cpi.png"  # Opsiyonel kapak görseli
---
```

### 10.2.3 Normalizer

Farklı formatlardaki MD dosyalarını aynı `NormalizedContent` yapısına çevirir. Bu, renderer’ın her zaman tutarlı veri almasını garanti eder.

```typescript
// shared/contentSchema.ts
export interface NormalizedContent {
  id: string;              // slug + date hash
  meta: ContentMeta;
  body: string;            // İşlenmiş Markdown body
  tables: NormalizedTable[]; // Çıkarılmış tablolar
  charts: ChartEmbed[];    // :::chart directive’lerinden çıkarılmış chart config
  directives: Directive[]; // :::alert, :::card, vb.
  assets: string[];        // Görseller, dosya referansları
}
```

**Desteklenen Formatlar**:

| Format | Açıklama | Normalizasyon |
|--------|----------|---------------|
| `frontmatter` | Standart YAML + MD | Doğrudan parse edilir |
| `plain_md` | Frontmatter yok | `title` dosya adından, `date` mtime’dan türetilir |
| `table-heavy` | Çok sayıda tablo | Tablolar `NormalizedTable` array’ine çıkarılır, body’de referans bırakılır |
| `chart-heavy` | `:::chart` direktifleri | JSON config parse edilir, `ChartEmbed` array’ine dönüştürülür |

```typescript
// server/normalizer.ts
export function normalizeContent(parsed: ParsedContent, filePath: string): NormalizedContent {
  const meta = parsed.data;
  
  // Plain MD fallback: frontmatter yoksa
  if (!meta.title) {
    meta.title = path.basename(filePath, ".md").replace(/[-_]/g, " ");
  }
  if (!meta.date) {
    meta.date = new Date(fs.statSync(filePath).mtime).toISOString().split("T")[0];
  }
  if (!meta.slug) {
    meta.slug = slugify(meta.title);
  }
  if (!meta.status) {
    meta.status = "published";
  }

  // Directive extraction
  const directives = extractDirectives(parsed.ast);
  const charts = directives.filter((d) => d.name === "chart").map(parseChartDirective);
  const alerts = directives.filter((d) => d.name === "alert");

  // Table extraction
  const tables = extractTables(parsed.ast);

  return {
    id: `${meta.slug}-${meta.date}`,
    meta,
    body: parsed.content,
    tables,
    charts,
    directives: alerts, // ve diğer directive'ler
    assets: extractAssets(parsed.content, filePath),
  };
}
```

### 10.2.4 Renderer

**Client tarafı**: `react-markdown` (v9+) + `remark-gfm` + `rehype-highlight` + `rehype-sanitize`

```typescript
// client/src/components/MarkdownRenderEngine.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";
import { CustomTable, CustomCode, CustomAlert, CustomChart } from "./mdComponents";

const customSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "div", "span"],
  attributes: {
    ...defaultSchema.attributes,
    "*": ["className", "style"],
  },
};

export function MarkdownRenderEngine({ content, charts }: { content: string; charts: ChartEmbed[] }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkDirective]}
      rehypePlugins={[rehypeHighlight, [rehypeSanitize, customSchema]]}
      components={{
        table: CustomTable,      // shadcn/ui Table
        code: CustomCode,        // shadcn Card + PrismJS
        pre: CustomPre,          // Scroll container
        img: CustomImage,        // Lazy loading + placeholder
        div: (props) => {
          // :::chart directive render
          if (props.className?.includes("chart-directive")) {
            const chartId = props["data-chart-id"];
            const config = charts.find((c) => c.id === chartId);
            return config ? <CustomChart config={config} /> : <ChartFallback />;
          }
          // :::alert directive render
          if (props.className?.includes("alert-directive")) {
            return <CustomAlert variant={props["data-variant"]}>{props.children}</CustomAlert>;
          }
          return <div {...props} />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

**Tailwind Class Mapping**:

```typescript
// client/src/components/mdComponents/CustomTable.tsx
export function CustomTable({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm text-left" {...props}>
        {children}
      </table>
    </div>
  );
}

export function CustomTableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">{children}</thead>;
}

export function CustomTableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-border transition-colors hover:bg-muted/30">{children}</tr>;
}
```

**Code Block Highlighting**: `PrismJS` via `rehype-highlight`. Tema: `atom-dark` veya `vsc-dark-plus`. Dil tanıma: `tsx`, `typescript`, `yaml`, `json`, `sql`, `python`.

**Chart Embedding**: MD içinde Recharts chart tanımlama:

```markdown
:::chart{type="area" data="./assets/chart-data.json" xKey="date" yKey="price"}
:::
```

Runtime’da `CustomChart` component’i JSON config’i alıp Recharts `AreaChart`, `BarChart`, `LineChart` vb. render eder.

### 10.2.5 Cache

**Çift katmanlı cache stratejisi**:

1. **Server-side LRU**: `lru-cache` (v11+). Parsed + normalized content cache’lenir. Key: `route:slug:date`.
2. **Client-side memoization**: React `useMemo` + `useCallback`. Tab content değişmeden re-render engellenir.

```typescript
// server/contentCache.ts
import { LRUCache } from "lru-cache";

const contentCache = new LRUCache<string, NormalizedContent>({
  max: 500,               // Max 500 doküman
  ttl: 1000 * 60 * 30,    // 30 dakika TTL
  updateAgeOnGet: true,   // Erişimde TTL yenile
  allowStale: false,      // Stale data serve etme
});

export function getCachedContent(route: string, slug: string): NormalizedContent | undefined {
  return contentCache.get(`${route}:${slug}`);
}

export function setCachedContent(route: string, slug: string, content: NormalizedContent) {
  contentCache.set(`${route}:${slug}`, content);
}

export function invalidateCache(route: string, slug: string) {
  contentCache.delete(`${route}:${slug}`);
  // WebSocket / SSE broadcast
  broadcastCacheInvalidation(route, slug);
}
```

**Invalidation Stratejisi**:
- **File Watcher**: `change` event’inde cache entry silinir.
- **Admin Upload**: Yeni dosya upload edildiğinde ilgili route cache’i temizlenir.
- **Git Hook**: Push sonrası tüm cache flush edilir (veya diff-based invalidation).
- **TTL**: 30 dakika. Dosya değişmediyse cache’den serve edilir.

### 10.2.6 Error Handling

| Hata Tipi | Gradyasyon | Kullanıcı Deneyimi |
|-----------|------------|-------------------|
| Parse hatası (YAML syntax) | `gray-matter` hata fırlatır → `catch` | Tab görünür, içerik yerine "Parse hatası" alert’i gösterilir. Frontmatter eksikse fallback meta üretilir. |
| Eksik frontmatter | Zorunlu alan `title` yoksa fallback | Dosya adı `title` olarak kullanılır. `date` = mtime. |
| Boş dosya | `content.length === 0` | "Bu rapor henüz içerik içermiyor" placeholder. |
| Invalid format (binary, .exe) | `mime-types` check | Dosya reddedilir, admin panelde hata mesajı. |
| Render crash | React ErrorBoundary | "Bu içerik render edilemiyor. Lütfen daha sonra tekrar deneyin." |

```typescript
// server/contentPipeline.ts
export async function processMarkdownFile(route: string, filePath: string, event: "add" | "change" | "unlink") {
  try {
    if (event === "unlink") {
      tabRegistry.remove(route, filePath);
      invalidateCache(route, pathToSlug(filePath));
      return;
    }

    const raw = await fs.promises.readFile(filePath, "utf8");
    if (!raw.trim()) {
      logger.warn(`Boş MD dosyası: ${filePath}`);
      return;
    }

    const parsed = await parseMarkdown(raw);
    const normalized = normalizeContent(parsed, filePath);
    
    // Route override check
    if (normalized.meta.route && normalized.meta.route !== route) {
      logger.warn(`Route mismatch: ${filePath} meta.route=${normalized.meta.route}, expected=${route}`);
      // Dosya mevcut route dışında bir route’a aitse, o route’un registry’sine ekle
      route = normalized.meta.route;
    }

    tabRegistry.upsert(route, normalized);
    setCachedContent(route, normalized.meta.slug, normalized);
  } catch (err) {
    logger.error(`MD pipeline hatası: ${filePath}`, err);
    // Graceful: registry’e hata flag’li entry ekle
    tabRegistry.upsertError(route, filePath, err instanceof Error ? err.message : "Bilinmeyen hata");
  }
}
```

---

## 10.3 Tab Sistemi

### 10.3.1 Tab Registry

**Mimari Kararı**: **Her route’un kendi Tab Registry’si olacak**. Global tek registry karmaşayı artırır; route izolasyonu daha temizdir. Ancak registry yönetimi merkezi `TabRegistryManager` üzerinden yapılır.

```typescript
// shared/tabRegistry.ts
export interface TabEntry {
  id: string;              // slug
  label: string;            // title (frontmatter)
  meta: ContentMeta;
  contentRef: string;       // Cache key veya file path
  status: "ok" | "error" | "loading";
  errorMessage?: string;
  priority: number;
  date: string;             // ISO date
  category?: string;
  tags: string[];
}

export interface TabRegistryState {
  tabs: TabEntry[];
  lastUpdated: string;
  route: string;
}

class TabRegistry {
  private registries = new Map<string, TabRegistryState>();

  upsert(route: string, content: NormalizedContent) {
    const state = this.getOrCreate(route);
    const existingIndex = state.tabs.findIndex((t) => t.id === content.meta.slug);
    const entry: TabEntry = {
      id: content.meta.slug,
      label: content.meta.title,
      meta: content.meta,
      contentRef: `${route}:${content.meta.slug}`,
      status: "ok",
      priority: content.meta.priority ?? 0,
      date: content.meta.date,
      category: content.meta.category,
      tags: content.meta.tags ?? [],
    };

    if (existingIndex >= 0) {
      state.tabs[existingIndex] = entry;
    } else {
      state.tabs.push(entry);
    }

    this.sortTabs(state);
    state.lastUpdated = new Date().toISOString();
  }

  upsertError(route: string, filePath: string, errorMessage: string) {
    const state = this.getOrCreate(route);
    const slug = pathToSlug(filePath);
    const existingIndex = state.tabs.findIndex((t) => t.id === slug);
    const entry: TabEntry = {
      id: slug,
      label: path.basename(filePath),
      meta: {} as ContentMeta,
      contentRef: "",
      status: "error",
      errorMessage,
      priority: 0,
      date: new Date().toISOString(),
      tags: [],
    };

    if (existingIndex >= 0) {
      state.tabs[existingIndex] = entry;
    } else {
      state.tabs.push(entry);
    }
  }

  remove(route: string, filePath: string) {
    const state = this.registries.get(route);
    if (!state) return;
    state.tabs = state.tabs.filter((t) => t.id !== pathToSlug(filePath));
  }

  getTabs(route: string): TabEntry[] {
    return this.registries.get(route)?.tabs ?? [];
  }

  private getOrCreate(route: string): TabRegistryState {
    if (!this.registries.has(route)) {
      this.registries.set(route, { tabs: [], lastUpdated: new Date().toISOString(), route });
    }
    return this.registries.get(route)!;
  }

  private sortTabs(state: TabRegistryState) {
    state.tabs.sort((a, b) => {
      // 1. Priority (düşük değer = önce)
      if (a.priority !== b.priority) return a.priority - b.priority;
      // 2. Date (yeni = önce)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }
}

export const tabRegistry = new TabRegistry();
```

### 10.3.2 Tab Discovery

Tab discovery **iki kaynaktan** yapılır:

1. **Dosya sistemi (File Watcher)**: `chokidar` yeni dosya ekledikçe registry güncellenir. **Primary source**.
2. **API (Manual trigger)**: Admin panelden upload veya `POST /api/content/:route/refresh` endpoint’i ile manuel tarama.

```typescript
// server/index.ts — endpoint
app.get("/api/content/:route/tabs", (req, res) => {
  const route = req.params.route;
  const tabs = tabRegistry.getTabs(route);
  res.json({ tabs, lastUpdated: tabRegistry.getLastUpdated(route) });
});

app.post("/api/content/:route/refresh", requireAdmin, async (req, res) => {
  const route = req.params.route;
  const rootPath = WATCH_ROOTS[route as keyof typeof WATCH_ROOTS];
  if (!rootPath) return res.status(400).json({ error: "Bilinmeyen route" });

  // Tüm .md dosyalarını rescan et
  const files = await glob(`${rootPath}/**/*.md`);
  for (const file of files) {
    await processMarkdownFile(route, file, "change");
  }
  res.json({ scanned: files.length, tabs: tabRegistry.getTabs(route) });
});
```

### 10.3.3 Tab Ordering

Sıralama mantığı **3 katmanlı**:

1. **`priority`**: `number` (0-100). Düşük değer = önce. Örn: `priority: 5` olan "Günlük Özet" her zaman üstte.
2. **`date`**: Yeni tarih önce. Aynı priority içinde tarih sıralar.
3. **`title`**: Tertiary sort, alfabetik (opsiyonel).

Admin panelden `priority` override edilebilir. Bu durumda `meta` içine `adminPriority` eklenir ve normalizer bunu `priority` olarak kullanır.

### 10.3.4 Tab Persistence

Kullanıcının son seçtiği tab **localStorage**’da saklanır.

```typescript
// client/src/hooks/useTabPersistence.ts
const TAB_STORAGE_KEY = "gistify:active-tab";

export function useTabPersistence(route: string) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(`${TAB_STORAGE_KEY}:${route}`);
      return stored || "";
    } catch {
      return "";
    }
  });

  const persistTab = useCallback((tabId: string) => {
    try {
      localStorage.setItem(`${TAB_STORAGE_KEY}:${route}`, tabId);
    } catch {
      // Storage quota exceeded — ignore
    }
    setActiveTab(tabId);
  }, [route]);

  return { activeTab, persistTab };
}
```

**Karar**: URL query param (`?tab=rapor-1`) **kullanılmayacak**. Sebep:
- `wouter` query param parsing’i minimaldir, URL state management karmaşıklığı artırır.
- localStorage daha hızlıdır, sayfa refresh sonrası kullanıcı deneyimi korunur.
- Paylaşılabilir linkler için **shareable link** özelliği ayrıca implemente edilir (Bölüm 10.4.4).

### 10.3.5 Active Tab State

```typescript
// client/src/components/DynamicTabShell.tsx
export function DynamicTabShell({ route, language }: { route: string; language: AppLanguage }) {
  const { data: tabs, isLoading } = useSWR(`/api/content/${route}/tabs`, fetcher);
  const { activeTab, persistTab } = useTabPersistence(route);
  const { data: content } = useSWR(
    activeTab ? `/api/content/${route}/${activeTab}` : null,
    fetcher
  );

  const defaultTab = tabs?.[0]?.id;
  const resolvedTab = activeTab && tabs?.find((t: TabEntry) => t.id === activeTab)
    ? activeTab
    : defaultTab;

  useEffect(() => {
    if (resolvedTab && resolvedTab !== activeTab) {
      persistTab(resolvedTab);
    }
  }, [resolvedTab, activeTab, persistTab]);

  return (
    <div className="space-y-4">
      <TabStrip tabs={tabs} activeTab={resolvedTab} onChange={persistTab} />
      <AnimatePresence mode="wait">
        {content ? (
          <motion.div key={resolvedTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <MarkdownRenderEngine content={content.body} charts={content.charts} />
          </motion.div>
        ) : (
          <ContentSkeleton />
        )}
      </AnimatePresence>
    </div>
  );
}
```

### 10.3.6 Tab Rendering

**Lazy Loading**: Her tab kendi MD content’ini **on-demand** fetch eder. İlk yüklemede sadece tab listesi (meta) gelir; content seçim anında çekilir.

**Pre-fetching**: `useSWR` `preload` API’si ile mouse hover anında content pre-fetch edilir.

```typescript
// Pre-fetch on hover
const handleTabHover = (tabId: string) => {
  preload(`/api/content/${route}/${tabId}`, fetcher);
};
```

---

## 10.4 Render Engine Detayları

### 10.4.1 Markdown → HTML

`remark` + `remark-gfm` + `remark-directive` pipeline’ı:

```
Raw MD ──▶ remark-parse ──▶ remark-gfm ──▶ remark-directive ──▶ remark-rehype ──▶ rehype-highlight ──▶ rehype-sanitize ──▶ React
```

`remark-rehype` dönüşümü HTML AST üretir. `rehype-sanitize` XSS koruması sağlar. `rehype-highlight` code block’ları renklendirir.

### 10.4.2 HTML → Styled HTML (Tailwind + shadcn/ui)

`react-markdown` `components` prop’u ile her HTML elementi shadcn/ui karşılığına map edilir:

| Markdown Element | shadcn/ui Component | Tailwind Classes |
|------------------|-------------------|----------------|
| `table` | `Table` wrapper | `overflow-x-auto rounded-xl border border-border` |
| `thead` | `TableHeader` | `bg-muted/50 text-xs uppercase` |
| `tr` | `TableRow` | `border-b border-border hover:bg-muted/30` |
| `th` | `TableHead` | `px-4 py-3 font-medium text-muted-foreground` |
| `td` | `TableCell` | `px-4 py-3` |
| `code` (inline) | `code` | `rounded bg-muted px-1.5 py-0.5 text-sm font-mono` |
| `pre > code` | `Card` container | `rounded-xl border border-border bg-card p-4 overflow-x-auto` |
| `blockquote` | `Alert` | `border-l-4 border-primary bg-muted/30 pl-4 py-2` |
| `img` | `LazyImage` | `rounded-xl border border-border object-cover` |
| `h1` | `h1` | `text-2xl font-bold tracking-tight mt-8 mb-4` |
| `h2` | `h2` | `text-xl font-semibold tracking-tight mt-6 mb-3 border-b border-border pb-2` |
| `h3` | `h3` | `text-lg font-semibold mt-4 mb-2` |
| `ul` | `ul` | `list-disc pl-6 space-y-1 my-4` |
| `ol` | `ol` | `list-decimal pl-6 space-y-1 my-4` |
| `a` | `a` | `text-primary underline underline-offset-4 hover:text-primary/80` |
| `hr` | `Separator` | `my-8 border-border` |

### 10.4.3 Custom Directives

`remark-directive` ile tanımlanan custom directive’ler:

```markdown
:::alert{type="warning"}
Bu rapor yüksek volatilite içerir. Risk yönetimi kurallarınıza sadık kalın.
:::

:::card{title="IV Crush Skoru" variant="metric"}
- Ticker: AAPL
- Skor: 87
- Risk: Yüksek
:::

:::chart{type="bar" data="inline"}
{"labels": ["AAPL", "TSLA", "NVDA"], "datasets": [{"label": "IV", "data": [45, 62, 58]}]}
:::
```

Directive parser:

```typescript
// server/directiveParser.ts
function parseDirective(node: DirectiveNode): Directive {
  return {
    name: node.name,       // "alert", "card", "chart"
    attributes: node.attributes || {},
    children: node.children,
  };
}
```

### 10.4.4 Chart Embedding

MD içinde Recharts chart tanımlama:

```markdown
:::chart
{
  "type": "area",
  "data": "./assets/momentum-area.json",
  "xKey": "date",
  "yKeys": ["price", "volume"],
  "colors": ["#10b981", "#6366f1"],
  "height": 320
}
:::
```

Runtime render:

```typescript
// client/src/components/mdComponents/CustomChart.tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function CustomChart({ config }: { config: ChartEmbed }) {
  const data = useChartData(config.data); // fetch JSON data

  return (
    <Card className="my-6 p-4">
      <ResponsiveContainer width="100%" height={config.height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color-${config.yKeys[0]}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={config.colors[0]} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={config.colors[0]} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey={config.xKey} />
          <YAxis />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
          <Area type="monotone" dataKey={config.yKeys[0]} stroke={config.colors[0]} fillOpacity={1} fill={`url(#color-${config.yKeys[0]})`} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
```

### 10.4.5 Image Handling

MD’deki görseller:
- **Relative path**: `./assets/gorsel.png` → server’dan serve edilir, path çözümlenir.
- **Absolute URL**: `https://cdn.example.com/gorsel.png` → doğrudan kullanılır.
- **Lazy loading**: `loading="lazy"` + `IntersectionObserver`.
- **Placeholder**: Blur-up placeholder (low-res base64 veya dominant color).
- **Optimizasyon**: `sharp` ile server-side resize/optimize. `?w=800&format=webp` query param’ları.

```typescript
// client/src/components/mdComponents/CustomImage.tsx
export function CustomImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative my-6 overflow-hidden rounded-xl border border-border">
      {!loaded && <ImageSkeleton />}
      <img
        src={src}
        alt={alt || ""}
        loading="lazy"
        className={cn("w-full object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </div>
  );
}
```

### 10.4.6 Math Rendering

KaTeX desteği (opsiyonel, ileri aşama):

```markdown
$$
\text{IV Crush} = \frac{\sigma_{\text{pre}} - \sigma_{\text{post}}}{\sigma_{\text{pre}}} \times 100
$$
```

```typescript
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// react-markdown plugins array’ine ekle
rehypePlugins: [rehypeKatex]
```

---

## 10.5 Performans Stratejisi

### 10.5.1 Lazy Loading

- **Tab content**: Sadece aktif tab’ın MD content’i render edilir. Diğer tab’lar DOM’a hiç girmez.
- **Images**: `loading="lazy"` + `IntersectionObserver`. Görünür alana giren görsel yüklenir.
- **Charts**: `CustomChart` component’i `React.lazy()` ile sarmalanır. Chart kütüphanesi (Recharts) sadece chart içeren sayfada yüklenir.
- **Math**: KaTeX CSS ve parser sadece math içeren MD’lerde yüklenir.

### 10.5.2 Code Splitting

Vite `manualChunks` konfigürasyonu:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "md-render": ["react-markdown", "remark-gfm", "rehype-highlight", "rehype-sanitize"],
          "charts": ["recharts"],
          "katex": ["katex", "rehype-katex"],
        },
      },
    },
  },
});
```

### 10.5.3 SSR vs CSR

| Route | Strateji | Gerekçe |
|-------|----------|---------|
| `/app` (Earnings) | **CSR** | İçerik admin panelden dinamik, statik build zamanı bilinmez. SEO kritik değil (auth protected). |
| `/momentum` | **CSR** | Aynı gerekçe. Scanner verileri real-time. |
| `/daily-report` | **CSR** | Günlük raporlar dinamik. |
| `/flow` | **CSR** | Sosyal özellikler (beğenme, yorum) tamamen client-driven. |
| Landing (`/`) | **SSG** (mevcut) | Marketing sayfası, statik. |

**SSR not**: İçerik dinamik olduğundan ISR (Incremental Static Regeneration) veya SSR anlamlı değildir. Her istekte güncel içerik gösterilmelidir. CSR + API caching yeterlidir.

### 10.5.4 Pre-fetching

```typescript
// client/src/components/TabStrip.tsx
import { preload } from "swr";

export function TabStrip({ tabs, activeTab, onChange, route }: TabStripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn("tab-button", activeTab === tab.id && "active")}
          onClick={() => onChange(tab.id)}
          onMouseEnter={() => preload(`/api/content/${route}/${tab.id}`, fetcher)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

### 10.5.5 Bundle Size

| Kütüphane | Gzip | Code Splitting | Not |
|-----------|------|----------------|-----|
| `react-markdown` | ~12KB | `md-render` chunk | Core render engine |
| `remark-gfm` | ~8KB | `md-render` chunk | Tables, task lists |
| `rehype-highlight` | ~5KB | `md-render` chunk | Code highlighting |
| `rehype-sanitize` | ~4KB | `md-render` chunk | XSS koruması |
| `recharts` | ~45KB | `charts` chunk | Sadece chart sayfalarında |
| `katex` | ~25KB | `katex` chunk | Sadece math sayfalarında |
| **Toplam (min)** | ~29KB | — | Chart/math yoksa |
| **Toplam (max)** | ~99KB | — | Tüm özellikler aktif |

**Optimizasyon**: `React.lazy()` + `Suspense` ile MD render engine sadece `/app`, `/momentum`, `/daily-report`, `/flow` route’larında yüklenir. Landing page ve marketing route’ları etkilenmez.

---

## 10.6 Güvenlik

### 10.6.1 XSS Koruması

MD içindeki HTML injection, script tag, event handler **engellenmelidir**.

**Katman 1 — Parse time**: `rehype-sanitize` ile `hast-util-sanitize` şeması. İzin verilen tag’ler: `div`, `span`, `p`, `h1-h6`, `ul`, `ol`, `li`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `a`, `img`, `code`, `pre`, `blockquote`, `strong`, `em`, `del`, `hr`, `br`.

**Yasaklanan tag’ler**: `script`, `style`, `iframe`, `object`, `embed`, `form`, `input`, `textarea`, `button`, `meta`, `link`.

**Yasaklanan attribute’lar**: `on*` event handler’lar, `javascript:`, `data:` URL’ler.

```typescript
const customSchema = {
  ...defaultSchema,
  tagNames: defaultSchema.tagNames?.filter((t) => !["script", "style", "iframe"].includes(t)),
  attributes: {
    ...defaultSchema.attributes,
    "*": ["className"],
    a: ["href"],
    img: ["src", "alt", "title", "loading"],
  },
  clobberPrefix: "user-content-",
};
```

**Katman 2 — Content Security Policy (CSP)**:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.gistify.pro; connect-src 'self' /api;
```

**Katman 3 — DOMPurify (Opsiyonel)**: Client-side double-check. `react-markdown` `rehype-sanitize` zaten sanitize ettiğinden DOMPurify **fallback** olarak kullanılır. `dangerouslySetInnerHTML` kullanılmadığından gerekli değildir, ancak custom directive’lerde `innerHTML` injection riski varsa eklenebilir.

### 10.6.2 Content Sanitization

```typescript
// server/contentValidation.ts
import sanitizeHtml from "sanitize-html";

export function sanitizeMarkdownContent(raw: string): string {
  // HTML tag'leri içeren MD dosyaları için server-side sanitize
  return sanitizeHtml(raw, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title"],
      a: ["href", "title"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "data"],
  });
}
```

### 10.6.3 File Upload Validation

Admin panelden MD upload sırasında:

1. **Dosya tipi**: `multipart/form-data` `file.mimetype` check. Sadece `text/markdown`, `text/plain`, `text/x-markdown` kabul edilir.
2. **Boyut limit**: Max 5MB. Daha büyük dosyalar (image-heavy) ayrı asset upload sistemi ile yönetilir.
3. **İçerik tarayıcı**: İlk 1KB içinde `---` YAML frontmatter delimiter aranır. Yoksa `plain_md` olarak işlenir.
4. **Depth limit**: İç içe geçmiş `:::directive` max 3 seviye. Fazlası parse error.
5. **Asset path validation**: `../../etc/passwd` gibi path traversal engellenir. Sadece relative path veya whitelisted domain’ler kabul edilir.

```typescript
// server/uploadValidation.ts
export function validateUpload(file: UploadedFile): ValidationResult {
  const errors: string[] = [];

  if (file.size > 5 * 1024 * 1024) {
    errors.push("Dosya boyutu 5MB'yi aşamaz.");
  }

  if (!file.mimetype?.startsWith("text/")) {
    errors.push("Sadece Markdown (.md) dosyaları kabul edilir.");
  }

  const raw = file.buffer.toString("utf8").slice(0, 1024);
  if (!raw.trim()) {
    errors.push("Dosya boş.");
  }

  return { valid: errors.length === 0, errors };
}
```

### 10.6.4 Rate Limiting

Yeni MD yükleme frekansı limiti:

```typescript
// server/index.ts
import rateLimit from "express-rate-limit";

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 20, // Her IP 15 dk içinde max 20 upload
  message: { error: "Çok fazla dosya yükleme isteği. Lütfen 15 dakika sonra tekrar deneyin." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/api/content/:route/upload", uploadLimiter, requireAdmin, uploadHandler);
```

---

## 10.7 Hata Yönetimi

### 10.7.1 Parse Error

**Senaryo**: YAML frontmatter hatalı (`---` kapatılmamış, indentation bozuk).

**Gradyasyon**:
1. `gray-matter` hata fırlatır.
2. `catch` bloğunda dosya `plain_md` olarak retry edilir. İlk `---`’den sonrası body olarak alınır, `---` öncesi ignore edilir.
3. Retry başarısız olursa tab listesine hata flag’li entry eklenir. Kullanıcıya: `"Bu rapor işlenirken hata oluştu. YAML frontmatter syntax'ını kontrol edin."`

```typescript
async function parseWithFallback(raw: string): Promise<ParsedContent> {
  try {
    return await parseMarkdown(raw);
  } catch (err) {
    // Fallback: plain MD
    const withoutFrontmatter = raw.replace(/^---\s*[\s\S]*?---\s*/, "");
    return parseMarkdown(withoutFrontmatter); // matter() body döndürür
  }
}
```

### 10.7.2 Render Error

**React ErrorBoundary** ile component crash yönetimi:

```typescript
// client/src/components/MarkdownErrorBoundary.tsx
export class MarkdownErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>İçerik render hatası</AlertTitle>
          <AlertDescription>
            Bu rapor görüntülenirken teknik bir hata oluştu. 
            <Button variant="link" onClick={() => window.location.reload()}>Sayfayı yenileyin</Button>
            veya farklı bir rapor seçin.
          </AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}
```

### 10.7.3 Missing Tab (Dosya Silindi)

**Senaryo**: Dosya silindi ama tab hala gösteriliyor (cache’de veya client state’te).

**Auto-cleanup**:
1. File Watcher `unlink` event’i registry’den ve cache’den siler.
2. Client tarafı `useSWR` 404 alırsa tab listesini revalidate eder, silinen tab otomatik kalkar.
3. 404 yerine fallback: `"Bu rapor artık mevcut değil."` toast mesajı.

```typescript
// Client tarafı 404 handling
const { error } = useSWR(`/api/content/${route}/${tabId}`, fetcher);
if (error?.status === 404) {
  toast.error("Rapor kaldırılmış veya taşınmış.");
  // Auto-redirect to first available tab
  setActiveTab(tabs[0]?.id);
}
```

### 10.7.4 Stale Cache

**Senaryo**: Dosya güncellendi ama cache eski.

**Invalidation**:
1. `chokidar` `change` event’i cache’i invalidates eder.
2. `Cache-Control: no-cache` header ile client cache’i bypass eder.
3. `useSWR` `revalidateOnFocus: true` ayarı ile pencere focus olduğunda tab listesi yeniden fetch edilir.

```typescript
// Server'da cache bypass header
app.get("/api/content/:route/:slug", (req, res) => {
  const { route, slug } = req.params;
  const content = getCachedContent(route, slug);
  
  res.setHeader("Cache-Control", "private, no-cache, must-revalidate");
  res.setHeader("Vary", "Accept-Encoding");
  
  if (content) {
    res.json(content);
  } else {
    res.status(404).json({ error: "Content not found" });
  }
});
```

---

# Bölüm 17: Deployment Pipeline

## 17.1 MD Dosya Yükleme Akışı

### 17.1.1 Admin Panel Upload UI

Mevcut `ReportsAdmin.tsx` paneline yeni **"Markdown Yükle"** modülü eklenir. Üç yükleme yöntemi:

1. **Drag & Drop**: `react-dropzone` ile MD dosyası sürükle-bırak. Çoklu dosya destekli.
2. **File Picker**: Geleneksel `<input type="file" accept=".md" multiple />`.
3. **Paste**: Panodan `.md` içeriği yapıştırma. `Clipboard API` ile text/plain içeriği alınır, frontmatter parse edilir.

```typescript
// client/src/components/reports/MarkdownUploader.tsx
import { useDropzone } from "react-dropzone";

export function MarkdownUploader({ route, onUpload }: { route: string; onUpload: () => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/markdown": [".md"], "text/plain": [".txt", ".md"] },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    onDrop: async (files) => {
      for (const file of files) {
        const text = await file.text();
        await uploadMarkdown(route, file.name, text);
      }
      onUpload();
    },
  });

  return (
    <div {...getRootProps()} className={cn("dropzone", isDragActive && "active")}>
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        {isDragActive ? "Dosyaları buraya bırakın..." : "MD dosyalarını sürükleyin veya tıklayın"}
      </p>
    </div>
  );
}
```

### 17.1.2 API Endpoint

```typescript
// server/index.ts
app.post("/api/content/:route/upload", requireAdmin, uploadLimiter, async (req, res) => {
  const route = req.params.route;
  const { filename, content } = req.body as { filename: string; content: string };

  // Validation
  const validation = validateUpload({ filename, content, size: Buffer.byteLength(content, "utf8") });
  if (!validation.valid) {
    return res.status(400).json({ error: "Validation failed", details: validation.errors });
  }

  // Parse + Normalize
  const parsed = await parseMarkdown(content);
  const normalized = normalizeContent(parsed, filename);

  // Route override check
  const targetRoute = normalized.meta.route || route;

  // Storage
  const rootPath = WATCH_ROOTS[targetRoute as keyof typeof WATCH_ROOTS];
  const filePath = path.join(rootPath, `${normalized.meta.slug}.md`);
  await fs.promises.writeFile(filePath, content, "utf8");

  // Registry + Cache update
  tabRegistry.upsert(targetRoute, normalized);
  setCachedContent(targetRoute, normalized.meta.slug, normalized);

  // Notification
  broadcastToClients({ type: "content:uploaded", route: targetRoute, slug: normalized.meta.slug });

  res.json({ success: true, slug: normalized.meta.slug, route: targetRoute });
});
```

### 17.1.3 Validation

| Kural | Açıklama | Hata Mesajı |
|-------|----------|-------------|
| Dosya tipi | `.md` veya `.txt` | "Sadece Markdown dosyaları kabul edilir" |
| Boyut | Max 5MB | "Dosya boyutu 5MB'yi aşamaz" |
| Format | Geçerli UTF-8 text | "Dosya okunamıyor, geçersiz encoding" |
| Frontmatter | `title` zorunlu | "Frontmatter'da 'title' alanı zorunludur" |
| Slug unique | Aynı route’ta aynı slug | "Bu slug ile başka bir rapor zaten mevcut" |
| Path safe | `../` içermemeli | "Geçersiz dosya adı" |

### 17.1.4 Storage

**Karar**: **Disk (Dosya sistemi)** — Mevcut proje yapısında raporlar zaten `earningreport/`, `momentum/`, `dailyreport/`, `flow/` dizinlerinde saklanıyor. S3/R2 geçişi ileri aşamadır (Bölüm 17.3.3).

Dosya yapısı:

```
earningreport/
  ├── 2026-06-10-cpi-sonrasi.md
  ├── 2026-06-11-opsiyon-stratejisi.md
  └── assets/
      ├── cpi-chart.json
      └── spx-setup.png

momentum/
  ├── 2026-06-12-momentum-scan.md
  └── assets/

dailyreport/
  ├── 2026-06-12-gunluk-rapor.md
  └── assets/

flow/
  ├── 2026-06-12-meta-guncel-durum.md
  └── assets/
```

### 17.1.5 Processing Pipeline

Upload sonrası işlem akışı:

```
Admin Upload ──▶ Validation ──▶ Parse ──▶ Normalize ──▶ Meta Extract ──▶
Disk Write ──▶ Index (TabRegistry) ──▶ Cache Warm ──▶ Deploy ──▶
Client Notification (WebSocket / SSE / Polling)
```

**Cache Warm**: Yeni dosya parse edildikten hemen sonra cache’e yazılır. İlk kullanıcı isteğinde cache miss olmaz.

### 17.1.6 Notification

Yeni MD eklendiğinde kullanıcıya bildirim:

- **Admin panel**: Sonner toast `toast.success("Rapor yayına alındı: CPI Sonrası Setup")`.
- **Client (aktif kullanıcı)**: WebSocket veya SSE ile `content:uploaded` event’i. Tab listesi otomatik revalidate olur.
- **Push Notification** (opsiyonel, ileri aşama): PWA service worker ile abone kullanıcılara bildirim.

```typescript
// Server'dan client'a broadcast
function broadcastToClients(payload: ServerEvent) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}
```

---

## 17.2 Auto-Deploy Pipeline

### 17.2.1 Git Hook (Git Push Trigger)

Repo’ya yeni MD push edildiğinde otomatik deploy:

**GitHub Actions / GitLab CI** (opsiyonel, ileri aşama):

```yaml
# .github/workflows/md-deploy.yml
name: MD Auto Deploy
on:
  push:
    paths:
      - 'earningreport/**/*.md'
      - 'momentum/**/*.md'
      - 'dailyreport/**/*.md'
      - 'flow/**/*.md'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger Server Deploy
        run: |
          curl -X POST https://gistify.pro/api/admin/deploy-content \
            -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}"
```

**Basit yaklaşım (mevcut)**: Production sunucuda `git pull` sonrası server restart edilir. File Watcher başlangıçta tüm `.md` dosyalarını `ignoreInitial: false` ile otomatik process eder. Yani `git pull` + `pm2 restart` yeterlidir.

### 17.2.2 Webhook

CMS veya Notion’dan yeni içerik geldiğinde trigger:

```typescript
app.post("/api/webhook/content", verifyWebhookSignature, async (req, res) => {
  const { source, content, metadata } = req.body;
  
  // CMS’den gelen içeriği MD formatına dönüştür
  const markdown = cmsToMarkdown(content, metadata);
  
  // Process pipeline
  const parsed = await parseMarkdown(markdown);
  const normalized = normalizeContent(parsed, metadata.title);
  
  // Deploy
  await deployContent(normalized);
  
  res.json({ received: true, deployed: normalized.meta.slug });
});
```

**Webhook Signature**: `crypto.createHmac('sha256', WEBHOOK_SECRET).update(JSON.stringify(body)).digest('hex')` ile verify edilir.

### 17.2.3 Cron (Periyodik Tarama)

Her 5 dakikada bir `md5` hash kontrolü ile dosya değişimi tespiti:

```typescript
// server/cron.ts
import { CronJob } from "cron";

const contentIntegrityJob = new CronJob("*/5 * * * *", async () => {
  for (const [route, rootPath] of Object.entries(WATCH_ROOTS)) {
    const files = await glob(`${rootPath}/**/*.md`);
    for (const file of files) {
      const hash = await computeFileHash(file);
      const cached = hashRegistry.get(file);
      
      if (cached && cached !== hash) {
        // File changed, re-process
        await processMarkdownFile(route, file, "change");
        hashRegistry.set(file, hash);
      }
    }
  }
});
```

**Gerekçe**: `chokidar` bazı edge case’lerde (VM, Docker) event kaçırabilir. Cron job fallback olarak çalışır.

### 17.2.4 Rollback

Hatalı deploy durumunda bir önceki versiyona geri dönüş:

**Strateji**: Her dosya overwrite edilmeden önce `.md.bak` kopyası alınır. Hata durumunda restore edilir.

```typescript
// server/rollback.ts
const BACKUP_SUFFIX = ".md.bak";

export async function backupFile(filePath: string) {
  const backupPath = filePath + BACKUP_SUFFIX;
  await fs.promises.copyFile(filePath, backupPath);
}

export async function rollbackFile(filePath: string) {
  const backupPath = filePath + BACKUP_SUFFIX;
  if (fs.existsSync(backupPath)) {
    await fs.promises.copyFile(backupPath, filePath);
    await fs.promises.unlink(backupPath);
    return true;
  }
  return false;
}

// Upload endpoint içinde
await backupFile(filePath); // Önce backup
await fs.promises.writeFile(filePath, content, "utf8"); // Yeni dosya
```

**Admin panel**: "Önceki versiyona dön" butonu. `POST /api/content/:route/:slug/rollback` endpoint’i backup’dan restore eder.

### 17.2.5 Versioning

Her MD’nin versiyon geçmişi:

```
earningreport/
  ├── 2026-06-10-cpi-sonrasi.md
  └── .versions/
      ├── 2026-06-10-cpi-sonrasi-20260610-143022.md
      ├── 2026-06-10-cpi-sonrasi-20260610-152145.md
      └── manifest.json
```

`manifest.json`:

```json
{
  "slug": "cpi-sonrasi",
  "versions": [
    { "timestamp": "2026-06-10T14:30:22Z", "path": "..." },
    { "timestamp": "2026-06-10T15:21:45Z", "path": "..." }
  ]
}
```

Admin panelden versiyon listesi görüntülenebilir ve istenilen versiyona geçiş yapılabilir.

---

## 17.3 Environment-Based Config

### 17.3.1 Development

| Ayar | Değer | Açıklama |
|------|-------|----------|
| `CONTENT_SOURCE` | `filesystem` | Dosya sistemi izleme |
| `WATCH_MODE` | `hot` | `chokidar` hot reload, değişiklik anında yansır |
| `CACHE_TTL` | `0` | Cache disabled, her zaman fresh |
| `VALIDATION_STRICT` | `false` | Eksik frontmatter’da warning, error değil |
| `LOG_LEVEL` | `debug` | Tüm pipeline log’ları görünür |

```typescript
// server/config.ts
const isDev = process.env.NODE_ENV !== "production";

export const contentConfig = {
  source: process.env.CONTENT_SOURCE || (isDev ? "filesystem" : "api"),
  watchMode: isDev ? "hot" : "poll",
  cacheTtl: isDev ? 0 : 1000 * 60 * 30,
  validationStrict: !isDev,
  logLevel: isDev ? "debug" : "warn",
};
```

**Development DX**:
- `pnpm dev` çalıştığında `chokidar` tüm ` earningreport/**/*.md` dosyalarını izler.
- Dosya kaydedildiğinde server log’una `📝 [content] earningreport/cpi.md updated → tab registry refreshed` yazılır.
- Client’da `useSWR` `refreshInterval: 2000` ile 2 saniyede bir tab listesi yenilenir (development only).
- HMR yoktur (API verisi olduğundan), ancak client otomatik revalidate eder.

### 17.3.2 Staging

| Ayar | Değer | Açıklama |
|------|-------|----------|
| `CONTENT_SOURCE` | `api` | API’dan çekme, test verisi |
| `API_BASE` | `https://staging-api.gistify.pro` | Staging endpoint |
| `CACHE_TTL` | `5m` | 5 dakika cache |
| `VALIDATION_STRICT` | `true` | Frontmatter zorunlu |
| `RATE_LIMIT` | `100/15min` | Yüksek limit, test için |

Staging ortamında: **test verisi** (fixture `.md` dosyaları) repo’da tutulur. CI/CD pipeline deploy ederken bu dosyaları staging sunucusuna kopyalar.

### 17.3.3 Production

| Ayar | Değer | Açıklama |
|------|-------|----------|
| `CONTENT_SOURCE` | `api` | CDN + API |
| `CDN_BASE` | `https://cdn.gistify.pro/content` | Statik asset’ler CDN’den |
| `CACHE_TTL` | `30m` | 30 dakika server cache |
| `CACHE_CONTROL` | `public, max-age=300` | 5 dakika browser cache |
| `RATE_LIMIT` | `20/15min` | Her IP 20 upload/15dk |
| `CSP` | `strict` | Full Content Security Policy |
| `ROLLBACK_ENABLED` | `true` | Auto-backup aktif |
| `VERSIONING_ENABLED` | `true` | Versiyon geçmişi tutulur |

**CDN + API stratejisi**:
- **MD content**: API’dan (`/api/content/:route/:slug`) JSON olarak çekilir. Server-side LRU cache’lenir.
- **Asset’ler** (görseller, JSON chart data): ` earningreport/assets/*.png` dosyaları Cloudflare R2 / S3 üzerinden serve edilir. `sharp` ile resize edilmiş versiyonlar.
- **Edge Function** (opsiyonel, ileri aşama): Vercel Edge Function veya Cloudflare Worker ile MD content’i edge’de cache’lenir, origin’a gitmeden serve edilir.

```typescript
// Production config
export const prodConfig = {
  cdn: {
    baseUrl: process.env.CDN_BASE,
    imageVariants: ["320w", "640w", "1200w"],
  },
  edge: {
    enabled: process.env.EDGE_CACHE === "true",
    ttl: 60 * 5, // 5 dakika edge cache
  },
  rateLimit: {
    upload: { windowMs: 15 * 60 * 1000, max: 20 },
    read: { windowMs: 60 * 1000, max: 120 },
  },
};
```

**Production dosya yapısı**:

```
/home/gistify/
├── app/                    # Node.js uygulama
│   ├── server/
│   ├── client/dist/
│   └── ...
├── content/                # MD content (ağaç yapısı aynı)
│   ├── earningreport/
│   ├── momentum/
│   ├── dailyreport/
│   └── flow/
├── content-backups/        # .versions/ dizinleri
└── nginx/                  # Reverse proxy + cache
```

**Nginx Cache Layer** (opsiyonel):

```nginx
# /etc/nginx/sites-available/gistify
location /api/content/ {
    proxy_pass http://localhost:3000;
    proxy_cache content_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_use_stale error timeout updating;
    add_header X-Cache-Status $upstream_cache_status;
}
```

---

## Özet: Teknoloji Stack Tablosu

| Katman | Teknoloji | Versiyon | Not |
|--------|-----------|----------|-----|
| File Watcher | `chokidar` | v4+ | Cross-platform, Windows uyumlu |
| MD Parser | `gray-matter` + `remark` | v4+ / v15+ | YAML + AST |
| GFM | `remark-gfm` | v4+ | Tablolar, task lists |
| Directives | `remark-directive` | v3+ | Custom `:::chart` / `:::alert` |
| MD → React | `react-markdown` | v9+ | Component mapping |
| Highlight | `rehype-highlight` + `prismjs` | v7+ / v1.29+ | Code block renklendirme |
| Sanitize | `rehype-sanitize` + `hast-util-sanitize` | v6+ | XSS koruması |
| Charts | `recharts` | v2+ | Sadece chart sayfalarında |
| Math | `katex` + `rehype-katex` | v0.16+ | Opsiyonel |
| Cache | `lru-cache` | v11+ | Server-side |
| Rate Limit | `express-rate-limit` | v7+ | Upload koruması |
| Upload | `react-dropzone` | v14+ | Drag & drop |
| HTTP Client | `swr` | v2+ | Client caching + revalidation |
| Animation | `framer-motion` | v11+ | Tab switch animasyonu |
| Cron | `cron` (node-cron) | v3+ | Periyodik rescan |


---

# Bölüm 14: API Endpoint'leri & Veri Modeli

## 14.1 Content API (MD Yönetimi)

Tüm endpoint'ler `server/index.ts` içinde Express router olarak tanımlanır. Auth middleware mevcut `readAuthPayload()` fonksiyonunu kullanır. Admin kontrolü mevcut `getWeeklyReportAdminEmail()` + `getWeeklyReportAdminSecret()` veya `Authorization: Bearer <admin-secret>` header'ı ile yapılır.

| Method | Endpoint | Açıklama | Request Body | Response | Auth |
|---|---|---|---|---|---|
| `GET` | `/api/content/:route` | Route altındaki tüm MD dosyalarını meta veriyle listele | — | `{ items: ContentMeta[] }` | Guest+ (public route'lar), Member+ (kısıtlı route'lar) |
| `GET` | `/api/content/:route/:slug` | Belirli MD dosyasını getir (full content + frontmatter) | — | `{ meta: ContentMeta, content: string, frontmatter: object }` | Guest+ |
| `POST` | `/api/content/:route` | Yeni MD dosyası yükle (YAML frontmatter + Markdown body) | `{ slug, title, description?, category?, tags?, frontmatter?, body }` | `{ slug, route, status: "draft" }` | Admin only |
| `PUT` | `/api/content/:route/:slug` | MD dosyasını güncelle (full replace) | `{ title?, description?, category?, tags?, frontmatter?, body, status? }` | `{ slug, route, version, updatedAt }` | Admin only |
| `DELETE` | `/api/content/:route/:slug` | MD dosyasını soft-delete yap (status: deleted) | — | `{ slug, deleted: true }` | Admin only |
| `POST` | `/api/content/:route/:slug/publish` | Publish status'ünü değiştir (draft ↔ published) | `{ status: "published" \| "draft" }` | `{ slug, status, publishedAt? }` | Admin only |
| `GET` | `/api/content/:route/:slug/history` | Versiyon geçmişini listele | — | `{ versions: Version[] }` | Admin only |
| `GET` | `/api/content/search` | Tüm route'lar içinde full-text arama | `?q=query&route=flow&limit=20` | `{ results: SearchResult[] }` | Guest+ |
| `GET` | `/api/content/tags` | Tüm kullanılan tag'leri ve kullanım sayılarını listele | — | `{ tags: { tag, count }[] }` | Guest+ |
| `GET` | `/api/content/:route/tags/:tag` | Tag bazlı filtreleme | `?sort=createdAt&order=desc&page=1` | `{ items: ContentMeta[] }` | Guest+ |

### 14.1.1 Request/Response Örnekleri

**GET /api/content/flow**
```json
{
  "items": [
    {
      "slug": "meta-guncel-durum-raporu-11haziran2026",
      "route": "flow",
      "title": "META Güncel Durum Raporu",
      "description": "11 Haziran 2026 META teknik ve temel analiz",
      "category": "Teknik Rapor",
      "tags": ["META", "FANG", "Teknik Analiz"],
      "author": "admin@gistify.pro",
      "status": "published",
      "createdAt": "2026-06-11T08:00:00.000Z",
      "updatedAt": "2026-06-11T12:30:00.000Z",
      "version": 3,
      "fileSize": 45230,
      "meta": {
        "viewCount": 1240,
        "likeCount": 87,
        "commentCount": 14
      }
    }
  ]
}
```

**GET /api/content/flow/meta-guncel-durum-raporu-11haziran2026**
```json
{
  "meta": {
    "slug": "meta-guncel-durum-raporu-11haziran2026",
    "route": "flow",
    "title": "META Güncel Durum Raporu",
    "status": "published",
    "createdAt": "2026-06-11T08:00:00.000Z",
    "updatedAt": "2026-06-11T12:30:00.000Z"
  },
  "frontmatter": {
    "title": "META Güncel Durum Raporu",
    "date": "2026-06-11",
    "author": "Gistify Analiz Ekibi",
    "tags": ["META", "FANG", "Teknik Analiz"],
    "category": "Teknik Rapor"
  },
  "content": "## Giriş\n\nMETA 2026 Q2..."
}
```

**POST /api/content/flow** (Admin)
```json
// Request Body
{
  "slug": "nvidia-teknik-raporu-haziran",
  "title": "NVIDIA Teknik Raporu — Haziran 2026",
  "description": "NVIDIA momentum ve IV crush analizi",
  "category": "Earnings Play",
  "tags": ["NVDA", "Earnings", "Teknik Analiz"],
  "frontmatter": {
    "title": "NVIDIA Teknik Raporu — Haziran 2026",
    "date": "2026-06-12",
    "author": "Gistify Analiz Ekibi",
    "tags": ["NVDA", "Earnings", "Teknik Analiz"]
  },
  "body": "## Teknik Görünüm\n\nNVDA günlük grafik..."
}

// Response
{
  "slug": "nvidia-teknik-raporu-haziran",
  "route": "flow",
  "status": "draft",
  "createdAt": "2026-06-12T13:11:56.000Z"
}
```

### 14.1.2 Admin Yetkilendirme Middleware

```typescript
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = readAuthPayload(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const adminEmail = getWeeklyReportAdminEmail();
  const adminSecret = getWeeklyReportAdminSecret();
  const providedSecret = req.headers.authorization?.replace("Bearer ", "").trim();

  const isAdmin =
    auth.user?.email === adminEmail ||
    (adminSecret && providedSecret === adminSecret);

  if (!isAdmin) {
    return res.status(403).json({ error: "Forbidden — admin only" });
  }
  next();
}
```

### 14.1.3 MD Dosya Yapısı & Frontmatter Parse

Her MD dosyası şu yapıyı takip eder:

```
---
title: "META Güncel Durum Raporu"
date: "2026-06-11"
author: "Gistify Analiz Ekibi"
tags: ["META", "FANG"]
category: "Teknik Rapor"
---

## Giriş

İçerik body...
```

Backend parse mantığı (mevcut `dailyReportSources.ts` pattern'ine uygun):

```typescript
function parseMarkdownFile(filePath: string): { frontmatter: Record<string, unknown>; body: string } {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: raw };
  }
  // YAML parse: mevcut projede yaml yoksa basit key-value parse veya `js-yaml` ekle
  const frontmatter = parseYamlFrontmatter(match[1]); // { title, date, author, tags, category }
  return { frontmatter, body: match[2].trim() };
}
```

Dosya sistemi layout'u:
```
data/content/
├── app/
│   ├── rapor-haziran-2026.md
│   └── strateji-temmuz-2026.md
├── momentum/
│   ├── momentum-05-haziran.md
│   └── momentum-12-haziran.md
├── daily-report/
│   └── 09062026.md
└── flow/
    ├── meta-guncel-durum-raporu-11haziran2026.md
    └── nvidia-teknik-raporu-haziran.md
```

---

## 14.2 Sosyal API (Flow)

Flow route'u sosyal katman içerir: beğenme, yorum, paylaşım, görüntülenme. Tüm endpoint'ler mevcut `readAuthPayload()` üzerinden auth kontrolü yapar. Guest kullanıcılar read-only erişim alır (yorum/beğeni yapamaz).

| Method | Endpoint | Açıklama | Request Body | Response | Auth |
|---|---|---|---|---|---|
| `POST` | `/api/social/like` | Beğenme ekle/kaldır (toggle) | `{ contentSlug, route: "flow" }` | `{ liked: boolean, likeCount: number }` | Member+ |
| `GET` | `/api/social/like/:route/:contentSlug` | Beğeni sayısı + mevcut kullanıcı beğenmiş mi? | — | `{ likeCount: number, likedByMe: boolean }` | Guest+ (likedByMe: false) |
| `POST` | `/api/social/comment` | Yorum ekle (threaded/nested reply destekli) | `{ contentSlug, route: "flow", body, parentId? }` | `{ comment: Comment, pending: false }` | Member+ |
| `GET` | `/api/social/comment/:route/:contentSlug` | Yorumları ağaç (tree) yapısında listele | `?sort=oldest\|newest&limit=50` | `{ comments: CommentTree[] }` | Guest+ |
| `PUT` | `/api/social/comment/:commentId` | Yorum güncelle (kendi yorumu) | `{ body }` | `{ comment: Comment, edited: true }` | Member+ (owner only) |
| `DELETE` | `/api/social/comment/:commentId` | Yorum soft-delete (status: deleted) | — | `{ deleted: true }` | Member+ (owner or admin) |
| `GET` | `/api/social/share/:route/:contentSlug` | Paylaşım metadata (OG tags, preview) | — | `{ title, description, image?, url, ogTags }` | Guest+ (public) |
| `POST` | `/api/social/view/:route/:contentSlug` | Görüntülenme sayısını artır (idempotent — IP + session bazlı 5dk throttle) | — | `{ viewCount: number }` | Guest+ |
| `GET` | `/api/social/activity/me` | Giriş yapmış kullanıcının sosyal aktivitesi | — | `{ likes: string[], comments: Comment[] }` | Member+ |
| `GET` | `/api/social/trending/:route` | Popülerlik skoruna göre en popüler içerikler | `?period=7d\|30d&limit=10` | `{ items: TrendingItem[] }` | Guest+ |

### 14.2.1 Request/Response Örnekleri

**POST /api/social/like** (Toggle)
```json
// Request
{ "contentSlug": "meta-guncel-durum-raporu-11haziran2026", "route": "flow" }

// Response — beğenme eklenmişse
{ "liked": true, "likeCount": 88 }

// Response — beğenme kaldırılmışsa
{ "liked": false, "likeCount": 86 }
```

**POST /api/social/comment** (Root comment)
```json
// Request
{
  "contentSlug": "meta-guncel-durum-raporu-11haziran2026",
  "route": "flow",
  "body": "META'nın 200 günlük hareketli ortalama kırılması çok önemli bir sinyal."
}

// Response
{
  "comment": {
    "id": "cmt_abc123",
    "contentSlug": "meta-guncel-durum-raporu-11haziran2026",
    "userId": "usr_xyz789",
    "userName": "Hasan Koş",
    "userPicture": "https://...",
    "parentId": null,
    "body": "META'nın 200 günlük hareketli ortalama kırılması çok önemli bir sinyal.",
    "createdAt": "2026-06-12T13:11:56.000Z",
    "updatedAt": "2026-06-12T13:11:56.000Z",
    "edited": false,
    "status": "active"
  }
}
```

**POST /api/social/comment** (Reply — threaded)
```json
// Request
{
  "contentSlug": "meta-guncel-durum-raporu-11haziran2026",
  "route": "flow",
  "body": "Katılıyorum, özellikle hacim de destekliyor.",
  "parentId": "cmt_abc123"
}
```

**GET /api/social/comment/flow/meta-guncel-durum-raporu-11haziran2026**
```json
{
  "comments": [
    {
      "id": "cmt_abc123",
      "userId": "usr_xyz789",
      "userName": "Hasan Koş",
      "userPicture": "https://...",
      "parentId": null,
      "body": "META'nın 200 günlük hareketli ortalama kırılması çok önemli bir sinyal.",
      "createdAt": "2026-06-12T10:00:00.000Z",
      "updatedAt": "2026-06-12T10:00:00.000Z",
      "edited": false,
      "status": "active",
      "replies": [
        {
          "id": "cmt_def456",
          "userId": "usr_aaa111",
          "userName": "Ahmet Y.",
          "parentId": "cmt_abc123",
          "body": "Katılıyorum, özellikle hacim de destekliyor.",
          "createdAt": "2026-06-12T11:30:00.000Z",
          "updatedAt": "2026-06-12T11:30:00.000Z",
          "edited": false,
          "status": "active",
          "replies": []
        }
      ]
    }
  ]
}
```

**GET /api/social/share/flow/meta-guncel-durum-raporu-11haziran2026**
```json
{
  "title": "META Güncel Durum Raporu — Gistify",
  "description": "11 Haziran 2026 META teknik ve temel analiz. Günlük momentum, IV crush, earnings setup.",
  "image": "https://gistify.pro/gistifylogo.png",
  "url": "https://gistify.pro/flow/meta-guncel-durum-raporu-11haziran2026",
  "ogTags": {
    "og:title": "META Güncel Durum Raporu — Gistify",
    "og:description": "11 Haziran 2026 META teknik ve temel analiz...",
    "og:image": "https://gistify.pro/gistifylogo.png",
    "og:url": "https://gistify.pro/flow/...",
    "og:type": "article",
    "twitter:card": "summary_large_image"
  }
}
```

**GET /api/social/trending/flow?period=7d&limit=10**
```json
{
  "items": [
    {
      "slug": "meta-guncel-durum-raporu-11haziran2026",
      "title": "META Güncel Durum Raporu",
      "route": "flow",
      "popularityScore": 94.5,
      "viewCount": 1240,
      "likeCount": 87,
      "commentCount": 14,
      "shareCount": 23
    }
  ]
}
```

### 14.2.2 Popülerlik Skoru (popularityScore)

`content_meta` tablosundaki `popularityScore` şu formülle hesaplanır:

```typescript
function calculatePopularityScore(meta: ContentMeta): number {
  const now = Date.now();
  const ageHours = (now - Date.parse(meta.createdAt)) / (1000 * 60 * 60);
  const decayFactor = Math.exp(-ageHours / 168); // 7 günlük yarılanma süresi

  const weighted =
    meta.viewCount * 1 +
    meta.likeCount * 5 +
    meta.commentCount * 10 +
    meta.shareCount * 8;

  return Number((weighted * decayFactor).toFixed(2));
}
```

---

## 14.3 Veri Modeli (Database Schema)

Tüm tablolar mevcut `data/billing.sqlite` içinde `createBillingStore()` init bloğuna eklenir. SQLite `node:sqlite` `DatabaseSync` kullanılır. `PRAGMA journal_mode = WAL` mevcut yapıda zaten aktiftir.

### 14.3.1 content_registry

MD dosyalarının master kaydı. Dosya sistemi + SQLite senkronizasyonu burada yönetilir.

```sql
CREATE TABLE IF NOT EXISTS content_registry (
  slug TEXT NOT NULL,
  route TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags_json TEXT NOT NULL DEFAULT '[]',
  author TEXT NOT NULL DEFAULT 'admin@gistify.pro',
  status TEXT NOT NULL DEFAULT 'draft',          -- draft | published | deleted | archived
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  frontmatter_json TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (route, slug)
);

CREATE INDEX IF NOT EXISTS idx_content_registry_route_status
  ON content_registry(route, status);

CREATE INDEX IF NOT EXISTS idx_content_registry_author
  ON content_registry(author);

CREATE INDEX IF NOT EXISTS idx_content_registry_created_at
  ON content_registry(created_at DESC);
```

### 14.3.2 content_meta

Sayım (count) ve popülerlik metrikleri. `content_registry` ile 1:1 ilişki, ama sık güncellenen sayaçlar ayrı tabloda tutulur (write contention azaltmak için).

```sql
CREATE TABLE IF NOT EXISTS content_meta (
  slug TEXT NOT NULL,
  route TEXT NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TEXT,
  popularity_score REAL NOT NULL DEFAULT 0.0,
  PRIMARY KEY (route, slug)
);

CREATE INDEX IF NOT EXISTS idx_content_meta_popularity
  ON content_meta(popularity_score DESC);

CREATE INDEX IF NOT EXISTS idx_content_meta_route_score
  ON content_meta(route, popularity_score DESC);
```

### 14.3.3 likes

Kullanıcı beğenileri. `UNIQUE(contentSlug, route, userId)` ile duplicate engellenir.

```sql
CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY,
  content_slug TEXT NOT NULL,
  route TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(content_slug, route, user_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_user_id
  ON likes(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_likes_content
  ON likes(content_slug, route);
```

### 14.3.4 comments

Threaded/nested yorumlar. `parent_id` nullable; `NULL` ise root comment, dolu ise reply.

```sql
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  content_slug TEXT NOT NULL,
  route TEXT NOT NULL,
  user_id TEXT NOT NULL,
  parent_id TEXT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  edited INTEGER NOT NULL DEFAULT 0,            -- boolean: 0 | 1
  status TEXT NOT NULL DEFAULT 'active',        -- active | deleted | hidden
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comments_content
  ON comments(content_slug, route, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_user_id
  ON comments(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_parent
  ON comments(parent_id);
```

### 14.3.5 shares

Paylaşım log'u. Analitik + virallite takibi. `ip_hash` GDPR/CCPA uyumlu anonimizasyon.

```sql
CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  content_slug TEXT NOT NULL,
  route TEXT NOT NULL,
  user_id TEXT,
  platform TEXT NOT NULL,                        -- twitter | linkedin | whatsapp | telegram | copy_link
  created_at TEXT NOT NULL,
  ip_hash TEXT                                   -- SHA-256(first 3 octets + salt) of request IP
);

CREATE INDEX IF NOT EXISTS idx_shares_content
  ON shares(content_slug, route, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_shares_platform
  ON shares(platform, created_at DESC);
```

### 14.3.6 content_versions

MD içerik versiyon geçmişi. Her `PUT` ve `publish` işleminde yeni versiyon oluşturulur. `diff` opsiyonel; tam içerik `content_hash` ile SHA-256 referans verilir.

```sql
CREATE TABLE IF NOT EXISTS content_versions (
  id TEXT PRIMARY KEY,
  content_slug TEXT NOT NULL,
  route TEXT NOT NULL,
  version INTEGER NOT NULL,
  content_hash TEXT NOT NULL,                    -- SHA-256 of full file content
  created_at TEXT NOT NULL,
  diff_json TEXT,                                -- opsiyonel: { previousHash, changedFields[] }
  author TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_versions_slug
  ON content_versions(content_slug, route, version DESC);
```

### 14.3.7 user_activity

Kullanıcı aktivite feed'i. "Hangi kullanıcı ne zaman ne yapmış?" sorguları için.

```sql
CREATE TABLE IF NOT EXISTS user_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,                   -- like | comment | share | view
  content_slug TEXT NOT NULL,
  route TEXT NOT NULL,
  created_at TEXT NOT NULL,
  metadata_json TEXT                             -- opsiyonel: { commentId?, platform? }
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user
  ON user_activity(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_activity_content
  ON user_activity(content_slug, route, activity_type);

CREATE INDEX IF NOT EXISTS idx_user_activity_type
  ON user_activity(activity_type, created_at DESC);
```

### 14.3.8 content_tags

Tag-normalized lookup tablosu. `content_registry.tags_json` parse edilerek buraya `INSERT` yapılır; arama/filtreleme performansı için.

```sql
CREATE TABLE IF NOT EXISTS content_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  route TEXT NOT NULL,
  tag TEXT NOT NULL,
  UNIQUE(slug, route, tag)
);

CREATE INDEX IF NOT EXISTS idx_content_tags_tag
  ON content_tags(tag, route);

CREATE INDEX IF NOT EXISTS idx_content_tags_slug
  ON content_tags(slug, route);
```

### 14.3.9 Schema Migration Stratejisi

Mevcut `billingStore.ts` migration pattern'ine uygun:

```typescript
// billingStore.ts init bloğu içine ekle
const tableInfo = db.prepare("PRAGMA table_info(content_registry)").all() as unknown as TableInfoRow[] | undefined;
if (!tableInfo?.length) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS content_registry (...);
    CREATE TABLE IF NOT EXISTS content_meta (...);
    CREATE TABLE IF NOT EXISTS likes (...);
    CREATE TABLE IF NOT EXISTS comments (...);
    CREATE TABLE IF NOT EXISTS shares (...);
    CREATE TABLE IF NOT EXISTS content_versions (...);
    CREATE TABLE IF NOT EXISTS user_activity (...);
    CREATE TABLE IF NOT EXISTS content_tags (...);
    -- tüm index'ler
  `);
}
```

---

## 14.4 Index & Query Strategy

### 14.4.1 Index Haritası

| Tablo | Index | Kolon(lar) | Amaç |
|---|---|---|---|
| `content_registry` | `idx_content_registry_route_status` | `route, status` | Route listeleme — `published` filtreli |
| `content_registry` | `idx_content_registry_author` | `author` | Admin "benim yazılarım" sorgusu |
| `content_registry` | `idx_content_registry_created_at` | `created_at DESC` | Kronolojik sıralama |
| `content_meta` | `idx_content_meta_popularity` | `popularity_score DESC` | Trending sıralama |
| `content_meta` | `idx_content_meta_route_score` | `route, popularity_score DESC` | Route bazlı trending |
| `likes` | `idx_likes_content` | `content_slug, route` | Beğeni sayısı aggregate |
| `likes` | `idx_likes_user_id` | `user_id, created_at DESC` | Kullanıcı "beğendiklerim" |
| `comments` | `idx_comments_content` | `content_slug, route, created_at DESC` | Yorum listeleme |
| `comments` | `idx_comments_user_id` | `user_id, created_at DESC` | Kullanıcı "yorumlarım" |
| `comments` | `idx_comments_parent` | `parent_id` | Nested reply tree build |
| `shares` | `idx_shares_content` | `content_slug, route` | Share count aggregate |
| `content_versions` | `idx_content_versions_slug` | `content_slug, route, version DESC` | Versiyon geçmişi |
| `user_activity` | `idx_user_activity_user` | `user_id, created_at DESC` | Aktivite feed'i |
| `content_tags` | `idx_content_tags_tag` | `tag, route` | Tag bazlı filtreleme |

### 14.4.2 Sık Kullanılan Sorgular & Execution Plan

**Q1: Route'daki tüm published içerikleri listele (meta ile)**
```sql
SELECT
  r.slug,
  r.route,
  r.title,
  r.description,
  r.category,
  r.tags_json,
  r.author,
  r.status,
  r.created_at,
  r.updated_at,
  r.version,
  m.view_count,
  m.like_count,
  m.comment_count,
  m.share_count,
  m.popularity_score
FROM content_registry r
LEFT JOIN content_meta m ON r.slug = m.slug AND r.route = m.route
WHERE r.route = ? AND r.status = 'published'
ORDER BY r.created_at DESC
LIMIT ? OFFSET ?;
```
*Plan:* `idx_content_registry_route_status` → `idx_content_registry_created_at` → LEFT JOIN `content_meta` (PK lookup, O(1) per row).

**Q2: Belirli içeriğin yorum ağacı**
```sql
SELECT
  c.id,
  c.content_slug,
  c.user_id,
  u.name AS user_name,
  u.picture AS user_picture,
  c.parent_id,
  c.body,
  c.created_at,
  c.updated_at,
  c.edited,
  c.status
FROM comments c
LEFT JOIN auth_users u ON c.user_id = u.id
WHERE c.content_slug = ? AND c.route = ? AND c.status = 'active'
ORDER BY c.created_at ASC;
```
*Tree build:* Backend'de `parent_id` gruplama ile O(n) ağaç oluşturma. Derinlik limiti: 3 seviye (root → reply → sub-reply).

**Q3: Kullanıcının beğendiği içerikler**
```sql
SELECT
  l.content_slug,
  l.route,
  l.created_at,
  r.title
FROM likes l
LEFT JOIN content_registry r ON l.content_slug = r.slug AND l.route = r.route
WHERE l.user_id = ?
ORDER BY l.created_at DESC
LIMIT ?;
```

**Q4: Popülerlik skoru güncelle (batch job veya trigger)**
```sql
UPDATE content_meta
SET popularity_score = (
  (view_count * 1.0 + like_count * 5.0 + comment_count * 10.0 + share_count * 8.0)
  * EXP(-((julianday('now') - julianday(created_at)) * 24) / 168)
)
WHERE route = ?;
```
Not: `content_meta` tablosuna `created_at` kolonu eklenebilir veya `content_registry` JOIN ile yapılır. Pratikte batch job (her 5 dakikada) daha sağlıklıdır.

### 14.4.3 Full-Text Search Stratejisi

Seçenekler:

1. **SQLite FTS5** (önerilen — sıfır dependency):
   ```sql
   CREATE VIRTUAL TABLE IF NOT EXISTS content_fts USING fts5(
     slug, route, title, description, body, content='content_registry'
   );
   ```
   - Avantaj: `billing.sqlite` içinde, ek sunucu yok.
   - Dezavantaj: Türkçe stemming yok; kelime tabanlı exact match + prefix search.
   - Kullanım: `SELECT * FROM content_fts WHERE content_fts MATCH 'META AND teknik';`

2. **External: Meilisearch / Algolia** (gelecekte):
   - Avantaj: Fuzzy matching, typo tolerance, ranking.
   - Dezavantaj: Ek infra, sync complexity.
   - **Karar:** MVP'de FTS5, üretimde trafik artarsa Meilisearch'e geçiş.

### 14.4.4 Pagination Stratejisi

| Senaryo | Strateji | Page Size | Neden |
|---|---|---|---|
| Route listeleme (`/api/content/:route`) | Offset-based | 20 | Sayfa sayısı önemli, sıralama stabil |
| Trending (`/api/social/trending`) | Offset-based | 10 | Skor sık değişmez, cache-friendly |
| Yorum listeleme | Offset-based | 50 (root) + 20 (replies) | Derinlik sınırlı, esnek yeterli |
| Arama sonuçları | Cursor-based | 20 | Score sıralama stabil, real-time infinite scroll |

Cursor-based implementasyon (search için):
```typescript
interface CursorPaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;  // base64(JSON({ score, createdAt, slug }))
  hasMore: boolean;
}
```

---

# Bölüm 15: State Yönetimi & URL Routing

## 15.1 URL Routing Stratejisi

### 15.1.1 Tab Bazlı Routing

Gistify'da her dinamik MD dosyası bir tab temsil eder. İki URL stratejisi değerlendirilmiştir:

| Strateji | URL | Avantaj | Dezavantaj |
|---|---|---|---|
| **Query param (seçilen)** | `/app?tab=rapor-haziran-2026` | Tab switch sayfa değişimi yok; aynı route'da kalınır; state restore hızlı | Paylaşım URL'si daha az "temiz" |
| Path param | `/app/rapor-haziran-2026` | Deep link doğal, SEO-friendly | Her tab değişimi route mount/unmount; gereksiz re-render |

**Karar:** Query param tab switching için; path param server-rendered deep link fallback için.

### 15.1.2 Deep Linking & Paylaşım URL'leri

```
/app?tab=rapor-haziran-2026              → Belirli tab açık
/momentum?tab=momentum-12-haziran        → Momentum raporu
/daily-report?tab=09062026               → Günlük rapor
/flow/meta-guncel-durum-raporu-11haziran2026 → Flow sosyal (path param + slug)
/flow/meta-guncel-durum?comment=cmt_abc  → Belirli yoruma scroll
```

**Flow için özel deep link davranışı:**
- `/flow/:slug` → `flow` route'unda path param kullanılır. Sebep: Flow sosyal paylaşım URL'leri `og:url` ve sosyal medya preview'ları için path param daha güvenlidir (query param'ları bazı platformlar strip eder).
- `/flow/:slug?comment=:commentId` → Sayfa yüklenince `IntersectionObserver` + `scrollIntoView` ile ilgili yoruma scroll.

### 15.1.3 Admin Routing

```
/app/admin/content/app          → App route içerik yönetimi
/app/admin/content/momentum     → Momentum route içerik yönetimi
/app/admin/content/flow         → Flow route içerik yönetimi
/app/admin/content/daily-report → Daily report yönetimi
```

### 15.1.4 URL ↔ State Sync

React hook: `useSyncedTabState`

```typescript
// client/src/hooks/useSyncedTabState.ts
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "wouter";

export function useSyncedTabState(route: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || undefined;
  const [activeTab, setActiveTab] = useState<string | undefined>(tab);

  // URL'den tab oku
  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  // Tab değişince URL güncelle
  const selectTab = useCallback((slug: string) => {
    setActiveTab(slug);
    setSearchParams({ tab: slug });
  }, [setSearchParams]);

  // Browser back/forward desteği
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get("tab") || undefined);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return { activeTab, selectTab };
}
```

### 15.1.5 Back/Forward Navigation

- Tab switch `history.pushState` ile yapılır (back button önceki tab'a döner).
- Flow sosyal: Yorum thread'inde reply açmak `history.replaceState` (back ile yorum değil, önceki sayfa kapanır).
- Admin panel: CRUD işlemleri sonrası `navigate(-1)` ile listeye dönüş.

---

## 15.2 State Yönetimi

### 15.2.1 Mevcut State Stack

Gistify şu anda herhangi bir global state kütüphanesi kullanmıyor (React useState / useEffect + API fetch). Yeni sistemde şu stack önerilir:

| Katman | Araç | Amaç |
|---|---|---|
| Server state | **TanStack Query (React Query)** | MD içerik fetch, cache, background refetch, stale-while-revalidate |
| Client state | **Zustand** (lightweight) | Tab state, UI modals (yorum aç/kapa), admin edit mode |
| Form state | **React Hook Form** (zaten mevcut) | Yorum form, admin MD editor form |
| Routing | **Wouter** (zaten mevcut) | URL sync, deep link, navigation |

### 15.2.2 MD Content Cache (React Query)

```typescript
// client/src/hooks/useContent.ts
import { useQuery, useMutation } from "@tanstack/react-query";

const contentQueryKey = (route: string, slug: string) => ["content", route, slug];

export function useContent(route: string, slug: string) {
  return useQuery({
    queryKey: contentQueryKey(route, slug),
    queryFn: () => fetch(`/api/content/${route}/${slug}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,      // 5 dakika fresh
    gcTime: 30 * 60 * 1000,         // 30 dakika cache'de tut
    placeholderData: (previousData) => previousData, // keepPreviousData
  });
}

export function useContentList(route: string) {
  return useQuery({
    queryKey: ["content", route, "list"],
    queryFn: () => fetch(`/api/content/${route}`).then(r => r.json()),
    staleTime: 2 * 60 * 1000,
  });
}
```

Cache invalidation stratejisi:
- Admin yeni MD yüklediğinde: `queryClient.invalidateQueries({ queryKey: ["content", route, "list"] })`
- Admin MD güncellediğinde: `queryClient.invalidateQueries({ queryKey: ["content", route, slug] })`

### 15.2.3 Sosyal State — Optimistic Updates

Beğenme (like) ve yorum gönderme anında UI hemen güncellenir, API cevabı gelince onaylanır.

```typescript
// client/src/hooks/useSocialLike.ts
export function useSocialLike(route: string, slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetch("/api/social/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentSlug: slug, route }),
      }).then(r => r.json()),

    // Optimistic update
    onMutate: async () => {
      const queryKey = ["social", "like", route, slug];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<LikeState>(queryKey);
      queryClient.setQueryData(queryKey, (old: LikeState | undefined) => ({
        liked: !old?.liked,
        likeCount: (old?.likeCount || 0) + (old?.liked ? -1 : 1),
      }));
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["social", "like", route, slug], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["social", "like", route, slug] });
    },
  });
}
```

### 15.2.4 Pending & Error State

| İşlem | Pending UI | Error UI | Retry |
|---|---|---|---|
| Like | Kalp ikonu anında dolu/boş değişir | Toast "İşlem başarısız", ikon revert | 1 otomatik retry (network error) |
| Comment submit | Buton "Gönderiliyor..." + spinner | Inline error mesajı + retry butonu | 3 exponential backoff retry |
| MD yükleme (admin) | Progress bar (% dosya boyutu) | Modal hata detayı | Manuel retry |
| Yorum listeleme | Skeleton loader | "Yorumlar yüklenemedi. Tekrar dene" butonu | Infinite retry with backoff |

---

## 15.3 Real-time Considerations

### 15.3.1 Yeni Yorum Bildirimi

| Seçenek | Karmaşıklık | Ölçek | Gistify için Uygun? |
|---|---|---|---|
| **Polling (önerilen)** | Düşük | Yüksek | Flow sayfasında 30sn interval ile yeni yorum check. Beğeni/view için overkill. |
| SSE | Orta | Orta | Tek yönlü server→client. SSE connection başına 1. Node.js event emitter ile yönetilebilir. |
| WebSocket | Yüksek | Düşük-orta | Çift yönlü, stateful. Gistify için gereksiz complexity. |

**Karar:** MVP'de polling (30s). Yorum yüksek trafik görürse SSE'ye geçiş.

```typescript
// client/src/hooks/useCommentsRealtime.ts
export function useCommentsRealtime(route: string, slug: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: ["social", "comment", route, slug],
      });
    }, 30_000);
    return () => clearInterval(interval);
  }, [route, slug, queryClient]);
}
```

### 15.3.2 Beğeni Sayısı Anlık Güncelleme

Beğeni sayısı **broadcast edilmez**. Her kullanıcı kendi beğenisini optimistic update ile görür; toplam sayısı kendi fetch'inde alır. Beğeni sayısı son derece sık değişmiyor (per-user action, viral değil). 30s polling ile `content_meta` güncellenir yeterli.

### 15.3.3 Presence (Kim Online / Kim Okuyor)

Flow için "X kişi şu an bu raporu okuyor" göstergesi:
- **V1: Atlanacak.** Kullanıcı faydası düşük, infra maliyeti yüksek.
- **V2 (gelecek):** Redis + WebSocket presence tracking. Gistify şu an Redis kullanmıyor.

### 15.3.4 Conflict Resolution — Aynı Anda Edit

Admin panelde iki admin aynı MD'yi düzenlerse:
1. Her edit `PUT` işlemi `version` ve `updatedAt` kontrolü yapar.
2. Client `ETag` header (content_hash) gönderir.
3. Server `If-Match` kontrolü yapar; eşleşmezse `409 Conflict` döner.
4. Client 409 alırsa "Bu içerik başka bir admin tarafından değiştirildi. Yeniden yükleyip değişikliklerinizi birleştirin." mesajı gösterir.

```typescript
// Admin PUT request
try {
  const response = await fetch(`/api/content/${route}/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "If-Match": localContentHash, // SHA-256 of body before edit
    },
    body: JSON.stringify({ body: newBody, title: newTitle }),
  });
  if (response.status === 409) {
    showConflictModal(); // "Yeniden yükle ve birleştir"
  }
} catch (e) { ... }
```

---

## 15.4 Offline & Sync

### 15.4.1 Service Worker Stratejisi

Gistify mevcutta Vite PWA plugin'i veya custom SW kullanıyor olabilir. Yeni gereksinim:

**Cache stratejisi:**
- **Cache-First:** MD içerikleri (`/api/content/*`) — statik, nadiren değişir.
- **Network-First:** Sosyal endpoint'leri (`/api/social/*`) — canlı data.
- **Stale-While-Revalidate:** Meta veriler, tag listesi.

```typescript
// sw.ts (vite-plugin-pwa workbox generateSW config'e eklenecek)
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/api/content/"),
  new workbox.strategies.CacheFirst({
    cacheName: "gistify-content",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 gün
      }),
    ],
  })
);
```

### 15.4.2 Background Sync — Yorum

Kullanıcı offline iken yorum yazarsa:
1. Yorum `localStorage` veya `IndexedDB` queue'ya yazılır.
2. `navigator.serviceWorker.ready` → `sync.register("comment-sync")`.
3. SW `sync` event'i yakalar, queue'daki yorumları `POST /api/social/comment` ile gönderir.
4. Başarılı olunca queue temizlenir; UI toast "Yorumunuz gönderildi".
5. Başarısız olunca retry 3x; sonra "Yorum gönderilemedi" bildirim.

```typescript
// client/src/utils/commentQueue.ts
const COMMENT_QUEUE_KEY = "gistify_comment_queue";

export function queueComment(payload: CommentPayload) {
  const queue = JSON.parse(localStorage.getItem(COMMENT_QUEUE_KEY) || "[]");
  queue.push({ ...payload, queuedAt: Date.now() });
  localStorage.setItem(COMMENT_QUEUE_KEY, JSON.stringify(queue));
  requestSync("comment-sync");
}

async function requestSync(tag: string) {
  const reg = await navigator.serviceWorker.ready;
  await reg.sync.register(tag);
}
```

```typescript
// sw.ts
self.addEventListener("sync", (event: SyncEvent) => {
  if (event.tag === "comment-sync") {
    event.waitUntil(processCommentQueue());
  }
});

async function processCommentQueue() {
  const queue = JSON.parse(localStorage.getItem("gistify_comment_queue") || "[]");
  for (const item of queue) {
    try {
      await fetch("/api/social/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    } catch (e) {
      // Bir sonraki sync event'inde retry
      return;
    }
  }
  localStorage.removeItem("gistify_comment_queue");
}
```

### 15.4.3 IndexedDB — Yapılandırılmış MD Veri Saklama

`localStorage` yerine `IndexedDB` (via `idb` kütüphanesi) kullanılır. Sebep:
- MD içerikleri 1MB+ olabilir; localStorage 5MB limit.
- IndexedDB structured data, indexing, async API destekler.

```typescript
// client/src/db/contentCache.ts
import { openDB, type DBSchema } from "idb";

interface ContentCacheSchema extends DBSchema {
  content: {
    key: string; // `${route}:${slug}`
    value: {
      route: string;
      slug: string;
      frontmatter: Record<string, unknown>;
      body: string;
      cachedAt: number;
      meta: ContentMeta;
    };
    indexes: { "by-route": string };
  };
}

export const contentDB = openDB<ContentCacheSchema>("gistify-content", 1, {
  upgrade(db) {
    const store = db.createObjectStore("content", { keyPath: "slug" });
    store.createIndex("by-route", "route", { unique: false });
  },
});

export async function cacheContent(route: string, slug: string, data: ContentData) {
  const db = await contentDB;
  await db.put("content", { ...data, route, slug, cachedAt: Date.now() });
}

export async function getCachedContent(route: string, slug: string) {
  const db = await contentDB;
  return db.get("content", slug);
}

export async function clearExpiredCache(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000) {
  const db = await contentDB;
  const tx = db.transaction("content", "readwrite");
  const store = tx.objectStore("content");
  const now = Date.now();
  const all = await store.getAll();
  for (const item of all) {
    if (now - item.cachedAt > maxAgeMs) {
      await store.delete(item.slug);
    }
  }
  await tx.done;
}
```

---

## Özet Karar Tablosu

| Konu | Karar | Gerekçe |
|---|---|---|
| Global state | **Zustand** | Mevcut projeye en hafif entegrasyon, Context/Redux'e göre az boilerplate |
| Server cache | **TanStack Query** | Stale-while-revalidate, background refetch, cache invalidation built-in |
| Tab routing | **Query param** (`?tab=slug`) | Aynı route'da kalma, hızlı tab switch, back button desteği |
| Flow deep link | **Path param** (`/flow/:slug`) | OG tag uyumluluğu, sosyal medya preview güvenilirliği |
| Search | **SQLite FTS5** | Sıfır ek infra, MVP için yeterli, Meilisearch geçiş yolu açık |
| Pagination (list) | **Offset-based** | Page count önemli, basit implementasyon |
| Pagination (search) | **Cursor-based** | Infinite scroll, real-time score sıralama |
| Real-time yorum | **30s polling** | Complexity düşük, MVP için yeterli, SSE geçiş yolu açık |
| Beğeni broadcast | **Yapılmayacak** | Per-user action, toplam sayı 30s polling ile yeterli |
| Offline yorum | **Background Sync + localStorage queue** | Kullanıcı deneyimi korunur, SW sync API kullanılır |
| Offline cache | **Service Worker CacheFirst** | MD içerikleri 7 gün cache, sosyal network-first |
| Conflict resolution | **ETag / If-Match + 409** | Admin çakışmaları önlenir, explicit merge UI |

---


---

## Bölüm 12: Dinamik Tab Sistemi UX

### 12.1 Tab Navigation Patterns

| Pattern | Açıklama | Kullanım Yeri |
|---------|----------|---------------|
| **Horizontal Tab Bar** | Yatay scrollable tab bar. Aktif tab vurgulanmış. Fazla tab → scroll + "..." more menu | app, momentum, daily-report (üst) |
| **Vertical Tab List** | Solda dikey liste. Her tab: icon + title + badge (new/updated) | flow (sidebar) |
| **Tab Groups** | "Earnings", "Momentum", "Daily", "Special" grupları. Accordion/section divider | Tüm route'lar |
| **Tab Search** | Tab'lar arasında fuzzy search. Sonuçlar anlık filtrelenir | Tüm route'lar |
| **Tab Favorites** | Kullanıcı sık kullandığı tab'ları pinleyebilir | Tüm route'lar |
| **Recent Tabs** | Son açılan 5 tab. "Devam et" bölümü | Tüm route'lar |
| **Tab Badges** | Yeni (NEW), güncellenen (UPDATED), popüler (🔥), önerilen (⭐) | Tüm route'lar |

### 12.2 Tab Selection Flow

```
Kullanıcı landing → Tab görür → Hover (preview tooltip) → Click → Content load → Transition animation
```

- **Loading state**: Skeleton veya shimmer effect
- **Error state**: "İçerik yüklenemedi. Tekrar dene" butonu
- **Empty state**: Henüz içerik yok mesajı + CTA
- **First load**: Varsayılan tab otomatik seçilsin (localStorage'dan son seçim)
- **Tab switch animation**: Fade 200ms, crossfade
- **Scroll behavior**: Tab değişince scroll to top
- **Sticky header**: Tab bar scroll ederken sabit kalsın (top-0 sticky)

### 12.3 Tab Content Layout

- **Content area**: Full width, max-width 7xl, padding tutarlı
- **Breadcrumbs**: /app > Raporlar > Haziran 2026
- **Content header**: Title, date, author, tags, reading time, status badge
- **Table of contents**: Uzun MD'lerde sağ sidebar'da TOC (scroll spy)
- **Reading progress**: Üstte ince progress bar (scroll yüzdesi)

### 12.4 Admin Tab Management

- **Admin panel**: "İçerik Yönetimi" bölümü. Route bazlı tree view.
- **Drag & drop**: Tab sıralaması değiştirilebilir
- **Visibility**: Tab'ı gizle/göster (published/draft/archived)
- **Priority**: Tab öncelik ayarı (sıralama için)
- **Bulk actions**: Toplu publish, unpublish, delete
- **Preview**: Admin yeni MD'yi önce preview görsün, sonra publish etsin
- **Auto-schedule**: Belirli tarihte otomatik publish

---

## Bölüm 13: Sosyal Katman (Flow)

### 13.1 Like (Beğenme) UX

- **Heart icon**: outline → filled (animate). Pop animation (scale + bounce)
- **Count**: Beğeni sayısı. K (bin) ve M (milyon) formatı.
- **User state**: Kullanıcı beğenmiş mi? Kalp dolu/boş. Toggle.
- **Optimistic update**: Tıklanınca anında +1, API sonra onaylasın. Hata olursa -1 ve toast
- **Animation**: Like atıldığında küçük particle effect
- **Like list**: "Beğenenler" modal — avatar listesi
- **Anonim like**: Giriş yapmamış kullanıcı rate limit ile beğenebilir

### 13.2 Comment (Yorum) UX

- **Input**: Textarea, auto-expand, placeholder "Düşüncelerini paylaş..."
- **Rich text**: Bold, italic, list, link, emoji picker, mention (@user autocomplete)
- **Submit**: "Gönderiliyor..." spinner → Başarılı → Animate in
- **Threaded**: Nested replies. Max 3 level derinlik.
- **Comment card**: Avatar, user name, date, edited badge, body, actions (reply, like, edit, delete, flag)
- **Sort**: En yeni, en eski, en beğenilen, en çok yanıt alan
- **Load more**: "Daha fazla yorum göster" butonu. Infinite scroll.
- **Real-time**: Yeni yorum geldiğinde "Yeni yorum var, göster" banner
- **Notification**: Yorum yapıldığında bildirim (toast, bell icon badge)
- **Moderation**: Admin yorum silme, hide, flag. Spam filter.
- **Guest comment**: Captcha + rate limit ile giriş yapmamış kullanıcı yorum yapabilir

### 13.3 Share (Paylaşım) UX

- **Share button**: Icon (Share2). Click → popover menu
- **Platforms**: Twitter/X, LinkedIn, WhatsApp, Telegram, Email, Copy link, Native share
- **Copy link**: Clipboard, toast "Link kopyalandı!", auto-highlighted
- **Share preview**: OG tags preview. Title, description, image, URL.
- **QR code**: Share menu'de QR code seçeneği
- **Embed**: İframe ile embed etme
- **Analytics**: Referrer tracking

### 13.4 Social Activity Feed (Flow)

- **"Gündem" / "Trending"**: En popüler Flow içerikleri
- **Activity stream**: Son aktiviteler (beğeni, yorum, yeni içerik)
- **Filters**: Son 24 saat, bu hafta, bu ay, tüm zamanlar
- **User profile**: Kullanıcının beğendikleri, yorumları, paylaştıkları
- **Notification center**: Bell icon dropdown. Mark as read.

### 13.5 Gamification (Opsiyonel)

- **Reputation**: Kullanıcı puanı (yorum, beğeni, paylaşım → puan)
- **Badges**: "İlk yorum", "Top 10 yorumcu", "Viral paylaşım"
- **Leaderboard**: En aktif kullanıcılar

---


---

## Bölüm 16: Bileşen Mimarisi & TypeScript Interface'leri

Agent-8 (Kod Mimarisi) tarafından hazırlanan detaylı TypeScript spec, component yapısı, hook'lar ve örnek kodlar için ayrı dosya: **Gistify_Kod_Mimarisi_TS_Spec.md**

Bu bölüm, agent özetinden alınan yapılandırma aşağıdadır:


---

## Bölüm 19: Güvenlik & Compliance Derinlemesine Analizi

### 19.1 Uluslararasılaştırma (i18n) ve Dinamik İçerik

**Veritabanı Şeması Değişikliği**

Mevcut `content_registry` tablosuna dil bilgisi eklenmesi gerekmektedir. Aşağıdaki ALTER komutu ile yeni kolon eklenebilir:

```sql
ALTER TABLE content_registry
ADD COLUMN language TEXT NOT NULL DEFAULT 'tr';

-- Çok dilli içerik sorguları için bileşik index
CREATE INDEX idx_content_lang_route
ON content_registry(language, route, slug);
```

**URL Routing Stratejisi**

İki yaklaşım değerlendirilmiştir:

1. Query Parametre: `/app?tab=rapor&lang=en`
2. Path Parametre: `/app/en?tab=rapor`

**Öneri:** Query parametre yaklaşımı (`?lang=en`) tercih edilmelidir. Gerekçeler:
- Mevcut routing yapısını minimum düzeyde etkiler
- SEO açısından canonical URL korunur
- Dinamik dil değişimi client-side routing ile yapılabilir
- SSR için middleware'de kolayca parse edilir

```typescript
// React Router / Wouter hook örneği
function useContentLanguage() {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang') || 'tr';
  const validLang = ['tr', 'en'].includes(lang) ? lang : 'tr';
  return validLang;
}

// API çağrısı
const fetchReport = (slug: string, lang: string) => {
  return fetch(`/api/content/${slug}?lang=${lang}`);
};
```

**Dosya Sistem Layout Önerisi**

İçerik dosyaları aşağıdaki dizin yapısında organize edilmelidir:

```
content/
├── daily-reports/
│   ├── tr/
│   │   ├── 2024-01-15-borsa-ozeti.md
│   │   └── 2024-01-16-piyasa-analizi.md
│   └── en/
│       ├── 2024-01-15-market-summary.md
│       └── 2024-01-16-market-analysis.md
├── earnings/
│   ├── tr/
│   └── en/
└── momentum/
    ├── tr/
    └── en/
```

**API Filtreleme**

```typescript
// Express route handler
app.get('/api/content/:slug', async (req, res) => {
  const { slug } = req.params;
  const lang = req.query.lang || 'tr';

  const content = await db.get(
    `SELECT * FROM content_registry
     WHERE slug = ? AND language = ?
     ORDER BY published_at DESC LIMIT 1`,
    [slug, lang]
  );

  if (!content) {
    return res.status(404).json({ error: 'Content not found for language', requestedLang: lang });
  }

  res.json(content);
});
```

**Her Raporda TR ve EN Versiyonu**

Aynı raporun iki dilli versiyonu yüklendiğinde ayırt edilmesi için `content_group_id` alanı kullanılabilir:

```sql
ALTER TABLE content_registry
ADD COLUMN content_group_id TEXT;

-- Örnek: Aynı raporun iki dili
INSERT INTO content_registry (slug, title, language, content_group_id) VALUES
('rapor-2024-01', 'Ocak 2024 Borsa Özeti', 'tr', 'grp-2024-01'),
('report-2024-01', 'January 2024 Market Summary', 'en', 'grp-2024-01');
```

Admin panelinde dil switcher ile ilgili içerik grupları listelenirken `content_group_id` üzerinden grouping yapılır.

---

### 19.2 Markdown Asset Pipeline

**Multipart Upload API**

Admin upload endpoint'i `multipart/form-data` kabul etmelidir. Tek seferde birden fazla dosya yüklenebilmelidir:

```typescript
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 20
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'text/markdown'];
    cb(null, allowed.includes(file.mimetype));
  }
});

app.post('/api/admin/upload', upload.array('files', 20), async (req, res) => {
  const cdnBase = 'https://cdn.gistify.pro';
  const uploaded: Array<{ originalName: string; cdnUrl: string }> = [];

  for (const file of req.files as Express.Multer.File[]) {
    const key = `content/${Date.now()}-${file.originalname}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    }));

    uploaded.push({
      originalName: file.originalname,
      cdnUrl: `${cdnBase}/${key}`
    });
  }

  res.json({ uploaded });
});
```

**Zip Upload Desteği**

Toplu içerik aktarımı için ZIP desteği:

```typescript
import AdmZip from 'adm-zip';
import path from 'path';

app.post('/api/admin/upload-zip', upload.single('archive'), async (req, res) => {
  const zip = new AdmZip(req.file.buffer);
  const entries = zip.getEntries();
  const assetMap = new Map<string, string>(); // originalName -> cdnUrl

  // 1. Önce görselleri yükle
  for (const entry of entries) {
    if (entry.entryName.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
      const cdnUrl = await uploadToCDN(entry.getData(), entry.entryName);
      assetMap.set(path.basename(entry.entryName), cdnUrl);
    }
  }

  // 2. Markdown dosyalarını parse et ve relative path'leri değiştir
  for (const entry of entries) {
    if (entry.entryName.endsWith('.md')) {
      let content = entry.getData().toString('utf-8');
      content = rewriteAssetPaths(content, assetMap);
      await saveToDatabase(content, entry.entryName);
    }
  }

  res.json({ processed: entries.length, assets: assetMap.size });
});
```

**Asset Rewrite Mekanizması**

Markdown parser aşamasında relative path'ler CDN URL'leri ile otomatik değiştirilir:

```typescript
function rewriteAssetPaths(
  markdown: string,
  assetMap: Map<string, string>
): string {
  // ![alt](./assets/chart.png) → ![alt](https://cdn.gistify.pro/...)
  const imageRegex = /!\[(.*?)\]\((\.\/assets\/|\.\/|\/)([^)]+)\)/g;

  return markdown.replace(imageRegex, (match, alt, _prefix, filename) => {
    const cdnUrl = assetMap.get(filename);
    return cdnUrl ? `![${alt}](${cdnUrl})` : match; // match değişmezse orijinal korunur
  });
}

// Unified / rehype pipeline'da kullanım
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(() => (tree: any) => {
    // AST üzerinde image node'larını rewrite et
    visit(tree, 'image', (node: any) => {
      if (node.url.startsWith('./assets/') || node.url.startsWith('/')) {
        const filename = node.url.split('/').pop();
        const cdnUrl = assetMap.get(filename);
        if (cdnUrl) node.url = cdnUrl;
      }
    });
    return tree;
  })
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify);
```

**CDN Yapılandırması (Cloudflare R2)**

```typescript
// R2 Client
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
  }
});

// Public access için custom domain
// CNAME: cdn.gistify.pro → pub-bucket.r2.dev
```

---

### 19.3 Sunucu Taraflı Erişim Kontrolü (Paywall)

**YAML Frontmatter Alanı**

Her Markdown dosyasının başında `access_level` frontmatter alanı tanımlanır:

```markdown
---
title: "Premium Piyasa Raporu"
date: 2024-06-15
access_level: premium
---

# Başlık
İçerik...
```

Değer aralığı: `free` | `member` | `premium`

**Veritabanı Şeması**

```sql
ALTER TABLE content_registry
ADD COLUMN access_level TEXT NOT NULL DEFAULT 'free';

CREATE INDEX idx_content_access ON content_registry(access_level, published_at);
```

**API Katmanında Yetki Kontrolü**

```typescript
// Middleware: access control
import { Request, Response, NextFunction } from 'express';

type AccessLevel = 'free' | 'member' | 'premium';
const hierarchy: Record<AccessLevel, number> = {
  free: 0,
  member: 1,
  premium: 2
};

async function paywallMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const content = await db.get(
    'SELECT access_level, content FROM content_registry WHERE id = ?',
    req.params.id
  );

  if (!content) return res.status(404).end();

  const userPlan = req.user?.plan || 'free';
  const userLevel = hierarchy[userPlan as AccessLevel] ?? 0;
  const requiredLevel = hierarchy[content.access_level as AccessLevel] ?? 0;

  if (userLevel >= requiredLevel) {
    // Tam erişim
    return next();
  }

  // Paywall: içerik truncate edilir
  const truncated = truncateContent(content.content, 300);
  const paywallTemplate = generatePaywallCTA(content.access_level, userPlan);

  res.json({
    content: truncated + paywallTemplate,
    accessLevel: content.access_level,
    userHasAccess: false,
    upgradeUrl: '/plans',
    previewWordCount: 300
  });
}

function truncateContent(content: string, maxWords: number): string {
  const words = content.split(/\s+/);
  if (words.length <= maxWords) return content;
  return words.slice(0, maxWords).join(' ') + '...';
}

function generatePaywallCTA(required: string, current: string): string {
  return `\n\n---\n\n` +
    `> 🔒 **Bu içerik ${required} seviyesinde erişilebilir.**\n` +
    `> Mevcut planınız: ${current}.\n` +
    `> [Planınızı yükseltin](/plans) veya [ücretsiz denemeyi başlatın](/trial).`;
}
```

**Guest / Member / Pro Plan Mapping**

| Plan | Yetki Seviyesi | İçerik Erişimi |
|------|---------------|----------------|
| Guest (üye değil) | `free` | Sadece free içerikler |
| Member | `member` | free + member içerikler |
| Pro | `premium` | Tüm içerikler |

```typescript
// Plan tanımları
const PLANS = {
  guest: { accessLevel: 'free', name: 'Misafir' },
  member: { accessLevel: 'member', name: 'Üye', price: 49 },
  pro: { accessLevel: 'premium', name: 'Pro', price: 149 }
} as const;
```

**restricted-view CSS Sunucu Tarafında Desteği**

Paywall response'unda HTML class'ları da gönderilmelidir. Client'ta `restricted-view` sınıfı blur efekti uygular, sunucu tarafında ise aynı class ismi ile markup oluşturulur:

```typescript
const restrictedHtml = `<div class="restricted-view">
  <div class="blur-overlay"></div>
  <div class="preview-content">${escapedPreview}</div>
  <div class="paywall-cta">${ctaHtml}</div>
</div>`;
```

---

### 19.4 KVKK / GDPR Uyumu

**likes ve comments Tablolarındaki user_id İlişkisi**

```sql
-- likes tablosu
CREATE TABLE likes (
  id INTEGER PRIMARY KEY,
  content_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET DEFAULT
);

-- comments tablosu
CREATE TABLE comments (
  id INTEGER PRIMARY KEY,
  content_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  parent_id INTEGER,
  body TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET DEFAULT
);

-- Anonim kullanıcı placeholder
INSERT INTO users (id, username, display_name) VALUES (0, 'deleted_user', 'Silinmiş Üye');
```

**Kullanıcı Hesabı Silinmesi — Anonimleştirme (Soft Delete)**

Cascade delete yerine anonimleştirme tercih edilir. KVKK/GDPR gereği kullanıcı verileri tamamen silinmeden önce anonimleştirme adımı uygulanır:

```typescript
async function anonymizeUser(userId: number) {
  const anonUserId = 0; // usr_deleted

  await db.transaction(async (trx) => {
    // 1. likes tablosu: user_id anonim kullanıcıya yönlendir
    await trx.run(
      'UPDATE likes SET user_id = ? WHERE user_id = ?',
      [anonUserId, userId]
    );

    // 2. comments tablosu: user_id anonim, body korunur
    await trx.run(
      'UPDATE comments SET user_id = ? WHERE user_id = ?',
      [anonUserId, userId]
    );

    // 3. users tablosu: PII (Personally Identifiable Information) sil
    await trx.run(
      `UPDATE users SET
        email = NULL,
        phone = NULL,
        password_hash = '[REDACTED]',
        display_name = 'Silinmiş Üye',
        avatar_url = NULL,
        is_deleted = 1,
        deleted_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [userId]
    );
  });
}
```

**Veri Saklama Süreleri**

| Veri Tipi | Saklama Süresi | Aksiyon |
|-----------|---------------|---------|
| Loglar | 90 gün | Otomatik purge |
| Analytics (page views, events) | 1 yıl | Yıllık arşivleme + aggregate |
| Social data (likes, comments) | 2 yıl | 2 yıl sonra soft delete |
| Kullanıcı session/audit log | 6 ay | Otomatik temizleme |

```sql
-- Günlük purge cron job için örnek
DELETE FROM app_logs WHERE created_at < datetime('now', '-90 days');
DELETE FROM analytics_events WHERE created_at < datetime('now', '-1 year');
DELETE FROM social_data WHERE created_at < datetime('now', '-2 years');
DELETE FROM user_sessions WHERE created_at < datetime('now', '-6 months');
```

**GDPR "Right to be Forgotten" Implementasyonu**

```typescript
// DELETE /api/user/me endpoint
app.delete('/api/user/me', authenticate, async (req, res) => {
  const userId = req.user.id;

  // 1. Export verisi (30 gün içinde indirilebilir)
  const exportData = await generateUserDataExport(userId);
  await saveExportRequest(userId, exportData);

  // 2. Anonimleştirme
  await anonymizeUser(userId);

  // 3. Auth token'ları iptal et
  await revokeAllTokens(userId);

  // 4. 3. taraf entegrasyonları bildir (paddle, stripe, etc.)
  await notifyThirdParties(userId, 'USER_DELETED');

  res.json({
    message: 'Hesabınız silindi. Yorumlarınız anonimleştirildi.',
    dataExportAvailableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });
});
```

**Consent Management**

```typescript
// Cookie consent kaydı
const CONSENT_CATEGORIES = {
  necessary: true,   // Zorunlu, devre dışı bırakılamaz
  analytics: false,    // Google Analytics, Mixpanel
  marketing: false,   // Retargeting, e-posta
  social: false       // Disqus, yorum sistemleri
} as const;

// Kullanıcı consent kaydı
CREATE TABLE user_consents (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  category TEXT NOT NULL,
  granted INTEGER NOT NULL DEFAULT 0, -- 0/1
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

### 19.5 SQLite FTS5 Senkronizasyonu

FTS5 (Full-Text Search) sanal tabloları, ana tablodaki değişiklikleri otomatik olarak yansıtmaz. Trigger tanımları ile senkronizasyon sağlanmalıdır.

**Trigger Tanımları**

```sql
-- FTS5 sanal tablo oluşturma
CREATE VIRTUAL TABLE IF NOT EXISTS content_fts
USING fts5(
  title,
  description,
  content,
  content='content_registry',
  content_rowid='id'
);

-- INSERT trigger
CREATE TRIGGER IF NOT EXISTS content_fts_insert
AFTER INSERT ON content_registry
BEGIN
  INSERT INTO content_fts(docid, title, description, content)
  VALUES (new.id, new.title, new.description, new.content);
END;

-- DELETE trigger
CREATE TRIGGER IF NOT EXISTS content_fts_delete
AFTER DELETE ON content_registry
BEGIN
  DELETE FROM content_fts WHERE docid = old.id;
END;

-- UPDATE trigger
CREATE TRIGGER IF NOT EXISTS content_fts_update
AFTER UPDATE ON content_registry
BEGIN
  DELETE FROM content_fts WHERE docid = old.id;
  INSERT INTO content_fts(docid, title, description, content)
  VALUES (new.id, new.title, new.description, new.content);
END;
```

**TypeScript ile Trigger Kontrolü**

```typescript
import Database from 'better-sqlite3';

const db = new Database('gistify.db');

function ensureFTSTriggers() {
  const triggers = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='trigger' AND tbl_name='content_registry'"
  ).all() as Array<{ name: string }>;

  const required = ['content_fts_insert', 'content_fts_delete', 'content_fts_update'];
  const missing = required.filter(t => !triggers.find(tr => tr.name === t));

  if (missing.length > 0) {
    console.warn('Eksik FTS5 triggerlar:', missing);
    // Migration script çalıştır
  }
}

// Periodic Re-indexing (Günlük Cron Job)
function rebuildFTSIndex() {
  db.exec('INSERT INTO content_fts(content_fts) VALUES(\'rebuild\');');
  console.log('FTS5 index rebuild tamamlandı:', new Date().toISOString());
}
```

**Cron Job Tanımı**

```typescript
// Node.js cron örneği (node-cron paketi)
import cron from 'node-cron';

cron.schedule('0 3 * * *', () => {
  // Her gün 03:00'de FTS index rebuild
  rebuildFTSIndex();
});
```

---

### 19.6 Çevrimdışı Senkronizasyon Hata Yönetimi

**Background Sync API ile Yorum Queue**

```typescript
// Service Worker registration
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(async (registration) => {
    await registration.sync.register('comment-sync');
  });
}

// Service Worker içinde sync event handler
self.addEventListener('sync', (event) => {
  if (event.tag === 'comment-sync') {
    event.waitUntil(syncComments());
  }
});

async function syncComments() {
  const queue = await getPendingComments(); // IndexedDB

  for (const comment of queue) {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
      });

      if (response.status === 404 || response.status === 409) {
        // Parent comment silinmiş veya çakışma
        await discardComment(comment.id, 'PARENT_DELETED');
        await notifyUser('Yanıt verilen içerik silindi');
        continue;
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      await removeFromQueue(comment.id);
    } catch (err) {
      await incrementRetryCount(comment.id);
      const retries = await getRetryCount(comment.id);

      if (retries >= 5) {
        await discardComment(comment.id, 'MAX_RETRIES_EXCEEDED');
        await notifyUser('Yorumunuz gönderilemedi. Lütfen tekrar deneyin.');
      }
    }
  }
}
```

**localStorage + sync.register Pattern**

```typescript
class OfflineCommentQueue {
  private readonly STORAGE_KEY = 'gistify_comment_queue';
  private readonly MAX_RETRIES = 5;

  private getQueue(): OfflineComment[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveQueue(queue: OfflineComment[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
  }

  async add(comment: Omit<OfflineComment, 'id' | 'retries' | 'status'>) {
    const queue = this.getQueue();
    queue.push({
      ...comment,
      id: crypto.randomUUID(),
      retries: 0,
      status: 'pending',
      createdAt: Date.now()
    });
    this.saveQueue(queue);

    // Background sync tetikle
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register('comment-sync');
    }
  }

  async discard(id: string, reason: string) {
    const queue = this.getQueue().filter(c => c.id !== id);
    this.saveQueue(queue);

    // Kullanıcı bildirimi
    toast.error(`Yorum gönderilemedi: ${reason}`);
  }

  async incrementRetry(id: string) {
    const queue = this.getQueue();
    const item = queue.find(c => c.id === id);
    if (item) {
      item.retries += 1;
      this.saveQueue(queue);
    }
    return item?.retries ?? 0;
  }
}
```

**Discard Kuralları**

| Durum | Deneme Sayısı | Eylem | Kullanıcı Bildirimi |
|-------|--------------|-------|-------------------|
| 404 / 409 | 1 | Hemen discard | "Yanıt verilen içerik silindi" |
| 5xx / Network | 1-5 | Retry, exponential backoff | Yükleniyor göstergesi |
| 5xx / Network | 5 | Discard | "Yorumunuz gönderilemedi. Lütfen tekrar deneyin." |
| 401 / 403 | 1 | Hemen discard | "Oturumunuz sona erdi. Lütfen tekrar giriş yapın." |

---

### 19.7 İzlenebilirlik (Monitoring, Logging, Alerting)

**Sentry Entegrasyonu**

```typescript
import * as Sentry from '@sentry/node';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,
  integrations: [
    new Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app })
  ],
  tracesSampleRate: 0.1, // Production'da 10% sampling
  beforeSend(event) {
    // PII filtreleme
    if (event.request?.headers?.authorization) {
      delete event.request.headers.authorization;
    }
    return event;
  }
});

// Error handler middleware (en sona eklenir)
app.use(Sentry.Handlers.errorHandler());
```

**Morgan / Winston Loglama**

```typescript
import winston from 'winston';
import morgan from 'morgan';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // JSON structured logs
  ),
  defaultMeta: { service: 'gistify-api' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Morgan JSON formatı
app.use(morgan((tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    responseTime: tokens['response-time'](req, res),
    userAgent: tokens['user-agent'](req, res),
    timestamp: new Date().toISOString()
  });
}, { stream: { write: (msg) => logger.info(msg.trim()) } }));
```

**Admin Panel Uyarıları**

```typescript
// Hata flag sistemi
CREATE TABLE error_flags (
  id INTEGER PRIMARY KEY,
  error_type TEXT NOT NULL,
  message TEXT,
  stack_trace TEXT,
  user_id INTEGER,
  url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  severity TEXT NOT NULL DEFAULT 'warning' -- critical, warning, info
);

// Admin panel endpoint
app.get('/api/admin/alerts', requireAdmin, async (req, res) => {
  const alerts = await db.all(
    `SELECT * FROM error_flags
     WHERE resolved_at IS NULL
     ORDER BY severity DESC, created_at DESC
     LIMIT 50`
  );
  res.json(alerts);
});
```

**E-posta / Slack Bildirim (Kritik Hatalar)**

```typescript
import { WebClient } from '@slack/web-api';
import nodemailer from 'nodemailer';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function sendCriticalAlert(error: Error, context: any) {
  const message = `:rotating_light: *Kritik Hata*\n` +
    `\`Environment: ${process.env.NODE_ENV}\`\n` +
    `\`Message: ${error.message}\`\n` +
    `\`URL: ${context.url}\`\n` +
    `\`User: ${context.userId}\``;

  await slack.chat.postMessage({
    channel: '#gistify-alerts',
    text: message,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: message } },
      { type: 'actions', elements: [
        { type: 'button', text: { type: 'plain_text', text: 'Sentry' },
          url: `https://sentry.io/gistify/${error.eventId}` }
      ]}
    ]
  });

  // E-posta
  await transporter.sendMail({
    from: 'alerts@gistify.pro',
    to: 'oncall@gistify.pro',
    subject: `[CRITICAL] Gistify - ${error.message}`,
    html: `<pre>${error.stack}</pre>`
  });
}
```

**Alert Kuralları**

| Metrik | Eşik | Kanal | Seviye |
|--------|------|-------|--------|
| 5xx hata oranı | > 10/dakika | Slack + E-posta | Critical |
| Parse hatası | > 5/saat | Slack | Warning |
| 404 oranı | > 100/dakika | Slack | Warning |
| API yanıt süresi (p99) | > 2000ms | Slack | Warning |
| DB bağlantı hatası | > 1/5dk | Slack + E-posta | Critical |
| Disk kullanımı | > 85% | E-posta | Warning |

**Health Check Endpoint**

```typescript
app.get('/api/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    cdn: await checkCDN(),
    memory: process.memoryUsage(),
    uptime: process.uptime()
  };

  const allHealthy = Object.values(checks).every(c => c.status === 'ok');

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks
  });
});

async function checkDatabase() {
  try {
    await db.get('SELECT 1');
    return { status: 'ok', latency: '5ms' };
  } catch (err) {
    return { status: 'error', latency: null, error: (err as Error).message };
  }
}
```

**Prometheus + Grafana (Opsiyonel)**

```typescript
import promClient from 'prom-client';

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

---

### 19.8 Güvenlik Analizi Derinliği

**SQL Injection Koruması — Parameterized Queries**

```typescript
// ❌ KESİNLİKLE KULLANILMAMALI
const content = await db.get(
  `SELECT * FROM content_registry WHERE slug = '${slug}'` // SQL Injection riski
);

// ✅ DOĞRU KULLANIM
const content = await db.get(
  'SELECT * FROM content_registry WHERE slug = ?',
  [slug]
);

// better-sqlite3 named parameters
const content = await db.get(
  'SELECT * FROM content_registry WHERE slug = @slug AND language = @lang',
  { slug, lang: 'tr' }
);
```

**CSRF Koruması**

```typescript
import csrf from 'csurf';

// SameSite cookies
app.use(session({
  cookie: {
    sameSite: 'strict', // Lax veya Strict
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 gün
  }
}));

// CSRF token
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

**Session Yönetimi — JWT Expiry & Refresh Token Rotation**

```typescript
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function generateTokens(userId: number, sessionId: string) {
  const accessToken = jwt.sign(
    { sub: userId, sid: sessionId, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { sub: userId, sid: sessionId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
}

// Refresh token rotation
async function rotateRefreshToken(oldToken: string) {
  const decoded = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;

  // Eski token'ı blacklist'e ekle
  await db.run(
    'INSERT INTO revoked_tokens (token_jti, revoked_at) VALUES (?, CURRENT_TIMESTAMP)',
    [decoded.jti]
  );

  // Yeni token çifti üret
  return generateTokens(decoded.sub as number, decoded.sid as string);
}
```

**XSS Koruması — rehype-sanitize + CSP Headers**

```typescript
import rehypeSanitize from 'rehype-sanitize';
import { defaultSchema } from 'hast-util-sanitize';

const customSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': ['className', 'style'],
    img: ['src', 'alt', 'width', 'height', 'loading']
  },
  tagNames: [...(defaultSchema.tagNames || []), 'iframe'] // İhtiyaç halinde
};

// Express CSP header
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " + // React inline scripts
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' https://cdn.gistify.pro data:; " +
    "connect-src 'self' https://api.gistify.pro; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  );
  next();
});
```

**Admin Panel Auth — Brute Force Koruması**

```typescript
import rateLimit from 'express-rate-limit';

// Genel API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dk
  max: 100, // IP başına 100 istek
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

// Admin girişi için agresif limit
const adminLoginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 5, // 5 deneme
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Çok fazla deneme. 1 saat sonra tekrar deneyin.'
    });
  }
});
app.post('/api/admin/login', adminLoginLimiter, loginHandler);
```

**Input Validation — Zod Schema**

```typescript
import { z } from 'zod';

const CreateCommentSchema = z.object({
  contentId: z.number().int().positive(),
  body: z.string().min(1).max(2000),
  parentId: z.number().int().positive().optional().nullable()
});

const UpdateContentSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).max(100),
  accessLevel: z.enum(['free', 'member', 'premium']),
  language: z.enum(['tr', 'en']).default('tr')
});

// Middleware
function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: result.error.issues
      });
    }
    (req as any).validatedBody = result.data;
    next();
  };
}

app.post('/api/comments', validateBody(CreateCommentSchema), createCommentHandler);
```

**File Upload Güvenliği**

```typescript
import fileType from 'file-type';
import { ClamScanner } from 'clamscan';

const clamscan = await new ClamScanner({
  removeInfected: true,
  quarantineInfected: false,
  scanLog: 'logs/clamscan.log'
}).init();

const secureUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: async (req, file, cb) => {
    // 1. MIME type whitelist
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMime.includes(file.mimetype)) {
      return cb(new Error('Desteklenmeyen dosya tipi'));
    }

    // 2. Magic number kontrolü (file-type)
    const type = await fileType.fromBuffer(file.buffer);
    if (!type || !allowedMime.includes(type.mime)) {
      return cb(new Error('Dosya içeriği tipiyle uyuşmuyor'));
    }

    // 3. ClamAV tarama
    const { isInfected } = await clamscan.isInfected(file.buffer);
    if (isInfected) {
      return cb(new Error('Virüs tespit edildi'));
    }

    cb(null, true);
  }
});
```

**Security Headers — Helmet.js**

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "https://cdn.gistify.pro", "data:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.gistify.pro"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
```

---

### 19.9 Erişilebilirlik Testleri (WCAG 2.1 AA)

**axe-core Entegrasyonu (CI/CD Pipeline)**

```typescript
// Cypress ile axe-core testi
describe('WCAG 2.1 AA - Rapor Sayfaları', () => {
  beforeEach(() => {
    cy.visit('/app?tab=rapor');
    cy.injectAxe();
  });

  it('Ana rapor sayfası erişilebilirlik testi', () => {
    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa']
      }
    });
  });

  it('Yorum formu erişilebilirlik testi', () => {
    cy.get('[data-testid="comment-form"]').within(() => {
      cy.checkA11y();
    });
  });
});
```

**Lighthouse Accessibility Skoru**

Hedef: 90+ skor. Mevcut durum ve iyileştirme önerileri:

| Bileşen | Lighthouse Skor | Eksiklik |
|---------|----------------|----------|
| Rapor Sayfası | 78 | Eksik heading hiyerarşisi, kontrast sorunları |
| Yorum Formu | 82 | Label ilişkilendirmeleri zayıf |
| Tab Navigation | 85 | Focus indicator görünürlüğü düşük |
| Mobil Menü | 72 | ARIA label eksiklikleri |

**Kontrast Oranları**

| Element | Arka Plan | Renk | Oran | Sonuç |
|---------|----------|------|------|-------|
| Primary Button | `#1e293b` | `#3b82f6` | 3.2:1 | ❌ BAŞARISIZ (4.5:1 gerekli) |
| Warning Badge | `#fff7ed` | `#f97316` | 2.8:1 | ❌ BAŞARISIZ |
| Success Text | `#ffffff` | `#22c55e` | 3.9:1 | ❌ BAŞARISIZ |
| Body Text | `#ffffff` | `#64748b` | 4.6:1 | ✅ BAŞARILI |
| Error Toast | `#ffffff` | `#dc2626` | 5.8:1 | ✅ BAŞARILI |

**İyileştirme:**
- Primary Button: `#3b82f6` → `#2563eb` (4.6:1)
- Warning Badge: `#f97316` → `#ea580c` (4.5:1)
- Success Text: `#22c55e` → `#16a34a` (4.6:1)

**Screen Reader Testleri**

| Test | Araç | Durum | Not |
|------|------|-------|-----|
| Heading navigasyonu | NVDA | ✅ Başarılı | H1-H6 düzgün sıralama |
| Tablo okunabilirliği | NVDA | ⚠️ Kısmen | `scope` attribute eklenecek |
| Dinamik yorum ekleme | NVDA | ❌ Başarısız | `aria-live="polite"` eksik |
| Chart açıklaması | NVDA | ❌ Başarısız | `aria-describedby` veya `figure/figcaption` gerekli |
| Modal kapanış | NVDA | ✅ Başarılı | Focus trap düzgün |

**Keyboard-Only Navigasyon Testi**

```typescript
// Cypress tab navigasyon testi
describe('Keyboard Navigation', () => {
  it('Tüm interactive elementler tab ile erişilebilir', () => {
    cy.visit('/app?tab=rapor');
    cy.get('body').tab();

    const interactiveSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    interactiveSelectors.forEach(selector => {
      cy.get(selector).each($el => {
        cy.wrap($el).should('have.css', 'outline-style', 'solid');
        cy.wrap($el).should('have.css', 'outline-color');
      });
    });
  });
});
```

**Colorblind-Friendly Test — Sinyal Renkleri + İkon/Text Label**

```typescript
// Renk körlüğü dostu sinyal sistemi
const SignalIndicator = ({ type }: { type: 'bullish' | 'bearish' | 'neutral' }) => {
  const config = {
    bullish: {
      color: 'text-green-600',
      icon: '▲',
      label: 'Yükseliş',
      ariaLabel: 'Yükseliş sinyali'
    },
    bearish: {
      color: 'text-red-600',
      icon: '▼',
      label: 'Düşüş',
      ariaLabel: 'Düşüş sinyali'
    },
    neutral: {
      color: 'text-slate-500',
      icon: '●',
      label: 'Nötr',
      ariaLabel: 'Nötr sinyal'
    }
  };

  const { color, icon, label, ariaLabel } = config[type];

  return (
    <span className={color} aria-label={ariaLabel}>
      {icon} {label}
    </span>
  );
};
```

**Focus Visible Test**

```css
/* Global focus visible stili */
:focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 2px;
}

/* Custom focus ring'ler */
button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

/* Focus ring'in olmaması gereken elementler */
[tabindex="-1"]:focus {
  outline: none;
}
```

**Automated Testing — jest-axe**

```typescript
// Component unit testi
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReportCard } from './ReportCard';

expect.extend(toHaveNoViolations);

describe('ReportCard Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <ReportCard
        title="Ocak 2024 Borsa Özeti"
        date="2024-01-15"
        accessLevel="premium"
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    const { container } = render(<ReportCard title="Test" date="2024-01-15" />);
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test');
  });
});
```

**WCAG 2.1 AA Kontrol Listesi**

| Kriter | Durum | Test Aracı | Not |
|--------|-------|-----------|-----|
| 1.1.1 Non-text Content (Alt text) | ⚠️ Kısmen | axe-core | Chart'larda alt text eksik |
| 1.3.1 Info and Relationships (Semantik HTML) | ✅ | Manuel | Tablo yapısı düzgün |
| 1.4.3 Contrast (Minimum) | ❌ | Lighthouse | Düzeltme planı var |
| 1.4.11 Non-text Contrast | ⚠️ | axe-core | Icon border'ları yetersiz |
| 2.1.1 Keyboard (Tüm fonksiyonlar) | ✅ | Manuel | Tab navigasyonu çalışıyor |
| 2.1.2 No Keyboard Trap | ✅ | Manuel | Modal focus trap düzgün |
| 2.4.3 Focus Order | ✅ | Manuel | Mantıksal sıra |
| 2.4.7 Focus Visible | ⚠️ | CSS audit | Bazı elementler outline yok |
| 3.1.1 Language of Page | ✅ | HTML validator | `lang="tr"` tanımlı |
| 4.1.2 Name, Role, Value | ⚠️ | axe-core | `aria-label` eksiklikleri |

---

*Bu bölüm, Gistify sisteminin güvenlik, compliance, izlenebilirlik ve erişilebilirlik gereksinimlerini kapsayan derinlemesine bir teknik analiz içermektedir. Tüm kod örnekleri, production ortamına uyarlanmadan önce test edilmelidir.*



**16.1 Proje Yapısı (Güncellenmiş)**

```
client/src/
├── content/                    # Dinamik içerik sistemi
│   ├── ContentViewer.tsx
│   ├── ContentTabBar.tsx
│   ├── ContentTabList.tsx
│   ├── ContentRenderer.tsx
│   ├── ContentHeader.tsx
│   ├── ContentMeta.tsx
│   ├── ContentSkeleton.tsx
│   ├── ContentError.tsx
│   ├── ContentEmpty.tsx
│   ├── hooks/
│   │   ├── useContentList.ts
│   │   ├── useContent.ts
│   │   ├── useContentRegistry.ts
│   │   ├── useContentCache.ts
│   │   └── useContentSearch.ts
│   └── types/
│       ├── content.ts
│       └── registry.ts
├── social/                     # Sosyal katman (Flow)
│   ├── LikeButton.tsx
│   ├── CommentSection.tsx
│   ├── CommentForm.tsx
│   ├── CommentList.tsx
│   ├── CommentCard.tsx
│   ├── ShareButton.tsx
│   ├── ShareMenu.tsx
│   ├── SocialMeta.tsx
│   ├── hooks/
│   │   ├── useLike.ts
│   │   ├── useComments.ts
│   │   ├── useShare.ts
│   │   └── useSocialActivity.ts
│   └── types/
│       └── social.ts
├── lib/
│   ├── markdown/               # MD parser & renderer
│   │   ├── parser.ts
│   │   ├── renderer.tsx
│   │   ├── plugins/
│   │   │   ├── chart.ts
│   │   │   ├── alert.ts
│   │   │   └── card.ts
│   │   └── sanitize.ts
│   └── content/
│       ├── registry.ts
│       ├── cache.ts
│       └── normalizer.ts
├── pages/
│   ├── ContentPage.tsx         # app, momentum, daily-report
│   ├── FlowPage.tsx            # flow (content + social)
│   └── ...
└── components/ui/              # shadcn/ui
```

**16.2 TypeScript Interface'leri**

```typescript
// Content Types
export type ContentRoute = 'app' | 'momentum' | 'daily-report' | 'flow';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type ContentBadge = 'new' | 'updated' | 'hot' | 'star';

export interface ContentMeta {
  slug: string;
  route: ContentRoute;
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  author?: string;
  status: ContentStatus;
  priority: number;
  createdAt: string;
  updatedAt: string;
  version: number;
  readingTime?: number;
  language?: string;           // i18n support
  accessLevel?: 'free' | 'member' | 'premium';  // paywall
}

export interface ContentPayload {
  meta: ContentMeta;
  body: string;
  html?: string;
  figures?: string[];
  openAiFigures?: string[];
  tickerUniverse?: string[];
  assetBasePath?: string;
}

export interface TabConfig {
  id: string;
  label: string;
  icon?: string;
  badge?: ContentBadge;
  group?: string;
  priority: number;
  meta: ContentMeta;
}

export interface ContentRegistry {
  [route: string]: ContentMeta[];
}

// Social Types
export interface Like {
  id: string;
  contentSlug: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  contentSlug: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  parentId: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
  status: 'active' | 'deleted' | 'hidden';
  likes: number;
  replies: Comment[];
}

export interface ShareData {
  url: string;
  title: string;
  description: string;
  image?: string;
  hashtags?: string[];
}

// Component Props
export interface ContentViewerProps {
  route: ContentRoute;
  initialTab?: string;
  enableSocial?: boolean;
  showTabBar?: 'horizontal' | 'vertical' | 'none';
  showSearch?: boolean;
  showGroups?: boolean;
  showFavorites?: boolean;
  onTabChange?: (tab: TabConfig) => void;
  className?: string;
}

export interface ContentRendererProps {
  content: ContentPayload;
  theme?: 'dark' | 'light';
  customComponents?: Record<string, React.ComponentType<any>>;
}

export interface LikeButtonProps {
  contentSlug: string;
  initialCount: number;
  initialLiked: boolean;
  onLike?: (liked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showList?: boolean;
}

export interface CommentSectionProps {
  contentSlug: string;
  maxDepth?: number;
  sortBy?: 'newest' | 'oldest' | 'popular';
  pageSize?: number;
  enableRichText?: boolean;
  enableMentions?: boolean;
  enableEmoji?: boolean;
  onCommentSubmit?: (comment: Partial<Comment>) => void;
}

export interface ShareButtonProps {
  contentSlug: string;
  title: string;
  description: string;
  url: string;
  platforms: ('twitter' | 'linkedin' | 'whatsapp' | 'telegram' | 'email' | 'copy')[];
  showQR?: boolean;
  showEmbed?: boolean;
}
```

**16.3 React Query Hooks**

```typescript
// useContentList hook
export function useContentList(route: ContentRoute) {
  return useQuery({
    queryKey: ['content', route],
    queryFn: () => fetch(`/api/content/${route}`).then(r => r.json()),
    staleTime: 2 * 60 * 1000,
  });
}

// useContent hook
export function useContent(route: ContentRoute, slug: string) {
  return useQuery({
    queryKey: ['content', route, slug],
    queryFn: () => fetch(`/api/content/${route}/${slug}`).then(r => r.json()),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

// useContentRegistry hook
export function useContentRegistry({ route, initialTab }: { route: ContentRoute; initialTab?: string }) {
  const { data } = useContentList(route);
  const [activeTab, setActiveTab] = useState(initialTab || '');
  
  const tabs = useMemo(() => {
    return (data?.items || []).map((item: ContentMeta) => ({
      id: item.slug,
      label: item.title,
      priority: item.priority,
      meta: item,
    })).sort((a, b) => a.priority - b.priority);
  }, [data]);
  
  return { tabs, activeTab, setActiveTab };
}

// useLike hook (optimistic)
export function useLike(contentSlug: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => fetch('/api/social/like', { method: 'POST', body: JSON.stringify({ contentSlug }) }).then(r => r.json()),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['like', contentSlug] });
      const previous = queryClient.getQueryData(['like', contentSlug]);
      queryClient.setQueryData(['like', contentSlug], (old: any) => ({ ...old, liked: !old?.liked, count: (old?.count || 0) + (old?.liked ? -1 : 1) }));
      return { previous };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['like', contentSlug], context?.previous);
    },
  });
}

// useComments hook
export function useComments(contentSlug: string) {
  return useQuery({
    queryKey: ['comments', contentSlug],
    queryFn: () => fetch(`/api/social/comment/${contentSlug}`).then(r => r.json()),
    refetchInterval: 30000, // 30s polling
  });
}
```

**16.4 Zustand Store**

```typescript
// UI State Store
interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  favorites: Record<string, string[]>;
  recentTabs: Record<string, string[]>;
  notifications: Notification[];
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addFavorite: (route: string, slug: string) => void;
  addRecentTab: (route: string, slug: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'dark',
      favorites: {},
      recentTabs: {},
      notifications: [],
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
      addFavorite: (route, slug) => set((s) => ({ favorites: { ...s.favorites, [route]: [...new Set([...(s.favorites[route] || []), slug])] } })),
      addRecentTab: (route, slug) => set((s) => ({ recentTabs: { ...s.recentTabs, [route]: [slug, ...(s.recentTabs[route] || []).filter(t => t !== slug)].slice(0, 5) } })),
    }),
    { name: 'gistify-ui', partialize: (state) => ({ theme: state.theme, favorites: state.favorites, recentTabs: state.recentTabs }) }
  )
);
```

**16.5 Utility Functions**

```typescript
// Slugify (Türkçe karakter desteği)
export function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

// Format date (TR locale)
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (format === 'relative') {
    const diff = Date.now() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  }
  return d.toLocaleDateString('tr-TR', format === 'long' 
    ? { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: 'numeric', month: 'short', year: 'numeric' });
}

// Format number (compact)
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('tr-TR', { notation: 'compact', compactDisplay: 'short' }).format(num);
}
```

---

## Bölüm 20: Strateji, Önceliklendirme & Kaynak Planlaması

### 20.1 Bağımlılık Grafiği (Dependency Graph)

Hangi görev diğerlerini bloke eder, hangileri paralel yapılabilir? Aşağıdaki metinsel grafik, görevler arasındaki bağımlılık ve blokaj ilişkilerini göstermektedir:

```
Dinamik MD Sistemi (A1)
  → Tasarım Sistemi Birleştirme (A3) [bloke eder, yeni MD'ler eski tema ile gelir]
  → Sosyal Katman (A4) [içerik olmadan sosyal katman anlamsız]
  → Responsive Tablo (A4) [MD sisteminde tablolar render edilir]

Tasarım Sistemi Birleştirme (A3)
  → Responsive Tablo (A4) [tema birleştirmeden responsive stil tutarsız]
  → Accessibility (A4) [kontrast renkler tema'dan gelir]

Kod Yeniden Yapılandırma (A2)
  → Admin Panel (A2) [ReportsAdmin parçalanmadan admin yeni MD yönetemez]
  → Test Stratejisi (yeni) [test edilebilir kod olmadan test yazılamaz]
```

**Kritik Yol:** A1 (Dinamik MD) → A3 (Tasarım) → A4 (UX/Responsive) → A5 (Sosyal)

**Paralel Görevler:** NotFound, tactical-card, StockDetailTab (acil düzeltmeler) A1 ile paralel olarak yürütülebilir. Bu düzeltmeler, büyük yapısal değişikliklerden bağımsız olarak deploy edilebilir.

### 20.2 Test Stratejisi

**Mevcut Test Coverage:** Proje içerisinde mevcut test coverage oranı belirtilmemiştir. Tahmini değer **< %20**'dir. Bu durum, refaktör ve yeni özellik ekleme risklerini artırmaktadır.

**Hedef Coverage:**
- Unit test coverage: **%70**
- Critical paths coverage: **%80**

**Test Türleri:**

| Tür | Araç | Kapsam |
|-----|------|--------|
| **Unit** | Vitest + React Testing Library | Bileşen testleri (render, etkileşim, state) |
| **Integration** | Supertest + SQLite test DB | API endpoint'leri, veritabanı işlemleri |
| **E2E** | Playwright | Kritik kullanıcı akışları (headless tarayıcı) |

**CI/CD Pipeline (GitHub Actions Workflow):**

```yaml
# .github/workflows/ci.yml (özet)
1. Lint (ESLint + Prettier)
2. Type check (tsc --noEmit)
3. Unit tests (vitest run)
4. Build (vite build)
5. E2E tests (playwright test)
6. Deploy (Vercel production)
```

**Test Dosya Yapısı:**

```
client/src/
  content/
    __tests__/
      ContentViewer.test.tsx
      ContentRenderer.test.tsx
    hooks/
      __tests__/
        useContentRegistry.test.ts
```

**Test Edilecek Critical Paths:**

1. **Auth Flow:** Login → Dashboard → Logout
2. **Content CRUD:** Create → Read → Update → Delete
3. **Social Flow:** Like → Comment → Share
4. **Payment Flow:** Subscribe → Access Content → Cancel
5. **Admin Flow:** Upload → Publish → View

### 20.3 Performans Metrikleri & Baseline

**Mevcut Durum Ölçümü (Hedef Değerler):**

| Metrik | Mevcut (Tahmin) | Hedef | Araç |
|--------|-----------------|-------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 1.8s | Lighthouse CI, Web Vitals |
| **FCP** (First Contentful Paint) | < 1.8s | < 1.2s | Chrome DevTools |
| **TTI** (Time to Interactive) | < 3.8s | < 2.5s | Lighthouse |
| **Bundle Size** (initial) | < 200KB | < 150KB | `vite-bundle-analyzer` |
| **Lighthouse Skoru** | 60-70 | 90+ | Lighthouse CI |

**Ölçüm Araçları:** Lighthouse CI, Web Vitals, Chrome DevTools, `vite-bundle-analyzer`.

**Performance Budget:** Yeni bir feature eklenirken, mevcut initial bundle boyutunu **50KB'dan fazla artırmayacak**. Büyük kütüphaneler lazy-load ile yüklenecek (dynamic import). Her PR'da bundle size diff otomatik raporlanacak.

### 20.4 Gerçek Kullanıcı Verileri & Analytics

**Analytics Entegrasyonu:**
- **Vercel Analytics:** Mevcut, temel web vitals ve ziyaretçi metrikleri.
- **Google Analytics 4:** Eklenecek, detaylı event tracking ve conversion funnel için.

**Takip Edilecek Metrikler:**

| Metrik | Soru | Aksiyon |
|--------|------|---------|
| **Tab kullanım oranları** | Hangi tab'lar en çok açılıyor? | Düşük kullanımlı tab'lar gruplandırılacak veya kaldırılacak |
| **Mobil kullanım oranı** | Kullanıcıların % kaçı mobil? | Mobil-first UX kararları buna göre verilecek |
| **Bounce rate** | Tablo sayfalarında yüksek mi? | Yüksekse içerik düzeni veya yükleme hızı optimize edilecek |
| **Time on page** | Ortalama kaç dakika? | Düşükse içerik arama veya navigasyon iyileştirilecek |
| **Conversion funnel** | Landing → Sign up → Subscribe → Content view | Her adımdaki düşüş analiz edilip iyileştirilecek |

**Heatmap:** Hotjar veya Microsoft Clarity kullanılarak, kullanıcıların sayfada nereye tıkladığı, ne kadar kaydırdığı ve hangi alanlara dikkat etmediği görselleştirilecek.

**A/B Test Framework:** Feature flag + split testing. Yeni UX değişiklikleri (örneğin yeni tab bar düzeni) %50 kullanıcıya gösterilerek karşılaştırmalı analiz yapılacak.

> **Öneri:** Önce analytics altyapısını kur, sonra UX kararlarını veriyle destekle. "Hislerle" değil, "metriklerle" karar ver.

### 20.5 Maliyet ve Kaynak Tahmini

**Adam-Gün Hesaplaması (1 developer, full-time):**

| Aşama | Süre | Açıklama |
|-------|------|----------|
| **Aşama 1 (Acil)** | 5 gün | NotFound, tactical-card, StockDetailTab düzeltmeleri |
| **Aşama 2 (Kod yapılandırma)** | 15 gün | ReportsAdmin parçalama, dinamik MD altyapısı |
| **Aşama 3 (Tasarım sistemi)** | 20 gün | HEX → OKLCH, tema birleştirme, shadcn/ui standardizasyonu |
| **Aşama 4 (UX + Responsive)** | 15 gün | Tablo mobil uyumluluk, accessibility, yeni tab bar |
| **Aşama 5 (Sosyal)** | 15 gün | Like, comment, share, FlowPage entegrasyonu |
| **Test + QA** | 10 gün | Unit/integration/E2E test yazımı, hata düzeltmeleri |
| **Toplam** | **80 iş günü** | **~4 ay (haftada 5 iş günü varsayımıyla)** |

**Ek Kaynaklar (Aylık Maliyet):**

| Servis | Plan | Maliyet |
|--------|------|---------|
| Cloudflare R2 (CDN) | — | $5-10/ay |
| Sentry (Error Tracking) | Team | $26/ay |
| Vercel Pro (Hosting) | Pro | $20/ay |
| Google Analytics 4 | — | Ücretsiz |
| Hotjar | Plus | $39/ay |
| **Toplam Aylık Maliyet** | — | **~$90-100** |

### 20.6 Migration Riski & Geçiş Stratejisi

**HEX → OKLCH Geçişi:** Feature flag ile aşamalı geçiş yapılacak.

- Feature flag: `oklch-theme` (LaunchDarkly veya env variable ile yönetilecek)
- Kullanıcıların **%10'una** önce gösterilecek, stabilite onaylandıktan sonra **%100** açılacak.

**ReportsAdmin Parçalanması:** Yeni admin paneli ayrı route'ta geliştirilecek.

- Eski admin: `/app/admin` (deprecated, 30 gün sonra kaldırılacak)
- Yeni admin: `/app/admin/v2` (parallel development, eski admin bozulmadan çalışmaya devam edecek)

**Rollback Planı:** Her deploy öncesi son çalışan versiyon backup'ı alınacak.

- **Database:** Migration'lar reversible olmalı (down migration her migration dosyasında hazır bulunacak)
- **Frontend:** Blue/Green deployment (Vercel preview deploy üzerinden yeşil ışık alındıktan sonra production'a alınacak)
- **Canary:** Yeni özellikler **%5 kullanıcıya** önce gösterilecek, hata oranı izlenecek

**Feature Flag Stratejisi:**

```
ENABLE_DYNAMIC_MD=false (default)
  → test ortamında true
  → production %10
  → %100
```

Her feature flag, environment variable olarak yönetilecek ve aşağıdaki sıralamada açılacak:
1. Local development (her zaman açık)
2. Staging/Preview (test edilip onaylandıktan sonra)
3. Production Canary (%5-10 kullanıcı)
4. Production Full (%100)
