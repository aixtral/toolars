import { describe, expect, it } from "vitest";
import { calculateCarLoan, defaultCarLoanScenario } from "./car-loan";

describe("calculateCarLoan", () => {
  it("calculates the VitalCalc default car loan estimate", () => {
    const result = calculateCarLoan(defaultCarLoanScenario);

    expect(result.formattedMonthlyPayment).toBe("$377");
    expect(result.formattedLoanAmount).toBe("$20,000");
    expect(result.formattedTotalInterest).toBe("$2,645");
    expect(result.formattedTotalPayment).toBe("$22,645");
    expect(result.formattedTrueCost).toBe("$27,645");
  });

  it("supports a zero-interest loan without producing NaN", () => {
    const result = calculateCarLoan({
      ...defaultCarLoanScenario,
      annualInterestRate: 0
    });

    expect(result.monthlyPayment).toBeCloseTo(333.333, 2);
    expect(result.formattedTotalInterest).toBe("$0");
  });
});
