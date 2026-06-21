export interface McpServerDraft {
  serverName: string;
  primaryTool: string;
  toolDescription: string;
  includeJsonSchema: boolean;
  includeResourceIndex: boolean;
  includeOAuthNotes: boolean;
  includeTestPayload: boolean;
}

export interface McpInputSchema {
  type: "object";
  properties: {
    query: {
      type: "string";
      description: string;
    };
    max_results?: {
      type: "number";
      default: number;
      description: string;
    };
  };
  required?: string[];
}

export interface McpManifestTool {
  name: string;
  description: string;
  inputSchema: McpInputSchema;
}

export interface McpManifest {
  name: string;
  tools: McpManifestTool[];
  resources?: string[];
  auth?: {
    type: "oauth";
    notes: string;
  };
  testPayload?: {
    query: string;
    max_results: number;
  };
}

export type McpReviewTone = "ok" | "warn";

export interface McpReviewCheck {
  tone: McpReviewTone;
  label: string;
}

export const defaultMcpServerDraft: McpServerDraft = {
  serverName: "toolars-research-kit",
  primaryTool: "search_private_docs",
  toolDescription: "Search a private document collection and return cited passages with source IDs.",
  includeJsonSchema: true,
  includeResourceIndex: true,
  includeOAuthNotes: false,
  includeTestPayload: true
};

export function buildMcpServerDraft(overrides: Partial<McpServerDraft> = {}): McpServerDraft {
  return {
    ...defaultMcpServerDraft,
    ...overrides
  };
}

export function buildMcpManifest(draft: McpServerDraft): McpManifest {
  const manifest: McpManifest = {
    name: cleanIdentifier(draft.serverName, "toolars-research-kit"),
    tools: [
      {
        name: cleanIdentifier(draft.primaryTool, "search_private_docs"),
        description: draft.toolDescription.trim() || defaultMcpServerDraft.toolDescription,
        inputSchema: buildInputSchema(draft.includeJsonSchema)
      }
    ]
  };

  if (draft.includeResourceIndex) {
    manifest.resources = ["docs://private-collection/index"];
  }

  if (draft.includeOAuthNotes) {
    manifest.auth = {
      type: "oauth",
      notes: "Document required scopes, token lifetime, and rate-limit behavior before launch."
    };
  }

  if (draft.includeTestPayload) {
    manifest.testPayload = {
      query: "Summarize refund policy changes",
      max_results: 5
    };
  }

  return manifest;
}

export function stringifyMcpManifest(manifest: McpManifest): string {
  return JSON.stringify(manifest, null, 2);
}

export function validateMcpServerDraft(draft: McpServerDraft): McpReviewCheck[] {
  return [
    {
      tone: isActionOrientedToolName(draft.primaryTool) ? "ok" : "warn",
      label: isActionOrientedToolName(draft.primaryTool) ? "Tool name is action-oriented." : "Tool name should start with an action verb."
    },
    {
      tone: draft.includeJsonSchema ? "ok" : "warn",
      label: draft.includeJsonSchema ? "Schema fields are explicit." : "JSON schema should be included before launch."
    },
    {
      tone: draft.includeOAuthNotes ? "ok" : "warn",
      label: draft.includeOAuthNotes ? "Auth and rate-limit policy documented." : "Auth and rate-limit policy still needed."
    }
  ];
}

export function getMcpManifestStatus(draft: McpServerDraft): string {
  const toolCount = 1;
  const resourceCount = draft.includeResourceIndex ? 1 : 0;
  const payloadCount = draft.includeTestPayload ? 1 : 0;
  return `Manifest generated - ${toolCount} tool - ${resourceCount} resource - ${payloadCount} test payload`;
}

function buildInputSchema(includeJsonSchema: boolean): McpInputSchema {
  if (!includeJsonSchema) {
    return {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query"
        }
      }
    };
  }

  return {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query"
      },
      max_results: {
        type: "number",
        default: 5,
        description: "Maximum passages to return"
      }
    },
    required: ["query"]
  };
}

function cleanIdentifier(value: string, fallback: string): string {
  const clean = value.trim();
  return clean.length > 0 ? clean : fallback;
}

function isActionOrientedToolName(name: string): boolean {
  return /^(search|lookup|fetch|get|list|create|update|summarize|validate|query)_/i.test(name.trim());
}
