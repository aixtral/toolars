import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native slug-generator metadata", () => {
  it("publishes slug-generator with native workspace detail metadata", () => {
    const tool = getToolBySlug("slug-generator");
    const detail = getToolDetailBySlug("slug-generator");

    expect(tool).toMatchObject({
      slug: "slug-generator",
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      processing: ["local"]
    });
    expect(publicTools.map((item) => item.slug)).toContain("slug-generator");
    expect(detail?.workspaceHref).toBe("/tools/slug-generator");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
    expect(detail?.trustSection.title).toBe("Local slug generation model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
  });
});
