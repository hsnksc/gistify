import { useEffect } from "react";
import { useLocation } from "wouter";
import { hjHeatmapTrigger, hjStateChange } from "@/utils/hotjar";

/**
 * Drop this inside your Router to auto-sync Hotjar with SPA navigation.
 * Also triggers heatmaps for key pages.
 */
export default function HotjarPageTracker(): null {
  const [location] = useLocation();

  useEffect(() => {
    const path = location;
    hjStateChange(path);

    // Trigger heatmaps for key pages
    if (path === "/" || path === "/landing") {
      hjHeatmapTrigger("landing_page");
    } else if (path === "/pricing") {
      hjHeatmapTrigger("pricing_page");
    } else if (path.includes("/scanner")) {
      hjHeatmapTrigger("scanner_page");
    } else if (path.includes("/earnings")) {
      hjHeatmapTrigger("earnings_page");
    } else if (path.includes("/strategies")) {
      hjHeatmapTrigger("strategy_page");
    } else if (path.includes("/coverage")) {
      hjHeatmapTrigger("coverage_page");
    }
  }, [location]);

  return null;
}
