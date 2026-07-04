import { describe, expect, it } from "vitest";
import { visualizeContextWindow } from "./context-window";

describe("visualizeContextWindow", () => {
  it("calculates context utilization and segment percentages", () => {
    const result = visualizeContextWindow({
      maxTokens: 16000,
      segments: [
        { label: "System", tokens: 1200 },
        { label: "User", tokens: 800 },
        { label: "Retrieval", tokens: 9000 },
        { label: "Tools", tokens: 1200 },
        { label: "Output reserve", tokens: 2000 }
      ]
    });

    expect(result.usedTokens).toBe(14200);
    expect(result.remainingTokens).toBe(1800);
    expect(result.utilizationPercent).toBe(89);
    expect(result.status).toBe("tight");
    expect(result.segments[2]).toMatchObject({ label: "Retrieval", percent: 56 });
    expect(result.warnings).toContain("Context is tight; keep output reserve visible before sending.");
  });

  it("flags overflow when allocation exceeds the context window", () => {
    const result = visualizeContextWindow({
      maxTokens: 1000,
      segments: [{ label: "Prompt", tokens: 1200 }]
    });

    expect(result.remainingTokens).toBe(0);
    expect(result.overflowTokens).toBe(200);
    expect(result.status).toBe("overflow");
  });
});
