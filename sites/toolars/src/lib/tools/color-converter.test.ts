import { describe, expect, it } from "vitest";
import { convertColor } from "./color-converter";

describe("convertColor", () => {
  it("converts CSS named colors into Toolars color formats", () => {
    const result = convertColor("rebeccapurple");

    expect(result.success).toBe(true);
    expect(result.inputFormat).toBe("name");
    expect(result.hex).toBe("#663399");
    expect(result.rgb).toEqual({ r: 102, g: 51, b: 153 });
    expect(result.hsl).toEqual({ h: 270, s: 50, l: 40 });
    expect(result.hsv).toEqual({ h: 270, s: 67, v: 60 });
    expect(result.cmyk).toEqual({ c: 33, m: 67, y: 0, k: 40 });
  });

  it("normalizes RGB input into copy-ready CSS strings", () => {
    const result = convertColor("rgb(14, 165, 233)");

    expect(result.success).toBe(true);
    expect(result.hex).toBe("#0EA5E9");
    expect(result.css).toMatchObject({
      rgb: "rgb(14, 165, 233)",
      hsl: "hsl(199, 89%, 48%)",
      hsv: "hsv(199, 94%, 91%)",
      cmyk: "cmyk(94%, 29%, 0%, 9%)"
    });
  });

  it("returns a stable validation error for unsupported color input", () => {
    const result = convertColor("not-a-color");

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe("invalid-color");
    expect(result.summary).toBe("Color conversion failed.");
  });
});
