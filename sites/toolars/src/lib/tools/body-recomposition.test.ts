import { describe, expect, it } from "vitest";
import { calculateBodyRecomposition, defaultBodyRecompositionScenario } from "./body-recomposition";

describe("calculateBodyRecomposition", () => {
  it("calculates the default VitalCalc body recomposition scenario", () => {
    const result = calculateBodyRecomposition(defaultBodyRecompositionScenario);

    expect(result.formattedTargetCalories).toBe("2,383 kcal");
    expect(result.formattedTdee).toBe("2,633 kcal");
    expect(result.formattedProtein).toBe("150 g");
    expect(result.formattedCarbs).toBe("293 g");
    expect(result.formattedFat).toBe("68 g");
    expect(result.macroPercentSummary).toBe("25% protein / 49% carbs / 26% fat");
  });

  it("supports the maintenance goal without a deficit", () => {
    const result = calculateBodyRecomposition({
      ...defaultBodyRecompositionScenario,
      goal: "maintain"
    });

    expect(result.deficitCalories).toBe(0);
    expect(result.formattedTargetCalories).toBe("2,633 kcal");
  });
});
