import { describe, expect, it } from "vitest";
import { calculateBudgetRule, defaultBudgetRuleScenario } from "./budget-rule";

describe("calculateBudgetRule", () => {
  it("calculates the default VitalCalc 50/30/20 allocation", () => {
    const result = calculateBudgetRule(defaultBudgetRuleScenario);

    expect(result.formattedIncome).toBe("$5,000");
    expect(result.formattedNeedsAmount).toBe("$2,500");
    expect(result.formattedWantsAmount).toBe("$1,500");
    expect(result.formattedSavingsAmount).toBe("$1,000");
    expect(result.totalPercent).toBe(100);
    expect(result.healthTone).toBe("healthy");
    expect(result.summary).toBe("50% needs / 30% wants / 20% savings");
  });

  it("warns when ratios do not add to 100 percent", () => {
    const result = calculateBudgetRule({
      monthlyIncome: 4000,
      needsPercent: 60,
      wantsPercent: 30,
      savingsPercent: 20
    });

    expect(result.totalPercent).toBe(110);
    expect(result.healthTone).toBe("warning");
    expect(result.message).toBe("Total is 110%. Adjust to 100%.");
  });
});
