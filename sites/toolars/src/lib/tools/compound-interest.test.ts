import { describe, expect, it } from "vitest";
import { calculateCompoundInterest, defaultCompoundInterestScenario } from "./compound-interest";

describe("calculateCompoundInterest", () => {
  it("calculates the default monthly-compounding investment scenario", () => {
    const result = calculateCompoundInterest(defaultCompoundInterestScenario);

    expect(result.formattedFutureValue).toBe("$300,851");
    expect(result.formattedTotalContributions).toBe("$120,000");
    expect(result.formattedInterestEarned).toBe("$170,851");
    expect(result.firstYear.formattedBalance).toBe("$16,919");
    expect(result.firstYear.formattedInterestEarned).toBe("$919");
    expect(result.summary).toBe("$10,000 initial + $500/month for 20 years");
  });

  it("handles zero-return savings plans", () => {
    const result = calculateCompoundInterest({
      initialInvestment: 1000,
      monthlyContribution: 100,
      annualReturnRate: 0,
      years: 2
    });

    expect(result.formattedFutureValue).toBe("$3,400");
    expect(result.formattedInterestEarned).toBe("$0");
  });
});
