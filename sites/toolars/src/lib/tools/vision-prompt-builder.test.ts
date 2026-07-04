import { describe, expect, it } from "vitest";
import { buildVisionPrompt } from "./vision-prompt-builder";

describe("buildVisionPrompt", () => {
  it("combines subject, framing, visual checks, and output format", () => {
    const result = buildVisionPrompt({
      subject: "Inspect a damaged shipping label",
      framing: "macro close-up",
      visualChecks: "barcode legibility\nrecipient address visibility",
      outputFormat: "Return JSON with risk and evidence"
    });

    expect(result.prompt).toContain("Inspect a damaged shipping label");
    expect(result.prompt).toContain("macro close-up");
    expect(result.prompt).toContain("barcode legibility");
    expect(result.checks).toHaveLength(2);
    expect(result.reviewNote).toMatch(/image/i);
  });
});
