import { describe, expect, it } from "vitest";
import { calculateSipReturns, defaultSipScenario } from "./sip-calculator";

describe("calculateSipReturns", () => {
  it("calculates the VitalCalc default SIP projection", () => {
    const result = calculateSipReturns(defaultSipScenario);

    expect(result.formattedTotalValue).toBe("$36,738");
    expect(result.formattedTotalInvested).toBe("$30,000");
    expect(result.formattedInvestmentReturns).toBe("$6,738");
    expect(result.formattedReturnRate).toBe("22.5%");
    expect(result.schedule).toHaveLength(5);
  });

  it("handles zero annual return as straight monthly contributions", () => {
    const result = calculateSipReturns({
      ...defaultSipScenario,
      annualReturn: 0
    });

    expect(result.totalValue).toBe(30000);
    expect(result.investmentReturns).toBe(0);
  });
});
