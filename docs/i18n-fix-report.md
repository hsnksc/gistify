# Gistify i18n Fix Report

## Uygulanan duzeltmeler

1. `client/src/lib/i18n.ts`
   - URL prefix'i tek dil kaynagi olacak sekilde cozumleme akisi duzeltildi.
   - `lng` ve `initImmediate:false` ile ilk boya dil sapmasi azaltildi.
   - Cookie + localStorage okunur/yazilir hale getirildi.

2. `client/index.html`
   - Head bootstrap eklendi.
   - `title`, description, canonical, `og:url`, `hreflang` etiketleri route + locale bazli guncellenir hale getirildi.

3. `client/src/App.tsx`, `client/src/components/PublicShell.tsx`, `client/src/components/LanguageSelector.tsx`
   - Dil degisimi localized route navigation uzerinden tek yonlu hale getirildi.
   - Header/nav/auth metinleri locale key'lerine baglandi.
   - Selector'a test icin `data-testid="language-selector"` eklendi.

4. `client/src/scanner/useScannerI18n.ts`, `client/src/scanner/components/ScannerPage.tsx`
   - Legacy scanner dictionary, ana `scanner` namespace'ine bridge edildi.
   - Ham key sizintisi ve yanlis `NEUTRAL` etiketi duzeltildi.

5. `client/src/lib/translateDynamic.ts`, `client/src/features/flow/hooks/useFlowComments.ts`, `server/openaiTranslation.ts`
   - Dinamik ceviride abort desteği eklendi.
   - Placeholder/url/email/cashtag/mention/markdown korumasi sertlestirildi.
   - Prompt version hash'e dahil edildi ve `temperature:0` kullanildi.

6. `client/src/components/reports/DailyReportViewer.tsx`
   - Viewer dili app language ile tekrar senkronlanir hale getirildi.
   - Kaynak, kategori, bos durum ve metrik label'lari locale'a baglandi.

7. Momentum workspace
   - `client/src/pages/MomentumLedgerPage.tsx`
   - `client/src/pages/MomentumCalibrationPage.tsx`
   - `client/src/components/momentum/MomentumV3Cards.tsx`
   - `client/src/components/momentum/MidasWatchlistCard.tsx`
   - `client/src/components/tabs/MomentumFlowSurface.tsx`
   - Bu yuzeylerde kalan TR/EN sabit metinler locale copy ile toplandi; sayfa metasi ve durum etiketleri locale'a baglandi.

8. Locale typing
   - `client/src/locales/en/common.json`
   - `client/src/locales/tr/common.json`
   - `client/src/i18n.generated.ts`
   - Yeni key'ler eklendi ve type union yeniden uretildi.

## Dogrulama

- `pnpm run check`: gecti
- `pnpm run i18n:check`: gecti (`unused key` warning'leri var, hata yok)

## Kalan risk / teknik borc

- `i18n-check` halen agirlikli olarak `unused key` uyarilari veriyor; hardcoded EN taramasi ve scanner/placeholder kapsami daha da genisletilebilir.
- Prompt'ta tarif edilen post'lar icin kalici TR/EN ceviri veritabani mimarisi bu pass'in kapsamina alinmadi; mevcut degisiklikler uygulama dil altyapisini ve gorunur UI senkronunu duzeltiyor.
