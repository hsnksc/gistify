import { useCallback, useEffect, useState } from "react";

export type MembershipPlan = "guest" | "member" | "pro";
export type AccessMode = "managed" | "public";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResponse {
  authenticated: boolean;
  user: AuthUser | null;
  membership: {
    plan: MembershipPlan;
    isSubscribed: boolean;
  };
  accessMode: AccessMode;
}

export type AuthState =
  | { status: "loading" }
  | { status: "anonymous"; error?: string }
  | {
      status: "authenticated";
      user: AuthUser;
      membership: AuthResponse["membership"];
      accessMode: AccessMode;
    };

const AUTH_REQUEST_TIMEOUT_MS = 8000;

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

export function useAuthSession(callbackError: string | null) {
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });

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

  const startGoogleLogin = useCallback(() => {
    window.location.assign("/api/auth/google");
  }, []);

  const logout = useCallback(async () => {
    if (
      authState.status === "authenticated" &&
      authState.accessMode === "public"
    ) {
      return;
    }

    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuthState({ status: "anonymous" });
  }, [authState]);

  return {
    authState,
    refreshAuthState,
    startGoogleLogin,
    logout,
  };
}
