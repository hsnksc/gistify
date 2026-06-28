# Gistify Sistem Denetim Raporu

> **Denetim Tarihi:** 2026-06-25  
> **Denetim Kapsamı:** Local workspace dosya yapısı + gistify.pro WebBridge UI/UX denetimi  
> **Denetim Yöntemi:** Otomatik config/JSON parser + WebBridge DOM evaluate (empty/null/overflow tespiti) + Screenshot görsel analizi

---

## Özet

Gistify sistemi genel olarak **işlevsel** ancak **kritik yapılandırma hataları**, **güvenlik riskleri** ve **deploy tutarsızlıkları** mevcut. Web arayüzü (landing page) temiz ve boş/null değer içermiyor, fakat küçük bir overflow sorunu ve eksik public asset tespit edildi. Local workspace'de 17+ boş API key, plaintext secret saklama, npm/pnpm mismatch ve güncel olmayan sinyal verisi gibi sorunlar var.

| Kategori | Sayı | Risk Seviyesi |
|----------|------|---------------|
| Kritik | 4 | 🔴 Yüksek |
| Uyarı | 8 | 🟡 Orta |
| Bilgi | 4 | 🟢 Düşük |

---

## 1. Kritik Bulgular (🔴)

### 1.1 `client/public/midas_signals.json` EKSİK
- **Dosya:** `client/public/midas_signals.json`  
- **Durum:** Bulunamadı (`FILE_NOT_FOUND`)  
- **Etki:** Eğer Gistify frontend'i static deploy üzerinden (Vite build + `dist/public`) midas sinyallerini `client/public/midas_signals.json` üzerinden çekiyorsa, **deploy edilmiş sitede Midas sinyalleri gösterilemez.**  
- **Öneri:** `midas_signals.json` (root dizindeki güncel dosya) build öncesi `client/public/` veya `dist/public/` dizinine kopyalanmalı. `midas-pipeline-sync` skill'indeki sync adımı çalışıyor mu kontrol edilmeli.

### 1.2 `.env.example` — 17+ Boş API Key/Secret Placeholder
- **Boş alanlar:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `REPORT_ADMIN_SECRET`, `FMP_API_KEY`, `OPENAI_API_KEY`, `SUBSCRIBED_EMAILS`, `ELITE_EMAILS`, `PADDLE_API_KEY`, `PADDLE_CLIENT_TOKEN`, `PADDLE_PRODUCT_ID`, `PADDLE_PRICE_ID`, `PADDLE_WEBHOOK_SECRET`, `VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID`, `VITE_SCANNER_MASSIVE_API_KEY`, `VITE_SCANNER_TWELVEDATA_API_KEY`, `VITE_SCANNER_ALPHAVANTAGE_API_KEY`  
- **Etki:** Prod ortamında `.env` dosyası bu değerlerle doldurulmazsa; Google OAuth, Paddle ödeme, FMP data feed, OpenAI image generation, scanner fallback provider'lar, analytics **tamamen çalışmaz.**  
- **Öneri:** Prod `.env` dosyasının doldurulduğu manual bir checklist oluşturulmalı. `SUBSCRIBED_EMAILS` ve `ELITE_EMAILS` fallback mekanizması çalışıyor mu test edilmeli.

### 1.3 `.project-config.json` — Plaintext Secret Saklama (Güvenlik Riski)
- **Bulgu:** `secrets` objesi içinde `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `SESSION_TOKEN`, `JWT_SECRET`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_KEY` gibi hassas credential'lar **plaintext** olarak saklanıyor.  
- **Etki:** Repo public/private fark etmeksizin, bu dosya commit edilirse veya leak olursa **credential compromise** riski yüksek. AWS session token zaten expired görünüyor (`expiration: 2026-05-21T23:38:12.000Z`) ama pattern riskli.  
- **Öneri:** `.project-config.json` `.gitignore`'a alınmalı veya secret'lar environment variable olarak externalize edilmeli. GitHub Actions `secrets` context'i kullanılmalı.

### 1.4 `deploy.yml` — npm/pnpm Mismatch + Build Tutarsızlığı
- **Bulgu:** Workflow'da `npm install` ve `npm run build` kullanılıyor ancak `package.json`da `packageManager: "pnpm@10.4.1"` tanımlı. Ayrıca `pnpm-lock.yaml` mevcut.  
- **Etki:** `npm install` `pnpm-lock.yaml`'ı ignore eder, bu da **dependency drift** ve tutarsız build'lere yol açabilir.  
- **Öneri:** `npm install` → `pnpm install --frozen-lockfile`, `npm run build` → `pnpm run build` olarak değiştirilmeli.

---

## 2. Uyarı Bulguları (🟡)

### 2.1 `package.json` — Yanlış Proje Adı
- **Bulgu:** `"name": "earnings_benchmark_report"` — bu Manus template adıyla kalmış.  
- **Öneri:** `"name": "gistify"` olarak güncellenmeli.

### 2.2 `template.json` — "Static Only" vs Backend Dosyası Çelişkisi
- **Bulgu:** Template `"capabilities": ["static"]` olarak tanımlı ancak `files` içinde `server/index.ts` (Express backend) bulunuyor.  
- **Etki:** Template metadata ile gerçek proje yapısı arasında çelişki. Static-only deployment platformlarında backend dosyası deploy edilmeyecek/hata verebilir.  
- **Öneri:** Template metadata veya proje yapısı gerçek dağıtım modeline göre güncellenmeli.

### 2.3 `midas_signals.json` — Güncel Olmayan Veri (Stale Data)
- **Bulgu:** Root `midas_signals.json` timestamp: `2026-06-22T12:58:30Z` — **3 gün önce**.  
- **Etki:** Eğer bu dosya prod'da kullanılıyorsa, momentum sinyalleri 3 günlük eski veriyi gösteriyor.  
- **Öneri:** `midas-pipeline-sync` cron job'u çalışıyor mu? `midas-pipeline` skill'i tekrar çalıştırılmalı.

### 2.4 `.env.example` — Mixed Line Endings (CRLF)
- **Bulgu:** Satır 8'de `` (lone carriage return) tespit edildi. Dosya Windows CRLF + Unix LF karışımı line ending kullanıyor.  
- **Etki:** Shell script'ler ve Linux deploy ortamında parsing hatalarına yol açabilir.  
- **Öneri:** `dos2unix` ile normalize edilmeli ve `.gitattributes` `* text=auto` tanımlı olmalı.

### 2.5 `.env.example` — `SESSION_SECRET=change-me` Weak Default
- **Bulgu:** Development ortamında bile `SESSION_SECRET` placeholder değeri kullanılıyor.  
- **Etki:** Eğer geliştirici unutup bu değeri prod'da kullanırsa, session hijacking riski.  
- **Öneri:** `SESSION_SECRET` generate eden bir setup script eklenebilir.

### 2.6 `deploy.yml` — Docker Volume Mount Path Kontrolü
- **Bulgu:** Docker run komutunda `-v /srv/gistify/midas:/data/midas:ro` mount ediliyor.  
- **Etki:** VPS'te `/srv/gistify/midas` dizini yoksa container başlatma hatası alınır.  
- **Öneri:** Deploy script'ine `mkdir -p /srv/gistify/midas` eklenmeli veya `midas_signals.json` build time'da image'a kopyalanmalı.

### 2.7 `deploy.yml` — Fallback Cascade Riski
- **Bulgu:** pm2 → docker → docker-compose → systemctl → pkill fallback zinciri var.  
- **Etki:** Hangi deployment modelinin kullanıldığı net değil. Her fallback farklı bir runtime ortamı başlatır, bu da state tutarsızlığına yol açabilir.  
- **Öneri:** Tek bir deployment modeli (örn: Docker + docker-compose) seçilmeli ve diğer fallback'ler kaldırılmalı.

### 2.8 Landing Page H1 — 9px Dikey Taşma (Minor Overflow)
- **Bulgu:** WebBridge evaluate: `H1` element `scrollH: 321` vs `clientH: 312` → 9px dikey taşma.  
- **Etki:** Görsel olarak muhtemelen farkedilmiyor ancak line-height/padding calculation hatası olabilir.  
- **Öneri:** H1 line-height veya padding değerleri kontrol edilmeli.

---

## 3. Bilgi / Pozitif Bulgular (🟢)

### 3.1 Landing Page UI — Temiz ve Boş Değer İçermiyor
- **WebBridge DOM audit:** `emptyElements: 0`, `nullTexts: 0`  
- **Sonuç:** `null`, `undefined`, `NaN`, `[object Object]` gibi hatalı metin render'ı yok. Landing page render pipeline sağlam.

### 3.2 CPI/PPI Forecast JSON'ları Yapısal Olarak Sağlam
- `cpi_forecast.json`: generatedAt `2026-06-25T06:22:26Z`, tüm scenario/setup/watchItems alanları dolu.  
- `ppi_forecast.json`: generatedAt `2026-06-25T06:28:08Z`, tüm alanlar dolu.  
- **Sonuç:** Forecast pipeline çalışıyor ve valid JSON üretiyor.

### 3.3 `tsconfig.json` ve `components.json` — Sağlam Yapılandırma
- Path aliases (`@/*`, `@shared/*`) doğru tanımlı.  
- shadcn/ui `components.json` schema ve alias yapılandırması standart.

### 3.4 Landing Page Görsel Analizi
- Screenshot analizi: Koyu tema, temiz tipografi, butonlar ve kartlar düzgün hizalı.  
- "PADDLE CHECKOUT LIVE" badge mevcut — Paddle entegrasyonu aktif görünüyor.  
- "250 TRY MONTHLY ACCESS" fiyatlandırma net.  
- 156 DOM element ile oldukça sade (minimalist) landing page.

---

## 4. Önerilen Eylem Listesi (Öncelik Sırası)

| Öncelik | Eylem | Dosya | Etki |
|---------|-------|-------|------|
| 🔴 P0 | `midas_signals.json`'ı `client/public/` veya build output'a sync et | `deploy.yml` / `client/public/` | Midas sinyalleri prod'da görünmez |
| 🔴 P0 | `.project-config.json` secret'larını `.gitignore`'a al veya env'e taşı | `.project-config.json` | Credential leak riski |
| 🔴 P0 | `deploy.yml` npm → pnpm değiştir | `.github/workflows/deploy.yml` | Dependency drift |
| 🔴 P0 | Prod `.env` boş alanlarını doldur | `.env` (prod) | Servis kesintisi |
| 🟡 P1 | `package.json` name alanını `gistify` yap | `package.json` | Brand tutarsızlığı |
| 🟡 P1 | Template metadata vs backend çelişkisini çöz | `template.json` | Deploy uyumsuzluğu |
| 🟡 P1 | `midas_signals.json` verisini güncelle | `midas-pipeline` skill | Stale data |
| 🟡 P1 | `.env.example` line ending normalize et | `.env.example` | Cross-platform parsing |
| 🟡 P2 | H1 overflow fix (line-height) | CSS / landing page component | UI polish |
| 🟡 P2 | Deploy fallback cascade'i tek modelle sınırla | `deploy.yml` | Runtime tutarsızlığı |
| 🟢 P3 | Landing page SEO element sayısını artır (meta, schema) | `index.html` | Arama motoru görünürlüğü |

---

## 5. Teknik Detaylar

### Denetim Araçları
- **WebBridge:** `snapshot` + `screenshot` + `evaluate` (DOM empty/null/overflow scan)  
- **Local Parser:** `Read` tool ile JSON/config dosyaları manuel parse edildi  
- **Tarih:** `2026-06-25` local timezone  

### WebBridge Snapshot Özeti
- **URL:** `https://gistify.pro/`  
- **Title:** `Gistify | Momentum, Earnings and Options Research Workspace | Gistify`  
- **Total DOM Elements:** 156  
- **Empty Text Nodes:** 0  
- **Null/Undefined/NaN Text:** 0  
- **Overflow Elements:** 1 (H1, 9px minor)  
- **Responsive Viewport:** 1921×828 (screenshot)  

---

*Rapor otomatik denetim sonuçlarına dayanmaktadır. Manuel kontrol gerektiren alanlar (Paddle checkout akışı, auth entegrasyonu, app içi tab'lar) için ek derinlemesine test önerilir.*
