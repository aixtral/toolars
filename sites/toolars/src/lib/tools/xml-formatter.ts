export type XmlFormatterMode = "format" | "minify";
export type XmlFormatterErrorType = "empty-input" | "format-failed";

export interface XmlFormatterInput {
  input: string;
  mode: XmlFormatterMode;
  indentSize: number;
}

export interface XmlFormatterError {
  type: XmlFormatterErrorType;
  message: string;
}

export interface XmlFormatterStats {
  inputCharacters: number;
  outputCharacters: number;
  lines: number;
  tags: number;
}

export interface XmlFormatterResult {
  success: boolean;
  mode: XmlFormatterMode;
  output: string;
  error?: XmlFormatterError;
  stats: XmlFormatterStats;
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local XML formatting only; markup stays in the browser.";

export function formatXmlSnippet(input: XmlFormatterInput): XmlFormatterResult {
  if (!input.input.trim()) {
    return buildXmlFormatterError(input, "empty-input", "XML input is empty.");
  }

  try {
    const output =
      input.mode === "format" ? formatXml(input.input, input.indentSize) : minifyXml(input.input);
    const stats = buildXmlStats(input.input, output);

    return {
      success: true,
      mode: input.mode,
      output,
      stats,
      summary:
        input.mode === "format"
          ? `Formatted XML into ${stats.lines.toLocaleString("en-US")} ${stats.lines === 1 ? "line" : "lines"}.`
          : `Minified XML to ${stats.outputCharacters.toLocaleString("en-US")} characters.`,
      privacyNote
    };
  } catch (error) {
    return buildXmlFormatterError(
      input,
      "format-failed",
      error instanceof Error ? error.message : "XML formatting failed."
    );
  }
}

export function formatXml(xml: string, indent = 2): string {
  if (!xml.trim()) throw new Error("XML input is empty.");

  const unit = " ".repeat(Math.max(0, Math.floor(indent)));
  const nodes = xml.replace(/>\s*</g, "><").split(/(<[^>]+>)/g).filter(Boolean);
  let level = 0;
  const lines: string[] = [];

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index].trim();
    if (!node) continue;

    if (node.startsWith("<?") || node.startsWith("<!--")) {
      lines.push(`${unit.repeat(level)}${node}`);
      continue;
    }

    if (/^<\/[\w:-]+/.test(node)) {
      level = Math.max(0, level - 1);
      lines.push(`${unit.repeat(level)}${node}`);
      continue;
    }

    if (/^<[\w:-][^>]*\/>$/.test(node)) {
      lines.push(`${unit.repeat(level)}${node}`);
      continue;
    }

    if (/^<[\w:-]/.test(node)) {
      const next = nodes[index + 1]?.trim() ?? "";
      const afterNext = nodes[index + 2]?.trim() ?? "";

      if (next && !next.startsWith("<") && /^<\/[\w:-]+/.test(afterNext)) {
        lines.push(`${unit.repeat(level)}${node}${next}${afterNext}`);
        index += 2;
        continue;
      }

      lines.push(`${unit.repeat(level)}${node}`);
      level += 1;
      continue;
    }

    lines.push(`${unit.repeat(Math.max(0, level - 1))}${node}`);
  }

  return lines.join("\n").trim();
}

export function minifyXml(xml: string): string {
  if (!xml.trim()) throw new Error("XML input is empty.");
  return xml.replace(/>\s+</g, "><").trim();
}

function buildXmlStats(input: string, output: string): XmlFormatterStats {
  return {
    inputCharacters: input.length,
    outputCharacters: output.length,
    lines: output ? output.split("\n").length : 0,
    tags: output.match(/<\/?[\w:-]+[^>]*\/?>/g)?.length ?? 0
  };
}

function buildXmlFormatterError(
  input: XmlFormatterInput,
  type: XmlFormatterErrorType,
  message: string
): XmlFormatterResult {
  return {
    success: false,
    mode: input.mode,
    output: "",
    error: { type, message },
    stats: {
      inputCharacters: input.input.length,
      outputCharacters: 0,
      lines: 0,
      tags: 0
    },
    summary: "XML formatting failed.",
    privacyNote
  };
}
