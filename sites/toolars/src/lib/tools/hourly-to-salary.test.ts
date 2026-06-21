import { describe, expect, it } from "vitest";
import { calculateHourlyToSalary, defaultHourlyToSalaryScenario } from "./hourly-to-salary";

describe("calculateHourlyToSalary", () => {
  it("calculates the default VitalCalc gross salary conversion", () => {
    const result = calculateHourlyToSalary(defaultHourlyToSalaryScenario);

    expect(result.formattedAnnualSalary).toBe("$52,000");
    expect(result.formattedMonthlySalary).toBe("$4,333");
    expect(result.formattedWeeklySalary).toBe("$1,000");
    expect(result.formattedOvertimePay).toBe("$0");
    expect(result.summary).toBe("$25.00 x 40 hours/week x 52 weeks");
  });

  it("includes overtime pay with the selected multiplier", () => {
    const result = calculateHourlyToSalary({
      hourlyRate: 25,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      overtimeHoursPerWeek: 5,
      overtimeMultiplier: 1.5
    });

    expect(result.formattedOvertimePay).toBe("$9,750");
    expect(result.formattedAnnualSalary).toBe("$61,750");
    expect(result.formattedWeeklySalary).toBe("$1,188");
  });
});
