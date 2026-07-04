export interface SchemaValidatorInput {
  schemaInput: string;
  dataInput: string;
}

export interface SchemaValidationIssue {
  path: string;
  type: "required" | "type" | "format";
  message: string;
}

export interface SchemaParseError {
  type: "invalid-schema-json" | "invalid-data-json";
  message: string;
}

export interface SchemaValidatorResult {
  success: boolean;
  valid: boolean;
  errors: SchemaValidationIssue[];
  parseError?: SchemaParseError;
  stats: {
    checks: number;
    failures: number;
  };
  privacyNote: string;
}

const privacyNote = "Schema validation runs locally in the browser.";

export function validateJsonSchemaDocument({ schemaInput, dataInput }: SchemaValidatorInput): SchemaValidatorResult {
  const schemaParse = parseJson(schemaInput, "invalid-schema-json");
  if (!schemaParse.success) return failure(schemaParse.error);

  const dataParse = parseJson(dataInput, "invalid-data-json");
  if (!dataParse.success) return failure(dataParse.error);

  const errors: SchemaValidationIssue[] = [];
  const checks = validateValue(dataParse.value, schemaParse.value as Record<string, unknown>, "$", errors);

  return {
    success: true,
    valid: errors.length === 0,
    errors,
    stats: { checks, failures: errors.length },
    privacyNote
  };
}

function failure(parseError: SchemaParseError): SchemaValidatorResult {
  return {
    success: false,
    valid: false,
    errors: [],
    parseError,
    stats: { checks: 0, failures: 0 },
    privacyNote
  };
}

function parseJson(input: string, type: SchemaParseError["type"]): { success: true; value: unknown } | { success: false; error: SchemaParseError } {
  try {
    return { success: true, value: JSON.parse(input) as unknown };
  } catch (error) {
    return {
      success: false,
      error: { type, message: error instanceof Error ? error.message : "Invalid JSON." }
    };
  }
}

function validateValue(value: unknown, schema: Record<string, unknown>, path: string, errors: SchemaValidationIssue[]): number {
  let checks = 0;

  if (typeof schema.type === "string") {
    checks += 1;
    if (!matchesType(value, schema.type)) {
      errors.push({ path, type: "type", message: `Expected ${schema.type}.` });
    }
  }

  if (schema.type === "object" && value && typeof value === "object" && !Array.isArray(value)) {
    const data = value as Record<string, unknown>;
    const required = Array.isArray(schema.required) ? schema.required : [];
    for (const key of required) {
      checks += 1;
      if (typeof key === "string" && !(key in data)) {
        errors.push({ path: `${path}.${key}`, type: "required", message: `${key} is required.` });
      }
    }

    const properties = schema.properties && typeof schema.properties === "object" ? (schema.properties as Record<string, Record<string, unknown>>) : {};
    for (const [key, childSchema] of Object.entries(properties)) {
      if (key in data) checks += validateValue(data[key], childSchema, `${path}.${key}`, errors);
    }
  }

  if (typeof value === "string" && schema.format === "email") {
    checks += 1;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push({ path, type: "format", message: "Expected an email address." });
    }
  }

  return checks;
}

function matchesType(value: unknown, type: string): boolean {
  if (type === "array") return Array.isArray(value);
  if (type === "object") return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  return typeof value === type;
}
