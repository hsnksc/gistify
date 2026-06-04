import { Routes, Route } from "react-router";
import { I18nProvider } from "./i18n/I18nContext";
import PortalLayout from "./layouts/PortalLayout";
import Dashboard from "./pages/Dashboard";
import ScanPage from "./pages/ScanPage";
import AnalysisPage from "./pages/AnalysisPage";
import HistoryPage from "./pages/HistoryPage";
import PortfolioPage from "./pages/PortfolioPage";

export default function App() {
  return (
    <I18nProvider>
      <PortalLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
      </PortalLayout>
    </I18nProvider>
  );
}
