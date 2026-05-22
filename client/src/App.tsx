import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

type MembershipPlan = "guest" | "member" | "pro";

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
}

type AuthState =
  | { status: "loading" }
  | { status: "anonymous"; error?: string }
  | { status: "authenticated"; user: AuthUser; membership: AuthResponse["membership"] };

const NUMBER_PATTERN = /\d[\d.,]*/g;

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
  const response = await fetch("/api/auth/me", {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Auth state request failed");
  }

  return (await response.json()) as AuthResponse;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const callbackError = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("auth");
  }, []);

  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });
  const protectedViewRef = useRef<HTMLDivElement | null>(null);
  const originalTextRef = useRef(new WeakMap<Text, string>());

  const isLimitedAccess =
    authState.status === "authenticated" && !authState.membership.isSubscribed;

  const refreshAuthState = useCallback(async () => {
    try {
      const auth = await fetchAuthState();
      if (auth.authenticated && auth.user) {
        setAuthState({
          status: "authenticated",
          user: auth.user,
          membership: auth.membership,
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
        error: "Oturum kontrolu yapilamadi. Sayfayi yenileyip tekrar deneyin.",
      });
    }
  }, [callbackError]);

  useEffect(() => {
    void refreshAuthState();
  }, [refreshAuthState]);

  const startGoogleLogin = () => {
    window.location.assign("/api/auth/google");
  };

  const logout = async () => {
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

    const originalMap = originalTextRef.current;

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

      const source = originalMap.get(node) ?? currentValue;
      const masked = maskNumericText(source);

      if (node.nodeValue !== masked) {
        node.nodeValue = masked;
      }
    };

    const restoreNode = (node: Text) => {
      const original = originalMap.get(node);
      if (original !== undefined && node.nodeValue !== original) {
        node.nodeValue = original;
      }
    };

    if (!isLimitedAccess) {
      walkTextNodes(root, restoreNode);
      return;
    }

    walkTextNodes(root, maskNode);

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData" && mutation.target.nodeType === Node.TEXT_NODE) {
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
  }, [isLimitedAccess]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />

          {authState.status === "loading" ? (
            <div className="min-h-screen grid place-items-center bg-background text-foreground px-4 text-center">
              <div className="space-y-2">
                <h1 className="text-xl font-semibold">Oturum kontrol ediliyor</h1>
                <p className="text-sm text-muted-foreground">Birkac saniye surebilir.</p>
              </div>
            </div>
          ) : null}

          {authState.status === "anonymous" ? (
            <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
              <div className="w-full max-w-lg rounded-2xl border border-border bg-card/95 p-7 text-card-foreground shadow-2xl space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    <GoogleMark />
                    Google OAuth Kimlik Dogrulama
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight">Finans paneline giris yap</h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Uyelik durumuna gore erisim acilir. Uye olmayanlar paneli goremez, uye olanlar ise
                    abonelik olmadan kisitli gorunumde kalir.
                  </p>
                </div>

                {authState.error ? (
                  <p className="text-sm text-destructive">{authState.error}</p>
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

          {authState.status === "authenticated" ? (
            <div
              ref={protectedViewRef}
              className={`relative ${isLimitedAccess ? "restricted-view" : ""}`}
            >
              <div
                data-no-mask
                className="fixed top-4 right-4 z-[60] flex items-center gap-2 rounded-full border border-border bg-card/95 px-2 py-1.5 shadow-lg backdrop-blur"
              >
                <Avatar className="size-9 border border-border">
                  {authState.user.picture ? (
                    <AvatarImage src={authState.user.picture} alt={`${authState.user.name} profile`} />
                  ) : null}
                  <AvatarFallback className="text-xs font-semibold">
                    {getInitials(authState.user.name) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden sm:flex flex-col pr-1">
                  <span className="max-w-32 truncate text-xs font-semibold leading-tight">
                    {authState.user.name}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  aria-label="Sign out"
                  title="Sign out"
                  onClick={logout}
                >
                  <LogOut />
                </Button>
              </div>

              {isLimitedAccess ? (
                <div
                  data-no-mask
                  className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur px-4 py-3"
                >
                  <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold">Kisitli gorunum aktif</p>
                      <p className="text-xs text-muted-foreground">
                        Uye girisi tamamlandi. Rakamlar gizlenir ve grafikler sadece aktif abonelikte acilir.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button disabled>Shopier abonelik yakinda</Button>
                    </div>
                  </div>
                </div>
              ) : null}

              <Router />
            </div>
          ) : null}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
