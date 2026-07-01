# Google Search Console — Sitemap Submit & Index Rehberi

> Gistify.pro'nun tüm yeni URL'lerini Google'a hızla indexlettirmek için adım adım rehber.

---

## Adım 0: GSC'ye Giriş (Eğer İlk Kez Yapıyorsan)

1. `https://search.google.com/search-console` aç
2. Gistify Gmail hesabınla login ol
3. Property seç: `gistify.pro` (Domain property tercih edilir — `https://gistify.pro` değil, `gistify.pro`)

> **Not:** Eğer daha önce verify etmediysen, DNS verification yapman gerekir. Cloudflare'da TXT record ekleme gerekebilir. Bu durumda benimle paylaş — kodu vereyim.

---

## Adım 1: Sitemap Submit

1. Sol menüden **"Sitemaps"** tıkla
2. "Add a new sitemap" bölümüne şu URL'i yapıştır:
   ```
   https://gistify.pro/sitemap.xml
   ```
3. **Submit** butonuna tıkla
4. Beklenen sonuç: `Success` ve `Last read: [tarih]`

**Eğer hata alırsan:**
- `Couldn't fetch` → Sitemap URL'i yanlış olabilir veya server erişilemez. `curl https://gistify.pro/sitemap.xml` ile test et.
- `Sitemap is HTML` → XML formatı bozuk. `Content-Type: application/xml` kontrol et.

---

## Adım 2: URL Inspection Tool ile Hızlı Indexleme

Tek tek URL'leri Google'a "indexle bunları" demek için:

1. Sol üstteki **arama çubuğuna** (büyüteç simgesi) yapıştır:
   ```
   https://gistify.pro/earnings/AAPL
   ```
2. **Enter** bas
3. Sayfa açıldığında sağ üstte **"Request indexing"** butonuna tıkla
4. "Google is testing if your live URL can be indexed" → beklet
5. "URL is not on Google" → **"Request indexing"** yeşil butonuna tekrar tıkla
6. "Indexing requested" mesajını görünce → **Done**

### Tek Seferde Kaç URL Indexleme İstenecek?

**Her gün maksimum 10-12 URL** iste. Google limit koyar.

**Günlük sıralama (öncelikli):**

| Gün | URL | Neden |
|-----|-----|-------|
| Gün 1 | `/earnings/AAPL` | En yüksek hacimli |
| Gün 1 | `/earnings/NVDA` | En yüksek hacimli |
| Gün 1 | `/earnings/TSLA` | Viral potansiyel |
| Gün 1 | `/strategies/iron-condor` | En popüler strateji |
| Gün 1 | `/strategies/0dte-straddle` | Trend konu |
| Gün 2 | `/earnings/MSFT` | Yüksek hacim |
| Gün 2 | `/earnings/AMD` | Tech trader favorisi |
| Gün 2 | `/scanners/momentum` | Tool page = lead gen |
| Gün 2 | `/scanners/high-iv` | Premium seller hedefi |
| Gün 2 | `/blog/earnings-strategy/complete-guide-trading-earnings-options` | Pillar content |
| Gün 3-5 | Diğer 20 URL | Günde 5-6 URL |

> **Taktik:** Günde 10 URL, 5 günde 50 URL. Geriye kalanlar sitemap submit ile organik indexlenir (1-2 hafta).

---

## Adım 3: Performance Raporu ile Anahtar Kelime Takibi

1. Sol menüden **"Performance"** tıkla
2. **"Search results"** sekmesi
3. Filtrele: **"Pages"** → URL'lerini göreceksin
4. Takip etmen gereken metrikler:

| Metrik | İyi | Kötü | Aksiyon |
|--------|-----|------|---------|
| **Clicks** | Artıyor | Sıfır | Content quality kontrolü |
| **Impressions** | Artıyor | Sıfır | Index kontrolü (URL inspection) |
| **CTR** | > 2% | < 1% | Title/description iyileştirme |
| **Position** | < 15 | > 30 | Backlink + internal link ekleyerek yükselt |

**Target keyword başına hedef:**
- Month 1: 100 impressions, 2 clicks, position 20-30
- Month 2: 500 impressions, 20 clicks, position 15-20
- Month 3: 2,000 impressions, 100 clicks, position 10-15
- Month 6: 10,000 impressions, 500 clicks, position 5-10

---

## Adım 4: Index Durum Kontrolü

### 4.1 Hızlı Kontrol (Tarayıcı)

Google'da arat:
```
site:gistify.pro/earnings/AAPL
site:gistify.pro/strategies/iron-condor
site:gistify.pro/scanners/momentum
```

- **Sonuç çıkıyorsa** → Indexlenmiş ✅
- **"Hiçbir sonuç bulunamadı"** → Henüz indexlenmemiş, bekle veya tekrar request et

### 4.2 Coverage Raporu

1. Sol menü: **"Pages"** (altında "Indexing")
2. **"Valid"** — indexlenmiş sayfa sayısı
3. **"Not indexed"** — neden indexlenmediğini gör (Duplicate, Noindex, Crawl anomaly, vs.)
4. **"Excluded"** — bilerek çıkarılanlar (noindex sayfalar)

**Hedef:** Valid pages sayısı 2 hafta içinde 30+ olmalı.

---

## Adım 5: Sorun Giderme (GSC Hataları)

| Hata | Sebep | Çözüm |
|------|-------|-------|
| **Duplicate without user-selected canonical** | `/` ve `/app` duplicate | `canonical` tag ekle (zaten yapıldı) |
| **Page with redirect** | `/screens/momentum` 301 → `/scanners/momentum` | Normal, kabul edilebilir |
| **Submitted URL not found (404)** | `/earnings/XYZ` gibi | Mock data'da olmayan ticker'lar. Beklenen. |
| **Submitted URL has crawl issue** | Server timeout veya 500 | Production sunucu kontrolü |
| **Crawl anomaly** | Googlebot erişemiyor | robots.txt kontrolü, Cloudflare ayarları |
| **Duplicate, Google chose different canonical** | Google kendi canonical'ini seçmiş | `<link rel="canonical">` güçlendir |

---

## Adım 6: Hızlı Kazanım Aksiyonları (GSC Submit Sonrası)

### 6.1 Internal Linking (Önemli!)

Mevcut sayfalarından yeni sayfalara link ver:

- Landing page'a link ekle:
  ```html
  <a href="/blog/earnings-strategy/complete-guide-trading-earnings-options">Earnings Guide</a>
  <a href="/tools/iv-rank-calculator">IV Rank Calculator</a>
  ```
- Blog sayfaları arasında cross-link:
  - Pillar-01 (earnings guide) → Pillar-02 (IV crush) → Pillar-03 (momentum) → Pillar-04 (risk) → Pillar-05 (0DTE)
- Scanner sayfalarından blog'a link:
  - `/scanners/momentum` → `/blog/momentum-trading/...`

**Neden:** Google internal link'leri takip eder. Link alan sayfa daha hızlı indexlenir ve daha yüksek rank alır.

### 6.2 Backlink İçin Hızlı Kazanımlar

| Hedef | Aksiyon | Süre | Etki |
|-------|---------|------|------|
| Reddit r/options | Haftalık "Sunday Earnings Preview" post | 30 dk/hafta | Doğal backlink + trafik |
| Indie Hackers | "How I built a trading scanner" Show IH | 1 saat | Nofollow ama trafik + brand |
| Hacker News | "Show HN: Gistify" post | 30 dk | Nofollow, ama trafik patlaması |
| TradingView profil | Bio'ya gistify.pro link | 5 dk | Doğal backlink |
| Twitter/X bio | Link + günlük tweet | 10 dk/gün | Sosyal sinyal |
| LinkedIn profil | Bio'ya link + haftalık post | 15 dk/hafta | Sosyal sinyal |
| Medium | "IV Crush Explained" repost | 30 dk | Doğal backlink (nofollow) |

### 6.3 Content Freshness (Google Sever!)

Her hafta mevcut sayfalara güncelleme yap:

- `/earnings/AAPL` → earnings date'i güncelle (gerçek tarih yaklaştıkça)
- `/scanners/momentum` → scanner tablosunu güncelle (her gün)
- `/blog/...` → "Last updated: [tarih]" ekle (haftalık)
- Yeni blog post ekle (haftada 1-2)

> **Google taze içeriği sever.** Sayfa güncellendikçe tekrar indexler ve sıralama artar.

---

## Adım 7: 90 Günlük GSC Takvim

| Hafta | GSC Aksiyon | Hedef |
|---------|-------------|-------|
| 1 | Sitemap submit + 10 URL index request | Google Gistify'yi keşfetsin |
| 2 | 10 URL daha index request | 20+ sayfa indexlensin |
| 3 | Performance raporu inceleme, CTR düşük olan title'ları düzenle | Impressions 500+ |
| 4 | Coverage raporu kontrolü, hata varsa düzelt | Valid pages 30+ |
| 5-8 | Haftalık 5-10 URL index request + content freshness | Valid pages 50+ |
| 9-12 | Performance optimizasyonu, düşük position'lı sayfaları yükselt | Position < 20 için 20+ sayfa |

---

## Özet: Bugün Yapılacaklar (30 Dakika)

| # | Aksiyon | Süre | Araç |
|---|---------|------|------|
| 1 | GSC'ye git → Sitemaps → Submit `https://gistify.pro/sitemap.xml` | 2 dk | Browser |
| 2 | URL Inspection → `/earnings/AAPL` → Request indexing | 3 dk | Browser |
| 3 | URL Inspection → `/earnings/NVDA` → Request indexing | 3 dk | Browser |
| 4 | URL Inspection → `/earnings/TSLA` → Request indexing | 3 dk | Browser |
| 5 | URL Inspection → `/strategies/iron-condor` → Request indexing | 3 dk | Browser |
| 6 | URL Inspection → `/strategies/0dte-straddle` → Request indexing | 3 dk | Browser |
| 7 | URL Inspection → `/scanners/momentum` → Request indexing | 3 dk | Browser |
| 8 | URL Inspection → `/scanners/high-iv` → Request indexing | 3 dk | Browser |
| 9 | URL Inspection → `/blog/earnings-strategy/...` → Request indexing | 3 dk | Browser |
| 10 | Performance → "Search results" → son 7 gün kontrolü | 5 dk | Browser |

**Toplam: 30 dakika. Bugün yap.**

---

*Hazırlayan: Orchestrator Agent  
Tarih: 2026-07-02  
Amaç: Gistify.pro Google Search Console submit & index rehberi*
