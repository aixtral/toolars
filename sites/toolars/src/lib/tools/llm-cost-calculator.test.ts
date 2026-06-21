import { describe, expect, it } from "vitest";
import { calculateLlmCost, llmCostProfiles } from "./llm-cost-calculator";

describe("calculateLlmCost", () => {
  it("calculates the design sample with the balanced model profile", () => {
    const result = calculateLlmCost({
      inputTokensPerRequest: 2400,
      outputTokensPerRequest: 700,
      requestsPerMonth: 180000,
      modelProfile: "balanced"
    });

    expect(result.modelLabel).toBe("Balanced model");
    expect(result.inputTokensMonthly).toBe(432_000_000);
    expect(result.outputTokensMonthly).toBe(126_000_000);
    expect(result.totalTokensMonthly).toBe(558_000_000);
    expect(result.inputCost).toBeCloseTo(259.2, 2);
    expect(result.outputCost).toBeCloseTo(302.4, 2);
    expect(result.totalCost).toBeCloseTo(561.6, 2);
    expect(result.formattedTotalCost).toBe("$562");
    expect(result.formattedMonthlyTokens).toBe("558M");
    expect(result.inputSharePercent).toBe(77);
    expect(result.outputSharePercent).toBe(23);
  });

  it("compares small and premium model profiles using the same usage", () => {
    const usage = {
      inputTokensPerRequest: 2400,
      outputTokensPerRequest: 700,
      requestsPerMonth: 180000
    };

    const small = calculateLlmCost({ ...usage, modelProfile: "small" });
    const premium = calculateLlmCost({ ...usage, modelProfile: "premium" });

    expect(llmCostProfiles.small.inputPerMillion).toBe(0.15);
    expect(small.formattedTotalCost).toBe("$140");
    expect(premium.formattedTotalCost).toBe("$2,808");
    expect(premium.totalCost).toBeGreaterThan(small.totalCost);
  });

  it("sanitizes invalid numeric inputs to zero", () => {
    const result = calculateLlmCost({
      inputTokensPerRequest: -1,
      outputTokensPerRequest: Number.NaN,
      requestsPerMonth: Number.POSITIVE_INFINITY,
      modelProfile: "balanced"
    });

    expect(result.totalTokensMonthly).toBe(0);
    expect(result.totalCost).toBe(0);
    expect(result.formattedTotalCost).toBe("$0");
  });
});
