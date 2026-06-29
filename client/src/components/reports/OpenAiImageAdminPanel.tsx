import { copy, type AppLanguage } from "@/lib/i18n";
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
    return copy(language, "-", "-");
  }

  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} ${copy(language, "MB", "MB")}`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} ${copy(language, "KB", "KB")}`;
}

function readFileAsDataUrl(file: File, language: AppLanguage) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error(`${file.name} ${copy(language, "okunamadi.", "could not be read.")}`));
    };
    reader.onerror = () => reject(new Error(`${file.name} ${copy(language, "okunamadi.", "could not be read.")}`));
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
        nextError instanceof Error ? nextError.message : copy(language, "Referans gorseller yuklenemedi.", "Reference images could not be loaded.")
      );
    }
  };

  const handleGenerate = async () => {
    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt) {
      setError(copy(language, "Prompt gerekli.", "Prompt is required."));
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
      >(response, copy(language, "OpenAI image studio", "OpenAI image studio"));

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(payload, copy(language, "OpenAI image cagrisi basarisiz oldu.", "OpenAI image call failed."))
        );
      }

      setResult(payload as OpenAiImageGenerateResponse);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : copy(language, "OpenAI image olusturulamadi.", "OpenAI image could not be created.")
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <AdminSectionLabel tone="accent">{copy(language, "OpenAI Image Studio", "OpenAI Image Studio")}</AdminSectionLabel>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {copy(language, "Referans gorsellerle yeni image uret", "Generate new image with reference images")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {copy(language, "Belgelerdeki gorselleri sec, prompt'u yaz ve sonucu server-side `OPENAI_API_KEY` ile uret. PDF veya DOC degil, dogrudan gorsel dosyasi yuklenir.", "Select images from documents, write the prompt and produce the result with server-side `OPENAI_API_KEY`. Not PDF or DOC, direct image file is uploaded.")}
        </p>
      </div>

      <AdminPanel
        config={OPENAI_IMAGE_PANEL_CONFIG}
        main={
          <AdminPanelSurface as="article">
          <div className="space-y-6">
            <Field label={copy(language, "Prompt", "Prompt")}>
              <Textarea
                value={prompt}
                onChange={event => setPrompt(event.target.value)}
                className="min-h-36"
                placeholder={copy(language, "Ornek: Bu iki referans gorseldeki kompozisyonu koru, daha premium bir landing page hero ilustrasyonu uret.", "Example: Preserve the composition in these two reference images, create a more premium landing page hero illustration.")}
              />
            </Field>

            <AdminPanelSurface as="div" tone="muted" className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {copy(language, "Referans gorseller", "Reference Images")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {copy(language, "Maksimum", "Maximum")} {OPENAI_IMAGE_MAX_REFERENCES} {copy(language, "adet, toplam secim:", "images, total selection:")}{" "}
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
                  {copy(language, "Gorsel sec", "Select Image")}
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
                  description={copy(language, "Gorsel sec butonuyla kompozisyon referanslarini ekle.", "Add composition references with the Select Image button.")}
                  title={copy(language, "Henuz referans gorsel secilmedi", "No reference images selected yet")}
                />
              )}
            </AdminPanelSurface>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={() => void handleGenerate()} disabled={busy}>
                {busy ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {busy ? copy(language, "Uretiliyor", "Generating") : copy(language, "OpenAI ile uret", "Generate with OpenAI")}
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
                {copy(language, "Temizle", "Clear")}
              </Button>
            </div>
          </div>
          </AdminPanelSurface>
        }
        preview={
          <AdminPanelSurface as="article">
          <AdminSectionLabel tone="accent">{copy(language, "Son sonuc", "Latest Result")}</AdminSectionLabel>

          {result ? (
            <div className="mt-4 space-y-4">
              <img
                src={result.imageDataUrl}
                alt={copy(language, "OpenAI uretimi", "OpenAI generated")}
                className="w-full rounded-xl border border-border bg-background/60 object-cover"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {copy(language, "Model", "Model")}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {result.model}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {copy(language, "Referans", "Reference")}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {result.referenceCount}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild>
                  <a href={result.imageDataUrl} download="gistify-openai-image.png">
                    {copy(language, "PNG indir", "Download PNG")}
                  </a>
                </Button>
                {result.requestId ? (
                  <span className="text-xs text-muted-foreground">
                    {copy(language, "request id:", "request id:")} {result.requestId}
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <EmptyState
              className="mt-4"
              description={copy(language, "OpenAI istegi tamamlandiginda preview burada gosterilecek.", "When the OpenAI request is completed, preview will be shown here.")}
              title={copy(language, "Uretilen gorsel burada preview olarak gosterilecek", "Generated image will be shown here as preview")}
            />
          )}
          </AdminPanelSurface>
        }
      />
    </div>
  );
}

