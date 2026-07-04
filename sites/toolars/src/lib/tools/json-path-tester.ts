export interface JsonPathTesterInput {
  jsonInput: string;
  path: string;
}

export interface JsonPathTesterError {
  type: "invalid-json" | "invalid-path" | "query-failed";
  message: string;
}

export interface JsonPathTesterResult {
  success: boolean;
  matches: unknown[];
  output: string;
  error?: JsonPathTesterError;
  stats: {
    matchCount: number;
    inputLength: number;
  };
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local JSONPath testing only; payloads stay in the browser.";

export function runJsonPathQuery(input: JsonPathTesterInput): JsonPathTesterResult {
  let json: unknown;
  try {
    json = JSON.parse(input.jsonInput);
  } catch (error) {
    return buildJsonPathError("invalid-json", error instanceof Error ? error.message : "Input is not valid JSON.", input);
  }

  try {
    const matches = evaluateJsonPath(json, input.path.trim());
    return {
      success: true,
      matches,
      output: JSON.stringify(matches, null, 2),
      stats: {
        matchCount: matches.length,
        inputLength: input.jsonInput.length
      },
      summary: `${matches.length.toLocaleString("en-US")} matches.`,
      privacyNote
    };
  } catch (error) {
    return buildJsonPathError("invalid-path", error instanceof Error ? error.message : "Invalid JSONPath expression.", input);
  }
}

function evaluateJsonPath(json: unknown, path: string): unknown[] {
  if (path === "$") return [json];
  if (path.startsWith("$..")) return collectRecursiveProperty(json, path.slice(3));
  if (!path.startsWith("$.")) throw new Error("JSONPath must start with $.");

  return splitSegments(path.slice(2)).reduce<unknown[]>((items, segment) => items.flatMap((item) => applySegment(item, segment)), [json]);
}

function splitSegments(path: string): string[] {
  const segments: string[] = [];
  let current = "";
  let bracketDepth = 0;

  for (const char of path) {
    if (char === "[" && bracketDepth++ >= 0) current += char;
    else if (char === "]" && bracketDepth-- > 0) current += char;
    else if (char === "." && bracketDepth === 0) {
      segments.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  if (current) segments.push(current);
  return segments;
}

function applySegment(item: unknown, segment: string): unknown[] {
  const selectorMatch = segment.match(/^([A-Za-z_$][\w$-]*)(?:\[(.+)\])?$/);
  if (!selectorMatch || !item || typeof item !== "object") return [];

  const value = (item as Record<string, unknown>)[selectorMatch[1]];
  const selector = selectorMatch[2];
  if (!selector) return value === undefined ? [] : [value];
  if (!Array.isArray(value)) return [];

  if (selector === "*") return value;
  if (/^\d+$/.test(selector)) return value[Number(selector)] === undefined ? [] : [value[Number(selector)]];

  const predicate = selector.match(/^\?\(@\.([A-Za-z_$][\w$-]*)(?:\s*(<|>|<=|>=|==|!=)\s*(.+))?\)$/);
  if (!predicate) return [];

  return value.filter((entry) => matchesPredicate(entry, predicate[1], predicate[2], predicate[3]));
}

function matchesPredicate(entry: unknown, property: string, operator?: string, rawExpected?: string): boolean {
  if (!entry || typeof entry !== "object") return false;
  const actual = (entry as Record<string, unknown>)[property];
  if (!operator) return actual !== undefined && actual !== null && actual !== false;

  const expected = parsePredicateValue(rawExpected ?? "");
  if (operator === "<") return Number(actual) < Number(expected);
  if (operator === ">") return Number(actual) > Number(expected);
  if (operator === "<=") return Number(actual) <= Number(expected);
  if (operator === ">=") return Number(actual) >= Number(expected);
  if (operator === "==") return actual === expected;
  if (operator === "!=") return actual !== expected;
  return false;
}

function parsePredicateValue(value: string): unknown {
  const trimmed = value.trim();
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed.replace(/^['"]|['"]$/g, "");
}

function collectRecursiveProperty(value: unknown, property: string): unknown[] {
  const matches: unknown[] = [];

  const visit = (item: unknown) => {
    if (Array.isArray(item)) {
      item.forEach(visit);
      return;
    }
    if (!item || typeof item !== "object") return;
    const record = item as Record<string, unknown>;
    if (Object.prototype.hasOwnProperty.call(record, property)) {
      matches.push(record[property]);
    }
    Object.values(record).forEach(visit);
  };

  visit(value);
  return matches;
}

function buildJsonPathError(type: JsonPathTesterError["type"], message: string, input: JsonPathTesterInput): JsonPathTesterResult {
  return {
    success: false,
    matches: [],
    output: "",
    error: { type, message },
    stats: {
      matchCount: 0,
      inputLength: input.jsonInput.length
    },
    summary: "JSONPath query failed.",
    privacyNote
  };
}
