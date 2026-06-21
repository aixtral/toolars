import { describe, expect, it } from "vitest";
import { calculateInvestmentGoal, defaultInvestmentGoalScenario } from "./investment-goal";

describe("calculateInvestmentGoal", () => {
  it("calculates the VitalCalc default monthly investment needed", () => {
    const result = calculateInvestmentGoal(defaultInvestmentGoalScenario);

    expect(result.formattedMonthlyInvestment).toBe("$765");
    expect(result.formattedGoalAmount).toBe("$500,000");
    expect(result.formattedStartingBalance).toBe("$10,000");
    expect(result.formattedTotalInvested).toBe("$193,654");
    expect(result.formattedStartingBalanceGrowth).toBe("$49,268");
    expect(result.formattedGoalGap).toBe("$450,732");
    expect(result.summary).toBe("$765 per month to reach $500,000 in 20 years");
  });

  it("returns zero monthly investment when the starting balance can already reach the goal", () => {
    const result = calculateInvestmentGoal({
      goalAmount: 20000,
      startingBalance: 10000,
      annualReturn: 8,
      years: 20
    });

    expect(result.formattedMonthlyInvestment).toBe("$0");
    expect(result.goalStatus).toBe("covered");
  });
});
