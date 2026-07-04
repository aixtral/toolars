import { describe, expect, it } from "vitest";
import ar from "../../messages/ar.json";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import fr from "../../messages/fr.json";
import hi from "../../messages/hi.json";
import ja from "../../messages/ja.json";
import pt from "../../messages/pt.json";
import ru from "../../messages/ru.json";
import zhHans from "../../messages/zh-hans.json";
import zhHant from "../../messages/zh-hant.json";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

const w20BhPdfNativeSlugs = [
  "ai-pdf-summarizer",
  "pdf-password-remover",
  "pdf-signer",
  "pdf-translator"
] as const;

const stagedMessages = { ar, en, es, fr, hi, ja, pt, ru, "zh-hans": zhHans, "zh-hant": zhHant } as const;

describe("Wave 20-BH PDF native registrations", () => {
  it("promotes every assigned PDF slug as a public native Toolars workspace", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);

    for (const slug of w20BhPdfNativeSlugs) {
      const tool = getToolBySlug(slug);

      expect(tool, slug).toMatchObject({
        slug,
        source: "toolars",
        status: "ready",
        visibility: "public",
        href: `/tools/${slug}`
      });
      expect(publicSlugs, slug).toContain(slug);
    }
  });

  it("uses native detail copy with explicit trust boundaries for PDF engines and AI consent", () => {
    for (const slug of w20BhPdfNativeSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.workspaceHref, slug).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge.badge, slug).toBe("Native workspace");
      expect(detail?.overview, slug).toMatch(/trust boundary|local/i);
      expect(detail?.trustSection.rows.map((row) => row.badge), slug).toEqual(expect.arrayContaining(["Local-first", "Boundary"]));
      expect(detail?.trustSection.rows.map((row) => row.description).join(" "), slug).toMatch(/AI consent|PDF engine|signing engine|owned PDF|model route/i);
      expect(detail?.handoff.map((item) => item.title), slug).toContain("Toolars workspace");
    }
  });

  it("adds workspace namespaces to every staged locale bundle without routing draft locales", () => {
    for (const [locale, messages] of Object.entries(stagedMessages)) {
      const tools = (messages as { tools: Record<string, { workspace?: Record<string, unknown> }> }).tools;

      for (const slug of w20BhPdfNativeSlugs) {
        expect(tools[slug]?.workspace, `${locale}:${slug}`).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            runMode: expect.any(String),
            providerRoute: expect.any(String),
            trustCopy: expect.any(String)
          })
        );
      }
    }
  });
});
