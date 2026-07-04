import { describe, expect, it, vi } from "vitest";
import { convertTimestamp, getCurrentTimestamp } from "./timestamp-converter";

describe("convertTimestamp", () => {
  it("converts Unix seconds and milliseconds into stable UTC output", () => {
    expect(convertTimestamp(1700000000)).toMatchObject({
      success: true,
      timestamp: 1700000000,
      precision: "seconds",
      iso: "2023-11-14T22:13:20.000Z"
    });
    expect(convertTimestamp(1700000000000)).toMatchObject({
      success: true,
      timestamp: 1700000000,
      precision: "milliseconds",
      iso: "2023-11-14T22:13:20.000Z"
    });
  });

  it("converts ISO date strings and rejects invalid input", () => {
    expect(convertTimestamp("2023-11-14T22:13:20.000Z")).toMatchObject({
      success: true,
      timestamp: 1700000000,
      precision: "date"
    });
    expect(convertTimestamp("not a date")).toMatchObject({
      success: false,
      error: { type: "invalid-timestamp" }
    });
  });

  it("returns relative labels around the current time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2023-11-14T22:14:20.000Z"));

    expect(convertTimestamp(1700000000).relative).toBe("1 minute ago");
    expect(convertTimestamp(1700007200).relative).toBe("1 hour from now");
    expect(getCurrentTimestamp()).toMatchObject({ success: true, timestamp: 1700000060 });

    vi.useRealTimers();
  });
});
