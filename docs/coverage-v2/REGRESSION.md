# Faz 4 — Geriye Dönük Uyumluluk & Guardrails

## Regresyon Kanıtı

Viz DSL'si içermeyen eski raporların parser çıktısı değişmedi.

- Test dosyası: `tests/coverage-v2/regression.test.ts`
- Kapsam: `client/src/features/coverage/lib/coverageSeed.ts` içindeki `CRWV v1`, `CRWV v2`, `NBIS v1` örnek raporları.
- Doğrulamalar:
  1. Eski raporlarda hiç `viz` bloğu üretilmiyor.
  2. Bölüm başlıkları ve sırası korunuyor.
  3. Mevcut blok tipleri (`quote`, `paragraph`, `list`, `table`, `checklist`) aynı şekilde ayrıştırılıyor.

Çalıştırma:

```bash
npx vitest run tests/coverage-v2
```

Sonuç (2026-07-03):

```text
Test Files  2 passed (2)
     Tests  12 passed (12)
```

## Şema Versiyonu

Viz bloklarında `"v": 1` zorunlu alandır. İleride şema değişikliği gerektiğinde:

- Yeni versiyon için ayrı Zod şeması tanımlanır.
- `parseVizSpec` önce `v` alanını okur ve ilgili şemaya yönlendirir.
- Eski `"v": 1` blokları mevcut şema ile doğrulanmaya devam eder.

## Bilinmeyen Tip Davranışı

`VizRenderer` içinde `switch` default case'i bilinmeyen `type` değerlerini yakalar ve
"Bilinmeyen görselleştirme tipi" fallback kartı gösterir; sayfa patlamaz.

## Bundle Bütçesi

Coverage sayfası chunk'ı:

```bash
npx tsx scripts/check-coverage-bundle.ts
```

Sonuç:

```text
Coverage chunk: Coverage-Dtg6_hRP.js
  Raw:  146.86 kB
  Gzip: 28.42 kB
  Budget: 60 kB
PASS: Coverage chunk is within budget.
```

## Kırıcı Değişiklik Yok

- `/app/admin` publish akışına dokunulmadı.
- DB şeması (`server/billingStore.ts`) değişmedi.
- Mevcut route'lar (`/coverage/:ticker`, `/coverage/calendar`, `/coverage`) aynı kaldı.
- Eski raporlar frontmatter ve markdown yapısını koruyor; yeni `spark` ve `max_gain: unlimited` alanları opsiyonel.
