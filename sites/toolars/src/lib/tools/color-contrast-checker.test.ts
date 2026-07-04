import { describe, expect, it } from "vitest";
import { checkColorContrast, contrastRatio, getWcagLevel } from "./color-contrast-checker";

describe("color contrast utilities", () => {
  it("calculates WCAG contrast ratio and pass levels", () => {
    const result = checkColorContrast({ foreground: "#000000", background: "#ffffff" });

    expect(result.success).toBe(true);
    expect(result.ratio).toBe(21);
    expect(result.formattedRatio).toBe("21.00:1");
    expect(result.wcag.aaa.normal).toBe(true);
    expect(result.summary).toBe("21.00:1 contrast ratio passes WCAG AAA for normal text.");
  });

  it("reports AA large-only status for lower contrast pairs", () => {
    const ratio = contrastRatio("#777777", "#ffffff");
    const wcag = getWcagLevel(ratio);

    expect(ratio).toBeCloseTo(4.48, 2);
    expect(wcag.aa.normal).toBe(false);
    expect(wcag.aa.large).toBe(true);
  });

  it("rejects invalid foreground and background values", () => {
    const result = checkColorContrast({ foreground: "pinkish", background: "#fff" });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe("invalid-color");
    expect(result.summary).toBe("Contrast check failed.");
  });
});
