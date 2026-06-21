import { describe, expect, it } from "vitest";
import { calculateStudentLoan, defaultStudentLoanScenario } from "./student-loan-calculator";

describe("calculateStudentLoan", () => {
  it("calculates the VitalCalc default student loan repayment plan", () => {
    const result = calculateStudentLoan(defaultStudentLoanScenario);

    expect(result.formattedMonthlyPayment).toBe("$543");
    expect(result.formattedTotalInterest).toBe("$15,116");
    expect(result.formattedTotalRepayment).toBe("$65,116");
    expect(result.graceLabel).toBe("Repayment starts after 6 months grace period");
    expect(result.firstYear.formattedEndingBalance).toBe("$46,142");
  });

  it("handles zero-interest repayment terms", () => {
    const result = calculateStudentLoan({
      ...defaultStudentLoanScenario,
      annualInterestRate: 0
    });

    expect(result.monthlyPayment).toBeCloseTo(416.67, 2);
    expect(result.totalInterest).toBe(0);
  });
});
