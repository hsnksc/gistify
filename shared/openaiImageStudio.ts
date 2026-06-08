export const OPENAI_IMAGE_MAX_REFERENCES = 4;
export type OpenAiImageOutputSize =
  | "auto"
  | "1024x1024"
  | "1536x1024"
  | "1024x1536";
export type OpenAiImageQuality = "auto" | "low" | "medium" | "high";
export type OpenAiImageBackground = "auto" | "opaque" | "transparent";
export type OpenAiImageOutputFormat = "png" | "jpeg" | "webp";
export type OpenAiImageInputFidelity = "low" | "high";

export interface OpenAiImageReferencePayload {
  name: string;
  dataUrl: string;
}

export interface OpenAiImageGenerateRequest {
  prompt: string;
  referenceImages: OpenAiImageReferencePayload[];
  size?: OpenAiImageOutputSize;
  quality?: OpenAiImageQuality;
  background?: OpenAiImageBackground;
  outputFormat?: OpenAiImageOutputFormat;
  outputCompression?: number;
  inputFidelity?: OpenAiImageInputFidelity;
}

export interface OpenAiImageGenerateResponse {
  imageDataUrl: string;
  mimeType: string;
  model: string;
  referenceCount: number;
  requestId?: string;
}
