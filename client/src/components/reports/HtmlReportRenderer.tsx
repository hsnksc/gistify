import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { BookOpen } from "lucide-react";
import type { AppLanguage } from "@/lib/i18n";

interface HtmlReportRendererProps {
  language?: AppLanguage;
  html: string;
  emptyMessage?: string;
}

interface HtmlSectionLink {
  id: string;
  label: string;
}

interface PreparedHtmlReport {
  sections: HtmlSectionLink[];
  srcDoc: string;
}

function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
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
  clone
    .querySelectorAll(language === "en" ? ".tr-only" : ".en-only")
    .forEach(node => node.remove());
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

  const navSections = Array.from(
    documentNode.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]')
  ).map(link => ({
    id: (link.getAttribute("href") || "").replace(/^#/, ""),
    label: getLocalizedNodeText(link, language),
  }));

  const heroSection = documentNode.getElementById("hero")
    ? [
        {
          id: "hero",
          label: copy(language, "Genel Bakis", "Overview"),
        },
      ]
    : [];

  const fallbackSections = Array.from(
    documentNode.querySelectorAll<HTMLElement>("section[id]")
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
    ...fallbackSections,
  ]).slice(0, 12);

  const helperScript = `
<script>
(() => {
  const instanceId = ${JSON.stringify(instanceId)};
  const preferredLanguage = ${JSON.stringify(reportLanguage)};
  const applyPreferredLanguage = () => {
    if (typeof window.setLanguage === "function") {
      window.setLanguage(preferredLanguage);
      return;
    }

    if (document.body) {
      document.body.classList.remove("lang-tr", "lang-en");
      document.body.classList.add(preferredLanguage === "en" ? "lang-en" : "lang-tr");
    }
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
  new MutationObserver(() => scheduleHeight()).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  });
  window.addEventListener("message", event => {
    const data = event.data;
    if (!data || data.type !== "gistify-flow-html-scroll" || data.instanceId !== instanceId) {
      return;
    }
    const target = document.getElementById(String(data.sectionId || ""));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
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

export default function HtmlReportRenderer({
  language = "tr",
  html,
  emptyMessage,
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
      <div className="rounded-[1.75rem] border border-dashed border-border bg-background/40 p-5 text-sm leading-7 text-muted-foreground">
        {emptyMessage ||
          copy(
            language,
            "Kaynak HTML icerigi gosterilemedi.",
            "The source HTML content could not be displayed."
          )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {prepared.sections.length > 1 ? (
        <section className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
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

      <section className="overflow-hidden rounded-[2rem] border border-border bg-card/90 shadow-xl">
        <iframe
          ref={iframeRef}
          title={copy(language, "HTML rapor gorunumu", "HTML report view")}
          srcDoc={prepared.srcDoc}
          sandbox="allow-scripts"
          className="block w-full border-0 bg-[#050c1b]"
          style={{ height: `${iframeHeight}px` }}
        />
      </section>

      {prepared.sections.length > 1 ? (
        <section className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
            {copy(language, "Hizli Gecis", "Quick Jump")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {prepared.sections.map(section => (
              <button
                key={`${section.id}-bottom`}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="rounded-full border border-border bg-background/65 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-indigo-400/35 hover:text-indigo-200"
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
