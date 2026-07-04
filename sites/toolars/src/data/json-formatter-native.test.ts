import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native JSON Formatter registration", () => {
  it("promotes json-formatter as a public native Toolars workspace", () => {
    expect(getToolBySlug("json-formatter")).toMatchObject({
      slug: "json-formatter",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "toolars",
      status: "ready",
      visibility: "public",
      href: "/tools/json-formatter"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("json-formatter");
  });

  it("uses native detail copy for local JSON formatting", () => {
    const detail = getToolDetailBySlug("json-formatter");

    expect(detail?.workspaceHref).toBe("/tools/json-formatter");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local JSON formatting model");
    expect(detail?.metrics.map((metric) => metric.value)).toContain("JSON");
  });
});
