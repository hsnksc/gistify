import { useCallback, useEffect, useMemo, useState } from "react";
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
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
              <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm space-y-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight">Giris gerekli</h1>
                  <p className="text-sm text-muted-foreground">
                    Raporu goruntulemek icin Google hesabinla giris yap.
                  </p>
                </div>

                {authState.error ? (
                  <p className="text-sm text-destructive">{authState.error}</p>
                ) : null}

                <Button className="w-full" size="lg" onClick={startGoogleLogin}>
                  Google ile devam et
                </Button>
              </div>
            </div>
          ) : null}

          {authState.status === "authenticated" ? (
            <div className="relative">
              <Router />

              {!authState.membership.isSubscribed ? (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Merhaba, {authState.user.name}</p>
                      <h2 className="text-2xl font-semibold tracking-tight">Aylik abonelik gerekli</h2>
                      <p className="text-sm text-muted-foreground">
                        Uyeligin olusturuldu. Su an onizleme modundasin. Tum analizlere erisim icin
                        Shopier aylik abonelik aktivasyonu gerekiyor.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button disabled>Shopier baglantisi yakinda</Button>
                      <Button variant="outline" onClick={logout}>
                        Cikis yap
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
