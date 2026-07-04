import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native JSON to CSV registration", () => {
  it("promotes json-to-csv as a public native Toolars workspace", () => {
    const tool = getToolBySlug("json-to-csv");

    expect(tool).toMatchObject({
      slug: "json-to-csv",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/json-to-csv"
    });
    expect(publicTools.map((item) => item.slug)).toContain("json-to-csv");
  });

  it("uses native detail copy for JSON export workflows", () => {
    const detail = getToolDetailBySlug("json-to-csv");

    expect(detail?.workspaceHref).toBe("/tools/json-to-csv");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "Rows"]));
    expect(detail?.trustSection.title).toBe("Local JSON export model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
