import type { AppLanguage } from "@/lib/i18n";

export function useFlowTextTranslation(
  texts: string[],
  _language: AppLanguage
): string[] {
  return texts;
}

export function useFlowTitleTranslation(
  title: string,
  _language: AppLanguage
): string {
  return title;
}

export function useFlowSummaryTranslation(
  summary: string | undefined,
  _language: AppLanguage
): string {
  return summary || "";
}

export function looksTurkish(text: string): boolean {
  return /[çğıöşüÇĞİÖŞÜ]/.test(text);
}
