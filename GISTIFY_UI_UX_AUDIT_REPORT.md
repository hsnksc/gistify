# Gistify UI/UX Görsel Denetim Raporu

> **Denetim Tarihi:** 2026-06-25  
> **Denetim Kapsamı:** gistify.pro landing page + app dashboard (8 tab)  
> **Denetim Yöntemi:** WebBridge screenshot + DOM evaluate + manuel görsel analiz  

---

## Özet

Gistify görsel olarak **koyu tema, temiz layout ve iyi hizalama** ile genel olarak başarılı. Ancak **dil tutarsızlığı (en/tr karışımı)**, **boş/eksik veri alanları**, **tarih-saat formatı tutarsızlıkları** ve **küçük görsel taşmalar** gibi sorunlar mevcut. Landing page ve app arasında **brand adı tutarsızlığı** da var.

| Kategori | Sayı | Önem |
|----------|------|------|
| Dil / İçerik | 7 | 🔴 Yüksek |
| Boş / Eksik Veri | 3 | 🟡 Orta |
| Görsel / Layout | 5 | 🟡 Orta |
| Format / Tutarlılık | 4 | 🟡 Orta |

---

## 1. Dil Tutarsızlıkları (TR/EN Karışımı) 🔴

### 1.1 App İçi UI İngilizce, İçerik Türkçe
- **Ekran:** Earning Strategy (App overview)
- **UI metinleri:** "Current earnings strategy panel", "Every uploaded earnings markdown file stays in the archive...", "LIVE", "ARCHIVE", "SELECTED REPORT", "REPORT DATE", "VIX", "LOADED", "CURRENT SNAPSHOT", "LIVE INDEX"
- **İçerik metinleri:** "25 Haziran 2026", "EarningsPlay v4 Metodolojisi | 32 Hisse | CPR Analizi | IV Rank Bazlı Stratejiler", "ORCL, CHWY, ADBE, FDX ve MU için earnings öncesi opsiyon stratejisi..."
- **Sorun:** UI tamamen İngilizce, kart içerikleri Türkçe. TR dil seçili değil (EN aktif) ama veri Türkçe üretiliyor. Bu **kafa karıştırıcı**.
- **Öneri:** 
  - **TR modunda:** UI metinleri de Türkçe olmalı ("Kazanç Stratejisi Paneli", "Canlı", "Arşiv", "Seçili Rapor").
  - **EN modunda:** İçerik de İngilizce olmalı ("June 25, 2026", "EarningsPlay v4 Methodology | 32 Stocks...").

### 1.2 CPI/PPI Tab — Başlık İngilizce, Açıklama Türkçe
- **Ekran:** CPI/PPI Forecast
- **Başlık:** "US CPI Forecast Snapshot — June 2026" (İngilizce)
- **Açıklama:** "Haziran CPI headline +0.10% m/m... Brent $72.56... PCE raporu bu hafta..." (Türkçe)
- **PPI kartı:** Başlık İngilizce, açıklama İngilizce (bu kart düzgün)
- **Öneri:** CPI kartı açıklaması da İngilizce olmalı veya başlık Türkçe olmalı. Tutarlılık şart.

### 1.3 Market Flash Tab — Tarih Formatı Karışık
- **Ekran:** Market Flash
- **Başlık:** "2026-06-25 · Last update 25/06 23:02"
- **Sorun:** ISO format (2026-06-25) ile DD/MM (25/06) karışık. Saat 24h format (23:02) İngilizce UI'da "11:02 PM" olmalı.
- **Öneri:** 
  - EN: "Jun 25, 2026 · Last updated 11:02 PM"
  - TR: "25 Haziran 2026 · Son güncelleme 23:02"

### 1.4 Landing Page — Tamamen İngilizce (Doğru)
- **Ekran:** gistify.pro/ (landing)
- **Durum:** Tüm metinler İngilizce. "Earnings intelligence, momentum scanning...", "One workspace for momentum scans..."
- **Karar:** Landing page global audience için İngilizce kalabilir. App içi TR kullanıcı için TR modunda Türkçeleştirilmeli.

### 1.5 "Earning Strategy" vs "Earnings Strategy" (Yazım Hatası)
- **Ekran:** Nav bar button
- **Bulgu:** Buton üzerinde "Earning Strategy" yazıyor. Doğrusu "Earnings Strategy" (çoğul).
- **Öneri:** "Earnings Strategy" olarak düzelt.

### 1.6 "00:00 TSI" — Saat Formatı Anlaşılmaz
- **Ekran:** CPI/PPI tab, Snapshot alanı
- **Bulgu:** "06/25, 09:22 AM" (İngilizce AM/PM) ve "Jun 25, 2026 · 00:00 TSI"
- **Sorun:** "TSI" nedir? UTC+3 (İstanbul) için mi? Kullanıcı anlamayabilir. Ayrıca "00:00" saat değeri yanlış görünüyor (gece yarısı deploy zamanı mı?).
- **Öneri:** "TSI" yerine "UTC+3" veya "İstanbul" yazılmalı. Veya zaman dilimi gösterilmeyip relative time ("2 saat önce") kullanılmalı.

### 1.7 "Pay" Link Footer'da
- **Ekran:** Landing page footer
- **Bulgu:** "Pricing, Terms, Privacy, Refund, Pay"
- **Sorun:** "Pay" çok genel ve acemi bir etiket. "Billing" veya "Payment" daha profesyonel.
- **Öneri:** "Pay" → "Billing" veya "Payment".

---

## 2. Boş / Eksik Veri Alanları 🟡

### 2.1 VIX Kartı — Boş Değer ("VIX -")
- **Ekran:** Earning Strategy app overview
- **Bulgu:** Sağ üst kartta "VIX" yazıyor ama değer yerine "-" (tire) var.
- **Sorun:** Veri yüklenmemiş veya hata alınmış. Kullanıcı "neden boş?" diye sorar.
- **Öneri:** "-" yerine "Loading..." spinner veya "VIX 18.80" (Market Flash'tan gelen değer) gösterilmeli. Veya veri yoksa kart gizlenmeli.

### 2.2 Momentum Tab — Kart İçeriği Görünmüyor
- **Ekran:** Momentum tab
- **Bulgu:** "MOMENTUM FLOW" başlığı altında kartlar var ama ekranda görünen viewport'ta içerik (hisse listesi) yok.
- **Sorun:** Scroll gerekebilir ama ilk görünüm boş görünüyor. "Kimi pipeline feed" verisi yüklenmemiş olabilir veya scroll gerekiyor.
- **Öneri:** İlk viewport'ta en az 2-3 hisse kartı gösterilmeli. Boş durum için "No active signals" veya loading state eklenmeli.

### 2.3 "A missing half automatically falls back to the pending panel"
- **Ekran:** CPI/PPI tab, Live Source panel
- **Bulgu:** "2/2 ready" altında "A missing half automatically falls back to the pending panel."
- **Sorun:** Bu metin teknik ve kafa karıştırıcı. "Missing half" ne demek? Kullanıcı anlamaz.
- **Öneri:** "Both CPI and PPI forecasts are ready. If one is missing, the panel shows the last available snapshot." olarak basitleştirilmeli.

---

## 3. Görsel / Layout Sorunları 🟡

### 3.1 Landing Page H1 — 9px Dikey Taşma
- **Ekran:** Landing page hero section
- **Bulgu:** H1 "One workspace for momentum scans, pre-earnings planning and options risk framing." scrollH: 321 vs clientH: 312 → 9px taşma.
- **Etki:** Görsel olarak minimal, ama line-height/padding calculation hatası.
- **Öneri:** `line-height: 1.1` veya `padding-bottom: 0` kontrol edilmeli. Font boyutu ile line-height arasındaki uyumsuzluk.

### 3.2 Landing Page Footer Altında Büyük Boş Alan
- **Ekran:** Landing page bottom
- **Bulgu:** Footer'dan sonra yaklaşık 200-300px boş alan var.
- **Sorun:** Sayfa sonunda gereksiz padding/margin. Kullanıcı scroll yaptığında "sayfa bitti mi?" hissiyatı veriyor.
- **Öneri:** Footer sonrası `padding-bottom` veya `min-height` değeri kontrol edilmeli.

### 3.3 Workflow Kartları — Arka Plan Deseni Çok Yoğun
- **Ekran:** Landing page orta bölüm (mid screenshot)
- **Bulgu:** Koyu mavi grid/dot pattern arka plan, beyaz metin üzerinde.
- **Sorun:** Desen yoğunluğu metin okunabilirliğini azaltıyor. Özellikle "Faster prep" ve "Closer to action" alt metinlerde.
- **Öneri:** Arka plan opaklığını %30'dan %15'e düşürmek veya gradient overlay eklemek.

### 3.4 "250 TRY" Yazı Tipi Boyutu
- **Ekran:** Landing page hero sağ kart
- **Bulgu:** "250" büyük, "TRY" ve "MONTHLY ACCESS" küçük.
- **Sorun:** "MONTHLY ACCESS" biraz küçük ve soluk. Fiyatlandırma CTA (call-to-action) önemli alan, daha belirgin olmalı.
- **Öneri:** "MONTHLY ACCESS" font-weight'ini artır veya karışık durum (büyük-küçük) yerine tek tip font size kullan.

### 3.5 Tab Bar Overflow — Küçük Ekranlar
- **Ekran:** App nav bar
- **Bulgu:** 9 buton (Earning Strategy, Admin, Earnings, Momentum, Daily, CPI/PPI, Calendar, Market Flash, Flow) + TR/EN toggle + avatar.
- **Sorun:** 1552px viewport'ta hepsi sığdı ama 1200px altında sığmayabilir. Scroll veya collapse gerekebilir.
- **Öneri:** <1200px ekranlarda nav bar'a horizontal scroll veya "More (...)" dropdown eklenmeli.

---

## 4. Format / Tutarlılık Sorunları 🟡

### 4.1 "Base case · %55" — Percentage Sembolü
- **Ekran:** CPI/PPI tab
- **Bulgu:** Türkçe format: "%55" (Türkçe) ama UI İngilizce. İngilizce'de "55%" olur.
- **Öneri:** EN modunda "55%", TR modunda "%55" formatı kullanılmalı. Şu an karışık.

### 4.2 Tarih Formatı Karışıklığı
- **Ekran:** App genel
- **Bulgu:** 
  - "25 Haz 2026 23:06" (Türkçe ay kısaltması)
  - "25 Haziran 2026" (Türkçe tam ay)
  - "Jul 11, 2026" (İngilizce)
  - "06/25, 09:22 AM" (İngilizce AM/PM)
  - "2026-06-25" (ISO)
- **Öneri:** Her mod için tek format:
  - **EN:** "Jun 25, 2026 · 11:06 PM"
  - **TR:** "25 Haz 2026 · 23:06"

### 4.3 Brand Adı Tutarsızlığı
- **Landing page:** "Gistify"
- **App title:** "Earnings Benchmark Raporu — Earnings Öncesi Derin Analiz" (eski proje adı)
- **Nav bar:** "Gistify | Earnings Intelligence"
- **Öneri:** App title meta tag'ini "Gistify — Earnings Intelligence & Momentum Workspace" olarak güncelle.

### 4.4 "Kimi Pipeline Sync" vs "Kimi conviction score"
- **Ekran:** CPI/PPI tab
- **Bulgu:** "Kimi Pipeline Sync" (başlık) ve "Kimi conviction score" (alt metin). "Kimi" büyük harfle, ama bu bir marka mı? Kafa karıştırıcı.
- **Öneri:** Eğer Kimi Work referansı ise "Kimi Work Pipeline Sync" olarak tam yazılmalı. Veya iç product name olarak "Pipeline Sync" yeterli.

---

## 5. Pozitif Bulgular (Yeşil) ✅

### 5.1 Landing Page — Temiz ve Profesyonel
- Koyu tema, gradient overlay, temiz tipografi.
- "PADDLE CHECKOUT LIVE" badge güven verici.
- 3 kolonlu kartlar hizalı ve okunabilir.
- 156 DOM element — minimalist ve hızlı.

### 5.2 App — Koyu Tema Konsistensi
- Tüm tab'lar aynı koyu tema paletini kullanıyor.
- Kartlar, border radius, shadow tutarlı.
- İkonlar (lucide-react) tutarlı.

### 5.3 Market Flash — Veri Dolu ve Canlı
- Gainers/Losers tablosu veri dolu, boş hücre yok.
- "Auto refresh on" butonu kullanıcı dostu.
- VIX, SPY, QQQ, IWM kartları net.

### 5.4 CPI/PPI — İki Kolonlu Layout Güzel
- CPI sol, PPI sağ — karşılaştırma kolay.
- Badge'ler ("COOLER THAN EXPECTED", "PIPELINE: SYNCED") informatif.
- Renk kodlaması (mavi CPI, turuncu PPI) iyi.

---

## 6. Önerilen Eylem Listesi (Öncelik Sırası)

| Öncelik | Eylem | Etki | Zaman |
|---------|-------|------|-------|
| 🔴 P0 | **Dil sistemi:** TR modunda UI + içerik tam Türkçe; EN modunda tam İngilizce | Kullanıcı kafa karışıklığı | 1-2 gün |
| 🔴 P0 | **"VIX -" boş değerini düzelt** — veri çekme veya loading state | Eksik veri algısı | 1 saat |
| 🔴 P0 | **"Earning Strategy" → "Earnings Strategy"** yazım hatası | Profesyonellik | 5 dk |
| 🟡 P1 | **Tarih formatı standardizasyonu** — EN/TR moduna göre | Tutarlılık | 2 saat |
| 🟡 P1 | **Landing page H1 taşma fix** (line-height) | UI polish | 30 dk |
| 🟡 P1 | **Landing page footer boşluğunu kaldır** | Sayfa sonu profesyonelliği | 30 dk |
| 🟡 P1 | **App title meta tag güncelle** ("Earnings Benchmark Raporu" → "Gistify") | SEO + brand | 15 dk |
| 🟡 P2 | **"00:00 TSI" → "UTC+3" veya relative time** | Anlaşılırlık | 1 saat |
| 🟡 P2 | **Workflow kart arka plan deseni opaklığını düşür** | Okunabilirlik | 30 dk |
| 🟡 P2 | **Nav bar responsive** (<1200px collapse/scroll) | Mobil masaüstü | 2 saat |
| 🟡 P2 | **"Pay" → "Billing" footer link** | Profesyonellik | 5 dk |
| 🟢 P3 | **"250 TRY" CTA font-weight artır** | Conversion | 15 dk |
| 🟢 P3 | **Momentum tab ilk viewport'ta hisse göster** | Boş algısı | 1 saat |

---

## 7. Ekran Görüntüleri (Referans)

| Dosya | Ekran | Açıklama |
|-------|-------|----------|
| `gistify_pro_screenshot.png` | Landing page top | Hero, CTA, feature kartları |
| `gistify_landing_mid.png` | Landing page mid | Workflow, value props |
| `gistify_landing_bottom.png` | Landing page bottom | Footer, nav links |
| `gistify_app_overview.png` | App — Earning Strategy | TR/EN karışımı, VIX boş |
| `gistify_app_momentum.png` | App — Momentum | İngilizce UI, boş kart bekleyiş |
| `gistify_app_cpi.png` | App — CPI/PPI | Dil karışımı, TSI saat formatı |
| `gistify_app_marketflash.png` | App — Market Flash | Tarih formatı karışık, veri dolu |

---

*Rapor WebBridge screenshot + DOM evaluate sonuçlarına dayanır. Görsel iyileştirme önerileri front-end (React/Vite) codebase üzerinde uygulanabilir.*
