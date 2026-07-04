import { describe, expect, it } from "vitest";
import { buildHtmlPreview } from "./html-preview";

describe("buildHtmlPreview", () => {
  it("builds safe iframe srcdoc with escaped closing script tags", () => {
    const result = buildHtmlPreview({
      html: "<main><h1>Toolars</h1></main>",
      css: "h1 { color: red; }",
      javascript: "console.log('</script>');"
    });

    expect(result.success).toBe(true);
    expect(result.srcDoc).toContain("<style>");
    expect(result.srcDoc).toContain("<\\/script>");
    expect(result.stats.scripts).toBe(1);
    expect(result.warnings.some((warning) => warning.type === "script-review")).toBe(true);
  });
});
