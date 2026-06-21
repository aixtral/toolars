import { describe, expect, it } from "vitest";
import { calculateBodyFat, defaultBodyFatScenario } from "./body-fat-calculator";

describe("calculateBodyFat", () => {
  it("calculates the default VitalCalc US Navy male scenario", () => {
    const result = calculateBodyFat(defaultBodyFatScenario);

    expect(result.formattedBodyFat).toBe("16.9%");
    expect(result.category).toBe("Fitness");
    expect(result.formattedFatMass).toBe("11.9 kg");
    expect(result.formattedLeanMass).toBe("58.1 kg");
    expect(result.summary).toBe("Male, 175 cm, waist 85 cm, neck 38 cm");
  });

  it("uses hip measurement for the female US Navy scenario", () => {
    const result = calculateBodyFat({
      sex: "female",
      heightCm: 165,
      neckCm: 32,
      waistCm: 78,
      hipCm: 95,
      weightKg: 60
    });

    expect(result.formattedBodyFat).toBe("28.9%");
    expect(result.category).toBe("Average");
  });
});
