import type { AppLanguage } from "@/lib/i18n";

interface TranslationHealth {
  available: boolean | null;
  checked: boolean;
}

export function useTranslationHealth(_language: AppLanguage): TranslationHealth {
  return {
    available: true,
    checked: true,
  };
}
