import { describe, expect, it } from "vitest";
import { convertJsonToCsv } from "./json-to-csv";

describe("convertJsonToCsv", () => {
  it("converts a JSON object array into escaped CSV with stats", () => {
    const result = convertJsonToCsv({
      input: JSON.stringify([
        { name: "Alice", note: "hello, world", active: true },
        { name: "Bob", note: 'said "yes"', role: "User" }
      ]),
      delimiter: ","
    });

    expect(result.success).toBe(true);
    expect(result.output).toBe('name,note,active,role\nAlice,"hello, world",true,\nBob,"said ""yes""",,User');
    expect(result.stats).toMatchObject({
      rows: 2,
      columns: 4
    });
    expect(result.summary).toContain("2 JSON records");
  });

  it("serializes nested values as JSON strings before CSV escaping", () => {
    const result = convertJsonToCsv({
      input: JSON.stringify([{ id: 1, meta: { plan: "pro" } }]),
      delimiter: ","
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain('"{""plan"":""pro""}"');
  });

  it("returns stable errors for invalid JSON and non-object arrays", () => {
    expect(convertJsonToCsv({ input: "{bad", delimiter: "," }).error?.type).toBe("invalid-json");
    expect(convertJsonToCsv({ input: "[1,2,3]", delimiter: "," }).error?.type).toBe("items-not-objects");
  });
});
