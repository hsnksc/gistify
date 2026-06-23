export type FlowReportLanguageMode = "tr" | "en" | "bilingual" | "unknown";
export type FlowReportTranslationState =
  | "single"
  | "complete"
  | "partial"
  | "unknown";

export interface FlowReportLanguageInfo {
  hasLanguageToggle: boolean;
  languageMode: FlowReportLanguageMode;
  translationState: FlowReportTranslationState;
}

interface AnalyzeFlowReportLanguageInput {
  contentFormat?: "markdown" | "html";
  html?: string;
  markdown?: string;
  sourceFolder?: string;
  sourceLabel?: string;
  title?: string;
}

const BILINGUAL_HINT_PATTERN =
  /\b(?:tr[\s/_-]*en|turkce[\s/&+-]*english|english[\s/&+-]*turkce|turkish[\s/&+-]*english|english[\s/&+-]*turkish|bilingual|dual[\s-]*language)\b/i;

const ENGLISH_HINT_PATTERN =
  /\b(?:english|ingilizce|analysis|report|forecast|research|market|daily)\b/i;

const TURKISH_HINT_PATTERN =
  /\b(?:turkce|turkish|analiz|rapor|gunluk|guncel|arsiv|hisse|borsa|oneri|ceviri|kismi|yukleme)\b/i;

const LANGUAGE_TOGGLE_PATTERNS = [
  /(?:window\.)?setLanguage\s*\(/i,
  /switchLanguage\s*\(/i,
  /toggleLanguage\s*\(/i,
  /class\s*=\s*["'][^"']*(?:^|\s)(?:lang-btn|lang-switch|lang-toggle|language-selector)(?:\s|$)[^"']*["']/i,
];

const TR_CONTENT_PATTERNS = [
  /class\s*=\s*["'][^"']*(?:^|\s)tr(?:\s|$)[^"']*["']/gi,
  /class\s*=\s*["'][^"']*(?:^|\s)tr-only(?:\s|$)[^"']*["']/gi,
  /data-lang-inline\s*=\s*["']tr["']/gi,
  /data-lang\s*=\s*["']tr["']/gi,
];

const EN_CONTENT_PATTERNS = [
  /class\s*=\s*["'][^"']*(?:^|\s)en(?:\s|$)[^"']*["']/gi,
  /class\s*=\s*["'][^"']*(?:^|\s)en-only(?:\s|$)[^"']*["']/gi,
  /data-lang-inline\s*=\s*["']en["']/gi,
  /data-lang\s*=\s*["']en["']/gi,
];

const TURKISH_CHAR_PATTERN = /[çğıöşüÇĞİÖŞÜ]/;
const TURKISH_WORD_PATTERN =
  /\b(?:ve|ile|icin|olarak|guncel|gunluk|sabit|beklenti|rapor|tarih|son|orani|risk|oneri|analiz|degisim|gelir|kar|fiyat|hisse|borsa|sirket|arsiv|ceviri|dil|kismi|ozet)\b/i;

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeAscii(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
}

function stripHtmlNoise(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
}

function stripHtmlTags(value: string) {
  return value.replace(/<[^>]+>/g, " ");
}

function countPatternMatches(value: string, pattern: RegExp) {
  const matches = value.match(pattern);
  return matches ? matches.length : 0;
}

function countLanguageSignals(value: string, patterns: RegExp[]) {
  return patterns.reduce(
    (total, pattern) => total + countPatternMatches(value, pattern),
    0
  );
}

function detectContentText({
  contentFormat,
  html,
  markdown,
}: AnalyzeFlowReportLanguageInput) {
  if (contentFormat === "markdown" && normalizeString(markdown)) {
    return normalizeString(markdown);
  }

  if (normalizeString(html)) {
    return normalizeString(stripHtmlTags(stripHtmlNoise(html || "")));
  }

  return normalizeString(markdown);
}

export function analyzeFlowReportLanguage(
  input: AnalyzeFlowReportLanguageInput
): FlowReportLanguageInfo {
  const html = normalizeString(input.html);
  const markdown = normalizeString(input.markdown);
  const sanitizedHtml = html ? stripHtmlNoise(html) : "";
  const hintText = normalizeAscii(
    [
      normalizeString(input.title),
      normalizeString(input.sourceLabel),
      normalizeString(input.sourceFolder),
    ]
      .filter(Boolean)
      .join(" ")
  );
  const contentText = detectContentText(input);
  const normalizedContentText = normalizeAscii(contentText);

  const trSignalCount = sanitizedHtml
    ? countLanguageSignals(sanitizedHtml, TR_CONTENT_PATTERNS)
    : 0;
  const enSignalCount = sanitizedHtml
    ? countLanguageSignals(sanitizedHtml, EN_CONTENT_PATTERNS)
    : 0;
  const hasLanguageToggle = sanitizedHtml
    ? LANGUAGE_TOGGLE_PATTERNS.some(pattern => pattern.test(sanitizedHtml))
    : false;
  const hasBilingualHint = BILINGUAL_HINT_PATTERN.test(hintText);

  let languageMode: FlowReportLanguageMode = "unknown";

  if (trSignalCount > 0 && enSignalCount > 0) {
    languageMode = "bilingual";
  } else if (hasBilingualHint || (hasLanguageToggle && (trSignalCount > 0 || enSignalCount > 0))) {
    languageMode = "bilingual";
  } else if (trSignalCount > 0) {
    languageMode = "tr";
  } else if (enSignalCount > 0) {
    languageMode = "en";
  } else if (TURKISH_CHAR_PATTERN.test(contentText) || TURKISH_HINT_PATTERN.test(normalizedContentText)) {
    languageMode = "tr";
  } else if (ENGLISH_HINT_PATTERN.test(hintText) || ENGLISH_HINT_PATTERN.test(normalizedContentText)) {
    languageMode = "en";
  }

  let translationState: FlowReportTranslationState = "unknown";

  if (languageMode === "bilingual") {
    const largerCount = Math.max(trSignalCount, enSignalCount);
    const smallerCount = Math.min(trSignalCount, enSignalCount);
    const balanceRatio = largerCount > 0 ? smallerCount / largerCount : 0;

    if (largerCount === 0 || smallerCount === 0) {
      translationState = "partial";
    } else if (largerCount >= 6 && balanceRatio < 0.55) {
      translationState = "partial";
    } else if (hasLanguageToggle && largerCount < 6) {
      translationState = "partial";
    } else {
      translationState = "complete";
    }
  } else if (languageMode === "tr" || languageMode === "en") {
    translationState = "single";
  }

  return {
    hasLanguageToggle,
    languageMode,
    translationState,
  };
}
