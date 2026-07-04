export interface ImageDataUrlInput {
  base64: string;
  mimeType: string;
}

export interface ImageDataUrlInspection {
  isValid: boolean;
  dataUrl: string;
  mimeType: string;
  extension: string;
  byteSize: number;
  previewable: boolean;
  warnings: string[];
}

const mimeExtensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg"
};

export function buildImageDataUrl(input: ImageDataUrlInput): string {
  const mimeType = normalizeMimeType(input.mimeType);
  const base64 = stripDataUrlPrefix(input.base64).replace(/\s+/g, "");
  return `data:${mimeType};base64,${base64}`;
}

export function inspectImageDataUrl(rawInput: string, fallbackMimeType = "image/png"): ImageDataUrlInspection {
  const dataUrl = rawInput.trim().startsWith("data:")
    ? rawInput.trim()
    : buildImageDataUrl({ base64: rawInput, mimeType: fallbackMimeType });
  const match = dataUrl.match(/^data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/=\s-]+)$/i);

  if (!match) {
    return {
      isValid: false,
      dataUrl,
      mimeType: normalizeMimeType(fallbackMimeType),
      extension: mimeExtensions[normalizeMimeType(fallbackMimeType)] ?? "img",
      byteSize: 0,
      previewable: false,
      warnings: ["Input is not a valid image data URL."]
    };
  }

  const mimeType = normalizeMimeType(match[1]);
  const base64 = match[2].replace(/\s+/g, "");
  const byteSize = estimateBase64Bytes(base64);
  const warnings = [
    ...(!mimeExtensions[mimeType] ? ["MIME type may not preview in every browser."] : []),
    ...(byteSize > 1_000_000 ? ["Large data URLs can slow HTML and CSS bundles."] : [])
  ];

  return {
    isValid: true,
    dataUrl: `data:${mimeType};base64,${base64}`,
    mimeType,
    extension: mimeExtensions[mimeType] ?? "img",
    byteSize,
    previewable: mimeType.startsWith("image/"),
    warnings
  };
}

function stripDataUrlPrefix(value: string): string {
  return value.trim().replace(/^data:image\/[a-z0-9.+-]+;base64,/i, "");
}

function normalizeMimeType(value: string): string {
  const normalized = value.trim().toLowerCase();
  return normalized.startsWith("image/") ? normalized : "image/png";
}

function estimateBase64Bytes(base64: string): number {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}
