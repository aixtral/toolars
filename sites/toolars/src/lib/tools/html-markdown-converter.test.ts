import { describe, expect, it } from "vitest";
import { convertHtmlMarkdown } from "./html-markdown-converter";

describe("convertHtmlMarkdown", () => {
  it("converts headings, paragraphs, links, and strong text from HTML to Markdown", () => {
    const result = convertHtmlMarkdown({
      direction: "html-to-markdown",
      input: '<h1>Guide</h1><p>Hello <strong>Toolars</strong> <a href="https://toolars.app">site</a></p>'
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain("# Guide");
    expect(result.output).toContain("**Toolars**");
    expect(result.output).toContain("[site](https://toolars.app)");
  });

  it("converts basic Markdown back to HTML", () => {
    const result = convertHtmlMarkdown({ direction: "markdown-to-html", input: "# Guide\n\nHello **Toolars**" });

    expect(result.output).toContain("<h1>Guide</h1>");
    expect(result.output).toContain("<strong>Toolars</strong>");
  });
});
