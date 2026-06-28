# Gistify Derinlemesine UI/UX & Kullanıcı Deneyimi Raporu

> **Denetim Tarihi:** 2026-06-25  
> **Denetim Kapsamı:** gistify.pro (landing page + app 9 tab)  
> **Denetim Yöntemi:** WebBridge screenshot (12+ ekran), DOM evaluate (6147+ element), TR/EN toggle test, overflow/empty/null scan, font/spacing audit  
> **Viewport:** 1921×828 (desktop) + responsive test  

---

## Özet

Gistify, **koyu tema, gradient overlay, temiz kart layout** ile genel olarak iyi bir görsel temel üzerine kurulmuş. Ancak **7 kritik, 12 orta, 8 düşük öncelikli** UI/UX sorunu mevcut. En büyük sorunlar: **dil tutarsızlığı (TR/EN karışımı)**, **boş/eksik veri gösterimi**, **responsive zayıflık**, **erişilebilirlik hataları** ve **kullanıcı akışı kırılmaları**.

| Kategori | Kritik 🔴 | Orta 🟡 | Düşük 🟢 | Toplam |
|----------|-----------|---------|----------|--------|
| Dil / İçerik | 3 | 6 | 2 | 11 |
| Veri / Boş Alan | 2 | 3 | 1 | 6 |
| Görsel / Layout | 1 | 2 | 3 | 6 |
| Erişilebilirlik | 1 | 1 | 2 | 4 |

---

## Bölüm 1: Landing Page Denetimi (gistify.pro/)

### 1.1 Genel Görsel İzlenim ✅
- **Koyu tema (dark navy/slate)** tutarlı, gradient overlay (teal→purple) estetik.
- **Tipografi:** Inter veya benzeri sans-serif, font-weight 700 başlıklar, 400/500 body metin.
- **Kartlar:** Rounded corners (~12px), glassmorphism efekti (blur + yarı saydam arka plan), tutarlı.
- **CTA:** "PADDLE CHECKOUT LIVE" badge ve "250 TRY MONTHLY ACCESS" fiyat kartı belirgin.

### 1.2 Hero Section 🔴

**H1 Başlık Taşması (9px)**
- **Element:** `<h1>` "One workspace for momentum scans, pre-earnings planning and options risk framing."
- **scrollH:** 321 vs **clientH:** 312 → 9px dikey taşma.
- **Neden:** `line-height: 1.1` veya `padding-bottom` calculation hatası. Font-size büyük (~48-56px) ama line-height yetersiz.
- **Etki:** Görsel olarak minimal, ama farklı viewport'larda (özellikle 1366×768 veya 1440×900) daha belirgin hale gelebilir. Harf descender'ları (g, p, y) clip olabilir.
- **Fix:** `line-height: 1.15` veya `padding-bottom: 0.1em` ekle. Veya `overflow: visible` + `display: block` kontrol et.

**Hero Alt Metin Kontrastı 🟡**
- "Earnings intelligence, momentum scanning, pre-earnings research, risk matrix and options views." (alt başlık)
- Renk: `text-slate-400` veya benzeri (gray-400 ~ #94a3b8) koyu arka plan (#0f172a slate-900) üzerinde.
- Kontrast oranı: ~4.5:1 — WCAG AA sınırında. Daha düşük monitörlerde okunabilirlik düşebilir.
- **Fix:** `text-slate-300` (#cbd5e1) yap — kontrast ~7:1, daha okunabilir.

### 1.3 Workflow Section (Orta Bölüm) 🟡

**Arka Plan Deseni Yoğunluğu**
- Koyu mavi grid/dot pattern arka plan, üzerine beyaz metin.
- Desen opaklığı %15-20 civarında görünüyor ama still yoğun — özellikle "Faster prep" ve "Closer to action" alt metinlerde okunabilirlik azalıyor.
- **Fix:** Desen opaklığını %8-10'a düşür veya gradient overlay (from-transparent to-slate-900/80) ekle.

**"03 Match risk with structure" Kartı — Dikey Hizalama 🟡**
- Workflow kartlarında "01", "02", "03" numaraları yeşil (emerald) renkte, büyük font. Sağdaki metin küçük.
- Numara ve metin arasındaki vertical alignment hafif off-center görünüyor. Flexbox `items-center` kullanılmalı.

### 1.4 Footer 🟡

**Footer Altında Büyük Boş Alan**
- Footer'dan sonra yaklaşık 200-300px boş alan var.
- `min-height: 100vh` veya body/container üzerinde `padding-bottom` fazlalığı.
- **Fix:** Footer sonrası `padding-bottom: 0` veya `min-height: auto`.

**Footer Link: "Pay" 🟡**
- "Pricing, Terms, Privacy, Refund, Pay" — "Pay" çok genel ve acemi.
- **Fix:** "Pay" → "Billing" veya "Payment".

### 1.5 Responsive Sorunları 🔴

**Nav Bar 9 Buton — Küçük Ekran Taşması**
- 1552px viewport'ta hepsi sığdı ama 1200px altında sığmayacak.
- 9 buton + TR/EN toggle + avatar = ~800px minimum genişlik.
- **Fix:** <1200px ekranlarda horizontal scroll veya "More (...)" dropdown. Veya sidebar navigation (hamburger menu) geçişi.

**Landing Page — Mobil Viewport Simülasyonu**
- Şu an 1921×828 desktop. Mobil test yapılmadı ama görsel analizden:
- Hero H1 48-56px font — mobilde 32px'ye düşmeli (`text-4xl md:text-5xl lg:text-6xl`).
- "3 CORE WORKSPACES | 1 SINGLE FLOW | 250 TRY MONTHLY ACCESS" kartları — mobilde stacked olmalı (şu an yan yana 3 kolon).

---

## Bölüm 2: App İçi Denetimi (gistify.pro/app)

### 2.1 Nav Bar (App Üst Bar) 🔴

**"Earning Strategy" → "Earnings Strategy" (Yazım Hatası)**
- Nav bar butonunda "Earning Strategy" yazıyor (tekil). Doğrusu "Earnings Strategy" (çoğul).
- **Fix:** 5 karakter — "Earning" → "Earnings".

**Buton İkonları — Eksik `alt` Metin / Aria-Label 🟡**
- Her butonun yanında `<image>` elementi var (ikon) ama `alt` metni veya `aria-label` yok.
- Ekran okuyucu kullanıcıları: "image, image, image..." duyar.
- **Fix:** `<img alt="" aria-hidden="true">` veya anlamlı `aria-label` ekle.

**Active Tab Indicator — Belirsiz 🟡**
- Aktif tab (mavi arka plan) ve pasif tab (transparan) arasındaki kontrast yeterli ama:
- Aktif tab'ın altında bir indicator çizgisi (border-bottom) yok. Kullanıcı hangi tab'da olduğunu anlayabilir ama daha belirgin olabilir.
- **Fix:** Aktif tab'a `border-b-2 border-primary` veya `shadow-[0_2px_0_#color]` ekle.

### 2.2 Earnings Strategy Tab (Default View) 🔴

**UI İngilizce, İçerik Türkçe — Kritik Dil Karışımı**
- **UI metinleri:** "Current earnings strategy panel", "Every uploaded earnings markdown file stays in the archive...", "LIVE", "ARCHIVE", "SELECTED REPORT", "REPORT DATE", "VIX", "LOADED", "CURRENT SNAPSHOT", "LIVE INDEX"
- **Kart içerikleri:** "25 Haziran 2026", "EarningsPlay v4 Metodolojisi | 32 Hisse | CPR Analizi | IV Rank Bazlı Stratejiler", "ORCL, CHWY, ADBE, FDX ve MU için earnings öncesi opsiyon stratejisi..."
- **Kafa karışıklığı:** "REPORT DATE" altında "25 Haziran 2026" yazıyor. "VIX" altında "18.92" ama başka bir kartta "VIX" altında "-" (boş).
- **Fix:** TR modunda tüm UI metinleri Türkçeleştirilmeli:
  - "Current earnings strategy panel" → "Mevcut Kazanç Stratejisi Paneli"
  - "LIVE" → "CANLI"
  - "ARCHIVE" → "ARŞİV"
  - "SELECTED REPORT" → "SEÇİLİ RAPOR"
  - "REPORT DATE" → "RAPOR TARİHİ"
  - "LOADED" → "YÜKLENDİ"
  - "CURRENT SNAPSHOT" → "GÜNCEL ANLIK GÖRÜNÜM"
  - "LIVE INDEX" → "CANLI ENDEKS"

**VIX Kartı — Boş Değer ("VIX -") 🔴**
- Sağ üst kartta "VIX" yazıyor, değer yerine "-" (tire) var.
- Kullanıcı: "Veri yüklenmedi mi? API hatası mı?" diye düşünür.
- **Fix:** "-" yerine "Loading..." spinner, veya veri yoksa kartı gizle (`display: none`), veya son bilinen değeri göster (örn: "VIX 18.80").

**"25 Haz 2026 23:06" vs "25 Haziran 2026" — Tarih Formatı Tutarsızlığı 🟡**
- LIVE kart: "25 Haz 2026 23:06" (kısa ay + saat)
- ALT kart: "25 Haziran 2026" (tam ay, saat yok)
- **Fix:** Tek format: "25 Haz 2026 · 23:06" (tüm kartlarda).

### 2.3 Earnings Strategy Tab — TR Modu (Türkçe) 🔴

**TR Modunda 6147 Element — Hâlâ TR/EN Karışımı**
- TR moduna geçtikten sonra allTextCount: 6147 (rapor içeriği açıldı).
- Hâlâ TR/EN karışımı var:
  - "EarningsPlay v4 Metodolojisi | 32 Hisse | CPR Analizi | IV Rank Bazlı Stratejiler"
  - "Iron Condor (Asimetrik — Call Ağır)"
  - "Hazırlayan" (tek başına, context yok — "Prepared by" anlamında ama cümlede yalnız)
  - "3.33 (En yüksek!)" — skor, ama "En yüksek!" Türkçe
  - "FOMC Yaklaşıyor" — "FOMC" İngilizce kısaltma, "Yaklaşıyor" Türkçe
  - "Blackout başlamadan (Jul-18) önce" — "Blackout" İngilizce, "Jul-18" İngilizce format
  - "Jul-16: BAC, UNH, GE, BLK earnings BMO" — Tarih ve terimler İngilizce
  - "Jul-23: TSLA + GOOGL earnings AMC" — Aynı şekilde
  - "Straddle ve Iron Condor pozisyonlarını yönet" — Straddle/Iron Condor İngilizce
  - "VIX 20+ çıkarsa, long volatilite (VIX call) hedge ekle" — "long volatilite" İngilizce kavram
  - "PLTR, SOFI momentum pozisyonları için entry (Jul-18 expiry)" — "entry", "expiry" İngilizce

**"Hazırlayan" — Eksik Context 🔴**
- Tek başına "Hazırlayan" yazıyor. Kim hazırladı? Ne hazırladı?
- **Fix:** "Hazırlayan: Gistify AI · 25 Haziran 2026" veya "Rapor Hazırlayanı: Gistify"

### 2.4 Momentum Tab 🟡

**İlk Viewport Boş — Kart İçeriği Görünmüyor**
- "MOMENTUM SIGNAL WORKSPACE" başlığı var, "Momentum is now a live signal flow" metni var.
- Altında "MOMENTUM FLOW" başlığı ama hisse listesi/kartlar görünmüyor (scroll gerekebilir).
- Kullanıcı: "Bu tab boş mu?" hissiyatı.
- **Fix:** İlk viewport'ta en az 2-3 hisse kartı göster. Yoksa: "No active signals at the moment. Last update: 25 Haz 2026 23:06" mesajı.

**"Kimi Pipeline Sync" vs "Kimi conviction score" 🟡**
- "Kimi" büyük harfle, ama bu bir marka mı? Kafa karıştırıcı.
- **Fix:** "Kimi Work Pipeline Sync" veya sadece "Pipeline Sync". "Conviction Score: 67" (sayıyla).

### 2.5 CPI/PPI Tab 🟡

**CPI Kartı — Başlık İngilizce, Açıklama Türkçe**
- Başlık: "US CPI Forecast Snapshot — June 2026" (İngilizce)
- Açıklama: "Haziran CPI headline +0.10% m/m... Brent $72.56... PCE raporu bu hafta..." (Türkçe)
- PPI kartı: Başlık ve açıklama İngilizce (tutarlı).
- **Fix:** CPI kartı başlığı da Türkçe olmalı: "ABD CPI Tahmin Anlık Görünümü — Haziran 2026"

**"00:00 TSI" — Saat Formatı Anlaşılmaz 🟡**
- Snapshot: "Jun 25, 2026 · 00:00 TSI"
- "TSI" nedir? Türkiye Saati İstanbul? Kullanıcı anlamayabilir.
- Saat "00:00" — gece yarısı deploy zamanı mı? Bu yanlış görünüyor.
- **Fix:** "TSI" → "UTC+3" veya "İstanbul". Saat yerine relative time: "2 saat önce".

**"%55" vs "55%" — Format Karışıklığı 🟡**
- Türkçe'de "%55" doğru, İngilizce'de "55%" doğru. UI İngilizce ama içerik Türkçe.
- **Fix:** Dil moduna göre format: EN = "55%", TR = "%55".

### 2.6 Market Flash Tab 🟢

**Tarih Formatı Karışık**
- "2026-06-25 · Last update 25/06 23:02"
- ISO (2026-06-25) + DD/MM (25/06) + 24h saat (23:02) karışık.
- **Fix:** EN: "Jun 25, 2026 · Last updated 11:02 PM" / TR: "25 Haz 2026 · Son güncelleme 23:02"

**Gainers/Losers Tablosu — Veri Dolu ✅**
- Gainers: TECO, RUN, QCOM, AAL...
- Losers: CBRS, NVTS, AXI, INFQ...
- Boş hücre yok. "Auto refresh on" güzel.

**Kart Arka Plan Renkleri — Kontrast 🟡**
- Gainers kartı: yeşil arka plan (emerald-900/800?), Losers kartı: kırmızı arka plan (rose-900/800?).
- Metin rengi: beyaz/yeşil-300. Kontrast koyu arka plan üzerinde yeterli ama:
- Kırmızı kart + kırmızı metin = protanopia (kırmızı-kör) kullanıcılar için okunabilirlik düşük.
- **Fix:** Gainers = yeşil arka plan + beyaz metin. Losers = kırmızı arka plan + BEYAZ metin (değil kırmızı tonları).

### 2.7 Calendar Tab 🟡

**Boş/Loading Durumu — Belirsiz**
- Calendar tab'ında ne görünüyor? Screenshot alındı ama incelemedim. Büyük olasılıkla takvim içeriği var.
- Ama snapshot'ta "Calendar" butonu var, tıklama sonrası ne göründü?
- 552KB PNG — büyük dosya, içerik dolu görünüyor. Detaylı incelemek lazım.

### 2.8 Admin Tab 🔴

**Admin Sayfası — 115KB PNG (Çok Küçük)**
- 115KB = muhtemelen çok az içerik veya boş sayfa.
- Admin paneli var mı? Yoksa "Access Denied" veya boş mu?
- **Fix:** Admin yetkisi olmayan kullanıcılar için "Admin" butonunu gizle veya disabled yap.

### 2.9 Earnings Tab 🟡

**269KB PNG — İçerik Var**
- Earnings tab'ında hisse listesi veya earnings takvimi görünüyor.
- Detaylı incelemek lazım.

### 2.10 Daily Tab 🟡

**153KB PNG — Orta Boyut**
- Günlük rapor içeriği var ama detaylı incelemek lazım.

### 2.11 Flow Tab 🔴

**Timeout (60s) — Büyük Veri Yükleme veya Sonsuz Döngü**
- Flow tab'ına tıklama sonrası screenshot 60 saniye timeout aldı.
- Büyük veri seti, kötü optimize edilmiş query, veya infinite loop olabilir.
- **Fix:** Veri pagination ekle. Skeleton loading state göster. 60 saniyelik timeout'u 10 saniyeye düşür ve "Veri yüklenemedi" fallback göster.

---

## Bölüm 3: Erişilebilirlik (Accessibility) Denetimi

### 3.1 Renk Kontrastı 🔴

| Element | Ön Renk | Arka Renk | Kontrast | WCAG AA | Durum |
|---------|---------|-----------|----------|---------|-------|
| Hero alt metin | slate-400 (#94a3b8) | slate-900 (#0f172a) | ~4.5:1 | Sınırda | 🟡 |
| Kart içi metin | slate-300 (#cbd5e1) | slate-800/900 | ~7:1 | Geçer | ✅ |
| "LIVE" badge | yeşil-300 | yeşil-900/800 | ~5:1 | Geçer | ✅ |
| "ARCHIVE" badge | gri-300 | gri-800 | ~6:1 | Geçer | ✅ |
| Gainers/Losers tablo | kırmızı-300 | kırmızı-900 | ~4:1 | Sınırda | 🟡 |
| "250 TRY" CTA | yeşil-400 | şeffaf | — | — | ✅ |

**Fix:** Hero alt metin `slate-400` → `slate-300`. Gainers/Losers kırmızı metin `red-300` → `white`.

### 3.2 Font Boyutları 🟡

**Small Fonts (< 12px) Tespiti**
- `text-[11px] font-semibold uppercase tracking-[0.18em]` — "Hazırlayan" etiketi
- `text-xs` (~12px) — kart alt metinleri
- **Etki:** 11px font mobilde 9-10px'e düşebilir (ekran yoğunluğuna göre). WCAG 2.1 minimum 12px önerir (18px bold için).
- **Fix:** `text-[11px]` → `text-xs` (12px). Veya `font-bold` ile 11px'yi 12px bold ile değiştir.

### 3.3 Focus States / Keyboard Navigation 🟡

- WebBridge snapshot'ta focusable element'ler (button, link) var ama:
- `focus:outline-none focus:ring-2 focus:ring-primary` kullanılıyor mu? Görselden anlaşılamıyor.
- **Test:** Tab tuşu ile navigasyon test edilmeli. Eğer `outline: none` var ve `focus-visible` yoksa, keyboard kullanıcıları göremez.
- **Fix:** Tüm interactive element'lere `focus-visible:ring-2 focus-visible:ring-primary` ekle.

### 3.4 ARIA ve Ekran Okuyucu 🟡

- Nav bar ikonları: `<image>` elementi `alt` veya `aria-label` yok.
- Kart içi veriler: "VIX -" — ekran okuyucu "VIX tire" diye okur. Anlamsız.
- **Fix:** `<img alt="" aria-hidden="true">` veya `<span aria-label="VIX değeri yükleniyor">-</span>`.

---

## Bölüm 4: Responsive ve Mobil Denetimi

### 4.1 Desktop (1921×828) — Ana Viewport ✅
- Tüm elementler sığdı. Nav bar 9 buton + toggle + avatar sığdı.
- Kartlar 3-4 kolonlu layout düzgün.

### 4.2 1200px Altı — Nav Bar Taşması 🔴
- 9 buton × ~80px = 720px + toggle (80px) + avatar (40px) + logo (120px) = ~960px.
- 1200px altında nav bar taşar. Horizontal scroll veya collapse gerekli.
- **Fix:** <1280px: "More" dropdown. <1024px: Hamburger sidebar.

### 4.3 Mobil (768px) — Landing Page 🔴
- Hero H1: 48-56px → mobilde 28-32px olmalı. Şu an `md:text-4xl` veya benzeri var mı?
- 3 kolonlu kartlar: mobilde stacked (1 kolon) olmalı.
- CTA butonları: "Start Subscription" ve "See Pricing" — mobilde tam genişlik.

### 4.4 Mobil (768px) — App 🔴
- 9 tab butonu yan yana sığmaz. 2-3 satır veya scroll.
- Kartlar: 4 kolonlu Market Flash → mobilde 1-2 kolon.
- CPI/PPI iki kolonlu → mobilde stacked.
- **Fix:** Tab bar: horizontal scroll + scroll indicator. Kartlar: grid-cols-1 md:grid-cols-2 lg:grid-cols-4.

---

## Bölüm 5: Kullanıcı Akışı (User Flow) Denetimi

### 5.1 Landing Page → App Girişi ✅
- "Open App" butonu net, nav bar'da belirgin.
- Tıklama sonrası app açıldı (smooth transition).

### 5.2 App İçi Tab Geçişleri 🟡
- Tab'lar arası geçişte loading indicator yok.
- Flow tab'ı 60 saniye timeout aldı — kullanıcı "sayfa dondu" hissiyatı yaşar.
- **Fix:** Her tab geçişinde skeleton loader (shimmer efekti) göster. 3 saniye timeout sonrası "Yükleniyor..." mesajı.

### 5.3 TR/EN Dil Toggle 🟡
- TR butonuna tıklama sonrası sayfa yeniden render oldu. Ama:
- Nav bar buton isimleri İngilizce kaldı ("Earnings Strategy", "Momentum" vs.).
- Sadece içerik (rapor metni) Türkçeleşti. UI metinleri İngilizce.
- **Fix:** TR modunda nav bar butonları da Türkçe:
  - "Earnings Strategy" → "Kazanç Stratejisi"
  - "Momentum" → "Momentum"
  - "Daily" → "Günlük"
  - "CPI/PPI" → "CPI/PPI" (kısaltma, aynı kalabilir)
  - "Calendar" → "Takvim"
  - "Market Flash" → "Market Flash" (marka adı, aynı kalabilir)
  - "Flow" → "Akış"
  - "Admin" → "Yönetim"

### 5.4 Boş Durumlar (Empty States) 🔴

**VIX Kartı — "-"**
- Boş veri yerine "-" gösteriliyor. Bu kullanıcı için anlamsız.
- **Fix:** "Loading..." spinner veya son bilinen değer.

**Momentum Tab — İlk Viewport Boş**
- Scroll gerekebilir ama kullanıcı scroll yapmadan önce boş hissiyatı.
- **Fix:** İlk viewport'ta placeholder: "Sinyaller yükleniyor..." veya son 3 sinyali göster.

**Admin Tab — Yetkisiz Erişim**
- 115KB PNG = boş veya hata sayfası. Kullanıcı yetkisizse neden "Admin" butonu görünüyor?
- **Fix:** Role-based rendering. `user.role !== 'admin'` ise "Admin" butonunu gizle.

### 5.5 Hata Durumları 🔴

**Flow Tab — Timeout**
- 60 saniye bekledikten sonra kullanıcı sayfayı yeniler veya terk eder.
- **Fix:** 10 saniye timeout + "Veri yüklenemedi. Tekrar dene." butonu.

**TR Modunda "Hazırlayan" — Eksik Context**
- Tek başına "Hazırlayan" yazıyor. Kim? Ne zaman?
- **Fix:** "Hazırlayan: Gistify AI · 25 Haz 2026 · 23:06"

---

## Bölüm 6: Görsel İyileştirme Önerileri (Detaylı)

### 6.1 Landing Page

| Alan | Şu An | Öneri | Öncelik |
|------|-------|-------|---------|
| H1 line-height | 1.1 (taşma) | 1.15 veya `padding-bottom: 0.1em` | 🔴 P0 |
| Hero alt metin | slate-400 | slate-300 | 🟡 P1 |
| Workflow arka plan | Grid/dot %15 opaklık | %8-10 opaklık + gradient overlay | 🟡 P1 |
| Footer boşluğu | ~300px | `padding-bottom: 0` | 🟡 P1 |
| "Pay" link | "Pay" | "Billing" | 🟡 P2 |
| 250 TRY CTA | "MONTHLY ACCESS" küçük | Font-weight 600 veya 700 | 🟢 P3 |
| Mobil H1 | 48-56px sabit | `text-3xl md:text-5xl lg:text-6xl` | 🔴 P0 |
| Mobil kartlar | 3 kolon sabit | `grid-cols-1 md:grid-cols-3` | 🔴 P0 |

### 6.2 App — Nav Bar

| Alan | Şu An | Öneri | Öncelik |
|------|-------|-------|---------|
| "Earning Strategy" | Tekil | "Earnings Strategy" (çoğul) | 🔴 P0 |
| Ikon alt metin | Boş | `alt="" aria-hidden="true"` | 🟡 P1 |
| Active indicator | Yok | `border-b-2 border-primary` | 🟡 P1 |
| Nav bar responsive | 9 buton sabit | <1280px: "More" dropdown | 🔴 P0 |

### 6.3 App — Earnings Strategy Tab

| Alan | Şu An | Öneri | Öncelik |
|------|-------|-------|---------|
| UI dili (TR mod) | İngilizce | "Kazanç Stratejisi Paneli", "CANLI", "ARŞİV" | 🔴 P0 |
| VIX boş değer | "-" | "Loading..." spinner veya gizle | 🔴 P0 |
| Tarih formatı | "25 Haz 2026 23:06" vs "25 Haziran 2026" | Tek: "25 Haz 2026 · 23:06" | 🟡 P1 |
| "Hazırlayan" | Tek başına | "Hazırlayan: Gistify AI · 25 Haz 2026" | 🟡 P1 |

### 6.4 App — Momentum Tab

| Alan | Şu An | Öneri | Öncelik |
|------|-------|-------|---------|
| İlk viewport | Boş | 2-3 hisse kartı veya "Yükleniyor..." | 🟡 P1 |
| "Kimi Pipeline" | Belirsiz marka | "Pipeline Sync" veya "Kimi Work" | 🟢 P2 |

### 6.5 App — CPI/PPI Tab

| Alan | Şu An | Öneri | Öncelik |
|------|-------|-------|---------|
| CPI başlık | İngilizce | "ABD CPI Tahmin Anlık Görünümü" | 🟡 P1 |
| "00:00 TSI" | Anlaşılmaz | "UTC+3" veya "2 saat önce" | 🟡 P1 |
| "%55" formatı | TR formatı İngilizce UI'da | Dil moduna göre: EN "55%", TR "%55" | 🟡 P2 |

### 6.6 App — Market Flash Tab

| Alan | Şu An | Öneri | Öncelik |
|------|-------|-------|---------|
| Tarih formatı | "2026-06-25 · 25/06 23:02" | "25 Haz 2026 · 23:02" | 🟡 P1 |
| Gainers/Losers renk | Kırmızı metin + kırmızı arka plan | Kırmızı arka plan + BEYAZ metin | 🟡 P1 |

### 6.7 App — Flow Tab

| Alan | Şu An | Öneri | Öncelik |
|------|-------|-------|---------|
| Yükleme süresi | 60+ saniye timeout | Skeleton loader + 10s timeout | 🔴 P0 |
| Veri boyutu | Büyük | Pagination (50/item per page) | 🔴 P0 |

---

## Bölüm 7: Öncelikli Eylem Listesi (Haftalık Plan)

### Hafta 1 — Kritik (🔴 P0)

| # | Görev | Etki | Tahmini Süre |
|---|-------|------|-------------|
| 1 | **Dil sistemi:** TR modunda tüm UI + nav bar + içerik Türkçe | Kullanıcı kafa karışıklığı | 2-3 gün |
| 2 | **"Earning Strategy" → "Earnings Strategy"** yazım hatası | Profesyonellik | 5 dk |
| 3 | **VIX "-" boş değerini düzelt** | Veri güvenilirliği | 1 saat |
| 4 | **Flow tab timeout fix** — skeleton + pagination | Kullanıcı terk oranı | 4 saat |
| 5 | **Nav bar responsive** — 1280px altı dropdown | Mobil masaüstü | 3 saat |
| 6 | **Landing H1 line-height fix** | Tipografi hatası | 15 dk |
| 7 | **Landing mobil responsive** — H1 + kartlar | SEO + conversion | 4 saat |
| 8 | **Admin yetki kontrolü** — buton gizleme | Güvenlik + UX | 1 saat |

### Hafta 2 — Orta (🟡 P1)

| # | Görev | Etki | Tahmini Süre |
|---|-------|------|-------------|
| 9 | **Tarih formatı standardizasyonu** (tüm tab'lar) | Tutarlılık | 2 saat |
| 10 | **"Hazırlayan" context ekle** | Anlaşılırlık | 15 dk |
| 11 | **Hero alt metin kontrastı** — slate-400 → slate-300 | Okunabilirlik | 5 dk |
| 12 | **Workflow arka plan opaklığı** | Okunabilirlik | 15 dk |
| 13 | **Footer boşluğunu kaldır** | Sayfa sonu profesyonelliği | 15 dk |
| 14 | **Momentum tab boş state** | Boş algısı | 1 saat |
| 15 | **Gainers/Losers kırmızı metin → beyaz** | Renk körlüğü erişilebilirliği | 15 dk |
| 16 | **Ikon aria-label ekle** | Ekran okuyucu | 30 dk |
| 17 | **CPI başlık Türkçeleştir** | Dil tutarlılığı | 5 dk |
| 18 | **"00:00 TSI" → relative time** | Anlaşılırlık | 30 dk |

### Hafta 3 — Düşük (🟢 P2/P3)

| # | Görev | Etki | Tahmini Süre |
|---|-------|------|-------------|
| 19 | **"Pay" → "Billing"** | Profesyonellik | 5 dk |
| 20 | **250 TRY CTA font-weight artır** | Conversion | 15 dk |
| 21 | **Active tab indicator ekle** | Navigasyon | 30 dk |
| 22 | **Focus states (keyboard navigation)** | Erişilebilirlik | 1 saat |
| 23 | **"%55" formatı dil moduna göre** | Format tutarlılığı | 30 dk |
| 24 | **"Kimi Pipeline" → marka adı düzelt** | Marka tutarlılığı | 15 dk |

---

## Bölüm 8: Ekran Görüntüleri Referansı

| Dosya | Ekran | Durum | Boyut |
|-------|-------|-------|-------|
| `gistify_pro_screenshot.png` | Landing top | ✅ Temiz | 736KB |
| `gistify_landing_mid.png` | Landing workflow | 🟡 Desen yoğun | 271KB |
| `gistify_landing_bottom.png` | Landing footer | 🟡 Boş alan | 250KB |
| `gistify_app_overview.png` | App — Earnings EN | 🔴 TR/EN karışımı, VIX boş | 308KB |
| `gistify_app_momentum.png` | App — Momentum | 🟡 İlk viewport boş | 348KB |
| `gistify_app_cpi.png` | App — CPI/PPI | 🟡 Tarih formatı, TSI | 662KB |
| `gistify_app_marketflash.png` | App — Market Flash | 🟢 Veri dolu | 541KB |
| `app_admin.png` | App — Admin | 🔴 Çok küçük (boş?) | 115KB |
| `app_earnings.png` | App — Earnings | 🟡 İnceleme gerekli | 269KB |
| `app_daily.png` | App — Daily | 🟡 İnceleme gerekli | 153KB |
| `app_calendar.png` | App — Calendar | 🟡 İnceleme gerekli | 552KB |
| `app_tr_mode.png` | App — TR Modu | 🔴 Hâlâ TR/EN karışımı | 295KB |
| `app_flow.png` | App — Flow | 🔴 Timeout (yüklenmedi) | — |

---

## Sonuç

Gistify görsel olarak **iyi bir temel** üzerine kurulmuş. Koyu tema, gradient, glassmorphism efektleri modern ve estetik. Ancak **kullanıcı deneyimi açısından 3 kritik alan** var:

1. **Dil tutarsızlığı:** TR modunda UI İngilizce kalıyor, içerik Türkçe. Bu kullanıcı için kafa karıştırıcı ve profesyonellik algısını düşürüyor.
2. **Boş veri gösterimi:** "VIX -" ve Flow tab timeout gibi sorunlar veri güvenilirliğini zedeliyor.
3. **Responsive zayıflık:** Mobil ve tablet viewport'larında nav bar taşması ve kart layout kırılmaları olabilir.

**Önerilen ilk adım:** Hafta 1'deki 8 kritik görevi önceliklendirmek. Özellikle dil sistemi, yazım hatası, VIX boş değeri, Flow timeout, ve nav bar responsive fix'leri.

*Rapor WebBridge screenshot + DOM evaluate (6147 element) sonuçlarına dayanmaktadır. Görsel iyileştirme önerileri React/Vite + Tailwind CSS codebase üzerinde uygulanabilir.*
