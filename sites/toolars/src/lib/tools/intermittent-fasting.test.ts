import { describe, expect, it } from "vitest";
import { calculateIntermittentFasting, defaultIntermittentFastingScenario } from "./intermittent-fasting";

describe("calculateIntermittentFasting", () => {
  it("calculates the default 16:8 fasting and eating windows", () => {
    const result = calculateIntermittentFasting(defaultIntermittentFastingScenario);

    expect(result.protocolLabel).toBe("16:8");
    expect(result.nextMealTime).toBe("12:00");
    expect(result.formattedFastingHours).toBe("16 hours");
    expect(result.eatingWindow).toBe("12:00 - 20:00");
    expect(result.fastingWindow).toBe("20:00 - 12:00 (next day)");
  });

  it("supports the OMAD source protocol window", () => {
    const result = calculateIntermittentFasting({
      protocol: "OMAD",
      lastMealTime: "19:30"
    });

    expect(result.fastingHours).toBe(23);
    expect(result.eatingHours).toBe(1);
    expect(result.eatingWindow).toBe("18:30 - 19:30");
  });
});
