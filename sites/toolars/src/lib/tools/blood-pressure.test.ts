import { describe, expect, it } from "vitest";
import { calculateBloodPressure, defaultBloodPressureReading } from "./blood-pressure";

describe("calculateBloodPressure", () => {
  it("classifies the VitalCalc default 120 over 80 reading", () => {
    const result = calculateBloodPressure(defaultBloodPressureReading);

    expect(result.formattedReading).toBe("120/80");
    expect(result.category).toBe("Stage 1");
    expect(result.reason).toBe("Systolic 130-139 or diastolic 80-89.");
    expect(result.advice).toContain("reduce salt");
  });

  it("classifies hypertensive crisis readings as urgent", () => {
    const result = calculateBloodPressure({
      systolic: 182,
      diastolic: 122
    });

    expect(result.category).toBe("Crisis");
    expect(result.reason).toContain("Medical emergency");
  });
});
