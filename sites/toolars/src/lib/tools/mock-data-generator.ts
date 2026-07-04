export interface MockDataGeneratorInput {
  fields: string;
  rows: number;
}

export interface MockDataGeneratorResult {
  records: Record<string, string | number | boolean>[];
  json: string;
  csv: string;
  warnings: string[];
  privacyNote: string;
}

interface ParsedField {
  name: string;
  type: string;
  values: string[];
}

export function generateMockData(input: MockDataGeneratorInput): MockDataGeneratorResult {
  const fields = parseFields(input.fields);
  const rowCount = Math.max(1, Math.min(input.rows || 1, 50));
  const records = Array.from({ length: rowCount }, (_, index) => {
    const rowNumber = index + 1;
    return Object.fromEntries(fields.map((field) => [field.name, valueForField(field, rowNumber)]));
  });

  return {
    records,
    json: JSON.stringify(records, null, 2),
    csv: toCsv(records, fields.map((field) => field.name)),
    warnings: input.rows > 50 ? ["Rows are capped at 50 for browser review."] : [],
    privacyNote: "Mock data is generated locally and should not be used as real user data."
  };
}

function parseFields(value: string): ParsedField[] {
  return value.split(/\r?\n/).map((row) => row.trim()).filter(Boolean).map((row) => {
    const [name = "", type = "string"] = row.split(":");
    const enumMatch = type.match(/^enum\((.*?)\)$/i);
    return {
      name: name.trim() || "field",
      type: enumMatch ? "enum" : type.trim().toLowerCase(),
      values: enumMatch ? enumMatch[1].split("|").map((item) => item.trim()).filter(Boolean) : []
    };
  });
}

function valueForField(field: ParsedField, rowNumber: number): string | number | boolean {
  if (field.type === "number" || field.type === "integer") return rowNumber;
  if (field.type === "boolean") return rowNumber % 2 === 1;
  if (field.type === "email") return `user${rowNumber}@example.com`;
  if (field.type === "enum") return field.values[(rowNumber - 1) % field.values.length] ?? "value";
  return `${field.name}_${rowNumber}`;
}

function toCsv(records: Record<string, string | number | boolean>[], headers: string[]): string {
  return [
    headers.join(","),
    ...records.map((record) => headers.map((header) => String(record[header] ?? "")).join(","))
  ].join("\n");
}
