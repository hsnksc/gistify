# Gistify.pro — Senin Yapman Gerekenler (Kalanlar Raporu)

> Agent ordusu **15 dosya üretti** (metin, kod, email, schema, HTML, tweet, vs.). Bunların hepsi `C:\Users\hasan\OneDrive\Desktop\gistify\` altında. **Bu rapor, sadece SENİN yapman gerekenleri gösteriyor.**

---

## 1. Agent Ne Yaptı? (15 Üretim Dosyası)

| Klasör | Dosya | Ne İçeriyor |
|--------|-------|-------------|
| `content/` | `pillar-01-complete-guide-earnings.md` | 4,045 kelime — Earnings opsiyon rehberi |
| `content/` | `pillar-02-iv-crush-explained.md` | 3,517 kelime — IV Crush derinlemesine analiz |
| `content/` | `comparison-best-options-scanners.md` | 4,021 kelime — 7 tool karşılaştırması |
| `content/` | `tool-iv-rank-calculator.md` | ~1,365 kelime + dark HTML calculator |
| `content/` | `tool-earnings-calendar.md` | ~1,397 kelime + dark HTML tablo |
| `seo/` | `json-ld-schema.md` | SoftwareApplication, Organization, WebSite, FAQPage, BreadcrumbList schema |
| `seo/` | `react-helmet-meta.md` | Reusable `<SEO />` component + 5 route örneği |
| `seo/` | `robots.txt` | Güncellenmiş robots.txt (Sitemap directive eklendi) |
| `seo/` | `sitemap-template.md` | XML şablon + Node.js/Express + Next.js dinamik route |
| `seo/` | `prerender-config.md` | Prerender.io, Cloudflare Worker, Rendertron kurulum kılavuzu |
| `social/` | `twitter-tweet-templates.md` | 20 hazır tweet şablonu (6 kategori) |
| `social/` | `reddit-post-templates.md` | 5 subreddit için hazır post şablonu |
| `social/` | `newsletter-sunday-prep-01.md` | Sunday Prep #1 (tamamı yazıldı, göndermeye hazır) |
| `social/` | `influencer-outreach-emails.md` | 3 tier influencer email + follow-up şablonları |
| `social/` | `product-hunt-launch-kit.md` | Tagline, description, maker comment, 20 Q&A, saat-saat plan |

---

## 2. Durum Güncellemesi (Faz 1 Tamamlandı)

> **Faz 1 Teknik SEO Temelleri — 2026-07-02 itibarıyla tamamlandı.** Aşağıdaki tüm maddeler senin tarafından yapıldı ve production'da çalışıyor.

### ✅ Faz 1 Tamamlananlar

| # | Görev | Durum | Not |
|---|-------|-------|-----|
| 1.1 | H1 tag | ✅ **TAMAMLANDI** | `renderStaticMarketingPage` → "Gistify — Earnings Intelligence & Momentum Workspace for Options Traders" |
| 1.2 | sitemap.xml | ✅ **TAMAMLANDI** | Dinamik route (`/sitemap.xml`), statik + flow URL'leri, `application/xml` |
| 1.3 | robots.txt | ✅ **TAMAMLANDI** | `public/robots.txt` — Allow, Disallow, Sitemap directive |
| 1.4 | Canonical tag | ✅ **TAMAMLANDI** | `renderStaticMarketingPage` + `usePageMeta` + her marketing sayfası |
| 1.5 | Prerender.io | ✅ **TAMAMLANDI** | `prerender-node` middleware + `PRERENDER_TOKEN` env + `dotenv` |
| 1.6 | JSON-LD Schema | ✅ **TAMAMLANDI** | WebSite (SearchAction), Organization, SoftwareApplication (Offer 250 TRY), WebPage |
| 1.7 | Open Graph + Twitter Cards | ✅ **TAMAMLANDI** | `index.html` absolute URL + `renderStaticMarketingPage` + `usePageMeta` |
| 1.8 | Dynamic meta tags | ✅ **TAMAMLANDI** | `usePageMeta` hook — canonical, noindex, og:url, og:image, twitter:image + tüm route'lara uygulandı |
| 1.9 | Core Web Vitals | ✅ **TAMAMLANDI** | `vite.config.ts` manus runtime kaldırıldı, `PublicShell` logo width/height + decoding="async" |
| 1.10 | Newsletter API | ✅ **TAMAMLANDI** | `/api/newsletter/subscribe` POST endpoint + SQLite `newsletter_subscribers` tablosu |
| 1.11 | /app noindex | ✅ **TAMAMLANDI** | Server-side `noindex, follow` meta inject edildi |
| 1.12 | Build smoke test | ✅ **TAMAMLANDI** | `corepack pnpm build` ✅, production sunucu testi ✅ |

### 🟡 Faz 1'de Hala Eksik (Küçük Ama Önemli)

| # | Görev | Durum | Efor | Neden Önemli? |
|---|-------|-------|------|---------------|
| 1.13 | **Email capture formu UI** | ⏳ **BEKLEMEDE** | 30 dk | API var (`/api/newsletter/subscribe`) ama kullanıcı formu yok. Landing hero'ya "Free Earnings Playbook — get Sunday Prep" email input + button ekle. |

---

## 3. Sıradaki Adımlar — Faz 2 + Faz 3 (Paralel Başla)

### Önerilen Sıra

| Sıra | Faz | Görev | Efor | Öncelik |
|------|-----|-------|------|---------|
| 1 | Faz 2 | **Blog altyapısı** — statik HTML sayfaları `public/blog/` altına | 2-4 saat | 🔴 Kritik — içerikleri nereye koyacaksın? |
| 2 | Faz 2 | **Free Tool sayfaları** — `public/tools/` altına statik HTML | 1-2 saat | 🔴 Kritik — lead magnet + SEO |
| 3 | Faz 2 | **Pillar içerikleri publish** — 3 post blog'a | 1 saat | 🔴 Kritik — organik trafik motoru |
| 4 | Faz 1 | **Email capture formu UI** — hero'ya input + button ekle | 30 dk | 🟡 Önemli — lead capture |
| 5 | Faz 3 | **Twitter/X hesabı aç** + ilk 5 tweet at | 30 dk | 🟡 Önemli — görünürlük başlasın |
| 6 | Faz 3 | **Discord server kur** | 30 dk | 🟡 Önemli — topluluk temeli |
| 7 | Faz 3 | **Newsletter #1 gönder** (ConvertKit/Beehiiv) | 1 saat | 🟡 Önemli — retention başlasın |
| 8 | Faz 3 | **Reddit hesapları aç** + karma biriktir | 30 dk | 🟢 Orta — haftalık ritim için hazırlık |
| 9 | Faz 3 | **LinkedIn + YouTube** aç | 30 dk | 🟢 Orta — brand presence |
| 10 | Faz 3 | **Product Hunt "Coming Soon"** sayfası oluştur | 20 dk | 🟢 Orta — launch hazırlığı |

---

## 4. Acil Eylem Listesi — Sıradaki 7 Gün

### Gün 1 (Bugün)
| # | Görev | Dosya | Eylem | Tahmini Süre |
|---|-------|-------|-------|-------------|
| 1 | Email capture formu UI ekle | — | Landing hero'ya email input + submit button ekle. Submit → `/api/newsletter/subscribe` POST. | 30 dk |
| 2 | Twitter/X hesabı aç | — | @gistify veya @gistifypro aç, bio yaz | 15 dk |
| 3 | Blog altyapısı karar ver | — | Statik HTML (`public/blog/`) vs. CMS vs. Next.js SSG — karar ver | 15 dk |

### Gün 2
| # | Görev | Dosya | Eylem | Tahmini Süre |
|---|-------|-------|-------|-------------|
| 4 | Pillar Post 1 statik HTML'e dönüştür | `content/pillar-01-complete-guide-earnings.md` | Markdown'ı tam HTML sayfasına çevir (title, meta, canonical, OG, schema dahil) | 1 saat |
| 5 | Pillar Post 2 statik HTML'e dönüştür | `content/pillar-02-iv-crush-explained.md` | Yukarıdaki gibi | 1 saat |
| 6 | İlk 5 tweet at | `social/twitter-tweet-templates.md` | 1. Pre-market scan, 2. Earnings preview, 3. Educational, 4. Meme, 5. Feature | 20 dk |

### Gün 3
| # | Görev | Dosya | Eylem | Tahmini Süre |
|---|-------|-------|-------|-------------|
| 7 | Comparison post statik HTML'e dönüştür | `content/comparison-best-options-scanners.md` | Yukarıdaki gibi | 1 saat |
| 8 | IV Rank Calculator statik HTML'e dönüştür | `content/tool-iv-rank-calculator.md` | Dark HTML + calculator form'u | 1 saat |
| 9 | Discord server kur | — | Kanalları yapılandır (Gün 1 plan'ındaki gibi) | 30 dk |

### Gün 4
| # | Görev | Dosya | Eylem | Tahmini Süre |
|---|-------|-------|-------|-------------|
| 10 | Earnings Calendar statik HTML'e dönüştür | `content/tool-earnings-calendar.md` | Dark HTML + tablo | 1 saat |
| 11 | Blog sayfalarını `public/blog/` altına koy | — | 3 post + 2 tool = 5 HTML dosyası | 30 dk |
| 12 | LinkedIn şirket sayfası aç | — | Company Page oluştur | 15 dk |

### Gün 5
| # | Görev | Dosya | Eylem | Tahmini Süre |
|---|-------|-------|-------|-------------|
| 13 | ConvertKit / Beehiiv hesabı aç | — | Ücretsiz hesap, form embed kodunu al | 20 dk |
| 14 | Newsletter #1 gönder | `social/newsletter-sunday-prep-01.md` | Agent'ın yazdığı içeriği ConvertKit'e yükle, test et, gönder | 30 dk |
| 15 | Canva'da "Weekly Momentum Scan" şablonu tasarla | — | 1080x1080px, dark bg, neon accent | 30 dk |

### Gün 6
| # | Görev | Dosya | Eylem | Tahmini Süre |
|---|-------|-------|-------|-------------|
| 16 | Reddit hesapları aç | — | r/options, r/algotrading, r/thetagang, r/Daytrading | 15 dk |
| 17 | İlk Reddit comment'lerini at | — | Karma biriktir (yorum yaz, value-first) | 30 dk |
| 18 | YouTube kanalı aç + banner | — | Kanal aç, about yaz | 20 dk |

### Gün 7
| # | Görev | Dosya | Eylem | Tahmini Süre |
|---|-------|-------|-------|-------------|
| 19 | Deploy et + test et | — | Tüm statik sayfaları build'le, production'da test et | 30 dk |
| 20 | HARO'ya kaydol | — | haro@helpareporter.com | 10 dk |
| 21 | Product Hunt "Coming Soon" sayfası oluştur | `social/product-hunt-launch-kit.md` | Agent'ın metinlerini PH'ye kopyala | 20 dk |
| 22 | İlk hafta özeti tweet'i at | — | "Week 1 done: blog live, tools live, newsletter sent. What's next?" | 5 dk |

**Toplam İlk Hafta (Yeni):** ~10-12 saat (günde 1.5-2 saat)

---

## 5. Kalanlar — Detaylı Görev Listesi (Güncellenmiş)

### 🟡 Faz 1: Teknik SEO (Neredeyse Tamam, 1 Eksik)

| # | Görev | Durum | Efor | Not |
|---|-------|-------|------|-----|
| 1.1 | H1 tag | ✅ **TAMAMLANDI** | — | `renderStaticMarketingPage` |
| 1.2 | sitemap.xml | ✅ **TAMAMLANDI** | — | Dinamik route |
| 1.3 | robots.txt | ✅ **TAMAMLANDI** | — | `public/robots.txt` |
| 1.4 | Canonical tag | ✅ **TAMAMLANDI** | — | `renderStaticMarketingPage` + `usePageMeta` |
| 1.5 | Prerender.io | ✅ **TAMAMLANDI** | — | `prerender-node` + token |
| 1.6 | JSON-LD Schema | ✅ **TAMAMLANDI** | — | 5 schema tipi |
| 1.7 | Open Graph + Twitter Cards | ✅ **TAMAMLANDI** | — | `index.html` + `renderStaticMarketingPage` |
| 1.8 | Dynamic meta tags | ✅ **TAMAMLANDI** | — | `usePageMeta` + tüm route'lar |
| 1.9 | Core Web Vitals | ✅ **TAMAMLANDI** | — | Build optimizasyon + image |
| 1.10 | Newsletter API | ✅ **TAMAMLANDI** | — | `/api/newsletter/subscribe` + SQLite |
| 1.11 | /app noindex | ✅ **TAMAMLANDI** | — | Server-side inject |
| 1.12 | Build + smoke test | ✅ **TAMAMLANDI** | — | `pnpm build` + prod test |
| 1.13 | **Email capture formu UI** | ⏳ **BEKLEMEDE** | 30 dk | API var ama form yok. Landing hero'ya input + button ekle. |

### 🔴 Faz 2: İçerik (Şimdi Başla — En Kritik)

| # | Görev | Durum | Efor | Not |
|---|-------|-------|------|-----|
| 2.1 | **Blog altyapısı** | ⏳ **BEKLEMEDE** | 2-4 saat | **ÖNERİ:** Statik HTML `public/blog/` altına. Vite bunları servis eder. Her sayfa kendi title, meta, canonical, OG, schema içerir. SPA routing ile çakışmaz. |
| 2.2 | Pillar Post 1 publish | ⏳ **BEKLEMEDE** | 1 saat | `content/pillar-01-complete-guide-earnings.md` → HTML → `public/blog/` |
| 2.3 | Pillar Post 2 publish | ⏳ **BEKLEMEDE** | 1 saat | `content/pillar-02-iv-crush-explained.md` → HTML → `public/blog/` |
| 2.4 | Pillar Post 3 yaz | ⏳ **BEKLEMEDE** | 2-4 saat | Agent'a yazdır veya kendin yaz |
| 2.5 | Pillar Post 4 yaz | ⏳ **BEKLEMEDE** | 2-4 saat | Agent'a yazdır veya kendin yaz |
| 2.6 | Pillar Post 5 yaz | ⏳ **BEKLEMEDE** | 2-4 saat | Agent'a yazdır veya kendin yaz |
| 2.7 | Comparison publish | ⏳ **BEKLEMEDE** | 1 saat | `content/comparison-best-options-scanners.md` → HTML → `public/blog/` |
| 2.8 | IV Rank Calculator deploy | ⏳ **BEKLEMEDE** | 1 saat | `content/tool-iv-rank-calculator.md` → HTML → `public/tools/` |
| 2.9 | Earnings Calendar deploy | ⏳ **BEKLEMEDE** | 1 saat | `content/tool-earnings-calendar.md` → HTML → `public/tools/` |
| 2.10 | Options Profit Calculator | ⏳ **BEKLEMEDE** | 4-8 saat | Geliştirme gerek. Sonra planla. |
| 2.11 | Expected Move Calculator | ⏳ **BEKLEMEDE** | 4-8 saat | Geliştirme gerek. Sonra planla. |
| 2.12 | Momentum Heatmap | ⏳ **BEKLEMEDE** | 4-8 saat | Geliştirme gerek. Sonra planla. |
| 2.13 | Earnings Preview Pages (/earnings/{ticker}) | ⏳ **BEKLEMEDE** | 8-16 saat | Programmatik. Sonra planla. |
| 2.14 | Strategy Guide Pages (/strategies/{slug}) | ⏳ **BEKLEMEDE** | 4-8 saat | Programmatik. Sonra planla. |
| 2.15 | Scanner Results Pages (/scanners/{type}) | ⏳ **BEKLEMEDE** | 8-16 saat | Programmatik. Sonra planla. |
| 2.16 | Sunday Earnings Playbook (haftalık) | ⏳ **BEKLEMEDE** | 1-2 saat/hafta | `social/newsletter-sunday-prep-01.md` şablonu var |
| 2.17 | Momentum Monday (haftalık) | ⏳ **BEKLEMEDE** | 1-2 saat/hafta | Sonra planla |
| 2.18 | Mid-Week IV Crush Report (haftalık) | ⏳ **BEKLEMEDE** | 1-2 saat/hafta | Sonra planla |
| 2.19 | Friday Week Recap (haftalık) | ⏳ **BEKLEMEDE** | 1-2 saat/hafta | Sonra planla |

### 🟡 Faz 3: Sosyal + Growth (Paralel Başla)

| # | Görev | Durum | Efor | Not |
|---|-------|-------|------|-----|
| 3.1 | Twitter/X hesap aç | ⏳ **BEKLEMEDE** | 15 dk | Bugün aç |
| 3.2 | Tweet şablonlarını kullan | ✅ **HAZIR** | 20 dk | `social/twitter-tweet-templates.md` — 20 hazır tweet |
| 3.3 | Reddit hesapları aç | ⏳ **BEKLEMEDE** | 15 dk | Gün 6'da aç |
| 3.4 | Reddit post şablonları | ✅ **HAZIR** | 30 dk/hafta | `social/reddit-post-templates.md` — 5 hazır post |
| 3.5 | LinkedIn şirket sayfası aç | ⏳ **BEKLEMEDE** | 15 dk | Gün 4'te aç |
| 3.6 | YouTube kanalı aç | ⏳ **BEKLEMEDE** | 30 dk | Gün 6'da aç |
| 3.7 | Discord server kur | ⏳ **BEKLEMEDE** | 30 dk | Gün 3'te kur |
| 3.8 | ConvertKit / Beehiiv kur | ⏳ **BEKLEMEDE** | 30 dk | Gün 5'te aç |
| 3.9 | Newsletter #1 gönder | ✅ **HAZIR** | 30 dk | `social/newsletter-sunday-prep-01.md` — tamamı yazıldı |
| 3.10 | Influencer outreach email'leri | ✅ **HAZIR** | 2-3 saat | `social/influencer-outreach-emails.md` — 3 tier |
| 3.11 | Product Hunt sayfası oluştur | ✅ **HAZIR** | 30 dk | `social/product-hunt-launch-kit.md` — tüm metinler hazır |
| 3.12 | Product Hunt launch günü | ⏳ **BEKLEMEDE** | 1 gün | Coming Soon'dan sonra planla |
| 3.13 | Referral program | ⏳ **BEKLEMEDE** | 4-8 saat | Sonra planla |
| 3.14 | UGC teşvik programı | ⏳ **BEKLEMEDE** | 2-4 saat | Sonra planla |

### 🟢 Faz 4: Ölçek (Ay 4-6)

| # | Görev | Durum | Efor | Not |
|---|-------|-------|------|-----|
| 4.1 | Earnings sayfaları ölçeklendirme (200+) | ⏳ **BEKLEMEDE** | 8-16 saat | Data pipeline + DevOps. Sonra planla. |
| 4.2 | Türkçe İçerik Hub'ı (10 makale) | ⏳ **BEKLEMEDE** | 4-8 saat | Agent'a yazdır. Sonra planla. |
| 4.3 | API/Developer portal | ⏳ **BEKLEMEDE** | 16-32 saat | Sonra planla. |
| 4.4 | Affiliate program (30% recurring) | ⏳ **BEKLEMEDE** | 4-8 saat | Sonra planla. |

---

## 6. Blog Altyapısı — Önerilen Yaklaşım

Mevcut yapın **Vite + React SPA**. En hızlı ve SEO-dostu yaklaşım:

```
public/
├── blog/
│   ├── complete-guide-trading-earnings-options.html
│   ├── iv-crush-explained.html
│   └── best-options-scanners-compared-2025.html
├── tools/
│   ├── iv-rank-calculator.html
│   └── earnings-calendar.html
└── ...
```

**Neden bu yaklaşım?**
- Vite `public/` dizinindeki dosyaları statik servis eder
- Her `.html` dosyası kendi `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph, Twitter Cards, JSON-LD schema içerir
- Google bunları doğrudan indexler (Prerender.io'ya bile gerek kalmaz bu sayfalar için)
- SPA routing ile çakışmaz (çünkü `public/` statik dosyalar SPA'dan önce servis edilir)
- Kolay deploy: HTML dosyalarını `public/` altına koy, `pnpm build`, deploy

**Her HTML sayfasında olması gereken:**
1. `<title>` — unique, keyword-rich
2. `<meta name="description">` — 150-160 karakter
3. `<link rel="canonical" href="https://gistify.pro/blog/...">`
4. Open Graph tags (og:title, og:description, og:url, og:image, og:type)
5. Twitter Card tags
6. JSON-LD BlogPosting schema
7. H1, H2, H3 yapısı
8. Dark theme CSS (Gistify'a uygun)
9. CTA link (back to gistify.pro)

**Ben (Agent) bunu yapabilirim:** Her markdown dosyasını tam bir statik HTML sayfasına dönüştürebilirim. Sen sadece `public/blog/` ve `public/tools/` altına kopyalayıp deploy etmelisin.

---

## 7. Aylık İş Yükü Takvimi (Güncellenmiş)

| Ay | Haftalık Saat | Aylık Toplam | Odak |
|----|---------------|-------------|------|
| **Ay 1 (Şimdi)** | 4-6 saat | 16-24 saat | Blog + tools deploy + Sosyal setup + Newsletter #1 + Email capture |
| **Ay 2** | 3-5 saat | 12-20 saat | PH launch + Influencer outreach + Weekly content ritmi |
| **Ay 3** | 2-4 saat | 8-16 saat | Community growth + Retention + Content ölçeklendirme |
| **Ay 4-6** | 2-4 saat | 8-16 saat | Ölçek + Türkçe hub + API portal |

> **Faz 1'i hızlı bitirdin — tebrikler.** Ay 1 iş yükü düştü çünkü temel zaten atıldı.

---

## 8. Özet: Bugün Yapman Gereken 3 Şey

1. **Email capture formu UI ekle** → Landing hero'ya email input + submit button. Submit → `/api/newsletter/subscribe`. → 30 dk
2. **Twitter/X hesabı aç** → @gistify veya @gistifypro. Bio: "Dark finance workspace for options traders. Earnings intelligence + momentum scanning." → 15 dk
3. **Blog altyapısı kararı ver** → Statik HTML (`public/blog/`) mı? CMS mi? Ben sana statik HTML'leri hazırlayabilirim. → 15 dk

**Toplam: 1 saat. Bugün başla.**

---

*Hazırlayan:* Orchestrator Agent  
*Tarih:* 2026-07-02  
*Güncelleme:* Faz 1 tamamlandı, Faz 2'ye geçiliyor.

