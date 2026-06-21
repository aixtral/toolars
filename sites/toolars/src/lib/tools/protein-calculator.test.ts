import { describe, expect, it } from "vitest";
import { calculateProteinNeeds, defaultProteinScenario } from "./protein-calculator";

describe("calculateProteinNeeds", () => {
  it("calculates the default VitalCalc protein scenario", () => {
    const result = calculateProteinNeeds(defaultProteinScenario);

    expect(result.formattedProtein).toBe("112 g");
    expect(result.formattedPerMeal).toBe("37 g");
    expect(result.formattedEggs).toBe("19 eggs");
    expect(result.formattedChicken).toBe("362 g");
    expect(result.summary).toBe("70 kg × 1.6 g/kg");
  });

  it("supports the muscle-building factor", () => {
    const result = calculateProteinNeeds({
      weightKg: 80,
      factor: 2.2
    });

    expect(result.formattedProtein).toBe("176 g");
    expect(result.factorLabel).toBe("Muscle Building");
  });
});
