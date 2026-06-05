# Gistify Mimari Dokumani

Bu dosya, mevcut kod tabaninin dogru mimari ozetidir.
Eski "Earnings Benchmark" anlatimi artik bire bir gecerli degildir.
Uygulamanin kullaniciya donuk adi artik:

- `Earning Strategy`
- `Momentum`
- `Daily Report`

Legacy referans klasorleri:

- `benchmark/`
- `v2/`

Bu klasorler halen repoda durur ama canli uygulamanin source-of-truth'u degildir.

---

## 1. Uygulamanin Ozeti

Gistify, earnings odakli analiz platformudur. Mevcut urun yuzeyi 3 ana deneyimden olusur:

1. `Earning Strategy` workspace'i (`/app`)
2. `Momentum Scanner` workspace'i (`/momentum` ve `/scanner`)
3. `Daily Report Library` (`/daily-report`)

Bunlara ek olarak:

- marketing ve billing sayfalari vardir
- Google auth + Paddle subscription gating vardir
- admin tarafinda 3 ayri yayinlama workspace'i vardir:
  - weekly earnings reports
  - momentum snapshots
  - daily report packages

Kullanicinin gordugu ana bilgi mimarisi soyledir:

- `/app` secili haftanin published weekly report'unu gosterir
- `/momentum` canli tarama yapar ve gerekirse latest published momentum snapshot ile birlikte calisir
- `/daily-report` `dailyreport/` klasorundeki paketleri ve publish kayitlarini birlestirir

---

## 2. Urun Adlandirmasi

Kod tabaninda tarihsel nedenlerle hala `benchmark` adini tasiyan parcalar vardir:

- `package.json` name: `earnings_benchmark_report`
- `benchmark/` klasoru
- bazi seed/metin/artifact referanslari

Ancak gecerli kullanici adi:

- weekly workspace icin `Earning Strategy`

Bu nedenle yeni gelistirmelerde product adlandirmasi olarak `benchmark` degil `Earning Strategy` kullanilmalidir.

---

## 3. Teknoloji Yigini

- Frontend: React 19 + TypeScript
- Router: Wouter
- UI: Tailwind CSS + Radix tabanli component seti
- Grafikler: Recharts
- Server: Express
- Build:
  - frontend icin Vite
  - backend bundle icin esbuild
- Persistence: SQLite (`server/billingStore.ts`)
- Billing: Paddle
- Auth: Google OAuth + session cookie

Ana script'ler:

- `pnpm dev`
- `pnpm exec tsc --noEmit`
- `pnpm build`
- `pnpm start`

---

## 4. Ust Seviye Dizin Yapisi

```text
client/
  src/
    components/
      reports/
      tabs/
      ui/
    contexts/
    hooks/
    lib/
    pages/
    scanner/
    App.tsx
    main.tsx
    index.css

server/
  index.ts
  billingStore.ts
  weeklyReportSeeds.ts
  adminMarketData.ts
  dailyReportSources.ts

shared/
  weeklyReports.ts
  momentumReports.ts
  dailyReports.ts
  opportunities.ts
  const.ts

dailyreport/
  DDMMYYYY/
  DDMMYYYY.md
```

Onemli dosyalar:

- `client/src/App.tsx`
  - route shell
  - auth bootstrap
  - language/runtime translation
  - top navigation
- `client/src/pages/Home.tsx`
  - Earning Strategy viewer
- `client/src/lib/earningStrategyData.ts`
  - published weekly report -> tab dataset adapter
- `client/src/pages/Scanner.tsx`
  - momentum workspace shell
- `client/src/scanner/components/ScannerPage.tsx`
  - scanner UI
- `client/src/scanner/lib/parallelScanner.ts`
  - tarama motoru
- `client/src/scanner/lib/dataProviders.ts`
  - Yahoo + fallback provider katmani
- `client/src/pages/DailyReport.tsx`
  - daily report library viewer
- `client/src/pages/ReportsAdmin.tsx`
  - 3 workspace'li admin ekran
- `server/index.ts`
  - tum API route'lari ve auth/billing davranisi
- `server/billingStore.ts`
  - SQLite store
- `server/dailyReportSources.ts`
  - `dailyreport/` source package parser

---

## 5. Frontend Route Yapisi

`client/src/App.tsx` icindeki aktif route'lar:

### Public / marketing

- `/`
- `/pricing`
- `/terms`
- `/privacy`
- `/refund`
- `/pay`

### Product routes

- `/app`
  - Earning Strategy workspace
- `/momentum`
  - scanner page
- `/scanner`
  - `/momentum` alias'i
- `/daily-report`
  - daily report library
- `/app/admin`
  - admin workspace

### Teknik davranis

- marketing route'lari auth-gated degildir
- `/pay` public kalir ama `managed` modda checkout icin login bekler
- product route'lari auth durumuna gore shell icinde render edilir

---

## 6. Access Mode, Auth ve Billing

### Access mode

`server/index.ts` icinde:

- varsayilan access mode: `managed`
- `APP_ACCESS_MODE=public` verilirse public preview davranisi acilir

### `managed`

- Google OAuth aktif
- session tabanli kullanici okunur
- Paddle subscription durumu resolve edilir
- `membership.isSubscribed` gating icin kullanilir

### `public`

- fake/public auth payload doner
- tum uygulama pro erisimi acikmis gibi davranir
- bu mod esasen demo/preview amaclidir

### Billing

Aktif entegrasyon Paddle'dir.
Ilgili route'lar:

- `GET /api/auth/me`
- `GET /api/billing/paddle/public-config`
- `GET /api/billing/paddle/manage`
- `POST /api/billing/paddle/webhook`

Shopier route'lari bilincli olarak `410 Gone` doner.

---

## 7. Earning Strategy Workspace (`/app`)

### Amac

Bu ekran, published weekly report verisini tek bir analiz deneyimine donusturur.
Eski yapidaki gibi "5 sabit rapor" mantigi yoktur.
Canli viewer:

- server'dan published weekly report listesi ceker
- secili haftayi aktif dataset'e cevirir
- butun sekmelere ayni dataset'i dagitir

### Veri akisi

```text
/app
  -> GET /api/reports/weekly
  -> selectedPublishedReport
  -> buildEarningStrategyDataset(report)
  -> activeStocks / activeOptions / activeCalendar
  -> tab bileşenleri
```

### Viewer report secimi

`server/index.ts` icindeki `getViewerWeeklyReports()` su davranisi uygular:

- sadece `published` raporlari alir
- `weekEnd >= currentWeekStart` filtresi uygular
- en fazla 2 hafta dondurur
- frontend bunlari en yeni solda olacak sekilde render eder

### Static fallback

Published report gelmezse viewer calismaya devam eder:

- `client/src/lib/stockData.ts`
- `client/src/lib/optionStrategyData.ts`
- `earningsCalendar`

Bu fallback sadece bos kalmamasi icindir; asil source-of-truth published weekly report kayitlaridir.

### Sekmeler

Aktif sekme yapisi:

1. `overview`
2. `momentum`
3. `stocks`
4. `calendar`
5. `sector`
6. `risk`
7. `ivcrush`
8. `optiondetail`

### Sekme veri modeli

`buildEarningStrategyDataset()` published weekly report'taki `entries[]` verisini 3 forma donusturur:

- `stocks`
  - overview / momentum / risk / stock detail icin
- `options`
  - IV crush / option detail icin
- `calendar`
  - earnings takvimi icin

Boylece ustte hafta degistiginde tum sekmeler ayni dataset ile degisir.

### Tooltip davranisi

Chart tooltip etiketleri icin ortak helper:

- `client/src/lib/chartTooltip.ts`

Bu katman, bar/label mismatch sorunlarini azaltir.

---

## 8. Weekly Report Veri Modeli

Weekly report kontrati:

- `shared/weeklyReports.ts`

Ana tipler:

- `WeeklyReportRecord`
- `WeeklyReportContent`
- `WeeklyReportEntry`

`WeeklyReportEntry` alanlari sunlari kapsar:

- ticker ve earnings metadata
- momentum / RSI / price change
- IV crush metrikleri
- call/put premium senaryolari
- risk ve strategy rating
- thesis ve directional bias

Bu model hem viewer hem admin editor hem de opportunity sync tarafinda kullanilir.

---

## 9. Momentum Workspace

### Amac

Scanner modulu acilis momentumu tarar ve kullaniciya canli sonuc tablosu sunar.

### UI akisi

```text
/momentum
  -> Scanner.tsx
  -> ScannerPage.tsx
  -> runMomentumScan()
  -> scanParallel()
  -> fetchStockDataHybrid()
  -> analyzeStock()
```

### Scanner veri akisi

1. `ScannerPage.tsx` universe'i baslatir
2. `runMomentumScan()` scanner facade'idir
3. `parallelScanner.ts` chunk'li tarama yapar
4. `dataProviders.ts`
   - once Yahoo
   - sonra optional fallback provider'lar
5. `momentum.ts`
   - skor, confidence ve ranking uretir

### Duzeltilmis teknik not

Intraday veri artik provider katmanindan scanner analizine tasinir.
Yani Yahoo'dan gelen intraday seriler artik `analyzeStock()` icine gecmektedir.

### Published momentum snapshot

Viewer tarafinda:

- `GET /api/momentum/reports/latest`

Admin tarafinda:

- `GET /api/admin/momentum/reports`
- `POST /api/admin/momentum/reports`

Momentum report veri kontrati:

- `shared/momentumReports.ts`

---

## 10. Daily Report Library

### Amac

Gunluk markdown / klasor paketlerini kullaniciya kutuphane mantigiyla gostermek.

### Kaynaklar

`dailyreport/` altinda iki format desteklenir:

1. klasor paket
   - `dailyreport/DDMMYYYY/...`
2. tek markdown dosya
   - `dailyreport/DDMMYYYY.md`

### Viewer akisi

```text
/daily-report
  -> GET /api/daily-reports
  -> source package + published DB kayitlari birlesir
  -> DailyReportViewer
```

### Onemli davranis

Publish DB kaydi olmasa bile `dailyreport/` altindaki source package viewer'da gorunebilir.
Yani runtime dosya kaynagi da aktif source'tur.

### API'ler

- `GET /api/daily-reports`
- `GET /api/daily-reports/latest`
- `GET /api/daily-report/assets/*`

### Veri kontrati

- `shared/dailyReports.ts`

### Admin taraf

- `GET /api/admin/daily-report-sources`
- `GET /api/admin/daily-report-sources/:folderName`
- `GET /api/admin/daily-reports`
- `POST /api/admin/daily-reports`

---

## 11. Admin Workspace (`/app/admin`)

Admin ekran artik popup degil, tam sayfa workspace'tir.

### Workspace bolumleri

`client/src/pages/ReportsAdmin.tsx` 3 mod icinde calisir:

1. `earnings`
2. `momentum`
3. `daily`

### Earnings workspace

- weekly report listesi
- draft editor
- live/fallback suggestion akisi
- publish/save

Ilgili endpoint'ler:

- `GET /api/admin/reports/weekly`
- `GET /api/admin/reports/weekly/suggestions`
- `POST /api/admin/reports/weekly`

### Momentum workspace

- admin scanner snapshot secimi
- published momentum report yonetimi

### Daily workspace

- `dailyreport/` source package listesi
- source preview
- draft/publish daily report kaydi

### Yetkilendirme

Admin yetkisi 2 sekilde saglanir:

1. `managed` modda session user email'i `REPORT_ADMIN_EMAIL` ile eslesir
2. `x-gistify-admin-secret` header'i `REPORT_ADMIN_SECRET` ile eslesir

---

## 12. Backend Veri Katmani

Ana persistent store:

- `server/billingStore.ts`

Bu katman su kayitlari tutar:

- auth users / sessions
- managed subscriptions
- weekly reports
- momentum reports
- daily reports
- opportunities

Yani dosya sistemi ve SQLite birlikte kullanilir:

- SQLite -> publish kayitlari ve auth/billing state
- `dailyreport/` -> gunluk rapor source package'lari

---

## 13. Opportunity Sync

Published weekly reports'tan kullaniciya donuk firsat kayitlari turetilir.

Server tarafinda:

- `syncOpportunitiesFromPublishedWeeklyReports()`

Bu islem weekly report publish edildiginde ilgili opportunity tablosunu gunceller.

Bu kisim viewer UX'in merkezinde degil ama downstream urun mantigi icin onemlidir.

---

## 14. Deploy ve Runtime Notlari

### Onemli env'ler

- `APP_ACCESS_MODE`
- `SESSION_SECRET`
- `BILLING_DB_PATH`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `REPORT_ADMIN_EMAIL`
- `REPORT_ADMIN_SECRET`
- `PADDLE_ENV`
- `PADDLE_API_KEY`
- `PADDLE_CLIENT_TOKEN`
- `PADDLE_PRICE_ID`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_SUCCESS_URL`
- `PADDLE_CANCEL_URL`
- `FMP_API_KEY`
- `VITE_SCANNER_MASSIVE_API_KEY`
- `VITE_SCANNER_TWELVEDATA_API_KEY`
- `VITE_SCANNER_ALPHAVANTAGE_API_KEY`

### Docker/runtime notu

Daily report viewer'in bos kalmamasi icin runtime image'a `dailyreport/` klasorunun kopyalanmasi gerekir.
Bu davranis Dockerfile'da ayrica ele alinmistir.

### Analytics notu

Build sirasinda su placeholder'lar tanimli degilse warning gorulebilir:

- `%VITE_ANALYTICS_ENDPOINT%`
- `%VITE_ANALYTICS_WEBSITE_ID%`

Bu warning build'i kirmasa da deploy kalitesini etkiler.

---

## 15. Eski Dokumanla Farklar

Asagidaki maddeler, eski "Earnings Benchmark Raporu" anlatisinin neden artik dogru olmadigini ozetler:

1. Sistem artik 5 sabit rapora dayali degil; published weekly report kayitlarina dayali.
2. Weekly viewer artik 8 sekme kullanir ve hepsi ayni secili haftaya baglidir.
3. Admin panel popup degil, `/app/admin` altinda tam sayfa workspace'tir.
4. Admin sadece weekly reports degil, momentum ve daily report yayinlarini da yonetir.
5. Daily report library artik urunun birinci sinif parcasi haline gelmistir.
6. Auth varsayilani artik `managed` moddur; `public` sadece preview icindir.
7. Paddle aktif billing katmanidir; Shopier legacy/disabed durumdadir.
8. `benchmark/` ve `v2/` klasorleri canli mimari degil, tarihsel referanstir.

---

## 16. Source-of-Truth Dosyalari

Mimariyi anlamak icin once su dosyalara bakilmalidir:

- `client/src/App.tsx`
- `client/src/pages/Home.tsx`
- `client/src/lib/earningStrategyData.ts`
- `client/src/pages/Scanner.tsx`
- `client/src/scanner/components/ScannerPage.tsx`
- `client/src/pages/DailyReport.tsx`
- `client/src/pages/ReportsAdmin.tsx`
- `server/index.ts`
- `server/billingStore.ts`
- `shared/weeklyReports.ts`
- `shared/momentumReports.ts`
- `shared/dailyReports.ts`

Bu dosya (`yapi.md`) bu kod durumunu baz alir.
