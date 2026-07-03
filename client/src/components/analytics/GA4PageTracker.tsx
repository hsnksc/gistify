import { useEffect } from "react";
import { useLocation } from "wouter";
import { initGA4, trackPageView } from "@/utils/ga4";

/**
 * Initializes GA4 once on mount and tracks page views on SPA navigation.
 */
export default function GA4PageTracker(): null {
  const [location] = useLocation();

  useEffect(() => {
    initGA4();
  }, []);

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return null;
}
