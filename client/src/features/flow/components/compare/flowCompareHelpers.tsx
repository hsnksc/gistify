import { Fragment, useEffect, useMemo, useState } from "react";
import { Check, Copy, FileCode2, GitCompareArrows, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type RunStatus = "idle" | "streaming" | "done" | "stopped";
export type VoteState = "up" | "down" | null;

export interface ModelRunState {
  content: string;
  status: RunStatus;
  updatedAt: number | null;
  vote: VoteState;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function createEmptyRunState() {
  return {
    chatgpt: {
      content: "",
      status: "idle" as const,
      updatedAt: null,
      vote: null,
    },
    claude: {
      content: "",
      status: "idle" as const,
      updatedAt: null,
      vote: null,
    },
    gemini: {
      content: "",
      status: "idle" as const,
      updatedAt: null,
      vote: null,
    },
    grok: {
      content: "",
      status: "idle" as const,
      updatedAt: null,
      vote: null,
    },
  };
}

export function buildStatusLabel(language: AppLanguage, status: RunStatus) {
  switch (status) {
    case "streaming":
      return copy(language, "Canli", "Streaming");
    case "done":
      return copy(language, "Hazir", "Ready");
    case "stopped":
      return copy(language, "Durduruldu", "Stopped");
    default:
      return copy(language, "Bekliyor", "Waiting");
  }
}

export function formatStatusTone(status: RunStatus) {
  switch (status) {
    case "streaming":
      return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
    case "done":
      return "border-indigo-400/30 bg-indigo-500/10 text-indigo-200";
    case "stopped":
      return "border-amber-400/30 bg-amber-500/10 text-amber-300";
    default:
      return "border-border bg-background/60 text-muted-foreground";
  }
}

function tokenizeForDiff(value: string) {
  return value.match(/\S+\s*/g) || [];
}

type DiffPartType = "common" | "added" | "removed";

interface DiffPart {
  text: string;
  type: DiffPartType;
}

export function buildWordDiff(reference: string, candidate: string) {
  const left = tokenizeForDiff(reference);
  const right = tokenizeForDiff(candidate);
  const rows = left.length;
  const columns = right.length;
  const dp: number[][] = Array.from({ length: rows + 1 }, () =>
    Array.from({ length: columns + 1 }, () => 0)
  );

  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let column = columns - 1; column >= 0; column -= 1) {
      if (left[row] === right[column]) {
        dp[row][column] = dp[row + 1][column + 1] + 1;
      } else {
        dp[row][column] = Math.max(dp[row + 1][column], dp[row][column + 1]);
      }
    }
  }

  const parts: DiffPart[] = [];
  let row = 0;
  let column = 0;

  const pushPart = (type: DiffPartType, text: string) => {
    const previous = parts[parts.length - 1];
    if (previous && previous.type === type) {
      previous.text += text;
      return;
    }

    parts.push({ text, type });
  };

  while (row < rows && column < columns) {
    if (left[row] === right[column]) {
      pushPart("common", right[column]);
      row += 1;
      column += 1;
      continue;
    }

    if (dp[row + 1][column] >= dp[row][column + 1]) {
      pushPart("removed", left[row]);
      row += 1;
      continue;
    }

    pushPart("added", right[column]);
    column += 1;
  }

  while (row < rows) {
    pushPart("removed", left[row]);
    row += 1;
  }

  while (column < columns) {
    pushPart("added", right[column]);
    column += 1;
  }

  return parts;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function buildHighlightedCode(code: string, language: string) {
  let html = escapeHtml(code);
  const keywordPattern =
    language === "json"
      ? /\b(true|false|null)\b/g
      : /\b(const|let|var|function|return|if|else|type|interface|import|from|export|await|async|for|while|def|elif|class)\b/g;

  html = html.replace(
    /(\/\/.*$|#.*$)/gm,
    '<span class="text-slate-500">$1</span>'
  );
  html = html.replace(
    /("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g,
    '<span class="text-emerald-300">$1</span>'
  );
  html = html.replace(keywordPattern, '<span class="text-indigo-300">$1</span>');
  html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="text-amber-300">$1</span>');

  return html;
}

export function renderInlineContent(value: string) {
  return value.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((segment, index) => {
    if (!segment) {
      return null;
    }

    if (segment.startsWith("`") && segment.endsWith("`")) {
      return (
        <code
          key={`inline-code-${index}`}
          className="rounded-md border border-border bg-background/85 px-1.5 py-0.5 font-mono text-[12px] text-emerald-300"
        >
          {segment.slice(1, -1)}
        </code>
      );
    }

    if (segment.startsWith("**") && segment.endsWith("**")) {
      return (
        <strong key={`inline-strong-${index}`} className="font-semibold text-foreground">
          {segment.slice(2, -2)}
        </strong>
      );
    }

    return <Fragment key={`inline-text-${index}`}>{segment}</Fragment>;
  });
}

type ContentSegment =
  | { language: string; type: "code"; value: string }
  | { type: "text"; value: string };

export function splitContentSegments(value: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  const pattern = /```([\w-]+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;

  for (const match of Array.from(value.matchAll(pattern))) {
    if (match.index === undefined) {
      continue;
    }

    if (match.index > lastIndex) {
      segments.push({ type: "text", value: value.slice(lastIndex, match.index) });
    }

    segments.push({
      language: (match[1] || "text").trim() || "text",
      type: "code",
      value: (match[2] || "").trimEnd(),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < value.length) {
    segments.push({ type: "text", value: value.slice(lastIndex) });
  }

  return segments;
}

export function parseTextBlocks(value: string) {
  const lines = value.split("\n");
  const blocks: Array<
    | { items: string[]; ordered: boolean; type: "list" }
    | { level: 1 | 2 | 3; text: string; type: "heading" }
    | { text: string; type: "paragraph" }
  > = [];

  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];
  let listOrdered = false;

  const flushParagraph = () => {
    const text = paragraphBuffer.join(" ").trim();
    if (text) {
      blocks.push({ text, type: "paragraph" });
    }
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push({ items: [...listBuffer], ordered: listOrdered, type: "list" });
    }

    listBuffer = [];
    listOrdered = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        level: Math.min(3, headingMatch[1].length) as 1 | 2 | 3,
        text: headingMatch[2].trim(),
        type: "heading",
      });
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      if (!listBuffer.length) {
        listOrdered = true;
      }
      listBuffer.push(orderedMatch[1].trim());
      continue;
    }

    const unorderedMatch = line.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (!listBuffer.length) {
        listOrdered = false;
      }
      listBuffer.push(unorderedMatch[1].trim());
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function FlowCopyButton({
  className,
  label,
  text,
}: {
  className?: string;
  label: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Clipboard write failed.");
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        aria-label={label}
        onClick={() => void handleCopy()}
        className="h-8 rounded-full border border-border bg-background/70 px-3 text-xs text-muted-foreground hover:text-foreground"
      >
        {copied ? <Check className="size-3.5 text-emerald-300" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <AnimatePresence>
        {copied ? (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="pointer-events-none absolute -top-8 right-0 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300"
          >
            Copied!
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function FlowSkeletonLoader({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className={cn(
            "relative overflow-hidden rounded-full bg-background/90",
            index === 0
              ? "h-4 w-2/3"
              : index === 5
                ? "h-4 w-4/5"
                : "h-3 w-full"
          )}
        >
          {!reducedMotion ? (
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent"
              animate={{ x: ["-120%", "240%"] }}
              transition={{
                duration: 1.35,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function FlowCodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-border bg-[#09101d] shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-background/60 px-4 py-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
          <FileCode2 className="size-3.5" />
          {language}
        </div>
        <FlowCopyButton label={`Copy ${language} snippet`} text={code} />
      </div>
      <pre className="terminal-scrollbar overflow-x-auto p-4 text-sm leading-7 text-slate-100">
        <code dangerouslySetInnerHTML={{ __html: buildHighlightedCode(code, language) }} />
      </pre>
    </div>
  );
}

export function FlowRenderedResponse({
  content,
}: {
  content: string;
}) {
  const segments = useMemo(() => splitContentSegments(content), [content]);

  return (
    <div className="space-y-5">
      {segments.map((segment, segmentIndex) => {
        if (segment.type === "code") {
          return (
            <FlowCodeBlock
              key={`code-${segmentIndex}`}
              code={segment.value}
              language={segment.language}
            />
          );
        }

        const blocks = parseTextBlocks(segment.value);
        return (
          <div key={`text-${segmentIndex}`} className="space-y-4">
            {blocks.map((block, blockIndex) => {
              if (block.type === "heading") {
                const headingClassName =
                  block.level === 1
                    ? "text-2xl"
                    : block.level === 2
                      ? "text-xl"
                      : "text-lg";
                return (
                  <h3
                    key={`heading-${segmentIndex}-${blockIndex}`}
                    className={cn("font-semibold tracking-tight text-foreground", headingClassName)}
                  >
                    {renderInlineContent(block.text)}
                  </h3>
                );
              }

              if (block.type === "list") {
                const ListTag = block.ordered ? "ol" : "ul";
                return (
                  <ListTag
                    key={`list-${segmentIndex}-${blockIndex}`}
                    className={cn(
                      "space-y-2 pl-5 text-sm leading-7 text-muted-foreground",
                      block.ordered ? "list-decimal" : "list-disc"
                    )}
                  >
                    {block.items.map((item, itemIndex) => (
                      <li key={`list-item-${segmentIndex}-${blockIndex}-${itemIndex}`}>
                        {renderInlineContent(item)}
                      </li>
                    ))}
                  </ListTag>
                );
              }

              return (
                <p
                  key={`paragraph-${segmentIndex}-${blockIndex}`}
                  className="text-sm leading-7 text-muted-foreground"
                >
                  {renderInlineContent(block.text)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function FlowDiffView({
  candidate,
  language,
  reference,
  referenceLabel,
}: {
  candidate: string;
  language: AppLanguage;
  reference: string;
  referenceLabel: string;
}) {
  const parts = useMemo(() => buildWordDiff(reference, candidate), [candidate, reference]);

  return (
    <section className="rounded-[1.4rem] border border-border bg-background/55 p-4">
      <div className="flex items-center gap-2">
        <GitCompareArrows className="size-4 text-amber-300" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
          {copy(language, "Kelime Duzeyi Fark", "Word-Level Diff")}
        </p>
      </div>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        {copy(
          language,
          `${referenceLabel} referans sutununa gore eklenen ve cikarilan ifade farklari.`,
          `Added and removed wording differences relative to the ${referenceLabel} reference column.`
        )}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs leading-7 text-muted-foreground">
        {parts.map((part, index) => {
          if (!part.text.trim()) {
            return <span key={`space-${index}`}>{part.text}</span>;
          }

          if (part.type === "added") {
            return (
              <span
                key={`added-${index}`}
                className="rounded-md border border-emerald-400/25 bg-emerald-500/12 px-2 py-1 text-emerald-200"
              >
                <Plus className="mr-1 inline size-3" />
                {part.text}
              </span>
            );
          }

          if (part.type === "removed") {
            return (
              <span
                key={`removed-${index}`}
                className="rounded-md border border-red-400/25 bg-red-500/12 px-2 py-1 text-red-200"
              >
                <Minus className="mr-1 inline size-3" />
                {part.text}
              </span>
            );
          }

          return <span key={`common-${index}`}>{part.text}</span>;
        })}
      </div>
    </section>
  );
}
