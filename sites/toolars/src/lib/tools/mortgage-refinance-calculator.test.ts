import { describe, expect, it } from "vitest";
import { calculateMortgageRefinance, defaultMortgageRefinanceScenario } from "./mortgage-refinance-calculator";

describe("calculateMortgageRefinance", () => {
  it("calculates the VitalCalc default refinance savings and break-even point", () => {
    const result = calculateMortgageRefinance(defaultMortgageRefinanceScenario);

    expect(result.formattedMonthlySavings).toBe("$461");
    expect(result.formattedOldMonthly).toBe("$4,053");
    expect(result.formattedNewMonthly).toBe("$3,592");
    expect(result.formattedTotalInterestSaved).toBe("$146,005");
    expect(result.breakEvenMonths).toBe(44);
    expect(result.breakEvenLabel).toBe("44 months");
    expect(result.statusTone).toBe("worthwhile");
  });

  it("marks refinancing as not worthwhile when the new payment is higher", () => {
    const result = calculateMortgageRefinance({
      ...defaultMortgageRefinanceScenario,
      newAnnualInterestRate: 6
    });

    expect(result.monthlySavings).toBeLessThan(0);
    expect(result.breakEvenLabel).toBe("No break-even");
    expect(result.statusTone).toBe("not-worthwhile");
  });
});
