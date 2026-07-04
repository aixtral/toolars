import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

const w20FrontendMediaNativeSlugs = [
  "css-animation-generator",
  "css-flexbox-generator",
  "css-grid-generator",
  "css-to-tailwind-converter",
  "css-unit-converter",
  "base64-image-encoder",
  "code-to-image",
  "image-resizer",
  "meta-tag-generator",
  "robots-txt-generator",
  "svg-optimizer"
] as const;

describe("W20 frontend and media native migrations", () => {
  it("promotes the W20 frontend-media tools to public native Toolars workspaces", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);

    for (const slug of w20FrontendMediaNativeSlugs) {
      const tool = getToolBySlug(slug);
      const detail = getToolDetailBySlug(slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
    }
  });
});
