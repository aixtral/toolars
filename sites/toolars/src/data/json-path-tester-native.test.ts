import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native JSON Path Tester registration", () => {
  it("promotes json-path-tester as a public native Toolars workspace", () => {
    expect(getToolBySlug("json-path-tester")).toMatchObject({
      slug: "json-path-tester",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/json-path-tester"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("json-path-tester");
  });

  it("uses native detail copy for local JSONPath queries", () => {
    const detail = getToolDetailBySlug("json-path-tester");

    expect(detail?.workspaceHref).toBe("/tools/json-path-tester");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local JSONPath query model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
