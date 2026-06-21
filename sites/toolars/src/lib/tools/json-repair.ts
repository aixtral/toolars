export interface JsonRepairResult {
  success: boolean;
  data?: unknown;
  error?: string;
  fixes: JsonFix[];
  formatted?: string;
}

export interface JsonFix {
  type: string;
  description: string;
}

export function repairJson(input: string): JsonRepairResult {
  const fixes: JsonFix[] = [];
  let repaired = input.trim();

  try {
    const data = JSON.parse(repaired);
    return {
      success: true,
      data,
      fixes,
      formatted: JSON.stringify(data, null, 2)
    };
  } catch {
    repaired = applyRepairs(repaired, fixes);
  }

  try {
    const data = JSON.parse(repaired);
    return {
      success: true,
      data,
      fixes,
      formatted: JSON.stringify(data, null, 2)
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse JSON",
      fixes
    };
  }
}

function applyRepairs(input: string, fixes: JsonFix[]): string {
  let repaired = input;

  const commentPattern = /\/\*[\s\S]*?\*\/|\/\/.*$/gm;
  if (commentPattern.test(repaired)) {
    repaired = repaired.replace(commentPattern, "");
    fixes.push({ type: "remove_comments", description: "Removed JavaScript-style comments" });
  }

  if (repaired.includes("'")) {
    repaired = replaceSingleQuotedStrings(repaired);
    fixes.push({ type: "single_quotes", description: "Replaced single quotes with double quotes" });
  }

  const unquotedKeyPattern = /([{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)(\s*:)/g;
  if (unquotedKeyPattern.test(repaired)) {
    repaired = repaired.replace(unquotedKeyPattern, '$1"$2"$3');
    fixes.push({ type: "unquoted_keys", description: "Added quotes around unquoted object keys" });
  }

  const trailingCommaPattern = /,\s*([\]}])/g;
  if (trailingCommaPattern.test(repaired)) {
    repaired = repaired.replace(trailingCommaPattern, "$1");
    fixes.push({ type: "trailing_commas", description: "Removed trailing commas" });
  }

  if (/\bundefined\b/.test(repaired)) {
    repaired = repaired.replace(/\bundefined\b/g, "null");
    fixes.push({ type: "undefined_values", description: "Replaced undefined with null" });
  }

  if (/\bNaN\b/.test(repaired)) {
    repaired = repaired.replace(/\bNaN\b/g, "null");
    fixes.push({ type: "nan_values", description: "Replaced NaN with null" });
  }

  if (/\bInfinity\b/.test(repaired)) {
    repaired = repaired.replace(/\bInfinity\b/g, "null");
    fixes.push({ type: "infinity_values", description: "Replaced Infinity with null" });
  }

  return balanceBrackets(fixUnescapedNewlines(repaired), fixes);
}

function replaceSingleQuotedStrings(input: string): string {
  let result = "";
  let inString = false;
  let quote = "";
  let escaped = false;

  for (const char of input) {
    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escaped = true;
      continue;
    }

    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      quote = char;
      result += char === "'" ? '"' : char;
      continue;
    }

    if (inString && char === quote) {
      inString = false;
      result += quote === "'" ? '"' : char;
      quote = "";
      continue;
    }

    if (inString && quote === "'" && char === '"') {
      result += '\\"';
      continue;
    }

    result += char;
  }

  return result;
}

function fixUnescapedNewlines(input: string): string {
  let result = "";
  let inString = false;
  let escaped = false;

  for (const char of input) {
    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }

    if (inString && char === "\n") {
      result += "\\n";
      continue;
    }

    if (inString && char === "\r") {
      result += "\\r";
      continue;
    }

    result += char;
  }

  return result;
}

function balanceBrackets(input: string, fixes: JsonFix[]): string {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (const char of input) {
    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{" || char === "[") stack.push(char);
    if (char === "}" && stack.at(-1) === "{") stack.pop();
    if (char === "]" && stack.at(-1) === "[") stack.pop();
  }

  let result = input;
  while (stack.length > 0) {
    const open = stack.pop();
    if (open === "{") {
      result += "}";
      fixes.push({ type: "missing_brace", description: "Added missing closing brace" });
    }
    if (open === "[") {
      result += "]";
      fixes.push({ type: "missing_bracket", description: "Added missing closing bracket" });
    }
  }
  return result;
}
