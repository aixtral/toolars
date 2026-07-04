export interface HtmlPreviewInput {
  html: string;
  css?: string;
  javascript?: string;
}

export interface HtmlPreviewWarning {
  type: "script-review" | "external-asset";
  message: string;
}

export interface HtmlPreviewResult {
  success: boolean;
  srcDoc: string;
  warnings: HtmlPreviewWarning[];
  stats: {
    htmlCharacters: number;
    cssCharacters: number;
    javascriptCharacters: number;
    scripts: number;
  };
  privacyNote: string;
}

const privacyNote = "Preview markup is assembled locally and rendered in a sandboxed iframe.";

export function buildHtmlPreview({ html, css = "", javascript = "" }: HtmlPreviewInput): HtmlPreviewResult {
  const safeJs = javascript.replace(/<\/script>/gi, "<\\/script>");
  const warnings: HtmlPreviewWarning[] = [];
  if (javascript.trim()) warnings.push({ type: "script-review", message: "Review scripts before trusting preview behavior." });
  if (/(src|href)=["']https?:\/\//i.test(html)) {
    warnings.push({ type: "external-asset", message: "Preview references external assets." });
  }

  const srcDoc = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${css.trim() ? `<style>\n${css}\n  </style>` : ""}
</head>
<body>
${html}
${safeJs.trim() ? `<script>\n${safeJs}\n<\/script>` : ""}
</body>
</html>`;

  return {
    success: html.trim().length > 0 || css.trim().length > 0 || javascript.trim().length > 0,
    srcDoc,
    warnings,
    stats: {
      htmlCharacters: html.length,
      cssCharacters: css.length,
      javascriptCharacters: javascript.length,
      scripts: javascript.trim() ? 1 : 0
    },
    privacyNote
  };
}
