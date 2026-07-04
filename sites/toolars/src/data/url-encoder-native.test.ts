import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native URL Encoder registration", () => {
  it("promotes url-encoder as a public native Toolars workspace", () => {
    const tool = getToolBySlug("url-encoder");

    expect(tool).toMatchObject({
      slug: "url-encoder",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/url-encoder"
    });
    expect(publicTools.map((item) => item.slug)).toContain("url-encoder");
  });

  it("uses native detail copy instead of detail-only migration content", () => {
    const detail = getToolDetailBySlug("url-encoder");

    expect(detail?.workspaceHref).toBe("/tools/url-encoder");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "2-way"]));
    expect(detail?.trustSection.title).toBe("Local URL conversion model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
