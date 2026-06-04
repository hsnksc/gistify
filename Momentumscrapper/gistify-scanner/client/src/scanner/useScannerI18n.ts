import { useMemo } from "react";
import { type AppLanguage, translateUiText } from "@/lib/i18n";
import { scannerTR } from "./locales/tr";
import { scannerEN } from "./locales/en";

export function useScannerI18n(lang: AppLanguage) {
  const dict = useMemo(() => {
    return lang === "tr" ? scannerTR : scannerEN;
  }, [lang]);

  const t = (key: string): string => {
    return dict[key] || key;
  };

  return { t };
}

export { scannerTR, scannerEN };
