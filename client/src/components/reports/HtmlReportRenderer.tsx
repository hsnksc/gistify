import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { BookOpen, Languages } from "lucide-react";
import {
  analyzeFlowReportLanguage,
  type FlowReportLanguageInfo,
} from "@shared/flowLanguage";
import { copy, type AppLanguage } from "@/lib/i18n";

interface HtmlReportRendererProps {
  language?: AppLanguage;
  html: string;
  emptyMessage?: string;
  minimal?: boolean;
  sourceFolder?: string;
  sourceLabel?: string;
  title?: string;
}

interface HtmlSectionLink {
  id: string;
  label: string;
}

interface PreparedHtmlReport {
  sections: HtmlSectionLink[];
  srcDoc: string;
}

interface TranslationRequestMessage {
  instanceId?: string;
  texts?: string[];
  type?: string;
}

const MAX_RUNTIME_TRANSLATION_TEXT_LENGTH = 1800;
const MAX_RUNTIME_TRANSLATION_BATCH_SIZE = 18;
const MAX_RUNTIME_TRANSLATION_BATCH_CHARS = 12000;
const runtimeHtmlTranslationCache = new Map<string, string>();

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeTranslationTexts(texts: string[]) {
  const normalized: string[] = [];
  let totalLength = 0;

  for (const value of texts) {
    if (typeof value !== "string") {
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }

    const sliced = value.slice(0, MAX_RUNTIME_TRANSLATION_TEXT_LENGTH);
    if (!sliced.trim()) {
      continue;
    }

    if (normalized.length >= MAX_RUNTIME_TRANSLATION_BATCH_SIZE) {
      break;
    }

    if (totalLength + sliced.length > MAX_RUNTIME_TRANSLATION_BATCH_CHARS) {
      break;
    }

    normalized.push(sliced);
    totalLength += sliced.length;
  }

  return Array.from(new Set(normalized));
}

async function translateRuntimeHtmlTexts(texts: string[]) {
  const requestedTexts = Array.from(new Set(texts)).filter(Boolean);
  const translations = Object.fromEntries(
    requestedTexts.map(text => [text, runtimeHtmlTranslationCache.get(text) || text])
  ) as Record<string, string>;
  const pendingTexts = requestedTexts.filter(
    text => !runtimeHtmlTranslationCache.has(text)
  );

  if (!pendingTexts.length) {
    return translations;
  }

  const queue = [...pendingTexts];

  while (queue.length > 0) {
    const batch = normalizeTranslationTexts(queue);
    if (!batch.length) {
      break;
    }

    queue.splice(0, batch.length);

    try {
      const response = await fetch("/api/i18n/translate", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "tr",
          target: "en",
          texts: batch,
        }),
      });

      const payload = (await response.json()) as {
        translations?: Record<string, string>;
      };

      const resolvedTranslations = payload.translations || {};
      for (const sourceText of batch) {
        const translated = resolvedTranslations[sourceText];
        // Only cache if translation is different from source (real translation)
        if (translated && translated !== sourceText) {
          runtimeHtmlTranslationCache.set(sourceText, translated);
          translations[sourceText] = translated;
        } else if (!translated) {
          // API returned empty - don't cache, allow retry
          translations[sourceText] = sourceText;
        } else {
          // Same as source - don't cache, might be fallback
          translations[sourceText] = sourceText;
        }
      }
    } catch {
      // Don't cache on error - allow retry next time
      for (const sourceText of batch) {
        translations[sourceText] = sourceText;
      }
    }
  }

  return translations;
}

function slugifySectionId(value: string) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function getPlainText(value: string) {
  if (typeof window === "undefined") {
    return normalizeText(value.replace(/<[^>]+>/g, " "));
  }

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return normalizeText(textarea.value.replace(/<[^>]+>/g, " "));
}

function getLocalizedNodeText(element: Element, language: AppLanguage) {
  const clone = element.cloneNode(true) as Element;
  const hiddenSelectors =
    language === "en"
      ? [".tr-only", ".tr", '[data-lang="tr"]', '[data-lang-inline="tr"]']
      : [".en-only", ".en", '[data-lang="en"]', '[data-lang-inline="en"]'];
  clone.querySelectorAll(hiddenSelectors.join(", ")).forEach(node => node.remove());
  return getPlainText(clone.textContent || "");
}

function dedupeSections(items: HtmlSectionLink[]) {
  const seen = new Set<string>();
  const deduped: HtmlSectionLink[] = [];

  for (const item of items) {
    const id = item.id.trim();
    const label = normalizeText(item.label);
    if (!id || !label || seen.has(id)) {
      continue;
    }

    seen.add(id);
    deduped.push({ id, label });
  }

  return deduped;
}

function buildPreparedHtmlReport(
  html: string,
  instanceId: string,
  language: AppLanguage
): PreparedHtmlReport | null {
  if (!html.trim() || typeof window === "undefined") {
    return null;
  }

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(html, "text/html");
  const bodyClone = documentNode.body.cloneNode(true) as HTMLBodyElement;
  const reportLanguage = language === "en" ? "en" : "tr";
  bodyClone.querySelectorAll("nav, footer").forEach(node => node.remove());
  const topHeader = bodyClone.querySelector("header");
  if (topHeader && topHeader.parentElement === bodyClone) {
    topHeader.remove();
  }

  const heroNode = bodyClone.querySelector<HTMLElement>("#hero, .hero");
  if (heroNode && !heroNode.id) {
    heroNode.id = "hero";
  }

  const generatedSections = Array.from(
    bodyClone.querySelectorAll<HTMLElement>(".section-head")
  ).map((sectionHead, index) => {
    const labelNode = sectionHead.querySelector(".section-title, h1, h2, h3");
    const label = labelNode
      ? getLocalizedNodeText(labelNode, language)
      : getPlainText(sectionHead.textContent || "");
    const sectionId =
      sectionHead.id ||
      `gistify-section-${slugifySectionId(label || String(index + 1)) || index + 1}`;
    sectionHead.id = sectionId;
    return {
      id: sectionId,
      label,
    };
  });

  const navSections = Array.from(
    documentNode.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]')
  ).map(link => ({
    id: (link.getAttribute("href") || "").replace(/^#/, ""),
    label: getLocalizedNodeText(link, language),
  }));

  const heroSection = bodyClone.querySelector("#hero")
    ? [
        {
          id: "hero",
          label: copy(language, "Genel Bakis", "Overview"),
        },
      ]
    : [];

  const fallbackSections = Array.from(
    bodyClone.querySelectorAll<HTMLElement>("section[id]")
  ).map(section => ({
    id: section.id,
    label: section.querySelector("h1, h2, h3")
      ? getLocalizedNodeText(
          section.querySelector("h1, h2, h3") as Element,
          language
        )
      : getPlainText(section.id),
  }));

  let bodyHtml = bodyClone.innerHTML;
  bodyHtml = bodyHtml
    .replace(
      /let\s+currentLang\s*=\s*['"](tr|en)['"]\s*;/g,
      `let currentLang = '${reportLanguage}';`
    )
    .replace(
      /window\.setLanguage\(\s*['"](tr|en)['"]\s*\)\s*;/g,
      `window.setLanguage('${reportLanguage}');`
    );

  const bodyClassName = [
    ...Array.from(
      new Set(
        `${documentNode.body.className} ${reportLanguage === "en" ? "lang-en" : "lang-tr"}`
          .split(/\s+/)
          .map(item => item.trim())
          .filter(item => item && item !== "lang-tr" && item !== "lang-en")
      )
    ),
    reportLanguage === "en" ? "lang-en" : "lang-tr",
  ].join(" ");

  const sections = dedupeSections([
    ...heroSection,
    ...navSections,
    ...generatedSections,
    ...fallbackSections,
  ]).slice(0, 12);

  const helperScript = `
<script>
(() => {
  const instanceId = ${JSON.stringify(instanceId)};
  const preferredLanguage = ${JSON.stringify(reportLanguage)};
  const MAX_TEXT_LENGTH = ${MAX_RUNTIME_TRANSLATION_TEXT_LENGTH};
  const MAX_BATCH_SIZE = ${MAX_RUNTIME_TRANSLATION_BATCH_SIZE};
  const MAX_BATCH_CHARS = ${MAX_RUNTIME_TRANSLATION_BATCH_CHARS};
  const pendingTranslations = new Set();
  const translationNodesBySource = new Map();
  const resolvedTranslations = new Map();
  let translationInFlight = false;
  let translationScheduled = false;

  const normalizeAscii = value =>
    String(value || "")
      .toLocaleLowerCase("tr-TR")
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u");

  const looksTurkish = value => {
    const source = String(value || "");
    const trimmed = source.trim();
    if (!trimmed || trimmed.length > MAX_TEXT_LENGTH) {
      return false;
    }
    if (/^[\\d\\s.,:%$+\\-()/#]+$/.test(trimmed)) {
      return false;
    }

    const normalized = normalizeAscii(trimmed);
    return (
      /[çğıöşüÇĞİÖŞÜ]/.test(trimmed) ||
      /\\b(?:ve|ile|icin|olarak|guncel|gunluk|sabit|beklenti|rapor|tarih|son|orani|risk|oneri|analiz|degisim|gelir|kar|fiyat|hisse|borsa|sirket|arsiv|ceviri|dil|kismi|ozet)\\b/i.test(normalized)
    );
  };

  const isNodeHidden = node => {
    const parent = node.parentElement;
    if (!parent) {
      return true;
    }
    if (parent.closest("script, style, textarea, input, pre, code, noscript")) {
      return true;
    }
    const style = window.getComputedStyle(parent);
    return style.display === "none" || style.visibility === "hidden";
  };

  const queueTranslationNode = node => {
    if (!node || isNodeHidden(node)) {
      return;
    }

    const source = node.nodeValue || "";
    if (!looksTurkish(source)) {
      return;
    }

    const resolved = resolvedTranslations.get(source);
    if (resolved) {
      if (node.nodeValue !== resolved) {
        node.nodeValue = resolved;
      }
      return;
    }

    const existing = translationNodesBySource.get(source);
    if (existing) {
      existing.push(node);
    } else {
      translationNodesBySource.set(source, [node]);
    }
    pendingTranslations.add(source);
  };

  const collectTranslationNodes = root => {
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
    let current = walker.nextNode();

    while (current) {
      queueTranslationNode(current);
      current = walker.nextNode();
    }
  };

  const syncDataLangVisibility = () => {
    document.querySelectorAll("[data-lang]").forEach(node => {
      node.classList.toggle("visible", node.getAttribute("data-lang") === preferredLanguage);
    });
    document.querySelectorAll("[data-lang-inline]").forEach(node => {
      node.classList.toggle(
        "visible",
        node.getAttribute("data-lang-inline") === preferredLanguage
      );
    });
    document.querySelectorAll(".lang-btn").forEach(node => {
      const label = (node.textContent || "").trim().toLowerCase();
      node.classList.toggle("active", label === preferredLanguage);
    });
    document.documentElement.lang = preferredLanguage;
  };

  const applyPreferredLanguage = () => {
    if (typeof window.setLanguage === "function") {
      window.setLanguage(preferredLanguage);
      return;
    }
    if (typeof window.setLang === "function") {
      window.setLang(preferredLanguage);
      return;
    }

    if (document.body) {
      document.body.classList.remove("lang-tr", "lang-en");
      document.body.classList.add(preferredLanguage === "en" ? "lang-en" : "lang-tr");
    }
    syncDataLangVisibility();
  };

  const postHeight = () => {
    const height = Math.max(
      document.documentElement ? document.documentElement.scrollHeight : 0,
      document.body ? document.body.scrollHeight : 0
    );
    parent.postMessage({ type: "gistify-flow-html-height", instanceId, height }, "*");
  };

  const scheduleHeight = () => window.requestAnimationFrame(postHeight);

  const flushTranslations = () => {
    translationScheduled = false;

    if (
      preferredLanguage !== "en" ||
      translationInFlight ||
      pendingTranslations.size === 0
    ) {
      return;
    }

    const batch = [];
    let batchCharCount = 0;

    for (const source of Array.from(pendingTranslations)) {
      const wouldExceedChars =
        batch.length > 0 && batchCharCount + source.length > MAX_BATCH_CHARS;

      if (batch.length >= MAX_BATCH_SIZE || wouldExceedChars) {
        break;
      }

      batch.push(source);
      batchCharCount += source.length;
    }

    batch.forEach(source => pendingTranslations.delete(source));

    if (!batch.length) {
      return;
    }

    translationInFlight = true;
    parent.postMessage(
      {
        type: "gistify-flow-html-translate-request",
        instanceId,
        texts: batch,
      },
      "*"
    );
  };

  const scheduleTranslations = () => {
    if (
      preferredLanguage !== "en" ||
      translationInFlight ||
      pendingTranslations.size === 0 ||
      translationScheduled
    ) {
      return;
    }

    translationScheduled = true;
    window.requestAnimationFrame(flushTranslations);
  };

  const applyTranslationResponse = translations => {
    translationInFlight = false;
    const nextTranslations = translations && typeof translations === "object" ? translations : {};

    Object.entries(nextTranslations).forEach(([source, translated]) => {
      const resolved =
        typeof translated === "string" && translated.trim() ? translated : source;
      resolvedTranslations.set(source, resolved);
      const nodes = translationNodesBySource.get(source) || [];
      nodes.forEach(node => {
        if (node && node.nodeValue !== resolved) {
          node.nodeValue = resolved;
        }
      });
      translationNodesBySource.delete(source);
    });

    if (pendingTranslations.size > 0) {
      scheduleTranslations();
    }
    scheduleHeight();
  };

  const translateVisibleTurkishText = () => {
    if (preferredLanguage !== "en") {
      return;
    }
    collectTranslationNodes(document.body);
    scheduleTranslations();
  };

  applyPreferredLanguage();

  window.addEventListener("load", () => {
    applyPreferredLanguage();
    translateVisibleTurkishText();
    postHeight();
    window.setTimeout(postHeight, 250);
    window.setTimeout(postHeight, 1000);
    window.setTimeout(postHeight, 2000);
  });

  window.addEventListener("resize", postHeight);

  new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (
        mutation.type === "characterData" &&
        mutation.target.nodeType === Node.TEXT_NODE
      ) {
        queueTranslationNode(mutation.target);
        continue;
      }

      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          queueTranslationNode(node);
          return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          collectTranslationNodes(node);
        }
      });
    }

    scheduleTranslations();
    scheduleHeight();
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  });

  window.addEventListener("message", event => {
    const data = event.data;
    if (!data || data.instanceId !== instanceId) {
      return;
    }

    if (data.type === "gistify-flow-html-scroll") {
      const target = document.getElementById(String(data.sectionId || ""));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (data.type === "gistify-flow-html-translate-response") {
      applyTranslationResponse(data.translations);
    }
  });

  window.setTimeout(translateVisibleTurkishText, 140);
})();
</script>`;

  const layoutStyle = `
<style>
html, body {
  background: #050c1b !important;
}
body {
  margin: 0 !important;
}
#hero {
  padding-top: 48px !important;
}
section {
  scroll-margin-top: 24px;
}
</style>`;

  return {
    sections,
    srcDoc: `<!doctype html>
<html lang="${reportLanguage}">
<head>
${documentNode.head.innerHTML}
${layoutStyle}
</head>
<body class="${bodyClassName}">
${bodyHtml}
${helperScript}
</body>
</html>`,
  };
}

function getTranslationNotice(
  language: AppLanguage,
  languageInfo: FlowReportLanguageInfo
) {
  if (language !== "en") {
    return null;
  }

  if (languageInfo.languageMode === "tr") {
    return {
      body: copy(
        language,
        "Kaynak rapor Turkce. Gorunur kalan Turkce bolumler icin calisma aninda Ingilizce fallback uygulanir.",
        "The source report is Turkish. Visible Turkish passages are translated into English at runtime as a fallback."
      ),
      title: copy(language, "Canli Ceviri", "Runtime Translation"),
    };
  }

  if (
    languageInfo.languageMode === "bilingual" &&
    languageInfo.translationState === "partial"
  ) {
    return {
      body: copy(
        language,
        "Raporun gomulu EN kopyasi kismi. Eksik kalan Turkce bolumler mumkun oldugunda otomatik Ingilizceye cevrilir.",
        "The embedded English copy is partial. Remaining Turkish sections are translated into English automatically when possible."
      ),
      title: copy(language, "Kismi Ceviri", "Partial Translation"),
    };
  }

  return null;
}

export default function HtmlReportRenderer({
  language = "tr",
  html,
  emptyMessage,
  minimal = false,
  sourceFolder = "",
  sourceLabel = "",
  title = "",
}: HtmlReportRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const rawInstanceId = useId();
  const instanceId = useMemo(
    () => rawInstanceId.replace(/[:]/g, "-"),
    [rawInstanceId]
  );
  const prepared = useMemo(
    () => buildPreparedHtmlReport(html, instanceId, language),
    [html, instanceId, language]
  );
  const languageInfo = useMemo(
    () =>
      analyzeFlowReportLanguage({
        contentFormat: "html",
        html,
        sourceFolder,
        sourceLabel,
        title,
      }),
    [html, sourceFolder, sourceLabel, title]
  );
  const translationNotice = useMemo(
    () => getTranslationNotice(language, languageInfo),
    [language, languageInfo]
  );
  const [iframeHeight, setIframeHeight] = useState(1600);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      const data = event.data as
        | {
            height?: number;
            instanceId?: string;
            type?: string;
          }
        | undefined;

      if (
        !data ||
        data.type !== "gistify-flow-html-height" ||
        data.instanceId !== instanceId ||
        typeof data.height !== "number" ||
        !Number.isFinite(data.height)
      ) {
        return;
      }

      setIframeHeight(Math.max(900, Math.min(24000, Math.ceil(data.height))));
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [instanceId]);

  useEffect(() => {
    if (typeof window === "undefined" || language !== "en") {
      return;
    }

    const handleTranslationRequest = async (event: MessageEvent) => {
      const data = event.data as TranslationRequestMessage | undefined;
      if (
        !data ||
        data.type !== "gistify-flow-html-translate-request" ||
        data.instanceId !== instanceId ||
        !Array.isArray(data.texts) ||
        !iframeRef.current?.contentWindow
      ) {
        return;
      }

      const texts = data.texts.filter(
        (value): value is string => typeof value === "string" && value.trim().length > 0
      );
      if (!texts.length) {
        return;
      }

      const translations = await translateRuntimeHtmlTexts(texts);
      iframeRef.current.contentWindow.postMessage(
        {
          type: "gistify-flow-html-translate-response",
          instanceId,
          translations,
        },
        "*"
      );
    };

    window.addEventListener("message", handleTranslationRequest);
    return () => window.removeEventListener("message", handleTranslationRequest);
  }, [instanceId, language]);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "gistify-flow-html-scroll",
          instanceId,
          sectionId,
        },
        "*"
      );
    },
    [instanceId]
  );

  if (!prepared) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background/40 p-6 text-sm leading-7 text-muted-foreground">
        {emptyMessage ||
          copy(
            language,
            "Kaynak HTML icerigi gosterilemedi.",
            "The source HTML content could not be displayed."
          )}
      </div>
    );
  }

  if (!prepared) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background/40 p-6 text-sm leading-7 text-muted-foreground">
        {emptyMessage ||
          copy(
            language,
            "HTML rapor icerigi gosterilemedi.",
            "The HTML report content could not be displayed."
          )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {translationNotice && !minimal ? (
        <section className="rounded-xl border border-amber-400/25 bg-amber-500/8 p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <Languages className="mt-0.5 size-4 text-amber-300" />
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                {translationNotice.title}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {translationNotice.body}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {prepared.sections.length > 1 && !minimal ? (
        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-emerald-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {copy(language, "Bolum Haritasi", "Section Map")}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {prepared.sections.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="rounded-full border border-border bg-background/65 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-emerald-400/35 hover:text-emerald-300"
              >
                {section.label}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-border bg-card/90 shadow-xl">
        <iframe
          ref={iframeRef}
          title={copy(language, "HTML rapor gorunumu", "HTML report view")}
          srcDoc={prepared.srcDoc}
          sandbox="allow-scripts"
          className="block w-full border-0 bg-[#050c1b]"
          style={{ height: `${iframeHeight}px` }}
        />
      </section>

      {prepared.sections.length > 1 && !minimal ? (
        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            {copy(language, "Hizli Gecis", "Quick Jump")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {prepared.sections.map(section => (
              <button
                key={`${section.id}-bottom`}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="rounded-full border border-border bg-background/65 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-sky-400/35 hover:text-sky-200"
              >
                {section.label}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}


