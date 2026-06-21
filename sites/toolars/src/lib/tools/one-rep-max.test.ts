import { describe, expect, it } from "vitest";
import { calculateOneRepMax, defaultOneRepMaxScenario } from "./one-rep-max";

describe("calculateOneRepMax", () => {
  it("uses the VitalCalc Epley formula and percentage table", () => {
    const result = calculateOneRepMax(defaultOneRepMaxScenario);

    expect(result.oneRepMaxKg).toBeCloseTo(93.333, 3);
    expect(result.formattedOneRepMax).toBe("93.3 kg");
    expect(result.summary).toBe("80 kg x 5 reps");
    expect(result.percentageRows[0]).toMatchObject({
      percentage: 95,
      reps: 2,
      formattedWeight: "88.7 kg"
    });
    expect(result.percentageRows.at(-1)).toMatchObject({
      percentage: 60,
      reps: 18,
      formattedWeight: "56.0 kg"
    });
  });

  it("flags high-rep estimates as less accurate", () => {
    const result = calculateOneRepMax({ weightKg: 60, reps: 12 });

    expect(result.formattedOneRepMax).toBe("84.0 kg");
    expect(result.accuracyLabel).toBe("Lower accuracy");
  });
});
