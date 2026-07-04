export type EnvEntry = EnvPairEntry | EnvCommentEntry | EnvBlankEntry;

export interface EnvPairEntry {
  type: "pair";
  key: string;
  value: string;
  line: number;
}

export interface EnvCommentEntry {
  type: "comment";
  comment: string;
  line: number;
}

export interface EnvBlankEntry {
  type: "blank";
  line: number;
}

export interface EnvParseInput {
  input: string;
}

export interface EnvParseResult {
  entries: EnvEntry[];
  duplicates: string[];
  secretKeys: string[];
  malformedLines: number[];
  summary: string;
  privacyNote: string;
}

const privacyNote = ".env content is parsed locally in the browser; values are not uploaded.";
const secretPattern = /(SECRET|TOKEN|PASSWORD|API_KEY|PRIVATE|CREDENTIAL)/i;

export function parseEnvDocument({ input }: EnvParseInput): EnvParseResult {
  const entries: EnvEntry[] = [];
  const malformedLines: number[] = [];
  const keyCounts = new Map<string, number>();
  const lines = input.replace(/\r\n/g, "\n").split("\n");

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    if (!trimmed) {
      entries.push({ type: "blank", line: lineNumber });
      return;
    }
    if (trimmed.startsWith("#")) {
      entries.push({ type: "comment", comment: trimmed, line: lineNumber });
      return;
    }

    const equalsIndex = line.indexOf("=");
    if (equalsIndex < 0) {
      malformedLines.push(lineNumber);
      entries.push({ type: "pair", key: trimmed, value: "", line: lineNumber });
      keyCounts.set(trimmed, (keyCounts.get(trimmed) ?? 0) + 1);
      return;
    }

    const key = line.slice(0, equalsIndex).trim();
    const value = unquoteValue(line.slice(equalsIndex + 1).trim());
    if (!key) malformedLines.push(lineNumber);
    entries.push({ type: "pair", key, value, line: lineNumber });
    keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
  });

  const pairs = entries.filter((entry): entry is EnvPairEntry => entry.type === "pair");
  const duplicates = [...keyCounts.entries()].filter(([, count]) => count > 1).map(([key]) => key);
  const secretKeys = pairs.filter((entry) => secretPattern.test(entry.key)).map((entry) => entry.key);

  return {
    entries,
    duplicates,
    secretKeys: [...new Set(secretKeys)],
    malformedLines,
    summary: `${pairs.length.toLocaleString("en-US")} variables parsed locally.`,
    privacyNote
  };
}

export function serializeEnvEntries(entries: EnvEntry[]): string {
  return entries
    .map((entry) => {
      if (entry.type === "blank") return "";
      if (entry.type === "comment") return entry.comment;
      const value = /\s/.test(entry.value) ? `"${entry.value.replace(/"/g, '\\"')}"` : entry.value;
      return `${entry.key}=${value}`;
    })
    .join("\n")
    .replace(/\n+$/g, "");
}

function unquoteValue(value: string): string {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}
