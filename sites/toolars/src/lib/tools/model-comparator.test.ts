import { describe, expect, it } from "vitest";
import { compareModelProfiles } from "./model-comparator";

describe("compareModelProfiles", () => {
  it("ranks local model profiles by workload fit, cost, context, and latency", () => {
    const result = compareModelProfiles({
      inputTokens: 12000,
      outputTokens: 2000,
      latencyTargetMs: 1500,
      qualityTarget: "balanced"
    });

    expect(result.rows).toHaveLength(4);
    expect(result.recommendedModel.key).toBe("gpt-4o-mini");
    expect(result.rows[0].fitScore).toBeGreaterThanOrEqual(result.rows[1].fitScore);
    expect(result.rows.every((row) => row.contextFits)).toBe(true);
    expect(result.summary).toContain("recommended");
  });

  it("penalizes models that cannot fit the requested context", () => {
    const result = compareModelProfiles({
      inputTokens: 180000,
      outputTokens: 2000,
      latencyTargetMs: 2000,
      qualityTarget: "high"
    });

    expect(result.rows.some((row) => !row.contextFits)).toBe(true);
    expect(result.warnings).toContain("Some models cannot fit the requested context window.");
  });
});
