import { useState, useEffect, useCallback, useRef } from "react";
import type { AppLanguage } from "@/lib/i18n";

const TURKISH_CHARS = /[çğıöşüÇĞİÖŞÜ]/;
const TURKISH_WORDS =
  /\b(?:ve|ile|icin|olarak|guncel|gunluk|sabit|beklenti|rapor|tarih|son|orani|risk|oneri|analiz|degisim|gelir|kar|fiyat|hisse|borsa|sirket|arsiv|ceviri|dil|kismi|ozet|haziran|temmuz|agustos|eylul|ekim|kasim|aralik|ocak|subat|mart|nisan|mayis|durum|guclu|kapsamli|derin|oncesi|sonrasi|aciklamasi|yorum|tahmin|beklentisi|onay|onemi|etkisi|sonucu|nedeni|amaci|konusu|hakkinda|neden|nasil|ne|kim|nerede|ne zaman|nicin|hangi|kadar|kadar|daha|en|veya|ya|ya da|fakat|ancak|ama|lakin|yine|hala|henuz|simdi|bugun|dun|yarindan|sonra|once|onceki|sonraki|sonra|icinde|disinda|arada|yaninda|altinda|ustunde|onunde|arkasinda|karsisinda|yaninda|boyunca|boyunca|sirasinda|zamaninda|noktasinda|durumunda|halinde|sebebiyle|sayesinde|yardimiyla|araciligiyla|vastasiyla|uzerinden|uzerine|geregince|gore|nazaran|oranla|kiyasla|beraber|birlikte|kadar|kadar|dek|degince|kalmak|kalmadan|gelmek|gelince|geldiginde|oldugunda|olunca|olur|olmaz|olabilir|olmustur|olacak|oldu|oldugu|olan|olmayan|eden|edenler|yapan|yapanlar|yapilan|yapilanlar|kalan|kalanlar|gelen|gelenler|giden|gidenler|bulunan|bulunanlar|vardir|yoktur|vardir|mevcut|bulunmaktadir|yer almaktadir|yer alir|alir|gelir|gider|cikar|duser|yukselir|degisir|artar|azalir|baslar|biter|devam eder|surmektedir|gerceklestirilmistir|gerceklestirilmektedir|planlanmistir|on gorulmektedir|beklenmektedir|tahmin edilmektedir|ongorulmektedir|tahmin edilmistir|ongorulmustur|belirtilmistir|aciklanmistir|bildirilmistir|duyurulmustur|ilan edilmistir|yayinlanmistir|sunulmustur|verilmistir|hazirlanmistir|olusturulmustur|yazilmistir|okunmustur|gorulmustur|incelenmistir|degerlendirilmistir|karsilastirilmistir|siralanmistir|listelenmistir|paylasilmistir|gonderilmistir|alimistir|verilmistir|satilmistir|alinmistir|kiralanmistir|satilmistir|tutulmustur|takip edilmistir|izlenmistir|kontrol edilmistir|denetlenmistir|test edilmistir|onaylanmistir|reddedilmistir|kabul edilmistir|sonuclandirilmistir|tamamlanmistir|bitirilmistir|baslatilmistir|durdurulmustur|ertelenmistir|iptal edilmistir|degistirilmistir|guncellenmistir|revize edilmistir|duzeltilmistir|eklenmistir|cikarilmistir|kaldırilmistir|konulmustur|yerlestirilmistir|ayarlanmistir|hazirlanmistir|duzenlenmistir|tasarlanmistir|gelistirilmistir|uretilmistir|satin alinmistir|uretilmistir|ithal edilmistir|ihraç edilmistir|gonderilmistir|tasinmistir|tasinmistir|tasinmistir|tutulmustur|saklanmistir|korunmustur|muhafaza edilmistir|gizlenmistir|ortaya cikarilmistir|aciga cikarilmistir|belirginlesmistir|ortadan kalkmistir|cozulmustur|ayrilmistir|birlesmistir|parcalanmistir|bolunmustur|toplanmistir|dagitilmistir|yayilmistir|genislemistir|daralmistir|yukselmistir|dusmustur|artmistir|azalmistir|degismistir|donmustur|erimistir|buharlasimistir|donmusmistir|yogunlasmistir|seyrelmistir|kalinlastirmistir|inceltilmistir|uzatilmistir|kisaltilmistir|genisletilmistir|daraltimistir|yukseklmistir|alcaltilmistir|hizlandirilmistir|yavaslatimistir|guclendirilmistir|zayiflatimistir|artirilmistir|azaltilmistir|buyutulmustur|kucultulmustur|genisletilmistir|daraltimistir|yogunlastirilmistir|seyreltilmistir|kalinlastirilmistir|inceltilmistir|uzatilmistir|kisaltilmistir|hizlandirilmistir|yavaslatimistir|guclendirilmistir|zayiflatimistir|artirilmistir|azaltilmistir|cozulmustur|ayrilmistir|birlesmistir|parcalanmistir|bolunmustur|toplanmistir|dagitilmistir)\b/i;

const translationCache = new Map<string, string>();
let inFlightPromise: Promise<Record<string, string>> | null = null;
let pendingTexts: string[] = [];

function looksTurkish(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 3) return false;
  if (/^[\d\s.,:%$+\-()/#]+$/.test(trimmed)) return false;
  const normalized = trimmed
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
  return TURKISH_CHARS.test(trimmed) || TURKISH_WORDS.test(normalized);
}

async function translateTexts(texts: string[]): Promise<Record<string, string>> {
  const uniqueTexts = Array.from(new Set(texts.filter(Boolean)));
  const results: Record<string, string> = {};
  const uncached: string[] = [];

  for (const text of uniqueTexts) {
    const cached = translationCache.get(text);
    if (cached) {
      results[text] = cached;
    } else {
      uncached.push(text);
    }
  }

  if (!uncached.length) return results;

  // Deduplicate with in-flight request
  if (inFlightPromise) {
    const prev = await inFlightPromise;
    for (const text of uncached) {
      if (prev[text]) {
        results[text] = prev[text];
      }
    }
    const stillUncached = uncached.filter(t => !results[t]);
    if (!stillUncached.length) return results;
  }

  // Batch with other pending requests
  pendingTexts.push(...uncached);
  const batch = Array.from(new Set(pendingTexts));
  pendingTexts = [];

  const promise = (async () => {
    try {
      const response = await fetch("/api/i18n/translate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "tr",
          target: "en",
          texts: batch.slice(0, 24), // API limit
        }),
      });

      const payload = (await response.json()) as {
        translations?: Record<string, string>;
      };
      const translations = payload.translations || {};

      for (const text of batch) {
        const translated = translations[text];
        if (translated && translated !== text) {
          translationCache.set(text, translated);
          results[text] = translated;
        } else {
          results[text] = text; // fallback
        }
      }
    } catch {
      // On error, return originals - don't cache so retry works
      for (const text of batch) {
        results[text] = text;
      }
    }
    return results;
  })();

  inFlightPromise = promise;
  const finalResults = await promise;
  inFlightPromise = null;
  return finalResults;
}

export function useFlowTextTranslation(
  texts: string[],
  language: AppLanguage
): string[] {
  const [translated, setTranslated] = useState<string[]>(texts);
  const lastLangRef = useRef(language);
  const lastTextsRef = useRef(texts);

  const doTranslate = useCallback(async () => {
    if (language !== "en") {
      setTranslated(texts);
      return;
    }

    const turkishTexts = texts.filter(looksTurkish);
    if (!turkishTexts.length) {
      setTranslated(texts);
      return;
    }

    const translations = await translateTexts(turkishTexts);
    setTranslated(
      texts.map(text => translations[text] || text)
    );
  }, [texts, language]);

  useEffect(() => {
    const langChanged = lastLangRef.current !== language;
    const textsChanged =
      lastTextsRef.current.length !== texts.length ||
      lastTextsRef.current.some((t, i) => t !== texts[i]);

    if (langChanged || textsChanged) {
      lastLangRef.current = language;
      lastTextsRef.current = texts;
      doTranslate();
    }
  }, [texts, language, doTranslate]);

  return translated;
}

export function useFlowTitleTranslation(
  title: string,
  language: AppLanguage
): string {
  const [translated, setTranslated] = useState(title);

  useEffect(() => {
    if (language !== "en" || !looksTurkish(title)) {
      setTranslated(title);
      return;
    }

    let cancelled = false;
    translateTexts([title]).then(results => {
      if (!cancelled) {
        setTranslated(results[title] || title);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [title, language]);

  return translated;
}

export function useFlowSummaryTranslation(
  summary: string | undefined,
  language: AppLanguage
): string {
  const [translated, setTranslated] = useState(summary || "");

  useEffect(() => {
    if (language !== "en" || !summary || !looksTurkish(summary)) {
      setTranslated(summary || "");
      return;
    }

    let cancelled = false;
    translateTexts([summary]).then(results => {
      if (!cancelled) {
        setTranslated(results[summary] || summary);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [summary, language]);

  return translated;
}

export { looksTurkish };
