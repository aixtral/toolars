import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createToolInventoryAudit } from "./audit-tool-inventory.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");
const sourceRoots = {
  vitalcalcRoot: path.resolve(repoRoot, "../aixtral-calm/vitalcalc"),
  aixtralLabRoot: path.resolve(repoRoot, "../aixtral-lab")
};

const aixtralBatch2Slugs = [
  "csv-to-json",
  "json-to-csv",
  "json-diff",
  "yaml-validator",
  "xml-formatter",
  "markdown-to-json",
  "diff-checker",
  "text-diff"
];

const aixtralBatch3Slugs = [
  "url-parser",
  "number-base-converter",
  "file-size-converter",
  "chmod-calculator",
  "ipv4-subnet-calculator",
  "timestamp-converter",
  "user-agent-parser"
];

const aixtralBatch4Slugs = [
  "color-converter",
  "color-contrast-checker",
  "color-palette-generator",
  "css-border-radius-generator",
  "css-flexbox-generator",
  "css-grid-generator",
  "css-unit-converter"
];

const aixtralBatch5Slugs = [
  "hash-generator",
  "jwt-decoder",
  "password-generator",
  "regex-tester",
  "sql-formatter",
  "toml-converter",
  "unicode-search"
];

const wave19WebDevSourceBackedSlugs = ["hash-generator", "jwt-decoder", "password-generator", "regex-tester"];
const wave19WebDevToolarsNativeSlugs = ["nanoid-generator", "json-path-tester"];
const toolarsNativeAiDeveloperSupplementSlugs = ["json-formatter", "synthetic-dataset-generator"];
const wave19ColorCssSourceBackedSlugs = [
  "color-converter",
  "color-contrast-checker",
  "color-palette-generator",
  "css-border-radius-generator",
  "css-gradient-generator"
];
const wave19ColorCssToolarsNativeSlugs = ["css-box-shadow-generator"];
const wave19PdfImageMediaToolarsSlugs = ["pdf-merger", "pdf-compressor", "pdf-to-word", "extract-tables", "ocr-scanner"];
const wave19PdfImageMediaAixtralToolarsNativeSlugs = ["barcode-generator", "qr-code-generator"];
const wave20FrontendMediaSourceBackedSlugs = [
  "css-flexbox-generator",
  "css-grid-generator",
  "css-to-tailwind-converter",
  "css-unit-converter",
  "base64-image-encoder",
  "meta-tag-generator",
  "robots-txt-generator"
];
const wave20FrontendMediaToolarsNativeSlugs = [
  "css-animation-generator",
  "code-to-image",
  "image-resizer",
  "svg-optimizer"
];
const wave20BhPdfNativeToolarsSlugs = ["ai-pdf-summarizer", "pdf-password-remover", "pdf-signer", "pdf-translator"];
const w20BdAiSafetySourceBackedSlugs = [
  "ai-guardrail-config",
  "hallucination-checker",
  "pii-scanner",
  "red-team-simulator",
  "toxicity-scanner"
];
const w20BdAiSafetyToolarsNativeSlugs = ["certificate-decoder", "jailbreak-detector"];
const w20BfDeveloperUtilitySourceBackedSlugs = [
  "code-minifier",
  "cron-explainer",
  "docker-compose-converter",
  "env-editor",
  "html-preview",
  "http-status-reference",
  "schema-validator",
  "sql-formatter",
  "toml-converter",
  "unicode-search"
];
const w20BfDeveloperUtilityToolarsNativeSlugs = [
  "cron-builder",
  "html-markdown-converter",
  "json-schema-builder",
  "json-tree-viewer",
  "mime-lookup"
];

const aixtralBatch6Slugs = [
  "code-minifier",
  "cron-explainer",
  "css-to-tailwind-converter",
  "docker-compose-converter",
  "env-editor",
  "meta-tag-generator",
  "robots-txt-generator"
];

const aixtralBatch7Slugs = [
  "barcode-generator",
  "base64-image-encoder",
  "certificate-decoder",
  "cron-builder",
  "http-status-reference",
  "mime-lookup",
  "nanoid-generator",
  "qr-code-generator"
];

const aixtralBatch8Slugs = [
  "html-markdown-converter",
  "html-preview",
  "image-resizer",
  "json-schema-builder",
  "markdown-table-generator",
  "mock-data-generator",
  "svg-optimizer"
];

const aixtralBatch9Slugs = [
  "ai-guardrail-config",
  "code-to-image",
  "css-animation-generator",
  "css-box-shadow-generator",
  "embedding-playground",
  "jailbreak-detector",
  "rag-chunk-visualizer",
  "red-team-simulator",
  "synthetic-dataset-gen",
  "system-prompt-compressor",
  "system-prompt-guard",
  "token-counter",
  "toxicity-scanner"
];

describe("tool inventory audit", () => {
  it("can retain Toolars launch coverage when an explicitly optional migration source is absent", async () => {
    const audit = await createToolInventoryAudit({
      siteRoot,
      aixtralLabRoot: "/tmp/toolars-missing-aixtral-lab",
      allowMissingMigrationSources: true,
      vitalcalcRoot: "/tmp/toolars-missing-vitalcalc"
    });

    expect(audit.summary.toolars).toMatchObject({
      launchCertifiedTools: 55,
      publicUncertifiedTools: 0
    });
    expect(audit.summary.sources.aixtralLab.configTools).toBe(0);
  });
  it("reports the current Toolars registry and source-project coverage", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });

    expect(audit.summary.toolars.registryTools).toBe(190);
    expect(audit.summary.toolars.registryBySource).toEqual({
      "aixtral-lab": 92,
      toolars: 12,
      vitalcalc: 86
    });
    expect(audit.summary.launchReadiness).toBe("launch-scope-55");
    expect(audit.summary.toolars.registeredPublicTools).toBe(190);
    expect(audit.summary.toolars.publicTools).toBe(55);
    expect(audit.summary.toolars.launchCertifiedTools).toBe(55);
    expect(audit.summary.toolars.deferredTools).toBe(135);
    expect(audit.summary.toolars.publicUncertifiedTools).toBe(0);
    expect(audit.summary.sources.vitalcalc.rootToolPages).toBe(86);
    expect(audit.summary.sources.aixtralLab.configTools).toBe(92);
    expect(audit.summary.sources.aixtralLab.implementedTools).toBe(66);
  });

  it("keeps deferred tools outside the public launch inventory", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });
    const bySlug = new Map(audit.entries.map((entry) => [entry.slug, entry]));

    expect(audit.gaps.toolars.publicUncertifiedTools).toEqual([]);
    expect(audit.gaps.toolars.deferredTools).toHaveLength(135);
    expect(audit.gaps.toolars.deferredTools).toContain("color-contrast-checker");
    expect(audit.gaps.toolars.deferredTools).not.toContain("token-counter");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("token-counter");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("json-formatter");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("jwt-decoder");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("url-encoder");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("hash-generator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("regex-tester");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("json-diff");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("csv-to-json");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("json-to-csv");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("yaml-validator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("xml-formatter");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("markdown-to-json");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("diff-checker");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("text-diff");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("url-parser");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("number-base-converter");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("file-size-converter");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("chmod-calculator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("ipv4-subnet-calculator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("user-agent-parser");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("color-converter");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("base64-image-encoder");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("case-converter");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("code-minifier");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("cron-explainer");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("docker-compose-converter");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("html-entity-encoder");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("css-gradient-generator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("css-border-radius-generator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("slug-generator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("text-stats");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("discount-calculator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("tip-calculator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("bill-split-calculator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("hourly-to-salary");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("rule-of-72");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("retirement-calculator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("roi-calculator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("apy-calculator");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("savings-goal");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("stock-average");
    expect(audit.gaps.toolars.publicUncertifiedTools).not.toContain("json-repair");
    expect(bySlug.get("json-repair")).toMatchObject({
      slug: "json-repair",
      launchCertified: true
    });
    expect(bySlug.get("token-counter")).toMatchObject({
      slug: "token-counter",
      launchCertified: true
    });
    expect(bySlug.get("json-formatter")).toMatchObject({
      slug: "json-formatter",
      launchCertified: true
    });
    expect(bySlug.get("json-diff")).toMatchObject({
      slug: "json-diff",
      launchCertified: true
    });
    expect(bySlug.get("markdown-to-json")).toMatchObject({
      slug: "markdown-to-json",
      launchCertified: true
    });
    expect(bySlug.get("file-size-converter")).toMatchObject({
      slug: "file-size-converter",
      launchCertified: true
    });
  });

  it("derives category count mismatches from real registered tools", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });

    expect(audit.summary.toolars.publicByCategory).toMatchObject({
      All: 55,
      "AI": 39,
      "AI Security": 3,
      Data: 4,
      Developer: 21,
      "Frontend & Design": 3,
      Finance: 13,
      Health: 1,
      "LLM Cost": 2,
      PDF: 1,
      Productivity: 6,
      "RAG / MCP / Agent": 1
    });
    expect(audit.gaps.categoryCountMismatches).toEqual([]);
    expect(audit.summary.gaps.categoryCountMismatches).toBe(0);
  });

  it("marks fully wired and source-missing tools separately", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });
    const bySlug = new Map(audit.entries.map((entry) => [entry.slug, entry]));

    expect(bySlug.get("json-repair")).toMatchObject({
      slug: "json-repair",
      status: "source-backed-workspace",
      coverage: {
        registry: true,
        aixtralConfig: true,
        aixtralImplementation: true,
        dedicatedRoute: true,
        dedicatedWorkspace: true,
        toolarsLib: true,
        toolarsLibTest: true,
        workspaceTest: true
      }
    });
    expect(bySlug.get("token-counter")).toMatchObject({
      slug: "token-counter",
      registrySource: "aixtral-lab",
      status: "incomplete-toolars-implementation",
      coverage: {
        registry: true,
        aixtralConfig: true,
        aixtralImplementation: false,
        dedicatedRoute: true,
        dedicatedWorkspace: true,
        toolarsLib: true,
        toolarsLibTest: true,
        workspaceTest: true
      }
    });
    expect(bySlug.get("system-prompt-compressor")).toMatchObject({
      slug: "system-prompt-compressor",
      registrySource: "aixtral-lab",
      status: "incomplete-toolars-implementation",
      coverage: {
        registry: true,
        aixtralConfig: true,
        aixtralImplementation: false,
        dedicatedRoute: true,
        dedicatedWorkspace: true,
        toolarsLib: true,
        toolarsLibTest: true,
        workspaceTest: true
      }
    });
    expect(bySlug.get("system-prompt-guard")).toMatchObject({
      slug: "system-prompt-guard",
      registrySource: "aixtral-lab",
      status: "source-backed-workspace",
      coverage: {
        registry: true,
        aixtralConfig: true,
        aixtralImplementation: true,
        dedicatedRoute: true,
        dedicatedWorkspace: true,
        toolarsLib: true,
        toolarsLibTest: true,
        workspaceTest: true
      }
    });
    for (const slug of [
      "url-encoder",
      "html-entity-encoder",
      "lorem-ipsum",
      "csv-to-json",
      "json-to-csv",
      "json-diff",
      "yaml-validator",
      "xml-formatter",
      "markdown-to-json",
      "diff-checker",
      "text-diff",
      "url-parser",
      "number-base-converter",
      "file-size-converter",
      "chmod-calculator",
      "ipv4-subnet-calculator",
      "timestamp-converter",
      "user-agent-parser",
      ...wave19WebDevSourceBackedSlugs,
      ...wave19ColorCssSourceBackedSlugs,
      ...wave20FrontendMediaSourceBackedSlugs,
      ...w20BdAiSafetySourceBackedSlugs,
      ...w20BfDeveloperUtilitySourceBackedSlugs
    ]) {
      expect(bySlug.get(slug)).toMatchObject({
        slug,
        registrySource: "aixtral-lab",
        status: "source-backed-workspace",
        coverage: {
          registry: true,
          aixtralConfig: true,
          aixtralImplementation: true,
          dedicatedRoute: true,
          dedicatedWorkspace: true,
          toolarsLib: true,
          toolarsLibTest: true,
          workspaceTest: true
        }
      });
    }

    for (const slug of [
      ...wave19WebDevToolarsNativeSlugs,
      ...wave19ColorCssToolarsNativeSlugs,
      ...wave19PdfImageMediaAixtralToolarsNativeSlugs,
      ...wave20FrontendMediaToolarsNativeSlugs,
      ...w20BdAiSafetyToolarsNativeSlugs,
      ...w20BfDeveloperUtilityToolarsNativeSlugs
    ]) {
      expect(bySlug.get(slug)).toMatchObject({
        slug,
        registrySource: "aixtral-lab",
        status: "incomplete-toolars-implementation",
        coverage: {
          registry: true,
          aixtralImplementation: false,
          dedicatedRoute: true,
          dedicatedWorkspace: true,
          toolarsLib: true,
          toolarsLibTest: true,
          workspaceTest: true
        }
      });
    }

    for (const slug of [...wave19PdfImageMediaToolarsSlugs, ...wave20BhPdfNativeToolarsSlugs]) {
      expect(bySlug.get(slug)).toMatchObject({
        slug,
        registrySource: "toolars",
        status: "source-backed-workspace",
        coverage: {
          registry: true,
          dedicatedRoute: true,
          dedicatedWorkspace: true,
          toolarsLib: true,
          toolarsLibTest: true,
          workspaceTest: true
        }
      });
    }

    for (const slug of toolarsNativeAiDeveloperSupplementSlugs) {
      expect(bySlug.get(slug)).toMatchObject({
        slug,
        registrySource: "toolars",
        status: "source-backed-workspace",
        coverage: {
          registry: true,
          dedicatedRoute: true,
          dedicatedWorkspace: true,
          toolarsLib: true,
          toolarsLibTest: true,
          workspaceTest: true
        }
      });
    }
  });

  it("surfaces public registry tools that only have generic or incomplete implementation coverage", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });

    expect(audit.gaps.toolars.publicMissingDedicatedWorkspaces).toEqual([]);
    expect(audit.gaps.toolars.publicMissingToolarsLib).toEqual([]);
    expect(audit.gaps.toolars.publicMissingToolarsLibTests).toEqual([]);
    expect(audit.gaps.toolars.publicMissingWorkspaceTests).toEqual([]);
    expect(audit.gaps.toolars.registryMissingDedicatedWorkspaces).not.toContain("pii-scanner");
    for (const slug of wave20BhPdfNativeToolarsSlugs) {
      expect(audit.gaps.toolars.registryMissingToolarsLib).not.toContain(slug);
    }
    expect(audit.gaps.toolars.registryMissingToolarsLib).not.toContain("token-counter");
    expect(audit.gaps.toolars.registryMissingToolarsLib).not.toContain("system-prompt-compressor");
    expect(audit.gaps.toolars.registryMissingToolarsLib).not.toContain("system-prompt-guard");
    for (const slug of [
      ...wave19WebDevSourceBackedSlugs,
      ...wave19WebDevToolarsNativeSlugs,
      ...wave19ColorCssSourceBackedSlugs,
      ...wave19ColorCssToolarsNativeSlugs,
      ...wave19PdfImageMediaToolarsSlugs,
      ...wave19PdfImageMediaAixtralToolarsNativeSlugs,
      ...wave20FrontendMediaSourceBackedSlugs,
      ...wave20FrontendMediaToolarsNativeSlugs,
      ...wave20BhPdfNativeToolarsSlugs,
      ...w20BdAiSafetySourceBackedSlugs,
      ...w20BdAiSafetyToolarsNativeSlugs,
      ...w20BfDeveloperUtilitySourceBackedSlugs,
      ...w20BfDeveloperUtilityToolarsNativeSlugs
    ]) {
      expect(audit.gaps.toolars.publicMissingDedicatedWorkspaces).not.toContain(slug);
      expect(audit.gaps.toolars.publicMissingToolarsLib).not.toContain(slug);
      expect(audit.gaps.toolars.publicMissingToolarsLibTests).not.toContain(slug);
      expect(audit.gaps.toolars.publicMissingWorkspaceTests).not.toContain(slug);
      expect(audit.gaps.toolars.registryMissingToolarsLib).not.toContain(slug);
    }
    expect(audit.gaps.aixtralLab.configMissingFromRegistry).toEqual([]);
    for (const slug of [
      ...aixtralBatch2Slugs,
      ...aixtralBatch3Slugs,
      ...aixtralBatch4Slugs,
      ...aixtralBatch5Slugs,
      ...aixtralBatch6Slugs,
      ...aixtralBatch7Slugs,
      ...aixtralBatch8Slugs,
      ...aixtralBatch9Slugs,
      "css-gradient-generator"
    ]) {
      expect(audit.gaps.aixtralLab.configMissingFromRegistry).not.toContain(slug);
    }
    expect(audit.gaps.aixtralLab.implementationMissingFromRegistry).not.toContain("http-status-codes");
    expect(audit.gaps.aixtralLab.implementationMissingFromConfig).not.toContain("http-status-codes");
    expect(audit.gaps.aixtralLab.configWithoutImplementation).not.toContain("http-status-reference");
    expect(audit.gaps.aixtralLab.registryMissingFromConfig).not.toContain("json-formatter");
    expect(audit.gaps.aixtralLab.registryMissingFromConfig).not.toContain("synthetic-dataset-generator");
  });

  it("reports source-migration blog, locale, and i18n audit gates", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });

    expect(audit.sources.aixtralLab.configTools).toBe(92);
    expect(audit.sources.vitalcalc.blogByLocale.en).toHaveLength(20);
    expect(audit.sources.vitalcalc.blogByLocale["zh-hant"]).toHaveLength(20);
    expect(audit.sources.vitalcalc.blogSlugs).toEqual(
      expect.arrayContaining(["what-is-bmi", "what-is-roi", "tdee-guide"])
    );
    expect(audit.sources.toolars.blogSlugs).toEqual(expect.arrayContaining(["json-repair-guide"]));
    expect(audit.sources.toolars.blogSlugs).toEqual(expect.arrayContaining(audit.sources.vitalcalc.blogSlugs));
    expect(audit.gaps.blog.missingVitalcalcSlugs).toEqual([]);
    expect(audit.gaps.blog.missingVitalcalcSlugs).toEqual(
      audit.sources.vitalcalc.blogSlugs.filter((slug) => !audit.sources.toolars.blogSlugs.includes(slug))
    );

    expect(audit.sources.locales).toMatchObject({
      aixtralMessages: ["ar", "en", "es", "fr", "hi", "ja", "pt", "ru", "zh-hans", "zh-hant"],
      vitalcalcPages: ["ar", "en", "es", "fr", "hi", "ja", "pt", "ru", "zh-hant"],
      toolarsLocales: ["ar", "en", "es", "fr", "hi", "ja", "pt", "ru", "zh-hans", "zh-hant"],
      toolarsLaunchLocales: ["en", "es", "zh-hans", "zh-hant"],
      toolarsDraftLocales: ["ar", "fr", "hi", "ja", "pt", "ru"],
      sourceLocales: ["ar", "en", "es", "fr", "hi", "ja", "pt", "ru", "zh-hans", "zh-hant"]
    });
    expect(audit.sources.locales.toolarsMessages).toEqual(
      expect.arrayContaining(["en", "es", "fr", "hi", "ja", "pt", "ru", "zh-hans", "zh-hant"])
    );
    expect(audit.gaps.locales.missingRegisteredLocales).toEqual([]);
    expect(audit.gaps.locales.missingLaunchLocales).toEqual(["ar", "fr", "hi", "ja", "pt", "ru"]);
    expect(audit.gaps.locales.toolarsLocalesMissingMessages).not.toContain("fr");
    expect(audit.gaps.locales.toolarsLocalesMissingMessages).not.toContain("hi");
    expect(audit.gaps.locales.toolarsLocalesMissingMessages).not.toContain("ja");
    expect(audit.gaps.locales.toolarsLocalesMissingMessages).not.toContain("pt");
    expect(audit.gaps.locales.toolarsLocalesMissingMessages).not.toContain("ru");
    expect(audit.gaps.i18n.hardcodedUserFacingStrings).toMatchObject({
      scanner: "typescript-jsx-text-v1",
      count: 0,
      scannedFiles: expect.any(Number),
      files: []
    });
    expect(audit.gaps.i18n.hardcodedUserFacingStrings.scannedFiles).toBeGreaterThan(0);
  });
});
