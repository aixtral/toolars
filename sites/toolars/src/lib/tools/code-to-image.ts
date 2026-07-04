export type CodeImageTheme = "midnight" | "paper" | "terminal";

export interface CodeImageOptions {
  code: string;
  language: string;
  theme: CodeImageTheme;
  padding: number;
  title?: string;
}

export interface CodeImageResult {
  svg: string;
  dataUrl: string;
  width: number;
  height: number;
  lineCount: number;
}

const themes: Record<CodeImageTheme, { background: string; foreground: string; chrome: string; muted: string }> = {
  midnight: { background: "#111827", foreground: "#e5e7eb", chrome: "#1f2937", muted: "#9ca3af" },
  paper: { background: "#f8fafc", foreground: "#111827", chrome: "#e2e8f0", muted: "#475569" },
  terminal: { background: "#052e16", foreground: "#dcfce7", chrome: "#14532d", muted: "#86efac" }
};

export function generateCodeImageSvg(options: CodeImageOptions): CodeImageResult {
  const lines = (options.code.trimEnd() || " ").split(/\r?\n/);
  const padding = Math.max(16, Math.min(80, Math.round(options.padding)));
  const lineHeight = 24;
  const contentWidth = Math.max(360, Math.max(...lines.map((line) => line.length)) * 8 + 96);
  const width = contentWidth + padding * 2;
  const height = padding * 2 + 48 + lines.length * lineHeight;
  const theme = themes[options.theme];
  const title = options.title?.trim() || `${options.language || "code"} snippet`;
  const codeLines = lines.map((line, index) =>
    `<text x="${padding + 32}" y="${padding + 64 + index * lineHeight}" fill="${theme.foreground}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15">${escapeXml(line)}</text>`
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}">
  <rect width="100%" height="100%" rx="18" fill="${theme.background}" />
  <rect x="${padding}" y="${padding}" width="${width - padding * 2}" height="34" rx="10" fill="${theme.chrome}" />
  <circle cx="${padding + 18}" cy="${padding + 17}" r="5" fill="#ef4444" />
  <circle cx="${padding + 36}" cy="${padding + 17}" r="5" fill="#f59e0b" />
  <circle cx="${padding + 54}" cy="${padding + 17}" r="5" fill="#22c55e" />
  <text x="${padding + 76}" y="${padding + 22}" fill="${theme.muted}" font-family="Inter, system-ui, sans-serif" font-size="13">${escapeXml(title)}</text>
  ${codeLines}
</svg>`;

  return {
    svg,
    dataUrl: `data:image/svg+xml;base64,${toBase64(svg)}`,
    width,
    height,
    lineCount: lines.length
  };
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function toBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
