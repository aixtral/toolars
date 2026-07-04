import { describe, expect, it } from "vitest";
import { generateCodeImageSvg } from "./code-to-image";

describe("code to image", () => {
  it("renders escaped code into a shareable SVG image", () => {
    const result = generateCodeImageSvg({
      code: "const total = price * quantity;",
      language: "ts",
      theme: "midnight",
      padding: 32,
      title: "cart.ts"
    });

    expect(result.svg).toContain("<svg");
    expect(result.svg).toContain("cart.ts");
    expect(result.svg).toContain("const total = price * quantity;");
    expect(result.dataUrl).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(result.width).toBeGreaterThan(400);
  });
});
