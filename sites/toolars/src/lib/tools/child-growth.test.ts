import { describe, expect, it } from "vitest";
import { calculateChildGrowth, defaultChildGrowthProfile } from "./child-growth";

describe("calculateChildGrowth", () => {
  it("calculates the VitalCalc default child BMI percentile approximation", () => {
    const result = calculateChildGrowth(defaultChildGrowthProfile);

    expect(result.formattedBmi).toBe("16.6");
    expect(result.formattedPercentile).toBe("12.8th");
    expect(result.category).toBe("Healthy");
    expect(result.rankLabel).toBe("Top 12.8%");
    expect(result.idealWeightRange).toBe("28.9-37.5 kg");
  });

  it("marks a high percentile as obese", () => {
    const result = calculateChildGrowth({
      ...defaultChildGrowthProfile,
      weightKg: 45
    });

    expect(result.category).toBe("Obese");
    expect(result.percentile).toBeGreaterThanOrEqual(95);
  });
});
