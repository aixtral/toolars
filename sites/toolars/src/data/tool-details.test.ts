import { describe, expect, it } from "vitest";
import {
  aixtralBatch1DetailSlugs,
  aixtralBatch3DetailSlugs,
  aixtralBatch4DetailSlugs,
  aixtralBatch5DetailSlugs,
  aixtralBatch6DetailSlugs,
  aixtralBatch7DetailSlugs,
  aixtralBatch8DetailSlugs,
  aixtralBatch9DetailSlugs,
  getAllToolDetails,
  getToolDetailBySlug,
  labDetailSlugs,
  pdfNativeDetailSlugs,
  vitalCalcDetailSlugs
} from "./tool-details";

const aixtralBatch2DetailSlugs = [
  "csv-to-json",
  "json-to-csv",
  "json-diff",
  "yaml-validator",
  "xml-formatter",
  "markdown-to-json",
  "diff-checker",
  "text-diff"
] as const;

const aixtralBatch2PromotedDetailSlugs = [
  "csv-to-json",
  "json-to-csv",
  "json-diff",
  "yaml-validator",
  "xml-formatter",
  "markdown-to-json",
  "diff-checker",
  "text-diff"
] as const;

const aixtralBatch2DetailOnlySlugs = [] as const;

const aixtralBatch1PromotedDetailSlugs = [
  "base64-converter",
  "case-converter",
  "slug-generator",
  "text-stats",
  "uuid-generator",
  "url-encoder",
  "html-entity-encoder",
  "lorem-ipsum"
] as const;

const aixtralBatch1DetailOnlySlugs = [] as const;

const aixtralBatch5PromotedDetailSlugs = [
  "hash-generator",
  "jwt-decoder",
  "password-generator",
  "regex-tester",
  "sql-formatter",
  "toml-converter",
  "unicode-search"
] as const;
const aixtralBatch5DetailOnlySlugs = [] as const;

const aixtralBatch4PromotedDetailSlugs = [
  "color-converter",
  "color-contrast-checker",
  "color-palette-generator",
  "css-gradient-generator",
  "css-border-radius-generator",
  "css-flexbox-generator",
  "css-grid-generator",
  "css-unit-converter"
] as const;
const aixtralBatch4DetailOnlySlugs = [] as const;

const aixtralBatch6PromotedDetailSlugs = [
  "code-minifier",
  "cron-explainer",
  "css-to-tailwind-converter",
  "docker-compose-converter",
  "env-editor",
  "meta-tag-generator",
  "robots-txt-generator"
] as const;
const aixtralBatch6DetailOnlySlugs = [] as const;

const aixtralBatch7PromotedDetailSlugs = [
  "barcode-generator",
  "base64-image-encoder",
  "certificate-decoder",
  "cron-builder",
  "http-status-reference",
  "mime-lookup",
  "nanoid-generator",
  "qr-code-generator"
] as const;
const aixtralBatch7DetailOnlySlugs = [] as const;

const aixtralBatch8PromotedDetailSlugs = [
  "html-markdown-converter",
  "html-preview",
  "image-resizer",
  "json-schema-builder",
  "markdown-table-generator",
  "mock-data-generator",
  "svg-optimizer"
] as const;
const aixtralBatch8DetailOnlySlugs = [] as const;

const aixtralBatch9PromotedDetailSlugs = [
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
] as const;

const w20BdAiSafetyNativeDetailSlugs = [
  "ai-guardrail-config",
  "hallucination-checker",
  "jailbreak-detector",
  "pii-scanner",
  "red-team-simulator",
  "toxicity-scanner",
  "certificate-decoder"
] as const;

const w20BfDeveloperUtilityNativeDetailSlugs = [
  "code-minifier",
  "cron-builder",
  "cron-explainer",
  "docker-compose-converter",
  "env-editor",
  "html-markdown-converter",
  "html-preview",
  "http-status-reference",
  "json-schema-builder",
  "mime-lookup",
  "sql-formatter",
  "toml-converter",
  "unicode-search"
] as const;

const w20BkPromptDataNativeDetailSlugs = [
  "function-call-builder",
  "prompt-templates",
  "structured-output-formatter",
  "vision-prompt-builder",
  "markdown-table-generator",
  "mock-data-generator",
  "synthetic-dataset-gen",
  "synthetic-dataset-generator"
] as const;

const wave19WebDevNativeDetailSlugs = ["json-formatter", "json-path-tester"] as const;
const toolarsNativeDetailSlugs = new Set(["json-formatter", "synthetic-dataset-generator"]);

describe("AI Developer Lab tool details", () => {
  it("defines public detail data for the designed Toolars and lab tools", () => {
    expect(labDetailSlugs).toEqual([
      "pdf-toolkit",
      "json-repair",
      "prompt-injection-scanner",
      "llm-cost-calculator",
      "mcp-server-builder"
    ]);

    const collectionBySlug = new Map([
      ["pdf-toolkit", "pdf-ops-kit"],
      ["json-repair", "ai-developer-lab"],
      ["prompt-injection-scanner", "ai-developer-lab"],
      ["llm-cost-calculator", "ai-developer-lab"],
      ["mcp-server-builder", "ai-developer-lab"]
    ]);

    for (const slug of labDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.includedCollections.map((item) => item.slug)).toContain(collectionBySlug.get(slug));
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(3);
      expect(detail?.recommendedWorkflow).toBeDefined();
    }
  });

  it("defines public detail data for native PDF media workspaces", () => {
    expect(pdfNativeDetailSlugs).toEqual([
      "ai-pdf-summarizer",
      "pdf-merger",
      "pdf-compressor",
      "pdf-to-word",
      "extract-tables",
      "pdf-password-remover",
      "pdf-signer",
      "ocr-scanner",
      "pdf-translator"
    ]);

    for (const slug of pdfNativeDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("toolars");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview).toMatch(/trust boundary|local/i);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.rows.map((row) => row.badge)).toContain("Local-first");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
    }
  });

  it("keeps detail-specific trust sections and workflow handoffs", () => {
    const pdfDetail = getToolDetailBySlug("pdf-toolkit");
    const jsonDetail = getToolDetailBySlug("json-repair");
    const promptDetail = getToolDetailBySlug("prompt-injection-scanner");
    const costDetail = getToolDetailBySlug("llm-cost-calculator");
    const mcpDetail = getToolDetailBySlug("mcp-server-builder");

    expect(pdfDetail?.trustSection.title).toBe("PDF processing model");
    expect(pdfDetail?.recommendedWorkflow?.href).toBe("/workflows/pdf-summary");
    expect(jsonDetail?.trustSection.title).toBe("Local repair model");
    expect(jsonDetail?.recommendedWorkflow?.href).toBe("/workflows/ai-prompt-hardening");
    expect(promptDetail?.trustSection.title).toBe("Privacy and review model");
    expect(promptDetail?.recommendedWorkflow?.href).toBe("/workflows/ai-prompt-hardening");
    expect(costDetail?.trustSection.title).toBe("Pricing and limits");
    expect(costDetail?.recommendedWorkflow?.href).toBe("/workflows/llm-cost-review");
    expect(mcpDetail?.trustSection.title).toBe("Security and launch review");
    expect(mcpDetail?.recommendedWorkflow?.href).toBe("/workflows/mcp-tool-launch");
  });

  it("defines promoted native detail data for Aixtral Batch 1", () => {
    expect(aixtralBatch1DetailSlugs).toEqual([...aixtralBatch1PromotedDetailSlugs, ...aixtralBatch1DetailOnlySlugs]);

    for (const slug of aixtralBatch1PromotedDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe(toolarsNativeDetailSlugs.has(slug) ? "toolars" : "aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
    }

    expect(aixtralBatch1DetailOnlySlugs).toEqual([]);
  });

  it("defines native detail data for promoted Aixtral Batch 2 data formatters", () => {
    const detailSlugs = getAllToolDetails().map((detail) => detail.tool.slug);

    expect(detailSlugs).toEqual(expect.arrayContaining([...aixtralBatch2DetailSlugs]));

    for (const slug of aixtralBatch2PromotedDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe(toolarsNativeDetailSlugs.has(slug) ? "toolars" : "aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
    }
  });

  it("keeps no Aixtral Batch 2 data formatter or diff tools as detail-only lab inventory", () => {
    expect(aixtralBatch2DetailOnlySlugs).toEqual([]);

    for (const slug of aixtralBatch2DetailOnlySlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("planned");
      expect(detail?.tool.visibility).toBe("hidden");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Detail", "Local", "Hidden"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Detail-only migration model");
      expect(detail?.trustSection.rows.map((row) => row.badge)).toEqual(
        expect.arrayContaining(["Hidden", "Local source", "No dead link"])
      );
      expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines native detail data for promoted Aixtral Batch 3 developer utilities", () => {
    expect(aixtralBatch3DetailSlugs).toEqual([
      "url-parser",
      "number-base-converter",
      "file-size-converter",
      "chmod-calculator",
      "ipv4-subnet-calculator",
      "timestamp-converter",
      "user-agent-parser"
    ]);

    for (const slug of aixtralBatch3DetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
    }
  });

  it("defines native detail data for promoted Aixtral Batch 4 color and CSS utilities", () => {
    expect(aixtralBatch4DetailSlugs).toEqual([
      "color-converter",
      "color-contrast-checker",
      "color-palette-generator",
      "css-gradient-generator",
      "css-border-radius-generator",
      "css-flexbox-generator",
      "css-grid-generator",
      "css-unit-converter"
    ]);

    for (const slug of aixtralBatch4PromotedDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
    }
  });

  it("keeps remaining Aixtral Batch 4 layout utilities as detail-only lab inventory", () => {
    for (const slug of aixtralBatch4DetailOnlySlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("planned");
      expect(detail?.tool.visibility).toBe("hidden");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Detail", "Local", "Hidden"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines native detail data for promoted Aixtral Batch 5 developer security and text utilities", () => {
    expect(aixtralBatch5DetailSlugs).toEqual([
      "hash-generator",
      "jwt-decoder",
      "password-generator",
      "regex-tester",
      "sql-formatter",
      "toml-converter",
      "unicode-search"
    ]);

    for (const slug of aixtralBatch5PromotedDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
    }
  });

  it("keeps remaining Aixtral Batch 5 utilities as detail-only lab inventory", () => {
    for (const slug of aixtralBatch5DetailOnlySlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("planned");
      expect(detail?.tool.visibility).toBe("hidden");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Detail", "Local", "Hidden"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines native detail data for Wave 19 JSON workspace utilities", () => {
    const detailSlugs = getAllToolDetails().map((detail) => detail.tool.slug);

    expect(detailSlugs).toEqual(expect.arrayContaining([...wave19WebDevNativeDetailSlugs]));

    for (const slug of wave19WebDevNativeDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe(toolarsNativeDetailSlugs.has(slug) ? "toolars" : "aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
    }
  });

  it("defines native detail data for promoted Aixtral Batch 6 frontend utilities", () => {
    expect(aixtralBatch6DetailSlugs).toEqual([
      "code-minifier",
      "cron-explainer",
      "css-to-tailwind-converter",
      "docker-compose-converter",
      "env-editor",
      "meta-tag-generator",
      "robots-txt-generator"
    ]);

    for (const slug of aixtralBatch6PromotedDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
    }
  });

  it("keeps remaining Aixtral Batch 6 utilities as detail-only lab inventory", () => {
    for (const slug of aixtralBatch6DetailOnlySlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("planned");
      expect(detail?.tool.visibility).toBe("hidden");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Detail", "Local", "Hidden"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines native detail data for promoted Aixtral Batch 7 generator utilities", () => {
    expect(aixtralBatch7DetailSlugs).toEqual([
      "barcode-generator",
      "base64-image-encoder",
      "certificate-decoder",
      "cron-builder",
      "http-status-reference",
      "mime-lookup",
      "nanoid-generator",
      "qr-code-generator"
    ]);

    for (const slug of aixtralBatch7PromotedDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
    }
  });

  it("keeps remaining Aixtral Batch 7 utilities as detail-only lab inventory", () => {
    for (const slug of aixtralBatch7DetailOnlySlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("planned");
      expect(detail?.tool.visibility).toBe("hidden");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Detail", "Local", "Hidden"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines native detail data for promoted Aixtral Batch 8 media utilities", () => {
    expect(aixtralBatch8DetailSlugs).toEqual([
      "html-markdown-converter",
      "html-preview",
      "image-resizer",
      "json-schema-builder",
      "markdown-table-generator",
      "mock-data-generator",
      "svg-optimizer"
    ]);

    for (const slug of aixtralBatch8PromotedDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
    }
  });

  it("keeps remaining Aixtral Batch 8 utilities as detail-only lab inventory", () => {
    for (const slug of aixtralBatch8DetailOnlySlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("planned");
      expect(detail?.tool.visibility).toBe("hidden");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Detail", "Local", "Hidden"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines native detail data for promoted Aixtral Batch 9 visual and prompt utilities", () => {
    expect(aixtralBatch9DetailSlugs).toEqual([
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
    ]);

    for (const slug of aixtralBatch9PromotedDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
    }
  });

  it("keeps remaining Aixtral Batch 9 AI safety utilities as detail-only lab inventory", () => {
    for (const slug of aixtralBatch9DetailSlugs.filter((item) => !aixtralBatch9PromotedDetailSlugs.includes(item as (typeof aixtralBatch9PromotedDetailSlugs)[number]))) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("planned");
      expect(detail?.tool.visibility).toBe("hidden");
      expect(detail?.summary.length).toBeGreaterThan(40);
      expect(detail?.overview.length).toBeGreaterThan(120);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Detail", "Local", "Hidden"]));
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.outcome.length).toBeGreaterThan(20);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines public detail data for the native CSS Box Shadow workspace", () => {
    const detail = getToolDetailBySlug("css-box-shadow-generator");

    expect(detail?.tool.slug).toBe("css-box-shadow-generator");
    expect(detail?.tool.source).toBe("aixtral-lab");
    expect(detail?.tool.status).toBe("ready");
    expect(detail?.tool.visibility).toBe("public");
    expect(detail?.workspaceHref).toBe("/tools/css-box-shadow-generator");
    expect(detail?.listingBadge?.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
    expect(detail?.trustSection.title).toBe("Local CSS shadow model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });

  it("defines public detail data for the native Token Counter workspace", () => {
    const detail = getToolDetailBySlug("token-counter");

    expect(detail?.tool.slug).toBe("token-counter");
    expect(detail?.tool.source).toBe("aixtral-lab");
    expect(detail?.tool.status).toBe("ready");
    expect(detail?.tool.visibility).toBe("public");
    expect(detail?.workspaceHref).toBe("/tools/token-counter");
    expect(detail?.summary.length).toBeGreaterThan(40);
    expect(detail?.overview.length).toBeGreaterThan(120);
    expect(detail?.metrics).toHaveLength(4);
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
    expect(detail?.howItWorks).toHaveLength(4);
    expect(detail?.trustSection.title).toBe("Local token estimation model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
    expect(detail?.relatedTools.map((tool) => tool.slug)).toEqual(
      expect.arrayContaining(["llm-cost-calculator", "system-prompt-compressor", "rag-chunk-visualizer"])
    );
    expect(detail?.recommendedWorkflow).toBeUndefined();
  });

  it("defines public detail data for the native System Prompt Compressor workspace", () => {
    const detail = getToolDetailBySlug("system-prompt-compressor");

    expect(detail?.tool.slug).toBe("system-prompt-compressor");
    expect(detail?.tool.source).toBe("aixtral-lab");
    expect(detail?.tool.status).toBe("ready");
    expect(detail?.tool.visibility).toBe("public");
    expect(detail?.workspaceHref).toBe("/tools/system-prompt-compressor");
    expect(detail?.summary.length).toBeGreaterThan(40);
    expect(detail?.overview.length).toBeGreaterThan(120);
    expect(detail?.metrics).toHaveLength(4);
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
    expect(detail?.howItWorks).toHaveLength(4);
    expect(detail?.trustSection.title).toBe("Local prompt compression model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
    expect(detail?.relatedTools.map((tool) => tool.slug)).toEqual(
      expect.arrayContaining(["token-counter", "system-prompt-guard", "prompt-templates"])
    );
    expect(detail?.recommendedWorkflow).toBeUndefined();
  });

  it("defines public detail data for the native System Prompt Guard workspace", () => {
    const detail = getToolDetailBySlug("system-prompt-guard");

    expect(detail?.tool.slug).toBe("system-prompt-guard");
    expect(detail?.tool.source).toBe("aixtral-lab");
    expect(detail?.tool.status).toBe("ready");
    expect(detail?.tool.visibility).toBe("public");
    expect(detail?.workspaceHref).toBe("/tools/system-prompt-guard");
    expect(detail?.summary.length).toBeGreaterThan(40);
    expect(detail?.overview.length).toBeGreaterThan(120);
    expect(detail?.metrics).toHaveLength(4);
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
    expect(detail?.howItWorks).toHaveLength(4);
    expect(detail?.trustSection.title).toBe("Local system prompt guard model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Aixtral source");
    expect(detail?.relatedTools.map((tool) => tool.slug)).toEqual(
      expect.arrayContaining(["ai-guardrail-config", "prompt-injection-scanner", "system-prompt-compressor"])
    );
    expect(detail?.recommendedWorkflow).toBeUndefined();
  });

  it("defines public native detail data for W20-BD AI safety tools", () => {
    for (const slug of w20BdAiSafetyNativeDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines public native detail data for W20-BF developer utility tools", () => {
    for (const slug of w20BfDeveloperUtilityNativeDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines public native detail data for W20-BK prompt and data tools", () => {
    for (const slug of w20BkPromptDataNativeDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe(toolarsNativeDetailSlugs.has(slug) ? "toolars" : "aixtral-lab");
      expect(detail?.tool.status).toBe("ready");
      expect(detail?.tool.visibility).toBe("public");
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.listingBadge?.badge).toBe("Native workspace");
      expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public"]));
      expect(detail?.trustSection.rows.map((row) => row.badge)).toEqual(expect.arrayContaining(["Local", "Review", "Public"]));
      expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines public detail data for featured VitalCalc tools", () => {
    const detailSlugs = getAllToolDetails().map((detail) => detail.tool.slug);

    expect(detailSlugs).toEqual(
      expect.arrayContaining(["mortgage-calculator", "bmi-calculator", "loan-calculator"])
    );

    for (const slug of ["mortgage-calculator", "bmi-calculator", "loan-calculator"]) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.tool.pricing).toBe("free");
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the second VitalCalc batch", () => {
    const secondBatch = [
      "retirement-calculator",
      "debt-payoff",
      "roi-calculator",
      "tdee-calculator",
      "body-fat-calculator",
      "protein-calculator"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(secondBatch));

    for (const slug of secondBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines public detail data for VitalCalc tools referenced by existing related cards", () => {
    const relatedCoverage = ["compound-interest", "bmr-calculator", "water-intake"];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(relatedCoverage));

    for (const slug of relatedCoverage) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the third VitalCalc batch", () => {
    const thirdBatch = [
      "income-tax",
      "fire-calculator",
      "discount-calculator",
      "heart-rate-zone",
      "sleep-calculator",
      "ideal-weight-calculator"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(thirdBatch));

    for (const slug of thirdBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the fourth VitalCalc batch", () => {
    const fourthBatch = [
      "car-loan",
      "rent-vs-buy",
      "home-affordability-calculator",
      "waist-hip-ratio",
      "blood-pressure",
      "child-growth"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(fourthBatch));

    for (const slug of fourthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the fifth VitalCalc batch", () => {
    const fifthBatch = [
      "student-loan-calculator",
      "apy-calculator",
      "rule-of-72",
      "calorie-deficit",
      "macro-calculator",
      "lean-body-mass"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(fifthBatch));

    for (const slug of fifthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the sixth VitalCalc batch", () => {
    const sixthBatch = [
      "emergency-fund",
      "savings-goal",
      "dti-calculator",
      "net-worth-calculator",
      "budget-rule",
      "side-income-tax"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(sixthBatch));

    for (const slug of sixthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the seventh VitalCalc batch", () => {
    const seventhBatch = [
      "intermittent-fasting",
      "creatine-calculator",
      "vo2-max",
      "biological-age",
      "glycemic-load",
      "30-30-30-method"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(seventhBatch));

    for (const slug of seventhBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the eighth VitalCalc batch", () => {
    const eighthBatch = [
      "tip-calculator",
      "bill-split-calculator",
      "unit-converter",
      "hourly-to-salary",
      "inflation-calculator",
      "habit-cost"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(eighthBatch));

    for (const slug of eighthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the ninth VitalCalc batch", () => {
    const ninthBatch = [
      "caffeine-calculator",
      "alcohol-metabolism",
      "blood-sugar-calculator",
      "drink-calories",
      "fiber-intake",
      "steps-to-calories"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(ninthBatch));

    for (const slug of ninthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the tenth VitalCalc batch", () => {
    const tenthBatch = [
      "currency-converter",
      "percentage-calculator",
      "stock-average",
      "credit-card-apr",
      "investment-fee",
      "investment-goal"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(tenthBatch));

    for (const slug of tenthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the eleventh VitalCalc batch", () => {
    const eleventhBatch = [
      "credit-score-simulator",
      "crypto-tax",
      "freelance-rate",
      "subscription-audit",
      "savings-challenge",
      "city-cost-comparison"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(eleventhBatch));

    for (const slug of eleventhBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the twelfth VitalCalc batch", () => {
    const twelfthBatch = [
      "social-insurance-calculator",
      "dividend-reinvestment",
      "mortgage-refinance-calculator",
      "coast-fire",
      "sip-calculator",
      "smoke-free"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(twelfthBatch));

    for (const slug of twelfthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the thirteenth VitalCalc screening batch", () => {
    const thirteenthBatch = [
      "adhd-screener",
      "burnout-assessment",
      "gad7-anxiety",
      "phq9-depression",
      "pss10-stress",
      "glp1-eligibility"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(thirteenthBatch));

    for (const slug of thirteenthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the final VitalCalc source batch", () => {
    const finalBatch = [
      "body-recomposition",
      "glp1-nutrition",
      "homa-ir",
      "one-rep-max",
      "ovulation-calculator",
      "pregnancy-due-date",
      "running-pace",
      "testosterone-calculator"
    ];

    expect(vitalCalcDetailSlugs).toHaveLength(86);
    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(finalBatch));

    for (const slug of finalBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("keeps VitalCalc related tool cards within implemented public detail pages", () => {
    const detailSlugs = getAllToolDetails()
      .filter((detail) => detail.tool.source === "vitalcalc")
      .map((detail) => detail.tool.slug);

    for (const slug of detailSlugs) {
      const detail = getToolDetailBySlug(slug);
      const missingRelatedDetails = detail?.relatedTools
        .filter((tool) => tool.source === "vitalcalc")
        .filter((tool) => !getToolDetailBySlug(tool.slug))
        .map((tool) => tool.slug);

      expect(missingRelatedDetails).toEqual([]);
    }
  });

  it("returns undefined for tools without a designed public detail page", () => {
    expect(getToolDetailBySlug("missing-tool")).toBeUndefined();
  });
});
