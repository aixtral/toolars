import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import zhHans from "../../messages/zh-hans.json";
import zhHant from "../../messages/zh-hant.json";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

const mediaNativeSlugs = [
  "pdf-merger",
  "pdf-compressor",
  "pdf-to-word",
  "extract-tables",
  "ocr-scanner",
  "qr-code-generator",
  "barcode-generator"
] as const;

const launchMessages = { en, es, "zh-hans": zhHans, "zh-hant": zhHant } as const;

describe("Wave 19-C PDF image media native registrations", () => {
  it("promotes each media slug as a public native Toolars workspace", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);

    for (const slug of mediaNativeSlugs) {
      const tool = getToolBySlug(slug);

      expect(tool, slug).toMatchObject({
        slug,
        status: "ready",
        visibility: "public",
        href: `/tools/${slug}`
      });
      expect(publicSlugs, slug).toContain(slug);
    }
  });

  it("uses native detail copy with explicit local-first trust boundaries", () => {
    for (const slug of mediaNativeSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.workspaceHref, slug).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge.badge, slug).toBe("Native workspace");
      expect(detail?.trustSection.title, slug).not.toBe("Detail-only migration model");
      expect(detail?.trustSection.rows.map((row) => row.badge), slug).toEqual(expect.arrayContaining(["Local-first"]));
      expect(detail?.overview, slug).toMatch(/trust boundary|local/i);
    }
  });

  it("adds launch-locale workspace namespaces for every promoted slug", () => {
    for (const [locale, messages] of Object.entries(launchMessages)) {
      const tools = (messages as { tools: Record<string, { workspace?: Record<string, unknown> }> }).tools;

      for (const slug of mediaNativeSlugs) {
        expect(tools[slug]?.workspace, `${locale}:${slug}`).toEqual(expect.objectContaining({
          title: expect.any(String),
          runMode: expect.any(String),
          providerRoute: expect.any(String)
        }));
      }
    }
  });
});
