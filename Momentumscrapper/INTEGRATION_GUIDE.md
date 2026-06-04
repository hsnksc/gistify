# NASDAQ Scanner → LOCA-AI Entegrasyon Rehberi

## Proje Analizi

| | LOCA-AI | NASDAQ Scanner |
|---|---|---|
| Framework | Next.js 14 App Router | React 19 + Vite |
| Styling | Tailwind CSS 3.4 | Tailwind CSS 3.4 |
| Charts | Recharts | Recharts |
| Icons | Lucide React | Lucide React |
| State | Zustand | React Context |
| Routing | App Router (`app/`) | React Router |
| Lang | TR/EN i18n | TR/EN i18n (yeni) |

**Ortak kütüphaneler zaten mevcut!** Sadece routing'i Next.js'e uyarlamak yeterli.

---

## 1. Dosya Yapısı (Kopyalanacak)

```
frontend/
  app/
    scanner/                 # YENİ: Scanner modülü
      page.tsx               # Ana scanner sayfası (/scanner)
      layout.tsx             # Scanner layout'u
      lib/                   # Scanner kütüphaneleri
        dataProviders.ts
        momentum.ts
        optionsStrategies.ts
        scoreConfig.ts
        sanityGate.ts
        yahooFinance.ts
        # ... diğer lib dosyaları
      types/
        scanner.ts
      i18n/
        I18nContext.tsx
      locales/
        tr.ts
        en.ts
      components/
        ScannerHeader.tsx
        ResultsTable.tsx
        StockDetailModal.tsx
        OptionsPanel.tsx
        StatsCards.tsx
  components/ui/             # Mevcut shadcn/ui
  lib/                       # Mevcut LOCA-AI lib
```

---

## 2. Hızlı Entegrasyon (5 Adım)

### Adım 1: Scanner dosyalarını kopyala

```bash
cd loca-ai/frontend

# Scanner dizinini oluştur
mkdir -p app/scanner/{lib,types,i18n,locales,components}

# Lib dosyalarını kopyala
cp /mnt/agents/output/app/src/lib/*.ts app/scanner/lib/

# Type'ları kopyala
cp /mnt/agents/output/app/src/types/scanner.ts app/scanner/types/

# i18n'yi kopyala
cp -r /mnt/agents/output/app/src/i18n/* app/scanner/i18n/
cp -r /mnt/agents/output/app/src/locales/* app/scanner/locales/

# Component'leri kopyala
cp /mnt/agents/output/app/src/sections/*.tsx app/scanner/components/
```

### Adım 2: Import path'lerini düzelt

Scanner'da `@/` path alias'ı var. Next.js'te bunu `app/scanner/` altına göre ayarlayacağız.

**`tsconfig.json`'a ekle:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@scanner/*": ["./app/scanner/*"]
    }
  }
}
```

Sonra scanner dosyalarındaki import'ları güncelle:
- `@/types/scanner` → `@scanner/types/scanner`
- `@/lib/momentum` → `@scanner/lib/momentum`
- `@/i18n/I18nContext` → `@scanner/i18n/I18nContext`
- `@/locales/tr` → `@scanner/locales/tr`

### Adım 3: Next.js Page oluştur

**`app/scanner/page.tsx`:**
```tsx
"use client";

import { useState, useCallback } from "react";
import { I18nProvider } from "./i18n/I18nContext";
import { Radar, Loader2, Square, Filter } from "lucide-react";
import ScannerHeader from "./components/ScannerHeader";
import ResultsTable from "./components/ResultsTable";

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [minScore, setMinScore] = useState("45");
  const [dte, setDte] = useState(21);
  const [filterSignal, setFilterSignal] = useState("ALL");

  const handleScan = useCallback(async () => {
    setIsScanning(true);
    setResults([]);

    // Scanner motorunu çağır
    const { runMomentumScan } = await import("./lib/momentum");
    const stocks = await runMomentumScan({
      minScore: parseInt(minScore),
      dte,
      signalFilter: filterSignal,
    });

    setResults(stocks);
    setIsScanning(false);
  }, [minScore, dte, filterSignal]);

  return (
    <I18nProvider>
      <div className="space-y-6 max-w-7xl mx-auto">
        <ScannerHeader
          onScan={handleScan}
          isScanning={isScanning}
          resultsCount={results.length}
        />

        {/* Filtreler */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Min Skor</label>
            <input
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-20 bg-slate-800 border border-slate-700 text-white rounded px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Vade (DTE)</label>
            <div className="flex gap-1">
              {[14, 21, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDte(d)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    dte === d
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Sinyal</label>
            <div className="flex gap-1">
              {["ALL", "STRONG_BUY", "BUY", "NEUTRAL"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterSignal(s)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    filterSignal === s
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {s === "ALL" ? "Tümü" : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sonuçlar */}
        {results.length > 0 && (
          <ResultsTable results={results} />
        )}
      </div>
    </I18nProvider>
  );
}
```

### Adım 4: Layout'a Scanner link'i ekle

Mevcut LOCA-AI sidebar/navbar'ına şunu ekle:

```tsx
import { Radar } from "lucide-react";

// Nav menüye ekle:
{ label: "NASDAQ Scanner", href: "/scanner", icon: Radar }
```

### Adım 5: Build & Test

```bash
cd loca-ai/frontend
npm run build
# Hata varsa import path'lerini kontrol et
```

---

## 3. Backend Entegrasyonu (Opsiyonel)

LOCA-AI'nin FastAPI backend'ine scanner endpoint'i ekleyebilirsin:

**`backend/app/routers/scanner.py`:**
```python
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/scanner", tags=["scanner"])

class ScanRequest(BaseModel):
    tickers: Optional[List[str]] = None
    min_score: int = 45
    dte: int = 21
    signal_filter: str = "ALL"

class ScanResult(BaseModel):
    ticker: str
    score: float
    signal: str
    price: float
    change_pct: float
    rvol: float
    rsi: float
    # ... diğer alanlar

@router.post("/scan", response_model=List[ScanResult])
async def run_scan(req: ScanRequest):
    # Python scanner motorunu çağır
    # veya TypeScript motorunu Node.js ile çalıştır
    results = await momentum_scan(
        tickers=req.tickers,
        min_score=req.min_score,
        dte=req.dte,
    )
    return results
```

---

## 4. Önemli Notlar

### React Router → Next.js Geçişi

| Scanner (React Router) | LOCA-AI (Next.js App Router) |
|---|---|
| `<Routes><Route path="/scan"...>` | `app/scanner/page.tsx` |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `<Link to="/analysis">` | `<Link href="/scanner/analysis">` |

### shadcn/ui Bileşenleri
LOCA-AI zaten shadcn/ui kullanıyorsa, scanner'ın UI bileşenleri (`Button`, `Input`, `Table` vb.) otomatik olarak çalışır.

### Zustand ile State Yönetimi
Scanner'ın local state'ini Zustand store'a taşıyabilirsin:

```tsx
// store/scanner.ts
import { create } from "zustand";

interface ScannerState {
  results: StockResult[];
  isScanning: boolean;
  settings: { minScore: number; dte: number };
  setResults: (r: StockResult[]) => void;
  setIsScanning: (v: boolean) => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
  results: [],
  isScanning: false,
  settings: { minScore: 45, dte: 21 },
  setResults: (r) => set({ results: r }),
  setIsScanning: (v) => set({ isScanning: v }),
}));
```

---

## 5. Docker Entegrasyonu

Mevcut `frontend/Dockerfile`'a scanner build adımı eklenmesi gerekmez — scanner frontend kodunun bir parçası olduğu için otomatik build edilir.

Ancak backend scanner endpoint'i eklersen `backend/Dockerfile`'a Python bağımlılıklarını ekle:

```dockerfile
# Backend Dockerfile'a ekle
RUN pip install yfinance pandas numpy
```

---

## Özet

| İşlem | Süre | Zorluk |
|---|---|---|
| Dosya kopyalama | 5 dk | Kolay |
| Import düzeltme | 15 dk | Orta |
| Next.js page oluşturma | 20 dk | Orta |
| Nav entegrasyonu | 5 dk | Kolay |
| Backend endpoint | 30 dk | Zor (opsiyonel) |
| **Toplam** | **~45 dk** | **Orta** |

Yardıma ihtiyacın olursa her adımda destek verebilirim.
