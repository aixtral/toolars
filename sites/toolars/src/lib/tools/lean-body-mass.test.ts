import { describe, expect, it } from "vitest";
import { calculateLeanBodyMass, defaultLeanBodyMassScenario } from "./lean-body-mass";

describe("calculateLeanBodyMass", () => {
  it("calculates the default VitalCalc lean body mass scenario", () => {
    const result = calculateLeanBodyMass(defaultLeanBodyMassScenario);

    expect(result.formattedLeanBodyMass).toBe("56.0 kg");
    expect(result.formattedFatMass).toBe("14.0 kg");
    expect(result.formattedLeanMassRatio).toBe("80.0%");
    expect(result.summary).toBe("70 kg at 20.0% body fat");
  });

  it("clamps body fat percentage into a usable range", () => {
    const result = calculateLeanBodyMass({
      weightKg: 80,
      bodyFatPercent: 120
    });

    expect(result.formattedLeanBodyMass).toBe("0.0 kg");
    expect(result.formattedLeanMassRatio).toBe("0.0%");
  });
});
