export type CodeMinifierLanguage = "javascript" | "css" | "html";

export interface CodeMinifierInput {
  input: string;
  language: CodeMinifierLanguage;
}

export interface CodeMinifierIssue {
  type: "empty-input" | "unsupported-language";
  message: string;
}

export interface CodeMinifierResult {
  success: boolean;
  output: string;
  error?: CodeMinifierIssue;
  stats: {
    originalBytes: number;
    minifiedBytes: number;
    savingsBytes: number;
    savingsPercent: number;
  };
  summary: string;
  privacyNote: string;
}

const privacyNote = "Code is minified locally in the browser; snippets are not uploaded.";

export function minifyCode({ input, language }: CodeMinifierInput): CodeMinifierResult {
  const originalBytes = byteLength(input);

  if (!input.trim()) {
    return {
      success: false,
      output: "",
      error: { type: "empty-input", message: "Add code before minifying." },
      stats: buildStats(originalBytes, 0),
      summary: "No code to minify.",
      privacyNote
    };
  }

  const output = minifyByLanguage(input, language);
  if (output === null) {
    return {
      success: false,
      output: "",
      error: { type: "unsupported-language", message: "Unsupported code language." },
      stats: buildStats(originalBytes, 0),
      summary: "Minification failed.",
      privacyNote
    };
  }

  const stats = buildStats(originalBytes, byteLength(output));

  return {
    success: true,
    output,
    stats,
    summary: `Minified ${language} and saved ${stats.savingsBytes.toLocaleString("en-US")} bytes.`,
    privacyNote
  };
}

function minifyByLanguage(input: string, language: CodeMinifierLanguage): string | null {
  if (language === "css") {
    return input
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s*([{}:;,>~+])\s*/g, "$1")
      .replace(/;\}/g, "}")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (language === "html") {
    return input
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/>\s+</g, "><")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (language === "javascript") {
    return input
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}()[\];,:=+\-*/<>])\s*/g, "$1")
      .replace(/;\}/g, "}")
      .trim();
  }

  return null;
}

function buildStats(originalBytes: number, minifiedBytes: number): CodeMinifierResult["stats"] {
  const savingsBytes = Math.max(0, originalBytes - minifiedBytes);
  return {
    originalBytes,
    minifiedBytes,
    savingsBytes,
    savingsPercent: originalBytes > 0 ? Math.round((savingsBytes / originalBytes) * 1000) / 10 : 0
  };
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}
