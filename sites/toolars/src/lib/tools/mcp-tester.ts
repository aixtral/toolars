export type McpTesterStatus = "ready" | "review" | "error";
export type McpTesterTone = "ok" | "warn";

export interface McpTesterInput {
  manifestJson: string;
  payloadJson: string;
}

export interface McpTesterCheck {
  label: string;
  tone: McpTesterTone;
  detail: string;
}

export interface McpTesterResult {
  status: McpTesterStatus;
  toolName: string;
  requiredFields: string[];
  checks: McpTesterCheck[];
  summary: string;
  privacyNote: string;
}

interface McpManifestToolShape {
  name?: unknown;
  inputSchema?: {
    required?: unknown;
    properties?: unknown;
  };
}

export function testMcpContract(input: McpTesterInput): McpTesterResult {
  const manifest = parseJson(input.manifestJson);
  const payload = parseJson(input.payloadJson);
  const manifestTool = getFirstTool(manifest.value);
  const toolName = typeof manifestTool?.name === "string" ? manifestTool.name : "Unknown tool";
  const requiredFields = Array.isArray(manifestTool?.inputSchema?.required)
    ? manifestTool.inputSchema.required.filter((field): field is string => typeof field === "string")
    : [];
  const payloadObject = isObjectRecord(payload.value) ? payload.value : {};
  const missingRequiredFields = requiredFields.filter((field) => !(field in payloadObject));
  const checks: McpTesterCheck[] = [
    {
      label: "Manifest JSON",
      tone: manifest.ok && manifestTool ? "ok" : "warn",
      detail: manifest.ok ? "Manifest JSON parsed with a tool definition." : manifest.error
    },
    {
      label: "Sample payload JSON",
      tone: payload.ok && isObjectRecord(payload.value) ? "ok" : "warn",
      detail: payload.ok ? "Sample payload parsed as an object." : payload.error
    },
    {
      label: "Required payload fields",
      tone: missingRequiredFields.length === 0 && requiredFields.length > 0 ? "ok" : "warn",
      detail:
        missingRequiredFields.length === 0
          ? `${requiredFields.length} required fields present.`
          : `Missing required fields: ${missingRequiredFields.join(", ")}`
    }
  ];
  const status = checks.some((check) => check.label !== "Required payload fields" && check.tone === "warn")
    ? "error"
    : checks.some((check) => check.tone === "warn")
      ? "review"
      : "ready";

  return {
    status,
    toolName,
    requiredFields,
    checks,
    summary: status === "ready" ? `${toolName} contract is ready for local review.` : `${toolName} contract needs review.`,
    privacyNote: "Local MCP validation only; manifests and payloads stay in the browser."
  };
}

function parseJson(value: string): { ok: true; value: unknown; error: "" } | { ok: false; value: null; error: string } {
  try {
    return { ok: true, value: JSON.parse(value), error: "" };
  } catch (error) {
    return { ok: false, value: null, error: error instanceof Error ? error.message : "Invalid JSON." };
  }
}

function getFirstTool(value: unknown): McpManifestToolShape | undefined {
  if (!isObjectRecord(value) || !Array.isArray(value.tools)) return undefined;
  const [tool] = value.tools;
  return isObjectRecord(tool) ? (tool as McpManifestToolShape) : undefined;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
