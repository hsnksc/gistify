// client/src/utils/utmParser.ts
// UTM parameter capture & traffic source detection for GA4 attribution

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const UTM_STORAGE_KEY = "gistify_utm_params";

/**
 * Capture UTM parameters from current URL and store in localStorage.
 * Call this once on app mount.
 */
export function captureUTMParams(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_term: params.get("utm_term") || undefined,
    utm_content: params.get("utm_content") || undefined,
  };

  // Only store if at least one UTM param is present
  if (Object.values(utm).some(Boolean)) {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  }
}

/**
 * Read stored UTM params from localStorage.
 */
export function getStoredUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UTMParams;
  } catch {
    return {};
  }
}

/**
 * Detect traffic source from document.referrer or UTM source.
 */
export function getTrafficSource(): string {
  if (typeof window === "undefined") return "direct";

  const utm = getStoredUTMParams();
  if (utm.utm_source) return utm.utm_source;

  const ref = document.referrer;
  if (!ref) return "direct";

  try {
    const domain = new URL(ref).hostname.toLowerCase();
    if (domain.includes("google")) return "google";
    if (domain.includes("bing")) return "bing";
    if (domain.includes("yahoo")) return "yahoo";
    if (domain.includes("duckduckgo")) return "duckduckgo";
    if (domain.includes("twitter") || domain.includes("x.com")) return "twitter";
    if (domain.includes("facebook") || domain.includes("fb.com")) return "facebook";
    if (domain.includes("instagram")) return "instagram";
    if (domain.includes("linkedin")) return "linkedin";
    if (domain.includes("reddit")) return "reddit";
    if (domain.includes("youtube")) return "youtube";
    if (domain.includes("t.co")) return "twitter";
    return "referral";
  } catch {
    return "referral";
  }
}
