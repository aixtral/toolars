import { describe, expect, it } from "vitest";
import { estimatePdfCompression } from "./pdf-compressor";

describe("estimatePdfCompression", () => {
  it("estimates local compression savings from PDF metadata and profile", () => {
    const result = estimatePdfCompression({
      file: { name: "Large Deck.pdf", pages: 24, sizeBytes: 12 * 1024 * 1024, type: "application/pdf" },
      profile: "balanced",
      removeMetadata: true
    });

    expect(result.status).toBe("ready");
    expect(result.output.fileName).toBe("Large_Deck_compressed.pdf");
    expect(result.output.originalSizeMb).toBe(12);
    expect(result.output.estimatedSizeMb).toBe(7.1);
    expect(result.output.savingsPercent).toBe(41);
    expect(result.trustBoundary.mode).toBe("local-estimate");
  });

  it("blocks non-PDF input before compression planning", () => {
    const result = estimatePdfCompression({
      file: { name: "photo.png", pages: 1, sizeBytes: 800_000, type: "image/png" },
      profile: "screen",
      removeMetadata: false
    });

    expect(result.status).toBe("blocked");
    expect(result.validationIssues).toEqual(["Add a PDF file before estimating compression."]);
  });
});
