export type HtmlEntityConversionMode = "encode" | "decode";
export type HtmlEntityStyle = "named" | "decimal" | "hex";
export type HtmlEntityErrorType = "conversion-failed";

export interface HtmlEntityConverterInput {
  input: string;
  mode: HtmlEntityConversionMode;
  style: HtmlEntityStyle;
}

export interface HtmlEntityConverterError {
  type: HtmlEntityErrorType;
  message: string;
}

export interface HtmlEntityConverterStats {
  inputCharacters: number;
  outputCharacters: number;
  convertedEntities: number;
}

export interface HtmlEntityConverterResult {
  success: boolean;
  mode: HtmlEntityConversionMode;
  style: HtmlEntityStyle;
  input: string;
  output: string;
  error?: HtmlEntityConverterError;
  stats: HtmlEntityConverterStats;
  summary: string;
  reviewNote: string;
  privacyNote: string;
}

interface HtmlEntityDefinition {
  name: string;
  char: string;
  decimal: number;
}

export const htmlEntityTable: HtmlEntityDefinition[] = [
  { name: "amp", char: "&", decimal: 38 },
  { name: "lt", char: "<", decimal: 60 },
  { name: "gt", char: ">", decimal: 62 },
  { name: "quot", char: "\"", decimal: 34 },
  { name: "apos", char: "'", decimal: 39 },
  { name: "nbsp", char: "\u00a0", decimal: 160 },
  { name: "copy", char: "\u00a9", decimal: 169 },
  { name: "reg", char: "\u00ae", decimal: 174 },
  { name: "trade", char: "\u2122", decimal: 8482 },
  { name: "euro", char: "\u20ac", decimal: 8364 },
  { name: "pound", char: "\u00a3", decimal: 163 },
  { name: "yen", char: "\u00a5", decimal: 165 },
  { name: "cent", char: "\u00a2", decimal: 162 },
  { name: "deg", char: "\u00b0", decimal: 176 },
  { name: "plusmn", char: "\u00b1", decimal: 177 },
  { name: "times", char: "\u00d7", decimal: 215 },
  { name: "divide", char: "\u00f7", decimal: 247 },
  { name: "hellip", char: "\u2026", decimal: 8230 },
  { name: "mdash", char: "\u2014", decimal: 8212 },
  { name: "ndash", char: "\u2013", decimal: 8211 },
  { name: "ldquo", char: "\u201c", decimal: 8220 },
  { name: "rdquo", char: "\u201d", decimal: 8221 },
  { name: "lsquo", char: "\u2018", decimal: 8216 },
  { name: "rsquo", char: "\u2019", decimal: 8217 }
];

const charToEntity = new Map(htmlEntityTable.map((entity) => [entity.char, entity]));
const nameToChar = new Map(htmlEntityTable.map((entity) => [entity.name.toLowerCase(), entity.char]));
const privacyNote = "Local HTML entity conversion only; snippets stay in the browser.";

export function convertHtmlEntities(input: HtmlEntityConverterInput): HtmlEntityConverterResult {
  try {
    const converted = input.mode === "encode" ? encodeHtmlEntities(input.input, input.style) : decodeHtmlEntities(input.input);
    const action = input.mode === "encode" ? "Encoded" : "Decoded";

    return buildHtmlEntityResult({
      convertedEntities: converted.convertedEntities,
      input,
      output: converted.output,
      success: true,
      summary: `${action} ${converted.convertedEntities.toLocaleString("en-US")} HTML entities.`
    });
  } catch (error) {
    return buildHtmlEntityResult({
      convertedEntities: 0,
      error: {
        type: "conversion-failed",
        message: error instanceof Error ? error.message : "HTML entity conversion failed."
      },
      input,
      output: "",
      success: false,
      summary: "HTML entity conversion failed."
    });
  }
}

function encodeHtmlEntities(input: string, style: HtmlEntityStyle): { output: string; convertedEntities: number } {
  let output = "";
  let convertedEntities = 0;

  for (const character of input) {
    const entity = charToEntity.get(character);
    const codePoint = character.codePointAt(0) ?? 0;

    if (entity) {
      output += formatEntity(entity, style);
      convertedEntities += 1;
      continue;
    }

    if (codePoint > 127) {
      output += style === "hex" ? `&#x${codePoint.toString(16)};` : `&#${codePoint};`;
      convertedEntities += 1;
      continue;
    }

    output += character;
  }

  return { output, convertedEntities };
}

function decodeHtmlEntities(input: string): { output: string; convertedEntities: number } {
  let convertedEntities = 0;
  const output = input.replace(/&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-zA-Z][a-zA-Z0-9]+));/g, (match, decimal, hex, name) => {
    let replacement: string | undefined;

    if (decimal) {
      replacement = fromCodePoint(Number.parseInt(decimal, 10));
    } else if (hex) {
      replacement = fromCodePoint(Number.parseInt(hex, 16));
    } else if (name) {
      replacement = nameToChar.get(String(name).toLowerCase());
    }

    if (!replacement) return match;
    convertedEntities += 1;
    return replacement;
  });

  return { output, convertedEntities };
}

function formatEntity(entity: HtmlEntityDefinition, style: HtmlEntityStyle): string {
  if (style === "named") return `&${entity.name};`;
  if (style === "decimal") return `&#${entity.decimal};`;
  return `&#x${entity.decimal.toString(16)};`;
}

function fromCodePoint(value: number): string | undefined {
  if (!Number.isFinite(value) || value < 0 || value > 0x10ffff) return undefined;
  return String.fromCodePoint(value);
}

function buildHtmlEntityResult({
  convertedEntities,
  error,
  input,
  output,
  success,
  summary
}: {
  convertedEntities: number;
  error?: HtmlEntityConverterError;
  input: HtmlEntityConverterInput;
  output: string;
  success: boolean;
  summary: string;
}): HtmlEntityConverterResult {
  return {
    success,
    mode: input.mode,
    style: input.style,
    input: input.input,
    output,
    error,
    stats: {
      inputCharacters: input.input.length,
      outputCharacters: output.length,
      convertedEntities
    },
    summary,
    reviewNote:
      input.mode === "decode"
        ? "Review decoded text before rendering it as HTML."
        : "Review encoded entities before pasting them into templates.",
    privacyNote
  };
}
