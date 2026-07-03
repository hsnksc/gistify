import { type AppLanguage, t } from "@/lib/i18n";
import { useMemo, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import type {
  OpenAiImageGenerateResponse,
  OpenAiImageReferencePayload,
} from "@shared/openaiImageStudio";
import { OPENAI_IMAGE_MAX_REFERENCES } from "@shared/openaiImageStudio";
import {
  AdminField as Field,
  AdminPanel,
  AdminPanelSurface,
  AdminSectionLabel,
} from "@/components/reports/AdminPanel";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/textarea";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";

interface OpenAiImageAdminPanelProps {
  adminSecret: string;
  language: AppLanguage;
}

interface ReferenceImageDraft extends OpenAiImageReferencePayload {
  id: string;
  sizeLabel: string;
}

const OPENAI_IMAGE_PANEL_CONFIG = {
  layout: "main-preview",
} as const;

function createReferenceId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatFileSize(bytes: number, language: AppLanguage) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "-";
  }

  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} ${"MB"}`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} ${"KB"}`;
}

function readFileAsDataUrl(file: File, language: AppLanguage) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error(`${file.name} ${t("flow:couldNotBeRead")}`));
    };
    reader.onerror = () => reject(new Error(`${file.name} ${t("common:noEarningBenchmarkDataTo")}`));
    reader.readAsDataURL(file);
  });
}

export default function OpenAiImageAdminPanel({
  adminSecret,
  language,
}: OpenAiImageAdminPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<OpenAiImageGenerateResponse | null>(null);
  const [referenceImages, setReferenceImages] = useState<ReferenceImageDraft[]>([]);

  const totalSizeLabel = useMemo(() => {
    const totalBytes = referenceImages.reduce((sum, image) => {
      const raw = image.dataUrl.split(",")[1] || "";
      return sum + Math.floor((raw.length * 3) / 4);
    }, 0);

    return formatFileSize(totalBytes, language);
  }, [referenceImages, language]);

  const handlePickImages = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    setError("");

    try {
      const remainingSlots = OPENAI_IMAGE_MAX_REFERENCES - referenceImages.length;
      const selectedFiles = Array.from(files)
        .filter(file => file.type.startsWith("image/"))
        .slice(0, Math.max(0, remainingSlots));

      const nextImages = await Promise.all(
        selectedFiles.map(async file => ({
          id: createReferenceId(),
          name: file.name,
          dataUrl: await readFileAsDataUrl(file, language),
          sizeLabel: formatFileSize(file.size, language),
        }))
      );

      setReferenceImages(current => [...current, ...nextImages]);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : t("flow:referenceImagesCouldNotBe")
      );
    }
  };

  const handleGenerate = async () => {
    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt) {
      setError(t("common:primaryMarketModeUsedTo"));
      return;
    }

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/openai/image-generate", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...(adminSecret.trim()
            ? { "x-gistify-admin-secret": adminSecret.trim() }
            : {}),
        },
        body: JSON.stringify({
          prompt: normalizedPrompt,
          referenceImages: referenceImages.map(image => ({
            name: image.name,
            dataUrl: image.dataUrl,
          })),
        }),
      });

      const payload = await readJsonResponse<
        OpenAiImageGenerateResponse | { error?: string }
      >(response, "OpenAI image studio");

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(payload, t("flow:openaiImageCallFailed"))
        );
      }

      setResult(payload as OpenAiImageGenerateResponse);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : t("flow:openaiImageCouldNotBe")
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <AdminSectionLabel tone="accent">{"OpenAI Image Studio"}</AdminSectionLabel>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("flow:generateNewImageWithReference")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("flow:selectImagesFromDocumentsWrite")}
        </p>
      </div>

      <AdminPanel
        config={OPENAI_IMAGE_PANEL_CONFIG}
        main={
          <AdminPanelSurface as="article">
          <div className="space-y-6">
            <Field label={"Prompt"}>
              <Textarea
                value={prompt}
                onChange={event => setPrompt(event.target.value)}
                className="min-h-36"
                placeholder={t("flow:examplePreserveTheCompositionIn")}
              />
            </Field>

            <AdminPanelSurface as="div" tone="muted" className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("scanner:marketRegime")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("flow:maximum")} {OPENAI_IMAGE_MAX_REFERENCES} {t("flow:imagesTotalSelection")}{" "}
                    {totalSizeLabel}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={referenceImages.length >= OPENAI_IMAGE_MAX_REFERENCES}
                >
                  <ImagePlus className="size-4" />
                  {t("flow:selectImage")}
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={event => {
                  void handlePickImages(event.target.files);
                  event.target.value = "";
                }}
              />

              {referenceImages.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {referenceImages.map(image => (
                    <div
                      key={image.id}
                      className="rounded-xl border border-border bg-card/80 p-3"
                    >
                      <img
                        src={image.dataUrl}
                        alt={image.name}
                        className="h-32 w-full rounded-xl object-cover"
                      />
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {image.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {image.sizeLabel}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setReferenceImages(current =>
                              current.filter(entry => entry.id !== image.id)
                            )
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  className="p-4"
                  description={t("flow:addCompositionReferencesWithThe")}
                  title={t("flow:noReferenceImagesSelectedYet")}
                />
              )}
            </AdminPanelSurface>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={() => void handleGenerate()} disabled={busy}>
                {busy ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {busy ? t("flow:generating") : t("flow:generateWithOpenai")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setPrompt("");
                  setReferenceImages([]);
                  setResult(null);
                  setError("");
                }}
                disabled={busy}
              >
                {t("flow:clear")}
              </Button>
            </div>
          </div>
          </AdminPanelSurface>
        }
        preview={
          <AdminPanelSurface as="article">
          <AdminSectionLabel tone="accent">{t("flow:latestResult")}</AdminSectionLabel>

          {result ? (
            <div className="mt-4 space-y-4">
              <img
                src={result.imageDataUrl}
                alt={t("flow:openaiGenerated")}
                className="w-full rounded-xl border border-border bg-background/60 object-cover"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {"Model"}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {result.model}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {t("flow:reference")}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {result.referenceCount}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild>
                  <a href={result.imageDataUrl} download="gistify-openai-image.png">
                    {t("flow:downloadPng")}
                  </a>
                </Button>
                {result.requestId ? (
                  <span className="text-xs text-muted-foreground">
                    {"request id:"} {result.requestId}
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <EmptyState
              className="mt-4"
              description={t("scanner:loss2002xCredit")}
              title={t("flow:generatedImageWillBeShown")}
            />
          )}
          </AdminPanelSurface>
        }
      />
    </div>
  );
}

