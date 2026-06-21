import { describe, expect, it } from "vitest";
import { calculateGlycemicLoad, defaultGlycemicLoadScenario } from "./glycemic-load";

describe("calculateGlycemicLoad", () => {
  it("calculates the VitalCalc glycemic load model for the default white rice serving", () => {
    const result = calculateGlycemicLoad(defaultGlycemicLoadScenario);

    expect(result.glycemicLoad).toBeCloseTo(30.66, 5);
    expect(result.formattedGlycemicLoad).toBe("30.7");
    expect(result.formattedTotalCarbs).toBe("42.0 g");
    expect(result.category).toBe("High GL (Limit)");
    expect(result.impact).toBe("High blood sugar impact");
  });

  it("classifies low and medium glycemic load ranges", () => {
    expect(calculateGlycemicLoad({ foodId: "apple", servingGrams: 180, glycemicIndex: 36, carbsPer100g: 14 }).category).toBe("Low GL (Recommended)");
    expect(calculateGlycemicLoad({ foodId: "custom", servingGrams: 100, glycemicIndex: 55, carbsPer100g: 25 }).category).toBe("Medium GL (Moderate)");
  });
});
