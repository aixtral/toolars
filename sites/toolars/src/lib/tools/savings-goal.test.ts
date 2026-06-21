import { describe, expect, it } from "vitest";
import { calculateSavingsGoal, defaultSavingsGoalScenario } from "./savings-goal";

describe("calculateSavingsGoal", () => {
  it("calculates the default VitalCalc savings goal timeline", () => {
    const result = calculateSavingsGoal(defaultSavingsGoalScenario);

    expect(result.monthsToGoal).toBe(65);
    expect(result.formattedTotalContributions).toBe("$42,500");
    expect(result.formattedInterestEarned).toBe("$7,841");
    expect(result.formattedFinalAmount).toBe("$50,341");
    expect(result.summary).toBe("$50,000 goal with $500/month");
  });

  it("returns 50+ years when monthly savings cannot reach the goal within the source cap", () => {
    const result = calculateSavingsGoal({
      goalAmount: 50000,
      currentSavings: 0,
      monthlySavings: 1,
      annualReturnRate: 0
    });

    expect(result.monthsToGoal).toBe(600);
    expect(result.timeLabel).toBe("50+ years");
    expect(result.formattedFinalAmount).toBe("$600");
  });
});
