import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentType } from "react";
import {
  Activity,
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  Radar,
  Shield,
  Zap,
} from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui/loading-state";
import {
  GA4PageTracker,
  HotjarPageTracker,
} from "@/components/analytics/AnalyticsTrackers";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/useMobile";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import {
  AppLanguageContext,
  getLanguageFromPathname,
  localizePath,
  resolvePreferredLanguage,
  stripLanguagePrefix,
  syncI18nLanguage,
  type AppLanguage,
  t,
} from "@/lib/i18n";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const Landing = lazy(() => import("./pages/Landing"));
const Home = lazy(() => import("./pages/Home"));
const ReportsAdmin = lazy(() => import("./pages/ReportsAdmin"));
const Scanner = lazy(() => import("./pages/Scanner"));
const MomentumCalibrationPage = lazy(
  () => import("./pages/MomentumCalibrationPage")
);
const MomentumLedgerPage = lazy(() => import("./pages/MomentumLedgerPage"));
const FlowPage = lazy(() => import("./features/flow/pages/FlowPage"));
const FlowDailyPage = lazy(() => import("./features/flow/pages/FlowDailyPage"));
const FlowTickerPage = lazy(
  () => import("./features/flow/pages/FlowTickerPage")
);
const FlowDetailPage = lazy(
  () => import("./features/flow/pages/FlowDetailPage")
);
const ReportsIndexPage = lazy(
  () => import("./features/flow/pages/ReportsIndexPage")
);
const ReportsTickerPage = lazy(
  () => import("./features/flow/pages/ReportsTickerPage")
);
const ReportsDetailPage = lazy(
  () => import("./features/flow/pages/ReportsDetailPage")
);
const ReportsDateDetailPage = lazy(
  () => import("./features/flow/pages/ReportsDateDetailPage")
);
const CpiPpiForecastPage = lazy(() => import("./pages/CpiPpiForecast"));
const CoveragePage = lazy(() => import("./pages/Coverage"));
const VizGallery = lazy(
  () => import("./features/coverage/components/VizGallery")
);
const EarningsPage = lazy(() => import("./pages/Earnings"));
const EarningsStockDetailPage = lazy(
  () => import("./pages/EarningsStockDetail")
);
const CalendarPage = lazy(async () => {
  const module = await import("./pages/Calendar");
  return {
    default: module.default as ComponentType<{ language: AppLanguage }>,
  };
});
const MarketFlash = lazy(() => import("./pages/MarketFlash"));
const Pay = lazy(() => import("./pages/Pay"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Refund = lazy(() => import("./pages/Refund"));

type MembershipPlan = "guest" | "member" | "pro";
type AccessMode = "managed" | "public";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthResponse {
  authenticated: boolean;
  user: AuthUser | null;
  membership: {
    plan: MembershipPlan;
    isSubscribed: boolean;
  };
  accessMode: AccessMode;
}

type AuthState =
  | { status: "loading" }
  | { status: "anonymous"; error?: string }
  | {
      status: "authenticated";
      user: AuthUser;
      membership: AuthResponse["membership"];
      accessMode: AccessMode;
    };

const NUMBER_PATTERN = /\d[\d.,]*/g;
const AUTH_REQUEST_TIMEOUT_MS = 8000;
const I18N_CACHE_VERSION = "1";
const I18N_CACHE_VERSION_STORAGE_KEY = "i18n_cache_version";

function isLegacyI18nCacheKey(key: string) {
  const normalized = key.trim().toLowerCase();
  if (
    !normalized ||
    normalized === "app_language" ||
    normalized === I18N_CACHE_VERSION_STORAGE_KEY
  ) {
    return false;
  }

  return (
    /(translation|translate|i18n)/.test(normalized) &&
    /(gistify|flow|runtime)/.test(normalized)
  );
}

function migrateLegacyI18nCache() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (
      window.localStorage.getItem(I18N_CACHE_VERSION_STORAGE_KEY) ===
      I18N_CACHE_VERSION
    ) {
      return;
    }

    const keysToDelete: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const storageKey = window.localStorage.key(index);
      if (storageKey && isLegacyI18nCacheKey(storageKey)) {
        keysToDelete.push(storageKey);
      }
    }

    for (const storageKey of keysToDelete) {
      window.localStorage.removeItem(storageKey);
    }

    window.localStorage.setItem(
      I18N_CACHE_VERSION_STORAGE_KEY,
      I18N_CACHE_VERSION
    );
  } catch {
    // Ignore storage failures to keep boot resilient.
  }
}

function maskNumericText(value: string) {
  return value.replace(NUMBER_PATTERN, "*****");
}

function walkTextNodes(root: Node, callback: (node: Text) => void) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    callback(current as Text);
    current = walker.nextNode();
  }
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-.8 2.3-1.7 3l2.8 2.2c1.6-1.5 2.6-3.8 2.6-6.6 0-.6-.1-1.2-.2-1.8z"
      />
      <path
        fill="#34A853"
        d="M12 21c2.4 0 4.4-.8 5.9-2.2l-2.8-2.2c-.8.5-1.8.8-3.1.8-2.4 0-4.4-1.6-5.1-3.8l-2.9 2.2C5.5 18.9 8.5 21 12 21z"
      />
      <path
        fill="#FBBC05"
        d="M6.9 13.6c-.2-.5-.3-1.1-.3-1.6s.1-1.1.3-1.6L4 8.2C3.4 9.4 3 10.7 3 12s.4 2.6 1 3.8z"
      />
      <path
        fill="#4285F4"
        d="M12 6.6c1.3 0 2.4.4 3.3 1.3L18 5.2C16.4 3.7 14.4 3 12 3 8.5 3 5.5 5.1 4 8.2l2.9 2.2c.7-2.2 2.7-3.8 5.1-3.8z"
      />
    </svg>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map(part => part.trim().charAt(0).toUpperCase())
    .filter(Boolean)
    .join("")
    .slice(0, 2);
}

async function fetchAuthState(): Promise<AuthResponse> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    AUTH_REQUEST_TIMEOUT_MS
  );

  let response: Response;
  try {
    response = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error("Auth state request failed");
  }

  return (await response.json()) as AuthResponse;
}

type WorkspaceLabelKey =
  | "admin"
  | "calendar"
  | "coverage"
  | "cpiPpi"
  | "earnings"
  | "earningsStrategy"
  | "flow"
  | "marketFlash"
  | "momentum";

function workspaceLabel(language: AppLanguage, key: WorkspaceLabelKey) {
  switch (key) {
    case "admin":
      return t("common:admin");
    case "calendar":
      return t("common:calendar");
    case "coverage":
      return t("common:coverage");
    case "cpiPpi":
      return t("common:cpiPpi");
    case "earnings":
      return t("common:earnings");
    case "earningsStrategy":
      return t("common:earningsStrategy");
    case "flow":
      return t("common:flow");
    case "marketFlash":
      return t("common:marketFlash");
    case "momentum":
      return t("common:momentum");
    default:
      return "";
  }
}

function workspaceShortLabel(key: WorkspaceLabelKey) {
  switch (key) {
    case "earningsStrategy":
      return t("common:strategy");
    default:
      return workspaceLabel("tr", key);
  }
}

function Router({
  language,
  onLanguageChange,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-8">
          <LoadingState
            className="mx-auto max-w-7xl"
            description={t("common:directionalAnalysisMomentumRationale")}
            label={t("common:loadingWorkspace")}
          />
        </div>
      }
    >
      <Switch>
        <Route path={"/"}>
          {() => (
            <Landing language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/app/admin"}>
          {() => <ReportsAdmin language={language} />}
        </Route>
        <Route path={"/app"}>{() => <Home language={language} />}</Route>
        <Route path={"/earnings/calendar"}>
          {() => <RouteRedirect href="/earnings" />}
        </Route>
        <Route path={"/earnings/strategies"}>
          {() => <RouteRedirect href="/earnings" />}
        </Route>
        <Route path={"/earnings/:ticker"}>
          {params => (
            <EarningsStockDetailPage
              language={language}
              ticker={params.ticker || ""}
            />
          )}
        </Route>
        <Route path={"/earnings"}>
          {() => <EarningsPage language={language} />}
        </Route>
        <Route path={"/momentum/calibration"}>
          {() => <MomentumCalibrationPage language={language} />}
        </Route>
        <Route path={"/momentum/ledger"}>
          {() => <MomentumLedgerPage language={language} />}
        </Route>
        <Route path={"/momentum"}>
          {() => <Scanner language={language} />}
        </Route>
        <Route path={"/daily-report"}>
          {() => <RouteRedirect href="/flow" />}
        </Route>
        <Route path={"/cpi-ppi"}>
          {() => <CpiPpiForecastPage language={language} />}
        </Route>
        <Route path={"/calendar"}>
          {() => <CalendarPage language={language} />}
        </Route>
        {import.meta.env.DEV ? (
          <Route path="/dev/viz-gallery">
            {() => <VizGallery language={language} />}
          </Route>
        ) : null}
        <Route path={"/coverage/calendar"}>
          {() => <CoveragePage language={language} mode="calendar" />}
        </Route>
        <Route path={"/coverage/:ticker"}>
          {params => (
            <CoveragePage
              language={language}
              mode="detail"
              ticker={params.ticker || ""}
            />
          )}
        </Route>
        <Route path={"/coverage"}>
          {() => <CoveragePage language={language} mode="index" />}
        </Route>
        <Route path={"/marketflash"}>{() => <MarketFlash />}</Route>
        <Route path={"/reports/ticker/:ticker"}>
          {params => (
            <ReportsTickerPage
              language={language}
              onLanguageChange={onLanguageChange}
              ticker={params.ticker || ""}
            />
          )}
        </Route>
        <Route path={"/reports/:ticker/:reportDate"}>
          {params => (
            <ReportsDateDetailPage
              language={language}
              onLanguageChange={onLanguageChange}
              reportDate={params.reportDate || ""}
              ticker={params.ticker || ""}
            />
          )}
        </Route>
        <Route path={"/reports/:reportId"}>
          {params => (
            <ReportsDetailPage
              language={language}
              onLanguageChange={onLanguageChange}
              reportId={params.reportId || ""}
            />
          )}
        </Route>
        <Route path={"/reports"}>
          {() => (
            <ReportsIndexPage
              language={language}
              onLanguageChange={onLanguageChange}
            />
          )}
        </Route>
        <Route path={"/flow/ticker/:ticker"}>
          {params => (
            <FlowTickerPage
              language={language}
              onLanguageChange={onLanguageChange}
              ticker={params.ticker || ""}
            />
          )}
        </Route>
        <Route path={"/flow/daily"}>
          {() => (
            <FlowDailyPage
              language={language}
              onLanguageChange={onLanguageChange}
            />
          )}
        </Route>
        <Route path={"/flow/:reportId"}>
          {params => (
            <FlowDetailPage
              language={language}
              onLanguageChange={onLanguageChange}
              reportId={params.reportId || ""}
            />
          )}
        </Route>
        <Route path={"/flow"}>
          {() => (
            <FlowPage language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/scanner"}>{() => <Scanner language={language} />}</Route>
        <Route path={"/pricing"}>
          {() => (
            <Pricing language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/terms"}>
          {() => (
            <Terms language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/privacy"}>
          {() => (
            <Privacy language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/refund"}>
          {() => (
            <Refund language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function RouteRedirect({ href }: { href: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(href, { replace: true });
  }, [href, setLocation]);

  return null;
}

function WorkspaceNavigation({
  language,
  onLanguageChange,
  authState,
  isLimitedAccess,
  isPublicAccessMode,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  authState: AuthState;
  isLimitedAccess: boolean;
  isPublicAccessMode: boolean;
}) {
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const canAccessPaidRoutes =
    isPublicAccessMode ||
    (authState.status === "authenticated" && !isLimitedAccess);
  const showAdmin =
    authState.status === "authenticated" &&
    !isLimitedAccess &&
    !isPublicAccessMode;

  const handleNavigate = (href: string) => {
    setLocation(href);
  };

  const handleMobileNavigate = (href: string) => {
    setIsMobileNavOpen(false);
    handleNavigate(href);
  };

  const items = [
    {
      href: "/app",
      label: workspaceLabel(language, "earningsStrategy"),
      shortLabel: workspaceShortLabel("earningsStrategy"),
      icon: LayoutDashboard,
      active: location === "/app",
      requiresSubscription: true,
    },
    {
      href: "/momentum",
      label: workspaceLabel(language, "momentum"),
      shortLabel: workspaceShortLabel("momentum"),
      icon: Radar,
      active:
        location.startsWith("/momentum") || location.startsWith("/scanner"),
      requiresSubscription: true,
    },
    {
      href: "/cpi-ppi",
      label: workspaceLabel(language, "cpiPpi"),
      shortLabel: workspaceShortLabel("cpiPpi"),
      icon: Activity,
      active: location.startsWith("/cpi-ppi"),
      requiresSubscription: true,
    },
    {
      href: "/calendar",
      label: workspaceLabel(language, "calendar"),
      shortLabel: workspaceShortLabel("calendar"),
      icon: CalendarDays,
      active: location.startsWith("/calendar"),
      requiresSubscription: true,
    },
    {
      href: "/marketflash",
      label: workspaceLabel(language, "marketFlash"),
      shortLabel: workspaceShortLabel("marketFlash"),
      icon: Zap,
      active: location.startsWith("/marketflash"),
      requiresSubscription: true,
    },
    {
      href: "/coverage",
      label: workspaceLabel(language, "coverage"),
      shortLabel: workspaceShortLabel("coverage"),
      icon: BookOpen,
      active: location.startsWith("/coverage"),
      requiresSubscription: false,
    },
    {
      href: "/flow",
      label: workspaceLabel(language, "flow"),
      shortLabel: workspaceShortLabel("flow"),
      icon: Layers3,
      active: location.startsWith("/flow") || location.startsWith("/reports"),
      requiresSubscription: false,
    },
  ];

  if (showAdmin) {
    items.splice(1, 0, {
      href: "/app/admin",
      label: workspaceLabel(language, "admin"),
      shortLabel: workspaceShortLabel("admin"),
      icon: Shield,
      active: location.startsWith("/app/admin"),
      requiresSubscription: true,
    });
  }

  const activeItem = items.find(item => item.active) || items[0];
  const mobilePrimaryHrefs = new Set(["/app", "/momentum", "/coverage", "/flow"]);
  const mobilePrimaryItems = items.filter(item =>
    mobilePrimaryHrefs.has(item.href)
  );
  const isMoreActive = items.some(
    item => item.active && !mobilePrimaryHrefs.has(item.href)
  );

  return (
    <>
      <nav className="hidden max-w-full md:flex md:flex-wrap md:items-center md:gap-1 md:rounded-2xl md:border md:border-border md:bg-card md:p-1">
        {items.map(item => {
          const Icon = item.icon;
          const isLocked = item.requiresSubscription && !canAccessPaidRoutes;

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => handleNavigate(item.href)}
              aria-current={item.active ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                item.active
                  ? "bg-primary text-primary-foreground"
                  : isLocked
                    ? "text-foreground/80 hover:text-foreground"
                    : "text-foreground/80 hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {item.label}
              {isLocked ? (
                <span className="rounded-full border border-border bg-background/70 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  Pro
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <div className="space-y-2 md:hidden">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="touch-target rounded-2xl px-4"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label={t("common:workspaceMenu")}
            >
              <Menu className="size-4" />
              {"Menu"}
            </Button>

            <div className="min-w-0 flex-1 rounded-2xl border border-border bg-card/90 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
                {t("common:workspaceMenu")}
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-foreground">
                {activeItem.label}
              </p>
            </div>

            <LanguageSelector
              language={language}
              onChange={onLanguageChange}
            />
          </div>

          <div className="mobile-scroll-row pr-1">
            {items.map(item => {
              const Icon = item.icon;
              const isLocked =
                item.requiresSubscription && !canAccessPaidRoutes;

              return (
                <button
                  key={`${item.href}-quick`}
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  aria-current={item.active ? "page" : undefined}
                  className={`touch-target inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                    item.active
                      ? "border-primary/35 bg-primary/12 text-foreground"
                      : "border-border bg-card/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.shortLabel}</span>
                  {isLocked ? (
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[0.7rem] uppercase tracking-[0.14em] text-slate-300">
                      Pro
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <SheetContent
          side="left"
          className="w-[min(92vw,24rem)] p-0 pt-[var(--safe-area-top)] pb-[var(--safe-area-bottom)]"
        >
          <SheetHeader className="border-b border-white/10 px-4 pt-4 pb-4">
            <SheetTitle>{t("common:workspaceMenu")}</SheetTitle>
            <SheetDescription>
              {t("common:switchBetweenAllModulesFrom")}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
                  {language === "tr" ? "Dil" : "Language"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {language === "tr" ? "Turkce" : "English"}
                </p>
              </div>
              <LanguageSelector
                language={language}
                onChange={onLanguageChange}
              />
            </div>
            <div className="grid gap-2">
              {items.map(item => {
                const Icon = item.icon;
                const isLocked =
                  item.requiresSubscription && !canAccessPaidRoutes;

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleMobileNavigate(item.href)}
                    aria-current={item.active ? "page" : undefined}
                    className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                      item.active
                        ? "border-primary/35 bg-primary/12 text-foreground"
                        : "border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="size-4.5 shrink-0" />
                      <span className="text-[clamp(0.875rem,2.9vw,0.95rem)] font-semibold">
                        {item.label}
                      </span>
                    </span>
                    {isLocked ? (
                      <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-slate-300">
                        Pro
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {isMobile ? (
        <div className="fixed inset-x-0 bottom-0 z-[80] border-t border-white/10 bg-[rgba(10,14,26,0.94)] pb-[calc(0.35rem+var(--safe-area-bottom))] backdrop-blur-xl md:hidden">
          <nav className="mx-auto grid max-w-7xl grid-cols-5 gap-1 px-2 py-2">
            {mobilePrimaryItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  aria-current={item.active ? "page" : undefined}
                  className={`touch-target flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 py-2 transition-colors ${
                    item.active
                      ? "bg-primary/14 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="size-4.5" />
                  <span className="mt-1 text-xs font-semibold leading-none">
                    {item.shortLabel}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className={`touch-target flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 py-2 transition-colors ${
                isMoreActive
                  ? "bg-primary/14 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={t("common:more")}
            >
              <Menu className="size-4.5" />
              <span className="mt-1 text-xs font-semibold leading-none">
                {t("common:more6dd7")}
              </span>
            </button>
          </nav>
        </div>
      ) : null}
    </>
  );
}

function getWorkspaceSectionLabel(path: string, language: AppLanguage) {
  if (path.startsWith("/app/admin")) {
    return workspaceLabel(language, "admin");
  }

  if (path.startsWith("/momentum") || path.startsWith("/scanner")) {
    return workspaceLabel(language, "momentum");
  }

  if (path.startsWith("/cpi-ppi")) {
    return workspaceLabel(language, "cpiPpi");
  }

  if (path.startsWith("/calendar")) {
    return workspaceLabel(language, "calendar");
  }

  if (path.startsWith("/marketflash")) {
    return workspaceLabel(language, "marketFlash");
  }

  if (path.startsWith("/coverage")) {
    return workspaceLabel(language, "coverage");
  }

  if (path.startsWith("/flow") || path.startsWith("/reports")) {
    return workspaceLabel(language, "flow");
  }

  if (path.startsWith("/earnings")) {
    return workspaceLabel(language, "earnings");
  }

  return workspaceLabel(language, "earningsStrategy");
}

function SiteFooter({ language }: { language: AppLanguage }) {
  const links = [
    { href: "/coverage", label: workspaceLabel(language, "coverage") },
    { href: "/flow", label: workspaceLabel(language, "flow") },
    { href: "/reports", label: t("common:reports") },
    { href: "/pricing", label: t("common:pricing") },
    { href: "/terms", label: t("common:terms") },
    { href: "/privacy", label: t("common:privacy") },
    { href: "/refund", label: t("scanner:excellentRetention") },
    { href: "/pay", label: t("common:billing") },
  ];

  return (
    <footer className="border-t border-border bg-background/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pt-6 pb-[calc(1.5rem+var(--safe-area-bottom))] md:flex-row md:items-center md:justify-between md:py-6">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Gistify</p>
          <p className="text-xs text-muted-foreground">
            {t("common:earningsIntelligencePlatformForMomentum")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("common:support")}: support@gistify.pro
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full border border-border bg-card px-3 py-1.5 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function SubscriptionRequiredView({
  language,
  sectionLabel,
}: {
  language: AppLanguage;
  sectionLabel: string;
}) {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {t("common:subscriptionGate")}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                {t("common:requiresAnActiveSubscription", {
                  sectionlabel: sectionLabel,
                })}
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {t("common:flowAndCoverageStayOpen")}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild>
                  <a href={localizePath("/pay", language)}>
                    {t("common:openPaymentScreen")}
                  </a>
                </Button>
                <Button asChild variant="outline" className="bg-background/70">
                  <a href={localizePath("/flow", language)}>
                    {t("common:goToFlow")}
                  </a>
                </Button>
                <Button asChild variant="outline" className="bg-background/70">
                  <a href={localizePath("/pricing", language)}>
                    {t("common:viewPlanDetails")}
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid min-w-[220px] grid-cols-2 gap-3">
              {[
                [
                  workspaceLabel(language, "earningsStrategy"),
                  t("common:subscription"),
                ],
                [
                  workspaceLabel(language, "momentum"),
                  t("common:subscription"),
                ],
                [
                  workspaceLabel(language, "earnings"),
                  t("common:subscription"),
                ],
                [workspaceLabel(language, "cpiPpi"), t("common:subscription")],
                [
                  workspaceLabel(language, "calendar"),
                  t("common:subscription"),
                ],
                [
                  workspaceLabel(language, "marketFlash"),
                  t("common:subscription"),
                ],
                [workspaceLabel(language, "coverage"), t("common:open")],
                [workspaceLabel(language, "flow"), t("common:open")],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-background/60 p-4 text-center"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            t("common:afterActivationTheEarningsStrategy"),
            t("common:momentumScannerTheDailySurface"),
            t("common:flowRemainsPublicPostingComments"),
          ].map(title => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card/80 p-6 shadow-xl"
            >
              <p className="text-sm font-semibold">{title}</p>
              <div className="mt-4 space-y-3">
                <div className="h-3 rounded-full bg-muted/70" />
                <div className="h-3 w-5/6 rounded-full bg-muted/50" />
                <div className="h-24 rounded-xl border border-dashed border-border bg-background/50" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function App() {
  const [rawLocation, setRawLocation] = useLocation();
  const location = stripLanguagePrefix(rawLocation);
  const callbackError = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("auth");
  }, []);

  const [language, setLanguage] = useState<AppLanguage>(() =>
    resolvePreferredLanguage(
      typeof window === "undefined" ? "/" : window.location.pathname
    )
  );
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });
  const appRootRef = useRef<HTMLDivElement | null>(null);
  const protectedViewRef = useRef<HTMLDivElement | null>(null);
  const maskOriginalRef = useRef(new WeakMap<Text, string>());
  const isPaymentRoute = location === "/pay";
  const isCoverageRoute = location.startsWith("/coverage");
  const isFlowRoute = location.startsWith("/flow");
  const isReportsRoute = location.startsWith("/reports");
  const isMarketingRoute =
    ["/", "/pricing", "/terms", "/privacy", "/refund"].includes(location) ||
    location.startsWith("/daily-report") ||
    isCoverageRoute ||
    isFlowRoute ||
    isReportsRoute;
  const isLockedWorkspaceRoute =
    location === "/app" ||
    location.startsWith("/app/admin") ||
    location.startsWith("/earnings") ||
    location.startsWith("/momentum") ||
    location.startsWith("/scanner") ||
    location.startsWith("/cpi-ppi") ||
    location.startsWith("/calendar") ||
    location.startsWith("/marketflash");
  const shouldShowWorkspaceHeader =
    !isPaymentRoute &&
    (isCoverageRoute ||
      isFlowRoute ||
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
  const lockedWorkspaceSectionLabel = useMemo(
    () => getWorkspaceSectionLabel(location, language),
    [language, location]
  );

  useEffect(() => {
    migrateLegacyI18nCache();
  }, []);

  useEffect(() => {
    void syncI18nLanguage(language);
  }, [language]);

  const handleLanguageChange = useCallback(
    (next: AppLanguage) => {
      if (next === language) {
        return;
      }

      const nextPath =
        typeof window === "undefined"
          ? localizePath(rawLocation || "/", next)
          : `${localizePath(window.location.pathname, next)}${window.location.search}${window.location.hash}`;

      setRawLocation(nextPath);
    },
    [language, rawLocation, setRawLocation]
  );

  useEffect(() => {
    const pathname =
      typeof window === "undefined"
        ? rawLocation || "/"
        : window.location.pathname || "/";
    const urlLanguage = getLanguageFromPathname(pathname);

    if (!urlLanguage) {
      const preferredLanguage = resolvePreferredLanguage(pathname);
      const nextPath =
        typeof window === "undefined"
          ? localizePath(rawLocation || "/", preferredLanguage)
          : `${localizePath(window.location.pathname, preferredLanguage)}${window.location.search}${window.location.hash}`;

      if (nextPath !== rawLocation) {
        setRawLocation(nextPath, { replace: true });
      }
      return;
    }

    if (urlLanguage !== language) {
      setLanguage(urlLanguage);
    }
  }, [language, rawLocation, setRawLocation]);

  const refreshAuthState = useCallback(async () => {
    try {
      const auth = await fetchAuthState();
      if (auth.authenticated && auth.user) {
        setAuthState({
          status: "authenticated",
          user: auth.user,
          membership: auth.membership,
          accessMode: auth.accessMode,
        });
        return;
      }

      setAuthState({
        status: "anonymous",
        error:
          callbackError !== null
            ? t("common:authGoogleSignInFailed")
            : undefined,
      });
    } catch {
      setAuthState({
        status: "anonymous",
        error: t("common:authSessionCheckFailed"),
      });
    }
  }, [callbackError]);

  useEffect(() => {
    void refreshAuthState();
  }, [refreshAuthState]);

  useEffect(() => {
    if (authState.status !== "loading") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAuthState(current => {
        if (current.status !== "loading") {
          return current;
        }

        return {
          status: "anonymous",
          error: t("common:authSessionTimeout"),
        };
      });
    }, AUTH_REQUEST_TIMEOUT_MS + 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [authState.status]);

  const startGoogleLogin = () => {
    window.location.assign("/api/auth/google");
  };

  const logout = async () => {
    if (isPublicAccessMode) {
      return;
    }

    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuthState({ status: "anonymous" });
  };

  useEffect(() => {
    const root = protectedViewRef.current;
    if (!root) {
      return;
    }

    const restoreMap = maskOriginalRef.current;

    const restoreNode = (node: Text) => {
      const original = restoreMap.get(node);
      if (original !== undefined && node.nodeValue !== original) {
        node.nodeValue = original;
      }
    };

    if (!isLimitedAccess) {
      walkTextNodes(root, restoreNode);
      maskOriginalRef.current = new WeakMap<Text, string>();
      return;
    }

    const originalMap = new WeakMap<Text, string>();
    maskOriginalRef.current = originalMap;

    const shouldSkipNode = (node: Text) => {
      const parent = node.parentElement;
      if (!parent) {
        return true;
      }

      return Boolean(
        parent.closest(
          "[data-no-mask], script, style, textarea, input, pre, code"
        )
      );
    };

    const maskNode = (node: Text) => {
      if (shouldSkipNode(node)) {
        return;
      }

      const currentValue = node.nodeValue ?? "";
      if (!currentValue.trim()) {
        return;
      }

      if (!originalMap.has(node)) {
        originalMap.set(node, currentValue);
      }

      const masked = maskNumericText(currentValue);

      if (node.nodeValue !== masked) {
        node.nodeValue = masked;
      }
    };

    walkTextNodes(root, maskNode);

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (
          mutation.type === "characterData" &&
          mutation.target.nodeType === Node.TEXT_NODE
        ) {
          maskNode(mutation.target as Text);
          continue;
        }

        for (const addedNode of Array.from(mutation.addedNodes)) {
          if (addedNode.nodeType === Node.TEXT_NODE) {
            maskNode(addedNode as Text);
            continue;
          }

          walkTextNodes(addedNode, maskNode);
        }
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [isLimitedAccess, language]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <AppLanguageContext.Provider value={language}>
            <WouterRouter base={`/${language}`}>
              <GA4PageTracker />
              <HotjarPageTracker />
              <div
                ref={appRootRef}
                className={`min-h-screen bg-background text-foreground ${
                  shouldShowWorkspaceHeader
                    ? "pb-[calc(var(--mobile-nav-offset)+0.75rem)] md:pb-0"
                    : ""
                }`}
              >
                <Toaster />

                {isPaymentRoute ? (
                  <Pay
                    language={language}
                    onLanguageChange={handleLanguageChange}
                    authState={authState}
                    onSignIn={startGoogleLogin}
                    onRefreshAuthState={refreshAuthState}
                  />
                ) : null}

                {shouldShowWorkspaceHeader ? (
                  <header
                    data-no-mask
                    data-no-translate
                    className={`border-b border-border bg-background/95 backdrop-blur ${
                      hasStandaloneWorkspaceHeader
                        ? "relative z-[30]"
                        : "sticky top-0 z-[70]"
                    }`}
                  >
                    <div className="mx-auto max-w-7xl px-3 pt-[calc(0.75rem+var(--safe-area-top))] pb-3 md:px-4 md:py-3">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                        <div className="flex items-center justify-between gap-3 md:min-w-0 md:justify-start md:gap-4">
                          <a
                            href={localizePath("/", language)}
                            className="inline-flex min-w-0 shrink items-center gap-3 rounded-2xl border border-border bg-card/90 px-3 py-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition-colors hover:border-primary/30 md:rounded-full md:py-2"
                          >
                            <img
                              src="/gistifylogo.png?v=20260706"
                              alt="Gistify logo"
                              className="size-10 rounded-full border border-border object-cover md:size-11"
                            />
                            <div className="min-w-0 leading-tight">
                              <p className="text-sm font-semibold text-foreground md:text-base">
                                Gistify
                              </p>
                              <p className="hidden text-[11px] text-muted-foreground sm:block md:text-xs">
                                {t("common:earningsIntelligence")}
                              </p>
                            </div>
                          </a>

                          <div className="flex shrink-0 items-center gap-2 md:hidden">
                            {authState.status === "authenticated" &&
                            !isPublicAccessMode ? (
                              <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-1 py-1">
                                <Avatar className="size-8 border border-border">
                                  {authState.user.picture ? (
                                    <AvatarImage
                                      src={authState.user.picture}
                                      alt={`${authState.user.name} profile`}
                                    />
                                  ) : null}
                                  <AvatarFallback className="text-[10px] font-semibold">
                                    {getInitials(authState.user.name) || "U"}
                                  </AvatarFallback>
                                </Avatar>

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  className="rounded-full"
                                  aria-label={t("common:signOut")}
                                  title={t("common:signOut")}
                                  onClick={logout}
                                >
                                  <LogOut className="size-4" />
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="min-w-0 md:flex-1">
                          <WorkspaceNavigation
                            language={language}
                            onLanguageChange={handleLanguageChange}
                            authState={authState}
                            isLimitedAccess={isLimitedAccess}
                            isPublicAccessMode={isPublicAccessMode}
                          />
                        </div>

                        <div className="hidden items-center gap-2 md:flex">
                          <LanguageSelector
                            language={language}
                            onChange={handleLanguageChange}
                          />

                          {isPublicAccessMode ? (
                            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                              {t("common:publicPreview")}
                            </div>
                          ) : null}

                          {authState.status === "authenticated" &&
                          !isPublicAccessMode ? (
                            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-1 py-1">
                              <Avatar className="size-8 border border-border">
                                {authState.user.picture ? (
                                  <AvatarImage
                                    src={authState.user.picture}
                                    alt={`${authState.user.name} profile`}
                                  />
                                ) : null}
                                <AvatarFallback className="text-[10px] font-semibold">
                                  {getInitials(authState.user.name) || "U"}
                                </AvatarFallback>
                              </Avatar>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-full"
                                aria-label={t("common:signOut")}
                                title={t("common:signOut")}
                                onClick={logout}
                              >
                                <LogOut className="size-4" />
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </header>
                ) : null}

                {isPublicAccessMode && !isPaymentRoute ? (
                  <div
                    data-no-mask
                    className="border-b border-emerald-500/20 bg-emerald-500/8 px-4 py-2 text-center text-xs text-emerald-200"
                  >
                    {t("common:publicPreviewModeIsActive")}
                  </div>
                ) : null}

                {!isPaymentRoute && isMarketingRoute ? (
                  <Router
                    language={language}
                    onLanguageChange={handleLanguageChange}
                  />
                ) : null}

                {authState.status === "loading" &&
                !isPaymentRoute &&
                !isMarketingRoute ? (
                  <div className="min-h-screen grid place-items-center px-4 text-center">
                    <div className="space-y-2">
                      <h1 className="text-xl font-semibold">
                        {t("common:checkingSession")}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {t("common:thisMayTakeAFew")}
                      </p>
                    </div>
                  </div>
                ) : null}

                {authState.status === "anonymous" &&
                !isPaymentRoute &&
                !isMarketingRoute ? (
                  <div className="min-h-screen flex items-center justify-center px-4 py-8">
                    <div className="w-full max-w-lg rounded-xl border border-border bg-card/95 p-7 text-card-foreground shadow-2xl space-y-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                          <GoogleMark />
                          {t("common:googleOauthAuthentication")}
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                          {t("common:signInToOpen", {
                            lockedworkspacesectionlabel:
                              lockedWorkspaceSectionLabel,
                          })}
                        </h1>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {t("common:flowAndCoverageAreOpen")}
                        </p>
                      </div>

                      {authState.error ? (
                        <p className="text-sm text-destructive">
                          {authState.error}
                        </p>
                      ) : null}

                      <Button
                        className="w-full h-11 border border-slate-200 bg-white text-slate-900 hover:bg-slate-100"
                        size="lg"
                        onClick={startGoogleLogin}
                      >
                        <GoogleMark />
                        {t("common:signInWithGoogle")}
                      </Button>
                    </div>
                  </div>
                ) : null}

                {authState.status === "authenticated" &&
                !isPaymentRoute &&
                !isMarketingRoute ? (
                  <div className="relative">
                    {isLimitedAccess && isLockedWorkspaceRoute ? (
                      <SubscriptionRequiredView
                        language={language}
                        sectionLabel={lockedWorkspaceSectionLabel}
                      />
                    ) : (
                      <div ref={protectedViewRef}>
                        <Router
                          language={language}
                          onLanguageChange={handleLanguageChange}
                        />
                      </div>
                    )}
                  </div>
                ) : null}
                {!isPaymentRoute ? <SiteFooter language={language} /> : null}
              </div>
            </WouterRouter>
          </AppLanguageContext.Provider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
