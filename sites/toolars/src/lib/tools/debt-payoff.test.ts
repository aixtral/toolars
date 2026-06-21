import { describe, expect, it } from "vitest";
import { calculateDebtPayoff, defaultDebtPayoffScenario } from "./debt-payoff";

describe("calculateDebtPayoff", () => {
  it("calculates the default VitalCalc debt payoff schedule", () => {
    const result = calculateDebtPayoff(defaultDebtPayoffScenario);

    expect(result.monthsToPayoff).toBe(47);
    expect(result.formattedTotalInterest).toBe("$3,967");
    expect(result.formattedTotalPaid).toBe("$13,967");
    expect(result.firstMonth.formattedInterest).toBe("$150");
    expect(result.firstMonth.formattedPrincipal).toBe("$150");
    expect(result.firstMonth.formattedEndingBalance).toBe("$9,850");
    expect(result.summary).toBe("47 months with avalanche strategy");
  });

  it("flags an impossible payment when monthly payment does not clear interest", () => {
    const result = calculateDebtPayoff({
      debtBalance: 10000,
      annualInterestRate: 18,
      monthlyPayment: 100,
      strategy: "snowball"
    });

    expect(result.isPaymentTooLow).toBe(true);
    expect(result.monthsToPayoff).toBe(0);
    expect(result.warning).toBe("Monthly payment must be greater than monthly interest.");
  });
});
