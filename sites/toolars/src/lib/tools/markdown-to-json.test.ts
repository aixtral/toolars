import { describe, expect, it } from "vitest";
import { convertMarkdownToJson } from "./markdown-to-json";

describe("convertMarkdownToJson", () => {
  it("extracts markdown headings, lists, code blocks, links, and metadata", () => {
    const result = convertMarkdownToJson({
      input: `# Release notes

Intro paragraph with [docs](https://example.com).

- Added local diff
- Added parser

\`\`\`ts
const ok = true;
\`\`\``
    });

    expect(result.success).toBe(true);
    expect(result.structure).toMatchObject({ headings: 1, paragraphs: 1, lists: 1, codeBlocks: 1, links: 1 });
    expect(result.data?.metadata.title).toBe("Release notes");
    expect(result.output).toContain("\"type\": \"code\"");
    expect(result.summary).toBe("Parsed 4 Markdown blocks into JSON.");
  });

  it("returns empty structured JSON for an empty document", () => {
    const result = convertMarkdownToJson({ input: "" });

    expect(result.success).toBe(true);
    expect(result.structure.headings).toBe(0);
    expect(result.data?.content).toEqual([]);
    expect(result.summary).toBe("Parsed 0 Markdown blocks into JSON.");
  });
});
