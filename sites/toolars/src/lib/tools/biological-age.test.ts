import { describe, expect, it } from "vitest";
import { calculateBiologicalAge, defaultBiologicalAgeScenario } from "./biological-age";

describe("calculateBiologicalAge", () => {
  it("calculates the default lifestyle delta and younger status", () => {
    const result = calculateBiologicalAge(defaultBiologicalAgeScenario);

    expect(result.biologicalAge).toBe(31);
    expect(result.ageDifference).toBe(-4);
    expect(result.differenceLabel).toBe("4 years younger");
    expect(result.tips).toEqual(["Keep up your healthy lifestyle!"]);
  });

  it("returns older status and targeted improvement tips for higher-risk inputs", () => {
    const result = calculateBiologicalAge({
      chronologicalAge: 45,
      bmi: 31,
      systolicBp: 145,
      exerciseDays: 0,
      sleepHours: 5,
      smoking: "yes",
      alcohol: "daily",
      stress: "high"
    });

    expect(result.biologicalAge).toBe(59);
    expect(result.differenceLabel).toBe("14 years older");
    expect(result.tips).toContain("Quitting smoking is the single most effective intervention");
    expect(result.tips).toContain("Control blood pressure: reduce sodium, exercise, maintain weight");
  });
});
