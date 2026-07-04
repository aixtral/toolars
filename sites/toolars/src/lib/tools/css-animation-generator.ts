export type AnimationPreset = "fade" | "slide-up" | "pulse";
export type AnimationDirection = "normal" | "reverse" | "alternate" | "alternate-reverse";

export interface CssAnimationOptions {
  name: string;
  preset: AnimationPreset;
  durationMs: number;
  easing: string;
  delayMs: number;
  iterationCount: string;
  direction: AnimationDirection;
}

export interface CssAnimationResult {
  css: string;
  keyframes: string;
  declaration: string;
  warningCount: number;
  warnings: string[];
}

export const ANIMATION_PRESETS: Record<AnimationPreset, { label: string; from: string; to: string }> = {
  fade: { label: "Fade", from: "opacity: 0;", to: "opacity: 1;" },
  "slide-up": { label: "Slide up", from: "opacity: 0; transform: translateY(16px);", to: "opacity: 1; transform: translateY(0);" },
  pulse: { label: "Pulse", from: "transform: scale(0.96); opacity: 0.72;", to: "transform: scale(1); opacity: 1;" }
};

export function generateCssAnimation(options: CssAnimationOptions): CssAnimationResult {
  const name = sanitizeAnimationName(options.name);
  const preset = ANIMATION_PRESETS[options.preset];
  const durationMs = Math.max(1, Math.round(options.durationMs));
  const delayMs = Math.max(0, Math.round(options.delayMs));
  const iterationCount = options.iterationCount.trim() || "1";
  const declaration = `animation: ${name} ${durationMs}ms ${options.easing} ${delayMs}ms ${iterationCount} ${options.direction} both;`;
  const keyframes = `@keyframes ${name} {\n  from { ${preset.from} }\n  to { ${preset.to} }\n}`;
  const reducedMotion = `@media (prefers-reduced-motion: reduce) {\n  .${name} {\n    animation: none;\n  }\n}`;
  const warnings = [
    ...(durationMs > 1200 ? ["Long motion can feel slow; check reduced-motion expectations."] : []),
    ...(iterationCount === "infinite" ? ["Infinite animation should be used sparingly in dense interfaces."] : [])
  ];

  return {
    css: [keyframes, `.${name} {\n  ${declaration}\n}`, reducedMotion].join("\n\n"),
    keyframes,
    declaration,
    warningCount: warnings.length,
    warnings
  };
}

function sanitizeAnimationName(name: string): string {
  const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return sanitized || "toolars-animation";
}
