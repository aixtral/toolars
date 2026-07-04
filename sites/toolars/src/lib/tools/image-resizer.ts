export type ResizeFormat = "png" | "jpeg" | "webp";

export interface ResizePlanInput {
  sourceWidth: number;
  sourceHeight: number;
  sourceBytes: number;
  targetWidth: number;
  targetHeight: number;
  lockAspectRatio: boolean;
  format: ResizeFormat;
  quality: number;
}

export interface ResizePlanResult {
  targetWidth: number;
  targetHeight: number;
  scale: number;
  estimatedBytes: number;
  summary: string;
  warnings: string[];
}

const formatMultiplier: Record<ResizeFormat, number> = {
  png: 1,
  jpeg: 0.72,
  webp: 0.58
};

export function calculateResizePlan(input: ResizePlanInput): ResizePlanResult {
  const sourceWidth = positive(input.sourceWidth, 1);
  const sourceHeight = positive(input.sourceHeight, 1);
  const targetWidth = positive(input.targetWidth, sourceWidth);
  const targetHeight = input.lockAspectRatio
    ? Math.max(1, Math.round((targetWidth / sourceWidth) * sourceHeight))
    : positive(input.targetHeight, sourceHeight);
  const scale = round(targetWidth / sourceWidth, 4);
  const areaRatio = (targetWidth * targetHeight) / (sourceWidth * sourceHeight);
  const qualityFactor = Math.max(1, Math.min(100, input.quality)) / 100;
  const estimatedBytes = Math.max(1, Math.round(input.sourceBytes * areaRatio * formatMultiplier[input.format] * qualityFactor));
  const warnings = [
    ...(targetWidth > sourceWidth || targetHeight > sourceHeight ? ["Upscaling can soften image detail."] : []),
    ...(!input.lockAspectRatio ? ["Unlocked aspect ratio can distort screenshots and logos."] : [])
  ];

  return {
    targetWidth,
    targetHeight,
    scale,
    estimatedBytes,
    summary: `${targetWidth} x ${targetHeight} ${input.format.toUpperCase()} at ${Math.round(qualityFactor * 100)}% quality`,
    warnings
  };
}

function positive(value: number, fallback: number): number {
  return Math.max(1, Math.round(Number.isFinite(value) ? value : fallback));
}

function round(value: number, precision: number): number {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}
