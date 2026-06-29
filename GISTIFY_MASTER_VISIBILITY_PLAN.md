# Gistify.pro Master Visibility & Growth Plan

## Agent Ordusu Raporu | 3 Sub-Agent Sentezi

| Agent | Görev | Çıktı |
|-------|-------|-------|
| Competitor_Keyword_Analyst | Rakip analizi + keyword araştırması | ~24KB rapor |
| TechnicalSEO_Content_Strategist | Teknik SEO + içerik stratejisi | ~45KB rapor |
| Social_Community_Growth_Strategist | Sosyal medya + topluluk + growth hacking | ~41KB rapor |

---

## 1. Durum Tespiti (Mevcut Durum)

### 🔴 Kritik Sorunlar (Şimdi Çözülmeli)

| Sorun | Etki | Öncelik |
|-------|------|---------|
| Google'da **sadece 1 sayfa** indexli (`site:gistify.pro`) | Hiçbir içerik/alt sayfa aranmıyor | 🔴 Kritik |
| **H1 tag yok** | Google ana konuyu algılayamıyor | 🔴 Kritik |
| `sitemap.xml` **HTML dönüyor**, XML değil | Google tüm sayfaları keşfedemiyor | 🔴 Kritik |
| **Canonical tag** yok | `/` ve `/app` duplicate content riski | 🔴 Kritik |
| **Schema.org JSON-LD** hiç yok | Rich results, Knowledge Panel yok | 🔴 Kritik |
| **Open Graph / Twitter Cards** yok | Sosyal paylaşım bozuk görünüyor | 🟡 Orta |
| Blog, içerik hub, free tools **hiç yok** | Organik trafik için sıfır altyapı | 🔴 Kritik |
| SPA (Single Page Application) mimarisi | Googlebot JavaScript'i tam render edemiyor | 🔴 Kritik |

### Rakip Konumlandırma

| Rakip | Aylık Trafik | Organik Pay | Güçlü Yön | Zayıflık |
|-------|-------------|-------------|-----------|----------|
| **TradingView** | 215M+ | ~9% | Topluluk, Pine Script, UGC | Earnings spesifik değil |
| **Finviz** | 16.6M | ~13% | Screener hızı, heatmap | Blog/content yok, UI eski |
| **Barchart** | 6.38M | ~12% | News + data breadth | Options derinliği zayıf |
| **OptionStrat** | ~925K | ~8-9% | Strategy builder, free tier | Momentum/earnings yok |
| **Market Chameleon** | ~785K | ~18% | Options analytics, blog | Fiyat yüksek ($99/mo) |
| **Unusual Whales** | ~500-800K | ~15-20% | Viral Twitter, flow data | Earnings research yok |
| **QuantWheel** | ~150-250K | ~20% | Freemium, AI assistant | Sadece premium seller odaklı |
| **Option Samurai** | ~80-120K | ~25% | Content-heavy SEO | **Free tier YOK** — büyük hata |
| **ORATS** | ~80-150K | ~30% | API-first, akademik | Kurumsal fiyat ($99-$399) |

> **Anahtar İçgörü:** Rakiplerin çoğu **%65-85 direkt trafik** ile yaşıyor; organik arama ciddi şekilde **sömürülmemiş**. Bu Gistify için devasa bir fırsat.

---

## 2. Stratejik Farklılaştırıcılar (Gistify'nin Avantajları)

### 2.1 Asimetrik Bahisler (Sıfır Rekabet Alanları)

1. **"Dark Finance Workspace"** — Hiçbir rakip "dark theme" ile SEO yapmıyor. Gistify bu kategoriyi yaratabilir.
2. **Midas Atlas / Confluence Scoring** — Multi-timeframe confluence hiçbir tool'un SEO stratejisinde yok.
3. **Earnings + Momentum + Risk Matrix** birleşimi — Hiçbir rakip bunları tek workspace'te birleştiriyor.
4. **Türkçe İçerik Merkezi** — "opsiyon stratejileri", "momentum scanner", "kazanç takvimi" — **hiçbir rakip Türkçe hedeflemiyor**.
5. **0DTE Strategy** — TikTok/YouTube patlıyor ama yazılı otorite içerik yok.

### 2.2 Pricing Stratejisi Önerisi

| Model | Örnek | Etki | Öneri |
|-------|-------|------|-------|
| **Freemium** | TradingView, OptionStrat, Unusual Whales | En iyi dönüşüm | ✅ Gistify için **zorunlu** |
| Free ad-supported | Finviz, Barchart | Toplu trafik | İkincil seçenek |
| No free tier | Option Samurai | Yüksek churn, zor acquisition | ❌ **Kaçınılmalı** |
| Trial-first | QuantWheel ($1/7 gün) | Düşük friction | Entegre edilebilir |

**Öneri:** Free delayed scanner + haftalık 1 ücretsiz earnings play + ücretsiz hesap makineleri.

---

## 3. Fazlı Uygulama Planı

### FAZ 1: Teknik Temelat (Hafta 1-4) — Acil SEO Tamiri

**Hedef:** Google Gistify'yi keşfedebilsin, sayfalar indexlensin, temel SEO çalışsın.

| # | Görev | Detay | Efor | Sahip |
|---|-------|-------|------|-------|
| 1.1 | **H1 ekle** | Hero section'a: `<h1>Gistify — Earnings Intelligence & Momentum Workspace for Options Traders</h1>` | 30 dk | Frontend |
| 1.2 | **sitemap.xml düzelt** | Geçerli XML formatında, tüm URL'leri içeren dinamik sitemap. Content-Type: `application/xml` | 2-4 saat | DevOps |
| 1.3 | **robots.txt güncelle** | `Sitemap: https://gistify.pro/sitemap.xml` satırı ekle | 15 dk | DevOps |
| 1.4 | **Canonical tag** | `/` → canonical: `https://gistify.pro/`, `/app` → canonical: `https://gistify.pro/` veya noindex | 30 dk | Frontend |
| 1.5 | **Prerender.io / Rendertron** | SPA sayfalarını botlara statik HTML olarak servis et. Cloudflare Worker ile ~1-2 gün | 1-2 gün | DevOps |
| 1.6 | **JSON-LD Schema** | `SoftwareApplication`, `Organization`, `WebSite` (SearchAction ile) ekle | 2 saat | Frontend |
| 1.7 | **Open Graph + Twitter Cards** | Her route için `og:title`, `og:description`, `og:image`, `twitter:card` | 2 saat | Frontend |
| 1.8 | **Dynamic meta tags** | React Helmet Async veya benzeri ile her route'e unique title/description | 2-4 saat | Frontend |
| 1.9 | **Core Web Vitals** | LCP <2.5s, CLS <0.1 hedefi. Code-split, lazy-load, image optimization | 1-2 gün | Frontend |
| 1.10 | **Email capture** | Homepage hero'a "Free Earnings Playbook — get Sunday Prep newsletter" formu | 2-4 saat | Frontend |

**Faz 1 Maliyeti:** ~$0-150/ay (Prerender.io Pro) + geliştirme zamanı.

---

### FAZ 2: Programmatik SEO + İçerik Motoru (Hafta 4-12)

**Hedef:** 600+ indexlenebilir sayfa, organik trafik 0'dan 5,000-15,000 ziyaret/ay.

#### 2.1 Programmatik Sayfa Şablonları (Dev + Data)

| Şablon | URL | Hedef Keyword | Potansiyel Trafik | Sayfa Sayısı |
|--------|-----|--------------|-------------------|--------------|
| Earnings Preview | `/earnings/{ticker}` | `{ticker} earnings preview`, `{ticker} earnings options` | 50-10,000/mo her hisse | 500+ |
| Earnings This Week | `/earnings/this-week` | `earnings this week`, `weekly earnings calendar` | 2,000-5,000/mo | 1 |
| Strategy Guides | `/strategies/{slug}` | `0DTE strategy`, `iron condor earnings`, `IV crush strategy` | 500-5,000/mo | 20-30 |
| Scanner Results | `/scanners/{type}` | `momentum scanner`, `high IV stocks`, `pre-earnings scanner` | 1,000-10,000/mo | 4-6 |
| Free Tools | `/tools/{tool}` | `IV rank calculator`, `options profit calculator` | 500-3,000/mo | 5-8 |
| Blog | `/blog/{category}/{slug}` | Educational + comparison content | Toplu | 60+ Yıl 1 |

**Toplam Yıl 1 Potansiyeli:** 600-700 indexlenebilir sayfa.

#### 2.2 Pillar Content (İlk 4 Hafta)

| Hafta | İçerik | Kategori | Target Keyword | Kelime | Tür |
|-------|--------|----------|----------------|--------|-----|
| 1 | "The Complete Guide to Trading Earnings with Options (2025)" | Earnings Strategy | `trading earnings with options` | 4,500 | Pillar |
| 1 | "IV Crush Explained: Before, During, and After Earnings" | Options Education | `IV crush explained`, `what is IV crush` | 3,200 | Pillar |
| 2 | "Momentum Scanner: How to Find High-Probability Setups Every Morning" | Momentum Trading | `momentum scanner`, `best momentum scanner` | 3,800 | Pillar |
| 2 | "Options Risk Matrix: Position Sizing for Active Traders" | Options Education | `options position sizing`, `risk matrix trading` | 3,500 | Pillar |
| 3 | "0DTE Options Strategy Guide: From Setup to Exit" | Options Education | `0DTE options strategy`, `weekly options strategy` | 4,000 | Pillar |
| 3 | "Dark Finance Workspace: Why Professional Traders Prefer Minimal UI" | Product/Brand | `dark theme trading`, `trading workspace` | 2,500 | Pillar/Brand |
| 4 | "VWAP Bounce Strategy: A Step-by-Step Options Playbook" | Momentum Trading | `VWAP bounce strategy`, `VWAP options` | 3,200 | Pillar |

#### 2.3 Free Tool Pages (Lead Magnet + SEO)

| Tool | URL | SEO Target | Lead Capture |
|------|-----|------------|--------------|
| Earnings Calendar | `/tools/earnings-calendar` | `earnings calendar 2025` | Email alert signup |
| IV Rank Calculator | `/tools/iv-rank-calculator` | `IV rank calculator` | Free scanner trial |
| Options Profit Calculator | `/tools/options-profit-calculator` | `options profit calculator` | Account creation |
| Expected Move Calculator | `/tools/expected-move-calculator` | `expected move calculator` | Free trial |
| Momentum Heatmap | `/tools/momentum-heatmap` | `momentum heatmap` | Newsletter |

#### 2.4 Comparison Content (Bottom-Funnel)

| Sayfa | Target Keyword | Dönüşüm Potansiyeli |
|-------|--------------|---------------------|
| "Gistify vs Finviz: Which Screener Wins for Options Traders?" | `gistify vs finviz` | Çok Yüksek |
| "Best Options Scanners Compared (2025)" | `best options scanner` | Yüksek |
| "TradingView vs Gistify: Earnings Intelligence Battle" | `tradingview vs gistify` | Çok Yüksek |
| "Unusual Whales vs Market Chameleon: Options Flow Deep Dive" | `unusual whales vs market chameleon` | Orta |

#### 2.5 Weekly Recurring Content (Sürdürülebilir Trafik Motoru)

| İçerik | Gün | Kanal | Format |
|--------|-----|-------|--------|
| "Sunday Earnings Playbook" | Pazar | Blog + Newsletter + Reddit | 5 earnings setup + IV Rank + expected move |
| "Momentum Monday" | Pazartesi | Blog + Twitter + Reddit | Top 20 momentum stocks + technical levels |
| "Mid-Week IV Crush Report" | Çarşamba | Blog + Twitter | Post-earnings IV crush tracking |
| "Friday Week Recap" | Cuma | Blog + Twitter | Hafta özeti, kazananlar/kaybedenler, dersler |

---

### FAZ 3: Sosyal Medya + Topluluk + Growth Hacking (Sürekli, 0-90 Gün)

**Hedef:** 5,000 Twitter followers, 500 Discord member, 2,500 newsletter subscriber, 300 paid user.

#### 3.1 Twitter/X Stratejisi

| İçerik Sütunu | Sıklık | Örnek |
|--------------|--------|-------|
| Momentum Lists | Günlük (pre-market) | "Top 10 Momentum Plays — AAPL (IVR 68, CALL) | TSLA (IVR 82, PUT) | ..." |
| Earnings Previews | Günlük (after close) | "Tomorrow's Earnings Radar — NVDA reports PM. IV Rank 91. Setup..." |
| IV Crush Stats | Earnings sonrası | "NVDA IV crushed 45% after beat. Before/after..." |
| Trading Memes | 2-3x/hafta | "When you fade the gap at VWAP and it actually works" |
| Feature Drops | Yeni feature ile | "New: Midas Atlas confluence scoring now live" |
| Market Commentary | 3-4x/hafta | "VIX 12.5 = market too quiet. Mean reversion setup day." |

**Post Zamanlaması (EST):**
- 06:30 AM — Pre-market momentum scan
- 09:00 AM — Opening bell commentary
- 12:00 PM — Mid-day recap / meme
- 04:15 PM — After-market earnings recap
- 08:00 PM — Next-day preview
- Sunday 6:00 PM — Week-ahead preview thread (7-10 tweet)

**Hedef:** 3-5 tweet/gün. 100 → 1,000 (Ay 1), 1,000 → 5,000 (Ay 3).

#### 3.2 Reddit Stratejisi

| Subreddit | Üye | İçerik Açısı | Sıklık | Kural |
|-----------|-----|-------------|--------|-------|
| r/options | 1.2M+ | Eğitim, strateji | 2x/hafta | Link post body'de YOK |
| r/wallstreetbets | 14M+ | Meme, earnings, YOLO | 1x/hafta | Spam gibi görünme |
| r/algotrading | 350K+ | Scanner logic, backtest | 2x/hafta | Teknik topluluk |
| r/thetagang | 400K+ | IV crush, premium selling | 2x/hafta | Bilgili retail |
| r/Daytrading | 1.5M+ | Pre-market prep, VWAP | 1x/hafta | Setup sevenler |
| r/stockmarket | 3M+ | Market commentary, list | 1x/hafta | Self-promo kuralları |

**Reddit Kuralı:** Asla post body'de gistify.pro link'i verme. Sorulduğunda doğal cevap: "I built Gistify to automate this — feel free to check it out."

#### 3.3 Discord Topluluğu

```
Gistify Trading Community
├── WELCOME
│   #rules | #introduce-yourself | #announcements
├── MARKET HOURS
│   #pre-market-prep (06:00-09:30 ET)
│   #opening-bell (09:30-10:30 ET)
│   #mid-day-chatter (10:30-15:30 ET)
│   #power-hour (15:30-16:00 ET)
├── EARNINGS & MOMENTUM
│   #earnings-alerts (daily scan results)
│   #momentum-scanner (live signals)
│   #trade-setups | #iv-crush-tracker
├── GENERAL
│   #trading-chat | #strategy-discussion | #newbie-corner | #off-topic
├── FEEDBACK & SUPPORT
│   #feature-requests | #bug-reports | #help-desk
└── VIP (Pro subscribers)
    #pro-user-chat | #early-access | #direct-feedback
```

**Bot Entegrasyonu:**
- Gistify Bot — 06:30 AM daily momentum scan otomatik post
- Gistify Bot — 04:15 PM daily earnings alert
- Gistify Bot — 08:00 AM VIX/Fear & Greed macro update

#### 3.4 Product Hunt Launch Plan

**Tarih:** Salı günü, 00:01 PST (03:01 EST)

**Pre-Launch (T-14 Gün):**
- T-14: Product Hunt "Coming Soon" sayfası, PH badge homepage'a
- T-12: Mevcut kullanıcılara email: "Help us launch on PH"
- T-7: 3 adet teaser email (her 2 günde bir)
- T-1: Tüm kanallarda "Tomorrow. Product Hunt. 00:01 PST."

**Launch Günü (Saat-Saat):**
- 00:01 — Product Hunt page yayınla
- 00:05 — "We're live!" tweet
- 00:10 — Email waiting list'e
- 00:15 — Discord #announcements
- 00:45 — Reddit (r/entrepreneur, r/SideProject)
- 06:00 — "We're trending on PH!" tweet + LinkedIn
- 09:00 — Mid-morning email blast
- 12:00 — Her PH comment'a 15 dk içinde cevap
- 15:00 — "3 hours left" push
- 21:00 — "Last 3 hours!" final push

**Hedef:** 500+ upvote, 50+ comment, Top 5 category, 2,000+ unique visitor, 200+ signup, 20+ paid conversion.

#### 3.5 Newsletter — "Sunday Prep"

| Bölüm | İçerik | Uzunluk |
|-------|--------|---------|
| Subject | "Sunday Prep: [emoji] Top 5 Earnings Plays + Momentum Scan" | — |
| Macro Minute | VIX, SPY, QQQ, Fear & Greed, DXY — 3 cümle | 100 kelime |
| Top 5 Earnings | Ticker, report date, IV Rank, expected move, setup | 300 kelime |
| Momentum Scan | Top 10 stocks + setup type (CALL/PUT) | 200 kelime |
| Macro Calendar | FOMC, CPI, PPI, jobs — bu haftanın önemli olayları | 100 kelime |
| Community Spotlight | Trader of the week + Gistify setup'ı | 150 kelime |
| CTA | "Get the full scan at Gistify.pro" | 50 kelime |

**Platform:** ConvertKit (ücretsiz 1K'a kadar) veya Beehiiv (built-in discovery + ücretsiz)
**Frekans:** Her Pazar, 08:00 AM EST
**Lead Magnet:** "Free Earnings Playbook PDF" (20 sayfa) + "Options Sizing Cheat Sheet"

#### 3.6 Influencer Outreach (3 Kademe)

| Kademe | Takipçi | Hedef | Dönüşüm | Ödül |
|--------|---------|-------|---------|------|
| Tier 1: Micro | 5K-50K | 30-40 influencer | 15% collab | Free lifetime Pro + %30 affiliate |
| Tier 2: Mid | 50K-200K | 15-20 influencer | 10% collab | Free lifetime + affiliate + exclusive preview |
| Tier 3: Mega | 200K+ | 5-10 influencer | 5% collab | Revenue share + co-marketing + equity teklif (top 2-3) |

**Outreach Şablonu (Tier 1):**
```
Subject: Quick question about your $[ticker] analysis

Hi [Name],

I just read your thread on $[ticker] — your take on the IV crush setup was spot on.
I'm the founder of Gistify.pro, a dark-mode trading workspace built specifically for options traders.

I'd love to give you free lifetime access to Pro. No strings attached — genuinely just want your honest feedback. If you find it useful, I'd be happy to set up an affiliate link (30% recurring commission).

Either way, keep up the great work.

Cheers, [Your Name]
```

**Outreach Takvimi:**
- Hafta 1: İlk email
- Hafta 2: Follow-up (cevap yoksa)
- Hafta 3: Final follow-up + Twitter DM
- Hafta 4: "Closed-lost" veya nurture list

#### 3.7 Backlink & PR Stratejisi

**Guest Post Hedefleri (20 Site):**

| Site | Niche | DA (tah.) | Outreach Açısı |
|------|-------|-----------|----------------|
| OptionsTrading.com | Options education | 45 | "How I built a scanner that finds 2x earnings plays" |
| WarriorTrading.com | Day trading | 50 | "Dark mode trading: why your workspace matters" |
| Investopedia.com | Genel finance | 90 | "Options scanner tools: what to look for" |
| Benzinga.com | Finansal haber | 75 | "Pre-market momentum scanning for options traders" |
| SeekingAlpha.com | Yatırım analizi | 85 | "Quantitative momentum screening for retail options" |
| HackerNoon.com | Tech + startup | 85 | "How I built a real-time options scanner in [tech stack]" |
| Medium (publications) | Genel | 95 | "The rise of dark-mode trading workspaces" |

**HARO Stratejisi:**
- HARO'ya kaydol (Business & Finance, Technology, Lifestyle)
- Günde 3 kontrol: 8:00 AM, 12:00 PM, 5:00 PM EST
- 2 saat içinde cevapla (journalist'ler hızlı kapatır)
- Bio'da: "[Name], founder of Gistify.pro, active options trader"

**Podcast Görünümleri:**
- Chat With Traders
- The Trading Podcast
- Indie Hackers Podcast
- Fintech Podcast

---

### FAZ 4: Ölçek & Otorite (Ay 4-6)

| Ay | Odak | Eylemler | Hedefler |
|----|------|----------|----------|
| 4 | Earnings sayfaları ölçeklendirme | 200+ `/earnings/{ticker}` sayfası indexli | 200+ indexed page |
| 4 | Comparison içerikleri | 4 comparison post yayında | 10+ top 10 ranking |
| 5 | Tool sayfaları tamamlama | 5 tool page yayında | 3,000+ tool page ziyaret |
| 5 | Newsletter büyütme | 2,500+ subscriber | 30%+ open rate |
| 5 | Influencer tier 2 | 2+ Tier 2 partner aktif | 500+ referred signup |
| 6 | Türkçe içerik hub'ı | 10 Türkçe makale | 1,000-3,000 Türkçe trafik |
| 6 | API/Developer portal | "Options data API" sayfası | Institutional backlink |
| 6 | Affiliate program | 30% recurring commission | 20+ aktif affiliate |

---

## 4. Viral Loop & Referans Mekanikleri

### 4.1 Referral Programı

| Eylem | Ödül | Mekanizma |
|-------|-----|-----------|
| Referrer | 1 ay ücretsiz Pro | Unique referral link dashboard'da |
| Referee | İlk Pro ayı %20 indirim | Referral link ile otomatik uygulanır |
| Milestone | 5 referral = 6 ay ücretsiz; 10 = lifetime free | Manuel review |

### 4.2 Paylaşılabilir İçerik

| İçerik | Format | Dağıtım |
|--------|--------|---------|
| Weekly "Top Momentum Stocks" görseli | 1080x1080px, dark bg, neon accent | Twitter (pin 24h), Instagram, Reddit, Discord |
| Earnings Reaction GIF'leri | IV crush, gap fade, scanner alert | Twitter, Reddit |
| Before/After Trade Setup | 1200x600px side-by-side | Twitter, blog, email |

### 4.3 UGC (User-Generated Content) Teşvikleri

| Eylem | Ödül | Aylık Bütçe |
|-------|------|-------------|
| Gistify screenshot'ını Twitter'da paylaş | $100 giveaway çekilişi | $100 |
| Case study gönder | $50 Amazon + 1 ay Pro | $200 |
| Trader of the Week | $50 + badge + feature | $200 |
| YouTube videosu oluştur | $200 + affiliate link | $400 |
| Reddit review (organik) | 1 ay Pro | $100 |
| **Toplam UGC Bütçesi** | | **$1,000/ay** |

---

## 5. KPI Hedefleri & Zaman Çizelgesi

### 5.1 Teknik SEO KPI'ları

| Metric | Mevcut | 3 Ay | 6 Ay | 12 Ay |
|--------|--------|------|------|-------|
| Indexlenen sayfa | ~1 | 100+ | 300+ | 700+ |
| Organik aylık session | Bilinmiyor | 5,000 | 20,000 | 60,000+ |
| Organik keyword sıralaması | Bilinmiyor | 200+ | 800+ | 2,500+ |
| Top 10 sıralama (hedef keyword) | 0 | 10 | 40 | 100+ |
| Backlink | Bilinmiyor | 20+ | 60+ | 150+ |
| Domain Rating (Ahrefs) | Bilinmiyor | 15+ | 25+ | 40+ |

### 5.2 Sosyal & Topluluk KPI'ları

| Metric | Başlangıç | 30 Gün | 60 Gün | 90 Gün |
|--------|-----------|--------|--------|--------|
| Twitter Followers | 0 | 500 | 2,000 | 5,000 |
| LinkedIn Connections | 0 | 1,000 | 3,000 | 6,000 |
| Discord Members | 0 | 50 | 200 | 500 |
| Newsletter Subscribers | 0 | 300 | 1,000 | 2,500 |
| YouTube Subscribers | 0 | 100 | 500 | 1,500 |
| Website Aylık Ziyaretçi | Bilinmiyor | 3,000 | 8,000 | 15,000 |
| Toplam Signup | Bilinmiyor | 500 | 1,500 | 3,000 |
| Paid Subscribers | 0 | 50 | 150 | 300 |
| Influencer Partners | 0 | 5 | 12 | 20 |
| Backlink | 0 | 5 | 12 | 20 |

### 5.3 İçerik Üretim KPI'ları

| Metric | 3 Ay | 6 Ay | 12 Ay |
|--------|------|------|-------|
| Blog post yayında | 12 | 30 | 60+ |
| Earnings sayfası yayında | 200 | 500+ | 800+ |
| Strategy guide yayında | 5 | 15 | 30+ |
| Free tool page yayında | 2 | 5 | 8+ |
| Comparison post yayında | 4 | 8 | 12+ |
| Tool page signup'ları | 500 | 3,000 | 10,000+ |
| Organik kayıtlı kullanıcı | 200 | 1,000 | 3,500+ |

---

## 6. Aylık Bütçe Önerisi

| Kalem | Aylık Maliyet | Not |
|-------|--------------|-----|
| Prerender.io / Rendertron | $80-150 | SPA SEO için zorunlu |
| ConvertKit / Beehiiv | $0 (1K'a kadar) | Newsletter |
| Buffer / TweetDeck | $15 | Social scheduling |
| Canva Pro | $13 | Tasarım |
| ReferralCandy / Custom | $49 | Referral tracking |
| UGC Bütçesi | $1,000 | Trader of the Week, case study, giveaway |
| Influencer / Affiliate | $500 | Tier 1-2 mikro ödemeleri |
| Product Hunt / PR | $0 | Organik |
| HARO | $0 | Ücretsiz |
| **Toplam Aylık Bütçe** | **~$1,657-1,727** | Minimum viable growth budget |

> **Not:** Bu bütçe 3-6 ay boyunca yatırım gerektirir. Organik trafik ve paid conversion bileşimiyle 6-9 ay içinde kendi kendini finanse etmeye başlar.

---

## 7. Özet: İlk 7 Gün Acil Eylem Listesi

### Gün 1 (Bugün)
- [ ] H1 tag ekle (hero section)
- [ ] robots.txt'a `Sitemap:` directive ekle
- [ ] Twitter/X hesabı aç (@gistify veya @gistifypro)
- [ ] Discord server kur

### Gün 2
- [ ] sitemap.xml düzelt (XML formatında, geçerli)
- [ ] Canonical tag ekle (`/` ve `/app`)
- [ ] ConvertKit / Beehiiv hesabı aç
- [ ] Homepage'a email capture formu ekle

### Gün 3
- [ ] Prerender.io veya Rendertron deploy et
- [ ] JSON-LD Schema (SoftwareApplication + Organization) ekle
- [ ] Open Graph + Twitter Cards ekle
- [ ] LinkedIn şirket sayfası aç

### Gün 4
- [ ] Dynamic meta tags per route (React Helmet Async)
- [ ] YouTube kanalı aç
- [ ] İlk 5 tweet template'ini hazırla
- [ ] Reddit hesapları aç (karma biriktirmeye başla)

### Gün 5
- [ ] Core Web Vitals audit (PageSpeed Insights)
- [ ] Code-split ve lazy-load implementasyonu
- [ ] İlk "Sunday Prep" newsletter içeriğini yaz
- [ ] Canva'da "Weekly Momentum Scan" şablonu tasarla

### Gün 6
- [ ] IV Crush Calculator sayfa tasarımını yap
- [ ] Blog altyapısı kur (Next.js SSG veya headless CMS)
- [ ] İlk pillar post'u yazmaya başla ("Complete Guide to Trading Earnings")
- [ ] 20 Tier 1 influencer listesi oluştur

### Gün 7
- [ ] İlk pillar post'u yayınla
- [ ] HARO'ya kaydol
- [ ] Product Hunt "Coming Soon" sayfası oluştur
- [ ] İlk Reddit comment'lerini at (karma biriktir)

---

## 8. Asimetrik Kazanç Fırsatları (Gistify'ye Özel)

1. **Türkçe Opsiyon İçerik Merkezi** — Hiçbir rakip Türkçe hedeflemiyor. Senin Türkçe + İngilizce çift dilli yetkinliğin bu alanda **first-mover** olmanı sağlar. "Opsiyon stratejileri", "momentum tarama", "kazanç takvimi" gibi keyword'lerde sıfır rekabet.

2. **Dark Theme / Workspace SEO** — "Dark theme trading tools", "dark mode stock scanner" — hiçbir rakip bu kategoriyi yaratmamış. Gistify bu alanı tamamen sahiplenebilir.

3. **0DTE Trendi** — TikTok ve YouTube'da 0DTE patlıyor ama yazılı otorite içerik yok. "0DTE Options Strategy: Complete Playbook" Gistify'yi bu trendin merkezine koyar.

4. **Programmatik Earnings Sayfaları** — `/earnings/AAPL`, `/earnings/TSLA` gibi 500+ sayfa otomatik oluşturulabilir. Her sayfa 100-10,000 arama/mo alır. Toplam: 50,000-200,000 aylık potansiyel.

5. **Free Tool Suite** — OptionStrat hesap makineleriyle büyüdü. Gistify 5-7 ücretsiz hesap makinesiyle hem SEO hem lead capture kazanır. Her calculator bir landing page = her biri ayrı arama trafiği kaynağı.

---

## 9. Uyarılar & Riskler

| Risk | Olasılık | Etki | Önlem |
|------|----------|------|-------|
| SPA SEO çözümü yeterli olmayabilir | Orta | Yüksek | Next.js SSR/SSG migration planı hazır tut |
| İçerik üretim hızı yetişmeyebilir | Orta | Orta | AI destekli draft + editor review |
| Reddit'te ban yeme | Orta | Orta | Sadece value-first post, link verme |
| Product Hunt başarısız olma | Düşük | Orta | 200+ waitlist zorunlu, cross-channel push |
| Rakipler aynı stratejiyi kopyalar | Orta | Düşük | First-mover avantajı + Midas teknolojisi moat |
| Google algo güncellemesi | Düşük | Orta | E-E-A-T odaklı içerik, spam değil |

---

*Bu master plan 3 paralel sub-agent araştırmasının sentezidir. Her faz bağımsız başlayabilir ama Faz 1 (teknik SEO) diğer tüm fazların temelidir — onsuz içerik üretmek boşa çaba olur.*

---

## 10. Execution Status — Agent vs. You

> Bu bölüm, her görevin **kim tarafından** yapıldığını veya yapılması gerektiğini gösterir.
> - **Agent** = AI tarafından üretildi (metin, kod şablonu, içerik, email, tweet, schema, vb.)
> - **You** = Sen tarafından yapılması gerekir (deploy, sunucu ayarları, kod entegrasyonu, hesap açma, görsel tasarım, vb.)

### ✅ Faz 1 — Teknik SEO Tamiri (Agent Yapabilir / Sen Deploy Et)

| # | Görev | Durum | Kim |
|---|-------|-------|-----|
| 1.1 | H1 tag ekle | ✅ Agent kod şablonu hazırladı | **You** → Frontend'e uygula |
| 1.2 | sitemap.xml düzelt | ✅ Agent XML şablonu hazırladı | **You** → DevOps deploy et |
| 1.3 | robots.txt güncelle | ✅ Agent yeni robots.txt hazırladı | **You** → Sunucuya yükle |
| 1.4 | Canonical tag ekle | ✅ Agent kod snippet hazırladı | **You** → Frontend'e uygula |
| 1.5 | Prerender.io / Rendertron | 📋 Plan var | **You** → DevOps kurulum |
| 1.6 | JSON-LD Schema | ✅ Agent JSON-LD şablonları hazırladı | **You** → Frontend'e inject et |
| 1.7 | Open Graph + Twitter Cards | ✅ Agent meta tag şablonu hazırladı | **You** → Frontend'e uygula |
| 1.8 | Dynamic meta tags per route | ✅ Agent React Helmet snippet hazırladı | **You** → Frontend'e uygula |
| 1.9 | Core Web Vitals | 📋 Plan var | **You** → Frontend optimizasyonu |
| 1.10 | Email capture form | 📋 Plan var | **You** → Frontend + ConvertKit entegrasyonu |

### ✅ Faz 2 — Programmatik SEO + İçerik Motoru (Agent Yapabilir / Sen Deploy Et)

| # | Görev | Durum | Kim |
|---|-------|-------|-----|
| 2.1 | Pillar Post 1: "Complete Guide to Trading Earnings with Options" | ✅ Agent yazdı | **You** → Blog'a publish et |
| 2.2 | Pillar Post 2: "IV Crush Explained" | ✅ Agent yazdı | **You** → Blog'a publish et |
| 2.3 | Pillar Post 3: "Momentum Scanner Guide" | 📋 Outline var | **You** → Agent'a yazdır veya kendin yaz |
| 2.4 | Pillar Post 4: "Options Risk Matrix" | 📋 Outline var | **You** → Agent'a yazdır veya kendin yaz |
| 2.5 | Pillar Post 5: "0DTE Strategy Guide" | 📋 Outline var | **You** → Agent'a yazdır veya kendin yaz |
| 2.6 | Comparison: "Best Options Scanners Compared 2025" | ✅ Agent yazdı | **You** → Blog'a publish et |
| 2.7 | Free Tool: IV Rank Calculator | ✅ Agent HTML şablonu hazırladı | **You** → Deploy et |
| 2.8 | Free Tool: Earnings Calendar | ✅ Agent HTML şablonu hazırladı | **You** → Deploy et |
| 2.9 | Free Tool: Options Profit Calculator | 📋 Plan var | **You** → Geliştir ve deploy et |
| 2.10 | Free Tool: Expected Move Calculator | 📋 Plan var | **You** → Geliştir ve deploy et |
| 2.11 | Free Tool: Momentum Heatmap | 📋 Plan var | **You** → Geliştir ve deploy et |
| 2.12 | Earnings Preview Pages (/earnings/{ticker}) | 📋 Template var | **You** → DevOps + Data pipeline kur |
| 2.13 | Strategy Guide Pages (/strategies/{slug}) | 📋 Template var | **You** → DevOps + Content pipeline kur |
| 2.14 | Scanner Results Pages (/scanners/{type}) | 📋 Template var | **You** → DevOps + Data pipeline kur |
| 2.15 | Blog Infrastructure (/blog/{category}/{slug}) | 📋 Plan var | **You** → Next.js SSG veya CMS kur |
| 2.16 | Weekly Content: "Sunday Earnings Playbook" | ✅ Agent ilk sayıyı yazdı | **You** → Her hafta yayınla |
| 2.17 | Weekly Content: "Momentum Monday" | 📋 Template var | **You** → Her hafta yayınla |
| 2.18 | Weekly Content: "Mid-Week IV Crush Report" | 📋 Template var | **You** → Her hafta yayınla |
| 2.19 | Weekly Content: "Friday Week Recap" | 📋 Template var | **You** → Her hafta yayınla |

### ✅ Faz 3 — Sosyal Medya + Topluluk + Growth Hacking (Agent Yapabilir / Sen Execute Et)

| # | Görev | Durum | Kim |
|---|-------|-------|-----|
| 3.1 | Twitter/X hesap aç | 📋 Plan var | **You** → @gistify veya @gistifypro aç |
| 3.2 | Twitter tweet şablonları (20 adet) | ✅ Agent hazırladı | **You** → Buffer/TweetDeck'e yükle ve kullan |
| 3.3 | Reddit hesapları aç | 📋 Plan var | **You** → r/options, r/algotrading vb. için hesap aç |
| 3.4 | Reddit post şablonları (5 subreddit) | ✅ Agent hazırladı | **You** → Her hafta kullan |
| 3.5 | LinkedIn şirket sayfası aç | 📋 Plan var | **You** → LinkedIn Company Page aç |
| 3.6 | YouTube kanalı aç | 📋 Plan var | **You** → YouTube kanalı aç, branding yap |
| 3.7 | Discord server kur | 📋 Plan var | **You** → Discord server oluştur, kanal yapılandır |
| 3.8 | Newsletter (ConvertKit/Beehiiv) | 📋 Plan var | **You** → Hesap aç, form embed et |
| 3.9 | Newsletter "Sunday Prep" #1 | ✅ Agent yazdı | **You** → ConvertKit/Beehiiv'e yükle ve gönder |
| 3.10 | Influencer Outreach Emails (3 tier) | ✅ Agent hazırladı | **You** → Mail merge ile gönder |
| 3.11 | Product Hunt Launch Metinleri | ✅ Agent hazırladı | **You** → PH sayfasını oluştur ve launch et |
| 3.12 | Product Hunt Launch Günü | 📋 Plan var | **You** → Koordine et ve execute et |
| 3.13 | Referral Program kurulumu | 📋 Plan var | **You** → ReferralCandy veya custom build |
| 3.14 | UGC Teşvik Programı ($1,000/ay) | 📋 Plan var | **You** → Bütçe ayır ve uygula |

### ✅ Faz 4 — Ölçek & Otorite (Ay 4-6)

| # | Görev | Durum | Kim |
|---|-------|-------|-----|
| 4.1 | Earnings sayfaları ölçeklendirme (200+) | 📋 Template var | **You** → Data pipeline + DevOps |
| 4.2 | Türkçe İçerik Hub'ı (10 makale) | 📋 Plan var | **You** → Agent'a yazdır veya kendin yaz |
| 4.3 | API/Developer portal | 📋 Plan var | **You** → Geliştir ve publish et |
| 4.4 | Affiliate program (30% recurring) | 📋 Plan var | **You** → Program kur ve onboarding yap |

---

**Hazırlayan:** Orchestrator Agent + 3 Specialist Sub-Agent + 4 Production Sub-Agent  
**Tarih:** 2026-07-02  
**Domain:** gistify.pro  
**Hedef:** 12 ay içinde 60,000+ organik ziyaret, 3,500+ organik kayıt, 100+ top 10 sıralama.
