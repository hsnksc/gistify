import { useCallback, useEffect, useId, useMemo, useRef, useState, } from "react";
import { BookOpen, Languages } from "lucide-react";
import type { DailyReportLanguage } from "@shared/dailyReports";
import {
  analyzeFlowReportLanguage, type FlowReportLanguageInfo, } from "@shared/flowLanguage";
import { type AppLanguage, t } from "@/lib/i18n";

interface HtmlReportRendererProps {
  language?: AppLanguage;
  html: string;
  emptyMessage?: string;
  minimal?: boolean;
  sourceFolder?: string;
  sourceLabel?: string;
  title?: string;
  availableLanguages?: DailyReportLanguage[];
  onLanguageChange?: (lang: DailyReportLanguage) => void;
}

interface HtmlSectionLink {
  id: string;
  label: string;
}

interface PreparedHtmlReport {
  sections: HtmlSectionLink[];
  srcDoc: string;
}

const FLOW_CHROME_SELECTOR = [
  "header#header",
  "header.header",
  "footer#footer",
  "footer.footer",
  "aside#sidebar",
  "aside.sidebar",
  "nav#sidebar",
  "nav.sidebar",
  "nav.toc-nav",
  ".toc",
  ".toc-title",
  ".toc-nav",
  ".toc-list",
  ".lang-toggle",
  ".lang-switch",
].join(", ");

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
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

function matchesPreferredLanguageRoot(
  element: HTMLElement,
  reportLanguage: "tr" | "en"
) {
  const normalizedId = element.id.trim().toLowerCase();
  const dataLang = (element.getAttribute("data-lang") || "").trim().toLowerCase();

  if (dataLang === reportLanguage) {
    return true;
  }

  return (
    normalizedId === `content-${reportLanguage}` ||
    normalizedId === `${reportLanguage}-content`
  );
}

function findPreferredLanguageRoot(
  root: ParentNode,
  reportLanguage: "tr" | "en"
) {
  const explicitMatch = root.querySelector<HTMLElement>(
    `#content-${reportLanguage}, #${reportLanguage}-content`
  );
  if (explicitMatch) {
    return explicitMatch;
  }

  const languageContainers = Array.from(
    root.querySelectorAll<HTMLElement>(".lang-content")
  );
  return (
    languageContainers.find(node =>
      matchesPreferredLanguageRoot(node, reportLanguage)
    ) || null
  );
}

function buildNormalizedBodyNode(
  documentNode: Document,
  sourceBody: HTMLElement,
  reportLanguage: "tr" | "en"
) {
  const bodyClone = sourceBody.cloneNode(true) as HTMLBodyElement;
  bodyClone.querySelectorAll("script").forEach(node => node.remove());

  const preferredLanguageRoot = findPreferredLanguageRoot(
    bodyClone,
    reportLanguage
  );
  const languageContainers = Array.from(
    bodyClone.querySelectorAll<HTMLElement>(".lang-content")
  );

  if (preferredLanguageRoot) {
    languageContainers.forEach(node => {
      if (node === preferredLanguageRoot) {
        node.classList.add("active");
      } else {
        node.remove();
      }
    });
  }

  const oppositeLanguage = reportLanguage === "en" ? "tr" : "en";
  bodyClone
    .querySelectorAll(
      `.${oppositeLanguage}-only, .${oppositeLanguage}, [data-lang="${oppositeLanguage}"], [data-lang-inline="${oppositeLanguage}"]`
    )
    .forEach(node => node.remove());
  bodyClone
    .querySelectorAll(
      `#content-${oppositeLanguage}, #${oppositeLanguage}-content`
    )
    .forEach(node => node.remove());

  bodyClone
    .querySelectorAll(FLOW_CHROME_SELECTOR)
    .forEach(node => node.remove());

  const heroNode = bodyClone.querySelector<HTMLElement>("#hero, .hero");
  if (heroNode && !heroNode.id) {
    heroNode.id = "hero";
  }

  const contentRoot =
    (preferredLanguageRoot && bodyClone.contains(preferredLanguageRoot)
      ? preferredLanguageRoot
      : bodyClone.querySelector<HTMLElement>(
          "main, article, .content, .report-shell, .wrap"
        )) || bodyClone;

  if (contentRoot === bodyClone) {
    return bodyClone;
  }

  const normalizedBody = documentNode.createElement("body") as HTMLBodyElement;
  const shell = documentNode.createElement("main");
  shell.className = "gistify-flow-shell";
  if (heroNode && !contentRoot.contains(heroNode)) {
    shell.appendChild(heroNode.cloneNode(true));
  }
  shell.appendChild(contentRoot.cloneNode(true));
  normalizedBody.appendChild(shell);

  return normalizedBody;
}

function buildPreparedHtmlReport(
  html: string,
  instanceId: string,
  language: AppLanguage,
  availableLanguages?: DailyReportLanguage[]
): PreparedHtmlReport | null {
  if (!html.trim() || typeof window === "undefined") {
    return null;
  }

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(html, "text/html");
  const reportLanguage = language === "en" ? "en" : "tr";
  const bodyClone = buildNormalizedBodyNode(
    documentNode,
    documentNode.body,
    reportLanguage
  );

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
    bodyClone.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
  ).map(link => ({
    id: (link.getAttribute("href") || "").replace(/^#/, ""),
    label: getLocalizedNodeText(link, language),
  }));

  const heroSection = bodyClone.querySelector("#hero")
    ? [
        {
          id: "hero",
          label: t("flow:overview"),
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

  const bodyHtml = bodyClone.innerHTML;

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
  let activeLanguage = preferredLanguage;

  const normalizeAscii = value =>
    String(value || "")
      .toLocaleLowerCase("tr-TR")
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u");

  const updateBodyLanguageClass = languageCode => {
    if (!document.body) {
      return;
    }
    document.body.classList.remove("lang-tr", "lang-en");
    document.body.classList.add(languageCode === "en" ? "lang-en" : "lang-tr");
  };

  const syncDataLangVisibility = (languageCode = activeLanguage) => {
    document.querySelectorAll("[data-lang]").forEach(node => {
      node.classList.toggle("visible", node.getAttribute("data-lang") === languageCode);
    });
    document.querySelectorAll("[data-lang-inline]").forEach(node => {
      node.classList.toggle(
        "visible",
        node.getAttribute("data-lang-inline") === languageCode
      );
    });
    document.querySelectorAll(".lang-btn").forEach(node => {
      const label = (node.textContent || "").trim().toLowerCase();
      node.classList.toggle("active", label === languageCode);
    });
    document
      .querySelectorAll(".langtoggle button, .lang-toggle button, .lang-switch button")
      .forEach(node => {
        const rawLabel =
          node.getAttribute("data-lang") ||
          node.getAttribute("lang") ||
          node.textContent ||
          "";
        const normalizedLabel = normalizeAscii(rawLabel);
        const targetLanguage = normalizedLabel.includes("en") ? "en" : "tr";
        node.classList.toggle("active", targetLanguage === languageCode);
        node.classList.toggle("on", targetLanguage === languageCode);
      });
    document.documentElement.lang = languageCode;
  };

  const setElementDisplay = (element, visible, displayValue = "block") => {
    if (!element) {
      return;
    }

    if (visible) {
      element.removeAttribute("hidden");
      element.style.display = displayValue;
      return;
    }

    element.setAttribute("hidden", "true");
    element.style.display = "none";
  };

  const syncSectionHeadState = sectionHead => {
    if (!(sectionHead instanceof HTMLElement)) {
      return;
    }

    const isCollapsed = sectionHead.classList.contains("collapsed");
    const nestedBodies = Array.from(sectionHead.children).filter(
      node => node instanceof HTMLElement && node.classList.contains("section-body")
    );
    const siblingBody =
      sectionHead.nextElementSibling instanceof HTMLElement &&
      sectionHead.nextElementSibling.classList.contains("section-body")
        ? sectionHead.nextElementSibling
        : null;

    [...nestedBodies, siblingBody].filter(Boolean).forEach(node => {
      setElementDisplay(node, !isCollapsed);
    });
  };

  const syncCardState = card => {
    if (!(card instanceof HTMLElement)) {
      return;
    }

    const isOpen = card.classList.contains("open");
    Array.from(card.children)
      .filter(
        node => node instanceof HTMLElement && node.classList.contains("cbody")
      )
      .forEach(node => {
        setElementDisplay(node, isOpen);
      });

    const expander = card.querySelector(".exp");
    if (expander) {
      expander.textContent = isOpen ? "−" : "＋";
    }
  };

  const ensureTargetVisible = target => {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const card = target.closest(".card[id^='card-']");
    if (card instanceof HTMLElement) {
      card.classList.add("open");
      syncCardState(card);
    }

    let current = target;
    while (current) {
      if (current.classList.contains("section-body")) {
        const siblingHead = current.previousElementSibling;
        if (
          siblingHead instanceof HTMLElement &&
          siblingHead.classList.contains("section-head")
        ) {
          siblingHead.classList.remove("collapsed");
          syncSectionHeadState(siblingHead);
        }
      }

      if (current.classList.contains("section-head")) {
        current.classList.remove("collapsed");
        syncSectionHeadState(current);
      }

      current = current.parentElement;
    }
  };

  const scrollToTarget = sectionId => {
    const normalizedSectionId = String(sectionId || "").replace(/^#/, "");
    if (!normalizedSectionId) {
      return;
    }

    const target = document.getElementById(normalizedSectionId);
    if (!target) {
      return;
    }

    ensureTargetVisible(target);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    scheduleHeight();
  };

  const initializeInteractiveShell = () => {
    document.querySelectorAll(".section-head").forEach(node => {
      syncSectionHeadState(node);
    });
    document.querySelectorAll(".card[id^='card-']").forEach(node => {
      syncCardState(node);
    });
    applyCardFilters();
  };

  let activeCardSignal = "ALL";
  let activeCardQuery = "";

  const applyCardFilters = () => {
    const filterableCards = Array.from(
      document.querySelectorAll(".card[data-sig], .chip[data-sig]")
    );
    if (!filterableCards.length) {
      return false;
    }

    const normalizedSignal = String(activeCardSignal || "ALL").toUpperCase();
    const normalizedQuery = String(activeCardQuery || "").toLowerCase().trim();

    filterableCards.forEach(node => {
      const symbol = String(node.getAttribute("data-sym") || "").toLowerCase();
      const name = String(node.getAttribute("data-name") || "").toLowerCase();
      const signal = String(node.getAttribute("data-sig") || "").toUpperCase();
      const matchesQuery =
        !normalizedQuery ||
        symbol.includes(normalizedQuery) ||
        name.includes(normalizedQuery);
      const matchesSignal =
        normalizedSignal === "ALL" || signal === normalizedSignal;

      node.classList.toggle("hide", !(matchesQuery && matchesSignal));
    });

    return true;
  };

  const activateLanguageContent = languageCode => {
    const normalizedLanguage = languageCode === "en" ? "en" : "tr";
    const preferredRoot =
      document.getElementById("content-" + normalizedLanguage) ||
      document.getElementById(normalizedLanguage + "-content") ||
      document.querySelector('.lang-content[data-lang="' + normalizedLanguage + '"]');
    const languageBlocks = Array.from(document.querySelectorAll(".lang-content"));

    if (!languageBlocks.length) {
      return;
    }

    languageBlocks.forEach((node, index) => {
      const isActive = preferredRoot ? node === preferredRoot : index === 0;
      node.classList.toggle("active", isActive);
      if (isActive) {
        node.setAttribute("data-active-language", normalizedLanguage);
      } else {
        node.removeAttribute("data-active-language");
      }
    });
  };

  const applyLanguage = languageCode => {
    activeLanguage = languageCode === "en" ? "en" : "tr";
    activateLanguageContent(activeLanguage);
    updateBodyLanguageClass(activeLanguage);
    syncDataLangVisibility(activeLanguage);
    scheduleHeight();
  };

  window.toggle = id => {
    const element = document.getElementById(String(id || ""));
    if (element) {
      element.classList.toggle("collapsed");
      syncSectionHeadState(element);
    }
    scheduleHeight();
  };

  window.setTab = (tab, contentId) => {
    if (!tab || !tab.parentElement) {
      return;
    }

    const tabContainer = tab.parentElement;
    tabContainer.querySelectorAll(".tab").forEach(node => {
      node.classList.remove("active");
    });
    tab.classList.add("active");

    const contentContainer = tabContainer.parentElement || document;
    contentContainer.querySelectorAll(".tab-content").forEach(node => {
      node.classList.remove("active");
    });

    const normalizedContentId = String(contentId || "");
    const target = document.getElementById(normalizedContentId);
    if (target) {
      target.classList.add("active");
      scheduleHeight();
      return;
    }

    activeCardSignal = normalizedContentId || "ALL";
    applyCardFilters();
    scheduleHeight();
  };

  window.toggleCard = symbol => {
    const target = document.getElementById("card-" + String(symbol || ""));
    if (target) {
      target.classList.toggle("open");
      syncCardState(target);
    }
    scheduleHeight();
  };

  window.goCard = symbol => {
    const target = document.getElementById("card-" + String(symbol || ""));
    if (!target) {
      return;
    }
    target.classList.add("open");
    syncCardState(target);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    scheduleHeight();
  };

  window.filter = () => {
    const input = document.getElementById("q");
    activeCardQuery =
      input && "value" in input ? String(input.value || "").toLowerCase().trim() : "";

    if (applyCardFilters()) {
      scheduleHeight();
      return;
    }

    const query = activeCardQuery;
    document.querySelectorAll(".card[data-sym], .chip[data-sym]").forEach(node => {
      const symbol = String(node.getAttribute("data-sym") || "").toLowerCase();
      const name = String(node.getAttribute("data-name") || "").toLowerCase();
      const matches = !query || symbol.includes(query) || name.includes(query);
      node.classList.toggle("hide", !matches);
    });
    scheduleHeight();
  };

  window.expandAll = open => {
    const shouldOpen = Boolean(open);
    document.querySelectorAll(".card[id^='card-']").forEach(node => {
      node.classList.toggle("open", shouldOpen);
      syncCardState(node);
    });
    scheduleHeight();
  };

  window.switchLang = languageCode => {
    applyLanguage(languageCode);
  };
  window.setLang = languageCode => {
    applyLanguage(languageCode);
  };

  const applyPreferredLanguage = () => {
    applyLanguage(preferredLanguage);
    initializeInteractiveShell();
  };

  const postHeight = () => {
    const height = Math.max(
      document.documentElement ? document.documentElement.scrollHeight : 0,
      document.body ? document.body.scrollHeight : 0
    );
    parent.postMessage({ type: "gistify-flow-html-height", instanceId, height }, "*");
  };

  const scheduleHeight = () => window.requestAnimationFrame(postHeight);

  applyPreferredLanguage();

  window.addEventListener("load", () => {
    applyPreferredLanguage();
    postHeight();
    window.setTimeout(postHeight, 250);
    window.setTimeout(postHeight, 1000);
    window.setTimeout(postHeight, 2000);
  });

  window.addEventListener("resize", postHeight);

  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const anchor = target.closest('a[href^="#"]');
    if (!anchor) {
      return;
    }

    const href = anchor.getAttribute("href") || "";
    if (href.length <= 1) {
      return;
    }

    event.preventDefault();
    scrollToTarget(href);
  });

  new MutationObserver(mutations => {
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
      scrollToTarget(String(data.sectionId || ""));
    }
  });
})();
</script>`;

  const layoutStyle = `
<style>
* {
  box-sizing: border-box;
}
html, body {
  background: #050c1b !important;
  overflow-x: hidden !important;
}
body {
  margin: 0 !important;
}
body > .gistify-flow-shell {
  width: min(1120px, 100%) !important;
  margin: 0 auto !important;
  padding: 24px 16px 56px !important;
}
main,
article,
.content,
.report-shell,
.wrap {
  max-width: 100% !important;
}
#hero {
  padding-top: 0 !important;
}
section {
  scroll-margin-top: 24px;
}
img,
video,
canvas,
svg {
  max-width: 100% !important;
  height: auto !important;
}
table {
  display: block;
  max-width: 100%;
  overflow-x: auto;
}
pre {
  overflow-x: auto;
}
.lang-toggle,
.lang-switch,
#sidebar,
.sidebar,
.toc,
.toc-title,
.toc-nav,
.toc-list {
  display: none !important;
}
.lang-content {
  display: none !important;
}
.lang-content.active {
  display: block !important;
}
.section-head + .section-body {
  display: none !important;
}
.section-head:not(.collapsed) + .section-body {
  display: block !important;
}
.card > .cbody {
  display: none !important;
}
.card.open > .cbody {
  display: block !important;
}
.card.hide,
.chip.hide {
  display: none !important;
}
.chead {
  display: flex !important;
  align-items: flex-start !important;
  justify-content: space-between !important;
  gap: 16px !important;
  cursor: pointer !important;
}
.chead .ctitle {
  display: flex !important;
  align-items: flex-start !important;
  gap: 10px !important;
  flex-wrap: wrap !important;
}
.chead .cmeta {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  flex-wrap: wrap !important;
  margin-left: auto !important;
}
.card .exp {
  transition: transform 0.18s ease !important;
}
.card.open .exp {
  transform: rotate(45deg) !important;
}
#index {
  scroll-margin-top: 24px !important;
}
body .lang-tr,
body .lang-en,
body .blang-tr,
body .blang-en {
  display: none !important;
}
body.lang-tr .lang-tr {
  display: inline !important;
}
body.lang-en .lang-en {
  display: inline !important;
}
body.lang-tr .blang-tr {
  display: block !important;
}
body.lang-en .blang-en {
  display: block !important;
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
  languageInfo: FlowReportLanguageInfo,
  availableLanguages?: DailyReportLanguage[]
) {
  if (availableLanguages?.includes(language)) {
    return null;
  }

  if (languageInfo.languageMode === "tr" && language === "en") {
    return {
      body: t("flow:theSourceReportIsTurkish"),
      title: t("flow:runtimeTranslation"),
    };
  }

  if (languageInfo.languageMode === "en" && language === "tr") {
    return {
      body: t("flow:theSourceReportIsEnglish"),
      title: t("flow:runtimeTranslation"),
    };
  }

  if (
    languageInfo.languageMode === "bilingual" &&
    languageInfo.translationState === "partial"
  ) {
    return {
      body: t("flow:theSelectedLanguageCopyIs"),
      title: t("flow:partialTranslation"),
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
  availableLanguages,
  onLanguageChange,
}: HtmlReportRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const rawInstanceId = useId();
  const instanceId = useMemo(
    () => rawInstanceId.replace(/[:]/g, "-"),
    [rawInstanceId]
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
  const renderedLanguage = useMemo<DailyReportLanguage>(() => {
    if (availableLanguages?.includes(language)) {
      return language;
    }

    return languageInfo.languageMode === "en" ? "en" : "tr";
  }, [availableLanguages, language, languageInfo.languageMode]);
  const effectiveAvailableLanguages = useMemo<DailyReportLanguage[]>(
    () =>
      availableLanguages?.length
        ? availableLanguages
        : [renderedLanguage],
    [availableLanguages, renderedLanguage]
  );
  const prepared = useMemo(
    () =>
      buildPreparedHtmlReport(
        html,
        instanceId,
        renderedLanguage,
        effectiveAvailableLanguages
      ),
    [effectiveAvailableLanguages, html, instanceId, renderedLanguage]
  );
  const translationNotice = useMemo(
    () => getTranslationNotice(language, languageInfo, availableLanguages),
    [language, languageInfo, availableLanguages]
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
          t("flow:theSourceHtmlContentCould")}
      </div>
    );
  }

  if (!prepared) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background/40 p-6 text-sm leading-7 text-muted-foreground">
        {emptyMessage ||
          t("flow:theHtmlReportContentCould")}
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
              {t("flow:sectionMap")}
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
          title={t("flow:htmlReportView")}
          srcDoc={prepared.srcDoc}
          sandbox="allow-scripts"
          className="block w-full border-0 bg-[#050c1b]"
          style={{ height: `${iframeHeight}px` }}
        />
      </section>

      {prepared.sections.length > 1 && !minimal ? (
        <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            {t("flow:quickJump")}
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
