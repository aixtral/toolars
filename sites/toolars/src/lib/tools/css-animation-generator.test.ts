import { describe, expect, it } from "vitest";
import { generateCssAnimation } from "./css-animation-generator";

describe("CSS animation generator", () => {
  it("generates keyframes, animation declarations, and reduced-motion fallback", () => {
    const result = generateCssAnimation({
      name: "fade-in",
      preset: "fade",
      durationMs: 600,
      easing: "ease-out",
      delayMs: 0,
      iterationCount: "1",
      direction: "normal"
    });

    expect(result.css).toContain("@keyframes fade-in");
    expect(result.css).toContain("animation: fade-in 600ms ease-out 0ms 1 normal both;");
    expect(result.css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(result.warningCount).toBe(0);
  });
});
