import type { PropsWithChildren } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLanguageContext, type AppLanguage } from "@/lib/i18n";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";

type AppProvidersProps = PropsWithChildren<{
  language: AppLanguage;
}>;

export function AppProviders({ children, language }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <AppLanguageContext.Provider value={language}>
            {children}
          </AppLanguageContext.Provider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
