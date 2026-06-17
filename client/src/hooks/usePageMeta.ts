import { useEffect } from "react";

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

export function usePageMeta({
  description,
  title,
}: {
  description: string;
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
    const twitterTitleTag = ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
    });
    const twitterDescriptionTag = ensureMetaTag(
      'meta[name="twitter:description"]',
      {
        name: "twitter:description",
      }
    );

    const previousDescription = descriptionTag?.getAttribute("content") || "";
    const previousOgTitle = ogTitleTag?.getAttribute("content") || "";
    const previousOgDescription = ogDescriptionTag?.getAttribute("content") || "";
    const previousTwitterTitle = twitterTitleTag?.getAttribute("content") || "";
    const previousTwitterDescription =
      twitterDescriptionTag?.getAttribute("content") || "";

    descriptionTag?.setAttribute("content", description);
    ogTitleTag?.setAttribute("content", title);
    ogDescriptionTag?.setAttribute("content", description);
    twitterTitleTag?.setAttribute("content", title);
    twitterDescriptionTag?.setAttribute("content", description);

    return () => {
      document.title = previousTitle;
      descriptionTag?.setAttribute("content", previousDescription);
      ogTitleTag?.setAttribute("content", previousOgTitle);
      ogDescriptionTag?.setAttribute("content", previousOgDescription);
      twitterTitleTag?.setAttribute("content", previousTwitterTitle);
      twitterDescriptionTag?.setAttribute("content", previousTwitterDescription);
    };
  }, [description, title]);
}
