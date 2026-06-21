import { describe, expect, it } from "vitest";
import { calculateTdee, defaultTdeeScenario } from "./tdee-calculator";

describe("calculateTdee", () => {
  it("calculates the default VitalCalc TDEE activity scenario", () => {
    const result = calculateTdee(defaultTdeeScenario);

    expect(result.formattedTdee).toBe("2,325");
    expect(result.formattedActivityBurn).toBe("825 kcal");
    expect(result.formattedFatLossTarget).toBe("1,825");
    expect(result.formattedMuscleGainTarget).toBe("2,575");
    expect(result.summary).toBe("BMR 1,500 × activity 1.55");
  });

  it("does not return negative fat-loss targets for very low BMR", () => {
    const result = calculateTdee({
      bmr: 300,
      activityMultiplier: 1.2
    });

    expect(result.formattedTdee).toBe("360");
    expect(result.formattedFatLossTarget).toBe("0");
  });
});
