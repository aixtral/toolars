import { describe, expect, it } from "vitest";
import { calculateWaterIntake, defaultWaterIntakeScenario } from "./water-intake";

describe("calculateWaterIntake", () => {
  it("calculates the default VitalCalc hydration scenario", () => {
    const result = calculateWaterIntake(defaultWaterIntakeScenario);

    expect(result.formattedTotal).toBe("4,165 ml");
    expect(result.formattedCups).toBe("17 cups");
    expect(result.formattedBaseNeed).toBe("2,450 ml");
    expect(result.formattedActivityExtra).toBe("+490 ml");
    expect(result.formattedClimateExtra).toBe("+1,225 ml");
    expect(result.summary).toBe("70 kg, Moderate activity, Hot climate");
  });

  it("supports cold climate reduction", () => {
    const result = calculateWaterIntake({
      weightKg: 60,
      activityMultiplier: 1,
      climateAdjustment: -0.3
    });

    expect(result.formattedTotal).toBe("1,470 ml");
    expect(result.formattedClimateExtra).toBe("-630 ml");
  });
});
