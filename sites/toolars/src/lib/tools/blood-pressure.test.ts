import { describe, expect, it } from "vitest";
import { calculateBloodPressure, defaultBloodPressureReading, type BloodPressureCategory } from "./blood-pressure";

describe("calculateBloodPressure", () => {
  it("classifies the VitalCalc default 120 over 80 reading", () => {
    const result = calculateBloodPressure(defaultBloodPressureReading);

    expect(result.formattedReading).toBe("120/80");
    expect(result.category).toBe<BloodPressureCategory>("stage1");
  });

  it("classifies hypertensive crisis readings as urgent", () => {
    const result = calculateBloodPressure({
      systolic: 182,
      diastolic: 122
    });

    expect(result.category).toBe<BloodPressureCategory>("crisis");
  });
});
