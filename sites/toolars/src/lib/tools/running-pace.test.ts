import { describe, expect, it } from "vitest";
import { calculateRunningPace, defaultRunningPaceScenario } from "./running-pace";

describe("calculateRunningPace", () => {
  it("calculates target pace, speed, lap split, and Riegel equivalents", () => {
    const result = calculateRunningPace(defaultRunningPaceScenario);

    expect(result.distanceKm).toBe(10);
    expect(result.formattedPacePerKm).toBe("5'00\"");
    expect(result.formattedPacePerMile).toBe("8'03\" /mi");
    expect(result.formattedSpeed).toBe("12.0 km/h");
    expect(result.formattedLap400m).toBe("2:00");
    expect(result.equivalents.find((item) => item.name === "5K")).toMatchObject({
      formattedTime: "23:59",
      formattedPace: "4'48\""
    });
    expect(result.equivalents.find((item) => item.name === "Marathon")).toMatchObject({
      formattedTime: "3:50:01",
      formattedPace: "5'27\""
    });
  });

  it("uses custom distance when selected", () => {
    const result = calculateRunningPace({
      distancePreset: "custom",
      customDistanceKm: 15,
      hours: 1,
      minutes: 15,
      seconds: 0
    });

    expect(result.distanceKm).toBe(15);
    expect(result.formattedPacePerKm).toBe("5'00\"");
  });
});
