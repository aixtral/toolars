import { describe, expect, it } from "vitest";
import { calculateCreatineDose, defaultCreatineScenario } from "./creatine-calculator";

describe("calculateCreatineDose", () => {
  it("uses the VitalCalc 0.03g/kg model with the 3-5g cap", () => {
    const result = calculateCreatineDose(defaultCreatineScenario);

    expect(result.weightKg).toBe(70);
    expect(result.maintenanceGrams).toBe(3);
    expect(result.formattedMaintenance).toBe("3 g");
    expect(result.formattedExtraWater).toBe("700 ml");
    expect(result.loadingEnabled).toBe(false);
  });

  it("raises intense or vegetarian plans to 5g and supports loading", () => {
    const result = calculateCreatineDose({
      weight: 154,
      unit: "lb",
      trainingIntensity: "intense",
      vegetarian: true,
      loading: true
    });

    expect(result.weightKg).toBeCloseTo(69.85, 2);
    expect(result.formattedMaintenance).toBe("5 g");
    expect(result.formattedLoadingDose).toBe("20 g/day");
    expect(result.loadingProtocol).toBe("4 doses for 5-7 days");
  });
});
