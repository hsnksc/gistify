# Google Search Console (GSC) Setup Guide for Gistify.pro

> This guide covers the complete Google Search Console onboarding, verification, indexing, monitoring, and optimization workflow for [gistify.pro](https://gistify.pro). It is intended for both initial setup and ongoing SEO maintenance.

---

## 📌 1. Gistify İçin Property Türü Seçimi / Property Creation for Gistify

Google Search Console (GSC) offers two property types. For Gistify, **Domain property** is the strongly recommended choice.

### Domain Property (`gistify.pro`) — Önerilen / Preferred

| Özellik | Domain Property | URL-prefix Property |
|---------|-----------------|-------------------|
| Scope | `gistify.pro` + tüm sub-domain’ler ve protokol’ler | Sadece belirtilen URL prefix’i |
| Sub-domain kapsamı | Evet (www, app, blog dahil) | Hayır (her subdomain ayrı property) |
| Protokol kapsamı | Evet (http + https) | Hayır (http ve https ayrı) |
| Verification | DNS TXT kaydı gerekli | HTML meta tag, HTML file, Google Analytics, Google Tag Manager |
| Veri birleştirme | Tek dashboard’ta tüm veriler | Parçalanmış veri, risk of double-counting |

**Gistify için seçim:**
- **Domain Property** — `gistify.pro` seviyesinde kurulacak. Bu, `www.gistify.pro`, `app.gistify.pro`, `https://`, `http://` (redirect halinde) gibi tüm varyasyonları otomatik kapsar.
- Eğer Gistify'in staging ortamı farklı bir sub-domain üzerindeyse (örn: `staging.gistify.pro`), bu da Domain Property kapsamına girer; ancak filtrelerle ayrılabilir.

**Neden Domain Property?**
1. **Gistify’in içerik yapısı** (`/tr/:slug`, `/earnings/:ticker`, `/scanner`, `/tools`) URL-prefix property’lerle parçalanmayacak şekilde tek bir çatı altında toplanır.
2. **Protokol varyasyonları** (HTTPS zorunlu, ancak harici linkler HTTP ile başlayabilir) tek property’de birleştirilir.
3. **Gelecek büyüme** (blog.gistify.pro, app.gistify.pro gibi sub-domain’ler) otomatik olarak izlenir.

---

## 🔐 2. Doğrulama (Verification) Yöntemleri

### 2.1 DNS TXT Kaydı (Önerilen / Preferred Method)

Bu yöntem, Domain Property için tek geçerli doğrulama mekanizmasıdır.

**Adımlar:**

1. GSC’de “Add Property” → “Domain” seçeneğini tıkla.
2. Alan adı olarak `gistify.pro` gir.
3. GSC, aşağıdaki gibi bir TXT kaydı verecek:
   ```
   google-site-verification=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. **DNS yönetim paneline** (Cloudflare, GoDaddy, Namecheap, vb.) gir.
5. Gistify.pro için bir **TXT kaydı** ekle:
   - **Type:** `TXT`
   - **Name:** `@` (veya boş bırak, root domain için)
   - **Value:** `google-site-verification=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **TTL:** `3600` (1 saat) veya `Auto`
6. Kaydet ve DNS yayılımını bekle (5 dk – 48 saat arası; genellikle 15-30 dk).
7. GSC’de “Verify” butonuna tıkla.

**Gistify Özel Notu:**
- Eğer DNS Cloudflare üzerindeyse, proxy (orange cloud) ayarı DNS kaydı için **OFF** (grey cloud) olmalı — ancak TXT kayıtları proxy’den etkilenmez, yani doğrudan eklenebilir.
- DNSSEC aktifse, herhangi bir ek adım gerekmez; TXT doğrulaması çalışır.

### 2.2 HTML Meta Tag (Yedek / Fallback Method)

Bu yöntem sadece **URL-prefix property** için geçerlidir. Domain Property’de kullanılamaz. Ancak Gistify’in bazı alt dizinleri veya alt property’leri için gerekebilir.

**Adımlar:**

1. GSC’de “Add Property” → “URL-prefix” seçeneğini tıkla.
2. URL olarak `https://gistify.pro/` gir.
3. “HTML tag” doğrulama seçeneğini seç.
4. GSC şu meta tag’i verecek:
   ```html
   <meta name="google-site-verification" content="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
   ```
5. Bu tag’i Gistify’in `<head>` bölümüne ekle — tüm sayfalarda render edilmelidir.
   - `server/index.ts`’te `registerSeoRoutes(app)` çağrısından önce, SSR/Helmet katmanında bu meta tag’i enjekte edilebilir.
   - React Helmet veya benzeri bir `<head>` yönetimi kullanıyorsanız, `layout.tsx` veya `App.tsx`’e global olarak ekle.
6. Gistify’i build et ve deploy et (`pnpm run build`).
7. GSC’de “Verify” butonuna tıkla. Google bot’un tag’i görmesi için birkaç dakika bekle.

**Ne Zaman Kullanılır?**
- Domain Property’nin DNS doğrulaması başarısız olursa veya DNS erişimi yoksa geçici olarak.
- Belirli bir sub-path (örn: `https://gistify.pro/blog/`) için ayrı bir property izlemek istenirse.

### 2.3 Doğrulama Sonrası Adımlar

1. Property doğrulandıktan sonra GSC dashboard’ı veri toplamaya başlar.
2. İlk veriler genellikle **24-48 saat** içinde görünür.
3. Doğrulama başarılı olduktan sonra, Gistify’e **tam erişimli kullanıcı (Full owner)** yetkisi ver. Sadece “Full” yetkili kullanıcılar sitemap submit edebilir ve URL inspection yapabilir.

---

## 🗺️ 3. Sitemap Gönderimi (Sitemap Submission)

### 3.1 Sitemap URL Formatı

Gistify için sitemap’ler şu konvansiyona göre yapılandırılmalıdır:

```
https://gistify.pro/sitemap.xml           # Ana sitemap index
https://gistify.pro/sitemap-static.xml    # Statik sayfalar (homepage, pricing, about, scanner, tools)
https://gistify.pro/sitemap-earnings.xml    # Earnings sayfaları (programmatic SEO)
https://gistify.pro/sitemap-strategies.xml # Strateji sayfaları
https://gistify.pro/sitemap-tr.xml          # Türkçe içerikler (/tr/:slug)
```

**Sitemap Index Formatı (sitemap.xml):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://gistify.pro/sitemap-static.xml</loc>
    <lastmod>2025-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://gistify.pro/sitemap-earnings.xml</loc>
    <lastmod>2025-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://gistify.pro/sitemap-tr.xml</loc>
    <lastmod>2025-01-15</lastmod>
  </sitemap>
</sitemapindex>
```

**Türkçe İçerik Sitemap’i (sitemap-tr.xml) Örneği:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://gistify.pro/tr/opsiyon-stratejileri</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gistify.pro/tr/momentum-ticareti</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 3.2 Sitemap Nasıl Gönderilir?

**GSC Web Arayüzü ile:**
1. GSC → Property seç (`gistify.pro`).
2. Sol menüden **Sitemaps**’e tıkla.
3. “Add a new sitemap” alanına sitemap URL’sini gir:
   - `sitemap.xml` (index file)
4. “Submit” butonuna tıkla.
5. Status: **Success** görünmesi gerekir. Eğer “Couldn’t fetch” veya “Has errors” görünüyorsa:
   - Sitemap URL’sine tarayıcıdan erişilebildiğini doğrula (`https://gistify.pro/sitemap.xml`).
   - `robots.txt` dosyasında sitemap’in engellenmediğini kontrol et.
   - XML formatını doğrula ([xml-sitemaps.com/validate-xml-sitemap.html](https://www.xml-sitemaps.com/validate-xml-sitemap.html)).

**robots.txt’ye Sitemap Referansı:**
```
User-agent: *
Allow: /

Sitemap: https://gistify.pro/sitemap.xml
```

Bu, Gistify’in `robots.txt` dosyasına eklenmelidir (`public/robots.txt` veya `server/index.ts`’te dinamik olarak serve edilmelidir).

### 3.3 Sitemap Bakımı / Sitemap Maintenance

| Görev | Sıklık | Açıklama |
|-------|--------|----------|
| Sitemap güncelleme | Günlük (programmatic) / Haftalık (statik) | Earnings sayfaları her gün eklenebilir; Türkçe içerikler haftalık güncellenir. |
| `lastmod` timestamp güncelleme | Her güncelleme sonrası | Google’a içeriğin değiştiğini sinyalize eder. |
| Hatalı URL temizliği | Aylık | “Excluded” ve “Error” statüsündeki URL’leri incele. |
| Sitemap index yeniden yapılandırma | 3 aylık | Yeni içerik türleri (örn: yeni bir tool) için yeni sitemap dosyası ekle. |

---

## 🔍 4. URL Inspection Aracı — Yeni İçerik İndeksleme Talebi

### 4.1 URL Inspection Nedir?

URL Inspection Tool, GSC’nin en güçlü operatif araçlarından biridir. Bir URL’in Google indeksindeki durumunu, taranabilirliğini, render edilmiş halini ve meta verilerini kontrol eder.

### 4.2 Yeni Türkçe İçerikler İçin İndeksleme Talebi / Request Indexing for Turkish Articles

Gistify’de yeni bir `/tr/:slug` içeriği yayınlandığında (örn: `/tr/opsiyon-stratejileri`), bu URL’in hızlıca indekslenmesi için:

1. GSC → URL Inspection (sol menüdeki büyüteç ikonu veya “URL Inspection”)
2. Arama kutusuna URL’yi tam olarak gir:
   ```
   https://gistify.pro/tr/opsiyon-stratejileri
   ```
3. “Enter” veya “Test Live URL” → Google, URL’i fetch eder ve analiz eder.
4. Sonuç ekranında şu bilgileri kontrol et:
   - **URL is on Google:** ✅ İndekslenmiş demektir.
   - **URL is not on Google:** ❌ Henüz indekslenmemiş. “Request Indexing” butonuna tıkla.
   - **Crawl allowed?** (robots.txt engellemiyor mu?)
   - **Fetch as Google:** Render edilmiş HTML’i gör; meta title, description, JSON-LD schema var mı kontrol et.
5. “Request Indexing” butonuna tıkla. Google, URL’i öncelikli kuyruğa alır ve genellikle **birkaç saat – 1-2 gün** içinde indeksler.

### 4.3 Programmatic SEO Sayfaları İçin İndeksleme / Indexing Programmatic Pages

Gistify’in programmatic SEO sayfaları (`/earnings/:ticker`, `/strategy/:id`) yeni eklendikçe toplu olarak indeksleme talebi gerekebilir. GSC’nin URL Inspection Tool’u toplu (bulk) işlem desteklemez, ancak şu stratejiler kullanılabilir:

**Strateji A: Yeni Sayfaları Önceliklendirme**
- Her earnings sezonu öncesinde (Q1, Q2, Q3, Q4) yeni ticker sayfaları açılır.
- Bu sayfaların listesini bir CSV olarak tut (`new-earnings-urls.csv`).
- GSC’de manuel olarak 10-20 öncelikli URL için “Request Indexing” yap.

**Strateji B: Sitemap Güncellemesi**
- Yeni programmatic sayfalar açıldığında `sitemap-earnings.xml` otomatik olarak güncellenir.
- GSC, sitemap’i periyodik olarak ziyaret eder; `lastmod` değişikliği indeksleme hızını artırır.

**Strateji C: Internal Linking ile Keşif (Discovery)**
- Yeni `/earnings/:ticker` sayfaları, Gistify homepage’indeki “Bu Haftanın Earnings” bölümünde veya scanner sonuçlarında link almalıdır.
- Internal link = Google bot’un sayfayı keşfetmesi için en güçlü sinyal.

### 4.4 URL Inspection’da Kontrol Edilmesi Gerekenler

| Kontrol Noktası | Beklenen Durum | Hata Durumunda Yapılacak |
|-----------------|--------------|--------------------------|
| Crawl allowed? | Yes | robots.txt veya meta robots noindex kontrolü |
| Page fetch | Successful | Server 5xx/4xx hatası varsa `server/index.ts`’te route handler’ı kontrol et |
| Mobile usability | Usable | Viewport meta tag, tıklanabilir eleman mesafeleri |
| Indexing allowed? | Yes | `<meta name="robots" content="noindex">` varsa kaldır |
| Title | Gistify — [Sayfa Başlığı] | Title eksik veya çok uzunsa (65+ karakter) düzelt |
| Description | [Açıklama] | Description eksik veya duplicate ise düzelt |
| JSON-LD Schema | [Schema tipi] | Schema hatası varsa json-ld-schema.md’yi kontrol et |
| Hreflang | tr, en | Türkçe sayfalar `hreflang="tr"`, İngilizce sayfalar `hreflang="en"` |

---

## 📊 5. Performance (Search Performance) Raporu — Nasıl Okunur ve Optimize Edilir?

### 5.1 Performance Raporu Metrikleri

GSC → Performance → Search Results. Bu rapor, Gistify’in organik arama performansını gösterir.

**Ana Metrikler:**

| Metrik | Türkçe | Tanım | Gistify İçin Önemli Mi? |
|--------|--------|-------|-------------------------|
| **Impressions** | Gösterim | Arama sonuçlarında görünme sayısı | ✅ Evet — Gistify’in içerikleri ne kadar görünüyor? |
| **Clicks** | Tıklama | Arama sonuçlarından siteye gelen ziyaretçi | ✅ Evet — Dönüşüm öncesi metrik |
| **CTR** | Tıklama Oranı | Clicks / Impressions (%) | ✅ Çok önemli — Title + meta description optimizasyonu |
| **Position** | Ortalama Sıralama | Arama sonuçlarındaki ortalama pozisyon | ✅ Evet — 1-10 arası ilk sayfa; 11+ ikinci sayfa |

### 5.2 Queries Sekmesi — Hangi Anahtar Kelimelerden Geleniyoruz?

1. GSC → Performance → Queries sekmesi.
2. “Pages” ve “Queries” sekmelerini birlikte kullan:
   - **Pages:** Hangi URL’ler trafik çekiyor?
   - **Queries:** Hangi arama sorguları o URL’leri getiriyor?
3. Filter ekle: **Page** = `https://gistify.pro/tr/*` → Sadece Türkçe içeriklerin performansını gör.

**Örnek Gistify Sorgu Analizi:**

| Query | Impressions | Clicks | CTR | Position | Aksiyon |
|-------|-------------|--------|-----|----------|---------|
| "0DTE opsiyon stratejisi" | 1,200 | 85 | 7.1% | 4.2 | Title’da "0DTE" öne çek; description’ı zenginleştir |
| "momentum trading Türkçe" | 890 | 120 | 13.5% | 2.8 | ✅ İyi performans; benzer içerik üret |
| "VWAP stratejisi" | 2,500 | 45 | 1.8% | 8.5 | Position düşük; title + heading optimizasyonu, backlink |
| "earnings options play" | 3,100 | 210 | 6.8% | 3.5 | İngilizce içerik; Gistify’in İngilizce versiyonu yoksa çeviri düşün |

### 5.3 CTR Optimizasyonu / CTR Optimization for Gistify

Düşük CTR, yüksek impressions = **Gistify’in title ve meta description’ı arama sorgusuyla eşleşmiyor** demektir.

**CTR Optimizasyon Taktikleri:**

1. **Title Tag Optimizasyonu:**
   - 50-60 karakter arasında tut.
   - Anahtar kelimeyi başa koy.
   - CTA (call-to-action) ekle: "Ücretsiz", "Rehber", "2025", "Analiz".
   - Örnek: `0DTE Opsiyon Stratejisi Rehberi 2025 | Gistify` → `0DTE Opsiyon Stratejisi: VWAP + Momentum | Ücretsiz Rehber`

2. **Meta Description Optimizasyonu:**
   - 150-160 karakter.
   - Sorgu niyetine cevap ver.
   - Örnek: `Gistify'da 0DTE opsiyon stratejilerini öğren: VWAP breakout, mean reversion ve IV crush taktikleri. Ücretsiz scanner ve earnings takvimi ile.`

3. **Rich Snippets (Zengin Sonuçlar):**
   - FAQ schema, HowTo schema, Review schema kullan.
   - Gistify’in tool sayfalarında "Review" schema (kullanıcı puanları) eklenirse yıldızlı sonuçlar çıkar.
   - Türkçe içeriklerde `JSON-LD` FAQ schema ile CTR %20-30 artabilir.

4. **Date Freshness:**
   - Gistify’in yıllık güncellenen içeriklerinde (örn: "2025 Opsiyon Stratejileri") URL’de yıl olmasa bile title’da yıl belirt.

### 5.4 Position Optimizasyonu / Ranking Improvement

Position 1-10 = İlk sayfa. Position 11+ = İkinci sayfa (tıklanma oranı %90 düşer).

**Position İyileştirme Stratejileri:**

| Position Aralığı | Strateji |
|-------------------|----------|
| 11-20 | İçerik derinliğini artır (2,000+ kelime), internal link ekle, heading yapısını optimize et |
| 6-10 | Backlink kazanımı (HARO, guest post, outreach), page speed optimizasyonu |
| 4-5 | Title + CTR optimizasyonu, featured snippet için yapılandırılmış data (tablo, liste) |
| 2-3 | Eksik olan “user intent” kapsamı — rakiplerden daha kapsamlı içerik üret |
| 1 | Koru ve genişlet: related keywords, video, interaktif element ekle |

---

## ⚡ 6. Core Web Vitals (CWV) Raporu — LCP, INP, CLS

### 6.1 Core Web Vitals Nedir?

Core Web Vitals, Google’ın kullanıcı deneyimini ölçen 3 temel metriğidir. Gistify’in sıralamasını ve “Page Experience” sinyalini etkiler.

### 6.2 Metrikler ve Eşik Değerleri / Metrics & Thresholds

| Metrik | Tam Adı | Türkçe | İyi | Düzeltilmeli | Kötü | Neyi Ölçer? |
|--------|---------|--------|-----|--------------|------|------------|
| **LCP** | Largest Contentful Paint | En Büyük İçerikli Boyama | ≤ 2.5s | 2.5s – 4.0s | > 4.0s | Sayfanın ana içeriğinin ne kadar hızlı yüklendiği |
| **INP** | Interaction to Next Paint | Etkileşim Sonrası Boyama | ≤ 200ms | 200ms – 500ms | > 500ms | Kullanıcı tıklama/etkileşim sonrası sayfanın ne kadar hızlı yanıt verdiği |
| **CLS** | Cumulative Layout Shift | Kümülatif Düzen Kayması | ≤ 0.1 | 0.1 – 0.25 | > 0.25 | Sayfa yüklenirken elementlerin ne kadar yer değiştirdiği |

**Gistify İçin Hedef:**
- LCP: **< 2.5s** (öncelikli: hero image veya ana chart widget)
- INP: **< 200ms** (öncelikli: scanner sayfası, earnings ticker arama)
- CLS: **< 0.1** (öncelikli: reklam/CTA banner’lar, lazy-loaded chart’lar)

### 6.3 LCP (Largest Contentful Paint) — Nasıl İyileştirilir?

**Gistify’de LCP’yi Etkileyen Elementler:**
- Ana sayfa hero section’ındaki büyük görsel/illustration
- Scanner sayfasındaki ilk chart/widget
- Earnings sayfasındaki stock ticker başlığı ve grafiği

**LCP İyileştirme Adımları:**

1. **Hero Image Optimizasyonu:**
   - WebP veya AVIF formatına çevir (gulp/sharp ile build pipeline’a ekle).
   - `<img srcset>` ile responsive image serve et.
   - `fetchpriority="high"` attribute’ünü LCP elementine ekle:
     ```html
     <img src="/hero-gistify.webp" fetchpriority="high" alt="Gistify Scanner" />
     ```

2. **Critical CSS Inline:**
   - Hero section ve above-the-fold CSS’ini inline olarak `<head>`’e ekle.
   - Vite’nin `critical` plugin’ini veya `critters` paketini kullan.

3. **Font Yükleme Optimizasyonu:**
   - `font-display: swap` kullan.
   - Sadece kullanılan karakter setini subset olarak yükle.
   - Google Fonts kullanıyorsanız `&display=swap` parametresi ekle.

4. **Server Response Time (TTFB):**
   - Gistify’in backend’i Express + TypeScript. `server/index.ts`’te:
     - Static asset’leri CDN üzerinden serve et (Cloudflare, Vercel Edge, AWS CloudFront).
     - API response’larını cache’le (Redis veya in-memory cache).

5. **Preload LCP Element:**
   ```html
   <link rel="preload" as="image" href="/hero-gistify.webp" />
   ```

### 6.4 INP (Interaction to Next Paint) — Nasıl İyileştirilir?

INP, FID (First Input Delay) yerine 2024’ten itibaren resmi Core Web Vital oldu. Gistify’in interaktif araçları (scanner, earnings search, ticker lookup) için kritik.

**INP İyileştirme Adımları:**

1. **Long Tasks’ı Böl:**
   - Scanner sonuçlarını render ederken `requestIdleCallback` veya `setTimeout(..., 0)` ile heavy computation’ları yield et.
   - React kullanıyorsanız, `React.memo`, `useMemo`, `useCallback` ile gereksiz re-render’ları önle.

2. **Event Handler Optimizasyonu:**
   - Ticker arama input’unda debounce kullan (örn: 300ms). Her keystroke’ta API çağrısı yapma.
   - Scanner filtresinde “Apply” butonu kullan; anlık filtreleme yerine.

3. **Main Thread’i Serbest Bırak:**
   - Heavy data processing (earnings calculation, technical indicator computation) için Web Worker kullan.
   - Gistify’in indicator hesaplamaları (RSI, MACD, VWAP) client-side yapılıyorsa, Web Worker’a taşı.

4. **Third-Party Script Yönetimi:**
   - Analytics, chat widget, reklam script’lerini `async` veya `defer` ile yükle.
   - Partytown.js kullanarak third-party script’leri web worker’a taşı.

### 6.5 CLS (Cumulative Layout Shift) — Nasıl İyileştirilir?

CLS, kullanıcıların “yanlışlıkla tıklama” yapmasına neden olan en sinir bozucu metriktir.

**Gistify’de CLS’yi Etkileyen Durumlar:**
- Lazy-loaded chart’lar yüklendiğinde sayfa aşağı kayıyor.
- Reklam/CTA banner’ları dinamik olarak ekleniyor.
- Scanner sonuçları yüklendiğinde tablo yüksekliği değişiyor.

**CLS İyileştirme Adımları:**

1. **Görsel ve Medya Elementleri için Boyut Rezervasyonu:**
   ```html
   <img src="chart.png" width="800" height="400" alt="Scanner Chart" />
   ```
   - Tüm `<img>`, `<video>`, `<iframe>` elementlerine `width` ve `height` attribute’ü ekle.
   - CSS’te `aspect-ratio` kullan:
     ```css
     .chart-container { aspect-ratio: 16 / 9; }
     ```

2. **Font Yükleme CLS’sini Önle:**
   - `font-display: optional` kullan — eğer font yüklenmezse fallback font hemen gösterilir.
   - `size-adjust` ile fallback font ve web font arasındaki boyut farkını minimize et.

3. **Dinamik İçerik için Rezerv Alan:**
   - Scanner sonuçları yüklenmeden önce skeleton/placeholder UI göster.
   - CTA banner’ları için sabit yükseklikte container rezerve et; banner yüklenince container büyümesin.

4. **Late-Loading Widget Yönetimi:**
   - Chat widget, cookie consent banner gibi elementler için `transform: translateY(100%)` animasyonu yerine, sayfa yüklenirken hemen yerlerini rezerve et.

### 6.6 Core Web Vitals İzleme Araçları

| Araç | Kullanım Amacı | Gistify İçin Öneri |
|------|---------------|-------------------|
| **GSC → Core Web Vitals** | Gerçek kullanıcı verisi (CrUX) | Haftalık kontrol; “Poor” URL’leri önceliklendir |
| **PageSpeed Insights** | Lab + Field data | Her deployment sonrası 5 kritik URL test et |
| **Lighthouse CI** | CI/CD pipeline entegrasyonu | GitHub Actions’a entegre et; PR başına LCP/INP/CLS kontrolü |
| **Web Vitals Extension** | Gerçek zamanlı development kontrolü | Geliştirme sırasında tarayıcıda anlık CWV gör |
| **CrUX BigQuery** | Büyük ölçekli analiz | Aylık raporlama için BigQuery’e CrUX data export |

---

## 📱 7. Mobile Usability ve Güvenlik Raporları / Mobile Usability & Security Issues

### 7.1 Mobile Usability Raporu

GSC → Experience → Mobile Usability.

Gistify’in mobil kullanıcıları (özellikle Türkçe trader’lar, telefon üzerinden piyasayı takip edenler) için kritik.

**Kontrol Edilecek Hatalar:**

| Hata | Açıklama | Gistify İçin Çözüm |
|------|----------|-------------------|
| **Text too small to read** | 12px altı font | Base font-size: 16px; minimum 14px |
| **Clickable elements too close** | Buton/link arası < 48x48px | Scanner butonları, CTA’lar için minimum 48px tap target |
| **Content wider than screen** | Horizontal scroll | `max-width: 100vw`, chart’lar için `overflow-x: auto` container’ları |
| **Viewport not configured** | `<meta viewport>` eksik | React Helmet veya `index.html`’de `<meta name="viewport" content="width=device-width, initial-scale=1">` |

**Gistify Özel Mobil Kontrol Listesi:**
- [ ] Scanner sayfasındaki chart’lar mobilde pinch-to-zoom destekliyor mu?
- [ ] Earnings ticker input’u mobil klavye açıldığında görünür kalıyor mu?
- [ ] `/tr/:slug` sayfalarındaki tablolar (opsiyon chain, price data) mobilde responsive mı?
- [ ] CTA butonları ("Pro Upgrade", "Scanner’ı Kullan") mobilde thumb-friendly mı?

### 7.2 Security Issues Raporu

GSC → Security & Manual Actions → Security Issues.

**Gistify’de Kontrol Edilmesi Gereken Güvenlik Sorunları:**

| Sorun Tipi | Belirti | Önlem |
|------------|---------|-------|
| **Malware** | GSC uyarısı, Google “Bu site güvenli değil” | Düzenli malware taraması (Sucuri, Wordfence — static site ise build pipeline’ı kontrol et) |
| **Phishing** | Sahte login sayfaları, spoofed domain | Sub-domain monitoring, SSL sertifikası kontrolü |
| **Hacked Content** | Inject edilmiş spam link’ler, gizli metin | CSP (Content Security Policy) header’ları ekle, `server/index.ts`’te XSS filtresi |
| **Social Engineering** | Sahte indirme butonları, misleading CTA | Third-party script’leri audit et, ad network’leri güvenilir kaynaklardan kullan |

**Gistify için CSP Header Önerisi (server/index.ts):**
```typescript
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://analytics.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.gistify.pro;"
  );
  next();
});
```

### 7.3 Manual Actions Raporu

GSC → Security & Manual Actions → Manual Actions.

- **“No issues detected”** görüyorsan ✅
- **“Unnatural links to your site”**, **“Thin content”**, **“Cloaking”** gibi bir uyarı varsa acilen çöz.
- Gistify’in programmatic SEO sayfaları (earnings, strategy) thin content riski taşır. Her sayfada **unique, substantive content** (min. 300-500 kelime) olmalı.

---

## ✅ 8. Haftalık GSC Monitoring Kontrol Listesi / Weekly Monitoring Checklist

Gistify’in SEO sağlığını korumak için haftalık tekrarlanması gereken görevler:

### 8.1 Pazartesi — Haftalık Overview

- [ ] GSC → Performance → Son 7 gün verilerini kontrol et.
- [ ] Clicks, Impressions, CTR, Position trendini önceki hafta ile karşılaştır.
- [ ] Anomalileri not al: CTR’de %20+ düşüş, Position’da 3+ sıra düşüş, Clicks’te %30+ düşüş.

### 8.2 Salı — Indexing Kontrolü

- [ ] GSC → Indexing → Pages.
- [ ] “Not indexed” sayısını kontrol et. Beklenmedik artış varsa:
  - “Crawl budget” sorunu mu? (sunucu yavaşlığı, 5xx hataları)
  - “Duplicate without user-selected canonical” mı? (canonical tag kontrolü)
  - “Soft 404” mü? (boş earnings sayfaları, hatalı ticker’lar)
- [ ] Yeni eklenen `/tr/:slug` ve `/earnings/:ticker` sayfaları için “Request Indexing” yap.

### 8.3 Çarşamba — Core Web Vitals ve Mobile Usability

- [ ] GSC → Experience → Core Web Vitals.
- [ ] “Poor” URL sayısı 0 mı? Değilse, öncelikli URL’leri PageSpeed Insights’te test et.
- [ ] GSC → Experience → Mobile Usability. Hata varsa sayfa başlıklarını ve element pozisyonlarını kontrol et.

### 8.4 Perşembe — Sitemap ve Backlink İzleme

- [ ] GSC → Sitemaps. Son submission’ın status’u “Success” mu?
- [ ] GSC → Links → External Links. Yeni backlink’ler var mı? Kaliteli link’leri not al (outreach için).
- [ ] GSC → Links → Internal Links. Yeni sayfalar internal link alıyor mu? Earnings sayfalarına homepage’dan link veriliyor mu?

### 8.5 Cuma — Query ve Content Optimizasyonu

- [ ] GSC → Performance → Queries. Son 28 gün verisini export et (CSV).
- [ ] CTR < 2% olan ama Impressions > 1,000 olan sorguları listele → Title + description optimizasyonu için içerik takvimine ekle.
- [ ] Position 11-20 arası olan sorguları listele → Backlink ve içerik derinleştirme için önceliklendir.
- [ ] Türkçe içerikler (`/tr/*`) için ayrı filter uygula ve Türkçe query performansını analiz et.

### 8.6 Aylık — Derinlemesine Audit

- [ ] **Search Console API** ile tüm veriyi BigQuery’ye export et ( Looker Studio dashboard için).
- [ ] **CrUX BigQuery** ile Core Web Vitals trendini aylık karşılaştır.
- [ ] **Programmatic SEO sayfalarını** audit et: Her earnings/strategy sayfasında unique content, title, description, schema var mı?
- [ ] **Backlink profilini** kontrol et (Ahrefs, Semrush). Spammy link’ler varsa disavow listesi hazırla.
- [ ] **Rakip analizi:** GSC’deki “Queries” listesi ile rakip sayfaların sıralamasını karşılaştır (Semrush/Ahrefs).

### 8.7 Özel Günler — Earnings Sezonu ve FOMC Haftaları

- [ ] Earnings sezonu öncesi (her çeyrek): Yeni ticker sayfalarını oluştur, sitemap’i güncelle, `Request Indexing` yap.
- [ ] FOMC/CPI haftalarında: Gistify’in “Macro Calendar” sayfalarının indekslenip indekslenmediğini kontrol et. Bu haftalar organik trafik için yüksek potansiyellidir.
- [ ] Yeni Türkçe içerik yayınlandığında: 24 saat içinde URL Inspection + Request Indexing yap.

---

## 🔧 GSC API ile Otomasyon (İleri Seviye)

Gistify’in GSC verilerini otomatik olarak çekmek ve dashboard’lara entegre etmek için **Google Search Console API** kullanılabilir.

### API Yetkilendirme

1. Google Cloud Console → API & Services → Credentials → Create API Key + OAuth 2.0 Client.
2. GSC API’yi etkinleştir (`https://www.googleapis.com/auth/webmasters.readonly`).
3. Service Account oluştur ve GSC property’ine “Full Owner” olarak ekle.

### Örnek: Günlük Query Verisi Çekme (Node.js)

```typescript
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./gsc-service-account.json",
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});

const webmasters = google.webmasters({ version: "v3", auth });

async function getGistifyQueries() {
  const res = await webmasters.searchanalytics.query({
    siteUrl: "sc-domain:gistify.pro", // Domain property
    requestBody: {
      startDate: "2025-01-01",
      endDate: "2025-01-15",
      dimensions: ["query", "page"],
      rowLimit: 100,
    },
  });

  return res.data.rows;
}
```

Bu veri Gistify’in internal analytics dashboard’ına entegre edilebilir (content performance tracking).

---

## 📋 GSC Setup Özet / Executive Summary

| Adım | Durum | Sorumlu | Tarih |
|------|-------|---------|-------|
| Domain Property oluştur (`gistify.pro`) | ⬜ | SEO/Dev | — |
| DNS TXT doğrulama | ⬜ | DevOps | — |
| Sitemap oluştur ve submit et | ⬜ | Dev | — |
| robots.txt’ye sitemap referansı ekle | ⬜ | Dev | — |
| URL Inspection ile öncelikli URL’leri indeksle | ⬜ | SEO | — |
| Performance raporunda query analizi başlat | ⬜ | SEO | — |
| Core Web Vitals iyileştirme (LCP, INP, CLS) | ⬜ | Dev | — |
| Mobile Usability hatası kontrolü | ⬜ | Dev | — |
| Haftalık monitoring kontrol listesi aktive et | ⬜ | SEO | — |
| GSC API ile otomasyon kur (opsiyonel) | ⬜ | Dev | — |

---

> **Son Not:** GSC, Gistify’in organik büyümesinin en kritik gözetleme aracıdır. Bu guide’ı haftalık olarak tekrar ziyaret edin, kontrol listelerini uygulayın ve metriklerdeki değişimleri not alın. SEO, bir kurulum değil; sürekli bir optimizasyon sürecidir.
