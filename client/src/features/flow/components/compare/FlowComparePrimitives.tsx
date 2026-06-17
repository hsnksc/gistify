import { useCallback, useEffect, useRef } from "react";
import { Bot, Copy, GitCompareArrows, GripHorizontal, RefreshCw, ScrollText, Square, ThumbsDown, ThumbsUp, WandSparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { FlowModelDefinition, FlowModelId } from "../../lib/mockModels";
import {
  buildStatusLabel,
  FlowCopyButton,
  FlowDiffView,
  FlowRenderedResponse,
  FlowSkeletonLoader,
  formatStatusTone,
  type ModelRunState,
  type VoteState,
} from "./flowCompareHelpers";

export function FlowModelSelector({
  language,
  onToggle,
  selectedModelIds,
  models,
}: {
  language: AppLanguage;
  models: FlowModelDefinition[];
  onToggle: (modelId: FlowModelId) => void;
  selectedModelIds: FlowModelId[];
}) {
  return (
    <section className="workspace-panel p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
            {copy(language, "Model Secimi", "Model Selection")}
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {copy(
              language,
              "Yan yana karsilastirilacak modelleri sec",
              "Pick the models that should be compared side by side"
            )}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            {copy(
              language,
              "Aktif modeller daha doygun bir zeminde gorunur; her birinde hiz ve ton rozeti ayrica yer alir. Karsilastirma acik kalabilsin diye en az iki model secili tutulur.",
              "Active models get a richer surface treatment and keep their speed and tone visible. At least two stay selected so the comparison remains meaningful."
            )}
          </p>
        </div>

        <div className="rounded-full border border-border bg-background/70 px-3 py-2 text-xs text-muted-foreground">
          {selectedModelIds.length}/4 {copy(language, "model aktif", "models active")}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {models.map(model => {
          const active = selectedModelIds.includes(model.id);
          return (
            <motion.button
              key={model.id}
              type="button"
              onClick={() => onToggle(model.id)}
              layout
              className={cn(
                "rounded-[1.4rem] border px-4 py-4 text-left transition-all",
                active
                  ? "border-indigo-400/35 bg-indigo-500/12 shadow-[0_18px_40px_rgba(99,102,241,0.12)]"
                  : "border-border bg-background/55 hover:border-border hover:bg-background/75"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-2xl border text-sm font-semibold",
                      model.accentClassName
                    )}
                  >
                    <Bot className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{model.label}</p>
                    <p className="text-xs text-muted-foreground">{model.provider}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-full border text-[10px] font-semibold",
                    active
                      ? "border-emerald-400/35 bg-emerald-500/12 text-emerald-300"
                      : "border-border bg-background/80 text-muted-foreground"
                  )}
                >
                  {active ? "✓" : "+"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {model.speedLabel}
                </span>
                <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {model.toneLabel}
                </span>
                <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {model.costLabel}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

export function FlowWorkspaceControls({
  diffMode,
  isWideDesktop,
  language,
  syncScroll,
  onDiffChange,
  onSyncChange,
}: {
  diffMode: boolean;
  isWideDesktop: boolean;
  language: AppLanguage;
  syncScroll: boolean;
  onDiffChange: (next: boolean) => void;
  onSyncChange: (next: boolean) => void;
}) {
  return (
    <section className="workspace-panel p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
            {copy(language, "Workspace Ayarlari", "Workspace Controls")}
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {copy(language, "Karsilastirma kontrolleri", "Comparison controls")}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            {copy(
              language,
              "Diff modu ilk aktif modeli referans alir. Sync scroll acildiginda kolonlar birlikte hareket eder. 1440px ve uzeri ekranlarda drag handle ile sutun genisliklerini manuel ayarlayabilirsin.",
              "Diff mode uses the first active model as the reference. Sync scroll keeps columns aligned. On 1440px+ screens you can resize widths with drag handles."
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 rounded-full border border-border bg-background/65 px-3 py-2 text-xs text-muted-foreground">
            <GitCompareArrows className="size-3.5 text-amber-300" />
            {copy(language, "Diff", "Diff")}
            <Switch checked={diffMode} aria-label="Toggle diff view" onCheckedChange={onDiffChange} />
          </label>
          <label className="inline-flex items-center gap-2 rounded-full border border-border bg-background/65 px-3 py-2 text-xs text-muted-foreground">
            <ScrollText className="size-3.5 text-emerald-300" />
            {copy(language, "Sync Scroll", "Sync Scroll")}
            <Switch checked={syncScroll} aria-label="Toggle sync scroll" onCheckedChange={onSyncChange} />
          </label>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/65 px-3 py-2 text-xs text-muted-foreground">
            <GripHorizontal className="size-3.5 text-indigo-300" />
            {isWideDesktop
              ? copy(language, "Resizable aktif", "Resizable on")
              : copy(language, "Resizable masaustunde", "Resizable on desktop")}
          </span>
        </div>
      </div>
    </section>
  );
}

export function FlowPromptComposer({
  characterCount,
  isRunning,
  language,
  onApplySample,
  onStop,
  onSubmit,
  prompt,
  setPrompt,
}: {
  characterCount: number;
  isRunning: boolean;
  language: AppLanguage;
  onApplySample: () => void;
  onStop: () => void;
  onSubmit: () => void;
  prompt: string;
  setPrompt: (next: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, 240);
    textarea.style.height = `${Math.max(48, nextHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 240 ? "auto" : "hidden";
  }, [prompt]);

  const handleSubmit = useCallback(() => {
    if (!prompt.trim()) {
      return;
    }

    onSubmit();
  }, [onSubmit, prompt]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="mx-auto max-w-7xl">
        <section className="pointer-events-auto rounded-[1.75rem] border border-border bg-background/95 p-3 shadow-[0_-12px_48px_rgba(0,0,0,0.24)] backdrop-blur">
          <div className="rounded-[1.25rem] border border-border bg-card/90 p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                {copy(language, "Prompt Composer", "Prompt Composer")}
              </p>
              <Button type="button" variant="ghost" size="sm" onClick={onApplySample}>
                <WandSparkles className="size-3.5" />
                {copy(language, "Ornek Prompt", "Sample Prompt")}
              </Button>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="min-w-0 flex-1">
                <Textarea
                  ref={textareaRef}
                  aria-label={copy(language, "Prompt girisi", "Prompt input")}
                  value={prompt}
                  onChange={event => setPrompt(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      if (isRunning) {
                        onStop();
                        return;
                      }

                      handleSubmit();
                    }
                  }}
                  className="min-h-12 max-h-60 rounded-[1rem] border-border bg-background/70 px-4 py-3 text-sm leading-7"
                  placeholder={copy(
                    language,
                    "Ayni promptu tum modellere gonder. Ornek: Bugunun rapor akisina gore hangi ticker daha guclu?",
                    "Send one prompt to every model. Example: Which ticker looks stronger based on today's report flow?"
                  )}
                />
                <div className="mt-2 flex items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
                  <p>
                    {copy(
                      language,
                      "Enter ile gonder · Shift+Enter yeni satir",
                      "Enter to send · Shift+Enter for a new line"
                    )}
                  </p>
                  <span className="tabular-nums">{characterCount}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {isRunning ? (
                  <Button
                    type="button"
                    variant="outline"
                    aria-label={copy(language, "Yanit uretimini durdur", "Stop generation")}
                    onClick={onStop}
                    className="h-12 rounded-[1rem] border-amber-400/35 bg-amber-500/10 px-4 text-amber-200 hover:bg-amber-500/14"
                  >
                    <Square className="size-4" />
                    {copy(language, "Durdur", "Stop")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    aria-label={copy(language, "Promptu gonder", "Send prompt")}
                    onClick={handleSubmit}
                    disabled={!prompt.trim()}
                    className="h-12 rounded-[1rem] bg-primary px-5 text-primary-foreground"
                  >
                    {copy(language, "Gonder", "Send")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function FlowModelColumn({
  baselineLabel,
  baselineResponse,
  diffMode,
  entry,
  isReferenceColumn,
  language,
  model,
  onCopyFull,
  onRegenerate,
  onScrollSync,
  onVote,
  reducedMotion,
  registerScrollRef,
}: {
  baselineLabel: string;
  baselineResponse: string;
  diffMode: boolean;
  entry: ModelRunState;
  isReferenceColumn: boolean;
  language: AppLanguage;
  model: FlowModelDefinition;
  onCopyFull: () => void;
  onRegenerate: () => void;
  onScrollSync: (modelId: FlowModelId) => void;
  onVote: (vote: VoteState) => void;
  reducedMotion: boolean;
  registerScrollRef: (modelId: FlowModelId, node: HTMLDivElement | null) => void;
}) {
  const showSkeleton = entry.status === "streaming" && !entry.content.trim();

  return (
    <article className="overflow-hidden rounded-[1.7rem] border border-border bg-card/90 shadow-xl">
      <div
        ref={node => registerScrollRef(model.id, node)}
        onScroll={() => onScrollSync(model.id)}
        className="terminal-scrollbar h-[68vh] min-h-[520px] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-2xl border",
                    model.accentClassName
                  )}
                >
                  <Bot className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{model.label}</h3>
                  <p className="text-xs text-muted-foreground">{model.provider}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                    formatStatusTone(entry.status)
                  )}
                >
                  {buildStatusLabel(language, entry.status)}
                </span>
                <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {model.speedLabel}
                </span>
                <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {model.toneLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                aria-label={copy(language, "Yaniti yeniden uret", "Regenerate response")}
                onClick={onRegenerate}
                className="rounded-full border border-border bg-background/70 px-3 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="size-3.5" />
                {copy(language, "Tekrar", "Redo")}
              </Button>
              <FlowCopyButton
                label={copy(language, "Tum yaniti kopyala", "Copy full response")}
                text={entry.content}
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 px-4 py-5">
          {showSkeleton ? (
            <FlowSkeletonLoader reducedMotion={reducedMotion} />
          ) : entry.content.trim() ? (
            <>
              <FlowRenderedResponse content={entry.content} />
              {entry.status === "streaming" ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-block h-5 w-2 rounded-sm bg-indigo-300 align-middle",
                    reducedMotion ? "opacity-80" : "animate-pulse"
                  )}
                />
              ) : null}
            </>
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-border bg-background/45 p-4 text-sm leading-7 text-muted-foreground">
              {copy(
                language,
                "Bu sutun hazir. Prompt gonderildiginde model yaniti burada akmaya baslar.",
                "This column is ready. Once you send the prompt, the model response will stream here."
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <Button
              type="button"
              size="sm"
              variant={entry.vote === "up" ? "secondary" : "ghost"}
              aria-label={copy(language, "Olumlu oy ver", "Vote up")}
              onClick={() => onVote(entry.vote === "up" ? null : "up")}
              className="rounded-full"
            >
              <ThumbsUp className="size-3.5" />
              {copy(language, "Begendim", "Useful")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={entry.vote === "down" ? "secondary" : "ghost"}
              aria-label={copy(language, "Olumsuz oy ver", "Vote down")}
              onClick={() => onVote(entry.vote === "down" ? null : "down")}
              className="rounded-full"
            >
              <ThumbsDown className="size-3.5" />
              {copy(language, "Zayif", "Weak")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label={copy(language, "Tam yaniti kopyala", "Copy full response")}
              onClick={onCopyFull}
              className="rounded-full"
            >
              <Copy className="size-3.5" />
              {copy(language, "Tum Metin", "Copy Text")}
            </Button>
          </div>

          {diffMode && baselineResponse.trim() && entry.content.trim() ? (
            isReferenceColumn ? (
              <div className="rounded-[1.35rem] border border-border bg-background/45 p-4 text-sm leading-7 text-muted-foreground">
                {copy(
                  language,
                  "Bu sutun referans olarak kullaniliyor. Diger modellerin fark gorunumu buna gore hesaplanir.",
                  "This is the reference column. Difference views for the other models are computed against it."
                )}
              </div>
            ) : (
              <FlowDiffView
                candidate={entry.content}
                language={language}
                reference={baselineResponse}
                referenceLabel={baselineLabel}
              />
            )
          ) : null}
        </div>
      </div>
    </article>
  );
}
