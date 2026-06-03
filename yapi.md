# Gistify Yapi Dokumani

Bu dosya, projedeki mevcut yapinin tamamini teknik ve operasyonel olarak anlatir.
Amac, projeye daha sonra bakan birinin:

- uygulamanin ne oldugunu
- hangi katmanlardan olustugunu
- hangi route'larin ne yaptigini
- auth ve admin akisinin nasil calistigini
- haftalik earnings / IV crush sisteminin nasil modellendigini
- hangi env degiskenlerinin gerekli oldugunu
- deploy sirasinda neye dikkat edilmesi gerektigini

tek bir yerden anlayabilmesidir.

## 1. Uygulamanin Ozeti

Gistify, earnings odakli bir finansal analiz platformudur.
Mevcut ana urun akisi iki bolumden olusur:

1. Haftalik earnings / IV crush analiz workspace'i
2. Momentum scanner modulu

Su an ana uygulama mantigi `/app` route'u altinda haftalik rapor workspace'i olarak calisir.
Bu workspace, `v2` referans yapisindan esinlenerek tekrar tasarlanmistir:

- ustte haftalik rapor tab'lari
- solda secili haftanin analiz sekmeleri
- icerikte o haftaya ait earnings, hisse analizi, IV crush ve opsiyon plani
- admin tarafinda haftalik draft olusturma, duzenleme ve publish etme akisi

## 2. Teknoloji Yigini

Projede kullanilan ana teknolojiler:

- Frontend: React 19
- Router: Wouter
- UI: Tailwind + Radix UI tabanli component seti
- Grafikler: Recharts
- Server: Express
- Build:
  - frontend icin Vite
  - server bundle icin esbuild
- Veritabani: SQLite (`node:sqlite`, `DatabaseSync`)
- Dil:
  - frontend/runtime: TypeScript
  - backend: TypeScript

Ana script'ler:

- `pnpm dev`: lokal gelistirme
- `pnpm check`: TypeScript kontrolu
- `pnpm build`: production build
- `pnpm start`: production server

## 3. Ust Seviye Dizin Yapisi

Ana klasorler:

```text
client/
  src/
    components/
    contexts/
    lib/
    pages/
    scanner/

server/
  index.ts
  billingStore.ts
  weeklyReportSeeds.ts

shared/
  const.ts
  weeklyReports.ts

dist/
  public/
  index.js
```

Onemli dosyalar:

- `client/src/App.tsx`
  - uygulamanin ana shell'i
  - route tanimlari
  - auth bootstrap
  - header / footer / global navigation
- `client/src/pages/Home.tsx`
  - haftalik earnings workspace
- `client/src/pages/ReportsAdmin.tsx`
  - tam sayfa weekly report admin route'u
- `client/src/pages/Scanner.tsx`
  - scanner route'u
- `client/src/components/reports/WeeklyReportAdminPanel.tsx`
  - admin editorun reusable sayfa icerigi
- `client/src/lib/weeklyReports.ts`
  - frontend tarafindaki helper'lar
- `server/index.ts`
  - tum HTTP route'lari
  - auth, static page, weekly report API, translation API
- `server/billingStore.ts`
  - SQLite store
- `server/weeklyReportSeeds.ts`
  - ilk iki haftalik rapor seed verisi
- `shared/weeklyReports.ts`
  - haftalik rapor veri kontratlari

## 4. Frontend Route Yapisi

Ana route'lar `client/src/App.tsx` icinde tanimlidir.

### Public route'lar

- `/`
  - landing page
- `/pricing`
  - fiyat sayfasi
- `/terms`
  - kosullar
- `/privacy`
  - gizlilik
- `/refund`
  - iade
- `/pay`
  - Paddle odeme sayfasi icin ayrilmis route

### Uygulama route'lari

- `/app`
  - haftalik earnings / IV crush workspace
- `/app/admin`
  - haftalik rapor admin editoru
- `/scanner`
  - momentum scanner modulu

### Teknik not

App shell, marketing route'lari ile protected/application route'larini ayirir.
`/pay` route'u auth bootstrap'ten ayri ele alinir.

## 5. Access Modu ve Auth Mimarisi

Sistemde iki access modu vardir:

- `managed`
- `public`

Bu deger `APP_ACCESS_MODE` env'i ile belirlenir.

### `managed` mod

Bu modda:

- Google OAuth aktif olur
- session cookie uzerinden kullanici taninir
- `auth_users` ve `auth_sessions` tablolari kullanilir
- subscription/membership mantigi calisir

### `public` mod

Su an varsayilan ve aktif kullanilan mod budur.

Bu modda:

- uygulama sahte/public bir user payload dondurur
- Google login akisi root'a redirect olur
- uygulama genel olarak acik gorunur
- haftalik report editor'u session ile degil `REPORT_ADMIN_SECRET` ile acilir

Bu davranis `server/index.ts` icindeki `readAuthPayload()` ve `isPublicAccessMode()` uzerinden kontrol edilir.

## 6. Haftalik Earnings Workspace

Mevcut ana urun deneyimi `client/src/pages/Home.tsx` icindedir.

Bu ekranin mantigi:

- ustte haftalik rapor kart/tab listesi vardir
- en solda en yeni hafta gorunur
- secili haftaya gore solda sekme menusu degisir
- icerikte o haftanin raporu render edilir

### Ustteki haftalik tab mantigi

Viewer tarafinda sadece publish edilmis raporlar kullanilir.
Server tarafinda `GET /api/reports/weekly` su filtreyi uygular:

- sadece `published`
- aktif hafta ve onu takip eden pencere
- maksimum 2 haftalik gosterim
- response, frontend'de en yeni hafta solda olacak sekilde render edilir

### Sol sekmeler

Mevcut sekmeler:

- `overview`
- `calendar`
- `ivcrush`
- `stocks`
- `options`

### Icerik mantigi

#### Overview

- haftalik headline
- summary
- market context
- KPI kartlari
- top picks
- sektor bazli skor dagilimi
- execution notlari

#### Calendar

- earnings tarihine gore gruplanmis ticker listesi
- gun bazli dagilim

#### IV Crush

- firsat siralamasi
- chart ve tablo

#### Stocks

- secili ticker detay analizi
- radar chart
- risk / beat / IV / tarihsel okuma

#### Options

- call / put premium oyunu
- reward / risk hesaplari
- onerilen strateji

## 7. Admin Weekly Report Akisi

Admin paneli `client/src/components/reports/WeeklyReportAdminPanel.tsx` icindedir.

UI davranisi:

- `/app` ekraninda sag altta `Admin` butonu vardir
- buna basinca editor popup'i acilir
- editor acilmak icin `REPORT_ADMIN_SECRET` ister
- secret basarili ise admin raporlari yuklenir

### Admin yetkilendirme kurali

Backend tarafinda admin olmak icin iki yol vardir:

1. `managed` modda session user e-postasi `REPORT_ADMIN_EMAIL` ile eslesir
2. `public` modda request header:
   - `x-gistify-admin-secret`
   - bu deger `REPORT_ADMIN_SECRET` ile eslesir

### Admin panelinin yaptiklari

- mevcut raporlari listeler
- secili raporu draft olarak acip duzenler
- yeni hafta taslagi olusturur
- rapora ticker ekler / siler
- headline, summary, market context, execution notes duzenler
- entry seviyesinde ticker bazli tum alanlari duzenler
- draft kaydeder
- publish eder

### Publish sonucu

Bir rapor `published` olunca:

- viewer API icine dahil olur
- eger aktif / gelecek 2 haftalik pencereye giriyorsa `/app` ustunde gorunur
- yeni hafta solda olacak sekilde tab listesine eklenir

## 8. Weekly Report Veri Modeli

Ortak tipler `shared/weeklyReports.ts` icindedir.

Ana tip:

- `WeeklyReportRecord`

Alanlari:

- `id`
- `slug`
- `title`
- `weekStart`
- `weekEnd`
- `analysisDate`
- `status`
  - `draft`
  - `published`
- `authorEmail`
- `createdAt`
- `updatedAt`
- `publishedAt`
- `content`

`content` alani:

- `headline`
- `summary`
- `marketContext`
- `executionNotes`
- `keyCatalysts`
- `entries`

`entries` icindeki her `WeeklyReportEntry` sunlari tasir:

- temel hisse alanlari
  - `ticker`
  - `name`
  - `sector`
  - `earningsDate`
  - `earningsTime`
- momentum alanlari
  - `momentumScore`
  - `priceChange6M`
  - `rsi14`
- IV alanlari
  - `currentIV`
  - `historicalIV`
  - `impliedMove`
  - `expectedIVCrush`
  - `ivCrushPotential`
- opsiyon alanlari
  - `callPremiumBuy`
  - `callPremiumSell`
  - `callGainFromIV`
  - `putPremiumBuy`
  - `putPremiumSell`
  - `putGainFromIV`
- skor ve risk alanlari
  - `ivCrushScore`
  - `strategyRating`
  - `riskLevel`
  - `earningsMissRisk`
  - `gapRisk`
- trade / analiz alanlari
  - `recommendedStrategy`
  - `targetProfit`
  - `maxLoss`
  - `lastEarningsMove`
  - `historicalIVCrush`
  - `beatRate`
  - `thesis`
  - `directionalBias`

## 9. Seed Raporlar

Ilk acilista weekly report tablosu bos ise server seed data yukler.

Bu seed mantigi:

- `server/weeklyReportSeeds.ts`
- iki haftalik rapor uretir
- `v2` mantigindaki haziran earnings setini kullanir
- artik `v2/` klasorune runtime bagimliligi yoktur

Seed haftalar:

- 01 - 07 Haziran
- 08 - 14 Haziran

Bu sayede sistem ilk deploy'da bos gelmez.

## 10. Veritabani Yapisi

Veritabani dosyasi:

- env verilmezse: `./data/billing.sqlite`
- production/Coolify icin tipik deger: `/app/data/billing.sqlite`

DB mantigi `server/billingStore.ts` icindedir.

### Tablolar

#### `billing_subscriptions`

Uyelik kayitlari.
Eski Shopier/billing mimarisinden kalan subscription tablosudur.

#### `billing_orders`

Eski order tablosu.
Shopier gecmisi icin kalmis durumda.

#### `auth_users`

Google login ile olusan user kayitlari.

#### `auth_sessions`

Session kayitlari.
Cookie ile baglantili.

#### `weekly_reports`

Yeni weekly earnings sistemi icin ana tablo.

Alanlar:

- `id`
- `slug`
- `title`
- `week_start`
- `week_end`
- `analysis_date`
- `status`
- `author_email`
- `created_at`
- `updated_at`
- `published_at`
- `content_json`

`content_json` tum rapor govdesini JSON olarak tutar.

## 11. Server API Yapisi

Server route'lari `server/index.ts` icindedir.

### Saglik

- `GET /api/health`

### Auth

- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Billing

- `GET /api/billing/status`

### Weekly reports

- `GET /api/reports/weekly`
  - viewer icin publish edilmis haftalari dondurur
- `GET /api/admin/reports/weekly`
  - admin tum raporlari gorur
- `POST /api/admin/reports/weekly`
  - admin draft kaydeder veya publish eder

### Opportunities ve watchlist

- `GET /api/opportunities`
  - publish edilmis weekly report'lardan turetilen aktif firsatlari tier filtreli dondurur
- `GET /api/opportunities/:id`
  - tekil firsat detayi
- `GET /api/opportunities/:id/related`
  - ayni sektorden benzer firsatlar
- `GET /api/watchlist`
- `POST /api/watchlist`
- `PATCH /api/watchlist/:ticker`
- `DELETE /api/watchlist/:ticker`
- `GET /api/me/watchlist`
- `POST /api/me/watchlist`
- `PATCH /api/me/watchlist/:ticker`
- `DELETE /api/me/watchlist/:ticker`

Bu katman, `v3` gelistirme dokumanindaki genis agent yapisinin ilk uygulanmis parcasi olarak durur.
Su an gercek zamanli agent yoktur; bunun yerine admin tarafindan publish edilen weekly report verileri
`opportunities` tablosuna projection olarak yazilir.

### Admin agent projection kontrolu

- `GET /api/admin/agents/runs`
  - manuel projection run loglarini listeler
- `POST /api/admin/agents/trigger`
  - published raporlardan firsat projection senkronizasyonunu manuel tetikler

### Translation

- `POST /api/i18n/translate`
  - runtime TR -> EN UI cevirisi icin kullanilir

### Legacy / kapali route'lar

- `POST /api/billing/shopier/checkout`
- `POST /api/billing/shopier/webhook`

Bu iki endpoint su an `410` dondurur.
Yani Shopier akisi pratikte kapatilmis durumdadir.

### Static marketing HTML

Server, crawler / review uyumu icin su sayfalari ham HTML olarak da servis eder:

- `/`
- `/pricing`
- `/terms`
- `/privacy`
- `/refund`

Bu ozellikle Paddle domain review gibi akislarda kullanislidir.

## 12. Scanner Modulu

Scanner route'u:

- `/scanner`

Ana dosya:

- `client/src/pages/Scanner.tsx`

Ic mantik:

- scanner UI ayri bir modul olarak acilir
- ana data source Yahoo onceliklidir
- opsiyonel fallback API'ler env ile verilebilir

Opsiyonel env'ler:

- `VITE_SCANNER_MASSIVE_API_KEY`
- `VITE_SCANNER_TWELVEDATA_API_KEY`
- `VITE_SCANNER_ALPHAVANTAGE_API_KEY`

Scanner weekly report sisteminden bagimsizdir ama ayni genel shell ve tema icinde calisir.

## 13. Public Sayfalar ve Paddle Hazirligi

Public marketing sayfalari:

- landing
- pricing
- terms
- privacy
- refund
- pay

Bu alanlar iki amaca hizmet eder:

1. kullaniciya urun/fiyat/yasal bilgi vermek
2. Paddle domain review icin gorunur ve erisilebilir bir website sunmak

Su an Paddle env placeholder'lari mevcuttur fakat gercek odeme akisi kodda tamamlanmis degildir.
`/pay` route'u ayrilmistir, fakat billing tarafinda gecis su anda tamamlanmamis hazirlik modundadir.

## 14. UI / Tema Yonu

Genel tasarim dili:

- koyu tactical finance temasi
- emerald / green vurgu rengi
- yuvarlak kartlar
- analytics / terminal hissi veren veri panelleri

`v2`'den alinan temel tasarim ilkeleri:

- report-merkezli dusunme
- haftayi sec, sonra haftanin analiz sekmeleri icinde ilerle
- ticker bazli drill-down
- admin tarafinda rapor olustur / yayinla

## 15. Dil Yapisi

UI tarafinda TR ana dil kabul edilir.
Runtime ceviri mantigi vardir:

- `client/src/lib/i18n.ts`
- `POST /api/i18n/translate`

Sistem tamamen klasik i18n dosya bazli degil; runtime translation yardimiyla TR -> EN cevirisi yapar.
Public shell tarafinda TR / EN toggle vardir.

## 16. Onemli Env Degiskenleri

Ornekler `.env.example` icindedir.

### Core

- `PORT`
- `NODE_ENV`
- `APP_BASE_URL`
- `APP_ACCESS_MODE`
- `SESSION_SECRET`
- `BILLING_DB_PATH`

### Google OAuth

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_OAUTH_REDIRECT_URL`

### Weekly report admin

- `REPORT_ADMIN_EMAIL`
- `REPORT_ADMIN_SECRET`

### Manual subscription override

- `SUBSCRIBED_EMAILS`
- `ELITE_EMAILS`

### Paddle placeholders

- `PADDLE_ENV`
- `PADDLE_API_KEY`
- `PADDLE_CLIENT_TOKEN`
- `PADDLE_PRODUCT_ID`
- `PADDLE_PRICE_ID`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_SUCCESS_URL`
- `PADDLE_CANCEL_URL`

### Analytics placeholders

- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`

### Scanner provider keys

- `VITE_SCANNER_MASSIVE_API_KEY`
- `VITE_SCANNER_TWELVEDATA_API_KEY`
- `VITE_SCANNER_ALPHAVANTAGE_API_KEY`

## 17. Coolify / Production Notlari

Production deploy icin tipik gereksinimler:

- domain:
  - `APP_BASE_URL=https://senin-domainin`
- SQLite persistence:
  - volume: `/app/data`
  - `BILLING_DB_PATH=/app/data/billing.sqlite`
- admin editor:
  - `REPORT_ADMIN_SECRET` mutlaka set edilmeli

### Onerilen minimum production env

```env
NODE_ENV=production
PORT=3000
APP_BASE_URL=https://gistify.pro
APP_ACCESS_MODE=public
SESSION_SECRET=uzun-ve-rastgele-bir-secret
BILLING_DB_PATH=/app/data/billing.sqlite

REPORT_ADMIN_EMAIL=hsnksc@gmail.com
REPORT_ADMIN_SECRET=guclu-bir-admin-secret
```

### Public mod sonucu

`APP_ACCESS_MODE=public` ise:

- genel kullanici tarafi acik kalir
- admin editor secret ile acilir
- Google auth zorunlu olmaz

### Managed mod sonucu

`APP_ACCESS_MODE=managed` olursa:

- Google login tekrar zorunlu hale gelir
- weekly report admin, `REPORT_ADMIN_EMAIL` ile oturum acmis kullanici uzerinden de calisabilir

## 18. Bilinen Durumlar ve Kisitlar

Su anki bilinen noktalar:

1. Shopier akisi devre disi
2. Paddle route/env hazirliklari var ama production billing akisi tamamlanmis degil
3. Weekly report sistemi aktif ve kalici
4. Viewer tarafinda sadece publish edilmis raporlar gorunur
5. Admin tarafi secret'a bagli
6. Opportunities katmani su an weekly report projection mantigiyla beslenir; gercek zamanli market ingestion henuz yoktur
7. Build sirasinda analytics placeholder uyarilari gorulebilir
8. `Home` chunk'i buyuktur; ileride code-splitting yapilabilir

## 19. Haftalik Report Is Akisi

Bugunku operasyonel is akisi su sekildedir:

1. Admin `/app` ekranina gelir
2. Sag alttaki `Admin` butonuna basar
3. `REPORT_ADMIN_SECRET` girer
4. Mevcut haftayi acar veya yeni hafta taslagi olusturur
5. Hisseleri, headline'i, summary'yi, market context'i ve trade notlarini duzenler
6. Once `draft` olarak kaydedebilir
7. Hazirsa `publish` eder
8. Publish edilen hafta viewer tarafinda ust tab olarak gorunur
9. En yeni hafta solda yer alir

## 20. Sonuc

Projenin mevcut cekirdegi artik su uclu bir yapiya oturmus durumdadir:

- marketing/public website
- haftalik report-merkezli earnings workspace
- admin tarafinda kalici weekly report editoru

Bu, `v2`'deki fikirlerin artik dosya ici demo olmaktan cikarak:

- SQLite ile kalici
- API ile yonetilen
- admin publish mantigi olan
- deploy edilebilir
- operasyonel olarak bakilabilir

bir urun yapisina donusturulmus halidir.
