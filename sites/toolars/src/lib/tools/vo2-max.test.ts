import { describe, expect, it } from "vitest";
import { calculateVo2Max, defaultVo2MaxScenario } from "./vo2-max";

describe("calculateVo2Max", () => {
  it("calculates Cooper 12-minute VO2 Max and source fitness level", () => {
    const result = calculateVo2Max(defaultVo2MaxScenario);

    expect(result.methodLabel).toBe("Cooper 12-minute run");
    expect(result.formattedVo2Max).toBe("42.4");
    expect(result.fitnessLevel).toBe("Good");
    expect(result.referenceRows).toContainEqual({ label: "Good", range: "42-49 ml/kg/min" });
  });

  it("supports the resting heart rate source method", () => {
    const result = calculateVo2Max({
      method: "restingHeartRate",
      distanceMeters: 2400,
      sex: "male",
      age: 30,
      restingHeartRate: 60
    });

    expect(result.formattedVo2Max).toBe("47.7");
    expect(result.methodLabel).toBe("Resting heart rate");
    expect(result.summary).toContain("30 years");
  });
});
