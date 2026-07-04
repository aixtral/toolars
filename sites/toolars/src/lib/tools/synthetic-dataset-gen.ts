export interface SyntheticDatasetInput {
  topic: string;
  schema: string;
  rows: number;
}

export interface SyntheticDatasetResult {
  records: Record<string, string | number | boolean>[];
  json: string;
  csv: string;
  summary: string;
  reviewChecklist: string[];
  privacyNote: string;
}

interface DatasetField {
  name: string;
  type: string;
  values: string[];
}

export function buildSyntheticDataset(input: SyntheticDatasetInput): SyntheticDatasetResult {
  const fields = parseDatasetFields(input.schema);
  const rowCount = Math.max(1, Math.min(input.rows || 1, 100));
  const records = Array.from({ length: rowCount }, (_, index) => {
    const rowNumber = index + 1;
    return Object.fromEntries(fields.map((field) => [field.name, syntheticValue(field, rowNumber)]));
  });
  const topic = input.topic.trim() || "dataset";

  return {
    records,
    json: JSON.stringify(records, null, 2),
    csv: toCsv(records, fields.map((field) => field.name)),
    summary: `${rowCount} synthetic rows prepared for ${topic}.`,
    reviewChecklist: [
      "Review synthetic fields before using them as eval fixtures.",
      "Confirm no production personal data was pasted into the schema."
    ],
    privacyNote: "Synthetic dataset rows are generated locally and are deterministic for review."
  };
}

function parseDatasetFields(value: string): DatasetField[] {
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

function syntheticValue(field: DatasetField, rowNumber: number): string | number | boolean {
  if (field.type === "number" || field.type === "integer") return rowNumber * 10;
  if (field.type === "boolean") return rowNumber % 2 === 1;
  if (field.type === "enum") return field.values[(rowNumber - 1) % field.values.length] ?? "sample";
  return `${field.name}_${rowNumber}`;
}

function toCsv(records: Record<string, string | number | boolean>[], headers: string[]): string {
  return [
    headers.join(","),
    ...records.map((record) => headers.map((header) => String(record[header] ?? "")).join(","))
  ].join("\n");
}
