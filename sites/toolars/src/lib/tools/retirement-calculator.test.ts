import { describe, expect, it } from "vitest";
import { calculateRetirementPlan, defaultRetirementScenario } from "./retirement-calculator";

describe("calculateRetirementPlan", () => {
  it("calculates the default VitalCalc retirement projection", () => {
    const result = calculateRetirementPlan(defaultRetirementScenario);

    expect(result.yearsToRetirement).toBe(30);
    expect(result.formattedNestEggNeeded).toBe("$1,200,000");
    expect(result.formattedProjectedSavings).toBe("$1,625,796");
    expect(result.formattedGapOrSurplus).toBe("+$425,796");
    expect(result.firstYear.formattedBalance).toBe("$66,007");
    expect(result.firstYear.formattedContributions).toBe("$62,000");
    expect(result.summary).toBe("30 years to retirement using the 4% rule");
  });

  it("marks invalid retirement age when it is not greater than current age", () => {
    const result = calculateRetirementPlan({
      currentAge: 65,
      retirementAge: 60,
      currentSavings: 50000,
      monthlyContribution: 1000,
      annualReturnRate: 7,
      monthlyRetirementExpenses: 4000
    });

    expect(result.isValidTimeline).toBe(false);
    expect(result.warning).toBe("Retirement age must be greater than current age.");
  });
});
