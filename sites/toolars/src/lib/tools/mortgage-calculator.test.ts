import { describe, expect, it } from "vitest";
import { calculateMortgagePayment, defaultMortgageScenario } from "./mortgage-calculator";

describe("calculateMortgagePayment", () => {
  it("calculates the default VitalCalc mortgage scenario locally", () => {
    const result = calculateMortgagePayment(defaultMortgageScenario);

    expect(result.loanAmount).toBe(360000);
    expect(result.monthlyPrincipalAndInterest).toBeCloseTo(2275.44, 2);
    expect(result.monthlyPropertyTax).toBe(450);
    expect(result.monthlyInsurance).toBe(150);
    expect(result.monthlyPayment).toBeCloseTo(2875.44, 2);
    expect(result.totalInterest).toBeCloseTo(459160.16, 2);
    expect(result.downPaymentPercent).toBe(20);
    expect(result.loanToValuePercent).toBe(80);
    expect(result.formattedMonthlyPayment).toBe("$2,875");
    expect(result.formattedTotalInterest).toBe("$459,160");
    expect(result.summary).toBe("Principal and interest $2,275 + escrow $600");
  });

  it("handles zero-interest loans without amortization drift", () => {
    const result = calculateMortgagePayment({
      homePrice: 120000,
      downPayment: 20000,
      annualInterestRate: 0,
      loanTermYears: 10,
      propertyTaxAnnual: 0,
      insuranceMonthly: 0
    });

    expect(result.loanAmount).toBe(100000);
    expect(result.monthlyPrincipalAndInterest).toBeCloseTo(833.33, 2);
    expect(result.totalInterest).toBe(0);
    expect(result.formattedMonthlyPayment).toBe("$833");
  });

  it("sanitizes invalid or overpaid scenarios to zero", () => {
    const result = calculateMortgagePayment({
      homePrice: Number.NaN,
      downPayment: Number.POSITIVE_INFINITY,
      annualInterestRate: -3,
      loanTermYears: 0,
      propertyTaxAnnual: -10,
      insuranceMonthly: -25
    });

    expect(result.loanAmount).toBe(0);
    expect(result.monthlyPayment).toBe(0);
    expect(result.totalInterest).toBe(0);
    expect(result.downPaymentPercent).toBe(0);
    expect(result.loanToValuePercent).toBe(0);
  });
});
