import type { ReactNode, RefObject } from "react";
import { Button } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/i18n";
import { copy, SubscriptionRequiredView } from "@/app/WorkspaceChrome";
import type { AuthState } from "@/app/useAuthSession";

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

type WorkspaceAccessGateProps = {
  authState: AuthState;
  language: AppLanguage;
  isLimitedAccess: boolean;
  isLockedWorkspaceRoute: boolean;
  lockedWorkspaceSectionLabel: string;
  onSignIn: () => void;
  protectedViewRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

export function WorkspaceAccessGate({
  authState,
  language,
  isLimitedAccess,
  isLockedWorkspaceRoute,
  lockedWorkspaceSectionLabel,
  onSignIn,
  protectedViewRef,
  children,
}: WorkspaceAccessGateProps) {
  if (authState.status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">
            {copy(language, "Oturum kontrol ediliyor", "Checking session")}
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
    );
  }

  if (authState.status === "anonymous") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-6 rounded-xl border border-border bg-card/95 p-7 text-card-foreground shadow-2xl">
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
            <p className="text-sm leading-relaxed text-muted-foreground">
              {copy(
                language,
                "Akis herkese acik. Kazanc Stratejisi, Momentum ve Gunluk modullerini acmak icin once Google ile uye girisi yapman gerekir; aktif abonelik yoksa odeme ekranina gecersin.",
                "Flow is open to everyone. To open Earnings Strategy, Momentum and Daily, sign in with Google first; if the account is not subscribed, you will be taken to the payment step."
              )}
            </p>
          </div>

          {authState.error ? (
            <p className="text-sm text-destructive">{authState.error}</p>
          ) : null}

          <Button
            className="h-11 w-full border border-slate-200 bg-white text-slate-900 hover:bg-slate-100"
            size="lg"
            onClick={onSignIn}
          >
            <GoogleMark />
            {copy(language, "Google ile giris yap", "Sign in with Google")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLimitedAccess && isLockedWorkspaceRoute ? (
        <SubscriptionRequiredView
          language={language}
          sectionLabel={lockedWorkspaceSectionLabel}
        />
      ) : (
        <div ref={protectedViewRef}>{children}</div>
      )}
    </div>
  );
}
