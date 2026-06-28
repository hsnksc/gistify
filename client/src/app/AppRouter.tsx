import { Suspense, lazy } from "react";
import type { ComponentType } from "react";
import LoadingState from "@/components/ui/loading-state";
import type { AppLanguage } from "@/lib/i18n";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";

const Landing = lazy(() => import("../pages/Landing"));
const Home = lazy(() => import("../pages/Home"));
const ReportsAdmin = lazy(() => import("../pages/ReportsAdmin"));
const Scanner = lazy(() => import("../pages/Scanner"));
const DailyReport = lazy(() => import("../pages/DailyReport"));
const FlowPage = lazy(() => import("../features/flow/pages/FlowPage"));
const FlowDailyPage = lazy(
  () => import("../features/flow/pages/FlowDailyPage")
);
const FlowTickerPage = lazy(
  () => import("../features/flow/pages/FlowTickerPage")
);
const FlowDetailPage = lazy(
  () => import("../features/flow/pages/FlowDetailPage")
);
const ReportsIndexPage = lazy(
  () => import("../features/flow/pages/ReportsIndexPage")
);
const ReportsTickerPage = lazy(
  () => import("../features/flow/pages/ReportsTickerPage")
);
const ReportsDetailPage = lazy(
  () => import("../features/flow/pages/ReportsDetailPage")
);
const ReportsDateDetailPage = lazy(
  () => import("../features/flow/pages/ReportsDateDetailPage")
);
const CpiPpiForecastPage = lazy(() => import("../pages/CpiPpiForecast"));
const EarningsPage = lazy(() => import("../pages/Earnings"));
const EarningsCalendarPage = lazy(() => import("../pages/EarningsCalendar"));
const EarningsStrategiesPage = lazy(
  () => import("../pages/EarningsStrategies")
);
const EarningsStockDetailPage = lazy(
  () => import("../pages/EarningsStockDetail")
);
const CalendarPage = lazy(async () => {
  const module = await import("../pages/Calendar");
  return {
    default: module.default as ComponentType<{ language: AppLanguage }>,
  };
});
const MarketFlash = lazy(() => import("../pages/MarketFlash"));
const Pricing = lazy(() => import("../pages/Pricing"));
const Terms = lazy(() => import("../pages/Terms"));
const Privacy = lazy(() => import("../pages/Privacy"));
const Refund = lazy(() => import("../pages/Refund"));

function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
}

export function AppRouter({
  language,
  onLanguageChange,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-8">
          <LoadingState
            className="mx-auto max-w-7xl"
            description={copy(
              language,
              "Kazanc stratejisi, momentum, gunluk ve portfoy modulleri baglaniyor.",
              "The earnings strategy, momentum, daily and portfolio modules are connecting."
            )}
            label={copy(
              language,
              "Calisma alani yukleniyor",
              "Loading workspace"
            )}
          />
        </div>
      }
    >
      <Switch>
        <Route path={"/"}>
          {() => (
            <Landing language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/app/admin"}>
          {() => <ReportsAdmin language={language} />}
        </Route>
        <Route path={"/app"}>{() => <Home language={language} />}</Route>
        <Route path={"/earnings/calendar"}>
          {() => <EarningsCalendarPage language={language} />}
        </Route>
        <Route path={"/earnings/strategies"}>
          {() => <EarningsStrategiesPage language={language} />}
        </Route>
        <Route path={"/earnings/:ticker"}>
          {params => (
            <EarningsStockDetailPage
              language={language}
              ticker={params.ticker || ""}
            />
          )}
        </Route>
        <Route path={"/earnings"}>
          {() => <EarningsPage language={language} />}
        </Route>
        <Route path={"/momentum"}>
          {() => <Scanner language={language} />}
        </Route>
        <Route path={"/daily-report"}>
          {() => <DailyReport language={language} />}
        </Route>
        <Route path={"/cpi-ppi"}>
          {() => <CpiPpiForecastPage language={language} />}
        </Route>
        <Route path={"/calendar"}>
          {() => <CalendarPage language={language} />}
        </Route>
        <Route path={"/marketflash"}>{() => <MarketFlash />}</Route>
        <Route path={"/reports/ticker/:ticker"}>
          {params => (
            <ReportsTickerPage
              language={language}
              onLanguageChange={onLanguageChange}
              ticker={params.ticker || ""}
            />
          )}
        </Route>
        <Route path={"/reports/:ticker/:reportDate"}>
          {params => (
            <ReportsDateDetailPage
              language={language}
              onLanguageChange={onLanguageChange}
              reportDate={params.reportDate || ""}
              ticker={params.ticker || ""}
            />
          )}
        </Route>
        <Route path={"/reports/:reportId"}>
          {params => (
            <ReportsDetailPage
              language={language}
              onLanguageChange={onLanguageChange}
              reportId={params.reportId || ""}
            />
          )}
        </Route>
        <Route path={"/reports"}>
          {() => (
            <ReportsIndexPage
              language={language}
              onLanguageChange={onLanguageChange}
            />
          )}
        </Route>
        <Route path={"/flow/ticker/:ticker"}>
          {params => (
            <FlowTickerPage
              language={language}
              onLanguageChange={onLanguageChange}
              ticker={params.ticker || ""}
            />
          )}
        </Route>
        <Route path={"/flow/daily"}>
          {() => (
            <FlowDailyPage
              language={language}
              onLanguageChange={onLanguageChange}
            />
          )}
        </Route>
        <Route path={"/flow/:reportId"}>
          {params => (
            <FlowDetailPage
              language={language}
              onLanguageChange={onLanguageChange}
              reportId={params.reportId || ""}
            />
          )}
        </Route>
        <Route path={"/flow"}>
          {() => (
            <FlowPage language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/scanner"}>{() => <Scanner language={language} />}</Route>
        <Route path={"/pricing"}>
          {() => (
            <Pricing language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/terms"}>
          {() => (
            <Terms language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/privacy"}>
          {() => (
            <Privacy language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/refund"}>
          {() => (
            <Refund language={language} onLanguageChange={onLanguageChange} />
          )}
        </Route>
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}
