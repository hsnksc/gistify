import { Fragment, startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { FileText, GitCompareArrows, GripHorizontal, Layers3, RefreshCw, ScrollText, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import type { CarouselApi } from "@/components/ui/carousel";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { copy, type AppLanguage } from "@/lib/i18n";
import { toast } from "sonner";
import FlowLayout from "../components/FlowLayout";
import {
  FlowModelColumn,
  FlowModelSelector,
  FlowPromptComposer,
  FlowWorkspaceControls,
} from "../components/compare/FlowComparePrimitives";
import {
  createEmptyRunState,
  type ModelRunState,
  type VoteState,
  useMediaQuery,
} from "../components/compare/flowCompareHelpers";
import { useFlowReportSummaries } from "../hooks/useFlowReportSummaries";
import {
  FLOW_MODELS,
  type FlowModelId,
  streamMockModelResponse,
} from "../lib/mockModels";

const DEFAULT_PROMPT_TR =
  "META ve HOOD arasinda bugunun rapor akisina gore hangisinin kisa vadeli risk/odul profili daha guclu? Katalizor, risk, zamanlama ve pozisyon boyutu acisindan karsilastir.";
const DEFAULT_PROMPT_EN =
  "Compare META and HOOD based on today's report flow. Which one has the stronger near-term risk/reward profile across catalysts, risks, timing and position sizing?";
const MIN_COMPARE_MODELS = 2;

export default function FlowPage({
  language,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const [, setLocation] = useLocation();
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isWideDesktop = useMediaQuery("(min-width: 1440px)");
  const { reports, reload } = useFlowReportSummaries(language);
  const [prompt, setPrompt] = useState("");
  const [selectedModelIds, setSelectedModelIds] = useState<FlowModelId[]>([
    "chatgpt",
    "claude",
    "gemini",
  ]);
  const [diffMode, setDiffMode] = useState(false);
  const [syncScroll, setSyncScroll] = useState(false);
  const [runs, setRuns] = useState<Record<FlowModelId, ModelRunState>>(createEmptyRunState);
  const [mobileModelId, setMobileModelId] = useState<FlowModelId>("chatgpt");
  const [mobileCarouselApi, setMobileCarouselApi] = useState<CarouselApi | null>(null);
  const cancelersRef = useRef<Partial<Record<FlowModelId, () => void>>>({});
  const scrollRefs = useRef<Record<FlowModelId, HTMLDivElement | null>>({
    chatgpt: null,
    claude: null,
    gemini: null,
    grok: null,
  });
  const syncLockRef = useRef(false);

  const selectedModels = useMemo(
    () => FLOW_MODELS.filter(model => selectedModelIds.includes(model.id)),
    [selectedModelIds]
  );
  const baselineModel = selectedModels[0] || FLOW_MODELS[0];
  const baselineResponse = runs[baselineModel.id].content;
  const isRunning = selectedModelIds.some(modelId => runs[modelId].status === "streaming");
  const samplePrompt = language === "en" ? DEFAULT_PROMPT_EN : DEFAULT_PROMPT_TR;
  const pageTitle =
    language === "en"
      ? "Gistify Flow Compare"
      : "Gistify Flow Karsilastirma";
  const pageDescription =
    language === "en"
      ? "Compare one prompt across multiple AI models, keep columns independently scrollable and jump into the HTML stock report gallery."
      : "Tek bir promptu birden fazla AI modelinde karsilastir, kolonlari bagimsiz kaydir ve HTML hisse rapor galerisine gec.";

  usePageMeta({
    description: pageDescription,
    title: pageTitle,
  });

  useEffect(() => {
    if (!selectedModelIds.includes(mobileModelId)) {
      setMobileModelId(selectedModelIds[0] || "chatgpt");
    }
  }, [mobileModelId, selectedModelIds]);

  useEffect(() => {
    if (!mobileCarouselApi) {
      return;
    }

    const onSelect = () => {
      const nextModelId = selectedModelIds[mobileCarouselApi.selectedScrollSnap()];
      if (nextModelId) {
        setMobileModelId(nextModelId);
      }
    };

    onSelect();
    mobileCarouselApi.on("select", onSelect);
    mobileCarouselApi.on("reInit", onSelect);
    return () => {
      mobileCarouselApi.off("select", onSelect);
      mobileCarouselApi.off("reInit", onSelect);
    };
  }, [mobileCarouselApi, selectedModelIds]);

  useEffect(() => {
    if (!mobileCarouselApi) {
      return;
    }

    const nextIndex = selectedModelIds.indexOf(mobileModelId);
    if (nextIndex >= 0 && mobileCarouselApi.selectedScrollSnap() !== nextIndex) {
      mobileCarouselApi.scrollTo(nextIndex);
    }
  }, [mobileCarouselApi, mobileModelId, selectedModelIds]);

  useEffect(() => {
    return () => {
      for (const cancel of Object.values(cancelersRef.current)) {
        cancel?.();
      }
    };
  }, []);

  const stopStreaming = useCallback(() => {
    for (const modelId of selectedModelIds) {
      cancelersRef.current[modelId]?.();
      delete cancelersRef.current[modelId];
    }

    setRuns(current => {
      const next = { ...current };
      for (const modelId of selectedModelIds) {
        if (next[modelId].status === "streaming") {
          next[modelId] = {
            ...next[modelId],
            status: "stopped",
            updatedAt: Date.now(),
          };
        }
      }
      return next;
    });
  }, [selectedModelIds]);

  const launchStreams = useCallback(
    (targetModelIds: FlowModelId[], nextPrompt: string) => {
      for (const modelId of targetModelIds) {
        cancelersRef.current[modelId]?.();
        const model = FLOW_MODELS.find(item => item.id === modelId);
        if (!model) {
          continue;
        }

        cancelersRef.current[modelId] = streamMockModelResponse({
          language,
          model,
          onChunk: chunk => {
            setRuns(current => ({
              ...current,
              [modelId]: {
                ...current[modelId],
                content: `${current[modelId].content}${chunk}`,
                status: "streaming",
                updatedAt: Date.now(),
              },
            }));
          },
          onDone: fullText => {
            delete cancelersRef.current[modelId];
            setRuns(current => ({
              ...current,
              [modelId]: {
                ...current[modelId],
                content: fullText,
                status: "done",
                updatedAt: Date.now(),
              },
            }));
          },
          prompt: nextPrompt,
        });
      }
    },
    [language]
  );

  const submitPrompt = useCallback(() => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      return;
    }

    stopStreaming();
    startTransition(() => {
      setRuns(current => {
        const next = { ...current };
        for (const modelId of selectedModelIds) {
          next[modelId] = {
            ...next[modelId],
            content: "",
            status: "streaming",
            updatedAt: Date.now(),
          };
        }
        return next;
      });
    });
    launchStreams(selectedModelIds, trimmed);
  }, [launchStreams, prompt, selectedModelIds, stopStreaming]);

  const regenerateModel = useCallback(
    (modelId: FlowModelId) => {
      const trimmed = prompt.trim();
      if (!trimmed) {
        toast.error(
          copy(
            language,
            "Yeniden uretmeden once bir prompt yaz.",
            "Write a prompt before regenerating."
          )
        );
        return;
      }

      cancelersRef.current[modelId]?.();
      setRuns(current => ({
        ...current,
        [modelId]: {
          ...current[modelId],
          content: "",
          status: "streaming",
          updatedAt: Date.now(),
        },
      }));
      launchStreams([modelId], trimmed);
    },
    [language, launchStreams, prompt]
  );

  const toggleModel = useCallback(
    (modelId: FlowModelId) => {
      setSelectedModelIds(current => {
        const active = current.includes(modelId);
        if (active && current.length <= MIN_COMPARE_MODELS) {
          toast.message(
            copy(
              language,
              "Yan yana karsilastirma icin en az iki model secili kalmali.",
              "Keep at least two models active for side-by-side comparison."
            )
          );
          return current;
        }

        if (active) {
          cancelersRef.current[modelId]?.();
          delete cancelersRef.current[modelId];
          setRuns(previous => ({
            ...previous,
            [modelId]: {
              ...previous[modelId],
              status:
                previous[modelId].status === "streaming"
                  ? "stopped"
                  : previous[modelId].status,
              updatedAt: Date.now(),
            },
          }));
          return current.filter(item => item !== modelId);
        }

        return [...current, modelId];
      });
    },
    [language]
  );

  const setVote = useCallback((modelId: FlowModelId, vote: VoteState) => {
    setRuns(current => ({
      ...current,
      [modelId]: {
        ...current[modelId],
        vote,
      },
    }));
  }, []);

  const registerScrollRef = useCallback((modelId: FlowModelId, node: HTMLDivElement | null) => {
    scrollRefs.current[modelId] = node;
  }, []);

  const syncScrollPosition = useCallback(
    (sourceModelId: FlowModelId) => {
      if (!syncScroll || syncLockRef.current) {
        return;
      }

      const source = scrollRefs.current[sourceModelId];
      if (!source) {
        return;
      }

      const sourceMax = Math.max(1, source.scrollHeight - source.clientHeight);
      const progress = source.scrollTop / sourceMax;
      syncLockRef.current = true;

      for (const modelId of selectedModelIds) {
        if (modelId === sourceModelId) {
          continue;
        }

        const target = scrollRefs.current[modelId];
        if (!target) {
          continue;
        }

        const targetMax = Math.max(0, target.scrollHeight - target.clientHeight);
        target.scrollTop = targetMax * progress;
      }

      window.requestAnimationFrame(() => {
        syncLockRef.current = false;
      });
    },
    [selectedModelIds, syncScroll]
  );

  const desktopColumns = selectedModels.map(model => (
    <FlowModelColumn
      key={model.id}
      baselineLabel={baselineModel.label}
      baselineResponse={baselineResponse}
      diffMode={diffMode}
      entry={runs[model.id]}
      isReferenceColumn={model.id === baselineModel.id}
      language={language}
      model={model}
      onCopyFull={() => {
        void navigator.clipboard.writeText(runs[model.id].content);
        toast.success(copy(language, "Yanit kopyalandi.", "Response copied."));
      }}
      onRegenerate={() => regenerateModel(model.id)}
      onScrollSync={syncScrollPosition}
      onVote={vote => setVote(model.id, vote)}
      reducedMotion={Boolean(reducedMotion)}
      registerScrollRef={registerScrollRef}
    />
  ));

  return (
    <div className="min-h-screen bg-background pb-52">
      <a
        href="#flow-compare-grid"
        className="sr-only absolute left-4 top-4 z-[80] rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground focus:not-sr-only"
      >
        {copy(language, "Karsilastirma alanina gec", "Skip to comparison")}
      </a>

      <FlowLayout
        language={language}
        eyebrow="Flow"
        title={copy(language, "Multi-Model Compare", "Multi-Model Compare")}
        description={copy(
          language,
          "Tek bir promptu birden fazla modele gonder, yanitlari bagimsiz sutunlarda karsilastir ve rapor galerisine ayni yuzeyden gec. Bu sayfa prompttaki karsilastirma mantigina gore yeniden kuruldu.",
          "Send one prompt to multiple models, compare the answers in independent columns and jump into the report gallery from the same surface. This page has been rebuilt around the comparison logic defined in the prompt."
        )}
        actions={
          <>
            <Button type="button" variant="outline" onClick={() => void reload()}>
              <RefreshCw className="size-4" />
              {copy(language, "Raporlari Yenile", "Refresh Reports")}
            </Button>
            <Button type="button" onClick={() => setLocation("/reports")}>
              <FileText className="size-4" />
              {copy(language, "Rapor Galerisi", "Report Gallery")}
            </Button>
          </>
        }
      >
        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
            <div className="flex items-center gap-2">
              <Layers3 className="size-4 text-emerald-300" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {copy(language, "Aktif Modeller", "Active Models")}
              </p>
            </div>
            <p className="mt-4 text-3xl font-semibold text-foreground">
              {selectedModelIds.length}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {copy(
                language,
                "Iki modelde bosluk kalmadan, dort modele kadar yeniden boyutlandirilabilir karsilastirma.",
                "Gapless at two models, resizable comparison up to four models."
              )}
            </p>
          </article>

          <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-indigo-300" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                {copy(language, "Yanit Durumu", "Response Status")}
              </p>
            </div>
            <p className="mt-4 text-2xl font-semibold text-foreground">
              {isRunning
                ? copy(language, "Streaming aktif", "Streaming live")
                : copy(language, "Hazir", "Ready")}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {copy(
                language,
                "Skeleton shimmer, akici imlec ve kolon bazli ilerleme geri bildirimi acik.",
                "Skeleton shimmer, streaming cursor and per-column feedback stay visible during generation."
              )}
            </p>
          </article>

          <article className="rounded-[1.8rem] border border-border bg-card/90 p-5 shadow-xl">
            <div className="flex items-center gap-2">
              <ScrollText className="size-4 text-amber-300" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                {copy(language, "Yuklu Raporlar", "Loaded Reports")}
              </p>
            </div>
            <p className="mt-4 text-3xl font-semibold text-foreground">{reports.length}</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {copy(
                language,
                "Server tarafinda parse edilmis hisse HTML raporlarina buradan gecis yapabilirsin.",
                "Jump from here into the server-parsed stock HTML reports gallery."
              )}
            </p>
          </article>
        </section>

        <FlowModelSelector
          language={language}
          models={FLOW_MODELS}
          onToggle={toggleModel}
          selectedModelIds={selectedModelIds}
        />

        <FlowWorkspaceControls
          diffMode={diffMode}
          isWideDesktop={isWideDesktop}
          language={language}
          syncScroll={syncScroll}
          onDiffChange={setDiffMode}
          onSyncChange={setSyncScroll}
        />

        <main id="flow-compare-grid" className="space-y-4">
          <section className="workspace-panel overflow-hidden p-3 md:p-4">
            {isMobile ? (
              <div className="space-y-4">
                <div className="sticky top-0 z-10 -mx-3 -mt-3 border-b border-border bg-card/95 px-3 py-3 backdrop-blur md:-mx-4 md:px-4">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedModels.map(model => {
                      const active = mobileModelId === model.id;
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => setMobileModelId(model.id)}
                          className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                            active
                              ? "border-indigo-400/35 bg-indigo-500/12 text-foreground"
                              : "border-border bg-background/60 text-muted-foreground"
                          }`}
                        >
                          {model.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Carousel className="w-full" opts={{ align: "start", loop: false }} setApi={setMobileCarouselApi}>
                  <CarouselContent>
                    {selectedModels.map(model => (
                      <CarouselItem key={model.id}>
                        <FlowModelColumn
                          baselineLabel={baselineModel.label}
                          baselineResponse={baselineResponse}
                          diffMode={diffMode}
                          entry={runs[model.id]}
                          isReferenceColumn={model.id === baselineModel.id}
                          language={language}
                          model={model}
                          onCopyFull={() => {
                            void navigator.clipboard.writeText(runs[model.id].content);
                            toast.success(copy(language, "Yanit kopyalandi.", "Response copied."));
                          }}
                          onRegenerate={() => regenerateModel(model.id)}
                          onScrollSync={syncScrollPosition}
                          onVote={vote => setVote(model.id, vote)}
                          reducedMotion={Boolean(reducedMotion)}
                          registerScrollRef={registerScrollRef}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            ) : isWideDesktop ? (
              <ResizablePanelGroup direction="horizontal" className="gap-3">
                {selectedModels.map((model, index) => (
                  <Fragment key={model.id}>
                    <ResizablePanel defaultSize={100 / selectedModels.length} minSize={18}>
                      <div className="h-full">{desktopColumns[index]}</div>
                    </ResizablePanel>
                    {index < selectedModels.length - 1 ? <ResizableHandle withHandle /> : null}
                  </Fragment>
                ))}
              </ResizablePanelGroup>
            ) : selectedModels.length <= 2 ? (
              <div className="grid gap-4 xl:grid-cols-2">{desktopColumns}</div>
            ) : (
              <div className="terminal-scrollbar flex gap-4 overflow-x-auto pb-2">
                {selectedModels.map((model, index) => (
                  <div key={model.id} className="min-w-[320px] flex-1 basis-[340px]">
                    {desktopColumns[index]}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </FlowLayout>

      <FlowPromptComposer
        characterCount={prompt.length}
        isRunning={isRunning}
        language={language}
        onApplySample={() => setPrompt(samplePrompt)}
        onStop={stopStreaming}
        onSubmit={submitPrompt}
        prompt={prompt}
        setPrompt={setPrompt}
      />
    </div>
  );
}
