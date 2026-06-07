export const OPENAI_IMAGE_MAX_REFERENCES = 4;

export interface OpenAiImageReferencePayload {
  name: string;
  dataUrl: string;
}

export interface OpenAiImageGenerateRequest {
  prompt: string;
  referenceImages: OpenAiImageReferencePayload[];
}

export interface OpenAiImageGenerateResponse {
  imageDataUrl: string;
  mimeType: string;
  model: string;
  referenceCount: number;
  requestId?: string;
}
