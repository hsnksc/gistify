import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Radar,
  WalletCards,
  Bot,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import {
  APP_LANGUAGE_STORAGE_KEY,
  type AppLanguage,
  translateUiText,
} from "@/lib/i18n";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const Landing = lazy(() => import("./pages/Landing"));
const Home = lazy(() => import("./pages/Home"));
const ReportsAdmin = lazy(() => import("./pages/ReportsAdmin"));
const Scanner = lazy(() => import("./pages/Scanner"));
const DailyReport = lazy(() => import("./pages/DailyReport"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const AgentContent = lazy(() => import("./pages/AgentContent"));
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
          <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-card/95 p-6 text-card-foreground shadow-2xl">
            <h2 className="text-lg font-semibold">Panel yukleniyor</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Earning strategy ve momentum workspace hazirlaniyor.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Daily ve portfolio modulleri de baglaniyor.
            </p>
          </div>
        </div>
      }
    >
      <Switch>
        <Route path={"/"}>
          {() => (
            <Landing language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/app/admin"} component={ReportsAdmin} />
        <Route path={"/app"} component={Home} />
        <Route path={"/momentum"}>
          {() => <Scanner language={language} />}
        </Route>
        <Route path={"/daily-report"} component={DailyReport} />
        <Route path={"/portfolio"} component={Portfolio} />
        <Route path={"/agent-content"} component={AgentContent} />
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

function AppNavigation({ language }: { language: AppLanguage }) {
  const [location, setLocation] = useLocation();

  const items = [
    {
      href: "/app",
      label: language === "en" ? "Earning Strategy" : "Earning Strategy",
      icon: LayoutDashboard,
      active: location.startsWith("/app"),
    },
    {
      href: "/momentum",
      label: language === "en" ? "Momentum" : "Momentum",
      icon: Radar,
      active:
        location.startsWith("/momentum") || location.startsWith("/scanner"),
    },
    {
      href: "/daily-report",
      label: language === "en" ? "Daily" : "Daily",
      icon: FileText,
      active: location.startsWith("/daily-report"),
    },
    {
      href: "/portfolio",
      label: language === "en" ? "Portfolio" : "Portfolio",
      icon: WalletCards,
      active: location.startsWith("/portfolio"),
    },
    {
      href: "/agent-content",
      label: language === "en" ? "Agent" : "Agent",
      icon: Bot,
      active: location.startsWith("/agent-content"),
    },
  ];

  return (
    <nav className="hidden md:flex md:items-center md:gap-1 md:rounded-full md:border md:border-border md:bg-card md:p-1">
      {items.map(item => {
        const Icon = item.icon;

        return (
          <button
            key={item.href}
            type="button"
            onClick={() => setLocation(item.href)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              item.active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function SiteFooter({ language }: { language: AppLanguage }) {
  const links =
    language === "en"
      ? [
          { href: "/pricing", label: "Pricing" },
          { href: "/terms", label: "Terms" },
          { href: "/privacy", label: "Privacy" },
          { href: "/refund", label: "Refund" },
          { href: "/pay", label: "Pay" },
        ]
      : [
          { href: "/pricing", label: "Fiyatlandirma" },
          { href: "/terms", label: "Kosullar" },
          { href: "/privacy", label: "Gizlilik" },
          { href: "/refund", label: "Iade" },
          { href: "/pay", label: "Odeme" },
        ];

  return (
    <footer className="border-t border-border bg-background/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Gistify</p>
          <p className="text-xs text-muted-foreground">
            {language === "en"
              ? "Earnings intelligence platform for momentum scanning, pre-earnings analysis and options research."
              : "Momentum tarama, earnings oncesi analiz ve opsiyon arastirmasi icin earnings intelligence platformu."}
          </p>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "Support" : "Destek"}: support@gistify.pro
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

function LimitedAccessPreview() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-border bg-card/95 p-6 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Pro Onizleme
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Tam panel aktif abonelikle acilir
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Momentum scanner, earnings takvimi, risk matrisi ve opsiyon
                ekranlari sadece aktif abonelikte acilir. Google girisi
                tamamlandiktan sonra Paddle ile abonelik baslatip tum
                modulleri aktif edebilirsin.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild>
                  <a href="/pay">Paddle ile abone ol</a>
                </Button>
                <Button asChild variant="outline" className="bg-background/70">
                  <a href="/pricing">Plan detaylari</a>
                </Button>
              </div>
            </div>

            <div className="grid min-w-[220px] grid-cols-2 gap-3">
              {[
                ["Scanner", "Kilitli"],
                ["Takvim", "Kilitli"],
                ["Risk", "Kilitli"],
                ["Opsiyon", "Kilitli"],
                ["Portfolio", "Kilitli"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-background/60 p-4 text-center"
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
            "Acilis momentumu tarama tablosu",
            "Sektor bazli momentum dagilimi",
            "Opsiyon strateji ve IV crush gorunumu",
          ].map(title => (
            <div
              key={title}
              className="rounded-3xl border border-border bg-card/80 p-5 shadow-xl"
            >
              <p className="text-sm font-semibold">{title}</p>
              <div className="mt-4 space-y-3">
                <div className="h-3 rounded-full bg-muted/70" />
                <div className="h-3 w-5/6 rounded-full bg-muted/50" />
                <div className="h-24 rounded-2xl border border-dashed border-border bg-background/50" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function LanguageSelector({
  language,
  onChange,
}: {
  language: AppLanguage;
  onChange: (next: AppLanguage) => void;
}) {
  return (
    <div
      data-no-translate
      className="inline-flex items-center rounded-full border border-border bg-card p-0.5"
    >
      <button
        type="button"
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
          language === "tr"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => onChange("tr")}
      >
        TR
      </button>
      <button
        type="button"
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => onChange("en")}
      >
        EN
      </button>
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
  const translationOriginalRef = useRef(new WeakMap<Text, string>());
  const runtimeTranslationCacheRef = useRef(new Map<string, string>());
  const pendingRuntimeTranslationRef = useRef(new Set<string>());
  const runtimeTranslationTimerRef = useRef<number | null>(null);
  const runtimeTranslationInFlightRef = useRef(false);
  const maskOriginalRef = useRef(new WeakMap<Text, string>());
  const isPaymentRoute = location === "/pay";
  const isMarketingRoute = [
    "/",
    "/pricing",
    "/terms",
    "/privacy",
    "/refund",
  ].includes(location);

  const isLimitedAccess =
    authState.status === "authenticated" && !authState.membership.isSubscribed;
  const isPublicAccessMode =
    authState.status === "authenticated" && authState.accessMode === "public";

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
    const root = appRootRef.current;
    if (!root || (authState.status === "loading" && !isPaymentRoute)) {
      return;
    }

    const originalMap = translationOriginalRef.current;
    const pendingSet = pendingRuntimeTranslationRef.current;
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
        language !== "en" ||
        runtimeTranslationInFlightRef.current ||
        pendingSet.size === 0 ||
        disposed
      ) {
        return;
      }

      runtimeTranslationInFlightRef.current = true;
      const batch = Array.from(pendingSet).slice(0, 60);
      batch.forEach(text => pendingSet.delete(text));

      try {
        const response = await fetch("/api/i18n/translate", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: "tr",
            target: "en",
            texts: batch,
          }),
        });

        if (response.ok) {
          const payload = (await response.json()) as {
            translations?: Record<string, string>;
          };

          const translations = payload.translations || {};
          for (const sourceText of batch) {
            runtimeTranslationCacheRef.current.set(
              sourceText,
              translations[sourceText] || sourceText
            );
          }
        } else {
          for (const sourceText of batch) {
            runtimeTranslationCacheRef.current.set(sourceText, sourceText);
          }
        }
      } catch {
        for (const sourceText of batch) {
          runtimeTranslationCacheRef.current.set(sourceText, sourceText);
        }
      } finally {
        runtimeTranslationInFlightRef.current = false;
      }

      if (disposed) {
        return;
      }

      walkTextNodes(root, translateNode);

      if (pendingSet.size > 0) {
        scheduleRuntimeTranslations();
      }
    };

    const scheduleRuntimeTranslations = () => {
      if (
        language !== "en" ||
        pendingSet.size === 0 ||
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

    const resolveEnglishTranslation = (source: string) => {
      const fromStaticDictionary = translateUiText(source, "en");
      if (fromStaticDictionary !== source) {
        return fromStaticDictionary;
      }

      const runtimeValue = runtimeTranslationCacheRef.current.get(source);
      if (runtimeValue) {
        return runtimeValue;
      }

      if (source.length <= 320) {
        pendingSet.add(source);
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

      if (!originalMap.has(node)) {
        originalMap.set(node, currentValue);
      }

      const source = originalMap.get(node) ?? currentValue;
      const translated =
        language === "en" ? resolveEnglishTranslation(source) : source;

      if (node.nodeValue !== translated) {
        node.nodeValue = translated;
      }
    }

    walkTextNodes(root, translateNode);
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
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <div
            ref={appRootRef}
            className="min-h-screen bg-background text-foreground"
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

            {!isPaymentRoute && isMarketingRoute ? (
              <Router language={language} onLanguageChange={setLanguage} />
            ) : null}

            {authState.status !== "loading" &&
            !isPaymentRoute &&
            !isMarketingRoute ? (
              <header
                data-no-mask
                data-no-translate
                className="sticky top-0 z-[70] border-b border-border bg-background/95 backdrop-blur"
              >
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-2 py-1.5 pr-3">
                      <img
                        src="/gistifylogo.jpeg?v=20260606-1"
                        alt="Gistify logo"
                        className="size-9 rounded-full border border-border object-cover"
                      />
                      <div className="leading-tight">
                        <p className="text-sm font-semibold text-foreground">
                          Gistify
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Earnings Intelligence
                        </p>
                      </div>
                    </div>

                    {authState.status === "authenticated" &&
                    !isLimitedAccess ? (
                      <AppNavigation language={language} />
                    ) : null}
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
                Public preview modu acik. Google girisi ve Paddle billing tekrar
                acildiysa bu modu kapatip `APP_ACCESS_MODE=managed` kullan.
              </div>
            ) : null}

            {authState.status === "loading" &&
            !isPaymentRoute &&
            !isMarketingRoute ? (
              <div className="min-h-screen grid place-items-center px-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-xl font-semibold">
                    Oturum kontrol ediliyor
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Birkac saniye surebilir.
                  </p>
                </div>
              </div>
            ) : null}

            {authState.status === "anonymous" &&
            !isPaymentRoute &&
            !isMarketingRoute ? (
              <div className="min-h-screen flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-lg rounded-2xl border border-border bg-card/95 p-7 text-card-foreground shadow-2xl space-y-5">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                      <GoogleMark />
                      Google OAuth Kimlik Dogrulama
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                      Finans paneline giris yap
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Uyelik durumuna gore erisim acilir. Uye olmayanlar paneli
                      goremez, uye olanlar ise abonelik olmadan kisitli
                      gorunumde kalir.
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
                    Google ile giris yap
                  </Button>
                </div>
              </div>
            ) : null}

            {authState.status === "authenticated" &&
            !isPaymentRoute &&
            !isMarketingRoute ? (
              <div className="relative">
                {isLimitedAccess ? (
                  <div
                    data-no-mask
                    className="z-40 border-b border-border bg-card/95 backdrop-blur px-4 py-3"
                  >
                    <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold">
                          Kisitli gorunum aktif
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Uye girisi tamamlandi. Rakamlar gizlenir ve grafikler
                          sadece aktif abonelikte acilir.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Abonelik acik degil. `/pay` ekranindan Paddle
                          checkout ile uyeligi aktif edip tum modulleri
                          acabilirsin.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button asChild>
                          <a href="/pay">Aboneligi ac</a>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => void refreshAuthState()}
                        >
                          Durumu yenile
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {isLimitedAccess ? (
                  <LimitedAccessPreview />
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

            {!isPaymentRoute ? (
              <SiteFooter language={language} />
            ) : null}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
