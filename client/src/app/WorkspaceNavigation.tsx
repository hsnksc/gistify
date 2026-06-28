import { useState } from "react";
import {
  Activity,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Layers3,
  Menu,
  Radar,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useMobile";
import type { AppLanguage } from "@/lib/i18n";
import { useLocation } from "wouter";
import { copy, workspaceLabel } from "@/app/WorkspaceChrome";

export function WorkspaceNavigation({
  language,
  canAccessPaidRoutes,
  showAdmin,
}: {
  language: AppLanguage;
  canAccessPaidRoutes: boolean;
  showAdmin: boolean;
}) {
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
      href: "/earnings",
      label: workspaceLabel(language, "earnings"),
      icon: TrendingUp,
      active: location.startsWith("/earnings"),
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
      href: "/daily-report",
      label: workspaceLabel(language, "daily"),
      icon: FileText,
      active: location.startsWith("/daily-report"),
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
    "/earnings",
    "/momentum",
    "/daily-report",
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
      <nav className="terminal-scrollbar hidden max-w-full md:flex md:items-center md:gap-1 md:overflow-x-auto md:rounded-full md:border md:border-border md:bg-card md:p-1">
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
