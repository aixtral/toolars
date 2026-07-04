import { describe, expect, it } from "vitest";
import { generateMockData } from "./mock-data-generator";

describe("generateMockData", () => {
  it("generates deterministic JSON and CSV rows from a field schema", () => {
    const result = generateMockData({
      fields: "id:number\nemail:email\nstatus:enum(active|paused)",
      rows: 2
    });

    expect(result.records).toEqual([
      { id: 1, email: "user1@example.com", status: "active" },
      { id: 2, email: "user2@example.com", status: "paused" }
    ]);
    expect(result.csv).toContain("id,email,status");
    expect(result.json).toContain('"user1@example.com"');
    expect(result.warnings).toEqual([]);
  });
});
