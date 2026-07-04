import {
  collections,
  getToolBySlug,
  workflows,
  type CollectionDefinition,
  type ToolDefinition,
  type WorkflowDefinition
} from "./registry";

export const labDetailSlugs = [
  "pdf-toolkit",
  "json-repair",
  "prompt-injection-scanner",
  "llm-cost-calculator",
  "mcp-server-builder"
] as const;

export const pdfNativeDetailSlugs = [
  "ai-pdf-summarizer",
  "pdf-merger",
  "pdf-compressor",
  "pdf-to-word",
  "extract-tables",
  "pdf-password-remover",
  "pdf-signer",
  "ocr-scanner",
  "pdf-translator"
] as const;

export const aixtralBatch1DetailSlugs = [
  "base64-converter",
  "case-converter",
  "slug-generator",
  "text-stats",
  "uuid-generator",
  "url-encoder",
  "html-entity-encoder",
  "lorem-ipsum"
] as const;

export const aixtralBatch2DetailSlugs = [
  "csv-to-json",
  "json-to-csv",
  "json-diff",
  "yaml-validator",
  "xml-formatter",
  "markdown-to-json",
  "diff-checker",
  "text-diff"
] as const;

export const aixtralBatch3DetailSlugs = [
  "url-parser",
  "number-base-converter",
  "file-size-converter",
  "chmod-calculator",
  "ipv4-subnet-calculator",
  "timestamp-converter",
  "user-agent-parser"
] as const;

export const aixtralBatch4DetailSlugs = [
  "color-converter",
  "color-contrast-checker",
  "color-palette-generator",
  "css-gradient-generator",
  "css-border-radius-generator",
  "css-flexbox-generator",
  "css-grid-generator",
  "css-unit-converter"
] as const;

export const aixtralBatch5DetailSlugs = [
  "hash-generator",
  "jwt-decoder",
  "password-generator",
  "regex-tester",
  "sql-formatter",
  "toml-converter",
  "unicode-search"
] as const;

export const aixtralBatch6DetailSlugs = [
  "code-minifier",
  "cron-explainer",
  "css-to-tailwind-converter",
  "docker-compose-converter",
  "env-editor",
  "meta-tag-generator",
  "robots-txt-generator"
] as const;

export const aixtralBatch7DetailSlugs = [
  "barcode-generator",
  "base64-image-encoder",
  "certificate-decoder",
  "cron-builder",
  "http-status-reference",
  "mime-lookup",
  "nanoid-generator",
  "qr-code-generator"
] as const;

export const aixtralBatch8DetailSlugs = [
  "html-markdown-converter",
  "html-preview",
  "image-resizer",
  "json-schema-builder",
  "markdown-table-generator",
  "mock-data-generator",
  "svg-optimizer"
] as const;

export const aixtralBatch9DetailSlugs = [
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

export const wave19WebDevNativeDetailSlugs = ["json-formatter", "json-path-tester"] as const;

export const w20BfPreviewNativeDetailSlugs = ["json-tree-viewer", "schema-validator"] as const;

const w20BfDeveloperUtilityNativeDetailSlugs = new Set([
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
]);

export const w20BeNativeDetailSlugs = [
  "model-comparator",
  "context-window",
  "token-budget-planner",
  "mcp-tester",
  "agent-workflow-builder",
  "rag-eval-bench"
] as const;

export const w20BdNativeDetailSlugs = ["hallucination-checker", "pii-scanner"] as const;

export const w20BkNativeDetailSlugs = [
  "function-call-builder",
  "prompt-templates",
  "structured-output-formatter",
  "vision-prompt-builder",
  "markdown-table-generator",
  "mock-data-generator",
  "synthetic-dataset-gen",
  "synthetic-dataset-generator"
] as const;

const w20BkAdditionalDetailSlugs = [
  "function-call-builder",
  "prompt-templates",
  "structured-output-formatter",
  "vision-prompt-builder",
  "synthetic-dataset-generator"
] as const;

const w20BkNativeDetailSlugSet = new Set<string>(w20BkNativeDetailSlugs);

export const vitalCalcDetailSlugs = [
  "mortgage-calculator",
  "bmi-calculator",
  "loan-calculator",
  "compound-interest",
  "bmr-calculator",
  "water-intake",
  "retirement-calculator",
  "debt-payoff",
  "roi-calculator",
  "tdee-calculator",
  "body-fat-calculator",
  "protein-calculator",
  "income-tax",
  "fire-calculator",
  "discount-calculator",
  "heart-rate-zone",
  "sleep-calculator",
  "ideal-weight-calculator",
  "car-loan",
  "rent-vs-buy",
  "home-affordability-calculator",
  "waist-hip-ratio",
  "blood-pressure",
  "child-growth",
  "student-loan-calculator",
  "apy-calculator",
  "rule-of-72",
  "calorie-deficit",
  "macro-calculator",
  "lean-body-mass",
  "emergency-fund",
  "savings-goal",
  "dti-calculator",
  "net-worth-calculator",
  "budget-rule",
  "side-income-tax",
  "intermittent-fasting",
  "creatine-calculator",
  "vo2-max",
  "biological-age",
  "glycemic-load",
  "30-30-30-method",
  "tip-calculator",
  "bill-split-calculator",
  "unit-converter",
  "hourly-to-salary",
  "inflation-calculator",
  "habit-cost",
  "caffeine-calculator",
  "alcohol-metabolism",
  "blood-sugar-calculator",
  "drink-calories",
  "fiber-intake",
  "steps-to-calories",
  "currency-converter",
  "percentage-calculator",
  "stock-average",
  "credit-card-apr",
  "investment-fee",
  "investment-goal",
  "credit-score-simulator",
  "crypto-tax",
  "freelance-rate",
  "subscription-audit",
  "savings-challenge",
  "city-cost-comparison",
  "social-insurance-calculator",
  "dividend-reinvestment",
  "mortgage-refinance-calculator",
  "coast-fire",
  "sip-calculator",
  "smoke-free",
  "adhd-screener",
  "burnout-assessment",
  "gad7-anxiety",
  "phq9-depression",
  "pss10-stress",
  "glp1-eligibility",
  "body-recomposition",
  "glp1-nutrition",
  "homa-ir",
  "one-rep-max",
  "ovulation-calculator",
  "pregnancy-due-date",
  "running-pace",
  "testosterone-calculator"
] as const;

export const allDetailSlugs = [
  ...labDetailSlugs,
  ...pdfNativeDetailSlugs,
  ...aixtralBatch1DetailSlugs,
  ...aixtralBatch2DetailSlugs,
  ...aixtralBatch3DetailSlugs,
  ...aixtralBatch4DetailSlugs,
  ...aixtralBatch5DetailSlugs,
  ...aixtralBatch6DetailSlugs,
  ...aixtralBatch7DetailSlugs,
  ...aixtralBatch8DetailSlugs,
  ...aixtralBatch9DetailSlugs,
  ...wave19WebDevNativeDetailSlugs,
  ...w20BfPreviewNativeDetailSlugs,
  ...w20BeNativeDetailSlugs,
  ...w20BdNativeDetailSlugs,
  ...w20BkAdditionalDetailSlugs,
  ...vitalCalcDetailSlugs
] as const;

export type LabDetailSlug = (typeof labDetailSlugs)[number];
export type PdfNativeDetailSlug = (typeof pdfNativeDetailSlugs)[number];
export type AixtralBatch1DetailSlug = (typeof aixtralBatch1DetailSlugs)[number];
export type AixtralBatch2DetailSlug = (typeof aixtralBatch2DetailSlugs)[number];
export type AixtralBatch3DetailSlug = (typeof aixtralBatch3DetailSlugs)[number];
export type AixtralBatch4DetailSlug = (typeof aixtralBatch4DetailSlugs)[number];
export type AixtralBatch5DetailSlug = (typeof aixtralBatch5DetailSlugs)[number];
export type AixtralBatch6DetailSlug = (typeof aixtralBatch6DetailSlugs)[number];
export type AixtralBatch7DetailSlug = (typeof aixtralBatch7DetailSlugs)[number];
export type AixtralBatch8DetailSlug = (typeof aixtralBatch8DetailSlugs)[number];
export type AixtralBatch9DetailSlug = (typeof aixtralBatch9DetailSlugs)[number];
export type Wave19WebDevNativeDetailSlug = (typeof wave19WebDevNativeDetailSlugs)[number];
export type W20BfPreviewNativeDetailSlug = (typeof w20BfPreviewNativeDetailSlugs)[number];
export type W20BeNativeDetailSlug = (typeof w20BeNativeDetailSlugs)[number];
export type W20BdNativeDetailSlug = (typeof w20BdNativeDetailSlugs)[number];
export type W20BkNativeDetailSlug = (typeof w20BkNativeDetailSlugs)[number];
export type VitalCalcDetailSlug = (typeof vitalCalcDetailSlugs)[number];
export type ToolDetailSlug = (typeof allDetailSlugs)[number];
export type DetailBadgeTone = "local" | "ai" | "warn" | "workflow" | "cloud";

export interface ToolDetailMetric {
  value: string;
  label: string;
}

export interface ToolDetailStep {
  title: string;
  description: string;
  badge: string;
  tone?: DetailBadgeTone;
}

export interface ToolDetailRow {
  badge: string;
  description: string;
  tone?: DetailBadgeTone;
}

export interface ToolDetailHandoff {
  initials: string;
  title: string;
  description: string;
  badge: string;
  accent: string;
}

export interface ToolDetailDefinition {
  tool: ToolDefinition;
  workspaceHref: string;
  listingBadge: ToolDetailRow;
  summary: string;
  overview: string;
  metrics: ToolDetailMetric[];
  howItWorks: ToolDetailStep[];
  trustSection: {
    title: string;
    rows: ToolDetailRow[];
  };
  handoff: ToolDetailHandoff[];
  includedCollections: CollectionDefinition[];
  relatedTools: ToolDefinition[];
  recommendedWorkflow: WorkflowDefinition | undefined;
  outcome: string;
}

interface ToolDetailContent {
  listingBadge: ToolDetailRow;
  summary: string;
  overview: string;
  metrics: ToolDetailMetric[];
  howItWorks: ToolDetailStep[];
  trustSection: ToolDetailDefinition["trustSection"];
  handoff: ToolDetailHandoff[];
  relatedSlugs: string[];
  workflowSlug?: string;
  outcome: string;
}

function vitalCalcDetail({
  badge,
  summary,
  overview,
  metric,
  category,
  inputTitle,
  inputDescription,
  resultTitle,
  resultDescription,
  reviewTitle,
  reviewDescription,
  handoffTitle,
  handoffDescription,
  localDescription,
  cautionBadge,
  cautionDescription,
  sourceDescription,
  contractDescription,
  relatedSlugs,
  outcome,
  accent
}: {
  badge: string;
  summary: string;
  overview: string;
  metric: ToolDetailMetric;
  category: "Finance" | "Health" | "Data";
  inputTitle: string;
  inputDescription: string;
  resultTitle: string;
  resultDescription: string;
  reviewTitle: string;
  reviewDescription: string;
  handoffTitle: string;
  handoffDescription: string;
  localDescription: string;
  cautionBadge: string;
  cautionDescription: string;
  sourceDescription: string;
  contractDescription: string;
  relatedSlugs: string[];
  outcome: string;
  accent: string;
}): ToolDetailContent {
  return {
    listingBadge: { badge, description: badge, tone: "local" },
    summary,
    overview,
    metrics: [
      { value: "Local", label: "Calculation mode" },
      metric,
      { value: "Free", label: "Access tier" },
      { value: category, label: "VitalCalc source" }
    ],
    howItWorks: [
      {
        title: inputTitle,
        description: inputDescription,
        badge: "Local",
        tone: "local"
      },
      {
        title: resultTitle,
        description: resultDescription,
        badge: "Math"
      },
      {
        title: reviewTitle,
        description: reviewDescription,
        badge: "Review",
        tone: "warn"
      },
      {
        title: handoffTitle,
        description: handoffDescription,
        badge: "Handoff"
      }
    ],
    trustSection: {
      title: "Local calculation model",
      rows: [
        {
          badge: "Local",
          description: localDescription,
          tone: "local"
        },
        {
          badge: cautionBadge,
          description: cautionDescription,
          tone: "warn"
        },
        {
          badge: "Export",
          description: "Saved outputs should include inputs, assumptions, calculation date, and any caveats shown with the result."
        }
      ]
    },
    handoff: [
      {
        initials: "VC",
        title: "VitalCalc source",
        description: sourceDescription,
        badge: "Source",
        accent
      },
      {
        initials: "API",
        title: "Calculator contract",
        description: contractDescription,
        badge: "Next",
        accent: category === "Finance" ? "green" : "blue"
      }
    ],
    relatedSlugs,
    outcome
  };
}

function aixtralDetail({
  badge,
  summary,
  overview,
  metric,
  inputTitle,
  inputDescription,
  resultTitle,
  resultDescription,
  reviewTitle,
  reviewDescription,
  handoffTitle,
  handoffDescription,
  sourceDescription,
  contractDescription,
  relatedSlugs,
  outcome,
  accent
}: {
  badge: string;
  summary: string;
  overview: string;
  metric: ToolDetailMetric;
  inputTitle: string;
  inputDescription: string;
  resultTitle: string;
  resultDescription: string;
  reviewTitle: string;
  reviewDescription: string;
  handoffTitle: string;
  handoffDescription: string;
  sourceDescription: string;
  contractDescription: string;
  relatedSlugs: string[];
  outcome: string;
  accent: string;
}): ToolDetailContent {
  return {
    listingBadge: { badge, description: badge, tone: "local" },
    summary,
    overview,
    metrics: [
      { value: "Detail", label: "Migration status" },
      metric,
      { value: "Local", label: "Source processing" },
      { value: "Hidden", label: "Public workspace" }
    ],
    howItWorks: [
      {
        title: inputTitle,
        description: inputDescription,
        badge: "Input",
        tone: "local"
      },
      {
        title: resultTitle,
        description: resultDescription,
        badge: "Output"
      },
      {
        title: reviewTitle,
        description: reviewDescription,
        badge: "Review",
        tone: "warn"
      },
      {
        title: handoffTitle,
        description: handoffDescription,
        badge: "Handoff"
      }
    ],
    trustSection: {
      title: "Detail-only migration model",
      rows: [
        {
          badge: "Hidden",
          description: "This Aixtral Lab tool is registered for inventory, SEO, and migration planning, but it is not exposed in publicTools yet.",
          tone: "warn"
        },
        {
          badge: "Local source",
          description: "The source implementation is local-first; Toolars still needs a matching workspace before public launch.",
          tone: "local"
        },
        {
          badge: "No dead link",
          description: "Catalog surfaces must not promote this tool as launch-ready until the Toolars workspace route is implemented and tested."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: sourceDescription,
        badge: "Source",
        accent
      },
      {
        initials: "UI",
        title: "Workspace contract",
        description: contractDescription,
        badge: "Next",
        accent: "blue"
      }
    ],
    relatedSlugs,
    outcome
  };
}

function aixtralNativeDetail({
  summary,
  overview,
  metric,
  inputTitle,
  inputDescription,
  resultTitle,
  resultDescription,
  reviewTitle,
  reviewDescription,
  sourceDescription,
  workspaceDescription,
  trustTitle,
  trustReviewDescription,
  relatedSlugs,
  outcome,
  accent
}: {
  summary: string;
  overview: string;
  metric: ToolDetailMetric;
  inputTitle: string;
  inputDescription: string;
  resultTitle: string;
  resultDescription: string;
  reviewTitle: string;
  reviewDescription: string;
  sourceDescription: string;
  workspaceDescription: string;
  trustTitle: string;
  trustReviewDescription: string;
  relatedSlugs: string[];
  outcome: string;
  accent: string;
}): ToolDetailContent {
  return {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary,
    overview,
    metrics: [
      { value: "Local", label: "Processing mode" },
      metric,
      { value: "Public", label: "Workspace status" },
      { value: "Aixtral", label: "Source migration" }
    ],
    howItWorks: [
      {
        title: inputTitle,
        description: inputDescription,
        badge: "Input",
        tone: "local"
      },
      {
        title: resultTitle,
        description: resultDescription,
        badge: "Output"
      },
      {
        title: reviewTitle,
        description: reviewDescription,
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Copy local output",
        description: workspaceDescription,
        badge: "Handoff"
      }
    ],
    trustSection: {
      title: trustTitle,
      rows: [
        {
          badge: "Local",
          description: "Inputs are processed in the browser by the native Toolars workspace and are not uploaded for conversion.",
          tone: "local"
        },
        {
          badge: "Review",
          description: trustReviewDescription,
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: sourceDescription,
        badge: "Source",
        accent
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: workspaceDescription,
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs,
    outcome
  };
}

function nativeMediaDetail({
  summary,
  overview,
  metric,
  sourceLabel,
  inputTitle,
  inputDescription,
  resultTitle,
  resultDescription,
  reviewTitle,
  reviewDescription,
  sourceTitle,
  sourceDescription,
  workspaceDescription,
  trustTitle,
  trustLocalDescription,
  trustReviewDescription,
  relatedSlugs,
  workflowSlug,
  outcome,
  accent
}: {
  summary: string;
  overview: string;
  metric: ToolDetailMetric;
  sourceLabel: string;
  inputTitle: string;
  inputDescription: string;
  resultTitle: string;
  resultDescription: string;
  reviewTitle: string;
  reviewDescription: string;
  sourceTitle: string;
  sourceDescription: string;
  workspaceDescription: string;
  trustTitle: string;
  trustLocalDescription: string;
  trustReviewDescription: string;
  relatedSlugs: string[];
  workflowSlug?: string;
  outcome: string;
  accent: string;
}): ToolDetailContent {
  return {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary,
    overview,
    metrics: [
      { value: "Local", label: "Processing mode" },
      metric,
      { value: "Public", label: "Workspace status" },
      { value: sourceLabel, label: "Source model" }
    ],
    howItWorks: [
      {
        title: inputTitle,
        description: inputDescription,
        badge: "Input",
        tone: "local"
      },
      {
        title: resultTitle,
        description: resultDescription,
        badge: "Output"
      },
      {
        title: reviewTitle,
        description: reviewDescription,
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Use the native workspace",
        description: workspaceDescription,
        badge: "Workspace"
      }
    ],
    trustSection: {
      title: trustTitle,
      rows: [
        {
          badge: "Local-first",
          description: trustLocalDescription,
          tone: "local"
        },
        {
          badge: "Boundary",
          description: trustReviewDescription,
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool now has a dedicated Toolars route, native workspace, local library, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: sourceLabel === "Aixtral" ? "AX" : "TL",
        title: sourceTitle,
        description: sourceDescription,
        badge: "Source",
        accent
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: workspaceDescription,
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs,
    workflowSlug,
    outcome
  };
}

const detailContent: Partial<Record<ToolDetailSlug, ToolDetailContent>> = {
  "pdf-toolkit": {
    listingBadge: { badge: "PDF workspace", description: "PDF workspace", tone: "local" },
    summary: "This listing closes the designed PDF Toolkit public page with a local operations promise and an AI-summary handoff.",
    overview:
      "PDF Toolkit is the default Toolars workspace for local PDF operations. It supports merge, split, compress, convert, extract, protect, watermark, and optional AI summary flows.",
    metrics: [
      { value: "8", label: "Core operations" },
      { value: "Local", label: "Default processing" },
      { value: "AI", label: "Consent step available" },
      { value: "Free", label: "Base plan" }
    ],
    howItWorks: [
      {
        title: "Load documents",
        description: "Add PDFs to a temporary workspace before choosing merge, split, compression, conversion, or summary actions.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Run PDF operations",
        description: "Apply page-level operations with previews, page counts, file-size deltas, and reversible queue state.",
        badge: "Process"
      },
      {
        title: "Request summary consent",
        description: "Show the extracted text boundary before any AI summary workflow sends content to a model route.",
        badge: "Consent",
        tone: "ai"
      },
      {
        title: "Export and share",
        description: "Download the final PDF, summary notes, or collection-ready result with the original assumptions attached.",
        badge: "Handoff",
        tone: "workflow"
      }
    ],
    trustSection: {
      title: "PDF processing model",
      rows: [
        {
          badge: "Local files",
          description: "Merge, split, compress, and conversion previews should run without uploading PDFs by default.",
          tone: "local"
        },
        {
          badge: "AI consent",
          description: "Summaries must disclose extracted text scope, model route, and what content leaves the browser.",
          tone: "ai"
        },
        {
          badge: "Retention",
          description: "Future saved PDFs should make expiry, deletion, and shared-link access explicit before storage."
        }
      ]
    },
    handoff: [
      {
        initials: "UI",
        title: "Workspace anatomy",
        description: "File queue, page operation rail, preview canvas, summary consent step, and export controls.",
        badge: "Stable",
        accent: "red"
      },
      {
        initials: "API",
        title: "PDF operation contract",
        description: "Return operation type, page ranges, file-size delta, summary consent state, and export artifact metadata.",
        badge: "Next",
        accent: "emerald"
      }
    ],
    relatedSlugs: ["pdf-merger", "pdf-compressor", "ai-pdf-summarizer", "json-repair"],
    workflowSlug: "pdf-summary",
    outcome: "PDF operations and AI-summary handoff"
  },
  "pdf-merger": nativeMediaDetail({
    summary: "PDF Merger is now a native Toolars workspace for planning local PDF merge queues before binary processing.",
    overview:
      "PDF Merger gives users a focused local-first merge workspace for ordered file queues, page totals, output naming, and size estimates. The trust boundary is explicit: Toolars can validate metadata and queue intent in-browser, while binary PDF stitching still requires a browser PDF engine or worker before a downloadable merged file is produced.",
    metric: { value: "Merge", label: "PDF operation" },
    sourceLabel: "Toolars",
    inputTitle: "Add ordered PDFs",
    inputDescription: "Enter PDF file names, page counts, and byte sizes in the order they should be merged.",
    resultTitle: "Build merge plan",
    resultDescription: "Return output file name, total pages, estimated size, validation issues, and queue order.",
    reviewTitle: "Review order and limits",
    reviewDescription: "Check that every item is a PDF and that at least two files are present before handoff.",
    sourceTitle: "Toolars source",
    sourceDescription: "Uses Toolars PDF Toolkit queue semantics as the source reference for local PDF operation planning.",
    workspaceDescription: "Dedicated workspace exposes the merge queue, local validation, and JSON handoff for a future PDF engine.",
    trustTitle: "Local PDF merge planning model",
    trustLocalDescription: "Names, page counts, and size estimates are processed locally without uploading PDF contents.",
    trustReviewDescription: "The workspace does not claim to rewrite binary PDFs; final merge output requires a PDF engine after validation.",
    relatedSlugs: ["pdf-toolkit", "pdf-compressor", "pdf-to-word"],
    workflowSlug: "pdf-summary",
    outcome: "Local PDF merge queue and output plan",
    accent: "purple"
  }),
  "pdf-compressor": nativeMediaDetail({
    summary: "PDF Compressor is now a native Toolars workspace for estimating compression profiles before PDF rewriting.",
    overview:
      "PDF Compressor provides local-first compression planning for profile selection, metadata removal, estimated output size, and savings percentage. The trust boundary is clear: Toolars estimates compression from file metadata in the browser, while actual image downsampling and PDF object rewriting require a PDF engine before download.",
    metric: { value: "Estimate", label: "Compression mode" },
    sourceLabel: "Toolars",
    inputTitle: "Enter PDF metadata",
    inputDescription: "Capture file name, page count, byte size, compression profile, and metadata removal preference.",
    resultTitle: "Estimate output size",
    resultDescription: "Return estimated size, savings percentage, output file name, and blocked states for non-PDF input.",
    reviewTitle: "Review visual quality",
    reviewDescription: "Make screen, balanced, and print profile tradeoffs visible before a real compressor rewrites the file.",
    sourceTitle: "Toolars source",
    sourceDescription: "Uses Toolars PDF Toolkit compression policy as the local planning reference.",
    workspaceDescription: "Dedicated workspace exposes profile controls, compression estimates, and local-only validation output.",
    trustTitle: "Local PDF compression estimate model",
    trustLocalDescription: "Compression estimates use local metadata and do not upload file contents.",
    trustReviewDescription: "Estimated savings are not a completed compressed PDF; a PDF engine must perform actual rewriting.",
    relatedSlugs: ["pdf-toolkit", "pdf-merger", "extract-tables"],
    workflowSlug: "pdf-summary",
    outcome: "Compression estimate and PDF engine handoff",
    accent: "orange"
  }),
  "ai-pdf-summarizer": nativeMediaDetail({
    summary: "AI PDF Summarizer is now a native Toolars workspace for local extraction planning and consent-gated summary handoff.",
    overview:
      "AI PDF Summarizer gives users a local-first planning workspace for PDF metadata, extracted text scope, summary style, action items, and output naming. The trust boundary is explicit: Toolars can validate local extraction metadata in-browser, while summary generation starts only after AI consent and a disclosed model route.",
    metric: { value: "AI consent", label: "Summary route" },
    sourceLabel: "Toolars",
    inputTitle: "Validate extracted text",
    inputDescription: "Enter PDF name, page count, byte size, extracted text characters, summary style, and action-item preference.",
    resultTitle: "Prepare summary handoff",
    resultDescription: "Return estimated tokens, section plan, output file name, and blocked states before any model receives content.",
    reviewTitle: "Review model boundary",
    reviewDescription: "Make the extracted text scope and model route visible before sending document content for summarization.",
    sourceTitle: "Toolars source",
    sourceDescription: "Uses Toolars PDF Toolkit summary consent semantics as the source reference for AI PDF planning.",
    workspaceDescription: "Dedicated workspace exposes local extraction metadata, summary style controls, and AI-consent handoff output.",
    trustTitle: "Local PDF summary consent model",
    trustLocalDescription: "PDF metadata and extracted text counts are validated locally before any summary request is prepared.",
    trustReviewDescription: "Actual summary generation requires AI consent and a disclosed model route; the planner does not upload raw PDFs.",
    relatedSlugs: ["pdf-toolkit", "pdf-translator", "extract-tables"],
    workflowSlug: "pdf-summary",
    outcome: "Local extraction plan and AI summary consent handoff",
    accent: "emerald"
  }),
  "pdf-to-word": nativeMediaDetail({
    summary: "PDF to Word is now a native Toolars workspace for validating DOCX conversion handoffs without silent uploads.",
    overview:
      "PDF to Word captures file metadata, layout preference, output naming, estimated document size, and conversion steps in a local-first workspace. The trust boundary is explicit: Toolars validates the handoff in-browser, but actual DOCX generation requires a conversion service or document engine after the user accepts that boundary.",
    metric: { value: "DOCX", label: "Target format" },
    sourceLabel: "Toolars",
    inputTitle: "Validate PDF metadata",
    inputDescription: "Enter the PDF name, page count, size, and whether layout preservation matters.",
    resultTitle: "Prepare DOCX handoff",
    resultDescription: "Return output name, estimated DOCX size, page count, and service-required step state.",
    reviewTitle: "Review conversion boundary",
    reviewDescription: "Make editable text versus layout preservation tradeoffs visible before any service processes content.",
    sourceTitle: "Toolars source",
    sourceDescription: "Uses Toolars PDF conversion policy from the broader PDF Toolkit as the source behavior reference.",
    workspaceDescription: "Dedicated workspace exposes local validation, preserve-layout toggle, and conversion handoff metadata.",
    trustTitle: "Local PDF to Word validation model",
    trustLocalDescription: "Metadata validation and output naming happen locally before any document content leaves the browser.",
    trustReviewDescription: "Actual DOCX generation is outside this browser-only layer and requires a conversion service.",
    relatedSlugs: ["pdf-toolkit", "ocr-scanner", "extract-tables"],
    workflowSlug: "pdf-summary",
    outcome: "DOCX conversion handoff plan",
    accent: "blue"
  }),
  "extract-tables": nativeMediaDetail({
    summary: "Extract Tables is now a native Toolars workspace for local page-range validation and extraction handoff planning.",
    overview:
      "Extract Tables lets users define PDF metadata, page ranges, and CSV or XLSX output targets before a structured extractor runs. The local workspace keeps the trust boundary visible: it validates page ranges and output settings in-browser, but actual table detection from PDF content needs a dedicated extraction engine or consent-gated service.",
    metric: { value: "CSV/XLSX", label: "Output target" },
    sourceLabel: "Toolars",
    inputTitle: "Set PDF pages",
    inputDescription: "Enter PDF name, page count, file size, selected page range, and table output format.",
    resultTitle: "Plan extraction output",
    resultDescription: "Return selected page count, estimated table count, output file name, and validation issues.",
    reviewTitle: "Review extraction assumptions",
    reviewDescription: "Catch out-of-range pages and clarify that table detection accuracy depends on the downstream extractor.",
    sourceTitle: "Toolars source",
    sourceDescription: "Uses Toolars PDF Toolkit table-export handoff as the source planning model.",
    workspaceDescription: "Dedicated workspace exposes page range controls, output format selection, and extractor handoff metadata.",
    trustTitle: "Local table extraction planning model",
    trustLocalDescription: "Page ranges and output settings are validated locally before any PDF content is processed.",
    trustReviewDescription: "The workspace does not inspect PDF tables directly; extraction requires a structured PDF table engine.",
    relatedSlugs: ["pdf-toolkit", "csv-to-json", "json-to-csv"],
    workflowSlug: "pdf-summary",
    outcome: "Table extraction queue and CSV/XLSX handoff",
    accent: "green"
  }),
  "pdf-password-remover": nativeMediaDetail({
    summary: "PDF Password Remover is now a native Toolars workspace for owned-document unlock validation before engine handoff.",
    overview:
      "PDF Password Remover captures local PDF metadata, ownership confirmation, and existing-password readiness before any unlock action. The trust boundary is explicit: Toolars validates that the user is working with an owned PDF or authorized file, but it does not crack passwords and still needs a PDF engine to decrypt and rewrite the document.",
    metric: { value: "Owned PDF", label: "Unlock policy" },
    sourceLabel: "Toolars",
    inputTitle: "Confirm owned PDF access",
    inputDescription: "Enter locked PDF metadata and confirm both permission and existing-password readiness.",
    resultTitle: "Validate unlock handoff",
    resultDescription: "Return output naming, page count, and blocked states before any PDF engine attempts decryption.",
    reviewTitle: "Review unlock limits",
    reviewDescription: "Make it clear that Toolars validates authorized unlock intent and does not bypass or crack unknown passwords.",
    sourceTitle: "Toolars source",
    sourceDescription: "Uses Toolars PDF Toolkit security handoff semantics as the source reference for password-removal planning.",
    workspaceDescription: "Dedicated workspace exposes local ownership checks, password-readiness validation, and PDF engine handoff output.",
    trustTitle: "Local owned-PDF unlock validation model",
    trustLocalDescription: "File metadata and ownership assertions are handled locally before any PDF processing engine is selected.",
    trustReviewDescription: "The workspace does not crack passwords; decrypting and rewriting an owned PDF requires the existing password and a PDF engine.",
    relatedSlugs: ["pdf-toolkit", "pdf-signer", "pdf-compressor"],
    workflowSlug: "pdf-summary",
    outcome: "Owned PDF unlock validation and engine handoff",
    accent: "violet"
  }),
  "pdf-signer": nativeMediaDetail({
    summary: "PDF Signer is now a native Toolars workspace for planning signature placement before PDF signing engine handoff.",
    overview:
      "PDF Signer gives users a local-first workspace for PDF metadata, signer name, page placement, and signature intent. The trust boundary is explicit: Toolars can plan signature placement locally, while an actual signing engine must embed the mark or certificate before a signed PDF exists.",
    metric: { value: "Signing", label: "Engine handoff" },
    sourceLabel: "Toolars",
    inputTitle: "Set signature placement",
    inputDescription: "Enter PDF metadata, signer name, target page, and signature type before creating a signing plan.",
    resultTitle: "Prepare signing plan",
    resultDescription: "Return output naming, signer, signature type, page placement, and validation issues.",
    reviewTitle: "Review legal boundary",
    reviewDescription: "Clarify that planning a signature is not the same as embedding a legally meaningful PDF signature.",
    sourceTitle: "Toolars source",
    sourceDescription: "Uses Toolars PDF Toolkit signing handoff semantics as the source reference for signature planning.",
    workspaceDescription: "Dedicated workspace exposes local placement controls and signing-engine handoff metadata.",
    trustTitle: "Local PDF signature placement model",
    trustLocalDescription: "Signer name, signature type, and page placement are validated locally in the browser.",
    trustReviewDescription: "A signature is not embedded by this planning layer; a PDF signing engine must apply the final mark or certificate.",
    relatedSlugs: ["pdf-toolkit", "pdf-password-remover", "pdf-to-word"],
    workflowSlug: "pdf-summary",
    outcome: "Signature placement plan and signing engine handoff",
    accent: "sky"
  }),
  "ocr-scanner": nativeMediaDetail({
    summary: "OCR Scanner is now a native Toolars workspace for validating image and PDF OCR jobs before engine handoff.",
    overview:
      "OCR Scanner captures file type, size, estimated pages, language, and output format in a local-first planning workspace. The trust boundary is explicit: Toolars can validate supported inputs and queue metadata locally, while actual OCR text recognition requires an OCR engine or consent-gated processing route.",
    metric: { value: "OCR", label: "Recognition step" },
    sourceLabel: "Toolars",
    inputTitle: "Add scan metadata",
    inputDescription: "Enter PDF or image name, MIME type, file size, optional page count, language, and output format.",
    resultTitle: "Prepare OCR handoff",
    resultDescription: "Return input kind, estimated pages, output file name, language, and blocked states for unsupported files.",
    reviewTitle: "Review OCR limits",
    reviewDescription: "Make language assumptions, file type support, and engine-required status visible before recognition.",
    sourceTitle: "Toolars source",
    sourceDescription: "Uses Toolars PDF Toolkit scan and upload lifecycle concepts as the source planning reference.",
    workspaceDescription: "Dedicated workspace exposes local file-type validation, language controls, and OCR handoff metadata.",
    trustTitle: "Local OCR planning model",
    trustLocalDescription: "File metadata and language choices stay local until a real OCR engine is selected.",
    trustReviewDescription: "Recognized text is not produced by this planning layer; OCR output requires an OCR engine.",
    relatedSlugs: ["pdf-toolkit", "pdf-to-word", "extract-tables"],
    workflowSlug: "pdf-summary",
    outcome: "OCR validation and engine handoff plan",
    accent: "cyan"
  }),
  "pdf-translator": nativeMediaDetail({
    summary: "PDF Translator is now a native Toolars workspace for local extraction planning and consent-gated translation handoff.",
    overview:
      "PDF Translator captures PDF metadata, extracted text scope, source and target languages, and layout preference in a local-first workspace. The trust boundary is explicit: Toolars validates translation scope locally, while translated text requires AI consent and a disclosed model route, and layout-aware PDF output still requires a PDF engine.",
    metric: { value: "Translate", label: "AI consent route" },
    sourceLabel: "Toolars",
    inputTitle: "Validate translation scope",
    inputDescription: "Enter PDF metadata, extracted text characters, source and target languages, and layout preference.",
    resultTitle: "Prepare translation handoff",
    resultDescription: "Return estimated tokens, target-language output name, layout mode, and blocked states.",
    reviewTitle: "Review content boundary",
    reviewDescription: "Make target language, extracted text scope, AI consent, and PDF engine requirements visible before processing.",
    sourceTitle: "Toolars source",
    sourceDescription: "Uses Toolars PDF Toolkit AI-consent handoff semantics as the source reference for translation planning.",
    workspaceDescription: "Dedicated workspace exposes local extraction metadata, language controls, and consent-gated translation output.",
    trustTitle: "Local PDF translation consent model",
    trustLocalDescription: "PDF metadata and extracted text counts are validated locally before translation is prepared.",
    trustReviewDescription: "Translation requires AI consent and a model route; layout-aware PDF rewriting requires a PDF engine.",
    relatedSlugs: ["pdf-toolkit", "ai-pdf-summarizer", "ocr-scanner"],
    workflowSlug: "pdf-summary",
    outcome: "Local translation scope and AI consent handoff",
    accent: "orange"
  }),
  "json-repair": {
    listingBadge: { badge: "Local repair", description: "Local repair", tone: "local" },
    summary: "This listing adds the designed JSON Repair public page for fixing malformed AI and developer payloads before handoff.",
    overview:
      "JSON Repair is the default rescue workspace for broken LLM output, API payloads, and copied object literals. It should feel fast, local, and predictable before deeper validation steps.",
    metrics: [
      { value: "6", label: "Syntax issue types" },
      { value: "Local", label: "Default processing" },
      { value: "Schema", label: "Recommended next step" },
      { value: "Free", label: "Access tier" }
    ],
    howItWorks: [
      {
        title: "Paste malformed JSON",
        description: "Add LLM output, tool-call payloads, logs, or copied API responses into the local editor.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Repair syntax",
        description: "Normalize quotes, trailing commas, comments, dangling keys, wrapped arrays, and common LLM formatting drift.",
        badge: "Repair"
      },
      {
        title: "Review diff",
        description: "Compare repaired output against the source so teams can catch risky changes before using the payload.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Validate handoff",
        description: "Copy clean JSON into schema validation, prompt hardening, or MCP payload tests.",
        badge: "Handoff",
        tone: "workflow"
      }
    ],
    trustSection: {
      title: "Local repair model",
      rows: [
        {
          badge: "Local",
          description: "Repair and diff should run in-browser without sending payloads to a server.",
          tone: "local"
        },
        {
          badge: "No silent edits",
          description: "The repaired output must keep a visible diff so structural changes are not accepted blindly.",
          tone: "warn"
        },
        {
          badge: "AI workflows",
          description: "Optional prompt hardening handoff should disclose any text that would leave the local workspace.",
          tone: "ai"
        }
      ]
    },
    handoff: [
      {
        initials: "UI",
        title: "Workspace anatomy",
        description: "Source editor, repaired output, issue list, diff review, validation status, and copy/export controls.",
        badge: "Stable",
        accent: "yellow"
      },
      {
        initials: "API",
        title: "Repair contract",
        description: "Return repaired JSON, parse status, issue list, confidence, diff summary, and optional schema validation state.",
        badge: "Next",
        accent: "blue"
      }
    ],
    relatedSlugs: ["prompt-injection-scanner", "schema-validator", "llm-cost-calculator", "mcp-server-builder"],
    workflowSlug: "ai-prompt-hardening",
    outcome: "Clean JSON payload and validation handoff"
  },
  "prompt-injection-scanner": {
    listingBadge: { badge: "AI security", description: "AI security", tone: "warn" },
    summary: "This listing defines the commercial catalog page, trust model, and developer handoff for prompt security workflows.",
    overview:
      "Prompt Injection Scanner helps teams review system prompts, tool instructions, and retrieved text before shipping agentic flows. The first pass is rule-based; deeper AI review remains consent-gated.",
    metrics: [
      { value: "4", label: "Risk classes" },
      { value: "Local", label: "Rule pass" },
      { value: "AI", label: "Optional deep review" },
      { value: "Team", label: "Review log ready" }
    ],
    howItWorks: [
      {
        title: "Add prompt surface",
        description: "Paste a system prompt, tool instruction, user prompt, or retrieved document excerpt.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Run rule scan",
        description: "Detect override attempts, hidden prompt extraction, URL callbacks, and data exfiltration patterns.",
        badge: "Scan",
        tone: "warn"
      },
      {
        title: "Generate findings",
        description: "Group severity, evidence snippets, and suggested guardrails into a review report.",
        badge: "Report"
      },
      {
        title: "Harden workflow",
        description: "Convert findings into red-team variants and a release checklist.",
        badge: "Workflow",
        tone: "workflow"
      }
    ],
    trustSection: {
      title: "Privacy and review model",
      rows: [
        {
          badge: "Local rules",
          description: "Baseline scan should run without sending prompt content to a model provider.",
          tone: "local"
        },
        {
          badge: "Consent",
          description: "AI deep review must show what text will be sent and which model route will process it.",
          tone: "ai"
        },
        {
          badge: "Audit",
          description: "Team releases should save reviewer, severity, and remediation state.",
          tone: "warn"
        }
      ]
    },
    handoff: [
      {
        initials: "UI",
        title: "Workspace anatomy",
        description: "Profile sidebar, prompt input, risk report, meter, findings, and guardrail output.",
        badge: "Stable",
        accent: "rose"
      },
      {
        initials: "API",
        title: "Scanner contract",
        description: "Return severity, category, evidence range, remediation, and consent requirement.",
        badge: "Next",
        accent: "amber"
      }
    ],
    relatedSlugs: ["pii-scanner", "hallucination-checker", "prompt-templates"],
    workflowSlug: "ai-prompt-hardening",
    outcome: "Risk report and red-team variants"
  },
  "hallucination-checker": aixtralNativeDetail({
    summary: "Hallucination Checker is now a native Toolars workspace for local claim-to-source evidence review.",
    overview:
      "Hallucination Checker compares answer claims against supplied source notes before AI output is copied into docs, support replies, or release materials. The native Toolars workspace keeps text local, extracts sentence-level claims, scores source overlap, highlights unsupported claims, and surfaces privacy caveats so reviewers can decide what needs citation or rewrite.",
    metric: { value: "Evidence", label: "Review model" },
    inputTitle: "Add answer and sources",
    inputDescription: "Accept generated answer text plus source excerpts, citations, or reference notes for local comparison.",
    resultTitle: "Score support",
    resultDescription: "Return groundedness score, unsupported claim count, matched source evidence, and privacy notes.",
    reviewTitle: "Check evidence gaps",
    reviewDescription: "Make missing citations, weak lexical matches, source conflicts, and sensitive source text visible before handoff.",
    sourceDescription: "Uses the Toolars AI safety review model and prior Hallucination Checker listing as the source behavior reference.",
    workspaceDescription: "Adds a native workbench, claim cards, source-overlap evidence, unsupported-claim flags, and public catalog readiness.",
    trustTitle: "Local evidence heuristic model",
    trustReviewDescription: "Claim support uses transparent lexical heuristics, so reviewers should still verify citations and source meaning.",
    relatedSlugs: ["prompt-injection-scanner", "pii-scanner", "json-repair"],
    outcome: "Native Hallucination Checker workspace for local groundedness review",
    accent: "green"
  }),
  "pii-scanner": aixtralNativeDetail({
    summary: "PII Scanner is now a native Toolars workspace for local sensitive-data detection and redaction review.",
    overview:
      "PII Scanner detects emails, phone numbers, payment-like numbers, addresses, dates of birth, API keys, and other sensitive tokens before text is sent into AI or publishing workflows. The native Toolars workspace keeps input text in the browser, returns entity cards with severity, generates redacted output, and makes false-positive review explicit.",
    metric: { value: "PII", label: "Entity scan" },
    inputTitle: "Paste sensitive text",
    inputDescription: "Accept notes, prompts, logs, support replies, or draft content for local PII scanning.",
    resultTitle: "Detect and redact",
    resultDescription: "Return entity counts, severity, matched evidence, suggested redactions, and copy-ready sanitized text.",
    reviewTitle: "Check false positives",
    reviewDescription: "Make ambiguous numbers, public contact details, partial identifiers, and missed domain-specific PII visible.",
    sourceDescription: "Uses the Toolars local PII scanner rules and prior PII Scanner listing as the source behavior reference.",
    workspaceDescription: "Adds a native workbench, local entity cards, redacted output, severity metrics, and public catalog readiness.",
    trustTitle: "Local PII redaction model",
    trustReviewDescription: "Pattern rules are transparent and local, but teams should review context-specific sensitive data before sharing.",
    relatedSlugs: ["prompt-injection-scanner", "hallucination-checker", "json-repair"],
    outcome: "Native PII Scanner workspace for local sensitive-data review and redaction",
    accent: "purple"
  }),
  "llm-cost-calculator": {
    listingBadge: { badge: "Local first", description: "Local first", tone: "local" },
    summary: "This listing defines the commercial catalog page, local estimation model, and implementation handoff for launch cost reviews.",
    overview:
      "LLM Cost Calculator helps product, finance, and engineering teams estimate token spend before a model workflow reaches production. The first version is fully local, fast to compare, and designed for conservative launch planning.",
    metrics: [
      { value: "3", label: "Model profiles" },
      { value: "Local", label: "Estimator pass" },
      { value: "Budget", label: "Export target" },
      { value: "Free", label: "Core scenario" }
    ],
    howItWorks: [
      {
        title: "Enter traffic assumptions",
        description: "Capture input tokens, output tokens, request volume, and expected model profile.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Estimate monthly spend",
        description: "Calculate token mix, input/output cost, and total monthly exposure from current rates.",
        badge: "Estimate"
      },
      {
        title: "Review cost controls",
        description: "Flag context caps, routing opportunities, cache assumptions, retries, and approval thresholds.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Export launch plan",
        description: "Hand off a scenario summary to model comparison, budget approval, or release notes.",
        badge: "Handoff",
        tone: "workflow"
      }
    ],
    trustSection: {
      title: "Pricing and limits",
      rows: [
        {
          badge: "Free",
          description: "Single-scenario estimation should run without sign-in or server calls.",
          tone: "local"
        },
        {
          badge: "Team",
          description: "Saved scenarios, approval trails, and shared provider tables belong in paid plans."
        },
        {
          badge: "Rates",
          description: "Production needs rate metadata with timestamp, provider, region, and model family.",
          tone: "warn"
        }
      ]
    },
    handoff: [
      {
        initials: "UI",
        title: "Workspace anatomy",
        description: "Left cost model notes, center scenario inputs and estimate, right production checklist.",
        badge: "Stable",
        accent: "green"
      },
      {
        initials: "API",
        title: "Calculator contract",
        description: "Return total cost, token volume, input/output split, model label, and assumptions used.",
        badge: "Next",
        accent: "blue"
      }
    ],
    relatedSlugs: ["model-comparator", "context-window", "token-counter", "token-budget-planner"],
    workflowSlug: "llm-cost-review",
    outcome: "Cost plan for launch review"
  },
  "model-comparator": aixtralNativeDetail({
    summary: "Model Comparator is now a native Toolars workspace for local workload fit, cost, latency, and context review.",
    overview:
      "Model Comparator helps AI teams compare candidate model profiles before routing real traffic. The native workspace estimates workload token fit, latency target alignment, context-window capacity, and cost exposure locally so product and engineering reviewers can pick a launch candidate without sending scenario notes to a model provider.",
    metric: { value: "Models", label: "Comparison target" },
    inputTitle: "Enter workload assumptions",
    inputDescription: "Accept total tokens, latency target, and quality preference for a local model fit pass.",
    resultTitle: "Compare model profiles",
    resultDescription: "Return fit scores, context-fit flags, estimated cost, and a recommended model row.",
    reviewTitle: "Review routing assumptions",
    reviewDescription: "Make context misses, latency tradeoffs, stale pricing, and quality targets visible before rollout.",
    sourceDescription: "Uses the Toolars LLM cost and model planning registry entries as the source reference.",
    workspaceDescription: "Adds a native model comparison workbench, fit scoring, context-fit rows, and local recommendation output.",
    trustTitle: "Local model comparison model",
    trustReviewDescription: "Model rates and latency are planning profiles, so final provider routing should verify current production metadata.",
    relatedSlugs: ["llm-cost-calculator", "context-window", "token-budget-planner"],
    outcome: "Native model comparison workspace for local model routing review",
    accent: "indigo"
  }),
  "context-window": aixtralNativeDetail({
    summary: "Context Window Visualizer is now a native Toolars workspace for local context allocation review.",
    overview:
      "Context Window Visualizer shows how system prompts, user input, retrieval chunks, tool traces, and output reserve fit inside a selected model context window. The native workspace turns token allocation notes into segment percentages, remaining-token headroom, overflow warnings, and retrieval pressure checks before prompt assembly.",
    metric: { value: "Context", label: "Allocation target" },
    inputTitle: "Enter context segments",
    inputDescription: "Accept model window size plus labeled token segments for prompt, retrieval, tools, and output reserve.",
    resultTitle: "Visualize allocation",
    resultDescription: "Return used tokens, remaining tokens, utilization percentage, overflow, and segment breakdown rows.",
    reviewTitle: "Check context pressure",
    reviewDescription: "Make tight windows, retrieval-heavy plans, missing output reserve, and overflow visible before sending.",
    sourceDescription: "Uses the Toolars LLM cost planning registry entries as the source reference.",
    workspaceDescription: "Adds a native context allocation workbench, segment rows, utilization metrics, and local warnings.",
    trustTitle: "Local context allocation model",
    trustReviewDescription: "Token counts are planning estimates and should be checked with provider tokenizers before final launch.",
    relatedSlugs: ["token-counter", "token-budget-planner", "model-comparator"],
    outcome: "Native context window workspace for local token allocation review",
    accent: "teal"
  }),
  "token-budget-planner": aixtralNativeDetail({
    summary: "Token Budget Planner is now a native Toolars workspace for local prompt allocation planning.",
    overview:
      "Token Budget Planner helps teams divide a context budget across system instructions, user input, retrieval, tools, and output reserve. The native workspace calculates total allocation, remaining headroom, over-budget warnings, and percentage rows so prompt owners can revise plans before combining retrieval and tool output.",
    metric: { value: "Budget", label: "Planning target" },
    inputTitle: "Enter token allocations",
    inputDescription: "Accept total context budget plus labeled allocation rows for prompt, retrieval, tools, and output.",
    resultTitle: "Plan budget headroom",
    resultDescription: "Return total allocated tokens, remaining budget, over-budget amount, and allocation percentages.",
    reviewTitle: "Check budget risk",
    reviewDescription: "Make over-budget plans, low headroom, and retrieval-heavy allocations visible before assembly.",
    sourceDescription: "Uses the Toolars LLM cost planning registry entries as the source reference.",
    workspaceDescription: "Adds a native token budget workbench, allocation rows, headroom metrics, and local budget warnings.",
    trustTitle: "Local token budget model",
    trustReviewDescription: "Budget math stays local, but provider tokenization and runtime tool output can change final usage.",
    relatedSlugs: ["context-window", "token-counter", "llm-cost-calculator"],
    outcome: "Native token budget planner workspace for local context allocation",
    accent: "cyan"
  }),
  "mcp-server-builder": {
    listingBadge: { badge: "Workflow", description: "Workflow", tone: "workflow" },
    summary: "This listing captures the catalog promise, launch review model, and developer handoff for agent-facing tool servers.",
    overview:
      "MCP Server Builder gives teams a structured way to draft tool definitions, resources, test payloads, and manifest notes before wiring an agent to real systems. It should make launch readiness visible without requiring a backend in the first prototype.",
    metrics: [
      { value: "3", label: "Builder stages" },
      { value: "Local", label: "Manifest draft" },
      { value: "Schema", label: "Required output" },
      { value: "Team", label: "Launch review" }
    ],
    howItWorks: [
      {
        title: "Define server purpose",
        description: "Name the server, primary agent job, and first tool contract.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Build manifest preview",
        description: "Generate tool schema, resources, and representative test payloads.",
        badge: "Manifest"
      },
      {
        title: "Review agent metadata",
        description: "Check action names, explicit fields, auth notes, limits, and failure states.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Test and package",
        description: "Hand off to MCP Tester, docs export, and workflow launch approval.",
        badge: "Handoff",
        tone: "workflow"
      }
    ],
    trustSection: {
      title: "Security and launch review",
      rows: [
        {
          badge: "Local draft",
          description: "Manifest generation should not send private tool descriptions to a cloud service.",
          tone: "local"
        },
        {
          badge: "Auth",
          description: "Production launch must capture OAuth, API key, tenant, and rate-limit policy notes.",
          tone: "warn"
        },
        {
          badge: "Audit",
          description: "Team review should record schema changes, test payloads, and reviewer approval state."
        }
      ]
    },
    handoff: [
      {
        initials: "UI",
        title: "Workspace anatomy",
        description: "Left builder stages, center manifest form and preview, right launch review checklist.",
        badge: "Stable",
        accent: "purple"
      },
      {
        initials: "API",
        title: "Manifest contract",
        description: "Return server name, tools, input schema, resources, test payloads, and review warnings.",
        badge: "Next",
        accent: "amber"
      }
    ],
    relatedSlugs: ["mcp-tester", "agent-workflow-builder", "rag-eval-bench"],
    workflowSlug: "mcp-tool-launch",
    outcome: "Manifest, test payloads, and docs"
  },
  "mcp-tester": aixtralNativeDetail({
    summary: "MCP Tester is now a native Toolars workspace for local manifest and payload contract checks.",
    overview:
      "MCP Tester validates an MCP manifest, representative sample payload, and required input fields before agent tools are connected to production systems. The native workspace keeps manifest JSON and payloads local while surfacing parse errors, missing required fields, tool names, and launch-review checks.",
    metric: { value: "MCP", label: "Contract target" },
    inputTitle: "Paste manifest and payload",
    inputDescription: "Accept MCP manifest JSON plus a sample tool payload for local validation.",
    resultTitle: "Validate contract",
    resultDescription: "Return manifest status, required field coverage, sample payload status, and review checks.",
    reviewTitle: "Check launch contract",
    reviewDescription: "Make invalid JSON, missing fields, weak schemas, and auth-review gaps visible before agent wiring.",
    sourceDescription: "Uses the Toolars MCP Server Builder launch model as the source reference.",
    workspaceDescription: "Adds a native MCP tester workbench, manifest parser, payload checker, and local contract status.",
    trustTitle: "Local MCP contract model",
    trustReviewDescription: "Local validation checks shape and required fields but does not execute remote MCP tools.",
    relatedSlugs: ["mcp-server-builder", "agent-workflow-builder", "rag-eval-bench"],
    outcome: "Native MCP Tester workspace for local manifest and payload validation",
    accent: "blue"
  }),
  "agent-workflow-builder": aixtralNativeDetail({
    summary: "Agent Workflow Builder is now a native Toolars workspace for local multi-agent planning and review gates.",
    overview:
      "Agent Workflow Builder maps agent stages, tool calls, handoffs, and review gates before automation is connected to real systems. The native workspace turns stage notes into workflow metrics, handoff counts, tool coverage, and review warnings so teams can inspect the plan before agent execution.",
    metric: { value: "Workflow", label: "Planning target" },
    inputTitle: "Map workflow stages",
    inputDescription: "Accept one stage per line with agent, stage, tool list, and review-gate state.",
    resultTitle: "Build workflow plan",
    resultDescription: "Return stage count, mapped tools, handoffs, review gates, and readiness checks.",
    reviewTitle: "Check agent gates",
    reviewDescription: "Make missing review gates, tool gaps, and handoff points visible before automation launch.",
    sourceDescription: "Uses the Toolars MCP and agent launch workflow entries as the source reference.",
    workspaceDescription: "Adds a native agent workflow workbench, stage parser, review-gate checks, and local planning metrics.",
    trustTitle: "Local agent workflow model",
    trustReviewDescription: "Planning is local and does not execute tools; production agents still require auth, logging, and rollback review.",
    relatedSlugs: ["mcp-tester", "mcp-server-builder", "rag-eval-bench"],
    outcome: "Native Agent Workflow Builder workspace for local agent launch planning",
    accent: "green"
  }),
  "rag-eval-bench": aixtralNativeDetail({
    summary: "RAG Eval Bench is now a native Toolars workspace for local groundedness and source-coverage checks.",
    overview:
      "RAG Eval Bench scores answer coverage against expected terms and cited source IDs so teams can inspect retrieval quality before running heavier evaluation systems. The native workspace keeps questions, answers, and source IDs local while showing groundedness percentages, missing source IDs, and pass or review status.",
    metric: { value: "Eval", label: "Grounding target" },
    inputTitle: "Enter eval cases",
    inputDescription: "Accept one eval case per line with question, answer, expected terms, and source IDs.",
    resultTitle: "Score groundedness",
    resultDescription: "Return average groundedness, case count, missing terms, missing source IDs, and case status.",
    reviewTitle: "Check retrieval evidence",
    reviewDescription: "Make missing citations, weak answer coverage, and brittle expected terms visible before launch.",
    sourceDescription: "Uses the Toolars RAG and MCP launch registry entries as the source reference.",
    workspaceDescription: "Adds a native RAG eval workbench, local groundedness scoring, case rows, and source-coverage review.",
    trustTitle: "Local RAG eval model",
    trustReviewDescription: "Local heuristics are a fast screen and should be paired with source-backed evaluation before release.",
    relatedSlugs: ["rag-chunk-visualizer", "embedding-playground", "mcp-tester"],
    outcome: "Native RAG Eval Bench workspace for local groundedness review",
    accent: "orange"
  }),
  "json-formatter": aixtralNativeDetail({
    summary: "JSON Formatter is now a native Toolars workspace for local format, minify, and validation review.",
    overview:
      "JSON Formatter parses pasted JSON, validates syntax, formats readable output, and minifies payloads for API debugging, configuration review, fixtures, and AI payload cleanup. The workspace uses a Toolars-native input, action, result, and validation flow so developers can inspect payloads locally before copying them into code or downstream tools.",
    metric: { value: "JSON", label: "Format target" },
    inputTitle: "Paste JSON",
    inputDescription: "Accept raw JSON payloads, config snippets, or API responses for local validation and formatting.",
    resultTitle: "Format or minify",
    resultDescription: "Return readable or compact JSON output with syntax status, key counts, depth hints, and copy-ready text.",
    reviewTitle: "Review syntax assumptions",
    reviewDescription: "Keep parse errors, payload size, and formatting mode visible before formatted JSON is trusted.",
    sourceDescription: "Uses the Toolars-native JSON formatting contract as the source reference.",
    workspaceDescription: "Adds a native workbench, format and minify actions, validation state, output panel, and public catalog readiness.",
    trustTitle: "Local JSON formatting model",
    trustReviewDescription: "JSON is parsed in the browser and formatting never repairs or silently changes invalid payloads.",
    relatedSlugs: ["json-repair", "json-path-tester", "json-diff"],
    outcome: "Native JSON Formatter workspace for local validation, formatting, and minified output",
    accent: "slate"
  }),
  "json-path-tester": aixtralNativeDetail({
    summary: "JSON Path Tester is now a native Toolars workspace for local JSONPath query checks.",
    overview:
      "JSON Path Tester runs common JSONPath expressions against pasted payloads, returning matching values for nested objects, arrays, recursive property searches, and simple predicates. The workspace adapts the Aixtral source page behavior into Toolars-native JSON input, expression, result, and validation panels for API debugging, fixture review, and extraction rule handoff.",
    metric: { value: "JSONPath", label: "Query syntax" },
    inputTitle: "Paste JSON and path",
    inputDescription: "Accept a JSON document plus a JSONPath expression for local query testing.",
    resultTitle: "Run query",
    resultDescription: "Return matching values, match counts, parse status, and copy-ready JSON result arrays.",
    reviewTitle: "Check query support",
    reviewDescription: "Make invalid JSON, unsupported path syntax, empty matches, and predicate assumptions visible before use.",
    sourceDescription: "Uses the Aixtral JSON Path Tester page behavior and examples as the source reference.",
    workspaceDescription: "Adds a native workbench, expression input, lightweight JSONPath evaluator, match output, and public catalog readiness.",
    trustTitle: "Local JSONPath query model",
    trustReviewDescription: "Queries run locally with a focused supported JSONPath subset; complex production expressions should still be verified in the target runtime.",
    relatedSlugs: ["json-formatter", "json-repair", "json-diff"],
    outcome: "Native JSON Path Tester workspace for local payload query checks and extraction handoff",
    accent: "indigo"
  }),
  "json-tree-viewer": aixtralDetail({
    badge: "JSON utility",
    summary: "This Aixtral Lab listing captures JSON Tree Viewer detail coverage for nested payload inspection workflows.",
    overview:
      "JSON Tree Viewer parses nested JSON into an expandable inspection model for API debugging, config review, fixture triage, and LLM payload analysis. Toolars tracks the original registry intent with local parsing, tree shape notes, copied-path handoff, and error visibility while the W20-BF native detail adapter exposes the promoted public workspace metadata.",
    metric: { value: "Tree", label: "JSON view" },
    inputTitle: "Paste JSON",
    inputDescription: "Accept nested objects, arrays, config files, or API responses for local tree inspection.",
    resultTitle: "Build tree view",
    resultDescription: "Return node counts, depth hints, expandable path labels, and copy-ready JSON snippets.",
    reviewTitle: "Check parse errors",
    reviewDescription: "Keep invalid JSON, very deep payloads, and large arrays visible before teams rely on the tree view.",
    handoffTitle: "Plan inspector controls",
    handoffDescription: "Use this detail record to scope expand/collapse controls, path copying, search, and empty states.",
    sourceDescription: "Use the Aixtral JSON Tree Viewer listing and Toolars JSON utilities as the behavior reference.",
    contractDescription: "Return parsed node metadata, tree paths, search matches, validation errors, and copy targets.",
    relatedSlugs: ["json-formatter", "json-path-tester", "json-repair"],
    outcome: "JSON tree viewer detail page and nested payload inspection handoff",
    accent: "blue"
  }),
  "schema-validator": aixtralDetail({
    badge: "Schema utility",
    summary: "This Aixtral Lab listing captures Schema Validator detail coverage for local JSON schema review.",
    overview:
      "Schema Validator checks JSON payloads and schema-like contracts before teams use them in APIs, function-calling payloads, structured output, or form validation. Toolars records the local-first validation intent, schema diagnostics, sample payload review, and handoff metadata while the W20-BF native detail adapter exposes the promoted public workspace metadata.",
    metric: { value: "Schema", label: "Validation target" },
    inputTitle: "Paste schema and JSON",
    inputDescription: "Accept a JSON schema draft plus sample JSON payloads for local compatibility checks.",
    resultTitle: "Validate payload",
    resultDescription: "Return pass/fail status, schema errors, missing fields, type mismatches, and copy-ready diagnostics.",
    reviewTitle: "Check schema limits",
    reviewDescription: "Make unsupported draft features, ambiguous requirements, and nested error paths visible before production use.",
    handoffTitle: "Plan validation workspace",
    handoffDescription: "Use this detail record to scope schema and payload editors, error lists, path filters, and export behavior.",
    sourceDescription: "Use the Aixtral Schema Validator listing and Toolars JSON validation tools as the behavior reference.",
    contractDescription: "Return validation status, error paths, schema metadata, sample payload stats, and copyable diagnostics.",
    relatedSlugs: ["json-schema-builder", "json-repair", "json-formatter"],
    outcome: "Schema validator detail page and local JSON contract review handoff",
    accent: "blue"
  }),
  "base64-converter": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "Base64 Converter is now a native Toolars workspace for local UTF-8 encoding, decoding, and URL-safe payload cleanup.",
    overview:
      "Base64 Converter encodes UTF-8 text into standard or URL-safe Base64 and decodes pasted Base64 back into readable text. The workspace migrates the Aixtral source behavior into Toolars-native controls, adds normalization for common copy-paste issues such as missing padding, URL-safe alphabets, whitespace, and data URL prefixes, and keeps payloads local for API debugging, tokens, and configuration review.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "2-way", label: "Encode and decode" },
      { value: "Public", label: "Workspace status" },
      { value: "URL-safe", label: "Alphabet support" }
    ],
    howItWorks: [
      {
        title: "Paste payload text",
        description: "Add plain UTF-8 text, a standard Base64 string, a URL-safe token, or a copied data URL directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Choose conversion mode",
        description: "Switch between encode and decode, then pick standard Base64 or URL-safe output for API, JWT, and query-string payloads.",
        badge: "Mode"
      },
      {
        title: "Normalize safely",
        description: "Decode flow strips whitespace, converts URL-safe characters, restores missing padding, and reports each cleanup step.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Copy reviewed output",
        description: "Review byte counts, output length, warnings, and normalized input before copying the converted payload.",
        badge: "Output"
      }
    ],
    trustSection: {
      title: "Local Base64 conversion model",
      rows: [
        {
          badge: "Local",
          description: "Text and Base64 payloads are converted in the browser and are not uploaded for processing.",
          tone: "local"
        },
        {
          badge: "Validation",
          description: "Malformed Base64 and invalid UTF-8 are surfaced as explicit errors before the output can be reused.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral Base64 converter library and page behavior as the source reference.",
        badge: "Source",
        accent: "cyan"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, mode and alphabet controls, normalization warnings, stats, and copy-ready output.",
        badge: "Ready",
        accent: "emerald"
      }
    ],
    relatedSlugs: ["url-encoder", "html-entity-encoder", "json-repair"],
    outcome: "Native Base64 Converter workspace for local standard and URL-safe payload conversion"
  },
  "case-converter": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "Case Converter is now a native Toolars workspace for local naming conversion across developer and writing case formats.",
    overview:
      "Case Converter transforms pasted identifiers, labels, headings, and mixed-delimiter text into copy-ready naming styles including camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, Sentence case, dot.case, lower case, and UPPER CASE. The workspace migrates the Aixtral source behavior into a Toolars-native interface with detected word review, local-only processing, and copy actions for code, docs, and slug handoff.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "10", label: "Case formats" },
      { value: "Public", label: "Workspace status" },
      { value: "Words", label: "Delimiter review" }
    ],
    howItWorks: [
      {
        title: "Paste naming text",
        description: "Add a variable name, API field, heading, filename, or mixed separator string directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Detect words",
        description: "Split camelCase, PascalCase, snake_case, kebab-case, dot.case, spaces, acronyms, and punctuation into reviewable tokens.",
        badge: "Parse",
        tone: "local"
      },
      {
        title: "Generate variants",
        description: "Create copy-ready developer and writing formats side by side for identifiers, documentation, and content workflows.",
        badge: "Output"
      },
      {
        title: "Review edge cases",
        description: "Check acronym capitalization and mixed delimiter results before copying into code, docs, or downstream slug workflows.",
        badge: "Review",
        tone: "warn"
      }
    ],
    trustSection: {
      title: "Local case conversion model",
      rows: [
        {
          badge: "Local",
          description: "Input text is parsed and converted in the browser without upload.",
          tone: "local"
        },
        {
          badge: "Deterministic",
          description: "Conversion uses transparent string rules, so generated outputs are stable and easy to review."
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral Case Converter utility functions and client behavior as the source reference.",
        badge: "Source",
        accent: "blue"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, detected word review, 10 generated formats, and public catalog readiness.",
        badge: "Ready",
        accent: "emerald"
      }
    ],
    relatedSlugs: ["slug-generator", "text-stats", "lorem-ipsum"],
    outcome: "Native Case Converter workspace for local naming normalization and copy-ready case variants"
  },
  "slug-generator": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "Slug Generator is now a native Toolars workspace for local URL slug creation, batch cleanup, and duplicate-safe publishing handoff.",
    overview:
      "Slug Generator turns titles, labels, filenames, and content drafts into clean URL-friendly slugs with configurable separators, lowercase handling, transliteration, max length, and duplicate suffixing. The workspace migrates the Aixtral source behavior into Toolars-native input, option, result, and history panels so editors and developers can prepare stable URLs locally before publishing.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "3", label: "Separator styles" },
      { value: "Public", label: "Workspace status" },
      { value: "Batch", label: "Input mode" }
    ],
    howItWorks: [
      {
        title: "Paste titles",
        description: "Add one title or multiple lines of headings, labels, filenames, or content ideas directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Choose slug rules",
        description: "Select hyphen, underscore, or dot separators, then control lowercase output, ASCII transliteration, max length, and duplicate suffixes.",
        badge: "Options"
      },
      {
        title: "Generate clean slugs",
        description: "Normalize punctuation, whitespace, accents, repeated separators, and duplicate rows into copy-ready URL segments.",
        badge: "Output"
      },
      {
        title: "Review before publish",
        description: "Check duplicates, truncated terms, routing constraints, and recent history before copying slugs into a CMS, docs site, or route map.",
        badge: "Review",
        tone: "warn"
      }
    ],
    trustSection: {
      title: "Local slug generation model",
      rows: [
        {
          badge: "Local",
          description: "Source titles are processed in the browser and are not uploaded for slug generation.",
          tone: "local"
        },
        {
          badge: "Deterministic",
          description: "Slug output comes from transparent string rules, so separator, case, transliteration, and duplicate handling remain reviewable."
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral Slug Generator utility functions and client behavior as the source reference.",
        badge: "Source",
        accent: "emerald"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, batch duplicate handling, option review, history cleanup, and public catalog readiness.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs: ["case-converter", "url-encoder", "text-stats"],
    outcome: "Native Slug Generator workspace for local URL slug creation and publishing handoff"
  },
  "text-stats": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "Text Stats is now a native Toolars workspace for local copy analysis, structure review, and reading-time handoff.",
    overview:
      "Text Stats analyzes pasted copy for characters, non-space characters, words, sentences, paragraphs, lines, estimated reading time, estimated speaking time, and repeated top words. The workspace migrates the Aixtral source behavior into Toolars-native input, metric, top-word, and review panels so writers, editors, and developers can inspect copy locally before publishing.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "8", label: "Core metrics" },
      { value: "Public", label: "Workspace status" },
      { value: "10", label: "Top-word limit" }
    ],
    howItWorks: [
      {
        title: "Paste copy",
        description: "Add drafts, docs, snippets, release notes, or article sections directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Calculate structure",
        description: "Count words, characters, sentences, paragraphs, and lines with deterministic browser-side rules.",
        badge: "Stats"
      },
      {
        title: "Estimate timing",
        description: "Use 200 words per minute for reading time and 130 words per minute for speaking time estimates.",
        badge: "Timing"
      },
      {
        title: "Review repetition",
        description: "Inspect the top repeated words before handing copy to case conversion, slug generation, or publishing.",
        badge: "Review",
        tone: "warn"
      }
    ],
    trustSection: {
      title: "Local text analysis model",
      rows: [
        {
          badge: "Local",
          description: "Source text is analyzed in the browser and is not uploaded for metric calculation.",
          tone: "local"
        },
        {
          badge: "Deterministic",
          description: "Counts and timing estimates come from transparent local rules, so results remain reviewable."
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral Text Statistics utility function and client behavior as the source reference.",
        badge: "Source",
        accent: "indigo"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, structure metrics, reading and speaking estimates, top-word review, and public catalog readiness.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs: ["case-converter", "slug-generator", "lorem-ipsum"],
    outcome: "Native Text Stats workspace for local copy analysis and publishing review"
  },
  "uuid-generator": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "UUID Generator is now a native Toolars workspace for local UUID v4 generation, validation, and fixture handoff.",
    overview:
      "UUID Generator creates random UUID v4 identifiers in single or bulk batches for database keys, sessions, request traces, fixtures, and distributed-system workflows. The workspace migrates the Aixtral source behavior into Toolars-native quantity controls, result review, single-item copy, copy-all output, and range validation so developers can create identifiers locally before pasting them into tests, configs, or APIs.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "1-1000", label: "Batch range" },
      { value: "Public", label: "Workspace status" },
      { value: "v4", label: "UUID version" }
    ],
    howItWorks: [
      {
        title: "Choose quantity",
        description: "Set a count from 1 to 1000 depending on whether you need one identifier or a bulk fixture list.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Generate UUID v4",
        description: "Create RFC 4122-style random UUID v4 values locally in the browser.",
        badge: "Generate"
      },
      {
        title: "Review identifiers",
        description: "Inspect generated values, version metadata, and supported range before copying into downstream systems.",
        badge: "Review"
      },
      {
        title: "Copy single or batch",
        description: "Copy individual identifiers or the full newline-separated batch for seed data, tests, logs, and API clients.",
        badge: "Output",
        tone: "warn"
      }
    ],
    trustSection: {
      title: "Local UUID generation model",
      rows: [
        {
          badge: "Local",
          description: "UUIDs are generated in the browser and are not uploaded for processing.",
          tone: "local"
        },
        {
          badge: "Deterministic contract",
          description: "The tool keeps the Aixtral 1 to 1000 count boundary and validates UUID format with transparent local rules."
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral UUID Generator utility functions and client behavior as the source reference.",
        badge: "Source",
        accent: "violet"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, quantity validation, batch output, copy actions, metadata review, and public catalog readiness.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs: ["base64-converter", "url-encoder", "mcp-server-builder"],
    outcome: "Native UUID Generator workspace for local identifier generation and fixture handoff"
  },
  "url-encoder": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "URL Encoder is now a native Toolars workspace for local percent encoding, decoding, and invalid sequence review.",
    overview:
      "URL Encoder converts raw URL component text into percent-encoded output and decodes percent-encoded strings back to readable text. The workspace migrates the Aixtral source behavior into Toolars-native controls, keeps query values and route fragments local, reports invalid percent sequences before copy, and gives developers a focused handoff for links, query parameters, redirects, and API debugging.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "2-way", label: "Encode and decode" },
      { value: "Public", label: "Workspace status" },
      { value: "Percent", label: "Encoding model" }
    ],
    howItWorks: [
      {
        title: "Paste URL text",
        description: "Add raw URL components, query values, route fragments, or already percent-encoded text directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Choose conversion mode",
        description: "Switch between encode and decode so links, redirects, and API parameters can be prepared or inspected.",
        badge: "Mode"
      },
      {
        title: "Validate percent sequences",
        description: "Decode mode catches malformed percent-encoded input and blocks copy-ready output until the value is fixed.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Copy URL-safe output",
        description: "Review character counts, ratio, validation state, and converted text before copying into code, docs, or dashboards.",
        badge: "Output"
      }
    ],
    trustSection: {
      title: "Local URL conversion model",
      rows: [
        {
          badge: "Local",
          description: "URL text is encoded or decoded in the browser and is not uploaded for processing.",
          tone: "local"
        },
        {
          badge: "Validation",
          description: "Invalid percent-encoded sequences are surfaced as explicit errors before output can be reused.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral URL Encoder utility functions and client behavior as the source reference.",
        badge: "Source",
        accent: "sky"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, mode controls, invalid-percent review, conversion stats, and copy-ready output.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs: ["base64-converter", "slug-generator", "html-entity-encoder"],
    outcome: "Native URL Encoder workspace for local percent encoding, decoding, and query-value review"
  },
  "html-entity-encoder": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "HTML Entity Encoder is now a native Toolars workspace for local safe rendering conversion and entity review.",
    overview:
      "HTML Entity Encoder converts special characters into named, decimal, or hexadecimal HTML entities and decodes mixed entity strings back to readable text for safe rendering review. The workspace migrates the Aixtral source behavior into Toolars-native controls, keeps snippets local, counts converted entities, and helps developers review template copy before it is pasted into pages, docs, CMS fields, or debugging notes.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "Named", label: "Entity support" },
      { value: "Public", label: "Workspace status" },
      { value: "3", label: "Encoding styles" }
    ],
    howItWorks: [
      {
        title: "Paste HTML text",
        description: "Add raw snippets, text containing special characters, or existing named and numeric entities directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Choose entity mode",
        description: "Encode with named, decimal, or hexadecimal entities, or decode mixed entity strings back to readable text.",
        badge: "Mode"
      },
      {
        title: "Review rendering safety",
        description: "Compare converted entity counts and decoded text before rendering output as HTML or placing it into templates.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Copy safe output",
        description: "Copy the reviewed entity output for docs, frontend fixtures, CMS fields, and source-code comments.",
        badge: "Output"
      }
    ],
    trustSection: {
      title: "Local HTML entity conversion model",
      rows: [
        {
          badge: "Local",
          description: "Snippets are converted in the browser and are not uploaded for processing.",
          tone: "local"
        },
        {
          badge: "Review",
          description: "Decoded HTML-looking text is shown as text so users can review it before rendering or publishing.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral HTML Entity Encoder table and conversion behavior as the source reference.",
        badge: "Source",
        accent: "amber"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, entity style controls, safe rendering review, stats, and copy-ready output.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs: ["base64-converter", "url-encoder", "json-repair"],
    outcome: "Native HTML Entity Encoder workspace for local safe rendering conversion and entity review"
  },
  "lorem-ipsum": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "Lorem Ipsum Generator is now a native Toolars workspace for local placeholder copy generation and layout review.",
    overview:
      "Lorem Ipsum Generator creates configurable placeholder copy for mockups, wireframes, print layouts, CMS drafts, and content QA. The workspace migrates the Aixtral paragraph and word range constraints into Toolars-native controls, keeps generation local, supports classic Lorem ipsum starts, reports paragraph, word, and character counts, and includes copy-all output for layout testing handoff.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "1-100", label: "Paragraph range" },
      { value: "Public", label: "Workspace status" },
      { value: "5-500", label: "Words per paragraph" }
    ],
    howItWorks: [
      {
        title: "Set copy shape",
        description: "Choose paragraph count, words per paragraph, and whether the first paragraph starts with classic Lorem ipsum text.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Generate placeholder text",
        description: "Create deterministic local copy blocks that preserve the Aixtral 1 to 100 paragraph and 5 to 500 word constraints.",
        badge: "Generate"
      },
      {
        title: "Review layout fit",
        description: "Check paragraph, word, and character counts before using the copy in prototypes, CMS previews, or print layouts.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Copy all output",
        description: "Copy the full generated block for mockups, wireframes, content planning, or downstream text statistics review.",
        badge: "Output"
      }
    ],
    trustSection: {
      title: "Local placeholder copy model",
      rows: [
        {
          badge: "Local",
          description: "Placeholder text is generated in the browser and is not uploaded for processing.",
          tone: "local"
        },
        {
          badge: "Range",
          description: "The workspace preserves the source paragraph and word limits so generated copy stays intentional.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral Lorem Ipsum Generator constraints and copy flow as the source reference.",
        badge: "Source",
        accent: "rose"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, paragraph and word controls, range validation, copy-all output, and public catalog readiness.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs: ["text-stats", "case-converter", "slug-generator"],
    outcome: "Native Lorem Ipsum workspace for local placeholder copy generation and layout review"
  },
  "csv-to-json": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "CSV to JSON Converter is now a native Toolars workspace for local table parsing, header review, and JSON output.",
    overview:
      "CSV to JSON Converter turns pasted CSV rows into structured JSON records with header handling, delimiter options, skipped-empty-row behavior, quoted fields, escaped quotes, and embedded newlines. The workspace migrates the Aixtral parser into Toolars-native controls, keeps table data local, reports inconsistent row shapes, and gives data teams copy-ready JSON for fixtures, imports, QA notes, and API debugging.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "CSV", label: "Source format" },
      { value: "Public", label: "Workspace status" },
      { value: "3", label: "Delimiter options" }
    ],
    howItWorks: [
      {
        title: "Paste CSV rows",
        description: "Add comma, semicolon, or tab-delimited data with optional headers directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Choose table options",
        description: "Set delimiter, header mode, and skipped-empty-row behavior before parsing the source text.",
        badge: "Options"
      },
      {
        title: "Review row shape",
        description: "Surface inconsistent column counts and empty-header issues before the JSON output is copied.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Copy JSON records",
        description: "Review row count, column count, skipped rows, and formatted JSON before handing data to code or docs.",
        badge: "Output"
      }
    ],
    trustSection: {
      title: "Local CSV parsing model",
      rows: [
        {
          badge: "Local",
          description: "CSV text is parsed in the browser and is not uploaded for processing.",
          tone: "local"
        },
        {
          badge: "Validation",
          description: "Quoted fields, escaped quotes, embedded newlines, and inconsistent column counts are handled before output reuse.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral CSV parser behavior and tests as the source reference.",
        badge: "Source",
        accent: "emerald"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, delimiter controls, header and empty-row options, validation stats, and copy-ready JSON.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs: ["json-to-csv", "json-diff", "json-repair"],
    outcome: "Native CSV to JSON workspace for local table parsing and structured JSON handoff"
  },
  "json-to-csv": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "JSON to CSV Converter is now a native Toolars workspace for local object-array export and escaped CSV output.",
    overview:
      "JSON to CSV Converter turns arrays of objects into escaped CSV rows with header discovery, nested-value handling, null handling, and row statistics. The workspace migrates the Aixtral JSON export behavior into Toolars-native controls, keeps records local, rejects non-array and non-object inputs, and gives teams copy-ready CSV for spreadsheets, fixture exports, issue reports, and data QA handoff.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "Rows", label: "Export target" },
      { value: "Public", label: "Workspace status" },
      { value: "CSV", label: "Output format" }
    ],
    howItWorks: [
      {
        title: "Paste JSON array",
        description: "Add object arrays intended for CSV export directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Discover headers",
        description: "Collect unique object keys in source order and preserve blank cells for missing values.",
        badge: "Headers"
      },
      {
        title: "Validate record shape",
        description: "Reject invalid JSON, non-array input, and arrays with primitive items before CSV output appears.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Copy CSV rows",
        description: "Review row count, column count, discovered headers, and escaped output before export handoff.",
        badge: "Output"
      }
    ],
    trustSection: {
      title: "Local JSON export model",
      rows: [
        {
          badge: "Local",
          description: "JSON records are parsed and converted in the browser and are not uploaded for processing.",
          tone: "local"
        },
        {
          badge: "Validation",
          description: "The workspace blocks invalid JSON and non-object arrays before copy-ready CSV is shown.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral JSON to CSV conversion behavior and tests as the source reference.",
        badge: "Source",
        accent: "cyan"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, delimiter controls, row and column stats, validation errors, and copy-ready CSV.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs: ["csv-to-json", "markdown-to-json", "json-repair"],
    outcome: "Native JSON to CSV workspace for local record export and spreadsheet handoff"
  },
  "json-diff": aixtralNativeDetail({
    summary: "JSON Diff Checker is now a native Toolars workspace for local payload comparison and JSONPath-style review.",
    overview:
      "JSON Diff Checker compares two JSON-compatible values and reports changed, added, and removed paths for debugging API payloads, fixtures, config snapshots, and release test data. The native Toolars workspace parses both payloads locally, returns JSONPath-style differences, summarizes changed path counts, and gives developers copy-ready diff output before data is pasted into tickets, tests, or API docs.",
    metric: { value: "Paths", label: "Diff output" },
    inputTitle: "Paste two payloads",
    inputDescription: "Accept original and modified JSON values in split local editors before comparison.",
    resultTitle: "List path changes",
    resultDescription: "Report JSONPath-style locations with added, removed, and changed values for quick review.",
    reviewTitle: "Check parse safety",
    reviewDescription: "Keep invalid JSON, changed top-level types, and unexpected null values visible in the result state.",
    sourceDescription: "Uses the Aixtral JSON Diff recursive comparison behavior and tests as the source reference.",
    workspaceDescription: "Adds split input panes, path counts, parse errors, JSONPath-style output, and copy-ready diff summaries.",
    trustTitle: "Local JSON diff model",
    trustReviewDescription: "Invalid JSON is blocked before comparison, and every reported change keeps its JSONPath-style location visible.",
    relatedSlugs: ["json-repair", "yaml-validator", "xml-formatter"],
    outcome: "Native JSON Diff workspace for local payload comparison and path-level review",
    accent: "amber"
  }),
  "yaml-validator": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "YAML Validator is now a native Toolars workspace for local configuration checks and line-level issue review.",
    overview:
      "YAML Validator checks pasted configuration snippets, workflow files, docs front matter, and deployment settings for tabs, indentation warnings, trailing whitespace, long lines, empty list items, key counts, and depth. The workspace migrates the Aixtral validation behavior into Toolars-native controls, keeps configuration text local, separates errors from warnings, and helps teams review risky YAML before changes ship.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "YAML", label: "Validated format" },
      { value: "Public", label: "Workspace status" },
      { value: "Line", label: "Issue review" }
    ],
    howItWorks: [
      {
        title: "Paste YAML",
        description: "Add configuration snippets, CI files, docs front matter, or deployment settings directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Run validation",
        description: "Check tabs, indentation, trailing whitespace, long lines, empty list items, key counts, and maximum depth.",
        badge: "Validate"
      },
      {
        title: "Review findings",
        description: "Separate blocking errors from style warnings with line numbers before a config handoff.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Ship safer config",
        description: "Use the stats and issue list to clean YAML before opening a pull request or updating deployment settings.",
        badge: "Handoff"
      }
    ],
    trustSection: {
      title: "Local YAML validation model",
      rows: [
        {
          badge: "Local",
          description: "YAML text is inspected in the browser and is not uploaded for processing.",
          tone: "local"
        },
        {
          badge: "Review",
          description: "The validator separates syntax blockers from style warnings so config changes can be triaged quickly.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral YAML Validator issue rules and tests as the source reference.",
        badge: "Source",
        accent: "blue"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, stats, error and warning lists, and public catalog readiness.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs: ["json-repair", "json-diff", "xml-formatter"],
    outcome: "Native YAML Validator workspace for local configuration issue review"
  },
  "xml-formatter": aixtralNativeDetail({
    summary: "XML Formatter is now a native Toolars workspace for local format and minify workflows.",
    overview:
      "XML Formatter can format and minify compact XML into readable indentation or compact tag whitespace for feeds, SOAP payloads, manifests, and configuration review. The native Toolars workspace migrates the Aixtral formatting behavior into local controls, keeps markup in the browser, reports line, tag, and character counts, and supports copy-ready XML output for developers reviewing structured payloads.",
    metric: { value: "2-way", label: "Format and minify" },
    inputTitle: "Paste XML",
    inputDescription: "Accept XML snippets, feed fragments, or config payloads as local source text.",
    resultTitle: "Format or minify",
    resultDescription: "Return readable indentation or compact XML while preserving declarations, tags, and text nodes.",
    reviewTitle: "Catch empty input",
    reviewDescription: "Keep empty input, malformed structures, and formatting assumptions visible before copy or handoff.",
    sourceDescription: "Uses the Aixtral XML Formatter implementation and tests as the source behavior reference.",
    workspaceDescription: "Adds format and minify modes, indentation control, markup stats, empty-input errors, and copy-ready output.",
    trustTitle: "Local XML formatting model",
    trustReviewDescription: "The workspace keeps formatting assumptions visible, including empty input and whitespace-sensitive minify behavior.",
    relatedSlugs: ["yaml-validator", "json-diff", "html-entity-encoder"],
    outcome: "Native XML Formatter workspace for local format, minify, and markup handoff",
    accent: "violet"
  }),
  "markdown-to-json": aixtralNativeDetail({
    summary: "Markdown to JSON Converter is now a native Toolars workspace for local content structure extraction.",
    overview:
      "Markdown to JSON Converter extracts headings, paragraphs, lists, code blocks, links, images, metadata, word count, and reading-time hints from Markdown into structured JSON. The native Toolars workspace migrates the Aixtral parser behavior into a local content tool, reports block counts, keeps drafts in the browser, and gives editors and developers copy-ready structured JSON for docs, changelogs, CMS handoff, and fixture generation.",
    metric: { value: "Blocks", label: "Parsed structure" },
    inputTitle: "Paste Markdown",
    inputDescription: "Accept notes, docs, changelog drafts, or article bodies for local structural parsing.",
    resultTitle: "Create structured JSON",
    resultDescription: "Return metadata, content blocks, headings, lists, code blocks, links, images, and text stats.",
    reviewTitle: "Review parser limits",
    reviewDescription: "Keep unsupported markdown shapes, malformed links, and empty documents visible before export.",
    sourceDescription: "Uses the Aixtral Markdown to JSON parser implementation and tests as the migration source.",
    workspaceDescription: "Adds a native Markdown editor, block metrics, structured JSON output, copy controls, and content QA notes.",
    trustTitle: "Local Markdown parser model",
    trustReviewDescription: "Parsed headings, links, images, and code blocks remain inspectable before structured JSON is reused.",
    relatedSlugs: ["text-stats", "json-to-csv", "json-repair"],
    outcome: "Native Markdown to JSON workspace for local structured JSON content handoff",
    accent: "slate"
  }),
  "diff-checker": aixtralNativeDetail({
    summary: "Diff Checker is now a native Toolars workspace for local line-level text comparison.",
    overview:
      "Diff Checker compares two versions of text and reports line-level additions, removals, unchanged lines, and total change counts for copy review, release notes, and lightweight document QA. The native Toolars workspace migrates the Aixtral LCS-based comparison behavior into split text panes, keeps drafts local, summarizes changed lines, and gives copy-ready diff output for review handoff.",
    metric: { value: "Lines", label: "Comparison unit" },
    inputTitle: "Paste two versions",
    inputDescription: "Accept original and revised text blocks for local comparison without upload.",
    resultTitle: "Show changed lines",
    resultDescription: "Return added, removed, and unchanged lines with counts that can drive a future diff view.",
    reviewTitle: "Check review context",
    reviewDescription: "Make empty inputs, large pasted documents, and line-number assumptions visible before users rely on it.",
    sourceDescription: "Uses the Aixtral Diff Checker LCS implementation and local tests as the source reference.",
    workspaceDescription: "Adds split text input, changed-line metrics, plain-text diff output, and copyable summaries.",
    trustTitle: "Local text diff model",
    trustReviewDescription: "Line-level additions and removals stay visible so reviewers do not mistake this for semantic merge review.",
    relatedSlugs: ["text-diff", "text-stats", "json-diff"],
    outcome: "Native Diff Checker workspace for local line-level text review",
    accent: "orange"
  }),
  "text-diff": aixtralNativeDetail({
    summary: "Text Diff is now a native Toolars workspace for option-aware local text comparison.",
    overview:
      "Text Diff compares two text blocks with options to ignore whitespace, ignore case, or trim lines before calculating additions, removals, unchanged lines, and total changes. The native Toolars workspace migrates the Aixtral option-aware comparison model into local controls, preserves left and right line numbers, makes normalization choices visible, and gives reviewers copy-ready diff output.",
    metric: { value: "Options", label: "Comparison modes" },
    inputTitle: "Paste text versions",
    inputDescription: "Accept left and right text inputs plus whitespace, case, and trimming preferences for local review.",
    resultTitle: "Compute diff lines",
    resultDescription: "Return normalized line comparison with left and right line numbers for review-oriented display.",
    reviewTitle: "Verify comparison mode",
    reviewDescription: "Keep normalization choices visible so ignored whitespace or case changes are not misread as exact matches.",
    sourceDescription: "Uses the Aixtral Text Diff options, line numbering, and tests as the behavior source.",
    workspaceDescription: "Adds ignore whitespace, ignore case, trim line toggles, metrics, and copyable option-aware diff output.",
    trustTitle: "Local option-aware diff model",
    trustReviewDescription: "Normalization choices stay visible so ignored whitespace, casing, or trim changes are not mistaken for exact matches.",
    relatedSlugs: ["diff-checker", "case-converter", "text-stats"],
    outcome: "Native Text Diff workspace for local option-aware comparison and review handoff",
    accent: "pink"
  }),
  "url-parser": aixtralNativeDetail({
    summary: "URL Parser is now a native Toolars workspace for local URL inspection, query review, and component handoff.",
    overview:
      "URL Parser breaks absolute URLs into protocol, origin, hostname, port, pathname, hash, and query pairs while preserving duplicate query keys for review. The native Toolars workspace migrates the Aixtral parsing behavior into local controls, keeps pasted URLs in the browser, surfaces invalid URL errors, and gives developers copy-ready component summaries before they debug redirects, links, and API clients.",
    metric: { value: "URL", label: "Parsed input" },
    inputTitle: "Paste a URL",
    inputDescription: "Accept absolute URLs that need local inspection before debugging, ticket handoff, or sharing.",
    resultTitle: "Break down components",
    resultDescription: "Return protocol, origin, hostname, pathname, hash, query count, and decoded query pairs.",
    reviewTitle: "Review malformed input",
    reviewDescription: "Make invalid URLs, missing protocols, duplicate query keys, and sensitive query values visible before copy.",
    sourceDescription: "Uses the Aixtral URL Parser implementation and tests as the behavior reference.",
    workspaceDescription: "Adds a native parser workbench, query-pair review, component metrics, invalid URL handling, and copy-ready summaries.",
    trustTitle: "Local URL parsing model",
    trustReviewDescription: "Parsed query values stay visible so users can review duplicate keys, fragments, and sensitive parameters before reuse.",
    relatedSlugs: ["url-encoder", "slug-generator", "html-entity-encoder"],
    outcome: "Native URL Parser workspace for local URL inspection and query handoff",
    accent: "teal"
  }),
  "number-base-converter": aixtralNativeDetail({
    summary: "Number Base Converter is now a native Toolars workspace for exact local binary, octal, decimal, and hexadecimal conversion.",
    overview:
      "Number Base Converter converts values between binary, octal, decimal, and hexadecimal with source-base validation, BigInt-backed precision, and optional Unicode character preview for printable code points. The native Toolars workspace migrates the Aixtral conversion behavior into local base selectors, keeps values in the browser, flags invalid digits, and gives developers copy-ready outputs for debugging IDs, flags, encodings, and low-level number formats.",
    metric: { value: "4", label: "Number bases" },
    inputTitle: "Enter a number",
    inputDescription: "Accept a value and source base while keeping parsing local and explicit.",
    resultTitle: "Convert bases",
    resultDescription: "Return binary, octal, decimal, hexadecimal, normalized source value, and Unicode preview when printable.",
    reviewTitle: "Check precision and validity",
    reviewDescription: "Flag invalid digits, empty values, source-base mismatch, and Unicode assumptions before users trust conversion output.",
    sourceDescription: "Uses the Aixtral Number Base Converter implementation and tests as the source behavior reference.",
    workspaceDescription: "Adds a native workbench, source base selector, BigInt conversion, validation errors, Unicode preview, and copy-ready outputs.",
    trustTitle: "Local number conversion model",
    trustReviewDescription: "Source-base validation remains visible so invalid digits or unsupported values are not silently converted.",
    relatedSlugs: ["unit-converter", "percentage-calculator", "uuid-generator"],
    outcome: "Native Number Base Converter workspace for exact local base conversion and Unicode preview",
    accent: "indigo"
  }),
  "file-size-converter": aixtralNativeDetail({
    summary: "File Size Converter is now a native Toolars workspace for local SI and IEC storage unit conversion.",
    overview:
      "File Size Converter converts file sizes across bytes, KB, MB, GB, TB, PB, and IEC units such as KiB, MiB, GiB, TiB, and PiB. The native Toolars workspace migrates the Aixtral conversion behavior into decimal and binary mode controls, keeps values in the browser, rejects negative or non-finite input, formats copy-ready result tables, and makes SI versus IEC assumptions explicit before storage and transfer estimates are reused.",
    metric: { value: "SI/IEC", label: "Unit modes" },
    inputTitle: "Enter file size",
    inputDescription: "Accept a numeric amount, source unit, and decimal or binary conversion mode.",
    resultTitle: "Convert units",
    resultDescription: "Return all units in the selected family with formatted values and byte-level output.",
    reviewTitle: "Check unit assumptions",
    reviewDescription: "Keep decimal versus binary mode, zero values, invalid numeric input, and rounding assumptions visible before copy.",
    sourceDescription: "Uses the Aixtral File Size Converter implementation and tests as the conversion source.",
    workspaceDescription: "Adds SI and IEC unit pickers, mode-aware result tables, invalid input handling, formatting, and copy-ready output.",
    trustTitle: "Local file size conversion model",
    trustReviewDescription: "Decimal and binary mode labels stay visible so users do not mix SI and IEC estimates.",
    relatedSlugs: ["unit-converter", "pdf-compressor", "csv-to-json"],
    outcome: "Native File Size Converter workspace for local SI and IEC conversion",
    accent: "emerald"
  }),
  "chmod-calculator": aixtralNativeDetail({
    summary: "Chmod Calculator is now a native Toolars workspace for local Unix permission review and command handoff.",
    overview:
      "Chmod Calculator translates Unix file permissions between octal notation, symbolic notation, owner-group-other permission bits, readable descriptions, and copy-ready chmod commands. The native Toolars workspace migrates the Aixtral permission helpers into a local review flow, keeps modes in the browser, flags invalid permission input, highlights broad write and execute access, and helps developers inspect risky modes before they paste shell commands.",
    metric: { value: "rwx", label: "Permission model" },
    inputTitle: "Set permissions",
    inputDescription: "Accept 3-digit octal values or 9-character symbolic notation for local permission review.",
    resultTitle: "Calculate chmod output",
    resultDescription: "Return octal mode, symbolic mode, readable permission summary, warnings, and copy-ready chmod command.",
    reviewTitle: "Check unsafe modes",
    reviewDescription: "Make invalid octal values, missing permission groups, broad execute access, and world-writable modes visible before copy.",
    sourceDescription: "Uses the Aixtral Chmod Calculator helpers and tests as the permission behavior reference.",
    workspaceDescription: "Adds a native permission input, warning review, command output, local validation, and copy-ready chmod handoff.",
    trustTitle: "Local permission calculation model",
    trustReviewDescription: "Unsafe modes and invalid permission strings stay visible before users copy a chmod command.",
    relatedSlugs: ["yaml-validator", "mcp-server-builder", "json-diff"],
    outcome: "Native Chmod Calculator workspace for local permission review and command handoff",
    accent: "slate"
  }),
  "ipv4-subnet-calculator": aixtralNativeDetail({
    summary: "IPv4 Subnet Calculator is now a native Toolars workspace for local CIDR planning and address-range review.",
    overview:
      "IPv4 Subnet Calculator computes network address, broadcast address, subnet mask, wildcard mask, usable host range, host count, IP class, and binary network views from an IPv4 address and CIDR prefix. The native Toolars workspace migrates the Aixtral subnet behavior into local inputs, handles /31, /32, and /0 boundary cases without signed overflow, keeps addresses in the browser, and gives network reviewers copy-ready subnet summaries.",
    metric: { value: "CIDR", label: "Network output" },
    inputTitle: "Enter IPv4 and prefix",
    inputDescription: "Accept an IPv4 address and CIDR prefix for local subnet calculation.",
    resultTitle: "Calculate subnet details",
    resultDescription: "Return mask, network address, broadcast address, usable range, host count, class, and binary view.",
    reviewTitle: "Check boundary cases",
    reviewDescription: "Keep invalid IPs, invalid prefixes, /31, /32, /0, and host-count assumptions visible before use.",
    sourceDescription: "Uses the Aixtral IPv4 Subnet Calculator implementation and tests as the source behavior reference.",
    workspaceDescription: "Adds CIDR inputs, boundary-safe arithmetic, subnet detail rows, binary display, validation errors, and copy actions.",
    trustTitle: "Local subnet calculation model",
    trustReviewDescription: "CIDR boundary assumptions and usable-host counts stay visible before users apply subnet output.",
    relatedSlugs: ["url-parser", "json-repair", "mcp-server-builder"],
    outcome: "Native IPv4 Subnet Calculator workspace for local CIDR planning and network handoff",
    accent: "blue"
  }),
  "timestamp-converter": aixtralNativeDetail({
    summary: "Timestamp Converter is now a native Toolars workspace for local Unix time conversion and timezone review.",
    overview:
      "Timestamp Converter converts Unix timestamps in seconds or milliseconds and ISO-like date strings into ISO, UTC, local, relative, and normalized Unix-second outputs. The native Toolars workspace migrates the Aixtral time conversion behavior into local controls, keeps values in the browser, detects timestamp precision, exposes current-time helpers, rejects invalid input, and makes timezone assumptions visible before developers copy date values.",
    metric: { value: "Unix", label: "Time format" },
    inputTitle: "Enter timestamp",
    inputDescription: "Accept Unix timestamps in seconds or milliseconds plus date strings that need local conversion.",
    resultTitle: "Convert to readable dates",
    resultDescription: "Return Unix seconds, precision, local date, UTC date, ISO output, and relative labels.",
    reviewTitle: "Review timezone assumptions",
    reviewDescription: "Make timezone, seconds-versus-milliseconds, relative labels, and invalid timestamp handling visible before copy.",
    sourceDescription: "Uses the Aixtral Timestamp Converter implementation and client behavior as the source reference.",
    workspaceDescription: "Adds a native timestamp input, current-time helper, precision detection, validation errors, and copy-ready date outputs.",
    trustTitle: "Local timestamp conversion model",
    trustReviewDescription: "Precision and timezone labels stay visible so seconds, milliseconds, UTC, and local values are not mixed up.",
    relatedSlugs: ["text-stats", "uuid-generator", "url-parser"],
    outcome: "Native Timestamp Converter workspace for local Unix time conversion and date handoff",
    accent: "orange"
  }),
  "user-agent-parser": aixtralNativeDetail({
    summary: "User Agent Parser is now a native Toolars workspace for local browser, OS, device, and engine inspection.",
    overview:
      "User Agent Parser analyzes browser and crawler User-Agent strings to detect browser name and version, operating system, device type, rendering engine, and raw string context with dependency-free rules. The native Toolars workspace migrates the Aixtral parser into local controls, keeps User-Agent strings in the browser, identifies bots and common mobile/tablet cases, and gives QA and support teams copy-ready environment summaries.",
    metric: { value: "UA", label: "Parsed signal" },
    inputTitle: "Paste User-Agent",
    inputDescription: "Accept browser, mobile, tablet, or crawler User-Agent strings for local parsing and inspection.",
    resultTitle: "Detect browser context",
    resultDescription: "Return browser, OS, device type, rendering engine, version hints, and normalized summary labels.",
    reviewTitle: "Check parser confidence",
    reviewDescription: "Make unknown browsers, spoofed strings, bots, and rule limitations visible before using parsed output.",
    sourceDescription: "Uses the Aixtral User Agent Parser implementation and tests as the behavior reference.",
    workspaceDescription: "Adds a native parser workbench, browser and OS metrics, device review, engine output, and copy-ready summaries.",
    trustTitle: "Local User-Agent parsing model",
    trustReviewDescription: "Parser limitations stay visible because User-Agent strings can be spoofed or omit reliable browser signals.",
    relatedSlugs: ["url-parser", "json-repair", "mcp-server-builder"],
    outcome: "Native User Agent Parser workspace for local browser and device inspection",
    accent: "rose"
  }),
  "color-converter": aixtralNativeDetail({
    summary: "Color Converter is now a native Toolars workspace for local design-token color conversion and swatch review.",
    overview:
      "Color Converter translates HEX, RGB, HSL, HSV, CMYK, and common named colors into normalized copy-ready values for design systems, CSS reviews, product UI handoff, and accessibility checks. The native Toolars workspace keeps parsing and conversion local, shows a live swatch, reports invalid values, and gives designers and developers consistent output strings before values move into tokens, stylesheets, or tickets.",
    metric: { value: "5", label: "Output formats" },
    inputTitle: "Enter a color",
    inputDescription: "Accept HEX, RGB, HSL, HSV, CMYK, or named color input for local parsing and conversion.",
    resultTitle: "Convert formats",
    resultDescription: "Return normalized HEX, RGB, HSL, HSV, and CMYK strings with preview swatch metadata.",
    reviewTitle: "Check invalid values",
    reviewDescription: "Make unsupported names, out-of-range channels, and malformed values visible before output is copied.",
    sourceDescription: "Uses the Aixtral Color Converter implementation and tests as the base conversion reference.",
    workspaceDescription: "Adds a native color input, validation state, swatch preview, multi-format output rows, and public catalog readiness.",
    trustTitle: "Local color conversion model",
    trustReviewDescription: "Validation errors and format assumptions stay visible so malformed colors are not silently copied into design tokens.",
    relatedSlugs: ["color-contrast-checker", "color-palette-generator", "css-gradient-generator"],
    outcome: "Native Color Converter workspace for local design-token conversion",
    accent: "fuchsia"
  }),
  "color-contrast-checker": aixtralNativeDetail({
    summary: "Color Contrast Checker is now a native Toolars workspace for local WCAG ratio review and preview handoff.",
    overview:
      "Color Contrast Checker compares foreground and background colors, calculates contrast ratios, and reports WCAG AA and AAA readability status for normal and large text. The native Toolars workspace migrates the local-first Aixtral contrast math into Toolars controls, keeps color values in the browser, includes color swapping and preview states, and makes accessibility pass-fail labels clear before UI colors ship.",
    metric: { value: "WCAG", label: "Review target" },
    inputTitle: "Choose colors",
    inputDescription: "Accept foreground and background colors with local parsing and preview-friendly values.",
    resultTitle: "Calculate contrast",
    resultDescription: "Return contrast ratio, AA and AAA status, text-size guidance, and preview-ready result labels.",
    reviewTitle: "Confirm accessibility level",
    reviewDescription: "Keep failures, borderline ratios, and color parsing errors visible before design decisions ship.",
    sourceDescription: "Uses the Aixtral Color Contrast Checker luminance and WCAG helpers as the behavior source.",
    workspaceDescription: "Adds foreground/background inputs, color swapping, live preview, ratio metrics, pass-fail rows, and public readiness.",
    trustTitle: "Local WCAG contrast model",
    trustReviewDescription: "AA and AAA thresholds remain visible so teams can distinguish normal text, large text, and failed combinations.",
    relatedSlugs: ["color-converter", "color-palette-generator", "css-gradient-generator"],
    outcome: "Native Color Contrast Checker workspace for local accessibility review",
    accent: "yellow"
  }),
  "color-palette-generator": aixtralNativeDetail({
    summary: "Color Palette Generator is now a native Toolars workspace for local harmony palettes and CSS variable export.",
    overview:
      "Color Palette Generator creates harmonious palettes from a base color using complementary, analogous, triadic, split-complementary, tetradic, and monochromatic relationships, then adds tint and shade metadata for implementation handoff. The Toolars-native workspace keeps generation local, renders swatches, exports CSS variables, and makes palette assumptions inspectable before colors are reused in product UI.",
    metric: { value: "Harmony", label: "Palette model" },
    inputTitle: "Set a base color",
    inputDescription: "Accept a base color and palette style so generation can stay local and reproducible.",
    resultTitle: "Generate palette",
    resultDescription: "Return coordinated swatches, HSL values, harmony labels, and export-ready CSS token strings.",
    reviewTitle: "Check usability",
    reviewDescription: "Keep contrast, saturation, and naming assumptions visible before the palette moves into production UI.",
    sourceDescription: "Uses the Aixtral Color Palette Generator harmony, tint, shade, and export helpers as the migration reference.",
    workspaceDescription: "Adds base color and harmony controls, generated swatches, CSS variable export, and design QA notes.",
    trustTitle: "Local palette generation model",
    trustReviewDescription: "Generated palettes remain deterministic and reviewable before colors are promoted to design tokens.",
    relatedSlugs: ["color-converter", "color-contrast-checker", "css-gradient-generator"],
    outcome: "Native Color Palette Generator workspace for local palette and token handoff",
    accent: "rose"
  }),
  "css-gradient-generator": aixtralNativeDetail({
    summary: "CSS Gradient Generator is now a native Toolars workspace for local gradient preview and copy-ready CSS.",
    overview:
      "CSS Gradient Generator creates implementation-ready linear gradients from color stops and angle settings while preserving the Aixtral source model for linear, radial, and conic gradient strings in the local library. The Toolars workspace focuses the public flow on stable two-stop linear gradients with a live preview, generated CSS declaration, and design review prompts so frontend teams can move gradients into components or tokens without leaving the browser.",
    metric: { value: "CSS", label: "Gradient output" },
    inputTitle: "Set color stops",
    inputDescription: "Accept start color, end color, and angle settings for local gradient generation.",
    resultTitle: "Generate gradient CSS",
    resultDescription: "Return a preview gradient and copy-ready background declaration for implementation handoff.",
    reviewTitle: "Check visual fit",
    reviewDescription: "Make stop order, angle, token naming, and readability assumptions visible before CSS is copied.",
    sourceDescription: "Uses the Aixtral CSS Gradient Generator linear, radial, conic, and preset helpers as the behavior reference.",
    workspaceDescription: "Adds native color stop controls, angle input, preview surface, generated CSS output, and public catalog readiness.",
    trustTitle: "Local CSS gradient model",
    trustReviewDescription: "Gradient values stay inspectable so teams can verify stops, angles, and token handoff before reuse.",
    relatedSlugs: ["color-converter", "color-palette-generator", "css-border-radius-generator"],
    outcome: "Native CSS Gradient Generator workspace for local gradient CSS handoff",
    accent: "orange"
  }),
  "css-border-radius-generator": aixtralNativeDetail({
    summary: "CSS Border Radius Generator is now a native Toolars workspace for local corner controls and preview CSS.",
    overview:
      "CSS Border Radius Generator designs per-corner radius values, preview shapes, and implementation-ready CSS for cards, controls, avatars, and custom UI surfaces. The native Toolars workspace migrates the Aixtral shorthand behavior into stable numeric controls, keeps values local, shows whether output is simplified or expanded, and gives designers copy-ready border-radius declarations before styling changes ship.",
    metric: { value: "4", label: "Corner controls" },
    inputTitle: "Set corner radii",
    inputDescription: "Accept radius values for each corner plus px or percent unit selection.",
    resultTitle: "Preview CSS shape",
    resultDescription: "Return CSS border-radius output and preview metadata for rounded rectangle or custom corner shapes.",
    reviewTitle: "Check layout fit",
    reviewDescription: "Make extreme values, asymmetric shapes, and unit assumptions visible before the CSS is copied.",
    sourceDescription: "Uses the Aixtral CSS Border Radius Generator source behavior as the preview and code reference.",
    workspaceDescription: "Adds per-corner controls, unit selection, preview surface, simplified/expanded status, and copy-ready CSS.",
    trustTitle: "Local border-radius model",
    trustReviewDescription: "Unit and corner assumptions stay visible so asymmetric shapes are reviewed before implementation.",
    relatedSlugs: ["css-gradient-generator", "css-flexbox-generator", "css-grid-generator"],
    outcome: "Native CSS Border Radius Generator workspace for local shape and CSS handoff",
    accent: "orange"
  }),
  "css-flexbox-generator": aixtralNativeDetail({
    summary: "CSS Flexbox Generator is now a native Toolars workspace for local flex layout controls and CSS handoff.",
    overview:
      "CSS Flexbox Generator builds responsive flex layouts with direction, wrapping, alignment, justification, gap, and item basis controls. The native Toolars workspace migrates the Aixtral source behavior into local controls, renders a stable preview strip, and returns copy-ready container and item CSS so frontend teams can test layout assumptions before code is pasted into components.",
    metric: { value: "Flex", label: "Layout model" },
    inputTitle: "Configure flex layout",
    inputDescription: "Accept direction, wrap, align, justify, gap, and item settings for local layout generation.",
    resultTitle: "Generate flex CSS",
    resultDescription: "Return container and item CSS plus preview metadata that can drive a responsive layout canvas.",
    reviewTitle: "Inspect responsive behavior",
    reviewDescription: "Keep overflow, gap, wrapping, and alignment assumptions visible before code is copied into an app.",
    sourceDescription: "Use the Aixtral CSS Flexbox Generator implementation and messages as the behavior reference.",
    workspaceDescription: "Adds segmented layout controls, a stable preview, generated container/item CSS, warning notes, and public catalog readiness.",
    trustTitle: "Local CSS flexbox model",
    trustReviewDescription: "Generated values stay local, but teams should still test wrapping and overflow inside the target component width.",
    relatedSlugs: ["css-grid-generator", "css-border-radius-generator", "css-gradient-generator"],
    outcome: "Native CSS Flexbox Generator workspace for local layout and CSS export",
    accent: "blue"
  }),
  "css-grid-generator": aixtralNativeDetail({
    summary: "CSS Grid Generator is now a native Toolars workspace for local grid templates, gaps, and preview cells.",
    overview:
      "CSS Grid Generator creates grid layouts with column count, row count, gap values, min column widths, preview cells, and implementation-ready template output. The native Toolars workspace turns the Aixtral layout brief into a local editor with deterministic grid CSS, stable preview sizing, and review notes for mobile breakpoints before grid rules move into production styles.",
    metric: { value: "Grid", label: "Layout model" },
    inputTitle: "Configure grid",
    inputDescription: "Accept column, row, gap, area, and placement settings for local CSS Grid generation.",
    resultTitle: "Generate grid CSS",
    resultDescription: "Return grid-template rows, columns, areas, gap values, placement rules, and preview metadata.",
    reviewTitle: "Check template clarity",
    reviewDescription: "Make overlapping areas, empty cells, invalid names, and responsive assumptions visible before copying CSS.",
    sourceDescription: "Use the Aixtral CSS Grid Generator source implementation, tests, and messages as the migration reference.",
    workspaceDescription: "Adds column and row controls, gap settings, preview cells, generated grid CSS, warning notes, and public catalog readiness.",
    trustTitle: "Local CSS grid model",
    trustReviewDescription: "Grid output is generated in-browser; dense templates still need breakpoint review in the final app shell.",
    relatedSlugs: ["css-flexbox-generator", "css-border-radius-generator", "css-gradient-generator"],
    outcome: "Native CSS Grid Generator workspace for local template and CSS handoff",
    accent: "violet"
  }),
  "css-unit-converter": aixtralNativeDetail({
    summary: "CSS Unit Converter is now a native Toolars workspace for local sizing conversion with visible context assumptions.",
    overview:
      "CSS Unit Converter translates between px, rem, em, percent, viewport, and absolute CSS units while preserving assumptions such as root font size, current font size, parent dimensions, and viewport size. The native Toolars workspace provides local conversion output, formula notes, and copy-ready CSS values so designers and frontend engineers can review sizing decisions without sending layout values anywhere.",
    metric: { value: "11", label: "CSS units" },
    inputTitle: "Enter CSS value",
    inputDescription: "Accept a numeric value, source unit, target unit, and context assumptions for local conversion.",
    resultTitle: "Convert units",
    resultDescription: "Return equivalent CSS values with precision controls, formula notes, and copy-ready strings.",
    reviewTitle: "Review context assumptions",
    reviewDescription: "Keep root font size, parent size, viewport basis, and invalid unit choices visible before use.",
    sourceDescription: "Use the Aixtral CSS Unit Converter implementation and source messages as the behavior reference.",
    workspaceDescription: "Adds unit menus, numeric input, formula output, copy-ready CSS values, and public catalog readiness.",
    trustTitle: "Local CSS unit conversion model",
    trustReviewDescription: "Context-sensitive units such as em, percent, vw, and vh must be checked against the actual target container.",
    relatedSlugs: ["unit-converter", "css-flexbox-generator", "css-grid-generator"],
    outcome: "Native CSS Unit Converter workspace for local sizing and context review",
    accent: "teal"
  }),
  "hash-generator": aixtralNativeDetail({
    summary: "Hash Generator is now a native Toolars workspace for local checksum and digest review.",
    overview:
      "Hash Generator creates MD5, SHA1, SHA256, and SHA512 digests from pasted text, IDs, and payload snippets for debugging, integrity checks, and lightweight security review. The workspace migrates the Aixtral source behavior into Toolars-native input and digest rows, keeps source content local, and makes algorithm limits visible before users copy output.",
    metric: { value: "4", label: "Hash algorithms" },
    inputTitle: "Paste source text",
    inputDescription: "Accept text, IDs, or payload snippets for local digest generation without uploading content.",
    resultTitle: "Generate digest rows",
    resultDescription: "Return MD5, SHA1, SHA256, and SHA512 outputs with stable labels and copy-ready values.",
    reviewTitle: "Review algorithm limits",
    reviewDescription: "Keep collision caveats, non-password storage warnings, and empty input states visible before using hashes.",
    sourceDescription: "Uses the Aixtral Hash Generator implementation and tests as the source behavior reference.",
    workspaceDescription: "Adds a native workbench, local input processing, algorithm rows, stats, and public catalog readiness.",
    trustTitle: "Local digest generation model",
    trustReviewDescription: "Hash output is deterministic, but MD5 and SHA1 are shown for compatibility checks rather than modern security guarantees.",
    relatedSlugs: ["jwt-decoder", "password-generator", "base64-converter"],
    outcome: "Native Hash Generator workspace for local digest generation and checksum review",
    accent: "emerald"
  }),
  "jwt-decoder": aixtralNativeDetail({
    summary: "JWT Decoder is now a native Toolars workspace for local decode-only token inspection.",
    overview:
      "JWT Decoder splits JSON Web Tokens into header, payload, and signature sections, decodes JSON fields, and surfaces token metadata without sending secrets to a server. The workspace migrates the Aixtral source behavior into Toolars-native token input, decoded payload review, algorithm metadata, and explicit decode-only warnings so users do not confuse inspection with signature verification.",
    metric: { value: "JWT", label: "Token format" },
    inputTitle: "Paste token",
    inputDescription: "Accept a JWT string for local parsing while warning users not to paste production secrets casually.",
    resultTitle: "Decode token parts",
    resultDescription: "Return decoded header, payload, signature presence, algorithm, expiry hints, and structured JSON.",
    reviewTitle: "Separate decode from verify",
    reviewDescription: "Make unsupported tokens, invalid segments, missing signatures, and unverifiable status clear before use.",
    sourceDescription: "Uses the Aixtral JWT Decoder implementation, examples, and tests as the migration reference.",
    workspaceDescription: "Adds a native decode-only workbench, token warnings, decoded JSON panels, metadata badges, and public catalog readiness.",
    trustTitle: "Decode-only JWT inspection model",
    trustReviewDescription: "The workspace decodes token contents locally and never claims signature verification or trust decisions.",
    relatedSlugs: ["hash-generator", "json-repair", "base64-converter"],
    outcome: "Native JWT Decoder workspace for local token inspection and decode-only review",
    accent: "amber"
  }),
  "password-generator": aixtralNativeDetail({
    summary: "Password Generator is now a native Toolars workspace for local credential creation and strength review.",
    overview:
      "Password Generator creates random passwords from length, uppercase, lowercase, number, symbol, and ambiguity-exclusion settings while reporting strength-oriented metadata. The workspace migrates the Aixtral source behavior into Toolars-native controls, keeps generated values local, and gives users a no-storage utility for fixtures, temporary credentials, and security handoff.",
    metric: { value: "Rules", label: "Generation controls" },
    inputTitle: "Choose password rules",
    inputDescription: "Accept length, character sets, symbol rules, and exclusions for local random password generation.",
    resultTitle: "Generate secure values",
    resultDescription: "Return a generated password plus strength hints, character coverage, and copy-ready output.",
    reviewTitle: "Check rule quality",
    reviewDescription: "Keep weak lengths, missing character classes, ambiguous exclusions, and clipboard assumptions visible.",
    sourceDescription: "Uses the Aixtral Password Generator implementation and tests as the source behavior reference.",
    workspaceDescription: "Adds a native workbench, rule toggles, strength metadata, no-storage copy flow, and public catalog readiness.",
    trustTitle: "Local password generation model",
    trustReviewDescription: "Generated values stay in the browser, but users should still use a password manager for storage and rotation.",
    relatedSlugs: ["hash-generator", "uuid-generator", "jwt-decoder"],
    outcome: "Native Password Generator workspace for local credential generation and strength review",
    accent: "rose"
  }),
  "regex-tester": aixtralNativeDetail({
    summary: "Regex Tester is now a native Toolars workspace for local pattern debugging and match review.",
    overview:
      "Regex Tester evaluates regular expressions against sample text, showing matches, capture groups, flags, and syntax errors without uploading source strings. The workspace migrates the Aixtral source behavior into Toolars-native pattern, flag, sample, and result panels so developers and editors can debug expressions locally before pasting them into code or data workflows.",
    metric: { value: "Regex", label: "Pattern engine" },
    inputTitle: "Enter pattern and text",
    inputDescription: "Accept a regular expression, flags, and sample text for local matching and debugging.",
    resultTitle: "Show matches",
    resultDescription: "Return match ranges, capture groups, counts, flag behavior, and preview-friendly annotations.",
    reviewTitle: "Catch invalid patterns",
    reviewDescription: "Make syntax errors, runaway assumptions, empty matches, and flag interactions visible before copying.",
    sourceDescription: "Uses the Aixtral Regex Tester implementation, examples, and tests as the behavior source.",
    workspaceDescription: "Adds a native workbench, pattern and flag controls, sample text testing, match rows, and public catalog readiness.",
    trustTitle: "Local regex testing model",
    trustReviewDescription: "The JavaScript regular expression engine is used locally, so results should be checked against other runtimes when syntax differs.",
    relatedSlugs: ["text-diff", "text-stats", "unicode-search"],
    outcome: "Native Regex Tester workspace for local pattern debugging and match handoff",
    accent: "indigo"
  }),
  "sql-formatter": aixtralDetail({
    badge: "Data utility",
    summary: "This Aixtral Lab listing captures SQL Formatter detail content for query cleanup and review workflows.",
    overview:
      "SQL Formatter beautifies SQL queries with configurable dialect and style options for database reviews, migration scripts, debugging, and documentation. Toolars records this as hidden detail inventory until the workspace can expose dialect controls, formatting options, and validation feedback inside the current UI system.",
    metric: { value: "SQL", label: "Formatted input" },
    inputTitle: "Paste SQL",
    inputDescription: "Accept queries, scripts, or fragments with dialect and formatting preferences for local cleanup.",
    resultTitle: "Format query",
    resultDescription: "Return readable SQL with indentation, keyword casing, line breaks, and copy-ready output.",
    reviewTitle: "Check parser limits",
    reviewDescription: "Make unsupported syntax, huge scripts, and dialect assumptions visible before formatted code is trusted.",
    handoffTitle: "Plan formatter controls",
    handoffDescription: "Use this detail record to scope dialect menus, style toggles, editor states, and copy/download actions.",
    sourceDescription: "Use the Aixtral SQL Formatter implementation and tests as the source behavior reference.",
    contractDescription: "Return dialect, formatting options, formatted SQL, validation errors, input stats, and copy targets.",
    relatedSlugs: ["json-repair", "yaml-validator", "toml-converter"],
    outcome: "SQL formatter detail page and database review handoff",
    accent: "blue"
  }),
  "toml-converter": aixtralDetail({
    badge: "Config utility",
    summary: "This Aixtral Lab listing prepares TOML Converter detail coverage for configuration format workflows.",
    overview:
      "TOML Converter converts between TOML and JSON with validation and error reporting for package metadata, build config, and infrastructure settings. Toolars keeps the listing detail-only while the future workspace aligns local parsing, structured preview, error states, and export behavior with existing data tools.",
    metric: { value: "2-way", label: "TOML and JSON" },
    inputTitle: "Paste TOML or JSON",
    inputDescription: "Accept TOML or JSON source content and a conversion direction for local parsing.",
    resultTitle: "Convert format",
    resultDescription: "Return converted output, parsed structure hints, validation status, and copy-ready text.",
    reviewTitle: "Inspect config errors",
    reviewDescription: "Keep syntax errors, unsupported value shapes, comments, and ordering caveats visible before export.",
    handoffTitle: "Prepare converter route",
    handoffDescription: "Use this detail page to scope editor panes, direction controls, error lists, and export actions.",
    sourceDescription: "Use the Aixtral TOML Converter implementation and tests as the source behavior reference.",
    contractDescription: "Return direction, parsed status, converted output, validation errors, warning rows, and copy metadata.",
    relatedSlugs: ["yaml-validator", "json-repair", "sql-formatter"],
    outcome: "TOML converter detail page and configuration migration brief",
    accent: "teal"
  }),
  "unicode-search": aixtralDetail({
    badge: "Character utility",
    summary: "This Aixtral Lab listing adds Unicode Character Search detail coverage for character lookup workflows.",
    overview:
      "Unicode Character Search helps users find and inspect characters with names, glyphs, code points, decimal values, and HTML entity details for copy, localization, documentation, and frontend debugging. Toolars keeps it hidden until a native workspace can provide search, category filters, and copy-safe result rows.",
    metric: { value: "Unicode", label: "Character index" },
    inputTitle: "Search characters",
    inputDescription: "Accept a keyword, glyph, or code point query for local lookup across Unicode character metadata.",
    resultTitle: "Browse results",
    resultDescription: "Return matching glyphs, Unicode names, code points, decimal values, and HTML entity details.",
    reviewTitle: "Check copy context",
    reviewDescription: "Keep invisible characters, similar glyphs, and encoding caveats visible before users paste output.",
    handoffTitle: "Plan search interface",
    handoffDescription: "Use this detail record to scope filters, character rows, copy controls, and category navigation.",
    sourceDescription: "Use the Aixtral Unicode Character Search implementation and tests as the source behavior reference.",
    contractDescription: "Return query, result rows, code point labels, decimal values, HTML entities, category metadata, and copy targets.",
    relatedSlugs: ["regex-tester", "html-entity-encoder", "text-stats"],
    outcome: "Unicode search detail page and character lookup handoff",
    accent: "violet"
  }),
  "code-minifier": aixtralDetail({
    badge: "Code utility",
    summary: "This Aixtral Lab listing prepares Code Minifier detail coverage for local frontend optimization workflows.",
    overview:
      "Code Minifier compresses JavaScript, CSS, and HTML snippets to reduce file size for prototypes, embeds, documentation samples, and quick shipping checks. Toolars keeps this as detail-only inventory until a native workspace can expose language selection, minify options, warnings, and copy behavior inside the current design system.",
    metric: { value: "3", label: "Code formats" },
    inputTitle: "Paste code",
    inputDescription: "Accept JavaScript, CSS, or HTML source and keep minification local to the browser workflow.",
    resultTitle: "Minify output",
    resultDescription: "Return compact code, byte savings, selected language, and copy-ready output for review.",
    reviewTitle: "Check parsing assumptions",
    reviewDescription: "Make unsupported syntax, malformed markup, and irreversible formatting caveats visible before copy.",
    handoffTitle: "Plan minifier controls",
    handoffDescription: "Use this detail record to scope language tabs, compression stats, warnings, and copy/download states.",
    sourceDescription: "Use the Aixtral Code Minifier implementation and tests as the source behavior reference.",
    contractDescription: "Return language, original size, minified size, output, warnings, validation errors, and copy metadata.",
    relatedSlugs: ["json-formatter", "css-to-tailwind-converter", "xml-formatter"],
    outcome: "Code minifier detail page and local optimization handoff",
    accent: "slate"
  }),
  "cron-explainer": aixtralDetail({
    badge: "Schedule utility",
    summary: "This Aixtral Lab listing captures Cron Explainer detail content for schedule review workflows.",
    overview:
      "Cron Explainer decodes cron expressions into readable descriptions, field breakdowns, and next execution hints for scheduled jobs, automation rules, and deployment maintenance windows. Toolars keeps it hidden until a native workspace can handle validation, timezone notes, examples, and copyable explanations.",
    metric: { value: "Cron", label: "Schedule syntax" },
    inputTitle: "Enter cron expression",
    inputDescription: "Accept standard cron fields and optional schedule examples for local parsing.",
    resultTitle: "Explain schedule",
    resultDescription: "Return human-readable timing, field meanings, next-run hints, and validation feedback.",
    reviewTitle: "Check timezone caveats",
    reviewDescription: "Make invalid fields, unsupported syntax, and timezone assumptions visible before schedules are deployed.",
    handoffTitle: "Prepare schedule UX",
    handoffDescription: "Use this detail page to scope expression presets, readable summaries, and next-run preview states.",
    sourceDescription: "Use the Aixtral Cron Explainer implementation and tests as the source behavior reference.",
    contractDescription: "Return expression, parsed fields, readable description, next execution hints, warnings, and validation errors.",
    relatedSlugs: ["timestamp-converter", "regex-tester", "text-stats"],
    outcome: "Cron explainer detail page and schedule review handoff",
    accent: "orange"
  }),
  "css-to-tailwind-converter": aixtralNativeDetail({
    summary: "CSS to Tailwind Converter is now a native Toolars workspace for local utility-class suggestions.",
    overview:
      "CSS to Tailwind Converter maps raw CSS declarations to Tailwind utility class suggestions for design-system cleanup, component migration, and prototype handoff. The native Toolars workspace parses declarations locally, separates matched and unsupported rules, and returns copy-ready class strings for common flex, alignment, spacing, and radius properties without implying custom project config coverage.",
    metric: { value: "CSS", label: "Source input" },
    inputTitle: "Paste CSS declarations",
    inputDescription: "Accept raw CSS properties, inline styles, or rule fragments for local Tailwind conversion.",
    resultTitle: "Suggest utilities",
    resultDescription: "Return Tailwind class suggestions, unsupported properties, and normalized CSS for review.",
    reviewTitle: "Check framework assumptions",
    reviewDescription: "Keep custom theme values, arbitrary units, and unsupported CSS visible before classes are copied.",
    sourceDescription: "Use the Aixtral CSS to Tailwind Converter implementation and tests as the migration reference.",
    workspaceDescription: "Adds a local CSS textarea, generated Tailwind class output, unsupported-rule review, and public catalog readiness.",
    trustTitle: "Local CSS utility mapping model",
    trustReviewDescription: "The converter suggests common Tailwind utilities locally; custom theme tokens still require project review.",
    relatedSlugs: ["css-unit-converter", "css-flexbox-generator", "css-grid-generator"],
    outcome: "Native CSS to Tailwind workspace for local utility-class migration",
    accent: "sky"
  }),
  "docker-compose-converter": aixtralDetail({
    badge: "DevOps utility",
    summary: "This Aixtral Lab listing prepares Docker Compose Converter detail data for container config workflows.",
    overview:
      "Docker Compose Converter translates between docker run commands and docker-compose.yml service definitions for local deployment notes, onboarding docs, and infrastructure handoff. Toolars keeps this detail-only until a workspace can handle YAML preview, command parsing caveats, and safe environment variable treatment.",
    metric: { value: "2-way", label: "Docker formats" },
    inputTitle: "Paste Docker config",
    inputDescription: "Accept docker run commands or Compose YAML for local conversion and inspection.",
    resultTitle: "Convert container setup",
    resultDescription: "Return converted Compose YAML or docker run command with service, port, volume, and env metadata.",
    reviewTitle: "Check secret handling",
    reviewDescription: "Make environment variables, volume paths, unsupported flags, and parser warnings visible before sharing.",
    handoffTitle: "Prepare DevOps workspace",
    handoffDescription: "Use this detail page to scope split input panes, YAML preview, warning rows, and copy controls.",
    sourceDescription: "Use the Aixtral Docker Compose Converter implementation and tests as the source behavior reference.",
    contractDescription: "Return direction, parsed services, converted output, env warnings, unsupported flags, and validation errors.",
    relatedSlugs: ["yaml-validator", "env-editor", "mcp-server-builder"],
    outcome: "Docker Compose converter detail page and DevOps handoff",
    accent: "blue"
  }),
  "env-editor": aixtralDetail({
    badge: "Config utility",
    summary: "This Aixtral Lab listing captures Env Variable Editor detail content for local configuration review.",
    overview:
      "Env Variable Editor parses .env files into editable rows, detects malformed lines, and helps review names, values, comments, duplicates, and secret-like entries. Toolars keeps it hidden from public launch until the native workspace can offer table editing, privacy warnings, diff-safe export, and clear no-upload behavior.",
    metric: { value: ".env", label: "Config format" },
    inputTitle: "Paste .env content",
    inputDescription: "Accept environment variable files locally and preserve comments, blank lines, and key-value rows.",
    resultTitle: "Parse variables",
    resultDescription: "Return editable variable rows, comments, duplicate keys, parse warnings, and export-ready text.",
    reviewTitle: "Protect sensitive values",
    reviewDescription: "Keep secret-like values, duplicate keys, and malformed lines visible before anyone exports or shares.",
    handoffTitle: "Plan table editor",
    handoffDescription: "Use this detail record to scope row editing, validation badges, masked values, and copy/download states.",
    sourceDescription: "Use the Aixtral Env Variable Editor implementation and tests as the behavior reference.",
    contractDescription: "Return parsed rows, comments, duplicates, secret warnings, validation errors, and serialized .env output.",
    relatedSlugs: ["yaml-validator", "toml-converter", "docker-compose-converter"],
    outcome: "Env editor detail page and local config handoff",
    accent: "emerald"
  }),
  "meta-tag-generator": aixtralNativeDetail({
    summary: "Meta Tag Generator is now a native Toolars workspace for local SEO, Open Graph, and Twitter tag output.",
    overview:
      "Meta Tag Generator creates SEO-oriented HTML meta tags including title, description, canonical, Open Graph, and Twitter Card markup for pages, launches, and content previews. The native Toolars workspace uses local structured inputs, escapes generated output, surfaces title and description length warnings, and returns copy-ready snippets that can be reviewed before a page ships.",
    metric: { value: "SEO", label: "Markup target" },
    inputTitle: "Enter page metadata",
    inputDescription: "Accept title, description, URL, image, and social fields for local meta tag generation.",
    resultTitle: "Generate HTML tags",
    resultDescription: "Return canonical tags, Open Graph tags, Twitter Card tags, and copy-ready HTML snippets.",
    reviewTitle: "Check preview quality",
    reviewDescription: "Make missing descriptions, long titles, invalid URLs, and image assumptions visible before publishing.",
    sourceDescription: "Use the Aixtral Meta Tag Generator implementation and tests as the source behavior reference.",
    workspaceDescription: "Adds page-title input, generated metadata tags, validation warnings, and public catalog readiness.",
    trustTitle: "Local metadata generation model",
    trustReviewDescription: "Generated tags are escaped locally, but teams should validate final previews in search and social debuggers.",
    relatedSlugs: ["robots-txt-generator", "html-entity-encoder", "css-gradient-generator"],
    outcome: "Native Meta Tag Generator workspace for local SEO snippet generation",
    accent: "violet"
  }),
  "robots-txt-generator": aixtralNativeDetail({
    summary: "robots.txt Generator is now a native Toolars workspace for local crawl-rule authoring and review.",
    overview:
      "robots.txt Generator creates crawl rules for user agents, disallowed paths, allowed paths, sitemap references, and basic search-engine behavior notes. The native Toolars workspace generates text locally from structured path inputs, keeps production warnings visible, and helps teams review crawler-blocking rules before publishing robots.txt to a site root.",
    metric: { value: "robots", label: "Crawler policy" },
    inputTitle: "Configure crawl rules",
    inputDescription: "Accept user agents, allow and disallow paths, crawl settings, and sitemap URLs for local generation.",
    resultTitle: "Generate robots.txt",
    resultDescription: "Return robots.txt content, sitemap lines, rule summaries, and copy-ready output.",
    reviewTitle: "Check crawl impact",
    reviewDescription: "Make broad disallows, invalid paths, missing sitemap URLs, and crawler caveats visible before deployment.",
    sourceDescription: "Use the Aixtral robots.txt Generator implementation and tests as the source behavior reference.",
    workspaceDescription: "Adds disallow path input, generated robots.txt output, crawler warnings, and public catalog readiness.",
    trustTitle: "Local robots.txt generation model",
    trustReviewDescription: "Generated directives stay local, but publishing robots.txt can affect indexing and must be reviewed in production.",
    relatedSlugs: ["meta-tag-generator", "url-parser", "text-stats"],
    outcome: "Native robots.txt Generator workspace for local crawl-rule handoff",
    accent: "amber"
  }),
  "barcode-generator": nativeMediaDetail({
    summary: "Barcode Generator is now a native Toolars workspace for local barcode validation and SVG preview output.",
    overview:
      "Barcode Generator creates local SVG output for CODE39 and validates common retail-code inputs before export. The trust boundary is explicit: Toolars can generate dependency-free SVG previews and validate formats locally, while production labels still need scanner verification, especially for CODE128, EAN, and UPC workflows that normally rely on a specialist barcode engine.",
    metric: { value: "Barcode", label: "Output format" },
    sourceLabel: "Aixtral",
    inputTitle: "Enter barcode value",
    inputDescription: "Accept product codes, inventory IDs, or label strings with a selected barcode format.",
    resultTitle: "Generate barcode SVG",
    resultDescription: "Return local SVG markup, quiet-zone metadata, formatted value, and validation errors.",
    reviewTitle: "Validate format limits",
    reviewDescription: "Make unsupported characters, checksum rules, and scanner-verification caveats visible before export.",
    sourceTitle: "Aixtral source",
    sourceDescription: "Uses the Aixtral Barcode Generator page contract as the source behavior reference, adapted to Toolars local SVG output.",
    workspaceDescription: "Dedicated workspace exposes format controls, local validation, SVG preview text, and scanner-readiness caveats.",
    trustTitle: "Local barcode SVG model",
    trustLocalDescription: "Barcode values and generated SVG markup stay in the browser.",
    trustReviewDescription: "CODE39 is generated locally; other barcode formats should be scanner-tested before production labels.",
    relatedSlugs: ["qr-code-generator", "base64-image-encoder", "nanoid-generator"],
    outcome: "Native barcode SVG workspace with local format validation",
    accent: "indigo"
  }),
  "base64-image-encoder": aixtralNativeDetail({
    summary: "Base64 Image Encoder is now a native Toolars workspace for local image data URL inspection and handoff.",
    overview:
      "Base64 Image Encoder converts image content into Base64 data URLs and inspects pasted Base64 strings for embeds, tests, and quick asset review. The native Toolars workspace keeps image payloads local, normalizes data URL output, reports MIME type and byte estimates, and surfaces size warnings so developers can decide whether inline image data is appropriate before copying it.",
    metric: { value: "2-way", label: "Image conversion" },
    inputTitle: "Add image or Base64",
    inputDescription: "Accept uploaded images or pasted Base64 content for local conversion and preview.",
    resultTitle: "Encode or decode",
    resultDescription: "Return data URLs, decoded image previews, file metadata, and copy or download targets.",
    reviewTitle: "Check payload size",
    reviewDescription: "Make large data URLs, invalid Base64, unsupported MIME types, and browser memory limits visible.",
    sourceDescription: "Use the Aixtral Base64 Image Encoder implementation and tests as the source behavior reference.",
    workspaceDescription: "Adds Base64 input, normalized image data URL output, MIME and byte metadata, warnings, and public catalog readiness.",
    trustTitle: "Local image data URL model",
    trustReviewDescription: "Image data stays in the browser, but large data URLs can still harm page weight and should be reviewed.",
    relatedSlugs: ["base64-converter", "barcode-generator", "qr-code-generator"],
    outcome: "Native Base64 Image Encoder workspace for local image data URL review",
    accent: "cyan"
  }),
  "certificate-decoder": aixtralNativeDetail({
    summary: "Certificate Decoder is now a native Toolars workspace for local PEM certificate inspection.",
    overview:
      "Certificate Decoder parses PEM-formatted X.509 certificates locally and surfaces issuer, subject, validity dates, serial number, fingerprints, and decoded field metadata for TLS review. The native Toolars workspace keeps certificate material in the browser, shows expiry state, and makes parser and trust-chain limits visible before teams copy certificate notes into incident or deployment work.",
    metric: { value: "X.509", label: "Certificate format" },
    inputTitle: "Paste PEM certificate",
    inputDescription: "Accept PEM-formatted certificates for local decoding and inspection without upload.",
    resultTitle: "Inspect certificate fields",
    resultDescription: "Return subject, issuer, validity range, serial number, SHA fingerprints, and decoded field summaries.",
    reviewTitle: "Check validity context",
    reviewDescription: "Make expired dates, unsupported encodings, parse failures, and trust-chain limits visible before use.",
    sourceDescription: "Use the Aixtral Certificate Decoder implementation and Toolars certificate parser tests as the source behavior reference.",
    workspaceDescription: "Adds PEM input, local ASN.1 field extraction, validity badges, fingerprint copy data, warnings, and public catalog readiness.",
    trustTitle: "Local certificate decoding model",
    trustReviewDescription: "Certificate fields are decoded locally, but chain trust, revocation, and hostname validation must be checked with production TLS tooling.",
    relatedSlugs: ["jwt-decoder", "hash-generator", "env-editor"],
    outcome: "Native Certificate Decoder workspace for local TLS certificate inspection",
    accent: "emerald"
  }),
  "cron-builder": aixtralDetail({
    badge: "Schedule builder",
    summary: "This Aixtral Lab listing adds Cron Expression Builder detail coverage for schedule construction workflows.",
    overview:
      "Cron Expression Builder helps users construct cron expressions visually with field controls, presets, readable descriptions, and preview-oriented schedule output. Toolars keeps the route hidden until the native workspace can pair builder controls with validation, examples, and timezone caveats.",
    metric: { value: "Cron", label: "Expression output" },
    inputTitle: "Configure schedule fields",
    inputDescription: "Accept minute, hour, day, month, and weekday settings through builder-friendly controls.",
    resultTitle: "Build expression",
    resultDescription: "Return the cron expression, readable summary, preview hints, and copy-ready schedule text.",
    reviewTitle: "Validate schedule intent",
    reviewDescription: "Make impossible values, confusing wildcards, timezone assumptions, and unsupported syntax visible.",
    handoffTitle: "Prepare builder controls",
    handoffDescription: "Use this detail record to scope presets, segmented fields, readable preview, and copy states.",
    sourceDescription: "Use the Aixtral Cron Expression Builder page and client behavior as the source reference.",
    contractDescription: "Return field values, generated expression, readable description, validation errors, and preview metadata.",
    relatedSlugs: ["cron-explainer", "timestamp-converter", "regex-tester"],
    outcome: "Cron builder detail page and schedule construction handoff",
    accent: "orange"
  }),
  "http-status-reference": aixtralDetail({
    badge: "Reference utility",
    summary: "This Aixtral Lab listing captures HTTP Status Reference detail data for API debugging workflows.",
    overview:
      "HTTP Status Reference provides searchable HTTP status codes, category filters, descriptions, and quick-copy reference rows for API debugging, documentation, and incident review. Toolars keeps it as hidden detail inventory until the native workspace can offer dense lookup, filters, and copy affordances.",
    metric: { value: "HTTP", label: "Reference set" },
    inputTitle: "Search status codes",
    inputDescription: "Accept code numbers, phrases, or categories for local lookup across HTTP status metadata.",
    resultTitle: "Show matching codes",
    resultDescription: "Return status code, reason phrase, category, description, and quick-copy reference text.",
    reviewTitle: "Clarify usage",
    reviewDescription: "Keep similar codes, deprecated meanings, and implementation-specific caveats visible before docs are copied.",
    handoffTitle: "Plan lookup interface",
    handoffDescription: "Use this detail page to scope search, category filters, keyboard navigation, and copy actions.",
    sourceDescription: "Use the Aixtral HTTP Status Reference page and client behavior as the source reference.",
    contractDescription: "Return query, filtered status rows, selected category, copy target, and no-result state.",
    relatedSlugs: ["mime-lookup", "url-parser", "json-repair"],
    outcome: "HTTP status reference detail page and API lookup handoff",
    accent: "blue"
  }),
  "mime-lookup": aixtralDetail({
    badge: "Reference utility",
    summary: "This Aixtral Lab listing prepares MIME Type Lookup detail coverage for web development reference flows.",
    overview:
      "MIME Type Lookup searches file extensions and media types for upload handling, response headers, content negotiation, and frontend asset debugging. Toolars keeps the listing detail-only until a native workspace can expose fast search, category filters, copy actions, and related extension hints.",
    metric: { value: "MIME", label: "Reference type" },
    inputTitle: "Search extension or MIME type",
    inputDescription: "Accept file extensions, media type strings, or keywords for local reference lookup.",
    resultTitle: "Return MIME matches",
    resultDescription: "Return extension, MIME type, category, description, and copy-friendly header examples.",
    reviewTitle: "Check upload assumptions",
    reviewDescription: "Make unknown extensions, ambiguous types, and browser/server caveats visible before implementation.",
    handoffTitle: "Prepare reference UI",
    handoffDescription: "Use this detail record to scope search rows, copy chips, category filters, and no-result states.",
    sourceDescription: "Use the Aixtral MIME Type Lookup page and client behavior as the source reference.",
    contractDescription: "Return query, matching MIME rows, extension hints, category filters, copy text, and empty-state metadata.",
    relatedSlugs: ["http-status-reference", "base64-image-encoder", "html-entity-encoder"],
    outcome: "MIME lookup detail page and web reference handoff",
    accent: "slate"
  }),
  "nanoid-generator": aixtralNativeDetail({
    summary: "NanoID Generator is now a native Toolars workspace for compact local identifier generation.",
    overview:
      "NanoID Generator creates compact URL-safe unique IDs with custom alphabets, lengths, and batch quantities for frontend keys, share links, fixtures, and local test data. The workspace adapts the Aixtral page behavior into a dependency-free Toolars-native implementation with entropy metadata, validation, and copy-ready rows.",
    metric: { value: "NanoID", label: "ID format" },
    inputTitle: "Set ID rules",
    inputDescription: "Accept length, alphabet, quantity, and URL-safe preferences for local ID generation.",
    resultTitle: "Generate IDs",
    resultDescription: "Return generated NanoIDs, entropy hints, alphabet metadata, and copy-ready output.",
    reviewTitle: "Check collision risk",
    reviewDescription: "Make short lengths, custom alphabets, bulk counts, and randomness assumptions visible before use.",
    sourceDescription: "Uses the Aixtral NanoID Generator page behavior and tests as the source reference.",
    workspaceDescription: "Adds a native workbench, custom alphabet controls, batch generation, entropy metadata, and public catalog readiness.",
    trustTitle: "Local NanoID generation model",
    trustReviewDescription: "Generated IDs are random local utility values; teams should still size length and alphabet against collision risk.",
    relatedSlugs: ["uuid-generator", "password-generator", "hash-generator"],
    outcome: "Native NanoID Generator workspace for compact local ID generation",
    accent: "violet"
  }),
  "qr-code-generator": nativeMediaDetail({
    summary: "QR Code Generator is now a native Toolars workspace for local QR-style SVG preview and export planning.",
    overview:
      "QR Code Generator accepts text or URLs, error-correction intent, and preview settings in a local-first Toolars workspace. The trust boundary is visible: because this repo cannot add the source QR dependency in this wave, Toolars renders deterministic SVG previews and metadata locally, while production QR codes should be scan-tested with a full QR encoder before print or launch.",
    metric: { value: "QR", label: "Output format" },
    sourceLabel: "Aixtral",
    inputTitle: "Enter QR content",
    inputDescription: "Accept text, URLs, or data strings plus error-correction settings for local preview generation.",
    resultTitle: "Render SVG preview",
    resultDescription: "Return deterministic SVG markup, module count, content length, and validation warnings.",
    reviewTitle: "Check scan reliability",
    reviewDescription: "Make long content, color choices, dependency limits, and production scan-testing caveats visible before export.",
    sourceTitle: "Aixtral source",
    sourceDescription: "Uses the Aixtral QR Code Generator page contract as the source behavior reference, adapted without adding new dependencies.",
    workspaceDescription: "Dedicated workspace exposes content input, error-correction intent, local SVG preview output, and scan-testing caveats.",
    trustTitle: "Local QR SVG preview model",
    trustLocalDescription: "QR content and preview SVG are generated locally without uploading data.",
    trustReviewDescription: "The preview is dependency-free and should be verified with a production QR encoder before public use.",
    relatedSlugs: ["barcode-generator", "url-encoder", "base64-image-encoder"],
    outcome: "Native QR preview workspace with local validation and scan-test boundary",
    accent: "lime"
  }),
  "html-markdown-converter": aixtralDetail({
    badge: "Content utility",
    summary: "This Aixtral Lab listing prepares HTML to Markdown Converter detail coverage for content migration workflows.",
    overview:
      "HTML to Markdown Converter turns HTML snippets into Markdown and converts Markdown back into HTML for documentation, CMS imports, changelogs, and publishing QA. Toolars keeps this detail-only until a native workspace can expose bidirectional conversion, preview panes, copy states, and parser caveats.",
    metric: { value: "2-way", label: "HTML and Markdown" },
    inputTitle: "Paste content",
    inputDescription: "Accept HTML or Markdown source text and a conversion direction for local transformation.",
    resultTitle: "Convert markup",
    resultDescription: "Return converted content, parser warnings, structural notes, and copy-ready output.",
    reviewTitle: "Check conversion loss",
    reviewDescription: "Make unsupported tags, malformed links, escaped entities, and formatting changes visible before export.",
    handoffTitle: "Plan content editor",
    handoffDescription: "Use this detail page to scope split panes, preview mode, conversion direction, and copy controls.",
    sourceDescription: "Use the Aixtral HTML Markdown Converter page, converter helper, and tests as the source behavior reference.",
    contractDescription: "Return direction, converted output, warnings, input stats, preview metadata, and copy target state.",
    relatedSlugs: ["markdown-to-json", "html-preview", "markdown-table-generator"],
    outcome: "HTML and Markdown conversion detail page and content migration handoff",
    accent: "amber"
  }),
  "html-preview": aixtralDetail({
    badge: "Markup utility",
    summary: "This Aixtral Lab listing captures HTML Preview detail content for local markup review workflows.",
    overview:
      "HTML Preview renders pasted HTML in real time so developers and content teams can inspect snippets, examples, documentation embeds, and simple layouts before publishing. Toolars keeps this as hidden detail inventory until a native workspace can sandbox output, manage preview sizing, and expose safety warnings.",
    metric: { value: "Live", label: "Preview mode" },
    inputTitle: "Write HTML",
    inputDescription: "Accept HTML snippets for local rendering in a controlled preview workflow.",
    resultTitle: "Render preview",
    resultDescription: "Return rendered output metadata, source stats, and preview-oriented state for the page.",
    reviewTitle: "Check unsafe markup",
    reviewDescription: "Make script handling, external assets, invalid tags, and preview limitations visible before use.",
    handoffTitle: "Prepare sandbox UI",
    handoffDescription: "Use this detail record to scope editor panes, sandbox preview, warnings, and reset states.",
    sourceDescription: "Use the Aixtral HTML Preview implementation and tests as the source behavior reference.",
    contractDescription: "Return source HTML, rendered preview state, warnings, source metrics, and sanitization notes.",
    relatedSlugs: ["html-entity-encoder", "code-minifier", "html-markdown-converter"],
    outcome: "HTML preview detail page and local markup review handoff",
    accent: "orange"
  }),
  "image-resizer": aixtralNativeDetail({
    summary: "Image Resizer is now a native Toolars workspace for local resize planning, aspect ratio review, and export estimates.",
    overview:
      "Image Resizer changes image dimensions with format and quality controls for product screenshots, social assets, documentation, and upload preparation. The native Toolars workspace provides local dimension planning, aspect-ratio locking, format quality estimates, and warning states so asset teams can review output intent before handing work to a browser canvas or image pipeline.",
    metric: { value: "Image", label: "Asset type" },
    inputTitle: "Add image",
    inputDescription: "Accept a local image file plus target dimensions, format, and quality settings.",
    resultTitle: "Resize asset",
    resultDescription: "Return resized image metadata, preview state, file-size estimate, and download target.",
    reviewTitle: "Check quality tradeoffs",
    reviewDescription: "Make aspect ratio changes, upscaling, compression, and unsupported formats visible before export.",
    sourceDescription: "Use the Aixtral Image Resizer page and client behavior as the source reference.",
    workspaceDescription: "Adds source and target dimension controls, aspect-ratio estimates, size warnings, and public catalog readiness.",
    trustTitle: "Local image resize planning model",
    trustReviewDescription: "Resize planning stays local; final pixel rewriting still needs browser canvas verification for production downloads.",
    relatedSlugs: ["base64-image-encoder", "svg-optimizer", "pdf-compressor"],
    outcome: "Native Image Resizer workspace for local dimension and export planning",
    accent: "rose"
  }),
  "json-schema-builder": aixtralDetail({
    badge: "Schema utility",
    summary: "This Aixtral Lab listing prepares JSON Schema Builder detail coverage for validation design workflows.",
    overview:
      "JSON Schema Builder helps users define object fields, types, required rules, descriptions, and nested validation structures visually before using schemas in APIs, form validation, or LLM structured output. Toolars records this as detail-only inventory until a native workspace can manage editing, preview, and export safely.",
    metric: { value: "Schema", label: "Output type" },
    inputTitle: "Design fields",
    inputDescription: "Accept field names, types, required flags, nested properties, and validation settings.",
    resultTitle: "Build JSON Schema",
    resultDescription: "Return structured JSON Schema, preview metadata, validation warnings, and copy-ready output.",
    reviewTitle: "Check schema constraints",
    reviewDescription: "Make missing required fields, invalid names, nested complexity, and draft assumptions visible before export.",
    handoffTitle: "Prepare schema editor",
    handoffDescription: "Use this detail record to scope field rows, nesting controls, preview panels, and JSON export.",
    sourceDescription: "Use the Aixtral JSON Schema Builder page and client behavior as the source reference.",
    contractDescription: "Return schema draft, fields, required list, validation options, generated JSON, warnings, and copy metadata.",
    relatedSlugs: ["schema-validator", "json-repair", "mock-data-generator"],
    outcome: "JSON schema builder detail page and validation design handoff",
    accent: "blue"
  }),
  "markdown-table-generator": aixtralDetail({
    badge: "Content utility",
    summary: "This Aixtral Lab listing captures Markdown Table Generator detail data for documentation table workflows.",
    overview:
      "Markdown Table Generator creates editable tables with headers, cells, CSV import, and formatted Markdown export for docs, READMEs, changelogs, and lightweight reports. Toolars keeps the listing hidden until a native workspace can provide stable table controls, import validation, and copy-friendly output.",
    metric: { value: "Table", label: "Markdown output" },
    inputTitle: "Build table",
    inputDescription: "Accept editable headers, rows, cells, and optional CSV input for local table construction.",
    resultTitle: "Export Markdown",
    resultDescription: "Return formatted Markdown table text, row and column metadata, and copy-ready output.",
    reviewTitle: "Check table shape",
    reviewDescription: "Make uneven rows, escaped pipes, empty headers, and CSV parsing warnings visible before export.",
    handoffTitle: "Plan table editor",
    handoffDescription: "Use this detail page to scope grid controls, import flow, alignment choices, and copy states.",
    sourceDescription: "Use the Aixtral Markdown Table Generator page and client behavior as the source reference.",
    contractDescription: "Return headers, rows, alignment settings, imported CSV status, generated Markdown, warnings, and copy metadata.",
    relatedSlugs: ["csv-to-json", "html-markdown-converter", "text-stats"],
    outcome: "Markdown table detail page and documentation workflow handoff",
    accent: "slate"
  }),
  "mock-data-generator": aixtralDetail({
    badge: "Data utility",
    summary: "This Aixtral Lab listing adds Mock Data Generator detail coverage for testing and prototype data workflows.",
    overview:
      "Mock Data Generator creates realistic sample data in JSON or CSV for UI testing, API fixtures, demos, and development workflows. Toolars keeps this as detail-only inventory until a native workspace can expose schema controls, row counts, field presets, export choices, and privacy-safe local generation.",
    metric: { value: "JSON/CSV", label: "Export formats" },
    inputTitle: "Choose data shape",
    inputDescription: "Accept field presets, row count, export format, and optional schema-like structure for local generation.",
    resultTitle: "Generate sample rows",
    resultDescription: "Return generated records, field metadata, output format, and copy or download targets.",
    reviewTitle: "Check realism limits",
    reviewDescription: "Make fake-data assumptions, duplicate risks, unsupported field types, and large output warnings visible.",
    handoffTitle: "Plan generator workspace",
    handoffDescription: "Use this detail record to scope field controls, format tabs, preview table, and export states.",
    sourceDescription: "Use the Aixtral Mock Data Generator page and client behavior as the source reference.",
    contractDescription: "Return field definitions, row count, generated JSON or CSV, validation warnings, and export metadata.",
    relatedSlugs: ["synthetic-dataset-generator", "json-to-csv", "json-schema-builder"],
    outcome: "Mock data detail page and local fixture generation handoff",
    accent: "green"
  }),
  "svg-optimizer": aixtralNativeDetail({
    summary: "SVG Optimizer is now a native Toolars workspace for local vector cleanup, byte savings, and markup review.",
    overview:
      "SVG Optimizer removes unnecessary SVG metadata, whitespace, comments, and redundant markup to reduce file size for icons, illustrations, and inline assets. The native Toolars workspace optimizes pasted SVG locally, reports byte savings, preserves renderable markup, and highlights viewBox or malformed-output warnings before code is copied into UI bundles.",
    metric: { value: "SVG", label: "Vector format" },
    inputTitle: "Paste or add SVG",
    inputDescription: "Accept SVG markup or files for local optimization and review.",
    resultTitle: "Optimize markup",
    resultDescription: "Return optimized SVG, size savings, validation warnings, and copy or download targets.",
    reviewTitle: "Check rendering safety",
    reviewDescription: "Make malformed SVG, removed metadata, viewBox changes, and rendering differences visible before export.",
    sourceDescription: "Use the Aixtral SVG Optimizer page and client behavior as the source reference.",
    workspaceDescription: "Adds SVG markup input, comment and metadata cleanup, byte-savings output, warnings, and public catalog readiness.",
    trustTitle: "Local SVG optimization model",
    trustReviewDescription: "Optimization runs in-browser, but teams should visually compare important icons after cleanup.",
    relatedSlugs: ["base64-image-encoder", "image-resizer", "code-minifier"],
    outcome: "Native SVG Optimizer workspace for local vector markup cleanup",
    accent: "teal"
  }),
  "ai-guardrail-config": aixtralNativeDetail({
    summary: "AI Guardrail Config is now a native Toolars workspace for local safety policy drafting.",
    overview:
      "AI Guardrail Config helps teams draft refusal rules, policy checks, escalation paths, and review notes before shipping AI features. The native Toolars workspace turns product context and selected risk categories into structured guardrail rules, severity notes, review checklists, and export-ready configuration without sending policy drafts away from the browser.",
    metric: { value: "Rules", label: "Guardrail output" },
    inputTitle: "Define policy scope",
    inputDescription: "Accept product context, prohibited content classes, refusal behavior, and review requirements.",
    resultTitle: "Draft guardrails",
    resultDescription: "Return structured guardrail rules, category coverage, reviewer notes, and export-ready policy sections.",
    reviewTitle: "Check policy coverage",
    reviewDescription: "Make unsupported claims, missing escalation steps, vague refusals, and risky automation gaps visible.",
    sourceDescription: "Use the Aixtral AI Guardrail Config listing and Toolars safety-policy templates as the source behavior reference.",
    workspaceDescription: "Adds a native workbench, risk-category toggles, generated rule cards, JSON export, review warnings, and public catalog readiness.",
    trustTitle: "Local guardrail configuration model",
    trustReviewDescription: "Generated guardrails are heuristic policy drafts and should be reviewed against the product's legal, safety, and abuse requirements.",
    relatedSlugs: ["system-prompt-guard", "jailbreak-detector", "prompt-injection-scanner"],
    outcome: "Native AI Guardrail Config workspace for local safety-rule drafting",
    accent: "rose"
  }),
  "code-to-image": aixtralNativeDetail({
    summary: "Code to Image is now a native Toolars workspace for local SVG snippet cards and shareable code previews.",
    overview:
      "Code to Image converts snippets into polished visuals for documentation, social posts, release notes, and design reviews. The native Toolars workspace renders escaped code into deterministic local SVG cards with theme, title, dimensions, and data URL output so teams can review readability and export boundaries before producing final social assets.",
    metric: { value: "Image", label: "Export target" },
    inputTitle: "Paste code",
    inputDescription: "Accept code text, language hints, theme choice, padding, and image size preferences.",
    resultTitle: "Render snippet image",
    resultDescription: "Return preview metadata, styled image output, size information, and export target state.",
    reviewTitle: "Check readability",
    reviewDescription: "Make wrapping, overflow, syntax highlight gaps, and low-contrast theme combinations visible.",
    sourceDescription: "Use the Aixtral Code to Image page and client behavior as the source reference.",
    workspaceDescription: "Adds code input, local SVG card generation, dimensions, copy-ready markup, and public catalog readiness.",
    trustTitle: "Local code image SVG model",
    trustReviewDescription: "SVG output is generated locally; final PNG export or syntax highlighting should be verified when used for publication.",
    relatedSlugs: ["code-minifier", "css-box-shadow-generator", "css-animation-generator"],
    outcome: "Native Code to Image workspace for local shareable snippet cards",
    accent: "violet"
  }),
  "css-animation-generator": aixtralNativeDetail({
    summary: "CSS Animation Generator is now a native Toolars workspace for local keyframes, declarations, and reduced-motion review.",
    overview:
      "CSS Animation Generator creates keyframe animations with duration, easing, delay, iteration, direction, and preview-ready CSS output. The native Toolars workspace generates local keyframes, animation declarations, preview metadata, and a reduced-motion fallback so frontend teams can review motion safety before adding animation CSS to product surfaces.",
    metric: { value: "Keyframes", label: "Output type" },
    inputTitle: "Set motion controls",
    inputDescription: "Accept animation name, timing, easing, iteration, direction, and keyframe values.",
    resultTitle: "Generate CSS",
    resultDescription: "Return keyframes, animation declarations, preview metadata, and copy-ready CSS snippets.",
    reviewTitle: "Check motion safety",
    reviewDescription: "Make excessive motion, missing reduced-motion fallbacks, invalid timing, and naming collisions visible.",
    sourceDescription: "Use the Aixtral CSS Animation Generator page and source behavior as the reference.",
    workspaceDescription: "Adds animation name input, generated keyframes, declaration output, reduced-motion CSS, warnings, and public catalog readiness.",
    trustTitle: "Local CSS animation model",
    trustReviewDescription: "Motion CSS stays local, but long or infinite animations should be checked against accessibility expectations.",
    relatedSlugs: ["css-box-shadow-generator", "css-gradient-generator", "css-to-tailwind-converter"],
    outcome: "Native CSS Animation Generator workspace for local keyframe and motion review",
    accent: "pink"
  }),
  "css-box-shadow-generator": aixtralNativeDetail({
    summary: "CSS Box Shadow Generator is now a native Toolars workspace for local shadow presets, layers, and preview CSS.",
    overview:
      "CSS Box Shadow Generator designs shadow values with offsets, blur, spread, color, opacity, inset mode, and preset multi-layer output for UI surfaces. The native Toolars workspace extracts the Aixtral client behavior into a local library, keeps style values in the browser, renders a stable preview, supports source presets such as Subtle and Elevated, and produces copy-ready box-shadow declarations for component handoff.",
    metric: { value: "Shadow", label: "CSS output" },
    inputTitle: "Tune shadow values",
    inputDescription: "Accept x and y offsets, blur, spread, color, opacity, and source presets for local shadow generation.",
    resultTitle: "Create CSS shadow",
    resultDescription: "Return box-shadow CSS, preview metadata, token-friendly values, and copy-ready output.",
    reviewTitle: "Check design fit",
    reviewDescription: "Make harsh shadows, inaccessible contrast, invalid values, and layout preview limitations visible.",
    sourceDescription: "Uses the Aixtral CSS Box Shadow Generator client presets and layer formatting as the source reference.",
    workspaceDescription: "Adds native shadow controls, source presets, live preview, layer count, generated CSS, and public catalog readiness.",
    trustTitle: "Local CSS shadow model",
    trustReviewDescription: "Shadow layers and opacity choices stay visible so teams can inspect elevation strength before copying CSS.",
    relatedSlugs: ["css-animation-generator", "css-border-radius-generator", "css-gradient-generator"],
    outcome: "Native CSS Box Shadow Generator workspace for local visual style handoff",
    accent: "slate"
  }),
  "embedding-playground": aixtralNativeDetail({
    summary: "Embedding Playground is now a native Toolars workspace for local retrieval similarity experiments.",
    overview:
      "Embedding Playground compares a query against candidate chunks with local lexical similarity so teams can inspect retrieval shape before sending text to provider embedding models. The native workspace shows query tokens, ranked chunk rows, shared token evidence, and privacy notes for lightweight RAG planning.",
    metric: { value: "Similarity", label: "Experiment focus" },
    inputTitle: "Add retrieval samples",
    inputDescription: "Accept query text and candidate chunks for a local similarity comparison.",
    resultTitle: "Rank candidate chunks",
    resultDescription: "Return top match, similarity scores, shared token evidence, and chunk metadata.",
    reviewTitle: "Check embedding assumptions",
    reviewDescription: "Make tokenizer differences, lexical-only scoring, semantic gaps, and privacy constraints visible.",
    sourceDescription: "Uses the Aixtral Embedding Playground listing and Toolars RAG planning model as the source reference.",
    workspaceDescription: "Adds a native embedding playground workbench, local similarity rows, shared-token evidence, and retrieval review notes.",
    trustTitle: "Local embedding comparison model",
    trustReviewDescription: "Local lexical overlap is a planning proxy and should be verified with provider embeddings before production retrieval.",
    relatedSlugs: ["rag-chunk-visualizer", "token-counter", "mcp-server-builder"],
    outcome: "Native Embedding Playground workspace for local retrieval similarity planning",
    accent: "indigo"
  }),
  "jailbreak-detector": aixtralNativeDetail({
    summary: "Jailbreak Detector is now a native Toolars workspace for local prompt risk review.",
    overview:
      "Jailbreak Detector reviews prompts for instruction overrides, unsafe roleplay, policy bypass attempts, and suspicious framing before AI requests are sent downstream. The native Toolars workspace runs local heuristics, groups explainable findings by category, scores severity, and gives reviewer-friendly mitigation notes for prompt owners.",
    metric: { value: "Prompt", label: "Review input" },
    inputTitle: "Paste prompt",
    inputDescription: "Accept user prompts, system context notes, and optional policy labels for local review.",
    resultTitle: "Flag jailbreak risk",
    resultDescription: "Return risk categories, highlighted phrases, severity notes, and remediation suggestions.",
    reviewTitle: "Check false positives",
    reviewDescription: "Make uncertainty, benign roleplay, missing context, and ambiguous policy matches visible.",
    sourceDescription: "Use the Aixtral Jailbreak Detector listing and Toolars prompt-safety heuristics as the source behavior reference.",
    workspaceDescription: "Adds a native workbench, severity meter, local finding cards, mitigation list, reviewer notes, and public catalog readiness.",
    trustTitle: "Local jailbreak heuristic model",
    trustReviewDescription: "Pattern matches are explainable but imperfect, so reviewers should validate benign prompts and product-specific policies.",
    relatedSlugs: ["prompt-injection-scanner", "ai-guardrail-config", "red-team-simulator"],
    outcome: "Native Jailbreak Detector workspace for local prompt risk review",
    accent: "red"
  }),
  "rag-chunk-visualizer": aixtralNativeDetail({
    summary: "RAG Chunk Visualizer is now a native Toolars workspace for local document chunk planning.",
    overview:
      "RAG Chunk Visualizer splits pasted document text into chunk previews with target size, overlap, estimated token counts, and boundary notes. The native workspace keeps source text local while making overlap tradeoffs, retrieval continuity, and tokenizer caveats visible before ingestion.",
    metric: { value: "Chunks", label: "Output shape" },
    inputTitle: "Paste document text",
    inputDescription: "Accept source text, target chunk size, and overlap amount for local RAG preview.",
    resultTitle: "Visualize chunks",
    resultDescription: "Return chunk boundaries, overlap metadata, token estimates, and retrieval-prep notes.",
    reviewTitle: "Check chunk quality",
    reviewDescription: "Make broken sections, excessive overlap, token mismatch, and missing headings visible.",
    sourceDescription: "Uses the Aixtral RAG Chunk Visualizer listing and Toolars RAG planning model as the source reference.",
    workspaceDescription: "Adds a native RAG chunk workbench, local chunk cards, overlap metadata, and retrieval review notes.",
    trustTitle: "Local RAG chunking model",
    trustReviewDescription: "Local word-token approximations are planning aids and should be checked against production tokenizers.",
    relatedSlugs: ["embedding-playground", "token-counter", "mcp-server-builder"],
    outcome: "Native RAG Chunk Visualizer workspace for local retrieval prep",
    accent: "teal"
  }),
  "red-team-simulator": aixtralNativeDetail({
    summary: "Red Team Simulator is now a native Toolars workspace for safe AI attack-scenario planning.",
    overview:
      "Red Team Simulator helps teams plan adversarial prompt scenarios, unsafe behavior probes, and mitigation review workflows for AI features. The native Toolars workspace generates bounded scenario prompts, severity labels, expected risk signals, and mitigation notes from selected vectors while keeping the exercise package local and reviewer-oriented.",
    metric: { value: "Scenarios", label: "Planning unit" },
    inputTitle: "Choose attack focus",
    inputDescription: "Accept model context, target behavior, scenario family, and mitigation notes.",
    resultTitle: "Draft red-team cases",
    resultDescription: "Return scenario prompts, expected risk signals, severity labels, and reviewer notes.",
    reviewTitle: "Check safe boundaries",
    reviewDescription: "Make harmful content risks, missing mitigations, weak evidence, and unsafe automation visible.",
    sourceDescription: "Use the Aixtral Red Team Simulator listing and Toolars safety-exercise templates as the source behavior reference.",
    workspaceDescription: "Adds a native workbench, vector toggles, generated scenario cards, mitigation checklist, warnings, and public catalog readiness.",
    trustTitle: "Local red-team simulation model",
    trustReviewDescription: "Generated scenarios are bounded planning artifacts and should not be used to automate harmful behavior or bypass policies.",
    relatedSlugs: ["jailbreak-detector", "toxicity-scanner", "system-prompt-guard"],
    outcome: "Native Red Team Simulator workspace for local AI safety exercise planning",
    accent: "orange"
  }),
  "synthetic-dataset-gen": aixtralDetail({
    badge: "Data utility",
    summary: "This Aixtral Lab listing adds Synthetic Dataset Generator detail coverage for fixture planning.",
    overview:
      "Synthetic Dataset Generator creates structured fake datasets for tests, demos, AI workflow fixtures, and data product prototypes. Toolars keeps this detail-only until a native workspace can expose schema controls, row counts, seed behavior, format exports, and privacy-safe fake data warnings.",
    metric: { value: "Dataset", label: "Generated asset" },
    inputTitle: "Define schema",
    inputDescription: "Accept field names, data types, row counts, fake-data style, and export format preferences.",
    resultTitle: "Generate records",
    resultDescription: "Return synthetic rows, schema metadata, format output, and copy or download targets.",
    reviewTitle: "Check data limits",
    reviewDescription: "Make duplicate rows, unrealistic values, privacy confusion, and large output warnings visible.",
    handoffTitle: "Plan dataset workspace",
    handoffDescription: "Use this detail page to scope schema builder controls, previews, seeding, and export states.",
    sourceDescription: "Use the Aixtral Synthetic Dataset Generator config and source behavior as the reference.",
    contractDescription: "Return schema, row count, generated dataset, export format, warnings, and download metadata.",
    relatedSlugs: ["mock-data-generator", "json-schema-builder", "json-to-csv"],
    outcome: "Synthetic dataset detail page and fake-data generation handoff",
    accent: "fuchsia"
  }),
  "system-prompt-compressor": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "System Prompt Compressor is now a native Toolars workspace for local prompt compression, token savings, and reviewer checks.",
    overview:
      "System Prompt Compressor shortens system prompts by removing redundant phrasing, verbose wording, and filler text while keeping a reviewer checklist for role, policy, and output-format instructions. The workspace follows the Aixtral source client behavior, keeps prompt text local, and adds Toolars-native before-and-after review surfaces for AI teams reducing prompt cost without weakening critical instructions.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "Rules", label: "Compression model" },
      { value: "Public", label: "Workspace status" },
      { value: "Tokens", label: "Savings output" }
    ],
    howItWorks: [
      {
        title: "Paste system prompt",
        description: "Add the system instructions, role definition, safety constraints, and output-format notes directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Apply local rewrites",
        description: "Use Aixtral-style phrase rules to remove repetition, filler language, and verbose expressions without calling a model.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Review savings",
        description: "Compare original tokens, compressed tokens, token savings, and compression ratio before copying the shorter prompt.",
        badge: "Tokens"
      },
      {
        title: "Check preservation",
        description: "Review role, policy, and output-format checks so cost reduction does not erase critical instructions.",
        badge: "Review",
        tone: "warn"
      }
    ],
    trustSection: {
      title: "Local prompt compression model",
      rows: [
        {
          badge: "Local",
          description: "Prompt text is processed in the browser and is not uploaded for compression.",
          tone: "local"
        },
        {
          badge: "Heuristic",
          description: "Compression uses transparent phrase rules and token estimates, so final prompts still need reviewer approval.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral System Prompt Compressor page and client behavior as the source reference.",
        badge: "Source",
        accent: "cyan"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, token savings metrics, rewrite suggestions, and preservation review checks.",
        badge: "Ready",
        accent: "emerald"
      }
    ],
    relatedSlugs: ["token-counter", "system-prompt-guard", "prompt-templates"],
    outcome: "Native System Prompt Compressor workspace for local prompt compression and reviewer-safe token reduction"
  },
  "system-prompt-guard": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "System Prompt Guard is now a native Toolars workspace for local system prompt risk scanning and remediation review.",
    overview:
      "System Prompt Guard reviews system prompts for injection patterns, leakage language, safety bypass attempts, role confusion, and credential-like data before the prompt reaches an AI workflow. The workspace migrates the Aixtral source rules into a Toolars-native review surface with security score, severity cards, local-only processing, and mitigation notes for prompt owners.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "5", label: "Risk categories" },
      { value: "Public", label: "Workspace status" },
      { value: "Score", label: "Review output" }
    ],
    howItWorks: [
      {
        title: "Paste system prompt",
        description: "Add the system role, policy wording, tool instructions, and sensitive prompt context directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Run local rules",
        description: "Scan for injection, leakage, bypass, role confusion, and data exposure patterns using the Aixtral source rules.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Review score",
        description: "Read the security score, risk level, finding count, and category-level finding cards.",
        badge: "Report"
      },
      {
        title: "Apply mitigations",
        description: "Use mitigation notes to tighten trusted instructions, remove secrets, and clarify role boundaries before release.",
        badge: "Review",
        tone: "warn"
      }
    ],
    trustSection: {
      title: "Local system prompt guard model",
      rows: [
        {
          badge: "Local",
          description: "System prompt text is scanned in the browser and is not uploaded for review.",
          tone: "local"
        },
        {
          badge: "Heuristic",
          description: "The guard uses transparent pattern rules, so reviewers should still validate false positives and policy context.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, source-backed library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral System Prompt Guard library, page, and client behavior as the source reference.",
        badge: "Source",
        accent: "emerald"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, risk score, finding cards, mitigation list, and public catalog readiness.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs: ["ai-guardrail-config", "prompt-injection-scanner", "system-prompt-compressor"],
    outcome: "Native System Prompt Guard workspace for local prompt safety review and remediation handoff"
  },
  "token-counter": {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: "Token Counter is now a native Toolars workspace for local prompt sizing, character counts, and model cost estimates.",
    overview:
      "Token Counter estimates prompt tokens, characters, words, lines, and selected-model cost before an LLM request is sent. The workspace follows the Aixtral source behavior with a local-first approximation, adds a model comparison table, and keeps prompt text in the browser so teams can size context and budget without uploading sensitive drafts.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "6", label: "Model profiles" },
      { value: "Public", label: "Workspace status" },
      { value: "Cost", label: "Estimate output" }
    ],
    howItWorks: [
      {
        title: "Paste prompt text",
        description: "Add system, user, retrieval, or draft prompt text directly in the local workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Choose model profile",
        description: "Pick a representative model profile to estimate a one-off request cost from token volume.",
        badge: "Model"
      },
      {
        title: "Estimate locally",
        description: "Calculate character count, word count, line count, estimated tokens, and model cost without sending prompt text away.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Compare costs",
        description: "Review all available model rows to see whether the prompt size fits the intended LLM route.",
        badge: "Review",
        tone: "warn"
      }
    ],
    trustSection: {
      title: "Local token estimation model",
      rows: [
        {
          badge: "Local",
          description: "Prompt text is processed in the browser and is not uploaded for counting.",
          tone: "local"
        },
        {
          badge: "Estimate",
          description: "Token counts use the Aixtral-style four-characters-per-token approximation, so provider tokenizers may differ.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars workspace, library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Uses the Aixtral token-counter page and client behavior as the source reference.",
        badge: "Source",
        accent: "blue"
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Adds a native workbench, selected-model estimate, model comparison rows, and public catalog readiness.",
        badge: "Ready",
        accent: "emerald"
      }
    ],
    relatedSlugs: ["llm-cost-calculator", "system-prompt-compressor", "rag-chunk-visualizer"],
    outcome: "Native Token Counter workspace for local LLM prompt sizing and cost estimation"
  },
  "toxicity-scanner": aixtralNativeDetail({
    summary: "Toxicity Scanner is now a native Toolars workspace for local moderation-signal review.",
    overview:
      "Toxicity Scanner reviews text for abusive, hateful, harassing, threatening, or unsafe language signals before AI, moderation, or publishing workflows. The native Toolars workspace keeps text local, groups explainable category findings, scores severity, and keeps context-review caveats visible before content is escalated or copied.",
    metric: { value: "Safety", label: "Scan focus" },
    inputTitle: "Paste text",
    inputDescription: "Accept text content, optional audience context, and moderation policy notes.",
    resultTitle: "Scan toxicity signals",
    resultDescription: "Return highlighted concerns, severity labels, category notes, and review recommendations.",
    reviewTitle: "Check moderation context",
    reviewDescription: "Make reclaimed language, quote context, policy uncertainty, and false-positive risk visible.",
    sourceDescription: "Use the Aixtral Toxicity Scanner listing and Toolars local moderation rules as the source behavior reference.",
    workspaceDescription: "Adds a native workbench, category cards, severity summary, mitigation notes, review warnings, and public catalog readiness.",
    trustTitle: "Local toxicity moderation model",
    trustReviewDescription: "Local moderation rules are transparent but context-sensitive, so final decisions still need human policy review.",
    relatedSlugs: ["red-team-simulator", "jailbreak-detector", "prompt-injection-scanner"],
    outcome: "Native Toxicity Scanner workspace for local moderation-signal review",
    accent: "amber"
  }),
  "mortgage-calculator": {
    listingBadge: { badge: "Local calculator", description: "Local calculator", tone: "local" },
    summary: "This VitalCalc listing keeps mortgage planning local-first while giving Toolars a public detail surface for finance users.",
    overview:
      "Mortgage Calculator estimates monthly payments, total interest, and amortization schedules from loan amount, rate, term, and down payment. It is designed as a practical household finance calculator that works without account data or cloud processing.",
    metrics: [
      { value: "Local", label: "Calculation mode" },
      { value: "4", label: "Core inputs" },
      { value: "Free", label: "Access tier" },
      { value: "Finance", label: "VitalCalc source" }
    ],
    howItWorks: [
      {
        title: "Enter loan terms",
        description: "Capture home price, down payment, interest rate, and loan length.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Calculate payment",
        description: "Estimate principal, interest, monthly payment, and full repayment exposure.",
        badge: "Math"
      },
      {
        title: "Review affordability",
        description: "Compare payment pressure and long-term interest before saving a scenario.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Hand off summary",
        description: "Use the output for budgeting, refinancing comparison, or a finance collection.",
        badge: "Handoff"
      }
    ],
    trustSection: {
      title: "Local calculation model",
      rows: [
        {
          badge: "Local",
          description: "Mortgage inputs can be processed in-browser without sending household finance data to a server.",
          tone: "local"
        },
        {
          badge: "No advice",
          description: "Results explain assumptions and should not be presented as financial advice.",
          tone: "warn"
        },
        {
          badge: "Export",
          description: "Saved scenarios should include rate, term, and timestamp for later review."
        }
      ]
    },
    handoff: [
      {
        initials: "VC",
        title: "VitalCalc source",
        description: "Port the existing mortgage calculator assumptions into the Toolars local workspace pattern.",
        badge: "Source",
        accent: "green"
      },
      {
        initials: "UI",
        title: "Detail template",
        description: "Use the shared catalog page for trust metadata, related tools, and workspace entry.",
        badge: "Stable",
        accent: "sky"
      }
    ],
    relatedSlugs: ["loan-calculator", "compound-interest"],
    outcome: "Mortgage payment and amortization summary"
  },
  "bmi-calculator": {
    listingBadge: { badge: "Health reference", description: "Health reference", tone: "local" },
    summary: "This VitalCalc listing presents BMI as a lightweight local health reference with clear limitations.",
    overview:
      "BMI Calculator estimates body mass index from height and weight, then explains the resulting category. The Toolars detail page frames it as local, fast, and informational rather than diagnostic.",
    metrics: [
      { value: "Local", label: "Calculation mode" },
      { value: "2", label: "Core inputs" },
      { value: "Free", label: "Access tier" },
      { value: "Health", label: "VitalCalc source" }
    ],
    howItWorks: [
      {
        title: "Enter body metrics",
        description: "Capture height and weight without storing personal health data by default.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Calculate BMI",
        description: "Compute BMI and map the result to common reference categories.",
        badge: "Math"
      },
      {
        title: "Read limitations",
        description: "Flag that BMI is a screening reference and does not measure body composition directly.",
        badge: "Context",
        tone: "warn"
      },
      {
        title: "Compare next tools",
        description: "Move into hydration or metabolism calculators for a broader health snapshot.",
        badge: "Handoff"
      }
    ],
    trustSection: {
      title: "Local calculation model",
      rows: [
        {
          badge: "Local",
          description: "Height and weight can be calculated in-browser without account storage.",
          tone: "local"
        },
        {
          badge: "Reference",
          description: "BMI output is informational and not a medical diagnosis.",
          tone: "warn"
        },
        {
          badge: "Privacy",
          description: "Future saved health profiles should make storage and deletion controls explicit."
        }
      ]
    },
    handoff: [
      {
        initials: "VC",
        title: "VitalCalc source",
        description: "Carry over the simple BMI calculation model and health range explanation.",
        badge: "Source",
        accent: "teal"
      },
      {
        initials: "UX",
        title: "Health disclaimer",
        description: "Keep medical caveats close to the result and avoid diagnostic language.",
        badge: "Required",
        accent: "orange"
      }
    ],
    relatedSlugs: ["water-intake", "bmr-calculator"],
    outcome: "BMI category and health reference summary"
  },
  "loan-calculator": {
    listingBadge: { badge: "Local finance", description: "Local finance", tone: "local" },
    summary: "This VitalCalc listing expands finance coverage with a general loan payment page for personal, auto, and student loan scenarios.",
    overview:
      "Loan Calculator estimates monthly payments, total interest, and payoff schedules from principal, annual rate, and repayment term. It gives the merged Toolars catalog a reusable local finance detail page for non-mortgage debt planning.",
    metrics: [
      { value: "Local", label: "Calculation mode" },
      { value: "3", label: "Core inputs" },
      { value: "Free", label: "Access tier" },
      { value: "Finance", label: "VitalCalc source" }
    ],
    howItWorks: [
      {
        title: "Enter debt terms",
        description: "Capture principal, APR, repayment term, and optional extra payment assumptions.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Estimate repayment",
        description: "Calculate monthly payment, total interest, payoff date, and repayment total.",
        badge: "Math"
      },
      {
        title: "Compare scenarios",
        description: "Review how term length and extra payments change interest exposure.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Export plan",
        description: "Hand off a payment schedule to budgeting or finance review collections.",
        badge: "Handoff"
      }
    ],
    trustSection: {
      title: "Local calculation model",
      rows: [
        {
          badge: "Local",
          description: "Loan scenarios can be calculated client-side without transmitting debt information.",
          tone: "local"
        },
        {
          badge: "Assumptions",
          description: "APR, compounding, fees, and payment timing should be shown next to every result.",
          tone: "warn"
        },
        {
          badge: "Export",
          description: "Saved plans should include all assumptions used to generate the payoff schedule."
        }
      ]
    },
    handoff: [
      {
        initials: "VC",
        title: "VitalCalc source",
        description: "Use the loan calculator source page as the canonical finance calculation reference.",
        badge: "Source",
        accent: "sky"
      },
      {
        initials: "API",
        title: "Calculator contract",
        description: "Return monthly payment, total interest, total repayment, payoff rows, and assumptions.",
        badge: "Next",
        accent: "green"
      }
    ],
    relatedSlugs: ["mortgage-calculator", "compound-interest"],
    outcome: "Loan payment and payoff schedule"
  },
  "compound-interest": vitalCalcDetail({
    badge: "Growth planner",
    summary: "This VitalCalc listing covers compound growth planning for savings, investing, and recurring contribution scenarios.",
    overview:
      "Compound Interest Calculator estimates future value from principal, contribution cadence, rate, term, and compounding frequency. It gives finance users a local way to compare long-term growth assumptions before moving into retirement or loan planning.",
    metric: { value: "Growth", label: "Compound estimate" },
    category: "Finance",
    inputTitle: "Enter growth assumptions",
    inputDescription: "Capture starting principal, contribution amount, rate, term, and compounding frequency.",
    resultTitle: "Project future value",
    resultDescription: "Calculate ending balance, total contributions, and interest earned across the selected timeline.",
    reviewTitle: "Review sensitivity",
    reviewDescription: "Show how return rate, contribution cadence, and compounding frequency change the result.",
    handoffTitle: "Compare finance plans",
    handoffDescription: "Hand off the growth scenario to retirement, loan, or ROI calculators.",
    localDescription: "Growth assumptions can be calculated in-browser without sending savings or investment data to a server.",
    cautionBadge: "Assumptions",
    cautionDescription: "Long-term projections should show return assumptions clearly and avoid presenting results as investment advice.",
    sourceDescription: "Use the VitalCalc compound interest source page as the growth calculation reference.",
    contractDescription: "Return future value, contribution total, interest earned, compounding frequency, and assumptions.",
    relatedSlugs: ["retirement-calculator", "roi-calculator", "loan-calculator"],
    outcome: "Future value and interest growth summary",
    accent: "emerald"
  }),
  "bmr-calculator": vitalCalcDetail({
    badge: "Metabolism reference",
    summary: "This VitalCalc listing adds a local basal metabolic rate reference for health and calorie planning.",
    overview:
      "BMR Calculator estimates basal metabolic rate from age, sex, height, and weight. Toolars frames the result as a private planning reference that can feed TDEE and nutrition calculators without storing health data by default.",
    metric: { value: "BMR", label: "Basal metabolic estimate" },
    category: "Health",
    inputTitle: "Enter body metrics",
    inputDescription: "Capture age, sex, height, and weight locally before running the formula.",
    resultTitle: "Estimate baseline energy",
    resultDescription: "Calculate basal metabolic rate and show the formula assumptions behind the estimate.",
    reviewTitle: "Read limitations",
    reviewDescription: "Explain that BMR varies by body composition, health status, and formula selection.",
    handoffTitle: "Continue energy planning",
    handoffDescription: "Hand off BMR to TDEE, hydration, or protein calculators for a broader health view.",
    localDescription: "Body metrics can be processed in-browser without account storage or cloud processing.",
    cautionBadge: "Reference",
    cautionDescription: "BMR output is an estimate for planning and is not medical or nutrition advice.",
    sourceDescription: "Use the VitalCalc BMR source page as the metabolism estimate reference.",
    contractDescription: "Return BMR, formula label, input assumptions, and related calorie planning notes.",
    relatedSlugs: ["tdee-calculator", "water-intake", "bmi-calculator"],
    outcome: "Basal metabolic estimate",
    accent: "orange"
  }),
  "water-intake": vitalCalcDetail({
    badge: "Hydration guide",
    summary: "This VitalCalc listing adds a private hydration target calculator for daily health planning.",
    overview:
      "Water Intake Calculator estimates daily hydration needs from body weight, activity, and environmental assumptions. It extends the Toolars health catalog with a local reference that pairs naturally with BMI, BMR, and TDEE tools.",
    metric: { value: "Daily", label: "Hydration target" },
    category: "Health",
    inputTitle: "Enter hydration context",
    inputDescription: "Capture body weight, activity level, climate, and optional exercise duration locally.",
    resultTitle: "Estimate daily intake",
    resultDescription: "Calculate a practical water intake target and the assumptions used to produce it.",
    reviewTitle: "Review caveats",
    reviewDescription: "Flag that hydration needs vary with health status, medication, climate, and clinician guidance.",
    handoffTitle: "Compare health tools",
    handoffDescription: "Hand off the result to BMI, BMR, or TDEE calculators for a broader wellness snapshot.",
    localDescription: "Hydration context can be calculated in-browser without storing personal health data.",
    cautionBadge: "Reference",
    cautionDescription: "Hydration output is informational and should not override medical advice.",
    sourceDescription: "Use the VitalCalc water intake source page as the hydration estimate reference.",
    contractDescription: "Return daily intake target, activity adjustment, climate note, and assumptions.",
    relatedSlugs: ["bmi-calculator", "bmr-calculator", "tdee-calculator"],
    outcome: "Daily hydration target",
    accent: "cyan"
  }),
  "retirement-calculator": vitalCalcDetail({
    badge: "Retirement planner",
    summary: "This VitalCalc listing expands long-term finance planning with a local retirement readiness calculator.",
    overview:
      "Retirement Calculator estimates savings progress, future portfolio needs, and whether a current savings pace is on track. The Toolars detail page frames the output as a planning reference with transparent assumptions.",
    metric: { value: "4", label: "Retirement inputs" },
    category: "Finance",
    inputTitle: "Enter retirement assumptions",
    inputDescription: "Capture age, current savings, target retirement age, contribution pace, and expected return.",
    resultTitle: "Estimate retirement gap",
    resultDescription: "Calculate projected savings, target portfolio, and surplus or shortfall at retirement.",
    reviewTitle: "Review assumptions",
    reviewDescription: "Show how return rate, inflation, and contribution changes affect the plan.",
    handoffTitle: "Save planning snapshot",
    handoffDescription: "Hand off the scenario to finance review or long-term savings collections.",
    localDescription: "Retirement assumptions can be calculated client-side without sending household finance data to a server.",
    cautionBadge: "Assumptions",
    cautionDescription: "Long-range projections should clearly show return, inflation, and contribution assumptions.",
    sourceDescription: "Use the VitalCalc retirement source page as the canonical planning calculator reference.",
    contractDescription: "Return projected savings, target amount, gap, monthly contribution, and assumptions.",
    relatedSlugs: ["loan-calculator", "roi-calculator", "debt-payoff"],
    outcome: "Retirement readiness summary",
    accent: "indigo"
  }),
  "debt-payoff": vitalCalcDetail({
    badge: "Debt plan",
    summary: "This VitalCalc listing adds a payoff planner for credit cards, loans, and other debt.",
    overview:
      "Debt Payoff Calculator compares avalanche and snowball plans, estimates payoff timing, and highlights interest exposure. It gives Toolars a local-first debt planning detail page for practical finance workflows.",
    metric: { value: "2", label: "Payoff methods" },
    category: "Finance",
    inputTitle: "Enter debts",
    inputDescription: "Capture balances, APRs, minimum payments, and optional extra monthly payment.",
    resultTitle: "Compare payoff paths",
    resultDescription: "Estimate payoff date, total interest, and method differences for avalanche and snowball plans.",
    reviewTitle: "Review debt pressure",
    reviewDescription: "Flag high-interest exposure, minimum-payment drag, and sensitive assumptions.",
    handoffTitle: "Export payoff schedule",
    handoffDescription: "Hand off the repayment plan to budgeting or finance review collections.",
    localDescription: "Debt balances and APR assumptions can be processed locally without transmitting sensitive finance details.",
    cautionBadge: "No advice",
    cautionDescription: "Outputs are planning references and should not be presented as debt or credit counseling.",
    sourceDescription: "Use the VitalCalc debt payoff source page as the payoff schedule reference.",
    contractDescription: "Return payoff date, interest total, monthly schedule, method label, and assumptions.",
    relatedSlugs: ["loan-calculator", "retirement-calculator", "roi-calculator"],
    outcome: "Debt payoff schedule and interest summary",
    accent: "orange"
  }),
  "roi-calculator": vitalCalcDetail({
    badge: "Investment reference",
    summary: "This VitalCalc listing adds a compact investment return calculator to the finance catalog.",
    overview:
      "ROI Calculator computes return percentage and profit from starting value, ending value, and costs. It is a local reference for comparing investments, campaigns, and one-off financial outcomes.",
    metric: { value: "ROI", label: "Return estimate" },
    category: "Finance",
    inputTitle: "Enter investment values",
    inputDescription: "Capture initial cost, final value, fees, and optional holding period.",
    resultTitle: "Calculate return",
    resultDescription: "Compute profit, ROI percentage, and net result after costs.",
    reviewTitle: "Review comparability",
    reviewDescription: "Flag missing costs, time horizon, and whether annualized return is needed.",
    handoffTitle: "Compare scenarios",
    handoffDescription: "Hand off the result to investment planning or finance collections.",
    localDescription: "ROI scenarios can be calculated locally without storing investment data.",
    cautionBadge: "Context",
    cautionDescription: "ROI should be read with time horizon, risk, and fees rather than as a standalone decision.",
    sourceDescription: "Use the VitalCalc ROI source page as the simple return calculation reference.",
    contractDescription: "Return profit, ROI percent, net cost, optional annualized return, and assumptions.",
    relatedSlugs: ["retirement-calculator", "loan-calculator", "debt-payoff"],
    outcome: "ROI percentage and profit summary",
    accent: "amber"
  }),
  "tdee-calculator": vitalCalcDetail({
    badge: "Energy estimate",
    summary: "This VitalCalc listing adds a daily energy calculator for health and nutrition planning.",
    overview:
      "TDEE Calculator estimates total daily energy expenditure from BMR and activity level. It gives the Toolars health catalog a local reference for calorie planning, macro calculators, and fitness workflows.",
    metric: { value: "TDEE", label: "Daily energy estimate" },
    category: "Health",
    inputTitle: "Enter body and activity data",
    inputDescription: "Capture age, sex, height, weight, and activity level without saving health data by default.",
    resultTitle: "Estimate daily energy",
    resultDescription: "Calculate BMR, activity multiplier, and total daily energy expenditure.",
    reviewTitle: "Read limitations",
    reviewDescription: "Explain that estimates vary by body composition, metabolism, and tracking accuracy.",
    handoffTitle: "Continue to nutrition tools",
    handoffDescription: "Hand off TDEE to protein, macro, or calorie planning calculators.",
    localDescription: "Body and activity inputs can be calculated in-browser without account storage.",
    cautionBadge: "Reference",
    cautionDescription: "TDEE output is an estimate for planning and is not medical or nutrition advice.",
    sourceDescription: "Use the VitalCalc TDEE source page as the energy estimate reference.",
    contractDescription: "Return BMR, activity factor, TDEE, maintenance calories, and assumptions.",
    relatedSlugs: ["protein-calculator", "body-fat-calculator", "bmi-calculator"],
    outcome: "Daily energy estimate",
    accent: "blue"
  }),
  "body-fat-calculator": vitalCalcDetail({
    badge: "Body composition",
    summary: "This VitalCalc listing adds a local body composition reference using the US Navy method.",
    overview:
      "Body Fat Calculator estimates body fat percentage from body measurements. Toolars frames the result as a private reference for fitness planning, not a diagnosis or clinical measurement.",
    metric: { value: "US Navy", label: "Estimate method" },
    category: "Health",
    inputTitle: "Enter measurements",
    inputDescription: "Capture sex, height, neck, waist, and hip measurements locally.",
    resultTitle: "Estimate body fat",
    resultDescription: "Calculate body fat percentage and a reference category from the selected method.",
    reviewTitle: "Read measurement caveats",
    reviewDescription: "Explain that tape measurement accuracy and formula assumptions can shift results.",
    handoffTitle: "Compare health tools",
    handoffDescription: "Hand off to BMI, TDEE, or protein calculators for a broader view.",
    localDescription: "Body measurements can be processed in-browser without account storage.",
    cautionBadge: "Reference",
    cautionDescription: "Body fat output is an estimate and should not replace clinical assessment.",
    sourceDescription: "Use the VitalCalc body fat source page as the measurement-based calculation reference.",
    contractDescription: "Return body fat percentage, category, method label, and measurement assumptions.",
    relatedSlugs: ["bmi-calculator", "tdee-calculator", "protein-calculator"],
    outcome: "Body fat percentage estimate",
    accent: "pink"
  }),
  "protein-calculator": vitalCalcDetail({
    badge: "Nutrition target",
    summary: "This VitalCalc listing adds a protein target calculator for health, fitness, and nutrition planning.",
    overview:
      "Protein Calculator estimates daily protein needs from weight, activity level, and goals. It connects the local health catalog to TDEE and body composition workflows without requiring cloud processing.",
    metric: { value: "g/day", label: "Protein target" },
    category: "Health",
    inputTitle: "Enter nutrition context",
    inputDescription: "Capture weight, activity level, training goal, and optional diet preference.",
    resultTitle: "Calculate protein range",
    resultDescription: "Estimate daily protein target and a practical intake range.",
    reviewTitle: "Review nutrition caveats",
    reviewDescription: "Explain that targets vary by health status, training load, and clinician guidance.",
    handoffTitle: "Continue planning",
    handoffDescription: "Hand off the target to TDEE, macro, or body composition calculators.",
    localDescription: "Weight and goal inputs can be processed locally without uploading health data.",
    cautionBadge: "Reference",
    cautionDescription: "Protein targets are informational and should not override medical nutrition advice.",
    sourceDescription: "Use the VitalCalc protein source page as the nutrition target reference.",
    contractDescription: "Return protein grams per day, range, goal label, and assumptions.",
    relatedSlugs: ["tdee-calculator", "body-fat-calculator", "bmi-calculator"],
    outcome: "Daily protein target range",
    accent: "lime"
  }),
  "income-tax": vitalCalcDetail({
    badge: "Take-home pay",
    summary: "This VitalCalc listing adds a local income tax estimate for salary, deduction, and take-home pay planning.",
    overview:
      "Income Tax Calculator estimates net pay from gross income, deduction assumptions, and tax inputs. It expands the Toolars finance catalog with a practical local reference for paycheck and budget planning.",
    metric: { value: "Net pay", label: "Take-home estimate" },
    category: "Finance",
    inputTitle: "Enter income assumptions",
    inputDescription: "Capture gross income, filing period, deductions, and tax assumptions locally.",
    resultTitle: "Estimate take-home pay",
    resultDescription: "Calculate tax withheld, net income, effective rate, and remaining budgetable pay.",
    reviewTitle: "Review tax context",
    reviewDescription: "Flag that rates, deductions, credits, and local rules can change the final liability.",
    handoffTitle: "Continue budgeting",
    handoffDescription: "Hand off the net-pay estimate to FIRE, discount, or retirement planning tools.",
    localDescription: "Income and deduction assumptions can be calculated in-browser without sending payroll data to a server.",
    cautionBadge: "No advice",
    cautionDescription: "Tax estimates are planning references and should not be presented as tax advice or filing guidance.",
    sourceDescription: "Use the VitalCalc income tax source page as the take-home pay calculation reference.",
    contractDescription: "Return gross income, estimated tax, net pay, effective rate, and assumptions.",
    relatedSlugs: ["fire-calculator", "discount-calculator", "retirement-calculator"],
    outcome: "Take-home pay and effective tax summary",
    accent: "rose"
  }),
  "fire-calculator": vitalCalcDetail({
    badge: "Early retirement",
    summary: "This VitalCalc listing adds a financial independence calculator for FIRE planning and savings target reviews.",
    overview:
      "FIRE Calculator estimates the portfolio target needed for financial independence from annual spending, savings rate, expected returns, and withdrawal assumptions. Toolars frames the result as a local planning snapshot, not financial advice.",
    metric: { value: "FIRE", label: "Financial independence target" },
    category: "Finance",
    inputTitle: "Enter FIRE assumptions",
    inputDescription: "Capture annual expenses, current savings, savings rate, return assumption, and withdrawal rate.",
    resultTitle: "Estimate target date",
    resultDescription: "Calculate target portfolio, projected years to FIRE, and savings gap.",
    reviewTitle: "Review sensitivity",
    reviewDescription: "Show how withdrawal rate, market return, inflation, and spending changes alter the result.",
    handoffTitle: "Compare retirement plans",
    handoffDescription: "Hand off the scenario to retirement, income tax, or compound growth calculators.",
    localDescription: "FIRE assumptions can be processed locally without transmitting income, savings, or spending data.",
    cautionBadge: "Assumptions",
    cautionDescription: "Financial independence projections should show market, inflation, tax, and withdrawal assumptions clearly.",
    sourceDescription: "Use the VitalCalc FIRE source page as the early retirement planning reference.",
    contractDescription: "Return target portfolio, years to FIRE, savings gap, withdrawal rate, and assumptions.",
    relatedSlugs: ["retirement-calculator", "income-tax", "compound-interest"],
    outcome: "Financial independence target and timeline",
    accent: "red"
  }),
  "discount-calculator": vitalCalcDetail({
    badge: "Checkout math",
    summary: "This VitalCalc listing adds a local sale price and savings calculator for everyday purchase decisions.",
    overview:
      "Discount Calculator computes sale price, discount amount, tax, and final checkout cost from a list price and percentage off. It gives Toolars a simple local finance detail for daily calculations.",
    metric: { value: "Sale", label: "Final price estimate" },
    category: "Finance",
    inputTitle: "Enter price and discount",
    inputDescription: "Capture original price, discount percentage, optional tax, and quantity.",
    resultTitle: "Calculate final price",
    resultDescription: "Compute discount amount, tax impact, final price, and total savings.",
    reviewTitle: "Review checkout assumptions",
    reviewDescription: "Flag whether tax, fees, coupons, and stacked discounts are included.",
    handoffTitle: "Compare budget impact",
    handoffDescription: "Hand off the savings result to income tax, ROI, or compound interest tools.",
    localDescription: "Purchase values can be calculated in-browser without storing shopping data.",
    cautionBadge: "Context",
    cautionDescription: "Discount results should distinguish simple percentage math from retailer-specific checkout rules.",
    sourceDescription: "Use the VitalCalc discount calculator source page as the sale price reference.",
    contractDescription: "Return discount amount, tax amount, final price, savings percent, and assumptions.",
    relatedSlugs: ["income-tax", "roi-calculator", "compound-interest"],
    outcome: "Final price and savings summary",
    accent: "violet"
  }),
  "heart-rate-zone": vitalCalcDetail({
    badge: "Training zones",
    summary: "This VitalCalc listing adds a local target heart rate zone reference for cardio training and recovery planning.",
    overview:
      "Heart Rate Zone Calculator estimates training zones from age and optional resting heart rate. Toolars presents the result as a private fitness reference that pairs with energy and sleep planning.",
    metric: { value: "5", label: "Training zones" },
    category: "Health",
    inputTitle: "Enter training context",
    inputDescription: "Capture age, resting heart rate, and optional training goal locally.",
    resultTitle: "Calculate zones",
    resultDescription: "Estimate easy, fat burn, aerobic, threshold, and max-effort heart rate ranges.",
    reviewTitle: "Read safety caveats",
    reviewDescription: "Explain that medications, conditions, and fitness history can affect safe intensity ranges.",
    handoffTitle: "Continue fitness planning",
    handoffDescription: "Hand off target zones to TDEE, sleep, or protein calculators.",
    localDescription: "Age and heart rate inputs can be processed in-browser without account storage.",
    cautionBadge: "Reference",
    cautionDescription: "Heart rate zones are informational and should not override clinician or coach guidance.",
    sourceDescription: "Use the VitalCalc heart rate zone source page as the training range reference.",
    contractDescription: "Return zone ranges, formula label, intensity notes, and assumptions.",
    relatedSlugs: ["tdee-calculator", "sleep-calculator", "protein-calculator"],
    outcome: "Target heart rate zone ranges",
    accent: "red"
  }),
  "sleep-calculator": vitalCalcDetail({
    badge: "Sleep schedule",
    summary: "This VitalCalc listing adds a local sleep cycle calculator for bedtime and wake-up planning.",
    overview:
      "Sleep Calculator estimates bedtime or wake-up windows from sleep cycles, wake time, and routine assumptions. It expands Toolars health coverage with a low-friction wellness planning detail page.",
    metric: { value: "Cycles", label: "Sleep schedule estimate" },
    category: "Health",
    inputTitle: "Enter schedule goal",
    inputDescription: "Capture target wake time or bedtime, sleep cycle length, and wind-down buffer.",
    resultTitle: "Estimate sleep windows",
    resultDescription: "Calculate practical bedtime or wake-up options aligned to sleep cycles.",
    reviewTitle: "Read wellness caveats",
    reviewDescription: "Explain that sleep needs vary with age, health, stress, caffeine, and routine consistency.",
    handoffTitle: "Compare health context",
    handoffDescription: "Hand off the schedule to heart rate, hydration, or metabolism calculators.",
    localDescription: "Sleep schedule inputs can be calculated locally without storing wellness routines.",
    cautionBadge: "Reference",
    cautionDescription: "Sleep windows are planning references and not a diagnosis for insomnia or sleep disorders.",
    sourceDescription: "Use the VitalCalc sleep calculator source page as the sleep cycle reference.",
    contractDescription: "Return bedtime windows, wake-up windows, cycle count, buffer, and assumptions.",
    relatedSlugs: ["heart-rate-zone", "water-intake", "bmr-calculator"],
    outcome: "Sleep schedule estimate",
    accent: "indigo"
  }),
  "ideal-weight-calculator": vitalCalcDetail({
    badge: "Weight reference",
    summary: "This VitalCalc listing adds an ideal weight reference for comparing height-based formulas and health ranges.",
    overview:
      "Ideal Weight Calculator estimates reference weight ranges from height, sex, and standard formulas. Toolars frames it as a private planning aid with visible limitations, not a diagnostic target.",
    metric: { value: "Devine", label: "Formula reference" },
    category: "Health",
    inputTitle: "Enter body context",
    inputDescription: "Capture height, sex, and optional frame-size context locally.",
    resultTitle: "Estimate weight range",
    resultDescription: "Calculate formula-based ideal weight and compare it with BMI-derived ranges.",
    reviewTitle: "Read limitations",
    reviewDescription: "Explain that body composition, age, training status, and medical context can make formula targets misleading.",
    handoffTitle: "Compare body metrics",
    handoffDescription: "Hand off the range to BMI, body fat, or TDEE calculators for a broader health reference.",
    localDescription: "Height and formula inputs can be processed in-browser without account storage.",
    cautionBadge: "Reference",
    cautionDescription: "Ideal weight output is informational and should not be treated as a medical or nutrition prescription.",
    sourceDescription: "Use the VitalCalc ideal weight source page as the formula-based reference.",
    contractDescription: "Return ideal weight, range, formula label, BMI comparison, and caveats.",
    relatedSlugs: ["bmi-calculator", "body-fat-calculator", "tdee-calculator"],
    outcome: "Ideal weight range summary",
    accent: "teal"
  }),
  "car-loan": vitalCalcDetail({
    badge: "Vehicle financing",
    summary: "This VitalCalc listing adds an auto loan payment reference for comparing vehicle financing assumptions.",
    overview:
      "Car Loan Calculator estimates monthly payment, total interest, and ownership financing exposure from vehicle price, down payment, rate, and term. Toolars frames the result as local planning math before users compare affordability or loan alternatives.",
    metric: { value: "Auto", label: "Vehicle loan estimate" },
    category: "Finance",
    inputTitle: "Enter vehicle terms",
    inputDescription: "Capture vehicle price, down payment, APR, term, trade-in, and optional fees locally.",
    resultTitle: "Estimate payment",
    resultDescription: "Calculate monthly payment, total interest, financed amount, and total repayment.",
    reviewTitle: "Review ownership cost",
    reviewDescription: "Flag taxes, insurance, registration, maintenance, and depreciation as separate assumptions.",
    handoffTitle: "Compare loan options",
    handoffDescription: "Hand off the scenario to loan, home affordability, or income tax calculators.",
    localDescription: "Vehicle price and loan terms can be processed in-browser without sending purchase data to a server.",
    cautionBadge: "No advice",
    cautionDescription: "Auto loan outputs are planning references and should not be presented as lending advice.",
    sourceDescription: "Use the VitalCalc car loan source page as the vehicle payment calculation reference.",
    contractDescription: "Return financed amount, monthly payment, total interest, total repayment, and assumptions.",
    relatedSlugs: ["loan-calculator", "home-affordability-calculator", "income-tax"],
    outcome: "Vehicle loan payment and interest summary",
    accent: "blue"
  }),
  "rent-vs-buy": vitalCalcDetail({
    badge: "Housing comparison",
    summary: "This VitalCalc listing adds a local housing decision calculator for comparing rent and buy scenarios.",
    overview:
      "Rent vs Buy Calculator compares long-term renting and buying costs from rent, home price, mortgage, tax, maintenance, appreciation, and investment assumptions. It helps Toolars users review housing tradeoffs without sending household finance data to a server.",
    metric: { value: "Break-even", label: "Break-even comparison" },
    category: "Finance",
    inputTitle: "Enter housing assumptions",
    inputDescription: "Capture rent, home price, down payment, rate, property tax, maintenance, and expected appreciation.",
    resultTitle: "Compare scenarios",
    resultDescription: "Estimate ownership cost, renting cost, net difference, and break-even timing.",
    reviewTitle: "Review sensitivity",
    reviewDescription: "Show how rate, appreciation, rent growth, maintenance, and time horizon change the outcome.",
    handoffTitle: "Check affordability",
    handoffDescription: "Hand off the chosen scenario to mortgage or home affordability calculators.",
    localDescription: "Housing scenarios can be calculated locally without transmitting income, rent, or property assumptions.",
    cautionBadge: "Assumptions",
    cautionDescription: "Rent-vs-buy outputs depend heavily on market, tax, maintenance, and investment assumptions.",
    sourceDescription: "Use the VitalCalc rent vs buy source page as the housing comparison reference.",
    contractDescription: "Return renting cost, buying cost, break-even year, net difference, and assumptions.",
    relatedSlugs: ["mortgage-calculator", "home-affordability-calculator", "income-tax"],
    outcome: "Rent versus buy break-even summary",
    accent: "emerald"
  }),
  "home-affordability-calculator": vitalCalcDetail({
    badge: "Home budget",
    summary: "This VitalCalc listing adds a local home affordability reference for estimating a safe purchase range.",
    overview:
      "Home Affordability Calculator estimates an affordable home price from income, debt, down payment, mortgage rate, taxes, and insurance. Toolars presents it as a private planning checkpoint before mortgage scenario work.",
    metric: { value: "DTI", label: "Affordability range" },
    category: "Finance",
    inputTitle: "Enter budget context",
    inputDescription: "Capture monthly income, existing debt, down payment, rate, tax, insurance, and target debt-to-income limit.",
    resultTitle: "Estimate home range",
    resultDescription: "Calculate affordable home price, estimated payment, debt-to-income ratio, and down payment pressure.",
    reviewTitle: "Review constraints",
    reviewDescription: "Flag that credit, lender rules, local taxes, insurance, and cash reserves can change approval outcomes.",
    handoffTitle: "Model mortgage terms",
    handoffDescription: "Hand off the range to mortgage, rent-vs-buy, or loan calculators.",
    localDescription: "Income, debt, and down payment assumptions can be processed locally without account storage.",
    cautionBadge: "No advice",
    cautionDescription: "Affordability estimates are planning references and not mortgage preapproval.",
    sourceDescription: "Use the VitalCalc home affordability source page as the housing budget reference.",
    contractDescription: "Return affordable price range, estimated payment, DTI, down payment, and assumptions.",
    relatedSlugs: ["mortgage-calculator", "rent-vs-buy", "loan-calculator"],
    outcome: "Home affordability range",
    accent: "green"
  }),
  "waist-hip-ratio": vitalCalcDetail({
    badge: "Body ratio",
    summary: "This VitalCalc listing adds a local waist-to-hip ratio reference for body measurement context.",
    overview:
      "Waist-Hip Ratio Calculator estimates waist-to-hip ratio from simple measurements and maps the result to reference categories. Toolars keeps the calculation local and positions the result as informational rather than diagnostic.",
    metric: { value: "WHR", label: "Waist-to-hip ratio" },
    category: "Health",
    inputTitle: "Enter measurements",
    inputDescription: "Capture waist, hip, and optional sex context locally before calculating the ratio.",
    resultTitle: "Calculate ratio",
    resultDescription: "Compute waist-to-hip ratio and show reference category context.",
    reviewTitle: "Read measurement caveats",
    reviewDescription: "Explain that tape placement, body composition, and clinical context can shift interpretation.",
    handoffTitle: "Compare body metrics",
    handoffDescription: "Hand off the ratio to BMI, body fat, or ideal weight calculators.",
    localDescription: "Body measurements can be processed in-browser without account storage.",
    cautionBadge: "Reference",
    cautionDescription: "Waist-to-hip ratio output is informational and should not replace clinical risk assessment.",
    sourceDescription: "Use the VitalCalc waist-hip ratio source page as the body measurement reference.",
    contractDescription: "Return waist-to-hip ratio, category, measurement assumptions, and caveats.",
    relatedSlugs: ["bmi-calculator", "body-fat-calculator", "ideal-weight-calculator"],
    outcome: "Waist-to-hip ratio reference",
    accent: "orange"
  }),
  "blood-pressure": vitalCalcDetail({
    badge: "Pressure category",
    summary: "This VitalCalc listing adds a local blood pressure category reference for systolic and diastolic readings.",
    overview:
      "Blood Pressure Calculator classifies blood pressure readings from systolic and diastolic inputs. Toolars frames it as a private reference surface with strong caveats around repeat readings and medical guidance.",
    metric: { value: "BP", label: "Blood pressure category" },
    category: "Health",
    inputTitle: "Enter readings",
    inputDescription: "Capture systolic and diastolic readings locally, with optional measurement context.",
    resultTitle: "Classify range",
    resultDescription: "Map readings to common blood pressure categories and show the determining value.",
    reviewTitle: "Read health caveats",
    reviewDescription: "Explain that diagnosis requires proper technique, repeat readings, and clinician review.",
    handoffTitle: "Continue health context",
    handoffDescription: "Hand off the reference to heart rate, BMI, or hydration tools.",
    localDescription: "Blood pressure readings can be classified in-browser without uploading health data.",
    cautionBadge: "Medical",
    cautionDescription: "Blood pressure output is not a diagnosis; urgent or concerning readings require medical guidance.",
    sourceDescription: "Use the VitalCalc blood pressure source page as the category reference.",
    contractDescription: "Return category, systolic/diastolic drivers, notes, and measurement caveats.",
    relatedSlugs: ["heart-rate-zone", "bmi-calculator", "water-intake"],
    outcome: "Blood pressure category reference",
    accent: "rose"
  }),
  "child-growth": vitalCalcDetail({
    badge: "Growth reference",
    summary: "This VitalCalc listing adds a local child growth and BMI percentile reference for family health planning.",
    overview:
      "Child Growth Calculator estimates child BMI percentile context from age, sex, height, and weight. Toolars presents it as a private reference page with careful pediatric caveats before any full workspace implementation.",
    metric: { value: "Percentile", label: "Growth reference" },
    category: "Health",
    inputTitle: "Enter child context",
    inputDescription: "Capture age, sex, height, and weight locally before calculating BMI percentile context.",
    resultTitle: "Estimate percentile",
    resultDescription: "Calculate BMI and map the result to child growth percentile reference bands.",
    reviewTitle: "Read pediatric caveats",
    reviewDescription: "Explain that growth interpretation depends on age, sex, history, and clinician review.",
    handoffTitle: "Compare body references",
    handoffDescription: "Hand off the context to BMI, ideal weight, or body measurement calculators.",
    localDescription: "Child body metrics can be processed locally without account storage.",
    cautionBadge: "Pediatric",
    cautionDescription: "Growth percentile output is informational and should not replace pediatric guidance.",
    sourceDescription: "Use the VitalCalc child growth source page as the percentile reference.",
    contractDescription: "Return BMI, percentile band, age/sex assumptions, and pediatric caveats.",
    relatedSlugs: ["bmi-calculator", "ideal-weight-calculator", "waist-hip-ratio"],
    outcome: "Child growth percentile reference",
    accent: "cyan"
  }),
  "student-loan-calculator": vitalCalcDetail({
    badge: "Education debt",
    summary: "This VitalCalc listing adds a local student loan repayment reference for education finance planning.",
    overview:
      "Student Loan Calculator estimates monthly payment, total interest, and repayment timing from principal, APR, loan term, and optional extra payments. Toolars frames the output as private planning math for comparing repayment assumptions.",
    metric: { value: "Repay", label: "Student loan estimate" },
    category: "Finance",
    inputTitle: "Enter loan terms",
    inputDescription: "Capture balance, APR, repayment term, grace assumptions, and optional extra payment locally.",
    resultTitle: "Estimate repayment",
    resultDescription: "Calculate monthly payment, total interest, repayment total, and payoff timeline.",
    reviewTitle: "Review repayment context",
    reviewDescription: "Flag that federal plans, deferment, forgiveness, fees, and capitalization can change outcomes.",
    handoffTitle: "Compare debt paths",
    handoffDescription: "Hand off the scenario to loan, debt payoff, or income tax calculators.",
    localDescription: "Student loan balances and repayment assumptions can be calculated in-browser without server transmission.",
    cautionBadge: "No advice",
    cautionDescription: "Student loan outputs are planning references and should not be presented as loan counseling.",
    sourceDescription: "Use the VitalCalc student loan source page as the education debt calculation reference.",
    contractDescription: "Return payment, total interest, repayment total, payoff timeline, and assumptions.",
    relatedSlugs: ["loan-calculator", "debt-payoff", "income-tax"],
    outcome: "Student loan repayment summary",
    accent: "purple"
  }),
  "apy-calculator": vitalCalcDetail({
    badge: "Yield comparison",
    summary: "This VitalCalc listing adds an annual percentage yield calculator for savings and deposit comparisons.",
    overview:
      "APY Calculator compares effective annual yield from nominal rate, compounding frequency, contribution assumptions, and balance. Toolars presents it as a local finance detail for savings and rate comparison workflows.",
    metric: { value: "APY", label: "Annual yield estimate" },
    category: "Finance",
    inputTitle: "Enter yield assumptions",
    inputDescription: "Capture nominal rate, compounding frequency, starting balance, and optional contribution cadence.",
    resultTitle: "Calculate effective yield",
    resultDescription: "Estimate APY, ending balance, interest earned, and compounding impact.",
    reviewTitle: "Review comparability",
    reviewDescription: "Flag fees, promotional rates, minimum balances, and contribution timing before comparing accounts.",
    handoffTitle: "Compare growth tools",
    handoffDescription: "Hand off the yield scenario to compound interest, Rule of 72, or ROI calculators.",
    localDescription: "Savings rates and balances can be calculated locally without transmitting account data.",
    cautionBadge: "Assumptions",
    cautionDescription: "APY estimates should clearly show rate, compounding, fee, and contribution assumptions.",
    sourceDescription: "Use the VitalCalc APY source page as the yield calculation reference.",
    contractDescription: "Return APY, interest earned, ending balance, compounding frequency, and assumptions.",
    relatedSlugs: ["compound-interest", "rule-of-72", "roi-calculator"],
    outcome: "Annual yield estimate",
    accent: "emerald"
  }),
  "rule-of-72": vitalCalcDetail({
    badge: "Doubling time",
    summary: "This VitalCalc listing adds a quick local Rule of 72 calculator for savings and investment growth intuition.",
    overview:
      "Rule of 72 Calculator estimates how long money takes to double at a given annual return rate. It gives Toolars a fast finance reference that pairs with APY, compound interest, and retirement planning pages.",
    metric: { value: "72", label: "Doubling-time estimate" },
    category: "Finance",
    inputTitle: "Enter annual return",
    inputDescription: "Capture expected annual return or target doubling time locally.",
    resultTitle: "Estimate doubling time",
    resultDescription: "Calculate years to double or the approximate return needed for a target timeline.",
    reviewTitle: "Review approximation",
    reviewDescription: "Explain that the Rule of 72 is a shortcut and becomes less precise at extreme rates.",
    handoffTitle: "Model exact growth",
    handoffDescription: "Hand off the estimate to APY, compound interest, or retirement calculators.",
    localDescription: "Return assumptions can be calculated in-browser without account or portfolio data.",
    cautionBadge: "Approx",
    cautionDescription: "Rule of 72 output is a rough estimate and should not be presented as investment advice.",
    sourceDescription: "Use the VitalCalc Rule of 72 source page as the quick growth reference.",
    contractDescription: "Return doubling years, required rate, approximation label, and assumptions.",
    relatedSlugs: ["apy-calculator", "compound-interest", "retirement-calculator"],
    outcome: "Doubling-time estimate",
    accent: "amber"
  }),
  "calorie-deficit": vitalCalcDetail({
    badge: "Energy target",
    summary: "This VitalCalc listing adds a local calorie deficit calculator for weight-change planning.",
    overview:
      "Calorie Deficit Calculator estimates daily calorie targets from TDEE, goal pace, and weight-change assumptions. Toolars positions it as a private nutrition planning reference with visible safety caveats.",
    metric: { value: "kcal", label: "Daily deficit target" },
    category: "Health",
    inputTitle: "Enter energy context",
    inputDescription: "Capture TDEE, current weight, goal pace, and optional activity context locally.",
    resultTitle: "Estimate target intake",
    resultDescription: "Calculate daily deficit, projected weekly change, and suggested calorie range.",
    reviewTitle: "Read safety caveats",
    reviewDescription: "Explain that aggressive deficits, medical conditions, and disordered eating risk require professional support.",
    handoffTitle: "Plan nutrition split",
    handoffDescription: "Hand off calorie targets to macro, protein, or TDEE calculators.",
    localDescription: "Energy and weight assumptions can be processed in-browser without uploading health data.",
    cautionBadge: "Reference",
    cautionDescription: "Calorie targets are informational and should not override medical or nutrition guidance.",
    sourceDescription: "Use the VitalCalc calorie deficit source page as the weight-change reference.",
    contractDescription: "Return target calories, deficit, projected change, safety notes, and assumptions.",
    relatedSlugs: ["tdee-calculator", "macro-calculator", "protein-calculator"],
    outcome: "Daily calorie target range",
    accent: "orange"
  }),
  "macro-calculator": vitalCalcDetail({
    badge: "Nutrition split",
    summary: "This VitalCalc listing adds a macro split calculator for protein, carbohydrate, and fat planning.",
    overview:
      "Macro Calculator converts calorie targets and goal preferences into protein, carbohydrate, and fat grams. Toolars keeps this as a local nutrition detail that naturally follows TDEE and calorie deficit estimates.",
    metric: { value: "Macros", label: "Macro split target" },
    category: "Health",
    inputTitle: "Enter nutrition goal",
    inputDescription: "Capture calories, body weight, activity goal, and preferred macro ratio locally.",
    resultTitle: "Calculate macro grams",
    resultDescription: "Estimate protein, carbohydrate, and fat targets in grams and calories.",
    reviewTitle: "Review diet caveats",
    reviewDescription: "Explain that macro targets vary by health status, training load, adherence, and clinician guidance.",
    handoffTitle: "Compare nutrition tools",
    handoffDescription: "Hand off the macro split to protein, calorie deficit, or lean body mass calculators.",
    localDescription: "Calories, goals, and weight assumptions can be processed locally without account storage.",
    cautionBadge: "Reference",
    cautionDescription: "Macro targets are planning references and should not replace medical nutrition advice.",
    sourceDescription: "Use the VitalCalc macro calculator source page as the nutrition split reference.",
    contractDescription: "Return protein grams, carbohydrate grams, fat grams, calorie split, and assumptions.",
    relatedSlugs: ["protein-calculator", "calorie-deficit", "lean-body-mass"],
    outcome: "Daily macro target split",
    accent: "lime"
  }),
  "lean-body-mass": vitalCalcDetail({
    badge: "Lean mass",
    summary: "This VitalCalc listing adds a local lean body mass reference for fitness and nutrition planning.",
    overview:
      "Lean Body Mass Calculator estimates non-fat body mass from body weight and body fat assumptions. Toolars frames it as a private fitness reference that can inform protein and macro planning.",
    metric: { value: "LBM", label: "Lean mass estimate" },
    category: "Health",
    inputTitle: "Enter body composition",
    inputDescription: "Capture body weight, body fat percentage, and optional sex context locally.",
    resultTitle: "Estimate lean mass",
    resultDescription: "Calculate lean body mass, fat mass, and a practical input summary.",
    reviewTitle: "Read estimate caveats",
    reviewDescription: "Explain that body fat measurement method, hydration, and training state can shift the estimate.",
    handoffTitle: "Continue nutrition planning",
    handoffDescription: "Hand off lean mass to protein, macro, or body fat calculators.",
    localDescription: "Body composition assumptions can be processed in-browser without account storage.",
    cautionBadge: "Reference",
    cautionDescription: "Lean body mass output is an estimate and should not replace clinical body composition assessment.",
    sourceDescription: "Use the VitalCalc lean body mass source page as the body composition reference.",
    contractDescription: "Return lean mass, fat mass, method assumptions, and caveats.",
    relatedSlugs: ["body-fat-calculator", "protein-calculator", "macro-calculator"],
    outcome: "Lean body mass estimate",
    accent: "teal"
  }),
  "emergency-fund": vitalCalcDetail({
    badge: "Safety net",
    summary: "This VitalCalc listing adds a local emergency fund target calculator for personal finance planning.",
    overview:
      "Emergency Fund Calculator estimates the savings target needed to cover essential monthly expenses for a chosen number of months. Toolars presents it as a private local finance reference for safety-net planning.",
    metric: { value: "Reserve", label: "Emergency fund target" },
    category: "Finance",
    inputTitle: "Enter expenses",
    inputDescription: "Capture monthly essential expenses, current emergency savings, and target coverage months locally.",
    resultTitle: "Estimate reserve target",
    resultDescription: "Calculate total fund target, savings gap, monthly savings needed, and progress percentage.",
    reviewTitle: "Review liquidity context",
    reviewDescription: "Flag job stability, family obligations, irregular income, and account liquidity before using the target.",
    handoffTitle: "Build the finance plan",
    handoffDescription: "Hand off the reserve target to savings goal, budget rule, or net worth calculators.",
    localDescription: "Emergency savings assumptions can be calculated in-browser without transmitting household expense data.",
    cautionBadge: "Planning",
    cautionDescription: "Emergency fund targets are planning references and should not replace individualized financial advice.",
    sourceDescription: "Use the VitalCalc emergency fund source page as the safety-net planning reference.",
    contractDescription: "Return fund target, savings gap, monthly savings needed, progress percentage, and assumptions.",
    relatedSlugs: ["savings-goal", "budget-rule", "net-worth-calculator"],
    outcome: "Emergency savings plan",
    accent: "amber"
  }),
  "savings-goal": vitalCalcDetail({
    badge: "Goal plan",
    summary: "This VitalCalc listing adds a local savings goal calculator for target-based personal finance planning.",
    overview:
      "Savings Goal Calculator estimates how long it takes to reach a target amount from current savings, monthly contributions, and return assumptions. Toolars frames it as a local planning detail for short- and medium-term goals.",
    metric: { value: "Goal", label: "Savings timeline" },
    category: "Finance",
    inputTitle: "Enter savings target",
    inputDescription: "Capture goal amount, current savings, monthly contribution, and optional annual return locally.",
    resultTitle: "Estimate time to goal",
    resultDescription: "Calculate months to target, total contributions, interest earned, and final amount.",
    reviewTitle: "Review feasibility",
    reviewDescription: "Flag whether the contribution rate, timeline, and return assumption are realistic for the goal.",
    handoffTitle: "Compare savings tools",
    handoffDescription: "Hand off the savings plan to emergency fund, APY, or compound interest calculators.",
    localDescription: "Goal targets and savings assumptions can be calculated locally without account data.",
    cautionBadge: "Assumptions",
    cautionDescription: "Savings timelines depend on contribution consistency, rates, fees, and market risk.",
    sourceDescription: "Use the VitalCalc savings goal source page as the target planning reference.",
    contractDescription: "Return months to target, contribution total, interest earned, final amount, and assumptions.",
    relatedSlugs: ["emergency-fund", "apy-calculator", "compound-interest"],
    outcome: "Savings goal timeline",
    accent: "fuchsia"
  }),
  "dti-calculator": vitalCalcDetail({
    badge: "Debt ratio",
    summary: "This VitalCalc listing adds a local debt-to-income ratio calculator for mortgage and debt planning.",
    overview:
      "DTI Calculator estimates front-end and back-end debt-to-income ratios from monthly income, housing costs, and other debt payments. Toolars uses it as a private finance detail for lender-readiness checks.",
    metric: { value: "DTI", label: "Debt-to-income ratio" },
    category: "Finance",
    inputTitle: "Enter income and debts",
    inputDescription: "Capture gross monthly income, housing payment, property costs, and other debt payments locally.",
    resultTitle: "Calculate DTI",
    resultDescription: "Estimate front-end DTI, back-end DTI, total payments, and disposable income.",
    reviewTitle: "Review lending context",
    reviewDescription: "Flag that lender thresholds, loan type, credit profile, and underwriting rules can change outcomes.",
    handoffTitle: "Compare debt impact",
    handoffDescription: "Hand off DTI to mortgage, debt payoff, or loan calculators.",
    localDescription: "Income and debt assumptions can be processed in-browser without uploading private financial data.",
    cautionBadge: "Lender rules",
    cautionDescription: "DTI outputs are estimates and should not be presented as mortgage approval decisions.",
    sourceDescription: "Use the VitalCalc DTI source page as the debt-ratio planning reference.",
    contractDescription: "Return front-end DTI, back-end DTI, payment total, disposable income, and assumptions.",
    relatedSlugs: ["mortgage-calculator", "debt-payoff", "loan-calculator"],
    outcome: "Debt-to-income ratio summary",
    accent: "cyan"
  }),
  "net-worth-calculator": vitalCalcDetail({
    badge: "Assets minus debts",
    summary: "This VitalCalc listing adds a local net worth calculator for personal balance-sheet planning.",
    overview:
      "Net Worth Calculator totals assets and liabilities to estimate the user's current financial position. Toolars keeps the calculation local so users can model cash, property, investments, and debt without sharing balances.",
    metric: { value: "Net", label: "Net worth snapshot" },
    category: "Finance",
    inputTitle: "Enter assets and debts",
    inputDescription: "Capture cash, investments, property, vehicles, loans, credit cards, and other balances locally.",
    resultTitle: "Calculate net worth",
    resultDescription: "Estimate total assets, total liabilities, net worth, and debt-to-asset ratio.",
    reviewTitle: "Review trend context",
    reviewDescription: "Flag that net worth is most useful when reviewed over time with consistent categories.",
    handoffTitle: "Plan next actions",
    handoffDescription: "Hand off the snapshot to debt payoff, retirement, or emergency fund calculators.",
    localDescription: "Asset and liability balances can be calculated locally without account linking.",
    cautionBadge: "Snapshot",
    cautionDescription: "Net worth is a point-in-time estimate and can change with market prices, appraisals, and debt updates.",
    sourceDescription: "Use the VitalCalc net worth source page as the balance-sheet planning reference.",
    contractDescription: "Return total assets, total liabilities, net worth, debt-to-asset ratio, and assumptions.",
    relatedSlugs: ["debt-payoff", "retirement-calculator", "emergency-fund"],
    outcome: "Net worth summary",
    accent: "sky"
  }),
  "budget-rule": vitalCalcDetail({
    badge: "Budget split",
    summary: "This VitalCalc listing adds a local 50/30/20 budget calculator for income allocation planning.",
    overview:
      "50/30/20 Budget Calculator splits monthly income into needs, wants, savings, and debt repayment targets. Toolars presents it as a local finance detail for fast budget planning before deeper workspaces are rebuilt.",
    metric: { value: "50/30/20", label: "Budget allocation" },
    category: "Finance",
    inputTitle: "Enter income",
    inputDescription: "Capture after-tax monthly income and optional needs, wants, and savings percentages locally.",
    resultTitle: "Generate budget split",
    resultDescription: "Calculate dollar allocations for needs, wants, savings, and debt repayment.",
    reviewTitle: "Review ratio fit",
    reviewDescription: "Flag that high rent, debt load, family needs, and regional costs can require adjusted ratios.",
    handoffTitle: "Continue planning",
    handoffDescription: "Hand off the budget split to income tax, savings goal, or emergency fund calculators.",
    localDescription: "Income allocation math can run in-browser without transmitting personal budget data.",
    cautionBadge: "Flexible",
    cautionDescription: "The budget rule is a guideline and should be adapted to income, debt, and cost-of-living context.",
    sourceDescription: "Use the VitalCalc budget rule source page as the income allocation reference.",
    contractDescription: "Return needs amount, wants amount, savings amount, ratio total, and assumptions.",
    relatedSlugs: ["income-tax", "savings-goal", "emergency-fund"],
    outcome: "Monthly budget allocation",
    accent: "green"
  }),
  "side-income-tax": vitalCalcDetail({
    badge: "Freelance tax",
    summary: "This VitalCalc listing adds a local side income tax calculator for freelance and gig income planning.",
    overview:
      "Side Income Tax Calculator estimates self-employment tax, federal income tax, state tax, and quarterly payment needs from W-2 salary, side income, expenses, and deductions. Toolars labels it clearly as planning math, not tax advice.",
    metric: { value: "Tax", label: "Quarterly tax estimate" },
    category: "Finance",
    inputTitle: "Enter income mix",
    inputDescription: "Capture W-2 salary, side income, business expenses, retirement contribution, filing status, and state rate locally.",
    resultTitle: "Estimate tax burden",
    resultDescription: "Calculate self-employment tax, federal tax, state tax, effective rate, and quarterly estimate.",
    reviewTitle: "Read tax caveats",
    reviewDescription: "Flag simplified US tax assumptions, deductions, withholding, safe harbor rules, and CPA review needs.",
    handoffTitle: "Plan after-tax cash",
    handoffDescription: "Hand off the tax estimate to income tax, budget rule, or net worth calculators.",
    localDescription: "Income and expense assumptions can be processed locally without uploading tax documents.",
    cautionBadge: "No advice",
    cautionDescription: "Side income tax output is an estimate and must not be presented as professional tax advice.",
    sourceDescription: "Use the VitalCalc side income tax source page as the freelance tax planning reference.",
    contractDescription: "Return self-employment tax, federal tax, state tax, quarterly payment, effective rate, and assumptions.",
    relatedSlugs: ["income-tax", "budget-rule", "net-worth-calculator"],
    outcome: "Side income tax planning summary",
    accent: "blue"
  }),
  "intermittent-fasting": vitalCalcDetail({
    badge: "Fasting schedule",
    summary: "This VitalCalc listing adds a local intermittent fasting window calculator for wellness and nutrition planning.",
    overview:
      "Intermittent Fasting Calculator calculates eating and fasting windows for common protocols such as 16:8, 18:6, 20:4, OMAD, and 5:2. Toolars presents it as a private schedule reference with clear health caveats.",
    metric: { value: "Window", label: "Fasting window schedule" },
    category: "Health",
    inputTitle: "Choose protocol",
    inputDescription: "Capture fasting protocol and last-meal or eating-window start time locally.",
    resultTitle: "Calculate windows",
    resultDescription: "Estimate next meal time, fasting hours, eating window, and fasting window.",
    reviewTitle: "Review suitability",
    reviewDescription: "Flag that pregnancy, adolescents, medication, diabetes, underweight status, or eating disorder history require professional guidance.",
    handoffTitle: "Pair with nutrition math",
    handoffDescription: "Hand off the schedule to calorie deficit, macro, or 30-30-30 planning pages.",
    localDescription: "Fasting schedule preferences can be calculated in-browser without storing health routines.",
    cautionBadge: "Reference",
    cautionDescription: "Fasting schedules are informational and should not override medical or nutrition guidance.",
    sourceDescription: "Use the VitalCalc intermittent fasting source page as the fasting window reference.",
    contractDescription: "Return eating window, fasting window, next meal time, protocol, and caveats.",
    relatedSlugs: ["calorie-deficit", "macro-calculator", "30-30-30-method"],
    outcome: "Fasting window plan",
    accent: "green"
  }),
  "creatine-calculator": vitalCalcDetail({
    badge: "Supplement dose",
    summary: "This VitalCalc listing adds a local creatine dose calculator for fitness supplement planning.",
    overview:
      "Creatine Calculator estimates loading and maintenance creatine monohydrate doses from body weight, training intensity, and diet context. Toolars keeps it local and frames the result as fitness reference math.",
    metric: { value: "Dose", label: "Creatine dose plan" },
    category: "Health",
    inputTitle: "Enter training context",
    inputDescription: "Capture body weight, unit, training intensity, diet pattern, and loading preference locally.",
    resultTitle: "Estimate dose range",
    resultDescription: "Calculate maintenance dose, optional loading dose, timing notes, and unit-specific summary.",
    reviewTitle: "Review supplement caveats",
    reviewDescription: "Flag kidney disease, medical conditions, hydration, supplement quality, and clinician review needs.",
    handoffTitle: "Compare nutrition tools",
    handoffDescription: "Hand off the dose context to protein, macro, or water intake calculators.",
    localDescription: "Body weight and training assumptions can be processed locally without account storage.",
    cautionBadge: "Reference",
    cautionDescription: "Supplement outputs are educational references and should not replace clinical advice.",
    sourceDescription: "Use the VitalCalc creatine calculator source page as the supplement dosing reference.",
    contractDescription: "Return maintenance dose, loading dose, timing notes, diet adjustment, and caveats.",
    relatedSlugs: ["protein-calculator", "macro-calculator", "water-intake"],
    outcome: "Creatine dose reference",
    accent: "amber"
  }),
  "vo2-max": vitalCalcDetail({
    badge: "Cardio fitness",
    summary: "This VitalCalc listing adds a local VO2 Max calculator for cardiovascular fitness references.",
    overview:
      "VO2 Max Calculator estimates maximum oxygen uptake from Cooper 12-minute run distance or resting heart rate assumptions. Toolars frames it as a local fitness benchmark with visible estimate limitations.",
    metric: { value: "VO2", label: "Oxygen uptake estimate" },
    category: "Health",
    inputTitle: "Enter test data",
    inputDescription: "Capture method, run distance, resting heart rate, age, and sex context locally.",
    resultTitle: "Estimate VO2 Max",
    resultDescription: "Calculate estimated ml/kg/min value, method label, and fitness reference band.",
    reviewTitle: "Review test quality",
    reviewDescription: "Flag that terrain, pacing, health status, device accuracy, and lab testing can shift the estimate.",
    handoffTitle: "Continue training planning",
    handoffDescription: "Hand off the fitness benchmark to heart rate zone, TDEE, or 30-30-30 planning pages.",
    localDescription: "Fitness test values can be processed in-browser without uploading health records.",
    cautionBadge: "Estimate",
    cautionDescription: "VO2 Max output is an estimate and should not be treated as a clinical cardiopulmonary test.",
    sourceDescription: "Use the VitalCalc VO2 Max source page as the cardio fitness reference.",
    contractDescription: "Return VO2 Max estimate, method, reference band, test assumptions, and caveats.",
    relatedSlugs: ["heart-rate-zone", "tdee-calculator", "30-30-30-method"],
    outcome: "VO2 Max fitness estimate",
    accent: "orange"
  }),
  "biological-age": vitalCalcDetail({
    badge: "Lifestyle reference",
    summary: "This VitalCalc listing adds a local biological age calculator for lifestyle reference planning.",
    overview:
      "Biological Age Calculator estimates a lifestyle-based age reference from BMI, blood pressure, exercise, sleep, smoking, alcohol, and stress inputs. Toolars labels it as a simplified reference, not medical testing.",
    metric: { value: "Age", label: "Biological age estimate" },
    category: "Health",
    inputTitle: "Enter lifestyle factors",
    inputDescription: "Capture chronological age, BMI, systolic blood pressure, exercise, sleep, smoking, alcohol, and stress locally.",
    resultTitle: "Estimate biological age",
    resultDescription: "Calculate an age estimate, delta from chronological age, and improvement tips.",
    reviewTitle: "Read reference caveats",
    reviewDescription: "Explain that simplified lifestyle models are not DNA methylation, clinical, or diagnostic tests.",
    handoffTitle: "Compare health references",
    handoffDescription: "Hand off the context to BMI, blood pressure, or sleep calculators.",
    localDescription: "Lifestyle inputs can be processed locally without uploading sensitive health records.",
    cautionBadge: "Reference",
    cautionDescription: "Biological age output is a simplified wellness reference and not a medical diagnosis.",
    sourceDescription: "Use the VitalCalc biological age source page as the lifestyle reference model.",
    contractDescription: "Return biological age, age delta, tips, input summary, and caveats.",
    relatedSlugs: ["bmi-calculator", "blood-pressure", "sleep-calculator"],
    outcome: "Biological age reference",
    accent: "cyan"
  }),
  "glycemic-load": vitalCalcDetail({
    badge: "Nutrition impact",
    summary: "This VitalCalc listing adds a local glycemic load calculator for nutrition reference planning.",
    overview:
      "Glycemic Load Calculator combines glycemic index, carbohydrate content, and serving size to estimate food-level glycemic load. Toolars presents it as private nutrition math with blood sugar caveats.",
    metric: { value: "GL", label: "Glycemic load value" },
    category: "Health",
    inputTitle: "Enter food data",
    inputDescription: "Capture food preset or custom glycemic index, carbohydrate grams, and serving size locally.",
    resultTitle: "Calculate GL",
    resultDescription: "Estimate glycemic load, carbohydrate total, impact category, and reference band.",
    reviewTitle: "Review nutrition context",
    reviewDescription: "Flag that diabetes, medication, meal composition, fiber, and individual response can change real outcomes.",
    handoffTitle: "Continue meal planning",
    handoffDescription: "Hand off the nutrition context to macro, calorie deficit, or protein calculators.",
    localDescription: "Food and serving inputs can be processed locally without storing meal logs.",
    cautionBadge: "Reference",
    cautionDescription: "Glycemic load output is educational and should not replace clinician or dietitian guidance.",
    sourceDescription: "Use the VitalCalc glycemic load source page as the nutrition impact reference.",
    contractDescription: "Return glycemic load, GI, carbohydrate total, category, and caveats.",
    relatedSlugs: ["macro-calculator", "calorie-deficit", "protein-calculator"],
    outcome: "Glycemic load reference",
    accent: "lime"
  }),
  "30-30-30-method": vitalCalcDetail({
    badge: "Morning routine",
    summary: "This VitalCalc listing adds a local 30-30-30 morning method calculator for fitness routine planning.",
    overview:
      "30-30-30 Morning Method estimates a 30 gram protein target plus 30-minute low-intensity exercise burn from body data and selected activity. Toolars frames it as a local routine reference with nutrition caveats.",
    metric: { value: "30", label: "Morning routine plan" },
    category: "Health",
    inputTitle: "Enter morning context",
    inputDescription: "Capture weight, age, sex context, and low-intensity exercise choice locally.",
    resultTitle: "Generate routine estimate",
    resultDescription: "Calculate protein target, 30-minute burn estimate, protein pairing ideas, and activity tip.",
    reviewTitle: "Review routine fit",
    reviewDescription: "Flag that evidence, caloric deficit, training status, dietary needs, and medical context affect suitability.",
    handoffTitle: "Connect nutrition tools",
    handoffDescription: "Hand off the routine target to protein, intermittent fasting, or calorie deficit calculators.",
    localDescription: "Morning routine assumptions can be processed locally without account storage.",
    cautionBadge: "Reference",
    cautionDescription: "30-30-30 output is a routine planning reference and not personalized nutrition advice.",
    sourceDescription: "Use the VitalCalc 30-30-30 method source page as the morning routine reference.",
    contractDescription: "Return protein target, estimated burn, activity choice, pairing ideas, and caveats.",
    relatedSlugs: ["protein-calculator", "intermittent-fasting", "calorie-deficit"],
    outcome: "Morning routine reference",
    accent: "teal"
  }),
  "tip-calculator": vitalCalcDetail({
    badge: "Tip split",
    summary: "This VitalCalc listing adds a local tip calculator for bills, tips, and group splits.",
    overview:
      "Tip Calculator calculates tip amount, total bill, and per-person share for restaurants, delivery, and group outings. Toolars presents it as fast local everyday finance math with no account or receipt upload.",
    metric: { value: "Split", label: "Per-person split" },
    category: "Finance",
    inputTitle: "Enter bill details",
    inputDescription: "Capture bill amount, tip percentage, and number of people locally.",
    resultTitle: "Calculate total and split",
    resultDescription: "Estimate tip amount, total with tip, original bill, and per-person share.",
    reviewTitle: "Review local customs",
    reviewDescription: "Flag that tipping norms vary by country, service type, tax basis, and group agreement.",
    handoffTitle: "Continue group planning",
    handoffDescription: "Hand off the bill scenario to bill split, hourly to salary, or budget tools.",
    localDescription: "Bill and group split values can be calculated in-browser without uploading receipt data.",
    cautionBadge: "Context",
    cautionDescription: "Tip outputs are convenience calculations and should follow local norms and group preference.",
    sourceDescription: "Use the VitalCalc tip calculator source page as the bill and tip split reference.",
    contractDescription: "Return bill amount, tip amount, total, per-person split, and assumptions.",
    relatedSlugs: ["bill-split-calculator", "hourly-to-salary", "budget-rule"],
    outcome: "Tip and split summary",
    accent: "orange"
  }),
  "bill-split-calculator": vitalCalcDetail({
    badge: "Group split",
    summary: "This VitalCalc listing adds a local bill split calculator for shared spending scenarios.",
    overview:
      "Bill Split Calculator supports equal and itemized group splitting, including tips and taxes. Toolars frames it as a local everyday finance reference for dining, travel, rent, and shared costs.",
    metric: { value: "Group", label: "Bill split breakdown" },
    category: "Finance",
    inputTitle: "Enter bill info",
    inputDescription: "Capture subtotal, people, tip, tax, split mode, and optional item assignments locally.",
    resultTitle: "Calculate shares",
    resultDescription: "Estimate subtotal, fees, grand total, per-person amount, and detailed breakdown.",
    reviewTitle: "Review fairness mode",
    reviewDescription: "Flag whether equal split or itemized split fits the group spending pattern.",
    handoffTitle: "Compare related costs",
    handoffDescription: "Hand off the group bill to tip, budget rule, or habit cost pages.",
    localDescription: "Group bill data can be processed locally without saving names or receipts.",
    cautionBadge: "Agreement",
    cautionDescription: "Bill split outputs are convenience calculations and should be confirmed with the group.",
    sourceDescription: "Use the VitalCalc bill split source page as the shared-cost reference.",
    contractDescription: "Return per-person totals, fees, split mode, itemized breakdown, and assumptions.",
    relatedSlugs: ["tip-calculator", "budget-rule", "habit-cost"],
    outcome: "Group bill breakdown",
    accent: "teal"
  }),
  "unit-converter": vitalCalcDetail({
    badge: "Unit utility",
    summary: "This VitalCalc listing adds a local unit converter for everyday measurement and data conversions.",
    overview:
      "Unit Converter supports length, weight, temperature, area, volume, speed, and data storage conversions. Toolars presents it as a fast local utility detail that does not require downloads or server calls.",
    metric: { value: "7", label: "Universal conversion" },
    category: "Data",
    inputTitle: "Select conversion type",
    inputDescription: "Choose length, weight, temperature, area, volume, speed, or data storage units locally.",
    resultTitle: "Convert values",
    resultDescription: "Calculate converted value, target unit, reverse conversion, and formula context.",
    reviewTitle: "Review precision needs",
    reviewDescription: "Flag that daily-use conversions differ from scientific metrology or regulated measurement needs.",
    handoffTitle: "Use adjacent calculators",
    handoffDescription: "Hand off converted values to BMI, glycemic load, or hourly wage calculations when useful.",
    localDescription: "Unit values can be converted in-browser without sending measurement data to a server.",
    cautionBadge: "Precision",
    cautionDescription: "Conversion results are daily-use references and should not replace certified calibration.",
    sourceDescription: "Use the VitalCalc unit converter source page as the universal conversion reference.",
    contractDescription: "Return input value, source unit, target unit, converted value, category, and formula note.",
    relatedSlugs: ["bmi-calculator", "glycemic-load", "hourly-to-salary"],
    outcome: "Converted measurement value",
    accent: "sky"
  }),
  "hourly-to-salary": vitalCalcDetail({
    badge: "Pay conversion",
    summary: "This VitalCalc listing adds a local hourly wage to salary converter for work and income planning.",
    overview:
      "Hourly to Salary Calculator converts hourly wage into annual, monthly, and weekly gross pay with overtime assumptions. Toolars presents it as local pay math for comparing offers and work schedules.",
    metric: { value: "Pay", label: "Annual salary estimate" },
    category: "Finance",
    inputTitle: "Enter wage assumptions",
    inputDescription: "Capture hourly rate, hours per week, weeks per year, overtime hours, and overtime multiplier locally.",
    resultTitle: "Estimate salary",
    resultDescription: "Calculate annual, monthly, weekly, and overtime pay estimates.",
    reviewTitle: "Review gross-pay context",
    reviewDescription: "Flag that taxes, benefits, unpaid time off, bonuses, and local labor rules affect take-home pay.",
    handoffTitle: "Continue income planning",
    handoffDescription: "Hand off the pay estimate to income tax, budget rule, or tip calculator pages.",
    localDescription: "Pay assumptions can be calculated locally without storing employer or income data.",
    cautionBadge: "Gross",
    cautionDescription: "Salary estimates are gross-pay references and should not be treated as take-home pay.",
    sourceDescription: "Use the VitalCalc hourly to salary source page as the wage conversion reference.",
    contractDescription: "Return annual salary, monthly salary, weekly salary, overtime pay, and assumptions.",
    relatedSlugs: ["income-tax", "budget-rule", "tip-calculator"],
    outcome: "Hourly wage salary summary",
    accent: "blue"
  }),
  "inflation-calculator": vitalCalcDetail({
    badge: "Purchasing power",
    summary: "This VitalCalc listing adds a local inflation calculator for purchasing-power planning.",
    overview:
      "Inflation Calculator estimates future purchasing power, cumulative inflation, purchasing power loss, and break-even return from current amount, inflation rate, and years. Toolars frames it as private long-term planning math.",
    metric: { value: "CPI", label: "Purchasing power estimate" },
    category: "Finance",
    inputTitle: "Enter inflation assumptions",
    inputDescription: "Capture current amount, expected annual inflation rate, and years locally.",
    resultTitle: "Estimate future value",
    resultDescription: "Calculate future purchasing power, cumulative inflation, power loss, and break-even return.",
    reviewTitle: "Review assumption risk",
    reviewDescription: "Flag that inflation rates vary by country, category, period, and personal spending basket.",
    handoffTitle: "Compare growth plans",
    handoffDescription: "Hand off the inflation scenario to compound interest, retirement, or savings goal calculators.",
    localDescription: "Inflation assumptions can be calculated in-browser without storing portfolio or savings data.",
    cautionBadge: "Assumption",
    cautionDescription: "Inflation outputs are scenario estimates and should not be presented as forecasts.",
    sourceDescription: "Use the VitalCalc inflation source page as the purchasing-power reference.",
    contractDescription: "Return future purchasing power, cumulative inflation, loss, break-even return, and assumptions.",
    relatedSlugs: ["compound-interest", "retirement-calculator", "savings-goal"],
    outcome: "Purchasing-power scenario",
    accent: "cyan"
  }),
  "habit-cost": vitalCalcDetail({
    badge: "Opportunity cost",
    summary: "This VitalCalc listing adds a local habit cost calculator for repeated spending and opportunity-cost planning.",
    overview:
      "Habit Cost Calculator estimates total spending and potential investment value for repeated daily or weekly habits. Toolars presents it as local behavior-cost math for personal finance reflection.",
    metric: { value: "Cost", label: "Habit opportunity cost" },
    category: "Finance",
    inputTitle: "Enter habit cost",
    inputDescription: "Capture cost per occurrence, frequency per week, years, and annual return assumption locally.",
    resultTitle: "Estimate opportunity cost",
    resultDescription: "Calculate total spent, investment gains, future value, and opportunity cost.",
    reviewTitle: "Review behavior context",
    reviewDescription: "Flag that habits can have social, health, or quality-of-life value beyond pure financial math.",
    handoffTitle: "Plan savings alternative",
    handoffDescription: "Hand off the habit amount to compound interest, savings goal, or budget rule calculators.",
    localDescription: "Habit spending assumptions can be processed locally without storing personal behavior data.",
    cautionBadge: "Reflection",
    cautionDescription: "Habit cost output is a planning reference, not a judgment or financial recommendation.",
    sourceDescription: "Use the VitalCalc habit cost source page as the opportunity-cost reference.",
    contractDescription: "Return total spent, future value, investment gain, opportunity cost, and assumptions.",
    relatedSlugs: ["compound-interest", "savings-goal", "budget-rule"],
    outcome: "Habit cost scenario",
    accent: "rose"
  }),
  "caffeine-calculator": vitalCalcDetail({
    badge: "Caffeine limit",
    summary: "This VitalCalc listing adds a local caffeine safe limit calculator for drink intake and sleep-aware planning.",
    overview:
      "Caffeine Safe Limit Calculator estimates a daily allowance from weight, pregnancy status, and selected common drinks. Toolars presents it as private lifestyle math with clear sensitivity and sleep caveats.",
    metric: { value: "400mg", label: "Daily caffeine allowance" },
    category: "Health",
    inputTitle: "Enter caffeine context",
    inputDescription: "Capture weight, pregnancy status, and selected drinks such as coffee, tea, energy drinks, or cola locally.",
    resultTitle: "Calculate allowance",
    resultDescription: "Estimate safe daily limit, consumed caffeine, remaining allowance, and common drink references.",
    reviewTitle: "Review sensitivity",
    reviewDescription: "Flag that age, pregnancy, medication, sleep timing, and individual metabolism change caffeine tolerance.",
    handoffTitle: "Connect sleep and hydration",
    handoffDescription: "Hand off caffeine timing to sleep, water intake, or drink calorie calculators.",
    localDescription: "Caffeine intake and drink selections can be calculated in-browser without saving personal consumption logs.",
    cautionBadge: "Sensitivity",
    cautionDescription: "Caffeine limits are general references and should be adjusted for pregnancy, teen use, medical context, and clinician advice.",
    sourceDescription: "Use the VitalCalc caffeine calculator source page as the caffeine allowance and drink-content reference.",
    contractDescription: "Return daily limit, consumed caffeine, remaining allowance, drink list, and sensitivity caveats.",
    relatedSlugs: ["sleep-calculator", "water-intake", "drink-calories"],
    outcome: "Caffeine allowance summary",
    accent: "amber"
  }),
  "alcohol-metabolism": vitalCalcDetail({
    badge: "BAC reference",
    summary: "This VitalCalc listing adds a local alcohol metabolism calculator for educational BAC and time estimates.",
    overview:
      "Alcohol Metabolism Calculator estimates blood alcohol concentration and metabolism time from drink type, quantity, weight, sex context, drinking duration, and stomach context. Toolars frames it as educational reference only.",
    metric: { value: "BAC", label: "Metabolism time estimate" },
    category: "Health",
    inputTitle: "Enter drinking context",
    inputDescription: "Capture drink type, quantity, duration, weight, sex context, and stomach context locally.",
    resultTitle: "Estimate BAC timeline",
    resultDescription: "Calculate estimated BAC, pure alcohol, time to lower BAC thresholds, and an hour-by-hour timeline.",
    reviewTitle: "Read safety limits",
    reviewDescription: "Flag that metabolism varies and the output must not be used to decide whether it is safe or legal to drive.",
    handoffTitle: "Review related intake",
    handoffDescription: "Hand off beverage context to drink calories, BMR, or steps-to-calories pages.",
    localDescription: "Drink and body-context inputs can be processed locally without saving sensitive lifestyle data.",
    cautionBadge: "Safety",
    cautionDescription: "BAC output is an estimate only; legal limits vary, impairment varies, and the safest choice is not to drive after drinking.",
    sourceDescription: "Use the VitalCalc alcohol metabolism source page as the Widmark-style BAC reference.",
    contractDescription: "Return BAC estimate, pure alcohol, metabolism times, timeline, and safety disclaimer.",
    relatedSlugs: ["drink-calories", "bmr-calculator", "steps-to-calories"],
    outcome: "Alcohol metabolism reference",
    accent: "orange"
  }),
  "blood-sugar-calculator": vitalCalcDetail({
    badge: "A1C converter",
    summary: "This VitalCalc listing adds a local blood sugar and A1C converter with diabetes-risk reference bands.",
    overview:
      "Blood Sugar / A1C Calculator converts fasting glucose, A1C, and estimated average glucose, then maps values to WHO/ADA reference bands. Toolars presents it as local health reference math, not diagnosis.",
    metric: { value: "A1C", label: "Glucose conversion" },
    category: "Health",
    inputTitle: "Enter lab value",
    inputDescription: "Capture fasting glucose, A1C, or estimated average glucose with unit selection locally.",
    resultTitle: "Convert indicators",
    resultDescription: "Calculate equivalent glucose or A1C values and display normal, prediabetes, or diabetes reference bands.",
    reviewTitle: "Review medical context",
    reviewDescription: "Flag that diabetes assessment requires repeat testing, symptoms, lab quality, and clinician judgment.",
    handoffTitle: "Compare nutrition context",
    handoffDescription: "Hand off blood sugar context to glycemic load, BMI, or calorie deficit calculators.",
    localDescription: "Blood sugar values can be converted in-browser without storing personal health records.",
    cautionBadge: "Medical",
    cautionDescription: "Blood sugar output is informational and cannot replace professional diagnosis or treatment guidance.",
    sourceDescription: "Use the VitalCalc blood sugar source page as the A1C and glucose conversion reference.",
    contractDescription: "Return FPG, A1C, estimated average glucose, risk band, unit context, and medical caveats.",
    relatedSlugs: ["glycemic-load", "bmi-calculator", "calorie-deficit"],
    outcome: "Blood sugar reference summary",
    accent: "rose"
  }),
  "drink-calories": vitalCalcDetail({
    badge: "Drink nutrition",
    summary: "This VitalCalc listing adds a local drink calories calculator for beverage calories and sugar tracking.",
    overview:
      "Drink Calories Calculator estimates calories and sugar in boba tea, coffee, juice, alcohol, soda, and custom drinks. Toolars presents it as local nutrition reference for liquid calorie awareness.",
    metric: { value: "kcal", label: "Liquid calorie total" },
    category: "Health",
    inputTitle: "Choose drink details",
    inputDescription: "Capture drink type, serving size, custom calories, and cups consumed locally.",
    resultTitle: "Calculate beverage impact",
    resultDescription: "Estimate total calories, sugar grams, steps to burn, daily percentage, and source notes.",
    reviewTitle: "Review nutrition context",
    reviewDescription: "Flag that brand recipes, serving sizes, added sugar, alcohol content, and nutrition labels vary.",
    handoffTitle: "Balance calorie context",
    handoffDescription: "Hand off beverage totals to calorie deficit, steps-to-calories, or caffeine pages.",
    localDescription: "Drink selections and serving assumptions can be calculated locally without saving consumption logs.",
    cautionBadge: "Labels",
    cautionDescription: "Drink calorie outputs are estimates; use vendor nutrition data for exact commercial products.",
    sourceDescription: "Use the VitalCalc drink calories source page as the beverage calorie and sugar reference.",
    contractDescription: "Return calories, sugar, serving assumptions, daily percentage, burn estimate, and caveats.",
    relatedSlugs: ["calorie-deficit", "steps-to-calories", "caffeine-calculator"],
    outcome: "Drink calorie summary",
    accent: "pink"
  }),
  "fiber-intake": vitalCalcDetail({
    badge: "Fiber target",
    summary: "This VitalCalc listing adds a local fiber intake calculator for daily nutrition gap planning.",
    overview:
      "Fiber Intake Calculator estimates daily fiber needs from weight, age, and sex context, then compares current intake with common high-fiber food sources. Toolars frames it as local nutrition reference planning.",
    metric: { value: "25-38g", label: "Fiber intake target" },
    category: "Health",
    inputTitle: "Enter nutrition profile",
    inputDescription: "Capture weight, age, sex context, and optional current fiber intake locally.",
    resultTitle: "Calculate fiber range",
    resultDescription: "Estimate recommended fiber grams, daily range, intake gap, and high-fiber food examples.",
    reviewTitle: "Review tolerance",
    reviewDescription: "Flag that fiber should be increased gradually and paired with adequate hydration.",
    handoffTitle: "Connect meal planning",
    handoffDescription: "Hand off nutrition context to macro, calorie deficit, or glycemic load calculators.",
    localDescription: "Fiber targets and intake gaps can be processed locally without storing meal logs.",
    cautionBadge: "Tolerance",
    cautionDescription: "Fiber recommendations are general references; excessive or sudden intake can cause digestive discomfort.",
    sourceDescription: "Use the VitalCalc fiber intake source page as the fiber target and food-source reference.",
    contractDescription: "Return fiber target, recommended range, current gap, food examples, and tolerance caveats.",
    relatedSlugs: ["macro-calculator", "calorie-deficit", "glycemic-load"],
    outcome: "Fiber intake target",
    accent: "green"
  }),
  "steps-to-calories": vitalCalcDetail({
    badge: "Walking burn",
    summary: "This VitalCalc listing adds a local steps to calories calculator for walking burn and food equivalents.",
    overview:
      "Steps to Calories Calculator estimates calories burned from step count, weight, height-derived stride, and walking speed. Toolars presents it as local activity math with terrain and individual variation caveats.",
    metric: { value: "Steps", label: "Walking calorie burn" },
    category: "Health",
    inputTitle: "Enter walking data",
    inputDescription: "Capture steps, weight, height, and walking speed locally.",
    resultTitle: "Estimate burn",
    resultDescription: "Calculate calories burned, distance walked, food equivalents, and steps per food item.",
    reviewTitle: "Review activity context",
    reviewDescription: "Flag that terrain, fitness, stride, wearable accuracy, and speed affect actual calorie burn.",
    handoffTitle: "Compare energy balance",
    handoffDescription: "Hand off walking burn to TDEE, calorie deficit, or drink calorie calculators.",
    localDescription: "Step and body-context values can be calculated locally without uploading wearable data.",
    cautionBadge: "Estimate",
    cautionDescription: "Step burn outputs are approximations and should not be treated as precise metabolic measurement.",
    sourceDescription: "Use the VitalCalc steps to calories source page as the walking burn reference.",
    contractDescription: "Return calories burned, distance, equivalents, stride assumptions, and activity caveats.",
    relatedSlugs: ["tdee-calculator", "calorie-deficit", "drink-calories"],
    outcome: "Walking calorie burn summary",
    accent: "cyan"
  }),
  "currency-converter": vitalCalcDetail({
    badge: "Currency utility",
    summary: "This VitalCalc listing adds a local currency converter for manually entered exchange-rate comparisons.",
    overview:
      "Currency Converter converts amounts between major world currencies using an exchange rate supplied by the user. Toolars presents it as local finance utility math with explicit rate freshness caveats.",
    metric: { value: "FX", label: "Manual exchange-rate conversion" },
    category: "Finance",
    inputTitle: "Enter exchange context",
    inputDescription: "Capture amount, source currency, target currency, and exchange rate locally.",
    resultTitle: "Convert amount",
    resultDescription: "Calculate converted amount, target symbol, and rate display for comparison.",
    reviewTitle: "Review rate freshness",
    reviewDescription: "Flag that bank, card, platform, spread, tax, and timing can change real exchange costs.",
    handoffTitle: "Compare finance utilities",
    handoffDescription: "Hand off converted amounts to percentage, DTI, or hourly-to-salary calculators.",
    localDescription: "Amounts and exchange rates can be converted in-browser without sending transaction data to a server.",
    cautionBadge: "Rates",
    cautionDescription: "Exchange-rate outputs use user-entered or reference rates and are not real-time market quotes.",
    sourceDescription: "Use the VitalCalc currency converter source page as the manual exchange-rate reference.",
    contractDescription: "Return source amount, currency pair, exchange rate, converted amount, and rate caveats.",
    relatedSlugs: ["percentage-calculator", "dti-calculator", "hourly-to-salary"],
    outcome: "Currency conversion summary",
    accent: "lime"
  }),
  "percentage-calculator": vitalCalcDetail({
    badge: "Percent math",
    summary: "This VitalCalc listing adds a local percentage calculator for business, finance, and data comparisons.",
    overview:
      "Percentage Calculator handles percent-of, ratio percentage, and percentage increase or decrease calculations. Toolars presents it as fast local arithmetic for everyday analysis and finance utilities.",
    metric: { value: "%", label: "Percentage math result" },
    category: "Data",
    inputTitle: "Choose percentage mode",
    inputDescription: "Capture percent-of, ratio, or change values locally.",
    resultTitle: "Calculate percentage",
    resultDescription: "Return percentage result, direction of change, and calculation context.",
    reviewTitle: "Review denominator",
    reviewDescription: "Flag zero denominators, missing units, and whether the output is a percentage point or percent change.",
    handoffTitle: "Use finance context",
    handoffDescription: "Hand off percentage results to discount, tip, or currency conversion tools.",
    localDescription: "Percentage inputs can be calculated locally without storing business or finance data.",
    cautionBadge: "Context",
    cautionDescription: "Percentage outputs depend on the selected denominator and should be labeled before reuse.",
    sourceDescription: "Use the VitalCalc percentage calculator source page as the percentage math reference.",
    contractDescription: "Return calculation mode, inputs, percentage result, direction, and denominator notes.",
    relatedSlugs: ["discount-calculator", "tip-calculator", "currency-converter"],
    outcome: "Percentage calculation summary",
    accent: "rose"
  }),
  "stock-average": vitalCalcDetail({
    badge: "Cost basis",
    summary: "This VitalCalc listing adds a local stock average calculator for purchase batches and breakeven planning.",
    overview:
      "Stock Average Calculator combines multiple share purchases to estimate average cost per share, total shares, total cost, and breakeven price. Toolars frames it as local portfolio math, not trading advice.",
    metric: { value: "Avg", label: "Cost basis average" },
    category: "Finance",
    inputTitle: "Enter purchase records",
    inputDescription: "Capture shares and price per share for each purchase locally.",
    resultTitle: "Calculate average cost",
    resultDescription: "Estimate total shares, total cost, average cost per share, and breakeven price.",
    reviewTitle: "Review trading context",
    reviewDescription: "Flag fees, taxes, currency, corporate actions, and unfilled orders that can affect real cost basis.",
    handoffTitle: "Compare investment math",
    handoffDescription: "Hand off cost basis to ROI, compound interest, or investment goal tools.",
    localDescription: "Purchase records can be calculated locally without uploading brokerage or portfolio data.",
    cautionBadge: "No advice",
    cautionDescription: "Stock average output is arithmetic reference only and should not be treated as a buy or sell recommendation.",
    sourceDescription: "Use the VitalCalc stock average source page as the cost-basis reference.",
    contractDescription: "Return total shares, total cost, average price, breakeven, and cost-basis caveats.",
    relatedSlugs: ["roi-calculator", "compound-interest", "investment-goal"],
    outcome: "Stock average cost basis",
    accent: "amber"
  }),
  "credit-card-apr": vitalCalcDetail({
    badge: "True APR",
    summary: "This VitalCalc listing adds a local credit card installment APR calculator for true financing-cost review.",
    overview:
      "Credit Card APR Calculator estimates the true annual percentage rate behind monthly installment fees because principal declines while fees can be based on the original amount. Toolars presents it as local debt-cost math.",
    metric: { value: "APR", label: "True installment APR" },
    category: "Finance",
    inputTitle: "Enter installment details",
    inputDescription: "Capture installment amount, number of payments, and monthly fee rate locally.",
    resultTitle: "Reveal true APR",
    resultDescription: "Estimate annualized APR, nominal total rate, total fees, and total payment.",
    reviewTitle: "Review credit cost",
    reviewDescription: "Flag issuer terms, compounding conventions, missed-payment fees, and alternative financing costs.",
    handoffTitle: "Plan debt options",
    handoffDescription: "Hand off APR context to debt payoff, loan, or DTI calculators.",
    localDescription: "Installment inputs can be processed locally without saving card or purchase data.",
    cautionBadge: "Terms",
    cautionDescription: "APR output is an estimate and must be checked against issuer disclosures and local lending rules.",
    sourceDescription: "Use the VitalCalc credit card APR source page as the installment fee reference.",
    contractDescription: "Return APR, nominal rate, total fees, total payment, and financing caveats.",
    relatedSlugs: ["debt-payoff", "loan-calculator", "dti-calculator"],
    outcome: "Credit installment APR review",
    accent: "pink"
  }),
  "investment-fee": vitalCalcDetail({
    badge: "Fee impact",
    summary: "This VitalCalc listing adds a local investment fee calculator for long-term fund-cost comparisons.",
    overview:
      "Investment Fee Calculator estimates how annual management fees reduce long-term returns from principal, monthly contributions, expected return, and time horizon. Toolars presents it as local fee-drag scenario math.",
    metric: { value: "Fees", label: "Investment fee drag" },
    category: "Finance",
    inputTitle: "Enter investment assumptions",
    inputDescription: "Capture initial investment, monthly contribution, expected return, years, and annual fee locally.",
    resultTitle: "Calculate fee impact",
    resultDescription: "Compare ending value with and without fees, total invested, fee drag, and real annual return.",
    reviewTitle: "Review assumption risk",
    reviewDescription: "Flag that market returns, fund expenses, taxes, trading costs, and inflation can change outcomes.",
    handoffTitle: "Compare growth plans",
    handoffDescription: "Hand off fee scenarios to compound interest, APY, or investment goal calculators.",
    localDescription: "Investment assumptions can be calculated locally without uploading account or portfolio data.",
    cautionBadge: "Scenario",
    cautionDescription: "Investment fee output is a scenario estimate and not a forecast or investment recommendation.",
    sourceDescription: "Use the VitalCalc investment fee source page as the fee-drag reference.",
    contractDescription: "Return ending values, fee drag, total invested, fee rate, and assumption caveats.",
    relatedSlugs: ["compound-interest", "apy-calculator", "investment-goal"],
    outcome: "Investment fee impact",
    accent: "fuchsia"
  }),
  "investment-goal": vitalCalcDetail({
    badge: "Goal plan",
    summary: "This VitalCalc listing adds a local investment goal calculator for monthly contribution planning.",
    overview:
      "Investment Goal Calculator estimates the monthly investment needed to reach a target amount from starting balance, expected return, and years. Toolars presents it as local goal-planning math with market assumption caveats.",
    metric: { value: "Target", label: "Monthly investment target" },
    category: "Finance",
    inputTitle: "Enter goal assumptions",
    inputDescription: "Capture target amount, starting balance, annual return, and years to goal locally.",
    resultTitle: "Calculate monthly plan",
    resultDescription: "Estimate required monthly investment, total invested, and a year-by-year balance table.",
    reviewTitle: "Review return assumptions",
    reviewDescription: "Flag that returns are volatile and contribution, taxes, fees, and inflation can shift the plan.",
    handoffTitle: "Compare return tools",
    handoffDescription: "Hand off goal assumptions to compound interest, APY, or investment fee calculators.",
    localDescription: "Goal and return assumptions can be calculated locally without storing account balances.",
    cautionBadge: "Forecast",
    cautionDescription: "Investment goal output is planning math and not a guarantee of future market results.",
    sourceDescription: "Use the VitalCalc investment goal source page as the monthly investment planning reference.",
    contractDescription: "Return monthly contribution, goal, starting balance, total invested, year table, and caveats.",
    relatedSlugs: ["compound-interest", "apy-calculator", "investment-fee"],
    outcome: "Investment goal plan",
    accent: "violet"
  }),
  "credit-score-simulator": vitalCalcDetail({
    badge: "Credit scenario",
    summary: "This VitalCalc listing adds a local credit score simulator for utilization, payment, and new-credit scenarios.",
    overview:
      "Credit Score Simulator estimates how actions such as paying down balances, opening credit, missing payments, or changing limits could affect a credit score. Toolars presents it as local education math, not a bureau score.",
    metric: { value: "300-850", label: "Credit score scenario impact" },
    category: "Finance",
    inputTitle: "Enter credit profile",
    inputDescription: "Capture current score, credit limit, balance, and selected credit action locally.",
    resultTitle: "Simulate score impact",
    resultDescription: "Estimate score change, utilization shift, and score rating for the selected scenario.",
    reviewTitle: "Review bureau limits",
    reviewDescription: "Flag that real scores depend on bureau data, scoring model version, payment history, and lender reporting cadence.",
    handoffTitle: "Plan debt context",
    handoffDescription: "Hand off credit context to debt payoff, DTI, or net worth calculators.",
    localDescription: "Credit score assumptions can be calculated locally without uploading credit report or account data.",
    cautionBadge: "Estimate",
    cautionDescription: "Credit score outputs are educational estimates and are not official bureau scores or lending decisions.",
    sourceDescription: "Use the VitalCalc credit score simulator source page as the utilization and action-impact reference.",
    contractDescription: "Return current score, simulated score, utilization, action label, rating, and bureau caveats.",
    relatedSlugs: ["debt-payoff", "dti-calculator", "net-worth-calculator"],
    outcome: "Credit score scenario review",
    accent: "blue"
  }),
  "crypto-tax": vitalCalcDetail({
    badge: "Crypto PnL",
    summary: "This VitalCalc listing adds a local crypto tax calculator for cost basis and realized PnL review.",
    overview:
      "Crypto Tax Calculator estimates average cost basis, realized gains or losses, and unrealized PnL from buy and sell records. Toolars frames it as local portfolio and tax-prep reference math with explicit tax caveats.",
    metric: { value: "PnL", label: "Crypto cost-basis estimate" },
    category: "Finance",
    inputTitle: "Enter crypto transactions",
    inputDescription: "Capture buy prices, buy quantities, sell prices, sell quantities, and current price locally.",
    resultTitle: "Calculate gains",
    resultDescription: "Estimate average cost basis, realized PnL, unrealized PnL, and remaining quantity.",
    reviewTitle: "Review tax method",
    reviewDescription: "Flag holding period, lot selection, jurisdiction, fees, transfers, and exchange records before filing.",
    handoffTitle: "Compare portfolio math",
    handoffDescription: "Hand off cost-basis context to stock average, ROI, or investment goal calculators.",
    localDescription: "Transaction values can be calculated locally without uploading wallet, exchange, or tax records.",
    cautionBadge: "Tax",
    cautionDescription: "Crypto outputs are calculation references only and are not tax, accounting, or legal advice.",
    sourceDescription: "Use the VitalCalc crypto tax source page as the cost-basis and PnL reference.",
    contractDescription: "Return cost basis, realized PnL, unrealized PnL, remaining quantity, method notes, and tax caveats.",
    relatedSlugs: ["stock-average", "roi-calculator", "investment-goal"],
    outcome: "Crypto cost-basis and PnL summary",
    accent: "sky"
  }),
  "freelance-rate": vitalCalcDetail({
    badge: "Rate floor",
    summary: "This VitalCalc listing adds a local freelance rate calculator for billable-hour pricing and cost recovery.",
    overview:
      "Freelance Rate Calculator estimates hourly, daily, project, and suggested premium rates from target annual income, paid time off, non-billable work, taxes, insurance, operating costs, and location factor.",
    metric: { value: "Rate", label: "Freelance pricing floor" },
    category: "Finance",
    inputTitle: "Enter business assumptions",
    inputDescription: "Capture income goal, paid vacation, weekly hours, non-billable ratio, taxes, insurance, costs, and location factor.",
    resultTitle: "Calculate rate floor",
    resultDescription: "Estimate hourly, daily, project, and premium rates plus total revenue target.",
    reviewTitle: "Review pricing context",
    reviewDescription: "Flag market rates, scope risk, utilization, taxes, platform fees, and client acquisition costs.",
    handoffTitle: "Compare income tools",
    handoffDescription: "Hand off rate context to hourly-to-salary, side-income tax, or income tax calculators.",
    localDescription: "Freelance income and cost assumptions can be calculated locally without uploading client or payroll data.",
    cautionBadge: "Pricing",
    cautionDescription: "Freelance rate output is a pricing reference and should be adjusted for market, contract, and tax context.",
    sourceDescription: "Use the VitalCalc freelance rate source page as the billable-hour pricing reference.",
    contractDescription: "Return hourly rate, daily rate, project rate, premium rate, billable hours, cost breakdown, and caveats.",
    relatedSlugs: ["hourly-to-salary", "side-income-tax", "income-tax"],
    outcome: "Freelance rate floor",
    accent: "emerald"
  }),
  "subscription-audit": vitalCalcDetail({
    badge: "Subscription spend",
    summary: "This VitalCalc listing adds a local subscription audit calculator for recurring-spend cleanup.",
    overview:
      "Subscription Audit Calculator normalizes weekly, monthly, quarterly, and annual subscriptions into monthly and yearly totals, category breakdowns, and savings prompts. Toolars presents it as private budget housekeeping.",
    metric: { value: "Monthly", label: "Recurring subscription spend" },
    category: "Finance",
    inputTitle: "Add subscriptions",
    inputDescription: "Capture subscription name, cost, billing frequency, and category locally.",
    resultTitle: "Normalize spend",
    resultDescription: "Calculate monthly total, yearly total, count, average monthly cost, and category bars.",
    reviewTitle: "Review waste signals",
    reviewDescription: "Flag duplicate categories, unused annual renewals, trial conversions, and high recurring spend.",
    handoffTitle: "Build savings plan",
    handoffDescription: "Hand off recurring spend to savings challenge, budget rule, or habit cost calculators.",
    localDescription: "Subscription lists can be calculated locally without uploading vendor names or household budget data.",
    cautionBadge: "Renewals",
    cautionDescription: "Subscription audit output depends on user-entered services and should be checked against real billing statements.",
    sourceDescription: "Use the VitalCalc subscription audit source page as the recurring-spend reference.",
    contractDescription: "Return monthly total, yearly total, subscription count, category totals, savings tips, and renewal caveats.",
    relatedSlugs: ["savings-challenge", "budget-rule", "habit-cost"],
    outcome: "Subscription spend audit",
    accent: "orange"
  }),
  "savings-challenge": vitalCalcDetail({
    badge: "Savings habit",
    summary: "This VitalCalc listing adds a local savings challenge calculator for gamified saving plans.",
    overview:
      "Savings Challenge Calculator supports 52-week incremental plans, envelope challenges, no-spend month estimates, and reverse goal plans. Toolars frames it as local habit planning with affordability checks.",
    metric: { value: "Plan", label: "Savings challenge plan" },
    category: "Finance",
    inputTitle: "Select challenge mode",
    inputDescription: "Choose 52-week, envelope, no-spend month, or reverse goal mode and capture the required assumptions.",
    resultTitle: "Generate plan",
    resultDescription: "Calculate total savings, per-period amounts, completion timeline, and schedule details.",
    reviewTitle: "Review affordability",
    reviewDescription: "Flag cash-flow limits, emergency reserves, essential spending, and whether the plan is sustainable.",
    handoffTitle: "Continue budgeting",
    handoffDescription: "Hand off savings plans to savings goal, budget rule, or emergency fund calculators.",
    localDescription: "Savings goals and schedules can be calculated locally without storing bank or household data.",
    cautionBadge: "Habit",
    cautionDescription: "Savings challenge output is habit-planning math and should be adjusted for real income, bills, and emergencies.",
    sourceDescription: "Use the VitalCalc savings challenge source page as the challenge-mode planning reference.",
    contractDescription: "Return selected mode, total savings, per-period amount, schedule, duration, and affordability caveats.",
    relatedSlugs: ["savings-goal", "budget-rule", "emergency-fund"],
    outcome: "Savings challenge schedule",
    accent: "teal"
  }),
  "city-cost-comparison": vitalCalcDetail({
    badge: "Relocation cost",
    summary: "This VitalCalc listing adds a local city cost comparison calculator for relocation surplus planning.",
    overview:
      "City Cost Comparison compares rent, food, transport, other spending, income, estimated tax, monthly surplus, and annual difference between two cities. Toolars presents it as local relocation scenario math.",
    metric: { value: "City A/B", label: "Relocation surplus comparison" },
    category: "Finance",
    inputTitle: "Enter city assumptions",
    inputDescription: "Capture monthly income and city-by-city rent, food, transport, and entertainment costs locally.",
    resultTitle: "Compare surplus",
    resultDescription: "Estimate each city's monthly surplus, annual difference, and lower-cost scenario.",
    reviewTitle: "Review relocation context",
    reviewDescription: "Flag salary changes, tax assumptions, moving costs, family needs, public data averages, and quality-of-life tradeoffs.",
    handoffTitle: "Compare housing budget",
    handoffDescription: "Hand off city surplus to income tax, budget rule, or rent-vs-buy calculators.",
    localDescription: "Relocation income and spending assumptions can be calculated locally without uploading household budget details.",
    cautionBadge: "Scenario",
    cautionDescription: "City cost outputs use user-entered averages and simplified tax assumptions, not guaranteed relocation outcomes.",
    sourceDescription: "Use the VitalCalc city cost comparison source page as the relocation cost reference.",
    contractDescription: "Return net income, city costs, monthly surplus per city, annual difference, winner label, and caveats.",
    relatedSlugs: ["income-tax", "budget-rule", "rent-vs-buy"],
    outcome: "Relocation surplus comparison",
    accent: "cyan"
  }),
  "social-insurance-calculator": vitalCalcDetail({
    badge: "Payroll deductions",
    summary: "This VitalCalc listing adds a local China social insurance calculator for salary contribution review.",
    overview:
      "China Social Insurance Calculator estimates employee and employer pension, medical, unemployment, injury, maternity, housing-fund, tax, and net salary values from pre-tax salary and base assumptions.",
    metric: { value: "5+1", label: "Payroll contribution breakdown" },
    category: "Finance",
    inputTitle: "Enter salary assumptions",
    inputDescription: "Capture monthly pre-tax salary, housing fund rate, and optional contribution base limits locally.",
    resultTitle: "Calculate contributions",
    resultDescription: "Estimate employee contribution, employer contribution, housing fund deposit, individual tax, and net salary.",
    reviewTitle: "Review local policy",
    reviewDescription: "Flag city-specific base limits, contribution rates, deductions, employer policy, and annual rule changes.",
    handoffTitle: "Compare income impact",
    handoffDescription: "Hand off net salary context to income tax, hourly-to-salary, or side-income tax calculators.",
    localDescription: "Salary and contribution assumptions can be calculated locally without uploading payroll data.",
    cautionBadge: "Policy",
    cautionDescription: "Social insurance outputs are estimates and must be checked against local payroll rules and employer policy.",
    sourceDescription: "Use the VitalCalc social insurance source page as the five-insurances and housing-fund reference.",
    contractDescription: "Return salary, contribution base, employee contribution, employer contribution, tax, net pay, and policy caveats.",
    relatedSlugs: ["income-tax", "hourly-to-salary", "side-income-tax"],
    outcome: "Payroll contribution breakdown",
    accent: "cyan"
  }),
  "dividend-reinvestment": vitalCalcDetail({
    badge: "DRIP growth",
    summary: "This VitalCalc listing adds a local dividend reinvestment calculator for DRIP compounding scenarios.",
    overview:
      "Dividend Reinvestment Calculator estimates final value, cumulative dividends, after-tax reinvestment, and the difference versus cash dividends from initial investment, yield, growth, holding period, frequency, and tax rate.",
    metric: { value: "DRIP", label: "Dividend reinvestment growth" },
    category: "Finance",
    inputTitle: "Enter dividend assumptions",
    inputDescription: "Capture initial investment, dividend yield, growth rate, holding period, reinvestment frequency, and tax rate locally.",
    resultTitle: "Calculate DRIP value",
    resultDescription: "Estimate final value, total dividends, no-reinvestment value, and reinvestment difference.",
    reviewTitle: "Review tax and return risk",
    reviewDescription: "Flag dividend taxes, payout changes, share price volatility, fees, currency, and concentration risk.",
    handoffTitle: "Compare growth tools",
    handoffDescription: "Hand off reinvestment context to compound interest, investment goal, or investment fee calculators.",
    localDescription: "Dividend assumptions can be calculated locally without uploading brokerage or portfolio data.",
    cautionBadge: "Scenario",
    cautionDescription: "Dividend reinvestment output is scenario math and not a forecast or investment recommendation.",
    sourceDescription: "Use the VitalCalc dividend reinvestment source page as the DRIP growth reference.",
    contractDescription: "Return final value, total dividends, no-reinvestment value, difference, tax assumptions, and caveats.",
    relatedSlugs: ["compound-interest", "investment-goal", "investment-fee"],
    outcome: "Dividend reinvestment scenario",
    accent: "green"
  }),
  "mortgage-refinance-calculator": vitalCalcDetail({
    badge: "Refi break-even",
    summary: "This VitalCalc listing adds a local mortgage refinance calculator for loan-offer comparison.",
    overview:
      "Mortgage Refinance Calculator compares current and new loan balance, rates, terms, and refinancing costs to estimate monthly savings, total interest savings, and break-even months.",
    metric: { value: "Break-even", label: "Mortgage refinance savings" },
    category: "Finance",
    inputTitle: "Enter loan offers",
    inputDescription: "Capture current balance, current rate, remaining term, new rate, new term, and refinancing costs locally.",
    resultTitle: "Compare savings",
    resultDescription: "Estimate old payment, new payment, monthly savings, total interest savings, and break-even time.",
    reviewTitle: "Review refinance tradeoffs",
    reviewDescription: "Flag closing costs, prepayment penalties, planned holding period, taxes, points, and term resets.",
    handoffTitle: "Compare housing tools",
    handoffDescription: "Hand off refinance context to mortgage, home affordability, or rent-vs-buy calculators.",
    localDescription: "Loan terms and cost assumptions can be calculated locally without uploading mortgage documents.",
    cautionBadge: "Costs",
    cautionDescription: "Refinance outputs are estimates and should be checked against lender disclosures and closing statements.",
    sourceDescription: "Use the VitalCalc mortgage refinance source page as the loan comparison reference.",
    contractDescription: "Return current payment, new payment, savings, break-even months, total interest comparison, and cost caveats.",
    relatedSlugs: ["mortgage-calculator", "home-affordability-calculator", "rent-vs-buy"],
    outcome: "Mortgage refinance comparison",
    accent: "blue"
  }),
  "coast-fire": vitalCalcDetail({
    badge: "Coast target",
    summary: "This VitalCalc listing adds a local Coast FIRE calculator for retirement compounding checkpoints.",
    overview:
      "Coast FIRE Calculator estimates the portfolio needed today to stop saving and still reach a future traditional FIRE target by retirement age, based on expenses, return, and withdrawal-rate assumptions.",
    metric: { value: "Coast", label: "Coast FIRE target" },
    category: "Finance",
    inputTitle: "Enter retirement assumptions",
    inputDescription: "Capture current age, retirement age, current assets, annual expenses, expected return, and withdrawal rate locally.",
    resultTitle: "Calculate coast target",
    resultDescription: "Estimate traditional FIRE target, Coast FIRE target, progress, and remaining gap or surplus.",
    reviewTitle: "Review assumption sensitivity",
    reviewDescription: "Flag market returns, inflation, spending drift, withdrawal rate, taxes, and sequence-of-return risk.",
    handoffTitle: "Compare retirement plans",
    handoffDescription: "Hand off FIRE assumptions to FIRE, retirement, or compound interest calculators.",
    localDescription: "Retirement and asset assumptions can be calculated locally without uploading account balances.",
    cautionBadge: "Scenario",
    cautionDescription: "Coast FIRE output is long-range scenario math and not financial, tax, or retirement advice.",
    sourceDescription: "Use the VitalCalc Coast FIRE source page as the compounding target reference.",
    contractDescription: "Return FIRE target, coast target, current assets, progress, gap, return assumptions, and caveats.",
    relatedSlugs: ["fire-calculator", "retirement-calculator", "compound-interest"],
    outcome: "Coast FIRE checkpoint",
    accent: "sky"
  }),
  "sip-calculator": vitalCalcDetail({
    badge: "SIP growth",
    summary: "This VitalCalc listing adds a local fund SIP calculator for recurring investment growth planning.",
    overview:
      "Fund SIP Calculator projects systematic investment plan growth from monthly investment, expected annual return, duration, and optional initial principal, with totals and yearly breakdowns.",
    metric: { value: "SIP", label: "Systematic investment projection" },
    category: "Finance",
    inputTitle: "Enter SIP assumptions",
    inputDescription: "Capture monthly investment, expected annual return, investment duration, and initial principal locally.",
    resultTitle: "Project portfolio value",
    resultDescription: "Estimate total portfolio value, total invested, investment returns, return rate, and year-by-year values.",
    reviewTitle: "Review return assumptions",
    reviewDescription: "Flag market volatility, fees, taxes, fund risk, inflation, and the difference between expected and guaranteed returns.",
    handoffTitle: "Compare investment plans",
    handoffDescription: "Hand off SIP projections to compound interest, investment goal, or investment fee calculators.",
    localDescription: "SIP inputs can be calculated locally without uploading bank, brokerage, or fund account data.",
    cautionBadge: "Projection",
    cautionDescription: "SIP output is projection math and not a promise of future fund performance.",
    sourceDescription: "Use the VitalCalc SIP source page as the recurring investment projection reference.",
    contractDescription: "Return total value, invested principal, returns, yearly table, assumptions, and investment caveats.",
    relatedSlugs: ["compound-interest", "investment-goal", "investment-fee"],
    outcome: "SIP growth projection",
    accent: "emerald"
  }),
  "smoke-free": vitalCalcDetail({
    badge: "Recovery tracker",
    summary: "This VitalCalc listing adds a local quit smoking tracker for recovery milestones and savings motivation.",
    overview:
      "Quit Smoking Tracker estimates smoke-free days, cigarettes avoided, money saved, life-extension estimate, and recovery milestones from quit date, cigarettes per day, pack size, and pack price.",
    metric: { value: "Days", label: "Smoke-free recovery tracker" },
    category: "Health",
    inputTitle: "Enter quit context",
    inputDescription: "Capture quit date, cigarettes per day, price per pack, and cigarettes per pack locally.",
    resultTitle: "Track progress",
    resultDescription: "Estimate smoke-free days, money saved, cigarettes not smoked, life extension, and milestone status.",
    reviewTitle: "Review health context",
    reviewDescription: "Flag that recovery varies by individual health, history, support, relapse risk, and clinician guidance.",
    handoffTitle: "Compare wellness context",
    handoffDescription: "Hand off lifestyle context to habit cost, BMR, or alcohol metabolism calculators.",
    localDescription: "Quit date and smoking inputs can be calculated locally without uploading health or habit history.",
    cautionBadge: "Health",
    cautionDescription: "Smoke-free outputs are motivational estimates and should not replace medical cessation support.",
    sourceDescription: "Use the VitalCalc smoke-free source page as the recovery milestone and savings reference.",
    contractDescription: "Return smoke-free days, money saved, cigarettes avoided, life estimate, milestones, and health caveats.",
    relatedSlugs: ["habit-cost", "bmr-calculator", "alcohol-metabolism"],
    outcome: "Smoke-free recovery progress",
    accent: "green"
  }),
  "adhd-screener": vitalCalcDetail({
    badge: "Adult ADHD screen",
    summary: "This VitalCalc listing adds a local ASRS-v1.1 adult ADHD screener for reference-only symptom review.",
    overview:
      "ADHD Adult Screener ASRS-v1.1 uses the WHO 6-item short form to review adult attention, organization, forgetfulness, restlessness, procrastination, and motor-driven activity symptoms over the past 6 months.",
    metric: { value: "6 items", label: "ASRS-v1.1 screening score" },
    category: "Health",
    inputTitle: "Answer ASRS items",
    inputDescription: "Capture the 6 ASRS-v1.1 frequency answers locally using the past 6 months as the reference window.",
    resultTitle: "Score screening result",
    resultDescription: "Calculate total score, positive item count, inattention dimension, and hyperactivity or impulsivity dimension.",
    reviewTitle: "Review diagnostic limits",
    reviewDescription: "Flag that ASRS-v1.1 is a screening tool only and a positive screen needs professional psychiatric or psychological evaluation.",
    handoffTitle: "Compare symptom context",
    handoffDescription: "Hand off screening context to PHQ-9, GAD-7, or PSS-10 detail pages for adjacent symptom review.",
    localDescription: "ASRS answers can be scored locally without uploading mental-health responses or identity data.",
    cautionBadge: "Screening",
    cautionDescription: "ADHD screener output is not a diagnosis and should be reviewed with a psychiatrist, psychologist, or qualified clinician.",
    sourceDescription: "Use the VitalCalc ADHD screener source page as the ASRS-v1.1 short-form scoring reference.",
    contractDescription: "Return total score, positive item count, dimensions, screen status, and professional-evaluation caveats.",
    relatedSlugs: ["phq9-depression", "gad7-anxiety", "pss10-stress"],
    outcome: "ADHD symptom screen",
    accent: "rose"
  }),
  "burnout-assessment": vitalCalcDetail({
    badge: "Burnout risk",
    summary: "This VitalCalc listing adds a local burnout assessment for work-stress and exhaustion review.",
    overview:
      "Burnout Assessment uses a 10-item short form based on core MBI and OLBI dimensions to review exhaustion, cynicism, reduced work meaning, and workload strain over the past month.",
    metric: { value: "10 items", label: "Burnout severity screen" },
    category: "Health",
    inputTitle: "Answer work-stress items",
    inputDescription: "Capture the 10 burnout frequency answers locally using the past month of work status as context.",
    resultTitle: "Score burnout risk",
    resultDescription: "Calculate total score, exhaustion dimension, cynicism dimension, and low-to-severe risk band.",
    reviewTitle: "Review work and mental health context",
    reviewDescription: "Flag workload, sleep, boundaries, job control, depression or anxiety overlap, and whether professional support is needed.",
    handoffTitle: "Compare stress tools",
    handoffDescription: "Hand off work-stress context to PSS-10, PHQ-9, or GAD-7 detail pages.",
    localDescription: "Burnout responses can be scored locally without uploading workplace, employer, or health details.",
    cautionBadge: "Screening",
    cautionDescription: "Burnout assessment output is reference-only and cannot replace a professional mental-health or occupational-health evaluation.",
    sourceDescription: "Use the VitalCalc burnout assessment source page as the 10-item work burnout reference.",
    contractDescription: "Return total score, exhaustion and cynicism dimensions, risk band, and professional-support caveats.",
    relatedSlugs: ["pss10-stress", "phq9-depression", "gad7-anxiety"],
    outcome: "Burnout risk summary",
    accent: "orange"
  }),
  "gad7-anxiety": vitalCalcDetail({
    badge: "Anxiety screen",
    summary: "This VitalCalc listing adds a local GAD-7 screener for anxiety symptom severity review.",
    overview:
      "GAD-7 Anxiety Screening scores 7 questions about nervousness, worry control, restlessness, irritability, and fear over the last 2 weeks to estimate anxiety symptom severity.",
    metric: { value: "0-21", label: "GAD-7 anxiety score" },
    category: "Health",
    inputTitle: "Answer GAD-7 questions",
    inputDescription: "Capture all 7 GAD-7 responses locally using the last 2 weeks as the assessment window.",
    resultTitle: "Score anxiety severity",
    resultDescription: "Calculate total score and map it to minimal, mild, moderate, or severe symptom bands.",
    reviewTitle: "Review support needs",
    reviewDescription: "Flag moderate or severe scores, persistent impairment, physiological causes, caffeine, sleep, and the need for professional help.",
    handoffTitle: "Compare mental-health screeners",
    handoffDescription: "Hand off anxiety context to PHQ-9, PSS-10, or burnout assessment detail pages.",
    localDescription: "GAD-7 answers can be scored locally without uploading mental-health responses or personal identifiers.",
    cautionBadge: "Screening",
    cautionDescription: "GAD-7 output is a screening result, not a diagnosis, and should be discussed with a doctor or qualified clinician when symptoms persist.",
    sourceDescription: "Use the VitalCalc GAD-7 source page as the 7-question anxiety scoring reference.",
    contractDescription: "Return GAD-7 score, severity band, response completeness, and professional-support caveats.",
    relatedSlugs: ["phq9-depression", "pss10-stress", "burnout-assessment"],
    outcome: "Anxiety severity screen",
    accent: "sky"
  }),
  "phq9-depression": vitalCalcDetail({
    badge: "Depression screen",
    summary: "This VitalCalc listing adds a local PHQ-9 depression screener with crisis-support caveats.",
    overview:
      "PHQ-9 Depression Screening scores 9 questions about mood, interest, sleep, energy, appetite, self-worth, concentration, psychomotor changes, and self-harm thoughts over the last 2 weeks.",
    metric: { value: "0-27", label: "PHQ-9 depression score" },
    category: "Health",
    inputTitle: "Answer PHQ-9 questions",
    inputDescription: "Capture all 9 PHQ-9 responses locally using the last 2 weeks as the assessment window.",
    resultTitle: "Score depression severity",
    resultDescription: "Calculate total score and map it to minimal, mild, moderate, moderately severe, or severe symptom bands.",
    reviewTitle: "Review crisis support",
    reviewDescription: "Flag any self-harm response, severe distress, urgent care needs, and the limits of self-screening.",
    handoffTitle: "Compare adjacent screeners",
    handoffDescription: "Hand off depression context to GAD-7, PSS-10, or burnout assessment detail pages.",
    localDescription: "PHQ-9 answers can be scored locally without uploading sensitive mental-health responses.",
    cautionBadge: "Crisis",
    cautionDescription: "PHQ-9 is not a diagnosis; any self-harm thoughts or severe distress should trigger immediate crisis support or urgent professional care.",
    sourceDescription: "Use the VitalCalc PHQ-9 source page as the 9-question depression scoring reference.",
    contractDescription: "Return PHQ-9 score, severity band, self-harm flag, and urgent-support caveats.",
    relatedSlugs: ["gad7-anxiety", "pss10-stress", "burnout-assessment"],
    outcome: "Depression severity screen",
    accent: "purple"
  }),
  "pss10-stress": vitalCalcDetail({
    badge: "Stress scale",
    summary: "This VitalCalc listing adds a local PSS-10 perceived stress scale for stress level review.",
    overview:
      "PSS-10 Perceived Stress Scale scores 10 questions about control, overload, confidence, irritation, and coping over the last month, including reverse-scored positive items.",
    metric: { value: "0-40", label: "PSS-10 stress score" },
    category: "Health",
    inputTitle: "Answer PSS-10 items",
    inputDescription: "Capture the 10 PSS-10 responses locally using the last month as the stress reference window.",
    resultTitle: "Score perceived stress",
    resultDescription: "Calculate total score and map it to low, moderate, or high perceived stress bands.",
    reviewTitle: "Review coping context",
    reviewDescription: "Flag chronic stress, sleep, caffeine, workload, social support, physical symptoms, and whether counseling may help.",
    handoffTitle: "Compare wellbeing tools",
    handoffDescription: "Hand off stress context to GAD-7, PHQ-9, or burnout assessment detail pages.",
    localDescription: "PSS-10 answers can be scored locally without uploading stress history or personal identifiers.",
    cautionBadge: "Screening",
    cautionDescription: "PSS-10 output is a perceived-stress screen and should not replace advice from a doctor or qualified clinician.",
    sourceDescription: "Use the VitalCalc PSS-10 source page as the perceived stress scoring reference.",
    contractDescription: "Return PSS-10 score, stress band, reverse-scored item handling, and support caveats.",
    relatedSlugs: ["gad7-anxiety", "phq9-depression", "burnout-assessment"],
    outcome: "Perceived stress summary",
    accent: "amber"
  }),
  "glp1-eligibility": vitalCalcDetail({
    badge: "GLP-1 eligibility",
    summary: "This VitalCalc listing adds a local GLP-1 eligibility check for BMI and comorbidity discussion prep.",
    overview:
      "GLP-1 Eligibility Check estimates whether common BMI and weight-related comorbidity criteria may support a conversation about GLP-1 medications such as semaglutide or tirzepatide.",
    metric: { value: "BMI", label: "BMI eligibility screen" },
    category: "Health",
    inputTitle: "Enter body and condition data",
    inputDescription: "Capture height, weight, and relevant comorbidities locally to calculate BMI and eligibility bands.",
    resultTitle: "Check common criteria",
    resultDescription: "Estimate BMI category, whether common BMI >= 30 or BMI >= 27 plus comorbidity criteria may be met, and next discussion points.",
    reviewTitle: "Review prescription limits",
    reviewDescription: "Flag contraindications, medication availability, side effects, pregnancy status, history, labs, and clinician review requirements.",
    handoffTitle: "Compare body metrics",
    handoffDescription: "Hand off BMI context to BMI, calorie deficit, or macro calculators.",
    localDescription: "Height, weight, and checkbox inputs can be evaluated locally without uploading health records.",
    cautionBadge: "Medical",
    cautionDescription: "GLP-1 eligibility output is educational only; medication decisions require a doctor or qualified clinician reviewing the full health profile.",
    sourceDescription: "Use the VitalCalc GLP-1 eligibility source page as the BMI and comorbidity criteria reference.",
    contractDescription: "Return BMI, BMI category, comorbidity flag, criteria match, medication discussion notes, and medical caveats.",
    relatedSlugs: ["bmi-calculator", "calorie-deficit", "macro-calculator"],
    outcome: "GLP-1 discussion checklist",
    accent: "emerald"
  }),
  "body-recomposition": vitalCalcDetail({
    badge: "Recomp plan",
    summary: "This VitalCalc listing adds a local body recomposition calculator for simultaneous fat-loss and muscle-gain planning.",
    overview:
      "Body Recomposition Calculator estimates TDEE, daily calorie target, and macronutrient split from body metrics, activity, and goal mode. Toolars presents it as a private fitness planning reference with clear nutrition caveats.",
    metric: { value: "TDEE", label: "Recomposition macro plan" },
    category: "Health",
    inputTitle: "Enter body and activity data",
    inputDescription: "Capture gender, age, height, weight, activity level, and recomp goal locally.",
    resultTitle: "Calculate recomp targets",
    resultDescription: "Estimate BMR, TDEE, calorie target, protein grams, carbs, fat, and macro percentages.",
    reviewTitle: "Review training context",
    reviewDescription: "Flag that recomposition depends on resistance training, protein intake, sleep, and measurement consistency.",
    handoffTitle: "Continue nutrition planning",
    handoffDescription: "Hand off recomp targets to TDEE, macro, or protein calculators.",
    localDescription: "Body metrics and goal assumptions can be calculated locally without uploading health or fitness data.",
    cautionBadge: "Reference",
    cautionDescription: "Recomposition output is planning guidance and should be adjusted for training status, health history, and professional advice.",
    sourceDescription: "Use the VitalCalc body recomposition source page as the TDEE and macro split reference.",
    contractDescription: "Return BMR, TDEE, calorie target, protein, carbs, fat, macro percentages, and fitness caveats.",
    relatedSlugs: ["tdee-calculator", "macro-calculator", "protein-calculator"],
    outcome: "Recomposition calorie and macro plan",
    accent: "orange"
  }),
  "glp1-nutrition": vitalCalcDetail({
    badge: "GLP-1 nutrition",
    summary: "This VitalCalc listing adds a local nutrition target calculator for people discussing or using GLP-1 medications.",
    overview:
      "GLP-1 Nutrition Calculator estimates calorie floor, protein target, fiber goal, and hydration needs from weight, activity, medication context, and age. The detail page keeps medication and diet changes framed as clinician-supervised.",
    metric: { value: "4", label: "Nutrition targets" },
    category: "Health",
    inputTitle: "Enter nutrition context",
    inputDescription: "Capture body weight, activity level, GLP-1 medication type, and age locally.",
    resultTitle: "Calculate minimum targets",
    resultDescription: "Estimate calorie floor, protein grams, fiber goal, water target, and muscle-preservation reminders.",
    reviewTitle: "Review medication caveats",
    reviewDescription: "Flag undereating risk, muscle loss, side effects, gallbladder concerns, pregnancy status, and clinician supervision.",
    handoffTitle: "Compare nutrition tools",
    handoffDescription: "Hand off targets to protein, water intake, or calorie deficit calculators.",
    localDescription: "Weight and medication context can be evaluated locally without uploading medication or health history.",
    cautionBadge: "Medical",
    cautionDescription: "GLP-1 nutrition output is educational and should not replace advice from a healthcare provider.",
    sourceDescription: "Use the VitalCalc GLP-1 nutrition source page as the calorie floor, protein, fiber, and hydration reference.",
    contractDescription: "Return calorie floor, protein target, fiber goal, hydration target, medication label, and medical caveats.",
    relatedSlugs: ["protein-calculator", "water-intake", "calorie-deficit"],
    outcome: "GLP-1 nutrition target summary",
    accent: "emerald"
  }),
  "homa-ir": vitalCalcDetail({
    badge: "Insulin resistance",
    summary: "This VitalCalc listing adds a local HOMA-IR calculator for fasting glucose and insulin reference review.",
    overview:
      "HOMA-IR Calculator estimates insulin resistance from fasting glucose and fasting insulin, with unit conversion and reference bands. Toolars treats it as a lab-value reference that requires clinician interpretation.",
    metric: { value: "HOMA-IR", label: "Insulin resistance estimate" },
    category: "Health",
    inputTitle: "Enter fasting lab values",
    inputDescription: "Capture fasting glucose, glucose unit, fasting insulin, and insulin unit locally.",
    resultTitle: "Calculate HOMA-IR",
    resultDescription: "Compute the HOMA-IR value and map it to normal, borderline, or insulin-resistance reference bands.",
    reviewTitle: "Review clinical context",
    reviewDescription: "Flag lab timing, ethnicity, medication, PCOS, metabolic syndrome, and endocrinology follow-up needs.",
    handoffTitle: "Compare metabolic tools",
    handoffDescription: "Hand off insulin-resistance context to glycemic load, blood sugar, or BMI calculators.",
    localDescription: "Lab values can be calculated locally without uploading test results or personal health identifiers.",
    cautionBadge: "Medical",
    cautionDescription: "HOMA-IR output is reference-only and cannot diagnose diabetes, insulin resistance, or metabolic disease.",
    sourceDescription: "Use the VitalCalc HOMA-IR source page as the fasting glucose and fasting insulin formula reference.",
    contractDescription: "Return converted glucose, converted insulin, HOMA-IR value, reference band, and medical caveats.",
    relatedSlugs: ["glycemic-load", "blood-sugar-calculator", "bmi-calculator"],
    outcome: "Insulin resistance reference",
    accent: "red"
  }),
  "one-rep-max": vitalCalcDetail({
    badge: "Strength estimate",
    summary: "This VitalCalc listing adds a local 1RM calculator for strength training percentage planning.",
    overview:
      "1RM Calculator estimates one-repetition maximum from working weight and reps using the Epley formula, then produces percentage-based working sets. It is a training reference, not a substitute for safe coaching.",
    metric: { value: "1RM", label: "1RM estimate" },
    category: "Health",
    inputTitle: "Enter lift data",
    inputDescription: "Capture working weight and completed reps locally before estimating the max.",
    resultTitle: "Estimate max strength",
    resultDescription: "Calculate estimated one-rep max and common percentage-based training weights.",
    reviewTitle: "Review safety limits",
    reviewDescription: "Flag that high-rep estimates are less accurate and actual max testing carries injury risk.",
    handoffTitle: "Compare training tools",
    handoffDescription: "Hand off strength context to protein, TDEE, or body recomposition calculators.",
    localDescription: "Lift data can be calculated in-browser without uploading training history or body metrics.",
    cautionBadge: "Training",
    cautionDescription: "1RM output is an estimate and should be used with safe progression, spotters, and qualified coaching where needed.",
    sourceDescription: "Use the VitalCalc one-rep-max source page as the Epley formula and percentage table reference.",
    contractDescription: "Return estimated 1RM, percentage table, input weight, reps, formula label, and training caveats.",
    relatedSlugs: ["protein-calculator", "tdee-calculator", "body-recomposition"],
    outcome: "1RM and working-set table",
    accent: "rose"
  }),
  "ovulation-calculator": vitalCalcDetail({
    badge: "Cycle estimate",
    summary: "This VitalCalc listing adds a local ovulation calculator for fertile-window and next-period estimates.",
    overview:
      "Ovulation Calculator predicts ovulation day, fertile window, peak fertility, next period, and cycle milestones from the first day of the last period and average cycle length.",
    metric: { value: "Cycle", label: "Fertile window estimate" },
    category: "Health",
    inputTitle: "Enter cycle data",
    inputDescription: "Capture first day of last period, average cycle length, and period duration locally.",
    resultTitle: "Estimate cycle dates",
    resultDescription: "Calculate ovulation day, fertile window, peak fertility, next period, and safe-period range.",
    reviewTitle: "Review fertility caveats",
    reviewDescription: "Flag irregular cycles, ovulation-test use, basal temperature tracking, contraception limits, and clinician guidance.",
    handoffTitle: "Compare pregnancy tools",
    handoffDescription: "Hand off cycle context to pregnancy due date, BMI, or health reference tools.",
    localDescription: "Cycle dates can be calculated locally without uploading reproductive health data.",
    cautionBadge: "Reference",
    cautionDescription: "Ovulation output is an estimate and should not be used as the sole contraception or fertility-care method.",
    sourceDescription: "Use the VitalCalc ovulation source page as the cycle-length and fertile-window reference.",
    contractDescription: "Return ovulation date, fertile window, peak date, next period, cycle assumptions, and reproductive-health caveats.",
    relatedSlugs: ["pregnancy-due-date", "bmi-calculator", "water-intake"],
    outcome: "Fertile window estimate",
    accent: "pink"
  }),
  "pregnancy-due-date": vitalCalcDetail({
    badge: "Due date",
    summary: "This VitalCalc listing adds a local pregnancy due date calculator for gestational timeline estimates.",
    overview:
      "Pregnancy Due Date Calculator estimates due date, conception date, gestational week, trimester, days remaining, and progress from last menstrual period and cycle length.",
    metric: { value: "40 weeks", label: "Due date estimate" },
    category: "Health",
    inputTitle: "Enter LMP and cycle length",
    inputDescription: "Capture first day of last period and average cycle length locally.",
    resultTitle: "Estimate due date",
    resultDescription: "Calculate estimated due date, conception estimate, current gestational week, trimester, remaining days, and progress.",
    reviewTitle: "Review pregnancy care context",
    reviewDescription: "Flag cycle irregularity, ultrasound dating, IVF context, delivery-window variability, and obstetrician guidance.",
    handoffTitle: "Compare cycle tools",
    handoffDescription: "Hand off due-date context to ovulation, BMI, or health reference calculators.",
    localDescription: "Pregnancy timeline inputs can be calculated locally without uploading reproductive health data.",
    cautionBadge: "Medical",
    cautionDescription: "Due date output is an estimate; personalized pregnancy care and dating should come from an obstetrician or qualified clinician.",
    sourceDescription: "Use the VitalCalc pregnancy due date source page as the Naegele-rule and cycle-adjustment reference.",
    contractDescription: "Return due date, conception estimate, gestational age, trimester, remaining days, progress, and medical caveats.",
    relatedSlugs: ["ovulation-calculator", "bmi-calculator", "water-intake"],
    outcome: "Pregnancy due date and trimester summary",
    accent: "pink"
  }),
  "running-pace": vitalCalcDetail({
    badge: "Race pace",
    summary: "This VitalCalc listing adds a local running pace calculator for race target and split planning.",
    overview:
      "Running Pace Calculator converts target distance and finish time into pace per kilometer, pace per mile, speed, track-lap split, and equivalent performance estimates across common race distances.",
    metric: { value: "Pace", label: "Race pace estimate" },
    category: "Health",
    inputTitle: "Enter race target",
    inputDescription: "Capture distance, optional custom distance, hours, minutes, and seconds locally.",
    resultTitle: "Calculate pace and splits",
    resultDescription: "Estimate average pace, speed, mile pace, 400m lap split, and equivalent race performances.",
    reviewTitle: "Review training context",
    reviewDescription: "Flag terrain, weather, training volume, fatigue, injury risk, and formula limits for equivalent performances.",
    handoffTitle: "Compare fitness tools",
    handoffDescription: "Hand off race context to heart-rate zones, steps-to-calories, or VO2 max calculators.",
    localDescription: "Race targets can be calculated locally without uploading training history or location data.",
    cautionBadge: "Training",
    cautionDescription: "Running pace output is a planning estimate and should be adjusted for conditions, health, and coaching guidance.",
    sourceDescription: "Use the VitalCalc running pace source page as the pace, speed, lap, and Riegel-equivalent reference.",
    contractDescription: "Return pace per kilometer, pace per mile, speed, lap split, equivalent table, and training caveats.",
    relatedSlugs: ["heart-rate-zone", "steps-to-calories", "vo2-max"],
    outcome: "Race pace and split plan",
    accent: "blue"
  }),
  "testosterone-calculator": vitalCalcDetail({
    badge: "Hormone reference",
    summary: "This VitalCalc listing adds a local testosterone calculator for free and bioavailable testosterone reference review.",
    overview:
      "Testosterone Calculator estimates free testosterone, bioavailable testosterone, and free percentage from total testosterone, SHBG, albumin, units, and gender, with reference-range caveats.",
    metric: { value: "Free T", label: "Bioavailable hormone estimate" },
    category: "Health",
    inputTitle: "Enter hormone lab values",
    inputDescription: "Capture total testosterone, SHBG, albumin, units, and gender locally.",
    resultTitle: "Calculate free hormone estimates",
    resultDescription: "Estimate free testosterone, bioavailable testosterone, free percentage, and reference-range status.",
    reviewTitle: "Review endocrine context",
    reviewDescription: "Flag blood draw timing, lab method differences, symptoms, medications, age, PCOS, and endocrinology follow-up.",
    handoffTitle: "Compare body metrics",
    handoffDescription: "Hand off hormone context to BMI, body fat, or body recomposition calculators.",
    localDescription: "Hormone lab values can be calculated locally without uploading lab reports or personal identifiers.",
    cautionBadge: "Medical",
    cautionDescription: "Testosterone output is reference-only and cannot replace diagnosis or treatment advice from an endocrinologist.",
    sourceDescription: "Use the VitalCalc testosterone source page as the total, SHBG, albumin, free, and bioavailable calculation reference.",
    contractDescription: "Return free testosterone, bioavailable testosterone, free percentage, units, reference band, and medical caveats.",
    relatedSlugs: ["bmi-calculator", "body-fat-calculator", "body-recomposition"],
    outcome: "Free and bioavailable testosterone reference",
    accent: "indigo"
  })
};

function relatedToolsFor(slugs: string[]): ToolDefinition[] {
  return slugs.flatMap((slug) => {
    const related = getToolBySlug(slug);
    return related ? [related] : [];
  });
}

export function getToolDetailBySlug(slug: string): ToolDetailDefinition | undefined {
  if (!allDetailSlugs.includes(slug as ToolDetailSlug)) return undefined;

  const tool = getToolBySlug(slug);
  if (!tool) return undefined;
  const rawContent = detailContent[slug as ToolDetailSlug];
  const content =
    w20BfDeveloperUtilityNativeDetailSlugs.has(slug) || w20BkNativeDetailSlugSet.has(slug)
      ? toW20BfNativeDetail(tool, rawContent)
      : rawContent;
  if (!content) return undefined;

  return {
    tool,
    workspaceHref: tool.href,
    listingBadge: content.listingBadge,
    summary: content.summary,
    overview: content.overview,
    metrics: content.metrics,
    howItWorks: content.howItWorks,
    trustSection: content.trustSection,
    handoff: content.handoff,
    includedCollections: collections.filter((collection) => collection.toolSlugs.includes(slug)),
    relatedTools: relatedToolsFor(content.relatedSlugs),
    recommendedWorkflow: workflows.find((workflow) => workflow.slug === content.workflowSlug),
    outcome: content.outcome
  };
}

function createW20BfNativeBaseDetail(tool: ToolDefinition): ToolDetailContent {
  return {
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: `${tool.name} is now a native Toolars workspace with local processing, focused tests, and a public tool route.`,
    overview:
      `${tool.name} has been promoted from registry inventory into a Toolars-native developer utility workspace. ` +
      "The implementation keeps inputs in the browser, exposes a focused local library contract, and uses the current Toolars workbench layout for input, result, review, and handoff states.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      { value: "Utility", label: "Developer workflow" },
      { value: "Public", label: "Workspace status" },
      { value: "Toolars", label: "Native implementation" }
    ],
    howItWorks: [
      {
        title: "Add developer input",
        description: "Paste source data, code, config, or lookup text into the local Toolars workspace.",
        badge: "Input",
        tone: "local"
      },
      {
        title: "Run the local utility",
        description: "Use the focused Toolars library implementation to transform, inspect, validate, or explain the input.",
        badge: "Process"
      },
      {
        title: "Review output",
        description: "Check warnings, assumptions, metadata, and generated output before using it in project files or documentation.",
        badge: "Review",
        tone: "warn"
      },
      {
        title: "Copy the result",
        description: "Move the reviewed result into the next developer workflow with the local processing boundary intact.",
        badge: "Handoff"
      }
    ],
    trustSection: {
      title: `Local ${tool.name.toLowerCase()} model`,
      rows: [
        {
          badge: "Local",
          description: "Inputs are processed in the browser by the native Toolars workspace and are not uploaded.",
          tone: "local"
        },
        {
          badge: "Review",
          description: "Generated output is designed for developer review before use in production code, config, documentation, or deployment workflows.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars route, native workspace, local library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Keeps the original Aixtral registry intent as the migration and behavior reference where source coverage exists.",
        badge: "Source",
        accent: tool.accent
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Uses the current Toolars workbench pattern with local input controls, result review, and copy-ready output states.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    relatedSlugs: ["json-repair", "json-formatter", "schema-validator"].filter((slug) => slug !== tool.slug),
    outcome: `Native ${tool.name} workspace for local developer utility workflows`
  };
}

function toW20BfNativeDetail(tool: ToolDefinition, content?: ToolDetailContent): ToolDetailContent {
  const baseContent = content ?? createW20BfNativeBaseDetail(tool);
  const primaryMetric = baseContent.metrics.find((metric) => !["Detail", "Local", "Hidden"].includes(metric.value)) ?? {
    value: "Local",
    label: "Utility mode"
  };

  return {
    ...baseContent,
    listingBadge: { badge: "Native workspace", description: "Native workspace", tone: "local" },
    summary: `${tool.name} is now a native Toolars workspace with local processing, focused tests, and a public tool route.`,
    overview:
      `${tool.name} has been promoted from registry inventory into a Toolars-native developer utility workspace. ` +
      "The implementation keeps inputs in the browser, exposes a focused local library contract, and uses the current Toolars workbench layout for input, result, review, and handoff states.",
    metrics: [
      { value: "Local", label: "Processing mode" },
      primaryMetric,
      { value: "Public", label: "Workspace status" },
      { value: "Toolars", label: "Native implementation" }
    ],
    trustSection: {
      title: `Local ${tool.name.toLowerCase()} model`,
      rows: [
        {
          badge: "Local",
          description: "Inputs are processed in the browser by the native Toolars workspace and are not uploaded.",
          tone: "local"
        },
        {
          badge: "Review",
          description: "Generated output is designed for developer review before use in production code, config, documentation, or deployment workflows.",
          tone: "warn"
        },
        {
          badge: "Public",
          description: "This tool has a dedicated Toolars route, native workspace, local library implementation, and focused tests."
        }
      ]
    },
    handoff: [
      {
        initials: "AX",
        title: "Aixtral source",
        description: "Keeps the original Aixtral registry intent as the migration and behavior reference where source coverage exists.",
        badge: "Source",
        accent: tool.accent
      },
      {
        initials: "UI",
        title: "Toolars workspace",
        description: "Uses the current Toolars workbench pattern with local input controls, result review, and copy-ready output states.",
        badge: "Ready",
        accent: "blue"
      }
    ],
    outcome: `Native ${tool.name} workspace for local developer utility workflows`
  };
}

export function getAllToolDetails(): ToolDetailDefinition[] {
  return allDetailSlugs.flatMap((slug) => {
    const detail = getToolDetailBySlug(slug);
    return detail ? [detail] : [];
  });
}
