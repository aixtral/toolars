import { describe, expect, it } from "vitest";
import { calculateSideIncomeTax, defaultSideIncomeTaxScenario } from "./side-income-tax";

describe("calculateSideIncomeTax", () => {
  it("calculates the VitalCalc default side-income tax estimate", () => {
    const result = calculateSideIncomeTax(defaultSideIncomeTaxScenario);

    expect(result.formattedSelfEmploymentTax).toBe("$3,532");
    expect(result.formattedFederalAndStateTax).toBe("$17,264");
    expect(result.formattedEffectiveRate).toBe("19.8%");
    expect(result.formattedQuarterlyPayment).toBe("$5,199");
    expect(result.formattedTaxableIncome).toBe("$82,634");
  });

  it("does not create self-employment tax when expenses exceed side income", () => {
    const result = calculateSideIncomeTax({
      ...defaultSideIncomeTaxScenario,
      sideIncome: 4000,
      businessExpenses: 9000
    });

    expect(result.netSelfEmploymentIncome).toBe(0);
    expect(result.formattedSelfEmploymentTax).toBe("$0");
  });
});
