declare global {
  interface Window {
    hj?: (...args: unknown[]) => void;
    _hjSettings?: { hjid: number; hjsv: number };
  }
}

export type HotjarEventName =
  | "user_scrolled"
  | "user_clicked_cta"
  | "user_active"
  | "user_activated"
  | "landing_hero_cta"
  | "pricing_plan_selected"
  | "scanner_filter_used"
  | "page_changed"
  | "signup_started"
  | "checkout_initiated"
  | "newsletter_subscribe"
  | "referral_link_generated"
  | "referral_link_shared"
  | "signup_completed"
  | "purchase_completed";

function getHj(): typeof window.hj | undefined {
  return typeof window !== "undefined" ? window.hj : undefined;
}

/**
 * Fire a Hotjar custom event.
 */
export function hjEvent(eventName: HotjarEventName): void {
  const hj = getHj();
  if (!hj) return;
  hj("event", eventName);
}

/**
 * Trigger a Hotjar Heatmap for a specific page.
 */
export function hjHeatmapTrigger(heatmapName: string): void {
  const hj = getHj();
  if (!hj) return;
  hj("trigger", heatmapName);
}

/**
 * Identify the user in Hotjar (hashed ID only — no PII).
 */
export function hjIdentify(
  userIdHash: string,
  attributes: Record<string, string | number>
): void {
  const hj = getHj();
  if (!hj) return;
  hj("identify", userIdHash, attributes);
}

/**
 * Update the active page context in Hotjar for SPA navigation.
 */
export function hjStateChange(path: string): void {
  const hj = getHj();
  if (!hj) return;
  hj("stateChange", path);
}

/**
 * Check if Hotjar is loaded and ready.
 */
export function isHotjarLoaded(): boolean {
  return typeof window !== "undefined" && typeof window.hj === "function";
}

// ============================================================
// GISTIFY-SPECIFIC HOTJAR EVENTS
// ============================================================

export function trackUserScrolled(): void {
  hjEvent("user_scrolled");
}

export function trackUserClickedCTA(): void {
  hjEvent("user_clicked_cta");
}

export function trackUserActive(): void {
  hjEvent("user_active");
}

export function trackUserActivated(): void {
  hjEvent("user_activated");
}

export function trackLandingHeroCTA(): void {
  hjHeatmapTrigger("landing_page");
  hjEvent("landing_hero_cta");
}

export function trackPricingPlanSelected(): void {
  hjHeatmapTrigger("pricing_page");
  hjEvent("pricing_plan_selected");
  hjEvent("user_clicked_cta");
}

export function trackScannerFilterUsed(): void {
  hjHeatmapTrigger("scanner_page");
  hjEvent("scanner_filter_used");
}

export function trackPageChanged(path: string): void {
  hjStateChange(path);
  hjEvent("page_changed");
}

export function trackSignupStarted(): void {
  hjEvent("signup_started");
}

export function trackCheckoutInitiated(): void {
  hjEvent("checkout_initiated");
}

export function trackNewsletterSubscribe(): void {
  hjEvent("newsletter_subscribe");
}

export function trackReferralLinkGenerated(referralCode: string): void {
  hjEvent("referral_link_generated");
  hjIdentify(referralCode, { referral_code: referralCode });
}

export function trackReferralLinkShared(referralCode: string, channel: string): void {
  hjEvent("referral_link_shared");
  hjIdentify(referralCode, { referral_code: referralCode, channel });
}

export function trackSignupCompleted(): void {
  hjEvent("signup_completed");
}

export function trackPurchaseCompleted(): void {
  hjEvent("purchase_completed");
}
