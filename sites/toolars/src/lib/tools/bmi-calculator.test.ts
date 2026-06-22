import { describe, expect, it } from "vitest";
import { calculateBmi, defaultBmiProfile, type BmiCategory } from "./bmi-calculator";

describe("calculateBmi", () => {
  it("calculates the default VitalCalc BMI profile locally", () => {
    const result = calculateBmi(defaultBmiProfile);

    expect(result.bmi).toBeCloseTo(22.9, 1);
    expect(result.formattedBmi).toBe("22.9");
    expect(result.category).toBe<BmiCategory>("normal");
    expect(result.healthyWeightRange).toBe("56.7-76.3 kg");
    expect(result.inputSummary).toBe("175 cm / 70 kg");
  });

  it("classifies underweight, overweight, and obesity reference ranges", () => {
    expect(calculateBmi({ heightCm: 180, weightKg: 50 }).category).toBe<BmiCategory>("underweight");
    expect(calculateBmi({ heightCm: 170, weightKg: 82 }).category).toBe<BmiCategory>("overweight");
    expect(calculateBmi({ heightCm: 165, weightKg: 95 }).category).toBe<BmiCategory>("obesity");
  });

  it("sanitizes invalid body metrics to an unavailable reference", () => {
    const result = calculateBmi({
      heightCm: Number.NaN,
      weightKg: Number.POSITIVE_INFINITY
    });

    expect(result.bmi).toBe(0);
    expect(result.formattedBmi).toBe("0.0");
    expect(result.category).toBe<BmiCategory>("unavailable");
    expect(result.healthyWeightRange).toBe("0.0-0.0 kg");
  });
});
