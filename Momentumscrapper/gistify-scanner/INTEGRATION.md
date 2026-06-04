# NASDAQ Scanner → Gistify Entegrasyon Rehberi

## Hızlı Başlangıç (2 Yol)

### Yol A: Otomatik Script (Önerilen)

```bash
# gistify ana dizinine git
cd gistify

# Scanner dosyalarını kopyala
cp -r /mnt/agents/output/gistify-scanner/client/src/scanner client/src/
cp -r /mnt/agents/output/gistify-scanner/client/src/pages/Scanner.tsx client/src/pages/

# App.tsx'e route ekle (aşağıdaki patch'i uygula)
```

### Yol B: Manuel Adım Adım

## Adım 1: Dosyaları Kopyala

Aşağıdaki dizin yapısını `client/src/` altına oluştur:

```
client/src/
  scanner/
    index.ts              ← Ana export dosyası
    types.ts              ← Tip tanımları
    useScannerI18n.ts     ← Çeviri hook'u
    locales/
      tr.ts               ← Türkçe çeviriler
      en.ts               ← İngilizce çeviriler
    lib/
      scoreConfig.ts
      sanityGate.ts
      yahooFinance.ts
      dataProviders.ts
      momentum.ts
      optionsStrategies.ts
      executionRules.ts
      regimeDetector.ts
      optionAnalytics.ts
      trainedModel.ts
      filters.ts
      backtestEngine.ts
      portfolioRisk.ts
      varEngine.ts
      consistencyReport.ts
      patternEngine.ts
      v4Engine.ts
      v3Report.ts
      advancedPattern.ts
      pdtAnalyzer.ts
      dailyScanner.ts
      microstructureCheck.ts
      aiCatalystAnalyzer.ts
      earningsMomentum.ts
      queryEngine.ts
      stockDatabase.ts
      browserTrainer.ts
      parallelScanner.ts
      advancedOptions.ts
      watchlist.ts
      utils.ts
    components/
      ScannerPage.tsx       ← Ana scanner UI
  pages/
    Scanner.tsx             ← Route wrapper
```

## Adım 2: App.tsx'e Route Ekle

`client/src/App.tsx`'te:

**a) Import ekle (diğer import'ların yanına):**
```tsx
import Scanner from "@/pages/Scanner";
import { Radar } from "lucide-react";
```

**b) Route ekle (Switch içine):**
```tsx
<Route path="/scanner" component={Scanner} />
```

**c) Nav menüye ekle (sidebar/nav varsa):**
```tsx
{ label: translateUiText("NASDAQ Scanner", lang), href: "/scanner", icon: Radar }
```

## Adım 3: Çalıştır

```bash
cd gistify/client
pnpm install  # Gerekirse
pnpm dev
```

Tarayıcıda: `http://localhost:3001/scanner`

---

## Dosya Açıklamaları

| Dosya | Görevi |
|-------|--------|
| `scanner/index.ts` | Ana export — `runMomentumScan()` fonksiyonu |
| `scanner/types.ts` | StockResult, OptionSetup, ScanResponse tip'leri |
| `scanner/useScannerI18n.ts` | Gistify i18n sistemiyle uyumlu çeviri hook'u |
| `scanner/locales/*.ts` | TR/EN çeviri sözlükleri |
| `scanner/lib/momentum.ts` | Ana momentum motoru (11 faktör) |
| `scanner/lib/dataProviders.ts` | Yahoo + Massive + TwelveData API'leri |
| `scanner/lib/scoreConfig.ts` | Ağırlıklar, skor renkleri, sinyal etiketleri |
| `scanner/lib/parallelScanner.ts` | Paralel tarama mantığı |
| `scanner/components/ScannerPage.tsx` | Scanner UI — filtreler, tablo, detaylar |

---

## Önemli Notlar

1. **API Limitleri**: Yahoo Finance ücretsiz ama rate-limited. Çok sık tarama yapmaktan kaçının.
2. **CORS**: Tarayıcıdan Yahoo Finance'a CORS proxy ile erişilir. Fallback zinciri: AllOrigins → corsproxy.io
3. **Piyasa Saatleri**: Tarama 09:30-16:00 EST arasında anlamlıdır. Dışında son kapanış verileri gösterilir.
4. **i18n**: Scanner otomatik olarak gistify'ın dil seçimini takip eder. `localStorage`'daki `app_language` key'ini okur.
