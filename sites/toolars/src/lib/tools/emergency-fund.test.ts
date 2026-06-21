import { describe, expect, it } from "vitest";
import { calculateEmergencyFund, defaultEmergencyFundScenario } from "./emergency-fund";

describe("calculateEmergencyFund", () => {
  it("calculates the default VitalCalc emergency fund target", () => {
    const result = calculateEmergencyFund(defaultEmergencyFundScenario);

    expect(result.formattedTarget).toBe("$18,000");
    expect(result.formattedGap).toBe("$13,000");
    expect(result.formattedMonthlySavingsNeeded).toBe("$1,083");
    expect(result.progressPercent).toBe(27.8);
    expect(result.progressLabel).toBe("$5,000 / $18,000");
    expect(result.summary).toBe("6 months of expenses at $3,000/month");
  });

  it("caps progress and monthly savings when the fund is already complete", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 2000,
      coverageMonths: 3,
      currentSavings: 9000,
      targetTimelineMonths: 12
    });

    expect(result.formattedTarget).toBe("$6,000");
    expect(result.formattedGap).toBe("$0");
    expect(result.formattedMonthlySavingsNeeded).toBe("$0");
    expect(result.progressPercent).toBe(100);
  });
});
