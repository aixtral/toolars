export type TextDiffLineType = "added" | "removed" | "unchanged";

export interface TextDiffOptions {
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
  trimLines?: boolean;
}

export interface TextDiffInput {
  original: string;
  revised: string;
  options?: TextDiffOptions;
}

export interface TextDiffLine {
  type: TextDiffLineType;
  content: string;
  leftLine: number;
  rightLine: number;
}

export interface TextDiffStats {
  added: number;
  removed: number;
  unchanged: number;
  totalChanges: number;
}

export interface TextDiffResult {
  success: boolean;
  lines: TextDiffLine[];
  output: string;
  stats: TextDiffStats;
  options: Required<TextDiffOptions>;
  error?: string;
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local option-aware text diff only; drafts stay in the browser.";

export function compareTextWithOptions(input: TextDiffInput): TextDiffResult {
  const options = normalizeOptions(input.options);

  try {
    const originalLines = splitTextLines(input.original);
    const revisedLines = splitTextLines(input.revised);
    const commonLines = computeLcs(originalLines, revisedLines, options);
    const lines: TextDiffLine[] = [];
    let originalIndex = 0;
    let revisedIndex = 0;
    let leftLine = 1;
    let rightLine = 1;

    for (const commonLine of commonLines) {
      while (
        originalIndex < originalLines.length &&
        normalizeLine(originalLines[originalIndex], options) !== normalizeLine(commonLine, options)
      ) {
        lines.push({ type: "removed", content: originalLines[originalIndex], leftLine, rightLine: -1 });
        originalIndex += 1;
        leftLine += 1;
      }

      while (
        revisedIndex < revisedLines.length &&
        normalizeLine(revisedLines[revisedIndex], options) !== normalizeLine(commonLine, options)
      ) {
        lines.push({ type: "added", content: revisedLines[revisedIndex], leftLine: -1, rightLine });
        revisedIndex += 1;
        rightLine += 1;
      }

      lines.push({ type: "unchanged", content: commonLine, leftLine, rightLine });
      originalIndex += 1;
      revisedIndex += 1;
      leftLine += 1;
      rightLine += 1;
    }

    while (originalIndex < originalLines.length) {
      lines.push({ type: "removed", content: originalLines[originalIndex], leftLine, rightLine: -1 });
      originalIndex += 1;
      leftLine += 1;
    }

    while (revisedIndex < revisedLines.length) {
      lines.push({ type: "added", content: revisedLines[revisedIndex], leftLine: -1, rightLine });
      revisedIndex += 1;
      rightLine += 1;
    }

    const stats = summarizeTextDiffLines(lines);

    return {
      success: true,
      lines,
      output: lines.map(formatTextDiffLine).join("\n"),
      stats,
      options,
      summary: `${stats.totalChanges.toLocaleString("en-US")} line ${stats.totalChanges === 1 ? "change" : "changes"} found.`,
      privacyNote
    };
  } catch (error) {
    return {
      success: false,
      lines: [],
      output: "",
      stats: { added: 0, removed: 0, unchanged: 0, totalChanges: 0 },
      options,
      error: error instanceof Error ? error.message : "Failed to compare text.",
      summary: "Text diff failed.",
      privacyNote
    };
  }
}

function normalizeOptions(options: TextDiffOptions = {}): Required<TextDiffOptions> {
  return {
    ignoreWhitespace: options.ignoreWhitespace ?? false,
    ignoreCase: options.ignoreCase ?? false,
    trimLines: options.trimLines ?? false
  };
}

function splitTextLines(value: string): string[] {
  return value === "" ? [] : value.split("\n");
}

function normalizeLine(line: string, options: Required<TextDiffOptions>): string {
  let normalized = line;
  if (options.trimLines) normalized = normalized.trim();
  if (options.ignoreWhitespace) normalized = normalized.replace(/\s+/g, " ").trim();
  if (options.ignoreCase) normalized = normalized.toLowerCase();
  return normalized;
}

function summarizeTextDiffLines(lines: TextDiffLine[]): TextDiffStats {
  const added = lines.filter((line) => line.type === "added").length;
  const removed = lines.filter((line) => line.type === "removed").length;
  const unchanged = lines.filter((line) => line.type === "unchanged").length;

  return {
    added,
    removed,
    unchanged,
    totalChanges: added + removed
  };
}

function formatTextDiffLine(line: TextDiffLine): string {
  if (line.type === "added") return `+ ${line.content}`;
  if (line.type === "removed") return `- ${line.content}`;
  return `  ${line.content}`;
}

function computeLcs(
  left: string[],
  right: string[],
  options: Required<TextDiffOptions>
): string[] {
  const dp: number[][] = Array.from({ length: left.length + 1 }, () => new Array(right.length + 1).fill(0));

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      dp[i][j] =
        normalizeLine(left[i - 1], options) === normalizeLine(right[j - 1], options)
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result: string[] = [];
  let i = left.length;
  let j = right.length;

  while (i > 0 && j > 0) {
    if (normalizeLine(left[i - 1], options) === normalizeLine(right[j - 1], options)) {
      result.unshift(left[i - 1]);
      i -= 1;
      j -= 1;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  return result;
}
