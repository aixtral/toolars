export type JsonDiffType = "added" | "removed" | "changed";
export type JsonDiffErrorType = "invalid-json" | "comparison-failed";

export interface JsonDiffEntry {
  path: string;
  type: JsonDiffType;
  oldValue?: unknown;
  newValue?: unknown;
}

export interface JsonDiffInput {
  original: string;
  modified: string;
}

export interface JsonDiffError {
  type: JsonDiffErrorType;
  message: string;
}

export interface JsonDiffStats {
  added: number;
  removed: number;
  changed: number;
  total: number;
}

export interface JsonDiffResult {
  success: boolean;
  differences: JsonDiffEntry[];
  output: string;
  error?: JsonDiffError;
  stats: JsonDiffStats;
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local JSON comparison only; payloads stay in the browser.";

export function diffJsonValues(original: unknown, modified: unknown, path = "$"): JsonDiffEntry[] {
  if (Object.is(original, modified)) return [];

  if (
    typeof original !== typeof modified ||
    original === null ||
    modified === null ||
    typeof original !== "object" ||
    Array.isArray(original) !== Array.isArray(modified)
  ) {
    return [{ path, type: "changed", oldValue: original, newValue: modified }];
  }

  const originalRecord = original as Record<string, unknown>;
  const modifiedRecord = modified as Record<string, unknown>;
  const entries: JsonDiffEntry[] = [];
  const keys = new Set([...Object.keys(originalRecord), ...Object.keys(modifiedRecord)]);

  for (const key of keys) {
    const childPath = Array.isArray(original) ? `${path}[${key}]` : `${path}.${key}`;

    if (!(key in originalRecord)) {
      entries.push({ path: childPath, type: "added", newValue: modifiedRecord[key] });
      continue;
    }

    if (!(key in modifiedRecord)) {
      entries.push({ path: childPath, type: "removed", oldValue: originalRecord[key] });
      continue;
    }

    entries.push(...diffJsonValues(originalRecord[key], modifiedRecord[key], childPath));
  }

  return entries;
}

export function compareJsonPayloads(input: JsonDiffInput): JsonDiffResult {
  let original: unknown;
  let modified: unknown;

  try {
    original = JSON.parse(input.original);
    modified = JSON.parse(input.modified);
  } catch (error) {
    return buildJsonDiffError("invalid-json", error instanceof Error ? error.message : "Input is not valid JSON.");
  }

  try {
    const differences = diffJsonValues(original, modified);
    const stats = summarizeJsonDiff(differences);
    const output = differences.map(formatJsonDiffEntry).join("\n");
    const pathLabel = stats.total === 1 ? "path" : "paths";

    return {
      success: true,
      differences,
      output,
      stats,
      summary: stats.total === 0 ? "No JSON differences found." : `${stats.total.toLocaleString("en-US")} JSON ${pathLabel} changed.`,
      privacyNote
    };
  } catch (error) {
    return buildJsonDiffError(
      "comparison-failed",
      error instanceof Error ? error.message : "JSON comparison failed."
    );
  }
}

function summarizeJsonDiff(differences: JsonDiffEntry[]): JsonDiffStats {
  const added = differences.filter((entry) => entry.type === "added").length;
  const removed = differences.filter((entry) => entry.type === "removed").length;
  const changed = differences.filter((entry) => entry.type === "changed").length;

  return {
    added,
    removed,
    changed,
    total: added + removed + changed
  };
}

function formatJsonDiffEntry(entry: JsonDiffEntry): string {
  if (entry.type === "added") return `+ ${entry.path}: ${formatJsonValue(entry.newValue)}`;
  if (entry.type === "removed") return `- ${entry.path}: ${formatJsonValue(entry.oldValue)}`;
  return `~ ${entry.path}: ${formatJsonValue(entry.oldValue)} -> ${formatJsonValue(entry.newValue)}`;
}

function formatJsonValue(value: unknown): string {
  return JSON.stringify(value);
}

function buildJsonDiffError(type: JsonDiffErrorType, message: string): JsonDiffResult {
  return {
    success: false,
    differences: [],
    output: "",
    error: { type, message },
    stats: {
      added: 0,
      removed: 0,
      changed: 0,
      total: 0
    },
    summary: "JSON diff failed.",
    privacyNote
  };
}
