import { describe, expect, it } from "vitest";
import { calculateGlp1Nutrition, defaultGlp1NutritionScenario } from "./glp1-nutrition";

describe("calculateGlp1Nutrition", () => {
  it("calculates the VitalCalc calorie floor, protein, water, and fiber targets", () => {
    const result = calculateGlp1Nutrition(defaultGlp1NutritionScenario);

    expect(result.formattedCalorieFloor).toBe("1,642 kcal");
    expect(result.formattedProtein).toBe("98 g");
    expect(result.formattedWater).toBe("2,450 ml");
    expect(result.formattedFiber).toBe("25 g");
    expect(result.formattedBmr).toBe("1,593 kcal");
  });

  it("adds the source hydration adjustment for activity above lightly active", () => {
    const result = calculateGlp1Nutrition({ ...defaultGlp1NutritionScenario, activityFactor: 1.55 });

    expect(result.formattedWater).toBe("2,950 ml");
    expect(result.activityLabel).toBe("Moderately active");
  });
});
