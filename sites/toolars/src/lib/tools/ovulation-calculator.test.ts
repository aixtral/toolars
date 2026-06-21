import { describe, expect, it } from "vitest";
import { calculateOvulation, defaultOvulationScenario } from "./ovulation-calculator";

describe("calculateOvulation", () => {
  it("uses the VitalCalc next-period-minus-14 ovulation model", () => {
    const result = calculateOvulation(defaultOvulationScenario);

    expect(result.ovulationDate).toBe("2026-06-15");
    expect(result.formattedOvulationDate).toBe("Jun 15");
    expect(result.formattedFertileWindow).toBe("Jun 10 - Jun 16");
    expect(result.formattedNextPeriod).toBe("Jun 29");
    expect(result.formattedSafePeriod).toBe("Jun 17 - Jun 28");
    expect(result.formattedMenstruation).toBe("Jun 1 - Jun 5");
  });

  it("adjusts ovulation date by cycle length", () => {
    const result = calculateOvulation({
      lastPeriodDate: "2026-06-01",
      cycleLengthDays: 32,
      periodDurationDays: 6
    });

    expect(result.formattedOvulationDate).toBe("Jun 19");
    expect(result.formattedNextPeriod).toBe("Jul 3");
  });
});
