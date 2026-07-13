import { describe, expect, it } from "vitest";
import {
  aiDeveloperLabTools,
  categories,
  collections,
  launchCertifiedTools,
  publicTools,
  sourceInventory,
  tools,
  workflows,
  getCategoryHref,
  getCategoryLabelBySlug,
  getCategorySlug,
  getLaunchCertifiedToolsByCategory,
  getPublicToolsByCategory,
  getToolsByGroup
} from "./registry";

const aixtralBatch1PromotedSlugs = [
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

const aixtralBatch1Slugs = [...aixtralBatch1PromotedSlugs, ...aixtralBatch1DetailOnlySlugs] as const;

const aixtralBatch2Slugs = [
  "csv-to-json",
  "json-to-csv",
  "json-diff",
  "yaml-validator",
  "xml-formatter",
  "markdown-to-json",
  "diff-checker",
  "text-diff"
] as const;

const aixtralBatch2PromotedSlugs = [
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

const aixtralBatch3Slugs = [
  "url-parser",
  "number-base-converter",
  "file-size-converter",
  "chmod-calculator",
  "ipv4-subnet-calculator",
  "timestamp-converter",
  "user-agent-parser"
] as const;

const aixtralBatch4Slugs = [
  "color-converter",
  "color-contrast-checker",
  "color-palette-generator",
  "css-border-radius-generator",
  "css-flexbox-generator",
  "css-grid-generator",
  "css-unit-converter"
] as const;

const aixtralBatch4PromotedSlugs = [
  "color-converter",
  "color-contrast-checker",
  "color-palette-generator",
  "css-border-radius-generator",
  "css-flexbox-generator",
  "css-grid-generator",
  "css-unit-converter"
] as const;
const aixtralBatch4DetailOnlySlugs = [] as const;

const aixtralBatch5Slugs = [
  "hash-generator",
  "jwt-decoder",
  "password-generator",
  "regex-tester",
  "sql-formatter",
  "toml-converter",
  "unicode-search"
] as const;

const aixtralBatch5PromotedSlugs = [
  "hash-generator",
  "jwt-decoder",
  "password-generator",
  "regex-tester",
  "sql-formatter",
  "toml-converter",
  "unicode-search"
] as const;
const aixtralBatch5DetailOnlySlugs = [] as const;

const aixtralBatch6Slugs = [
  "code-minifier",
  "cron-explainer",
  "css-to-tailwind-converter",
  "docker-compose-converter",
  "env-editor",
  "meta-tag-generator",
  "robots-txt-generator"
] as const;
const aixtralBatch6PromotedSlugs = [
  "code-minifier",
  "cron-explainer",
  "css-to-tailwind-converter",
  "docker-compose-converter",
  "env-editor",
  "meta-tag-generator",
  "robots-txt-generator"
] as const;
const aixtralBatch6DetailOnlySlugs = [] as const;

const aixtralBatch7Slugs = [
  "barcode-generator",
  "base64-image-encoder",
  "certificate-decoder",
  "cron-builder",
  "http-status-reference",
  "mime-lookup",
  "nanoid-generator",
  "qr-code-generator"
] as const;

const aixtralBatch7PromotedSlugs = [
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

const aixtralBatch8Slugs = [
  "html-markdown-converter",
  "html-preview",
  "image-resizer",
  "json-schema-builder",
  "markdown-table-generator",
  "mock-data-generator",
  "svg-optimizer"
] as const;
const aixtralBatch8PromotedSlugs = [
  "html-markdown-converter",
  "html-preview",
  "image-resizer",
  "json-schema-builder",
  "markdown-table-generator",
  "mock-data-generator",
  "svg-optimizer"
] as const;
const aixtralBatch8DetailOnlySlugs = [] as const;

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
] as const;
const aixtralBatch9PromotedSlugs = [
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

const w20BdAiSafetyNativeSlugs = [
  "ai-guardrail-config",
  "hallucination-checker",
  "jailbreak-detector",
  "pii-scanner",
  "red-team-simulator",
  "toxicity-scanner",
  "certificate-decoder"
] as const;

const w20BfDeveloperUtilityNativeSlugs = [
  "code-minifier",
  "cron-builder",
  "cron-explainer",
  "docker-compose-converter",
  "env-editor",
  "html-markdown-converter",
  "html-preview",
  "http-status-reference",
  "json-schema-builder",
  "json-tree-viewer",
  "mime-lookup",
  "schema-validator",
  "sql-formatter",
  "toml-converter",
  "unicode-search"
] as const;

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

describe("Toolars registry", () => {
  it("contains the first representative tools from the design contract", () => {
    const slugs = tools.map((tool) => tool.slug);

    expect(slugs).toContain("pdf-toolkit");
    expect(slugs).toContain("json-repair");
    expect(slugs).toContain("prompt-injection-scanner");
    expect(slugs).toContain("llm-cost-calculator");
    expect(slugs).toContain("mcp-server-builder");
  });

  it("carries trust metadata for every registered tool", () => {
    expect(tools.length).toBeGreaterThanOrEqual(30);

    for (const tool of tools) {
      expect(typeof tool.launchCertified).toBe("boolean");
      expect(tool.type).toMatch(/traditional|ai|workflow/);
      expect(tool.processing.length).toBeGreaterThan(0);
      expect(tool.pricing).toMatch(/free|freemium|paid/);
      expect(tool.tags.length).toBeGreaterThan(0);
      expect(tool.source).toMatch(/vitalcalc|aixtral-lab|toolars/);
      expect(tool.status).toMatch(/ready|trial-ready|preview|hidden|planned/);
      expect(tool.visibility).toMatch(/public|beta|hidden/);
    }
  });

  it("separates route-visible public tools from launch-certified default surfaces", () => {
    const certifiedSlugs = launchCertifiedTools.map((tool) => tool.slug);

    expect(launchCertifiedTools).toHaveLength(55);
    expect(launchCertifiedTools.every((tool) => publicTools.includes(tool))).toBe(true);
    expect(certifiedSlugs).toEqual(
      expect.arrayContaining([
        "pdf-toolkit",
        "json-repair",
        "prompt-injection-scanner",
        "llm-cost-calculator",
        "mcp-server-builder",
        "mortgage-calculator",
        "bmi-calculator",
        "compound-interest",
        "loan-calculator",
        "unit-converter",
        "token-counter",
        "base64-converter",
        "password-generator",
        "uuid-generator",
        "timestamp-converter",
        "json-formatter",
        "jwt-decoder",
        "url-encoder",
        "hash-generator",
        "regex-tester",
        "json-diff",
        "csv-to-json",
        "json-to-csv",
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
        "user-agent-parser",
        "color-converter",
        "base64-image-encoder",
        "case-converter",
        "code-minifier",
        "cron-explainer",
        "docker-compose-converter",
        "html-entity-encoder",
        "css-gradient-generator",
        "css-border-radius-generator",
        "slug-generator",
        "text-stats",
        "discount-calculator",
        "tip-calculator",
        "bill-split-calculator",
        "hourly-to-salary",
        "rule-of-72",
        "retirement-calculator",
        "roi-calculator",
        "apy-calculator",
        "savings-goal",
        "stock-average"
      ])
    );
    expect(getLaunchCertifiedToolsByCategory("All")).toHaveLength(55);
    expect(getLaunchCertifiedToolsByCategory("AI").map((tool) => tool.slug)).toEqual(
      expect.arrayContaining([
        "json-repair",
        "prompt-injection-scanner",
        "llm-cost-calculator",
        "mcp-server-builder",
        "token-counter",
        "json-formatter",
        "jwt-decoder",
        "url-encoder",
        "hash-generator",
        "regex-tester",
        "json-diff",
        "csv-to-json",
        "json-to-csv",
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
        "user-agent-parser",
        "color-converter",
        "base64-image-encoder",
        "case-converter",
        "code-minifier",
        "cron-explainer",
        "docker-compose-converter",
        "html-entity-encoder",
        "css-gradient-generator",
        "css-border-radius-generator",
        "slug-generator",
        "text-stats"
      ])
    );
    expect(getLaunchCertifiedToolsByCategory("Developer").map((tool) => tool.slug)).toEqual(
      expect.arrayContaining([
        "base64-converter",
        "password-generator",
        "uuid-generator",
        "json-formatter",
        "url-encoder",
        "hash-generator",
        "regex-tester",
        "json-diff",
        "yaml-validator",
        "xml-formatter",
        "url-parser",
        "number-base-converter",
        "file-size-converter",
        "chmod-calculator",
        "ipv4-subnet-calculator",
        "user-agent-parser",
        "base64-image-encoder",
        "code-minifier",
        "cron-explainer",
        "docker-compose-converter",
        "html-entity-encoder"
      ])
    );
    expect(getLaunchCertifiedToolsByCategory("Frontend & Design").map((tool) => tool.slug)).toEqual(
      expect.arrayContaining(["color-converter", "css-gradient-generator", "css-border-radius-generator"])
    );
    expect(getLaunchCertifiedToolsByCategory("Data").map((tool) => tool.slug)).toEqual(
      expect.arrayContaining(["csv-to-json", "json-to-csv", "markdown-to-json"])
    );
    expect(getLaunchCertifiedToolsByCategory("Productivity").map((tool) => tool.slug)).toEqual(
      expect.arrayContaining(["case-converter", "text-stats"])
    );
    expect(getLaunchCertifiedToolsByCategory("AI Security").map((tool) => tool.slug)).toEqual(
      expect.arrayContaining(["prompt-injection-scanner", "jwt-decoder"])
    );
    expect(getLaunchCertifiedToolsByCategory("Productivity").map((tool) => tool.slug)).toEqual(
      expect.arrayContaining(["timestamp-converter", "diff-checker", "text-diff"])
    );
    expect(getLaunchCertifiedToolsByCategory("Finance").map((tool) => tool.slug)).toEqual(
      expect.arrayContaining([
        "mortgage-calculator",
        "compound-interest",
        "loan-calculator",
        "discount-calculator",
        "tip-calculator",
        "bill-split-calculator",
        "hourly-to-salary",
        "rule-of-72",
        "retirement-calculator",
        "roi-calculator",
        "apy-calculator",
        "savings-goal",
        "stock-average"
      ])
    );
  });

  it("keeps only launch-ready or trial-ready tools in the public catalog", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);

    expect(tools).toHaveLength(190);
    expect(publicTools).toHaveLength(190);
    expect(publicSlugs).toEqual(
      expect.arrayContaining([
        "pdf-toolkit",
        "ai-pdf-summarizer",
        "json-repair",
        "prompt-injection-scanner",
        "llm-cost-calculator",
        "model-comparator",
        "context-window",
        "token-budget-planner",
        "mcp-server-builder",
        "mcp-tester",
        "agent-workflow-builder",
        "rag-eval-bench",
        "base64-converter",
        "case-converter",
        "slug-generator",
        "text-stats",
        "uuid-generator",
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
        "hash-generator",
        "jwt-decoder",
        "password-generator",
        "regex-tester",
        "nanoid-generator",
        "json-formatter",
        "json-path-tester",
        "color-converter",
        "color-contrast-checker",
        "color-palette-generator",
        "css-gradient-generator",
        "css-box-shadow-generator",
        "css-border-radius-generator",
        "css-flexbox-generator",
        "css-grid-generator",
        "css-unit-converter",
        "css-to-tailwind-converter",
        "meta-tag-generator",
        "robots-txt-generator",
        "pdf-merger",
        "pdf-compressor",
        "pdf-to-word",
        "extract-tables",
        "pdf-password-remover",
        "pdf-signer",
        "ocr-scanner",
        "pdf-translator",
        "base64-image-encoder",
        "barcode-generator",
        "qr-code-generator",
        "certificate-decoder",
        "image-resizer",
        "svg-optimizer",
        "ai-guardrail-config",
        "hallucination-checker",
        "jailbreak-detector",
        "pii-scanner",
        "red-team-simulator",
        "toxicity-scanner",
        "code-to-image",
        "css-animation-generator",
        "embedding-playground",
        "rag-chunk-visualizer",
        "system-prompt-compressor",
        "system-prompt-guard",
        "token-counter",
        "function-call-builder",
        "prompt-templates",
        "structured-output-formatter",
        "vision-prompt-builder",
        "markdown-table-generator",
        "mock-data-generator",
        "synthetic-dataset-gen",
        "synthetic-dataset-generator"
      ])
    );
    expect(publicSlugs).toEqual(expect.arrayContaining(["ai-pdf-summarizer", "pdf-password-remover", "pdf-signer", "pdf-translator"]));
    expect(tools.find((tool) => tool.slug === "ai-pdf-summarizer")).toMatchObject({
      status: "ready",
      visibility: "public",
      processing: ["local", "ai-consent"]
    });
  });

  it("derives public category counts from launch-visible tools", () => {
    expect(categories[0]).toMatchObject({ label: "All", slug: "all", href: "/explore/all", count: publicTools.length });
    expect(categories).not.toEqual(expect.arrayContaining([{ label: "All", count: 2643 }]));
    expect(categories.every((category) => category.count > 0)).toBe(true);

    for (const category of categories) {
      expect(category.count).toBe(getPublicToolsByCategory(category.label).length);
    }

    expect(categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "AI", count: 94 }),
        expect.objectContaining({ label: "AI Security", count: 11 }),
        expect.objectContaining({ label: "Frontend & Design", count: 16 }),
        expect.objectContaining({ label: "Developer", count: 36 }),
        expect.objectContaining({ label: "Data", count: 9 }),
        expect.objectContaining({ label: "PDF", count: 10 }),
        expect.objectContaining({ label: "RAG / MCP / Agent", count: 6 }),
        expect.objectContaining({ label: "LLM Cost", count: 6 }),
        expect.objectContaining({ label: "Prompt Engineering", count: 4 }),
        expect.objectContaining({ label: "Finance", count: 42 }),
        expect.objectContaining({ label: "Health", count: 42 }),
        expect.objectContaining({ label: "Productivity", count: 6 }),
        expect.objectContaining({ label: "Writing", count: 2 })
      ])
    );
  });

  it("builds stable explore links for every public category", () => {
    expect(getCategorySlug("RAG / MCP / Agent")).toBe("rag-mcp-agent");
    expect(getCategoryHref("All")).toBe("/explore/all");
    expect(getCategoryHref("AI")).toBe("/explore/ai-developer");
    expect(getCategoryHref("Finance")).toBe("/explore/finance");
    expect(getCategoryLabelBySlug("llm-cost")).toBe("LLM Cost");

    expect(categories.every((category) => category.href)).toBe(true);
    expect(categories.find((category) => category.label === "AI Security")).toMatchObject({
      slug: "ai-security",
      href: "/explore/ai-security"
    });
  });

  it("keeps the AI Developer Lab as a first-class merged inventory", () => {
    const labTools = getToolsByGroup("AI Developer Lab");

    expect(labTools).toHaveLength(94);
    expect(labTools.map((tool) => tool.slug)).toContain("json-repair");
    expect(labTools.map((tool) => tool.slug)).toContain("mcp-server-builder");
    expect(aiDeveloperLabTools).toHaveLength(39);
    expect(aiDeveloperLabTools.map((tool) => tool.slug)).toEqual(expect.arrayContaining([
      "json-repair",
      "prompt-injection-scanner",
      "llm-cost-calculator",
      "mcp-server-builder",
      "token-counter",
      "base64-converter",
      "password-generator",
      "uuid-generator",
      "timestamp-converter",
      "json-formatter",
      "jwt-decoder",
      "url-encoder",
      "hash-generator",
      "regex-tester",
      "json-diff",
      "csv-to-json",
      "json-to-csv",
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
      "user-agent-parser",
      "color-converter",
      "base64-image-encoder",
      "case-converter",
      "code-minifier",
      "cron-explainer",
      "docker-compose-converter",
      "html-entity-encoder",
      "css-gradient-generator",
      "css-border-radius-generator",
      "slug-generator",
      "text-stats"
    ]));
  });

  it("registers Aixtral Batch 1 with promoted native workspaces", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);
    const registeredBatchSlugs = aixtralBatch1Slugs.filter((slug) =>
      tools.some((tool) => tool.slug === slug && tool.source === "aixtral-lab")
    );

    expect(registeredBatchSlugs).toEqual([...aixtralBatch1Slugs]);
    expect(72 - registeredBatchSlugs.length).toBe(64);

    for (const slug of aixtralBatch1PromotedSlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }

    expect(aixtralBatch1DetailOnlySlugs).toEqual([]);
  });

  it("registers Aixtral Batch 2 data formatter and diff tools with promoted native workspaces", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);
    const registeredBatchSlugs = aixtralBatch2Slugs.filter((slug) =>
      tools.some((tool) => tool.slug === slug && tool.source === "aixtral-lab")
    );

    expect(registeredBatchSlugs).toEqual([...aixtralBatch2Slugs]);
    expect(64 - registeredBatchSlugs.length).toBe(56);

    for (const slug of aixtralBatch2PromotedSlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }

    expect(aixtralBatch2DetailOnlySlugs).toEqual([]);

    for (const slug of aixtralBatch2DetailOnlySlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        source: "aixtral-lab",
        status: "planned",
        visibility: "hidden"
      });
      expect(publicSlugs).not.toContain(slug);
    }
  });

  it("registers Aixtral Batch 3 developer utilities with promoted native workspaces", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);
    const registeredBatchSlugs = aixtralBatch3Slugs.filter((slug) =>
      tools.some((tool) => tool.slug === slug && tool.source === "aixtral-lab")
    );

    expect(registeredBatchSlugs).toEqual([...aixtralBatch3Slugs]);
    expect(56 - registeredBatchSlugs.length).toBe(49);

    for (const slug of aixtralBatch3Slugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }
  });

  it("registers Aixtral Batch 4 color and CSS utilities with Wave 19 native promotions", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);
    const registeredBatchSlugs = aixtralBatch4Slugs.filter((slug) =>
      tools.some((tool) => tool.slug === slug && tool.source === "aixtral-lab")
    );

    expect(registeredBatchSlugs).toEqual([...aixtralBatch4Slugs]);
    expect(49 - registeredBatchSlugs.length).toBe(42);

    for (const slug of aixtralBatch4PromotedSlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }

    for (const slug of aixtralBatch4DetailOnlySlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "planned",
        visibility: "hidden"
      });
      expect(publicSlugs).not.toContain(slug);
    }

    expect(tools.find((item) => item.slug === "css-gradient-generator")).toMatchObject({
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public"
    });
    expect(publicSlugs).toContain("css-gradient-generator");
  });

  it("registers Aixtral Batch 5 developer security and text utilities with Wave 19 native promotions", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);
    const registeredBatchSlugs = aixtralBatch5Slugs.filter((slug) =>
      tools.some((tool) => tool.slug === slug && tool.source === "aixtral-lab")
    );

    expect(registeredBatchSlugs).toEqual([...aixtralBatch5Slugs]);
    expect(42 - registeredBatchSlugs.length).toBe(35);

    for (const slug of aixtralBatch5PromotedSlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }

    for (const slug of aixtralBatch5DetailOnlySlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "planned",
        visibility: "hidden"
      });
      expect(publicSlugs).not.toContain(slug);
    }
  });

  it("registers Aixtral Batch 6 web and config utilities with W20 native promotions", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);
    const registeredBatchSlugs = aixtralBatch6Slugs.filter((slug) =>
      tools.some((tool) => tool.slug === slug && tool.source === "aixtral-lab")
    );

    expect(registeredBatchSlugs).toEqual([...aixtralBatch6Slugs]);
    expect(35 - registeredBatchSlugs.length).toBe(28);

    for (const slug of aixtralBatch6PromotedSlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }

    for (const slug of aixtralBatch6DetailOnlySlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "planned",
        visibility: "hidden"
      });
      expect(publicSlugs).not.toContain(slug);
    }
  });

  it("registers Aixtral Batch 7 reference, encoding, and generator utilities with media generators promoted", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);
    const registeredBatchSlugs = aixtralBatch7Slugs.filter((slug) =>
      tools.some((tool) => tool.slug === slug && tool.source === "aixtral-lab")
    );

    expect(registeredBatchSlugs).toEqual([...aixtralBatch7Slugs]);
    expect(28 - registeredBatchSlugs.length).toBe(20);

    for (const slug of aixtralBatch7PromotedSlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }

    for (const slug of aixtralBatch7DetailOnlySlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "planned",
        visibility: "hidden"
      });
      expect(publicSlugs).not.toContain(slug);
    }
  });

  it("registers Aixtral Batch 8 content, preview, and schema utilities with W20 media promotions", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);
    const registeredBatchSlugs = aixtralBatch8Slugs.filter((slug) =>
      tools.some((tool) => tool.slug === slug && tool.source === "aixtral-lab")
    );

    expect(registeredBatchSlugs).toEqual([...aixtralBatch8Slugs]);
    expect(20 - registeredBatchSlugs.length).toBe(13);

    for (const slug of aixtralBatch8PromotedSlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }

    for (const slug of aixtralBatch8DetailOnlySlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "planned",
        visibility: "hidden"
      });
      expect(publicSlugs).not.toContain(slug);
    }
  });

  it("registers Aixtral Batch 9 AI safety and generation utilities with native prompt and visual tools promoted", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);
    const promotedSlugs = [...aixtralBatch9PromotedSlugs];
    const detailOnlySlugs = aixtralBatch9Slugs.filter((slug) => !promotedSlugs.includes(slug));
    const registeredBatchSlugs = aixtralBatch9Slugs.filter((slug) =>
      tools.some((tool) => tool.slug === slug && tool.source === "aixtral-lab")
    );

    expect(registeredBatchSlugs).toEqual([...aixtralBatch9Slugs]);
    expect(13 - registeredBatchSlugs.length).toBe(0);

    for (const slug of promotedSlugs) {
      expect(tools.find((item) => item.slug === slug)).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }

    for (const slug of detailOnlySlugs) {
      const tool = tools.find((item) => item.slug === slug);

      expect(tool).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "planned",
        visibility: "hidden"
      });
      expect(publicSlugs).not.toContain(slug);
    }
  });

  it("promotes W20-BD AI safety native tools across registry visibility", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);

    for (const slug of w20BdAiSafetyNativeSlugs) {
      expect(tools.find((item) => item.slug === slug)).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        pricing: "free",
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }
  });

  it("promotes W20-BF developer utility native tools across registry visibility", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);

    for (const slug of w20BfDeveloperUtilityNativeSlugs) {
      expect(tools.find((item) => item.slug === slug)).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }
  });

  it("promotes W20-BK prompt and data native tools across registry visibility", () => {
    const publicSlugs = publicTools.map((tool) => tool.slug);

    for (const slug of w20BkPromptDataNativeSlugs) {
      expect(tools.find((item) => item.slug === slug)).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "aixtral-lab",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }

    for (const slug of w20BkToolarsNativePromptDataSlugs) {
      expect(tools.find((item) => item.slug === slug)).toMatchObject({
        group: "AI Developer Lab",
        processing: ["local"],
        source: "toolars",
        status: "ready",
        visibility: "public"
      });
      expect(publicSlugs).toContain(slug);
    }
  });

  it("keeps representative VitalCalc finance and health tools in the merged inventory", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);

    expect(vitalCalcTools.length).toBeGreaterThanOrEqual(12);
    expect(slugs).toEqual(expect.arrayContaining(["mortgage-calculator", "bmi-calculator", "loan-calculator"]));
    expect(vitalCalcTools.some((tool) => tool.category === "Finance")).toBe(true);
    expect(vitalCalcTools.some((tool) => tool.category === "Health")).toBe(true);
    expect(vitalCalcTools.every((tool) => tool.processing.includes("local"))).toBe(true);
  });

  it("includes the second VitalCalc detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const secondBatch = [
      "retirement-calculator",
      "debt-payoff",
      "roi-calculator",
      "tdee-calculator",
      "body-fat-calculator",
      "protein-calculator"
    ];

    expect(slugs).toEqual(expect.arrayContaining(secondBatch));
    for (const slug of secondBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
    }
  });

  it("includes the third VitalCalc finance and health detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const thirdBatch = [
      "income-tax",
      "fire-calculator",
      "discount-calculator",
      "heart-rate-zone",
      "sleep-calculator",
      "ideal-weight-calculator"
    ];

    expect(slugs).toEqual(expect.arrayContaining(thirdBatch));
    for (const slug of thirdBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the fourth VitalCalc finance and health detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const fourthBatch = [
      "car-loan",
      "rent-vs-buy",
      "home-affordability-calculator",
      "waist-hip-ratio",
      "blood-pressure",
      "child-growth"
    ];

    expect(slugs).toEqual(expect.arrayContaining(fourthBatch));
    for (const slug of fourthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the fifth VitalCalc finance and health detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const fifthBatch = [
      "student-loan-calculator",
      "apy-calculator",
      "rule-of-72",
      "calorie-deficit",
      "macro-calculator",
      "lean-body-mass"
    ];

    expect(slugs).toEqual(expect.arrayContaining(fifthBatch));
    for (const slug of fifthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the sixth VitalCalc finance planning detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const sixthBatch = [
      "emergency-fund",
      "savings-goal",
      "dti-calculator",
      "net-worth-calculator",
      "budget-rule",
      "side-income-tax"
    ];

    expect(slugs).toEqual(expect.arrayContaining(sixthBatch));
    for (const slug of sixthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the seventh VitalCalc health and wellness detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const seventhBatch = [
      "intermittent-fasting",
      "creatine-calculator",
      "vo2-max",
      "biological-age",
      "glycemic-load",
      "30-30-30-method"
    ];

    expect(slugs).toEqual(expect.arrayContaining(seventhBatch));
    for (const slug of seventhBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the eighth VitalCalc utility and everyday finance detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const eighthBatch = [
      "tip-calculator",
      "bill-split-calculator",
      "unit-converter",
      "hourly-to-salary",
      "inflation-calculator",
      "habit-cost"
    ];

    expect(slugs).toEqual(expect.arrayContaining(eighthBatch));
    for (const slug of eighthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the ninth VitalCalc health and lifestyle detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const ninthBatch = [
      "caffeine-calculator",
      "alcohol-metabolism",
      "blood-sugar-calculator",
      "drink-calories",
      "fiber-intake",
      "steps-to-calories"
    ];

    expect(slugs).toEqual(expect.arrayContaining(ninthBatch));
    for (const slug of ninthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the tenth VitalCalc finance utility and investment detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const tenthBatch = [
      "currency-converter",
      "percentage-calculator",
      "stock-average",
      "credit-card-apr",
      "investment-fee",
      "investment-goal"
    ];

    expect(slugs).toEqual(expect.arrayContaining(tenthBatch));
    for (const slug of tenthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the eleventh VitalCalc life-money detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const eleventhBatch = [
      "credit-score-simulator",
      "crypto-tax",
      "freelance-rate",
      "subscription-audit",
      "savings-challenge",
      "city-cost-comparison"
    ];

    expect(slugs).toEqual(expect.arrayContaining(eleventhBatch));
    for (const slug of eleventhBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the twelfth VitalCalc payroll investment and lifestyle detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const twelfthBatch = [
      "social-insurance-calculator",
      "dividend-reinvestment",
      "mortgage-refinance-calculator",
      "coast-fire",
      "sip-calculator",
      "smoke-free"
    ];

    expect(slugs).toEqual(expect.arrayContaining(twelfthBatch));
    for (const slug of twelfthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the thirteenth VitalCalc screening detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const thirteenthBatch = [
      "adhd-screener",
      "burnout-assessment",
      "gad7-anxiety",
      "phq9-depression",
      "pss10-stress",
      "glp1-eligibility"
    ];

    expect(slugs).toEqual(expect.arrayContaining(thirteenthBatch));
    for (const slug of thirteenthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the final VitalCalc metabolic reproductive and performance detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
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

    expect(vitalCalcTools).toHaveLength(sourceInventory.vitalcalc.rootToolPages);
    expect(slugs).toEqual(expect.arrayContaining(finalBatch));
    for (const slug of finalBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("records current source inventory counts", () => {
    expect(sourceInventory.vitalcalc.rootToolPages).toBe(86);
    expect(sourceInventory.aixtralLab.totalTools).toBe(92);
    expect(sourceInventory.aixtralLab.categories.developerTools).toBe(37);
  });

  it("defines workflows and collections for cross-tool continuity", () => {
    expect(workflows.map((workflow) => workflow.slug)).toContain("mcp-tool-launch");
    expect(collections.map((collection) => collection.slug)).toContain("ai-developer-lab");
  });
});
