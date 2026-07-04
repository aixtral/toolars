export interface JsonTreeInput {
  input: string;
}

export interface JsonTreeNode {
  path: string;
  key: string;
  type: string;
  depth: number;
  preview: string;
}

export interface JsonTreeError {
  type: "invalid-json" | "empty-input";
  message: string;
}

export interface JsonTreeResult {
  success: boolean;
  nodes: JsonTreeNode[];
  error?: JsonTreeError;
  stats: {
    nodes: number;
    maxDepth: number;
  };
  privacyNote: string;
}

const privacyNote = "JSON tree inspection runs locally in the browser.";

export function buildJsonTree({ input }: JsonTreeInput): JsonTreeResult {
  if (!input.trim()) {
    return failure({ type: "empty-input", message: "Add JSON to inspect." });
  }

  try {
    const parsed = JSON.parse(input) as unknown;
    const nodes: JsonTreeNode[] = [];
    visitJsonValue(parsed, "$", "$", 0, nodes);
    return {
      success: true,
      nodes,
      stats: {
        nodes: nodes.length,
        maxDepth: Math.max(...nodes.map((node) => node.depth))
      },
      privacyNote
    };
  } catch (error) {
    return failure({ type: "invalid-json", message: error instanceof Error ? error.message : "Invalid JSON." });
  }
}

function failure(error: JsonTreeError): JsonTreeResult {
  return {
    success: false,
    nodes: [],
    error,
    stats: { nodes: 0, maxDepth: 0 },
    privacyNote
  };
}

function visitJsonValue(value: unknown, key: string, path: string, depth: number, nodes: JsonTreeNode[]) {
  nodes.push({ path, key, type: getJsonType(value), depth, preview: previewValue(value) });

  if (Array.isArray(value)) {
    value.forEach((item, index) => visitJsonValue(item, `[${index}]`, `${path}[${index}]`, depth + 1, nodes));
    return;
  }

  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
      visitJsonValue(childValue, childKey, `${path}.${childKey}`, depth + 1, nodes);
    }
  }
}

function getJsonType(value: unknown): string {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function previewValue(value: unknown): string {
  if (Array.isArray(value)) return `${value.length} items`;
  if (value && typeof value === "object") return `${Object.keys(value).length} keys`;
  return JSON.stringify(value);
}
