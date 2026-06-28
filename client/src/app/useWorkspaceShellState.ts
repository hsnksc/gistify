import { useMemo } from "react";
import { getWorkspaceSectionLabel } from "@/app/WorkspaceChrome";
import type { AuthState } from "@/app/useAuthSession";
import type { AppLanguage } from "@/lib/i18n";

const MARKETING_ROUTES = new Set([
  "/",
  "/pricing",
  "/terms",
  "/privacy",
  "/refund",
]);

export type WorkspaceShellState = {
  canAccessPaidRoutes: boolean;
  hasStandaloneWorkspaceHeader: boolean;
  isFlowRoute: boolean;
  isLimitedAccess: boolean;
  isLockedWorkspaceRoute: boolean;
  isMarketingRoute: boolean;
  isPaymentRoute: boolean;
  isPublicAccessMode: boolean;
  isReportsRoute: boolean;
  lockedWorkspaceSectionLabel: string;
  shouldShowWorkspaceHeader: boolean;
  showAdmin: boolean;
};

type UseWorkspaceShellStateOptions = {
  authState: AuthState;
  language: AppLanguage;
  location: string;
};

export function useWorkspaceShellState({
  authState,
  language,
  location,
}: UseWorkspaceShellStateOptions): WorkspaceShellState {
  const isPaymentRoute = location === "/pay";
  const isFlowRoute = location.startsWith("/flow");
  const isReportsRoute = location.startsWith("/reports");
  const isMarketingRoute =
    MARKETING_ROUTES.has(location) || isFlowRoute || isReportsRoute;
  const isLockedWorkspaceRoute =
    location === "/app" ||
    location.startsWith("/app/admin") ||
    location.startsWith("/earnings") ||
    location.startsWith("/momentum") ||
    location.startsWith("/scanner") ||
    location.startsWith("/daily-report") ||
    location.startsWith("/cpi-ppi") ||
    location.startsWith("/calendar") ||
    location.startsWith("/marketflash");
  const shouldShowWorkspaceHeader =
    !isPaymentRoute &&
    (isFlowRoute ||
      isReportsRoute ||
      (authState.status !== "loading" && !isMarketingRoute));
  const hasStandaloneWorkspaceHeader =
    location === "/app" ||
    location.startsWith("/earnings") ||
    location.startsWith("/momentum") ||
    location.startsWith("/scanner");
  const isLimitedAccess =
    authState.status === "authenticated" && !authState.membership.isSubscribed;
  const isPublicAccessMode =
    authState.status === "authenticated" && authState.accessMode === "public";
  const canAccessPaidRoutes =
    isPublicAccessMode ||
    (authState.status === "authenticated" && !isLimitedAccess);
  const showAdmin =
    authState.status === "authenticated" &&
    !isLimitedAccess &&
    !isPublicAccessMode;
  const lockedWorkspaceSectionLabel = useMemo(
    () => getWorkspaceSectionLabel(location, language),
    [language, location]
  );

  return {
    canAccessPaidRoutes,
    hasStandaloneWorkspaceHeader,
    isFlowRoute,
    isLimitedAccess,
    isLockedWorkspaceRoute,
    isMarketingRoute,
    isPaymentRoute,
    isPublicAccessMode,
    isReportsRoute,
    lockedWorkspaceSectionLabel,
    shouldShowWorkspaceHeader,
    showAdmin,
  };
}
