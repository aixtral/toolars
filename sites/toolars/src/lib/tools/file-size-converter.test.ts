import { describe, expect, it } from "vitest";
import { convertFileSize, formatFileSize, getFileSizeUnitSet, summarizeFileSizeConversion } from "./file-size-converter";

describe("convertFileSize", () => {
  it("converts decimal sizes across SI units", () => {
    const results = convertFileSize(1.44, "MB", getFileSizeUnitSet("decimal"), "decimal");

    expect(results?.B).toBeCloseTo(1440000);
    expect(results?.KB).toBeCloseTo(1440);
    expect(results?.GB).toBeCloseTo(0.00144);
  });

  it("converts binary sizes across IEC units", () => {
    const results = convertFileSize(1, "GiB", getFileSizeUnitSet("binary"), "binary");

    expect(results?.B).toBe(1024 ** 3);
    expect(results?.MiB).toBe(1024);
    expect(results?.KiB).toBe(1024 ** 2);
  });

  it("returns null for invalid values or units", () => {
    expect(convertFileSize(-1, "MB", getFileSizeUnitSet("decimal"), "decimal")).toBeNull();
    expect(convertFileSize(Number.POSITIVE_INFINITY, "MB", getFileSizeUnitSet("decimal"), "decimal")).toBeNull();
    expect(convertFileSize(1, "MiB", getFileSizeUnitSet("decimal"), "decimal")).toBeNull();
  });
});

describe("file size display helpers", () => {
  it("formats converted values and summarizes source assumptions", () => {
    const summary = summarizeFileSizeConversion({ value: 1024, fromUnit: "B", mode: "binary" });

    expect(formatFileSize(1440000)).toBe("1,440,000");
    expect(summary.success).toBe(true);
    expect(summary.rows.find((row) => row.unit === "KiB")?.formatted).toBe("1");
    expect(summary.summary).toContain("binary");
  });
});
