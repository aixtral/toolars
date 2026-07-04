export type JsonToCsvErrorType = "empty-input" | "invalid-json" | "input-not-array" | "items-not-objects" | "conversion-failed";

export interface JsonToCsvInput {
  input: string;
  delimiter: string;
}

export interface JsonToCsvError {
  type: JsonToCsvErrorType;
  message: string;
}

export interface JsonToCsvStats {
  rows: number;
  columns: number;
  inputCharacters: number;
  outputCharacters: number;
}

export interface JsonToCsvResult {
  success: boolean;
  output: string;
  headers: string[];
  error?: JsonToCsvError;
  stats: JsonToCsvStats;
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local JSON export only; records stay in the browser.";

export function convertJsonToCsv(input: JsonToCsvInput): JsonToCsvResult {
  if (!input.input.trim()) {
    return buildJsonToCsvError(input, "empty-input", "JSON input is empty.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(input.input);
  } catch {
    return buildJsonToCsvError(input, "invalid-json", "Input is not valid JSON.");
  }

  if (!Array.isArray(parsed)) {
    return buildJsonToCsvError(input, "input-not-array", "Input must be a JSON array.");
  }

  if (parsed.length === 0) {
    return {
      success: true,
      output: "",
      headers: [],
      stats: {
        rows: 0,
        columns: 0,
        inputCharacters: input.input.length,
        outputCharacters: 0
      },
      summary: "0 JSON records converted into CSV rows.",
      privacyNote
    };
  }

  if (!parsed.every(isPlainRecord)) {
    return buildJsonToCsvError(input, "items-not-objects", "All JSON array items must be objects.");
  }

  try {
    const records = parsed as Record<string, unknown>[];
    const headers = collectHeaders(records);
    const output = [
      headers.map((header) => escapeCsvField(header, input.delimiter)).join(input.delimiter),
      ...records.map((record) =>
        headers.map((header) => escapeCsvField(formatValue(record[header]), input.delimiter)).join(input.delimiter)
      )
    ].join("\n");

    return {
      success: true,
      output,
      headers,
      stats: {
        rows: records.length,
        columns: headers.length,
        inputCharacters: input.input.length,
        outputCharacters: output.length
      },
      summary: `${records.length.toLocaleString("en-US")} JSON records converted into CSV rows.`,
      privacyNote
    };
  } catch (error) {
    return buildJsonToCsvError(input, "conversion-failed", error instanceof Error ? error.message : "JSON to CSV conversion failed.");
  }
}

function collectHeaders(records: Record<string, unknown>[]): string[] {
  const headers = new Set<string>();

  for (const record of records) {
    for (const key of Object.keys(record)) {
      headers.add(key);
    }
  }

  return [...headers];
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function escapeCsvField(value: string, delimiter: string): string {
  if (value.includes(delimiter) || value.includes("\"") || value.includes("\n") || value.includes("\r")) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }

  return value;
}

function buildJsonToCsvError(input: JsonToCsvInput, type: JsonToCsvErrorType, message: string): JsonToCsvResult {
  return {
    success: false,
    output: "",
    headers: [],
    error: { type, message },
    stats: {
      rows: 0,
      columns: 0,
      inputCharacters: input.input.length,
      outputCharacters: 0
    },
    summary: "JSON to CSV conversion failed.",
    privacyNote
  };
}
