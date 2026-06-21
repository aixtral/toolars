import {
  collections,
  getToolBySlug,
  workflows,
  type CollectionDefinition,
  type ToolDefinition,
  type WorkflowDefinition
} from "./registry";

export const collectionDetailSlugs = ["pdf-ops-kit", "ai-developer-lab"] as const;

export type CollectionDetailSlug = (typeof collectionDetailSlugs)[number];
export type CollectionBadgeTone = "local" | "ai" | "warn" | "workflow" | "cloud";

export interface CollectionDetailAction {
  label: string;
  href: string;
}

export interface CollectionDetailStep {
  title: string;
  description: string;
  badge: string;
  tone?: CollectionBadgeTone;
}

export interface CollectionPlaybook {
  title: string;
  description: string;
  outcome: string;
  accent: string;
}

export interface CollectionDetailDefinition {
  collection: CollectionDefinition;
  eyebrow: string;
  summary: string;
  primaryAction: CollectionDetailAction;
  secondaryAction: CollectionDetailAction;
  recommendedPath: CollectionDetailStep[];
  tools: ToolDefinition[];
  workflows: WorkflowDefinition[];
  playbooks: CollectionPlaybook[];
  notes: string;
}

interface CollectionDetailContent {
  eyebrow: string;
  summary: string;
  primaryAction: CollectionDetailAction;
  secondaryAction: CollectionDetailAction;
  recommendedPath: CollectionDetailStep[];
  playbooks: CollectionPlaybook[];
  notes: string;
}

const detailContent = {
  "pdf-ops-kit": {
    eyebrow: "Official collection",
    summary: "A focused stack for merging, compressing, summarizing, and sharing business PDFs.",
    primaryAction: { label: "Open PDF Toolkit", href: "/tools/pdf-toolkit" },
    secondaryAction: { label: "Open workflow", href: "/workflows/pdf-summary" },
    recommendedPath: [
      {
        title: "Merge and reorder PDFs",
        description: "Start in PDF Toolkit with local processing.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Summarize selected pages",
        description: "Approve AI only for extracted text.",
        badge: "AI consent",
        tone: "ai"
      },
      {
        title: "Validate structured output",
        description: "Use JSON Repair when LLM output needs cleanup.",
        badge: "Aixtral Lab",
        tone: "workflow"
      }
    ],
    playbooks: [],
    notes:
      "Best for client reports, board packs, invoice bundles, and AI-assisted summaries where local-first handling matters."
  },
  "ai-developer-lab": {
    eyebrow: "AI Developer Lab collection",
    summary:
      "Security, cost, prompt, RAG, MCP, and agent tools from the Aixtral Lab inventory, packaged as repeatable Toolars workspaces for product builders.",
    primaryAction: { label: "Open first tool", href: "/tools/json-repair" },
    secondaryAction: { label: "Browse full Lab", href: "/explore/ai-developer" },
    recommendedPath: [
      {
        title: "Repair structured output",
        description: "Start with JSON Repair and schema-safe payloads.",
        badge: "Local",
        tone: "local"
      },
      {
        title: "Scan prompt risk",
        description: "Run prompt injection checks before agent release.",
        badge: "Security",
        tone: "warn"
      },
      {
        title: "Budget and launch MCP tools",
        description: "Estimate LLM spend, then package MCP definitions and tests.",
        badge: "Launch",
        tone: "workflow"
      }
    ],
    playbooks: [
      {
        title: "Repair and validate LLM JSON",
        description: "Normalize model output before downstream tools consume it.",
        outcome: "Stable payloads",
        accent: "amber"
      },
      {
        title: "Harden prompt surfaces",
        description: "Review system prompts, tool instructions, and retrieved text before release.",
        outcome: "Guardrail checklist",
        accent: "rose"
      },
      {
        title: "Ship an MCP tool",
        description: "Build tool schemas, test payloads, and launch documentation.",
        outcome: "Agent-ready launch",
        accent: "purple"
      }
    ],
    notes:
      "Best for teams building AI apps, agent workflows, MCP servers, RAG QA, prompt guardrails, and cost reviews."
  }
} satisfies Record<CollectionDetailSlug, CollectionDetailContent>;

function isCollectionDetailSlug(slug: string): slug is CollectionDetailSlug {
  return (collectionDetailSlugs as readonly string[]).includes(slug);
}

function resolveTools(collection: CollectionDefinition): ToolDefinition[] {
  return collection.toolSlugs.map((slug) => getToolBySlug(slug)).filter((tool): tool is ToolDefinition => Boolean(tool));
}

function resolveWorkflows(collection: CollectionDefinition): WorkflowDefinition[] {
  return collection.workflowSlugs
    .map((slug) => workflows.find((workflow) => workflow.slug === slug))
    .filter((workflow): workflow is WorkflowDefinition => Boolean(workflow));
}

export function getCollectionDetailBySlug(slug: string): CollectionDetailDefinition | undefined {
  if (!isCollectionDetailSlug(slug)) return undefined;

  const collection = collections.find((item) => item.slug === slug);
  if (!collection) return undefined;

  const content = detailContent[slug];

  return {
    collection,
    ...content,
    tools: resolveTools(collection),
    workflows: resolveWorkflows(collection)
  };
}
