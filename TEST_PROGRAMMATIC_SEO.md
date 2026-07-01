# Gistify Programmatic SEO — Test Rehberi

## 1. Local Test (Deploy Öncesi)

### 1.1 Build
```bash
cd C:\Users\hasan\OneDrive\Desktop\gistify
corepack pnpm check
corepack pnpm build
```

### 1.2 Server'ı Başlat (Production Modu)
```bash
# Terminal 1 — Server
cd C:\Users\hasan\OneDrive\Desktop\gistify
cd server && node dist/index.js
# veya
npm run start:server

# Server başladıktan sonra (port 3000 veya .env'deki port)
```

### 1.3 HTTP Endpoint Testleri

```bash
# Terminal 2 — Test komutları (Git Bash veya PowerShell)

# === EARNINGS PREVIEW ===
curl -s http://localhost:3000/earnings/AAPL | head -20
curl -s http://localhost:3000/earnings/NVDA | head -20
curl -s http://localhost:3000/earnings/TSLA | head -20
curl -s http://localhost:3000/earnings/MSFT | head -20
curl -s http://localhost:3000/earnings/AMD | head -20

# 404 test (olmayan ticker)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/earnings/XYZ
# Beklenen: 404

# === STRATEGY GUIDES ===
curl -s http://localhost:3000/strategies/iron-condor | head -20
curl -s http://localhost:3000/strategies/0dte-straddle | head -20
curl -s http://localhost:3000/strategies/earnings-gap-fade | head -20
curl -s http://localhost:3000/strategies/vwap-bounce | head -20

# 404 test (olmayan strateji)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/strategies/abc
# Beklenen: 404

# === SCANNER RESULTS ===
curl -s http://localhost:3000/scanners/momentum | head -20
curl -s http://localhost:3000/scanners/high-iv | head -20
curl -s http://localhost:3000/scanners/pre-earnings | head -20

# 404 test (olmayan scanner)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/scanners/abc
# Beklenen: 404

# === REDIRECT TEST ===
curl -s -o /dev/null -w "%{http_code} %{redirect_url}" http://localhost:3000/screens/momentum
# Beklenen: 301 https://localhost:3000/scanners/momentum

# === SITEMAP ===
curl -s http://localhost:3000/sitemap.xml | grep -E "earnings|strategies|scanners" | head -30
# Beklenen: 26 yeni URL

# === HEADER TEST ===
curl -s -I http://localhost:3000/earnings/AAPL | grep -i "cache\|content-type"
# Beklenen: Content-Type: text/html; charset=utf-8
# Beklenen: Cache-Control: public, max-age=60

curl -s -I http://localhost:3000/strategies/iron-condor | grep -i "cache"
# Beklenen: Cache-Control: public, max-age=300

curl -s -I http://localhost:3000/scanners/momentum | grep -i "cache"
# Beklenen: Cache-Control: public, max-age=30
```

### 1.4 Browser'da Görsel Test

Tarayıcıda aç (Ctrl+Click veya kopyala-yapıştır):

```
http://localhost:3000/earnings/AAPL
http://localhost:3000/earnings/NVDA
http://localhost:3000/strategies/iron-condor
http://localhost:3000/strategies/0dte-straddle
http://localhost:3000/scanners/momentum
http://localhost:3000/scanners/high-iv
```

**Her sayfada kontrol et:**
- [ ] Title doğru mu? (örn: "AAPL Earnings Preview...")
- [ ] Dark tema çalışıyor mu? (#0f172a arka plan)
- [ ] İçerik dolu mu? (mock veri görünüyor mu?)
- [ ] Nav bar var mı? (Gistify + Back to Gistify)
- [ ] CTA butonu var mı? (gistify.pro'a link)
- [ ] Footer var mı?

### 1.5 SEO Meta Test (Browser DevTools)

```javascript
// Console'a yapıştır:

// Title
document.title

// Description
document.querySelector('meta[name="description"]')?.content

// Canonical
document.querySelector('link[rel="canonical"]')?.href

// OG Tags
['og:title', 'og:description', 'og:url', 'og:type'].map(prop => 
  document.querySelector(`meta[property="${prop}"]`)?.content
)

// Twitter Cards
['twitter:card', 'twitter:title', 'twitter:description'].map(prop => 
  document.querySelector(`meta[name="${prop}"]`)?.content
)

// JSON-LD Schema
JSON.parse(document.querySelector('script[type="application/ld+json"]')?.innerText)
```

**Beklenen sonuçlar:**
- Title: `{TICKER} Earnings Preview...` veya `{Strategy} Strategy Guide...`
- Description: Dolu, anlamlı metin
- Canonical: `https://gistify.pro/...` (veya localhost:3000/...)
- OG type: `article`
- Twitter card: `summary_large_image`
- JSON-LD: `@type: "Article"`, headline, author, publisher, datePublished

---

## 2. Production Test (Deploy Sonrası)

### 2.1 Hızlı Endpoint Test

```bash
# Earnings
curl -s https://gistify.pro/earnings/AAPL | head -5
curl -s https://gistify.pro/earnings/NVDA | head -5
curl -s https://gistify.pro/earnings/TSLA | head -5

# Strategy
curl -s https://gistify.pro/strategies/iron-condor | head -5
curl -s https://gistify.pro/strategies/0dte-straddle | head -5

# Scanner
curl -s https://gistify.pro/scanners/momentum | head -5
curl -s https://gistify.pro/scanners/high-iv | head -5

# Sitemap
curl -s https://gistify.pro/sitemap.xml | grep -c "earnings\|strategies\|scanners"
# Beklenen: 26+

# Status codes
curl -s -o /dev/null -w "%{http_code}\n" https://gistify.pro/earnings/AAPL
# Beklenen: 200

curl -s -o /dev/null -w "%{http_code}\n" https://gistify.pro/earnings/XYZ
# Beklenen: 404

curl -s -o /dev/null -w "%{http_code}\n" https://gistify.pro/screens/momentum
# Beklenen: 301
```

### 2.2 Google Search Console (Sonra Yap)

1. Google Search Console'a git: `https://search.google.com/search-console`
2. Domain: `gistify.pro`
3. Sitemap submit: `https://gistify.pro/sitemap.xml`
4. URL Inspection Tool ile test et:
   - `https://gistify.pro/earnings/AAPL`
   - `https://gistify.pro/strategies/iron-condor`
5. "Test Live URL" → Google'ın sayfayı render edebildiğini kontrol et
6. "Request Indexing" → Hızlı indexleme talebi

### 2.3 Third-Party SEO Test Araçları

```
# Site audit (ücretsiz)
https://pagespeed.web.dev/?url=https://gistify.pro/earnings/AAPL
https://pagespeed.web.dev/?url=https://gistify.pro/strategies/iron-condor

# Schema validation
https://validator.schema.org/#url=https://gistify.pro/earnings/AAPL

# Meta tag checker
https://www.opengraph.xyz/url/https%3A%2F%2Fgistify.pro%2Fearnings%2FAAPL

# Twitter Card validator
https://cards-dev.twitter.com/validator
# URL: https://gistify.pro/earnings/AAPL
```

### 2.4 Google Index Test (Birkaç Gün Sonra)

```
# Google'da arama yap:
site:gistify.pro/earnings/AAPL
site:gistify.pro/strategies/iron-condor
site:gistify.pro/scanners/momentum

# Eğer indexlenmişse sonuç çıkar
# Indexlenmemişse "site:gistify.pro/earnings/AAPL" için sonuç bulunamadı der
```

**Indexlenme süresi:** 1-7 gün (sitemap submit + Google Search Console hızlandırır)

---

## 3. Otomatik Test Script (Opsiyonel)

```bash
#!/bin/bash
# test-programmatic-seo.sh
# chmod +x test-programmatic-seo.sh && ./test-programmatic-seo.sh

BASE="http://localhost:3000"
# BASE="https://gistify.pro"  # production test için

echo "=== Testing Programmatic SEO Routes ==="

PASS=0
FAIL=0

test_endpoint() {
  URL="$1"
  EXPECTED="$2"
  ACTUAL=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
  if [ "$ACTUAL" = "$EXPECTED" ]; then
    echo "✅ $URL → $ACTUAL"
    PASS=$((PASS + 1))
  else
    echo "❌ $URL → $ACTUAL (expected $EXPECTED)"
    FAIL=$((FAIL + 1))
  fi
}

# Earnings (200)
test_endpoint "$BASE/earnings/AAPL" "200"
test_endpoint "$BASE/earnings/NVDA" "200"
test_endpoint "$BASE/earnings/TSLA" "200"
test_endpoint "$BASE/earnings/MSFT" "200"
test_endpoint "$BASE/earnings/AMD" "200"

# Earnings (404)
test_endpoint "$BASE/earnings/XYZ" "404"

# Strategy (200)
test_endpoint "$BASE/strategies/iron-condor" "200"
test_endpoint "$BASE/strategies/0dte-straddle" "200"
test_endpoint "$BASE/strategies/earnings-gap-fade" "200"

# Strategy (404)
test_endpoint "$BASE/strategies/abc" "404"

# Scanner (200)
test_endpoint "$BASE/scanners/momentum" "200"
test_endpoint "$BASE/scanners/high-iv" "200"
test_endpoint "$BASE/scanners/pre-earnings" "200"

# Scanner (404)
test_endpoint "$BASE/scanners/abc" "404"

# Redirect (301)
test_endpoint "$BASE/screens/momentum" "301"

# Sitemap
echo ""
echo "=== Sitemap Check ==="
SITEMAP_COUNT=$(curl -s "$BASE/sitemap.xml" | grep -c "earnings\|strategies\|scanners")
echo "Programmatic URLs in sitemap: $SITEMAP_COUNT"
if [ "$SITEMAP_COUNT" -ge 26 ]; then
  echo "✅ Sitemap has 26+ URLs"
  PASS=$((PASS + 1))
else
  echo "❌ Sitemap missing URLs (expected 26, found $SITEMAP_COUNT)"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "=== Results ==="
echo "✅ Pass: $PASS"
echo "❌ Fail: $FAIL"

if [ "$FAIL" -eq 0 ]; then
  echo "🎉 All tests passed!"
  exit 0
else
  echo "⚠️  Some tests failed."
  exit 1
fi
```

---

## 4. Hızlı Test (En Önemli 5 URL)

```bash
# Tek seferde tüm ana route'ları test et
curl -s -o /dev/null -w "AAPL: %{http_code}\n" https://gistify.pro/earnings/AAPL
curl -s -o /dev/null -w "Iron Condor: %{http_code}\n" https://gistify.pro/strategies/iron-condor
curl -s -o /dev/null -w "Momentum: %{http_code}\n" https://gistify.pro/scanners/momentum
curl -s -o /dev/null -w "Sitemap: %{http_code}\n" https://gistify.pro/sitemap.xml
curl -s -o /dev/null -w "404 Test: %{http_code}\n" https://gistify.pro/earnings/XYZ

# Hepsi 200/200/200/200/404 olmalı
```

---

## 5. Test Başarı Kriterleri

| Test | Başarı | Başarısız |
|------|--------|-----------|
| `/earnings/AAPL` | 200 + HTML + title + dark tema | 404, 500, boş sayfa |
| `/strategies/iron-condor` | 200 + setup steps + real example | 404, 500, eksik içerik |
| `/scanners/momentum` | 200 + tablo + 5 hisse | 404, 500, boş tablo |
| `/sitemap.xml` | 26+ yeni URL | Eksik URL |
| `/earnings/XYZ` | 404 | 200 veya 500 |
| `/screens/momentum` | 301 redirect | 404 veya 200 |
| Meta tags | OG, Twitter, JSON-LD var | Eksik meta |
| Cache header | max-age var | Eksik header |

---

## 6. Sorun Giderme

| Sorun | Muhtemel Sebep | Çözüm |
|-------|---------------|-------|
| 404 on all routes | `registerSeoRoutes(app)` mount edilmemiş | `server/index.ts`'te kontrol et |
| 500 error | Template import hatası | `server/templates/` path doğru mu? |
| Boş sayfa | Mock data null | Ticker/strateji/scanner adı doğru mu? |
| Sitemap eksik URL | `buildSitemapXml` güncellenmemiş | `server/index.ts` sitemap builder kontrol et |
| CSS dark tema yok | Inline CSS eksik | Template'lerde CSS var mı? |
| Meta tags eksik | OG/Twitter tag'leri template'de mi? | Template source'u kontrol et |

---

**Test sonuçlarını bana gönder — başarısız olan varsa düzeltelim.** 🚀
