import { describe, expect, it } from "vitest";
import { calculateHeartRateZones, defaultHeartRateZoneScenario } from "./heart-rate-zone";

describe("calculateHeartRateZones", () => {
  it("calculates Karvonen heart rate reserve zones from age and resting HR", () => {
    const result = calculateHeartRateZones(defaultHeartRateZoneScenario);

    expect(result.maxHeartRate).toBe(190);
    expect(result.heartRateReserve).toBe(130);
    expect(result.zones[0]).toMatchObject({
      label: "Warm-up / Recovery",
      formattedRange: "125 - 138 bpm"
    });
    expect(result.zones[4]).toMatchObject({
      label: "Maximum Effort",
      formattedRange: "177 - 190 bpm"
    });
  });

  it("updates all zones when resting heart rate changes", () => {
    const result = calculateHeartRateZones({ age: 40, restingHeartRate: 55 });

    expect(result.maxHeartRate).toBe(180);
    expect(result.heartRateReserve).toBe(125);
    expect(result.zones[1].formattedRange).toBe("130 - 143 bpm");
  });
});
