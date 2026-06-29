import { useState, useEffect, useCallback, useRef } from "react";
import type { AppLanguage } from "@/lib/i18n";

const TURKISH_CHARS = /[çğıöşüÇĞİÖŞÜ]/;

// Basit kelime seti — yaygın Türkçe kelimeler (ASCII normalize edilmiş)
const TURKISH_WORDS_SET = new Set([
  "ve", "ile", "icin", "olarak", "guncel", "gunluk", "sabit", "beklenti", "rapor",
  "tarih", "son", "orani", "risk", "oneri", "analiz", "analizi", "degisim", "gelir",
  "gelirse", "kar", "fiyat", "hisse", "hissesi", "borsa", "sirket", "arsiv", "ceviri",
  "dil", "kismi", "ozet", "haziran", "temmuz", "agustos", "eylul", "ekim", "kasim",
  "aralik", "ocak", "subat", "mart", "nisan", "mayis", "durum", "guclu", "kapsamli",
  "kapsamlı", "derin", "oncesi", "sonrasi", "aciklamasi", "yorum", "tahmin",
  "beklentisi", "onay", "onemi", "etkisi", "sonucu", "nedeni", "amaci", "konusu",
  "hakkinda", "hakkında", "neden", "nasil", "nasıl", "ne", "kim", "nerede",
  "ne zaman", "nicin", "hangi", "kadar", "daha", "en", "veya", "ya", "ya da",
  "fakat", "ancak", "ama", "lakin", "yine", "hala", "henuz", "henüz", "simdi",
  "şimdi", "bugun", "bugün", "dun", "dün", "yarindan", "yarından", "sonra", "once",
  "önce", "onceki", "önceki", "sonraki", "icinde", "içinde", "disinda", "dışında",
  "arada", "yaninda", "yanında", "altinda", "altında", "ustunde", "üstünde", "onunde",
  "önünde", "arkasinda", "arkasında", "karsisinda", "karşısında", "boyunca", "sirasinda",
  "sırasında", "zamaninda", "zamanında", "noktasinda", "noktasında", "durumunda",
  "halinde", "sebebiyle", "sayesinde", "yardimiyla", "yardımıyla", "araciligiyla",
  "aracılığıyla", "vastasiyla", "uzerinden", "üzerinden", "uzerine", "üzerine",
  "geregince", "gereğince", "gore", "göre", "nazaran", "oranla", "kiyasla", "kıyasla",
  "beraber", "birlikte", "dek", "degince", "değince", "kalmak", "kalmadan", "gelmek",
  "gelince", "geldiginde", "geldığında", "oldugunda", "olduğunda", "olunca", "olur",
  "olmaz", "olabilir", "olmustur", "olmuştur", "olacak", "oldu", "oldugu", "olduğu",
  "olan", "olmayan", "eden", "edenler", "yapan", "yapanlar", "yapilan", "yapılan",
  "yapilanlar", "yapılanlar", "kalan", "kalanlar", "gelen", "gelenler", "giden",
  "gidenler", "bulunan", "bulunanlar", "vardir", "vardır", "yoktur", "mevcut",
  "bulunmaktadir", "bulunmaktadır", "yer almaktadir", "yer almaktadır", "yer alir",
  "yer alır", "alir", "alır", "gelir", "gider", "cikar", "çıkar", "duser", "düşer",
  "yukselir", "yükselir", "degisir", "değişir", "artar", "azalir", "azalır", "baslar",
  "başlar", "biter", "devam eder", "surmektedir", "sürmektedir", "gerceklestirilmistir",
  "gercekleştirilmiştir", "gerceklestirilmektedir", "gercekleştirilmektedir",
  "planlanmistir", "planlanmıştır", "on gorulmektedir", "ön görülmektedir",
  "beklenmektedir", "tahmin edilmektedir", "ongorulmektedir", "öngörülmektedir",
  "tahmin edilmistir", "tahmin edilmiştir", "ongorulmustur", "öngörülmüştür",
  "belirtilmistir", "belirtilmiştir", "aciklanmistir", "açıklanmıştir",
  "bildirilmistir", "bildirilmiştir", "duyurulmustur", "duyurulmuştur",
  "ilan edilmistir", "ilan edilmiştir", "yayinlanmistir", "yayınlanmıştir",
  "sunulmustur", "sunulmuştur", "verilmistir", "verilmiştir", "hazirlanmistir",
  "hazırlanmıştir", "olusturulmustur", "oluşturulmuşutur", "yazilmistir",
  "yazılmıştir", "okunmustur", "okunmuştur", "gorulmustur", "görülmüştür",
  "incelenmistir", "incelenmiştir", "degerlendirilmistir", "değerlendirilmiştir",
  "karsilastirilmistir", "karşılaştırılmıştir", "siralanmistir", "sıralanmıştir",
  "listelenmistir", "listelenmiştir", "paylasilmistir", "paylaşılmıştir",
  "gonderilmistir", "gönderilmiştir", "alimistir", "alımıştir", "satilmistir",
  "satılmıştir", "alinmistir", "alınmıştir", "kiralanmistir", "kiralanmıştir",
  "tutulmustur", "tutulmuştur", "takip edilmistir", "takip edilmiştir",
  "izlenmistir", "izlenmiştir", "kontrol edilmistir", "kontrol edilmiştir",
  "denetlenmistir", "denetlenmiştir", "test edilmistir", "test edilmiştir",
  "onaylanmistir", "onaylanmıştir", "reddedilmistir", "reddedilmiştir",
  "kabul edilmistir", "kabul edilmiştir", "sonuclandirilmistir",
  "sonuçlandırılmıştir", "tamamlanmistir", "tamamlanmıştir", "bitirilmistir",
  "bitirilmiştir", "baslatilmistir", "başlatılmıştir", "durdurulmustur",
  "durdurulmuştur", "ertelenmistir", "ertelenmiştir", "iptal edilmistir",
  "iptal edilmiştir", "degistirilmistir", "değiştirilmiştir", "guncellenmistir",
  "güncellenmiştir", "revize edilmistir", "revize edilmiştir", "duzeltilmistir",
  "düzeltilmiştir", "eklenmistir", "eklenmiştir", "cikarilmistir", "çıkarılmıştir",
  "kaldırilmistir", "kaldırılmıştir", "konulmustur", "konulmuştur",
  "yerlestirilmistir", "yerleştirilmiştir", "ayarlanmistir", "ayarlanmıştir",
  "hazirlanmistir", "hazırlanmıştir", "duzenlenmistir", "düzenlenmiştir",
  "tasarlanmistir", "tasarlanmıştir", "gelistirilmistir", "geliştirilmiştir",
  "uretilmistir", "üretilmiştir", "satin alinmistir", "satın alınmıştir",
  "ithal edilmistir", "ithal edilmiştir", "ihraç edilmistir", "ihraç edilmiştir",
  "tasinmistir", "taşınmıştir", "saklanmistir", "saklanmıştir", "korunmustur",
  "korunmuştur", "muhafaza edilmistir", "muhafaza edilmiştir", "gizlenmistir",
  "gizlenmiştir", "ortaya cikarilmistir", "ortaya çıkarılmıştir",
  "aciga cikarilmistir", "açığa çıkarılmıştir", "belirginlesmistir",
  "belirginleşmiştir", "ortadan kalkmistir", "ortadan kalkmıştir",
  "cozulmustur", "çözülmüştür", "ayrilmistir", "ayrılmıştir", "birlesmistir",
  "birleşmiştir", "parcalanmistir", "parçalanmıştir", "bolunmustur",
  "bölünmüştür", "toplanmistir", "toplanmıştir", "dagitilmistir",
  "dağıtılmıştir", "yayilmistir", "yayılmıştir", "genislemistir",
  "genişlemiştir", "daralmistir", "daralmıştir", "yukselmistir",
  "yükselmiştir", "dusmustur", "düşmüştür", "artmistir", "artmıştir",
  "azalmistir", "azalmıştir", "degismistir", "değişmiştir", "donmustur",
  "donmuştur", "erimistir", "erimiştir", "buharlasimistir", "buharlaşmıştir",
  "donmusmistir", "donmuşmuştur", "yogunlasmistir", "yoğunlaşmıştir",
  "seyrelmistir", "seyreltmiştir", "kalinlastirmistir", "kalınlaştırılmıştir",
  "inceltilmistir", "inceltilmiştir", "uzatilmistir", "uzatılmıştir",
  "kisaltilmistir", "kısaltılmıştir", "genisletilmistir", "genişletilmiştir",
  "daraltimistir", "daraltılmıştir", "yukseklmistir", "yükseklmiştir",
  "alcaltilmistir", "alçaltılmıştir", "hizlandirilmistir", "hızlandırılmıştir",
  "yavaslatimistir", "yavaşlatılmıştir", "guclendirilmistir", "güçlendirilmiştir",
  "zayiflatimistir", "zayıflatılmıştir", "artirilmistir", "artırılmıştir",
  "azaltilmistir", "azaltılmıştir", "buyutulmustur", "büyütülmüştür",
  "kucultulmustur", "küçültülmüştür", "sezon", "sezonsellik", "sezonselliği",
  "dusuk", "düşük", "senaryo", "senaryosu", "senedi", "sene",
]);

const translationCache = new Map<string, string>();
let inFlightPromise: Promise<Record<string, string>> | null = null;
let pendingTexts: string[] = [];

function normalizeForTurkishCheck(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/İ/g, "i")
    .replace(/[^a-z0-9\s]/gi, " ");
}

function looksTurkish(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 3) return false;
  if (/^[\d\s.,:%$+\-()/#]+$/.test(trimmed)) return false;

  // 1. Hızlı kontrol: Türkçe karakter varsa
  if (TURKISH_CHARS.test(trimmed)) return true;

  // 2. Normalize edilmiş metinde Türkçe kelimeleri ara
  const normalized = normalizeForTurkishCheck(trimmed);
  const words = normalized.split(/\s+/).filter(w => w.length >= 3);
  for (const word of words) {
    if (TURKISH_WORDS_SET.has(word)) return true;
  }

  return false;
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
