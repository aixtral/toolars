import { describe, expect, it } from "vitest";
import { calculateBmr, defaultBmrScenario } from "./bmr-calculator";

describe("calculateBmr", () => {
  it("calculates the default VitalCalc Mifflin-St Jeor BMR scenario", () => {
    const result = calculateBmr(defaultBmrScenario);

    expect(result.formattedBmr).toBe("1,649 kcal");
    expect(result.formattedLossTarget).toBe("1,149 kcal");
    expect(result.formattedMaintainTarget).toBe("1,649 kcal");
    expect(result.formattedGainTarget).toBe("1,899 kcal");
    expect(result.summary).toBe("Male, 30 years, 175 cm, 70 kg");
  });

  it("uses the female Mifflin-St Jeor adjustment", () => {
    const result = calculateBmr({
      sex: "female",
      age: 30,
      heightCm: 165,
      weightKg: 60
    });

    expect(result.formattedBmr).toBe("1,320 kcal");
    expect(result.formulaLabel).toBe("Mifflin-St Jeor");
  });
});
