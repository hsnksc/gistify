import { useEffect, useState } from "react";
import ScannerPage from "@/scanner/components/ScannerPage";
import { type AppLanguage, APP_LANGUAGE_STORAGE_KEY } from "@/lib/i18n";

export default function Scanner() {
  const [lang, setLang] = useState<AppLanguage>(() => {
    return (localStorage.getItem(APP_LANGUAGE_STORAGE_KEY) as AppLanguage) || "tr";
  });

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem(APP_LANGUAGE_STORAGE_KEY) as AppLanguage;
      if (stored && stored !== lang) setLang(stored);
    };
    window.addEventListener("storage", handler);
    const interval = setInterval(handler, 1000);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, [lang]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ScannerPage lang={lang} />
    </div>
  );
}
