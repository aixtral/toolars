import { describe, expect, it } from "vitest";
import { calculateIncomeTax, defaultIncomeTaxScenario } from "./income-tax";

describe("calculateIncomeTax", () => {
  it("calculates the VitalCalc default flat-rate take-home estimate", () => {
    const result = calculateIncomeTax(defaultIncomeTaxScenario);

    expect(result.formattedMonthlyNetIncome).toBe("$3,800");
    expect(result.formattedMonthlyGrossIncome).toBe("$5,000");
    expect(result.formattedMonthlyTax).toBe("$900");
    expect(result.formattedMonthlyDeductions).toBe("$800");
    expect(result.formattedAnnualNetIncome).toBe("$45,600");
    expect(result.formattedEffectiveRate).toBe("18.0%");
    expect(result.summary).toBe("$3,800 monthly take-home from $5,000 gross");
  });

  it("does not tax income below deductions", () => {
    const result = calculateIncomeTax({
      monthlySalary: 1000,
      taxRate: 25,
      monthlyDeduction: 1500,
      extraWithheld: 50
    });

    expect(result.formattedMonthlyTax).toBe("$0");
    expect(result.formattedMonthlyNetIncome).toBe("$950");
    expect(result.formattedEffectiveRate).toBe("0.0%");
  });
});
