import { describe, expect, it } from "vitest";
import { convertCsvToJson } from "./csv-to-json";

describe("convertCsvToJson", () => {
  it("converts quoted CSV rows into formatted JSON with stats", () => {
    const result = convertCsvToJson({
      input: 'name,city,notes\nAlice,NYC,"Hello, world"\nBob,LA,"Line 1\nLine 2"',
      delimiter: ",",
      hasHeaders: true,
      skipEmptyRows: true
    });

    expect(result.success).toBe(true);
    expect(result.records).toEqual([
      { name: "Alice", city: "NYC", notes: "Hello, world" },
      { name: "Bob", city: "LA", notes: "Line 1\nLine 2" }
    ]);
    expect(result.output).toContain('"notes": "Line 1\\nLine 2"');
    expect(result.stats).toMatchObject({
      rows: 2,
      columns: 3,
      skippedEmptyRows: 0
    });
    expect(result.summary).toContain("2 CSV rows");
  });

  it("assigns positional keys when headers are disabled", () => {
    const result = convertCsvToJson({
      input: "Alice\t30\nBob\t25",
      delimiter: "\t",
      hasHeaders: false,
      skipEmptyRows: false
    });

    expect(result.success).toBe(true);
    expect(result.records).toEqual([
      { "0": "Alice", "1": "30" },
      { "0": "Bob", "1": "25" }
    ]);
    expect(result.stats.columns).toBe(2);
  });

  it("rejects rows with inconsistent column counts", () => {
    const result = convertCsvToJson({
      input: "name,age\nAlice,30,extra\nBob,25",
      delimiter: ",",
      hasHeaders: true,
      skipEmptyRows: true
    });

    expect(result.success).toBe(false);
    expect(result.output).toBe("");
    expect(result.error?.type).toBe("inconsistent-columns");
    expect(result.summary).toBe("CSV conversion failed.");
  });
});
