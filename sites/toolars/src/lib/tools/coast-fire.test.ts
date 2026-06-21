import { describe, expect, it } from "vitest";
import { calculateCoastFire, defaultCoastFireScenario } from "./coast-fire";

describe("calculateCoastFire", () => {
  it("calculates the VitalCalc default Coast FIRE checkpoint", () => {
    const result = calculateCoastFire(defaultCoastFireScenario);

    expect(result.formattedFireTarget).toBe("$1,500,000");
    expect(result.formattedCoastTarget).toBe("$276,374");
    expect(result.formattedGapOrSurplus).toBe("$223,626");
    expect(result.formattedProgress).toBe("180.9%");
    expect(result.statusTone).toBe("ready");
  });

  it("shows a gap when current assets are below the coast target", () => {
    const result = calculateCoastFire({
      ...defaultCoastFireScenario,
      currentAssets: 100000
    });

    expect(result.statusTone).toBe("gap");
    expect(result.gapOrSurplus).toBeGreaterThan(0);
  });
});
