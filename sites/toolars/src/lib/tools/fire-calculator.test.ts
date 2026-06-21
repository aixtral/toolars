import { describe, expect, it } from "vitest";
import { calculateFire, defaultFireScenario } from "./fire-calculator";

describe("calculateFire", () => {
  it("calculates the VitalCalc default FIRE target and yearly projection", () => {
    const result = calculateFire(defaultFireScenario);

    expect(result.formattedFireNumber).toBe("$1,250,000");
    expect(result.formattedSavingsRate).toBe("50.0%");
    expect(result.formattedAnnualSavings).toBe("$50,000");
    expect(result.formattedYearsToFire).toBe("12 years");
    expect(result.formattedProjectedBalance).toBe("$1,344,861");
  });

  it("labels non-positive savings as blocked", () => {
    const result = calculateFire({
      ...defaultFireScenario,
      annualIncome: 45000,
      annualExpenses: 50000
    });

    expect(result.annualSavings).toBeLessThan(0);
    expect(result.yearsToFire).toBeGreaterThan(0);
    expect(result.guidanceTone).toBe("blocked");
  });
});
