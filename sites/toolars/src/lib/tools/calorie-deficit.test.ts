import { describe, expect, it } from "vitest";
import { calculateCalorieDeficit, defaultCalorieDeficitScenario } from "./calorie-deficit";

describe("calculateCalorieDeficit", () => {
  it("calculates the default VitalCalc calorie deficit scenario", () => {
    const result = calculateCalorieDeficit(defaultCalorieDeficitScenario);

    expect(result.formattedDailyIntake).toBe("1,650 kcal");
    expect(result.formattedDailyDeficit).toBe("550 kcal");
    expect(result.formattedEstimatedTime).toBe("10 weeks");
    expect(result.formattedFatToLose).toBe("5.0 kg");
    expect(result.summary).toBe("70 kg to 65 kg at 0.5 kg/week");
  });

  it("warns when the target intake drops below 1200 kcal", () => {
    const result = calculateCalorieDeficit({
      currentWeightKg: 70,
      targetWeightKg: 60,
      tdeeCalories: 1500,
      weeklyLossKg: 0.75
    });

    expect(result.dailyIntakeCalories).toBe(675);
    expect(result.safetyTone).toBe("warn");
  });
});
