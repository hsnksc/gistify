import { LogOut } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { WorkspaceNavigation } from "@/app/WorkspaceNavigation";
import type { AuthState } from "@/app/useAuthSession";
import { copy } from "@/app/WorkspaceChrome";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/i18n";

function getInitials(name: string) {
  return name
    .split(" ")
    .map(part => part.trim().charAt(0).toUpperCase())
    .filter(Boolean)
    .join("")
    .slice(0, 2);
}

type WorkspaceHeaderProps = {
  authState: AuthState;
  canAccessPaidRoutes: boolean;
  hasStandaloneWorkspaceHeader: boolean;
  isPaymentRoute: boolean;
  isPublicAccessMode: boolean;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  onLogout: () => void;
  showAdmin: boolean;
  shouldShowWorkspaceHeader: boolean;
};

export function WorkspaceHeader({
  authState,
  canAccessPaidRoutes,
  hasStandaloneWorkspaceHeader,
  isPaymentRoute,
  isPublicAccessMode,
  language,
  onLanguageChange,
  onLogout,
  showAdmin,
  shouldShowWorkspaceHeader,
}: WorkspaceHeaderProps) {
  return (
    <>
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
                onChange={onLanguageChange}
              />

              {isPublicAccessMode ? (
                <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                  Public Preview
                </div>
              ) : null}

              {authState.status === "authenticated" && !isPublicAccessMode ? (
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
                    onClick={onLogout}
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
    </>
  );
}
