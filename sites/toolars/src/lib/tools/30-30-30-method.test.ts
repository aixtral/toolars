import { describe, expect, it } from "vitest";
import { calculateThirtyThirtyThirty, defaultThirtyThirtyThirtyScenario } from "./30-30-30-method";

describe("calculateThirtyThirtyThirty", () => {
  it("calculates the VitalCalc 30-minute burn estimate for the default walk plan", () => {
    const result = calculateThirtyThirtyThirty(defaultThirtyThirtyThirtyScenario);

    expect(result.formattedProteinTarget).toBe("30 g");
    expect(result.formattedCalories).toBe("123 kcal");
    expect(result.activityLabel).toBe("Brisk walk");
    expect(result.summary).toBe("30g protein plus 30 minutes of brisk walk");
    expect(result.proteinOptions).toContain("150g chicken breast (about 31g protein)");
  });

  it("uses the source MET table for alternate low-intensity activities", () => {
    const result = calculateThirtyThirtyThirty({ ...defaultThirtyThirtyThirtyScenario, weightKg: 80, activity: "cycle" });

    expect(result.formattedCalories).toBe("160 kcal");
    expect(result.met).toBe(4);
    expect(result.activityTip).toContain("Easy cadence");
  });
});
