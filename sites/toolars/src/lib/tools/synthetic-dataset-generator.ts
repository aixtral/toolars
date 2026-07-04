export interface SyntheticDatasetGeneratorInput {
  scenario: string;
  fields: string;
  count: number;
}

export interface SyntheticDatasetGeneratorResult {
  records: Record<string, string | number | boolean>[];
  jsonl: string;
  summary: string;
  warnings: string[];
  privacyNote: string;
}

interface FixtureField {
  name: string;
  type: string;
  values: string[];
}

export function generateSyntheticDataset(input: SyntheticDatasetGeneratorInput): SyntheticDatasetGeneratorResult {
  const fields = parseFixtureFields(input.fields);
  const count = Math.max(1, Math.min(input.count || 1, 100));
  const records = Array.from({ length: count }, (_, index) => {
    const rowNumber = index + 1;
    return Object.fromEntries(fields.map((field) => [field.name, fixtureValue(field, rowNumber)]));
  });

  return {
    records,
    jsonl: records.map((record) => JSON.stringify(record)).join("\n"),
    summary: `${count} fixture rows prepared for ${input.scenario.trim() || "AI workflow tests"}.`,
    warnings: fields.length ? [] : ["Add at least one fixture field before export."],
    privacyNote: "Synthetic fixture rows are generated locally before use in AI workflow tests."
  };
}

function parseFixtureFields(value: string): FixtureField[] {
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

function fixtureValue(field: FixtureField, rowNumber: number): string | number | boolean {
  if (field.type === "number" || field.type === "integer") return rowNumber;
  if (field.type === "boolean") return rowNumber % 2 === 1;
  if (field.type === "enum") return field.values[(rowNumber - 1) % field.values.length] ?? "label";
  return `${field.name}_${rowNumber}`;
}
