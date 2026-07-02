/**
 * Lightweight client-side language detection for runtime DOM translation.
 *
 * NOTE: This is a client-safe copy of detectLanguageOfText from
 * shared/flowLanguage.ts. It lives inside client/src so Vite can bundle it
 * even though the Vite root is client/ and shared/ lives outside that root.
 */

const TURKISH_CHAR_PATTERN = /[çğıöşüÇĞİÖŞÜ]/;
const TURKISH_WORD_PATTERN =
  /\b(?:ve|ile|icin|olarak|guncel|gunluk|sabit|beklenti|rapor|tarih|son|orani|risk|oneri|analiz|degisim|gelir|kar|fiyat|hisse|borsa|sirket|arsiv|ceviri|dil|kismi|ozet)\b/i;

const ENGLISH_STOPWORD_PATTERN =
  /\b(?:the|and|for|are|with|this|that|from|have|has|not|but|will|would|could|should|may|can|you|your|our|we|they|them|their|there|here|where|when|what|which|who|how|why|all|any|some|many|much|more|most|other|another|such|only|just|also|than|then|now|very|too|so|if|or|about|into|through|during|before|after|above|below|between|among|within|without|against|until|while|because|since|although|though|unless|whether|however|therefore|moreover|furthermore|nevertheless|meanwhile|otherwise|instead|nonetheless|accordingly|consequently|hence|thus)\b/i;

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

export function detectLanguageOfText(text: string): "tr" | "en" | "unknown" {
  const normalized = normalizeString(text);
  if (normalized.length < 4) {
    return "unknown";
  }

  const lettersOnly = normalized.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ]/g, "");
  if (lettersOnly.length < 3) {
    return "unknown";
  }

  const asciiNormalized = normalizeAscii(normalized);

  const hasTurkishChar = TURKISH_CHAR_PATTERN.test(normalized);
  const hasTurkishWord = TURKISH_WORD_PATTERN.test(asciiNormalized);
  const hasEnglishStopword = ENGLISH_STOPWORD_PATTERN.test(normalized);

  let trScore = 0;
  let enScore = 0;

  if (hasTurkishChar) {
    trScore += 2;
  }
  if (hasTurkishWord) {
    trScore += 1;
  }
  if (hasEnglishStopword && !hasTurkishChar) {
    enScore += 1;
  }

  if (trScore > 0 && enScore === 0) {
    return "tr";
  }
  if (enScore > 0 && trScore === 0) {
    return "en";
  }

  return "unknown";
}
