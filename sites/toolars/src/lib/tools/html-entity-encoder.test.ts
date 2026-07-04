import { describe, expect, it } from "vitest";
import { convertHtmlEntities } from "./html-entity-encoder";

describe("convertHtmlEntities", () => {
  it("encodes special HTML characters as named entities", () => {
    const result = convertHtmlEntities({
      input: '<div class="note">Tom & Jerry</div>',
      mode: "encode",
      style: "named"
    });

    expect(result.success).toBe(true);
    expect(result.output).toBe("&lt;div class=&quot;note&quot;&gt;Tom &amp; Jerry&lt;/div&gt;");
    expect(result.stats.convertedEntities).toBe(7);
    expect(result.summary).toContain("Encoded");
  });

  it("decodes named, decimal, and hexadecimal entities", () => {
    const result = convertHtmlEntities({
      input: "&lt;span&gt;&#169; &#x1f680;&lt;/span&gt;",
      mode: "decode",
      style: "named"
    });

    expect(result.success).toBe(true);
    expect(result.output).toBe("<span>\u00a9 \ud83d\ude80</span>");
    expect(result.stats.convertedEntities).toBe(6);
    expect(result.reviewNote).toContain("Review decoded text");
  });

  it("encodes unlisted non-ASCII characters numerically when requested", () => {
    const result = convertHtmlEntities({
      input: "Launch \ud83d\ude80",
      mode: "encode",
      style: "hex"
    });

    expect(result.success).toBe(true);
    expect(result.output).toBe("Launch &#x1f680;");
  });
});
