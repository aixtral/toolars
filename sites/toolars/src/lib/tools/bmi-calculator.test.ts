import { describe, expect, it } from "vitest";
import { calculateBmi, defaultBmiProfile } from "./bmi-calculator";

describe("calculateBmi", () => {
  it("calculates the default VitalCalc BMI profile locally", () => {
    const result = calculateBmi(defaultBmiProfile);

    expect(result.bmi).toBeCloseTo(22.9, 1);
    expect(result.formattedBmi).toBe("22.9");
    expect(result.category).toBe("Normal");
    expect(result.recommendation).toBe("Healthy range");
    expect(result.healthyWeightRange).toBe("56.7-76.3 kg");
    expect(result.summary).toBe("BMI 22.9 - Normal range");
    expect(result.inputSummary).toBe("175 cm / 70 kg");
  });

  it("classifies underweight, overweight, and obesity reference ranges", () => {
    expect(calculateBmi({ heightCm: 180, weightKg: 50 }).category).toBe("Underweight");
    expect(calculateBmi({ heightCm: 170, weightKg: 82 }).category).toBe("Overweight");
    expect(calculateBmi({ heightCm: 165, weightKg: 95 }).category).toBe("Obesity");
  });

  it("sanitizes invalid body metrics to an unavailable reference", () => {
    const result = calculateBmi({
      heightCm: Number.NaN,
      weightKg: Number.POSITIVE_INFINITY
    });

    expect(result.bmi).toBe(0);
    expect(result.formattedBmi).toBe("0.0");
    expect(result.category).toBe("Unavailable");
    expect(result.healthyWeightRange).toBe("0.0-0.0 kg");
    expect(result.recommendation).toBe("Enter height and weight");
  });
});
