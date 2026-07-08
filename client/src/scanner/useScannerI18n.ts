import { useCallback, useMemo } from "react";
import type { TranslationKey } from "@/i18n.generated";
import { getNamespaceResource, t as appT, type AppLanguage } from "@/lib/i18n";
import { scannerTR } from "./locales/tr";
import { scannerEN } from "./locales/en";

const scannerNamespaceValues = getNamespaceResource("tr", "scanner");
const legacyScannerKeyToNamespaceKey = new Map<string, string>();

for (const [namespaceKey, trValue] of Object.entries(scannerNamespaceValues)) {
  if (trValue && !legacyScannerKeyToNamespaceKey.has(trValue)) {
    legacyScannerKeyToNamespaceKey.set(trValue, namespaceKey);
  }
}

export function useScannerI18n(lang: AppLanguage) {
  const dict = useMemo(() => {
    return lang === "tr" ? scannerTR : scannerEN;
  }, [lang]);

  const t = useCallback(
    (key: string, options?: Record<string, unknown>): string => {
      if (!key) {
        return "";
      }

      if (key.includes(":")) {
        return appT(key as TranslationKey, options);
      }

      const namespaceKey = legacyScannerKeyToNamespaceKey.get(key);
      if (namespaceKey) {
        return appT(`scanner:${namespaceKey}` as TranslationKey, options);
      }

      return dict[key] || key;
    },
    [dict]
  );

  return { t };
}

export { scannerTR, scannerEN };
