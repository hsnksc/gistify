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
import { GA4PageTracker, HotjarPageTracker } from "@/components/analytics/AnalyticsTrackers";
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
import { Route, Switch, useLocation } from "wouter";
import {
  APP_LANGUAGE_STORAGE_KEY,
  AppLanguageContext,
  type AppLanguage,
} from "@/lib/i18n";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { detectLanguageOfText } from "@/lib/languageDetection";

const Landing = lazy(() => import("./pages/Landing"));
const Home = lazy(() => import("./pages/Home"));
const ReportsAdmin = lazy(() => import("./pages/ReportsAdmin"));
const Scanner = lazy(() => import("./pages/Scanner"));
const FlowPage = lazy(() => import("./features/flow/pages/FlowPage"));
const FlowDailyPage = lazy(() => import("./features/flow/pages/FlowDailyPage"));
const FlowTickerPage = lazy(() => import("./features/flow/pages/FlowTickerPage"));
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
const MAX_RUNTIME_TRANSLATION_TEXT_LENGTH = 1800;
const MAX_RUNTIME_TRANSLATION_BATCH_SIZE = 18;
const MAX_RUNTIME_TRANSLATION_BATCH_CHARS = 12000;

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

type RuntimeTranslationRecord = {
  value: string;
  language: AppLanguage;
};

const TRANSLATABLE_ATTRIBUTES = ["placeholder", "title", "aria-label", "alt"] as const;
type TranslatableAttribute = (typeof TRANSLATABLE_ATTRIBUTES)[number];

function inferSourceLanguage(text: string, target: AppLanguage): AppLanguage {
  const detected = detectLanguageOfText(text);
  if (detected === "tr" || detected === "en") {
    return detected;
  }
  // If detection is inconclusive, assume the opposite of the target language
  // so the text still gets a chance to be translated.
  return target === "tr" ? "en" : "tr";
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

function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
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
      return copy(language, "Yonetim", "Admin");
    case "calendar":
      return copy(language, "Takvim", "Calendar");
    case "coverage":
      return copy(language, "Coverage", "Coverage");
    case "cpiPpi":
      return "CPI/PPI";
    case "earnings":
      return copy(language, "Earnings", "Earnings");
    case "earningsStrategy":
      return copy(language, "Kazanc Stratejisi", "Earnings Strategy");
    case "flow":
      return copy(language, "Akis", "Flow");
    case "marketFlash":
      return copy(language, "Market Flash", "Market Flash");
    case "momentum":
      return copy(language, "Momentum", "Momentum");
    default:
      return "";
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
            description={copy(
              language,
              "Kazanc stratejisi, momentum, flow ve portfoy modulleri baglaniyor.",
              "The earnings strategy, momentum, flow and portfolio modules are connecting."
            )}
            label={copy(language, "Calisma alani yukleniyor", "Loading workspace")}
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
        <Route path={"/coverage/calendar"}>
          {() => (
            <CoveragePage
              language={language}
              mode="calendar"
              onLanguageChange={onLanguageChange}
            />
          )}
        </Route>
        <Route path={"/coverage/:ticker"}>
          {params => (
            <CoveragePage
              language={language}
              mode="detail"
              onLanguageChange={onLanguageChange}
              ticker={params.ticker || ""}
            />
          )}
        </Route>
        <Route path={"/coverage"}>
          {() => (
            <CoveragePage
              language={language}
              mode="index"
              onLanguageChange={onLanguageChange}
            />
          )}
        </Route>
        <Route path={"/marketflash"}>
          {() => <MarketFlash />}
        </Route>
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
            <FlowPage
              language={language}
              onLanguageChange={onLanguageChange}
            />
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
  authState,
  isLimitedAccess,
  isPublicAccessMode,
}: {
  language: AppLanguage;
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
      icon: LayoutDashboard,
      active: location === "/app",
      requiresSubscription: true,
    },
    {
      href: "/momentum",
      label: workspaceLabel(language, "momentum"),
      icon: Radar,
      active:
        location.startsWith("/momentum") || location.startsWith("/scanner"),
      requiresSubscription: true,
    },
    {
      href: "/cpi-ppi",
      label: workspaceLabel(language, "cpiPpi"),
      icon: Activity,
      active: location.startsWith("/cpi-ppi"),
      requiresSubscription: true,
    },
    {
      href: "/calendar",
      label: workspaceLabel(language, "calendar"),
      icon: CalendarDays,
      active: location.startsWith("/calendar"),
      requiresSubscription: true,
    },
    {
      href: "/marketflash",
      label: workspaceLabel(language, "marketFlash"),
      icon: Zap,
      active: location.startsWith("/marketflash"),
      requiresSubscription: true,
    },
    {
      href: "/coverage",
      label: workspaceLabel(language, "coverage"),
      icon: BookOpen,
      active: location.startsWith("/coverage"),
      requiresSubscription: false,
    },
    {
      href: "/flow",
      label: workspaceLabel(language, "flow"),
      icon: Layers3,
      active: location.startsWith("/flow") || location.startsWith("/reports"),
      requiresSubscription: false,
    },
  ];

  if (showAdmin) {
    items.splice(1, 0, {
      href: "/app/admin",
      label: workspaceLabel(language, "admin"),
      icon: Shield,
      active: location.startsWith("/app/admin"),
      requiresSubscription: true,
    });
  }

  const mobilePrimaryHrefs = new Set([
    "/app",
    "/momentum",
    "/flow",
  ]);
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
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                item.active
                  ? "bg-primary text-primary-foreground"
                  : isLocked
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-muted-foreground hover:text-foreground"
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
        <div className="md:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11 rounded-full px-4 text-[clamp(0.875rem,2.8vw,0.95rem)]"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label={copy(language, "Workspace menusu", "Workspace menu")}
          >
            <Menu className="size-4" />
            {copy(language, "Menu", "Menu")}
          </Button>
        </div>

        <SheetContent side="left" className="w-[min(88vw,24rem)] p-0">
          <SheetHeader className="border-b border-white/10 pb-4">
            <SheetTitle>
              {copy(language, "Workspace menusu", "Workspace menu")}
            </SheetTitle>
            <SheetDescription>
              {copy(
                language,
                "Tum modullere mobilde buradan gecis yap.",
                "Switch between all modules from here on mobile."
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-6">
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
        <div className="fixed inset-x-0 bottom-0 z-[80] border-t border-white/10 bg-[rgba(10,14,26,0.94)] backdrop-blur-xl md:hidden">
          <nav className="mx-auto grid max-w-7xl grid-cols-5 gap-1 px-2 py-2">
            {mobilePrimaryItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  className={`flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 py-2 transition-colors ${
                    item.active
                      ? "bg-primary/14 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="size-4.5" />
                  <span className="mt-1 text-[clamp(0.875rem,2.4vw,0.95rem)] font-semibold leading-none">
                    {item.label}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className={`flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 py-2 transition-colors ${
                isMoreActive
                  ? "bg-primary/14 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={copy(language, "Daha fazla", "More")}
            >
              <Menu className="size-4.5" />
              <span className="mt-1 text-[clamp(0.875rem,2.4vw,0.95rem)] font-semibold leading-none">
                {copy(language, "Diger", "More")}
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
    { href: "/reports", label: copy(language, "Raporlar", "Reports") },
    { href: "/pricing", label: copy(language, "Fiyatlandirma", "Pricing") },
    { href: "/terms", label: copy(language, "Kosullar", "Terms") },
    { href: "/privacy", label: copy(language, "Gizlilik", "Privacy") },
    { href: "/refund", label: copy(language, "Iade", "Refund") },
    { href: "/pay", label: copy(language, "Odeme", "Billing") },
  ];

  return (
    <footer className="border-t border-border bg-background/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Gistify</p>
          <p className="text-xs text-muted-foreground">
            {copy(
              language,
              "Momentum tarama, earnings oncesi analiz ve opsiyon arastirmasi icin earnings intelligence platformu.",
              "Earnings intelligence platform for momentum scanning, pre-earnings analysis and options research."
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {copy(language, "Destek", "Support")}: support@gistify.pro
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
                {copy(language, "Abonelik kilidi", "Subscription gate")}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                {copy(
                  language,
                  `${sectionLabel} modulu aktif abonelik gerektiriyor`,
                  `${sectionLabel} requires an active subscription`
                )}
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {copy(
                  language,
                  "Akis ve Coverage herkese acik kalir. Kazanc Stratejisi, Momentum, Gunluk, CPI/PPI, Takvim ve Market Flash modullerini acmak icin Paddle uzerinden aktif abonelik gerekir.",
                  "Flow and Coverage stay open to everyone. Unlocking Earnings Strategy, Momentum, Daily, CPI/PPI, Calendar and Market Flash requires an active Paddle subscription."
                )}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild>
                  <a href="/pay">
                    {copy(language, "Odeme ekranini ac", "Open payment screen")}
                  </a>
                </Button>
                <Button asChild variant="outline" className="bg-background/70">
                  <a href="/flow">
                    {copy(language, "Akis'a git", "Go to Flow")}
                  </a>
                </Button>
                <Button asChild variant="outline" className="bg-background/70">
                  <a href="/pricing">
                    {copy(
                      language,
                      "Plan detaylarini gor",
                      "View plan details"
                    )}
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid min-w-[220px] grid-cols-2 gap-3">
              {[
                [
                  workspaceLabel(language, "earningsStrategy"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [
                  workspaceLabel(language, "momentum"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [
                  workspaceLabel(language, "earnings"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [
                  workspaceLabel(language, "cpiPpi"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [
                  workspaceLabel(language, "calendar"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [
                  workspaceLabel(language, "marketFlash"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [workspaceLabel(language, "coverage"), copy(language, "Acik", "Open")],
                [workspaceLabel(language, "flow"), copy(language, "Acik", "Open")],
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
            copy(
              language,
              "Abonelik acildiginda kazanc stratejisi workspace'ini tam verilerle kullanirsin.",
              "After activation, the earnings strategy workspace opens with full data."
            ),
            copy(
              language,
              "Momentum scanner, daily yuzeyi, CPI/PPI forecast, Economic Calendar ve Market Flash ayni uyelikle acilir.",
              "Momentum scanner, the daily surface, the CPI/PPI forecast, Economic Calendar and Market Flash unlock with the same subscription."
            ),
            copy(
              language,
              "Flow kamuya acik kalir; yorum yazmak icin sadece giris yeterlidir.",
              "Flow remains public; posting comments only requires sign-in."
            ),
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
  const [location] = useLocation();
  const callbackError = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("auth");
  }, []);

  const [language, setLanguage] = useState<AppLanguage>(() =>
    readStoredLanguage()
  );
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });
  const appRootRef = useRef<HTMLDivElement | null>(null);
  const protectedViewRef = useRef<HTMLDivElement | null>(null);
  const translationOriginalRef = useRef(
    new WeakMap<Text, RuntimeTranslationRecord>()
  );
  const translationAppliedRef = useRef(new WeakMap<Text, string>());
  const attributeOriginalRef = useRef(
    new WeakMap<Element, Map<TranslatableAttribute, RuntimeTranslationRecord>>()
  );
  const attributeAppliedRef = useRef(
    new WeakMap<Element, Map<TranslatableAttribute, string>>()
  );
  const runtimeTranslationCacheRef = useRef(new Map<string, string>());
  const pendingRuntimeTranslationRef = useRef(new Map<string, { source: AppLanguage; target: AppLanguage }>());
  const runtimeTranslationTimerRef = useRef<number | null>(null);
  const runtimeTranslationInFlightRef = useRef(false);
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
    persistLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

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
            ? "Google ile giris tamamlanamadi. Lutfen tekrar deneyin."
            : undefined,
      });
    } catch {
      setAuthState({
        status: "anonymous",
        error:
          "Oturum kontrolu tamamlanamadi. Sayfayi yenileyip tekrar deneyin.",
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
          error:
            "Oturum kontrolu zaman asimina ugradi. Sayfayi yenileyin veya tekrar giris yapin.",
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
    const root = document.body;
    if (!root || (authState.status === "loading" && !isPaymentRoute)) {
      return;
    }

    const originalMap = translationOriginalRef.current;
    const appliedMap = translationAppliedRef.current;
    const attributeOriginalMap = attributeOriginalRef.current;
    const attributeAppliedMap = attributeAppliedRef.current;
    const pendingMap = pendingRuntimeTranslationRef.current;
    let disposed = false;

    const clearPendingTimer = () => {
      if (runtimeTranslationTimerRef.current !== null) {
        window.clearTimeout(runtimeTranslationTimerRef.current);
        runtimeTranslationTimerRef.current = null;
      }
    };

    const shouldSkipNode = (node: Text) => {
      const parent = node.parentElement;
      if (!parent) {
        return true;
      }

      return Boolean(
        parent.closest(
          "[data-no-translate], script, style, textarea, input, pre, code"
        )
      );
    };

    const flushRuntimeTranslations = async () => {
      if (
        runtimeTranslationInFlightRef.current ||
        pendingMap.size === 0 ||
        disposed
      ) {
        return;
      }

      runtimeTranslationInFlightRef.current = true;
      const batch: Array<{ text: string; source: AppLanguage; target: AppLanguage }> = [];
      let batchCharCount = 0;

      for (const [cacheKey, direction] of Array.from(pendingMap.entries())) {
        const [text] = cacheKey.split("\u0000");
        const wouldExceedChars =
          batch.length > 0 &&
          batchCharCount + text.length > MAX_RUNTIME_TRANSLATION_BATCH_CHARS;

        if (
          batch.length >= MAX_RUNTIME_TRANSLATION_BATCH_SIZE ||
          wouldExceedChars
        ) {
          break;
        }

        batch.push({
          text,
          source: direction.source,
          target: direction.target,
        });
        batchCharCount += text.length;
        pendingMap.delete(cacheKey);
      }

      try {
        const groupedBatches = new Map<
          string,
          { source: AppLanguage; target: AppLanguage; texts: string[] }
        >();

        for (const item of batch) {
          const key = `${item.source}:${item.target}`;
          const existing = groupedBatches.get(key);
          if (existing) {
            existing.texts.push(item.text);
          } else {
            groupedBatches.set(key, {
              source: item.source,
              target: item.target,
              texts: [item.text],
            });
          }
        }

        for (const request of Array.from(groupedBatches.values())) {
          const response = await fetch("/api/i18n/translate", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              source: request.source,
              target: request.target,
              texts: request.texts,
            }),
          });

          if (response.ok) {
            const payload = (await response.json()) as {
              translations?: Record<string, string>;
            };

            const translations = payload.translations || {};
            for (const sourceText of request.texts) {
              runtimeTranslationCacheRef.current.set(
                `${sourceText}\u0000${request.source}\u0000${request.target}`,
                translations[sourceText] || sourceText
              );
            }
          } else {
            for (const sourceText of request.texts) {
              runtimeTranslationCacheRef.current.set(
                `${sourceText}\u0000${request.source}\u0000${request.target}`,
                sourceText
              );
            }
          }
        }
      } catch {
        for (const item of batch) {
          runtimeTranslationCacheRef.current.set(
            `${item.text}\u0000${item.source}\u0000${item.target}`,
            item.text
          );
        }
      } finally {
        runtimeTranslationInFlightRef.current = false;
      }

      if (disposed) {
        return;
      }

      walkTextNodes(root, translateNode);
      translateElementAttributes(root);

      if (pendingMap.size > 0) {
        scheduleRuntimeTranslations();
      }
    };

    const scheduleRuntimeTranslations = () => {
      if (
        pendingMap.size === 0 ||
        runtimeTranslationInFlightRef.current ||
        runtimeTranslationTimerRef.current !== null ||
        disposed
      ) {
        return;
      }

      runtimeTranslationTimerRef.current = window.setTimeout(() => {
        runtimeTranslationTimerRef.current = null;
        void flushRuntimeTranslations();
      }, 120);
    };

    const resolveRuntimeTranslation = (
      source: string,
      sourceLanguage: AppLanguage,
      targetLanguage: AppLanguage
    ) => {
      if (sourceLanguage === targetLanguage) {
        return source;
      }

      const cacheKey = `${source}\u0000${sourceLanguage}\u0000${targetLanguage}`;
      const runtimeValue = runtimeTranslationCacheRef.current.get(cacheKey);
      if (runtimeValue) {
        return runtimeValue;
      }

      if (source.length <= MAX_RUNTIME_TRANSLATION_TEXT_LENGTH) {
        pendingMap.set(cacheKey, {
          source: sourceLanguage,
          target: targetLanguage,
        });
      }

      scheduleRuntimeTranslations();
      return source;
    };

    function translateNode(node: Text) {
      if (shouldSkipNode(node)) {
        return;
      }

      const currentValue = node.nodeValue ?? "";
      if (!currentValue.trim()) {
        return;
      }

      const previousOriginal = originalMap.get(node);
      const previousApplied = appliedMap.get(node);
      if (
        !previousOriginal ||
        (previousApplied !== undefined &&
          currentValue !== previousApplied &&
          currentValue !== previousOriginal.value)
      ) {
        originalMap.set(node, {
          value: currentValue,
          language: inferSourceLanguage(currentValue, language),
        });
        appliedMap.delete(node);
      }

      const sourceRecord = originalMap.get(node) ?? {
        value: currentValue,
        language: inferSourceLanguage(currentValue, language),
      };
      const translated = resolveRuntimeTranslation(
        sourceRecord.value,
        sourceRecord.language,
        language
      );

      if (node.nodeValue !== translated) {
        node.nodeValue = translated;
      }

      appliedMap.set(node, translated);
    }

    const shouldSkipElement = (element: Element) =>
      Boolean(
        element.closest(
          "[data-no-translate], script, style, textarea, input, pre, code"
        )
      );

    const translateAttribute = (
      element: Element,
      attribute: TranslatableAttribute
    ) => {
      if (shouldSkipElement(element) || !element.hasAttribute(attribute)) {
        return;
      }

      const currentValue = element.getAttribute(attribute) ?? "";
      if (!currentValue.trim()) {
        return;
      }

      const existingAttributes =
        attributeOriginalMap.get(element) ||
        new Map<TranslatableAttribute, RuntimeTranslationRecord>();
      const appliedAttributes =
        attributeAppliedMap.get(element) ||
        new Map<TranslatableAttribute, string>();
      const previousOriginal = existingAttributes.get(attribute);
      const previousApplied = appliedAttributes.get(attribute);

      if (
        !previousOriginal ||
        (previousApplied !== undefined &&
          currentValue !== previousApplied &&
          currentValue !== previousOriginal.value)
      ) {
        existingAttributes.set(attribute, {
          value: currentValue,
          language: inferSourceLanguage(currentValue, language),
        });
        appliedAttributes.delete(attribute);
      }

      attributeOriginalMap.set(element, existingAttributes);
      attributeAppliedMap.set(element, appliedAttributes);

      const sourceRecord = existingAttributes.get(attribute) ?? {
        value: currentValue,
        language: inferSourceLanguage(currentValue, language),
      };
      const translated = resolveRuntimeTranslation(
        sourceRecord.value,
        sourceRecord.language,
        language
      );

      if (element.getAttribute(attribute) !== translated) {
        element.setAttribute(attribute, translated);
      }

      appliedAttributes.set(attribute, translated);
    };

    function translateElementAttributes(rootNode: Node) {
      if (rootNode.nodeType === Node.ELEMENT_NODE) {
        const element = rootNode as Element;
        TRANSLATABLE_ATTRIBUTES.forEach(attribute =>
          translateAttribute(element, attribute)
        );
      }

      if ("querySelectorAll" in rootNode) {
        (rootNode as ParentNode)
          .querySelectorAll("[placeholder], [title], [aria-label], img[alt]")
          .forEach(element => {
            TRANSLATABLE_ATTRIBUTES.forEach(attribute =>
              translateAttribute(element, attribute)
            );
          });
      }
    }

    walkTextNodes(root, translateNode);
    translateElementAttributes(root);
    scheduleRuntimeTranslations();

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (
          mutation.type === "characterData" &&
          mutation.target.nodeType === Node.TEXT_NODE
        ) {
          translateNode(mutation.target as Text);
          continue;
        }

        for (const addedNode of Array.from(mutation.addedNodes)) {
          if (addedNode.nodeType === Node.TEXT_NODE) {
            translateNode(addedNode as Text);
            continue;
          }

          walkTextNodes(addedNode, translateNode);
          translateElementAttributes(addedNode);
        }
      }

      scheduleRuntimeTranslations();
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      disposed = true;
      clearPendingTimer();
      observer.disconnect();
    };
  }, [authState.status, isPaymentRoute, language]);

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
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <AppLanguageContext.Provider value={language}>
            <div
              ref={appRootRef}
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
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3 md:gap-4">
                    <a
                      href="/"
                      className="inline-flex shrink-0 items-center gap-3 rounded-full border border-border bg-card/90 px-3 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition-colors hover:border-primary/30"
                    >
                      <img
                        src="/gistifylogo.jpeg?v=20260606-1"
                        alt="Gistify logo"
                        className="size-10 rounded-full border border-border object-cover md:size-11"
                      />
                      <div className="min-w-0 leading-tight">
                        <p className="text-sm font-semibold text-foreground md:text-base">
                          Gistify
                        </p>
                        <p className="text-[11px] text-muted-foreground md:text-xs">
                          Earnings Intelligence
                        </p>
                      </div>
                    </a>

                    <WorkspaceNavigation
                      language={language}
                      authState={authState}
                      isLimitedAccess={isLimitedAccess}
                      isPublicAccessMode={isPublicAccessMode}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <LanguageSelector
                      language={language}
                      onChange={setLanguage}
                    />

                    {isPublicAccessMode ? (
                      <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                        Public Preview
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
                          aria-label="Sign out"
                          title="Sign out"
                          onClick={logout}
                        >
                          <LogOut className="size-4" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </header>
            ) : null}

            {isPublicAccessMode && !isPaymentRoute ? (
              <div
                data-no-mask
                className="border-b border-emerald-500/20 bg-emerald-500/8 px-4 py-2 text-center text-xs text-emerald-200"
              >
                {copy(
                  language,
                  "Public preview modu acik. Google girisi ve Paddle billing tekrar acildiysa bu modu kapatip `APP_ACCESS_MODE=managed` kullan.",
                  "Public preview mode is active. If Google sign-in and Paddle billing are enabled again, turn this off and use `APP_ACCESS_MODE=managed`."
                )}
              </div>
            ) : null}

            {!isPaymentRoute && isMarketingRoute ? (
              <Router language={language} onLanguageChange={setLanguage} />
            ) : null}

            {authState.status === "loading" &&
            !isPaymentRoute &&
            !isMarketingRoute ? (
              <div className="min-h-screen grid place-items-center px-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-xl font-semibold">
                    {copy(
                      language,
                      "Oturum kontrol ediliyor",
                      "Checking session"
                    )}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {copy(
                      language,
                      "Birkac saniye surebilir.",
                      "This may take a few seconds."
                    )}
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
                      {copy(
                        language,
                        "Google OAuth Kimlik Dogrulama",
                        "Google OAuth Authentication"
                      )}
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                      {copy(
                        language,
                        `${lockedWorkspaceSectionLabel} icin giris yap`,
                        `Sign in to open ${lockedWorkspaceSectionLabel}`
                      )}
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {copy(
                        language,
                        "Akis ve Coverage herkese acik. Kazanc Stratejisi, Momentum ve Gunluk modullerini acmak icin once Google ile uye girisi yapman gerekir; aktif abonelik yoksa odeme ekranina gecersin.",
                        "Flow and Coverage are open to everyone. To open Earnings Strategy, Momentum and Daily, sign in with Google first; if the account is not subscribed, you will be taken to the payment step."
                      )}
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
                    {copy(
                      language,
                      "Google ile giris yap",
                      "Sign in with Google"
                    )}
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
                      onLanguageChange={setLanguage}
                    />
                  </div>
                )}
              </div>
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
