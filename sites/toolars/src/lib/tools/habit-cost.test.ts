import { describe, expect, it } from "vitest";
import { calculateHabitCost, defaultHabitCostScenario } from "./habit-cost";

describe("calculateHabitCost", () => {
  it("calculates the VitalCalc default habit opportunity cost", () => {
    const result = calculateHabitCost(defaultHabitCostScenario);

    expect(result.formattedWeeklyCost).toBe("$42");
    expect(result.formattedAnnualCost).toBe("$2,184");
    expect(result.formattedTotalSpent).toBe("$21,840");
    expect(result.formattedFutureValue).toBe("$31,131");
    expect(result.formattedInvestmentGain).toBe("$9,291");
    expect(result.summary).toBe("$42 weekly habit over 10 years");
  });

  it("handles a zero return assumption without compounding gain", () => {
    const result = calculateHabitCost({
      costPerOccurrence: 5,
      frequencyPerWeek: 5,
      years: 2,
      annualReturnRate: 0
    });

    expect(result.formattedTotalSpent).toBe("$2,600");
    expect(result.formattedFutureValue).toBe("$2,600");
    expect(result.formattedInvestmentGain).toBe("$0");
  });
});
