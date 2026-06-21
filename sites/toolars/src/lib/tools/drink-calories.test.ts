import { describe, expect, it } from "vitest";
import { calculateDrinkCalories, defaultDrinkCaloriesScenario } from "./drink-calories";

describe("calculateDrinkCalories", () => {
  it("calculates the VitalCalc full-sugar boba tea default", () => {
    const result = calculateDrinkCalories(defaultDrinkCaloriesScenario);

    expect(result.totalCalories).toBe(325);
    expect(result.formattedTotalCalories).toBe("325 kcal");
    expect(result.formattedSugar).toBe("50 g");
    expect(result.formattedSteps).toBe("6,500");
    expect(result.formattedDailyPercent).toBe("16.3%");
    expect(result.tip).toContain("Sugar exceeds");
  });

  it("supports zero-calorie drink references", () => {
    const result = calculateDrinkCalories({
      drinkId: "soda",
      servingSizeMl: 500,
      cups: 2,
      customCaloriesPer100Ml: 0
    });

    expect(result.totalCalories).toBe(0);
    expect(result.formattedSteps).toBe("--");
    expect(result.tip).toContain("healthy range");
  });
});
