import { useMemo, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import type {
  OpenAiImageGenerateResponse,
  OpenAiImageReferencePayload,
} from "@shared/openaiImageStudio";
import { OPENAI_IMAGE_MAX_REFERENCES } from "@shared/openaiImageStudio";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";

interface OpenAiImageAdminPanelProps {
  adminSecret: string;
}

interface ReferenceImageDraft extends OpenAiImageReferencePayload {
  id: string;
  sizeLabel: string;
}

function createReferenceId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "-";
  }

  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error(`${file.name} okunamadi.`));
    };
    reader.onerror = () => reject(new Error(`${file.name} okunamadi.`));
    reader.readAsDataURL(file);
  });
}

export default function OpenAiImageAdminPanel({
  adminSecret,
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

    return formatFileSize(totalBytes);
  }, [referenceImages]);

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
          dataUrl: await readFileAsDataUrl(file),
          sizeLabel: formatFileSize(file.size),
        }))
      );

      setReferenceImages(current => [...current, ...nextImages]);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Referans gorseller yuklenemedi."
      );
    }
  };

  const handleGenerate = async () => {
    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt) {
      setError("Prompt gerekli.");
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
          extractApiErrorMessage(payload, "OpenAI image cagrisi basarisiz oldu.")
        );
      }

      setResult(payload as OpenAiImageGenerateResponse);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "OpenAI image olusturulamadi."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
          OpenAI Image Studio
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Referans gorsellerle yeni image uret
        </h2>
        <p className="text-sm text-muted-foreground">
          Belgelerdeki gorselleri sec, prompt'u yaz ve sonucu server-side
          `OPENAI_API_KEY` ile uret. PDF veya DOC degil, dogrudan gorsel dosyasi
          yuklenir.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
          <div className="space-y-5">
            <label className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">
                Prompt
              </span>
              <Textarea
                value={prompt}
                onChange={event => setPrompt(event.target.value)}
                className="min-h-36"
                placeholder="Ornek: Bu iki referans gorseldeki kompozisyonu koru, daha premium bir landing page hero ilustrasyonu uret."
              />
            </label>

            <div className="space-y-3 rounded-[1.5rem] border border-border bg-background/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Referans gorseller
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Maksimum {OPENAI_IMAGE_MAX_REFERENCES} adet, toplam secim:{" "}
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
                  Gorsel sec
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
                      className="rounded-[1.25rem] border border-border bg-card/80 p-3"
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
                <div className="rounded-[1.25rem] border border-dashed border-border bg-background/40 p-4 text-sm text-muted-foreground">
                  Henuz referans gorsel secilmedi.
                </div>
              )}
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={() => void handleGenerate()} disabled={busy}>
                {busy ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {busy ? "Uretiliyor" : "OpenAI ile uret"}
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
                Temizle
              </Button>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Son sonuc
          </p>

          {result ? (
            <div className="mt-4 space-y-4">
              <img
                src={result.imageDataUrl}
                alt="OpenAI generated"
                className="w-full rounded-[1.5rem] border border-border bg-background/60 object-cover"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-border bg-background/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Model
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {result.model}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-border bg-background/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Referans
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {result.referenceCount}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild>
                  <a href={result.imageDataUrl} download="gistify-openai-image.png">
                    PNG indir
                  </a>
                </Button>
                {result.requestId ? (
                  <span className="text-xs text-muted-foreground">
                    request id: {result.requestId}
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-[1.5rem] border border-dashed border-border bg-background/40 p-5 text-sm text-muted-foreground">
              Uretilen gorsel burada preview olarak gosterilecek.
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
