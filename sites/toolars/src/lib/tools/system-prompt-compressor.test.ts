import { describe, expect, it } from "vitest";
import { analyzeSystemPromptCompression } from "./system-prompt-compressor";

describe("analyzeSystemPromptCompression", () => {
  it("compresses verbose prompt phrases while estimating token savings", () => {
    const result = analyzeSystemPromptCompression({
      text: "You are an AI assistant that please please respond in order to help. It is important to note that follow policy."
    });

    expect(result.originalTokens).toBeGreaterThan(result.compressedTokens);
    expect(result.tokensSaved).toBeGreaterThan(0);
    expect(result.compressionRatio).toBeGreaterThan(0);
    expect(result.compressedText).not.toMatch(/please please|in order to|important to note/i);
    expect(result.compressedText).toContain("You please respond to help");
    expect(result.suggestions.map((suggestion) => suggestion.type)).toEqual(
      expect.arrayContaining(["redundancy", "verbose", "filler"])
    );
  });

  it("returns preservation checks and local-only metadata for review", () => {
    const result = analyzeSystemPromptCompression({
      text: "You are a support agent. You must refuse unsafe requests. Output JSON with a reason field."
    });

    expect(result.preservationChecks.map((check) => check.key)).toEqual(["role", "policy", "format"]);
    expect(result.preservationChecks.every((check) => check.status === "kept")).toBe(true);
    expect(result.summary).toContain("estimated tokens");
    expect(result.privacyNote).toBe("Local compression only; prompt text stays in the browser.");
  });

  it("returns an empty compression report for blank prompts", () => {
    const result = analyzeSystemPromptCompression({ text: "   \n\t" });

    expect(result.originalTokens).toBe(0);
    expect(result.compressedTokens).toBe(0);
    expect(result.tokensSaved).toBe(0);
    expect(result.compressionRatio).toBe(0);
    expect(result.compressedText).toBe("");
    expect(result.suggestions).toEqual([]);
  });
});
