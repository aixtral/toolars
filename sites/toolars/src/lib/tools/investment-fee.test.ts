import { describe, expect, it } from "vitest";
import { calculateInvestmentFee, defaultInvestmentFeeScenario } from "./investment-fee";

describe("calculateInvestmentFee", () => {
  it("calculates the VitalCalc default long-term fee drag", () => {
    const result = calculateInvestmentFee(defaultInvestmentFeeScenario);

    expect(result.formattedFeeDrag).toBe("$128,667");
    expect(result.formattedNoFeeValue).toBe("$691,150");
    expect(result.formattedWithFeeValue).toBe("$562,483");
    expect(result.formattedTotalInvested).toBe("$190,000");
    expect(result.formattedFeeAsInvested).toBe("67.7%");
    expect(result.formattedFeeAsEndValue).toBe("18.6%");
    expect(result.formattedRealAnnualReturn).toBe("6.00%");
  });

  it("shows no drag when the annual management fee is zero", () => {
    const result = calculateInvestmentFee({
      initialInvestment: 10000,
      monthlyContribution: 500,
      annualReturn: 7,
      years: 30,
      annualFee: 0
    });

    expect(result.formattedFeeDrag).toBe("$0");
    expect(result.formattedFeeAsEndValue).toBe("0.0%");
    expect(result.feeTone).toBe("low");
  });
});
