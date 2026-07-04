import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native HTML Entity Encoder registration", () => {
  it("promotes html-entity-encoder as a public native Toolars workspace", () => {
    const tool = getToolBySlug("html-entity-encoder");

    expect(tool).toMatchObject({
      slug: "html-entity-encoder",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/html-entity-encoder"
    });
    expect(publicTools.map((item) => item.slug)).toContain("html-entity-encoder");
  });

  it("uses native detail copy for safe rendering workflows", () => {
    const detail = getToolDetailBySlug("html-entity-encoder");

    expect(detail?.workspaceHref).toBe("/tools/html-entity-encoder");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "Named"]));
    expect(detail?.trustSection.title).toBe("Local HTML entity conversion model");
    expect(detail?.overview).toContain("safe rendering");
  });
});
