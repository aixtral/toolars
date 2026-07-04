import { describe, expect, it } from "vitest";
import { calculateTokenCount, tokenCounterProfiles } from "./token-counter";

describe("calculateTokenCount", () => {
  it("estimates tokens and selected-model cost from prompt characters", () => {
    const result = calculateTokenCount({
      text: "a".repeat(400),
      selectedModel: "gpt-4o"
    });

    expect(result.characterCount).toBe(400);
    expect(result.estimatedTokens).toBe(100);
    expect(result.selectedModel.label).toBe("GPT-4o");
    expect(result.estimatedCost).toBeCloseTo(0.0005, 8);
    expect(result.formattedEstimatedCost).toBe("$0.000500");
    expect(result.modelRows.map((row) => row.model.key)).toEqual(Object.keys(tokenCounterProfiles));
  });

  it("counts words and lines while preserving local-only output metadata", () => {
    const result = calculateTokenCount({
      text: "System prompt\nwith three words",
      selectedModel: "gpt-4o-mini"
    });

    expect(result.wordCount).toBe(5);
    expect(result.lineCount).toBe(2);
    expect(result.estimatedTokens).toBe(8);
    expect(result.summary).toContain("8 estimated tokens");
    expect(result.privacyNote).toBe("Local estimate only; no prompt text leaves the browser.");
  });

  it("returns zero counts for blank prompts", () => {
    const result = calculateTokenCount({
      text: "   \n\t",
      selectedModel: "claude-3-5-sonnet"
    });

    expect(result.characterCount).toBe(0);
    expect(result.wordCount).toBe(0);
    expect(result.lineCount).toBe(0);
    expect(result.estimatedTokens).toBe(0);
    expect(result.formattedEstimatedCost).toBe("$0.000000");
  });
});
