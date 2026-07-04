export type Base64ConversionMode = "encode" | "decode";
export type Base64Alphabet = "standard" | "url-safe";
export type Base64WarningType = "padding-added" | "whitespace-removed" | "url-safe-normalized" | "data-url-prefix-removed";
export type Base64ErrorType = "empty-input" | "invalid-base64" | "invalid-utf8" | "conversion-failed";

export interface Base64ConverterInput {
  alphabet: Base64Alphabet;
  input: string;
  mode: Base64ConversionMode;
}

export interface Base64Warning {
  type: Base64WarningType;
}

export interface Base64Error {
  type: Base64ErrorType;
}

export interface Base64ConverterStats {
  inputCharacters: number;
  inputBytes: number;
  outputCharacters: number;
  outputBytes: number;
  expansionRatio: number;
}

export interface Base64ConverterResult {
  success: boolean;
  mode: Base64ConversionMode;
  alphabet: Base64Alphabet;
  input: string;
  normalizedInput: string;
  output: string;
  warnings: Base64Warning[];
  error?: Base64Error;
  stats: Base64ConverterStats;
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local Base64 conversion only; input text stays in the browser.";

export function convertBase64Payload(input: Base64ConverterInput): Base64ConverterResult {
  return input.mode === "encode" ? encodeBase64Payload(input) : decodeBase64Payload(input);
}

function encodeBase64Payload(input: Base64ConverterInput): Base64ConverterResult {
  try {
    const bytes = new TextEncoder().encode(input.input);
    const encoded = binaryStringToBase64(uint8ArrayToBinaryString(bytes));
    const output = input.alphabet === "url-safe" ? toUrlSafeBase64(encoded) : encoded;

    return buildResult({
      alphabet: input.alphabet,
      input: input.input,
      mode: input.mode,
      normalizedInput: input.input,
      output,
      outputBytes: new TextEncoder().encode(output).length,
      success: true,
      summary: `Encoded ${bytes.length.toLocaleString("en-US")} bytes into ${output.length.toLocaleString("en-US")} Base64 characters.`,
      warnings: []
    });
  } catch {
    return buildResult({
      alphabet: input.alphabet,
      error: { type: "conversion-failed" },
      input: input.input,
      mode: input.mode,
      normalizedInput: input.input,
      output: "",
      outputBytes: 0,
      success: false,
      summary: "Base64 conversion failed.",
      warnings: []
    });
  }
}

function decodeBase64Payload(input: Base64ConverterInput): Base64ConverterResult {
  const normalized = normalizeBase64Input(input.input);

  if (normalized.error) {
    return buildResult({
      alphabet: input.alphabet,
      error: normalized.error,
      input: input.input,
      mode: input.mode,
      normalizedInput: normalized.value,
      output: "",
      outputBytes: 0,
      success: false,
      summary: "Base64 conversion failed.",
      warnings: normalized.warnings
    });
  }

  try {
    const bytes = base64ToUint8Array(normalized.value);
    const output = new TextDecoder("utf-8", { fatal: true }).decode(bytes);

    return buildResult({
      alphabet: input.alphabet,
      input: input.input,
      mode: input.mode,
      normalizedInput: normalized.value,
      output,
      outputBytes: bytes.length,
      success: true,
      summary: `Decoded ${normalized.value.length.toLocaleString("en-US")} Base64 characters into ${bytes.length.toLocaleString("en-US")} bytes.`,
      warnings: normalized.warnings
    });
  } catch {
    return buildResult({
      alphabet: input.alphabet,
      error: { type: "invalid-utf8" },
      input: input.input,
      mode: input.mode,
      normalizedInput: normalized.value,
      output: "",
      outputBytes: 0,
      success: false,
      summary: "Base64 conversion failed.",
      warnings: normalized.warnings
    });
  }
}

function normalizeBase64Input(input: string): {
  value: string;
  warnings: Base64Warning[];
  error?: Base64Error;
} {
  const warnings: Base64Warning[] = [];
  let value = input.trim();

  const dataUrlMatch = value.match(/^data:[^,]*;base64,(.*)$/is);
  if (dataUrlMatch) {
    value = dataUrlMatch[1] ?? "";
    warnings.push({ type: "data-url-prefix-removed" });
  }

  const withoutWhitespace = value.replace(/\s+/g, "");
  if (withoutWhitespace !== value) {
    value = withoutWhitespace;
    warnings.push({ type: "whitespace-removed" });
  }

  if (/[-_]/.test(value)) {
    value = value.replaceAll("-", "+").replaceAll("_", "/");
    warnings.push({ type: "url-safe-normalized" });
  }

  const remainder = value.length % 4;
  if (remainder === 1) {
    return {
      error: { type: "invalid-base64" },
      value,
      warnings
    };
  }

  if (remainder > 0) {
    value = value.padEnd(value.length + (4 - remainder), "=");
    warnings.push({ type: "padding-added" });
  }

  if (!isValidBase64(value)) {
    return {
      error: { type: "invalid-base64" },
      value,
      warnings
    };
  }

  return { value, warnings };
}

function isValidBase64(input: string): boolean {
  if (!input) return true;
  return /^(?:[A-Za-z0-9+/]+={0,2})$/.test(input);
}

function buildResult({
  alphabet,
  error,
  input,
  mode,
  normalizedInput,
  output,
  outputBytes,
  success,
  summary,
  warnings
}: {
  alphabet: Base64Alphabet;
  error?: Base64Error;
  input: string;
  mode: Base64ConversionMode;
  normalizedInput: string;
  output: string;
  outputBytes: number;
  success: boolean;
  summary: string;
  warnings: Base64Warning[];
}): Base64ConverterResult {
  const inputBytes = new TextEncoder().encode(input).length;
  const outputCharacters = output.length;

  return {
    success,
    mode,
    alphabet,
    input,
    normalizedInput,
    output,
    warnings,
    error,
    stats: {
      inputCharacters: input.length,
      inputBytes,
      outputCharacters,
      outputBytes,
      expansionRatio: inputBytes > 0 ? outputBytes / inputBytes : 0
    },
    summary,
    privacyNote
  };
}

function toUrlSafeBase64(input: string): string {
  return input.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function uint8ArrayToBinaryString(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return binary;
}

function base64ToUint8Array(input: string): Uint8Array {
  const binary = base64ToBinaryString(input);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function binaryStringToBase64(input: string): string {
  return btoa(input);
}

function base64ToBinaryString(input: string): string {
  return atob(input);
}
