import { describe, expect, it } from "vitest";
import { generateQrCodeSvg } from "./qr-code-generator";

describe("generateQrCodeSvg", () => {
  it("creates a deterministic local QR preview SVG with export metadata", () => {
    const result = generateQrCodeSvg({
      backgroundColor: "#ffffff",
      content: "https://toolars.app/tools",
      errorCorrectionLevel: "M",
      foregroundColor: "#111111",
      size: 192
    });

    expect(result.status).toBe("ready");
    expect(result.output.svg).toContain("<svg");
    expect(result.output.svg).toContain('data-qr-content-length="25"');
    expect(result.output.moduleCount).toBe(21);
    expect(result.trustBoundary.mode).toBe("local-svg-preview");
  });

  it("requires content before generating a QR preview", () => {
    const result = generateQrCodeSvg({
      backgroundColor: "#ffffff",
      content: "   ",
      errorCorrectionLevel: "Q",
      foregroundColor: "#111111",
      size: 256
    });

    expect(result.status).toBe("blocked");
    expect(result.validationIssues).toEqual(["Enter text or a URL before generating a QR preview."]);
  });
});
