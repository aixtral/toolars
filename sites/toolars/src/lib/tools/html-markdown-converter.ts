export type HtmlMarkdownDirection = "html-to-markdown" | "markdown-to-html";

export interface HtmlMarkdownInput {
  input: string;
  direction: HtmlMarkdownDirection;
}

export interface HtmlMarkdownResult {
  success: boolean;
  output: string;
  warnings: string[];
  stats: {
    inputCharacters: number;
    outputCharacters: number;
  };
  privacyNote: string;
}

const privacyNote = "HTML and Markdown conversion runs locally in the browser.";

export function convertHtmlMarkdown({ input, direction }: HtmlMarkdownInput): HtmlMarkdownResult {
  const output = direction === "html-to-markdown" ? htmlToMarkdown(input) : markdownToHtml(input);

  return {
    success: input.trim().length > 0,
    output,
    warnings: /<script[\s>]/i.test(input) ? ["Script tags are omitted from Markdown conversion."] : [],
    stats: {
      inputCharacters: input.length,
      outputCharacters: output.length
    },
    privacyNote
  };
}

function htmlToMarkdown(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .split("\n")
    .map((line) => line.trim())
    .filter((line, index, lines) => line || (lines[index - 1] && lines[index + 1]))
    .join("\n")
    .trim();
}

function markdownToHtml(input: string): string {
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  return lines
    .map((line) => {
      if (line.startsWith("# ")) return `<h1>${inlineMarkdown(line.slice(2))}</h1>`;
      if (line.startsWith("## ")) return `<h2>${inlineMarkdown(line.slice(3))}</h2>`;
      if (line.startsWith("### ")) return `<h3>${inlineMarkdown(line.slice(4))}</h3>`;
      if (line.startsWith("- ")) return `<li>${inlineMarkdown(line.slice(2))}</li>`;
      if (!line.trim()) return "";
      return `<p>${inlineMarkdown(line)}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

function inlineMarkdown(input: string): string {
  return escapeHtml(input)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function escapeHtml(input: string): string {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
