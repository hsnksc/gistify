import { useEffect } from "react";

const SITE_URL = "https://gistify.pro";
const DEFAULT_OG_IMAGE = `${SITE_URL}/gistifylogo.png`;

function ensureMetaTag(
  selector: string,
  attributes: Record<string, string>
) {
  if (typeof document === "undefined") {
    return null;
  }

  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      element?.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  return element;
}

function ensureLinkTag(
  selector: string,
  attributes: Record<string, string>
) {
  if (typeof document === "undefined") {
    return null;
  }

  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    Object.entries(attributes).forEach(([key, value]) => {
      element?.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  return element;
}

function resolveAbsoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

export function usePageMeta({
  canonical,
  description,
  noindex,
  ogImage,
  ogUrl,
  title,
}: {
  canonical?: string;
  description: string;
  noindex?: boolean;
  ogImage?: string;
  ogUrl?: string;
  title: string;
}) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousTitle = document.title;
    document.title = title;

    const descriptionTag = ensureMetaTag('meta[name="description"]', {
      name: "description",
    });
    const ogTitleTag = ensureMetaTag('meta[property="og:title"]', {
      property: "og:title",
    });
    const ogDescriptionTag = ensureMetaTag('meta[property="og:description"]', {
      property: "og:description",
    });
    const ogUrlTag = ensureMetaTag('meta[property="og:url"]', {
      property: "og:url",
    });
    const ogImageTag = ensureMetaTag('meta[property="og:image"]', {
      property: "og:image",
    });
    const twitterTitleTag = ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
    });
    const twitterDescriptionTag = ensureMetaTag(
      'meta[name="twitter:description"]',
      {
        name: "twitter:description",
      }
    );
    const twitterImageTag = ensureMetaTag('meta[name="twitter:image"]', {
      name: "twitter:image",
    });

    const canonicalLink = canonical
      ? ensureLinkTag('link[rel="canonical"]', { rel: "canonical" })
      : null;

    const noindexMeta = noindex
      ? ensureMetaTag('meta[name="robots"]', { name: "robots" })
      : null;

    const resolvedOgUrl = ogUrl ? resolveAbsoluteUrl(ogUrl) : SITE_URL;
    const resolvedOgImage = ogImage
      ? resolveAbsoluteUrl(ogImage)
      : DEFAULT_OG_IMAGE;

    const previousDescription = descriptionTag?.getAttribute("content") || "";
    const previousOgTitle = ogTitleTag?.getAttribute("content") || "";
    const previousOgDescription = ogDescriptionTag?.getAttribute("content") || "";
    const previousOgUrl = ogUrlTag?.getAttribute("content") || "";
    const previousOgImage = ogImageTag?.getAttribute("content") || "";
    const previousTwitterTitle = twitterTitleTag?.getAttribute("content") || "";
    const previousTwitterDescription =
      twitterDescriptionTag?.getAttribute("content") || "";
    const previousTwitterImage = twitterImageTag?.getAttribute("content") || "";
    const previousCanonical = canonicalLink?.getAttribute("href") || "";
    const previousNoindex = noindexMeta?.getAttribute("content") || "";

    descriptionTag?.setAttribute("content", description);
    ogTitleTag?.setAttribute("content", title);
    ogDescriptionTag?.setAttribute("content", description);
    ogUrlTag?.setAttribute("content", resolvedOgUrl);
    ogImageTag?.setAttribute("content", resolvedOgImage);
    twitterTitleTag?.setAttribute("content", title);
    twitterDescriptionTag?.setAttribute("content", description);
    twitterImageTag?.setAttribute("content", resolvedOgImage);

    if (canonicalLink && canonical) {
      canonicalLink.setAttribute("href", resolveAbsoluteUrl(canonical));
    }

    if (noindexMeta) {
      noindexMeta.setAttribute("content", "noindex, follow");
    }

    return () => {
      document.title = previousTitle;
      descriptionTag?.setAttribute("content", previousDescription);
      ogTitleTag?.setAttribute("content", previousOgTitle);
      ogDescriptionTag?.setAttribute("content", previousOgDescription);
      ogUrlTag?.setAttribute("content", previousOgUrl);
      ogImageTag?.setAttribute("content", previousOgImage);
      twitterTitleTag?.setAttribute("content", previousTwitterTitle);
      twitterDescriptionTag?.setAttribute("content", previousTwitterDescription);
      twitterImageTag?.setAttribute("content", previousTwitterImage);

      if (canonicalLink) {
        canonicalLink.setAttribute("href", previousCanonical);
      }

      if (noindexMeta) {
        noindexMeta.setAttribute("content", previousNoindex);
      }
    };
  }, [canonical, description, noindex, ogImage, ogUrl, title]);
}
