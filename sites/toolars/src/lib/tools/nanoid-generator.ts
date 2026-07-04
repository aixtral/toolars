export const nanoidPresets = {
  urlSafe: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-",
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  numeric: "0123456789",
  hex: "0123456789abcdef",
  lowercase: "abcdefghijklmnopqrstuvwxyz0123456789"
} as const;

export interface NanoidGeneratorInput {
  length: number;
  alphabet: string;
  quantity: number;
}

export interface NanoidGeneratorError {
  type: "invalid-length" | "invalid-quantity" | "empty-alphabet" | "generation-failed";
  message: string;
}

export interface NanoidGeneratorResult {
  success: boolean;
  ids: string[];
  error?: NanoidGeneratorError;
  stats: {
    length: number;
    quantity: number;
    alphabetSize: number;
    entropyBits: number;
  };
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local NanoID generation only; generated IDs stay in the browser.";

export function generateNanoIds(input: NanoidGeneratorInput): NanoidGeneratorResult {
  if (input.length < 1 || input.length > 256) {
    return buildNanoidError("invalid-length", "Length must be between 1 and 256.", input);
  }
  if (input.quantity < 1 || input.quantity > 100) {
    return buildNanoidError("invalid-quantity", "Quantity must be between 1 and 100.", input);
  }
  if (!input.alphabet.length) {
    return buildNanoidError("empty-alphabet", "Alphabet must include at least one character.", input);
  }

  try {
    const ids = Array.from({ length: input.quantity }, () => generateNanoId(input.length, input.alphabet));
    const entropyBits = input.length * Math.log2(new Set(input.alphabet).size);

    return {
      success: true,
      ids,
      stats: {
        length: input.length,
        quantity: input.quantity,
        alphabetSize: input.alphabet.length,
        entropyBits
      },
      summary: `${ids.length.toLocaleString("en-US")} IDs generated.`,
      privacyNote
    };
  } catch (error) {
    return buildNanoidError(
      "generation-failed",
      error instanceof Error ? error.message : "Failed to generate NanoIDs.",
      input
    );
  }
}

function generateNanoId(length: number, alphabet: string): string {
  const bytes = new Uint32Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join("");
}

function buildNanoidError(type: NanoidGeneratorError["type"], message: string, input: NanoidGeneratorInput): NanoidGeneratorResult {
  return {
    success: false,
    ids: [],
    error: { type, message },
    stats: {
      length: input.length,
      quantity: input.quantity,
      alphabetSize: input.alphabet.length,
      entropyBits: 0
    },
    summary: "NanoID generation failed.",
    privacyNote
  };
}
