import { describe, expect, it } from "vitest";
import { calculateMacros, defaultMacroScenario } from "./macro-calculator";

describe("calculateMacros", () => {
  it("calculates the default VitalCalc balanced macro scenario", () => {
    const result = calculateMacros(defaultMacroScenario);

    expect(result.formattedProtein).toBe("165 g");
    expect(result.formattedCarbs).toBe("220 g");
    expect(result.formattedFat).toBe("73 g");
    expect(result.proteinPercent).toBe(30);
    expect(result.summary).toBe("2,200 kcal, Balanced split");
  });

  it("enforces the high-protein minimum when weight requires it", () => {
    const result = calculateMacros({
      calories: 1200,
      weightKg: 100,
      goal: "high-protein"
    });

    expect(result.formattedProtein).toBe("160 g");
    expect(result.goalLabel).toBe("High Protein");
  });
});
