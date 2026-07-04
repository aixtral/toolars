import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native Lorem Ipsum registration", () => {
  it("promotes lorem-ipsum as a public native Toolars workspace", () => {
    const tool = getToolBySlug("lorem-ipsum");

    expect(tool).toMatchObject({
      slug: "lorem-ipsum",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/lorem-ipsum"
    });
    expect(publicTools.map((item) => item.slug)).toContain("lorem-ipsum");
  });

  it("uses native detail copy for placeholder copy generation", () => {
    const detail = getToolDetailBySlug("lorem-ipsum");

    expect(detail?.workspaceHref).toBe("/tools/lorem-ipsum");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "1-100"]));
    expect(detail?.trustSection.title).toBe("Local placeholder copy model");
    expect(detail?.outcome).toContain("placeholder copy");
  });
});
