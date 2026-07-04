export type TomlDirection = "toml-to-json" | "json-to-toml";

export interface TomlConverterInput {
  input: string;
  direction: TomlDirection;
}

export interface TomlConverterResult {
  success: boolean;
  output: string;
  error?: string;
  stats: {
    inputCharacters: number;
    outputCharacters: number;
  };
  privacyNote: string;
}

const privacyNote = "TOML and JSON conversion runs locally in the browser.";

export function convertToml({ input, direction }: TomlConverterInput): TomlConverterResult {
  try {
    const output = direction === "toml-to-json" ? JSON.stringify(parseToml(input), null, 2) : jsonToToml(JSON.parse(input) as Record<string, unknown>);
    return {
      success: true,
      output,
      stats: { inputCharacters: input.length, outputCharacters: output.length },
      privacyNote
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "TOML conversion failed.",
      stats: { inputCharacters: input.length, outputCharacters: 0 },
      privacyNote
    };
  }
}

function parseToml(input: string): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let current = root;

  for (const rawLine of input.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const section = line.match(/^\[([^\]]+)\]$/);
    if (section) {
      current = root;
      for (const part of section[1].split(".")) {
        current[part] = typeof current[part] === "object" && current[part] ? current[part] : {};
        current = current[part] as Record<string, unknown>;
      }
      continue;
    }

    const equalsIndex = line.indexOf("=");
    if (equalsIndex < 0) throw new Error(`Invalid TOML line: ${line}`);
    const key = line.slice(0, equalsIndex).trim();
    current[key] = parseTomlValue(line.slice(equalsIndex + 1).trim());
  }

  return root;
}

function parseTomlValue(value: string): unknown {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

function jsonToToml(input: Record<string, unknown>, prefix = ""): string {
  const scalars: string[] = [];
  const sections: string[] = [];

  for (const [key, value] of Object.entries(input)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      sections.push(`\n[${fullKey}]\n${jsonToToml(value as Record<string, unknown>, fullKey)}`);
    } else {
      scalars.push(`${key} = ${formatTomlValue(value)}`);
    }
  }

  return [...scalars, ...sections].join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function formatTomlValue(value: unknown): string {
  if (typeof value === "string") return `"${value.replace(/"/g, '\\"')}"`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `[${value.map(formatTomlValue).join(", ")}]`;
  return '""';
}
