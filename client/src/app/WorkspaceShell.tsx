import { lazy, type RefObject } from "react";
import { AppRouter } from "@/app/AppRouter";
import { WorkspaceAccessGate } from "@/app/WorkspaceAccessGate";
import { WorkspaceHeader } from "@/app/WorkspaceHeader";
import type { AuthState } from "@/app/useAuthSession";
import { SiteFooter } from "@/app/WorkspaceChrome";
import type { WorkspaceShellState } from "@/app/useWorkspaceShellState";
import { Toaster } from "@/components/ui/sonner";
import type { AppLanguage } from "@/lib/i18n";

const Pay = lazy(() => import("../pages/Pay"));

type WorkspaceShellProps = {
  authState: AuthState;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  onLogout: () => void;
  onRefreshAuthState: () => Promise<void>;
  onSignIn: () => void;
  protectedViewRef: RefObject<HTMLDivElement | null>;
  shellState: WorkspaceShellState;
};

export function WorkspaceShell({
  authState,
  language,
  onLanguageChange,
  onLogout,
  onRefreshAuthState,
  onSignIn,
  protectedViewRef,
  shellState,
}: WorkspaceShellProps) {
  return (
    <div
      className={`min-h-screen bg-background text-foreground ${
        shellState.shouldShowWorkspaceHeader ? "pb-24 md:pb-0" : ""
      }`}
    >
      <Toaster />

      {shellState.isPaymentRoute ? (
        <Pay
          language={language}
          onLanguageChange={onLanguageChange}
          authState={authState}
          onSignIn={onSignIn}
          onRefreshAuthState={onRefreshAuthState}
        />
      ) : null}

      <WorkspaceHeader
        authState={authState}
        canAccessPaidRoutes={shellState.canAccessPaidRoutes}
        hasStandaloneWorkspaceHeader={shellState.hasStandaloneWorkspaceHeader}
        isPaymentRoute={shellState.isPaymentRoute}
        isPublicAccessMode={shellState.isPublicAccessMode}
        language={language}
        onLanguageChange={onLanguageChange}
        onLogout={onLogout}
        showAdmin={shellState.showAdmin}
        shouldShowWorkspaceHeader={shellState.shouldShowWorkspaceHeader}
      />

      {!shellState.isPaymentRoute && shellState.isMarketingRoute ? (
        <AppRouter language={language} onLanguageChange={onLanguageChange} />
      ) : null}

      {!shellState.isPaymentRoute && !shellState.isMarketingRoute ? (
        <WorkspaceAccessGate
          authState={authState}
          language={language}
          isLimitedAccess={shellState.isLimitedAccess}
          isLockedWorkspaceRoute={shellState.isLockedWorkspaceRoute}
          lockedWorkspaceSectionLabel={shellState.lockedWorkspaceSectionLabel}
          onSignIn={onSignIn}
          protectedViewRef={protectedViewRef}
        >
          <AppRouter language={language} onLanguageChange={onLanguageChange} />
        </WorkspaceAccessGate>
      ) : null}

      {!shellState.isPaymentRoute ? <SiteFooter language={language} /> : null}
    </div>
  );
}
