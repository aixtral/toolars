import { describe, expect, it } from "vitest";
import { calculateFiberIntake, defaultFiberIntakeScenario } from "./fiber-intake";

describe("calculateFiberIntake", () => {
  it("calculates the VitalCalc weight-based default fiber target and gap", () => {
    const result = calculateFiberIntake(defaultFiberIntakeScenario);

    expect(result.recommendedFiberGrams).toBe(25);
    expect(result.recommendedRange).toBe("25-28 g/day");
    expect(result.progressPercent).toBe(60);
    expect(result.gapGrams).toBe(10);
    expect(result.summary).toContain("15g / 25g");
  });

  it("applies female and older-age source adjustments", () => {
    const result = calculateFiberIntake({
      weightKg: 60,
      age: 55,
      sex: "female",
      currentFiberGrams: 20
    });

    expect(result.recommendedFiberGrams).toBe(18);
    expect(result.recommendedRange).toBe("18-20 g/day");
    expect(result.progressPercent).toBe(100);
  });
});
