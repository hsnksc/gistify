# GA4 KPI Dashboard — Gistify (gistify.pro)

> **Purpose:** This document defines the Google Analytics 4 (GA4) measurement strategy, custom event taxonomy, conversion funnel, custom dimensions, key reports, dashboard layout, and alert thresholds for gistify.pro — a premium earnings options and momentum trading platform serving Turkish and English-speaking traders.

---

## 1. Özet (Executive Summary)

Gistify'nin GA4 kurulumu, organik trafik dönüşümünü, kullanıcı etkileşimini (user engagement) ve monetizasyon hunisini ölçmek üzerine kuruludur. Dashboard; trafik kaynağı, dil, içerik türü ve kullanıcı segmenti bazında kırılımlarla segmentlendirilmiş KPI'leri tek ekranda sunar.

---

## 2. Custom Events (Özel Etkinlikler)

| Event Name | Trigger Condition | Data Layer Variable | Turkish Term |
|---|---|---|---|
| `page_view` | Automatically by GA4 / GTM | `page_location`, `page_title` | Sayfa Görüntüleme |
| `newsletter_subscribe` | Email form submission success | `email_source`, `form_location` | Bülten Aboneliği |
| `cta_click` | Any CTA button/link clicked | `cta_id`, `cta_text`, `cta_section` | CTA Tıklama |
| `pro_upgrade` | User clicks "Upgrade to Pro" | `plan_name`, `current_plan` | Pro Yükseltme |
| `scanner_use` | Scanner page loaded / scan initiated | `scanner_type`, `scan_params` | Tarayıcı Kullanımı |
| `earnings_view` | Earnings detail page loaded | `ticker`, `date`, `strategy_type` | Kazanç Görünümü |
| `strategy_view` | Strategy detail page loaded | `strategy_id`, `content_type` | Strateji Görünümü |
| `tool_use` | Any free tool (VWAP, CPR, etc.) used | `tool_name`, `input_params` | Araç Kullanımı |
| `purchase` | Checkout completed | `value`, `currency`, `plan_name` | Satın Alma |
| `signup` | Registration completed | `method`, `referrer` | Kayıt Olma |

### Event Parameters (Önerilen)

All custom events should push the following parameters where relevant:

```javascript
// Example dataLayer push for scanner_use
dataLayer.push({
  event: 'scanner_use',
  scanner_type: 'momentum_v4',      // 'momentum_v4', 'earnings_iv', 'midas'
  language: 'tr',                     // 'tr' | 'en'
  content_type: 'tool',               // 'pillar' | 'tool' | 'earnings' | 'strategy'
  traffic_source: 'organic',           // 'organic' | 'paid' | 'social' | 'direct'
  user_status: 'free'                 // 'free' | 'pro' | 'trial'
});
```

---

## 3. Conversion Funnel (Dönüşüm Hüneri)

### 3.1 Macro Funnel — Primary Flow

```
┌──────────────────┐
│   LANDING        │  ← Entry: organic search, social, direct
│   (Ziyaret)      │     Metric: Session starts, Landing pageviews
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   SIGNUP         │  ← Conversion 1: newsletter signup or account creation
│   (Kayıt)        │     Metric: signup rate = signups / sessions
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   SCANNER USE    │  ← Engagement milestone: free tool activation
│   (Tarayıcı)     │     Metric: scanner activation rate = scanner_use / signups
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   PRO UPGRADE    │  ← Conversion 2: intent to pay
│   (Pro Yükseltme)│     Metric: upgrade rate = pro_upgrade / scanner_use
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   PURCHASE       │  ← Conversion 3: revenue event
│   (Satın Alma)   │     Metric: checkout completion rate = purchase / pro_upgrade
└──────────────────┘
```

### 3.2 Funnel Metrics (KPI'ler)

| Funnel Stage | GA4 Event | Conversion Rate | Turkish Term |
|---|---|---|---|
| Landing → Signup | `signup` | Signup Rate | Kayıt Oranı |
| Signup → Scanner | `scanner_use` | Scanner Activation | Tarayıcı Aktivasyonu |
| Scanner → Pro Upgrade | `pro_upgrade` | Upgrade Intent | Yükseltme Niyeti |
| Pro Upgrade → Purchase | `purchase` | Checkout Completion | Ödeme Tamamlama |
| Landing → Purchase (Overall) | `purchase` | Overall Conversion | Genel Dönüşüm |

### 3.3 Funnel Time Analysis

- **Average time to signup** — Kayıt süresi (recommended: < 3 min)
- **Average time to first scanner use** — İlk tarayıcı kullanım süresi (recommended: < 1 day)
- **Average time to upgrade** — Yükseltme süresi (recommended: < 7 days)
- **Average time to purchase** — Satın alma süresi (recommended: < 3 days after upgrade click)

---

## 4. Custom Dimensions (Özel Boyutlar)

### 4.1 User-Scoped Dimensions

| Dimension Name | Scope | Values | Description |
|---|---|---|---|
| `language` | User | `tr`, `en` | Ana dil tercihi (primary language) |
| `user_plan` | User | `free`, `trial`, `pro_monthly`, `pro_annual` | Mevcut abonelik planı |
| `first_traffic_source` | User | `organic`, `paid`, `social`, `direct`, `referral` | İlk trafik kaynağı |

### 4.2 Event-Scoped Dimensions

| Dimension Name | Scope | Values | Description |
|---|---|---|---|
| `content_type` | Event | `pillar`, `tool`, `earnings`, `strategy`, `landing` | İçerik türü |
| `traffic_source` | Event | `organic`, `paid`, `social`, `direct`, `referral` | Trafik kaynağı (session-level) |
| `cta_section` | Event | `hero`, `nav`, `footer`, `sidebar`, `inline`, `popup` | CTA konumu |
| `strategy_type` | Event | `momentum`, `earnings_play`, `mean_reversion`, `iv_crush`, `vwap` | Strateji kategorisi |
| `scanner_type` | Event | `momentum_v4`, `earnings_iv`, `midas` | Tarayıcı türü |

### 4.3 GA4 Configuration Steps

1. Go to **Admin → Custom definitions → Create custom dimension**
2. Set scope (User or Event) and name
3. Map to the corresponding event parameter
4. Wait 24–48 hours for data population

---

## 5. Key Reports (Ana Raporlar)

### 5.1 Traffic Acquisition (Trafik Edinimi)

**Goal:** Understand where users come from and which channels convert.

| Metric | Definition | Turkish Term | Target |
|---|---|---|---|
| Sessions | Total sessions | Oturum | Growth 10% WoW |
| Users | Unique users | Kullanıcı | Growth 8% WoW |
| Engagement Rate | Engaged sessions / Total sessions | Etkileşim Oranı | > 60% |
| New Users | First-time visitors | Yeni Kullanıcı | > 40% of total |
| Sessions by Channel | Grouped by Default Channel Grouping | Kanal Bazlı Oturum | — |
| Bounce Rate (inverse) | 1 - Engagement Rate | Hemen Çıkma Oranı | < 40% |

**Report Setup:**
- **Navigate:** Reports → Acquisition → Traffic Acquisition
- **Add Comparison:** `language = tr` vs `language = en`
- **Add Secondary Dimension:** `content_type`
- **Filter:** Exclude internal traffic (IP filters)

### 5.2 User Engagement (Kullanıcı Etkileşimi)

**Goal:** Measure content quality and user interest depth.

| Metric | Definition | Turkish Term | Target |
|---|---|---|---|
| Average Engagement Time | Total engagement time / Sessions | Ortalama Etkileşim Süresi | > 2 min |
| Events per Session | Total events / Sessions | Oturum Başına Etkinlik | > 5 |
| Scroll Depth | % of page scrolled | Kaydırma Derinliği | > 75% on articles |
| Engaged Sessions | Sessions > 10s OR > 2 events OR scroll > 90% | Etkileşimli Oturum | > 60% |
| Return Rate | Returning users / Total users | Geri Dönme Oranı | > 25% |

**Report Setup:**
- **Navigate:** Reports → Engagement → Events
- **Custom Report:** Create an Exploration with `event_name` as dimension and `event_count` as metric
- **Add:** `scroll` event threshold tracking (requires enhanced measurement)

### 5.3 E-commerce / Monetization (Gelir & Monetizasyon)

**Goal:** Track revenue, plan performance, and customer lifetime value.

| Metric | Definition | Turkish Term | Target |
|---|---|---|---|
| Total Revenue | Sum of purchase event values | Toplam Gelir | Growth 15% MoM |
| Revenue by Plan | Revenue grouped by `plan_name` | Plan Bazlı Gelir | — |
| ARPU | Revenue / Users | Kullanıcı Başına Gelir | > $15 |
| LTV (Customer Lifetime Value) | Total revenue / Paying users | Müşteri Yaşam Boyu Değeri | > $120 |
| Churn Rate | Canceled subs / Active subs at period start | Churn Oranı | < 8% monthly |
| Refund Rate | Refund events / Purchase events | İade Oranı | < 3% |

**Report Setup:**
- **Navigate:** Monetization → E-commerce Purchases
- **Add Custom Dimension:** `plan_name` as primary breakdown
- **Add Comparison:** `language = tr` vs `language = en`
- **Set Currency:** USD (ensure `currency` parameter is sent with `purchase` events)

### 5.4 Retention & Cohort Analysis (Müşteri Sadakati)

**Goal:** Understand user stickiness and churn patterns.

| Metric | Definition | Turkish Term | Target |
|---|---|---|---|
| New vs Returning | Ratio of first-time vs repeat users | Yeni vs Geri Dönen | 60:40 |
| Day 1 Retention | Users returning 1 day after first visit | 1. Gün Retansiyonu | > 20% |
| Day 7 Retention | Users returning 7 days after first visit | 7. Gün Retansiyonu | > 10% |
| Day 30 Retention | Users returning 30 days after first visit | 30. Gün Retansiyonu | > 5% |
| Cohort Size | Users grouped by first visit week | Kohort Boyutu | — |

**Report Setup:**
- **Navigate:** Retention → Retention Overview
- **Cohort Exploration:** Create custom Exploration with `first_visit_date` as cohort dimension
- **Breakdown:** `language`, `traffic_source`

### 5.5 Event-Specific Reports (Özel Etkinlik Raporları)

| Report Name | Dimensions | Metrics | Use Case |
|---|---|---|---|
| Scanner Performance | `scanner_type`, `language` | `scanner_use` count, avg engagement time | Which scanner drives most engagement? |
| Earnings Content | `ticker`, `strategy_type`, `content_type` | `earnings_view` count, `cta_click` rate | Which earnings plays convert best? |
| Strategy Engagement | `strategy_id`, `content_type` | `strategy_view` count, scroll depth | Which strategies retain users? |
| CTA Effectiveness | `cta_id`, `cta_section`, `cta_text` | `cta_click` count, click-through rate | Which CTAs and placements perform best? |
| Newsletter Funnel | `email_source`, `form_location` | `newsletter_subscribe` count, signup rate | Where do subscribers come from? |

---

## 6. Dashboard Layout (Dashboard Düzeni)

### 6.1 Overview — 4-6 Key Metric Cards (KPI Kartları)

Top row of the dashboard should display real-time or near-real-time metrics:

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│   SESSIONS   │   USERS      │ ENGAGEMENT   │  CONVERSION  │   REVENUE    │   SIGNUPS    │
│   (Oturum)   │ (Kullanıcı)  │    RATE      │    RATE      │   (Gelir)    │  (Kayıt)     │
│              │              │(Etkileşim %) │ (Dönüşüm %)  │              │              │
│   12,450     │   8,230      │    64.2%     │    3.8%      │   $4,250     │    312       │
│   ▲ +8.5%    │   ▲ +6.2%    │   ▲ +2.1%    │   ▼ -0.4%    │   ▲ +12.3%   │   ▲ +15.0%   │
│   vs last 7d │   vs last 7d │   vs last 7d │   vs last 7d │   vs last 7d │   vs last 7d │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### 6.2 Trend Charts (2–3 Trend Grafikleri)

**Chart 1: Sessions & Engagement Rate Over Time**
- **Type:** Dual-axis line chart
- **X-axis:** Date (daily, last 90 days)
- **Y-axis left:** Sessions (Oturum)
- **Y-axis right:** Engagement Rate (Etkileşim Oranı %)
- **Breakdown:** `language` (tr vs en)

**Chart 2: Revenue by Plan & Channel**
- **Type:** Stacked bar chart
- **X-axis:** Week
- **Y-axis:** Revenue (Gelir, USD)
- **Stack:** `plan_name` (free → trial → pro_monthly → pro_annual)
- **Breakdown:** `traffic_source`

**Chart 3: Event Volume by Content Type**
- **Type:** Area chart
- **X-axis:** Date (daily)
- **Y-axis:** Event count
- **Series:** `content_type` (pillar, tool, earnings, strategy)
- **Highlight:** `scanner_use` and `pro_upgrade` as overlay lines

### 6.3 Funnel Visualization (Huni Görselleştirmesi)

**Type:** Funnel chart (or stepped bar chart)

```
Landing (Ziyaret)      ████████████████████████████████████████  100%   (12,450)
  │
Signup (Kayıt)         ████████████████████                      50%    (6,225)
  │
Scanner Use           ██████████                                25%    (3,113)
  │
Pro Upgrade           ████                                      10%    (1,245)
  │
Purchase (Satın Alma)  ██                                         5%    (623)
```

**Configuration:**
- Funnel steps: `page_view` → `signup` → `scanner_use` → `pro_upgrade` → `purchase`
- Breakdown: `language` and `traffic_source`
- Time window: 30 days (rolling)

### 6.4 Supplementary Widgets

| Widget | Type | Dimensions | Metrics |
|---|---|---|---|
| Top Pages | Table | `page_title`, `page_location` | Views, engagement time, scroll depth |
| Top Events | Table | `event_name` | Event count, users |
| Device Breakdown | Pie chart | `device_category` | Sessions, engagement rate |
| Geography | Map | `country`, `region` | Users, sessions (Turkey vs US focus) |
| Real-time | Counter | — | Active users, top pages, top events |

---

## 7. Alert Thresholds (Uyarı Eşikleri)

### 7.1 Engagement Rate Drop (Etkileşim Oranı Düşüşü)

| Threshold | Severity | Action |
|---|---|---|
| Engagement rate drops > 20% vs previous 7-day average | **Critical** | Investigate page performance, check for broken features, review Core Web Vitals |
| Engagement rate drops 10–20% | **Warning** | Check traffic source quality; verify if new campaign traffic is low-quality |
| Engagement rate drops < 10% | **Monitor** | Note for weekly review; may be seasonal |

**GA4 Alert Setup:**
- Admin → Alerts → New Alert
- Condition: `Engagement rate` < threshold (calculate 20% below baseline)
- Frequency: Daily email to admin

### 7.2 Conversion Rate Drop (Dönüşüm Oranı Düşüşü)

| Threshold | Severity | Action |
|---|---|---|
| Overall conversion rate (Landing → Purchase) drops > 30% | **Critical** | Check checkout flow, payment gateway, pricing page errors |
| Upgrade intent (Scanner → Pro) drops > 30% | **Critical** | Review Pro upgrade CTA, pricing clarity, scanner value proposition |
| Signup rate drops > 30% | **Critical** | Check signup form, OAuth providers, validation errors |
| Any conversion step drops 15–30% | **Warning** | A/B test CTA copy, button placement, form fields |

**GA4 Alert Setup:**
- Create custom exploration with funnel steps
- Use Data API or BigQuery export for automated threshold monitoring
- Alternative: GTM + custom JavaScript alert via Slack webhook

### 7.3 Error Events Spike (Hata Etkinlikleri Artışı)

| Event | Threshold | Severity | Action |
|---|---|---|---|
| `error_page` / `exception` | > 50 events/day | **Critical** | Check server logs, broken routes, API failures |
| `form_error` | > 20 events/day | **Warning** | Review form validation, user feedback |
| `payment_failed` | > 10 events/day | **Critical** | Investigate payment gateway, Stripe/PayPal logs |
| `scanner_timeout` | > 15 events/day | **Warning** | Check API latency, third-party data source health |

**GA4 Alert Setup:**
- Create custom event count alert for `exception` and `error_*` events
- Use BigQuery scheduled query for advanced error correlation

### 7.4 Revenue Anomaly (Gelir Anomalisi)

| Threshold | Severity | Action |
|---|---|---|
| Daily revenue drops > 40% vs 7-day average | **Critical** | Check payment processing, subscription renewals, campaign spend |
| Refund rate spikes > 5% | **Critical** | Review customer complaints, product-market fit, billing issues |
| LTV drops > 20% | **Warning** | Investigate churn, plan downgrades, competitive pressure |

### 7.5 Alert Delivery Matrix

| Alert Type | Delivery Method | Recipients | Frequency |
|---|---|---|---|
| Critical | Email + Slack #alerts | Product team, CTO | Immediate |
| Warning | Email digest | Marketing + Product | Daily 09:00 |
| Monitor | Weekly dashboard review | All stakeholders | Weekly Monday |

---

## 8. Implementation Checklist (Uygulama Kontrol Listesi)

### 8.1 Pre-Launch (Ön Lansman)

- [ ] Verify `page_view` is firing on all routes including `/tr/:slug`
- [ ] Implement `newsletter_subscribe` event on form submission success
- [ ] Implement `cta_click` event with `cta_id`, `cta_text`, `cta_section` on all CTAs
- [ ] Implement `signup` event on registration completion
- [ ] Implement `scanner_use` event when scanner is activated
- [ ] Implement `earnings_view` and `strategy_view` on detail pages
- [ ] Implement `tool_use` event on VWAP, CPR, and other free tools
- [ ] Implement `pro_upgrade` event on "Upgrade to Pro" click
- [ ] Implement `purchase` event with `value`, `currency`, `plan_name` on checkout success
- [ ] Create all 4 custom dimensions in GA4 Admin
- [ ] Set up internal traffic IP exclusion filters
- [ ] Verify cross-domain tracking if using Stripe Checkout (external domain)
- [ ] Test events in GA4 DebugView (real-time)

### 8.2 Post-Launch (Lansman Sonrası)

- [ ] Build 4 custom explorations (Traffic, Engagement, Monetization, Retention)
- [ ] Configure funnel visualization in GA4 Exploration
- [ ] Set up 3 GA4 custom alerts (engagement, conversion, error)
- [ ] Export BigQuery link for advanced SQL querying
- [ ] Create Looker Studio (Data Studio) dashboard connected to GA4
- [ ] Schedule weekly automated report email to stakeholders
- [ ] Review and tune alert thresholds after 30 days of baseline data

---

## 9. Looker Studio Dashboard Wireframe

For a polished executive dashboard, connect GA4 to Looker Studio with the following pages:

### Page 1: Executive Summary (Yönetici Özeti)
- Scorecards: Sessions, Users, Engagement Rate, Conversion Rate, Revenue, Signups
- Time series: Sessions + Engagement Rate (last 90 days)
- Geo map: Users by country (Turkey highlighted)

### Page 2: Acquisition & Funnel (Edinim & Huni)
- Table: Sessions by Default Channel Grouping + Engagement Rate
- Funnel chart: 5-step conversion funnel
- Bar chart: Top 10 landing pages by conversion rate

### Page 3: Content Performance (İçerik Performansı)
- Table: Top content by `content_type` — views, engagement time, scroll depth
- Bar chart: `earnings_view` by ticker (top 20)
- Line chart: `scanner_use` volume by `scanner_type`

### Page 4: Monetization (Gelir)
- Scorecards: Total Revenue, ARPU, LTV, Churn Rate
- Stacked bar: Revenue by plan + channel
- Table: Top converting traffic sources by revenue

### Page 5: Retention & Alerts (Sonelik & Uyarılar)
- Cohort table: Retention by week
- Scorecards: Day 1 / Day 7 / Day 30 retention rates
- Alert log: Recent threshold breaches (manual Google Sheet or automated)

---

## 10. Turkish-English Metric Glossary (Terimler Sözlüğü)

| English | Turkish | Context |
|---|---|---|
| Session | Oturum | A single user visit |
| Engagement | Etkileşim | User interaction with content |
| Engagement Rate | Etkileşim Oranı | % of engaged sessions |
| Conversion | Dönüşüm | User completing a desired action |
| Conversion Rate | Dönüşüm Oranı | % of users who convert |
| Funnel | Huni | Step-by-step user journey |
| Retention | Sadakat / Retansiyon | Users returning over time |
| Churn | Churn / Ayrılma | Subscription cancellation rate |
| Revenue | Gelir | Total income |
| ARPU | Kullanıcı Başına Gelir | Average revenue per user |
| LTV | Müşteri Yaşam Boyu Değeri | Lifetime value |
| Cohort | Kohort | Group of users by acquisition date |
| Bounce | Hemen Çıkma | Single-page session |
| Scroll Depth | Kaydırma Derinliği | % of page scrolled |
| Scanner | Tarayıcı / Screener | Momentum/earnings tool |
| Upgrade | Yükseltme | Free → Pro transition |
| Purchase | Satın Alma | Paid transaction |
| Signup | Kayıt | Registration |

---

## 11. Notes & Next Steps

1. **Data freshness:** GA4 data has a 24–48 hour processing delay for standard reports. Real-time reports show active users only. For business-critical decisions, use BigQuery export (nightly).
2. **Turkish content tracking:** Ensure `/tr/:slug` pages push `language: 'tr'` in the dataLayer on page load so all downstream events inherit this dimension.
3. **Cross-domain tracking:** If Stripe Checkout or any external payment domain is used, configure `cross-domain` tracking in GA4 Admin → Data Streams → Configure tag settings.
4. **Privacy compliance:** Ensure GDPR / KVKK compliance with consent mode. Implement `analytics_storage` and `ad_storage` consent signals.
5. **BigQuery export:** Enable the GA4 → BigQuery link for unlimited historical data retention and advanced SQL analysis (funnel rebuild, LTV modeling, anomaly detection).
6. **Custom report scheduling:** Set up weekly email reports from GA4 and/or Looker Studio for stakeholders who don't log into GA4 directly.

---

> **Document Version:** 1.0  
> **Last Updated:** 2025-07-03  
> **Owner:** Gistify Product / Analytics Team  
> **File:** `seo/GA4_KPI_DASHBOARD.md`
