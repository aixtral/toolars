export type NumberBase = 2 | 8 | 10 | 16;
export type NumberBaseErrorType = "invalid-number" | "unsupported-base";

export interface NumberBaseInput {
  value: string;
  fromBase: NumberBase;
}

export interface NumberBaseError {
  type: NumberBaseErrorType;
  message: string;
}

export interface NumberBaseOutputs {
  binary: string;
  octal: string;
  decimal: string;
  hexadecimal: string;
}

export interface NumberBaseResult {
  success: boolean;
  input: string;
  fromBase: NumberBase;
  normalizedValue: string;
  outputs: NumberBaseOutputs;
  unicodeCharacter: string | null;
  error?: NumberBaseError;
  summary: string;
  privacyNote: string;
}

const baseChars: Record<NumberBase, string> = {
  2: "01",
  8: "01234567",
  10: "0123456789",
  16: "0123456789ABCDEF"
};

const emptyOutputs: NumberBaseOutputs = {
  binary: "",
  octal: "",
  decimal: "",
  hexadecimal: ""
};

const privacyNote = "Local number conversion only; values stay in the browser.";

export function convertBase(value: string, fromBase: NumberBase, toBase: NumberBase): string {
  const decimal = parseToBigInt(value, fromBase);
  return decimal.toString(toBase).toUpperCase();
}

export function isValidForBase(value: string, base: NumberBase): boolean {
  const trimmed = value.trim();
  const chars = baseChars[base];
  if (!trimmed || !chars) return false;
  return trimmed
    .toUpperCase()
    .split("")
    .every((char) => chars.includes(char));
}

export function getUnicodeChar(decimalCodeStr: string): string | null {
  const code = Number.parseInt(decimalCodeStr, 10);
  if (Number.isNaN(code) || code < 0 || code > 0x10ffff) return null;
  if (code >= 0x00 && code <= 0x1f && code !== 0x09 && code !== 0x0a && code !== 0x0d) return null;
  if (code >= 0x7f && code <= 0x9f) return null;

  try {
    return String.fromCodePoint(code);
  } catch {
    return null;
  }
}

export function convertNumberBase({ value, fromBase }: NumberBaseInput): NumberBaseResult {
  try {
    const decimal = parseToBigInt(value, fromBase);
    const normalizedValue = value.trim().toUpperCase();
    const outputs = {
      binary: decimal.toString(2).toUpperCase(),
      octal: decimal.toString(8).toUpperCase(),
      decimal: decimal.toString(10).toUpperCase(),
      hexadecimal: decimal.toString(16).toUpperCase()
    };

    return {
      success: true,
      input: value,
      fromBase,
      normalizedValue,
      outputs,
      unicodeCharacter: getUnicodeChar(outputs.decimal),
      summary: `Converted ${normalizedValue} from base ${fromBase}.`,
      privacyNote
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid number";
    return {
      success: false,
      input: value,
      fromBase,
      normalizedValue: value.trim().toUpperCase(),
      outputs: emptyOutputs,
      unicodeCharacter: null,
      error: {
        type: message.startsWith("Unsupported") ? "unsupported-base" : "invalid-number",
        message
      },
      summary: "Number conversion failed.",
      privacyNote
    };
  }
}

function parseToBigInt(value: string, base: NumberBase): bigint {
  const trimmed = value.trim().toUpperCase();
  const chars = baseChars[base];
  if (!chars) throw new Error(`Unsupported base: ${base}`);
  if (!trimmed || !isValidForBase(trimmed, base)) throw new Error("Invalid number");

  let result = 0n;
  const bigBase = BigInt(base);

  for (const char of trimmed) {
    result = result * bigBase + BigInt(chars.indexOf(char));
  }

  return result;
}
