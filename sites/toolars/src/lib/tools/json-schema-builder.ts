export type JsonSchemaFieldType = "string" | "number" | "integer" | "boolean" | "array" | "object";

export interface JsonSchemaField {
  name: string;
  type: JsonSchemaFieldType;
  required?: boolean;
  description?: string;
  format?: string;
  minimum?: number;
  maximum?: number;
}

export interface JsonSchemaBuilderInput {
  title?: string;
  fields: JsonSchemaField[];
}

export interface JsonSchemaBuilderError {
  type: "empty-field" | "duplicate-field";
  message: string;
}

export interface JsonSchemaProperty {
  type: JsonSchemaFieldType;
  description?: string;
  format?: string;
  minimum?: number;
  maximum?: number;
}

export interface BuiltJsonSchema {
  $schema: string;
  title?: string;
  type: "object";
  properties: Record<string, JsonSchemaProperty>;
  required?: string[];
}

export interface JsonSchemaBuilderResult {
  success: boolean;
  schema: BuiltJsonSchema;
  output: string;
  errors: JsonSchemaBuilderError[];
  warnings: string[];
  privacyNote: string;
}

const privacyNote = "JSON Schema rows are built locally in the browser.";

export function buildJsonSchema({ title, fields }: JsonSchemaBuilderInput): JsonSchemaBuilderResult {
  const errors = validateFields(fields);
  const schema: BuiltJsonSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    ...(title?.trim() ? { title: title.trim() } : {}),
    type: "object",
    properties: {}
  };

  if (errors.length === 0) {
    const required: string[] = [];
    for (const field of fields) {
      const name = field.name.trim();
      schema.properties[name] = {
        type: field.type,
        ...(field.description ? { description: field.description } : {}),
        ...(field.format ? { format: field.format } : {}),
        ...(field.minimum !== undefined ? { minimum: field.minimum } : {}),
        ...(field.maximum !== undefined ? { maximum: field.maximum } : {})
      };
      if (field.required) required.push(name);
    }
    if (required.length) schema.required = required;
  }

  return {
    success: errors.length === 0,
    schema,
    output: errors.length === 0 ? JSON.stringify(schema, null, 2) : "",
    errors,
    warnings: fields.length > 12 ? ["Large schemas should be reviewed for nesting and naming consistency."] : [],
    privacyNote
  };
}

function validateFields(fields: JsonSchemaField[]): JsonSchemaBuilderError[] {
  const errors: JsonSchemaBuilderError[] = [];
  const seen = new Set<string>();
  for (const field of fields) {
    const name = field.name.trim();
    if (!name) {
      errors.push({ type: "empty-field", message: "Field names are required." });
      continue;
    }
    if (seen.has(name)) {
      errors.push({ type: "duplicate-field", message: `Duplicate field: ${name}` });
      continue;
    }
    seen.add(name);
  }
  return errors;
}
