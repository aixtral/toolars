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

const w20BeSlugs = [
  "agent-workflow-builder",
  "embedding-playground",
  "mcp-tester",
  "rag-chunk-visualizer",
  "rag-eval-bench",
  "context-window",
  "model-comparator",
  "token-budget-planner"
] as const;

const localeMessages = { en, es, "zh-hans": zhHans, "zh-hant": zhHant, ar, fr, hi, ja, pt, ru } as const;

describe("W20-BE RAG MCP agent native registrations", () => {
  it("promotes each assigned slug as a public native Toolars workspace", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);

    for (const slug of w20BeSlugs) {
      expect(getToolBySlug(slug), slug).toMatchObject({
        slug,
        group: "AI Developer Lab",
        status: "ready",
        visibility: "public",
        href: `/tools/${slug}`
      });
      expect(publicSlugs, slug).toContain(slug);
    }
  });

  it("uses native detail copy and local-first trust boundaries", () => {
    for (const slug of w20BeSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.workspaceHref, slug).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge.badge, slug).toBe("Native workspace");
      expect(detail?.trustSection.title, slug).not.toBe("Detail-only migration model");
      expect(detail?.metrics.map((metric) => metric.value), slug).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.handoff.map((item) => item.title), slug).toContain("Toolars workspace");
    }
  });

  it("adds workspace message namespaces for every launch and draft locale", () => {
    for (const [locale, messages] of Object.entries(localeMessages)) {
      const tools = (messages as { tools: Record<string, { workspace?: Record<string, unknown> }> }).tools;

      for (const slug of w20BeSlugs) {
        expect(tools[slug]?.workspace, `${locale}:${slug}`).toEqual(expect.objectContaining({
          title: expect.any(String),
          runMode: expect.any(String),
          providerRoute: expect.any(String)
        }));
      }
    }
  });
});
