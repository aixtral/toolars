import { describe, expect, it } from "vitest";
import { searchCommandResults } from "./command-search";

describe("searchCommandResults", () => {
  it("routes tool-name search to JSON Repair", () => {
    const results = searchCommandResults("json");

    expect(results[0]?.title).toBe("JSON Repair");
    expect(results[0]?.href).toBe("/tools/json-repair");
  });

  it("routes natural-language PDF work to the PDF workflow surface", () => {
    const titles = searchCommandResults("summarize pdf").map((result) => result.title);

    expect(titles).toContain("Turn PDF into summary");
  });

  it("returns both MCP tools and MCP workflow results", () => {
    const titles = searchCommandResults("mcp").map((result) => result.title);

    expect(titles).toContain("MCP Server Builder");
    expect(titles).toContain("MCP Tool Launch");
  });

  it("indexes launch-certified tools by default instead of every public preview tool", () => {
    const titles = searchCommandResults("color contrast checker", { limit: 24 }).map((result) => result.title);

    expect(titles).not.toContain("Color Contrast Checker");
  });

  it("returns an empty array for unrelated queries", () => {
    expect(searchCommandResults("zzzz no matching task")).toEqual([]);
  });

  it("allows callers to request a larger stress result window", () => {
    const results = searchCommandResults("calculator", { limit: 24 });

    expect(results.length).toBeGreaterThan(3);
    expect(results.map((result) => result.title)).not.toContain("Token Counter");
    expect(results.every((result) => result.title.toLowerCase().includes("calculator") || result.keywords.join(" ").toLowerCase().includes("calculator"))).toBe(true);
  });
});
