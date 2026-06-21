import { describe, expect, it } from "vitest";
import { calculateAlcoholMetabolism, defaultAlcoholMetabolismScenario } from "./alcohol-metabolism";

describe("calculateAlcoholMetabolism", () => {
  it("calculates the VitalCalc Widmark-style BAC estimate and timeline", () => {
    const result = calculateAlcoholMetabolism(defaultAlcoholMetabolismScenario);

    expect(result.pureAlcohol).toBeCloseTo(49.5, 5);
    expect(result.bac).toBeCloseTo(103.9615966, 5);
    expect(result.formattedBac).toBe("103.962%");
    expect(result.status).toBe("Severely impaired - do not drive");
    expect(result.timeTo002Hours).toBe(6930);
    expect(result.timeToZeroHours).toBe(6931);
  });

  it("floors fully metabolized scenarios at zero BAC", () => {
    const result = calculateAlcoholMetabolism({
      sex: "female",
      weightKg: 60,
      drinkType: "wine",
      quantity: 1,
      durationHours: 5000,
      stomach: "ate"
    });

    expect(result.bac).toBe(0);
    expect(result.status).toBe("Fully metabolized");
    expect(result.timeToZeroHours).toBe(0);
  });
});
