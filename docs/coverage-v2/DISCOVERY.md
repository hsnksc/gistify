# Faz 0 — Keşif Raporu: Coverage Sayfası v2 Yükseltmesi

**Tarih:** 2026-07-03  
**Hedef:** `https://gistify.pro/coverage/[TICKER]?v=[VERSION_ID]` örneğin `/coverage/CRWV?v=CRWV-2026-07-03-b`  
**Kural:** Bu rapor salt okunur keşif içerir; kod yazılmamıştır.

---

## 1. Stack & Mimarî

| Katman | Teknoloji | Not |
|---|---|---|
| Build / Framework | Vite 7.1.7 + React 19.2.1 + Express 4.21.2 | SPA (client-side rendered). Sunucu sadece API + `dist/public` servisi. |
| Router | `wouter` 3.7.1 (patch'li) | `client/src/App.tsx` içinde route tanımları. `/coverage/:ticker` → `CoveragePage mode="detail"`. |
| Styling | Tailwind CSS v4.1.14 | `@theme inline` yapılandırması `client/src/index.css`'te; `tailwind.config.js` yok. |
| State/Context | React context | Tema (`ThemeContext`), dil (`AppLanguageContext`). |
| Package manager | pnpm 10.4.1 | — |
| TypeScript | 5.6.3 (bundler mod) | `tsconfig.json` alias: `@` → `client/src`, `@shared` → `shared`. |

**Önemli:** Proje kök dizini `client/` altında. Prompt'ta geçen `src/...` yolları bu repo'da `client/src/...` şeklinde konumlanmalıdır.

---

## 2. Coverage Sayfası: Route, Param ve Veri Akışı

### Route
```tsx
// client/src/App.tsx
<Route path={"/coverage/:ticker"}>
  {params => <CoveragePage language={language} mode="detail" ticker={params.ticker || ""} />}
</Route>
```

### `?v=` Versiyon Parametresi
- Tümüyle istemci tarafında `window.location.search` üzerinden çözülür.
- `getSelectedVersionId()` URL'den `v` değerini okur; eşleşen rapor `currentGroup` içinde aranır, bulunamazsa en yeni rapor gösterilir.
- Versiyon geçişleri `setLocation(buildVersionHref(ticker, report.id))` ile yapılır.

### Veri Kaynağı
- `GET /api/coverage/reports` → tüm yayınlanmış raporlar.
- `GET /api/coverage/reports/:id` → tek rapor JSON.
- `GET /api/coverage/reports/:id/markdown` → ham markdown.
- Sunucu: `server/routes/coverage/index.ts` iki kaynağı birleştirir:
  1. SQLite `coverage_reports` tablosu (`server/billingStore.ts`).
  2. Yerel markdown dosyaları (`server/coverageSources.ts`, `reports/coverage/`).
- İstemci gruplama `groupCoverageReports()` ile `coverageParser.ts`'te yapılır.

### Versiyon Strip & Diff
- Strip: mevcut ticker'ın tüm raporları `currentGroup` üzerinden render edilir.
- Diff: `Coverage.tsx` içinde `summarizeDiff()` fonksiyonu, `currentReport` ile hemen önceki versiyonu karşılaştırır. Çıktı:
  - `changedMetrics: { label, next, previous }[]`
  - `changedSections: string[]`
- Diff şeması için ayrı bir arayüz yok; ad-hoc nesne üretiliyor.

---

## 3. Markdown Pipeline

### Parser
- **Standart bir markdown kütüphanesi yok** (`marked`, `remark`, `MDX` kullanılmıyor).
- Özel parser: `client/src/features/coverage/lib/coverageParser.ts`.
- İşlevleri:
  - YAML-like frontmatter ayrıştırma (`splitFrontmatter`, `parseYamlFrontmatter`).
  - `##` / `###` başlıklarına göre section ayırma.
  - Blok sınıflandırma: `paragraph`, `quote`, `list`, `checklist`, `table`.
  - Inline formatlama: `**bold**`, `[link](url)`, `` `code` ``.

### Frontmatter Şeması (Mevcut)
```yaml
---
ticker: CRWV
company: CoreWeave, Inc.
exchange: NASDAQ
sector: AI Infrastructure
date: 2026-07-02
type: earnings-option-play
signal: SPEC-BULLISH
metrics:
  price: 85.69
  price_date: 2026-07-01
  change_pct: -13.92
  low52: 63.80
  high52: 166.22
  target_avg: 143.41
  earnings_date: 2026-08-11
  earnings_approx: true
  option_expiry: 2026-08-21
  iv: 96.2
  iv_rank: 31.7
  short_float: 15.42
  rsi: 37.98
  sma50: 110.42
  sma200: 100.48
  budget: 150
strategy:
  name: 130/150 Call Debit Spread
  legs: 1x Long 130C + 1x Short 150C @ 2026-08-21
  cost: 148
  max_gain: 1852
  max_loss: 148
  breakeven: 131.48
---
```

### Mevcut Bileşen Eşlemesi
Tablo imzalarına göre özel bileşenlere yönlendirme yapılıyor:

| İmza | Bileşen |
|---|---|
| `Strike/Bid/Ask` sütunları | `OptionsChainHeatmap` |
| `Hisse Fiyatı/P&L` | `PayoffChart` |
| `Seviye/Tür/Güç` | `LevelLadder` |
| `Tarih/Olay` | `CatalystTimeline` |
| `Dönem/EPS Tahmin/EPS Gerçek` | `EarningsHistoryChart` |
| `Ticker/İlişki` | `EcosystemChips` |
| `Senaryo` sütunu | `ScenarioCards` |
| `Kriter` sütunu | `ComparisonMatrix` |

### ```viz Fenced Block Durumu
- **Şu an desteklenmiyor.** Parser'da triple-backtick işleme yok.
- Mevcut `coverage/SKILL.md` yazar kılavuzu kod çitlerini "istenmedikçe yasak" olarak belirtiyor.
- Yeni DSL eklemek parser'a yeni bir blok tipi (`viz`) olarak eklenecek; eski raporlar etkilenmeyecek.

---

## 4. Mevcut Görselleştirme Bileşenleri

Konum: `client/src/features/coverage/components/`

| Bileşen | Teknik | Not |
|---|---|---|
| `RSIGauge.tsx` | Saf SVG | Yarım daire gauge, iğne, zon renkleri. |
| `PayoffChart.tsx` | Saf SVG | P&L eğrisi, zero line, breakeven/current-price çizgileri, hover tooltip. |
| `EarningsHistoryChart.tsx` | Saf SVG | EPS tahmin/gerçekleşen barlar. |
| `ProbabilityBars.tsx` | HTML/CSS | Olasılık şeritleri. |
| `OptionsChainHeatmap.tsx` | HTML `<table>` | Volume/IV barları. |
| `LevelLadder.tsx` | HTML/CSS | Seviye merdiveni. |
| `CatalystTimeline.tsx` | HTML/CSS | Katalizör zaman çizelgesi. |
| `EcosystemChips.tsx` | HTML/CSS | Ekosistem ilişki kartları. |

Ayrıca `client/src/components/ui/chart.tsx` Recharts wrapper'ı vardır, ancak v2 hedefi **sıfır runtime bağımlılık** SVG kütüphanesidir; Recharts kullanılmayacak.

---

## 5. Tema Token'ları & Dark Mode

### CSS Yapılandırması
Ana dosya: `client/src/index.css`

```css
@theme inline {
  --surface-base: #0a0e1a;
  --surface-raised: #111827;
  --surface-overlay: #1a2235;
  --surface-interactive: #23314a;

  --color-bg-base: var(--surface-base);
  --color-bg-elevated: var(--surface-raised);
  --color-text-primary: #f8fbff;
  --color-text-secondary: #c0ccda;
  --color-text-tertiary: #93a6bb;
  --color-text-muted: #77889f;

  --color-bull: #10b981;
  --color-bear: #ef4444;
  --color-caution: #f59e0b;
  --color-info: #3b82f6;

  --color-accent: #0ea5e9;
  --color-accent-hover: #0284c7;

  --font-sans: "IBM Plex Sans", "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;

  --radius: 0.75rem;
  /* ... */
}

:root {
  color-scheme: dark;
  --background: var(--color-bg-base);
  --foreground: var(--color-text-primary);
  --card: var(--color-bg-elevated);
  --primary: var(--color-accent);
  --border: var(--color-border-medium);
  /* ... */
}
```

### Dark Mode Mekanizması
- `client/src/contexts/ThemeContext.tsx` ile `dark` sınıfı `<html>`'e eklenip çıkarılır.
- Tailwind varyantı: `@custom-variant dark (&:is(.dark *));`
- **Kritik gözlem:** `App.tsx` `<ThemeProvider defaultTheme="dark">` şeklinde, `switchable={true}` vermeden kullanıyor. Dolayısıyla canlı tema değiştirici yok ve açık tema paleti tanımlı değil.
- v2'de hem açık hem koyu tema desteği için:
  - `:root` üzerinde açık tema token'ları tanımlanacak,
  - `.dark` altında koyu karşılıkları verilecek,
  - Coverage sayfasında (ve gerekirse global) theme toggle `switchable={true}` ile etkinleştirilecek.

---

## 6. i18n Mekanizması

- Basit React context: `client/src/contexts/AppLanguageContext` aslında `client/src/lib/i18n.ts` içinde `AppLanguageContext`.
- `useAppLanguage()` hook'u ve `copy(language, tr, en)` yardımcı fonksiyonu.
- UI metinleri çoğunlukla inline `copy(...)` çağrılarıyla yazılmış; JSON locale dosyası yok.
- Diller: `tr` | `en`; varsayılan `tr`.
- Viz bileşenleri için etiketler de `copy()` deseniyle veya merkezi bir `client/src/features/coverage/lib/coverageI18n.ts` yardımcısıyla yönetilebilir.

---

## 7. Veri Modeli ve Bilinen Hataların Kökeni

### Mevcut Tip Şemaları
```ts
// client/src/features/coverage/lib/coverageParser.ts
export interface CoverageStrategy {
  breakeven: number;
  cost: number;
  legs: string;
  max_gain: number;   // ← sadece number; "unlimited" desteklenmiyor
  max_loss: number;
  name: string;
}

export interface CoverageMetrics {
  budget?: number;
  changePct?: number;
  earningsDate?: string;
  high52?: number;
  iv?: number;
  ivRank?: number;
  low52?: number;
  optionExpiry?: string;
  price?: number;
  reportDate?: string;
  reportTimestamp?: string;
  rsi?: number;
  shortFloat?: number;
  targetAvg?: number;
  // spark: number[] yok
}
```

### Bilinen Hatalar ve Kökenleri
1. **MAX GAIN $0** — `max_gain` sayısal zorunlu; frontmatter'da 0 veya boş bırakılınca `$0` görünüyor. `"unlimited"` string değeri parse edilmiyor.
2. **7. Takip & Bayraklar boş kartı** — Section render edilirken `blocks` dizisi boş olmasına rağmen section container basılıyor; boş body kontrolü yok.
3. **8. bölümde olasılık iki kez** — `ProbabilityBars` + aynı verinin madde listesi halinde gösterimi; viz'e geçince sadece tek gösterim kalacak.
4. **Katalizör kartları taşma** — Uzun etiketlerde `overflow-wrap` / satır sınırı eksik.
5. **H2/H3 chip'leri debug görünümü** — Başlık üzerindeki küçük etiketler (`<Badge>`) tema dışı renklerde veya sert kontrastta; kicker stiline çevrilecek.

---

## 8. Riskler ve Önerilen Entegrasyon Noktası

### Riskler
1. **Açık tema yok:** Mevcut uygulama koyu tema varsayılan ve tek tema olarak çalışıyor. Açık tema token seti eklemek global CSS değişikliği gerektirir; yalnızca Coverage sayfasını kapsayacak şekilde sınırlandırılabilir.
2. **Markdown parser özelleştirme:** ` ```viz ` bloklarını tanımak için `coverageParser.ts` değişecek; regresyon riski yüksek. Test kapsamı genişletilmeli.
3. **Yazar kılavuzu çatışması:** Kod çitleri "yasak" olarak belirtilmiş; viz DSL'i dokümante edilmeli ve admin/yazar akışıyla senkronize edilmeli (ama admin akışına dokunulmayacak).
4. **Bundle bütçesi:** SPA olduğu için tüm viz bileşenleri ana chunk'a eklenebilir; code-splitting veya lazy import düşünülmeli. Hedef ≤60KB gzip artış.
5. **İstemci-özel render:** `window` kullanımı SSR olmadığı için güvenli, ancak bazı SVG ölçümleri için `useLayoutEffect`/`useId` ile hydration uyumsuzluklarından kaçınılmalı.

### Önerilen Entegrasyon Noktası
1. **Parser:** `coverageParser.ts` içine yeni `CoverageVizBlock` tipi ve `parseVizBlock()` fonksiyonu eklenir. Mevcut tablo-imza tabanlı render sistemi aynen kalır.
2. **Şema:** `client/src/features/coverage/lib/vizSchema.ts` oluşturulur; Zod v4 ile 12 tip şeması tanımlanır (`zod` zaten yüklü).
3. **Renderer:** `client/src/features/coverage/components/VizRenderer.tsx` oluşturulur; `type`'a göre `client/src/features/coverage/components/viz/` altındaki SVG bileşenlerine yönlendirir.
4. **Sayfa entegrasyonu:** `Coverage.tsx` içinde section blocks döngüsüne `viz` case'i eklenir; aynı zamanda `spark`, `max_gain: number | "unlimited"`, DTE rozetleri, sticky mini-header, TOC scrollspy, progress bar ve print CSS uygulanır.
5. **Tema:** `client/src/index.css` içine `.dark` olmayan açık tema karşılıkları eklenir; Coverage sayfasında tema toggle etkinleştirilir.
6. **Geliştirici galeri:** Yeni route `/dev/viz-gallery` yalnızca `import.meta.env.DEV` koşuluyla `App.tsx`'e eklenir.
7. **Test:** `client/src/features/coverage/lib/vizSchema.test.ts` ve snapshot testleri (parse → render) eklenebilir. Mevcut test altyapısı yoksa minimal bir Vitest setup'u kurulur (yoksa önce onay istenir).

---

## 9. Sonuç

Coverage sayfası v2 yükseltmesi teknik olarak uygundur:
- Mevcut mimari fenced `viz` bloklarını eklemeye izin verir.
- Zod, Tailwind v4, SVG yetkinliği ve React context i18n/tema altyapısı mevcuttur.
- En büyük işler: parser genişletme, açık tema paleti, 12 SVG bileşeni, sayfa UX iyileştirmeleri ve geriye dönük uyumluluk testleridir.

**Sonraki adım:** Faz 1 — Viz DSL + frontmatter şeması tasarımı için onay bekleniyor.
