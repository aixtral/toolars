import { describe, expect, it } from "vitest";
import { buildMarkdownTable } from "./markdown-table-generator";

describe("buildMarkdownTable", () => {
  it("builds a markdown table from CSV text and escapes pipes", () => {
    const result = buildMarkdownTable({
      csv: "Tool,Status,Note\nPrompt Templates,Ready,Local only\nFormatter,Review,Escapes | pipes"
    });

    expect(result.rowCount).toBe(2);
    expect(result.columnCount).toBe(3);
    expect(result.markdown).toContain("| Tool | Status | Note |");
    expect(result.markdown).toContain("Escapes \\| pipes");
    expect(result.privacyNote).toMatch(/local/i);
  });
});
