import { describe, expect, it } from "vitest";
import { calculateFreelanceRate, defaultFreelanceRateScenario } from "./freelance-rate";

describe("calculateFreelanceRate", () => {
  it("calculates the VitalCalc default billable-hour rate floor", () => {
    const result = calculateFreelanceRate(defaultFreelanceRateScenario);

    expect(result.formattedHourlyRate).toBe("¥241");
    expect(result.formattedDailyRate).toBe("¥1,928");
    expect(result.formattedProjectRate).toBe("¥9,640");
    expect(result.formattedPremiumRate).toBe("¥314");
    expect(result.formattedTotalRevenue).toBe("¥331,200");
    expect(result.formattedBillableHours).toBe("1,376 hours");
  });

  it("keeps the billable hours guard above zero for heavy non-billable inputs", () => {
    const result = calculateFreelanceRate({
      ...defaultFreelanceRateScenario,
      goalIncome: 120000,
      nonBillableRatio: 0.95,
      weeklyWorkHours: 10
    });

    expect(result.billableHours).toBeGreaterThan(0);
    expect(result.hourlyRate).toBeGreaterThan(0);
    expect(result.rateTone).toBe("high");
  });
});
