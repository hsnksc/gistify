# Coverage Sayfası v2 — Değişiklik Günlüğü

## Faz 5 — Kalite & Demo

- `/dev/viz-gallery` route'u `client/src/App.tsx`'e eklendi; yalnızca `import.meta.env.DEV` koşuluyla render ediliyor.
- `client/src/features/coverage/components/VizGallery.tsx` 12 viz tipini light+dark yan yana gösteriyor.
- Lighthouse Accessibility denetimi **96 / 100** ile geçti (hedef ≥ 95).
- Erişilebilirlik düzeltmeleri:
  - `client/index.html`: `maximum-scale=1` → `maximum-scale=5`.
  - `client/src/App.tsx`: üst navigasyon pasif butonlarında kontrast `text-foreground/80` yapıldı.
- `docs/coverage-v2/A11Y.md` raporu ve `lighthouse-a11y.json` ham verisi eklendi.
- Son kontroller: `pnpm check` ✅, `npx vitest run` ✅ (47 test), `pnpm build` ✅, bundle bütçe ✅ (Coverage chunk ~14.56 kB gzip).

## Faz 4 — Geriye Dönük Uyumluluk & Guardrails

- `tests/coverage-v2/regression.test.ts` ile eski rapor regresyon kanıtı.
- `tests/coverage-v2/vizSchema.test.ts` ile CRWV golden blok şema testleri.
- `scripts/check-coverage-bundle.ts` ile coverage chunk gzip bütçe kontrolü.
- `docs/coverage-v2/REGRESSION.md` dokümantasyonu.
- Bilinmeyen `type` ve geçersiz viz blokları için fallback kart.
- `"v": 1` şema versiyonu zorunlu alan.

## Faz 3 — Sayfa Düzeyi UX + Hata Düzeltmeleri

- Sticky mini-header: ilerleme çubuğu, ticker, signal badge, fiyat/değişim, dil/tema toggle.
- Hero metrik kartlarına sparkline, değişim pilli ve DTE rozetleri.
- Sağ ray TOC + scrollspy (desktop).
- Görsel version diff: eski → yeni + delta chip + yön oku.
- Bölüm header'larındaki debug badge kaldırıldı, soluk kicker yapıldı.
- Boş section body render edilmiyor.
- `prob` viz varsa duplicate olasılık listesi gizleniyor.
- Katalizör kartları: taşma fix, tone pill, önem yıldızları.
- Print CSS eklendi.

## Faz 2 — SVG Viz Bileşen Kütüphanesi

- `client/src/features/coverage/components/viz/` altında 12 SVG bileşen.
- `VizRenderer` `type` bazlı dispatch.
- `index.css` açık/koyu tema refactorü.
- `prefers-reduced-motion` global kuralı.

## Faz 1 — Viz DSL + Frontmatter Sözleşmesi

- `client/src/features/coverage/lib/vizSchema.ts` (Zod) 12 tip şema.
- `coverageParser.ts` ` ```viz ` fenced block desteği.
- Frontmatter `spark.price` ve `strategy.max_gain: "unlimited"` desteği.
- `docs/coverage-v2/DISCOVERY.md` ve `VIZ-SPEC.md`.

## Faz 0 — Keşif

- Repo stack, coverage pipeline, tema token'ları ve riskler raporlandı.
- `docs/coverage-v2/DISCOVERY.md`.
