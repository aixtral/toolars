import { describe, expect, it } from "vitest";
import { generateBarcodeSvg } from "./barcode-generator";

describe("generateBarcodeSvg", () => {
  it("generates local CODE39 SVG output with quiet-zone metadata", () => {
    const result = generateBarcodeSvg({
      format: "CODE39",
      height: 80,
      value: "TOOLARS-42",
      width: 2
    });

    expect(result.status).toBe("ready");
    expect(result.output.formattedValue).toBe("*TOOLARS-42*");
    expect(result.output.svg).toContain("<svg");
    expect(result.output.svg).toContain('data-barcode-format="CODE39"');
    expect(result.trustBoundary.mode).toBe("local-svg");
  });

  it("validates EAN-13 check digits before export", () => {
    const result = generateBarcodeSvg({
      format: "EAN13",
      height: 80,
      value: "4006381333932",
      width: 2
    });

    expect(result.status).toBe("blocked");
    expect(result.validationIssues).toEqual(["EAN-13 requires 13 digits with a valid check digit."]);
  });
});
