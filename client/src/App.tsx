import { useMemo, useRef } from "react";
import { AppProviders } from "@/app/AppProviders";
import { useAppLanguage } from "@/app/useAppLanguage";
import { WorkspaceShell } from "@/app/WorkspaceShell";
import { useAuthSession } from "@/app/useAuthSession";
import { useWorkspaceRuntimeEffects } from "@/app/useWorkspaceRuntimeEffects";
import { useWorkspaceShellState } from "@/app/useWorkspaceShellState";
import { useLocation } from "wouter";

function App() {
  const [location] = useLocation();
  const callbackError = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("auth");
  }, []);

  const { language, setLanguage } = useAppLanguage();
  const { authState, logout, refreshAuthState, startGoogleLogin } =
    useAuthSession(callbackError);
  const protectedViewRef = useRef<HTMLDivElement | null>(null);
  const shellState = useWorkspaceShellState({
    authState,
    language,
    location,
  });

  useWorkspaceRuntimeEffects({
    authStatus: authState.status,
    isLimitedAccess: shellState.isLimitedAccess,
    isPaymentRoute: shellState.isPaymentRoute,
    language,
    protectedViewRef,
  });

  return (
    <AppProviders language={language}>
      <WorkspaceShell
        authState={authState}
        language={language}
        onLanguageChange={setLanguage}
        onLogout={logout}
        onRefreshAuthState={refreshAuthState}
        onSignIn={startGoogleLogin}
        protectedViewRef={protectedViewRef}
        shellState={shellState}
      />
    </AppProviders>
  );
}

export default App;
