import { lazy, useEffect, useMemo, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { AppRouter } from "@/app/AppRouter";
import { WorkspaceAccessGate } from "@/app/WorkspaceAccessGate";
import { useAuthSession } from "@/app/useAuthSession";
import {
  copy,
  getWorkspaceSectionLabel,
  SiteFooter,
} from "@/app/WorkspaceChrome";
import { WorkspaceNavigation } from "@/app/WorkspaceNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

const NUMBER_PATTERN = /\d[\d.,]*/g;
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

const TRANSLATABLE_ATTRIBUTES = [
  "placeholder",
  "title",
  "aria-label",
  "alt",
] as const;
type TranslatableAttribute = (typeof TRANSLATABLE_ATTRIBUTES)[number];

function getInitials(name: string) {
  return name
    .split(" ")
    .map(part => part.trim().charAt(0).toUpperCase())
    .filter(Boolean)
    .join("")
    .slice(0, 2);
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
  const pendingRuntimeTranslationRef = useRef(
    new Map<string, { source: AppLanguage; target: AppLanguage }>()
  );
  const runtimeTranslationTimerRef = useRef<number | null>(null);
  const runtimeTranslationInFlightRef = useRef(false);
  const maskOriginalRef = useRef(new WeakMap<Text, string>());
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
      const batch: Array<{
        text: string;
        source: AppLanguage;
        target: AppLanguage;
      }> = [];
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
        originalMap.set(node, { value: currentValue, language });
        appliedMap.delete(node);
      }

      const sourceRecord = originalMap.get(node) ?? {
        value: currentValue,
        language,
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
        existingAttributes.set(attribute, { value: currentValue, language });
        appliedAttributes.delete(attribute);
      }

      attributeOriginalMap.set(element, existingAttributes);
      attributeAppliedMap.set(element, appliedAttributes);

      const sourceRecord = existingAttributes.get(attribute) ?? {
        value: currentValue,
        language,
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
      <ThemeProvider defaultTheme="dark">
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
                      <div className="inline-flex shrink-0 items-center gap-3 rounded-full border border-border bg-card/90 px-3 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
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
                      </div>

                      <WorkspaceNavigation
                        language={language}
                        canAccessPaidRoutes={canAccessPaidRoutes}
                        showAdmin={showAdmin}
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
