export type YamlIssueSeverity = "error" | "warning";
export type YamlIssueType = "empty-input" | "tab" | "odd-indentation" | "trailing-whitespace" | "long-line" | "empty-list-item";

export interface YamlValidatorInput {
  input: string;
}

export interface YamlValidationIssue {
  line: number;
  column: number;
  message: string;
  severity: YamlIssueSeverity;
  type: YamlIssueType;
}

export interface YamlValidatorStats {
  lines: number;
  keys: number;
  depth: number;
}

export interface YamlValidatorResult {
  success: boolean;
  valid: boolean;
  errors: YamlValidationIssue[];
  warnings: YamlValidationIssue[];
  stats: YamlValidatorStats;
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local YAML validation only; configuration text stays in the browser.";

export function validateYamlDocument({ input }: YamlValidatorInput): YamlValidatorResult {
  const normalized = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const content = normalized.endsWith("\n") ? normalized.slice(0, -1) : normalized;
  const lines = content.length > 0 ? content.split("\n") : [""];
  const errors: YamlValidationIssue[] = [];
  const warnings: YamlValidationIssue[] = [];
  let keyCount = 0;
  let maxDepth = 0;

  if (!input.trim()) {
    errors.push({
      line: 1,
      column: 1,
      message: "YAML input is empty.",
      severity: "error",
      type: "empty-input"
    });
  }

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] ?? "";
    const trimmed = line.trim();
    const lineNumber = index + 1;

    if (trimmed === "" || trimmed.startsWith("#")) continue;

    const tabColumn = line.indexOf("\t");
    if (tabColumn >= 0) {
      errors.push({
        line: lineNumber,
        column: tabColumn + 1,
        message: "Tabs are not valid YAML indentation. Use spaces instead.",
        severity: "error",
        type: "tab"
      });
    }

    const leadingSpaces = line.match(/^(\s*)/)?.[1].replace(/\t/g, "  ").length ?? 0;
    if (leadingSpaces % 2 !== 0 && !trimmed.startsWith("-")) {
      warnings.push({
        line: lineNumber,
        column: 1,
        message: "Odd indentation can make YAML structure hard to review.",
        severity: "warning",
        type: "odd-indentation"
      });
    }

    maxDepth = Math.max(maxDepth, Math.floor(leadingSpaces / 2));

    if (/^\s*[^:#\s][^:]*:\s*.*$/.test(line)) {
      keyCount += 1;
    }

    if (/^\s*-\s*$/.test(line)) {
      errors.push({
        line: lineNumber,
        column: leadingSpaces + 1,
        message: "List item is empty.",
        severity: "error",
        type: "empty-list-item"
      });
    }

    if (line !== line.trimEnd()) {
      warnings.push({
        line: lineNumber,
        column: line.length,
        message: "Trailing whitespace can create noisy config diffs.",
        severity: "warning",
        type: "trailing-whitespace"
      });
    }

    if (line.length > 120) {
      warnings.push({
        line: lineNumber,
        column: 121,
        message: "Line is longer than 120 characters.",
        severity: "warning",
        type: "long-line"
      });
    }
  }

  const valid = errors.length === 0;
  const issueSummary =
    errors.length > 0
      ? `${errors.length.toLocaleString("en-US")} blocking YAML issues found.`
      : warnings.length > 0
        ? `No blocking YAML issues; ${warnings.length.toLocaleString("en-US")} warnings found.`
        : "No blocking YAML issues found.";

  return {
    success: valid,
    valid,
    errors,
    warnings,
    stats: {
      lines: lines.length,
      keys: keyCount,
      depth: maxDepth
    },
    summary: issueSummary,
    privacyNote
  };
}
