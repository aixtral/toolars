import { existsSync } from "node:fs";
import path from "node:path";
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

const w20BkPromptDataNativeSlugs = [
  "function-call-builder",
  "prompt-templates",
  "structured-output-formatter",
  "vision-prompt-builder",
  "markdown-table-generator",
  "mock-data-generator",
  "synthetic-dataset-gen"
] as const;

const w20BkToolarsNativePromptDataSlugs = [
  "synthetic-dataset-generator"
] as const;

const stagedMessages = { ar, en, es, fr, hi, ja, pt, ru, "zh-hans": zhHans, "zh-hant": zhHant } as const;
const siteRoot = process.cwd();

describe("W20-BK prompt and data native registrations", () => {
  it("promotes each assigned slug as a public local Toolars workspace", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);

    for (const slug of [...w20BkPromptDataNativeSlugs, ...w20BkToolarsNativePromptDataSlugs]) {
      const tool = getToolBySlug(slug);

      expect(tool, slug).toMatchObject({
        slug,
        group: "AI Developer Lab",
        processing: ["local"],
        source: w20BkToolarsNativePromptDataSlugs.includes(slug as (typeof w20BkToolarsNativePromptDataSlugs)[number]) ? "toolars" : "aixtral-lab",
        status: "ready",
        visibility: "public",
        href: `/tools/${slug}`
      });
      expect(publicSlugs, slug).toContain(slug);
    }
  });

  it("uses native detail copy with local-first trust boundaries", () => {
    for (const slug of [...w20BkPromptDataNativeSlugs, ...w20BkToolarsNativePromptDataSlugs]) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.workspaceHref, slug).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge.badge, slug).toBe("Native workspace");
      expect(detail?.metrics.map((metric) => metric.value), slug).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.trustSection.title, slug).not.toBe("Detail-only migration model");
      expect(detail?.trustSection.rows.map((row) => row.badge), slug).toEqual(expect.arrayContaining(["Local", "Review", "Public"]));
      expect(detail?.handoff.map((item) => item.title), slug).toContain("Toolars workspace");
    }
  });

  it("adds native library and workspace route files for every assigned slug", () => {
    for (const slug of [...w20BkPromptDataNativeSlugs, ...w20BkToolarsNativePromptDataSlugs]) {
      expect(existsSync(path.join(siteRoot, "src/lib/tools", `${slug}.ts`)), `${slug} lib`).toBe(true);
      expect(existsSync(path.join(siteRoot, "src/lib/tools", `${slug}.test.ts`)), `${slug} lib test`).toBe(true);
      expect(existsSync(path.join(siteRoot, "src/app/[locale]/tools", slug, "page.tsx")), `${slug} route`).toBe(true);
      expect(existsSync(path.join(siteRoot, "src/app/[locale]/tools", slug, `${slug}-workspace.tsx`)), `${slug} workspace`).toBe(true);
      expect(existsSync(path.join(siteRoot, "src/app/[locale]/tools", slug, `${slug}-workspace.test.tsx`)), `${slug} workspace test`).toBe(true);
    }
  });

  it("adds workspace message namespaces to every staged locale bundle", () => {
    for (const [locale, messages] of Object.entries(stagedMessages)) {
      const tools = (messages as { tools: Record<string, { workspace?: Record<string, unknown> }> }).tools;

      for (const slug of [...w20BkPromptDataNativeSlugs, ...w20BkToolarsNativePromptDataSlugs]) {
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
