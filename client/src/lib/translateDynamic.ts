import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { type AppLanguage, t } from "@/lib/i18n";
import { detectLanguageOfText } from "@/lib/languageDetection";

export interface DynamicTranslationItem {
  context?: string;
  id: string;
  sourceLanguage?: AppLanguage | "unknown" | null;
  text: string;
}

interface DynamicTranslationOptions {
  signal?: AbortSignal;
}

interface DynamicTranslationResponse {
  error?: string;
  items?: Array<{
    id?: string;
    text?: string;
  }>;
  translations?: Record<string, string>;
}

const MAX_CACHE_ENTRIES = 400;
const MAX_ITEMS_PER_REQUEST = 24;
const MAX_TEXT_LENGTH = 2_000;

const EMAIL_ONLY_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const PLACEHOLDER_ONLY_PATTERN =
  /^(?:\{\{[^}]+\}\}|\[[^\]]+\]|\([^)]+\)|`[^`]+`|\s)+$/;
const PURE_NUMBER_PATTERN = /^[\d\s.,%$€£¥₺()+\-/:]+$/;
const TICKER_PATTERN = /^[A-Z.]{1,6}$/;
const URL_ONLY_PATTERN = /^https?:\/\/\S+$/i;
const ENGLISH_SIGNAL_PATTERN =
  /\b(?:the|and|with|for|this|that|report|comment|price|setup|entry|risk|support|resistance)\b/i;
const TURKISH_SIGNAL_PATTERN =
  /\b(?:ve|ile|icin|rapor|yorum|fiyat|giris|risk|destek|direnc|tesekkur|tesekkurler)\b/i;

const translationCache = new Map<string, string>();

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function buildCacheKey(
  item: DynamicTranslationItem,
  sourceLanguage: AppLanguage,
  targetLanguage: AppLanguage
) {
  return [
    sourceLanguage,
    targetLanguage,
    normalizeString(item.context),
    normalizeString(item.text),
  ].join("\u0001");
}

function setCachedTranslation(cacheKey: string, value: string) {
  translationCache.set(cacheKey, value);
  if (translationCache.size <= MAX_CACHE_ENTRIES) {
    return;
  }

  const oldestKey = translationCache.keys().next().value;
  if (typeof oldestKey === "string") {
    translationCache.delete(oldestKey);
  }
}

function isTranslationCandidate(text: string) {
  const normalized = normalizeString(text);
  if (normalized.length < 4) {
    return false;
  }

  return !(
    TICKER_PATTERN.test(normalized) ||
    URL_ONLY_PATTERN.test(normalized) ||
    EMAIL_ONLY_PATTERN.test(normalized) ||
    PURE_NUMBER_PATTERN.test(normalized) ||
    PLACEHOLDER_ONLY_PATTERN.test(normalized)
  );
}

function resolveSourceLanguage(
  item: DynamicTranslationItem,
  targetLanguage: AppLanguage
) {
  if (item.sourceLanguage === "tr" || item.sourceLanguage === "en") {
    return item.sourceLanguage === targetLanguage ? null : item.sourceLanguage;
  }

  const detectedLanguage = detectLanguageOfText(item.text);
  if (detectedLanguage === "tr" || detectedLanguage === "en") {
    return detectedLanguage === targetLanguage ? null : detectedLanguage;
  }

  const normalizedText = normalizeString(item.text);
  if (targetLanguage === "en" && TURKISH_SIGNAL_PATTERN.test(normalizedText)) {
    return "tr";
  }

  if (targetLanguage === "tr" && ENGLISH_SIGNAL_PATTERN.test(normalizedText)) {
    return "en";
  }

  return null;
}

function readTranslatedText(
  payload: DynamicTranslationResponse,
  item: DynamicTranslationItem
) {
  const translatedFromItems = Array.isArray(payload.items)
    ? payload.items.find(
        candidate => normalizeString(candidate?.id) === item.id
      )
    : null;
  const translatedItemText = normalizeString(translatedFromItems?.text);
  if (translatedItemText) {
    return translatedItemText;
  }

  return normalizeString(payload.translations?.[item.id]);
}

export async function translateDynamic(
  items: DynamicTranslationItem[],
  targetLanguage: AppLanguage,
  options: DynamicTranslationOptions = {}
) {
  const results = Object.fromEntries(
    items.map(item => [item.id, normalizeString(item.text)])
  ) as Record<string, string>;
  const groupedItems = new Map<AppLanguage, DynamicTranslationItem[]>();

  for (const item of items) {
    const normalizedText = normalizeString(item.text).slice(0, MAX_TEXT_LENGTH);
    if (!item.id || !isTranslationCandidate(normalizedText)) {
      continue;
    }

    const sourceLanguage = resolveSourceLanguage(
      { ...item, text: normalizedText },
      targetLanguage
    );
    if (!sourceLanguage) {
      continue;
    }

    const cacheKey = buildCacheKey(item, sourceLanguage, targetLanguage);
    const cachedTranslation = translationCache.get(cacheKey);
    if (cachedTranslation) {
      results[item.id] = cachedTranslation;
      continue;
    }

    const bucket = groupedItems.get(sourceLanguage) || [];
    if (bucket.length >= MAX_ITEMS_PER_REQUEST) {
      continue;
    }

    bucket.push({
      context: normalizeString(item.context),
      id: item.id,
      sourceLanguage,
      text: normalizedText,
    });
    groupedItems.set(sourceLanguage, bucket);
  }

  for (const [sourceLanguage, sourceItems] of Array.from(
    groupedItems.entries()
  )) {
    if (options.signal?.aborted) {
      throw new DOMException("Translation request aborted.", "AbortError");
    }

    if (!sourceItems.length) {
      continue;
    }

    try {
      const response = await fetch("/api/i18n/translate", {
        body: JSON.stringify({
          items: sourceItems.map((item: DynamicTranslationItem) => ({
            context: item.context || "",
            id: item.id,
            text: item.text,
          })),
          source: sourceLanguage,
          target: targetLanguage,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: options.signal,
      });
      const payload = await readJsonResponse<DynamicTranslationResponse>(
        response,
        "dynamic translation",
        targetLanguage
      );

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(payload, t("common:refreshFailed"))
        );
      }

      for (const item of sourceItems) {
        const translatedText = readTranslatedText(payload, item) || item.text;
        results[item.id] = translatedText;
        setCachedTranslation(
          buildCacheKey(item, sourceLanguage, targetLanguage),
          translatedText
        );
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      console.warn(
        "[translateDynamic] Falling back to source content.",
        error instanceof Error ? error.message : error
      );
    }
  }

  return results;
}
