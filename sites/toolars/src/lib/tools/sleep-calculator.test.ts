import { describe, expect, it } from "vitest";
import { calculateSleepSchedule, defaultSleepScenario } from "./sleep-calculator";

describe("calculateSleepSchedule", () => {
  it("calculates the default wake-up based bedtime options and sleepmaxxing cutoffs", () => {
    const result = calculateSleepSchedule(defaultSleepScenario);

    expect(result.modeLabel).toBe("Bedtime from wake-up");
    expect(result.primaryTime).toBe("21:45");
    expect(result.options.map((option) => option.time)).toEqual(["21:45", "23:15", "00:45", "02:15"]);
    expect(result.caffeineCutoff).toBe("11:45");
    expect(result.screenCutoff).toBe("20:45");
    expect(result.morningLight).toBe("07:30");
  });

  it("calculates wake-up time from bedtime", () => {
    const result = calculateSleepSchedule({
      ...defaultSleepScenario,
      mode: "bedtime",
      mainTime: "22:30"
    });

    expect(result.primaryTime).toBe("07:45");
    expect(result.resultLabel).toContain("Recommended wake-up time");
    expect(result.dinnerCutoff).toBe("19:30");
  });
});
