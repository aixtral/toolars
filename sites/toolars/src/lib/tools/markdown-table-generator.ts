export interface MarkdownTableGeneratorInput {
  csv: string;
}

export interface MarkdownTableGeneratorResult {
  markdown: string;
  rowCount: number;
  columnCount: number;
  warnings: string[];
  privacyNote: string;
}

export function buildMarkdownTable(input: MarkdownTableGeneratorInput): MarkdownTableGeneratorResult {
  const rows = input.csv.split(/\r?\n/).map((row) => row.trim()).filter(Boolean).map(parseCsvRow);
  const headers = rows[0] ?? [];
  const body = rows.slice(1);
  const columnCount = headers.length;
  const warnings = columnCount === 0 ? ["Add a header row before generating Markdown."] : [];
  const normalizedBody = body.map((row) => normalizeRow(row, columnCount));
  const markdownRows = [
    toMarkdownRow(headers),
    toMarkdownRow(headers.map(() => "---")),
    ...normalizedBody.map(toMarkdownRow)
  ];

  return {
    markdown: columnCount ? markdownRows.join("\n") : "",
    rowCount: body.length,
    columnCount,
    warnings,
    privacyNote: "Markdown tables are generated locally from pasted rows."
  };
}

function parseCsvRow(row: string): string[] {
  return row.split(",").map((cell) => cell.trim());
}

function normalizeRow(row: string[], length: number): string[] {
  return Array.from({ length }, (_, index) => row[index] ?? "");
}

function toMarkdownRow(row: string[]): string {
  return `| ${row.map(escapeMarkdownCell).join(" | ")} |`;
}

function escapeMarkdownCell(value: string): string {
  return value.replace(/\|/g, "\\|");
}
