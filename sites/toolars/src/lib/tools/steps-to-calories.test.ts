import { describe, expect, it } from "vitest";
import { calculateStepsToCalories, defaultStepsToCaloriesScenario } from "./steps-to-calories";

describe("calculateStepsToCalories", () => {
  it("calculates unit-normalized MET calories, distance, and food equivalents", () => {
    const result = calculateStepsToCalories(defaultStepsToCaloriesScenario);

    expect(result.formattedCalories).toBe("276 kcal");
    expect(result.formattedDistance).toBe("5.63 km");
    expect(result.formattedRiceEquivalent).toBe("1.2 bowls rice");
    expect(result.formattedStepsPerRice).toBe("6,669 steps");
    expect(result.formattedTenThousandStepBurn).toBe("345 kcal");
  });

  it("uses the source MET table for faster speeds", () => {
    const result = calculateStepsToCalories({
      ...defaultStepsToCaloriesScenario,
      speed: "fast"
    });

    expect(result.met).toBe(5);
    expect(result.formattedCalories).toBe("303 kcal");
  });
});
