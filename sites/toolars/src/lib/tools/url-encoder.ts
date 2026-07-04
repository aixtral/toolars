export type UrlConversionMode = "encode" | "decode";
export type UrlEncoderErrorType = "invalid-percent-sequence" | "conversion-failed";

export interface UrlEncoderInput {
  input: string;
  mode: UrlConversionMode;
}

export interface UrlEncoderError {
  type: UrlEncoderErrorType;
  message: string;
}

export interface UrlEncoderStats {
  inputCharacters: number;
  inputBytes: number;
  outputCharacters: number;
  outputBytes: number;
  expansionRatio: number;
}

export interface UrlEncoderResult {
  success: boolean;
  mode: UrlConversionMode;
  input: string;
  output: string;
  error?: UrlEncoderError;
  stats: UrlEncoderStats;
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local URL conversion only; text stays in the browser.";

export function convertUrlComponent({ input, mode }: UrlEncoderInput): UrlEncoderResult {
  try {
    const output = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    const action = mode === "encode" ? "Encoded" : "Decoded";

    return buildUrlResult({
      input,
      mode,
      output,
      success: true,
      summary: `${action} ${input.length.toLocaleString("en-US")} characters into ${output.length.toLocaleString("en-US")} characters.`
    });
  } catch (error) {
    const type = mode === "decode" ? "invalid-percent-sequence" : "conversion-failed";

    return buildUrlResult({
      error: {
        type,
        message: error instanceof Error ? error.message : "URL conversion failed."
      },
      input,
      mode,
      output: "",
      success: false,
      summary: "URL conversion failed."
    });
  }
}

function buildUrlResult({
  error,
  input,
  mode,
  output,
  success,
  summary
}: {
  error?: UrlEncoderError;
  input: string;
  mode: UrlConversionMode;
  output: string;
  success: boolean;
  summary: string;
}): UrlEncoderResult {
  const inputBytes = new TextEncoder().encode(input).length;
  const outputBytes = new TextEncoder().encode(output).length;

  return {
    success,
    mode,
    input,
    output,
    error,
    stats: {
      inputCharacters: input.length,
      inputBytes,
      outputCharacters: output.length,
      outputBytes,
      expansionRatio: inputBytes > 0 ? outputBytes / inputBytes : 0
    },
    summary,
    privacyNote
  };
}
