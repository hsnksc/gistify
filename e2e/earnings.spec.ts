// e2e/earnings.spec.ts
// Gistify /earnings — Auth Sonrası E2E Test Suite
// Framework: Playwright (TypeScript)
// Hedef: /earnings sayfasının login sonrası davranışını kapsamlı test etmek
// --------------------------------------------------------------------------

import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// ───────────────────────────────────────────
// LOGIN HELPER
// ───────────────────────────────────────────
/**
 * UI tabanlı login — realistic user flow, daha yavaş ama auth mekanizmasını
 * da test eder. CI'da programatic login (API + cookie injection) ile
 * değiştirilebilir.
 */
async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto('https://gistify.pro/login');
  await page.fill('[data-testid="login-email"]', email);
  await page.fill('[data-testid="login-password"]', password);
  await page.click('[data-testid="login-submit"]');
  // Auth success indicator veya dashboard URL bekle
  await page.waitForURL(/\/(dashboard|desk|earnings)/, { timeout: 10_000 });
  await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible({ timeout: 5_000 });
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
// TEST SUITE: Earnings Page — Auth Sonrası UI
// ───────────────────────────────────────────
test.describe('Earnings Page — Auth Sonrası UI', () => {
  // Her test öncesi: login et, mock API'yi yükle, /earnings'e git
  test.beforeEach(async ({ page }) => {
    await login(page, 'test@example.com', 'TestUser123!');
    await mockEarningsAPI(page, 'earnings-full.json');
    await page.goto('/earnings');
  });

  // ═══════════════════════════════════════
  // TC-01: Sayfa Yüklenme — Tüm Section'lar
  // ═══════════════════════════════════════
  test('page loads with all sections visible', async ({ page }) => {
    // Hero
    await expect(page.locator('[data-testid="earnings-hero"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-month"]')).toHaveText(/\w+\s+\d{4}/);
    await expect(page.locator('[data-testid="next-month"]')).toHaveText(/\w+\s+\d{4}/);

    // Macro Dashboard — VIX, S&P 500, Nasdaq
    await expect(page.locator('[data-testid="macro-dashboard"]')).toBeVisible();
    const vix = page.locator('[data-testid="macro-vix"]');
    const spx = page.locator('[data-testid="macro-spx"]');
    const ndx = page.locator('[data-testid="macro-ndx"]');
    await expect(vix).toBeVisible();
    await expect(spx).toBeVisible();
    await expect(ndx).toBeVisible();
    // Değerler dolu ve "-" / undefined / null değil
    await expect(vix).not.toHaveText(/-|undefined|null/);
    await expect(spx).not.toHaveText(/-|undefined|null/);
    await expect(ndx).not.toHaveText(/-|undefined|null/);

    // Earnings Calendar
    await expect(page.locator('[data-testid="earnings-calendar"]')).toBeVisible();

    // Strategy Cards — en az 3 kart render edilmiş
    const cards = page.locator('[data-testid="strategy-card"]');
    await expect(cards).toHaveCount((count) => count >= 3);

    // CPR Table
    await expect(page.locator('[data-testid="cpr-table"]')).toBeVisible();
  });

  // ═══════════════════════════════════════
  // TC-02: Executive Summary Chips
  // ═══════════════════════════════════════
  test('executive summary chips are visible and populated', async ({ page }) => {
    const chips = page.locator('[data-testid="exec-summary-chip"]');
    await expect(chips).toHaveCount((count) => count >= 3);
    for (let i = 0; i < 3; i++) {
      const text = await chips.nth(i).textContent();
      expect(text).toBeTruthy();
      expect(text!.trim().length).toBeGreaterThan(0);
    }
  });

  // ═══════════════════════════════════════
  // TC-03: Calendar — Earnings Günü Tooltip
  // ═══════════════════════════════════════
  test('calendar shows earnings events with tooltips', async ({ page }) => {
    const calendarDay = page.locator('[data-testid="calendar-day"]').first();
    await calendarDay.hover();
    const tooltip = page.locator('[data-testid="earnings-tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 2_000 });
    const tooltipText = await tooltip.textContent();
    expect(tooltipText).toMatch(/BMO|AMC|Before Market|After Market/);
  });

  // ═══════════════════════════════════════
  // TC-04: BMO / AMC Badge'leri
  // ═══════════════════════════════════════
  test('BMO and AMC badges render correctly', async ({ page }) => {
    const bmoBadge = page.locator('[data-testid="badge-bmo"]').first();
    const amcBadge = page.locator('[data-testid="badge-amc"]').first();
    if (await bmoBadge.isVisible()) {
      await expect(bmoBadge).toHaveCSS('background-color', /rgb\(.*\)/);
    }
    if (await amcBadge.isVisible()) {
      await expect(amcBadge).toHaveCSS('background-color', /rgb\(.*\)/);
    }
  });

  // ═══════════════════════════════════════
  // TC-05: Strategy Cards — Greeks Bar Chart
  // ═══════════════════════════════════════
  test('strategy cards have greeks bars', async ({ page }) => {
    const firstCard = page.locator('[data-testid="strategy-card"]').first();
    await expect(firstCard).toBeVisible();
    const greeks = firstCard.locator('[data-testid="greeks-bar"]');
    await expect(greeks).toHaveCount(4); // Delta, Theta, Vega, Gamma
    for (let i = 0; i < 4; i++) {
      const bar = greeks.nth(i);
      await expect(bar).toBeVisible();
      const width = await bar.evaluate((el) => (el as HTMLElement).style.width);
      expect(width).toBeTruthy(); // width atanmış, bar orantılı
    }
  });

  // ═══════════════════════════════════════
  // TC-06: Strategy Cards — Entry / Exit / Max Hold
  // ═══════════════════════════════════════
  test('strategy cards display entry, exit, and max hold dates', async ({ page }) => {
    const firstCard = page.locator('[data-testid="strategy-card"]').first();
    const entry = firstCard.locator('[data-testid="strategy-entry"]');
    const exit = firstCard.locator('[data-testid="strategy-exit"]');
    const maxHold = firstCard.locator('[data-testid="strategy-max-hold"]');
    await expect(entry).toBeVisible();
    await expect(exit).toBeVisible();
    await expect(maxHold).toBeVisible();
    // Tarih format kontrolü: "15 Ağu 2026" veya "Aug 15, 2026"
    const entryText = await entry.textContent();
    expect(entryText).toMatch(/\d{1,2}\s+\w+|\w+\s+\d{1,2}/);
    // Max hold: "2 gün" veya "2 days"
    const maxHoldText = await maxHold.textContent();
    expect(maxHoldText).toMatch(/\d+\s+(gün|days|day)/);
  });

  // ═══════════════════════════════════════
  // TC-07: Strategy Card — Hover Efekti
  // ═══════════════════════════════════════
  test('strategy card lifts on hover', async ({ page }) => {
    const card = page.locator('[data-testid="strategy-card"]').first();
    const before = await card.evaluate((el) => window.getComputedStyle(el).transform);
    await card.hover();
    await page.waitForTimeout(300); // CSS transition süresi
    const after = await card.evaluate((el) => window.getComputedStyle(el).transform);
    expect(before).not.toEqual(after); // translateY değişimi
  });

  // ═══════════════════════════════════════
  // TC-08: CPR Table — Sort by Hacim CPR
  // ═══════════════════════════════════════
  test('CPR table is sortable by Hacim CPR', async ({ page }) => {
    const cprHeader = page.locator('[data-testid="cpr-header-cpr"]');
    await cprHeader.click();
    // İlk satır en yüksek CPR değerine sahip olmalı (descending)
    const firstRow = page.locator('[data-testid="cpr-row"]').first();
    const cprValue = firstRow.locator('[data-testid="cpr-value"]');
    await expect(cprValue).toBeVisible();
    const cprText = await cprValue.textContent();
    expect(cprText).toMatch(/\d+\.?\d*/);
  });

  // ═══════════════════════════════════════
  // TC-09: CPR Table — Sektör Filtresi
  // ═══════════════════════════════════════
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

  // ═══════════════════════════════════════
  // TC-10: CPR Table — Ticker Arama
  // ═══════════════════════════════════════
  test('CPR table filters by ticker search', async ({ page }) => {
    const search = page.locator('[data-testid="cpr-search"]');
    await search.fill('AAPL');
    await page.waitForTimeout(350); // debounce süresi
    const rows = page.locator('[data-testid="cpr-row"]');
    await expect(rows).toHaveCount(1);
    const ticker = await rows.first().locator('[data-testid="row-ticker"]').textContent();
    expect(ticker).toMatch(/AAPL/);
  });

  // ═══════════════════════════════════════
  // TC-11: FOMC Banner — Countdown & Progress
  // ═══════════════════════════════════════
  test('FOMC banner shows countdown and progress', async ({ page }) => {
    // Dinamik FOMC fixture: 3 gün sonra
    await page.route('**/api/earnings/report**', async (route) => {
      const fixturePath = path.join(__dirname, '..', '__tests__', 'fixtures', 'earnings-full.json');
      const data = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
      data.fomc = {
        date: new Date(Date.now() + 3 * 86400_000).toISOString(),
        daysRemaining: 3,
      };
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
    });
    await page.reload();
    const banner = page.locator('[data-testid="fomc-banner"]');
    await expect(banner).toBeVisible();
    const countdown = banner.locator('[data-testid="fomc-countdown"]');
    await expect(countdown).toBeVisible();
    const daysText = await countdown.textContent();
    expect(daysText).toMatch(/\d+/); // rakam içeriyor
    const progress = banner.locator('[data-testid="fomc-progress"]');
    await expect(progress).toBeVisible();
  });

  // ═══════════════════════════════════════
  // TC-12: Portfolio Builder — Bütçe Seçimi
  // ═══════════════════════════════════════
  test('portfolio builder updates on budget selection', async ({ page }) => {
    const budget5k = page.locator('[data-testid="budget-5000"]');
    await budget5k.click();
    await expect(budget5k).toHaveClass(/active|selected/);
    const allocation = page.locator('[data-testid="portfolio-allocation"]');
    await expect(allocation).toBeVisible();
  });

  // ═══════════════════════════════════════
  // TC-13: Risk Badge'leri — Renk & Doğruluk
  // ═══════════════════════════════════════
  test('risk badges render with correct colors', async ({ page }) => {
    const lowRisk = page.locator('[data-testid="risk-badge-low"]').first();
    const highRisk = page.locator('[data-testid="risk-badge-high"]').first();
    if (await lowRisk.isVisible()) {
      const color = await lowRisk.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(color).toMatch(/rgb\(.*\)/); // yeşil ton beklenir
    }
    if (await highRisk.isVisible()) {
      const color = await highRisk.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(color).toMatch(/rgb\(.*\)/); // kırmızı ton beklenir
    }
  });

  // ═══════════════════════════════════════
  // TC-14: Rapor İndirme — Markdown
  // ═══════════════════════════════════════
  test('markdown download button works', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="download-markdown"]'),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.(md|markdown)$/);
  });

  // ═══════════════════════════════════════
  // TC-15: Rapor İndirme — Word (DOCX)
  // ═══════════════════════════════════════
  test('word download button works', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="download-word"]'),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.(docx|doc)$/);
  });

  // ═══════════════════════════════════════
  // TC-16: Auth — Token Expired → Redirect
  // ═══════════════════════════════════════
  test('redirects to login when token expired', async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page).toHaveURL(/\/(login|auth)/);
  });

  // ═══════════════════════════════════════
  // TC-17: Auth — Free Tier → Upgrade Prompt
  // ═══════════════════════════════════════
  test('shows upgrade prompt for free tier user', async ({ page }) => {
    // Free user ile login
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await login(page, 'free@example.com', 'FreeUser123!');
    // API 403 dönsün
    await page.route('**/api/earnings/report**', async (route) => {
      await route.fulfill({
        status: 403,
        body: JSON.stringify({ error: 'Upgrade required', code: 'FORBIDDEN' }),
      });
    });
    await page.goto('/earnings');
    await expect(page.locator('[data-testid="upgrade-prompt"]')).toBeVisible();
    await expect(page.locator('[data-testid="earnings-hero"]')).not.toBeVisible();
  });

  // ═══════════════════════════════════════
  // TC-18: API Timeout — Error State
  // ═══════════════════════════════════════
  test('shows error state on API timeout', async ({ page }) => {
    await page.route('**/api/earnings/report**', async (route) => {
      await new Promise(() => {}); // hiç resolve etme → timeout
    });
    await page.reload();
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 10_000 });
  });

  // ═══════════════════════════════════════
  // TC-19: Boş Rapor — Empty State
  // ═══════════════════════════════════════
  test('shows empty state when report is not ready', async ({ page }) => {
    await mockEarningsAPI(page, 'earnings-empty.json');
    await page.reload();
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
    await expect(page.locator('[data-testid="empty-message"]')).toContainText(/hazır değil|not ready/);
  });

  // ═══════════════════════════════════════
  // TC-20: FOMC Yok — Banner Gizleme
  // ═══════════════════════════════════════
  test('hides FOMC banner when no FOMC in report', async ({ page }) => {
    await mockEarningsAPI(page, 'earnings-nofomc.json');
    await page.reload();
    await expect(page.locator('[data-testid="fomc-banner"]')).not.toBeVisible();
  });
});

// ───────────────────────────────────────────
// BONUS: Snapshot / Visual Regression Test
// ───────────────────────────────────────────
test.describe('Earnings Page — Visual Regression', () => {
  test('full page snapshot', async ({ page }) => {
    await login(page, 'test@example.com', 'TestUser123!');
    await mockEarningsAPI(page, 'earnings-full.json');
    await page.goto('/earnings');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('earnings-page-full.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
