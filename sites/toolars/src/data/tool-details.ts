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

export const allDetailSlugs = [...labDetailSlugs, ...vitalCalcDetailSlugs] as const;

export type LabDetailSlug = (typeof labDetailSlugs)[number];
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

const detailContent: Record<ToolDetailSlug, ToolDetailContent> = {
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

  const content = detailContent[slug as ToolDetailSlug];
  const tool = getToolBySlug(slug);
  if (!tool) return undefined;

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

export function getAllToolDetails(): ToolDetailDefinition[] {
  return allDetailSlugs.flatMap((slug) => {
    const detail = getToolDetailBySlug(slug);
    return detail ? [detail] : [];
  });
}
