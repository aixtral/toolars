export type DiffCheckerLineType = "added" | "removed" | "unchanged";

export interface DiffCheckerInput {
  original: string;
  revised: string;
}

export interface DiffCheckerLine {
  type: DiffCheckerLineType;
  content: string;
  lineNumber: number;
}

export interface DiffCheckerStats {
  added: number;
  removed: number;
  unchanged: number;
  totalChanges: number;
}

export interface DiffCheckerResult {
  success: boolean;
  lines: DiffCheckerLine[];
  output: string;
  stats: DiffCheckerStats;
  error?: string;
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local text comparison only; drafts stay in the browser.";

export function compareTextVersions(input: DiffCheckerInput): DiffCheckerResult {
  try {
    const originalLines = splitTextLines(input.original);
    const revisedLines = splitTextLines(input.revised);
    const commonLines = computeLcs(originalLines, revisedLines);
    const lines: DiffCheckerLine[] = [];
    let originalIndex = 0;
    let revisedIndex = 0;
    let originalLineNumber = 1;
    let revisedLineNumber = 1;

    for (const commonLine of commonLines) {
      while (originalIndex < originalLines.length && originalLines[originalIndex] !== commonLine) {
        lines.push({ type: "removed", content: originalLines[originalIndex], lineNumber: originalLineNumber });
        originalIndex += 1;
        originalLineNumber += 1;
      }

      while (revisedIndex < revisedLines.length && revisedLines[revisedIndex] !== commonLine) {
        lines.push({ type: "added", content: revisedLines[revisedIndex], lineNumber: revisedLineNumber });
        revisedIndex += 1;
        revisedLineNumber += 1;
      }

      lines.push({ type: "unchanged", content: commonLine, lineNumber: revisedLineNumber });
      originalIndex += 1;
      revisedIndex += 1;
      originalLineNumber += 1;
      revisedLineNumber += 1;
    }

    while (originalIndex < originalLines.length) {
      lines.push({ type: "removed", content: originalLines[originalIndex], lineNumber: originalLineNumber });
      originalIndex += 1;
      originalLineNumber += 1;
    }

    while (revisedIndex < revisedLines.length) {
      lines.push({ type: "added", content: revisedLines[revisedIndex], lineNumber: revisedLineNumber });
      revisedIndex += 1;
      revisedLineNumber += 1;
    }

    const stats = summarizeDiffCheckerLines(lines);

    return {
      success: true,
      lines,
      output: lines.map(formatDiffCheckerLine).join("\n"),
      stats,
      summary: `${stats.totalChanges.toLocaleString("en-US")} line ${stats.totalChanges === 1 ? "change" : "changes"} found.`,
      privacyNote
    };
  } catch (error) {
    return {
      success: false,
      lines: [],
      output: "",
      stats: { added: 0, removed: 0, unchanged: 0, totalChanges: 0 },
      error: error instanceof Error ? error.message : "Failed to compare text.",
      summary: "Text diff failed.",
      privacyNote
    };
  }
}

function splitTextLines(value: string): string[] {
  return value === "" ? [] : value.split("\n");
}

function summarizeDiffCheckerLines(lines: DiffCheckerLine[]): DiffCheckerStats {
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

function formatDiffCheckerLine(line: DiffCheckerLine): string {
  if (line.type === "added") return `+ ${line.content}`;
  if (line.type === "removed") return `- ${line.content}`;
  return `  ${line.content}`;
}

function computeLcs(left: string[], right: string[]): string[] {
  const dp: number[][] = Array.from({ length: left.length + 1 }, () => new Array(right.length + 1).fill(0));

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      dp[i][j] = left[i - 1] === right[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result: string[] = [];
  let i = left.length;
  let j = right.length;

  while (i > 0 && j > 0) {
    if (left[i - 1] === right[j - 1]) {
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
