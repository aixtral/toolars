export type TableExtractionOutputFormat = "csv" | "xlsx";

export interface TableExtractionFile {
  name: string;
  pages: number;
  sizeBytes: number;
  type?: string;
}

export interface TableExtractionResult {
  output?: {
    estimatedTables: number;
    fileName: string;
    selectedPages: number;
  };
  status: "blocked" | "ready-for-extractor";
  trustBoundary: {
    mode: "local-planning-handoff";
    note: string;
    requiresBackend: boolean;
  };
  validationIssues: string[];
}

export function planTableExtraction({
  file,
  outputFormat,
  pageRange
}: {
  file: TableExtractionFile;
  outputFormat: TableExtractionOutputFormat;
  pageRange: string;
}): TableExtractionResult {
  const validationIssues: string[] = [];
  const parsedRange = parsePageRange(pageRange, file.pages);

  if (!isPdfFile(file)) {
    validationIssues.push("Choose a PDF file before planning table extraction.");
  }
  if (!parsedRange.valid) {
    validationIssues.push(`Page range must stay between 1 and ${file.pages}.`);
  }

  if (validationIssues.length > 0) {
    return {
      status: "blocked",
      trustBoundary,
      validationIssues
    };
  }

  const selectedPages = parsedRange.pages;

  return {
    output: {
      estimatedTables: Math.max(1, selectedPages),
      fileName: `${sanitizeBaseName(file.name)}_tables.${outputFormat}`,
      selectedPages
    },
    status: "ready-for-extractor",
    trustBoundary,
    validationIssues: []
  };
}

const trustBoundary = {
  mode: "local-planning-handoff" as const,
  note: "This workspace validates page range and output settings locally; actual table detection requires a structured extractor service.",
  requiresBackend: true
};

function parsePageRange(pageRange: string, maxPages: number): { pages: number; valid: boolean } {
  const trimmed = pageRange.trim();
  if (!trimmed) return { pages: maxPages, valid: maxPages > 0 };

  const match = trimmed.match(/^(\d+)(?:-(\d+))?$/);
  if (!match) return { pages: 0, valid: false };

  const start = Number(match[1]);
  const end = Number(match[2] ?? match[1]);

  if (start < 1 || end < start || end > maxPages) {
    return { pages: 0, valid: false };
  }

  return { pages: end - start + 1, valid: true };
}

function isPdfFile(file: TableExtractionFile): boolean {
  return file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
}

function sanitizeBaseName(name: string): string {
  return name.replace(/\.pdf$/i, "").trim().replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "toolars";
}
