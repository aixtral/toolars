import { describe, expect, it } from "vitest";
import { calculateLoanPayment, defaultLoanScenario } from "./loan-calculator";

describe("calculateLoanPayment", () => {
  it("calculates the default VitalCalc loan payment and first-year amortization", () => {
    const result = calculateLoanPayment(defaultLoanScenario);

    expect(result.formattedMonthlyPayment).toBe("$501");
    expect(result.formattedTotalInterest).toBe("$5,057");
    expect(result.formattedTotalRepayment).toBe("$30,057");
    expect(result.firstYear.formattedPrincipalPaid).toBe("$4,282");
    expect(result.firstYear.formattedInterestPaid).toBe("$1,730");
    expect(result.firstYear.formattedEndingBalance).toBe("$20,718");
    expect(result.summary).toBe("60 payments of $501 over 5 years");
  });

  it("handles zero-interest loans without amortization drift", () => {
    const result = calculateLoanPayment({
      principal: 12000,
      annualInterestRate: 0,
      termYears: 2
    });

    expect(result.formattedMonthlyPayment).toBe("$500");
    expect(result.formattedTotalInterest).toBe("$0");
    expect(result.formattedTotalRepayment).toBe("$12,000");
  });
});
