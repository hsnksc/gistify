import { captureUTMParams, getStoredUTMParams, getTrafficSource } from "./utmParser";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AccountTier = "free" | "pro";

export interface GA4UserProperties {
  account_tier: AccountTier;
  signup_date?: string;
  traffic_source: string;
  user_id?: string;
}

export interface GA4EventParams {
  [key: string]: string | number | boolean | undefined;
}

const GA4_ID = import.meta.env.VITE_GA4_ID || "G-D87NYSSNP0";

function getGtag(): typeof window.gtag | undefined {
  return typeof window !== "undefined" ? window.gtag : undefined;
}

/**
 * Ensure gtag is initialized. Call this once on app mount.
 */
export function initGA4(): void {
  if (typeof window === "undefined") return;
  if (!GA4_ID) return;

  captureUTMParams();

  const storedTier = localStorage.getItem("gistify_account_tier") as AccountTier | null;
  const storedSignupDate = localStorage.getItem("gistify_signup_date");

  if (storedTier) {
    setUserProperties({
      account_tier: storedTier,
      signup_date: storedSignupDate || undefined,
      traffic_source: getTrafficSource(),
    });
  }
}

/**
 * Track a custom event.
 */
export function trackEvent(eventName: string, params: GA4EventParams = {}): void {
  const gtag = getGtag();
  if (!gtag || !GA4_ID) {
    return;
  }

  gtag("event", eventName, {
    traffic_source: getTrafficSource(),
    ...params,
  });
}

/**
 * Track a page view manually for SPA navigation.
 */
export function trackPageView(path: string, pageCategory?: string): void {
  const gtag = getGtag();
  if (!gtag || !GA4_ID) return;

  const utm = getStoredUTMParams();

  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_category: pageCategory || getPageCategory(path),
    traffic_source: getTrafficSource(),
    utm_campaign: utm.utm_campaign,
  });
}

/**
 * Set GA4 user properties.
 */
export function setUserProperties(properties: Partial<GA4UserProperties>): void {
  const gtag = getGtag();
  if (!gtag || !GA4_ID) return;

  gtag("set", "user_properties", properties);
}

/**
 * Identify the user (hashed ID only — no PII).
 */
export function identifyUser(userIdHash: string, tier?: AccountTier): void {
  const gtag = getGtag();
  if (!gtag || !GA4_ID) return;

  gtag("config", GA4_ID, {
    user_id: userIdHash,
  });

  if (tier) {
    setUserProperties({
      account_tier: tier,
      traffic_source: getTrafficSource(),
      user_id: userIdHash,
    });
  }
}

function getPageCategory(path: string): string {
  if (path === "/" || path === "/landing") return "landing";
  if (path.startsWith("/pricing")) return "pricing";
  if (path.startsWith("/scanner")) return "scanner";
  if (path.startsWith("/earnings")) return "earnings";
  if (path.startsWith("/strategies")) return "strategy";
  if (path.startsWith("/tools")) return "tool";
  if (path.startsWith("/coverage")) return "coverage";
  if (path.startsWith("/app")) return "app";
  return "other";
}

// ============================================================
// KPI TRACKING HELPERS
// ============================================================

/** P0 — Successful registration */
export function trackSignup(
  method: string,
  tier: AccountTier,
  landingPage?: string,
  referralCode?: string
): void {
  trackEvent("signup", {
    method,
    tier,
    landing_page: landingPage || window.location.pathname,
    referral_code: referralCode,
  });
}

/** P0 — Upgrade CTA clicked */
export function trackProUpgrade(
  plan: string,
  value: number,
  currency: string,
  buttonLocation: string,
  coupon?: string
): void {
  trackEvent("pro_upgrade", {
    plan,
    conversion_value: value,
    currency,
    button_location: buttonLocation,
    coupon,
  });
}

/** P0 — Checkout page loaded */
export function trackBeginCheckout(
  plan: string,
  value: number,
  currency: string,
  coupon?: string
): void {
  trackEvent("begin_checkout", { plan, value, currency, coupon });
}

/** P0 — Payment confirmed */
export function trackPurchase(
  transactionId: string,
  value: number,
  currency: string,
  planType: string,
  accountTier: AccountTier
): void {
  trackEvent("purchase", {
    transaction_id: transactionId,
    value,
    currency,
    plan_type: planType,
    account_tier: accountTier,
  });
}

/** P1 — Any scanner executed */
export function trackScannerUse(
  scannerType: string,
  filtersUsed: string,
  resultsCount: number,
  firstScan: boolean
): void {
  trackEvent("scanner_use", {
    scanner_type: scannerType,
    filters_used: filtersUsed,
    results_count: resultsCount,
    first_scan: firstScan,
  });
}

/** P1 — Earnings preview viewed */
export function trackEarningsView(symbol: string, daysToEarnings: number): void {
  trackEvent("earnings_view", {
    earnings_symbol: symbol,
    days_to_earnings: daysToEarnings,
    page_category: "earnings",
  });
}

/** P1 — Strategy guide viewed */
export function trackStrategyView(strategyName: string): void {
  trackEvent("strategy_view", {
    strategy_name: strategyName,
    page_category: "strategy",
  });
}

/** P1 — Calculator or tool used */
export function trackToolUse(toolName: string, timeSpentSeconds: number): void {
  trackEvent("tool_use", {
    tool_name: toolName,
    time_spent_seconds: timeSpentSeconds,
    page_category: "tool",
  });
}

/** P1 — Email capture */
export function trackNewsletterSubscribe(emailHash: string, sourcePage?: string): void {
  trackEvent("newsletter_subscribe", {
    email_hash: emailHash,
    source_page: sourcePage || window.location.pathname,
  });
}

/** P1 — User reached an activation milestone */
export function trackUserActivated(minutesSinceSignup: number): void {
  trackEvent("user_activated", { minutes_since_signup: minutesSinceSignup });
}

/** Shared — Any CTA clicked */
export function trackCTAClick(
  buttonText: string,
  buttonLocation: string,
  destination?: string
): void {
  trackEvent("cta_click", {
    button_text: buttonText,
    button_location: buttonLocation,
    destination,
  });
}

/** Shared — Client-side error */
export function trackError(
  message: string,
  code?: string,
  pagePath?: string
): void {
  trackEvent("error", {
    error_message: message,
    error_code: code,
    page_path: pagePath || window.location.pathname,
  });
}
