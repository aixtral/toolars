import { describe, expect, it } from "vitest";
import { calculateCaffeineLimit, defaultCaffeineScenario } from "./caffeine-calculator";

describe("calculateCaffeineLimit", () => {
  it("calculates the VitalCalc adult caffeine allowance and selected drink intake", () => {
    const result = calculateCaffeineLimit(defaultCaffeineScenario);

    expect(result.dailyLimitMg).toBe(399);
    expect(result.consumedMg).toBe(175);
    expect(result.remainingMg).toBe(224);
    expect(result.formattedDailyLimit).toBe("399 mg");
    expect(result.status).toBe("Within safe range");
  });

  it("applies the pregnancy cap after the source 50% weight adjustment", () => {
    const result = calculateCaffeineLimit({
      weightKg: 80,
      pregnant: true,
      selectedDrinkIds: ["blackCoffee", "energyDrink", "cola"]
    });

    expect(result.dailyLimitMg).toBe(200);
    expect(result.consumedMg).toBe(200);
    expect(result.remainingMg).toBe(0);
    expect(result.limitText).toBe("Pregnancy safe limit");
  });
});
