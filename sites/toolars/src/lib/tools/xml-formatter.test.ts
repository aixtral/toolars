import { describe, expect, it } from "vitest";
import { formatXmlSnippet } from "./xml-formatter";

describe("formatXmlSnippet", () => {
  it("formats compact XML into indented lines with stats", () => {
    const result = formatXmlSnippet({
      input: "<root><child>hello</child></root>",
      mode: "format",
      indentSize: 2
    });

    expect(result.success).toBe(true);
    expect(result.output).toBe("<root>\n  <child>hello</child>\n</root>");
    expect(result.stats).toMatchObject({ lines: 3, tags: 4 });
    expect(result.summary).toBe("Formatted XML into 3 lines.");
  });

  it("minifies whitespace between tags while preserving text content", () => {
    const result = formatXmlSnippet({
      input: "<root>\n  <child>  hello  </child>\n</root>",
      mode: "minify",
      indentSize: 2
    });

    expect(result.success).toBe(true);
    expect(result.output).toBe("<root><child>  hello  </child></root>");
    expect(result.summary).toBe("Minified XML to 37 characters.");
  });

  it("returns a stable empty-input error", () => {
    const result = formatXmlSnippet({ input: "   ", mode: "format", indentSize: 2 });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe("empty-input");
    expect(result.output).toBe("");
  });
});
