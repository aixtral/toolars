export interface SvgOptimizerOptions {
  removeComments: boolean;
  removeMetadata: boolean;
  collapseWhitespace: boolean;
}

export interface SvgOptimizerResult {
  optimized: string;
  originalBytes: number;
  optimizedBytes: number;
  savingsBytes: number;
  savingsPercent: number;
  warnings: string[];
}

export function optimizeSvg(svg: string, options: SvgOptimizerOptions): SvgOptimizerResult {
  const original = svg.trim();
  let optimized = original;

  if (options.removeComments) optimized = optimized.replace(/<!--[\s\S]*?-->/g, "");
  if (options.removeMetadata) optimized = optimized.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
  if (options.collapseWhitespace) {
    optimized = optimized.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
  }

  const originalBytes = byteLength(original);
  const optimizedBytes = byteLength(optimized);
  const savingsBytes = Math.max(0, originalBytes - optimizedBytes);

  return {
    optimized,
    originalBytes,
    optimizedBytes,
    savingsBytes,
    savingsPercent: originalBytes ? Math.round((savingsBytes / originalBytes) * 1000) / 10 : 0,
    warnings: [
      ...(!/^<svg[\s>]/i.test(optimized) ? ["Optimized output does not start with an SVG element."] : []),
      ...(!/viewBox=/i.test(optimized) ? ["SVG has no viewBox; responsive scaling may be fragile."] : [])
    ]
  };
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}
