export type CsvToJsonErrorType = "empty-input" | "empty-headers" | "inconsistent-columns" | "parse-failed";

export interface CsvToJsonInput {
  input: string;
  delimiter: string;
  hasHeaders: boolean;
  skipEmptyRows: boolean;
}

export interface CsvToJsonError {
  type: CsvToJsonErrorType;
  message: string;
  row?: number;
}

export interface CsvToJsonStats {
  rows: number;
  columns: number;
  skippedEmptyRows: number;
  inputCharacters: number;
  outputCharacters: number;
}

export interface CsvToJsonResult {
  success: boolean;
  records: Record<string, string>[];
  output: string;
  error?: CsvToJsonError;
  stats: CsvToJsonStats;
  summary: string;
  privacyNote: string;
}

interface TokenizeResult {
  rows: string[][];
  error?: CsvToJsonError;
}

const privacyNote = "Local CSV parsing only; table data stays in the browser.";

export function convertCsvToJson(input: CsvToJsonInput): CsvToJsonResult {
  if (!input.input.trim()) {
    return buildCsvToJsonError(input, "empty-input", "CSV input is empty.");
  }

  const tokenized = tokenizeRows(input.input, input.delimiter);
  if (tokenized.error) {
    return buildCsvToJsonError(input, tokenized.error.type, tokenized.error.message, tokenized.error.row);
  }

  const rows = tokenized.rows;
  if (rows.length === 0) {
    return buildCsvToJsonError(input, "empty-input", "CSV input has no rows.");
  }

  let headers: string[];
  let dataRows = rows;
  let skippedEmptyRows = 0;

  if (input.hasHeaders) {
    headers = rows[0] ?? [];
    dataRows = rows.slice(1);

    if (headers.length === 0 || headers.every((header) => header.trim() === "")) {
      return buildCsvToJsonError(input, "empty-headers", "CSV headers are empty.");
    }
  } else {
    const sourceRows = input.skipEmptyRows ? rows.filter((row) => !isEmptyRow(row)) : rows;
    const maxColumns = Math.max(...sourceRows.map((row) => row.length));
    headers = Array.from({ length: maxColumns }, (_, index) => String(index));
  }

  const records: Record<string, string>[] = [];
  const columnCount = headers.length;

  for (let index = 0; index < dataRows.length; index++) {
    const row = dataRows[index] ?? [];

    if (input.skipEmptyRows && isEmptyRow(row)) {
      skippedEmptyRows += 1;
      continue;
    }

    if (row.length !== columnCount) {
      const displayRow = input.hasHeaders ? index + 2 : index + 1;
      return buildCsvToJsonError(
        input,
        "inconsistent-columns",
        `Expected ${columnCount} columns but row ${displayRow} has ${row.length}.`,
        displayRow
      );
    }

    const record: Record<string, string> = {};
    for (let column = 0; column < columnCount; column++) {
      record[headers[column] ?? String(column)] = row[column] ?? "";
    }
    records.push(record);
  }

  const output = JSON.stringify(records, null, 2);

  return {
    success: true,
    records,
    output,
    stats: {
      rows: records.length,
      columns: columnCount,
      skippedEmptyRows,
      inputCharacters: input.input.length,
      outputCharacters: output.length
    },
    summary: `${records.length.toLocaleString("en-US")} CSV rows converted into JSON records.`,
    privacyNote
  };
}

function tokenizeRows(input: string, delimiter: string): TokenizeResult {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;
  let rowNumber = 1;
  let index = 0;

  while (index < input.length) {
    const character = input[index];

    if (inQuotes) {
      if (character === "\"") {
        if (input[index + 1] === "\"") {
          currentField += "\"";
          index += 2;
          continue;
        }

        inQuotes = false;
        index += 1;
        continue;
      }

      currentField += character;
      index += 1;
      continue;
    }

    if (character === "\"") {
      inQuotes = true;
      index += 1;
      continue;
    }

    if (matchesDelimiter(input, delimiter, index)) {
      currentRow.push(currentField);
      currentField = "";
      index += delimiter.length;
      continue;
    }

    if (character === "\r" || character === "\n") {
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = "";

      if (character === "\r" && input[index + 1] === "\n") {
        index += 2;
      } else {
        index += 1;
      }
      rowNumber += 1;
      continue;
    }

    currentField += character;
    index += 1;
  }

  if (inQuotes) {
    return {
      rows,
      error: {
        type: "parse-failed",
        message: "CSV has an unclosed quoted field.",
        row: rowNumber
      }
    };
  }

  currentRow.push(currentField);
  rows.push(currentRow);

  if (rows.length > 1 && isEmptyRow(rows[rows.length - 1] ?? [])) {
    rows.pop();
  }

  return { rows };
}

function matchesDelimiter(input: string, delimiter: string, index: number): boolean {
  if (delimiter.length === 1) return input[index] === delimiter;
  return input.slice(index, index + delimiter.length) === delimiter;
}

function isEmptyRow(row: string[]): boolean {
  return row.every((cell) => cell === "");
}

function buildCsvToJsonError(input: CsvToJsonInput, type: CsvToJsonErrorType, message: string, row?: number): CsvToJsonResult {
  return {
    success: false,
    records: [],
    output: "",
    error: { type, message, row },
    stats: {
      rows: 0,
      columns: 0,
      skippedEmptyRows: 0,
      inputCharacters: input.input.length,
      outputCharacters: 0
    },
    summary: "CSV conversion failed.",
    privacyNote
  };
}
