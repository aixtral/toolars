export type JsonFormatterMode = "format" | "minify";

export interface JsonFormatterInput {
  input: string;
  mode: JsonFormatterMode;
  indent?: number;
}

export interface JsonFormatterError {
  type: "invalid-json";
  message: string;
}

export interface JsonFormatterResult {
  success: boolean;
  data?: unknown;
  output: string;
  error?: JsonFormatterError;
  stats: {
    characters: number;
    keys: number;
    depth: number;
  };
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local JSON formatting only; payloads stay in the browser.";

export function formatJsonDocument(input: JsonFormatterInput): JsonFormatterResult {
  try {
    const data = JSON.parse(input.input) as unknown;
    const stats = inspectJsonValue(data);
    const output = input.mode === "minify" ? JSON.stringify(data) : JSON.stringify(data, null, input.indent ?? 2);

    return {
      success: true,
      data,
      output,
      stats: {
        ...stats,
        characters: input.input.length
      },
      summary: input.mode === "minify" ? "JSON minified locally." : "JSON formatted locally.",
      privacyNote
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      error: {
        type: "invalid-json",
        message: error instanceof Error ? error.message : "Invalid JSON."
      },
      stats: {
        characters: input.input.length,
        keys: 0,
        depth: 0
      },
      summary: "JSON formatting failed.",
      privacyNote
    };
  }
}

function inspectJsonValue(value: unknown, depth = 1): { keys: number; depth: number } {
  if (Array.isArray(value)) {
    return value.reduce<{ keys: number; depth: number }>(
      (stats, item) => {
        const child = inspectJsonValue(item, depth + 1);
        return { keys: stats.keys + child.keys, depth: Math.max(stats.depth, child.depth) };
      },
      { keys: 0, depth }
    );
  }

  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).reduce<{ keys: number; depth: number }>(
      (stats, item) => {
        const child = inspectJsonValue(item, depth + 1);
        return { keys: stats.keys + child.keys, depth: Math.max(stats.depth, child.depth) };
      },
      { keys: Object.keys(value).length, depth }
    );
  }

  return { keys: 0, depth };
}
