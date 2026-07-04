import { describe, expect, it } from "vitest";
import { formatSqlQuery } from "./sql-formatter";

describe("formatSqlQuery", () => {
  it("formats compact SQL with uppercase keywords", () => {
    const result = formatSqlQuery({ input: "select id,name from users where active=true order by name", keywordCase: "upper" });

    expect(result.success).toBe(true);
    expect(result.output).toContain("SELECT");
    expect(result.output).toContain("\nFROM users");
    expect(result.output).toContain("\nWHERE active = true");
    expect(result.stats.lines).toBeGreaterThan(1);
  });

  it("returns an empty-input validation error", () => {
    const result = formatSqlQuery({ input: " " });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe("empty-input");
  });
});
