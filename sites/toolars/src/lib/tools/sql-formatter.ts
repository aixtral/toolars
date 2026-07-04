export type SqlKeywordCase = "upper" | "lower";

export interface SqlFormatterInput {
  input: string;
  keywordCase?: SqlKeywordCase;
}

export interface SqlFormatterError {
  type: "empty-input";
  message: string;
}

export interface SqlFormatterResult {
  success: boolean;
  output: string;
  error?: SqlFormatterError;
  stats: {
    lines: number;
    characters: number;
  };
  privacyNote: string;
}

const privacyNote = "SQL formatting runs locally in the browser.";
const keywords = ["select", "from", "where", "and", "or", "order by", "group by", "having", "limit", "join", "left join", "right join", "inner join", "values", "insert into", "update", "set"];

export function formatSqlQuery({ input, keywordCase = "upper" }: SqlFormatterInput): SqlFormatterResult {
  if (!input.trim()) {
    return {
      success: false,
      output: "",
      error: { type: "empty-input", message: "Add SQL before formatting." },
      stats: { lines: 0, characters: 0 },
      privacyNote
    };
  }

  let output = input.trim().replace(/\s+/g, " ");
  output = output.replace(/\s*,\s*/g, ", ").replace(/\s*=\s*/g, " = ");
  output = applyKeywordCase(output, keywordCase);
  output = output
    .replace(/\s+(FROM|from)\s+/g, "\n$1 ")
    .replace(/\s+(WHERE|where)\s+/g, "\n$1 ")
    .replace(/\s+(ORDER BY|order by)\s+/g, "\n$1 ")
    .replace(/\s+(GROUP BY|group by)\s+/g, "\n$1 ")
    .replace(/\s+(HAVING|having)\s+/g, "\n$1 ")
    .replace(/\s+(LIMIT|limit)\s+/g, "\n$1 ")
    .replace(/\s+(JOIN|join)\s+/g, "\n$1 ")
    .replace(/\s+(AND|and)\s+/g, "\n  $1 ")
    .replace(/\s+(OR|or)\s+/g, "\n  $1 ");

  return {
    success: true,
    output,
    stats: {
      lines: output.split("\n").length,
      characters: output.length
    },
    privacyNote
  };
}

function applyKeywordCase(input: string, keywordCase: SqlKeywordCase): string {
  let output = input;
  for (const keyword of [...keywords].sort((a, b) => b.length - a.length)) {
    const replacement = keywordCase === "upper" ? keyword.toUpperCase() : keyword.toLowerCase();
    output = output.replace(new RegExp(`\\b${keyword.replace(/\s+/g, "\\s+")}\\b`, "gi"), replacement);
  }
  return output;
}
