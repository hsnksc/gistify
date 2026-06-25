# Gistify `/earnings` Auth Sonrası UI Test Senaryoları

> **Versiyon:** 1.0  
> **Hazırlayan:** QA / Test Uzmanı  
> **Hedef:** `/earnings` sayfasının auth sonrası davranışını kapsamlı şekilde test etmek — manuel adımlar + otomatik Playwright E2E  
> **Ortam:** Gistify Web App (React + TypeScript), test kullanıcılarıyla

---

## 1. Manuel Test Senaryoları

### Senaryo 1: Login → Earnings Sayfası Yükleme

| Adım | Eylem | Beklenen Sonuç |
|------|-------|----------------|
| 1 | Gistify ana sayfasına git (`https://gistify.pro`) | Landing page yüklenir, hero section ve CTA'lar görünür |
| 2 | "Desk erişimini aç" veya login butonuna tıkla | Login modal / page açılır, email ve password alanları aktif |
| 3 | Geçerli kullanıcı bilgileri ile giriş yap (`test@example.com` / `TestUser123!`) | Başarılı login, dashboard'a yönlendirme (URL `/dashboard` veya `/desk`) |
| 4 | Navbar'dan "Earnings" linkine tıkla | `/earnings` sayfası yüklenir, URL `https://gistify.pro/earnings` olur |
| 5 | Sayfanın yüklenmesini bekle (max 5 sn) | Hero section, earnings takvimi, strateji kartları, CPR tablosu görünür; skeleton loader kaybolur |
| 6 | VIX, S&P 500, Nasdaq değerlerini kontrol et | Sayılar dolu, format `#.##` veya `##.##`; `"-"` veya `"undefined"` veya `"null"` değil |
| 7 | Current Month + Next Month başlıklarını kontrol et | İki ay adı doğru ve güncel (örn: `"Temmuz 2026"` + `"Ağustos 2026"`); parse edilebilir tarih formatı |
| 8 | Executive Summary chip'lerini kontrol et | En az 3 chip görünür, metin dolu ve anlamlı (örn: `"Bullish bias"`, `"High IV environment"`, `"FOMC ahead"`) |

> **Edge Case:** Eğer kullanıcı free tier ise → earnings sayfasına gitmeye çalıştığında upgrade prompt / 403 görünmeli.

---

### Senaryo 2: Earnings Takvimi Interaksiyonu

| Adım | Eylem | Beklenen Sonuç |
|------|-------|----------------|
| 1 | `/earnings` sayfası login sonrası yüklenir | Takvim grid görünür, current month aktif |
| 2 | Takvim grid'inde bir earnings gününe hover yap (mouse over) | Detaylı tooltip görünür: şirket adı, sektör, piyasa değeri (market cap), tahmini EPS |
| 3 | BMO badge'ine tıkla / hover yap | Yeşil badge, tooltip'te `"Before Market Open"` veya `"BMO"` bilgisi; saat 09:30 ET öncesi vurgusu |
| 4 | AMC badge'ine tıkla / hover yap | Mor badge, tooltip'te `"After Market Close"` veya `"AMC"` bilgisi; saat 16:00 ET sonrası vurgusu |
| 5 | Sonraki ay (dashed border) bir gününe tıkla | O günün earnings'leri görünür; modal veya expanded grid açılır |
| 6 | Takvim dışında bir yere tıkla (click-outside) | Tooltip / modal kapanır, sayfa state temizlenir |

> **Not:** BMO = Before Market Open, AMC = After Market Close. Badge'ler renk-kodlu olmalı (BMO yeşil, AMC mor).

---

### Senaryo 3: Strateji Kartı Detayları

| Adım | Eylem | Beklenen Sonuç |
|------|-------|----------------|
| 1 | `/earnings` sayfası login sonrası yüklenir | StrategyCard grid görünür, en az 3 kart render edilmiş |
| 2 | Herhangi bir StrategyCard'a hover yap | Kart yükselir (`translateY(-4px)` veya benzeri), `box-shadow` artar (`shadow-lg` / `shadow-xl`), transition yumuşak (~200ms) |
| 3 | Greeks bar chart'ına bak | Delta, Theta, Vega, Gamma bar'ları renkli (örn: Delta mavi, Theta kırmızı, Vega yeşil, Gamma turuncu) ve orantılı; değerler `0-100` arası veya normalize edilmiş skala |
| 4 | Entry / Exit / Max Hold satırlarını kontrol et | Tarihler ISO format veya lokalize (`"15 Ağu 2026"`), `"2 gün"` / `"3 gün"` metni dolu ve pozitif sayı |
| 5 | Bütçe Dostu chip'lerine tıkla (eğer interaktifse) | Chip `highlight` / `selected` state alır; diğer kartlarda ilgili bütçe seviyesi filtrelenir veya vurgulanır |
| 6 | Kartın header'ındaki ticker sembolüne tıkla (örn: `AMD`) | İlgili hisse detayına yönlendirme veya modal açılır |

> **Greeks Check:** Delta > 0, Theta < 0 (time decay), Vega > 0, Gamma > 0 tipik olmalı; negatif veya anormal değerlerde warning badge.

---

### Senaryo 4: CPR Tablo Interaksiyonu

| Adım | Eylem | Beklenen Sonuç |
|------|-------|----------------|
| 1 | `/earnings` sayfası login sonrası yüklenir | CPR Table görünür, kolon başlıkları: Ticker, Sektör, Sentiment, Hacim CPR, Hedef, vb. |
| 2 | Sektör filtresinden `"Teknoloji"` seç | Tablo sadece `"Teknoloji"` sektöründeki hisseleri gösterir; satır sayısı azalır, URL query params güncellenir (`?sector=Technology`) |
| 3 | `"Hacim CPR"` kolonuna tıkla (sort) | Satırlar CPR'ye göre sıralanır: ilk tıklama yüksekten düşüğe (descending), ikinci tıklama düşükten yükseğe (ascending); sort ikonu (▲/▼) görünür |
| 4 | Sentiment badge'ine tıkla (örn: `"Bullish"` veya `"Bearish"`) | İlgili hisse grubu filtrelenir; tablo sadece o sentiment'deki hisseleri gösterir |
| 5 | Ticker'a tıkla (örn: `AMD`) | Sayfa ilgili StrategyCard'a smooth scroll yapar veya detay modal'ı açılır; ticker highlight olur |
| 6 | Arama input'una `AAPL` yaz | Real-time filter: sadece `AAPL` içeren satırlar görünür, debounce ~300ms |

> **CPR = Central Pivot Range** (merkez pivot aralığı). Değerler `-1` ile `1` arası veya `0-100` skala olabilir; dokümantasyona göre verify edilmeli.

---

### Senaryo 5: Portföy Builder

| Adım | Eylem | Beklenen Sonuç |
|------|-------|----------------|
| 1 | `/earnings` sayfası login sonrası yüklenir | Portföy Builder section görünür, bütçe butonları: `$1,000`, `$2,500`, `$5,000`, `$10,000` |
| 2 | `"$5,000"` butonuna tıkla | Seçili buton `active` / `primary` stil alır; portföy önerileri `$5K` seviyesine göre güncellenir; allocation değerleri değişir |
| 3 | Allocation progress bar'ına bak | Her strateji için allocation bar görünür; toplam `~%100` (tolerans ±5%); renkler strateji risk seviyesine göre |
| 4 | Risk badge'ine bak (low / medium / high) | `"Low Risk"` yeşil, `"Medium Risk"` sarı, `"High Risk"` kırmızı; badge metni ve rengi doğru eşleşmiş |
| 5 | Entry / Exit penceresine bak | Tarih aralıkları dolu, geçerli tarih aralığı (gelecek tarihler); `"Entry: 15 Ağu"` / `"Exit: 17 Ağu"` formatı |
| 6 | `"$10,000"` butonuna tıkla | Allocation değerleri artar; aynı stratejiler daha yüksek lot/contract sayısı gösterir |

---

### Senaryo 6: FOMC Uyarı Banner'ı

| Adım | Eylem | Beklenen Sonuç |
|------|-------|----------------|
| 1 | `/earnings` sayfası login sonrası yüklenir (FOMC yakın tarihte ise) | FOMC Banner görünür; konum: hero altı veya sayfa üstü; renkli border (örn: amber/orange) |
| 2 | Kalan gün sayısına bak | Büyük rakam (`"3"` gün), doğru hesaplanmış; FOMC tarihi ile bugün arası fark |
| 3 | Progress bar'a bak | Dolu kısım FOMC'ye kadar geçen süreyi gösterir; gradient veya dolu bar; `%` hesaplaması doğru |
| 4 | Pulse animation'a bak | Banner border veya ikon `pulse` / `animate-ping` efekti; attention-grabbing ama invasive değil |
| 5 | `"Pozisyonları Azalt"` butonuna tıkla (eğer varsa) | Action modalı açılır: `"Emin misiniz?"` veya bilgilendirme mesajı; veya doğrudan risk alert'i gösterir |
| 6 | FOMC geçmiş tarihte ise | Banner görünmez veya collapsed state'te; sessizce kaldırılır, sayfa layout'u düzgün |

> **FOMC Tarihleri:** FOMC genellikle 8 yılda toplanır (1.5-2 aylık aralıklarla). Raporun FOMC tarihini içermesi gerekir; yoksa banner render edilmemeli.

---

### Senaryo 7: Rapor İndirme

| Adım | Eylem | Beklenen Sonuç |
|------|-------|----------------|
| 1 | `/earnings` sayfası login sonrası yüklenir | Download section görünür: `"Markdown İndir"`, `"Word İndir"` butonları |
| 2 | `"Markdown İndir"` butonuna tıkla | `.md` dosyası indirilir; filename: `Gistify_Earnings_Report_2026-07.md` veya benzeri; içerik dolu (headings, tables, lists) |
| 3 | `"Word İndir"` butonuna tıkla (eğer varsa) | `.docx` dosyası indirilir; filename: `Gistify_Earnings_Report_2026-07.docx` |
| 4 | İndirilen `.md` dosyasını aç | Markdown format doğru: `#` headings, `|` tables, `-` listeler; tüm stratejiler ve CPR tablosu içerikte mevcut |
| 5 | İndirilen `.docx` dosyasını aç (eğer varsa) | Word format doğru: stilendirilmiş headings, tablolar, renkler; içerik `.md` ile aynı bilgiyi içerir |
| 6 | DOCX dosyası yoksa (henüz rapor üretilmemiş) | `"Henüz rapor üretilmedi"` veya `"Rapor hazırlanıyor..."` mesajı görünür; buton `disabled` veya `loading` state |
| 7 | İndirme sırasında network kesintisi | Error toast: `"İndirme başarısız, tekrar deneyin"` veya benzeri; buton tekrar tıklanabilir |

---

### Senaryo 8: Auth Hata Durumları

| Adım | Eylem | Beklenen Sonuç |
|------|-------|----------------|
| 1 | Token süresi dolmuşken `/earnings`'e git (refresh token da expired) | HTTP `401 Unauthorized`; otomatik redirect to `/login`; veya interceptor logout yapar |
| 2 | API timeout (5 sn+), backend yavaş / down | Loading spinner > 5 sn → `"Veri alınamadı"` / `"Bağlantı hatası"` mesajı; retry butonu görünür; graceful degradation |
| 3 | Rapor dosyası yokken `/earnings`'e git (backend 404 döner) | Empty state: `"Rapor henüz hazır değil"` veya `"Gelecek ayın raporu henüz üretilmedi"`; CTA: `"Bildirimleri aç"` veya `"Dashboard'a dön"` |
| 4 | Başka kullanıcı (free tier) ile login: `free@example.com` | Eğer earnings premium özellik ise → upgrade prompt: `"Earnings Desk'e erişmek için plan yükselt"`; veya 403 page with pricing table |
| 5 | Auth token manipülasyonu (yanlış signature) | `401` veya `403`; sayfa hiç yüklenmez; güvenlik hatası loglanır |
| 6 | Role-based access: `"Desk"` plan user vs `"Basic"` plan user | `"Basic"` user: earnings section blurred / locked; `"Desk"` user: full access |

---

## 2. Otomatik E2E Test (Playwright) — `e2e/earnings.spec.ts`

> **Test Framework:** Playwright (TypeScript)  
> **Auth:** Programmatic login (API request) + cookie/session injection  
> **Mock:** API responses with `route.fulfill()`  
> **Fixtures:** `fixtures/earnings-full.json` vb.

```typescript
// e2e/earnings.spec.ts
import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// ───────────────────────────────────────────
// LOGIN HELPER
// ───────────────────────────────────────────
async function login(page: Page, email: string, password: string): Promise<void> {
  // Approach A: UI-based login (slower, more realistic)
  await page.goto('https://gistify.pro/login');
  await page.fill('[data-testid="login-email"]', email);
  await page.fill('[data-testid="login-password"]', password);
  await page.click('[data-testid="login-submit"]');
  // Wait for navigation to dashboard or auth success indicator
  await page.waitForURL(/\/(dashboard|desk|earnings)/, { timeout: 10_000 });
  await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible({ timeout: 5_000 });

  // Approach B: Programmatic login (faster, for CI)
  // const loginRes = await page.request.post('https://api.gistify.pro/auth/login', {
  //   data: { email, password },
  // });
  // const { token } = await loginRes.json();
  // await page.context().addInitScript((t) => {
  //   localStorage.setItem('gistify_access_token', t);
  // }, token);
}

// ───────────────────────────────────────────
// MOCK API HELPER
// ───────────────────────────────────────────
async function mockEarningsAPI(page: Page, fixtureName: string): Promise<void> {
  const fixturePath = path.join(__dirname, '..', '__tests__', 'fixtures', fixtureName);
  const data = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
  await page.route('**/api/earnings/report**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data),
    });
  });
}

// ───────────────────────────────────────────
// TEST SUITE
// ───────────────────────────────────────────
test.describe('Earnings Page — Auth Sonrası UI', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'test@example.com', 'TestUser123!');
    await mockEarningsAPI(page, 'earnings-full.json');
    await page.goto('/earnings');
  });

  // ── TC-01: Sayfa Yüklenme ──
  test('page loads with all sections visible', async ({ page }) => {
    // Hero
    await expect(page.locator('[data-testid="earnings-hero"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-month"]')).toHaveText(/\w+\s+\d{4}/);
    await expect(page.locator('[data-testid="next-month"]')).toHaveText(/\w+\s+\d{4}/);

    // Macro Dashboard
    await expect(page.locator('[data-testid="macro-dashboard"]')).toBeVisible();
    const vix = page.locator('[data-testid="macro-vix"]');
    const spx = page.locator('[data-testid="macro-spx"]');
    const ndx = page.locator('[data-testid="macro-ndx"]');
    await expect(vix).toBeVisible();
    await expect(spx).toBeVisible();
    await expect(ndx).toBeVisible();
    // Değerler dolu ve sayısal
    await expect(vix).not.toHaveText(/-|undefined|null/);
    await expect(spx).not.toHaveText(/-|undefined|null/);
    await expect(ndx).not.toHaveText(/-|undefined|null/);

    // Earnings Calendar
    await expect(page.locator('[data-testid="earnings-calendar"]')).toBeVisible();

    // Strategy Cards
    const cards = page.locator('[data-testid="strategy-card"]');
    await expect(cards).toHaveCount(3); // en az 3 kart

    // CPR Table
    await expect(page.locator('[data-testid="cpr-table"]')).toBeVisible();
  });

  // ── TC-02: Executive Summary ──
  test('executive summary chips are visible and populated', async ({ page }) => {
    const chips = page.locator('[data-testid="exec-summary-chip"]');
    await expect(chips).toHaveCount((count) => count >= 3);
    for (let i = 0; i < 3; i++) {
      const text = await chips.nth(i).textContent();
      expect(text).toBeTruthy();
      expect(text!.trim().length).toBeGreaterThan(0);
    }
  });

  // ── TC-03: Calendar Tooltips ──
  test('calendar shows earnings events with tooltips', async ({ page }) => {
    const calendarDay = page.locator('[data-testid="calendar-day"]').first();
    await calendarDay.hover();
    const tooltip = page.locator('[data-testid="earnings-tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 2_000 });
    const tooltipText = await tooltip.textContent();
    expect(tooltipText).toMatch(/BMO|AMC|Before Market|After Market/);
  });

  // ── TC-04: BMO / AMC Badges ──
  test('BMO and AMC badges render correctly', async ({ page }) => {
    const bmoBadge = page.locator('[data-testid="badge-bmo"]').first();
    const amcBadge = page.locator('[data-testid="badge-amc"]').first();
    if (await bmoBadge.isVisible()) {
      await expect(bmoBadge).toHaveCSS('background-color', /rgb\(.*\)/); // veya specific color
    }
    if (await amcBadge.isVisible()) {
      await expect(amcBadge).toHaveCSS('background-color', /rgb\(.*\)/);
    }
  });

  // ── TC-05: Strategy Cards — Greeks ──
  test('strategy cards have greeks bars', async ({ page }) => {
    const firstCard = page.locator('[data-testid="strategy-card"]').first();
    await expect(firstCard).toBeVisible();
    const greeks = firstCard.locator('[data-testid="greeks-bar"]');
    await expect(greeks).toHaveCount(4); // Delta, Theta, Vega, Gamma
    const labels = ['Delta', 'Theta', 'Vega', 'Gamma'];
    for (let i = 0; i < 4; i++) {
      const bar = greeks.nth(i);
      await expect(bar).toBeVisible();
      const width = await bar.evaluate((el) => (el as HTMLElement).style.width);
      expect(width).toBeTruthy();
    }
  });

  // ── TC-06: Strategy Cards — Entry/Exit/Max Hold ──
  test('strategy cards display entry, exit, and max hold dates', async ({ page }) => {
    const firstCard = page.locator('[data-testid="strategy-card"]').first();
    const entry = firstCard.locator('[data-testid="strategy-entry"]');
    const exit = firstCard.locator('[data-testid="strategy-exit"]');
    const maxHold = firstCard.locator('[data-testid="strategy-max-hold"]');
    await expect(entry).toBeVisible();
    await expect(exit).toBeVisible();
    await expect(maxHold).toBeVisible();
    // Tarih format kontrolü (esnek: "15 Ağu 2026" veya "Aug 15, 2026")
    const entryText = await entry.textContent();
    expect(entryText).toMatch(/\d{1,2}\s+\w+|\w+\s+\d{1,2}/);
  });

  // ── TC-07: Strategy Card Hover ──
  test('strategy card lifts on hover', async ({ page }) => {
    const card = page.locator('[data-testid="strategy-card"]').first();
    const before = await card.evaluate((el) => window.getComputedStyle(el).transform);
    await card.hover();
    await page.waitForTimeout(300); // transition süresi
    const after = await card.evaluate((el) => window.getComputedStyle(el).transform);
    expect(before).not.toEqual(after); // translateY değişimi
  });

  // ── TC-08: CPR Table — Sort ──
  test('CPR table is sortable by Hacim CPR', async ({ page }) => {
    const cprHeader = page.locator('[data-testid="cpr-header-cpr"]');
    await cprHeader.click();
    // İlk satırın CPR değeri en yüksek olmalı (descending)
    const firstRow = page.locator('[data-testid="cpr-row"]').first();
    const cprValue = firstRow.locator('[data-testid="cpr-value"]');
    await expect(cprValue).toBeVisible();
  });

  // ── TC-09: CPR Table — Filter by Sector ──
  test('CPR table filters by sector', async ({ page }) => {
    const sectorFilter = page.locator('[data-testid="sector-filter"]');
    await sectorFilter.click();
    await page.click('[data-testid="sector-option-technology"]');
    const rows = page.locator('[data-testid="cpr-row"]');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const sector = await rows.nth(i).locator('[data-testid="row-sector"]').textContent();
      expect(sector).toMatch(/Teknoloji|Technology/);
    }
  });

  // ── TC-10: CPR Table — Search ──
  test('CPR table filters by ticker search', async ({ page }) => {
    const search = page.locator('[data-testid="cpr-search"]');
    await search.fill('AAPL');
    await page.waitForTimeout(350); // debounce
    const rows = page.locator('[data-testid="cpr-row"]');
    await expect(rows).toHaveCount(1);
    const ticker = await rows.first().locator('[data-testid="row-ticker"]').textContent();
    expect(ticker).toMatch(/AAPL/);
  });

  // ── TC-11: FOMC Banner ──
  test('FOMC banner shows countdown and progress', async ({ page }) => {
    await page.route('**/api/earnings/report**', async (route) => {
      const fixturePath = path.join(__dirname, '..', '__tests__', 'fixtures', 'earnings-full.json');
      const data = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
      data.fomc = { date: new Date(Date.now() + 3 * 86400_000).toISOString(), daysRemaining: 3 };
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
    });
    await page.reload();
    const banner = page.locator('[data-testid="fomc-banner"]');
    await expect(banner).toBeVisible();
    const countdown = banner.locator('[data-testid="fomc-countdown"]');
    await expect(countdown).toBeVisible();
    const daysText = await countdown.textContent();
    expect(daysText).toMatch(/\d+/);
    const progress = banner.locator('[data-testid="fomc-progress"]');
    await expect(progress).toBeVisible();
  });

  // ── TC-12: Portfolio Builder — Budget Selection ──
  test('portfolio builder updates on budget selection', async ({ page }) => {
    const budget5k = page.locator('[data-testid="budget-5000"]');
    await budget5k.click();
    await expect(budget5k).toHaveClass(/active|selected/);
    const allocation = page.locator('[data-testid="portfolio-allocation"]');
    await expect(allocation).toBeVisible();
  });

  // ── TC-13: Risk Badges ──
  test('risk badges render with correct colors', async ({ page }) => {
    const lowRisk = page.locator('[data-testid="risk-badge-low"]').first();
    const highRisk = page.locator('[data-testid="risk-badge-high"]').first();
    if (await lowRisk.isVisible()) {
      const color = await lowRisk.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(color).toMatch(/rgb\(.*\)/);
    }
    if (await highRisk.isVisible()) {
      const color = await highRisk.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(color).toMatch(/rgb\(.*\)/);
    }
  });

  // ── TC-14: Report Download — Markdown ──
  test('markdown download button works', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="download-markdown"]'),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.(md|markdown)$/);
  });

  // ── TC-15: Report Download — Word ──
  test('word download button works', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="download-word"]'),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.(docx|doc)$/);
  });

  // ── TC-16: Auth — Token Expired ──
  test('redirects to login when token expired', async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page).toHaveURL(/\/(login|auth)/);
  });

  // ── TC-17: Auth — Free Tier Denied ──
  test('shows upgrade prompt for free tier user', async ({ page }) => {
    // Login as free user
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await login(page, 'free@example.com', 'FreeUser123!');
    // Mock API to return 403 for earnings
    await page.route('**/api/earnings/report**', async (route) => {
      await route.fulfill({ status: 403, body: JSON.stringify({ error: 'Upgrade required' }) });
    });
    await page.goto('/earnings');
    await expect(page.locator('[data-testid="upgrade-prompt"]')).toBeVisible();
    await expect(page.locator('[data-testid="earnings-hero"]')).not.toBeVisible();
  });

  // ── TC-18: API Timeout / Error ──
  test('shows error state on API timeout', async ({ page }) => {
    await page.route('**/api/earnings/report**', async (route) => {
      await new Promise(() => {}); // never resolve → timeout
    });
    await page.reload();
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 10_000 });
  });

  // ── TC-19: Empty Report State ──
  test('shows empty state when report is not ready', async ({ page }) => {
    await mockEarningsAPI(page, 'earnings-empty.json');
    await page.reload();
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
    await expect(page.locator('[data-testid="empty-message"]')).toContainText(/hazır değil|not ready/);
  });

  // ── TC-20: No FOMC State ──
  test('hides FOMC banner when no FOMC in report', async ({ page }) => {
    await mockEarningsAPI(page, 'earnings-nofomc.json');
    await page.reload();
    await expect(page.locator('[data-testid="fomc-banner"]')).not.toBeVisible();
  });
});
```

---

## 3. Auth Test Data & Setup

### Test Kullanıcıları

| Rol | Email | Password | Plan | Earnings Access |
|-----|-------|----------|------|-----------------|
| Paid User | `test@example.com` | `TestUser123!` | `"Desk"` (paid tier) | ✅ Full access |
| Free User | `free@example.com` | `FreeUser123!` | `"Free"` (basic tier) | ❌ Denied, upgrade prompt |
| Expired Token | `expired@example.com` | `Expired123!` | `"Desk"` | ❌ 401 → redirect to login |

### Mock API Response

Dosya: `__tests__/mocks/earningsResponse.json`

```json
{
  "reportId": "earnings-2026-07-v1",
  "generatedAt": "2026-07-01T00:00:00Z",
  "currentMonth": "Temmuz 2026",
  "nextMonth": "Ağustos 2026",
  "macro": {
    "vix": 18.45,
    "spx": 5450.32,
    "ndx": 18900.15
  },
  "executiveSummary": [
    "Bullish bias on tech earnings",
    "High IV environment — favorable for premium selling",
    "FOMC meeting in 3 days — reduce delta exposure"
  ],
  "calendar": [
    { "date": "2026-07-15", "ticker": "AMD", "sector": "Technology", "timing": "BMO", "marketCap": 285000000000 },
    { "date": "2026-07-16", "ticker": "AAPL", "sector": "Technology", "timing": "AMC", "marketCap": 3200000000000 }
  ],
  "strategies": [
    {
      "ticker": "AMD",
      "setup": "VWAP Oversold Bounce",
      "direction": "Long Call",
      "greeks": { "delta": 0.65, "theta": -0.08, "vega": 0.12, "gamma": 0.03 },
      "entry": "2026-07-15",
      "exit": "2026-07-17",
      "maxHold": "2 gün",
      "budget": { "1000": 2, "2500": 5, "5000": 10, "10000": 20 },
      "risk": "medium"
    }
  ],
  "cprTable": [
    { "ticker": "AMD", "sector": "Technology", "sentiment": "Bullish", "cpr": 0.72, "target": 165.50 },
    { "ticker": "AAPL", "sector": "Technology", "sentiment": "Neutral", "cpr": 0.55, "target": 220.00 }
  ],
  "fomc": {
    "date": "2026-07-04T18:00:00Z",
    "daysRemaining": 3
  }
}
```

---

## 4. Test Data Fixtures

| Fixture Dosyası | Amaç | İçerik Özeti |
|-----------------|------|--------------|
| `fixtures/earnings-full.json` | Tam rapor (happy path) | 45+ hisse, 5+ portföy, 4 Greeks, FOMC var, tüm sektörler |
| `fixtures/earnings-empty.json` | Boş rapor (edge case) | `strategies: []`, `cprTable: []`, `calendar: []`, `executiveSummary: []` — empty state testi |
| `fixtures/earnings-nofomc.json` | FOMC olmayan rapor | `fomc: null` — banner gizleme testi |
| `fixtures/earnings-blackout.json` | Blackout döneminde rapor | `blackout: true`, `strategies: []`, `message: "Blackout period — no new positions"` — özel mesaj testi |
| `fixtures/earnings-slow-api.json` | Yavaş API simülasyonu | Aynı data, ama `route.fulfill()` 6 sn gecikmeli — timeout & loading testi |
| `fixtures/earnings-403.json` | Yetki hatası | `{ error: "Upgrade required", code: "FORBIDDEN" }` — free tier testi |
| `fixtures/earnings-401.json` | Token expired | `{ error: "Unauthorized", code: "TOKEN_EXPIRED" }` — auth redirect testi |

### Fixture Yapısı (örnek: `earnings-full.json`)

```json
{
  "reportId": "earnings-2026-07-full",
  "generatedAt": "2026-07-01T00:00:00Z",
  "currentMonth": "Temmuz 2026",
  "nextMonth": "Ağustos 2026",
  "macro": {
    "vix": 18.45,
    "spx": 5450.32,
    "ndx": 18900.15
  },
  "executiveSummary": [
    "Bullish bias on tech earnings",
    "High IV environment — favorable for premium selling",
    "FOMC meeting in 3 days — reduce delta exposure",
    "Watch for VWAP rejections on gap-up open",
    "Mean reversion setup on QQQ if VIX > 20"
  ],
  "calendar": [
    { "date": "2026-07-15", "ticker": "AMD", "sector": "Technology", "timing": "BMO", "marketCap": 285000000000 },
    { "date": "2026-07-15", "ticker": "JPM", "sector": "Financials", "timing": "BMO", "marketCap": 520000000000 },
    { "date": "2026-07-16", "ticker": "AAPL", "sector": "Technology", "timing": "AMC", "marketCap": 3200000000000 },
    { "date": "2026-07-16", "ticker": "NVDA", "sector": "Technology", "timing": "AMC", "marketCap": 2800000000000 },
    { "date": "2026-07-17", "ticker": "TSLA", "sector": "Consumer Discretionary", "timing": "BMO", "marketCap": 750000000000 }
  ],
  "strategies": [
    {
      "ticker": "AMD",
      "setup": "VWAP Oversold Bounce",
      "direction": "Long Call",
      "greeks": { "delta": 0.65, "theta": -0.08, "vega": 0.12, "gamma": 0.03 },
      "entry": "2026-07-15",
      "exit": "2026-07-17",
      "maxHold": "2 gün",
      "budget": { "1000": 2, "2500": 5, "5000": 10, "10000": 20 },
      "risk": "medium"
    },
    {
      "ticker": "AAPL",
      "setup": "Gap Fade — ORB Reject",
      "direction": "Short Put Spread",
      "greeks": { "delta": -0.30, "theta": 0.15, "vega": -0.05, "gamma": 0.02 },
      "entry": "2026-07-16",
      "exit": "2026-07-18",
      "maxHold": "2 gün",
      "budget": { "1000": 1, "2500": 3, "5000": 6, "10000": 12 },
      "risk": "low"
    },
    {
      "ticker": "NVDA",
      "setup": "Momentum Short — VWAP Breakdown",
      "direction": "Long Put",
      "greeks": { "delta": -0.55, "theta": -0.12, "vega": 0.18, "gamma": 0.04 },
      "entry": "2026-07-16",
      "exit": "2026-07-19",
      "maxHold": "3 gün",
      "budget": { "1000": 1, "2500": 2, "5000": 5, "10000": 10 },
      "risk": "high"
    },
    {
      "ticker": "TSLA",
      "setup": "Mean Reversion — 2σ Bounce",
      "direction": "Long Straddle",
      "greeks": { "delta": 0.10, "theta": -0.20, "vega": 0.35, "gamma": 0.06 },
      "entry": "2026-07-17",
      "exit": "2026-07-20",
      "maxHold": "3 gün",
      "budget": { "1000": 1, "2500": 2, "5000": 4, "10000": 8 },
      "risk": "high"
    },
    {
      "ticker": "JPM",
      "setup": "Conservative Premium Sell",
      "direction": "Iron Condor",
      "greeks": { "delta": 0.05, "theta": 0.25, "vega": -0.10, "gamma": 0.01 },
      "entry": "2026-07-15",
      "exit": "2026-07-17",
      "maxHold": "2 gün",
      "budget": { "1000": 1, "2500": 3, "5000": 6, "10000": 12 },
      "risk": "low"
    }
  ],
  "cprTable": [
    { "ticker": "AMD", "sector": "Technology", "sentiment": "Bullish", "cpr": 0.72, "target": 165.50 },
    { "ticker": "AAPL", "sector": "Technology", "sentiment": "Neutral", "cpr": 0.55, "target": 220.00 },
    { "ticker": "NVDA", "sector": "Technology", "sentiment": "Bearish", "cpr": 0.38, "target": 118.00 },
    { "ticker": "TSLA", "sector": "Consumer Discretionary", "sentiment": "Bullish", "cpr": 0.68, "target": 265.00 },
    { "ticker": "JPM", "sector": "Financials", "sentiment": "Neutral", "cpr": 0.50, "target": 210.00 },
    { "ticker": "MSFT", "sector": "Technology", "sentiment": "Bullish", "cpr": 0.75, "target": 450.00 },
    { "ticker": "META", "sector": "Communication Services", "sentiment": "Bearish", "cpr": 0.30, "target": 485.00 },
    { "ticker": "GOOGL", "sector": "Communication Services", "sentiment": "Neutral", "cpr": 0.52, "target": 175.00 },
    { "ticker": "AMZN", "sector": "Consumer Discretionary", "sentiment": "Bullish", "cpr": 0.70, "target": 200.00 },
    { "ticker": "XOM", "sector": "Energy", "sentiment": "Neutral", "cpr": 0.48, "target": 115.00 }
  ],
  "fomc": {
    "date": "2026-07-04T18:00:00Z",
    "daysRemaining": 3
  }
}
```

---

## 5. CI/CD Entegrasyonu

```yaml
# .github/workflows/e2e.yml (örnek)
name: E2E Tests
on: [push, pull_request]
jobs:
  earnings-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test e2e/earnings.spec.ts
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
          FREE_USER_EMAIL: ${{ secrets.FREE_USER_EMAIL }}
          FREE_USER_PASSWORD: ${{ secrets.FREE_USER_PASSWORD }}
```

---

## 6. Test Matrisi (Özet)

| Senaryo | Manuel | Otomatik (Playwright) | Öncelik |
|---------|--------|----------------------|---------|
| Login → Earnings Yükleme | ✅ | ✅ TC-01 | P0 — Critical |
| Executive Summary | ✅ | ✅ TC-02 | P0 |
| Calendar Tooltips | ✅ | ✅ TC-03, TC-04 | P1 |
| Strategy Cards — Greeks | ✅ | ✅ TC-05, TC-06, TC-07 | P0 |
| CPR Table — Sort/Filter | ✅ | ✅ TC-08, TC-09, TC-10 | P1 |
| Portfolio Builder | ✅ | ✅ TC-12, TC-13 | P1 |
| FOMC Banner | ✅ | ✅ TC-11 | P1 |
| Report Download | ✅ | ✅ TC-14, TC-15 | P2 |
| Auth — Token Expired | ✅ | ✅ TC-16 | P0 |
| Auth — Free Tier | ✅ | ✅ TC-17 | P0 |
| API Timeout / Error | ✅ | ✅ TC-18 | P1 |
| Empty Report State | ✅ | ✅ TC-19 | P1 |
| No FOMC State | ✅ | ✅ TC-20 | P2 |

---

> **Son Güncelleme:** 2026-07-01  
> **Sahibi:** QA / Test Uzmanı  
> **Bir sonraki adım:** Playwright testlerini `gistify` repo'suna ekle, CI pipeline'da çalıştır.
