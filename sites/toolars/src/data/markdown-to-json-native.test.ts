import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native Markdown to JSON registration", () => {
  it("promotes markdown-to-json as a public native Toolars workspace", () => {
    const tool = getToolBySlug("markdown-to-json");

    expect(tool).toMatchObject({
      slug: "markdown-to-json",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/markdown-to-json"
    });
    expect(publicTools.map((item) => item.slug)).toContain("markdown-to-json");
  });

  it("uses native detail copy for content parser workflows", () => {
    const detail = getToolDetailBySlug("markdown-to-json");

    expect(detail?.workspaceHref).toBe("/tools/markdown-to-json");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "Blocks"]));
    expect(detail?.trustSection.title).toBe("Local Markdown parser model");
    expect(detail?.overview).toContain("structured JSON");
  });
});
