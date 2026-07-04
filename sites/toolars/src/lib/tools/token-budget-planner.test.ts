import { describe, expect, it } from "vitest";
import { planTokenBudget } from "./token-budget-planner";

describe("planTokenBudget", () => {
  it("summarizes token budget allocations and remaining headroom", () => {
    const result = planTokenBudget({
      totalBudget: 32000,
      allocations: [
        { label: "System", tokens: 1500 },
        { label: "User", tokens: 2500 },
        { label: "Retrieval", tokens: 18000 },
        { label: "Tools", tokens: 3000 },
        { label: "Output reserve", tokens: 5000 }
      ]
    });

    expect(result.totalAllocated).toBe(30000);
    expect(result.remainingTokens).toBe(2000);
    expect(result.status).toBe("balanced");
    expect(result.allocations[2]).toMatchObject({ label: "Retrieval", percent: 56 });
    expect(result.summary).toContain("2,000 tokens remaining");
  });

  it("flags over-budget plans", () => {
    const result = planTokenBudget({
      totalBudget: 1000,
      allocations: [{ label: "Retrieval", tokens: 1500 }]
    });

    expect(result.status).toBe("over");
    expect(result.overBudgetTokens).toBe(500);
    expect(result.warnings).toContain("Token plan exceeds the available context budget.");
  });
});
