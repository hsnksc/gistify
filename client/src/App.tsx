import { lazy, useEffect, useMemo, useRef, useState } from "react";
import { AppRouter } from "@/app/AppRouter";
import { WorkspaceAccessGate } from "@/app/WorkspaceAccessGate";
import { WorkspaceHeader } from "@/app/WorkspaceHeader";
import { useAuthSession } from "@/app/useAuthSession";
import { useWorkspaceRuntimeEffects } from "@/app/useWorkspaceRuntimeEffects";
import { getWorkspaceSectionLabel, SiteFooter } from "@/app/WorkspaceChrome";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLocation } from "wouter";
import {
  APP_LANGUAGE_STORAGE_KEY,
  AppLanguageContext,
  type AppLanguage,
} from "@/lib/i18n";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const Pay = lazy(() => import("./pages/Pay"));

function readStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "tr";
  }

  try {
    return window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY) === "en"
      ? "en"
      : "tr";
  } catch {
    return "tr";
  }
}

function persistLanguage(language: AppLanguage) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore storage failures so auth bootstrap cannot get stuck behind UI preferences.
  }
}

function App() {
  const [location] = useLocation();
  const callbackError = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("auth");
  }, []);

  const [language, setLanguage] = useState<AppLanguage>(() =>
    readStoredLanguage()
  );
  const { authState, logout, refreshAuthState, startGoogleLogin } =
    useAuthSession(callbackError);
  const protectedViewRef = useRef<HTMLDivElement | null>(null);
  const isPaymentRoute = location === "/pay";
  const isFlowRoute = location.startsWith("/flow");
  const isReportsRoute = location.startsWith("/reports");
  const isMarketingRoute =
    ["/", "/pricing", "/terms", "/privacy", "/refund"].includes(location) ||
    isFlowRoute ||
    isReportsRoute;
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

  useEffect(() => {
    persistLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  useWorkspaceRuntimeEffects({
    authStatus: authState.status,
    isLimitedAccess,
    isPaymentRoute,
    language,
    protectedViewRef,
  });

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <AppLanguageContext.Provider value={language}>
            <div
              className={`min-h-screen bg-background text-foreground ${
                shouldShowWorkspaceHeader ? "pb-24 md:pb-0" : ""
              }`}
            >
              <Toaster />

              {isPaymentRoute ? (
                <Pay
                  language={language}
                  onLanguageChange={setLanguage}
                  authState={authState}
                  onSignIn={startGoogleLogin}
                  onRefreshAuthState={refreshAuthState}
                />
              ) : null}

              <WorkspaceHeader
                authState={authState}
                canAccessPaidRoutes={canAccessPaidRoutes}
                hasStandaloneWorkspaceHeader={hasStandaloneWorkspaceHeader}
                isPaymentRoute={isPaymentRoute}
                isPublicAccessMode={isPublicAccessMode}
                language={language}
                onLanguageChange={setLanguage}
                onLogout={logout}
                showAdmin={showAdmin}
                shouldShowWorkspaceHeader={shouldShowWorkspaceHeader}
              />

              {!isPaymentRoute && isMarketingRoute ? (
                <AppRouter language={language} onLanguageChange={setLanguage} />
              ) : null}

              {!isPaymentRoute && !isMarketingRoute ? (
                <WorkspaceAccessGate
                  authState={authState}
                  language={language}
                  isLimitedAccess={isLimitedAccess}
                  isLockedWorkspaceRoute={isLockedWorkspaceRoute}
                  lockedWorkspaceSectionLabel={lockedWorkspaceSectionLabel}
                  onSignIn={startGoogleLogin}
                  protectedViewRef={protectedViewRef}
                >
                  <AppRouter
                    language={language}
                    onLanguageChange={setLanguage}
                  />
                </WorkspaceAccessGate>
              ) : null}
              {!isPaymentRoute ? <SiteFooter language={language} /> : null}
            </div>
          </AppLanguageContext.Provider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
