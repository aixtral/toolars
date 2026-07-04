export type FunctionParameterType = "string" | "number" | "integer" | "boolean" | "array" | "object";

export interface FunctionCallBuilderInput {
  name: string;
  description: string;
  parameterRows: string;
}

export interface FunctionCallParameter {
  type: FunctionParameterType;
  description?: string;
}

export interface FunctionCallToolSchema {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, FunctionCallParameter>;
      required: string[];
    };
  };
}

export interface FunctionCallBuilderResult {
  success: boolean;
  schema: FunctionCallToolSchema;
  output: string;
  errors: string[];
  warnings: string[];
  privacyNote: string;
}

const supportedTypes = new Set<FunctionParameterType>(["string", "number", "integer", "boolean", "array", "object"]);

export function buildFunctionCallSpec(input: FunctionCallBuilderInput): FunctionCallBuilderResult {
  const functionName = normalizeFunctionName(input.name);
  const errors: string[] = [];
  const warnings: string[] = [];
  const properties: Record<string, FunctionCallParameter> = {};
  const required: string[] = [];
  const seen = new Set<string>();

  if (!functionName) {
    errors.push("Function name is required.");
  }

  for (const row of parseRows(input.parameterRows)) {
    const [rawName = "", rawType = "string", requiredFlag = "", ...descriptionParts] = row.split(":");
    const name = normalizePropertyName(rawName);
    const type = normalizeType(rawType);
    const description = descriptionParts.join(":").trim();

    if (!name) {
      errors.push("Parameter rows must start with a field name.");
      continue;
    }
    if (seen.has(name)) {
      errors.push(`Duplicate parameter: ${name}`);
      continue;
    }
    seen.add(name);
    if (rawType.trim() && !supportedTypes.has(rawType.trim() as FunctionParameterType)) {
      warnings.push(`Unsupported type "${rawType.trim()}" was mapped to string.`);
    }

    properties[name] = {
      type,
      ...(description ? { description } : {})
    };
    if (/^(required|true|yes)$/i.test(requiredFlag.trim())) {
      required.push(name);
    }
  }

  if (Object.keys(properties).length === 0) {
    warnings.push("Add at least one parameter before shipping this schema.");
  }

  const schema: FunctionCallToolSchema = {
    type: "function",
    function: {
      name: functionName || "generated_function",
      description: input.description.trim() || "Describe what this function does.",
      parameters: {
        type: "object",
        properties,
        required
      }
    }
  };

  return {
    success: errors.length === 0,
    schema,
    output: JSON.stringify(schema, null, 2),
    errors,
    warnings,
    privacyNote: "Function schemas are drafted locally in the browser before provider handoff."
  };
}

function parseRows(value: string): string[] {
  return value.split(/\r?\n/).map((row) => row.trim()).filter(Boolean);
}

function normalizeFunctionName(value: string): string {
  return value.trim().replace(/[^\w]+/g, "_").replace(/^_+|_+$/g, "");
}

function normalizePropertyName(value: string): string {
  return value.trim().replace(/[^\w]+/g, "_").replace(/^_+|_+$/g, "");
}

function normalizeType(value: string): FunctionParameterType {
  const type = value.trim() as FunctionParameterType;
  return supportedTypes.has(type) ? type : "string";
}
